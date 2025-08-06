// Comprehensive vendor data with models and firmware versions for all major network vendors

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
}

export interface ComprehensiveVendor {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  models: VendorModel[];
  commonFeatures: string[];
  supportLevel: 'full' | 'partial' | 'limited';
}

export const comprehensiveVendorData: ComprehensiveVendor[] = [
  {
    id: "portnox",
    name: "Portnox",
    category: "NAC Primary",
    icon: "🔐",
    color: "bg-blue-500",
    description: "AI-Optimized Network Access Control",
    supportLevel: "full",
    commonFeatures: ["AI Analytics", "Zero Trust", "BYOD", "IoT Discovery", "Automated Response"],
    models: [
      {
        id: "portnox-core",
        name: "Portnox CORE",
        series: "Enterprise",
        category: "NAC Platform",
        firmwareVersions: ["6.5.0", "6.4.2", "6.4.1", "6.3.5"],
        capabilities: ["802.1X", "RADIUS", "Device Profiling", "Policy Engine"]
      },
      {
        id: "portnox-cloud",
        name: "Portnox CLEAR",
        series: "Cloud",
        category: "Cloud NAC",
        firmwareVersions: ["Cloud-Latest", "Cloud-Stable"],
        capabilities: ["Cloud Management", "Global Policies", "Multi-Tenant"]
      }
    ]
  },
  {
    id: "fortiswitch",
    name: "FortiSwitch",
    category: "Switch",
    icon: "🛡️",
    color: "bg-red-500",
    description: "Fortinet Secure Switching",
    supportLevel: "full",
    commonFeatures: ["Security Fabric", "802.1X", "Multi-Auth", "Zero Touch", "AI-Driven"],
    models: [
      // FortiSwitch 100 Series
      {
        id: "fs-108e",
        name: "FortiSwitch 108E",
        series: "100 Series",
        category: "Entry Level",
        ports: "8x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2", "802.1X", "VLAN", "QoS", "LLDP"]
      },
      {
        id: "fs-124e",
        name: "FortiSwitch 124E",
        series: "100 Series", 
        category: "Entry Level",
        ports: "24x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2", "802.1X", "VLAN", "QoS", "LLDP", "Multi-Auth"]
      },
      {
        id: "fs-148e",
        name: "FortiSwitch 148E",
        series: "100 Series",
        category: "Entry Level", 
        ports: "48x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2", "802.1X", "VLAN", "QoS", "LLDP", "Multi-Auth"]
      },
      // FortiSwitch 200 Series
      {
        id: "fs-224d",
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
        id: "fs-248d",
        name: "FortiSwitch 248D-FPOE",
        series: "200 Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2", "802.1X", "PoE+", "Stacking", "Multi-Auth", "MAB"]
      },
      // FortiSwitch 400 Series
      {
        id: "fs-424d",
        name: "FortiSwitch 424D",
        series: "400 Series",
        category: "Aggregation",
        ports: "24x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["L2/L3", "802.1X", "OSPF", "BGP", "Stacking", "Multi-Auth"]
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
      },
      // FortiSwitch 1000 Series
      {
        id: "fs-1024d",
        name: "FortiSwitch 1024D",
        series: "1000 Series",
        category: "Data Center",
        ports: "24x 10GbE SFP+ + 2x 40GbE QSFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7"],
        capabilities: ["L2/L3", "VXLAN", "EVPN", "BGP", "OSPF", "802.1X"]
      },
      {
        id: "fs-1048e",
        name: "FortiSwitch 1048E",
        series: "1000 Series",
        category: "Data Center",
        ports: "48x 10GbE SFP+ + 6x 40GbE QSFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7"],
        capabilities: ["L2/L3", "VXLAN", "EVPN", "BGP", "OSPF", "802.1X"]
      }
    ]
  },
  {
    id: "cisco",
    name: "Cisco",
    category: "Enterprise",
    icon: "🌐",
    color: "bg-blue-600",
    description: "Enterprise Networking Leader",
    supportLevel: "full",
    commonFeatures: ["DNA Center", "ISE Integration", "TrustSec", "SDA", "Catalyst Center"],
    models: [
      // Catalyst 9200 Series
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
      // Catalyst 9300 Series
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
      // Catalyst 9400 Series
      {
        id: "c9407r",
        name: "Catalyst 9407R",
        series: "Catalyst 9400",
        category: "Core/Distribution",
        ports: "Modular - 7 Slot",
        stackable: false,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "TrustSec", "SDA", "BGP", "OSPF", "Multi-Auth", "Multi-Domain"]
      },
      {
        id: "c9410r",
        name: "Catalyst 9410R",
        series: "Catalyst 9400",
        category: "Core/Distribution", 
        ports: "Modular - 10 Slot",
        stackable: false,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05", "16.12.10"],
        capabilities: ["802.1X", "TrustSec", "SDA", "BGP", "OSPF", "Multi-Auth", "Multi-Domain"]
      },
      // Catalyst 9500 Series
      {
        id: "c9500-24y4c",
        name: "Catalyst 9500-24Y4C",
        series: "Catalyst 9500",
        category: "Core/Distribution",
        ports: "24x 25GbE + 4x 100GbE",
        stackable: true,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05"],
        capabilities: ["802.1X", "TrustSec", "SDA", "EVPN", "BGP", "OSPF", "Multi-Auth"]
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
      },
      // Catalyst 9600 Series
      {
        id: "c9606r",
        name: "Catalyst 9606R",
        series: "Catalyst 9600",
        category: "Core",
        ports: "Modular - 6 Slot",
        stackable: false,
        poe: false,
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04a", "17.06.05"],
        capabilities: ["802.1X", "TrustSec", "SDA", "EVPN", "BGP", "OSPF", "Segment Routing"]
      }
    ]
  },
  {
    id: "aruba",
    name: "Aruba (HPE)",
    category: "Wireless-First", 
    icon: "📡",
    color: "bg-orange-500",
    description: "Wireless-First Networking",
    supportLevel: "full",
    commonFeatures: ["ClearPass", "AOS-CX", "Central", "Dynamic VLAN", "PSK"],
    models: [
      // Aruba CX 6000 Series
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
      // Aruba CX 6300 Series
      {
        id: "cx6300-24g",
        name: "CX 6300M-24G",
        series: "CX 6300",
        category: "Access/Distribution",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "Dynamic VLAN", "VSX", "L3", "Multi-Auth"]
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
      },
      // Aruba CX 6400 Series
      {
        id: "cx6405",
        name: "CX 6405",
        series: "CX 6400",
        category: "Core/Distribution",
        ports: "Modular - 5 Slot",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "VSX", "L3", "BGP", "OSPF", "EVPN"]
      },
      // Aruba CX 8400 Series
      {
        id: "cx8400",
        name: "CX 8400",
        series: "CX 8400",
        category: "Core", 
        ports: "Modular - 8 Slot",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.13.1020", "10.12.1020", "10.11.1030", "10.10.1040"],
        capabilities: ["802.1X", "ClearPass", "VSX", "L3", "BGP", "OSPF", "EVPN", "Segment Routing"]
      }
    ]
  },
  {
    id: "juniper",
    name: "Juniper Networks",
    category: "Performance",
    icon: "🌲", 
    color: "bg-green-600",
    description: "High-Performance Networking",
    supportLevel: "full",
    commonFeatures: ["Junos", "EVPN-VXLAN", "Mist AI", "EX Series", "SRX"],
    models: [
      // EX2300 Series
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
      // EX3400 Series
      {
        id: "ex3400-24t",
        name: "EX3400-24T",
        series: "EX3400",
        category: "Access/Distribution",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3", "20.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "L3", "Multi-Auth"]
      },
      {
        id: "ex3400-48p",
        name: "EX3400-48P",
        series: "EX3400",
        category: "Access/Distribution",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3", "20.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "L3", "PoE+", "Multi-Auth"]
      },
      // EX4400 Series
      {
        id: "ex4400-24t",
        name: "EX4400-24T",
        series: "EX4400",
        category: "Access/Distribution",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["22.4R3", "22.3R3", "22.2R3", "21.4R3"],
        capabilities: ["802.1X", "MAC RADIUS", "Dynamic VLAN", "Virtual Chassis", "L3", "EVPN", "Multi-Auth"]
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
    id: "extreme", 
    name: "Extreme Networks",
    category: "Performance",
    icon: "⚡",
    color: "bg-purple-600",
    description: "Extreme Performance Solutions",
    supportLevel: "partial",
    commonFeatures: ["ExtremeControl", "Fabric", "VOSS", "EXOS", "Cloud IQ"],
    models: [
      // X440 Series
      {
        id: "x440-g2-24t",
        name: "X440-G2-24t-10G4",
        series: "X440-G2",
        category: "Access",
        ports: "24x GbE + 4x 10GbE",
        stackable: true,
        poe: false,
        firmwareVersions: ["32.7.1.4", "32.6.1.4", "32.5.1.4", "31.7.1.4"],
        capabilities: ["802.1X", "ExtremeControl", "Dynamic VLAN", "Stacking", "Multi-Auth"]
      },
      {
        id: "x440-g2-48p",
        name: "X440-G2-48p-10G4",
        series: "X440-G2",
        category: "Access",
        ports: "48x GbE + 4x 10GbE",
        stackable: true,
        poe: true,
        firmwareVersions: ["32.7.1.4", "32.6.1.4", "32.5.1.4", "31.7.1.4"],
        capabilities: ["802.1X", "ExtremeControl", "Dynamic VLAN", "Stacking", "PoE+", "Multi-Auth"]
      },
      // X460 Series
      {
        id: "x460-g2-24t",
        name: "X460-G2-24t-10G4",
        series: "X460-G2",
        category: "Distribution",
        ports: "24x GbE + 4x 10GbE",
        stackable: true,
        poe: false,
        firmwareVersions: ["32.7.1.4", "32.6.1.4", "32.5.1.4", "31.7.1.4"],
        capabilities: ["802.1X", "ExtremeControl", "Dynamic VLAN", "L3", "Stacking", "Multi-Auth"]
      },
      {
        id: "x460-g2-48p",
        name: "X460-G2-48p-10G4",
        series: "X460-G2",
        category: "Distribution",
        ports: "48x GbE + 4x 10GbE",
        stackable: true,
        poe: true,
        firmwareVersions: ["32.7.1.4", "32.6.1.4", "32.5.1.4", "31.7.1.4"],
        capabilities: ["802.1X", "ExtremeControl", "Dynamic VLAN", "L3", "Stacking", "PoE+", "Multi-Auth"]
      }
    ]
  },
  {
    id: "arista",
    name: "Arista Networks", 
    category: "Data Center",
    icon: "🏢",
    color: "bg-indigo-600",
    description: "Cloud-Scale Networking",
    supportLevel: "partial",
    commonFeatures: ["EOS", "CloudVision", "EVPN", "BGP", "MLAG"],
    models: [
      // 7050X3 Series
      {
        id: "7050sx3-48yc12",
        name: "7050SX3-48YC12",
        series: "7050X3",
        category: "ToR/Leaf",
        ports: "48x 25GbE + 12x 100GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["4.32.0F", "4.31.2F", "4.30.5M", "4.29.4M"],
        capabilities: ["802.1X", "VXLAN", "EVPN", "BGP", "OSPF", "MLAG"]
      },
      {
        id: "7050cx3-32s",
        name: "7050CX3-32S",
        series: "7050X3",
        category: "Spine/Leaf",
        ports: "32x 100GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["4.32.0F", "4.31.2F", "4.30.5M", "4.29.4M"],
        capabilities: ["802.1X", "VXLAN", "EVPN", "BGP", "OSPF", "MLAG"]
      },
      // 7280R3 Series
      {
        id: "7280sr3-48yc8",
        name: "7280SR3-48YC8",
        series: "7280R3",
        category: "ToR/Leaf",
        ports: "48x 25GbE + 8x 100GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["4.32.0F", "4.31.2F", "4.30.5M", "4.29.4M"],
        capabilities: ["802.1X", "VXLAN", "EVPN", "BGP", "OSPF", "MLAG", "Deep Buffers"]
      },
      {
        id: "7280cr3-32p4",
        name: "7280CR3-32P4",
        series: "7280R3",
        category: "Spine",
        ports: "32x 100GbE + 4x 400GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["4.32.0F", "4.31.2F", "4.30.5M", "4.29.4M"],
        capabilities: ["802.1X", "VXLAN", "EVPN", "BGP", "OSPF", "MLAG", "Deep Buffers"]
      }
    ]
  },
  {
    id: "azure",
    name: "Azure AD",
    category: "Cloud Identity",
    icon: "☁️",
    color: "bg-blue-400",
    description: "Cloud-Native Identity",
    supportLevel: "full",
    commonFeatures: ["Conditional Access", "SSO", "MFA", "SCIM", "Graph API"],
    models: [
      {
        id: "azure-ad-free",
        name: "Azure AD Free",
        series: "Free Tier",
        category: "Identity Service",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["Basic SSO", "User Management", "Group Management"]
      },
      {
        id: "azure-ad-p1",
        name: "Azure AD Premium P1",
        series: "Premium",
        category: "Identity Service", 
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["Conditional Access", "MFA", "Self-Service", "Hybrid Identity"]
      },
      {
        id: "azure-ad-p2",
        name: "Azure AD Premium P2",
        series: "Premium",
        category: "Identity Service",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["Identity Protection", "PIM", "Access Reviews", "Advanced Security"]
      }
    ]
  },
  {
    id: "palo-alto",
    name: "Palo Alto Networks",
    category: "Firewall",
    icon: "🛡️",
    color: "bg-red-600",
    description: "Next-Generation Firewall & Network Security",
    supportLevel: "full",
    commonFeatures: ["User-ID", "GlobalProtect", "App-ID", "Zero Trust", "Cloud Security"],
    models: [
      // PA-220 Series
      {
        id: "pa-220",
        name: "PA-220",
        series: "220 Series",
        category: "Desktop Firewall",
        ports: "8x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11", "10.0.12"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN"]
      },
      // PA-400 Series
      {
        id: "pa-415",
        name: "PA-415",
        series: "400 Series",
        category: "Branch Firewall",
        ports: "16x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "SD-WAN", "ML-Powered"]
      },
      {
        id: "pa-440",
        name: "PA-440",
        series: "400 Series",
        category: "Branch Firewall",
        ports: "16x GbE + 4x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "SD-WAN", "ML-Powered"]
      },
      // PA-800 Series
      {
        id: "pa-820",
        name: "PA-820",
        series: "800 Series",
        category: "Branch Firewall",
        ports: "8x GbE + 8x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN", "SD-WAN"]
      },
      {
        id: "pa-850",
        name: "PA-850",
        series: "800 Series",
        category: "Branch Firewall",
        ports: "8x GbE + 8x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "VPN", "SD-WAN"]
      },
      // PA-3200 Series
      {
        id: "pa-3220",
        name: "PA-3220",
        series: "3200 Series",
        category: "Enterprise Firewall",
        ports: "16x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering"]
      },
      {
        id: "pa-3260",
        name: "PA-3260",
        series: "3200 Series",
        category: "Enterprise Firewall",
        ports: "16x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering"]
      },
      // PA-5200 Series
      {
        id: "pa-5220",
        name: "PA-5220",
        series: "5200 Series",
        category: "Data Center Firewall",
        ports: "16x SFP+ + 4x QSFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering", "WildFire"]
      },
      {
        id: "pa-5260",
        name: "PA-5260",
        series: "5200 Series",
        category: "Data Center Firewall",
        ports: "16x SFP+ + 4x QSFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.11"],
        capabilities: ["User-ID", "App-ID", "Content-ID", "GlobalProtect", "HA", "Clustering", "WildFire"]
      }
    ]
  },
  {
    id: "hp-aruba",
    name: "HP Aruba",
    category: "Wireless",
    icon: "📡",
    color: "bg-blue-500",
    description: "Enterprise Wireless & Networking Solutions",
    supportLevel: "full",
    commonFeatures: ["Instant", "Central", "ClearPass", "AirWave", "AI Insights"],
    models: [
      // Aruba 500 Series
      {
        id: "ap-505",
        name: "AP-505",
        series: "500 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "PoE+", "BLE", "IoT Ready"]
      },
      {
        id: "ap-515",
        name: "AP-515",
        series: "500 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "PoE+", "BLE", "IoT Ready", "External Antenna"]
      },
      {
        id: "ap-555",
        name: "AP-555",
        series: "500 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5", "10.4.1.0"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "PoE++", "BLE", "IoT Ready", "High Density"]
      },
      // Aruba 600 Series
      {
        id: "ap-635",
        name: "AP-635",
        series: "600 Series",
        category: "Wi-Fi 6E Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "10.4.1.0"],
        capabilities: ["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee"]
      },
      {
        id: "ap-655",
        name: "AP-655",
        series: "600 Series",
        category: "Wi-Fi 6E Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "10.4.1.0"],
        capabilities: ["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee", "High Density"]
      },
      // Aruba 670 Series
      {
        id: "ap-675",
        name: "AP-675",
        series: "670 Series",
        category: "Wi-Fi 6E Access Point",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "10.4.1.0"],
        capabilities: ["Wi-Fi 6E", "4x4 MIMO", "6GHz", "PoE++", "BLE", "Zigbee", "External Antenna"]
      },
      // Aruba 7000 Series Controllers
      {
        id: "7005",
        name: "7005",
        series: "7000 Series",
        category: "Wireless Controller",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5"],
        capabilities: ["128 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management"]
      },
      {
        id: "7010",
        name: "7010",
        series: "7000 Series",
        category: "Wireless Controller",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5"],
        capabilities: ["512 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management", "Redundancy"]
      },
      {
        id: "7030",
        name: "7030",
        series: "7000 Series",
        category: "Wireless Controller",
        firmwareVersions: ["8.11.2.2", "8.10.0.8", "8.9.0.5"],
        capabilities: ["2048 APs", "AirMatch", "ClientMatch", "Adaptive Radio Management", "Clustering"]
      }
    ]
  },
  {
    id: "dell",
    name: "Dell Technologies",
    category: "Enterprise",
    icon: "💻",
    color: "bg-blue-700",
    description: "Enterprise Networking & Infrastructure",
    supportLevel: "full",
    commonFeatures: ["OS10", "SmartFabric", "VLT", "OpenManage", "Campus Fabric"],
    models: [
      // PowerSwitch N1100 Series
      {
        id: "n1108t-on",
        name: "N1108T-ON",
        series: "N1100 Series",
        category: "Access",
        ports: "8x GbE + 2x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLAN", "QoS", "LLDP", "ONIE"]
      },
      {
        id: "n1124t-on",
        name: "N1124T-ON",
        series: "N1100 Series",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLAN", "QoS", "LLDP", "ONIE", "Multi-Auth"]
      },
      {
        id: "n1148t-on",
        name: "N1148T-ON",
        series: "N1100 Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLAN", "QoS", "LLDP", "ONIE", "Multi-Auth"]
      },
      // PowerSwitch N2200 Series
      {
        id: "n2224px-on",
        name: "N2224PX-ON",
        series: "N2200 Series",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLT", "PoE+", "Stacking", "Multi-Auth", "Campus Fabric"]
      },
      {
        id: "n2248px-on",
        name: "N2248PX-ON",
        series: "N2200 Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLT", "PoE+", "Stacking", "Multi-Auth", "Campus Fabric"]
      },
      // PowerSwitch N3200 Series
      {
        id: "n3224t-on",
        name: "N3224T-ON",
        series: "N3200 Series",
        category: "Distribution",
        ports: "24x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLT", "L3", "BGP", "OSPF", "Multi-Auth", "Campus Fabric"]
      },
      {
        id: "n3248te-on",
        name: "N3248TE-ON",
        series: "N3200 Series",
        category: "Distribution",
        ports: "48x GbE + 4x 10GbE SFP+",
        stackable: true,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0", "10.5.3.0"],
        capabilities: ["802.1X", "VLT", "L3", "BGP", "OSPF", "Multi-Auth", "Campus Fabric"]
      },
      // PowerSwitch Z9100 Series
      {
        id: "z9100-on",
        name: "Z9100-ON",
        series: "Z9100 Series",
        category: "Core",
        ports: "32x 100GbE QSFP28",
        stackable: false,
        poe: false,
        firmwareVersions: ["10.5.6.0", "10.5.5.0", "10.5.4.0"],
        capabilities: ["802.1X", "VLT", "L3", "BGP", "EVPN", "VXLAN", "Data Center Fabric"]
      }
    ]
  },
  {
    id: "sonicwall",
    name: "SonicWall",
    category: "Firewall",
    icon: "🔒",
    color: "bg-orange-600",
    description: "Network Security & Firewall Solutions",
    supportLevel: "full",
    commonFeatures: ["SonicOS", "Deep Packet Inspection", "Anti-Malware", "VPN", "Capture Security"],
    models: [
      // TZ Series
      {
        id: "tz270",
        name: "TZ270",
        series: "TZ Series",
        category: "Desktop Firewall",
        ports: "5x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering"]
      },
      {
        id: "tz370",
        name: "TZ370",
        series: "TZ Series",
        category: "Desktop Firewall",
        ports: "5x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "Wi-Fi"]
      },
      {
        id: "tz470",
        name: "TZ470",
        series: "TZ Series",
        category: "Desktop Firewall",
        ports: "8x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "PoE"]
      },
      {
        id: "tz570",
        name: "TZ570",
        series: "TZ Series",
        category: "Desktop Firewall",
        ports: "8x GbE + 2x SFP",
        stackable: false,
        poe: true,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "Content Filtering", "PoE+"]
      },
      // NSa Series
      {
        id: "nsa2700",
        name: "NSa2700",
        series: "NSa Series",
        category: "Branch Firewall",
        ports: "8x GbE + 2x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering"]
      },
      {
        id: "nsa3700",
        name: "NSa3700",
        series: "NSa Series",
        category: "Branch Firewall",
        ports: "16x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering"]
      },
      {
        id: "nsa4700",
        name: "NSa4700",
        series: "NSa Series",
        category: "Enterprise Firewall",
        ports: "16x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030", "7.0.0-5020"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering", "Advanced Threat Protection"]
      },
      // NSsp Series
      {
        id: "nssp12400",
        name: "NSsp12400",
        series: "NSsp Series",
        category: "Data Center Firewall",
        ports: "24x SFP+ + 2x QSFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["7.0.1-5035", "7.0.1-5030"],
        capabilities: ["Deep Packet Inspection", "VPN", "Anti-Malware", "HA", "Clustering", "Real-Time Deep Memory Inspection"]
      }
    ]
  },
  {
    id: "meraki",
    name: "Cisco Meraki",
    category: "Cloud Managed",
    icon: "☁️",
    color: "bg-green-600",
    description: "Cloud-Managed Networking Solutions",
    supportLevel: "full",
    commonFeatures: ["Cloud Dashboard", "Zero-Touch Provisioning", "SD-WAN", "Insight Analytics", "Systems Manager"],
    models: [
      // MS Series Switches
      {
        id: "ms120-24",
        name: "MS120-24",
        series: "MS120 Series",
        category: "Access",
        ports: "24x GbE + 4x SFP",
        stackable: true,
        poe: false,
        firmwareVersions: ["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"],
        capabilities: ["802.1X", "Cloud Managed", "Stacking", "Dynamic VLAN", "Multi-Auth"]
      },
      {
        id: "ms120-48",
        name: "MS120-48",
        series: "MS120 Series",
        category: "Access",
        ports: "48x GbE + 4x SFP",
        stackable: true,
        poe: false,
        firmwareVersions: ["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"],
        capabilities: ["802.1X", "Cloud Managed", "Stacking", "Dynamic VLAN", "Multi-Auth"]
      },
      {
        id: "ms125-24",
        name: "MS125-24",
        series: "MS125 Series",
        category: "Access",
        ports: "24x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"],
        capabilities: ["802.1X", "Cloud Managed", "PoE+", "Stacking", "Dynamic VLAN", "Multi-Auth"]
      },
      {
        id: "ms125-48",
        name: "MS125-48",
        series: "MS125 Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["MS.15.21.1", "MS.14.33.1", "MS.14.32.1"],
        capabilities: ["802.1X", "Cloud Managed", "PoE+", "Stacking", "Dynamic VLAN", "Multi-Auth"]
      },
      // MR Series Access Points
      {
        id: "mr36",
        name: "MR36",
        series: "MR30 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["MR.28.7", "MR.27.7", "MR.26.8"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "Cloud Managed", "Location Analytics", "Air Marshal"]
      },
      {
        id: "mr46",
        name: "MR46",
        series: "MR40 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["MR.28.7", "MR.27.7", "MR.26.8"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "Cloud Managed", "BLE", "Location Analytics"]
      },
      {
        id: "mr56",
        name: "MR56",
        series: "MR50 Series",
        category: "Wi-Fi 6E Access Point",
        firmwareVersions: ["MR.28.7", "MR.27.7"],
        capabilities: ["Wi-Fi 6E", "4x4 MIMO", "6GHz", "Cloud Managed", "BLE", "IoT Radio"]
      },
      // MX Series Security Appliances
      {
        id: "mx67",
        name: "MX67",
        series: "MX60 Series",
        category: "Branch Security",
        ports: "12x GbE",
        stackable: false,
        poe: false,
        firmwareVersions: ["MX.17.10.2", "MX.16.16", "MX.15.44"],
        capabilities: ["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS"]
      },
      {
        id: "mx75",
        name: "MX75",
        series: "MX70 Series",
        category: "Branch Security",
        ports: "12x GbE + 2x SFP",
        stackable: false,
        poe: false,
        firmwareVersions: ["MX.17.10.2", "MX.16.16", "MX.15.44"],
        capabilities: ["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS", "Advanced Malware Protection"]
      },
      {
        id: "mx105",
        name: "MX105",
        series: "MX100 Series",
        category: "Enterprise Security",
        ports: "8x GbE + 2x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["MX.17.10.2", "MX.16.16", "MX.15.44"],
        capabilities: ["SD-WAN", "Advanced Security", "Auto VPN", "Content Filtering", "IPS", "Advanced Malware Protection", "HA"]
      }
    ]
  },
  {
    id: "ubiquiti",
    name: "Ubiquiti",
    category: "Enterprise",
    icon: "📶",
    color: "bg-blue-400",
    description: "UniFi Enterprise Networking Solutions",
    supportLevel: "partial",
    commonFeatures: ["UniFi Controller", "Cloud Key", "RADIUS", "VLAN", "PoE"],
    models: [
      // UniFi Switch Enterprise
      {
        id: "usw-enterprise-24-poe",
        name: "USW-Enterprise-24-PoE",
        series: "Enterprise Series",
        category: "Access",
        ports: "24x GbE + 2x SFP+",
        stackable: false,
        poe: true,
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["802.1X", "VLAN", "PoE++", "UniFi Controller", "Multi-Auth"]
      },
      {
        id: "usw-enterprise-48-poe",
        name: "USW-Enterprise-48-PoE",
        series: "Enterprise Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: false,
        poe: true,
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["802.1X", "VLAN", "PoE++", "UniFi Controller", "Multi-Auth"]
      },
      // UniFi Switch Pro
      {
        id: "usw-pro-24",
        name: "USW-Pro-24",
        series: "Pro Series",
        category: "Access",
        ports: "24x GbE + 2x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["802.1X", "VLAN", "L3", "UniFi Controller"]
      },
      {
        id: "usw-pro-48",
        name: "USW-Pro-48",
        series: "Pro Series",
        category: "Access",
        ports: "48x GbE + 4x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["802.1X", "VLAN", "L3", "UniFi Controller"]
      },
      // UniFi Access Points
      {
        id: "u6-enterprise",
        name: "U6-Enterprise",
        series: "WiFi 6 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "2.5GbE", "PoE++", "UniFi Controller"]
      },
      {
        id: "u6-pro",
        name: "U6-Pro",
        series: "WiFi 6 Series",
        category: "Wi-Fi 6 Access Point",
        firmwareVersions: ["6.5.59", "6.2.26", "6.0.45"],
        capabilities: ["Wi-Fi 6", "4x4 MIMO", "2.5GbE", "PoE+", "UniFi Controller"]
      },
      // UniFi Dream Machine
      {
        id: "udm-pro",
        name: "UDM-Pro",
        series: "Dream Machine",
        category: "Security Gateway",
        ports: "8x GbE + 2x SFP+",
        stackable: false,
        poe: false,
        firmwareVersions: ["3.2.9", "3.1.15", "2.4.27"],
        capabilities: ["Firewall", "IPS", "DPI", "VPN", "UniFi Controller", "Protect"]
      },
      {
        id: "udm-pro-max",
        name: "UDM-Pro-Max",
        series: "Dream Machine",
        category: "Security Gateway",
        ports: "8x GbE + 2x SFP+",
        stackable: false,
        poe: true,
        firmwareVersions: ["3.2.9", "3.1.15"],
        capabilities: ["Firewall", "IPS", "DPI", "VPN", "UniFi Controller", "Protect", "PoE++"]
      }
    ]
  }
];

// Helper functions
export const getVendorById = (id: string): ComprehensiveVendor | undefined => {
  return comprehensiveVendorData.find(vendor => vendor.id === id);
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
  return comprehensiveVendorData.map(vendor => vendor.name);
};

export const getVendorsByCategory = (category: string): ComprehensiveVendor[] => {
  return comprehensiveVendorData.filter(vendor => vendor.category === category);
};