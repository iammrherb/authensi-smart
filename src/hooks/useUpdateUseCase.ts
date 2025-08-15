import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UseCase } from './useUseCases';

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

export const useDeleteUseCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('use_case_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      toast({
        title: "Success",
        description: "Use case deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete use case: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveUseCaseFromProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, useCaseId }: { projectId: string; useCaseId: string }) => {
      const { error } = await supabase
        .from('project_use_cases')
        .delete()
        .eq('project_id', projectId)
        .eq('use_case_id', useCaseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-use-cases'] });
      toast({
        title: "Success",
        description: "Use case removed from project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove use case from project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveUseCaseFromSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ siteId, useCaseId }: { siteId: string; useCaseId: string }) => {
      const { error } = await supabase
        .from('site_use_cases')
        .delete()
        .eq('site_id', siteId)
        .eq('use_case_id', useCaseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-use-cases'] });
      toast({
        title: "Success",
        description: "Use case removed from site successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove use case from site: " + error.message,
        variant: "destructive",
      });
    },
  });
};