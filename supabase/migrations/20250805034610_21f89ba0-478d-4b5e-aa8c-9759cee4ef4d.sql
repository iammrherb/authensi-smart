-- Seed comprehensive vendor library with all major vendors for NAC implementation
-- Using correct column names for resource_categories: name, resource_type, description, color_code, created_by

-- First check if vendors already exist to avoid duplicates
DO $$ 
BEGIN
  -- Only insert vendors if the vendor_library is empty or has very few entries
  IF (SELECT COUNT(*) FROM vendor_library) < 10 THEN

    -- Insert comprehensive vendor list for all categories
    INSERT INTO vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status, created_by) VALUES
    -- NAC Vendors
    ('Portnox', 'NAC', 'NAC', 'Network Access Control solution with comprehensive device and user authentication', 'native', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ISE', 'NAC', 'NAC', 'Cisco Identity Services Engine for network access control and policy enforcement', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Aruba ClearPass', 'NAC', 'NAC', 'HPE Aruba network access control and policy management platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('ForeScout CounterACT', 'NAC', 'NAC', 'Network security platform for visibility and control of connected devices', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- Wired Switch Vendors
    ('Cisco Catalyst', 'Switch', 'Wired Switch', 'Enterprise-grade wired switching solutions with advanced security features', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('HPE/Aruba Switches', 'Switch', 'Wired Switch', 'Campus and data center switching solutions with intelligent automation', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Juniper EX Series', 'Switch', 'Wired Switch', 'High-performance Ethernet switches for enterprise networks', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Extreme Networks', 'Switch', 'Wired Switch', 'Cloud-driven networking solutions with advanced analytics', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- Wireless Access Point Vendors
    ('Cisco Meraki', 'Access Point', 'Wireless', 'Cloud-managed wireless access points with advanced security', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('HPE/Aruba Instant', 'Access Point', 'Wireless', 'Enterprise wireless access points with AI-powered optimization', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ruckus Wireless', 'Access Point', 'Wireless', 'High-performance wireless solutions for demanding environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ubiquiti UniFi', 'Access Point', 'Wireless', 'Scalable enterprise WiFi system with centralized management', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- Firewall Vendors
    ('Palo Alto Networks', 'Firewall', 'Firewall', 'Next-generation firewalls with advanced threat prevention', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Fortinet FortiGate', 'Firewall', 'Firewall', 'Integrated security platform with high-performance firewall', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Check Point', 'Firewall', 'Firewall', 'Advanced threat prevention and security management platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('SonicWall', 'Firewall', 'Firewall', 'Scalable network security solutions for all business sizes', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ASA', 'Firewall', 'Firewall', 'Adaptive security appliances for network protection', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- VPN Vendors
    ('Cisco AnyConnect', 'VPN', 'VPN', 'Secure mobility client for remote access VPN', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Palo Alto GlobalProtect', 'VPN', 'VPN', 'Next-generation VPN solution with advanced security', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Fortinet FortiClient', 'VPN', 'VPN', 'Integrated endpoint security and VPN client', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Pulse Secure', 'VPN', 'VPN', 'Secure access solution for hybrid IT environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- EDR/XDR Vendors
    ('CrowdStrike Falcon', 'Security', 'EDR', 'Cloud-native endpoint protection with AI-powered threat detection', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('SentinelOne', 'Security', 'EDR', 'Autonomous endpoint protection platform with behavioral AI', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Microsoft Defender', 'Security', 'EDR', 'Enterprise endpoint detection and response solution', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Palo Alto Cortex XDR', 'Security', 'XDR', 'Extended detection and response across endpoints, networks, and cloud', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- SIEM/MDR Vendors
    ('Splunk', 'Security', 'SIEM', 'Security information and event management platform', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('IBM QRadar', 'Security', 'SIEM', 'Security intelligence platform for threat detection and response', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Microsoft Sentinel', 'Security', 'SIEM', 'Cloud-native security information and event management', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('LogRhythm', 'Security', 'SIEM', 'Security intelligence and analytics platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- MFA Vendors
    ('Microsoft Authenticator', 'Authentication', 'MFA', 'Multi-factor authentication app for Microsoft ecosystem', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Okta Verify', 'Authentication', 'MFA', 'Multi-factor authentication solution for enterprise', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Duo Security', 'Authentication', 'MFA', 'Two-factor authentication and device trust platform', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('RSA SecurID', 'Authentication', 'MFA', 'Multi-factor authentication with hardware tokens', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('YubiKey', 'Authentication', 'MFA', 'Hardware security keys for strong authentication', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- SSO/Identity Vendors
    ('Microsoft Azure AD', 'Identity', 'SSO', 'Cloud-based identity and access management service', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Okta', 'Identity', 'SSO', 'Identity and access management platform for enterprises', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Ping Identity', 'Identity', 'SSO', 'Enterprise identity and access management solutions', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Auth0', 'Identity', 'SSO', 'Identity platform for application builders and developers', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('OneLogin', 'Identity', 'SSO', 'Unified access management platform for enterprises', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- RADIUS/TACACS Vendors
    ('Microsoft NPS', 'Authentication', 'RADIUS', 'Network Policy Server for RADIUS authentication', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('FreeRADIUS', 'Authentication', 'RADIUS', 'Open source RADIUS server implementation', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco ISE RADIUS', 'Authentication', 'RADIUS', 'RADIUS service within Cisco Identity Services Engine', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Cisco TACACS+', 'Authentication', 'TACACS', 'Terminal Access Controller Access-Control System Plus', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- PKI/Certificate Vendors
    ('Microsoft ADCS', 'Certificate', 'PKI', 'Active Directory Certificate Services for enterprise PKI', 'certified', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('DigiCert', 'Certificate', 'PKI', 'Global digital certificate authority and PKI solutions', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Entrust', 'Certificate', 'PKI', 'Identity-based security solutions and PKI services', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('AWS Certificate Manager', 'Certificate', 'PKI', 'Managed PKI service for AWS cloud environments', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    
    -- Monitoring/Management Vendors
    ('SolarWinds', 'Management', 'Monitoring', 'Network performance monitoring and management tools', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('PRTG', 'Management', 'Monitoring', 'Network monitoring solution for infrastructure oversight', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Nagios', 'Management', 'Monitoring', 'Open source network and infrastructure monitoring', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)),
    ('Datadog', 'Management', 'Monitoring', 'Cloud-based monitoring and analytics platform', 'supported', 'active', (SELECT id FROM profiles ORDER BY created_at LIMIT 1));

  END IF;
END $$;

-- Add resource tags for categorization using correct column names
INSERT INTO resource_tags (name, color_code, description, created_by) 
SELECT 'Enterprise-Ready', '#10B981', 'Suitable for large enterprise deployments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_tags WHERE name = 'Enterprise-Ready');

INSERT INTO resource_tags (name, color_code, description, created_by) 
SELECT 'SMB-Friendly', '#3B82F6', 'Ideal for small to medium business environments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_tags WHERE name = 'SMB-Friendly');

INSERT INTO resource_tags (name, color_code, description, created_by) 
SELECT 'Cloud-Native', '#8B5CF6', 'Cloud-first architecture and deployment', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_tags WHERE name = 'Cloud-Native');

INSERT INTO resource_tags (name, color_code, description, created_by) 
SELECT 'High-Security', '#EF4444', 'Enhanced security features for sensitive environments', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_tags WHERE name = 'High-Security');

-- Create resource categories using correct column names
INSERT INTO resource_categories (name, resource_type, description, color_code, created_by) 
SELECT 'Network Infrastructure', 'vendor', 'Core networking components including switches, routers, and wireless', '#3B82F6', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_categories WHERE name = 'Network Infrastructure');

INSERT INTO resource_categories (name, resource_type, description, color_code, created_by) 
SELECT 'Security Solutions', 'vendor', 'Security tools including firewalls, EDR, SIEM, and VPN', '#EF4444', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_categories WHERE name = 'Security Solutions');

INSERT INTO resource_categories (name, resource_type, description, color_code, created_by) 
SELECT 'Identity & Access', 'vendor', 'Authentication, SSO, MFA, and identity management solutions', '#8B5CF6', (SELECT id FROM profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM resource_categories WHERE name = 'Identity & Access');