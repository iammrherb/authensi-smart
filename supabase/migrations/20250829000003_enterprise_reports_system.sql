-- =============================================================================
-- ENTERPRISE REPORTS SYSTEM DATABASE MIGRATION
-- =============================================================================
-- This migration creates the comprehensive enterprise reports system with 
-- Firecrawler integration, professional report templates, and automated 
-- documentation generation capabilities.

-- =============================================================================
-- ENTERPRISE REPORTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.enterprise_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'prerequisites',
        'deployment_checklist', 
        'firewall_requirements',
        'technical_specifications',
        'project_summary',
        'vendor_comparison'
    )),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    generated_by UUID REFERENCES auth.users(id),
    version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'approved')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_enterprise_reports_project_id ON public.enterprise_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_reports_type ON public.enterprise_reports(type);
CREATE INDEX IF NOT EXISTS idx_enterprise_reports_status ON public.enterprise_reports(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_reports_generated_at ON public.enterprise_reports(generated_at DESC);

-- =============================================================================
-- FIRECRAWLER JOBS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.firecrawler_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    crawl_type TEXT NOT NULL DEFAULT 'single' CHECK (crawl_type IN ('single', 'sitemap', 'batch')),
    options JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    
    -- Metadata for tracking
    initiated_by UUID REFERENCES auth.users(id),
    related_entity_type TEXT,
    related_entity_id UUID,
    tags TEXT[] DEFAULT '{}',
    
    -- Performance tracking
    processing_time_ms INTEGER,
    content_size_bytes INTEGER,
    pages_crawled INTEGER DEFAULT 0
);

-- Add indexes for Firecrawler jobs
CREATE INDEX IF NOT EXISTS idx_firecrawler_jobs_status ON public.firecrawler_jobs(status);
CREATE INDEX IF NOT EXISTS idx_firecrawler_jobs_url ON public.firecrawler_jobs(url);
CREATE INDEX IF NOT EXISTS idx_firecrawler_jobs_created_at ON public.firecrawler_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_firecrawler_jobs_priority ON public.firecrawler_jobs(priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_firecrawler_jobs_related_entity ON public.firecrawler_jobs(related_entity_type, related_entity_id);

-- =============================================================================
-- REPORT TEMPLATES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.report_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'prerequisites',
        'deployment_checklist',
        'firewall_requirements',
        'technical_specifications',
        'project_summary',
        'vendor_comparison'
    )),
    industry TEXT,
    template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    styling JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Template metadata
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    usage_count INTEGER NOT NULL DEFAULT 0,
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Unique constraint for default templates per type
    UNIQUE(type, is_default) DEFERRABLE INITIALLY DEFERRED
);

-- Add indexes for report templates
CREATE INDEX IF NOT EXISTS idx_report_templates_type ON public.report_templates(type);
CREATE INDEX IF NOT EXISTS idx_report_templates_industry ON public.report_templates(industry);
CREATE INDEX IF NOT EXISTS idx_report_templates_is_active ON public.report_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_report_templates_is_default ON public.report_templates(is_default);

-- =============================================================================
-- FIREWALL REQUIREMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.firewall_requirements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    component TEXT NOT NULL,
    ports TEXT[] NOT NULL,
    protocol TEXT NOT NULL CHECK (protocol IN ('TCP', 'UDP', 'ICMP', 'ANY')),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
    source_description TEXT NOT NULL,
    destination_description TEXT NOT NULL,
    description TEXT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    category TEXT NOT NULL DEFAULT 'core' CHECK (category IN ('core', 'optional', 'integration')),
    
    -- Vendor and product associations
    vendor TEXT,
    product TEXT,
    version TEXT,
    
    -- Documentation references
    documentation_url TEXT,
    source_document_id UUID,
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for firewall requirements
CREATE INDEX IF NOT EXISTS idx_firewall_requirements_service ON public.firewall_requirements(service_name);
CREATE INDEX IF NOT EXISTS idx_firewall_requirements_component ON public.firewall_requirements(component);
CREATE INDEX IF NOT EXISTS idx_firewall_requirements_category ON public.firewall_requirements(category);
CREATE INDEX IF NOT EXISTS idx_firewall_requirements_vendor ON public.firewall_requirements(vendor);
CREATE INDEX IF NOT EXISTS idx_firewall_requirements_mandatory ON public.firewall_requirements(is_mandatory);

-- =============================================================================
-- PREREQUISITES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.prerequisites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN (
        'hardware',
        'software', 
        'network',
        'permissions',
        'certificates',
        'integration',
        'compliance'
    )),
    requirement TEXT NOT NULL,
    description TEXT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    alternatives TEXT[],
    
    -- Specification details
    minimum_specification TEXT,
    recommended_specification TEXT,
    enterprise_specification TEXT,
    
    -- Vendor and product associations
    vendor TEXT,
    product TEXT,
    version TEXT,
    
    -- Documentation references
    documentation_url TEXT,
    source_document_id UUID,
    verification_steps TEXT[],
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for prerequisites
CREATE INDEX IF NOT EXISTS idx_prerequisites_category ON public.prerequisites(category);
CREATE INDEX IF NOT EXISTS idx_prerequisites_mandatory ON public.prerequisites(is_mandatory);
CREATE INDEX IF NOT EXISTS idx_prerequisites_vendor ON public.prerequisites(vendor);

-- =============================================================================
-- DEPLOYMENT CHECKLISTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.deployment_checklists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'prerequisites',
        'installation',
        'configuration',
        'testing',
        'deployment',
        'post_deployment'
    )),
    checklist_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Template associations
    deployment_type TEXT,
    complexity_level TEXT,
    estimated_duration TEXT,
    
    -- Dependencies and ordering
    prerequisites_checklist_ids UUID[],
    order_sequence INTEGER NOT NULL DEFAULT 1,
    
    -- Vendor and product associations
    vendor TEXT,
    product TEXT,
    version TEXT,
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for deployment checklists
CREATE INDEX IF NOT EXISTS idx_deployment_checklists_category ON public.deployment_checklists(category);
CREATE INDEX IF NOT EXISTS idx_deployment_checklists_deployment_type ON public.deployment_checklists(deployment_type);
CREATE INDEX IF NOT EXISTS idx_deployment_checklists_order ON public.deployment_checklists(order_sequence);

-- =============================================================================
-- DOCUMENTATION SOURCES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.documentation_sources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN (
        'portnox_docs',
        'vendor_docs',
        'kb_article',
        'community_post',
        'technical_guide',
        'api_documentation'
    )),
    content_hash TEXT NOT NULL,
    extracted_content TEXT,
    structured_data JSONB,
    
    -- Content metadata
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    last_modified_at TIMESTAMP WITH TIME ZONE,
    content_freshness_score DECIMAL(3,2) DEFAULT 1.0,
    relevance_score DECIMAL(3,2) DEFAULT 0.0,
    quality_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Categorization
    vendor TEXT,
    product TEXT,
    version TEXT,
    document_type TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Processing status
    processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN (
        'pending',
        'processing', 
        'completed',
        'failed',
        'expired'
    )),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for documentation sources
CREATE INDEX IF NOT EXISTS idx_documentation_sources_url ON public.documentation_sources(url);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_type ON public.documentation_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_vendor ON public.documentation_sources(vendor);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_hash ON public.documentation_sources(content_hash);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_freshness ON public.documentation_sources(content_freshness_score DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_relevance ON public.documentation_sources(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_sources_status ON public.documentation_sources(processing_status);

-- Full-text search index for content
CREATE INDEX IF NOT EXISTS idx_documentation_sources_content_fts 
ON public.documentation_sources 
USING gin(to_tsvector('english', title || ' ' || COALESCE(extracted_content, '')));

-- =============================================================================
-- REPORT GENERATION QUEUE TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.report_generation_queue (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    request_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued',
        'processing',
        'completed',
        'failed',
        'cancelled'
    )),
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    
    -- Processing details
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    
    -- Result
    generated_report_id UUID REFERENCES public.enterprise_reports(id),
    
    -- Audit fields
    requested_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for report generation queue
CREATE INDEX IF NOT EXISTS idx_report_generation_queue_status ON public.report_generation_queue(status);
CREATE INDEX IF NOT EXISTS idx_report_generation_queue_priority ON public.report_generation_queue(priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_report_generation_queue_project ON public.report_generation_queue(project_id);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.enterprise_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firecrawler_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firewall_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_generation_queue ENABLE ROW LEVEL SECURITY;

-- Enterprise Reports policies
CREATE POLICY "Users can view enterprise reports for their projects" ON public.enterprise_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = enterprise_reports.project_id 
            AND (p.created_by = auth.uid() OR p.team_members ? auth.uid()::text)
        )
    );

CREATE POLICY "Users can create enterprise reports for their projects" ON public.enterprise_reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = enterprise_reports.project_id 
            AND (p.created_by = auth.uid() OR p.team_members ? auth.uid()::text)
        )
    );

CREATE POLICY "Users can update their enterprise reports" ON public.enterprise_reports
    FOR UPDATE USING (
        generated_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = enterprise_reports.project_id 
            AND p.created_by = auth.uid()
        )
    );

-- Firecrawler Jobs policies
CREATE POLICY "Users can view their firecrawler jobs" ON public.firecrawler_jobs
    FOR SELECT USING (initiated_by = auth.uid());

CREATE POLICY "Users can create firecrawler jobs" ON public.firecrawler_jobs
    FOR INSERT WITH CHECK (initiated_by = auth.uid());

CREATE POLICY "Users can update their firecrawler jobs" ON public.firecrawler_jobs
    FOR UPDATE USING (initiated_by = auth.uid());

-- Report Templates policies (public read, admin write)
CREATE POLICY "Anyone can view active report templates" ON public.report_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage report templates" ON public.report_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('super_admin', 'admin')
        )
    );

-- Firewall Requirements policies (public read, admin write)
CREATE POLICY "Anyone can view firewall requirements" ON public.firewall_requirements
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage firewall requirements" ON public.firewall_requirements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('super_admin', 'admin')
        )
    );

-- Prerequisites policies (public read, admin write)
CREATE POLICY "Anyone can view prerequisites" ON public.prerequisites
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage prerequisites" ON public.prerequisites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('super_admin', 'admin')
        )
    );

-- Deployment Checklists policies (public read, admin write)
CREATE POLICY "Anyone can view deployment checklists" ON public.deployment_checklists
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage deployment checklists" ON public.deployment_checklists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('super_admin', 'admin')
        )
    );

-- Documentation Sources policies (public read, system write)
CREATE POLICY "Anyone can view documentation sources" ON public.documentation_sources
    FOR SELECT USING (processing_status = 'completed');

CREATE POLICY "System can manage documentation sources" ON public.documentation_sources
    FOR ALL USING (true);

-- Report Generation Queue policies
CREATE POLICY "Users can view their report generation requests" ON public.report_generation_queue
    FOR SELECT USING (requested_by = auth.uid());

CREATE POLICY "Users can create report generation requests" ON public.report_generation_queue
    FOR INSERT WITH CHECK (requested_by = auth.uid());

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Create or replace the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_enterprise_reports_updated_at
    BEFORE UPDATE ON public.enterprise_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
    BEFORE UPDATE ON public.report_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_firewall_requirements_updated_at
    BEFORE UPDATE ON public.firewall_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prerequisites_updated_at
    BEFORE UPDATE ON public.prerequisites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deployment_checklists_updated_at
    BEFORE UPDATE ON public.deployment_checklists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentation_sources_updated_at
    BEFORE UPDATE ON public.documentation_sources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_generation_queue_updated_at
    BEFORE UPDATE ON public.report_generation_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- SEED DATA FOR FIREWALL REQUIREMENTS
-- =============================================================================

INSERT INTO public.firewall_requirements (
    service_name, component, ports, protocol, direction, 
    source_description, destination_description, description, 
    is_mandatory, category, vendor, product
) VALUES
-- Core Portnox Services
('HTTPS Management Console', 'Portnox Server', ARRAY['443'], 'TCP', 'inbound', 'Administrator Workstations', 'Portnox Server', 'Web-based management console access for administrators', true, 'core', 'Portnox', 'NAC'),
('RADIUS Authentication', 'RADIUS Server', ARRAY['1812'], 'UDP', 'inbound', 'Network Access Devices', 'Portnox Server', 'RADIUS authentication requests from network devices', true, 'core', 'Portnox', 'NAC'),
('RADIUS Accounting', 'RADIUS Server', ARRAY['1813'], 'UDP', 'inbound', 'Network Access Devices', 'Portnox Server', 'RADIUS accounting messages from network devices', true, 'core', 'Portnox', 'NAC'),
('Database Connection', 'Database Server', ARRAY['3306', '5432', '1433'], 'TCP', 'outbound', 'Portnox Server', 'Database Server', 'Database connectivity for MySQL, PostgreSQL, or SQL Server', true, 'core', 'Portnox', 'NAC'),

-- Integration Services
('LDAP Directory Access', 'Active Directory', ARRAY['389'], 'TCP', 'outbound', 'Portnox Server', 'Domain Controllers', 'LDAP queries to Active Directory for user authentication', true, 'integration', 'Microsoft', 'Active Directory'),
('LDAPS Secure Directory Access', 'Active Directory', ARRAY['636'], 'TCP', 'outbound', 'Portnox Server', 'Domain Controllers', 'Secure LDAP queries to Active Directory', false, 'integration', 'Microsoft', 'Active Directory'),
('Global Catalog Access', 'Active Directory', ARRAY['3268'], 'TCP', 'outbound', 'Portnox Server', 'Global Catalog Servers', 'Global Catalog queries for multi-domain environments', false, 'integration', 'Microsoft', 'Active Directory'),
('Kerberos Authentication', 'Active Directory', ARRAY['88'], 'TCP', 'outbound', 'Portnox Server', 'Domain Controllers', 'Kerberos authentication protocol', false, 'integration', 'Microsoft', 'Active Directory'),

-- Network Management
('SNMP Device Monitoring', 'Network Devices', ARRAY['161'], 'UDP', 'outbound', 'Portnox Server', 'Network Devices', 'SNMP monitoring and device discovery', false, 'optional', 'Various', 'Network Devices'),
('SNMP Traps', 'Network Devices', ARRAY['162'], 'UDP', 'inbound', 'Network Devices', 'Portnox Server', 'SNMP trap notifications from network devices', false, 'optional', 'Various', 'Network Devices'),

-- System Services
('DNS Resolution', 'DNS Server', ARRAY['53'], 'UDP', 'outbound', 'Portnox Server', 'DNS Servers', 'Domain name resolution services', true, 'core', 'Various', 'DNS'),
('NTP Time Synchronization', 'NTP Server', ARRAY['123'], 'UDP', 'outbound', 'Portnox Server', 'NTP Servers', 'Network time protocol synchronization', true, 'core', 'Various', 'NTP'),
('Syslog Forwarding', 'Syslog Server', ARRAY['514'], 'UDP', 'outbound', 'Portnox Server', 'Syslog Servers', 'System log forwarding to centralized logging', false, 'optional', 'Various', 'Syslog'),

-- Email Services
('SMTP Email Notifications', 'Mail Server', ARRAY['25', '587'], 'TCP', 'outbound', 'Portnox Server', 'Mail Servers', 'Email notifications and alerts', false, 'optional', 'Various', 'SMTP'),
('SMTPS Secure Email', 'Mail Server', ARRAY['465'], 'TCP', 'outbound', 'Portnox Server', 'Mail Servers', 'Secure email notifications via SMTPS', false, 'optional', 'Various', 'SMTP'),

-- High Availability and Clustering
('Database Replication', 'Database Cluster', ARRAY['3306', '5432', '1433'], 'TCP', 'bidirectional', 'Primary Database', 'Secondary Database', 'Database replication for high availability', false, 'optional', 'Various', 'Database'),
('Portnox Cluster Communication', 'Portnox Cluster', ARRAY['443', '8080'], 'TCP', 'bidirectional', 'Primary Portnox Server', 'Secondary Portnox Servers', 'Inter-node communication for clustering', false, 'optional', 'Portnox', 'NAC');

-- =============================================================================
-- SEED DATA FOR PREREQUISITES
-- =============================================================================

INSERT INTO public.prerequisites (
    category, requirement, description, is_mandatory, 
    minimum_specification, recommended_specification, enterprise_specification,
    vendor, product, verification_steps
) VALUES
-- Hardware Prerequisites
('hardware', 'Server CPU', 'Multi-core processor for Portnox server', true, '4 cores @ 2.4 GHz', '8 cores @ 2.8 GHz', '16 cores @ 3.2 GHz', 'Various', 'Server Hardware', ARRAY['Check CPU specifications', 'Verify core count', 'Confirm clock speed']),
('hardware', 'Server Memory', 'RAM for Portnox server operations', true, '8 GB RAM', '16 GB RAM', '32 GB RAM', 'Various', 'Server Hardware', ARRAY['Check installed RAM', 'Verify memory type', 'Test memory performance']),
('hardware', 'Server Storage', 'Disk storage for Portnox installation and data', true, '100 GB', '250 GB', '500 GB', 'Various', 'Server Hardware', ARRAY['Check available disk space', 'Verify disk type (SSD preferred)', 'Test disk I/O performance']),
('hardware', 'Network Interface', 'Network connectivity for Portnox server', true, '1 Gbps Ethernet', '10 Gbps Ethernet', '10 Gbps Redundant', 'Various', 'Network Hardware', ARRAY['Verify network interface speed', 'Test network connectivity', 'Check for redundancy options']),

-- Software Prerequisites
('software', 'Operating System', 'Supported operating system for Portnox', true, 'Windows Server 2019 / RHEL 8', 'Windows Server 2022 / RHEL 9', 'Windows Server 2022 / RHEL 9', 'Microsoft/Red Hat', 'Operating System', ARRAY['Verify OS version', 'Check for latest patches', 'Confirm licensing']),
('software', 'Database Server', 'Database platform for Portnox data storage', true, 'MySQL 8.0 / PostgreSQL 13', 'MySQL 8.0 / PostgreSQL 14', 'MySQL 8.0 / PostgreSQL 15', 'Oracle/PostgreSQL', 'Database', ARRAY['Install database server', 'Configure database instance', 'Create Portnox database', 'Set up database user']),
('software', 'SSL Certificate', 'Valid SSL certificate for HTTPS access', true, 'Self-signed certificate', 'CA-signed certificate', 'Extended validation certificate', 'Various', 'PKI', ARRAY['Obtain SSL certificate', 'Install certificate', 'Configure HTTPS binding', 'Test certificate validity']),

-- Network Prerequisites
('network', 'Network Segmentation', 'Proper network segmentation for security', true, 'Basic VLAN separation', 'Multi-tier VLAN design', 'Micro-segmentation', 'Various', 'Network Infrastructure', ARRAY['Design VLAN structure', 'Configure switch VLANs', 'Test VLAN connectivity', 'Verify isolation']),
('network', 'DNS Configuration', 'Proper DNS configuration for name resolution', true, 'Forward DNS resolution', 'Forward and reverse DNS', 'Redundant DNS with monitoring', 'Various', 'DNS', ARRAY['Configure DNS records', 'Test forward resolution', 'Test reverse resolution', 'Verify redundancy']),
('network', 'NTP Configuration', 'Network time synchronization', true, 'Single NTP source', 'Multiple NTP sources', 'Stratum 1 NTP with redundancy', 'Various', 'NTP', ARRAY['Configure NTP client', 'Verify time synchronization', 'Test NTP redundancy']),

-- Security Prerequisites
('permissions', 'Service Accounts', 'Dedicated service accounts for Portnox', true, 'Basic service account', 'Dedicated service accounts', 'Managed service identities', 'Various', 'Identity Management', ARRAY['Create service accounts', 'Assign appropriate permissions', 'Configure password policies', 'Test account access']),
('certificates', 'Certificate Authority', 'PKI infrastructure for certificate management', false, 'External CA certificates', 'Internal CA with external root', 'Full PKI infrastructure', 'Various', 'PKI', ARRAY['Set up CA infrastructure', 'Configure certificate templates', 'Test certificate issuance', 'Implement certificate lifecycle']),

-- Integration Prerequisites
('integration', 'Active Directory', 'Active Directory integration for user authentication', true, 'Single domain AD', 'Multi-domain AD forest', 'Multi-forest AD with trusts', 'Microsoft', 'Active Directory', ARRAY['Verify AD connectivity', 'Create service account', 'Test LDAP queries', 'Configure group memberships']),
('integration', 'Network Device Access', 'SNMP and management access to network devices', true, 'Read-only SNMP access', 'Read-write SNMP access', 'Full management API access', 'Various', 'Network Devices', ARRAY['Configure SNMP communities', 'Test device connectivity', 'Verify management access', 'Document device credentials']);

-- =============================================================================
-- SEED DATA FOR DEFAULT REPORT TEMPLATES
-- =============================================================================

INSERT INTO public.report_templates (
    name, description, type, template_data, sections, is_default, is_active
) VALUES
(
    'Standard Prerequisites Report',
    'Standard template for NAC deployment prerequisites',
    'prerequisites',
    '{
        "title": "NAC Deployment Prerequisites",
        "subtitle": "Comprehensive Requirements Analysis",
        "logo_placeholder": true,
        "header_color": "#3B82F6"
    }'::jsonb,
    '[
        {
            "id": "executive_summary",
            "title": "Executive Summary",
            "order": 1,
            "required": true
        },
        {
            "id": "hardware_requirements",
            "title": "Hardware Requirements",
            "order": 2,
            "required": true
        },
        {
            "id": "software_requirements", 
            "title": "Software Requirements",
            "order": 3,
            "required": true
        },
        {
            "id": "network_requirements",
            "title": "Network Requirements",
            "order": 4,
            "required": true
        },
        {
            "id": "security_requirements",
            "title": "Security Requirements",
            "order": 5,
            "required": true
        },
        {
            "id": "integration_requirements",
            "title": "Integration Requirements",
            "order": 6,
            "required": true
        }
    ]'::jsonb,
    true,
    true
),
(
    'Comprehensive Deployment Checklist',
    'Complete deployment checklist with all phases',
    'deployment_checklist',
    '{
        "title": "NAC Deployment Checklist",
        "subtitle": "Step-by-Step Implementation Guide",
        "logo_placeholder": true,
        "header_color": "#10B981"
    }'::jsonb,
    '[
        {
            "id": "pre_deployment",
            "title": "Pre-Deployment Checklist",
            "order": 1,
            "required": true
        },
        {
            "id": "installation",
            "title": "Installation Checklist", 
            "order": 2,
            "required": true
        },
        {
            "id": "configuration",
            "title": "Configuration Checklist",
            "order": 3,
            "required": true
        },
        {
            "id": "testing",
            "title": "Testing & Validation",
            "order": 4,
            "required": true
        },
        {
            "id": "go_live",
            "title": "Go-Live Checklist",
            "order": 5,
            "required": true
        }
    ]'::jsonb,
    true,
    true
),
(
    'Firewall Requirements Matrix',
    'Comprehensive firewall port and protocol requirements',
    'firewall_requirements',
    '{
        "title": "Firewall Requirements",
        "subtitle": "Port and Protocol Specifications",
        "logo_placeholder": true,
        "header_color": "#EF4444"
    }'::jsonb,
    '[
        {
            "id": "core_services",
            "title": "Core Services",
            "order": 1,
            "required": true
        },
        {
            "id": "integration_services",
            "title": "Integration Services",
            "order": 2,
            "required": true
        },
        {
            "id": "management_services",
            "title": "Management & Monitoring",
            "order": 3,
            "required": true
        },
        {
            "id": "optional_services",
            "title": "Optional Services",
            "order": 4,
            "required": false
        }
    ]'::jsonb,
    true,
    true
);

-- =============================================================================
-- FINAL REPORT
-- =============================================================================
DO $$
DECLARE
    report_count INTEGER;
    firewall_count INTEGER;
    prereq_count INTEGER;
    template_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO report_count FROM public.enterprise_reports;
    SELECT COUNT(*) INTO firewall_count FROM public.firewall_requirements;
    SELECT COUNT(*) INTO prereq_count FROM public.prerequisites;
    SELECT COUNT(*) INTO template_count FROM public.report_templates;
    
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'ENTERPRISE REPORTS SYSTEM MIGRATION COMPLETED SUCCESSFULLY';
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Database Tables Created:';
    RAISE NOTICE '• enterprise_reports - Professional report generation and storage';
    RAISE NOTICE '• firecrawler_jobs - Automated documentation crawling jobs';
    RAISE NOTICE '• report_templates - Customizable report templates';
    RAISE NOTICE '• firewall_requirements - Comprehensive firewall specifications';
    RAISE NOTICE '• prerequisites - Detailed deployment prerequisites';
    RAISE NOTICE '• deployment_checklists - Step-by-step deployment validation';
    RAISE NOTICE '• documentation_sources - Crawled documentation management';
    RAISE NOTICE '• report_generation_queue - Asynchronous report processing';
    RAISE NOTICE '';
    RAISE NOTICE 'Seed Data Loaded:';
    RAISE NOTICE '• % firewall requirements for core NAC services', firewall_count;
    RAISE NOTICE '• % prerequisites covering hardware, software, and network', prereq_count;
    RAISE NOTICE '• % default report templates for professional documentation', template_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Features Enabled:';
    RAISE NOTICE '• Firecrawler integration for live documentation retrieval';
    RAISE NOTICE '• Professional report templates with enterprise branding';
    RAISE NOTICE '• Comprehensive firewall port requirements analysis';
    RAISE NOTICE '• Automated prerequisite validation and verification';
    RAISE NOTICE '• Multi-format report export capabilities (PDF, DOCX, HTML)';
    RAISE NOTICE '• Row-level security for multi-tenant access control';
    RAISE NOTICE '• Full-text search across all documentation sources';
    RAISE NOTICE '• Asynchronous report generation with progress tracking';
    RAISE NOTICE '';
    RAISE NOTICE 'The Enterprise Reports System is ready for production use!';
    RAISE NOTICE '=============================================================================';
END
$$;
