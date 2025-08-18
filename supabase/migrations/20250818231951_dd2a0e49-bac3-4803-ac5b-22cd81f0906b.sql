-- Add organization management to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS organization_portal_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS organization_portal_id UUID,
ADD COLUMN IF NOT EXISTS organization_portal_roles JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS organization_portal_features JSONB DEFAULT '[]'::jsonb;

-- Create organization_portal_access table for role-based access
CREATE TABLE IF NOT EXISTS organization_portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'viewer', 'configurator')),
    features JSONB DEFAULT '[]'::jsonb,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE organization_portal_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization portal access
CREATE POLICY "Project owners can manage organization portal access"
ON organization_portal_access
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = organization_portal_access.project_id 
        AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
    )
);

CREATE POLICY "Users can view their own organization portal access"
ON organization_portal_access
FOR SELECT
USING (user_id = auth.uid());

-- Create organization_features table to define available features
CREATE TABLE IF NOT EXISTS organization_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('tracking', 'config', 'reports', 'admin', 'collaboration')),
    is_default BOOLEAN DEFAULT false,
    requires_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default organization features
INSERT INTO organization_features (name, description, category, is_default, requires_admin) VALUES
('view_project_status', 'View project status and progress', 'tracking', true, false),
('view_implementation_tracking', 'View implementation progress and phases', 'tracking', true, false),
('view_analytics', 'View project analytics and reports', 'reports', true, false),
('use_config_generator', 'Access configuration generation tools', 'config', false, false),
('edit_team_members', 'Manage customer team members', 'collaboration', false, true),
('view_detailed_reports', 'Access detailed project reports', 'reports', false, false),
('manage_checklists', 'Create and manage implementation checklists', 'tracking', false, true),
('export_data', 'Export project data and reports', 'reports', false, true),
('view_technical_docs', 'Access technical documentation', 'collaboration', true, false),
('comment_on_tasks', 'Add comments to project tasks and milestones', 'collaboration', true, false)
ON CONFLICT (name) DO NOTHING;

-- Create customer_portal_sessions table for organization users
CREATE TABLE IF NOT EXISTS customer_portal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS for customer portal sessions
ALTER TABLE customer_portal_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sessions"
ON customer_portal_sessions
FOR ALL
USING (user_id = auth.uid());

-- Create function to authenticate organization users
CREATE OR REPLACE FUNCTION authenticate_organization_user(
    p_email TEXT,
    p_password TEXT,
    p_organization_name TEXT
)
RETURNS TABLE(
    user_id UUID,
    project_id UUID,
    role TEXT,
    features JSONB,
    project_name TEXT,
    organization_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        opa.user_id,
        opa.project_id,
        opa.role,
        opa.features,
        p.name,
        p.organization_name
    FROM organization_portal_access opa
    JOIN projects p ON p.id = opa.project_id
    JOIN profiles prof ON prof.id = opa.user_id
    WHERE prof.email = p_email 
        AND p.organization_name = p_organization_name
        AND p.organization_portal_enabled = true
        AND opa.is_active = true
        AND (opa.expires_at IS NULL OR opa.expires_at > now());
END;
$$;