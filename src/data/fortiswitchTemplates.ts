// FortiSwitch Configuration Templates based on Fortinet documentation
// https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/110300/802-1x-authentication

export const fortiswitchConfigTemplates = [
  {
    name: "FortiSwitch 802.1X with RADIUS - Basic",
    description: "Basic 802.1X authentication with RADIUS server for FortiSwitch",
    category: "Access Control",
    subcategory: "802.1X Authentication",
    vendor_id: "fortinet",
    model_compatibility: ["FortiSwitch 108E", "FortiSwitch 124E", "FortiSwitch 148E", "FortiSwitch 224D", "FortiSwitch 248D"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8"],
    configuration_type: "CLI",
    complexity_level: "intermediate",
    template_content: `! FortiSwitch 802.1X Basic Configuration
! Authentication with RADIUS Server
config system global
    set hostname "{{SWITCH_HOSTNAME}}"
end

! Configure RADIUS server
config user radius
    edit "radius-server"
        set server "{{RADIUS_SERVER_IP}}"
        set secret "{{RADIUS_SECRET}}"
        set auth-type auto
        set source-ip "{{SWITCH_MGMT_IP}}"
    next
end

! Configure 802.1X global settings  
config switch security
    set dot1x-enable enable
    set dot1x-failure-action restricted-vlan
    set dot1x-restricted-vlan {{RESTRICTED_VLAN_ID}}
    set dot1x-guest-vlan {{GUEST_VLAN_ID}}
    set dot1x-auth-timeout 30
    set dot1x-quiet-period 60
end

! Configure interface for 802.1X
config switch interface
    edit "{{INTERFACE_NAME}}"
        set dot1x enable
        set dot1x-auth-type pae
        set dot1x-radius-server "radius-server"
    next
end

! Configure VLANs
config switch vlan
    edit {{AUTHORIZED_VLAN_ID}}
        set description "Authorized Users VLAN"
    next
    edit {{RESTRICTED_VLAN_ID}}
        set description "Restricted Access VLAN"
    next
    edit {{GUEST_VLAN_ID}}
        set description "Guest Access VLAN"
    next
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the FortiSwitch",
        default: "FortiSwitch-01",
        required: true
      },
      RADIUS_SERVER_IP: {
        type: "ip",
        description: "IP address of the RADIUS server",
        required: true
      },
      RADIUS_SECRET: {
        type: "password",
        description: "Shared secret for RADIUS authentication",
        required: true
      },
      SWITCH_MGMT_IP: {
        type: "ip",
        description: "Management IP of the FortiSwitch",
        required: true
      },
      INTERFACE_NAME: {
        type: "string",
        description: "Interface name to configure (e.g., port1, port2)",
        default: "port1",
        required: true
      },
      AUTHORIZED_VLAN_ID: {
        type: "number",
        description: "VLAN ID for authorized users",
        default: 100,
        required: true
      },
      RESTRICTED_VLAN_ID: {
        type: "number", 
        description: "VLAN ID for restricted access",
        default: 200,
        required: true
      },
      GUEST_VLAN_ID: {
        type: "number",
        description: "VLAN ID for guest access",
        default: 300,
        required: true
      }
    },
    supported_scenarios: ["Corporate Network", "Campus Network", "Branch Office"],
    authentication_methods: ["802.1X", "RADIUS"],
    portnox_integration: {
      compatible: true,
      integration_level: "native",
      features: ["Dynamic VLAN Assignment", "User Authentication", "Device Authorization"]
    },
    security_features: ["802.1X Authentication", "Dynamic VLAN Assignment", "Guest Network Isolation"],
    best_practices: [
      "Use strong RADIUS shared secrets",
      "Configure appropriate timeout values", 
      "Implement fallback VLANs for authentication failures",
      "Monitor authentication logs regularly"
    ],
    troubleshooting_guide: [
      "Check RADIUS server connectivity",
      "Verify shared secret configuration",
      "Review 802.1X timeout settings",
      "Validate VLAN configurations"
    ]
  },
  {
    name: "FortiSwitch Multi-Auth with MAB Fallback",
    description: "Multi-authentication mode with MAC Authentication Bypass (MAB) fallback",
    category: "Access Control",
    subcategory: "Multi-Auth",
    vendor_id: "fortinet",
    model_compatibility: ["FortiSwitch 224D", "FortiSwitch 248D", "FortiSwitch 424D", "FortiSwitch 448D"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10"],
    configuration_type: "CLI",
    complexity_level: "advanced",
    template_content: `! FortiSwitch Multi-Auth with MAB Configuration
! Supports multiple authentication methods with fallback

config system global
    set hostname "{{SWITCH_HOSTNAME}}"
end

! Configure RADIUS servers
config user radius
    edit "primary-radius"
        set server "{{PRIMARY_RADIUS_IP}}"
        set secret "{{RADIUS_SECRET}}"
        set auth-type auto
        set source-ip "{{SWITCH_MGMT_IP}}"
    next
    edit "secondary-radius"
        set server "{{SECONDARY_RADIUS_IP}}"
        set secret "{{RADIUS_SECRET}}"
        set auth-type auto
        set source-ip "{{SWITCH_MGMT_IP}}"
    next
end

! Configure 802.1X with Multi-Auth
config switch security
    set dot1x-enable enable
    set dot1x-failure-action restricted-vlan
    set dot1x-restricted-vlan {{RESTRICTED_VLAN_ID}}
    set dot1x-guest-vlan {{GUEST_VLAN_ID}}
    set dot1x-auth-timeout 30
    set dot1x-quiet-period 60
    set dot1x-max-reauth-req 3
    set mab-enable enable
    set mab-reauth enable
end

! Configure interface for Multi-Auth
config switch interface
    edit "{{INTERFACE_NAME}}"
        set dot1x enable
        set dot1x-auth-type multi-auth
        set dot1x-radius-server "primary-radius"
        set dot1x-fallback-radius "secondary-radius" 
        set mab enable
        set mab-radius-server "primary-radius"
        set max-hosts {{MAX_HOSTS_PER_PORT}}
    next
end

! Configure dynamic VLAN assignment
config switch vlan
    edit {{CORPORATE_VLAN_ID}}
        set description "Corporate Users VLAN"
    next
    edit {{IOT_VLAN_ID}}
        set description "IoT Devices VLAN"
    next
    edit {{GUEST_VLAN_ID}}
        set description "Guest Access VLAN"
    next
    edit {{RESTRICTED_VLAN_ID}}
        set description "Restricted Access VLAN"
    next
end

! Configure MAC address database for MAB
config switch mac-address-table
    edit "{{APPROVED_MAC_1}}"
        set vlan {{CORPORATE_VLAN_ID}}
        set description "Approved Corporate Device"
    next
    edit "{{APPROVED_MAC_2}}"
        set vlan {{IOT_VLAN_ID}}
        set description "Approved IoT Device"
    next
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the FortiSwitch",
        default: "FortiSwitch-MultiAuth",
        required: true
      },
      PRIMARY_RADIUS_IP: {
        type: "ip",
        description: "Primary RADIUS server IP address",
        required: true
      },
      SECONDARY_RADIUS_IP: {
        type: "ip", 
        description: "Secondary RADIUS server IP address",
        required: true
      },
      RADIUS_SECRET: {
        type: "password",
        description: "Shared secret for RADIUS authentication",
        required: true
      },
      SWITCH_MGMT_IP: {
        type: "ip",
        description: "Management IP of the FortiSwitch",
        required: true
      },
      INTERFACE_NAME: {
        type: "string",
        description: "Interface name to configure",
        default: "port1-24",
        required: true
      },
      MAX_HOSTS_PER_PORT: {
        type: "number",
        description: "Maximum hosts allowed per port",
        default: 5,
        required: true
      },
      CORPORATE_VLAN_ID: {
        type: "number",
        description: "VLAN ID for corporate users",
        default: 100,
        required: true
      },
      IOT_VLAN_ID: {
        type: "number",
        description: "VLAN ID for IoT devices",
        default: 150,
        required: true
      },
      GUEST_VLAN_ID: {
        type: "number",
        description: "VLAN ID for guest access",
        default: 300,
        required: true
      },
      RESTRICTED_VLAN_ID: {
        type: "number",
        description: "VLAN ID for restricted access",
        default: 200,
        required: true
      },
      APPROVED_MAC_1: {
        type: "mac",
        description: "MAC address of approved device 1",
        required: false
      },
      APPROVED_MAC_2: {
        type: "mac",
        description: "MAC address of approved device 2", 
        required: false
      }
    },
    supported_scenarios: ["Enterprise Network", "Campus Network", "Healthcare", "Manufacturing"],
    authentication_methods: ["802.1X", "MAB", "Multi-Auth"],
    portnox_integration: {
      compatible: true,
      integration_level: "native",
      features: ["Dynamic VLAN Assignment", "Multi-Host Authentication", "Device Profiling", "Policy Enforcement"]
    },
    security_features: ["Multi-Authentication", "MAC Authentication Bypass", "Dynamic VLAN Assignment", "Host Limiting"],
    best_practices: [
      "Configure redundant RADIUS servers",
      "Set appropriate host limits per port",
      "Implement proper VLAN segmentation",
      "Regular MAC address database maintenance"
    ]
  },
  {
    name: "FortiSwitch FortiLink Integration with FortiGate",
    description: "FortiSwitch integration with FortiGate for Security Fabric",
    category: "Integration",
    subcategory: "FortiLink",
    vendor_id: "fortinet",
    model_compatibility: ["All FortiSwitch Models"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8"],
    configuration_type: "CLI",
    complexity_level: "advanced",
    template_content: `! FortiSwitch FortiLink Configuration
! Integration with FortiGate Security Fabric

config system global
    set hostname "{{SWITCH_HOSTNAME}}"
end

! Configure FortiLink interface
config switch interface
    edit "{{FORTILINK_INTERFACE}}"
        set description "FortiLink to FortiGate"
        set fortilink enable
        set auto-auth-extension-device enable
    next
end

! Configure management access
config switch system admin
    edit "admin"
        set accprofile "super_admin"
        set vdom "root"
        set password "{{ADMIN_PASSWORD}}"
    next
end

! Configure SNMP for monitoring
config switch snmp system
    set status enable
    set description "{{SWITCH_DESCRIPTION}}"
    set contact-info "{{CONTACT_INFO}}"
    set location "{{LOCATION}}"
end

config switch snmp community
    edit "public"
        set status enable
        set query-v1-status enable
        set query-v2c-status enable
        set trap-v1-status enable
        set trap-v2c-status enable
        set hosts {{SNMP_HOST_IP}}
    next
end

! Configure syslog
config switch log syslogd setting
    set status enable
    set server "{{SYSLOG_SERVER}}"
    set port {{SYSLOG_PORT}}
    set format default
end

! Configure NTP
config switch system ntp
    set ntpsync enable
    set server-mode enable
    set syncinterval 60
end

config switch system ntp server
    edit "{{NTP_SERVER}}"
        set server "{{NTP_SERVER}}"
    next
end

! Configure VLANs for network segmentation
config switch vlan
    edit {{MGMT_VLAN_ID}}
        set description "Management VLAN"
    next
    edit {{USER_VLAN_ID}}
        set description "User VLAN"
    next
    edit {{SERVER_VLAN_ID}}
        set description "Server VLAN"
    next
    edit {{IOT_VLAN_ID}}
        set description "IoT VLAN"
    next
end

! Configure trunk interfaces
config switch interface
    edit "{{TRUNK_INTERFACE}}"
        set type trunk
        set allowed-vlans {{MGMT_VLAN_ID}},{{USER_VLAN_ID}},{{SERVER_VLAN_ID}},{{IOT_VLAN_ID}}
        set native-vlan {{MGMT_VLAN_ID}}
    next
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the FortiSwitch",
        default: "FortiSwitch-Fabric",
        required: true
      },
      FORTILINK_INTERFACE: {
        type: "string",
        description: "FortiLink interface name",
        default: "fortilink",
        required: true
      },
      ADMIN_PASSWORD: {
        type: "password",
        description: "Administrator password",
        required: true
      },
      SWITCH_DESCRIPTION: {
        type: "string",
        description: "SNMP system description",
        default: "FortiSwitch Security Fabric Member",
        required: true
      },
      CONTACT_INFO: {
        type: "string",
        description: "Contact information",
        default: "admin@company.com",
        required: true
      },
      LOCATION: {
        type: "string",
        description: "Physical location",
        required: true
      },
      SNMP_HOST_IP: {
        type: "ip",
        description: "SNMP management host IP",
        required: true
      },
      SYSLOG_SERVER: {
        type: "ip",
        description: "Syslog server IP address",
        required: true
      },
      SYSLOG_PORT: {
        type: "number",
        description: "Syslog server port",
        default: 514,
        required: true
      },
      NTP_SERVER: {
        type: "ip",
        description: "NTP server IP address",
        required: true
      },
      MGMT_VLAN_ID: {
        type: "number",
        description: "Management VLAN ID",
        default: 1,
        required: true
      },
      USER_VLAN_ID: {
        type: "number",
        description: "User VLAN ID",
        default: 100,
        required: true
      },
      SERVER_VLAN_ID: {
        type: "number",
        description: "Server VLAN ID",
        default: 200,
        required: true
      },
      IOT_VLAN_ID: {
        type: "number",
        description: "IoT VLAN ID",
        default: 300,
        required: true
      },
      TRUNK_INTERFACE: {
        type: "string",
        description: "Trunk interface name",
        default: "port48",
        required: true
      }
    },
    supported_scenarios: ["Security Fabric", "Centralized Management", "Enterprise Network"],
    authentication_methods: ["FortiLink Authentication", "Certificate-based"],
    portnox_integration: {
      compatible: true,
      integration_level: "compatible",
      features: ["Fabric Integration", "Centralized Policies", "Unified Management"]
    },
    security_features: ["Security Fabric Integration", "Centralized Policy Management", "Automated Configuration"],
    best_practices: [
      "Secure FortiLink connection with proper certificates",
      "Regular firmware updates for both FortiGate and FortiSwitch",
      "Monitor fabric connectivity status",
      "Implement proper VLAN segmentation"
    ]
  },
  {
    name: "FortiSwitch PoE+ Configuration for IP Phones and APs",
    description: "Power over Ethernet Plus configuration for VoIP phones and wireless access points",
    category: "Power Management",
    subcategory: "PoE+",
    vendor_id: "fortinet",
    model_compatibility: ["FortiSwitch 224D-FPOE", "FortiSwitch 248D-FPOE"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10"],
    configuration_type: "CLI",
    complexity_level: "intermediate",
    template_content: `! FortiSwitch PoE+ Configuration
! Optimized for IP Phones and Wireless Access Points

config system global
    set hostname "{{SWITCH_HOSTNAME}}"
end

! Configure global PoE settings
config switch poe global
    set power-budget {{TOTAL_POWER_BUDGET}}
    set power-management-mode dynamic
    set power-guard-band {{GUARD_BAND_WATTS}}
end

! Configure PoE for IP Phone ports
config switch interface
    edit "{{PHONE_PORT_RANGE}}"
        set description "IP Phone Ports"
        set poe-status enable
        set poe-standard ieee802.3at
        set poe-power-budget {{PHONE_POWER_BUDGET}}
        set poe-priority high
        set voice-vlan {{VOICE_VLAN_ID}}
        set native-vlan {{DATA_VLAN_ID}}
        set lldp-profile "ip-phone-profile"
    next
end

! Configure PoE for Wireless AP ports  
config switch interface
    edit "{{AP_PORT_RANGE}}"
        set description "Wireless Access Point Ports"
        set poe-status enable
        set poe-standard ieee802.3at
        set poe-power-budget {{AP_POWER_BUDGET}}
        set poe-priority high
        set native-vlan {{MGMT_VLAN_ID}}
        set lldp-profile "ap-profile"
    next
end

! Configure LLDP for device discovery
config switch lldp settings
    set status enable
    set tx-interval 30
    set tx-hold 4
end

config switch lldp profile
    edit "ip-phone-profile"
        set voice-vlan {{VOICE_VLAN_ID}}
        set auto-isl enable
        set auto-mclag-icl enable
    next
    edit "ap-profile"
        set management-vlan {{MGMT_VLAN_ID}}
        set auto-isl enable
    next
end

! Configure VLANs
config switch vlan
    edit {{VOICE_VLAN_ID}}
        set description "Voice VLAN"
    next
    edit {{DATA_VLAN_ID}}
        set description "Data VLAN"
    next
    edit {{MGMT_VLAN_ID}}
        set description "Management VLAN"
    next
end

! Configure QoS for voice traffic
config switch qos qos-policy
    edit "voice-qos"
        set rate-by frame-based
        set rate {{VOICE_QOS_RATE}}
        set cos-queue 7
        set drop-policy taildrop
    next
end

config switch qos ip-dscp-map
    edit "voice-dscp"
        set value 46
        set cos-queue 7
        set drop-precedence 0
    next
end

! Monitor PoE consumption
config switch poe interface
    edit "{{PHONE_PORT_RANGE}}"
        set power-up-mode ieee802.3at
        set power-limit {{PHONE_POWER_LIMIT}}
    next
    edit "{{AP_PORT_RANGE}}"
        set power-up-mode ieee802.3at  
        set power-limit {{AP_POWER_LIMIT}}
    next
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the PoE FortiSwitch",
        default: "FortiSwitch-PoE",
        required: true
      },
      TOTAL_POWER_BUDGET: {
        type: "number",
        description: "Total PoE power budget in watts",
        default: 370,
        required: true
      },
      GUARD_BAND_WATTS: {
        type: "number",
        description: "Power guard band in watts",
        default: 30,
        required: true
      },
      PHONE_PORT_RANGE: {
        type: "string",
        description: "Port range for IP phones (e.g., port1-port24)",
        default: "port1-port24",
        required: true
      },
      AP_PORT_RANGE: {
        type: "string",
        description: "Port range for wireless APs (e.g., port25-port48)",
        default: "port25-port48",
        required: true
      },
      PHONE_POWER_BUDGET: {
        type: "number",
        description: "Power budget per phone port in watts",
        default: 15,
        required: true
      },
      AP_POWER_BUDGET: {
        type: "number",
        description: "Power budget per AP port in watts",
        default: 30,
        required: true
      },
      VOICE_VLAN_ID: {
        type: "number",
        description: "Voice VLAN ID",
        default: 10,
        required: true
      },
      DATA_VLAN_ID: {
        type: "number",
        description: "Data VLAN ID",
        default: 100,
        required: true
      },
      MGMT_VLAN_ID: {
        type: "number",
        description: "Management VLAN ID",
        default: 200,
        required: true
      },
      VOICE_QOS_RATE: {
        type: "number",
        description: "Voice QoS rate in kbps",
        default: 1000,
        required: true
      },
      PHONE_POWER_LIMIT: {
        type: "number",
        description: "Power limit per phone port in watts",
        default: 15,
        required: true
      },
      AP_POWER_LIMIT: {
        type: "number",
        description: "Power limit per AP port in watts",
        default: 30,
        required: true
      }
    },
    supported_scenarios: ["VoIP Deployment", "Wireless Infrastructure", "Unified Communications"],
    authentication_methods: ["LLDP", "CDP"],
    portnox_integration: {
      compatible: true,
      integration_level: "compatible",
      features: ["Device Discovery", "Power Management", "VLAN Assignment"]
    },
    security_features: ["LLDP Security", "PoE Power Monitoring", "VLAN Isolation"],
    best_practices: [
      "Calculate total power requirements before deployment",
      "Monitor PoE consumption regularly",
      "Use LLDP for automatic device discovery",
      "Implement proper QoS for voice traffic"
    ]
  },
  {
    name: "FortiSwitch Advanced RADIUS with Custom Ports",
    description: "Advanced RADIUS configuration with custom ports, retries, and multiple servers",
    category: "Authentication",
    subcategory: "Advanced RADIUS",
    vendor_id: "fortinet",
    model_compatibility: ["All FortiSwitch Models"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8"],
    configuration_type: "CLI",
    complexity_level: "advanced",
    template_content: `! FortiSwitch Advanced RADIUS Configuration
! Multiple RADIUS servers with custom ports and advanced settings
! Based on: https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/296000/radius

config system global
    set hostname "{{SWITCH_HOSTNAME}}"
end

! Configure Primary RADIUS Server with Custom Settings
config user radius
    edit "primary-radius"
        set server "{{PRIMARY_RADIUS_IP}}"
        set port {{PRIMARY_RADIUS_PORT}}
        set secret "{{PRIMARY_RADIUS_SECRET}}"
        set auth-type {{RADIUS_AUTH_TYPE}}
        set source-ip "{{SWITCH_MGMT_IP}}"
        set radius-port {{RADIUS_AUTH_PORT}}
        set acct-port {{RADIUS_ACCT_PORT}}
        set timeout {{RADIUS_TIMEOUT}}
        set all-usergroup disable
        set use-management-vdom enable
        set nas-ip "{{NAS_IDENTIFIER_IP}}"
        set class {{RADIUS_CLASS}}
        set acct-interim-interval {{ACCT_INTERIM_INTERVAL}}
        set radius-coa enable
        set radius-coa-secret "{{COA_SECRET}}"
        set rsso enable
        set rsso-secret "{{RSSO_SECRET}}"
        set rsso-validate-request-secret enable
        set rsso-endpoint-attribute {{RSSO_ENDPOINT_ATTR}}
        set rsso-endpoint-block-attribute {{RSSO_BLOCK_ATTR}}
        set sso-attribute "{{SSO_ATTRIBUTE}}"
        set sso-attribute-key "{{SSO_ATTRIBUTE_KEY}}"
        set sso-attribute-value-override enable
        set accounting-server enable
        set switch-controller-acct-fast-framedip-detect {{FAST_FRAMEDIP_DETECT}}
        set interface-select-method {{INTERFACE_SELECT_METHOD}}
        set interface "{{RADIUS_INTERFACE}}"
    next
    
    edit "secondary-radius"
        set server "{{SECONDARY_RADIUS_IP}}"
        set port {{SECONDARY_RADIUS_PORT}}
        set secret "{{SECONDARY_RADIUS_SECRET}}"
        set auth-type {{RADIUS_AUTH_TYPE}}
        set source-ip "{{SWITCH_MGMT_IP}}"
        set radius-port {{RADIUS_AUTH_PORT}}
        set acct-port {{RADIUS_ACCT_PORT}}
        set timeout {{RADIUS_TIMEOUT}}
        set all-usergroup disable
        set use-management-vdom enable
        set nas-ip "{{NAS_IDENTIFIER_IP}}"
        set accounting-server enable
    next
    
    edit "tertiary-radius"
        set server "{{TERTIARY_RADIUS_IP}}"
        set port {{TERTIARY_RADIUS_PORT}}
        set secret "{{TERTIARY_RADIUS_SECRET}}"
        set auth-type {{RADIUS_AUTH_TYPE}}
        set source-ip "{{SWITCH_MGMT_IP}}"
        set radius-port {{RADIUS_AUTH_PORT}}
        set acct-port {{RADIUS_ACCT_PORT}}
        set timeout {{RADIUS_TIMEOUT}}
        set accounting-server enable
    next
end

! Configure RADIUS Server Groups with Failover
config user group
    edit "radius-group"
        set group-type radius-server
        config member
            edit "primary-radius"
            next
            edit "secondary-radius"
            next
            edit "tertiary-radius"
            next
        end
        set radius-server "primary-radius" "secondary-radius" "tertiary-radius"
        set sso enable
        set sso-attribute-value "{{SSO_ATTRIBUTE_VALUE}}"
    next
end

! Configure Advanced 802.1X Settings
config switch security
    set dot1x-enable enable
    set dot1x-failure-action {{DOT1X_FAILURE_ACTION}}
    set dot1x-restricted-vlan {{RESTRICTED_VLAN_ID}}
    set dot1x-guest-vlan {{GUEST_VLAN_ID}}
    set dot1x-auth-timeout {{DOT1X_AUTH_TIMEOUT}}
    set dot1x-quiet-period {{DOT1X_QUIET_PERIOD}}
    set dot1x-tx-period {{DOT1X_TX_PERIOD}}
    set dot1x-supp-timeout {{DOT1X_SUPP_TIMEOUT}}
    set dot1x-server-timeout {{DOT1X_SERVER_TIMEOUT}}
    set dot1x-max-req {{DOT1X_MAX_REQ}}
    set dot1x-max-reauth-req {{DOT1X_MAX_REAUTH_REQ}}
    set dot1x-reauth-period {{DOT1X_REAUTH_PERIOD}}
    set mab-enable {{MAB_ENABLE}}
    set mab-reauth {{MAB_REAUTH}}
    set mab-activation-delay {{MAB_ACTIVATION_DELAY}}
end

! Configure Interface with Advanced RADIUS Settings
config switch interface
    edit "{{INTERFACE_NAME}}"
        set dot1x enable
        set dot1x-auth-type {{DOT1X_AUTH_TYPE}}
        set dot1x-radius-server "radius-group"
        set mab enable
        set mab-radius-server "radius-group"
        set max-hosts {{MAX_HOSTS_PER_PORT}}
        set max-hosts-mac {{MAX_MAC_PER_PORT}}
        set dhcp-snooping enable
        set dhcp-snooping-verify-mac enable
        set arp-inspection enable
        set igmp-snooping enable
        set storm-control enable
        set storm-control-mode {{STORM_CONTROL_MODE}}
        set broadcast-storm-control {{BROADCAST_STORM_CONTROL}}
        set multicast-storm-control {{MULTICAST_STORM_CONTROL}}
        set unicast-storm-control {{UNICAST_STORM_CONTROL}}
    next
end

! Configure Dynamic VLAN Assignment
config switch vlan
    edit {{CORPORATE_VLAN_ID}}
        set description "Corporate Users VLAN"
    next
    edit {{GUEST_VLAN_ID}}
        set description "Guest Access VLAN"
    next
    edit {{RESTRICTED_VLAN_ID}}
        set description "Restricted Access VLAN"
    next
    edit {{IOT_VLAN_ID}}
        set description "IoT Devices VLAN"
    next
    edit {{QUARANTINE_VLAN_ID}}
        set description "Quarantine VLAN"
    next
end

! Configure RADIUS Accounting
config log setting
    set status enable
    set radius-acct enable
    set radius-acct-server "primary-radius"
    set radius-acct-interim-interval {{ACCT_INTERIM_INTERVAL}}
end

! Configure CoA (Change of Authorization)
config switch radius-coa
    set status enable
    set listen-port {{COA_LISTEN_PORT}}
    config clients
        edit "{{COA_CLIENT_IP}}"
            set secret "{{COA_SECRET}}"
        next
    end
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the FortiSwitch",
        default: "FortiSwitch-Advanced-RADIUS",
        required: true
      },
      PRIMARY_RADIUS_IP: {
        type: "ip",
        description: "Primary RADIUS server IP address",
        required: true
      },
      PRIMARY_RADIUS_PORT: {
        type: "number",
        description: "Primary RADIUS server port",
        default: 1812,
        required: true
      },
      PRIMARY_RADIUS_SECRET: {
        type: "password",
        description: "Primary RADIUS shared secret",
        required: true
      },
      SECONDARY_RADIUS_IP: {
        type: "ip",
        description: "Secondary RADIUS server IP address",
        required: true
      },
      SECONDARY_RADIUS_PORT: {
        type: "number",
        description: "Secondary RADIUS server port",
        default: 1812,
        required: true
      },
      SECONDARY_RADIUS_SECRET: {
        type: "password",
        description: "Secondary RADIUS shared secret",
        required: true
      },
      TERTIARY_RADIUS_IP: {
        type: "ip",
        description: "Tertiary RADIUS server IP address",
        required: false
      },
      TERTIARY_RADIUS_PORT: {
        type: "number",
        description: "Tertiary RADIUS server port",
        default: 1812,
        required: false
      },
      TERTIARY_RADIUS_SECRET: {
        type: "password",
        description: "Tertiary RADIUS shared secret",
        required: false
      },
      RADIUS_AUTH_TYPE: {
        type: "select",
        description: "RADIUS authentication type",
        options: ["auto", "ms_chap_v2", "ms_chap", "chap", "pap"],
        default: "auto",
        required: true
      },
      SWITCH_MGMT_IP: {
        type: "ip",
        description: "Management IP of the FortiSwitch",
        required: true
      },
      RADIUS_AUTH_PORT: {
        type: "number",
        description: "RADIUS authentication port",
        default: 1812,
        required: true
      },
      RADIUS_ACCT_PORT: {
        type: "number",
        description: "RADIUS accounting port",
        default: 1813,
        required: true
      },
      RADIUS_TIMEOUT: {
        type: "number",
        description: "RADIUS timeout in seconds",
        default: 5,
        required: true
      },
      NAS_IDENTIFIER_IP: {
        type: "ip",
        description: "NAS Identifier IP address",
        required: true
      },
      RADIUS_CLASS: {
        type: "string",
        description: "RADIUS class attribute",
        required: false
      },
      ACCT_INTERIM_INTERVAL: {
        type: "number",
        description: "Accounting interim interval in seconds",
        default: 600,
        required: true
      },
      COA_SECRET: {
        type: "password",
        description: "Change of Authorization secret",
        required: false
      },
      COA_LISTEN_PORT: {
        type: "number",
        description: "CoA listen port",
        default: 3799,
        required: false
      },
      COA_CLIENT_IP: {
        type: "ip",
        description: "CoA client IP address",
        required: false
      },
      RSSO_SECRET: {
        type: "password",
        description: "RADIUS SSO secret",
        required: false
      },
      RSSO_ENDPOINT_ATTR: {
        type: "string",
        description: "RSSO endpoint attribute",
        required: false
      },
      RSSO_BLOCK_ATTR: {
        type: "string",
        description: "RSSO block attribute",
        required: false
      },
      SSO_ATTRIBUTE: {
        type: "string",
        description: "SSO attribute name",
        required: false
      },
      SSO_ATTRIBUTE_KEY: {
        type: "string",
        description: "SSO attribute key",
        required: false
      },
      SSO_ATTRIBUTE_VALUE: {
        type: "string",
        description: "SSO attribute value",
        required: false
      },
      FAST_FRAMEDIP_DETECT: {
        type: "number",
        description: "Fast framed IP detection interval",
        default: 2,
        required: false
      },
      INTERFACE_SELECT_METHOD: {
        type: "select",
        description: "Interface selection method",
        options: ["auto", "sdwan", "specify"],
        default: "auto",
        required: false
      },
      RADIUS_INTERFACE: {
        type: "string",
        description: "RADIUS interface name",
        required: false
      },
      INTERFACE_NAME: {
        type: "string",
        description: "Interface name to configure",
        default: "port1-48",
        required: true
      },
      DOT1X_FAILURE_ACTION: {
        type: "select",
        description: "802.1X failure action",
        options: ["restricted-vlan", "guest-vlan", "drop"],
        default: "restricted-vlan",
        required: true
      },
      DOT1X_AUTH_TIMEOUT: {
        type: "number",
        description: "802.1X authentication timeout",
        default: 30,
        required: true
      },
      DOT1X_QUIET_PERIOD: {
        type: "number",
        description: "802.1X quiet period",
        default: 60,
        required: true
      },
      DOT1X_TX_PERIOD: {
        type: "number",
        description: "802.1X transmission period",
        default: 30,
        required: true
      },
      DOT1X_SUPP_TIMEOUT: {
        type: "number",
        description: "802.1X supplicant timeout",
        default: 30,
        required: true
      },
      DOT1X_SERVER_TIMEOUT: {
        type: "number",
        description: "802.1X server timeout",
        default: 30,
        required: true
      },
      DOT1X_MAX_REQ: {
        type: "number",
        description: "802.1X maximum requests",
        default: 2,
        required: true
      },
      DOT1X_MAX_REAUTH_REQ: {
        type: "number",
        description: "802.1X maximum re-authentication requests",
        default: 2,
        required: true
      },
      DOT1X_REAUTH_PERIOD: {
        type: "number",
        description: "802.1X re-authentication period",
        default: 3600,
        required: true
      },
      DOT1X_AUTH_TYPE: {
        type: "select",
        description: "802.1X authentication type",
        options: ["pae", "multi-auth", "multi-host"],
        default: "multi-auth",
        required: true
      },
      MAB_ENABLE: {
        type: "select",
        description: "Enable MAC Authentication Bypass",
        options: ["enable", "disable"],
        default: "enable",
        required: true
      },
      MAB_REAUTH: {
        type: "select",
        description: "Enable MAB re-authentication",
        options: ["enable", "disable"],
        default: "enable",
        required: true
      },
      MAB_ACTIVATION_DELAY: {
        type: "number",
        description: "MAB activation delay in seconds",
        default: 10,
        required: true
      },
      MAX_HOSTS_PER_PORT: {
        type: "number",
        description: "Maximum hosts per port",
        default: 8,
        required: true
      },
      MAX_MAC_PER_PORT: {
        type: "number",
        description: "Maximum MAC addresses per port",
        default: 8,
        required: true
      },
      STORM_CONTROL_MODE: {
        type: "select",
        description: "Storm control mode",
        options: ["global", "interface"],
        default: "interface",
        required: false
      },
      BROADCAST_STORM_CONTROL: {
        type: "number",
        description: "Broadcast storm control threshold",
        default: 500,
        required: false
      },
      MULTICAST_STORM_CONTROL: {
        type: "number",
        description: "Multicast storm control threshold",
        default: 500,
        required: false
      },
      UNICAST_STORM_CONTROL: {
        type: "number",
        description: "Unicast storm control threshold",
        default: 500,
        required: false
      },
      CORPORATE_VLAN_ID: {
        type: "number",
        description: "Corporate VLAN ID",
        default: 100,
        required: true
      },
      GUEST_VLAN_ID: {
        type: "number",
        description: "Guest VLAN ID",
        default: 300,
        required: true
      },
      RESTRICTED_VLAN_ID: {
        type: "number",
        description: "Restricted VLAN ID",
        default: 200,
        required: true
      },
      IOT_VLAN_ID: {
        type: "number",
        description: "IoT VLAN ID",
        default: 400,
        required: true
      },
      QUARANTINE_VLAN_ID: {
        type: "number",
        description: "Quarantine VLAN ID",
        default: 999,
        required: true
      }
    },
    supported_scenarios: ["Enterprise Network", "Campus Network", "Data Center", "High Security Environment"],
    authentication_methods: ["802.1X", "MAB", "RADIUS", "Multi-Auth"],
    portnox_integration: {
      compatible: true,
      integration_level: "native",
      features: ["Dynamic VLAN Assignment", "CoA Support", "RADIUS Accounting", "Multi-Server Failover"]
    },
    security_features: ["Advanced RADIUS", "CoA Support", "Storm Control", "DHCP Snooping", "ARP Inspection"],
    best_practices: [
      "Configure multiple RADIUS servers for redundancy",
      "Use strong shared secrets for all RADIUS communications",
      "Enable accounting for audit compliance",
      "Configure appropriate timeout values based on network latency",
      "Implement storm control to prevent network flooding",
      "Use custom ports for enhanced security"
    ],
    troubleshooting_guide: [
      "Check RADIUS server connectivity and ports",
      "Verify shared secrets match on all servers",
      "Review 802.1X timeout settings for client compatibility",
      "Monitor RADIUS accounting logs for authentication issues",
      "Test CoA functionality with RADIUS server",
      "Validate VLAN assignments and policies"
    ]
  },
  {
    name: "FortiSwitch TACACS+ Authentication and Authorization",
    description: "TACACS+ configuration for administrative authentication and command authorization",
    category: "Authentication",
    subcategory: "TACACS+",
    vendor_id: "fortinet",
    model_compatibility: ["All FortiSwitch Models"],
    firmware_versions: ["7.4.5", "7.4.4", "7.4.3", "7.2.10", "7.2.8"],
    configuration_type: "CLI",
    complexity_level: "advanced",
    template_content: `! FortiSwitch TACACS+ Configuration
! Administrative authentication and command authorization
! Based on: https://docs.fortinet.com/document/fortiswitch/7.2.10/administration-guide/701014/tacacs

config system global
    set hostname "{{SWITCH_HOSTNAME}}"
    set admin-https-ssl-versions {{SSL_VERSIONS}}
    set admin-https-redirect enable
    set admin-timeout {{ADMIN_TIMEOUT}}
    set admin-concurrent enable
    set admin-lockout-threshold {{LOCKOUT_THRESHOLD}}
    set admin-lockout-duration {{LOCKOUT_DURATION}}
end

! Configure Primary TACACS+ Server
config user tacacs+
    edit "primary-tacacs"
        set server "{{PRIMARY_TACACS_IP}}"
        set port {{PRIMARY_TACACS_PORT}}
        set key "{{PRIMARY_TACACS_KEY}}"
        set secondary-server "{{SECONDARY_TACACS_IP}}"
        set secondary-port {{SECONDARY_TACACS_PORT}}
        set secondary-key "{{SECONDARY_TACACS_KEY}}"
        set tertiary-server "{{TERTIARY_TACACS_IP}}"
        set tertiary-port {{TERTIARY_TACACS_PORT}}
        set tertiary-key "{{TERTIARY_TACACS_KEY}}"
        set timeout {{TACACS_TIMEOUT}}
        set single-connection {{SINGLE_CONNECTION}}
        set source-ip "{{SWITCH_MGMT_IP}}"
        set interface-select-method {{INTERFACE_SELECT_METHOD}}
        set interface "{{TACACS_INTERFACE}}"
        set authorization enable
        set authen-type {{TACACS_AUTHEN_TYPE}}
    next
end

! Configure TACACS+ Authentication Method Lists
config system admin
    edit "{{ADMIN_USERNAME}}"
        set accprofile "{{ADMIN_PROFILE}}"
        set vdom "root"
        set remote-auth enable
        set peer-auth enable
        set peer-group "{{PEER_GROUP}}"
        set trusthost1 {{TRUSTED_HOST_1}}
        set trusthost2 {{TRUSTED_HOST_2}}
        set trusthost3 {{TRUSTED_HOST_3}}
        set trusthost4 {{TRUSTED_HOST_4}}
        set trusthost5 {{TRUSTED_HOST_5}}
        set trusthost6 {{TRUSTED_HOST_6}}
        set ip6-trusthost1 {{TRUSTED_IPV6_HOST_1}}
        set ip6-trusthost2 {{TRUSTED_IPV6_HOST_2}}
        set login-time {{LOGIN_TIME_RESTRICTIONS}}
        set gui-dashboard {{GUI_DASHBOARD_ACCESS}}
        set two-factor {{TWO_FACTOR_AUTH}}
        set email-to "{{ADMIN_EMAIL}}"
        set sms-phone "{{ADMIN_SMS}}"
        set sms-server {{SMS_SERVER}}
        set force-password-change {{FORCE_PASSWORD_CHANGE}}
        set allow-remove-admin-session enable
        set wildcard enable
        set remote-group "{{TACACS_REMOTE_GROUP}}"
        set password-expire {{PASSWORD_EXPIRE_DAYS}}
        set schedule "{{ADMIN_SCHEDULE}}"
        set comments "{{ADMIN_COMMENTS}}"
    next
end

! Configure Administrative Profiles with TACACS+ Authorization
config system accprofile
    edit "{{CUSTOM_ADMIN_PROFILE}}"
        set secfabgrp {{SECURITY_FABRIC_ACCESS}}
        set ftviewgrp {{FORTIVIEW_ACCESS}}
        set authgrp {{AUTH_ACCESS}}
        set sysgrp {{SYSTEM_ACCESS}}
        set netgrp {{NETWORK_ACCESS}}
        set loggrp {{LOG_ACCESS}}
        set fwgrp {{FIREWALL_ACCESS}}
        set vpngrp {{VPN_ACCESS}}
        set utmgrp {{UTM_ACCESS}}
        set wanoptgrp {{WAN_OPT_ACCESS}}
        set wifi {{WIFI_ACCESS}}
        set admintimeout {{ADMIN_TIMEOUT_OVERRIDE}}
        set admintimeout-override {{TIMEOUT_OVERRIDE_ENABLE}}
        set system-diagnostics {{SYSTEM_DIAG_ACCESS}}
        set cli-diagnose {{CLI_DIAG_ACCESS}}
        set cli-get {{CLI_GET_ACCESS}}
        set cli-show {{CLI_SHOW_ACCESS}}
        set cli-exec {{CLI_EXEC_ACCESS}}
        set cli-config {{CLI_CONFIG_ACCESS}}
        set comments "{{PROFILE_COMMENTS}}"
    next
end

! Configure TACACS+ Command Authorization
config system auto-script
    edit "tacacs-command-auth"
        set interval {{COMMAND_AUTH_INTERVAL}}
        set repeat {{COMMAND_AUTH_REPEAT}}
        set start {{COMMAND_AUTH_START}}
        set script "
            config system settings
                set gui-allow-unnamed-policy enable
                set gui-policy-based-ipsec enable
                set ecmp-max-paths {{ECMP_MAX_PATHS}}
            end
        "
        set output-size {{SCRIPT_OUTPUT_SIZE}}
        set timeout {{SCRIPT_TIMEOUT}}
    next
end

! Configure Remote Authentication Groups
config user peer
    edit "{{TACACS_PEER_GROUP}}"
        set ca "{{CA_CERTIFICATE}}"
        set subject "{{CERT_SUBJECT}}"
        set cn "{{CERT_CN}}"
        set cn-type {{CN_TYPE}}
        set ldap-server "{{LDAP_SERVER}}"
        set ldap-username "{{LDAP_USERNAME}}"
        set ldap-password "{{LDAP_PASSWORD}}"
        set ldap-mode {{LDAP_MODE}}
        set ocsp-override-server "{{OCSP_SERVER}}"
        set two-factor {{PEER_TWO_FACTOR}}
        set passwd "{{PEER_PASSWORD}}"
    next
end

! Configure TACACS+ Accounting
config log tacacs+accounting
    edit "tacacs-accounting"
        set server "{{ACCOUNTING_SERVER_IP}}"
        set port {{ACCOUNTING_SERVER_PORT}}
        set key "{{ACCOUNTING_SERVER_KEY}}"
        set source-ip "{{SWITCH_MGMT_IP}}"
        set interface "{{ACCOUNTING_INTERFACE}}"
        set status enable
    next
end

! Configure Session Timeout and Security
config system global
    set admin-https-pki-required {{PKI_REQUIRED}}
    set admin-ssh-password enable
    set admin-ssh-port {{SSH_PORT}}
    set admin-ssh-v1 {{SSH_V1_ENABLE}}
    set admin-telnet-port {{TELNET_PORT}}
    set admin-telnet {{TELNET_ENABLE}}
    set admin-hsts-max-age {{HSTS_MAX_AGE}}
    set admin-https-redirect enable
    set admin-login-max {{MAX_LOGIN_ATTEMPTS}}
    set admin-server-cert "{{SERVER_CERTIFICATE}}"
    set dst {{DST_ENABLE}}
    set timezone "{{TIMEZONE}}"
    set gui-theme {{GUI_THEME}}
    set gui-date-format {{DATE_FORMAT}}
    set gui-date-time-source {{DATE_TIME_SOURCE}}
    set gui-device-latitude {{DEVICE_LATITUDE}}
    set gui-device-longitude {{DEVICE_LONGITUDE}}
    set gui-lines-per-page {{LINES_PER_PAGE}}
    set gui-theme-selection enable
    set gui-custom-language {{CUSTOM_LANGUAGE}}
    set gui-display-hostname enable
    set gui-fortigate-cloud-sandbox enable
    set gui-firmware-upgrade-warning enable
    set gui-allow-default-hostname enable
    set gui-replacement-message-groups enable
    set gui-local-out enable
    set gui-certificates enable
    set gui-custom-language-auto-detect enable
    set gui-auto-upgrade-setup-warning enable
    set gui-workflow-management enable
    set gui-cdn-usage enable
    set two-factor-email-expiry {{TWO_FACTOR_EMAIL_EXPIRY}}
    set two-factor-sms-expiry {{TWO_FACTOR_SMS_EXPIRY}}
    set two-factor-fac-expiry {{TWO_FACTOR_FAC_EXPIRY}}
    set two-factor-ftk-expiry {{TWO_FACTOR_FTK_EXPIRY}}
end

! Configure User Authentication Order
config system admin
    edit "admin"
        set accprofile "super_admin"
        set remote-auth enable
        set peer-auth enable
        set two-factor fortitoken
        set fortitoken "{{FORTITOKEN_SERIAL}}"
        set email-to "{{SUPER_ADMIN_EMAIL}}"
        set guest-auth enable
        set guest-usergroups "{{GUEST_USERGROUPS}}"
        set guest-lang {{GUEST_LANGUAGE}}
    next
end`,
    template_variables: {
      SWITCH_HOSTNAME: {
        type: "string",
        description: "Hostname for the FortiSwitch",
        default: "FortiSwitch-TACACS",
        required: true
      },
      PRIMARY_TACACS_IP: {
        type: "ip",
        description: "Primary TACACS+ server IP address",
        required: true
      },
      PRIMARY_TACACS_PORT: {
        type: "number",
        description: "Primary TACACS+ server port",
        default: 49,
        required: true
      },
      PRIMARY_TACACS_KEY: {
        type: "password",
        description: "Primary TACACS+ shared key",
        required: true
      },
      SECONDARY_TACACS_IP: {
        type: "ip",
        description: "Secondary TACACS+ server IP address",
        required: false
      },
      SECONDARY_TACACS_PORT: {
        type: "number",
        description: "Secondary TACACS+ server port",
        default: 49,
        required: false
      },
      SECONDARY_TACACS_KEY: {
        type: "password",
        description: "Secondary TACACS+ shared key",
        required: false
      },
      TERTIARY_TACACS_IP: {
        type: "ip",
        description: "Tertiary TACACS+ server IP address",
        required: false
      },
      TERTIARY_TACACS_PORT: {
        type: "number",
        description: "Tertiary TACACS+ server port",
        default: 49,
        required: false
      },
      TERTIARY_TACACS_KEY: {
        type: "password",
        description: "Tertiary TACACS+ shared key",
        required: false
      },
      TACACS_TIMEOUT: {
        type: "number",
        description: "TACACS+ timeout in seconds",
        default: 5,
        required: true
      },
      SINGLE_CONNECTION: {
        type: "select",
        description: "Use single connection to TACACS+ server",
        options: ["enable", "disable"],
        default: "disable",
        required: true
      },
      SWITCH_MGMT_IP: {
        type: "ip",
        description: "Management IP of the FortiSwitch",
        required: true
      },
      INTERFACE_SELECT_METHOD: {
        type: "select",
        description: "Interface selection method",
        options: ["auto", "sdwan", "specify"],
        default: "auto",
        required: false
      },
      TACACS_INTERFACE: {
        type: "string",
        description: "TACACS+ interface name",
        required: false
      },
      TACACS_AUTHEN_TYPE: {
        type: "select",
        description: "TACACS+ authentication type",
        options: ["auto", "ascii", "pap", "chap", "mschap"],
        default: "auto",
        required: true
      },
      ADMIN_USERNAME: {
        type: "string",
        description: "Administrator username",
        default: "tacacs-admin",
        required: true
      },
      ADMIN_PROFILE: {
        type: "string",
        description: "Administrator profile name",
        default: "super_admin",
        required: true
      },
      PEER_GROUP: {
        type: "string",
        description: "Peer group name",
        required: false
      },
      TRUSTED_HOST_1: {
        type: "ip",
        description: "Trusted host 1 IP address",
        required: false
      },
      TRUSTED_HOST_2: {
        type: "ip",
        description: "Trusted host 2 IP address",
        required: false
      },
      TRUSTED_HOST_3: {
        type: "ip",
        description: "Trusted host 3 IP address",
        required: false
      },
      TRUSTED_HOST_4: {
        type: "ip",
        description: "Trusted host 4 IP address",
        required: false
      },
      TRUSTED_HOST_5: {
        type: "ip",
        description: "Trusted host 5 IP address",
        required: false
      },
      TRUSTED_HOST_6: {
        type: "ip",
        description: "Trusted host 6 IP address",
        required: false
      },
      TRUSTED_IPV6_HOST_1: {
        type: "string",
        description: "Trusted IPv6 host 1",
        required: false
      },
      TRUSTED_IPV6_HOST_2: {
        type: "string",
        description: "Trusted IPv6 host 2",
        required: false
      },
      LOGIN_TIME_RESTRICTIONS: {
        type: "string",
        description: "Login time restrictions",
        required: false
      },
      GUI_DASHBOARD_ACCESS: {
        type: "select",
        description: "GUI dashboard access level",
        options: ["enable", "disable"],
        default: "enable",
        required: false
      },
      TWO_FACTOR_AUTH: {
        type: "select",
        description: "Two-factor authentication method",
        options: ["disable", "fortitoken", "email", "sms"],
        default: "disable",
        required: false
      },
      ADMIN_EMAIL: {
        type: "email",
        description: "Administrator email address",
        required: false
      },
      ADMIN_SMS: {
        type: "string",
        description: "Administrator SMS phone number",
        required: false
      },
      SMS_SERVER: {
        type: "string",
        description: "SMS server for two-factor authentication",
        required: false
      },
      FORCE_PASSWORD_CHANGE: {
        type: "select",
        description: "Force password change on first login",
        options: ["enable", "disable"],
        default: "disable",
        required: false
      },
      TACACS_REMOTE_GROUP: {
        type: "string",
        description: "TACACS+ remote group name",
        required: false
      },
      PASSWORD_EXPIRE_DAYS: {
        type: "number",
        description: "Password expiration in days",
        default: 90,
        required: false
      },
      ADMIN_SCHEDULE: {
        type: "string",
        description: "Administrator schedule name",
        required: false
      },
      ADMIN_COMMENTS: {
        type: "string",
        description: "Administrator comments",
        required: false
      },
      SSL_VERSIONS: {
        type: "string",
        description: "Supported SSL/TLS versions",
        default: "tlsv1-1 tlsv1-2 tlsv1-3",
        required: true
      },
      ADMIN_TIMEOUT: {
        type: "number",
        description: "Administrator session timeout in minutes",
        default: 30,
        required: true
      },
      LOCKOUT_THRESHOLD: {
        type: "number",
        description: "Account lockout threshold",
        default: 3,
        required: true
      },
      LOCKOUT_DURATION: {
        type: "number",
        description: "Account lockout duration in seconds",
        default: 300,
        required: true
      },
      SSH_PORT: {
        type: "number",
        description: "SSH port number",
        default: 22,
        required: true
      },
      SSH_V1_ENABLE: {
        type: "select",
        description: "Enable SSH version 1",
        options: ["enable", "disable"],
        default: "disable",
        required: true
      },
      TELNET_PORT: {
        type: "number",
        description: "Telnet port number",
        default: 23,
        required: false
      },
      TELNET_ENABLE: {
        type: "select",
        description: "Enable Telnet access",
        options: ["enable", "disable"],
        default: "disable",
        required: true
      },
      PKI_REQUIRED: {
        type: "select",
        description: "Require PKI authentication",
        options: ["enable", "disable"],
        default: "disable",
        required: false
      },
      CUSTOM_ADMIN_PROFILE: {
        type: "string",
        description: "Custom administrator profile name",
        default: "tacacs_admin_profile",
        required: true
      },
      SECURITY_FABRIC_ACCESS: {
        type: "select",
        description: "Security Fabric access level",
        options: ["none", "read", "read-write"],
        default: "read",
        required: true
      },
      FORTIVIEW_ACCESS: {
        type: "select",
        description: "FortiView access level",
        options: ["none", "read", "read-write"],
        default: "read",
        required: true
      },
      AUTH_ACCESS: {
        type: "select",
        description: "Authentication access level",
        options: ["none", "read", "read-write"],
        default: "read-write",
        required: true
      },
      SYSTEM_ACCESS: {
        type: "select",
        description: "System access level",
        options: ["none", "read", "read-write"],
        default: "read-write",
        required: true
      },
      NETWORK_ACCESS: {
        type: "select",
        description: "Network access level",
        options: ["none", "read", "read-write"],
        default: "read-write",
        required: true
      },
      LOG_ACCESS: {
        type: "select",
        description: "Log access level",
        options: ["none", "read", "read-write"],
        default: "read",
        required: true
      },
      ACCOUNTING_SERVER_IP: {
        type: "ip",
        description: "TACACS+ accounting server IP",
        required: false
      },
      ACCOUNTING_SERVER_PORT: {
        type: "number",
        description: "TACACS+ accounting server port",
        default: 49,
        required: false
      },
      ACCOUNTING_SERVER_KEY: {
        type: "password",
        description: "TACACS+ accounting server key",
        required: false
      },
      ACCOUNTING_INTERFACE: {
        type: "string",
        description: "Accounting interface name",
        required: false
      }
    },
    supported_scenarios: ["Enterprise Network", "Data Center", "High Security Environment", "Government"],
    authentication_methods: ["TACACS+", "PKI", "Two-Factor"],
    portnox_integration: {
      compatible: true,
      integration_level: "compatible",
      features: ["Administrative Authentication", "Command Authorization", "Accounting"]
    },
    security_features: ["TACACS+ Authentication", "Command Authorization", "Administrative Accounting", "Session Security"],
    best_practices: [
      "Configure multiple TACACS+ servers for redundancy",
      "Use strong encryption keys for TACACS+ communications",
      "Enable command authorization for privileged operations",
      "Implement strict trusted host restrictions",
      "Enable two-factor authentication for enhanced security",
      "Regular audit of administrative access logs"
    ],
    troubleshooting_guide: [
      "Verify TACACS+ server connectivity and port accessibility",
      "Check shared key configuration on both switch and server",
      "Review administrative profile permissions",
      "Monitor TACACS+ accounting logs for authentication issues",
      "Validate trusted host configurations",
      "Test command authorization policies"
    ]
  }
];

export default fortiswitchConfigTemplates;