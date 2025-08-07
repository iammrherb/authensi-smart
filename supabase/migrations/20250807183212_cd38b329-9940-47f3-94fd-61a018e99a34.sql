-- Fix vendor_library constraint and add comprehensive data

-- First, check if there's a unique constraint on vendor_name
ALTER TABLE vendor_library ADD CONSTRAINT unique_vendor_name UNIQUE (vendor_name);

-- Add comprehensive vendor data with better conflict handling
INSERT INTO vendor_library (vendor_name, vendor_type, category, models, supported_protocols, integration_methods, portnox_compatibility, configuration_templates, known_limitations, firmware_requirements, documentation_links, support_level, status) VALUES
-- Wireless Infrastructure Vendors
('Arista Networks', 'Infrastructure', 'Wireless Infrastructure', '["EOS WiFi", "CloudEOS", "Campus WiFi"]', '["802.11ax", "802.11ac", "802.1X", "WPA3"]', '["RADIUS", "REST API", "SNMP"]', '{"integration_level": "full", "last_tested": "2024-01-15"}', '{}', '["Limited WiFi product portfolio"]', '{"minimum_version": "4.28.1F"}', '["https://www.arista.com/en/products/wifi"]', 'full', 'active'),
('Ruckus Networks', 'Infrastructure', 'Wireless Infrastructure', '["R850", "R750", "R650", "R550", "T750", "SmartZone"]', '["802.11ax", "802.11ac", "802.1X", "WPA3", "BeamFlex"]', '["RADIUS", "SNMP", "REST API"]', '{"integration_level": "full", "last_tested": "2024-01-20"}', '{}', '[]', '{"minimum_version": "6.1.0"}', '["https://support.ruckuswireless.com"]', 'full', 'active'),
('Extreme Networks', 'Infrastructure', 'Wireless Infrastructure', '["AP4000", "AP3000", "AP305C", "WiNG 7", "ExtremeCloud IQ"]', '["802.11ax", "802.11ac", "802.1X", "WPA3"]', '["RADIUS", "SNMP", "REST API"]', '{"integration_level": "full", "last_tested": "2024-01-18"}', '{}', '[]', '{"minimum_version": "10.21.14"}', '["https://extremenetworks.com/support"]', 'full', 'active'),
-- Security/EDR Vendors
('CrowdStrike', 'Security', 'EDR', '["Falcon Endpoint Protection", "Falcon Prevent", "Falcon Insight", "Falcon OverWatch"]', '["API", "Webhook", "Syslog"]', '["REST API", "GraphQL", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-25"}', '{}', '[]', '{"minimum_version": "6.45"}', '["https://falcon.crowdstrike.com/documentation"]', 'full', 'active'),
('SentinelOne', 'Security', 'EDR', '["Singularity Platform", "Ranger", "Vigilance", "ActiveEDR"]', '["API", "Webhook", "Syslog"]', '["REST API", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-22"}', '{}', '[]', '{"minimum_version": "22.3.3"}', '["https://docs.sentinelone.com"]', 'full', 'active'),
('Cybereason', 'Security', 'EDR', '["Endpoint Detection", "Threat Hunting", "Malop Detection"]', '["API", "Syslog"]', '["REST API", "SIEM Integration"]', '{"integration_level": "partial", "last_tested": "2024-01-20"}', '{}', '["Limited real-time response"]', '{"minimum_version": "20.2"}', '["https://nest.cybereason.com/documentation"]', 'partial', 'active'),
-- SIEM Vendors
('Splunk', 'Security', 'SIEM', '["Enterprise Security", "SOAR", "Phantom", "UBA"]', '["Syslog", "API", "Forwarder"]', '["Universal Forwarder", "REST API", "Webhook"]', '{"integration_level": "full", "last_tested": "2024-01-28"}', '{}', '[]', '{"minimum_version": "9.0"}', '["https://docs.splunk.com"]', 'full', 'active'),
('IBM QRadar', 'Security', 'SIEM', '["SIEM", "UEBA", "SOAR", "Risk Manager"]', '["Syslog", "SNMP", "API"]', '["DSM", "REST API", "Protocol Integration"]', '{"integration_level": "full", "last_tested": "2024-01-26"}', '{}', '[]', '{"minimum_version": "7.5.0"}', '["https://www.ibm.com/docs/en/qradar-siem"]', 'full', 'active'),
('LogRhythm', 'Security', 'SIEM', '["NextGen SIEM", "CloudAI", "RespondX"]', '["Syslog", "API", "Agent"]', '["System Monitor", "REST API", "Webhook"]', '{"integration_level": "partial", "last_tested": "2024-01-24"}', '{}', '["Complex deployment"]', '{"minimum_version": "7.15"}', '["https://docs.logrhythm.com"]', 'partial', 'active'),
-- Identity Providers
('Okta', 'Identity', 'Identity Provider', '["Universal Directory", "SSO", "MFA", "Lifecycle Management"]', '["SAML", "OIDC", "SCIM", "RADIUS"]', '["API", "SAML Federation", "SCIM Provisioning"]', '{"integration_level": "full", "last_tested": "2024-01-30"}', '{}', '[]', '{"minimum_version": "2024.01.0"}', '["https://developer.okta.com"]', 'full', 'active'),
('Azure Active Directory', 'Identity', 'Identity Provider', '["Entra ID", "Conditional Access", "Privileged Identity Management"]', '["SAML", "OIDC", "SCIM", "WS-Fed"]', '["Graph API", "SAML", "OIDC"]', '{"integration_level": "full", "last_tested": "2024-01-29"}', '{}', '[]', '{"minimum_version": "v1.0"}', '["https://docs.microsoft.com/en-us/azure/active-directory"]', 'full', 'active'),
('Ping Identity', 'Identity', 'Identity Provider', '["PingOne", "PingFederate", "PingAccess", "PingDirectory"]', '["SAML", "OIDC", "SCIM", "LDAP"]', '["REST API", "SAML", "OIDC"]', '{"integration_level": "full", "last_tested": "2024-01-27"}', '{}', '[]', '{"minimum_version": "11.3"}', '["https://docs.pingidentity.com"]', 'full', 'active'),
-- VPN Vendors
('Zscaler', 'Security', 'VPN/SASE', '["ZPA", "ZIA", "ZDX", "Workload Communications"]', '["API", "Webhook", "Syslog"]', '["REST API", "Connector"]', '{"integration_level": "full", "last_tested": "2024-01-31"}', '{}', '[]', '{"minimum_version": "22.52.1"}', '["https://help.zscaler.com"]', 'full', 'active'),
('Prisma Access', 'Security', 'VPN/SASE', '["SASE", "Cloud Security", "Mobile Security"]', '["API", "Syslog", "GlobalProtect"]', '["REST API", "XML API"]', '{"integration_level": "full", "last_tested": "2024-01-30"}', '{}', '[]', '{"minimum_version": "3.2"}', '["https://docs.paloaltonetworks.com/prisma/prisma-access"]', 'full', 'active'),
-- Cloud Platforms
('Amazon Web Services', 'Cloud', 'Cloud Platform', '["VPC", "IAM", "GuardDuty", "Security Hub", "Config"]', '["API", "CloudTrail", "VPC Flow Logs"]', '["AWS API", "CloudFormation", "Terraform"]', '{"integration_level": "full", "last_tested": "2024-02-01"}', '{}', '[]', '{"minimum_version": "2023.12.01"}', '["https://docs.aws.amazon.com"]', 'full', 'active'),
('Microsoft Azure', 'Cloud', 'Cloud Platform', '["Virtual Networks", "Security Center", "Sentinel", "Key Vault"]', '["API", "Activity Logs", "NSG Flow Logs"]', '["Azure API", "ARM Templates", "Terraform"]', '{"integration_level": "full", "last_tested": "2024-02-01"}', '{}', '[]', '{"minimum_version": "2023-12-01"}', '["https://docs.microsoft.com/en-us/azure"]', 'full', 'active'),
('Google Cloud Platform', 'Cloud', 'Cloud Platform', '["VPC", "IAM", "Security Command Center", "Cloud Asset Inventory"]', '["API", "Cloud Logging", "VPC Flow Logs"]', '["GCP API", "Deployment Manager", "Terraform"]', '{"integration_level": "partial", "last_tested": "2024-02-01"}', '{}', '["Limited RADIUS integration"]', '{"minimum_version": "v1"}', '["https://cloud.google.com/docs"]', 'partial', 'active')
ON CONFLICT (vendor_name) DO UPDATE SET
  vendor_type = EXCLUDED.vendor_type,
  category = EXCLUDED.category,
  models = EXCLUDED.models,
  supported_protocols = EXCLUDED.supported_protocols,
  integration_methods = EXCLUDED.integration_methods,
  portnox_compatibility = EXCLUDED.portnox_compatibility,
  support_level = EXCLUDED.support_level,
  status = EXCLUDED.status,
  updated_at = now();

-- Fix RLS policies for comprehensive access
DROP POLICY IF EXISTS "Enhanced vendor viewing" ON vendor_library;
DROP POLICY IF EXISTS "Users can create vendors" ON vendor_library;
DROP POLICY IF EXISTS "Users can update vendors" ON vendor_library;

CREATE POLICY "Users can view all vendors" 
ON vendor_library 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage all vendors" 
ON vendor_library 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update all vendors" 
ON vendor_library 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete vendors" 
ON vendor_library 
FOR DELETE 
USING (has_role(auth.uid(), 'super_admin'::app_role));