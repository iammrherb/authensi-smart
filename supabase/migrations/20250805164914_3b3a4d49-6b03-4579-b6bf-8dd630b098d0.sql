-- Clear existing templates and related data with CASCADE
TRUNCATE TABLE configuration_templates CASCADE;

-- Insert comprehensive configuration templates for all vendors
INSERT INTO configuration_templates (
    name, description, vendor_id, category, configuration_type, complexity_level,
    template_content, template_variables, supported_scenarios, authentication_methods,
    required_features, security_features, best_practices, troubleshooting_guide,
    validation_commands, tags, is_public, is_validated, created_by
) VALUES 

-- Cisco Basic 802.1X Template
(
    'Cisco Catalyst 9300 - Basic 802.1X with RADIUS',
    'Basic 802.1X authentication setup for Cisco Catalyst 9300 series switches with RADIUS server integration',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1),
    'Authentication',
    '802.1X',
    'beginner',
    '! Basic 802.1X Configuration for Cisco Catalyst 9300
! Enable AAA services
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius

! RADIUS server configuration
radius server ${radius_server_name}
 address ipv4 ${radius_server_ip} auth-port 1812 acct-port 1813
 key ${radius_shared_secret}

! Enable 802.1X globally
dot1x system-auth-control

! Interface configuration template
interface ${interface_range}
 authentication host-mode multi-auth
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate ${reauth_timer}
 dot1x pae authenticator
 dot1x timeout tx-period 10

! VLAN assignments (optional)
interface vlan ${management_vlan}
 ip address ${management_ip} ${management_mask}
 no shutdown',
    '{"radius_server_name": "Portnox-Server", "radius_server_ip": "192.168.1.100", "radius_shared_secret": "shared_secret_here", "interface_range": "range GigabitEthernet1/0/1-24", "reauth_timer": "3600", "management_vlan": "100", "management_ip": "192.168.100.1", "management_mask": "255.255.255.0"}',
    '["Corporate Network", "Campus Deployment", "Basic Security"]',
    '["802.1X", "RADIUS", "EAP-TLS", "PEAP"]',
    '["RADIUS Server", "802.1X Capable Endpoints", "Certificate Infrastructure"]',
    '["Dynamic VLAN Assignment", "MAC Authentication Bypass", "Guest VLAN"]',
    '["Enable 802.1X globally before interface configuration", "Configure RADIUS server with proper shared secret", "Test authentication with known good device first", "Use multi-auth mode for multiple devices per port"]',
    '[{"issue": "Authentication failures", "solution": "Check RADIUS server connectivity and shared secret"}, {"issue": "Devices not getting network access", "solution": "Verify VLAN assignments and port-control settings"}]',
    '["show dot1x all", "show aaa servers", "show authentication sessions interface", "test aaa group radius"]',
    '["cisco", "catalyst-9300", "802.1x", "radius", "basic", "authentication"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Cisco Advanced 802.1X Template
(
    'Cisco Catalyst 9300 - Advanced 802.1X with Dynamic Authorization',
    'Advanced 802.1X setup with CoA, dynamic VLAN assignment, and multiple authentication methods',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1),
    'Authentication',
    '802.1X',
    'advanced',
    '! Advanced 802.1X Configuration for Cisco Catalyst 9300
! Enable AAA services with advanced features
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa authorization auth-proxy default group radius
aaa accounting dot1x default start-stop group radius
aaa server radius dynamic-author
 client ${radius_server_ip} server-key ${coa_shared_secret}

! RADIUS server configuration with CoA
radius server ${radius_server_name}
 address ipv4 ${radius_server_ip} auth-port 1812 acct-port 1813
 automate-tester username ${test_username} probe-on
 key ${radius_shared_secret}
 retransmit 3
 timeout 5

! Enable 802.1X globally with advanced settings
dot1x system-auth-control
dot1x critical eapol

! Device tracking for advanced features
device-tracking tracking
device-tracking policy IPDT_POLICY
 tracking enable

! Interface configuration with advanced features
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
 device-tracking attach-policy IPDT_POLICY',
    '{"radius_server_name": "Portnox-Server", "radius_server_ip": "192.168.1.100", "radius_shared_secret": "shared_secret_here", "coa_shared_secret": "coa_secret_here", "test_username": "test-user", "interface_range": "range GigabitEthernet1/0/1-48", "reauth_timer": "3600", "inactivity_timer": "300"}',
    '["Enterprise Network", "Campus Deployment", "Advanced Security", "Dynamic Authorization"]',
    '["802.1X", "MAB", "WebAuth", "RADIUS", "EAP-TLS", "PEAP", "EAP-TTLS"]',
    '["RADIUS Server with CoA", "Dynamic VLAN Assignment", "Device Tracking", "Multi-Domain Authentication"]',
    '["Change of Authorization (CoA)", "Dynamic VLAN Assignment", "MAC Authentication Bypass", "Web Authentication", "Guest VLAN", "Quarantine VLAN"]',
    '["Configure CoA before enabling on interfaces", "Use multi-domain for voice and data on same port", "Implement proper VLAN strategy for different device types", "Enable device tracking for IP-to-MAC binding", "Configure proper violation actions"]',
    '[{"issue": "CoA not working", "solution": "Verify CoA shared secret and server configuration"}, {"issue": "Devices not getting correct VLAN", "solution": "Check RADIUS VSA attributes and VLAN configuration"}]',
    '["show dot1x all", "show authentication sessions", "show device-tracking database", "show aaa clients", "debug dot1x events"]',
    '["cisco", "catalyst-9300", "802.1x", "radius", "advanced", "coa", "dynamic-vlan"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Aruba CX Template
(
    'Aruba CX 6300 - 802.1X with ClearPass Integration',
    'Complete 802.1X configuration for Aruba CX switches with Aruba ClearPass Policy Manager integration',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1),
    'Authentication',
    '802.1X',
    'intermediate',
    '# Aruba CX 6300 - 802.1X Configuration with ClearPass
# Enable RADIUS authentication
radius-server host ${clearpass_server_ip} key ${radius_shared_secret}
radius-server host ${clearpass_server_ip} timeout 5
radius-server host ${clearpass_server_ip} retransmit 3

# AAA configuration
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth radius
aaa authorization commands manager-role radius local

# 802.1X global configuration
dot1x system-auth-control
dot1x radius accounting

# VLAN configuration
vlan ${data_vlan}
    name "Data_VLAN"
vlan ${voice_vlan}
    name "Voice_VLAN"
vlan ${guest_vlan}
    name "Guest_VLAN"

# Interface configuration
interface ${interface_range}
    no shutdown
    no routing
    vlan access ${default_vlan}
    dot1x authenticator
    dot1x authenticator cached-reauth-delay 60
    mac-auth
    port-access auth-mode client-mode
    port-access auth-priority dot1x mac-auth
    port-access mac-auth addr-format multi-colon
    port-access reauth-period ${reauth_period}

# LLDP configuration for device discovery
lldp enable
interface ${interface_range}
    lldp transmit
    lldp receive',
    '{"clearpass_server_ip": "192.168.1.100", "radius_shared_secret": "clearpass_secret", "interface_range": "1/1/1-1/1/48", "default_vlan": "1", "data_vlan": "10", "voice_vlan": "20", "guest_vlan": "30", "reauth_period": "3600"}',
    '["Enterprise Network", "ClearPass Integration", "Campus Deployment"]',
    '["802.1X", "MAC Authentication", "RADIUS", "EAP-TLS", "PEAP"]',
    '["Aruba ClearPass", "RADIUS Server", "Certificate Authority"]',
    '["Dynamic VLAN Assignment", "MAC Authentication Bypass", "LLDP Device Discovery", "Role-based Access"]',
    '["Configure ClearPass server first", "Enable LLDP for device profiling", "Use client-mode for multiple devices per port", "Configure proper VLAN strategy", "Test with known good certificate"]',
    '[{"issue": "Authentication timeouts", "solution": "Check network connectivity to ClearPass server"}, {"issue": "MAC auth not working", "solution": "Verify MAC address format configuration"}]',
    '["show port-access clients", "show dot1x statistics", "show radius-server", "show aaa authentication port-access"]',
    '["aruba", "cx-6300", "802.1x", "clearpass", "radius", "authentication"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Juniper EX Template
(
    'Juniper EX4300 - 802.1X with JUNOS Integration',
    'Comprehensive 802.1X authentication setup for Juniper EX switches with dynamic VLAN assignment',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1),
    'Authentication',
    '802.1X',
    'intermediate',
    'groups {
    dot1x-config {
        protocols {
            dot1x {
                traceoptions {
                    file dot1x-trace size 10m files 5;
                    level all;
                    flag all;
                }
                authenticator {
                    authentication-profile-name ${auth_profile_name};
                    interface {
                        ${interface_range} {
                            supplicant single;
                            retries 2;
                            quiet-period 60;
                            tx-period 30;
                            mac-radius;
                            mac-radius-restrict;
                            guest-vlan ${guest_vlan};
                            server-fail-vlan ${server_fail_vlan};
                        }
                    }
                }
            }
        }
        access {
            radius-server {
                ${radius_server_ip} {
                    port 1812;
                    accounting-port 1813;
                    secret "${radius_shared_secret}";
                    timeout 5;
                    retry 3;
                    source-address ${management_ip};
                }
            }
            profile ${auth_profile_name} {
                authentication-order radius;
                radius {
                    authentication-server ${radius_server_ip};
                    accounting-server ${radius_server_ip};
                }
                accounting {
                    order radius;
                    accounting-stop-on-failure;
                    accounting-stop-on-access-deny;
                    immediate-update;
                    update-interval 10;
                }
            }
        }
    }
}',
    '{"auth_profile_name": "PORTNOX_AUTH", "radius_server_ip": "192.168.1.100", "radius_shared_secret": "juniper_secret", "management_ip": "192.168.100.10", "interface_range": "ge-0/0/0 to ge-0/0/47", "guest_vlan": "guest-access", "server_fail_vlan": "restricted-access"}',
    '["Enterprise Network", "Campus Deployment", "JUNOS Integration"]',
    '["802.1X", "MAC-RADIUS", "RADIUS", "EAP-TLS", "PEAP"]',
    '["RADIUS Server", "JUNOS OS", "Certificate Infrastructure"]',
    '["Dynamic VLAN Assignment", "MAC Authentication", "Guest VLAN", "Server Fail VLAN", "Storm Control"]',
    '["Apply configuration as groups for easier management", "Configure guest and server-fail VLANs", "Enable MAC-RADIUS for non-802.1X devices", "Use single supplicant mode for most deployments", "Configure proper RADIUS timeouts"]',
    '[{"issue": "Authentication not starting", "solution": "Check dot1x traceoptions and interface configuration"}, {"issue": "RADIUS timeouts", "solution": "Verify network connectivity and RADIUS server settings"}]',
    '["show dot1x interface detail", "show access radius-server", "show configuration groups dot1x-config", "show ethernet-switching table"]',
    '["juniper", "ex4300", "802.1x", "radius", "junos", "authentication"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
),

-- Extreme Networks Template
(
    'Extreme X440 - 802.1X with Policy-based Access Control',
    'Advanced 802.1X configuration for Extreme Networks switches with policy-based access control',
    (SELECT id FROM vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1),
    'Authentication',
    '802.1X',
    'advanced',
    '# Extreme Networks X440 - 802.1X Configuration
# Enable dot1x globally
enable dot1x

# RADIUS server configuration
configure radius ${radius_server_name} server ${radius_server_ip} 1812 client-ip ${management_ip} shared-secret ${radius_shared_secret}
configure radius ${radius_server_name} server ${radius_server_ip} 1813 client-ip ${management_ip} shared-secret ${radius_shared_secret}

# AAA configuration
configure aaa authentication dot1x ${radius_server_name}
configure aaa accounting dot1x ${radius_server_name}

# Create VLANs
create vlan ${data_vlan_name}
configure vlan ${data_vlan_name} tag ${data_vlan_id}
create vlan ${voice_vlan_name}
configure vlan ${voice_vlan_name} tag ${voice_vlan_id}
create vlan ${guest_vlan_name}
configure vlan ${guest_vlan_name} tag ${guest_vlan_id}

# Configure ports for 802.1x
configure dot1x port ${port_range} initialize
configure dot1x port ${port_range} admincontrolledports auto
configure dot1x port ${port_range} quietperiod ${quiet_period}
configure dot1x port ${port_range} txperiod 30
configure dot1x port ${port_range} supptimeout 30
configure dot1x port ${port_range} servertimeout 30
configure dot1x port ${port_range} maxreq 2
configure dot1x port ${port_range} reauthenabled true
configure dot1x port ${port_range} reauthperiod ${reauth_period}

# Enable netlogin for fallback
enable netlogin port ${port_range}
configure netlogin port ${port_range} mode dot1x-mac
configure netlogin authentication protocol-order dot1x mac web-based

# Configure dynamic authorization
enable netlogin dot1x radius-coa
configure netlogin dot1x radius-coa port 3799',
    '{"radius_server_name": "PORTNOX_RADIUS", "radius_server_ip": "192.168.1.100", "radius_shared_secret": "extreme_secret", "management_ip": "192.168.100.20", "data_vlan_name": "data_vlan", "data_vlan_id": "10", "voice_vlan_name": "voice_vlan", "voice_vlan_id": "20", "guest_vlan_name": "guest_vlan", "guest_vlan_id": "30", "port_range": "1-48", "quiet_period": "60", "reauth_period": "3600"}',
    '["Enterprise Network", "Policy-based Access", "Advanced Security"]',
    '["802.1X", "MAC Authentication", "Web Authentication", "RADIUS", "EAP-TLS", "PEAP"]',
    '["RADIUS Server", "Policy Engine", "QoS Profiles", "Dynamic Authorization"]',
    '["Policy-based Access Control", "Dynamic VLAN Assignment", "QoS Enforcement", "Change of Authorization", "Multi-method Authentication"]',
    '["Create comprehensive policies before enabling authentication", "Configure QoS profiles for different user types", "Enable CoA for dynamic policy changes", "Use protocol-order for authentication fallback", "Test policies with different user types"]',
    '[{"issue": "Policy not applied", "solution": "Check RADIUS filter-id attributes and policy rules"}, {"issue": "CoA not working", "solution": "Verify CoA port configuration and firewall settings"}]',
    '["show dot1x", "show netlogin", "show policy", "show aaa", "show radius"]',
    '["extreme", "x440", "802.1x", "policy", "radius", "netlogin"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'::uuid
);

-- Verify templates were created
SELECT COUNT(*) as template_count FROM configuration_templates;