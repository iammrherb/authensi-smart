-- Simple SuperAdmin Grant for iammrherb@aliensfault.com
-- Run this in Supabase SQL Editor

-- Step 1: Create super_admin role if it doesn't exist
INSERT INTO public.roles (name, description, is_system_role, priority)
VALUES ('super_admin', 'Super Administrator with full system access', true, 100)
ON CONFLICT (name) DO NOTHING;

-- Step 2: Create basic permissions if they don't exist
INSERT INTO public.permissions (name, description)
VALUES 
    ('system.admin', 'Full system administration'),
    ('user.manage', 'Manage all users'),
    ('role.manage', 'Manage all roles'),
    ('project.manage', 'Manage all projects'),
    ('resource.manage', 'Manage all resources'),
    ('report.manage', 'Manage all reports'),
    ('portal.manage', 'Manage all portals')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Grant all existing permissions to super_admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'super_admin'),
    p.id
FROM public.permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Step 4: Assign super_admin role to user
-- First remove any existing roles
DELETE FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'iammrherb@aliensfault.com');

-- Then assign super_admin
INSERT INTO public.user_roles (user_id, role_id, assigned_by)
SELECT 
    u.id as user_id,
    r.id as role_id,
    u.id as assigned_by
FROM auth.users u, public.roles r
WHERE u.email = 'iammrherb@aliensfault.com'
AND r.name = 'super_admin';

-- Step 5: Verify the assignment worked
SELECT 
    'SUCCESS: User ' || u.email || ' now has role: ' || r.name || 
    ' with ' || COUNT(DISTINCT rp.permission_id)::text || ' permissions' as result
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
WHERE u.email = 'iammrherb@aliensfault.com'
GROUP BY u.email, r.name;


