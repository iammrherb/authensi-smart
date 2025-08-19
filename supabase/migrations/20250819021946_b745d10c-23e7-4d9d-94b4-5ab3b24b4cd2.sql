-- Enhanced template management and knowledge base system

-- Create template customizations table for project/site specific modifications
CREATE TABLE IF NOT EXISTS public.template_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_template_id UUID NOT NULL REFERENCES public.configuration_templates(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  customization_name TEXT NOT NULL,
  customization_type TEXT NOT NULL DEFAULT 'modification',
  custom_content TEXT NOT NULL,
  custom_variables JSONB DEFAULT '{}',
  modification_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tags JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true
);

-- Create project knowledge base table
CREATE TABLE IF NOT EXISTS public.project_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT NOT NULL DEFAULT 'note',
  category TEXT NOT NULL DEFAULT 'general',
  tags JSONB DEFAULT '[]',
  file_attachments JSONB DEFAULT '[]',
  external_links JSONB DEFAULT '[]',
  ai_analysis_results JSONB DEFAULT '{}',
  priority_level TEXT DEFAULT 'medium',
  is_ai_enhanced BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_ai_analysis TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create file upload tracking table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID REFERENCES public.project_knowledge_base(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  upload_status TEXT DEFAULT 'uploaded',
  ai_analysis_status TEXT DEFAULT 'pending',
  ai_analysis_results JSONB DEFAULT '{}',
  extracted_content TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create site template assignments table
CREATE TABLE IF NOT EXISTS public.site_template_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.configuration_templates(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'primary',
  configuration_role TEXT NOT NULL,
  custom_variables JSONB DEFAULT '{}',
  deployment_status TEXT DEFAULT 'planned',
  deployment_notes TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deployed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create project template assignments table
CREATE TABLE IF NOT EXISTS public.project_template_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.configuration_templates(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL,
  assignment_role TEXT NOT NULL,
  custom_variables JSONB DEFAULT '{}',
  implementation_status TEXT DEFAULT 'planned',
  implementation_notes TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  implemented_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create AI analysis sessions table
CREATE TABLE IF NOT EXISTS public.ai_analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type TEXT NOT NULL,
  input_data TEXT NOT NULL,
  analysis_criteria JSONB DEFAULT '{}',
  analysis_results JSONB DEFAULT '{}',
  confidence_score NUMERIC(5,2),
  analysis_model TEXT,
  processing_time_ms INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.sites(id),
  file_id UUID REFERENCES public.uploaded_files(id)
);

-- Enable RLS
ALTER TABLE public.template_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for template_customizations
CREATE POLICY "Users can manage customizations for their projects" ON public.template_customizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = template_customizations.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.sites s 
      WHERE s.id = template_customizations.site_id 
      AND (s.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for project_knowledge_base
CREATE POLICY "Users can manage knowledge base for their projects" ON public.project_knowledge_base
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_knowledge_base.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.sites s 
      WHERE s.id = project_knowledge_base.site_id 
      AND (s.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for uploaded_files
CREATE POLICY "Users can manage files for their knowledge base" ON public.uploaded_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.project_knowledge_base kb
      JOIN public.projects p ON p.id = kb.project_id
      WHERE kb.id = uploaded_files.knowledge_base_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for site_template_assignments
CREATE POLICY "Users can manage template assignments for their sites" ON public.site_template_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.sites s 
      WHERE s.id = site_template_assignments.site_id 
      AND (s.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for project_template_assignments
CREATE POLICY "Users can manage template assignments for their projects" ON public.project_template_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_template_assignments.project_id 
      AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
  );

-- RLS Policies for ai_analysis_sessions
CREATE POLICY "Users can view their AI analysis sessions" ON public.ai_analysis_sessions
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create AI analysis sessions" ON public.ai_analysis_sessions
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_customizations_updated_at
  BEFORE UPDATE ON public.template_customizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_knowledge_base_updated_at
  BEFORE UPDATE ON public.project_knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_uploaded_files_updated_at
  BEFORE UPDATE ON public.uploaded_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_customizations_project_id ON public.template_customizations(project_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_site_id ON public.template_customizations(site_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_base_template_id ON public.template_customizations(base_template_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_project_id ON public.project_knowledge_base(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_site_id ON public.project_knowledge_base(site_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.project_knowledge_base(category);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_knowledge_base_id ON public.uploaded_files(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_file_type ON public.uploaded_files(file_type);

CREATE INDEX IF NOT EXISTS idx_site_template_assignments_site_id ON public.site_template_assignments(site_id);
CREATE INDEX IF NOT EXISTS idx_site_template_assignments_template_id ON public.site_template_assignments(template_id);

CREATE INDEX IF NOT EXISTS idx_project_template_assignments_project_id ON public.project_template_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_template_assignments_template_id ON public.project_template_assignments(template_id);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_sessions_created_by ON public.ai_analysis_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_sessions_project_id ON public.ai_analysis_sessions(project_id);