import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeUpdates } from './useRealtimeUpdates';

export interface Site {
  id: string;
  name: string;
  location?: string;
  address?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  site_type: string;
  network_segments: number;
  device_count: number;
  status: 'planning' | 'scoping' | 'designing' | 'implementing' | 'testing' | 'deployed' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_engineer?: string;
  region?: string;
  country?: string;
  site_id?: string;
  current_phase?: string;
  progress_percentage?: number;
  timeline_start?: string;
  timeline_end?: string;
  deployment_config?: {
    network?: {
      wired_vendors?: string[];
      wireless_vendors?: string[];
      switch_vendors?: string[];
      firewall_vendors?: string[];
    };
    security?: {
      [key: string]: boolean | string;
    };
    device_types?: {
      [key: string]: number;
    };
    user_types?: {
      [key: string]: number;
    };
    [key: string]: any;
  };
  notifications_enabled?: boolean;
}

export const useSites = () => {
  useRealtimeUpdates(); // Enable real-time updates
  
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Site[];
    },
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create sites');
      }

      const { data, error } = await supabase
        .from('sites')
        .insert([{
          ...siteData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating site:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast({
        title: "Success",
        description: "Site created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Site creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create site: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Site> & { id: string }) => {
      const { data, error } = await supabase
        .from('sites')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating site:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast({
        title: "Success",
        description: "Site updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update site: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast({
        title: "Success",
        description: "Site deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete site: " + error.message,
        variant: "destructive",
      });
    },
  });
};