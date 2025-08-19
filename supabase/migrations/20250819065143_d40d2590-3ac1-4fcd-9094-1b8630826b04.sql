-- Create report_generation_history table
CREATE TABLE IF NOT EXISTS public.report_generation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL,
  template_id uuid,
  user_id uuid,
  ai_model_used text,
  processing_time_ms integer,
  success boolean DEFAULT true,
  tokens_used integer DEFAULT 0,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.report_generation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own generation history"
  ON public.report_generation_history
  FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can create generation history"
  ON public.report_generation_history
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_generation_history_user_id ON public.report_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_report_generation_history_template_id ON public.report_generation_history(template_id);
CREATE INDEX IF NOT EXISTS idx_report_generation_history_created_at ON public.report_generation_history(created_at);

-- Add missing badge variant to CSS
DO $$
BEGIN
  -- This is for documentation purposes, the actual CSS is handled in the UI
  RAISE NOTICE 'Badge variant "glow" should be added to the badge component CSS';
END $$;