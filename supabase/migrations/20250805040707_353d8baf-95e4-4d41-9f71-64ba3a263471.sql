-- Comprehensive Resource Center Enhancement with Exhaustive Data
-- This migration adds extensive vendor data, device types, use cases, requirements, 
-- configuration templates, and deployment scenarios for the most comprehensive NAC/802.1X platform

-- Add extensive wired vendors with models
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Cisco Comprehensive
('Cisco', 'wired', 'native', '["802.1X", "MAB", "WebAuth", "RADIUS", "TACACS+", "ISE Integration"]', '["Enterprise", "Campus", "Branch", "Data Center", "Cloud"]', 'high', 'excellent', 5.0, 'enterprise_leader', '["Enterprise Campus", "Branch Office", "Data Center", "Healthcare", "Education", "Government", "Manufacturing"]', 'Full ISE integration with dynamic VLAN assignment, profiling, and posture assessment', '["Catalyst 9000", "Catalyst 3850", "Catalyst 3650", "Catalyst 2960-X", "Catalyst 2960-L", "Nexus 9000", "Nexus 7000", "ASR 9000", "ISR 4000", "Meraki MS"]', '["IOS-XE 16.x", "IOS-XE 17.x", "NX-OS 9.x", "NX-OS 10.x"]', '["TrustSec", "MACsec", "Dynamic VLAN", "Voice VLAN", "PoE+", "mGig", "Stack-Wise"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Aruba Comprehensive  
('Aruba', 'wired', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "TACACS+", "ClearPass Integration"]', '["Enterprise", "Campus", "Branch", "Hospitality", "Healthcare"]', 'high', 'excellent', 4.8, 'enterprise_leader', '["Enterprise Campus", "Hospitality", "Healthcare", "Education", "Retail", "Manufacturing"]', 'Deep integration with ClearPass for policy enforcement and device profiling', '["2930F", "2930M", "3810M", "5400R", "6200F", "6300F", "6400", "8320", "8325", "CX 6000"]', '["ArubaOS-Switch 16.x", "ArubaOS-CX 10.x"]', '["VSF", "ARP Protection", "DHCP Snooping", "Dynamic Segmentation", "Zero Touch Provisioning"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Juniper Comprehensive
('Juniper', 'wired', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "TACACS+"]', '["Enterprise", "Campus", "Service Provider", "Data Center"]', 'high', 'excellent', 4.7, 'enterprise_leader', '["Enterprise Campus", "Service Provider", "Data Center", "Cloud Provider"]', 'Strong JUNOS integration with advanced security features', '["EX2300", "EX3400", "EX4300", "EX4600", "EX9200", "QFX5100", "QFX10000", "MX Series"]', '["Junos 18.x", "Junos 19.x", "Junos 20.x", "Junos 21.x"]', '["Virtual Chassis", "EVPN-VXLAN", "MACsec", "Pulse Secure Integration", "SRX Integration"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- HPE Comprehensive
('HPE', 'wired', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "TACACS+"]', '["Enterprise", "Campus", "SMB", "Edge"]', 'medium', 'good', 4.2, 'established', '["SMB", "Enterprise Branch", "Campus Edge", "Manufacturing", "Healthcare"]', 'Good basic 802.1X support with Aruba acquisition benefits', '["1920S", "1950", "2530", "2540", "2930F", "2930M", "3800", "5130", "5400R", "5900", "FlexNetwork"]', '["Comware 7.x", "Provision 15.x", "ArubaOS-Switch"]', '["IRF", "Smart Link", "MSTP", "LACP", "sFlow", "OpenFlow"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Extreme Networks
('Extreme Networks', 'wired', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS"]', '["Enterprise", "Campus", "Education", "Healthcare"]', 'medium', 'good', 4.0, 'established', '["Education", "Healthcare", "Campus", "Manufacturing"]', 'ExtremeControl integration for policy management', '["X440-G2", "X460-G2", "X465", "X590", "X690", "X770", "SLX 9140", "VSP 4000", "VSP 7000"]', '["EXOS 22.x", "EXOS 30.x", "VOSS 8.x"]', '["MLAG", "EAPS", "Fabric Connect", "OpenFlow", "SLPP"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Dell Comprehensive
('Dell', 'wired', 'partner', '["802.1X", "MAB", "WebAuth", "RADIUS"]', '["Enterprise", "Data Center", "Campus"]', 'medium', 'good', 3.8, 'established', '["Data Center", "Enterprise Campus", "SMB"]', 'Good enterprise features with PowerConnect and Force10 lines', '["S3148", "S4048", "S4128", "S5232F", "S5248F", "N1548", "N2048", "N3048", "Z9332F"]', '["Dell OS9", "Dell OS10", "PowerConnect"]', '["VLT", "VRRP", "MSTP", "LLDP", "sFlow", "BGP", "OSPF"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Allied Telesis
('Allied Telesis', 'wired', 'partner', '["802.1X", "MAB", "WebAuth", "RADIUS"]', '["SMB", "Enterprise", "Industrial"]', 'low', 'fair', 3.5, 'niche', '["SMB", "Industrial", "Education", "Government"]', 'Cost-effective solution for smaller deployments', '["x210", "x230", "x310", "x510", "x930", "SBx8100", "IE200"]', '["AlliedWare Plus", "AlliedWare"]', '["VCStack", "EPSR", "Tri-link", "AMF", "Green Ethernet"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Brocade/Ruckus
('Ruckus', 'wired', 'partner', '["802.1X", "MAB", "WebAuth", "RADIUS"]', '["Campus", "Branch", "SMB"]', 'medium', 'good', 3.9, 'established', '["Campus", "Branch Office", "SMB", "Service Provider"]', 'FastIron switching with ICX series integration', '["ICX 7150", "ICX 7250", "ICX 7450", "ICX 7650", "ICX 7750", "FCX 624", "FCX 648"]', '["FastIron 08.x", "FastIron 09.x"]', '["Stacking", "VRRP", "MSTP", "sFlow", "OpenFlow"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Ubiquiti
('Ubiquiti', 'wired', 'basic', '["802.1X", "RADIUS"]', '["SMB", "SOHO", "Branch"]', 'low', 'fair', 3.2, 'value', '["SMB", "SOHO", "Small Branch", "Startup"]', 'Basic 802.1X support, cost-effective for smaller environments', '["UniFi Switch", "EdgeSwitch", "Dream Machine", "USW-Pro", "USW-Enterprise"]', '["UniFi 6.x", "EdgeOS 2.x"]', '["PoE++", "SFP+", "LACP", "VLAN", "QoS"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Netgear
('Netgear', 'wired', 'basic', '["802.1X", "RADIUS"]', '["SMB", "SOHO"]', 'low', 'fair', 3.0, 'value', '["SMB", "SOHO", "Small Office"]', 'Basic managed switch features for small deployments', '["GS724T", "GS748T", "XS712T", "M4300", "M4500", "S3300"]', '["Smart Switch 7.x", "ProSAFE 6.x"]', '["VLAN", "QoS", "LACP", "RSTP", "IGMP Snooping"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add extensive wireless vendors
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Cisco Wireless Comprehensive
('Cisco Wireless', 'wireless', 'native', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3", "OWE", "SAE"]', '["Enterprise", "Campus", "Branch", "Outdoor", "Industrial"]', 'high', 'excellent', 5.0, 'enterprise_leader', '["Enterprise Campus", "Branch Office", "Outdoor Coverage", "High Density", "Healthcare", "Education"]', 'Full integration with ISE and DNA Center for advanced analytics', '["Catalyst 9100", "Catalyst 9105", "Catalyst 9115", "Catalyst 9117", "Catalyst 9120", "Catalyst 9130", "Aironet 1800", "Aironet 2800", "Aironet 3800", "Aironet 4800", "Meraki MR"]', '["IOS-XE 17.x", "Meraki 28.x", "Meraki 29.x"]', '["Wi-Fi 6E", "Wi-Fi 7", "ClientLink", "BandSelect", "CleanAir", "Hyperlocation", "mGig", "802.11ax"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Aruba Wireless Comprehensive
('Aruba Wireless', 'wireless', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3", "OWE", "SAE"]', '["Enterprise", "Campus", "Branch", "Outdoor", "Hospitality"]', 'high', 'excellent', 4.9, 'enterprise_leader', '["Enterprise Campus", "Hospitality", "Healthcare", "Education", "Retail", "Manufacturing"]', 'Deep ClearPass integration with AI-powered RF optimization', '["AP-515", "AP-535", "AP-555", "AP-575", "AP-635", "AP-655", "AP-665", "AP-715", "IAP-515", "IAP-535"]', '["ArubaOS 8.10.x", "ArubaOS 8.11.x", "Instant 8.10.x"]', '["Wi-Fi 6E", "AI-powered RF", "ClientMatch", "AirMatch", "AppRF", "Spectrum Analysis"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Ruckus Wireless Comprehensive
('Ruckus Wireless', 'wireless', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3", "OWE"]', '["Enterprise", "Campus", "Hospitality", "Education", "Outdoor"]', 'medium', 'excellent', 4.7, 'established', '["High Density", "Hospitality", "Education", "Healthcare", "Venue", "Stadium"]', 'BeamFlex adaptive antenna technology with SmartZone management', '["R350", "R550", "R650", "R750", "R850", "H350", "H510", "H550", "T350", "T750"]', '["Unleashed 200.14.x", "SmartZone 6.1.x", "Cloud 3.6.x"]', '["BeamFlex+", "Wi-Fi 6E", "ChannelFly", "SmartMesh", "OFDMA", "MU-MIMO"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Extreme Wireless
('Extreme Wireless', 'wireless', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3"]', '["Enterprise", "Campus", "Education", "Healthcare"]', 'medium', 'good', 4.2, 'established', '["Education", "Healthcare", "Campus", "Manufacturing", "Government"]', 'ExtremeCloud IQ for cloud management and AI analytics', '["AP305C", "AP410C", "AP460C", "AP505i", "AP510i", "AP650", "AP7562", "AP7632"]', '["ExtremeWireless 10.x", "CloudIQ 22.x"]', '["Wi-Fi 6", "ML Insights", "Auto-RF", "Spectrum Intelligence", "Location Services"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Fortinet Wireless
('Fortinet Wireless', 'wireless', 'partner', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3"]', '["Enterprise", "SMB", "Branch", "Security-focused"]', 'medium', 'good', 4.1, 'established', '["Security-focused Enterprise", "SMB", "Branch Office", "SASE"]', 'Integrated with FortiGate security fabric for unified threat management', '["FAP-221F", "FAP-231F", "FAP-431F", "FAP-432F", "FAP-433F", "U321EV", "U431F"]', '["FortiOS 7.2.x", "FortiOS 7.4.x"]', '["Wi-Fi 6", "Security Fabric", "WIDS/WIPS", "FortiPlanner", "Zero Touch"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Mist (Juniper)
('Mist', 'wireless', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3", "OWE", "SAE"]', '["Enterprise", "Campus", "Branch", "Cloud-first"]', 'medium', 'excellent', 4.8, 'emerging_leader', '["Cloud-first Enterprise", "AI-driven Campus", "Branch Office", "User Experience"]', 'AI-driven wireless assurance with machine learning insights', '["AP12", "AP21", "AP32", "AP33", "AP34", "AP41", "AP43", "AP45", "AP63", "AP64"]', '["Mist Cloud 0.18.x", "Mist Cloud 0.19.x"]', '["AI-driven RF", "vBLE", "User Experience SLE", "Marvis VNA", "Wi-Fi 6E", "Indoor Location"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- HPE Wireless (Aruba)
('HPE Wireless', 'wireless', 'certified', '["802.1X", "MAB", "WebAuth", "RADIUS", "WPA3"]', '["Enterprise", "Campus", "SMB"]', 'medium', 'good', 4.0, 'established', '["SMB", "Mid-market", "Enterprise Branch"]', 'OfficeConnect and ProCurve wireless solutions', '["OC20", "MSM410", "MSM422", "MSM460", "MSM466", "Aruba Instant On"]', '["OfficeConnect 2.x", "ProCurve 8.x"]', '["Cloud Management", "Instant On", "Simple Setup", "Guest Access"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Ubiquiti Wireless
('Ubiquiti Wireless', 'wireless', 'basic', '["802.1X", "RADIUS", "WPA3"]', '["SMB", "SOHO", "Branch", "Outdoor"]', 'low', 'fair', 3.5, 'value', '["SMB", "SOHO", "Outdoor Coverage", "Cost-conscious"]', 'UniFi ecosystem with centralized management', '["U6-Enterprise", "U6-Pro", "U6-LR", "U6-Lite", "U6-Mesh", "U6-IW", "UAP-AC-Pro", "UAP-nanoHD"]', '["UniFi 6.5.x", "UniFi 7.x"]', '["Wi-Fi 6", "PoE", "Mesh", "UISP", "UniFi Protect Integration"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive NAC vendors
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Cisco ISE
('Cisco ISE', 'nac', 'native', '["RADIUS", "TACACS+", "802.1X", "MAB", "WebAuth", "SAML", "LDAP", "AD"]', '["Enterprise", "Campus", "Data Center", "Branch", "Cloud Hybrid"]', 'very_high', 'excellent', 4.9, 'enterprise_leader', '["Large Enterprise", "Government", "Healthcare", "Financial Services", "Manufacturing"]', 'Market-leading NAC with comprehensive policy engine and integrations', '["ISE 2.7", "ISE 3.0", "ISE 3.1", "ISE 3.2", "Cloud ISE"]', '["3.0 Patch 7", "3.1 Patch 5", "3.2 Patch 2", "3.3"]', '["TrustSec", "Profiling", "Posture", "Guest", "BYOD", "pxGrid", "ERS API", "Open API"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Aruba ClearPass
('Aruba ClearPass', 'nac', 'native', '["RADIUS", "TACACS+", "802.1X", "MAB", "WebAuth", "SAML", "LDAP", "AD"]', '["Enterprise", "Campus", "Branch", "Cloud", "MSP"]', 'high', 'excellent', 4.8, 'enterprise_leader', '["Enterprise", "Healthcare", "Education", "Hospitality", "Government"]', 'Policy management platform with device profiling and guest access', '["CPPM", "ClearPass Cloud", "OnGuard", "OnBoard", "Guest"]', '["6.10.x", "6.11.x", "6.12.x"]', '["Policy Manager", "Profiler", "OnBoard", "OnGuard", "Guest", "Cloud Auth", "API Gateway"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Extreme ExtremeControl
('Extreme ExtremeControl', 'nac', 'certified', '["RADIUS", "802.1X", "MAB", "WebAuth", "LDAP", "AD"]', '["Enterprise", "Campus", "Education", "Healthcare"]', 'high', 'good', 4.3, 'established', '["Education", "Healthcare", "Campus", "Government"]', 'Integrated NAC solution with ExtremeCloud management', '["ExtremeControl", "Extreme Management Center"]', '["8.5.x", "8.6.x"]', '["NAC", "Guest Access", "Asset Tracking", "Compliance", "Automated Response"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- ForeScout
('ForeScout', 'nac', 'certified', '["RADIUS", "802.1X", "MAB", "SNMP", "WMI", "SSH"]', '["Enterprise", "OT", "IoT", "Healthcare", "Critical Infrastructure"]', 'high', 'excellent', 4.5, 'established', '["Asset Discovery", "OT Security", "IoT", "Compliance", "Threat Detection"]', 'Agentless device visibility and compliance enforcement', '["CounterACT", "eyeExtend", "eyeSegment"]', '["8.5.x", "8.6.x"]', '["Device Discovery", "Risk Assessment", "Automated Response", "OT/IoT", "Compliance"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Pulse Secure
('Pulse Secure', 'nac', 'partner', '["RADIUS", "802.1X", "MAB", "SSL VPN", "SAML"]', '["Enterprise", "Remote Access", "Branch", "Cloud"]', 'medium', 'good', 4.0, 'established', '["Remote Access", "BYOD", "Contractor Access", "Branch Office"]', 'NAC with integrated SSL VPN and mobile security', '["Pulse Policy Secure", "Pulse Connect Secure"]', '["9.1.x", "9.1R"]', '["NAC", "SSL VPN", "Mobile Security", "Endpoint Compliance", "BYOD"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Bradford Networks
('Bradford Networks', 'nac', 'partner', '["RADIUS", "802.1X", "MAB", "WebAuth", "DHCP"]', '["Campus", "Healthcare", "Education", "Manufacturing"]', 'medium', 'good', 3.8, 'niche', '["Healthcare", "Education", "Campus", "Manufacturing"]', 'Campus Manager for network admission control', '["Campus Manager", "Network Sentry"]', '["6.x", "7.x"]', '["Device Registration", "Guest Access", "Compliance", "Asset Management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add RADIUS servers
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Microsoft NPS
('Microsoft NPS', 'radius', 'certified', '["RADIUS", "802.1X", "PEAP", "EAP-TLS", "NTLM", "Kerberos"]', '["Windows Environment", "Enterprise", "Campus", "Branch"]', 'medium', 'good', 4.2, 'widespread', '["Windows-centric Enterprise", "Active Directory Integration", "Cost-effective"]', 'Native Windows Server role with Active Directory integration', '["Windows Server 2019", "Windows Server 2022"]', '["NPS 2019", "NPS 2022"]', '["AD Integration", "Group Policy", "Certificate Services", "Connection Request Policies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- FreeRADIUS
('FreeRADIUS', 'radius', 'partner', '["RADIUS", "802.1X", "PEAP", "EAP-TLS", "EAP-TTLS", "PAP", "CHAP"]', '["Open Source", "Linux", "Custom Solutions", "Research"]', 'high', 'community', 4.5, 'widespread', '["Open Source Environments", "Linux Infrastructure", "Custom Solutions", "Research"]', 'Open source RADIUS server with extensive customization options', '["FreeRADIUS 3.x", "FreeRADIUS 4.x"]', '["3.2.x", "4.0.x"]', '["SQL Integration", "LDAP", "Perl/Python Modules", "Packet Filters", "Policy Language"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Steel-Belted RADIUS
('Steel-Belted RADIUS', 'radius', 'partner', '["RADIUS", "802.1X", "PEAP", "EAP-TLS", "TACACS+"]', '["Service Provider", "Enterprise", "Carrier"]', 'high', 'good', 4.0, 'niche', '["Service Provider", "Carrier Networks", "Large Scale RADIUS"]', 'Carrier-grade RADIUS server for service providers', '["SBR 6.x", "SBR 7.x"]', '["6.8.x", "7.0.x"]', '["High Availability", "Load Balancing", "SQL Accounting", "LDAP Integration"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive IDP vendors
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Microsoft Azure AD
('Microsoft Azure AD', 'idp', 'native', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "WS-Fed", "RADIUS", "LDAP"]', '["Cloud", "Hybrid", "Enterprise", "M365"]', 'medium', 'excellent', 4.8, 'enterprise_leader', '["Microsoft 365", "Enterprise", "Hybrid Cloud", "Government"]', 'Complete identity platform with conditional access and MFA', '["Azure AD Free", "Azure AD Premium P1", "Azure AD Premium P2", "Entra ID"]', '["Current", "Preview"]', '["Conditional Access", "MFA", "PIM", "Identity Protection", "Single Sign-On", "B2B/B2C"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Okta
('Okta', 'idp', 'native', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "RADIUS", "LDAP", "SCIM"]', '["Cloud", "SaaS", "Enterprise", "Multi-cloud"]', 'medium', 'excellent', 4.7, 'cloud_leader', '["SaaS Applications", "Cloud-first Enterprise", "Multi-cloud", "Identity Governance"]', 'Cloud-native identity platform with extensive app catalog', '["Workforce Identity", "Customer Identity", "Privileged Access"]', '["Current Production"]', '["Universal Directory", "Lifecycle Management", "Adaptive MFA", "API Access Management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Ping Identity
('Ping Identity', 'idp', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "WS-Fed", "RADIUS"]', '["Enterprise", "B2B", "APIs", "Government"]', 'high', 'excellent', 4.6, 'established', '["Complex Enterprise", "Government", "APIs", "Partner Integration"]', 'Enterprise-grade identity solutions with strong API governance', '["PingFederate", "PingOne", "PingAccess", "PingDirectory"]', '["11.x", "12.x"]', '["Federation", "API Security", "Zero Trust", "Risk-based Authentication"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Auth0
('Auth0', 'idp', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "JWT", "LDAP"]', '["Developer-focused", "SaaS", "B2C", "Modern Apps"]', 'low', 'excellent', 4.5, 'developer_favorite', '["Modern Applications", "Developer Teams", "B2C", "SaaS Platforms"]', 'Developer-friendly identity platform with extensive SDKs', '["Auth0 Platform"]', '["Current"]', '["Universal Login", "Rules Engine", "Extensibility", "Social Connections", "Enterprise Connections"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- OneLogin
('OneLogin', 'idp', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "RADIUS", "LDAP"]', '["SMB", "Enterprise", "Cloud", "Remote Work"]', 'medium', 'good', 4.2, 'established', '["SMB", "Remote Workforce", "Cloud Applications", "IT Simplification"]', 'Simple yet powerful identity management for growing businesses', '["OneLogin Platform"]', '["Current"]', '["SmartFactor Authentication", "Desktop SSO", "Provisioning", "Directory Integration"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- IBM Security Verify
('IBM Security Verify', 'idp', 'partner', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "RADIUS", "LDAP"]', '["Enterprise", "Government", "Hybrid", "Legacy Integration"]', 'high', 'good', 4.1, 'enterprise_legacy', '["Large Enterprise", "Government", "Legacy Systems", "Complex Environments"]', 'Enterprise identity platform with strong governance capabilities', '["Security Verify", "Security Verify Access"]', '["10.x"]', '["Risk-based Authentication", "Governance", "Privileged Access", "Legacy Integration"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- ForgeRock
('ForgeRock', 'idp', 'partner', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "UMA", "RADIUS"]', '["Enterprise", "Telco", "Government", "Open Source"]', 'very_high', 'excellent', 4.3, 'open_source', '["Telco", "Government", "Complex Enterprise", "Open Standards"]', 'Open source identity platform with commercial support', '["ForgeRock Platform 7.x", "ForgeRock Platform 8.x"]', '["7.4", "8.0"]', '["AM", "IDM", "IG", "DS", "UMA", "FIDO2", "Open Banking"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Centrify
('Centrify', 'idp', 'partner', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "RADIUS", "LDAP", "SSH"]', '["Enterprise", "Privileged Access", "Unix/Linux", "Cloud"]', 'high', 'good', 4.0, 'established', '["Privileged Access", "Unix/Linux Environments", "Cloud Infrastructure"]', 'Identity security with strong privileged access management', '["Centrify Platform"]', '["Current"]', '["Privileged Access", "Zero Trust", "Server Suite", "Cloud Infrastructure"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- CyberArk
('CyberArk', 'idp', 'partner', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "RADIUS"]', '["Enterprise", "Privileged Access", "DevOps", "Government"]', 'very_high', 'excellent', 4.4, 'pam_leader', '["Privileged Access Management", "DevSecOps", "Critical Infrastructure"]', 'Leading privileged access management with identity capabilities', '["Identity Platform", "Workforce Identity"]', '["Current"]', '["Privileged Access", "Workforce Identity", "Customer Identity", "DevOps Secrets"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive MDM vendors
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

-- Microsoft Intune
('Microsoft Intune', 'mdm', 'native', '["MDM", "MAM", "Certificate Deployment", "Wi-Fi Profiles", "VPN Profiles"]', '["Enterprise", "M365", "Hybrid", "Cloud"]', 'medium', 'excellent', 4.7, 'enterprise_leader', '["Microsoft 365 Enterprise", "Windows Environment", "Hybrid Cloud"]', 'Native integration with Azure AD for certificate-based authentication', '["Microsoft Intune"]', '["Current Service"]', '["Conditional Access", "Compliance Policies", "App Protection", "Certificate Management", "Co-management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- VMware Workspace ONE
('VMware Workspace ONE', 'mdm', 'certified', '["MDM", "MAM", "Certificate Deployment", "Wi-Fi Profiles", "VPN Profiles", "SCEP"]', '["Enterprise", "Multi-platform", "VDI", "Cloud"]', 'high', 'excellent', 4.6, 'enterprise_leader', '["Enterprise Mobility", "VDI", "Multi-platform", "Digital Workspace"]', 'Comprehensive unified endpoint management with strong certificate support', '["Workspace ONE UEM", "Workspace ONE Access"]', '["22.x", "23.x"]', '["Digital Employee Experience", "App Catalog", "Certificate Management", "Tunnel", "Intelligence"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Jamf
('Jamf', 'mdm', 'certified', '["MDM", "Certificate Deployment", "Wi-Fi Profiles", "VPN Profiles", "SCEP"]', '["Apple Ecosystem", "Education", "Enterprise", "Healthcare"]', 'medium', 'excellent', 4.8, 'apple_leader', '["Apple Device Management", "Education", "Creative Industries", "Healthcare"]', 'Premier Apple device management with excellent certificate deployment', '["Jamf Pro", "Jamf Now", "Jamf School", "Jamf Connect"]', '["10.x", "11.x"]', '["Apple Push Certificates", "Self Service", "Zero Touch Deployment", "Conditional Access", "Protect"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- MobileIron/Ivanti
('Ivanti MobileIron', 'mdm', 'certified', '["MDM", "MAM", "Certificate Deployment", "Wi-Fi Profiles", "VPN Profiles"]', '["Enterprise", "Government", "Healthcare", "Secure"]', 'high', 'good', 4.3, 'established', '["Security-focused Enterprise", "Government", "Healthcare", "Compliance"]', 'Enterprise-grade mobile security with strong compliance features', '["Ivanti EPMM", "Ivanti Neurons"]', '["11.x", "12.x"]', '["Mobile Threat Defense", "App Wrapping", "Compliance", "Zero Sign-On", "Standalone Sentry"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- IBM MaaS360
('IBM MaaS360', 'mdm', 'partner', '["MDM", "MAM", "Certificate Deployment", "Wi-Fi Profiles", "Threat Protection"]', '["Enterprise", "IBM Ecosystem", "Watson Analytics"]', 'medium', 'good', 4.0, 'established', '["IBM Enterprise Customers", "Analytics-driven Management", "AI Insights"]', 'AI-powered endpoint management with Watson analytics', '["MaaS360 Platform"]', '["Current SaaS"]', '["Watson Analytics", "Mobile Threat Protection", "App Management", "Compliance", "Predictive Analytics"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- SOTI MobiControl
('SOTI MobiControl', 'mdm', 'partner', '["MDM", "Certificate Deployment", "Wi-Fi Profiles", "Rugged Devices"]', '["Industrial", "Healthcare", "Retail", "Field Service"]', 'medium', 'good', 4.1, 'vertical_specialist', '["Industrial IoT", "Healthcare", "Retail POS", "Field Service", "Rugged Devices"]', 'Specialized in rugged and industrial device management', '["MobiControl Platform"]', '["15.x", "16.x"]', '["Rugged Device Support", "Kiosk Mode", "Remote Control", "Content Management", "Business Rules"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Citrix Endpoint Management
('Citrix Endpoint Management', 'mdm', 'partner', '["MDM", "MAM", "Certificate Deployment", "Wi-Fi Profiles", "XenApp Integration"]', '["Enterprise", "VDI", "Citrix Environment"]', 'high', 'good', 3.9, 'established', '["Citrix Customers", "VDI Environments", "App Virtualization"]', 'Integrated with Citrix Virtual Apps and Desktops ecosystem', '["Citrix Endpoint Management"]', '["Current Cloud"]', '["XenApp Integration", "Secure Mail", "ShareFile", "Micro VPN", "HDX Technologies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Hexnode
('Hexnode', 'mdm', 'basic', '["MDM", "Certificate Deployment", "Wi-Fi Profiles", "Kiosk Mode"]', '["SMB", "Education", "Retail", "Healthcare"]', 'low', 'good', 4.2, 'emerging', '["SMB", "Education", "Retail Kiosks", "Healthcare", "Cost-effective"]', 'Cost-effective MDM solution with good feature set for SMB', '["Hexnode UEM"]', '["Current Cloud"]', '["Kiosk Lockdown", "Content Management", "Expense Management", "Remote Assistance", "Compliance"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add device types with comprehensive categories
INSERT INTO device_library (device_name, category, authentication_methods, typical_use_cases, deployment_considerations, security_implications, vendor_examples, configuration_complexity, market_presence, integration_notes, network_behavior, power_requirements, form_factors, created_by) VALUES

-- Computing Devices
('Windows Laptop', 'endpoint', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "Machine Auth", "User Auth"]', '["Corporate Users", "Remote Work", "BYOD", "Contractors"]', '["Certificate Deployment", "GPO Configuration", "MDM Enrollment", "Compliance Checks"]', '["Domain Join Required", "BitLocker Encryption", "Windows Defender", "Patch Management"]', '["Dell Latitude", "HP EliteBook", "Lenovo ThinkPad", "Microsoft Surface"]', 'medium', 'enterprise_standard', 'Excellent support for machine and user authentication with certificate auto-enrollment', '["DHCP Client", "DNS Registration", "Domain Authentication", "Software Updates"]', 'Battery/AC Power', '["Laptop", "2-in-1", "Ultrabook"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('MacBook', 'endpoint', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "User Auth"]', '["Creative Professionals", "Executives", "BYOD", "Education"]', '["Profile Deployment", "Jamf Management", "Certificate Distribution", "User Training"]', '["FileVault Encryption", "Gatekeeper", "XProtect", "MDM Enrollment"]', '["MacBook Air", "MacBook Pro", "iMac", "Mac Studio"]', 'medium', 'creative_standard', 'Strong certificate support through profiles and keychain integration', '["Bonjour Discovery", "DHCP Client", "Time Machine", "Software Updates"]', 'Battery/AC Power', '["Laptop", "Desktop", "All-in-One"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Linux Workstation', 'endpoint', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "wpa_supplicant"]', '["Developers", "Engineers", "Research", "Open Source Environments"]', '["Manual Configuration", "NetworkManager Setup", "Certificate Management", "Custom Scripts"]', '["SELinux/AppArmor", "Full Disk Encryption", "Package Management", "Custom Hardening"]', '["Dell Developer Edition", "System76", "Lenovo P Series", "Custom Builds"]', 'high', 'technical_niche', 'Flexible configuration options but requires technical expertise', '["NetworkManager", "systemd-resolved", "Package Updates", "SSH Services"]', 'AC Power', '["Desktop", "Workstation", "Mobile Workstation"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Mobile Devices
('iPhone', 'mobile', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "Certificate-based"]', '["Corporate Mobile", "BYOD", "Executive Devices", "Field Workers"]', '["MDM Enrollment", "Profile Installation", "App Store Management", "VPN Configuration"]', '["Device Encryption", "Passcode Policies", "Remote Wipe", "App Sandboxing"]', '["iPhone 13", "iPhone 14", "iPhone 15", "iPhone SE"]', 'low', 'consumer_enterprise', 'Excellent enterprise features with strong certificate support via MDM', '["Push Notifications", "Background App Refresh", "Location Services", "iCloud Sync"]', 'Battery', '["Standard", "Plus", "Pro", "Max"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Android Phone', 'mobile', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "Certificate-based"]', '["Corporate Mobile", "BYOD", "Field Workers", "Budget-conscious"]', '["Work Profile Setup", "Certificate Deployment", "App Management", "Knox Configuration"]', '["Device Encryption", "Screen Lock", "Remote Wipe", "App Permissions"]', '["Samsung Galaxy", "Google Pixel", "OnePlus", "Motorola"]', 'medium', 'widespread', 'Variable enterprise support depending on manufacturer and Android version', '["Google Services", "Push Notifications", "Background Sync", "Location Services"]', 'Battery', '["Standard", "Compact", "Foldable"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('iPad', 'mobile', '["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "Certificate-based"]', '["Presentations", "Field Work", "Education", "Retail", "Healthcare"]', '["MDM Enrollment", "App Deployment", "Kiosk Mode", "Shared Device Setup"]', '["Device Encryption", "Guided Access", "Remote Management", "App Restrictions"]', '["iPad Air", "iPad Pro", "iPad Mini", "iPad Standard"]', 'low', 'vertical_popular', 'Excellent for kiosk and shared device scenarios with strong MDM support', '["Push Notifications", "Background App Refresh", "AirPlay", "Handoff"]', 'Battery', '["Standard", "Pro", "Mini", "Air"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- IoT and Specialty Devices
('Security Camera', 'iot', '["802.1X-EAP-TLS", "MAC-based", "Pre-shared Key"]', '["Physical Security", "Surveillance", "Monitoring", "Access Control"]', '["VLAN Isolation", "Firmware Updates", "Certificate Lifecycle", "Network Segmentation"]', '["Default Credentials", "Firmware Vulnerabilities", "Network Exposure", "Privacy Concerns"]', '["Axis", "Hikvision", "Dahua", "Bosch", "Hanwha"]', 'high', 'security_critical', 'Often lack advanced authentication, require careful network segmentation', '["RTSP Streaming", "HTTP Management", "ONVIF Protocol", "Motion Detection"]', 'PoE/AC Power', '["Fixed", "PTZ", "Dome", "Bullet"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Medical Device', 'iot', '["802.1X-EAP-TLS", "MAC-based", "VLAN Assignment"]', '["Patient Monitoring", "Diagnostic Equipment", "Life Support", "Imaging"]', '["FDA Compliance", "HIPAA Requirements", "Uptime Critical", "Legacy OS Support"]', '["Patient Safety", "Data Privacy", "System Availability", "Regulatory Compliance"]', '["GE Healthcare", "Philips", "Siemens", "Medtronic", "Cerner"]', 'very_high', 'regulated_critical', 'Highly regulated with limited authentication options, critical uptime requirements', '["HL7 Messaging", "DICOM Transfer", "Database Connections", "Real-time Monitoring"]', 'AC Power/UPS', '["Portable", "Fixed", "Mobile Cart", "Integrated"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Smart TV', 'iot', '["WPA2-PSK", "MAC-based", "Guest Network"]', '["Conference Rooms", "Digital Signage", "Lobbies", "Training Rooms"]', '["Guest Network Isolation", "Content Filtering", "Bandwidth Limiting", "Usage Monitoring"]', '["Internet Access", "Content Privacy", "Network Bandwidth", "Unauthorized Apps"]', '["Samsung Business", "LG Commercial", "Sony Professional", "Sharp/NEC"]', 'low', 'commercial_common', 'Limited security features, best practice is guest network isolation', '["Streaming Services", "Screen Mirroring", "Digital Signage", "Software Updates"]', 'AC Power', '["Wall Mount", "Stand Mount", "Interactive Display"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- Industrial and Infrastructure
('Industrial Sensor', 'iot', '["802.1X-EAP-TLS", "MAC-based", "VLAN Assignment"]', '["Manufacturing", "Process Control", "Environmental Monitoring", "Predictive Maintenance"]', '["OT Network Segmentation", "Real-time Requirements", "Harsh Environment", "Legacy Protocol Support"]', '["Safety Systems", "Production Impact", "Data Integrity", "Remote Access"]', '["Honeywell", "Schneider Electric", "Rockwell", "Siemens", "ABB"]', 'very_high', 'industrial_critical', 'Mission-critical devices requiring specialized OT security approaches', '["Modbus", "Profinet", "EtherNet/IP", "OPC-UA", "BACnet"]', 'Industrial Power', '["Panel Mount", "Field Mount", "Explosion Proof", "Wireless"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('VoIP Phone', 'network_infrastructure', '["802.1X-EAP-TLS", "HTTP Digest", "LLDP-MED", "VLAN Assignment"]', '["Desktop Phones", "Conference Rooms", "Reception", "Emergency Phones"]', '["VLAN Tagging", "PoE Requirements", "QoS Configuration", "Emergency Services"]', '["Voice Privacy", "System Availability", "Emergency Access", "Toll Fraud"]', '["Cisco IP Phones", "Poly", "Yealink", "Avaya", "Mitel"]', 'medium', 'business_standard', 'Well-standardized with good 802.1X support and automatic VLAN assignment', '["SIP Protocol", "RTP Media", "LLDP Discovery", "HTTP Provisioning"]', 'PoE', '["Desktop", "Wireless", "Conference", "Video Phone"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Wireless Access Point', 'network_infrastructure', '["802.1X-EAP-TLS", "MAC-based", "Management VLAN"]', '["Wireless Infrastructure", "Coverage Extension", "Outdoor Coverage", "High Density"]', '["Management VLAN", "Firmware Updates", "Controller Communication", "Power Planning"]', '["Management Access", "Rogue AP Detection", "Wireless Security", "Configuration Integrity"]', '["Cisco Aironet", "Aruba", "Ruckus", "Extreme", "Ubiquiti"]', 'high', 'infrastructure_critical', 'Critical infrastructure requiring secure management and monitoring', '["CAPWAP", "Management Protocols", "SNMP", "Syslog", "NTP"]', 'PoE+/AC Power', '["Indoor", "Outdoor", "High Density", "Mesh"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive use cases
INSERT INTO use_case_library (title, description, category, priority, complexity, industry_focus, authentication_methods, network_requirements, security_considerations, implementation_steps, success_criteria, common_challenges, best_practices, related_technologies, compliance_requirements, created_by) VALUES

('Enterprise Employee Network Access', 'Secure network access for corporate employees with dynamic VLAN assignment and posture assessment', 'Employee Access', 'high', 'medium', '["Enterprise", "Healthcare", "Financial Services", "Government"]', '["802.1X-EAP-TLS", "Machine Authentication", "User Authentication", "Certificate-based"]', '["Dynamic VLAN Assignment", "QoS Policies", "Network Segmentation", "Redundant Authentication"]', '["Certificate Lifecycle Management", "Posture Assessment", "Privilege Escalation Prevention", "Session Monitoring"]', '["Deploy PKI Infrastructure", "Configure RADIUS Server", "Implement 802.1X on Switches", "Deploy Certificates", "Configure Dynamic VLAN Assignment", "Implement Posture Assessment", "Configure Monitoring"]', '["99.9% Authentication Success Rate", "< 10 second authentication time", "Zero unauthorized access incidents", "Automated certificate renewal"]', '["Certificate Deployment Complexity", "Legacy Device Support", "User Training", "Performance Impact", "Troubleshooting Complexity"]', '["Gradual Rollout", "Comprehensive Testing", "User Training Program", "Monitoring and Alerting", "Change Management Process"]', '["PKI", "RADIUS", "LDAP/AD", "SIEM", "NAC", "Endpoint Protection"]', '["SOX", "HIPAA", "PCI-DSS", "ISO 27001", "NIST Cybersecurity Framework"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('BYOD (Bring Your Own Device)', 'Secure access for personal devices in corporate environment with policy enforcement', 'BYOD', 'high', 'high', '["Enterprise", "Education", "Healthcare", "Technology"]', '["802.1X-PEAP", "802.1X-EAP-TTLS", "Certificate-based", "MDM Integration"]', '["Guest Network Isolation", "Device Registration", "Bandwidth Limiting", "Content Filtering"]', '["Device Compliance", "Data Segregation", "Remote Wipe Capability", "Privacy Protection"]', '["Establish BYOD Policy", "Deploy MDM Solution", "Configure Guest Networks", "Implement Device Registration", "Deploy Compliance Policies", "Configure Data Protection", "User Training"]', '["95% Device Registration Rate", "Zero Corporate Data Breaches", "User Satisfaction > 85%", "Compliance with Privacy Regulations"]', '["Device Diversity", "User Resistance", "Privacy Concerns", "Support Complexity", "Policy Enforcement"]', '["Clear BYOD Policy", "User Education", "Minimal Friction Registration", "Privacy-First Approach", "Tiered Access Model"]', '["MDM", "MAM", "Cloud Services", "VPN", "DLP", "Mobile Security"]', '["GDPR", "CCPA", "HIPAA", "Corporate Data Protection Policies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Guest Network Access', 'Temporary network access for visitors with time-limited credentials and isolated network access', 'Guest Access', 'medium', 'low', '["Enterprise", "Hospitality", "Education", "Healthcare", "Retail"]', '["Captive Portal", "SMS Authentication", "Email Registration", "Social Login", "Voucher-based"]', '["Network Isolation", "Bandwidth Limiting", "Internet-only Access", "Content Filtering"]', '["Network Segmentation", "Time-limited Access", "Usage Monitoring", "Abuse Prevention"]', '["Design Guest Network Architecture", "Deploy Captive Portal", "Configure Isolation Rules", "Implement Time Limits", "Configure Content Filtering", "Deploy Monitoring", "User Testing"]', '["< 2 minute registration time", "Zero corporate network access", "99% uptime", "Positive user experience"]', '["User Experience vs Security", "Support Burden", "Abuse Prevention", "Bandwidth Management"]', '["Simple Registration Process", "Clear Terms of Use", "Automated Cleanup", "Usage Analytics", "Responsive Design"]', '["Captive Portal", "Firewall", "Content Filter", "Bandwidth Management", "Analytics"]', '["Acceptable Use Policies", "Data Privacy Regulations", "Industry-specific Requirements"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('IoT Device Onboarding', 'Automated onboarding and lifecycle management for IoT devices with appropriate network segmentation', 'IoT Security', 'high', 'very_high', '["Manufacturing", "Healthcare", "Smart Buildings", "Retail", "Education"]', '["802.1X-EAP-TLS", "MAC-based Authentication", "Certificate Provisioning", "Device Fingerprinting"]', '["IoT VLAN Segmentation", "Micro-segmentation", "East-West Traffic Control", "OT Network Integration"]', '["Device Identity Verification", "Firmware Integrity", "Communication Encryption", "Anomaly Detection"]', '["IoT Device Discovery", "Device Categorization", "Certificate Deployment", "Network Segmentation", "Policy Enforcement", "Monitoring Implementation", "Incident Response"]', '["100% Device Visibility", "Automated Policy Application", "Zero IoT-related Breaches", "Operational Continuity"]', '["Device Diversity", "Legacy Device Support", "Scalability", "Operational Impact", "Vendor Coordination"]', '["Device Inventory Management", "Risk-based Segmentation", "Automated Policies", "Continuous Monitoring", "Vendor Engagement"]', '["IoT Security Platform", "Network Segmentation", "SIEM", "Asset Management", "Certificate Management"]', '["IEC 62443", "NIST IoT Framework", "Industry-specific IoT Standards"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Contractor and Temporary Access', 'Time-limited network access for contractors and temporary workers with role-based permissions', 'Contractor Access', 'medium', 'medium', '["Enterprise", "Government", "Manufacturing", "Healthcare", "Financial Services"]', '["802.1X-PEAP", "Temporary Certificates", "Role-based Access", "Sponsored Guest"]', '["Limited Network Access", "Project-specific Resources", "Time-bound Access", "Audit Logging"]', '["Background Verification", "Access Governance", "Data Protection", "Activity Monitoring"]', '["Contractor Onboarding Process", "Access Request Workflow", "Resource Provisioning", "Monitoring Setup", "Offboarding Automation", "Audit Compliance"]', '["< 4 hour access provisioning", "Zero access violations", "Complete audit trail", "Automated offboarding"]', '["Access Scope Definition", "Workflow Complexity", "Compliance Requirements", "Vendor Management"]', '["Standardized Processes", "Automation Where Possible", "Clear Communication", "Regular Access Reviews", "Compliance Integration"]', '["Identity Governance", "Workflow Automation", "SIEM", "Data Classification", "Access Analytics"]', '["SOX", "HIPAA", "Government Security Requirements", "Vendor Management Policies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Healthcare Patient Network', 'Secure network access for patient devices and personal equipment in healthcare facilities', 'Healthcare', 'high', 'high', '["Healthcare", "Long-term Care", "Rehabilitation", "Mental Health"]', '["Captive Portal", "Device Registration", "Medical Device Certificates", "Patient Privacy Controls"]', '["HIPAA-compliant Segmentation", "Medical Device VLAN", "Patient Network Isolation", "Emergency Access"]', '["Patient Privacy", "Medical Device Security", "Data Encryption", "Audit Compliance"]', '["Patient Network Design", "Privacy Policy Implementation", "Device Registration Portal", "Medical Device Integration", "Compliance Monitoring", "Staff Training"]', '["HIPAA Compliance", "Zero Patient Data Exposure", "99.9% Medical Device Availability", "Patient Satisfaction"]', '["Privacy Regulations", "Medical Device Complexity", "Emergency Access Requirements", "Staff Training"]', '["Privacy by Design", "Risk-based Segmentation", "Emergency Override Procedures", "Continuous Compliance Monitoring"]', '["HIPAA Compliance Tools", "Medical Device Management", "Patient Privacy Controls", "Audit Systems"]', '["HIPAA", "HITECH", "State Privacy Laws", "Medical Device Regulations"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Remote Worker VPN Access', 'Secure remote access for distributed workforce with Zero Trust principles', 'Remote Access', 'high', 'medium', '["Enterprise", "Technology", "Financial Services", "Government", "Consulting"]', '["Certificate-based VPN", "MFA", "Device Compliance", "Zero Trust Access"]', '["VPN Concentrators", "Cloud Access Points", "SD-WAN Integration", "Direct Internet Access"]', '["Device Trust", "Application-level Security", "Data Loss Prevention", "Session Monitoring"]', '["Remote Access Strategy", "VPN Infrastructure", "Device Management", "Application Access Controls", "Monitoring Implementation", "User Training"]', '["< 30 second connection time", "Zero VPN-related breaches", "99.5% availability", "User productivity maintained"]', '["Performance vs Security", "Device Diversity", "User Experience", "Scalability", "Cost Management"]', '["Zero Trust Architecture", "Performance Optimization", "User-centric Design", "Continuous Monitoring", "Regular Security Updates"]', '["ZTNA", "SASE", "SD-WAN", "Cloud Security", "Endpoint Protection", "Identity Management"]', '["SOC 2", "ISO 27001", "NIST Cybersecurity Framework", "Industry-specific Requirements"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Educational Institution Network', 'Comprehensive network access management for students, faculty, and staff in educational environments', 'Education', 'medium', 'medium', '["K-12 Education", "Higher Education", "Research Institutions", "Training Centers"]', '["802.1X-PEAP", "Student Credentials", "Device Registration", "Educational App SSO"]', '["Student Network", "Faculty Network", "Research Network", "Administrative Network", "Guest Access"]', '["Student Privacy", "Content Filtering", "Academic Integrity", "Data Protection"]', '["Network Architecture Design", "Identity System Integration", "Device Onboarding", "Content Policy Implementation", "Monitoring Setup", "User Training"]', '["99% Authentication Success", "Improved Learning Experience", "Enhanced Security Posture", "Simplified Management"]', '["Device Diversity", "User Training", "Content Filtering Balance", "Privacy Compliance", "Budget Constraints"]', '["Age-appropriate Policies", "Educational Technology Integration", "Simplified User Experience", "Parent/Guardian Transparency"]', '["Learning Management Systems", "Student Information Systems", "Content Filtering", "Digital Citizenship Tools"]', '["FERPA", "COPPA", "State Education Privacy Laws", "Accessibility Requirements"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Retail Customer Wi-Fi', 'Customer-facing wireless network with marketing integration and analytics', 'Retail', 'medium', 'low', '["Retail", "Hospitality", "Entertainment", "Food Service", "Shopping Centers"]', '["Captive Portal", "Social Media Login", "Email Registration", "SMS Verification", "Loyalty Program Integration"]', '["Customer Network Isolation", "Bandwidth Management", "Location Services", "Analytics Integration"]', '["Customer Privacy", "Data Collection Compliance", "Network Abuse Prevention", "Brand Protection"]', '["Customer Experience Design", "Portal Customization", "Analytics Integration", "Privacy Compliance", "Marketing Automation", "Performance Optimization"]', '["High Customer Adoption", "Positive Brand Experience", "Valuable Analytics Data", "Compliance with Privacy Laws"]', '["User Experience vs Data Collection", "Privacy Regulations", "Support Complexity", "Marketing Integration"]', '["Frictionless Experience", "Clear Privacy Policies", "Value Exchange for Data", "Performance Monitoring", "Regular Updates"]', '["Customer Analytics", "Marketing Automation", "CRM Integration", "Location Services", "Social Media APIs"]', '["GDPR", "CCPA", "Industry Privacy Standards", "Marketing Compliance Requirements"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Critical Infrastructure Protection', 'Specialized network security for critical infrastructure and operational technology environments', 'Critical Infrastructure', 'very_high', 'very_high', '["Utilities", "Transportation", "Energy", "Water Treatment", "Manufacturing", "Government"]', '["Certificate-based Authentication", "Hardware Security Modules", "Air-gapped Networks", "Multi-factor Authentication"]', '["OT Network Segmentation", "Industrial Protocols", "Real-time Requirements", "Redundant Connectivity", "Emergency Access"]', '["Safety-critical Systems", "Availability Requirements", "Physical Security", "Supply Chain Security", "Cyber-Physical Security"]', '["Risk Assessment", "Network Architecture", "Security Zone Implementation", "Access Control", "Monitoring Systems", "Incident Response", "Compliance Validation"]', '["Zero Safety Incidents", "99.99% Availability", "Regulatory Compliance", "Threat Detection < 1 minute", "Recovery Time < 15 minutes"]', '["Legacy System Integration", "Real-time Constraints", "Safety Requirements", "Regulatory Compliance", "Vendor Dependencies"]', '["Defense in Depth", "Assume Breach Mentality", "Continuous Monitoring", "Regular Drills", "Vendor Risk Management", "Insider Threat Program"]', '["SCADA Systems", "Industrial Firewalls", "Security Information Management", "Anomaly Detection", "Backup Systems"]', '["NERC CIP", "IEC 62443", "NIST Critical Infrastructure Framework", "TSA Pipeline Security", "Nuclear Regulatory Requirements"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive requirements
INSERT INTO requirements_library (title, description, category, priority, implementation_approach, verification_methods, dependencies, related_standards, typical_timeline, cost_impact, risk_level, industry_specific, compliance_frameworks, created_by) VALUES

('PKI Certificate Infrastructure', 'Deploy and manage Public Key Infrastructure for certificate-based authentication', 'Authentication Infrastructure', 'high', 'Deploy enterprise CA hierarchy with automated certificate enrollment and lifecycle management', '["Certificate Validation Testing", "CA Security Audit", "Certificate Renewal Testing", "Revocation Testing"]', '["Active Directory", "DNS Infrastructure", "Network Connectivity", "Security Policies"]', '["RFC 5280", "PKCS Standards", "X.509 Certificate Profile"]', '3-6 months', 'high', 'medium', '["Healthcare", "Financial Services", "Government"]', '["FIPS 140-2", "Common Criteria", "FISMA"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Network Segmentation Implementation', 'Implement logical network segmentation using VLANs and access control lists', 'Network Architecture', 'high', 'Design and implement VLAN strategy with dynamic assignment and micro-segmentation', '["Network Scanning", "Traffic Analysis", "Access Testing", "Performance Monitoring"]', '["Network Infrastructure", "VLAN Capable Switches", "Routing Equipment", "Firewall Rules"]', '["IEEE 802.1Q", "IEEE 802.1X", "NIST Network Segmentation Guidance"]', '2-4 months', 'medium', 'low', '["Healthcare", "Financial Services", "Manufacturing"]', '["PCI-DSS", "HIPAA", "SOX", "IEC 62443"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Identity Provider Integration', 'Integrate with enterprise identity providers for centralized authentication', 'Identity Management', 'high', 'Configure SAML/OIDC integration with existing identity providers for SSO', '["SSO Testing", "Token Validation", "Attribute Mapping Verification", "Failover Testing"]', '["Identity Provider", "SAML/OIDC Configuration", "User Directory", "Trust Relationships"]', '["SAML 2.0", "OpenID Connect", "OAuth 2.0", "LDAP v3"]', '1-3 months', 'low', 'low', '["Enterprise", "Education", "Government"]', '["SOC 2", "ISO 27001", "FedRAMP"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Multi-Factor Authentication', 'Implement strong multi-factor authentication for administrative and user access', 'Access Control', 'very_high', 'Deploy MFA solution with multiple authentication factors and risk-based policies', '["MFA Factor Testing", "Bypass Attempt Testing", "Recovery Process Testing", "User Experience Testing"]', '["MFA Provider", "User Devices", "Network Connectivity", "User Training"]', '["NIST SP 800-63B", "FIDO2", "WebAuthn", "TOTP RFC 6238"]', '1-2 months', 'medium', 'low', '["Financial Services", "Healthcare", "Government"]', '["PCI-DSS", "HIPAA", "SOX", "DFARS"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Endpoint Device Management', 'Establish comprehensive endpoint device management and compliance monitoring', 'Device Management', 'high', 'Deploy MDM/EMM solution with device compliance policies and remote management', '["Device Enrollment Testing", "Compliance Policy Testing", "Remote Wipe Testing", "App Deployment Testing"]', '["MDM Platform", "Device Certificates", "Network Infrastructure", "Mobile Device Policies"]', '["Apple DEP", "Android Enterprise", "Windows Autopilot", "BYOD Frameworks"]', '2-4 months', 'medium', 'medium', '["Enterprise", "Healthcare", "Education"]', '["HIPAA", "GDPR", "Corporate Security Policies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Wireless Network Security', 'Implement enterprise-grade wireless security with WPA3 and certificate authentication', 'Wireless Security', 'high', 'Deploy WPA3-Enterprise with 802.1X authentication and wireless intrusion detection', '["Wireless Penetration Testing", "Signal Coverage Testing", "Authentication Testing", "Rogue AP Detection Testing"]', '["Wireless Infrastructure", "Certificate Infrastructure", "RADIUS Server", "Wireless Controllers"]', '["IEEE 802.11", "WPA3", "IEEE 802.1X", "RFC 3579"]', '1-3 months', 'medium', 'medium', '["Enterprise", "Education", "Healthcare"]', '["HIPAA", "PCI-DSS", "ISO 27001"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Guest Network Isolation', 'Provide secure guest network access with appropriate isolation and monitoring', 'Guest Access', 'medium', 'Deploy captive portal with guest registration and network isolation controls', '["Guest Registration Testing", "Isolation Verification", "Bandwidth Testing", "Content Filtering Testing"]', '["Guest Network Infrastructure", "Captive Portal", "Firewall Rules", "Content Filtering"]', '["RFC 3986", "HTTP Captive Portal", "Guest Network Best Practices"]', '1-2 months', 'low', 'low', '["Hospitality", "Retail", "Education"]', '["Industry Best Practices", "Privacy Regulations"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('IoT Device Security', 'Secure IoT devices with appropriate authentication, segmentation, and monitoring', 'IoT Security', 'high', 'Implement IoT device discovery, certificate provisioning, and network micro-segmentation', '["IoT Device Discovery", "Certificate Deployment Testing", "Network Isolation Testing", "Anomaly Detection Testing"]', '["IoT Device Inventory", "Certificate Management", "Network Segmentation", "IoT Security Platform"]', '["IEC 62443", "NIST IoT Security", "Industry IoT Standards"]', '3-6 months', 'high', 'high', '["Manufacturing", "Healthcare", "Smart Buildings"]', '["IEC 62443", "NIST Cybersecurity Framework", "Industry Standards"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('BYOD Policy Implementation', 'Establish comprehensive BYOD policies with device registration and compliance', 'BYOD Management', 'medium', 'Create BYOD policy framework with device registration portal and compliance monitoring', '["Device Registration Testing", "Policy Enforcement Testing", "Data Segregation Testing", "Remote Wipe Testing"]', '["BYOD Policy", "Device Registration Portal", "MDM Platform", "User Training"]', '["BYOD Best Practices", "Privacy Frameworks", "Mobile Security Standards"]', '2-3 months', 'medium', 'medium', '["Enterprise", "Education", "Technology"]', '["GDPR", "CCPA", "Corporate Privacy Policies"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Remote Access Security', 'Implement secure remote access with VPN and Zero Trust principles', 'Remote Access', 'high', 'Deploy Zero Trust Network Access with device compliance and application-level security', '["VPN Connectivity Testing", "Device Compliance Testing", "Application Access Testing", "Performance Testing"]', '["VPN Infrastructure", "Device Management", "Identity Provider", "Application Gateways"]', '["ZTNA Frameworks", "VPN Standards", "Remote Access Best Practices"]', '2-4 months', 'medium', 'medium', '["Enterprise", "Technology", "Financial Services"]', '["SOC 2", "ISO 27001", "Industry Security Standards"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Compliance Monitoring and Reporting', 'Establish continuous compliance monitoring with automated reporting', 'Compliance', 'high', 'Implement compliance monitoring platform with automated policy enforcement and reporting', '["Compliance Report Validation", "Policy Enforcement Testing", "Audit Trail Verification", "Automated Alert Testing"]', '["Compliance Platform", "Policy Framework", "Audit Systems", "Reporting Tools"]', '["Regulatory Frameworks", "Industry Standards", "Audit Requirements"]', '2-3 months', 'medium', 'low', '["Healthcare", "Financial Services", "Government"]', '["HIPAA", "PCI-DSS", "SOX", "GDPR", "FISMA"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Network Monitoring and Analytics', 'Deploy comprehensive network monitoring with security analytics and threat detection', 'Security Monitoring', 'high', 'Implement SIEM with network traffic analysis and automated threat detection', '["Log Collection Testing", "Alert Generation Testing", "Threat Detection Testing", "Response Workflow Testing"]', '["SIEM Platform", "Network Monitoring Tools", "Log Sources", "Analytics Engine"]', '["SIEM Standards", "Log Management Best Practices", "Threat Intelligence Frameworks"]', '3-4 months', 'high', 'medium', '["Enterprise", "Financial Services", "Government"]', '["SOC 2", "ISO 27001", "NIST Cybersecurity Framework"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Update existing config templates with more comprehensive data
UPDATE configuration_templates SET
  template_content = CASE 
    WHEN name = 'Cisco Catalyst 9000 802.1X Template' THEN '! Cisco Catalyst 9000 Enterprise 802.1X Configuration
! Optimized for maximum security and performance
!
version 16.12
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
service compress-config
!
hostname {{SWITCH_HOSTNAME}}
!
boot-start-marker
boot-end-marker
!
vrf definition Mgmt-vrf
 !
 address-family ipv4
 exit-address-family
 !
 address-family ipv6
 exit-address-family
!
enable secret 5 $1${{ENABLE_SECRET}}
!
aaa new-model
!
aaa group server radius ISE-SERVERS
 server name ISE-PRIMARY
 server name ISE-SECONDARY
 ip vrf forwarding Mgmt-vrf
!
aaa authentication login default local
aaa authentication login CONSOLE none
aaa authentication dot1x default group ISE-SERVERS
aaa authorization network default group ISE-SERVERS
aaa authorization network ISE-AUTHZ group ISE-SERVERS
aaa accounting dot1x default start-stop group ISE-SERVERS
aaa accounting system default start-stop group ISE-SERVERS
!
aaa server radius dynamic-author
 client {{ISE_PRIMARY_IP}} server-key {{RADIUS_KEY}}
 client {{ISE_SECONDARY_IP}} server-key {{RADIUS_KEY}}
!
aaa session-id common
!
clock timezone {{TIMEZONE}} {{UTC_OFFSET}}
!
system mtu routing 1500
!
vtp mode transparent
!
ip routing
!
ip domain-name {{DOMAIN_NAME}}
ip name-server {{DNS_PRIMARY}}
ip name-server {{DNS_SECONDARY}}
!
login on-failure log
login on-success log
!
spanning-tree mode rapid-pvst
spanning-tree extend system-id
spanning-tree vlan 1-4094 priority 61440
!
errdisable recovery cause security-violation
errdisable recovery interval 300
!
vlan {{EMPLOYEE_VLAN}}
 name EMPLOYEE-VLAN
!
vlan {{GUEST_VLAN}}
 name GUEST-VLAN
!
vlan {{IOT_VLAN}}
 name IOT-VLAN
!
vlan {{QUARANTINE_VLAN}}
 name QUARANTINE-VLAN
!
vlan {{VOICE_VLAN}}
 name VOICE-VLAN
!
interface GigabitEthernet0/0
 vrf forwarding Mgmt-vrf
 ip address {{MGMT_IP}} {{MGMT_MASK}}
 negotiation auto
!
interface range GigabitEthernet1/0/1-48
 description User Access Ports
 switchport mode access
 switchport access vlan {{EMPLOYEE_VLAN}}
 switchport voice vlan {{VOICE_VLAN}}
 authentication event fail action next-method
 authentication event server dead action authorize vlan {{QUARANTINE_VLAN}}
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication timer inactivity server
 authentication violation restrict
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 3
 spanning-tree portfast
 spanning-tree bpduguard enable
 storm-control broadcast level 1.00
 storm-control multicast level 1.00
 storm-control action shutdown
!
interface range GigabitEthernet1/0/49-52
 description Uplink Ports
 switchport mode trunk
 switchport trunk allowed vlan {{EMPLOYEE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}},{{VOICE_VLAN}}
 channel-group 1 mode active
!
interface Port-channel1
 description Uplink to Core
 switchport mode trunk
 switchport trunk allowed vlan {{EMPLOYEE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}},{{VOICE_VLAN}}
!
ip http server
ip http authentication local
ip http secure-server
ip http client source-interface Vlan{{EMPLOYEE_VLAN}}
!
ip route vrf Mgmt-vrf 0.0.0.0 0.0.0.0 {{MGMT_GATEWAY}}
!
logging origin-id hostname
logging facility local0
logging {{SYSLOG_SERVER}}
!
snmp-server community {{SNMP_RO_COMMUNITY}} RO
snmp-server community {{SNMP_RW_COMMUNITY}} RW
snmp-server location {{SITE_LOCATION}}
snmp-server contact {{SITE_CONTACT}}
snmp-server host {{SNMP_SERVER}} version 2c {{SNMP_RO_COMMUNITY}}
snmp-server enable traps snmp authentication linkdown linkup coldstart warmstart
snmp-server enable traps config
snmp-server enable traps entity
!
radius server ISE-PRIMARY
 address ipv4 {{ISE_PRIMARY_IP}} auth-port 1812 acct-port 1813
 automate-tester username {{RADIUS_TEST_USER}}
 key {{RADIUS_KEY}}
!
radius server ISE-SECONDARY
 address ipv4 {{ISE_SECONDARY_IP}} auth-port 1812 acct-port 1813
 automate-tester username {{RADIUS_TEST_USER}}
 key {{RADIUS_KEY}}
!
line con 0
 authentication login CONSOLE
 logging synchronous
 stopbits 1
!
line aux 0
 stopbits 1
!
line vty 0 4
 authentication login default
 transport input ssh
!
line vty 5 15
 authentication login default
 transport input ssh
!
ntp source Vlan{{EMPLOYEE_VLAN}}
ntp server {{NTP_PRIMARY}}
ntp server {{NTP_SECONDARY}}
!
end'
    ELSE template_content
  END,
  template_variables = CASE 
    WHEN name = 'Cisco Catalyst 9000 802.1X Template' THEN '{
      "SWITCH_HOSTNAME": {"type": "string", "description": "Switch hostname", "required": true, "default": "SW-ACCESS-01"},
      "ENABLE_SECRET": {"type": "password", "description": "Enable secret password", "required": true},
      "DOMAIN_NAME": {"type": "string", "description": "DNS domain name", "required": true, "default": "company.com"},
      "DNS_PRIMARY": {"type": "ip", "description": "Primary DNS server", "required": true},
      "DNS_SECONDARY": {"type": "ip", "description": "Secondary DNS server", "required": true},
      "TIMEZONE": {"type": "string", "description": "Timezone", "required": true, "default": "PST"},
      "UTC_OFFSET": {"type": "integer", "description": "UTC offset", "required": true, "default": -8},
      "MGMT_IP": {"type": "ip", "description": "Management IP address", "required": true},
      "MGMT_MASK": {"type": "netmask", "description": "Management subnet mask", "required": true, "default": "255.255.255.0"},
      "MGMT_GATEWAY": {"type": "ip", "description": "Management gateway", "required": true},
      "EMPLOYEE_VLAN": {"type": "integer", "description": "Employee VLAN ID", "required": true, "default": 100},
      "GUEST_VLAN": {"type": "integer", "description": "Guest VLAN ID", "required": true, "default": 200},
      "IOT_VLAN": {"type": "integer", "description": "IoT VLAN ID", "required": true, "default": 300},
      "QUARANTINE_VLAN": {"type": "integer", "description": "Quarantine VLAN ID", "required": true, "default": 999},
      "VOICE_VLAN": {"type": "integer", "description": "Voice VLAN ID", "required": true, "default": 150},
      "ISE_PRIMARY_IP": {"type": "ip", "description": "Primary ISE server IP", "required": true},
      "ISE_SECONDARY_IP": {"type": "ip", "description": "Secondary ISE server IP", "required": true},
      "RADIUS_KEY": {"type": "password", "description": "RADIUS shared secret", "required": true},
      "RADIUS_TEST_USER": {"type": "string", "description": "RADIUS test username", "required": true, "default": "test-user"},
      "SYSLOG_SERVER": {"type": "ip", "description": "Syslog server IP", "required": true},
      "SNMP_RO_COMMUNITY": {"type": "string", "description": "SNMP read-only community", "required": true, "default": "public"},
      "SNMP_RW_COMMUNITY": {"type": "string", "description": "SNMP read-write community", "required": true, "default": "private"},
      "SNMP_SERVER": {"type": "ip", "description": "SNMP management server", "required": true},
      "SITE_LOCATION": {"type": "string", "description": "Physical site location", "required": true},
      "SITE_CONTACT": {"type": "string", "description": "Site contact information", "required": true},
      "NTP_PRIMARY": {"type": "ip", "description": "Primary NTP server", "required": true},
      "NTP_SECONDARY": {"type": "ip", "description": "Secondary NTP server", "required": true}
    }'::jsonb
    ELSE template_variables
  END
WHERE name = 'Cisco Catalyst 9000 802.1X Template';

-- Add extensive configuration templates for different vendors and scenarios
INSERT INTO configuration_templates (name, description, category, subcategory, configuration_type, template_content, vendor_id, template_variables, supported_scenarios, authentication_methods, network_requirements, security_features, best_practices, troubleshooting_guide, validation_commands, tags, complexity_level, is_public, is_validated, created_by) VALUES

('Aruba ClearPass Policy Configuration', 'Comprehensive ClearPass policy configuration for enterprise 802.1X deployment', 'NAC', 'Policy Engine', 'policy', '-- Aruba ClearPass Policy Configuration
-- Enterprise 802.1X with dynamic VLAN assignment

-- Service Configuration
CREATE SERVICE "Employee_802.1X_Service"
TYPE "802.1X"
DESCRIPTION "Employee 802.1X authentication service"
AUTHENTICATION_METHODS ["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS"]
AUTHORIZATION_SOURCES ["Active Directory", "Local Users"]
POSTURE_POLICIES ["Corporate_Compliance_Policy"]
DEVICE_PROFILING_ENABLED true;

-- Authentication Source
CREATE AUTH_SOURCE "Corporate_AD"
TYPE "Active Directory"
SERVER_IP "{{AD_SERVER_IP}}"
BASE_DN "{{AD_BASE_DN}}"
BIND_DN "{{AD_BIND_DN}}"
BIND_PASSWORD "{{AD_BIND_PASSWORD}}"
SEARCH_FILTER "(sAMAccountName=%{Authentication:Username})"
USER_SEARCH_BASE "{{AD_USER_OU}}"
GROUP_SEARCH_BASE "{{AD_GROUP_OU}}";

-- Role Mapping Rules
CREATE ROLE_MAPPING "Employee_Role_Mapping"
RULE_EVALUATION_TYPE "First Applicable"
RULES [
  {
    "condition": "Authentication:Username CONTAINS \"admin\"",
    "role": "IT_Admin",
    "enforcement_profile": "IT_Admin_Profile"
  },
  {
    "condition": "Authentication:AD-Group CONTAINS \"Executives\"",
    "role": "Executive",
    "enforcement_profile": "Executive_Profile"
  },
  {
    "condition": "Authentication:AD-Group CONTAINS \"Employees\"",
    "role": "Employee",
    "enforcement_profile": "Employee_Profile"
  },
  {
    "condition": "DEFAULT",
    "role": "Guest",
    "enforcement_profile": "Guest_Profile"
  }
];

-- Enforcement Profiles
CREATE ENFORCEMENT_PROFILE "IT_Admin_Profile"
VLAN_ID {{IT_ADMIN_VLAN}}
VLAN_NAME "IT-ADMIN-VLAN"
ACCESS_CONTROL_LIST ["PERMIT_ALL"]
BANDWIDTH_LIMIT_UP 0
BANDWIDTH_LIMIT_DOWN 0
SESSION_TIMEOUT 0
REAUTHENTICATION_TIMEOUT 0
ADDITIONAL_ATTRIBUTES {
  "Filter-Id": "IT-Admin-ACL",
  "Tunnel-Type": "VLAN",
  "Tunnel-Medium-Type": "IEEE-802",
  "Tunnel-Private-Group-Id": "{{IT_ADMIN_VLAN}}"
};

CREATE ENFORCEMENT_PROFILE "Employee_Profile"
VLAN_ID {{EMPLOYEE_VLAN}}
VLAN_NAME "EMPLOYEE-VLAN"
ACCESS_CONTROL_LIST ["Corporate_Internet_Access", "Corporate_Resources"]
BANDWIDTH_LIMIT_UP {{EMPLOYEE_BANDWIDTH_UP}}
BANDWIDTH_LIMIT_DOWN {{EMPLOYEE_BANDWIDTH_DOWN}}
SESSION_TIMEOUT {{EMPLOYEE_SESSION_TIMEOUT}}
REAUTHENTICATION_TIMEOUT {{EMPLOYEE_REAUTH_TIMEOUT}}
ADDITIONAL_ATTRIBUTES {
  "Filter-Id": "Employee-ACL",
  "Tunnel-Type": "VLAN",
  "Tunnel-Medium-Type": "IEEE-802",
  "Tunnel-Private-Group-Id": "{{EMPLOYEE_VLAN}}"
};

-- Device Profiling Rules
CREATE DEVICE_PROFILE "Corporate_Windows_Laptop"
CLASSIFICATION_RULES [
  "DHCP:Vendor-Class-Identifier CONTAINS \"MSFT\"",
  "HTTP:User-Agent CONTAINS \"Windows\""
]
DEVICE_CATEGORY "Computer"
DEVICE_FAMILY "Windows"
ASSIGNED_ROLE "Employee"
COMPLIANCE_REQUIREMENTS ["Antivirus_Check", "OS_Update_Check", "Encryption_Check"];

-- Posture Policies
CREATE POSTURE_POLICY "Corporate_Compliance_Policy"
REQUIREMENTS [
  {
    "type": "antivirus",
    "vendor": "ANY",
    "minimum_version": "LATEST",
    "real_time_protection": true,
    "action_on_failure": "QUARANTINE"
  },
  {
    "type": "os_updates",
    "critical_updates_installed": true,
    "maximum_days_since_update": 30,
    "action_on_failure": "QUARANTINE"
  },
  {
    "type": "firewall",
    "enabled": true,
    "action_on_failure": "QUARANTINE"
  }
]
QUARANTINE_VLAN {{QUARANTINE_VLAN}}
REMEDIATION_URL "https://{{CLEARPASS_SERVER}}/guest/remediation.php";

-- Guest Access Configuration
CREATE GUEST_SERVICE "Corporate_Guest_Access"
AUTHENTICATION_METHOD "Self-Registration"
SPONSOR_APPROVAL_REQUIRED false
TERMS_OF_USE_REQUIRED true
DATA_COLLECTION_FIELDS ["email", "name", "company", "phone"]
ACCOUNT_LIFETIME {{GUEST_ACCOUNT_LIFETIME}}
ACCESS_VLAN {{GUEST_VLAN}}
BANDWIDTH_LIMIT {{GUEST_BANDWIDTH_LIMIT}}
CONTENT_FILTERING_ENABLED true;

-- RADIUS Client Configuration
CREATE RADIUS_CLIENT "Campus_Switches"
IP_RANGE "{{SWITCH_IP_RANGE}}"
SHARED_SECRET "{{RADIUS_SHARED_SECRET}}"
VENDOR "Aruba"
COA_CAPABLE true
COA_PORT 3799
DESCRIPTION "Campus access layer switches";

-- Network Access Device Profiles
CREATE NAD_PROFILE "Aruba_Switch_Profile"
VENDOR "Aruba"
DEVICE_TYPE "Switch"
RADIUS_ACCOUNTING_ENABLED true
COA_CAPABLE true
SNMP_READ_COMMUNITY "{{SNMP_RO_COMMUNITY}}"
SNMP_WRITE_COMMUNITY "{{SNMP_RW_COMMUNITY}}"
CLI_USERNAME "{{SWITCH_CLI_USERNAME}}"
CLI_PASSWORD "{{SWITCH_CLI_PASSWORD}}";

-- Certificate Authority Configuration
CREATE CERTIFICATE_AUTHORITY "Corporate_CA"
CA_CERTIFICATE_PATH "/opt/ClearPass/Certificates/Corporate_CA.crt"
PRIVATE_KEY_PATH "/opt/ClearPass/Certificates/Corporate_CA.key"
CERTIFICATE_TEMPLATE "User_Authentication_Template"
AUTO_ENROLLMENT_ENABLED true
SCEP_ENABLED true
SCEP_CHALLENGE_PASSWORD "{{SCEP_CHALLENGE_PASSWORD}}";

-- OnGuard Posture Plugin Configuration
CREATE ONGUARD_PLUGIN "Windows_Posture_Check"
SUPPORTED_OS ["Windows 10", "Windows 11"]
REQUIREMENTS [
  "registry_check:HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
  "process_check:winlogon.exe",
  "service_check:Windows Defender Antivirus Service"
]
DOWNLOAD_URL "https://{{CLEARPASS_SERVER}}/guest/onguard.php"
AUTO_REMEDIATION_ENABLED true;', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Aruba ClearPass'),
'{
  "CLEARPASS_SERVER": {"type": "fqdn", "description": "ClearPass server FQDN", "required": true},
  "AD_SERVER_IP": {"type": "ip", "description": "Active Directory server IP", "required": true},
  "AD_BASE_DN": {"type": "string", "description": "AD Base Distinguished Name", "required": true, "example": "DC=company,DC=com"},
  "AD_BIND_DN": {"type": "string", "description": "AD Bind DN for ClearPass", "required": true, "example": "CN=clearpass,OU=Service Accounts,DC=company,DC=com"},
  "AD_BIND_PASSWORD": {"type": "password", "description": "AD Bind password", "required": true},
  "AD_USER_OU": {"type": "string", "description": "AD Users OU", "required": true, "example": "OU=Users,DC=company,DC=com"},
  "AD_GROUP_OU": {"type": "string", "description": "AD Groups OU", "required": true, "example": "OU=Groups,DC=company,DC=com"},
  "IT_ADMIN_VLAN": {"type": "integer", "description": "IT Admin VLAN ID", "required": true, "default": 10},
  "EMPLOYEE_VLAN": {"type": "integer", "description": "Employee VLAN ID", "required": true, "default": 100},
  "GUEST_VLAN": {"type": "integer", "description": "Guest VLAN ID", "required": true, "default": 200},
  "QUARANTINE_VLAN": {"type": "integer", "description": "Quarantine VLAN ID", "required": true, "default": 999},
  "EMPLOYEE_BANDWIDTH_UP": {"type": "integer", "description": "Employee upload bandwidth (Mbps)", "required": false, "default": 50},
  "EMPLOYEE_BANDWIDTH_DOWN": {"type": "integer", "description": "Employee download bandwidth (Mbps)", "required": false, "default": 100},
  "EMPLOYEE_SESSION_TIMEOUT": {"type": "integer", "description": "Employee session timeout (minutes)", "required": false, "default": 480},
  "EMPLOYEE_REAUTH_TIMEOUT": {"type": "integer", "description": "Employee reauthentication timeout (minutes)", "required": false, "default": 60},
  "GUEST_ACCOUNT_LIFETIME": {"type": "integer", "description": "Guest account lifetime (hours)", "required": true, "default": 24},
  "GUEST_BANDWIDTH_LIMIT": {"type": "integer", "description": "Guest bandwidth limit (Mbps)", "required": true, "default": 10},
  "SWITCH_IP_RANGE": {"type": "cidr", "description": "Switch IP range", "required": true, "example": "10.1.0.0/24"},
  "RADIUS_SHARED_SECRET": {"type": "password", "description": "RADIUS shared secret", "required": true},
  "SNMP_RO_COMMUNITY": {"type": "string", "description": "SNMP read-only community", "required": true, "default": "public"},
  "SNMP_RW_COMMUNITY": {"type": "string", "description": "SNMP read-write community", "required": true, "default": "private"},
  "SWITCH_CLI_USERNAME": {"type": "string", "description": "Switch CLI username", "required": true},
  "SWITCH_CLI_PASSWORD": {"type": "password", "description": "Switch CLI password", "required": true},
  "SCEP_CHALLENGE_PASSWORD": {"type": "password", "description": "SCEP challenge password", "required": true}
}'::jsonb,
'["Enterprise Authentication", "BYOD", "Guest Access", "Posture Assessment", "Certificate Management"]'::jsonb,
'["802.1X-EAP-TLS", "802.1X-PEAP", "802.1X-EAP-TTLS", "Guest Portal", "Self-Registration"]'::jsonb,
'{"dhcp_required": true, "dns_required": true, "radius_required": true, "certificate_authority": true}'::jsonb,
'["Dynamic VLAN Assignment", "Posture Assessment", "Certificate-based Authentication", "Role-based Access Control", "Guest Network Isolation"]'::jsonb,
'["Gradual Rollout", "Comprehensive Testing", "User Training", "Certificate Lifecycle Management", "Regular Policy Review"]'::jsonb,
'["Authentication Failures", "Certificate Issues", "VLAN Assignment Problems", "Posture Compliance Failures", "Guest Access Issues"]'::jsonb,
'["Test RADIUS connectivity", "Verify certificate deployment", "Check VLAN assignment", "Validate posture policies", "Monitor authentication logs"]'::jsonb,
'["clearpass", "policy", "802.1x", "enterprise", "dynamic-vlan", "posture", "certificates"]'::jsonb,
'very_high', true, true, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Extreme ExtremeControl NAC Configuration', 'Complete ExtremeControl NAC setup for campus deployment', 'NAC', 'Policy Engine', 'policy', '-- Extreme ExtremeControl NAC Configuration
-- Campus-wide 802.1X deployment with asset tracking

-- Global Configuration
SET global.domain = "{{DOMAIN_NAME}}"
SET global.timezone = "{{TIMEZONE}}"
SET global.admin_email = "{{ADMIN_EMAIL}}"
SET global.syslog_server = "{{SYSLOG_SERVER}}"

-- RADIUS Configuration
CREATE radius_server primary
  address = "{{RADIUS_PRIMARY_IP}}"
  port = 1812
  secret = "{{RADIUS_SECRET}}"
  timeout = 5
  retries = 3
  accounting_port = 1813
  coa_port = 3799
END

CREATE radius_server secondary
  address = "{{RADIUS_SECONDARY_IP}}"
  port = 1812
  secret = "{{RADIUS_SECRET}}"
  timeout = 5
  retries = 3
  accounting_port = 1813
  coa_port = 3799
END

-- Network Access Device Configuration
CREATE nad_group campus_switches
  description = "Campus access layer switches"
  radius_secret = "{{RADIUS_SECRET}}"
  snmp_read_community = "{{SNMP_RO_COMMUNITY}}"
  snmp_write_community = "{{SNMP_RW_COMMUNITY}}"
  cli_username = "{{SWITCH_USERNAME}}"
  cli_password = "{{SWITCH_PASSWORD}}"
  vendor = "Extreme"
  model = "X450-G2"
  software_version = "EXOS 30.7"
END

ADD nad_device to nad_group campus_switches
  ip_address = "{{SWITCH_IP_RANGE}}"
  description = "Campus access switches"
END

-- Authentication Policy
CREATE auth_policy employee_8021x
  description = "Employee 802.1X authentication"
  authentication_methods = ["EAP-TLS", "PEAP-MSCHAPv2"]
  authorization_source = "active_directory"
  default_role = "employee"
  failure_action = "quarantine"
  guest_vlan = {{GUEST_VLAN}}
  quarantine_vlan = {{QUARANTINE_VLAN}}
  reauthentication_timer = {{REAUTH_TIMER}}
END

-- Active Directory Integration
CREATE directory_service active_directory
  server_ip = "{{AD_SERVER_IP}}"
  server_port = 389
  base_dn = "{{AD_BASE_DN}}"
  bind_dn = "{{AD_BIND_DN}}"
  bind_password = "{{AD_BIND_PASSWORD}}"
  user_search_base = "{{AD_USER_OU}}"
  group_search_base = "{{AD_GROUP_OU}}"
  search_filter = "(sAMAccountName=%{User-Name})"
  connection_timeout = 10
  ssl_enabled = true
END

-- User Roles and VLANs
CREATE user_role it_admin
  description = "IT Administrative users"
  vlan_id = {{IT_ADMIN_VLAN}}
  vlan_name = "IT-ADMIN"
  access_list = "permit_all"
  bandwidth_up = 0
  bandwidth_down = 0
  session_timeout = 0
  ad_group_filter = "IT-Admins"
END

CREATE user_role employee
  description = "Standard employees"
  vlan_id = {{EMPLOYEE_VLAN}}
  vlan_name = "EMPLOYEE"
  access_list = "corporate_access"
  bandwidth_up = {{EMPLOYEE_BW_UP}}
  bandwidth_down = {{EMPLOYEE_BW_DOWN}}
  session_timeout = {{EMPLOYEE_SESSION_TIMEOUT}}
  ad_group_filter = "Employees"
END

CREATE user_role contractor
  description = "Contractor access"
  vlan_id = {{CONTRACTOR_VLAN}}
  vlan_name = "CONTRACTOR"
  access_list = "limited_access"
  bandwidth_up = {{CONTRACTOR_BW_UP}}
  bandwidth_down = {{CONTRACTOR_BW_DOWN}}
  session_timeout = {{CONTRACTOR_SESSION_TIMEOUT}}
  ad_group_filter = "Contractors"
END

CREATE user_role guest
  description = "Guest users"
  vlan_id = {{GUEST_VLAN}}
  vlan_name = "GUEST"
  access_list = "internet_only"
  bandwidth_up = {{GUEST_BW_UP}}
  bandwidth_down = {{GUEST_BW_DOWN}}
  session_timeout = {{GUEST_SESSION_TIMEOUT}}
END

-- Device Profiling Rules
CREATE device_profile windows_computer
  description = "Windows computers"
  classification_rules = [
    "dhcp_vendor_class contains MSFT",
    "dhcp_hostname matches ^[A-Z0-9-]+$",
    "http_user_agent contains Windows"
  ]
  device_type = "Computer"
  os_family = "Windows"
  default_role = "employee"
  compliance_required = true
END

CREATE device_profile apple_device
  description = "Apple devices"
  classification_rules = [
    "dhcp_vendor_class contains Apple",
    "oui matches ^(00:1B:63|00:1E:C2|00:23:DF|00:25:00).*"
  ]
  device_type = "Mobile"
  os_family = "iOS/macOS"
  default_role = "employee"
  compliance_required = false
END

CREATE device_profile android_device
  description = "Android devices"
  classification_rules = [
    "dhcp_vendor_class contains android",
    "http_user_agent contains Android"
  ]
  device_type = "Mobile"
  os_family = "Android"
  default_role = "employee"
  compliance_required = false
END

-- Compliance Policies
CREATE compliance_policy corporate_compliance
  description = "Corporate device compliance requirements"
  requirements = [
    {
      "type": "antivirus",
      "required": true,
      "check_method": "registry",
      "registry_path": "HKLM\\SOFTWARE\\Microsoft\\Windows Defender",
      "action_on_failure": "quarantine"
    },
    {
      "type": "os_updates",
      "required": true,
      "max_days_since_update": 30,
      "action_on_failure": "quarantine"
    },
    {
      "type": "firewall",
      "required": true,
      "check_method": "service",
      "service_name": "Windows Firewall",
      "action_on_failure": "quarantine"
    }
  ]
  quarantine_vlan = {{QUARANTINE_VLAN}}
  remediation_url = "https://{{NAC_SERVER}}/remediation"
END

-- Guest Access Configuration
CREATE guest_portal default
  description = "Corporate guest access portal"
  portal_url = "https://{{NAC_SERVER}}/guest"
  registration_required = true
  sponsor_approval = false
  terms_acceptance = true
  data_collection = ["name", "email", "company", "phone"]
  account_duration = {{GUEST_ACCOUNT_DURATION}}
  daily_time_limit = {{GUEST_DAILY_LIMIT}}
  concurrent_sessions = 1
  email_verification = true
END

-- MAC Authentication Bypass
CREATE mab_policy iot_devices
  description = "IoT device MAC authentication"
  authorized_mac_list = "{{IOT_MAC_LIST}}"
  default_vlan = {{IOT_VLAN}}
  session_timeout = {{IOT_SESSION_TIMEOUT}}
  device_profiling = true
  compliance_check = false
END

-- Certificate Authority Integration
CREATE certificate_authority corporate_ca
  ca_server = "{{CA_SERVER}}"
  ca_template = "User"
  scep_url = "https://{{CA_SERVER}}/certsrv/mscep/mscep.dll"
  challenge_password = "{{SCEP_CHALLENGE}}"
  auto_enrollment = true
  certificate_lifetime = {{CERT_LIFETIME}}
END

-- Asset Tracking Configuration
CREATE asset_tracking default
  enabled = true
  track_ip_changes = true
  track_location_changes = true
  track_authentication_events = true
  retention_period = {{ASSET_RETENTION_DAYS}}
  database_cleanup_interval = 24
END

-- SNMP Monitoring
CREATE snmp_monitoring switch_monitoring
  enabled = true
  polling_interval = 300
  trap_listening = true
  port_state_monitoring = true
  link_up_down_traps = true
  authentication_traps = true
END

-- Event Logging and Alerting
CREATE event_policy security_events
  log_authentication_success = true
  log_authentication_failure = true
  log_authorization_changes = true
  log_policy_violations = true
  log_device_changes = true
  alert_failed_auth_threshold = {{FAILED_AUTH_THRESHOLD}}
  alert_new_device = true
  alert_policy_violation = true
  notification_email = "{{SECURITY_EMAIL}}"
END

-- High Availability Configuration
CREATE ha_cluster nac_cluster
  cluster_name = "{{CLUSTER_NAME}}"
  primary_node = "{{PRIMARY_NAC_IP}}"
  secondary_node = "{{SECONDARY_NAC_IP}}"
  virtual_ip = "{{VIRTUAL_NAC_IP}}"
  heartbeat_interface = "eth0"
  sync_interval = 30
  failover_timeout = 60
END',
(SELECT id FROM vendor_library WHERE vendor_name = 'Extreme ExtremeControl'),
'{
  "DOMAIN_NAME": {"type": "string", "description": "Domain name", "required": true, "example": "company.com"},
  "TIMEZONE": {"type": "string", "description": "Timezone", "required": true, "default": "America/New_York"},
  "ADMIN_EMAIL": {"type": "email", "description": "Administrator email", "required": true},
  "SYSLOG_SERVER": {"type": "ip", "description": "Syslog server IP", "required": true},
  "RADIUS_PRIMARY_IP": {"type": "ip", "description": "Primary RADIUS server IP", "required": true},
  "RADIUS_SECONDARY_IP": {"type": "ip", "description": "Secondary RADIUS server IP", "required": true},
  "RADIUS_SECRET": {"type": "password", "description": "RADIUS shared secret", "required": true},
  "SNMP_RO_COMMUNITY": {"type": "string", "description": "SNMP read community", "required": true, "default": "public"},
  "SNMP_RW_COMMUNITY": {"type": "string", "description": "SNMP write community", "required": true, "default": "private"},
  "SWITCH_USERNAME": {"type": "string", "description": "Switch CLI username", "required": true},
  "SWITCH_PASSWORD": {"type": "password", "description": "Switch CLI password", "required": true},
  "SWITCH_IP_RANGE": {"type": "cidr", "description": "Switch IP range", "required": true, "example": "10.1.0.0/24"},
  "AD_SERVER_IP": {"type": "ip", "description": "Active Directory server IP", "required": true},
  "AD_BASE_DN": {"type": "string", "description": "AD Base DN", "required": true, "example": "DC=company,DC=com"},
  "AD_BIND_DN": {"type": "string", "description": "AD Bind DN", "required": true},
  "AD_BIND_PASSWORD": {"type": "password", "description": "AD Bind password", "required": true},
  "AD_USER_OU": {"type": "string", "description": "AD Users OU", "required": true},
  "AD_GROUP_OU": {"type": "string", "description": "AD Groups OU", "required": true},
  "IT_ADMIN_VLAN": {"type": "integer", "description": "IT Admin VLAN", "required": true, "default": 10},
  "EMPLOYEE_VLAN": {"type": "integer", "description": "Employee VLAN", "required": true, "default": 100},
  "CONTRACTOR_VLAN": {"type": "integer", "description": "Contractor VLAN", "required": true, "default": 300},
  "GUEST_VLAN": {"type": "integer", "description": "Guest VLAN", "required": true, "default": 200},
  "IOT_VLAN": {"type": "integer", "description": "IoT VLAN", "required": true, "default": 400},
  "QUARANTINE_VLAN": {"type": "integer", "description": "Quarantine VLAN", "required": true, "default": 999},
  "REAUTH_TIMER": {"type": "integer", "description": "Reauthentication timer (minutes)", "required": true, "default": 60},
  "EMPLOYEE_BW_UP": {"type": "integer", "description": "Employee upload bandwidth (Mbps)", "required": false, "default": 50},
  "EMPLOYEE_BW_DOWN": {"type": "integer", "description": "Employee download bandwidth (Mbps)", "required": false, "default": 100},
  "EMPLOYEE_SESSION_TIMEOUT": {"type": "integer", "description": "Employee session timeout (minutes)", "required": false, "default": 480},
  "CONTRACTOR_BW_UP": {"type": "integer", "description": "Contractor upload bandwidth (Mbps)", "required": false, "default": 25},
  "CONTRACTOR_BW_DOWN": {"type": "integer", "description": "Contractor download bandwidth (Mbps)", "required": false, "default": 50},
  "CONTRACTOR_SESSION_TIMEOUT": {"type": "integer", "description": "Contractor session timeout (minutes)", "required": false, "default": 240},
  "GUEST_BW_UP": {"type": "integer", "description": "Guest upload bandwidth (Mbps)", "required": false, "default": 5},
  "GUEST_BW_DOWN": {"type": "integer", "description": "Guest download bandwidth (Mbps)", "required": false, "default": 10},
  "GUEST_SESSION_TIMEOUT": {"type": "integer", "description": "Guest session timeout (minutes)", "required": false, "default": 60},
  "GUEST_ACCOUNT_DURATION": {"type": "integer", "description": "Guest account duration (hours)", "required": true, "default": 24},
  "GUEST_DAILY_LIMIT": {"type": "integer", "description": "Guest daily time limit (hours)", "required": true, "default": 8},
  "IOT_MAC_LIST": {"type": "text", "description": "IoT device MAC addresses (comma-separated)", "required": false},
  "IOT_SESSION_TIMEOUT": {"type": "integer", "description": "IoT session timeout (minutes)", "required": false, "default": 1440},
  "CA_SERVER": {"type": "fqdn", "description": "Certificate Authority server", "required": true},
  "SCEP_CHALLENGE": {"type": "password", "description": "SCEP challenge password", "required": true},
  "CERT_LIFETIME": {"type": "integer", "description": "Certificate lifetime (days)", "required": true, "default": 365},
  "ASSET_RETENTION_DAYS": {"type": "integer", "description": "Asset tracking retention (days)", "required": true, "default": 90},
  "FAILED_AUTH_THRESHOLD": {"type": "integer", "description": "Failed authentication alert threshold", "required": true, "default": 5},
  "SECURITY_EMAIL": {"type": "email", "description": "Security team email", "required": true},
  "NAC_SERVER": {"type": "fqdn", "description": "NAC server FQDN", "required": true},
  "CLUSTER_NAME": {"type": "string", "description": "HA cluster name", "required": false, "default": "nac-cluster"},
  "PRIMARY_NAC_IP": {"type": "ip", "description": "Primary NAC server IP", "required": false},
  "SECONDARY_NAC_IP": {"type": "ip", "description": "Secondary NAC server IP", "required": false},
  "VIRTUAL_NAC_IP": {"type": "ip", "description": "Virtual NAC IP", "required": false}
}'::jsonb,
'["Campus Deployment", "Enterprise Authentication", "Asset Tracking", "Compliance Management", "Guest Access"]'::jsonb,
'["802.1X-EAP-TLS", "802.1X-PEAP", "MAC Authentication Bypass", "Guest Portal", "Certificate-based"]'::jsonb,
'{"active_directory": true, "certificate_authority": true, "snmp_monitoring": true, "high_availability": true}'::jsonb,
'["Asset Tracking", "Device Profiling", "Compliance Checking", "Dynamic VLAN Assignment", "Guest Network Isolation"]'::jsonb,
'["Phased Deployment", "Comprehensive Testing", "Asset Discovery", "Policy Validation", "User Training"]'::jsonb,
'["Device Discovery Issues", "AD Integration Problems", "Certificate Deployment", "Policy Conflicts", "Performance Monitoring"]'::jsonb,
'["Verify AD connectivity", "Test device profiling", "Validate VLAN assignments", "Check compliance policies", "Monitor system performance"]'::jsonb,
'["extreme", "nac", "802.1x", "asset-tracking", "compliance", "campus"]'::jsonb,
'very_high', true, true, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add SAAS/On-Prem application support for ZTNA
INSERT INTO vendor_library (vendor_name, category, portnox_integration_level, supported_protocols, deployment_scenarios, configuration_complexity, documentation_quality, support_rating, market_presence, typical_use_cases, integration_notes, model_series, firmware_versions, key_features, created_by) VALUES

('Microsoft 365', 'saas_app', 'native', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "WS-Federation"]', '["Cloud", "Hybrid", "Enterprise", "Remote Work"]', 'medium', 'excellent', 4.9, 'enterprise_leader', '["Office Productivity", "Email", "Collaboration", "File Sharing", "Teams"]', 'Native Azure AD integration with conditional access and Zero Trust', '["Office 365", "Microsoft 365", "Enterprise Mobility + Security"]', '["Current Channel", "Monthly Channel", "Semi-Annual Channel"]', '["Conditional Access", "Azure AD SSO", "MFA Integration", "App Protection Policies", "Compliance Center"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Salesforce', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect"]', '["Cloud CRM", "Sales Automation", "Customer Service", "Marketing"]', 'medium', 'excellent', 4.8, 'crm_leader', '["CRM", "Sales Automation", "Customer Service", "Marketing Automation", "Analytics"]', 'Comprehensive SAML SSO with custom attributes and JIT provisioning', '["Sales Cloud", "Service Cloud", "Marketing Cloud", "Commerce Cloud", "Platform"]', '["Spring Release", "Summer Release", "Winter Release"]', '["SAML SSO", "Just-in-Time Provisioning", "Custom Attributes", "Lightning Platform", "Salesforce Identity"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Google Workspace', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect"]', '["Cloud Productivity", "Email", "Collaboration", "Education"]', 'medium', 'excellent', 4.7, 'productivity_leader', '["Email", "Document Collaboration", "Video Conferencing", "Cloud Storage", "Education"]', 'Google Cloud Identity integration with advanced security features', '["Business Starter", "Business Standard", "Business Plus", "Enterprise"]', '["Rapid Release", "Scheduled Release"]', '["Google Cloud Identity", "2-Step Verification", "Security Center", "Admin Console", "Endpoint Management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('ServiceNow', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "LDAP"]', '["ITSM", "Enterprise Service Management", "Workflow Automation"]', 'high', 'excellent', 4.6, 'itsm_leader', '["IT Service Management", "HR Service Delivery", "Security Operations", "Governance Risk Compliance"]', 'Enterprise ITSM platform with extensive SSO and identity integration', '["Now Platform", "IT Workflows", "Employee Workflows", "Customer Workflows"]', '["San Diego", "Tokyo", "Utah", "Vancouver"]', '["Single Sign-On", "Multi-Provider SSO", "OAuth 2.0", "LDAP Integration", "Identity Governance"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Slack', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect"]', '["Team Collaboration", "Remote Work", "Enterprise Communication"]', 'low', 'good', 4.5, 'collaboration_leader', '["Team Messaging", "File Sharing", "Workflow Automation", "App Integration", "Video Calls"]', 'Popular team collaboration platform with enterprise SSO features', '["Slack Pro", "Slack Business+", "Slack Enterprise Grid"]', '["Current Release"]', '["SAML SSO", "Enterprise Key Management", "Data Loss Prevention", "Compliance Exports", "Enterprise Mobile Management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Zoom', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect"]', '["Video Conferencing", "Remote Work", "Webinars", "Education"]', 'low', 'good', 4.4, 'video_leader', '["Video Meetings", "Webinars", "Phone System", "Rooms", "Events"]', 'Leading video conferencing platform with enterprise security features', '["Basic", "Pro", "Business", "Enterprise", "Enterprise Plus"]', '["Current Version"]', '["SAML SSO", "Advanced Chat Encryption", "Cloud Recording", "Waiting Room", "Meeting Lock"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Atlassian Cloud', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0", "OpenID Connect"]', '["Software Development", "Project Management", "Team Collaboration"]', 'medium', 'excellent', 4.5, 'dev_tools_leader', '["Project Tracking", "Code Repository", "Team Collaboration", "Knowledge Management", "DevOps"]', 'Comprehensive developer and project management tools with enterprise SSO', '["Jira", "Confluence", "Bitbucket", "Trello", "Jira Service Management"]', '["Cloud Version"]', '["Atlassian Access", "SAML SSO", "SCIM Provisioning", "IP Allowlisting", "Mobile Device Management"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Adobe Creative Cloud', 'saas_app', 'certified', '["SAML 2.0", "OAuth 2.0"]', '["Creative Work", "Design", "Marketing", "Publishing"]', 'medium', 'good', 4.3, 'creative_leader', '["Graphic Design", "Video Editing", "Web Design", "Photography", "Marketing"]', 'Creative suite with enterprise identity management and licensing', '["Individual", "Business", "Enterprise", "Teams"]', '["Current Release", "Previous Version"]', '["Admin Console", "SAML SSO", "Storage Management", "License Management", "Analytics"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

-- On-Premises Applications
('SharePoint On-Premises', 'onprem_app', 'certified', '["SAML 2.0", "NTLM", "Kerberos", "Claims-based Authentication"]', '["Document Management", "Collaboration", "Intranet", "Workflow"]', 'high', 'good', 4.2, 'enterprise_standard', '["Document Management", "Team Sites", "Business Intelligence", "Search", "Workflow"]', 'On-premises collaboration platform with flexible authentication options', '["SharePoint 2016", "SharePoint 2019", "SharePoint Server"]', '["SharePoint 2016", "SharePoint 2019", "Subscription Edition"]', '["Claims Authentication", "SAML Token", "Forms Authentication", "Windows Authentication", "Multi-Authentication"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Jenkins', 'onprem_app', 'partner', '["SAML 2.0", "LDAP", "Active Directory", "OAuth 2.0"]', '["CI/CD", "DevOps", "Automation", "Software Development"]', 'medium', 'community', 4.4, 'devops_standard', '["Continuous Integration", "Build Automation", "Deployment Pipeline", "Test Automation"]', 'Open source automation server with extensive plugin ecosystem', '["LTS Release", "Weekly Release"]', '["2.401.x LTS", "2.420.x Weekly"]', '["SAML Plugin", "LDAP Plugin", "Active Directory Plugin", "Role-based Authorization", "Pipeline as Code"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('GitLab Self-Managed', 'onprem_app', 'partner', '["SAML 2.0", "OAuth 2.0", "OpenID Connect", "LDAP"]', '["Source Control", "CI/CD", "DevSecOps", "Project Management"]', 'medium', 'excellent', 4.6, 'devops_leader', '["Git Repository", "CI/CD Pipelines", "Issue Tracking", "Security Scanning", "Container Registry"]', 'Complete DevOps platform with comprehensive authentication options', '["Community Edition", "Enterprise Edition"]', '["15.x", "16.x"]', '["SAML SSO", "Group SAML", "SCIM Provisioning", "LDAP Sync", "2FA Enforcement"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Tableau Server', 'onprem_app', 'certified', '["SAML 2.0", "Active Directory", "LDAP", "Kerberos"]', '["Business Intelligence", "Data Visualization", "Analytics", "Reporting"]', 'high', 'excellent', 4.5, 'bi_leader', '["Data Visualization", "Business Intelligence", "Self-Service Analytics", "Embedded Analytics"]', 'Enterprise BI platform with robust authentication and authorization', '["Tableau Server", "Tableau Online"]', '["2022.4", "2023.1", "2023.2", "2023.3"]', '["SAML SSO", "Active Directory Integration", "Row-Level Security", "Embedded Credentials", "Extract Encryption"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),

('Splunk Enterprise', 'onprem_app', 'certified', '["SAML 2.0", "LDAP", "Active Directory", "Multifactor Authentication"]', '["Security Operations", "IT Operations", "Compliance", "Business Analytics"]', 'high', 'excellent', 4.7, 'siem_leader', '["Log Analysis", "Security Monitoring", "IT Operations", "Business Intelligence", "Compliance Reporting"]', 'Leading SIEM platform with comprehensive authentication and RBAC', '["Splunk Enterprise", "Splunk Cloud"]', '["9.0.x", "9.1.x"]', '["SAML SSO", "LDAP Authentication", "Multi-factor Authentication", "Role-based Access Control", "Audit Logging"]', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Update configuration template categories
INSERT INTO config_template_categories (name, description, category_type, icon_name, color_scheme, display_order, ai_priority_weight, created_by) VALUES
('ZTNA Applications', 'Zero Trust Network Access application configurations for SaaS and on-premises applications', 'application', 'Shield', 'blue', 10, 2.0, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('SaaS Integration', 'Software as a Service application integration templates', 'application', 'Cloud', 'green', 11, 1.8, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('On-Premises Apps', 'On-premises application integration and authentication templates', 'application', 'Server', 'orange', 12, 1.7, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Healthcare Specific', 'Healthcare industry specific configurations and compliance templates', 'industry', 'Heart', 'red', 13, 2.2, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Financial Services', 'Financial services industry configurations and compliance templates', 'industry', 'DollarSign', 'yellow', 14, 2.1, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Manufacturing', 'Manufacturing and industrial network configurations', 'industry', 'Factory', 'purple', 15, 2.0, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Education', 'Educational institution network and application configurations', 'industry', 'GraduationCap', 'indigo', 16, 1.9, (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add resource tags for enhanced categorization
INSERT INTO resource_tags (name, color_code, description, created_by) VALUES
('High-Security', '#dc2626', 'Resources requiring enhanced security measures', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Cloud-Native', '#2563eb', 'Cloud-first solutions and integrations', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Legacy-Support', '#f59e0b', 'Solutions supporting legacy systems and protocols', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Zero-Trust', '#10b981', 'Zero Trust architecture components', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Compliance', '#8b5cf6', 'Compliance and regulatory requirement solutions', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('IoT-Ready', '#06b6d4', 'IoT and OT device management capabilities', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Enterprise-Scale', '#ef4444', 'Enterprise-scale and high-availability solutions', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Cost-Effective', '#22c55e', 'Budget-friendly solutions for SMB', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('AI-Enhanced', '#a855f7', 'AI and machine learning enhanced capabilities', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Real-Time', '#f97316', 'Real-time processing and monitoring capabilities', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));

-- Add comprehensive resource categories
INSERT INTO resource_categories (name, resource_type, description, color_code, created_by) VALUES
('Enterprise Networking', 'vendor', 'Enterprise-grade networking equipment and solutions', '#1f2937', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Cloud Security', 'vendor', 'Cloud-based security and identity solutions', '#3b82f6', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Identity Management', 'vendor', 'Identity and access management platforms', '#8b5cf6', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Mobile Security', 'vendor', 'Mobile device management and security solutions', '#06b6d4', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('SaaS Applications', 'vendor', 'Software as a Service applications and platforms', '#10b981', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('On-Premises Software', 'vendor', 'On-premises software and applications', '#f59e0b', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Productivity Tools', 'application', 'Business productivity and collaboration tools', '#22c55e', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Developer Tools', 'application', 'Software development and DevOps tools', '#ef4444', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Security Operations', 'application', 'Security monitoring and operations applications', '#dc2626', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1)),
('Business Intelligence', 'application', 'Analytics and business intelligence platforms', '#7c3aed', (SELECT id FROM profiles WHERE email = 'system@portnox.com' LIMIT 1));