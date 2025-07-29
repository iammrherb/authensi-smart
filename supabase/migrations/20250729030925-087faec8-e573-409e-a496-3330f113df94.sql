-- Ensure the user gets super admin privileges
-- First, create the super admin role for the current user if no super admin exists
DO $$
DECLARE
    current_user_id UUID;
    super_admin_count INTEGER;
BEGIN
    -- Get the current user's ID based on email
    SELECT auth.users.id INTO current_user_id 
    FROM auth.users 
    WHERE auth.users.email = 'iammrherb@aliensfault.com'
    LIMIT 1;
    
    -- Check if any super admin exists
    SELECT COUNT(*) INTO super_admin_count
    FROM user_roles 
    WHERE role = 'super_admin' AND scope_type = 'global';
    
    -- If no super admin exists and we found the user, make them super admin
    IF super_admin_count = 0 AND current_user_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
        VALUES (current_user_id, 'super_admin', 'global', current_user_id, now());
        
        RAISE NOTICE 'Created super admin role for user: %', current_user_id;
    ELSIF current_user_id IS NOT NULL THEN
        -- If super admin exists but current user doesn't have it, give it to them anyway
        INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
        VALUES (current_user_id, 'super_admin', 'global', current_user_id, now())
        ON CONFLICT (user_id, role, scope_type) DO NOTHING;
        
        RAISE NOTICE 'Ensured super admin role for user: %', current_user_id;
    ELSE
        RAISE NOTICE 'User with email iammrherb@aliensfault.com not found in auth.users';
    END IF;
END $$;

-- Create a function to bootstrap first super admin for any new user if none exists
CREATE OR REPLACE FUNCTION public.ensure_first_super_admin()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_count INTEGER;
BEGIN
    -- Check if any super admin exists
    SELECT COUNT(*) INTO super_admin_count
    FROM user_roles 
    WHERE role = 'super_admin' AND scope_type = 'global';
    
    -- If no super admin exists, make the new user a super admin
    IF super_admin_count = 0 THEN
        INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
        VALUES (NEW.id, 'super_admin', 'global', NEW.id, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign first super admin
DROP TRIGGER IF EXISTS auto_assign_first_super_admin ON auth.users;
CREATE TRIGGER auto_assign_first_super_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_first_super_admin();