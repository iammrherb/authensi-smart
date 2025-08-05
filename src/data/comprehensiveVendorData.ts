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