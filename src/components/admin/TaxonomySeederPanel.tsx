import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { TaxonomySeederService, type SeedableDataset } from "@/services/TaxonomySeederService";
import { useHasRole } from "@/hooks/useUserRoles";

const DATASETS: { id: SeedableDataset; label: string }[] = [
  { id: "authentication_methods", label: "Authentication Methods" },
  { id: "device_types", label: "Device Types" },
  { id: "business_domains", label: "Business Domains" },
  { id: "deployment_types", label: "Deployment Types" },
  { id: "industry_options", label: "Industry Options" },
  { id: "network_segments", label: "Network Segments" },
  { id: "compliance_frameworks", label: "Compliance Frameworks" },
  { id: "vendor_library", label: "Vendor Library" },
  { id: "use_case_library", label: "Use Case Library" },
  { id: "config_templates", label: "Configuration Templates" },
];

const TaxonomySeederPanel = () => {
  const { toast } = useToast();
  const { data: isAdmin } = useHasRole("super_admin", "global");
  const [selected, setSelected] = useState<SeedableDataset[]>(DATASETS.map(d => d.id));
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<Record<string, { inserted: number; skipped: number }> | null>(null);

  const toggle = (id: SeedableDataset) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const run = async () => {
    try {
      setRunning(true);
      setSummary(null);
      const res = await TaxonomySeederService.seed(selected);
      setSummary(res.summary);
      toast({ title: "Seeding complete", description: "Taxonomy datasets updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to seed taxonomy", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Seed Taxonomy Datasets</h2>
          <p className="text-muted-foreground mt-1">Insert curated baseline datasets and avoid duplicates.</p>
        </div>
        <Button variant="glow" onClick={run} disabled={running} aria-label="Seed datasets">
          {running ? "Seeding..." : "Seed Selected"}
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DATASETS.map(ds => (
          <label key={ds.id} className="flex items-center gap-2 text-sm">
            <Checkbox checked={selected.includes(ds.id)} onCheckedChange={() => toggle(ds.id)} />
            <span>{ds.label}</span>
          </label>
        ))}
      </div>

      {summary && (
        <div className="mt-4 text-sm text-muted-foreground">
          {Object.entries(summary).map(([k, v]) => (
            <div key={k}>
              {k}: inserted {v.inserted}, skipped {v.skipped}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TaxonomySeederPanel;
