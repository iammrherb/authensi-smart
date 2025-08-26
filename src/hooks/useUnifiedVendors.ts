// =============================================================================
// UNIFIED VENDOR HOOK - CONSOLIDATED & OPTIMIZED
// =============================================================================
// This hook consolidates functionality from:
// - useVendors.ts
// - useEnhancedVendors.ts  
// - useVendorModels.ts
//
// Provides a single, comprehensive interface for all vendor operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  unifiedVendorLibrary, 
  UnifiedVendor, 
  UnifiedVendorModel,
  getVendorById,
  getVendorsByCategory,
  getVendorsBySupportLevel,
  getVendorsByPortnoxCompatibility,
  getAllVendorCategories,
  getVendorStats
} from '@/data/unifiedVendorLibrary';

// =============================================================================
// INTERFACES
// =============================================================================

export interface DatabaseVendor {
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

export interface VendorFilters {
  category?: string;
  subcategory?: string;
  supportLevel?: UnifiedVendor['supportLevel'];
  portnoxCompatibility?: UnifiedVendor['portnoxCompatibility'];
  searchTerm?: string;
}

// =============================================================================
// MAIN HOOK
// =============================================================================

// Export UnifiedVendor type for components
export type { UnifiedVendor, UnifiedVendorModel } from '@/data/unifiedVendorLibrary';

export const useUnifiedVendorModels = (vendorId?: string) => {
  return useQuery({
    queryKey: ['unified-vendor-models', vendorId],
    queryFn: async () => {
      if (!vendorId) return [];

      const vendor = getVendorById(vendorId);
      if (vendor) return vendor.models;

      // Check database for vendor models
      const { data, error } = await supabase
        .from('vendor_library')
        .select('models')
        .eq('id', vendorId)
        .single();
      
      if (error) throw error;
      return data.models || [];
    },
    enabled: !!vendorId,
  });
};

export const useUnifiedVendors = (filters?: VendorFilters) => {
  return useQuery({
    queryKey: ['unified-vendors', filters],
    queryFn: async () => {
      // Get database vendors
      const { data: dbVendors, error } = await supabase
        .from('vendor_library')
        .select('*')
        .order('vendor_name', { ascending: true });
      
      if (error) throw error;

      // Merge with static vendor library
      const allVendors = [...unifiedVendorLibrary];
      
      // Add database vendors that aren't in static library
      dbVendors?.forEach(dbVendor => {
        const exists = allVendors.find(v => v.id === dbVendor.id || v.name === dbVendor.vendor_name);
        if (!exists) {
          allVendors.push({
            id: dbVendor.id,
            name: dbVendor.vendor_name,
            category: dbVendor.category,
            icon: "🏢",
            color: "bg-gray-500",
            description: dbVendor.description || "",
        models: Array.isArray(dbVendor.models) ? dbVendor.models.map((m: any) => 
          typeof m === 'string' ? { 
            id: m, 
            name: m, 
            series: '', 
            category: '', 
            firmwareVersions: [], 
            capabilities: [] 
          } : {
            id: m.id || m.name || 'unknown',
            name: m.name || '',
            series: m.series || '',
            category: m.category || '',
            firmwareVersions: Array.isArray(m.firmwareVersions) ? m.firmwareVersions.filter((v: any) => typeof v === 'string') : [],
            capabilities: Array.isArray(m.capabilities) ? m.capabilities.filter((c: any) => typeof c === 'string') : [],
            ...m
          }
        ) : [],
            commonFeatures: [],
            supportLevel: (dbVendor.support_level as UnifiedVendor['supportLevel']) || 'limited',
            portnoxCompatibility: 'limited',
        integrationMethods: Array.isArray(dbVendor.integration_methods) ? 
          dbVendor.integration_methods.filter((m: any) => typeof m === 'string') : [],
            status: (dbVendor.status as UnifiedVendor['status']) || 'active',
        websiteUrl: dbVendor.website_url,
        supportContact: typeof dbVendor.support_contact === 'object' ? dbVendor.support_contact : {},
        certifications: Array.isArray(dbVendor.certifications) ? 
          dbVendor.certifications.filter((c: any) => typeof c === 'string') : [],
            lastTestedDate: dbVendor.last_tested_date
          });
        }
      });

      // Apply filters
      let filteredVendors = allVendors;

      if (filters?.category) {
        filteredVendors = filteredVendors.filter(v => v.category === filters.category);
      }

      if (filters?.subcategory) {
        filteredVendors = filteredVendors.filter(v => v.subcategory === filters.subcategory);
      }

      if (filters?.supportLevel) {
        filteredVendors = filteredVendors.filter(v => v.supportLevel === filters.supportLevel);
      }

      if (filters?.portnoxCompatibility) {
        filteredVendors = filteredVendors.filter(v => v.portnoxCompatibility === filters.portnoxCompatibility);
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredVendors = filteredVendors.filter(v => 
          v.name.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower) ||
          v.category.toLowerCase().includes(searchLower) ||
          (v.subcategory && v.subcategory.toLowerCase().includes(searchLower))
        );
      }

      return filteredVendors;
    },
  });
};

// =============================================================================
// INDIVIDUAL VENDOR HOOK
// =============================================================================

export const useUnifiedVendor = (id: string) => {
  return useQuery({
    queryKey: ['unified-vendor', id],
    queryFn: async () => {
      // First check static library
      const staticVendor = getVendorById(id);
      if (staticVendor) return staticVendor;

      // Then check database
      const { data, error } = await supabase
        .from('vendor_library')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;

      // Convert database vendor to unified format
      return {
        id: data.id,
        name: data.vendor_name,
        category: data.category,
        icon: "🏢",
        color: "bg-gray-500",
        description: data.description || "",
        models: Array.isArray(data.models) ? data.models.map((m: any) => 
          typeof m === 'string' ? { 
            id: m, 
            name: m, 
            series: '', 
            category: '', 
            firmwareVersions: [], 
            capabilities: [] 
          } : {
            id: m.id || m.name || 'unknown',
            name: m.name || '',
            series: m.series || '',
            category: m.category || '',
            firmwareVersions: Array.isArray(m.firmwareVersions) ? m.firmwareVersions.filter((v: any) => typeof v === 'string') : [],
            capabilities: Array.isArray(m.capabilities) ? m.capabilities.filter((c: any) => typeof c === 'string') : [],
            ...m
          }
        ) : [],
        commonFeatures: [],
        supportLevel: (data.support_level as UnifiedVendor['supportLevel']) || 'limited',
        portnoxCompatibility: 'limited',
        integrationMethods: Array.isArray(data.integration_methods) ? 
          data.integration_methods.filter((m: any) => typeof m === 'string') : [],
        status: (data.status as UnifiedVendor['status']) || 'active',
        websiteUrl: data.website_url,
        supportContact: typeof data.support_contact === 'object' ? data.support_contact : {},
        certifications: Array.isArray(data.certifications) ? 
          data.certifications.filter((c: any) => typeof c === 'string') : [],
        lastTestedDate: data.last_tested_date
      } as UnifiedVendor;
    },
    enabled: !!id,
  });
};

// Removed duplicate hook definition

// =============================================================================
// VENDOR CREATION HOOK
// =============================================================================

export const useCreateUnifiedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vendorData: Partial<UnifiedVendor>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('vendor_library')
        .insert({
          vendor_name: vendorData.name!,
          category: vendorData.category!,
          vendor_type: vendorData.subcategory || vendorData.category!,
          description: vendorData.description,
          website_url: vendorData.websiteUrl,
          support_contact: vendorData.supportContact || {},
          certifications: Array.isArray(vendorData.certifications) ? vendorData.certifications : [],
          portnox_integration_level: vendorData.portnoxCompatibility || 'limited',
          portnox_documentation: {},
          models: [],
          supported_protocols: [],
          integration_methods: Array.isArray(vendorData.integrationMethods) ? vendorData.integrationMethods : [],
          portnox_compatibility: {},
          configuration_templates: {},
          known_limitations: Array.isArray(vendorData.knownLimitations) ? vendorData.knownLimitations : [],
          firmware_requirements: {},
          documentation_links: Array.isArray(vendorData.documentationLinks) ? vendorData.documentationLinks : [],
          support_level: vendorData.supportLevel || 'limited',
          last_tested_date: vendorData.lastTestedDate,
          status: vendorData.status || 'active',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-vendors'] });
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

// =============================================================================
// VENDOR UPDATE HOOK
// =============================================================================

export const useUpdateUnifiedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UnifiedVendor> }) => {
      const { data, error } = await supabase
        .from('vendor_library')
        .update({
          vendor_name: updates.name,
          category: updates.category,
          vendor_type: updates.subcategory || updates.category,
          description: updates.description,
          website_url: updates.websiteUrl,
          support_contact: updates.supportContact,
          certifications: updates.certifications,
          portnox_integration_level: updates.portnoxCompatibility,
          models: [],
          integration_methods: updates.integrationMethods,
          known_limitations: updates.knownLimitations,
          documentation_links: updates.documentationLinks,
          support_level: updates.supportLevel,
          last_tested_date: updates.lastTestedDate,
          status: updates.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['unified-vendor'] });
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update vendor: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// =============================================================================
// VENDOR DELETE HOOK
// =============================================================================

export const useDeleteUnifiedVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendor_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-vendors'] });
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete vendor: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

export const useVendorCategories = () => {
  return useQuery({
    queryKey: ['vendor-categories'],
    queryFn: () => getAllVendorCategories(),
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendor-stats'],
    queryFn: () => getVendorStats(),
  });
};

export const useVendorsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['vendors-by-category', category],
    queryFn: () => getVendorsByCategory(category),
    enabled: !!category,
  });
};

export const useVendorsBySupportLevel = (level: UnifiedVendor['supportLevel']) => {
  return useQuery({
    queryKey: ['vendors-by-support-level', level],
    queryFn: () => getVendorsBySupportLevel(level),
    enabled: !!level,
  });
};

export const useVendorsByPortnoxCompatibility = (compatibility: UnifiedVendor['portnoxCompatibility']) => {
  return useQuery({
    queryKey: ['vendors-by-compatibility', compatibility],
    queryFn: () => getVendorsByPortnoxCompatibility(compatibility),
    enabled: !!compatibility,
  });
};
