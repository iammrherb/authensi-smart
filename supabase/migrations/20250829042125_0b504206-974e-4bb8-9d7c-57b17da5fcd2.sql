-- Fix user role assignment for super admin access
-- Remove the role_id based assignment and add proper app_role assignment
DELETE FROM user_roles WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'iammrherb@aliensfault.com'
);

-- Assign super_admin role using the app_role enum that the application expects
INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
SELECT 
    id,
    'super_admin'::app_role,
    'global',
    id,
    now()
FROM profiles 
WHERE email = 'iammrherb@aliensfault.com';