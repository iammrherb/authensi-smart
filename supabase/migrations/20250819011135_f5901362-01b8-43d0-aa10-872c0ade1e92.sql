-- Drop existing triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS update_project_phases_updated_at ON public.project_phases;
DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON public.project_milestones;
DROP TRIGGER IF EXISTS update_project_meetings_updated_at ON public.project_meetings;
DROP TRIGGER IF EXISTS update_risk_assessments_updated_at ON public.risk_assessments;
DROP TRIGGER IF EXISTS update_project_reports_updated_at ON public.project_reports;
DROP TRIGGER IF EXISTS update_customer_portal_branding_updated_at ON public.customer_portal_branding;

-- Create tables one by one to ensure proper creation
CREATE TABLE IF NOT EXISTS public.customer_portal_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  accent_color TEXT DEFAULT '#06b6d4',
  font_family TEXT DEFAULT 'Inter',
  company_name TEXT,
  welcome_message TEXT,
  footer_text TEXT,
  custom_css TEXT,
  favicon_url TEXT,
  background_image_url TEXT,
  theme_mode TEXT DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'auto')),
  show_powered_by BOOLEAN DEFAULT true,
  custom_domain TEXT,
  email_templates JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS and create policies for customer_portal_branding
ALTER TABLE public.customer_portal_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can manage portal branding" ON public.customer_portal_branding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_portal_branding.project_id 
      AND p.created_by = auth.uid()
    )
  );

-- Create project phases table
CREATE TABLE IF NOT EXISTS public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  target_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'delayed', 'cancelled', 'on-hold')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  dependencies JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  success_criteria JSONB DEFAULT '[]',
  resources_required JSONB DEFAULT '[]',
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  budget_allocated DECIMAL(15,2),
  budget_used DECIMAL(15,2),
  assigned_team JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS and create policies for project_phases
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view phases" ON public.project_phases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage phases" ON public.project_phases
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can update phases" ON public.project_phases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete phases" ON public.project_phases
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );