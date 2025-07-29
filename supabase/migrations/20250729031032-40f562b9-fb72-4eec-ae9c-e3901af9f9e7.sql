-- Fix security issues by adding RLS policies for tables that have RLS enabled but no policies

-- 1. Fix projects table RLS policies
CREATE POLICY "Users can view projects they have access to" ON projects
FOR SELECT USING (
  -- Users can see projects they created or have roles for
  created_by = auth.uid() OR 
  project_manager = auth.uid() OR 
  project_owner = auth.uid() OR 
  technical_owner = auth.uid() OR 
  portnox_owner = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Users can update projects they have access to" ON projects
FOR UPDATE USING (
  created_by = auth.uid() OR 
  project_manager = auth.uid() OR 
  project_owner = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Users can delete projects they own" ON projects
FOR DELETE USING (
  created_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 2. Fix sites table RLS policies  
CREATE POLICY "Users can view sites they have access to" ON sites
FOR SELECT USING (
  created_by = auth.uid() OR 
  assigned_engineer = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Users can update sites they have access to" ON sites
FOR UPDATE USING (
  created_by = auth.uid() OR 
  assigned_engineer = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Users can delete sites they own" ON sites
FOR DELETE USING (
  created_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. Fix other tables with missing policies
-- POC Activities
CREATE POLICY "Users can view POC activities for their projects" ON poc_activities
FOR SELECT USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create POC activities" ON poc_activities
FOR INSERT WITH CHECK (
  auth.uid() = created_by
);

CREATE POLICY "Users can update POC activities they manage" ON poc_activities
FOR UPDATE USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can delete POC activities they created" ON poc_activities
FOR DELETE USING (
  created_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project handoffs
CREATE POLICY "Users can view project handoffs" ON project_handoffs
FOR SELECT USING (
  created_by = auth.uid() OR 
  signoff_from = auth.uid() OR 
  signoff_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create project handoffs" ON project_handoffs
FOR INSERT WITH CHECK (
  auth.uid() = created_by
);

CREATE POLICY "Users can update project handoffs they manage" ON project_handoffs
FOR UPDATE USING (
  created_by = auth.uid() OR 
  signoff_from = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project milestones
CREATE POLICY "Users can view project milestones" ON project_milestones
FOR SELECT USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create project milestones" ON project_milestones
FOR INSERT WITH CHECK (
  auth.uid() = created_by
);

CREATE POLICY "Users can update project milestones" ON project_milestones
FOR UPDATE USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project requirements
CREATE POLICY "Users can view project requirements" ON project_requirements
FOR SELECT USING (
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create project requirements" ON project_requirements
FOR INSERT WITH CHECK (true); -- Anyone can create requirements

CREATE POLICY "Users can update project requirements" ON project_requirements
FOR UPDATE USING (
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project test cases
CREATE POLICY "Users can view project test cases" ON project_test_cases
FOR SELECT USING (
  executed_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create project test cases" ON project_test_cases
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update project test cases" ON project_test_cases
FOR UPDATE USING (
  executed_by = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project use cases
CREATE POLICY "Users can view project use cases" ON project_use_cases
FOR SELECT USING (
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create project use cases" ON project_use_cases
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update project use cases" ON project_use_cases
FOR UPDATE USING (
  assigned_to = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Project vendors
CREATE POLICY "Users can view project vendors" ON project_vendors
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role) OR
  true -- Allow viewing for now, can be restricted later
);

CREATE POLICY "Users can create project vendors" ON project_vendors
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update project vendors" ON project_vendors
FOR UPDATE USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Security audit log (admin only)
CREATE POLICY "Super admins can view security logs" ON security_audit_log
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "System can insert security logs" ON security_audit_log
FOR INSERT WITH CHECK (true); -- Allow system to log events

-- Fix function search path security
CREATE OR REPLACE FUNCTION public.ensure_first_super_admin()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_count INTEGER;
BEGIN
    -- Check if any super admin exists
    SELECT COUNT(*) INTO super_admin_count
    FROM user_roles 
    WHERE role = 'super_admin' AND scope_type = 'global';
    
    -- If no super admin exists, make the new user a super admin
    IF super_admin_count = 0 THEN
        INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
        VALUES (NEW.id, 'super_admin', 'global', NEW.id, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';