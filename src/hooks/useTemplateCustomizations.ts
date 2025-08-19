import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TemplateCustomization {
  id: string;
  base_template_id: string;
  project_id?: string;
  site_id?: string;
  customization_name: string;
  customization_type: string;
  custom_content: string;
  custom_variables: Record<string, any>;
  modification_notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  version: number;
  is_active: boolean;
  base_template?: {
    name: string;
    category: string;
    vendor?: {
      vendor_name: string;
    };
  };
}

export const useTemplateCustomizations = (projectId?: string, siteId?: string) => {
  return useQuery({
    queryKey: ['template-customizations', projectId, siteId],
    queryFn: async () => {
      let query = supabase
        .from('template_customizations')
        .select(`
          *,
          base_template:configuration_templates(
            name,
            category,
            vendor:vendor_library(vendor_name)
          )
        `);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TemplateCustomization[];
    },
    enabled: !!(projectId || siteId),
  });
};

export const useCreateTemplateCustomization = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customization: Omit<TemplateCustomization, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('template_customizations')
        .insert([{
          ...customization,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
      toast({
        title: "Success",
        description: "Template customization created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create template customization: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTemplateCustomization = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TemplateCustomization> & { id: string }) => {
      const { data, error } = await supabase
        .from('template_customizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
      toast({
        title: "Success",
        description: "Template customization updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update template customization: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCloneTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ templateId, projectId, siteId }: { templateId: string; projectId?: string; siteId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Get the original template
      const { data: template, error: fetchError } = await supabase
        .from('configuration_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      // Create customization based on original template
      const { data, error } = await supabase
        .from('template_customizations')
        .insert([{
          base_template_id: templateId,
          project_id: projectId,
          site_id: siteId,
          customization_name: `${template.name} - Customized`,
          customization_type: 'clone',
          custom_content: template.template_content,
          custom_variables: template.template_variables || {},
          modification_notes: `Cloned from template: ${template.name}`,
          tags: template.tags || [],
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
      toast({
        title: "Success",
        description: "Template cloned and customized successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to clone template: " + error.message,
        variant: "destructive",
      });
    },
  });
};