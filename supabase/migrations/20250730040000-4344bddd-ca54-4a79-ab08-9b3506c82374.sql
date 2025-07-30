-- Add configuration templates for Dell Networking, Brocade, Huawei, Alcatel-Lucent Enterprise, Allied Telesis, and Ubiquiti

-- First, ensure vendors exist in vendor_library with correct support_level values
INSERT INTO vendor_library (vendor_name, category, vendor_type, support_level, description, created_at, updated_at) 
SELECT 'Dell Technologies', 'Enterprise', 'Infrastructure', 'supported', 'Enterprise networking solutions including switches, routers, and wireless systems', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM vendor_library WHERE vendor_name = 'Dell Technologies');

INSERT INTO vendor_library (vendor_name, category, vendor_type, support_level, description, created_at, updated_at) 
SELECT 'Huawei', 'Enterprise', 'Infrastructure', 'supported', 'Global provider of ICT infrastructure and smart devices', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM vendor_library WHERE vendor_name = 'Huawei');

INSERT INTO vendor_library (vendor_name, category, vendor_type, support_level, description, created_at, updated_at) 
SELECT 'Alcatel-Lucent Enterprise', 'Enterprise', 'Infrastructure', 'supported', 'Enterprise networking and communications solutions', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM vendor_library WHERE vendor_name = 'Alcatel-Lucent Enterprise');

INSERT INTO vendor_library (vendor_name, category, vendor_type, support_level, description, created_at, updated_at) 
SELECT 'Ubiquiti', 'Enterprise', 'Infrastructure', 'supported', 'Enterprise WiFi and networking equipment with centralized management', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM vendor_library WHERE vendor_name = 'Ubiquiti');

-- Add Dell EMC OS10 Configuration template
INSERT INTO configuration_templates (
    name,
    description,
    category,
    subcategory,
    configuration_type,
    complexity_level,
    template_content,
    template_variables,
    wizard_parameters,
    ai_optimization_rules,
    compatibility_matrix,
    best_practices,
    troubleshooting_guide,
    vendor_id,
    supported_scenarios,
    authentication_methods,
    required_features,
    network_requirements,
    security_features,
    validation_commands,
    tags,
    is_public,
    is_validated
) VALUES (
    'Dell EMC OS10 802.1X Identity-Based Network Security',
    'Complete 802.1X configuration for Dell EMC OS10 switches with Portnox integration, supporting dynamic VLAN assignment, MAC authentication bypass, and advanced security features',
    'Network Access Control',
    'Switch Configuration',
    'CLI Commands',
    'intermediate',
    '! ========================================
! Dell EMC OS10 Configuration for Portnox
! Platform: S4148/S5248/Z9264F
! OS10 Version: 10.5.4 or later
! ========================================

! Step 1: Configure Portnox RADIUS servers
radius-server host {{PORTNOX_PRIMARY_IP}} key 9 "{{PORTNOX_SHARED_SECRET}}" auth-port 1812 acct-port 1813
radius-server host {{PORTNOX_SECONDARY_IP}} key 9 "{{PORTNOX_SHARED_SECRET}}" auth-port 1812 acct-port 1813
radius-server retransmit 2
radius-server timeout 5
radius-server vrf management

! Step 2: Configure AAA
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting update periodic 1440

! Enable 802.1X globally
dot1x system-auth-control

! Step 3: Configure VLANs
interface vlan{{EMPLOYEE_VLAN}}
 description EMPLOYEE-DATA
 no shutdown
!
interface vlan{{GUEST_VLAN}}
 description GUEST
 no shutdown
!
interface vlan{{QUARANTINE_VLAN}}
 description QUARANTINE
 no shutdown
!
interface vlan{{VOICE_VLAN}}
 description VOICE
 no shutdown
!

! Step 4: Configure interface template for 802.1X
template ACCESS-TEMPLATE
 dot1x port-control auto
 dot1x host-mode multi-auth
 dot1x authentication periodic
 dot1x timeout quiet-period 30
 dot1x timeout re-authperiod 3600
 dot1x timeout server-timeout 30
 dot1x timeout supp-timeout 30
 dot1x timeout tx-period 30
 dot1x max-req 2
 dot1x authenticator
 spanning-tree port type edge
 spanning-tree bpduguard enable
 switchport mode access
 switchport access vlan {{DEFAULT_VLAN}}
 voice-vlan {{VOICE_VLAN}}
!

! Step 5: Configure MAC authentication template
template MAB-TEMPLATE
 mac auth-bypass enable
 mac auth-bypass auth-type eap-md5
 mac auth-bypass username-format {lowercase-mac-colon}
!

! Step 6: Configure critical authentication
authentication enable
authentication dynamic-vlan enable
authentication auth-fail max-attempts 3
authentication auth-fail vlan {{QUARANTINE_VLAN}}
authentication guest-vlan {{GUEST_VLAN}}
authentication guest-vlan-period 30

! Step 7: Apply templates to interfaces
interface ethernet 1/1/1-1/1/{{ACCESS_PORT_COUNT}}
 apply-template ACCESS-TEMPLATE
 apply-template MAB-TEMPLATE
 no shutdown
!

! Step 8: Configure CoA (Change of Authorization)
radius dynamic-authorization
 client {{PORTNOX_PRIMARY_IP}} server-key 9 "{{PORTNOX_SHARED_SECRET}}"
 client {{PORTNOX_SECONDARY_IP}} server-key 9 "{{PORTNOX_SHARED_SECRET}}"
 port 3799
!',
    '{
        "PORTNOX_PRIMARY_IP": {
            "type": "string",
            "default": "10.10.10.10",
            "description": "Primary Portnox RADIUS server IP address",
            "validation": "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
        },
        "PORTNOX_SECONDARY_IP": {
            "type": "string",
            "default": "10.10.10.11",
            "description": "Secondary Portnox RADIUS server IP address",
            "validation": "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
        },
        "PORTNOX_SHARED_SECRET": {
            "type": "password",
            "default": "MyPortnoxSharedSecret123!",
            "description": "RADIUS shared secret for Portnox servers",
            "validation": "^.{8,}$"
        },
        "EMPLOYEE_VLAN": {
            "type": "number",
            "default": 100,
            "description": "Employee data VLAN ID",
            "validation": "^[1-9][0-9]{0,2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
        },
        "GUEST_VLAN": {
            "type": "number",
            "default": 200,
            "description": "Guest VLAN ID",
            "validation": "^[1-9][0-9]{0,2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
        },
        "QUARANTINE_VLAN": {
            "type": "number",
            "default": 400,
            "description": "Quarantine VLAN ID",
            "validation": "^[1-9][0-9]{0,2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
        },
        "VOICE_VLAN": {
            "type": "number",
            "default": 500,
            "description": "Voice VLAN ID",
            "validation": "^[1-9][0-9]{0,2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
        },
        "DEFAULT_VLAN": {
            "type": "number",
            "default": 999,
            "description": "Default/native VLAN ID",
            "validation": "^[1-9][0-9]{0,2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
        },
        "ACCESS_PORT_COUNT": {
            "type": "number",
            "default": 48,
            "description": "Number of access ports to configure",
            "validation": "^[1-9][0-9]?$"
        }
    }',
    '{
        "steps": [
            {
                "id": "radius_config",
                "title": "RADIUS Server Configuration",
                "description": "Configure Portnox RADIUS servers",
                "fields": ["PORTNOX_PRIMARY_IP", "PORTNOX_SECONDARY_IP", "PORTNOX_SHARED_SECRET"]
            },
            {
                "id": "vlan_config",
                "title": "VLAN Configuration",
                "description": "Configure VLANs for segmentation",
                "fields": ["EMPLOYEE_VLAN", "GUEST_VLAN", "QUARANTINE_VLAN", "VOICE_VLAN", "DEFAULT_VLAN"]
            },
            {
                "id": "port_config",
                "title": "Port Configuration",
                "description": "Configure access ports",
                "fields": ["ACCESS_PORT_COUNT"]
            }
        ]
    }',
    '{
        "security_optimization": {
            "enable_bpdu_guard": true,
            "enable_dhcp_snooping": true,
            "enable_arp_inspection": true,
            "storm_control": true
        },
        "performance_optimization": {
            "radius_timeout": "5",
            "quiet_period": "30",
            "reauth_period": "3600"
        },
        "compliance_features": {
            "accounting": true,
            "coa_support": true,
            "mac_authentication": true
        }
    }',
    '{
        "dell_platforms": {
            "S4100-ON": {"min_version": "10.5.4", "max_ports": 48},
            "S5200-ON": {"min_version": "10.5.4", "max_ports": 48},
            "Z9264F-ON": {"min_version": "10.5.5", "max_ports": 64},
            "S3100": {"min_version": "10.5.2", "max_ports": 48}
        },
        "supported_features": [
            "802.1X authentication",
            "MAC authentication bypass",
            "Dynamic VLAN assignment",
            "Change of Authorization (CoA)",
            "Multi-authentication mode",
            "Guest VLAN",
            "Auth-fail VLAN"
        ]
    }',
    '[
        "Use templates for consistent port configuration",
        "Enable periodic reauthentication for security",
        "Configure guest VLAN for unauthorized devices",
        "Implement auth-fail VLAN for failed authentications",
        "Use multi-auth mode for IP phones and computers",
        "Enable CoA for dynamic policy changes",
        "Configure DHCP snooping and ARP inspection",
        "Use edge port configuration for access ports"
    ]',
    '[
        {
            "issue": "Authentication failures",
            "commands": ["show dot1x interface ethernet 1/1/1", "show authentication sessions", "debug dot1x all"],
            "solution": "Check RADIUS connectivity and shared secret"
        },
        {
            "issue": "RADIUS timeout",
            "commands": ["show radius-server", "ping {{PORTNOX_PRIMARY_IP}}", "show radius statistics"],
            "solution": "Verify network connectivity to RADIUS servers"
        },
        {
            "issue": "Dynamic VLAN not working",
            "commands": ["show authentication sessions interface ethernet 1/1/1 details", "debug radius all"],
            "solution": "Check RADIUS attributes and VLAN configuration"
        }
    ]',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Dell Technologies' LIMIT 1),
    '["802.1X EAP-TLS", "802.1X EAP-PEAP", "802.1X EAP-TTLS", "MAC Authentication"]',
    '["EAP-TLS", "EAP-PEAP", "EAP-TTLS", "MAC Authentication Bypass"]',
    '["RADIUS", "802.1X", "Dynamic VLAN", "CoA", "Multi-auth mode"]',
    '{
        "vlan_support": true,
        "radius_servers": 2,
        "coa_support": true,
        "guest_vlan": true,
        "voice_vlan": true
    }',
    '["spanning-tree bpduguard", "ip dhcp snooping", "arp inspection", "storm-control"]',
    '["show dot1x", "show authentication sessions", "show radius-server", "debug dot1x", "debug radius"]',
    '["dell", "os10", "802.1x", "radius", "portnox", "identity", "network-access-control"]',
    true,
    true
);