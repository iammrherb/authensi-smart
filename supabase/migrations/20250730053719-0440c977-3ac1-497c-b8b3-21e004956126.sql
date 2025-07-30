-- =========================================
-- COMPREHENSIVE COMPLIANCE & VENDOR ENHANCEMENT V4 
-- Using correct constraint values and fixing security issues
-- =========================================

-- Fix security issues first
-- Fix function search paths that are mutable
ALTER FUNCTION public.has_role SET search_path TO 'public';
ALTER FUNCTION public.user_owns_project SET search_path TO 'public';
ALTER FUNCTION public.user_owns_site SET search_path TO 'public';
ALTER FUNCTION public.can_manage_roles SET search_path TO 'public';
ALTER FUNCTION public.has_permission SET search_path TO 'public';

-- Add comprehensive compliance pain points
INSERT INTO pain_points_library (title, description, category, severity, recommended_solutions, industry_specific) VALUES
-- Financial Services
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
('ISO 27001 Information Security', 'International standard for information security management systems', 'compliance', 'high',
 '["ISMS implementation", "Risk assessment", "Security controls", "Continuous improvement", "Management review"]',
 '["global", "technology", "financial", "healthcare", "manufacturing"]'),
('SOC 2 Service Organization Controls', 'Service Organization Control 2 requirements for service providers', 'compliance', 'high',
 '["Security controls", "Availability controls", "Processing integrity", "Confidentiality", "Privacy controls"]',
 '["technology", "cloud_providers", "saas", "financial_services"]'),
('CMMC Cybersecurity Maturity Model', 'Cybersecurity Maturity Model Certification for defense contractors', 'compliance', 'critical',
 '["Access controls", "System hardening", "Incident response", "Risk management", "Situational awareness"]',
 '["defense", "contractors", "manufacturing", "aerospace"]'),
('NERC CIP Critical Infrastructure Protection', 'North American Electric Reliability Corporation Critical Infrastructure Protection standards', 'compliance', 'critical',
 '["Asset identification", "Security management controls", "Personnel training", "Electronic security perimeters", "Physical security"]',
 '["energy", "utilities", "power_generation", "transmission"]'),
('FERPA Educational Records Privacy', 'Family Educational Rights and Privacy Act requirements for educational institutions', 'compliance', 'medium',
 '["Access controls", "Audit logging", "Consent management", "Directory information controls", "Third-party agreements"]',
 '["education", "universities", "schools", "edtech"]');

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
 '["Real-time monitoring", "Automated remediation", "Policy enforcement", "Compliance reporting"]'),
('Predictive Security Analytics', 'Implement predictive analytics to anticipate and prevent security incidents before they occur', 'security', 'medium', 'high',
 'Proactive threat prevention, reduced incident impact, improved security ROI, enhanced compliance',
 '["Reactive security posture", "Resource constraints", "Data quality issues"]',
 '["Historical data collection", "Analytics platform", "Model development", "Integration planning"]',
 '["financial", "healthcare", "technology", "manufacturing"]',
 '["Predictive modeling", "Risk scoring", "Automated prevention", "Continuous learning"]');

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
   {"id": "audit_trail_test", "name": "Audit Trail Completeness Test", "priority": "high"},
   {"id": "medical_device_auth", "name": "Medical Device Authentication Test", "priority": "high"}
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
 }'::jsonb);

-- Add major vendors using correct constraint values (using "primary" vendor_type and no support_level)
INSERT INTO vendor_library (vendor_name, vendor_type, category, status, description, portnox_integration_level) VALUES
('Cisco Systems', 'primary', 'Switching & Routing', 'active', 
 'Leading network infrastructure provider with Catalyst switches, ISE authentication, TrustSec security, and DNA Center management platform',
 'supported'),
('Aruba Networks (HPE)', 'primary', 'Wireless Infrastructure', 'active',
 'Enterprise networking with ClearPass authentication, User-Based Tunneling, and AI-driven operations through Aruba Central',
 'supported'),
('Juniper Networks', 'primary', 'Switching & Routing', 'active',
 'High-performance networking with Junos OS, Mist AI wireless, and comprehensive security through SRX series',
 'supported'),
('Fortinet', 'primary', 'Security Appliances', 'active',
 'Unified security platform with FortiGate NGFW, FortiSwitch integration, and Security Fabric orchestration',
 'supported'),
('Extreme Networks', 'primary', 'Switching & Routing', 'active',
 'Cloud-managed networking with ExtremeCloud IQ, Fabric Connect technology, and universal hardware platform',
 'supported'),
('Ruckus Networks', 'primary', 'Wireless Infrastructure', 'active',
 'Enterprise wireless with SmartZone controllers, BeamFlex antenna technology, and advanced RF optimization',
 'supported'),
('Palo Alto Networks', 'primary', 'Security Appliances', 'active',
 'Next-generation security with PAN-OS, WildFire threat intelligence, and Prisma cloud-native security',
 'supported'),
('VMware', 'primary', 'Virtualization', 'active',
 'Virtualization and cloud infrastructure with NSX micro-segmentation, vSphere, and Workspace ONE',
 'supported'),
('Ubiquiti Networks', 'primary', 'Wireless Infrastructure', 'active',
 'Cost-effective networking with UniFi platform, cloud management, and simplified deployment for SMB',
 'limited'),
('Mist Systems', 'primary', 'AI/ML Analytics', 'active',
 'AI-driven networking with Marvis virtual assistant, machine learning insights, and predictive analytics',
 'supported');

-- Add comprehensive configuration templates
INSERT INTO configuration_templates (name, description, category, configuration_type, complexity_level, template_content, template_variables, supported_scenarios, authentication_methods, required_features, security_features, best_practices, tags, is_public, is_validated) VALUES
('Advanced Cisco 802.1X Configuration', 'Comprehensive Cisco 802.1X configuration with AI-powered analytics and automated response capabilities', 'authentication', '802.1x_advanced', 'high',
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

! Pre-Authentication ACL
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

! Critical Authentication Recovery
authentication critical recovery delay 1000
authentication event server dead action authorize vlan {{critical_vlan_id}}
authentication event server alive action reinitialize

! Enable globally
dot1x system-auth-control
authentication display

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
  'radius_primary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Primary RADIUS server IP address', 'required', true),
  'radius_secondary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Secondary RADIUS server IP address', 'required', true),
  'radius_shared_secret', jsonb_build_object('type', 'password', 'description', 'RADIUS shared secret (minimum 20 characters)', 'required', true, 'min_length', 20),
  'portnox_cloud_ip', jsonb_build_object('type', 'ipv4', 'description', 'Portnox Cloud IP address for management access', 'required', true),
  'default_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Default VLAN ID for authenticated users', 'default', 100, 'min', 1, 'max', 4094),
  'critical_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Critical authentication VLAN ID', 'default', 999, 'min', 1, 'max', 4094),
  'quiet_period', jsonb_build_object('type', 'integer', 'description', 'Quiet period in seconds after failed authentication', 'default', 10, 'min', 1, 'max', 300),
  'tx_period', jsonb_build_object('type', 'integer', 'description', 'Transmit period in seconds between EAPOL frames', 'default', 10, 'min', 1, 'max', 300)
),
'["enterprise_deployment", "ai_powered", "compliance_focused", "high_security", "scalable_architecture", "healthcare", "financial", "government"]',
'["802.1X", "MAB", "EAP-TLS", "PEAP", "EAP-TTLS", "EAP-FAST"]',
'["dynamic_vlan_assignment", "radius_accounting", "coa_support", "ai_analytics", "behavioral_monitoring", "device_profiling"]',
'["port_security", "dhcp_snooping", "arp_inspection", "storm_control", "bpdu_guard", "ai_threat_detection", "critical_auth_vlan"]',
'["Use_strong_shared_secrets_minimum_20_chars", "Configure_dual_radius_servers", "Enable_comprehensive_accounting", "Monitor_ai_analytics_dashboards", "Regular_certificate_lifecycle_management", "Test_failover_scenarios", "Document_authentication_flows"]',
'["802.1x", "cisco", "ai", "authentication", "enterprise", "security", "compliance", "healthcare", "financial", "government"]',
true,
true);

COMMIT;