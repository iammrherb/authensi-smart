
-- Create project_automations table
CREATE TABLE public.project_automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.project_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automations for their projects" 
  ON public.project_automations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_automations.project_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage automations for their projects" 
  ON public.project_automations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_automations.project_id 
      AND created_by = auth.uid()
    )
  );

-- Create project_resources table for resource library integration
CREATE TABLE public.project_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  auto_linked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, resource_id)
);

-- Add RLS policies for project_resources
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view resources for their projects" 
  ON public.project_resources 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_resources.project_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage resources for their projects" 
  ON public.project_resources 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_resources.project_id 
      AND created_by = auth.uid()
    )
  );

-- Add updated_at trigger for project_automations
CREATE TRIGGER update_project_automations_updated_at
  BEFORE UPDATE ON public.project_automations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
