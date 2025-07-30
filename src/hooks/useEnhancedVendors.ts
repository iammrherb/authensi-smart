import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedVendor {
  id: string;
  vendor_name: string;
  vendor_type: string;
  category: string;
  description?: string;
  website_url?: string;
  support_contact: Record<string, any>;
  certifications: any[];
  portnox_integration_level: string;
  portnox_documentation: Record<string, any>;
  models: any[];
  supported_protocols: any[];
  integration_methods: any[];
  portnox_compatibility: Record<string, any>;
  configuration_templates: Record<string, any>;
  known_limitations: any[];
  firmware_requirements: Record<string, any>;
  documentation_links: any[];
  support_level?: string;
  last_tested_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

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

export const useEnhancedVendors = () => {
  return useQuery({
    queryKey: ['enhanced-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_library')
        .select('*')
        .order('vendor_name', { ascending: true });
      
      if (error) throw error;
      return data as EnhancedVendor[];
    },
  });
};

export const useEnhancedVendor = (id: string) => {
  return useQuery({
    queryKey: ['enhanced-vendor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_library')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as EnhancedVendor | null;
    },
    enabled: !!id,
  });
};

export const useCreateEnhancedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vendor: Partial<EnhancedVendor>) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('vendor_library')
        .insert({
          vendor_name: vendor.vendor_name!,
          category: vendor.category!,
          vendor_type: vendor.vendor_type!,
          description: vendor.description,
          website_url: vendor.website_url,
          support_contact: vendor.support_contact || {},
          certifications: vendor.certifications || [],
          portnox_integration_level: vendor.portnox_integration_level || 'supported',
          portnox_documentation: vendor.portnox_documentation || {},
          models: vendor.models || [],
          supported_protocols: vendor.supported_protocols || [],
          integration_methods: vendor.integration_methods || [],
          portnox_compatibility: vendor.portnox_compatibility || {},
          configuration_templates: vendor.configuration_templates || {},
          known_limitations: vendor.known_limitations || [],
          firmware_requirements: vendor.firmware_requirements || {},
          documentation_links: vendor.documentation_links || [],
          support_level: vendor.support_level,
          last_tested_date: vendor.last_tested_date,
          status: vendor.status || 'active',
          created_by: user.data.user?.id,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-vendors'] });
      toast({
        title: "Success",
        description: "Vendor created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create vendor.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEnhancedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...vendor }: Partial<EnhancedVendor> & { id: string }) => {
      const { data, error } = await supabase
        .from('vendor_library')
        .update(vendor)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-vendors'] });
      toast({
        title: "Success",
        description: "Vendor updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update vendor.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEnhancedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendor_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-vendors'] });
      toast({
        title: "Success",
        description: "Vendor deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete vendor.",
        variant: "destructive",
      });
    },
  });
};

// Vendor Models hooks
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
        .maybeSingle();
      
      if (error) throw error;
      return data as VendorModel | null;
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
        .maybeSingle();

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
        .maybeSingle();

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