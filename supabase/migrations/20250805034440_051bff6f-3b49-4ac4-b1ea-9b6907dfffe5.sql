-- Seed comprehensive vendor library with all major vendors for NAC implementation
-- This migration adds vendors for Wired/Wireless, VPN, Security, Firewalls, EDR, SIEM, MFA, SSO, TACACS, SAML, IDP

-- First check if vendors already exist to avoid duplicates
DO $$ 
BEGIN
  -- Only insert vendors if the vendor_library is empty or has very few entries
  IF (SELECT COUNT(*) FROM vendor_library) < 10 THEN

    -- Insert NAC Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Portnox', 'NAC', 'NAC', 'Network Access Control solution with comprehensive device and user authentication', 'native', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ISE', 'NAC', 'NAC', 'Cisco Identity Services Engine for network access control and policy enforcement', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Aruba ClearPass', 'NAC', 'NAC', 'HPE Aruba network access control and policy management platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('ForeScout CounterACT', 'NAC', 'NAC', 'Network security platform for visibility and control of connected devices', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert Wired Switch Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Cisco Catalyst', 'Switch', 'Wired Switch', 'Enterprise-grade wired switching solutions with advanced security features', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('HPE/Aruba Switches', 'Switch', 'Wired Switch', 'Campus and data center switching solutions with intelligent automation', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Juniper EX Series', 'Switch', 'Wired Switch', 'High-performance Ethernet switches for enterprise networks', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Extreme Networks', 'Switch', 'Wired Switch', 'Cloud-driven networking solutions with advanced analytics', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert Wireless Access Point Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Cisco Meraki', 'Access Point', 'Wireless', 'Cloud-managed wireless access points with advanced security', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('HPE/Aruba Instant', 'Access Point', 'Wireless', 'Enterprise wireless access points with AI-powered optimization', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ruckus Wireless', 'Access Point', 'Wireless', 'High-performance wireless solutions for demanding environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ubiquiti UniFi', 'Access Point', 'Wireless', 'Scalable enterprise WiFi system with centralized management', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert Firewall Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Palo Alto Networks', 'Firewall', 'Firewall', 'Next-generation firewalls with advanced threat prevention', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Fortinet FortiGate', 'Firewall', 'Firewall', 'Integrated security platform with high-performance firewall', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Check Point', 'Firewall', 'Firewall', 'Advanced threat prevention and security management platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('SonicWall', 'Firewall', 'Firewall', 'Scalable network security solutions for all business sizes', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ASA', 'Firewall', 'Firewall', 'Adaptive security appliances for network protection', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert VPN Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Cisco AnyConnect', 'VPN', 'VPN', 'Secure mobility client for remote access VPN', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Palo Alto GlobalProtect', 'VPN', 'VPN', 'Next-generation VPN solution with advanced security', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Fortinet FortiClient', 'VPN', 'VPN', 'Integrated endpoint security and VPN client', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Pulse Secure', 'VPN', 'VPN', 'Secure access solution for hybrid IT environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert EDR/XDR Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('CrowdStrike Falcon', 'Security', 'EDR', 'Cloud-native endpoint protection with AI-powered threat detection', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('SentinelOne', 'Security', 'EDR', 'Autonomous endpoint protection platform with behavioral AI', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Microsoft Defender', 'Security', 'EDR', 'Enterprise endpoint detection and response solution', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Palo Alto Cortex XDR', 'Security', 'XDR', 'Extended detection and response across endpoints, networks, and cloud', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert SIEM/MDR Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Splunk', 'Security', 'SIEM', 'Security information and event management platform', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('IBM QRadar', 'Security', 'SIEM', 'Security intelligence platform for threat detection and response', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Microsoft Sentinel', 'Security', 'SIEM', 'Cloud-native security information and event management', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('LogRhythm', 'Security', 'SIEM', 'Security intelligence and analytics platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert MFA Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Microsoft Authenticator', 'Authentication', 'MFA', 'Multi-factor authentication app for Microsoft ecosystem', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Okta Verify', 'Authentication', 'MFA', 'Multi-factor authentication solution for enterprise', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Duo Security', 'Authentication', 'MFA', 'Two-factor authentication and device trust platform', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('RSA SecurID', 'Authentication', 'MFA', 'Multi-factor authentication with hardware tokens', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('YubiKey', 'Authentication', 'MFA', 'Hardware security keys for strong authentication', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert SSO/Identity Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Microsoft Azure AD', 'Identity', 'SSO', 'Cloud-based identity and access management service', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Okta', 'Identity', 'SSO', 'Identity and access management platform for enterprises', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ping Identity', 'Identity', 'SSO', 'Enterprise identity and access management solutions', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Auth0', 'Identity', 'SSO', 'Identity platform for application builders and developers', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('OneLogin', 'Identity', 'SSO', 'Unified access management platform for enterprises', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert RADIUS/TACACS Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Microsoft NPS', 'Authentication', 'RADIUS', 'Network Policy Server for RADIUS authentication', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('FreeRADIUS', 'Authentication', 'RADIUS', 'Open source RADIUS server implementation', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ISE RADIUS', 'Authentication', 'RADIUS', 'RADIUS service within Cisco Identity Services Engine', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco TACACS+', 'Authentication', 'TACACS', 'Terminal Access Controller Access-Control System Plus', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert PKI/Certificate Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('Microsoft ADCS', 'Certificate', 'PKI', 'Active Directory Certificate Services for enterprise PKI', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('DigiCert', 'Certificate', 'PKI', 'Global digital certificate authority and PKI solutions', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Entrust', 'Certificate', 'PKI', 'Identity-based security solutions and PKI services', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('AWS Certificate Manager', 'Certificate', 'PKI', 'Managed PKI service for AWS cloud environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

    -- Insert Monitoring/Management Vendors
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    ('SolarWinds', 'Management', 'Monitoring', 'Network performance monitoring and management tools', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('PRTG', 'Management', 'Monitoring', 'Network monitoring solution for infrastructure oversight', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Nagios', 'Management', 'Monitoring', 'Open source network and infrastructure monitoring', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Datadog', 'Management', 'Monitoring', 'Cloud-based monitoring and analytics platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

  END IF;
END $$;

-- Update vendor configurations with protocol support and integration details
UPDATE vendor_library SET 
  supported_protocols = '["802.1X", "RADIUS", "LDAP", "SAML", "OAuth"]',
  integration_methods = '["API", "RADIUS", "SNMP", "Syslog"]',
  portnox_compatibility = '{"version": "latest", "tested": true, "certified": true}'
WHERE vendor_name IN ('Portnox', 'Cisco ISE', 'Aruba ClearPass', 'Microsoft Azure AD', 'Okta');

UPDATE vendor_library SET 
  supported_protocols = '["802.1X", "LLDP", "SNMP", "SSH"]',
  integration_methods = '["SNMP", "SSH", "API", "Syslog"]',
  portnox_compatibility = '{"version": "latest", "tested": true}'
WHERE category IN ('Wired Switch', 'Wireless');

UPDATE vendor_library SET 
  supported_protocols = '["IPSec", "SSL/TLS", "SAML", "RADIUS"]',
  integration_methods = '["API", "Syslog", "SNMP"]',
  portnox_compatibility = '{"integration": "supported", "tested": true}'
WHERE category IN ('Firewall', 'VPN');

-- Add resource tags for categorization using correct column names
INSERT INTO resource_tags (name, color_code, description, created_by) VALUES
('Enterprise-Ready', '#10B981', 'Suitable for large enterprise deployments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('SMB-Friendly', '#3B82F6', 'Ideal for small to medium business environments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Cloud-Native', '#8B5CF6', 'Cloud-first architecture and deployment', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('On-Premises', '#F59E0B', 'Traditional on-premises deployment model', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('High-Security', '#EF4444', 'Enhanced security features for sensitive environments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Cost-Effective', '#06B6D4', 'Budget-friendly solution with good ROI', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Quick-Deploy', '#84CC16', 'Fast deployment and time-to-value', (SELECT id FROM profiles ORDER BY created_at LIMIT 1))
ON CONFLICT (name) DO NOTHING;

-- Create resource categories for better organization
INSERT INTO resource_categories (category_name, category_type, description, icon_name, color_scheme, created_by) VALUES
('Network Infrastructure', 'vendor', 'Core networking components including switches, routers, and wireless', 'Network', '#3B82F6', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Security Solutions', 'vendor', 'Security tools including firewalls, EDR, SIEM, and VPN', 'Shield', '#EF4444', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Identity & Access', 'vendor', 'Authentication, SSO, MFA, and identity management solutions', 'Users', '#8B5CF6', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Monitoring & Management', 'vendor', 'Network monitoring, management, and analytics tools', 'BarChart', '#10B981', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
('Compliance & Governance', 'vendor', 'Solutions for regulatory compliance and governance', 'FileCheck', '#F59E0B', (SELECT id FROM profiles ORDER BY created_at LIMIT 1))
ON CONFLICT (category_name) DO NOTHING;