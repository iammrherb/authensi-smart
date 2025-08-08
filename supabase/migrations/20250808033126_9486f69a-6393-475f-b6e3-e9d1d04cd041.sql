-- Populate catalog_items with vendor data from major categories
INSERT INTO catalog_items (category_key, name, vendor, model, firmware_version, labels, tags, metadata, is_active) VALUES
-- Network (Wired/Wireless)
('wired_wireless', 'Cisco Catalyst 9300-48P', 'Cisco', '9300-48P', '17.15.01', '{"switch","poe","802.1x"}', '{"enterprise","access","managed"}', '{"ports": "48x GbE + 4x SFP+", "poe": true, "stackable": true}', true),
('wired_wireless', 'Aruba CX 6300M-48G-PoE4+', 'Aruba', 'CX 6300M-48G-PoE4+', '10.13.1020', '{"switch","poe","clearpass"}', '{"enterprise","access","wireless-first"}', '{"ports": "48x GbE + 4x SFP+", "poe": true, "vsx": true}', true),
('wired_wireless', 'FortiSwitch 248D-FPOE', 'Fortinet', '248D-FPOE', '7.4.5', '{"switch","poe","security-fabric"}', '{"security","access","integrated"}', '{"ports": "48x GbE + 4x SFP+", "poe": true, "stacking": true}', true),
('wired_wireless', 'Juniper EX2300-48P', 'Juniper', 'EX2300-48P', '22.4R3', '{"switch","poe","virtual-chassis"}', '{"performance","access","carrier-grade"}', '{"ports": "48x GbE + 4x SFP+", "poe": true, "vc": true}', true),
('wired_wireless', 'Meraki MS225-48LP', 'Cisco Meraki', 'MS225-48LP', 'Cloud Latest', '{"switch","poe","cloud-managed"}', '{"cloud","simple","branch"}', '{"ports": "48x GbE + 4x SFP+", "poe": true, "cloud": true}', true),

-- Firewalls
('firewall', 'FortiGate 60F', 'Fortinet', '60F', '7.4.5', '{"ngfw","utm","ips"}', '{"small-office","branch","integrated"}', '{"throughput": "10 Gbps", "concurrent_sessions": "150000", "ips": true}', true),
('firewall', 'Palo Alto PA-220', 'Palo Alto', 'PA-220', '11.1.2', '{"ngfw","app-id","threat-prevention"}', '{"small-office","branch","security-first"}', '{"throughput": "940 Mbps", "app_id": true, "wildfire": true}', true),
('firewall', 'Cisco ASA 5516-X', 'Cisco', 'ASA 5516-X', '9.19.1', '{"firewall","vpn","ips"}', '{"enterprise","datacenter","legacy"}', '{"throughput": "1.2 Gbps", "vpn_sessions": "750", "ips": true}', true),
('firewall', 'SonicWall TZ570', 'SonicWall', 'TZ570', '7.0.1', '{"ngfw","anti-malware","content-filtering"}', '{"small-business","branch","cost-effective"}', '{"throughput": "1.5 Gbps", "deep_packet_inspection": true}', true),
('firewall', 'Checkpoint 1570', 'Check Point', '1570', 'R81.20', '{"ngfw","threat-prevention","sandblast"}', '{"enterprise","advanced-threats","zero-day"}', '{"throughput": "1.5 Gbps", "sandblast": true, "threat_extraction": true}', true),

-- VPN/Zero Trust
('vpn', 'Fortinet FortiClient EMS', 'Fortinet', 'FortiClient EMS', '7.2.4', '{"endpoint-vpn","ztna","fabric-agent"}', '{"zero-trust","endpoint","fabric"}', '{"ssl_vpn": true, "ztna": true, "fabric_integration": true}', true),
('vpn', 'Palo Alto Prisma Access', 'Palo Alto', 'Prisma Access', 'Cloud Latest', '{"sase","ztna","cloud-vpn"}', '{"cloud","zero-trust","global"}', '{"sase": true, "global_backbone": true, "ztna": true}', true),
('vpn', 'Cisco AnyConnect', 'Cisco', 'AnyConnect', '4.10.8', '{"ssl-vpn","endpoint","posture"}', '{"remote-access","endpoint","enterprise"}', '{"ssl_vpn": true, "posture_assessment": true, "per_app_vpn": true}', true),
('vpn', 'Zscaler ZPA', 'Zscaler', 'ZPA', 'Cloud Latest', '{"ztna","cloud-security","micro-tunnels"}', '{"zero-trust","cloud","application-access"}', '{"ztna": true, "micro_tunnels": true, "least_privilege": true}', true),
('vpn', 'Pulse Secure Connect', 'Pulse Secure', 'Connect Secure', '9.1R18', '{"ssl-vpn","uac","endpoint-compliance"}', '{"remote-access","compliance","granular-access"}', '{"ssl_vpn": true, "uac": true, "endpoint_compliance": true}', true),

-- SIEM
('siem', 'Splunk Enterprise Security', 'Splunk', 'Enterprise Security', '8.0.2402', '{"siem","analytics","correlation"}', '{"enterprise","analytics","machine-learning"}', '{"correlation": true, "ml": true, "threat_intelligence": true}', true),
('siem', 'IBM QRadar', 'IBM', 'QRadar SIEM', '7.5.0', '{"siem","compliance","threat-hunting"}', '{"enterprise","compliance","correlation"}', '{"correlation": true, "compliance_reporting": true, "threat_hunting": true}', true),
('siem', 'Microsoft Sentinel', 'Microsoft', 'Sentinel', 'Cloud Latest', '{"cloud-siem","soar","azure-native"}', '{"cloud","microsoft","soar"}', '{"cloud_native": true, "soar": true, "azure_integration": true}', true),
('siem', 'LogRhythm SIEM', 'LogRhythm', 'NextGen SIEM', '7.15.0', '{"siem","soar","threat-lifecycle"}', '{"mid-market","integrated","user-behavior"}', '{"soar": true, "user_behavior": true, "threat_lifecycle": true}', true),
('siem', 'AlienVault OSSIM', 'AT&T Cybersecurity', 'USM Anywhere', '5.8.3', '{"unified-security","siem","vulnerability"}', '{"unified","vulnerability","compliance"}', '{"vulnerability_management": true, "asset_discovery": true, "compliance": true}', true),

-- MDM/UEM
('mdm', 'Microsoft Intune', 'Microsoft', 'Intune', 'Cloud Latest', '{"mdm","mam","conditional-access"}', '{"cloud","microsoft","endpoint"}', '{"mdm": true, "mam": true, "conditional_access": true}', true),
('mdm', 'VMware Workspace ONE', 'VMware', 'Workspace ONE UEM', '23.09', '{"uem","digital-workspace","app-management"}', '{"enterprise","digital-workspace","multi-platform"}', '{"uem": true, "digital_workspace": true, "zero_trust": true}', true),
('mdm', 'Jamf Pro', 'Jamf', 'Jamf Pro', '11.7.1', '{"apple-mdm","mac-management","compliance"}', '{"apple","education","enterprise"}', '{"apple_native": true, "zero_touch": true, "compliance": true}', true),
('mdm', 'MobileIron Core', 'Ivanti', 'MobileIron Core', '11.2.0', '{"mdm","mam","zero-sign-on"}', '{"enterprise","security","zero-trust"}', '{"mdm": true, "zero_sign_on": true, "threat_defense": true}', true),
('mdm', 'Citrix Endpoint Management', 'Citrix', 'Endpoint Management', '10.15.0', '{"mdm","mam","secure-apps"}', '{"enterprise","secure-apps","workspace"}', '{"mdm": true, "secure_apps": true, "workspace_integration": true}', true),

-- EDR/XDR
('edr', 'CrowdStrike Falcon', 'CrowdStrike', 'Falcon', 'Cloud Latest', '{"edr","xdr","threat-hunting"}', '{"cloud","ai","threat-hunting"}', '{"edr": true, "xdr": true, "threat_hunting": true, "ai_powered": true}', true),
('edr', 'Microsoft Defender for Endpoint', 'Microsoft', 'Defender for Endpoint', 'Cloud Latest', '{"edr","xdr","behavioral-analysis"}', '{"cloud","microsoft","integrated"}', '{"edr": true, "xdr": true, "behavioral_analysis": true}', true),
('edr', 'SentinelOne Singularity', 'SentinelOne', 'Singularity', 'Cloud Latest', '{"edr","xdr","autonomous-response"}', '{"ai","autonomous","rollback"}', '{"edr": true, "autonomous_response": true, "rollback": true}', true),
('edr', 'Carbon Black Cloud', 'VMware', 'Carbon Black Cloud', 'Cloud Latest', '{"edr","behavioral-analysis","threat-hunting"}', '{"behavioral","enterprise","threat-hunting"}', '{"behavioral_analysis": true, "threat_hunting": true, "attack_visualization": true}', true),
('edr', 'Cortex XDR', 'Palo Alto', 'Cortex XDR', 'Cloud Latest', '{"xdr","ai-analytics","incident-response"}', '{"ai","xdr","incident-response"}', '{"xdr": true, "ai_analytics": true, "incident_response": true}', true),

-- Identity Providers
('idp', 'Microsoft Azure AD', 'Microsoft', 'Azure Active Directory', 'Cloud Latest', '{"identity","conditional-access","mfa"}', '{"cloud","microsoft","enterprise"}', '{"conditional_access": true, "mfa": true, "hybrid_identity": true}', true),
('idp', 'Okta Identity Cloud', 'Okta', 'Identity Cloud', 'Cloud Latest', '{"identity","adaptive-mfa","lifecycle"}', '{"cloud","adaptive","lifecycle"}', '{"adaptive_mfa": true, "lifecycle_management": true, "api_access": true}', true),
('idp', 'Ping Identity', 'Ping Identity', 'PingOne', 'Cloud Latest', '{"identity","federation","api-security"}', '{"enterprise","federation","api"}', '{"federation": true, "api_security": true, "risk_intelligence": true}', true),
('idp', 'CyberArk Identity', 'CyberArk', 'Identity', 'Cloud Latest', '{"identity","privileged-access","risk-analytics"}', '{"privileged","risk","analytics"}', '{"privileged_access": true, "risk_analytics": true, "adaptive_mfa": true}', true),

-- Security (General)
('security', 'Rapid7 InsightIDR', 'Rapid7', 'InsightIDR', 'Cloud Latest', '{"siem","ueba","incident-response"}', '{"cloud","detection","response"}', '{"ueba": true, "incident_response": true, "threat_intelligence": true}', true),
('security', 'Darktrace Antigena', 'Darktrace', 'Antigena', '6.2.8', '{"ai-security","autonomous-response","network-detection"}', '{"ai","autonomous","network"}', '{"ai_security": true, "autonomous_response": true, "network_visibility": true}', true),
('security', 'Vectra Cognito', 'Vectra', 'Cognito', '8.0', '{"ai-ndr","threat-hunting","attack-progression"}', '{"ai","ndr","threat-hunting"}', '{"ai_ndr": true, "attack_progression": true, "threat_hunting": true}', true),

-- SSO
('sso', 'Okta SSO', 'Okta', 'Single Sign-On', 'Cloud Latest', '{"sso","saml","oidc"}', '{"cloud","standards-based","user-experience"}', '{"saml": true, "oidc": true, "adaptive_authentication": true}', true),
('sso', 'Azure AD SSO', 'Microsoft', 'Azure AD SSO', 'Cloud Latest', '{"sso","seamless","conditional-access"}', '{"cloud","microsoft","seamless"}', '{"seamless_sso": true, "conditional_access": true, "office365": true}', true),
('sso', 'Ping SSO', 'Ping Identity', 'PingFederate', '11.3.3', '{"sso","federation","standards"}', '{"enterprise","federation","standards"}', '{"federation": true, "standards_compliant": true, "api_security": true}', true);