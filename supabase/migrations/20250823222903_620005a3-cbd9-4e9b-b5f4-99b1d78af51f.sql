-- Smart Template Recommendation Engine
CREATE TABLE IF NOT EXISTS public.template_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID,
  site_id UUID,
  recommendation_type TEXT NOT NULL DEFAULT 'ai_powered',
  context_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  recommended_templates JSONB NOT NULL DEFAULT '[]'::JSONB,
  recommendation_scores JSONB NOT NULL DEFAULT '{}'::JSONB,
  applied_filters JSONB NOT NULL DEFAULT '{}'::JSONB,
  user_feedback JSONB DEFAULT '{}'::JSONB,
  confidence_score NUMERIC DEFAULT 0.8,
  recommendation_reason TEXT,
  recommendation_metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Enhanced Template Performance Analytics
CREATE TABLE IF NOT EXISTS public.template_performance_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL,
  performance_metrics JSONB NOT NULL DEFAULT '{}'::JSONB,
  usage_statistics JSONB NOT NULL DEFAULT '{}'::JSONB,
  success_rate NUMERIC DEFAULT 0.0,
  deployment_time_avg INTEGER DEFAULT 0,
  error_patterns JSONB DEFAULT '[]'::JSONB,
  optimization_suggestions JSONB DEFAULT '[]'::JSONB,
  complexity_analysis JSONB DEFAULT '{}'::JSONB,
  security_score NUMERIC DEFAULT 0.0,
  compliance_coverage JSONB DEFAULT '{}'::JSONB,
  vendor_compatibility JSONB DEFAULT '{}'::JSONB,
  last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Project Scoping Sessions
CREATE TABLE IF NOT EXISTS public.enhanced_scoping_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID,
  session_name TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'comprehensive',
  scoping_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  ai_analysis JSONB DEFAULT '{}'::JSONB,
  inventory_data JSONB DEFAULT '{}'::JSONB,
  requirements_analysis JSONB DEFAULT '{}'::JSONB,
  risk_assessment JSONB DEFAULT '{}'::JSONB,
  timeline_estimates JSONB DEFAULT '{}'::JSONB,
  cost_estimates JSONB DEFAULT '{}'::JSONB,
  recommended_approach JSONB DEFAULT '{}'::JSONB,
  stakeholder_mapping JSONB DEFAULT '{}'::JSONB,
  compliance_mapping JSONB DEFAULT '{}'::JSONB,
  vendor_recommendations JSONB DEFAULT '{}'::JSONB,
  phase_breakdown JSONB DEFAULT '{}'::JSONB,
  resource_requirements JSONB DEFAULT '{}'::JSONB,
  success_criteria JSONB DEFAULT '{}'::JSONB,
  completion_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enhanced Infrastructure Inventory
CREATE TABLE IF NOT EXISTS public.infrastructure_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  site_id UUID,
  scoping_session_id UUID,
  inventory_type TEXT NOT NULL DEFAULT 'comprehensive',
  device_catalog JSONB NOT NULL DEFAULT '{}'::JSONB,
  network_topology JSONB DEFAULT '{}'::JSONB,
  vendor_analysis JSONB DEFAULT '{}'::JSONB,
  capacity_analysis JSONB DEFAULT '{}'::JSONB,
  security_assessment JSONB DEFAULT '{}'::JSONB,
  compliance_status JSONB DEFAULT '{}'::JSONB,
  integration_readiness JSONB DEFAULT '{}'::JSONB,
  lifecycle_analysis JSONB DEFAULT '{}'::JSONB,
  cost_analysis JSONB DEFAULT '{}'::JSONB,
  risk_factors JSONB DEFAULT '{}'::JSONB,
  optimization_opportunities JSONB DEFAULT '{}'::JSONB,
  migration_requirements JSONB DEFAULT '{}'::JSONB,
  support_requirements JSONB DEFAULT '{}'::JSONB,
  performance_metrics JSONB DEFAULT '{}'::JSONB,
  ai_recommendations JSONB DEFAULT '{}'::JSONB,
  validation_status TEXT DEFAULT 'pending',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Smart Template Usage Tracking
CREATE TABLE IF NOT EXISTS public.smart_template_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL,
  user_id UUID NOT NULL,
  project_id UUID,
  site_id UUID,
  usage_context JSONB NOT NULL DEFAULT '{}'::JSONB,
  customizations_applied JSONB DEFAULT '{}'::JSONB,
  deployment_results JSONB DEFAULT '{}'::JSONB,
  performance_metrics JSONB DEFAULT '{}'::JSONB,
  user_rating INTEGER,
  feedback_notes TEXT,
  success_indicators JSONB DEFAULT '{}'::JSONB,
  issues_encountered JSONB DEFAULT '[]'::JSONB,
  resolution_notes TEXT,
  deployment_time_minutes INTEGER,
  configuration_complexity TEXT DEFAULT 'medium',
  vendor_compatibility_score NUMERIC DEFAULT 0.0,
  compliance_validation JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.template_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_scoping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_template_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for template_recommendations
CREATE POLICY "Users can manage their template recommendations"
ON public.template_recommendations
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Project owners can view template recommendations for their projects"
ON public.template_recommendations
FOR SELECT
USING (
  project_id IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = template_recommendations.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- RLS Policies for template_performance_analytics
CREATE POLICY "Template performance analytics are readable by authenticated users"
ON public.template_performance_analytics
FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage template performance analytics"
ON public.template_performance_analytics
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for enhanced_scoping_sessions
CREATE POLICY "Users can manage their scoping sessions"
ON public.enhanced_scoping_sessions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for infrastructure_inventory
CREATE POLICY "Users can manage their infrastructure inventory"
ON public.infrastructure_inventory
FOR ALL
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Project stakeholders can view infrastructure inventory"
ON public.infrastructure_inventory
FOR SELECT
USING (
  project_id IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = infrastructure_inventory.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- RLS Policies for smart_template_usage
CREATE POLICY "Users can manage their template usage records"
ON public.smart_template_usage
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_template_recommendations_user_id ON public.template_recommendations(user_id);
CREATE INDEX idx_template_recommendations_project_id ON public.template_recommendations(project_id);
CREATE INDEX idx_template_performance_analytics_template_id ON public.template_performance_analytics(template_id);
CREATE INDEX idx_enhanced_scoping_sessions_user_id ON public.enhanced_scoping_sessions(user_id);
CREATE INDEX idx_enhanced_scoping_sessions_project_id ON public.enhanced_scoping_sessions(project_id);
CREATE INDEX idx_infrastructure_inventory_project_id ON public.infrastructure_inventory(project_id);
CREATE INDEX idx_infrastructure_inventory_site_id ON public.infrastructure_inventory(site_id);
CREATE INDEX idx_smart_template_usage_template_id ON public.smart_template_usage(template_id);
CREATE INDEX idx_smart_template_usage_user_id ON public.smart_template_usage(user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_recommendations_updated_at
    BEFORE UPDATE ON public.template_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_performance_analytics_updated_at
    BEFORE UPDATE ON public.template_performance_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enhanced_scoping_sessions_updated_at
    BEFORE UPDATE ON public.enhanced_scoping_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_infrastructure_inventory_updated_at
    BEFORE UPDATE ON public.infrastructure_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_template_usage_updated_at
    BEFORE UPDATE ON public.smart_template_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();