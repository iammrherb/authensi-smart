import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { TaxonomySeederService, type SeedableDataset } from "@/services/TaxonomySeederService";
import { EnhancedTaxonomyService, type EnhancedSeedableDataset } from "@/services/EnhancedTaxonomyService";
import { useHasRole } from "@/hooks/useUserRoles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedTemplateSeederService from "@/services/UnifiedTemplateSeederService";

const BASIC_DATASETS: { id: SeedableDataset; label: string }[] = [
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

const ENHANCED_DATASETS: { id: EnhancedSeedableDataset; label: string; description: string }[] = [
  { id: "enhanced_vendors", label: "Enhanced Vendor Ecosystem", description: "Comprehensive vendor data with integration details, models, firmware versions" },
  { id: "vendor_models", label: "Vendor Models & Firmware", description: "Detailed model specifications, capabilities, and firmware compatibility" },
  { id: "pain_points_library", label: "Enhanced Pain Points", description: "Industry-specific challenges and recommended solutions" },
  { id: "security_levels", label: "Security Classification", description: "Security level taxonomies and risk assessments" },
  { id: "project_phases", label: "Project Lifecycle Phases", description: "Standardized project phases for NAC implementations" },
  { id: "compliance_frameworks", label: "Enhanced Compliance", description: "Comprehensive compliance frameworks with detailed requirements" },
  { id: "industry_options", label: "Industry Verticals", description: "Expanded industry categories with specific requirements" },
  { id: "authentication_methods", label: "Advanced Authentication", description: "Modern authentication methods and workflows" },
  { id: "network_segments", label: "Network Architecture", description: "Advanced network segmentation patterns and architectures" },
  { id: "device_types", label: "Device Ecosystem", description: "Comprehensive device types with capabilities and integration details" }
];

const TaxonomySeederPanel = () => {
  const { toast } = useToast();
  const { data: isAdmin } = useHasRole("super_admin", "global");
  const [basicSelected, setBasicSelected] = useState<SeedableDataset[]>(BASIC_DATASETS.map(d => d.id));
  const [enhancedSelected, setEnhancedSelected] = useState<EnhancedSeedableDataset[]>(ENHANCED_DATASETS.map(d => d.id));
  const [running, setRunning] = useState(false);
  const [enhancedRunning, setEnhancedRunning] = useState(false);
  const [summary, setSummary] = useState<Record<string, { inserted: number; skipped: number }> | null>(null);
  const [enhancedSummary, setEnhancedSummary] = useState<Record<string, { inserted: number; skipped: number }> | null>(null);

  const toggleBasic = (id: SeedableDataset) => {
    setBasicSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleEnhanced = (id: EnhancedSeedableDataset) => {
    setEnhancedSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const runBasic = async () => {
    try {
      setRunning(true);
      setSummary(null);
      const res = await TaxonomySeederService.seed(basicSelected);
      setSummary(res.summary);
      toast({ title: "Basic seeding complete", description: "Taxonomy datasets updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to seed taxonomy", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const runUnifiedTemplates = async () => {
    try {
      setRunning(true);
      const res = await UnifiedTemplateSeederService.seedAll();
      toast({ title: "Library templates imported", description: `Templates imported: ${res.inserted}, skipped: ${res.skipped}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to import library templates", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const runEnhanced = async () => {
    try {
      setEnhancedRunning(true);
      setEnhancedSummary(null);
      const res = await EnhancedTaxonomyService.seedEnhanced(enhancedSelected);
      setEnhancedSummary(res.summary);
      toast({ title: "Enhanced seeding complete", description: "Enhanced taxonomy datasets updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to seed enhanced taxonomy", variant: "destructive" });
    } finally {
      setEnhancedRunning(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Enhanced Taxonomy Management</h2>
        <p className="text-muted-foreground mt-2">Seed and enrich comprehensive datasets for vendors, compliance, and network architecture</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Datasets</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced Datasets</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Basic Taxonomy Seeding</h3>
                <p className="text-muted-foreground mt-1">Insert curated baseline datasets and avoid duplicates.</p>
              </div>
              <Button variant="glow" onClick={runBasic} disabled={running} aria-label="Seed basic datasets">
                {running ? "Seeding..." : "Seed Selected"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BASIC_DATASETS.map(ds => (
                <label key={ds.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={basicSelected.includes(ds.id)} onCheckedChange={() => toggleBasic(ds.id)} />
                  <span>{ds.label}</span>
                </label>
              ))}
            </div>

            {summary && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Basic Seeding Results:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(summary).map(([k, v]) => (
                    <div key={k}>
                      <strong>{k}:</strong> inserted {v.inserted}, skipped {v.skipped}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="enhanced" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Enhanced Taxonomy Seeding</h3>
                <p className="text-muted-foreground mt-1">Comprehensive datasets with AI enrichment, vendor models, and detailed taxonomies.</p>
              </div>
              <Button variant="glow" onClick={runEnhanced} disabled={enhancedRunning} aria-label="Seed enhanced datasets">
                {enhancedRunning ? "Enriching..." : "Seed Enhanced"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {ENHANCED_DATASETS.map(ds => (
                <Card key={ds.id} className="p-4 border-l-4 border-l-primary">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox 
                      checked={enhancedSelected.includes(ds.id)} 
                      onCheckedChange={() => toggleEnhanced(ds.id)}
                      className="mt-1" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{ds.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{ds.description}</div>
                    </div>
                  </label>
                </Card>
              ))}
            </div>

            {enhancedSummary && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Enhanced Seeding Results:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(enhancedSummary).map(([k, v]) => (
                    <div key={k}>
                      <strong>{k}:</strong> inserted {v.inserted}, skipped {v.skipped}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxonomySeederPanel;
