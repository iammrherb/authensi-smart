import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementation_effort: 'low' | 'medium' | 'high';
  expected_outcome?: string;
  prerequisites: string[];
  related_pain_points: string[];
  portnox_features: string[];
  industry_specific: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recommendation[];
    }
  });
};

export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (recommendation: Omit<Recommendation, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('recommendations_library')
        .insert([{
          ...recommendation,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast({
        title: "Recommendation Added",
        description: "Recommendation has been added to the library successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Recommendation",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};