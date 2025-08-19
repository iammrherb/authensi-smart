-- =============================================================================
-- COMPREHENSIVE DATABASE SECURITY AND FUNCTIONALITY MIGRATION
-- =============================================================================

-- First, fix function search path security issues
ALTER FUNCTION public.update_workflow_sessions_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_tracking_sessions_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_session_last_activity() SET search_path = 'public';
ALTER FUNCTION public.update_customer_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.update_session_activity() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';

-- =============================================================================
-- CREATE MISSING CORE TABLES FOR COMPREHENSIVE FUNCTIONALITY
-- =============================================================================

-- AI Provider Management Table
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL UNIQUE,
  api_endpoint TEXT NOT NULL,
  supported_models JSONB NOT NULL DEFAULT '[]'::jsonb,
  authentication_method TEXT NOT NULL DEFAULT 'api_key',
  rate_limits JSONB DEFAULT '{}'::jsonb,
  capabilities JSONB DEFAULT '[]'::jsonb,
  pricing_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- User AI Provider Configuration
CREATE TABLE IF NOT EXISTS public.user_ai_provider_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES ai_providers(id),
  api_key_encrypted TEXT,
  model_preferences JSONB DEFAULT '{}'::jsonb,
  usage_limits JSONB DEFAULT '{}'::jsonb,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider_id)
);

-- AI Usage Analytics
CREATE TABLE IF NOT EXISTS public.ai_usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES ai_providers(id),
  model_used TEXT NOT NULL,
  request_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Project Files and Knowledge Base
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ai_analysis_status TEXT DEFAULT 'pending',
  ai_extracted_content JSONB DEFAULT '{}'::jsonb,
  ai_tags JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  access_level TEXT DEFAULT 'project_team',
  version_number INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Site Files and Documentation
CREATE TABLE IF NOT EXISTS public.site_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ai_analysis_status TEXT DEFAULT 'pending',
  ai_extracted_content JSONB DEFAULT '{}'::jsonb,
  ai_tags JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  access_level TEXT DEFAULT 'site_team',
  version_number INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enhanced Vendor Integration and API Management
CREATE TABLE IF NOT EXISTS public.vendor_api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  integration_type TEXT NOT NULL,
  api_endpoint TEXT,
  authentication_method TEXT DEFAULT 'api_key',
  credentials_encrypted TEXT,
  supported_operations JSONB DEFAULT '[]'::jsonb,
  rate_limits JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'inactive',
  last_tested TIMESTAMP WITH TIME ZONE,
  test_results JSONB DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Portnox Integration Enhancement
CREATE TABLE IF NOT EXISTS public.portnox_site_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  portnox_site_id TEXT,
  configuration_data JSONB DEFAULT '{}'::jsonb,
  deployment_status TEXT DEFAULT 'planned',
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_errors JSONB DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Security and Compliance Tracking
CREATE TABLE IF NOT EXISTS public.security_compliance_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  site_id UUID REFERENCES sites(id),
  framework_type TEXT NOT NULL,
  assessment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  compliance_score NUMERIC(5,2),
  findings JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  assessed_by UUID NOT NULL REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_project_or_site CHECK (
    (project_id IS NOT NULL AND site_id IS NULL) OR 
    (project_id IS NULL AND site_id IS NOT NULL)
  )
);

-- Advanced Workflow and Automation
CREATE TABLE IF NOT EXISTS public.workflow_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  workflow_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  automation_rules JSONB DEFAULT '{}'::jsonb,
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow Instances
CREATE TABLE IF NOT EXISTS public.workflow_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES workflow_templates(id),
  project_id UUID REFERENCES projects(id),
  site_id UUID REFERENCES sites(id),
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  step_data JSONB DEFAULT '{}'::jsonb,
  execution_log JSONB DEFAULT '[]'::jsonb,
  started_by UUID NOT NULL REFERENCES profiles(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- CREATE MISSING RLS POLICIES FOR TABLES WITHOUT POLICIES
-- =============================================================================

-- AI Providers
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI providers are viewable by authenticated users" 
ON public.ai_providers 
FOR SELECT 
USING (true);

CREATE POLICY "Super admins can manage AI providers" 
ON public.ai_providers 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- User AI Provider Configs
ALTER TABLE public.user_ai_provider_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI provider configs" 
ON public.user_ai_provider_configs 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own AI provider configs" 
ON public.user_ai_provider_configs 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- AI Usage Analytics
ALTER TABLE public.ai_usage_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI usage" 
ON public.ai_usage_analytics 
FOR SELECT 
USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can create AI usage records" 
ON public.ai_usage_analytics 
FOR INSERT 
WITH CHECK (true);

-- Project Files
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project files for their projects" 
ON public.project_files 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_files.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

CREATE POLICY "Users can manage project files for their projects" 
ON public.project_files 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_files.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = project_files.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- Site Files
ALTER TABLE public.site_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view site files for their sites" 
ON public.site_files 
FOR SELECT 
USING (user_owns_site(site_id));

CREATE POLICY "Users can manage site files for their sites" 
ON public.site_files 
FOR ALL 
USING (user_owns_site(site_id))
WITH CHECK (user_owns_site(site_id));

-- Vendor API Integrations
ALTER TABLE public.vendor_api_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendor integrations" 
ON public.vendor_api_integrations 
FOR SELECT 
USING (true);

CREATE POLICY "Authorized users can manage vendor integrations" 
ON public.vendor_api_integrations 
FOR ALL 
USING (
  created_by = auth.uid() OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'technical_account_manager'::app_role)
)
WITH CHECK (
  created_by = auth.uid() OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'technical_account_manager'::app_role)
);

-- Portnox Site Configurations
ALTER TABLE public.portnox_site_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view Portnox configs for their sites" 
ON public.portnox_site_configurations 
FOR SELECT 
USING (user_owns_site(site_id));

CREATE POLICY "Users can manage Portnox configs for their sites" 
ON public.portnox_site_configurations 
FOR ALL 
USING (user_owns_site(site_id))
WITH CHECK (user_owns_site(site_id));

-- Security Compliance Assessments
ALTER TABLE public.security_compliance_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assessments for their projects/sites" 
ON public.security_compliance_assessments 
FOR SELECT 
USING (
  (project_id IS NOT NULL AND user_owns_project(project_id)) OR
  (site_id IS NOT NULL AND user_owns_site(site_id)) OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Authorized users can manage assessments" 
ON public.security_compliance_assessments 
FOR ALL 
USING (
  assessed_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'technical_account_manager'::app_role)
)
WITH CHECK (
  assessed_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'technical_account_manager'::app_role)
);

-- Workflow Templates
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public workflow templates" 
ON public.workflow_templates 
FOR SELECT 
USING (is_public = true OR created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can manage their own workflow templates" 
ON public.workflow_templates 
FOR ALL 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Workflow Instances
ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow instances for their projects/sites" 
ON public.workflow_instances 
FOR SELECT 
USING (
  started_by = auth.uid() OR
  (project_id IS NOT NULL AND user_owns_project(project_id)) OR
  (site_id IS NOT NULL AND user_owns_site(site_id)) OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can manage workflow instances they started" 
ON public.workflow_instances 
FOR ALL 
USING (started_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (started_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- =============================================================================
-- CREATE ESSENTIAL INDEXES FOR PERFORMANCE
-- =============================================================================

-- AI and Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_user_date ON public.ai_usage_analytics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_provider ON public.ai_usage_analytics(provider_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_ai_configs_primary ON public.user_ai_provider_configs(user_id, is_primary) WHERE is_primary = true;

-- File Management Indexes
CREATE INDEX IF NOT EXISTS idx_project_files_project_type ON public.project_files(project_id, file_type);
CREATE INDEX IF NOT EXISTS idx_site_files_site_type ON public.site_files(site_id, file_type);
CREATE INDEX IF NOT EXISTS idx_project_files_ai_status ON public.project_files(ai_analysis_status);
CREATE INDEX IF NOT EXISTS idx_site_files_ai_status ON public.site_files(ai_analysis_status);

-- Integration and Security Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_integrations_vendor ON public.vendor_api_integrations(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_portnox_configs_site ON public.portnox_site_configurations(site_id, deployment_status);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_project ON public.security_compliance_assessments(project_id, framework_type);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_site ON public.security_compliance_assessments(site_id, framework_type);

-- Workflow Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_instances_template ON public.workflow_instances(template_id, status);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_project ON public.workflow_instances(project_id, status);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_site ON public.workflow_instances(site_id, status);

-- =============================================================================
-- CREATE TRIGGERS FOR AUTOMATIC TIMESTAMPING
-- =============================================================================

-- AI Provider triggers
CREATE TRIGGER update_ai_providers_updated_at
  BEFORE UPDATE ON public.ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ai_configs_updated_at
  BEFORE UPDATE ON public.user_ai_provider_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_integrations_updated_at
  BEFORE UPDATE ON public.vendor_api_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portnox_configs_updated_at
  BEFORE UPDATE ON public.portnox_site_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_assessments_updated_at
  BEFORE UPDATE ON public.security_compliance_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at
  BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- INSERT DEFAULT AI PROVIDERS
-- =============================================================================

INSERT INTO public.ai_providers (provider_name, api_endpoint, supported_models, capabilities, pricing_info) VALUES
('OpenAI', 'https://api.openai.com/v1', 
 '["gpt-5-2025-08-07", "gpt-5-mini-2025-08-07", "gpt-5-nano-2025-08-07", "gpt-4.1-2025-04-14", "o3-2025-04-16", "o4-mini-2025-04-16", "gpt-4o", "gpt-4o-mini"]'::jsonb,
 '["text-generation", "code-generation", "analysis", "reasoning", "vision"]'::jsonb,
 '{"model_pricing": {"gpt-5": {"input": 10, "output": 30}, "gpt-4": {"input": 5, "output": 15}}}'::jsonb),

('Anthropic', 'https://api.anthropic.com/v1', 
 '["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"]'::jsonb,
 '["text-generation", "analysis", "reasoning", "code-generation"]'::jsonb,
 '{"model_pricing": {"claude-3-5-sonnet": {"input": 3, "output": 15}}}'::jsonb),

('Google', 'https://generativelanguage.googleapis.com/v1', 
 '["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"]'::jsonb,
 '["text-generation", "analysis", "vision", "multimodal"]'::jsonb,
 '{"model_pricing": {"gemini-1.5-pro": {"input": 2.5, "output": 7.5}}}'::jsonb)
ON CONFLICT (provider_name) DO NOTHING;

-- =============================================================================
-- INSERT DEFAULT WORKFLOW TEMPLATES
-- =============================================================================

INSERT INTO public.workflow_templates (name, description, category, workflow_steps, is_public, created_by) VALUES
('Project Onboarding', 'Standard project onboarding workflow', 'project_management', 
 '[{"step": 1, "name": "Initial Assessment", "type": "form", "fields": ["requirements", "timeline", "budget"]}, 
   {"step": 2, "name": "Site Survey", "type": "checklist", "items": ["network_topology", "device_inventory"]}, 
   {"step": 3, "name": "Design Review", "type": "approval", "reviewers": ["technical_lead"]}]'::jsonb,
 true, (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1)),

('Site Deployment', 'Comprehensive site deployment workflow', 'deployment', 
 '[{"step": 1, "name": "Pre-deployment Checklist", "type": "checklist"}, 
   {"step": 2, "name": "Configuration Deployment", "type": "automation"}, 
   {"step": 3, "name": "Testing & Validation", "type": "testing"}, 
   {"step": 4, "name": "Go-Live Approval", "type": "approval"}]'::jsonb,
 true, (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1)),

('Security Assessment', 'Security compliance assessment workflow', 'security', 
 '[{"step": 1, "name": "Vulnerability Scan", "type": "automation"}, 
   {"step": 2, "name": "Policy Review", "type": "manual"}, 
   {"step": 3, "name": "Compliance Check", "type": "checklist"}, 
   {"step": 4, "name": "Report Generation", "type": "automation"}]'::jsonb,
 true, (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1))
ON CONFLICT DO NOTHING;

-- =============================================================================
-- CREATE SYSTEM SETTINGS FOR AI INTEGRATION
-- =============================================================================

INSERT INTO public.system_settings (setting_key, setting_value, created_by) VALUES
('ai_integration_settings', 
 '{"auto_analysis_enabled": true, "default_provider": "openai", "max_tokens_per_request": 4000, "analysis_confidence_threshold": 0.8}'::jsonb,
 (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1)),

('portnox_integration_settings', 
 '{"auto_sync_enabled": true, "sync_interval_minutes": 15, "max_retry_attempts": 3, "webhook_enabled": true}'::jsonb,
 (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1)),

('security_compliance_settings', 
 '{"auto_assessment_enabled": true, "required_frameworks": ["SOC2", "ISO27001"], "assessment_schedule": "monthly"}'::jsonb,
 (SELECT id FROM profiles WHERE email = (SELECT get_current_user_email()) LIMIT 1))
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- =============================================================================
-- FINAL SECURITY HARDENING
-- =============================================================================

-- Ensure all user-owned tables have proper NOT NULL constraints on created_by
-- (This is informational - actual changes would be done per table as needed)

-- Create comprehensive audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM log_security_event(
      'sensitive_data_deletion',
      jsonb_build_object(
        'table_name', TG_TABLE_NAME,
        'deleted_record_id', OLD.id,
        'operation', TG_OP
      )
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_security_event(
      'sensitive_data_modification',
      jsonb_build_object(
        'table_name', TG_TABLE_NAME,
        'record_id', NEW.id,
        'operation', TG_OP,
        'changes', to_jsonb(NEW) - to_jsonb(OLD)
      )
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_user_roles_changes
  AFTER UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

CREATE TRIGGER audit_ai_provider_configs_changes
  AFTER UPDATE OR DELETE ON public.user_ai_provider_configs
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

-- Enable realtime for critical tables
ALTER TABLE public.ai_usage_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.workflow_instances REPLICA IDENTITY FULL;
ALTER TABLE public.security_compliance_assessments REPLICA IDENTITY FULL;