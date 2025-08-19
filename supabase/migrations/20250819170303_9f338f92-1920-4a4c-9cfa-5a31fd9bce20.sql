-- MASSIVE Configuration Templates Restoration
-- Delete existing incomplete data and recreate everything

-- First, clean up incomplete templates
DELETE FROM config_wizard_steps;
DELETE FROM configuration_templates WHERE name IN ('Cisco ISE 802.1X with EAP-TLS', 'Cisco WLC 802.1X Wireless Authentication', 'Aruba ClearPass 802.1X Policy');

-- COMPREHENSIVE VENDOR TEMPLATES RESTORATION
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
  template_source,
  supported_scenarios,
  authentication_methods,
  network_requirements,
  troubleshooting_guide,
  deployment_scenarios
) VALUES

-- === CISCO TEMPLATES ===
(
  'Cisco ISE 802.1X Complete Enterprise',
  'Complete Cisco ISE configuration for large enterprise 802.1X deployment with advanced features',
  'cisco',
  'ise',
  'radius_802.1x',
  'expert',
  '! Cisco ISE 802.1X Enterprise Configuration
! Advanced Multi-Vendor Environment Support
!
! Global Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius  
aaa accounting dot1x default start-stop group radius
aaa accounting update newinfo periodic 2880

! RADIUS Configuration - Primary ISE
radius server ISE-PRIMARY
 address ipv4 {{ise_primary_ip}} auth-port 1812 acct-port 1813
 key {{ise_primary_key}}
 timeout 10
 retransmit 3
 deadtime 10

! RADIUS Configuration - Secondary ISE  
radius server ISE-SECONDARY
 address ipv4 {{ise_secondary_ip}} auth-port 1812 acct-port 1813
 key {{ise_secondary_key}}
 timeout 10
 retransmit 3
 deadtime 15

! Server Groups
aaa group server radius ISE-GROUP
 server name ISE-PRIMARY
 server name ISE-SECONDARY
 ip radius source-interface {{source_interface}}

! 802.1X Global Settings
dot1x system-auth-control
dot1x critical eapol

! Device Tracking
ip device tracking probe delay 10
ip device tracking probe use-svi

{{#switch_interfaces}}
! Interface {{interface_name}} - {{interface_description}}
interface {{interface_name}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 switchport voice vlan {{voice_vlan}}
 authentication event fail action next-method
 authentication event server dead action authorize
 authentication event server alive action reinitialize 
 authentication host-mode {{host_mode}}
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate {{reauth_timer}}
 authentication timer inactivity {{inactivity_timer}}
 authentication violation replace
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 3
 dot1x timeout supp-timeout 7
 dot1x max-req 2
 spanning-tree portfast
 spanning-tree bpduguard enable
 storm-control broadcast level 5.00
 storm-control multicast level 5.00
 ip device tracking maximum 10
!
{{/switch_interfaces}}

! VLAN Configuration
{{#vlans}}
vlan {{vlan_id}}
 name {{vlan_name}}
!
{{/vlans}}

! SVI Configuration for Management
interface vlan {{mgmt_vlan}}
 description Management VLAN
 ip address {{mgmt_ip}} {{mgmt_mask}}
 ip helper-address {{dhcp_server}}
!

! Guest VLAN Configuration
{{#guest_enabled}}
interface vlan {{guest_vlan}}
 description Guest Access VLAN  
 ip address {{guest_ip}} {{guest_mask}}
 ip access-group GUEST-ACL in
!
{{/guest_enabled}}

! Access Control Lists
{{#acls}}
ip access-list extended {{acl_name}}
{{#acl_rules}}
 {{rule_action}} {{protocol}} {{source}} {{destination}} {{options}}
{{/acl_rules}}
!
{{/acls}}

! Advanced Security Features
ip device tracking
ip dhcp snooping
ip dhcp snooping vlan {{data_vlans}}
no ip dhcp snooping information option
ip dhcp snooping database flash:dhcp_snoop.db
ip arp inspection vlan {{data_vlans}}
ip arp inspection validate src-mac dst-mac ip

! Logging Configuration
logging buffered 64000
logging console critical
logging monitor informational
logging source-interface {{mgmt_interface}}
logging {{syslog_server}}
logging facility local0

! SNMP Configuration
{{#snmp_enabled}}
snmp-server community {{ro_community}} RO
snmp-server community {{rw_community}} RW  
snmp-server location {{site_location}}
snmp-server contact {{admin_contact}}
snmp-server enable traps snmp authentication linkdown linkup
snmp-server host {{nms_server}} version 2c {{ro_community}}
{{/snmp_enabled}}

! NTP Configuration
ntp server {{ntp_primary}}
ntp server {{ntp_secondary}}
ntp source {{mgmt_interface}}

! End Configuration',
  '{
    "ise_primary_ip": {"type": "ipv4", "required": true, "description": "Primary ISE Server IP"},
    "ise_secondary_ip": {"type": "ipv4", "required": true, "description": "Secondary ISE Server IP"},
    "ise_primary_key": {"type": "password", "required": true, "description": "Primary ISE RADIUS Key"},
    "ise_secondary_key": {"type": "password", "required": true, "description": "Secondary ISE RADIUS Key"},
    "source_interface": {"type": "string", "required": true, "description": "Source interface for RADIUS"},
    "switch_interfaces": {"type": "array", "required": true, "description": "Switch interfaces configuration"},
    "vlans": {"type": "array", "required": true, "description": "VLAN definitions"},
    "mgmt_vlan": {"type": "number", "default": 100, "description": "Management VLAN ID"},
    "guest_enabled": {"type": "boolean", "default": false, "description": "Enable guest access"},
    "acls": {"type": "array", "description": "Access control lists"},
    "snmp_enabled": {"type": "boolean", "default": true, "description": "Enable SNMP"}
  }',
  '["802.1x", "radius", "ise", "certificates", "mab"]',
  '["dynamic_vlan", "guest_isolation", "device_tracking", "dhcp_snooping", "arp_inspection"]',
  '["Use redundant ISE servers", "Enable periodic reauthentication", "Implement guest isolation", "Monitor authentication logs"]',
  '["show dot1x all", "show authentication sessions", "show radius statistics", "show ip device tracking all"]',
  '["cisco", "ise", "802.1x", "enterprise", "radius", "eap-tls", "advanced"]',
  true,
  false,
  9.5,
  'expert',
  '["wired_access", "wireless_access", "iot_devices", "guest_access", "byod"]',
  '["eap-tls", "eap-ttls", "peap", "mab", "web_auth"]',
  '{"redundancy": "dual_server", "bandwidth": "1gbps", "latency": "low"}',
  '["authentication_failures", "radius_timeouts", "certificate_issues", "vlan_assignment_problems"]',
  '["greenfield", "migration", "upgrade", "expansion"]'
),

(
  'Cisco WLC Enterprise Wireless 802.1X',
  'Advanced Cisco WLC configuration for enterprise wireless with multiple SSIDs and security profiles',
  'cisco',
  'wlc',
  'wireless_802.1x',
  'expert',
  '! Cisco WLC Enterprise Wireless Configuration
!
! RADIUS Server Configuration - Primary
config radius auth add 1 {{radius_primary_ip}} 1812 {{radius_primary_key}}
config radius acct add 1 {{radius_primary_ip}} 1813 {{radius_primary_key}}

! RADIUS Server Configuration - Secondary
config radius auth add 2 {{radius_secondary_ip}} 1812 {{radius_secondary_key}}
config radius acct add 2 {{radius_secondary_ip}} 1813 {{radius_secondary_key}}

! RADIUS Server Timeout and Retries
config radius auth timeout 1 {{auth_timeout}}
config radius auth timeout 2 {{auth_timeout}}
config radius acct timeout 1 {{acct_timeout}}
config radius acct timeout 2 {{acct_timeout}}

! AAA Configuration
config aaa auth mgmt add 1
config aaa auth mgmt add 2
config aaa acct mgmt add 1
config aaa acct mgmt add 2

{{#wlans}}
! WLAN {{wlan_id}} - {{ssid_name}} Configuration
config wlan create {{wlan_id}} {{ssid_name}} {{ssid_name}}
config wlan interface {{wlan_id}} {{interface_name}}

! Security Configuration for {{ssid_name}}
config wlan security wpa enable {{wlan_id}}
config wlan security wpa wpa2 enable {{wlan_id}}
{{#wpa3_enabled}}
config wlan security wpa wpa3 enable {{wlan_id}}
{{/wpa3_enabled}}
config wlan security wpa wpa2 ciphers aes enable {{wlan_id}}
config wlan security wpa akm 802.1x enable {{wlan_id}}

! 802.1X Configuration
config wlan security 802.1x enable {{wlan_id}}
config wlan radius_server auth {{wlan_id}} 1
config wlan radius_server auth {{wlan_id}} 2
config wlan radius_server acct {{wlan_id}} 1
config wlan radius_server acct {{wlan_id}} 2

! Advanced Security Features
{{#pmf_enabled}}
config wlan security pmf enable {{wlan_id}}
config wlan security pmf required {{wlan_id}}
{{/pmf_enabled}}

{{#fast_transition}}
config wlan security ft enable {{wlan_id}}
config wlan security ft reassociation-timeout {{ft_timeout}} {{wlan_id}}
{{/fast_transition}}

! Session and Reauthentication
config wlan session-timeout {{wlan_id}} {{session_timeout}}
config wlan eap-reauth enable {{wlan_id}}
config wlan eap-reauth intv {{wlan_id}} {{reauth_interval}}

! QoS Configuration
{{#qos_enabled}}
config wlan qos {{wlan_id}} {{qos_profile}}
config wlan wmm allow {{wlan_id}}
{{/qos_enabled}}

! Band Selection and Load Balancing
{{#band_selection}}
config wlan band-select allow {{wlan_id}}
config advanced 802.11a channel global auto
config advanced 802.11g channel global auto
{{/band_selection}}

! WLAN Enable
config wlan enable {{wlan_id}}
!
{{/wlans}}

! Guest WLAN Configuration
{{#guest_wlan}}
config wlan create {{guest_wlan_id}} {{guest_ssid}} {{guest_ssid}}
config wlan interface {{guest_wlan_id}} {{guest_interface}}
config wlan security web-auth enable {{guest_wlan_id}}
config wlan security web-auth server-precedence {{guest_wlan_id}} local radius ldap
config wlan session-timeout {{guest_wlan_id}} {{guest_timeout}}
config wlan usertimeout {{guest_wlan_id}} {{guest_idle_timeout}}
config wlan enable {{guest_wlan_id}}
{{/guest_wlan}}

! AP Groups and RF Configuration
{{#ap_groups}}
config ap-group {{group_name}}
config ap-group {{group_name}} add-wlan {{wlan_id}}
{{/ap_groups}}

! Advanced RF Settings
config 802.11a enable
config 802.11g enable
config advanced 802.11a txpower global max {{max_power_5g}}
config advanced 802.11g txpower global max {{max_power_24g}}

! Coverage Hole Detection
config advanced 802.11a coverage enable
config advanced 802.11g coverage enable
config advanced 802.11a coverage level {{coverage_threshold}}
config advanced 802.11g coverage level {{coverage_threshold}}

! Load Balancing
config load-balancing enable
config load-balancing window {{lb_window}}
config load-balancing denial {{lb_denial}}

! Save Configuration
save config',
  '{
    "radius_primary_ip": {"type": "ipv4", "required": true, "description": "Primary RADIUS server IP"},
    "radius_secondary_ip": {"type": "ipv4", "required": true, "description": "Secondary RADIUS server IP"},
    "radius_primary_key": {"type": "password", "required": true, "description": "Primary RADIUS shared key"},
    "radius_secondary_key": {"type": "password", "required": true, "description": "Secondary RADIUS shared key"},
    "wlans": {"type": "array", "required": true, "description": "WLAN configurations"},
    "auth_timeout": {"type": "number", "default": 10, "description": "Authentication timeout"},
    "acct_timeout": {"type": "number", "default": 10, "description": "Accounting timeout"},
    "wpa3_enabled": {"type": "boolean", "default": true, "description": "Enable WPA3"},
    "pmf_enabled": {"type": "boolean", "default": true, "description": "Enable Protected Management Frames"},
    "fast_transition": {"type": "boolean", "default": true, "description": "Enable Fast Transition (802.11r)"},
    "guest_wlan": {"type": "object", "description": "Guest WLAN configuration"},
    "qos_enabled": {"type": "boolean", "default": true, "description": "Enable QoS"},
    "band_selection": {"type": "boolean", "default": true, "description": "Enable band selection"}
  }',
  '["wireless", "wpa2", "wpa3", "802.1x", "radius", "fast_transition"]',
  '["pmf", "wpa3", "fast_transition", "aes_encryption", "dynamic_vlan", "guest_isolation"]',
  '["Use WPA3 when possible", "Enable PMF for security", "Implement Fast Transition", "Monitor client connectivity"]',
  '["show wlan summary", "show radius summary", "show client summary", "show ap summary"]',
  '["cisco", "wlc", "wireless", "802.1x", "enterprise", "wpa3", "pmf"]',
  true,
  false,
  9.3,
  'expert',
  '["enterprise_wireless", "guest_access", "byod", "iot_wireless"]',
  '["eap-tls", "eap-ttls", "peap", "web_auth"]',
  '{"redundancy": "dual_wlc", "bandwidth": "wifi6", "coverage": "enterprise"}',
  '["client_connectivity", "roaming_issues", "authentication_failures", "rf_interference"]',
  '["new_deployment", "migration", "expansion", "upgrade"]'
),

-- === ARUBA TEMPLATES ===
(
  'Aruba ClearPass Advanced Policy Engine',
  'Comprehensive Aruba ClearPass configuration with advanced policy engine and device profiling',
  'aruba',
  'clearpass',
  'policy_engine',
  'expert',
  '{
  "service_template": {
    "name": "{{service_name}}",
    "type": "Authentication",
    "description": "Advanced 802.1X authentication with device profiling",
    "enabled": true
  },
  "authentication_methods": [
    {
      "name": "EAP-TLS",
      "enabled": true,
      "certificate_validation": {
        "validate_certificate": true,
        "check_certificate_cn": {{check_cn}},
        "check_certificate_san": {{check_san}},
        "check_certificate_ou": {{check_ou}},
        "ocsp_validation": {{ocsp_enabled}},
        "crl_validation": {{crl_enabled}},
        "certificate_expiry_warning": {{cert_expiry_days}}
      }
    },
    {
      "name": "EAP-TTLS",
      "enabled": {{eap_ttls_enabled}},
      "inner_method": "PAP",
      "validate_server_cert": true
    },
    {
      "name": "PEAP",
      "enabled": {{peap_enabled}},
      "inner_method": "MSCHAPv2",
      "validate_server_cert": true
    }
  ],
  "device_profiling": {
    "enabled": true,
    "profiling_methods": ["dhcp", "http", "snmp", "nmap", "wmi"],
    "categories": [
      {
        "name": "Corporate_Devices",
        "rules": [
          {"attribute": "certificate_ou", "operator": "equals", "value": "{{corporate_ou}}"},
          {"attribute": "dhcp_vendor_class", "operator": "contains", "value": "{{corporate_dhcp_class}}"}
        ]
      },
      {
        "name": "BYOD_Devices", 
        "rules": [
          {"attribute": "device_category", "operator": "equals", "value": "Smartphone"},
          {"attribute": "device_category", "operator": "equals", "value": "Tablet"}
        ]
      },
      {
        "name": "IoT_Devices",
        "rules": [
          {"attribute": "device_category", "operator": "contains", "value": "IoT"},
          {"attribute": "mac_vendor", "operator": "in", "value": ["Nest", "Ring", "Philips"]}
        ]
      }
    ]
  },
  "authorization_policies": [
    {
      "name": "Employee_Access",
      "priority": 100,
      "conditions": [
        {"type": "certificate_ou", "operator": "equals", "value": "{{employee_ou}}"},
        {"type": "device_category", "operator": "equals", "value": "Corporate_Devices"},
        {"type": "time_of_day", "operator": "during", "value": "{{business_hours}}"}
      ],
      "enforcement_profile": "Employee_Profile"
    },
    {
      "name": "Contractor_Access",
      "priority": 200,
      "conditions": [
        {"type": "certificate_ou", "operator": "equals", "value": "{{contractor_ou}}"},
        {"type": "time_of_day", "operator": "during", "value": "{{contractor_hours}}"}
      ],
      "enforcement_profile": "Contractor_Profile"
    },
    {
      "name": "BYOD_Access",
      "priority": 300,
      "conditions": [
        {"type": "device_category", "operator": "equals", "value": "BYOD_Devices"},
        {"type": "posture_compliant", "operator": "equals", "value": true}
      ],
      "enforcement_profile": "BYOD_Profile"
    },
    {
      "name": "IoT_Access",
      "priority": 400,
      "conditions": [
        {"type": "device_category", "operator": "equals", "value": "IoT_Devices"}
      ],
      "enforcement_profile": "IoT_Profile"
    }
  ],
  "enforcement_profiles": [
    {
      "name": "Employee_Profile",
      "attributes": [
        {"name": "Filter-Id", "value": "{{employee_acl}}"},
        {"name": "Tunnel-Type", "value": "VLAN"},
        {"name": "Tunnel-Medium-Type", "value": "IEEE-802"},
        {"name": "Tunnel-Private-Group-Id", "value": "{{employee_vlan}}"},
        {"name": "Session-Timeout", "value": "{{employee_session_timeout}}"},
        {"name": "Idle-Timeout", "value": "{{employee_idle_timeout}}"}
      ]
    },
    {
      "name": "Contractor_Profile",
      "attributes": [
        {"name": "Filter-Id", "value": "{{contractor_acl}}"},
        {"name": "Tunnel-Private-Group-Id", "value": "{{contractor_vlan}}"},
        {"name": "Session-Timeout", "value": "{{contractor_session_timeout}}"},
        {"name": "Idle-Timeout", "value": "{{contractor_idle_timeout}}"}
      ]
    },
    {
      "name": "BYOD_Profile",
      "attributes": [
        {"name": "Filter-Id", "value": "{{byod_acl}}"},
        {"name": "Tunnel-Private-Group-Id", "value": "{{byod_vlan}}"},
        {"name": "Session-Timeout", "value": "{{byod_session_timeout}}"},
        {"name": "Bandwidth-Limit", "value": "{{byod_bandwidth_limit}}"}
      ]
    },
    {
      "name": "IoT_Profile", 
      "attributes": [
        {"name": "Filter-Id", "value": "{{iot_acl}}"},
        {"name": "Tunnel-Private-Group-Id", "value": "{{iot_vlan}}"},
        {"name": "Session-Timeout", "value": "0"}
      ]
    }
  ],
  "posture_assessment": {
    "enabled": {{posture_enabled}},
    "agent_download": true,
    "requirements": [
      {
        "operating_system": "Windows",
        "requirements": [
          {"type": "antivirus", "required": true, "min_definition_age": 7},
          {"type": "windows_update", "required": true, "critical_patches": true},
          {"type": "firewall", "required": true, "enabled": true},
          {"type": "registry_check", "key": "{{windows_registry_key}}", "value": "{{expected_value}}"}
        ]
      },
      {
        "operating_system": "macOS",
        "requirements": [
          {"type": "os_version", "min_version": "{{macos_min_version}}"},
          {"type": "firewall", "required": true, "enabled": true},
          {"type": "encryption", "required": true, "filevault": true}
        ]
      },
      {
        "operating_system": "iOS",
        "requirements": [
          {"type": "os_version", "min_version": "{{ios_min_version}}"},
          {"type": "jailbreak_check", "required": true, "jailbroken": false},
          {"type": "mdm_enrollment", "required": {{ios_mdm_required}}}
        ]
      }
    ]
  },
  "guest_access": {
    "enabled": {{guest_enabled}},
    "portal_customization": {
      "company_logo": "{{company_logo_url}}",
      "background_color": "{{portal_bg_color}}",
      "terms_and_conditions": "{{terms_url}}"
    },
    "sponsor_workflow": {{sponsor_workflow_enabled}},
    "self_registration": {{self_registration_enabled}},
    "social_login": {
      "enabled": {{social_login_enabled}},
      "providers": ["google", "facebook", "linkedin"]
    },
    "guest_vlan": "{{guest_vlan}}",
    "bandwidth_limit": "{{guest_bandwidth}}",
    "session_timeout": "{{guest_timeout}}",
    "daily_limit": "{{guest_daily_limit}}"
  },
  "integration_settings": {
    "active_directory": {
      "enabled": {{ad_enabled}},
      "domain_controller": "{{ad_domain_controller}}",
      "base_dn": "{{ad_base_dn}}",
      "bind_username": "{{ad_bind_user}}",
      "sync_interval": {{ad_sync_interval}}
    },
    "syslog": {
      "enabled": true,
      "servers": [
        {"host": "{{syslog_server1}}", "port": 514, "facility": "local0"},
        {"host": "{{syslog_server2}}", "port": 514, "facility": "local1"}
      ]
    },
    "snmp": {
      "enabled": {{snmp_enabled}},
      "community": "{{snmp_community}}",
      "trap_destinations": ["{{snmp_trap_server}}"]
    }
  }
}',
  '{
    "service_name": {"type": "string", "required": true, "description": "ClearPass service name"},
    "check_cn": {"type": "boolean", "default": true, "description": "Validate certificate CN"},
    "check_san": {"type": "boolean", "default": true, "description": "Validate certificate SAN"},
    "check_ou": {"type": "boolean", "default": true, "description": "Validate certificate OU"},
    "employee_vlan": {"type": "number", "required": true, "description": "Employee VLAN ID"},
    "contractor_vlan": {"type": "number", "required": true, "description": "Contractor VLAN ID"},
    "byod_vlan": {"type": "number", "required": true, "description": "BYOD VLAN ID"},
    "iot_vlan": {"type": "number", "required": true, "description": "IoT VLAN ID"},
    "posture_enabled": {"type": "boolean", "default": true, "description": "Enable posture assessment"},
    "guest_enabled": {"type": "boolean", "default": false, "description": "Enable guest access"},
    "ad_enabled": {"type": "boolean", "default": true, "description": "Enable Active Directory integration"},
    "snmp_enabled": {"type": "boolean", "default": true, "description": "Enable SNMP monitoring"}
  }',
  '["clearpass", "policy", "device_profiling", "posture", "guest_portal"]',
  '["certificate_validation", "posture_assessment", "device_profiling", "dynamic_authorization", "guest_isolation"]',
  '["Implement comprehensive device profiling", "Use posture assessment", "Enable guest workflows", "Monitor policy effectiveness"]',
  '["show service status", "show authentication summary", "show device profiling", "show posture status"]',
  '["aruba", "clearpass", "802.1x", "policy", "enterprise", "device_profiling", "posture"]',
  true,
  false,
  9.7,
  'expert',
  '["wired_access", "wireless_access", "byod", "guest_access", "iot_devices"]',
  '["eap-tls", "eap-ttls", "peap", "mac_auth", "web_auth"]',
  '{"redundancy": "cluster", "scalability": "enterprise", "integration": "extensive"}',
  '["policy_conflicts", "certificate_issues", "device_profiling_errors", "posture_failures"]',
  '["new_deployment", "policy_migration", "integration", "scaling"]'
);

-- Add FortiGate, Palo Alto, Juniper, and other major vendors
INSERT INTO configuration_templates (
  name, description, category, subcategory, configuration_type, complexity_level,
  template_content, template_variables, required_features, security_features,
  best_practices, validation_commands, tags, is_public, ai_generated, optimization_score, template_source
) VALUES

-- === FORTINET TEMPLATES ===
(
  'FortiGate Enterprise 802.1X Firewall',
  'Complete FortiGate firewall configuration with 802.1X, RADIUS, and advanced security features',
  'fortinet',
  'fortigate',
  'firewall_802.1x',
  'expert',
  '! FortiGate Enterprise Security Configuration
! 802.1X Authentication with RADIUS Integration
!
config user radius
    edit "RADIUS-PRIMARY"
        set server "{{radius_primary_ip}}"
        set secret "{{radius_primary_key}}"
        set auth-type auto
        set timeout {{radius_timeout}}
        set acct-interim-interval {{acct_interim}}
        set all-usergroup enable
        set use-management-vdom enable
        set rsso enable
        set rsso-radius-response enable
        set rsso-validate-request-secret enable
        set rsso-secret "{{rsso_secret}}"
        set rsso-endpoint-attribute "{{rsso_endpoint_attr}}"
        set rsso-endpoint-block-attribute "{{rsso_block_attr}}"
    next
    edit "RADIUS-SECONDARY"  
        set server "{{radius_secondary_ip}}"
        set secret "{{radius_secondary_key}}"
        set auth-type auto
        set timeout {{radius_timeout}}
        set acct-interim-interval {{acct_interim}}
        set all-usergroup enable
        set use-management-vdom enable
        set rsso enable
        set rsso-radius-response enable
    next
end

config user group
    edit "AUTHENTICATED-USERS"
        set member "RADIUS-PRIMARY" "RADIUS-SECONDARY"
        config match
            edit 1
                set server-name "RADIUS-PRIMARY"
                set group-name "{{authenticated_group}}"
            next
            edit 2
                set server-name "RADIUS-SECONDARY" 
                set group-name "{{authenticated_group}}"
            next
        end
    next
    edit "EMPLOYEE-USERS"
        set member "RADIUS-PRIMARY"
        config match
            edit 1
                set server-name "RADIUS-PRIMARY"
                set group-name "{{employee_group}}"
            next
        end
    next
    edit "CONTRACTOR-USERS"
        set member "RADIUS-PRIMARY"
        config match
            edit 1
                set server-name "RADIUS-PRIMARY"
                set group-name "{{contractor_group}}"
            next
        end
    next
end

config authentication scheme
    edit "{{auth_scheme_name}}"
        set method ntlm
        set negotiate-ntlm enable
        set kerberos-keytab "{{keytab_file}}"
        set domain-controller "{{domain_controller}}"
        set ldap-server "{{ldap_server}}"
        set fsso enable
        set rsso enable
    next
end

config authentication setting
    set auth-scheme "{{auth_scheme_name}}"
    set captive-portal-type fqdn
    set captive-portal "{{captive_portal_fqdn}}"
    set captive-portal-port {{captive_portal_port}}
    set auth-timeout {{auth_timeout}}
    set auth-portal-timeout {{portal_timeout}}
end

! VLAN Interface Configuration
{{#vlan_interfaces}}
config system interface
    edit "{{vlan_name}}"
        set vdom "{{vdom_name}}"
        set type vlan
        set interface "{{physical_interface}}"
        set vlanid {{vlan_id}}
        set ip {{vlan_ip}} {{vlan_netmask}}
        set allowaccess https ssh snmp
        set dhcp-relay-service enable
        set dhcp-relay-ip "{{dhcp_server_ip}}"
        set role lan
        set snmp-index {{snmp_index}}
    next
end
{{/vlan_interfaces}}

! Firewall Policies
{{#firewall_policies}}
config firewall policy
    edit {{policy_id}}
        set name "{{policy_name}}"
        set srcintf "{{source_interface}}"
        set dstintf "{{destination_interface}}"
        set srcaddr "{{source_address}}"
        set dstaddr "{{destination_address}}"
        set action accept
        set schedule "{{schedule}}"
        set service "{{service}}"
        set groups "{{user_groups}}"
        set nat enable
        set logtraffic all
        set utm-status enable
        set av-profile "{{av_profile}}"
        set ips-sensor "{{ips_sensor}}"
        set application-list "{{app_control}}"
        set webfilter-profile "{{web_filter}}"
        set dnsfilter-profile "{{dns_filter}}"
        set ssl-ssh-profile "{{ssl_inspection}}"
    next
end
{{/firewall_policies}}

! Security Profiles
config antivirus profile
    edit "{{av_profile}}"
        config http
            set archive-block enable
            set archive-log enable
            set emulator enable
            set options scan avmonitor
        end
        config ftp
            set archive-block enable
            set archive-log enable
            set emulator enable
            set options scan avmonitor
        end
        config imap
            set archive-block enable
            set archive-log enable
            set emulator enable
            set options scan avmonitor
        end
        config pop3
            set archive-block enable
            set archive-log enable
            set emulator enable
            set options scan avmonitor
        end
        config smtp
            set archive-block enable
            set archive-log enable
            set emulator enable
            set options scan avmonitor
        end
    next
end

config ips sensor
    edit "{{ips_sensor}}"
        config entries
            edit 1
                set rule-id 1
                set severity high critical
                set location any
                set os any
                set application any
                set action block
                set log enable
            next
        end
    next
end

! Application Control
config application list
    edit "{{app_control}}"
        config entries
            edit 1
                set category {{blocked_categories}}
                set action block
                set log enable
            next
            edit 2
                set category {{monitored_categories}}
                set action monitor
                set log enable
            next
        end
    next
end

! Web Filtering
config webfilter profile
    edit "{{web_filter}}"
        config web
            set blacklist enable
            set bword-threshold {{bad_word_threshold}}
            set bword-table {{bad_word_table}}
            set urlfilter-table {{url_filter_table}}
            set youtube-restrict {{youtube_restriction}}
            set vimeo-restrict {{vimeo_restriction}}
        end
        config ftgd-wf
            config filters
                edit 1
                    set category {{blocked_web_categories}}
                    set action block
                    set log enable
                next
            end
        end
    next
end

! Wireless Configuration (if applicable)
{{#wireless_enabled}}
config wireless-controller vap
    edit "{{wireless_profile}}"
        set ssid "{{ssid_name}}"
        set security wpa2-only-enterprise
        set auth radius
        set radius-server "RADIUS-PRIMARY"
        set encrypt AES
        set keyindex 1
        set eap-reauth enable
        set eap-reauth-intv {{reauth_interval}}
        set roaming-acct-interim-update enable
        set access-control-list "{{wireless_acl}}"
        set local-bridging enable
        set pmf enable
        set pmf-assoc-comeback-timeout {{pmf_timeout}}
    next
end
{{/wireless_enabled}}

! Logging Configuration
config log syslogd setting
    set status enable
    set server "{{syslog_server}}"
    set port {{syslog_port}}
    set facility {{syslog_facility}}
    set source-ip "{{source_ip}}"
    set format default
end

config log eventfilter
    set event enable
    set system enable
    set vpn enable
    set user enable
    set router enable
    set wireless enable
    set wan-opt disable
    set endpoint disable
    set ha enable
    set compliance-check enable
    set security-rating enable
end

! SNMP Configuration
{{#snmp_enabled}}
config system snmp sysinfo
    set status enable
    set description "{{device_description}}"
    set contact-info "{{admin_contact}}"
    set location "{{device_location}}"
end

config system snmp community
    edit 1
        set name "{{snmp_community}}"
        set query-v1-status enable
        set query-v2c-status enable
        set trap-v1-status enable
        set trap-v2c-status enable
        config hosts
            edit 1
                set ip "{{nms_server}}"
            next
        end
    next
end
{{/snmp_enabled}}

end',
  '{
    "radius_primary_ip": {"type": "ipv4", "required": true, "description": "Primary RADIUS server IP"},
    "radius_secondary_ip": {"type": "ipv4", "required": true, "description": "Secondary RADIUS server IP"},
    "radius_primary_key": {"type": "password", "required": true, "description": "Primary RADIUS shared key"},
    "radius_secondary_key": {"type": "password", "required": true, "description": "Secondary RADIUS shared key"},
    "vdom_name": {"type": "string", "default": "root", "description": "Virtual domain name"},
    "vlan_interfaces": {"type": "array", "required": true, "description": "VLAN interface configurations"},
    "firewall_policies": {"type": "array", "required": true, "description": "Firewall policy configurations"},
    "auth_timeout": {"type": "number", "default": 300, "description": "Authentication timeout in seconds"},
    "wireless_enabled": {"type": "boolean", "default": false, "description": "Enable wireless configuration"},
    "snmp_enabled": {"type": "boolean", "default": true, "description": "Enable SNMP monitoring"}
  }',
  '["radius", "802.1x", "firewall", "utm", "wireless"]',
  '["utm_inspection", "application_control", "web_filtering", "intrusion_prevention", "antivirus"]',
  '["Enable all UTM features", "Use identity-based policies", "Monitor authentication logs", "Regular security updates"]',
  '["get user radius", "get authentication statistics", "get firewall policy", "get system status"]',
  '["fortinet", "fortigate", "802.1x", "radius", "firewall", "utm", "enterprise"]',
  true,
  false,
  9.1,
  'expert'
),

-- === PALO ALTO TEMPLATES ===
(
  'Palo Alto Next-Gen Firewall 802.1X',
  'Palo Alto Networks NGFW configuration with User-ID, 802.1X integration, and advanced threat prevention',
  'paloalto',
  'ngfw',
  'firewall_user_id',
  'expert',
  '<!-- Palo Alto Networks NGFW Configuration -->
<!-- User-ID and 802.1X Integration -->

<config>
  <!-- Device Configuration -->
  <devices>
    <entry name="localhost.localdomain">
      
      <!-- Network Configuration -->
      <network>
        <interface>
          <ethernet>
            {{#ethernet_interfaces}}
            <entry name="{{interface_name}}">
              <layer3>
                <ip>
                  <entry name="{{ip_address}}/{{subnet_mask}}"/>
                </ip>
                <interface-management-profile>{{mgmt_profile}}</interface-management-profile>
              </layer3>
            </entry>
            {{/ethernet_interfaces}}
          </ethernet>
          <vlan>
            {{#vlan_interfaces}}
            <entry name="{{vlan_name}}">
              <ip>
                <entry name="{{vlan_ip}}/{{vlan_mask}}"/>
              </ip>
              <interface-management-profile>{{vlan_mgmt_profile}}</interface-management-profile>
            </entry>
            {{/vlan_interfaces}}
          </vlan>
        </interface>
        
        <!-- Virtual Router -->
        <virtual-router>
          <entry name="{{vr_name}}">
            <interface>
              {{#vr_interfaces}}
              <member>{{interface_name}}</member>
              {{/vr_interfaces}}
            </interface>
            <routing-table>
              <ip>
                <static-route>
                  {{#static_routes}}
                  <entry name="{{route_name}}">
                    <destination>{{destination}}</destination>
                    <nexthop>
                      <ip-address>{{next_hop}}</ip-address>
                    </nexthop>
                    <interface>{{exit_interface}}</interface>
                    <metric>{{metric}}</metric>
                  </entry>
                  {{/static_routes}}
                </static-route>
              </ip>
            </routing-table>
          </entry>
        </virtual-router>
      </network>

      <!-- User-ID Configuration -->
      <userid>
        <user-id-agent>
          {{#user_id_agents}}
          <entry name="{{agent_name}}">
            <host>{{agent_host}}</host>
            <port>{{agent_port}}</port>
            <ntlm-auth>
              <cookie-lifetime>{{cookie_lifetime}}</cookie-lifetime>
            </ntlm-auth>
            <ldap-proxy>yes</ldap-proxy>
            <collectorname>{{collector_name}}</collectorname>
            <secret>{{agent_secret}}</secret>
          </entry>
          {{/user_id_agents}}
        </user-id-agent>
        
        <enable-user-identification>yes</enable-user-identification>
        <user-mapping>
          <timeout>{{user_mapping_timeout}}</timeout>
        </user-mapping>
        
        <group-mapping>
          {{#group_mappings}}
          <entry name="{{group_name}}">
            <group-include>
              {{#included_groups}}
              <member>{{group_dn}}</member>
              {{/included_groups}}
            </group-include>
          </entry>
          {{/group_mappings}}
        </group-mapping>
      </userid>

      <!-- Server Profiles -->
      <server-profile>
        <radius>
          {{#radius_servers}}
          <entry name="{{radius_profile_name}}">
            <protocol>
              <PEAP>
                <with-cert>no</with-cert>
              </PEAP>
              <EAP-TTLS>
                <with-cert>no</with-cert>
              </EAP-TTLS>
              <CHAP>no</CHAP>
              <PAP>no</PAP>
            </protocol>
            <server>
              <entry name="{{server_name}}">
                <ip-address>{{server_ip}}</ip-address>
                <secret>{{shared_secret}}</secret>
                <port>{{auth_port}}</port>
                <accounting-port>{{acct_port}}</accounting-port>
                <timeout>{{timeout}}</timeout>
                <retries>{{retries}}</retries>
              </entry>
            </server>
          </entry>
          {{/radius_servers}}
        </radius>
        
        <ldap>
          {{#ldap_servers}}
          <entry name="{{ldap_profile_name}}">
            <server>
              <entry name="{{ldap_server_name}}">
                <address>{{ldap_server_ip}}</address>
                <port>{{ldap_port}}</port>
              </entry>
            </server>
            <type>{{ldap_type}}</type>
            <base>{{ldap_base_dn}}</base>
            <bind-dn>{{bind_dn}}</bind-dn>
            <bind-password>{{bind_password}}</bind-password>
            <ssl>{{ssl_enabled}}</ssl>
          </entry>
          {{/ldap_servers}}
        </ldap>
      </server-profile>

      <!-- Security Zones -->
      <zone>
        {{#security_zones}}
        <entry name="{{zone_name}}">
          <network>
            <layer3>
              {{#zone_interfaces}}
              <member>{{interface_name}}</member>
              {{/zone_interfaces}}
            </layer3>
          </network>
          <user-id-acl>
            <include-list>
              {{#user_id_networks}}
              <member>{{network}}</member>
              {{/user_id_networks}}
            </include-list>
          </user-id-acl>
          <enable-user-identification>yes</enable-user-identification>
        </entry>
        {{/security_zones}}
      </zone>

      <!-- Security Policies -->
      <rulebase>
        <security>
          <rules>
            {{#security_rules}}
            <entry name="{{rule_name}}">
              <from>
                {{#source_zones}}
                <member>{{zone_name}}</member>
                {{/source_zones}}
              </from>
              <to>
                {{#destination_zones}}
                <member>{{zone_name}}</member>
                {{/destination_zones}}
              </to>
              <source>
                {{#source_addresses}}
                <member>{{address}}</member>
                {{/source_addresses}}
              </source>
              <source-user>
                {{#source_users}}
                <member>{{user_group}}</member>
                {{/source_users}}
              </source-user>
              <destination>
                {{#destination_addresses}}
                <member>{{address}}</member>
                {{/destination_addresses}}
              </destination>
              <application>
                {{#applications}}
                <member>{{app_name}}</member>
                {{/applications}}
              </application>
              <service>
                {{#services}}
                <member>{{service_name}}</member>
                {{/services}}
              </service>
              <action>{{rule_action}}</action>
              <profile-setting>
                <profiles>
                  <virus>
                    <member>{{antivirus_profile}}</member>
                  </virus>
                  <spyware>
                    <member>{{antispyware_profile}}</member>
                  </spyware>
                  <vulnerability>
                    <member>{{vulnerability_profile}}</member>
                  </vulnerability>
                  <url-filtering>
                    <member>{{url_filtering_profile}}</member>
                  </url-filtering>
                  <wildfire-analysis>
                    <member>{{wildfire_profile}}</member>
                  </wildfire-analysis>
                </profiles>
              </profile-setting>
              <log-setting>{{log_profile}}</log-setting>
            </entry>
            {{/security_rules}}
          </rules>
        </security>
      </rulebase>

      <!-- Threat Prevention Profiles -->
      <profiles>
        <virus>
          <entry name="{{antivirus_profile}}">
            <decoder>
              {{#virus_decoders}}
              <entry name="{{decoder_name}}">
                <action>{{decoder_action}}</action>
                <wildfire-action>{{wildfire_action}}</wildfire-action>
              </entry>
              {{/virus_decoders}}
            </decoder>
          </entry>
        </virus>
        
        <spyware>
          <entry name="{{antispyware_profile}}">
            <rules>
              {{#spyware_rules}}
              <entry name="{{rule_name}}">
                <severity>
                  {{#severities}}
                  <member>{{severity_level}}</member>
                  {{/severities}}
                </severity>
                <action>
                  <block-ip>
                    <track-by>source-and-destination</track-by>
                    <duration>{{block_duration}}</duration>
                  </block-ip>
                </action>
                <packet-capture>{{packet_capture}}</packet-capture>
              </entry>
              {{/spyware_rules}}
            </rules>
          </entry>
        </spyware>
      </profiles>

      <!-- Log Forwarding -->
      <log-settings>
        <profiles>
          <entry name="{{log_profile}}">
            <match-list>
              {{#log_forwarding_rules}}
              <entry name="{{log_rule_name}}">
                <log-type>{{log_type}}</log-type>
                <filter>{{log_filter}}</filter>
                <send-syslog>
                  {{#syslog_servers}}
                  <entry name="{{syslog_server_name}}">
                    <server>{{syslog_server_ip}}</server>
                    <transport>{{transport_protocol}}</transport>
                    <port>{{syslog_port}}</port>
                    <format>{{log_format}}</format>
                    <facility>{{syslog_facility}}</facility>
                  </entry>
                  {{/syslog_servers}}
                </send-syslog>
              </entry>
              {{/log_forwarding_rules}}
            </match-list>
          </entry>
        </profiles>
      </log-settings>

    </entry>
  </devices>
</config>',
  '{
    "ethernet_interfaces": {"type": "array", "required": true, "description": "Ethernet interface configurations"},
    "vlan_interfaces": {"type": "array", "required": true, "description": "VLAN interface configurations"},
    "vr_name": {"type": "string", "default": "default", "description": "Virtual router name"},
    "user_id_agents": {"type": "array", "required": true, "description": "User-ID agent configurations"},
    "radius_servers": {"type": "array", "required": true, "description": "RADIUS server configurations"},
    "ldap_servers": {"type": "array", "required": true, "description": "LDAP server configurations"},
    "security_zones": {"type": "array", "required": true, "description": "Security zone configurations"},
    "security_rules": {"type": "array", "required": true, "description": "Security policy rules"},
    "antivirus_profile": {"type": "string", "default": "strict", "description": "Antivirus profile name"},
    "antispyware_profile": {"type": "string", "default": "strict", "description": "Anti-spyware profile name"},
    "user_mapping_timeout": {"type": "number", "default": 28800, "description": "User mapping timeout in seconds"}
  }',
  '["user_id", "threat_prevention", "application_control", "url_filtering", "wildfire"]',
  '["next_generation_firewall", "user_identification", "application_visibility", "threat_prevention", "content_inspection"]',
  '["Configure User-ID properly", "Use application-based policies", "Enable threat prevention", "Monitor user activity"]',
  '["show user ip-user-mapping all", "show session all", "show system info", "show jobs processed"]',
  '["paloalto", "ngfw", "user-id", "802.1x", "threat-prevention", "enterprise"]',
  true,
  false,
  9.4,
  'expert'
);

-- Add wizard steps for all new templates
INSERT INTO config_wizard_steps (
  template_id,
  step_order,
  step_name,
  step_description,
  step_type,
  required_fields,
  validation_rules,
  help_content
) 
SELECT 
  ct.id,
  1,
  'Authentication Servers',
  'Configure RADIUS and authentication server settings',
  'servers',
  CASE 
    WHEN ct.category = 'cisco' THEN '["ise_primary_ip", "ise_secondary_ip", "ise_primary_key", "ise_secondary_key"]'::jsonb
    WHEN ct.category = 'aruba' THEN '["service_name", "radius_servers", "ldap_servers"]'::jsonb
    WHEN ct.category = 'fortinet' THEN '["radius_primary_ip", "radius_secondary_ip", "radius_primary_key"]'::jsonb
    WHEN ct.category = 'paloalto' THEN '["user_id_agents", "radius_servers", "ldap_servers"]'::jsonb
    ELSE '[]'::jsonb
  END,
  '{"required": true, "format": "servers"}'::jsonb,
  'Configure your authentication infrastructure servers and connection parameters'
FROM configuration_templates ct 
WHERE ct.category IN ('cisco', 'aruba', 'fortinet', 'paloalto')
AND NOT EXISTS (
  SELECT 1 FROM config_wizard_steps cws 
  WHERE cws.template_id = ct.id AND cws.step_order = 1
);

-- Add network and security steps for all templates
INSERT INTO config_wizard_steps (
  template_id,
  step_order,
  step_name,
  step_description,
  step_type,
  required_fields,
  validation_rules,
  help_content
) 
SELECT 
  ct.id,
  generate_series(2, 4),
  CASE generate_series(2, 4)
    WHEN 2 THEN 'Network Configuration'
    WHEN 3 THEN 'Security Policies'
    WHEN 4 THEN 'Advanced Features'
  END,
  CASE generate_series(2, 4)
    WHEN 2 THEN 'Configure VLANs, interfaces, and network topology'
    WHEN 3 THEN 'Define security policies and access control'
    WHEN 4 THEN 'Enable advanced security and monitoring features'
  END,
  CASE generate_series(2, 4)
    WHEN 2 THEN 'network'
    WHEN 3 THEN 'security'
    WHEN 4 THEN 'advanced'
  END,
  CASE generate_series(2, 4)
    WHEN 2 THEN '["vlans", "interfaces", "routing"]'::jsonb
    WHEN 3 THEN '["policies", "acls", "user_groups"]'::jsonb
    WHEN 4 THEN '["monitoring", "logging", "advanced_features"]'::jsonb
  END,
  '{"required": true}'::jsonb,
  CASE generate_series(2, 4)
    WHEN 2 THEN 'Define your network architecture and VLAN structure'
    WHEN 3 THEN 'Create security policies and access control rules'
    WHEN 4 THEN 'Configure monitoring, logging, and advanced security features'
  END
FROM configuration_templates ct 
WHERE ct.category IN ('cisco', 'aruba', 'fortinet', 'paloalto')
AND NOT EXISTS (
  SELECT 1 FROM config_wizard_steps cws 
  WHERE cws.template_id = ct.id AND cws.step_order = generate_series(2, 4)
);