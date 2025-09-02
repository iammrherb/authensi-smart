-- Grant SuperAdmin role to iammrherb@aliensfault.com
-- This script will update the user's role in the RBAC system

-- First, check if the user exists and their current role
DO $$
DECLARE
    v_user_id UUID;
    v_super_admin_role_id UUID;
    v_current_role VARCHAR;
BEGIN
    -- Get the user ID
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'iammrherb@aliensfault.com';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User iammrherb@aliensfault.com not found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user with ID: %', v_user_id;
    
    -- Check current role assignment
    SELECT r.name INTO v_current_role
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = v_user_id;
    
    IF v_current_role IS NOT NULL THEN
        RAISE NOTICE 'Current role: %', v_current_role;
    ELSE
        RAISE NOTICE 'No role currently assigned';
    END IF;
    
    -- Get the super_admin role ID
    SELECT id INTO v_super_admin_role_id
    FROM public.roles
    WHERE name = 'super_admin';
    
    IF v_super_admin_role_id IS NULL THEN
        RAISE NOTICE 'Creating super_admin role...';
        INSERT INTO public.roles (name, description, is_system_role, priority)
        VALUES ('super_admin', 'Super Administrator with full system access', true, 100)
        RETURNING id INTO v_super_admin_role_id;
    END IF;
    
    -- Remove any existing role assignments for this user
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    RAISE NOTICE 'Removed existing role assignments';
    
    -- Assign super_admin role
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (v_user_id, v_super_admin_role_id, v_user_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RAISE NOTICE 'Successfully assigned super_admin role to iammrherb@aliensfault.com';
    
    -- Verify the assignment
    SELECT r.name INTO v_current_role
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = v_user_id;
    
    RAISE NOTICE 'Verified role assignment: %', v_current_role;
    
    -- Also ensure all super_admin permissions are properly set
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_super_admin_role_id, p.id
    FROM public.permissions p
    WHERE p.name IN (
        'system.admin',
        'user.create',
        'user.read',
        'user.update',
        'user.delete',
        'role.create',
        'role.read',
        'role.update',
        'role.delete',
        'project.create',
        'project.read',
        'project.update',
        'project.delete',
        'resource.create',
        'resource.read',
        'resource.update',
        'resource.delete',
        'report.create',
        'report.read',
        'report.update',
        'report.delete',
        'portal.admin'
    )
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    RAISE NOTICE 'Ensured all super_admin permissions are assigned';
    
END $$;

-- Additional verification query
SELECT 
    u.email,
    u.id as user_id,
    r.name as role_name,
    r.description as role_description,
    ur.assigned_at,
    COUNT(rp.permission_id) as permission_count
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
WHERE u.email = 'iammrherb@aliensfault.com'
GROUP BY u.email, u.id, r.name, r.description, ur.assigned_at;

-- Show all permissions for the super_admin role
SELECT 
    p.name as permission_name,
    p.description
FROM public.roles r
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
WHERE r.name = 'super_admin'
ORDER BY p.name;







