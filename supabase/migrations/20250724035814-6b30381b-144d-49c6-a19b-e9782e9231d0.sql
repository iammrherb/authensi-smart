-- Create default global admin role for system setup
-- First, create a function to create initial admin
CREATE OR REPLACE FUNCTION create_initial_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only create if no global admin exists
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  ) THEN
    INSERT INTO user_roles (user_id, role, scope_type, assigned_by)
    VALUES (_user_id, 'project_owner', 'global', _user_id);
  END IF;
END;
$$;

-- Enhanced user roles policies to support initial setup
CREATE POLICY "Allow creation of first global admin" 
ON user_roles 
FOR INSERT 
WITH CHECK (
  -- Allow if no global admins exist yet
  NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  )
  OR 
  -- Or use existing policy check
  (can_manage_roles(auth.uid(), scope_type, scope_id) OR has_role(auth.uid(), 'project_owner'::app_role))
);

-- Update profiles table to include better user lookup
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email) WHERE is_active = true;