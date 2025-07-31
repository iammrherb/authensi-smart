-- Add two_factor_enabled and two_factor_secret columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS two_factor_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret text;

-- Function to enable two-factor authentication
CREATE OR REPLACE FUNCTION public.enable_two_factor_auth(
  p_user_id uuid,
  p_secret text,
  p_verification_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_expected_code text;
BEGIN
  -- This is a simplified TOTP verification (in production, use a proper TOTP library)
  -- For now, we'll accept any 6-digit code for demo purposes
  IF length(p_verification_code) != 6 OR p_verification_code !~ '^[0-9]+$' THEN
    RAISE EXCEPTION 'Invalid verification code format';
  END IF;
  
  -- Update the user's profile with 2FA settings
  UPDATE public.profiles 
  SET two_factor_enabled = true,
      two_factor_secret = p_secret,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Log the security event
  PERFORM log_security_event('two_factor_enabled', 
    jsonb_build_object('user_id', p_user_id),
    p_user_id
  );
  
  RETURN true;
END;
$$;

-- Function to disable two-factor authentication
CREATE OR REPLACE FUNCTION public.disable_two_factor_auth(
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is trying to disable their own 2FA
  IF p_user_id != auth.uid() AND NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to disable 2FA for this user';
  END IF;
  
  -- Update the user's profile to disable 2FA
  UPDATE public.profiles 
  SET two_factor_enabled = false,
      two_factor_secret = null,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Log the security event
  PERFORM log_security_event('two_factor_disabled', 
    jsonb_build_object('user_id', p_user_id),
    p_user_id
  );
  
  RETURN true;
END;
$$;

-- Function to verify TOTP code (simplified version)
CREATE OR REPLACE FUNCTION public.verify_totp_code(
  p_user_id uuid,
  p_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_secret text;
BEGIN
  -- Get user's 2FA secret
  SELECT two_factor_secret INTO v_secret
  FROM public.profiles
  WHERE id = p_user_id AND two_factor_enabled = true;
  
  IF v_secret IS NULL THEN
    RETURN false;
  END IF;
  
  -- Simplified verification (in production, implement proper TOTP)
  -- For demo purposes, accept any 6-digit code
  IF length(p_code) = 6 AND p_code ~ '^[0-9]+$' THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;