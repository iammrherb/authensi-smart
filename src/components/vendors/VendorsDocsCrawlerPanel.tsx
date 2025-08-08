import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DocumentationCrawlerService } from "@/services/DocumentationCrawlerService";
import { useVendors } from "@/hooks/useVendors";

export const VendorsDocsCrawlerPanel = () => {
  const { data: vendors, isLoading } = useVendors();
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{ totalSeeds: number; totalItems?: number } | null>(null);

  const handleCrawl = async () => {
    if (!vendors || vendors.length === 0) {
      toast({ title: "No vendors", description: "No vendors found to crawl.", variant: "destructive" });
      return;
    }

    const vendorNames = vendors.map((v) => v.vendor_name).filter(Boolean);
    setRunning(true);
    setLastResult(null);

    try {
      const res = await DocumentationCrawlerService.crawlPortnoxDocsForVendors(vendorNames, 10);
      if (!res.success) {
        if (res.missingSecret) {
          toast({
            title: "Firecrawl key required",
            description: "Add FIRECRAWL_API_KEY in Supabase Edge Function Secrets and try again.",
            variant: "destructive",
          });
        } else {
          toast({ title: "Crawler", description: res.message || "Failed to crawl", variant: "destructive" });
        }
        return;
      }

      const aggregated = res.data?.aggregated || [];
      setLastResult({ totalSeeds: res.data?.totalSeeds || 0, totalItems: aggregated.length });
      toast({ title: "Crawl complete", description: `Seeds: ${res.data?.totalSeeds}, Items: ${aggregated.length}` });
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
              Crawl Portnox documentation for all listed vendors to collect references for configs, RADIUS/802.1X, TACACS, RADSEC, CoA and more.
            </p>
          </div>
          <Button onClick={handleCrawl} disabled={isLoading || running} variant="glow">
            {running ? "Crawling..." : "Crawl Portnox Docs"}
          </Button>
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
