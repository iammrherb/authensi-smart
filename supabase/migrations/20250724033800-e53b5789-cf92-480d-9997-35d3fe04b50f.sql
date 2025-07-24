-- Enhanced project scoping and management system for comprehensive NAC deployments

-- Create project templates and industry standards
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT, -- Healthcare, Finance, Manufacturing, Education, etc.
  compliance_frameworks TEXT[], -- HIPAA, PCI-DSS, SOX, GDPR, etc.
  deployment_type TEXT NOT NULL, -- SMB, Mid-Market, Enterprise
  security_level TEXT NOT NULL, -- Basic, Advanced, Zero-Trust
  description TEXT,
  use_cases JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  test_cases JSONB DEFAULT '[]'::jsonb,
  authentication_workflows JSONB DEFAULT '[]'::jsonb,
  vendor_configurations JSONB DEFAULT '[]'::jsonb,
  network_requirements JSONB DEFAULT '[]'::jsonb,
  timeline_template JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create comprehensive use case library
CREATE TABLE public.use_case_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Authentication, Authorization, Monitoring, Compliance, etc.
  subcategory TEXT,
  description TEXT,
  business_value TEXT,
  technical_requirements JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  test_scenarios JSONB DEFAULT '[]'::jsonb,
  supported_vendors JSONB DEFAULT '[]'::jsonb,
  portnox_features JSONB DEFAULT '[]'::jsonb,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  estimated_effort_weeks INTEGER,
  dependencies JSONB DEFAULT '[]'::jsonb,
  compliance_frameworks TEXT[],
  authentication_methods JSONB DEFAULT '[]'::jsonb,
  deployment_scenarios JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create test case repository
CREATE TABLE public.test_case_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL CHECK (test_type IN ('functional', 'integration', 'performance', 'security', 'user-acceptance')),
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  prerequisites JSONB DEFAULT '[]'::jsonb,
  test_steps JSONB DEFAULT '[]'::jsonb,
  expected_results JSONB DEFAULT '[]'::jsonb,
  validation_criteria JSONB DEFAULT '[]'::jsonb,
  related_use_cases JSONB DEFAULT '[]'::jsonb,
  vendor_specific JSONB DEFAULT '{}'::jsonb,
  automation_possible BOOLEAN DEFAULT false,
  estimated_duration_minutes INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create vendor and device inventory
CREATE TABLE public.vendor_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL, -- Network, Security, Identity, Cloud, etc.
  category TEXT NOT NULL, -- Switch, Router, Firewall, AP, etc.
  models JSONB DEFAULT '[]'::jsonb,
  supported_protocols JSONB DEFAULT '[]'::jsonb,
  integration_methods JSONB DEFAULT '[]'::jsonb,
  portnox_compatibility JSONB DEFAULT '{}'::jsonb,
  configuration_templates JSONB DEFAULT '{}'::jsonb,
  known_limitations JSONB DEFAULT '[]'::jsonb,
  firmware_requirements JSONB DEFAULT '{}'::jsonb,
  documentation_links JSONB DEFAULT '[]'::jsonb,
  support_level TEXT CHECK (support_level IN ('full', 'partial', 'limited', 'none')),
  last_tested_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'end-of-life')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create authentication workflow templates
CREATE TABLE public.authentication_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  workflow_type TEXT NOT NULL, -- MAB, Certificate, Credentials, Guest, etc.
  description TEXT,
  authentication_method TEXT NOT NULL,
  use_cases JSONB DEFAULT '[]'::jsonb,
  configuration_steps JSONB DEFAULT '[]'::jsonb,
  supported_devices JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  integration_points JSONB DEFAULT '[]'::jsonb,
  security_considerations JSONB DEFAULT '[]'::jsonb,
  troubleshooting_guide JSONB DEFAULT '[]'::jsonb,
  portnox_specific JSONB DEFAULT '{}'::jsonb,
  industry_applications JSONB DEFAULT '[]'::jsonb,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create requirements repository
CREATE TABLE public.requirements_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Technical, Compliance, Business, Security, Operational
  subcategory TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  requirement_type TEXT NOT NULL, -- Functional, Non-functional, Compliance, Business
  description TEXT,
  rationale TEXT,
  acceptance_criteria JSONB DEFAULT '[]'::jsonb,
  verification_methods JSONB DEFAULT '[]'::jsonb,
  test_cases JSONB DEFAULT '[]'::jsonb,
  related_use_cases JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  assumptions JSONB DEFAULT '[]'::jsonb,
  constraints JSONB DEFAULT '[]'::jsonb,
  compliance_frameworks TEXT[],
  vendor_requirements JSONB DEFAULT '{}'::jsonb,
  portnox_features JSONB DEFAULT '[]'::jsonb,
  documentation_references JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under-review', 'approved', 'deprecated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enhanced project table with additional scoping fields
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS compliance_frameworks TEXT[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deployment_type TEXT CHECK (deployment_type IN ('SMB', 'Mid-Market', 'Enterprise', 'Global'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS security_level TEXT CHECK (security_level IN ('Basic', 'Advanced', 'Zero-Trust'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS poc_status TEXT CHECK (poc_status IN ('not-started', 'planning', 'in-progress', 'completed', 'transitioned'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_endpoints INTEGER;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_sites INTEGER;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pain_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS integration_requirements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS migration_scope JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.project_templates(id);

-- Create project use cases junction table
CREATE TABLE public.project_use_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  use_case_id UUID NOT NULL REFERENCES public.use_case_library(id) ON DELETE CASCADE,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'testing', 'completed', 'deferred')),
  implementation_notes TEXT,
  test_results JSONB DEFAULT '{}'::jsonb,
  assigned_to UUID REFERENCES auth.users(id),
  target_completion DATE,
  actual_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, use_case_id)
);

-- Create project test cases junction table
CREATE TABLE public.project_test_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  test_case_id UUID NOT NULL REFERENCES public.test_case_library(id) ON DELETE CASCADE,
  use_case_reference UUID REFERENCES public.project_use_cases(id),
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'passed', 'failed', 'blocked', 'skipped')),
  execution_notes TEXT,
  test_results JSONB DEFAULT '{}'::jsonb,
  executed_by UUID REFERENCES auth.users(id),
  execution_date TIMESTAMP WITH TIME ZONE,
  defects_found JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, test_case_id)
);

-- Create project requirements junction table
CREATE TABLE public.project_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES public.requirements_library(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'analyzed', 'approved', 'implemented', 'verified', 'rejected')),
  implementation_approach TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in-progress', 'verified', 'failed')),
  verification_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  target_date DATE,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, requirement_id)
);

-- Create project vendors junction table
CREATE TABLE public.project_vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- Primary, Secondary, Integration, etc.
  models_used JSONB DEFAULT '[]'::jsonb,
  configuration_status TEXT DEFAULT 'not-started' CHECK (configuration_status IN ('not-started', 'in-progress', 'configured', 'tested', 'deployed')),
  integration_notes TEXT,
  configuration_backup JSONB DEFAULT '{}'::jsonb,
  support_contact JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, vendor_id)
);

-- Enhanced scoping questionnaires with comprehensive structure
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS template_used UUID REFERENCES public.project_templates(id);
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS deployment_type TEXT;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS security_requirements JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS authentication_requirements JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS infrastructure_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS compliance_requirements JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS integration_scope JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS pain_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.scoping_questionnaires ADD COLUMN IF NOT EXISTS sizing_calculations JSONB DEFAULT '{}'::jsonb;

-- Create POC tracking
CREATE TABLE public.poc_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- setup, testing, demo, validation, etc.
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  start_date DATE,
  target_completion DATE,
  actual_completion DATE,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '{}'::jsonb,
  next_steps TEXT,
  stakeholders JSONB DEFAULT '[]'::jsonb,
  documentation JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create handoff and training tracking
CREATE TABLE public.project_handoffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  handoff_type TEXT NOT NULL, -- presales-to-implementation, implementation-to-support, etc.
  from_team TEXT NOT NULL,
  to_team TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  handoff_date DATE,
  completion_date DATE,
  documentation_items JSONB DEFAULT '[]'::jsonb,
  training_sessions JSONB DEFAULT '[]'::jsonb,
  knowledge_transfer_items JSONB DEFAULT '[]'::jsonb,
  outstanding_items JSONB DEFAULT '[]'::jsonb,
  signoff_from UUID REFERENCES auth.users(id),
  signoff_to UUID REFERENCES auth.users(id),
  signoff_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create milestones and deliverables tracking
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT NOT NULL, -- discovery, scoping, design, implementation, testing, deployment, training
  target_date DATE,
  actual_date DATE,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'delayed', 'cancelled')),
  deliverables JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  responsible_team TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all new tables
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_case_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authentication_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for library tables (readable by all authenticated users)
CREATE POLICY "Library tables are readable by authenticated users" ON public.project_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library tables are readable by authenticated users" ON public.use_case_library FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library tables are readable by authenticated users" ON public.test_case_library FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library tables are readable by authenticated users" ON public.vendor_library FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library tables are readable by authenticated users" ON public.authentication_workflows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library tables are readable by authenticated users" ON public.requirements_library FOR SELECT TO authenticated USING (true);

-- Create RLS policies for project-related tables
CREATE POLICY "Users can manage project use cases for their projects" ON public.project_use_cases 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_use_cases.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage project test cases for their projects" ON public.project_test_cases 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_test_cases.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage project requirements for their projects" ON public.project_requirements 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_requirements.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage project vendors for their projects" ON public.project_vendors 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_vendors.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage POC activities for their projects" ON public.poc_activities 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = poc_activities.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage project handoffs for their projects" ON public.project_handoffs 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_handoffs.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

CREATE POLICY "Users can manage project milestones for their projects" ON public.project_milestones 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_milestones.project_id 
    AND (p.created_by = auth.uid() OR 
         has_role(auth.uid(), 'project_owner'::app_role, 'project'::text, p.id) OR 
         has_role(auth.uid(), 'project_manager'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'lead_engineer'::app_role, 'project'::text, p.id) OR
         has_role(auth.uid(), 'engineer'::app_role, 'project'::text, p.id))
  )
);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_project_templates_updated_at BEFORE UPDATE ON public.project_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_use_case_library_updated_at BEFORE UPDATE ON public.use_case_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_test_case_library_updated_at BEFORE UPDATE ON public.test_case_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_library_updated_at BEFORE UPDATE ON public.vendor_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_authentication_workflows_updated_at BEFORE UPDATE ON public.authentication_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_requirements_library_updated_at BEFORE UPDATE ON public.requirements_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_use_cases_updated_at BEFORE UPDATE ON public.project_use_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_test_cases_updated_at BEFORE UPDATE ON public.project_test_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_requirements_updated_at BEFORE UPDATE ON public.project_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_vendors_updated_at BEFORE UPDATE ON public.project_vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_poc_activities_updated_at BEFORE UPDATE ON public.poc_activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_handoffs_updated_at BEFORE UPDATE ON public.project_handoffs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();