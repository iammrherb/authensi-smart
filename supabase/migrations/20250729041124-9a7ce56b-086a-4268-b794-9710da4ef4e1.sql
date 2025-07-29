-- Create granular permissions system
CREATE TYPE public.permission_type AS ENUM (
  'read', 'write', 'update', 'delete', 'admin'
);

CREATE TYPE public.resource_type AS ENUM (
  'projects', 'sites', 'users', 'vendors', 'use_cases', 'requirements', 'test_cases', 'reports', 'settings'
);

-- Custom role permissions table
CREATE TABLE public.custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User invitations table for admin approval workflow
CREATE TABLE public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  custom_role_id UUID REFERENCES public.custom_roles(id),
  scope_type TEXT NOT NULL DEFAULT 'global',
  scope_id UUID,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'used')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Custom roles policies
CREATE POLICY "Super admins can manage custom roles" ON public.custom_roles
  FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view custom roles" ON public.custom_roles
  FOR SELECT USING (true);

-- User invitations policies
CREATE POLICY "Super admins can manage invitations" ON public.user_invitations
  FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view invitations they created" ON public.user_invitations
  FOR SELECT USING (invited_by = auth.uid());

-- Insert default custom roles based on existing app_role enum
INSERT INTO public.custom_roles (name, description, permissions, is_system_role) VALUES
('Super Admin', 'Full system access with all permissions', '{"projects": ["read", "write", "update", "delete", "admin"], "sites": ["read", "write", "update", "delete", "admin"], "users": ["read", "write", "update", "delete", "admin"], "vendors": ["read", "write", "update", "delete", "admin"], "use_cases": ["read", "write", "update", "delete", "admin"], "requirements": ["read", "write", "update", "delete", "admin"], "test_cases": ["read", "write", "update", "delete", "admin"], "reports": ["read", "write", "update", "delete", "admin"], "settings": ["read", "write", "update", "delete", "admin"]}', true),
('Project Creator', 'Can create and manage projects they create', '{"projects": ["read", "write", "update"], "sites": ["read", "write"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read"], "reports": ["read"]}', true),
('Project Viewer', 'Read-only access to assigned projects', '{"projects": ["read"], "sites": ["read"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read"], "reports": ["read"]}', true),
('Product Manager', 'Full project lifecycle management', '{"projects": ["read", "write", "update", "delete"], "sites": ["read", "write", "update"], "vendors": ["read", "write"], "use_cases": ["read", "write"], "requirements": ["read", "write"], "test_cases": ["read", "write"], "reports": ["read", "write"]}', true),
('Sales Engineer', 'Technical sales with scoping capabilities', '{"projects": ["read", "write"], "sites": ["read", "write"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read"], "reports": ["read"]}', true),
('Technical Account Manager', 'Manage specific projects and phases', '{"projects": ["read", "write", "update"], "sites": ["read", "write", "update"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read", "write"], "reports": ["read", "write"]}', true),
('Technical Seller', 'Pre-sales technical activities', '{"projects": ["read", "write"], "sites": ["read"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "reports": ["read"]}', true),
('Sales', 'Sales activities with basic scoping', '{"projects": ["read"], "sites": ["read"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "reports": ["read"]}', true),
('Lead Engineer', 'Technical leadership for implementation', '{"projects": ["read", "write", "update"], "sites": ["read", "write", "update"], "vendors": ["read", "write"], "use_cases": ["read", "write"], "requirements": ["read", "write"], "test_cases": ["read", "write", "update"], "reports": ["read"]}', true),
('Engineer', 'Hands-on technical implementation', '{"projects": ["read"], "sites": ["read", "write"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read", "write"], "reports": ["read"]}', true),
('Viewer', 'Read-only access to assigned resources', '{"projects": ["read"], "sites": ["read"], "vendors": ["read"], "use_cases": ["read"], "requirements": ["read"], "test_cases": ["read"], "reports": ["read"]}', true);

-- Add custom_role_id to user_roles table
ALTER TABLE public.user_roles ADD COLUMN custom_role_id UUID REFERENCES public.custom_roles(id);

-- Function to check custom permissions
CREATE OR REPLACE FUNCTION public.has_permission(
  user_id UUID,
  resource resource_type,
  permission permission_type,
  scope_type TEXT DEFAULT 'global',
  scope_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
  resource_permissions TEXT[];
BEGIN
  -- Check if user is super admin (has all permissions)
  IF has_role(user_id, 'super_admin'::app_role) THEN
    RETURN true;
  END IF;
  
  -- Get user's custom role permissions
  SELECT cr.permissions->resource::text
  INTO user_permissions
  FROM user_roles ur
  JOIN custom_roles cr ON ur.custom_role_id = cr.id
  WHERE ur.user_id = user_id
    AND ur.scope_type = has_permission.scope_type
    AND (has_permission.scope_id IS NULL OR ur.scope_id = has_permission.scope_id)
  LIMIT 1;
  
  -- If no custom role found, check legacy app_role permissions
  IF user_permissions IS NULL THEN
    -- Legacy role checking logic can be added here
    RETURN false;
  END IF;
  
  -- Check if user has the specific permission
  SELECT array(SELECT jsonb_array_elements_text(user_permissions))
  INTO resource_permissions;
  
  RETURN permission::text = ANY(resource_permissions) OR 'admin' = ANY(resource_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update timestamp trigger
CREATE TRIGGER update_custom_roles_updated_at
  BEFORE UPDATE ON public.custom_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();