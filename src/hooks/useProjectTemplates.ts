import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  deployment_type: string;
  security_level: string;
  authentication_workflows?: any;
  compliance_frameworks?: string[];
  network_requirements?: any;
  requirements?: any;
  test_cases?: any;
  timeline_template?: any;
  use_cases?: any;
  vendor_configurations?: any;
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
        .select('*');

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
        .select('*');

      // Note: complexity filtering removed as column doesn't exist in current schema

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
      // Note: Usage tracking would need a separate table since metadata column doesn't exist
      // For now, just update the updated_at timestamp to show activity
      const { data, error } = await supabase
        .from('project_templates')
        .update({ updated_at: new Date().toISOString() })
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