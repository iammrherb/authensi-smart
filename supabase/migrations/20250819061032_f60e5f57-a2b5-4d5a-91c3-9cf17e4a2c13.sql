-- Create comprehensive report storage and template management system

-- Report templates storage
CREATE TABLE IF NOT EXISTS public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('executive-summary', 'technical-deep-dive', 'security-assessment', 'roi-analysis', 'deployment-readiness', 'ai-insights', 'custom')),
  content_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'enterprise',
  complexity_level TEXT DEFAULT 'intermediate' CHECK (complexity_level IN ('basic', 'intermediate', 'advanced', 'expert')),
  estimated_time_minutes INTEGER DEFAULT 5,
  ai_prompt_template TEXT,
  formatting_rules JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0
);

-- Generated reports storage
CREATE TABLE IF NOT EXISTS public.generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  report_type TEXT NOT NULL,
  template_id UUID REFERENCES public.report_templates(id),
  content TEXT NOT NULL,
  content_html TEXT,
  analytics_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  project_ids JSONB DEFAULT '[]'::jsonb,
  site_ids JSONB DEFAULT '[]'::jsonb,
  file_size_bytes INTEGER,
  export_formats JSONB DEFAULT '["pdf", "docx", "html"]'::jsonb,
  is_favorite BOOLEAN DEFAULT false,
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'team', 'organization', 'public')),
  expiry_date TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Report generations tracking
CREATE TABLE IF NOT EXISTS public.report_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.generated_reports(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.report_templates(id),
  user_id UUID REFERENCES auth.users(id),
  generation_trigger TEXT DEFAULT 'manual',
  ai_model_used TEXT,
  processing_time_ms INTEGER,
  input_parameters JSONB DEFAULT '{}'::jsonb,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  tokens_used INTEGER,
  cost_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for report_templates
CREATE POLICY "Public templates are viewable by everyone" ON public.report_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates" ON public.report_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON public.report_templates
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for generated_reports
CREATE POLICY "Users can view their own reports" ON public.generated_reports
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create reports" ON public.generated_reports
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own reports" ON public.generated_reports
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own reports" ON public.generated_reports
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for report_generation_history
CREATE POLICY "Users can view their generation history" ON public.report_generation_history
  FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can create generation history" ON public.report_generation_history
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_templates_type ON public.report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_generated_reports_created_by ON public.generated_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_generated_reports_type ON public.generated_reports(report_type);

-- Insert default report templates
INSERT INTO public.report_templates (name, description, template_type, content_template, ai_prompt_template, tags, category, complexity_level, estimated_time_minutes) VALUES
('Executive Summary Report', 'High-level strategic overview for C-level executives', 'executive-summary', 
'# Executive Summary\n\n## Strategic Overview\n{strategic_overview}\n\n## Key Metrics\n{key_metrics}\n\n## Financial Impact\n{financial_impact}\n\n## Recommendations\n{recommendations}',
'Generate a comprehensive executive summary focusing on strategic business impact, ROI, and high-level recommendations for network access control implementation.',
'["executive", "strategic", "c-level"]', 'enterprise', 'intermediate', 3),

('Technical Implementation Guide', 'Detailed technical documentation and implementation details', 'technical-deep-dive',
'# Technical Implementation Guide\n\n## Architecture Overview\n{architecture}\n\n## Configuration Details\n{configuration}\n\n## Security Framework\n{security}\n\n## Performance Metrics\n{performance}',
'Create detailed technical documentation including architecture diagrams, configuration steps, security protocols, and performance specifications.',
'["technical", "implementation", "detailed"]', 'enterprise', 'advanced', 7),

('Security & Compliance Assessment', 'Comprehensive security analysis and compliance reporting', 'security-assessment',
'# Security & Compliance Assessment\n\n## Risk Analysis\n{risk_analysis}\n\n## Compliance Status\n{compliance}\n\n## Security Controls\n{security_controls}\n\n## Recommendations\n{security_recommendations}',
'Conduct a thorough security assessment including risk analysis, compliance mapping, security controls evaluation, and detailed security recommendations.',
'["security", "compliance", "risk"]', 'security', 'expert', 5),

('ROI & Business Impact Analysis', 'Financial analysis and return on investment calculations', 'roi-analysis',
'# ROI & Business Impact Analysis\n\n## Investment Summary\n{investment}\n\n## Cost Benefits\n{cost_benefits}\n\n## ROI Calculation\n{roi_calculation}\n\n## Business Value\n{business_value}',
'Analyze the financial impact and return on investment, including cost savings, risk mitigation value, and business benefits.',
'["roi", "financial", "business"]', 'business', 'intermediate', 4),

('Deployment Readiness Checklist', 'Pre-deployment assessment and readiness validation', 'deployment-readiness',
'# Deployment Readiness Assessment\n\n## Readiness Checklist\n{checklist}\n\n## Resource Requirements\n{resources}\n\n## Timeline Analysis\n{timeline}\n\n## Risk Mitigation\n{risk_mitigation}',
'Create a comprehensive deployment readiness assessment including checklists, resource requirements, timeline analysis, and risk mitigation strategies.',
'["deployment", "readiness", "checklist"]', 'operations', 'intermediate', 4),

('AI-Powered Analytics Report', 'Machine learning insights and predictive analysis', 'ai-insights',
'# AI-Powered Analytics Report\n\n## Predictive Insights\n{predictions}\n\n## Pattern Analysis\n{patterns}\n\n## Optimization Opportunities\n{optimizations}\n\n## AI Recommendations\n{ai_recommendations}',
'Generate AI-powered insights using machine learning analysis, predictive modeling, and intelligent recommendations based on data patterns.',
'["ai", "analytics", "insights", "predictive"]', 'innovation', 'expert', 6);