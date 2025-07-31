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