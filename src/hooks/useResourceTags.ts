import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ResourceTag {
  id: string;
  name: string;
  color_code: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useResourceTags = () => {
  return useQuery({
    queryKey: ['resource-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_tags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as ResourceTag[];
    },
  });
};

export const useCreateResourceTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tagData: Omit<ResourceTag, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('resource_tags')
        .insert([{
          ...tagData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create tag: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateResourceTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<ResourceTag> & { id: string }) => {
      const { data, error } = await supabase
        .from('resource_tags')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update tag: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteResourceTag = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resource_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete tag: " + error.message,
        variant: "destructive",
      });
    },
  });
};