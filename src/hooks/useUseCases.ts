import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UseCase {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  business_value?: string;
  technical_requirements: any[];
  prerequisites: any[];
  test_scenarios: any[];
  supported_vendors: any[];
  portnox_features: any[];
  complexity: 'low' | 'medium' | 'high';
  estimated_effort_weeks?: number;
  dependencies: any[];
  compliance_frameworks?: string[];
  authentication_methods: any[];
  deployment_scenarios: any[];
  tags?: string[];
  status: 'active' | 'deprecated' | 'draft';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useUseCases = () => {
  return useQuery({
    queryKey: ['use-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('use_case_library')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as UseCase[];
    },
  });
};

export const useUseCase = (id: string) => {
  return useQuery({
    queryKey: ['use-cases', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('use_case_library')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UseCase | null;
    },
    enabled: !!id,
  });
};

export const useCreateUseCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (useCaseData: Omit<UseCase, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('use_case_library')
        .insert([{
          ...useCaseData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      toast({
        title: "Success",
        description: "Use case created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create use case: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUseCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UseCase> & { id: string }) => {
      const { data, error } = await supabase
        .from('use_case_library')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      toast({
        title: "Success",
        description: "Use case updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update use case: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectUseCases = (projectId: string) => {
  return useQuery({
    queryKey: ['project-use-cases', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_use_cases')
        .select(`
          *,
          use_case_library (*)
        `)
        .eq('project_id', projectId)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useAddUseCaseToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      useCaseId,
      priority,
      implementationNotes
    }: {
      projectId: string;
      useCaseId: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      implementationNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_use_cases')
        .insert([{
          project_id: projectId,
          use_case_id: useCaseId,
          priority,
          implementation_notes: implementationNotes,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-use-cases'] });
      toast({
        title: "Success",
        description: "Use case added to project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add use case to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSiteUseCases = (siteId: string) => {
  return useQuery({
    queryKey: ['site-use-cases', siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_use_cases')
        .select(`
          *,
          use_case_library (*)
        `)
        .eq('site_id', siteId)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!siteId,
  });
};

export const useAddUseCaseToSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      siteId,
      useCaseId,
      priority,
      implementationNotes
    }: {
      siteId: string;
      useCaseId: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      implementationNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('site_use_cases')
        .insert([{
          site_id: siteId,
          use_case_id: useCaseId,
          priority,
          implementation_notes: implementationNotes,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-use-cases'] });
      toast({
        title: "Success",
        description: "Use case added to site successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add use case to site: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBulkImportUseCases = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (useCases: Omit<UseCase, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const useCasesWithCreator = useCases.map(useCase => ({
        ...useCase,
        created_by: user.id,
      }));

      const { data, error } = await supabase
        .from('use_case_library')
        .insert(useCasesWithCreator)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      toast({
        title: "Success",
        description: `${data?.length || 0} use cases imported successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to import use cases: " + error.message,
        variant: "destructive",
      });
    },
  });
};