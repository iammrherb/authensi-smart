-- Add more specialized configuration templates for different scenarios

INSERT INTO configuration_templates (
    name, description, vendor_id, category, configuration_type, complexity_level,
    template_content, template_variables, supported_scenarios, authentication_methods,
    required_features, security_features, best_practices, troubleshooting_guide,
    validation_commands, tags, is_public, is_validated, created_by
) VALUES 

-- Cisco ISE Integration Template
(
    'Cisco Catalyst 9300 - ISE Integration with TrustSec',
    'Complete Cisco ISE integration with TrustSec SGT tagging and dynamic authorization',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1),
    'Authentication',
    'ISE-TrustSec',
    'expert',
    '! Cisco ISE Integration with TrustSec Configuration
! Enable AAA with ISE
aaa new-model
aaa authentication dot1x default group ${ise_group}
aaa authorization network default group ${ise_group}
aaa authorization auth-proxy default group ${ise_group}
aaa accounting dot1x default start-stop group ${ise_group}
aaa accounting update newinfo periodic 2880

! Define ISE server group
aaa group server radius ${ise_group}
 server name ${ise_primary_server}
 server name ${ise_secondary_server}
 ip radius source-interface ${source_interface}

! ISE RADIUS servers
radius server ${ise_primary_server}
 address ipv4 ${ise_primary_ip} auth-port 1812 acct-port 1813
 automate-tester username ${test_username} probe-on
 key ${ise_shared_secret}
 retransmit 3
 timeout 5

radius server ${ise_secondary_server}
 address ipv4 ${ise_secondary_ip} auth-port 1812 acct-port 1813
 key ${ise_shared_secret}
 retransmit 3
 timeout 5

! Enable TrustSec
cts authorization list ${authorization_list}
cts role-based enforcement

! CoA for dynamic authorization
aaa server radius dynamic-author
 client ${ise_primary_ip} server-key ${coa_shared_secret}
 client ${ise_secondary_ip} server-key ${coa_shared_secret}

! 802.1X global configuration
dot1x system-auth-control
dot1x critical eapol

! Interface configuration for TrustSec
interface ${interface_range}
 authentication host-mode multi-domain
 authentication order dot1x mab webauth
 authentication priority dot1x mab webauth
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate ${reauth_timer}
 authentication timer inactivity ${inactivity_timer}
 authentication violation restrict
 dot1x pae authenticator
 dot1x timeout tx-period 10
 dot1x max-reauth-req 2
 mab
 cts manual
  policy static sgt ${default_sgt} trusted',
    '{"ise_group": "ISE_SERVERS", "ise_primary_server": "ISE-PRIMARY", "ise_secondary_server": "ISE-SECONDARY", "ise_primary_ip": "192.168.1.101", "ise_secondary_ip": "192.168.1.102", "ise_shared_secret": "ise_shared_secret", "coa_shared_secret": "ise_coa_secret", "source_interface": "Vlan100", "test_username": "ise-test", "authorization_list": "ISE_AUTH_LIST", "interface_range": "range GigabitEthernet1/0/1-48", "reauth_timer": "3600", "inactivity_timer": "300", "default_sgt": "10"}',
    '["Enterprise Security", "ISE Integration", "TrustSec", "SGT Tagging", "Advanced Authentication"]',
    '["802.1X", "MAB", "WebAuth", "ISE", "TrustSec", "EAP-TLS", "PEAP", "EAP-FAST"]',
    '["Cisco ISE", "TrustSec License", "SGT Propagation", "Dynamic Authorization"]',
    '["Security Group Tagging", "Dynamic Policy Enforcement", "Profiling", "Posture Assessment", "Guest Access"]',
    '["Configure ISE servers in HA pair", "Enable TrustSec for SGT enforcement", "Configure proper authorization lists", "Use CoA for real-time policy changes", "Implement proper SGT assignment strategy"]',
    '[{"issue": "SGT not assigned", "solution": "Check ISE authorization policy and SGT mappings"}, {"issue": "TrustSec not enforcing", "solution": "Verify cts role-based enforcement and SGACLs"}, {"issue": "ISE server unreachable", "solution": "Check network connectivity and server status"}]',
    '["show cts role-based permissions", "show authentication sessions", "show cts environment-data", "show aaa servers", "debug dot1x events"]',
    '["cisco", "ise", "trustsec", "sgt", "advanced", "enterprise"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Generic RADIUS Template for Any Vendor
(
    'Generic 802.1X RADIUS Configuration',
    'Vendor-agnostic 802.1X configuration template with RADIUS authentication for Portnox integration',
    NULL,
    'Authentication',
    '802.1X',
    'beginner',
    'Generic 802.1X Configuration Template
=====================================

This template provides the essential configuration elements needed for 802.1X authentication with RADIUS.
Adapt the syntax based on your specific network equipment vendor.

## RADIUS Server Configuration
Primary RADIUS Server: ${radius_server_ip}
Shared Secret: ${radius_shared_secret}
Authentication Port: 1812
Accounting Port: 1813

## 802.1X Global Settings
- Enable 802.1X globally on the device
- Configure RADIUS as the authentication method
- Set authentication timeouts appropriately

## Interface Configuration
Ports: ${interface_range}
- Enable 802.1X authenticator mode
- Set port control to auto
- Configure re-authentication timer: ${reauth_timer} seconds
- Enable periodic re-authentication

## VLAN Configuration
Default VLAN: ${default_vlan}
Data VLAN: ${data_vlan}
Voice VLAN: ${voice_vlan}
Guest VLAN: ${guest_vlan}

## Authentication Methods
1. 802.1X (Primary)
2. MAC Authentication Bypass (Fallback)
3. Web Authentication (Guest)

## Recommended Settings
- Quiet Period: 60 seconds
- TX Period: 30 seconds
- Supplicant Timeout: 30 seconds
- Server Timeout: 30 seconds
- Max Requests: 2

Consult your vendor documentation for specific CLI syntax.',
    '{"radius_server_ip": "192.168.1.100", "radius_shared_secret": "portnox_secret", "interface_range": "1-48", "reauth_timer": "3600", "default_vlan": "1", "data_vlan": "10", "voice_vlan": "20", "guest_vlan": "30"}',
    '["Any Network", "Basic Security", "Portnox Integration", "Generic Setup"]',
    '["802.1X", "RADIUS", "MAC Authentication", "EAP-TLS", "PEAP", "EAP-TTLS"]',
    '["RADIUS Server", "Certificate Authority", "Network Infrastructure"]',
    '["Dynamic VLAN Assignment", "MAC Authentication Bypass", "Guest Network Access"]',
    '["Consult vendor documentation for syntax", "Test with known working certificate", "Configure proper VLAN strategy", "Enable logging for troubleshooting", "Use vendor-specific best practices"]',
    '[{"issue": "Vendor-specific syntax", "solution": "Refer to vendor CLI guide for exact commands"}, {"issue": "Authentication not working", "solution": "Check RADIUS connectivity and shared secret"}, {"issue": "VLAN assignment fails", "solution": "Verify VLAN configuration and RADIUS attributes"}]',
    '["Check vendor documentation", "Test RADIUS connectivity", "Verify 802.1X status", "Monitor authentication logs"]',
    '["generic", "802.1x", "radius", "portnox", "universal", "template"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Fortinet FortiSwitch Template
(
    'FortiSwitch - 802.1X with FortiGate Integration',
    'FortiSwitch 802.1X configuration with FortiGate as RADIUS server and policy enforcement',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Fortinet%' LIMIT 1),
    'Authentication',
    '802.1X',
    'intermediate',
    '# FortiSwitch 802.1X Configuration with FortiGate Integration
# Configure FortiGate as RADIUS server
config user radius
    edit "${fortigate_radius_name}"
        set server "${fortigate_ip}"
        set secret "${radius_shared_secret}"
        set radius-port 1812
        set acct-port 1813
        set timeout 5
        set all-usergroup enable
    next
end

# Configure 802.1X settings
config switch-controller security-policy 802-1X
    edit "${security_policy_name}"
        set user-group "${user_group_name}"
        set mac-auth-bypass enable
        set open-auth enable
        set eap-passthru enable
        set guest-vlan enable
        set guest-vlan-id ${guest_vlan_id}
        set auth-fail-vlan enable
        set auth-fail-vlan-id ${auth_fail_vlan_id}
        set framevid-apply enable
    next
end

# Apply to interfaces
config switch-controller managed-switch
    edit "${switch_serial}"
        config ports
            edit "${port_range}"
                set policy "${security_policy_name}"
                set description "802.1X Authentication Port"
                set status up
                set type physical
            next
        end
    next
end

# Configure VLANs
config system interface
    edit "${data_vlan_interface}"
        set vdom "root"
        set type vlan
        set vlanid ${data_vlan_id}
        set interface "${trunk_interface}"
        set ip ${data_vlan_ip} ${data_vlan_mask}
        set allowaccess ping https ssh
        set description "Data VLAN"
    next
end

config system interface
    edit "${voice_vlan_interface}"
        set vdom "root"
        set type vlan
        set vlanid ${voice_vlan_id}
        set interface "${trunk_interface}"
        set ip ${voice_vlan_ip} ${voice_vlan_mask}
        set description "Voice VLAN"
    next
end

# Configure user groups
config user group
    edit "${user_group_name}"
        set group-type firewall
        config member
            edit "${radius_group_name}"
                set server-name "${fortigate_radius_name}"
            next
        end
    next
end',
    '{"fortigate_radius_name": "FortiGate-RADIUS", "fortigate_ip": "192.168.1.99", "radius_shared_secret": "fortinet_secret", "security_policy_name": "AUTH_POLICY", "user_group_name": "AUTHENTICATED_USERS", "radius_group_name": "RADIUS_USERS", "switch_serial": "FS148F-SERIAL", "port_range": "port1-port48", "guest_vlan_id": "30", "auth_fail_vlan_id": "999", "data_vlan_interface": "data_vlan", "data_vlan_id": "10", "data_vlan_ip": "192.168.10.1", "data_vlan_mask": "255.255.255.0", "voice_vlan_interface": "voice_vlan", "voice_vlan_id": "20", "voice_vlan_ip": "192.168.20.1", "voice_vlan_mask": "255.255.255.0", "trunk_interface": "internal"}',
    '["Fortinet Security Fabric", "Integrated Security", "Campus Network"]',
    '["802.1X", "MAC Authentication Bypass", "RADIUS", "EAP-TLS", "PEAP"]',
    '["FortiGate", "FortiSwitch", "Fortinet Security Fabric", "RADIUS Server"]',
    '["Security Fabric Integration", "Dynamic VLAN Assignment", "Guest Network", "Authentication Failure Handling"]',
    '["Configure FortiGate first before FortiSwitch", "Use Security Fabric for centralized management", "Enable MAC auth bypass for IoT devices", "Configure proper VLAN strategy", "Test authentication flow end-to-end"]',
    '[{"issue": "Authentication not working", "solution": "Check FortiGate RADIUS configuration and user groups"}, {"issue": "VLAN assignment fails", "solution": "Verify VLAN configuration on FortiGate and switch"}, {"issue": "Security Fabric issues", "solution": "Check FortiGate and FortiSwitch connectivity and authorization"}]',
    '["diagnose test authserver radius", "get switch-controller managed-switch", "get user group", "get switch-controller security-policy"]',
    '["fortinet", "fortiswitch", "fortigate", "802.1x", "security-fabric"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Ubiquiti UniFi Template
(
    'UniFi Switch - 802.1X with UniFi Controller Integration',
    'UniFi switch 802.1X configuration managed through UniFi Network Controller',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Ubiquiti%' LIMIT 1),
    'Authentication',
    '802.1X',
    'beginner',
    'UniFi Switch 802.1X Configuration
=================================

This configuration is managed through the UniFi Network Controller web interface.
Follow these steps to configure 802.1X authentication:

## RADIUS Server Configuration
1. Navigate to Settings > Profiles > RADIUS
2. Create new RADIUS profile:
   - Name: ${radius_profile_name}
   - IP Address: ${radius_server_ip}
   - Port: 1812
   - Shared Secret: ${radius_shared_secret}
   - Accounting Port: 1813

## 802.1X Profile Configuration
1. Navigate to Settings > Profiles > Switch Port
2. Create new Switch Port Profile:
   - Name: ${port_profile_name}
   - Port Isolation: Disabled
   - 802.1X Control: Auto
   - RADIUS Profile: ${radius_profile_name}
   - RADIUS MAC Authentication: ${mac_auth_enabled}

## VLAN Configuration
1. Navigate to Settings > Networks
2. Create VLANs:
   - Data VLAN: ID ${data_vlan_id}, Name "${data_vlan_name}"
   - Voice VLAN: ID ${voice_vlan_id}, Name "${voice_vlan_name}"
   - Guest VLAN: ID ${guest_vlan_id}, Name "${guest_vlan_name}"

## Port Assignment
1. Navigate to Devices > Switch > Ports
2. Apply port profile "${port_profile_name}" to ports ${port_range}
3. Set Native VLAN to ${default_vlan_id}

## Guest Access Configuration
1. Create Guest Portal profile
2. Configure Guest VLAN assignment
3. Set authentication timeout: ${auth_timeout} minutes

## Advanced Settings
- Re-authentication Period: ${reauth_period} seconds
- Idle Timeout: ${idle_timeout} minutes
- Session Timeout: ${session_timeout} minutes
- MAC Authentication Fallback: ${mac_auth_enabled}

Note: All configuration is done through the UniFi Controller GUI.
No direct CLI access is available on UniFi switches.',
    '{"radius_profile_name": "Portnox-RADIUS", "radius_server_ip": "192.168.1.100", "radius_shared_secret": "unifi_secret", "port_profile_name": "AUTH_PORTS", "mac_auth_enabled": "Enabled", "data_vlan_id": "10", "data_vlan_name": "Corporate", "voice_vlan_id": "20", "voice_vlan_name": "Voice", "guest_vlan_id": "30", "guest_vlan_name": "Guest", "port_range": "1-24", "default_vlan_id": "1", "auth_timeout": "30", "reauth_period": "3600", "idle_timeout": "15", "session_timeout": "480"}',
    '["Small Business", "SMB Network", "Controller-based Management", "Easy Setup"]',
    '["802.1X", "MAC Authentication", "Guest Portal", "RADIUS"]',
    '["UniFi Controller", "RADIUS Server", "Web Browser"]',
    '["Controller-based Management", "Guest Portal", "MAC Authentication Fallback", "VLAN Assignment"]',
    '["Configure through UniFi Controller only", "Test RADIUS connectivity first", "Create VLANs before assigning to profiles", "Use MAC auth for IoT devices", "Monitor through Controller dashboard"]',
    '[{"issue": "No CLI access", "solution": "All configuration must be done through UniFi Controller"}, {"issue": "Authentication not working", "solution": "Check RADIUS profile settings and server connectivity"}, {"issue": "VLAN assignment fails", "solution": "Verify VLAN configuration and profile assignments"}]',
    '["Use UniFi Controller dashboard", "Check device status in Controller", "Review authentication logs", "Test RADIUS connectivity"]',
    '["ubiquiti", "unifi", "controller", "802.1x", "gui-managed", "smb"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
);

-- Verify final template count
SELECT COUNT(*) as final_template_count FROM configuration_templates;