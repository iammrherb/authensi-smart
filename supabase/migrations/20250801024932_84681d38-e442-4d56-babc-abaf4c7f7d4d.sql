-- Add NAC vendors to vendor_library
INSERT INTO vendor_library (vendor_name, vendor_type, category, description, models, supported_protocols, integration_methods, portnox_integration_level, portnox_compatibility, configuration_templates, documentation_links, support_level, status, created_by) VALUES

-- Forescout
('Forescout', 'Network Access Control', 'NAC', 'Enterprise NAC solution with comprehensive device visibility and control', 
'["CounterACT", "Virtual Appliance", "eyeExtend"]'::jsonb, 
'["802.1X", "MAB", "RADIUS", "SNMP", "API"]'::jsonb,
'["REST API", "RADIUS", "SNMP", "Agent-based"]'::jsonb, 
'certified', 
'{"level": "certified", "features": ["device_profiling", "policy_enforcement", "quarantine"]}'::jsonb,
'{"available": true, "count": 5}'::jsonb,
'[{"title": "Forescout Integration Guide", "url": "#", "type": "setup"}, {"title": "API Documentation", "url": "#", "type": "api"}]'::jsonb,
'full', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Cisco ISE
('Cisco ISE', 'Identity Services Engine', 'NAC', 'Cisco Identity Services Engine for network access control and security policy enforcement',
'["ISE 3415", "ISE 3595", "Virtual Machine", "SNS-3415-K9", "SNS-3595-K9"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "TACACS+", "pxGrid", "CoA"]'::jsonb,
'["pxGrid", "REST API", "RADIUS", "TACACS+", "ERS API"]'::jsonb,
'certified',
'{"level": "certified", "features": ["policy_sync", "endpoint_profiling", "posture_assessment"]}'::jsonb,
'{"available": true, "count": 12}'::jsonb,
'[{"title": "ISE Integration Guide", "url": "#", "type": "setup"}, {"title": "ERS API Guide", "url": "#", "type": "api"}, {"title": "pxGrid Integration", "url": "#", "type": "integration"}]'::jsonb,
'full', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Aruba ClearPass
('Aruba ClearPass', 'Policy Manager', 'NAC', 'Aruba ClearPass Policy Manager for network access control and guest management',
'["CPPM", "ClearPass Virtual", "C1000", "C2000", "C3000"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "TACACS+", "OnGuard", "OnConnect"]'::jsonb,
'["REST API", "RADIUS", "TACACS+", "SNMP", "Syslog"]'::jsonb,
'certified',
'{"level": "certified", "features": ["endpoint_classification", "policy_enforcement", "guest_access"]}'::jsonb,
'{"available": true, "count": 8}'::jsonb,
'[{"title": "ClearPass Integration", "url": "#", "type": "setup"}, {"title": "REST API Guide", "url": "#", "type": "api"}]'::jsonb,
'full', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Fortinet FortiNAC
('Fortinet', 'FortiNAC', 'NAC', 'Fortinet FortiNAC for network access control and visibility',
'["FortiNAC-VM", "FortiNAC-1000F", "FortiNAC-3000F", "FortiNAC-8000F"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "SNMP", "WMI", "SSH"]'::jsonb,
'["REST API", "RADIUS", "SNMP", "FortiLink"]'::jsonb,
'supported',
'{"level": "supported", "features": ["device_discovery", "vulnerability_assessment", "compliance"]}'::jsonb,
'{"available": true, "count": 6}'::jsonb,
'[{"title": "FortiNAC Integration", "url": "#", "type": "setup"}, {"title": "API Reference", "url": "#", "type": "api"}]'::jsonb,
'full', 'active', (SELECT id FROM profiles LIMIT 1)),

-- SecureW2
('SecureW2', 'JoinNow', 'NAC', 'SecureW2 JoinNow for secure wireless onboarding and certificate management',
'["Cloud Platform", "On-Premise", "Hybrid"]'::jsonb,
'["802.1X", "PEAP", "EAP-TLS", "SCEP", "PKI"]'::jsonb,
'["REST API", "SCEP", "RADIUS", "PKI Integration"]'::jsonb,
'supported',
'{"level": "supported", "features": ["certificate_provisioning", "onboarding", "wireless_security"]}'::jsonb,
'{"available": true, "count": 4}'::jsonb,
'[{"title": "SecureW2 Integration", "url": "#", "type": "setup"}, {"title": "API Documentation", "url": "#", "type": "api"}]'::jsonb,
'partial', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Microsoft NPS
('Microsoft', 'Network Policy Server', 'NAC', 'Microsoft Network Policy Server for RADIUS authentication and authorization',
'["Windows Server NPS", "Azure NPS", "NPS Extension"]'::jsonb,
'["RADIUS", "802.1X", "MAB", "PEAP", "EAP-TLS", "LDAP"]'::jsonb,
'["RADIUS", "PowerShell", "WMI", "Event Logs"]'::jsonb,
'supported',
'{"level": "supported", "features": ["authentication", "authorization", "accounting"]}'::jsonb,
'{"available": true, "count": 3}'::jsonb,
'[{"title": "NPS Integration Guide", "url": "#", "type": "setup"}, {"title": "PowerShell API", "url": "#", "type": "api"}]'::jsonb,
'partial', 'active', (SELECT id FROM profiles LIMIT 1)),

-- FoxPass
('FoxPass', 'Cloud RADIUS', 'NAC', 'FoxPass Cloud RADIUS service for modern network authentication',
'["Cloud Service", "LDAP Bridge", "RADIUS Proxy"]'::jsonb,
'["RADIUS", "802.1X", "LDAP", "SAML", "OAuth"]'::jsonb,
'["REST API", "RADIUS", "LDAP", "SAML SSO"]'::jsonb,
'supported',
'{"level": "supported", "features": ["cloud_radius", "ldap_integration", "sso"]}'::jsonb,
'{"available": true, "count": 2}'::jsonb,
'[{"title": "FoxPass Integration", "url": "#", "type": "setup"}, {"title": "API Reference", "url": "#", "type": "api"}]'::jsonb,
'partial', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Bradford Networks
('Bradford Networks', 'Campus Manager', 'NAC', 'Bradford Networks Campus Manager for network access control',
'["Campus Manager", "Virtual Appliance", "Network Sentry"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "DHCP", "SPAN"]'::jsonb,
'["REST API", "RADIUS", "SNMP", "Syslog"]'::jsonb,
'limited',
'{"level": "limited", "features": ["basic_integration", "radius_proxy"]}'::jsonb,
'{"available": false, "count": 0}'::jsonb,
'[{"title": "Bradford Integration Notes", "url": "#", "type": "setup"}]'::jsonb,
'limited', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Impulse (now Ivanti)
('Ivanti', 'Policy Secure NAC', 'NAC', 'Ivanti Policy Secure NAC for network access control and compliance',
'["Policy Secure Virtual", "PSA Series", "PSV Series"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "Agent-based", "Agentless"]'::jsonb,
'["REST API", "RADIUS", "SNMP", "WMI"]'::jsonb,
'limited',
'{"level": "limited", "features": ["basic_radius", "policy_enforcement"]}'::jsonb,
'{"available": false, "count": 0}'::jsonb,
'[{"title": "Ivanti NAC Integration", "url": "#", "type": "setup"}]'::jsonb,
'limited', 'active', (SELECT id FROM profiles LIMIT 1)),

-- Extreme Networks
('Extreme Networks', 'ExtremeControl', 'NAC', 'Extreme Networks ExtremeControl for network access control',
'["ExtremeControl", "Virtual Appliance", "NAC-VM"]'::jsonb,
'["802.1X", "MAB", "RADIUS", "SNMP", "RFC3580"]'::jsonb,
'["REST API", "RADIUS", "SNMP", "Extreme Management"]'::jsonb,
'supported',
'{"level": "supported", "features": ["policy_enforcement", "guest_access", "byod"]}'::jsonb,
'{"available": true, "count": 3}'::jsonb,
'[{"title": "ExtremeControl Integration", "url": "#", "type": "setup"}, {"title": "API Guide", "url": "#", "type": "api"}]'::jsonb,
'partial', 'active', (SELECT id FROM profiles LIMIT 1));