-- Continue with additional comprehensive templates

-- Extreme Networks Templates
INSERT INTO configuration_templates (
  id, name, description, category, subcategory, configuration_type, complexity_level,
  template_content, template_variables, supported_scenarios, authentication_methods,
  required_features, network_requirements, security_features, best_practices,
  troubleshooting_guide, validation_commands, tags, is_public, vendor_id
) VALUES 
(
  gen_random_uuid(),
  'Extreme X440 - Complete 802.1X with ExtremeCloud IQ Integration',
  'Comprehensive Extreme Networks configuration with 802.1X, ExtremeCloud IQ integration, and dynamic policy enforcement',
  'Authentication',
  'Enterprise Security', 
  '802.1X-ExtremeOS',
  'advanced',
  '# Extreme X440 Complete 802.1X Configuration
# System Configuration
configure terminal
hostname {{HOSTNAME}}
timezone {{TIMEZONE}} {{UTC_OFFSET}}

# NTP Configuration
ntp server {{NTP_SERVER_1}}
ntp server {{NTP_SERVER_2}}
ntp enable

# RADIUS Configuration
radius-server host {{RADIUS_SERVER_IP}} auth-port 1812 acct-port 1813
radius-server host {{RADIUS_SERVER_IP}} key "{{RADIUS_SECRET}}"
radius-server host {{RADIUS_SERVER_IP}} timeout 10
radius-server host {{RADIUS_SERVER_IP}} retries 3

radius-server host {{RADIUS_SERVER_SECONDARY_IP}} auth-port 1812 acct-port 1813  
radius-server host {{RADIUS_SERVER_SECONDARY_IP}} key "{{RADIUS_SECRET}}"
radius-server host {{RADIUS_SERVER_SECONDARY_IP}} timeout 10
radius-server host {{RADIUS_SERVER_SECONDARY_IP}} retries 3

# AAA Configuration
aaa new-model
aaa authentication login default group radius local
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting network default start-stop group radius

# VLAN Configuration
vlan {{CORPORATE_VLAN}}
name "Corporate"
exit

vlan {{GUEST_VLAN}}
name "Guest"
exit

vlan {{IOT_VLAN}}
name "IoT-Devices"
exit

vlan {{VOICE_VLAN}}
name "Voice"
exit

vlan {{QUARANTINE_VLAN}}
name "Quarantine"
exit

vlan {{MGMT_VLAN}}
name "Management"
exit

# Create VLAN interfaces
interface vlan {{CORPORATE_VLAN}}
ip address {{CORPORATE_IP}} {{CORPORATE_MASK}}
no shutdown
exit

interface vlan {{GUEST_VLAN}}
ip address {{GUEST_IP}} {{GUEST_MASK}}
no shutdown
exit

interface vlan {{IOT_VLAN}}
ip address {{IOT_IP}} {{IOT_MASK}}
no shutdown
exit

interface vlan {{MGMT_VLAN}}
ip address {{MGMT_IP}} {{MGMT_MASK}}
no shutdown
exit

# 802.1X Global Configuration
dot1x system-auth-control
dot1x critical eapol

# Access Interface Configuration
interface {{ACCESS_INTERFACE_RANGE}}
description "802.1X Access Port"
switchport mode access
switchport access vlan {{CORPORATE_VLAN}}
switchport voice vlan {{VOICE_VLAN}}
dot1x pae authenticator
dot1x port-control auto
dot1x re-authentication
dot1x timeout tx-period 30
dot1x timeout supp-timeout 30
dot1x timeout server-timeout 30
dot1x max-req 2
dot1x max-reauth-req 3
dot1x re-auth-period 3600
dot1x auth-fail-vlan {{QUARANTINE_VLAN}}
dot1x guest-vlan {{GUEST_VLAN}}
dot1x auth-period 30
dot1x quiet-period 60
spanning-tree portfast
spanning-tree bpduguard enable
no shutdown
exit

# MAC Authentication Bypass
interface {{ACCESS_INTERFACE_RANGE}}
mab
mab auth-type eap
exit

# CoA Configuration
radius-server attribute 31 send nas-port-detail
radius-server vsa send accounting
radius-server vsa send authentication

# Port-based Dynamic Authorization
radius server dynamic-authorization
client {{RADIUS_SERVER_IP}} secret {{RADIUS_SECRET}}
client {{RADIUS_SERVER_SECONDARY_IP}} secret {{RADIUS_SECRET}}
port 3799
exit

# TACACS+ Configuration
tacacs-server host {{TACACS_SERVER_IP}}
tacacs-server key {{TACACS_SECRET}}
tacacs-server timeout 10

# AAA for Management
aaa authentication login console group tacacs+ local
aaa authentication login telnet group tacacs+ local
aaa authorization exec default group tacacs+ local
aaa accounting exec default start-stop group tacacs+

# Access Control Lists
ip access-list extended GUEST-ACL
permit udp any any eq domain
permit tcp any any eq domain
permit tcp any any eq http
permit tcp any any eq https
deny ip any any
exit

ip access-list extended IOT-ACL
permit udp any any eq domain
permit tcp any any eq domain
permit tcp any host {{IOT_CONTROLLER_IP}}
deny ip any any
exit

# Apply ACLs to VLANs
interface vlan {{GUEST_VLAN}}
ip access-group GUEST-ACL in
exit

interface vlan {{IOT_VLAN}}
ip access-group IOT-ACL in
exit

# DHCP Snooping
ip dhcp snooping
ip dhcp snooping vlan {{CORPORATE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}}
ip dhcp snooping verify mac-address

interface {{ACCESS_INTERFACE_RANGE}}
ip dhcp snooping trust
exit

# Dynamic ARP Inspection
ip arp inspection vlan {{CORPORATE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}}

interface {{ACCESS_INTERFACE_RANGE}}
ip arp inspection trust
exit

# Storm Control
interface {{ACCESS_INTERFACE_RANGE}}
storm-control broadcast level 10.00
storm-control multicast level 10.00
storm-control unicast level 10.00
storm-control action drop
exit

# QoS for Voice
mls qos
mls qos trust cos

interface {{ACCESS_INTERFACE_RANGE}}
mls qos trust dscp
priority-queue out
exit

# Spanning Tree Configuration
spanning-tree mode rapid-pvst
spanning-tree vlan {{CORPORATE_VLAN}},{{GUEST_VLAN}},{{IOT_VLAN}},{{VOICE_VLAN}} priority 32768

interface {{ACCESS_INTERFACE_RANGE}}
spanning-tree portfast
spanning-tree bpduguard enable
exit

# LLDP Configuration
lldp enable

interface {{ACCESS_INTERFACE_RANGE}}
lldp transmit
lldp receive
exit

# Uplink Configuration
interface {{UPLINK_INTERFACE}}
description "Uplink to Core"
switchport mode trunk
switchport trunk allowed vlan {{ALL_VLANS}}
switchport trunk native vlan {{MGMT_VLAN}}
channel-group 1 mode active
no shutdown
exit

# Port-Channel Configuration
interface port-channel 1
description "EtherChannel to Core"
switchport mode trunk
switchport trunk allowed vlan {{ALL_VLANS}}
switchport trunk native vlan {{MGMT_VLAN}}
exit

# SNMP Configuration
snmp-server community {{SNMP_COMMUNITY}} RO
snmp-server host {{SNMP_SERVER}} version 2c {{SNMP_COMMUNITY}}
snmp-server enable traps dot1x auth-fail-vlan guest-vlan
snmp-server enable traps config
snmp-server enable traps link-up-down
snmp-server location "{{LOCATION}}"
snmp-server contact "{{CONTACT}}"

# Logging Configuration
logging buffered 65536 informational
logging host {{SYSLOG_SERVER}}
logging facility local7
logging source-interface vlan {{MGMT_VLAN}}

# Management Interface Configuration
ip default-gateway {{DEFAULT_GATEWAY}}

# SSH Configuration
ip ssh version 2
crypto key generate rsa modulus 2048

# Line Configuration
line vty 0 15
transport input ssh
authentication login telnet
exec-timeout 10 0
exit

line console 0
authentication login console
exec-timeout 10 0
exit

# Save Configuration
write memory
exit',
  '{
    "HOSTNAME": {"type": "string", "required": true, "description": "Switch hostname"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone name"},
    "UTC_OFFSET": {"type": "integer", "required": true, "description": "UTC offset hours"},
    "RADIUS_SERVER_IP": {"type": "ip", "required": true, "description": "Primary RADIUS server IP"},
    "RADIUS_SERVER_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary RADIUS server IP"},
    "RADIUS_SECRET": {"type": "password", "required": true, "description": "RADIUS shared secret"},
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "CORPORATE_IP": {"type": "ip", "required": true, "description": "Corporate VLAN IP"},
    "CORPORATE_MASK": {"type": "ip", "required": true, "description": "Corporate subnet mask"},
    "GUEST_IP": {"type": "ip", "required": true, "description": "Guest VLAN IP"},
    "GUEST_MASK": {"type": "ip", "required": true, "description": "Guest subnet mask"},
    "IOT_IP": {"type": "ip", "required": true, "description": "IoT VLAN IP"},
    "IOT_MASK": {"type": "ip", "required": true, "description": "IoT subnet mask"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP"},
    "MGMT_MASK": {"type": "ip", "required": true, "description": "Management subnet mask"},
    "ACCESS_INTERFACE_RANGE": {"type": "string", "required": true, "description": "Access port range"},
    "UPLINK_INTERFACE": {"type": "string", "required": true, "description": "Uplink interface"},
    "ALL_VLANS": {"type": "string", "required": true, "description": "All VLANs for trunk"},
    "TACACS_SERVER_IP": {"type": "ip", "required": true, "description": "TACACS+ server IP"},
    "TACACS_SECRET": {"type": "password", "required": true, "description": "TACACS+ shared secret"},
    "IOT_CONTROLLER_IP": {"type": "ip", "required": true, "description": "IoT controller IP"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "SNMP_SERVER": {"type": "ip", "required": true, "description": "SNMP server IP"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "LOCATION": {"type": "string", "required": true, "description": "Physical location"},
    "CONTACT": {"type": "string", "required": true, "description": "Contact information"}
  }',
  '["Enterprise Deployment", "ExtremeCloud IQ", "Dynamic VLAN Assignment", "Guest Access", "IoT Security", "Voice Integration"]',
  '["802.1X", "MAC Authentication", "TACACS+", "CoA", "RADIUS Accounting"]',
  '["ExtremeOS", "Dynamic VLAN Assignment", "Policy Enforcement", "QoS", "Access Control", "DHCP Snooping"]',
  '{"bandwidth": "1Gbps+", "poe_required": true, "extremecloud_integration": true, "layer3_routing": true}',
  '["RADIUS Authentication", "DHCP Snooping", "Dynamic ARP Inspection", "Storm Control", "Access Control Lists"]',
  '["Use ExtremeCloud IQ for management", "Implement proper VLAN design", "Monitor authentication events", "Regular firmware updates", "Backup configurations"]',
  '[
    {"issue": "802.1X Authentication Failures", "solution": "Check RADIUS connectivity and shared secrets", "commands": ["show dot1x", "show radius"]},
    {"issue": "VLAN Assignment Issues", "solution": "Verify RADIUS attributes and VLAN configuration", "commands": ["show vlan", "show dot1x interface"]}
  ]',
  '["show dot1x", "show radius", "show vlan", "show mac-auth", "show spanning-tree", "show lldp neighbors"]',
  '["extreme", "extremeos", "x440", "802.1x", "extremecloud", "enterprise"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Extreme Networks')
),
(
  gen_random_uuid(),
  'Cisco Catalyst 9400 - Enterprise IBNS 2.0 with TrustSec and ISE Integration',
  'Advanced Cisco Catalyst 9400 configuration with IBNS 2.0, TrustSec, Cisco ISE integration, and software-defined segmentation',
  'Authentication',
  'Enterprise Security',
  'IBNS-TrustSec',
  'expert',
  '! Cisco Catalyst 9400 - Enterprise IBNS 2.0 with TrustSec
! System Configuration
hostname {{HOSTNAME}}
ip domain-name {{DOMAIN_NAME}}

! NTP Configuration
ntp server {{NTP_SERVER_1}}
ntp server {{NTP_SERVER_2}}
clock timezone {{TIMEZONE}} {{UTC_OFFSET}}

! AAA Configuration with ISE
aaa new-model
aaa session-id common

! RADIUS Server Configuration for ISE
radius server ISE-PRIMARY
 address ipv4 {{ISE_PRIMARY_IP}} auth-port 1812 acct-port 1813
 automate-tester username {{TEST_USERNAME}} probe-on
 pac key {{ISE_SHARED_SECRET}}
 retransmit 3
 timeout 5
 
radius server ISE-SECONDARY
 address ipv4 {{ISE_SECONDARY_IP}} auth-port 1812 acct-port 1813
 automate-tester username {{TEST_USERNAME}} probe-on
 pac key {{ISE_SHARED_SECRET}}
 retransmit 3
 timeout 5

! RADIUS Group Configuration
aaa group server radius ISE
 server name ISE-PRIMARY
 server name ISE-SECONDARY
 ip radius source-interface {{SOURCE_INTERFACE}}
 automate-tester username {{TEST_USERNAME}}
 deadtime 15

! AAA Methods
aaa authentication login default local
aaa authentication login VTY group ISE local
aaa authentication dot1x default group ISE
aaa authorization network default group ISE
aaa authorization exec default group ISE local
aaa accounting dot1x default start-stop group ISE
aaa accounting exec default start-stop group ISE
aaa accounting network default start-stop group ISE
aaa accounting system default start-stop group ISE

! TrustSec Configuration
cts enable
cts role-based enforcement

! CTS Authorization Policy
cts authorization list TRUSTSEC-LIST

! Define Security Group Tags
cts role-based sgt-map {{CORPORATE_NETWORK}}/{{CORPORATE_PREFIX}} sgt {{CORPORATE_SGT}}
cts role-based sgt-map {{GUEST_NETWORK}}/{{GUEST_PREFIX}} sgt {{GUEST_SGT}}
cts role-based sgt-map {{IOT_NETWORK}}/{{IOT_PREFIX}} sgt {{IOT_SGT}}
cts role-based sgt-map {{VOICE_NETWORK}}/{{VOICE_PREFIX}} sgt {{VOICE_SGT}}

! TrustSec Policies
cts role-based policy from {{GUEST_SGT}} to {{CORPORATE_SGT}} deny
cts role-based policy from {{IOT_SGT}} to {{CORPORATE_SGT}} permit tcp dst eq 443
cts role-based policy from {{CORPORATE_SGT}} to {{GUEST_SGT}} deny
cts role-based policy default permit

! Device Tracking for IBNS 2.0
device-tracking tracking
device-tracking policy IPDT_MAX_10
 limit address-count 10
 no protocol udp
 tracking enable

! Access Session Configuration
access-session mac-move deny
access-session accounting attributes filter-spec include list FILTER_REQ_ATTRS

! Service Templates
service-template CORPORATE_TEMPLATE
 vlan {{CORPORATE_VLAN}}
 sgt {{CORPORATE_SGT}}
 access-group {{CORPORATE_ACL}}
 description "Corporate User Access"
 
service-template GUEST_TEMPLATE
 vlan {{GUEST_VLAN}}
 sgt {{GUEST_SGT}}
 access-group {{GUEST_ACL}}
 description "Guest User Access"
 
service-template IOT_TEMPLATE
 vlan {{IOT_VLAN}}
 sgt {{IOT_SGT}}
 access-group {{IOT_ACL}}
 description "IoT Device Access"

service-template QUARANTINE_TEMPLATE
 vlan {{QUARANTINE_VLAN}}
 sgt {{QUARANTINE_SGT}}
 access-group {{QUARANTINE_ACL}}
 description "Quarantine Access"

! Policy Maps for IBNS 2.0
policy-map type control subscriber PMAP_DefaultWiredDot1xClosedAuth
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x retries 3 retry-time 5 priority 10
 event authentication-failure match-all
  10 class always do-until-failure
   10 authorize
   20 pause reauthentication
 event agent-found match-all
  10 class always do-until-failure
   10 authenticate using mab priority 20
 event inactivity-timeout match-all
  10 class always do-until-failure
   10 clear-session
 event authentication-success match-all
  10 class always do-until-failure
   10 activate service-template CORPORATE_TEMPLATE
 event violation match-all
  10 class always do-until-failure
   10 restrict

! Class Maps for Authentication Results
class-map type control subscriber match-any DOT1X_FAILED
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-any DOT1X_MEDIUM_PRIORITY
 match authorization-status authorized
 match method dot1x

class-map type control subscriber match-any MAB_FAILED
 match method mab
 match result-type method mab authoritative

! Interface Template for Access Ports
template ACCESS_PORT_TEMPLATE
 description "IBNS 2.0 Access Port with TrustSec"
 switchport mode access
 switchport access vlan {{DEFAULT_VLAN}}
 switchport voice vlan {{VOICE_VLAN}}
 access-session port-control auto
 access-session closed
 access-session host-mode multi-auth
 access-session control-direction in
 access-session port-control auto
 dot1x pae authenticator
 dot1x timeout tx-period 10
 mab
 spanning-tree portfast
 spanning-tree bpduguard enable
 cts manual
  policy static sgt {{DEFAULT_SGT}} trusted

! Apply Control Policy
template ACCESS_PORT_TEMPLATE
 service-policy type control subscriber PMAP_DefaultWiredDot1xClosedAuth

! VLAN Configuration
vlan {{CORPORATE_VLAN}}
 name Corporate
 
vlan {{GUEST_VLAN}}
 name Guest
 
vlan {{IOT_VLAN}}
 name IoT-Devices
 
vlan {{VOICE_VLAN}}
 name Voice
 
vlan {{QUARANTINE_VLAN}}
 name Quarantine
 
vlan {{MGMT_VLAN}}
 name Management

! SVI Configuration with TrustSec
interface vlan {{CORPORATE_VLAN}}
 ip address {{CORPORATE_IP}} {{CORPORATE_MASK}}
 cts manual
  policy static sgt {{CORPORATE_SGT}} trusted
 no shutdown

interface vlan {{GUEST_VLAN}}
 ip address {{GUEST_IP}} {{GUEST_MASK}}
 cts manual
  policy static sgt {{GUEST_SGT}} trusted
 no shutdown

interface vlan {{IOT_VLAN}}
 ip address {{IOT_IP}} {{IOT_MASK}}
 cts manual
  policy static sgt {{IOT_SGT}} trusted
 no shutdown

interface vlan {{MGMT_VLAN}}
 ip address {{MGMT_IP}} {{MGMT_MASK}}
 no shutdown

! Apply Template to Access Interfaces
interface range {{ACCESS_INTERFACE_RANGE}}
 source template ACCESS_PORT_TEMPLATE
 device-tracking attach-policy IPDT_MAX_10

! Uplink Configuration with TrustSec
interface {{UPLINK_INTERFACE}}
 description "Uplink to Core with TrustSec"
 switchport mode trunk
 switchport trunk allowed vlan {{ALL_VLANS}}
 cts enable
 cts role-based enforcement
 spanning-tree guard root

! CoA Configuration
aaa server radius dynamic-author
 client {{ISE_PRIMARY_IP}} server-key {{ISE_SHARED_SECRET}}
 client {{ISE_SECONDARY_IP}} server-key {{ISE_SHARED_SECRET}}
 port 3799
 auth-type any

! TACACS+ for Management
tacacs server TACACS-SERVER
 address ipv4 {{TACACS_SERVER_IP}}
 key {{TACACS_SECRET}}
 timeout 10

aaa group server tacacs+ TACACS-GROUP
 server name TACACS-SERVER

aaa authentication login CONSOLE group TACACS-GROUP local
aaa authorization exec CONSOLE group TACACS-GROUP local
aaa authorization commands 15 CONSOLE group TACACS-GROUP local
aaa accounting exec CONSOLE start-stop group TACACS-GROUP
aaa accounting commands 15 CONSOLE start-stop group TACACS-GROUP

! Access Control Lists
ip access-list extended {{CORPORATE_ACL}}
 permit ip any any

ip access-list extended {{GUEST_ACL}}
 permit udp any any eq domain
 permit tcp any any eq domain
 permit tcp any any eq 80
 permit tcp any any eq 443
 deny ip any any

ip access-list extended {{IOT_ACL}}
 permit udp any any eq domain
 permit tcp any any eq domain
 permit tcp any host {{IOT_CONTROLLER_IP}}
 deny ip any any

ip access-list extended {{QUARANTINE_ACL}}
 permit tcp any host {{REMEDIATION_SERVER_IP}} eq 443
 permit udp any any eq domain
 permit tcp any any eq domain
 deny ip any any

! SNMP Configuration
snmp-server community {{SNMP_COMMUNITY}} RO
snmp-server host {{SNMP_SERVER}} version 2c {{SNMP_COMMUNITY}}
snmp-server enable traps dot1x auth-fail-vlan guest-vlan
snmp-server enable traps cts role-based-enforcement
snmp-server enable traps config

! Logging Configuration
logging buffered 65536 informational
logging host {{SYSLOG_SERVER}}
logging facility local7
logging source-interface {{SOURCE_INTERFACE}}

! Default Route
ip route 0.0.0.0 0.0.0.0 {{DEFAULT_GATEWAY}}

! Management Access
line vty 0 15
 transport input ssh
 access-class {{MGMT_ACL}} in
 authentication login VTY
 authorization exec VTY
 authorization commands 15 VTY
 accounting exec VTY
 accounting commands 15 VTY
 exec-timeout 10 0

line console 0
 authentication login CONSOLE
 authorization exec CONSOLE
 authorization commands 15 CONSOLE
 accounting exec CONSOLE
 accounting commands 15 CONSOLE
 exec-timeout 10 0

! SSH Configuration
ip ssh version 2
crypto key generate rsa general-keys modulus 2048

! Save Configuration
end
write memory',
  '{
    "HOSTNAME": {"type": "string", "required": true, "description": "Switch hostname"},
    "DOMAIN_NAME": {"type": "string", "required": true, "description": "Domain name"},
    "ISE_PRIMARY_IP": {"type": "ip", "required": true, "description": "Primary ISE PSN IP"},
    "ISE_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary ISE PSN IP"},
    "ISE_SHARED_SECRET": {"type": "password", "required": true, "description": "ISE shared secret"},
    "TEST_USERNAME": {"type": "string", "required": true, "description": "Test username for automate-tester"},
    "SOURCE_INTERFACE": {"type": "string", "required": true, "description": "Source interface for RADIUS"},
    "CORPORATE_NETWORK": {"type": "ip", "required": true, "description": "Corporate network address"},
    "CORPORATE_PREFIX": {"type": "integer", "required": true, "description": "Corporate network prefix"},
    "GUEST_NETWORK": {"type": "ip", "required": true, "description": "Guest network address"},
    "GUEST_PREFIX": {"type": "integer", "required": true, "description": "Guest network prefix"},
    "IOT_NETWORK": {"type": "ip", "required": true, "description": "IoT network address"},
    "IOT_PREFIX": {"type": "integer", "required": true, "description": "IoT network prefix"},
    "VOICE_NETWORK": {"type": "ip", "required": true, "description": "Voice network address"},
    "VOICE_PREFIX": {"type": "integer", "required": true, "description": "Voice network prefix"},
    "CORPORATE_SGT": {"type": "integer", "required": true, "description": "Corporate Security Group Tag"},
    "GUEST_SGT": {"type": "integer", "required": true, "description": "Guest Security Group Tag"},
    "IOT_SGT": {"type": "integer", "required": true, "description": "IoT Security Group Tag"},
    "VOICE_SGT": {"type": "integer", "required": true, "description": "Voice Security Group Tag"},
    "QUARANTINE_SGT": {"type": "integer", "required": true, "description": "Quarantine Security Group Tag"},
    "DEFAULT_SGT": {"type": "integer", "required": true, "description": "Default Security Group Tag"},
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "DEFAULT_VLAN": {"type": "integer", "required": true, "description": "Default access VLAN"},
    "CORPORATE_IP": {"type": "ip", "required": true, "description": "Corporate VLAN IP"},
    "CORPORATE_MASK": {"type": "ip", "required": true, "description": "Corporate subnet mask"},
    "GUEST_IP": {"type": "ip", "required": true, "description": "Guest VLAN IP"},
    "GUEST_MASK": {"type": "ip", "required": true, "description": "Guest subnet mask"},
    "IOT_IP": {"type": "ip", "required": true, "description": "IoT VLAN IP"},
    "IOT_MASK": {"type": "ip", "required": true, "description": "IoT subnet mask"},
    "MGMT_IP": {"type": "ip", "required": true, "description": "Management IP"},
    "MGMT_MASK": {"type": "ip", "required": true, "description": "Management subnet mask"},
    "ACCESS_INTERFACE_RANGE": {"type": "string", "required": true, "description": "Access port range"},
    "UPLINK_INTERFACE": {"type": "string", "required": true, "description": "Uplink interface"},
    "ALL_VLANS": {"type": "string", "required": true, "description": "All VLANs for trunk"},
    "TACACS_SERVER_IP": {"type": "ip", "required": true, "description": "TACACS+ server IP"},
    "TACACS_SECRET": {"type": "password", "required": true, "description": "TACACS+ shared secret"},
    "CORPORATE_ACL": {"type": "string", "required": true, "description": "Corporate ACL name"},
    "GUEST_ACL": {"type": "string", "required": true, "description": "Guest ACL name"},
    "IOT_ACL": {"type": "string", "required": true, "description": "IoT ACL name"},
    "QUARANTINE_ACL": {"type": "string", "required": true, "description": "Quarantine ACL name"},
    "IOT_CONTROLLER_IP": {"type": "ip", "required": true, "description": "IoT controller IP"},
    "REMEDIATION_SERVER_IP": {"type": "ip", "required": true, "description": "Remediation server IP"},
    "DEFAULT_GATEWAY": {"type": "ip", "required": true, "description": "Default gateway"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone name"},
    "UTC_OFFSET": {"type": "integer", "required": true, "description": "UTC offset"},
    "SNMP_SERVER": {"type": "ip", "required": true, "description": "SNMP server IP"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "MGMT_ACL": {"type": "string", "required": true, "description": "Management ACL name"}
  }',
  '["Enterprise Deployment", "ISE Integration", "TrustSec", "Software Defined Segmentation", "Advanced Security", "Policy Enforcement"]',
  '["802.1X", "MAB", "TrustSec", "ISE", "CoA", "TACACS+", "SGT"]',
  '["IBNS 2.0", "TrustSec", "Security Group Tags", "Policy Enforcement", "ISE Integration", "Advanced Analytics"]',
  '{"bandwidth": "10Gbps+", "ise_required": true, "trustsec_support": true, "advanced_policy": true}',
  '["TrustSec Encryption", "Security Group Tags", "Policy Enforcement", "ISE Integration", "Advanced Threat Detection"]',
  '["Use ISE for centralized policy", "Implement TrustSec properly", "Monitor SGT assignments", "Regular policy reviews", "Advanced analytics"]',
  '[
    {"issue": "TrustSec Policy Issues", "solution": "Check SGT assignments and policy matrix", "commands": ["show cts role-based policy", "show cts role-based sgt-map"]},
    {"issue": "ISE Integration Problems", "solution": "Verify ISE connectivity and shared secrets", "commands": ["show radius statistics", "show authentication sessions"]}
  ]',
  '["show cts role-based policy", "show cts role-based sgt-map", "show authentication sessions", "show radius statistics", "show access-session", "show cts environment-data"]',
  '["cisco", "catalyst9400", "ibns2", "trustsec", "ise", "sgt", "enterprise"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems')
),
(
  gen_random_uuid(),
  'Ubiquiti UniFi - Complete 802.1X with Cloud Controller Integration',
  'Comprehensive UniFi configuration with 802.1X authentication, RADIUS integration, and UniFi Cloud Controller management',
  'Authentication',
  'SMB Security',
  '802.1X-UniFi',
  'intermediate',
  '# UniFi Switch Complete 802.1X Configuration
# Note: This configuration is applied through UniFi Controller

# Network Configuration
config:
  networks:
    - name: "Corporate"
      vlan_id: {{CORPORATE_VLAN}}
      subnet: "{{CORPORATE_NETWORK}}/{{CORPORATE_PREFIX}}"
      dhcp_enabled: true
      dhcp_range_start: "{{CORPORATE_DHCP_START}}"
      dhcp_range_stop: "{{CORPORATE_DHCP_END}}"
      domain_name: "{{DOMAIN_NAME}}"
      
    - name: "Guest"
      vlan_id: {{GUEST_VLAN}}
      subnet: "{{GUEST_NETWORK}}/{{GUEST_PREFIX}}"
      dhcp_enabled: true
      dhcp_range_start: "{{GUEST_DHCP_START}}"
      dhcp_range_stop: "{{GUEST_DHCP_END}}"
      guest_policy: true
      internet_access_only: true
      
    - name: "IoT"
      vlan_id: {{IOT_VLAN}}
      subnet: "{{IOT_NETWORK}}/{{IOT_PREFIX}}"
      dhcp_enabled: true
      dhcp_range_start: "{{IOT_DHCP_START}}"
      dhcp_range_stop: "{{IOT_DHCP_END}}"
      isolation: true
      
    - name: "Voice"
      vlan_id: {{VOICE_VLAN}}
      subnet: "{{VOICE_NETWORK}}/{{VOICE_PREFIX}}"
      dhcp_enabled: true
      dhcp_range_start: "{{VOICE_DHCP_START}}"
      dhcp_range_stop: "{{VOICE_DHCP_END}}"
      priority: high

# RADIUS Configuration
radius_profiles:
  - name: "Primary-RADIUS"
    server: "{{RADIUS_SERVER_IP}}"
    port: 1812
    secret: "{{RADIUS_SECRET}}"
    accounting_enabled: true
    accounting_port: 1813
    interim_update_interval: 600
    auth_timeout: 30
    
  - name: "Secondary-RADIUS"
    server: "{{RADIUS_SERVER_SECONDARY_IP}}"
    port: 1812
    secret: "{{RADIUS_SECRET}}"
    accounting_enabled: true
    accounting_port: 1813
    interim_update_interval: 600
    auth_timeout: 30

# 802.1X Profiles
dot1x_profiles:
  - name: "Corporate-802.1X"
    radius_profile: "Primary-RADIUS"
    fallback_radius_profile: "Secondary-RADIUS"
    auth_methods:
      - "dot1x"
      - "mac"
    guest_vlan: {{GUEST_VLAN}}
    failed_auth_vlan: {{QUARANTINE_VLAN}}
    reauth_interval: 3600
    quiet_period: 60
    tx_period: 30
    max_reauth_attempts: 3
    mac_auth_bypass: true
    mac_filter_enabled: true
    
  - name: "Guest-802.1X"
    radius_profile: "Primary-RADIUS"
    fallback_radius_profile: "Secondary-RADIUS"
    auth_methods:
      - "mac"
    guest_vlan: {{GUEST_VLAN}}
    reauth_interval: 1800
    mac_auth_bypass: true
    open_authentication: true

# Port Profiles
port_profiles:
  - name: "Access-Corporate"
    type: "access"
    native_vlan: {{CORPORATE_VLAN}}
    voice_vlan: {{VOICE_VLAN}}
    dot1x_profile: "Corporate-802.1X"
    poe_mode: "auto"
    storm_control:
      broadcast_rate: 10
      multicast_rate: 10
      unknown_unicast_rate: 10
    stp_portfast: true
    stp_bpdu_guard: true
    dhcp_snooping: true
    
  - name: "Access-Guest"
    type: "access"
    native_vlan: {{GUEST_VLAN}}
    dot1x_profile: "Guest-802.1X"
    poe_mode: "auto"
    storm_control:
      broadcast_rate: 10
      multicast_rate: 10
      unknown_unicast_rate: 10
    stp_portfast: true
    stp_bpdu_guard: true
    dhcp_snooping: true
    
  - name: "Uplink-Trunk"
    type: "trunk"
    native_vlan: {{MGMT_VLAN}}
    allowed_vlans:
      - {{CORPORATE_VLAN}}
      - {{GUEST_VLAN}}
      - {{IOT_VLAN}}
      - {{VOICE_VLAN}}
      - {{MGMT_VLAN}}
    stp_portfast: false
    link_aggregation: true

# Switch Configuration
switches:
  - model: "{{SWITCH_MODEL}}"
    mac: "{{SWITCH_MAC}}"
    name: "{{SWITCH_NAME}}"
    site: "{{SITE_NAME}}"
    port_overrides:
      # Access ports 1-24
      "1-24":
        profile: "Access-Corporate"
        name: "802.1X Access Port"
        
      # Uplink ports 25-28
      "25-28":
        profile: "Uplink-Trunk"
        name: "Uplink to Core"

# Firewall Rules
firewall_groups:
  - name: "RFC1918_NETWORKS"
    type: "address-group"
    members:
      - "10.0.0.0/8"
      - "172.16.0.0/12"
      - "192.168.0.0/16"
      
  - name: "DNS_SERVERS"
    type: "address-group"
    members:
      - "{{DNS_SERVER_1}}"
      - "{{DNS_SERVER_2}}"
      - "8.8.8.8"
      - "1.1.1.1"

firewall_rules:
  # Guest Network Rules
  - name: "GUEST_ALLOW_DNS"
    action: "accept"
    protocol: "all"
    src_network: "{{GUEST_VLAN}}"
    dst_group: "DNS_SERVERS"
    dst_port: "53"
    
  - name: "GUEST_ALLOW_HTTP_HTTPS"
    action: "accept"
    protocol: "tcp"
    src_network: "{{GUEST_VLAN}}"
    dst_port: "80,443"
    destination: "!RFC1918_NETWORKS"
    
  - name: "GUEST_DENY_INTERNAL"
    action: "drop"
    protocol: "all"
    src_network: "{{GUEST_VLAN}}"
    dst_group: "RFC1918_NETWORKS"
    
  # IoT Network Rules
  - name: "IOT_ALLOW_DNS"
    action: "accept"
    protocol: "all"
    src_network: "{{IOT_VLAN}}"
    dst_group: "DNS_SERVERS"
    dst_port: "53"
    
  - name: "IOT_ALLOW_CONTROLLER"
    action: "accept"
    protocol: "tcp"
    src_network: "{{IOT_VLAN}}"
    dst_address: "{{IOT_CONTROLLER_IP}}"
    
  - name: "IOT_DENY_INTERNAL"
    action: "drop"
    protocol: "all"
    src_network: "{{IOT_VLAN}}"
    dst_group: "RFC1918_NETWORKS"

# Quality of Service
qos_profiles:
  - name: "Voice-QoS"
    download_limit: null
    upload_limit: null
    voice_packets_priority: "high"
    voice_dscp: 46
    
  - name: "Corporate-QoS"
    download_limit: null
    upload_limit: null
    default_priority: "normal"
    
  - name: "Guest-QoS"
    download_limit: {{GUEST_BANDWIDTH_LIMIT}}
    upload_limit: {{GUEST_BANDWIDTH_LIMIT}}
    default_priority: "low"

# Apply QoS to Networks
network_qos_mapping:
  - network: "Corporate"
    qos_profile: "Corporate-QoS"
  - network: "Voice"
    qos_profile: "Voice-QoS"
  - network: "Guest"
    qos_profile: "Guest-QoS"

# System Settings
system_settings:
  hostname: "{{HOSTNAME}}"
  timezone: "{{TIMEZONE}}"
  ntp_servers:
    - "{{NTP_SERVER_1}}"
    - "{{NTP_SERVER_2}}"
  syslog_servers:
    - host: "{{SYSLOG_SERVER}}"
      port: 514
      facility: "local7"
  snmp:
    community: "{{SNMP_COMMUNITY}}"
    location: "{{LOCATION}}"
    contact: "{{CONTACT}}"
    servers:
      - "{{SNMP_SERVER}}"

# Management Settings
management:
  ssh_enabled: true
  ssh_keys:
    - "{{SSH_PUBLIC_KEY}}"
  admin_password: "{{ADMIN_PASSWORD}}"
  enable_statistics: true
  enable_analytics: true
  
# Advanced Features
advanced_features:
  spanning_tree:
    enabled: true
    mode: "rstp"
    priority: 32768
    
  igmp_snooping:
    enabled: true
    vlans:
      - {{CORPORATE_VLAN}}
      - {{VOICE_VLAN}}
      
  dhcp_snooping:
    enabled: true
    vlans:
      - {{CORPORATE_VLAN}}
      - {{GUEST_VLAN}}
      - {{IOT_VLAN}}
    trusted_interfaces:
      - "uplink"
      
  loop_detection:
    enabled: true
    action: "disable"
    
  lldp:
    enabled: true
    
  storm_control:
    enabled: true
    default_rates:
      broadcast: 10
      multicast: 10
      unknown_unicast: 10

# Monitoring and Alerts
alerts:
  - type: "authentication_failure"
    threshold: 5
    window: "5m"
    action: "email"
    
  - type: "unauthorized_device"
    action: "quarantine"
    
  - type: "link_down"
    interfaces: ["uplink"]
    action: "email"
    
  - type: "high_cpu_usage"
    threshold: 80
    window: "10m"
    action: "email"

# Backup and Configuration Management
backup:
  enabled: true
  frequency: "daily"
  retention: 30
  destination: "{{BACKUP_SERVER}}"

# Integration Settings
integrations:
  radius:
    primary: "{{RADIUS_SERVER_IP}}"
    secondary: "{{RADIUS_SERVER_SECONDARY_IP}}"
    shared_secret: "{{RADIUS_SECRET}}"
    coa_enabled: true
    accounting_enabled: true
    
  unifi_controller:
    url: "{{CONTROLLER_URL}}"
    site: "{{SITE_NAME}}"
    auto_backup: true
    
  external_portal:
    enabled: {{PORTAL_ENABLED}}
    url: "{{PORTAL_URL}}"
    redirect_https: true',
  '{
    "CORPORATE_VLAN": {"type": "integer", "required": true, "description": "Corporate VLAN ID"},
    "GUEST_VLAN": {"type": "integer", "required": true, "description": "Guest VLAN ID"},
    "IOT_VLAN": {"type": "integer", "required": true, "description": "IoT VLAN ID"},
    "VOICE_VLAN": {"type": "integer", "required": true, "description": "Voice VLAN ID"},
    "QUARANTINE_VLAN": {"type": "integer", "required": true, "description": "Quarantine VLAN ID"},
    "MGMT_VLAN": {"type": "integer", "required": true, "description": "Management VLAN ID"},
    "CORPORATE_NETWORK": {"type": "ip", "required": true, "description": "Corporate network address"},
    "CORPORATE_PREFIX": {"type": "integer", "required": true, "description": "Corporate network prefix"},
    "GUEST_NETWORK": {"type": "ip", "required": true, "description": "Guest network address"},
    "GUEST_PREFIX": {"type": "integer", "required": true, "description": "Guest network prefix"},
    "IOT_NETWORK": {"type": "ip", "required": true, "description": "IoT network address"},
    "IOT_PREFIX": {"type": "integer", "required": true, "description": "IoT network prefix"},
    "VOICE_NETWORK": {"type": "ip", "required": true, "description": "Voice network address"},
    "VOICE_PREFIX": {"type": "integer", "required": true, "description": "Voice network prefix"},
    "CORPORATE_DHCP_START": {"type": "ip", "required": true, "description": "Corporate DHCP range start"},
    "CORPORATE_DHCP_END": {"type": "ip", "required": true, "description": "Corporate DHCP range end"},
    "GUEST_DHCP_START": {"type": "ip", "required": true, "description": "Guest DHCP range start"},
    "GUEST_DHCP_END": {"type": "ip", "required": true, "description": "Guest DHCP range end"},
    "IOT_DHCP_START": {"type": "ip", "required": true, "description": "IoT DHCP range start"},
    "IOT_DHCP_END": {"type": "ip", "required": true, "description": "IoT DHCP range end"},
    "VOICE_DHCP_START": {"type": "ip", "required": true, "description": "Voice DHCP range start"},
    "VOICE_DHCP_END": {"type": "ip", "required": true, "description": "Voice DHCP range end"},
    "RADIUS_SERVER_IP": {"type": "ip", "required": true, "description": "Primary RADIUS server IP"},
    "RADIUS_SERVER_SECONDARY_IP": {"type": "ip", "required": true, "description": "Secondary RADIUS server IP"},
    "RADIUS_SECRET": {"type": "password", "required": true, "description": "RADIUS shared secret"},
    "SWITCH_MODEL": {"type": "string", "required": true, "description": "UniFi switch model"},
    "SWITCH_MAC": {"type": "string", "required": true, "description": "Switch MAC address"},
    "SWITCH_NAME": {"type": "string", "required": true, "description": "Switch name"},
    "SITE_NAME": {"type": "string", "required": true, "description": "UniFi site name"},
    "DNS_SERVER_1": {"type": "ip", "required": true, "description": "Primary DNS server"},
    "DNS_SERVER_2": {"type": "ip", "required": true, "description": "Secondary DNS server"},
    "IOT_CONTROLLER_IP": {"type": "ip", "required": true, "description": "IoT controller IP"},
    "GUEST_BANDWIDTH_LIMIT": {"type": "integer", "required": true, "description": "Guest bandwidth limit in Mbps"},
    "HOSTNAME": {"type": "string", "required": true, "description": "Switch hostname"},
    "TIMEZONE": {"type": "string", "required": true, "description": "Timezone setting"},
    "NTP_SERVER_1": {"type": "ip", "required": true, "description": "Primary NTP server"},
    "NTP_SERVER_2": {"type": "ip", "required": true, "description": "Secondary NTP server"},
    "SYSLOG_SERVER": {"type": "ip", "required": true, "description": "Syslog server IP"},
    "SNMP_SERVER": {"type": "ip", "required": true, "description": "SNMP server IP"},
    "SNMP_COMMUNITY": {"type": "string", "required": true, "description": "SNMP community"},
    "LOCATION": {"type": "string", "required": true, "description": "Physical location"},
    "CONTACT": {"type": "string", "required": true, "description": "Contact information"},
    "SSH_PUBLIC_KEY": {"type": "text", "required": true, "description": "SSH public key"},
    "ADMIN_PASSWORD": {"type": "password", "required": true, "description": "Admin password"},
    "BACKUP_SERVER": {"type": "string", "required": true, "description": "Backup server URL"},
    "CONTROLLER_URL": {"type": "string", "required": true, "description": "UniFi Controller URL"},
    "PORTAL_ENABLED": {"type": "boolean", "required": false, "description": "Enable external portal"},
    "PORTAL_URL": {"type": "string", "required": false, "description": "External portal URL"},
    "DOMAIN_NAME": {"type": "string", "required": true, "description": "Domain name"}
  }',
  '["SMB Deployment", "UniFi Controller", "Guest Access", "IoT Security", "Voice Networks", "Simple Management"]',
  '["802.1X", "MAC Authentication", "RADIUS", "Portal Authentication", "Open Authentication"]',
  '["UniFi Controller", "Cloud Management", "Dynamic VLAN Assignment", "Policy Enforcement", "Guest Portal"]',
  '{"controller_required": true, "cloud_management": true, "simple_deployment": true, "guest_portal": true}',
  '["RADIUS Authentication", "Firewall Rules", "QoS", "DHCP Snooping", "Storm Control"]',
  '["Use UniFi Controller for management", "Regular firmware updates", "Monitor guest usage", "Implement proper VLANs", "Regular backups"]',
  '[
    {"issue": "Controller Connection Issues", "solution": "Check network connectivity and controller status", "commands": ["Check controller logs", "Verify network settings"]},
    {"issue": "RADIUS Authentication Problems", "solution": "Verify RADIUS server configuration and connectivity", "commands": ["Test RADIUS connectivity", "Check shared secrets"]}
  ]',
  '["Check UniFi Controller dashboard", "View authentication logs", "Monitor network statistics", "Check device status", "Review alerts"]',
  '["ubiquiti", "unifi", "802.1x", "controller", "smb", "simple"]',
  true,
  (SELECT id FROM vendor_library WHERE vendor_name = 'Ubiquiti Networks')
);