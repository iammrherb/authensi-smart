-- Enhanced site management with comprehensive NAC deployment tracking
ALTER TABLE sites ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS site_id text UNIQUE;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS timeline_start date;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS timeline_end date;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS current_phase text DEFAULT 'planning';
ALTER TABLE sites ADD COLUMN IF NOT EXISTS progress_percentage integer DEFAULT 0;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true;

-- Comprehensive NAC deployment configuration
ALTER TABLE sites ADD COLUMN IF NOT EXISTS deployment_config jsonb DEFAULT '{
  "network": {
    "wired_vendors": [],
    "wireless_vendors": [],
    "firewall_vendors": [],
    "switch_vendors": []
  },
  "security": {
    "edy_integration": false,
    "idp_integration": "",
    "mfa_enabled": false,
    "vpn_integration": false,
    "saml_enabled": false,
    "openid_enabled": false,
    "microsoft_eam": false,
    "siem_integration": false,
    "tacacs_enabled": false,
    "ztna_enabled": false
  },
  "authentication": {
    "auth_type": "",
    "eap_tls": false,
    "eap_ttls": false,
    "mschap": false,
    "pap": false,
    "mab": false
  },
  "user_management": {
    "iot_onboarding": false,
    "guest_access": false,
    "contractor_access": false,
    "deployment_mode": "agent",
    "mdm_integration": false,
    "active_directory": false,
    "gpo_integration": false
  },
  "identity_providers": [],
  "sso_mfa_config": {},
  "device_types": {
    "laptops": 0,
    "desktops": 0,
    "mobile_ios": 0,
    "mobile_android": 0,
    "tablets": 0,
    "printers": 0,
    "scanners": 0,
    "ip_phones": 0,
    "ip_cameras": 0,
    "hvac": 0,
    "iot_devices": 0,
    "ot_devices": 0
  },
  "user_types": {
    "employees": 0,
    "contractors": 0,
    "guests": 0,
    "service_accounts": 0
  },
  "go_live_date": null,
  "vendor_details": {},
  "use_cases": [],
  "implementation_notes": ""
}'::jsonb;

-- Enhanced user roles for comprehensive team management
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'solution_engineer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'technical_account_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'product_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'customer_contact';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'technical_owner';

-- Create comprehensive NAC library data
INSERT INTO use_case_library (name, category, subcategory, description, complexity, business_value, technical_requirements, portnox_features, supported_vendors, compliance_frameworks, tags) VALUES
('802.1X Wired Authentication', 'Authentication', 'Wired', 'Implement 802.1X authentication for wired network access', 'medium', 'Enhanced security through certificate-based authentication', '["Switch 802.1X support", "RADIUS server", "Certificate infrastructure"]', '["RADIUS Integration", "Certificate Management", "Policy Engine"]', '["Cisco", "Aruba", "Juniper", "HPE"]', '["SOX", "PCI-DSS", "HIPAA"]', '["802.1X", "wired", "certificates"]'),
('Guest Network Access', 'Access Control', 'Guest', 'Secure guest network access with time-based restrictions', 'low', 'Improved guest experience while maintaining security', '["Guest portal", "VLAN segmentation", "Time restrictions"]', '["Guest Portal", "VLAN Assignment", "Time-based Policies"]', '["Cisco", "Aruba", "Ruckus"]', '["PCI-DSS"]', '["guest", "portal", "vlan"]'),
('IoT Device Onboarding', 'Device Management', 'IoT', 'Automated onboarding and profiling of IoT devices', 'high', 'Automated security for IoT devices', '["Device profiling", "MAC address management", "Policy automation"]', '["Device Profiling", "MAC Authentication", "Policy Automation"]', '["Cisco", "Aruba", "Meraki"]', '["NIST", "IEC62443"]', '["iot", "profiling", "automation"]')
ON CONFLICT DO NOTHING;

INSERT INTO requirements_library (title, category, subcategory, description, requirement_type, priority, acceptance_criteria, verification_methods, compliance_frameworks, tags) VALUES
('Network Infrastructure Assessment', 'Infrastructure', 'Network', 'Complete assessment of network infrastructure for NAC deployment', 'functional', 'high', '["Network topology documented", "Switch inventory complete", "VLAN design validated"]', '["Documentation review", "Network scan", "Configuration audit"]', '["SOX", "PCI-DSS"]', '["infrastructure", "assessment"]'),
('Identity Provider Integration', 'Integration', 'Authentication', 'Integration with existing identity providers', 'functional', 'high', '["SSO functionality verified", "User sync operational", "Group mapping complete"]', '["SSO test", "User provisioning test", "Group sync validation"]', '["SAML", "OAuth"]', '["integration", "sso", "identity"]'),
('Policy Engine Configuration', 'Security', 'Policies', 'Configuration of security policies and access controls', 'functional', 'critical', '["Policies defined and tested", "Access controls validated", "Compliance requirements met"]', '["Policy test", "Access validation", "Compliance audit"]', '["SOX", "PCI-DSS", "HIPAA"]', '["policies", "security", "compliance"]')
ON CONFLICT DO NOTHING;

INSERT INTO test_case_library (name, category, description, test_type, priority, test_steps, expected_results, validation_criteria, prerequisites, tags) VALUES
('802.1X Authentication Test', 'Authentication', 'Verify 802.1X authentication works correctly', 'functional', 'high', '["Connect device to network", "Attempt authentication", "Verify access granted", "Check policy application"]', '["Authentication successful", "Correct VLAN assigned", "Policy applied", "Access granted"]', '["Authentication logs show success", "Device in correct VLAN", "Policy compliance verified"]', '["802.1X configured switch", "Test device with certificate", "RADIUS server operational"]', '["802.1X", "authentication", "functional"]'),
('Guest Portal Access Test', 'Portal', 'Test guest portal functionality and access controls', 'functional', 'medium', '["Access guest portal", "Complete registration", "Accept terms", "Verify network access"]', '["Portal loads correctly", "Registration successful", "Network access granted", "Time restrictions applied"]', '["Portal accessibility", "Registration completion", "Network connectivity", "Policy enforcement"]', '["Guest portal configured", "Guest VLAN available", "Time policies set"]', '["guest", "portal", "access"]'),
('Policy Enforcement Test', 'Security', 'Verify security policies are properly enforced', 'security', 'critical', '["Attempt unauthorized access", "Test policy violations", "Verify quarantine", "Test remediation"]', '["Unauthorized access blocked", "Policy violations detected", "Quarantine applied", "Remediation successful"]', '["Access denied logs", "Policy violation alerts", "Quarantine status", "Remediation completion"]', '["Security policies configured", "Quarantine VLAN ready", "Monitoring tools active"]', '["security", "policies", "enforcement"]')
ON CONFLICT DO NOTHING;

INSERT INTO vendor_library (vendor_name, vendor_type, category, models, supported_protocols, integration_methods, portnox_compatibility, status) VALUES
('Cisco', 'Network', 'Switches', '["Catalyst 9000", "Catalyst 3850", "Catalyst 2960"]', '["802.1X", "RADIUS", "TACACS+"]', '["RADIUS", "SNMP", "API"]', '{"certified": true, "integration_level": "full", "support_tier": "premier"}', 'active'),
('Aruba', 'Network', 'Wireless', '["WiFi 6 Access Points", "Mobility Controllers", "ClearPass"]', '["802.1X", "WPA3", "RADIUS"]', '["RADIUS", "REST API", "SNMP"]', '{"certified": true, "integration_level": "full", "support_tier": "premier"}', 'active'),
('Microsoft', 'Identity', 'Identity Provider', '["Azure AD", "Active Directory", "Entra ID"]', '["SAML", "OAuth", "OpenID Connect"]', '["SAML", "OAuth", "Graph API"]', '{"certified": true, "integration_level": "full", "support_tier": "premier"}', 'active'),
('Okta', 'Identity', 'Identity Provider', '["Workforce Identity", "Customer Identity"]', '["SAML", "OAuth", "OpenID Connect"]', '["SAML", "OAuth", "REST API"]', '{"certified": true, "integration_level": "full", "support_tier": "premier"}', 'active')
ON CONFLICT DO NOTHING;

-- Create comprehensive project template
INSERT INTO project_templates (name, industry, deployment_type, security_level, description, compliance_frameworks, use_cases, requirements, authentication_workflows, vendor_configurations, test_cases, network_requirements, timeline_template) VALUES
('Enterprise NAC Deployment', 'Enterprise', 'full', 'high', 'Comprehensive NAC deployment for enterprise environments', '["SOX", "PCI-DSS", "HIPAA"]', 
'[{"use_case_id": "802.1X Wired Authentication", "priority": "high"}, {"use_case_id": "Guest Network Access", "priority": "medium"}, {"use_case_id": "IoT Device Onboarding", "priority": "high"}]',
'[{"requirement_id": "Network Infrastructure Assessment", "status": "required"}, {"requirement_id": "Identity Provider Integration", "status": "required"}, {"requirement_id": "Policy Engine Configuration", "status": "required"}]',
'[{"workflow_type": "802.1X", "complexity": "medium", "priority": "high"}]',
'[{"vendor": "Cisco", "role": "primary_switch", "models": ["Catalyst 9000"]}, {"vendor": "Microsoft", "role": "identity_provider", "models": ["Azure AD"]}]',
'[{"test_case_id": "802.1X Authentication Test", "phase": "implementation"}, {"test_case_id": "Policy Enforcement Test", "phase": "validation"}]',
'[{"component": "Core Switches", "requirement": "802.1X support"}, {"component": "RADIUS Server", "requirement": "High availability"}]',
'{"phases": [{"name": "Discovery", "duration_weeks": 2}, {"name": "Design", "duration_weeks": 3}, {"name": "Implementation", "duration_weeks": 8}, {"name": "Testing", "duration_weeks": 2}, {"name": "Go-Live", "duration_weeks": 1}]}'
) ON CONFLICT DO NOTHING;

-- Auto-assign first user as global admin function enhancement
CREATE OR REPLACE FUNCTION auto_assign_global_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user and no global admin exists
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  ) THEN
    INSERT INTO user_roles (user_id, role, scope_type, assigned_by)
    VALUES (NEW.id, 'project_owner', 'global', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign global admin to first user
DROP TRIGGER IF EXISTS auto_assign_first_admin ON profiles;
CREATE TRIGGER auto_assign_first_admin
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_assign_global_admin();