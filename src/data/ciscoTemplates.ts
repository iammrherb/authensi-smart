export interface CiscoTemplate {
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

export const ciscoTemplates: CiscoTemplate[] = [
  // WLC 9800 Series Templates
  {
    id: 'cisco-wlc-9800-radius-auth',
    name: 'WLC 9800 RADIUS Authentication',
    description: 'Complete RADIUS authentication configuration for Cisco WLC 9800 series',
    category: 'Authentication',
    vendor: 'Cisco',
    model: 'WLC 9800',
    firmware: '17.3+',
    content: `! WLC 9800 RADIUS Authentication Configuration
! Configure RADIUS server
radius server {{radius_server_name}}
 address ipv4 {{radius_server_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}}
 timeout {{radius_timeout}}
 retransmit {{radius_retransmit}}
 key {{radius_shared_secret}}
 automate-tester username {{test_username}} probe-on

! Configure RADIUS group
aaa group server radius {{radius_group_name}}
 server name {{radius_server_name}}
 ip radius source-interface {{source_interface}}

! Configure AAA authentication
aaa authentication login default group {{radius_group_name}} local
aaa authentication enable default group {{radius_group_name}} enable
aaa authorization exec default group {{radius_group_name}} local
aaa accounting exec default start-stop group {{radius_group_name}}
aaa accounting commands 15 default start-stop group {{radius_group_name}}

! Configure wireless RADIUS for 802.1X
wireless aaa policy {{aaa_policy_name}}
 authentication-server group {{radius_group_name}}
 accounting-server group {{radius_group_name}}
 authorization-server group {{radius_group_name}}

! Apply to WLAN
wlan {{wlan_name}} {{wlan_id}} {{ssid_name}}
 client vlan {{client_vlan}}
 security wpa akm 802.1x
 security wpa wpa2 ciphers aes
 aaa-policy {{aaa_policy_name}}
 no shutdown`,
    variables: [
      { name: 'radius_server_name', type: 'text', description: 'RADIUS server name', required: true, defaultValue: 'ISE-Server' },
      { name: 'radius_server_ip', type: 'ip', description: 'RADIUS server IP address', required: true },
      { name: 'radius_auth_port', type: 'number', description: 'RADIUS authentication port', required: true, defaultValue: 1812 },
      { name: 'radius_acct_port', type: 'number', description: 'RADIUS accounting port', required: true, defaultValue: 1813 },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit count', required: true, defaultValue: 3 },
      { name: 'radius_shared_secret', type: 'password', description: 'RADIUS shared secret', required: true },
      { name: 'test_username', type: 'text', description: 'Test username for RADIUS health check', required: true, defaultValue: 'test-user' },
      { name: 'radius_group_name', type: 'text', description: 'RADIUS group name', required: true, defaultValue: 'ISE-GROUP' },
      { name: 'source_interface', type: 'text', description: 'Source interface for RADIUS', required: true, defaultValue: 'Vlan1' },
      { name: 'aaa_policy_name', type: 'text', description: 'AAA policy name', required: true, defaultValue: 'DOT1X-POLICY' },
      { name: 'wlan_name', type: 'text', description: 'WLAN profile name', required: true, defaultValue: 'CORP-WLAN' },
      { name: 'wlan_id', type: 'number', description: 'WLAN ID', required: true, defaultValue: 1 },
      { name: 'ssid_name', type: 'text', description: 'SSID name', required: true, defaultValue: 'CORP-WIFI' },
      { name: 'client_vlan', type: 'text', description: 'Client VLAN', required: true, defaultValue: 'Vlan100' }
    ],
    tags: ['802.1X', 'RADIUS', 'WLC', 'Authentication'],
    use_cases: ['Enterprise Wi-Fi Authentication', 'Secure Wireless Access', 'BYOD'],
    requirements: ['RADIUS Server (ISE/NPS)', 'WLAN Infrastructure', 'Certificates'],
    troubleshooting: [
      {
        issue: 'RADIUS authentication timeout',
        solution: 'Check network connectivity to RADIUS server and verify shared secret',
        commands: ['show radius server-group all', 'test aaa group {{radius_group_name}} username test password test']
      },
      {
        issue: 'Clients cannot authenticate',
        solution: 'Verify AAA policy is applied to WLAN and RADIUS server is responding',
        commands: ['show wireless aaa policy {{aaa_policy_name}}', 'show wlan summary']
      }
    ],
    references: [
      { title: 'WLC 9800 AAA Configuration Guide', url: 'https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/17-3/config-guide/b_wl_17_3_cg.html', type: 'documentation' }
    ]
  },

  {
    id: 'cisco-wlc-9800-tacacs-mgmt',
    name: 'WLC 9800 TACACS+ Management',
    description: 'TACACS+ configuration for WLC 9800 administrative access',
    category: 'Management',
    vendor: 'Cisco',
    model: 'WLC 9800',
    firmware: '17.3+',
    content: `! WLC 9800 TACACS+ Management Configuration
! Configure TACACS+ server
tacacs server {{tacacs_server_name}}
 address ipv4 {{tacacs_server_ip}}
 port {{tacacs_port}}
 timeout {{tacacs_timeout}}
 key {{tacacs_shared_secret}}

! Configure TACACS+ group
aaa group server tacacs+ {{tacacs_group_name}}
 server name {{tacacs_server_name}}
 ip tacacs source-interface {{source_interface}}

! Configure AAA for management access
aaa authentication login default group {{tacacs_group_name}} local
aaa authentication enable default group {{tacacs_group_name}} enable
aaa authorization console
aaa authorization config-commands
aaa authorization exec default group {{tacacs_group_name}} local
aaa authorization commands 0 default group {{tacacs_group_name}} local
aaa authorization commands 1 default group {{tacacs_group_name}} local
aaa authorization commands 15 default group {{tacacs_group_name}} local
aaa accounting exec default start-stop group {{tacacs_group_name}}
aaa accounting commands 0 default start-stop group {{tacacs_group_name}}
aaa accounting commands 1 default start-stop group {{tacacs_group_name}}
aaa accounting commands 15 default start-stop group {{tacacs_group_name}}

! Configure privilege levels
privilege exec level 15 configure terminal
privilege exec level 15 show running-config
privilege exec level 10 show
privilege exec level 5 ping
privilege exec level 5 traceroute

! Line configuration
line console 0
 login authentication default
 authorization exec default
 authorization commands 15 default
 accounting exec default
 accounting commands 15 default

line vty 0 15
 login authentication default
 authorization exec default
 authorization commands 15 default
 accounting exec default
 accounting commands 15 default
 transport input ssh`,
    variables: [
      { name: 'tacacs_server_name', type: 'text', description: 'TACACS+ server name', required: true, defaultValue: 'TACACS-Server' },
      { name: 'tacacs_server_ip', type: 'ip', description: 'TACACS+ server IP address', required: true },
      { name: 'tacacs_port', type: 'number', description: 'TACACS+ port', required: true, defaultValue: 49 },
      { name: 'tacacs_timeout', type: 'number', description: 'TACACS+ timeout in seconds', required: true, defaultValue: 5 },
      { name: 'tacacs_shared_secret', type: 'password', description: 'TACACS+ shared secret', required: true },
      { name: 'tacacs_group_name', type: 'text', description: 'TACACS+ group name', required: true, defaultValue: 'TACACS-GROUP' },
      { name: 'source_interface', type: 'text', description: 'Source interface for TACACS+', required: true, defaultValue: 'Vlan1' }
    ],
    tags: ['TACACS+', 'Management', 'Authorization', 'Accounting'],
    use_cases: ['Administrative Access Control', 'Command Authorization', 'Audit Logging'],
    requirements: ['TACACS+ Server', 'Network Management System', 'Administrative Accounts'],
    troubleshooting: [
      {
        issue: 'TACACS+ authentication fails',
        solution: 'Verify server connectivity and shared secret configuration',
        commands: ['test aaa group {{tacacs_group_name}} username admin password admin123', 'debug tacacs']
      }
    ]
  },

  // Cisco Switch IBNS 2.0 Templates
  {
    id: 'cisco-switch-ibns2-dot1x',
    name: 'Cisco Switch IBNS 2.0 802.1X',
    description: 'Identity-Based Network Services 2.0 configuration for 802.1X authentication',
    category: 'Authentication',
    vendor: 'Cisco',
    model: 'Catalyst 9000',
    firmware: 'IOS-XE 16.12+',
    content: `! Cisco Switch IBNS 2.0 802.1X Configuration
! Enable AAA
aaa new-model

! Configure RADIUS servers
radius server {{radius_server_name}}
 address ipv4 {{radius_server_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}}
 timeout {{radius_timeout}}
 retransmit {{radius_retransmit}}
 key {{radius_shared_secret}}
 automate-tester username {{test_username}} probe-on

! Configure RADIUS group
aaa group server radius {{radius_group_name}}
 server name {{radius_server_name}}
 ip radius source-interface {{source_interface}}

! Configure AAA methods
aaa authentication dot1x default group {{radius_group_name}}
aaa authorization network default group {{radius_group_name}}
aaa accounting dot1x default start-stop group {{radius_group_name}}
aaa accounting update newinfo periodic {{accounting_update_interval}}

! Configure device tracking
device-tracking tracking
device-tracking policy {{device_tracking_policy}}
 no protocol ndp
 no protocol dhcp4
 no protocol dhcp6
 tracking enable

! Configure 802.1X globally
dot1x system-auth-control
dot1x critical eapol

! Configure access session
access-session mac-move deny
access-session attributes filter-list list {{acl_name}}

! Configure policy-map for unauthorized devices
policy-map type control subscriber {{policy_map_name}}
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x retries {{dot1x_retries}} retry-time {{retry_time}} priority 10

 event authentication-failure match-all
  10 class always do-until-failure
   10 authorize
   20 pause reauthentication

 event authentication-success match-all
  10 class always do-until-failure
   10 authorize

! Interface template for access ports
interface range {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 access-session port-control auto
 access-session closed
 access-session host-mode {{host_mode}}
 access-session control-direction {{control_direction}}
 device-tracking attach-policy {{device_tracking_policy}}
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 spanning-tree portfast
 spanning-tree bpduguard enable
 service-policy type control subscriber {{policy_map_name}}`,
    variables: [
      { name: 'radius_server_name', type: 'text', description: 'RADIUS server name', required: true, defaultValue: 'ISE-Server' },
      { name: 'radius_server_ip', type: 'ip', description: 'RADIUS server IP address', required: true },
      { name: 'radius_auth_port', type: 'number', description: 'RADIUS authentication port', required: true, defaultValue: 1812 },
      { name: 'radius_acct_port', type: 'number', description: 'RADIUS accounting port', required: true, defaultValue: 1813 },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit count', required: true, defaultValue: 3 },
      { name: 'radius_shared_secret', type: 'password', description: 'RADIUS shared secret', required: true },
      { name: 'test_username', type: 'text', description: 'Test username for RADIUS health check', required: true, defaultValue: 'test-user' },
      { name: 'radius_group_name', type: 'text', description: 'RADIUS group name', required: true, defaultValue: 'ISE-GROUP' },
      { name: 'source_interface', type: 'text', description: 'Source interface for RADIUS', required: true, defaultValue: 'Vlan1' },
      { name: 'accounting_update_interval', type: 'number', description: 'Accounting update interval (minutes)', required: true, defaultValue: 5 },
      { name: 'device_tracking_policy', type: 'text', description: 'Device tracking policy name', required: true, defaultValue: 'IPDT_POLICY' },
      { name: 'acl_name', type: 'text', description: 'ACL name for filtering', required: true, defaultValue: 'DEFAULT_ACL' },
      { name: 'policy_map_name', type: 'text', description: 'Control policy map name', required: true, defaultValue: 'DOT1X_POLICY' },
      { name: 'dot1x_retries', type: 'number', description: '802.1X authentication retries', required: true, defaultValue: 3 },
      { name: 'retry_time', type: 'number', description: 'Retry time in seconds', required: true, defaultValue: 60 },
      { name: 'interface_range', type: 'text', description: 'Interface range for access ports', required: true, defaultValue: 'GigabitEthernet1/0/1-48' },
      { name: 'interface_description', type: 'text', description: 'Interface description', required: true, defaultValue: 'Access Port with 802.1X' },
      { name: 'default_vlan', type: 'number', description: 'Default access VLAN', required: true, defaultValue: 999 },
      { name: 'host_mode', type: 'select', description: 'Host mode', required: true, defaultValue: 'multi-auth', options: ['single-host', 'multi-host', 'multi-auth', 'multi-domain'] },
      { name: 'control_direction', type: 'select', description: 'Control direction', required: true, defaultValue: 'both', options: ['in', 'both'] },
      { name: 'tx_period', type: 'number', description: 'TX period in seconds', required: true, defaultValue: 10 }
    ],
    tags: ['802.1X', 'IBNS 2.0', 'Authentication', 'Access Control'],
    use_cases: ['Enterprise Network Access Control', 'Device Authentication', 'Dynamic VLAN Assignment'],
    requirements: ['RADIUS Server (ISE/NPS)', 'IBNS 2.0 Compatible Hardware', 'Certificates'],
    troubleshooting: [
      {
        issue: '802.1X authentication fails',
        solution: 'Check RADIUS connectivity and verify policy configuration',
        commands: ['show access-session', 'show authentication sessions', 'debug dot1x all']
      },
      {
        issue: 'Device not getting correct VLAN',
        solution: 'Verify RADIUS attributes and authorization policies',
        commands: ['show access-session interface {{interface}}', 'show device-tracking database']
      }
    ]
  },

  {
    id: 'cisco-switch-mab-fallback',
    name: 'Cisco Switch MAB with 802.1X Fallback',
    description: 'MAC Authentication Bypass with 802.1X fallback configuration',
    category: 'Authentication',
    vendor: 'Cisco',
    model: 'Catalyst 9000',
    firmware: 'IOS-XE 16.12+',
    content: `! MAB with 802.1X Fallback Configuration
! Configure policy-map with MAB fallback
policy-map type control subscriber {{policy_map_name}}
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x retries {{dot1x_retries}} retry-time {{dot1x_retry_time}} priority 10

 event authentication-failure match-first
  5 class DOT1X_FAILED do-until-failure
   10 authenticate using mab priority 20
  10 class always do-until-failure
   10 authorize
   20 pause reauthentication

 event authentication-success match-all
  10 class always do-until-failure
   10 authorize

 event aaa-available match-all
  10 class IN_CRITICAL_AUTH do-until-failure
   10 clear-session
  20 class NOT_IN_CRITICAL_AUTH do-until-failure
   10 resume reauthentication

 event agent-found match-all
  10 class always do-until-failure
   10 terminate mab
   20 authenticate using dot1x retries {{dot1x_retries}} retry-time {{dot1x_retry_time}} priority 10

 event inactivity-timeout match-all
  10 class always do-until-failure
   10 clear-session

 event authentication-timeout match-all
  10 class always do-until-failure
   10 authenticate using mab priority 20

! Configure class-map for authentication status
class-map type control subscriber match-any DOT1X_FAILED
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-any IN_CRITICAL_AUTH
 match activated-service-template {{critical_auth_template}}

class-map type control subscriber match-any NOT_IN_CRITICAL_AUTH
 match not activated-service-template {{critical_auth_template}}

! Configure service template for critical authentication
service-template {{critical_auth_template}}
 vlan {{critical_vlan}}
 description "Critical Authentication VLAN"

! Interface configuration for MAB with 802.1X fallback
interface range {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 access-session port-control auto
 access-session closed
 access-session host-mode {{host_mode}}
 access-session control-direction {{control_direction}}
 mab
 dot1x pae authenticator
 dot1x timeout tx-period {{tx_period}}
 dot1x max-req {{max_req}}
 spanning-tree portfast
 spanning-tree bpduguard enable
 service-policy type control subscriber {{policy_map_name}}`,
    variables: [
      { name: 'policy_map_name', type: 'text', description: 'Control policy map name', required: true, defaultValue: 'MAB_DOT1X_POLICY' },
      { name: 'dot1x_retries', type: 'number', description: '802.1X authentication retries', required: true, defaultValue: 2 },
      { name: 'dot1x_retry_time', type: 'number', description: '802.1X retry time in seconds', required: true, defaultValue: 60 },
      { name: 'critical_auth_template', type: 'text', description: 'Critical authentication template name', required: true, defaultValue: 'CRITICAL_AUTH' },
      { name: 'critical_vlan', type: 'number', description: 'Critical authentication VLAN', required: true, defaultValue: 998 },
      { name: 'interface_range', type: 'text', description: 'Interface range for access ports', required: true, defaultValue: 'GigabitEthernet1/0/1-48' },
      { name: 'interface_description', type: 'text', description: 'Interface description', required: true, defaultValue: 'Access Port with MAB/802.1X' },
      { name: 'default_vlan', type: 'number', description: 'Default access VLAN', required: true, defaultValue: 999 },
      { name: 'host_mode', type: 'select', description: 'Host mode', required: true, defaultValue: 'multi-auth', options: ['single-host', 'multi-host', 'multi-auth', 'multi-domain'] },
      { name: 'control_direction', type: 'select', description: 'Control direction', required: true, defaultValue: 'both', options: ['in', 'both'] },
      { name: 'tx_period', type: 'number', description: 'TX period in seconds', required: true, defaultValue: 10 },
      { name: 'max_req', type: 'number', description: 'Maximum 802.1X requests', required: true, defaultValue: 2 }
    ],
    tags: ['MAB', '802.1X', 'Fallback', 'Authentication'],
    use_cases: ['Mixed Device Environment', 'IoT Device Authentication', 'BYOD with Legacy Devices'],
    requirements: ['RADIUS Server with MAC Database', 'Device Registration Process', 'VLAN Segmentation'],
    troubleshooting: [
      {
        issue: 'MAB authentication loops',
        solution: 'Check MAC address format and RADIUS server MAC database',
        commands: ['show access-session interface {{interface}} details', 'show mab interface {{interface}}']
      }
    ]
  },

  // Legacy IOS Templates
  {
    id: 'cisco-ios-legacy-dot1x',
    name: 'Legacy IOS 802.1X Configuration',
    description: 'Traditional 802.1X configuration for legacy Cisco IOS switches',
    category: 'Authentication',
    vendor: 'Cisco',
    model: 'Catalyst 2960/3560/3750',
    firmware: 'IOS 15.2+',
    content: `! Legacy IOS 802.1X Configuration
! Enable AAA
aaa new-model

! Configure RADIUS servers
radius-server host {{radius_server_ip}} auth-port {{radius_auth_port}} acct-port {{radius_acct_port}} key {{radius_shared_secret}}
radius-server timeout {{radius_timeout}}
radius-server retransmit {{radius_retransmit}}
radius-server dead-criteria time {{dead_time}} tries {{dead_tries}}

! Configure AAA methods
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! Global 802.1X configuration
dot1x system-auth-control
dot1x critical eapol
dot1x critical recovery delay {{critical_recovery_delay}}

! Configure guest VLAN and restricted VLAN
vlan {{guest_vlan}}
 name Guest_VLAN

vlan {{restricted_vlan}}
 name Restricted_VLAN

vlan {{voice_vlan}}
 name Voice_VLAN

! Interface configuration
interface range {{interface_range}}
 description {{interface_description}}
 switchport mode access
 switchport access vlan {{default_vlan}}
 switchport voice vlan {{voice_vlan}}
 dot1x port-control auto
 dot1x host-mode {{host_mode}}
 dot1x timeout tx-period {{tx_period}}
 dot1x timeout supp-timeout {{supp_timeout}}
 dot1x max-req {{max_req}}
 dot1x guest-vlan {{guest_vlan}}
 dot1x auth-fail vlan {{restricted_vlan}}
 dot1x reauthentication
 dot1x timeout reauth-period {{reauth_period}}
 spanning-tree portfast
 spanning-tree bpduguard enable

! Configure critical authentication (local fallback)
username {{local_user}} password {{local_password}}
username {{local_user}} privilege 15

! Configure VLAN ACLs for guest access
ip access-list extended GUEST_ACL
 permit udp any any eq domain
 permit tcp any any eq domain
 permit udp any any eq bootpc
 permit udp any any eq bootps
 permit tcp any host {{dhcp_server}} eq 80
 permit tcp any host {{dhcp_server}} eq 443
 deny ip any any

vlan access-map GUEST_MAP 10
 match ip address GUEST_ACL
 action forward

vlan filter GUEST_MAP vlan-list {{guest_vlan}}`,
    variables: [
      { name: 'radius_server_ip', type: 'ip', description: 'RADIUS server IP address', required: true },
      { name: 'radius_auth_port', type: 'number', description: 'RADIUS authentication port', required: true, defaultValue: 1812 },
      { name: 'radius_acct_port', type: 'number', description: 'RADIUS accounting port', required: true, defaultValue: 1813 },
      { name: 'radius_shared_secret', type: 'password', description: 'RADIUS shared secret', required: true },
      { name: 'radius_timeout', type: 'number', description: 'RADIUS timeout in seconds', required: true, defaultValue: 5 },
      { name: 'radius_retransmit', type: 'number', description: 'RADIUS retransmit count', required: true, defaultValue: 3 },
      { name: 'dead_time', type: 'number', description: 'RADIUS dead time in minutes', required: true, defaultValue: 5 },
      { name: 'dead_tries', type: 'number', description: 'RADIUS dead criteria tries', required: true, defaultValue: 3 },
      { name: 'critical_recovery_delay', type: 'number', description: 'Critical recovery delay in seconds', required: true, defaultValue: 1000 },
      { name: 'guest_vlan', type: 'number', description: 'Guest VLAN ID', required: true, defaultValue: 100 },
      { name: 'restricted_vlan', type: 'number', description: 'Restricted VLAN ID', required: true, defaultValue: 101 },
      { name: 'voice_vlan', type: 'number', description: 'Voice VLAN ID', required: true, defaultValue: 200 },
      { name: 'interface_range', type: 'text', description: 'Interface range for access ports', required: true, defaultValue: 'FastEthernet0/1-48' },
      { name: 'interface_description', type: 'text', description: 'Interface description', required: true, defaultValue: 'Access Port with 802.1X' },
      { name: 'default_vlan', type: 'number', description: 'Default access VLAN', required: true, defaultValue: 10 },
      { name: 'host_mode', type: 'select', description: 'Host mode', required: true, defaultValue: 'single-host', options: ['single-host', 'multi-host'] },
      { name: 'tx_period', type: 'number', description: 'TX period in seconds', required: true, defaultValue: 30 },
      { name: 'supp_timeout', type: 'number', description: 'Supplicant timeout in seconds', required: true, defaultValue: 30 },
      { name: 'max_req', type: 'number', description: 'Maximum 802.1X requests', required: true, defaultValue: 2 },
      { name: 'reauth_period', type: 'number', description: 'Reauthentication period in seconds', required: true, defaultValue: 3600 },
      { name: 'local_user', type: 'text', description: 'Local fallback username', required: true, defaultValue: 'admin' },
      { name: 'local_password', type: 'password', description: 'Local fallback password', required: true },
      { name: 'dhcp_server', type: 'ip', description: 'DHCP server IP for guest access', required: true }
    ],
    tags: ['Legacy IOS', '802.1X', 'Guest VLAN', 'Voice VLAN'],
    use_cases: ['Legacy Switch Upgrade', 'Basic 802.1X Implementation', 'Mixed Environment'],
    requirements: ['RADIUS Server', 'VLAN Infrastructure', 'Voice System Integration'],
    troubleshooting: [
      {
        issue: 'Devices stuck in guest VLAN',
        solution: 'Check supplicant configuration and RADIUS server policies',
        commands: ['show dot1x interface {{interface}}', 'debug dot1x events']
      },
      {
        issue: 'Voice devices not working',
        solution: 'Verify voice VLAN configuration and CDP/LLDP settings',
        commands: ['show interfaces switchport', 'show cdp neighbors']
      }
    ]
  },

  // TACACS+ Templates
  {
    id: 'cisco-tacacs-full-authorization',
    name: 'Cisco TACACS+ Full Authorization',
    description: 'Complete TACACS+ configuration with command authorization and accounting',
    category: 'Management',
    vendor: 'Cisco',
    model: 'All IOS/IOS-XE',
    firmware: 'IOS 15.0+',
    content: `! Complete TACACS+ Configuration with Full Authorization
! Configure TACACS+ servers
tacacs-server host {{primary_tacacs_ip}} key {{primary_tacacs_key}}
tacacs-server host {{secondary_tacacs_ip}} key {{secondary_tacacs_key}}
tacacs-server timeout {{tacacs_timeout}}
tacacs-server directed-request

! Configure AAA methods
aaa new-model
aaa authentication login default group tacacs+ local
aaa authentication login CONSOLE local
aaa authentication enable default group tacacs+ enable
aaa authorization console
aaa authorization config-commands
aaa authorization exec default group tacacs+ local
aaa authorization commands 0 default group tacacs+ local
aaa authorization commands 1 default group tacacs+ local
aaa authorization commands 15 default group tacacs+ local
aaa accounting exec default start-stop group tacacs+
aaa accounting commands 0 default start-stop group tacacs+
aaa accounting commands 1 default start-stop group tacacs+
aaa accounting commands 15 default start-stop group tacacs+
aaa accounting connection default start-stop group tacacs+

! Configure privilege levels
privilege exec level 15 configure terminal
privilege exec level 15 show running-config
privilege exec level 15 copy running-config startup-config
privilege exec level 15 reload
privilege exec level 10 show
privilege exec level 10 ping
privilege exec level 10 traceroute
privilege exec level 5 show version
privilege exec level 5 show inventory

! Configure usernames for local fallback
username {{local_admin_user}} privilege 15 secret {{local_admin_password}}
username {{local_operator_user}} privilege 10 secret {{local_operator_password}}

! Enable service timestamps and logging
service timestamps debug datetime msec localtime show-timezone
service timestamps log datetime msec localtime show-timezone
logging buffered {{log_buffer_size}}
logging console warnings
logging monitor warnings
logging trap informational
logging source-interface {{logging_source_interface}}
logging host {{syslog_server}}

! Console line configuration
line console 0
 login authentication CONSOLE
 privilege level 15
 logging synchronous
 exec-timeout {{console_timeout}}

! VTY line configuration
line vty 0 {{vty_lines}}
 login authentication default
 authorization exec default
 authorization commands 0 default
 authorization commands 1 default
 authorization commands 15 default
 accounting exec default
 accounting commands 0 default
 accounting commands 1 default
 accounting commands 15 default
 transport input ssh
 exec-timeout {{vty_timeout}}

! SSH configuration
ip domain-name {{domain_name}}
crypto key generate rsa modulus {{ssh_key_size}}
ip ssh version 2
ip ssh time-out {{ssh_timeout}}
ip ssh authentication-retries {{ssh_retries}}

! SNMP configuration with TACACS+ integration
snmp-server group {{snmp_group}} v3 auth read {{snmp_read_view}} write {{snmp_write_view}}
snmp-server user {{snmp_user}} {{snmp_group}} v3 auth sha {{snmp_auth_key}} priv aes 128 {{snmp_priv_key}}
snmp-server view {{snmp_read_view}} internet included
snmp-server view {{snmp_write_view}} internet included`,
    variables: [
      { name: 'primary_tacacs_ip', type: 'ip', description: 'Primary TACACS+ server IP', required: true },
      { name: 'primary_tacacs_key', type: 'password', description: 'Primary TACACS+ shared secret', required: true },
      { name: 'secondary_tacacs_ip', type: 'ip', description: 'Secondary TACACS+ server IP', required: true },
      { name: 'secondary_tacacs_key', type: 'password', description: 'Secondary TACACS+ shared secret', required: true },
      { name: 'tacacs_timeout', type: 'number', description: 'TACACS+ timeout in seconds', required: true, defaultValue: 5 },
      { name: 'local_admin_user', type: 'text', description: 'Local admin username', required: true, defaultValue: 'admin' },
      { name: 'local_admin_password', type: 'password', description: 'Local admin password', required: true },
      { name: 'local_operator_user', type: 'text', description: 'Local operator username', required: true, defaultValue: 'operator' },
      { name: 'local_operator_password', type: 'password', description: 'Local operator password', required: true },
      { name: 'log_buffer_size', type: 'number', description: 'Log buffer size', required: true, defaultValue: 16384 },
      { name: 'logging_source_interface', type: 'text', description: 'Logging source interface', required: true, defaultValue: 'Loopback0' },
      { name: 'syslog_server', type: 'ip', description: 'Syslog server IP', required: true },
      { name: 'console_timeout', type: 'number', description: 'Console timeout in minutes', required: true, defaultValue: 30 },
      { name: 'vty_lines', type: 'number', description: 'Number of VTY lines', required: true, defaultValue: 15 },
      { name: 'vty_timeout', type: 'number', description: 'VTY timeout in minutes', required: true, defaultValue: 15 },
      { name: 'domain_name', type: 'text', description: 'Domain name for SSH', required: true, defaultValue: 'company.local' },
      { name: 'ssh_key_size', type: 'select', description: 'SSH key size', required: true, defaultValue: '2048', options: ['1024', '2048', '4096'] },
      { name: 'ssh_timeout', type: 'number', description: 'SSH timeout in seconds', required: true, defaultValue: 120 },
      { name: 'ssh_retries', type: 'number', description: 'SSH authentication retries', required: true, defaultValue: 3 },
      { name: 'snmp_group', type: 'text', description: 'SNMP group name', required: true, defaultValue: 'NETWORK_ADMIN' },
      { name: 'snmp_user', type: 'text', description: 'SNMP user name', required: true, defaultValue: 'snmp-admin' },
      { name: 'snmp_read_view', type: 'text', description: 'SNMP read view', required: true, defaultValue: 'READ_VIEW' },
      { name: 'snmp_write_view', type: 'text', description: 'SNMP write view', required: true, defaultValue: 'WRITE_VIEW' },
      { name: 'snmp_auth_key', type: 'password', description: 'SNMP authentication key', required: true },
      { name: 'snmp_priv_key', type: 'password', description: 'SNMP privacy key', required: true }
    ],
    tags: ['TACACS+', 'Full Authorization', 'Command Accounting', 'Security'],
    use_cases: ['Enterprise Security', 'Compliance Requirements', 'Audit Logging'],
    requirements: ['TACACS+ Server (ISE/ACS)', 'Certificate Management', 'Syslog Server'],
    troubleshooting: [
      {
        issue: 'Command authorization fails',
        solution: 'Check TACACS+ server policies and command sets',
        commands: ['debug tacacs', 'test aaa group tacacs+ admin cisco123 legacy']
      },
      {
        issue: 'Local fallback not working',
        solution: 'Verify local usernames and AAA method lists',
        commands: ['show running-config | include username', 'show aaa method-lists']
      }
    ]
  }
];

// Export grouped templates for easier access
export const ciscoTemplatesByCategory = {
  'WLC 9800': ciscoTemplates.filter(t => t.model === 'WLC 9800'),
  'Catalyst 9000': ciscoTemplates.filter(t => t.model === 'Catalyst 9000'),
  'Legacy IOS': ciscoTemplates.filter(t => t.model.includes('Catalyst 2960') || t.model.includes('Catalyst 3560') || t.model.includes('Catalyst 3750')),
  'TACACS+': ciscoTemplates.filter(t => t.category === 'Management' && t.content.includes('tacacs')),
  'RADIUS': ciscoTemplates.filter(t => t.content.includes('radius') && !t.content.includes('tacacs'))
};

export const ciscoTemplatesByUseCase = {
  'Enterprise Authentication': ciscoTemplates.filter(t => t.use_cases.some(uc => uc.includes('Enterprise'))),
  'BYOD': ciscoTemplates.filter(t => t.use_cases.some(uc => uc.includes('BYOD'))),
  'IoT Devices': ciscoTemplates.filter(t => t.use_cases.some(uc => uc.includes('IoT'))),
  'Management Access': ciscoTemplates.filter(t => t.category === 'Management'),
  'Network Access Control': ciscoTemplates.filter(t => t.use_cases.some(uc => uc.includes('Access Control')))
};