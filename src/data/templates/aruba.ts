import { BaseTemplate, TEMPLATE_CATEGORIES, VALIDATION_PATTERNS, VARIABLE_GROUPS } from './common';

export const arubaTemplates: BaseTemplate[] = [
  {
    id: 'aruba-cx-8325-clearpass-complete',
    name: 'Aruba CX 8325 Complete ClearPass Integration',
    description: 'Comprehensive 802.1X and ClearPass Policy Manager integration with advanced security features',
    category: TEMPLATE_CATEGORIES.AUTHENTICATION,
    subcategory: 'ClearPass Integration',
    vendor: 'Aruba',
    model: 'CX 8325',
    firmware: 'AOS-CX 10.12+',
    complexity_level: 'expert',
    estimated_time: '2-3 hours',
    prerequisites: [
      'ClearPass Policy Manager configured and licensed',
      'Certificate infrastructure for EAP-TLS',
      'VLAN design and IP addressing completed',
      'Network time synchronization configured',
      'DHCP infrastructure in place'
    ],
    post_deployment_tasks: [
      'Test all authentication scenarios',
      'Verify dynamic VLAN assignment',
      'Validate CoA and disconnect functionality',
      'Monitor ClearPass policy enforcement',
      'Document authentication flows and troubleshooting'
    ],
    content: `! Aruba CX 8325 Complete ClearPass Configuration
! ===============================================

! Hostname and basic configuration
hostname {{SWITCH_HOSTNAME}}
!
! Configure time and timezone
clock timezone {{TIMEZONE}}
ntp server {{NTP_PRIMARY}} iburst
ntp server {{NTP_SECONDARY}} iburst
ntp enable
!
! Configure DNS
ip dns server-address {{DNS_PRIMARY}} {{DNS_SECONDARY}}
ip dns domain-name {{DOMAIN_NAME}}
!
! Configure SNMP
snmp-server system-contact {{SNMP_CONTACT}}
snmp-server system-location {{SNMP_LOCATION}}
snmp-server system-description "{{SWITCH_DESCRIPTION}}"
snmp-server community {{SNMP_RO_COMMUNITY}} type ro
snmp-server community {{SNMP_RW_COMMUNITY}} type rw
snmp-server host {{SNMP_SERVER}} community {{SNMP_RO_COMMUNITY}}
snmp-server host {{SNMP_SERVER}} inform community {{SNMP_RO_COMMUNITY}}
snmp-server enable
!
! Configure syslog
logging {{SYSLOG_SERVER}}
logging level {{SYSLOG_LEVEL}}
logging source-interface {{SYSLOG_SOURCE_INTERFACE}}
!
! Configure management interface
interface mgmt
    no shutdown
    ip address {{MGMT_IP}}/{{MGMT_PREFIX}}
    default-gateway {{MGMT_GATEWAY}}
    description "Management Interface"
!
! Create VLANs
vlan {{CORPORATE_VLAN}}
    name "Corporate-Network"
    description "Corporate user access network"
!
vlan {{GUEST_VLAN}}
    name "Guest-Network"
    description "Guest user access network"
!
vlan {{IOT_VLAN}}
    name "IoT-Network"
    description "IoT device network"
!
vlan {{VOICE_VLAN}}
    name "Voice-Network"
    description "Voice over IP network"
!
vlan {{QUARANTINE_VLAN}}
    name "Quarantine-Network"
    description "Quarantine and remediation network"
!
vlan {{MGMT_VLAN}}
    name "Management-Network"
    description "Network management VLAN"
!
! Configure RADIUS servers for ClearPass
radius-server host {{CLEARPASS_PRIMARY_IP}}
    key {{CLEARPASS_PRIMARY_SECRET}}
    timeout {{RADIUS_TIMEOUT}}
    retransmit {{RADIUS_RETRANSMIT}}
    auth-port {{RADIUS_AUTH_PORT}}
    acct-port {{RADIUS_ACCT_PORT}}
    description "ClearPass Primary Server"
!
radius-server host {{CLEARPASS_SECONDARY_IP}}
    key {{CLEARPASS_SECONDARY_SECRET}}
    timeout {{RADIUS_TIMEOUT}}
    retransmit {{RADIUS_RETRANSMIT}}
    auth-port {{RADIUS_AUTH_PORT}}
    acct-port {{RADIUS_ACCT_PORT}}
    description "ClearPass Secondary Server"
!
! Configure RADIUS dynamic authorization (CoA)
radius-server host {{CLEARPASS_PRIMARY_IP}}
    dyn-authorization
    dyn-authorization port {{COA_PORT}}
    dyn-authorization client {{SWITCH_IP}} server-key {{COA_SECRET}}
!
radius-server host {{CLEARPASS_SECONDARY_IP}}
    dyn-authorization
    dyn-authorization port {{COA_PORT}}
    dyn-authorization client {{SWITCH_IP}} server-key {{COA_SECRET}}
!
! Create RADIUS server groups
aaa group server radius {{RADIUS_GROUP_NAME}}
    server {{CLEARPASS_PRIMARY_IP}}
    server {{CLEARPASS_SECONDARY_IP}}
!
! Configure AAA authentication
aaa authentication port-access eap-radius server-group {{RADIUS_GROUP_NAME}}
aaa authentication port-access mac-auth server-group {{RADIUS_GROUP_NAME}}
aaa authentication port-access chap-radius server-group {{RADIUS_GROUP_NAME}}
!
! Configure AAA accounting
aaa accounting port-access start-stop server-group {{RADIUS_GROUP_NAME}}
aaa accounting exec default start-stop server-group {{RADIUS_GROUP_NAME}}
!
! Enable AAA port access globally
aaa port-access authenticator active
aaa port-access mac-based active
!
! Configure device tracking for IP address assignment
device-tracking
device-tracking enable
!
! Configure 802.1X global settings
802.1x
802.1x enable
!
! Configure DHCP snooping
dhcp-snooping
dhcp-snooping vlan {{DHCP_SNOOPING_VLANS}}
dhcp-snooping database file {{DHCP_DATABASE_FILE}}
dhcp-snooping option-82
!
! Configure Dynamic ARP Inspection
arp-inspection vlan {{ARP_INSPECTION_VLANS}}
arp-inspection validate src-mac dst-mac ip
!
! Configure IP source guard
ip source-guard
ip source-guard enable
!
! Configure access port template
interface {{ACCESS_PORT_RANGE}}
    no shutdown
    description "{{ACCESS_PORT_DESCRIPTION}}"
    !
    ! Configure as access port
    no routing
    vlan access {{DEFAULT_ACCESS_VLAN}}
    vlan voice {{VOICE_VLAN}}
    !
    ! Enable port-access authentication
    aaa port-access authenticator
    aaa port-access mac-based
    !
    ! Authentication order: 802.1X first, then MAC auth
    aaa port-access {{ACCESS_PORT_RANGE}} auth-order authenticator mac-based
    aaa port-access {{ACCESS_PORT_RANGE}} auth-priority eap-radius
    !
    ! Configure authentication parameters
    aaa port-access {{ACCESS_PORT_RANGE}} client-limit {{CLIENT_LIMIT}}
    aaa port-access {{ACCESS_PORT_RANGE}} quiet-period {{QUIET_PERIOD}}
    aaa port-access {{ACCESS_PORT_RANGE}} tx-period {{TX_PERIOD}}
    aaa port-access {{ACCESS_PORT_RANGE}} supplicant-timeout {{SUPPLICANT_TIMEOUT}}
    aaa port-access {{ACCESS_PORT_RANGE}} server-timeout {{SERVER_TIMEOUT}}
    !
    ! Configure reauthentication
    aaa port-access {{ACCESS_PORT_RANGE}} reauth-period {{REAUTH_PERIOD}}
    aaa port-access {{ACCESS_PORT_RANGE}} cached-reauth-period {{CACHED_REAUTH_PERIOD}}
    !
    ! Configure VLAN assignment for authentication failures
    aaa port-access {{ACCESS_PORT_RANGE}} unauth-vid {{QUARANTINE_VLAN}}
    aaa port-access {{ACCESS_PORT_RANGE}} critical-vid {{QUARANTINE_VLAN}}
    !
    ! Configure controlled direction
    aaa port-access {{ACCESS_PORT_RANGE}} controlled-direction {{CONTROLLED_DIRECTION}}
    aaa port-access {{ACCESS_PORT_RANGE}} logoff-period {{LOGOFF_PERIOD}}
    !
    ! Configure MAC authentication settings
    aaa port-access mac-based addr-format {{MAC_FORMAT}}
    aaa port-access mac-based addr-limit {{MAC_LIMIT}} {{ACCESS_PORT_RANGE}}
    !
    ! Enable spanning tree edge port
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard
    !
    ! Configure storm control
    storm-control broadcast {{STORM_CONTROL_BROADCAST}}
    storm-control multicast {{STORM_CONTROL_MULTICAST}}
    storm-control unknown-unicast {{STORM_CONTROL_UNKNOWN_UNICAST}}
    storm-control action {{STORM_CONTROL_ACTION}}
    !
    ! Enable DHCP snooping trust on uplinks only
    ! (This will be configured on uplink interfaces)
    !
    ! Configure QoS for voice
    qos trust dscp
    !
    ! Enable LLDP for device discovery
    lldp enable
    lldp select-tlv system-name system-description system-capabilities
    lldp select-tlv port-description port-vlan-id
    lldp select-tlv management-address
!
! Configure uplink interfaces
interface {{UPLINK_INTERFACE_RANGE}}
    no shutdown
    description "{{UPLINK_DESCRIPTION}}"
    !
    ! Configure as trunk
    no routing
    vlan trunk native {{TRUNK_NATIVE_VLAN}}
    vlan trunk allowed {{TRUNK_ALLOWED_VLANS}}
    !
    ! Disable port access on uplinks
    no aaa port-access authenticator
    no aaa port-access mac-based
    !
    ! Configure spanning tree
    spanning-tree port-type admin-network
    spanning-tree guard root
    !
    ! Trust DHCP on uplinks
    dhcp-snooping trust
    arp-inspection trust
    !
    ! Configure LACP if using port channel
    lacp mode {{LACP_MODE}}
    lacp rate {{LACP_RATE}}
    !
    ! Enable LLDP
    lldp enable
!
! Configure port channel for uplinks (if applicable)
interface lag {{LAG_ID}}
    no shutdown
    description "{{LAG_DESCRIPTION}}"
    no routing
    vlan trunk native {{TRUNK_NATIVE_VLAN}}
    vlan trunk allowed {{TRUNK_ALLOWED_VLANS}}
    lacp mode active
    spanning-tree port-type admin-network
    spanning-tree guard root
    dhcp-snooping trust
    arp-inspection trust
!
! Configure VLAN interfaces for management
interface vlan{{MGMT_VLAN}}
    ip address {{VLAN_MGMT_IP}}/{{VLAN_MGMT_PREFIX}}
    description "Management VLAN Interface"
    ip helper-address {{DHCP_HELPER_ADDRESS}}
!
interface vlan{{CORPORATE_VLAN}}
    description "Corporate VLAN Interface"
    ip helper-address {{DHCP_HELPER_ADDRESS}}
!
interface vlan{{GUEST_VLAN}}
    description "Guest VLAN Interface"
    ip helper-address {{DHCP_HELPER_ADDRESS}}
!
interface vlan{{IOT_VLAN}}
    description "IoT VLAN Interface"
    ip helper-address {{DHCP_HELPER_ADDRESS}}
!
interface vlan{{VOICE_VLAN}}
    description "Voice VLAN Interface"
    ip helper-address {{DHCP_HELPER_ADDRESS}}
!
! Configure spanning tree
spanning-tree
spanning-tree priority {{STP_PRIORITY}}
spanning-tree hello-time {{STP_HELLO_TIME}}
spanning-tree forward-delay {{STP_FORWARD_DELAY}}
spanning-tree max-age {{STP_MAX_AGE}}
spanning-tree mode {{STP_MODE}}
!
! Configure loop protection
loop-protect
loop-protect disable-timer {{LOOP_PROTECT_DISABLE_TIMER}}
loop-protect transmit-interval {{LOOP_PROTECT_TX_INTERVAL}}
!
! Configure access control lists for security
access-list ip {{GUEST_ACL_NAME}}
    10 permit udp any any eq domain
    20 permit tcp any any eq domain
    30 permit udp any any eq bootpc
    40 permit udp any any eq bootps
    50 permit tcp any host {{WEB_REDIRECT_SERVER}} eq 80
    60 permit tcp any host {{WEB_REDIRECT_SERVER}} eq 443
    70 permit icmp any any
    80 deny ip any any log
!
access-list ip {{QUARANTINE_ACL_NAME}}
    10 permit udp any any eq domain
    20 permit tcp any any eq domain
    30 permit udp any any eq bootpc
    40 permit udp any any eq bootps
    50 permit tcp any host {{REMEDIATION_SERVER}} eq 80
    60 permit tcp any host {{REMEDIATION_SERVER}} eq 443
    70 deny ip any any log
!
! Apply ACLs to VLANs (configured via ClearPass enforcement)
! vlan {{GUEST_VLAN}}
!     apply access-list ip {{GUEST_ACL_NAME}} in
! vlan {{QUARANTINE_VLAN}}
!     apply access-list ip {{QUARANTINE_ACL_NAME}} in
!
! Configure QoS policies
policy-map {{QOS_POLICY_NAME}} type qos
    class {{QOS_VOICE_CLASS}}
        set-dscp ef
        police cir {{VOICE_CIR}} bc {{VOICE_BC}}
    class {{QOS_VIDEO_CLASS}}
        set-dscp af41
        police cir {{VIDEO_CIR}} bc {{VIDEO_BC}}
    class class-default
        set-dscp default
!
class-map {{QOS_VOICE_CLASS}} type qos match-any
    match dscp ef
    match vlan {{VOICE_VLAN}}
!
class-map {{QOS_VIDEO_CLASS}} type qos match-any
    match dscp af41
    match dscp af42
    match dscp af43
!
! Apply QoS policy to interfaces
interface {{ACCESS_PORT_RANGE}}
    apply policy-map {{QOS_POLICY_NAME}} in
!
! Configure MAC authentication bypass settings globally
aaa port-access mac-based addr-format {{MAC_FORMAT}}
aaa port-access mac-based cached-reauth-delay {{MAC_CACHED_REAUTH_DELAY}}
!
! Configure LLDP globally
lldp enable
lldp holdtime {{LLDP_HOLDTIME}}
lldp reinit {{LLDP_REINIT}}
lldp timer {{LLDP_TIMER}}
lldp select-tlv system-name system-description system-capabilities
lldp select-tlv port-description port-vlan-id management-address
!
! Configure local users for emergency access
user {{LOCAL_ADMIN_USER}} group administrators password plaintext {{LOCAL_ADMIN_PASSWORD}}
user {{LOCAL_OPERATOR_USER}} group operators password plaintext {{LOCAL_OPERATOR_PASSWORD}}
!
! Configure SSH and access
ssh server vrf mgmt
ssh server vrf default
aaa authentication login default local
aaa authentication login ssh server-group {{RADIUS_GROUP_NAME}} local
!
! Configure session timeout and security
aaa authentication login console local
session-timeout {{SESSION_TIMEOUT}}
!
! Configure banner
banner motd "
{{BANNER_MESSAGE}}
"
!
! Enable necessary features
feature dhcp-snooping
feature arp-inspection
feature storm-control
feature qos
feature lldp
feature lacp
!
! Configure automatic configuration backup
event-handler CONFIG_BACKUP
    trigger config-change
    action bash curl -T /cfg/startup-config {{BACKUP_SERVER}}/{{SWITCH_HOSTNAME}}-config-backup.txt
    delay {{BACKUP_DELAY}}
!
! Configure monitoring and alerts
monitor session {{MONITOR_SESSION_NAME}}
    destination interface {{MONITOR_DESTINATION}}
    source interface {{MONITOR_SOURCE}} both
    {{MONITOR_ENABLE}}
!
! Save configuration
write memory`,
    variables: [
      // Basic Configuration
      {
        name: 'SWITCH_HOSTNAME',
        type: 'text',
        description: 'Switch hostname',
        required: true,
        defaultValue: 'ARUBA-CX8325-01',
        group: VARIABLE_GROUPS.BASIC,
        validation: {
          pattern: VALIDATION_PATTERNS.HOSTNAME,
          errorMessage: 'Invalid hostname format'
        }
      },
      {
        name: 'SWITCH_DESCRIPTION',
        type: 'text',
        description: 'Switch description for SNMP',
        required: true,
        defaultValue: 'Aruba CX 8325 Access Switch with ClearPass',
        group: VARIABLE_GROUPS.BASIC
      },
      {
        name: 'DOMAIN_NAME',
        type: 'text',
        description: 'DNS domain name',
        required: true,
        defaultValue: 'company.local',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'TIMEZONE',
        type: 'text',
        description: 'System timezone',
        required: true,
        defaultValue: 'US/Pacific',
        group: VARIABLE_GROUPS.BASIC,
        placeholder: 'e.g., US/Pacific, UTC, Europe/London'
      },
      
      // Network Configuration
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
        name: 'MGMT_PREFIX',
        type: 'number',
        description: 'Management subnet prefix length',
        required: true,
        defaultValue: 24,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 8, max: 30 }
      },
      {
        name: 'MGMT_GATEWAY',
        type: 'ip',
        description: 'Management gateway IP',
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
      
      // ClearPass Configuration
      {
        name: 'CLEARPASS_PRIMARY_IP',
        type: 'ip',
        description: 'ClearPass primary server IP',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          pattern: VALIDATION_PATTERNS.IPV4,
          errorMessage: 'Invalid IP address'
        }
      },
      {
        name: 'CLEARPASS_PRIMARY_SECRET',
        type: 'password',
        description: 'ClearPass primary shared secret',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { minLength: 8 }
      },
      {
        name: 'CLEARPASS_SECONDARY_IP',
        type: 'ip',
        description: 'ClearPass secondary server IP',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'CLEARPASS_SECONDARY_SECRET',
        type: 'password',
        description: 'ClearPass secondary shared secret',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { minLength: 8 }
      },
      {
        name: 'SWITCH_IP',
        type: 'ip',
        description: 'Switch IP for CoA configuration',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'COA_SECRET',
        type: 'password',
        description: 'Change of Authorization shared secret',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { minLength: 8 }
      },
      {
        name: 'COA_PORT',
        type: 'number',
        description: 'CoA port number',
        required: true,
        defaultValue: 3799,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
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
        defaultValue: 'CLEARPASS-GROUP',
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
        name: 'IOT_VLAN',
        type: 'number',
        description: 'IoT devices VLAN',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.NETWORK,
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
        name: 'QUARANTINE_VLAN',
        type: 'number',
        description: 'Quarantine VLAN',
        required: true,
        defaultValue: 999,
        group: VARIABLE_GROUPS.SECURITY,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'MGMT_VLAN',
        type: 'number',
        description: 'Management VLAN',
        required: true,
        defaultValue: 1,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'DEFAULT_ACCESS_VLAN',
        type: 'number',
        description: 'Default access VLAN for ports',
        required: true,
        defaultValue: 100,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      
      // Interface Configuration
      {
        name: 'ACCESS_PORT_RANGE',
        type: 'text',
        description: 'Access port range',
        required: true,
        defaultValue: '1/1/1-1/1/48',
        group: VARIABLE_GROUPS.NETWORK,
        placeholder: '1/1/1-1/1/48'
      },
      {
        name: 'ACCESS_PORT_DESCRIPTION',
        type: 'text',
        description: 'Access port description',
        required: true,
        defaultValue: 'ClearPass Access Port',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_INTERFACE_RANGE',
        type: 'text',
        description: 'Uplink interface range',
        required: true,
        defaultValue: '1/1/49-1/1/52',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_DESCRIPTION',
        type: 'text',
        description: 'Uplink interface description',
        required: true,
        defaultValue: 'Uplink to Distribution',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // Authentication Parameters
      {
        name: 'CLIENT_LIMIT',
        type: 'number',
        description: 'Maximum clients per port',
        required: true,
        defaultValue: 32,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 1024 }
      },
      {
        name: 'QUIET_PERIOD',
        type: 'number',
        description: 'Quiet period after failed auth (seconds)',
        required: true,
        defaultValue: 60,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'TX_PERIOD',
        type: 'number',
        description: 'EAP transmit period (seconds)',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'SUPPLICANT_TIMEOUT',
        type: 'number',
        description: 'Supplicant timeout (seconds)',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'SERVER_TIMEOUT',
        type: 'number',
        description: 'Server timeout (seconds)',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'REAUTH_PERIOD',
        type: 'number',
        description: 'Reauthentication period (seconds)',
        required: true,
        defaultValue: 3600,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 0, max: 65535 }
      },
      {
        name: 'CACHED_REAUTH_PERIOD',
        type: 'number',
        description: 'Cached reauthentication period (seconds)',
        required: true,
        defaultValue: 1800,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'CONTROLLED_DIRECTION',
        type: 'select',
        description: 'Port access controlled direction',
        required: true,
        defaultValue: 'both',
        options: ['in', 'both'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'LOGOFF_PERIOD',
        type: 'number',
        description: 'Logoff period (seconds)',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      {
        name: 'MAC_FORMAT',
        type: 'select',
        description: 'MAC address format for authentication',
        required: true,
        defaultValue: 'multi-colon',
        options: ['multi-colon', 'multi-hyphen', 'single-dash', 'no-delimiter'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'MAC_LIMIT',
        type: 'number',
        description: 'MAC address limit per port',
        required: true,
        defaultValue: 32,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 1024 }
      },
      {
        name: 'MAC_CACHED_REAUTH_DELAY',
        type: 'number',
        description: 'MAC cached reauthentication delay (seconds)',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: { min: 1, max: 65535 }
      },
      
      // Trunk Configuration
      {
        name: 'TRUNK_NATIVE_VLAN',
        type: 'number',
        description: 'Native VLAN for trunk ports',
        required: true,
        defaultValue: 1,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 1, max: 4094 }
      },
      {
        name: 'TRUNK_ALLOWED_VLANS',
        type: 'text',
        description: 'Allowed VLANs on trunk',
        required: true,
        defaultValue: '100,200,300,400,999',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // LAG Configuration
      {
        name: 'LAG_ID',
        type: 'number',
        description: 'Link Aggregation Group ID',
        required: false,
        defaultValue: 1,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 1, max: 256 }
      },
      {
        name: 'LAG_DESCRIPTION',
        type: 'text',
        description: 'LAG interface description',
        required: false,
        defaultValue: 'Uplink LAG to Distribution',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'LACP_MODE',
        type: 'select',
        description: 'LACP mode',
        required: true,
        defaultValue: 'active',
        options: ['active', 'passive'],
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'LACP_RATE',
        type: 'select',
        description: 'LACP rate',
        required: true,
        defaultValue: 'fast',
        options: ['slow', 'fast'],
        group: VARIABLE_GROUPS.ADVANCED
      },
      
      // Security Settings
      {
        name: 'DHCP_SNOOPING_VLANS',
        type: 'text',
        description: 'VLANs for DHCP snooping',
        required: true,
        defaultValue: '100,200,300,400',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'DHCP_DATABASE_FILE',
        type: 'text',
        description: 'DHCP snooping database file',
        required: true,
        defaultValue: 'dhcp-snooping.db',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'ARP_INSPECTION_VLANS',
        type: 'text',
        description: 'VLANs for ARP inspection',
        required: true,
        defaultValue: '100,200,300,400',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'STORM_CONTROL_BROADCAST',
        type: 'text',
        description: 'Broadcast storm control threshold',
        required: true,
        defaultValue: '10 pps',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'STORM_CONTROL_MULTICAST',
        type: 'text',
        description: 'Multicast storm control threshold',
        required: true,
        defaultValue: '10 pps',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'STORM_CONTROL_UNKNOWN_UNICAST',
        type: 'text',
        description: 'Unknown unicast storm control threshold',
        required: true,
        defaultValue: '10 pps',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'STORM_CONTROL_ACTION',
        type: 'select',
        description: 'Storm control action',
        required: true,
        defaultValue: 'shutdown',
        options: ['shutdown', 'drop'],
        group: VARIABLE_GROUPS.SECURITY
      },
      
      // Management Settings
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
        name: 'SNMP_SERVER',
        type: 'ip',
        description: 'SNMP management server IP',
        required: true,
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
        name: 'SYSLOG_LEVEL',
        type: 'select',
        description: 'Syslog level',
        required: true,
        defaultValue: 'info',
        options: ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'],
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SYSLOG_SOURCE_INTERFACE',
        type: 'text',
        description: 'Syslog source interface',
        required: true,
        defaultValue: 'mgmt',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SESSION_TIMEOUT',
        type: 'number',
        description: 'Session timeout in minutes',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { min: 1, max: 1440 }
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
      
      // VLAN Interface Configuration
      {
        name: 'VLAN_MGMT_IP',
        type: 'ip',
        description: 'Management VLAN interface IP',
        required: true,
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'VLAN_MGMT_PREFIX',
        type: 'number',
        description: 'Management VLAN prefix length',
        required: true,
        defaultValue: 24,
        group: VARIABLE_GROUPS.NETWORK,
        validation: { min: 8, max: 30 }
      },
      {
        name: 'DHCP_HELPER_ADDRESS',
        type: 'ip',
        description: 'DHCP helper/relay address',
        required: true,
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // Spanning Tree Configuration
      {
        name: 'STP_PRIORITY',
        type: 'number',
        description: 'Spanning tree priority',
        required: true,
        defaultValue: 32768,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 0, max: 61440 }
      },
      {
        name: 'STP_HELLO_TIME',
        type: 'number',
        description: 'STP hello time (seconds)',
        required: true,
        defaultValue: 2,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 1, max: 10 }
      },
      {
        name: 'STP_FORWARD_DELAY',
        type: 'number',
        description: 'STP forward delay (seconds)',
        required: true,
        defaultValue: 15,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 4, max: 30 }
      },
      {
        name: 'STP_MAX_AGE',
        type: 'number',
        description: 'STP max age (seconds)',
        required: true,
        defaultValue: 20,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 6, max: 40 }
      },
      {
        name: 'STP_MODE',
        type: 'select',
        description: 'Spanning tree mode',
        required: true,
        defaultValue: 'mstp',
        options: ['stp', 'rstp', 'mstp'],
        group: VARIABLE_GROUPS.ADVANCED
      },
      
      // Loop Protection
      {
        name: 'LOOP_PROTECT_DISABLE_TIMER',
        type: 'number',
        description: 'Loop protection disable timer (seconds)',
        required: true,
        defaultValue: 600,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 1, max: 86400 }
      },
      {
        name: 'LOOP_PROTECT_TX_INTERVAL',
        type: 'number',
        description: 'Loop protection transmit interval (seconds)',
        required: true,
        defaultValue: 5,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 1, max: 60 }
      },
      
      // ACL Configuration
      {
        name: 'GUEST_ACL_NAME',
        type: 'text',
        description: 'Guest access ACL name',
        required: true,
        defaultValue: 'GUEST_ACCESS_ACL',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'QUARANTINE_ACL_NAME',
        type: 'text',
        description: 'Quarantine ACL name',
        required: true,
        defaultValue: 'QUARANTINE_ACL',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'WEB_REDIRECT_SERVER',
        type: 'ip',
        description: 'Web redirect server for guest access',
        required: false,
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'REMEDIATION_SERVER',
        type: 'ip',
        description: 'Remediation server for quarantine',
        required: false,
        group: VARIABLE_GROUPS.SECURITY
      },
      
      // QoS Configuration
      {
        name: 'QOS_POLICY_NAME',
        type: 'text',
        description: 'QoS policy name',
        required: true,
        defaultValue: 'VOICE_QOS_POLICY',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'QOS_VOICE_CLASS',
        type: 'text',
        description: 'Voice traffic class name',
        required: true,
        defaultValue: 'VOICE_CLASS',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'QOS_VIDEO_CLASS',
        type: 'text',
        description: 'Video traffic class name',
        required: true,
        defaultValue: 'VIDEO_CLASS',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'VOICE_CIR',
        type: 'text',
        description: 'Voice committed information rate',
        required: true,
        defaultValue: '64000',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'VOICE_BC',
        type: 'text',
        description: 'Voice burst committed',
        required: true,
        defaultValue: '8000',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'VIDEO_CIR',
        type: 'text',
        description: 'Video committed information rate',
        required: true,
        defaultValue: '1000000',
        group: VARIABLE_GROUPS.ADVANCED
      },
      {
        name: 'VIDEO_BC',
        type: 'text',
        description: 'Video burst committed',
        required: true,
        defaultValue: '125000',
        group: VARIABLE_GROUPS.ADVANCED
      },
      
      // LLDP Configuration
      {
        name: 'LLDP_HOLDTIME',
        type: 'number',
        description: 'LLDP hold time (seconds)',
        required: true,
        defaultValue: 120,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 10, max: 65535 }
      },
      {
        name: 'LLDP_REINIT',
        type: 'number',
        description: 'LLDP reinit delay (seconds)',
        required: true,
        defaultValue: 2,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 1, max: 10 }
      },
      {
        name: 'LLDP_TIMER',
        type: 'number',
        description: 'LLDP timer (seconds)',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: { min: 5, max: 32768 }
      },
      
      // Backup Configuration
      {
        name: 'BACKUP_SERVER',
        type: 'text',
        description: 'Configuration backup server URL',
        required: false,
        defaultValue: 'tftp://192.168.1.100',
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'BACKUP_DELAY',
        type: 'number',
        description: 'Backup delay after config change (seconds)',
        required: false,
        defaultValue: 300,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: { min: 60, max: 3600 }
      },
      
      // Monitoring Configuration
      {
        name: 'MONITOR_SESSION_NAME',
        type: 'text',
        description: 'Monitor session name',
        required: false,
        defaultValue: 'troubleshoot',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MONITOR_DESTINATION',
        type: 'text',
        description: 'Monitor destination interface',
        required: false,
        defaultValue: '1/1/48',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MONITOR_SOURCE',
        type: 'text',
        description: 'Monitor source interfaces',
        required: false,
        defaultValue: '1/1/1-1/1/24',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MONITOR_ENABLE',
        type: 'select',
        description: 'Enable monitor session',
        required: false,
        defaultValue: 'no shutdown',
        options: ['shutdown', 'no shutdown'],
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      
      // Banner Configuration
      {
        name: 'BANNER_MESSAGE',
        type: 'text',
        description: 'Login banner message',
        required: true,
        defaultValue: 'Authorized Access Only - All activity is monitored and logged',
        group: VARIABLE_GROUPS.MANAGEMENT
      }
    ],
    tags: ['ClearPass', 'AOS-CX', '802.1X', 'MAC Authentication', 'Dynamic VLAN', 'CoA', 'Enterprise'],
    use_cases: [
      'Enterprise ClearPass Policy Manager integration',
      'Dynamic user and device policy enforcement',
      'BYOD with comprehensive device profiling',
      'IoT device authentication and segmentation',
      'Guest access with captive portal integration',
      'Zero trust network architecture',
      'Compliance frameworks (SOX, HIPAA, PCI)',
      'Real-time policy enforcement and remediation'
    ],
    requirements: [
      'ClearPass Policy Manager with appropriate licensing',
      'Certificate Authority for EAP-TLS authentication',
      'DHCP infrastructure with appropriate reservations',
      'DNS infrastructure with proper records',
      'Network management system (Aruba Central/NetEdit)',
      'Syslog server for centralized logging',
      'SNMP monitoring system',
      'Time synchronization infrastructure (NTP)'
    ],
    compatibility_matrix: [
      {
        model: 'CX 8325',
        firmware_min: '10.12.0000',
        feature_support: [
          { feature: 'ClearPass Integration', supported: true },
          { feature: 'Dynamic Authorization (CoA)', supported: true },
          { feature: 'MAC Authentication', supported: true },
          { feature: 'Device Tracking', supported: true },
          { feature: 'DHCP Snooping', supported: true },
          { feature: 'Dynamic ARP Inspection', supported: true }
        ]
      },
      {
        model: 'CX 8320',
        firmware_min: '10.12.0000',
        feature_support: [
          { feature: 'ClearPass Integration', supported: true },
          { feature: 'Dynamic Authorization (CoA)', supported: true },
          { feature: 'MAC Authentication', supported: true },
          { feature: 'Device Tracking', supported: true }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: 'ClearPass authentication failing',
        symptoms: ['Authentication timeouts', 'Access denied messages', 'Clients not getting network access'],
        solution: 'Verify ClearPass server connectivity, shared secrets, and network access device configuration',
        commands: [
          'show radius statistics',
          'show aaa port-access summary',
          'show port-access clients',
          'ping {{CLEARPASS_PRIMARY_IP}}'
        ],
        priority: 'critical',
        common_causes: [
          'Incorrect RADIUS shared secret',
          'Network connectivity to ClearPass',
          'ClearPass policy configuration issues',
          'Certificate problems for EAP-TLS',
          'Network access device not properly configured in ClearPass'
        ]
      },
      {
        issue: 'Dynamic VLAN assignment not working',
        symptoms: ['Clients authenticating but staying in access VLAN', 'Wrong network access for authenticated users'],
        solution: 'Check ClearPass VLAN attributes and switch VLAN configuration',
        commands: [
          'show port-access clients detail',
          'show vlan brief',
          'show interface {{ACCESS_PORT_RANGE}} brief'
        ],
        priority: 'high',
        common_causes: [
          'Missing VLAN attributes in ClearPass role',
          'VLAN not configured on switch',
          'Trunk not allowing assigned VLAN',
          'Role mapping issues in ClearPass'
        ]
      },
      {
        issue: 'CoA (Change of Authorization) not working',
        symptoms: ['Policy changes not taking effect immediately', 'Users not being disconnected when disabled'],
        solution: 'Verify CoA configuration and network connectivity',
        commands: [
          'show radius dynamic-authorization',
          'show port-access clients',
          'show logging | include CoA'
        ],
        priority: 'medium',
        common_causes: [
          'Incorrect CoA shared secret',
          'CoA port blocked by firewall',
          'Switch IP not configured correctly in ClearPass',
          'CoA feature not enabled on switch'
        ]
      }
    ],
    validation_commands: [
      {
        command: 'show version',
        description: 'Verify AOS-CX version and features',
        success_criteria: 'Version 10.12 or higher with required feature licenses',
        category: 'configuration'
      },
      {
        command: 'show radius statistics',
        description: 'Check RADIUS server communication',
        success_criteria: 'Successful authentication and accounting statistics',
        category: 'connectivity'
      },
      {
        command: 'show aaa port-access summary',
        description: 'Verify port access configuration',
        success_criteria: 'Port access enabled on required interfaces',
        category: 'authentication'
      },
      {
        command: 'show port-access clients',
        description: 'Monitor active authentication sessions',
        success_criteria: 'Successful authentication sessions with correct VLAN assignment',
        category: 'authentication'
      },
      {
        command: 'show radius dynamic-authorization',
        description: 'Check CoA configuration',
        success_criteria: 'CoA enabled with correct client configuration',
        category: 'authorization'
      },
      {
        command: 'show dhcp-snooping',
        description: 'Verify DHCP snooping status',
        success_criteria: 'DHCP snooping enabled on required VLANs',
        category: 'configuration'
      }
    ],
    references: [
      {
        title: 'Aruba CX 8325 Configuration Guide',
        url: 'https://www.arubanetworks.com/techdocs/AOS-CX/10.12/PDF/security_guide.pdf',
        type: 'documentation',
        vendor_official: true,
        description: 'Official Aruba configuration guide for security features'
      },
      {
        title: 'ClearPass Policy Manager User Guide',
        url: 'https://www.arubanetworks.com/techdocs/ClearPass/6.12/PolicyManager/Guest/Content/Home.htm',
        type: 'documentation',
        vendor_official: true,
        description: 'Comprehensive ClearPass configuration and policy guide'
      },
      {
        title: 'Aruba CX Switch and ClearPass Integration Guide',
        url: 'https://www.arubanetworks.com/techdocs/ClearPass/6.12/ClearPass_UserGuide_ArubaOS-CX/Content/Home.htm',
        type: 'guide',
        vendor_official: true,
        description: 'Specific integration guide for CX switches with ClearPass'
      }
    ],
    created_date: '2024-08-11',
    updated_date: '2024-08-11',
    version: '1.0.0'
  }
];