import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ConfigTemplate {
  id: string;
  name: string;
  description?: string;
  vendor_id?: string;
  model_id?: string;
  category: string;
  subcategory?: string;
  configuration_type: string;
  complexity_level: string;
  template_content: string;
  template_variables: Record<string, any>;
  supported_scenarios: string[];
  authentication_methods: string[];
  required_features: string[];
  network_requirements: Record<string, any>;
  security_features: string[];
  best_practices: string[];
  troubleshooting_guide: any[];
  validation_commands: string[];
  tags: string[];
  usage_count: number;
  rating: number;
  is_public: boolean;
  is_validated: boolean;
  validation_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  vendor?: {
    vendor_name: string;
    category: string;
  };
  model?: {
    model_name: string;
    model_series?: string;
  };
}

export const useConfigTemplates = () => {
  return useQuery({
    queryKey: ['config-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuration_templates')
        .select(`
          *,
          vendor:vendor_library!vendor_id(vendor_name, category),
          model:vendor_models!model_id(model_name, model_series)
        `)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        vendor: Array.isArray(item.vendor) ? item.vendor[0] : item.vendor,
        model: Array.isArray(item.model) ? item.model[0] : item.model,
      }));
      
      return transformedData as ConfigTemplate[];
    },
  });
};

export const useConfigTemplate = (id: string) => {
  return useQuery({
    queryKey: ['config-template', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuration_templates')
        .select(`
          *,
          vendor:vendor_library!vendor_id(vendor_name, category),
          model:vendor_models!model_id(model_name, model_series)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Transform the data to match our interface
      const transformedData = {
        ...data,
        vendor: Array.isArray(data.vendor) ? data.vendor[0] : data.vendor,
        model: Array.isArray(data.model) ? data.model[0] : data.model,
      };
      
      return transformedData as ConfigTemplate;
    },
    enabled: !!id,
  });
};

export const useCreateConfigTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (template: Partial<ConfigTemplate>) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('configuration_templates')
        .insert({
          name: template.name!,
          category: template.category!,
          configuration_type: template.configuration_type!,
          template_content: template.template_content!,
          description: template.description,
          vendor_id: template.vendor_id,
          model_id: template.model_id,
          subcategory: template.subcategory,
          complexity_level: template.complexity_level || 'intermediate',
          template_variables: template.template_variables || {},
          supported_scenarios: template.supported_scenarios || [],
          authentication_methods: template.authentication_methods || [],
          required_features: template.required_features || [],
          network_requirements: template.network_requirements || {},
          security_features: template.security_features || [],
          best_practices: template.best_practices || [],
          troubleshooting_guide: template.troubleshooting_guide || [],
          validation_commands: template.validation_commands || [],
          tags: template.tags || [],
          is_public: template.is_public ?? true,
          is_validated: template.is_validated ?? false,
          validation_notes: template.validation_notes,
          created_by: user.data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-templates'] });
      toast({
        title: "Success",
        description: "Configuration template created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create configuration template.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateConfigTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...template }: Partial<ConfigTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('configuration_templates')
        .update(template)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-templates'] });
      toast({
        title: "Success",
        description: "Configuration template updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update configuration template.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteConfigTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('configuration_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-templates'] });
      toast({
        title: "Success",
        description: "Configuration template deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete configuration template.",
        variant: "destructive",
      });
    },
  });
};

export const useGenerateConfigWithAI = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      vendor,
      model,
      configType,
      requirements,
      variables
    }: {
      vendor: string;
      model?: string;
      configType: string;
      requirements: string;
      variables?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-completion', {
        body: {
          prompt: `Generate a comprehensive ${configType} configuration for ${vendor}${model ? ` ${model}` : ''} switch/device with the following requirements: ${requirements}`,
          context: {
            vendor,
            model,
            configType,
            variables,
            task: 'config_generation'
          },
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.3,
          max_tokens: 4000
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Configuration generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate configuration.",
        variant: "destructive",
      });
    },
  });
};