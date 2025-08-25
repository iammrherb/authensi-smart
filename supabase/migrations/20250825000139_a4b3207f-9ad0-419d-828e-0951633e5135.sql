-- Create smart_template_usage table for tracking template usage and feedback
CREATE TABLE IF NOT EXISTS public.smart_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  project_id UUID,
  site_id UUID,
  usage_context JSONB DEFAULT '{}',
  customizations_applied JSONB DEFAULT '{}',
  deployment_results JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  feedback_notes TEXT,
  success_indicators JSONB DEFAULT '[]',
  deployment_time_minutes INTEGER,
  configuration_complexity TEXT CHECK (configuration_complexity IN ('basic', 'intermediate', 'advanced', 'expert')),
  compliance_validation JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.smart_template_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own template usage"
  ON public.smart_template_usage
  FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create their own template usage records"
  ON public.smart_template_usage
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own template usage records"
  ON public.smart_template_usage
  FOR UPDATE
  USING (user_id = auth.uid());

-- Create index for performance
CREATE INDEX idx_smart_template_usage_template_id ON public.smart_template_usage(template_id);
CREATE INDEX idx_smart_template_usage_user_id ON public.smart_template_usage(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_smart_template_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_smart_template_usage_updated_at
  BEFORE UPDATE ON public.smart_template_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_smart_template_usage_updated_at();