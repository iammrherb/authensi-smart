import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Server, Wifi, Lock, Smartphone, Database, FileCheck,
  Plus, X, ArrowRight, ArrowLeft, Zap, Settings, Monitor, Router,
  Cpu, HardDrive, Printer, Camera, Phone, Tablet, Laptop
} from 'lucide-react';

import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';

interface ComprehensiveScopingData {
  // Organization Profile
  organization: {
    name: string;
    industry: string;
    size: "SMB" | "Mid-Market" | "Enterprise";
    locations: number;
    total_users: number;
    compliance_needs: string[];
    existing_solutions: string[];
    pain_points: string[];
    budget_range: string;
    timeline_preference: string;
  };
  
  // Network & Infrastructure
  network_infrastructure: {
    topology_type: "Flat" | "Segmented" | "Zero-Trust" | "Hybrid";
    site_count: number;
    network_complexity: "Simple" | "Moderate" | "Complex" | "Very Complex";
    existing_vendors: {
      // Network Infrastructure
      wired_switches: string[];
      wireless_aps: string[];
      routers: string[];
      
      // Security Infrastructure  
      firewalls: string[];
      vpn_solutions: string[];
      edr_xdr: string[];
      siem_mdr: string[];
      
      // Monitoring & Management
      monitoring_tools: string[];
      device_inventory_tools: string[];
    };
    
    // Site-specific inventory assignments
    site_inventory: Array<{
      site_name: string;
      site_location: string;
      vendors_assigned: {
        wired_switches: string[];
        wireless_aps: string[];
        firewalls: string[];
        routers: string[];
        vpn_solutions: string[];
        monitoring_tools: string[];
        device_inventory_tools: string[];
      };
      device_counts: {
        corporate_laptops: number;
        desktop_workstations: number;
        mobile_devices: number;
        tablets: number;
        iot_devices: number;
        printers_mfps: number;
        security_cameras: number;
        voip_phones: number;
        medical_devices: number;
        industrial_controls: number;
        pos_systems: number;
        digital_signage: number;
        custom_devices: Array<{name: string; count: number; description: string;}>;
      };
      priority: "Low" | "Medium" | "High" | "Critical";
      deployment_order: number;
      estimated_complexity: "Simple" | "Moderate" | "Complex" | "Very Complex";
      assigned_engineer: string;
      go_live_date: string;
      special_requirements: string[];
    }>;
    device_inventory: {
      corporate_laptops: number;
      desktop_workstations: number;
      mobile_devices: number;
      tablets: number;
      iot_devices: number;
      printers_mfps: number;
      security_cameras: number;
      voip_phones: number;
      medical_devices: number;
      industrial_controls: number;
      pos_systems: number;
      digital_signage: number;
      custom_devices: Array<{name: string; count: number; description: string;}>;
    };
  };
  
  // Authentication & Security
  authentication_security: {
    current_auth_methods: string[];
    desired_auth_methods: string[];
    identity_providers: string[];
    certificate_requirements: string[];
    mfa_requirements: string[];
    guest_access_needs: string[];
    byod_requirements: string[];
  };
  
  // Use Cases & Requirements
  use_cases_requirements: {
    selected_use_cases: string[];
    custom_use_cases: Array<{name: string; description: string; priority: string;}>;
    selected_requirements: string[];
    custom_requirements: Array<{title: string; description: string; priority: string;}>;
    success_criteria: string[];
    testing_requirements: string[];
  };
  
  // Integration & Compliance
  integration_compliance: {
    required_integrations: string[];
    compliance_frameworks: string[];
    audit_requirements: string[];
    reporting_needs: string[];
    performance_requirements: {
      max_auth_time: number;
      uptime_requirement: number;
      concurrent_users: number;
    };
  };
  
  // Templates & AI Recommendations
  templates_ai: {
    selected_templates: string[];
    ai_recommendations: {
      deployment_approach: string;
      recommended_phases: string[];
      estimated_timeline_weeks: number;
      complexity_score: number;
      risk_factors: string[];
      recommended_vendors: Array<{vendor: string; role: string; justification: string;}>;
      recommended_use_cases: string[];
      recommended_requirements: string[];
      recommended_test_cases: string[];
      project_roadmap: Array<{phase: string; duration: number; deliverables: string[];}>;
      success_metrics: string[];
      resource_estimates: {
        project_manager_weeks: number;
        lead_engineer_weeks: number;
        engineer_weeks: number;
        testing_weeks: number;
      };
    };
  };

  // Project Assignments & Team Structure
  project_assignments: {
    project_manager: string;
    technical_lead: string;
    lead_engineer: string;
    security_architect: string;
    network_engineer: string;
    test_engineer: string;
    implementation_team: Array<{name: string; role: string; skills: string[]; availability: string;}>;
    vendor_contacts: Array<{vendor: string; contact_name: string; contact_email: string; role: string;}>;
    client_stakeholders: Array<{name: string; role: string; department: string; involvement_level: string;}>;
    escalation_contacts: Array<{name: string; role: string; contact_info: string; escalation_type: string;}>;
  };

  // Comprehensive Project Planning
  comprehensive_planning: {
    deployment_phases: Array<{
      phase_name: string;
      duration_weeks: number;
      start_date: string;
      end_date: string;
      prerequisites: string[];
      deliverables: string[];
      success_criteria: string[];
      assigned_team: string[];
      risks: string[];
      mitigation_strategies: string[];
    }>;
    site_deployment_order: Array<{
      site_name: string;
      priority: number;
      complexity_level: string;
      estimated_duration: number;
      dependencies: string[];
      assigned_engineer: string;
    }>;
    testing_strategy: {
      test_phases: string[];
      test_environments: string[];
      acceptance_criteria: string[];
      testing_timeline: Array<{phase: string; duration: number; resources: string[];}>;
    };
    risk_management: {
      identified_risks: Array<{risk: string; impact: string; probability: string; mitigation: string; owner: string;}>;
      contingency_plans: Array<{scenario: string; response_plan: string; resources_needed: string[];}>;
    };
    quality_assurance: {
      review_checkpoints: string[];
      approval_gates: string[];
      documentation_requirements: string[];
      compliance_checkpoints: string[];
    };
  };
}

interface ComprehensiveAIScopingWizardProps {
  projectId?: string;
  onComplete?: (projectId: string, scopingData: ComprehensiveScopingData) => void;
  onCancel?: () => void;
}

const ComprehensiveAIScopingWizard: React.FC<ComprehensiveAIScopingWizardProps> = ({
  projectId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [formData, setFormData] = useState<ComprehensiveScopingData>({
    organization: {
      name: '', industry: '', size: 'Mid-Market', locations: 1, total_users: 100,
      compliance_needs: [], existing_solutions: [], pain_points: [], 
      budget_range: '', timeline_preference: ''
    },
    network_infrastructure: {
      topology_type: 'Segmented', site_count: 1, network_complexity: 'Moderate',
      existing_vendors: {
        wired_switches: [], wireless_aps: [], routers: [],
        firewalls: [], vpn_solutions: [], edr_xdr: [], siem_mdr: [],
        monitoring_tools: [], device_inventory_tools: []
      },
      site_inventory: [],
      device_inventory: {
        corporate_laptops: 0, desktop_workstations: 0, mobile_devices: 0, tablets: 0,
        iot_devices: 0, printers_mfps: 0, security_cameras: 0, voip_phones: 0,
        medical_devices: 0, industrial_controls: 0, pos_systems: 0, digital_signage: 0,
        custom_devices: []
      }
    },
    authentication_security: {
      current_auth_methods: [], desired_auth_methods: [], identity_providers: [],
      certificate_requirements: [], mfa_requirements: [], guest_access_needs: [],
      byod_requirements: []
    },
    use_cases_requirements: {
      selected_use_cases: [], custom_use_cases: [], selected_requirements: [],
      custom_requirements: [], success_criteria: [], testing_requirements: []
    },
    integration_compliance: {
      required_integrations: [], compliance_frameworks: [], audit_requirements: [],
      reporting_needs: [], performance_requirements: {
        max_auth_time: 30, uptime_requirement: 99.5, concurrent_users: 1000
      }
    },
    templates_ai: {
      selected_templates: [],
      ai_recommendations: {
        deployment_approach: '', recommended_phases: [], estimated_timeline_weeks: 0,
        complexity_score: 0, risk_factors: [], recommended_vendors: [],
        recommended_use_cases: [], recommended_requirements: [], recommended_test_cases: [],
        project_roadmap: [], success_metrics: [], resource_estimates: {
          project_manager_weeks: 0, lead_engineer_weeks: 0, engineer_weeks: 0, testing_weeks: 0
        }
      }
    },
    project_assignments: {
      project_manager: '', technical_lead: '', lead_engineer: '', security_architect: '',
      network_engineer: '', test_engineer: '', implementation_team: [], vendor_contacts: [],
      client_stakeholders: [], escalation_contacts: []
    },
    comprehensive_planning: {
      deployment_phases: [], site_deployment_order: [],
      testing_strategy: { test_phases: [], test_environments: [], acceptance_criteria: [], testing_timeline: [] },
      risk_management: { identified_risks: [], contingency_plans: [] },
      quality_assurance: { review_checkpoints: [], approval_gates: [], documentation_requirements: [], compliance_checkpoints: [] }
    }
  });

  const { data: vendors = [] } = useEnhancedVendors();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { toast } = useToast();

  const steps = [
    {
      id: 0, title: "Organization Profile", icon: Building2,
      description: "Company details, size, industry, and business context"
    },
    {
      id: 1, title: "Network Infrastructure", icon: Network,
      description: "Network topology, vendors, devices, and infrastructure details"
    },
    {
      id: 2, title: "Authentication & Security", icon: Shield,
      description: "Authentication methods, identity providers, and security requirements"
    },
    {
      id: 3, title: "Use Cases & Requirements", icon: Target,
      description: "Business use cases, technical requirements, and success criteria"
    },
    {
      id: 4, title: "Integration & Compliance", icon: FileCheck,
      description: "System integrations, compliance frameworks, and performance needs"
    },
    {
      id: 5, title: "Project Assignments", icon: Users,
      description: "Team assignments, stakeholders, and project roles"
    },
    {
      id: 6, title: "Comprehensive Planning", icon: Clock,
      description: "Deployment phases, testing strategy, and risk management"
    },
    {
      id: 7, title: "AI Analysis & Recommendations", icon: Brain,
      description: "Intelligent analysis, recommendations, and project planning"
    }
  ];

  // Data arrays for dropdowns
  const industries = [
    "Healthcare & Life Sciences", "Financial Services", "Government & Public Sector",
    "Education", "Manufacturing", "Retail & Hospitality", "Technology", 
    "Energy & Utilities", "Transportation", "Legal Services", "Other"
  ];

  const complianceFrameworks = [
    "HIPAA", "PCI-DSS", "SOX", "GDPR", "SOC 2", "ISO 27001",
    "NIST", "FedRAMP", "FISMA", "CMMC", "NERC CIP", "21 CFR Part 11"
  ];

  // Comprehensive Vendor Lists
  const networkVendors = {
    wired_switches: [
      "Cisco", "Aruba (HPE)", "Juniper Networks", "Extreme Networks", "Dell EMC",
      "Huawei", "D-Link", "Netgear", "TP-Link", "Ubiquiti", "Meraki", "Brocade",
      "Allied Telesis", "Alcatel-Lucent Enterprise", "Adtran", "ZyXEL", "3Com",
      "Foundry Networks", "Force10", "Nortel", "H3C", "Planet Technology"
    ],
    wireless_aps: [
      "Cisco Meraki", "Aruba (HPE)", "Ubiquiti", "Ruckus (CommScope)", "Extreme Networks",
      "Fortinet", "SonicWall", "Cambium Networks", "Motorola Solutions", "Ericsson",
      "Aerohive (Extreme)", "Mist (Juniper)", "Lancom", "EnGenius", "D-Link",
      "Netgear", "TP-Link", "Linksys", "Xirrus", "Symbol (Zebra)", "Proxim"
    ],
    routers: [
      "Cisco", "Juniper Networks", "Huawei", "Mikrotik", "Ubiquiti", "Fortinet",
      "SonicWall", "pfSense", "VyOS", "Arista", "Extreme Networks", "Dell EMC",
      "HPE", "Alcatel-Lucent", "ZyXEL", "Netgate", "Peplink", "Cradlepoint"
    ]
  };

  const securityVendors = {
    firewalls: [
      "Palo Alto Networks", "Fortinet", "Check Point", "Cisco ASA/FTD", "SonicWall",
      "Juniper SRX", "pfSense", "WatchGuard", "Barracuda", "Sophos", "Zscaler",
      "Forcepoint", "McAfee", "Untangle", "IPFire", "OPNsense", "Smoothwall",
      "Endian", "ClearOS", "Kerio Control", "Cyberoam", "Array Networks"
    ],
    vpn_solutions: [
      "Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "Pulse Secure",
      "OpenVPN", "WireGuard", "NordLayer", "Perimeter 81", "Zscaler Private Access",
      "Microsoft Always On VPN", "SonicWall NetExtender", "Check Point Endpoint",
      "F5 BIG-IP Edge", "Array SSL VPN", "Barracuda SSL VPN", "Kemp LoadMaster",
      "Citrix Gateway", "VMware Tunnel", "Tunnelbear for Business", "ExpressVPN for Business"
    ],
    edr_xdr: [
      "CrowdStrike Falcon", "Microsoft Defender for Endpoint", "SentinelOne", "Carbon Black",
      "Cortex XDR", "Trend Micro", "Symantec Endpoint", "McAfee MVISION", "Bitdefender GravityZone",
      "Kaspersky Endpoint", "ESET PROTECT", "Sophos Intercept X", "Malwarebytes Endpoint",
      "Cybereason", "FireEye Endpoint", "Cylance", "Tanium", "Qualys VMDR",
      "Rapid7 InsightIDR", "Elastic Security", "Chronicle Security", "Splunk Enterprise Security"
    ],
    siem_mdr: [
      "Splunk Enterprise Security", "IBM QRadar", "Microsoft Sentinel", "ArcSight (Micro Focus)",
      "LogRhythm", "Rapid7 InsightIDR", "Elastic Security", "Chronicle Security",
      "Securonix", "Exabeam", "Sumo Logic", "AlienVault (AT&T)", "McAfee ESM",
      "RSA NetWitness", "Fortinet FortiSIEM", "ManageEngine Log360", "SolarWinds Security Event Manager",
      "Graylog", "OSSIM", "Wazuh", "OSSEC", "ELK Stack", "Datadog Security Monitoring"
    ]
  };

  const identityProviders = [
    // Cloud Identity Providers
    "Microsoft Azure AD/Entra ID", "Google Workspace", "Okta", "Auth0", "AWS IAM Identity Center",
    "OneLogin", "Ping Identity", "ForgeRock", "IBM Security Verify", "Oracle Identity Cloud",
    "Duo Security", "RSA SecurID", "CyberArk Identity", "SailPoint IdentityNow",
    
    // On-Premises Identity
    "Microsoft Active Directory", "OpenLDAP", "Apache Directory Server", "389 Directory Server",
    "Novell eDirectory", "Oracle Internet Directory", "IBM Security Directory Server",
    "CA Directory", "Sun Java System Directory Server", "FreeIPA",
    
    // Federation & SSO
    "ADFS", "Shibboleth", "SimpleSAMLphp", "Keycloak", "WSO2 Identity Server",
    "MiniOrange", "JumpCloud", "Centrify", "BeyondTrust", "Thycotic Secret Server"
  ];

  const mfaProviders = [
    "Microsoft Authenticator", "Google Authenticator", "Okta Verify", "Duo Security",
    "RSA SecurID", "Symantec VIP", "Authy", "YubiKey", "FIDO2/WebAuthn",
    "Ping Identity", "ForgeRock", "CyberArk", "OneLogin", "Auth0 Guardian",
    "IBM Security Verify", "Cisco Duo", "Entrust", "HID Global", "Gemalto",
    "SMS/Voice OTP", "Hardware Tokens", "Smart Cards", "Biometric Authentication"
  ];

  const monitoringTools = [
    // Network Monitoring
    "SolarWinds NPM", "PRTG Network Monitor", "ManageEngine OpManager", "Nagios",
    "Zabbix", "LibreNMS", "Cacti", "Observium", "WhatsUp Gold", "Auvik",
    "Datadog", "New Relic", "AppDynamics", "Dynatrace", "ThousandEyes",
    
    // Infrastructure Monitoring
    "VMware vRealize", "Microsoft SCOM", "IBM Tivoli", "CA Spectrum",
    "HP OpenView", "BMC TrueSight", "Splunk Infrastructure Monitoring",
    "Elastic Observability", "Prometheus + Grafana", "InfluxDB + Telegraf",
    
    // Application Performance
    "AppDynamics", "New Relic", "Dynatrace", "Splunk APM", "Datadog APM",
    "Elastic APM", "Jaeger", "Zipkin", "OpenTelemetry", "Instana"
  ];

  const deviceInventoryTools = [
    // Asset Management
    "Microsoft SCCM", "Lansweeper", "ManageEngine AssetExplorer", "ServiceNow ITAM",
    "IBM Maximo", "Flexera", "Snow Software", "Device42", "Spiceworks", "PDQ Inventory",
    "OCS Inventory", "GLPI", "InvGate Assets", "Alloy Discovery", "Network Detective",
    
    // Mobile Device Management
    "Microsoft Intune", "VMware Workspace ONE", "Jamf Pro", "IBM MaaS360",
    "Citrix Endpoint Management", "BlackBerry UEM", "SOTI MobiControl", "42Gears SureMDM",
    "Hexnode", "ManageEngine Mobile Device Manager Plus", "Miradore", "Scalefusion",
    
    // Network Discovery
    "Nmap", "Advanced IP Scanner", "Angry IP Scanner", "Network Scanner", "Fing",
    "NetCrunch Tools", "SoftPerfect Network Scanner", "LanSweeper Network Discovery",
    "ManageEngine OpUtils", "SolarWinds Network Discovery", "Spiceworks Network Scanner"
  ];

  const authenticationMethods = [
    "802.1X with Certificates", "802.1X with Credentials", "MAC Authentication Bypass",
    "Web Authentication (Captive Portal)", "SAML/SSO Integration", "Multi-Factor Authentication",
    "Mobile Device Certificates", "Guest Self-Registration", "Sponsored Guest Access",
    "Certificate-Based Device Authentication", "Active Directory Integration",
    "LDAP Authentication", "RADIUS Authentication", "OAuth 2.0", "OpenID Connect"
  ];

  const integrationSystems = [
    "Microsoft Intune", "VMware Workspace ONE", "Jamf Pro", "ServiceNow",
    "Splunk", "QRadar", "Microsoft Sentinel", "CrowdStrike", "Carbon Black",
    "SentinelOne", "Palo Alto Prisma", "Check Point", "FortiGate", "Cisco ISE",
    "Aruba ClearPass", "Microsoft SCCM", "Tanium", "Rapid7", "Qualys"
  ];

  const generateComprehensiveAIRecommendations = async () => {
    setAiAnalysisLoading(true);
    
    // Simulate comprehensive AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const recommendations = {
      deployment_approach: determineDeploymentApproach(),
      recommended_phases: generateDetailedPhases(),
      estimated_timeline_weeks: calculateDetailedTimeline(),
      complexity_score: calculateComplexityScore(),
      risk_factors: identifyComprehensiveRisks(),
      recommended_vendors: generateVendorRecommendations(),
      recommended_use_cases: generateUseCaseRecommendations(),
      recommended_requirements: generateRequirementRecommendations(),
      recommended_test_cases: generateTestCaseRecommendations(),
      project_roadmap: generateProjectRoadmap(),
      success_metrics: generateSuccessMetrics(),
      resource_estimates: calculateResourceEstimates()
    };

    setFormData(prev => ({
      ...prev,
      templates_ai: { ...prev.templates_ai, ai_recommendations: recommendations }
    }));
    
    setAiAnalysisLoading(false);
  };

  const determineDeploymentApproach = (): string => {
    const { organization, network_infrastructure } = formData;
    
    if (organization.size === "Enterprise" && network_infrastructure.site_count > 10) {
      return "Phased Enterprise Rollout: Multi-site deployment with comprehensive pilot validation";
    } else if (organization.compliance_needs.length > 2) {
      return "Compliance-First Approach: Security-focused implementation with audit trail";
    } else if (network_infrastructure.topology_type === "Zero-Trust") {
      return "Zero Trust Implementation: Identity-centric micro-segmentation deployment";
    } else {
      return "Standard NAC Deployment: Traditional network access control with modern features";
    }
  };

  const generateDetailedPhases = (): string[] => {
    const phases = ["Discovery & Assessment", "Design & Architecture", "Pilot Implementation"];
    
    if (formData.organization.size === "Enterprise") {
      phases.push("Phased Site Rollout", "Production Deployment", "Optimization & Tuning");
    } else {
      phases.push("Full Implementation", "Testing & Validation");
    }
    
    phases.push("Go-Live & Knowledge Transfer", "Post-Implementation Support");
    return phases;
  };

  const calculateDetailedTimeline = (): number => {
    let weeks = 12; // Enhanced base timeline
    
    if (formData.organization.size === "Enterprise") weeks += 12;
    if (formData.network_infrastructure.site_count > 5) weeks += 6;
    if (formData.organization.compliance_needs.length > 2) weeks += 4;
    if (formData.network_infrastructure.network_complexity === "Complex") weeks += 4;
    if (formData.network_infrastructure.network_complexity === "Very Complex") weeks += 8;
    
    return weeks;
  };

  const calculateComplexityScore = (): number => {
    let score = 3;
    
    if (formData.organization.size === "Enterprise") score += 3;
    if (formData.network_infrastructure.topology_type === "Zero-Trust") score += 2;
    if (formData.network_infrastructure.network_complexity === "Complex") score += 2;
    if (formData.network_infrastructure.network_complexity === "Very Complex") score += 3;
    if (formData.organization.compliance_needs.length > 2) score += 2;
    
    return Math.min(score, 10);
  };

  const identifyComprehensiveRisks = (): string[] => {
    const risks = [];
    
    if (Object.values(formData.network_infrastructure.existing_vendors).flat().length > 8) {
      risks.push("Multi-vendor complexity requires extensive integration testing and validation");
    }
    
    if (formData.organization.compliance_needs.some(c => ["HIPAA", "PCI-DSS", "FISMA"].includes(c))) {
      risks.push("Strict compliance requirements demand comprehensive audit trails and validation");
    }
    
    if (formData.authentication_security.desired_auth_methods.includes("802.1X with Certificates")) {
      risks.push("Certificate-based authentication requires robust PKI infrastructure and expertise");
    }
    
    if (formData.network_infrastructure.device_inventory.iot_devices > 100) {
      risks.push("Large IoT deployment requires specialized device profiling and policy management");
    }
    
    return risks;
  };

  const generateVendorRecommendations = () => {
    return [
      { vendor: "Primary NAC Platform", role: "Core NAC Solution", justification: "Best fit for organizational requirements" },
      { vendor: "Network Infrastructure", role: "Integration Partner", justification: "Existing vendor compatibility" },
      { vendor: "Identity Provider", role: "Authentication Source", justification: "Current identity infrastructure" }
    ];
  };

  const generateUseCaseRecommendations = (): string[] => {
    const recommendations = [];
    
    if (formData.organization.compliance_needs.length > 0) {
      recommendations.push("Compliance Reporting & Audit Trail");
    }
    
    if (formData.network_infrastructure.device_inventory.mobile_devices > 50) {
      recommendations.push("BYOD Device Management");
    }
    
    if (formData.network_infrastructure.device_inventory.iot_devices > 0) {
      recommendations.push("IoT Device Discovery & Profiling");
    }
    
    return recommendations;
  };

  const generateRequirementRecommendations = (): string[] => {
    return [
      "Network Access Authentication",
      "Device Identity Management", 
      "Policy Enforcement",
      "Compliance Reporting"
    ];
  };

  const generateTestCaseRecommendations = (): string[] => {
    return [
      "End-to-End Authentication Testing",
      "Policy Enforcement Validation",
      "Vendor Integration Testing",
      "Performance & Load Testing"
    ];
  };

  const generateProjectRoadmap = () => {
    return [
      { phase: "Discovery", duration: 2, deliverables: ["Current State Assessment", "Requirements Document"] },
      { phase: "Design", duration: 3, deliverables: ["Architecture Design", "Implementation Plan"] },
      { phase: "Implementation", duration: 8, deliverables: ["Configured Solution", "Test Results"] },
      { phase: "Deployment", duration: 4, deliverables: ["Production Rollout", "Documentation"] }
    ];
  };

  const generateSuccessMetrics = (): string[] => {
    return [
      "Authentication Success Rate > 99%",
      "Average Authentication Time < 30 seconds", 
      "Policy Compliance Rate > 95%",
      "Incident Response Time < 15 minutes"
    ];
  };

  const calculateResourceEstimates = () => {
    const baseWeeks = formData.templates_ai.ai_recommendations.estimated_timeline_weeks || 12;
    return {
      project_manager_weeks: Math.round(baseWeeks * 0.8),
      lead_engineer_weeks: Math.round(baseWeeks * 1.2),
      engineer_weeks: Math.round(baseWeeks * 2.0),
      testing_weeks: Math.round(baseWeeks * 0.4)
    };
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      await generateComprehensiveAIRecommendations();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateProgress = () => {
    if (currentStep === steps.length - 1 && formData.templates_ai.ai_recommendations.deployment_approach) {
      return 100;
    }
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const handleCreateProject = async () => {
    try {
      if (projectId) {
        // Update existing project with scoping data
        const { organization, templates_ai } = formData;
        const { ai_recommendations } = templates_ai;
        
        const updateData = {
          id: projectId,
          industry: organization.industry,
          compliance_frameworks: organization.compliance_needs,
          deployment_type: organization.size.toLowerCase(),
          security_level: formData.network_infrastructure.topology_type.toLowerCase(),
          total_endpoints: Object.entries(formData.network_infrastructure.device_inventory)
            .filter(([key]) => key !== 'custom_devices')
            .reduce((total, [_, count]) => total + (count as number), 0),
          total_sites: formData.network_infrastructure.site_count,
          status: 'scoping' as const,
          current_phase: 'scoping' as const,
          progress_percentage: 25,
          success_criteria: formData.use_cases_requirements.success_criteria,
          pain_points: organization.pain_points,
          integration_requirements: formData.integration_compliance.required_integrations
        };

        await updateProject.mutateAsync(updateData);
        
        if (onComplete) {
          onComplete(projectId, formData);
        }
        
        toast({
          title: "Success!",
          description: "Project scoping completed successfully with AI recommendations",
        });
      } else {
        // Create new project
        const { organization, templates_ai } = formData;
        const { ai_recommendations } = templates_ai;
        
        const projectData = {
          name: `${organization.name} - Comprehensive NAC Implementation`,
          client_name: organization.name,
          description: `AI-powered comprehensive NAC deployment for ${organization.name} with ${ai_recommendations.deployment_approach}`,
          industry: organization.industry,
          compliance_frameworks: organization.compliance_needs,
          deployment_type: organization.size.toLowerCase(),
          security_level: formData.network_infrastructure.topology_type.toLowerCase(),
          total_sites: formData.network_infrastructure.site_count,
          total_endpoints: Object.entries(formData.network_infrastructure.device_inventory)
            .filter(([key]) => key !== 'custom_devices')
            .reduce((total, [_, count]) => total + (count as number), 0),
          status: 'scoping' as const,
          current_phase: 'scoping' as const,
          start_date: new Date().toISOString().split('T')[0],
          progress_percentage: 10,
          success_criteria: formData.use_cases_requirements.success_criteria,
          pain_points: organization.pain_points,
          integration_requirements: formData.integration_compliance.required_integrations
        };

        const project = await createProject.mutateAsync(projectData);
        
        if (project && onComplete) {
          onComplete(project.id, formData);
        }
        
        toast({
          title: "Success!",
          description: "Comprehensive project created successfully with AI recommendations",
        });
      }
    } catch (error) {
      console.error('Failed to create/update project:', error);
      toast({
        title: "Error",
        description: `Failed to ${projectId ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderOrganizationProfile();
      case 1:
        return renderNetworkInfrastructure();
      case 2:
        return renderAuthenticationSecurity();
      case 3:
        return renderUseCasesRequirements();
      case 4:
        return renderIntegrationCompliance();
      case 5:
        return renderProjectAssignments();
      case 6:
        return renderComprehensivePlanning();
      case 7:
        return renderAIAnalysisRecommendations();
      default:
        return null;
    }
  };

  const renderOrganizationProfile = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="org-name">Organization Name *</Label>
          <Input
            id="org-name"
            value={formData.organization.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              organization: { ...prev.organization, name: e.target.value }
            }))}
            placeholder="Your organization name"
          />
        </div>
        
        <div>
          <Label>Industry *</Label>
          <Select 
            value={formData.organization.industry} 
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              organization: { ...prev.organization, industry: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Organization Size *</Label>
          <Select 
            value={formData.organization.size} 
            onValueChange={(value: "SMB" | "Mid-Market" | "Enterprise") => setFormData(prev => ({
              ...prev,
              organization: { ...prev.organization, size: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SMB">SMB (50-500 users)</SelectItem>
              <SelectItem value="Mid-Market">Mid-Market (500-5000 users)</SelectItem>
              <SelectItem value="Enterprise">Enterprise (5000+ users)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Locations</Label>
          <Input
            type="number"
            value={formData.organization.locations}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              organization: { ...prev.organization, locations: parseInt(e.target.value) || 1 }
            }))}
            min="1"
          />
        </div>

        <div>
          <Label>Total Users</Label>
          <Input
            type="number"
            value={formData.organization.total_users}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              organization: { ...prev.organization, total_users: parseInt(e.target.value) || 100 }
            }))}
            min="1"
          />
        </div>
      </div>

      <div>
        <Label>Compliance Requirements</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {complianceFrameworks.map((framework) => (
            <div key={framework} className="flex items-center space-x-2">
              <Checkbox
                id={framework}
                checked={formData.organization.compliance_needs.includes(framework)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      organization: {
                        ...prev.organization,
                        compliance_needs: [...prev.organization.compliance_needs, framework]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      organization: {
                        ...prev.organization,
                        compliance_needs: prev.organization.compliance_needs.filter(f => f !== framework)
                      }
                    }));
                  }
                }}
              />
              <Label htmlFor={framework} className="text-sm">{framework}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Current Pain Points</Label>
        <Textarea
          placeholder="Describe your current network security challenges..."
          value={formData.organization.pain_points.join('\n')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            organization: { ...prev.organization, pain_points: e.target.value.split('\n').filter(p => p.trim()) }
          }))}
        />
      </div>
    </div>
  );

  const renderNetworkInfrastructure = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Network Topology *</Label>
          <Select 
            value={formData.network_infrastructure.topology_type} 
            onValueChange={(value: "Flat" | "Segmented" | "Zero-Trust" | "Hybrid") => setFormData(prev => ({
              ...prev,
              network_infrastructure: { ...prev.network_infrastructure, topology_type: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flat">Flat Network</SelectItem>
              <SelectItem value="Segmented">Segmented Network</SelectItem>
              <SelectItem value="Zero-Trust">Zero Trust Architecture</SelectItem>
              <SelectItem value="Hybrid">Hybrid Architecture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Network Complexity</Label>
          <Select 
            value={formData.network_infrastructure.network_complexity} 
            onValueChange={(value: "Simple" | "Moderate" | "Complex" | "Very Complex") => setFormData(prev => ({
              ...prev,
              network_infrastructure: { ...prev.network_infrastructure, network_complexity: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Simple">Simple</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Complex">Complex</SelectItem>
              <SelectItem value="Very Complex">Very Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sites for NAC Deployment</Label>
          <Input
            type="number"
            value={formData.network_infrastructure.site_count}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              network_infrastructure: { ...prev.network_infrastructure, site_count: parseInt(e.target.value) || 1 }
            }))}
            min="1"
          />
        </div>
      </div>

      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendors">Network Vendors</TabsTrigger>
          <TabsTrigger value="devices">Device Inventory</TabsTrigger>
          <TabsTrigger value="sites">Site Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-6">
          {/* Network Infrastructure Vendors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Infrastructure
            </h3>
            
            {Object.entries(networkVendors).map(([category, vendorList]) => (
              <div key={category} className="space-y-2">
                <Label className="text-base font-medium capitalize">{category.replace('_', ' ')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {vendorList.map((vendorName) => (
                    <div key={vendorName} className="flex items-center space-x-2">
                      <Checkbox
                        id={`network-${category}-${vendorName}`}
                        checked={formData.network_infrastructure.existing_vendors[category as keyof typeof formData.network_infrastructure.existing_vendors]?.includes(vendorName) || false}
                        onCheckedChange={(checked) => {
                          setFormData(prev => {
                            const newVendors = { ...prev.network_infrastructure.existing_vendors };
                            const categoryKey = category as keyof typeof newVendors;
                            if (checked) {
                              newVendors[categoryKey] = [...(newVendors[categoryKey] || []), vendorName];
                            } else {
                              newVendors[categoryKey] = (newVendors[categoryKey] || []).filter(v => v !== vendorName);
                            }
                            return {
                              ...prev,
                              network_infrastructure: { ...prev.network_infrastructure, existing_vendors: newVendors }
                            };
                          });
                        }}
                      />
                      <Label htmlFor={`network-${category}-${vendorName}`} className="text-sm">{vendorName}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Security Vendors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Infrastructure
            </h3>
            
            {Object.entries(securityVendors).map(([category, vendorList]) => (
              <div key={category} className="space-y-2">
                <Label className="text-base font-medium capitalize">{category.replace('_', ' ')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {vendorList.map((vendorName) => (
                    <div key={vendorName} className="flex items-center space-x-2">
                      <Checkbox
                        id={`security-${category}-${vendorName}`}
                        checked={formData.network_infrastructure.existing_vendors[category as keyof typeof formData.network_infrastructure.existing_vendors]?.includes(vendorName) || false}
                        onCheckedChange={(checked) => {
                          setFormData(prev => {
                            const newVendors = { ...prev.network_infrastructure.existing_vendors };
                            const categoryKey = category as keyof typeof newVendors;
                            if (checked) {
                              newVendors[categoryKey] = [...(newVendors[categoryKey] || []), vendorName];
                            } else {
                              newVendors[categoryKey] = (newVendors[categoryKey] || []).filter(v => v !== vendorName);
                            }
                            return {
                              ...prev,
                              network_infrastructure: { ...prev.network_infrastructure, existing_vendors: newVendors }
                            };
                          });
                        }}
                      />
                      <Label htmlFor={`security-${category}-${vendorName}`} className="text-sm">{vendorName}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Monitoring & Management Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Monitoring & Management
            </h3>
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Monitoring Tools</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {monitoringTools.map((vendorName) => (
                  <div key={vendorName} className="flex items-center space-x-2">
                    <Checkbox
                      id={`monitoring-${vendorName}`}
                      checked={formData.network_infrastructure.existing_vendors.monitoring_tools?.includes(vendorName) || false}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          const newVendors = { ...prev.network_infrastructure.existing_vendors };
                          if (checked) {
                            newVendors.monitoring_tools = [...(newVendors.monitoring_tools || []), vendorName];
                          } else {
                            newVendors.monitoring_tools = (newVendors.monitoring_tools || []).filter(v => v !== vendorName);
                          }
                          return {
                            ...prev,
                            network_infrastructure: { ...prev.network_infrastructure, existing_vendors: newVendors }
                          };
                        });
                      }}
                    />
                    <Label htmlFor={`monitoring-${vendorName}`} className="text-sm">{vendorName}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Device Inventory Tools</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {deviceInventoryTools.map((vendorName) => (
                  <div key={vendorName} className="flex items-center space-x-2">
                    <Checkbox
                      id={`inventory-${vendorName}`}
                      checked={formData.network_infrastructure.existing_vendors.monitoring_tools?.includes(vendorName) || false}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          const newVendors = { ...prev.network_infrastructure.existing_vendors };
                          if (checked) {
                            newVendors.monitoring_tools = [...(newVendors.monitoring_tools || []), vendorName];
                          } else {
                            newVendors.monitoring_tools = (newVendors.monitoring_tools || []).filter(v => v !== vendorName);
                          }
                          return {
                            ...prev,
                            network_infrastructure: { ...prev.network_infrastructure, existing_vendors: newVendors }
                          };
                        });
                      }}
                    />
                    <Label htmlFor={`inventory-${vendorName}`} className="text-sm">{vendorName}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(formData.network_infrastructure.device_inventory).filter(([key]) => key !== 'custom_devices').map(([deviceType, count]) => (
              <div key={deviceType}>
                <Label className="capitalize">{deviceType.replace('_', ' ')}</Label>
                <Input
                  type="number"
                  value={count as number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_infrastructure: {
                      ...prev.network_infrastructure,
                      device_inventory: {
                        ...prev.network_infrastructure.device_inventory,
                        [deviceType]: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  min="0"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Site-Specific Vendor & Inventory Assignments
            </h3>
            <Button
              onClick={() => {
                const newSite = {
                  site_name: `Site ${formData.network_infrastructure.site_inventory.length + 1}`,
                  site_location: '',
                  vendors_assigned: {
                    wired_switches: [],
                    wireless_aps: [],
                    firewalls: [],
                    routers: [],
                    vpn_solutions: [],
                    monitoring_tools: [],
                    device_inventory_tools: []
                  },
                  device_counts: {
                    corporate_laptops: 0,
                    desktop_workstations: 0,
                    mobile_devices: 0,
                    tablets: 0,
                    iot_devices: 0,
                    printers_mfps: 0,
                    security_cameras: 0,
                    voip_phones: 0,
                    medical_devices: 0,
                    industrial_controls: 0,
                    pos_systems: 0,
                    digital_signage: 0,
                    custom_devices: []
                  },
                  priority: "Medium" as const,
                  deployment_order: formData.network_infrastructure.site_inventory.length + 1,
                  estimated_complexity: "Moderate" as const,
                  assigned_engineer: '',
                  go_live_date: '',
                  special_requirements: []
                };
                setFormData(prev => ({
                  ...prev,
                  network_infrastructure: {
                    ...prev.network_infrastructure,
                    site_inventory: [...prev.network_infrastructure.site_inventory, newSite]
                  }
                }));
              }}
              className="mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>

          {formData.network_infrastructure.site_inventory.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No sites configured yet. Click "Add Site" to create site-specific vendor and inventory assignments.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {formData.network_infrastructure.site_inventory.map((site, siteIndex) => (
                <Card key={siteIndex} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <Label>Site Name</Label>
                        <Input
                          value={site.site_name}
                          onChange={(e) => {
                            const updatedSites = [...formData.network_infrastructure.site_inventory];
                            updatedSites[siteIndex].site_name = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              network_infrastructure: {
                                ...prev.network_infrastructure,
                                site_inventory: updatedSites
                              }
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={site.site_location}
                          onChange={(e) => {
                            const updatedSites = [...formData.network_infrastructure.site_inventory];
                            updatedSites[siteIndex].site_location = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              network_infrastructure: {
                                ...prev.network_infrastructure,
                                site_inventory: updatedSites
                              }
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const updatedSites = formData.network_infrastructure.site_inventory.filter((_, i) => i !== siteIndex);
                        setFormData(prev => ({
                          ...prev,
                          network_infrastructure: {
                            ...prev.network_infrastructure,
                            site_inventory: updatedSites
                          }
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Tabs defaultValue="site-vendors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="site-vendors">Assigned Vendors</TabsTrigger>
                      <TabsTrigger value="site-devices">Device Inventory</TabsTrigger>
                      <TabsTrigger value="site-details">Deployment Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="site-vendors" className="space-y-4">
                      {Object.entries(networkVendors).map(([category, vendorList]) => (
                        <div key={category} className="space-y-2">
                          <Label className="text-sm font-medium capitalize">{category.replace('_', ' ')}</Label>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {vendorList.map((vendorName) => (
                              <div key={vendorName} className="flex items-center space-x-1">
                                <Checkbox
                                  id={`site-${siteIndex}-${category}-${vendorName}`}
                                  checked={site.vendors_assigned[category as keyof typeof site.vendors_assigned]?.includes(vendorName) || false}
                                  onCheckedChange={(checked) => {
                                    const updatedSites = [...formData.network_infrastructure.site_inventory];
                                    const categoryKey = category as keyof typeof site.vendors_assigned;
                                    if (checked) {
                                      updatedSites[siteIndex].vendors_assigned[categoryKey] = [
                                        ...(updatedSites[siteIndex].vendors_assigned[categoryKey] || []),
                                        vendorName
                                      ];
                                    } else {
                                      updatedSites[siteIndex].vendors_assigned[categoryKey] = 
                                        (updatedSites[siteIndex].vendors_assigned[categoryKey] || []).filter(v => v !== vendorName);
                                    }
                                    setFormData(prev => ({
                                      ...prev,
                                      network_infrastructure: {
                                        ...prev.network_infrastructure,
                                        site_inventory: updatedSites
                                      }
                                    }));
                                  }}
                                />
                                <Label htmlFor={`site-${siteIndex}-${category}-${vendorName}`} className="text-xs">{vendorName}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="site-devices" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(site.device_counts).filter(([key]) => key !== 'custom_devices').map(([deviceType, count]) => (
                          <div key={deviceType}>
                            <Label className="text-sm capitalize">{deviceType.replace('_', ' ')}</Label>
                            <Input
                              type="number"
                              value={count as number}
                              onChange={(e) => {
                                const updatedSites = [...formData.network_infrastructure.site_inventory];
                                const deviceKey = deviceType as keyof typeof site.device_counts;
                                if (deviceKey !== 'custom_devices') {
                                  (updatedSites[siteIndex].device_counts as any)[deviceKey] = parseInt(e.target.value) || 0;
                                }
                                setFormData(prev => ({
                                  ...prev,
                                  network_infrastructure: {
                                    ...prev.network_infrastructure,
                                    site_inventory: updatedSites
                                  }
                                }));
                              }}
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="site-details" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Priority</Label>
                          <Select
                            value={site.priority}
                            onValueChange={(value: "Low" | "Medium" | "High" | "Critical") => {
                              const updatedSites = [...formData.network_infrastructure.site_inventory];
                              updatedSites[siteIndex].priority = value;
                              setFormData(prev => ({
                                ...prev,
                                network_infrastructure: {
                                  ...prev.network_infrastructure,
                                  site_inventory: updatedSites
                                }
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Deployment Order</Label>
                          <Input
                            type="number"
                            value={site.deployment_order}
                            onChange={(e) => {
                              const updatedSites = [...formData.network_infrastructure.site_inventory];
                              updatedSites[siteIndex].deployment_order = parseInt(e.target.value) || 1;
                              setFormData(prev => ({
                                ...prev,
                                network_infrastructure: {
                                  ...prev.network_infrastructure,
                                  site_inventory: updatedSites
                                }
                              }));
                            }}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Complexity</Label>
                          <Select
                            value={site.estimated_complexity}
                            onValueChange={(value: "Simple" | "Moderate" | "Complex" | "Very Complex") => {
                              const updatedSites = [...formData.network_infrastructure.site_inventory];
                              updatedSites[siteIndex].estimated_complexity = value;
                              setFormData(prev => ({
                                ...prev,
                                network_infrastructure: {
                                  ...prev.network_infrastructure,
                                  site_inventory: updatedSites
                                }
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Complex">Complex</SelectItem>
                              <SelectItem value="Very Complex">Very Complex</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Go Live Date</Label>
                          <Input
                            type="date"
                            value={site.go_live_date}
                            onChange={(e) => {
                              const updatedSites = [...formData.network_infrastructure.site_inventory];
                              updatedSites[siteIndex].go_live_date = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                network_infrastructure: {
                                  ...prev.network_infrastructure,
                                  site_inventory: updatedSites
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Assigned Engineer</Label>
                        <Input
                          value={site.assigned_engineer}
                          onChange={(e) => {
                            const updatedSites = [...formData.network_infrastructure.site_inventory];
                            updatedSites[siteIndex].assigned_engineer = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              network_infrastructure: {
                                ...prev.network_infrastructure,
                                site_inventory: updatedSites
                              }
                            }));
                          }}
                          placeholder="Engineer name or email"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAuthenticationSecurity = () => (
    <div className="space-y-6">
      <div>
        <Label>Current Authentication Methods</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {authenticationMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`current-${method}`}
                checked={formData.authentication_security.current_auth_methods.includes(method)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        current_auth_methods: [...prev.authentication_security.current_auth_methods, method]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        current_auth_methods: prev.authentication_security.current_auth_methods.filter(m => m !== method)
                      }
                    }));
                  }
                }}
              />
              <Label htmlFor={`current-${method}`} className="text-sm">{method}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Desired Authentication Methods</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {authenticationMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`desired-${method}`}
                checked={formData.authentication_security.desired_auth_methods.includes(method)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        desired_auth_methods: [...prev.authentication_security.desired_auth_methods, method]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        desired_auth_methods: prev.authentication_security.desired_auth_methods.filter(m => m !== method)
                      }
                    }));
                  }
                }}
              />
              <Label htmlFor={`desired-${method}`} className="text-sm">{method}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Identity Providers</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {identityProviders.map((provider) => (
            <div key={provider} className="flex items-center space-x-2">
              <Checkbox
                id={provider}
                checked={formData.authentication_security.identity_providers.includes(provider)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        identity_providers: [...prev.authentication_security.identity_providers, provider]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      authentication_security: {
                        ...prev.authentication_security,
                        identity_providers: prev.authentication_security.identity_providers.filter(p => p !== provider)
                      }
                    }));
                  }
                }}
              />
              <Label htmlFor={provider} className="text-sm">{provider}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUseCasesRequirements = () => (
    <div className="space-y-6">
      <Tabs defaultValue="use-cases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="use-cases" className="space-y-4">
          <div>
            <Label>Available Use Cases</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
              {useCases.map((useCase) => (
                <div key={useCase.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={useCase.id}
                    checked={formData.use_cases_requirements.selected_use_cases.includes(useCase.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          use_cases_requirements: {
                            ...prev.use_cases_requirements,
                            selected_use_cases: [...prev.use_cases_requirements.selected_use_cases, useCase.id]
                          }
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          use_cases_requirements: {
                            ...prev.use_cases_requirements,
                            selected_use_cases: prev.use_cases_requirements.selected_use_cases.filter(id => id !== useCase.id)
                          }
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={useCase.id} className="text-sm">
                    {useCase.name} 
                    <Badge variant="outline" className="ml-2">{useCase.complexity}</Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <div>
            <Label>Available Requirements</Label>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
              {requirements.map((requirement) => (
                <div key={requirement.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={requirement.id}
                    checked={formData.use_cases_requirements.selected_requirements.includes(requirement.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          use_cases_requirements: {
                            ...prev.use_cases_requirements,
                            selected_requirements: [...prev.use_cases_requirements.selected_requirements, requirement.id]
                          }
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          use_cases_requirements: {
                            ...prev.use_cases_requirements,
                            selected_requirements: prev.use_cases_requirements.selected_requirements.filter(id => id !== requirement.id)
                          }
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={requirement.id} className="text-sm">
                    {requirement.title}
                    <Badge variant="outline" className="ml-2">{requirement.priority}</Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Label>Success Criteria</Label>
        <Textarea
          placeholder="Define what success looks like for this project..."
          value={formData.use_cases_requirements.success_criteria.join('\n')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            use_cases_requirements: { 
              ...prev.use_cases_requirements, 
              success_criteria: e.target.value.split('\n').filter(c => c.trim()) 
            }
          }))}
        />
      </div>
    </div>
  );

  const renderProjectAssignments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Project Manager</Label>
          <Input
            placeholder="Enter project manager name"
            value={formData.project_assignments.project_manager}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, project_manager: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Technical Lead</Label>
          <Input
            placeholder="Enter technical lead name"
            value={formData.project_assignments.technical_lead}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, technical_lead: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Lead Engineer</Label>
          <Input
            placeholder="Enter lead engineer name"
            value={formData.project_assignments.lead_engineer}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, lead_engineer: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Security Architect</Label>
          <Input
            placeholder="Enter security architect name"
            value={formData.project_assignments.security_architect}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, security_architect: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Network Engineer</Label>
          <Input
            placeholder="Enter network engineer name"
            value={formData.project_assignments.network_engineer}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, network_engineer: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Test Engineer</Label>
          <Input
            placeholder="Enter test engineer name"
            value={formData.project_assignments.test_engineer}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              project_assignments: { ...prev.project_assignments, test_engineer: e.target.value }
            }))}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Implementation Team</Label>
        <p className="text-sm text-muted-foreground mb-3">Add team members who will be involved in the implementation</p>
        {formData.project_assignments.implementation_team.map((member, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 border rounded">
            <Input
              placeholder="Name"
              value={member.name}
              onChange={(e) => {
                const updated = [...formData.project_assignments.implementation_team];
                updated[index] = { ...member, name: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, implementation_team: updated }
                }));
              }}
            />
            <Input
              placeholder="Role"
              value={member.role}
              onChange={(e) => {
                const updated = [...formData.project_assignments.implementation_team];
                updated[index] = { ...member, role: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, implementation_team: updated }
                }));
              }}
            />
            <Input
              placeholder="Skills (comma separated)"
              value={member.skills.join(', ')}
              onChange={(e) => {
                const updated = [...formData.project_assignments.implementation_team];
                updated[index] = { ...member, skills: e.target.value.split(',').map(s => s.trim()) };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, implementation_team: updated }
                }));
              }}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Availability"
                value={member.availability}
                onChange={(e) => {
                  const updated = [...formData.project_assignments.implementation_team];
                  updated[index] = { ...member, availability: e.target.value };
                  setFormData(prev => ({
                    ...prev,
                    project_assignments: { ...prev.project_assignments, implementation_team: updated }
                  }));
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updated = formData.project_assignments.implementation_team.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    project_assignments: { ...prev.project_assignments, implementation_team: updated }
                  }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => setFormData(prev => ({
            ...prev,
            project_assignments: {
              ...prev.project_assignments,
              implementation_team: [...prev.project_assignments.implementation_team, { name: '', role: '', skills: [], availability: '' }]
            }
          }))}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Client Stakeholders</Label>
        <p className="text-sm text-muted-foreground mb-3">Add key client stakeholders and their involvement</p>
        {formData.project_assignments.client_stakeholders.map((stakeholder, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 border rounded">
            <Input
              placeholder="Name"
              value={stakeholder.name}
              onChange={(e) => {
                const updated = [...formData.project_assignments.client_stakeholders];
                updated[index] = { ...stakeholder, name: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, client_stakeholders: updated }
                }));
              }}
            />
            <Input
              placeholder="Role"
              value={stakeholder.role}
              onChange={(e) => {
                const updated = [...formData.project_assignments.client_stakeholders];
                updated[index] = { ...stakeholder, role: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, client_stakeholders: updated }
                }));
              }}
            />
            <Input
              placeholder="Department"
              value={stakeholder.department}
              onChange={(e) => {
                const updated = [...formData.project_assignments.client_stakeholders];
                updated[index] = { ...stakeholder, department: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  project_assignments: { ...prev.project_assignments, client_stakeholders: updated }
                }));
              }}
            />
            <div className="flex gap-2">
              <Select
                value={stakeholder.involvement_level}
                onValueChange={(value) => {
                  const updated = [...formData.project_assignments.client_stakeholders];
                  updated[index] = { ...stakeholder, involvement_level: value };
                  setFormData(prev => ({
                    ...prev,
                    project_assignments: { ...prev.project_assignments, client_stakeholders: updated }
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Involvement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updated = formData.project_assignments.client_stakeholders.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    project_assignments: { ...prev.project_assignments, client_stakeholders: updated }
                  }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => setFormData(prev => ({
            ...prev,
            project_assignments: {
              ...prev.project_assignments,
              client_stakeholders: [...prev.project_assignments.client_stakeholders, { name: '', role: '', department: '', involvement_level: '' }]
            }
          }))}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>
    </div>
  );

  const renderComprehensivePlanning = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Deployment Phases</Label>
        <p className="text-sm text-muted-foreground mb-3">Define the project phases with detailed planning</p>
        {formData.comprehensive_planning.deployment_phases.map((phase, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Phase Name</Label>
                <Input
                  placeholder="e.g., Discovery & Planning"
                  value={phase.phase_name}
                  onChange={(e) => {
                    const updated = [...formData.comprehensive_planning.deployment_phases];
                    updated[index] = { ...phase, phase_name: e.target.value };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                    }));
                  }}
                />
              </div>
              <div>
                <Label>Duration (weeks)</Label>
                <Input
                  type="number"
                  value={phase.duration_weeks}
                  onChange={(e) => {
                    const updated = [...formData.comprehensive_planning.deployment_phases];
                    updated[index] = { ...phase, duration_weeks: parseInt(e.target.value) || 0 };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                    }));
                  }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={phase.start_date}
                    onChange={(e) => {
                      const updated = [...formData.comprehensive_planning.deployment_phases];
                      updated[index] = { ...phase, start_date: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                      }));
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    const updated = formData.comprehensive_planning.deployment_phases.filter((_, i) => i !== index);
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                    }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prerequisites</Label>
                <Textarea
                  placeholder="Enter prerequisites (one per line)"
                  value={phase.prerequisites.join('\n')}
                  onChange={(e) => {
                    const updated = [...formData.comprehensive_planning.deployment_phases];
                    updated[index] = { ...phase, prerequisites: e.target.value.split('\n').filter(p => p.trim()) };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                    }));
                  }}
                />
              </div>
              <div>
                <Label>Deliverables</Label>
                <Textarea
                  placeholder="Enter deliverables (one per line)"
                  value={phase.deliverables.join('\n')}
                  onChange={(e) => {
                    const updated = [...formData.comprehensive_planning.deployment_phases];
                    updated[index] = { ...phase, deliverables: e.target.value.split('\n').filter(d => d.trim()) };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: { ...prev.comprehensive_planning, deployment_phases: updated }
                    }));
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => setFormData(prev => ({
            ...prev,
            comprehensive_planning: {
              ...prev.comprehensive_planning,
              deployment_phases: [...prev.comprehensive_planning.deployment_phases, {
                phase_name: '', duration_weeks: 0, start_date: '', end_date: '',
                prerequisites: [], deliverables: [], success_criteria: [], assigned_team: [],
                risks: [], mitigation_strategies: []
              }]
            }
          }))}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Phase
        </Button>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Risk Management</Label>
        <p className="text-sm text-muted-foreground mb-3">Identify and plan for project risks</p>
        {formData.comprehensive_planning.risk_management.identified_risks.map((risk, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Risk Description</Label>
                <Input
                  placeholder="Describe the risk"
                  value={risk.risk}
                  onChange={(e) => {
                    const updated = [...formData.comprehensive_planning.risk_management.identified_risks];
                    updated[index] = { ...risk, risk: e.target.value };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: {
                        ...prev.comprehensive_planning,
                        risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                      }
                    }));
                  }}
                />
              </div>
              <div>
                <Label>Impact</Label>
                <Select
                  value={risk.impact}
                  onValueChange={(value) => {
                    const updated = [...formData.comprehensive_planning.risk_management.identified_risks];
                    updated[index] = { ...risk, impact: value };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: {
                        ...prev.comprehensive_planning,
                        risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                      }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Probability</Label>
                <Select
                  value={risk.probability}
                  onValueChange={(value) => {
                    const updated = [...formData.comprehensive_planning.risk_management.identified_risks];
                    updated[index] = { ...risk, probability: value };
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: {
                        ...prev.comprehensive_planning,
                        risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                      }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Probability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Risk Owner</Label>
                  <Input
                    placeholder="Owner"
                    value={risk.owner}
                    onChange={(e) => {
                      const updated = [...formData.comprehensive_planning.risk_management.identified_risks];
                      updated[index] = { ...risk, owner: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        comprehensive_planning: {
                          ...prev.comprehensive_planning,
                          risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                        }
                      }));
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    const updated = formData.comprehensive_planning.risk_management.identified_risks.filter((_, i) => i !== index);
                    setFormData(prev => ({
                      ...prev,
                      comprehensive_planning: {
                        ...prev.comprehensive_planning,
                        risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                      }
                    }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Mitigation Strategy</Label>
              <Textarea
                placeholder="Describe how to mitigate this risk"
                value={risk.mitigation}
                onChange={(e) => {
                  const updated = [...formData.comprehensive_planning.risk_management.identified_risks];
                  updated[index] = { ...risk, mitigation: e.target.value };
                  setFormData(prev => ({
                    ...prev,
                    comprehensive_planning: {
                      ...prev.comprehensive_planning,
                      risk_management: { ...prev.comprehensive_planning.risk_management, identified_risks: updated }
                    }
                  }));
                }}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => setFormData(prev => ({
            ...prev,
            comprehensive_planning: {
              ...prev.comprehensive_planning,
              risk_management: {
                ...prev.comprehensive_planning.risk_management,
                identified_risks: [...prev.comprehensive_planning.risk_management.identified_risks, {
                  risk: '', impact: '', probability: '', mitigation: '', owner: ''
                }]
              }
            }
          }))}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Testing Strategy</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Test Phases</Label>
            <Textarea
              placeholder="Enter test phases (one per line)"
              value={formData.comprehensive_planning.testing_strategy.test_phases.join('\n')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                comprehensive_planning: {
                  ...prev.comprehensive_planning,
                  testing_strategy: {
                    ...prev.comprehensive_planning.testing_strategy,
                    test_phases: e.target.value.split('\n').filter(p => p.trim())
                  }
                }
              }))}
            />
          </div>
          <div>
            <Label>Test Environments</Label>
            <Textarea
              placeholder="Enter test environments (one per line)"
              value={formData.comprehensive_planning.testing_strategy.test_environments.join('\n')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                comprehensive_planning: {
                  ...prev.comprehensive_planning,
                  testing_strategy: {
                    ...prev.comprehensive_planning.testing_strategy,
                    test_environments: e.target.value.split('\n').filter(e => e.trim())
                  }
                }
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationCompliance = () => (
    <div className="space-y-6">
      <div>
        <Label>Required System Integrations</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {integrationSystems.map((system) => (
            <div key={system} className="flex items-center space-x-2">
              <Checkbox
                id={system}
                checked={formData.integration_compliance.required_integrations.includes(system)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({
                      ...prev,
                      integration_compliance: {
                        ...prev.integration_compliance,
                        required_integrations: [...prev.integration_compliance.required_integrations, system]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      integration_compliance: {
                        ...prev.integration_compliance,
                        required_integrations: prev.integration_compliance.required_integrations.filter(s => s !== system)
                      }
                    }));
                  }
                }}
              />
              <Label htmlFor={system} className="text-sm">{system}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Max Authentication Time (seconds)</Label>
          <Input
            type="number"
            value={formData.integration_compliance.performance_requirements.max_auth_time}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              integration_compliance: {
                ...prev.integration_compliance,
                performance_requirements: {
                  ...prev.integration_compliance.performance_requirements,
                  max_auth_time: parseInt(e.target.value) || 30
                }
              }
            }))}
            min="1"
          />
        </div>

        <div>
          <Label>Uptime Requirement (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.integration_compliance.performance_requirements.uptime_requirement}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              integration_compliance: {
                ...prev.integration_compliance,
                performance_requirements: {
                  ...prev.integration_compliance.performance_requirements,
                  uptime_requirement: parseFloat(e.target.value) || 99.5
                }
              }
            }))}
            min="90"
            max="100"
          />
        </div>

        <div>
          <Label>Concurrent Users</Label>
          <Input
            type="number"
            value={formData.integration_compliance.performance_requirements.concurrent_users}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              integration_compliance: {
                ...prev.integration_compliance,
                performance_requirements: {
                  ...prev.integration_compliance.performance_requirements,
                  concurrent_users: parseInt(e.target.value) || 1000
                }
              }
            }))}
            min="1"
          />
        </div>
      </div>
    </div>
  );

  const renderAIAnalysisRecommendations = () => {
    const { ai_recommendations } = formData.templates_ai;
    
    if (aiAnalysisLoading) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress</h3>
            <p className="text-muted-foreground">Analyzing your requirements and generating comprehensive recommendations...</p>
            <Progress value={66} className="mt-4" />
          </div>
        </div>
      );
    }

    if (!ai_recommendations.deployment_approach) {
      return (
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-orange-500" />
          <h3 className="text-xl font-semibold mb-2">AI Analysis Required</h3>
          <p className="text-muted-foreground">Click Next to generate AI recommendations based on your inputs.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            Comprehensive AI analysis complete! Review the recommendations below and proceed to create your project.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="approach" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="approach">Approach</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approach" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Deployment Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{ai_recommendations.deployment_approach}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommended Phases:</h4>
                  <div className="grid gap-2">
                    {ai_recommendations.recommended_phases.map((phase, index) => (
                      <Badge key={index} variant="secondary" className="justify-start">
                        {index + 1}. {phase}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <span>Estimated Duration:</span>
                    <Badge variant="outline">{ai_recommendations.estimated_timeline_weeks} weeks</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Complexity Score:</span>
                    <Badge variant="outline">{ai_recommendations.complexity_score}/10</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Project Roadmap:</h4>
                    {ai_recommendations.project_roadmap.map((phase, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{phase.phase}</span>
                        <span className="text-sm text-muted-foreground">{phase.duration} weeks</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Resource Estimates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>Project Manager:</span>
                    <span>{ai_recommendations.resource_estimates.project_manager_weeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Engineer:</span>
                    <span>{ai_recommendations.resource_estimates.lead_engineer_weeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engineers:</span>
                    <span>{ai_recommendations.resource_estimates.engineer_weeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Testing:</span>
                    <span>{ai_recommendations.resource_estimates.testing_weeks} weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ai_recommendations.risk_factors.map((risk, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{risk}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Comprehensive AI Scoping Wizard</h1>
            <p className="text-muted-foreground">
              Complete network access control project scoping with AI-powered recommendations
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <Progress value={calculateProgress()} className="h-2" />
        
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 text-center max-w-20">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "h-6 w-6" })}
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleCreateProject}
            disabled={!formData.templates_ai.ai_recommendations.deployment_approach || createProject.isPending || updateProject.isPending}
            className="bg-gradient-primary"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {(createProject.isPending || updateProject.isPending) ? 
              (projectId ? "Updating..." : "Creating...") : 
              (projectId ? "Complete Project Scoping" : "Create Comprehensive Project")
            }
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveAIScopingWizard;