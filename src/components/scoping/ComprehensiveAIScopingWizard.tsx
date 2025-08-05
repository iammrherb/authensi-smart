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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Server, Wifi, Lock, Smartphone, Database, FileCheck,
  Plus, X, ArrowRight, ArrowLeft, Zap, Settings, Monitor, Router,
  Cpu, HardDrive, Printer, Camera, Phone, Tablet, Laptop, FileText,
  Download, Save, Eye, Wand2, BookOpen, Filter
} from 'lucide-react';

import { useVendors } from '@/hooks/useVendors';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { usePainPoints, useCreatePainPoint } from '@/hooks/usePainPoints';
import { useRecommendations, useCreateRecommendation } from '@/hooks/useRecommendations';
import { 
  useIndustryOptions, 
  useComplianceFrameworks, 
  useDeploymentTypes, 
  useSecurityLevels,
  useBusinessDomains,
  useAuthenticationMethods,
  useNetworkSegments,
  useProjectPhases
} from '@/hooks/useResourceLibrary';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import EnhancedScopingActions from './EnhancedScopingActions';

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
    custom_pain_points: Array<{id: string; title: string; description: string; category: string; severity: string;}>;
    budget_range: string;
    timeline_preference: string;
  };
  
  // Network & Infrastructure
  network_infrastructure: {
    topology_type: "Flat" | "Segmented" | "Zero-Trust" | "Hybrid";
    site_count: number;
    network_complexity: "Simple" | "Moderate" | "Complex" | "Very Complex";
    existing_vendors: {
      wired_switches: string[];
      wireless_aps: string[];
      routers: string[];
      firewalls: string[];
      vpn_solutions: string[];
      edr_xdr: string[];
      siem_mdr: string[];
      monitoring_tools: string[];
      device_inventory_tools: string[];
    };
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
  
  // Integration & Compliance (moved before use cases)
  integration_compliance: {
    compliance_frameworks: string[];
    nac_requirements: {
      device_administration: string[];
      mfa_requirements: string[];
      sso_requirements: string[];
      dot1x_requirements: string[];
      access_control_requirements: string[];
      passwordless_auth_requirements: string[];
    };
    current_nac_vendor: string;
    current_radius_vendor: string;
    current_auth_methods: string[];
    pki_cert_authority: string;
    required_integrations: string[];
    audit_requirements: string[];
    reporting_needs: string[];
    performance_requirements: {
      max_auth_time: number;
      uptime_requirement: number;
      concurrent_users: number;
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
    ai_recommended_use_cases: string[];
    ai_recommended_requirements: string[];
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
      optimization_suggestions: string[];
      enhanced_recommendations: string[];
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
  // Resource library hooks
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceFrameworksData = [] } = useComplianceFrameworks();
  const { data: deploymentTypesData = [] } = useDeploymentTypes();
  const { data: securityLevelsData = [] } = useSecurityLevels();
  const { data: businessDomainsData = [] } = useBusinessDomains();
  const { data: authenticationMethodsData = [] } = useAuthenticationMethods();
  const { data: networkSegmentsData = [] } = useNetworkSegments();
  const { data: projectPhasesData = [] } = useProjectPhases();
  const { data: vendorsData = [] } = useVendors();
  const { data: useCasesData = [] } = useUseCases();
  const { data: requirementsData = [] } = useRequirements();
  const { data: painPointsData = [] } = usePainPoints();
  const { data: recommendationsData = [] } = useRecommendations();
  
  const createPainPoint = useCreatePainPoint();
  const createRecommendation = useCreateRecommendation();
  const { generateRecommendations, enhanceNotes, isLoading: aiLoading } = useAI();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [showPainPointDialog, setShowPainPointDialog] = useState(false);
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);
  const [newPainPoint, setNewPainPoint] = useState({ title: '', description: '', category: 'general', severity: 'medium' });
  const [newRecommendation, setNewRecommendation] = useState({ 
    title: '', description: '', category: 'implementation', priority: 'medium', 
    implementation_effort: 'medium', prerequisites: [], related_pain_points: [], 
    portnox_features: [], industry_specific: [] 
  });
  
  const [formData, setFormData] = useState<ComprehensiveScopingData>({
    organization: {
      name: '', industry: '', size: 'Mid-Market', locations: 1, total_users: 100,
      compliance_needs: [], existing_solutions: [], pain_points: [], custom_pain_points: [],
      budget_range: '', timeline_preference: ''
    },
    network_infrastructure: {
      topology_type: 'Segmented', site_count: 1, network_complexity: 'Moderate',
      existing_vendors: {
        wired_switches: [], wireless_aps: [], routers: [],
        firewalls: [], vpn_solutions: [], edr_xdr: [], siem_mdr: [],
        monitoring_tools: [], device_inventory_tools: []
      },
      device_inventory: {
        corporate_laptops: 0, desktop_workstations: 0, mobile_devices: 0, tablets: 0,
        iot_devices: 0, printers_mfps: 0, security_cameras: 0, voip_phones: 0,
        medical_devices: 0, industrial_controls: 0, pos_systems: 0, digital_signage: 0,
        custom_devices: []
      }
    },
    integration_compliance: {
      compliance_frameworks: [],
      nac_requirements: {
        device_administration: [],
        mfa_requirements: [],
        sso_requirements: [],
        dot1x_requirements: [],
        access_control_requirements: [],
        passwordless_auth_requirements: []
      },
      current_nac_vendor: '',
      current_radius_vendor: '',
      current_auth_methods: [],
      pki_cert_authority: '',
      required_integrations: [],
      audit_requirements: [],
      reporting_needs: [],
      performance_requirements: {
        max_auth_time: 30, uptime_requirement: 99.5, concurrent_users: 1000
      }
    },
    authentication_security: {
      current_auth_methods: [], desired_auth_methods: [], identity_providers: [],
      certificate_requirements: [], mfa_requirements: [], guest_access_needs: [],
      byod_requirements: []
    },
    use_cases_requirements: {
      selected_use_cases: [], custom_use_cases: [], selected_requirements: [],
      custom_requirements: [], success_criteria: [], testing_requirements: [],
      ai_recommended_use_cases: [], ai_recommended_requirements: []
    },
    templates_ai: {
      selected_templates: [],
      ai_recommendations: {
        deployment_approach: '', recommended_phases: [], estimated_timeline_weeks: 0,
        complexity_score: 0, risk_factors: [], recommended_vendors: [],
        recommended_use_cases: [], recommended_requirements: [], recommended_test_cases: [],
        project_roadmap: [], success_metrics: [], resource_estimates: {
          project_manager_weeks: 0, lead_engineer_weeks: 0, engineer_weeks: 0, testing_weeks: 0
        },
        optimization_suggestions: [], enhanced_recommendations: []
      }
    }
  });

  const { data: vendors = [] } = useVendors();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { data: enhancedVendors = [] } = useEnhancedVendors();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { toast } = useToast();

  const steps = [
    {
      id: 0, title: "Organization Profile", icon: Building2,
      description: "Company details, size, industry, and business context with pain points"
    },
    {
      id: 1, title: "Network Infrastructure", icon: Network,
      description: "Network topology, vendors, devices, and infrastructure details"
    },
    {
      id: 2, title: "Integration & Compliance", icon: FileCheck,
      description: "NAC/Device Admin, MFA, SSO, 802.1x, compliance frameworks, and current vendors"
    },
    {
      id: 3, title: "Authentication & Security", icon: Shield,
      description: "Authentication methods, identity providers, and security requirements"
    },
    {
      id: 4, title: "Use Cases & Requirements", icon: Target,
      description: "Business use cases, technical requirements, and success criteria with AI recommendations"
    },
    {
      id: 5, title: "AI Analysis & Recommendations", icon: Brain,
      description: "Intelligent analysis, recommendations, and comprehensive project planning"
    }
  ];

  // Comprehensive data collections
  const nacRequirementCategories = {
    device_administration: [
      "Device onboarding automation", "Device fingerprinting", "Device compliance checking",
      "Device profiling", "Device quarantine", "Device certificate management",
      "Device inventory tracking", "Device health monitoring", "Device policy enforcement"
    ],
    mfa_requirements: [
      "RADIUS MFA integration", "SMS/Voice MFA", "Push notification MFA",
      "Hardware token MFA", "Biometric MFA", "Certificate-based MFA",
      "FIDO2/WebAuthn", "Risk-based MFA", "Adaptive MFA"
    ],
    sso_requirements: [
      "SAML 2.0 SSO", "OAuth 2.0/OpenID Connect", "LDAP/AD integration",
      "Kerberos authentication", "NTLM authentication", "RADIUS proxy",
      "Azure AD integration", "Google Workspace SSO", "Okta integration"
    ],
    dot1x_requirements: [
      "EAP-TLS authentication", "EAP-TTLS/PAP", "EAP-PEAP/MSCHAPv2",
      "EAP-FAST", "Dynamic VLAN assignment", "802.1x supplicant configuration",
      "Certificate auto-enrollment", "Machine vs user authentication", "Guest portal integration"
    ],
    access_control_requirements: [
      "Role-based access control (RBAC)", "Attribute-based access control (ABAC)",
      "Time-based access policies", "Location-based access", "Device-based policies",
      "Network segmentation", "Micro-segmentation", "Zero Trust network access",
      "Policy enforcement points", "Dynamic policy assignment"
    ],
    passwordless_auth_requirements: [
      "FIDO2/WebAuthn support", "Windows Hello for Business", "Certificate-based auth",
      "Biometric authentication", "Smart card authentication", "Mobile push authentication",
      "QR code authentication", "Hardware security keys", "Platform authenticators"
    ]
  };

  // Enhanced vendor categories with comprehensive vendor options
  const vendorsByCategory = {
    nac_vendors: enhancedVendors.filter(v => v.category === 'NAC' || v.vendor_type === 'NAC').map(v => v.vendor_name),
    wired_switches: enhancedVendors.filter(v => v.category === 'Wired Switch' || v.vendor_type === 'Switch').map(v => v.vendor_name),
    wireless_aps: enhancedVendors.filter(v => v.category === 'Wireless' || v.vendor_type === 'Access Point').map(v => v.vendor_name),
    routers: enhancedVendors.filter(v => v.category === 'Router' || v.vendor_type === 'Router').map(v => v.vendor_name),
    firewalls: enhancedVendors.filter(v => v.category === 'Firewall' || v.vendor_type === 'Security').map(v => v.vendor_name),
    vpn_solutions: enhancedVendors.filter(v => v.category === 'VPN' || v.vendor_type === 'VPN').map(v => v.vendor_name),
    edr_xdr: enhancedVendors.filter(v => v.category === 'EDR' || v.category === 'XDR' || v.vendor_type === 'Security').map(v => v.vendor_name),
    siem_mdr: enhancedVendors.filter(v => v.category === 'SIEM' || v.category === 'MDR' || v.vendor_type === 'Security').map(v => v.vendor_name),
    mfa_solutions: enhancedVendors.filter(v => v.category === 'MFA' || v.vendor_type === 'Authentication').map(v => v.vendor_name),
    sso_solutions: enhancedVendors.filter(v => v.category === 'SSO' || v.vendor_type === 'Identity').map(v => v.vendor_name),
    identity_providers: enhancedVendors.filter(v => v.category === 'IDP' || v.vendor_type === 'Identity').map(v => v.vendor_name),
    radius_vendors: enhancedVendors.filter(v => v.category === 'RADIUS' || v.vendor_type === 'Authentication').map(v => v.vendor_name),
    pki_cert_authorities: enhancedVendors.filter(v => v.category === 'PKI' || v.vendor_type === 'Certificate').map(v => v.vendor_name),
    monitoring_tools: enhancedVendors.filter(v => v.category === 'Monitoring' || v.vendor_type === 'Management').map(v => v.vendor_name)
  };

  // Fallback default vendors if database is empty
  const defaultVendorsByCategory = {
    nac_vendors: ["Portnox", "Cisco ISE", "Aruba ClearPass", "ForeScout CounterACT", "Bradford Campus Manager", "Impulse SafeConnect", "Extreme Control", "Microsoft NPS", "Juniper Policy Enforcer", "PacketFence"],
    wired_switches: ["Cisco", "HPE/Aruba", "Juniper", "Extreme Networks", "Dell", "Netgear", "D-Link", "TP-Link", "Ubiquiti", "Huawei"],
    wireless_aps: ["Cisco", "HPE/Aruba", "Ruckus", "Meraki", "Ubiquiti", "Fortinet", "SonicWall", "Extreme Networks", "Mist", "Cambium"],
    routers: ["Cisco", "Juniper", "HPE/Aruba", "Fortinet", "SonicWall", "Mikrotik", "Ubiquiti", "Palo Alto", "Check Point", "pfSense"],
    firewalls: ["Palo Alto", "Fortinet", "Check Point", "SonicWall", "Cisco ASA", "pfSense", "WatchGuard", "Barracuda", "Sophos", "Juniper SRX"],
    vpn_solutions: ["Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "SonicWall NetExtender", "OpenVPN", "WireGuard", "Pulse Secure", "Check Point Mobile", "F5 BIG-IP Edge", "Microsoft DirectAccess"],
    edr_xdr: ["CrowdStrike Falcon", "SentinelOne", "Microsoft Defender", "Carbon Black", "Cylance", "Trend Micro", "Symantec", "McAfee", "FireEye", "Cortex XDR"],
    siem_mdr: ["Splunk", "IBM QRadar", "Microsoft Sentinel", "LogRhythm", "ArcSight", "AlienVault", "Rapid7", "SumoLogic", "Elastic SIEM", "Chronicle"],
    mfa_solutions: ["Microsoft Authenticator", "Okta Verify", "Duo Security", "RSA SecurID", "Google Authenticator", "Authy", "YubiKey", "Ping Identity", "Auth0", "OneLogin"],
    sso_solutions: ["Microsoft Azure AD", "Okta", "Ping Identity", "Auth0", "OneLogin", "Google Workspace", "AWS SSO", "JumpCloud", "SailPoint", "CyberArk"],
    identity_providers: ["Microsoft Azure AD", "Active Directory", "Okta", "Ping Identity", "Auth0", "OneLogin", "Google Workspace", "AWS Cognito", "JumpCloud", "LDAP"],
    radius_vendors: ["Microsoft NPS", "FreeRADIUS", "Cisco ISE", "Aruba ClearPass", "Steel-Belted RADIUS", "RSA Authentication Manager", "TekRADIUS", "Radiator", "Elektron", "WinRadius"],
    pki_cert_authorities: ["Microsoft ADCS", "DigiCert", "Entrust", "GlobalSign", "Verisign", "Comodo", "OpenSSL CA", "AWS Certificate Manager", "Azure Key Vault", "HashiCorp Vault"],
    monitoring_tools: ["SolarWinds", "PRTG", "Nagios", "Zabbix", "ManageEngine", "WhatsUp Gold", "Datadog", "New Relic", "Dynatrace", "AppDynamics"]
  };

  // Merge enhanced vendors with defaults
  Object.keys(defaultVendorsByCategory).forEach(category => {
    if (vendorsByCategory[category as keyof typeof vendorsByCategory].length === 0) {
      vendorsByCategory[category as keyof typeof vendorsByCategory] = defaultVendorsByCategory[category as keyof typeof defaultVendorsByCategory];
    }
  });

  const authenticationMethods = [
    // Traditional Methods
    "Username/Password", "LDAP/Active Directory", "Local Database",
    
    // Certificate-based
    "X.509 Certificates", "Smart Cards", "PIV/CAC Cards",
    
    // Multi-Factor Authentication
    "SMS/Voice OTP", "TOTP/HOTP", "Push Notifications", "Hardware Tokens",
    "Biometric Authentication", "Risk-based Authentication",
    
    // Modern/Passwordless
    "FIDO2/WebAuthn", "Windows Hello for Business", "Mobile Device Certificates",
    "QR Code Authentication", "Platform Authenticators",
    
    // SSO/Federation
    "SAML 2.0", "OAuth 2.0/OpenID Connect", "Kerberos", "NTLM",
    
    // Network Authentication
    "EAP-TLS", "EAP-TTLS", "EAP-PEAP", "EAP-FAST", "EAP-MD5",
    
    // Cloud Identity
    "Azure AD", "Google Workspace", "Okta", "Ping Identity", "Auth0"
  ];

  const industries = industryOptions.map(option => option.name);
  const complianceFrameworks = complianceFrameworksData.map(framework => framework.name);

  const calculateProgress = () => {
    const stepWeights = [15, 20, 25, 15, 20, 5]; // Different weights for each step
    let totalProgress = 0;
    
    stepWeights.forEach((weight, index) => {
      if (index < currentStep) {
        totalProgress += weight;
      } else if (index === currentStep) {
        // Calculate partial progress for current step
        totalProgress += weight * 0.5; // Assume 50% progress on current step
      }
    });
    
    return Math.min(totalProgress, 100);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateAIRecommendations = async () => {
    setAiAnalysisLoading(true);
    try {
      const recommendations = await generateRecommendations(
        formData,
        useCases,
        vendors
      );

      if (recommendations) {
        // Parse and structure AI recommendations
        const aiRecommendations = {
          deployment_approach: "Phased deployment with pilot testing",
          recommended_phases: ["Discovery & Planning", "Pilot Implementation", "Production Rollout", "Optimization"],
          estimated_timeline_weeks: Math.max(12, formData.network_infrastructure.site_count * 2),
          complexity_score: calculateComplexityScore(),
          risk_factors: identifyRiskFactors(),
          recommended_vendors: generateVendorRecommendations(),
          recommended_use_cases: getRelevantUseCases(),
          recommended_requirements: getRelevantRequirements(),
          recommended_test_cases: generateTestCases(),
          project_roadmap: generateProjectRoadmap(),
          success_metrics: generateSuccessMetrics(),
          resource_estimates: calculateResourceEstimates(),
          optimization_suggestions: [recommendations],
          enhanced_recommendations: await enhanceRecommendations()
        };

        setFormData(prev => ({
          ...prev,
          templates_ai: {
            ...prev.templates_ai,
            ai_recommendations: aiRecommendations
          }
        }));

        toast({
          title: "AI Analysis Complete",
          description: "Comprehensive recommendations have been generated based on your requirements."
        });
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const calculateComplexityScore = (): number => {
    let score = 0;
    
    // Organization size factor
    score += formData.organization.size === 'SMB' ? 1 : formData.organization.size === 'Mid-Market' ? 2 : 3;
    
    // Network complexity
    score += formData.network_infrastructure.network_complexity === 'Simple' ? 1 : 
             formData.network_infrastructure.network_complexity === 'Moderate' ? 2 :
             formData.network_infrastructure.network_complexity === 'Complex' ? 3 : 4;
    
    // Compliance requirements
    score += formData.integration_compliance.compliance_frameworks.length;
    
    // Site count factor
    score += Math.min(formData.network_infrastructure.site_count / 5, 3);
    
    return Math.min(score, 10);
  };

  const identifyRiskFactors = (): string[] => {
    const risks = [];
    
    if (formData.network_infrastructure.site_count > 10) {
      risks.push("Large number of sites increases deployment complexity");
    }
    
    if (formData.integration_compliance.compliance_frameworks.length > 2) {
      risks.push("Multiple compliance requirements may create conflicting policies");
    }
    
    if (formData.organization.total_users > 5000) {
      risks.push("High user count requires careful performance planning");
    }
    
    return risks;
  };

  const generateVendorRecommendations = () => {
    return [
      { vendor: "Portnox", role: "Primary NAC", justification: "Cloud-native NAC with comprehensive device visibility" },
      { vendor: formData.integration_compliance.current_radius_vendor || "Microsoft NPS", role: "RADIUS", justification: "Existing infrastructure integration" }
    ];
  };

  const getRelevantUseCases = (): string[] => {
    return useCases
      .filter(uc => 
        formData.organization.industry === '' || 
        uc.description?.toLowerCase().includes(formData.organization.industry.toLowerCase())
      )
      .slice(0, 5)
      .map(uc => uc.id);
  };

  const getRelevantRequirements = (): string[] => {
    return requirements
      .filter(req => 
        formData.integration_compliance.compliance_frameworks.some(cf =>
          req.description?.toLowerCase().includes(cf.toLowerCase())
        )
      )
      .slice(0, 5)
      .map(req => req.id);
  };

  const generateTestCases = (): string[] => {
    return [
      "802.1x authentication testing",
      "Device profiling validation",
      "Policy enforcement verification",
      "Guest access testing",
      "Compliance reporting validation"
    ];
  };

  const generateProjectRoadmap = () => {
    return [
      { phase: "Discovery & Assessment", duration: 2, deliverables: ["Network assessment", "Requirements validation", "Risk assessment"] },
      { phase: "Design & Planning", duration: 3, deliverables: ["Solution design", "Implementation plan", "Test plan"] },
      { phase: "Pilot Implementation", duration: 4, deliverables: ["Pilot deployment", "Testing", "Optimization"] },
      { phase: "Production Rollout", duration: 8, deliverables: ["Phased deployment", "Training", "Documentation"] }
    ];
  };

  const generateSuccessMetrics = (): string[] => {
    return [
      "99.5% authentication success rate",
      "< 3 second authentication time",
      "100% device visibility",
      "Zero security incidents",
      "Compliance audit success"
    ];
  };

  const calculateResourceEstimates = () => {
    const baseWeeks = formData.network_infrastructure.site_count * 0.5;
    return {
      project_manager_weeks: Math.max(baseWeeks, 8),
      lead_engineer_weeks: Math.max(baseWeeks * 1.5, 12),
      engineer_weeks: Math.max(baseWeeks * 2, 16),
      testing_weeks: Math.max(baseWeeks * 0.5, 4)
    };
  };

  const enhanceRecommendations = async (): Promise<string[]> => {
    try {
      const context = `Industry: ${formData.organization.industry}, Size: ${formData.organization.size}, Compliance: ${formData.integration_compliance.compliance_frameworks.join(', ')}`;
      const enhanced = await enhanceNotes(
        "Generate specific Portnox NAC implementation recommendations",
        context
      );
      return enhanced ? [enhanced] : [];
    } catch (error) {
      return [];
    }
  };

  const handleCreatePainPoint = async () => {
    if (!newPainPoint.title.trim()) return;
    
    try {
      await createPainPoint.mutateAsync({
        title: newPainPoint.title,
        description: newPainPoint.description,
        category: newPainPoint.category,
        severity: newPainPoint.severity as 'low' | 'medium' | 'high' | 'critical',
        recommended_solutions: [],
        industry_specific: [formData.organization.industry]
      });
      
      setShowPainPointDialog(false);
      setNewPainPoint({ title: '', description: '', category: 'general', severity: 'medium' });
    } catch (error) {
      console.error('Failed to create pain point:', error);
    }
  };

  const exportScopingReport = () => {
    const report = {
      title: `Comprehensive Scoping Report - ${formData.organization.name}`,
      generatedAt: new Date().toISOString(),
      data: formData,
      summary: generateReportSummary()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoping-report-${formData.organization.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportSummary = () => {
    return {
      organization: formData.organization.name,
      industry: formData.organization.industry,
      userCount: formData.organization.total_users,
      siteCount: formData.network_infrastructure.site_count,
      complexityScore: formData.templates_ai.ai_recommendations.complexity_score,
      estimatedTimeline: formData.templates_ai.ai_recommendations.estimated_timeline_weeks,
      selectedPainPoints: formData.organization.pain_points.length,
      complianceFrameworks: formData.integration_compliance.compliance_frameworks.length,
      recommendedUseCases: formData.templates_ai.ai_recommendations.recommended_use_cases.length
    };
  };

  const saveAndContinueToProject = async () => {
    try {
      const projectData = {
        name: formData.organization.name,
        description: `Comprehensive AI-scoped project with detailed requirements and recommendations`,
        client_name: formData.organization.name,
        industry: formData.organization.industry,
        deployment_type: 'comprehensive',
        security_level: 'enhanced',
        total_sites: formData.network_infrastructure.site_count,
        total_endpoints: formData.organization.total_users,
        compliance_frameworks: formData.integration_compliance.compliance_frameworks,
        pain_points: formData.organization.pain_points,
        success_criteria: formData.use_cases_requirements.success_criteria,
        status: 'planning' as const,
        current_phase: 'scoping' as const,
        progress_percentage: 25,
        business_summary: generateBusinessSummary()
      };

      if (projectId) {
        await updateProject.mutateAsync({ id: projectId, ...projectData });
      } else {
        const project = await createProject.mutateAsync(projectData);
        onComplete?.(project.id, formData);
      }

      toast({
        title: "Scoping Complete",
        description: "Project created with comprehensive scoping data."
      });
    } catch (error) {
      console.error('Project creation failed:', error);
      toast({
        title: "Project Creation Failed",
        description: "Unable to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateBusinessSummary = (): string => {
    return `Comprehensive Portnox NAC deployment for ${formData.organization.name} in the ${formData.organization.industry} industry. 
    
Project scope includes ${formData.network_infrastructure.site_count} sites with ${formData.organization.total_users} users.
Compliance requirements: ${formData.integration_compliance.compliance_frameworks.join(', ')}.
Key pain points addressed: ${formData.organization.pain_points.length} identified issues.
AI-recommended timeline: ${formData.templates_ai.ai_recommendations.estimated_timeline_weeks} weeks.
Complexity score: ${formData.templates_ai.ai_recommendations.complexity_score}/10.`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Organization Profile with Pain Points
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={formData.organization.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        organization: { ...prev.organization, name: e.target.value }
                      }))}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
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
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="org-size">Organization Size</Label>
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
                        <SelectItem value="SMB">SMB (&lt; 500 users)</SelectItem>
                        <SelectItem value="Mid-Market">Mid-Market (500-5000 users)</SelectItem>
                        <SelectItem value="Enterprise">Enterprise (&gt; 5000 users)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="locations">Number of Locations</Label>
                    <Input
                      id="locations"
                      type="number"
                      value={formData.organization.locations}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        organization: { ...prev.organization, locations: parseInt(e.target.value) || 1 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="total-users">Total Users</Label>
                    <Input
                      id="total-users"
                      type="number"
                      value={formData.organization.total_users}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        organization: { ...prev.organization, total_users: parseInt(e.target.value) || 100 }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pain Points Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pain Points & Challenges
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPainPointDialog(true)}
                    className="ml-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {painPointsData.map(painPoint => (
                    <div key={painPoint.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pain-${painPoint.id}`}
                        checked={formData.organization.pain_points.includes(painPoint.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              organization: {
                                ...prev.organization,
                                pain_points: [...prev.organization.pain_points, painPoint.id]
                              }
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              organization: {
                                ...prev.organization,
                                pain_points: prev.organization.pain_points.filter(p => p !== painPoint.id)
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`pain-${painPoint.id}`} className="text-sm">
                        {painPoint.title}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {painPoint.severity}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pain Point Creation Dialog */}
            <Dialog open={showPainPointDialog} onOpenChange={setShowPainPointDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Pain Point</DialogTitle>
                  <DialogDescription>
                    Create a custom pain point that will be saved to the resource library for future use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pain-title">Title</Label>
                    <Input
                      id="pain-title"
                      value={newPainPoint.title}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter pain point title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pain-description">Description</Label>
                    <Textarea
                      id="pain-description"
                      value={newPainPoint.description}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the pain point"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pain-category">Category</Label>
                      <Select
                        value={newPainPoint.category}
                        onValueChange={(value) => setNewPainPoint(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pain-severity">Severity</Label>
                      <Select
                        value={newPainPoint.severity}
                        onValueChange={(value) => setNewPainPoint(prev => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePainPoint} disabled={!newPainPoint.title.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Library
                    </Button>
                    <Button variant="outline" onClick={() => setShowPainPointDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 1: // Network Infrastructure
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="topology">Network Topology</Label>
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
                        <SelectItem value="Zero-Trust">Zero Trust</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="site-count">Number of Sites</Label>
                    <Input
                      id="site-count"
                      type="number"
                      value={formData.network_infrastructure.site_count}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        network_infrastructure: { ...prev.network_infrastructure, site_count: parseInt(e.target.value) || 1 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complexity">Network Complexity</Label>
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
                </div>

                {/* Vendor Selection Sections */}
                <Tabs defaultValue="network" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="network">Network Infrastructure</TabsTrigger>
                    <TabsTrigger value="security">Security Infrastructure</TabsTrigger>
                    <TabsTrigger value="devices">Device Inventory</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="network" className="space-y-4">
                    {/* Wired Switches */}
                    <div>
                      <Label>Wired Switch Vendors</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["Cisco", "Aruba (HPE)", "Juniper Networks", "Extreme Networks", "Dell EMC", "Huawei", "Meraki", "Ubiquiti"].map(vendor => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`switch-${vendor}`}
                              checked={formData.network_infrastructure.existing_vendors.wired_switches.includes(vendor)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        wired_switches: [...prev.network_infrastructure.existing_vendors.wired_switches, vendor]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        wired_switches: prev.network_infrastructure.existing_vendors.wired_switches.filter(v => v !== vendor)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`switch-${vendor}`} className="text-sm">{vendor}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Wireless APs */}
                    <div>
                      <Label>Wireless AP Vendors</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["Cisco Meraki", "Aruba (HPE)", "Ubiquiti", "Ruckus (CommScope)", "Extreme Networks", "Fortinet", "Mist (Juniper)", "Cambium Networks"].map(vendor => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ap-${vendor}`}
                              checked={formData.network_infrastructure.existing_vendors.wireless_aps.includes(vendor)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        wireless_aps: [...prev.network_infrastructure.existing_vendors.wireless_aps, vendor]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        wireless_aps: prev.network_infrastructure.existing_vendors.wireless_aps.filter(v => v !== vendor)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`ap-${vendor}`} className="text-sm">{vendor}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    {/* Firewalls */}
                    <div>
                      <Label>Firewall Vendors</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["Palo Alto Networks", "Fortinet", "Check Point", "Cisco ASA/FTD", "SonicWall", "Juniper SRX", "pfSense", "WatchGuard"].map(vendor => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`fw-${vendor}`}
                              checked={formData.network_infrastructure.existing_vendors.firewalls.includes(vendor)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        firewalls: [...prev.network_infrastructure.existing_vendors.firewalls, vendor]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        firewalls: prev.network_infrastructure.existing_vendors.firewalls.filter(v => v !== vendor)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`fw-${vendor}`} className="text-sm">{vendor}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EDR/XDR */}
                    <div>
                      <Label>EDR/XDR Solutions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["CrowdStrike Falcon", "Microsoft Defender", "SentinelOne", "Carbon Black", "Cortex XDR", "Trend Micro", "Symantec Endpoint", "McAfee MVISION"].map(vendor => (
                          <div key={vendor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edr-${vendor}`}
                              checked={formData.network_infrastructure.existing_vendors.edr_xdr.includes(vendor)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        edr_xdr: [...prev.network_infrastructure.existing_vendors.edr_xdr, vendor]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    network_infrastructure: {
                                      ...prev.network_infrastructure,
                                      existing_vendors: {
                                        ...prev.network_infrastructure.existing_vendors,
                                        edr_xdr: prev.network_infrastructure.existing_vendors.edr_xdr.filter(v => v !== vendor)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`edr-${vendor}`} className="text-sm">{vendor}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="devices" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(formData.network_infrastructure.device_inventory).map(([deviceType, count]) => {
                        if (deviceType === 'custom_devices') return null;
                        
                        const deviceIcons: Record<string, React.ComponentType<{className?: string}>> = {
                          corporate_laptops: Laptop,
                          desktop_workstations: Monitor,
                          mobile_devices: Smartphone,
                          tablets: Tablet,
                          iot_devices: Cpu,
                          printers_mfps: Printer,
                          security_cameras: Camera,
                          voip_phones: Phone,
                          medical_devices: HardDrive,
                          industrial_controls: Settings,
                          pos_systems: Database,
                          digital_signage: Monitor
                        };
                        
                        const IconComponent = deviceIcons[deviceType] || Monitor;
                        
                        return (
                          <div key={deviceType}>
                            <Label htmlFor={deviceType} className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {deviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                            <Input
                              id={deviceType}
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
                            />
                          </div>
                        );
                       })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );

      case 2: // Integration & Compliance (moved before use cases)
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Integration & Compliance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Compliance Frameworks */}
                <div>
                  <Label className="text-base font-medium">Compliance Frameworks</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {complianceFrameworks.map(framework => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={`compliance-${framework}`}
                          checked={formData.integration_compliance.compliance_frameworks.includes(framework)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                integration_compliance: {
                                  ...prev.integration_compliance,
                                  compliance_frameworks: [...prev.integration_compliance.compliance_frameworks, framework]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                integration_compliance: {
                                  ...prev.integration_compliance,
                                  compliance_frameworks: prev.integration_compliance.compliance_frameworks.filter(f => f !== framework)
                                }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`compliance-${framework}`} className="text-sm">{framework}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Current Vendors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="current-nac">Current NAC Vendor</Label>
                    <Select
                      value={formData.integration_compliance.current_nac_vendor}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        integration_compliance: { ...prev.integration_compliance, current_nac_vendor: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current NAC vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendorsByCategory.nac_vendors.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="current-radius">Current RADIUS Vendor</Label>
                    <Select
                      value={formData.integration_compliance.current_radius_vendor}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        integration_compliance: { ...prev.integration_compliance, current_radius_vendor: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current RADIUS vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendorsByCategory.radius_vendors.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pki-ca">PKI/Certificate Authority</Label>
                    <Select
                      value={formData.integration_compliance.pki_cert_authority}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        integration_compliance: { ...prev.integration_compliance, pki_cert_authority: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PKI/CA" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendorsByCategory.pki_cert_authorities.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* NAC Requirements */}
                <Tabs defaultValue="device-admin" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="device-admin">Device Admin</TabsTrigger>
                    <TabsTrigger value="authentication">Authentication</TabsTrigger>
                    <TabsTrigger value="access-control">Access Control</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="device-admin" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Device Administration Requirements</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.device_administration.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`device-admin-${req}`}
                              checked={formData.integration_compliance.nac_requirements.device_administration.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        device_administration: [...prev.integration_compliance.nac_requirements.device_administration, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        device_administration: prev.integration_compliance.nac_requirements.device_administration.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`device-admin-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">MFA Requirements</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.mfa_requirements.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mfa-${req}`}
                              checked={formData.integration_compliance.nac_requirements.mfa_requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        mfa_requirements: [...prev.integration_compliance.nac_requirements.mfa_requirements, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        mfa_requirements: prev.integration_compliance.nac_requirements.mfa_requirements.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`mfa-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="authentication" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">SSO Requirements</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.sso_requirements.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sso-${req}`}
                              checked={formData.integration_compliance.nac_requirements.sso_requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        sso_requirements: [...prev.integration_compliance.nac_requirements.sso_requirements, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        sso_requirements: prev.integration_compliance.nac_requirements.sso_requirements.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`sso-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">802.1x Requirements</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.dot1x_requirements.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dot1x-${req}`}
                              checked={formData.integration_compliance.nac_requirements.dot1x_requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        dot1x_requirements: [...prev.integration_compliance.nac_requirements.dot1x_requirements, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        dot1x_requirements: prev.integration_compliance.nac_requirements.dot1x_requirements.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`dot1x-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Passwordless Authentication</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.passwordless_auth_requirements.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`passwordless-${req}`}
                              checked={formData.integration_compliance.nac_requirements.passwordless_auth_requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        passwordless_auth_requirements: [...prev.integration_compliance.nac_requirements.passwordless_auth_requirements, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        passwordless_auth_requirements: prev.integration_compliance.nac_requirements.passwordless_auth_requirements.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`passwordless-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="access-control" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Access Control Requirements</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {nacRequirementCategories.access_control_requirements.map(req => (
                          <div key={req} className="flex items-center space-x-2">
                            <Checkbox
                              id={`access-${req}`}
                              checked={formData.integration_compliance.nac_requirements.access_control_requirements.includes(req)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        access_control_requirements: [...prev.integration_compliance.nac_requirements.access_control_requirements, req]
                                      }
                                    }
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    integration_compliance: {
                                      ...prev.integration_compliance,
                                      nac_requirements: {
                                        ...prev.integration_compliance.nac_requirements,
                                        access_control_requirements: prev.integration_compliance.nac_requirements.access_control_requirements.filter(r => r !== req)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`access-${req}`} className="text-sm">{req}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                {/* Current Authentication Methods */}
                <div>
                  <Label className="text-base font-medium">Current Authentication Methods</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {authenticationMethods.map(method => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={`auth-${method}`}
                          checked={formData.integration_compliance.current_auth_methods.includes(method)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                integration_compliance: {
                                  ...prev.integration_compliance,
                                  current_auth_methods: [...prev.integration_compliance.current_auth_methods, method]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                integration_compliance: {
                                  ...prev.integration_compliance,
                                  current_auth_methods: prev.integration_compliance.current_auth_methods.filter(m => m !== method)
                                }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`auth-${method}`} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // Authentication & Security
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Desired Authentication Methods</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {authenticationMethods.map(method => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desired-auth-${method}`}
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
                        <Label htmlFor={`desired-auth-${method}`} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Identity Providers</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {["Microsoft Azure AD/Entra ID", "Google Workspace", "Okta", "Auth0", "AWS IAM Identity Center", "OneLogin", "Ping Identity", "ForgeRock"].map(idp => (
                      <div key={idp} className="flex items-center space-x-2">
                        <Checkbox
                          id={`idp-${idp}`}
                          checked={formData.authentication_security.identity_providers.includes(idp)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                authentication_security: {
                                  ...prev.authentication_security,
                                  identity_providers: [...prev.authentication_security.identity_providers, idp]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                authentication_security: {
                                  ...prev.authentication_security,
                                  identity_providers: prev.authentication_security.identity_providers.filter(i => i !== idp)
                                }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`idp-${idp}`} className="text-sm">{idp}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4: // Use Cases & Requirements with AI recommendations
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Use Cases & Requirements
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateAIRecommendations}
                    disabled={aiAnalysisLoading}
                    className="ml-auto"
                  >
                    {aiAnalysisLoading ? (
                      <>
                        <Zap className="h-4 w-4 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-1" />
                        AI Recommendations
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Recommended Use Cases */}
                {formData.templates_ai.ai_recommendations.recommended_use_cases.length > 0 && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      AI has recommended {formData.templates_ai.ai_recommendations.recommended_use_cases.length} use cases based on your industry and requirements.
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="use-cases" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="success-criteria">Success Criteria</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="use-cases" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Available Use Cases</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
                        {useCasesData.map(useCase => (
                          <div key={useCase.id} className="flex items-center space-x-2 p-2 border rounded">
                            <Checkbox
                              id={`usecase-${useCase.id}`}
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
                                      selected_use_cases: prev.use_cases_requirements.selected_use_cases.filter(uc => uc !== useCase.id)
                                    }
                                  }));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`usecase-${useCase.id}`} className="font-medium">
                                {useCase.name}
                                {formData.templates_ai.ai_recommendations.recommended_use_cases.includes(useCase.id) && (
                                  <Badge variant="secondary" className="ml-2">AI Recommended</Badge>
                                )}
                              </Label>
                              {useCase.description && (
                                <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Available Requirements</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
                        {requirementsData.map(requirement => (
                          <div key={requirement.id} className="flex items-center space-x-2 p-2 border rounded">
                            <Checkbox
                              id={`req-${requirement.id}`}
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
                                      selected_requirements: prev.use_cases_requirements.selected_requirements.filter(r => r !== requirement.id)
                                    }
                                  }));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`req-${requirement.id}`} className="font-medium">
                                {requirement.title}
                                {formData.templates_ai.ai_recommendations.recommended_requirements.includes(requirement.id) && (
                                  <Badge variant="secondary" className="ml-2">AI Recommended</Badge>
                                )}
                              </Label>
                              {requirement.description && (
                                <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="success-criteria" className="space-y-4">
                    <div>
                      <Label htmlFor="success-criteria">Success Criteria</Label>
                      <Textarea
                        id="success-criteria"
                        placeholder="Define measurable success criteria for this project..."
                        value={formData.use_cases_requirements.success_criteria.join('\n')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          use_cases_requirements: {
                            ...prev.use_cases_requirements,
                            success_criteria: e.target.value.split('\n').filter(line => line.trim())
                          }
                        }))}
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );

      case 5: // AI Analysis & Recommendations
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis & Comprehensive Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={generateAIRecommendations}
                    disabled={aiAnalysisLoading}
                    className="flex-1"
                  >
                    {aiAnalysisLoading ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Generating AI Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={exportScopingReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                {formData.templates_ai.ai_recommendations.complexity_score > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formData.templates_ai.ai_recommendations.complexity_score}/10
                        </div>
                        <div className="text-sm text-muted-foreground">Complexity Score</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formData.templates_ai.ai_recommendations.estimated_timeline_weeks}
                        </div>
                        <div className="text-sm text-muted-foreground">Estimated Weeks</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formData.templates_ai.ai_recommendations.recommended_vendors.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Recommended Vendors</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formData.templates_ai.ai_recommendations.project_roadmap.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Project Phases</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {formData.templates_ai.ai_recommendations.recommended_vendors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Vendors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {formData.templates_ai.ai_recommendations.recommended_vendors.map((vendor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{vendor.vendor}</div>
                              <div className="text-sm text-muted-foreground">{vendor.role}</div>
                            </div>
                            <div className="text-sm text-muted-foreground max-w-md">
                              {vendor.justification}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {formData.templates_ai.ai_recommendations.project_roadmap.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.templates_ai.ai_recommendations.project_roadmap.map((phase, index) => (
                          <div key={index} className="border-l-4 border-primary pl-4">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{phase.phase}</div>
                              <Badge variant="outline">{phase.duration} weeks</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Deliverables: {phase.deliverables.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <EnhancedScopingActions 
                  formData={formData}
                  onProjectCreated={(projectId) => onComplete?.(projectId, formData)}
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Comprehensive AI <span className="bg-gradient-primary bg-clip-text text-transparent">Scoping Wizard</span>
        </h1>
        <p className="text-muted-foreground">
          Complete project scoping with AI recommendations, compliance requirements, and comprehensive planning
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-2 overflow-x-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer transition-colors ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`p-2 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary/10' : 
                    isCompleted ? 'border-green-600 bg-green-600/10' : 
                    'border-muted'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-center truncate max-w-20">
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    const scopingSession = {
                      id: Date.now().toString(),
                      name: `${formData.organization.name || 'Unnamed'} Scoping Session`,
                      date: new Date().toISOString(),
                      data: formData,
                      projectId: null
                    };
                    
                    const existingSessions = JSON.parse(localStorage.getItem('scopingSessions') || '[]');
                    existingSessions.push(scopingSession);
                    localStorage.setItem('scopingSessions', JSON.stringify(existingSessions));
                    
                    toast({
                      title: "Scoping Session Saved",
                      description: "Your scoping data has been saved locally.",
                    });
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Session
                  </Button>
                  <Button onClick={saveAndContinueToProject}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveAIScopingWizard;