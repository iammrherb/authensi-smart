-- Fix RLS policies to be user-specific instead of allowing all authenticated users

-- Update sites table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to view sites" ON public.sites;
DROP POLICY IF EXISTS "Allow authenticated users to insert sites" ON public.sites;
DROP POLICY IF EXISTS "Allow authenticated users to update sites" ON public.sites;
DROP POLICY IF EXISTS "Allow authenticated users to delete sites" ON public.sites;

CREATE POLICY "Users can view their own sites" 
ON public.sites 
FOR SELECT 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own sites" 
ON public.sites 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own sites" 
ON public.sites 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own sites" 
ON public.sites 
FOR DELETE 
TO authenticated
USING (auth.uid() = created_by);

-- Update projects table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to view projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to delete projects" ON public.projects;

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (auth.uid() = created_by);

-- Update project_sites table RLS policies (based on project ownership)
DROP POLICY IF EXISTS "Allow authenticated users to view project_sites" ON public.project_sites;
DROP POLICY IF EXISTS "Allow authenticated users to insert project_sites" ON public.project_sites;
DROP POLICY IF EXISTS "Allow authenticated users to update project_sites" ON public.project_sites;
DROP POLICY IF EXISTS "Allow authenticated users to delete project_sites" ON public.project_sites;

-- Create security definer function to check project ownership
CREATE OR REPLACE FUNCTION public.user_owns_project(project_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_uuid AND created_by = auth.uid()
  );
$$;

CREATE POLICY "Users can view project_sites for their projects" 
ON public.project_sites 
FOR SELECT 
TO authenticated
USING (public.user_owns_project(project_id));

CREATE POLICY "Users can create project_sites for their projects" 
ON public.project_sites 
FOR INSERT 
TO authenticated
WITH CHECK (public.user_owns_project(project_id));

CREATE POLICY "Users can update project_sites for their projects" 
ON public.project_sites 
FOR UPDATE 
TO authenticated
USING (public.user_owns_project(project_id));

CREATE POLICY "Users can delete project_sites for their projects" 
ON public.project_sites 
FOR DELETE 
TO authenticated
USING (public.user_owns_project(project_id));

-- Update scoping_questionnaires table RLS policies 
DROP POLICY IF EXISTS "Allow authenticated users to view questionnaires" ON public.scoping_questionnaires;
DROP POLICY IF EXISTS "Allow authenticated users to insert questionnaires" ON public.scoping_questionnaires;
DROP POLICY IF EXISTS "Allow authenticated users to update questionnaires" ON public.scoping_questionnaires;
DROP POLICY IF EXISTS "Allow authenticated users to delete questionnaires" ON public.scoping_questionnaires;

-- Create security definer function to check site ownership
CREATE OR REPLACE FUNCTION public.user_owns_site(site_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sites 
    WHERE id = site_uuid AND created_by = auth.uid()
  );
$$;

CREATE POLICY "Users can view questionnaires for their sites" 
ON public.scoping_questionnaires 
FOR SELECT 
TO authenticated
USING (public.user_owns_site(site_id));

CREATE POLICY "Users can create questionnaires for their sites" 
ON public.scoping_questionnaires 
FOR INSERT 
TO authenticated
WITH CHECK (public.user_owns_site(site_id) AND auth.uid() = created_by);

CREATE POLICY "Users can update questionnaires for their sites" 
ON public.scoping_questionnaires 
FOR UPDATE 
TO authenticated
USING (public.user_owns_site(site_id) AND auth.uid() = created_by);

CREATE POLICY "Users can delete questionnaires for their sites" 
ON public.scoping_questionnaires 
FOR DELETE 
TO authenticated
USING (public.user_owns_site(site_id) AND auth.uid() = created_by);

-- Update implementation_checklists table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to view checklists" ON public.implementation_checklists;
DROP POLICY IF EXISTS "Allow authenticated users to insert checklists" ON public.implementation_checklists;
DROP POLICY IF EXISTS "Allow authenticated users to update checklists" ON public.implementation_checklists;
DROP POLICY IF EXISTS "Allow authenticated users to delete checklists" ON public.implementation_checklists;

CREATE POLICY "Users can view checklists for their sites" 
ON public.implementation_checklists 
FOR SELECT 
TO authenticated
USING (public.user_owns_site(site_id));

CREATE POLICY "Users can create checklists for their sites" 
ON public.implementation_checklists 
FOR INSERT 
TO authenticated
WITH CHECK (public.user_owns_site(site_id) AND auth.uid() = created_by);

CREATE POLICY "Users can update checklists for their sites" 
ON public.implementation_checklists 
FOR UPDATE 
TO authenticated
USING (public.user_owns_site(site_id) AND auth.uid() = created_by);

CREATE POLICY "Users can delete checklists for their sites" 
ON public.implementation_checklists 
FOR DELETE 
TO authenticated
USING (public.user_owns_site(site_id) AND auth.uid() = created_by);