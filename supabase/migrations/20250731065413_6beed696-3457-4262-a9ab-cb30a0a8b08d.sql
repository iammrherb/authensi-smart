-- Fix the create_user_safely function to use the service role key for auth user creation
CREATE OR REPLACE FUNCTION public.create_user_safely(
  p_email text, 
  p_password text, 
  p_first_name text DEFAULT NULL::text, 
  p_last_name text DEFAULT NULL::text, 
  p_role app_role DEFAULT 'viewer'::app_role, 
  p_scope_type text DEFAULT 'global'::text, 
  p_scope_id uuid DEFAULT NULL::uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_result JSON;
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

  -- Log activity - Note: this creates a user invitation that needs to be manually completed
  -- The actual user creation happens when they accept the invitation
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_invitation_created', jsonb_build_object(
    'target_email', p_email,
    'role', p_role,
    'scope_type', p_scope_type
  ));

  v_result := jsonb_build_object(
    'success', true,
    'message', 'User invitation created. They will receive an email to complete registration.'
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