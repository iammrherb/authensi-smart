-- Fix critical security vulnerabilities in library tables
-- Add proper RLS policies for business intelligence data

-- Enable RLS on library tables that currently lack proper protection
ALTER TABLE pain_points_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_case_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_library ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policies for pain_points_library
CREATE POLICY "Admin users can view pain points library"
ON pain_points_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage pain points library"
ON pain_points_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

-- Create restrictive RLS policies for recommendations_library
CREATE POLICY "Admin users can view recommendations library"
ON recommendations_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage recommendations library"
ON recommendations_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

-- Create restrictive RLS policies for requirements_library
CREATE POLICY "Admin users can view requirements library"
ON requirements_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage requirements library"
ON requirements_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

-- Create restrictive RLS policies for vendor_library
CREATE POLICY "Admin users can view vendor library"
ON vendor_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage vendor library"
ON vendor_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

-- Create restrictive RLS policies for use_case_library
CREATE POLICY "Admin users can view use case library"
ON use_case_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage use case library"
ON use_case_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

-- Create restrictive RLS policies for resource_library
CREATE POLICY "Admin users can view resource library"
ON resource_library FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));

CREATE POLICY "Admin users can manage resource library"
ON resource_library FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role));