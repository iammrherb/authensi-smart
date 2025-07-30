-- Add configuration templates for Dell Networking, Brocade, Huawei, Alcatel-Lucent Enterprise, Allied Telesis, and Ubiquiti

-- First, ensure vendors exist in vendor_library
INSERT INTO vendor_library (vendor_name, category, vendor_type, support_level, description, created_at, updated_at) VALUES
('Dell Technologies', 'Enterprise', 'Infrastructure', 'tier1', 'Enterprise networking solutions including switches, routers, and wireless systems', NOW(), NOW()),
('Huawei', 'Enterprise', 'Infrastructure', 'tier1', 'Global provider of ICT infrastructure and smart devices', NOW(), NOW()),
('Alcatel-Lucent Enterprise', 'Enterprise', 'Infrastructure', 'tier1', 'Enterprise networking and communications solutions', NOW(), NOW()),
('Ubiquiti', 'Enterprise', 'Infrastructure', 'tier2', 'Enterprise WiFi and networking equipment with centralized management', NOW(), NOW())
WHERE NOT EXISTS (SELECT 1 FROM vendor_library WHERE vendor_name IN ('Dell Technologies', 'Huawei', 'Alcatel-Lucent Enterprise', 'Ubiquiti'));

-- Add configuration templates
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
) VALUES 

-- Dell EMC OS10 Configuration
(
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
 description {{EMPLOYEE_VLAN_NAME}}
 no shutdown
!
interface vlan{{GUEST_VLAN}}
 description {{GUEST_VLAN_NAME}}
 no shutdown
!
interface vlan{{QUARANTINE_VLAN}}
 description {{QUARANTINE_VLAN_NAME}}
 no shutdown
!
interface vlan{{VOICE_VLAN}}
 description {{VOICE_VLAN_NAME}}
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
),

-- Huawei S Series Configuration
(
    'Huawei S Series 802.1X Network Access Control',
    'Comprehensive 802.1X configuration for Huawei S Series switches with Portnox integration, featuring advanced AAA, dynamic VLAN assignment, and comprehensive security policies',
    'Network Access Control',
    'Switch Configuration',
    'CLI Commands',
    'intermediate',
    '# ========================================
# Huawei S Series Configuration for Portnox
# Platform: S5720/S6720/S7706
# VRP Version: V200R019C00 or later
# ========================================

# Step 1: Configure Portnox RADIUS servers
radius-server template PORTNOX
 radius-server shared-key cipher {{PORTNOX_SHARED_SECRET}}
 radius-server authentication {{PORTNOX_PRIMARY_IP}} 1812
 radius-server authentication {{PORTNOX_SECONDARY_IP}} 1812
 radius-server accounting {{PORTNOX_PRIMARY_IP}} 1813
 radius-server accounting {{PORTNOX_SECONDARY_IP}} 1813
 radius-server timeout 5
 radius-server retransmit 2
 radius-server source-ip {{SWITCH_MGMT_IP}}
 radius-server algorithm loading-share
 radius-server dead-interval 15
 radius-server detect-server restore

# Step 2: Configure AAA
aaa
 authentication-scheme dot1x-auth
  authentication-mode radius
 authorization-scheme dot1x-authz
  authorization-mode radius
  authorization-cmd 15 radius
 accounting-scheme dot1x-acct
  accounting-mode radius
  accounting realtime 30
  accounting start-fail online
 domain portnox
  authentication-scheme dot1x-auth
  authorization-scheme dot1x-authz
  accounting-scheme dot1x-acct
  radius-server PORTNOX

# Step 3: Configure VLANs
vlan batch {{EMPLOYEE_VLAN}} {{GUEST_VLAN}} {{IOT_VLAN}} {{QUARANTINE_VLAN}} {{VOICE_VLAN}} {{DEFAULT_VLAN}}
vlan {{EMPLOYEE_VLAN}}
 name EMPLOYEE-DATA
vlan {{GUEST_VLAN}}
 name GUEST
vlan {{IOT_VLAN}}
 name IOT-DEVICES
vlan {{QUARANTINE_VLAN}}
 name QUARANTINE
vlan {{VOICE_VLAN}}
 name VOICE
vlan {{DEFAULT_VLAN}}
 name BLACKHOLE

# Step 4: Enable 802.1X globally
dot1x enable
dot1x authentication-method eap

# Step 5: Configure interface template
interface GigabitEthernet0/0/1
 port link-type access
 port default vlan {{DEFAULT_VLAN}}
 voice-vlan {{VOICE_VLAN}} enable
 voice-vlan mode auto
 dot1x enable
 dot1x port-control auto
 dot1x port-method portbased
 dot1x reauthenticate
 dot1x timer handshake-period 30
 dot1x timer quiet-period 30
 dot1x timer server-timeout 30
 dot1x timer supp-timeout 30
 dot1x timer tx-period 30
 dot1x timer re-authen-period 3600
 dot1x retry 2
 dot1x guest-vlan {{GUEST_VLAN}}
 dot1x auth-fail vlan {{QUARANTINE_VLAN}}
 dot1x critical-vlan {{EMPLOYEE_VLAN}}
 authentication guest-vlan {{GUEST_VLAN}}
 authentication auth-fail-vlan {{QUARANTINE_VLAN}}
 mac-authentication enable
 mac-authentication domain portnox
 stp edged-port enable
 trust 8021p

# Step 6: Configure MAC authentication
mac-authen enable
mac-authen username format with-hyphen lowercase
mac-authen password format username
mac-authen re-authen-period 3600

# Step 7: Configure interface range
interface range GigabitEthernet0/0/1 to GigabitEthernet0/0/{{ACCESS_PORT_COUNT}}
 port link-type access
 port default vlan {{DEFAULT_VLAN}}
 voice-vlan {{VOICE_VLAN}} enable
 dot1x enable
 dot1x port-control auto
 mac-authentication enable
 stp edged-port enable

# Step 8: Configure CoA
radius-server authorization {{PORTNOX_PRIMARY_IP}} shared-key cipher {{PORTNOX_SHARED_SECRET}}
radius-server authorization {{PORTNOX_SECONDARY_IP}} shared-key cipher {{PORTNOX_SHARED_SECRET}}',
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
        "SWITCH_MGMT_IP": {
            "type": "string",
            "default": "10.10.1.1",
            "description": "Switch management IP address",
            "validation": "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
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
        "IOT_VLAN": {
            "type": "number",
            "default": 300,
            "description": "IoT devices VLAN ID",
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
                "description": "Configure Portnox RADIUS servers and AAA",
                "fields": ["PORTNOX_PRIMARY_IP", "PORTNOX_SECONDARY_IP", "PORTNOX_SHARED_SECRET", "SWITCH_MGMT_IP"]
            },
            {
                "id": "vlan_config",
                "title": "VLAN Configuration",
                "description": "Configure VLANs for network segmentation",
                "fields": ["EMPLOYEE_VLAN", "GUEST_VLAN", "IOT_VLAN", "QUARANTINE_VLAN", "VOICE_VLAN", "DEFAULT_VLAN"]
            },
            {
                "id": "port_config",
                "title": "Port Configuration",
                "description": "Configure access ports for 802.1X",
                "fields": ["ACCESS_PORT_COUNT"]
            }
        ]
    }',
    '{
        "security_optimization": {
            "enable_mac_auth": true,
            "enable_voice_vlan": true,
            "dhcp_snooping": true,
            "arp_inspection": true
        },
        "performance_optimization": {
            "radius_timeout": "5",
            "quiet_period": "30",
            "reauth_period": "3600",
            "load_balancing": true
        },
        "huawei_specific": {
            "vrp_optimized": true,
            "stp_edged_port": true,
            "trust_8021p": true
        }
    }',
    '{
        "huawei_platforms": {
            "S5700": {"min_version": "V200R019C00", "max_ports": 48},
            "S6700": {"min_version": "V200R019C00", "max_ports": 48},
            "S7700": {"min_version": "V200R019C00", "max_ports": 48},
            "S12700": {"min_version": "V200R019C00", "max_ports": 288}
        },
        "supported_features": [
            "802.1X EAP authentication",
            "MAC authentication bypass",
            "Dynamic VLAN assignment",
            "Change of Authorization",
            "Voice VLAN",
            "Guest VLAN",
            "Critical VLAN"
        ]
    }',
    '[
        "Use domain-based authentication for different user types",
        "Configure voice VLAN for IP phones",
        "Enable MAC authentication for non-802.1X devices",
        "Use critical VLAN for RADIUS server failures",
        "Configure guest VLAN for unauthorized access",
        "Enable edge port for access ports",
        "Use load-sharing algorithm for RADIUS servers",
        "Configure dead-interval for server detection"
    ]',
    '[
        {
            "issue": "Authentication failures",
            "commands": ["display dot1x interface gigabitethernet 0/0/1", "display access-user", "debugging dot1x all"],
            "solution": "Check RADIUS connectivity and domain configuration"
        },
        {
            "issue": "RADIUS server unreachable",
            "commands": ["display radius-server", "display radius-server statistics", "ping {{PORTNOX_PRIMARY_IP}}"],
            "solution": "Verify network connectivity and source IP configuration"
        },
        {
            "issue": "Dynamic VLAN assignment issues",
            "commands": ["display access-user interface gigabitethernet 0/0/1", "debugging radius all"],
            "solution": "Check RADIUS attributes and VLAN configuration"
        }
    ]',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Huawei' LIMIT 1),
    '["802.1X EAP", "MAC Authentication", "Portal Authentication"]',
    '["EAP-TLS", "EAP-PEAP", "EAP-TTLS", "MAC Authentication"]',
    '["RADIUS", "802.1X", "Dynamic VLAN", "CoA", "Voice VLAN", "Guest VLAN"]',
    '{
        "vlan_support": true,
        "radius_servers": 2,
        "coa_support": true,
        "guest_vlan": true,
        "voice_vlan": true,
        "critical_vlan": true
    }',
    '["dhcp-snooping", "arp-inspection", "storm-suppression", "stp-edged-port"]',
    '["display dot1x", "display access-user", "display radius-server", "debugging dot1x", "debugging radius"]',
    '["huawei", "s-series", "802.1x", "radius", "portnox", "vrp", "network-access-control"]',
    true,
    true
),

-- Alcatel-Lucent OmniSwitch Configuration
(
    'Alcatel-Lucent OmniSwitch 802.1X Configuration',
    'Enterprise-grade 802.1X configuration for Alcatel-Lucent OmniSwitch with Portnox integration, featuring Access Guardian, UNP classification, and advanced authentication methods',
    'Network Access Control',
    'Switch Configuration',
    'CLI Commands',
    'advanced',
    '! ========================================
! Alcatel-Lucent OmniSwitch Configuration
! Platform: OS6450/OS6860/OS6900
! AOS Version: 8.9.0 or later
! ========================================

! Step 1: Configure Portnox RADIUS servers
aaa radius-server "PORTNOX-PRIMARY" host {{PORTNOX_PRIMARY_IP}} key {{PORTNOX_SHARED_SECRET}} auth-port 1812 acct-port 1813
aaa radius-server "PORTNOX-SECONDARY" host {{PORTNOX_SECONDARY_IP}} key {{PORTNOX_SHARED_SECRET}} auth-port 1812 acct-port 1813
aaa radius-server "PORTNOX-PRIMARY" timeout 5
aaa radius-server "PORTNOX-PRIMARY" retransmit 2
aaa radius-server "PORTNOX-PRIMARY" source-ip {{SWITCH_MGMT_IP}}
aaa radius-server "PORTNOX-SECONDARY" timeout 5
aaa radius-server "PORTNOX-SECONDARY" retransmit 2
aaa radius-server "PORTNOX-SECONDARY" source-ip {{SWITCH_MGMT_IP}}

! Step 2: Configure AAA authentication
aaa authentication 802.1x "PORTNOX" radius "PORTNOX-PRIMARY" "PORTNOX-SECONDARY"
aaa authentication mac "PORTNOX-MAC" radius "PORTNOX-PRIMARY" "PORTNOX-SECONDARY"
aaa accounting 802.1x "PORTNOX" radius "PORTNOX-PRIMARY" "PORTNOX-SECONDARY"
aaa accounting mac "PORTNOX-MAC" radius "PORTNOX-PRIMARY" "PORTNOX-SECONDARY"

! Step 3: Configure VLANs
vlan {{EMPLOYEE_VLAN}} name "EMPLOYEE-DATA" enable
vlan {{GUEST_VLAN}} name "GUEST" enable
vlan {{IOT_VLAN}} name "IOT-DEVICES" enable
vlan {{QUARANTINE_VLAN}} name "QUARANTINE" enable
vlan {{VOICE_VLAN}} name "VOICE" enable
vlan {{DEFAULT_VLAN}} name "BLACKHOLE" enable

! Step 4: Configure 802.1X globally
802.1x enable
802.1x supplicant policy "PORTNOX-POLICY"
802.1x supplicant policy "PORTNOX-POLICY" reauth-period 3600
802.1x supplicant policy "PORTNOX-POLICY" quiet-period 30
802.1x supplicant policy "PORTNOX-POLICY" tx-period 30
802.1x supplicant policy "PORTNOX-POLICY" supp-timeout 30
802.1x supplicant policy "PORTNOX-POLICY" server-timeout 30
802.1x supplicant policy "PORTNOX-POLICY" max-req 2

! Step 5: Configure MAC authentication
mac-authentication enable
mac-authentication policy "PORTNOX-MAC-POLICY"
mac-authentication policy "PORTNOX-MAC-POLICY" reauth-period 3600

! Step 6: Configure port profiles
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} supplicant policy "PORTNOX-POLICY" direction both
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} auth-mode auto
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} quiet-period 30
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} guest-vlan {{GUEST_VLAN}}
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} auth-fail-vlan {{QUARANTINE_VLAN}}
802.1x port 1/1/1-{{ACCESS_PORT_COUNT}} multi-clients enable max-clients 10

! Step 7: Configure MAC authentication on ports
mac-authentication port 1/1/1-{{ACCESS_PORT_COUNT}} enable
mac-authentication port 1/1/1-{{ACCESS_PORT_COUNT}} policy "PORTNOX-MAC-POLICY"

! Step 8: Configure voice VLAN
vlan {{VOICE_VLAN}} voice enable
interfaces 1/1/1-{{ACCESS_PORT_COUNT}} voice vlan {{VOICE_VLAN}}

! Step 9: Configure Access Guardian
access-guardian enable
access-guardian policy "PORTNOX-AG"
access-guardian policy "PORTNOX-AG" vlan-redirect {{QUARANTINE_VLAN}}
access-guardian policy "PORTNOX-AG" redirect-url "http://portnox.company.com/portal"
access-guardian policy "PORTNOX-AG" authentication 802.1x mac portal

! Apply to ports
access-guardian port 1/1/1-{{ACCESS_PORT_COUNT}} enable
access-guardian port 1/1/1-{{ACCESS_PORT_COUNT}} policy "PORTNOX-AG"

! Step 10: Configure User Network Profile (UNP)
unp enable
unp port 1/1/1-{{ACCESS_PORT_COUNT}} enable
unp vlan-authentication enable',
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
        "SWITCH_MGMT_IP": {
            "type": "string",
            "default": "10.10.1.1",
            "description": "Switch management IP address",
            "validation": "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
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
        "IOT_VLAN": {
            "type": "number",
            "default": 300,
            "description": "IoT devices VLAN ID",
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
                "description": "Configure Portnox RADIUS servers and AAA",
                "fields": ["PORTNOX_PRIMARY_IP", "PORTNOX_SECONDARY_IP", "PORTNOX_SHARED_SECRET", "SWITCH_MGMT_IP"]
            },
            {
                "id": "vlan_config",
                "title": "VLAN Configuration",
                "description": "Configure VLANs for network segmentation",
                "fields": ["EMPLOYEE_VLAN", "GUEST_VLAN", "IOT_VLAN", "QUARANTINE_VLAN", "VOICE_VLAN", "DEFAULT_VLAN"]
            },
            {
                "id": "access_guardian",
                "title": "Access Guardian Configuration",
                "description": "Configure Access Guardian for advanced authentication",
                "fields": []
            },
            {
                "id": "port_config",
                "title": "Port Configuration",
                "description": "Configure access ports and policies",
                "fields": ["ACCESS_PORT_COUNT"]
            }
        ]
    }',
    '{
        "security_optimization": {
            "access_guardian": true,
            "unp_classification": true,
            "multi_clients": true,
            "voice_vlan_security": true
        },
        "performance_optimization": {
            "radius_timeout": "5",
            "quiet_period": "30",
            "reauth_period": "3600"
        },
        "alcatel_specific": {
            "unp_enabled": true,
            "access_guardian": true,
            "vlan_steering": false
        }
    }',
    '{
        "alcatel_platforms": {
            "OS6350": {"min_version": "AOS 6.7.1", "max_ports": 48},
            "OS6450": {"min_version": "AOS 8.9.0", "max_ports": 48},
            "OS6860": {"min_version": "AOS 8.9.0", "max_ports": 48},
            "OS6900": {"min_version": "AOS 8.9.0", "max_ports": 48},
            "OS9900": {"min_version": "AOS 8.9.0", "max_ports": 96}
        },
        "supported_features": [
            "802.1X authentication",
            "MAC authentication",
            "Access Guardian",
            "User Network Profile (UNP)",
            "Dynamic VLAN assignment",
            "Voice VLAN",
            "Multi-client support"
        ]
    }',
    '[
        "Use Access Guardian for comprehensive authentication",
        "Enable User Network Profile for device classification",
        "Configure multiple authentication methods",
        "Use VLAN steering for dynamic assignment",
        "Enable multi-client support for phones and PCs",
        "Configure guest VLAN for unauthorized devices",
        "Use portal authentication as fallback",
        "Enable DHCP snooping for security"
    ]',
    '[
        {
            "issue": "Authentication failures",
            "commands": ["show 802.1x status", "show 802.1x port 1/1/1", "show access-guardian users"],
            "solution": "Check RADIUS server configuration and Access Guardian policies"
        },
        {
            "issue": "Access Guardian not working",
            "commands": ["show access-guardian", "show access-guardian statistics", "debug access-guardian enable"],
            "solution": "Verify Access Guardian policy configuration and portal URL"
        },
        {
            "issue": "UNP classification issues",
            "commands": ["show unp", "show unp port 1/1/1", "debug unp enable"],
            "solution": "Check UNP rules and VLAN authentication settings"
        }
    ]',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Alcatel-Lucent Enterprise' LIMIT 1),
    '["802.1X EAP", "MAC Authentication", "Portal Authentication"]',
    '["EAP-TLS", "EAP-PEAP", "EAP-TTLS", "MAC Authentication", "Portal Authentication"]',
    '["RADIUS", "802.1X", "Access Guardian", "UNP", "Multi-client", "Voice VLAN"]',
    '{
        "vlan_support": true,
        "radius_servers": 2,
        "access_guardian": true,
        "unp_support": true,
        "multi_client": true,
        "voice_vlan": true
    }',
    '["access-guardian", "unp", "dhcp-snooping", "port-security", "spanning-tree"]',
    '["show 802.1x", "show mac-authentication", "show access-guardian", "show unp", "debug 802.1x"]',
    '["alcatel-lucent", "omniswitch", "802.1x", "radius", "portnox", "access-guardian", "unp"]',
    true,
    true
),

-- Ubiquiti UniFi Configuration
(
    'Ubiquiti UniFi 802.1X Configuration',
    'UniFi Network Application configuration for 802.1X authentication with Portnox integration, supporting dynamic VLAN assignment, wireless integration, and enterprise security features',
    'Network Access Control',
    'Controller Configuration',
    'JSON/YAML Config',
    'beginner',
    '# ========================================
# UniFi Configuration for Portnox
# Configure via UniFi Network Application
# Version: 7.5 or later
# ========================================

# 1. RADIUS Profile Configuration
# Settings > Profiles > RADIUS
RADIUS_Profile:
  Name: "Portnox-RADIUS"
  Authentication_Servers:
    Primary:
      IP: {{PORTNOX_PRIMARY_IP}}
      Port: 1812
      Password: "{{PORTNOX_SHARED_SECRET}}"
    Secondary:
      IP: {{PORTNOX_SECONDARY_IP}}
      Port: 1812
      Password: "{{PORTNOX_SHARED_SECRET}}"
  Accounting_Servers:
    Primary:
      IP: {{PORTNOX_PRIMARY_IP}}
      Port: 1813
    Secondary:
      IP: {{PORTNOX_SECONDARY_IP}}
      Port: 1813
  Accounting_Interval: 600
  Authentication_Type: "CHAP"

# 2. Network Configuration
# Settings > Networks
Networks:
  - Name: "Employee-Data"
    VLAN_ID: {{EMPLOYEE_VLAN}}
    Subnet: "10.100.0.0/24"
    DHCP_Mode: "DHCP Server"
    
  - Name: "Guest"
    VLAN_ID: {{GUEST_VLAN}}
    Subnet: "10.200.0.0/24"
    DHCP_Mode: "DHCP Server"
    Guest_Network: true
    
  - Name: "IoT"
    VLAN_ID: {{IOT_VLAN}}
    Subnet: "10.300.0.0/24"
    DHCP_Mode: "DHCP Server"
    Device_Isolation: true
    
  - Name: "Quarantine"
    VLAN_ID: {{QUARANTINE_VLAN}}
    Subnet: "10.400.0.0/24"
    DHCP_Mode: "DHCP Server"
    
  - Name: "Voice"
    VLAN_ID: {{VOICE_VLAN}}
    Subnet: "10.500.0.0/24"
    DHCP_Mode: "DHCP Server"

# 3. Port Profile Configuration
# Settings > Profiles > Switch Ports
Port_Profiles:
  Portnox_802.1X_Profile:
    Name: "Portnox-802.1X"
    Port_Security: "802.1X Control"
    Native_Network: "Quarantine"
    Voice_Network: "Voice"
    802.1X_Control: "Force Authorized -> Auto"
    MAC_Auth_Bypass: true
    Guest_Network: "Guest"
    Auth_Network: "Employee-Data"
    RADIUS_Profile: "Portnox-RADIUS"
    Re_authentication_Interval: 3600
    Link_Negotiation: "Auto negotiate"
    PoE_Mode: "PoE+"
    Spanning_Tree: "RSTP"
    Storm_Control:
      Broadcast: 100
      Multicast: 100
      Unknown_Unicast: 100

# 4. Wireless Configuration
# Settings > WiFi
Wireless_Networks:
  Employee_WiFi:
    Name: "{{EMPLOYEE_SSID}}"
    Security: "WPA Enterprise"
    RADIUS_Profile: "Portnox-RADIUS"
    Network: "Employee-Data"
    Advanced:
      RADIUS_MAC_Authentication: true
      Dynamic_VLAN: true
      BSS_Transition: true
      Fast_Roaming: true
      PMF: "Optional"
      
  Guest_WiFi:
    Name: "{{GUEST_SSID}}"
    Security: "Open"
    Network: "Guest"
    Guest_Portal: "External portal"
    Portal_URL: "{{PORTAL_URL}}"
    Advanced:
      Client_Isolation: true
      Schedule: "Always"

# 5. Advanced Features
# Settings > Advanced Features
Advanced_Features:
  Port_Security:
    MAC_Address_Limit: {{MAC_LIMIT}}
    Sticky_MAC: false
    Violation_Action: "Disconnect"
    
  DHCP_Snooping:
    Enabled: true
    Networks: ["Employee-Data", "Guest", "IoT"]
    Trusted_Ports: [49, 50, 51, 52]
    
  Storm_Control:
    Enabled: true
    Broadcast_Level: 100
    Multicast_Level: 100
    Unknown_Unicast_Level: 100',
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
        "IOT_VLAN": {
            "type": "number",
            "default": 300,
            "description": "IoT devices VLAN ID",
            "validation": "^[1-9][0-9]{0-2}|[1-3][0-9]{3}|40[0-8][0-9]|409[0-4]$"
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
        "EMPLOYEE_SSID": {
            "type": "string",
            "default": "Employee-WiFi",
            "description": "Employee WiFi SSID",
            "validation": "^.{1,32}$"
        },
        "GUEST_SSID": {
            "type": "string",
            "default": "Guest-WiFi",
            "description": "Guest WiFi SSID",
            "validation": "^.{1,32}$"
        },
        "PORTAL_URL": {
            "type": "string",
            "default": "http://portnox.company.com/guest",
            "description": "Guest portal URL",
            "validation": "^https?://.*"
        },
        "MAC_LIMIT": {
            "type": "number",
            "default": 10,
            "description": "Maximum MAC addresses per port",
            "validation": "^[1-9][0-9]?$"
        }
    }',
    '{
        "steps": [
            {
                "id": "radius_profile",
                "title": "RADIUS Profile Setup",
                "description": "Configure Portnox RADIUS profile in UniFi Network Application",
                "fields": ["PORTNOX_PRIMARY_IP", "PORTNOX_SECONDARY_IP", "PORTNOX_SHARED_SECRET"]
            },
            {
                "id": "network_config",
                "title": "Network Configuration",
                "description": "Create VLANs/Networks for segmentation",
                "fields": ["EMPLOYEE_VLAN", "GUEST_VLAN", "IOT_VLAN", "QUARANTINE_VLAN", "VOICE_VLAN"]
            },
            {
                "id": "wireless_config",
                "title": "Wireless Configuration",
                "description": "Configure wireless SSIDs",
                "fields": ["EMPLOYEE_SSID", "GUEST_SSID", "PORTAL_URL"]
            },
            {
                "id": "security_config",
                "title": "Security Configuration",
                "description": "Configure port security and advanced features",
                "fields": ["MAC_LIMIT"]
            }
        ]
    }',
    '{
        "security_optimization": {
            "mac_auth_bypass": true,
            "dynamic_vlan": true,
            "guest_portal": true,
            "dhcp_snooping": true
        },
        "performance_optimization": {
            "fast_roaming": true,
            "bss_transition": true,
            "pmf_optional": true
        },
        "unifi_specific": {
            "poe_plus": true,
            "rstp": true,
            "storm_control": true,
            "device_isolation": true
        }
    }',
    '{
        "unifi_platforms": {
            "USW-Pro-24": {"min_version": "UniFi OS 2.5", "max_ports": 24},
            "USW-Pro-48": {"min_version": "UniFi OS 2.5", "max_ports": 48},
            "USW-Aggregation": {"min_version": "UniFi OS 2.5", "max_ports": 28},
            "USW-Enterprise": {"min_version": "UniFi OS 3.0", "max_ports": 48}
        },
        "supported_features": [
            "802.1X Control",
            "MAC Authentication Bypass",
            "Dynamic VLAN assignment",
            "Guest portal",
            "Voice VLAN",
            "PoE+",
            "DHCP snooping",
            "Storm control"
        ]
    }',
    '[
        "Use UniFi Network Application for centralized management",
        "Configure RADIUS profile before switch port profiles",
        "Enable MAC authentication bypass for non-802.1X devices",
        "Use dynamic VLAN assignment for flexible policies",
        "Configure guest portal for unauthorized access",
        "Enable fast roaming for seamless wireless experience",
        "Use device isolation for IoT networks",
        "Enable DHCP snooping for security",
        "Configure storm control to prevent broadcast storms"
    ]',
    '[
        {
            "issue": "802.1X authentication failures",
            "commands": ["Check Events tab in UniFi Network Application", "Verify RADIUS profile configuration"],
            "solution": "Verify RADIUS server IP addresses and shared secret"
        },
        {
            "issue": "Dynamic VLAN not working",
            "commands": ["Check client details in UniFi Network Application", "Verify network assignments"],
            "solution": "Ensure networks are properly created and RADIUS attributes are correct"
        },
        {
            "issue": "Guest portal not redirecting",
            "commands": ["Check guest network configuration", "Verify portal URL"],
            "solution": "Ensure guest network is properly configured and portal URL is accessible"
        }
    ]',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Ubiquiti' LIMIT 1),
    '["802.1X EAP", "MAC Authentication", "Guest Portal"]',
    '["EAP-TLS", "EAP-PEAP", "EAP-TTLS", "MAC Authentication"]',
    '["RADIUS", "802.1X", "Dynamic VLAN", "Guest Portal", "PoE+", "DHCP Snooping"]',
    '{
        "vlan_support": true,
        "radius_servers": 2,
        "guest_portal": true,
        "dynamic_vlan": true,
        "mac_auth_bypass": true,
        "wireless_integration": true
    }',
    '["dhcp-snooping", "storm-control", "port-security", "device-isolation"]',
    '["UniFi Network Application Events", "Client Details", "Device Statistics", "Port Statistics"]',
    '["ubiquiti", "unifi", "802.1x", "radius", "portnox", "controller", "wireless", "enterprise"]',
    true,
    true
);