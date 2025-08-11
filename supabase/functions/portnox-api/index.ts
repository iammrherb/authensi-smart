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
    | "proxy";
  method?: string;
  path?: string; // e.g. "/devices"
  query?: Record<string, string | number | boolean>;
  body?: any;
  projectId?: string | null;
  credentialId?: string | null;
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

const ALLOWED_PREFIXES = [
  "api",
  "devices",
  "sites",
  "nas",
  "groups",
  "endpoints",
  "policies",
  "system",
  "doc",
];

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

    async function resolveCredentials() {
      // If a credentialId is provided, use it directly
      if (payload.credentialId) {
        const { data, error } = await supabase
          .from("portnox_credentials")
          .select("id, base_url, api_token, is_active")
          .eq("id", payload.credentialId)
          .maybeSingle();
        if (error) throw error;
        if (data) return { base: data.base_url || fallbackBase, token: data.api_token };
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
        if (data) return { base: data.base_url || fallbackBase, token: data.api_token };
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
      if (globalCred) return { base: globalCred.base_url || fallbackBase, token: globalCred.api_token };

      // Finally, fall back to environment secrets if present
      if (!fallbackToken) {
        return { base: fallbackBase, token: undefined } as { base: string; token: string | undefined };
      }
      return { base: fallbackBase, token: fallbackToken };
    }

    const { base: API_BASE, token: TOKEN } = await resolveCredentials();

    if (!TOKEN) {
      console.error("No Portnox API token available");
      return new Response(
        JSON.stringify({ error: "No Portnox API token available (DB or env). Add credentials first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "X-API-Key": TOKEN,
    };

    async function forward(method: string, path: string, query?: Record<string, any>, body?: any) {
      const cleanPath = path.replace(/^\//, "");
      const allowed = ALLOWED_PREFIXES.some((p) => cleanPath.startsWith(p));
      if (!allowed) {
        return new Response(
          JSON.stringify({ error: `Path not allowed: ${path}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const url = buildUrl(API_BASE, cleanPath, query);
      const res = await fetch(url, {
        method,
        headers,
        body: ["GET", "HEAD"].includes(method.toUpperCase()) ? undefined : JSON.stringify(body ?? {}),
      });
      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
      return new Response(JSON.stringify({ status: res.status, data }), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "test": {
        return await forward("GET", "/devices", { limit: 1 });
      }
      case "listDevices": {
        const { query } = payload;
        return await forward("GET", "/devices", query);
      }
      case "listSites": {
        const { query } = payload;
        return await forward("GET", "/sites", query);
      }
      case "listGroups": {
        const { query } = payload;
        return await forward("GET", "/groups", query);
      }
      case "createSite": {
        const { body } = payload;
        return await forward("POST", "/sites", undefined, body);
      }
      case "createNAS": {
        const { body } = payload;
        return await forward("POST", "/nas", undefined, body);
      }
      case "proxy":
      default: {
        const { method = "GET", path = "/devices", query, body } = payload;
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
