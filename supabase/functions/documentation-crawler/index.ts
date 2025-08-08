// deno-lint-ignore-file no-explicit-any
// Documentation crawler Edge Function: crawls provided URLs using Firecrawl and returns aggregated results
// Requires FIRECRAWL_API_KEY to be set in Supabase Edge Function Secrets
// CORS-enabled

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CrawlRequestBody {
  urls: string[];
  maxPages?: number; // per seed url
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing FIRECRAWL_API_KEY secret. Please add it in Edge Function Secrets.",
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: CrawlRequestBody = await req.json();
    const { urls, maxPages = 10 } = body || {};

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide a non-empty 'urls' array" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const limited = Math.max(1, Math.min(50, Math.floor(maxPages)));

    const results: any[] = [];
    for (const url of urls) {
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/crawl", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            limit: limited,
            scrapeOptions: {
              formats: ["markdown", "html"],
            },
          }),
        });

        const data = await res.json();
        results.push({ sourceUrl: url, success: res.ok && data?.success !== false, data });
      } catch (err) {
        results.push({ sourceUrl: url, success: false, error: (err as Error).message });
      }
    }

    const response = {
      success: true,
      totalSeeds: urls.length,
      limitPerSeed: limited,
      aggregated: results,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
