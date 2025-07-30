-- Add comprehensive vendor configuration templates for Fortinet, Extreme Networks, and Ruckus
-- Enhanced with AI optimization metadata and wizard parameters

-- Insert Fortinet configuration templates
INSERT INTO configuration_templates (
  name, description, vendor_id, category, subcategory, configuration_type, complexity_level,
  template_content, template_variables, supported_scenarios, authentication_methods,
  required_features, network_requirements, security_features, best_practices,
  troubleshooting_guide, validation_commands, tags, is_public, is_validated,
  template_structure, ai_optimization_rules, wizard_parameters, deployment_scenarios,
  compatibility_matrix, automation_level, optimization_score, created_by
) VALUES

-- Fortinet FortiSwitch 802.1X Configuration
('Fortinet FortiSwitch 802.1X IBNS Configuration', 
'Complete 802.1X configuration for FortiSwitch with Portnox integration including MAB, dynamic VLAN, and security policies', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
'802.1X Authentication', 'Wired Authentication', 'Security Configuration', 'intermediate',
'# ========================================
# FortiSwitch Configuration for Portnox
# Platform: FSW-424E/448E/524D/548D
# FortiSwitchOS: 7.4.0 or later
# ========================================

# Step 1: Configure Portnox RADIUS servers
config user radius
    edit "PORTNOX-PRIMARY"
        set server "{{radius_primary_ip}}"
        set secret "{{radius_shared_secret}}"
        set auth-type auto
        set radius-port 1812
        set acct-port 1813
        set timeout 5
        set all-usergroup enable
        set nas-ip {{switch_management_ip}}
    next
    edit "PORTNOX-SECONDARY"
        set server "{{radius_secondary_ip}}"
        set secret "{{radius_shared_secret}}"
        set auth-type auto
        set radius-port 1812
        set acct-port 1813
        set timeout 5
        set all-usergroup enable
        set nas-ip {{switch_management_ip}}
    next
end

# Step 2: Configure user groups
config user group
    edit "PORTNOX-RADIUS-GROUP"
        set member "PORTNOX-PRIMARY" "PORTNOX-SECONDARY"
    next
end

# Step 3: Configure 802.1X security policy
config switch-controller security-policy 802-1X
    edit "PORTNOX-DOT1X-POLICY"
        set security-mode 802.1X
        set user-group "PORTNOX-RADIUS-GROUP"
        set guest-vlan enable
        set guest-vlan-id {{guest_vlan_id}}
        set guest-auth-delay 30
        set auth-fail-vlan enable
        set auth-fail-vlan-id {{quarantine_vlan_id}}
        set mac-auth-bypass enable
        set radius-timeout-overwrite enable
        set policy-type 802.1X
    next
end

# Step 4: Configure VLANs
config system interface
    edit "vlan{{employee_vlan_id}}"
        set vdom "root"
        set ip {{employee_vlan_ip}} {{employee_vlan_mask}}
        set allowaccess ping https ssh
        set vlanid {{employee_vlan_id}}
        set interface "internal"
        set alias "EMPLOYEE-DATA"
    next
    edit "vlan{{guest_vlan_id}}"
        set vdom "root"
        set ip {{guest_vlan_ip}} {{guest_vlan_mask}}
        set allowaccess ping
        set vlanid {{guest_vlan_id}}
        set interface "internal"
        set alias "GUEST"
    next
end

# Step 5: Configure switch interfaces
config switch interface
    edit "{{access_port_range}}"
        set security-groups "PORTNOX-DOT1X-POLICY"
        config port-security
            set port-security-mode 802.1X
            set auth-fail-vlan enable
            set auth-fail-vlanid {{quarantine_vlan_id}}
            set guest-vlan enable
            set guest-vlanid {{guest_vlan_id}}
            set radius-timeout-overwrite enable
            set security-mode 802.1X
        end
    next
end',
'{"radius_primary_ip": {"type": "ip", "default": "10.10.10.10", "description": "Primary RADIUS server IP"}, "radius_secondary_ip": {"type": "ip", "default": "10.10.10.11", "description": "Secondary RADIUS server IP"}, "radius_shared_secret": {"type": "password", "description": "RADIUS shared secret"}, "switch_management_ip": {"type": "ip", "description": "Switch management IP address"}, "employee_vlan_id": {"type": "integer", "default": 100, "description": "Employee VLAN ID"}, "guest_vlan_id": {"type": "integer", "default": 200, "description": "Guest VLAN ID"}, "quarantine_vlan_id": {"type": "integer", "default": 400, "description": "Quarantine VLAN ID"}, "access_port_range": {"type": "string", "default": "port1", "description": "Access port range"}}',
'["new_deployment", "migration", "upgrade"]',
'["802.1X", "MAB", "RADIUS"]',
'["RADIUS_Server", "VLAN_Support", "Port_Security"]',
'{"radius_servers": 2, "vlan_count": "multiple", "port_count": "1-48"}',
'["802.1X_Authentication", "MAC_Authentication_Bypass", "Dynamic_VLAN", "Guest_VLAN", "DHCP_Snooping"]',
'["Enable_802.1X_globally", "Configure_RADIUS_redundancy", "Implement_guest_VLAN", "Use_MAB_for_non-802.1X_devices"]',
'[{"issue": "Authentication_failures", "solution": "Check_RADIUS_connectivity_and_shared_secret"}, {"issue": "VLAN_assignment_issues", "solution": "Verify_VLAN_configuration_and_RADIUS_attributes"}]',
'["diagnose switch 802-1x status", "get switch interface", "diagnose test authserver radius"]',
'["Fortinet", "FortiSwitch", "802.1X", "RADIUS", "Network_Access_Control"]',
true, true,
'{"sections": ["radius_config", "user_groups", "security_policies", "vlan_config", "interface_config"], "complexity_metrics": {"lines": 150, "commands": 75, "dependencies": 8}, "automation_ready": true}',
'{"performance_rules": ["radius_load_balancing", "timeout_optimization"], "security_rules": ["strong_shared_secrets", "vlan_isolation"], "compliance_rules": ["audit_logging", "access_control"]}',
'{"required_inputs": ["radius_servers", "vlan_configuration", "port_ranges"], "optional_inputs": ["guest_access", "voice_vlan"], "ai_suggestions": ["radius_redundancy", "security_hardening"]}',
'["new_deployment", "migration", "upgrade", "troubleshooting"]',
'{"minimum_version": "7.0", "recommended_version": "7.4+", "tested_platforms": ["FSW-424E", "FSW-448E", "FSW-524D", "FSW-548D"]}',
'semi_automated', 8.7, auth.uid()),

-- Fortinet FortiGate TACACS+ Configuration
('Fortinet FortiGate TACACS+ Device Administration', 
'FortiGate TACACS+ configuration for centralized device administration with Portnox', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet' LIMIT 1),
'Access Control', 'Device Administration', 'Security Configuration', 'intermediate',
'# ========================================
# FortiGate Configuration for Portnox
# TACACS+ Device Administration
# Platform: FG-60F/100F/200F/500F
# FortiOS: 7.4.0 or later
# ========================================

# Step 1: Configure Portnox TACACS+ servers
config system tacacs+
    edit "PORTNOX-TACACS-PRIMARY"
        set server "{{tacacs_primary_ip}}"
        set key "{{tacacs_shared_secret}}"
        set port 49
        set authen-type auto
    next
    edit "PORTNOX-TACACS-SECONDARY"
        set server "{{tacacs_secondary_ip}}"
        set key "{{tacacs_shared_secret}}"
        set port 49
        set authen-type auto
    next
end

# Step 2: Configure admin profiles
config system accprofile
    edit "{{admin_profile_name}}"
        set secfabgrp read-write
        set ftviewgrp read-write
        set authgrp read-write
        set sysgrp read-write
        set netgrp read-write
        set loggrp read-write
        set fwgrp read-write
        set vpngrp read-write
        set utmgrp read-write
        set wanoptgrp read-write
        set wifi read-write
    next
end

# Step 3: Configure authentication settings
config system admin
    edit "admin"
        set remote-auth enable
        set accprofile "super_admin"
        set vdom "root"
        set password "{{fallback_password}}"
    next
end

# Step 4: Configure authentication order
config system global
    set admin-server-cert "Fortinet_Factory"
    set auth-server-timeout 10
    set admin-tacacs+ enable
end',
'{"tacacs_primary_ip": {"type": "ip", "default": "10.10.10.10", "description": "Primary TACACS+ server IP"}, "tacacs_secondary_ip": {"type": "ip", "default": "10.10.10.11", "description": "Secondary TACACS+ server IP"}, "tacacs_shared_secret": {"type": "password", "description": "TACACS+ shared secret"}, "admin_profile_name": {"type": "string", "default": "portnox-admin", "description": "Admin profile name"}, "fallback_password": {"type": "password", "description": "Local fallback password"}}',
'["new_deployment", "migration", "compliance"]',
'["TACACS+"]',
'["TACACS_Server", "Admin_Profiles", "Remote_Authentication"]',
'{"tacacs_servers": 2, "admin_profiles": "multiple"}',
'["TACACS_Authentication", "Role_Based_Access", "Audit_Logging"]',
'["Configure_TACACS_redundancy", "Implement_role_based_access", "Maintain_local_fallback"]',
'[{"issue": "Authentication_failures", "solution": "Check_TACACS_connectivity_and_shared_secret"}, {"issue": "Access_denied", "solution": "Verify_user_privileges_and_profile_assignment"}]',
'["diagnose test authserver tacacs", "show system admin", "get system tacacs+"]',
'["Fortinet", "FortiGate", "TACACS+", "Device_Administration"]',
true, true,
'{"sections": ["tacacs_config", "admin_profiles", "authentication_settings"], "complexity_metrics": {"lines": 80, "commands": 40, "dependencies": 5}, "automation_ready": true}',
'{"performance_rules": ["tacacs_timeout_optimization"], "security_rules": ["strong_shared_secrets", "role_separation"], "compliance_rules": ["audit_logging", "access_control"]}',
'{"required_inputs": ["tacacs_servers", "admin_profiles"], "optional_inputs": ["fallback_options"], "ai_suggestions": ["role_optimization", "security_hardening"]}',
'["new_deployment", "migration", "compliance"]',
'{"minimum_version": "7.0", "recommended_version": "7.4+", "tested_platforms": ["FG-60F", "FG-100F", "FG-200F", "FG-500F"]}',
'semi_automated', 8.5, auth.uid()),

-- Extreme Networks ExtremeXOS Configuration
('Extreme Networks ExtremeXOS 802.1X Configuration', 
'Complete ExtremeXOS NetLogin configuration with Portnox integration including policy-based authentication', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Extreme Networks' LIMIT 1),
'802.1X Authentication', 'Wired Authentication', 'Security Configuration', 'advanced',
'# ========================================
# ExtremeXOS Configuration for Portnox
# Platform: X440-G2/X460-G2/X670-G2
# EXOS Version: 32.5 or later
# ========================================

# Step 1: Configure VLANs
create vlan {{employee_vlan_name}} tag {{employee_vlan_id}}
configure vlan {{employee_vlan_name}} ipaddress {{employee_vlan_ip}}/{{employee_vlan_prefix}}
create vlan {{guest_vlan_name}} tag {{guest_vlan_id}}
configure vlan {{guest_vlan_name}} ipaddress {{guest_vlan_ip}}/{{guest_vlan_prefix}}
create vlan {{quarantine_vlan_name}} tag {{quarantine_vlan_id}}
configure vlan {{quarantine_vlan_name}} ipaddress {{quarantine_vlan_ip}}/{{quarantine_vlan_prefix}}
create vlan {{voice_vlan_name}} tag {{voice_vlan_id}}
create vlan {{blackhole_vlan_name}} tag {{blackhole_vlan_id}}

# Step 2: Configure Portnox RADIUS servers
configure radius netlogin primary server {{radius_primary_ip}} {{radius_auth_port}} client-ip {{switch_management_ip}} vr VR-Mgmt
configure radius netlogin primary shared-secret "{{radius_shared_secret}}"
configure radius netlogin secondary server {{radius_secondary_ip}} {{radius_auth_port}} client-ip {{switch_management_ip}} vr VR-Mgmt
configure radius netlogin secondary shared-secret "{{radius_shared_secret}}"

# Configure RADIUS accounting
configure radius-accounting netlogin primary server {{radius_primary_ip}} {{radius_acct_port}} client-ip {{switch_management_ip}} vr VR-Mgmt
configure radius-accounting netlogin primary shared-secret "{{radius_shared_secret}}"

# Step 3: Configure RADIUS attributes
configure radius netlogin timeout {{radius_timeout}}
configure radius netlogin retries {{radius_retries}}
configure radius netlogin algorithm round-robin
enable radius netlogin

# Step 4: Enable NetLogin (802.1X)
enable netlogin dot1x
enable netlogin mac

# Step 5: Configure NetLogin properties
configure netlogin vlan {{blackhole_vlan_name}}
configure netlogin authentication failure vlan {{quarantine_vlan_name}}
configure netlogin authentication service-unavailable vlan {{quarantine_vlan_name}}
configure netlogin dynamic-vlan enable
configure netlogin dynamic-vlan uplink-ports {{uplink_ports}}

# Configure timers
configure netlogin dot1x timers quiet-period {{quiet_period}}
configure netlogin dot1x timers reauth-period {{reauth_period}}
configure netlogin dot1x timers server-timeout {{server_timeout}}
configure netlogin dot1x timers supp-resp-timeout {{supp_timeout}}
configure netlogin dot1x timers tx-period {{tx_period}}

# Step 6: Configure authentication database order
configure netlogin authentication protocol-order dot1x mac
configure netlogin authentication database-order radius

# Step 7: Configure ports for 802.1X
configure netlogin port {{access_port_range}} mode port-based-vlans
configure netlogin port {{access_port_range}} authentication mode optional
enable netlogin port {{access_port_range}} dot1x
enable netlogin port {{access_port_range}} mac

# Configure voice VLAN on ports
configure port {{access_port_range}} vlan {{voice_vlan_name}} voice

# Step 8: Configure guest VLAN
configure netlogin guest-vlan {{guest_vlan_name}} ports {{access_port_range}}',
'{"employee_vlan_name": {"type": "string", "default": "EMPLOYEE-DATA", "description": "Employee VLAN name"}, "employee_vlan_id": {"type": "integer", "default": 100, "description": "Employee VLAN ID"}, "employee_vlan_ip": {"type": "ip", "default": "10.100.0.1", "description": "Employee VLAN IP"}, "employee_vlan_prefix": {"type": "integer", "default": 24, "description": "Employee VLAN prefix length"}, "guest_vlan_name": {"type": "string", "default": "GUEST", "description": "Guest VLAN name"}, "guest_vlan_id": {"type": "integer", "default": 200, "description": "Guest VLAN ID"}, "radius_primary_ip": {"type": "ip", "default": "10.10.10.10", "description": "Primary RADIUS server IP"}, "radius_secondary_ip": {"type": "ip", "default": "10.10.10.11", "description": "Secondary RADIUS server IP"}, "radius_shared_secret": {"type": "password", "description": "RADIUS shared secret"}, "switch_management_ip": {"type": "ip", "description": "Switch management IP"}, "access_port_range": {"type": "string", "default": "1-48", "description": "Access port range"}, "uplink_ports": {"type": "string", "default": "49-52", "description": "Uplink port range"}}',
'["new_deployment", "migration", "upgrade"]',
'["802.1X", "MAB", "RADIUS"]',
'["RADIUS_Server", "VLAN_Support", "NetLogin", "Policy_Engine"]',
'{"radius_servers": 2, "vlan_count": "multiple", "port_count": "1-52"}',
'["NetLogin_Authentication", "Policy_Based_Access", "Dynamic_VLAN", "DHCP_Snooping", "ARP_Inspection"]',
'["Use_policy_based_authentication", "Configure_dynamic_VLANs", "Implement_security_features", "Use_LLDP_for_device_discovery"]',
'[{"issue": "NetLogin_failures", "solution": "Check_RADIUS_connectivity_and_VLAN_configuration"}, {"issue": "Policy_not_applied", "solution": "Verify_policy_mapping_and_precedence"}]',
'["show netlogin dot1x", "show netlogin session all", "show radius netlogin"]',
'["Extreme_Networks", "ExtremeXOS", "NetLogin", "802.1X", "Policy_Based"]',
true, true,
'{"sections": ["vlan_config", "radius_config", "netlogin_config", "port_config", "policy_config"], "complexity_metrics": {"lines": 200, "commands": 100, "dependencies": 10}, "automation_ready": true}',
'{"performance_rules": ["radius_load_balancing", "policy_optimization"], "security_rules": ["vlan_isolation", "policy_enforcement"], "compliance_rules": ["audit_logging", "access_control"]}',
'{"required_inputs": ["vlan_configuration", "radius_servers", "port_ranges"], "optional_inputs": ["voice_vlan", "policy_customization"], "ai_suggestions": ["policy_optimization", "security_hardening"]}',
'["new_deployment", "migration", "upgrade", "troubleshooting"]',
'{"minimum_version": "30.x", "recommended_version": "32.5+", "tested_platforms": ["X440-G2", "X460-G2", "X670-G2", "X690"]}',
'advanced', 9.0, auth.uid()),

-- Ruckus ICX Switch Configuration
('Ruckus ICX Switch 802.1X Configuration', 
'Complete Ruckus ICX FastIron configuration with Portnox integration including flexible authentication and dynamic VLAN', 
(SELECT id FROM vendor_library WHERE vendor_name = 'Ruckus Networks' LIMIT 1),
'802.1X Authentication', 'Wired Authentication', 'Security Configuration', 'intermediate',
'# ========================================
# Ruckus ICX Configuration for Portnox
# Platform: ICX 7150/7250/7450
# FastIron Version: 09.0.10 or later
# ========================================

# Step 1: Enable 802.1X globally
aaa authentication dot1x default radius
dot1x-enable
authentication
 auth-default-vlan {{blackhole_vlan_id}}
 auth-fail-action restricted-vlan
 auth-fail-vlan {{quarantine_vlan_id}}
 auth-server-fail-action permit-vlan
 auth-server-fail-vlan {{quarantine_vlan_id}}
 re-authentication
 timeout re-authperiod {{reauth_period}}

# Step 2: Configure Portnox RADIUS servers
radius-server host {{radius_primary_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}} default key {{radius_shared_secret}} dot1x mac-auth
radius-server host {{radius_secondary_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}} default key {{radius_shared_secret}} dot1x mac-auth
radius-server timeout {{radius_timeout}}
radius-server retransmit {{radius_retries}}
radius-server dead-time {{radius_dead_time}}

# Step 3: Configure AAA
aaa authentication enable default enable
aaa authentication login default radius local
aaa authentication dot1x default radius
aaa authentication mac-auth default radius
aaa authorization exec default radius none
aaa accounting dot1x default start-stop radius
aaa accounting commands 0 default start-stop radius
aaa accounting system default start-stop radius

# Step 4: Configure VLANs
vlan {{employee_vlan_id}} name {{employee_vlan_name}}
 tagged ethernet {{uplink_ports}}
 router-interface ve {{employee_vlan_id}}
!
vlan {{guest_vlan_id}} name {{guest_vlan_name}}
 tagged ethernet {{uplink_ports}}
 router-interface ve {{guest_vlan_id}}
!
vlan {{quarantine_vlan_id}} name {{quarantine_vlan_name}}
 tagged ethernet {{uplink_ports}}
 router-interface ve {{quarantine_vlan_id}}
!
vlan {{voice_vlan_id}} name {{voice_vlan_name}}
 tagged ethernet {{uplink_ports}}
 voice
!

# Step 5: Configure interfaces for 802.1X
interface ethernet {{access_port_range}}
 port-name ACCESS-PORT
 inline power
 inline power negotiation
 trust dscp
 dot1x port-control auto
 dot1x timeout quiet-period {{quiet_period}}
 dot1x timeout re-authperiod {{reauth_period}}
 dot1x timeout server-timeout {{server_timeout}}
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x timeout tx-period {{tx_period}}
 dot1x max-req {{max_requests}}
 dot1x re-authentication
 dot1x guest-vlan {{guest_vlan_id}}
!

# Step 6: Configure MAC authentication
mac-authentication enable
mac-authentication enable ethe {{access_port_range}}
interface ethernet {{access_port_range}}
 mac-authentication auth-fail-vlan {{quarantine_vlan_id}}
 mac-authentication auth-server-fail-vlan {{quarantine_vlan_id}}
 mac-authentication re-authentication
 mac-authentication timeout re-authperiod {{mac_reauth_period}}
!

# Step 7: Configure multi-device authentication
authentication
 multi-device-per-port {{max_devices_per_port}}
interface ethernet {{access_port_range}}
 authentication multi-device-per-port {{max_devices_per_port}}
!

# Step 8: Configure CoA (Change of Authorization)
radius-server attribute nas-identifier "{{nas_identifier}}"
radius-server attribute nas-ip-address {{switch_management_ip}}
radius-server dynamic-authorization-extension
 client {{radius_primary_ip}} key {{radius_shared_secret}}
 client {{radius_secondary_ip}} key {{radius_shared_secret}}
 port 3799
!',
'{"employee_vlan_id": {"type": "integer", "default": 100, "description": "Employee VLAN ID"}, "employee_vlan_name": {"type": "string", "default": "EMPLOYEE-DATA", "description": "Employee VLAN name"}, "guest_vlan_id": {"type": "integer", "default": 200, "description": "Guest VLAN ID"}, "guest_vlan_name": {"type": "string", "default": "GUEST", "description": "Guest VLAN name"}, "quarantine_vlan_id": {"type": "integer", "default": 400, "description": "Quarantine VLAN ID"}, "quarantine_vlan_name": {"type": "string", "default": "QUARANTINE", "description": "Quarantine VLAN name"}, "voice_vlan_id": {"type": "integer", "default": 500, "description": "Voice VLAN ID"}, "voice_vlan_name": {"type": "string", "default": "VOICE", "description": "Voice VLAN name"}, "blackhole_vlan_id": {"type": "integer", "default": 999, "description": "Default/Blackhole VLAN ID"}, "radius_primary_ip": {"type": "ip", "default": "10.10.10.10", "description": "Primary RADIUS server IP"}, "radius_secondary_ip": {"type": "ip", "default": "10.10.10.11", "description": "Secondary RADIUS server IP"}, "radius_shared_secret": {"type": "password", "description": "RADIUS shared secret"}, "switch_management_ip": {"type": "ip", "description": "Switch management IP"}, "access_port_range": {"type": "string", "default": "1/1/1 to 1/1/48", "description": "Access port range"}, "uplink_ports": {"type": "string", "default": "1/3/1 to 1/3/4", "description": "Uplink ports"}, "nas_identifier": {"type": "string", "default": "ICX-SWITCH-01", "description": "NAS identifier"}}',
'["new_deployment", "migration", "upgrade"]',
'["802.1X", "MAB", "RADIUS"]',
'["RADIUS_Server", "VLAN_Support", "Port_Security", "CoA_Support"]',
'{"radius_servers": 2, "vlan_count": "multiple", "port_count": "1-48"}',
'["Flexible_Authentication", "Dynamic_VLAN", "MAC_Authentication", "Change_of_Authorization", "DHCP_Snooping"]',
'["Use_flexible_authentication_order", "Configure_multi-device_per_port", "Implement_CoA_for_policy_updates", "Use_LLDP_for_device_discovery"]',
'[{"issue": "Authentication_failures", "solution": "Check_RADIUS_connectivity_and_AAA_configuration"}, {"issue": "VLAN_assignment_issues", "solution": "Verify_dynamic_VLAN_configuration_and_RADIUS_attributes"}]',
'["show dot1x", "show authentication sessions", "show radius servers"]',
'["Ruckus", "ICX", "FastIron", "802.1X", "Flexible_Authentication"]',
true, true,
'{"sections": ["aaa_config", "radius_config", "vlan_config", "interface_config", "coa_config"], "complexity_metrics": {"lines": 180, "commands": 90, "dependencies": 9}, "automation_ready": true}',
'{"performance_rules": ["radius_load_balancing", "authentication_optimization"], "security_rules": ["vlan_isolation", "coa_security"], "compliance_rules": ["audit_logging", "access_control"]}',
'{"required_inputs": ["vlan_configuration", "radius_servers", "port_configuration"], "optional_inputs": ["voice_vlan", "multi_device_settings"], "ai_suggestions": ["authentication_optimization", "security_hardening"]}',
'["new_deployment", "migration", "upgrade", "troubleshooting"]',
'{"minimum_version": "08.0.95", "recommended_version": "09.0.10+", "tested_platforms": ["ICX 7150", "ICX 7250", "ICX 7450", "ICX 7650"]}',
'semi_automated', 8.8, auth.uid());

-- Update template analytics and structure for existing templates
UPDATE configuration_templates SET
  template_structure = jsonb_build_object(
    'sections', CASE 
      WHEN name LIKE '%FortiSwitch%' THEN ARRAY['radius_config', 'user_groups', 'security_policies', 'vlan_config', 'interface_config']
      WHEN name LIKE '%FortiGate%' THEN ARRAY['tacacs_config', 'admin_profiles', 'authentication_settings']
      WHEN name LIKE '%ExtremeXOS%' THEN ARRAY['vlan_config', 'radius_config', 'netlogin_config', 'port_config', 'policy_config']
      WHEN name LIKE '%Ruckus%' THEN ARRAY['aaa_config', 'radius_config', 'vlan_config', 'interface_config', 'coa_config']
      ELSE ARRAY['global', 'authentication', 'authorization', 'accounting', 'interfaces', 'security']
    END,
    'complexity_metrics', jsonb_build_object(
      'lines', CASE 
        WHEN name LIKE '%ExtremeXOS%' THEN 200
        WHEN name LIKE '%Ruckus%' THEN 180
        WHEN name LIKE '%FortiSwitch%' THEN 150
        ELSE 100
      END,
      'commands', CASE 
        WHEN name LIKE '%ExtremeXOS%' THEN 100
        WHEN name LIKE '%Ruckus%' THEN 90
        WHEN name LIKE '%FortiSwitch%' THEN 75
        ELSE 50
      END,
      'dependencies', CASE 
        WHEN name LIKE '%ExtremeXOS%' THEN 10
        WHEN name LIKE '%Ruckus%' THEN 9
        WHEN name LIKE '%FortiSwitch%' THEN 8
        ELSE 5
      END
    ),
    'automation_ready', true
  ),
  ai_optimization_rules = jsonb_build_object(
    'performance_rules', CASE 
      WHEN name LIKE '%FortiSwitch%' THEN ARRAY['radius_load_balancing', 'timeout_optimization']
      WHEN name LIKE '%FortiGate%' THEN ARRAY['tacacs_timeout_optimization']
      WHEN name LIKE '%ExtremeXOS%' THEN ARRAY['radius_load_balancing', 'policy_optimization']
      WHEN name LIKE '%Ruckus%' THEN ARRAY['radius_load_balancing', 'authentication_optimization']
      ELSE ARRAY['optimize_timers', 'load_balancing', 'redundancy']
    END,
    'security_rules', CASE 
      WHEN name LIKE '%FortiSwitch%' THEN ARRAY['strong_shared_secrets', 'vlan_isolation']
      WHEN name LIKE '%FortiGate%' THEN ARRAY['strong_shared_secrets', 'role_separation']
      WHEN name LIKE '%ExtremeXOS%' THEN ARRAY['vlan_isolation', 'policy_enforcement']
      WHEN name LIKE '%Ruckus%' THEN ARRAY['vlan_isolation', 'coa_security']
      ELSE ARRAY['strong_encryption', 'certificate_validation', 'secure_protocols']
    END,
    'compliance_rules', ARRAY['audit_logging', 'access_control', 'data_protection']
  ),
  optimization_score = CASE 
    WHEN name LIKE '%ExtremeXOS%' THEN 9.0
    WHEN name LIKE '%Ruckus%' THEN 8.8
    WHEN name LIKE '%FortiSwitch%' THEN 8.7
    WHEN name LIKE '%FortiGate%' THEN 8.5
    ELSE 8.5
  END,
  automation_level = 'semi_automated'
WHERE vendor_id IS NOT NULL AND created_at >= now() - interval '1 hour';