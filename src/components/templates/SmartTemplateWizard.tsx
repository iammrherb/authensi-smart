import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Settings, 
  Shield, 
  Network, 
  Database, 
  FileText, 
  Save, 
  Download, 
  Copy, 
  Eye, 
  Star,
  ChevronRight,
  ChevronLeft,
  Bot,
  Zap,
  Target,
  Layers,
  Code,
  Check,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Edit,
  Brain,
  Cpu,
  Filter,
  TestTube,
  Sparkles,
  GitBranch,
  Clock,
  Users,
  Building,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useGenerateConfigWithAI } from '@/hooks/useConfigTemplates';
import { useVendors } from '@/hooks/useVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useTemplateCustomizations, useCreateTemplateCustomization } from '@/hooks/useTemplateCustomizations';
import { useToast } from '@/hooks/use-toast';
import CodeBlock from '@/components/ui/code-block';
import EnhancedVendorSelector from '@/components/config/EnhancedVendorSelector';

interface SmartTemplateWizardProps {
  projectId?: string;
  siteId?: string;
  onComplete?: (template: any) => void;
  onCancel?: () => void;
  initialMode?: 'create' | 'customize' | 'enhance';
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  requiredFields: string[];
  aiRecommendations: boolean;
  estimatedTime: string;
}

interface SmartRecommendation {
  id: string;
  type: 'vendor' | 'configuration' | 'security' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  reasoning: string;
  implementation: string[];
  dependencies: string[];
  risks: string[];
  benefits: string[];
}

const SmartTemplateWizard: React.FC<SmartTemplateWizardProps> = ({
  projectId,
  siteId,
  onComplete,
  onCancel,
  initialMode = 'create'
}) => {
  const { data: templates } = useConfigTemplates();
  const { data: vendors } = useVendors();
  const { data: vendorModels } = useVendorModels();
  const { data: customizations } = useTemplateCustomizations(projectId, siteId);
  const createTemplate = useCreateConfigTemplate();
  const createCustomization = useCreateTemplateCustomization();
  const generateWithAI = useGenerateConfigWithAI();
  const { toast } = useToast();

  // Enhanced wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardMode, setWizardMode] = useState(initialMode);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [aiRecommendations, setAiRecommendations] = useState<SmartRecommendation[]>([]);
  const [showAiInsights, setShowAiInsights] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [wizardData, setWizardData] = useState({
    // Discovery Phase
    discovery: {
      projectType: '',
      industryVertical: '',
      complianceRequirements: [],
      businessObjectives: [],
      timelineConstraints: '',
      budgetConstraints: '',
      riskTolerance: 'medium'
    },
    // Infrastructure Analysis
    infrastructure: {
      existingVendors: [],
      networkTopology: 'hybrid',
      deviceInventory: [],
      capacityRequirements: {},
      scalabilityNeeds: [],
      integrationPoints: [],
      legacyConstraints: []
    },
    // Requirements Gathering
    requirements: {
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      securityRequirements: [],
      performanceRequirements: {},
      useCaseScenarios: [],
      userStories: [],
      acceptanceCriteria: []
    },
    // Solution Design
    design: {
      architecturalPattern: '',
      deploymentModel: '',
      securityModel: '',
      dataFlowDesign: {},
      integrationDesign: {},
      failoverStrategy: '',
      monitoringStrategy: ''
    },
    // Configuration Strategy
    configuration: {
      templateStrategy: 'modular',
      customizationLevel: 'moderate',
      automationLevel: 'high',
      validationStrategy: 'comprehensive',
      rolloutStrategy: 'phased',
      rollbackStrategy: 'automatic',
      changeManagement: {}
    },
    // AI Enhancement
    aiSettings: {
      enableAiOptimization: true,
      optimizationFocus: ['security', 'performance', 'compliance'],
      aiModel: 'gpt-5-2025-08-07',
      confidenceThreshold: 0.8,
      reviewRequirement: true,
      continuousLearning: true,
      feedbackLoop: true
    },
    // Quality Assurance
    qa: {
      testingStrategy: 'automated',
      validationCriteria: [],
      performanceBenchmarks: {},
      securityTests: [],
      complianceChecks: [],
      userAcceptanceTests: [],
      rollbackTests: []
    },
    // Deployment Planning
    deployment: {
      deploymentPhases: [],
      migrationStrategy: '',
      downtime: 'minimal',
      rollbackPlan: {},
      communicationPlan: {},
      trainingPlan: {},
      supportPlan: {}
    },
    // Monitoring & Optimization
    monitoring: {
      kpiDefinition: [],
      alertingStrategy: {},
      dashboardDesign: {},
      reportingStrategy: {},
      optimizationTriggers: [],
      maintenanceSchedule: {},
      capacityPlanning: {}
    },
    // Final Configuration
    output: {
      generatedConfig: '',
      customVariables: {},
      validationCommands: [],
      documentationLinks: [],
      troubleshootingGuide: [],
      deploymentInstructions: [],
      maintenanceNotes: []
    }
  });

  // Enhanced wizard steps with AI-powered insights
  const wizardSteps: WizardStep[] = [
    {
      id: 'discovery',
      title: 'Discovery & Planning',
      description: 'Understand project context and business requirements',
      icon: Target,
      category: 'Strategy',
      requiredFields: ['projectType', 'industryVertical', 'businessObjectives'],
      aiRecommendations: true,
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Analysis',
      description: 'Analyze existing infrastructure and capacity needs',
      icon: Network,
      category: 'Technical',
      requiredFields: ['existingVendors', 'networkTopology', 'deviceInventory'],
      aiRecommendations: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'requirements',
      title: 'Requirements Engineering',
      description: 'Define comprehensive functional and non-functional requirements',
      icon: FileText,
      category: 'Analysis',
      requiredFields: ['functionalRequirements', 'securityRequirements'],
      aiRecommendations: true,
      estimatedTime: '20-25 minutes'
    },
    {
      id: 'design',
      title: 'Solution Architecture',
      description: 'Design the optimal solution architecture and patterns',
      icon: Layers,
      category: 'Design',
      requiredFields: ['architecturalPattern', 'deploymentModel', 'securityModel'],
      aiRecommendations: true,
      estimatedTime: '25-30 minutes'
    },
    {
      id: 'configuration',
      title: 'Configuration Strategy',
      description: 'Define template strategy and customization approach',
      icon: Settings,
      category: 'Implementation',
      requiredFields: ['templateStrategy', 'automationLevel'],
      aiRecommendations: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'aiSettings',
      title: 'AI Enhancement',
      description: 'Configure AI-powered optimization and recommendations',
      icon: Brain,
      category: 'Intelligence',
      requiredFields: ['optimizationFocus', 'aiModel'],
      aiRecommendations: false,
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'qa',
      title: 'Quality Assurance',
      description: 'Define testing strategy and validation criteria',
      icon: TestTube,
      category: 'Quality',
      requiredFields: ['testingStrategy', 'validationCriteria'],
      aiRecommendations: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'deployment',
      title: 'Deployment Planning',
      description: 'Plan deployment phases and migration strategy',
      icon: Play,
      category: 'Operations',
      requiredFields: ['deploymentPhases', 'migrationStrategy'],
      aiRecommendations: true,
      estimatedTime: '20-25 minutes'
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Optimization',
      description: 'Configure monitoring, alerting, and optimization strategies',
      icon: Activity,
      category: 'Operations',
      requiredFields: ['kpiDefinition', 'alertingStrategy'],
      aiRecommendations: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'output',
      title: 'Generation & Review',
      description: 'Generate final configuration and review all components',
      icon: Wand2,
      category: 'Output',
      requiredFields: [],
      aiRecommendations: false,
      estimatedTime: '10-15 minutes'
    }
  ];

  const updateWizardData = (step: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [step]: { ...prev[step as keyof typeof prev], ...data }
    }));
  };

  const validateStep = (stepIndex: number): boolean => {
    const step = wizardSteps[stepIndex];
    const stepData = wizardData[step.id as keyof typeof wizardData];
    const errors: string[] = [];

    step.requiredFields.forEach(field => {
      const value = (stepData as any)[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors.push(`${field} is required`);
      }
    });

    setValidationErrors(prev => ({
      ...prev,
      [step.id]: errors
    }));

    return errors.length === 0;
  };

  const generateAiRecommendations = async (stepId: string) => {
    if (!wizardSteps.find(s => s.id === stepId)?.aiRecommendations) return;

    try {
      const context = {
        currentStep: stepId,
        wizardData: wizardData,
        projectId,
        siteId
      };

      const recommendations = await generateSmartRecommendations(context);
      setAiRecommendations(prev => [...prev, ...recommendations]);
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
    }
  };

  const generateSmartRecommendations = async (context: any): Promise<SmartRecommendation[]> => {
    // Simulated AI recommendation generation
    // In real implementation, this would call the AI service
    return [
      {
        id: `rec-${Date.now()}`,
        type: 'vendor',
        title: 'Recommended Vendor Configuration',
        description: 'Based on your infrastructure analysis, we recommend specific vendor configurations',
        confidence: 0.85,
        impact: 'high',
        reasoning: 'Analysis of existing infrastructure and requirements suggests optimal vendor alignment',
        implementation: ['Configure vendor-specific settings', 'Optimize for performance', 'Enable security features'],
        dependencies: ['Network topology assessment', 'Device inventory completion'],
        risks: ['Configuration complexity', 'Integration challenges'],
        benefits: ['Improved performance', 'Enhanced security', 'Reduced operational overhead']
      }
    ];
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < wizardSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        generateAiRecommendations(wizardSteps[currentStep + 1].id);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const enhancedPrompt = generateComprehensivePrompt();
      
      const result = await generateWithAI.mutateAsync({
        vendor: wizardData.infrastructure.existingVendors[0] || 'Generic',
        model: 'Advanced Configuration',
        firmware: 'Latest',
        configType: 'Comprehensive Enterprise Configuration',
        requirements: enhancedPrompt,
        provider: wizardData.aiSettings.aiModel.includes('gpt') ? 'openai' : 'claude'
      });

      updateWizardData('output', {
        generatedConfig: result.content,
        generatedAt: new Date().toISOString()
      });

      setGenerationProgress(100);
      setIsGenerating(false);

      toast({
        title: "Configuration Generated Successfully!",
        description: "Your enterprise configuration has been generated with AI-powered optimizations.",
      });

    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateComprehensivePrompt = (): string => {
    return `
# ENTERPRISE CONFIGURATION GENERATION REQUEST

## PROJECT CONTEXT
• Project Type: ${wizardData.discovery.projectType}
• Industry Vertical: ${wizardData.discovery.industryVertical}
• Business Objectives: ${wizardData.discovery.businessObjectives.join(', ')}
• Compliance Requirements: ${wizardData.discovery.complianceRequirements.join(', ')}
• Risk Tolerance: ${wizardData.discovery.riskTolerance.toUpperCase()}

## INFRASTRUCTURE ANALYSIS
• Network Topology: ${wizardData.infrastructure.networkTopology}
• Existing Vendors: ${wizardData.infrastructure.existingVendors.join(', ')}
• Device Count: ${wizardData.infrastructure.deviceInventory.length} devices
• Scalability Needs: ${wizardData.infrastructure.scalabilityNeeds.join(', ')}
• Integration Points: ${wizardData.infrastructure.integrationPoints.join(', ')}

## REQUIREMENTS SPECIFICATION
• Functional Requirements: ${wizardData.requirements.functionalRequirements.join(', ')}
• Security Requirements: ${wizardData.requirements.securityRequirements.join(', ')}
• Performance Requirements: ${Object.entries(wizardData.requirements.performanceRequirements).map(([k,v]) => `${k}: ${v}`).join(', ')}
• Use Case Scenarios: ${wizardData.requirements.useCaseScenarios.join(', ')}

## SOLUTION ARCHITECTURE
• Architectural Pattern: ${wizardData.design.architecturalPattern}
• Deployment Model: ${wizardData.design.deploymentModel}
• Security Model: ${wizardData.design.securityModel}
• Failover Strategy: ${wizardData.design.failoverStrategy}
• Monitoring Strategy: ${wizardData.design.monitoringStrategy}

## CONFIGURATION STRATEGY
• Template Strategy: ${wizardData.configuration.templateStrategy}
• Customization Level: ${wizardData.configuration.customizationLevel}
• Automation Level: ${wizardData.configuration.automationLevel}
• Validation Strategy: ${wizardData.configuration.validationStrategy}
• Rollout Strategy: ${wizardData.configuration.rolloutStrategy}

## AI OPTIMIZATION SETTINGS
• Optimization Focus: ${wizardData.aiSettings.optimizationFocus.join(', ')}
• AI Model: ${wizardData.aiSettings.aiModel}
• Confidence Threshold: ${wizardData.aiSettings.confidenceThreshold}
• Continuous Learning: ${wizardData.aiSettings.continuousLearning ? 'ENABLED' : 'DISABLED'}

## QUALITY ASSURANCE
• Testing Strategy: ${wizardData.qa.testingStrategy}
• Validation Criteria: ${wizardData.qa.validationCriteria.join(', ')}
• Security Tests: ${wizardData.qa.securityTests.join(', ')}
• Compliance Checks: ${wizardData.qa.complianceChecks.join(', ')}

## DEPLOYMENT PLANNING
• Migration Strategy: ${wizardData.deployment.migrationStrategy}
• Downtime Tolerance: ${wizardData.deployment.downtime}
• Deployment Phases: ${wizardData.deployment.deploymentPhases.length} phases planned
• Rollback Plan: ${wizardData.deployment.rollbackPlan ? 'DEFINED' : 'PENDING'}

## MONITORING & OPTIMIZATION
• KPI Definition: ${wizardData.monitoring.kpiDefinition.join(', ')}
• Alerting Strategy: ${Object.keys(wizardData.monitoring.alertingStrategy).join(', ')}
• Optimization Triggers: ${wizardData.monitoring.optimizationTriggers.join(', ')}

## GENERATION REQUIREMENTS

Please provide a comprehensive, enterprise-grade configuration that includes:

### 1. EXECUTIVE SUMMARY
• High-level architecture overview
• Key design decisions and rationale
• Risk assessment and mitigation strategies
• Expected benefits and outcomes

### 2. DETAILED CONFIGURATION
• Complete device configuration with vendor-specific syntax
• Modular template structure for reusability
• Variable definitions for customization
• Configuration validation and testing procedures

### 3. SECURITY IMPLEMENTATION
• Comprehensive security hardening
• Access control and authentication setup
• Encryption and certificate management
• Compliance framework alignment

### 4. PERFORMANCE OPTIMIZATION
• Performance tuning parameters
• Capacity planning guidelines
• Scalability considerations
• Resource optimization strategies

### 5. OPERATIONAL PROCEDURES
• Deployment checklist and procedures
• Monitoring and alerting configuration
• Maintenance and update procedures
• Troubleshooting guides and runbooks

### 6. QUALITY ASSURANCE
• Testing procedures and validation scripts
• Performance benchmarking
• Security validation tests
• Compliance verification steps

### 7. DOCUMENTATION & TRAINING
• Technical documentation
• User guides and training materials
• Change management procedures
• Knowledge transfer protocols

Generate a production-ready, enterprise-grade solution that meets all specified requirements and incorporates industry best practices.
`;
  };

  const getStepProgress = (): number => {
    return Math.round((completedSteps.size / wizardSteps.length) * 100);
  };

  const renderStepContent = (step: WizardStep) => {
    const stepData = wizardData[step.id as keyof typeof wizardData];
    const errors = validationErrors[step.id] || [];

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    switch (step.id) {
      case 'discovery':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectType">Project Type *</Label>
                <Select 
                  value={(stepData as any).projectType}
                  onValueChange={(value) => updateWizardData('discovery', { projectType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_deployment">New Deployment</SelectItem>
                    <SelectItem value="migration">Migration Project</SelectItem>
                    <SelectItem value="upgrade">System Upgrade</SelectItem>
                    <SelectItem value="expansion">Network Expansion</SelectItem>
                    <SelectItem value="optimization">Optimization Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industryVertical">Industry Vertical *</Label>
                <Select 
                  value={(stepData as any).industryVertical}
                  onValueChange={(value) => updateWizardData('discovery', { industryVertical: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="energy">Energy & Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="businessObjectives">Business Objectives *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {[
                  'Improve Security Posture',
                  'Enhance Network Performance',
                  'Reduce Operational Costs',
                  'Increase Scalability',
                  'Ensure Compliance',
                  'Modernize Infrastructure',
                  'Enable Remote Work',
                  'Improve User Experience',
                  'Enhance Monitoring'
                ].map((objective) => (
                  <div key={objective} className="flex items-center space-x-2">
                    <Checkbox
                      id={objective}
                      checked={(stepData as any).businessObjectives?.includes(objective)}
                      onCheckedChange={(checked) => {
                        const current = (stepData as any).businessObjectives || [];
                        const updated = checked 
                          ? [...current, objective]
                          : current.filter((obj: string) => obj !== objective);
                        updateWizardData('discovery', { businessObjectives: updated });
                      }}
                    />
                    <Label htmlFor={objective} className="text-sm">{objective}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="complianceRequirements">Compliance Requirements</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {[
                  'HIPAA', 'PCI-DSS', 'SOX', 'GDPR', 'ISO 27001', 'NIST', 'FedRAMP', 'SOC 2'
                ].map((framework) => (
                  <div key={framework} className="flex items-center space-x-2">
                    <Checkbox
                      id={framework}
                      checked={(stepData as any).complianceRequirements?.includes(framework)}
                      onCheckedChange={(checked) => {
                        const current = (stepData as any).complianceRequirements || [];
                        const updated = checked 
                          ? [...current, framework]
                          : current.filter((req: string) => req !== framework);
                        updateWizardData('discovery', { complianceRequirements: updated });
                      }}
                    />
                    <Label htmlFor={framework} className="text-sm">{framework}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="timelineConstraints">Timeline Constraints</Label>
                <Select 
                  value={(stepData as any).timelineConstraints}
                  onValueChange={(value) => updateWizardData('discovery', { timelineConstraints: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent (< 1 month)</SelectItem>
                    <SelectItem value="normal">Normal (1-3 months)</SelectItem>
                    <SelectItem value="flexible">Flexible (3-6 months)</SelectItem>
                    <SelectItem value="long_term">Long-term (6+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budgetConstraints">Budget Constraints</Label>
                <Select 
                  value={(stepData as any).budgetConstraints}
                  onValueChange={(value) => updateWizardData('discovery', { budgetConstraints: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limited">Limited (< $50K)</SelectItem>
                    <SelectItem value="moderate">Moderate ($50K-$200K)</SelectItem>
                    <SelectItem value="substantial">Substantial ($200K-$500K)</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($500K+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select 
                  value={(stepData as any).riskTolerance}
                  onValueChange={(value) => updateWizardData('discovery', { riskTolerance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Conservative)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Aggressive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please complete the required fields: {errors.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        );

      case 'output':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Configuration Generation</h3>
              <p className="text-muted-foreground mb-6">
                Generate your comprehensive enterprise configuration based on all collected requirements
              </p>
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Wand2 className="w-6 h-6 text-primary" />
                    </motion.div>
                    <span className="text-lg font-medium">Generating Configuration...</span>
                  </div>
                  <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {generationProgress < 30 ? 'Analyzing requirements...' :
                     generationProgress < 60 ? 'Designing architecture...' :
                     generationProgress < 90 ? 'Generating configuration...' :
                     'Finalizing and validating...'}
                  </p>
                </div>
              </div>
            )}

            {!isGenerating && !wizardData.output.generatedConfig && (
              <div className="text-center space-y-4">
                <Button size="lg" onClick={handleGenerate} className="px-8">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Configuration
                </Button>
                <p className="text-sm text-muted-foreground">
                  This will generate a comprehensive configuration based on all your specifications
                </p>
              </div>
            )}

            {wizardData.output.generatedConfig && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Generated Configuration</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted p-1 rounded-lg">
                  <ScrollArea className="h-96">
                    <CodeBlock
                      code={wizardData.output.generatedConfig}
                      language="bash"
                      showLineNumbers={true}
                    />
                  </ScrollArea>
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={() => onComplete?.(wizardData)}>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Wizard
                  </Button>
                  <Button variant="outline" onClick={() => setIsGenerating(false)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center py-12">
              <div className="mb-4">
                <step.icon className="w-16 h-16 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              <Badge variant="outline">{step.category}</Badge>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Smart Template Wizard</h1>
            <p className="text-muted-foreground">
              AI-powered configuration generation with comprehensive requirements analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              {wizardMode.charAt(0).toUpperCase() + wizardMode.slice(1)} Mode
            </Badge>
            <Button variant="outline" onClick={onCancel}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Exit Wizard
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {getStepProgress()}%</span>
            <span>Step {currentStep + 1} of {wizardSteps.length}</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wizard Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {wizardSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : completedSteps.has(index)
                      ? 'bg-green-100 text-green-800'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`p-1.5 rounded ${
                    index === currentStep
                      ? 'bg-primary-foreground/20'
                      : completedSteps.has(index)
                      ? 'bg-green-200'
                      : 'bg-muted'
                  }`}>
                    {completedSteps.has(index) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{step.title}</p>
                    <p className="text-xs opacity-70">{step.category}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights Panel */}
          {showAIFeatures && aiRecommendations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Insights
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAiInsights(!showAiInsights)}
                  className="p-0 h-auto justify-start"
                >
                  {showAiInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAiInsights ? 'Hide' : 'Show'} Recommendations
                </Button>
              </CardHeader>
              {showAiInsights && (
                <CardContent className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(rec.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {rec.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <wizardSteps[currentStep].icon className="w-6 h-6" />
                    {wizardSteps[currentStep].title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {wizardSteps[currentStep].description}
                    <span className="ml-2 text-xs">
                      • Estimated time: {wizardSteps[currentStep].estimatedTime}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {wizardSteps[currentStep].category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent(wizardSteps[currentStep])}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {wizardSteps.length}
              </span>
            </div>

            <Button
              onClick={nextStep}
              disabled={currentStep === wizardSteps.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTemplateWizard;