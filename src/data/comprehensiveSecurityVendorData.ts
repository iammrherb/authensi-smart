// Comprehensive security vendor data covering all categories
// NAC, Wireless, Wired, Security, MDM, SIEM, EDR, Identity, Cloud

export interface SecurityVendorModel {
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

export interface SecurityVendor {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  icon: string;
  color: string;
  description: string;
  models: SecurityVendorModel[];
  commonFeatures: string[];
  supportLevel: 'full' | 'partial' | 'limited' | 'none';
  portnoxCompatibility: 'native' | 'api' | 'limited' | 'none';
  integrationMethods: string[];
  knownLimitations?: string[];
  documentationLinks?: string[];
}

export const comprehensiveSecurityVendorData: SecurityVendor[] = [
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
        id: "ise-3595",
        name: "ISE 3595",
        series: "ISE 3500",
        category: "Large Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "100,000",
        licensing: "Base + Plus + Apex",
        firmwareVersions: ["3.3.0.430", "3.2.0.542", "3.1.0.518", "3.0.0.458"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Posture", "Guest", "TrustSec", "pxGrid", "APEX"]
      }
    ]
  },
  {
    id: "aruba-clearpass",
    name: "Aruba ClearPass",
    category: "NAC",
    subcategory: "Policy Manager",
    icon: "📡",
    color: "bg-orange-500",
    description: "HPE Aruba ClearPass Policy Manager",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["RADIUS", "API", "REST", "TACACS+"],
    commonFeatures: ["Dynamic VLAN", "Device Profiling", "Guest Access", "BYOD", "Onboard", "OnGuard"],
    models: [
      {
        id: "clearpass-c1000",
        name: "ClearPass C1000",
        series: "C-Series",
        category: "Small Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "1,000",
        licensing: "Access Tracker + Policy Manager",
        firmwareVersions: ["6.12.2", "6.11.6", "6.10.8", "6.9.13"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Guest", "BYOD", "OnGuard"]
      },
      {
        id: "clearpass-c5000",
        name: "ClearPass C5000",
        series: "C-Series",
        category: "Large Deployment",
        deployment: ["Appliance", "VM"],
        maxUsers: "25,000",
        licensing: "Access Tracker + Policy Manager + Guest",
        firmwareVersions: ["6.12.2", "6.11.6", "6.10.8", "6.9.13"],
        capabilities: ["802.1X", "MAB", "WebAuth", "Profiling", "Guest", "BYOD", "OnGuard", "Cluster"]
      }
    ]
  },

  // ========== FIREWALL VENDORS ==========
  {
    id: "palo-alto-ngfw",
    name: "Palo Alto Networks",
    category: "Firewall",
    subcategory: "Next-Gen Firewall",
    icon: "🔥",
    color: "bg-red-600",
    description: "Palo Alto Networks Next-Generation Firewalls",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "User-ID", "GlobalProtect", "RADIUS"],
    commonFeatures: ["App-ID", "User-ID", "Content-ID", "GlobalProtect", "Threat Prevention"],
    models: [
      {
        id: "pa-220",
        name: "PA-220",
        series: "PA-200 Series",
        category: "Branch Office",
        throughput: "500 Mbps",
        deployment: ["Appliance"],
        licensing: "Threat Prevention + GlobalProtect",
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "Threat Prevention", "GlobalProtect"]
      },
      {
        id: "pa-3220",
        name: "PA-3220",
        series: "PA-3200 Series",
        category: "Enterprise",
        throughput: "2.5 Gbps",
        deployment: ["Appliance"],
        licensing: "Threat Prevention + WildFire + DNS Security",
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "Threat Prevention", "WildFire", "DNS Security"]
      },
      {
        id: "pa-5220",
        name: "PA-5220",
        series: "PA-5200 Series",
        category: "Data Center",
        throughput: "16.5 Gbps",
        deployment: ["Appliance"],
        licensing: "Threat Prevention + WildFire + DNS Security + URL Filtering",
        firmwareVersions: ["11.1.3", "11.0.4", "10.2.9", "10.1.13"],
        capabilities: ["App-ID", "User-ID", "Content-ID", "Threat Prevention", "WildFire", "URL Filtering", "DNS Security"]
      }
    ]
  },
  {
    id: "fortinet-fortigate",
    name: "Fortinet FortiGate",
    category: "Firewall",
    subcategory: "Security Fabric",
    icon: "🛡️",
    color: "bg-red-500",
    description: "Fortinet FortiGate Security Appliances",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "LDAP", "FSSO"],
    commonFeatures: ["Security Fabric", "SD-WAN", "FortiGuard", "SSL Inspection", "Application Control"],
    models: [
      {
        id: "fg-60f",
        name: "FortiGate 60F",
        series: "FortiGate 60 Series",
        category: "Small Office",
        throughput: "10 Gbps",
        deployment: ["Appliance"],
        licensing: "UTM Bundle + Enterprise Bundle",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["NGFW", "SD-WAN", "SSL Inspection", "Application Control", "IPS", "Anti-Malware"]
      },
      {
        id: "fg-200f",
        name: "FortiGate 200F",
        series: "FortiGate 200 Series",
        category: "Enterprise Branch",
        throughput: "30 Gbps",
        deployment: ["Appliance"],
        licensing: "UTM Bundle + Enterprise Bundle + Cloud Bundle",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15", "6.4.15"],
        capabilities: ["NGFW", "SD-WAN", "SSL Inspection", "Application Control", "IPS", "Anti-Malware", "Sandboxing"]
      },
      {
        id: "fg-1800f",
        name: "FortiGate 1800F",
        series: "FortiGate 1800 Series",
        category: "Data Center",
        throughput: "120 Gbps",
        deployment: ["Appliance"],
        licensing: "Enterprise Bundle + Cloud Bundle + Industrial Bundle",
        firmwareVersions: ["7.4.5", "7.4.4", "7.2.8", "7.0.15"],
        capabilities: ["NGFW", "SD-WAN", "SSL Inspection", "Application Control", "IPS", "Anti-Malware", "Sandboxing", "Zero Trust"]
      }
    ]
  },
  {
    id: "checkpoint-quantum",
    name: "Check Point Quantum",
    category: "Firewall",
    subcategory: "Quantum Security",
    icon: "✅",
    color: "bg-green-600",
    description: "Check Point Quantum Security Gateways",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "RADIUS", "LDAP", "SmartConsole"],
    commonFeatures: ["Threat Prevention", "Zero Day Protection", "Infinity Architecture", "CloudGuard"],
    models: [
      {
        id: "cp-1450",
        name: "Quantum 1450",
        series: "Quantum 1400 Series",
        category: "Small Business",
        throughput: "1.5 Gbps",
        deployment: ["Appliance"],
        licensing: "NGTX + SandBlast + Threat Emulation",
        firmwareVersions: ["R81.20", "R81.10", "R80.40", "R80.30"],
        capabilities: ["NGFW", "Threat Prevention", "SandBlast", "Zero Day Protection", "Application Control"]
      },
      {
        id: "cp-6400",
        name: "Quantum 6400",
        series: "Quantum 6000 Series",
        category: "Enterprise",
        throughput: "40 Gbps",
        deployment: ["Appliance"],
        licensing: "NGTX + SandBlast + Threat Emulation + Anti-Bot",
        firmwareVersions: ["R81.20", "R81.10", "R80.40", "R80.30"],
        capabilities: ["NGFW", "Threat Prevention", "SandBlast", "Zero Day Protection", "Anti-Bot", "URL Filtering"]
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
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "ISE", "DNA Center"],
    commonFeatures: ["DNA Center", "ISE Integration", "Wi-Fi 6E", "Catalyst 9800", "Aironet"],
    models: [
      {
        id: "cat9800-cl",
        name: "Catalyst 9800-CL",
        series: "Catalyst 9800",
        category: "Cloud Controller",
        deployment: ["Cloud", "VM"],
        maxUsers: "2,000 APs",
        licensing: "DNA Essentials + Advantage",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["802.1X", "WPA3", "Wi-Fi 6E", "FlexConnect", "Central WebAuth", "DNA Analytics"]
      },
      {
        id: "cat9120axi",
        name: "Catalyst 9120AXI",
        series: "Catalyst 9100",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "2.4 Gbps",
        licensing: "DNA Essentials + Advantage",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["Wi-Fi 6", "802.1X", "WPA3", "BLE", "IoT Ready", "Hyperlocation"]
      },
      {
        id: "cat9164i",
        name: "Catalyst 9164I",
        series: "Catalyst 9160",
        category: "Outdoor AP",
        deployment: ["Outdoor", "Industrial"],
        throughput: "4.8 Gbps",
        licensing: "DNA Essentials + Advantage",
        firmwareVersions: ["17.15.01", "17.12.04", "17.09.04", "17.06.05"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "Weather Resistant", "Mesh", "Industrial Grade"]
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
    integrationMethods: ["802.1X", "WPA2/3-Enterprise", "ClearPass", "Central"],
    commonFeatures: ["Central", "ClearPass", "Wi-Fi 6E", "InstantOn", "AOS"],
    models: [
      {
        id: "aruba-7030",
        name: "7030 Mobility Controller",
        series: "7000 Series",
        category: "Wireless Controller",
        deployment: ["Appliance", "VM"],
        maxUsers: "2,048 APs",
        licensing: "Foundation + Advanced",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["802.1X", "WPA3", "Wi-Fi 6E", "Instant", "Central WebAuth", "AI Insights"]
      },
      {
        id: "ap-635",
        name: "AP-635",
        series: "630 Series",
        category: "Indoor AP",
        deployment: ["Indoor"],
        throughput: "3.9 Gbps",
        licensing: "Foundation + Advanced",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["Wi-Fi 6E", "802.1X", "WPA3", "BLE", "Zigbee", "Thread", "AI Radio Management"]
      },
      {
        id: "ap-567",
        name: "AP-567",
        series: "560 Series",
        category: "Outdoor AP",
        deployment: ["Outdoor"],
        throughput: "2.9 Gbps",
        licensing: "Foundation + Advanced",
        firmwareVersions: ["8.11.2.2", "8.10.0.10", "8.9.0.3", "8.8.0.2"],
        capabilities: ["Wi-Fi 6", "802.1X", "WPA3", "Weather Resistant", "Mesh", "GPS Sync"]
      }
    ]
  },

  // ========== SIEM VENDORS ==========
  {
    id: "splunk-enterprise",
    name: "Splunk Enterprise",
    category: "SIEM",
    subcategory: "Security Analytics",
    icon: "🔍",
    color: "bg-green-600",
    description: "Splunk Enterprise Security Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "Syslog", "REST", "Universal Forwarder"],
    commonFeatures: ["Machine Learning", "UEBA", "SOAR", "Threat Intelligence", "Incident Response"],
    models: [
      {
        id: "splunk-enterprise",
        name: "Splunk Enterprise",
        series: "Enterprise",
        category: "On-Premise SIEM",
        deployment: ["On-Premise", "Cloud"],
        licensing: "Per GB/Day",
        firmwareVersions: ["9.2.1", "9.1.4", "9.0.10", "8.2.12"],
        capabilities: ["Real-time Search", "Machine Learning", "UEBA", "Threat Intelligence", "Custom Dashboards"]
      },
      {
        id: "splunk-cloud",
        name: "Splunk Cloud Platform",
        series: "Cloud",
        category: "SaaS SIEM",
        deployment: ["Cloud", "SaaS"],
        licensing: "Workload Pricing",
        firmwareVersions: ["9.2.1", "9.1.4", "9.0.10"],
        capabilities: ["Real-time Search", "Machine Learning", "UEBA", "Threat Intelligence", "Cloud Analytics"]
      }
    ]
  },
  {
    id: "qradar",
    name: "IBM QRadar",
    category: "SIEM",
    subcategory: "AI-Powered SIEM",
    icon: "🧠",
    color: "bg-blue-800",
    description: "IBM QRadar SIEM Platform",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "Syslog", "SNMP", "REST"],
    commonFeatures: ["Watson AI", "UEBA", "Threat Intelligence", "Flow Analytics", "Risk Scoring"],
    models: [
      {
        id: "qradar-7.5",
        name: "QRadar SIEM 7.5",
        series: "QRadar",
        category: "Enterprise SIEM",
        deployment: ["Appliance", "VM", "Cloud"],
        licensing: "Per Event/Flow",
        firmwareVersions: ["7.5.0", "7.4.3", "7.3.3", "7.2.8"],
        capabilities: ["Watson AI", "UEBA", "Threat Intelligence", "Flow Analytics", "Custom Rules"]
      }
    ]
  },
  {
    id: "azure-sentinel",
    name: "Microsoft Sentinel",
    category: "SIEM",
    subcategory: "Cloud-Native SIEM",
    icon: "☁️",
    color: "bg-blue-500",
    description: "Microsoft Azure Sentinel",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST", "Azure Monitor", "Logic Apps"],
    commonFeatures: ["AI/ML Analytics", "UEBA", "SOAR", "Threat Intelligence", "Azure Integration"],
    models: [
      {
        id: "azure-sentinel",
        name: "Azure Sentinel",
        series: "Sentinel",
        category: "Cloud SIEM",
        deployment: ["Cloud", "SaaS"],
        licensing: "Pay-as-you-go",
        firmwareVersions: ["2024.3", "2024.2", "2024.1", "2023.4"],
        capabilities: ["AI Analytics", "UEBA", "SOAR", "Threat Intelligence", "Azure Workbooks"]
      }
    ]
  },

  // ========== EDR VENDORS ==========
  {
    id: "crowdstrike-falcon",
    name: "CrowdStrike Falcon",
    category: "EDR",
    subcategory: "Next-Gen Endpoint",
    icon: "🦅",
    color: "bg-red-500",
    description: "CrowdStrike Falcon Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST", "Streaming API", "SIEM Integration"],
    commonFeatures: ["Threat Hunting", "Behavioral Analysis", "Machine Learning", "Cloud-Native", "Real-time Response"],
    models: [
      {
        id: "falcon-go",
        name: "Falcon Go",
        series: "Falcon",
        category: "Small Business",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["7.19", "7.18", "7.17", "7.16"],
        capabilities: ["Anti-Malware", "Behavioral Analysis", "Machine Learning", "Cloud Protection"]
      },
      {
        id: "falcon-pro",
        name: "Falcon Pro",
        series: "Falcon",
        category: "Enterprise",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["7.19", "7.18", "7.17", "7.16"],
        capabilities: ["EDR", "Threat Hunting", "Behavioral Analysis", "Machine Learning", "Real-time Response"]
      },
      {
        id: "falcon-enterprise",
        name: "Falcon Enterprise",
        series: "Falcon",
        category: "Large Enterprise",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["7.19", "7.18", "7.17", "7.16"],
        capabilities: ["EDR", "XDR", "Threat Hunting", "Sandbox Analysis", "Threat Intelligence", "SOAR"]
      }
    ]
  },
  {
    id: "sentinelone",
    name: "SentinelOne Singularity",
    category: "EDR",
    subcategory: "Autonomous Endpoint",
    icon: "🤖",
    color: "bg-purple-600",
    description: "SentinelOne Singularity Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "REST", "Deep Visibility", "SIEM Integration"],
    commonFeatures: ["Autonomous Response", "AI/ML Engine", "Behavioral Analysis", "Rollback", "Threat Hunting"],
    models: [
      {
        id: "s1-core",
        name: "Singularity Core",
        series: "Singularity",
        category: "Essential Protection",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["23.4.2", "23.3.2", "23.2.1", "23.1.2"],
        capabilities: ["Anti-Malware", "Behavioral Analysis", "Autonomous Response", "Rollback"]
      },
      {
        id: "s1-control",
        name: "Singularity Control",
        series: "Singularity",
        category: "Advanced Protection",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["23.4.2", "23.3.2", "23.2.1", "23.1.2"],
        capabilities: ["EDR", "Threat Hunting", "Deep Visibility", "Autonomous Response", "Device Control"]
      },
      {
        id: "s1-complete",
        name: "Singularity Complete",
        series: "Singularity",
        category: "Enterprise XDR",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per Endpoint",
        firmwareVersions: ["23.4.2", "23.3.2", "23.2.1", "23.1.2"],
        capabilities: ["XDR", "Threat Hunting", "Ranger", "Data Retention", "Custom Detection Rules"]
      }
    ]
  },

  // ========== IDENTITY PROVIDERS ==========
  {
    id: "azure-ad",
    name: "Microsoft Entra ID",
    category: "Identity",
    subcategory: "Cloud Identity",
    icon: "🆔",
    color: "bg-blue-500",
    description: "Microsoft Entra ID (formerly Azure AD)",
    supportLevel: "full",
    portnoxCompatibility: "native",
    integrationMethods: ["SAML", "OAuth", "OpenID Connect", "RADIUS", "LDAP"],
    commonFeatures: ["SSO", "MFA", "Conditional Access", "PIM", "Identity Protection"],
    models: [
      {
        id: "entra-free",
        name: "Entra ID Free",
        series: "Entra ID",
        category: "Basic Identity",
        deployment: ["Cloud", "SaaS"],
        licensing: "Free",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "Basic MFA", "Self-Service Password Reset", "Basic Reports"]
      },
      {
        id: "entra-p1",
        name: "Entra ID P1",
        series: "Entra ID",
        category: "Premium Identity",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per User/Month",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["SSO", "MFA", "Conditional Access", "Self-Service Group Management", "Hybrid Identities"]
      },
      {
        id: "entra-p2",
        name: "Entra ID P2",
        series: "Entra ID",
        category: "Advanced Identity",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per User/Month",
        firmwareVersions: ["Current", "Preview"],
        capabilities: ["Identity Protection", "PIM", "Access Reviews", "Entitlement Management", "Risk-based Conditional Access"]
      }
    ]
  },
  {
    id: "okta",
    name: "Okta",
    category: "Identity",
    subcategory: "Identity Cloud",
    icon: "🔑",
    color: "bg-blue-600",
    description: "Okta Identity Cloud",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["SAML", "OAuth", "OpenID Connect", "RADIUS", "API"],
    commonFeatures: ["Universal Directory", "SSO", "MFA", "Lifecycle Management", "API Access Management"],
    models: [
      {
        id: "okta-workforce",
        name: "Okta Workforce Identity",
        series: "Workforce",
        category: "Employee Identity",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per User/Month",
        firmwareVersions: ["2024.02", "2024.01", "2023.12", "2023.11"],
        capabilities: ["SSO", "MFA", "Universal Directory", "Lifecycle Management", "Advanced MFA"]
      },
      {
        id: "okta-customer",
        name: "Okta Customer Identity",
        series: "Customer",
        category: "Customer Identity",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per MAU",
        firmwareVersions: ["2024.02", "2024.01", "2023.12", "2023.11"],
        capabilities: ["CIAM", "Social Login", "Progressive Profiling", "Advanced MFA", "Risk Scoring"]
      }
    ]
  },

  // ========== MDM VENDORS ==========
  {
    id: "microsoft-intune",
    name: "Microsoft Intune",
    category: "MDM",
    subcategory: "Cloud MDM/UEM",
    icon: "📱",
    color: "bg-blue-500",
    description: "Microsoft Intune Endpoint Management",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["Graph API", "REST", "PowerShell", "Configuration Manager"],
    commonFeatures: ["Device Management", "App Management", "Conditional Access", "Compliance Policies", "Autopilot"],
    models: [
      {
        id: "intune-plan1",
        name: "Intune Plan 1",
        series: "Intune",
        category: "Device Management",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per User/Month",
        firmwareVersions: ["2024.3", "2024.2", "2024.1", "2023.12"],
        capabilities: ["Device Management", "App Management", "Compliance Policies", "Conditional Access"]
      },
      {
        id: "intune-plan2",
        name: "Intune Plan 2",
        series: "Intune",
        category: "Advanced Endpoint Management",
        deployment: ["Cloud", "SaaS"],
        licensing: "Per User/Month",
        firmwareVersions: ["2024.3", "2024.2", "2024.1", "2023.12"],
        capabilities: ["Advanced Endpoint Analytics", "Endpoint Privilege Management", "Remote Help", "Cloud PKI"]
      }
    ]
  },
  {
    id: "vmware-workspace-one",
    name: "VMware Workspace ONE",
    category: "MDM",
    subcategory: "Digital Workspace",
    icon: "🏢",
    color: "bg-green-500",
    description: "VMware Workspace ONE UEM",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["REST API", "SDK", "PowerShell", "Directory Sync"],
    commonFeatures: ["UEM", "Digital Workspace", "App Catalog", "Conditional Access", "Zero Trust"],
    models: [
      {
        id: "ws1-standard",
        name: "Workspace ONE Standard",
        series: "Workspace ONE",
        category: "Basic UEM",
        deployment: ["Cloud", "On-Premise", "Hybrid"],
        licensing: "Per Device/Month",
        firmwareVersions: ["2311", "2309", "2307", "2305"],
        capabilities: ["Device Management", "App Management", "Email Management", "Content Management"]
      },
      {
        id: "ws1-advanced",
        name: "Workspace ONE Advanced",
        series: "Workspace ONE",
        category: "Advanced UEM",
        deployment: ["Cloud", "On-Premise", "Hybrid"],
        licensing: "Per Device/Month",
        firmwareVersions: ["2311", "2309", "2307", "2305"],
        capabilities: ["Advanced Analytics", "Automation", "Digital Employee Experience", "Advanced Integrations"]
      }
    ]
  },

  // ========== CLOUD VENDORS ==========
  {
    id: "aws",
    name: "Amazon Web Services",
    category: "Cloud",
    subcategory: "Public Cloud",
    icon: "☁️",
    color: "bg-orange-500",
    description: "Amazon Web Services Cloud Platform",
    supportLevel: "partial",
    portnoxCompatibility: "api",
    integrationMethods: ["API", "CloudFormation", "Lambda", "VPC Flow Logs"],
    commonFeatures: ["VPC", "IAM", "CloudTrail", "GuardDuty", "Security Groups"],
    models: [
      {
        id: "aws-vpc",
        name: "Amazon VPC",
        series: "Networking",
        category: "Virtual Private Cloud",
        deployment: ["Cloud"],
        licensing: "Pay-as-you-go",
        firmwareVersions: ["Current"],
        capabilities: ["Private Networking", "Security Groups", "NACLs", "Flow Logs", "Transit Gateway"]
      },
      {
        id: "aws-guardduty",
        name: "Amazon GuardDuty",
        series: "Security",
        category: "Threat Detection",
        deployment: ["Cloud"],
        licensing: "Pay-as-you-go",
        firmwareVersions: ["Current"],
        capabilities: ["Threat Detection", "Machine Learning", "Anomaly Detection", "Malware Detection"]
      }
    ]
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    category: "Cloud",
    subcategory: "Public Cloud",
    icon: "☁️",
    color: "bg-blue-500",
    description: "Microsoft Azure Cloud Platform",
    supportLevel: "full",
    portnoxCompatibility: "api",
    integrationMethods: ["Azure Monitor", "API", "ARM Templates", "Log Analytics"],
    commonFeatures: ["Virtual Networks", "NSGs", "Azure AD", "Security Center", "Sentinel"],
    models: [
      {
        id: "azure-vnet",
        name: "Azure Virtual Network",
        series: "Networking",
        category: "Virtual Network",
        deployment: ["Cloud"],
        licensing: "Included",
        firmwareVersions: ["Current"],
        capabilities: ["Private Networking", "NSGs", "Application Security Groups", "Flow Logs", "Peering"]
      },
      {
        id: "azure-security-center",
        name: "Microsoft Defender for Cloud",
        series: "Security",
        category: "Cloud Security",
        deployment: ["Cloud"],
        licensing: "Per Resource",
        firmwareVersions: ["Current"],
        capabilities: ["Security Posture", "Threat Protection", "Compliance Assessment", "Regulatory Compliance"]
      }
    ]
  }
];

// Helper functions
export const getVendorById = (id: string): SecurityVendor | undefined => {
  return comprehensiveSecurityVendorData.find(vendor => vendor.id === id);
};

export const getModelById = (vendorId: string, modelId: string): SecurityVendorModel | undefined => {
  const vendor = getVendorById(vendorId);
  return vendor?.models.find(model => model.id === modelId);
};

export const getVendorsByCategory = (category: string): SecurityVendor[] => {
  return comprehensiveSecurityVendorData.filter(vendor => vendor.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(comprehensiveSecurityVendorData.map(vendor => vendor.category))];
};

export const getVendorsWithPortnoxCompatibility = (compatibility: string): SecurityVendor[] => {
  return comprehensiveSecurityVendorData.filter(vendor => vendor.portnoxCompatibility === compatibility);
};