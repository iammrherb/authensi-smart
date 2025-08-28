-- Assign super admin role to specific user by email
DO $$
DECLARE
    super_admin_role_id uuid;
    target_user_id uuid;
BEGIN
    -- Get user ID for the specific email
    SELECT id INTO target_user_id 
    FROM profiles 
    WHERE email = 'iammrherb@aliensfault.com' 
    LIMIT 1;
    
    -- Get or create super admin role
    SELECT id INTO super_admin_role_id 
    FROM custom_roles 
    WHERE name = 'Super Administrator' OR name = 'super_admin'
    LIMIT 1;
    
    -- If no super admin role exists, create it
    IF super_admin_role_id IS NULL THEN
        INSERT INTO custom_roles (name, description, permissions, is_system_role)
        VALUES (
            'Super Administrator',
            'Full system administrator with all permissions',
            '{
                "users": ["read", "create", "update", "delete", "admin"],
                "projects": ["read", "create", "update", "delete", "admin"],
                "sites": ["read", "create", "update", "delete", "admin"],
                "templates": ["read", "create", "update", "delete", "admin"],
                "vendors": ["read", "create", "update", "delete", "admin"],
                "analytics": ["read", "admin"],
                "system": ["read", "admin"]
            }'::jsonb,
            true
        )
        RETURNING id INTO super_admin_role_id;
    END IF;
    
    -- Assign super admin role to user
    IF target_user_id IS NOT NULL AND super_admin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at, is_active)
        VALUES (target_user_id, super_admin_role_id, target_user_id, now(), true)
        ON CONFLICT (user_id, role_id) DO UPDATE SET 
            is_active = true,
            assigned_at = now();
    END IF;
        
END $$;