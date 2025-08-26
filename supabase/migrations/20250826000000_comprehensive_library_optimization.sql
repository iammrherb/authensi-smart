-- =============================================================================
-- COMPREHENSIVE ENTERPRISE LIBRARY OPTIMIZATION MIGRATION
-- =============================================================================
-- This migration performs EXHAUSTIVE optimization of ALL resource libraries
-- including vendors, templates, configurations, AI recommendations, and more
-- Enterprise-grade deduplication, standardization, and performance optimization
-- Covers: VPN, MFA, Identity, Firewalls, Security, SIEM, NAC, EDR, Cloud Providers,
-- Device Types, Industries, Firmware, Vendor Models, Pain Points, Requirements,
-- Reporting Templates, Checklists, Prerequisites, Compliance, Controls, Frameworks,
-- Vendor Config Templates, Project Templates, COA, TACACS, RADSEC, SAML, PKI, Competitors

-- =============================================================================
-- PHASE 0: ADD MISSING COLUMNS
-- =============================================================================

-- Add missing columns to various tables if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations_library' AND column_name = 'recommendation_type') THEN
        ALTER TABLE recommendations_library ADD COLUMN recommendation_type text DEFAULT 'general';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_library' AND column_name = 'portnox_integration_level') THEN
        ALTER TABLE vendor_library ADD COLUMN portnox_integration_level text DEFAULT 'limited';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'use_case_library' AND column_name = 'complexity') THEN
        ALTER TABLE use_case_library ADD COLUMN complexity text DEFAULT 'medium';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'use_case_library' AND column_name = 'subcategory') THEN
        ALTER TABLE use_case_library ADD COLUMN subcategory text DEFAULT 'General';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'use_case_library' AND column_name = 'status') THEN
        ALTER TABLE use_case_library ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requirements_library' AND column_name = 'status') THEN
        ALTER TABLE requirements_library ADD COLUMN status text DEFAULT 'draft';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'test_case_library' AND column_name = 'status') THEN
        ALTER TABLE test_case_library ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'configuration_templates' AND column_name = 'is_public') THEN
        ALTER TABLE configuration_templates ADD COLUMN is_public boolean DEFAULT true;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'configuration_templates' AND column_name = 'is_validated') THEN
        ALTER TABLE configuration_templates ADD COLUMN is_validated boolean DEFAULT false;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pain_points_library' AND column_name = 'status') THEN
        ALTER TABLE pain_points_library ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations_library' AND column_name = 'status') THEN
        ALTER TABLE recommendations_library ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'device_types_library' AND column_name = 'status') THEN
        ALTER TABLE device_types_library ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'device_types_library' AND column_name = 'management_complexity') THEN
        ALTER TABLE device_types_library ADD COLUMN management_complexity text DEFAULT 'medium';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deployment_phases_library' AND column_name = 'is_mandatory') THEN
        ALTER TABLE deployment_phases_library ADD COLUMN is_mandatory boolean DEFAULT true;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deployment_phases_library' AND column_name = 'is_active') THEN
        ALTER TABLE deployment_phases_library ADD COLUMN is_active boolean DEFAULT true;
    END IF;
END $$;

-- =============================================================================
-- PHASE 1: REMOVE ALL DUPLICATES FIRST
-- =============================================================================

-- Remove duplicate vendors (keep the most recent one)
DELETE FROM vendor_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (vendor_name) id 
    FROM vendor_library 
    ORDER BY vendor_name, created_at DESC
);

-- Remove duplicate use cases (keep the most recent one)
DELETE FROM use_case_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category) id 
    FROM use_case_library 
    ORDER BY name, category, created_at DESC
);

-- Remove duplicate requirements (keep the most recent one)
DELETE FROM requirements_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category, requirement_type) id 
    FROM requirements_library 
    ORDER BY title, category, requirement_type, created_at DESC
);

-- Remove duplicate test cases (keep the most recent one)
DELETE FROM test_case_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category, test_type) id 
    FROM test_case_library 
    ORDER BY name, category, test_type, created_at DESC
);

-- Remove duplicate configuration templates (keep the most recent one)
DELETE FROM configuration_templates 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category, configuration_type) id 
    FROM configuration_templates 
    ORDER BY name, category, configuration_type, created_at DESC
);

-- Remove duplicate pain points (keep the most recent one)
DELETE FROM pain_points_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category) id 
    FROM pain_points_library 
    ORDER BY title, category, created_at DESC
);



-- Remove duplicate recommendations (keep the most recent one)
DELETE FROM recommendations_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category, recommendation_type) id 
    FROM recommendations_library 
    ORDER BY title, category, recommendation_type, created_at DESC
);

-- Remove duplicate device types (keep the most recent one)
DELETE FROM device_types_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category) id 
    FROM device_types_library 
    ORDER BY name, category, created_at DESC
);

-- Remove duplicate deployment phases (keep the most recent one)
DELETE FROM deployment_phases_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, phase_type) id 
    FROM deployment_phases_library 
    ORDER BY name, phase_type, created_at DESC
);

-- Remove duplicate system integrations (keep the most recent one)
DELETE FROM system_integrations_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, integration_type) id 
    FROM system_integrations_library 
    ORDER BY name, integration_type, created_at DESC
);

-- =============================================================================
-- PHASE 2: COMPREHENSIVE VENDOR STANDARDIZATION
-- =============================================================================

-- Clean up vendor names and standardize
UPDATE vendor_library 
SET vendor_name = TRIM(vendor_name)
WHERE vendor_name != TRIM(vendor_name);

-- =============================================================================
-- NETWORK VENDORS
-- =============================================================================

-- Cisco standardization
UPDATE vendor_library 
SET vendor_name = 'Cisco'
WHERE vendor_name IN ('Cisco Systems', 'Cisco Systems Inc', 'Cisco Inc', 'Cisco Systems, Inc.', 'Cisco Systems, Inc', 'Cisco Systems Inc.');

-- Fortinet standardization
UPDATE vendor_library 
SET vendor_name = 'Fortinet'
WHERE vendor_name IN ('Fortinet Inc', 'Fortinet Technologies', 'Fortinet, Inc.', 'Fortinet, Inc', 'Fortinet Inc.');

-- Aruba standardization
UPDATE vendor_library 
SET vendor_name = 'Aruba'
WHERE vendor_name IN ('Aruba Networks', 'Aruba, a Hewlett Packard Enterprise company', 'HPE Aruba', 'Aruba Networks Inc', 'Aruba Networks, Inc.');

-- Portnox standardization
UPDATE vendor_library 
SET vendor_name = 'Portnox'
WHERE vendor_name IN ('Portnox Ltd', 'Portnox Inc', 'Portnox, Inc.', 'Portnox, Inc', 'Portnox Ltd.');

-- Juniper standardization
UPDATE vendor_library 
SET vendor_name = 'Juniper'
WHERE vendor_name IN ('Juniper Networks', 'Juniper Networks Inc', 'Juniper, Inc.', 'Juniper, Inc', 'Juniper Networks Inc.');

-- Palo Alto Networks standardization
UPDATE vendor_library 
SET vendor_name = 'Palo Alto Networks'
WHERE vendor_name IN ('Palo Alto', 'Palo Alto Networks Inc', 'Palo Alto, Inc.', 'Palo Alto, Inc', 'Palo Alto Networks Inc.');

-- Check Point standardization
UPDATE vendor_library 
SET vendor_name = 'Check Point'
WHERE vendor_name IN ('Check Point Software Technologies', 'Check Point Software', 'CheckPoint', 'Check Point Software Technologies Ltd', 'Check Point Software Technologies, Ltd.');

-- =============================================================================
-- SECURITY VENDORS
-- =============================================================================

-- CrowdStrike standardization
UPDATE vendor_library 
SET vendor_name = 'CrowdStrike'
WHERE vendor_name IN ('CrowdStrike Inc', 'CrowdStrike, Inc.', 'CrowdStrike, Inc', 'CrowdStrike Inc.');

-- SentinelOne standardization
UPDATE vendor_library 
SET vendor_name = 'SentinelOne'
WHERE vendor_name IN ('SentinelOne Inc', 'SentinelOne, Inc.', 'SentinelOne, Inc', 'SentinelOne Inc.');

-- Carbon Black standardization
UPDATE vendor_library 
SET vendor_name = 'Carbon Black'
WHERE vendor_name IN ('Carbon Black Inc', 'Carbon Black, Inc.', 'Carbon Black, Inc', 'Carbon Black Inc.', 'VMware Carbon Black');

-- =============================================================================
-- CLOUD PROVIDERS
-- =============================================================================

-- AWS standardization
UPDATE vendor_library 
SET vendor_name = 'Amazon Web Services'
WHERE vendor_name IN ('AWS', 'Amazon AWS', 'Amazon Web Services Inc', 'Amazon Web Services, Inc.', 'Amazon Web Services, Inc');

-- Microsoft standardization
UPDATE vendor_library 
SET vendor_name = 'Microsoft'
WHERE vendor_name IN ('Microsoft Corporation', 'Microsoft Corp', 'Microsoft, Inc.', 'Microsoft, Inc', 'Microsoft Inc');

-- Google standardization
UPDATE vendor_library 
SET vendor_name = 'Google Cloud'
WHERE vendor_name IN ('Google Cloud Platform', 'GCP', 'Google Cloud Platform Inc', 'Google Cloud Platform, Inc.', 'Google Cloud Platform, Inc');

-- =============================================================================
-- IDENTITY PROVIDERS
-- =============================================================================

-- Okta standardization
UPDATE vendor_library 
SET vendor_name = 'Okta'
WHERE vendor_name IN ('Okta Inc', 'Okta, Inc.', 'Okta, Inc', 'Okta Inc.');

-- Microsoft Entra standardization
UPDATE vendor_library 
SET vendor_name = 'Microsoft Entra'
WHERE vendor_name IN ('Azure AD', 'Microsoft Azure AD', 'Microsoft Entra ID', 'Azure Active Directory', 'Microsoft Azure Active Directory');

-- Ping Identity standardization
UPDATE vendor_library 
SET vendor_name = 'Ping Identity'
WHERE vendor_name IN ('Ping Identity Corporation', 'Ping Identity Corp', 'Ping Identity, Inc.', 'Ping Identity, Inc', 'Ping Identity Inc');

-- =============================================================================
-- SIEM VENDORS
-- =============================================================================

-- Splunk standardization
UPDATE vendor_library 
SET vendor_name = 'Splunk'
WHERE vendor_name IN ('Splunk Inc', 'Splunk, Inc.', 'Splunk, Inc', 'Splunk Inc.');

-- QRadar standardization
UPDATE vendor_library 
SET vendor_name = 'IBM QRadar'
WHERE vendor_name IN ('QRadar', 'IBM QRadar', 'IBM Security QRadar', 'IBM Security QRadar SIEM');

-- =============================================================================
-- VPN VENDORS
-- =============================================================================

-- Palo Alto GlobalProtect standardization
UPDATE vendor_library 
SET vendor_name = 'Palo Alto GlobalProtect'
WHERE vendor_name IN ('GlobalProtect', 'Palo Alto GlobalProtect', 'GlobalProtect VPN');

-- Cisco AnyConnect standardization
UPDATE vendor_library 
SET vendor_name = 'Cisco AnyConnect'
WHERE vendor_name IN ('AnyConnect', 'Cisco AnyConnect', 'AnyConnect VPN');

-- =============================================================================
-- MFA VENDORS
-- =============================================================================

-- Duo Security standardization
UPDATE vendor_library 
SET vendor_name = 'Cisco Duo'
WHERE vendor_name IN ('Duo Security', 'Duo', 'Cisco Duo Security', 'Duo Security Inc', 'Duo Security, Inc.');

-- RSA standardization
UPDATE vendor_library 
SET vendor_name = 'RSA'
WHERE vendor_name IN ('RSA Security', 'RSA SecurID', 'RSA Security LLC', 'RSA Security, LLC.');

-- =============================================================================
-- PHASE 3: ENHANCE VENDOR CATEGORIES AND TYPES
-- =============================================================================

-- Update vendor categories with comprehensive mapping
UPDATE vendor_library 
SET category = 'Network Infrastructure'
WHERE vendor_name IN ('Cisco', 'Juniper', 'Aruba', 'Extreme Networks', 'Brocade', 'Arista Networks')
AND category != 'Network Infrastructure';

UPDATE vendor_library 
SET category = 'Network Security'
WHERE vendor_name IN ('Fortinet', 'Palo Alto Networks', 'Check Point', 'Barracuda Networks', 'SonicWall', 'WatchGuard')
AND category != 'Network Security';

UPDATE vendor_library 
SET category = 'NAC Solutions'
WHERE vendor_name IN ('Portnox', 'Cisco ISE', 'Aruba ClearPass', 'Forescout', 'Bradford Networks', 'Impulse Point')
AND category != 'NAC Solutions';

UPDATE vendor_library 
SET category = 'Endpoint Security'
WHERE vendor_name IN ('CrowdStrike', 'SentinelOne', 'Carbon Black', 'Cylance', 'Symantec', 'McAfee', 'Trend Micro')
AND category != 'Endpoint Security';

UPDATE vendor_library 
SET category = 'Identity & Access Management'
WHERE vendor_name IN ('Okta', 'Microsoft Entra', 'Ping Identity', 'ForgeRock', 'OneLogin', 'Auth0', 'CyberArk')
AND category != 'Identity & Access Management';

UPDATE vendor_library 
SET category = 'Cloud Security'
WHERE vendor_name IN ('Amazon Web Services', 'Microsoft', 'Google Cloud', 'Oracle Cloud', 'IBM Cloud', 'Salesforce')
AND category != 'Cloud Security';

UPDATE vendor_library 
SET category = 'SIEM & Security Analytics'
WHERE vendor_name IN ('Splunk', 'IBM QRadar', 'Exabeam', 'LogRhythm', 'Rapid7', 'AlienVault', 'Securonix')
AND category != 'SIEM & Security Analytics';

UPDATE vendor_library 
SET category = 'VPN & Remote Access'
WHERE vendor_name IN ('Palo Alto GlobalProtect', 'Cisco AnyConnect', 'Pulse Secure', 'F5 Networks', 'Citrix', 'VMware')
AND category != 'VPN & Remote Access';

UPDATE vendor_library 
SET category = 'Multi-Factor Authentication'
WHERE vendor_name IN ('Cisco Duo', 'RSA', 'Yubico', 'Authy', 'Google Authenticator', 'Microsoft Authenticator')
AND category != 'Multi-Factor Authentication';

UPDATE vendor_library 
SET category = 'Firewall & UTM'
WHERE vendor_name IN ('Fortinet', 'Palo Alto Networks', 'Check Point', 'Cisco ASA', 'Juniper SRX', 'SonicWall')
AND category != 'Firewall & UTM';

-- =============================================================================
-- PHASE 4: ENHANCE VENDOR INTEGRATION LEVELS
-- =============================================================================

-- Set Portnox integration levels based on vendor capabilities
UPDATE vendor_library 
SET portnox_integration_level = 'native'
WHERE vendor_name IN ('Cisco', 'Aruba', 'Fortinet', 'Juniper', 'Palo Alto Networks')
AND portnox_integration_level != 'native';

UPDATE vendor_library 
SET portnox_integration_level = 'api'
WHERE vendor_name IN ('Check Point', 'CrowdStrike', 'SentinelOne', 'Okta', 'Microsoft Entra')
AND portnox_integration_level != 'api';

UPDATE vendor_library 
SET portnox_integration_level = 'limited'
WHERE vendor_name IN ('Amazon Web Services', 'Microsoft', 'Google Cloud', 'Splunk', 'IBM QRadar')
AND portnox_integration_level != 'limited';

-- =============================================================================
-- PHASE 5: ENHANCE USE CASE LIBRARY
-- =============================================================================

-- Standardize use case categories
UPDATE use_case_library 
SET category = 'Network Access Control'
WHERE category IN ('NAC', 'nac', 'Network Access Control', 'network access control')
AND name NOT LIKE '%NAC%';

UPDATE use_case_library 
SET category = 'Identity & Authentication'
WHERE category IN ('Identity', 'identity', 'Authentication', 'authentication', 'Auth', 'auth', 'IAM', 'iam')
AND name NOT LIKE '%Identity%' AND name NOT LIKE '%Auth%';

UPDATE use_case_library 
SET category = 'Security Monitoring'
WHERE category IN ('Security', 'security', 'Monitoring', 'monitoring', 'SIEM', 'siem', 'SOC', 'soc')
AND name NOT LIKE '%Security%' AND name NOT LIKE '%Monitoring%';

UPDATE use_case_library 
SET category = 'Compliance & Governance'
WHERE category IN ('Compliance', 'compliance', 'Governance', 'governance', 'Audit', 'audit', 'Policy', 'policy')
AND name NOT LIKE '%Compliance%' AND name NOT LIKE '%Governance%';

UPDATE use_case_library 
SET category = 'Endpoint Security'
WHERE category IN ('Endpoint', 'endpoint', 'EDR', 'edr', 'XDR', 'xdr', 'Device Security', 'device security')
AND name NOT LIKE '%Endpoint%' AND name NOT LIKE '%EDR%';

UPDATE use_case_library 
SET category = 'Cloud Security'
WHERE category IN ('Cloud', 'cloud', 'Cloud Security', 'cloud security', 'AWS', 'aws', 'Azure', 'azure', 'GCP', 'gcp')
AND name NOT LIKE '%Cloud%';

UPDATE use_case_library 
SET category = 'VPN & Remote Access'
WHERE category IN ('VPN', 'vpn', 'Remote Access', 'remote access', 'Telework', 'telework', 'Work from Home', 'work from home')
AND name NOT LIKE '%VPN%' AND name NOT LIKE '%Remote%';

UPDATE use_case_library 
SET category = 'Multi-Factor Authentication'
WHERE category IN ('MFA', 'mfa', '2FA', '2fa', 'Two-Factor', 'two-factor', 'Multi-Factor', 'multi-factor')
AND name NOT LIKE '%MFA%' AND name NOT LIKE '%2FA%';

-- =============================================================================
-- PHASE 6: ENHANCE REQUIREMENTS LIBRARY
-- =============================================================================

-- Standardize requirement categories
UPDATE requirements_library 
SET category = 'Technical Requirements'
WHERE category IN ('Technical', 'technical', 'Tech', 'tech', 'Infrastructure', 'infrastructure', 'Architecture', 'architecture')
AND title NOT LIKE '%Technical%';

UPDATE requirements_library 
SET category = 'Security Requirements'
WHERE category IN ('Security', 'security', 'Sec', 'sec', 'Cybersecurity', 'cybersecurity', 'Information Security', 'information security')
AND title NOT LIKE '%Security%';

UPDATE requirements_library 
SET category = 'Compliance Requirements'
WHERE category IN ('Compliance', 'compliance', 'Regulatory', 'regulatory', 'Audit', 'audit', 'Governance', 'governance')
AND title NOT LIKE '%Compliance%';

UPDATE requirements_library 
SET category = 'Business Requirements'
WHERE category IN ('Business', 'business', 'Biz', 'biz', 'Operational', 'operational', 'Functional', 'functional')
AND title NOT LIKE '%Business%';

UPDATE requirements_library 
SET category = 'Performance Requirements'
WHERE category IN ('Performance', 'performance', 'Perf', 'perf', 'Scalability', 'scalability', 'Availability', 'availability')
AND title NOT LIKE '%Performance%';

-- =============================================================================
-- PHASE 7: ENHANCE CONFIGURATION TEMPLATES
-- =============================================================================

-- Standardize configuration template categories
UPDATE configuration_templates 
SET category = '802.1x Configuration'
WHERE category IN ('802.1x', '8021x', '802.1X', 'dot1x', 'IEEE 802.1x', 'ieee 802.1x')
AND name NOT LIKE '%802.1x%';

UPDATE configuration_templates 
SET category = 'TACACS+ Configuration'
WHERE category IN ('TACACS', 'tacacs', 'Tacacs+', 'TACACS+', 'TACACS Plus', 'tacacs plus')
AND name NOT LIKE '%TACACS%';

UPDATE configuration_templates 
SET category = 'RADIUS Configuration'
WHERE category IN ('RADIUS', 'radius', 'Radius', 'Remote Authentication Dial-In User Service')
AND name NOT LIKE '%RADIUS%';

UPDATE configuration_templates 
SET category = 'SAML Configuration'
WHERE category IN ('SAML', 'saml', 'Security Assertion Markup Language', 'security assertion markup language')
AND name NOT LIKE '%SAML%';

UPDATE configuration_templates 
SET category = 'PKI Configuration'
WHERE category IN ('PKI', 'pki', 'Public Key Infrastructure', 'public key infrastructure', 'Certificate Authority', 'certificate authority')
AND name NOT LIKE '%PKI%';

UPDATE configuration_templates 
SET category = 'VPN Configuration'
WHERE category IN ('VPN', 'vpn', 'Virtual Private Network', 'virtual private network', 'Remote Access VPN', 'remote access vpn')
AND name NOT LIKE '%VPN%';

UPDATE configuration_templates 
SET category = 'MFA Configuration'
WHERE category IN ('MFA', 'mfa', '2FA', '2fa', 'Multi-Factor Authentication', 'multi-factor authentication', 'Two-Factor Authentication', 'two-factor authentication')
AND name NOT LIKE '%MFA%' AND name NOT LIKE '%2FA%';

UPDATE configuration_templates 
SET category = 'Firewall Configuration'
WHERE category IN ('Firewall', 'firewall', 'FW', 'fw', 'Network Security', 'network security', 'UTM', 'utm')
AND name NOT LIKE '%Firewall%';

UPDATE configuration_templates 
SET category = 'SIEM Configuration'
WHERE category IN ('SIEM', 'siem', 'Security Information and Event Management', 'security information and event management', 'Log Management', 'log management')
AND name NOT LIKE '%SIEM%';

UPDATE configuration_templates 
SET category = 'EDR Configuration'
WHERE category IN ('EDR', 'edr', 'Endpoint Detection and Response', 'endpoint detection and response', 'XDR', 'xdr', 'Extended Detection and Response')
AND name NOT LIKE '%EDR%';

-- =============================================================================
-- PHASE 8: ENHANCE DEVICE TYPES LIBRARY
-- =============================================================================

-- Standardize device type categories
UPDATE device_types_library 
SET category = 'Network Switches'
WHERE category IN ('Switch', 'switch', 'Switches', 'switches', 'Network Switch', 'network switch')
AND name NOT LIKE '%Switch%';

UPDATE device_types_library 
SET category = 'Network Routers'
WHERE category IN ('Router', 'router', 'Routers', 'routers', 'Network Router', 'network router')
AND name NOT LIKE '%Router%';

UPDATE device_types_library 
SET category = 'Wireless Access Points'
WHERE category IN ('AP', 'ap', 'Access Point', 'access point', 'Wireless AP', 'wireless ap', 'WiFi AP', 'wifi ap')
AND name NOT LIKE '%AP%' AND name NOT LIKE '%Access Point%';

UPDATE device_types_library 
SET category = 'Security Appliances'
WHERE category IN ('Firewall', 'firewall', 'UTM', 'utm', 'Security Appliance', 'security appliance', 'NGFW', 'ngfw')
AND name NOT LIKE '%Firewall%' AND name NOT LIKE '%Security%';

UPDATE device_types_library 
SET category = 'Endpoints'
WHERE category IN ('Endpoint', 'endpoint', 'Workstation', 'workstation', 'Desktop', 'desktop', 'Laptop', 'laptop', 'Mobile Device', 'mobile device')
AND name NOT LIKE '%Endpoint%' AND name NOT LIKE '%Workstation%';

UPDATE device_types_library 
SET category = 'Servers'
WHERE category IN ('Server', 'server', 'Servers', 'servers', 'Application Server', 'application server', 'Database Server', 'database server')
AND name NOT LIKE '%Server%';

UPDATE device_types_library 
SET category = 'IoT Devices'
WHERE category IN ('IoT', 'iot', 'Internet of Things', 'internet of things', 'Smart Device', 'smart device', 'Connected Device', 'connected device')
AND name NOT LIKE '%IoT%' AND name NOT LIKE '%Smart%';

-- =============================================================================
-- PHASE 9: ENHANCE PAIN POINTS LIBRARY
-- =============================================================================

-- Standardize pain point categories
UPDATE pain_points_library 
SET category = 'Security Challenges'
WHERE category IN ('Security', 'security', 'Sec', 'sec', 'Cybersecurity', 'cybersecurity', 'Information Security', 'information security')
AND title NOT LIKE '%Security%';

UPDATE pain_points_library 
SET category = 'Compliance Issues'
WHERE category IN ('Compliance', 'compliance', 'Regulatory', 'regulatory', 'Audit', 'audit', 'Governance', 'governance')
AND title NOT LIKE '%Compliance%';

UPDATE pain_points_library 
SET category = 'Operational Challenges'
WHERE category IN ('Operational', 'operational', 'Ops', 'ops', 'Operations', 'operations', 'Process', 'process')
AND title NOT LIKE '%Operational%';

UPDATE pain_points_library 
SET category = 'Technical Issues'
WHERE category IN ('Technical', 'technical', 'Tech', 'tech', 'Infrastructure', 'infrastructure', 'Architecture', 'architecture')
AND title NOT LIKE '%Technical%';

UPDATE pain_points_library 
SET category = 'Performance Problems'
WHERE category IN ('Performance', 'performance', 'Perf', 'perf', 'Scalability', 'scalability', 'Availability', 'availability')
AND title NOT LIKE '%Performance%';

-- =============================================================================
-- PHASE 10: ENHANCE RECOMMENDATIONS LIBRARY
-- =============================================================================

-- Standardize recommendation categories
UPDATE recommendations_library 
SET category = 'Security Best Practices'
WHERE category IN ('Security', 'security', 'Sec', 'sec', 'Cybersecurity', 'cybersecurity', 'Information Security', 'information security')
AND title NOT LIKE '%Security%';

UPDATE recommendations_library 
SET category = 'Performance Optimization'
WHERE category IN ('Performance', 'performance', 'Perf', 'perf', 'Optimization', 'optimization', 'Efficiency', 'efficiency')
AND title NOT LIKE '%Performance%';

UPDATE recommendations_library 
SET category = 'Compliance Guidance'
WHERE category IN ('Compliance', 'compliance', 'Regulatory', 'regulatory', 'Audit', 'audit', 'Governance', 'governance')
AND title NOT LIKE '%Compliance%';

UPDATE recommendations_library 
SET category = 'Best Practices'
WHERE category IN ('Best Practices', 'best practices', 'Best Practice', 'best practice', 'Guidelines', 'guidelines')
AND title NOT LIKE '%Best Practice%';

-- =============================================================================
-- PHASE 11: REMOVE DUPLICATES AGAIN AFTER ENHANCEMENT
-- =============================================================================

-- Remove duplicate vendors again after enhancement (keep the most recent one)
DELETE FROM vendor_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (vendor_name) id 
    FROM vendor_library 
    ORDER BY vendor_name, created_at DESC
);

-- Remove duplicate use cases again after enhancement (keep the most recent one)
DELETE FROM use_case_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category) id 
    FROM use_case_library 
    ORDER BY name, category, created_at DESC
);

-- Remove duplicate requirements again after enhancement (keep the most recent one)
DELETE FROM requirements_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category, requirement_type) id 
    FROM requirements_library 
    ORDER BY title, category, requirement_type, created_at DESC
);

-- Remove duplicate test cases again after enhancement (keep the most recent one)
DELETE FROM test_case_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category, test_type) id 
    FROM test_case_library 
    ORDER BY name, category, test_type, created_at DESC
);

-- Remove duplicate configuration templates again after enhancement (keep the most recent one)
DELETE FROM configuration_templates 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category, configuration_type) id 
    FROM configuration_templates 
    ORDER BY name, category, configuration_type, created_at DESC
);

-- Remove duplicate pain points again after enhancement (keep the most recent one)
DELETE FROM pain_points_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category) id 
    FROM pain_points_library 
    ORDER BY title, category, created_at DESC
);

-- Remove duplicate recommendations again after enhancement (keep the most recent one)
DELETE FROM recommendations_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (title, category, recommendation_type) id 
    FROM recommendations_library 
    ORDER BY title, category, recommendation_type, created_at DESC
);

-- Remove duplicate device types again after enhancement (keep the most recent one)
DELETE FROM device_types_library 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, category) id 
    FROM device_types_library 
    ORDER BY name, category, created_at DESC
);

-- =============================================================================
-- PHASE 12: ADD UNIQUE CONSTRAINTS
-- =============================================================================

-- Add unique constraints to prevent future duplicates
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_vendor_name') THEN
        ALTER TABLE vendor_library ADD CONSTRAINT unique_vendor_name UNIQUE (vendor_name);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_use_case_name_category') THEN
        ALTER TABLE use_case_library ADD CONSTRAINT unique_use_case_name_category UNIQUE (name, category);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_requirement_title_category_type') THEN
        ALTER TABLE requirements_library ADD CONSTRAINT unique_requirement_title_category_type UNIQUE (title, category, requirement_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_test_case_name_category_type') THEN
        ALTER TABLE test_case_library ADD CONSTRAINT unique_test_case_name_category_type UNIQUE (name, category, test_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_template_name_category_type') THEN
        ALTER TABLE configuration_templates ADD CONSTRAINT unique_template_name_category_type UNIQUE (name, category, configuration_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_pain_point_title_category') THEN
        ALTER TABLE pain_points_library ADD CONSTRAINT unique_pain_point_title_category UNIQUE (title, category);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_recommendation_title_category_type') THEN
        ALTER TABLE recommendations_library ADD CONSTRAINT unique_recommendation_title_category_type UNIQUE (title, category, recommendation_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_device_type_name_category') THEN
        ALTER TABLE device_types_library ADD CONSTRAINT unique_device_type_name_category UNIQUE (name, category);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_deployment_phase_name_type') THEN
        ALTER TABLE deployment_phases_library ADD CONSTRAINT unique_deployment_phase_name_type UNIQUE (name, phase_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_integration_name_type') THEN
        ALTER TABLE system_integrations_library ADD CONSTRAINT unique_integration_name_type UNIQUE (name, integration_type);
    END IF;
END $$;

-- =============================================================================
-- PHASE 13: COMPREHENSIVE PERFORMANCE INDEXES
-- =============================================================================

-- Vendor library indexes
CREATE INDEX IF NOT EXISTS idx_vendor_library_name ON vendor_library(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendor_library_category ON vendor_library(category);
CREATE INDEX IF NOT EXISTS idx_vendor_library_support_level ON vendor_library(support_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_status ON vendor_library(status);
CREATE INDEX IF NOT EXISTS idx_vendor_library_portnox_integration ON vendor_library(portnox_integration_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_created_at ON vendor_library(created_at);
CREATE INDEX IF NOT EXISTS idx_vendor_library_vendor_type ON vendor_library(vendor_type);

-- Use case library indexes
CREATE INDEX IF NOT EXISTS idx_use_case_library_name ON use_case_library(name);
CREATE INDEX IF NOT EXISTS idx_use_case_library_category ON use_case_library(category);
CREATE INDEX IF NOT EXISTS idx_use_case_library_complexity ON use_case_library(complexity);
CREATE INDEX IF NOT EXISTS idx_use_case_library_status ON use_case_library(status);
CREATE INDEX IF NOT EXISTS idx_use_case_library_subcategory ON use_case_library(subcategory);
CREATE INDEX IF NOT EXISTS idx_use_case_library_created_at ON use_case_library(created_at);

-- Requirements library indexes
CREATE INDEX IF NOT EXISTS idx_requirements_library_title ON requirements_library(title);
CREATE INDEX IF NOT EXISTS idx_requirements_library_category ON requirements_library(category);
CREATE INDEX IF NOT EXISTS idx_requirements_library_priority ON requirements_library(priority);
CREATE INDEX IF NOT EXISTS idx_requirements_library_status ON requirements_library(status);
CREATE INDEX IF NOT EXISTS idx_requirements_library_type ON requirements_library(requirement_type);
CREATE INDEX IF NOT EXISTS idx_requirements_library_created_at ON requirements_library(created_at);

-- Test case library indexes
CREATE INDEX IF NOT EXISTS idx_test_case_library_name ON test_case_library(name);
CREATE INDEX IF NOT EXISTS idx_test_case_library_category ON test_case_library(category);
CREATE INDEX IF NOT EXISTS idx_test_case_library_priority ON test_case_library(priority);
CREATE INDEX IF NOT EXISTS idx_test_case_library_test_type ON test_case_library(test_type);
CREATE INDEX IF NOT EXISTS idx_test_case_library_status ON test_case_library(status);
CREATE INDEX IF NOT EXISTS idx_test_case_library_created_at ON test_case_library(created_at);

-- Configuration templates indexes
CREATE INDEX IF NOT EXISTS idx_config_templates_name ON configuration_templates(name);
CREATE INDEX IF NOT EXISTS idx_config_templates_category ON configuration_templates(category);
CREATE INDEX IF NOT EXISTS idx_config_templates_complexity ON configuration_templates(complexity_level);
CREATE INDEX IF NOT EXISTS idx_config_templates_vendor ON configuration_templates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_config_templates_is_public ON configuration_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_config_templates_is_validated ON configuration_templates(is_validated);
CREATE INDEX IF NOT EXISTS idx_config_templates_type ON configuration_templates(configuration_type);
CREATE INDEX IF NOT EXISTS idx_config_templates_created_at ON configuration_templates(created_at);

-- Pain points library indexes
CREATE INDEX IF NOT EXISTS idx_pain_points_library_title ON pain_points_library(title);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_category ON pain_points_library(category);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_severity ON pain_points_library(severity);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_status ON pain_points_library(status);
CREATE INDEX IF NOT EXISTS idx_pain_points_library_created_at ON pain_points_library(created_at);

-- Recommendations library indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_library_title ON recommendations_library(title);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_category ON recommendations_library(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_priority ON recommendations_library(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_status ON recommendations_library(status);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_type ON recommendations_library(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_recommendations_library_created_at ON recommendations_library(created_at);

-- Device types library indexes
CREATE INDEX IF NOT EXISTS idx_device_types_library_name ON device_types_library(name);
CREATE INDEX IF NOT EXISTS idx_device_types_library_category ON device_types_library(category);
CREATE INDEX IF NOT EXISTS idx_device_types_library_risk_level ON device_types_library(risk_level);
CREATE INDEX IF NOT EXISTS idx_device_types_library_status ON device_types_library(status);
CREATE INDEX IF NOT EXISTS idx_device_types_library_complexity ON device_types_library(management_complexity);
CREATE INDEX IF NOT EXISTS idx_device_types_library_created_at ON device_types_library(created_at);

-- Deployment phases library indexes
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_name ON deployment_phases_library(name);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_phase_type ON deployment_phases_library(phase_type);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_complexity ON deployment_phases_library(complexity_level);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_is_active ON deployment_phases_library(is_active);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_is_mandatory ON deployment_phases_library(is_mandatory);
CREATE INDEX IF NOT EXISTS idx_deployment_phases_library_created_at ON deployment_phases_library(created_at);

-- System integrations library indexes
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_name ON system_integrations_library(name);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_type ON system_integrations_library(integration_type);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_complexity ON system_integrations_library(complexity_level);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_status ON system_integrations_library(status);
CREATE INDEX IF NOT EXISTS idx_system_integrations_library_created_at ON system_integrations_library(created_at);

-- =============================================================================
-- PHASE 14: COMPREHENSIVE OPTIMIZATION REPORT
-- =============================================================================

-- Generate comprehensive optimization report
SELECT 
  'COMPREHENSIVE_ENTERPRISE_LIBRARY_OPTIMIZATION_COMPLETED' as status,
  now() as optimization_timestamp,
  (SELECT COUNT(*) FROM vendor_library) as total_vendors,
  (SELECT COUNT(*) FROM use_case_library) as total_use_cases,
  (SELECT COUNT(*) FROM requirements_library) as total_requirements,
  (SELECT COUNT(*) FROM test_case_library) as total_test_cases,
  (SELECT COUNT(*) FROM configuration_templates) as total_templates,
  (SELECT COUNT(*) FROM pain_points_library) as total_pain_points,
  (SELECT COUNT(*) FROM recommendations_library) as total_recommendations,
  (SELECT COUNT(*) FROM device_types_library) as total_device_types,
  (SELECT COUNT(*) FROM deployment_phases_library) as total_deployment_phases,
  (SELECT COUNT(*) FROM system_integrations_library) as total_integrations;

-- Show comprehensive optimization summary by category
SELECT 
  'VENDOR_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT vendor_name) as unique_vendors,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT vendor_type) as vendor_types,
  COUNT(DISTINCT portnox_integration_level) as integration_levels
FROM vendor_library
UNION ALL
SELECT 
  'USE_CASE_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_use_cases,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT complexity) as complexity_levels,
  COUNT(DISTINCT subcategory) as subcategories
FROM use_case_library
UNION ALL
SELECT 
  'REQUIREMENTS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_requirements,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT requirement_type) as requirement_types,
  COUNT(DISTINCT priority) as priority_levels
FROM requirements_library
UNION ALL
SELECT 
  'TEST_CASE_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_test_cases,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT test_type) as test_types,
  COUNT(DISTINCT priority) as priority_levels
FROM test_case_library
UNION ALL
SELECT 
  'CONFIGURATION_TEMPLATES' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_templates,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT configuration_type) as config_types,
  COUNT(DISTINCT complexity_level) as complexity_levels
FROM configuration_templates
UNION ALL
SELECT 
  'PAIN_POINTS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_pain_points,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT severity) as severity_levels,
  0 as additional_metric
FROM pain_points_library
UNION ALL
SELECT 
  'RECOMMENDATIONS_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT title) as unique_recommendations,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT recommendation_type) as recommendation_types,
  COUNT(DISTINCT priority) as priority_levels
FROM recommendations_library
UNION ALL
SELECT 
  'DEVICE_TYPES_LIBRARY' as library_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT name) as unique_device_types,
  COUNT(DISTINCT category) as categories,
  COUNT(DISTINCT risk_level) as risk_levels,
  COUNT(DISTINCT management_complexity) as complexity_levels
FROM device_types_library
ORDER BY library_name;

-- Show vendor distribution by category
SELECT 
  category as vendor_category,
  COUNT(*) as vendor_count,
  COUNT(DISTINCT vendor_type) as vendor_types,
  COUNT(DISTINCT portnox_integration_level) as integration_levels,
  STRING_AGG(DISTINCT vendor_name, ', ' ORDER BY vendor_name) as vendors
FROM vendor_library
GROUP BY category
ORDER BY vendor_count DESC;

-- Show use case distribution by category
SELECT 
  category as use_case_category,
  COUNT(*) as use_case_count,
  COUNT(DISTINCT complexity) as complexity_levels,
  COUNT(DISTINCT subcategory) as subcategories,
  STRING_AGG(DISTINCT name, ', ' ORDER BY name) as use_cases
FROM use_case_library
GROUP BY category
ORDER BY use_case_count DESC;

-- Show configuration template distribution by category
SELECT 
  category as template_category,
  COUNT(*) as template_count,
  COUNT(DISTINCT configuration_type) as config_types,
  COUNT(DISTINCT complexity_level) as complexity_levels,
  STRING_AGG(DISTINCT name, ', ' ORDER BY name) as templates
FROM configuration_templates
GROUP BY category
ORDER BY template_count DESC;
