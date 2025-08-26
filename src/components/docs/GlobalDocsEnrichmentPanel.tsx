import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedVendors } from "@/hooks/useUnifiedVendors";
import { DocumentationCrawlerService } from "@/services/DocumentationCrawlerService";

interface CategoryOption {
  id: string;
  label: string;
  seeds: string[];
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: "vendors-core",
    label: "Core Network Vendors (Switch/Wireless/NAC)",
    seeds: [
      "https://www.cisco.com/c/en/us/support/docs.html",
      "https://www.cisco.com/c/en/us/support/unified-communications/identity-services-engine-ise/",
      "https://www.arubanetworks.com/techdocs/",
      "https://www.juniper.net/documentation/",
      "https://docs.extremenetworks.com/",
      "https://www.arista.com/en/support/product-documentation",
      "https://www.dell.com/support/home/en-us",
      "https://help.ubnt.com/hc/en-us",
      "https://www.fortinet.com/resources-catalog/document-library",
      "https://docs.paloaltonetworks.com/",
      "https://support.checkpoint.com/",
      "https://support.f5.com/csp/knowledge-center"
    ]
  },
  {
    id: "mdm",
    label: "MDM/UEM",
    seeds: [
      "https://learn.microsoft.com/intune/",
      "https://docs.jamf.com/",
      "https://docs.vmware.com/en/VMware-Workspace-ONE-UEM/",
      "https://support.mobileiron.com/"
    ]
  },
  {
    id: "mfa-sso-idp",
    label: "MFA / SSO / IdP",
    seeds: [
      "https://help.okta.com/",
      "https://learn.microsoft.com/entra/",
      "https://duo.com/docs",
      "https://docs.pingidentity.com/",
      "https://auth0.com/docs",
      "https://support.google.com/a/"
    ]
  },
  {
    id: "edr-siem",
    label: "EDR / SIEM / MDR",
    seeds: [
      "https://www.crowdstrike.com/resources/",
      "https://learn.microsoft.com/defender/",
      "https://support.sentinelone.com/",
      "https://docs.splunk.com/",
      "https://www.ibm.com/docs/en/qradar/"
    ]
  },
  {
    id: "vpn-firewall",
    label: "VPN / Firewall",
    seeds: [
      "https://community.cisco.com/t5/security-documents/tkb-p/security-documents",
      "https://docs.paloaltonetworks.com/globalprotect",
      "https://docs.fortinet.com/product/forticlient",
      "https://support.checkpoint.com/results/sk/sk100575"
    ]
  },
  {
    id: "radius-ecosystem",
    label: "RADIUS / 802.1X / TACACS+ / RADSEC",
    seeds: [
      "https://wiki.freeradius.org/",
      "https://www.cisco.com/c/en/us/support/security/secure-access-control-system/tsd-products-support-series-home.html",
      "https://www.arubanetworks.com/techdocs/ClearPass/",
      "https://datatracker.ietf.org/wg/radext/documents/",
      "https://www.ietf.org/",
      "https://www.rfc-editor.org/"
    ]
  }
];

export const GlobalDocsEnrichmentPanel = () => {
  const { data: vendors } = useUnifiedVendors({});
  const { toast } = useToast();

  const [running, setRunning] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "vendors-core",
    "radius-ecosystem",
    "mfa-sso-idp",
  ]);

  const [extraSeeds, setExtraSeeds] = useState("");
  const [includePatterns, setIncludePatterns] = useState(
    "/radius, /802.1x, /dot1x, /tacacs, /radsec, /coa, /reauth, /vlan, /multi, /mab, /vsas, /debug, /troubleshoot, /best-practices, /configuration, /guide, /admin, /policy"
  );
  const [excludePatterns, setExcludePatterns] = useState("/blog, /news, /press, /events, /careers, /marketing");

  const [lastResult, setLastResult] = useState<{
    seeds: number;
    items: number;
  } | null>(null);

  const curatedSeeds = useMemo(() => {
    const chosen = CATEGORY_OPTIONS.filter((c) => selectedCategories.includes(c.id));
    return chosen.flatMap((c) => c.seeds);
  }, [selectedCategories]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRun = async () => {
    try {
      setRunning(true);
      setLastResult(null);

      const vendorNames = (vendors || []).map((v: any) => v.name).filter(Boolean);

      const extraSeedsArr = extraSeeds
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const includeArr = includePatterns
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const excludeArr = excludePatterns
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const allOtherSeeds = Array.from(new Set([...curatedSeeds, ...extraSeedsArr]));

      const [portnoxRes, otherRes] = await Promise.all([
        DocumentationCrawlerService.crawlPortnoxDocsForVendors(vendorNames, maxPages, {
          includePatterns: includeArr,
          excludePatterns: excludeArr,
          extraSeeds: extraSeedsArr,
        }),
        DocumentationCrawlerService.crawlDocs(allOtherSeeds, maxPages, {
          includePatterns: includeArr,
          excludePatterns: excludeArr,
        })
      ]);

      if (portnoxRes.success === false && (portnoxRes as any).missingSecret) {
        toast({
          title: "Firecrawl key required",
          description: "Add FIRECRAWL_API_KEY in Supabase Edge Function Secrets and try again.",
          variant: "destructive",
        });
        return;
      }

      if ((otherRes as any)?.success === false && (otherRes as any).missingSecret) {
        toast({
          title: "Firecrawl key required",
          description: "Add FIRECRAWL_API_KEY in Supabase Edge Function Secrets and try again.",
          variant: "destructive",
        });
        return;
      }

      const pnAgg = (portnoxRes as any)?.data?.aggregated || [];
      const otherAgg = (otherRes as any)?.data?.aggregated || [];

      const totalSeeds = ((portnoxRes as any)?.data?.totalSeeds || 0) + ((otherRes as any)?.data?.totalSeeds || 0);
      const totalItems = pnAgg.length + otherAgg.length;

      setLastResult({ seeds: totalSeeds, items: totalItems });
      toast({
        title: "Global enrichment complete",
        description: `Seeds: ${totalSeeds}, Items: ${totalItems}`,
      });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to run enrichment", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="mt-10">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Global Docs Enrichment</h2>
            <p className="text-muted-foreground mt-1">
              Crawl Portnox and broader vendor ecosystems (MDM, MFA/SSO/IdP, EDR/SIEM, VPN/Firewall, RADIUS/802.1X) to enrich use cases,
              requirements, best practices, models/firmware, and config references.
            </p>
          </div>
          <Button onClick={handleRun} disabled={running} variant="glow">
            {running ? "Enriching..." : "Run Global Enrichment"}
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium">Categories</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedCategories.includes(opt.id)}
                    onCheckedChange={() => toggleCategory(opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Max pages per seed</label>
            <Input type="number" min={1} max={50} value={maxPages} onChange={(e) => setMaxPages(Number(e.target.value) || 10)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm">Additional seed URLs (comma or newline)</label>
            <Textarea
              placeholder="https://docs.vendor.com/; https://kb.vendor.com/"
              value={extraSeeds}
              onChange={(e) => setExtraSeeds(e.target.value)}
            />
          </div>
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
                <label className="text-sm">Include path patterns</label>
                <Textarea
                  placeholder="/radius, /802.1x, /tacacs, /radsec, /coa"
                  value={includePatterns}
                  onChange={(e) => setIncludePatterns(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Exclude path patterns</label>
                <Textarea
                  placeholder="/blog, /careers, /press, /events"
                  value={excludePatterns}
                  onChange={(e) => setExcludePatterns(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {lastResult && (
          <div className="mt-4 text-sm text-muted-foreground">
            Last run: {lastResult.seeds} seeds, {lastResult.items} result items.
          </div>
        )}
      </Card>
    </section>
  );
};
