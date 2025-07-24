-- Pre-populate vendor library with basic support levels
INSERT INTO vendor_library (
  id, vendor_name, category, vendor_type, status,
  models, supported_protocols, integration_methods, portnox_compatibility,
  configuration_templates, firmware_requirements, known_limitations,
  documentation_links
) VALUES 

-- Core NAC Vendors
(gen_random_uuid(), 'Portnox', 'NAC Solutions', 'primary', 'active',
 '["ZTAC Platform", "Core Platform", "Cloud Platform"]'::jsonb,
 '["RADIUS", "IEEE 802.1X", "TACACS+", "LDAP", "SAML", "OpenID Connect"]'::jsonb,
 '["Native API", "REST API", "CLI", "SNMP"]'::jsonb,
 '{"compatibility_score": 100, "native_integration": true, "ai_optimized": true}'::jsonb,
 '{"basic": "Standard NAC deployment", "advanced": "Zero Trust implementation"}'::jsonb,
 '{"minimum_version": "Latest", "recommended_version": "Latest"}'::jsonb,
 '[]'::jsonb,
 '[{"title": "Admin Guide", "url": "https://docs.portnox.com", "type": "setup"}]'::jsonb),

(gen_random_uuid(), 'Cisco ISE', 'NAC Solutions', 'competitor', 'active',
 '["ISE 3.2", "ISE 3.1", "ISE 3.0", "ISE 2.7"]'::jsonb,
 '["RADIUS", "IEEE 802.1X", "TACACS+", "pxGrid", "TrustSec"]'::jsonb,
 '["pxGrid API", "REST API", "CLI", "SNMP"]'::jsonb,
 '{"compatibility_score": 85, "native_integration": false, "api_integration": true}'::jsonb,
 '{"basic": "Standard ISE integration", "advanced": "TrustSec integration"}'::jsonb,
 '{"minimum_version": "3.0", "recommended_version": "3.2"}'::jsonb,
 '["Complex deployment", "High resource requirements"]'::jsonb,
 '[{"title": "Integration Guide", "url": "#", "type": "setup"}]'::jsonb),

(gen_random_uuid(), 'Aruba ClearPass', 'NAC Solutions', 'competitor', 'active',
 '["ClearPass 6.11", "ClearPass 6.10", "ClearPass 6.9"]'::jsonb,
 '["RADIUS", "IEEE 802.1X", "TACACS+", "REST API"]'::jsonb,
 '["REST API", "CLI", "SNMP"]'::jsonb,
 '{"compatibility_score": 80, "native_integration": false, "api_integration": true}'::jsonb,
 '{"basic": "ClearPass integration", "advanced": "Policy sync"}'::jsonb,
 '{"minimum_version": "6.9", "recommended_version": "6.11"}'::jsonb,
 '["Limited API capabilities in older versions"]'::jsonb,
 '[{"title": "ClearPass Integration", "url": "#", "type": "setup"}]'::jsonb),

-- Network Infrastructure  
(gen_random_uuid(), 'Cisco Catalyst', 'Network Switches', 'infrastructure', 'active',
 '["9300 Series", "9400 Series", "9500 Series", "9600 Series"]'::jsonb,
 '["IEEE 802.1X", "MAB", "RADIUS", "SNMP", "NetConf"]'::jsonb,
 '["SNMP", "SSH", "REST API", "NetConf"]'::jsonb,
 '{"compatibility_score": 95, "native_integration": true}'::jsonb,
 '{"basic": "802.1X configuration", "advanced": "Dynamic VLAN assignment"}'::jsonb,
 '{"minimum_version": "16.12", "recommended_version": "17.x"}'::jsonb,
 '[]'::jsonb,
 '[{"title": "Catalyst Configuration Guide", "url": "#", "type": "setup"}]'::jsonb),

(gen_random_uuid(), 'Aruba CX', 'Network Switches', 'infrastructure', 'active',
 '["6200 Series", "6300 Series", "6400 Series", "8320 Series"]'::jsonb,
 '["IEEE 802.1X", "MAB", "RADIUS", "SNMP", "REST API"]'::jsonb,
 '["REST API", "CLI", "SNMP"]'::jsonb,
 '{"compatibility_score": 90, "native_integration": true}'::jsonb,
 '{"basic": "802.1X configuration", "advanced": "VSX integration"}'::jsonb,
 '{"minimum_version": "10.08", "recommended_version": "10.11"}'::jsonb,
 '[]'::jsonb,
 '[{"title": "ArubaOS-CX Guide", "url": "#", "type": "setup"}]'::jsonb),

-- Identity Providers
(gen_random_uuid(), 'Microsoft Active Directory', 'Identity Providers', 'identity', 'active',
 '["Windows Server 2019", "Windows Server 2022", "Azure AD"]'::jsonb,
 '["LDAP", "Kerberos", "RADIUS", "SAML", "OAuth 2.0"]'::jsonb,
 '["LDAP", "PowerShell", "Graph API"]'::jsonb,
 '{"compatibility_score": 100, "native_integration": true}'::jsonb,
 '{"basic": "LDAP authentication", "advanced": "Certificate Services integration"}'::jsonb,
 '{"minimum_version": "2016", "recommended_version": "2022"}'::jsonb,
 '[]'::jsonb,
 '[{"title": "AD Integration Guide", "url": "#", "type": "setup"}]'::jsonb),

(gen_random_uuid(), 'Microsoft Intune', 'MDM Solutions', 'endpoint', 'active',
 '["Intune", "ConfigMgr Co-management", "Autopilot"]'::jsonb,
 '["SCEP", "Graph API", "OMA-DM"]'::jsonb,
 '["Graph API", "PowerShell", "REST API"]'::jsonb,
 '{"compatibility_score": 95, "native_integration": true}'::jsonb,
 '{"basic": "Device compliance", "advanced": "Conditional access"}'::jsonb,
 '{"minimum_version": "N/A", "recommended_version": "Latest"}'::jsonb,
 '[]'::jsonb,
 '[{"title": "Intune Integration", "url": "#", "type": "setup"}]'::jsonb)

ON CONFLICT (id) DO NOTHING;