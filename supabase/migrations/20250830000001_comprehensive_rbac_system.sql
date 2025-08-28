-- =============================================
-- COMPREHENSIVE ENTERPRISE RBAC SYSTEM
-- =============================================
-- This migration creates a complete Role-Based Access Control system
-- with granular permissions, local user management, and social provider linking

-- =============================================
-- CORE RBAC TABLES
-- =============================================

-- ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    is_customer_portal_role BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT roles_name_check CHECK (name ~ '^[a-zA-Z][a-zA-Z0-9_-]*$'),
    CONSTRAINT roles_priority_check CHECK (priority >= 0)
);

-- PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    scope VARCHAR(50) DEFAULT 'global', -- global, project, site, device, vendor, model
    is_system_permission BOOLEAN DEFAULT false,
    is_customer_portal_permission BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT permissions_name_check CHECK (name ~ '^[a-zA-Z][a-zA-Z0-9_.]*$'),
    CONSTRAINT permissions_resource_action_unique UNIQUE (resource, action, scope),
    CONSTRAINT permissions_scope_check CHECK (scope IN ('global', 'project', 'site', 'device', 'vendor', 'model'))
);

-- ROLE PERMISSIONS MAPPING
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    conditions JSONB, -- Additional conditions for permission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT role_permissions_unique UNIQUE (role_id, permission_id)
);

-- USER ROLES MAPPING
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    scope_data JSONB, -- Project, site, or device-specific scope
    CONSTRAINT user_roles_unique UNIQUE (user_id, role_id),
    CONSTRAINT user_roles_expires_at_check CHECK (expires_at IS NULL OR expires_at > assigned_at)
);

-- ROLE HIERARCHY (FOR INHERITANCE)
CREATE TABLE IF NOT EXISTS public.role_hierarchy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    child_role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    inheritance_type VARCHAR(20) DEFAULT 'full', -- full, partial, conditional
    conditions JSONB, -- Conditions for inheritance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT role_hierarchy_unique UNIQUE (parent_role_id, child_role_id),
    CONSTRAINT role_hierarchy_no_self_ref CHECK (parent_role_id != child_role_id),
    CONSTRAINT role_hierarchy_inheritance_check CHECK (inheritance_type IN ('full', 'partial', 'conditional'))
);

-- =============================================
-- USER MANAGEMENT TABLES
-- =============================================

-- LOCAL USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    avatar_url TEXT,
    phone VARCHAR(20),
    company VARCHAR(100),
    job_title VARCHAR(100),
    department VARCHAR(100),
    location VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT user_profiles_username_check CHECK (username ~ '^[a-zA-Z][a-zA-Z0-9_-]*$')
);

-- SOCIAL MEDIA PROVIDER LINKING
CREATE TABLE IF NOT EXISTS public.social_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- github, google, microsoft, linkedin, etc.
    provider_user_id VARCHAR(255) NOT NULL,
    provider_username VARCHAR(100),
    provider_email VARCHAR(255),
    provider_data JSONB, -- Full provider response data
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT social_providers_unique UNIQUE (user_id, provider),
    CONSTRAINT social_providers_provider_check CHECK (provider IN ('github', 'google', 'microsoft', 'linkedin', 'twitter', 'facebook', 'discord', 'slack'))
);

-- CUSTOMER PORTAL ACCESS
CREATE TABLE IF NOT EXISTS public.customer_portals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(200) NOT NULL,
    customer_code VARCHAR(50) UNIQUE,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address JSONB,
    industry VARCHAR(100),
    size VARCHAR(50), -- small, medium, large, enterprise
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT customer_portals_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'pending'))
);

-- CUSTOMER PORTAL USERS
CREATE TABLE IF NOT EXISTS public.customer_portal_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_portal_id UUID NOT NULL REFERENCES public.customer_portals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    access_level VARCHAR(20) DEFAULT 'standard', -- standard, premium, enterprise
    is_primary_contact BOOLEAN DEFAULT false,
    is_billing_contact BOOLEAN DEFAULT false,
    is_technical_contact BOOLEAN DEFAULT false,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    CONSTRAINT customer_portal_users_unique UNIQUE (customer_portal_id, user_id),
    CONSTRAINT customer_portal_users_access_level_check CHECK (access_level IN ('standard', 'premium', 'enterprise'))
);

-- =============================================
-- GRANULAR PERMISSION TABLES
-- =============================================

-- PROJECT-LEVEL PERMISSIONS
CREATE TABLE IF NOT EXISTS public.project_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL, -- References projects table
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    conditions JSONB, -- Additional conditions
    CONSTRAINT project_permissions_unique UNIQUE (user_id, project_id, permission_id)
);

-- SITE-LEVEL PERMISSIONS
CREATE TABLE IF NOT EXISTS public.site_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id UUID NOT NULL, -- References sites table
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    conditions JSONB,
    CONSTRAINT site_permissions_unique UNIQUE (user_id, site_id, permission_id)
);

-- DEVICE-LEVEL PERMISSIONS
CREATE TABLE IF NOT EXISTS public.device_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID NOT NULL, -- References devices table
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    conditions JSONB,
    CONSTRAINT device_permissions_unique UNIQUE (user_id, device_id, permission_id)
);

-- VENDOR-LEVEL PERMISSIONS
CREATE TABLE IF NOT EXISTS public.vendor_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL, -- References vendors table
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    conditions JSONB,
    CONSTRAINT vendor_permissions_unique UNIQUE (user_id, vendor_id, permission_id)
);

-- =============================================
-- PERFORMANCE AND CACHING TABLES
-- =============================================

-- USER PERMISSIONS CACHE
CREATE TABLE IF NOT EXISTS public.user_permissions_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    scope_type VARCHAR(20), -- global, project, site, device, vendor
    scope_id UUID, -- Specific scope ID
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
    CONSTRAINT user_permissions_cache_unique UNIQUE (user_id, permission_id, scope_type, scope_id),
    CONSTRAINT user_permissions_cache_expires_at_check CHECK (expires_at > cached_at)
);

-- ROLE ASSIGNMENT AUDIT LOG
CREATE TABLE IF NOT EXISTS public.role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- Extended to support all actions
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    metadata JSONB
);

-- PERMISSION USAGE LOG
CREATE TABLE IF NOT EXISTS public.permission_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    resource_type VARCHAR(50),
    resource_id UUID,
    action_performed VARCHAR(100),
    success BOOLEAN,
    error_message TEXT,
    execution_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Core RBAC indexes
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_priority ON public.roles(priority);
CREATE INDEX IF NOT EXISTS idx_roles_is_system_role ON public.roles(is_system_role);
CREATE INDEX IF NOT EXISTS idx_roles_is_customer_portal_role ON public.roles(is_customer_portal_role);

CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON public.permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_permissions_scope ON public.permissions(scope);
CREATE INDEX IF NOT EXISTS idx_permissions_is_system_permission ON public.permissions(is_system_permission);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON public.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires_at ON public.user_roles(expires_at);

-- User management indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_social_providers_user_id ON public.social_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_social_providers_provider ON public.social_providers(provider);
CREATE INDEX IF NOT EXISTS idx_social_providers_provider_user_id ON public.social_providers(provider_user_id);

-- Customer portal indexes
CREATE INDEX IF NOT EXISTS idx_customer_portals_customer_code ON public.customer_portals(customer_code);
CREATE INDEX IF NOT EXISTS idx_customer_portals_status ON public.customer_portals(status);

CREATE INDEX IF NOT EXISTS idx_customer_portal_users_customer_id ON public.customer_portal_users(customer_portal_id);
CREATE INDEX IF NOT EXISTS idx_customer_portal_users_user_id ON public.customer_portal_users(user_id);

-- Granular permission indexes
CREATE INDEX IF NOT EXISTS idx_project_permissions_user_project ON public.project_permissions(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_site_permissions_user_site ON public.site_permissions(user_id, site_id);
CREATE INDEX IF NOT EXISTS idx_device_permissions_user_device ON public.device_permissions(user_id, device_id);
CREATE INDEX IF NOT EXISTS idx_vendor_permissions_user_vendor ON public.vendor_permissions(user_id, vendor_id);

-- Cache and audit indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_user_id ON public.user_permissions_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_expires_at ON public.user_permissions_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_role_audit_log_user_id ON public.role_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_performed_at ON public.role_audit_log(performed_at);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_action ON public.role_audit_log(action);

CREATE INDEX IF NOT EXISTS idx_permission_usage_log_user_id ON public.permission_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_usage_log_timestamp ON public.permission_usage_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_permission_usage_log_success ON public.permission_usage_log(success);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_usage_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE SIMPLE RLS POLICIES FOR INITIAL SETUP
-- =============================================

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations for initial setup - roles" ON public.roles;
DROP POLICY IF EXISTS "Allow all operations for initial setup - permissions" ON public.permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow all operations for initial setup - role_hierarchy" ON public.role_hierarchy;
DROP POLICY IF EXISTS "Allow all operations for initial setup - user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all operations for initial setup - social_providers" ON public.social_providers;
DROP POLICY IF EXISTS "Allow all operations for initial setup - customer_portals" ON public.customer_portals;
DROP POLICY IF EXISTS "Allow all operations for initial setup - customer_portal_users" ON public.customer_portal_users;
DROP POLICY IF EXISTS "Allow all operations for initial setup - project_permissions" ON public.project_permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - site_permissions" ON public.site_permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - device_permissions" ON public.device_permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - vendor_permissions" ON public.vendor_permissions;
DROP POLICY IF EXISTS "Allow all operations for initial setup - audit_log" ON public.role_audit_log;
DROP POLICY IF EXISTS "Allow all operations for initial setup - permission_usage_log" ON public.permission_usage_log;

-- Create simple policies for initial setup
CREATE POLICY "Allow all operations for initial setup - roles" ON public.roles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - permissions" ON public.permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - role_permissions" ON public.role_permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - user_roles" ON public.user_roles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - role_hierarchy" ON public.role_hierarchy
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - user_profiles" ON public.user_profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - social_providers" ON public.social_providers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - customer_portals" ON public.customer_portals
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - customer_portal_users" ON public.customer_portal_users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - project_permissions" ON public.project_permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - site_permissions" ON public.site_permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - device_permissions" ON public.device_permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - vendor_permissions" ON public.vendor_permissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own permission cache" ON public.user_permissions_cache
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage permission cache" ON public.user_permissions_cache
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all operations for initial setup - audit_log" ON public.role_audit_log
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for initial setup - permission_usage_log" ON public.permission_usage_log
    FOR ALL USING (auth.role() = 'authenticated');

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

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_providers_updated_at BEFORE UPDATE ON public.social_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_portals_updated_at BEFORE UPDATE ON public.customer_portals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED SYSTEM ROLES AND PERMISSIONS
-- =============================================

-- Insert system roles
INSERT INTO public.roles (name, description, is_system_role, priority) VALUES
    ('super_admin', 'Full system access and control', true, 100),
    ('admin', 'Administrative access to most system functions', true, 90),
    ('manager', 'Team and project management capabilities', true, 80),
    ('engineer', 'Technical implementation and configuration access', true, 70),
    ('analyst', 'Read access to most data and reporting capabilities', true, 60),
    ('viewer', 'Limited read-only access to assigned resources', true, 50),
    ('customer_admin', 'Customer portal administration', true, 40),
    ('customer_user', 'Customer portal user access', true, 30),
    ('vendor_admin', 'Vendor-specific administration', true, 20),
    ('vendor_user', 'Vendor-specific user access', true, 10)
ON CONFLICT (name) DO NOTHING;

-- Insert system permissions
INSERT INTO public.permissions (name, description, resource, action, scope, is_system_permission) VALUES
    -- User management
    ('user.create', 'Create new users', 'users', 'create', 'global', true),
    ('user.read', 'Read user information', 'users', 'read', 'global', true),
    ('user.update', 'Update user information', 'users', 'update', 'global', true),
    ('user.delete', 'Delete users', 'users', 'delete', 'global', true),
    
    -- Role management
    ('roles.create', 'Create new roles', 'roles', 'create', 'global', true),
    ('roles.read', 'Read role information', 'roles', 'read', 'global', true),
    ('roles.update', 'Update roles', 'roles', 'update', 'global', true),
    ('roles.delete', 'Delete roles', 'roles', 'delete', 'global', true),
    
    -- User roles
    ('user_roles.assign', 'Assign roles to users', 'user_roles', 'assign', 'global', true),
    ('user_roles.revoke', 'Revoke roles from users', 'user_roles', 'revoke', 'global', true),
    ('user_roles.read', 'Read user role assignments', 'user_roles', 'read', 'global', true),
    
    -- Projects
    ('projects.create', 'Create new projects', 'projects', 'create', 'global', true),
    ('projects.read', 'Read project information', 'projects', 'read', 'global', true),
    ('projects.update', 'Update projects', 'projects', 'update', 'global', true),
    ('projects.delete', 'Delete projects', 'projects', 'delete', 'global', true),
    
    -- Project-specific permissions
    ('projects.read', 'Read project information', 'projects', 'read', 'project', true),
    ('projects.update', 'Update project', 'projects', 'update', 'project', true),
    ('projects.delete', 'Delete project', 'projects', 'delete', 'project', true),
    
    -- Sites
    ('sites.create', 'Create new sites', 'sites', 'create', 'global', true),
    ('sites.read', 'Read site information', 'sites', 'read', 'global', true),
    ('sites.update', 'Update sites', 'sites', 'update', 'global', true),
    ('sites.delete', 'Delete sites', 'sites', 'delete', 'global', true),
    
    -- Site-specific permissions
    ('sites.read', 'Read site information', 'sites', 'read', 'site', true),
    ('sites.update', 'Update site', 'sites', 'update', 'site', true),
    ('sites.delete', 'Delete site', 'sites', 'delete', 'site', true),
    
    -- Devices
    ('devices.create', 'Create new devices', 'devices', 'create', 'global', true),
    ('devices.read', 'Read device information', 'devices', 'read', 'global', true),
    ('devices.update', 'Update devices', 'devices', 'update', 'global', true),
    ('devices.delete', 'Delete devices', 'devices', 'delete', 'global', true),
    
    -- Device-specific permissions
    ('devices.read', 'Read device information', 'devices', 'read', 'device', true),
    ('devices.update', 'Update device', 'devices', 'update', 'device', true),
    ('devices.delete', 'Delete device', 'devices', 'delete', 'device', true),
    
    -- Vendors
    ('vendors.create', 'Create new vendors', 'vendors', 'create', 'global', true),
    ('vendors.read', 'Read vendor information', 'vendors', 'read', 'global', true),
    ('vendors.update', 'Update vendors', 'vendors', 'update', 'global', true),
    ('vendors.delete', 'Delete vendors', 'vendors', 'delete', 'global', true),
    
    -- Vendor-specific permissions
    ('vendors.read', 'Read vendor information', 'vendors', 'read', 'vendor', true),
    ('vendors.update', 'Update vendor', 'vendors', 'update', 'vendor', true),
    ('vendors.delete', 'Delete vendor', 'vendors', 'delete', 'vendor', true),
    
    -- Reports
    ('reports.create', 'Create reports', 'reports', 'create', 'global', true),
    ('reports.read', 'Read reports', 'reports', 'read', 'global', true),
    ('reports.update', 'Update reports', 'reports', 'update', 'global', true),
    ('reports.delete', 'Delete reports', 'reports', 'delete', 'global', true),
    
    -- Resource library
    ('resources.create', 'Create resource library items', 'resources', 'create', 'global', true),
    ('resources.read', 'Read resource library', 'resources', 'read', 'global', true),
    ('resources.update', 'Update resource library', 'resources', 'update', 'global', true),
    ('resources.delete', 'Delete resource library items', 'resources', 'delete', 'global', true),
    
    -- Customer portals
    ('customer_portals.create', 'Create customer portals', 'customer_portals', 'create', 'global', true),
    ('customer_portals.read', 'Read customer portals', 'customer_portals', 'read', 'global', true),
    ('customer_portals.update', 'Update customer portals', 'customer_portals', 'update', 'global', true),
    ('customer_portals.delete', 'Delete customer portals', 'customer_portals', 'delete', 'global', true),
    
    -- Customer portal users
    ('customer_portal_users.assign', 'Assign users to customer portals', 'customer_portal_users', 'assign', 'global', true),
    ('customer_portal_users.revoke', 'Revoke users from customer portals', 'customer_portal_users', 'revoke', 'global', true),
    ('customer_portal_users.read', 'Read customer portal user assignments', 'customer_portal_users', 'read', 'global', true),
    
    -- Social providers
    ('social_providers.link', 'Link social media accounts', 'social_providers', 'link', 'global', true),
    ('social_providers.unlink', 'Unlink social media accounts', 'social_providers', 'unlink', 'global', true),
    ('social_providers.read', 'Read social media account links', 'social_providers', 'read', 'global', true),
    
    -- System administration
    ('system.configure', 'Configure system settings', 'system', 'configure', 'global', true),
    ('system.monitor', 'Monitor system health', 'system', 'monitor', 'global', true),
    ('system.maintain', 'Perform system maintenance', 'system', 'maintain', 'global', true),
    
    -- Permission management
    ('permissions.grant', 'Grant granular permissions', 'permissions', 'grant', 'global', true),
    ('permissions.revoke', 'Revoke granular permissions', 'permissions', 'revoke', 'global', true),
    ('permissions.read', 'Read permission assignments', 'permissions', 'read', 'global', true)
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
AND p.resource IN ('projects', 'reports', 'resources', 'devices', 'sites')
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

-- Customer admin gets customer portal permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'customer_admin' 
AND p.resource IN ('customer_portals', 'customer_portal_users')
AND p.action IN ('create', 'read', 'update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Customer user gets limited customer portal access
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'customer_user' 
AND p.resource IN ('customer_portals')
AND p.action = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Vendor admin gets vendor permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'vendor_admin' 
AND p.resource IN ('vendors')
AND p.action IN ('create', 'read', 'update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Vendor user gets limited vendor access
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'vendor_user' 
AND p.resource IN ('vendors')
AND p.action = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =============================================
-- CREATE BASIC FUNCTIONS (SIMPLIFIED FOR INITIAL SETUP)
-- =============================================

-- Function to check if user has permission (simplified)
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
BEGIN
    -- Check permissions via user roles
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
    
    RETURN has_permission;
END;
$$;

-- Function to assign role to user (simplified)
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
    -- Insert the role assignment
    INSERT INTO public.user_roles (user_id, role_id, assigned_by, expires_at, notes)
    VALUES (p_user_id, p_role_id, COALESCE(p_assigned_by, auth.uid()), p_expires_at, p_notes)
    ON CONFLICT (user_id, role_id) DO UPDATE SET
        is_active = true,
        assigned_by = EXCLUDED.assigned_by,
        expires_at = EXCLUDED.expires_at,
        notes = EXCLUDED.notes
    RETURNING id INTO assignment_id;
    
    -- Log the action
    INSERT INTO public.role_audit_log (user_id, role_id, action, new_values, performed_by)
    VALUES (
        p_user_id, 
        p_role_id, 
        'assigned',
        jsonb_build_object(
            'assigned_by', COALESCE(p_assigned_by, auth.uid()),
            'expires_at', p_expires_at,
            'notes', p_notes
        ),
        COALESCE(p_assigned_by, auth.uid())
    );
    
    RETURN assignment_id;
END;
$$;

-- Function to revoke role from user (simplified)
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
        COALESCE(p_revoked_by, auth.uid())
    );
    
    RETURN FOUND;
END;
$$;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

COMMENT ON TABLE public.roles IS 'System roles for RBAC';
COMMENT ON TABLE public.permissions IS 'System permissions for RBAC';
COMMENT ON TABLE public.role_permissions IS 'Mapping between roles and permissions';
COMMENT ON TABLE public.user_roles IS 'Mapping between users and roles';
COMMENT ON TABLE public.role_hierarchy IS 'Role inheritance hierarchy';
COMMENT ON TABLE public.user_profiles IS 'Local user profiles';
COMMENT ON TABLE public.social_providers IS 'Social media provider linking';
COMMENT ON TABLE public.customer_portals IS 'Customer portal access';
COMMENT ON TABLE public.customer_portal_users IS 'Customer portal user assignments';
COMMENT ON TABLE public.project_permissions IS 'Project-level granular permissions';
COMMENT ON TABLE public.site_permissions IS 'Site-level granular permissions';
COMMENT ON TABLE public.device_permissions IS 'Device-level granular permissions';
COMMENT ON TABLE public.vendor_permissions IS 'Vendor-level granular permissions';
COMMENT ON TABLE public.user_permissions_cache IS 'Performance cache for user permissions';
COMMENT ON TABLE public.role_audit_log IS 'Audit trail for role assignments';
COMMENT ON TABLE public.permission_usage_log IS 'Log of permission usage';

COMMENT ON FUNCTION public.check_user_permission IS 'Check if a user has a specific permission';
COMMENT ON FUNCTION public.assign_role_to_user IS 'Assign a role to a user with audit logging';
COMMENT ON FUNCTION public.revoke_role_from_user IS 'Revoke a role from a user with audit logging';
