-- Comprehensive Configuration Templates Restoration
-- First, let's check and restore all configuration templates

-- Insert comprehensive Cisco templates
INSERT INTO configuration_templates (
  name,
  description,
  category,
  subcategory,
  configuration_type,
  complexity_level,
  template_content,
  template_variables,
  required_features,
  security_features,
  best_practices,
  validation_commands,
  tags,
  is_public,
  ai_generated,
  optimization_score,
  template_source
) VALUES
-- Cisco ISE 802.1X Template
(
  'Cisco ISE 802.1X with EAP-TLS',
  'Complete Cisco ISE configuration for 802.1X authentication with EAP-TLS certificates',
  'cisco',
  'authentication',
  'radius_802.1x',
  'advanced',
  '! Cisco ISE 802.1X Configuration Template
! EAP-TLS Certificate-based Authentication
!
! RADIUS Server Configuration
radius server {{radius_server_name}}
 address ipv4 {{radius_server_ip}} auth-port {{auth_port}} acct-port {{acct_port}}
 key {{shared_secret}}
 timeout {{timeout}}
 retransmit {{retransmit}}
 deadtime {{deadtime}}
!
! AAA Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting system default start-stop group radius
!
! 802.1X Global Configuration
dot1x system-auth-control
dot1x pae authenticator
!
{{#interfaces}}
! Interface Configuration - {{interface_name}}
interface {{interface_name}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{access_vlan}}
 authentication host-mode {{host_mode}}
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 mab
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x max-req {{max_requests}}
 spanning-tree portfast
 spanning-tree bpduguard enable
!
{{/interfaces}}
!
! VLAN Configuration
{{#vlans}}
vlan {{vlan_id}}
 name {{vlan_name}}
!
{{/vlans}}
!
! Dynamic VLAN Assignment
interface vlan {{management_vlan}}
 description Management VLAN
 ip address {{management_ip}} {{management_mask}}
!
! Guest VLAN Configuration
{{#guest_access}}
interface vlan {{guest_vlan}}
 description Guest Access VLAN
 ip address {{guest_ip}} {{guest_mask}}
!
{{/guest_access}}
!
! Security Features
ip device tracking
!
! Logging Configuration
logging {{syslog_server}}
logging facility local0
logging buffered 64000
!
! SNMP Configuration
{{#snmp_enabled}}
snmp-server community {{snmp_community}} ro
snmp-server location {{snmp_location}}
snmp-server contact {{snmp_contact}}
{{/snmp_enabled}}
!
! NTP Configuration
ntp server {{ntp_server}}
!
! End of Configuration',
  '{
    "radius_server_name": {
      "type": "string",
      "required": true,
      "description": "RADIUS server hostname",
      "default": "ISE-Primary"
    },
    "radius_server_ip": {
      "type": "ipv4",
      "required": true,
      "description": "RADIUS server IP address"
    },
    "shared_secret": {
      "type": "password",
      "required": true,
      "description": "RADIUS shared secret"
    },
    "auth_port": {
      "type": "number",
      "default": 1812,
      "description": "Authentication port"
    },
    "acct_port": {
      "type": "number",
      "default": 1813,
      "description": "Accounting port"
    },
    "interfaces": {
      "type": "array",
      "required": true,
      "description": "List of interfaces to configure"
    },
    "vlans": {
      "type": "array",
      "required": true,
      "description": "VLAN configuration"
    },
    "management_vlan": {
      "type": "number",
      "default": 100,
      "description": "Management VLAN ID"
    },
    "guest_access": {
      "type": "boolean",
      "default": false,
      "description": "Enable guest access"
    }
  }',
  '["802.1x", "radius", "eap-tls", "certificates"]',
  '["dynamic_vlan_assignment", "mab_fallback", "periodic_reauthentication", "guest_isolation"]',
  '["Use strong shared secrets", "Enable periodic reauthentication", "Configure proper timeouts", "Implement VLAN segmentation"]',
  '["show dot1x all", "show authentication sessions", "show radius statistics", "show vlan brief"]',
  '["cisco", "ise", "802.1x", "eap-tls", "enterprise", "authentication"]',
  true,
  false,
  9.2,
  'expert'
),

-- Cisco WLC 802.1X Template
(
  'Cisco WLC 802.1X Wireless Authentication',
  'Cisco Wireless LAN Controller configuration for 802.1X wireless authentication',
  'cisco',
  'wireless',
  'wireless_802.1x',
  'advanced',
  '! Cisco WLC 802.1X Wireless Configuration
!
! RADIUS Server Configuration
config radius auth add {{radius_server_index}} {{radius_server_ip}} {{auth_port}} {{shared_secret}}
config radius acct add {{radius_server_index}} {{radius_server_ip}} {{acct_port}} {{shared_secret}}
!
! AAA Server Group
config aaa auth mgmt add {{radius_server_index}}
config aaa acct mgmt add {{radius_server_index}}
!
! WLAN Configuration
config wlan create {{wlan_id}} {{ssid_name}} {{ssid_name}}
config wlan interface {{wlan_id}} {{interface_name}}
!
! Security Configuration
config wlan security wpa enable {{wlan_id}}
config wlan security wpa wpa2 enable {{wlan_id}}
config wlan security wpa wpa2 ciphers aes enable {{wlan_id}}
config wlan security wpa akm 802.1x enable {{wlan_id}}
!
! 802.1X Authentication
config wlan security 802.1x enable {{wlan_id}}
config wlan radius_server auth {{wlan_id}} {{radius_server_index}}
config wlan radius_server acct {{wlan_id}} {{radius_server_index}}
!
! Advanced Security Settings
{{#advanced_security}}
config wlan security pmf enable {{wlan_id}}
config wlan security ft enable {{wlan_id}}
config wlan security ft reassociation-timeout {{ft_timeout}} {{wlan_id}}
{{/advanced_security}}
!
! QoS Configuration
{{#qos_enabled}}
config wlan qos {{wlan_id}} {{qos_profile}}
{{/qos_enabled}}
!
! Band Selection
{{#band_selection}}
config advanced 802.11{{band}} txpower {{wlan_id}} {{power_level}}
{{/band_selection}}
!
! Guest Access Configuration
{{#guest_access}}
config wlan create {{guest_wlan_id}} {{guest_ssid}} {{guest_ssid}}
config wlan security web-auth enable {{guest_wlan_id}}
config wlan session-timeout {{guest_wlan_id}} {{guest_timeout}}
{{/guest_access}}
!
! Enable WLAN
config wlan enable {{wlan_id}}
!
save config',
  '{
    "radius_server_index": {
      "type": "number",
      "default": 1,
      "description": "RADIUS server index"
    },
    "radius_server_ip": {
      "type": "ipv4",
      "required": true,
      "description": "RADIUS server IP address"
    },
    "shared_secret": {
      "type": "password",
      "required": true,
      "description": "RADIUS shared secret"
    },
    "wlan_id": {
      "type": "number",
      "required": true,
      "description": "WLAN ID"
    },
    "ssid_name": {
      "type": "string",
      "required": true,
      "description": "SSID name"
    },
    "interface_name": {
      "type": "string",
      "required": true,
      "description": "Dynamic interface name"
    },
    "advanced_security": {
      "type": "boolean",
      "default": true,
      "description": "Enable PMF and Fast Transition"
    },
    "qos_enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable QoS"
    },
    "guest_access": {
      "type": "boolean",
      "default": false,
      "description": "Configure guest access"
    }
  }',
  '["wireless", "wpa2", "802.1x", "radius"]',
  '["pmf", "fast_transition", "aes_encryption", "dynamic_vlan"]',
  '["Use WPA2-Enterprise", "Enable PMF for security", "Configure proper timeouts", "Implement guest isolation"]',
  '["show wlan summary", "show radius summary", "show client summary", "show security summary"]',
  '["cisco", "wlc", "wireless", "802.1x", "enterprise", "wifi"]',
  true,
  false,
  9.1,
  'expert'
),

-- Aruba ClearPass Template
(
  'Aruba ClearPass 802.1X Policy',
  'Comprehensive Aruba ClearPass policy configuration for 802.1X authentication',
  'aruba',
  'clearpass',
  'policy_802.1x',
  'expert',
  '{
  "name": "{{service_name}}",
  "type": "Authentication",
  "authentication": {
    "method": "EAP-TLS",
    "certificate_validation": {
      "validate_certificate": true,
      "check_certificate_cn": {{check_cn}},
      "check_certificate_san": {{check_san}},
      "ocsp_validation": {{ocsp_enabled}},
      "crl_validation": {{crl_enabled}}
    },
    "machine_authentication": {{machine_auth}},
    "user_authentication": {{user_auth}}
  },
  "authorization": {
    "rules": [
      {
        "name": "Employee_Access",
        "conditions": [
          {
            "type": "certificate_cn",
            "operator": "contains",
            "value": "{{employee_cn_pattern}}"
          },
          {
            "type": "certificate_ou",
            "operator": "equals",
            "value": "{{employee_ou}}"
          }
        ],
        "enforcement": {
          "profile": "Employee_Profile",
          "vlan": "{{employee_vlan}}",
          "role": "{{employee_role}}"
        }
      },
      {
        "name": "Contractor_Access",
        "conditions": [
          {
            "type": "certificate_cn",
            "operator": "contains",
            "value": "{{contractor_cn_pattern}}"
          }
        ],
        "enforcement": {
          "profile": "Contractor_Profile",
          "vlan": "{{contractor_vlan}}",
          "role": "{{contractor_role}}"
        }
      }
    ],
    "default_action": "{{default_action}}"
  },
  "enforcement_profiles": [
    {
      "name": "Employee_Profile",
      "attributes": [
        {
          "name": "Filter-Id",
          "value": "{{employee_acl}}"
        },
        {
          "name": "Tunnel-Type",
          "value": "VLAN"
        },
        {
          "name": "Tunnel-Medium-Type",
          "value": "IEEE-802"
        },
        {
          "name": "Tunnel-Private-Group-Id",
          "value": "{{employee_vlan}}"
        }
      ]
    }
  ],
  "posture_assessment": {
    "enabled": {{posture_enabled}},
    "requirements": [
      {
        "os_type": "Windows",
        "antivirus_required": true,
        "patch_level": "current",
        "firewall_enabled": true
      }
    ]
  },
  "guest_access": {
    "enabled": {{guest_enabled}},
    "portal": "{{guest_portal}}",
    "vlan": "{{guest_vlan}}",
    "bandwidth_limit": "{{guest_bandwidth}}",
    "session_timeout": "{{guest_timeout}}"
  }
}',
  '{
    "service_name": {
      "type": "string",
      "required": true,
      "description": "ClearPass service name"
    },
    "check_cn": {
      "type": "boolean",
      "default": true,
      "description": "Validate certificate CN"
    },
    "check_san": {
      "type": "boolean",
      "default": true,
      "description": "Validate certificate SAN"
    },
    "employee_vlan": {
      "type": "number",
      "required": true,
      "description": "Employee VLAN ID"
    },
    "contractor_vlan": {
      "type": "number",
      "required": true,
      "description": "Contractor VLAN ID"
    },
    "posture_enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable posture assessment"
    },
    "guest_enabled": {
      "type": "boolean",
      "default": false,
      "description": "Enable guest access"
    }
  }',
  '["clearpass", "policy", "dynamic_vlan", "posture"]',
  '["certificate_validation", "posture_assessment", "dynamic_authorization", "guest_isolation"]',
  '["Validate certificates properly", "Implement posture assessment", "Use dynamic VLAN assignment", "Monitor authentication events"]',
  '["show service status", "show authentication logs", "show policy hits", "show posture status"]',
  '["aruba", "clearpass", "802.1x", "eap-tls", "policy", "enterprise"]',
  true,
  false,
  9.5,
  'expert'
);

-- Add config template categories
INSERT INTO config_template_categories (
  name,
  description,
  category_type,
  icon_name,
  color_scheme,
  display_order,
  ai_priority_weight
) VALUES
('Cisco ISE', 'Cisco Identity Services Engine configurations', 'vendor', 'cisco', 'blue', 1, 1.0),
('Cisco WLC', 'Cisco Wireless LAN Controller configurations', 'vendor', 'wifi', 'blue', 2, 1.0),
('Aruba ClearPass', 'Aruba ClearPass policy configurations', 'vendor', 'shield', 'green', 3, 1.0),
('FortiGate', 'Fortinet FortiGate firewall configurations', 'vendor', 'shield', 'orange', 4, 1.0),
('Authentication', '802.1X and authentication configurations', 'functional', 'key', 'purple', 10, 1.2),
('Wireless', 'Wireless network configurations', 'functional', 'wifi', 'cyan', 11, 1.1),
('Security', 'Security and compliance configurations', 'functional', 'lock', 'red', 12, 1.3);