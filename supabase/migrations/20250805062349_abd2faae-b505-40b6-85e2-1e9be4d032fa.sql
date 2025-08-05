-- Security policies for all new tables to address RLS warnings

-- System settings policies
CREATE POLICY "Super admins can manage system settings"
  ON system_settings FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Security audit log policies
CREATE POLICY "Users can view their own audit logs"
  ON security_audit_log FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can insert audit logs"
  ON security_audit_log FOR INSERT
  WITH CHECK (true);

-- User activity log policies
CREATE POLICY "Users can view their own activity"
  ON user_activity_log FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can insert activity logs"
  ON user_activity_log FOR INSERT
  WITH CHECK (true);

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can manage their own sessions"
  ON user_sessions FOR ALL
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Projects policies
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

-- Fix search path for existing functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = 'public';