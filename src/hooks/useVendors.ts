import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vendor {
  id: string;
  vendor_name: string;
  vendor_type: string;
  category: string;
  models: any[];
  supported_protocols: any[];
  integration_methods: any[];
  portnox_compatibility: any;
  configuration_templates: any;
  known_limitations: any[];
  firmware_requirements: any;
  documentation_links: any[];
  support_level?: 'full' | 'partial' | 'limited' | 'none';
  last_tested_date?: string;
  status: 'active' | 'deprecated' | 'end-of-life';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_library')
        .select('*')
        .order('vendor_name', { ascending: true });
      
      if (error) throw error;
      return data as Vendor[];
    },
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_library')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Vendor | null;
    },
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('vendor_library')
        .insert([{
          ...vendorData,
          created_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create vendor: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProjectVendors = (projectId: string) => {
  return useQuery({
    queryKey: ['project-vendors', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_vendors')
        .select(`
          *,
          vendor_library (*)
        `)
        .eq('project_id', projectId)
        .order('role', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useAddVendorToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      vendorId,
      role,
      modelsUsed,
      integrationNotes
    }: {
      projectId: string;
      vendorId: string;
      role: string;
      modelsUsed?: any[];
      integrationNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_vendors')
        .insert([{
          project_id: projectId,
          vendor_id: vendorId,
          role,
          models_used: modelsUsed || [],
          integration_notes: integrationNotes,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-vendors'] });
      toast({
        title: "Success",
        description: "Vendor added to project successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add vendor to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};