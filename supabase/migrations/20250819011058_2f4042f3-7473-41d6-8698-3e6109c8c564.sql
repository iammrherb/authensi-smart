-- Create enhanced customer portal branding table
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

-- Create project phases table for enhanced tracking
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

-- Create project milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  phase_id UUID,
  milestone_name TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completion_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'missed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  deliverables JSONB DEFAULT '[]',
  acceptance_criteria JSONB DEFAULT '[]',
  assigned_to UUID,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  dependencies JSONB DEFAULT '[]',
  risks JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create project meetings table
CREATE TABLE IF NOT EXISTS public.project_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  meeting_title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT DEFAULT 'general' CHECK (meeting_type IN ('general', 'kickoff', 'status-update', 'review', 'planning', 'retrospective', 'demo')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_url TEXT,
  teams_meeting_id TEXT,
  teams_join_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled')),
  attendees JSONB DEFAULT '[]',
  agenda JSONB DEFAULT '[]',
  meeting_notes TEXT,
  action_items JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  recurring_pattern TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create risk assessments table
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  assessment_type TEXT DEFAULT 'project' CHECK (assessment_type IN ('project', 'phase', 'milestone', 'overall')),
  risk_category TEXT NOT NULL CHECK (risk_category IN ('technical', 'resource', 'schedule', 'budget', 'quality', 'security', 'compliance', 'vendor', 'stakeholder', 'external')),
  risk_title TEXT NOT NULL,
  risk_description TEXT,
  probability TEXT DEFAULT 'medium' CHECK (probability IN ('very-low', 'low', 'medium', 'high', 'very-high')),
  impact TEXT DEFAULT 'medium' CHECK (impact IN ('very-low', 'low', 'medium', 'high', 'very-high')),
  risk_score INTEGER GENERATED ALWAYS AS (
    CASE probability
      WHEN 'very-low' THEN 1
      WHEN 'low' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'high' THEN 4
      WHEN 'very-high' THEN 5
    END *
    CASE impact
      WHEN 'very-low' THEN 1
      WHEN 'low' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'high' THEN 4
      WHEN 'very-high' THEN 5
    END
  ) STORED,
  current_status TEXT DEFAULT 'identified' CHECK (current_status IN ('identified', 'analyzing', 'mitigating', 'monitoring', 'closed', 'realized')),
  mitigation_strategies JSONB DEFAULT '[]',
  contingency_plans JSONB DEFAULT '[]',
  owner_assigned_to UUID,
  target_resolution_date DATE,
  last_reviewed_date DATE,
  review_notes TEXT,
  identified_date DATE DEFAULT CURRENT_DATE,
  realized_date DATE,
  financial_impact DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create project reports table
CREATE TABLE IF NOT EXISTS public.project_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('status', 'progress', 'risk', 'budget', 'timeline', 'quality', 'performance', 'compliance', 'stakeholder', 'custom')),
  report_format TEXT DEFAULT 'pdf' CHECK (report_format IN ('pdf', 'html', 'excel', 'json', 'csv')),
  report_data JSONB DEFAULT '{}',
  generated_content TEXT,
  filters_applied JSONB DEFAULT '{}',
  date_range_start DATE,
  date_range_end DATE,
  auto_generated BOOLEAN DEFAULT false,
  scheduled_generation BOOLEAN DEFAULT false,
  generation_frequency TEXT CHECK (generation_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  recipients JSONB DEFAULT '[]',
  file_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS on all tables
ALTER TABLE public.customer_portal_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using exists pattern to avoid foreign key constraints
CREATE POLICY "Project owners can manage portal branding" ON public.customer_portal_branding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = customer_portal_branding.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project members can view phases" ON public.project_phases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage phases" ON public.project_phases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_phases.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project members can view milestones" ON public.project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_milestones.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage milestones" ON public.project_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_milestones.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project members can view meetings" ON public.project_meetings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_meetings.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage meetings" ON public.project_meetings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_meetings.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project members can view risks" ON public.risk_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = risk_assessments.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage risks" ON public.risk_assessments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = risk_assessments.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project members can view reports" ON public.project_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_reports.project_id 
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage reports" ON public.project_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_reports.project_id 
      AND p.created_by = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_portal_branding_project_id ON public.customer_portal_branding(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_status ON public.project_phases(status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_due_date ON public.project_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_project_meetings_project_id ON public.project_meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_project_meetings_scheduled_date ON public.project_meetings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_project_id ON public.risk_assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_risk_score ON public.risk_assessments(risk_score);
CREATE INDEX IF NOT EXISTS idx_project_reports_project_id ON public.project_reports(project_id);

-- Create triggers for updated_at
CREATE TRIGGER update_customer_portal_branding_updated_at
  BEFORE UPDATE ON public.customer_portal_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_phases_updated_at
  BEFORE UPDATE ON public.project_phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_meetings_updated_at
  BEFORE UPDATE ON public.project_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_reports_updated_at
  BEFORE UPDATE ON public.project_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();