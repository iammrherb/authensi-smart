// =============================================================================
// UNIFIED VENDOR LIBRARY - CONSOLIDATED & DEDUPLICATED
// =============================================================================
// This file consolidates all vendor data from:
// - comprehensiveVendorData.ts
// - expandedVendorLibrary.ts  
// - comprehensiveSecurityVendorData.ts
// 
// Eliminates duplicates and provides a single source of truth for vendor data

export interface UnifiedVendorModel {
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
  licensing?: string;
}

export interface UnifiedVendor {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  icon: string;
  color: string;
  description: string;
  models: UnifiedVendorModel[];
  commonFeatures: string[];
  supportLevel: 'full' | 'partial' | 'limited' | 'none';
  portnoxCompatibility: 'native' | 'api' | 'limited' | 'none';
  integrationMethods: string[];
  knownLimitations?: string[];
  documentationLinks?: string[];
  websiteUrl?: string;
  supportContact?: Record<string, any>;
  certifications?: string[];
  lastTestedDate?: string;
  status: 'active' | 'deprecated' | 'end-of-life';
}

export const unifiedVendorLibrary: UnifiedVendor[] = [
  // ========== NAC VENDORS ==========
  {
    id: "portnox",
    name: "Portnox",
    category: "NAC",
    subcategory: "AI-Powered NAC",
    icon: "🔐",
    color: "bg-blue-500",
    description: "AI-Powered Network Access Control Platform",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["Native Platform", "API", "RADIUS", "SNMP"],
    commonFeatures: ["AI Analytics", "Zero Trust", "BYOD", "IoT Discovery", "Automated Response", "Device Profiling"],
    websiteUrl: "https://portnox.com",
    status: "active",
    models: [
      {
        id: "portnox-core-enterprise",
        name: "Portnox CORE Enterprise",
        series: "CORE",
        category: "Enterprise NAC",
        deployment: ["On-Premise", "Private Cloud", "Hybrid"],
        maxUsers: "Unlimited",
        licensing: "Per Device",
        firmwareVersions: ["6.5.2", "6.5.1", "6.5.0", "6.4.2", "6.4.1", "6.3.5"],
        capabilities: ["802.1X", "RADIUS", "Device Profiling", "Policy Engine", "AI Analytics", "Zero Trust", "BYOD", "Guest Access"]
      },
      {
        id: "portnox-clear-cloud",
        name: "Portnox CLEAR Cloud",
        series: "CLEAR",
        category: "Cloud NAC",
        deployment: ["Cloud", "SaaS"],
        maxUsers: "Unlimited",
        licensing: "SaaS Subscription",
        firmwareVersions: ["Cloud-2024.3", "Cloud-2024.2", "Cloud-2024.1", "Cloud-2023.4"],
        capabilities: ["Cloud Management", "Global Policies", "Multi-Tenant", "AI Analytics", "Zero Trust"]
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
    integrationMethods: ["RADIUS", "API", "pxGrid", "REST"],
    commonFeatures: ["TrustSec", "SDA", "Profiling", "Posture", "Guest Access", "BYOD"],
    websiteUrl: "https://cisco.com/go/ise",
    status: "active",
    models: [
      {
        id: "ise-3415",
        name: "ISE 3415",
        series: "ISE 3400",
        category: "Small Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "5,000",
        licensing: "Base + Plus",
        firmwareVersions: ["3.3.0.430", "3.2.0.542", "3.1.0.518", "3.0.0.458"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Posture", "Guest", "TrustSec"]
      },
      {
        id: "ise-3435",
        name: "ISE 3435",
        series: "ISE 3400",
        category: "Medium Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "25,000",
        licensing: "Base + Plus",
        firmwareVersions: ["3.3.0.430", "3.2.0.542", "3.1.0.518", "3.0.0.458"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Posture", "Guest", "TrustSec", "SDA"]
      }
    ]
  },

  // ========== SWITCH VENDORS ==========
  {
    id: "cisco-catalyst",
    name: "Cisco Catalyst",
    category: "Switch",
    subcategory: "Enterprise Switches",
    icon: "🔌",
    color: "bg-blue-700",
    description: "Cisco Catalyst Enterprise Switching",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "SNMP", "REST API", "NETCONF"],
    commonFeatures: ["802.1X", "TrustSec", "SDA", "StackWise", "PoE+", "QoS"],
    websiteUrl: "https://cisco.com/go/catalyst",
    status: "active",
    models: [
      {
        id: "catalyst-9300",
        name: "Catalyst 9300",
        series: "Catalyst 9000",
        category: "Access Switch",
        ports: "24x/48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["17.12.1", "17.9.4", "17.6.3", "17.3.4"],
        capabilities: ["802.1X", "TrustSec", "SDA", "StackWise", "PoE+", "QoS", "NetFlow"]
      },
      {
        id: "catalyst-9200",
        name: "Catalyst 9200",
        series: "Catalyst 9000",
        category: "Access Switch",
        ports: "24x/48x GbE + 4x SFP+",
        stackable: true,
        poe: true,
        firmwareVersions: ["17.12.1", "17.9.4", "17.6.3", "17.3.4"],
        capabilities: ["802.1X", "TrustSec", "StackWise", "PoE+", "QoS", "NetFlow"]
      }
    ]
  },
  {
    id: "fortinet-fortiswitch",
    name: "FortiSwitch",
    category: "Switch",
    subcategory: "Secure Switching",
    icon: "🛡️",
    color: "bg-red-500",
    description: "Fortinet Secure Switching",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "SNMP", "REST API", "FortiLink"],
    commonFeatures: ["Security Fabric", "802.1X", "Multi-Auth", "Zero Touch", "AI-Driven"],
    websiteUrl: "https://fortinet.com/products/fortiswitch",
    status: "active",
    models: [
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
      }
    ]
  },

  // ========== WIRELESS VENDORS ==========
  {
    id: "cisco-wireless",
    name: "Cisco Wireless",
    category: "Wireless",
    subcategory: "Enterprise WLAN",
    icon: "📶",
    color: "bg-blue-600",
    description: "Cisco Enterprise Wireless Solutions",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "SNMP", "REST API", "NETCONF"],
    commonFeatures: ["802.1X", "TrustSec", "SDA", "FlexConnect", "CleanAir", "mDNS"],
    websiteUrl: "https://cisco.com/go/wireless",
    status: "active",
    models: [
      {
        id: "c9120-ax",
        name: "C9120AX",
        series: "Catalyst 9100",
        category: "Wi-Fi 6 AP",
        deployment: ["Indoor", "Outdoor"],
        maxUsers: "1,000+",
        firmwareVersions: ["17.12.1", "17.9.4", "17.6.3", "17.3.4"],
        capabilities: ["802.1X", "TrustSec", "SDA", "FlexConnect", "CleanAir", "mDNS", "Wi-Fi 6"]
      },
      {
        id: "c9130-ax",
        name: "C9130AX",
        series: "Catalyst 9100",
        category: "Wi-Fi 6 AP",
        deployment: ["Indoor"],
        maxUsers: "1,000+",
        firmwareVersions: ["17.12.1", "17.9.4", "17.6.3", "17.3.4"],
        capabilities: ["802.1X", "TrustSec", "SDA", "FlexConnect", "CleanAir", "mDNS", "Wi-Fi 6"]
      }
    ]
  },

  // ========== FIREWALL VENDORS ==========
  {
    id: "fortinet-fortigate",
    name: "FortiGate",
    category: "Firewall",
    subcategory: "Next-Gen Firewall",
    icon: "🔥",
    color: "bg-red-600",
    description: "Fortinet Next-Generation Firewall",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "SNMP", "REST API", "FortiManager"],
    commonFeatures: ["Security Fabric", "SD-WAN", "IPS", "Sandbox", "SSL Inspection"],
    websiteUrl: "https://fortinet.com/products/fortigate",
    status: "active",
    models: [
      {
        id: "fortigate-100f",
        name: "FortiGate 100F",
        series: "100 Series",
        category: "Branch Firewall",
        throughput: "20 Gbps",
        deployment: ["Branch", "SMB"],
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["NGFW", "SD-WAN", "IPS", "Sandbox", "SSL Inspection", "VPN"]
      },
      {
        id: "fortigate-200f",
        name: "FortiGate 200F",
        series: "200 Series",
        category: "Branch Firewall",
        throughput: "40 Gbps",
        deployment: ["Branch", "Enterprise"],
        firmwareVersions: ["7.4.5", "7.4.4", "7.4.3", "7.2.8", "7.2.7", "7.0.6"],
        capabilities: ["NGFW", "SD-WAN", "IPS", "Sandbox", "SSL Inspection", "VPN"]
      }
    ]
  },

  // ========== VPN VENDORS ==========
  {
    id: "cisco-anyconnect",
    name: "Cisco AnyConnect",
    category: "VPN",
    subcategory: "Client VPN",
    icon: "🔒",
    color: "bg-blue-500",
    description: "Cisco AnyConnect Secure Mobility Client",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "LDAP", "SAML", "REST API"],
    commonFeatures: ["SSL VPN", "IPSec", "DTLS", "Always-On", "Split Tunneling"],
    websiteUrl: "https://cisco.com/go/anyconnect",
    status: "active",
    models: [
      {
        id: "anyconnect-vpn",
        name: "AnyConnect VPN",
        series: "AnyConnect",
        category: "VPN Client",
        deployment: ["Client", "Mobile"],
        firmwareVersions: ["4.10.07086", "4.10.06079", "4.10.05085", "4.9.08020"],
        capabilities: ["SSL VPN", "IPSec", "DTLS", "Always-On", "Split Tunneling", "ISE Integration"]
      }
    ]
  },
  {
    id: "fortinet-vpn",
    name: "FortiClient",
    category: "VPN",
    subcategory: "Client VPN",
    icon: "🔒",
    color: "bg-red-500",
    description: "Fortinet FortiClient VPN",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "LDAP", "SAML", "REST API"],
    commonFeatures: ["SSL VPN", "IPSec", "Always-On", "Split Tunneling", "Endpoint Security"],
    websiteUrl: "https://fortinet.com/products/forticlient",
    status: "active",
    models: [
      {
        id: "forticlient-vpn",
        name: "FortiClient VPN",
        series: "FortiClient",
        category: "VPN Client",
        deployment: ["Client", "Mobile"],
        firmwareVersions: ["7.2.4", "7.2.3", "7.2.2", "7.0.9"],
        capabilities: ["SSL VPN", "IPSec", "Always-On", "Split Tunneling", "Endpoint Security"]
      }
    ]
  }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const getVendorById = (id: string): UnifiedVendor | undefined => {
  return unifiedVendorLibrary.find(vendor => vendor.id === id);
};

export const getVendorsByCategory = (category: string): UnifiedVendor[] => {
  return unifiedVendorLibrary.filter(vendor => vendor.category === category);
};

export const getVendorsBySupportLevel = (level: UnifiedVendor['supportLevel']): UnifiedVendor[] => {
  return unifiedVendorLibrary.filter(vendor => vendor.supportLevel === level);
};

export const getVendorsByPortnoxCompatibility = (compatibility: UnifiedVendor['portnoxCompatibility']): UnifiedVendor[] => {
  return unifiedVendorLibrary.filter(vendor => vendor.portnoxCompatibility === compatibility);
};

export const getAllVendorCategories = (): string[] => {
  return [...new Set(unifiedVendorLibrary.map(vendor => vendor.category))];
};

export const getAllVendorSubcategories = (): string[] => {
  return [...new Set(unifiedVendorLibrary.map(vendor => vendor.subcategory).filter(Boolean))];
};

export const getVendorStats = () => {
  const totalVendors = unifiedVendorLibrary.length;
  const totalModels = unifiedVendorLibrary.reduce((sum, vendor) => sum + vendor.models.length, 0);
  const categories = getAllVendorCategories();
  const subcategories = getAllVendorSubcategories();
  
  const categoryStats = categories.map(category => ({
    category,
    count: getVendorsByCategory(category).length
  }));

  return {
    totalVendors,
    totalModels,
    categories,
    subcategories,
    categoryStats
  };
};
