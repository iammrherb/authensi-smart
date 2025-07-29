-- Update the app_role enum to include the new enhanced roles
DROP TYPE IF EXISTS public.app_role CASCADE;

CREATE TYPE public.app_role AS ENUM (
  'super_admin',        -- Can manage everything and see all projects
  'project_creator',    -- Can create and manage projects they create
  'project_viewer',     -- Can view projects they're assigned to
  'product_manager',    -- Can create/manage projects, scoping, full tracking
  'sales_engineer',     -- Can do scoping, create projects, generate reports
  'technical_account_manager', -- Can manage specific projects, stakeholders, phases
  'technical_seller',   -- Can do scoping and create projects
  'sales',             -- Can do scoping and create projects
  'lead_engineer',     -- Can manage technical aspects of projects
  'engineer',          -- Can work on assigned projects
  'viewer'             -- Read-only access
);

-- Update user_roles table to use the new enum
-- Note: This will recreate the table with existing data
CREATE TABLE public.user_roles_new (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  scope_type text NOT NULL DEFAULT 'global',
  scope_id uuid,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, scope_type, scope_id)
);

-- Copy existing data to new table (if any exists)
INSERT INTO public.user_roles_new (user_id, role, scope_type, scope_id, assigned_by, assigned_at, created_at, updated_at)
SELECT 
  user_id, 
  CASE 
    WHEN role::text = 'project_owner' THEN 'super_admin'::app_role
    WHEN role::text = 'project_manager' THEN 'product_manager'::app_role
    WHEN role::text = 'lead_engineer' THEN 'lead_engineer'::app_role
    WHEN role::text = 'engineer' THEN 'engineer'::app_role
    ELSE 'viewer'::app_role
  END,
  scope_type,
  scope_id,
  assigned_by,
  assigned_at,
  created_at,
  updated_at
FROM public.user_roles;

-- Drop old table and rename new one
DROP TABLE public.user_roles;
ALTER TABLE public.user_roles_new RENAME TO user_roles;

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Update the has_role function to work with new roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role, _scope_type text DEFAULT 'global', _scope_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role OR
        (role = 'super_admin' AND _scope_type IN ('global', 'project', 'site')) OR
        (role IN ('product_manager', 'sales_engineer', 'technical_account_manager') AND _scope_type IN ('project', 'site'))
      )
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$$;

-- Update the can_manage_roles function
CREATE OR REPLACE FUNCTION public.can_manage_roles(_user_id uuid, _scope_type text DEFAULT 'global', _scope_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'project_creator', 'product_manager', 'sales_engineer', 'technical_account_manager')
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$$;

-- Create RLS policies for the new user_roles table
CREATE POLICY "Users can view roles they have access to" 
ON public.user_roles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  can_manage_roles(auth.uid(), scope_type, scope_id) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Authorized users can create roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Authorized users can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Authorized users can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (
  can_manage_roles(auth.uid(), scope_type, scope_id) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Allow creation of first super admin
CREATE POLICY "Allow creation of first super admin" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE role = 'super_admin' AND scope_type = 'global'
  ) OR 
  can_manage_roles(auth.uid(), scope_type, scope_id) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Update triggers
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the auto_assign_global_admin function for super_admin
CREATE OR REPLACE FUNCTION public.auto_assign_global_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if this is the first user and no super admin exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'super_admin' AND scope_type = 'global'
  ) THEN
    INSERT INTO public.user_roles (user_id, role, scope_type, assigned_by)
    VALUES (NEW.id, 'super_admin', 'global', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;