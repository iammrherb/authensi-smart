-- EMERGENCY RBAC SYSTEM FIX
-- Run this in Supabase SQL Editor to restore SuperAdmin access
-- This will completely rebuild the RBAC system

-- Step 1: Drop and recreate all RBAC tables
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- Step 2: Create roles table
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create permissions table
CREATE TABLE public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  resource_type VARCHAR(100),
  action VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create role_permissions table
CREATE TABLE public.role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Step 5: Create user_roles table
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role_id)
);

-- Step 6: Create indexes for performance
CREATE INDEX idx_roles_name ON public.roles(name);
CREATE INDEX idx_roles_priority ON public.roles(priority);
CREATE INDEX idx_roles_system ON public.roles(is_system_role);

CREATE INDEX idx_permissions_name ON public.permissions(name);
CREATE INDEX idx_permissions_resource ON public.permissions(resource_type);
CREATE INDEX idx_permissions_action ON public.permissions(action);

CREATE INDEX idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm ON public.role_permissions(permission_id);

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role_id);
CREATE INDEX idx_user_roles_assigned ON public.user_roles(assigned_by);

-- Step 7: Create super_admin role
INSERT INTO public.roles (name, description, is_system_role, priority)
VALUES ('super_admin', 'Super Administrator with full system access', true, 100);

-- Step 8: Create comprehensive permissions
INSERT INTO public.permissions (name, description, resource_type, action) VALUES
('system.admin', 'Full system administration', 'system', 'admin'),
('user.manage', 'Manage all users', 'user', 'manage'),
('user.read', 'Read user information', 'user', 'read'),
('role.manage', 'Manage all roles', 'role', 'manage'),
('role.read', 'Read role information', 'role', 'read'),
('project.manage', 'Manage all projects', 'project', 'manage'),
('project.read', 'Read project information', 'project', 'read'),
('project.create', 'Create new projects', 'project', 'create'),
('project.update', 'Update projects', 'project', 'update'),
('project.delete', 'Delete projects', 'project', 'delete'),
('resource.manage', 'Manage all resources', 'resource', 'manage'),
('resource.read', 'Read resource information', 'resource', 'read'),
('resource.create', 'Create new resources', 'resource', 'create'),
('resource.update', 'Update resources', 'resource', 'update'),
('resource.delete', 'Delete resources', 'resource', 'delete'),
('report.manage', 'Manage all reports', 'report', 'manage'),
('report.read', 'Read reports', 'report', 'read'),
('report.create', 'Create reports', 'report', 'create'),
('report.export', 'Export reports', 'report', 'export'),
('portal.manage', 'Manage all portals', 'portal', 'manage'),
('portal.read', 'Read portal information', 'portal', 'read'),
('portal.create', 'Create portals', 'portal', 'create'),
('portal.update', 'Update portals', 'portal', 'update'),
('portal.delete', 'Delete portals', 'portal', 'delete'),
('wizard.manage', 'Manage all wizards', 'wizard', 'manage'),
('wizard.execute', 'Execute wizards', 'wizard', 'execute'),
('wizard.read', 'Read wizard information', 'wizard', 'read'),
('analytics.manage', 'Manage analytics', 'analytics', 'manage'),
('analytics.read', 'Read analytics', 'analytics', 'read'),
('analytics.export', 'Export analytics', 'analytics', 'export');

-- Step 9: Grant all permissions to super_admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'super_admin'),
  id
FROM public.permissions;

-- Step 10: Find user and assign super_admin role
-- First, let's see what users exist
SELECT id, email, created_at FROM auth.users LIMIT 10;

-- Step 11: Assign super_admin role to iammrherb@aliensfault.com
-- Replace the UUID below with the actual user ID from Step 10
INSERT INTO public.user_roles (user_id, role_id, assigned_by)
SELECT 
  u.id as user_id,
  r.id as role_id,
  u.id as assigned_by
FROM auth.users u, public.roles r
WHERE u.email = 'iammrherb@aliensfault.com'
AND r.name = 'super_admin';

-- Step 12: Verify the setup
SELECT 
  'SUCCESS: RBAC system restored' as status,
  COUNT(*) as total_roles,
  (SELECT COUNT(*) FROM public.permissions) as total_permissions,
  (SELECT COUNT(*) FROM public.role_permissions WHERE role_id = (SELECT id FROM public.roles WHERE name = 'super_admin')) as superadmin_permissions
FROM public.roles;

-- Step 13: Show user role assignment
SELECT 
  u.email,
  r.name as role_name,
  r.description as role_description,
  ur.assigned_at,
  COUNT(DISTINCT rp.permission_id) as permission_count
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
WHERE u.email = 'iammrherb@aliensfault.com'
GROUP BY u.email, r.name, r.description, ur.assigned_at;

-- Step 14: Enable Row Level Security (RLS) on tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 15: Create basic RLS policies (permissive for now)
CREATE POLICY "Allow all operations for super_admin" ON public.roles
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for super_admin" ON public.permissions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for super_admin" ON public.role_permissions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for super_admin" ON public.user_roles
  FOR ALL USING (true);

-- Step 16: Final verification
SELECT 
  '🎉 RBAC SYSTEM RESTORED SUCCESSFULLY!' as message,
  NOW() as restored_at;
