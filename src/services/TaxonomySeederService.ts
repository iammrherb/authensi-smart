import { supabase } from "@/integrations/supabase/client";

export type SeedableDataset =
  | "authentication_methods"
  | "device_types"
  | "business_domains"
  | "deployment_types"
  | "industry_options"
  | "network_segments"
  | "compliance_frameworks"
  | "vendor_library"
  | "vendor_models"
  | "use_case_library"
  | "config_templates"
  | "expanded_vendor_library";

export class TaxonomySeederService {
  static async seed(datasets?: SeedableDataset[]) {
    const { data, error } = await supabase.functions.invoke("seed-taxonomy", {
      body: { datasets },
    });
    if (error) throw new Error(error.message || "Failed to seed taxonomy");
    return data as { success: boolean; summary: Record<string, { inserted: number; skipped: number }> };
  }
}
