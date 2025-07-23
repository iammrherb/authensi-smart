-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.user_owns_project(project_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_uuid AND created_by = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_site(site_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sites 
    WHERE id = site_uuid AND created_by = auth.uid()
  );
$$;