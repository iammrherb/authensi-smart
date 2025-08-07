import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DeviceTypeRecord {
  id: string;
  device_name: string;
  category: string;
  manufacturer?: string;
  description?: string;
}

export const useDeviceTypes = () => {
  return useQuery({
    queryKey: ['device-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_types')
        .select('id, device_name, category, manufacturer, description')
        .order('device_name', { ascending: true });
      if (error) throw error;
      return (data || []) as DeviceTypeRecord[];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};
