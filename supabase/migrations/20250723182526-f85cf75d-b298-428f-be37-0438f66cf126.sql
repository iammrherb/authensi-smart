-- Create core tables for Portnox project management

-- Sites table
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  site_type TEXT DEFAULT 'office',
  network_segments INTEGER DEFAULT 1,
  device_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'scoping', 'designing', 'implementing', 'testing', 'deployed', 'maintenance')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  assigned_engineer UUID REFERENCES auth.users(id)
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
  start_date DATE,
  target_completion DATE,
  actual_completion DATE,
  budget DECIMAL(12,2),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_phase TEXT DEFAULT 'discovery' CHECK (current_phase IN ('discovery', 'design', 'implementation', 'testing', 'go-live')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  project_manager UUID REFERENCES auth.users(id)
);

-- Project sites relationship
CREATE TABLE public.project_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  deployment_order INTEGER DEFAULT 1,
  site_specific_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, site_id)
);

-- Scoping questionnaires
CREATE TABLE public.scoping_questionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  questionnaire_data JSONB DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed', 'reviewed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Implementation checklists
CREATE TABLE public.implementation_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  checklist_type TEXT DEFAULT 'implementation' CHECK (checklist_type IN ('pre-implementation', 'implementation', 'post-implementation', 'testing')),
  checklist_items JSONB DEFAULT '[]',
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'blocked')),
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoping_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.implementation_checklists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (temporary - will implement proper RBAC later)
CREATE POLICY "Allow authenticated users to view sites" ON public.sites FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert sites" ON public.sites FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update sites" ON public.sites FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete sites" ON public.sites FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view project_sites" ON public.project_sites FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert project_sites" ON public.project_sites FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update project_sites" ON public.project_sites FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete project_sites" ON public.project_sites FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view questionnaires" ON public.scoping_questionnaires FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert questionnaires" ON public.scoping_questionnaires FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update questionnaires" ON public.scoping_questionnaires FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete questionnaires" ON public.scoping_questionnaires FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view checklists" ON public.implementation_checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert checklists" ON public.implementation_checklists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update checklists" ON public.implementation_checklists FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete checklists" ON public.implementation_checklists FOR DELETE TO authenticated USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON public.scoping_questionnaires FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON public.implementation_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();