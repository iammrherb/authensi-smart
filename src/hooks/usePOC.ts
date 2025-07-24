import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface POCActivity {
  id: string;
  project_id: string;
  activity_type: string;
  title: string;
  description?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  start_date?: string;
  target_completion?: string;
  actual_completion?: string;
  success_criteria: any[];
  results: any;
  next_steps?: string;
  stakeholders: any[];
  documentation: any[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ProjectHandoff {
  id: string;
  project_id: string;
  handoff_type: string;
  from_team: string;
  to_team: string;
  status: 'pending' | 'in-progress' | 'completed';
  handoff_date?: string;
  completion_date?: string;
  documentation_items: any[];
  training_sessions: any[];
  knowledge_transfer_items: any[];
  outstanding_items: any[];
  signoff_from?: string;
  signoff_to?: string;
  signoff_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  milestone_type: string;
  target_date?: string;
  actual_date?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  deliverables: any[];
  success_criteria: any[];
  dependencies: any[];
  responsible_team?: string;
  assigned_to?: string;
  completion_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const usePOCActivities = (projectId: string) => {
  return useQuery({
    queryKey: ['poc-activities', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('poc_activities')
        .select('*')
        .eq('project_id', projectId)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as POCActivity[];
    },
    enabled: !!projectId,
  });
};

export const useCreatePOCActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pocData: Omit<POCActivity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('poc_activities')
        .insert([{
          ...pocData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poc-activities'] });
      toast({
        title: "Success",
        description: "POC activity created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create POC activity: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectHandoffs = (projectId: string) => {
  return useQuery({
    queryKey: ['project-handoffs', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_handoffs')
        .select('*')
        .eq('project_id', projectId)
        .order('handoff_date', { ascending: true });
      
      if (error) throw error;
      return data as ProjectHandoff[];
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectHandoff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (handoffData: Omit<ProjectHandoff, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('project_handoffs')
        .insert([{
          ...handoffData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-handoffs'] });
      toast({
        title: "Success",
        description: "Project handoff created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create project handoff: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('target_date', { ascending: true });
      
      if (error) throw error;
      return data as ProjectMilestone[];
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectMilestone = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (milestoneData: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('project_milestones')
        .insert([{
          ...milestoneData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones'] });
      toast({
        title: "Success",
        description: "Project milestone created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create project milestone: " + error.message,
        variant: "destructive",
      });
    },
  });
};