-- Add comprehensive vendors using the correct vendor_library schema
-- Insert comprehensive vendor data with proper conflict handling
INSERT INTO vendor_library (vendor_name, category, vendor_type, portnox_integration_level, description, models, documentation_links, integration_methods, created_by) 
VALUES 
-- Network Infrastructure - Wired Switches
('Cisco', 'wired_switches', 'network_infrastructure', 'native_full', 'Full native integration with comprehensive 802.1X policy enforcement and RADIUS accounting', '["Catalyst 2960", "Catalyst 3850", "Catalyst 9300", "Nexus 7000", "Meraki MS"]', '["https://docs.portnox.com/cisco"]', '["radius", "802.1x", "snmp", "api"]', null),
('Aruba (HPE)', 'wired_switches', 'network_infrastructure', 'native_full', 'Native integration with ClearPass and standalone deployments supporting dynamic segmentation', '["CX 6000", "CX 8000", "ProCurve 2920", "Mobility Access Switch"]', '["https://docs.portnox.com/aruba"]', '["radius", "802.1x", "clearpass_api", "dynamic_segmentation"]', null),
('Juniper Networks', 'wired_switches', 'network_infrastructure', 'native_full', 'Full RADIUS integration with Junos Space management and virtual chassis support', '["EX 2300", "EX 4300", "QFX 5000", "MX Series"]', '["https://docs.portnox.com/juniper"]', '["radius", "802.1x", "junos_space", "netconf"]', null),
('Extreme Networks', 'wired_switches', 'network_infrastructure', 'certified', 'Certified integration with policy enforcement and fabric attach capabilities', '["X440", "X460", "Summit X440", "VDX 6740"]', '["https://docs.portnox.com/extreme"]', '["radius", "802.1x", "fabric_attach", "policy_maps"]', null),
('Dell EMC', 'wired_switches', 'network_infrastructure', 'basic', 'Basic RADIUS integration with standard 802.1X authentication support', '["N1500", "S4100", "Z9100", "S3100"]', '["https://docs.portnox.com/dell"]', '["radius", "802.1x", "snmp"]', null),
('Huawei', 'wired_switches', 'network_infrastructure', 'basic', 'Basic RADIUS support with custom policy implementation through security zones', '["S5700", "S6720", "CloudEngine 6800", "S12700"]', '["https://docs.portnox.com/huawei"]', '["radius", "802.1x", "security_zones"]', null),
('D-Link', 'wired_switches', 'network_infrastructure', 'basic', 'Basic RADIUS authentication with limited policy enforcement features', '["DGS-1210", "DXS-3600", "DGS-3120", "DXS-1210"]', '["https://docs.portnox.com/dlink"]', '["radius", "802.1x", "basic_vlan"]', null),
('Netgear', 'wired_switches', 'network_infrastructure', 'basic', 'Standard RADIUS integration for SMB deployments with basic VLAN support', '["GS724T", "M4300", "XS712T", "GS748T"]', '["https://docs.portnox.com/netgear"]', '["radius", "802.1x", "vlan_assignment"]', null),
('TP-Link', 'wired_switches', 'network_infrastructure', 'basic', 'Entry-level RADIUS support with basic 802.1X authentication capabilities', '["T2600G", "T1600G", "SG3428", "TL-SG3424"]', '["https://docs.portnox.com/tplink"]', '["radius", "802.1x"]', null),
('Ubiquiti', 'wired_switches', 'network_infrastructure', 'basic', 'UniFi Controller integration with basic policy enforcement through VLANs', '["UniFi Switch 24", "UniFi Switch Pro 48", "EdgeSwitch 24"]', '["https://docs.portnox.com/ubiquiti"]', '["radius", "unifi_controller", "vlan_assignment"]', null),
('Meraki', 'wired_switches', 'network_infrastructure', 'native_full', 'Cloud-native integration with comprehensive policy control and zero-touch deployment', '["MS120", "MS210", "MS350", "MS425"]', '["https://docs.portnox.com/meraki"]', '["cloud_api", "group_policies", "radius"]', null),

-- Wireless Infrastructure
('Cisco Meraki', 'wireless_aps', 'wireless_infrastructure', 'native_full', 'Cloud-native integration with comprehensive policy control and guest portal management', '["MR33", "MR44", "MR55", "MR84", "MR86"]', '["https://docs.portnox.com/meraki-wireless"]', '["cloud_api", "radius", "guest_portal", "captive_portal"]', null),
('Aruba (HPE)', 'wireless_aps', 'wireless_infrastructure', 'native_full', 'Native integration with ClearPass supporting dynamic segmentation and Airwave management', '["AP-515", "AP-535", "AP-635", "AP-655", "Instant On"]', '["https://docs.portnox.com/aruba-wireless"]', '["clearpass_api", "radius", "dynamic_segmentation", "airwave"]', null),
('Ubiquiti', 'wireless_aps', 'wireless_infrastructure', 'basic', 'UniFi Controller integration with basic RADIUS and guest network support', '["U6-Pro", "U6-Enterprise", "U6-Mesh", "nanoHD", "AC-Pro"]', '["https://docs.portnox.com/ubiquiti-wireless"]', '["unifi_controller", "radius", "guest_networks"]', null),
('Ruckus (CommScope)', 'wireless_aps', 'wireless_infrastructure', 'certified', 'SmartZone integration with advanced RF optimization and policy enforcement', '["R350", "R550", "R650", "R750", "R850"]', '["https://docs.portnox.com/ruckus"]', '["smartzone_api", "radius", "policy_enforcement"]', null),
('Extreme Networks', 'wireless_aps', 'wireless_infrastructure', 'certified', 'WiNG integration with fabric attach and policy-based VLAN assignment', '["AP3935i", "AP4000", "AP305C", "AP410C"]', '["https://docs.portnox.com/extreme-wireless"]', '["wing_integration", "fabric_attach", "radius"]', null),

-- Routers
('Cisco', 'routers', 'routing_infrastructure', 'native_full', 'Comprehensive IOS/IOS-XE integration with advanced routing and security features', '["ISR 4000", "ASR 1000", "CSR 1000v", "ISR 1100"]', '["https://docs.portnox.com/cisco-routers"]', '["radius", "tacacs", "netconf", "snmp"]', null),
('Juniper Networks', 'routers', 'routing_infrastructure', 'native_full', 'Junos OS integration with advanced MPLS and security routing capabilities', '["MX204", "MX480", "MX960", "SRX300", "vMX"]', '["https://docs.portnox.com/juniper-routers"]', '["radius", "tacacs", "netconf", "junos_space"]', null),
('Mikrotik', 'routers', 'routing_infrastructure', 'basic', 'RouterOS integration with hotspot system and user manager capabilities', '["CCR1009", "CCR1036", "RB4011", "hEX S", "CRS317"]', '["https://docs.portnox.com/mikrotik"]', '["radius", "hotspot", "user_manager"]', null),
('Fortinet', 'routers', 'security_infrastructure', 'certified', 'FortiOS integration with SD-WAN and comprehensive security features', '["FortiGate 60F", "FortiGate 100F", "FortiGate 200F", "FortiGate 600E"]', '["https://docs.portnox.com/fortinet-routers"]', '["radius", "ldap", "fortios_api", "sd_wan"]', null),

-- Security Infrastructure - Firewalls
('Palo Alto Networks', 'firewalls', 'security_infrastructure', 'native_full', 'Native User-ID integration with App-ID and comprehensive threat prevention', '["PA-220", "PA-850", "PA-3220", "PA-5220", "VM-Series"]', '["https://docs.portnox.com/paloalto"]', '["user_id", "xml_api", "radius", "ldap"]', null),
('Check Point', 'firewalls', 'security_infrastructure', 'certified', 'Identity Awareness integration with comprehensive threat prevention and management', '["1570", "3200", "5800", "15600", "CloudGuard"]', '["https://docs.portnox.com/checkpoint"]', '["identity_awareness", "radius", "ldap", "management_api"]', null),
('Fortinet', 'firewalls', 'security_infrastructure', 'certified', 'FortiOS integration with security fabric and SD-WAN capabilities', '["FortiGate 60F", "FortiGate 100F", "FortiGate 400F", "FortiGate 1500D"]', '["https://docs.portnox.com/fortinet"]', '["radius", "ldap", "fortios_api", "security_fabric"]', null),
('SonicWall', 'firewalls', 'security_infrastructure', 'basic', 'SonicOS integration with threat prevention and SSL VPN features', '["TZ370", "TZ570", "NSa 2700", "NSa 4700", "NSa 6700"]', '["https://docs.portnox.com/sonicwall"]', '["radius", "ldap", "ssl_vpn"]', null),

-- VPN Solutions
('Cisco AnyConnect', 'vpn_solutions', 'vpn_infrastructure', 'native_full', 'Comprehensive SSL VPN with posture assessment and certificate authentication', '["AnyConnect 4.x", "AnyConnect Plus", "AnyConnect Apex"]', '["https://docs.portnox.com/anyconnect"]', '["radius", "ldap", "certificate", "posture_assessment"]', null),
('Palo Alto GlobalProtect', 'vpn_solutions', 'vpn_infrastructure', 'native_full', 'Integrated VPN with User-ID and HIP checking', '["GlobalProtect 5.x", "GlobalProtect 6.x", "Prisma Access"]', '["https://docs.portnox.com/globalprotect"]', '["user_id", "hip_check", "radius", "certificate"]', null),
('Pulse Secure', 'vpn_solutions', 'vpn_infrastructure', 'certified', 'Connect Secure integration with host checker and certificate-based authentication', '["Connect Secure 9.x", "Policy Secure", "Virtual Traffic Manager"]', '["https://docs.portnox.com/pulse"]', '["radius", "ldap", "certificate", "host_checker"]', null),
('OpenVPN', 'vpn_solutions', 'vpn_infrastructure', 'basic', 'Open-source VPN with RADIUS integration and certificate management', '["OpenVPN Access Server", "OpenVPN Community", "CloudConnexa"]', '["https://docs.portnox.com/openvpn"]', '["radius", "ldap", "certificate", "plugin_system"]', null),

-- EDR/XDR Solutions
('CrowdStrike Falcon', 'edr_xdr', 'endpoint_security', 'api_integration', 'API integration for device trust scoring and threat intelligence sharing', '["Falcon Prevent", "Falcon Complete", "Falcon X"]', '["https://docs.portnox.com/crowdstrike"]', '["rest_api", "device_trust", "threat_intelligence"]', null),
('Microsoft Defender for Endpoint', 'edr_xdr', 'endpoint_security', 'api_integration', 'Microsoft Graph API integration with Azure AD and threat intelligence', '["Defender for Endpoint P1", "Defender for Endpoint P2"]', '["https://docs.portnox.com/defender"]', '["graph_api", "azure_ad", "threat_intelligence"]', null),
('SentinelOne', 'edr_xdr', 'endpoint_security', 'api_integration', 'Management API integration with autonomous response and threat hunting', '["Singularity Core", "Singularity Complete", "Singularity Control"]', '["https://docs.portnox.com/sentinelone"]', '["management_api", "device_trust", "threat_hunting"]', null),

-- SIEM/MDR Solutions
('Splunk Enterprise Security', 'siem_mdr', 'siem_platform', 'log_integration', 'Comprehensive log forwarding with correlation rules and threat intelligence', '["Splunk Enterprise", "Splunk Cloud", "Phantom SOAR"]', '["https://docs.portnox.com/splunk"]', '["syslog", "rest_api", "correlation_rules"]', null),
('Microsoft Sentinel', 'siem_mdr', 'siem_platform', 'api_integration', 'Cloud-native SIEM with Azure integration and machine learning analytics', '["Microsoft Sentinel", "Azure Monitor", "Log Analytics"]', '["https://docs.portnox.com/sentinel"]', '["azure_api", "log_analytics", "machine_learning"]', null),

-- Monitoring Tools
('SolarWinds NPM', 'monitoring_tools', 'network_monitoring', 'certified', 'Network Performance Monitor with SNMP and API integration for comprehensive monitoring', '["NPM", "SAM", "SIEM", "Network Topology Mapper"]', '["https://docs.portnox.com/solarwinds"]', '["snmp", "api_integration", "orion_platform"]', null),
('PRTG Network Monitor', 'monitoring_tools', 'network_monitoring', 'basic', 'Comprehensive network monitoring with sensor-based architecture and SNMP support', '["PRTG 100", "PRTG 500", "PRTG 1000", "PRTG XL1", "PRTG Unlimited"]', '["https://docs.portnox.com/prtg"]', '["snmp", "wmi", "packet_sniffing", "rest_api"]', null),
('Nagios', 'monitoring_tools', 'network_monitoring', 'basic', 'Open-source monitoring platform with extensive plugin ecosystem and alerting', '["Nagios Core", "Nagios XI", "Nagios Log Server", "Nagios Network Analyzer"]', '["https://docs.portnox.com/nagios"]', '["snmp", "plugins", "nrpe", "nsca"]', null),
('Zabbix', 'monitoring_tools', 'network_monitoring', 'basic', 'Enterprise monitoring solution with agent-based and agentless monitoring capabilities', '["Zabbix Server", "Zabbix Proxy", "Zabbix Agent", "Zabbix Appliance"]', '["https://docs.portnox.com/zabbix"]', '["snmp", "zabbix_agent", "jmx", "api"]', null),

-- Device Inventory Tools
('Microsoft SCCM', 'device_inventory', 'device_management', 'certified', 'System Center Configuration Manager with comprehensive device lifecycle management', '["SCCM 2019", "SCCM 2022", "Configuration Manager Current Branch"]', '["https://docs.portnox.com/sccm"]', '["wmi", "active_directory", "wsus", "powershell"]', null),
('Lansweeper', 'device_inventory', 'device_management', 'basic', 'Network discovery and inventory management with asset tracking capabilities', '["Lansweeper On-Premise", "Lansweeper Cloud", "Lansweeper Sites"]', '["https://docs.portnox.com/lansweeper"]', '["wmi", "snmp", "ssh", "active_directory"]', null),
('Device42', 'device_inventory', 'device_management', 'basic', 'ITAM and DCIM platform with automated discovery and dependency mapping', '["Device42 Main Appliance", "Device42 Remote Collector", "Device42 Cloud"]', '["https://docs.portnox.com/device42"]', '["snmp", "wmi", "ssh", "rest_api"]', null)

ON CONFLICT (vendor_name, category) 
DO UPDATE SET
  vendor_type = EXCLUDED.vendor_type,
  portnox_integration_level = EXCLUDED.portnox_integration_level,
  description = EXCLUDED.description,
  models = EXCLUDED.models,
  documentation_links = EXCLUDED.documentation_links,
  integration_methods = EXCLUDED.integration_methods,
  updated_at = now();

-- Add comprehensive authentication methods (avoiding duplicates)
INSERT INTO authentication_methods (name, method_type, description, security_level, configuration_complexity, portnox_integration, vendor_support, documentation_links) VALUES
('OAuth 2.0', 'federation', 'Open Authorization 2.0 framework for delegated access', 'medium', 'medium', '{"native": true, "bearer_tokens": true, "refresh_tokens": true}', '["google", "microsoft", "auth0"]', '["https://docs.portnox.com/oauth"]'),
('OpenID Connect', 'federation', 'Identity layer on top of OAuth 2.0 protocol', 'high', 'medium', '{"native": true, "id_tokens": true, "userinfo_endpoint": true}', '["azure_ad", "okta", "auth0"]', '["https://docs.portnox.com/oidc"]'),
('Kerberos', 'network', 'Network authentication protocol using tickets', 'high', 'high', '{"native": true, "ticket_granting": true, "mutual_authentication": true}', '["microsoft", "mit", "heimdal"]', '["https://docs.portnox.com/kerberos"]'),
('Certificate-based', 'certificate', 'X.509 digital certificate authentication', 'very_high', 'high', '{"native": true, "client_certificates": true, "ca_validation": true}', '["microsoft_ca", "openssl", "sectigo"]', '["https://docs.portnox.com/certificates"]'),
('Multi-Factor Authentication', 'mfa', 'Multiple authentication factors for enhanced security', 'very_high', 'medium', '{"native": true, "totp": true, "sms": false, "push": true}', '["duo", "okta", "azure_mfa"]', '["https://docs.portnox.com/mfa"]'),
('Local Database', 'local', 'Local user database authentication', 'low', 'low', '{"native": true, "password_policy": true, "user_management": true}', '["portnox"]', '["https://docs.portnox.com/local-auth"]'),
('Guest Portal', 'portal', 'Web-based guest authentication portal', 'medium', 'low', '{"native": true, "customizable": true, "self_registration": true}', '["portnox"]', '["https://docs.portnox.com/guest-portal"]'),
('MAC Authentication Bypass', 'network', 'Device MAC address authentication bypass', 'low', 'low', '{"native": true, "device_profiling": true, "auto_registration": true}', '["cisco", "aruba", "extreme"]', '["https://docs.portnox.com/mab"]'),
('Web Authentication', 'portal', 'HTTP/HTTPS captive portal authentication', 'medium', 'low', '{"native": true, "captive_portal": true, "redirect_support": true}', '["cisco", "aruba", "fortinet"]', '["https://docs.portnox.com/web-auth"]'),
('Smart Card', 'certificate', 'PKI smart card authentication', 'very_high', 'high', '{"native": true, "pki_infrastructure": true, "middleware_required": true}', '["microsoft", "actividentity", "gemalto"]', '["https://docs.portnox.com/smartcard"]'),
('Biometric', 'biometric', 'Fingerprint, facial recognition, and other biometric authentication', 'very_high', 'medium', '{"native": false, "third_party_integration": true, "device_dependent": true}', '["windows_hello", "touch_id", "face_id"]', '["https://docs.portnox.com/biometric"]')
ON CONFLICT (name) DO NOTHING;

-- Create device types library table
CREATE TABLE IF NOT EXISTS public.device_types_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  typical_os_versions jsonb DEFAULT '[]'::jsonb,
  network_requirements jsonb DEFAULT '{}'::jsonb,
  security_considerations jsonb DEFAULT '[]'::jsonb,
  authentication_methods jsonb DEFAULT '[]'::jsonb,
  deployment_considerations jsonb DEFAULT '[]'::jsonb,
  monitoring_requirements jsonb DEFAULT '[]'::jsonb,
  compliance_requirements jsonb DEFAULT '[]'::jsonb,
  vendor_specific_notes jsonb DEFAULT '{}'::jsonb,
  risk_level text DEFAULT 'medium',
  management_complexity text DEFAULT 'medium',
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and create policies for device_types_library
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'device_types_library'
  ) THEN
    ALTER TABLE public.device_types_library ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Resource library readable by authenticated users" ON public.device_types_library
      FOR SELECT USING (true);
    
    CREATE POLICY "Users can create device types" ON public.device_types_library
      FOR INSERT WITH CHECK (true);
    
    CREATE POLICY "Users can update device types" ON public.device_types_library
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Add updated_at trigger for device_types_library
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_device_types_library_updated_at'
  ) THEN
    CREATE TRIGGER update_device_types_library_updated_at
      BEFORE UPDATE ON public.device_types_library
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;