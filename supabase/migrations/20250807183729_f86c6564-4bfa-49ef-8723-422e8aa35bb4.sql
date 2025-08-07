-- Fix configuration templates and add comprehensive vendor data safely
-- Remove foreign key constraint temporarily to clean up duplicates
ALTER TABLE configuration_templates DROP CONSTRAINT IF EXISTS fk_configuration_templates_vendor;

-- Clean up duplicate vendors more safely
WITH duplicates AS (
    SELECT vendor_name, MIN(id) as keep_id
    FROM vendor_library 
    GROUP BY vendor_name 
    HAVING COUNT(*) > 1
)
UPDATE configuration_templates 
SET vendor_id = NULL 
WHERE vendor_id IN (
    SELECT v.id 
    FROM vendor_library v
    JOIN duplicates d ON v.vendor_name = d.vendor_name
    WHERE v.id != d.keep_id
);

-- Now delete duplicates
DELETE FROM vendor_library 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM vendor_library 
    GROUP BY vendor_name
);

-- Add constraint for unique vendor names
ALTER TABLE vendor_library ADD CONSTRAINT unique_vendor_name UNIQUE (vendor_name);

-- Update existing vendors with better categories
UPDATE vendor_library SET 
    category = 'EDR',
    vendor_type = 'Security'
WHERE vendor_name IN ('CrowdStrike', 'SentinelOne', 'Cybereason');

UPDATE vendor_library SET 
    category = 'SIEM',
    vendor_type = 'Security'
WHERE vendor_name IN ('Splunk', 'IBM QRadar', 'LogRhythm');

UPDATE vendor_library SET 
    category = 'Identity Provider',
    vendor_type = 'Identity'
WHERE vendor_name IN ('Okta', 'Azure Active Directory', 'Ping Identity');

UPDATE vendor_library SET 
    category = 'VPN/SASE',
    vendor_type = 'Security'
WHERE vendor_name IN ('Zscaler', 'Prisma Access');

UPDATE vendor_library SET 
    category = 'Cloud Platform',
    vendor_type = 'Cloud'
WHERE vendor_name IN ('Amazon Web Services', 'Microsoft Azure', 'Google Cloud Platform');

-- Add missing vendors safely
INSERT INTO vendor_library (vendor_name, vendor_type, category, models, supported_protocols, integration_methods, portnox_compatibility, configuration_templates, known_limitations, firmware_requirements, documentation_links, support_level, status) 
SELECT * FROM (VALUES
-- EDR Vendors
('CrowdStrike', 'Security', 'EDR', '["Falcon Endpoint Protection", "Falcon Prevent", "Falcon Insight", "Falcon OverWatch"]', '["API", "Webhook", "Syslog"]', '["REST API", "GraphQL", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-25"}', '{}', '[]', '{"minimum_version": "6.45"}', '["https://falcon.crowdstrike.com/documentation"]', 'full', 'active'),
('SentinelOne', 'Security', 'EDR', '["Singularity Platform", "Ranger", "Vigilance", "ActiveEDR"]', '["API", "Webhook", "Syslog"]', '["REST API", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-22"}', '{}', '[]', '{"minimum_version": "22.3.3"}', '["https://docs.sentinelone.com"]', 'full', 'active'),
-- SIEM Vendors  
('Splunk', 'Security', 'SIEM', '["Enterprise Security", "SOAR", "Phantom", "UBA"]', '["Syslog", "API", "Forwarder"]', '["Universal Forwarder", "REST API", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-28"}', '{}', '[]', '{"minimum_version": "9.0"}', '["https://docs.splunk.com"]', 'full', 'active'),
('IBM QRadar', 'Security', 'SIEM', '["SIEM", "UEBA", "SOAR", "Risk Manager"]', '["Syslog", "SNMP", "API"]', '["DSM", "REST API", "Protocol Integration"]', '{"integration_level": "full", "last_tested": "2024-01-26"}', '{}', '[]', '{"minimum_version": "7.5.0"}', '["https://www.ibm.com/docs/en/qradar-siem"]', 'full', 'active'),
-- Identity Providers
('Okta', 'Identity', 'Identity Provider', '["Universal Directory", "SSO", "MFA", "Lifecycle Management"]', '["SAML", "OIDC", "SCIM", "RADIUS"]', '["API", "SAML Federation", "SCIM Provisioning"]', '{"integration_level": "full", "last_tested": "2024-01-30"}', '{}', '[]', '{"minimum_version": "2024.01.0"}', '["https://developer.okta.com"]', 'full', 'active'),
('Azure Active Directory', 'Identity', 'Identity Provider', '["Entra ID", "Conditional Access", "Privileged Identity Management"]', '["SAML", "OIDC", "SCIM", "WS-Fed"]', '["Graph API", "SAML", "OIDC"]', '{"integration_level": "full", "last_tested": "2024-01-29"}', '{}', '[]', '{"minimum_version": "v1.0"}', '["https://docs.microsoft.com/en-us/azure/active-directory"]', 'full', 'active'),
-- VPN/SASE Vendors
('Zscaler', 'Security', 'VPN/SASE', '["ZPA", "ZIA", "ZDX", "Workload Communications"]', '["API", "Webhook", "Syslog"]', '["REST API", "Connector"]', '{"integration_level": "full", "last_tested": "2024-01-31"}', '{}', '[]', '{"minimum_version": "22.52.1"}', '["https://help.zscaler.com"]', 'full', 'active'),
-- Cloud Platforms
('Amazon Web Services', 'Cloud', 'Cloud Platform', '["VPC", "IAM", "GuardDuty", "Security Hub", "Config"]', '["API", "CloudTrail", "VPC Flow Logs"]', '["AWS API", "CloudFormation", "Terraform"]', '{"integration_level": "full", "last_tested": "2024-02-01"}', '{}', '[]', '{"minimum_version": "2023.12.01"}', '["https://docs.aws.amazon.com"]', 'full', 'active'),
('Google Cloud Platform', 'Cloud', 'Cloud Platform', '["VPC", "IAM", "Security Command Center", "Cloud Asset Inventory"]', '["API", "Cloud Logging", "VPC Flow Logs"]', '["GCP API", "Deployment Manager", "Terraform"]', '{"integration_level": "partial", "last_tested": "2024-02-01"}', '{}', '["Limited RADIUS integration"]', '{"minimum_version": "v1"}', '["https://cloud.google.com/docs"]', 'partial', 'active')
) AS new_vendors(vendor_name, vendor_type, category, models, supported_protocols, integration_methods, portnox_compatibility, configuration_templates, known_limitations, firmware_requirements, documentation_links, support_level, status)
WHERE NOT EXISTS (
    SELECT 1 FROM vendor_library WHERE vendor_library.vendor_name = new_vendors.vendor_name
);

-- Fix RLS policies for full access
DROP POLICY IF EXISTS "Enhanced vendor viewing" ON vendor_library;
DROP POLICY IF EXISTS "Users can create vendors" ON vendor_library;  
DROP POLICY IF EXISTS "Users can update vendors" ON vendor_library;
DROP POLICY IF EXISTS "All users can access vendors" ON vendor_library;

CREATE POLICY "Authenticated users can view all vendors" 
ON vendor_library 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage vendors" 
ON vendor_library 
FOR ALL 
USING (auth.role() = 'authenticated');