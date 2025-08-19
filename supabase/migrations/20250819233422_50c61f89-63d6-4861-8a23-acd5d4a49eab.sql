-- Fix RLS policies for customer_team_members table
-- The current policies exist but may not be restrictive enough

-- First, let's verify RLS is enabled
ALTER TABLE customer_team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with stricter controls
DROP POLICY IF EXISTS "Customer managers can manage team members" ON customer_team_members;
DROP POLICY IF EXISTS "Customer users can view team members in their project" ON customer_team_members;

-- Create more restrictive policies

-- Policy 1: Only authenticated users can view team members, and only for projects they have access to
CREATE POLICY "Authenticated users can view team members for their projects"
ON customer_team_members
FOR SELECT
TO authenticated
USING (
  -- Project owners and super admins can see all team members
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = customer_team_members.project_id
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
  OR
  -- Customer users can only see team members for their assigned project
  EXISTS (
    SELECT 1 FROM customer_users cu
    WHERE cu.project_id = customer_team_members.project_id
    AND cu.id = auth.uid()
  )
);

-- Policy 2: Only project owners, customer managers/admins can create team members
CREATE POLICY "Authorized users can create team members"
ON customer_team_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- Project owners and super admins can create team members
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = customer_team_members.project_id
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
  OR
  -- Customer managers/admins can create team members for their project
  EXISTS (
    SELECT 1 FROM customer_users cu
    WHERE cu.project_id = customer_team_members.project_id
    AND cu.id = auth.uid()
    AND cu.role IN ('manager', 'admin')
  )
);

-- Policy 3: Only project owners, customer managers/admins can update team members
CREATE POLICY "Authorized users can update team members"
ON customer_team_members
FOR UPDATE
TO authenticated
USING (
  -- Project owners and super admins can update team members
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = customer_team_members.project_id
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
  OR
  -- Customer managers/admins can update team members for their project
  EXISTS (
    SELECT 1 FROM customer_users cu
    WHERE cu.project_id = customer_team_members.project_id
    AND cu.id = auth.uid()
    AND cu.role IN ('manager', 'admin')
  )
);

-- Policy 4: Only project owners, customer managers/admins can delete team members
CREATE POLICY "Authorized users can delete team members"
ON customer_team_members
FOR DELETE
TO authenticated
USING (
  -- Project owners and super admins can delete team members
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = customer_team_members.project_id
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
  OR
  -- Customer managers/admins can delete team members for their project
  EXISTS (
    SELECT 1 FROM customer_users cu
    WHERE cu.project_id = customer_team_members.project_id
    AND cu.id = auth.uid()
    AND cu.role IN ('manager', 'admin')
  )
);

-- Ensure no public access is allowed by revoking any public grants
REVOKE ALL ON customer_team_members FROM anon;
REVOKE ALL ON customer_team_members FROM public;