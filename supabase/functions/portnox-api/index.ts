import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

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
  "devices",
  "sites",
  "nas",
  "groups",
  "endpoints",
  "policies",
  "system",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_BASE = Deno.env.get("PORTNOX_BASE_URL") || "https://clear.portnox.com/restapi";
    const TOKEN = Deno.env.get("PORTNOX_API_TOKEN");

    if (!TOKEN) {
      return new Response(
        JSON.stringify({ error: "Missing PORTNOX_API_TOKEN secret" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = (await req.json().catch(() => ({}))) as ProxyRequest;
    const action = payload.action || "proxy";

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "X-API-Key": TOKEN, // Some deployments expect X-API-Key
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
        // Probe a common resource; adjust if your tenant differs
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
        // Some APIs may name this differently, you can adjust to "/nas-devices"
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
    return new Response(
      JSON.stringify({ error: String(e?.message || e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
