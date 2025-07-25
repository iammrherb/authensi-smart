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

import { useVendors } from '@/hooks/useVendors';
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
      wired_switches: string[];
      wireless_aps: string[];
      firewalls: string[];
      routers: string[];
      vpn_solutions: string[];
      monitoring_tools: string[];
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
        wired_switches: [], wireless_aps: [], firewalls: [], routers: [],
        vpn_solutions: [], monitoring_tools: []
      },
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
    }
  });

  const { data: vendors = [] } = useVendors();
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
      id: 5, title: "AI Analysis & Recommendations", icon: Brain,
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

  const vendorsByCategory = {
    wired_switches: vendors.filter(v => v.category === "Switches" || v.vendor_type === "Network Switch"),
    wireless_aps: vendors.filter(v => v.category === "Wireless" || v.vendor_type === "Wireless AP"),
    firewalls: vendors.filter(v => v.category === "Security" || v.vendor_type === "Firewall"),
    routers: vendors.filter(v => v.category === "Routing" || v.vendor_type === "Router"),
    vpn_solutions: vendors.filter(v => v.category === "VPN" || v.vendor_type === "VPN"),
    monitoring_tools: vendors.filter(v => v.category === "Monitoring" || v.vendor_type === "Network Monitoring")
  };

  const authenticationMethods = [
    "802.1X with Certificates", "802.1X with Credentials", "MAC Authentication Bypass",
    "Web Authentication (Captive Portal)", "SAML/SSO Integration", "Multi-Factor Authentication",
    "Mobile Device Certificates", "Guest Self-Registration", "Sponsored Guest Access",
    "Certificate-Based Device Authentication", "Active Directory Integration",
    "LDAP Authentication", "RADIUS Authentication", "OAuth 2.0", "OpenID Connect"
  ];

  const identityProviders = [
    "Microsoft Active Directory", "Azure AD/Entra ID", "Okta", "Google Workspace",
    "Ping Identity", "ForgeRock", "OneLogin", "IBM Security Verify", "RSA SecurID",
    "CyberArk", "SailPoint", "Centrify", "LDAP", "Custom RADIUS"
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vendors">Network Vendors</TabsTrigger>
          <TabsTrigger value="devices">Device Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-4">
          {Object.entries(vendorsByCategory).map(([category, categoryVendors]) => (
            <div key={category}>
              <Label className="capitalize">{category.replace('_', ' ')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {categoryVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category}-${vendor.id}`}
                      checked={formData.network_infrastructure.existing_vendors[category as keyof typeof formData.network_infrastructure.existing_vendors].includes(vendor.vendor_name)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          const newVendors = { ...prev.network_infrastructure.existing_vendors };
                          const categoryKey = category as keyof typeof newVendors;
                          if (checked) {
                            newVendors[categoryKey] = [...newVendors[categoryKey], vendor.vendor_name];
                          } else {
                            newVendors[categoryKey] = newVendors[categoryKey].filter(v => v !== vendor.vendor_name);
                          }
                          return {
                            ...prev,
                            network_infrastructure: { ...prev.network_infrastructure, existing_vendors: newVendors }
                          };
                        });
                      }}
                    />
                    <Label htmlFor={`${category}-${vendor.id}`} className="text-sm">{vendor.vendor_name}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
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