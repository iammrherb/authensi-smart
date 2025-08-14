-- Create unified_projects table for enhanced project management
CREATE TABLE IF NOT EXISTS public.unified_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  organization_size INTEGER DEFAULT 0,
  industry TEXT,
  compliance_frameworks JSONB DEFAULT '[]'::jsonb,
  pain_points JSONB DEFAULT '[]'::jsonb,
  existing_vendors JSONB DEFAULT '{}'::jsonb,
  authentication_requirements JSONB DEFAULT '[]'::jsonb,
  security_level TEXT DEFAULT 'standard',
  deployment_type TEXT,
  timeline TEXT,
  budget TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on-hold')),
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  implementation_checklist JSONB DEFAULT '[]'::jsonb,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  next_milestone TEXT,
  assigned_team JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create project_phase_tracking table
CREATE TABLE IF NOT EXISTS public.project_phase_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.unified_projects(id) ON DELETE CASCADE,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'blocked')),
  planned_start DATE,
  planned_end DATE,
  actual_start DATE,
  actual_end DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  tasks JSONB DEFAULT '[]'::jsonb,
  blockers JSONB DEFAULT '[]'::jsonb,
  resources_assigned JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create project_resources table
CREATE TABLE IF NOT EXISTS public.project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.unified_projects(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('use_case', 'vendor', 'requirement', 'authentication_method', 'compliance_framework')),
  resource_id UUID NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  implementation_status TEXT DEFAULT 'planned' CHECK (implementation_status IN ('planned', 'in-progress', 'completed', 'deferred')),
  implementation_notes TEXT,
  assigned_to UUID,
  target_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.unified_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phase_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for unified_projects
CREATE POLICY "Users can view their unified projects" ON public.unified_projects
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create unified projects" ON public.unified_projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their unified projects" ON public.unified_projects
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their unified projects" ON public.unified_projects
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for project_phase_tracking
CREATE POLICY "Users can view phases for their projects" ON public.project_phase_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_phase_tracking.project_id 
      AND (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

CREATE POLICY "Users can create phases for their projects" ON public.project_phase_tracking
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_phase_tracking.project_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update phases for their projects" ON public.project_phase_tracking
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_phase_tracking.project_id 
      AND (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for project_resources
CREATE POLICY "Users can view resources for their projects" ON public.project_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_resources.project_id 
      AND (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

CREATE POLICY "Users can create resources for their projects" ON public.project_resources
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_resources.project_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update resources for their projects" ON public.project_resources
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.unified_projects 
      WHERE id = project_resources.project_id 
      AND (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_unified_projects_updated_at
  BEFORE UPDATE ON public.unified_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_phase_tracking_updated_at
  BEFORE UPDATE ON public.project_phase_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_unified_projects_created_by ON public.unified_projects(created_by);
CREATE INDEX idx_unified_projects_status ON public.unified_projects(status);
CREATE INDEX idx_project_phase_tracking_project_id ON public.project_phase_tracking(project_id);
CREATE INDEX idx_project_phase_tracking_phase_order ON public.project_phase_tracking(project_id, phase_order);
CREATE INDEX idx_project_resources_project_id ON public.project_resources(project_id);
CREATE INDEX idx_project_resources_type ON public.project_resources(resource_type);