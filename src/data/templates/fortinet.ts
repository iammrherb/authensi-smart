import { BaseTemplate, TEMPLATE_CATEGORIES, VALIDATION_PATTERNS, VARIABLE_GROUPS } from './common';

export const fortinetTemplates: BaseTemplate[] = [
  {
    id: 'fortinet-fortiswitch-dot1x-basic',
    name: 'FortiSwitch 802.1X Basic Authentication',
    description: 'Complete 802.1X authentication setup with RADIUS for FortiSwitch access layer',
    category: TEMPLATE_CATEGORIES.AUTHENTICATION,
    subcategory: '802.1X Port-Based Authentication',
    vendor: 'Fortinet',
    model: 'FortiSwitch (All Models)',
    firmware: '7.2.0+',
    complexity_level: 'intermediate',
    estimated_time: '45 minutes',
    prerequisites: [
      'RADIUS server configured and accessible',
      'Basic FortiSwitch management access',
      'VLAN planning completed',
      'Certificate infrastructure in place for EAP-TLS (if used)'
    ],
    post_deployment_tasks: [
      'Test authentication with known good client',
      'Verify VLAN assignment',
      'Monitor RADIUS server logs',
      'Document configuration for support team'
    ],
    content: `! FortiSwitch 802.1X Complete Configuration
! =========================================

! System Configuration
config system global
    set hostname "{{SWITCH_HOSTNAME}}"
    set admin-timeout {{ADMIN_TIMEOUT}}
    set admin-https-ssl-versions tlsv1-2 tlsv1-3
    set strong-crypto enable
end

! Management Interface Configuration  
config system interface
    edit "mgmt"
        set ip {{MGMT_IP}} {{MGMT_NETMASK}}
        set allowaccess ping https ssh snmp
        set description "Management Interface"
    next
end

! DNS Configuration
config system dns
    set primary {{DNS_PRIMARY}}
    set secondary {{DNS_SECONDARY}}
end

! NTP Configuration for accurate timestamping
config system ntp
    set ntpsync enable
    set server-mode enable
    set type fortiguard
    set source-ip {{MGMT_IP}}
end

! SNMP Configuration for monitoring
config system snmp sysinfo
    set status enable
    set description "{{SWITCH_DESCRIPTION}}"
    set contact-info "{{SNMP_CONTACT}}"
    set location "{{SNMP_LOCATION}}"
end

config system snmp community
    edit 1
        set name "{{SNMP_COMMUNITY}}"
        set query-v1-status enable
        set query-v2c-status enable
        set trap-v1-status enable
        set trap-v2c-status enable
        set hosts {{SNMP_SERVER}}
    next
end

! Syslog Configuration
config log syslogd setting
    set status enable
    set server {{SYSLOG_SERVER}}
    set port 514
    set facility {{SYSLOG_FACILITY}}
    set source-ip {{MGMT_IP}}
    set format default
end

! RADIUS Server Configuration
config user radius
    edit "{{RADIUS_SERVER_NAME}}"
        set server "{{RADIUS_SERVER_IP}}"
        set secret "{{RADIUS_SECRET}}"
        set auth-type {{RADIUS_AUTH_TYPE}}
        set source-ip "{{MGMT_IP}}"
        set nas-ip "{{MGMT_IP}}"
        set acct-server "{{RADIUS_ACCT_SERVER}}"
        set acct-secret "{{RADIUS_ACCT_SECRET}}"
        set timeout {{RADIUS_TIMEOUT}}
    next
end

! Secondary RADIUS Server for redundancy
config user radius
    edit "{{RADIUS_SERVER_NAME_BACKUP}}"
        set server "{{RADIUS_SERVER_IP_BACKUP}}"
        set secret "{{RADIUS_SECRET_BACKUP}}"
        set auth-type {{RADIUS_AUTH_TYPE}}
        set source-ip "{{MGMT_IP}}"
        set nas-ip "{{MGMT_IP}}"
        set timeout {{RADIUS_TIMEOUT}}
    next
end

! RADIUS Server Group
config user group
    edit "{{RADIUS_GROUP_NAME}}"
        set member "{{RADIUS_SERVER_NAME}}" "{{RADIUS_SERVER_NAME_BACKUP}}"
    next
end

! VLAN Configuration
config switch vlan
    edit {{AUTHORIZED_VLAN_ID}}
        set description "{{AUTHORIZED_VLAN_DESC}}"
    next
    edit {{GUEST_VLAN_ID}}
        set description "{{GUEST_VLAN_DESC}}"
    next  
    edit {{QUARANTINE_VLAN_ID}}
        set description "{{QUARANTINE_VLAN_DESC}}"
    next
    edit {{VOICE_VLAN_ID}}
        set description "{{VOICE_VLAN_DESC}}"
    next
end

! 802.1X Global Settings
config switch security
    set dot1x-enable enable
    set dot1x-failure-action {{DOT1X_FAILURE_ACTION}}
    set dot1x-restricted-vlan {{QUARANTINE_VLAN_ID}}
    set dot1x-guest-vlan {{GUEST_VLAN_ID}}
    set dot1x-auth-timeout {{DOT1X_AUTH_TIMEOUT}}
    set dot1x-quiet-period {{DOT1X_QUIET_PERIOD}}
    set dot1x-reauth-period {{DOT1X_REAUTH_PERIOD}}
    set dot1x-tx-period {{DOT1X_TX_PERIOD}}
    set dot1x-supp-timeout {{DOT1X_SUPP_TIMEOUT}}
    set dot1x-max-req {{DOT1X_MAX_REQ}}
end

! Port Configuration for 802.1X
config switch interface
    edit "{{ACCESS_PORT_RANGE}}"
        set description "{{ACCESS_PORT_DESC}}"
        set dot1x enable
        set dot1x-auth-type {{DOT1X_AUTH_METHOD}}
        set dot1x-radius-server "{{RADIUS_GROUP_NAME}}"
        set dot1x-fallback-timeout {{DOT1X_FALLBACK_TIMEOUT}}
        set dot1x-guest-auth enable
        set dot1x-mac-auth {{MAC_AUTH_ENABLE}}
        set voice-vlan {{VOICE_VLAN_ID}}
        set native-vlan {{AUTHORIZED_VLAN_ID}}
        set allowed-vlans {{AUTHORIZED_VLAN_ID}} {{GUEST_VLAN_ID}} {{QUARANTINE_VLAN_ID}} {{VOICE_VLAN_ID}}
        set port-security {{PORT_SECURITY_ENABLE}}
        set port-security-max-mac {{PORT_SECURITY_MAX_MAC}}
        set storm-control broadcast {{STORM_CONTROL_BROADCAST}}
        set storm-control unknown-unicast {{STORM_CONTROL_UNKNOWN_UNICAST}}
        set storm-control multicast {{STORM_CONTROL_MULTICAST}}
    next
end

! Uplink Port Configuration
config switch interface  
    edit "{{UPLINK_PORT_RANGE}}"
        set description "{{UPLINK_PORT_DESC}}"
        set type trunk
        set allowed-vlans all
        set native-vlan 1
        set stp-state enable
        set stp-loop-guard enable
    next
end

! Spanning Tree Configuration
config switch stp settings
    set status enable
    set revision {{STP_REVISION}}
    set hello-time {{STP_HELLO_TIME}}
    set forward-delay {{STP_FORWARD_DELAY}}
    set max-age {{STP_MAX_AGE}}
    set max-hops {{STP_MAX_HOPS}}
end

! LLDP Configuration for device discovery
config switch lldp settings
    set status enable
    set tx-hold {{LLDP_TX_HOLD}}
    set tx-interval {{LLDP_TX_INTERVAL}}
    set fast-start-interval {{LLDP_FAST_START_INTERVAL}}
end

config switch lldp profile
    edit "default"
        set med-tlvs inventory-management network-policy location-identification power-management
        set 802.1-tlvs port-vlan-id
        set 802.3-tlvs max-frame-size power-via-mdi
    next
end

! Loop Guard Configuration
config switch loop-guard
    set status enable
    set timeout {{LOOP_GUARD_TIMEOUT}}
end

! DHCP Snooping Configuration
config switch dhcp-snooping
    set status enable
    set verify-mac enable
    set insert-option82 enable
    config vlan
        edit {{AUTHORIZED_VLAN_ID}}
            set status enable
        next
        edit {{GUEST_VLAN_ID}}
            set status enable
        next
    end
end

! Dynamic ARP Inspection
config switch arp-inspection
    set status enable
    config vlan
        edit {{AUTHORIZED_VLAN_ID}}
            set status enable
        next
        edit {{GUEST_VLAN_ID}}
            set status enable
        next
    end
end

! Port Mirroring for troubleshooting (optional)
config switch mirror
    edit "{{MIRROR_SESSION_NAME}}"
        set status {{MIRROR_ENABLE}}
        set dst "{{MIRROR_DESTINATION_PORT}}"
        set src-ingress "{{MIRROR_SOURCE_PORTS}}"
        set src-egress "{{MIRROR_SOURCE_PORTS}}"
        set switching-packet enable
    next
end

! Access Control Lists for security
config switch acl settings
    set status enable
    set deny-unknown-src enable
end

! Quality of Service Configuration
config switch qos dot1p-map
    edit "default"
        set priority-0 queue-0
        set priority-1 queue-1
        set priority-2 queue-2
        set priority-3 queue-3
        set priority-4 queue-4
        set priority-5 queue-5
        set priority-6 queue-6
        set priority-7 queue-7
    next
end

! Save Configuration
execute backup config flash backup-config-{{BACKUP_TIMESTAMP}}`,
    variables: [
      // Basic Configuration Group
      {
        name: 'SWITCH_HOSTNAME',
        type: 'text',
        description: 'Hostname for the FortiSwitch',
        required: true,
        defaultValue: 'FortiSwitch-01',
        group: VARIABLE_GROUPS.BASIC,
        validation: {
          pattern: VALIDATION_PATTERNS.HOSTNAME,
          minLength: 1,
          maxLength: 63,
          errorMessage: 'Hostname must be 1-63 characters and contain only letters, numbers, and hyphens'
        }
      },
      {
        name: 'SWITCH_DESCRIPTION',
        type: 'text',
        description: 'Description of the switch location/purpose',
        required: true,
        defaultValue: 'Access Layer Switch',
        group: VARIABLE_GROUPS.BASIC,
        placeholder: 'e.g., Building A Floor 1 Access Switch'
      },
      
      // Network Settings Group
      {
        name: 'MGMT_IP',
        type: 'ip',
        description: 'Management IP address of the FortiSwitch',
        required: true,
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          pattern: VALIDATION_PATTERNS.IPV4,
          errorMessage: 'Must be a valid IPv4 address'
        }
      },
      {
        name: 'MGMT_NETMASK',
        type: 'ip',
        description: 'Management subnet mask',
        required: true,
        defaultValue: '255.255.255.0',
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          pattern: VALIDATION_PATTERNS.IPV4,
          errorMessage: 'Must be a valid IPv4 subnet mask'
        }
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
      
      // Authentication Settings Group
      {
        name: 'RADIUS_SERVER_NAME',
        type: 'text',
        description: 'Primary RADIUS server identifier',
        required: true,
        defaultValue: 'RADIUS-Primary',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SERVER_IP',
        type: 'ip',
        description: 'Primary RADIUS server IP address',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          pattern: VALIDATION_PATTERNS.IPV4,
          errorMessage: 'Must be a valid IPv4 address'
        }
      },
      {
        name: 'RADIUS_SECRET',
        type: 'password',
        description: 'RADIUS shared secret for authentication',
        required: true,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          minLength: 8,
          errorMessage: 'RADIUS secret must be at least 8 characters'
        }
      },
      {
        name: 'RADIUS_SERVER_NAME_BACKUP',
        type: 'text',
        description: 'Backup RADIUS server identifier',
        required: false,
        defaultValue: 'RADIUS-Backup',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SERVER_IP_BACKUP',
        type: 'ip',
        description: 'Backup RADIUS server IP address',
        required: false,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_SECRET_BACKUP',
        type: 'password',
        description: 'Backup RADIUS shared secret',
        required: false,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_ACCT_SERVER',
        type: 'ip',
        description: 'RADIUS accounting server IP (if different from auth)',
        required: false,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_ACCT_SECRET',
        type: 'password',
        description: 'RADIUS accounting shared secret',
        required: false,
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_AUTH_TYPE',
        type: 'select',
        description: 'RADIUS authentication type',
        required: true,
        defaultValue: 'auto',
        options: ['auto', 'pap', 'chap', 'ms-chap'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'RADIUS_TIMEOUT',
        type: 'number',
        description: 'RADIUS server timeout in seconds',
        required: true,
        defaultValue: 5,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 30
        }
      },
      {
        name: 'RADIUS_GROUP_NAME',
        type: 'text',
        description: 'RADIUS server group name',
        required: true,
        defaultValue: 'RADIUS-Group',
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      
      // VLAN Configuration
      {
        name: 'AUTHORIZED_VLAN_ID',
        type: 'number',
        description: 'VLAN ID for successfully authenticated users',
        required: true,
        defaultValue: 100,
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          min: 1,
          max: 4094,
          errorMessage: 'VLAN ID must be between 1 and 4094'
        }
      },
      {
        name: 'AUTHORIZED_VLAN_DESC',
        type: 'text',
        description: 'Description for authorized users VLAN',
        required: true,
        defaultValue: 'Authorized Users Network',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'GUEST_VLAN_ID',
        type: 'number',
        description: 'VLAN ID for guest access',
        required: true,
        defaultValue: 200,
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          min: 1,
          max: 4094
        }
      },
      {
        name: 'GUEST_VLAN_DESC',
        type: 'text',
        description: 'Description for guest VLAN',
        required: true,
        defaultValue: 'Guest Network Access',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'QUARANTINE_VLAN_ID',
        type: 'number',
        description: 'VLAN ID for quarantine/restricted access',
        required: true,
        defaultValue: 999,
        group: VARIABLE_GROUPS.SECURITY,
        validation: {
          min: 1,
          max: 4094
        }
      },
      {
        name: 'QUARANTINE_VLAN_DESC',
        type: 'text',
        description: 'Description for quarantine VLAN',
        required: true,
        defaultValue: 'Quarantine Network',
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'VOICE_VLAN_ID',
        type: 'number',
        description: 'VLAN ID for voice traffic',
        required: true,
        defaultValue: 300,
        group: VARIABLE_GROUPS.NETWORK,
        validation: {
          min: 1,
          max: 4094
        }
      },
      {
        name: 'VOICE_VLAN_DESC',
        type: 'text',
        description: 'Description for voice VLAN',
        required: true,
        defaultValue: 'Voice Network',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // 802.1X Advanced Settings
      {
        name: 'DOT1X_FAILURE_ACTION',
        type: 'select',
        description: 'Action when 802.1X authentication fails',
        required: true,
        defaultValue: 'restricted-vlan',
        options: ['restricted-vlan', 'guest-vlan', 'drop'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'DOT1X_AUTH_TIMEOUT',
        type: 'number',
        description: '802.1X authentication timeout in seconds',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 300
        }
      },
      {
        name: 'DOT1X_QUIET_PERIOD',
        type: 'number',
        description: 'Quiet period after failed authentication (seconds)',
        required: true,
        defaultValue: 60,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 0,
          max: 65535
        }
      },
      {
        name: 'DOT1X_REAUTH_PERIOD',
        type: 'number',
        description: 'Reauthentication period in seconds (0 = disabled)',
        required: true,
        defaultValue: 3600,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 0,
          max: 65535
        }
      },
      {
        name: 'DOT1X_TX_PERIOD',
        type: 'number',
        description: 'EAP packet transmission period in seconds',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 65535
        }
      },
      {
        name: 'DOT1X_SUPP_TIMEOUT',
        type: 'number',
        description: 'Supplicant timeout in seconds',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 65535
        }
      },
      {
        name: 'DOT1X_MAX_REQ',
        type: 'number',
        description: 'Maximum EAP requests before timeout',
        required: true,
        defaultValue: 2,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 10
        }
      },
      {
        name: 'DOT1X_AUTH_METHOD',
        type: 'select',
        description: '802.1X authentication method',
        required: true,
        defaultValue: 'pae',
        options: ['pae', 'mac', 'multi-auth'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      {
        name: 'DOT1X_FALLBACK_TIMEOUT',
        type: 'number',
        description: 'Fallback timeout for non-802.1X clients (seconds)',
        required: true,
        defaultValue: 3,
        group: VARIABLE_GROUPS.AUTHENTICATION,
        validation: {
          min: 1,
          max: 300
        }
      },
      {
        name: 'MAC_AUTH_ENABLE',
        type: 'select',
        description: 'Enable MAC-based authentication fallback',
        required: true,
        defaultValue: 'enable',
        options: ['enable', 'disable'],
        group: VARIABLE_GROUPS.AUTHENTICATION
      },
      
      // Port Configuration
      {
        name: 'ACCESS_PORT_RANGE',
        type: 'text',
        description: 'Access port range (e.g., port1-port24)',
        required: true,
        defaultValue: 'port1-port24',
        group: VARIABLE_GROUPS.NETWORK,
        placeholder: 'port1-port24 or port1 port3 port5-port10'
      },
      {
        name: 'ACCESS_PORT_DESC',
        type: 'text',
        description: 'Description for access ports',
        required: true,
        defaultValue: 'User Access Port with 802.1X',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_PORT_RANGE',
        type: 'text',
        description: 'Uplink port range (e.g., port25-port28)',
        required: true,
        defaultValue: 'port25-port28',
        group: VARIABLE_GROUPS.NETWORK
      },
      {
        name: 'UPLINK_PORT_DESC',
        type: 'text',
        description: 'Description for uplink ports',
        required: true,
        defaultValue: 'Uplink to Distribution Layer',
        group: VARIABLE_GROUPS.NETWORK
      },
      
      // Security Settings
      {
        name: 'PORT_SECURITY_ENABLE',
        type: 'select',
        description: 'Enable port security',
        required: true,
        defaultValue: 'enable',
        options: ['enable', 'disable'],
        group: VARIABLE_GROUPS.SECURITY
      },
      {
        name: 'PORT_SECURITY_MAX_MAC',
        type: 'number',
        description: 'Maximum MAC addresses per port',
        required: true,
        defaultValue: 8,
        group: VARIABLE_GROUPS.SECURITY,
        validation: {
          min: 1,
          max: 1024
        }
      },
      
      // Storm Control
      {
        name: 'STORM_CONTROL_BROADCAST',
        type: 'number',
        description: 'Broadcast storm control threshold (pps)',
        required: true,
        defaultValue: 1000,
        group: VARIABLE_GROUPS.SECURITY,
        validation: {
          min: 1,
          max: 10000000
        }
      },
      {
        name: 'STORM_CONTROL_UNKNOWN_UNICAST',
        type: 'number',
        description: 'Unknown unicast storm control threshold (pps)',
        required: true,
        defaultValue: 1000,
        group: VARIABLE_GROUPS.SECURITY,
        validation: {
          min: 1,
          max: 10000000
        }
      },
      {
        name: 'STORM_CONTROL_MULTICAST',
        type: 'number',
        description: 'Multicast storm control threshold (pps)',
        required: true,
        defaultValue: 1000,
        group: VARIABLE_GROUPS.SECURITY,
        validation: {
          min: 1,
          max: 10000000
        }
      },
      
      // Management Settings
      {
        name: 'ADMIN_TIMEOUT',
        type: 'number',
        description: 'Administrative session timeout in minutes',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.MANAGEMENT,
        validation: {
          min: 1,
          max: 480
        }
      },
      {
        name: 'SNMP_COMMUNITY',
        type: 'text',
        description: 'SNMP community string',
        required: true,
        defaultValue: 'public',
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
        name: 'SNMP_CONTACT',
        type: 'text',
        description: 'SNMP system contact information',
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
        name: 'SYSLOG_SERVER',
        type: 'ip',
        description: 'Syslog server IP address',
        required: true,
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      {
        name: 'SYSLOG_FACILITY',
        type: 'select',
        description: 'Syslog facility',
        required: true,
        defaultValue: 'local0',
        options: ['kern', 'user', 'mail', 'daemon', 'auth', 'syslog', 'lpr', 'news', 'uucp', 'cron', 'authpriv', 'ftp', 'local0', 'local1', 'local2', 'local3', 'local4', 'local5', 'local6', 'local7'],
        group: VARIABLE_GROUPS.MANAGEMENT
      },
      
      // Advanced Settings
      {
        name: 'STP_REVISION',
        type: 'number',
        description: 'Spanning Tree Protocol revision',
        required: true,
        defaultValue: 0,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 0,
          max: 65535
        }
      },
      {
        name: 'STP_HELLO_TIME',
        type: 'number',
        description: 'STP hello time in seconds',
        required: true,
        defaultValue: 2,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 1,
          max: 10
        }
      },
      {
        name: 'STP_FORWARD_DELAY',
        type: 'number',
        description: 'STP forward delay in seconds',
        required: true,
        defaultValue: 15,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 4,
          max: 30
        }
      },
      {
        name: 'STP_MAX_AGE',
        type: 'number',
        description: 'STP max age in seconds',
        required: true,
        defaultValue: 20,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 6,
          max: 40
        }
      },
      {
        name: 'STP_MAX_HOPS',
        type: 'number',
        description: 'STP maximum hops',
        required: true,
        defaultValue: 20,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 1,
          max: 40
        }
      },
      {
        name: 'LLDP_TX_HOLD',
        type: 'number',
        description: 'LLDP transmit hold multiplier',
        required: true,
        defaultValue: 4,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 2,
          max: 10
        }
      },
      {
        name: 'LLDP_TX_INTERVAL',
        type: 'number',
        description: 'LLDP transmit interval in seconds',
        required: true,
        defaultValue: 30,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 5,
          max: 32768
        }
      },
      {
        name: 'LLDP_FAST_START_INTERVAL',
        type: 'number',
        description: 'LLDP fast start interval in seconds',
        required: true,
        defaultValue: 1,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 1,
          max: 5
        }
      },
      {
        name: 'LOOP_GUARD_TIMEOUT',
        type: 'number',
        description: 'Loop guard timeout in seconds',
        required: true,
        defaultValue: 45,
        group: VARIABLE_GROUPS.ADVANCED,
        validation: {
          min: 1,
          max: 120
        }
      },
      
      // Troubleshooting Settings
      {
        name: 'MIRROR_SESSION_NAME',
        type: 'text',
        description: 'Port mirror session name',
        required: false,
        defaultValue: 'troubleshoot',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MIRROR_ENABLE',
        type: 'select',
        description: 'Enable port mirroring session',
        required: false,
        defaultValue: 'disable',
        options: ['enable', 'disable'],
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MIRROR_DESTINATION_PORT',
        type: 'text',
        description: 'Mirror destination port',
        required: false,
        defaultValue: 'port48',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'MIRROR_SOURCE_PORTS',
        type: 'text',
        description: 'Mirror source ports',
        required: false,
        defaultValue: 'port1-port24',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      },
      {
        name: 'BACKUP_TIMESTAMP',
        type: 'text',
        description: 'Configuration backup timestamp',
        required: false,
        defaultValue: '{{DATE_TIME}}',
        group: VARIABLE_GROUPS.TROUBLESHOOTING
      }
    ],
    tags: ['802.1X', 'RADIUS', 'Authentication', 'Access Control', 'Security', 'Enterprise'],
    use_cases: [
      'Enterprise network access control',
      'BYOD environment security',
      'User-based VLAN assignment',
      'Device authentication',
      'Network compliance requirements',
      'Guest network segregation'
    ],
    requirements: [
      'RADIUS server (Windows NPS, Cisco ISE, FreeRADIUS)',
      'FortiSwitch with appropriate licensing',
      'Certificate Authority for EAP-TLS (optional)',
      'Network management system',
      'Syslog server for logging',
      'NTP server for time synchronization'
    ],
    compatibility_matrix: [
      {
        model: 'FortiSwitch 108E',
        firmware_min: '7.2.0',
        feature_support: [
          { feature: '802.1X', supported: true },
          { feature: 'MAC Authentication', supported: true },
          { feature: 'Dynamic VLAN', supported: true },
          { feature: 'RADIUS Accounting', supported: true }
        ]
      },
      {
        model: 'FortiSwitch 124E',
        firmware_min: '7.2.0',
        feature_support: [
          { feature: '802.1X', supported: true },
          { feature: 'MAC Authentication', supported: true },
          { feature: 'Dynamic VLAN', supported: true },
          { feature: 'RADIUS Accounting', supported: true }
        ]
      },
      {
        model: 'FortiSwitch 148E',
        firmware_min: '7.2.0',
        feature_support: [
          { feature: '802.1X', supported: true },
          { feature: 'MAC Authentication', supported: true },
          { feature: 'Dynamic VLAN', supported: true },
          { feature: 'RADIUS Accounting', supported: true }
        ]
      }
    ],
    troubleshooting: [
      {
        issue: 'Authentication requests timing out',
        symptoms: ['Clients not getting network access', 'RADIUS timeout logs'],
        solution: 'Check network connectivity to RADIUS server and verify shared secret',
        commands: [
          'execute ping {{RADIUS_SERVER_IP}}',
          'get user radius',
          'diagnose test authserver radius {{RADIUS_SERVER_NAME}} {{test_username}} {{test_password}}'
        ],
        priority: 'high',
        common_causes: [
          'Network connectivity issues',
          'Incorrect RADIUS shared secret',
          'RADIUS server service down',
          'Firewall blocking traffic'
        ],
        prevention_tips: [
          'Monitor RADIUS server health',
          'Use backup RADIUS servers',
          'Implement proper firewall rules',
          'Document shared secrets securely'
        ]
      },
      {
        issue: 'Clients assigned to wrong VLAN',
        symptoms: ['Clients cannot access expected resources', 'Incorrect IP addressing'],
        solution: 'Verify RADIUS attributes and VLAN configuration',
        commands: [
          'get switch interface {{ACCESS_PORT_RANGE}}',
          'get switch vlan',
          'diagnose switch-controller dump mac-sync-status'
        ],
        priority: 'medium',
        common_causes: [
          'Incorrect RADIUS VLAN attributes',
          'VLAN not configured on switch',
          'Trunk configuration issues',
          'RADIUS policy misconfiguration'
        ]
      },
      {
        issue: 'MAC authentication not working',
        symptoms: ['Devices without 802.1X supplicant cannot authenticate'],
        solution: 'Verify MAC authentication configuration and RADIUS MAC database',
        commands: [
          'get user radius',
          'diagnose 802.1x status {{port_name}}',
          'get switch interface {{port_name}}'
        ],
        priority: 'medium',
        common_causes: [
          'MAC address not in RADIUS database',
          'Incorrect MAC format in RADIUS',
          'MAC authentication not enabled on port',
          'RADIUS server MAC auth policy issues'
        ]
      }
    ],
    validation_commands: [
      {
        command: 'get system status',
        description: 'Verify system status and connectivity',
        expected_output: 'Status: OK',
        success_criteria: 'System shows healthy status',
        category: 'connectivity'
      },
      {
        command: 'get user radius',
        description: 'Check RADIUS server configuration',
        success_criteria: 'RADIUS servers configured with correct IPs and secrets',
        category: 'authentication'
      },
      {
        command: 'get switch security',
        description: 'Verify 802.1X global settings',
        success_criteria: '802.1X enabled with correct timeout values',
        category: 'authentication'
      },
      {
        command: 'get switch interface {{ACCESS_PORT_RANGE}}',
        description: 'Check port 802.1X configuration',
        success_criteria: '802.1X enabled on access ports with correct settings',
        category: 'configuration'
      },
      {
        command: 'get switch vlan',
        description: 'Verify VLAN configuration',
        success_criteria: 'All required VLANs configured with correct IDs',
        category: 'configuration'
      },
      {
        command: 'execute ping {{RADIUS_SERVER_IP}}',
        description: 'Test connectivity to RADIUS server',
        success_criteria: 'Successful ping responses from RADIUS server',
        category: 'connectivity'
      },
      {
        command: 'diagnose test authserver radius {{RADIUS_SERVER_NAME}} test-user test-password',
        description: 'Test RADIUS authentication',
        success_criteria: 'Authentication test succeeds or provides clear failure reason',
        category: 'authentication'
      }
    ],
    references: [
      {
        title: 'FortiSwitch 802.1X Configuration Guide',
        url: 'https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/110300/802-1x-authentication',
        type: 'documentation',
        vendor_official: true,
        description: 'Official Fortinet documentation for 802.1X configuration'
      },
      {
        title: 'FortiSwitch RADIUS Configuration',
        url: 'https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/296000/radius',
        type: 'documentation',
        vendor_official: true,
        description: 'RADIUS server configuration and troubleshooting'
      },
      {
        title: 'FortiSwitch VLAN Configuration',
        url: 'https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/954635/vlans',
        type: 'documentation',
        vendor_official: true,
        description: 'VLAN configuration and management'
      }
    ],
    created_date: '2024-08-11',
    updated_date: '2024-08-11',
    version: '1.0.0'
  }
];