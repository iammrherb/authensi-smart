-- Comprehensive RBAC System Migration
-- This migration creates a complete Role-Based Access Control system

-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT roles_name_check CHECK (name ~ '^[a-zA-Z][a-zA-Z0-9_-]*$')
);

-- =============================================
-- PERMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    is_system_permission BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT permissions_name_check CHECK (name ~ '^[a-zA-Z][a-zA-Z0-9_]*$'),
    CONSTRAINT permissions_resource_action_unique UNIQUE (resource, action)
);

-- =============================================
-- ROLE PERMISSIONS MAPPING
-- =============================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT role_permissions_unique UNIQUE (role_id, permission_id)
);

-- =============================================
-- USER ROLES MAPPING
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    CONSTRAINT user_roles_unique UNIQUE (user_id, role_id),
    CONSTRAINT user_roles_expires_at_check CHECK (expires_at IS NULL OR expires_at > assigned_at)
);

-- =============================================
-- ROLE HIERARCHY (FOR INHERITANCE)
-- =============================================
CREATE TABLE IF NOT EXISTS public.role_hierarchy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    child_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT role_hierarchy_unique UNIQUE (parent_role_id, child_role_id),
    CONSTRAINT role_hierarchy_no_self_ref CHECK (parent_role_id != child_role_id)
);

-- =============================================
-- USER PERMISSIONS CACHE (FOR PERFORMANCE)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_permissions_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
    CONSTRAINT user_permissions_cache_unique UNIQUE (user_id, permission_id),
    CONSTRAINT user_permissions_cache_expires_at_check CHECK (expires_at > cached_at)
);

-- =============================================
-- ROLE ASSIGNMENT AUDIT LOG
-- =============================================
CREATE TABLE IF NOT EXISTS public.role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('assigned', 'revoked', 'modified')),
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- =============================================
-- CREATE INDEXES
-- =============================================

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_is_system_role ON public.roles(is_system_role);
CREATE INDEX IF NOT EXISTS idx_roles_created_at ON public.roles(created_at);

-- Permissions indexes
CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON public.permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_permissions_is_system_permission ON public.permissions(is_system_permission);

-- Role permissions indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires_at ON public.user_roles(expires_at);

-- Role hierarchy indexes
CREATE INDEX IF NOT EXISTS idx_role_hierarchy_parent ON public.role_hierarchy(parent_role_id);
CREATE INDEX IF NOT EXISTS idx_role_hierarchy_child ON public.role_hierarchy(child_role_id);

-- User permissions cache indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_user_id ON public.user_permissions_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_permission_id ON public.user_permissions_cache(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_expires_at ON public.user_permissions_cache(expires_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_role_audit_log_user_id ON public.role_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_role_id ON public.role_audit_log(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_performed_at ON public.role_audit_log(performed_at);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_action ON public.role_audit_log(action);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE RLS POLICIES
-- =============================================

-- Roles policies
CREATE POLICY "System roles are readable by all authenticated users" ON public.roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only super admins can manage roles" ON public.roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name = 'super_admin'
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

-- Permissions policies
CREATE POLICY "Permissions are readable by authenticated users" ON public.permissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only super admins can manage permissions" ON public.permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name = 'super_admin'
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

-- Role permissions policies
CREATE POLICY "Role permissions are readable by authenticated users" ON public.role_permissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only super admins can manage role permissions" ON public.role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name = 'super_admin'
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

CREATE POLICY "Only admins can manage user roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

-- Role hierarchy policies
CREATE POLICY "Role hierarchy is readable by authenticated users" ON public.role_hierarchy
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only super admins can manage role hierarchy" ON public.role_hierarchy
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name = 'super_admin'
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

-- User permissions cache policies
CREATE POLICY "Users can view their own permission cache" ON public.user_permissions_cache
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage permission cache" ON public.user_permissions_cache
    FOR ALL USING (auth.role() = 'service_role');

-- Audit log policies
CREATE POLICY "Audit log is readable by admins" ON public.role_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid() 
            AND r.name IN ('super_admin', 'admin')
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        )
    );

CREATE POLICY "System can insert audit logs" ON public.role_audit_log
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- =============================================
-- CREATE FUNCTIONS
-- =============================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.check_user_permission(
    p_user_id UUID,
    p_resource VARCHAR,
    p_action VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_permission BOOLEAN := false;
    cache_exists BOOLEAN;
BEGIN
    -- Check cache first
    SELECT EXISTS(
        SELECT 1 FROM public.user_permissions_cache
        WHERE user_id = p_user_id
        AND permission_id IN (
            SELECT id FROM public.permissions 
            WHERE resource = p_resource AND action = p_action
        )
        AND expires_at > NOW()
    ) INTO cache_exists;
    
    IF cache_exists THEN
        SELECT true INTO has_permission;
    ELSE
        -- Check actual permissions
        SELECT EXISTS(
            SELECT 1 FROM public.user_roles ur
            JOIN public.role_permissions rp ON rp.role_id = ur.role_id
            JOIN public.permissions p ON p.id = rp.permission_id
            WHERE ur.user_id = p_user_id
            AND p.resource = p_resource
            AND p.action = p_action
            AND ur.is_active = true
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        ) INTO has_permission;
        
        -- Cache the result
        IF has_permission THEN
            INSERT INTO public.user_permissions_cache (user_id, permission_id)
            SELECT p_user_id, id FROM public.permissions 
            WHERE resource = p_resource AND action = p_action
            ON CONFLICT (user_id, permission_id) DO UPDATE SET
                cached_at = NOW(),
                expires_at = NOW() + INTERVAL '1 hour';
        END IF;
    END IF;
    
    RETURN has_permission;
END;
$$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE(
    permission_id UUID,
    permission_name VARCHAR,
    resource VARCHAR,
    action VARCHAR,
    description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id,
        p.name,
        p.resource,
        p.action,
        p.description
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = p_user_id
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
END;
$$;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION public.assign_role_to_user(
    p_user_id UUID,
    p_role_id UUID,
    p_assigned_by UUID DEFAULT NULL,
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    assignment_id UUID;
BEGIN
    -- Check if assigner has permission
    IF NOT public.check_user_permission(auth.uid(), 'user_roles', 'assign') THEN
        RAISE EXCEPTION 'Insufficient permissions to assign roles';
    END IF;
    
    -- Insert the role assignment
    INSERT INTO public.user_roles (user_id, role_id, assigned_by, expires_at, notes)
    VALUES (p_user_id, p_role_id, p_assigned_by, p_expires_at, p_notes)
    RETURNING id INTO assignment_id;
    
    -- Log the action
    INSERT INTO public.role_audit_log (user_id, role_id, action, new_values, performed_by)
    VALUES (
        p_user_id, 
        p_role_id, 
        'assigned',
        jsonb_build_object(
            'assigned_by', p_assigned_by,
            'expires_at', p_expires_at,
            'notes', p_notes
        ),
        auth.uid()
    );
    
    -- Clear user permissions cache
    DELETE FROM public.user_permissions_cache WHERE user_id = p_user_id;
    
    RETURN assignment_id;
END;
$$;

-- Function to revoke role from user
CREATE OR REPLACE FUNCTION public.revoke_role_from_user(
    p_user_id UUID,
    p_role_id UUID,
    p_revoked_by UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    was_active BOOLEAN;
BEGIN
    -- Check if revoker has permission
    IF NOT public.check_user_permission(auth.uid(), 'user_roles', 'revoke') THEN
        RAISE EXCEPTION 'Insufficient permissions to revoke roles';
    END IF;
    
    -- Get current status
    SELECT is_active INTO was_active
    FROM public.user_roles
    WHERE user_id = p_user_id AND role_id = p_role_id;
    
    -- Update to inactive
    UPDATE public.user_roles
    SET is_active = false
    WHERE user_id = p_user_id AND role_id = p_role_id;
    
    -- Log the action
    INSERT INTO public.role_audit_log (user_id, role_id, action, old_values, performed_by)
    VALUES (
        p_user_id, 
        p_role_id, 
        'revoked',
        jsonb_build_object('was_active', was_active),
        auth.uid()
    );
    
    -- Clear user permissions cache
    DELETE FROM public.user_permissions_cache WHERE user_id = p_user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION public.clean_expired_permission_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.user_permissions_cache
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =============================================
-- CREATE TRIGGERS
-- =============================================

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON public.permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED SYSTEM ROLES AND PERMISSIONS
-- =============================================

-- Insert system roles
INSERT INTO public.roles (name, description, is_system_role) VALUES
    ('super_admin', 'Full system access and control', true),
    ('admin', 'Administrative access to most system functions', true),
    ('manager', 'Team and project management capabilities', true),
    ('engineer', 'Technical implementation and configuration access', true),
    ('analyst', 'Read access to most data and reporting capabilities', true),
    ('viewer', 'Limited read-only access to assigned resources', true)
ON CONFLICT (name) DO NOTHING;

-- Insert system permissions
INSERT INTO public.permissions (name, description, resource, action, is_system_permission) VALUES
    -- User management
    ('user.create', 'Create new users', 'users', 'create', true),
    ('user.read', 'Read user information', 'users', 'read', true),
    ('user.update', 'Update user information', 'users', 'update', true),
    ('user.delete', 'Delete users', 'users', 'delete', true),
    
    -- Role management
    ('roles.create', 'Create new roles', 'roles', 'create', true),
    ('roles.read', 'Read role information', 'roles', 'read', true),
    ('roles.update', 'Update roles', 'roles', 'update', true),
    ('roles.delete', 'Delete roles', 'roles', 'delete', true),
    
    -- User roles
    ('user_roles.assign', 'Assign roles to users', 'user_roles', 'assign', true),
    ('user_roles.revoke', 'Revoke roles from users', 'user_roles', 'revoke', true),
    ('user_roles.read', 'Read user role assignments', 'user_roles', 'read', true),
    
    -- Projects
    ('projects.create', 'Create new projects', 'projects', 'create', true),
    ('projects.read', 'Read project information', 'projects', 'read', true),
    ('projects.update', 'Update projects', 'projects', 'update', true),
    ('projects.delete', 'Delete projects', 'projects', 'delete', true),
    
    -- Reports
    ('reports.create', 'Create reports', 'reports', 'create', true),
    ('reports.read', 'Read reports', 'reports', 'read', true),
    ('reports.update', 'Update reports', 'reports', 'update', true),
    ('reports.delete', 'Delete reports', 'reports', 'delete', true),
    
    -- Resource library
    ('resources.create', 'Create resource library items', 'resources', 'create', true),
    ('resources.read', 'Read resource library', 'resources', 'read', true),
    ('resources.update', 'Update resource library', 'resources', 'update', true),
    ('resources.delete', 'Delete resource library items', 'resources', 'delete', true),
    
    -- System administration
    ('system.configure', 'Configure system settings', 'system', 'configure', true),
    ('system.monitor', 'Monitor system health', 'system', 'monitor', true),
    ('system.maintain', 'Perform system maintenance', 'system', 'maintain', true)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- Super Admin gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Admin gets most permissions except system maintenance
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin' AND p.name != 'system.maintain'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Manager gets project and team management permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'manager' 
AND p.resource IN ('projects', 'reports', 'users')
AND p.action != 'delete'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Engineer gets technical permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'engineer' 
AND p.resource IN ('projects', 'reports', 'resources')
AND p.action IN ('create', 'read', 'update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Analyst gets read permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'analyst' 
AND p.action = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Viewer gets limited read permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'viewer' 
AND p.resource IN ('projects', 'reports')
AND p.action = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =============================================
-- CREATE SCHEDULED TASK FOR CACHE CLEANUP
-- =============================================

-- This would typically be handled by a cron job or scheduled function
-- For now, we'll create a function that can be called manually or via a scheduled task
SELECT cron.schedule(
    'clean-expired-permission-cache',
    '0 */6 * * *', -- Every 6 hours
    'SELECT public.clean_expired_permission_cache();'
);

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

COMMENT ON TABLE public.roles IS 'System roles for RBAC';
COMMENT ON TABLE public.permissions IS 'System permissions for RBAC';
COMMENT ON TABLE public.role_permissions IS 'Mapping between roles and permissions';
COMMENT ON TABLE public.user_roles IS 'Mapping between users and roles';
COMMENT ON TABLE public.role_hierarchy IS 'Role inheritance hierarchy';
COMMENT ON TABLE public.user_permissions_cache IS 'Performance cache for user permissions';
COMMENT ON TABLE public.role_audit_log IS 'Audit trail for role assignments';

COMMENT ON FUNCTION public.check_user_permission IS 'Check if a user has a specific permission';
COMMENT ON FUNCTION public.get_user_permissions IS 'Get all permissions for a user';
COMMENT ON FUNCTION public.assign_role_to_user IS 'Assign a role to a user with audit logging';
COMMENT ON FUNCTION public.revoke_role_from_user IS 'Revoke a role from a user with audit logging';
COMMENT ON FUNCTION public.clean_expired_permission_cache IS 'Clean up expired permission cache entries';
