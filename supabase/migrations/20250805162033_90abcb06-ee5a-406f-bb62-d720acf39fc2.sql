-- Create simplified security policies that work with existing table structure

-- Projects policies (corrected)
DROP POLICY IF EXISTS "Users can view projects they created or manage" ON projects;
DROP POLICY IF EXISTS "Authorized users can create projects" ON projects;
DROP POLICY IF EXISTS "Project creators and managers can update projects" ON projects;

CREATE POLICY "Users can view projects they created or manage"
  ON projects FOR SELECT
  USING (
    created_by = auth.uid() OR 
    project_manager = auth.uid() OR 
    project_owner = auth.uid() OR 
    technical_owner = auth.uid() OR 
    portnox_owner = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

CREATE POLICY "Authorized users can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'project_creator'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'sales_engineer'::app_role)
    )
  );

CREATE POLICY "Project creators and managers can update projects"
  ON projects FOR UPDATE
  USING (
    created_by = auth.uid() OR 
    project_manager = auth.uid() OR 
    project_owner = auth.uid() OR 
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Sites policies (simplified to work with current structure)
DROP POLICY IF EXISTS "Users can view sites for their projects" ON sites;
DROP POLICY IF EXISTS "Authorized users can create sites" ON sites;
DROP POLICY IF EXISTS "Site creators can update sites" ON sites;

CREATE POLICY "Users can view sites they created or manage"
  ON sites FOR SELECT
  USING (
    created_by = auth.uid() OR
    assigned_engineer = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

CREATE POLICY "Authorized users can create sites"
  ON sites FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'project_creator'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'sales_engineer'::app_role) OR
      has_role(auth.uid(), 'technical_account_manager'::app_role)
    )
  );

CREATE POLICY "Site creators can update sites"
  ON sites FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_engineer = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );