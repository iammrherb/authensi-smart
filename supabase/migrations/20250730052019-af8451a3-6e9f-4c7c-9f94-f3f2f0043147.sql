-- =========================================
-- COMPREHENSIVE COMPLIANCE & VENDOR ENHANCEMENT V2
-- Working with correct table schema including vendor_type
-- =========================================

-- Add comprehensive compliance pain points and industry-specific recommendations
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

-- Healthcare  
('HIPAA Patient Data Protection', 'Health Insurance Portability and Accountability Act requirements for PHI protection', 'compliance', 'critical',
 '["Access controls", "Audit logs", "Encryption", "Minimum necessary access", "Business associate agreements"]',
 '["healthcare", "medical", "pharmaceutical", "health_insurance"]'),
('HITECH Enhanced HIPAA Requirements', 'Health Information Technology for Economic and Clinical Health Act enhanced security requirements', 'compliance', 'critical',
 '["Breach notification", "Enhanced penalties", "Audit controls", "Data integrity", "Transmission security"]',
 '["healthcare", "medical", "hospitals", "clinics"]'),

-- Government & Defense
('FISMA Federal Information Security', 'Federal Information Security Management Act requirements for government systems', 'compliance', 'critical',
 '["NIST framework implementation", "Continuous monitoring", "Risk assessment", "Security controls", "Incident response"]',
 '["government", "federal", "defense", "contractors"]'),
('CMMC Cybersecurity Maturity Model', 'Cybersecurity Maturity Model Certification for defense contractors', 'compliance', 'critical',
 '["Access controls", "System hardening", "Incident response", "Risk management", "Situational awareness"]',
 '["defense", "contractors", "manufacturing", "aerospace"]'),

-- International Standards
('ISO 27001 Information Security', 'International standard for information security management systems', 'compliance', 'high',
 '["ISMS implementation", "Risk assessment", "Security controls", "Continuous improvement", "Management review"]',
 '["global", "technology", "financial", "healthcare", "manufacturing"]'),
('SOC 2 Service Organization Controls', 'Service Organization Control 2 requirements for service providers', 'compliance', 'high',
 '["Security controls", "Availability controls", "Processing integrity", "Confidentiality", "Privacy controls"]',
 '["technology", "cloud_providers", "saas", "financial_services"]'),

-- Industry Specific
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

-- Add comprehensive project templates for different industries
INSERT INTO project_templates (name, description, industry, deployment_type, security_level, compliance_frameworks, use_cases, requirements, test_cases, authentication_workflows, vendor_configurations, network_requirements, timeline_template) VALUES
-- Healthcare Template
('HIPAA-Compliant Healthcare Network', 'Comprehensive healthcare network with HIPAA compliance and patient data protection', 'healthcare', 'enterprise', 'high',
 ARRAY['HIPAA', 'HITECH', 'FDA_21_CFR_Part_11', 'SOC2'],
 '[
   {"id": "patient_data_access", "name": "Patient Data Access Control", "priority": "critical", "description": "Secure access to patient health information"},
   {"id": "ehr_integration", "name": "Electronic Health Records Integration", "priority": "high", "description": "Integration with hospital EHR systems"},
   {"id": "medical_device_security", "name": "Medical Device Network Security", "priority": "high", "description": "IoT medical device authentication and monitoring"},
   {"id": "guest_patient_wifi", "name": "Guest Patient WiFi Access", "priority": "medium", "description": "Secure guest network for patients and visitors"},
   {"id": "telemedicine_support", "name": "Telemedicine Platform Support", "priority": "high", "description": "Secure remote consultation capabilities"}
 ]'::jsonb,
 '[
   {"id": "phi_encryption", "name": "PHI Data Encryption", "category": "security", "priority": "critical", "description": "End-to-end encryption of patient health information"},
   {"id": "audit_logging", "name": "Comprehensive Audit Logging", "category": "compliance", "priority": "critical", "description": "Complete audit trail for all PHI access"},
   {"id": "access_controls", "name": "Role-Based Access Controls", "category": "security", "priority": "critical", "description": "Healthcare role-based network access"},
   {"id": "device_authentication", "name": "Medical Device Authentication", "category": "security", "priority": "high", "description": "Certificate-based IoMT device authentication"}
 ]'::jsonb,
 '[
   {"id": "phi_access_test", "name": "PHI Access Authorization Test", "priority": "critical", "description": "Verify proper PHI access controls"},
   {"id": "encryption_validation", "name": "Data Encryption Validation", "priority": "critical", "description": "Validate encryption implementation"},
   {"id": "audit_trail_test", "name": "Audit Trail Completeness Test", "priority": "high", "description": "Verify comprehensive audit logging"},
   {"id": "medical_device_auth", "name": "Medical Device Authentication Test", "priority": "high", "description": "Test IoMT device authentication"}
 ]'::jsonb,
 '[
   {"id": "eap_tls_healthcare", "name": "EAP-TLS for Healthcare Staff", "method": "certificate", "description": "Certificate-based authentication for clinical staff"},
   {"id": "device_certificates", "name": "Medical Device Certificates", "method": "certificate", "description": "X.509 certificates for medical devices"},
   {"id": "guest_portal", "name": "Patient Guest Portal", "method": "portal", "description": "Captive portal for patient and visitor access"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "primary", "models": ["catalyst_9000", "ise"], "features": ["trustsec", "sxp", "ise_compliance"]},
   {"vendor": "aruba", "role": "wireless", "models": ["cx_6000", "clearpass"], "features": ["tunneled_node", "cppm", "healthcare_profiles"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Medical_Staff", "subnet": "10.10.10.0/24", "description": "Clinical staff network"},
     {"id": 20, "name": "Medical_Devices", "subnet": "10.10.20.0/24", "description": "IoMT devices and equipment"},
     {"id": 30, "name": "Patient_Data", "subnet": "10.10.30.0/24", "description": "PHI processing systems"},
     {"id": 40, "name": "Guest_Patients", "subnet": "10.10.40.0/24", "description": "Patient and visitor access"}
   ],
   "security_zones": ["clinical", "administrative", "research", "guest"],
   "bandwidth_requirements": {"clinical": "1Gbps", "devices": "100Mbps", "guest": "50Mbps"},
   "compliance_controls": ["encryption", "audit_logging", "access_controls", "data_loss_prevention"]
 }'::jsonb,
 '{
   "phases": [
     {"name": "Planning & Compliance", "duration_weeks": 4, "deliverables": ["Network design", "HIPAA compliance mapping", "Risk assessment", "Security architecture"]},
     {"name": "Infrastructure Deployment", "duration_weeks": 6, "deliverables": ["Hardware deployment", "Network configuration", "Security implementation", "Monitoring setup"]},
     {"name": "Integration & Testing", "duration_weeks": 4, "deliverables": ["EHR integration", "Medical device onboarding", "Security testing", "Compliance validation"]},
     {"name": "Compliance Validation", "duration_weeks": 3, "deliverables": ["HIPAA assessment", "Audit preparation", "Documentation", "Staff training"]},
     {"name": "Go-Live & Support", "duration_weeks": 2, "deliverables": ["Production deployment", "Clinical staff training", "Support transition", "Ongoing monitoring"]}
   ],
   "total_duration_weeks": 19,
   "key_milestones": ["HIPAA compliance verification", "Medical device integration", "EHR connectivity", "Security validation"]
 }'::jsonb),

-- Financial Template  
('PCI-DSS Financial Institution Network', 'Secure financial network with PCI-DSS compliance and fraud prevention', 'financial', 'enterprise', 'critical',
 ARRAY['PCI_DSS', 'SOX', 'GLBA', 'SOC2', 'FFIEC'],
 '[
   {"id": "card_processing_security", "name": "Card Processing Security", "priority": "critical", "description": "PCI-DSS compliant card data processing environment"},
   {"id": "fraud_detection", "name": "Real-time Fraud Detection", "priority": "critical", "description": "AI-powered fraud detection and prevention"},
   {"id": "customer_data_protection", "name": "Customer Data Protection", "priority": "critical", "description": "Comprehensive customer PII protection"},
   {"id": "trading_floor_isolation", "name": "Trading Floor Network Isolation", "priority": "high", "description": "High-frequency trading network segmentation"}
 ]'::jsonb,
 '[
   {"id": "cardholder_data_encryption", "name": "Cardholder Data Encryption", "category": "security", "priority": "critical", "description": "End-to-end encryption of cardholder data"},
   {"id": "network_segmentation", "name": "PCI Network Segmentation", "category": "compliance", "priority": "critical", "description": "PCI-DSS compliant network segmentation"},
   {"id": "access_monitoring", "name": "Privileged Access Monitoring", "category": "security", "priority": "critical", "description": "Monitor and control privileged user access"}
 ]'::jsonb,
 '[
   {"id": "pci_penetration_test", "name": "PCI Penetration Testing", "priority": "critical", "description": "Annual PCI-DSS penetration testing"},
   {"id": "cardholder_data_flow_test", "name": "Cardholder Data Flow Test", "priority": "critical", "description": "Validate cardholder data handling"}
 ]'::jsonb,
 '[
   {"id": "smart_card_auth", "name": "Smart Card Authentication", "method": "certificate", "description": "PKI smart card authentication for staff"},
   {"id": "biometric_auth", "name": "Biometric Authentication", "method": "multi_factor", "description": "Biometric authentication for high-value transactions"}
 ]'::jsonb,
 '[
   {"vendor": "cisco", "role": "core", "models": ["nexus_9000", "ise"], "features": ["macsec", "trustsec", "pci_compliance"]},
   {"vendor": "juniper", "role": "edge", "models": ["ex_4000", "srx_series"], "features": ["junos_space", "sky_atp", "financial_templates"]}
 ]'::jsonb,
 '{
   "vlans": [
     {"id": 10, "name": "Trading_Floor", "subnet": "172.16.10.0/24", "description": "High-frequency trading systems"},
     {"id": 20, "name": "Card_Processing", "subnet": "172.16.20.0/24", "description": "PCI-DSS cardholder data environment"},
     {"id": 30, "name": "Customer_Services", "subnet": "172.16.30.0/24", "description": "Customer service and support systems"}
   ],
   "security_zones": ["cardholder_data", "trusted", "untrusted", "dmz"],
   "compliance_requirements": ["PCI_DSS_Level_1", "Annual_penetration_testing", "Quarterly_vulnerability_scanning", "Real_time_monitoring"]
 }'::jsonb,
 '{
   "phases": [
     {"name": "Compliance Assessment", "duration_weeks": 3, "deliverables": ["PCI gap analysis", "Risk assessment", "Remediation plan", "Security architecture"]},
     {"name": "Network Design", "duration_weeks": 4, "deliverables": ["Segmentation design", "Security controls", "Compliance mapping", "Integration planning"]},
     {"name": "Implementation", "duration_weeks": 8, "deliverables": ["Infrastructure deployment", "Security controls", "Monitoring systems", "Integration testing"]},
     {"name": "PCI Validation", "duration_weeks": 4, "deliverables": ["QSA assessment", "Penetration testing", "Compliance documentation", "Remediation"]},
     {"name": "Production", "duration_weeks": 2, "deliverables": ["Go-live", "Monitoring", "Ongoing compliance", "Staff training"]}
   ],
   "total_duration_weeks": 21,
   "key_milestones": ["PCI-DSS compliance validation", "Fraud detection implementation", "Trading floor isolation", "Continuous monitoring"]
 }'::jsonb);

-- Add major vendors with proper schema
INSERT INTO vendor_library (vendor_name, vendor_type, category, status, description, portnox_integration_level, support_level) VALUES
-- Network Infrastructure
('Cisco Systems', 'network_equipment', 'network_infrastructure', 'active', 
 'Leading network infrastructure provider with Catalyst switches, ISE authentication, TrustSec security, and DNA Center management platform',
 'native', 'tier_1'),
('Aruba Networks (HPE)', 'network_equipment', 'network_infrastructure', 'active',
 'Enterprise networking with ClearPass authentication, User-Based Tunneling, and AI-driven operations through Aruba Central',
 'native', 'tier_1'),
('Juniper Networks', 'network_equipment', 'network_infrastructure', 'active',
 'High-performance networking with Junos OS, Mist AI wireless, and comprehensive security through SRX series',
 'standard', 'tier_1'),
('Extreme Networks', 'network_equipment', 'network_infrastructure', 'active',
 'Cloud-managed networking with ExtremeCloud IQ, Fabric Connect technology, and universal hardware platform',
 'standard', 'tier_2'),

-- Security Infrastructure  
('Fortinet', 'security_appliance', 'security_infrastructure', 'active',
 'Unified security platform with FortiGate NGFW, FortiSwitch integration, and Security Fabric orchestration',
 'standard', 'tier_1'),
('Palo Alto Networks', 'security_appliance', 'security_infrastructure', 'active',
 'Next-generation security with PAN-OS, WildFire threat intelligence, and Prisma cloud-native security',
 'standard', 'tier_1'),
('Check Point', 'security_appliance', 'security_infrastructure', 'active',
 'Advanced threat prevention with Quantum Security Gateways, CloudGuard, and comprehensive threat intelligence',
 'standard', 'tier_1'),

-- Wireless Specialized
('Ruckus Networks', 'wireless_equipment', 'wireless_infrastructure', 'active',
 'Enterprise wireless with SmartZone controllers, BeamFlex antenna technology, and advanced RF optimization',
 'standard', 'tier_2'),
('Ubiquiti Networks', 'wireless_equipment', 'wireless_infrastructure', 'active',
 'Cost-effective networking with UniFi platform, cloud management, and simplified deployment for SMB',
 'basic', 'tier_3'),

-- Cloud and Virtualization
('VMware', 'software_platform', 'virtualization', 'active',
 'Virtualization and cloud infrastructure with NSX micro-segmentation, vSphere, and Workspace ONE',
 'standard', 'tier_1'),
('Meraki (Cisco)', 'cloud_managed', 'cloud_managed', 'active',
 'Cloud-managed networking with centralized dashboard, zero-touch provisioning, and simplified management',
 'native', 'tier_1'),

-- Emerging Technologies
('Mist Systems', 'ai_platform', 'ai_networking', 'active',
 'AI-driven networking with Marvis virtual assistant, machine learning insights, and predictive analytics',
 'standard', 'tier_1');

COMMIT;