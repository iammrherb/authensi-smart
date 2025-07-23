-- Create user_roles table for managing project and site assignments
CREATE TYPE public.app_role AS ENUM ('project_owner', 'project_manager', 'lead_engineer', 'engineer', 'viewer');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global', 'project', 'site')),
  scope_id UUID, -- project_id or site_id depending on scope_type
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, scope_type, scope_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role, _scope_type text DEFAULT 'global', _scope_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$$;

-- Create function to check if user can manage roles
CREATE OR REPLACE FUNCTION public.can_manage_roles(_user_id uuid, _scope_type text DEFAULT 'global', _scope_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('project_owner', 'project_manager')
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles they have access to"
ON public.user_roles
FOR SELECT
USING (
  auth.uid() = user_id OR
  can_manage_roles(auth.uid(), scope_type, scope_id) OR
  has_role(auth.uid(), 'project_owner') OR
  has_role(auth.uid(), 'project_manager')
);

CREATE POLICY "Project owners and managers can create roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR
  has_role(auth.uid(), 'project_owner')
);

CREATE POLICY "Project owners and managers can update roles"
ON public.user_roles
FOR UPDATE
USING (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR
  has_role(auth.uid(), 'project_owner')
);

CREATE POLICY "Project owners and managers can delete roles"
ON public.user_roles
FOR DELETE
USING (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR
  has_role(auth.uid(), 'project_owner')
);

-- Update existing projects and sites tables to include role-based access
-- Add RLS policies to projects table that consider user roles
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can view projects they have access to"
ON public.projects
FOR SELECT
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'project', id) OR
  has_role(auth.uid(), 'project_manager', 'project', id) OR
  has_role(auth.uid(), 'lead_engineer', 'project', id) OR
  has_role(auth.uid(), 'engineer', 'project', id) OR
  has_role(auth.uid(), 'viewer', 'project', id)
);

CREATE POLICY "Users can update projects they manage"
ON public.projects
FOR UPDATE
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'project', id) OR
  has_role(auth.uid(), 'project_manager', 'project', id)
);

CREATE POLICY "Users can delete projects they own"
ON public.projects
FOR DELETE
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'project', id)
);

-- Add RLS policies to sites table that consider user roles
DROP POLICY IF EXISTS "Users can view their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update their own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can delete their own sites" ON public.sites;

CREATE POLICY "Users can view sites they have access to"
ON public.sites
FOR SELECT
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'site', id) OR
  has_role(auth.uid(), 'project_manager', 'site', id) OR
  has_role(auth.uid(), 'lead_engineer', 'site', id) OR
  has_role(auth.uid(), 'engineer', 'site', id) OR
  has_role(auth.uid(), 'viewer', 'site', id) OR
  EXISTS (
    SELECT 1 FROM public.project_sites ps
    JOIN public.projects p ON ps.project_id = p.id
    WHERE ps.site_id = sites.id
    AND (
      has_role(auth.uid(), 'project_owner', 'project', p.id) OR
      has_role(auth.uid(), 'project_manager', 'project', p.id) OR
      has_role(auth.uid(), 'lead_engineer', 'project', p.id) OR
      has_role(auth.uid(), 'engineer', 'project', p.id) OR
      has_role(auth.uid(), 'viewer', 'project', p.id)
    )
  )
);

CREATE POLICY "Users can update sites they manage"
ON public.sites
FOR UPDATE
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'site', id) OR
  has_role(auth.uid(), 'project_manager', 'site', id) OR
  has_role(auth.uid(), 'lead_engineer', 'site', id)
);

CREATE POLICY "Users can delete sites they own"
ON public.sites
FOR DELETE
USING (
  auth.uid() = created_by OR
  has_role(auth.uid(), 'project_owner', 'site', id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();