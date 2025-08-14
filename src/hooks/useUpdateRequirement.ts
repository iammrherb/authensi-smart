import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Requirement } from './useRequirements';

export const useUpdateRequirement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Requirement> & { id: string }) => {
      const { data, error } = await supabase
        .from('requirements_library')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      toast({
        title: "Success",
        description: "Requirement updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: "Failed to update requirement: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRequirement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('requirements_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      toast({
        title: "Success",
        description: "Requirement deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete requirement: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveRequirementFromProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, requirementId }: { projectId: string; requirementId: string }) => {
      const { error } = await supabase
        .from('project_requirements')
        .delete()
        .eq('project_id', projectId)
        .eq('requirement_id', requirementId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-requirements'] });
      toast({
        title: "Success",
        description: "Requirement removed from project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove requirement from project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveRequirementFromSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ siteId, requirementId }: { siteId: string; requirementId: string }) => {
      const { error } = await supabase
        .from('site_requirements')
        .delete()
        .eq('site_id', siteId)
        .eq('requirement_id', requirementId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-requirements'] });
      toast({
        title: "Success",
        description: "Requirement removed from site successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove requirement from site: " + error.message,
        variant: "destructive",
      });
    },
  });
};