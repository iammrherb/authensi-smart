-- Fix the authentication methods insertion with proper JSON escaping
INSERT INTO public.authentication_methods (name, method_type, description, security_level, configuration_complexity, portnox_integration, vendor_support) VALUES 
  ('RADIUS', 'protocol', 'Remote Authentication Dial-In User Service protocol', 'high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Built-in RADIUS server and client"}'::jsonb, '["Cisco", "Aruba", "Juniper", "Microsoft"]'::jsonb),
  ('TACACS+', 'protocol', 'Terminal Access Controller Access Control System Plus', 'high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Native TACACS+ support"}'::jsonb, '["Cisco", "Juniper", "F5"]'::jsonb),
  ('SAML SSO', 'federated', 'Security Assertion Markup Language Single Sign-On', 'high', 'complex', '{"supported": true, "integration_level": "certified", "configuration_guide": "SAML integration with major IdPs"}'::jsonb, '["Microsoft", "Okta", "Ping Identity", "Auth0"]'::jsonb),
  ('OAuth 2.0', 'token_based', 'Open Authorization 2.0 framework', 'medium', 'medium', '{"supported": true, "integration_level": "supported", "configuration_guide": "OAuth integration capabilities"}'::jsonb, '["Google", "Microsoft", "Auth0", "Okta"]'::jsonb),
  ('OpenID Connect', 'federated', 'Identity layer on top of OAuth 2.0', 'high', 'medium', '{"supported": true, "integration_level": "supported", "configuration_guide": "OIDC integration support"}'::jsonb, '["Microsoft", "Google", "Auth0"]'::jsonb),
  ('Kerberos', 'ticket_based', 'Network authentication protocol using tickets', 'high', 'complex', '{"supported": true, "integration_level": "native", "configuration_guide": "Kerberos integration with AD"}'::jsonb, '["Microsoft Active Directory"]'::jsonb),
  ('Certificate-based (PKI)', 'certificate', 'Public Key Infrastructure authentication', 'very_high', 'complex', '{"supported": true, "integration_level": "native", "configuration_guide": "Native PKI support with CA integration"}'::jsonb, '["Microsoft CA", "OpenSSL", "Various CAs"]'::jsonb),
  ('Biometric Authentication', 'biometric', 'Fingerprint, facial recognition, etc.', 'high', 'medium', '{"supported": true, "integration_level": "partner", "configuration_guide": "Integration with biometric systems"}'::jsonb, '["BioConnect", "Crossmatch", "HID"]'::jsonb),
  ('Smart Card Authentication', 'hardware_token', 'Smart card or CAC-based authentication', 'very_high', 'complex', '{"supported": true, "integration_level": "certified", "configuration_guide": "Smart card integration guide"}'::jsonb, '["HID", "Gemalto", "Oberthur"]'::jsonb),
  ('Multi-Factor Authentication', 'multi_factor', 'Combination of multiple authentication factors', 'very_high', 'medium', '{"supported": true, "integration_level": "native", "configuration_guide": "Native MFA capabilities"}'::jsonb, '["Microsoft", "Okta", "Duo", "RSA"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert identity providers  
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('Microsoft Azure AD/Entra ID', 'cloud_identity', 'Identity Providers', 'Microsoft cloud identity and access management', 'fully_certified', 'active'),
  ('Google Workspace', 'cloud_identity', 'Identity Providers', 'Google cloud identity platform', 'certified', 'active'),
  ('Okta', 'identity_service', 'Identity Providers', 'Enterprise identity management', 'fully_certified', 'active'),
  ('Auth0', 'identity_service', 'Identity Providers', 'Identity platform for developers', 'certified', 'active'),
  ('AWS IAM Identity Center', 'cloud_identity', 'Identity Providers', 'AWS identity and access management', 'certified', 'active'),
  ('OneLogin', 'identity_service', 'Identity Providers', 'Unified access management', 'certified', 'active'),
  ('Ping Identity', 'enterprise', 'Identity Providers', 'Enterprise identity solutions', 'certified', 'active'),
  ('ForgeRock', 'enterprise', 'Identity Providers', 'Digital identity platform', 'supported', 'active'),
  ('IBM Security Verify', 'enterprise', 'Identity Providers', 'AI-powered identity and access management', 'supported', 'active'),
  ('Oracle Identity Cloud', 'enterprise', 'Identity Providers', 'Comprehensive identity management', 'supported', 'active'),
  ('Duo Security', 'mfa_focused', 'Identity Providers', 'Multi-factor authentication platform', 'certified', 'active'),
  ('RSA SecurID', 'mfa_focused', 'Identity Providers', 'Multi-factor authentication solutions', 'certified', 'active'),
  ('CyberArk Identity', 'privileged_access', 'Identity Providers', 'Identity security platform', 'supported', 'active'),
  ('SailPoint IdentityNow', 'governance', 'Identity Providers', 'Identity governance platform', 'supported', 'active'),
  ('Microsoft Active Directory', 'on_premise', 'Identity Providers', 'On-premises directory service', 'fully_certified', 'active'),
  ('OpenLDAP', 'open_source', 'Identity Providers', 'Open source LDAP directory', 'fully_certified', 'active'),
  ('Apache Directory Server', 'open_source', 'Identity Providers', 'Apache LDAP directory server', 'supported', 'active'),
  ('389 Directory Server', 'open_source', 'Identity Providers', 'Red Hat directory server', 'supported', 'active'),
  ('Novell eDirectory', 'enterprise', 'Identity Providers', 'Novell directory services', 'supported', 'active'),
  ('Oracle Internet Directory', 'enterprise', 'Identity Providers', 'Oracle LDAP directory', 'supported', 'active'),
  ('JumpCloud', 'cloud_directory', 'Identity Providers', 'Cloud directory service', 'certified', 'active'),
  ('Centrify', 'privileged_access', 'Identity Providers', 'Privileged access management', 'supported', 'active'),
  ('BeyondTrust', 'privileged_access', 'Identity Providers', 'Privileged access management', 'supported', 'active'),
  ('Thycotic Secret Server', 'privileged_access', 'Identity Providers', 'Privileged account management', 'supported', 'active')
ON CONFLICT (vendor_name) DO NOTHING;

-- Add EDR/XDR and SIEM/MDR vendors
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('CrowdStrike Falcon', 'cloud_native', 'Security Infrastructure - EDR/XDR', 'Cloud-native endpoint protection platform', 'certified', 'active'),
  ('Microsoft Defender for Endpoint', 'integrated', 'Security Infrastructure - EDR/XDR', 'Microsoft integrated endpoint security', 'fully_certified', 'active'),
  ('SentinelOne', 'ai_powered', 'Security Infrastructure - EDR/XDR', 'Autonomous endpoint protection', 'certified', 'active'),
  ('Carbon Black', 'enterprise', 'Security Infrastructure - EDR/XDR', 'VMware endpoint security platform', 'certified', 'active'),
  ('Cortex XDR', 'extended_detection', 'Security Infrastructure - EDR/XDR', 'Palo Alto extended detection and response', 'certified', 'active'),
  ('Trend Micro', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Comprehensive cybersecurity solutions', 'supported', 'active'),
  ('Symantec Endpoint', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Broadcom endpoint protection', 'supported', 'active'),
  ('McAfee MVISION', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Unified endpoint security platform', 'supported', 'active'),
  ('Bitdefender GravityZone', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Advanced threat defense', 'supported', 'active'),
  ('Kaspersky Endpoint', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Advanced endpoint security', 'supported', 'active'),
  ('ESET PROTECT', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Multi-layered endpoint security', 'supported', 'active'),
  ('Sophos Intercept X', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Next-gen endpoint protection', 'supported', 'active'),
  ('Malwarebytes Endpoint', 'enterprise', 'Security Infrastructure - EDR/XDR', 'Anti-malware and endpoint protection', 'supported', 'active'),
  ('Cybereason', 'operation_centric', 'Security Infrastructure - EDR/XDR', 'Operation-centric cyber defense', 'supported', 'active'),
  ('Splunk Enterprise Security', 'analytics_driven', 'Security Infrastructure - SIEM/MDR', 'Security analytics platform', 'certified', 'active'),
  ('IBM QRadar', 'enterprise', 'Security Infrastructure - SIEM/MDR', 'Security intelligence platform', 'certified', 'active'),
  ('ArcSight (Micro Focus)', 'enterprise', 'Security Infrastructure - SIEM/MDR', 'Security event correlation', 'supported', 'active'),
  ('LogRhythm', 'unified', 'Security Infrastructure - SIEM/MDR', 'Unified security operations', 'supported', 'active'),
  ('Rapid7 InsightIDR', 'cloud_siem', 'Security Infrastructure - SIEM/MDR', 'Cloud SIEM solution', 'supported', 'active'),
  ('Elastic Security', 'open_source', 'Security Infrastructure - SIEM/MDR', 'Open source security analytics', 'supported', 'active'),
  ('Chronicle Security', 'google_cloud', 'Security Infrastructure - SIEM/MDR', 'Google cloud security analytics', 'supported', 'active'),
  ('Securonix', 'ueba_focused', 'Security Infrastructure - SIEM/MDR', 'User and entity behavior analytics', 'supported', 'active'),
  ('Exabeam', 'ueba_focused', 'Security Infrastructure - SIEM/MDR', 'Behavioral analytics platform', 'supported', 'active'),
  ('Sumo Logic', 'cloud_native', 'Security Infrastructure - SIEM/MDR', 'Cloud-native security analytics', 'supported', 'active')
ON CONFLICT (vendor_name) DO NOTHING;

-- Add monitoring and management tools
INSERT INTO public.vendor_library (vendor_name, vendor_type, category, description, portnox_integration_level, status) VALUES 
  ('SolarWinds NPM', 'enterprise', 'Monitoring & Management - Network Monitoring', 'Network performance monitoring', 'supported', 'active'),
  ('PRTG Network Monitor', 'enterprise', 'Monitoring & Management - Network Monitoring', 'Comprehensive network monitoring', 'supported', 'active'),
  ('ManageEngine OpManager', 'enterprise', 'Monitoring & Management - Network Monitoring', 'Network and server monitoring', 'supported', 'active'),
  ('Nagios', 'open_source', 'Monitoring & Management - Network Monitoring', 'Open source monitoring system', 'supported', 'active'),
  ('Zabbix', 'open_source', 'Monitoring & Management - Network Monitoring', 'Enterprise monitoring solution', 'supported', 'active'),
  ('LibreNMS', 'open_source', 'Monitoring & Management - Network Monitoring', 'Open source network monitoring', 'supported', 'active'),
  ('Auvik', 'cloud_managed', 'Monitoring & Management - Network Monitoring', 'Cloud-based network management', 'supported', 'active'),
  ('Datadog', 'cloud_native', 'Monitoring & Management - Infrastructure Monitoring', 'Cloud monitoring and analytics', 'supported', 'active'),
  ('New Relic', 'application_performance', 'Monitoring & Management - Infrastructure Monitoring', 'Application performance monitoring', 'supported', 'active'),
  ('ThousandEyes', 'internet_intelligence', 'Monitoring & Management - Network Monitoring', 'Internet and cloud intelligence', 'supported', 'active'),
  ('Microsoft SCCM', 'microsoft', 'Monitoring & Management - Device Management', 'System Center Configuration Manager', 'certified', 'active'),
  ('Lansweeper', 'asset_discovery', 'Monitoring & Management - Device Inventory', 'IT asset discovery and inventory', 'supported', 'active'),
  ('ManageEngine AssetExplorer', 'asset_management', 'Monitoring & Management - Device Inventory', 'IT asset management solution', 'supported', 'active'),
  ('ServiceNow ITAM', 'enterprise', 'Monitoring & Management - Device Inventory', 'IT asset management platform', 'supported', 'active'),
  ('Device42', 'data_center', 'Monitoring & Management - Device Inventory', 'Data center infrastructure management', 'supported', 'active'),
  ('Spiceworks', 'smb', 'Monitoring & Management - Device Inventory', 'Free IT management software', 'supported', 'active'),
  ('PDQ Inventory', 'windows_focused', 'Monitoring & Management - Device Inventory', 'Windows system inventory', 'supported', 'active'),
  ('OCS Inventory', 'open_source', 'Monitoring & Management - Device Inventory', 'Open source asset management', 'supported', 'active'),
  ('Nmap', 'network_scanner', 'Monitoring & Management - Network Discovery', 'Network discovery and security auditing', 'supported', 'active'),
  ('Advanced IP Scanner', 'network_scanner', 'Monitoring & Management - Network Discovery', 'Fast and robust network scanner', 'supported', 'active'),
  ('Angry IP Scanner', 'network_scanner', 'Monitoring & Management - Network Discovery', 'Cross-platform network scanner', 'supported', 'active')
ON CONFLICT (vendor_name) DO NOTHING;