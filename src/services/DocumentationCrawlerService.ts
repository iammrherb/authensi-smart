import { supabase } from "@/integrations/supabase/client";

export class DocumentationCrawlerService {
  static async crawlPortnoxDocsForVendors(
    vendorNames: string[],
    maxPages = 10,
    options?: { extraSeeds?: string[]; includePatterns?: string[]; excludePatterns?: string[] }
  ) {
    // 1) Get Portnox documentation links for provided vendors
    const scraper = await supabase.functions.invoke("portnox-doc-scraper", {
      body: { vendors: vendorNames },
    });

    if (scraper.error) {
      throw new Error(scraper.error.message || "Failed to fetch Portnox documentation links");
    }

    const linksRecord = (scraper.data?.documentationLinks || {}) as Record<string, string[]>;
    const urls = Array.from(
      new Set(
        [
          ...Object.values(linksRecord).flat().filter((u) => typeof u === "string" && u.length > 0),
          ...(options?.extraSeeds || []).filter((u) => typeof u === "string" && u.length > 0),
        ]
      )
    );

    if (urls.length === 0) {
      return { success: false, message: "No documentation links discovered for the selected vendors." };
    }

    // 2) Crawl discovered URLs using the documentation-crawler (Firecrawl-backed)
    const crawl = await supabase.functions.invoke("documentation-crawler", {
      body: { urls, maxPages, includePatterns: options?.includePatterns, excludePatterns: options?.excludePatterns },
    });

    if (crawl.error) {
      // If secret missing, return a clearer message
      const detail = crawl.error.message || "Failed to crawl documentation";
      if (/FIRECRAWL_API_KEY/i.test(detail)) {
        return {
          success: false,
          message: "FIRECRAWL_API_KEY is missing in Edge Function Secrets.",
          missingSecret: true,
        };
      }
      throw new Error(detail);
    }

    return { success: true, data: crawl.data };
  }
}
