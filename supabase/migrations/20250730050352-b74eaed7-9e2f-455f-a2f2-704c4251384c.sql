-- ========================================
-- Comprehensive Best Practices Library Population
-- 802.1X/NAC Implementation Knowledge Base
-- ========================================

-- Insert Pain Points
INSERT INTO pain_points_library (title, description, category, severity, recommended_solutions, industry_specific) VALUES
('Single Point of Failure in RADIUS Infrastructure', 'Organizations deploying only one RADIUS server create a critical single point of failure that can bring down entire network authentication.', 'infrastructure', 'critical', '["Deploy at least two Portnox RADIUS servers for redundancy", "Configure RADIUS server groups with failover", "Test failover scenarios regularly", "Configure critical authentication VLANs"]', '["healthcare", "finance", "government"]'),
('Weak RADIUS Shared Secrets', 'Using simple or default shared secrets between network devices and RADIUS servers creates security vulnerabilities.', 'security', 'high', '["Use strong shared secrets with minimum 20 characters", "Include mixed case, numbers, and symbols", "Rotate shared secrets regularly", "Use different secrets per device group"]', '["all"]'),
('Authentication Storms During Outages', 'Network devices continuously retrying authentication during RADIUS server outages can create authentication storms.', 'performance', 'high', '["Configure appropriate timeout values (5-10 seconds)", "Implement authentication rate limiting", "Use authentication critical recovery", "Configure quiet periods"]', '["enterprise", "education"]'),
('Insufficient Device Inventory Before 802.1X Deployment', 'Deploying 802.1X without proper device inventory leads to unexpected authentication failures and network disruptions.', 'planning', 'high', '["Start with monitor mode for 2-4 weeks", "Collect comprehensive device inventory", "Identify non-supplicant devices", "Plan MAB deployment strategy"]', '["all"]'),
('Improper VLAN Configuration for Dynamic Assignment', 'Missing VLANs on trunk ports or incorrect VLAN configurations prevent dynamic VLAN assignment from working properly.', 'configuration', 'medium', '["Configure all possible VLANs on trunk ports", "Test VLAN changes with CoA", "Document VLAN-to-role mappings", "Verify RADIUS tunnel attributes"]', '["enterprise", "education"]'),
('Certificate Lifecycle Management Gaps', 'Poor certificate management leads to authentication failures when certificates expire unexpectedly.', 'security', 'high', '["Use Portnox-generated certificates for EAP-TLS", "Configure certificate auto-enrollment", "Monitor certificate expiration", "Plan certificate lifecycle management"]', '["healthcare", "finance", "government"]'),
('Lack of Centralized Logging and Monitoring', 'Without proper logging and monitoring, troubleshooting authentication issues becomes extremely difficult.', 'operations', 'medium', '["Configure centralized logging", "Enable RADIUS accounting", "Monitor authentication failures", "Set up alerts for critical events"]', '["all"]'),
('Inadequate Testing Before Production Deployment', 'Insufficient testing leads to production issues and unexpected authentication failures.', 'testing', 'high', '["Implement pre-deployment testing procedures", "Test RADIUS connectivity and authentication", "Verify VLAN configurations", "Validate CoA functionality"]', '["all"]');

-- Insert Recommendations
INSERT INTO recommendations_library (title, description, category, priority, implementation_effort, expected_outcome, prerequisites, related_pain_points, portnox_features, industry_specific) VALUES
('Implement RADIUS Server Redundancy', 'Deploy at least two Portnox RADIUS servers in a high-availability configuration to eliminate single points of failure and ensure continuous authentication services.', 'infrastructure', 'critical', 'medium', 'Eliminates single point of failure, ensures 99.9% authentication availability, reduces network downtime risks', '["Network connectivity between RADIUS servers", "Load balancer or failover mechanism", "Synchronized configuration"]', '["Single Point of Failure in RADIUS Infrastructure"]', '["High Availability", "RADIUS Clustering", "Failover Configuration"]', '["healthcare", "finance", "government", "enterprise"]'),
('Establish Strong Shared Secret Standards', 'Implement and enforce strong shared secret policies with minimum 20-character complexity requirements across all network devices.', 'security', 'critical', 'low', 'Significantly reduces risk of RADIUS authentication compromise, improves overall network security posture', '["Access to all network device configurations", "Documentation of current shared secrets", "Change management process"]', '["Weak RADIUS Shared Secrets"]', '["RADIUS Authentication", "Security Policies", "Device Management"]', '["all"]'),
('Deploy Phased 802.1X Implementation Strategy', 'Implement a structured three-phase deployment approach: Monitor Mode, Low-Impact Mode, and Closed Mode to minimize disruption and ensure successful deployment.', 'deployment', 'high', 'high', 'Reduces deployment risks by 80%, ensures smooth transition, provides comprehensive device discovery', '["Complete network documentation", "Device inventory capability", "Testing procedures", "Rollback plans"]', '["Insufficient Device Inventory Before 802.1X Deployment"]', '["Monitor Mode", "Device Discovery", "Gradual Enforcement", "Risk Management"]', '["enterprise", "education", "healthcare"]'),
('Implement Certificate-Based Authentication (EAP-TLS)', 'Deploy EAP-TLS with Portnox-generated certificates for the highest level of authentication security and eliminate password-based vulnerabilities.', 'security', 'high', 'high', 'Eliminates password-based attacks, provides strongest authentication method, improves compliance posture', '["PKI infrastructure", "Certificate management system", "Device enrollment process", "User training"]', '["Certificate Lifecycle Management Gaps"]', '["EAP-TLS", "Certificate Management", "PKI Integration", "Auto-enrollment"]', '["finance", "government", "healthcare"]'),
('Configure Dynamic VLAN Assignment', 'Implement dynamic VLAN assignment using RADIUS attributes to automatically place authenticated devices in appropriate network segments based on their roles.', 'segmentation', 'high', 'medium', 'Automates network segmentation, reduces manual configuration, improves security posture through micro-segmentation', '["VLAN design and documentation", "RADIUS attribute configuration", "Trunk port configuration", "CoA testing"]', '["Improper VLAN Configuration for Dynamic Assignment"]', '["Dynamic VLAN Assignment", "RADIUS Attributes", "Network Segmentation", "CoA"]', '["enterprise", "healthcare", "education"]'),
('Establish Comprehensive Monitoring and Alerting', 'Deploy centralized logging, RADIUS accounting, and real-time alerting to proactively identify and resolve authentication issues.', 'monitoring', 'medium', 'medium', 'Reduces troubleshooting time by 75%, enables proactive issue resolution, improves network reliability', '["Centralized logging infrastructure", "SIEM integration", "Alert notification system", "Monitoring dashboard"]', '["Lack of Centralized Logging and Monitoring"]', '["Centralized Logging", "RADIUS Accounting", "Real-time Alerts", "Dashboard Analytics"]', '["all"]'),
('Optimize Authentication Timing Parameters', 'Configure optimal timing parameters (TX Period: 10-30s, Quiet Period: 10-30s, Server Timeout: 10-30s) to balance security and user experience.', 'performance', 'medium', 'low', 'Improves authentication speed by 40%, reduces authentication storms, enhances user experience', '["Current timing configuration audit", "Network latency measurements", "User experience baseline"]', '["Authentication Storms During Outages"]', '["Performance Optimization", "Timing Configuration", "User Experience"]', '["enterprise", "education"]'),
('Implement Multi-Vendor RADIUS Proxy', 'Deploy a centralized RADIUS proxy to manage authentication for multi-vendor environments and simplify RADIUS server management.', 'integration', 'medium', 'high', 'Simplifies multi-vendor management, provides centralized control, reduces configuration complexity', '["FreeRADIUS or equivalent proxy solution", "Network connectivity", "Vendor-specific attribute mapping"]', '["Multi-vendor configuration complexity"]', '["RADIUS Proxy", "Multi-vendor Support", "Centralized Management"]', '["enterprise", "service_provider"]');

-- Insert Project Templates
INSERT INTO project_templates (name, description, deployment_type, security_level, industry, compliance_frameworks, use_cases, requirements, timeline_template) VALUES
('Enterprise 802.1X Deployment', 'Comprehensive 802.1X deployment template for large enterprise environments with multiple vendors and complex security requirements.', 'greenfield', 'high', 'enterprise', '{"SOC2", "ISO27001"}', 
'[
  {"name": "Corporate Device Authentication", "priority": "high", "complexity": "medium"},
  {"name": "BYOD Support with MAB", "priority": "high", "complexity": "high"},
  {"name": "Guest Network Isolation", "priority": "medium", "complexity": "low"},
  {"name": "IoT Device Management", "priority": "medium", "complexity": "high"},
  {"name": "Dynamic VLAN Assignment", "priority": "high", "complexity": "medium"}
]',
'[
  {"category": "infrastructure", "requirement": "Redundant RADIUS servers", "priority": "critical"},
  {"category": "security", "requirement": "Strong shared secrets (20+ chars)", "priority": "critical"},
  {"category": "network", "requirement": "VLAN segmentation capability", "priority": "high"},
  {"category": "monitoring", "requirement": "Centralized logging infrastructure", "priority": "high"},
  {"category": "certificates", "requirement": "PKI infrastructure for EAP-TLS", "priority": "medium"}
]',
'{"total_duration": "16-20 weeks", "phases": [
  {"name": "Discovery & Planning", "duration": "2-3 weeks", "deliverables": ["Network audit", "Device inventory", "Risk assessment"]},
  {"name": "Infrastructure Setup", "duration": "2-3 weeks", "deliverables": ["RADIUS server deployment", "Monitoring setup", "Testing procedures"]},
  {"name": "Pilot Deployment", "duration": "3-4 weeks", "deliverables": ["Pilot site implementation", "User training", "Issue resolution"]},
  {"name": "Phased Rollout", "duration": "8-10 weeks", "deliverables": ["Site-by-site deployment", "Performance monitoring", "Documentation"]},
  {"name": "Optimization", "duration": "1-2 weeks", "deliverables": ["Performance tuning", "Final testing", "Handover"]}
]}'),

('Healthcare HIPAA-Compliant NAC', 'HIPAA-compliant Network Access Control deployment template for healthcare organizations with strict security and audit requirements.', 'brownfield', 'critical', 'healthcare', '{"HIPAA", "SOC2"}',
'[
  {"name": "Medical Device Authentication", "priority": "critical", "complexity": "high"},
  {"name": "Staff Workstation Control", "priority": "critical", "complexity": "medium"},
  {"name": "Patient Network Isolation", "priority": "high", "complexity": "medium"},
  {"name": "Audit Trail Generation", "priority": "critical", "complexity": "low"},
  {"name": "Emergency Access Procedures", "priority": "high", "complexity": "medium"}
]',
'[
  {"category": "compliance", "requirement": "HIPAA audit logging", "priority": "critical"},
  {"category": "security", "requirement": "Encryption in transit (TLS 1.2+)", "priority": "critical"},
  {"category": "access", "requirement": "Role-based network access", "priority": "critical"},
  {"category": "monitoring", "requirement": "Real-time security monitoring", "priority": "high"},
  {"category": "backup", "requirement": "Configuration backup and recovery", "priority": "high"}
]',
'{"total_duration": "20-24 weeks", "phases": [
  {"name": "Compliance Assessment", "duration": "3-4 weeks", "deliverables": ["HIPAA gap analysis", "Risk assessment", "Compliance plan"]},
  {"name": "Medical Device Inventory", "duration": "4-5 weeks", "deliverables": ["Device catalog", "Authentication requirements", "Segmentation design"]},
  {"name": "Secure Infrastructure", "duration": "4-5 weeks", "deliverables": ["Encrypted RADIUS deployment", "Audit logging setup", "Emergency procedures"]},
  {"name": "Controlled Deployment", "duration": "6-7 weeks", "deliverables": ["Department-by-department rollout", "Staff training", "Compliance validation"]},
  {"name": "Audit Preparation", "duration": "3-4 weeks", "deliverables": ["Documentation review", "Audit trail validation", "Compliance certification"]}
]}'),

('Financial Services PCI-DSS NAC', 'PCI-DSS compliant Network Access Control deployment for financial services with card data protection requirements.', 'brownfield', 'critical', 'finance', '{"PCI-DSS", "SOX", "SOC2"}',
'[
  {"name": "Cardholder Data Environment Protection", "priority": "critical", "complexity": "high"},
  {"name": "Administrative Access Control", "priority": "critical", "complexity": "medium"},
  {"name": "Network Segmentation Enforcement", "priority": "critical", "complexity": "high"},
  {"name": "Quarterly Compliance Reporting", "priority": "high", "complexity": "medium"},
  {"name": "Incident Response Integration", "priority": "high", "complexity": "medium"}
]',
'[
  {"category": "compliance", "requirement": "PCI-DSS requirement 8.1 (unique user IDs)", "priority": "critical"},
  {"category": "compliance", "requirement": "PCI-DSS requirement 10.2 (audit logs)", "priority": "critical"},
  {"category": "security", "requirement": "Strong cryptography (AES-256)", "priority": "critical"},
  {"category": "network", "requirement": "CDE network isolation", "priority": "critical"},
  {"category": "monitoring", "requirement": "24/7 security monitoring", "priority": "critical"}
]',
'{"total_duration": "18-22 weeks", "phases": [
  {"name": "PCI Scope Definition", "duration": "2-3 weeks", "deliverables": ["CDE identification", "Data flow mapping", "Compliance scope"]},
  {"name": "Security Architecture", "duration": "4-5 weeks", "deliverables": ["Network segmentation design", "Encryption implementation", "Access control matrix"]},
  {"name": "Compliance Infrastructure", "duration": "4-5 weeks", "deliverables": ["Audit logging", "Monitoring systems", "Incident response integration"]},
  {"name": "Controlled Implementation", "duration": "6-7 weeks", "deliverables": ["CDE protection", "Testing validation", "Compliance verification"]},
  {"name": "QSA Preparation", "duration": "2-3 weeks", "deliverables": ["Evidence collection", "Documentation review", "Audit readiness"]}
]}');

-- Insert Configuration Templates
INSERT INTO configuration_templates (name, description, category, configuration_type, vendor_id, template_content, template_variables, complexity_level, is_public, tags) VALUES
('Cisco IBNS 2.0 with Portnox RADIUS', 'Identity-Based Network Services 2.0 configuration template for Cisco switches with Portnox RADIUS integration and dynamic VLAN assignment.', 'authentication', 'switch_config', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Cisco' LIMIT 1),
'! ========================================
! Cisco IBNS 2.0 Configuration with Portnox
! Dynamic VLAN Assignment and Authentication
! ========================================

! Global Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! RADIUS Server Configuration
radius server PORTNOX-PRIMARY
 address ipv4 {{radius_primary_ip}} auth-port 1812 acct-port 1813
 timeout {{radius_timeout}}
 retransmit {{radius_retries}}
 key {{radius_shared_secret}}
 source-interface {{source_interface}}

radius server PORTNOX-SECONDARY
 address ipv4 {{radius_secondary_ip}} auth-port 1812 acct-port 1813
 timeout {{radius_timeout}}
 retransmit {{radius_retries}}
 key {{radius_shared_secret}}
 source-interface {{source_interface}}

! AAA Server Group
aaa group server radius PORTNOX-SERVERS
 server name PORTNOX-PRIMARY
 server name PORTNOX-SECONDARY
 deadtime {{dead_time}}
 ip radius source-interface {{source_interface}}

! Device Sensor for Profiling
device-sensor filter-list dhcp list DHCP-LIST
device-sensor filter-list dhcp list DHCP-LIST option name host-name
device-sensor filter-list dhcp list DHCP-LIST option name parameter-request-list
device-sensor filter-list lldp list LLDP-LIST
device-sensor filter-list lldp list LLDP-LIST tlv name system-name
device-sensor filter-list lldp list LLDP-LIST tlv name system-description
device-sensor filter-spec dhcp include list DHCP-LIST
device-sensor filter-spec lldp include list LLDP-LIST
device-sensor notify all-changes

! Authentication Templates
template PORTNOX-DOT1X-TEMPLATE
 dot1x pae authenticator
 dot1x timeout quiet-period {{quiet_period}}
 dot1x timeout tx-period {{tx_period}}
 dot1x timeout supp-timeout {{supp_timeout}}
 spanning-tree portfast
 switchport access vlan {{default_vlan}}
 switchport mode access
 mab
 access-session host-mode multi-host
 access-session control-direction in
 access-session port-control auto
 service-template CRITICAL-AUTH-TEMPLATE

template CRITICAL-AUTH-TEMPLATE
 description "Critical Authentication Template"
 vlan {{critical_vlan}}
 access-group {{critical_acl}}

! Pre-Authentication ACL
ip access-list extended ACL-PREAUTH-PORTNOX
 remark === Portnox Pre-Auth Access ===
 permit udp any any eq bootps
 permit udp any any eq bootpc
 permit udp any any eq domain
 permit tcp any any eq domain
 permit tcp any host {{radius_primary_ip}} eq 443
 permit tcp any host {{radius_secondary_ip}} eq 443
 permit icmp any any echo
 permit icmp any any echo-reply
 deny ip any any log

! Interface Configuration Template
interface range {{interface_range}}
 description PORTNOX 802.1X ENABLED
 source template PORTNOX-DOT1X-TEMPLATE
 access-group ACL-PREAUTH-PORTNOX in

! Monitor Mode Configuration (Phase 1)
interface range {{interface_range}}
 authentication event fail action next-method
 authentication event server dead action authorize vlan {{critical_vlan}}
 authentication event server alive action reinitialize
 authentication periodic
 authentication timer reauthenticate server

! VLAN Configuration
vlan {{employee_vlan}}
 name EMPLOYEES
vlan {{guest_vlan}}
 name GUESTS
vlan {{iot_vlan}}
 name IOT-DEVICES
vlan {{critical_vlan}}
 name CRITICAL-AUTH',
'{
  "radius_primary_ip": {"type": "ip", "required": true, "description": "Primary Portnox RADIUS server IP"},
  "radius_secondary_ip": {"type": "ip", "required": true, "description": "Secondary Portnox RADIUS server IP"},
  "radius_shared_secret": {"type": "password", "required": true, "description": "RADIUS shared secret (20+ characters)"},
  "radius_timeout": {"type": "integer", "default": 10, "description": "RADIUS timeout in seconds"},
  "radius_retries": {"type": "integer", "default": 3, "description": "RADIUS retry attempts"},
  "dead_time": {"type": "integer", "default": 10, "description": "Dead time in minutes"},
  "source_interface": {"type": "string", "required": true, "description": "Source interface for RADIUS communication"},
  "quiet_period": {"type": "integer", "default": 10, "description": "802.1X quiet period in seconds"},
  "tx_period": {"type": "integer", "default": 10, "description": "802.1X transmission period in seconds"},
  "supp_timeout": {"type": "integer", "default": 10, "description": "Supplicant timeout in seconds"},
  "interface_range": {"type": "string", "required": true, "description": "Interface range for 802.1X (e.g., GigabitEthernet1/0/1-48)"},
  "default_vlan": {"type": "integer", "default": 100, "description": "Default access VLAN"},
  "employee_vlan": {"type": "integer", "default": 100, "description": "Employee VLAN ID"},
  "guest_vlan": {"type": "integer", "default": 200, "description": "Guest VLAN ID"},
  "iot_vlan": {"type": "integer", "default": 300, "description": "IoT device VLAN ID"},
  "critical_vlan": {"type": "integer", "default": 999, "description": "Critical authentication VLAN"},
  "critical_acl": {"type": "string", "default": "ACL-PREAUTH-PORTNOX", "description": "Critical authentication ACL"}
}',
'advanced', true, '["cisco", "ibns", "802.1x", "dynamic-vlan", "portnox"]'),

('Aruba CX 802.1X with User-Based Tunneling', 'Aruba CX switch configuration template with Portnox RADIUS integration and User-Based Tunneling for micro-segmentation.', 'authentication', 'switch_config',
(SELECT id FROM vendor_library WHERE vendor_name = 'Aruba' LIMIT 1),
'# ========================================
# Aruba CX 802.1X Configuration with Portnox
# User-Based Tunneling and Dynamic Roles
# ========================================

# RADIUS Server Configuration
radius-server host {{radius_primary_ip}} key {{radius_shared_secret}} timeout {{radius_timeout}} retransmit {{radius_retries}}
radius-server host {{radius_secondary_ip}} key {{radius_shared_secret}} timeout {{radius_timeout}} retransmit {{radius_retries}}

# AAA Configuration
aaa authentication port-access eap-radius
aaa authentication port-access pap-radius
aaa authorization port-access auto
aaa accounting port-access start-stop radius

# Device Profile Configuration
device-profile name "WINDOWS-WORKSTATION"
    type windows-pc
device-profile name "MOBILE-DEVICE"
    type mobile
device-profile name "IOT-DEVICE"
    type iot

# User Role Configuration
user-role name "EMPLOYEE-ROLE"
    access-list ip "EMPLOYEE-ACL" in

user-role name "GUEST-ROLE"
    access-list ip "GUEST-ACL" in
    
user-role name "IOT-ROLE"
    access-list ip "IOT-ACL" in

# Access Control Lists
access-list ip "EMPLOYEE-ACL"
    10 permit any any any

access-list ip "GUEST-ACL"
    10 deny any {{internal_networks}} any
    20 permit any any any

access-list ip "IOT-ACL"
    10 permit any host {{iot_controller}} any
    20 permit udp any any eq domain
    30 permit udp any any eq ntp
    40 deny any any any

# Pre-Authentication ACL
access-list ip "PREAUTH-ACL"
    10 permit udp any any eq bootps
    20 permit udp any any eq domain
    30 permit tcp any host {{radius_primary_ip}} eq https
    40 permit tcp any host {{radius_secondary_ip}} eq https
    50 permit icmp any any
    60 deny any any any

# Port Access Configuration
port-access role "CRITICAL-ROLE"
    vlan access {{critical_vlan}}
    access-list ip "PREAUTH-ACL" in

# Interface Configuration Template
interface {{interface_range}}
    description "PORTNOX 802.1X ENABLED"
    port-access auth-mode
    port-access auth-order authenticator mab
    port-access authenticator
        tx-period {{tx_period}}
        max-requests {{max_requests}}
        quiet-period {{quiet_period}}
    port-access mac-auth
        addr-format multi-colon
        quiet-period {{mab_quiet_period}}
    port-access role "CRITICAL-ROLE"
    
# VLAN Configuration
vlan {{employee_vlan}}
    name "EMPLOYEES"
vlan {{guest_vlan}}
    name "GUESTS"
vlan {{iot_vlan}}
    name "IOT-DEVICES"
vlan {{critical_vlan}}
    name "CRITICAL-AUTH"

# User-Based Tunneling Configuration
port-access user-based-tunneling
    enable
    
# Captive Portal Configuration (if needed)
captive-portal
    interface vlan {{guest_vlan}}
    redirect-url {{portal_url}}',
'{
  "radius_primary_ip": {"type": "ip", "required": true, "description": "Primary Portnox RADIUS server IP"},
  "radius_secondary_ip": {"type": "ip", "required": true, "description": "Secondary Portnox RADIUS server IP"},
  "radius_shared_secret": {"type": "password", "required": true, "description": "RADIUS shared secret"},
  "radius_timeout": {"type": "integer", "default": 10, "description": "RADIUS timeout in seconds"},
  "radius_retries": {"type": "integer", "default": 3, "description": "RADIUS retry attempts"},
  "interface_range": {"type": "string", "required": true, "description": "Interface range for 802.1X"},
  "tx_period": {"type": "integer", "default": 10, "description": "Transmission period in seconds"},
  "max_requests": {"type": "integer", "default": 2, "description": "Maximum authentication requests"},
  "quiet_period": {"type": "integer", "default": 10, "description": "Quiet period in seconds"},
  "mab_quiet_period": {"type": "integer", "default": 10, "description": "MAB quiet period in seconds"},
  "employee_vlan": {"type": "integer", "default": 100, "description": "Employee VLAN ID"},
  "guest_vlan": {"type": "integer", "default": 200, "description": "Guest VLAN ID"},
  "iot_vlan": {"type": "integer", "default": 300, "description": "IoT VLAN ID"},
  "critical_vlan": {"type": "integer", "default": 999, "description": "Critical authentication VLAN"},
  "internal_networks": {"type": "string", "default": "10.0.0.0/8", "description": "Internal network ranges"},
  "iot_controller": {"type": "ip", "required": true, "description": "IoT controller IP address"},
  "portal_url": {"type": "url", "required": false, "description": "Captive portal URL"}
}',
'advanced', true, '["aruba", "cx", "802.1x", "ubt", "portnox"]');

-- Insert Use Cases
INSERT INTO use_case_library (name, description, category, complexity, business_value, technical_requirements, implementation_steps, success_criteria, portnox_features, compliance_impact, industry_applications, prerequisites, testing_requirements) VALUES
('Corporate Device Authentication with EAP-TLS', 'Secure authentication of corporate-managed devices using certificate-based EAP-TLS for highest security posture.', 'authentication', 'high', 'high', 
'["PKI infrastructure with certificate authority", "Portnox RADIUS servers with EAP-TLS support", "Certificate distribution mechanism", "Device enrollment process", "Network switches with 802.1X support"]',
'[
  {"step": 1, "description": "Deploy PKI infrastructure and certificate authority", "duration": "1-2 weeks"},
  {"step": 2, "description": "Configure Portnox for EAP-TLS with certificate validation", "duration": "3-5 days"},
  {"step": 3, "description": "Enroll corporate devices with certificates", "duration": "2-3 weeks"},
  {"step": 4, "description": "Configure network switches for 802.1X with certificate authentication", "duration": "1 week"},
  {"step": 5, "description": "Deploy in pilot environment and validate", "duration": "1 week"},
  {"step": 6, "description": "Roll out to production in phases", "duration": "4-6 weeks"}
]',
'["99.9% authentication success rate", "Zero password-based attacks", "Complete device inventory accuracy", "Sub-10 second authentication times", "Successful certificate lifecycle management"]',
'["EAP-TLS Authentication", "Certificate Management", "Device Profiling", "Dynamic VLAN Assignment", "Policy Enforcement"]',
'["Eliminates password-based authentication vulnerabilities", "Meets strongest authentication requirements", "Supports PCI-DSS requirement 8.1", "Enables non-repudiation"]',
'["enterprise", "finance", "government", "healthcare"]',
'["Active Directory or equivalent identity management", "Certificate authority infrastructure", "Automated device enrollment capability", "Network infrastructure with 802.1X support"]',
'["Certificate validation testing", "Authentication performance testing", "Failover scenario testing", "Certificate renewal testing", "Multi-vendor device compatibility testing"]'),

('BYOD with Dynamic Network Segmentation', 'Secure onboarding and segmentation of bring-your-own-device (BYOD) endpoints with appropriate network access controls.', 'byod', 'high', 'high',
'["Portnox NAC with device profiling", "Dynamic VLAN assignment capability", "Guest network infrastructure", "Device registration portal", "Network segmentation design"]',
'[
  {"step": 1, "description": "Design network segmentation strategy for BYOD", "duration": "1 week"},
  {"step": 2, "description": "Configure Portnox device profiling and classification", "duration": "3-5 days"},
  {"step": 3, "description": "Set up device registration portal and workflows", "duration": "1 week"},
  {"step": 4, "description": "Configure dynamic VLAN assignment based on device type", "duration": "1 week"},
  {"step": 5, "description": "Implement security policies for BYOD segments", "duration": "1 week"},
  {"step": 6, "description": "Deploy user training and support procedures", "duration": "1 week"}
]',
'["95% successful device onboarding rate", "Accurate device classification and profiling", "Appropriate network segmentation enforcement", "User satisfaction above 85%", "Zero unauthorized network access"]',
'["Device Discovery and Profiling", "Self-Service Portal", "Dynamic VLAN Assignment", "Policy Templates", "Guest Network Management"]',
'["Supports data protection requirements", "Enables controlled personal device access", "Maintains network security boundaries"]',
'["enterprise", "education", "healthcare"]',
'["BYOD policy definition", "Network infrastructure supporting VLANs", "User identity management system", "Help desk support procedures"]',
'["Device onboarding workflow testing", "Network segmentation validation", "Policy enforcement testing", "User experience testing", "Security boundary testing"]'),

('IoT Device Management and Micro-Segmentation', 'Comprehensive management and security of IoT devices through automated discovery, classification, and micro-segmentation.', 'iot', 'high', 'medium',
'["IoT device inventory and discovery", "Automated device profiling capabilities", "Micro-segmentation infrastructure", "IoT traffic analysis", "Policy enforcement mechanisms"]',
'[
  {"step": 1, "description": "Conduct comprehensive IoT device discovery", "duration": "2 weeks"},
  {"step": 2, "description": "Create device profiles and classification rules", "duration": "1 week"},
  {"step": 3, "description": "Design micro-segmentation architecture", "duration": "1 week"},
  {"step": 4, "description": "Configure automated policy assignment", "duration": "1 week"},
  {"step": 5, "description": "Implement monitoring and alerting", "duration": "3-5 days"},
  {"step": 6, "description": "Validate security controls and access restrictions", "duration": "1 week"}
]',
'["Complete IoT device visibility", "Automated device classification accuracy >95%", "Successful micro-segmentation implementation", "Reduced IoT security incidents by 90%", "Compliance with IoT security frameworks"]',
'["Device Discovery", "Automated Profiling", "Micro-Segmentation", "Policy Automation", "Behavioral Analysis"]',
'["Addresses IoT security requirements", "Supports industrial control system protection", "Enables compliance with IoT regulations"]',
'["manufacturing", "healthcare", "smart_buildings", "retail"]',
'["IoT device inventory", "Network infrastructure supporting micro-segmentation", "IoT traffic analysis capabilities", "Security policy framework"]',
'["Device discovery accuracy testing", "Classification validation", "Segmentation effectiveness testing", "Policy enforcement validation", "Incident response testing"]'),

('Guest Network with Captive Portal Authentication', 'Secure guest network access with captive portal authentication, terms acceptance, and appropriate network restrictions.', 'guest_access', 'medium', 'medium',
'["Captive portal infrastructure", "Guest network VLANs", "Internet-only access controls", "User registration system", "Terms and conditions management"]',
'[
  {"step": 1, "description": "Design guest network architecture", "duration": "3-5 days"},
  {"step": 2, "description": "Configure captive portal with branding", "duration": "1 week"},
  {"step": 3, "description": "Set up guest user registration and approval workflow", "duration": "1 week"},
  {"step": 4, "description": "Configure network access restrictions and policies", "duration": "3-5 days"},
  {"step": 5, "description": "Implement monitoring and reporting", "duration": "3-5 days"},
  {"step": 6, "description": "Deploy user support procedures", "duration": "2-3 days"}
]',
'["Seamless guest onboarding experience", "100% isolation from corporate network", "Compliance with terms and conditions", "Guest user activity logging", "Zero security incidents from guest access"]',
'["Captive Portal", "Guest Management", "Network Isolation", "Usage Tracking", "Policy Enforcement"]',
'["Protects corporate network from guest devices", "Enables visitor access without compromising security", "Provides audit trail for guest activities"]',
'["enterprise", "education", "hospitality", "retail"]',
'["Dedicated guest network infrastructure", "Internet connectivity for guests", "Captive portal hosting capability", "User registration workflow"]',
'["Guest onboarding process testing", "Network isolation validation", "Policy enforcement testing", "Portal functionality testing", "Compliance verification"]');

-- Insert Requirements
INSERT INTO requirements_library (title, category, priority, requirement_type, description, acceptance_criteria, verification_methods, compliance_frameworks, tags) VALUES
('RADIUS Server High Availability', 'infrastructure', 'critical', 'technical', 'Deploy redundant RADIUS servers with automatic failover capability to ensure continuous authentication services and eliminate single points of failure.', 
'["Minimum two RADIUS servers deployed", "Automatic failover within 30 seconds", "99.9% authentication service availability", "Load balancing across multiple servers", "Synchronized configuration between servers"]',
'["Failover testing procedures", "Load testing validation", "Availability monitoring", "Disaster recovery testing", "Performance benchmarking"]',
'{"SOC2", "ISO27001"}',
'{"infrastructure", "availability", "radius", "failover"}'),

('Strong RADIUS Shared Secret Policy', 'security', 'critical', 'security', 'Implement and enforce strong shared secret policies for all RADIUS communication to prevent unauthorized access and ensure authentication integrity.', 
'["Minimum 20 character shared secrets", "Mixed case, numbers, and special characters", "Unique secrets per device group", "Regular rotation schedule (quarterly)", "No default or weak passwords"]',
'["Password strength validation", "Audit log review", "Penetration testing", "Configuration review", "Compliance scanning"]',
'{"PCI-DSS", "HIPAA", "SOC2"}',
'{"security", "radius", "authentication", "password"}'),

('Certificate Lifecycle Management', 'security', 'high', 'security', 'Establish comprehensive certificate lifecycle management for EAP-TLS authentication including issuance, renewal, revocation, and monitoring.', 
'["Automated certificate enrollment", "90-day expiration monitoring", "Certificate revocation procedures", "Backup and recovery processes", "Certificate authority integration"]',
'["Certificate validation testing", "Expiration monitoring validation", "Revocation testing", "Recovery procedures testing", "Integration testing"]',
'{"PCI-DSS", "HIPAA", "SOC2"}',
'{"security", "certificates", "eap-tls", "pki"}'),

('Dynamic VLAN Assignment Capability', 'network', 'high', 'technical', 'Implement dynamic VLAN assignment using RADIUS attributes to automatically place authenticated devices in appropriate network segments based on their roles and policies.', 
'["RADIUS tunnel attribute support", "All VLANs available on trunk ports", "CoA (Change of Authorization) functionality", "VLAN-to-role mapping documentation", "Fallback VLAN configuration"]',
'["VLAN assignment testing", "CoA functionality validation", "Policy enforcement testing", "Network connectivity verification", "Documentation review"]',
'{"SOC2", "ISO27001"}',
'{"network", "vlan", "segmentation", "radius"}'),

('Comprehensive Authentication Logging', 'monitoring', 'high', 'operational', 'Deploy centralized logging and monitoring for all authentication events to support troubleshooting, compliance, and security incident response.', 
'["Centralized log collection", "Authentication event logging", "Real-time alerting for failures", "Log retention per compliance requirements", "SIEM integration capability"]',
'["Log collection validation", "Alert testing", "Retention verification", "SIEM integration testing", "Compliance audit support"]',
'{"PCI-DSS", "HIPAA", "SOC2", "GDPR"}',
'{"monitoring", "logging", "compliance", "siem"}'),

('Network Device 802.1X Support', 'infrastructure', 'critical', 'technical', 'Ensure all network infrastructure devices support IEEE 802.1X authentication standards and required features for NAC deployment.', 
'["IEEE 802.1X standard compliance", "Multiple EAP method support", "RADIUS client capability", "VLAN assignment support", "Port-based authentication"]',
'["Standards compliance verification", "Feature testing", "Vendor certification review", "Interoperability testing", "Performance validation"]',
'{"IEEE 802.1X"}',
'{"infrastructure", "802.1x", "standards", "compatibility"}'),

('Device Profiling and Classification', 'security', 'high', 'technical', 'Implement automated device profiling and classification capabilities to identify and categorize all network-connected devices for appropriate policy assignment.', 
'["Passive device fingerprinting", "Active probing capabilities", "Device type classification", "Operating system identification", "Application recognition"]',
'["Device identification accuracy testing", "Classification validation", "Policy assignment verification", "Performance impact assessment", "False positive analysis"]',
'{"SOC2", "ISO27001"}',
'{"security", "profiling", "classification", "policy"}'),

('Guest Network Isolation', 'security', 'high', 'security', 'Implement complete network isolation for guest users with internet-only access and no access to corporate resources or other guest devices.', 
'["Complete Layer 2 and Layer 3 isolation", "Internet-only access policy", "Inter-guest communication blocking", "Corporate network access denial", "Bandwidth limitations"]',
'["Network isolation testing", "Access control validation", "Inter-guest communication testing", "Corporate resource access testing", "Performance testing"]',
'{"SOC2", "ISO27001"}',
'{"security", "isolation", "guest", "access_control"}'),

('Performance and Scalability Requirements', 'performance', 'high', 'technical', 'Define and validate performance and scalability requirements for NAC deployment to support expected user and device loads.', 
'["Authentication response time under 10 seconds", "Support for concurrent users per requirements", "Network latency impact under 5ms", "CPU and memory utilization under 80%", "Throughput degradation under 5%"]',
'["Load testing procedures", "Performance monitoring", "Scalability validation", "Stress testing", "Capacity planning verification"]',
'{"SOC2", "ISO27001"}',
'{"performance", "scalability", "testing", "capacity"}'),

('Compliance Audit Trail Generation', 'compliance', 'critical', 'compliance', 'Generate comprehensive audit trails for all authentication and authorization events to support regulatory compliance and security investigations.', 
'["Complete event logging", "Tamper-evident log storage", "Long-term retention capability", "Audit report generation", "Non-repudiation support"]',
'["Audit trail completeness verification", "Log integrity validation", "Retention testing", "Report generation testing", "Compliance assessment"]',
'{"PCI-DSS", "HIPAA", "SOC2", "GDPR", "SOX"}',
'{"compliance", "audit", "logging", "retention"}');