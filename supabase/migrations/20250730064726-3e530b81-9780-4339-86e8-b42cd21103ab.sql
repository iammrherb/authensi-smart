-- Add comprehensive vendor library with all categories and models
-- First, let's add more vendor categories and comprehensive vendor data

-- Insert comprehensive vendor categories
INSERT INTO vendor_library (name, vendor_type, description, support_level, website, contact_info, key_features, supported_protocols, integration_complexity, documentation_quality, community_support, portnox_certified, market_presence, tags, certification_status) VALUES

-- Wired Infrastructure Vendors
('HPE (Aruba Switching)', 'network_infrastructure', 'Enterprise switching solutions with ClearPass integration', 'enterprise', 'https://www.arubanetworks.com', '{"email": "support@arubanetworks.com", "phone": "+1-408-227-4500"}', '["Layer 2/3 switching", "PoE+", "Stacking", "VLAN segmentation", "QoS"]', '["802.1X", "MAB", "LLDP", "SNMP", "RADIUS"]', 'medium', 'excellent', 'high', true, 'high', '["switching", "wired", "enterprise", "PoE"]', 'certified'),

('Cisco Catalyst', 'network_infrastructure', 'Industry-leading enterprise switching portfolio', 'enterprise', 'https://www.cisco.com', '{"email": "support@cisco.com", "phone": "+1-800-553-2447"}', '["Modular switches", "Fixed switches", "StackPower", "Cisco StackWise", "TrustSec"]', '["802.1X", "MAB", "NEAT", "RADIUS", "TACACS+"]', 'high', 'excellent', 'excellent', true, 'very_high', '["switching", "wired", "enterprise", "stackwise"]', 'certified'),

('Juniper EX Series', 'network_infrastructure', 'High-performance Ethernet switches', 'enterprise', 'https://www.juniper.net', '{"email": "support@juniper.net", "phone": "+1-888-314-5822"}', '["Virtual Chassis", "PoE+", "MPLS", "EVPN-VXLAN"]', '["802.1X", "RADIUS", "TACACS+", "SNMP"]', 'high', 'good', 'medium', false, 'medium', '["switching", "wired", "enterprise", "virtual-chassis"]', 'compatible'),

('Extreme Networks', 'network_infrastructure', 'Cloud-driven networking solutions', 'enterprise', 'https://www.extremenetworks.com', '{"email": "support@extremenetworks.com", "phone": "+1-408-579-2800"}', '["Cloud management", "Fabric Attach", "Zero-touch provisioning"]', '["802.1X", "RADIUS", "LLDP", "SNMP"]', 'medium', 'good', 'medium', true, 'medium', '["switching", "wired", "cloud", "fabric"]', 'certified'),

-- Wireless Infrastructure Vendors  
('Cisco Wireless (Catalyst 9800)', 'wireless_infrastructure', 'Enterprise wireless controllers and APs', 'enterprise', 'https://www.cisco.com', '{"email": "support@cisco.com", "phone": "+1-800-553-2447"}', '["Centralized/Distributed deployment", "WiFi 6E/7", "Analytics", "Security"]', '["802.1X", "PSK", "RADIUS", "WPA3", "OWE"]', 'high', 'excellent', 'excellent', true, 'very_high', '["wireless", "wifi6", "enterprise", "controller"]', 'certified'),

('HPE Aruba Central', 'wireless_infrastructure', 'Cloud-native network management', 'enterprise', 'https://www.arubanetworks.com', '{"email": "support@arubanetworks.com", "phone": "+1-408-227-4500"}', '["Cloud management", "AI insights", "Zero-touch provisioning", "WiFi 6E"]', '["802.1X", "PSK", "RADIUS", "WPA3", "Enhanced Open"]', 'medium', 'excellent', 'high', true, 'high', '["wireless", "cloud", "AI", "wifi6e"]', 'certified'),

('Ruckus (CommScope)', 'wireless_infrastructure', 'High-performance wireless solutions', 'enterprise', 'https://www.commscope.com', '{"email": "support@commscope.com", "phone": "+1-800-CommScope"}', '["BeamFlex+", "ChannelFly", "SmartCast", "WiFi 6E"]', '["802.1X", "PSK", "RADIUS", "WPA3"]', 'medium', 'good', 'medium', true, 'medium', '["wireless", "beamflex", "channelfly", "wifi6e"]', 'certified'),

('Fortinet FortiAP', 'wireless_infrastructure', 'Secure wireless access points', 'enterprise', 'https://www.fortinet.com', '{"email": "support@fortinet.com", "phone": "+1-866-648-4638"}', '["Integrated security", "FortiGate integration", "Rogue AP detection"]', '["802.1X", "PSK", "RADIUS", "WPA3"]', 'medium', 'good', 'high', false, 'high', '["wireless", "security", "integrated", "rogue-detection"]', 'compatible'),

-- NAC/RADIUS Providers
('Microsoft NPS', 'nac_radius', 'Windows Network Policy Server', 'enterprise', 'https://docs.microsoft.com/en-us/windows-server/networking/technologies/nps/', '{"email": "support@microsoft.com"}', '["Active Directory integration", "RADIUS proxy", "Connection request policies"]', '["RADIUS", "EAP-TLS", "PEAP", "EAP-TTLS"]', 'low', 'good', 'high', false, 'very_high', '["radius", "microsoft", "active-directory", "windows"]', 'compatible'),

('FreeRADIUS', 'nac_radius', 'Open-source RADIUS server', 'community', 'https://freeradius.org', '{"email": "support@freeradius.org"}', '["Open source", "Highly configurable", "Multiple backends", "Scalable"]', '["RADIUS", "EAP-TLS", "PEAP", "EAP-TTLS", "EAP-MSCHAPv2"]', 'high', 'good', 'high', false, 'high', '["radius", "open-source", "free", "configurable"]', 'compatible'),

('Cisco ISE', 'nac_radius', 'Identity Services Engine', 'enterprise', 'https://www.cisco.com/c/en/us/products/security/identity-services-engine/', '{"email": "support@cisco.com", "phone": "+1-800-553-2447"}', '["Policy enforcement", "Guest access", "BYOD", "Threat containment"]', '["RADIUS", "TACACS+", "EAP-TLS", "PEAP", "EAP-FAST"]', 'high', 'excellent', 'excellent', false, 'very_high', '["nac", "policy", "guest", "byod", "cisco"]', 'competitive'),

('Aruba ClearPass', 'nac_radius', 'Network access control platform', 'enterprise', 'https://www.arubanetworks.com/products/security/network-access-control/', '{"email": "support@arubanetworks.com", "phone": "+1-408-227-4500"}', '["Policy Manager", "Guest", "OnBoard", "QuickConnect"]', '["RADIUS", "TACACS+", "EAP-TLS", "PEAP", "EAP-TTLS"]', 'medium', 'excellent', 'high', false, 'high', '["nac", "policy", "guest", "onboard", "aruba"]', 'competitive'),

('Fortinet FortiNAC', 'nac_radius', 'Network access control solution', 'enterprise', 'https://www.fortinet.com/products/network-access-control', '{"email": "support@fortinet.com", "phone": "+1-866-648-4638"}', '["Device visibility", "Automated response", "Guest management"]', '["RADIUS", "EAP-TLS", "PEAP", "EAP-TTLS"]', 'medium', 'good', 'high', false, 'high', '["nac", "visibility", "automated", "fortinet"]', 'competitive'),

-- Security Vendors
('Palo Alto Networks', 'security', 'Next-generation firewalls and security', 'enterprise', 'https://www.paloaltonetworks.com', '{"email": "support@paloaltonetworks.com", "phone": "+1-866-898-9087"}', '["NGFW", "Cloud security", "Endpoint protection", "SASE"]', '["RADIUS", "SAML", "LDAP", "Kerberos"]', 'high', 'excellent', 'excellent', false, 'very_high', '["firewall", "ngfw", "cloud", "endpoint", "sase"]', 'compatible'),

('Check Point', 'security', 'Cybersecurity solutions', 'enterprise', 'https://www.checkpoint.com', '{"email": "support@checkpoint.com", "phone": "+1-800-429-4391"}', '["Firewall", "VPN", "Mobile security", "Cloud security"]', '["RADIUS", "LDAP", "Kerberos", "SAML"]', 'high', 'excellent', 'high', false, 'high', '["firewall", "vpn", "mobile", "cloud"]', 'compatible'),

('SonicWall', 'security', 'Network security appliances', 'enterprise', 'https://www.sonicwall.com', '{"email": "support@sonicwall.com", "phone": "+1-888-557-6642"}', '["NGFW", "VPN", "Email security", "Endpoint security"]', '["RADIUS", "LDAP", "Active Directory"]', 'medium', 'good', 'medium', false, 'medium', '["firewall", "vpn", "email", "endpoint"]', 'compatible'),

-- Identity Providers
('Microsoft Azure AD', 'identity_provider', 'Cloud identity and access management', 'enterprise', 'https://azure.microsoft.com/en-us/services/active-directory/', '{"email": "support@microsoft.com"}', '["SSO", "MFA", "Conditional access", "Identity protection"]', '["SAML", "OAuth", "OpenID Connect", "RADIUS"]', 'medium', 'excellent', 'excellent', false, 'very_high', '["identity", "cloud", "sso", "mfa", "microsoft"]', 'compatible'),

('Okta', 'identity_provider', 'Identity and access management', 'enterprise', 'https://www.okta.com', '{"email": "support@okta.com", "phone": "+1-888-722-7871"}', '["Universal directory", "SSO", "MFA", "Lifecycle management"]', '["SAML", "OAuth", "OpenID Connect", "RADIUS"]', 'medium', 'excellent', 'high', false, 'high', '["identity", "sso", "mfa", "lifecycle"]', 'compatible'),

('Ping Identity', 'identity_provider', 'Enterprise identity solutions', 'enterprise', 'https://www.pingidentity.com', '{"email": "support@pingidentity.com", "phone": "+1-888-874-5135"}', '["Access management", "Directory services", "API security"]', '["SAML", "OAuth", "OpenID Connect", "RADIUS"]', 'high', 'good', 'medium', false, 'medium', '["identity", "access", "api", "directory"]', 'compatible'),

-- MFA Providers
('Duo Security (Cisco)', 'mfa_provider', 'Multi-factor authentication', 'enterprise', 'https://duo.com', '{"email": "support@duo.com", "phone": "+1-855-426-3872"}', '["Push notifications", "SMS", "Voice", "Hardware tokens"]', '["RADIUS", "LDAP", "SAML", "REST API"]', 'low', 'excellent', 'high', false, 'high', '["mfa", "push", "sms", "tokens", "cisco"]', 'compatible'),

('RSA SecurID', 'mfa_provider', 'Authentication and digital identity', 'enterprise', 'https://www.rsa.com', '{"email": "support@rsa.com", "phone": "+1-877-772-4900"}', '["Hardware tokens", "Software tokens", "Risk-based auth"]', '["RADIUS", "LDAP", "SAML"]', 'medium', 'good', 'medium', false, 'medium', '["mfa", "tokens", "risk-based", "rsa"]', 'compatible'),

('YubiKey (Yubico)', 'mfa_provider', 'Hardware security keys', 'enterprise', 'https://www.yubico.com', '{"email": "support@yubico.com", "phone": "+1-844-205-6787"}', '["FIDO2/WebAuthn", "PIV", "OTP", "Touch-to-authenticate"]', '["FIDO2", "PIV", "OATH", "RADIUS"]', 'low', 'excellent', 'high', false, 'high', '["mfa", "hardware", "fido2", "piv", "yubikey"]', 'compatible'),

-- Cloud Providers
('Amazon Web Services', 'cloud_provider', 'Cloud computing platform', 'enterprise', 'https://aws.amazon.com', '{"email": "support@aws.amazon.com"}', '["Compute", "Storage", "Networking", "Identity services"]', '["SAML", "OAuth", "RADIUS", "LDAP"]', 'high', 'excellent', 'excellent', false, 'very_high', '["cloud", "aws", "compute", "storage"]', 'compatible'),

('Microsoft Azure', 'cloud_provider', 'Cloud computing services', 'enterprise', 'https://azure.microsoft.com', '{"email": "support@microsoft.com"}', '["Virtual machines", "App services", "Active Directory", "Networking"]', '["SAML", "OAuth", "RADIUS", "LDAP"]', 'high', 'excellent', 'excellent', false, 'very_high', '["cloud", "azure", "microsoft", "active-directory"]', 'compatible'),

('Google Cloud Platform', 'cloud_provider', 'Cloud computing services', 'enterprise', 'https://cloud.google.com', '{"email": "support@google.com"}', '["Compute Engine", "Cloud Identity", "Networking", "Security"]', '["SAML", "OAuth", "OpenID Connect"]', 'high', 'excellent', 'high', false, 'high', '["cloud", "gcp", "google", "identity"]', 'compatible'),

-- SIEM/EDR Vendors
('Splunk', 'siem_edr', 'Security information and event management', 'enterprise', 'https://www.splunk.com', '{"email": "support@splunk.com", "phone": "+1-866-438-7758"}', '["Log analysis", "Security monitoring", "Threat detection"]', '["REST API", "Syslog", "SNMP"]', 'high', 'excellent', 'high', false, 'high', '["siem", "logging", "analytics", "security"]', 'compatible'),

('CrowdStrike Falcon', 'siem_edr', 'Endpoint detection and response', 'enterprise', 'https://www.crowdstrike.com', '{"email": "support@crowdstrike.com", "phone": "+1-888-512-8906"}', '["Endpoint protection", "Threat intelligence", "Incident response"]', '["REST API", "SIEM integration"]', 'medium', 'excellent', 'high', false, 'high', '["edr", "endpoint", "threat-intel", "incident"]', 'compatible'),

('IBM QRadar', 'siem_edr', 'Security intelligence platform', 'enterprise', 'https://www.ibm.com/security/security-intelligence', '{"email": "support@ibm.com", "phone": "+1-800-426-4968"}', '["SIEM", "SOAR", "Threat hunting", "User behavior analytics"]', '["REST API", "Syslog", "SNMP", "QFlow"]', 'high', 'good', 'medium', false, 'medium', '["siem", "soar", "threat-hunting", "ueba"]', 'compatible'),

-- MDM Vendors
('Microsoft Intune', 'mdm_provider', 'Mobile device management', 'enterprise', 'https://docs.microsoft.com/en-us/mem/intune/', '{"email": "support@microsoft.com"}', '["Device compliance", "App management", "Conditional access"]', '["Azure AD", "Exchange", "SCEP", "RADIUS"]', 'medium', 'excellent', 'excellent', false, 'very_high', '["mdm", "compliance", "apps", "microsoft"]', 'compatible'),

('VMware Workspace ONE', 'mdm_provider', 'Digital workspace platform', 'enterprise', 'https://www.vmware.com/products/workspace-one.html', '{"email": "support@vmware.com", "phone": "+1-877-486-9273"}', '["Unified endpoint management", "App virtualization", "Identity management"]', '["LDAP", "SAML", "RADIUS", "SCEP"]', 'high', 'good', 'medium', false, 'medium', '["mdm", "uem", "app-virtualization", "vmware"]', 'compatible'),

('Jamf Pro', 'mdm_provider', 'Apple device management', 'enterprise', 'https://www.jamf.com', '{"email": "support@jamf.com", "phone": "+1-855-452-6344"}', '["Mac management", "iOS management", "Security", "Inventory"]', '["LDAP", "SAML", "SCEP", "Apple Push"]', 'medium', 'excellent', 'high', false, 'high', '["mdm", "apple", "mac", "ios", "jamf"]', 'compatible');

-- Add vendor models for major wired/wireless vendors
INSERT INTO vendor_models (vendor_id, model_name, model_type, description, release_date, end_of_life, end_of_support, key_features, supported_protocols, performance_specs, power_consumption, form_factor, target_market, price_range, availability_status, documentation_links, firmware_versions, configuration_templates, integration_notes, technical_specifications) 
SELECT 
  v.id as vendor_id,
  model_data.model_name,
  model_data.model_type,
  model_data.description,
  model_data.release_date,
  model_data.end_of_life,
  model_data.end_of_support,
  model_data.key_features,
  model_data.supported_protocols,
  model_data.performance_specs,
  model_data.power_consumption,
  model_data.form_factor,
  model_data.target_market,
  model_data.price_range,
  model_data.availability_status,
  model_data.documentation_links,
  model_data.firmware_versions,
  model_data.configuration_templates,
  model_data.integration_notes,
  model_data.technical_specifications
FROM vendor_library v
CROSS JOIN (
  VALUES 
    -- Cisco Catalyst Models
    ('Catalyst 9300', 'switch', 'Stackable enterprise switch', '2017-01-01', NULL, NULL, '["StackWise-480", "UPOE+", "DNA ready", "Modular uplinks"]', '["802.1X", "MAB", "RADIUS", "TACACS+"]', '{"switching_capacity": "208 Gbps", "forwarding_rate": "154.8 Mpps"}', '165W', '1RU', 'enterprise', '$5000-15000', 'current', '{"datasheet": "cisco.com/c/en/us/products/switches/catalyst-9300-series-switches/", "config_guide": "cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/"}', '["16.12.x", "17.3.x", "17.6.x"]', '["basic_l2", "l3_routing", "security"]', 'Excellent Portnox integration via RADIUS', '{"ports": "24/48", "poe": "UPOE+", "stack": "480Gbps"}'),
    
    ('Catalyst 9400', 'switch', 'Modular enterprise switch', '2017-01-01', NULL, NULL, '["Modular chassis", "40G/100G uplinks", "Redundant supervisors"]', '["802.1X", "MAB", "RADIUS", "TACACS+"]', '{"switching_capacity": "2.4 Tbps", "forwarding_rate": "1785 Mpps"}', '350W', '7RU', 'enterprise', '$15000-50000', 'current', '{"datasheet": "cisco.com/c/en/us/products/switches/catalyst-9400-series-switches/"}', '["16.12.x", "17.3.x", "17.6.x"]', '["basic_l2", "l3_routing", "security", "datacenter"]', 'Excellent Portnox integration', '{"slots": "7", "supervisors": "redundant", "uplinks": "40G/100G"}'),

    -- Aruba Switching Models  
    ('6300M', 'switch', 'Stackable campus switch', '2019-01-01', NULL, NULL, '["VSF stacking", "50G/100G uplinks", "ArubaOS-CX"]', '["802.1X", "MAB", "RADIUS"]', '{"switching_capacity": "2.56 Tbps", "forwarding_rate": "1904 Mpps"}', '140W', '1RU', 'enterprise', '$8000-20000', 'current', '{"datasheet": "arubanetworks.com/products/switches/6300-series/"}', '["10.08.x", "10.09.x", "10.10.x"]', '["campus", "l3_routing", "security"]', 'Native ClearPass integration', '{"ports": "24/48", "stacking": "VSF", "uplinks": "50G/100G"}'),

    -- Cisco Wireless Models
    ('Catalyst 9800-CL', 'wireless_controller', 'Cloud wireless controller', '2018-01-01', NULL, NULL, '["Cloud deployment", "Centralized/Local mode", "Up to 6000 APs"]', '["802.1X", "PSK", "RADIUS", "WPA3"]', '{"max_aps": "6000", "max_clients": "64000"}', '500W', 'Appliance', 'enterprise', '$25000-50000', 'current', '{"datasheet": "cisco.com/c/en/us/products/wireless/catalyst-9800-series-wireless-controllers/"}', '["17.3.x", "17.6.x", "17.9.x"]', '["enterprise", "guest", "byod"]', 'ISE integration available', '{"deployment": "cloud", "aps": "6000", "licensing": "DNA"}'),

    ('Catalyst 9130AXI', 'access_point', 'WiFi 6E access point', '2021-01-01', NULL, NULL, '["WiFi 6E", "4x4:4 MIMO", "IoT radio", "mGig uplink"]', '["802.1X", "PSK", "WPA3", "Enhanced Open"]', '{"max_data_rate": "5.38 Gbps", "spatial_streams": "4x4:4"}', '25.5W', 'Indoor AP', 'enterprise', '$800-1200', 'current', '{"datasheet": "cisco.com/c/en/us/products/wireless/catalyst-9130-access-points/"}', '["17.3.x", "17.6.x", "17.9.x"]', '["enterprise", "high_density", "wifi6e"]', 'Controller managed via CAPWAP', '{"bands": "2.4/5/6 GHz", "mimo": "4x4:4", "iot": "dedicated"}'),

    -- Aruba Wireless Models
    ('7030', 'wireless_controller', 'Campus wireless controller', '2020-01-01', NULL, NULL, '["On-premises", "Centralized management", "Up to 1024 APs"]', '["802.1X", "PSK", "RADIUS", "WPA3"]', '{"max_aps": "1024", "max_clients": "16384"}', '80W', '1RU', 'enterprise', '$15000-30000', 'current', '{"datasheet": "arubanetworks.com/products/wireless/access-points/7030-series/"}', '["8.8.x", "8.9.x", "8.10.x"]', '["campus", "branch", "guest"]', 'ClearPass integration', '{"aps": "1024", "poe": "no", "management": "centralized"}'),

    ('635', 'access_point', 'WiFi 6E high-performance AP', '2021-01-01', NULL, NULL, '["WiFi 6E", "4x4:4 MIMO", "IoT radio", "Smart power monitoring"]', '["802.1X", "PSK", "WPA3", "Enhanced Open"]', '{"max_data_rate": "6.77 Gbps", "spatial_streams": "4x4:4"}', '26.8W', 'Indoor AP', 'enterprise', '$900-1300', 'current', '{"datasheet": "arubanetworks.com/products/wireless/access-points/630-series/"}', '["8.8.x", "8.9.x", "8.10.x"]', '["high_density", "wifi6e", "iot"]', 'Central/Instant management', '{"bands": "2.4/5/6 GHz", "mimo": "4x4:4", "iot": "dedicated"}')