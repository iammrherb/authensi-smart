import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Requirement {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  requirement_type: string;
  description?: string;
  rationale?: string;
  acceptance_criteria: any[];
  verification_methods: any[];
  test_cases: any[];
  related_use_cases: any[];
  dependencies: any[];
  assumptions: any[];
  constraints: any[];
  compliance_frameworks?: string[];
  vendor_requirements: any;
  portnox_features: any[];
  documentation_references: any[];
  tags?: string[];
  status: 'draft' | 'under-review' | 'approved' | 'deprecated';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useRequirements = () => {
  return useQuery({
    queryKey: ['requirements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requirements_library')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Requirement[];
    },
  });
};

export const useRequirement = (id: string) => {
  return useQuery({
    queryKey: ['requirements', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requirements_library')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Requirement | null;
    },
    enabled: !!id,
  });
};

export const useCreateRequirement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (requirementData: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('requirements_library')
        .insert([{
          ...requirementData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      toast({
        title: "Success",
        description: "Requirement created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create requirement: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectRequirements = (projectId: string) => {
  return useQuery({
    queryKey: ['project-requirements', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_requirements')
        .select(`
          *,
          requirements_library (*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useAddRequirementToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      requirementId,
      implementationApproach,
      targetDate
    }: {
      projectId: string;
      requirementId: string;
      implementationApproach?: string;
      targetDate?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_requirements')
        .insert([{
          project_id: projectId,
          requirement_id: requirementId,
          implementation_approach: implementationApproach,
          target_date: targetDate,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-requirements'] });
      toast({
        title: "Success",
        description: "Requirement added to project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add requirement to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};