import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Questionnaire {
  id: string;
  site_id: string;
  project_id?: string;
  questionnaire_data: any;
  status: 'draft' | 'in-progress' | 'completed' | 'reviewed';
  completion_percentage: number;
  completed_at?: string;
  reviewed_at?: string;
  created_by?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireData {
  deploymentType: string;
  useCases: string[];
  requirements: {
    endpoints: number;
    sites: number;
    networkInfrastructure: string;
    authenticationMethod: string;
    compliance: string;
    timeline: string;
  };
  discoveryAnswers: {
    infrastructure: { [key: string]: string };
    security: { [key: string]: string };
    business: { [key: string]: string };
  };
  testCases: Array<{
    category: string;
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'passed' | 'failed';
    requirements: string[];
  }>;
  sizing: {
    estimatedEndpoints: number;
    requiredAppliances: number;
    estimatedTimeline: string;
    budget?: number;
  };
}

export const useQuestionnaires = () => {
  return useQuery({
    queryKey: ['questionnaires'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scoping_questionnaires')
        .select(`
          *,
          sites (name, location)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Questionnaire & { sites: { name: string; location?: string } })[];
    },
  });
};

export const useQuestionnaire = (id: string) => {
  return useQuery({
    queryKey: ['questionnaires', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scoping_questionnaires')
        .select(`
          *,
          sites (name, location),
          projects (name)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching questionnaire:', error);
        throw error;
      }
      return data as Questionnaire & { 
        sites: { name: string; location?: string };
        projects?: { name: string };
      } | null;
    },
    enabled: !!id,
  });
};

export const useCreateQuestionnaire = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questionnaireData: {
      site_id: string;
      project_id?: string;
      questionnaire_data: QuestionnaireData;
      status?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create questionnaires');
      }

      const { data, error } = await supabase
        .from('scoping_questionnaires')
        .insert({
          ...questionnaireData,
          created_by: user.id,
          completion_percentage: 0,
          status: questionnaireData.status || 'draft',
          questionnaire_data: questionnaireData.questionnaire_data as any
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating questionnaire:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Success",
        description: "Questionnaire created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Questionnaire creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create questionnaire: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateQuestionnaire = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Questionnaire> & { id: string }) => {
      // Calculate completion percentage if questionnaire_data is being updated
      if (updates.questionnaire_data) {
        const data = updates.questionnaire_data as QuestionnaireData;
        let completed = 0;
        let total = 5; // deployment type, use cases, requirements, discovery, sizing
        
        if (data.deploymentType) completed++;
        if (data.useCases && data.useCases.length > 0) completed++;
        if (data.requirements && Object.keys(data.requirements).length > 0) completed++;
        if (data.discoveryAnswers && Object.keys(data.discoveryAnswers).length > 0) completed++;
        if (data.sizing && Object.keys(data.sizing).length > 0) completed++;
        
        updates.completion_percentage = Math.round((completed / total) * 100);
        
        if (updates.completion_percentage === 100 && !updates.completed_at) {
          updates.completed_at = new Date().toISOString();
          updates.status = 'completed';
        }
      }

      const { data, error } = await supabase
        .from('scoping_questionnaires')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating questionnaire:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Success",
        description: "Questionnaire updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update questionnaire: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteQuestionnaire = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scoping_questionnaires')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast({
        title: "Success",
        description: "Questionnaire deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete questionnaire: " + error.message,
        variant: "destructive",
      });
    },
  });
};