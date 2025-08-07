-- Add comprehensive vendor data and fix RLS policies

-- First, add comprehensive vendor data
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

-- Add comprehensive configuration templates
INSERT INTO configuration_templates (name, description, category, subcategory, configuration_type, template_content, vendor_id, complexity_level, template_variables, tags, validation_commands, best_practices, is_public) VALUES
('Cisco WLC 802.1X Configuration', 'Complete 802.1X configuration for Cisco Wireless LAN Controller', '802.1X', 'Wireless', 'authentication', 
'! Cisco WLC 802.1X Configuration
! RADIUS Server Configuration
config radius auth add 1 {{radius_server_ip}} 1812 ascii {{shared_secret}}
config radius auth mgmt-type radius-with-coa enable 1

! WLAN Configuration  
config wlan create {{wlan_id}} {{ssid_name}}
config wlan security wpa akm 802.1x enable {{wlan_id}}
config wlan security wpa akm psk disable {{wlan_id}}
config wlan security encryption-type aes enable {{wlan_id}}
config wlan radius_server auth add {{wlan_id}} 1
config wlan enable {{wlan_id}}',
(SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems' LIMIT 1),
'intermediate',
'{"radius_server_ip": "192.168.1.100", "shared_secret": "your_shared_secret", "wlan_id": "1", "ssid_name": "SecureWiFi"}',
'["802.1X", "Wireless", "RADIUS", "WLC"]',
'["show radius summary", "show wlan summary", "show client summary"]',
'["Test RADIUS connectivity before deploying", "Use monitor sessions for troubleshooting", "Implement gradual rollout"]',
true),

('Aruba Switch 802.1X Configuration', 'Complete 802.1X port-based authentication for Aruba switches', '802.1X', 'Wired', 'authentication',
'! Aruba Switch 802.1X Configuration
! RADIUS Configuration
radius-server host {{radius_server_ip}} key {{shared_secret}}
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth radius

! Global 802.1X Settings
aaa port-access authenticator enable
aaa port-access mac-auth enable
aaa port-access client-limit 8

! Interface Configuration
interface {{interface_range}}
   aaa port-access authenticator
   aaa port-access authenticator client-limit 2
   aaa port-access mac-auth
   aaa port-access mac-auth addr-format no-delimiter upper-case',
(SELECT id FROM vendor_library WHERE vendor_name = 'Aruba Networks' LIMIT 1),
'intermediate',
'{"radius_server_ip": "192.168.1.100", "shared_secret": "your_shared_secret", "interface_range": "1/1/1-1/1/48"}',
'["802.1X", "Wired", "RADIUS", "Port-based"]',
'["show port-access clients", "show radius statistics", "show aaa authentication port-access"]',
'["Configure backup authentication methods", "Use MAC authentication for IoT devices", "Monitor authentication logs"]',
true),

('Fortinet FortiGate RADIUS Integration', 'FortiGate firewall integration with RADIUS for user authentication', 'Security', 'Firewall', 'authentication',
'# FortiGate RADIUS Configuration
config user radius
    edit "{{radius_server_name}}"
        set server "{{radius_server_ip}}"
        set secret {{shared_secret}}
        set auth-type auto
        set rsso enable
        set sso-attribute-key "User-Name"
    next
end

config user group
    edit "{{user_group_name}}"
        set member "{{radius_server_name}}"
    next
end

config authentication policy
    edit 1
        set name "RADIUS_Auth"
        set srcintf "{{source_interface}}"
        set srcaddr "all"
        set dstintf "{{dest_interface}}"
        set dstaddr "all"
        set groups "{{user_group_name}}"
        set schedule "always"
        set service "ALL"
        set action accept
    next
end',
(SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet Inc' LIMIT 1),
'advanced',
'{"radius_server_name": "RADIUS-Server", "radius_server_ip": "192.168.1.100", "shared_secret": "fortinet_secret", "user_group_name": "Authenticated_Users", "source_interface": "internal", "dest_interface": "wan1"}',
'["RADIUS", "Firewall", "Authentication", "RSSO"]',
'["diagnose test authserver radius", "get user radius", "diagnose debug authd 8"]',
'["Test authentication before production", "Configure RSSO for Single Sign-On", "Monitor authentication logs"]',
true),

('Palo Alto Networks 802.1X Configuration', 'Comprehensive 802.1X configuration for Palo Alto Networks firewalls', 'Security', 'Firewall', 'authentication',
'# Palo Alto Networks 802.1X Configuration
set shared server-profile radius {{radius_profile_name}} protocol RADIUS server {{radius_server_ip}} secret {{shared_secret}} port 1812
set shared server-profile radius {{radius_profile_name}} protocol RADIUS timeout 3
set shared server-profile radius {{radius_profile_name}} protocol RADIUS retries 3

set shared authentication-profile {{auth_profile_name}} method radius
set shared authentication-profile {{auth_profile_name}} server-profile {{radius_profile_name}}

set network interface ethernet {{interface_name}} layer3 ip {{interface_ip}}/{{subnet_mask}}
set network interface ethernet {{interface_name}} layer3 interface-management-profile allow-radius

set device-group {{device_group}} devices {{device_serial}}',
(SELECT id FROM vendor_library WHERE vendor_name = 'Palo Alto Networks' LIMIT 1),
'advanced',
'{"radius_profile_name": "RADIUS-Profile", "radius_server_ip": "192.168.1.100", "shared_secret": "palo_secret", "auth_profile_name": "Auth-Profile", "interface_name": "ethernet1/1", "interface_ip": "192.168.100.1", "subnet_mask": "24", "device_group": "Device-Group", "device_serial": "123456789"}',
'["RADIUS", "802.1X", "Firewall", "Authentication"]',
'["show authentication-profile", "show server-profile", "test authentication authentication-profile"]',
'["Verify RADIUS connectivity", "Configure backup authentication", "Test with known good credentials"]',
true);

-- Fix RLS policies for config templates and vendor access
CREATE POLICY "Users can view all public config templates" 
ON configuration_templates 
FOR SELECT 
USING (is_public = true OR created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create and manage config templates" 
ON configuration_templates 
FOR ALL 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Update vendor_library RLS for full access
DROP POLICY IF EXISTS "Enhanced vendor viewing" ON vendor_library;
DROP POLICY IF EXISTS "Users can create vendors" ON vendor_library;
DROP POLICY IF EXISTS "Users can update vendors" ON vendor_library;

CREATE POLICY "Users can view all vendors" 
ON vendor_library 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage vendors" 
ON vendor_library 
FOR ALL 
USING (true);