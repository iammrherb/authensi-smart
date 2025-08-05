-- Insert comprehensive configuration templates for all major vendors

-- Cisco IBNS 2.0 Templates
INSERT INTO configuration_templates (
  id, name, description, category, subcategory, configuration_type, complexity_level,
  template_content, template_variables, supported_scenarios, authentication_methods,
  required_features, network_requirements, security_features, best_practices,
  troubleshooting_guide, validation_commands, tags, is_public, vendor_id
) VALUES 
(
  gen_random_uuid(),
  'Cisco Catalyst 9300 - Complete IBNS 2.0 with 802.1X, CoA, RADSEC',
  'Comprehensive Cisco IBNS 2.0 configuration with 802.1X, Change of Authorization, RADIUS over TLS, and full policy enforcement',
  'Authentication',
  'Enterprise Security',
  '802.1X-IBNS',
  'advanced',
  '! Cisco Catalyst 9300 - Complete IBNS 2.0 Configuration
! Enable AAA and 802.1X globally
aaa new-model
aaa session-id common

! RADIUS Server Configuration with RADSEC
radius server PORTNOX-PRIMARY
 address ipv4 {{RADIUS_SERVER_IP}} auth-port 2083 acct-port 2083
 automate-tester username {{TEST_USERNAME}} probe-on
 pac key {{RADIUS_KEY}}
 radsec
 
radius server PORTNOX-SECONDARY  
 address ipv4 {{RADIUS_SERVER_SECONDARY_IP}} auth-port 2083 acct-port 2083
 automate-tester username {{TEST_USERNAME}} probe-on
 pac key {{RADIUS_KEY}}
 radsec

! AAA Configuration
aaa group server radius PORTNOX
 server name PORTNOX-PRIMARY
 server name PORTNOX-SECONDARY
 ip radius source-interface {{SOURCE_INTERFACE}}
 
aaa authentication login default local
aaa authentication login VTY group PORTNOX local
aaa authentication dot1x default group PORTNOX
aaa authorization network default group PORTNOX
aaa authorization exec default group PORTNOX local
aaa accounting dot1x default start-stop group PORTNOX
aaa accounting exec default start-stop group PORTNOX
aaa accounting network default start-stop group PORTNOX
aaa accounting system default start-stop group PORTNOX

! Enable 802.1X System Authentication Control
dot1x system-auth-control
dot1x critical eapol

! Device Tracking and Profiling
device-tracking tracking
device-tracking policy IPDT_POLICY
 no protocol udp
 tracking enable

! Access Session Configuration
access-session mac-move deny
access-session attributes filter-list list FILTER_WEBAUTH_MAB_METHODS
access-session accounting attributes filter-spec include list FILTER_WEBAUTH_MAB_METHODS

! Policy Maps for IBNS 2.0
policy-map type control subscriber PMAP_DefaultWiredDot1xClosedAuth_1X
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x retries 3 retry-time 5 priority 10
   
policy-map type control subscriber PMAP_DefaultWiredMABClosedAuth_MAB  
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using mab priority 20

! Class Maps
class-map type control subscriber match-any DOT1X_NO_RESP
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-any DOT1X_FAILED
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-any MAB_FAILED
 match method mab
 match result-type method mab authoritative

! Service Template for Guest VLAN
service-template GUEST_TEMPLATE
 vlan {{GUEST_VLAN}}
 description "Guest Network Access"
 
service-template QUARANTINE_TEMPLATE
 vlan {{QUARANTINE_VLAN}}
 description "Quarantine Network"
 
service-template EMPLOYEE_TEMPLATE
 vlan {{EMPLOYEE_VLAN}}
 description "Employee Network Access"

! Interface Template for Access Ports
template ACCESS_PORT_TEMPLATE
 description "802.1X Access Port Template"
 switchport mode access
 switchport access vlan {{DEFAULT_VLAN}}
 switchport voice vlan {{VOICE_VLAN}}
 authentication event fail action authorize vlan {{GUEST_VLAN}}
 authentication event server dead action authorize vlan {{GUEST_VLAN}}
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication timer inactivity server
 authentication violation restrict
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
 spanning-tree bpduguard enable

! CoA Configuration
aaa server radius dynamic-author
 client {{RADIUS_SERVER_IP}} server-key {{RADIUS_KEY}}
 client {{RADIUS_SERVER_SECONDARY_IP}} server-key {{RADIUS_KEY}}
 port 3799
 auth-type any

! SNMP Configuration for Network Monitoring
snmp-server community {{SNMP_COMMUNITY}} RO
snmp-server host {{MONITORING_SERVER}} version 2c {{SNMP_COMMUNITY}}
snmp-server enable traps dot1x auth-fail-vlan guest-vlan no-auth-fail-vlan

! Logging Configuration
logging buffered 65536 informational
logging host {{SYSLOG_SERVER}}
logging facility local7
logging source-interface {{SOURCE_INTERFACE}}

! Apply template to interfaces
interface range {{INTERFACE_RANGE}}
 source template ACCESS_PORT_TEMPLATE
 device-tracking attach-policy IPDT_POLICY

! Trunk Configuration for Uplinks
interface {{UPLINK_INTERFACE}}
 description "Uplink to Core/Distribution"
 switchport mode trunk
 switchport trunk allowed vlan {{ALLOWED_VLANS}}
 channel-group 1 mode active
 spanning-tree guard root

! Management Interface
interface vlan {{MGMT_VLAN}}
 ip address {{MGMT_IP}} {{MGMT_MASK}}
 no shutdown

! Default Route
ip route 0.0.0.0 0.0.0.0 {{DEFAULT_GATEWAY}}

! Enable Critical Authentication
dot1x critical eapol
dot1x critical recovery delay 1000

! Time and NTP
ntp server {{NTP_SERVER_1}}
ntp server {{NTP_SERVER_2}}
clock timezone {{TIMEZONE}} {{UTC_OFFSET}}

! Enable necessary services
ip domain-name {{DOMAIN_NAME}}
crypto key generate rsa general-keys modulus 2048

! Line Configuration
line vty 0 15
 transport input ssh
 access-class {{ACL_MGMT}} in
 authentication login VTY
 exec-timeout 10 0

! Save Configuration
end
write memory',
  '{
    "RADIUS_SERVER_IP": {"type": "ip", "required": true, "description": "Primary RADIUS server IP"},
    "RADIUS_SERVER_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary RADIUS server IP"},
    "RADIUS_KEY": {"type": "password", "required": true, "description": "RADIUS shared secret"},
    "TEST_USERNAME": {"type": "string", "required": true, "description": "Test username for automate-tester"},
    "SOURCE_INTERFACE": {"type": "string", "required": true, "description": "Source interface for RADIUS communication"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "EMPLOYEE_VLAN": {"type": "integer", "required": true, "description": "Employee VLAN ID"},
    "DEFAULT_VLAN": {"type": "integer", "required": true, "description": "Default access VLAN"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "INTERFACE_RANGE": {"type": "string", "required": true, "description": "Range of access interfaces"},
    "UPLINK_INTERFACE": {"type": "string", "required": true, "description": "Uplink interface"},
    "ALLOWED_VLANS": {"type": "string", "required": true, "description": "Allowed VLANs on trunk"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP address"},
    "MGMT_MASK": {"type": "ip", "required": true, "description": "Management subnet mask"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone name"},
    "UTC_OFFSET": {"type": "integer", "required": true, "description": "UTC offset"},
    "DOMAIN_NAME": {"type": "string", "required": true, "description": "Domain name"},
    "ACL_MGMT": {"type": "string", "required": true, "description": "Management ACL name"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community string"},
    "MONITORING_SERVER": {"type": "ip", "required": true, "description": "SNMP monitoring server"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"}
  }',
  '["Enterprise Deployment", "Guest Access", "Voice Integration", "High Security", "Multi-Auth", "BYOD"]',
  '["802.1X", "MAB", "RADSEC", "CoA", "TACACS+"]',
  '["IBNS 2.0", "Device Tracking", "Policy Enforcement", "Dynamic VLAN Assignment", "Guest Network"]',
  '{"bandwidth": "1Gbps+", "vlan_support": true, "poe_required": true, "management_ip": true}',
  '["RADSEC Encryption", "Certificate-based Authentication", "CoA Support", "Access Control Lists", "Port Security"]',
  '["Use device templates for consistency", "Enable logging for troubleshooting", "Implement proper VLAN segmentation", "Regular certificate renewal", "Monitor authentication events"]',
  '[
    {"issue": "Authentication Timeout", "solution": "Check RADIUS connectivity and increase timeout values", "commands": ["show authentication sessions", "show radius statistics"]},
    {"issue": "RADSEC Connection Failed", "solution": "Verify certificates and network connectivity", "commands": ["show crypto pki certificates", "ping {{RADIUS_SERVER_IP}}"]}
  ]',
  '["show authentication sessions", "show radius statistics", "show dot1x all", "show access-session", "show device-tracking database"]',
  '["cisco", "ibns2", "802.1x", "radsec", "coa", "enterprise"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems')
),
(
  gen_random_uuid(),
  'Aruba CX 6300 - Complete AOS-CX 802.1X with ClearPass Integration',
  'Comprehensive Aruba CX configuration with 802.1X, ClearPass integration, dynamic segmentation, and policy enforcement',
  'Authentication',
  'Enterprise Security',
  '802.1X-AOS',
  'advanced',
  '! Aruba CX 6300 - Complete 802.1X Configuration with ClearPass
! System Configuration
hostname {{HOSTNAME}}
system timezone {{TIMEZONE}}

! NTP Configuration
ntp server {{NTP_SERVER_1}}
ntp server {{NTP_SERVER_2}}
ntp enable

! RADIUS Configuration with RADSEC
radius-server host {{RADIUS_SERVER_IP}}
    key {{RADIUS_KEY}}
    radsec
    retransmit 3
    timeout 5
    tracking enable
    
radius-server host {{RADIUS_SERVER_SECONDARY_IP}}
    key {{RADIUS_KEY}}
    radsec
    retransmit 3
    timeout 5
    tracking enable

! AAA Configuration
aaa group server radius "clearpass"
    server {{RADIUS_SERVER_IP}}
    server {{RADIUS_SERVER_SECONDARY_IP}}
    
aaa authentication port-access dot1x-authenticator group clearpass
aaa authentication port-access mac-authenticator group clearpass
aaa accounting port-access start-stop group clearpass

! 802.1X Configuration
dot1x system-auth-control
dot1x max-reauth-req 3
dot1x max-req 3

! Device Profile Configuration
device-profile name "default"
    associate device-type generic
    
device-profile name "corporate-device"
    associate device-type generic
    untagged-vlan {{CORPORATE_VLAN}}
    
device-profile name "guest-device"
    associate device-type generic
    untagged-vlan {{GUEST_VLAN}}
    
device-profile name "iot-device"
    associate device-type generic
    untagged-vlan {{IOT_VLAN}}

! VLAN Configuration
vlan {{CORPORATE_VLAN}}
    name "Corporate"
    
vlan {{GUEST_VLAN}}
    name "Guest"
    
vlan {{IOT_VLAN}}
    name "IoT-Devices"
    
vlan {{VOICE_VLAN}}
    name "Voice"
    
vlan {{MGMT_VLAN}}
    name "Management"

! Interface VLAN Configuration
interface vlan {{MGMT_VLAN}}
    ip address {{MGMT_IP}}/{{MGMT_PREFIX}}
    no shutdown

! Access Port Template
port-access role "access-role"
    associate device-profile "default"
    associate device-profile "corporate-device" aaa-attribute "Filter-Id" value "Corporate"
    associate device-profile "guest-device" aaa-attribute "Filter-Id" value "Guest"
    associate device-profile "iot-device" aaa-attribute "Filter-Id" value "IoT"
    auth-method dot1x-authenticator
    auth-method mac-authenticator
    auth-precedence dot1x-authenticator mac-authenticator
    captive-portal-profile "guest-portal"
    
! Captive Portal for Guest Access
captive-portal-profile "guest-portal"
    redirect-url "https://{{CAPTIVE_PORTAL_URL}}/guest"
    certificate-profile "portal-cert"

! Certificate Configuration for RADSEC
certificate ta-profile "clearpass-ca"
    certificate "{{CA_CERTIFICATE}}"
    
certificate server-profile "device-cert"
    certificate "{{DEVICE_CERTIFICATE}}"
    private-key "{{DEVICE_PRIVATE_KEY}}"

! Access Interface Configuration
interface {{INTERFACE_RANGE}}
    description "802.1X Access Port"
    no shutdown
    no routing
    vlan access {{DEFAULT_VLAN}}
    vlan trunk native {{DEFAULT_VLAN}} tag
    vlan trunk allowed {{VOICE_VLAN}}
    port-access role "access-role"
    port-access auth-method dot1x-authenticator
    port-access auth-method mac-authenticator
    port-access auth-mode client-mode
    port-access re-authentication enable
    port-access re-authentication period 3600
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard
    
! Uplink Configuration
interface {{UPLINK_INTERFACE}}
    description "Uplink to Core"
    no shutdown
    no routing
    vlan trunk native {{MGMT_VLAN}}
    vlan trunk allowed {{ALLOWED_VLANS}}
    lacp mode active
    lag {{LAG_ID}}

! CoA Configuration
radius dynamic-authorization
    server-key {{RADIUS_KEY}}
    client {{RADIUS_SERVER_IP}}
    client {{RADIUS_SERVER_SECONDARY_IP}}
    port 3799

! TACACS+ Configuration for Management
tacacs-server host {{TACACS_SERVER_IP}}
    key {{TACACS_KEY}}
    
aaa group server tacacs+ "tacacs-group"
    server {{TACACS_SERVER_IP}}
    
aaa authentication login privilege-mode group tacacs-group local
aaa authorization commands privilege-mode group tacacs-group local

! Access Control Lists
access-list ip "GUEST-ACL"
    10 permit tcp any any eq domain
    20 permit udp any any eq domain
    30 permit tcp any any eq http
    40 permit tcp any any eq https
    50 deny ip any any

access-list ip "CORPORATE-ACL"
    10 permit ip any any

access-list ip "IOT-ACL"
    10 permit tcp any any eq domain
    20 permit udp any any eq domain
    30 permit tcp any {{IOT_CONTROLLER_IP}}/32
    40 deny ip any any

! Apply ACLs to VLANs
vlan {{GUEST_VLAN}}
    apply access-list ip "GUEST-ACL" in
    
vlan {{IOT_VLAN}}
    apply access-list ip "IOT-ACL" in

! DHCP Snooping
dhcp snooping
dhcp snooping vlan {{CORPORATE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}}

interface {{INTERFACE_RANGE}}
    dhcp snooping trust

! Dynamic ARP Inspection
arp inspection vlan {{CORPORATE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}}

interface {{INTERFACE_RANGE}}
    arp inspection trust

! Logging Configuration
logging {{SYSLOG_SERVER}}
logging facility local7
logging filter class mgmd level debug
logging filter class aaa level info

! SNMP Configuration
snmp-server system-name {{HOSTNAME}}
snmp-server system-contact "{{CONTACT_INFO}}"
snmp-server system-location "{{LOCATION}}"
snmp-server community {{SNMP_COMMUNITY}} ro
snmp-server host {{SNMP_SERVER}} community {{SNMP_COMMUNITY}} version 2c

! Management Access
ssh server vrf mgmt
https-server vrf mgmt

! Default Route
ip route 0.0.0.0/0 {{DEFAULT_GATEWAY}}

! MAC Authentication Bypass Settings
mac-authentication username-format no-delimiter lower-case

! Save Configuration
write memory',
  '{
    "HOSTNAME": {"type": "string", "required": true, "description": "Switch hostname"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone setting"},
    "RADIUS_SERVER_IP": {"type": "ip", "required": true, "description": "Primary ClearPass IP"},
    "RADIUS_SERVER_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary ClearPass IP"},
    "RADIUS_KEY": {"type": "password", "required": true, "description": "RADIUS shared secret"},
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT devices VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "DEFAULT_VLAN": {"type": "integer", "required": true, "description": "Default access VLAN"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP address"},
    "MGMT_PREFIX": {"type": "integer", "required": true, "description": "Management subnet prefix"},
    "INTERFACE_RANGE": {"type": "string", "required": true, "description": "Access port range"},
    "UPLINK_INTERFACE": {"type": "string", "required": true, "description": "Uplink interface"},
    "ALLOWED_VLANS": {"type": "string", "required": true, "description": "Trunk allowed VLANs"},
    "LAG_ID": {"type": "integer", "required": true, "description": "Link aggregation ID"},
    "CAPTIVE_PORTAL_URL": {"type": "string", "required": true, "description": "Captive portal URL"},
    "CA_CERTIFICATE": {"type": "text", "required": true, "description": "CA certificate for RADSEC"},
    "DEVICE_CERTIFICATE": {"type": "text", "required": true, "description": "Device certificate"},
    "DEVICE_PRIVATE_KEY": {"type": "text", "required": true, "description": "Device private key"},
    "TACACS_SERVER_IP": {"type": "ip", "required": true, "description": "TACACS+ server IP"},
    "TACACS_KEY": {"type": "password", "required": true, "description": "TACACS+ shared key"},
    "IOT_CONTROLLER_IP": {"type": "ip", "required": true, "description": "IoT controller IP"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "SNMP_SERVER": {"type": "ip", "required": true, "description": "SNMP monitoring server"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community string"},
    "CONTACT_INFO": {"type": "string", "required": true, "description": "System contact information"},
    "LOCATION": {"type": "string", "required": true, "description": "Physical location"}
  }',
  '["Enterprise Deployment", "ClearPass Integration", "Dynamic Segmentation", "Guest Access", "IoT Security", "BYOD"]',
  '["802.1X", "MAC Authentication", "RADSEC", "TACACS+", "Captive Portal"]',
  '["AOS-CX", "Dynamic VLAN Assignment", "Policy Enforcement", "Certificate Management", "Access Control"]',
  '{"bandwidth": "1Gbps+", "poe_required": true, "clearpass_integration": true, "certificate_support": true}',
  '["RADSEC Encryption", "Dynamic Segmentation", "DHCP Snooping", "ARP Inspection", "Access Control Lists"]',
  '["Use ClearPass for centralized policy", "Implement proper certificate management", "Monitor authentication events", "Regular firmware updates", "Backup configurations"]',
  '[
    {"issue": "ClearPass Connection Issues", "solution": "Verify network connectivity and certificates", "commands": ["show radius-server statistics", "show port-access authenticator"]},
    {"issue": "RADSEC Certificate Problems", "solution": "Check certificate validity and trust chain", "commands": ["show certificate", "show radius-server"]}
  ]',
  '["show port-access authenticator", "show radius-server statistics", "show device-profile", "show mac-authentication", "show captive-portal"]',
  '["aruba", "aos-cx", "clearpass", "802.1x", "radsec", "dynamic-segmentation"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Aruba Networks')
),
(
  gen_random_uuid(),
  'FortiSwitch - Complete 802.1X with FortiGate Integration and NAC',
  'Comprehensive FortiSwitch configuration with FortiGate integration, 802.1X authentication, and network access control',
  'Authentication',
  'Enterprise Security',
  '802.1X-FortiOS',
  'advanced',
  '! FortiSwitch Complete 802.1X Configuration with FortiGate Integration
! System Configuration
config system global
    set hostname "{{HOSTNAME}}"
    set timezone "{{TIMEZONE}}"
end

! NTP Configuration
config system ntp
    set ntpsync enable
    set server-mode enable
    set interface-select-method specify
    set interface "{{MGMT_INTERFACE}}"
    config ntpserver
        edit 1
            set server "{{NTP_SERVER_1}}"
        next
        edit 2
            set server "{{NTP_SERVER_2}}"
        next
    end
end

! RADIUS Server Configuration
config user radius
    edit "FORTIGATE-RADIUS"
        set server "{{FORTIGATE_IP}}"
        set secret "{{RADIUS_SECRET}}"
        set auth-type auto
        set acct-interim-interval 600
        set all-usergroup enable
        set use-management-vdom enable
        set switch-controller-acct-fast-framedip-detect enable
    next
    edit "EXTERNAL-RADIUS"
        set server "{{EXTERNAL_RADIUS_IP}}"
        set secret "{{EXTERNAL_RADIUS_SECRET}}"
        set auth-type auto
        set acct-interim-interval 600
        set all-usergroup enable
    next
end

! User Groups for Authentication
config user group
    edit "CORPORATE-USERS"
        set group-type radius
        set authtimeout 28800
        set fortitoken disabled
        config match
            edit 1
                set server-name "FORTIGATE-RADIUS"
                set group-name "Corporate"
            next
        end
    next
    edit "GUEST-USERS"
        set group-type radius
        set authtimeout 3600
        set fortitoken disabled
        config match
            edit 1
                set server-name "FORTIGATE-RADIUS"
                set group-name "Guest"
            next
        end
    next
    edit "IOT-DEVICES"
        set group-type radius
        set authtimeout 86400
        set fortitoken disabled
        config match
            edit 1
                set server-name "FORTIGATE-RADIUS"
                set group-name "IoT"
            next
        end
    next
end

! VLAN Configuration
config system interface
    edit "{{CORPORATE_VLAN_INTERFACE}}"
        set vdom "root"
        set type vlan
        set vlanid {{CORPORATE_VLAN}}
        set interface "{{PHYSICAL_INTERFACE}}"
        set description "Corporate Network"
    next
    edit "{{GUEST_VLAN_INTERFACE}}"
        set vdom "root"
        set type vlan
        set vlanid {{GUEST_VLAN}}
        set interface "{{PHYSICAL_INTERFACE}}"
        set description "Guest Network"
    next
    edit "{{IOT_VLAN_INTERFACE}}"
        set vdom "root"
        set type vlan
        set vlanid {{IOT_VLAN}}
        set interface "{{PHYSICAL_INTERFACE}}"
        set description "IoT Network"
    next
    edit "{{VOICE_VLAN_INTERFACE}}"
        set vdom "root"
        set type vlan
        set vlanid {{VOICE_VLAN}}
        set interface "{{PHYSICAL_INTERFACE}}"
        set description "Voice Network"
    next
end

! Switch Controller Configuration
config switch-controller global
    set mac-aging-interval 300
    set allow-multiple-interfaces enable
    set bounce-quarantined-link enable
end

! 802.1X Security Policy
config switch-controller security-policy
    edit "CORPORATE-POLICY"
        set user-group "CORPORATE-USERS"
        set mac-auth-bypass disable
        set open-auth disable
        set eap-passthrough disable
        set guest-auth-delay 60
        set auth-fail-vlan enable
        set auth-fail-vlanid {{QUARANTINE_VLAN}}
        set guest-vlan enable
        set guest-vlanid {{GUEST_VLAN}}
        config 802-1X-settings
            set reauth-period 3600
            set max-reauth-attempt 3
            set tx-period 30
        end
    next
    edit "GUEST-POLICY"
        set user-group "GUEST-USERS"
        set mac-auth-bypass enable
        set open-auth enable
        set eap-passthrough disable
        set guest-auth-delay 30
        set auth-fail-vlan enable
        set auth-fail-vlanid {{GUEST_VLAN}}
        set guest-vlan enable
        set guest-vlanid {{GUEST_VLAN}}
        config 802-1X-settings
            set reauth-period 1800
            set max-reauth-attempt 2
            set tx-period 30
        end
    next
    edit "IOT-POLICY"
        set user-group "IOT-DEVICES"
        set mac-auth-bypass enable
        set open-auth disable
        set eap-passthrough disable
        set guest-auth-delay 120
        set auth-fail-vlan enable
        set auth-fail-vlanid {{QUARANTINE_VLAN}}
        config 802-1X-settings
            set reauth-period 86400
            set max-reauth-attempt 3
            set tx-period 30
        end
    next
end

! Port Configuration Template
config switch-controller managed-switch
    edit "{{SWITCH_SERIAL}}"
        set fsw-wan1-peer "{{FORTIGATE_INTERFACE}}"
        set fsw-wan1-admin enable
        set version 3
        set max-allowed-trunk-members 8
        config ports
            edit "port1"
                set vlan "{{CORPORATE_VLAN_INTERFACE}}"
                set allowed-vlans "{{VOICE_VLAN}}"
                set untagged-vlans "{{CORPORATE_VLAN}}"
                set type physical
                set access-mode dynamic
                set security-groups "CORPORATE-USERS"
                set auth-method dot1x mac-auth
                set dot1x-enable enable
                set igmp-snooping-flood-reports disable
                set lldp-status tx-rx
                set loop-guard enable
                set loop-guard-timeout 45
                set edge-port enable
                set poe-status enable
                set poe-pre-standard-detection enable
            next
            edit "port2-24"
                set vlan "{{CORPORATE_VLAN_INTERFACE}}"
                set allowed-vlans "{{VOICE_VLAN}}"
                set untagged-vlans "{{CORPORATE_VLAN}}"
                set type physical
                set access-mode dynamic
                set security-groups "CORPORATE-USERS"
                set auth-method dot1x mac-auth
                set dot1x-enable enable
                set igmp-snooping-flood-reports disable
                set lldp-status tx-rx
                set loop-guard enable
                set loop-guard-timeout 45
                set edge-port enable
                set poe-status enable
                set poe-pre-standard-detection enable
            next
            edit "port25-26"
                set vlan "{{MGMT_VLAN_INTERFACE}}"
                set type physical
                set access-mode trunk
                set native-vlan {{MGMT_VLAN}}
                set allowed-vlans "{{ALL_VLANS}}"
                set lldp-status tx-rx
                set loop-guard disable
                set edge-port disable
            next
        end
    next
end

! DHCP Snooping
config switch-controller global
    set dhcp-option82 enable
    set dhcp-option82-circuit-id string
    set dhcp-option82-remote-id mac
end

! Storm Control
config switch-controller storm-control
    edit 1
        set description "Default Storm Control"
        set rate 500
        set unknown-unicast enable
        set unknown-multicast enable
        set broadcast enable
    next
end

! STP Configuration
config switch-controller stp-settings
    edit "default"
        set status enable
        set revision 1
        set hello-time 2
        set forward-time 15
        set max-age 20
        set max-hops 20
        set pending-timer 4
    next
end

! LLDP Configuration
config switch-controller lldp-settings
    edit "default"
        set status enable
        set tx-hold 4
        set tx-interval 30
        set fast-start-interval 2
    next
end

! Network Access Control
config switch-controller nac-settings
    edit "default"
        set name "DEFAULT-NAC"
        set description "Default NAC Settings"
        set mode switch
        set inactive-timer 1440
        set auto-auth enable
        set bounce-nac-port enable
        set link-down-flush enable
        set onboarding-vlan {{ONBOARDING_VLAN}}
    next
end

! QoS Configuration
config switch-controller qos qos-policy
    edit "VOICE-QOS"
        set default-cos 0
        config cos-queue
            edit 0
                set description "Best Effort"
                set drop-policy taildrop
                set max-rate 0
                set min-rate 0
                set weight 1
            next
            edit 5
                set description "Voice"
                set drop-policy taildrop
                set max-rate 0
                set min-rate 50
                set weight 10
            next
        end
    next
end

! Logging Configuration
config log fortianalyzer setting
    set status enable
    set server "{{FORTIANALYZER_IP}}"
    set hmac-algorithm sha256
    set enc-algorithm high
    set reliable enable
end

config log syslogd setting
    set status enable
    set server "{{SYSLOG_SERVER}}"
    set port 514
    set mode udp
    set facility local7
    set source-ip "{{MGMT_IP}}"
end

! SNMP Configuration
config system snmp sysinfo
    set status enable
    set description "{{DESCRIPTION}}"
    set contact-info "{{CONTACT}}"
    set location "{{LOCATION}}"
end

config system snmp community
    edit 1
        set name "{{SNMP_COMMUNITY}}"
        set query-v1-status enable
        set query-v2c-status enable
        set trap-v1-status enable
        set trap-v2c-status enable
        set hosts "{{SNMP_SERVER}}"
    next
end

! Management Interface
config system interface
    edit "{{MGMT_INTERFACE}}"
        set vdom "root"
        set ip {{MGMT_IP}} {{MGMT_NETMASK}}
        set allowaccess ping https ssh snmp http telnet fgfm
        set type physical
        set description "Management Interface"
        set lldp-transmission enable
        set lldp-reception enable
    next
end

! Default Route
config router static
    edit 1
        set gateway {{DEFAULT_GATEWAY}}
        set device "{{MGMT_INTERFACE}}"
    next
end

! FortiGate Integration
config switch-controller fortilink-settings
    edit "{{FORTILINK_INTERFACE}}"
        set fortilink enable
        set inactive-timer 60
        set link-down-flush enable
        set access-vlan-mode legacy
    next
end',
  '{
    "HOSTNAME": {"type": "string", "required": true, "description": "FortiSwitch hostname"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone setting"},
    "FORTIGATE_IP": {"type": "ip", "required": true, "description": "FortiGate IP address"},
    "RADIUS_SECRET": {"type": "password", "required": true, "description": "RADIUS shared secret with FortiGate"},
    "EXTERNAL_RADIUS_IP": {"type": "ip", "required": false, "description": "External RADIUS server IP"},
    "EXTERNAL_RADIUS_SECRET": {"type": "password", "required": false, "description": "External RADIUS shared secret"},
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "ONBOARDING_VLAN": {"type": "integer", "required": true, "description": "Device onboarding VLAN"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "CORPORATE_VLAN_INTERFACE": {"type": "string", "required": true, "description": "Corporate VLAN interface name"},
    "GUEST_VLAN_INTERFACE": {"type": "string", "required": true, "description": "Guest VLAN interface name"},
    "IOT_VLAN_INTERFACE": {"type": "string", "required": true, "description": "IoT VLAN interface name"},
    "VOICE_VLAN_INTERFACE": {"type": "string", "required": true, "description": "Voice VLAN interface name"},
    "MGMT_VLAN_INTERFACE": {"type": "string", "required": true, "description": "Management VLAN interface name"},
    "PHYSICAL_INTERFACE": {"type": "string", "required": true, "description": "Physical interface for VLANs"},
    "SWITCH_SERIAL": {"type": "string", "required": true, "description": "FortiSwitch serial number"},
    "FORTIGATE_INTERFACE": {"type": "string", "required": true, "description": "FortiGate interface for FortiLink"},
    "FORTILINK_INTERFACE": {"type": "string", "required": true, "description": "FortiLink interface name"},
    "ALL_VLANS": {"type": "string", "required": true, "description": "All allowed VLANs for trunk"},
    "MGMT_INTERFACE": {"type": "string", "required": true, "description": "Management interface name"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP address"},
    "MGMT_NETMASK": {"type": "ip", "required": true, "description": "Management netmask"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "FORTIANALYZER_IP": {"type": "ip", "required": false, "description": "FortiAnalyzer IP address"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "SNMP_SERVER": {"type": "ip", "required": true, "description": "SNMP monitoring server"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community string"},
    "DESCRIPTION": {"type": "string", "required": true, "description": "System description"},
    "CONTACT": {"type": "string", "required": true, "description": "Contact information"},
    "LOCATION": {"type": "string", "required": true, "description": "Physical location"}
  }',
  '["FortiGate Integration", "Enterprise Security", "Guest Access", "IoT Segmentation", "Voice Networks", "NAC"]',
  '["802.1X", "MAC Authentication", "FortiLink", "RADIUS", "Certificate Authentication"]',
  '["FortiLink Integration", "Dynamic VLAN Assignment", "Network Access Control", "Security Policies", "QoS"]',
  '{"fortigate_required": true, "fortilink_support": true, "poe_support": true, "managed_switch": true}',
  '["FortiGate Integration", "Security Policies", "DHCP Snooping", "Storm Control", "Access Control"]',
  '["Use FortiGate for centralized management", "Implement proper VLAN segmentation", "Monitor authentication events", "Regular firmware updates", "Backup configurations regularly"]',
  '[
    {"issue": "FortiLink Connection Issues", "solution": "Check FortiGate FortiLink configuration and cable connectivity", "commands": ["diagnose switch-controller switch-info", "execute switch-controller get-conn-status"]},
    {"issue": "Authentication Failures", "solution": "Verify RADIUS configuration and user groups", "commands": ["diagnose test authserver radius", "diagnose debug application radiusd"]}
  ]',
  '["diagnose switch-controller switch-info", "diagnose test authserver radius", "get switch-controller managed-switch", "diagnose debug application radiusd", "get user radius"]',
  '["fortinet", "fortiswitch", "fortigate", "802.1x", "fortilink", "nac"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Fortinet Inc')
),
(
  gen_random_uuid(),
  'Juniper EX4300 - Complete 802.1X with JUNOS Integration and Policy Enforcement',
  'Comprehensive Juniper EX configuration with 802.1X, JUNOS policy enforcement, RADIUS integration, and dynamic VLAN assignment',
  'Authentication',
  'Enterprise Security',
  '802.1X-JUNOS',
  'advanced',
  '# Juniper EX4300 Complete 802.1X Configuration with JUNOS Integration
# System Configuration
set system host-name {{HOSTNAME}}
set system time-zone {{TIMEZONE}}
set system domain-name {{DOMAIN_NAME}}

# NTP Configuration
set system ntp server {{NTP_SERVER_1}}
set system ntp server {{NTP_SERVER_2}}

# DNS Configuration
set system name-server {{DNS_SERVER_1}}
set system name-server {{DNS_SERVER_2}}

# RADIUS Server Configuration
set access radius-server {{RADIUS_SERVER_IP}} port 1812
set access radius-server {{RADIUS_SERVER_IP}} accounting-port 1813
set access radius-server {{RADIUS_SERVER_IP}} secret "{{RADIUS_SECRET}}"
set access radius-server {{RADIUS_SERVER_IP}} timeout 10
set access radius-server {{RADIUS_SERVER_IP}} retry 3
set access radius-server {{RADIUS_SERVER_IP}} source-address {{SOURCE_IP}}

set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} port 1812
set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} accounting-port 1813
set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} secret "{{RADIUS_SECRET}}"
set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} timeout 10
set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} retry 3
set access radius-server {{RADIUS_SERVER_SECONDARY_IP}} source-address {{SOURCE_IP}}

# RADIUS Authentication Order
set access profile "dot1x-profile" authentication-order radius
set access profile "dot1x-profile" radius authentication-server {{RADIUS_SERVER_IP}}
set access profile "dot1x-profile" radius authentication-server {{RADIUS_SERVER_SECONDARY_IP}}
set access profile "dot1x-profile" radius accounting-order radius
set access profile "dot1x-profile" radius accounting-server {{RADIUS_SERVER_IP}}
set access profile "dot1x-profile" radius accounting-server {{RADIUS_SERVER_SECONDARY_IP}}

# MAC-RADIUS Profile
set access profile "mac-radius-profile" authentication-order radius
set access profile "mac-radius-profile" radius authentication-server {{RADIUS_SERVER_IP}}
set access profile "mac-radius-profile" radius authentication-server {{RADIUS_SERVER_SECONDARY_IP}}

# VLAN Configuration
set vlans corporate vlan-id {{CORPORATE_VLAN}}
set vlans corporate description "Corporate Network"
set vlans corporate l3-interface irb.{{CORPORATE_VLAN}}

set vlans guest vlan-id {{GUEST_VLAN}}
set vlans guest description "Guest Network"
set vlans guest l3-interface irb.{{GUEST_VLAN}}

set vlans iot vlan-id {{IOT_VLAN}}
set vlans iot description "IoT Devices"
set vlans iot l3-interface irb.{{IOT_VLAN}}

set vlans voice vlan-id {{VOICE_VLAN}}
set vlans voice description "Voice Network"
set vlans voice l3-interface irb.{{VOICE_VLAN}}

set vlans quarantine vlan-id {{QUARANTINE_VLAN}}
set vlans quarantine description "Quarantine Network"
set vlans quarantine l3-interface irb.{{QUARANTINE_VLAN}}

set vlans management vlan-id {{MGMT_VLAN}}
set vlans management description "Management Network"
set vlans management l3-interface irb.{{MGMT_VLAN}}

# IRB Interfaces for VLAN routing
set interfaces irb unit {{CORPORATE_VLAN}} family inet address {{CORPORATE_GATEWAY}}/{{CORPORATE_PREFIX}}
set interfaces irb unit {{GUEST_VLAN}} family inet address {{GUEST_GATEWAY}}/{{GUEST_PREFIX}}
set interfaces irb unit {{IOT_VLAN}} family inet address {{IOT_GATEWAY}}/{{IOT_PREFIX}}
set interfaces irb unit {{VOICE_VLAN}} family inet address {{VOICE_GATEWAY}}/{{VOICE_PREFIX}}
set interfaces irb unit {{QUARANTINE_VLAN}} family inet address {{QUARANTINE_GATEWAY}}/{{QUARANTINE_PREFIX}}
set interfaces irb unit {{MGMT_VLAN}} family inet address {{MGMT_IP}}/{{MGMT_PREFIX}}

# 802.1X Configuration
set protocols dot1x authenticator authentication-profile-name "dot1x-profile"
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} supplicant single
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} retries 3
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} quiet-period 60
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} tx-period 30
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} supplicant-timeout 30
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} server-timeout 30
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} max-requests 2
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} guest-vlan guest
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} server-reject-vlan quarantine
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} server-fail vlan-name guest
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} reauthentication 3600

# MAC-RADIUS Configuration
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} mac-radius
set protocols dot1x authenticator interface {{ACCESS_INTERFACE_RANGE}} mac-radius-profile "mac-radius-profile"

# Voice VLAN Configuration
set ethernet-switching-options voip interface {{ACCESS_INTERFACE_RANGE}} vlan voice
set ethernet-switching-options voip interface {{ACCESS_INTERFACE_RANGE}} forwarding-class expedited-forwarding

# Access Interface Configuration
set interfaces {{ACCESS_INTERFACE_RANGE}} unit 0 family ethernet-switching interface-mode access
set interfaces {{ACCESS_INTERFACE_RANGE}} unit 0 family ethernet-switching vlan members corporate
set interfaces {{ACCESS_INTERFACE_RANGE}} unit 0 family ethernet-switching storm-control default
set interfaces {{ACCESS_INTERFACE_RANGE}} description "802.1X Access Port"
set interfaces {{ACCESS_INTERFACE_RANGE}} disable

# Enable interfaces after configuration
delete interfaces {{ACCESS_INTERFACE_RANGE}} disable

# Trunk/Uplink Configuration
set interfaces {{UPLINK_INTERFACE}} unit 0 family ethernet-switching interface-mode trunk
set interfaces {{UPLINK_INTERFACE}} unit 0 family ethernet-switching vlan members [{{ALL_VLANS}}]
set interfaces {{UPLINK_INTERFACE}} description "Uplink to Core/Distribution"

# Link Aggregation (if needed)
set interfaces ae0 description "Link Aggregation to Core"
set interfaces ae0 aggregated-ether-options link-speed 1g
set interfaces ae0 aggregated-ether-options lacp active
set interfaces ae0 unit 0 family ethernet-switching interface-mode trunk
set interfaces ae0 unit 0 family ethernet-switching vlan members [{{ALL_VLANS}}]

set interfaces {{UPLINK_INTERFACE_1}} ether-options 802.3ad ae0
set interfaces {{UPLINK_INTERFACE_2}} ether-options 802.3ad ae0

# DHCP Snooping
set ethernet-switching-options secure-access-port interface {{ACCESS_INTERFACE_RANGE}} dhcp-trusted
set forwarding-options dhcp-relay dhcp-option-60 match default-action drop
set forwarding-options dhcp-relay dhcp-option-60 group option60-group match fingerprint "*PXE*"
set forwarding-options dhcp-relay dhcp-option-60 group option60-group match action forward-only

# Dynamic ARP Inspection
set ethernet-switching-options secure-access-port interface {{ACCESS_INTERFACE_RANGE}} arp-inspection
set ethernet-switching-options secure-access-port vlan corporate arp-inspection

# Storm Control
set ethernet-switching-options storm-control interface {{ACCESS_INTERFACE_RANGE}} bandwidth 1000
set ethernet-switching-options storm-control interface {{ACCESS_INTERFACE_RANGE}} no-broadcast
set ethernet-switching-options storm-control interface {{ACCESS_INTERFACE_RANGE}} no-multicast
set ethernet-switching-options storm-control interface {{ACCESS_INTERFACE_RANGE}} no-unknown-unicast

# IGMP Snooping
set protocols igmp-snooping vlan corporate
set protocols igmp-snooping vlan guest
set protocols igmp-snooping vlan iot

# RSTP Configuration
set protocols rstp interface {{ACCESS_INTERFACE_RANGE}} edge
set protocols rstp interface {{ACCESS_INTERFACE_RANGE}} no-root-port
set protocols rstp interface {{UPLINK_INTERFACE}} point-to-point
set protocols rstp bridge-priority 32768

# LLDP Configuration
set protocols lldp interface {{ACCESS_INTERFACE_RANGE}}
set protocols lldp interface {{UPLINK_INTERFACE}}
set protocols lldp-med interface {{ACCESS_INTERFACE_RANGE}}

# PoE Configuration
set poe interface {{ACCESS_INTERFACE_RANGE}} maximum-power 30
set poe interface {{ACCESS_INTERFACE_RANGE}} priority low

# Class of Service (QoS)
set class-of-service interfaces {{ACCESS_INTERFACE_RANGE}} unit 0 classifiers dscp default
set class-of-service interfaces {{ACCESS_INTERFACE_RANGE}} unit 0 rewrite-rules dscp default

# Voice QoS
set class-of-service code-points dscp "voice" 46
set class-of-service forwarding-classes class "voice" queue-num 5
set class-of-service scheduler-maps voip-map forwarding-class "voice" scheduler "voice-scheduler"
set class-of-service schedulers "voice-scheduler" transmit-rate percent 20
set class-of-service schedulers "voice-scheduler" priority strict-high

# Firewall Filters for Access Control
set firewall family ethernet-switching filter guest-acl term allow-dhcp from protocol udp
set firewall family ethernet-switching filter guest-acl term allow-dhcp from destination-port 67-68
set firewall family ethernet-switching filter guest-acl term allow-dhcp then accept
set firewall family ethernet-switching filter guest-acl term allow-dns from protocol udp
set firewall family ethernet-switching filter guest-acl term allow-dns from destination-port 53
set firewall family ethernet-switching filter guest-acl term allow-dns then accept
set firewall family ethernet-switching filter guest-acl term allow-http from protocol tcp
set firewall family ethernet-switching filter guest-acl term allow-http from destination-port [80 443]
set firewall family ethernet-switching filter guest-acl term allow-http then accept
set firewall family ethernet-switching filter guest-acl term deny-all then discard

# Apply filter to guest VLAN
set vlans guest forwarding-options filter input guest-acl

# TACACS+ Configuration for Management
set system tacplus-server {{TACACS_SERVER_IP}} secret "{{TACACS_SECRET}}"
set system tacplus-server {{TACACS_SERVER_IP}} timeout 10
set system tacplus-server {{TACACS_SERVER_IP}} single-connection
set system tacplus-server {{TACACS_SERVER_IP}} source-address {{SOURCE_IP}}

set system authentication-order tacplus
set system authentication-order password

# AAA for Management
set system login class super-user-local idle-timeout 60
set system login class super-user-local permissions all
set system login user {{ADMIN_USER}} class super-user-local
set system login user {{ADMIN_USER}} authentication encrypted-password "{{ADMIN_PASSWORD_HASH}}"

# SNMP Configuration
set snmp name "{{HOSTNAME}}"
set snmp description "{{DESCRIPTION}}"
set snmp location "{{LOCATION}}"
set snmp contact "{{CONTACT}}"
set snmp community {{SNMP_COMMUNITY}} authorization read-only
set snmp community {{SNMP_COMMUNITY}} clients {{SNMP_CLIENT_IP}}
set snmp trap-group space targets {{SNMP_TRAP_SERVER}}
set snmp trap-group space categories authentication
set snmp trap-group space categories chassis
set snmp trap-group space categories link
set snmp trap-group space categories configuration

# Syslog Configuration
set system syslog host {{SYSLOG_SERVER}} any info
set system syslog host {{SYSLOG_SERVER}} authorization any
set system syslog host {{SYSLOG_SERVER}} daemon any
set system syslog host {{SYSLOG_SERVER}} kernel any
set system syslog file messages any notice
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any

# Management Access
set system services ssh protocol-version v2
set system services ssh client-alive-interval 120
set system services ssh connection-limit 10
set system services ssh rate-limit 5

set system services netconf ssh
set system services web-management http interface {{MGMT_INTERFACE}}
set system services web-management https system-generated-certificate
set system services web-management https interface {{MGMT_INTERFACE}}

# Access Control for Management
set firewall filter management-access term allow-ssh from source-address {{MGMT_NETWORK}}/{{MGMT_PREFIX}}
set firewall filter management-access term allow-ssh from protocol tcp
set firewall filter management-access term allow-ssh from destination-port 22
set firewall filter management-access term allow-ssh then accept
set firewall filter management-access term allow-https from source-address {{MGMT_NETWORK}}/{{MGMT_PREFIX}}
set firewall filter management-access term allow-https from protocol tcp
set firewall filter management-access term allow-https from destination-port 443
set firewall filter management-access term allow-https then accept
set firewall filter management-access term allow-snmp from source-address {{SNMP_CLIENT_IP}}/32
set firewall filter management-access term allow-snmp from protocol udp
set firewall filter management-access term allow-snmp from destination-port 161
set firewall filter management-access term allow-snmp then accept
set firewall filter management-access term deny-all then reject

# Apply management filter
set interfaces irb unit {{MGMT_VLAN}} family inet filter input management-access

# Default Route
set routing-options static route 0.0.0.0/0 next-hop {{DEFAULT_GATEWAY}}

# Commit and Save
commit and-quit',
  '{
    "HOSTNAME": {"type": "string", "required": true, "description": "Switch hostname"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone setting"},
    "DOMAIN_NAME": {"type": "string", "required": true, "description": "Domain name"},
    "RADIUS_SERVER_IP": {"type": "ip", "required": true, "description": "Primary RADIUS server IP"},
    "RADIUS_SERVER_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary RADIUS server IP"},
    "RADIUS_SECRET": {"type": "password", "required": true, "description": "RADIUS shared secret"},
    "SOURCE_IP": {"type": "ip", "required": true, "description": "Source IP for RADIUS communication"},
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "CORPORATE_GATEWAY": {"type": "ip", "required": true, "description": "Corporate VLAN gateway"},
    "CORPORATE_PREFIX": {"type": "integer", "required": true, "description": "Corporate subnet prefix"},
    "GUEST_GATEWAY": {"type": "ip", "required": true, "description": "Guest VLAN gateway"},
    "GUEST_PREFIX": {"type": "integer", "required": true, "description": "Guest subnet prefix"},
    "IOT_GATEWAY": {"type": "ip", "required": true, "description": "IoT VLAN gateway"},
    "IOT_PREFIX": {"type": "integer", "required": true, "description": "IoT subnet prefix"},
    "VOICE_GATEWAY": {"type": "ip", "required": true, "description": "Voice VLAN gateway"},
    "VOICE_PREFIX": {"type": "integer", "required": true, "description": "Voice subnet prefix"},
    "QUARANTINE_GATEWAY": {"type": "ip", "required": true, "description": "Quarantine VLAN gateway"},
    "QUARANTINE_PREFIX": {"type": "integer", "required": true, "description": "Quarantine subnet prefix"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP address"},
    "MGMT_PREFIX": {"type": "integer", "required": true, "description": "Management subnet prefix"},
    "ACCESS_INTERFACE_RANGE": {"type": "string", "required": true, "description": "Access port range (e.g., ge-0/0/0 to ge-0/0/23)"},
    "UPLINK_INTERFACE": {"type": "string", "required": true, "description": "Uplink interface"},
    "UPLINK_INTERFACE_1": {"type": "string", "required": false, "description": "First interface for LAG"},
    "UPLINK_INTERFACE_2": {"type": "string", "required": false, "description": "Second interface for LAG"},
    "ALL_VLANS": {"type": "string", "required": true, "description": "All VLANs for trunk (e.g., corporate guest voice iot management)"},
    "TACACS_SERVER_IP": {"type": "ip", "required": true, "description": "TACACS+ server IP"},
    "TACACS_SECRET": {"type": "password", "required": true, "description": "TACACS+ shared secret"},
    "ADMIN_USER": {"type": "string", "required": true, "description": "Admin username"},
    "ADMIN_PASSWORD_HASH": {"type": "password", "required": true, "description": "Admin password hash"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community string"},
    "SNMP_CLIENT_IP": {"type": "ip", "required": true, "description": "SNMP client IP"},
    "SNMP_TRAP_SERVER": {"type": "ip", "required": true, "description": "SNMP trap server"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "MGMT_INTERFACE": {"type": "string", "required": true, "description": "Management interface"},
    "MGMT_NETWORK": {"type": "ip", "required": true, "description": "Management network"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "DNS_SERVER_1": {"type": "ip", "required": true, "description": "Primary DNS server"},
    "DNS_SERVER_2": {"type": "ip", "required": true, "description": "Secondary DNS server"},
    "DESCRIPTION": {"type": "string", "required": true, "description": "System description"},
    "LOCATION": {"type": "string", "required": true, "description": "Physical location"},
    "CONTACT": {"type": "string", "required": true, "description": "Contact information"}
  }',
  '["Enterprise Deployment", "JUNOS Integration", "Dynamic VLAN Assignment", "Guest Access", "Voice Integration", "High Security"]',
  '["802.1X", "MAC-RADIUS", "TACACS+", "RADIUS Accounting", "Certificate Authentication"]',
  '["JUNOS OS", "Dynamic VLAN Assignment", "Policy Enforcement", "QoS", "Security Features", "Management Access"]',
  '{"bandwidth": "1Gbps+", "poe_required": true, "junos_support": true, "layer3_routing": true}',
  '["RADIUS Authentication", "DHCP Snooping", "Dynamic ARP Inspection", "Storm Control", "Access Control Lists", "Management Security"]',
  '["Use JUNOS templates for consistency", "Implement proper VLAN design", "Monitor authentication events", "Regular JUNOS updates", "Backup configurations"]',
  '[
    {"issue": "802.1X Authentication Failures", "solution": "Check RADIUS server connectivity and shared secrets", "commands": ["show dot1x interface", "show access radius-server"]},
    {"issue": "VLAN Assignment Issues", "solution": "Verify RADIUS attributes and VLAN configuration", "commands": ["show vlans", "show ethernet-switching interfaces"]},
    {"issue": "MAC-RADIUS Problems", "solution": "Check MAC address format and RADIUS server configuration", "commands": ["show dot1x mac-radius", "show access profile"]}
  ]',
  '["show dot1x interface", "show access radius-server", "show vlans", "show ethernet-switching interfaces", "show protocols rstp", "show poe interface", "show access profile"]',
  '["juniper", "junos", "ex4300", "802.1x", "radius", "enterprise"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Juniper Networks')
);