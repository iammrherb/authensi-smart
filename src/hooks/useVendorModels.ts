import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VendorModel {
  id: string;
  vendor_id: string;
  model_name: string;
  model_series?: string;
  firmware_versions: string[];
  hardware_specs: Record<string, any>;
  port_configurations: Record<string, any>;
  supported_features: string[];
  eol_date?: string;
  eos_date?: string;
  documentation_links: any[];
  configuration_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  vendor?: {
    vendor_name: string;
    category: string;
  };
}

export const useVendorModels = (vendorId?: string) => {
  return useQuery({
    queryKey: vendorId ? ['vendor-models', vendorId] : ['vendor-models'],
    queryFn: async () => {
      let query = supabase
        .from('vendor_models')
        .select(`
          *,
          vendor:vendor_library(vendor_name, category)
        `)
        .order('model_name', { ascending: true });

      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as VendorModel[];
    },
  });
};

export const useVendorModel = (id: string) => {
  return useQuery({
    queryKey: ['vendor-model', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_models')
        .select(`
          *,
          vendor:vendor_library(vendor_name, category)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as VendorModel;
    },
    enabled: !!id,
  });
};

export const useCreateVendorModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (model: Partial<VendorModel>) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('vendor_models')
        .insert({
          vendor_id: model.vendor_id!,
          model_name: model.model_name!,
          model_series: model.model_series,
          firmware_versions: model.firmware_versions || [],
          hardware_specs: model.hardware_specs || {},
          port_configurations: model.port_configurations || {},
          supported_features: model.supported_features || [],
          eol_date: model.eol_date,
          eos_date: model.eos_date,
          documentation_links: model.documentation_links || [],
          configuration_notes: model.configuration_notes,
          created_by: user.data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
      toast({
        title: "Success",
        description: "Vendor model created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create vendor model.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVendorModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...model }: Partial<VendorModel> & { id: string }) => {
      const { data, error } = await supabase
        .from('vendor_models')
        .update(model)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
      toast({
        title: "Success",
        description: "Vendor model updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update vendor model.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVendorModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendor_models')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
      toast({
        title: "Success",
        description: "Vendor model deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete vendor model.",
        variant: "destructive",
      });
    },
  });
};