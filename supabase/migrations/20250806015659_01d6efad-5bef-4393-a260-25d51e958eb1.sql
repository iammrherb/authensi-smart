-- Fix core user management issues only

-- Fix the request_password_reset function
CREATE OR REPLACE FUNCTION public.request_password_reset(p_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
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
  v_temp_password := COALESCE(p_password, 'TempPass' || substring(v_user_id::text, 1, 8) || '!');

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

-- Remove the foreign key constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add comment explaining that profiles.id should match auth.users.id when user signs up
COMMENT ON COLUMN public.profiles.id IS 'Should match auth.users.id when user completes signup, but can exist independently for invited users';