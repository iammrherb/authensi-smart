-- Add 2FA enforcement settings to system configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage system settings
CREATE POLICY "Super admins can manage system settings"
ON public.system_settings FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default 2FA enforcement settings
INSERT INTO public.system_settings (setting_key, setting_value, created_by)
VALUES 
  ('2fa_enforcement', jsonb_build_object(
    'global_required', false,
    'role_requirements', jsonb_build_object(
      'super_admin', true,
      'product_manager', false,
      'sales_engineer', false,
      'technical_account_manager', false,
      'project_creator', false,
      'viewer', false
    ),
    'grace_period_days', 7,
    'force_setup_on_next_login', false
  ), NULL)
ON CONFLICT (setting_key) DO NOTHING;

-- Add 2FA enforcement fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS two_factor_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS two_factor_setup_forced boolean DEFAULT false;

-- Function to check if user requires 2FA
CREATE OR REPLACE FUNCTION public.user_requires_2fa(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_roles app_role[];
  v_settings jsonb;
  v_global_required boolean;
  v_role_requirements jsonb;
  v_user_forced boolean;
  v_role app_role;
BEGIN
  -- Get user's roles
  SELECT array_agg(role) INTO v_user_roles
  FROM user_roles 
  WHERE user_id = p_user_id;
  
  -- Get 2FA enforcement settings
  SELECT setting_value INTO v_settings
  FROM system_settings
  WHERE setting_key = '2fa_enforcement';
  
  IF v_settings IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if globally required
  v_global_required := (v_settings->>'global_required')::boolean;
  IF v_global_required THEN
    RETURN true;
  END IF;
  
  -- Check if user is specifically forced
  SELECT two_factor_required INTO v_user_forced
  FROM profiles
  WHERE id = p_user_id;
  
  IF v_user_forced THEN
    RETURN true;
  END IF;
  
  -- Check role-based requirements
  v_role_requirements := v_settings->'role_requirements';
  FOREACH v_role IN ARRAY v_user_roles LOOP
    IF (v_role_requirements->>v_role::text)::boolean THEN
      RETURN true;
    END IF;
  END LOOP;
  
  RETURN false;
END;
$$;

-- Function to enforce 2FA for a user
CREATE OR REPLACE FUNCTION public.enforce_2fa_for_user(
  p_user_id uuid,
  p_deadline timestamp with time zone DEFAULT (now() + interval '7 days'),
  p_immediate boolean DEFAULT false
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to enforce 2FA';
  END IF;
  
  -- Update user profile
  UPDATE public.profiles 
  SET 
    two_factor_required = true,
    two_factor_deadline = CASE WHEN p_immediate THEN now() ELSE p_deadline END,
    two_factor_setup_forced = p_immediate,
    updated_at = now()
  WHERE id = p_user_id;
  
  -- Log the security event
  PERFORM log_security_event('two_factor_enforced', 
    jsonb_build_object(
      'target_user_id', p_user_id,
      'deadline', p_deadline,
      'immediate', p_immediate
    ),
    auth.uid()
  );
  
  RETURN true;
END;
$$;

-- Function to reset user's 2FA
CREATE OR REPLACE FUNCTION public.reset_user_2fa(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to reset 2FA';
  END IF;
  
  -- Reset user's 2FA settings
  UPDATE public.profiles 
  SET 
    two_factor_enabled = false,
    two_factor_secret = null,
    two_factor_required = false,
    two_factor_deadline = null,
    two_factor_setup_forced = false,
    updated_at = now()
  WHERE id = p_user_id;
  
  -- Log the security event
  PERFORM log_security_event('two_factor_reset', 
    jsonb_build_object('target_user_id', p_user_id),
    auth.uid()
  );
  
  RETURN true;
END;
$$;

-- Function to update 2FA enforcement settings
CREATE OR REPLACE FUNCTION public.update_2fa_enforcement(p_settings jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to update 2FA enforcement settings';
  END IF;
  
  -- Update settings
  UPDATE public.system_settings 
  SET 
    setting_value = p_settings,
    updated_at = now()
  WHERE setting_key = '2fa_enforcement';
  
  -- Log the security event
  PERFORM log_security_event('2fa_enforcement_updated', p_settings, auth.uid());
  
  RETURN true;
END;
$$;