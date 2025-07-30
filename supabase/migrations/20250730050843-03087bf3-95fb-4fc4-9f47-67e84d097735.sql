-- =========================================
-- COMPREHENSIVE COMPLIANCE & VENDOR ENHANCEMENT
-- Adding all industry compliance frameworks, vendors, and AI capabilities
-- =========================================

-- Add comprehensive compliance frameworks
INSERT INTO pain_points_library (title, description, category, severity, recommended_solutions, industry_specific) VALUES
-- Financial Services Compliance
('PCI-DSS Payment Card Data Protection', 'Requirements for protecting cardholder data and maintaining secure networks', 'compliance', 'critical', 
 '["Multi-factor authentication", "Network segmentation", "Encryption at rest and in transit", "Regular vulnerability scanning", "Access logging and monitoring"]',
 '["financial", "retail", "hospitality", "healthcare"]'),

('SOX Financial Reporting Controls', 'Sarbanes-Oxley Act requirements for financial reporting accuracy and internal controls', 'compliance', 'critical',
 '["Role-based access controls", "Audit trails", "Change management", "Segregation of duties", "Regular access reviews"]',
 '["financial", "banking", "insurance", "public_companies"]'),

('GLBA Financial Privacy Protection', 'Gramm-Leach-Bliley Act privacy and security requirements for financial institutions', 'compliance', 'high',
 '["Customer data encryption", "Privacy notices", "Safeguards rule compliance", "Access controls", "Incident response"]',
 '["banking", "insurance", "financial", "credit_unions"]'),

-- Healthcare Compliance
('HIPAA Patient Data Protection', 'Health Insurance Portability and Accountability Act requirements for PHI protection', 'compliance', 'critical',
 '["Access controls", "Audit logs", "Encryption", "Minimum necessary access", "Business associate agreements"]',
 '["healthcare", "medical", "pharmaceutical", "health_insurance"]'),

('HITECH Enhanced HIPAA Requirements', 'Health Information Technology for Economic and Clinical Health Act enhanced security requirements', 'compliance', 'critical',
 '["Breach notification", "Enhanced penalties", "Audit controls", "Data integrity", "Transmission security"]',
 '["healthcare", "medical", "hospitals", "clinics"]'),

('FDA 21 CFR Part 11', 'Electronic records and signatures requirements for pharmaceutical and medical device industries', 'compliance', 'high',
 '["Electronic signatures", "Audit trails", "System validation", "Data integrity", "Access controls"]',
 '["pharmaceutical", "medical_devices", "biotechnology", "clinical_research"]'),

-- Government & Defense
('FISMA Federal Information Security', 'Federal Information Security Management Act requirements for government systems', 'compliance', 'critical',
 '["NIST framework implementation", "Continuous monitoring", "Risk assessment", "Security controls", "Incident response"]',
 '["government", "federal", "defense", "contractors"]'),

('FedRAMP Cloud Security Authorization', 'Federal Risk and Authorization Management Program for cloud services', 'compliance', 'critical',
 '["Cloud security controls", "Continuous monitoring", "Third-party assessment", "Authorization to operate", "Incident response"]',
 '["government", "cloud_providers", "federal_contractors"]'),

('NIST Cybersecurity Framework', 'National Institute of Standards and Technology cybersecurity framework', 'compliance', 'high',
 '["Identify", "Protect", "Detect", "Respond", "Recover functions", "Risk management", "Continuous improvement"]',
 '["government", "critical_infrastructure", "healthcare", "financial"]'),

('CMMC Cybersecurity Maturity Model', 'Cybersecurity Maturity Model Certification for defense contractors', 'compliance', 'critical',
 '["Access controls", "System hardening", "Incident response", "Risk management", "Situational awareness"]',
 '["defense", "contractors", "manufacturing", "aerospace"]'),

-- International Compliance
('GDPR Data Protection Regulation', 'General Data Protection Regulation requirements for EU data protection', 'compliance', 'critical',
 '["Data minimization", "Consent management", "Right to erasure", "Data portability", "Privacy by design"]',
 '["global", "technology", "retail", "healthcare", "financial"]'),

('ISO 27001 Information Security', 'International standard for information security management systems', 'compliance', 'high',
 '["ISMS implementation", "Risk assessment", "Security controls", "Continuous improvement", "Management review"]',
 '["global", "technology", "financial", "healthcare", "manufacturing"]'),

('SOC 2 Service Organization Controls', 'Service Organization Control 2 requirements for service providers', 'compliance', 'high',
 '["Security controls", "Availability controls", "Processing integrity", "Confidentiality", "Privacy controls"]',
 '["technology", "cloud_providers", "saas", "financial_services"]'),

-- Industry-Specific
('FERPA Educational Records Privacy', 'Family Educational Rights and Privacy Act requirements for educational institutions', 'compliance', 'medium',
 '["Access controls", "Audit logging", "Consent management", "Directory information controls", "Third-party agreements"]',
 '["education", "universities", "schools", "edtech"]'),

('COPPA Children Online Privacy', 'Children Online Privacy Protection Act requirements for online services', 'compliance', 'high',
 '["Parental consent", "Data minimization", "Safe harbor provisions", "Privacy notices", "Third-party disclosure limits"]',
 '["technology", "gaming", "social_media", "edtech"]'),

('NERC CIP Critical Infrastructure Protection', 'North American Electric Reliability Corporation Critical Infrastructure Protection standards', 'compliance', 'critical',
 '["Asset identification", "Security management controls", "Personnel training", "Electronic security perimeters", "Physical security"]',
 '["energy", "utilities", "power_generation", "transmission"]'),

('FFIEC Financial Institution Guidelines', 'Federal Financial Institutions Examination Council cybersecurity guidelines', 'compliance', 'high',
 '["Cybersecurity assessment", "Risk management", "Threat intelligence", "Response and recovery", "Board oversight"]',
 '["banking", "credit_unions", "financial_institutions"]');

-- Add comprehensive recommendations library
INSERT INTO recommendations_library (title, description, category, priority, implementation_effort, expected_outcome, related_pain_points, prerequisites, industry_specific, portnox_features) VALUES
-- Zero Trust Architecture
('Implement Zero Trust Network Architecture', 'Deploy comprehensive zero trust security model with identity-centric access controls', 'security', 'high', 'high',
 'Reduced breach impact, improved security posture, enhanced compliance, better visibility',
 '["Network segmentation challenges", "Identity management complexity", "Legacy system integration"]',
 '["Identity provider integration", "Network inventory", "Policy definition", "Phased rollout plan"]',
 '["financial", "healthcare", "government", "technology"]',
 '["Dynamic VLAN assignment", "Device profiling", "Behavioral analytics", "Policy enforcement"]'),

('Micro-Segmentation Strategy', 'Implement granular network segmentation based on user, device, and application context', 'security', 'high', 'medium',
 'Reduced lateral movement, improved containment, enhanced monitoring, better compliance',
 '["Network complexity", "Performance concerns", "Management overhead"]',
 '["Network topology understanding", "Application dependencies", "Security policies", "Monitoring tools"]',
 '["financial", "healthcare", "manufacturing", "retail"]',
 '["Dynamic policy enforcement", "Real-time monitoring", "Automated response", "Context-aware controls"]'),

-- AI-Enhanced Security
('AI-Powered Threat Detection', 'Deploy machine learning algorithms for behavioral anomaly detection and threat identification', 'security', 'high', 'high',
 'Faster threat detection, reduced false positives, proactive security, automated response',
 '["Manual monitoring limitations", "Alert fatigue", "Skill shortages", "Response time delays"]',
 '["Baseline behavior establishment", "ML model training", "Integration planning", "Staff training"]',
 '["technology", "financial", "healthcare", "government"]',
 '["Behavioral analytics", "Machine learning", "Automated response", "Threat intelligence"]'),

('Predictive Security Analytics', 'Implement predictive analytics to anticipate and prevent security incidents before they occur', 'security', 'medium', 'high',
 'Proactive threat prevention, reduced incident impact, improved security ROI, enhanced compliance',
 '["Reactive security posture", "Resource constraints", "Data quality issues"]',
 '["Historical data collection", "Analytics platform", "Model development", "Integration planning"]',
 '["financial", "healthcare", "technology", "manufacturing"]',
 '["Predictive modeling", "Risk scoring", "Automated prevention", "Continuous learning"]'),

-- Compliance Automation
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
-- Healthcare Templates
('HIPAA-Compliant Healthcare Network', 'Comprehensive healthcare network with HIPAA compliance and patient data protection', 'healthcare', 'enterprise', 'high',
 ARRAY['HIPAA', 'HITECH', 'FDA_21_CFR_Part_11', 'SOC2'],
 '[
   {"id": "patient_data_access", "name": "Patient Data Access Control", "priority": "critical"},
   {"id": "ehr_integration", "name": "Electronic Health Records Integration", "priority": "high"},
   {"id": "medical_device_security", "name": "Medical Device Network Security", "priority": "high"},
   {"id": "guest_patient_wifi", "name": "Guest Patient WiFi Access", "priority": "medium"},
   {"id": "telemedicine_support", "name": "Telemedicine Platform Support", "priority": "high"},
   {"id": "pharmaceutical_research", "name": "Pharmaceutical Research Network", "priority": "high"},
   {"id": "clinical_trial_isolation", "name": "Clinical Trial Data Isolation", "priority": "critical"}
 ]'::jsonb,
 '[
   {"id": "phi_encryption", "name": "PHI Data Encryption", "category": "security", "priority": "critical"},
   {"id": "audit_logging", "name": "Comprehensive Audit Logging", "category": "compliance", "priority": "critical"},
   {"id": "access_controls", "name": "Role-Based Access Controls", "category": "security", "priority": "critical"},
   {"id": "device_authentication", "name": "Medical Device Authentication", "category": "security", "priority": "high"},
   {"id": "network_segmentation", "name": "Clinical Network Segmentation", "category": "security", "priority": "high"}
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
   {"vendor": "aruba", "role": "wireless", "models": ["cx_6000", "clearpass"], "features": ["tunneled_node", "cppm"]},
   {"vendor": "fortinet", "role": "security", "models": ["fortigate", "fortiswitch"], "features": ["security_fabric", "ztna"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Medical_Staff", "subnet": "10.10.10.0/24"},
     {"id": 20, "name": "Medical_Devices", "subnet": "10.10.20.0/24"},
     {"id": 30, "name": "Patient_Data", "subnet": "10.10.30.0/24"},
     {"id": 40, "name": "Guest_Patients", "subnet": "10.10.40.0/24"},
     {"id": 50, "name": "Research", "subnet": "10.10.50.0/24"}
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

-- Financial Services Template
('PCI-DSS Financial Institution Network', 'Secure financial network with PCI-DSS compliance and fraud prevention', 'financial', 'enterprise', 'critical',
 ARRAY['PCI_DSS', 'SOX', 'GLBA', 'SOC2', 'FFIEC'],
 '[
   {"id": "card_processing_security", "name": "Card Processing Security", "priority": "critical"},
   {"id": "fraud_detection", "name": "Real-time Fraud Detection", "priority": "critical"},
   {"id": "customer_data_protection", "name": "Customer Data Protection", "priority": "critical"},
   {"id": "trading_floor_isolation", "name": "Trading Floor Network Isolation", "priority": "high"},
   {"id": "mobile_banking_security", "name": "Mobile Banking Security", "priority": "high"},
   {"id": "atm_network_security", "name": "ATM Network Security", "priority": "high"},
   {"id": "branch_office_connectivity", "name": "Secure Branch Office Connectivity", "priority": "medium"}
 ]'::jsonb,
 '[
   {"id": "cardholder_data_encryption", "name": "Cardholder Data Encryption", "category": "security", "priority": "critical"},
   {"id": "network_segmentation", "name": "PCI Network Segmentation", "category": "compliance", "priority": "critical"},
   {"id": "access_monitoring", "name": "Privileged Access Monitoring", "category": "security", "priority": "critical"},
   {"id": "vulnerability_scanning", "name": "Regular Vulnerability Scanning", "category": "security", "priority": "high"},
   {"id": "incident_response", "name": "Financial Incident Response", "category": "security", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "pci_penetration_test", "name": "PCI Penetration Testing", "priority": "critical"},
   {"id": "cardholder_data_flow_test", "name": "Cardholder Data Flow Test", "priority": "critical"},
   {"id": "access_control_test", "name": "Access Control Validation", "priority": "high"},
   {"id": "encryption_verification", "name": "Encryption Implementation Verification", "priority": "critical"}
 ]'::jsonb,
 '[
   {"id": "smart_card_auth", "name": "Smart Card Authentication", "method": "certificate"},
   {"id": "biometric_auth", "name": "Biometric Authentication", "method": "multi_factor"},
   {"id": "mobile_certificate", "name": "Mobile Device Certificates", "method": "certificate"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "core", "models": ["nexus_9000", "ise"], "features": ["macsec", "trustsec"]},
   {"vendor": "juniper", "role": "edge", "models": ["ex_4000", "srx_series"], "features": ["junos_space", "sky_atp"]},
   {"vendor": "palo_alto", "role": "security", "models": ["pa_series"], "features": ["wildfire", "threat_prevention"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Trading_Floor", "subnet": "172.16.10.0/24"},
     {"id": 20, "name": "Card_Processing", "subnet": "172.16.20.0/24"},
     {"id": 30, "name": "Customer_Services", "subnet": "172.16.30.0/24"},
     {"id": 40, "name": "Branch_Network", "subnet": "172.16.40.0/24"},
     {"id": 50, "name": "ATM_Network", "subnet": "172.16.50.0/24"}
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

-- Government Template
('FISMA Federal Government Network', 'Federal government network with FISMA compliance and security controls', 'government', 'enterprise', 'critical',
 ARRAY['FISMA', 'FedRAMP', 'NIST_CSF', 'CMMC'],
 '[
   {"id": "classified_data_protection", "name": "Classified Data Protection", "priority": "critical"},
   {"id": "continuous_monitoring", "name": "Continuous Security Monitoring", "priority": "critical"},
   {"id": "identity_management", "name": "Federal Identity Management", "priority": "high"},
   {"id": "supply_chain_security", "name": "Supply Chain Risk Management", "priority": "high"},
   {"id": "insider_threat_detection", "name": "Insider Threat Detection", "priority": "high"},
   {"id": "mobile_device_management", "name": "Government Mobile Device Management", "priority": "medium"}
 ]'::jsonb,
 '[
   {"id": "nist_controls", "name": "NIST 800-53 Security Controls", "category": "compliance", "priority": "critical"},
   {"id": "continuous_monitoring", "name": "Continuous Monitoring Program", "category": "security", "priority": "critical"},
   {"id": "boundary_protection", "name": "Network Boundary Protection", "category": "security", "priority": "high"},
   {"id": "incident_response_plan", "name": "Federal Incident Response Plan", "category": "security", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "fisma_controls_test", "name": "FISMA Controls Testing", "priority": "critical"},
   {"id": "boundary_protection_test", "name": "Network Boundary Protection Test", "priority": "high"},
   {"id": "continuous_monitoring_test", "name": "Continuous Monitoring Validation", "priority": "high"}
 ]'::jsonb,
 '[
   {"id": "piv_card_auth", "name": "PIV Card Authentication", "method": "certificate"},
   {"id": "cac_authentication", "name": "Common Access Card Authentication", "method": "certificate"},
   {"id": "derived_credentials", "name": "Derived PIV Credentials", "method": "certificate"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "primary", "models": ["catalyst_9000", "ise"], "features": ["fed_certified", "fips_140_2"]},
   {"vendor": "juniper", "role": "routing", "models": ["mx_series", "ex_series"], "features": ["junos_fips", "enhanced_services"]},
   {"vendor": "aruba", "role": "wireless", "models": ["cx_series"], "features": ["fed_certified", "enhanced_security"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Classified", "subnet": "192.168.10.0/24", "classification": "secret"},
     {"id": 20, "name": "Sensitive", "subnet": "192.168.20.0/24", "classification": "sensitive"},
     {"id": 30, "name": "General", "subnet": "192.168.30.0/24", "classification": "unclassified"},
     {"id": 40, "name": "Guest", "subnet": "192.168.40.0/24", "classification": "public"}
   ],
   "security_requirements": ["FIPS_140_2", "Common_Criteria", "NIAP_Certified"],
   "monitoring_requirements": ["EINSTEIN", "CDM", "CISA_compliance"]
 }'::jsonb,
 '{
   "phases": [
     {"name": "Authority_to_Operate", "duration_weeks": 6, "deliverables": ["System security plan", "Risk assessment", "Control implementation"]},
     {"name": "Implementation", "duration_weeks": 10, "deliverables": ["Infrastructure deployment", "Security controls", "Integration testing"]},
     {"name": "Assessment_Authorization", "duration_weeks": 8, "deliverables": ["Security assessment", "Plan of action", "ATO package"]},
     {"name": "Continuous_Monitoring", "duration_weeks": 0, "deliverables": ["Ongoing monitoring", "Annual assessment", "Control updates"]}
   ]
 }'::jsonb);

-- Add comprehensive vendor configurations
INSERT INTO vendor_library (vendor_name, category, status, description, support_level, portnox_integration_level, key_features, supported_models, configuration_complexity, deployment_scenarios, integration_notes, certification_details, performance_characteristics, scalability_limits, pricing_model, contact_information, documentation_links, last_updated, version_compatibility) VALUES
-- Network Infrastructure Vendors
('Cisco Systems', 'network_infrastructure', 'active', 
 'Leading network infrastructure provider with comprehensive switching, routing, and wireless solutions',
 'tier_1', 'native',
 '["IOS/IOS-XE support", "ISE integration", "TrustSec", "DNA Center", "SD-Access", "IBNS 2.0", "Flexible NetFlow", "EEM scripting"]',
 '["Catalyst 9000 Series", "Nexus 9000 Series", "ISR 4000 Series", "ASR 1000 Series", "Meraki MX/MS/MR", "Catalyst 3850/3650", "Catalyst 2960-X/XR"]',
 'medium_to_high',
 '["enterprise_campus", "data_center", "branch_office", "service_provider", "government", "healthcare", "financial"]',
 'Native RADIUS integration with advanced features like Change of Authorization (CoA), dynamic VLAN assignment, and downloadable ACLs',
 '["Common Criteria", "FIPS 140-2", "NIAP", "UC APL", "NATO", "IEEE 802.1X certified"]',
 '{"throughput": "up_to_28.8_tbps", "latency": "sub_microsecond", "pps": "up_to_4.3_bpps"}',
 '{"ports": "up_to_576_ports_per_switch", "vlans": "4094", "mac_entries": "up_to_128k"}',
 'perpetual_license_plus_support',
 '{"phone": "+1-800-553-6387", "email": "support@cisco.com", "tac": "24x7_global"}',
 '["https://cisco.com/c/en/us/support/switches/", "https://cisco.com/c/en/us/support/security/identity-services-engine/"]',
 now(),
 '{"ios": "15.2+", "ios_xe": "16.12+", "nxos": "7.3+", "ise": "2.7+"}'),

('Aruba Networks (HPE)', 'network_infrastructure', 'active',
 'Enterprise wireless and wired networking solutions with advanced AI-driven operations',
 'tier_1', 'native',
 '["ArubaOS-Switch", "ArubaOS-CX", "ClearPass Policy Manager", "User-Based Tunneling", "Dynamic Segmentation", "NetEdit", "Aruba Central"]',
 '["CX 6000 Series", "CX 8000 Series", "2930F Series", "3810M Series", "5400R Series", "AP-600 Series", "Instant AP Series"]',
 'medium',
 '["enterprise_campus", "remote_work", "iot_deployment", "healthcare", "education", "retail", "hospitality"]',
 'Deep integration with ClearPass for policy management and user-based tunneling for micro-segmentation',
 '["Common Criteria", "FIPS 140-2", "802.11 certified", "Wi-Fi Alliance certified"]',
 '{"switching_capacity": "up_to_17.76_tbps", "wireless_throughput": "up_to_9.6_gbps", "concurrent_users": "up_to_2048_per_ap"}',
 '{"switch_ports": "up_to_288_ports", "wireless_clients": "unlimited", "vlans": "4094"}',
 'subscription_based',
 '{"phone": "+1-844-473-2782", "email": "aruba-support@hpe.com", "portal": "24x7_global_support"}',
 '["https://asp.arubanetworks.com/", "https://community.arubanetworks.com/"]',
 now(),
 '{"arubaos_switch": "16.10+", "arubaos_cx": "10.08+", "clearpass": "6.9+", "central": "2.5+"}'),

('Juniper Networks', 'network_infrastructure', 'active',
 'High-performance networking solutions for service providers and enterprises',
 'tier_1', 'standard',
 '["Junos OS", "JUNOS Space", "SRX Series Security", "Contrail Networking", "Mist AI", "EX Series Switching", "MX Series Routing"]',
 '["EX4600 Series", "EX9200 Series", "QFX5000 Series", "SRX300 Series", "SRX1500 Series", "MX204/480/960", "PTX Series"]',
 'high',
 '["service_provider", "enterprise_campus", "data_center", "cloud", "government", "financial"]',
 'RADIUS integration through Junos OS with support for dynamic VLANs and firewall filters',
 '["Common Criteria", "FIPS 140-2", "NEBS Level 3", "IPv6 Ready Gold"]',
 '{"switching": "up_to_256_tbps", "routing": "up_to_80_tbps", "firewall": "up_to_100_gbps"}',
 '{"ports": "up_to_288_ports_per_switch", "routes": "up_to_20m_ipv4_routes", "sessions": "up_to_10m_concurrent"}',
 'perpetual_license',
 '{"phone": "+1-888-586-4737", "email": "support@juniper.net", "jtac": "24x7_global"}',
 '["https://support.juniper.net/", "https://www.juniper.net/documentation/"]',
 now(),
 '{"junos": "20.4R3+", "space": "19.1+", "contrail": "21.1+"}'),

('Fortinet', 'security_infrastructure', 'active',
 'Integrated cybersecurity platform with networking, security, and SD-WAN solutions',
 'tier_1', 'standard',
 '["FortiOS", "Security Fabric", "FortiGate NGFW", "FortiSwitch", "FortiAP", "FortiAnalyzer", "FortiManager", "SD-WAN"]',
 '["FortiGate 40F-7000F Series", "FortiSwitch 1000-3000 Series", "FortiAP 200-400 Series", "FortiAnalyzer 100-7000 Series"]',
 'medium',
 '["sme_enterprise", "branch_office", "sd_wan", "security_focused", "retail", "manufacturing"]',
 'RADIUS authentication with Security Fabric integration for unified policy enforcement',
 '["Common Criteria", "FIPS 140-2", "ICSA Labs", "NSS Labs validated"]',
 '{"firewall": "up_to_1.8_tbps", "ips": "up_to_900_gbps", "vpn": "up_to_400_gbps"}',
 '{"concurrent_sessions": "up_to_200m", "policies": "up_to_20k", "users": "unlimited"}',
 'subscription_plus_hardware',
 '{"phone": "+1-866-648-4638", "email": "support@fortinet.com", "portal": "24x7_global"}',
 '["https://support.fortinet.com/", "https://docs.fortinet.com/"]',
 now(),
 '{"fortios": "7.0+", "fortiswitch": "7.0+", "fortimanager": "7.0+"}'),

('Extreme Networks', 'network_infrastructure', 'active',
 'Cloud-driven networking solutions with AI/ML-powered automation and analytics',
 'tier_2', 'standard',
 '["ExtremeOS", "VOSS", "Extreme Management Center", "ExtremeAnalytics", "Extreme Campus Controller", "XIQ", "Fabric Connect"]',
 '["X435 Series", "X465 Series", "X690 Series", "X870 Series", "VSP 4000-8000 Series", "AP3000/4000 Series"]',
 'medium',
 '["enterprise_campus", "education", "healthcare", "government", "manufacturing"]',
 'RADIUS integration with policy-based network access and dynamic VLAN assignment',
 '["TAA compliant", "NEBS Level 3", "Energy Star certified"]',
 '{"switching": "up_to_51.2_tbps", "wireless": "up_to_5.95_gbps", "ports": "up_to_2000_per_stack"}',
 '{"stack_units": "up_to_8", "vlans": "4094", "mac_table": "up_to_256k"}',
 'perpetual_or_subscription',
 '{"phone": "+1-603-952-5000", "email": "gtac@extremenetworks.com", "support": "24x7_available"}',
 '["https://gtacknowledge.extremenetworks.com/", "https://documentation.extremenetworks.com/"]',
 now(),
 '{"extremeos": "22.7+", "voss": "8.6+", "xiq": "23.2+"}'),

('Ruckus Networks (CommScope)', 'wireless_infrastructure', 'active',
 'Enterprise Wi-Fi and network infrastructure with advanced RF optimization',
 'tier_2', 'standard',
 '["SmartZone Controllers", "Unleashed", "Cloud WiFi", "BeamFlex", "SmartCast", "ChannelFly", "DPSK"]',
 '["R350/R550/R650/R750 APs", "H320/H350/H510/H550 APs", "SmartZone 100/300/144", "ICX 7000 Series Switches"]',
 'low_to_medium',
 '["enterprise_wireless", "education", "hospitality", "healthcare", "stadiums", "outdoor"]',
 'RADIUS authentication with SmartZone integration and dynamic PSK capabilities',
 '["Wi-Fi Alliance certified", "FCC/IC certified", "Energy Star qualified"]',
 '{"wireless": "up_to_5.95_gbps", "concurrent_clients": "up_to_1024_per_ap", "controller": "up_to_40k_aps"}',
 '{"aps_per_controller": "up_to_40000", "clients_per_controller": "up_to_200k", "ssids": "up_to_64"}',
 'perpetual_plus_support',
 '{"phone": "+1-855-782-5871", "email": "support.enterprise@commscope.com", "portal": "24x7_global"}',
 '["https://support.ruckuswireless.com/", "https://docs.commscope.com/"]',
 now(),
 '{"smartzone": "5.2+", "unleashed": "200.13+", "cloud": "5.2+"}'),

-- Security Vendors
('Palo Alto Networks', 'security_infrastructure', 'active',
 'Next-generation firewall and comprehensive cybersecurity platform',
 'tier_1', 'standard',
 '["PAN-OS", "Panorama", "WildFire", "Threat Prevention", "GlobalProtect", "Prisma", "Cortex"]',
 '["PA-220/400 Series", "PA-800/3000/5000 Series", "PA-7000 Series", "Prisma Access", "CN-Series"]',
 'high',
 '["enterprise_security", "data_center", "cloud_security", "remote_access", "government"]',
 'Integration through RADIUS with User-ID mapping and dynamic security policies',
 '["Common Criteria", "FIPS 140-2", "ICSA Labs", "USGv6", "IPv6 Ready Gold"]',
 '{"firewall": "up_to_2_tbps", "threat_prevention": "up_to_1.5_tbps", "vpn": "up_to_100_gbps"}',
 '{"sessions": "up_to_128m", "policies": "unlimited", "ssl_sessions": "up_to_400k"}',
 'subscription_based',
 '{"phone": "+1-866-898-9087", "email": "support@paloaltonetworks.com", "portal": "24x7_global"}',
 '["https://support.paloaltonetworks.com/", "https://docs.paloaltonetworks.com/"]',
 now(),
 '{"panos": "10.1+", "panorama": "10.1+", "globalprotect": "5.2+"}'),

('Check Point Software', 'security_infrastructure', 'active',
 'Comprehensive cybersecurity solutions with advanced threat prevention',
 'tier_1', 'standard',
 '["Gaia OS", "SmartConsole", "Threat Prevention", "SandBlast", "CloudGuard", "Quantum Security", "Harmony"]',
 '["1100/1500 Series", "3100/5100 Series", "15000/26000 Series", "CloudGuard", "Quantum Spark"]',
 'high',
 '["enterprise_security", "cloud_security", "endpoint_protection", "mobile_security"]',
 'RADIUS integration with Identity Awareness and dynamic policy enforcement',
 '["Common Criteria", "FIPS 140-2", "ICSA Labs", "NIAP certified"]',
 '{"firewall": "up_to_3_tbps", "threat_prevention": "up_to_2_tbps", "vpn": "up_to_200_gbps"}',
 '{"concurrent_connections": "up_to_200m", "policies": "unlimited", "users": "unlimited"}',
 'subscription_model',
 '{"phone": "+1-800-429-4391", "email": "support@checkpoint.com", "support": "24x7_premier"}',
 '["https://supportcenter.checkpoint.com/", "https://sc1.checkpoint.com/documents/"]',
 now(),
 '{"gaia": "R81.10+", "smartconsole": "R81.10+", "endpoint": "E86+"}'),

-- Cloud and Virtualization
('VMware', 'virtualization', 'active',
 'Virtualization and cloud infrastructure solutions with micro-segmentation',
 'tier_1', 'standard',
 '["vSphere", "NSX", "vRealize", "vSAN", "Workspace ONE", "Carbon Black", "VeloCloud SD-WAN"]',
 '["vSphere 7.0+", "NSX-T 3.0+", "vRealize Suite", "Workspace ONE UEM", "VeloCloud Edge"]',
 'high',
 '["virtualization", "cloud_infrastructure", "micro_segmentation", "endpoint_management"]',
 'Integration through NSX for micro-segmentation and Workspace ONE for device management',
 '["Common Criteria", "FIPS 140-2", "FedRAMP", "SOC 2 Type II"]',
 '{"virtualization": "up_to_768_vcpus", "network": "up_to_320_gbps", "storage": "petabyte_scale"}',
 '{"vms_per_host": "up_to_1024", "hosts_per_cluster": "up_to_96", "clusters": "unlimited"}',
 'subscription_based',
 '{"phone": "+1-877-486-9273", "email": "support@vmware.com", "portal": "24x7_global"}',
 '["https://docs.vmware.com/", "https://kb.vmware.com/"]',
 now(),
 '{"vsphere": "7.0+", "nsx": "3.1+", "workspace_one": "21.08+"}'),

-- Wireless Specialized
('Ubiquiti Networks', 'wireless_infrastructure', 'active',
 'Cost-effective networking solutions for SMB and enterprise environments',
 'tier_3', 'basic',
 '["UniFi Controller", "EdgeOS", "UISP", "Dream Machine", "WiFi 6", "PoE++", "Cloud Key"]',
 '["UniFi 6 Series APs", "Dream Machine Pro", "EdgeSwitch Series", "USG Pro", "Cloud Key Gen2+"]',
 'low',
 '["small_medium_business", "branch_office", "education", "hospitality", "retail"]',
 'Basic RADIUS support through UniFi Controller with VLAN assignment capabilities',
 '["FCC Part 15", "IC RSS", "CE certified", "Wi-Fi Alliance certified"]',
 '{"wireless": "up_to_4.8_gbps", "switching": "up_to_2_tbps", "routing": "up_to_3.5_mpps"}',
 '{"clients_per_ap": "up_to_300", "aps_per_controller": "unlimited", "sites": "unlimited"}',
 'one_time_purchase',
 '{"email": "support@ubnt.com", "community": "community.ui.com", "support": "business_hours"}',
 '["https://help.ui.com/", "https://community.ui.com/"]',
 now(),
 '{"unifi": "6.5+", "edgeos": "2.0+", "uisp": "1.4+"}'),

-- Emerging Technologies
('Mist Systems (Juniper)', 'ai_networking', 'active',
 'AI-driven wireless and wired assurance with machine learning analytics',
 'tier_1', 'standard',
 '["Mist Cloud", "Marvis AI", "vBLE", "Location Services", "Wired Assurance", "WAN Assurance"]',
 '["AP43/45 WiFi 6E", "EX Series with Mist", "SRX with Mist", "Session Smart Router"]',
 'medium',
 '["ai_driven_networks", "location_services", "user_experience", "automation"]',
 'Advanced RADIUS integration with AI-driven troubleshooting and user experience monitoring',
 '["Wi-Fi Alliance certified", "Bluetooth SIG qualified", "FCC/IC certified"]',
 '{"wireless": "up_to_9.6_gbps", "ai_insights": "real_time", "location_accuracy": "1_3_meters"}',
 '{"clients": "unlimited", "aps": "unlimited", "insights_retention": "13_months"}',
 'subscription_saas',
 '{"phone": "+1-844-647-8786", "email": "support@mist.com", "portal": "24x7_cloud_support"}',
 '["https://www.mist.com/documentation/", "https://support.mist.com/"]',
 now(),
 '{"mist_cloud": "0.22+", "marvis": "2.0+", "junos": "21.1R1+"}');

-- Add comprehensive configuration templates for each vendor
INSERT INTO configuration_templates (name, description, vendor_id, category, configuration_type, complexity_level, template_content, template_variables, supported_scenarios, authentication_methods, required_features, network_requirements, security_features, best_practices, troubleshooting_guide, validation_commands, tags, is_public, is_validated) 
SELECT 
  'Advanced ' || vl.vendor_name || ' 802.1X Configuration',
  'Comprehensive 802.1X configuration for ' || vl.vendor_name || ' with advanced security features and compliance options',
  vl.id,
  'authentication',
  '802.1x_advanced',
  'high',
  CASE 
    WHEN vl.vendor_name = 'Cisco Systems' THEN '! Advanced Cisco 802.1X Configuration
! ========================================
! Global 802.1X Configuration
! ========================================
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting update newinfo periodic 2880

! RADIUS Configuration
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

! Device Tracking and Profiling
device-tracking policy PORTNOX-TRACKING
 security-level glean
 device-role node
 tracking enable

ip device tracking probe delay 10
ip device tracking probe interval 30
device-sensor filter-list dhcp list DHCP-LIST
device-sensor filter-list lldp list LLDP-LIST
device-sensor filter-spec dhcp include-list DHCP-LIST
device-sensor filter-spec lldp include-list LLDP-LIST
device-sensor accounting
device-sensor notify all-changes

! Pre-Authentication ACL
ip access-list extended PRE-AUTH-ACL
 permit udp any any eq domain
 permit udp any any eq bootps
 permit udp any any eq bootpc
 permit tcp any host {{portnox_cloud_ip}} eq 443
 permit icmp any any
 deny ip any any log

! Post-Authentication ACLs
ip access-list extended EMPLOYEE-ACL
 permit ip any any

ip access-list extended GUEST-ACL
 deny ip any 10.0.0.0 0.255.255.255
 deny ip any 172.16.0.0 0.15.255.255
 deny ip any 192.168.0.0 0.0.255.255
 permit ip any any

! Critical Authentication VLAN
vlan {{critical_vlan_id}}
 name Critical-Auth

! Interface Template
interface GigabitEthernet0/0/1
 description User Access Port
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
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x max-req {{max_requests}}
 spanning-tree portfast
 spanning-tree bpduguard enable
 device-tracking attach-policy PORTNOX-TRACKING
 ip access-group PRE-AUTH-ACL in
 storm-control broadcast level 5.00
 storm-control multicast level 5.00
 storm-control action shutdown

! Critical Authentication Recovery
authentication critical recovery delay 1000
authentication event server dead action authorize vlan {{critical_vlan_id}}
authentication event server alive action reinitialize

! Enable globally
dot1x system-auth-control
authentication display

! Logging Configuration
logging buffered 1000000
logging trap informational
service timestamps log datetime msec localtime show-timezone
archive
 log config
  logging enable
  notify syslog contenttype plaintext
  hidekeys'
    WHEN vl.vendor_name = 'Aruba Networks (HPE)' THEN '! Advanced Aruba 802.1X Configuration
! ========================================
! Global AAA Configuration
! ========================================
aaa authentication port-access eap-radius
aaa authentication port-access chap-radius
aaa authentication mac-based chap-radius

radius-server host {{radius_primary_ip}} key {{radius_shared_secret}}
radius-server host {{radius_secondary_ip}} key {{radius_shared_secret}}
radius-server timeout 10
radius-server retransmit 3
radius-server dead-time 10

! User Roles
user-role "authenticated"
  access-list session "authenticated-acl"

user-role "guest"
  access-list session "guest-acl"

user-role "critical-auth"
  access-list session "critical-acl"

! Access Control Lists
access-list session "authenticated-acl"
  user any any any permit

access-list session "guest-acl"
  user any 10.0.0.0 255.0.0.0 deny
  user any 172.16.0.0 255.240.0.0 deny
  user any 192.168.0.0 255.255.0.0 deny
  user any any any permit

access-list session "critical-acl"
  user any any udp 53 permit
  user any any tcp 443 permit
  user any any any deny

! Port-based Authentication
aaa port-access authenticator active
aaa port-access mac-based
aaa port-access mac-based addr-format multi-colon
aaa port-access mac-based age-time 86400

! VLAN Configuration
vlan {{default_vlan_id}}
  name "Default"
  untagged 1-24
  
vlan {{guest_vlan_id}}
  name "Guest"

vlan {{critical_vlan_id}}
  name "Critical-Auth"

! Interface Configuration
interface 1-24
  aaa port-access authenticator
  aaa port-access authenticator tx-period {{tx_period}}
  aaa port-access authenticator quiet-period {{quiet_period}}
  aaa port-access authenticator server-timeout {{server_timeout}}
  aaa port-access authenticator max-requests {{max_requests}}
  aaa port-access mac-based
  aaa port-access mac-based unauth-vid {{guest_vlan_id}}
  aaa port-access controlled-direction in
  spanning-tree admin-edge-port
  spanning-tree bpdu-protection

! Time-based policies
time-range "business-hours"
  absolute start 07:00:00 end 19:00:00
  weekdays

! Advanced Features
qos trust none
loop-protect 1-24
broadcast-limit 10
unknown-vlans-policy disable

! Logging
logging facility local6
logging 192.168.1.100'
    WHEN vl.vendor_name = 'Juniper Networks' THEN '# Advanced Juniper 802.1X Configuration
# ========================================
# AAA Configuration
# ========================================
set access radius-server {{radius_primary_ip}} port 1812
set access radius-server {{radius_primary_ip}} accounting-port 1813
set access radius-server {{radius_primary_ip}} secret "{{radius_shared_secret}}"
set access radius-server {{radius_primary_ip}} timeout 10
set access radius-server {{radius_primary_ip}} retry 3

set access radius-server {{radius_secondary_ip}} port 1812
set access radius-server {{radius_secondary_ip}} accounting-port 1813
set access radius-server {{radius_secondary_ip}} secret "{{radius_shared_secret}}"
set access radius-server {{radius_secondary_ip}} timeout 10
set access radius-server {{radius_secondary_ip}} retry 3

# Authentication order
set access profile "PORTNOX-PROFILE" authentication-order radius
set access profile "PORTNOX-PROFILE" radius authentication-server {{radius_primary_ip}}
set access profile "PORTNOX-PROFILE" radius authentication-server {{radius_secondary_ip}}
set access profile "PORTNOX-PROFILE" radius accounting-server {{radius_primary_ip}}
set access profile "PORTNOX-PROFILE" radius accounting-server {{radius_secondary_ip}}

# Firewall filters for pre-auth
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dhcp from protocol udp
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dhcp from destination-port 67-68
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dhcp then accept

set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dns from protocol udp
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dns from destination-port 53
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-dns then accept

set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-portnox from destination-address {{portnox_cloud_ip}}/32
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-portnox from protocol tcp
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-portnox from destination-port 443
set firewall family ethernet-switching filter PRE-AUTH-FILTER term allow-portnox then accept

set firewall family ethernet-switching filter PRE-AUTH-FILTER term deny-all then discard

# VLAN Configuration
set vlans default vlan-id {{default_vlan_id}}
set vlans guest vlan-id {{guest_vlan_id}}
set vlans critical-auth vlan-id {{critical_vlan_id}}

# Access ports configuration
set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode access
set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members default
set interfaces ge-0/0/0 unit 0 family ethernet-switching filter input PRE-AUTH-FILTER

# 802.1X Configuration
set protocols dot1x traceoptions file dot1x-trace
set protocols dot1x traceoptions level all
set protocols dot1x authenticator authentication-profile-name "PORTNOX-PROFILE"
set protocols dot1x authenticator interface ge-0/0/0.0 supplicant single
set protocols dot1x authenticator interface ge-0/0/0.0 retries {{max_requests}}
set protocols dot1x authenticator interface ge-0/0/0.0 quiet-period {{quiet_period}}
set protocols dot1x authenticator interface ge-0/0/0.0 transmit-period {{tx_period}}
set protocols dot1x authenticator interface ge-0/0/0.0 supplicant-timeout {{supp_timeout}}
set protocols dot1x authenticator interface ge-0/0/0.0 server-timeout {{server_timeout}}
set protocols dot1x authenticator interface ge-0/0/0.0 guest-vlan guest
set protocols dot1x authenticator interface ge-0/0/0.0 server-fail-vlan critical-auth

# MAC RADIUS Configuration
set protocols dot1x mac-radius authentication-profile-name "PORTNOX-PROFILE"
set protocols dot1x mac-radius interface ge-0/0/0.0

# LLDP and DHCP Snooping
set protocols lldp interface ge-0/0/0
set ethernet-switching-options secure-access-port interface ge-0/0/0.0 dhcp-trusted

# Storm Control
set ethernet-switching-options storm-control interface all
set ethernet-switching-options storm-control interface all bandwidth level 1000

# Spanning Tree
set protocols rstp interface ge-0/0/0 edge
set protocols rstp interface ge-0/0/0 no-root-port

# Logging
set system syslog host {{syslog_server}} any info
set system syslog file messages any notice'
    ELSE '# Generic 802.1X Configuration Template
# This is a generic template - please customize for your specific vendor
# Contact support for vendor-specific configuration assistance'
  END,
  jsonb_build_object(
    'radius_primary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Primary RADIUS server IP address', 'required', true),
    'radius_secondary_ip', jsonb_build_object('type', 'ipv4', 'description', 'Secondary RADIUS server IP address', 'required', true),
    'radius_shared_secret', jsonb_build_object('type', 'password', 'description', 'RADIUS shared secret', 'required', true, 'min_length', 20),
    'default_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Default VLAN ID', 'default', 100, 'min', 1, 'max', 4094),
    'guest_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Guest VLAN ID', 'default', 200, 'min', 1, 'max', 4094),
    'critical_vlan_id', jsonb_build_object('type', 'integer', 'description', 'Critical authentication VLAN ID', 'default', 999, 'min', 1, 'max', 4094),
    'quiet_period', jsonb_build_object('type', 'integer', 'description', 'Quiet period in seconds', 'default', 10, 'min', 1, 'max', 300),
    'tx_period', jsonb_build_object('type', 'integer', 'description', 'Transmit period in seconds', 'default', 10, 'min', 1, 'max', 300),
    'supp_timeout', jsonb_build_object('type', 'integer', 'description', 'Supplicant timeout in seconds', 'default', 10, 'min', 1, 'max', 300),
    'server_timeout', jsonb_build_object('type', 'integer', 'description', 'Server timeout in seconds', 'default', 10, 'min', 1, 'max', 300),
    'max_requests', jsonb_build_object('type', 'integer', 'description', 'Maximum authentication requests', 'default', 2, 'min', 1, 'max', 10)
  ),
  '["enterprise_deployment", "compliance_focused", "high_security", "multi_vendor", "scalable_architecture"]',
  '["802.1X", "MAB", "EAP-TLS", "PEAP", "EAP-TTLS"]',
  '["dynamic_vlan_assignment", "radius_accounting", "coa_support", "guest_vlan", "critical_auth_vlan"]',
  jsonb_build_object(
    'minimum_bandwidth', '1Gbps_per_access_port',
    'vlan_support', 'IEEE_802.1Q',
    'spanning_tree', 'RSTP_or_MSTP',
    'redundancy', 'dual_radius_servers'
  ),
  '["port_security", "dhcp_snooping", "arp_inspection", "storm_control", "bpdu_guard"]',
  '["Use_strong_shared_secrets", "Configure_radius_timeouts", "Enable_accounting", "Monitor_authentication_logs", "Regular_certificate_updates"]',
  '[
    {"issue": "Authentication failures", "symptoms": ["Users cannot connect", "Frequent re-authentication"], "solutions": ["Check RADIUS connectivity", "Verify shared secret", "Review certificate validity"]},
    {"issue": "VLAN assignment problems", "symptoms": ["Wrong VLAN assignment", "No dynamic VLAN"], "solutions": ["Verify RADIUS attributes", "Check VLAN configuration", "Test CoA functionality"]},
    {"issue": "Performance issues", "symptoms": ["Slow authentication", "Timeouts"], "solutions": ["Optimize authentication timers", "Check network latency", "Review RADIUS server performance"]}
  ]',
  '["show authentication sessions", "show dot1x all", "show radius statistics", "show logging"]',
  '["802.1x", "radius", "authentication", "enterprise", "security", "compliance"]',
  true,
  true
FROM vendor_library vl
WHERE vl.status = 'active';

-- Commit the migration
COMMIT;