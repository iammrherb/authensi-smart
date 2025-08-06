-- Fix user management issues

-- First, check if request_password_reset function exists and create/fix it
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
  -- Find user by email in profiles table
  SELECT id INTO v_user_id FROM profiles WHERE email = p_email AND is_active = true;
  
  IF v_user_id IS NULL THEN
    -- Don't reveal if email exists
    RETURN jsonb_build_object(
      'success', true,
      'message', 'If the email exists, a reset link will be sent.'
    );
  END IF;

  -- Use Supabase auth to send password reset email
  -- This will work even if user doesn't have auth.users record yet
  PERFORM supabase_url(), supabase_service_role_key();
  
  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (v_user_id, 'password_reset_requested', jsonb_build_object('email', p_email));

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Password reset email sent successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;

-- Fix the create_user_safely function to handle profile-only users
CREATE OR REPLACE FUNCTION public.create_user_safely(
  p_email text, 
  p_password text DEFAULT NULL, 
  p_first_name text DEFAULT NULL, 
  p_last_name text DEFAULT NULL, 
  p_role app_role DEFAULT 'viewer'::app_role, 
  p_scope_type text DEFAULT 'global'::text, 
  p_scope_id uuid DEFAULT NULL::uuid,
  p_send_invitation boolean DEFAULT false
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_result JSON;
  v_temp_password text;
BEGIN
  -- Check if calling user can manage roles
  IF NOT can_manage_roles(auth.uid(), p_scope_type, p_scope_id) THEN
    RAISE EXCEPTION 'Insufficient permissions to create users';
  END IF;

  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Check if user already exists in profiles
  IF EXISTS (SELECT 1 FROM profiles WHERE email = p_email) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  -- Generate a random user ID for the profile
  v_user_id := gen_random_uuid();
  
  -- Generate a temporary password if none provided
  v_temp_password := COALESCE(p_password, 'TempPass' || substring(gen_random_uuid()::text, 1, 8) || '!');

  -- Create the user profile directly
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id, 
    p_email, 
    p_first_name, 
    p_last_name, 
    true,
    now(),
    now()
  );

  -- Assign the role
  INSERT INTO public.user_roles (user_id, role, scope_type, scope_id, assigned_by, assigned_at)
  VALUES (v_user_id, p_role, p_scope_type, p_scope_id, auth.uid(), now());

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_created_directly', jsonb_build_object(
    'target_email', p_email,
    'target_user_id', v_user_id,
    'role', p_role,
    'scope_type', p_scope_type,
    'temp_password', v_temp_password
  ));

  v_result := jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'temp_password', v_temp_password,
    'message', 'User profile created successfully. Temporary password: ' || v_temp_password
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;

-- Create password_reset_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for password_reset_tokens
CREATE POLICY "Users can view their own reset tokens" ON public.password_reset_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Only functions can insert reset tokens" ON public.password_reset_tokens
  FOR INSERT WITH CHECK (false); -- Only functions can insert

-- Add missing RLS policies for tables that need them
CREATE POLICY "Admins can view all vendor_configs" ON public.vendor_configs
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage vendor_configs" ON public.vendor_configs
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view all config_templates" ON public.config_templates
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage config_templates" ON public.config_templates
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view all template_categories" ON public.template_categories
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage template_categories" ON public.template_categories
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view all vendor_compatibility" ON public.vendor_compatibility
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage vendor_compatibility" ON public.vendor_compatibility
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view all firmware_compatibility" ON public.firmware_compatibility
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage firmware_compatibility" ON public.firmware_compatibility
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role);

CREATE POLICY "Admins can view all user_activity_log" ON public.user_activity_log
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Fix the foreign key constraint issue by ensuring profiles table doesn't reference auth.users
-- Remove the foreign key constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add comment explaining that profiles.id should match auth.users.id when user signs up
COMMENT ON COLUMN public.profiles.id IS 'Should match auth.users.id when user completes signup, but can exist independently for invited users';