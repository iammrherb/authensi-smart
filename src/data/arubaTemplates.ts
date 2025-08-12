export interface ArubaTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  vendor: string;
  model: string;
  firmware: string;
  content: string;
  variables: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'ip' | 'password';
    description: string;
    required: boolean;
    defaultValue?: string | number | boolean;
    options?: string[];
    validation?: string;
  }>;
  tags: string[];
  use_cases: string[];
  requirements: string[];
  troubleshooting?: Array<{
    issue: string;
    solution: string;
    commands?: string[];
  }>;
  references?: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'kb' | 'guide';
  }>;
}

export const arubaTemplates: ArubaTemplate[] = [
  // Aruba 2530 Series Templates
  {
    id: 'aruba-2530-dot1x-basic',
    name: 'Aruba 2530 Basic 802.1X Configuration',
    description: 'Basic 802.1X authentication setup for Aruba 2530 series switches',
    category: 'Authentication',
    vendor: 'Aruba',
    model: '2530',
    firmware: 'AOS-S 16.11+',
    content: `! Aruba 2530 Basic 802.1X Configuration
! Configure RADIUS servers
radius-server host {{radius_server_ip}} key {{radius_shared_secret}}
radius-server host {{radius_server_ip}} timeout {{radius_timeout}}
radius-server host {{radius_server_ip}} retransmit {{radius_retransmit}}

! Enable AAA
aaa new-model
aaa port-access authenticator active
aaa port-access authenticator {{port_range}}

! Configure authentication methods
aaa authentication port-access eap-radius
aaa port-access {{port_range}} auth-order authenticator
aaa port-access {{port_range}} auth-priority {{auth_priority}}

! Configure client limit and quiet period
aaa port-access {{port_range}} client-limit {{client_limit}}
aaa port-access {{port_range}} quiet-period {{quiet_period}}
aaa port-access {{port_range}} tx-period {{tx_period}}

! Configure VLANs
vlan {{authorized_vlan}}
   name "Authorized Users"
   untagged {{port_range}}
   exit

vlan {{unauthorized_vlan}}
   name "Unauthorized Users"
   exit

! Configure unauthorized VLAN assignment
aaa port-access {{port_range}} unauth-vid {{unauthorized_vlan}}

! Configure supplicant timeout
aaa port-access {{port_range}} supplicant-timeout {{supplicant_timeout}}

! Enable port access control
aaa port-access {{port_range}} controlled-direction {{controlled_direction}}

! Configure logoff period
aaa port-access {{port_range}} logoff-period {{logoff_period}}

! Show commands for verification
! show port-access authenticator {{port_range}}
! show port-access authenticator statistics {{port_range}}
! show port-access clients`,
    variables: [
      { name: 'radius_server_ip', type: 'ip', description: 'RADIUS server IP address', required: true },
      { name: 'radius_shared_secret', type: 'password', description: 'RADIUS shared secret', required: true },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit attempts', required: true, defaultValue: 3 },
      { name: 'port_range', type: 'text', description: 'Port range for 802.1X', required: true, defaultValue: '1-24' },
      { name: 'auth_priority', type: 'select', description: 'Authentication priority', required: true, defaultValue: 'chap-radius', options: ['chap-radius', 'eap-radius', 'local'] },
      { name: 'client_limit', type: 'number', description: 'Maximum clients per port', required: true, defaultValue: 1 },
      { name: 'quiet_period', type: 'number', description: 'Quiet period in seconds', required: true, defaultValue: 60 },
      { name: 'tx_period', type: 'number', description: 'Transmit period in seconds', required: true, defaultValue: 30 },
      { name: 'authorized_vlan', type: 'number', description: 'Authorized users VLAN', required: true, defaultValue: 100 },
      { name: 'unauthorized_vlan', type: 'number', description: 'Unauthorized users VLAN', required: true, defaultValue: 999 },
      { name: 'supplicant_timeout', type: 'number', description: 'Supplicant timeout in seconds', required: true, defaultValue: 30 },
      { name: 'controlled_direction', type: 'select', description: 'Controlled direction', required: true, defaultValue: 'in', options: ['in', 'both'] },
      { name: 'logoff_period', type: 'number', description: 'Logoff period in seconds', required: true, defaultValue: 300 }
    ],
    tags: ['802.1X', 'Authentication', 'Basic Setup'],
    use_cases: ['Basic Network Access Control', 'Corporate WLAN Authentication', 'User Authentication'],
    requirements: ['RADIUS Server', 'Certificate Infrastructure', 'Client Supplicants'],
    troubleshooting: [
      {
        issue: 'Clients cannot authenticate',
        solution: 'Verify RADIUS server connectivity and shared secret',
        commands: ['show port-access authenticator statistics', 'show radius', 'ping {{radius_server_ip}}']
      },
      {
        issue: 'Clients stuck in unauthorized VLAN',
        solution: 'Check supplicant configuration and certificate validity',
        commands: ['show port-access clients detail', 'show aaa port-access']
      }
    ],
    references: [
      { title: 'Aruba 2530 Access Security Guide', url: 'https://arubanetworking.hpe.com/techdocs/AOS-S/16.11/ASG/', type: 'documentation' }
    ]
  },

  {
    id: 'aruba-2530-mac-auth',
    name: 'Aruba 2530 MAC Authentication',
    description: 'MAC-based authentication for devices without 802.1X supplicant',
    category: 'Authentication',
    vendor: 'Aruba',
    model: '2530',
    firmware: 'AOS-S 16.11+',
    content: `! Aruba 2530 MAC Authentication Configuration
! Configure RADIUS servers for MAC authentication
radius-server host {{radius_server_ip}} key {{radius_shared_secret}}
radius-server host {{radius_server_ip}} timeout {{radius_timeout}}
radius-server host {{radius_server_ip}} retransmit {{radius_retransmit}}

! Enable AAA and MAC authentication
aaa new-model
aaa port-access mac-based active
aaa port-access mac-based {{port_range}}

! Configure authentication methods
aaa authentication port-access chap-radius
aaa port-access {{port_range}} auth-order mac-based
aaa port-access {{port_range}} auth-priority {{auth_priority}}

! Configure MAC authentication settings
aaa port-access {{port_range}} client-limit {{client_limit}}
aaa port-access {{port_range}} quiet-period {{quiet_period}}

! Configure VLANs for different device types
vlan {{iot_vlan}}
   name "IoT Devices"
   exit

vlan {{printer_vlan}}
   name "Printers"
   exit

vlan {{guest_vlan}}
   name "Guest Devices"
   exit

vlan {{quarantine_vlan}}
   name "Quarantine"
   exit

! Configure unauthorized VLAN for unknown devices
aaa port-access {{port_range}} unauth-vid {{quarantine_vlan}}

! Configure MAC format for RADIUS
aaa port-access mac-based addr-format {{mac_format}}

! Configure aging timer for MAC addresses
aaa port-access {{port_range}} reauth-period {{reauth_period}}

! Enable controlled direction
aaa port-access {{port_range}} controlled-direction {{controlled_direction}}

! Configure cached reauthentication
aaa port-access {{port_range}} cached-reauth-period {{cached_reauth_period}}

! Show commands for verification
! show port-access mac-based {{port_range}}
! show port-access mac-based statistics
! show port-access clients`,
    variables: [
      { name: 'radius_server_ip', type: 'ip', description: 'RADIUS server IP address', required: true },
      { name: 'radius_shared_secret', type: 'password', description: 'RADIUS shared secret', required: true },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit attempts', required: true, defaultValue: 3 },
      { name: 'port_range', type: 'text', description: 'Port range for MAC authentication', required: true, defaultValue: '1-24' },
      { name: 'auth_priority', type: 'select', description: 'Authentication priority', required: true, defaultValue: 'chap-radius', options: ['chap-radius', 'local'] },
      { name: 'client_limit', type: 'number', description: 'Maximum clients per port', required: true, defaultValue: 8 },
      { name: 'quiet_period', type: 'number', description: 'Quiet period in seconds', required: true, defaultValue: 300 },
      { name: 'iot_vlan', type: 'number', description: 'IoT devices VLAN', required: true, defaultValue: 200 },
      { name: 'printer_vlan', type: 'number', description: 'Printers VLAN', required: true, defaultValue: 300 },
      { name: 'guest_vlan', type: 'number', description: 'Guest devices VLAN', required: true, defaultValue: 400 },
      { name: 'quarantine_vlan', type: 'number', description: 'Quarantine VLAN', required: true, defaultValue: 999 },
      { name: 'mac_format', type: 'select', description: 'MAC address format for RADIUS', required: true, defaultValue: 'multi-colon', options: ['multi-colon', 'multi-hyphen', 'single-dash', 'no-delimiter'] },
      { name: 'reauth_period', type: 'number', description: 'Reauthentication period in seconds', required: true, defaultValue: 3600 },
      { name: 'controlled_direction', type: 'select', description: 'Controlled direction', required: true, defaultValue: 'in', options: ['in', 'both'] },
      { name: 'cached_reauth_period', type: 'number', description: 'Cached reauthentication period in seconds', required: true, defaultValue: 1800 }
    ],
    tags: ['MAC Authentication', 'Device Authentication', 'IoT'],
    use_cases: ['IoT Device Authentication', 'Printer Authentication', 'Legacy Device Support'],
    requirements: ['RADIUS Server with MAC Database', 'Device MAC Registration', 'VLAN Segmentation'],
    troubleshooting: [
      {
        issue: 'MAC authentication fails',
        solution: 'Verify MAC address format and RADIUS database entries',
        commands: ['show port-access mac-based statistics', 'show port-access clients detail']
      },
      {
        issue: 'Devices in wrong VLAN',
        solution: 'Check RADIUS attribute configuration and VLAN assignments',
        commands: ['show vlan', 'show port-access mac-based addr-table']
      }
    ]
  },

  {
    id: 'aruba-2930f-advanced-dot1x',
    name: 'Aruba 2930F Advanced 802.1X with Dynamic Authorization',
    description: 'Advanced 802.1X configuration with dynamic VLAN assignment and CoA support',
    category: 'Authentication',
    vendor: 'Aruba',
    model: '2930F',
    firmware: 'AOS-S 16.11+',
    content: `! Aruba 2930F Advanced 802.1X Configuration
! Configure multiple RADIUS servers with backup
radius-server host {{primary_radius_ip}} key {{primary_radius_secret}}
radius-server host {{primary_radius_ip}} timeout {{radius_timeout}}
radius-server host {{primary_radius_ip}} retransmit {{radius_retransmit}}
radius-server host {{secondary_radius_ip}} key {{secondary_radius_secret}}
radius-server host {{secondary_radius_ip}} timeout {{radius_timeout}}
radius-server host {{secondary_radius_ip}} retransmit {{radius_retransmit}}

! Configure RADIUS dynamic authorization (CoA)
radius-server host {{primary_radius_ip}} dyn-authorization
radius-server key {{coa_shared_secret}} dyn-authorization

! Enable AAA with advanced features
aaa new-model
aaa port-access authenticator active
aaa port-access mac-based active
aaa port-access {{port_range}}

! Configure authentication order (802.1X first, then MAC)
aaa authentication port-access eap-radius
aaa port-access {{port_range}} auth-order authenticator mac-based
aaa port-access {{port_range}} auth-priority eap-radius

! Configure advanced 802.1X settings
aaa port-access {{port_range}} client-limit {{client_limit}}
aaa port-access {{port_range}} quiet-period {{quiet_period}}
aaa port-access {{port_range}} tx-period {{tx_period}}
aaa port-access {{port_range}} supplicant-timeout {{supplicant_timeout}}
aaa port-access {{port_range}} server-timeout {{server_timeout}}

! Configure reauthentication
aaa port-access {{port_range}} reauth-period {{reauth_period}}
aaa port-access {{port_range}} cached-reauth-period {{cached_reauth_period}}

! Configure multiple VLANs for dynamic assignment
vlan {{employee_vlan}}
   name "Employee Network"
   exit

vlan {{contractor_vlan}}
   name "Contractor Network"
   exit

vlan {{guest_vlan}}
   name "Guest Network"
   exit

vlan {{iot_vlan}}
   name "IoT Devices"
   exit

vlan {{quarantine_vlan}}
   name "Quarantine"
   exit

! Configure unauthorized VLAN
aaa port-access {{port_range}} unauth-vid {{quarantine_vlan}}

! Configure critical VLAN for authentication failures
aaa port-access {{port_range}} critical-vid {{quarantine_vlan}}

! Configure controlled direction and port control
aaa port-access {{port_range}} controlled-direction {{controlled_direction}}
aaa port-access {{port_range}} logoff-period {{logoff_period}}

! Configure MAC authentication bypass settings
aaa port-access mac-based addr-format {{mac_format}}
aaa port-access mac-based addr-limit {{mac_limit}} {{port_range}}

! Configure port security integration
port-security {{port_range}} max {{max_mac_addresses}}
port-security {{port_range}} learn-mode {{learn_mode}}
port-security {{port_range}} action {{security_action}}

! Configure LLDP for device discovery
lldp config {{port_range}} adminStatus tx-rx
lldp config {{port_range}} notification

! Enable loop protection
loop-protect {{port_range}}
loop-protect transmit-interval {{loop_protect_interval}}

! Show commands for monitoring
! show port-access authenticator {{port_range}}
! show port-access mac-based {{port_range}}
! show port-access clients detail
! show radius dynamic-authorization
! show port-security {{port_range}}`,
    variables: [
      { name: 'primary_radius_ip', type: 'ip', description: 'Primary RADIUS server IP', required: true },
      { name: 'primary_radius_secret', type: 'password', description: 'Primary RADIUS shared secret', required: true },
      { name: 'secondary_radius_ip', type: 'ip', description: 'Secondary RADIUS server IP', required: true },
      { name: 'secondary_radius_secret', type: 'password', description: 'Secondary RADIUS shared secret', required: true },
      { name: 'coa_shared_secret', type: 'password', description: 'CoA shared secret', required: true },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit attempts', required: true, defaultValue: 3 },
      { name: 'port_range', type: 'text', description: 'Port range for authentication', required: true, defaultValue: '1-48' },
      { name: 'client_limit', type: 'number', description: 'Maximum clients per port', required: true, defaultValue: 32 },
      { name: 'quiet_period', type: 'number', description: 'Quiet period in seconds', required: true, defaultValue: 60 },
      { name: 'tx_period', type: 'number', description: 'Transmit period in seconds', required: true, defaultValue: 30 },
      { name: 'supplicant_timeout', type: 'number', description: 'Supplicant timeout in seconds', required: true, defaultValue: 30 },
      { name: 'server_timeout', type: 'number', description: 'Server timeout in seconds', required: true, defaultValue: 30 },
      { name: 'reauth_period', type: 'number', description: 'Reauthentication period in seconds', required: true, defaultValue: 3600 },
      { name: 'cached_reauth_period', type: 'number', description: 'Cached reauthentication period in seconds', required: true, defaultValue: 1800 },
      { name: 'employee_vlan', type: 'number', description: 'Employee VLAN', required: true, defaultValue: 100 },
      { name: 'contractor_vlan', type: 'number', description: 'Contractor VLAN', required: true, defaultValue: 200 },
      { name: 'guest_vlan', type: 'number', description: 'Guest VLAN', required: true, defaultValue: 300 },
      { name: 'iot_vlan', type: 'number', description: 'IoT VLAN', required: true, defaultValue: 400 },
      { name: 'quarantine_vlan', type: 'number', description: 'Quarantine VLAN', required: true, defaultValue: 999 },
      { name: 'controlled_direction', type: 'select', description: 'Controlled direction', required: true, defaultValue: 'both', options: ['in', 'both'] },
      { name: 'logoff_period', type: 'number', description: 'Logoff period in seconds', required: true, defaultValue: 300 },
      { name: 'mac_format', type: 'select', description: 'MAC address format', required: true, defaultValue: 'multi-colon', options: ['multi-colon', 'multi-hyphen', 'single-dash', 'no-delimiter'] },
      { name: 'mac_limit', type: 'number', description: 'MAC address limit per port', required: true, defaultValue: 32 },
      { name: 'max_mac_addresses', type: 'number', description: 'Maximum MAC addresses for port security', required: true, defaultValue: 8 },
      { name: 'learn_mode', type: 'select', description: 'Port security learn mode', required: true, defaultValue: 'static', options: ['static', 'dynamic', 'continuous'] },
      { name: 'security_action', type: 'select', description: 'Security violation action', required: true, defaultValue: 'send-disable', options: ['send-disable', 'send-alarm', 'none'] },
      { name: 'loop_protect_interval', type: 'number', description: 'Loop protection interval in seconds', required: true, defaultValue: 5 }
    ],
    tags: ['Advanced 802.1X', 'Dynamic VLAN', 'CoA', 'Multi-auth'],
    use_cases: ['Enterprise Multi-auth Environment', 'Dynamic User Policies', 'BYOD with Device Tracking'],
    requirements: ['Advanced RADIUS Server (ISE)', 'Dynamic Authorization Support', 'Certificate Management'],
    troubleshooting: [
      {
        issue: 'Dynamic VLAN assignment fails',
        solution: 'Verify RADIUS attributes (Tunnel-Type, Tunnel-Medium-Type, Tunnel-Private-Group-Id)',
        commands: ['show port-access clients detail', 'show radius statistics']
      },
      {
        issue: 'CoA disconnect not working',
        solution: 'Check CoA shared secret and firewall rules for UDP 3799',
        commands: ['show radius dynamic-authorization', 'debug radius dynamic-authorization']
      }
    ]
  },

  {
    id: 'aruba-cx-8325-dot1x',
    name: 'Aruba CX 8325 802.1X with ClearPass Integration',
    description: 'Modern 802.1X configuration for Aruba CX switches with ClearPass Policy Manager',
    category: 'Authentication',
    vendor: 'Aruba',
    model: 'CX 8325',
    firmware: 'AOS-CX 10.12+',
    content: `! Aruba CX 8325 802.1X Configuration with ClearPass
! Configure RADIUS servers
radius-server host {{clearpass_primary_ip}} key {{clearpass_shared_secret}}
radius-server host {{clearpass_primary_ip}} timeout {{radius_timeout}}
radius-server host {{clearpass_primary_ip}} retransmit {{radius_retransmit}}
radius-server host {{clearpass_secondary_ip}} key {{clearpass_shared_secret}}
radius-server host {{clearpass_secondary_ip}} timeout {{radius_timeout}}
radius-server host {{clearpass_secondary_ip}} retransmit {{radius_retransmit}}

! Configure RADIUS dynamic authorization
radius-server host {{clearpass_primary_ip}} dyn-authorization port {{coa_port}}
radius-server host {{clearpass_secondary_ip}} dyn-authorization port {{coa_port}}
radius-server key {{coa_shared_secret}} dyn-authorization

! Enable AAA
aaa new-model

! Configure 802.1X authentication
dot1x system-auth-control
dot1x critical eapol

! Configure authentication methods
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! Configure port access control
aaa port-access authenticator active
aaa port-access mac-based active

! Configure VLANs for different user roles
vlan {{corp_vlan}}
   name "Corporate Users"

vlan {{guest_vlan}}
   name "Guest Network"

vlan {{iot_vlan}}
   name "IoT Devices"

vlan {{voice_vlan}}
   name "Voice VLAN"

vlan {{quarantine_vlan}}
   name "Quarantine"

! Configure interface template for access ports
interface range {{interface_range}}
   description "{{interface_description}}"
   no shutdown
   
   ! Basic port configuration
   switchport mode access
   switchport access vlan {{default_vlan}}
   switchport voice vlan {{voice_vlan}}
   
   ! 802.1X configuration
   aaa port-access authenticator
   aaa port-access mac-based
   aaa port-access {{interface_range}} auth-order authenticator mac-based
   aaa port-access {{interface_range}} auth-priority eap-radius
   
   ! Client and timing settings
   aaa port-access {{interface_range}} client-limit {{client_limit}}
   aaa port-access {{interface_range}} quiet-period {{quiet_period}}
   aaa port-access {{interface_range}} tx-period {{tx_period}}
   aaa port-access {{interface_range}} supplicant-timeout {{supplicant_timeout}}
   aaa port-access {{interface_range}} server-timeout {{server_timeout}}
   
   ! Reauthentication settings
   aaa port-access {{interface_range}} reauth-period {{reauth_period}}
   aaa port-access {{interface_range}} cached-reauth-period {{cached_reauth_period}}
   
   ! VLAN assignment for failed authentication
   aaa port-access {{interface_range}} unauth-vid {{quarantine_vlan}}
   aaa port-access {{interface_range}} critical-vid {{quarantine_vlan}}
   
   ! Control settings
   aaa port-access {{interface_range}} controlled-direction {{controlled_direction}}
   aaa port-access {{interface_range}} logoff-period {{logoff_period}}
   
   ! MAC authentication settings
   aaa port-access mac-based addr-format {{mac_format}}
   aaa port-access mac-based addr-limit {{mac_limit}} {{interface_range}}
   
   ! Port security
   port-security {{interface_range}} max {{max_mac_addresses}}
   port-security {{interface_range}} learn-mode {{learn_mode}}
   port-security {{interface_range}} action {{security_action}}
   
   ! Additional features
   spanning-tree {{interface_range}} edge-port bpdu-guard
   lldp config {{interface_range}} adminStatus tx-rx

! Configure DHCP snooping for additional security
dhcp-snooping
dhcp-snooping vlan {{corp_vlan}},{{guest_vlan}},{{iot_vlan}}
dhcp-snooping database file bootflash:dhcp-snooping.db
dhcp-snooping information option
no dhcp-snooping information option allow-untrusted

! Configure trusted interfaces for DHCP snooping
interface range {{uplink_interfaces}}
   dhcp-snooping trust

! Configure dynamic ARP inspection
arp-inspection vlan {{corp_vlan}},{{guest_vlan}},{{iot_vlan}}
arp-inspection validate src-mac dst-mac ip

! Configure IP source guard
ip source-guard

! Show commands for verification
! show dot1x summary
! show port-access authenticator statistics
! show port-access clients
! show radius statistics
! show radius dynamic-authorization
! show dhcp-snooping statistics`,
    variables: [
      { name: 'clearpass_primary_ip', type: 'ip', description: 'ClearPass primary server IP', required: true },
      { name: 'clearpass_secondary_ip', type: 'ip', description: 'ClearPass secondary server IP', required: true },
      { name: 'clearpass_shared_secret', type: 'password', description: 'ClearPass shared secret', required: true },
      { name: 'coa_shared_secret', type: 'password', description: 'CoA shared secret', required: true },
      { name: 'coa_port', type: 'number', description: 'CoA port', required: true, defaultValue: 3799 },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit attempts', required: true, defaultValue: 3 },
      { name: 'corp_vlan', type: 'number', description: 'Corporate users VLAN', required: true, defaultValue: 100 },
      { name: 'guest_vlan', type: 'number', description: 'Guest network VLAN', required: true, defaultValue: 200 },
      { name: 'iot_vlan', type: 'number', description: 'IoT devices VLAN', required: true, defaultValue: 300 },
      { name: 'voice_vlan', type: 'number', description: 'Voice VLAN', required: true, defaultValue: 500 },
      { name: 'quarantine_vlan', type: 'number', description: 'Quarantine VLAN', required: true, defaultValue: 999 },
      { name: 'interface_range', type: 'text', description: 'Interface range for access ports', required: true, defaultValue: '1/1/1-1/1/48' },
      { name: 'interface_description', type: 'text', description: 'Interface description', required: true, defaultValue: 'Access Port with 802.1X' },
      { name: 'default_vlan', type: 'number', description: 'Default access VLAN', required: true, defaultValue: 1 },
      { name: 'client_limit', type: 'number', description: 'Maximum clients per port', required: true, defaultValue: 32 },
      { name: 'quiet_period', type: 'number', description: 'Quiet period in seconds', required: true, defaultValue: 60 },
      { name: 'tx_period', type: 'number', description: 'Transmit period in seconds', required: true, defaultValue: 30 },
      { name: 'supplicant_timeout', type: 'number', description: 'Supplicant timeout in seconds', required: true, defaultValue: 30 },
      { name: 'server_timeout', type: 'number', description: 'Server timeout in seconds', required: true, defaultValue: 30 },
      { name: 'reauth_period', type: 'number', description: 'Reauthentication period in seconds', required: true, defaultValue: 3600 },
      { name: 'cached_reauth_period', type: 'number', description: 'Cached reauthentication period in seconds', required: true, defaultValue: 1800 },
      { name: 'controlled_direction', type: 'select', description: 'Controlled direction', required: true, defaultValue: 'both', options: ['in', 'both'] },
      { name: 'logoff_period', type: 'number', description: 'Logoff period in seconds', required: true, defaultValue: 300 },
      { name: 'mac_format', type: 'select', description: 'MAC address format', required: true, defaultValue: 'multi-colon', options: ['multi-colon', 'multi-hyphen', 'single-dash', 'no-delimiter'] },
      { name: 'mac_limit', type: 'number', description: 'MAC address limit per port', required: true, defaultValue: 32 },
      { name: 'max_mac_addresses', type: 'number', description: 'Maximum MAC addresses for port security', required: true, defaultValue: 8 },
      { name: 'learn_mode', type: 'select', description: 'Port security learn mode', required: true, defaultValue: 'static', options: ['static', 'dynamic', 'continuous'] },
      { name: 'security_action', type: 'select', description: 'Security violation action', required: true, defaultValue: 'send-disable', options: ['send-disable', 'send-alarm', 'none'] },
      { name: 'uplink_interfaces', type: 'text', description: 'Uplink interfaces for DHCP trust', required: true, defaultValue: '1/1/49-1/1/52' }
    ],
    tags: ['ClearPass', 'Modern 802.1X', 'DHCP Snooping', 'ARP Inspection'],
    use_cases: ['Enterprise ClearPass Integration', 'Advanced Security Policies', 'Zero Trust Network'],
    requirements: ['ClearPass Policy Manager', 'Certificate Authority', 'Network Segmentation'],
    troubleshooting: [
      {
        issue: 'ClearPass policy not applying',
        solution: 'Check RADIUS attributes and ClearPass policy configuration',
        commands: ['show port-access clients detail', 'show clearpass policy']
      },
      {
        issue: 'DHCP snooping violations',
        solution: 'Verify trusted interfaces and DHCP server configuration',
        commands: ['show dhcp-snooping statistics', 'show dhcp-snooping database']
      }
    ]
  },

  {
    id: 'aruba-tacacs-management',
    name: 'Aruba TACACS+ Administrative Access',
    description: 'TACACS+ configuration for administrative access control on Aruba switches',
    category: 'Management',
    vendor: 'Aruba',
    model: 'All AOS-S',
    firmware: 'AOS-S 16.11+',
    content: `! Aruba TACACS+ Administrative Access Configuration
! Configure TACACS+ servers
tacacs-server host {{primary_tacacs_ip}} key {{primary_tacacs_secret}}
tacacs-server host {{secondary_tacacs_ip}} key {{secondary_tacacs_secret}}
tacacs-server timeout {{tacacs_timeout}}
tacacs-server deadtime {{deadtime}}

! Enable AAA
aaa new-model

! Configure authentication methods
aaa authentication login default group tacacs+ local
aaa authentication login console group tacacs+ local
aaa authentication enable default group tacacs+ enable

! Configure authorization
aaa authorization commands default group tacacs+ local
aaa authorization exec default group tacacs+ local
aaa authorization config-commands

! Configure accounting
aaa accounting exec default start-stop group tacacs+
aaa accounting commands default start-stop group tacacs+
aaa accounting connection default start-stop group tacacs+

! Configure local fallback users
username {{local_admin}} password {{local_admin_password}} privilege 15
username {{local_operator}} password {{local_operator_password}} privilege 10

! Configure privilege levels
privilege exec level 15 configure
privilege exec level 15 copy running-config startup-config
privilege exec level 15 reload
privilege exec level 15 show running-config
privilege exec level 10 show
privilege exec level 10 ping
privilege exec level 10 traceroute
privilege exec level 5 show version
privilege exec level 5 show system

! Configure console access
line console
   login authentication console
   authorization exec default
   authorization commands default
   accounting exec default
   accounting commands default
   exec-timeout {{console_timeout}}

! Configure VTY (SSH/Telnet) access
line vty 0 15
   login authentication default
   authorization exec default
   authorization commands default
   accounting exec default
   accounting commands default
   transport input {{transport_input}}
   exec-timeout {{vty_timeout}}

! Configure SSH settings
ip ssh version 2
crypto key generate ssh rsa bits {{ssh_key_bits}}
ip ssh timeout {{ssh_timeout}}
ip ssh authentication-retries {{ssh_retries}}

! Configure logging with TACACS+ integration
logging facility {{log_facility}}
logging {{syslog_server}} severity {{log_severity}}
logging source-interface {{log_source_interface}}

! Configure SNMP with authentication integration
snmp-server community {{snmp_ro_community}} operator
snmp-server community {{snmp_rw_community}} manager
snmp-server host {{snmp_server}} community {{snmp_ro_community}}
snmp-server contact "{{snmp_contact}}"
snmp-server location "{{snmp_location}}"

! Time configuration for accurate logging
ntp server {{ntp_primary}}
ntp server {{ntp_secondary}}
time timezone {{timezone}}
time daylight-time-rule {{dst_rule}}

! Show commands for verification
! show tacacs
! show aaa authentication
! show users
! show authorization`,
    variables: [
      { name: 'primary_tacacs_ip', type: 'ip', description: 'Primary TACACS+ server IP', required: true },
      { name: 'primary_tacacs_secret', type: 'password', description: 'Primary TACACS+ shared secret', required: true },
      { name: 'secondary_tacacs_ip', type: 'ip', description: 'Secondary TACACS+ server IP', required: true },
      { name: 'secondary_tacacs_secret', type: 'password', description: 'Secondary TACACS+ shared secret', required: true },
      { name: 'tacacs_timeout', type: 'number', description: 'TACACS+ timeout in seconds', required: true, defaultValue: 5 },
      { name: 'deadtime', type: 'number', description: 'Dead time in minutes', required: true, defaultValue: 5 },
      { name: 'local_admin', type: 'text', description: 'Local admin username', required: true, defaultValue: 'admin' },
      { name: 'local_admin_password', type: 'password', description: 'Local admin password', required: true },
      { name: 'local_operator', type: 'text', description: 'Local operator username', required: true, defaultValue: 'operator' },
      { name: 'local_operator_password', type: 'password', description: 'Local operator password', required: true },
      { name: 'console_timeout', type: 'number', description: 'Console timeout in minutes', required: true, defaultValue: 30 },
      { name: 'vty_timeout', type: 'number', description: 'VTY timeout in minutes', required: true, defaultValue: 15 },
      { name: 'transport_input', type: 'select', description: 'VTY transport input', required: true, defaultValue: 'ssh', options: ['ssh', 'telnet', 'ssh telnet'] },
      { name: 'ssh_key_bits', type: 'select', description: 'SSH key size in bits', required: true, defaultValue: '2048', options: ['1024', '2048', '4096'] },
      { name: 'ssh_timeout', type: 'number', description: 'SSH timeout in seconds', required: true, defaultValue: 120 },
      { name: 'ssh_retries', type: 'number', description: 'SSH authentication retries', required: true, defaultValue: 3 },
      { name: 'log_facility', type: 'select', description: 'Syslog facility', required: true, defaultValue: 'local0', options: ['local0', 'local1', 'local2', 'local3', 'local4', 'local5', 'local6', 'local7'] },
      { name: 'syslog_server', type: 'ip', description: 'Syslog server IP', required: true },
      { name: 'log_severity', type: 'select', description: 'Log severity level', required: true, defaultValue: 'informational', options: ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'informational', 'debug'] },
      { name: 'log_source_interface', type: 'text', description: 'Logging source interface', required: true, defaultValue: 'vlan1' },
      { name: 'snmp_ro_community', type: 'text', description: 'SNMP read-only community', required: true, defaultValue: 'public' },
      { name: 'snmp_rw_community', type: 'text', description: 'SNMP read-write community', required: true, defaultValue: 'private' },
      { name: 'snmp_server', type: 'ip', description: 'SNMP management server IP', required: true },
      { name: 'snmp_contact', type: 'text', description: 'SNMP system contact', required: true, defaultValue: 'Network Admin' },
      { name: 'snmp_location', type: 'text', description: 'SNMP system location', required: true, defaultValue: 'Data Center' },
      { name: 'ntp_primary', type: 'ip', description: 'Primary NTP server IP', required: true },
      { name: 'ntp_secondary', type: 'ip', description: 'Secondary NTP server IP', required: true },
      { name: 'timezone', type: 'text', description: 'Time zone', required: true, defaultValue: 'PST' },
      { name: 'dst_rule', type: 'select', description: 'Daylight saving time rule', required: true, defaultValue: 'US', options: ['US', 'Continental-US-and-Alaska', 'Western-Europe', 'Central-Europe'] }
    ],
    tags: ['TACACS+', 'Administrative Access', 'Command Authorization', 'Audit'],
    use_cases: ['Administrative Access Control', 'Command Authorization', 'Compliance Logging'],
    requirements: ['TACACS+ Server', 'Network Management System', 'Time Synchronization'],
    troubleshooting: [
      {
        issue: 'TACACS+ authentication timeout',
        solution: 'Check network connectivity to TACACS+ server and firewall rules',
        commands: ['ping {{primary_tacacs_ip}}', 'show tacacs statistics', 'test tacacs']
      },
      {
        issue: 'Command authorization fails',
        solution: 'Verify TACACS+ server command sets and user privileges',
        commands: ['show authorization', 'show users detail']
      }
    ]
  }
];

// Export grouped templates for easier access
export const arubaTemplatesByModel = {
  '2530': arubaTemplates.filter(t => t.model === '2530'),
  '2930F': arubaTemplates.filter(t => t.model === '2930F'),
  'CX 8325': arubaTemplates.filter(t => t.model === 'CX 8325'),
  'All AOS-S': arubaTemplates.filter(t => t.model === 'All AOS-S')
};

export const arubaTemplatesByCategory = {
  'Authentication': arubaTemplates.filter(t => t.category === 'Authentication'),
  'Management': arubaTemplates.filter(t => t.category === 'Management')
};

export const arubaTemplatesByUseCase = {
  'Basic Authentication': arubaTemplates.filter(t => t.use_cases.some(uc => uc.includes('Basic'))),
  'Enterprise': arubaTemplates.filter(t => t.use_cases.some(uc => uc.includes('Enterprise'))),
  'IoT': arubaTemplates.filter(t => t.use_cases.some(uc => uc.includes('IoT'))),
  'BYOD': arubaTemplates.filter(t => t.use_cases.some(uc => uc.includes('BYOD'))),
  'Management': arubaTemplates.filter(t => t.use_cases.some(uc => uc.includes('Management') || uc.includes('Administrative')))
};