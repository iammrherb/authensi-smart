import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_name?: string;
  status: 'planning' | 'scoping' | 'designing' | 'implementing' | 'testing' | 'deployed' | 'maintenance';
  current_phase: 'discovery' | 'scoping' | 'design' | 'implementation' | 'testing' | 'deployment' | 'maintenance';
  start_date?: string;
  target_completion?: string;
  actual_completion?: string;
  budget?: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  project_manager?: string;
}

export interface ProjectSite {
  id: string;
  project_id: string;
  site_id: string;
  deployment_order: number;
  site_specific_notes?: string;
  created_at: string;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    enabled: !!id,
  });
};

export const useProjectSites = (projectId: string) => {
  return useQuery({
    queryKey: ['project-sites', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_sites')
        .select(`
          *,
          sites (*)
        `)
        .eq('project_id', projectId)
        .order('deployment_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_by: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddSiteToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, siteId, deploymentOrder, notes }: {
      projectId: string;
      siteId: string;
      deploymentOrder: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_sites')
        .insert([{
          project_id: projectId,
          site_id: siteId,
          deployment_order: deploymentOrder,
          site_specific_notes: notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sites'] });
      toast({
        title: "Success",
        description: "Site added to project successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add site to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};