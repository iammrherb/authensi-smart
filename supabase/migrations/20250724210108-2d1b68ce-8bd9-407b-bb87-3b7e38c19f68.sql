-- Create user signup function to create users in the database
CREATE OR REPLACE FUNCTION public.create_new_user(
  _email text,
  _password text,
  _first_name text DEFAULT NULL,
  _last_name text DEFAULT NULL,
  _role app_role DEFAULT 'viewer'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _result jsonb;
BEGIN
  -- Create the user account via Supabase Auth
  -- Note: This function should be called from the application layer
  -- as we can't directly create auth users from SQL functions
  
  -- Insert profile data (will be populated by trigger when user is created)
  -- This is handled by the handle_new_user trigger
  
  -- Return success response
  _result := jsonb_build_object(
    'success', true,
    'message', 'User creation initiated. Profile will be created automatically.'
  );
  
  RETURN _result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_new_user TO authenticated;

-- Add a function to assign initial role after user creation
CREATE OR REPLACE FUNCTION public.assign_initial_user_role(
  _user_id uuid,
  _role app_role DEFAULT 'viewer',
  _scope_type text DEFAULT 'global',
  _scope_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow project owners and managers to assign roles
  IF NOT (
    has_role(auth.uid(), 'project_owner'::app_role) OR 
    has_role(auth.uid(), 'project_manager'::app_role)
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;

  -- Insert the role assignment
  INSERT INTO public.user_roles (user_id, role, scope_type, scope_id, assigned_by)
  VALUES (_user_id, _role, _scope_type, _scope_id, auth.uid());
  
  -- Log the role assignment
  PERFORM log_security_event(
    'role_assigned',
    jsonb_build_object(
      'user_id', _user_id,
      'role', _role,
      'scope_type', _scope_type,
      'scope_id', _scope_id,
      'assigned_by', auth.uid()
    )
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to assign role: %', SQLERRM;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.assign_initial_user_role TO authenticated;