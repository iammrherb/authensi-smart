import { supabase } from "@/integrations/supabase/client";
import { unifiedTemplates, type BaseTemplate } from "@/data/unifiedTemplates";

export class UnifiedTemplateSeederService {
  static async seedAll(): Promise<{ inserted: number; skipped: number }> {
    let inserted = 0;
    let skipped = 0;

    for (const template of unifiedTemplates) {
      // Check if template exists by name and vendor/model
      const { data: existing } = await supabase
        .from("configuration_templates")
        .select("id")
        .eq("name", template.name)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const payload = {
        name: template.name,
        description: template.description,
        category: template.category,
        subcategory: template.subcategory,
        configuration_type: "CLI",
        complexity_level: template.complexity_level,
        template_content: template.content,
        template_variables: (template as any).variables || {},
        supported_scenarios: template.use_cases || [],
        security_features: template.tags || [],
        troubleshooting_guide: (template as any).troubleshooting || [],
        validation_commands: (template as any).validation_commands || [],
        compatibility_matrix: (template as any).compatibility_matrix || [],
        is_validated: true,
        is_public: true,
        tags: template.tags || [],
        template_source: "library",
      } as any;

      const { error } = await supabase.from("configuration_templates").insert([payload] as any);
      if (error) {
        console.error(`Failed to insert template ${template.name}:`, error);
        continue;
      }

      inserted++;
    }

    return { inserted, skipped };
  }
}

export default UnifiedTemplateSeederService;