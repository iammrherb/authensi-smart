import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import smartTemplateRecommendationEngine, { 
  RecommendationContext, 
  SmartRecommendationResult 
} from '@/services/SmartTemplateRecommendationEngine';

// Enhanced scoping sessions
export interface EnhancedScopingSession {
  id: string;
  user_id: string;
  project_id?: string;
  session_name: string;
  session_type: string;
  scoping_data: any;
  ai_analysis?: any;
  inventory_data?: any;
  requirements_analysis?: any;
  risk_assessment?: any;
  timeline_estimates?: any;
  cost_estimates?: any;
  recommended_approach?: any;
  stakeholder_mapping?: any;
  compliance_mapping?: any;
  vendor_recommendations?: any;
  phase_breakdown?: any;
  resource_requirements?: any;
  success_criteria?: any;
  completion_percentage: number;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// Infrastructure inventory
export interface InfrastructureInventory {
  id: string;
  project_id?: string;
  site_id?: string;
  scoping_session_id?: string;
  inventory_type: string;
  device_catalog: any;
  network_topology?: any;
  vendor_analysis?: any;
  capacity_analysis?: any;
  security_assessment?: any;
  compliance_status?: any;
  integration_readiness?: any;
  lifecycle_analysis?: any;
  cost_analysis?: any;
  risk_factors?: any;
  optimization_opportunities?: any;
  migration_requirements?: any;
  support_requirements?: any;
  performance_metrics?: any;
  ai_recommendations?: any;
  validation_status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Smart template recommendations
export interface TemplateRecommendation {
  id: string;
  user_id: string;
  project_id?: string;
  site_id?: string;
  recommendation_type: string;
  context_data: any;
  recommended_templates: string[];
  recommendation_scores: Record<string, number>;
  applied_filters: any;
  user_feedback?: any;
  confidence_score: number;
  recommendation_reason?: string;
  recommendation_metadata?: any;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
}

// Template performance analytics
export interface TemplatePerformanceAnalytics {
  id: string;
  template_id: string;
  performance_metrics: any;
  usage_statistics: any;
  success_rate: number;
  deployment_time_avg: number;
  error_patterns: any[];
  optimization_suggestions: any[];
  complexity_analysis: any;
  security_score: number;
  compliance_coverage: any;
  vendor_compatibility: any;
  last_analyzed: string;
  created_at: string;
  updated_at: string;
}

// Hooks for smart template recommendations
export const useGenerateSmartRecommendations = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (context: RecommendationContext): Promise<SmartRecommendationResult> => {
      try {
        const result = await smartTemplateRecommendationEngine.generateRecommendations(context);
        return result;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to generate recommendations');
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Smart template recommendations generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useTemplateRecommendations = (projectId?: string, siteId?: string) => {
  return useQuery({
    queryKey: ['template-recommendations', projectId, siteId],
    queryFn: async () => {
      let query = supabase
        .from('template_recommendations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TemplateRecommendation[];
    },
    enabled: !!(projectId || siteId),
  });
};

export const useTemplatePerformanceAnalytics = (templateIds?: string[]) => {
  return useQuery({
    queryKey: ['template-performance-analytics', templateIds],
    queryFn: async () => {
      let query = supabase
        .from('template_performance_analytics')
        .select('*')
        .order('last_analyzed', { ascending: false });

      if (templateIds?.length) {
        query = query.in('template_id', templateIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TemplatePerformanceAnalytics[];
    },
    enabled: !!templateIds?.length,
  });
};

// Enhanced scoping sessions hooks
export const useEnhancedScopingSessions = (projectId?: string) => {
  return useQuery({
    queryKey: ['enhanced-scoping-sessions', projectId],
    queryFn: async () => {
      let query = supabase
        .from('enhanced_scoping_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EnhancedScopingSession[];
    },
  });
};

export const useCreateEnhancedScopingSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionData: Omit<EnhancedScopingSession, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('enhanced_scoping_sessions')
        .insert([{
          ...sessionData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-scoping-sessions'] });
      toast({
        title: "Success",
        description: "Enhanced scoping session created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create scoping session: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEnhancedScopingSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<EnhancedScopingSession> & { id: string }) => {
      const { data, error } = await supabase
        .from('enhanced_scoping_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-scoping-sessions'] });
      toast({
        title: "Success",
        description: "Scoping session updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update scoping session: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Infrastructure inventory hooks
export const useInfrastructureInventory = (projectId?: string, siteId?: string) => {
  return useQuery({
    queryKey: ['infrastructure-inventory', projectId, siteId],
    queryFn: async () => {
      let query = supabase
        .from('infrastructure_inventory')
        .select('*')
        .order('updated_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as InfrastructureInventory[];
    },
    enabled: !!(projectId || siteId),
  });
};

export const useCreateInfrastructureInventory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inventoryData: Omit<InfrastructureInventory, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('infrastructure_inventory')
        .insert([{
          ...inventoryData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure-inventory'] });
      toast({
        title: "Success",
        description: "Infrastructure inventory created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create infrastructure inventory: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateInfrastructureInventory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InfrastructureInventory> & { id: string }) => {
      const { data, error } = await supabase
        .from('infrastructure_inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure-inventory'] });
      toast({
        title: "Success",
        description: "Infrastructure inventory updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update infrastructure inventory: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Template usage tracking
export const useTrackTemplateUsage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (usageData: {
      templateId: string;
      projectId?: string;
      siteId?: string;
      usageContext: any;
      customizationsApplied?: any;
      deploymentResults?: any;
      performanceMetrics?: any;
      userRating?: number;
      feedbackNotes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('smart_template_usage')
        .insert([{
          template_id: usageData.templateId,
          user_id: user.id,
          project_id: usageData.projectId,
          site_id: usageData.siteId,
          usage_context: usageData.usageContext,
          customizations_applied: usageData.customizationsApplied || {},
          deployment_results: usageData.deploymentResults || {},
          performance_metrics: usageData.performanceMetrics || {},
          user_rating: usageData.userRating,
          feedback_notes: usageData.feedbackNotes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template usage tracked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to track template usage: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProvideFeedback = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      recommendationId, 
      feedback 
    }: { 
      recommendationId: string; 
      feedback: any 
    }) => {
      const { data, error } = await supabase
        .from('template_recommendations')
        .update({ user_feedback: feedback })
        .eq('id', recommendationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-recommendations'] });
      toast({
        title: "Success",
        description: "Feedback provided successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to provide feedback: " + error.message,
        variant: "destructive",
      });
    },
  });
};