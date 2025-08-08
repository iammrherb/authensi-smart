import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DocumentationCrawlerService } from "@/services/DocumentationCrawlerService";
import { useVendors } from "@/hooks/useVendors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const VendorsDocsCrawlerPanel = () => {
  const { data: vendors, isLoading } = useVendors();
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{ totalSeeds: number; totalItems?: number } | null>(null);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraSeeds, setExtraSeeds] = useState("");
  const [includePatterns, setIncludePatterns] = useState("");
  const [excludePatterns, setExcludePatterns] = useState("");
  const [maxPages, setMaxPages] = useState(10);

  const handleCrawl = async () => {
    if (!vendors || vendors.length === 0) {
      toast({ title: "No vendors", description: "No vendors found to crawl.", variant: "destructive" });
      return;
    }

    const vendorNames = vendors.map((v) => v.vendor_name).filter(Boolean);
    setRunning(true);
    setLastResult(null);

    try {
      const extraSeedsArr = extraSeeds
        .split(/\n|,/) // newline or comma separated
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const includeArr = includePatterns
        .split(/\n|,/) // newline or comma separated
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const excludeArr = excludePatterns
        .split(/\n|,/) // newline or comma separated
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await DocumentationCrawlerService.crawlPortnoxDocsForVendors(vendorNames, maxPages, {
        extraSeeds: extraSeedsArr,
        includePatterns: includeArr,
        excludePatterns: excludeArr,
      });
      if (!res.success) {
        if ((res as any).missingSecret) {
          toast({
            title: "Firecrawl key required",
            description: "Add FIRECRAWL_API_KEY in Supabase Edge Function Secrets and try again.",
            variant: "destructive",
          });
        } else {
          toast({ title: "Crawler", description: (res as any).message || "Failed to crawl", variant: "destructive" });
        }
        return;
      }

      const aggregated = (res as any).data?.aggregated || [];
      setLastResult({ totalSeeds: (res as any).data?.totalSeeds || 0, totalItems: aggregated.length });
      toast({ title: "Crawl complete", description: `Seeds: ${(res as any).data?.totalSeeds}, Items: ${aggregated.length}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to run crawler", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="mt-10">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Enrich Vendor Docs</h2>
            <p className="text-muted-foreground mt-1">
              Crawl Portnox documentation for all listed vendors and optionally include additional vendor sites or patterns.
            </p>
          </div>
          <Button onClick={handleCrawl} disabled={isLoading || running} variant="glow">
            {running ? "Crawling..." : "Crawl Docs"}
          </Button>
        </div>

        {/* Advanced options */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="text-sm text-primary hover:underline"
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? "Hide advanced" : "Show advanced"}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm">Max pages per seed</label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value) || 10)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm">Additional seed URLs (one per line or comma separated)</label>
                <Textarea
                  placeholder="https://docs.vendor.com/; https://kb.vendor.com/"
                  value={extraSeeds}
                  onChange={(e) => setExtraSeeds(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Include path patterns (comma or newline)</label>
                <Textarea
                  placeholder="/radius, /802.1x, /tacacs, /radsec, /coa"
                  value={includePatterns}
                  onChange={(e) => setIncludePatterns(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Exclude path patterns (comma or newline)</label>
                <Textarea
                  placeholder="/blog, /careers, /press"
                  value={excludePatterns}
                  onChange={(e) => setExcludePatterns(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {lastResult && (
          <div className="mt-4 text-sm text-muted-foreground">
            Last run: {lastResult.totalSeeds} seeds, {lastResult.totalItems ?? 0} result items.
          </div>
        )}
      </Card>
    </section>
  );
};
