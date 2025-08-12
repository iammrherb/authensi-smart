import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProxyRequest {
  action?:
    | "test"
    | "listDevices"
    | "listSites"
    | "listGroups"
    | "createSite"
    | "createNAS"
    | "fetchSpec"
    | "proxy";
  method?: string;
  path?: string; // e.g. "/devices"
  query?: Record<string, string | number | boolean>;
  body?: any;
  projectId?: string | null;
  credentialId?: string | null;
  directToken?: string | null;
  base?: string | null;
}

function buildUrl(base: string, path = "/", query?: Record<string, any>) {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, base);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

// Spec cache and helpers derived from the official doc
let SPEC_CACHE: any = null;
let SPEC_CACHE_TS = 0;
const SPEC_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchOpenApiSpec(): Promise<any> {
  const now = Date.now();
  if (SPEC_CACHE && now - SPEC_CACHE_TS < SPEC_TTL_MS) return SPEC_CACHE;
  const res = await fetch('https://clear.portnox.com/restapi/doc', { method: 'GET' });
  const text = await res.text();
  let spec: any = null;
  try { spec = text ? JSON.parse(text) : null; } catch { spec = null; }
  SPEC_CACHE = spec;
  SPEC_CACHE_TS = now;
  return spec;
}

function trimTrailingSlash(s: string) {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

function deriveBaseFromSpec(spec: any): { base: string; source: string; basePath: string } {
  let base = 'https://clear.portnox.com/restapi';
  let source = 'default';
  let basePath = '';
  if (spec) {
    if (Array.isArray(spec.servers) && spec.servers[0]?.url) {
      base = spec.servers[0].url;
      source = 'swagger.servers';
      try {
        const u = new URL(base);
        basePath = u.pathname === '/' ? '' : u.pathname;
      } catch {}
    } else if (spec.host) {
      const scheme = Array.isArray(spec.schemes) && spec.schemes.length ? spec.schemes[0] : 'https';
      basePath = spec.basePath || '';
      base = `${scheme}://${spec.host}${basePath}`;
      source = 'swagger.host';
    } else if (spec.basePath) {
      basePath = spec.basePath;
      base = `https://clear.portnox.com${basePath}`;
      source = 'swagger.basePath';
    }
  }
  return { base: trimTrailingSlash(base), source, basePath };
}

function adjustPathForBase(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const baseHasRestapi = /\/restapi\/?$/i.test(base);
  const pathHasRestapi = /^\/restapi(\/|$)/i.test(p);
  if (baseHasRestapi && pathHasRestapi) {
    // remove the duplicated /restapi from the path
    return p.replace(/^\/restapi/i, '') || '/';
  }
  if (!baseHasRestapi && !pathHasRestapi) {
    return `/restapi${p}`;
  }
  return p;
}

function buildPathMatchers(pathsObj: Record<string, any>, basePath = '') {
  const keys = Object.keys(pathsObj || {});
  const regexes = keys.map((k) => {
    const normalized = (k.startsWith('/') ? k : `/${k}`).replace(/\{[^}]+\}/g, '[^/]+');
    // ensure we match the path AFTER stripping basePath
    const pattern = `^${normalized.replace(/\//g, '/')}(?:$|[?])`;
    return new RegExp(pattern);
  });
  return { keys, regexes, basePath };
}

async function getSpecInfo() {
  const spec = await fetchOpenApiSpec();
  const { base, source, basePath } = deriveBaseFromSpec(spec);
  const matchers = buildPathMatchers(spec?.paths || {}, basePath);
  return { spec, base, baseSource: source, basePath, matchers };
}

async function getOpenApiBase(): Promise<{ base: string; source: string }> {
  try {
    const info = await getSpecInfo();
    return { base: info.base, source: info.baseSource };
  } catch {
    return { base: 'https://clear.portnox.com/restapi', source: 'default' };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const fallbackBase = Deno.env.get("PORTNOX_BASE_URL") || "https://clear.portnox.com/restapi";
    const fallbackToken = Deno.env.get("PORTNOX_API_TOKEN");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase credentials:", { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey });
      return new Response(
        JSON.stringify({ error: "Missing Supabase service credentials in environment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const payload = (await req.json().catch(() => ({}))) as ProxyRequest & {
      projectId?: string | null;
      credentialId?: string | null;
    };
    const action = payload.action || "proxy";
    const debug = !!(payload as any).debug;

    async function resolveCredentials() {
      const defaultBaseInfo = await getOpenApiBase();
      const defaultBase = defaultBaseInfo.base;

      // If a direct (temporary) token is provided in the request, use it without storing
      const anyPayload = payload as any;
      if (anyPayload?.directToken) {
        let directBase = (anyPayload.base as string | undefined) || defaultBase || fallbackBase;
        // Adjust common non-API bases to the API base from Swagger
        if (/CloudPortalBackEnd|:8081/.test(directBase)) {
          directBase = defaultBase;
        }
        return { base: directBase, token: String(anyPayload.directToken), baseSource: "direct" };
      }

      // If a credentialId is provided, use it directly
      if (payload.credentialId) {
        const { data, error } = await supabase
          .from("portnox_credentials")
          .select("id, base_url, api_token, is_active")
          .eq("id", payload.credentialId)
          .maybeSingle();
        if (error) throw error;
        if (data) return { base: data.base_url || defaultBase || fallbackBase, token: data.api_token, baseSource: "credential" };
      }

      // If a projectId is provided, get the latest active credential for that project
      if (payload.projectId) {
        const { data, error } = await supabase
          .from("portnox_credentials")
          .select("id, base_url, api_token, is_active, updated_at")
          .eq("project_id", payload.projectId)
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (data) return { base: data.base_url || defaultBase || fallbackBase, token: data.api_token, baseSource: "project" };
      }

      // Fallback to a global active credential (project_id IS NULL)
      const { data: globalCred, error: globalErr } = await supabase
        .from("portnox_credentials")
        .select("id, base_url, api_token, is_active, updated_at")
        .is("project_id", null)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (globalErr) throw globalErr;
      if (globalCred) return { base: globalCred.base_url || defaultBase || fallbackBase, token: globalCred.api_token, baseSource: "global" };

      // Finally, fall back to environment secrets if present
      if (!fallbackToken) {
        return { base: defaultBase || fallbackBase, token: undefined, baseSource: "default-no-token" } as { base: string; token: string | undefined; baseSource: string };
      }
      return { base: defaultBase || fallbackBase, token: fallbackToken, baseSource: "env" };
    }

    const { base: API_BASE, token: TOKEN, baseSource } = await resolveCredentials();

    if (!TOKEN) {
      console.error("No Portnox API token available");
      return new Response(
        JSON.stringify({ error: "No Portnox API token available (DB or env). Add credentials first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "X-API-Key": TOKEN,
    };

    async function forward(method: string, path: string, query?: Record<string, any>, body?: any) {
      const adjustedPath = adjustPathForBase(API_BASE, path);
      // Validate against OpenAPI spec paths
      const { matchers, basePath: specBasePath } = await getSpecInfo();
      const effectiveBasePath = specBasePath || (/\/restapi\/?$/i.test(API_BASE) ? '/restapi' : '');
      let relative = adjustedPath;
      if (effectiveBasePath && relative.toLowerCase().startsWith(effectiveBasePath.toLowerCase())) {
        relative = relative.slice(effectiveBasePath.length) || '/';
      }
      if (!relative.startsWith('/')) relative = `/${relative}`;
      const allowed = matchers.regexes.some((rx) => rx.test(relative));
      if (!allowed) {
        return new Response(
          JSON.stringify({ error: `Path not allowed by OpenAPI spec: ${relative}`, adjustedPath, effectiveBasePath }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const cleanPath = adjustedPath.replace(/^\//, "");
      const url = buildUrl(API_BASE, cleanPath, query);
      const hasBody = !["GET", "HEAD"].includes(method.toUpperCase()) && body !== undefined && body !== null;
      const res = await fetch(url, {
        method,
        headers,
        body: hasBody ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
      });
      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
      const responsePayload: any = { status: res.status, data };
      if (debug || !res.ok) {
        responsePayload.request = {
          method,
          url,
          path: adjustedPath,
          originalPath: path,
          query,
          body,
          headers: { Authorization: "Bearer ****", "X-API-Key": "****" },
          baseUsed: API_BASE,
          baseSource,
          validatedRelativePath: relative,
        };
        responsePayload.upstream = {
          ok: res.ok,
          status: res.status,
          headers: Object.fromEntries(res.headers.entries()),
        };
      }
      return new Response(JSON.stringify(responsePayload), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "test": {
        return await forward("GET", "/restapi/devices", { limit: 1 });
      }
      case "listDevices": {
        const { query } = payload;
        return await forward("GET", "/restapi/devices", query);
      }
      case "listSites": {
        const { query } = payload;
        return await forward("GET", "/restapi/sites", query);
      }
      case "listGroups": {
        const { query } = payload;
        return await forward("GET", "/restapi/groups", query);
      }
      case "createSite": {
        const { body } = payload;
        return await forward("POST", "/restapi/sites", undefined, body);
      }
      case "createNAS": {
        const { body } = payload;
        return await forward("POST", "/restapi/nas", undefined, body);
      }
      case "fetchSpec": {
        // Fetch the OpenAPI spec from the documented public endpoint regardless of base
        const spec = await fetchOpenApiSpec();
        const { base, source, basePath } = deriveBaseFromSpec(spec);
        return new Response(JSON.stringify({ status: 200, data: spec, meta: { derivedBase: base, basePath, source } }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "proxy":
      default: {
        const { method = "GET", path = "/restapi/devices", query, body } = payload;
        return await forward(method, path, query, body);
      }
    }
  } catch (e) {
    console.error("portnox-api error", e);
    console.error("Stack trace:", e?.stack);
    return new Response(
      JSON.stringify({ 
        error: String(e?.message || e),
        details: e?.stack ? e.stack.substring(0, 500) : undefined 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
