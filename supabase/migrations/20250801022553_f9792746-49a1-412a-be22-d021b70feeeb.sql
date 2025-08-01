-- Create remaining resource library tables (excluding vendor_models which exists)

-- Industry options table
CREATE TABLE IF NOT EXISTS public.industry_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance frameworks table  
CREATE TABLE IF NOT EXISTS public.compliance_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  industry_specific JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Deployment types table
CREATE TABLE IF NOT EXISTS public.deployment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  complexity_level TEXT DEFAULT 'medium',
  typical_timeline TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security levels table
CREATE TABLE IF NOT EXISTS public.security_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  compliance_mappings JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Business domains table
CREATE TABLE IF NOT EXISTS public.business_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_use_cases JSONB DEFAULT '[]'::jsonb,
  industry_alignment JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Project phases table
CREATE TABLE IF NOT EXISTS public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  typical_duration TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  phase_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Authentication methods table
CREATE TABLE IF NOT EXISTS public.authentication_methods (
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
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Network segments table
CREATE TABLE IF NOT EXISTS public.network_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment_type TEXT NOT NULL,
  description TEXT,
  typical_size_range TEXT,
  security_requirements JSONB DEFAULT '[]'::jsonb,
  vendor_considerations JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.industry_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authentication_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_segments ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
DO $$ 
BEGIN
  -- Industry options policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'industry_options' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.industry_options FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'industry_options' AND policyname = 'Users can create industry options') THEN
    CREATE POLICY "Users can create industry options" ON public.industry_options FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'industry_options' AND policyname = 'Users can update industry options') THEN
    CREATE POLICY "Users can update industry options" ON public.industry_options FOR UPDATE USING (true);
  END IF;

  -- Similar policies for other tables
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compliance_frameworks' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.compliance_frameworks FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compliance_frameworks' AND policyname = 'Users can create compliance frameworks') THEN
    CREATE POLICY "Users can create compliance frameworks" ON public.compliance_frameworks FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compliance_frameworks' AND policyname = 'Users can update compliance frameworks') THEN
    CREATE POLICY "Users can update compliance frameworks" ON public.compliance_frameworks FOR UPDATE USING (true);
  END IF;

  -- Continue with remaining tables...
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_types' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.deployment_types FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_types' AND policyname = 'Users can create deployment types') THEN
    CREATE POLICY "Users can create deployment types" ON public.deployment_types FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_types' AND policyname = 'Users can update deployment types') THEN
    CREATE POLICY "Users can update deployment types" ON public.deployment_types FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_levels' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.security_levels FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_levels' AND policyname = 'Users can create security levels') THEN
    CREATE POLICY "Users can create security levels" ON public.security_levels FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_levels' AND policyname = 'Users can update security levels') THEN
    CREATE POLICY "Users can update security levels" ON public.security_levels FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_domains' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.business_domains FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_domains' AND policyname = 'Users can create business domains') THEN
    CREATE POLICY "Users can create business domains" ON public.business_domains FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_domains' AND policyname = 'Users can update business domains') THEN
    CREATE POLICY "Users can update business domains" ON public.business_domains FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_phases' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.project_phases FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_phases' AND policyname = 'Users can create project phases') THEN
    CREATE POLICY "Users can create project phases" ON public.project_phases FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_phases' AND policyname = 'Users can update project phases') THEN
    CREATE POLICY "Users can update project phases" ON public.project_phases FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'authentication_methods' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.authentication_methods FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'authentication_methods' AND policyname = 'Users can create authentication methods') THEN
    CREATE POLICY "Users can create authentication methods" ON public.authentication_methods FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'authentication_methods' AND policyname = 'Users can update authentication methods') THEN
    CREATE POLICY "Users can update authentication methods" ON public.authentication_methods FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'network_segments' AND policyname = 'Resource library readable by authenticated users') THEN
    CREATE POLICY "Resource library readable by authenticated users" ON public.network_segments FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'network_segments' AND policyname = 'Users can create network segments') THEN
    CREATE POLICY "Users can create network segments" ON public.network_segments FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'network_segments' AND policyname = 'Users can update network segments') THEN
    CREATE POLICY "Users can update network segments" ON public.network_segments FOR UPDATE USING (true);
  END IF;
END $$;

-- Insert default data
INSERT INTO public.industry_options (name, description, category) VALUES
('Manufacturing', 'Industrial and manufacturing environments', 'industrial'),
('Healthcare', 'Healthcare and medical facilities', 'regulated'),
('Financial Services', 'Banks, credit unions, and financial institutions', 'regulated'),
('Education', 'Schools, universities, and educational institutions', 'public'),
('Government', 'Federal, state, and local government agencies', 'public'),
('Retail', 'Retail stores and e-commerce', 'commercial'),
('Technology', 'Technology companies and startups', 'commercial'),
('Energy & Utilities', 'Power generation and utility companies', 'industrial')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.compliance_frameworks (name, description, requirements) VALUES
('PCI DSS', 'Payment Card Industry Data Security Standard', '["Secure network architecture", "Data encryption", "Access controls", "Regular monitoring"]'::jsonb),
('HIPAA', 'Health Insurance Portability and Accountability Act', '["Patient data protection", "Access auditing", "Encryption requirements", "Risk assessments"]'::jsonb),
('SOX', 'Sarbanes-Oxley Act', '["Financial data integrity", "Access controls", "Audit trails", "Change management"]'::jsonb),
('GDPR', 'General Data Protection Regulation', '["Data privacy", "Consent management", "Data breach notification", "Right to erasure"]'::jsonb),
('NIST', 'National Institute of Standards and Technology', '["Risk management", "Security controls", "Continuous monitoring", "Incident response"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.deployment_types (name, description, complexity_level, typical_timeline) VALUES
('Cloud-First', 'Primary deployment in cloud infrastructure', 'medium', '8-12 weeks'),
('Hybrid', 'Mix of on-premises and cloud components', 'high', '12-16 weeks'),
('On-Premises', 'Fully on-premises deployment', 'medium', '10-14 weeks'),
('Multi-Cloud', 'Deployment across multiple cloud providers', 'high', '16-20 weeks')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.security_levels (name, description, requirements) VALUES
('Standard', 'Basic security requirements for most environments', '["Basic access controls", "Standard encryption", "Regular updates"]'::jsonb),
('Enhanced', 'Higher security for sensitive environments', '["Multi-factor authentication", "Advanced encryption", "Detailed auditing", "Network segmentation"]'::jsonb),
('High-Security', 'Maximum security for critical environments', '["Zero-trust architecture", "Advanced threat protection", "Real-time monitoring", "Strict access controls"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.authentication_methods (name, description, method_type, security_level) VALUES
('802.1X', 'IEEE 802.1X port-based network access control', 'certificate', 'high'),
('RADIUS', 'Remote Authentication Dial-In User Service', 'credential', 'medium'),
('LDAP', 'Lightweight Directory Access Protocol', 'credential', 'medium'),
('SAML SSO', 'Security Assertion Markup Language Single Sign-On', 'federated', 'high'),
('Active Directory', 'Microsoft Active Directory integration', 'credential', 'medium'),
('TACACS+', 'Terminal Access Controller Access-Control System Plus', 'credential', 'high')
ON CONFLICT (name) DO NOTHING;