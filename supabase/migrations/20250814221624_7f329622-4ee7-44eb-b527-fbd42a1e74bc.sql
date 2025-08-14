-- Create workflow sessions table for tracking workflow states
CREATE TABLE IF NOT EXISTS public.workflow_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('project_genesis', 'site_creation', 'implementation_planning', 'deployment_tracking')),
  current_step INTEGER NOT NULL DEFAULT 0,
  context_data JSONB NOT NULL DEFAULT '{}',
  ai_insights JSONB NOT NULL DEFAULT '[]',
  resource_mappings JSONB NOT NULL DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracking sessions table for implementation tracking
CREATE TABLE IF NOT EXISTS public.tracking_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  project_id UUID NOT NULL,
  implementation_type TEXT NOT NULL CHECK (implementation_type IN ('poc', 'pilot', 'full_deployment', 'migration')),
  context_data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_sessions_session_id ON public.workflow_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_workflow_sessions_workflow_type ON public.workflow_sessions(workflow_type);
CREATE INDEX IF NOT EXISTS idx_workflow_sessions_created_by ON public.workflow_sessions(created_by);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_session_id ON public.tracking_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_project_id ON public.tracking_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_implementation_type ON public.tracking_sessions(implementation_type);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_created_by ON public.tracking_sessions(created_by);

-- Enable RLS on both tables
ALTER TABLE public.workflow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflow_sessions
CREATE POLICY "Users can create their own workflow sessions" 
ON public.workflow_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own workflow sessions" 
ON public.workflow_sessions 
FOR SELECT 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can update their own workflow sessions" 
ON public.workflow_sessions 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own workflow sessions" 
ON public.workflow_sessions 
FOR DELETE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create RLS policies for tracking_sessions
CREATE POLICY "Users can create tracking sessions for their projects" 
ON public.tracking_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view tracking sessions for their projects" 
ON public.tracking_sessions 
FOR SELECT 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can update tracking sessions for their projects" 
ON public.tracking_sessions 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete tracking sessions for their projects" 
ON public.tracking_sessions 
FOR DELETE 
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_workflow_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_tracking_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workflow_sessions_updated_at
  BEFORE UPDATE ON public.workflow_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workflow_sessions_updated_at();

CREATE TRIGGER tracking_sessions_updated_at
  BEFORE UPDATE ON public.tracking_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tracking_sessions_updated_at();