// Comprehensive Enterprise Library Data for Seeding
export const comprehensivePainPoints = [
  // Infrastructure & Hardware
  {
    title: "End-of-Life Hardware Dependencies",
    description: "Critical business operations relying on hardware that's reached manufacturer end-of-life, creating security vulnerabilities and compliance risks",
    category: "infrastructure",
    severity: "critical" as const,
    recommended_solutions: ["Hardware refresh program", "Phased migration strategy", "Hybrid deployment approach"],
    industry_specific: ["manufacturing", "healthcare", "finance", "government"]
  },
  {
    title: "Legacy Network Infrastructure Limitations",
    description: "Outdated network equipment limiting bandwidth, security features, and modern protocol support",
    category: "infrastructure",
    severity: "high" as const,
    recommended_solutions: ["Network modernization", "SDN implementation", "Zero-trust architecture"],
    industry_specific: ["education", "healthcare", "manufacturing"]
  },
  {
    title: "Scaling Infrastructure Complexity",
    description: "Exponential complexity and cost increases when scaling traditional network infrastructure",
    category: "infrastructure",
    severity: "high" as const,
    recommended_solutions: ["Cloud-native solutions", "Automated provisioning", "Software-defined networking"],
    industry_specific: ["technology", "retail", "finance"]
  },
  
  // Security & Compliance
  {
    title: "Regulatory Compliance Overhead",
    description: "Massive administrative burden and costs associated with maintaining compliance across multiple frameworks",
    category: "compliance",
    severity: "critical" as const,
    recommended_solutions: ["Automated compliance monitoring", "Unified governance platform", "Policy automation"],
    industry_specific: ["finance", "healthcare", "government", "defense"]
  },
  {
    title: "Multi-Vendor Security Tool Sprawl",
    description: "Dozens of disconnected security tools creating blind spots, alert fatigue, and integration complexity",
    category: "security",
    severity: "high" as const,
    recommended_solutions: ["Security platform consolidation", "SIEM integration", "Unified dashboards"],
    industry_specific: ["finance", "technology", "healthcare"]
  },
  {
    title: "Insider Threat Detection Gaps",
    description: "Lack of visibility into user behavior patterns and privileged access activities",
    category: "security",
    severity: "critical" as const,
    recommended_solutions: ["User behavior analytics", "Privileged access management", "Zero-trust implementation"],
    industry_specific: ["government", "defense", "finance", "healthcare"]
  },
  {
    title: "Cyber Insurance Premium Escalation",
    description: "Skyrocketing cyber insurance costs due to inadequate security posture documentation",
    category: "risk_management",
    severity: "high" as const,
    recommended_solutions: ["Security posture automation", "Continuous compliance monitoring", "Risk quantification"],
    industry_specific: ["finance", "healthcare", "retail", "manufacturing"]
  },

  // Authentication & Access Control
  {
    title: "Password-Based Authentication Vulnerabilities",
    description: "High breach risk and user friction from legacy password-dependent systems",
    category: "authentication",
    severity: "critical" as const,
    recommended_solutions: ["Passwordless authentication", "Multi-factor authentication", "Single sign-on"],
    industry_specific: ["all"]
  },
  {
    title: "Privileged Access Management Gaps",
    description: "Uncontrolled administrative access creating compliance violations and security risks",
    category: "access_control",
    severity: "critical" as const,
    recommended_solutions: ["PAM solution implementation", "Just-in-time access", "Zero standing privileges"],
    industry_specific: ["government", "finance", "healthcare", "defense"]
  },
  {
    title: "Third-Party Vendor Access Risks",
    description: "Unmonitored contractor and vendor access to critical systems and data",
    category: "access_control",
    severity: "high" as const,
    recommended_solutions: ["Vendor access governance", "Temporary access provisioning", "Activity monitoring"],
    industry_specific: ["manufacturing", "healthcare", "finance"]
  },

  // Cloud & Digital Transformation
  {
    title: "Multi-Cloud Security Inconsistencies",
    description: "Disparate security policies and tools across different cloud providers creating gaps",
    category: "cloud_security",
    severity: "high" as const,
    recommended_solutions: ["Cloud security posture management", "Unified policy enforcement", "Cross-cloud monitoring"],
    industry_specific: ["technology", "finance", "retail"]
  },
  {
    title: "Shadow IT Proliferation",
    description: "Unmanaged cloud services and applications creating security and compliance blind spots",
    category: "governance",
    severity: "high" as const,
    recommended_solutions: ["Cloud discovery tools", "Shadow IT governance", "Sanctioned alternatives"],
    industry_specific: ["all"]
  },
  {
    title: "Legacy Application Cloud Migration Barriers",
    description: "Critical applications that cannot be easily modernized for cloud deployment",
    category: "digital_transformation",
    severity: "medium" as const,
    recommended_solutions: ["Application assessment", "Hybrid cloud strategy", "Gradual modernization"],
    industry_specific: ["manufacturing", "healthcare", "government"]
  },

  // Operations & Management
  {
    title: "Manual Configuration Management",
    description: "Time-consuming manual processes for network device configuration leading to errors and delays",
    category: "operations",
    severity: "medium" as const,
    recommended_solutions: ["Configuration automation", "Infrastructure as code", "DevOps practices"],
    industry_specific: ["all"]
  },
  {
    title: "Patch Management Complexity",
    description: "Coordination overhead and downtime risks when patching distributed systems",
    category: "operations",
    severity: "high" as const,
    recommended_solutions: ["Automated patch management", "Rolling updates", "Immutable infrastructure"],
    industry_specific: ["all"]
  },
  {
    title: "Limited Network Visibility",
    description: "Lack of real-time insights into network performance, security events, and user activities",
    category: "monitoring",
    severity: "high" as const,
    recommended_solutions: ["Network analytics platforms", "Real-time monitoring", "AI-driven insights"],
    industry_specific: ["all"]
  },

  // Cost & Resource Management
  {
    title: "Escalating IT Support Costs",
    description: "Growing helpdesk tickets and support overhead for identity and access issues",
    category: "cost_management",
    severity: "medium" as const,
    recommended_solutions: ["Self-service capabilities", "Automated provisioning", "User education programs"],
    industry_specific: ["all"]
  },
  {
    title: "License Management Complexity",
    description: "Difficulty tracking and optimizing software licenses across diverse environments",
    category: "cost_management",
    severity: "medium" as const,
    recommended_solutions: ["License management tools", "Usage analytics", "Optimization strategies"],
    industry_specific: ["all"]
  },

  // Mergers & Acquisitions
  {
    title: "M&A IT Integration Complexity",
    description: "Massive effort required to integrate disparate IT systems during mergers and acquisitions",
    category: "integration",
    severity: "critical" as const,
    recommended_solutions: ["Integration platforms", "Identity federation", "Phased integration approach"],
    industry_specific: ["finance", "healthcare", "technology", "manufacturing"]
  },
  {
    title: "Due Diligence Security Assessment Gaps",
    description: "Inadequate visibility into target company's security posture during M&A processes",
    category: "risk_assessment",
    severity: "high" as const,
    recommended_solutions: ["Automated security assessments", "Risk scoring frameworks", "Continuous monitoring"],
    industry_specific: ["finance", "private_equity", "consulting"]
  },

  // Industry-Specific Challenges
  {
    title: "HIPAA Compliance Automation Gaps",
    description: "Manual processes for healthcare compliance creating audit risks and operational overhead",
    category: "healthcare_compliance",
    severity: "critical" as const,
    recommended_solutions: ["Automated compliance monitoring", "Audit trail automation", "Privacy controls"],
    industry_specific: ["healthcare"]
  },
  {
    title: "SOX Controls Implementation Complexity",
    description: "Complex and expensive implementation of Sarbanes-Oxley financial controls",
    category: "financial_compliance",
    severity: "critical" as const,
    recommended_solutions: ["Automated controls testing", "Continuous monitoring", "Risk-based approach"],
    industry_specific: ["finance", "public_companies"]
  },
  {
    title: "CMMC Certification Preparation Burden",
    description: "Extensive preparation required for Cybersecurity Maturity Model Certification",
    category: "defense_compliance",
    severity: "critical" as const,
    recommended_solutions: ["CMMC readiness assessments", "Gap analysis tools", "Continuous compliance"],
    industry_specific: ["defense", "government_contractors"]
  },
  {
    title: "PCI DSS Scope Reduction Challenges",
    description: "Difficulty minimizing PCI DSS scope while maintaining business functionality",
    category: "payment_compliance",
    severity: "high" as const,
    recommended_solutions: ["Network segmentation", "Tokenization", "Scope reduction strategies"],
    industry_specific: ["retail", "finance", "hospitality"]
  },

  // Remote Work & Modern Workforce
  {
    title: "Remote Work Security Gaps",
    description: "Inadequate security controls for distributed workforce accessing corporate resources",
    category: "remote_work",
    severity: "high" as const,
    recommended_solutions: ["Zero-trust network access", "Endpoint protection", "VPN alternatives"],
    industry_specific: ["all"]
  },
  {
    title: "BYOD Management Complexity",
    description: "Challenges securing and managing employee-owned devices accessing corporate resources",
    category: "device_management",
    severity: "medium" as const,
    recommended_solutions: ["Mobile device management", "Application wrapping", "Conditional access"],
    industry_specific: ["all"]
  },

  // IoT & Edge Computing
  {
    title: "IoT Device Security Vulnerabilities",
    description: "Massive security risks from unmanaged and unsecured IoT devices on corporate networks",
    category: "iot_security",
    severity: "critical" as const,
    recommended_solutions: ["IoT device discovery", "Network segmentation", "Device lifecycle management"],
    industry_specific: ["manufacturing", "healthcare", "utilities", "smart_buildings"]
  },
  {
    title: "Edge Computing Governance Gaps",
    description: "Lack of centralized control and visibility over distributed edge computing resources",
    category: "edge_computing",
    severity: "medium" as const,
    recommended_solutions: ["Edge management platforms", "Centralized policy enforcement", "Remote monitoring"],
    industry_specific: ["manufacturing", "retail", "telecommunications"]
  }
];

export const comprehensiveRequirements = [
  // Zero Trust Architecture
  {
    title: "Zero Trust Network Access Implementation",
    category: "zero_trust",
    subcategory: "network_access",
    priority: "critical" as const,
    requirement_type: "security",
    description: "Implement comprehensive zero trust network access controls with device verification, user authentication, and application-level authorization",
    rationale: "Traditional perimeter-based security is inadequate for modern distributed environments",
    acceptance_criteria: [
      "All network access requires device and user verification",
      "Application-level access controls implemented",
      "Continuous trust evaluation and adjustment",
      "Network micro-segmentation deployed"
    ],
    verification_methods: ["Security testing", "Compliance audit", "Penetration testing"],
    test_cases: ["Device trust verification", "User authentication testing", "Access policy enforcement"],
    related_use_cases: ["remote_work_security", "privileged_access_management"],
    dependencies: ["Identity provider integration", "Device management platform"],
    assumptions: ["Users will accept additional authentication steps"],
    constraints: ["Legacy application compatibility"],
    compliance_frameworks: ["NIST", "ISO27001", "CMMC"],
    vendor_requirements: {
      "required_certifications": ["FedRAMP", "Common Criteria"],
      "integration_capabilities": ["SAML", "OIDC", "SCIM"]
    },
    portnox_features: ["Device fingerprinting", "Behavioral analysis", "Policy enforcement"],
    documentation_references: ["NIST Zero Trust Architecture", "CISA Zero Trust Maturity Model"],
    tags: ["zero_trust", "network_security", "access_control"],
    status: "approved" as const
  },

  // Identity & Access Management
  {
    title: "Passwordless Authentication Deployment",
    category: "identity_management",
    subcategory: "authentication",
    priority: "high" as const,
    requirement_type: "security",
    description: "Deploy passwordless authentication using FIDO2, biometrics, and hardware tokens",
    rationale: "Eliminate password-related security risks and improve user experience",
    acceptance_criteria: [
      "90% of users enrolled in passwordless authentication",
      "Support for multiple authentication methods",
      "Fallback mechanisms for edge cases",
      "Integration with existing SSO infrastructure"
    ],
    verification_methods: ["User acceptance testing", "Security assessment"],
    test_cases: ["FIDO2 authentication flow", "Biometric enrollment", "Token-based authentication"],
    related_use_cases: ["single_sign_on", "multi_factor_authentication"],
    dependencies: ["Identity provider upgrade", "Device enrollment"],
    assumptions: ["Users have compatible devices"],
    constraints: ["Legacy system integration limitations"],
    compliance_frameworks: ["NIST", "FIDO Alliance"],
    vendor_requirements: {
      "standards_support": ["FIDO2", "WebAuthn", "CTAP"],
      "device_compatibility": ["Windows Hello", "Touch ID", "YubiKey"]
    },
    portnox_features: ["Certificate-based authentication", "Device trust verification"],
    documentation_references: ["FIDO Alliance specifications", "NIST authentication guidelines"],
    tags: ["passwordless", "authentication", "biometrics", "FIDO2"],
    status: "approved" as const
  },

  // Compliance & Governance
  {
    title: "GDPR Data Protection Controls",
    category: "compliance",
    subcategory: "data_protection",
    priority: "critical" as const,
    requirement_type: "compliance",
    description: "Implement comprehensive GDPR compliance controls for data protection and privacy",
    rationale: "Legal requirement for EU operations and customer data protection",
    acceptance_criteria: [
      "Data mapping and classification completed",
      "Consent management system implemented",
      "Data subject rights automation",
      "Privacy by design principles applied"
    ],
    verification_methods: ["Legal review", "Privacy impact assessment", "Audit"],
    test_cases: ["Data subject access requests", "Consent withdrawal", "Data portability"],
    related_use_cases: ["data_governance", "privacy_management"],
    dependencies: ["Data discovery tools", "Privacy management platform"],
    assumptions: ["Business processes can be modified for compliance"],
    constraints: ["Existing system limitations"],
    compliance_frameworks: ["GDPR", "ISO27001", "SOC2"],
    vendor_requirements: {
      "certifications": ["ISO27001", "SOC2 Type II"],
      "features": ["Data encryption", "Audit logging", "Access controls"]
    },
    portnox_features: ["Data access monitoring", "User activity tracking"],
    documentation_references: ["GDPR regulation text", "ICO guidance"],
    tags: ["GDPR", "data_protection", "privacy", "compliance"],
    status: "approved" as const
  },

  // Cloud Security
  {
    title: "Multi-Cloud Security Posture Management",
    category: "cloud_security",
    subcategory: "posture_management",
    priority: "high" as const,
    requirement_type: "security",
    description: "Deploy unified security posture management across AWS, Azure, and GCP environments",
    rationale: "Ensure consistent security controls across all cloud platforms",
    acceptance_criteria: [
      "Unified security dashboard across all clouds",
      "Automated compliance checking",
      "Configuration drift detection",
      "Security policy enforcement"
    ],
    verification_methods: ["Security assessment", "Compliance scan", "Architecture review"],
    test_cases: ["Policy enforcement testing", "Drift detection", "Compliance reporting"],
    related_use_cases: ["cloud_governance", "compliance_automation"],
    dependencies: ["Cloud access credentials", "Security tools integration"],
    assumptions: ["Cloud APIs remain stable"],
    constraints: ["Cloud provider feature limitations"],
    compliance_frameworks: ["CIS", "NIST", "CSA"],
    vendor_requirements: {
      "cloud_support": ["AWS", "Azure", "GCP"],
      "api_integrations": ["CloudFormation", "ARM templates", "Terraform"]
    },
    portnox_features: ["Cloud workload protection", "Container security"],
    documentation_references: ["CIS benchmarks", "Cloud security best practices"],
    tags: ["cloud_security", "multi_cloud", "posture_management"],
    status: "approved" as const
  },

  // Network Security
  {
    title: "Network Micro-Segmentation Implementation",
    category: "network_security",
    subcategory: "segmentation",
    priority: "high" as const,
    requirement_type: "security",
    description: "Implement granular network segmentation to limit lateral movement and contain threats",
    rationale: "Reduce blast radius of security incidents and improve compliance posture",
    acceptance_criteria: [
      "Network zones defined and implemented",
      "East-west traffic inspection deployed",
      "Application-aware segmentation rules",
      "Automated policy enforcement"
    ],
    verification_methods: ["Network testing", "Security assessment", "Traffic analysis"],
    test_cases: ["Lateral movement prevention", "Zone isolation testing", "Policy enforcement"],
    related_use_cases: ["zero_trust_networking", "threat_containment"],
    dependencies: ["Network infrastructure upgrade", "Security policy definition"],
    assumptions: ["Network topology can be modified"],
    constraints: ["Legacy application requirements"],
    compliance_frameworks: ["NIST", "PCI DSS", "HIPAA"],
    vendor_requirements: {
      "technologies": ["Software-defined perimeter", "Next-gen firewalls"],
      "protocols": ["802.1X", "MACsec", "IPSec"]
    },
    portnox_features: ["Dynamic segmentation", "Policy automation", "Threat detection"],
    documentation_references: ["NIST network security guide", "Micro-segmentation best practices"],
    tags: ["network_security", "segmentation", "zero_trust"],
    status: "approved" as const
  },

  // Incident Response & Monitoring
  {
    title: "Security Incident Response Automation",
    category: "incident_response",
    subcategory: "automation",
    priority: "high" as const,
    requirement_type: "security",
    description: "Automate security incident detection, analysis, and initial response procedures",
    rationale: "Reduce incident response time and improve consistency of security operations",
    acceptance_criteria: [
      "Automated threat detection and alerting",
      "Incident classification and prioritization",
      "Automated containment procedures",
      "Integration with SIEM and SOAR platforms"
    ],
    verification_methods: ["Tabletop exercises", "Automated testing", "Response time metrics"],
    test_cases: ["Incident detection", "Automated response", "Escalation procedures"],
    related_use_cases: ["threat_hunting", "security_monitoring"],
    dependencies: ["SIEM platform", "SOAR integration", "Runbook development"],
    assumptions: ["Security team can maintain automation"],
    constraints: ["False positive management"],
    compliance_frameworks: ["NIST", "ISO27035", "SOC2"],
    vendor_requirements: {
      "integrations": ["SIEM platforms", "Threat intelligence feeds"],
      "capabilities": ["Machine learning", "Behavioral analysis"]
    },
    portnox_features: ["Automated response", "Threat intelligence", "Behavioral analytics"],
    documentation_references: ["NIST incident response framework", "SANS incident handling"],
    tags: ["incident_response", "automation", "SIEM", "SOAR"],
    status: "approved" as const
  },

  // Mobile & Endpoint Security
  {
    title: "Mobile Device Management Integration",
    category: "endpoint_security",
    subcategory: "mobile_management",
    priority: "medium" as const,
    requirement_type: "security",
    description: "Integrate comprehensive mobile device management with network access controls",
    rationale: "Secure mobile devices accessing corporate resources",
    acceptance_criteria: [
      "Device enrollment and compliance checking",
      "Application management and security",
      "Remote wipe and lock capabilities",
      "Integration with network access controls"
    ],
    verification_methods: ["Device testing", "Security assessment", "User acceptance testing"],
    test_cases: ["Device enrollment", "Compliance enforcement", "Access control integration"],
    related_use_cases: ["byod_management", "remote_work_security"],
    dependencies: ["MDM platform selection", "Device enrollment process"],
    assumptions: ["Users will accept MDM enrollment"],
    constraints: ["Privacy concerns", "Device compatibility"],
    compliance_frameworks: ["NIST", "ISO27001"],
    vendor_requirements: {
      "platforms": ["iOS", "Android", "Windows Mobile"],
      "integrations": ["Active Directory", "LDAP", "RADIUS"]
    },
    portnox_features: ["Device fingerprinting", "Compliance checking", "Access control"],
    documentation_references: ["MDM best practices", "Mobile security guidelines"],
    tags: ["mobile_security", "MDM", "endpoint_protection"],
    status: "approved" as const
  },

  // Data Protection & Privacy
  {
    title: "Data Loss Prevention Implementation",
    category: "data_protection",
    subcategory: "loss_prevention",
    priority: "high" as const,
    requirement_type: "security",
    description: "Deploy comprehensive data loss prevention controls across all data vectors",
    rationale: "Prevent unauthorized data exfiltration and ensure compliance with data protection regulations",
    acceptance_criteria: [
      "Data classification and labeling implemented",
      "DLP policies covering all vectors (email, web, endpoints)",
      "Encryption for data at rest and in transit",
      "User activity monitoring and alerting"
    ],
    verification_methods: ["Data testing", "Policy testing", "Compliance audit"],
    test_cases: ["Data exfiltration prevention", "Policy enforcement", "Encryption verification"],
    related_use_cases: ["data_governance", "compliance_management"],
    dependencies: ["Data classification", "DLP platform deployment"],
    assumptions: ["Users can adapt to DLP controls"],
    constraints: ["Performance impact on systems"],
    compliance_frameworks: ["GDPR", "HIPAA", "PCI DSS", "SOX"],
    vendor_requirements: {
      "capabilities": ["Content inspection", "Machine learning", "Behavior analysis"],
      "integrations": ["SIEM", "Identity providers", "Cloud platforms"]
    },
    portnox_features: ["Data access monitoring", "User behavior analytics"],
    documentation_references: ["DLP best practices", "Data protection guidelines"],
    tags: ["data_protection", "DLP", "encryption", "compliance"],
    status: "approved" as const
  },

  // Vendor & Third-Party Management
  {
    title: "Third-Party Risk Assessment Automation",
    category: "vendor_management",
    subcategory: "risk_assessment",
    priority: "medium" as const,
    requirement_type: "governance",
    description: "Automate third-party vendor risk assessments and ongoing monitoring",
    rationale: "Ensure consistent evaluation and monitoring of vendor security posture",
    acceptance_criteria: [
      "Automated vendor risk scoring",
      "Continuous monitoring of vendor security posture",
      "Integration with procurement processes",
      "Standardized risk assessment questionnaires"
    ],
    verification_methods: ["Risk assessment testing", "Vendor audit", "Process review"],
    test_cases: ["Risk scoring accuracy", "Monitoring effectiveness", "Integration testing"],
    related_use_cases: ["procurement_security", "supply_chain_management"],
    dependencies: ["Vendor risk platform", "Procurement system integration"],
    assumptions: ["Vendors will participate in assessments"],
    constraints: ["Vendor cooperation requirements"],
    compliance_frameworks: ["SOC2", "ISO27001", "NIST"],
    vendor_requirements: {
      "features": ["Risk scoring", "Continuous monitoring", "Reporting"],
      "integrations": ["Procurement systems", "Security ratings services"]
    },
    portnox_features: ["Vendor access monitoring", "Risk-based access controls"],
    documentation_references: ["Third-party risk management guidelines"],
    tags: ["vendor_management", "risk_assessment", "third_party"],
    status: "approved" as const
  },

  // Backup & Disaster Recovery
  {
    title: "Cyber Recovery Implementation",
    category: "business_continuity",
    subcategory: "cyber_recovery",
    priority: "critical" as const,
    requirement_type: "resilience",
    description: "Implement cyber recovery capabilities to recover from ransomware and cyber attacks",
    rationale: "Ensure business continuity in the event of successful cyber attacks",
    acceptance_criteria: [
      "Immutable backup storage implemented",
      "Air-gapped recovery environment established",
      "Automated recovery testing procedures",
      "Recovery time objectives met"
    ],
    verification_methods: ["Recovery testing", "Disaster simulation", "RTO/RPO validation"],
    test_cases: ["Ransomware recovery", "Data integrity verification", "Recovery automation"],
    related_use_cases: ["business_continuity", "disaster_recovery"],
    dependencies: ["Backup infrastructure", "Recovery site setup"],
    assumptions: ["Recovery infrastructure can be maintained"],
    constraints: ["Budget limitations", "Recovery time requirements"],
    compliance_frameworks: ["ISO22301", "NIST", "SOC2"],
    vendor_requirements: {
      "capabilities": ["Immutable storage", "Air-gap technology", "Automation"],
      "certifications": ["Security certifications", "Compliance frameworks"]
    },
    portnox_features: ["Access monitoring", "Integrity verification"],
    documentation_references: ["Cyber recovery best practices", "NIST backup guidelines"],
    tags: ["cyber_recovery", "backup", "disaster_recovery", "ransomware"],
    status: "approved" as const
  }
];

export const comprehensiveUseCases = [
  // Zero Trust & Network Access
  {
    name: "Zero Trust Network Access (ZTNA)",
    category: "zero_trust",
    subcategory: "network_access",
    description: "Implement comprehensive zero trust network access with device verification, user authentication, and application-level authorization",
    business_value: "Reduce security incidents by 70% and improve compliance posture while enabling secure remote work",
    technical_requirements: [
      "Device identification and profiling",
      "Multi-factor authentication integration",
      "Application-level access controls",
      "Continuous trust verification",
      "Policy-based network segmentation"
    ],
    prerequisites: [
      "Identity provider infrastructure",
      "Certificate authority setup",
      "Network infrastructure assessment",
      "Policy framework definition"
    ],
    test_scenarios: [
      "Device trust verification",
      "User authentication flows",
      "Application access testing",
      "Policy enforcement validation",
      "Incident response procedures"
    ],
    supported_vendors: ["Portnox", "Zscaler", "Palo Alto", "Cisco", "Microsoft"],
    portnox_features: [
      "Device fingerprinting",
      "Behavioral analysis",
      "Dynamic policy enforcement",
      "Risk-based authentication",
      "Network segmentation"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 12,
    dependencies: [
      "Identity management system",
      "Certificate infrastructure",
      "Network access points",
      "Policy management platform"
    ],
    compliance_frameworks: ["NIST", "ISO27001", "CMMC", "SOC2"],
    authentication_methods: [
      "Certificate-based",
      "Multi-factor authentication",
      "Biometric verification",
      "Hardware tokens"
    ],
    deployment_scenarios: [
      "Greenfield deployment",
      "Phased migration",
      "Hybrid implementation",
      "Cloud-first approach"
    ],
    tags: ["zero_trust", "network_access", "device_verification", "authentication"],
    status: "active" as const
  },

  // Passwordless Authentication
  {
    name: "Passwordless Authentication Implementation",
    category: "authentication",
    subcategory: "passwordless",
    description: "Deploy comprehensive passwordless authentication using FIDO2, biometrics, and hardware tokens",
    business_value: "Eliminate 95% of password-related security incidents and reduce helpdesk costs by 60%",
    technical_requirements: [
      "FIDO2/WebAuthn support",
      "Biometric authentication",
      "Hardware token integration",
      "Fallback authentication methods",
      "SSO integration"
    ],
    prerequisites: [
      "Compatible devices and browsers",
      "Identity provider upgrade",
      "User enrollment process",
      "Support procedures"
    ],
    test_scenarios: [
      "FIDO2 authentication flow",
      "Biometric enrollment and usage",
      "Hardware token authentication",
      "Fallback scenarios",
      "SSO integration testing"
    ],
    supported_vendors: ["Microsoft", "Okta", "Ping Identity", "Auth0", "Portnox"],
    portnox_features: [
      "Certificate-based authentication",
      "Device trust verification",
      "Behavioral authentication",
      "Risk assessment"
    ],
    complexity: "medium" as const,
    estimated_effort_weeks: 8,
    dependencies: [
      "Identity provider platform",
      "Device enrollment system",
      "User communication plan",
      "Support training"
    ],
    compliance_frameworks: ["NIST", "FIDO Alliance", "ISO27001"],
    authentication_methods: [
      "FIDO2",
      "Windows Hello",
      "Touch ID/Face ID",
      "YubiKey",
      "Smart cards"
    ],
    deployment_scenarios: [
      "Pilot group rollout",
      "Department-by-department",
      "Application-specific",
      "Organization-wide"
    ],
    tags: ["passwordless", "FIDO2", "biometrics", "authentication"],
    status: "active" as const
  },

  // Cloud Security Posture Management
  {
    name: "Multi-Cloud Security Posture Management",
    category: "cloud_security",
    subcategory: "posture_management",
    description: "Implement unified security posture management across AWS, Azure, and GCP environments",
    business_value: "Reduce cloud security incidents by 80% and achieve consistent compliance across all cloud platforms",
    technical_requirements: [
      "Multi-cloud asset discovery",
      "Configuration assessment",
      "Policy compliance checking",
      "Automated remediation",
      "Unified dashboards"
    ],
    prerequisites: [
      "Cloud platform access",
      "Security framework definition",
      "Baseline configurations",
      "Remediation procedures"
    ],
    test_scenarios: [
      "Asset discovery validation",
      "Compliance checking",
      "Policy enforcement",
      "Automated remediation",
      "Reporting accuracy"
    ],
    supported_vendors: ["Prisma Cloud", "CloudGuard", "Azure Security Center", "AWS Security Hub"],
    portnox_features: [
      "Cloud workload protection",
      "Container security",
      "API security monitoring"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 16,
    dependencies: [
      "Cloud platform APIs",
      "Security policies",
      "Automation framework",
      "Monitoring tools"
    ],
    compliance_frameworks: ["CIS", "NIST", "CSA", "ISO27001"],
    authentication_methods: [
      "Service principal authentication",
      "IAM roles",
      "API keys",
      "OAuth 2.0"
    ],
    deployment_scenarios: [
      "Single cloud pilot",
      "Multi-cloud gradual",
      "Hybrid cloud",
      "Full cloud migration"
    ],
    tags: ["cloud_security", "multi_cloud", "posture_management", "compliance"],
    status: "active" as const
  },

  // Privileged Access Management
  {
    name: "Privileged Access Management (PAM)",
    category: "access_control",
    subcategory: "privileged_access",
    description: "Implement comprehensive privileged access management with just-in-time access and session monitoring",
    business_value: "Reduce privileged access risks by 90% and achieve compliance with regulatory requirements",
    technical_requirements: [
      "Privileged account discovery",
      "Password vaulting",
      "Session recording",
      "Just-in-time access",
      "Access analytics"
    ],
    prerequisites: [
      "Asset inventory",
      "Account classification",
      "Access policies",
      "Approval workflows"
    ],
    test_scenarios: [
      "Account discovery",
      "Password rotation",
      "Session monitoring",
      "JIT access provisioning",
      "Emergency access procedures"
    ],
    supported_vendors: ["CyberArk", "BeyondTrust", "Thycotic", "HashiCorp", "AWS IAM"],
    portnox_features: [
      "Privileged user monitoring",
      "Access analytics",
      "Behavioral analysis",
      "Risk scoring"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 20,
    dependencies: [
      "Directory services",
      "Ticketing system",
      "Monitoring infrastructure",
      "Approval processes"
    ],
    compliance_frameworks: ["SOX", "PCI DSS", "HIPAA", "CMMC"],
    authentication_methods: [
      "Multi-factor authentication",
      "Certificate-based",
      "Biometric verification",
      "Hardware tokens"
    ],
    deployment_scenarios: [
      "Critical systems first",
      "Phased by risk level",
      "Application-specific",
      "Infrastructure-wide"
    ],
    tags: ["privileged_access", "PAM", "just_in_time", "session_monitoring"],
    status: "active" as const
  },

  // SIEM Integration & Security Monitoring
  {
    name: "Security Information and Event Management (SIEM)",
    category: "security_monitoring",
    subcategory: "siem",
    description: "Deploy comprehensive SIEM solution with advanced analytics and automated incident response",
    business_value: "Reduce security incident detection time by 85% and improve threat hunting capabilities",
    technical_requirements: [
      "Log aggregation and parsing",
      "Real-time correlation",
      "Machine learning analytics",
      "Automated alerting",
      "Integration with security tools"
    ],
    prerequisites: [
      "Log sources identification",
      "Network infrastructure",
      "Use case development",
      "Playbook creation"
    ],
    test_scenarios: [
      "Log ingestion testing",
      "Correlation rule validation",
      "Alert accuracy assessment",
      "Integration testing",
      "Incident response workflows"
    ],
    supported_vendors: ["Splunk", "IBM QRadar", "Microsoft Sentinel", "Elastic", "Chronicle"],
    portnox_features: [
      "Network activity logs",
      "User behavior data",
      "Device intelligence",
      "Threat indicators"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 24,
    dependencies: [
      "Network infrastructure",
      "Security tools",
      "Data storage",
      "Analytics platform"
    ],
    compliance_frameworks: ["PCI DSS", "HIPAA", "SOX", "GDPR"],
    authentication_methods: [
      "SAML integration",
      "LDAP authentication",
      "API keys",
      "Certificate-based"
    ],
    deployment_scenarios: [
      "Proof of concept",
      "Phased deployment",
      "Big bang approach",
      "Hybrid implementation"
    ],
    tags: ["SIEM", "security_monitoring", "incident_response", "analytics"],
    status: "active" as const
  },

  // Network Access Control (NAC)
  {
    name: "Network Access Control (NAC)",
    category: "network_security",
    subcategory: "access_control",
    description: "Implement comprehensive network access control with device profiling and policy enforcement",
    business_value: "Prevent 99% of unauthorized network access and improve network visibility",
    technical_requirements: [
      "Device discovery and profiling",
      "Policy-based access control",
      "Network segmentation",
      "Guest access management",
      "Compliance checking"
    ],
    prerequisites: [
      "Network infrastructure assessment",
      "Policy framework",
      "Device classification",
      "Remediation procedures"
    ],
    test_scenarios: [
      "Device profiling accuracy",
      "Policy enforcement",
      "Guest access workflows",
      "Non-compliant device handling",
      "Network segmentation"
    ],
    supported_vendors: ["Portnox", "Cisco ISE", "Aruba ClearPass", "ForeScout", "Bradford"],
    portnox_features: [
      "Agentless device profiling",
      "Behavioral analysis",
      "Automated remediation",
      "Cloud-based management"
    ],
    complexity: "medium" as const,
    estimated_effort_weeks: 12,
    dependencies: [
      "Network switches",
      "Wireless controllers",
      "Directory services",
      "Certificate authority"
    ],
    compliance_frameworks: ["NIST", "ISO27001", "PCI DSS"],
    authentication_methods: [
      "802.1X",
      "MAC authentication",
      "Web portal",
      "Certificate-based"
    ],
    deployment_scenarios: [
      "Pilot network segment",
      "Critical areas first",
      "Phased by location",
      "Full network rollout"
    ],
    tags: ["NAC", "network_security", "device_profiling", "access_control"],
    status: "active" as const
  },

  // Mobile Device Management (MDM)
  {
    name: "Mobile Device Management (MDM)",
    category: "endpoint_security",
    subcategory: "mobile_management",
    description: "Deploy comprehensive mobile device management with security policies and application control",
    business_value: "Secure 100% of mobile devices and reduce mobile security incidents by 95%",
    technical_requirements: [
      "Device enrollment and profiling",
      "Application management",
      "Security policy enforcement",
      "Remote wipe capabilities",
      "Compliance monitoring"
    ],
    prerequisites: [
      "Mobile device policies",
      "App store configuration",
      "Certificate infrastructure",
      "User communication plan"
    ],
    test_scenarios: [
      "Device enrollment process",
      "App deployment and management",
      "Policy enforcement",
      "Remote wipe functionality",
      "Compliance reporting"
    ],
    supported_vendors: ["Microsoft Intune", "VMware Workspace ONE", "MobileIron", "Jamf", "Google"],
    portnox_features: [
      "Mobile device visibility",
      "Risk assessment",
      "Network access control",
      "Behavioral monitoring"
    ],
    complexity: "medium" as const,
    estimated_effort_weeks: 10,
    dependencies: [
      "Apple/Google business accounts",
      "Certificate authority",
      "Directory integration",
      "App catalog"
    ],
    compliance_frameworks: ["NIST", "HIPAA", "GDPR"],
    authentication_methods: [
      "Certificate-based",
      "Biometric authentication",
      "PIN/passcode",
      "Multi-factor"
    ],
    deployment_scenarios: [
      "BYOD implementation",
      "Corporate-owned devices",
      "Hybrid approach",
      "Cloud-first deployment"
    ],
    tags: ["MDM", "mobile_security", "device_management", "BYOD"],
    status: "active" as const
  },

  // Data Loss Prevention (DLP)
  {
    name: "Data Loss Prevention (DLP)",
    category: "data_protection",
    subcategory: "loss_prevention",
    description: "Implement comprehensive data loss prevention across all data vectors and endpoints",
    business_value: "Prevent 98% of data exfiltration attempts and achieve compliance with data protection regulations",
    technical_requirements: [
      "Data classification and labeling",
      "Content inspection and analysis",
      "Policy-based controls",
      "Encryption enforcement",
      "User activity monitoring"
    ],
    prerequisites: [
      "Data inventory and classification",
      "Policy framework definition",
      "User training program",
      "Integration planning"
    ],
    test_scenarios: [
      "Data classification accuracy",
      "Policy enforcement testing",
      "Exfiltration prevention",
      "Encryption verification",
      "User workflow impact"
    ],
    supported_vendors: ["Microsoft Purview", "Symantec DLP", "Forcepoint", "Digital Guardian", "Proofpoint"],
    portnox_features: [
      "Data access monitoring",
      "User behavior analytics",
      "Network-based DLP",
      "Risk scoring"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 18,
    dependencies: [
      "Data discovery tools",
      "Classification engine",
      "Encryption platform",
      "SIEM integration"
    ],
    compliance_frameworks: ["GDPR", "HIPAA", "PCI DSS", "SOX"],
    authentication_methods: [
      "User authentication",
      "Device verification",
      "Application controls",
      "Network-based enforcement"
    ],
    deployment_scenarios: [
      "Email and web first",
      "Endpoint deployment",
      "Network-based approach",
      "Cloud-native implementation"
    ],
    tags: ["DLP", "data_protection", "compliance", "encryption"],
    status: "active" as const
  },

  // Vendor Risk Management
  {
    name: "Third-Party Risk Management",
    category: "vendor_management",
    subcategory: "risk_assessment",
    description: "Implement automated third-party vendor risk assessment and ongoing monitoring",
    business_value: "Reduce vendor-related security incidents by 75% and streamline vendor onboarding",
    technical_requirements: [
      "Vendor risk scoring",
      "Continuous monitoring",
      "Assessment automation",
      "Integration with procurement",
      "Compliance tracking"
    ],
    prerequisites: [
      "Vendor inventory",
      "Risk framework",
      "Assessment questionnaires",
      "Monitoring procedures"
    ],
    test_scenarios: [
      "Risk scoring accuracy",
      "Monitoring effectiveness",
      "Integration testing",
      "Reporting validation",
      "Workflow automation"
    ],
    supported_vendors: ["SecurityScorecard", "BitSight", "RiskRecon", "UpGuard", "Panorays"],
    portnox_features: [
      "Vendor access monitoring",
      "Risk-based controls",
      "Activity tracking",
      "Compliance verification"
    ],
    complexity: "medium" as const,
    estimated_effort_weeks: 14,
    dependencies: [
      "Procurement system",
      "Vendor database",
      "Risk assessment platform",
      "Monitoring tools"
    ],
    compliance_frameworks: ["SOC2", "ISO27001", "NIST"],
    authentication_methods: [
      "Vendor portal access",
      "API authentication",
      "Document verification",
      "Digital signatures"
    ],
    deployment_scenarios: [
      "Critical vendors first",
      "Risk-based prioritization",
      "Procurement integration",
      "Full vendor portfolio"
    ],
    tags: ["vendor_management", "risk_assessment", "third_party", "compliance"],
    status: "active" as const
  },

  // Incident Response Automation
  {
    name: "Security Incident Response Automation",
    category: "incident_response",
    subcategory: "automation",
    description: "Deploy automated security incident response with SOAR integration and playbook execution",
    business_value: "Reduce incident response time by 90% and improve consistency of security operations",
    technical_requirements: [
      "Automated threat detection",
      "Incident classification",
      "Response orchestration",
      "Playbook automation",
      "Integration with security tools"
    ],
    prerequisites: [
      "SIEM/SOAR platform",
      "Incident response procedures",
      "Integration planning",
      "Team training"
    ],
    test_scenarios: [
      "Automated detection",
      "Classification accuracy",
      "Response orchestration",
      "Playbook execution",
      "Integration testing"
    ],
    supported_vendors: ["Phantom", "Demisto", "Swim", "IBM Resilient", "Microsoft Sentinel"],
    portnox_features: [
      "Automated containment",
      "Threat intelligence",
      "Behavioral analysis",
      "Response coordination"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 16,
    dependencies: [
      "SIEM platform",
      "Security tools",
      "Automation platform",
      "Runbook development"
    ],
    compliance_frameworks: ["NIST", "ISO27035", "SOC2"],
    authentication_methods: [
      "API authentication",
      "Service accounts",
      "Certificate-based",
      "Token-based"
    ],
    deployment_scenarios: [
      "Pilot use cases",
      "Phased automation",
      "Critical incidents first",
      "Full orchestration"
    ],
    tags: ["incident_response", "automation", "SOAR", "playbooks"],
    status: "active" as const
  },

  // IoT Security Management
  {
    name: "IoT Device Security Management",
    category: "iot_security",
    subcategory: "device_management",
    description: "Implement comprehensive IoT device security with discovery, profiling, and lifecycle management",
    business_value: "Secure 100% of IoT devices and reduce IoT-related security incidents by 95%",
    technical_requirements: [
      "IoT device discovery",
      "Device profiling and classification",
      "Security policy enforcement",
      "Vulnerability management",
      "Lifecycle tracking"
    ],
    prerequisites: [
      "Network infrastructure",
      "Device inventory",
      "Security policies",
      "Monitoring capabilities"
    ],
    test_scenarios: [
      "Device discovery accuracy",
      "Classification effectiveness",
      "Policy enforcement",
      "Vulnerability detection",
      "Lifecycle management"
    ],
    supported_vendors: ["Portnox", "Armis", "Claroty", "Nozomi", "Dragos"],
    portnox_features: [
      "Agentless IoT discovery",
      "Device fingerprinting",
      "Behavioral monitoring",
      "Automated segmentation"
    ],
    complexity: "high" as const,
    estimated_effort_weeks: 20,
    dependencies: [
      "Network access points",
      "Monitoring infrastructure",
      "Asset management",
      "Security tools"
    ],
    compliance_frameworks: ["NIST", "ISO27001", "IEC 62443"],
    authentication_methods: [
      "Certificate-based",
      "Pre-shared keys",
      "Device identity",
      "Network-based controls"
    ],
    deployment_scenarios: [
      "Critical infrastructure first",
      "Pilot deployment",
      "Phased by risk",
      "Complete IoT inventory"
    ],
    tags: ["IoT_security", "device_management", "OT_security", "industrial"],
    status: "active" as const
  }
];

export const comprehensiveVendors = [
  // Identity Providers
  {
    vendor_name: "Microsoft",
    category: "identity_provider",
    model: "Azure Active Directory",
    description: "Enterprise identity and access management platform",
    portnox_integration_level: "native",
    supported_protocols: ["SAML", "OIDC", "SCIM", "LDAP"],
    api_documentation: "https://docs.microsoft.com/en-us/azure/active-directory/",
    configuration_complexity: "medium",
    deployment_time_weeks: 4,
    licensing_model: "per_user",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP"],
    integration_notes: "Full SSO and device management integration available"
  },
  {
    vendor_name: "Okta",
    category: "identity_provider",
    model: "Workforce Identity",
    description: "Cloud-native identity and access management",
    portnox_integration_level: "certified",
    supported_protocols: ["SAML", "OIDC", "SCIM", "RADIUS"],
    api_documentation: "https://developer.okta.com/",
    configuration_complexity: "low",
    deployment_time_weeks: 3,
    licensing_model: "per_user",
    support_level: "premium",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP"],
    integration_notes: "Seamless integration with Portnox CLEAR"
  },

  // Network Equipment - Cisco
  {
    vendor_name: "Cisco",
    category: "network_switch",
    model: "Catalyst 9000 Series",
    description: "Enterprise campus switching with 802.1X support",
    portnox_integration_level: "native",
    supported_protocols: ["802.1X", "MAB", "RADIUS", "TACACS+"],
    api_documentation: "https://developer.cisco.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 2,
    licensing_model: "perpetual",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria", "FIPS 140-2"],
    integration_notes: "Full RADIUS and 802.1X integration with dynamic VLAN assignment"
  },
  {
    vendor_name: "Cisco",
    category: "wireless_controller",
    model: "Catalyst 9800 Series",
    description: "Enterprise wireless LAN controller",
    portnox_integration_level: "native",
    supported_protocols: ["802.1X", "PSK", "RADIUS", "CAPWAP"],
    api_documentation: "https://developer.cisco.com/",
    configuration_complexity: "high",
    deployment_time_weeks: 3,
    licensing_model: "subscription",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria", "FIPS 140-2"],
    integration_notes: "Advanced wireless security with Portnox integration"
  },

  // Network Equipment - Aruba
  {
    vendor_name: "Aruba",
    category: "network_switch",
    model: "CX 6000 Series",
    description: "Campus core and distribution switching",
    portnox_integration_level: "certified",
    supported_protocols: ["802.1X", "MAB", "RADIUS"],
    api_documentation: "https://developer.arubanetworks.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 2,
    licensing_model: "perpetual",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria"],
    integration_notes: "Dynamic segmentation with Portnox CLEAR"
  },
  {
    vendor_name: "Aruba",
    category: "wireless_controller",
    model: "Mobility Master",
    description: "Centralized wireless network management",
    portnox_integration_level: "certified",
    supported_protocols: ["802.1X", "PSK", "RADIUS"],
    api_documentation: "https://developer.arubanetworks.com/",
    configuration_complexity: "high",
    deployment_time_weeks: 4,
    licensing_model: "subscription",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria"],
    integration_notes: "Role-based access control with Portnox"
  },

  // MDM Solutions
  {
    vendor_name: "Microsoft",
    category: "mdm",
    model: "Intune",
    description: "Cloud-based mobile device management",
    portnox_integration_level: "certified",
    supported_protocols: ["SCEP", "Azure AD Join"],
    api_documentation: "https://docs.microsoft.com/en-us/mem/intune/",
    configuration_complexity: "medium",
    deployment_time_weeks: 6,
    licensing_model: "per_user",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "HIPAA"],
    integration_notes: "Device compliance integration with Portnox"
  },
  {
    vendor_name: "Jamf",
    category: "mdm",
    model: "Jamf Pro",
    description: "Apple device management platform",
    portnox_integration_level: "partner",
    supported_protocols: ["SCEP", "Apple Push Notification"],
    api_documentation: "https://developer.jamf.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 4,
    licensing_model: "per_device",
    support_level: "premium",
    compliance_certifications: ["SOC2", "ISO27001"],
    integration_notes: "macOS and iOS device compliance checking"
  },
  {
    vendor_name: "Kandji",
    category: "mdm",
    model: "Kandji Platform",
    description: "Modern Apple device management",
    portnox_integration_level: "partner",
    supported_protocols: ["SCEP", "Apple Business Manager"],
    api_documentation: "https://api.kandji.io/",
    configuration_complexity: "low",
    deployment_time_weeks: 3,
    licensing_model: "per_device",
    support_level: "premium",
    compliance_certifications: ["SOC2"],
    integration_notes: "Zero-touch Apple device deployment"
  },

  // SIEM Solutions
  {
    vendor_name: "Splunk",
    category: "siem",
    model: "Enterprise Security",
    description: "Security information and event management platform",
    portnox_integration_level: "certified",
    supported_protocols: ["REST API", "Syslog", "CEF"],
    api_documentation: "https://docs.splunk.com/",
    configuration_complexity: "high",
    deployment_time_weeks: 12,
    licensing_model: "data_volume",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP"],
    integration_notes: "Real-time network activity monitoring and correlation"
  },
  {
    vendor_name: "Microsoft",
    category: "siem",
    model: "Microsoft Sentinel",
    description: "Cloud-native SIEM and SOAR solution",
    portnox_integration_level: "certified",
    supported_protocols: ["REST API", "Azure Monitor"],
    api_documentation: "https://docs.microsoft.com/en-us/azure/sentinel/",
    configuration_complexity: "medium",
    deployment_time_weeks: 8,
    licensing_model: "data_ingestion",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP"],
    integration_notes: "Native Azure integration with Portnox data streams"
  },

  // Endpoint Detection & Response
  {
    vendor_name: "CrowdStrike",
    category: "edr",
    model: "Falcon",
    description: "Cloud-native endpoint protection platform",
    portnox_integration_level: "partner",
    supported_protocols: ["REST API", "GraphQL"],
    api_documentation: "https://falcon.crowdstrike.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 4,
    licensing_model: "per_endpoint",
    support_level: "premium",
    compliance_certifications: ["SOC2", "ISO27001"],
    integration_notes: "Device health status integration for access control"
  },
  {
    vendor_name: "SentinelOne",
    category: "edr",
    model: "Singularity",
    description: "AI-powered endpoint protection",
    portnox_integration_level: "partner",
    supported_protocols: ["REST API"],
    api_documentation: "https://usea1-partners.sentinelone.net/",
    configuration_complexity: "medium",
    deployment_time_weeks: 3,
    licensing_model: "per_endpoint",
    support_level: "premium",
    compliance_certifications: ["SOC2", "ISO27001"],
    integration_notes: "Threat detection and device posture assessment"
  },

  // Cloud Providers
  {
    vendor_name: "Amazon Web Services",
    category: "cloud_provider",
    model: "AWS",
    description: "Public cloud infrastructure and services",
    portnox_integration_level: "certified",
    supported_protocols: ["AWS APIs", "CloudFormation", "Terraform"],
    api_documentation: "https://docs.aws.amazon.com/",
    configuration_complexity: "high",
    deployment_time_weeks: 8,
    licensing_model: "consumption",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP", "HIPAA"],
    integration_notes: "VPC integration and cloud workload protection"
  },
  {
    vendor_name: "Microsoft",
    category: "cloud_provider",
    model: "Azure",
    description: "Microsoft cloud platform and services",
    portnox_integration_level: "native",
    supported_protocols: ["Azure ARM", "REST API", "Graph API"],
    api_documentation: "https://docs.microsoft.com/en-us/azure/",
    configuration_complexity: "medium",
    deployment_time_weeks: 6,
    licensing_model: "consumption",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001", "FedRAMP", "HIPAA"],
    integration_notes: "Native Azure AD and security center integration"
  },

  // Vulnerability Management
  {
    vendor_name: "Tenable",
    category: "vulnerability_scanner",
    model: "Nessus",
    description: "Comprehensive vulnerability assessment",
    portnox_integration_level: "partner",
    supported_protocols: ["REST API"],
    api_documentation: "https://developer.tenable.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 4,
    licensing_model: "per_asset",
    support_level: "enterprise",
    compliance_certifications: ["SOC2", "ISO27001"],
    integration_notes: "Device vulnerability status for access decisions"
  },

  // Next-Gen Firewalls
  {
    vendor_name: "Palo Alto Networks",
    category: "firewall",
    model: "PA-Series",
    description: "Next-generation firewall platform",
    portnox_integration_level: "certified",
    supported_protocols: ["User-ID", "REST API", "RADIUS"],
    api_documentation: "https://docs.paloaltonetworks.com/",
    configuration_complexity: "high",
    deployment_time_weeks: 6,
    licensing_model: "perpetual_subscription",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria", "FIPS 140-2"],
    integration_notes: "Dynamic user and device mapping integration"
  },
  {
    vendor_name: "Fortinet",
    category: "firewall",
    model: "FortiGate",
    description: "Security fabric platform",
    portnox_integration_level: "certified",
    supported_protocols: ["FSSO", "REST API", "RADIUS"],
    api_documentation: "https://docs.fortinet.com/",
    configuration_complexity: "medium",
    deployment_time_weeks: 4,
    licensing_model: "perpetual_subscription",
    support_level: "enterprise",
    compliance_certifications: ["Common Criteria", "FIPS 140-2"],
    integration_notes: "Security fabric integration with device intelligence"
  }
];

export const comprehensiveAuthenticationMethods = [
  // Certificate-Based Authentication
  {
    name: "X.509 Digital Certificates",
    method_type: "certificate",
    description: "PKI-based authentication using digital certificates for strong device and user identity",
    security_level: "high",
    configuration_complexity: "high",
    vendor_support: {
      "Microsoft": ["Active Directory Certificate Services", "Azure AD Certificate Authentication"],
      "Cisco": ["ISE Certificate Authentication", "Catalyst 9000 Series"],
      "Aruba": ["ClearPass Certificate Authentication", "CX Series Switches"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Automatic certificate enrollment", "Certificate lifecycle management", "Device identity verification"],
      "complexity": "medium"
    },
    documentation_links: [
      "https://docs.microsoft.com/en-us/azure/active-directory/authentication/",
      "https://www.cisco.com/c/en/us/support/docs/security-vpn/public-key-infrastructure-pki/"
    ],
    tags: ["PKI", "certificates", "device_identity", "enterprise"]
  },

  // Multi-Factor Authentication
  {
    name: "FIDO2/WebAuthn",
    method_type: "passwordless",
    description: "Modern passwordless authentication using FIDO2 standards with hardware security keys",
    security_level: "high",
    configuration_complexity: "medium",
    vendor_support: {
      "Microsoft": ["Azure AD FIDO2", "Windows Hello"],
      "Google": ["Google Workspace FIDO2", "Chrome WebAuthn"],
      "Yubico": ["YubiKey 5 Series", "Security Key Series"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Hardware key integration", "Biometric authentication", "Phishing-resistant authentication"],
      "complexity": "low"
    },
    documentation_links: [
      "https://fidoalliance.org/specifications/",
      "https://docs.microsoft.com/en-us/azure/active-directory/authentication/fido2-compatibility"
    ],
    tags: ["FIDO2", "passwordless", "hardware_keys", "phishing_resistant"]
  },

  // Biometric Authentication
  {
    name: "Biometric Authentication",
    method_type: "biometric",
    description: "Authentication using fingerprints, facial recognition, or iris scanning",
    security_level: "high",
    configuration_complexity: "medium",
    vendor_support: {
      "Microsoft": ["Windows Hello", "Azure AD Biometrics"],
      "Apple": ["Touch ID", "Face ID"],
      "Android": ["Fingerprint API", "BiometricPrompt"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Device biometric integration", "Liveness detection", "Template encryption"],
      "complexity": "medium"
    },
    documentation_links: [
      "https://docs.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/",
      "https://developer.android.com/guide/topics/ui/look-and-feel/biometric-authentication"
    ],
    tags: ["biometrics", "fingerprint", "facial_recognition", "device_authentication"]
  },

  // Legacy Authentication Methods
  {
    name: "RADIUS Authentication",
    method_type: "radius",
    description: "Traditional network authentication protocol for centralized AAA services",
    security_level: "medium",
    configuration_complexity: "medium",
    vendor_support: {
      "Cisco": ["ISE RADIUS", "ACS RADIUS"],
      "Microsoft": ["NPS RADIUS", "Azure AD RADIUS"],
      "FreeRADIUS": ["Open Source RADIUS Server"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Native RADIUS integration", "Dynamic VLAN assignment", "CoA support"],
      "complexity": "low"
    },
    documentation_links: [
      "https://tools.ietf.org/html/rfc2865",
      "https://docs.microsoft.com/en-us/windows-server/networking/technologies/nps/"
    ],
    tags: ["RADIUS", "802.1X", "network_authentication", "legacy"]
  },

  // Modern OAuth/OIDC
  {
    name: "OAuth 2.0 / OpenID Connect",
    method_type: "oauth",
    description: "Modern authentication and authorization framework for web and mobile applications",
    security_level: "high",
    configuration_complexity: "medium",
    vendor_support: {
      "Microsoft": ["Azure AD OAuth", "Microsoft Graph"],
      "Google": ["Google OAuth 2.0", "Google Workspace"],
      "Okta": ["Okta OAuth 2.0", "OpenID Connect"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Token-based authentication", "Scope-based authorization", "Refresh token support"],
      "complexity": "medium"
    },
    documentation_links: [
      "https://oauth.net/2/",
      "https://openid.net/connect/"
    ],
    tags: ["OAuth", "OIDC", "token_based", "web_authentication"]
  },

  // SAML Authentication
  {
    name: "SAML 2.0",
    method_type: "saml",
    description: "Security Assertion Markup Language for federated authentication",
    security_level: "high",
    configuration_complexity: "high",
    vendor_support: {
      "Microsoft": ["Azure AD SAML", "ADFS SAML"],
      "Okta": ["Okta SAML Apps", "SAML SSO"],
      "Ping Identity": ["PingFederate", "PingOne"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["SAML assertion processing", "Attribute mapping", "SSO integration"],
      "complexity": "high"
    },
    documentation_links: [
      "http://docs.oasis-open.org/security/saml/v2.0/",
      "https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol"
    ],
    tags: ["SAML", "federation", "SSO", "enterprise"]
  },

  // Smart Card Authentication
  {
    name: "Smart Card Authentication",
    method_type: "smart_card",
    description: "Hardware-based authentication using smart cards with embedded certificates",
    security_level: "high",
    configuration_complexity: "high",
    vendor_support: {
      "Microsoft": ["Windows Smart Card Authentication", "Azure AD Certificate Authentication"],
      "HID Global": ["PIV Cards", "CAC Cards"],
      "Gemalto": ["SafeNet Authentication Clients"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["PIV/CAC card support", "Certificate validation", "Hardware security module integration"],
      "complexity": "high"
    },
    documentation_links: [
      "https://csrc.nist.gov/projects/piv/piv-standards-and-supporting-documentation",
      "https://docs.microsoft.com/en-us/windows/security/identity-protection/smart-cards/"
    ],
    tags: ["smart_cards", "PIV", "CAC", "government", "high_security"]
  },

  // Mobile Authentication
  {
    name: "Mobile Push Authentication",
    method_type: "mobile_push",
    description: "Smartphone-based authentication using push notifications and mobile apps",
    security_level: "medium",
    configuration_complexity: "low",
    vendor_support: {
      "Microsoft": ["Microsoft Authenticator", "Azure AD Mobile App"],
      "Okta": ["Okta Verify", "Okta Mobile"],
      "Duo Security": ["Duo Mobile", "Duo Push"]
    },
    portnox_integration: {
      "supported": true,
      "features": ["Push notification integration", "Mobile app verification", "Device registration"],
      "complexity": "low"
    },
    documentation_links: [
      "https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-authentication-authenticator-app",
      "https://help.okta.com/en/prod/Content/Topics/Mobile/ov-mobile.htm"
    ],
    tags: ["mobile", "push_notifications", "smartphone", "convenience"]
  }
];

export const comprehensiveComplianceFrameworks = [
  // Government & Defense
  {
    name: "CMMC (Cybersecurity Maturity Model Certification)",
    category: "government",
    description: "DoD cybersecurity certification framework for defense contractors",
    industry_specific: ["defense", "government_contractors", "aerospace"],
    requirements: [
      "Access control implementation",
      "Asset management",
      "Audit and accountability",
      "Configuration management",
      "Identification and authentication",
      "Incident response",
      "Risk assessment"
    ],
    portnox_features: [
      "Device identification and authentication",
      "Access control enforcement",
      "Audit logging and monitoring",
      "Configuration compliance checking"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 12
  },
  {
    name: "FedRAMP (Federal Risk and Authorization Management Program)",
    category: "government",
    description: "Cloud security framework for federal government agencies",
    industry_specific: ["government", "federal_agencies", "cloud_providers"],
    requirements: [
      "Security control implementation",
      "Continuous monitoring",
      "Incident response procedures",
      "Risk management framework",
      "Supply chain risk management"
    ],
    portnox_features: [
      "Continuous monitoring capabilities",
      "Security control automation",
      "Audit trail generation",
      "Risk-based access controls"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 18
  },

  // Healthcare
  {
    name: "HIPAA (Health Insurance Portability and Accountability Act)",
    category: "healthcare",
    description: "Healthcare data protection and privacy regulations",
    industry_specific: ["healthcare", "medical_devices", "health_insurance"],
    requirements: [
      "Administrative safeguards",
      "Physical safeguards",
      "Technical safeguards",
      "Breach notification",
      "Business associate agreements"
    ],
    portnox_features: [
      "Access control and audit logging",
      "Device identification and classification",
      "Network segmentation for PHI protection",
      "User activity monitoring"
    ],
    implementation_complexity: "medium",
    typical_timeline_months: 8
  },
  {
    name: "HITECH (Health Information Technology for Economic and Clinical Health)",
    category: "healthcare",
    description: "Enhanced HIPAA enforcement and breach notification requirements",
    industry_specific: ["healthcare", "electronic_health_records"],
    requirements: [
      "Enhanced breach notification",
      "Audit controls strengthening",
      "Meaningful use requirements",
      "Business associate liability"
    ],
    portnox_features: [
      "Enhanced audit logging",
      "Real-time breach detection",
      "Access control monitoring",
      "Compliance reporting"
    ],
    implementation_complexity: "medium",
    typical_timeline_months: 6
  },

  // Financial Services
  {
    name: "SOX (Sarbanes-Oxley Act)",
    category: "financial",
    description: "Financial reporting and corporate governance requirements",
    industry_specific: ["public_companies", "financial_services", "accounting"],
    requirements: [
      "Internal controls over financial reporting",
      "Management assessment of controls",
      "Auditor attestation",
      "IT general controls",
      "Change management controls"
    ],
    portnox_features: [
      "Access control documentation",
      "Change tracking and audit trails",
      "Segregation of duties enforcement",
      "Automated compliance reporting"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 12
  },
  {
    name: "PCI DSS (Payment Card Industry Data Security Standard)",
    category: "payment",
    description: "Credit card data protection standards",
    industry_specific: ["retail", "e_commerce", "payment_processors", "hospitality"],
    requirements: [
      "Build and maintain secure networks",
      "Protect cardholder data",
      "Maintain vulnerability management program",
      "Implement strong access control measures",
      "Regularly monitor and test networks"
    ],
    portnox_features: [
      "Network segmentation for cardholder data",
      "Strong authentication enforcement",
      "Regular security testing integration",
      "Access monitoring and logging"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 9
  },

  // International Privacy
  {
    name: "GDPR (General Data Protection Regulation)",
    category: "privacy",
    description: "EU data protection and privacy regulation",
    industry_specific: ["all_industries_with_eu_presence"],
    requirements: [
      "Data protection by design and default",
      "Consent management",
      "Data subject rights",
      "Breach notification",
      "Data protection impact assessments"
    ],
    portnox_features: [
      "Data access monitoring and logging",
      "User consent tracking",
      "Data subject request automation",
      "Privacy-preserving access controls"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 12
  },
  {
    name: "CCPA (California Consumer Privacy Act)",
    category: "privacy",
    description: "California state privacy law for consumer data protection",
    industry_specific: ["california_businesses", "consumer_facing"],
    requirements: [
      "Consumer right to know",
      "Consumer right to delete",
      "Consumer right to opt-out",
      "Non-discrimination provisions"
    ],
    portnox_features: [
      "Data access tracking",
      "Consumer request processing",
      "Opt-out enforcement",
      "Data minimization controls"
    ],
    implementation_complexity: "medium",
    typical_timeline_months: 6
  },

  // Industry Standards
  {
    name: "ISO 27001",
    category: "security_management",
    description: "International standard for information security management systems",
    industry_specific: ["all_industries"],
    requirements: [
      "Information security management system",
      "Risk assessment and treatment",
      "Security control implementation",
      "Continuous improvement",
      "Management review and audit"
    ],
    portnox_features: [
      "Security control automation",
      "Risk assessment integration",
      "Continuous monitoring",
      "Audit trail generation"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 15
  },
  {
    name: "NIST Cybersecurity Framework",
    category: "cybersecurity",
    description: "Framework for improving critical infrastructure cybersecurity",
    industry_specific: ["critical_infrastructure", "manufacturing", "energy"],
    requirements: [
      "Identify assets and risks",
      "Protect critical functions",
      "Detect cybersecurity events",
      "Respond to incidents",
      "Recover from incidents"
    ],
    portnox_features: [
      "Asset identification and classification",
      "Protective controls implementation",
      "Real-time threat detection",
      "Incident response automation"
    ],
    implementation_complexity: "medium",
    typical_timeline_months: 10
  },

  // Cloud Security
  {
    name: "CSA CCM (Cloud Security Alliance Cloud Controls Matrix)",
    category: "cloud_security",
    description: "Security controls framework for cloud computing",
    industry_specific: ["cloud_providers", "cloud_users"],
    requirements: [
      "Cloud governance and risk management",
      "Data security and privacy",
      "Identity and access management",
      "Infrastructure security",
      "Application security"
    ],
    portnox_features: [
      "Cloud workload protection",
      "Identity and access management",
      "Data security controls",
      "Infrastructure monitoring"
    ],
    implementation_complexity: "medium",
    typical_timeline_months: 8
  },

  // Manufacturing & Industrial
  {
    name: "IEC 62443",
    category: "industrial_security",
    description: "Industrial automation and control systems security",
    industry_specific: ["manufacturing", "utilities", "oil_gas", "chemicals"],
    requirements: [
      "Security lifecycle management",
      "Risk assessment for IACS",
      "Security levels and zones",
      "Security policies and procedures"
    ],
    portnox_features: [
      "Industrial device identification",
      "OT network segmentation",
      "Asset lifecycle tracking",
      "Anomaly detection for industrial systems"
    ],
    implementation_complexity: "high",
    typical_timeline_months: 18
  }
];