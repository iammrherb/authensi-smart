-- =========================================
-- ENHANCED COMPLIANCE & VENDOR SYSTEM
-- Working with existing table structures
-- =========================================

-- Add comprehensive compliance pain points
INSERT INTO pain_points_library (title, description, category, severity, recommended_solutions, industry_specific) VALUES
-- Financial Services Compliance
('PCI-DSS Payment Card Data Protection', 'Requirements for protecting cardholder data and maintaining secure networks', 'compliance', 'critical', 
 '["Multi-factor authentication", "Network segmentation", "Encryption at rest and in transit", "Regular vulnerability scanning", "Access logging and monitoring"]',
 '["financial", "retail", "hospitality", "healthcare"]'),

('SOX Financial Reporting Controls', 'Sarbanes-Oxley Act requirements for financial reporting accuracy and internal controls', 'compliance', 'critical',
 '["Role-based access controls", "Audit trails", "Change management", "Segregation of duties", "Regular access reviews"]',
 '["financial", "banking", "insurance", "public_companies"]'),

('GDPR Data Protection Regulation', 'General Data Protection Regulation requirements for EU data protection', 'compliance', 'critical',
 '["Data minimization", "Consent management", "Right to erasure", "Data portability", "Privacy by design"]',
 '["global", "technology", "retail", "healthcare", "financial"]'),

('HIPAA Patient Data Protection', 'Health Insurance Portability and Accountability Act requirements for PHI protection', 'compliance', 'critical',
 '["Access controls", "Audit logs", "Encryption", "Minimum necessary access", "Business associate agreements"]',
 '["healthcare", "medical", "pharmaceutical", "health_insurance"]'),

('FISMA Federal Information Security', 'Federal Information Security Management Act requirements for government systems', 'compliance', 'critical',
 '["NIST framework implementation", "Continuous monitoring", "Risk assessment", "Security controls", "Incident response"]',
 '["government", "federal", "defense", "contractors"]'),

('SOC 2 Service Organization Controls', 'Service Organization Control 2 requirements for service providers', 'compliance', 'high',
 '["Security controls", "Availability controls", "Processing integrity", "Confidentiality", "Privacy controls"]',
 '["technology", "cloud_providers", "saas", "financial_services"]'),

('ISO 27001 Information Security', 'International standard for information security management systems', 'compliance', 'high',
 '["ISMS implementation", "Risk assessment", "Security controls", "Continuous improvement", "Management review"]',
 '["global", "technology", "financial", "healthcare", "manufacturing"]'),

('NIST Cybersecurity Framework', 'National Institute of Standards and Technology cybersecurity framework', 'compliance', 'high',
 '["Identify", "Protect", "Detect", "Respond", "Recover functions", "Risk management", "Continuous improvement"]',
 '["government", "critical_infrastructure", "healthcare", "financial"]'),

('CMMC Cybersecurity Maturity Model', 'Cybersecurity Maturity Model Certification for defense contractors', 'compliance', 'critical',
 '["Access controls", "System hardening", "Incident response", "Risk management", "Situational awareness"]',
 '["defense", "contractors", "manufacturing", "aerospace"]'),

('NERC CIP Critical Infrastructure Protection', 'North American Electric Reliability Corporation Critical Infrastructure Protection standards', 'compliance', 'critical',
 '["Asset identification", "Security management controls", "Personnel training", "Electronic security perimeters", "Physical security"]',
 '["energy", "utilities", "power_generation", "transmission"]');

-- Add AI-powered recommendations
INSERT INTO recommendations_library (title, description, category, priority, implementation_effort, expected_outcome, related_pain_points, prerequisites, industry_specific, portnox_features) VALUES
('Implement Zero Trust Network Architecture', 'Deploy comprehensive zero trust security model with identity-centric access controls', 'security', 'high', 'high',
 'Reduced breach impact, improved security posture, enhanced compliance, better visibility',
 '["Network segmentation challenges", "Identity management complexity", "Legacy system integration"]',
 '["Identity provider integration", "Network inventory", "Policy definition", "Phased rollout plan"]',
 '["financial", "healthcare", "government", "technology"]',
 '["Dynamic VLAN assignment", "Device profiling", "Behavioral analytics", "Policy enforcement"]'),

('AI-Powered Threat Detection', 'Deploy machine learning algorithms for behavioral anomaly detection and threat identification', 'security', 'high', 'high',
 'Faster threat detection, reduced false positives, proactive security, automated response',
 '["Manual monitoring limitations", "Alert fatigue", "Skill shortages", "Response time delays"]',
 '["Baseline behavior establishment", "ML model training", "Integration planning", "Staff training"]',
 '["technology", "financial", "healthcare", "government"]',
 '["Behavioral analytics", "Machine learning", "Automated response", "Threat intelligence"]'),

('Micro-Segmentation Strategy', 'Implement granular network segmentation based on user, device, and application context', 'security', 'high', 'medium',
 'Reduced lateral movement, improved containment, enhanced monitoring, better compliance',
 '["Network complexity", "Performance concerns", "Management overhead"]',
 '["Network topology understanding", "Application dependencies", "Security policies", "Monitoring tools"]',
 '["financial", "healthcare", "manufacturing", "retail"]',
 '["Dynamic policy enforcement", "Real-time monitoring", "Automated response", "Context-aware controls"]'),

('Automated Compliance Reporting', 'Implement automated compliance monitoring and reporting for regulatory frameworks', 'compliance', 'high', 'medium',
 'Reduced manual effort, improved accuracy, faster reporting, enhanced audit readiness',
 '["Manual compliance processes", "Human error", "Time-consuming audits", "Reporting delays"]',
 '["Compliance framework mapping", "Data collection automation", "Reporting templates", "Audit trails"]',
 '["financial", "healthcare", "government", "manufacturing"]',
 '["Automated policy enforcement", "Real-time monitoring", "Compliance dashboards", "Audit reporting"]'),

('Continuous Compliance Monitoring', 'Deploy real-time compliance monitoring with automated remediation capabilities', 'compliance', 'high', 'high',
 'Continuous compliance assurance, reduced violations, automated remediation, improved audit outcomes',
 '["Point-in-time assessments", "Compliance drift", "Manual remediation", "Audit preparation"]',
 '["Compliance framework implementation", "Monitoring tools", "Remediation procedures", "Staff training"]',
 '["healthcare", "financial", "government", "energy"]',
 '["Real-time monitoring", "Automated remediation", "Policy enforcement", "Compliance reporting"]');

-- Add comprehensive project templates
INSERT INTO project_templates (name, description, industry, deployment_type, security_level, compliance_frameworks, use_cases, requirements, test_cases, authentication_workflows, vendor_configurations, network_requirements, timeline_template) VALUES
('HIPAA-Compliant Healthcare Network', 'Comprehensive healthcare network with HIPAA compliance and patient data protection', 'healthcare', 'enterprise', 'high',
 ARRAY['HIPAA', 'HITECH', 'FDA_21_CFR_Part_11', 'SOC2'],
 '[
   {"id": "patient_data_access", "name": "Patient Data Access Control", "priority": "critical"},
   {"id": "ehr_integration", "name": "Electronic Health Records Integration", "priority": "high"},
   {"id": "medical_device_security", "name": "Medical Device Network Security", "priority": "high"},
   {"id": "guest_patient_wifi", "name": "Guest Patient WiFi Access", "priority": "medium"},
   {"id": "telemedicine_support", "name": "Telemedicine Platform Support", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "phi_encryption", "name": "PHI Data Encryption", "category": "security", "priority": "critical"},
   {"id": "audit_logging", "name": "Comprehensive Audit Logging", "category": "compliance", "priority": "critical"},
   {"id": "access_controls", "name": "Role-Based Access Controls", "category": "security", "priority": "critical"},
   {"id": "device_authentication", "name": "Medical Device Authentication", "category": "security", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "phi_access_test", "name": "PHI Access Authorization Test", "priority": "critical"},
   {"id": "encryption_validation", "name": "Data Encryption Validation", "priority": "critical"},
   {"id": "audit_trail_test", "name": "Audit Trail Completeness Test", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "eap_tls_healthcare", "name": "EAP-TLS for Healthcare Staff", "method": "certificate"},
   {"id": "device_certificates", "name": "Medical Device Certificates", "method": "certificate"},
   {"id": "guest_portal", "name": "Patient Guest Portal", "method": "portal"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "primary", "models": ["catalyst_9000", "ise"], "features": ["trustsec", "sxp"]},
   {"vendor": "aruba", "role": "wireless", "models": ["cx_6000", "clearpass"], "features": ["tunneled_node", "cppm"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Medical_Staff", "subnet": "10.10.10.0/24"},
     {"id": 20, "name": "Medical_Devices", "subnet": "10.10.20.0/24"},
     {"id": 30, "name": "Patient_Data", "subnet": "10.10.30.0/24"},
     {"id": 40, "name": "Guest_Patients", "subnet": "10.10.40.0/24"}
   ],
   "security_zones": ["clinical", "administrative", "research", "guest"],
   "bandwidth_requirements": {"clinical": "1Gbps", "devices": "100Mbps", "guest": "50Mbps"}
 }'::jsonb,
 '{
   "phases": [
     {"name": "Planning", "duration_weeks": 4, "deliverables": ["Network design", "Compliance mapping", "Risk assessment"]},
     {"name": "Infrastructure", "duration_weeks": 6, "deliverables": ["Hardware deployment", "Network configuration", "Security implementation"]},
     {"name": "Integration", "duration_weeks": 4, "deliverables": ["EHR integration", "Device onboarding", "Testing"]},
     {"name": "Compliance", "duration_weeks": 3, "deliverables": ["HIPAA validation", "Audit preparation", "Documentation"]},
     {"name": "Go-Live", "duration_weeks": 2, "deliverables": ["Production deployment", "Staff training", "Support transition"]}
   ]
 }'::jsonb),

('PCI-DSS Financial Institution Network', 'Secure financial network with PCI-DSS compliance and fraud prevention', 'financial', 'enterprise', 'critical',
 ARRAY['PCI_DSS', 'SOX', 'GLBA', 'SOC2', 'FFIEC'],
 '[
   {"id": "card_processing_security", "name": "Card Processing Security", "priority": "critical"},
   {"id": "fraud_detection", "name": "Real-time Fraud Detection", "priority": "critical"},
   {"id": "customer_data_protection", "name": "Customer Data Protection", "priority": "critical"},
   {"id": "trading_floor_isolation", "name": "Trading Floor Network Isolation", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "cardholder_data_encryption", "name": "Cardholder Data Encryption", "category": "security", "priority": "critical"},
   {"id": "network_segmentation", "name": "PCI Network Segmentation", "category": "compliance", "priority": "critical"},
   {"id": "access_monitoring", "name": "Privileged Access Monitoring", "category": "security", "priority": "critical"}
 ]'::jsonb,
 '[
   {"id": "pci_penetration_test", "name": "PCI Penetration Testing", "priority": "critical"},
   {"id": "cardholder_data_flow_test", "name": "Cardholder Data Flow Test", "priority": "critical"}
 ]'::jsonb,
 '[
   {"id": "smart_card_auth", "name": "Smart Card Authentication", "method": "certificate"},
   {"id": "biometric_auth", "name": "Biometric Authentication", "method": "multi_factor"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "core", "models": ["nexus_9000", "ise"], "features": ["macsec", "trustsec"]},
   {"vendor": "juniper", "role": "edge", "models": ["ex_4000", "srx_series"], "features": ["junos_space", "sky_atp"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Trading_Floor", "subnet": "172.16.10.0/24"},
     {"id": 20, "name": "Card_Processing", "subnet": "172.16.20.0/24"},
     {"id": 30, "name": "Customer_Services", "subnet": "172.16.30.0/24"}
   ],
   "security_zones": ["cardholder_data", "trusted", "untrusted", "dmz"],
   "compliance_requirements": ["PCI_DSS_Level_1", "Annual_penetration_testing", "Quarterly_vulnerability_scanning"]
 }'::jsonb,
 '{
   "phases": [
     {"name": "Compliance_Assessment", "duration_weeks": 3, "deliverables": ["PCI gap analysis", "Risk assessment", "Remediation plan"]},
     {"name": "Network_Design", "duration_weeks": 4, "deliverables": ["Segmentation design", "Security architecture", "Compliance mapping"]},
     {"name": "Implementation", "duration_weeks": 8, "deliverables": ["Infrastructure deployment", "Security controls", "Testing"]},
     {"name": "PCI_Validation", "duration_weeks": 4, "deliverables": ["QSA assessment", "Penetration testing", "Documentation"]},
     {"name": "Production", "duration_weeks": 2, "deliverables": ["Go-live", "Monitoring", "Ongoing compliance"]}
   ]
 }'::jsonb),

('FISMA Federal Government Network', 'Federal government network with FISMA compliance and security controls', 'government', 'enterprise', 'critical',
 ARRAY['FISMA', 'FedRAMP', 'NIST_CSF', 'CMMC'],
 '[
   {"id": "classified_data_protection", "name": "Classified Data Protection", "priority": "critical"},
   {"id": "continuous_monitoring", "name": "Continuous Security Monitoring", "priority": "critical"},
   {"id": "identity_management", "name": "Federal Identity Management", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "nist_controls", "name": "NIST 800-53 Security Controls", "category": "compliance", "priority": "critical"},
   {"id": "continuous_monitoring", "name": "Continuous Monitoring Program", "category": "security", "priority": "critical"}
 ]'::jsonb,
 '[
   {"id": "fisma_controls_test", "name": "FISMA Controls Testing", "priority": "critical"},
   {"id": "boundary_protection_test", "name": "Network Boundary Protection Test", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "piv_card_auth", "name": "PIV Card Authentication", "method": "certificate"},
   {"id": "cac_authentication", "name": "Common Access Card Authentication", "method": "certificate"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "primary", "models": ["catalyst_9000", "ise"], "features": ["fed_certified", "fips_140_2"]},
   {"vendor": "juniper", "role": "routing", "models": ["mx_series", "ex_series"], "features": ["junos_fips", "enhanced_services"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Classified", "subnet": "192.168.10.0/24", "classification": "secret"},
     {"id": 20, "name": "Sensitive", "subnet": "192.168.20.0/24", "classification": "sensitive"},
     {"id": 30, "name": "General", "subnet": "192.168.30.0/24", "classification": "unclassified"}
   ],
   "security_requirements": ["FIPS_140_2", "Common_Criteria", "NIAP_Certified"],
   "monitoring_requirements": ["EINSTEIN", "CDM", "CISA_compliance"]
 }'::jsonb,
 '{
   "phases": [
     {"name": "Authority_to_Operate", "duration_weeks": 6, "deliverables": ["System security plan", "Risk assessment", "Control implementation"]},
     {"name": "Implementation", "duration_weeks": 10, "deliverables": ["Infrastructure deployment", "Security controls", "Integration testing"]},
     {"name": "Assessment_Authorization", "duration_weeks": 8, "deliverables": ["Security assessment", "Plan of action", "ATO package"]}
   ]
 }'::jsonb);

-- Add more vendor entries using existing table structure
INSERT INTO vendor_library (vendor_name, category, status, description) VALUES
('Cisco Systems', 'network_infrastructure', 'active', 'Leading network infrastructure provider with comprehensive switching, routing, and wireless solutions including Catalyst 9000 Series, ISE, TrustSec, and DNA Center'),
('Aruba Networks (HPE)', 'network_infrastructure', 'active', 'Enterprise wireless and wired networking solutions with ClearPass Policy Manager, User-Based Tunneling, and AI-driven operations'),
('Juniper Networks', 'network_infrastructure', 'active', 'High-performance networking solutions for service providers and enterprises with Junos OS, SRX Series Security, and Mist AI'),
('Fortinet', 'security_infrastructure', 'active', 'Integrated cybersecurity platform with FortiGate NGFW, FortiSwitch, Security Fabric, and SD-WAN solutions'),
('Extreme Networks', 'network_infrastructure', 'active', 'Cloud-driven networking solutions with ExtremeOS, XIQ cloud management, and Fabric Connect technology'),
('Ruckus Networks (CommScope)', 'wireless_infrastructure', 'active', 'Enterprise Wi-Fi solutions with SmartZone Controllers, BeamFlex technology, and advanced RF optimization'),
('Palo Alto Networks', 'security_infrastructure', 'active', 'Next-generation firewall platform with WildFire threat intelligence, Panorama management, and Prisma cloud security'),
('Check Point Software', 'security_infrastructure', 'active', 'Comprehensive cybersecurity solutions with Quantum Security Gateways, SmartConsole management, and SandBlast threat prevention'),
('VMware', 'virtualization', 'active', 'Virtualization and cloud infrastructure with NSX micro-segmentation, vSphere platform, and Workspace ONE endpoint management'),
('Ubiquiti Networks', 'wireless_infrastructure', 'active', 'Cost-effective networking solutions with UniFi Controller, EdgeOS, and Dream Machine for SMB environments'),
('Mist Systems (Juniper)', 'ai_networking', 'active', 'AI-driven wireless and wired assurance with Marvis virtual assistant, location services, and machine learning analytics'),
('Meraki (Cisco)', 'cloud_managed', 'active', 'Cloud-managed networking with centralized dashboard, automatic updates, and simplified deployment for distributed organizations');

-- Add comprehensive configuration templates
INSERT INTO configuration_templates (name, description, category, configuration_type, complexity_level, template_content, template_variables, supported_scenarios, authentication_methods, required_features, security_features, best_practices, tags, is_public, is_validated) VALUES
('Cisco Advanced 802.1X with AI Analytics', 'Advanced Cisco 802.1X configuration with AI-powered analytics and automated response capabilities', 'authentication', '802.1x_advanced', 'high',
'! Advanced Cisco 802.1X Configuration with AI Analytics
! ========================================
! Global Configuration
! ========================================
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting update newinfo periodic 2880

! RADIUS Server Configuration
radius server PORTNOX-PRIMARY
 address ipv4 {{radius_primary_ip}} auth-port 1812 acct-port 1813
 key {{radius_shared_secret}}
 timeout 10
 retransmit 3
 deadtime 10

radius server PORTNOX-SECONDARY
 address ipv4 {{radius_secondary_ip}} auth-port 1812 acct-port 1813
 key {{radius_shared_secret}}
 timeout 10
 retransmit 3
 deadtime 10

aaa group server radius PORTNOX-SERVERS
 server name PORTNOX-PRIMARY
 server name PORTNOX-SECONDARY
 load-balance method least-outstanding

! Device Tracking and AI Analytics
device-tracking policy PORTNOX-AI-TRACKING
 security-level glean
 device-role node
 tracking enable
 
ip device tracking probe delay 10
ip device tracking probe interval 30
device-sensor filter-list dhcp list DHCP-LIST
device-sensor filter-list lldp list LLDP-LIST
device-sensor accounting
device-sensor notify all-changes

! Pre-Authentication ACL with AI Recommendations
ip access-list extended PRE-AUTH-AI-ACL
 permit udp any any eq domain
 permit udp any any eq bootps
 permit udp any any eq bootpc
 permit tcp any host {{portnox_cloud_ip}} eq 443
 permit icmp any any
 deny ip any any log

! Interface Template with AI Features
interface range GigabitEthernet1/0/1-48
 description AI-Enhanced User Access Port
 switchport mode access
 switchport access vlan {{default_vlan_id}}
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication timer inactivity server
 authentication violation replace
 mab
 dot1x pae authenticator
 dot1x timeout quiet-period {{quiet_period}}
 dot1x timeout tx-period {{tx_period}}
 spanning-tree portfast
 spanning-tree bpduguard enable
 device-tracking attach-policy PORTNOX-AI-TRACKING
 ip access-group PRE-AUTH-AI-ACL in
 storm-control broadcast level 5.00
 storm-control action shutdown

! AI-Enhanced Logging
logging buffered 1000000
logging trap informational
service timestamps log datetime msec localtime show-timezone
archive
 log config
  logging enable
  notify syslog contenttype plaintext
  hidekeys',
jsonb_build_object(
  'radius_primary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Primary RADIUS server IP', 'required', true),
  'radius_secondary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Secondary RADIUS server IP', 'required', true),
  'radius_shared_secret', jsonb_build_object('type', 'password', 'description', 'RADIUS shared secret', 'required', true, 'min_length', 20),
  'portnox_cloud_ip', jsonb_build_object('type', 'ipv4', 'description', 'Portnox Cloud IP address', 'required', true),
  'default_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Default VLAN ID', 'default', 100),
  'quiet_period', jsonb_build_object('type', 'integer', 'description', 'Quiet period in seconds', 'default', 10),
  'tx_period', jsonb_build_object('type', 'integer', 'description', 'Transmit period in seconds', 'default', 10)
),
'["enterprise_deployment", "ai_powered", "compliance_focused", "high_security", "scalable_architecture"]',
'["802.1X", "MAB", "EAP-TLS", "PEAP", "EAP-TTLS"]',
'["dynamic_vlan_assignment", "radius_accounting", "coa_support", "ai_analytics", "behavioral_monitoring"]',
'["port_security", "dhcp_snooping", "arp_inspection", "storm_control", "bpdu_guard", "ai_threat_detection"]',
'["Use_strong_shared_secrets", "Configure_radius_timeouts", "Enable_accounting", "Monitor_ai_analytics", "Regular_certificate_updates"]',
'["802.1x", "cisco", "ai", "authentication", "enterprise", "security", "compliance"]',
true,
true),

('Aruba ClearPass Integration Template', 'Comprehensive Aruba configuration with ClearPass Policy Manager integration and user-based tunneling', 'authentication', '802.1x_clearpass', 'medium',
'! Advanced Aruba 802.1X with ClearPass Integration
! ========================================
! Global AAA Configuration
! ========================================
aaa authentication port-access eap-radius
aaa authentication port-access chap-radius
aaa authentication mac-based chap-radius

radius-server host {{clearpass_primary_ip}} key {{radius_shared_secret}}
radius-server host {{clearpass_secondary_ip}} key {{radius_shared_secret}}
radius-server timeout 10
radius-server retransmit 3
radius-server dead-time 10

! User Roles with AI Enhancement
user-role "authenticated"
  access-list session "authenticated-acl"
  bandwidth-limit downstream {{auth_bandwidth_down}}
  bandwidth-limit upstream {{auth_bandwidth_up}}

user-role "guest" 
  access-list session "guest-acl"
  bandwidth-limit downstream {{guest_bandwidth_down}}
  bandwidth-limit upstream {{guest_bandwidth_up}}

! Access Control Lists
access-list session "authenticated-acl"
  user any any any permit

access-list session "guest-acl"
  user any 10.0.0.0 255.0.0.0 deny
  user any 172.16.0.0 255.240.0.0 deny
  user any 192.168.0.0 255.255.0.0 deny
  user any any any permit

! Port-based Authentication with UBT
aaa port-access authenticator active
aaa port-access mac-based
aaa port-access mac-based addr-format multi-colon
tunneled-node-server {{clearpass_primary_ip}}

! Interface Configuration
interface 1-48
  aaa port-access authenticator
  aaa port-access authenticator tx-period {{tx_period}}
  aaa port-access authenticator quiet-period {{quiet_period}}
  aaa port-access mac-based
  spanning-tree admin-edge-port
  spanning-tree bpdu-protection',
jsonb_build_object(
  'clearpass_primary_ip', jsonb_build_object('type', 'ipv4', 'description', 'ClearPass Primary Server IP', 'required', true),
  'clearpass_secondary_ip', jsonb_build_object('type', 'ipv4', 'description', 'ClearPass Secondary Server IP', 'required', true),
  'radius_shared_secret', jsonb_build_object('type', 'password', 'description', 'RADIUS shared secret', 'required', true),
  'auth_bandwidth_down', jsonb_build_object('type', 'integer', 'description', 'Authenticated user downstream bandwidth (Kbps)', 'default', 100000),
  'auth_bandwidth_up', jsonb_build_object('type', 'integer', 'description', 'Authenticated user upstream bandwidth (Kbps)', 'default', 50000),
  'guest_bandwidth_down', jsonb_build_object('type', 'integer', 'description', 'Guest user downstream bandwidth (Kbps)', 'default', 10000),
  'guest_bandwidth_up', jsonb_build_object('type', 'integer', 'description', 'Guest user upstream bandwidth (Kbps)', 'default', 5000),
  'tx_period', jsonb_build_object('type', 'integer', 'description', 'Transmit period in seconds', 'default', 10),
  'quiet_period', jsonb_build_object('type', 'integer', 'description', 'Quiet period in seconds', 'default', 10)
),
'["enterprise_campus", "user_based_tunneling", "clearpass_integration", "bandwidth_management"]',
'["802.1X", "MAB", "EAP-TLS", "PEAP"]',
'["user_based_tunneling", "dynamic_roles", "clearpass_integration", "bandwidth_control"]',
'["role_based_acls", "user_based_tunneling", "guest_isolation", "bandwidth_limiting"]',
'["Configure_clearpass_integration", "Use_user_based_tunneling", "Monitor_role_assignments", "Regular_policy_updates"]',
'["802.1x", "aruba", "clearpass", "ubt", "authentication", "enterprise"]',
true,
true);

COMMIT;