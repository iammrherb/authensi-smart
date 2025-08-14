import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  industry: string;
  deployment_type: string;
  security_level: string;
  complexity: 'low' | 'medium' | 'high';
  estimated_duration: string;
  sites_supported: string;
  template_data: {
    use_cases: string[];
    requirements: string[];
    vendor_configurations: string[];
    timeline_template: Record<string, string>;
    deployment_phases: Array<{
      name: string;
      duration: string;
      deliverables: string[];
    }>;
    success_criteria: string[];
    risk_factors: string[];
    automation_level: string;
    compliance_frameworks: string[];
  };
  metadata: {
    usage_count: number;
    success_rate: number;
    last_used?: string;
    created_by?: string;
    tags: string[];
  };
  is_active: boolean;
  is_validated: boolean;
  validation_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useProjectTemplates = () => {
  return useQuery({
    queryKey: ['project-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as ProjectTemplate[];
    },
  });
};

export const useProjectTemplate = (id: string) => {
  return useQuery({
    queryKey: ['project-templates', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as ProjectTemplate | null;
    },
    enabled: !!id,
  });
};

export const useCreateProjectTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateData: Omit<ProjectTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('project_templates')
        .insert([{
          ...templateData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-templates'] });
      toast({
        title: "Success",
        description: "Project template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create project template: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProjectTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-templates'] });
      toast({
        title: "Success",
        description: "Project template updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update project template: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProjectTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-templates'] });
      toast({
        title: "Success",
        description: "Project template deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete project template: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectTemplatesByIndustry = (industry?: string) => {
  return useQuery({
    queryKey: ['project-templates', 'by-industry', industry],
    queryFn: async () => {
      let query = supabase
        .from('project_templates')
        .select('*')
        .eq('is_active', true);

      if (industry) {
        query = query.eq('industry', industry);
      }

      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) throw error;
      return data as ProjectTemplate[];
    },
  });
};

export const useProjectTemplatesByComplexity = (complexity?: string) => {
  return useQuery({
    queryKey: ['project-templates', 'by-complexity', complexity],
    queryFn: async () => {
      let query = supabase
        .from('project_templates')
        .select('*')
        .eq('is_active', true);

      if (complexity) {
        query = query.eq('complexity', complexity);
      }

      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) throw error;
      return data as ProjectTemplate[];
    },
  });
};

export const useBulkImportProjectTemplates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templates: Omit<ProjectTemplate, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const templatesWithCreator = templates.map(template => ({
        ...template,
        created_by: user.id,
      }));

      const { data, error } = await supabase
        .from('project_templates')
        .insert(templatesWithCreator)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-templates'] });
      toast({
        title: "Success",
        description: `${data?.length || 0} project templates imported successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to import project templates: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useIncrementTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      // Get current template to increment usage count
      const { data: template, error: fetchError } = await supabase
        .from('project_templates')
        .select('metadata')
        .eq('id', templateId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!template) throw new Error('Template not found');

      const currentMetadata = template.metadata || { usage_count: 0, success_rate: 0, tags: [] };
      const updatedMetadata = {
        ...currentMetadata,
        usage_count: (currentMetadata.usage_count || 0) + 1,
        last_used: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('project_templates')
        .update({ metadata: updatedMetadata })
        .eq('id', templateId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-templates'] });
    },
  });
};