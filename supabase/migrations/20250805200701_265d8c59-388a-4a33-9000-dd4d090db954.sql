-- Enhanced Configuration Templates with Comprehensive Features
-- Based on industry best practices and advanced configurations

INSERT INTO configuration_templates (
    id,
    name,
    description,
    vendor_id,
    category,
    subcategory,
    configuration_type,
    complexity_level,
    template_content,
    template_variables,
    supported_scenarios,
    authentication_methods,
    required_features,
    security_features,
    best_practices,
    troubleshooting_guide,
    validation_commands,
    tags,
    is_public,
    is_validated,
    created_by
) VALUES 

-- Cisco WLC 9800 RADIUS Device Administration
(
    gen_random_uuid(),
    'Cisco WLC 9800 - Complete RADIUS Device Administration',
    'Comprehensive RADIUS configuration for Cisco WLC 9800 device administration covering SSH, Console, Web GUI, and NETCONF sessions with High Availability support',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems'),
    'Authentication',
    'Device Administration',
    'RADIUS-WLC',
    'advanced',
    '! Cisco WLC 9800 - Complete RADIUS Device Administration Configuration
! Supports SSH, Console, Web GUI, and NETCONF authentication

! Create local fallback account
username {{LOCAL_ADMIN_USER}} privilege 15 algorithm-type sha256 secret {{LOCAL_ADMIN_PASSWORD}}
enable algorithm-type sha256 secret {{ENABLE_PASSWORD}}

! Create non-usable account for RADIUS server probing
username {{RADIUS_TEST_USER}} privilege 0 algorithm-type sha256 secret {{RADIUS_TEST_PASSWORD}}
username {{RADIUS_TEST_USER}} autocommand exit

! Enable AAA services
aaa new-model

! Configure RADIUS servers
radius server {{RADIUS_SERVER_1_NAME}}
 address ipv4 {{RADIUS_SERVER_1_IP}} auth-port 1812 acct-port 1813
 timeout {{RADIUS_TIMEOUT}}
 retransmit {{RADIUS_RETRANSMIT}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
 key {{RADIUS_SHARED_SECRET}}

radius server {{RADIUS_SERVER_2_NAME}}
 address ipv4 {{RADIUS_SERVER_2_IP}} auth-port 1812 acct-port 1813
 timeout {{RADIUS_TIMEOUT}}
 retransmit {{RADIUS_RETRANSMIT}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
 key {{RADIUS_SHARED_SECRET}}

! Configure RADIUS Server Group
aaa group server radius {{RADIUS_GROUP_NAME}}
 server name {{RADIUS_SERVER_1_NAME}}
 server name {{RADIUS_SERVER_2_NAME}}
 deadtime {{RADIUS_DEADTIME}}

! VRF Configuration (if required)
{{#if VRF_NAME}}
aaa group server radius {{RADIUS_GROUP_NAME}}
 ip vrf forwarding {{VRF_NAME}}
 ip radius source-interface {{SOURCE_INTERFACE}}
{{/if}}

! Load balancing and dead criteria
radius-server load-balance method least-outstanding
radius-server dead-criteria time 5 tries 3

! Method List Configuration - Option 1: RADIUS Primary
{{#if RADIUS_PRIMARY}}
aaa authentication login {{AUTH_METHOD_LIST}} group {{RADIUS_GROUP_NAME}} local
aaa authorization exec {{AUTHZ_METHOD_LIST}} group {{RADIUS_GROUP_NAME}} local if-authenticated
{{else}}
! Method List Configuration - Option 2: Local Primary
aaa authentication login {{AUTH_METHOD_LIST}} local group {{RADIUS_GROUP_NAME}}
aaa authorization exec {{AUTHZ_METHOD_LIST}} local group {{RADIUS_GROUP_NAME}} if-authenticated
{{/if}}

aaa authorization console

! Configure Accounting
aaa accounting exec default start-stop group {{RADIUS_GROUP_NAME}}

! Activate AAA RADIUS for HTTPS Web GUI
ip http authentication aaa login-authentication {{AUTH_METHOD_LIST}}
ip http authentication aaa exec-authorization {{AUTHZ_METHOD_LIST}}

! Activate AAA RADIUS for NETCONF/RESTCONF authentication (17.9.1+)
yang-interfaces aaa authentication method-list {{AUTH_METHOD_LIST}}
yang-interfaces aaa authorization method-list {{AUTHZ_METHOD_LIST}}

! Restart HTTP/HTTPS services
no ip http server
no ip http secure-server
ip http server
ip http secure-server

! Activate AAA RADIUS authentication for SSH sessions
line vty 0 97
 exec-timeout {{EXEC_TIMEOUT}} 0
 login authentication {{AUTH_METHOD_LIST}}
 authorization exec {{AUTHZ_METHOD_LIST}}
 transport preferred none
 transport input ssh
 transport output none

! Activate AAA RADIUS authentication for Console port
line con 0
 exec-timeout {{CONSOLE_TIMEOUT}} 0
 transport preferred none
 login authentication {{AUTH_METHOD_LIST}}
 authorization exec {{AUTHZ_METHOD_LIST}}

! High Availability Configuration (if applicable)
{{#if HA_ENABLED}}
! Additional RADIUS clients needed:
! - WMI IP address of HA Cluster
! - RMI IP address of Primary WLC  
! - RMI IP address of Secondary WLC
{{/if}}',
    '{
      "LOCAL_ADMIN_USER": "netadmin",
      "LOCAL_ADMIN_PASSWORD": "P@ssw0rd123!",
      "ENABLE_PASSWORD": "En@ble123!",
      "RADIUS_TEST_USER": "SW-RAD-TEST",
      "RADIUS_TEST_PASSWORD": "TestP@ss123!",
      "RADIUS_SERVER_1_NAME": "RAD-ISE-PSN-1",
      "RADIUS_SERVER_1_IP": "10.10.10.101",
      "RADIUS_SERVER_2_NAME": "RAD-ISE-PSN-2", 
      "RADIUS_SERVER_2_IP": "10.10.10.102",
      "RADIUS_SHARED_SECRET": "RadiusKey123!",
      "RADIUS_TIMEOUT": "2",
      "RADIUS_RETRANSMIT": "2",
      "RADIUS_GROUP_NAME": "SG-ADMIN-RAD-SERVERS",
      "RADIUS_DEADTIME": "15",
      "AUTH_METHOD_LIST": "ML-RAD-ADMIN-AUTHC",
      "AUTHZ_METHOD_LIST": "ML-RAD-ADMIN-AUTHZ",
      "EXEC_TIMEOUT": "30",
      "CONSOLE_TIMEOUT": "15",
      "VRF_NAME": "",
      "SOURCE_INTERFACE": "Vlan1",
      "RADIUS_PRIMARY": true,
      "HA_ENABLED": false
    }',
    '["WLC Device Administration", "High Availability", "Multi-Protocol Authentication", "NETCONF Support"]',
    '["RADIUS", "Local Fallback", "SSH", "Console", "HTTPS", "NETCONF"]',
    '["Cisco ISE", "RADIUS Server", "Network Time Protocol", "Certificate Management"]',
    '["Privilege Level 15 Assignment", "Multi-Protocol Support", "Fallback Authentication", "Session Accounting", "Server Health Monitoring"]',
    '["Configure ISE Device Administration Policy first", "Set privilege level to 15 for NETCONF compatibility", "Test fallback authentication", "Configure multiple RADIUS clients for HA", "Monitor RADIUS server health with automated testing"]',
    '[
      {"issue": "NETCONF authentication fails", "solution": "Ensure privilege level 15 is assigned in RADIUS response"},
      {"issue": "Web GUI authentication timeout", "solution": "Check HTTP services restart and RADIUS connectivity"},
      {"issue": "HA switchover authentication issues", "solution": "Verify all three IP addresses (WMI, Primary RMI, Secondary RMI) are configured as RADIUS clients"}
    ]',
    '["show privilege", "show aaa servers", "show radius statistics", "show aaa sessions", "test aaa group {{RADIUS_GROUP_NAME}} {{RADIUS_TEST_USER}} {{RADIUS_TEST_PASSWORD}} new-code"]',
    '["cisco", "wlc-9800", "radius", "device-administration", "netconf", "high-availability", "ise", "multi-protocol"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'
),

-- Cisco IBNS 2.0 Concurrent 802.1X and MAB with RadSec
(
    gen_random_uuid(),
    'Cisco IBNS 2.0 - Advanced Concurrent 802.1X/MAB with RadSec and Critical VLAN',
    'Complete Cisco IBNS 2.0 configuration with concurrent 802.1X and MAB authentication, RadSec support, critical VLAN handling, and comprehensive policy enforcement for IOS-XE switches',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Cisco Systems'),
    'Authentication',
    'Network Access Control',
    'IBNS-2.0-RadSec',
    'expert',
    '! Cisco IBNS 2.0 - Advanced Concurrent 802.1X/MAB Configuration with RadSec
! Supports Catalyst 9200/9300/9400 IOS-XE switches

! Convert to new-style AAA
authentication convert-to new-style
yes

! Logging configuration to filter 802.1x/MAB messages
logging discriminator NO-DOT1X facility drops AUTHMGR|MAB|DOT1X|EPM
logging buffered discriminator NO-DOT1X informational
logging host {{SYSLOG_SERVER}} discriminator NO-DOT1X

! Time configuration
clock timezone {{TIMEZONE}} {{TIMEZONE_OFFSET}}
clock summer-time {{DST_NAME}} recurring last Sun Mar 2:00 last Sun Oct 3:00
service timestamps debug datetime msec localtime show-timezone
service timestamps log datetime msec localtime show-timezone

! Domain and AAA configuration
ip domain name {{DOMAIN_NAME}}
aaa new-model
aaa session-id common

! Create RADIUS test user
username {{RADIUS_TEST_USER}} privilege 0 algorithm-type sha256 secret {{RADIUS_TEST_PASSWORD}}
username {{RADIUS_TEST_USER}} autocommand exit

! Certificate configuration for RadSec
crypto pki trustpoint {{TRUSTPOINT_NAME}}
 enrollment url http://{{CA_SERVER}}/certsrv/mscep/mscep.dll
 subject-name cn={{DEVICE_HOSTNAME}}.{{DOMAIN_NAME}}
 revocation-check crl none
 rsakeypair {{TRUSTPOINT_NAME}}

! Generate RSA key and enroll certificate
crypto key generate rsa general-keys label {{TRUSTPOINT_NAME}} modulus 2048
crypto pki enroll {{TRUSTPOINT_NAME}}

! RADIUS server configuration with RadSec
radius server {{RADIUS_SERVER_1_NAME}}
 address ipv4 {{RADIUS_SERVER_1_IP}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
 key radius/dtls
 dtls connectiontimeout 10
 dtls idletimeout 75
 dtls retries 15
 dtls ip radius source-interface {{SOURCE_INTERFACE}}
 dtls match-server-identity hostname {{RADIUS_SERVER_HOSTNAME_MATCH}}
 dtls port 2083
 dtls trustpoint client {{TRUSTPOINT_NAME}}
 dtls trustpoint server {{TRUSTPOINT_NAME}}

radius server {{RADIUS_SERVER_2_NAME}}
 address ipv4 {{RADIUS_SERVER_2_IP}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
 key radius/dtls
 dtls connectiontimeout 10
 dtls idletimeout 75
 dtls retries 15
 dtls ip radius source-interface {{SOURCE_INTERFACE}}
 dtls match-server-identity hostname {{RADIUS_SERVER_HOSTNAME_MATCH}}
 dtls port 2083
 dtls trustpoint client {{TRUSTPOINT_NAME}}
 dtls trustpoint server {{TRUSTPOINT_NAME}}

! AAA configuration
aaa authentication dot1x default group {{RADIUS_GROUP_NAME}}
aaa authorization network default group {{RADIUS_GROUP_NAME}}
aaa authorization auth-proxy default group {{RADIUS_GROUP_NAME}}
aaa accounting update newinfo periodic 1440
aaa accounting identity default start-stop group {{RADIUS_GROUP_NAME}}
aaa accounting network default start-stop group {{RADIUS_GROUP_NAME}}

! RADIUS group configuration
aaa group server radius {{RADIUS_GROUP_NAME}}
 server name {{RADIUS_SERVER_1_NAME}}
 server name {{RADIUS_SERVER_2_NAME}}
 deadtime {{RADIUS_DEADTIME}}

! Change of Authorization (CoA) configuration with RadSec
aaa server radius dynamic-author
 client {{RADIUS_SERVER_1_IP}} dtls client-tp {{TRUSTPOINT_NAME}} server-tp {{TRUSTPOINT_NAME}}
 client {{RADIUS_SERVER_2_IP}} dtls client-tp {{TRUSTPOINT_NAME}} server-tp {{TRUSTPOINT_NAME}}
 dtls ip radius source-interface {{SOURCE_INTERFACE}}
 dtls port 2083
 auth-type any

! RADIUS server attributes
radius-server vsa send authentication
radius-server vsa send accounting
radius-server attribute 6 on-for-login-auth
radius-server attribute 6 support-multiple
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server attribute 31 mac format ietf upper-case
radius-server attribute 31 send nas-port-detail mac-only
radius-server dead-criteria time 5 tries 3
radius-server load-balance method least-outstanding

! Source interface configuration
ip radius source-interface {{SOURCE_INTERFACE}}
snmp-server trap-source {{SOURCE_INTERFACE}}
snmp-server source-interface informs {{SOURCE_INTERFACE}}
ntp source {{SOURCE_INTERFACE}}
ntp server {{NTP_SERVER}}

! 802.1X global configuration
dot1x system-auth-control
dot1x critical eapol
authentication critical recovery delay 2000
no access-session mac-move deny
access-session acl default passthrough

! Error disable recovery
errdisable recovery cause all
errdisable recovery interval 30

! DHCP Snooping configuration
ip dhcp snooping
no ip dhcp snooping information option
ip dhcp snooping vlan {{DHCP_SNOOPING_VLANS}}
ip dhcp snooping database flash:dhcp-snooping-db.txt

! Device Tracking Policies
device-tracking tracking auto-source

device-tracking policy DISABLE-IP-TRACKING
 tracking disable
 trusted-port
 device-role switch

device-tracking policy IP-TRACKING
 limit address-count 4
 security-level glean
 no protocol ndp
 no protocol dhcp6
 tracking enable reachable-lifetime 30

! Device Classifier (local profiling)
device classifier

! Device Sensor Configuration
device-sensor filter-list dhcp list DS_DHCP_LIST
 option name host-name
 option name requested-address
 option name parameter-request-list
 option name class-identifier
 option name client-identifier

device-sensor filter-spec dhcp include list DS_DHCP_LIST

cdp run
device-sensor filter-list cdp list DS_CDP_LIST
 tlv name device-name
 tlv name address-type
 tlv name capabilities-type
 tlv name platform-type
 tlv name version-type

device-sensor filter-spec cdp include list DS_CDP_LIST

lldp run
device-sensor filter-list lldp list DS_LLDP_LIST
 tlv name system-name
 tlv name system-description
 tlv name system-capabilities

device-sensor filter-spec lldp include list DS_LLDP_LIST
device-sensor notify all-changes

access-session attributes filter-list list DS_SEND_LIST
 cdp
 lldp
 dhcp

access-session accounting attributes filter-spec include list DS_SEND_LIST
access-session authentication attributes filter-spec include list DS_SEND_LIST

! Service Templates for Critical Authentication
service-template CRITICAL_DATA_ACCESS
 vlan {{CRITICAL_DATA_VLAN}}
 access-group {{CRITICAL_ACL}}

service-template CRITICAL_VOICE_ACCESS
 voice vlan
 access-group {{CRITICAL_ACL}}

! Class Maps for IBNS 2.0 Policy
class-map type control subscriber match-all AAA_SVR_DOWN_AUTHD_HOST
 match result-type aaa-timeout
 match authorization-status authorized

class-map type control subscriber match-all AAA_SVR_DOWN_UNAUTHD_HOST
 match result-type aaa-timeout
 match authorization-status unauthorized

class-map type control subscriber match-all DOT1X
 match method dot1x

class-map type control subscriber match-all DOT1X_FAILED
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-all DOT1X_NO_RESP
 match method dot1x
 match result-type method dot1x agent-not-found

class-map type control subscriber match-all DOT1X_TIMEOUT
 match method dot1x
 match result-type method dot1x method-timeout
 match result-type method-timeout

class-map type control subscriber match-all MAB
 match method mab

class-map type control subscriber match-all MAB_FAILED
 match method mab
 match result-type method mab authoritative

class-map type control subscriber match-any IN_CRITICAL_AUTH
 match activated-service-template CRITICAL_DATA_ACCESS
 match activated-service-template CRITICAL_VOICE_ACCESS

class-map type control subscriber match-none NOT_IN_CRITICAL_AUTH
 match activated-service-template CRITICAL_DATA_ACCESS
 match activated-service-template CRITICAL_VOICE_ACCESS

class-map type control subscriber match-all AUTHC_SUCCESS-AUTHZ_FAIL
 match authorization-status unauthorized
 match result-type success

! Access Control Lists
ip access-list extended {{CRITICAL_ACL}}
 permit ip any any

! IBNS 2.0 Concurrent Policy Map
policy-map type control subscriber CONCURRENT_DOT1X_MAB_POLICY
 event session-started match-all
  10 class always do-all
   10 authenticate using dot1x priority 10
   20 authenticate using mab priority 20
 event authentication-failure match-first
  5 class DOT1X_FAILED do-until-failure
   10 terminate dot1x
   20 authenticate using mab priority 20
  10 class AAA_SVR_DOWN_UNAUTHD_HOST do-until-failure
   10 clear-authenticated-data-hosts-on-port
   20 activate service-template CRITICAL_DATA_ACCESS
   30 activate service-template CRITICAL_VOICE_ACCESS
   40 authorize
   50 pause reauthentication
  20 class AAA_SVR_DOWN_AUTHD_HOST do-until-failure
   10 pause reauthentication
   20 authorize
  30 class DOT1X_NO_RESP do-until-failure
   10 terminate dot1x
   20 authenticate using mab priority 20
  40 class DOT1X_TIMEOUT do-until-failure
   10 terminate dot1x
   20 authenticate using mab priority 20
  50 class always do-until-failure
   10 terminate dot1x
   20 terminate mab
   30 authentication-restart 60
 event agent-found match-all
  10 class always do-until-failure
   10 terminate mab
   20 authenticate using dot1x priority 10
 event aaa-available match-all
  10 class IN_CRITICAL_AUTH do-until-failure
   10 clear-session
  20 class NOT_IN_CRITICAL_AUTH do-until-failure
   10 resume reauthentication
 event inactivity-timeout match-all
  10 class always do-until-failure
   10 clear-session
 event authentication-success match-all
  10 class always do-until-failure
   10 activate service-template DEFAULT_LINKSEC_POLICY_SHOULD_SECURE
 event violation match-all
  10 class always do-until-failure
   10 restrict
 event authorization-failure match-all
  10 class AUTHC_SUCCESS-AUTHZ_FAIL do-until-failure
   10 authentication-restart 60

! Access Port Configuration Template
interface range {{ACCESS_PORT_RANGE}}
 description "802.1X/MAB Access Port"
 switchport mode access
 switchport access vlan {{DEFAULT_ACCESS_VLAN}}
 switchport voice vlan {{VOICE_VLAN}}
 switchport nonegotiate
 switchport port-security maximum 3
 switchport port-security
 ip dhcp snooping limit rate 10
 authentication event fail action next-method
 authentication event server dead action authorize vlan {{CRITICAL_DATA_VLAN}}
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication timer inactivity {{INACTIVITY_TIMEOUT}}
 authentication violation restrict
 mab
 dot1x pae authenticator
 dot1x timeout tx-period {{DOT1X_TX_PERIOD}}
 dot1x max-reauth-req {{DOT1X_MAX_REAUTH}}
 spanning-tree portfast
 spanning-tree bpduguard enable
 storm-control broadcast level {{STORM_CONTROL_LEVEL}}
 storm-control multicast level {{STORM_CONTROL_LEVEL}}
 storm-control action shutdown
 device-tracking attach-policy IP-TRACKING
 service-policy type control subscriber CONCURRENT_DOT1X_MAB_POLICY

! Trunk Port Configuration Template
interface range {{TRUNK_PORT_RANGE}}
 description "Trunk Port to Network Infrastructure"
 switchport mode trunk
 switchport trunk allowed vlan {{TRUNK_ALLOWED_VLANS}}
 switchport nonegotiate
 ip dhcp snooping trust
 no access-session monitor
 device-tracking attach-policy DISABLE-IP-TRACKING
 spanning-tree portfast trunk
 storm-control broadcast level {{STORM_CONTROL_LEVEL}}
 storm-control multicast level {{STORM_CONTROL_LEVEL}}',
    '{
      "DEVICE_HOSTNAME": "SW-ACCESS-01",
      "DOMAIN_NAME": "company.local",
      "TIMEZONE": "EST",
      "TIMEZONE_OFFSET": "-5",
      "DST_NAME": "EDT",
      "SYSLOG_SERVER": "10.10.10.50",
      "RADIUS_TEST_USER": "SW-RAD-TEST", 
      "RADIUS_TEST_PASSWORD": "TestP@ss123!",
      "TRUSTPOINT_NAME": "TP-AD-PKI-SCEP",
      "CA_SERVER": "ca.company.local",
      "RADIUS_SERVER_1_NAME": "RAD-ISE-PSN-1",
      "RADIUS_SERVER_1_IP": "10.10.10.101",
      "RADIUS_SERVER_2_NAME": "RAD-ISE-PSN-2",
      "RADIUS_SERVER_2_IP": "10.10.10.102", 
      "RADIUS_SERVER_HOSTNAME_MATCH": "*.company.local",
      "RADIUS_GROUP_NAME": "RAD-SERVERS",
      "RADIUS_DEADTIME": "15",
      "SOURCE_INTERFACE": "Vlan1",
      "NTP_SERVER": "10.10.10.1",
      "DHCP_SNOOPING_VLANS": "1-4094",
      "CRITICAL_DATA_VLAN": "999",
      "CRITICAL_ACL": "ACL-CRITICAL",
      "DEFAULT_ACCESS_VLAN": "10",
      "VOICE_VLAN": "20", 
      "ACCESS_PORT_RANGE": "GigabitEthernet1/0/1-48",
      "TRUNK_PORT_RANGE": "TenGigabitEthernet1/0/1-4",
      "TRUNK_ALLOWED_VLANS": "10,20,30,999",
      "INACTIVITY_TIMEOUT": "3600",
      "DOT1X_TX_PERIOD": "10",
      "DOT1X_MAX_REAUTH": "2",
      "STORM_CONTROL_LEVEL": "10.00"
    }',
    '["Concurrent Authentication", "RadSec Encryption", "Critical VLAN Fallback", "Device Profiling", "MACSec Support", "DHCP Snooping", "Storm Control"]',
    '["802.1X", "MAB", "RadSec", "Certificate-based Authentication", "Multi-Auth", "Critical Authentication"]',
    '["Cisco ISE", "Certificate Authority", "RADIUS over DTLS", "DHCP Snooping", "Device Sensor", "LLDP", "CDP"]',
    '["Concurrent 802.1X and MAB", "RadSec Encryption", "Critical VLAN Fallback", "Device Profiling", "Dynamic VLAN Assignment", "Storm Control", "Port Security", "BPDU Guard"]',
    '["Configure certificates before RadSec", "Test critical VLAN functionality", "Enable device profiling for better visibility", "Monitor RADIUS server health", "Use proper VLAN strategy", "Configure ISE policy sets properly"]',
    '[
      {"issue": "RadSec connection fails", "solution": "Verify certificate enrollment and hostname matching"},
      {"issue": "Concurrent authentication not working", "solution": "Check IBNS 2.0 policy map configuration and Cisco support stance"},
      {"issue": "Critical VLAN not activating", "solution": "Verify service templates and AAA server down detection"}
    ]',
    '["show access-session", "show authentication brief", "show radius statistics", "show crypto pki certificates", "show dot1x all", "show mab all", "show device-tracking database"]',
    '["cisco", "ibns-2.0", "radsec", "concurrent-auth", "critical-vlan", "device-profiling", "ise", "certificate-auth"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'
),

-- Palo Alto GlobalProtect with RADIUS VSAs
(
    gen_random_uuid(),
    'Palo Alto GlobalProtect - RADIUS Integration with VSAs',
    'Complete Palo Alto GlobalProtect configuration with RADIUS authentication and Vendor Specific Attributes for dynamic policy assignment and user group mapping',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Palo Alto Networks'),
    'VPN',
    'GlobalProtect',
    'GlobalProtect-RADIUS',
    'advanced',
    '# Palo Alto GlobalProtect RADIUS Configuration with VSAs
# Configure RADIUS authentication with dynamic policy assignment

# RADIUS Server Profile Configuration
configure
set shared server-profile radius {{RADIUS_PROFILE_NAME}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} protocol RADIUS
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_1_IP}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_1_IP}} ip-address {{RADIUS_SERVER_1_IP}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_1_IP}} port {{RADIUS_AUTH_PORT}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_1_IP}} secret "{{RADIUS_SHARED_SECRET}}"
set shared server-profile radius {{RADIUS_PROFILE_NAME}} timeout {{RADIUS_TIMEOUT}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} retries {{RADIUS_RETRIES}}

# Secondary RADIUS Server (if configured)
{{#if RADIUS_SERVER_2_IP}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_2_IP}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_2_IP}} ip-address {{RADIUS_SERVER_2_IP}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_2_IP}} port {{RADIUS_AUTH_PORT}}
set shared server-profile radius {{RADIUS_PROFILE_NAME}} server {{RADIUS_SERVER_2_IP}} secret "{{RADIUS_SHARED_SECRET}}"
{{/if}}

# Authentication Profile
set shared authentication-profile {{AUTH_PROFILE_NAME}}
set shared authentication-profile {{AUTH_PROFILE_NAME}} method radius
set shared authentication-profile {{AUTH_PROFILE_NAME}} radius-server-profile {{RADIUS_PROFILE_NAME}}

# User Group Mapping based on RADIUS VSAs
{{#each USER_GROUPS}}
set shared user-group "{{name}}" user dynamic
set shared user-group "{{name}}" user dynamic filter "{{radius_filter}}"
{{/each}}

# GlobalProtect Portal Configuration
set network global-protect global-protect-portal {{PORTAL_NAME}}
set network global-protect global-protect-portal {{PORTAL_NAME}} interface {{PORTAL_INTERFACE}}
set network global-protect global-protect-portal {{PORTAL_NAME}} ip-address {{PORTAL_IP}}
set network global-protect global-protect-portal {{PORTAL_NAME}} port {{PORTAL_PORT}}
set network global-protect global-protect-portal {{PORTAL_NAME}} certificate-profile {{CERTIFICATE_PROFILE}}

# Portal Authentication Configuration
set network global-protect global-protect-portal {{PORTAL_NAME}} authentication-profile {{AUTH_PROFILE_NAME}}

# Client Configuration with VSA-based Policy Assignment
{{#each CLIENT_CONFIGS}}
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}"
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}" os "{{os_type}}"
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}" hip-collection yes
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}" log-settings {{../LOG_SETTINGS}}

# VSA-based Gateway Assignment
{{#if vsa_gateway_assignment}}
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}" gateways external list "{{gateway_name}}"
set network global-protect global-protect-portal {{../PORTAL_NAME}} client-config "{{name}}" gateways external list "{{gateway_name}}" priority {{gateway_priority}}
{{/if}}
{{/each}}

# GlobalProtect Gateway Configuration
set network global-protect global-protect-gateway {{GATEWAY_NAME}}
set network global-protect global-protect-gateway {{GATEWAY_NAME}} interface {{GATEWAY_INTERFACE}}
set network global-protect global-protect-gateway {{GATEWAY_NAME}} ip-address {{GATEWAY_IP}}
set network global-protect global-protect-gateway {{GATEWAY_NAME}} port {{GATEWAY_PORT}}
set network global-protect global-protect-gateway {{GATEWAY_NAME}} certificate-profile {{CERTIFICATE_PROFILE}}

# Gateway Authentication
set network global-protect global-protect-gateway {{GATEWAY_NAME}} authentication-profile {{AUTH_PROFILE_NAME}}

# Tunnel Configuration with RADIUS VSA Support
set network global-protect global-protect-gateway {{GATEWAY_NAME}} tunnel-mode yes
set network global-protect global-protect-gateway {{GATEWAY_NAME}} ipv6 no
set network global-protect global-protect-gateway {{GATEWAY_NAME}} client-authentication certificate yes
set network global-protect global-protect-gateway {{GATEWAY_NAME}} client-authentication allow-authentication-with-user-credentials yes

# User Authentication and VSA Processing
{{#each TUNNEL_CONFIGS}}
set network global-protect global-protect-gateway {{../GATEWAY_NAME}} tunnel "{{name}}"
set network global-protect global-protect-gateway {{../GATEWAY_NAME}} tunnel "{{name}}" local-address interface {{local_interface}}
set network global-protect global-protect-gateway {{../GATEWAY_NAME}} tunnel "{{name}}" address-assignment mode {{address_mode}}

{{#if ip_pool}}
set network global-protect global-protect-gateway {{../GATEWAY_NAME}} tunnel "{{name}}" address-assignment pool "{{ip_pool}}"
{{/if}}

# Split Tunnel Configuration based on VSAs
{{#if split_tunnel_enabled}}
set network global-protect global-protect-gateway {{../GATEWAY_NAME}} tunnel "{{name}}" split-tunnel "{{split_tunnel_profile}}"
{{/if}}

# Access Route Configuration
{{#each access_routes}}
set network global-protect global-protect-gateway {{../../GATEWAY_NAME}} tunnel "{{../name}}" access-route "{{route_name}}"
set network global-protect global-protect-gateway {{../../GATEWAY_NAME}} tunnel "{{../name}}" access-route "{{route_name}}" destination "{{destination}}"
set network global-protect global-protect-gateway {{../../GATEWAY_NAME}} tunnel "{{../name}}" access-route "{{route_name}}" metric {{metric}}
{{/each}}
{{/each}}

# VSA Attribute Mapping Configuration
# Configure custom VSAs for dynamic policy assignment
{{#each VSA_MAPPINGS}}
set shared radius-attribute vendor-id {{vendor_id}} name "{{attribute_name}}" id {{attribute_id}} type {{attribute_type}}
{{/each}}

# Security Policy Rules for GlobalProtect Traffic
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}"
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" from {{GP_INTERNAL_ZONE}}
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" to {{GP_EXTERNAL_ZONE}}
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" source any
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" destination any
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" application any
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" service any
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" category any
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" action allow
set rulebase security rules "{{GP_ALLOW_RULE_NAME}}" log-setting {{LOG_SETTINGS}}

# NAT Policy for GlobalProtect Users
set rulebase nat rules "{{GP_NAT_RULE_NAME}}"
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" from {{GP_INTERNAL_ZONE}}
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" to {{GP_EXTERNAL_ZONE}}
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" source any
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" destination any
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" service any
set rulebase nat rules "{{GP_NAT_RULE_NAME}}" translated-packet source dynamic-ip-and-port interface-address interface {{OUTSIDE_INTERFACE}}

# Logging Configuration
set shared log-settings profiles {{LOG_SETTINGS}}
set shared log-settings profiles {{LOG_SETTINGS}} match-list default
set shared log-settings profiles {{LOG_SETTINGS}} match-list default log-type traffic
set shared log-settings profiles {{LOG_SETTINGS}} match-list default filter "All Logs"
set shared log-settings profiles {{LOG_SETTINGS}} match-list default send-to-panorama yes

{{#if SYSLOG_SERVER}}
set shared log-settings profiles {{LOG_SETTINGS}} match-list default send-syslog {{SYSLOG_PROFILE}}
set shared log-settings syslog {{SYSLOG_PROFILE}}
set shared log-settings syslog {{SYSLOG_PROFILE}} server {{SYSLOG_SERVER}}
set shared log-settings syslog {{SYSLOG_PROFILE}} server {{SYSLOG_SERVER}} server {{SYSLOG_SERVER}}
set shared log-settings syslog {{SYSLOG_PROFILE}} server {{SYSLOG_SERVER}} port {{SYSLOG_PORT}}
set shared log-settings syslog {{SYSLOG_PROFILE}} server {{SYSLOG_SERVER}} format BSD
set shared log-settings syslog {{SYSLOG_PROFILE}} server {{SYSLOG_SERVER}} facility {{SYSLOG_FACILITY}}
{{/if}}

# Commit configuration
commit
exit',
    '{
      "RADIUS_PROFILE_NAME": "ISE-RADIUS-Profile",
      "RADIUS_SERVER_1_IP": "10.10.10.101", 
      "RADIUS_SERVER_2_IP": "10.10.10.102",
      "RADIUS_AUTH_PORT": "1812",
      "RADIUS_SHARED_SECRET": "RadiusKey123!",
      "RADIUS_TIMEOUT": "5",
      "RADIUS_RETRIES": "3",
      "AUTH_PROFILE_NAME": "GlobalProtect-Auth-Profile",
      "PORTAL_NAME": "GlobalProtect-Portal",
      "PORTAL_INTERFACE": "ethernet1/1",
      "PORTAL_IP": "203.0.113.10",
      "PORTAL_PORT": "443",
      "CERTIFICATE_PROFILE": "GlobalProtect-Certificate-Profile",
      "GATEWAY_NAME": "GlobalProtect-Gateway",
      "GATEWAY_INTERFACE": "ethernet1/1", 
      "GATEWAY_IP": "203.0.113.10",
      "GATEWAY_PORT": "443",
      "GP_INTERNAL_ZONE": "GP-Internal",
      "GP_EXTERNAL_ZONE": "External",
      "GP_ALLOW_RULE_NAME": "GlobalProtect-Allow-All",
      "GP_NAT_RULE_NAME": "GlobalProtect-NAT",
      "OUTSIDE_INTERFACE": "ethernet1/1",
      "LOG_SETTINGS": "GlobalProtect-Logging",
      "SYSLOG_SERVER": "10.10.10.50",
      "SYSLOG_PROFILE": "GlobalProtect-Syslog",
      "SYSLOG_PORT": "514",
      "SYSLOG_FACILITY": "LOG_USER",
      "USER_GROUPS": [
        {
          "name": "VPN-Admin-Users",
          "radius_filter": "(radius-vsa:Cisco:Class == \"Admin\")"
        },
        {
          "name": "VPN-Standard-Users", 
          "radius_filter": "(radius-vsa:Cisco:Class == \"Standard\")"
        }
      ],
      "CLIENT_CONFIGS": [
        {
          "name": "Windows-Config",
          "os_type": "Win",
          "vsa_gateway_assignment": true,
          "gateway_name": "GlobalProtect-Gateway",
          "gateway_priority": "1"
        },
        {
          "name": "MacOS-Config",
          "os_type": "Mac", 
          "vsa_gateway_assignment": true,
          "gateway_name": "GlobalProtect-Gateway",
          "gateway_priority": "1"
        }
      ],
      "TUNNEL_CONFIGS": [
        {
          "name": "GP-Tunnel",
          "local_interface": "tunnel.1",
          "address_mode": "ip-pool",
          "ip_pool": "GP-User-Pool",
          "split_tunnel_enabled": true,
          "split_tunnel_profile": "GP-Split-Tunnel",
          "access_routes": [
            {
              "route_name": "Corporate-Network",
              "destination": "10.0.0.0/8",
              "metric": "10"
            }
          ]
        }
      ],
      "VSA_MAPPINGS": [
        {
          "vendor_id": "9",
          "attribute_name": "Cisco-Class",
          "attribute_id": "25",
          "attribute_type": "string"
        },
        {
          "vendor_id": "9",
          "attribute_name": "Cisco-Filter-Id", 
          "attribute_id": "11",
          "attribute_type": "string"
        }
      ]
    }',
    '["RADIUS Authentication", "VSA Policy Assignment", "Dynamic User Grouping", "Split Tunneling", "Certificate Authentication", "Multi-OS Support"]',
    '["RADIUS", "Certificate-based", "Two-Factor Authentication", "VSA Processing", "Dynamic Policy Assignment"]',
    '["RADIUS Server", "Certificate Authority", "DNS Resolution", "NTP Synchronization", "Syslog Server"]',
    '["VSA-based Policy Assignment", "Dynamic User Grouping", "Split Tunnel Configuration", "Certificate Validation", "Session Logging", "Multi-Gateway Support"]',
    '["Configure RADIUS VSAs in authentication server", "Test certificate enrollment process", "Verify split tunnel policies", "Monitor user authentication logs", "Configure proper DNS resolution", "Test failover scenarios"]',
    '[
      {"issue": "VSA attributes not processed", "solution": "Verify VSA mapping configuration and RADIUS server attribute sending"},
      {"issue": "Split tunnel not working", "solution": "Check access route configuration and client network settings"},
      {"issue": "Certificate authentication fails", "solution": "Verify certificate profile and CA trust chain"}
    ]',
    '["show global-protect-portal statistics", "show global-protect-gateway statistics", "show user authentication-log", "show log auth", "debug global-protect portal", "debug radius"]',
    '["palo-alto", "globalprotect", "radius", "vsa", "vpn", "certificate-auth", "split-tunnel", "dynamic-policy"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'
),

-- Enhanced Aruba CX with ClearPass and Dynamic Segmentation
(
    gen_random_uuid(),
    'Aruba CX - Complete Dynamic Segmentation with ClearPass Policy Enforcement',
    'Advanced Aruba CX configuration with ClearPass integration, dynamic segmentation, policy enforcement, and comprehensive security features including RadSec and role-based access control',
    (SELECT id FROM vendor_library WHERE vendor_name = 'Aruba Networks'),
    'Authentication',
    'Dynamic Segmentation',
    'AOS-CX-ClearPass',
    'expert',
    '! Aruba CX - Complete Dynamic Segmentation with ClearPass Integration
! Supports CX 6200/6300/6400/8320/8360 series switches

! System Configuration
hostname {{HOSTNAME}}
system timezone {{TIMEZONE}}

! NTP Configuration
ntp server {{NTP_SERVER_1}}
ntp server {{NTP_SERVER_2}}
ntp enable

! DNS Configuration
ip dns server-address {{DNS_SERVER_1}}
ip dns server-address {{DNS_SERVER_2}}
ip domain-name {{DOMAIN_NAME}}

! Certificate Configuration for RadSec
crypto pki ta-profile "{{CA_PROFILE_NAME}}"
crypto pki ta-profile "{{CA_PROFILE_NAME}}" certificate "{{CA_CERTIFICATE}}"

crypto pki certificate-profile "{{DEVICE_CERT_PROFILE}}"
crypto pki certificate-profile "{{DEVICE_CERT_PROFILE}}" certificate "{{DEVICE_CERTIFICATE}}"
crypto pki certificate-profile "{{DEVICE_CERT_PROFILE}}" private-key "{{DEVICE_PRIVATE_KEY}}"

! RADIUS Configuration with RadSec Support
radius-server host {{RADIUS_SERVER_1_IP}}
    key {{RADIUS_SHARED_SECRET}}
    radsec
    retransmit {{RADIUS_RETRANSMIT}}
    timeout {{RADIUS_TIMEOUT}}
    tracking enable
    deadtime {{RADIUS_DEADTIME}}
    
radius-server host {{RADIUS_SERVER_2_IP}}
    key {{RADIUS_SHARED_SECRET}}
    radsec
    retransmit {{RADIUS_RETRANSMIT}}
    timeout {{RADIUS_TIMEOUT}}
    tracking enable
    deadtime {{RADIUS_DEADTIME}}

! AAA Configuration
aaa group server radius "{{RADIUS_GROUP_NAME}}"
    server {{RADIUS_SERVER_1_IP}}
    server {{RADIUS_SERVER_2_IP}}
    
aaa authentication port-access dot1x-authenticator group {{RADIUS_GROUP_NAME}}
aaa authentication port-access mac-authenticator group {{RADIUS_GROUP_NAME}}
aaa accounting port-access start-stop group {{RADIUS_GROUP_NAME}}

! 802.1X Global Configuration
dot1x system-auth-control
dot1x max-reauth-req {{DOT1X_MAX_REAUTH}}
dot1x max-req {{DOT1X_MAX_REQ}}

! Device Profile Configuration for Dynamic Segmentation
device-profile name "default"
    associate device-type generic
    
device-profile name "corporate-windows"
    associate device-type generic
    untagged-vlan {{CORPORATE_VLAN}}
    tagged-vlan {{VOICE_VLAN}}
    
device-profile name "corporate-mac"
    associate device-type generic
    untagged-vlan {{CORPORATE_VLAN}}
    
device-profile name "guest-device"
    associate device-type generic
    untagged-vlan {{GUEST_VLAN}}
    
device-profile name "iot-device"
    associate device-type generic
    untagged-vlan {{IOT_VLAN}}
    
device-profile name "printer-device"
    associate device-type generic
    untagged-vlan {{PRINTER_VLAN}}

device-profile name "camera-device"
    associate device-type generic
    untagged-vlan {{CAMERA_VLAN}}

! User Role Configuration for ClearPass Integration
user-role "employee-role"
    access-list ip "{{EMPLOYEE_ACL}}" in
    access-list ip "{{EMPLOYEE_ACL}}" out
    vlan access {{CORPORATE_VLAN}}
    
user-role "contractor-role"
    access-list ip "{{CONTRACTOR_ACL}}" in
    access-list ip "{{CONTRACTOR_ACL}}" out
    vlan access {{CONTRACTOR_VLAN}}
    
user-role "guest-role"
    access-list ip "{{GUEST_ACL}}" in
    access-list ip "{{GUEST_ACL}}" out
    vlan access {{GUEST_VLAN}}
    captive-portal-profile "{{GUEST_PORTAL_PROFILE}}"

user-role "iot-role"
    access-list ip "{{IOT_ACL}}" in
    access-list ip "{{IOT_ACL}}" out
    vlan access {{IOT_VLAN}}

! VLAN Configuration
vlan {{CORPORATE_VLAN}}
    name "Corporate"
    
vlan {{CONTRACTOR_VLAN}}
    name "Contractor"
    
vlan {{GUEST_VLAN}}
    name "Guest"
    
vlan {{IOT_VLAN}}
    name "IoT-Devices"
    
vlan {{PRINTER_VLAN}}
    name "Printers"
    
vlan {{CAMERA_VLAN}}
    name "IP-Cameras"
    
vlan {{VOICE_VLAN}}
    name "Voice"
    
vlan {{MGMT_VLAN}}
    name "Management"

! Interface VLAN Configuration
interface vlan {{MGMT_VLAN}}
    ip address {{MGMT_IP}}/{{MGMT_PREFIX}}
    no shutdown

! Access Control Lists for Role-based Access
access-list ip "{{EMPLOYEE_ACL}}"
    {{#each EMPLOYEE_ACL_RULES}}
    {{rule_number}} {{action}} {{protocol}} {{source}} {{destination}} {{port}}
    {{/each}}

access-list ip "{{CONTRACTOR_ACL}}"
    {{#each CONTRACTOR_ACL_RULES}}
    {{rule_number}} {{action}} {{protocol}} {{source}} {{destination}} {{port}}
    {{/each}}

access-list ip "{{GUEST_ACL}}"
    {{#each GUEST_ACL_RULES}}
    {{rule_number}} {{action}} {{protocol}} {{source}} {{destination}} {{port}}
    {{/each}}

access-list ip "{{IOT_ACL}}"
    {{#each IOT_ACL_RULES}}
    {{rule_number}} {{action}} {{protocol}} {{source}} {{destination}} {{port}}
    {{/each}}

! Port-access Role Configuration
port-access role "corporate-access"
    associate device-profile "corporate-windows" aaa-attribute "Filter-Id" value "Corporate-Windows"
    associate device-profile "corporate-mac" aaa-attribute "Filter-Id" value "Corporate-Mac"
    associate user-role "employee-role" aaa-attribute "User-Role" value "Employee"
    associate user-role "contractor-role" aaa-attribute "User-Role" value "Contractor"
    auth-method dot1x-authenticator
    auth-method mac-authenticator
    auth-precedence dot1x-authenticator mac-authenticator
    
port-access role "iot-access"
    associate device-profile "iot-device" aaa-attribute "Filter-Id" value "IoT-Device"
    associate device-profile "printer-device" aaa-attribute "Filter-Id" value "Printer"
    associate device-profile "camera-device" aaa-attribute "Filter-Id" value "Camera"
    associate user-role "iot-role" aaa-attribute "User-Role" value "IoT"
    auth-method mac-authenticator
    auth-precedence mac-authenticator

port-access role "guest-access"
    associate device-profile "guest-device" aaa-attribute "Filter-Id" value "Guest"
    associate user-role "guest-role" aaa-attribute "User-Role" value "Guest"
    auth-method mac-authenticator
    auth-precedence mac-authenticator
    captive-portal-profile "{{GUEST_PORTAL_PROFILE}}"

! Captive Portal Configuration
captive-portal-profile "{{GUEST_PORTAL_PROFILE}}"
    redirect-url "https://{{CAPTIVE_PORTAL_URL}}/guest"
    certificate-profile "{{PORTAL_CERT_PROFILE}}"

! Access Interface Configuration
interface {{ACCESS_INTERFACE_RANGE}}
    description "802.1X/MAB Access Port with Dynamic Segmentation"
    no shutdown
    no routing
    vlan access {{DEFAULT_VLAN}}
    vlan trunk native {{DEFAULT_VLAN}} tag
    vlan trunk allowed {{VOICE_VLAN}}
    port-access role "corporate-access"
    port-access auth-method dot1x-authenticator
    port-access auth-method mac-authenticator
    port-access auth-mode client-mode
    port-access re-authentication enable
    port-access re-authentication period {{REAUTH_PERIOD}}
    port-access auth-precedence dot1x-authenticator mac-authenticator
    lldp transmit
    lldp receive
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard
    storm-control broadcast level {{STORM_CONTROL_LEVEL}}
    storm-control multicast level {{STORM_CONTROL_LEVEL}}
    storm-control unknown-unicast level {{STORM_CONTROL_LEVEL}}

! IoT Interface Configuration
interface {{IOT_INTERFACE_RANGE}}
    description "IoT Device Access Port"
    no shutdown
    no routing
    vlan access {{IOT_VLAN}}
    port-access role "iot-access"
    port-access auth-method mac-authenticator
    port-access auth-mode single-mode
    port-access re-authentication enable
    port-access re-authentication period {{REAUTH_PERIOD}}
    lldp transmit
    lldp receive
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard

! Guest Interface Configuration  
interface {{GUEST_INTERFACE_RANGE}}
    description "Guest Access Port with Captive Portal"
    no shutdown
    no routing
    vlan access {{GUEST_VLAN}}
    port-access role "guest-access"
    port-access auth-method mac-authenticator
    port-access auth-mode single-mode
    lldp transmit
    lldp receive
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard

! Uplink Configuration
interface {{UPLINK_INTERFACE}}
    description "Uplink to Core/Distribution"
    no shutdown
    no routing
    vlan trunk native {{MGMT_VLAN}}
    vlan trunk allowed {{TRUNK_ALLOWED_VLANS}}
    lacp mode active
    lag {{LAG_ID}}
    spanning-tree port-type network

! CoA Configuration for Dynamic Policy Updates
radius dynamic-authorization
    server-key {{RADIUS_SHARED_SECRET}}
    client {{RADIUS_SERVER_1_IP}}
    client {{RADIUS_SERVER_2_IP}}
    port 3799

! DHCP Snooping for Additional Security
dhcp snooping
dhcp snooping vlan {{DHCP_SNOOPING_VLANS}}

interface {{ACCESS_INTERFACE_RANGE}}
    dhcp snooping trust

interface {{UPLINK_INTERFACE}}
    dhcp snooping trust

! Dynamic ARP Inspection
arp inspection vlan {{ARP_INSPECTION_VLANS}}

interface {{ACCESS_INTERFACE_RANGE}}
    arp inspection trust

interface {{UPLINK_INTERFACE}}
    arp inspection trust

! Device Fingerprinting and Profiling
device-fingerprinting enable

! Enhanced Logging for ClearPass Integration
logging {{SYSLOG_SERVER}}
logging facility {{SYSLOG_FACILITY}}
logging filter class port-access level info
logging filter class clearpass level info
logging filter class aaa level info

! SNMP Configuration for ClearPass Monitoring
snmp-server system-name {{HOSTNAME}}
snmp-server system-contact "{{CONTACT_INFO}}"
snmp-server system-location "{{LOCATION}}"
snmp-server community {{SNMP_COMMUNITY_RO}} ro
snmp-server community {{SNMP_COMMUNITY_RW}} rw
snmp-server host {{CLEARPASS_IP}} community {{SNMP_COMMUNITY_RO}} version 2c

! MAC Authentication Bypass Settings
mac-authentication username-format no-delimiter lower-case

! LLDP Global Configuration
lldp run
lldp reinit {{LLDP_REINIT_DELAY}}
lldp timer {{LLDP_TIMER}}

! Port Security for Additional Protection
{{#if PORT_SECURITY_ENABLED}}
interface {{ACCESS_INTERFACE_RANGE}}
    port-security
    port-security maximum {{PORT_SECURITY_MAX}}
    port-security violation {{PORT_SECURITY_VIOLATION}}
{{/if}}

! Quality of Service for Voice VLAN
qos cos-map default
qos dscp-map default

interface {{ACCESS_INTERFACE_RANGE}}
    qos trust cos
    qos apply policy "{{VOICE_QOS_POLICY}}" in

! Save Configuration
write memory',
    '{
      "HOSTNAME": "SW-CX-ACCESS-01",
      "TIMEZONE": "America/New_York",
      "NTP_SERVER_1": "10.10.10.1",
      "NTP_SERVER_2": "10.10.10.2",
      "DNS_SERVER_1": "10.10.10.1",
      "DNS_SERVER_2": "10.10.10.2",
      "DOMAIN_NAME": "company.local",
      "CA_PROFILE_NAME": "ClearPass-CA",
      "CA_CERTIFICATE": "-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----",
      "DEVICE_CERT_PROFILE": "Device-Certificate",
      "DEVICE_CERTIFICATE": "-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----",
      "DEVICE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----",
      "RADIUS_SERVER_1_IP": "10.10.10.101",
      "RADIUS_SERVER_2_IP": "10.10.10.102",
      "RADIUS_SHARED_SECRET": "ClearPassKey123!",
      "RADIUS_RETRANSMIT": "3",
      "RADIUS_TIMEOUT": "5",
      "RADIUS_DEADTIME": "15",
      "RADIUS_GROUP_NAME": "ClearPass-Servers",
      "DOT1X_MAX_REAUTH": "3",
      "DOT1X_MAX_REQ": "3",
      "CORPORATE_VLAN": "10",
      "CONTRACTOR_VLAN": "15",
      "GUEST_VLAN": "30",
      "IOT_VLAN": "40",
      "PRINTER_VLAN": "50",
      "CAMERA_VLAN": "60",
      "VOICE_VLAN": "20",
      "MGMT_VLAN": "100",
      "DEFAULT_VLAN": "1",
      "MGMT_IP": "10.10.100.10",
      "MGMT_PREFIX": "24",
      "EMPLOYEE_ACL": "ACL-Employee",
      "CONTRACTOR_ACL": "ACL-Contractor",
      "GUEST_ACL": "ACL-Guest",
      "IOT_ACL": "ACL-IoT",
      "ACCESS_INTERFACE_RANGE": "1/1/1-1/1/48",
      "IOT_INTERFACE_RANGE": "1/1/49-1/1/52",
      "GUEST_INTERFACE_RANGE": "1/1/53-1/1/56",
      "UPLINK_INTERFACE": "1/1/57",
      "TRUNK_ALLOWED_VLANS": "10,15,20,30,40,50,60,100",
      "LAG_ID": "1",
      "REAUTH_PERIOD": "3600",
      "STORM_CONTROL_LEVEL": "10",
      "GUEST_PORTAL_PROFILE": "Guest-Portal",
      "CAPTIVE_PORTAL_URL": "clearpass.company.local",
      "PORTAL_CERT_PROFILE": "Portal-Certificate",
      "DHCP_SNOOPING_VLANS": "10,15,20,30,40,50,60",
      "ARP_INSPECTION_VLANS": "10,15,20,30,40,50,60",
      "SYSLOG_SERVER": "10.10.10.50",
      "SYSLOG_FACILITY": "local7",
      "CONTACT_INFO": "Network Operations",
      "LOCATION": "Building A Floor 1",
      "SNMP_COMMUNITY_RO": "public123",
      "SNMP_COMMUNITY_RW": "private123",
      "CLEARPASS_IP": "10.10.10.101",
      "LLDP_REINIT_DELAY": "2",
      "LLDP_TIMER": "30",
      "PORT_SECURITY_ENABLED": true,
      "PORT_SECURITY_MAX": "3",
      "PORT_SECURITY_VIOLATION": "restrict",
      "VOICE_QOS_POLICY": "Voice-QoS",
      "EMPLOYEE_ACL_RULES": [
        {"rule_number": "10", "action": "permit", "protocol": "ip", "source": "any", "destination": "any", "port": ""}
      ],
      "CONTRACTOR_ACL_RULES": [
        {"rule_number": "10", "action": "permit", "protocol": "tcp", "source": "any", "destination": "any", "port": "eq 80"},
        {"rule_number": "20", "action": "permit", "protocol": "tcp", "source": "any", "destination": "any", "port": "eq 443"},
        {"rule_number": "30", "action": "deny", "protocol": "ip", "source": "any", "destination": "10.0.0.0/8", "port": ""}
      ],
      "GUEST_ACL_RULES": [
        {"rule_number": "10", "action": "permit", "protocol": "tcp", "source": "any", "destination": "any", "port": "eq 80"},
        {"rule_number": "20", "action": "permit", "protocol": "tcp", "source": "any", "destination": "any", "port": "eq 443"},
        {"rule_number": "30", "action": "deny", "protocol": "ip", "source": "any", "destination": "any", "port": ""}
      ],
      "IOT_ACL_RULES": [
        {"rule_number": "10", "action": "permit", "protocol": "tcp", "source": "any", "destination": "10.10.10.200", "port": "eq 443"},
        {"rule_number": "20", "action": "deny", "protocol": "ip", "source": "any", "destination": "any", "port": ""}
      ]
    }',
    '["Dynamic Segmentation", "ClearPass Integration", "RadSec Encryption", "Role-based Access Control", "Device Profiling", "Captive Portal", "Multi-Auth Support"]',
    '["802.1X", "MAC Authentication", "RadSec", "Certificate-based", "Captive Portal", "Dynamic VLAN Assignment", "User Role Mapping"]',
    '["Aruba ClearPass", "Certificate Authority", "RADIUS over TLS", "DHCP Snooping", "Device Fingerprinting", "LLDP", "SNMP"]',
    '["Dynamic VLAN Assignment", "Role-based Access Control", "RadSec Encryption", "Device Profiling", "Policy Enforcement", "Captive Portal Integration", "Multi-method Authentication"]',
    '["Configure ClearPass policies before switch deployment", "Test RadSec certificate enrollment", "Verify device profiling accuracy", "Configure proper ACLs for each role", "Test captive portal functionality", "Monitor policy enforcement logs"]',
    '[
      {"issue": "Dynamic segmentation not working", "solution": "Verify ClearPass policy configuration and VSA attributes"},
      {"issue": "RadSec authentication fails", "solution": "Check certificate configuration and trust chain"},
      {"issue": "Device profiling inaccurate", "solution": "Enable device fingerprinting and verify LLDP/CDP data collection"}
    ]',
    '["show port-access clients", "show aaa authentication port-access", "show device-profile", "show user-role", "show radius statistics", "show captive-portal statistics"]',
    '["aruba", "aos-cx", "clearpass", "dynamic-segmentation", "radsec", "device-profiling", "captive-portal", "role-based-access"]',
    true,
    true,
    '00000000-0000-0000-0000-000000000000'
);