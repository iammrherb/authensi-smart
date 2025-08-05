-- Comprehensive Portnox Database Schema Migration
-- This creates the complete database structure for the enterprise Portnox project management system

-- Create custom types first
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM (
        'super_admin',
        'project_creator', 
        'product_manager',
        'sales_engineer',
        'technical_account_manager',
        'implementation_specialist',
        'support_specialist',
        'viewer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM (
        'projects',
        'sites', 
        'users',
        'vendors',
        'templates',
        'reports',
        'questionnaires',
        'requirements',
        'use_cases',
        'test_cases'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE permission_type AS ENUM (
        'read',
        'write', 
        'delete',
        'admin',
        'manage_users',
        'manage_roles'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Core system tables

-- System settings for global configuration
CREATE TABLE IF NOT EXISTS system_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text UNIQUE NOT NULL,
    setting_value jsonb NOT NULL DEFAULT '{}',
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Security audit logging
CREATE TABLE IF NOT EXISTS security_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    event_type text NOT NULL,
    event_details jsonb DEFAULT '{}',
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- User activity logging
CREATE TABLE IF NOT EXISTS user_activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action text NOT NULL,
    resource_type text,
    resource_id uuid,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- User sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    session_token text UNIQUE NOT NULL,
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true,
    last_activity timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz NOT NULL
);

-- Core business tables

-- Enhanced projects table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    project_type text NOT NULL DEFAULT 'deployment',
    status text DEFAULT 'planning',
    priority text DEFAULT 'medium',
    start_date date,
    target_completion_date date,
    actual_completion_date date,
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Client information
    client_name text,
    client_contact_email text,
    client_contact_phone text,
    industry text,
    
    -- Project scope
    total_sites integer DEFAULT 1,
    total_users integer DEFAULT 0,
    
    -- Technical details
    deployment_type text,
    authentication_methods jsonb DEFAULT '[]',
    integration_requirements jsonb DEFAULT '[]',
    success_criteria jsonb DEFAULT '[]',
    pain_points jsonb DEFAULT '[]',
    
    -- Team assignments
    project_manager uuid,
    technical_lead uuid,
    sales_contact uuid,
    additional_stakeholders jsonb DEFAULT '[]',
    
    -- Migration specific fields
    migration_scope jsonb DEFAULT '{}',
    legacy_systems jsonb DEFAULT '[]',
    
    -- Bulk site management
    bulk_sites_data jsonb DEFAULT '[]',
    
    -- Metadata
    tags jsonb DEFAULT '[]',
    notes text,
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhanced sites table
CREATE TABLE IF NOT EXISTS sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    
    -- Location information
    address text,
    city text,
    state_province text,
    country text,
    postal_code text,
    timezone text,
    region text,
    
    -- Site characteristics
    site_type text DEFAULT 'office',
    size_category text DEFAULT 'medium',
    user_count integer DEFAULT 0,
    
    -- Network infrastructure
    network_complexity text DEFAULT 'standard',
    has_wireless boolean DEFAULT true,
    has_wired boolean DEFAULT true,
    vlan_count integer DEFAULT 0,
    switch_count integer DEFAULT 0,
    access_point_count integer DEFAULT 0,
    
    -- Technical specifications
    primary_switch_models text[],
    primary_ap_models text[],
    network_vendors text[],
    existing_aaa_solution text,
    
    -- Deployment information
    deployment_phase text DEFAULT 'planning',
    deployment_priority integer DEFAULT 1,
    target_go_live date,
    actual_go_live date,
    
    -- Project association
    project_id uuid,
    
    -- Status tracking
    status text DEFAULT 'planned',
    completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Implementation details
    implementation_notes text,
    success_criteria jsonb DEFAULT '[]',
    challenges jsonb DEFAULT '[]',
    lessons_learned text,
    
    -- Metadata
    tags jsonb DEFAULT '[]',
    custom_fields jsonb DEFAULT '{}',
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Comprehensive vendors table with unique constraint on name
CREATE TABLE IF NOT EXISTS vendors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    vendor_type text NOT NULL, -- 'network', 'security', 'identity', 'wireless', etc.
    description text,
    
    -- Contact information
    website_url text,
    support_email text,
    support_phone text,
    documentation_url text,
    
    -- Technical specifications
    supported_protocols jsonb DEFAULT '[]',
    integration_methods jsonb DEFAULT '[]',
    authentication_standards jsonb DEFAULT '[]',
    
    -- Portnox integration
    portnox_certified boolean DEFAULT false,
    integration_complexity text DEFAULT 'medium',
    configuration_templates jsonb DEFAULT '[]',
    
    -- Business information
    market_segment text[],
    typical_deployment_size text,
    licensing_model text,
    
    -- Metadata
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Vendor models for specific hardware/software versions
CREATE TABLE IF NOT EXISTS vendor_models (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
    model_name text NOT NULL,
    model_type text NOT NULL, -- 'switch', 'access_point', 'firewall', 'software', etc.
    
    -- Technical specifications
    firmware_versions text[],
    supported_features jsonb DEFAULT '[]',
    configuration_methods jsonb DEFAULT '[]',
    
    -- Portnox specific
    portnox_compatibility jsonb DEFAULT '{}',
    recommended_settings jsonb DEFAULT '{}',
    known_limitations jsonb DEFAULT '[]',
    
    -- Documentation
    configuration_guide_url text,
    troubleshooting_url text,
    
    -- Status
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhanced questionnaires with versioning
CREATE TABLE IF NOT EXISTS questionnaires (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    questionnaire_type text DEFAULT 'scoping',
    version text DEFAULT '1.0',
    
    -- Structure
    sections jsonb DEFAULT '[]',
    questions jsonb NOT NULL DEFAULT '[]',
    conditional_logic jsonb DEFAULT '{}',
    
    -- Validation and scoring
    validation_rules jsonb DEFAULT '{}',
    scoring_criteria jsonb DEFAULT '{}',
    completion_requirements jsonb DEFAULT '{}',
    
    -- Metadata
    is_active boolean DEFAULT true,
    is_template boolean DEFAULT false,
    tags jsonb DEFAULT '[]',
    
    -- Audit trail
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Questionnaire responses with comprehensive data
CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id uuid REFERENCES questionnaires(id) ON DELETE CASCADE,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Response data
    responses jsonb NOT NULL DEFAULT '{}',
    completion_status text DEFAULT 'in_progress',
    completion_percentage integer DEFAULT 0,
    
    -- Analysis results
    risk_assessment jsonb DEFAULT '{}',
    recommendations jsonb DEFAULT '[]',
    complexity_score integer,
    estimated_timeline text,
    
    -- Workflow
    submitted_at timestamptz,
    reviewed_at timestamptz,
    approved_at timestamptz,
    reviewer_id uuid,
    reviewer_notes text,
    
    -- Metadata
    response_metadata jsonb DEFAULT '{}',
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Comprehensive use cases library with unique constraint on title
CREATE TABLE IF NOT EXISTS use_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    description text,
    category text NOT NULL,
    
    -- Classification
    complexity text DEFAULT 'medium',
    priority text DEFAULT 'medium',
    use_case_type text DEFAULT 'functional',
    
    -- Implementation details
    prerequisites jsonb DEFAULT '[]',
    acceptance_criteria jsonb DEFAULT '[]',
    implementation_steps jsonb DEFAULT '[]',
    validation_steps jsonb DEFAULT '[]',
    
    -- Business context
    business_value text,
    stakeholder_types jsonb DEFAULT '[]',
    success_metrics jsonb DEFAULT '[]',
    
    -- Technical context
    required_integrations jsonb DEFAULT '[]',
    technical_requirements jsonb DEFAULT '[]',
    configuration_impact jsonb DEFAULT '{}',
    
    -- Industry and compliance
    industry_applicability jsonb DEFAULT '[]',
    compliance_frameworks jsonb DEFAULT '[]',
    regulatory_considerations text,
    
    -- Effort estimation
    estimated_effort_hours integer,
    typical_timeline text,
    resource_requirements jsonb DEFAULT '[]',
    
    -- Dependencies and relationships
    dependencies jsonb DEFAULT '[]',
    related_use_cases uuid[],
    conflicts_with uuid[],
    
    -- Documentation
    documentation_links jsonb DEFAULT '[]',
    example_configurations jsonb DEFAULT '[]',
    troubleshooting_guide jsonb DEFAULT '[]',
    
    -- Metadata
    tags jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    usage_count integer DEFAULT 0,
    last_used timestamptz,
    
    -- Audit
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Requirements management
CREATE TABLE IF NOT EXISTS requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    requirement_type text DEFAULT 'functional',
    category text NOT NULL,
    
    -- Priority and classification
    priority text DEFAULT 'medium',
    complexity text DEFAULT 'medium',
    impact text DEFAULT 'medium',
    
    -- Requirements details
    rationale text,
    acceptance_criteria jsonb DEFAULT '[]',
    verification_method text,
    
    -- Traceability
    source_document text,
    stakeholder_type text,
    regulatory_requirement boolean DEFAULT false,
    compliance_frameworks jsonb DEFAULT '[]',
    
    -- Implementation
    implementation_approach text,
    estimated_effort_hours integer,
    prerequisites jsonb DEFAULT '[]',
    
    -- Dependencies
    depends_on uuid[],
    conflicts_with uuid[],
    
    -- Validation
    testable boolean DEFAULT true,
    test_scenarios jsonb DEFAULT '[]',
    
    -- Metadata
    tags jsonb DEFAULT '[]',
    custom_fields jsonb DEFAULT '{}',
    is_active boolean DEFAULT true,
    
    -- Audit
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Test cases for validation
CREATE TABLE IF NOT EXISTS test_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    test_type text DEFAULT 'functional',
    category text NOT NULL,
    
    -- Test details
    preconditions jsonb DEFAULT '[]',
    test_steps jsonb DEFAULT '[]',
    expected_outcome text NOT NULL,
    actual_outcome text,
    
    -- Execution
    test_data jsonb DEFAULT '{}',
    environment_requirements jsonb DEFAULT '[]',
    execution_time_minutes integer,
    
    -- Classification
    priority text DEFAULT 'medium',
    complexity text DEFAULT 'medium',
    automation_level text DEFAULT 'manual',
    
    -- Coverage
    requirements_covered uuid[],
    use_cases_covered uuid[],
    risk_areas_covered text[],
    
    -- Results tracking
    last_execution_date timestamptz,
    last_execution_status text,
    pass_rate_percentage integer,
    execution_history jsonb DEFAULT '[]',
    
    -- Metadata
    tags jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    
    -- Audit
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'projects', 'sites', 'vendors', 'vendor_models', 
        'questionnaires', 'questionnaire_responses', 
        'use_cases', 'requirements', 'test_cases'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at 
                BEFORE UPDATE ON %I 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name, table_name, table_name);
    END LOOP;
END $$;

-- Insert comprehensive vendor data
INSERT INTO vendors (name, vendor_type, description, portnox_certified, integration_complexity, supported_protocols, integration_methods) VALUES
('Cisco', 'network', 'Leading network infrastructure vendor with comprehensive switching and wireless solutions', true, 'medium', '["RADIUS", "802.1X", "TACACS+", "SNMP"]', '["API", "CLI", "SNMP"]'),
('Aruba', 'wireless', 'Enterprise wireless and switching solutions with advanced network access control', true, 'medium', '["RADIUS", "802.1X", "CPPM Integration"]', '["API", "CLI", "ClearPass"]'),
('Juniper', 'network', 'High-performance networking solutions for enterprise and service provider markets', true, 'medium', '["RADIUS", "802.1X", "TACACS+"]', '["NETCONF", "API", "CLI"]'),
('Fortinet', 'security', 'Cybersecurity solutions including firewalls, intrusion prevention, and secure access', true, 'low', '["RADIUS", "LDAP", "SAML"]', '["API", "CLI", "FortiGate Integration"]'),
('Palo Alto Networks', 'security', 'Next-generation firewall and cybersecurity platform provider', true, 'medium', '["RADIUS", "LDAP", "SAML", "GlobalProtect"]', '["API", "XML-API", "CLI"]'),
('Extreme Networks', 'network', 'Wired and wireless networking solutions with cloud-driven network management', true, 'low', '["RADIUS", "802.1X", "SNMP"]', '["API", "CLI", "ExtremeCloud"]'),
('Meraki', 'wireless', 'Cloud-managed networking solutions by Cisco with simplified deployment and management', true, 'low', '["RADIUS", "802.1X", "Cloud API"]', '["Dashboard API", "Cloud Management"]'),
('Ruckus', 'wireless', 'Enterprise wireless networking solutions with advanced antenna technology', true, 'medium', '["RADIUS", "802.1X", "DPSK"]', '["API", "CLI", "SmartZone"]'),
('Microsoft', 'identity', 'Identity and access management solutions including Active Directory and Azure AD', true, 'low', '["LDAP", "Kerberos", "SAML", "OAuth"]', '["Graph API", "PowerShell", "LDAP"]'),
('Okta', 'identity', 'Cloud-based identity and access management platform for enterprise applications', true, 'low', '["SAML", "OAuth", "OIDC", "RADIUS"]', '["REST API", "SCIM", "Webhooks"]')
ON CONFLICT (name) DO UPDATE SET
    vendor_type = EXCLUDED.vendor_type,
    description = EXCLUDED.description,
    portnox_certified = EXCLUDED.portnox_certified,
    integration_complexity = EXCLUDED.integration_complexity,
    supported_protocols = EXCLUDED.supported_protocols,
    integration_methods = EXCLUDED.integration_methods;

-- Insert comprehensive use case
INSERT INTO use_cases (
    title, 
    description, 
    category, 
    complexity, 
    priority, 
    use_case_type,
    prerequisites,
    acceptance_criteria,
    implementation_steps,
    business_value,
    stakeholder_types,
    required_integrations,
    technical_requirements,
    industry_applicability,
    estimated_effort_hours,
    typical_timeline,
    tags
) VALUES (
    'Enterprise Network Access Control Implementation',
    'Comprehensive deployment of network access control (NAC) solution to secure network access across wired and wireless infrastructure, implementing device authentication, user authorization, and policy enforcement.',
    'Network Security',
    'high',
    'high',
    'functional',
    '["Active Directory infrastructure", "RADIUS server capability", "802.1X capable network devices", "Certificate authority for device certificates", "Network segmentation design"]',
    '["All network devices support 802.1X authentication", "User and device policies are enforced consistently", "Unauthorized devices are quarantined or denied access", "Network access events are logged and monitored", "Compliance reporting is automated"]',
    '["Conduct network infrastructure assessment", "Design authentication and authorization policies", "Configure RADIUS server integration", "Deploy certificates to managed devices", "Configure network device 802.1X settings", "Implement guest access workflow", "Set up monitoring and alerting", "Train IT staff on new procedures", "Conduct user acceptance testing", "Deploy to production environment"]',
    'Significantly improved network security posture, reduced risk of unauthorized access, compliance with security frameworks, centralized access control management, and detailed visibility into network access patterns.',
    '["Network Administrators", "Security Team", "IT Operations", "Compliance Officer", "End Users"]',
    '["Active Directory", "Certificate Authority", "SIEM System", "Network Management Platform", "Help Desk System"]',
    '["802.1X capable switches and access points", "RADIUS server infrastructure", "PKI infrastructure for certificates", "Network segmentation capabilities", "Centralized logging and monitoring"]',
    '["Financial Services", "Healthcare", "Government", "Education", "Manufacturing", "Professional Services"]',
    240,
    '12-16 weeks',
    '["802.1X", "RADIUS", "Network Security", "Device Authentication", "Policy Enforcement", "Compliance"]'
) ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    complexity = EXCLUDED.complexity,
    priority = EXCLUDED.priority,
    prerequisites = EXCLUDED.prerequisites,
    acceptance_criteria = EXCLUDED.acceptance_criteria,
    implementation_steps = EXCLUDED.implementation_steps,
    business_value = EXCLUDED.business_value,
    stakeholder_types = EXCLUDED.stakeholder_types,
    required_integrations = EXCLUDED.required_integrations,
    technical_requirements = EXCLUDED.technical_requirements,
    industry_applicability = EXCLUDED.industry_applicability,
    estimated_effort_hours = EXCLUDED.estimated_effort_hours,
    typical_timeline = EXCLUDED.typical_timeline,
    tags = EXCLUDED.tags;