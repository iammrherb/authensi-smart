-- Fix customer_team_members RLS policies to be more restrictive
-- First drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view team members for their projects" ON customer_team_members;
DROP POLICY IF EXISTS "Authorized users can create team members" ON customer_team_members;
DROP POLICY IF EXISTS "Authorized users can update team members" ON customer_team_members;
DROP POLICY IF EXISTS "Authorized users can delete team members" ON customer_team_members;

-- Create more restrictive policies
-- Only project owners, super admins, and customer users with specific roles can view team members
CREATE POLICY "Project owners and authorized customer users can view team members"
ON customer_team_members FOR SELECT
TO authenticated
USING (
  -- Project owners or super admins
  (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_team_members.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  ))
  OR
  -- Customer users with manager/admin role on the same project
  (EXISTS (
    SELECT 1 FROM customer_users cu 
    WHERE cu.project_id = customer_team_members.project_id 
    AND cu.id = auth.uid() 
    AND cu.role IN ('manager', 'admin')
    AND cu.is_active = true
  ))
);

-- Only project owners, super admins, and customer managers/admins can create team members
CREATE POLICY "Authorized users can create team members"
ON customer_team_members FOR INSERT
TO authenticated
WITH CHECK (
  -- Project owners or super admins
  (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_team_members.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  ))
  OR
  -- Customer users with manager/admin role
  (EXISTS (
    SELECT 1 FROM customer_users cu 
    WHERE cu.project_id = customer_team_members.project_id 
    AND cu.id = auth.uid() 
    AND cu.role IN ('manager', 'admin')
    AND cu.is_active = true
  ))
);

-- Same restrictions for updates
CREATE POLICY "Authorized users can update team members"
ON customer_team_members FOR UPDATE
TO authenticated
USING (
  -- Project owners or super admins
  (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_team_members.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  ))
  OR
  -- Customer users with manager/admin role
  (EXISTS (
    SELECT 1 FROM customer_users cu 
    WHERE cu.project_id = customer_team_members.project_id 
    AND cu.id = auth.uid() 
    AND cu.role IN ('manager', 'admin')
    AND cu.is_active = true
  ))
);

-- Same restrictions for deletes
CREATE POLICY "Authorized users can delete team members"
ON customer_team_members FOR DELETE
TO authenticated
USING (
  -- Project owners or super admins
  (EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_team_members.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  ))
  OR
  -- Customer users with manager/admin role
  (EXISTS (
    SELECT 1 FROM customer_users cu 
    WHERE cu.project_id = customer_team_members.project_id 
    AND cu.id = auth.uid() 
    AND cu.role IN ('manager', 'admin')
    AND cu.is_active = true
  ))
);

-- Also fix customer_users table security issue
-- Drop existing policies
DROP POLICY IF EXISTS "Customer users can view their own profile" ON customer_users;
DROP POLICY IF EXISTS "Project owners can manage customer users for their projects" ON customer_users;

-- Create more restrictive policies for customer_users
CREATE POLICY "Customer users can view their own profile only"
ON customer_users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Only project owners and super admins can view customer users
CREATE POLICY "Project owners can view customer users for their projects"
ON customer_users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_users.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- Only project owners and super admins can manage customer users
CREATE POLICY "Project owners can manage customer users"
ON customer_users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_users.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = customer_users.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);