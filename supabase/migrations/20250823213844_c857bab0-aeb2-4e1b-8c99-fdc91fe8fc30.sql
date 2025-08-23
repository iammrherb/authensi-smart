-- AI Context Engine Tables
CREATE TABLE public.ai_conversation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  conversation_type TEXT NOT NULL DEFAULT 'general',
  project_id UUID,
  site_id UUID,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  message_metadata JSONB DEFAULT '{}',
  ai_model_used TEXT,
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_context_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}',
  frequency_count INTEGER DEFAULT 1,
  confidence_score NUMERIC DEFAULT 0.0,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  context_tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  communication_style JSONB DEFAULT '{}',
  technical_expertise_level TEXT DEFAULT 'intermediate',
  preferred_vendors JSONB DEFAULT '[]',
  preferred_methodologies JSONB DEFAULT '[]',
  domain_expertise JSONB DEFAULT '{}',
  learning_preferences JSONB DEFAULT '{}',
  context_retention_days INTEGER DEFAULT 90,
  auto_context_building BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_context_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  session_type TEXT NOT NULL DEFAULT 'conversation',
  project_context JSONB DEFAULT '{}',
  accumulated_context JSONB DEFAULT '{}',
  context_summary TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_context_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_context_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_conversation_history
CREATE POLICY "Users can view their own conversation history"
ON public.ai_conversation_history FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own conversation history"
ON public.ai_conversation_history FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own conversation history"
ON public.ai_conversation_history FOR UPDATE
USING (user_id = auth.uid());

-- RLS Policies for ai_context_patterns
CREATE POLICY "Users can view their own context patterns"
ON public.ai_context_patterns FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can manage context patterns"
ON public.ai_context_patterns FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for ai_user_preferences
CREATE POLICY "Users can manage their own preferences"
ON public.ai_user_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for ai_context_sessions
CREATE POLICY "Users can manage their own context sessions"
ON public.ai_context_sessions FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_ai_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_conversation_history_updated_at
  BEFORE UPDATE ON public.ai_conversation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_tables_updated_at();

CREATE TRIGGER update_ai_context_patterns_updated_at
  BEFORE UPDATE ON public.ai_context_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_tables_updated_at();

CREATE TRIGGER update_ai_user_preferences_updated_at
  BEFORE UPDATE ON public.ai_user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_tables_updated_at();

CREATE TRIGGER update_ai_context_sessions_updated_at
  BEFORE UPDATE ON public.ai_context_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_tables_updated_at();

-- Indexes for performance
CREATE INDEX idx_ai_conversation_history_user_session ON public.ai_conversation_history(user_id, session_id);
CREATE INDEX idx_ai_conversation_history_created_at ON public.ai_conversation_history(created_at);
CREATE INDEX idx_ai_context_patterns_user_type ON public.ai_context_patterns(user_id, pattern_type);
CREATE INDEX idx_ai_context_sessions_user_active ON public.ai_context_sessions(user_id, is_active);
CREATE INDEX idx_ai_context_sessions_token ON public.ai_context_sessions(session_token);