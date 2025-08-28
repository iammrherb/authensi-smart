-- Project Discovery and Management System
-- This migration creates comprehensive tables for project discovery, scoping, and management

-- Projects table with full discovery data
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning',
    company_data JSONB NOT NULL,
    discovery_data JSONB,
    recommendations JSONB,
    scope_data JSONB,
    timeline JSONB,
    budget JSONB,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    completion_percentage INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    tags TEXT[],
    
    -- Relationships
    account_manager UUID REFERENCES auth.users(id),
    technical_lead UUID REFERENCES auth.users(id),
    customer_portal_id UUID
);

-- Project sites (from discovery)
CREATE TABLE IF NOT EXISTS public.project_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- headquarters, branch, datacenter, remote
    location VARCHAR(255),
    user_count INTEGER DEFAULT 0,
    device_count INTEGER DEFAULT 0,
    criticality VARCHAR(20) DEFAULT 'medium',
    network_devices JSONB, -- switches, routers, firewalls, wireless
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project requirements mapping
CREATE TABLE IF NOT EXISTS public.project_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES public.requirements_library(id),
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project compliance mapping
CREATE TABLE IF NOT EXISTS public.project_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES public.compliance_frameworks(id),
    control_id UUID REFERENCES public.compliance_controls(id),
    status VARCHAR(50) DEFAULT 'required',
    evidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project vendors and products
CREATE TABLE IF NOT EXISTS public.project_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors_library(id),
    product_name VARCHAR(255),
    product_version VARCHAR(50),
    role VARCHAR(100), -- current_nac, firewall, edr, siem, mdm, etc.
    status VARCHAR(50), -- existing, planned, replacing
    integration_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project authentication methods
CREATE TABLE IF NOT EXISTS public.project_auth_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL, -- 802.1X, MAB, WebAuth, PSK, EAP-TLS, PEAP
    current_state BOOLEAN DEFAULT false,
    desired_state BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    use_case TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project devices inventory
CREATE TABLE IF NOT EXISTS public.project_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- managed, unmanaged, byod, iot, guest
    device_type VARCHAR(100),
    vendor VARCHAR(100),
    model VARCHAR(100),
    count INTEGER DEFAULT 0,
    os_types TEXT[],
    auth_capability VARCHAR(50), -- none, 802.1X, MAB, PSK
    network_segment VARCHAR(100),
    management_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    phase_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    completion_percentage INTEGER DEFAULT 0,
    dependencies TEXT[],
    deliverables TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project tasks
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project documents
CREATE TABLE IF NOT EXISTS public.project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- scope, design, report, config, test_plan
    content TEXT,
    file_path VARCHAR(500),
    version VARCHAR(20),
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project activity log
CREATE TABLE IF NOT EXISTS public.project_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom library items (for items not in existing libraries)
CREATE TABLE IF NOT EXISTS public.custom_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type VARCHAR(50) NOT NULL, -- vendor, device, software, other
    name VARCHAR(255) NOT NULL,
    description TEXT,
    properties JSONB,
    tags TEXT[],
    created_by VARCHAR(255),
    enrichment_status VARCHAR(50) DEFAULT 'pending',
    enrichment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices library (if not exists)
CREATE TABLE IF NOT EXISTS public.devices_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- switch, router, firewall, wireless_controller, access_point
    capabilities JSONB,
    supported_protocols TEXT[],
    eol_date DATE,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Software library (if not exists)
CREATE TABLE IF NOT EXISTS public.software_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    category VARCHAR(100), -- firewall, edr, siem, mdm, vpn, identity_provider
    integration_methods TEXT[],
    api_available BOOLEAN DEFAULT false,
    documentation_url TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_project_sites_project ON public.project_sites(project_id);
CREATE INDEX IF NOT EXISTS idx_project_requirements_project ON public.project_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_project_compliance_project ON public.project_compliance(project_id);
CREATE INDEX IF NOT EXISTS idx_project_vendors_project ON public.project_vendors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_auth_methods_project ON public.project_auth_methods(project_id);
CREATE INDEX IF NOT EXISTS idx_project_devices_project ON public.project_devices(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_milestone ON public.project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_project ON public.project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_project ON public.project_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_custom_library_type ON public.custom_library(item_type);
CREATE INDEX IF NOT EXISTS idx_devices_library_vendor ON public.devices_library(vendor);
CREATE INDEX IF NOT EXISTS idx_software_library_vendor ON public.software_library(vendor);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_auth_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can read projects" ON public.projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (created_by = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (created_by = auth.uid() OR auth.role() = 'service_role');

-- Apply similar policies to related tables
CREATE POLICY "Read project sites" ON public.project_sites
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project sites" ON public.project_sites
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project requirements" ON public.project_requirements
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project requirements" ON public.project_requirements
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project compliance" ON public.project_compliance
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project compliance" ON public.project_compliance
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project vendors" ON public.project_vendors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project vendors" ON public.project_vendors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project auth methods" ON public.project_auth_methods
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project auth methods" ON public.project_auth_methods
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project devices" ON public.project_devices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project devices" ON public.project_devices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project milestones" ON public.project_milestones
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project milestones" ON public.project_milestones
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project tasks" ON public.project_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project tasks" ON public.project_tasks
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project documents" ON public.project_documents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage project documents" ON public.project_documents
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read project activity" ON public.project_activity
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Create project activity" ON public.project_activity
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Read custom library" ON public.custom_library
    FOR SELECT USING (true);

CREATE POLICY "Manage custom library" ON public.custom_library
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read devices library" ON public.devices_library
    FOR SELECT USING (true);

CREATE POLICY "Manage devices library" ON public.devices_library
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Read software library" ON public.software_library
    FOR SELECT USING (true);

CREATE POLICY "Manage software library" ON public.software_library
    FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically update project completion percentage
CREATE OR REPLACE FUNCTION calculate_project_completion()
RETURNS TRIGGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
    completion_pct INTEGER;
BEGIN
    SELECT COUNT(*), 
           COUNT(*) FILTER (WHERE status = 'completed')
    INTO total_milestones, completed_milestones
    FROM public.project_milestones
    WHERE project_id = NEW.project_id;
    
    IF total_milestones > 0 THEN
        completion_pct := (completed_milestones * 100) / total_milestones;
        
        UPDATE public.projects
        SET completion_percentage = completion_pct,
            updated_at = NOW()
        WHERE id = NEW.project_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update project completion
CREATE TRIGGER update_project_completion
AFTER INSERT OR UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION calculate_project_completion();

-- Function to log project activity
CREATE OR REPLACE FUNCTION log_project_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_activity (
        project_id,
        activity_type,
        description,
        metadata,
        user_id
    ) VALUES (
        COALESCE(NEW.project_id, OLD.project_id),
        TG_OP || '_' || TG_TABLE_NAME,
        TG_OP || ' on ' || TG_TABLE_NAME,
        jsonb_build_object(
            'table', TG_TABLE_NAME,
            'operation', TG_OP,
            'new', row_to_json(NEW),
            'old', row_to_json(OLD)
        ),
        auth.uid()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to key tables
CREATE TRIGGER log_project_changes
AFTER INSERT OR UPDATE OR DELETE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_milestone_changes
AFTER INSERT OR UPDATE OR DELETE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_task_changes
AFTER INSERT OR UPDATE OR DELETE ON public.project_tasks
FOR EACH ROW
EXECUTE FUNCTION log_project_activity();

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

