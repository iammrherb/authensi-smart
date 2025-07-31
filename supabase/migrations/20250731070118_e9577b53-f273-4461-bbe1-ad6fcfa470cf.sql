-- Enable pgcrypto extension for gen_random_bytes function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure user_activity_log table exists for the create_user_safely function
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    action text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for user_activity_log
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity_log;
CREATE POLICY "Users can view their own activity" ON public.user_activity_log
FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Users can create activity logs" ON public.user_activity_log;
CREATE POLICY "Users can create activity logs" ON public.user_activity_log
FOR INSERT WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Ensure user_roles table has the custom_role_id column for the edge function
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'custom_role_id') THEN
        ALTER TABLE public.user_roles ADD COLUMN custom_role_id uuid REFERENCES public.custom_roles(id);
    END IF;
END $$;

-- Update the request_password_reset function to ensure it exists
CREATE OR REPLACE FUNCTION public.request_password_reset(p_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
  v_reset_token TEXT;
  v_result JSON;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id FROM profiles WHERE email = p_email AND is_active = true;
  
  IF v_user_id IS NULL THEN
    -- Don't reveal if email exists
    RETURN jsonb_build_object(
      'success', true,
      'message', 'If the email exists, a reset link will be sent.'
    );
  END IF;

  -- Generate reset token
  v_reset_token := encode(gen_random_bytes(32), 'hex');

  -- Store reset token
  INSERT INTO password_reset_tokens (user_id, token, expires_at)
  VALUES (v_user_id, v_reset_token, now() + interval '1 hour');

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (v_user_id, 'password_reset_requested', jsonb_build_object('email', p_email));

  RETURN jsonb_build_object(
    'success', true,
    'reset_token', v_reset_token,
    'message', 'Password reset token generated'
  );
END;
$function$;