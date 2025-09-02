-- Direct SuperAdmin grant for iammrherb@aliensfault.com
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists and get their ID
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'iammrherb@aliensfault.com';

-- Step 2: Ensure super_admin role exists
INSERT INTO public.roles (name, description, is_system_role, priority)
VALUES ('super_admin', 'Super Administrator with full system access', true, 100)
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description,
    priority = EXCLUDED.priority;

-- Step 3: Ensure all admin permissions exist
INSERT INTO public.permissions (name, description)
VALUES 
    ('system.admin', 'Full system administration'),
    ('user.create', 'Create users'),
    ('user.read', 'Read users'),
    ('user.update', 'Update users'),
    ('user.delete', 'Delete users'),
    ('role.create', 'Create roles'),
    ('role.read', 'Read roles'),
    ('role.update', 'Update roles'),
    ('role.delete', 'Delete roles'),
    ('project.create', 'Create projects'),
    ('project.read', 'Read projects'),
    ('project.update', 'Update projects'),
    ('project.delete', 'Delete projects'),
    ('resource.create', 'Create resources'),
    ('resource.read', 'Read resources'),
    ('resource.update', 'Update resources'),
    ('resource.delete', 'Delete resources'),
    ('report.create', 'Create reports'),
    ('report.read', 'Read reports'),
    ('report.update', 'Update reports'),
    ('report.delete', 'Delete reports'),
    ('portal.admin', 'Administer customer portals')
ON CONFLICT (name) DO NOTHING;

-- Step 4: Grant all permissions to super_admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'super_admin'),
    p.id
FROM public.permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Step 5: Remove existing role assignments and assign super_admin
-- First, delete existing assignments
DELETE FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'iammrherb@aliensfault.com');

-- Then assign super_admin role
INSERT INTO public.user_roles (user_id, role_id, assigned_by)
SELECT 
    u.id,
    r.id,
    u.id -- Self-assigned
FROM auth.users u
CROSS JOIN public.roles r
WHERE u.email = 'iammrherb@aliensfault.com'
AND r.name = 'super_admin';

-- Step 6: Verify the assignment
SELECT 
    u.email,
    r.name as role,
    r.priority,
    ur.assigned_at,
    COUNT(DISTINCT rp.permission_id) as permission_count
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
WHERE u.email = 'iammrherb@aliensfault.com'
GROUP BY u.email, r.name, r.priority, ur.assigned_at;

-- Step 7: Show granted permissions
SELECT 
    'Granted Permissions:' as status,
    STRING_AGG(p.name, ', ' ORDER BY p.name) as permissions
FROM public.user_roles ur
JOIN public.roles r ON ur.role_id = r.id
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
WHERE ur.user_id = (SELECT id FROM auth.users WHERE email = 'iammrherb@aliensfault.com')
GROUP BY ur.user_id;
