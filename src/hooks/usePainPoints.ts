import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PainPoint {
  id: string;
  title: string;
  description?: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommended_solutions: string[];
  industry_specific: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const usePainPoints = () => {
  return useQuery({
    queryKey: ['pain-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pain_points_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PainPoint[];
    }
  });
};

export const useCreatePainPoint = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (painPoint: Omit<PainPoint, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('pain_points_library')
        .insert([{
          ...painPoint,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pain-points'] });
      toast({
        title: "Pain Point Added",
        description: "Pain point has been added to the library successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Pain Point",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};