import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TestCase {
  id: string;
  name: string;
  category: string;
  description?: string;
  test_type: 'functional' | 'integration' | 'performance' | 'security' | 'user-acceptance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  prerequisites: any[];
  test_steps: any[];
  expected_results: any[];
  validation_criteria: any[];
  related_use_cases: any[];
  vendor_specific: any;
  automation_possible: boolean;
  estimated_duration_minutes?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useTestCases = () => {
  return useQuery({
    queryKey: ['test-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_case_library')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as TestCase[];
    },
  });
};

export const useTestCase = (id: string) => {
  return useQuery({
    queryKey: ['test-cases', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_case_library')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as TestCase | null;
    },
    enabled: !!id,
  });
};

export const useCreateTestCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (testCaseData: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('test_case_library')
        .insert([{
          ...testCaseData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-cases'] });
      toast({
        title: "Success",
        description: "Test case created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create test case: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectTestCases = (projectId: string) => {
  return useQuery({
    queryKey: ['project-test-cases', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_test_cases')
        .select(`
          *,
          test_case_library (*),
          project_use_cases (
            use_case_library (name)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useExecuteTestCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectTestCaseId,
      status,
      executionNotes,
      testResults,
      defectsFound
    }: {
      projectTestCaseId: string;
      status: 'in-progress' | 'passed' | 'failed' | 'blocked' | 'skipped';
      executionNotes?: string;
      testResults?: any;
      defectsFound?: any[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('project_test_cases')
        .update({
          status,
          execution_notes: executionNotes,
          test_results: testResults,
          defects_found: defectsFound,
          executed_by: user?.id,
          execution_date: new Date().toISOString(),
        })
        .eq('id', projectTestCaseId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-test-cases'] });
      toast({
        title: "Success",
        description: "Test case execution updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update test execution: " + error.message,
        variant: "destructive",
      });
    },
  });
};