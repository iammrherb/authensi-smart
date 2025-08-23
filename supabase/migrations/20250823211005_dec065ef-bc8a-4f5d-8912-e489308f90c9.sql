-- Enhanced Resource Sessions table for session persistence
CREATE TABLE IF NOT EXISTS public.enhanced_resource_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('scoping', 'configuration', 'planning', 'tracking')),
  session_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  resource_selections JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sharing_enabled BOOLEAN NOT NULL DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resource Sharing Settings table for multi-tenant sharing
CREATE TABLE IF NOT EXISTS public.resource_sharing_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('vendor', 'model', 'template', 'use_case', 'requirement', 'authentication_method')),
  sharing_level TEXT NOT NULL DEFAULT 'private' CHECK (sharing_level IN ('global', 'organization', 'project', 'private')),
  permissions JSONB NOT NULL DEFAULT '{"view": true, "edit": false, "delete": false, "share": false}'::jsonb,
  created_by UUID NOT NULL,
  shared_with JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resource Enrichment Log table to track enrichment activities
CREATE TABLE IF NOT EXISTS public.resource_enrichment_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  enrichment_type TEXT NOT NULL CHECK (enrichment_type IN ('portnox_docs', 'external_docs', 'ai_enhancement', 'firecrawl')),
  enrichment_status TEXT NOT NULL DEFAULT 'pending' CHECK (enrichment_status IN ('pending', 'success', 'failed', 'partial')),
  enrichment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  external_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  portnox_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_generated_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.enhanced_resource_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_sharing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_enrichment_log ENABLE ROW LEVEL SECURITY;

-- Enhanced Resource Sessions policies
CREATE POLICY "Users can create their own sessions" ON public.enhanced_resource_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions and shared sessions" ON public.enhanced_resource_sessions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (sharing_enabled = true AND is_active = true)
  );

CREATE POLICY "Users can update their own sessions" ON public.enhanced_resource_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.enhanced_resource_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Resource Sharing Settings policies
CREATE POLICY "Users can create sharing settings for their resources" ON public.resource_sharing_settings
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view sharing settings" ON public.resource_sharing_settings
  FOR SELECT USING (
    auth.uid() = created_by OR 
    sharing_level IN ('global', 'organization') OR
    (shared_with ? auth.uid()::text)
  );

CREATE POLICY "Users can update their own sharing settings" ON public.resource_sharing_settings
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own sharing settings" ON public.resource_sharing_settings
  FOR DELETE USING (auth.uid() = created_by);

-- Resource Enrichment Log policies
CREATE POLICY "Users can create enrichment logs" ON public.resource_enrichment_log
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view enrichment logs for accessible resources" ON public.resource_enrichment_log
  FOR SELECT USING (
    auth.uid() = created_by OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_enhanced_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_activity = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enhanced_sessions_updated_at
  BEFORE UPDATE ON public.enhanced_resource_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_enhanced_sessions_updated_at();

CREATE TRIGGER update_resource_sharing_updated_at
  BEFORE UPDATE ON public.resource_sharing_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_sessions_user_id ON public.enhanced_resource_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_sessions_type ON public.enhanced_resource_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_sessions_active ON public.enhanced_resource_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_enhanced_sessions_expires ON public.enhanced_resource_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_resource_sharing_resource ON public.resource_sharing_settings(resource_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_resource_sharing_level ON public.resource_sharing_settings(sharing_level);
CREATE INDEX IF NOT EXISTS idx_resource_sharing_creator ON public.resource_sharing_settings(created_by);

CREATE INDEX IF NOT EXISTS idx_enrichment_log_resource ON public.resource_enrichment_log(resource_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_enrichment_log_status ON public.resource_enrichment_log(enrichment_status);
CREATE INDEX IF NOT EXISTS idx_enrichment_log_type ON public.resource_enrichment_log(enrichment_type);