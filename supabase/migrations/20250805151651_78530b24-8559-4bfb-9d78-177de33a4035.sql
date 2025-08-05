-- Security policies for all new tables to address RLS warnings
-- Drop existing policies first, then recreate them

-- System settings policies
DROP POLICY IF EXISTS "Super admins can manage system settings" ON system_settings;
CREATE POLICY "Super admins can manage system settings"
  ON system_settings FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Security audit log policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON security_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON security_audit_log;

CREATE POLICY "Users can view their own audit logs"
  ON security_audit_log FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can insert audit logs"
  ON security_audit_log FOR INSERT
  WITH CHECK (true);

-- User activity log policies
DROP POLICY IF EXISTS "Users can view their own activity" ON user_activity_log;
DROP POLICY IF EXISTS "System can insert activity logs" ON user_activity_log;

CREATE POLICY "Users can view their own activity"
  ON user_activity_log FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can insert activity logs"
  ON user_activity_log FOR INSERT
  WITH CHECK (true);

-- User sessions policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON user_sessions;

CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can manage their own sessions"
  ON user_sessions FOR ALL
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Projects policies
DROP POLICY IF EXISTS "Users can view projects they created or manage" ON projects;
DROP POLICY IF EXISTS "Authorized users can create projects" ON projects;
DROP POLICY IF EXISTS "Project creators and managers can update projects" ON projects;

CREATE POLICY "Users can view projects they created or manage"
  ON projects FOR SELECT
  USING (
    created_by = auth.uid() OR 
    project_manager = auth.uid() OR 
    technical_lead = auth.uid() OR 
    sales_contact = auth.uid() OR
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
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Sites policies
DROP POLICY IF EXISTS "Users can view sites for their projects" ON sites;
DROP POLICY IF EXISTS "Authorized users can create sites" ON sites;
DROP POLICY IF EXISTS "Site creators can update sites" ON sites;

CREATE POLICY "Users can view sites for their projects"
  ON sites FOR SELECT
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role) OR
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = sites.project_id 
      AND (p.created_by = auth.uid() OR p.project_manager = auth.uid() OR p.technical_lead = auth.uid())
    )
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
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Vendors policies (library data - readable by all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view vendors" ON vendors;
DROP POLICY IF EXISTS "Authorized users can manage vendors" ON vendors;

CREATE POLICY "Authenticated users can view vendors"
  ON vendors FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can manage vendors"
  ON vendors FOR ALL
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Vendor models policies
DROP POLICY IF EXISTS "Authenticated users can view vendor models" ON vendor_models;
DROP POLICY IF EXISTS "Authorized users can manage vendor models" ON vendor_models;

CREATE POLICY "Authenticated users can view vendor models"
  ON vendor_models FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can manage vendor models"
  ON vendor_models FOR ALL
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Questionnaires policies
DROP POLICY IF EXISTS "Authenticated users can view questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Authorized users can create questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Questionnaire creators can update questionnaires" ON questionnaires;

CREATE POLICY "Authenticated users can view questionnaires"
  ON questionnaires FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create questionnaires"
  ON questionnaires FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'sales_engineer'::app_role)
    )
  );

CREATE POLICY "Questionnaire creators can update questionnaires"
  ON questionnaires FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Questionnaire responses policies
DROP POLICY IF EXISTS "Users can view responses for their projects" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can create questionnaire responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Response creators can update responses" ON questionnaire_responses;

CREATE POLICY "Users can view responses for their projects"
  ON questionnaire_responses FOR SELECT
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role) OR
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = questionnaire_responses.project_id 
      AND (p.created_by = auth.uid() OR p.project_manager = auth.uid())
    )
  );

CREATE POLICY "Users can create questionnaire responses"
  ON questionnaire_responses FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Response creators can update responses"
  ON questionnaire_responses FOR UPDATE
  USING (
    created_by = auth.uid() OR
    reviewer_id = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Use cases policies (library data)
DROP POLICY IF EXISTS "Authenticated users can view use cases" ON use_cases;
DROP POLICY IF EXISTS "Authorized users can create use cases" ON use_cases;
DROP POLICY IF EXISTS "Use case creators can update use cases" ON use_cases;

CREATE POLICY "Authenticated users can view use cases"
  ON use_cases FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create use cases"
  ON use_cases FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'sales_engineer'::app_role) OR
      has_role(auth.uid(), 'technical_account_manager'::app_role)
    )
  );

CREATE POLICY "Use case creators can update use cases"
  ON use_cases FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Requirements policies (library data)
DROP POLICY IF EXISTS "Authenticated users can view requirements" ON requirements;
DROP POLICY IF EXISTS "Authorized users can create requirements" ON requirements;
DROP POLICY IF EXISTS "Requirement creators can update requirements" ON requirements;

CREATE POLICY "Authenticated users can view requirements"
  ON requirements FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create requirements"
  ON requirements FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'sales_engineer'::app_role) OR
      has_role(auth.uid(), 'technical_account_manager'::app_role)
    )
  );

CREATE POLICY "Requirement creators can update requirements"
  ON requirements FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );

-- Test cases policies (library data)
DROP POLICY IF EXISTS "Authenticated users can view test cases" ON test_cases;
DROP POLICY IF EXISTS "Authorized users can create test cases" ON test_cases;
DROP POLICY IF EXISTS "Test case creators can update test cases" ON test_cases;

CREATE POLICY "Authenticated users can view test cases"
  ON test_cases FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can create test cases"
  ON test_cases FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND (
      has_role(auth.uid(), 'super_admin'::app_role) OR
      has_role(auth.uid(), 'product_manager'::app_role) OR
      has_role(auth.uid(), 'technical_account_manager'::app_role) OR
      has_role(auth.uid(), 'implementation_specialist'::app_role)
    )
  );

CREATE POLICY "Test case creators can update test cases"
  ON test_cases FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_role(auth.uid(), 'super_admin'::app_role) OR
    has_role(auth.uid(), 'product_manager'::app_role)
  );