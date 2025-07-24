// Comprehensive Use Case Library based on PRD specifications

export interface UseCase {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  vendors_supported: string[];
  test_cases: string[];
  config_templates: string[];
  documentation_links: string[];
  complexity: 'low' | 'medium' | 'high';
  estimated_effort_weeks?: number;
  compliance_frameworks?: string[];
  authentication_methods: string[];
  deployment_scenarios: string[];
  portnox_features: string[];
  business_value: string;
  technical_requirements: string[];
  prerequisites: string[];
}

export const authenticationUseCases: UseCase[] = [
  {
    id: "UC-CERT-USER",
    title: "802.1X User Certificate Authentication",
    category: "Authentication",
    subcategory: "Certificate-based",
    description: "User certificate-based authentication for secure network access",
    vendors_supported: ["All"],
    test_cases: ["Cert install", "Auth test", "Renewal", "Revocation"],
    config_templates: ["user-cert-802.1x", "radius-user-cert"],
    documentation_links: [
      "portnox.com/docs/802.1x-user-cert",
      "portnox.com/kb/certificate-deployment"
    ],
    complexity: "medium",
    estimated_effort_weeks: 2,
    compliance_frameworks: ["SOX", "HIPAA", "PCI-DSS"],
    authentication_methods: ["802.1X", "EAP-TLS"],
    deployment_scenarios: ["Corporate Network", "Secure Environment"],
    portnox_features: ["Built-in CA", "Certificate Lifecycle Management", "OCSP Support"],
    business_value: "Enhanced security through certificate-based authentication with automated lifecycle management",
    technical_requirements: [
      "PKI infrastructure",
      "802.1X capable switches",
      "Certificate distribution mechanism"
    ],
    prerequisites: ["Active Directory integration", "Network infrastructure assessment"]
  },
  
  {
    id: "UC-CERT-MACHINE",
    title: "802.1X Machine Certificate Authentication",
    category: "Authentication",
    subcategory: "Certificate-based",
    description: "Machine certificate-based authentication for device identification",
    vendors_supported: ["All"],
    test_cases: ["Device enrollment", "Machine auth", "Certificate renewal"],
    config_templates: ["machine-cert-802.1x", "device-enrollment"],
    documentation_links: [
      "portnox.com/docs/802.1x-machine-cert",
      "portnox.com/kb/device-authentication"
    ],
    complexity: "medium",
    estimated_effort_weeks: 2,
    compliance_frameworks: ["SOX", "HIPAA", "ISO27001"],
    authentication_methods: ["802.1X", "EAP-TLS"],
    deployment_scenarios: ["Device Management", "Zero Trust"],
    portnox_features: ["Device Identity Management", "Automated Enrollment", "Certificate Tracking"],
    business_value: "Automated device authentication ensuring only trusted devices access the network",
    technical_requirements: [
      "Device management platform",
      "Certificate authority",
      "Automated enrollment process"
    ],
    prerequisites: ["Device inventory", "Certificate template configuration"]
  },

  {
    id: "UC-PEAP-MSCHAP",
    title: "PEAP-MSCHAPv2 Authentication",
    category: "Authentication",
    subcategory: "Credential-based",
    description: "Username/password authentication using PEAP-MSCHAPv2",
    vendors_supported: ["All"],
    test_cases: ["Credential validation", "Policy enforcement", "Fallback scenarios"],
    config_templates: ["peap-mschap-config", "radius-credential-auth"],
    documentation_links: [
      "portnox.com/docs/peap-mschapv2",
      "portnox.com/kb/credential-authentication"
    ],
    complexity: "low",
    estimated_effort_weeks: 1,
    compliance_frameworks: ["Basic compliance"],
    authentication_methods: ["PEAP", "MSCHAPv2"],
    deployment_scenarios: ["BYOD", "Guest Networks", "Legacy Systems"],
    portnox_features: ["Credential Validation", "Policy Engine", "User Directory Integration"],
    business_value: "Simple and widely supported authentication method for diverse environments",
    technical_requirements: [
      "User directory (AD/LDAP)",
      "RADIUS server",
      "Network policy definitions"
    ],
    prerequisites: ["User account management", "Network access policies"]
  },

  {
    id: "UC-MAB",
    title: "MAC Authentication Bypass (MAB)",
    category: "Authentication",
    subcategory: "Device-based",
    description: "Device authentication based on MAC address for headless devices",
    vendors_supported: ["All"],
    test_cases: ["MAC registration", "Device authorization", "Policy application"],
    config_templates: ["mab-config", "mac-address-auth"],
    documentation_links: [
      "portnox.com/docs/mac-authentication-bypass",
      "portnox.com/kb/headless-device-auth"
    ],
    complexity: "low",
    estimated_effort_weeks: 1,
    compliance_frameworks: ["Basic security"],
    authentication_methods: ["MAB", "MAC Address"],
    deployment_scenarios: ["IoT Devices", "Printers", "Legacy Equipment"],
    portnox_features: ["MAC Address Database", "Device Classification", "Automated Registration"],
    business_value: "Enable network access for devices that cannot perform interactive authentication",
    technical_requirements: [
      "MAC address inventory",
      "Device classification system",
      "Network access policies"
    ],
    prerequisites: ["Device discovery", "MAC address management process"]
  }
];

export const networkSegmentationUseCases: UseCase[] = [
  {
    id: "UC-DYNAMIC-VLAN",
    title: "Dynamic VLAN Assignment",
    category: "Network Segmentation",
    subcategory: "VLAN Management",
    description: "Automatic VLAN assignment based on user/device identity and policies",
    vendors_supported: ["Cisco", "Aruba", "Juniper", "Extreme"],
    test_cases: ["VLAN assignment validation", "Policy enforcement", "Fallback VLAN"],
    config_templates: ["dynamic-vlan-config", "radius-vlan-attributes"],
    documentation_links: [
      "portnox.com/docs/dynamic-vlan-assignment",
      "portnox.com/kb/network-segmentation"
    ],
    complexity: "medium",
    estimated_effort_weeks: 3,
    compliance_frameworks: ["PCI-DSS", "HIPAA", "SOX"],
    authentication_methods: ["802.1X", "MAB", "Web Auth"],
    deployment_scenarios: ["Corporate Network", "Healthcare", "Financial Services"],
    portnox_features: ["Policy Engine", "VLAN Management", "Real-time Assignment"],
    business_value: "Automated network segmentation based on identity for enhanced security and compliance",
    technical_requirements: [
      "VLAN-capable switches",
      "Policy definitions",
      "Network topology documentation"
    ],
    prerequisites: ["Network design", "VLAN planning", "Policy framework"]
  },

  {
    id: "UC-ROLE-BASED-ACCESS",
    title: "Role-Based Access Control",
    category: "Network Segmentation",
    subcategory: "Access Control",
    description: "Network access control based on user roles and group memberships",
    vendors_supported: ["All"],
    test_cases: ["Role validation", "Access enforcement", "Privilege escalation prevention"],
    config_templates: ["rbac-policies", "role-based-vlan"],
    documentation_links: [
      "portnox.com/docs/role-based-access-control",
      "portnox.com/kb/rbac-implementation"
    ],
    complexity: "high",
    estimated_effort_weeks: 4,
    compliance_frameworks: ["SOX", "HIPAA", "PCI-DSS", "GDPR"],
    authentication_methods: ["802.1X", "SAML", "OAuth"],
    deployment_scenarios: ["Enterprise", "Healthcare", "Financial Services"],
    portnox_features: ["Role Engine", "Group Synchronization", "Access Policies"],
    business_value: "Granular access control aligned with organizational roles and responsibilities",
    technical_requirements: [
      "Directory services integration",
      "Role definition framework",
      "Access control matrices"
    ],
    prerequisites: ["Organizational role analysis", "Access requirements mapping"]
  },

  {
    id: "UC-DEVICE-SEGMENTATION",
    title: "Device Type Segmentation",
    category: "Network Segmentation",
    subcategory: "Device Classification",
    description: "Network segmentation based on device type and classification",
    vendors_supported: ["All"],
    test_cases: ["Device classification", "Segment assignment", "Policy enforcement"],
    config_templates: ["device-classification", "segment-policies"],
    documentation_links: [
      "portnox.com/docs/device-type-segmentation",
      "portnox.com/kb/device-classification"
    ],
    complexity: "medium",
    estimated_effort_weeks: 3,
    compliance_frameworks: ["PCI-DSS", "HIPAA"],
    authentication_methods: ["MAB", "802.1X", "Device Fingerprinting"],
    deployment_scenarios: ["IoT Networks", "Medical Devices", "Industrial Controls"],
    portnox_features: ["Device Profiling", "Fingerprinting", "Automated Classification"],
    business_value: "Automated device segmentation for improved security and network performance",
    technical_requirements: [
      "Device profiling capabilities",
      "Network monitoring tools",
      "Segmentation policies"
    ],
    prerequisites: ["Device inventory", "Network topology", "Segmentation design"]
  }
];

export const deviceOnboardingUseCases: UseCase[] = [
  {
    id: "UC-BYOD-ONBOARDING",
    title: "BYOD Device Onboarding",
    category: "Device Onboarding",
    subcategory: "Self-Service",
    description: "Self-service onboarding portal for bring-your-own-device scenarios",
    vendors_supported: ["All"],
    test_cases: ["Device registration", "Certificate installation", "Policy application"],
    config_templates: ["byod-portal", "self-service-enrollment"],
    documentation_links: [
      "portnox.com/docs/byod-onboarding",
      "portnox.com/kb/self-service-portal"
    ],
    complexity: "high",
    estimated_effort_weeks: 5,
    compliance_frameworks: ["GDPR", "Privacy frameworks"],
    authentication_methods: ["Certificate", "Username/Password", "SSO"],
    deployment_scenarios: ["Corporate BYOD", "Education", "Remote Work"],
    portnox_features: ["Self-Service Portal", "Device Enrollment", "Certificate Management"],
    business_value: "Streamlined device onboarding reducing IT overhead while maintaining security",
    technical_requirements: [
      "Web portal infrastructure",
      "Certificate authority",
      "Device management integration"
    ],
    prerequisites: ["BYOD policy", "User training", "Support processes"]
  },

  {
    id: "UC-CORPORATE-ENROLLMENT",
    title: "Corporate Device Enrollment",
    category: "Device Onboarding",
    subcategory: "Managed Devices",
    description: "Automated enrollment for corporate-managed devices",
    vendors_supported: ["All"],
    test_cases: ["Bulk enrollment", "Policy deployment", "Compliance validation"],
    config_templates: ["corporate-enrollment", "managed-device-policies"],
    documentation_links: [
      "portnox.com/docs/corporate-device-enrollment",
      "portnox.com/kb/managed-device-onboarding"
    ],
    complexity: "medium",
    estimated_effort_weeks: 3,
    compliance_frameworks: ["SOX", "ISO27001"],
    authentication_methods: ["Certificate", "Machine Authentication"],
    deployment_scenarios: ["Corporate Environment", "Managed Devices"],
    portnox_features: ["Bulk Enrollment", "Policy Management", "Compliance Monitoring"],
    business_value: "Automated corporate device lifecycle management with policy enforcement",
    technical_requirements: [
      "Device management platform",
      "Enrollment automation",
      "Policy templates"
    ],
    prerequisites: ["Device procurement process", "Management platform setup"]
  }
];

export const complianceUseCases: UseCase[] = [
  {
    id: "UC-HIPAA-COMPLIANCE",
    title: "HIPAA Compliance Framework",
    category: "Compliance",
    subcategory: "Healthcare",
    description: "Network access controls aligned with HIPAA requirements",
    vendors_supported: ["All"],
    test_cases: ["Access logging", "Audit trail validation", "Compliance reporting"],
    config_templates: ["hipaa-policies", "healthcare-segmentation"],
    documentation_links: [
      "portnox.com/docs/hipaa-compliance",
      "portnox.com/kb/healthcare-nac"
    ],
    complexity: "high",
    estimated_effort_weeks: 6,
    compliance_frameworks: ["HIPAA", "HITECH"],
    authentication_methods: ["Strong Authentication", "Multi-Factor"],
    deployment_scenarios: ["Healthcare Networks", "Medical Facilities"],
    portnox_features: ["Audit Logging", "Compliance Reporting", "Access Controls"],
    business_value: "Comprehensive HIPAA compliance with automated controls and reporting",
    technical_requirements: [
      "Audit logging system",
      "Encryption capabilities",
      "Access monitoring tools"
    ],
    prerequisites: ["HIPAA assessment", "Risk analysis", "Policy framework"]
  },

  {
    id: "UC-PCI-SEGMENTATION",
    title: "PCI-DSS Network Segmentation",
    category: "Compliance",
    subcategory: "Financial",
    description: "Network segmentation and access controls for PCI-DSS compliance",
    vendors_supported: ["All"],
    test_cases: ["Cardholder data isolation", "Network segmentation validation"],
    config_templates: ["pci-segmentation", "cardholder-data-protection"],
    documentation_links: [
      "portnox.com/docs/pci-dss-compliance",
      "portnox.com/kb/payment-card-security"
    ],
    complexity: "high",
    estimated_effort_weeks: 8,
    compliance_frameworks: ["PCI-DSS"],
    authentication_methods: ["Strong Authentication", "Two-Factor"],
    deployment_scenarios: ["Retail Networks", "Payment Processing"],
    portnox_features: ["Network Segmentation", "Access Monitoring", "Compliance Controls"],
    business_value: "PCI-DSS compliant network architecture protecting cardholder data",
    technical_requirements: [
      "Network segmentation",
      "Firewall integration",
      "Monitoring systems"
    ],
    prerequisites: ["PCI scope definition", "Data flow mapping", "Security assessment"]
  }
];

// Export all use cases as a single library
export const useCaseLibrary: UseCase[] = [
  ...authenticationUseCases,
  ...networkSegmentationUseCases,
  ...deviceOnboardingUseCases,
  ...complianceUseCases
];

// Helper functions for filtering and searching
export const getUseCasesByCategory = (category: string): UseCase[] => {
  return useCaseLibrary.filter(useCase => useCase.category === category);
};

export const getUseCasesByComplexity = (complexity: 'low' | 'medium' | 'high'): UseCase[] => {
  return useCaseLibrary.filter(useCase => useCase.complexity === complexity);
};

export const searchUseCases = (query: string): UseCase[] => {
  const lowercaseQuery = query.toLowerCase();
  return useCaseLibrary.filter(useCase => 
    useCase.title.toLowerCase().includes(lowercaseQuery) ||
    useCase.description.toLowerCase().includes(lowercaseQuery) ||
    useCase.category.toLowerCase().includes(lowercaseQuery) ||
    useCase.authentication_methods.some(method => 
      method.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const getUseCaseById = (id: string): UseCase | undefined => {
  return useCaseLibrary.find(useCase => useCase.id === id);
};