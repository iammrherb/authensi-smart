-- Fix business intelligence security by restricting access to sensitive library tables
-- Only admins and product managers should access this business-sensitive data

-- Drop existing overly permissive policies on business-sensitive tables
DROP POLICY IF EXISTS "Resource library readable by authenticated users" ON pain_points_library;
DROP POLICY IF EXISTS "Resource library readable by authenticated users" ON recommendations_library;
DROP POLICY IF EXISTS "Resource library readable by authenticated users" ON requirements_library;
DROP POLICY IF EXISTS "Library tables are readable by authenticated users" ON vendor_library;
DROP POLICY IF EXISTS "Library tables are readable by authenticated users" ON use_case_library;
DROP POLICY IF EXISTS "Library tables are readable by authenticated users" ON test_case_library;

-- Create restrictive policies for pain_points_library
CREATE POLICY "Only admins and product managers can view pain points library"
ON pain_points_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage pain points library"
ON pain_points_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create restrictive policies for recommendations_library
CREATE POLICY "Only admins and product managers can view recommendations library"
ON recommendations_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage recommendations library"
ON recommendations_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create restrictive policies for requirements_library
CREATE POLICY "Only admins and product managers can view requirements library"
ON requirements_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage requirements library"
ON requirements_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create restrictive policies for vendor_library
CREATE POLICY "Only admins and product managers can view vendor library"
ON vendor_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage vendor library"
ON vendor_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create restrictive policies for use_case_library
CREATE POLICY "Only admins and product managers can view use case library"
ON use_case_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage use case library"
ON use_case_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create restrictive policies for test_case_library
CREATE POLICY "Only admins and product managers can view test case library"
ON test_case_library FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Only admins and product managers can manage test case library"
ON test_case_library FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);