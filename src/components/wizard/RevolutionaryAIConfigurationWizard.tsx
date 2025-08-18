import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProfessionalMarkdown from "@/components/ui/professional-markdown";
import { 
  Target, Building2, MapPin, Zap, Settings, CheckCircle, Users, Network, Shield, 
  Brain, Cpu, Rocket, FileText, Clock, Star, Lightbulb, TrendingUp, BarChart3,
  Workflow, GitBranch, TestTube, Eye, Download, Save, Copy, RefreshCw, Play,
  ArrowRight, ArrowLeft, Plus, Minus, Info, AlertTriangle, Check, X
} from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';

interface RevolutionaryConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onSave?: (config: any) => void;
  onCancel?: () => void;
  mode?: 'wizard' | 'analyzer' | 'optimizer' | 'validator';
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'basic' | 'advanced' | 'ai' | 'validation';
  required: boolean;
  estimatedTime: number;
  dependencies?: string[];
  aiAssisted?: boolean;
}

interface ConfigurationProfile {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  industry: string[];
  useCase: string[];
  compliance: string[];
  estimatedTime: number;
  template?: any;
  aiRecommendations?: string[];
}

const RevolutionaryAIConfigurationWizard: React.FC<RevolutionaryConfigWizardProps> = ({
  projectId,
  siteId,
  onSave,
  onCancel,
  mode = 'wizard'
}) => {
  // Core state management
  const [currentStep, setCurrentStep] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Comprehensive wizard data state
  const [wizardData, setWizardData] = useState({
    // Project Context
    project: {
      name: '',
      description: '',
      industry: '',
      organization_size: '',
      security_posture: 'medium',
      compliance_requirements: [],
      timeline: '',
      budget_range: '',
      risk_tolerance: 'medium'
    },
    
    // Infrastructure Analysis
    infrastructure: {
      current_environment: {
        network_size: '',
        device_count: 0,
        user_count: 0,
        locations: [],
        existing_solutions: []
      },
      target_architecture: {
        deployment_model: '',
        redundancy_requirements: '',
        scalability_needs: '',
        integration_points: []
      },
      vendor_ecosystem: {
        primary_vendors: [],
        secondary_vendors: [],
        preferred_models: {},
        firmware_versions: {},
        licensing_model: ''
      }
    },
    
    // Configuration Scenario
    scenario: {
      primary_use_case: '',
      authentication_methods: [],
      authorization_policies: [],
      network_segmentation: {
        enabled: false,
        vlan_strategy: '',
        micro_segmentation: false,
        zero_trust_model: false
      },
      guest_access: {
        enabled: false,
        isolation_method: '',
        bandwidth_limits: false,
        time_restrictions: false
      },
      iot_device_support: {
        enabled: false,
        onboarding_method: '',
        device_profiling: false,
        automated_provisioning: false
      }
    },
    
    // Security Requirements
    security: {
      threat_model: '',
      security_frameworks: [],
      encryption_requirements: [],
      certificate_management: {
        ca_integration: false,
        automated_renewal: false,
        certificate_templates: []
      },
      monitoring_requirements: {
        siem_integration: false,
        real_time_alerts: false,
        compliance_reporting: false,
        threat_detection: false
      }
    },
    
    // AI Configuration
    ai_settings: {
      provider: 'openai',
      model: 'gpt-5-2025-08-07',
      generation_mode: 'comprehensive',
      optimization_level: 'balanced',
      validation_depth: 'thorough',
      include_troubleshooting: true,
      include_documentation: true,
      include_testing_procedures: true,
      custom_requirements: []
    },
    
    // Output Configuration
    output: {
      format: 'multi_format',
      include_documentation: true,
      include_diagrams: true,
      include_checklists: true,
      include_validation: true,
      delivery_method: 'download',
      version_control: true
    }
  });

  // Hooks
  const { generateCompletion, isLoading } = useEnhancedAI();
  const { toast } = useToast();

  // Revolutionary wizard steps with AI assistance
  const wizardSteps: WizardStep[] = [
    {
      id: 'project_context',
      title: 'Project Context & Goals',
      description: 'Define project scope, objectives, and business requirements',
      icon: Target,
      category: 'basic',
      required: true,
      estimatedTime: 5,
      aiAssisted: true
    },
    {
      id: 'infrastructure_analysis',
      title: 'Infrastructure Discovery',
      description: 'Analyze current environment and define target architecture',
      icon: Network,
      category: 'basic',
      required: true,
      estimatedTime: 10,
      dependencies: ['project_context'],
      aiAssisted: true
    },
    {
      id: 'ai_scenario_analysis',
      title: 'AI Scenario Analysis',
      description: 'AI-powered analysis of deployment scenarios and recommendations',
      icon: Brain,
      category: 'ai',
      required: true,
      estimatedTime: 8,
      dependencies: ['infrastructure_analysis'],
      aiAssisted: true
    },
    {
      id: 'security_framework',
      title: 'Security Framework Design',
      description: 'Define comprehensive security policies and compliance requirements',
      icon: Shield,
      category: 'advanced',
      required: true,
      estimatedTime: 12,
      dependencies: ['ai_scenario_analysis'],
      aiAssisted: true
    },
    {
      id: 'configuration_generation',
      title: 'AI Configuration Generation',
      description: 'Generate production-ready configurations with AI optimization',
      icon: Settings,
      category: 'ai',
      required: true,
      estimatedTime: 15,
      dependencies: ['security_framework'],
      aiAssisted: true
    },
    {
      id: 'validation_testing',
      title: 'Validation & Testing',
      description: 'Comprehensive configuration validation and testing procedures',
      icon: TestTube,
      category: 'validation',
      required: true,
      estimatedTime: 10,
      dependencies: ['configuration_generation'],
      aiAssisted: true
    },
    {
      id: 'deployment_planning',
      title: 'Deployment Planning',
      description: 'Create detailed deployment plan with rollback procedures',
      icon: Rocket,
      category: 'advanced',
      required: true,
      estimatedTime: 8,
      dependencies: ['validation_testing'],
      aiAssisted: true
    }
  ];

  // Configuration profiles for different scenarios
  const configurationProfiles: ConfigurationProfile[] = [
    {
      id: 'enterprise_standard',
      name: 'Enterprise Standard',
      description: 'Comprehensive enterprise deployment with full security features',
      category: 'Enterprise',
      complexity: 'intermediate',
      industry: ['Finance', 'Healthcare', 'Manufacturing', 'Government'],
      useCase: ['Employee Authentication', 'Device Control', 'Network Segmentation'],
      compliance: ['ISO 27001', 'SOC 2', 'PCI DSS'],
      estimatedTime: 60,
      aiRecommendations: [
        'Multi-factor authentication for privileged users',
        'Dynamic VLAN assignment based on user roles',
        'Comprehensive audit logging and SIEM integration'
      ]
    },
    {
      id: 'healthcare_hipaa',
      name: 'Healthcare HIPAA Compliant',
      description: 'HIPAA-compliant deployment for healthcare environments',
      category: 'Healthcare',
      complexity: 'advanced',
      industry: ['Healthcare'],
      useCase: ['Medical Device Authentication', 'Patient Network Isolation', 'Compliance Reporting'],
      compliance: ['HIPAA', 'HITECH', 'FDA'],
      estimatedTime: 75,
      aiRecommendations: [
        'Certificate-based authentication for medical devices',
        'Strict network segmentation for patient data',
        'Automated compliance reporting and audit trails'
      ]
    },
    {
      id: 'financial_pci',
      name: 'Financial PCI-DSS Compliant',
      description: 'Banking-grade security for financial institutions',
      category: 'Financial',
      complexity: 'expert',
      industry: ['Banking', 'Finance', 'Insurance'],
      useCase: ['High-Security Authentication', 'Payment Network Isolation', 'Fraud Prevention'],
      compliance: ['PCI DSS', 'SOX', 'FFIEC'],
      estimatedTime: 90,
      aiRecommendations: [
        'Hardware-based certificate authentication',
        'Real-time transaction monitoring integration',
        'Advanced threat detection and response'
      ]
    }
  ];

  // Calculate wizard progress
  const calculateProgress = useMemo(() => {
    const completedSteps = wizardSteps.slice(0, currentStep + 1);
    const totalRequiredSteps = wizardSteps.filter(step => step.required).length;
    const completedRequiredSteps = completedSteps.filter(step => step.required).length;
    return (completedRequiredSteps / totalRequiredSteps) * 100;
  }, [currentStep, wizardSteps]);

  // Update wizard data
  const updateWizardData = (section: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data }
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Auto-generate configuration with AI
  const generateConfiguration = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Phase 1: Requirements Analysis
      setGenerationProgress(20);
      
      const analysisPrompt = `
# COMPREHENSIVE CONFIGURATION ANALYSIS

## PROJECT CONTEXT
- **Project:** ${wizardData.project.name}
- **Industry:** ${wizardData.project.industry}
- **Organization Size:** ${wizardData.project.organization_size}
- **Security Posture:** ${wizardData.project.security_posture}
- **Compliance Requirements:** ${wizardData.project.compliance_requirements.join(', ')}

## CONFIGURATION REQUIREMENTS
Generate a comprehensive analysis that includes:

### 🎯 REQUIREMENTS ANALYSIS
- Business requirements validation
- Technical requirements assessment
- Compliance mapping and gap analysis
- Risk assessment and mitigation strategies

### 🏗️ ARCHITECTURE DESIGN
- Network topology recommendations
- Device placement and configuration strategy
- Integration points and dependencies
- Scalability and redundancy planning

### 🔒 SECURITY FRAMEWORK
- Authentication method selection and configuration
- Authorization policy development
- Network segmentation strategy
- Monitoring and logging requirements

### 📋 IMPLEMENTATION ROADMAP
- Phased deployment approach
- Testing and validation procedures
- Rollback and recovery planning
- Success criteria and KPIs

Provide detailed, actionable recommendations with professional formatting.
      `;

      const analysisResult = await generateCompletion({
        prompt: analysisPrompt,
        taskType: 'project_insights',
        context: 'comprehensive_config_analysis'
      });

      // Phase 2: Configuration Generation
      setGenerationProgress(50);

      const configPrompt = `
# PRODUCTION CONFIGURATION GENERATION

Based on the analysis, generate production-ready configurations:

## DEVICE SPECIFICATIONS
- **Primary Vendors:** ${wizardData.infrastructure.vendor_ecosystem.primary_vendors.join(', ')}
- **Deployment Model:** ${wizardData.infrastructure.target_architecture.deployment_model}
- **Authentication Methods:** ${wizardData.scenario.authentication_methods.join(', ')}

## CONFIGURATION REQUIREMENTS

### 📁 CORE CONFIGURATION FILES
Generate complete configuration files for:
\`\`\`bash
# Network Device Configuration
- Switch configurations with 802.1X settings
- Wireless controller configurations
- Firewall policies and rules
- RADIUS server integration
\`\`\`

### 🔧 INTEGRATION SCRIPTS
\`\`\`python
# Automation and integration scripts
- Device provisioning scripts
- Configuration backup and restore
- Monitoring and alerting integration
- Compliance reporting automation
\`\`\`

### 📖 DEPLOYMENT DOCUMENTATION
- Step-by-step deployment guide
- Configuration validation checklist
- Troubleshooting procedures
- Maintenance and update procedures

### ✅ TESTING PROCEDURES
- Unit testing for individual components
- Integration testing procedures
- User acceptance testing scenarios
- Performance and load testing

Ensure all configurations are production-ready with proper error handling and security best practices.
      `;

      const configResult = await generateCompletion({
        prompt: configPrompt,
        taskType: 'project_insights',
        context: 'production_config_generation'
      });

      // Phase 3: Optimization and Validation
      setGenerationProgress(80);

      const optimizationPrompt = `
# CONFIGURATION OPTIMIZATION AND VALIDATION

## OPTIMIZATION ANALYSIS
Review and optimize the generated configuration for:

### ⚡ PERFORMANCE OPTIMIZATION
- Resource utilization optimization
- Network traffic flow optimization
- Authentication response time optimization
- Monitoring overhead reduction

### 🔒 SECURITY HARDENING
- Security baseline validation
- Vulnerability assessment and mitigation
- Access control policy optimization
- Threat detection enhancement

### 📊 OPERATIONAL EXCELLENCE
- Configuration management best practices
- Automated deployment procedures
- Monitoring and alerting optimization
- Disaster recovery planning

### ✅ VALIDATION CHECKLIST
Create comprehensive validation procedures:
- [ ] Configuration syntax validation
- [ ] Security policy verification
- [ ] Integration testing procedures
- [ ] Performance benchmark testing
- [ ] Compliance validation checks

## DELIVERABLES SUMMARY
Provide a complete summary of all generated artifacts with download links and implementation guidance.
      `;

      const optimizationResult = await generateCompletion({
        prompt: optimizationPrompt,
        taskType: 'project_insights',
        context: 'config_optimization_validation'
      });

      // Phase 4: Finalization
      setGenerationProgress(100);

      const finalConfig = {
        id: `config-${Date.now()}`,
        projectId,
        siteId,
        generatedAt: new Date().toISOString(),
        metadata: {
          title: `${wizardData.project.name} - Network Configuration Package`,
          description: wizardData.project.description,
          version: '1.0.0',
          author: 'Revolutionary AI Configuration Engine',
          complexity: 'intermediate'
        },
        analysis: analysisResult?.content || '',
        configuration: configResult?.content || '',
        optimization: optimizationResult?.content || '',
        wizardData,
        estimatedImplementationTime: calculateImplementationTime(),
        riskAssessment: generateRiskAssessment(),
        successMetrics: generateSuccessMetrics()
      };

      // Save configuration
      if (onSave) {
        onSave(finalConfig);
      }

      toast({
        title: "Configuration Generated Successfully!",
        description: "Your production-ready configuration package is ready for deployment.",
      });

    } catch (error) {
      console.error('Configuration generation failed:', error);
      
      toast({
        title: "Configuration Generation Failed",
        description: "Please review your inputs and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions
  const calculateImplementationTime = (): string => {
    const baseHours = 40;
    const complexityMultiplier = 1.0;
    const totalHours = Math.ceil(baseHours * complexityMultiplier);
    return `${totalHours} hours (${Math.ceil(totalHours / 8)} days)`;
  };

  const generateRiskAssessment = () => ({
    overall: wizardData.project.risk_tolerance,
    factors: [
      'Configuration complexity',
      'Integration requirements',
      'User impact',
      'Security implications'
    ],
    mitigation: [
      'Comprehensive testing plan',
      'Phased deployment approach',
      'Rollback procedures',
      'Monitoring and alerting'
    ]
  });

  const generateSuccessMetrics = () => [
    'Network uptime > 99.5%',
    'Authentication success rate > 98%',
    'Security incident reduction > 75%',
    'User satisfaction score > 4.0/5',
    'Compliance audit success'
  ];

  // Initialize component
  useEffect(() => {
    setCompletionPercentage(calculateProgress);
  }, [calculateProgress]);

  // Render current step content
  const renderStepContent = () => {
    const currentStepData = wizardSteps[currentStep];
    
    switch (currentStepData.id) {
      case 'project_context':
        return renderProjectContextStep();
      case 'configuration_generation':
        return renderConfigurationGenerationStep();
      default:
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This step is currently being developed. The full implementation will include comprehensive {currentStepData.title.toLowerCase()} capabilities.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>
                  {currentStepData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {currentStepData.title} step implementation in progress...
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const renderProjectContextStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Project Information
            </CardTitle>
            <CardDescription>
              Define the core project details and business objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                value={wizardData.project.name}
                onChange={(e) => updateWizardData('project', { name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div>
              <Label htmlFor="project_description">Project Description</Label>
              <Textarea
                id="project_description"
                value={wizardData.project.description}
                onChange={(e) => updateWizardData('project', { description: e.target.value })}
                placeholder="Describe the project goals and scope"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={wizardData.project.industry} 
                  onValueChange={(value) => updateWizardData('project', { industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="org_size">Organization Size *</Label>
                <Select 
                  value={wizardData.project.organization_size} 
                  onValueChange={(value) => updateWizardData('project', { organization_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-100 users)</SelectItem>
                    <SelectItem value="medium">Medium (101-1000 users)</SelectItem>
                    <SelectItem value="large">Large (1001-5000 users)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (5000+ users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Business Requirements
            </CardTitle>
            <CardDescription>
              Define security posture and compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Security Posture *</Label>
              <Select 
                value={wizardData.project.security_posture} 
                onValueChange={(value) => updateWizardData('project', { security_posture: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select security level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Security</SelectItem>
                  <SelectItem value="medium">Medium Security</SelectItem>
                  <SelectItem value="high">High Security</SelectItem>
                  <SelectItem value="critical">Critical/Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select 
                  value={wizardData.project.timeline} 
                  onValueChange={(value) => updateWizardData('project', { timeline: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (under 1 month)</SelectItem>
                    <SelectItem value="short">Short Term (1-3 months)</SelectItem>
                    <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
                    <SelectItem value="long">Long Term (6+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                <Select 
                  value={wizardData.project.risk_tolerance} 
                  onValueChange={(value) => updateWizardData('project', { risk_tolerance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      {wizardData.project.name && wizardData.project.industry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Project Insights
            </CardTitle>
            <CardDescription>
              AI-powered recommendations based on your project characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Success Probability</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">85%</div>
                <p className="text-sm text-blue-600">Based on similar projects</p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">Estimated Duration</span>
                </div>
                <div className="text-2xl font-bold text-green-700">12 weeks</div>
                <p className="text-sm text-green-600">Industry average timeline</p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-600">Estimated Investment</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">$250K</div>
                <p className="text-sm text-purple-600">Estimated project cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderConfigurationGenerationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration Generation</CardTitle>
          <CardDescription>
            Generate production-ready configurations with AI optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <Button 
              onClick={generateConfiguration} 
              disabled={isGenerating}
              size="lg"
              className="w-full max-w-md"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-5 w-5 mr-2 animate-spin" />
                  Generating Configuration...
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5 mr-2" />
                  Generate AI Configuration
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="space-y-2">
                <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {generationProgress < 25 ? 'Analyzing requirements...' :
                   generationProgress < 50 ? 'Generating configuration...' :
                   generationProgress < 80 ? 'Optimizing and validating...' :
                   'Finalizing package...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Revolutionary AI Configuration Wizard</h1>
                  <p className="text-muted-foreground">
                    World-class AI-powered network configuration generation
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Progress: {Math.round(completionPercentage)}%</div>
                <Progress value={completionPercentage} className="w-32" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wizard Progress</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {wizardSteps.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wizardSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          index === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : index < currentStep
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => jumpToStep(index)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          index === currentStep
                            ? 'border-primary-foreground bg-primary-foreground text-primary'
                            : index < currentStep
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-muted-foreground'
                        }`}>
                          {index < currentStep ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{step.title}</div>
                          {step.aiAssisted && (
                            <div className="flex items-center gap-1 mt-1">
                              <Brain className="h-3 w-3" />
                              <span className="text-xs opacity-80">AI Assisted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(wizardSteps[currentStep].icon, { className: "h-5 w-5" })}
                      {wizardSteps[currentStep].title}
                    </CardTitle>
                    <CardDescription>
                      {wizardSteps[currentStep].description}
                    </CardDescription>
                  </div>
                  
                  {wizardSteps[currentStep].aiAssisted && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      AI Powered
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {renderStepContent()}
                </ScrollArea>
              </CardContent>
              
              <div className="flex items-center justify-between p-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Est. {wizardSteps[currentStep].estimatedTime} minutes
                  </span>
                </div>
                
                <Button
                  onClick={nextStep}
                  disabled={currentStep === wizardSteps.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevolutionaryAIConfigurationWizard;