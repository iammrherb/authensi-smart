-- First, let's assign a role to Garrett.Gross so he shows up in user management
INSERT INTO public.user_roles (user_id, role, scope_type, assigned_by)
VALUES (
  '08c1181f-bccd-4cef-ba70-2541b6c55024', -- Garrett's user ID
  'super_admin', 
  'global', 
  '4507d848-650f-4fa5-a4d2-f5fd6eaffe23' -- assigned by iammrherb
);

-- Update the create_user_safely function to work properly
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
  v_user_id uuid;
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

  -- Generate a random user ID for the profile
  v_user_id := gen_random_uuid();

  -- Create the user profile directly (they'll need to sign up to activate)
  INSERT INTO public.profiles (id, email, first_name, last_name, is_active)
  VALUES (v_user_id, p_email, p_first_name, p_last_name, true);

  -- Assign the role
  INSERT INTO public.user_roles (user_id, role, scope_type, scope_id, assigned_by)
  VALUES (v_user_id, p_role, p_scope_type, p_scope_id, auth.uid());

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_created_directly', jsonb_build_object(
    'target_email', p_email,
    'target_user_id', v_user_id,
    'role', p_role,
    'scope_type', p_scope_type
  ));

  v_result := jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'message', 'User profile created successfully. They need to sign up to activate their account.'
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

-- Update RLS policies for better user management
DROP POLICY IF EXISTS "Enhanced profile viewing" ON profiles;
CREATE POLICY "Enhanced profile viewing" 
ON profiles FOR SELECT 
USING (
  (auth.uid() = id) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role) OR
  (is_active = true AND is_blocked = false)
);

-- Allow super admins to create profiles for invited users
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert and manage profiles" 
ON profiles FOR INSERT 
WITH CHECK (
  (auth.uid() = id) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Update profiles to allow updates by admins
DROP POLICY IF EXISTS "Enhanced profile updates" ON profiles;
CREATE POLICY "Enhanced profile updates" 
ON profiles FOR UPDATE 
USING (
  (auth.uid() = id) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Add delete policy for profiles (soft delete by setting inactive)
CREATE POLICY "Admins can soft delete profiles" 
ON profiles FOR UPDATE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Ensure the auto-assign trigger works for new users
DROP TRIGGER IF EXISTS auto_assign_global_admin_trigger ON profiles;
CREATE TRIGGER auto_assign_global_admin_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_global_admin();

-- Function to safely delete users (soft delete)
CREATE OR REPLACE FUNCTION public.soft_delete_user(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to delete users';
  END IF;

  -- Prevent self-deletion
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Soft delete by deactivating
  UPDATE profiles 
  SET is_active = false,
      is_blocked = true,
      updated_at = now()
  WHERE id = p_user_id;

  -- Remove all user roles
  DELETE FROM user_roles WHERE user_id = p_user_id;

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_soft_deleted', jsonb_build_object('deleted_user_id', p_user_id));

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User deactivated successfully'
  );
END;
$function$;