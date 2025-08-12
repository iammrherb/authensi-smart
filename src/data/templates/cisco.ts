import { BaseTemplate, TEMPLATE_CATEGORIES, VALIDATION_PATTERNS, VARIABLE_GROUPS } from './common';

export const ciscoTemplates: BaseTemplate[] = [
  {
    id: 'cisco-catalyst-9000-ibns2-complete',
    name: 'Cisco Catalyst 9000 IBNS 2.0 Complete Solution',
    description: 'Complete Identity-Based Network Services 2.0 implementation with 802.1X, MAB, and advanced security features',
    category: TEMPLATE_CATEGORIES.AUTHENTICATION,
    subcategory: 'IBNS 2.0 Implementation',
    vendor: 'Cisco',
    model: 'Catalyst 9000 Series',
    firmware: 'IOS-XE 16.12+',
    complexity_level: 'expert',
    estimated_time: '2-3 hours',
    prerequisites: [
      'RADIUS server (ISE/NPS) configured and accessible',
      'Certificate infrastructure for EAP-TLS',
      'VLAN design and IP addressing plan',
      'Network management system configured',
      'Understanding of IBNS 2.0 concepts'
    ],
    post_deployment_tasks: [
      'Test all authentication methods',
      'Verify dynamic VLAN assignment',
      'Validate CoA functionality',
      'Monitor authentication success rates',
      'Document user authentication flows'
    ],
    content: `! Cisco Catalyst 9000 IBNS 2.0 Complete Configuration
! ====================================================

! Global Configuration
hostname {{SWITCH_HOSTNAME}}
!
! Enable new AAA model
aaa new-model
!
! Configure domain name for SSH
ip domain-name {{DOMAIN_NAME}}
!
! Generate RSA keys for SSH
crypto key generate rsa general-keys modulus {{SSH_KEY_SIZE}}
!
! Configure SSH settings
ip ssh version 2
ip ssh time-out {{SSH_TIMEOUT}}
ip ssh authentication-retries {{SSH_RETRIES}}
!
! Configure NTP for accurate timestamping
ntp server {{NTP_PRIMARY}} prefer
ntp server {{NTP_SECONDARY}}
ntp source {{NTP_SOURCE_INTERFACE}}
!
! Configure DNS
ip name-server {{DNS_PRIMARY}} {{DNS_SECONDARY}}
!
! Disable unused services for security
no ip http server
no ip http secure-server
no service tcp-small-servers
no service udp-small-servers
no service finger
no service config
no cdp run
!
! Enable services needed for operation
service timestamps debug datetime msec localtime show-timezone
service timestamps log datetime msec localtime show-timezone
service password-encryption
service sequence-numbers
!
! Configure logging
logging buffered {{LOG_BUFFER_SIZE}}
logging console warnings
logging monitor informational
logging trap informational
logging source-interface {{LOG_SOURCE_INTERFACE}}
logging host {{SYSLOG_SERVER}}
!
! Configure SNMP
snmp-server community {{SNMP_RO_COMMUNITY}} RO
snmp-server community {{SNMP_RW_COMMUNITY}} RW
snmp-server contact {{SNMP_CONTACT}}
snmp-server location {{SNMP_LOCATION}}
snmp-server host {{SNMP_SERVER}} community {{SNMP_RO_COMMUNITY}}
!
! Configure multiple RADIUS servers with load balancing
radius server {{RADIUS_PRIMARY_NAME}}
 address ipv4 {{RADIUS_PRIMARY_IP}} auth-port {{RADIUS_AUTH_PORT}} acct-port {{RADIUS_ACCT_PORT}}
 timeout {{RADIUS_TIMEOUT}}
 retransmit {{RADIUS_RETRANSMIT}}
 key {{RADIUS_PRIMARY_SECRET}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
!
radius server {{RADIUS_SECONDARY_NAME}}
 address ipv4 {{RADIUS_SECONDARY_IP}} auth-port {{RADIUS_AUTH_PORT}} acct-port {{RADIUS_ACCT_PORT}}
 timeout {{RADIUS_TIMEOUT}}
 retransmit {{RADIUS_RETRANSMIT}}
 key {{RADIUS_SECONDARY_SECRET}}
 automate-tester username {{RADIUS_TEST_USER}} probe-on
!
! Configure RADIUS server groups
aaa group server radius {{RADIUS_GROUP_NAME}}
 server name {{RADIUS_PRIMARY_NAME}}
 server name {{RADIUS_SECONDARY_NAME}}
 ip radius source-interface {{RADIUS_SOURCE_INTERFACE}}
 load-balance method least-outstanding
!
! Configure AAA authentication methods
aaa authentication login default group {{RADIUS_GROUP_NAME}} local
aaa authentication enable default group {{RADIUS_GROUP_NAME}} enable
aaa authentication dot1x default group {{RADIUS_GROUP_NAME}}
!
! Configure AAA authorization  
aaa authorization network default group {{RADIUS_GROUP_NAME}}
aaa authorization exec default group {{RADIUS_GROUP_NAME}} local
aaa authorization commands 15 default group {{RADIUS_GROUP_NAME}} local
!
! Configure AAA accounting
aaa accounting dot1x default start-stop group {{RADIUS_GROUP_NAME}}
aaa accounting exec default start-stop group {{RADIUS_GROUP_NAME}}
aaa accounting commands 15 default start-stop group {{RADIUS_GROUP_NAME}}
aaa accounting update newinfo periodic {{ACCOUNTING_UPDATE_INTERVAL}}
!
! Configure device tracking policy
device-tracking tracking
device-tracking policy {{DEVICE_TRACKING_POLICY}}
 no protocol ndp
 no protocol dhcp4
 no protocol dhcp6
 tracking enable
!
! Enable 802.1X globally
dot1x system-auth-control
dot1x critical eapol
!
! Configure access session settings
access-session mac-move deny
access-session attributes filter-list list {{FILTER_ACL_NAME}}
!
! Configure class maps for different authentication results
class-map type control subscriber match-any DOT1X_FAILED
 match method dot1x
 match result-type method dot1x authoritative
!
class-map type control subscriber match-any DOT1X_MEDIUM_PRIORITY
 match method dot1x
 match result-type method dot1x agent-found
!
class-map type control subscriber match-any DOT1X_LOW_PRIORITY
 match method dot1x
 match result-type method dot1x timeout
!
class-map type control subscriber match-any MAB_FAILED
 match method mab
 match result-type method mab authoritative
!
class-map type control subscriber match-any IN_CRITICAL_AUTH
 match activated-service-template {{CRITICAL_AUTH_TEMPLATE}}
!
class-map type control subscriber match-any NOT_IN_CRITICAL_AUTH
 match not activated-service-template {{CRITICAL_AUTH_TEMPLATE}}
!
! Configure policy map for comprehensive authentication flow
policy-map type control subscriber {{POLICY_MAP_NAME}}
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x retries {{DOT1X_RETRIES}} retry-time {{DOT1X_RETRY_TIME}} priority 10
!
 event authentication-failure match-first
  5 class DOT1X_FAILED do-until-failure
   10 authenticate using mab priority 20
  10 class MAB_FAILED do-until-failure
   10 authorize
   20 activate service-template {{RESTRICTED_TEMPLATE}}
   30 pause reauthentication
  20 class always do-until-failure
   10 authorize
   20 pause reauthentication
!
 event authentication-success match-all
  10 class always do-until-failure
   10 authorize
!
 event agent-found match-all
  10 class always do-until-failure
   10 terminate mab
   20 authenticate using dot1x retries {{DOT1X_RETRIES}} retry-time {{DOT1X_RETRY_TIME}} priority 10
!
 event inactivity-timeout match-all
  10 class always do-until-failure
   10 clear-session
!
 event authentication-timeout match-all
  10 class always do-until-failure
   10 authenticate using mab priority 20
!
 event aaa-available match-all
  10 class IN_CRITICAL_AUTH do-until-failure
   10 clear-session
  20 class NOT_IN_CRITICAL_AUTH do-until-failure
   10 resume reauthentication
!
 event violation match-all
  10 class always do-until-failure
   10 restrict
!
! Configure service templates for different access levels
service-template {{GUEST_TEMPLATE}}
 vlan {{GUEST_VLAN}}
 description "Guest Network Access"
!
service-template {{RESTRICTED_TEMPLATE}}
 vlan {{RESTRICTED_VLAN}}
 description "Restricted Network Access"
!
service-template {{CRITICAL_AUTH_TEMPLATE}}
 vlan {{CRITICAL_VLAN}}
 description "Critical Authentication VLAN"
!
service-template {{VOICE_TEMPLATE}}
 vlan {{VOICE_VLAN}}
 voice vlan
 description "Voice Network Access"
!
! Configure VLANs
vlan {{CORPORATE_VLAN}}
 name Corporate-Network
!
vlan {{GUEST_VLAN}}
 name Guest-Network
!
vlan {{RESTRICTED_VLAN}}
 name Restricted-Network
!
vlan {{VOICE_VLAN}}
 name Voice-Network
!
vlan {{CRITICAL_VLAN}}
 name Critical-Auth-Network
!
vlan {{IOT_VLAN}}
 name IoT-Network
!
vlan {{QUARANTINE_VLAN}}
 name Quarantine-Network
!
! Configure SVI interfaces for management
interface Vlan{{MGMT_VLAN}}
 description Management VLAN
 ip address {{MGMT_IP}} {{MGMT_SUBNET_MASK}}
 no shutdown
!
! Configure default gateway
ip default-gateway {{DEFAULT_GATEWAY}}
!
! Configure access port template
interface range {{ACCESS_PORT_RANGE}}
 description {{ACCESS_PORT_DESCRIPTION}}
 switchport mode access
 switchport access vlan {{CORPORATE_VLAN}}
 switchport voice vlan {{VOICE_VLAN}}
 !
 ! Enable access session control
 access-session port-control auto
 access-session closed
 access-session host-mode {{HOST_MODE}}
 access-session control-direction {{CONTROL_DIRECTION}}
 !
 ! Apply device tracking
 device-tracking attach-policy {{DEVICE_TRACKING_POLICY}}
 !
 ! Configure 802.1X
 dot1x pae authenticator
 dot1x timeout tx-period {{TX_PERIOD}}
 dot1x max-req {{MAX_REQ}}
 !
 ! Enable MAB
 mab
 !
 ! Apply service policy
 service-policy type control subscriber {{POLICY_MAP_NAME}}
 !
 ! Configure spanning tree
 spanning-tree portfast
 spanning-tree bpduguard enable
 !
 ! Security features
 storm-control broadcast level {{STORM_CONTROL_LEVEL}}
 storm-control multicast level {{STORM_CONTROL_LEVEL}}
 storm-control action {{STORM_CONTROL_ACTION}}
 !
 no shutdown
!
! Configure uplink ports
interface range {{UPLINK_PORT_RANGE}}
 description {{UPLINK_DESCRIPTION}}
 switchport mode trunk
 switchport trunk allowed vlan {{TRUNK_ALLOWED_VLANS}}
 switchport trunk native vlan {{TRUNK_NATIVE_VLAN}}
 !
 ! Spanning tree configuration for uplinks
 spanning-tree link-type point-to-point
 spanning-tree guard root
 !
 ! Disable access session on uplinks
 no access-session port-control
 !
 no shutdown
!
! Configure DHCP snooping
ip dhcp snooping
ip dhcp snooping vlan {{DHCP_SNOOPING_VLANS}}
ip dhcp snooping database timeout {{DHCP_SNOOPING_TIMEOUT}}
no ip dhcp snooping information option
!
! Configure trusted interfaces for DHCP snooping
interface range {{UPLINK_PORT_RANGE}}
 ip dhcp snooping trust
!
! Configure Dynamic ARP Inspection
ip arp inspection vlan {{ARP_INSPECTION_VLANS}}
ip arp inspection validate src-mac dst-mac ip
!
! Configure trusted interfaces for ARP inspection
interface range {{UPLINK_PORT_RANGE}}
 ip arp inspection trust
!
! Configure IP Source Guard
ip source-guard
!
! Configure port security (optional, use with caution with 802.1X)
! interface range {{ACCESS_PORT_RANGE}}
!  switchport port-security
!  switchport port-security maximum {{PORT_SECURITY_MAX}}
!  switchport port-security aging time {{PORT_SECURITY_AGE}}
!  switchport port-security aging type inactivity
!  switchport port-security violation {{PORT_SECURITY_VIOLATION}}
!
! Configure VTY lines for remote access
line vty 0 15
 login authentication default
 authorization exec default
 authorization commands 15 default
 accounting exec default
 accounting commands 15 default
 transport input ssh
 exec-timeout {{VTY_TIMEOUT}}
 length 0
!
! Configure console line
line console 0
 login authentication default
 authorization exec default
 exec-timeout {{CONSOLE_TIMEOUT}}
 logging synchronous
!
! Configure privilege levels
privilege exec level 15 configure terminal
privilege exec level 15 copy running-config startup-config
privilege exec level 15 show running-config
privilege exec level 10 show
privilege exec level 10 ping
privilege exec level 10 traceroute
privilege exec level 5 show version
!
! Configure local users for fallback
username {{LOCAL_ADMIN_USER}} privilege 15 secret {{LOCAL_ADMIN_PASSWORD}}
username {{LOCAL_OPERATOR_USER}} privilege 10 secret {{LOCAL_OPERATOR_PASSWORD}}
!
! Configure ACLs for security
ip access-list extended {{FILTER_ACL_NAME}}
 permit ip any any
!
ip access-list extended GUEST_ACCESS
 permit udp any any eq domain
 permit tcp any any eq domain
 permit udp any any eq bootpc
 permit udp any any eq bootps
 permit tcp any host {{WEB_REDIRECT_SERVER}} eq 80
 permit tcp any host {{WEB_REDIRECT_SERVER}} eq 443
 deny ip any any log
!
! Apply ACL to guest VLAN (optional)
! vlan access-map GUEST_MAP 10
!  match ip address GUEST_ACCESS
!  action forward
! vlan filter GUEST_MAP vlan-list {{GUEST_VLAN}}
!
! Configure QoS for voice traffic
mls qos
!
class-map match-all VOICE_TRAFFIC
 match ip dscp ef
!
policy-map VOICE_POLICY
 class VOICE_TRAFFIC
  set dscp ef
  priority percent 33
 class class-default
  bandwidth remaining percent 100
!
interface range {{ACCESS_PORT_RANGE}}
 service-policy input VOICE_POLICY
 mls qos trust dscp
!
! Configure EtherChannel for uplinks (if applicable)
! interface range {{ETHERCHANNEL_INTERFACES}}
!  channel-protocol lacp
!  channel-group {{ETHERCHANNEL_NUMBER}} mode active
!
! interface Port-channel{{ETHERCHANNEL_NUMBER}}
!  description {{ETHERCHANNEL_DESCRIPTION}}
!  switchport mode trunk
!  switchport trunk allowed vlan {{TRUNK_ALLOWED_VLANS}}
!  spanning-tree link-type point-to-point
!  spanning-tree guard root
!
! Configure ERRDISABLE recovery
errdisable recovery cause psecure-violation
errdisable recovery cause security-violation
errdisable recovery cause storm-control
errdisable recovery interval {{ERRDISABLE_RECOVERY_INTERVAL}}
!
! Banner configuration
banner motd ^
{{BANNER_MESSAGE}}
^
!
! Save configuration
end
copy running-config startup-config`,
    variables: [
      // Basic Configuration
      {
        name: 'SWITCH_HOSTNAME',
        type: 'text',
        description: 'Switch hostname',
        required: true,
        defaultValue: 'CAT9K-ACCESS-01',
        group: VARIABLE_GROUPS.BASIC,
        validation: {
          pattern: VALIDATION_PATTERNS.HOSTNAME,
          errorMessage: 'Invalid hostname format'
        }
      },
      {
        name: 'DOMAIN_NAME',
        type: 'text',
        description: 'Domain name for SSH certificate',
        required: true,
        defaultValue: 'company.local',
        group: VARIABLE_GROUPS.BASIC
      },
      {
        name: 'SSH_KEY_SIZE',
        type: 'select',
        description: 'SSH RSA key size',
        required: true,
        defaultValue: '2048',
        options: ['1024', '2048', '4096'],
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'SSH_TIMEOUT',
        type: 'number',
        description: 'SSH timeout in seconds',
        required: true,
        defaultValue: 120,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 60, max: 600 }
      },
      {
        name: 'SSH_RETRIES',
        type: 'number',
        description: 'SSH authentication retries',
        required: true,
        defaultValue: 3,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 1, max: 10 }
      },
      
      // Network Configuration
      {
        name: 'MGMT_VLAN',
        type: 'number',
        description: 'Management VLAN ID',
        required: true,
        defaultValue: 1,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'MGMT_IP',
        type: 'ip',
        description: 'Management IP address',
        required: true,
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          pattern: VALIDATION_PATTERNS.IPV4,
          errorMessage: 'Invalid IP address'
        }
      },
      {
        name: 'MGMT_SUBNET_MASK',
        type: 'ip',
        description: 'Management subnet mask',
        required: true,
        defaultValue: '255.255.255.0',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'DEFAULT_GATEWAY',
        type: 'ip',
        description: 'Default gateway IP',
        required: true,
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'DNS_PRIMARY',
        type: 'ip',
        description: 'Primary DNS server',
        required: true,
        defaultValue: '8.8.8.8',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'DNS_SECONDARY',
        type: 'ip',
        description: 'Secondary DNS server',
        required: true,
        defaultValue: '8.8.4.4',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'NTP_PRIMARY',
        type: 'ip',
        description: 'Primary NTP server',
        required: true,
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'NTP_SECONDARY',
        type: 'ip',
        description: 'Secondary NTP server',
        required: true,
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'NTP_SOURCE_INTERFACE',
        type: 'text',
        description: 'NTP source interface',
        required: true,
        defaultValue: 'Vlan1',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // RADIUS Configuration
      {
        name: 'RADIUS_PRIMARY_NAME',
        type: 'text',
        description: 'Primary RADIUS server name',
        required: true,
        defaultValue: 'ISE-Primary',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_PRIMARY_IP',
        type: 'ip',
        description: 'Primary RADIUS server IP',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_PRIMARY_SECRET',
        type: 'password',
        description: 'Primary RADIUS shared secret',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { minLength: 8 }
      },
      {
        name: 'RADIUS_SECONDARY_NAME',
        type: 'text',
        description: 'Secondary RADIUS server name',
        required: true,
        defaultValue: 'ISE-Secondary',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SECONDARY_IP',
        type: 'ip',
        description: 'Secondary RADIUS server IP',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SECONDARY_SECRET',
        type: 'password',
        description: 'Secondary RADIUS shared secret',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { minLength: 8 }
      },
      {
        name: 'RADIUS_AUTH_PORT',
        type: 'number',
        description: 'RADIUS authentication port',
        required: true,
        defaultValue: 1812,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'RADIUS_ACCT_PORT',
        type: 'number',
        description: 'RADIUS accounting port',
        required: true,
        defaultValue: 1813,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'RADIUS_TIMEOUT',
        type: 'number',
        description: 'RADIUS timeout in seconds',
        required: true,
        defaultValue: 5,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 30 }
      },
      {
        name: 'RADIUS_RETRANSMIT',
        type: 'number',
        description: 'RADIUS retransmit attempts',
        required: true,
        defaultValue: 3,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 10 }
      },
      {
        name: 'RADIUS_GROUP_NAME',
        type: 'text',
        description: 'RADIUS server group name',
        required: true,
        defaultValue: 'ISE-GROUP',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SOURCE_INTERFACE',
        type: 'text',
        description: 'RADIUS source interface',
        required: true,
        defaultValue: 'Vlan1',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_TEST_USER',
        type: 'text',
        description: 'RADIUS test username',
        required: true,
        defaultValue: 'radius-test',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      
      // VLAN Configuration
      {
        name: 'CORPORATE_VLAN',
        type: 'number',
        description: 'Corporate network VLAN',
        required: true,
        defaultValue: 100,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'GUEST_VLAN',
        type: 'number',
        description: 'Guest network VLAN',
        required: true,
        defaultValue: 200,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'RESTRICTED_VLAN',
        type: 'number',
        description: 'Restricted access VLAN',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'VOICE_VLAN',
        type: 'number',
        description: 'Voice VLAN',
        required: true,
        defaultValue: 400,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'CRITICAL_VLAN',
        type: 'number',
        description: 'Critical authentication VLAN',
        required: true,
        defaultValue: 500,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'IOT_VLAN',
        type: 'number',
        description: 'IoT devices VLAN',
        required: true,
        defaultValue: 600,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'QUARANTINE_VLAN',
        type: 'number',
        description: 'Quarantine VLAN',
        required: true,
        defaultValue: 999,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 1, max: 4094 }
      },
      
      // 802.1X Configuration
      {
        name: 'DEVICE_TRACKING_POLICY',
        type: 'text',
        description: 'Device tracking policy name',
        required: true,
        defaultValue: 'IPDT_POLICY',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'POLICY_MAP_NAME',
        type: 'text',
        description: 'Control policy map name',
        required: true,
        defaultValue: 'IBNS_POLICY',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'DOT1X_RETRIES',
        type: 'number',
        description: '802.1X authentication retries',
        required: true,
        defaultValue: 3,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 10 }
      },
      {
        name: 'DOT1X_RETRY_TIME',
        type: 'number',
        description: '802.1X retry time in seconds',
        required: true,
        defaultValue: 60,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 300 }
      },
      {
        name: 'TX_PERIOD',
        type: 'number',
        description: 'EAP transmit period in seconds',
        required: true,
        defaultValue: 10,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'MAX_REQ',
        type: 'number',
        description: 'Maximum EAP requests',
        required: true,
        defaultValue: 2,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 10 }
      },
      
      // Service Templates
      {
        name: 'GUEST_TEMPLATE',
        type: 'text',
        description: 'Guest service template name',
        required: true,
        defaultValue: 'GUEST_ACCESS',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RESTRICTED_TEMPLATE',
        type: 'text',
        description: 'Restricted service template name',
        required: true,
        defaultValue: 'RESTRICTED_ACCESS',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'CRITICAL_AUTH_TEMPLATE',
        type: 'text',
        description: 'Critical auth service template name',
        required: true,
        defaultValue: 'CRITICAL_AUTH',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'VOICE_TEMPLATE',
        type: 'text',
        description: 'Voice service template name',
        required: true,
        defaultValue: 'VOICE_ACCESS',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // Port Configuration
      {
        name: 'ACCESS_PORT_RANGE',
        type: 'text',
        description: 'Access port range',
        required: true,
        defaultValue: 'GigabitEthernet1/0/1-48',
        group: VARIABLE_GROUPS.NETWORK,
        placeholder: 'e.g., GigabitEthernet1/0/1-48'
      },
      {
        name: 'ACCESS_PORT_DESCRIPTION',
        type: 'text',
        description: 'Access port description',
        required: true,
        defaultValue: 'Access Port with IBNS 2.0',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_PORT_RANGE',
        type: 'text',
        description: 'Uplink port range',
        required: true,
        defaultValue: 'TenGigabitEthernet1/1/1-4',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_DESCRIPTION',
        type: 'text',
        description: 'Uplink port description',
        required: true,
        defaultValue: 'Uplink to Distribution',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'HOST_MODE',
        type: 'select',
        description: 'Access session host mode',
        required: true,
        defaultValue: 'multi-auth',
        options: ['single-host', 'multi-host', 'multi-auth', 'multi-domain'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'CONTROL_DIRECTION',
        type: 'select',
        description: 'Access session control direction',
        required: true,
        defaultValue: 'both',
        options: ['in', 'both'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      
      // Trunk Configuration
      {
        name: 'TRUNK_ALLOWED_VLANS',
        type: 'text',
        description: 'Allowed VLANs on trunk ports',
        required: true,
        defaultValue: '100,200,300,400,500,600,999',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'TRUNK_NATIVE_VLAN',
        type: 'number',
        description: 'Native VLAN for trunk ports',
        required: true,
        defaultValue: 1,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      
      // Security Features
      {
        name: 'STORM_CONTROL_LEVEL',
        type: 'text',
        description: 'Storm control level (e.g., 1.00 for 1%)',
        required: true,
        defaultValue: '1.00',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'STORM_CONTROL_ACTION',
        type: 'select',
        description: 'Storm control action',
        required: true,
        defaultValue: 'shutdown',
        options: ['shutdown', 'trap'],
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'DHCP_SNOOPING_VLANS',
        type: 'text',
        description: 'VLANs for DHCP snooping',
        required: true,
        defaultValue: '100,200,300,400,500,600',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'DHCP_SNOOPING_TIMEOUT',
        type: 'number',
        description: 'DHCP snooping database timeout',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 60, max: 86400 }
      },
      {
        name: 'ARP_INSPECTION_VLANS',
        type: 'text',
        description: 'VLANs for ARP inspection',
        required: true,
        defaultValue: '100,200,300,400,500,600',
        group: VARIABLE_GROUPS.SECURITY
      },
      
      // Management Settings
      {
        name: 'LOG_BUFFER_SIZE',
        type: 'number',
        description: 'Log buffer size',
        required: true,
        defaultValue: 16384,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { min: 4096, max: 2147483647 }
      },
      {
        name: 'LOG_SOURCE_INTERFACE',
        type: 'text',
        description: 'Logging source interface',
        required: true,
        defaultValue: 'Vlan1',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SYSLOG_SERVER',
        type: 'ip',
        description: 'Syslog server IP',
        required: true,
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SNMP_RO_COMMUNITY',
        type: 'text',
        description: 'SNMP read-only community',
        required: true,
        defaultValue: 'public',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SNMP_RW_COMMUNITY',
        type: 'text',
        description: 'SNMP read-write community',
        required: true,
        defaultValue: 'private',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SNMP_CONTACT',
        type: 'text',
        description: 'SNMP system contact',
        required: true,
        defaultValue: 'Network Administrator',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SNMP_LOCATION',
        type: 'text',
        description: 'SNMP system location',
        required: true,
        defaultValue: 'Data Center',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SNMP_SERVER',
        type: 'ip',
        description: 'SNMP management server IP',
        required: true,
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'ACCOUNTING_UPDATE_INTERVAL',
        type: 'number',
        description: 'Accounting update interval in minutes',
        required: true,
        defaultValue: 5,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 71582 }
      },
      {
        name: 'VTY_TIMEOUT',
        type: 'number',
        description: 'VTY line timeout in minutes',
        required: true,
        defaultValue: 15,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { min: 0, max: 35791 }
      },
      {
        name: 'CONSOLE_TIMEOUT',
        type: 'number',
        description: 'Console timeout in minutes',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { min: 0, max: 35791 }
      },
      {
        name: 'LOCAL_ADMIN_USER',
        type: 'text',
        description: 'Local admin username',
        required: true,
        defaultValue: 'admin',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'LOCAL_ADMIN_PASSWORD',
        type: 'password',
        description: 'Local admin password',
        required: true,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { minLength: 8 }
      },
      {
        name: 'LOCAL_OPERATOR_USER',
        type: 'text',
        description: 'Local operator username',
        required: true,
        defaultValue: 'operator',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'LOCAL_OPERATOR_PASSWORD',
        type: 'password',
        description: 'Local operator password',
        required: true,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { minLength: 8 }
      },
      
      // Advanced Settings
      {
        name: 'FILTER_ACL_NAME',
        type: 'text',
        description: 'Filter ACL name',
        required: true,
        defaultValue: 'FILTER_ACL',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'WEB_REDIRECT_SERVER',
        type: 'ip',
        description: 'Web redirect server for guest access',
        required: false,
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'ERRDISABLE_RECOVERY_INTERVAL',
        type: 'number',
        description: 'Error disable recovery interval in seconds',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 30, max: 86400 }
      },
      {
        name: 'BANNER_MESSAGE',
        type: 'text',
        description: 'Login banner message',
        required: true,
        defaultValue: 'Authorized Access Only - All activity is monitored and logged',
        group: VARIABLE_GROUPS.MANAGEMENT
      }
    ],
    tags: ['IBNS 2.0', '802.1X', 'MAB', 'Dynamic VLAN', 'CoA', 'Enterprise', 'Security'],
    use_cases: [
      'Enterprise network access control',
      'BYOD environment with device classification',
      'Dynamic VLAN assignment based on user/device',
      'IoT device authentication and segmentation',
      'Guest access with captive portal',
      'Compliance requirements (SOX, HIPAA, PCI)',
      'Zero trust network architecture'
    ],
    requirements: [
      'Cisco ISE or compatible RADIUS server',
      'Certificate Authority for EAP-TLS',
      'Network management system (Prime Infrastructure)',
      'Syslog server for centralized logging',
      'DHCP server with appropriate scopes',
      'DNS server configuration',
      'NTP server for time synchronization'
    ],
    compatibility_matrix: [
      {
        model: 'Catalyst 9200',
        firmware_min: '16.12.01',
        feature_support: [
          { feature: 'IBNS 2.0', supported: true },
          { feature: 'Device Tracking', supported: true },
          { feature: 'MAB', supported: true },
          { feature: 'CoA', supported: true }
        ]
      },
      {
        model: 'Catalyst 9300',
        firmware_min: '16.12.01',
        feature_support: [
          { feature: 'IBNS 2.0', supported: true },
          { feature: 'Device Tracking', supported: true },
          { feature: 'MAB', supported: true },
          { feature: 'CoA', supported: true }
        ]
      },
      {
        model: 'Catalyst 9400',
        firmware_min: '16.12.01',
        feature_support: [
          { feature: 'IBNS 2.0', supported: true },
          { feature: 'Device Tracking', supported: true },
          { feature: 'MAB', supported: true },
          { feature: 'CoA', supported: true }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: 'Authentication sessions not starting',
        symptoms: ['No authentication attempts logged', 'Clients not getting network access'],
        solution: 'Verify access-session port-control is enabled and policy map is applied',
        commands: [
          'show access-session interface {{interface}}',
          'show authentication sessions',
          'show policy-map type control subscriber {{POLICY_MAP_NAME}}'
        ],
        priority: 'critical',
        common_causes: [
          'Access session not enabled on port',
          'Policy map not applied',
          'Device tracking policy not attached',
          'Port in wrong mode (trunk vs access)'
        ]
      },
      {
        issue: 'RADIUS authentication timeouts',
        symptoms: ['Authentication attempts timing out', 'RADIUS server unreachable messages'],
        solution: 'Check network connectivity to RADIUS server and verify configuration',
        commands: [
          'ping {{RADIUS_PRIMARY_IP}}',
          'show radius statistics',
          'test aaa group {{RADIUS_GROUP_NAME}} username test password test'
        ],
        priority: 'high',
        common_causes: [
          'Network connectivity issues',
          'Incorrect RADIUS shared secret',
          'RADIUS server service down',
          'Firewall blocking UDP 1812/1813'
        ]
      },
      {
        issue: 'Dynamic VLAN assignment not working',
        symptoms: ['Clients authenticating but staying in access VLAN'],
        solution: 'Verify RADIUS attributes and VLAN configuration',
        commands: [
          'show access-session interface {{interface}} details',
          'show vlan brief',
          'show authentication sessions interface {{interface}} details'
        ],
        priority: 'medium',
        common_causes: [
          'Missing RADIUS VLAN attributes',
          'VLAN not configured on switch',
          'Trunk not allowing VLAN',
          'Service template misconfiguration'
        ]
      }
    ],
    validation_commands: [
      {
        command: 'show version',
        description: 'Verify IOS-XE version compatibility',
        success_criteria: 'Version 16.12 or higher',
        category: 'configuration'
      },
      {
        command: 'show aaa sessions',
        description: 'Check AAA session status',
        success_criteria: 'AAA sessions show active authentication methods',
        category: 'authentication'
      },
      {
        command: 'show access-session summary',
        description: 'Verify access session configuration',
        success_criteria: 'Access sessions configured on required interfaces',
        category: 'authentication'
      },
      {
        command: 'show device-tracking policies',
        description: 'Check device tracking configuration',
        success_criteria: 'Device tracking policies configured and applied',
        category: 'configuration'
      },
      {
        command: 'show authentication sessions',
        description: 'Monitor active authentication sessions',
        success_criteria: 'Successful authentication sessions visible',
        category: 'authentication'
      },
      {
        command: 'show radius statistics',
        description: 'Check RADIUS server communication',
        success_criteria: 'RADIUS statistics show successful communications',
        category: 'connectivity'
      }
    ],
    references: [
      {
        title: 'Cisco IBNS 2.0 Design Guide',
        url: 'https://www.cisco.com/c/en/us/solutions/collateral/enterprise-networks/design-zone-network-security/guide-c07-737209.html',
        type: 'guide',
        vendor_official: true,
        description: 'Comprehensive IBNS 2.0 design and implementation guide'
      },
      {
        title: 'Catalyst 9000 Configuration Guide',
        url: 'https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/16-12/configuration_guide/sec/b_1612_sec_9300_cg.html',
        type: 'documentation',
        vendor_official: true,
        description: 'Official Cisco configuration guide for security features'
      }
    ],
    created_date: '2024-08-11',
    updated_date: '2024-08-11',
    version: '1.0.0'
  }
];