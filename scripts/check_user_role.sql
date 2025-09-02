-- Check current role and permissions for iammrherb@aliensfault.com

-- 1. Check if user exists
SELECT 
    'User Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'iammrherb@aliensfault.com')
        THEN 'User exists in auth.users'
        ELSE 'User NOT found in auth.users'
    END as status;

-- 2. Get user details and current role
SELECT 
    u.id,
    u.email,
    u.created_at,
    r.name as current_role,
    r.priority as role_priority,
    ur.assigned_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'iammrherb@aliensfault.com';

-- 3. Check available roles in the system
SELECT 
    'Available Roles' as category,
    name,
    description,
    priority,
    is_system_role
FROM public.roles
ORDER BY priority DESC;

-- 4. Check if super_admin role exists
SELECT 
    'Super Admin Role Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.roles WHERE name = 'super_admin')
        THEN 'super_admin role EXISTS'
        ELSE 'super_admin role MISSING - needs to be created'
    END as status;

-- 5. Count permissions for current user
SELECT 
    'User Permissions Count' as metric,
    COUNT(DISTINCT p.id) as permission_count
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
LEFT JOIN public.permissions p ON rp.permission_id = p.id
WHERE u.email = 'iammrherb@aliensfault.com';

-- 6. List current permissions (if any)
SELECT 
    p.name as permission,
    p.description
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
WHERE u.email = 'iammrherb@aliensfault.com'
ORDER BY p.name;
