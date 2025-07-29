-- Enable creation and management of library items

-- Update use_case_library policies to allow creation and management
CREATE POLICY "Authenticated users can create use cases" 
ON public.use_case_library 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update use cases they created" 
ON public.use_case_library 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete use cases" 
ON public.use_case_library 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Update requirements_library policies to allow creation and management
CREATE POLICY "Authenticated users can create requirements" 
ON public.requirements_library 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update requirements they created" 
ON public.requirements_library 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete requirements" 
ON public.requirements_library 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Update test_case_library policies to allow creation and management
CREATE POLICY "Authenticated users can create test cases" 
ON public.test_case_library 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update test cases they created" 
ON public.test_case_library 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete test cases" 
ON public.test_case_library 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create site-specific assignments table for use cases
CREATE TABLE public.site_use_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  use_case_id UUID NOT NULL REFERENCES public.use_case_library(id),
  priority TEXT NOT NULL,
  status TEXT DEFAULT 'planned',
  implementation_notes TEXT,
  target_completion DATE,
  actual_completion DATE,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, use_case_id)
);

ALTER TABLE public.site_use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create site use cases for their sites" 
ON public.site_use_cases 
FOR INSERT 
WITH CHECK (user_owns_site(site_id));

CREATE POLICY "Users can view site use cases for their sites" 
ON public.site_use_cases 
FOR SELECT 
USING (user_owns_site(site_id));

CREATE POLICY "Users can update site use cases for their sites" 
ON public.site_use_cases 
FOR UPDATE 
USING (user_owns_site(site_id));

CREATE POLICY "Users can delete site use cases for their sites" 
ON public.site_use_cases 
FOR DELETE 
USING (user_owns_site(site_id));

-- Create site-specific assignments table for requirements
CREATE TABLE public.site_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  requirement_id UUID NOT NULL REFERENCES public.requirements_library(id),
  status TEXT DEFAULT 'identified',
  implementation_approach TEXT,
  target_date DATE,
  completion_date DATE,
  verification_status TEXT DEFAULT 'pending',
  verification_notes TEXT,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, requirement_id)
);

ALTER TABLE public.site_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create site requirements for their sites" 
ON public.site_requirements 
FOR INSERT 
WITH CHECK (user_owns_site(site_id));

CREATE POLICY "Users can view site requirements for their sites" 
ON public.site_requirements 
FOR SELECT 
USING (user_owns_site(site_id));

CREATE POLICY "Users can update site requirements for their sites" 
ON public.site_requirements 
FOR UPDATE 
USING (user_owns_site(site_id));

CREATE POLICY "Users can delete site requirements for their sites" 
ON public.site_requirements 
FOR DELETE 
USING (user_owns_site(site_id));

-- Add update triggers for timestamps
CREATE TRIGGER update_site_use_cases_updated_at
BEFORE UPDATE ON public.site_use_cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_requirements_updated_at
BEFORE UPDATE ON public.site_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();