// Enhanced demo data for the NAC deployment platform

export const demoProjects = [
  {
    id: "proj-001",
    name: "Global Bank NAC Rollout",
    client_name: "First National Bank",
    description: "Comprehensive NAC deployment across 12 banking locations with strict regulatory requirements for PCI-DSS and SOX regulations.",
    status: "implementing",
    current_phase: "phase-2-testing",
    progress_percentage: 65,
    start_date: "2023-10-01",
    target_completion: "2024-03-15",
    budget: 485000,
    created_by: "user-123",
    sites: [
      { id: "site-001", name: "HQ Data Center", location: "New York, NY" },
      { id: "site-002", name: "Trading Floor", location: "New York, NY" },
      { id: "site-003", name: "Branch Office - Manhattan", location: "New York, NY" },
      { id: "site-004", name: "Branch Office - Brooklyn", location: "Brooklyn, NY" }
    ]
  },
  {
    id: "proj-002", 
    name: "Healthcare Network Security",
    client_name: "Regional Medical Center",
    description: "HIPAA-compliant NAC implementation for medical devices, staff workstations, and IoT medical equipment across multiple facilities.",
    status: "scoping",
    current_phase: "discovery",
    progress_percentage: 25,
    start_date: "2024-01-15",
    target_completion: "2024-06-30",
    budget: 320000,
    created_by: "user-123",
    sites: [
      { id: "site-005", name: "Main Hospital", location: "Chicago, IL" },
      { id: "site-006", name: "Outpatient Clinic", location: "Chicago, IL" },
      { id: "site-007", name: "Emergency Care Center", location: "Evanston, IL" }
    ]
  },
  {
    id: "proj-003",
    name: "Manufacturing IoT Security",
    client_name: "Tech Industries Ltd",
    description: "Industrial IoT device security with NAC for production line automation, quality control systems, and operational technology networks.",
    status: "testing",
    current_phase: "user-acceptance-testing",
    progress_percentage: 85,
    start_date: "2023-08-01",
    target_completion: "2024-02-01",
    budget: 275000,
    created_by: "user-123",
    sites: [
      { id: "site-008", name: "Production Plant A", location: "Detroit, MI" },
      { id: "site-009", name: "Quality Lab", location: "Detroit, MI" },
      { id: "site-010", name: "Warehouse Facility", location: "Detroit, MI" }
    ]
  }
];

export const demoSites = [
  {
    id: "site-001",
    name: "HQ Data Center",
    location: "New York, NY",
    address: "123 Financial District, New York, NY 10004",
    contact_name: "John Smith",
    contact_email: "john.smith@firstnational.com",
    contact_phone: "+1 (555) 123-4567",
    site_type: "data_center",
    network_segments: 8,
    device_count: 2847,
    status: "implementing",
    priority: "critical",
    assigned_engineer: "eng-001",
    created_by: "user-123"
  },
  {
    id: "site-002",
    name: "Branch Office 12",
    location: "Chicago, IL", 
    address: "456 Michigan Ave, Chicago, IL 60611",
    contact_name: "Sarah Johnson",
    contact_email: "sarah.johnson@regionalmed.org",
    contact_phone: "+1 (555) 234-5678",
    site_type: "office",
    network_segments: 3,
    device_count: 150,
    status: "designing",
    priority: "medium",
    assigned_engineer: "eng-002",
    created_by: "user-123"
  },
  {
    id: "site-003",
    name: "Manufacturing Plant A",
    location: "Detroit, MI",
    address: "789 Industrial Blvd, Detroit, MI 48201",
    contact_name: "Mike Wilson",
    contact_email: "mike.wilson@techindustries.com", 
    contact_phone: "+1 (555) 345-6789",
    site_type: "manufacturing",
    network_segments: 12,
    device_count: 1250,
    status: "testing",
    priority: "high",
    assigned_engineer: "eng-003",
    created_by: "user-123"
  },
  {
    id: "site-004",
    name: "R&D Laboratory",
    location: "Austin, TX",
    address: "321 Innovation Way, Austin, TX 78701",
    contact_name: "Dr. Lisa Chen",
    contact_email: "lisa.chen@research.com",
    contact_phone: "+1 (555) 456-7890", 
    site_type: "laboratory",
    network_segments: 5,
    device_count: 420,
    status: "scoping",
    priority: "low",
    assigned_engineer: "eng-004",
    created_by: "user-123"
  }
];

export const demoVendors = [
  {
    id: "vendor-001",
    name: "Portnox",
    category: "Network Access Control",
    status: "certified",
    integration_level: "full",
    certifications: ["ISO 27001", "SOC 2 Type II", "FIPS 140-2"],
    supported_use_cases: [
      "Device Authentication",
      "BYOD Management", 
      "IoT Security",
      "Guest Access",
      "Compliance Reporting"
    ],
    contact_info: {
      primary_contact: "Alice Cooper",
      email: "alice.cooper@portnox.com",
      phone: "+1 (555) 100-1000"
    },
    documentation_links: [
      "https://docs.portnox.com/integration-guide",
      "https://docs.portnox.com/api-reference"
    ],
    pricing_model: "per_endpoint",
    deployment_complexity: "medium"
  },
  {
    id: "vendor-002", 
    name: "Cisco ISE",
    category: "Identity Services Engine",
    status: "certified",
    integration_level: "full",
    certifications: ["Common Criteria", "FIPS 140-2", "CC EAL4+"],
    supported_use_cases: [
      "Identity Management",
      "Policy Enforcement",
      "TrustSec Integration",
      "Guest Services",
      "Profiling"
    ],
    contact_info: {
      primary_contact: "Bob Martinez",
      email: "bob.martinez@cisco.com", 
      phone: "+1 (555) 200-2000"
    },
    documentation_links: [
      "https://cisco.com/ise-deployment-guide",
      "https://cisco.com/ise-api-docs"
    ],
    pricing_model: "tiered_licensing",
    deployment_complexity: "high"
  },
  {
    id: "vendor-003",
    name: "Aruba ClearPass",
    category: "Policy Management Platform", 
    status: "certified",
    integration_level: "full",
    certifications: ["ISO 27001", "SOC 2", "Common Criteria"],
    supported_use_cases: [
      "Role-based Access",
      "Device Onboarding",
      "Certificate Management", 
      "Guest Management",
      "BYOD Policies"
    ],
    contact_info: {
      primary_contact: "Carol Davis",
      email: "carol.davis@arubanetworks.com",
      phone: "+1 (555) 300-3000"
    },
    documentation_links: [
      "https://aruba.com/clearpass-integration",
      "https://aruba.com/clearpass-apis"
    ],
    pricing_model: "concurrent_users",
    deployment_complexity: "medium"
  }
];

export const demoRequirements = [
  {
    id: "req-001",
    title: "Device Authentication & Authorization",
    category: "Network Access Control",
    priority: "critical", 
    status: "active",
    description: "Comprehensive device identification and policy enforcement for all network endpoints including managed, unmanaged, and IoT devices.",
    acceptance_criteria: [
      "Support for 802.1X authentication",
      "MAC address-based authentication fallback",
      "Certificate-based device authentication",
      "Integration with Active Directory/LDAP",
      "Support for 10,000+ concurrent devices"
    ],
    test_cases: [
      {
        name: "Managed Device Authentication",
        description: "Verify corporate devices authenticate successfully via 802.1X",
        expected_result: "Device receives appropriate VLAN assignment and network access",
        priority: "high"
      },
      {
        name: "Unknown Device Quarantine", 
        description: "Verify unknown devices are quarantined to isolated network segment",
        expected_result: "Device placed in quarantine VLAN with limited access",
        priority: "high"
      }
    ],
    compliance_frameworks: ["PCI-DSS", "HIPAA", "SOX"],
    vendor_support: {
      "Portnox": "full",
      "Cisco ISE": "full",
      "Aruba ClearPass": "full"
    }
  },
  {
    id: "req-002",
    title: "BYOD Policy Enforcement",
    category: "Bring Your Own Device",
    priority: "high",
    status: "active", 
    description: "Secure onboarding and policy enforcement for personal devices accessing corporate network resources.",
    acceptance_criteria: [
      "Self-service device enrollment portal",
      "Certificate provisioning for personal devices", 
      "Application-level access control",
      "Device compliance checking",
      "Remote device management capabilities"
    ],
    test_cases: [
      {
        name: "Device Enrollment Process",
        description: "Verify users can self-enroll personal devices through web portal",
        expected_result: "Successful certificate installation and network access",
        priority: "high"
      },
      {
        name: "Non-compliant Device Blocking",
        description: "Verify devices not meeting security policies are blocked", 
        expected_result: "Access denied for non-compliant devices",
        priority: "medium"
      }
    ],
    compliance_frameworks: ["GDPR", "CCPA"],
    vendor_support: {
      "Portnox": "full",
      "Cisco ISE": "full", 
      "Aruba ClearPass": "full"
    }
  },
  {
    id: "req-003",
    title: "IoT Device Management",
    category: "Internet of Things",
    priority: "high",
    status: "active",
    description: "Automated discovery, classification, and security policy enforcement for IoT and operational technology devices.",
    acceptance_criteria: [
      "Automatic IoT device discovery and profiling",
      "Device behavior monitoring and anomaly detection",
      "Microsegmentation for IoT device communication",
      "Integration with IoT management platforms",
      "Support for common IoT protocols (MQTT, CoAP, etc.)"
    ],
    test_cases: [
      {
        name: "IoT Device Auto-Discovery",
        description: "Verify new IoT devices are automatically discovered and classified",
        expected_result: "Device properly identified and assigned to IoT network segment",
        priority: "high"
      },
      {
        name: "IoT Communication Restrictions",
        description: "Verify IoT devices can only communicate with authorized resources",
        expected_result: "Blocked communication attempts to unauthorized destinations",
        priority: "high"  
      }
    ],
    compliance_frameworks: ["NIST Cybersecurity Framework"],
    vendor_support: {
      "Portnox": "full",
      "Cisco ISE": "partial", 
      "Aruba ClearPass": "full"
    }
  }
];

export const demoUseCases = [
  {
    id: "uc-001",
    name: "Financial Services NAC Deployment",
    industry: "Financial Services",
    description: "Comprehensive NAC solution for multi-location bank with strict regulatory requirements.",
    business_value: "Ensure PCI-DSS compliance, protect customer data, reduce security incidents by 75%",
    technical_requirements: [
      "Support for 50,000+ endpoints across 25 locations",
      "Integration with existing Cisco network infrastructure", 
      "Real-time threat detection and response",
      "Comprehensive audit logging and reporting"
    ],
    success_metrics: [
      "100% device visibility across all network segments",
      "< 30 second device authentication time",
      "Zero security incidents related to unauthorized access",
      "95% reduction in help desk calls for network access issues"
    ],
    implementation_timeline: "16 weeks",
    estimated_cost: "$485,000",
    complexity_level: "High"
  },
  {
    id: "uc-002", 
    name: "Healthcare HIPAA Compliance",
    industry: "Healthcare",
    description: "HIPAA-compliant network access control for medical devices and staff systems.",
    business_value: "Achieve HIPAA compliance, secure PHI, improve operational efficiency",
    technical_requirements: [
      "Medical device integration and profiling",
      "Role-based access control for clinical staff",
      "Guest network isolation for patients/visitors", 
      "Integration with EMR systems"
    ],
    success_metrics: [
      "100% HIPAA audit compliance",
      "Zero PHI data breaches", 
      "50% faster device onboarding for clinical staff",
      "99.9% network uptime for critical medical devices"
    ],
    implementation_timeline: "12 weeks",
    estimated_cost: "$320,000", 
    complexity_level: "Medium"
  },
  {
    id: "uc-003",
    name: "Manufacturing OT Security",
    industry: "Manufacturing", 
    description: "Operational technology network security for industrial control systems and IoT devices.",
    business_value: "Protect production systems, prevent cyber attacks, ensure operational continuity",
    technical_requirements: [
      "Industrial protocol support (Modbus, DNP3, etc.)",
      "OT/IT network segmentation",
      "Real-time monitoring of industrial devices",
      "Integration with SCADA systems"
    ],
    success_metrics: [
      "Zero production downtime due to security incidents",
      "100% visibility into OT device communications", 
      "90% reduction in false positive security alerts",
      "Compliance with ICS-CERT guidelines"
    ],
    implementation_timeline: "20 weeks",
    estimated_cost: "$275,000",
    complexity_level: "High"
  }
];

export const demoQuestionnaires = [
  {
    id: "quest-001",
    site_id: "site-001",
    project_id: "proj-001",
    status: "completed",
    completion_percentage: 100,
    questionnaire_data: {
      deploymentType: "large-enterprise",
      useCases: [
        "Device Authentication & Authorization",
        "BYOD Policy Enforcement", 
        "Compliance Monitoring (PCI-DSS, HIPAA, SOX)",
        "Zero Trust Network Access"
      ],
      requirements: {
        endpoints: 2847,
        sites: 1,
        networkInfrastructure: "cisco",
        authenticationMethod: "802.1x-certificate", 
        compliance: "pci-dss",
        timeline: "16-weeks"
      },
      discoveryAnswers: {
        infrastructure: {
          "How many total endpoints need NAC coverage?": "2,847 endpoints including workstations, servers, and network devices",
          "What types of devices are in your environment?": "Windows/Mac workstations, iOS/Android mobile devices, printers, IP phones, security cameras",
          "What network infrastructure vendors are you using?": "Cisco (switches, routers, wireless), Palo Alto (firewalls)",
          "Do you have existing network segmentation?": "Yes, VLANs for different business units and security zones",
          "What authentication systems are currently in place?": "Active Directory with LDAP, some certificate-based auth for servers"
        },
        security: {
          "What compliance requirements must be met?": "PCI-DSS Level 1, SOX compliance for financial reporting systems",
          "What are your current security policies?": "Strong password policy, MFA for admin access, encryption at rest",
          "Do you have existing security tools to integrate?": "Splunk SIEM, CrowdStrike EDR, Qualys vulnerability scanner",
          "What are your incident response procedures?": "24/7 SOC with defined escalation procedures and forensic capabilities",
          "What visibility requirements do you have?": "Real-time device tracking, comprehensive audit logs, compliance reporting"
        },
        business: {
          "What is driving the NAC implementation?": "Regulatory compliance requirements and recent security audit findings",
          "What are your success criteria?": "100% device visibility, automated compliance reporting, reduced manual processes",
          "What is your timeline for deployment?": "16 weeks with phased rollout across locations",
          "What resources do you have available?": "Dedicated project team of 4 network engineers, 2 security analysts",
          "What is your change management process?": "Change advisory board approval, maintenance windows, rollback procedures"
        }
      },
      testCases: [
        {
          category: "Authentication",
          name: "802.1X Certificate Authentication",
          description: "Verify managed devices authenticate successfully using machine certificates",
          priority: "high",
          status: "passed",
          requirements: ["Active Directory integration", "Certificate authority", "802.1X supplicant"]
        },
        {
          category: "Policy Enforcement", 
          name: "VLAN Assignment Based on Device Type",
          description: "Verify devices are assigned to appropriate VLANs based on device profiling",
          priority: "high",
          status: "passed", 
          requirements: ["Device profiling database", "Dynamic VLAN assignment", "RADIUS integration"]
        },
        {
          category: "Compliance",
          name: "PCI-DSS Audit Trail Generation",
          description: "Verify all network access events are logged with required PCI-DSS fields",
          priority: "critical",
          status: "passed",
          requirements: ["Centralized logging", "Log retention policy", "Audit report generation"]
        }
      ],
      sizing: {
        estimatedEndpoints: 2847,
        requiredAppliances: 3,
        estimatedTimeline: "16 weeks",
        budget: 485000
      }
    },
    created_by: "user-123",
    completed_at: "2023-11-15T10:30:00Z"
  }
];

export const demoAnalytics = {
  deploymentStats: {
    totalProjects: 47,
    activeProjects: 12,
    completedProjects: 23,
    totalSites: 156,
    totalEndpoints: 45723,
    avgDeploymentTime: 8.5, // weeks
    successRate: 94.2, // percentage
    costEfficiency: 12 // percentage under budget
  },
  monthlyMetrics: {
    projectsStarted: [2, 3, 1, 4, 2, 3],
    projectsCompleted: [1, 2, 3, 2, 3, 1], 
    endpointsDeployed: [2847, 1205, 3421, 892, 1654, 2103],
    months: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]
  },
  criticalIssues: [
    {
      id: "issue-001",
      title: "Certificate Authority Integration Failure", 
      project: "Global Bank NAC Rollout",
      severity: "critical",
      status: "open",
      assignee: "eng-001",
      created: "2024-01-20T09:15:00Z"
    },
    {
      id: "issue-002",
      title: "IoT Device Profiling Accuracy Below Threshold",
      project: "Manufacturing IoT Security", 
      severity: "high",
      status: "in-progress",
      assignee: "eng-003",
      created: "2024-01-18T14:22:00Z"
    }
  ]
};