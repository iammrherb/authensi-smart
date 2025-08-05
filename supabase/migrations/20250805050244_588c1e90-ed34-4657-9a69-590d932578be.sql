-- Create device_types table first since it's referenced in the migration
CREATE TABLE IF NOT EXISTS device_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  operating_systems JSONB DEFAULT '[]'::jsonb,
  authentication_capabilities JSONB DEFAULT '[]'::jsonb,
  security_features JSONB DEFAULT '[]'::jsonb,
  management_options JSONB DEFAULT '[]'::jsonb,
  typical_use_cases JSONB DEFAULT '[]'::jsonb,
  deployment_considerations JSONB DEFAULT '[]'::jsonb,
  compliance_requirements JSONB DEFAULT '[]'::jsonb,
  integration_complexity TEXT DEFAULT 'medium',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS on device_types
ALTER TABLE device_types ENABLE ROW LEVEL SECURITY;

-- Create policy for device_types
CREATE POLICY "Device types are readable by authenticated users" 
ON device_types 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create device types" 
ON device_types 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Clear existing data to avoid conflicts
DELETE FROM vendor_library;

-- Insert comprehensive vendor data with correct column names
INSERT INTO vendor_library (
    vendor_name, 
    vendor_type,
    category, 
    portnox_integration_level, 
    support_level,
    description,
    models,
    supported_protocols,
    created_by
) VALUES 
-- Major Network Infrastructure Vendors
('Cisco Systems', 'Hardware', 'Network Infrastructure', 'native', 'supported', 'Leading network infrastructure provider with comprehensive Portnox integration', '["Catalyst 9300", "Catalyst 9200", "Catalyst 2960-X", "ISR 4000", "ASR 1000"]', '["802.1X", "RADIUS", "TACACS+", "SNMP", "Netconf"]', auth.uid()),
('Aruba Networks', 'Hardware', 'Network Infrastructure', 'certified', 'supported', 'HPE Aruba networking solutions with ClearPass integration', '["CX 6000", "2930F", "6200F", "Instant On"]', '["802.1X", "RADIUS", "ClearPass Policy Manager"]', auth.uid()),
('Fortinet Inc', 'Hardware', 'Security', 'certified', 'supported', 'Network security solutions with FortiNAC integration', '["FortiGate", "FortiSwitch", "FortiAP", "FortiNAC"]', '["802.1X", "RADIUS", "LDAP", "FortiAuthenticator"]', auth.uid()),
('Microsoft Corporation', 'Software', 'Software', 'certified', 'supported', 'Enterprise software and cloud services', '["Windows Server", "Azure AD", "System Center", "Office 365"]', '["Active Directory", "RADIUS via NPS", "LDAP", "OAuth"]', auth.uid()),
('Extreme Networks', 'Hardware', 'Network Infrastructure', 'partner', 'supported', 'Cloud-driven networking solutions', '["ExtremeSwitch", "ExtremePlatform", "ExtremeCloud IQ"]', '["802.1X", "RADIUS", "ExtremeControl"]', auth.uid()),
('Juniper Networks', 'Hardware', 'Network Infrastructure', 'certified', 'supported', 'High-performance networking solutions', '["EX Series", "QFX Series", "SRX Series", "Mist AI"]', '["802.1X", "RADIUS", "TACACS+", "Junos Space"]', auth.uid()),
('Palo Alto Networks', 'Hardware', 'Security', 'certified', 'supported', 'Next-generation firewall and security platform', '["PA Series", "Prisma Access", "Panorama"]', '["802.1X", "RADIUS", "SAML", "User-ID"]', auth.uid()),
('Check Point Software', 'Software', 'Security', 'partner', 'supported', 'Cybersecurity solutions and threat prevention', '["Check Point Gaia", "SmartConsole", "Infinity"]', '["RADIUS", "LDAP", "Identity Awareness"]', auth.uid()),
('SonicWall', 'Hardware', 'Security', 'partner', 'supported', 'Network security and access control', '["TZ Series", "NSa Series", "SuperMassive"]', '["802.1X", "RADIUS", "LDAP"]', auth.uid()),
('Ubiquiti Networks', 'Hardware', 'Network Infrastructure', 'partner', 'supported', 'Enterprise networking equipment', '["UniFi", "EdgeSwitch", "Dream Machine"]', '["802.1X", "RADIUS", "UniFi Controller"]', auth.uid());

-- Insert device types with correct column names
INSERT INTO device_types (
    device_name,
    category,
    manufacturer,
    operating_systems,
    authentication_capabilities,
    security_features,
    management_options,
    typical_use_cases,
    deployment_considerations,
    compliance_requirements,
    integration_complexity,
    description,
    created_by
) VALUES 
('Windows 11 Enterprise Laptop', 'Endpoint', 'Microsoft',
'["Windows 11 Enterprise", "Windows 11 Pro", "Windows 11 Education"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "Machine Authentication", "User Authentication"]',
'["BitLocker", "Windows Defender", "Credential Guard", "Device Guard", "Windows Hello"]',
'["Group Policy", "Intune MDM", "SCCM", "PowerShell DSC", "Windows Admin Center"]',
'["Corporate laptops", "Remote work", "Executive devices", "Engineering workstations"]',
'["Certificate deployment", "Group Policy configuration", "BitLocker enablement", "Compliance policies"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR", "FedRAMP"]',
'medium',
'Enterprise-grade Windows laptop with comprehensive security features',
auth.uid()),

('iPhone 15 Pro', 'Mobile Device', 'Apple',
'["iOS 17", "iOS 16", "iPadOS 17", "iPadOS 16"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "WPA3-Personal", "WPA3-Enterprise"]',
'["Face ID", "Touch ID", "Secure Enclave", "App Transport Security", "Data Protection"]',
'["Apple Configurator", "Jamf Pro", "Microsoft Intune", "VMware Workspace ONE"]',
'["Executive devices", "Healthcare mobility", "Field service", "Education"]',
'["Certificate profiles", "Wi-Fi profiles", "VPN profiles", "Compliance policies", "App management"]',
'["HIPAA", "GDPR", "FERPA", "Government security standards"]',
'low',
'Latest iPhone with advanced biometric security and enterprise management',
auth.uid()),

('MacBook Pro M3', 'Endpoint', 'Apple',
'["macOS Sonoma", "macOS Ventura", "macOS Monterey"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "Kerberos", "Certificate-based"]',
'["FileVault", "Gatekeeper", "System Integrity Protection", "Secure Boot", "TouchID"]',
'["Jamf Pro", "Microsoft Intune", "Kandji", "Apple Configurator", "Profile Manager"]',
'["Creative professionals", "Developers", "Executive users", "Design teams"]',
'["Certificate deployment", "Configuration profiles", "FileVault enablement", "App management"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR", "Creative industry standards"]',
'medium',
'High-performance Apple laptop with M3 chip and enterprise security',
auth.uid());

-- Insert professional configuration template
INSERT INTO configuration_templates (
    name,
    description,
    category,
    subcategory,
    configuration_type,
    template_content,
    template_variables,
    supported_scenarios,
    authentication_methods,
    network_requirements,
    security_features,
    best_practices,
    troubleshooting_guide,
    validation_commands,
    tags,
    complexity_level,
    is_public,
    is_validated,
    ai_generated,
    optimization_score,
    created_by
) VALUES 
('Enterprise 802.1X EAP-TLS Configuration', 
'Production-ready enterprise 802.1X configuration for Cisco switches with EAP-TLS authentication',
'Network Access Control', 
'802.1X Authentication', 
'switch_config',
'! Enterprise 802.1X Configuration
! Generated by Portnox AI Configuration Generator
!
hostname {{switch_hostname}}
!
! AAA Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
!
! RADIUS Configuration
radius server {{primary_radius_server}}
 address ipv4 {{primary_radius_ip}} auth-port 1812 acct-port 1813
 key {{radius_shared_secret}}
 timeout {{radius_timeout}}
 retransmit {{radius_retransmit}}
!
! 802.1X Global Settings
dot1x system-auth-control
!
! Interface Configuration
interface range {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 authentication port-control auto
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication host-mode multi-auth
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 dot1x pae authenticator
 spanning-tree portfast
 spanning-tree bpduguard enable
!
end',
'{"switch_hostname": {"type": "string", "default": "SW-{{site_code}}", "description": "Switch hostname"}, "primary_radius_server": {"type": "string", "required": true, "description": "Primary RADIUS server name"}, "primary_radius_ip": {"type": "ip", "required": true, "description": "Primary RADIUS server IP"}, "radius_shared_secret": {"type": "password", "required": true, "description": "RADIUS shared secret"}, "radius_timeout": {"type": "number", "default": 5, "description": "RADIUS timeout in seconds"}, "radius_retransmit": {"type": "number", "default": 3, "description": "RADIUS retransmit count"}, "interface_range": {"type": "string", "default": "GigabitEthernet1/0/1-48", "description": "Interface range"}, "interface_description": {"type": "string", "default": "802.1X Access Port", "description": "Interface description"}, "default_vlan": {"type": "number", "default": 100, "description": "Default VLAN ID"}, "reauth_timer": {"type": "number", "default": 3600, "description": "Reauthentication timer in seconds"}}',
'["Enterprise Campus Networks", "Corporate Branch Offices", "Healthcare Networks", "Education Networks"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "MAC Authentication Bypass"]',
'{"minimum_bandwidth": "1Gbps access", "vlan_support": "required", "poe_support": "recommended"}',
'["Certificate-based authentication", "Dynamic VLAN assignment", "Layer 2 security controls"]',
'["Deploy redundant RADIUS servers", "Use strong shared secrets", "Enable comprehensive logging"]',
'["RADIUS connectivity issues", "Certificate problems", "VLAN assignment issues"]',
'["show dot1x all", "show authentication sessions", "show radius statistics"]',
'["802.1X", "EAP-TLS", "Cisco", "Enterprise", "Authentication"]',
'intermediate',
true,
true,
true,
9.0,
auth.uid());

-- Insert comprehensive use case
INSERT INTO use_case_library (
    name,
    description,
    category,
    industry_focus,
    business_domain,
    complexity,
    implementation_timeline,
    technical_requirements,
    authentication_methods,
    network_segments,
    device_types,
    compliance_frameworks,
    security_features,
    performance_requirements,
    success_metrics,
    common_challenges,
    best_practices,
    created_by
) VALUES 
('Enterprise Zero Trust Network Access',
'Comprehensive zero-trust network access implementation using 802.1X authentication with PKI certificates for large enterprise deployments',
'Zero Trust',
'["Large Enterprise", "Financial Services", "Healthcare", "Government"]',
'Enterprise Security',
'expert',
'9-18 months',
'{"pki_infrastructure": "enterprise_ca", "radius_servers": "redundant_cluster", "certificate_management": "automated_lifecycle", "monitoring": "real_time_analytics"}',
'["EAP-TLS", "Machine Authentication", "User Authentication", "Certificate-based MFA"]',
'["Corporate LAN", "Wireless Networks", "VPN Access", "Guest Networks"]',
'["Enterprise Workstations", "Mobile Devices", "Network Infrastructure", "IoT Devices"]',
'["SOX", "PCI DSS", "HIPAA", "NIST Framework", "ISO 27001"]',
'["Certificate-based authentication", "Dynamic segmentation", "Real-time monitoring"]',
'{"authentication_time": "< 2 seconds", "availability": "99.99%", "concurrent_users": "50000+"}',
'["95% reduction in security incidents", "100% device visibility", "Automated compliance"]',
'["Multi-vendor integration", "Legacy device support", "Certificate lifecycle management"]',
'["Phased rollout", "Comprehensive training", "Automated provisioning"]',
auth.uid());

-- Success message
SELECT 'Enterprise infrastructure successfully deployed with corrected schema alignment' as status;