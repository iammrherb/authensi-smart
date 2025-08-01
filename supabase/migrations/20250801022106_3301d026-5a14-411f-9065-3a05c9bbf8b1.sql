-- Create comprehensive resource library tables

-- Industry options table
CREATE TABLE public.industry_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance frameworks table
CREATE TABLE public.compliance_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  industry_specific JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Deployment types table
CREATE TABLE public.deployment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  complexity_level TEXT DEFAULT 'medium',
  typical_timeline TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security levels table
CREATE TABLE public.security_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  compliance_mappings JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Business domains table
CREATE TABLE public.business_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_use_cases JSONB DEFAULT '[]'::jsonb,
  industry_alignment JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced vendor models table
CREATE TABLE public.vendor_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_version TEXT,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  supported_features JSONB DEFAULT '[]'::jsonb,
  firmware_requirements JSONB DEFAULT '{}'::jsonb,
  configuration_templates JSONB DEFAULT '{}'::jsonb,
  documentation_links JSONB DEFAULT '[]'::jsonb,
  compatibility_matrix JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(vendor_id, model_name, model_version)
);

-- Enhanced requirements library table (update existing)
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS validation_criteria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS industry_specific JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS compliance_mappings JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS portnox_features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.requirements_library ADD COLUMN IF NOT EXISTS vendor_requirements JSONB DEFAULT '[]'::jsonb;

-- Enhanced use cases library table (update existing)
ALTER TABLE public.use_cases_library ADD COLUMN IF NOT EXISTS vendor_requirements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.use_cases_library ADD COLUMN IF NOT EXISTS compliance_requirements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.use_cases_library ADD COLUMN IF NOT EXISTS integration_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.use_cases_library ADD COLUMN IF NOT EXISTS configuration_templates JSONB DEFAULT '[]'::jsonb;

-- Project phases table
CREATE TABLE public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_duration TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  phase_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Authentication methods table
CREATE TABLE public.authentication_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  method_type TEXT NOT NULL,
  security_level TEXT DEFAULT 'medium',
  vendor_support JSONB DEFAULT '[]'::jsonb,
  configuration_complexity TEXT DEFAULT 'medium',
  documentation_links JSONB DEFAULT '[]'::jsonb,
  portnox_integration JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Network segments table
CREATE TABLE public.network_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment_type TEXT NOT NULL,
  description TEXT,
  typical_size_range TEXT,
  security_requirements JSONB DEFAULT '[]'::jsonb,
  vendor_considerations JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.industry_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authentication_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_segments ENABLE ROW LEVEL SECURITY;

-- Create policies for resource library tables
CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.industry_options FOR SELECT USING (true);

CREATE POLICY "Users can create industry options" 
ON public.industry_options FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update industry options they created" 
ON public.industry_options FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Apply similar policies to all resource tables
CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.compliance_frameworks FOR SELECT USING (true);

CREATE POLICY "Users can create compliance frameworks" 
ON public.compliance_frameworks FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update compliance frameworks they created" 
ON public.compliance_frameworks FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.deployment_types FOR SELECT USING (true);

CREATE POLICY "Users can create deployment types" 
ON public.deployment_types FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update deployment types they created" 
ON public.deployment_types FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.security_levels FOR SELECT USING (true);

CREATE POLICY "Users can create security levels" 
ON public.security_levels FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update security levels they created" 
ON public.security_levels FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.business_domains FOR SELECT USING (true);

CREATE POLICY "Users can create business domains" 
ON public.business_domains FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update business domains they created" 
ON public.business_domains FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.vendor_models FOR SELECT USING (true);

CREATE POLICY "Users can create vendor models" 
ON public.vendor_models FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update vendor models they created" 
ON public.vendor_models FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.project_phases FOR SELECT USING (true);

CREATE POLICY "Users can create project phases" 
ON public.project_phases FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update project phases they created" 
ON public.project_phases FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.authentication_methods FOR SELECT USING (true);

CREATE POLICY "Users can create authentication methods" 
ON public.authentication_methods FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update authentication methods they created" 
ON public.authentication_methods FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Resource library tables are readable by authenticated users" 
ON public.network_segments FOR SELECT USING (true);

CREATE POLICY "Users can create network segments" 
ON public.network_segments FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update network segments they created" 
ON public.network_segments FOR UPDATE USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default data
INSERT INTO public.industry_options (name, description, category) VALUES
('Manufacturing', 'Industrial and manufacturing environments', 'industrial'),
('Healthcare', 'Healthcare and medical facilities', 'regulated'),
('Financial Services', 'Banks, credit unions, and financial institutions', 'regulated'),
('Education', 'Schools, universities, and educational institutions', 'public'),
('Government', 'Federal, state, and local government agencies', 'public'),
('Retail', 'Retail stores and e-commerce', 'commercial'),
('Technology', 'Technology companies and startups', 'commercial'),
('Energy & Utilities', 'Power generation and utility companies', 'industrial');

INSERT INTO public.compliance_frameworks (name, description, requirements) VALUES
('PCI DSS', 'Payment Card Industry Data Security Standard', '["Secure network architecture", "Data encryption", "Access controls", "Regular monitoring"]'::jsonb),
('HIPAA', 'Health Insurance Portability and Accountability Act', '["Patient data protection", "Access auditing", "Encryption requirements", "Risk assessments"]'::jsonb),
('SOX', 'Sarbanes-Oxley Act', '["Financial data integrity", "Access controls", "Audit trails", "Change management"]'::jsonb),
('GDPR', 'General Data Protection Regulation', '["Data privacy", "Consent management", "Data breach notification", "Right to erasure"]'::jsonb),
('NIST', 'National Institute of Standards and Technology', '["Risk management", "Security controls", "Continuous monitoring", "Incident response"]'::jsonb);

INSERT INTO public.deployment_types (name, description, complexity_level, typical_timeline) VALUES
('Cloud-First', 'Primary deployment in cloud infrastructure', 'medium', '8-12 weeks'),
('Hybrid', 'Mix of on-premises and cloud components', 'high', '12-16 weeks'),
('On-Premises', 'Fully on-premises deployment', 'medium', '10-14 weeks'),
('Multi-Cloud', 'Deployment across multiple cloud providers', 'high', '16-20 weeks');

INSERT INTO public.security_levels (name, description, requirements) VALUES
('Standard', 'Basic security requirements for most environments', '["Basic access controls", "Standard encryption", "Regular updates"]'::jsonb),
('Enhanced', 'Higher security for sensitive environments', '["Multi-factor authentication", "Advanced encryption", "Detailed auditing", "Network segmentation"]'::jsonb),
('High-Security', 'Maximum security for critical environments', '["Zero-trust architecture", "Advanced threat protection", "Real-time monitoring", "Strict access controls"]'::jsonb);

INSERT INTO public.authentication_methods (name, description, method_type, security_level) VALUES
('802.1X', 'IEEE 802.1X port-based network access control', 'certificate', 'high'),
('RADIUS', 'Remote Authentication Dial-In User Service', 'credential', 'medium'),
('LDAP', 'Lightweight Directory Access Protocol', 'credential', 'medium'),
('SAML SSO', 'Security Assertion Markup Language Single Sign-On', 'federated', 'high'),
('Active Directory', 'Microsoft Active Directory integration', 'credential', 'medium'),
('TACACS+', 'Terminal Access Controller Access-Control System Plus', 'credential', 'high');

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_industry_options_updated_at BEFORE UPDATE ON public.industry_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON public.compliance_frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deployment_types_updated_at BEFORE UPDATE ON public.deployment_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_levels_updated_at BEFORE UPDATE ON public.security_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_domains_updated_at BEFORE UPDATE ON public.business_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_models_updated_at BEFORE UPDATE ON public.vendor_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON public.project_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_authentication_methods_updated_at BEFORE UPDATE ON public.authentication_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_network_segments_updated_at BEFORE UPDATE ON public.network_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();