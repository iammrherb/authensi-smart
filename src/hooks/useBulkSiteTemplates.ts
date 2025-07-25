import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BulkSiteTemplate {
  id: string;
  template_name: string;
  template_description?: string;
  csv_headers: string[];
  field_mappings: Record<string, string>;
  default_values: Record<string, any>;
  validation_rules: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useBulkSiteTemplates = () => {
  return useQuery({
    queryKey: ['bulk-site-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_site_templates')
        .select('*')
        .order('template_name', { ascending: true });
      
      if (error) throw error;
      return data as BulkSiteTemplate[];
    },
  });
};