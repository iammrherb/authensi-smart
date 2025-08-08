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
import { 
  Building2, Network, Shield, Users, Target, Clock, 
  ChevronLeft, ChevronRight, Brain, CheckCircle, AlertTriangle,
  Globe, Server, Wifi, Lock, Smartphone, Database, FileCheck
} from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';
import { useIndustryOptions, useComplianceFrameworks, useAuthenticationMethods } from '@/hooks/useResourceLibrary';
import { useDeviceTypes } from '@/hooks/useDeviceTypes';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRefreshResources } from '@/hooks/useRefreshResources';
import { useToast } from '@/hooks/use-toast';

interface ScopingData {
  // Organization Section
  organization: {
    name: string;
    industry: string;
    size: "SMB" | "Mid-Market" | "Enterprise";
    locations: number;
    total_users: number;
    compliance_needs: string[];
  };
  
  // Network Discovery Section
  network_discovery: {
    topology_type: "Flat" | "Segmented" | "Zero-Trust";
    site_count: number;
    endpoint_types: string[];
    device_counts: Record<string, number>;
    network_vendors: string[];
  };
  
  // Use Cases Section
  use_cases: {
    primary_goals: string[];
    authentication_methods: string[];
    integration_needs: string[];
    timeline: string;
    success_criteria: string[];
  };
  
  // AI Recommendations (populated by AI analysis)
  ai_recommendations?: {
    deployment_approach: string;
    recommended_phases: string[];
    estimated_timeline: number;
    complexity_score: number;
    risk_factors: string[];
  };
}

interface IntelligentScopingWizardProps {
  onComplete?: (projectId: string, scopingData: ScopingData) => void;
  onCancel?: () => void;
}

const IntelligentScopingWizard: React.FC<IntelligentScopingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ScopingData>({
    organization: {
      name: '',
      industry: '',
      size: 'Mid-Market',
      locations: 1,
      total_users: 100,
      compliance_needs: []
    },
    network_discovery: {
      topology_type: 'Segmented',
      site_count: 1,
      endpoint_types: [],
      device_counts: {},
      network_vendors: []
    },
    use_cases: {
      primary_goals: [],
      authentication_methods: [],
      integration_needs: [],
      timeline: '',
      success_criteria: []
    }
  });
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const { mutate: createProject } = useCreateProject();
  const { toast } = useToast();

  const steps = [
    {
      id: 0,
      title: "Organization Profile",
      description: "Tell us about your organization",
      icon: Building2,
      questions: [
        "What's your organization's name?",
        "Which industry are you in?",
        "What's your organization size?",
        "How many locations do you have?",
        "What compliance frameworks apply?"
      ]
    },
    {
      id: 1,
      title: "Network Discovery",
      description: "Understanding your network environment",
      icon: Network,
      questions: [
        "What's your current network topology?",
        "How many sites need NAC deployment?",
        "What types of devices connect to your network?",
        "Who are your primary network vendors?"
      ]
    },
    {
      id: 2,
      title: "Use Cases & Goals",
      description: "Define your security objectives",
      icon: Target,
      questions: [
        "What are your primary security goals?",
        "What authentication methods do you prefer?",
        "What systems need integration?",
        "What defines success for this project?"
      ]
    },
    {
      id: 3,
      title: "AI Analysis & Recommendations",
      description: "Get intelligent insights and recommendations",
      icon: Brain,
      questions: [
        "Review AI-generated deployment approach",
        "Validate recommended implementation phases",
        "Confirm timeline estimates",
        "Address identified risk factors"
      ]
    }
  ];

  // Resource Center data
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceData = [] } = useComplianceFrameworks();
  const { data: authMethods = [] } = useAuthenticationMethods();
  const { data: deviceTypes = [] } = useDeviceTypes();
  const { data: enhancedVendors = [] } = useEnhancedVendors();
  const { data: useCases = [] } = useUseCases();
  const { refreshAll } = useRefreshResources();

  useEffect(() => { refreshAll(); }, []);

  const industries = industryOptions.map((i: any) => i.name);
  const complianceFrameworks = complianceData.map((c: any) => c.name);
  const endpointTypes = deviceTypes.map((d: any) => d.device_name);
  const networkVendors = enhancedVendors
    .filter((v: any) => ['Wired Switch', 'Wireless', 'Router'].includes(v.category) || ['Switch','Access Point','Router'].includes(v.vendor_type))
    .map((v: any) => v.vendor_name);
  const primaryGoals = useCases.map((uc: any) => uc.name);
  const authenticationMethods = authMethods.map((m: any) => m.name);
  const integrationNeeds = enhancedVendors.map((v: any) => v.vendor_name);

  const calculateProgress = () => {
    if (currentStep === steps.length - 1 && formData.ai_recommendations) return 100;
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const generateAIRecommendations = async () => {
    setAiAnalysisLoading(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recommendations = {
      deployment_approach: determineDeploymentApproach(),
      recommended_phases: generatePhases(),
      estimated_timeline: calculateTimeline(),
      complexity_score: calculateComplexity(),
      risk_factors: identifyRisks()
    };

    setFormData(prev => ({
      ...prev,
      ai_recommendations: recommendations
    }));
    
    setAiAnalysisLoading(false);
  };

  const determineDeploymentApproach = (): string => {
    const { organization, network_discovery } = formData;
    
    if (organization.size === "Enterprise" && network_discovery.site_count > 10) {
      return "Phased Enterprise Rollout: Start with pilot site, followed by regional deployment phases";
    } else if (organization.compliance_needs.length > 2) {
      return "Compliance-First Approach: Prioritize high-risk environments and critical compliance requirements";
    } else if (network_discovery.topology_type === "Zero-Trust") {
      return "Zero Trust Implementation: Comprehensive micro-segmentation with identity-based access controls";
    } else {
      return "Standard NAC Deployment: Traditional network access control with modern authentication methods";
    }
  };

  const generatePhases = (): string[] => {
    const phases = ["Discovery & Planning", "Design & Architecture"];
    
    if (formData.organization.size === "Enterprise") {
      phases.push("Pilot Implementation", "Phased Rollout", "Production Deployment");
    } else {
      phases.push("Implementation", "Testing & Validation");
    }
    
    phases.push("Go-Live & Support");
    return phases;
  };

  const calculateTimeline = (): number => {
    let weeks = 8; // Base timeline
    
    if (formData.organization.size === "Enterprise") weeks += 8;
    if (formData.network_discovery.site_count > 5) weeks += 4;
    if (formData.organization.compliance_needs.length > 2) weeks += 2;
    if (formData.network_discovery.endpoint_types.length > 6) weeks += 2;
    
    return weeks;
  };

  const calculateComplexity = (): number => {
    let score = 3; // Base complexity
    
    if (formData.organization.size === "Enterprise") score += 2;
    if (formData.network_discovery.topology_type === "Zero-Trust") score += 2;
    if (formData.organization.compliance_needs.length > 2) score += 1;
    if (formData.network_discovery.network_vendors.length > 3) score += 1;
    
    return Math.min(score, 10);
  };

  const identifyRisks = (): string[] => {
    const risks = [];
    
    if (formData.network_discovery.network_vendors.length > 4) {
      risks.push("Multi-vendor complexity may require extensive integration testing");
    }
    
    if (formData.organization.compliance_needs.includes("HIPAA") || formData.organization.compliance_needs.includes("PCI-DSS")) {
      risks.push("Strict compliance requirements demand thorough validation");
    }
    
    if (formData.use_cases.authentication_methods.includes("802.1X with Certificates")) {
      risks.push("Certificate management complexity requires PKI expertise");
    }
    
    if (formData.network_discovery.endpoint_types.includes("IoT Devices")) {
      risks.push("IoT device diversity may require specialized policies");
    }
    
    return risks;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      await generateAIRecommendations();
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

  const handleComplete = async () => {
    const projectData = {
      name: `${formData.organization.name} - NAC Implementation`,
      client_name: formData.organization.name,
      description: `AI-scoped NAC deployment for ${formData.organization.name}`,
      industry: formData.organization.industry.toLowerCase().replace(/\s+/g, '-'),
      deployment_type: formData.organization.size.toLowerCase(),
      security_level: formData.network_discovery.topology_type.toLowerCase(),
      total_sites: formData.network_discovery.site_count,
      total_endpoints: formData.organization.total_users * 2, // Estimate 2 devices per user
      compliance_frameworks: formData.organization.compliance_needs,
      status: 'planning' as const,
      current_phase: 'discovery' as const,
      progress_percentage: 10
    };

    createProject(projectData, {
      onSuccess: (project) => {
        toast({
          title: "Project Created Successfully",
          description: `${formData.organization.name} NAC project has been created with AI recommendations.`,
        });
        onComplete?.(project.id, formData);
      },
      onError: (error) => {
        toast({
          title: "Failed to Create Project",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Network Topology *</Label>
                <Select 
                  value={formData.network_discovery.topology_type} 
                  onValueChange={(value: "Flat" | "Segmented" | "Zero-Trust") => setFormData(prev => ({
                    ...prev,
                    network_discovery: { ...prev.network_discovery, topology_type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat Network</SelectItem>
                    <SelectItem value="Segmented">Segmented Network</SelectItem>
                    <SelectItem value="Zero-Trust">Zero Trust Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sites for NAC Deployment</Label>
                <Input
                  type="number"
                  value={formData.network_discovery.site_count}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_discovery: { ...prev.network_discovery, site_count: parseInt(e.target.value) || 1 }
                  }))}
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label>Device Types on Your Network</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {endpointTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.network_discovery.endpoint_types.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            network_discovery: {
                              ...prev.network_discovery,
                              endpoint_types: [...prev.network_discovery.endpoint_types, type]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            network_discovery: {
                              ...prev.network_discovery,
                              endpoint_types: prev.network_discovery.endpoint_types.filter(t => t !== type)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Network Vendors</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {networkVendors.map((vendor) => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      id={vendor}
                      checked={formData.network_discovery.network_vendors.includes(vendor)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            network_discovery: {
                              ...prev.network_discovery,
                              network_vendors: [...prev.network_discovery.network_vendors, vendor]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            network_discovery: {
                              ...prev.network_discovery,
                              network_vendors: prev.network_discovery.network_vendors.filter(v => v !== vendor)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={vendor} className="text-sm">{vendor}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Primary Security Goals</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {primaryGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.use_cases.primary_goals.includes(goal)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              primary_goals: [...prev.use_cases.primary_goals, goal]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              primary_goals: prev.use_cases.primary_goals.filter(g => g !== goal)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Authentication Methods</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {authenticationMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.use_cases.authentication_methods.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              authentication_methods: [...prev.use_cases.authentication_methods, method]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              authentication_methods: prev.use_cases.authentication_methods.filter(m => m !== method)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={method} className="text-sm">{method}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Integration Requirements</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {integrationNeeds.map((integration) => (
                  <div key={integration} className="flex items-center space-x-2">
                    <Checkbox
                      id={integration}
                      checked={formData.use_cases.integration_needs.includes(integration)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              integration_needs: [...prev.use_cases.integration_needs, integration]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            use_cases: {
                              ...prev.use_cases,
                              integration_needs: prev.use_cases.integration_needs.filter(i => i !== integration)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={integration} className="text-sm">{integration}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Project Timeline</Label>
              <Select 
                value={formData.use_cases.timeline} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  use_cases: { ...prev.use_cases, timeline: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (Within 30 days)</SelectItem>
                  <SelectItem value="quarter">This Quarter (3 months)</SelectItem>
                  <SelectItem value="half-year">Next 6 months</SelectItem>
                  <SelectItem value="year">Within 1 year</SelectItem>
                  <SelectItem value="flexible">Flexible timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {aiAnalysisLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium">Analyzing your requirements...</p>
                <p className="text-muted-foreground">Our AI is generating personalized recommendations</p>
              </div>
            ) : formData.ai_recommendations ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Recommended Deployment Approach</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.ai_recommendations.deployment_approach}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Implementation Phases</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.ai_recommendations.recommended_phases.map((phase, index) => (
                          <Badge key={index} variant="outline">{phase}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Estimated Timeline</Label>
                        <p className="text-lg font-semibold text-primary">
                          {formData.ai_recommendations.estimated_timeline} weeks
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Complexity Score</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-primary" 
                              style={{ width: `${formData.ai_recommendations.complexity_score * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {formData.ai_recommendations.complexity_score}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {formData.ai_recommendations.risk_factors.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Risk Factors to Consider
                        </Label>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {formData.ai_recommendations.risk_factors.map((risk, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Intelligent NAC Scoping</h1>
        <p className="text-muted-foreground">
          Let our AI analyze your requirements and create a personalized deployment plan
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{calculateProgress()}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep || (index === 3 && formData.ai_recommendations);
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${isActive ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                `}>
                  {isCompleted && index !== currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
            {steps[currentStep].title}
          </CardTitle>
          <CardContent className="p-0">
            <div className="space-y-2">
              {steps[currentStep].questions.map((question, index) => (
                <p key={index} className="text-sm text-muted-foreground">• {question}</p>
              ))}
            </div>
          </CardContent>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        <Button
          onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
          disabled={aiAnalysisLoading}
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? (
            'Create Project'
          ) : aiAnalysisLoading ? (
            'Analyzing...'
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IntelligentScopingWizard;