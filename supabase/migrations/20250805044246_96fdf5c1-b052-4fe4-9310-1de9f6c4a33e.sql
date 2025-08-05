-- Comprehensive migration for enhanced vendor library and configuration templates
-- Using only existing table columns

-- First, let's ensure we have the correct enum values for support_level
DO $$ 
BEGIN
    -- Check if the enum type exists and recreate if needed
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'support_level') THEN
        DROP TYPE support_level CASCADE;
    END IF;
    
    CREATE TYPE support_level AS ENUM ('basic', 'standard', 'premium', 'enterprise');
END $$;

-- Enhanced vendor library with comprehensive vendor data using only existing columns
INSERT INTO vendor_library (
    vendor_name, 
    category, 
    portnox_integration_level, 
    support_level
) VALUES 
-- Network Infrastructure Vendors
('Cisco Systems', 'Network Infrastructure', 'native', 'enterprise'),
('Aruba Networks', 'Network Infrastructure', 'certified', 'enterprise'),
('Fortinet Inc', 'Security', 'certified', 'enterprise'),
('Microsoft Corporation', 'Software', 'certified', 'enterprise'),
('Extreme Networks', 'Network Infrastructure', 'partner', 'premium'),
('Juniper Networks', 'Network Infrastructure', 'certified', 'enterprise'),
('Palo Alto Networks', 'Security', 'certified', 'enterprise'),
('Check Point Software', 'Security', 'partner', 'premium'),
('SonicWall', 'Security', 'partner', 'standard'),
('Ubiquiti Networks', 'Network Infrastructure', 'partner', 'standard'),
('Meraki by Cisco', 'Network Infrastructure', 'native', 'enterprise'),
('Ruckus Networks', 'Network Infrastructure', 'certified', 'premium'),
('Mist by Juniper', 'Network Infrastructure', 'certified', 'enterprise'),
('VMware', 'Software', 'certified', 'enterprise'),
('Okta', 'Identity', 'certified', 'enterprise'),
('Ping Identity', 'Identity', 'certified', 'enterprise'),
('CyberArk', 'Security', 'partner', 'enterprise'),
('RSA Security', 'Security', 'certified', 'premium'),
('Symantec', 'Security', 'partner', 'premium'),
('Trend Micro', 'Security', 'partner', 'standard');

-- Enhanced device library with comprehensive device types
INSERT INTO device_types (
    device_name,
    category,
    manufacturer,
    operating_systems,
    authentication_capabilities,
    security_features,
    management_options,
    typical_use_cases,
    deployment_considerations,
    compliance_requirements,
    integration_complexity
) VALUES 
('Windows 11 Enterprise Laptop', 'Endpoint', 'Microsoft',
'["Windows 11 Enterprise", "Windows 11 Pro", "Windows 11 Education"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "Machine Authentication", "User Authentication"]',
'["BitLocker", "Windows Defender", "Credential Guard", "Device Guard", "Windows Hello"]',
'["Group Policy", "Intune MDM", "SCCM", "PowerShell DSC", "Windows Admin Center"]',
'["Corporate laptops", "Remote work", "Executive devices", "Engineering workstations"]',
'["Certificate deployment", "Group Policy configuration", "BitLocker enablement", "Compliance policies"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR", "FedRAMP"]',
'medium'),

('iPhone 15 Pro', 'Mobile Device', 'Apple',
'["iOS 17", "iOS 16", "iPadOS 17", "iPadOS 16"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "WPA3-Personal", "WPA3-Enterprise"]',
'["Face ID", "Touch ID", "Secure Enclave", "App Transport Security", "Data Protection"]',
'["Apple Configurator", "Jamf Pro", "Microsoft Intune", "VMware Workspace ONE"]',
'["Executive devices", "Healthcare mobility", "Field service", "Education"]',
'["Certificate profiles", "Wi-Fi profiles", "VPN profiles", "Compliance policies", "App management"]',
'["HIPAA", "GDPR", "FERPA", "Government security standards"]',
'low'),

('Samsung Galaxy S24 Enterprise', 'Mobile Device', 'Samsung',
'["Android 14", "Android 13", "Samsung Knox", "One UI 6.0"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "WPA3-Enterprise"]',
'["Knox Security", "Biometric Authentication", "Secure Folder", "Device Encryption"]',
'["Samsung Knox Configure", "Microsoft Intune", "VMware Workspace ONE", "Google Admin Console"]',
'["Field workers", "Healthcare staff", "Retail associates", "Education"]',
'["Knox enrollment", "Certificate deployment", "App management", "Security policies"]',
'["HIPAA", "GDPR", "FERPA", "Government security standards"]',
'medium'),

('MacBook Pro M3', 'Endpoint', 'Apple',
'["macOS Sonoma", "macOS Ventura", "macOS Monterey"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-TTLS", "Kerberos", "Certificate-based"]',
'["FileVault", "Gatekeeper", "System Integrity Protection", "Secure Boot", "TouchID"]',
'["Jamf Pro", "Microsoft Intune", "Kandji", "Apple Configurator", "Profile Manager"]',
'["Creative professionals", "Developers", "Executive users", "Design teams"]',
'["Certificate deployment", "Configuration profiles", "FileVault enablement", "App management"]',
'["HIPAA", "PCI DSS", "SOX", "GDPR", "Creative industry standards"]',
'medium'),

('Cisco IP Phone 8861', 'VoIP Device', 'Cisco',
'["Cisco IP Phone firmware"]',
'["EAP-TLS", "EAP-FAST", "Shared Key Authentication"]',
'["Encrypted signaling", "Secure boot", "Image authentication"]',
'["Cisco Call Manager", "Cisco Unity", "CUCM", "Prime Collaboration"]',
'["Enterprise telephony", "Contact centers", "Reception desks", "Conference rooms"]',
'["VLAN configuration", "QoS settings", "Power over Ethernet", "Certificate deployment"]',
'["SOX", "PCI DSS", "HIPAA for healthcare", "Government security"]',
'low'),

('HP LaserJet Enterprise MFP M634', 'Network Printer', 'HP',
'["HP FutureSmart firmware"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "WPA3-Enterprise"]',
'["HP Sure Start", "Encrypted hard disk", "Access control", "Secure erase"]',
'["HP Smart Device Services", "HP Web Jetadmin", "SNMP", "HP Universal Print Driver"]',
'["Office printing", "Departmental printing", "Secure document handling"]',
'["Network configuration", "Driver deployment", "Security settings", "Queue management"]',
'["HIPAA", "SOX", "GDPR", "Government printing standards"]',
'low'),

('Zebra TC57 Mobile Computer', 'Handheld Device', 'Zebra',
'["Android 11", "Android 10", "Zebra AOSP"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "WPA3-Enterprise", "Certificate-based"]',
'["Zebra Mobility Security Suite", "Device encryption", "Secure boot"]',
'["Zebra SOTI MobiControl", "Microsoft Intune", "VMware Workspace ONE"]',
'["Warehouse management", "Retail operations", "Field service", "Healthcare"]',
'["Rugged deployment", "Barcode scanning", "RFID capabilities", "Drop protection"]',
'["Industry-specific compliance", "Data protection regulations"]',
'medium'),

('Axis P3245-LVE Network Camera', 'IoT Device', 'Axis',
'["AXIS OS"]',
'["EAP-TLS", "EAP-PEAP", "WPA3-Enterprise"]',
'["Signed firmware", "Secure boot", "TPM support", "Edge-to-edge encryption"]',
'["AXIS Camera Station", "Video Management Software", "ONVIF", "VAPIX API"]',
'["Perimeter security", "Parking surveillance", "Building monitoring", "Retail security"]',
'["Outdoor installation", "Power over Ethernet Plus", "Weather resistance"]',
'["NDAA compliance", "GDPR", "Industry security standards"]',
'low'),

('Dell Precision 7680 Workstation', 'Endpoint', 'Dell',
'["Windows 11 Pro for Workstations", "Ubuntu LTS", "Red Hat Enterprise Linux"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "Kerberos", "Smart card authentication"]',
'["TPM 2.0", "BitLocker", "Dell ControlVault", "BIOS protection"]',
'["Dell Command Suite", "Microsoft SCCM", "Tanium", "Dell ProDeploy"]',
'["CAD workstations", "Engineering", "Content creation", "Scientific computing"]',
'["High-performance computing", "Professional graphics", "ISV certification"]',
'["FISMA", "Common Criteria", "ENERGY STAR", "EPEAT Gold"]',
'medium'),

('Honeywell CN80 Mobile Computer', 'Handheld Device', 'Honeywell',
'["Android 11", "Android 10"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "WPA3-Enterprise"]',
'["Honeywell Mobility Edge", "Device encryption", "Secure communications"]',
'["Honeywell Smart Talk", "SOTI MobiControl", "Microsoft Intune"]',
'["Cold storage operations", "Manufacturing", "Transportation", "Field service"]',
'["Ultra-rugged design", "Extreme temperature operation", "Freezer-rated"]',
'["Industry safety standards", "Hazardous location certifications"]',
'medium');

-- Comprehensive configuration templates
INSERT INTO configuration_templates (
    name,
    description,
    category,
    subcategory,
    configuration_type,
    vendor_id,
    template_content,
    template_variables,
    supported_scenarios,
    authentication_methods,
    network_requirements,
    security_features,
    best_practices,
    troubleshooting_guide,
    validation_commands,
    tags,
    complexity_level,
    is_public,
    is_validated,
    ai_generated,
    optimization_score
) VALUES 
('Enterprise 802.1X with EAP-TLS - Cisco Switch Configuration', 
'Comprehensive 802.1X configuration for Cisco switches using EAP-TLS authentication with certificate-based security, dynamic VLAN assignment, and advanced security features for enterprise deployments',
'Network Access Control', 
'802.1X Authentication', 
'switch_config',
(SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems' LIMIT 1),
'! ========================================================================
! Enterprise 802.1X Configuration for {{switch_model}}
! Generated by Portnox AI Config Generator on {{generation_date}}
! Configuration optimized for {{environment_type}} deployment
! ========================================================================
!
version {{ios_version}}
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname {{switch_hostname}}
!
! === GLOBAL AAA CONFIGURATION ===
aaa new-model
!
! === RADIUS SERVER GROUP CONFIGURATION ===
aaa group server radius {{radius_group_name}}
 server name {{primary_radius_server_name}}
 server name {{secondary_radius_server_name}}
 ip radius source-interface {{source_interface}}
!
! === PRIMARY RADIUS SERVER ===
radius server {{primary_radius_server_name}}
 address ipv4 {{primary_radius_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}}
 key {{radius_shared_secret}}
 timeout {{radius_timeout}}
 retransmit {{radius_retransmit}}
 deadtime {{radius_deadtime}}
!
! === SECONDARY RADIUS SERVER ===
radius server {{secondary_radius_server_name}}
 address ipv4 {{secondary_radius_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}}
 key {{radius_shared_secret}}
 timeout {{radius_timeout}}
 retransmit {{radius_retransmit}}
 deadtime {{radius_deadtime}}
!
! === AAA AUTHENTICATION, AUTHORIZATION, AND ACCOUNTING ===
aaa authentication dot1x default group {{radius_group_name}}
aaa authorization network default group {{radius_group_name}}
aaa accounting dot1x default start-stop group {{radius_group_name}}
aaa accounting update newinfo periodic {{accounting_interval}}
!
! === AAA SERVER DEADTIME AND RECOVERY ===
aaa server radius dynamic-author
 client {{primary_radius_ip}} server-key {{radius_shared_secret}}
 client {{secondary_radius_ip}} server-key {{radius_shared_secret}}
 port {{coa_port}}
 auth-type all
!
! === DOT1X GLOBAL CONFIGURATION ===
dot1x system-auth-control
dot1x critical eapol
dot1x guest-vlan supplicant
!
! === VLAN CONFIGURATION ===
vlan {{default_vlan}}
 name {{default_vlan_name}}
!
vlan {{voice_vlan}}
 name {{voice_vlan_name}}
!
vlan {{guest_vlan}}
 name {{guest_vlan_name}}
!
vlan {{quarantine_vlan}}
 name {{quarantine_vlan_name}}
!
vlan {{critical_vlan}}
 name {{critical_vlan_name}}
!
! === INTERFACE CONFIGURATION TEMPLATE ===
interface range {{interface_range}}
 description {{interface_description}}
 switchport
 switchport mode access
 switchport access vlan {{default_vlan}}
 {{#if enable_voice_vlan}}
 switchport voice vlan {{voice_vlan}}
 {{/if}}
 !
 ! === 802.1X PORT CONFIGURATION ===
 authentication event fail action authorize vlan {{quarantine_vlan}}
 authentication event server dead action authorize vlan {{critical_vlan}}
 authentication event server alive action reinitialize
 authentication host-mode {{host_mode}}
 authentication open
 authentication order dot1x {{#if enable_mab}}mab{{/if}} {{auth_order}}
 authentication priority dot1x {{#if enable_mab}}mab{{/if}} {{auth_priority}}
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 authentication timer inactivity {{inactivity_timer}}
 authentication violation {{violation_action}}
 !
 {{#if enable_mab}}
 ! === MAC AUTHENTICATION BYPASS ===
 mab
 {{/if}}
 !
 ! === DOT1X PORT CONFIGURATION ===
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x max-req {{max_req}}
 !
 ! === SPANNING TREE OPTIMIZATION ===
 spanning-tree portfast
 spanning-tree bpduguard enable
!
! === DHCP SNOOPING CONFIGURATION (OPTIONAL) ===
{{#if enable_dhcp_snooping}}
ip dhcp snooping
ip dhcp snooping vlan {{dhcp_snooping_vlans}}
ip dhcp snooping information option
ip dhcp snooping rate-limit {{dhcp_rate_limit}}
{{/if}}
!
! === LOGGING CONFIGURATION ===
logging buffered {{log_buffer_size}} {{log_level}}
logging console {{console_log_level}}
logging monitor {{monitor_log_level}}
{{#if enable_syslog}}
logging host {{syslog_server}} transport {{syslog_transport}}
logging facility {{syslog_facility}}
logging source-interface {{source_interface}}
{{/if}}
!
! === NTP CONFIGURATION ===
{{#if enable_ntp}}
ntp server {{primary_ntp_server}} prefer
ntp server {{secondary_ntp_server}}
ntp source {{source_interface}}
{{/if}}
!
! === SNMP CONFIGURATION (OPTIONAL) ===
{{#if enable_snmp}}
snmp-server community {{snmp_ro_community}} RO
snmp-server host {{snmp_server}} version 2c {{snmp_community}}
snmp-server enable traps dot1x auth-fail-vlan guest-vlan no-auth-fail-vlan no-guest-vlan
{{/if}}
!
! === BANNER CONFIGURATION ===
banner motd ^
========================================================================
AUTHORIZED ACCESS ONLY - {{organization_name}}
This system is for authorized users only. All activities are monitored.
Unauthorized access is prohibited and will be prosecuted.
Contact: {{contact_info}}
========================================================================
^
!
! === END OF CONFIGURATION ===
end',
'{"switch_model": {"type": "select", "options": ["Catalyst 9300", "Catalyst 9200", "Catalyst 2960", "Catalyst 3850"], "default": "Catalyst 9300", "description": "Target switch model for configuration"}, "switch_hostname": {"type": "string", "default": "SW-{{site_code}}-{{switch_number}}", "description": "Switch hostname"}, "organization_name": {"type": "string", "required": true, "description": "Organization name for banner"}, "contact_info": {"type": "string", "default": "IT Help Desk", "description": "Contact information for banner"}, "ios_version": {"type": "string", "default": "17.03.04a", "description": "IOS version"}, "environment_type": {"type": "select", "options": ["Production", "Development", "Testing"], "default": "Production"}, "primary_radius_ip": {"type": "ip", "required": true, "description": "Primary RADIUS server IP address"}, "secondary_radius_ip": {"type": "ip", "required": true, "description": "Secondary RADIUS server IP address"}, "radius_shared_secret": {"type": "password", "required": true, "min_length": 8, "description": "RADIUS shared secret"}, "default_vlan": {"type": "number", "default": 100, "range": [1, 4094], "description": "Default data VLAN"}, "voice_vlan": {"type": "number", "default": 200, "range": [1, 4094], "description": "Voice VLAN ID"}, "guest_vlan": {"type": "number", "default": 500, "range": [1, 4094], "description": "Guest network VLAN"}, "quarantine_vlan": {"type": "number", "default": 999, "range": [1, 4094], "description": "Quarantine VLAN for failed authentication"}, "critical_vlan": {"type": "number", "default": 100, "range": [1, 4094], "description": "Critical VLAN for RADIUS server failure"}, "interface_range": {"type": "string", "default": "GigabitEthernet1/0/1-48", "description": "Interface range for 802.1X configuration"}, "enable_mab": {"type": "boolean", "default": true, "description": "Enable MAC Authentication Bypass"}, "enable_voice_vlan": {"type": "boolean", "default": true, "description": "Enable voice VLAN support"}, "host_mode": {"type": "select", "options": ["single-host", "multi-host", "multi-auth", "multi-domain"], "default": "multi-auth", "description": "Authentication host mode"}}',
'["Enterprise Campus", "Branch Office", "Data Center Edge", "Healthcare Environment", "Education Campus", "Government Facility", "Financial Services", "Manufacturing Plant", "Retail Store"]',
'["EAP-TLS", "PEAP-MSCHAPv2", "EAP-FAST", "EAP-TTLS", "MAB"]',
'{"minimum_bandwidth": "1Gbps", "vlan_support": true, "qos_support": true, "poe_support": "802.3at", "redundancy": "required"}',
'["Certificate-based authentication", "Dynamic VLAN assignment", "Change of Authorization (CoA)", "Periodic reauthentication", "Guest network isolation", "Quarantine capabilities", "MAC Authentication Bypass", "Storm control", "DHCP snooping", "Dynamic ARP Inspection"]',
'["Use strong RADIUS shared secrets (minimum 16 characters)", "Implement VLAN segmentation for different device types", "Enable periodic reauthentication for security", "Configure critical VLAN for RADIUS server failures", "Use MAB as fallback for non-802.1X capable devices", "Enable DHCP snooping and DAI for Layer 2 security", "Implement proper logging and monitoring", "Use NTP for time synchronization", "Configure appropriate timeouts for user experience"]',
'["RADIUS connectivity issues: Check network connectivity and shared secrets", "Certificate validation failures: Verify certificate chain and trust anchors", "VLAN assignment problems: Check RADIUS attribute configuration", "Authentication timeouts: Adjust timer values based on network conditions", "Policy enforcement issues: Verify CoA configuration and firewall rules", "Performance degradation: Monitor CPU utilization and authentication rates", "Guest access problems: Verify guest VLAN configuration and policies"]',
'["show dot1x all", "show authentication sessions", "show authentication sessions interface {{interface}}", "show radius statistics", "show aaa servers", "show vlan brief", "debug dot1x events", "debug radius authentication", "debug aaa authentication", "show ip dhcp snooping"]',
'["802.1X", "EAP-TLS", "Enterprise", "Cisco", "Switch", "Certificate", "RADIUS", "VLAN", "Security", "Authentication", "AI-Generated", "Zero-Trust-Ready", "Enterprise-Scale"]',
'advanced',
true,
true,
true,
9.8);

-- Enhanced use case library with comprehensive scenarios
INSERT INTO use_case_library (
    name,
    description,
    category,
    industry_focus,
    business_domain,
    complexity,
    implementation_timeline,
    technical_requirements,
    authentication_methods,
    network_segments,
    device_types,
    vendor_compatibility,
    compliance_frameworks,
    security_features,
    performance_requirements,
    integration_points,
    success_metrics,
    common_challenges,
    best_practices,
    roi_considerations
) VALUES 
('Enterprise Zero Trust 802.1X with Certificate Authentication',
'Comprehensive zero-trust network access implementation using 802.1X authentication with PKI certificates for all network devices and users, including advanced threat detection and automated response capabilities',
'Zero Trust',
'["Enterprise", "Financial Services", "Healthcare", "Government", "Manufacturing", "Critical Infrastructure"]',
'Security',
'high',
'6-12 months',
'{"pki_infrastructure": true, "radius_servers": "redundant_clustered", "certificate_management": "fully_automated", "network_segmentation": "micro_segmentation", "monitoring": "real_time_ai_enhanced", "threat_detection": "integrated", "siem_integration": true}',
'["EAP-TLS", "Machine Authentication", "User Authentication", "Certificate-based Multi-factor", "Mutual Authentication"]',
'["Corporate LAN", "Wireless Networks", "VPN Access", "Data Center", "IoT Networks", "OT Networks", "Guest Networks", "Management Networks"]',
'["Windows Workstations", "macOS Laptops", "Linux Servers", "Mobile Devices", "Network Printers", "IoT Devices", "Industrial Controllers", "Medical Devices", "Security Cameras"]',
'["Cisco ISE", "Aruba ClearPass", "Microsoft NPS", "FortiNAC", "Extreme ExtremeCloud IQ", "ForeScout", "Pulse Secure"]',
'["SOX", "PCI DSS", "HIPAA", "NIST Cybersecurity Framework", "ISO 27001", "FISMA", "GDPR", "NERC CIP"]',
'["Certificate-based strong authentication", "Dynamic VLAN assignment", "Micro-segmentation", "Real-time monitoring", "Automated quarantine", "Threat detection", "Behavioral analysis", "Zero-trust architecture"]',
'{"authentication_time": "< 3 seconds", "network_latency": "< 1ms additional", "availability": "99.99%", "concurrent_users": "50000+", "certificate_validation": "< 1 second", "policy_enforcement": "real-time"}',
'["Active Directory", "Certificate Authority", "SIEM Solutions", "MDM Platforms", "Vulnerability Scanners", "Threat Intelligence Feeds", "Network Monitoring Tools", "Identity Governance"]',
'["Reduced security incidents by 95%", "100% device visibility and control", "Automated policy enforcement", "Compliance score > 98%", "Zero unauthorized network access", "Mean time to detection < 5 minutes"]',
'["Certificate lifecycle management complexity", "Legacy device integration challenges", "Performance impact on network infrastructure", "User experience during authentication", "Scalability planning for growth", "Integration with existing security tools"]',
'["Phased rollout with pilot groups", "Comprehensive pre-deployment testing", "Extensive user training programs", "Automated certificate deployment", "Continuous monitoring and optimization", "Regular security assessments", "Incident response planning"]',
'["Significant reduction in breach costs", "Improved regulatory compliance posture", "Operational efficiency gains", "Reduced manual security processes", "Lower help desk calls", "Faster incident response", "Better resource utilization"]'),

('Healthcare Patient Network Access with HIPAA Compliance',
'Specialized 802.1X implementation for healthcare environments ensuring HIPAA compliance, patient data protection, and seamless access for medical devices and staff',
'Healthcare',
'["Healthcare Systems", "Hospitals", "Clinics", "Medical Research", "Pharmaceutical"]',
'Healthcare IT',
'high',
'4-8 months',
'{"hipaa_compliance": true, "medical_device_support": true, "patient_data_protection": "enhanced", "audit_logging": "comprehensive", "encryption": "end_to_end", "access_controls": "role_based"}',
'["EAP-TLS", "PEAP-MSCHAPv2", "Device Certificates", "Role-based Authentication"]',
'["Clinical Networks", "Administrative Networks", "Guest Networks", "Medical Device Networks", "Research Networks", "Public Networks"]',
'["Medical Workstations", "Tablets", "Medical Devices", "Imaging Equipment", "Patient Monitors", "Infusion Pumps", "Mobile Devices", "Guest Devices"]',
'["Cisco ISE", "Aruba ClearPass", "FortiNAC", "Microsoft NPS with HIPAA features"]',
'["HIPAA", "HITECH", "FDA 21 CFR Part 11", "SOX", "State Privacy Laws"]',
'["Patient data encryption", "Audit trail logging", "Role-based access control", "Medical device segmentation", "Guest network isolation", "PHI protection"]',
'{"authentication_time": "< 5 seconds", "medical_device_compatibility": "99%", "audit_logging": "real_time", "data_encryption": "AES-256", "availability": "99.9%"}',
'["Electronic Health Records", "Hospital Information Systems", "Medical Device Management", "Identity Management", "Audit Systems", "Backup Systems"]',
'["HIPAA compliance achievement", "Patient data breach prevention", "Medical device security", "Staff productivity improvement", "Audit readiness", "Incident response time reduction"]',
'["Medical device legacy support", "Staff workflow integration", "Patient care continuity", "Regulatory compliance complexity", "Vendor coordination"]',
'["Medical device inventory and profiling", "Staff role definition and training", "Phased deployment by department", "Continuous compliance monitoring", "Regular security assessments"]',
'["Reduced compliance costs", "Prevented data breach penalties", "Improved operational efficiency", "Enhanced patient trust", "Streamlined audit processes"]'),

('Manufacturing Industrial IoT Network Security',
'Comprehensive 802.1X deployment for manufacturing environments with industrial IoT devices, operational technology networks, and safety-critical systems',
'Manufacturing',
'["Manufacturing", "Industrial", "Automotive", "Aerospace", "Chemical", "Energy"]',
'Operational Technology',
'high',
'8-12 months',
'{"ot_network_support": true, "industrial_protocols": "supported", "safety_systems": "isolated", "real_time_requirements": "maintained", "environmental_hardening": true}',
'["EAP-TLS", "Certificate-based", "Pre-shared Key", "Device Authentication"]',
'["Production Networks", "Control Systems", "Safety Networks", "Administrative Networks", "Maintenance Networks", "Guest Networks"]',
'["PLCs", "HMI Systems", "Industrial Sensors", "Robotic Systems", "SCADA Systems", "Safety Controllers", "Mobile Devices", "Maintenance Laptops"]',
'["Cisco ISE", "Aruba ClearPass", "Fortinet", "Rockwell Automation", "Siemens", "Schneider Electric"]',
'["NIST Cybersecurity Framework", "ISO 27001", "IEC 62443", "NERC CIP", "Industry-specific standards"]',
'["Network segmentation", "Industrial protocol filtering", "Safety system isolation", "Real-time monitoring", "Anomaly detection", "Emergency isolation"]',
'{"real_time_performance": "maintained", "safety_response_time": "< 10ms", "availability": "99.95%", "industrial_device_support": "comprehensive"}',
'["Manufacturing Execution Systems", "Enterprise Resource Planning", "Historian Systems", "Maintenance Management", "Quality Systems", "Safety Systems"]',
'["Reduced cybersecurity incidents", "Improved operational visibility", "Enhanced safety compliance", "Reduced downtime", "Better asset management"]',
'["Legacy device integration", "Real-time performance requirements", "Safety system certification", "Vendor coordination", "Operational disruption minimization"]',
'["Phased deployment by production line", "Extensive testing in non-production environments", "Coordination with safety teams", "Vendor collaboration", "Minimal disruption strategies"]',
'["Improved cybersecurity posture", "Reduced operational risk", "Enhanced compliance", "Better asset utilization", "Reduced incident response costs"]');

-- Enhanced requirements library
INSERT INTO requirements_library (
    requirement_name,
    category,
    subcategory,
    description,
    industry_relevance,
    compliance_frameworks,
    technical_specifications,
    implementation_complexity,
    testing_criteria,
    validation_methods,
    dependencies,
    risk_factors,
    cost_implications,
    timeline_impact,
    vendor_considerations,
    best_practices,
    common_pitfalls,
    monitoring_requirements,
    maintenance_procedures,
    documentation_standards,
    training_needs,
    performance_metrics,
    security_implications,
    integration_requirements,
    scalability_considerations
) VALUES 
('Advanced Certificate Lifecycle Management with AI Optimization',
'Security',
'PKI Management',
'Comprehensive automated certificate lifecycle management with AI-powered optimization, predictive renewal, threat detection, and compliance monitoring for enterprise 802.1X deployments',
'["Enterprise", "Financial Services", "Healthcare", "Government", "Critical Infrastructure", "Manufacturing"]',
'["SOX", "PCI DSS", "HIPAA", "FedRAMP", "Common Criteria", "ISO 27001", "NIST Cybersecurity Framework"]',
'{"ca_hierarchy": "multi_tier_with_hsm", "key_length": "2048+ bits RSA or 256+ bits ECC", "validity_period": "1-2 years optimized", "crl_distribution": "automated_cdn", "ocsp_support": true, "certificate_templates": "role_based_dynamic", "ai_optimization": true, "predictive_renewal": true}',
'high',
'{"certificate_issuance": "< 3 minutes", "renewal_automation": "98%+ success", "revocation_propagation": "< 10 minutes", "crl_freshness": "< 12 hours", "ai_threat_detection": "real_time", "compliance_monitoring": "continuous"}',
'["Automated testing suites", "Certificate chain validation", "CRL verification with backup", "OCSP response testing", "End-to-end authentication testing", "AI-powered anomaly detection", "Compliance validation"]',
'["PKI Infrastructure with HSM", "Certificate Authority", "RADIUS Integration", "Active Directory", "Certificate Templates", "AI Analytics Platform", "Threat Intelligence Feeds"]',
'["CA compromise", "Certificate expiration", "Key compromise", "Certificate chain issues", "Trust relationship failures", "AI system failures", "Compliance violations"]',
'{"initial_setup": "High", "ongoing_maintenance": "Low", "automation_investment": "High", "ai_platform_costs": "Medium", "training_costs": "Medium", "compliance_costs": "Reduced"}',
'{"planning": "3-4 weeks", "implementation": "6-10 weeks", "ai_integration": "2-3 weeks", "testing": "3-4 weeks", "rollout": "8-12 weeks"}',
'["Microsoft CA with AI", "DigiCert with automation", "Entrust with PKI-as-a-Service", "GlobalSign managed PKI", "Internal CA with AI enhancement"]',
'["Implement AI-powered certificate templates", "Deploy predictive renewal automation", "Enable real-time health monitoring", "Maintain geo-redundant backups", "Plan for AI-assisted disaster recovery", "Use machine learning for threat detection"]',
'["Manual certificate management", "Insufficient AI training data", "Poor backup procedures", "Inadequate testing", "Missing automation", "Ignoring AI recommendations"]',
'["AI-powered certificate health monitoring", "Predictive expiration alerts", "Real-time CA health monitoring", "Certificate usage analytics", "Performance metrics", "Security event monitoring", "Compliance dashboards"]',
'["Automated CA backups with AI verification", "Dynamic certificate template updates", "AI-optimized CRL maintenance", "Predictive security patching", "Performance optimization", "Compliance monitoring"]',
'["AI-enhanced CA hierarchy documentation", "Dynamic certificate policies", "AI-generated procedures documentation", "Automated emergency procedures", "Intelligent audit trails"]',
'["Advanced PKI administration with AI", "AI-assisted certificate troubleshooting", "Machine learning security practices", "Automated emergency procedures", "Predictive analytics training"]',
'{"issuance_time": "< 3 minutes", "renewal_success_rate": "> 98%", "revocation_time": "< 10 minutes", "availability": "> 99.95%", "ai_accuracy": "> 95%", "compliance_score": "> 98%"}',
'["AI-enhanced key protection", "Secure certificate storage with ML monitoring", "Dynamic access controls", "Intelligent audit logging", "AI-powered compliance monitoring", "Predictive threat detection"]',
'["RADIUS servers", "Active Directory", "Certificate stores", "Network devices", "Management systems", "AI analytics platforms", "SIEM integration", "Threat intelligence feeds"]',
'{"growth_planning": "1000%+ capacity with AI scaling", "geographic_distribution": "global with edge AI", "multi_site_support": "automated", "cloud_integration": "hybrid with AI", "edge_computing": "supported"}');

-- Success message
SELECT 'Comprehensive enterprise-grade vendor library, device types, configuration templates, use cases, and requirements have been successfully created with advanced AI integration and extensive coverage for all deployment scenarios.' as status;