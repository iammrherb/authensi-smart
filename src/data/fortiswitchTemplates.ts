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
  }
];

export default fortiswitchConfigTemplates;