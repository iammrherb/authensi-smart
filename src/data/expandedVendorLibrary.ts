// Comprehensive expanded vendor library with all network security categories
// Includes: Wired, Wireless, Firewalls, NAC, MDM, VPN, SIEM, Identity, EDR

export interface VendorModel {
  id: string;
  name: string;
  series: string;
  category: string;
  firmwareVersions: string[];
  capabilities: string[];
  ports?: string;
  stackable?: boolean;
  poe?: boolean;
  throughput?: string;
  maxUsers?: string;
  deployment?: string[];
}

export interface ExpandedVendor {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  icon: string;
  color: string;
  description: string;
  models: VendorModel[];
  commonFeatures: string[];
  supportLevel: 'full' | 'partial' | 'limited' | 'none';
  portnoxCompatibility: 'native' | 'api' | 'limited' | 'none';
  integrationMethods: string[];
  knownLimitations?: string[];
  documentationLinks?: string[];
}

// Import comprehensive security vendor data
import { comprehensiveSecurityVendorData } from './comprehensiveSecurityVendorData';

export const expandedVendorLibrary: ExpandedVendor[] = [
  ...comprehensiveSecurityVendorData,
  // ========== NAC VENDORS ==========
  {
    id: "portnox",
    name: "Portnox",
    category: "NAC",
    subcategory: "Primary NAC",
    icon: "🔐",
    color: "bg-blue-500",
    description: "AI-Powered Network Access Control Platform",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["Native Platform", "API", "RADIUS"],
    commonFeatures: ["AI Analytics", "Zero Trust", "BYOD", "IoT Discovery", "Automated Response", "Device Profiling"],
    models: [
      {
        id: "portnox-core",
        name: "Portnox CORE",
        series: "Enterprise",
        category: "NAC Platform",
        deployment: ["On-Premise", "Private Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["6.5.0", "6.4.2", "6.4.1", "6.3.5", "6.3.2"],
        capabilities: ["802.1X", "RADIUS", "Device Profiling", "Policy Engine", "AI Analytics", "Zero Trust"]
      },
      {
        id: "portnox-clear",
        name: "Portnox CLEAR",
        series: "Cloud",
        category: "Cloud NAC",
        deployment: ["Cloud", "SaaS"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Cloud-Latest", "Cloud-Stable", "Cloud-Preview"],
        capabilities: ["Cloud Management", "Global Policies", "Multi-Tenant", "AI Analytics"]
      }
    ]
  },
  {
    id: "cisco-ise",
    name: "Cisco ISE",
    category: "NAC",
    subcategory: "Enterprise NAC",
    icon: "🌐",
    color: "bg-blue-600",
    description: "Cisco Identity Services Engine",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "API", "pxGrid"],
    commonFeatures: ["TrustSec", "SDA", "Profiling", "Posture", "Guest Access", "BYOD"],
    models: [
      {
        id: "ise-3415",
        name: "ISE 3415",
        series: "ISE 3400",
        category: "Small Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "5,000",
        firmwareVersions: ["3.3.0.430", "3.2.0.542", "3.1.0.518", "3.0.0.458"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Posture", "Guest", "TrustSec"]
      },
      {
        id: "ise-3595",
        name: "ISE 3595",
        series: "ISE 3500",
        category: "Large Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "100,000",
        firmwareVersions: ["3.3.0.430", "3.2.0.542", "3.1.0.518", "3.0.0.458"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Posture", "Guest", "TrustSec", "pxGrid"]
      }
    ]
  },
  {
    id: "aruba-clearpass",
    name: "Aruba ClearPass",
    category: "NAC",
    subcategory: "Enterprise NAC",
    icon: "📡",
    color: "bg-orange-500",
    description: "HPE Aruba ClearPass Policy Manager",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "API", "REST"],
    commonFeatures: ["Dynamic VLAN", "Device Profiling", "Guest Access", "BYOD", "Onboard", "OnGuard"],
    models: [
      {
        id: "clearpass-c1000",
        name: "ClearPass C1000",
        series: "ClearPass C-Series",
        category: "Small Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "1,000",
        firmwareVersions: ["6.12.2", "6.11.6", "6.10.8", "6.9.13"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Guest", "BYOD", "OnGuard"]
      },
      {
        id: "clearpass-c5000",
        name: "ClearPass C5000",
        series: "ClearPass C-Series",
        category: "Large Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "25,000",
        firmwareVersions: ["6.12.2", "6.11.6", "6.10.8", "6.9.13"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Guest", "BYOD", "OnGuard", "Cluster"]
      }
    ]
  },
  {
    id: "forescout",
    name: "Forescout",
    category: "NAC",
    subcategory: "Zero Trust NAC",
    icon: "👁️",
    color: "bg-purple-600",
    description: "Forescout Platform for Zero Trust",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "SNMP"],
    commonFeatures: ["Device Visibility", "Risk Assessment", "Automated Response", "Zero Trust", "OT Security"],
    models: [
      {
        id: "forescout-virtual",
        name: "Forescout Virtual Appliance",
        series: "Virtual",
        category: "Software Platform",
        deployment: ["VM", "Cloud"],
        maxUsers: "Variable",
        firmwareVersions: ["8.6.2", "8.5.4", "8.4.5", "8.3.2"],
        capabilities: ["Device Discovery", "Profiling", "Risk Assessment", "Automated Response", "OT Visibility"]
      }
    ]
  },

  // ========== WIRED SWITCH VENDORS ==========
  {
    id: "cisco-catalyst",
    name: "Cisco Catalyst",
    category: "Wired",
    subcategory: "Enterprise Switches",
    icon: "🔌",
    color: "bg-blue-600",
    description: "Cisco Catalyst Switch Portfolio",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["802.1X", "RADIUS", "SNMP", "API"],
    commonFeatures: ["DNA Center", "ISE Integration", "TrustSec", "SDA", "StackWise"],
    models: [
      {
        id: "c9200-24t",
        name: "Catalyst 9200-24T",
        series: "Catalyst 9200",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Multi-Auth", "Multi-Domain", "DNA Center"]
      },
      {
        id: "c9200-48p",
        name: "Catalyst 9200-48P",
        series: "Catalyst 9200",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Multi-Auth", "Multi-Domain", "PoE+", "DNA Center"]
      },
      {
        id: "c9300-24t",
        name: "Catalyst 9300-24T",
        series: "Catalyst 9300",
        category: "Access/Distribution",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Multi-Auth", "Multi-Domain", "TrustSec", "DNA Center"]
      },
      {
        id: "c9300-48p",
        name: "Catalyst 9300-48P",
        series: "Catalyst 9300",
        category: "Access/Distribution",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Multi-Auth", "Multi-Domain", "PoE+", "TrustSec"]
      },
      {
        id: "c9500-40x",
        name: "Catalyst 9500-40X",
        series: "Catalyst 9500",
        category: "Core/Distribution",
        ports: "40x 10GbE + 2x 40GbE",
        stackable: true,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05"],
        capabilities: ["802.1X", "TrustSec", "SDA", "EVPN", "BGP", "OSPF", "Multi-Auth"]
      }
    ]
  },
  {
    id: "aruba-cx",
    name: "Aruba CX",
    category: "Wired",
    subcategory: "Enterprise Switches",
    icon: "🔗",
    color: "bg-orange-500",
    description: "HPE Aruba CX Switch Series",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["802.1X", "RADIUS", "ClearPass", "API"],
    commonFeatures: ["ClearPass", "AOS-CX", "Central", "Dynamic VLAN", "VSX"],
    models: [
      {
        id: "cx6200-24g",
        name: "CX 6200-24G",
        series: "CX 6200",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "Dynamic VLAN", "VSX", "Multi-Auth"]
      },
      {
        id: "cx6200-48g",
        name: "CX 6200-48G-PoE4+",
        series: "CX 6200",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "Dynamic VLAN", "VSX", "PoE+", "Multi-Auth"]
      },
      {
        id: "cx6300-48g",
        name: "CX 6300M-48G-PoE4+",
        series: "CX 6300",
        category: "Access/Distribution",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "Dynamic VLAN", "VSX", "L3", "PoE+", "Multi-Auth"]
      }
    ]
  },
  {
    id: "juniper-ex",
    name: "Juniper EX Series",
    category: "Wired",
    subcategory: "Enterprise Switches",
    icon: "🌲",
    color: "bg-green-600",
    description: "Juniper EX Series Switches",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["802.1X", "RADIUS", "JUNOS", "API"],
    commonFeatures: ["Junos", "EVPN-VXLAN", "Virtual Chassis", "EX Series"],
    models: [
      {
        id: "ex2300-24t",
        name: "EX2300-24T",
        series: "EX2300",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3", "20.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "Multi-Auth"]
      },
      {
        id: "ex2300-48p",
        name: "EX2300-48P",
        series: "EX2300",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3", "20.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "PoE+", "Multi-Auth"]
      },
      {
        id: "ex4400-48mp",
        name: "EX4400-48MP",
        series: "EX4400",
        category: "Access/Distribution",
        ports: "48x mGbE + 8x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "L3", "EVPN", "mGbE", "Multi-Auth"]
      }
    ]
  },
  {
    id: "fortinet-fortiswitch",
    name: "FortiSwitch",
    category: "Wired",
    subcategory: "Security-First Switches",
    icon: "🛡️",
    color: "bg-red-500",
    description: "Fortinet Secure Switching Solutions",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["802.1X", "RADIUS", "FortiGate", "API"],
    commonFeatures: ["Security Fabric", "FortiGate Integration", "Zero Touch", "Multi-Auth"],
    models: [
      {
        id: "fs-224d-fpoe",
        name: "FortiSwitch 224D-FPOE",
        series: "200 Series",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2", "802.1X", "PoE+", "Stacking", "Multi-Auth", "MAB"]
      },
      {
        id: "fs-448d",
        name: "FortiSwitch 448D",
        series: "400 Series",
        category: "Aggregation",
        ports: "48x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2/L3", "802.1X", "OSPF", "BGP", "Stacking", "Multi-Auth"]
      }
    ]
  },

  // ========== WIRELESS VENDORS ==========
  {
    id: "cisco-wireless",
    name: "Cisco Wireless",
    category: "Wireless",
    subcategory: "Enterprise WiFi",
    icon: "📶",
    color: "bg-blue-600",
    description: "Cisco Wireless Solutions",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "ISE", "API"],
    commonFeatures: ["DNA Center", "ISE Integration", "Wi-Fi 6E", "Catalyst 9800", "Aironet"],
    models: [
      {
        id: "cat9800-cl",
        name: "Catalyst 9800-CL",
        series: "Catalyst 9800",
        category: "Wireless Controller",
        deployment: ["Cloud", "VM"],
        maxUsers: "2,000 APs",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["802.1X", "WPA3", "Wi-Fi 6E", "FlexConnect", "Central WebAuth"]
      },
      {
        id: "cat9120axi",
        name: "Catalyst 9120AXI",
        series: "Catalyst 9100",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "2.4 Gbps",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["Wi-Fi 6", "802.1X", "WPA3", "BLE", "IoT Ready"]
      },
      {
        id: "cat9164i",
        name: "Catalyst 9164I",
        series: "Catalyst 9160",
        category: "Outdoor AP",
        deployment: ["Outdoor"],
        throughput: "4.8 Gbps",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "Weather Resistant", "Mesh"]
      }
    ]
  },
  {
    id: "aruba-wireless",
    name: "Aruba Wireless",
    category: "Wireless",
    subcategory: "AI-Driven WiFi",
    icon: "📡",
    color: "bg-orange-500",
    description: "HPE Aruba Wireless Solutions",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "ClearPass", "API"],
    commonFeatures: ["Central", "ClearPass", "Wi-Fi 6E", "InstantOn", "AOS"],
    models: [
      {
        id: "aruba-7030",
        name: "7030 Mobility Controller",
        series: "7000 Series",
        category: "Wireless Controller",
        deployment: ["Appliance", "VM"],
        maxUsers: "2,048 APs",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["802.1X", "WPA3", "Wi-Fi 6E", "Instant", "Central WebAuth"]
      },
      {
        id: "ap-635",
        name: "AP-635",
        series: "630 Series",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "3.9 Gbps",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "BLE", "Zigbee", "Thread"]
      },
      {
        id: "ap-567",
        name: "AP-567",
        series: "560 Series",
        category: "Outdoor AP",
        deployment: ["Outdoor"],
        throughput: "2.9 Gbps",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["Wi-Fi 6", "802.1X", "WPA3", "Weather Resistant", "Mesh"]
      }
    ]
  },
  {
    id: "ruckus-wireless",
    name: "Ruckus Wireless",
    category: "Wireless",
    subcategory: "High-Performance WiFi",
    icon: "⚡",
    color: "bg-yellow-600",
    description: "CommScope Ruckus Wireless",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "RADIUS", "API"],
    commonFeatures: ["SmartZone", "BeamFlex", "ChannelFly", "Wi-Fi 6", "Cloud"],
    models: [
      {
        id: "smartzone-100",
        name: "SmartZone 100",
        series: "SmartZone",
        category: "Wireless Controller",
        deployment: ["Appliance", "VM"],
        maxUsers: "1,024 APs",
        firmwareVersions: ["6.1.2.0", "6.0.1.0", "5.2.2.0", "5.1.2.0"],
        capabilities: ["802.1X", "WPA3", "Wi-Fi 6", "Mesh", "Central WebAuth"]
      },
      {
        id: "r750",
        name: "R750",
        series: "R700",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "1.8 Gbps",
        firmwareVersions: ["200.14.10.2.584", "200.13.10.2.542", "200.12.10.2.408"],
        capabilities: ["Wi-Fi 6", "802.1X", "WPA3", "BeamFlex+", "MU-MIMO"]
      }
    ]
  },
  {
    id: "meraki-wireless",
    name: "Cisco Meraki",
    category: "Wireless",
    subcategory: "Cloud-Managed WiFi",
    icon: "☁️",
    color: "bg-green-500",
    description: "Cisco Meraki Cloud Wireless",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "API", "Cloud"],
    commonFeatures: ["Cloud Management", "Dashboard", "Wi-Fi 6", "Location Analytics"],
    models: [
      {
        id: "mr57",
        name: "MR57",
        series: "MR50",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "3.0 Gbps",
        firmwareVersions: ["29.7.1", "29.6.1", "28.7.1", "28.6.1"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "BLE", "Cloud Management"]
      },
      {
        id: "mr86",
        name: "MR86",
        series: "MR80",
        category: "Outdoor AP",
        deployment: ["Outdoor"],
        throughput: "5.4 Gbps",
        firmwareVersions: ["29.7.1", "29.6.1", "28.7.1", "28.6.1"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "Weather Resistant", "Mesh"]
      }
    ]
  },

  // ========== FIREWALL VENDORS ==========
  {
    id: "fortinet-fortigate",
    name: "Fortinet FortiGate",
    category: "Firewall",
    subcategory: "NGFW",
    icon: "🔥",
    color: "bg-red-500",
    description: "FortiGate Next-Generation Firewalls",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "FSSO", "FortiAuthenticator"],
    commonFeatures: ["Security Fabric", "FortiGuard", "SSL Inspection", "SD-WAN", "ZTNA"],
    models: [
      {
        id: "fg-60f",
        name: "FortiGate 60F",
        series: "60 Series",
        category: "Small Office",
        throughput: "10 Gbps",
        ports: "5x GbE + 2x SFP",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["NGFW", "VPN", "SD-WAN", "IPS", "AV", "Web Filtering", "FortiGuard"]
      },
      {
        id: "fg-100f",
        name: "FortiGate 100F",
        series: "100 Series",
        category: "Branch Office",
        throughput: "25 Gbps",
        ports: "14x GbE + 2x SFP+",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["NGFW", "VPN", "SD-WAN", "IPS", "AV", "Web Filtering", "FortiGuard", "HA"]
      },
      {
        id: "fg-600e",
        name: "FortiGate 600E",
        series: "600 Series",
        category: "Mid-Range",
        throughput: "76 Gbps",
        ports: "18x GbE + 8x SFP+",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["NGFW", "VPN", "SD-WAN", "IPS", "AV", "Web Filtering", "FortiGuard", "HA", "VDOM"]
      },
      {
        id: "fg-3000d",
        name: "FortiGate 3000D",
        series: "3000 Series",
        category: "Data Center",
        throughput: "304 Gbps",
        ports: "32x SFP+ + 2x QSFP+",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15"],
        capabilities: ["NGFW", "VPN", "IPS", "AV", "Web Filtering", "FortiGuard", "HA", "VDOM", "Clustering"]
      }
    ]
  },
  {
    id: "palo-alto",
    name: "Palo Alto Networks",
    category: "Firewall",
    subcategory: "NGFW",
    icon: "🛡️",
    color: "bg-orange-600",
    description: "Palo Alto Networks Next-Generation Firewalls",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "SAML", "User-ID"],
    commonFeatures: ["App-ID", "User-ID", "Content-ID", "Threat Prevention", "WildFire"],
    models: [
      {
        id: "pa-220",
        name: "PA-220",
        series: "PA-200 Series",
        category: "Small Office",
        throughput: "0.9 Gbps",
        ports: "8x GbE",
        firmwareVersions: ["11.1.4", "11.0.6", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "IPS", "AV", "URL Filtering", "WildFire"]
      },
      {
        id: "pa-440",
        name: "PA-440",
        series: "PA-400 Series",
        category: "Branch Office",
        throughput: "3.6 Gbps",
        ports: "8x GbE + 2x SFP",
        firmwareVersions: ["11.1.4", "11.0.6", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "IPS", "AV", "URL Filtering", "WildFire", "SD-WAN"]
      },
      {
        id: "pa-3220",
        name: "PA-3220",
        series: "PA-3200 Series",
        category: "Mid-Range",
        throughput: "23.4 Gbps",
        ports: "16x GbE + 4x SFP+",
        firmwareVersions: ["11.1.4", "11.0.6", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "IPS", "AV", "URL Filtering", "WildFire", "HA"]
      },
      {
        id: "pa-5450",
        name: "PA-5450",
        series: "PA-5400 Series",
        category: "Data Center",
        throughput: "122 Gbps",
        ports: "8x QSFP28 + 16x SFP+",
        firmwareVersions: ["11.1.4", "11.0.6", "10.2.9"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "IPS", "AV", "URL Filtering", "WildFire", "HA", "Active/Active"]
      }
    ]
  },
  {
    id: "checkpoint",
    name: "Check Point",
    category: "Firewall",
    subcategory: "NGFW",
    icon: "✅",
    color: "bg-red-600",
    description: "Check Point Next Generation Firewalls",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "Identity Awareness"],
    commonFeatures: ["Threat Prevention", "Identity Awareness", "Infinity", "CloudGuard", "SandBlast"],
    models: [
      {
        id: "cp-1570",
        name: "1570 Security Appliance",
        series: "1500 Series",
        category: "Small Office",
        throughput: "7.5 Gbps",
        ports: "8x GbE + 2x SFP+",
        firmwareVersions: ["R81.20", "R81.10", "R80.40", "R80.30"],
        capabilities: ["NGFW", "IPS", "AV", "Anti-Bot", "URL Filtering", "Identity Awareness"]
      },
      {
        id: "cp-3200",
        name: "3200 Security Appliance",
        series: "3000 Series",
        category: "Mid-Range",
        throughput: "20 Gbps",
        ports: "12x GbE + 4x SFP+",
        firmwareVersions: ["R81.20", "R81.10", "R80.40", "R80.30"],
        capabilities: ["NGFW", "IPS", "AV", "Anti-Bot", "URL Filtering", "Identity Awareness", "HA"]
      },
      {
        id: "cp-26000",
        name: "26000 Security Appliance",
        series: "26000 Series",
        category: "Data Center",
        throughput: "150 Gbps",
        ports: "8x QSFP28 + 8x SFP+",
        firmwareVersions: ["R81.20", "R81.10", "R80.40"],
        capabilities: ["NGFW", "IPS", "AV", "Anti-Bot", "URL Filtering", "Identity Awareness", "HA", "Clustering"]
      }
    ]
  },
  {
    id: "sonicwall",
    name: "SonicWall",
    category: "Firewall",
    subcategory: "NGFW",
    icon: "🔊",
    color: "bg-blue-700",
    description: "SonicWall Network Security Appliances",
    supportLevel: "partial",
    portnoxCompatibility: "limited",
    integrationMethods: ["RADIUS", "LDAP", "API"],
    commonFeatures: ["SonicOS", "Capture ATP", "DPI-SSL", "Application Control"],
    models: [
      {
        id: "tz370",
        name: "TZ370",
        series: "TZ Series",
        category: "Small Office",
        throughput: "1.0 Gbps",
        ports: "5x GbE + 2x USB",
        firmwareVersions: ["7.0.1-5154", "7.0.0-5095", "6.5.4.7-83n"],
        capabilities: ["NGFW", "VPN", "IPS", "AV", "Content Filtering", "DPI-SSL"]
      },
      {
        id: "nsa2700",
        name: "NSA 2700",
        series: "NSA Series",
        category: "Mid-Range",
        throughput: "15 Gbps",
        ports: "8x GbE + 4x SFP+",
        firmwareVersions: ["7.0.1-5154", "7.0.0-5095", "6.5.4.7-83n"],
        capabilities: ["NGFW", "VPN", "IPS", "AV", "Content Filtering", "DPI-SSL", "HA"]
      }
    ]
  },

  // ========== VPN VENDORS ==========
  {
    id: "fortinet-vpn",
    name: "Fortinet VPN",
    category: "VPN",
    subcategory: "SSL/IPSec VPN",
    icon: "🔐",
    color: "bg-red-500",
    description: "FortiGate VPN Solutions",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "LDAP", "SAML", "FortiAuthenticator"],
    commonFeatures: ["SSL VPN", "IPSec VPN", "ZTNA", "FortiClient", "Certificate Auth"],
    models: [
      {
        id: "forticlient-ems",
        name: "FortiClient EMS",
        series: "Management",
        category: "VPN Management",
        deployment: ["On-Premise", "Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.4.1", "7.2.4", "7.0.11", "6.4.9"],
        capabilities: ["SSL VPN", "IPSec VPN", "Endpoint Control", "Certificate Management", "ZTNA"]
      },
      {
        id: "fortigate-ssl-vpn",
        name: "FortiGate SSL VPN",
        series: "Integrated",
        category: "Integrated VPN",
        deployment: ["Appliance"],
        maxUsers: "Variable by Model",
        firmwareVersions: ["7.4.5", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["SSL VPN", "IPSec VPN", "Web Portal", "Tunnel Mode", "Certificate Auth"]
      }
    ]
  },
  {
    id: "cisco-anyconnect",
    name: "Cisco AnyConnect",
    category: "VPN",
    subcategory: "SSL VPN",
    icon: "🌐",
    color: "bg-blue-600",
    description: "Cisco AnyConnect Secure Mobility",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "LDAP", "SAML", "ISE"],
    commonFeatures: ["SSL VPN", "Per-App VPN", "Network Access Manager", "Umbrella"],
    models: [
      {
        id: "anyconnect-plus",
        name: "AnyConnect Plus",
        series: "AnyConnect",
        category: "SSL VPN Client",
        deployment: ["Software"],
        maxUsers: "Unlimited",
        firmwareVersions: ["4.10.08025", "4.10.07073", "4.10.06079", "4.10.05085"],
        capabilities: ["SSL VPN", "Per-App VPN", "Network Access Manager", "Umbrella Integration"]
      },
      {
        id: "asa-5516-x",
        name: "ASA 5516-X",
        series: "ASA 5500-X",
        category: "VPN Concentrator",
        deployment: ["Appliance"],
        maxUsers: "750 SSL VPN",
        firmwareVersions: ["9.20.4.1", "9.19.1.7", "9.18.4.15", "9.16.4.57"],
        capabilities: ["SSL VPN", "IPSec VPN", "Clientless VPN", "AnyConnect", "Certificate Auth"]
      }
    ]
  },
  {
    id: "palo-alto-globalprotect",
    name: "Palo Alto GlobalProtect",
    category: "VPN",
    subcategory: "SASE VPN",
    icon: "🛡️",
    color: "bg-orange-600",
    description: "Palo Alto GlobalProtect VPN",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["SAML", "RADIUS", "Certificate", "User-ID"],
    commonFeatures: ["SASE", "ZTNA", "HIP Check", "Portal/Gateway", "Mobile"],
    models: [
      {
        id: "globalprotect-client",
        name: "GlobalProtect Client",
        series: "GlobalProtect",
        category: "VPN Client",
        deployment: ["Software"],
        maxUsers: "Unlimited",
        firmwareVersions: ["6.2.4", "6.1.4", "6.0.9", "5.2.14"],
        capabilities: ["SSL VPN", "IPSec VPN", "HIP Check", "Always-On VPN", "Per-App VPN"]
      },
      {
        id: "prisma-access",
        name: "Prisma Access",
        series: "Prisma",
        category: "Cloud VPN",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["3.2.6", "3.1.12", "3.0.8", "2.2.18"],
        capabilities: ["SASE", "ZTNA", "Cloud VPN", "GlobalProtect", "Mobile Access"]
      }
    ]
  },
  {
    id: "checkpoint-vpn",
    name: "Check Point VPN",
    category: "VPN",
    subcategory: "VPN Solutions",
    icon: "✅",
    color: "bg-red-600",
    description: "Check Point VPN Solutions",
    supportLevel: "partial",
    portnoxCompatibility: "limited",
    integrationMethods: ["RADIUS", "LDAP", "Certificate"],
    commonFeatures: ["SSL VPN", "IPSec VPN", "Mobile Access", "Endpoint Security"],
    models: [
      {
        id: "checkpoint-mobile",
        name: "Check Point Mobile",
        series: "Mobile VPN",
        category: "VPN Client",
        deployment: ["Software"],
        maxUsers: "Unlimited",
        firmwareVersions: ["E87.30", "E86.70", "E85.30", "E84.40"],
        capabilities: ["SSL VPN", "IPSec VPN", "Mobile Access", "Certificate Auth"]
      }
    ]
  },

  // ========== SIEM VENDORS ==========
  {
    id: "splunk",
    name: "Splunk",
    category: "SIEM",
    subcategory: "Enterprise SIEM",
    icon: "📊",
    color: "bg-green-600",
    description: "Splunk Security Information and Event Management",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["Syslog", "API", "REST", "Universal Forwarder"],
    commonFeatures: ["Machine Learning", "UEBA", "SOAR", "Threat Intelligence", "Cloud"],
    models: [
      {
        id: "splunk-enterprise",
        name: "Splunk Enterprise",
        series: "Enterprise",
        category: "On-Premise SIEM",
        deployment: ["On-Premise", "Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["9.2.3", "9.1.6", "9.0.10", "8.2.12"],
        capabilities: ["SIEM", "Log Analysis", "Machine Learning", "Dashboards", "Alerting", "API"]
      },
      {
        id: "splunk-cloud",
        name: "Splunk Cloud Platform",
        series: "Cloud",
        category: "Cloud SIEM",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["9.2.2403", "9.1.2312", "9.0.2208"],
        capabilities: ["Cloud SIEM", "Auto-scaling", "Machine Learning", "SOAR", "Threat Intelligence"]
      }
    ]
  },
  {
    id: "qradar",
    name: "IBM QRadar",
    category: "SIEM",
    subcategory: "Enterprise SIEM",
    icon: "🤖",
    color: "bg-blue-800",
    description: "IBM QRadar SIEM Platform",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["Syslog", "API", "DSM", "Flow"],
    commonFeatures: ["AI/ML", "UEBA", "Threat Intelligence", "Use Cases", "Watson"],
    models: [
      {
        id: "qradar-siem",
        name: "QRadar SIEM",
        series: "QRadar",
        category: "SIEM Platform",
        deployment: ["On-Premise", "Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.5.0 UP9", "7.4.3 FP11", "7.3.3 FP11"],
        capabilities: ["SIEM", "Log Management", "Network Flow", "Asset Discovery", "Threat Intelligence"]
      }
    ]
  },
  {
    id: "arcsight",
    name: "ArcSight ESM",
    category: "SIEM",
    subcategory: "Enterprise SIEM",
    icon: "🎯",
    color: "bg-blue-700",
    description: "Micro Focus ArcSight Enterprise Security Manager",
    supportLevel: "limited",
    portnoxCompatibility: "api",
    integrationMethods: ["Syslog", "CEF", "API", "SmartConnectors"],
    commonFeatures: ["Real-time Correlation", "SmartConnectors", "Compliance", "Dashboards"],
    models: [
      {
        id: "arcsight-esm",
        name: "ArcSight ESM",
        series: "ESM",
        category: "SIEM Platform",
        deployment: ["On-Premise"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.6.0", "7.5.0", "7.4.0", "7.3.0"],
        capabilities: ["SIEM", "Real-time Correlation", "SmartConnectors", "Compliance Reporting"]
      }
    ]
  },
  {
    id: "sentinel",
    name: "Microsoft Sentinel",
    category: "SIEM",
    subcategory: "Cloud SIEM",
    icon: "☁️",
    color: "bg-blue-500",
    description: "Microsoft Sentinel Cloud-Native SIEM",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "Data Connectors", "Logic Apps", "REST"],
    commonFeatures: ["Cloud-Native", "AI/ML", "SOAR", "Threat Intelligence", "Azure Integration"],
    models: [
      {
        id: "sentinel-cloud",
        name: "Microsoft Sentinel",
        series: "Sentinel",
        category: "Cloud SIEM",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Cloud-Current", "Cloud-Preview"],
        capabilities: ["Cloud SIEM", "AI Analytics", "SOAR", "Threat Hunting", "Data Connectors"]
      }
    ]
  },

  // ========== IDENTITY VENDORS ==========
  {
    id: "azure-ad",
    name: "Microsoft Entra ID",
    category: "Identity",
    subcategory: "Cloud Identity",
    icon: "☁️",
    color: "bg-blue-500",
    description: "Microsoft Entra ID (Azure AD)",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["SAML", "SCIM", "Graph API", "RADIUS"],
    commonFeatures: ["SSO", "MFA", "Conditional Access", "Identity Protection", "PIM"],
    models: [
      {
        id: "entra-id-free",
        name: "Entra ID Free",
        series: "Entra ID",
        category: "Basic Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "Basic MFA", "User Management", "Group Management"]
      },
      {
        id: "entra-id-p1",
        name: "Entra ID Premium P1",
        series: "Entra ID",
        category: "Premium Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "MFA", "Conditional Access", "Self-Service", "Hybrid Identity"]
      },
      {
        id: "entra-id-p2",
        name: "Entra ID Premium P2",
        series: "Entra ID",
        category: "Advanced Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "MFA", "Conditional Access", "Identity Protection", "PIM", "Access Reviews"]
      }
    ]
  },
  {
    id: "okta",
    name: "Okta",
    category: "Identity",
    subcategory: "Identity Platform",
    icon: "🔑",
    color: "bg-blue-600",
    description: "Okta Identity Cloud",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["SAML", "SCIM", "API", "RADIUS"],
    commonFeatures: ["SSO", "MFA", "Lifecycle Management", "API Access", "Workflows"],
    models: [
      {
        id: "okta-workforce",
        name: "Okta Workforce Identity",
        series: "Workforce",
        category: "Employee Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview", "Classic"],
        capabilities: ["SSO", "MFA", "Lifecycle Management", "API Access", "Universal Directory"]
      },
      {
        id: "okta-customer",
        name: "Okta Customer Identity",
        series: "Customer",
        category: "Customer Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["CIAM", "Registration", "MFA", "Social Login", "Progressive Profiling"]
      }
    ]
  },
  {
    id: "ping-identity",
    name: "Ping Identity",
    category: "Identity",
    subcategory: "Identity Platform",
    icon: "🏓",
    color: "bg-orange-500",
    description: "PingOne Cloud Identity Platform",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["SAML", "OAuth", "API", "SCIM"],
    commonFeatures: ["SSO", "MFA", "Risk Management", "API Security", "Directory"],
    models: [
      {
        id: "pingone-sso",
        name: "PingOne SSO",
        series: "PingOne",
        category: "Cloud SSO",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "SAML", "OAuth", "OIDC", "Social Login"]
      },
      {
        id: "pingone-mfa",
        name: "PingOne MFA",
        series: "PingOne",
        category: "Cloud MFA",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["MFA", "Risk-based Auth", "Push Notifications", "Biometrics", "FIDO2"]
      }
    ]
  },
  {
    id: "auth0",
    name: "Auth0",
    category: "Identity",
    subcategory: "Customer Identity",
    icon: "🔐",
    color: "bg-orange-600",
    description: "Auth0 Customer Identity Platform",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "SAML", "OAuth", "SCIM"],
    commonFeatures: ["CIAM", "Universal Login", "MFA", "Social Connections", "Rules"],
    models: [
      {
        id: "auth0-b2c",
        name: "Auth0 B2C",
        series: "Auth0",
        category: "Customer Identity",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current"],
        capabilities: ["CIAM", "Universal Login", "Social Login", "MFA", "Progressive Profiling"]
      }
    ]
  },

  // ========== EDR VENDORS ==========
  {
    id: "crowdstrike",
    name: "CrowdStrike Falcon",
    category: "EDR",
    subcategory: "Cloud EDR",
    icon: "🦅",
    color: "bg-red-500",
    description: "CrowdStrike Falcon Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "Streaming API", "Webhooks", "SIEM Integration"],
    commonFeatures: ["AI/ML Detection", "Threat Hunting", "IOA/IOC", "Cloud-Native", "Real-time Response"],
    models: [
      {
        id: "falcon-go",
        name: "Falcon Go",
        series: "Falcon",
        category: "Basic EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.18", "7.17", "7.16", "7.15"],
        capabilities: ["Next-Gen AV", "Machine Learning", "Behavioral Analytics", "Cloud Management"]
      },
      {
        id: "falcon-pro",
        name: "Falcon Pro",
        series: "Falcon",
        category: "Advanced EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.18", "7.17", "7.16", "7.15"],
        capabilities: ["EDR", "Threat Hunting", "IOA/IOC", "Real-time Response", "Custom IOCs"]
      },
      {
        id: "falcon-enterprise",
        name: "Falcon Enterprise",
        series: "Falcon",
        category: "Enterprise EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["7.18", "7.17", "7.16", "7.15"],
        capabilities: ["Advanced EDR", "Threat Intelligence", "Sandbox Analysis", "SOAR Integration"]
      }
    ]
  },
  {
    id: "sentinelone",
    name: "SentinelOne",
    category: "EDR",
    subcategory: "Autonomous EDR",
    icon: "🤖",
    color: "bg-purple-600",
    description: "SentinelOne Singularity Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST API", "Webhooks", "SIEM Connectors"],
    commonFeatures: ["Autonomous Response", "AI/ML", "Behavioral AI", "Rollback", "Threat Hunting"],
    models: [
      {
        id: "singularity-core",
        name: "Singularity Core",
        series: "Singularity",
        category: "Core EDR",
        deployment: ["Cloud", "On-Premise"],
        maxUsers: "Unlimited",
        firmwareVersions: ["23.4.2", "23.3.2", "23.2.3", "23.1.4"],
        capabilities: ["Next-Gen AV", "Behavioral AI", "Autonomous Response", "Rollback"]
      },
      {
        id: "singularity-control",
        name: "Singularity Control",
        series: "Singularity",
        category: "Advanced EDR",
        deployment: ["Cloud", "On-Premise"],
        maxUsers: "Unlimited",
        firmwareVersions: ["23.4.2", "23.3.2", "23.2.3", "23.1.4"],
        capabilities: ["EDR", "Threat Hunting", "Deep Visibility", "Custom Rules", "Investigation"]
      }
    ]
  },
  {
    id: "microsoft-defender",
    name: "Microsoft Defender for Endpoint",
    category: "EDR",
    subcategory: "Integrated EDR",
    icon: "🛡️",
    color: "bg-blue-500",
    description: "Microsoft Defender for Endpoint",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["Graph API", "Security API", "SIEM Connectors"],
    commonFeatures: ["Integrated Security", "Threat Analytics", "Attack Surface Reduction", "Auto Investigation"],
    models: [
      {
        id: "defender-p1",
        name: "Defender for Endpoint P1",
        series: "Defender",
        category: "Basic EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["Next-Gen AV", "Attack Surface Reduction", "Device Control", "Web Protection"]
      },
      {
        id: "defender-p2",
        name: "Defender for Endpoint P2",
        series: "Defender",
        category: "Advanced EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["EDR", "Threat Analytics", "Auto Investigation", "Threat Hunting", "Live Response"]
      }
    ]
  },
  {
    id: "carbon-black",
    name: "VMware Carbon Black",
    category: "EDR",
    subcategory: "Cloud EDR",
    icon: "⚫",
    color: "bg-gray-700",
    description: "VMware Carbon Black Cloud",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST API", "SIEM Connectors"],
    commonFeatures: ["Behavioral Monitoring", "Threat Hunting", "Application Control", "Device Control"],
    models: [
      {
        id: "cb-cloud-endpoint",
        name: "Carbon Black Cloud Endpoint",
        series: "CB Cloud",
        category: "Endpoint Protection",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "LTS"],
        capabilities: ["Next-Gen AV", "Behavioral Monitoring", "Application Control", "Device Control"]
      },
      {
        id: "cb-cloud-enterprise",
        name: "Carbon Black Cloud Enterprise EDR",
        series: "CB Cloud",
        category: "Enterprise EDR",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "LTS"],
        capabilities: ["EDR", "Threat Hunting", "Live Response", "Vulnerability Assessment"]
      }
    ]
  },

  // ========== MDM VENDORS ==========
  {
    id: "microsoft-intune",
    name: "Microsoft Intune",
    category: "MDM",
    subcategory: "Cloud MDM",
    icon: "📱",
    color: "bg-blue-500",
    description: "Microsoft Intune Mobile Device Management",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["Graph API", "SCEP", "Certificate Connector"],
    commonFeatures: ["Device Management", "App Management", "Conditional Access", "Compliance", "Co-Management"],
    models: [
      {
        id: "intune-standalone",
        name: "Intune Standalone",
        series: "Intune",
        category: "Cloud MDM",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["MDM", "MAM", "Conditional Access", "Compliance Policies", "App Protection"]
      },
      {
        id: "intune-ems",
        name: "Intune (EMS E3/E5)",
        series: "Enterprise Mobility",
        category: "Enterprise MDM",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["MDM", "MAM", "Identity Protection", "Information Protection", "Cloud App Security"]
      }
    ]
  },
  {
    id: "vmware-workspace-one",
    name: "VMware Workspace ONE",
    category: "MDM",
    subcategory: "UEM Platform",
    icon: "🏢",
    color: "bg-green-600",
    description: "VMware Workspace ONE UEM",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST API", "SCEP", "Certificate Authority"],
    commonFeatures: ["UEM", "Digital Workspace", "App Management", "Identity", "Analytics"],
    models: [
      {
        id: "ws1-uem",
        name: "Workspace ONE UEM",
        series: "Workspace ONE",
        category: "Unified Endpoint Management",
        deployment: ["Cloud", "On-Premise"],
        maxUsers: "Unlimited",
        firmwareVersions: ["2312", "2309", "2306", "2303"],
        capabilities: ["MDM", "MAM", "Email Management", "Content Management", "Telecom Management"]
      },
      {
        id: "ws1-intelligence",
        name: "Workspace ONE Intelligence",
        series: "Workspace ONE",
        category: "Analytics Platform",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current"],
        capabilities: ["Analytics", "Automation", "Risk Assessment", "Digital Experience", "Benchmarking"]
      }
    ]
  },
  {
    id: "jamf",
    name: "Jamf",
    category: "MDM",
    subcategory: "Apple MDM",
    icon: "🍎",
    color: "bg-gray-800",
    description: "Jamf Apple Device Management",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST API", "SCEP"],
    commonFeatures: ["Apple Focused", "Zero Touch", "Self Service", "Jamf Connect", "Jamf Protect"],
    models: [
      {
        id: "jamf-pro",
        name: "Jamf Pro",
        series: "Jamf Pro",
        category: "Enterprise Apple MDM",
        deployment: ["Cloud", "On-Premise"],
        maxUsers: "Unlimited",
        firmwareVersions: ["11.8.0", "11.7.1", "11.6.2", "11.5.1"],
        capabilities: ["MDM", "App Management", "Patch Management", "Self Service", "Zero Touch"]
      },
      {
        id: "jamf-now",
        name: "Jamf Now",
        series: "Jamf Now",
        category: "SMB Apple MDM",
        deployment: ["Cloud"],
        maxUsers: "Up to 30 devices free",
        firmwareVersions: ["Current"],
        capabilities: ["Basic MDM", "App Management", "Device Inventory", "Remote Lock/Wipe"]
      }
    ]
  },
  {
    id: "mobileiron",
    name: "Ivanti MobileIron",
    category: "MDM",
    subcategory: "Enterprise MDM",
    icon: "🔒",
    color: "bg-blue-700",
    description: "Ivanti MobileIron UEM",
    supportLevel: "limited",
    portnoxCompatibility: "limited",
    integrationMethods: ["API", "SCEP"],
    commonFeatures: ["UEM", "Zero Sign-On", "Threat Defense", "Privacy", "Compliance"],
    models: [
      {
        id: "mobileiron-cloud",
        name: "MobileIron Cloud",
        series: "MobileIron",
        category: "Cloud UEM",
        deployment: ["Cloud"],
        maxUsers: "Unlimited",
        firmwareVersions: ["Current", "Previous"],
        capabilities: ["UEM", "Zero Sign-On", "App Management", "Threat Defense", "Privacy Controls"]
      }
    ]
  }
];

// Helper functions
export const getVendorById = (id: string): ExpandedVendor | undefined => {
  return expandedVendorLibrary.find(vendor => vendor.id === id);
};

export const getModelById = (vendorId: string, modelId: string): VendorModel | undefined => {
  const vendor = getVendorById(vendorId);
  return vendor?.models.find(model => model.id === modelId);
};

export const getModelsByVendor = (vendorId: string): VendorModel[] => {
  const vendor = getVendorById(vendorId);
  return vendor?.models || [];
};

export const getAllVendorNames = (): string[] => {
  return expandedVendorLibrary.map(vendor => vendor.name);
};

export const getVendorsByCategory = (category: string): ExpandedVendor[] => {
  return expandedVendorLibrary.filter(vendor => vendor.category === category);
};

export const getVendorCategories = (): string[] => {
  return [...new Set(expandedVendorLibrary.map(vendor => vendor.category))];
};

export const getTotalVendorsCount = (): number => {
  return expandedVendorLibrary.length;
};

export const getTotalModelsCount = (): number => {
  return expandedVendorLibrary.reduce((total, vendor) => total + vendor.models.length, 0);
};

// Category statistics
export const getCategoryStats = () => {
  const stats: Record<string, { vendors: number; models: number }> = {};
  
  expandedVendorLibrary.forEach(vendor => {
    if (!stats[vendor.category]) {
      stats[vendor.category] = { vendors: 0, models: 0 };
    }
    stats[vendor.category].vendors++;
    stats[vendor.category].models += vendor.models.length;
  });
  
  return stats;
};