import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DecisionRecommendation } from '@/services/UnifiedDecisionEngine';

export interface UnifiedProject {
  id: string;
  name: string;
  description: string;
  organization_size: number;
  industry: string;
  compliance_frameworks: string[];
  pain_points: string[];
  existing_vendors: any;
  authentication_requirements: string[];
  security_level: string;
  deployment_type: string;
  timeline: string;
  budget: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  ai_recommendations: DecisionRecommendation[];
  implementation_checklist: any[];
  created_at: string;
  updated_at: string;
  created_by: string;
  progress_percentage: number;
  risk_level: 'low' | 'medium' | 'high';
  next_milestone: string;
  assigned_team: string[];
}

export interface ProjectPhaseTracking {
  id: string;
  project_id: string;
  phase_name: string;
  phase_order: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  planned_start: string;
  planned_end: string;
  actual_start?: string;
  actual_end?: string;
  progress_percentage: number;
  tasks: any[];
  blockers: string[];
  resources_assigned: string[];
  deliverables: any[];
  created_at: string;
  updated_at: string;
}

export interface ProjectResource {
  id: string;
  project_id: string;
  resource_type: 'use_case' | 'vendor' | 'requirement' | 'authentication_method' | 'compliance_framework';
  resource_id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  implementation_status: 'planned' | 'in-progress' | 'completed' | 'deferred';
  implementation_notes?: string;
  assigned_to?: string;
  target_date?: string;
  created_at: string;
  metadata: any;
}

export const useUnifiedProjects = () => {
  return useQuery({
    queryKey: ['unified-projects'],
    queryFn: async () => {
      // Use existing projects table for now
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as any[];
    },
  });
};

export const useUnifiedProject = (projectId: string) => {
  return useQuery({
    queryKey: ['unified-projects', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (error) throw error;
      return data as UnifiedProject | null;
    },
    enabled: !!projectId,
  });
};

export const useCreateUnifiedProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: Omit<UnifiedProject, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('unified_projects')
        .insert([{
          ...projectData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unified-projects'] });
      toast({
        title: "Success",
        description: "Project created successfully with AI recommendations",
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUnifiedProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UnifiedProject> & { id: string }) => {
      const { data, error } = await supabase
        .from('unified_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectPhases = (projectId: string) => {
  return useQuery({
    queryKey: ['project-phases', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_phase_tracking')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_order');
      
      if (error) throw error;
      return data as ProjectPhaseTracking[];
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phaseData: Omit<ProjectPhaseTracking, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('project_phase_tracking')
        .insert([phaseData])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-phases'] });
      toast({
        title: "Success",
        description: "Project phase created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create project phase: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProjectPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectPhaseTracking> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_phase_tracking')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-phases'] });
      toast({
        title: "Success",
        description: "Project phase updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update project phase: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectResources = (projectId: string) => {
  return useQuery({
    queryKey: ['project-resources', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', projectId)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as ProjectResource[];
    },
    enabled: !!projectId,
  });
};

export const useAddResourceToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (resourceData: Omit<ProjectResource, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('project_resources')
        .insert([resourceData])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-resources'] });
      toast({
        title: "Success",
        description: "Resource added to project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add resource to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProjectResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectResource> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-resources'] });
      toast({
        title: "Success",
        description: "Project resource updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update project resource: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectAnalytics = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      let query = supabase
        .from('project_analytics_view')
        .select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGenerateProjectReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { projectId: string; reportType: string; format: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-project-report', {
        body: params
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Project report generated successfully",
      });
      
      // Download the report
      const blob = new Blob([data.content], { type: data.contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate report: " + error.message,
        variant: "destructive",
      });
    },
  });
};