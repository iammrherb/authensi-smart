import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Industry Options
export const useIndustryOptions = () => {
  return useQuery({
    queryKey: ['industry-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industry_options')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateIndustryOption = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; category?: string }) => {
      const { data: result, error } = await supabase
        .from('industry_options')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industry-options'] });
      toast({ title: "Industry option created successfully" });
    }
  });
};

// Compliance Frameworks
export const useComplianceFrameworks = () => {
  return useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateComplianceFramework = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      requirements?: string[];
      industry_specific?: string[];
    }) => {
      const { data: result, error } = await supabase
        .from('compliance_frameworks')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-frameworks'] });
      toast({ title: "Compliance framework created successfully" });
    }
  });
};

// Deployment Types
export const useDeploymentTypes = () => {
  return useQuery({
    queryKey: ['deployment-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployment_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateDeploymentType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      complexity_level?: string;
      typical_timeline?: string;
      requirements?: string[];
    }) => {
      const { data: result, error } = await supabase
        .from('deployment_types')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment-types'] });
      toast({ title: "Deployment type created successfully" });
    }
  });
};

// Security Levels
export const useSecurityLevels = () => {
  return useQuery({
    queryKey: ['security-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_levels')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateSecurityLevel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      requirements?: string[];
      compliance_mappings?: string[];
    }) => {
      const { data: result, error } = await supabase
        .from('security_levels')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-levels'] });
      toast({ title: "Security level created successfully" });
    }
  });
};

// Business Domains
export const useBusinessDomains = () => {
  return useQuery({
    queryKey: ['business-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_domains')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateBusinessDomain = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      typical_use_cases?: string[];
      industry_alignment?: string[];
    }) => {
      const { data: result, error } = await supabase
        .from('business_domains')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-domains'] });
      toast({ title: "Business domain created successfully" });
    }
  });
};

// Authentication Methods
export const useAuthenticationMethods = () => {
  return useQuery({
    queryKey: ['authentication-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authentication_methods')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateAuthenticationMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      method_type: string;
      security_level?: string;
      vendor_support?: string[];
      configuration_complexity?: string;
      documentation_links?: string[];
      portnox_integration?: any;
    }) => {
      const { data: result, error } = await supabase
        .from('authentication_methods')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authentication-methods'] });
      toast({ title: "Authentication method created successfully" });
    }
  });
};

// Project Phases
export const useProjectPhases = () => {
  return useQuery({
    queryKey: ['project-phases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_phases')
        .select('*')
        .eq('is_active', true)
        .order('phase_order');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateProjectPhase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description?: string; 
      typical_duration?: string;
      deliverables?: string[];
      prerequisites?: string[];
      success_criteria?: string[];
      phase_order?: number;
    }) => {
      const { data: result, error } = await supabase
        .from('project_phases')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-phases'] });
      toast({ title: "Project phase created successfully" });
    }
  });
};

// Network Segments
export const useNetworkSegments = () => {
  return useQuery({
    queryKey: ['network-segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('network_segments')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateNetworkSegment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      segment_type: string;
      description?: string; 
      typical_size_range?: string;
      security_requirements?: string[];
      vendor_considerations?: string[];
    }) => {
      const { data: result, error } = await supabase
        .from('network_segments')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-segments'] });
      toast({ title: "Network segment created successfully" });
    }
  });
};