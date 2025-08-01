-- Comprehensive expansion of vendor library with all network infrastructure categories
-- First, add all Network Infrastructure vendors

-- Wired Switches
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Cisco', 'enterprise', 'Network Infrastructure - Wired Switches', 'Leading enterprise networking equipment provider', 'fully_certified', 'active'),
  ('Aruba (HPE)', 'enterprise', 'Network Infrastructure - Wired Switches', 'HPE enterprise networking division', 'fully_certified', 'active'),
  ('Juniper Networks', 'enterprise', 'Network Infrastructure - Wired Switches', 'High-performance networking solutions', 'fully_certified', 'active'),
  ('Extreme Networks', 'enterprise', 'Network Infrastructure - Wired Switches', 'Cloud-driven networking solutions', 'certified', 'active'),
  ('Dell EMC', 'enterprise', 'Network Infrastructure - Wired Switches', 'Enterprise infrastructure solutions', 'certified', 'active'),
  ('Huawei', 'enterprise', 'Network Infrastructure - Wired Switches', 'Global ICT infrastructure provider', 'supported', 'active'),
  ('D-Link', 'smb', 'Network Infrastructure - Wired Switches', 'SMB networking equipment', 'supported', 'active'),
  ('Netgear', 'smb', 'Network Infrastructure - Wired Switches', 'Business and consumer networking', 'supported', 'active'),
  ('TP-Link', 'smb', 'Network Infrastructure - Wired Switches', 'Affordable networking solutions', 'supported', 'active'),
  ('Ubiquiti', 'prosumer', 'Network Infrastructure - Wired Switches', 'Enterprise WiFi at consumer prices', 'certified', 'active'),
  ('Meraki', 'cloud_managed', 'Network Infrastructure - Wired Switches', 'Cloud-managed networking by Cisco', 'fully_certified', 'active'),
  ('Brocade', 'enterprise', 'Network Infrastructure - Wired Switches', 'Data center networking', 'supported', 'active'),
  ('Allied Telesis', 'enterprise', 'Network Infrastructure - Wired Switches', 'Network infrastructure solutions', 'supported', 'active'),
  ('Alcatel-Lucent Enterprise', 'enterprise', 'Network Infrastructure - Wired Switches', 'Enterprise communications', 'supported', 'active'),
  ('Adtran', 'service_provider', 'Network Infrastructure - Wired Switches', 'Access and aggregation solutions', 'supported', 'active'),
  ('ZyXEL', 'smb', 'Network Infrastructure - Wired Switches', 'Networking and cybersecurity', 'supported', 'active'),
  ('3Com', 'legacy', 'Network Infrastructure - Wired Switches', 'Legacy networking equipment', 'legacy', 'deprecated'),
  ('Foundry Networks', 'legacy', 'Network Infrastructure - Wired Switches', 'High-performance switching', 'legacy', 'deprecated'),
  ('Force10', 'legacy', 'Network Infrastructure - Wired Switches', 'Data center networking', 'legacy', 'deprecated'),
  ('Nortel', 'legacy', 'Network Infrastructure - Wired Switches', 'Legacy enterprise networking', 'legacy', 'deprecated'),
  ('H3C', 'enterprise', 'Network Infrastructure - Wired Switches', 'IP networking solutions', 'supported', 'active'),
  ('Planet Technology', 'smb', 'Network Infrastructure - Wired Switches', 'Industrial networking', 'supported', 'active');

-- Wireless APs
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Cisco Meraki', 'cloud_managed', 'Network Infrastructure - Wireless APs', 'Cloud-managed wireless solutions', 'fully_certified', 'active'),
  ('Ruckus (CommScope)', 'enterprise', 'Network Infrastructure - Wireless APs', 'High-performance wireless', 'fully_certified', 'active'),
  ('Fortinet', 'security_focused', 'Network Infrastructure - Wireless APs', 'Security-driven networking', 'certified', 'active'),
  ('SonicWall', 'security_focused', 'Network Infrastructure - Wireless APs', 'Cybersecurity solutions', 'certified', 'active'),
  ('Cambium Networks', 'enterprise', 'Network Infrastructure - Wireless APs', 'Wireless broadband solutions', 'supported', 'active'),
  ('Motorola Solutions', 'enterprise', 'Network Infrastructure - Wireless APs', 'Mission-critical communications', 'supported', 'active'),
  ('Ericsson', 'service_provider', 'Network Infrastructure - Wireless APs', 'Telecommunications infrastructure', 'supported', 'active'),
  ('Aerohive (Extreme)', 'enterprise', 'Network Infrastructure - Wireless APs', 'Cloud networking solutions', 'certified', 'active'),
  ('Mist (Juniper)', 'ai_driven', 'Network Infrastructure - Wireless APs', 'AI-driven wireless', 'fully_certified', 'active'),
  ('Lancom', 'enterprise', 'Network Infrastructure - Wireless APs', 'German networking solutions', 'supported', 'active'),
  ('EnGenius', 'smb', 'Network Infrastructure - Wireless APs', 'Wireless networking solutions', 'supported', 'active'),
  ('Linksys', 'smb', 'Network Infrastructure - Wireless APs', 'Small business networking', 'supported', 'active'),
  ('Xirrus', 'enterprise', 'Network Infrastructure - Wireless APs', 'High-density wireless', 'supported', 'active'),
  ('Symbol (Zebra)', 'enterprise', 'Network Infrastructure - Wireless APs', 'Enterprise mobility solutions', 'supported', 'active'),
  ('Proxim', 'wireless_isp', 'Network Infrastructure - Wireless APs', 'Point-to-point wireless', 'supported', 'active');

-- Routers
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Mikrotik', 'prosumer', 'Network Infrastructure - Routers', 'RouterOS-based networking', 'supported', 'active'),
  ('pfSense', 'open_source', 'Network Infrastructure - Routers', 'Open source firewall/router', 'supported', 'active'),
  ('VyOS', 'open_source', 'Network Infrastructure - Routers', 'Open source network OS', 'supported', 'active'),
  ('Arista', 'data_center', 'Network Infrastructure - Routers', 'Cloud networking solutions', 'certified', 'active'),
  ('Netgate', 'security_appliance', 'Network Infrastructure - Routers', 'pfSense security appliances', 'certified', 'active'),
  ('Peplink', 'sd_wan', 'Network Infrastructure - Routers', 'SD-WAN and bonding solutions', 'supported', 'active'),
  ('Cradlepoint', 'wireless_wan', 'Network Infrastructure - Routers', 'Wireless WAN solutions', 'supported', 'active');

-- Security Infrastructure - Firewalls
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Palo Alto Networks', 'enterprise', 'Security Infrastructure - Firewalls', 'Next-generation firewalls', 'fully_certified', 'active'),
  ('Check Point', 'enterprise', 'Security Infrastructure - Firewalls', 'Cybersecurity solutions', 'fully_certified', 'active'),
  ('Cisco ASA/FTD', 'enterprise', 'Security Infrastructure - Firewalls', 'Adaptive security appliances', 'fully_certified', 'active'),
  ('Juniper SRX', 'enterprise', 'Security Infrastructure - Firewalls', 'Services gateway platform', 'certified', 'active'),
  ('WatchGuard', 'smb', 'Security Infrastructure - Firewalls', 'Network security solutions', 'certified', 'active'),
  ('Barracuda', 'smb', 'Security Infrastructure - Firewalls', 'Security and data protection', 'certified', 'active'),
  ('Sophos', 'smb', 'Security Infrastructure - Firewalls', 'Cybersecurity solutions', 'certified', 'active'),
  ('Zscaler', 'cloud_security', 'Security Infrastructure - Firewalls', 'Cloud security platform', 'supported', 'active'),
  ('Forcepoint', 'enterprise', 'Security Infrastructure - Firewalls', 'Human-centric cybersecurity', 'supported', 'active'),
  ('McAfee', 'enterprise', 'Security Infrastructure - Firewalls', 'Cybersecurity solutions', 'supported', 'active'),
  ('Untangle', 'smb', 'Security Infrastructure - Firewalls', 'Network security platform', 'supported', 'active'),
  ('IPFire', 'open_source', 'Security Infrastructure - Firewalls', 'Open source firewall', 'supported', 'active'),
  ('OPNsense', 'open_source', 'Security Infrastructure - Firewalls', 'Open source firewall', 'supported', 'active'),
  ('Smoothwall', 'education', 'Security Infrastructure - Firewalls', 'Education and business security', 'supported', 'active'),
  ('Endian', 'smb', 'Security Infrastructure - Firewalls', 'Unified threat management', 'supported', 'active'),
  ('ClearOS', 'smb', 'Security Infrastructure - Firewalls', 'Network and gateway services', 'supported', 'active'),
  ('Kerio Control', 'smb', 'Security Infrastructure - Firewalls', 'SMB security gateway', 'supported', 'active'),
  ('Cyberoam', 'smb', 'Security Infrastructure - Firewalls', 'Unified threat management', 'supported', 'active'),
  ('Array Networks', 'enterprise', 'Security Infrastructure - Firewalls', 'Application delivery solutions', 'supported', 'active');

-- VPN Solutions
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Cisco AnyConnect', 'enterprise', 'Security Infrastructure - VPN Solutions', 'Enterprise VPN client', 'fully_certified', 'active'),
  ('Palo Alto GlobalProtect', 'enterprise', 'Security Infrastructure - VPN Solutions', 'Next-gen VPN solution', 'fully_certified', 'active'),
  ('Fortinet FortiClient', 'enterprise', 'Security Infrastructure - VPN Solutions', 'Integrated endpoint protection', 'certified', 'active'),
  ('Pulse Secure', 'enterprise', 'Security Infrastructure - VPN Solutions', 'Secure access solutions', 'certified', 'active'),
  ('OpenVPN', 'open_source', 'Security Infrastructure - VPN Solutions', 'Open source VPN', 'supported', 'active'),
  ('WireGuard', 'modern_vpn', 'Security Infrastructure - VPN Solutions', 'Modern VPN protocol', 'supported', 'active'),
  ('NordLayer', 'cloud_vpn', 'Security Infrastructure - VPN Solutions', 'Business VPN solution', 'supported', 'active'),
  ('Perimeter 81', 'sase', 'Security Infrastructure - VPN Solutions', 'SASE platform', 'supported', 'active'),
  ('Zscaler Private Access', 'zero_trust', 'Security Infrastructure - VPN Solutions', 'Zero trust network access', 'supported', 'active'),
  ('Microsoft Always On VPN', 'microsoft', 'Security Infrastructure - VPN Solutions', 'Windows built-in VPN', 'certified', 'active'),
  ('SonicWall NetExtender', 'ssl_vpn', 'Security Infrastructure - VPN Solutions', 'SSL VPN client', 'certified', 'active'),
  ('Check Point Endpoint', 'endpoint_security', 'Security Infrastructure - VPN Solutions', 'Endpoint security VPN', 'certified', 'active'),
  ('F5 BIG-IP Edge', 'application_delivery', 'Security Infrastructure - VPN Solutions', 'Application delivery platform', 'supported', 'active'),
  ('Array SSL VPN', 'ssl_vpn', 'Security Infrastructure - VPN Solutions', 'SSL VPN solutions', 'supported', 'active'),
  ('Barracuda SSL VPN', 'ssl_vpn', 'Security Infrastructure - VPN Solutions', 'SSL VPN gateway', 'supported', 'active'),
  ('Kemp LoadMaster', 'load_balancer', 'Security Infrastructure - VPN Solutions', 'Load balancer with VPN', 'supported', 'active'),
  ('Citrix Gateway', 'virtualization', 'Security Infrastructure - VPN Solutions', 'Application delivery platform', 'supported', 'active'),
  ('VMware Tunnel', 'virtualization', 'Security Infrastructure - VPN Solutions', 'Per-app VPN solution', 'supported', 'active'),
  ('Tunnelbear for Business', 'cloud_vpn', 'Security Infrastructure - VPN Solutions', 'Business VPN service', 'supported', 'active'),
  ('ExpressVPN for Business', 'cloud_vpn', 'Security Infrastructure - VPN Solutions', 'Business VPN service', 'supported', 'active');

-- Continue with device types table expansion
CREATE TABLE IF NOT EXISTS public.device_types_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  os_types JSONB DEFAULT '[]'::jsonb,
  typical_user_count_range TEXT,
  security_requirements JSONB DEFAULT '[]'::jsonb,
  authentication_methods JSONB DEFAULT '[]'::jsonb,
  deployment_considerations JSONB DEFAULT '[]'::jsonb,
  common_vendors JSONB DEFAULT '[]'::jsonb,
  risk_level TEXT DEFAULT 'medium',
  onboarding_complexity TEXT DEFAULT 'moderate',
  management_overhead TEXT DEFAULT 'medium',
  common_issues JSONB DEFAULT '[]'::jsonb,
  best_practices JSONB DEFAULT '[]'::jsonb,
  portnox_recommendations JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS for device types
ALTER TABLE public.device_types_library ENABLE ROW LEVEL SECURITY;

-- Create policies for device types
CREATE POLICY "Device types are readable by authenticated users" 
ON public.device_types_library FOR SELECT 
USING (true);

CREATE POLICY "Users can create device types" 
ON public.device_types_library FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update device types" 
ON public.device_types_library FOR UPDATE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete device types" 
ON public.device_types_library FOR DELETE 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert comprehensive device types
INSERT INTO public.device_types_library (name, category, subcategory, description, os_types, typical_user_count_range, security_requirements, authentication_methods, deployment_considerations, common_vendors, risk_level, onboarding_complexity, management_overhead) VALUES 
  ('Corporate Laptops', 'End User Devices', 'Computers', 'Company-owned laptops managed by IT', '["Windows", "macOS", "Linux"]', '1-5000', '["Domain authentication", "Endpoint protection", "Full disk encryption"]', '["Active Directory", "802.1X", "Certificate authentication"]', '["Group policy management", "Software deployment", "Update management"]', '["Dell", "HP", "Lenovo", "Apple"]', 'medium', 'moderate', 'medium'),
  ('Desktop Workstations', 'End User Devices', 'Computers', 'Fixed desktop computers for office workers', '["Windows", "Linux", "macOS"]', '1-2000', '["Domain authentication", "Local security policies", "Asset management"]', '["Active Directory", "802.1X", "Local authentication"]', '["Physical security", "Wake-on-LAN", "Power management"]', '["Dell", "HP", "Lenovo", "Apple"]', 'low', 'simple', 'low'),
  ('Mobile Devices', 'End User Devices', 'Mobile BYOD', 'Personal smartphones accessing corporate resources', '["iOS", "Android"]', '1-10000', '["MDM enrollment", "App containerization", "Remote wipe capability"]', '["Certificate authentication", "MDM authentication", "App-based authentication"]', '["Privacy concerns", "App whitelisting", "Data separation"]', '["Apple", "Samsung", "Google"]', 'high', 'moderate', 'medium'),
  ('Tablets', 'End User Devices', 'Mobile BYOD', 'Personal tablets used for business purposes', '["iOS", "iPadOS", "Android"]', '1-3000', '["MDM management", "App restrictions", "Content filtering"]', '["Certificate authentication", "MDM enrollment", "SSO integration"]', '["Screen size variations", "App compatibility", "User experience"]', '["Apple", "Samsung", "Microsoft"]', 'medium', 'moderate', 'medium'),
  ('IoT Devices', 'IoT/OT Devices', 'Smart Devices', 'Internet of Things devices and sensors', '["Embedded Linux", "FreeRTOS", "Proprietary"]', '10-50000', '["Device certificates", "Network isolation", "Firmware security"]', '["Certificate-based", "PSK", "Network isolation"]', '["Lifecycle management", "Security updates", "Scalability"]', '["Various IoT manufacturers"]', 'high', 'complex', 'high'),
  ('Printers MFPs', 'Office Equipment', 'Printers', 'Multi-function network printers and copiers', '["Embedded Linux", "Proprietary"]', '1-500', '["Secure printing", "User authentication", "Audit logging"]', '["LDAP authentication", "Card-based authentication", "PIN codes"]', '["Print queue security", "Document retention", "Access controls"]', '["HP", "Canon", "Xerox", "Ricoh"]', 'medium', 'moderate', 'medium'),
  ('Security Cameras', 'IoT/OT Devices', 'Security Systems', 'Network-connected security cameras', '["Embedded Linux", "Proprietary"]', '10-1000', '["Video encryption", "Access controls", "Firmware security"]', '["Device certificates", "Username/password", "Network isolation"]', '["Bandwidth requirements", "Storage considerations", "Privacy compliance"]', '["Hikvision", "Axis", "Bosch"]', 'high', 'moderate', 'medium'),
  ('VoIP Phones', 'Communication Devices', 'IP Phones', 'Voice over IP phones for business communication', '["Embedded Linux", "Proprietary"]', '1-5000', '["SIP security", "Voice encryption", "Device authentication"]', '["SIP authentication", "Certificate-based", "802.1X"]', '["QoS requirements", "VLAN configuration", "Power over Ethernet"]', '["Cisco", "Polycom", "Yealink"]', 'medium', 'moderate', 'medium'),
  ('Medical Devices', 'IoT/OT Devices', 'Healthcare', 'Connected medical equipment and devices', '["Embedded", "Windows Embedded", "Linux"]', '10-1000', '["HIPAA compliance", "Device integrity", "Patient safety"]', '["Certificate-based", "Network isolation", "Device authentication"]', '["Regulatory compliance", "Safety requirements", "Uptime criticality"]', '["Philips", "GE Healthcare", "Siemens Healthineers"]', 'critical', 'complex', 'high'),
  ('Industrial Controls', 'Industrial/Manufacturing', 'Process Control', 'SCADA, PLC, and industrial control systems', '["Proprietary", "Real-time OS", "Windows Embedded"]', '1-500', '["Process integrity", "Change control", "Network isolation"]', '["Engineering authentication", "Network segmentation", "Protocol security"]', '["Safety systems", "Real-time requirements", "Redundancy"]', '["Siemens", "Allen-Bradley", "Schneider Electric"]', 'critical', 'complex', 'high'),
  ('POS Systems', 'Retail/Hospitality', 'Point of Sale', 'Point of sale terminals and payment systems', '["Windows", "Android", "Linux"]', '1-1000', '["PCI compliance", "Payment security", "Transaction integrity"]', '["Certificate authentication", "PIN-based", "Biometric"]', '["Payment compliance", "Transaction security", "Uptime requirements"]', '["Square", "NCR", "Verifone", "Ingenico"]', 'high', 'moderate', 'medium'),
  ('Digital Signage', 'Display Systems', 'Digital Displays', 'Digital signage and information displays', '["Android", "Windows", "Linux"]', '1-1000', '["Content security", "Remote management", "Display protection"]', '["Certificate-based", "Network authentication", "Remote management"]', '["Content management", "Remote monitoring", "Display scheduling"]', '["Samsung", "LG", "NEC", "Sony"]', 'low', 'simple', 'low');

-- Add deployment phases table
CREATE TABLE IF NOT EXISTS public.deployment_phases_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phase_order INTEGER DEFAULT 1,
  description TEXT,
  typical_duration_weeks INTEGER DEFAULT 2,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB DEFAULT '[]'::jsonb,
  stakeholders_involved JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  mitigation_strategies JSONB DEFAULT '[]'::jsonb,
  portnox_specific_tasks JSONB DEFAULT '[]'::jsonb,
  automation_opportunities JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS for deployment phases
ALTER TABLE public.deployment_phases_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deployment phases are readable by authenticated users" 
ON public.deployment_phases_library FOR SELECT 
USING (true);

CREATE POLICY "Users can manage deployment phases" 
ON public.deployment_phases_library FOR ALL 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert standard deployment phases
INSERT INTO public.deployment_phases_library (name, phase_order, description, typical_duration_weeks, prerequisites, deliverables, success_criteria, stakeholders_involved, risks, mitigation_strategies, portnox_specific_tasks) VALUES 
  ('Discovery & Planning', 1, 'Initial discovery of environment and detailed planning', 2, '["Stakeholder alignment", "Budget approval", "Access to environment"]', '["Network discovery report", "Implementation plan", "Timeline", "Resource requirements"]', '["Complete network inventory", "Stakeholder sign-off", "Resource allocation"]', '["Network team", "Security team", "Project manager"]', '["Incomplete discovery", "Access limitations", "Stakeholder misalignment"]', '["Thorough pre-planning", "Multiple discovery methods", "Clear communication"]', '["Deploy Portnox discovery tools", "Configure initial policies", "Establish baselines"]'),
  ('Pilot Implementation', 2, 'Small-scale pilot deployment for proof of concept', 3, '["Discovery completion", "Pilot group identification", "Test environment"]', '["Pilot deployment", "Initial policies", "User training", "Feedback collection"]', '["Successful pilot authentication", "User acceptance", "Performance validation"]', '["Pilot users", "IT support", "Security team"]', '["User resistance", "Technical issues", "Performance problems"]', '["User engagement", "Comprehensive testing", "Performance monitoring"]', '["Configure pilot policies", "Deploy certificates", "Monitor authentication"]'),
  ('Phased Rollout', 3, 'Gradual expansion to additional users and locations', 6, '["Pilot success", "Rollout plan", "Support processes"]', '["Phase-by-phase deployment", "User training", "Support documentation"]', '["Successful phase completions", "User adoption", "Issue resolution"]', '["All user groups", "Support team", "Management"]', '["Scale-related issues", "Support capacity", "User training gaps"]', '["Phased approach", "Support scaling", "Continuous training"]', '["Scale Portnox infrastructure", "Implement monitoring", "Optimize policies"]'),
  ('Full Production', 4, 'Complete deployment across all users and locations', 4, '["Phased rollout success", "Support readiness", "Monitoring in place"]', '["Complete deployment", "Full monitoring", "Documentation", "Handover"]', '["100% coverage", "Stable operations", "Performance targets met"]', '["All stakeholders", "Operations team"]', '["System instability", "Performance degradation", "Support issues"]', '["Comprehensive monitoring", "Performance optimization", "Robust support"]', '["Full Portnox deployment", "Complete policy enforcement", "Operational handover"]'),
  ('Optimization & Maintenance', 5, 'Ongoing optimization and maintenance activities', 999, '["Production deployment", "Operational procedures", "Monitoring systems"]', '["Performance reports", "Optimization recommendations", "Maintenance procedures"]', '["Optimal performance", "High availability", "Continuous improvement"]', '["Operations team", "Security team"]', '["Performance drift", "Security gaps", "Technology changes"]', '["Regular reviews", "Continuous monitoring", "Proactive maintenance"]', '["Policy optimization", "Performance tuning", "Security updates"]);

-- Expand authentication methods
INSERT INTO public.authentication_methods (name, method_type, description, security_level, configuration_complexity, portnox_integration, vendor_support) VALUES 
  ('RADIUS', 'protocol', 'Remote Authentication Dial-In User Service protocol', 'high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Built-in RADIUS server and client"}', '["Cisco", "Aruba", "Juniper", "Microsoft"]'),
  ('TACACS+', 'protocol', 'Terminal Access Controller Access Control System Plus', 'high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Native TACACS+ support"}', '["Cisco", "Juniper", "F5"]'),
  ('SAML SSO', 'federated', 'Security Assertion Markup Language Single Sign-On', 'high', 'complex', '{"supported": true, "integration_level": "certified", "configuration_guide": "SAML integration with major IdPs"}', '["Microsoft", "Okta", "Ping Identity", "Auth0"]'),
  ('OAuth 2.0', 'token_based', 'Open Authorization 2.0 framework', 'medium', 'medium', '{"supported": true, "integration_level": "supported", "configuration_guide": "OAuth integration capabilities"}', '["Google", "Microsoft", "Auth0", "Okta"]'),
  ('OpenID Connect', 'federated', 'Identity layer on top of OAuth 2.0', 'high', 'medium', '{"supported": true, "integration_level": "supported", "configuration_guide": "OIDC integration support"}', '["Microsoft", "Google", "Auth0"]'),
  ('Kerberos', 'ticket_based', 'Network authentication protocol using tickets', 'high', 'complex', '{"supported": true, "integration_level": "native", "configuration_guide": "Kerberos integration with AD"}', '["Microsoft Active Directory"]'),
  ('Certificate-based (PKI)', 'certificate', 'Public Key Infrastructure authentication', 'very_high', 'complex', '{"supported": true, "integration_level": "native", "configuration_guide": "Native PKI support with CA integration"}', '["Microsoft CA", "OpenSSL", "Various CAs"]'),
  ('Biometric Authentication', 'biometric', 'Fingerprint, facial recognition, etc.', 'high', 'medium', '{"supported": true, "integration_level": "partner", "configuration_guide": "Integration with biometric systems"}', '["BioConnect", "Crossmatch", "HID"]'),
  ('Smart Card Authentication', 'hardware_token', 'Smart card or CAC-based authentication', 'very_high', 'complex', '{"supported": true, "integration_level": "certified", "configuration_guide": "Smart card integration guide"}', '["HID", "Gemalto", "Oberthur"]'),
  ('Multi-Factor Authentication', 'multi_factor', 'Combination of multiple authentication factors', 'very_high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Native MFA capabilities"}', '["Microsoft", "Okta", "Duo", "RSA"]');

-- Add system integrations
CREATE TABLE IF NOT EXISTS public.system_integrations_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  vendor TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  description TEXT,
  portnox_compatibility JSONB DEFAULT '{}'::jsonb,
  api_endpoints JSONB DEFAULT '[]'::jsonb,
  authentication_methods JSONB DEFAULT '[]'::jsonb,
  data_sync_capabilities JSONB DEFAULT '[]'::jsonb,
  configuration_requirements JSONB DEFAULT '{}'::jsonb,
  known_limitations JSONB DEFAULT '[]'::jsonb,
  setup_complexity TEXT DEFAULT 'medium',
  maintenance_requirements TEXT,
  documentation_links JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS for system integrations
ALTER TABLE public.system_integrations_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System integrations are readable by authenticated users" 
ON public.system_integrations_library FOR SELECT 
USING (true);

CREATE POLICY "Users can manage system integrations" 
ON public.system_integrations_library FOR ALL 
USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert system integrations
INSERT INTO public.system_integrations_library (name, category, vendor, integration_type, description, portnox_compatibility, setup_complexity) VALUES 
  ('Microsoft Intune', 'MDM', 'Microsoft', 'API', 'Mobile device management integration', '{"supported": true, "sync_types": ["device_inventory", "compliance_status"], "real_time": true}', 'medium'),
  ('VMware Workspace ONE', 'UEM', 'VMware', 'API', 'Unified endpoint management', '{"supported": true, "sync_types": ["device_status", "user_assignments"], "real_time": true}', 'medium'),
  ('Jamf Pro', 'Apple_MDM', 'Jamf', 'API', 'Apple device management', '{"supported": true, "sync_types": ["mac_ios_devices", "compliance"], "real_time": true}', 'medium'),
  ('ServiceNow', 'ITSM', 'ServiceNow', 'REST_API', 'IT service management integration', '{"supported": true, "sync_types": ["incident_creation", "cmdb_sync"], "real_time": false}', 'complex'),
  ('Splunk', 'SIEM', 'Splunk', 'HTTP_Event_Collector', 'Security information and event management', '{"supported": true, "sync_types": ["log_forwarding", "event_correlation"], "real_time": true}', 'medium'),
  ('IBM QRadar', 'SIEM', 'IBM', 'REST_API', 'Security intelligence platform', '{"supported": true, "sync_types": ["event_forwarding", "threat_intelligence"], "real_time": true}', 'complex'),
  ('Microsoft Sentinel', 'SIEM', 'Microsoft', 'Log_Analytics_API', 'Cloud-native SIEM solution', '{"supported": true, "sync_types": ["log_streaming", "incident_response"], "real_time": true}', 'medium'),
  ('CrowdStrike', 'EDR', 'CrowdStrike', 'Falcon_API', 'Endpoint detection and response', '{"supported": true, "sync_types": ["endpoint_status", "threat_detection"], "real_time": true}', 'medium'),
  ('Carbon Black', 'EDR', 'VMware', 'REST_API', 'Endpoint protection platform', '{"supported": true, "sync_types": ["endpoint_events", "threat_hunting"], "real_time": true}', 'medium'),
  ('SentinelOne', 'EDR', 'SentinelOne', 'Management_API', 'Autonomous endpoint protection', '{"supported": true, "sync_types": ["agent_status", "threat_response"], "real_time": true}', 'medium');

-- Update triggers for new tables
CREATE TRIGGER update_device_types_library_updated_at BEFORE UPDATE ON public.device_types_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deployment_phases_library_updated_at BEFORE UPDATE ON public.deployment_phases_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_integrations_library_updated_at BEFORE UPDATE ON public.system_integrations_library
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();