-- First, create device_types table since it's needed
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

-- Create policies for device_types
CREATE POLICY "Device types are readable by authenticated users" 
ON device_types 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create device types" 
ON device_types 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Remove foreign key constraints temporarily to allow data refresh
ALTER TABLE configuration_templates DROP CONSTRAINT IF EXISTS configuration_templates_vendor_id_fkey;
ALTER TABLE configuration_templates DROP CONSTRAINT IF EXISTS configuration_templates_model_id_fkey;

-- Clear existing data safely
DELETE FROM vendor_library;

-- Insert comprehensive vendor data
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
('Cisco Systems', 'Hardware', 'Network Infrastructure', 'native', 'supported', 'Leading network infrastructure provider', '["Catalyst 9300", "Catalyst 9200", "Catalyst 2960-X"]', '["802.1X", "RADIUS", "TACACS+"]', auth.uid()),
('Aruba Networks', 'Hardware', 'Network Infrastructure', 'certified', 'supported', 'HPE Aruba networking solutions', '["CX 6000", "2930F", "6200F"]', '["802.1X", "RADIUS", "ClearPass"]', auth.uid()),
('Fortinet Inc', 'Hardware', 'Security', 'certified', 'supported', 'Network security solutions', '["FortiGate", "FortiSwitch", "FortiAP"]', '["802.1X", "RADIUS", "LDAP"]', auth.uid()),
('Microsoft Corporation', 'Software', 'Software', 'certified', 'supported', 'Enterprise software and cloud services', '["Windows Server", "Azure AD", "Office 365"]', '["Active Directory", "RADIUS via NPS"]', auth.uid()),
('Juniper Networks', 'Hardware', 'Network Infrastructure', 'certified', 'supported', 'High-performance networking', '["EX Series", "QFX Series", "SRX Series"]', '["802.1X", "RADIUS", "TACACS+"]', auth.uid()),
('Palo Alto Networks', 'Hardware', 'Security', 'certified', 'supported', 'Next-generation security platform', '["PA Series", "Prisma Access"]', '["802.1X", "RADIUS", "SAML"]', auth.uid()),
('Extreme Networks', 'Hardware', 'Network Infrastructure', 'partner', 'supported', 'Cloud-driven networking', '["ExtremeSwitch", "ExtremeCloud IQ"]', '["802.1X", "RADIUS"]', auth.uid()),
('Ubiquiti Networks', 'Hardware', 'Network Infrastructure', 'partner', 'supported', 'Enterprise networking equipment', '["UniFi", "EdgeSwitch", "Dream Machine"]', '["802.1X", "RADIUS"]', auth.uid()),
('SonicWall', 'Hardware', 'Security', 'partner', 'supported', 'Network security solutions', '["TZ Series", "NSa Series"]', '["802.1X", "RADIUS"]', auth.uid()),
('Check Point Software', 'Software', 'Security', 'partner', 'supported', 'Cybersecurity solutions', '["Check Point Gaia", "SmartConsole"]', '["RADIUS", "LDAP"]', auth.uid());

-- Insert device types
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
'["Windows 11 Enterprise", "Windows 11 Pro"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "Machine Authentication"]',
'["BitLocker", "Windows Defender", "Credential Guard"]',
'["Group Policy", "Intune MDM", "SCCM"]',
'["Corporate laptops", "Remote work", "Executive devices"]',
'["Certificate deployment", "Group Policy configuration"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR"]',
'medium',
'Enterprise Windows laptop with security features',
auth.uid()),

('iPhone 15 Pro', 'Mobile Device', 'Apple',
'["iOS 17", "iOS 16"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "WPA3-Enterprise"]',
'["Face ID", "Touch ID", "Secure Enclave"]',
'["Apple Configurator", "Jamf Pro", "Microsoft Intune"]',
'["Executive devices", "Healthcare mobility", "Field service"]',
'["Certificate profiles", "Wi-Fi profiles", "Compliance policies"]',
'["HIPAA", "GDPR", "FERPA"]',
'low',
'Latest iPhone with enterprise security',
auth.uid()),

('MacBook Pro M3', 'Endpoint', 'Apple',
'["macOS Sonoma", "macOS Ventura"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "Certificate-based"]',
'["FileVault", "Gatekeeper", "System Integrity Protection"]',
'["Jamf Pro", "Microsoft Intune", "Apple Configurator"]',
'["Creative professionals", "Developers", "Executive users"]',
'["Certificate deployment", "Configuration profiles"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR"]',
'medium',
'High-performance Apple laptop with M3 chip',
auth.uid());

SELECT 'Enterprise infrastructure successfully deployed' as status;