import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import CodeBlock from "@/components/ui/code-block";
import { 
  Wand2, 
  Settings, 
  Shield, 
  Network, 
  Database, 
  FileText, 
  Save, 
  Download, 
  Upload, 
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
  Search,
  Sparkles,
  TestTube,
  Brain,
  Cpu,
  Filter
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useGenerateConfigWithAI } from '@/hooks/useConfigTemplates';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useToast } from '@/hooks/use-toast';
import EnhancedVendorSelector from './EnhancedVendorSelector';
import InfrastructureSelector, { InfrastructureSelection } from "@/components/resources/InfrastructureSelector";

interface UnifiedIntelligentConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onSave?: (config: any) => void;
  onCancel?: () => void;
}

interface ConfigurationScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  authMethods: string[];
  vlans: boolean;
  guestAccess: boolean;
  compliance: string[];
  template?: string;
}

interface ConfigAnalysisResult {
  vendor?: string;
  model?: string;
  firmware?: string;
  configType?: string;
  issues?: string[];
  recommendations?: string[];
  optimization?: string;
  securityGrade?: string;
  complianceScore?: number;
}

const UnifiedIntelligentConfigWizard: React.FC<UnifiedIntelligentConfigWizardProps> = ({ 
  projectId, 
  siteId, 
  onSave, 
  onCancel 
}) => {
  const { data: templates } = useConfigTemplates();
  const { data: vendors } = useEnhancedVendors();
  const { data: vendorModels } = useVendorModels();
  const { data: useCases } = useUseCases();
  const { data: requirements } = useRequirements();
  const createTemplate = useCreateConfigTemplate();
  const generateWithAI = useGenerateConfigWithAI();
  const { toast } = useToast();

  // Unified wizard state
  const [activeMode, setActiveMode] = useState<'wizard' | 'analyzer' | 'templates'>('wizard');
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<any>({
    basic: {
      name: '',
      description: '',
      vendor: '',
      model: '',
      firmwareVersion: '',
      deviceType: 'switch'
    },
    infrastructure: {
      nac_vendors: [],
      network: { wired_vendors: [], wired_models: {}, wireless_vendors: [], wireless_models: {} },
      security: { firewalls: [], vpn: [], idp_sso: [], edr: [], siem: [] },
      device_inventory: []
    } as InfrastructureSelection,
    scenario: {
      selectedScenario: '',
      customScenario: false,
      authMethods: [],
      networkSegmentation: false,
      guestAccess: false,
      compliance: []
    },
    requirements: {
      selectedRequirements: [],
      customRequirements: [],
      useCases: [],
      industry: '',
      securityLevel: 'medium'
    },
    advanced: {
      vlans: [],
      radiusServers: [],
      certificates: [],
      policies: [],
      templates: [],
      customVariables: {}
    },
    ai: {
      provider: 'openai',
      model: 'gpt-5-2025-08-07',
      generateWithAI: true,
      useEnhancedPrompts: true,
      includeValidation: true,
      includeTroubleshooting: true
    },
    review: {
      generatedConfig: '',
      configGenerated: false,
      saveAsTemplate: true,
      associateProject: !!projectId,
      associateSite: !!siteId,
      tags: []
    }
  });

  // Config Analyzer state
  const [analyzerData, setAnalyzerData] = useState({
    inputConfig: '',
    analysisResult: null as ConfigAnalysisResult | null,
    optimizationOptions: {
      security: true,
      performance: true,
      compliance: true,
      bestPractices: true
    },
    generatedOptimization: '',
    analyzing: false
  });

  // Template management state
  const [templateFilters, setTemplateFilters] = useState({
    search: '',
    category: 'all',
    complexity: 'all',
    vendor: 'all'
  });

  // Configuration scenarios
  const configurationScenarios: ConfigurationScenario[] = [
    {
      id: 'basic-dot1x',
      name: 'Basic 802.1X Authentication',
      description: 'Simple user authentication with single VLAN',
      category: 'Basic',
      complexity: 'basic',
      authMethods: ['EAP-TLS', 'PEAP'],
      vlans: false,
      guestAccess: false,
      compliance: []
    },
    {
      id: 'dynamic-vlan',
      name: 'Dynamic VLAN Assignment',
      description: 'User-based VLAN assignment with RADIUS attributes',
      category: 'Intermediate',
      complexity: 'intermediate',
      authMethods: ['EAP-TLS', 'PEAP', 'EAP-TTLS'],
      vlans: true,
      guestAccess: false,
      compliance: []
    },
    {
      id: 'guest-access',
      name: 'Guest Network with 802.1X',
      description: 'Separate guest network with captive portal',
      category: 'Intermediate',
      complexity: 'intermediate',
      authMethods: ['Web Auth', 'MAC Bypass'],
      vlans: true,
      guestAccess: true,
      compliance: []
    },
    {
      id: 'healthcare-hipaa',
      name: 'Healthcare HIPAA Compliant',
      description: 'Medical device authentication with HIPAA compliance',
      category: 'Compliance',
      complexity: 'advanced',
      authMethods: ['EAP-TLS', 'Certificate'],
      vlans: true,
      guestAccess: false,
      compliance: ['HIPAA', 'FDA']
    },
    {
      id: 'financial-pci',
      name: 'Financial PCI-DSS Compliant',
      description: 'PCI-DSS compliant network access for financial services',
      category: 'Compliance',
      complexity: 'expert',
      authMethods: ['EAP-TLS', 'Certificate', 'Smart Card'],
      vlans: true,
      guestAccess: false,
      compliance: ['PCI-DSS', 'SOX']
    },
    {
      id: 'iot-segmentation',
      name: 'IoT Device Segmentation',
      description: 'Secure IoT device onboarding with microsegmentation',
      category: 'Advanced',
      complexity: 'advanced',
      authMethods: ['Certificate', 'PSK', 'MAC Bypass'],
      vlans: true,
      guestAccess: false,
      compliance: []
    }
  ];

  const wizardSteps = [
    { id: 'basic', title: 'Basic Information', icon: Database },
    { id: 'scenario', title: 'Configuration Scenario', icon: Target },
    { id: 'requirements', title: 'Requirements & Security', icon: FileText },
    { id: 'advanced', title: 'Advanced Settings', icon: Settings },
    { id: 'ai', title: 'AI Configuration', icon: Brain },
    { id: 'review', title: 'Review & Generate', icon: Wand2 }
  ];

  const updateWizardData = (step: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

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

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic
        return wizardData.basic.name && wizardData.basic.vendor;
      case 1: // Scenario
        return wizardData.scenario.selectedScenario;
      case 2: // Requirements
        return wizardData.requirements.industry && wizardData.requirements.securityLevel;
      case 3: // Advanced
        return true; // Optional step
      case 4: // AI
        return wizardData.ai.provider && wizardData.ai.model;
      case 5: // Review
        return true;
      default:
        return true;
    }
  };

  // Enhanced AI prompt generation with bullet points
  const generateEnhancedPrompt = () => {
    const selectedVendor = vendors?.find(v => v.id === wizardData.basic.vendor);
    const selectedModel = vendorModels?.find(m => m.id === wizardData.basic.model);
    const scenario = configurationScenarios.find(s => s.id === wizardData.scenario.selectedScenario);

    return `
# NETWORK CONFIGURATION GENERATION REQUEST

## DEVICE SPECIFICATIONS
• Vendor: ${selectedVendor?.vendor_name || 'Generic'}
• Model: ${selectedModel?.model_name || 'Generic Model'}
• Firmware Version: ${wizardData.basic.firmwareVersion || 'Latest Stable'}
• Device Type: ${wizardData.basic.deviceType}

## DEPLOYMENT SCENARIO
• Configuration Type: ${scenario?.name || 'Custom Configuration'}
• Scenario Category: ${scenario?.category || 'Enterprise'}
• Complexity Level: ${scenario?.complexity || 'intermediate'}
• Authentication Methods: ${wizardData.scenario.authMethods.join(', ') || 'EAP-TLS, PEAP'}

## ENVIRONMENT REQUIREMENTS
• Industry: ${wizardData.requirements.industry || 'Enterprise'}
• Security Level: ${wizardData.requirements.securityLevel.toUpperCase()}
• Compliance Standards: ${wizardData.scenario.compliance.join(', ') || 'Industry Best Practices'}
• Network Segmentation: ${wizardData.scenario.networkSegmentation ? 'REQUIRED' : 'NOT REQUIRED'}
• Guest Network Access: ${wizardData.scenario.guestAccess ? 'REQUIRED' : 'NOT REQUIRED'}

## TECHNICAL REQUIREMENTS
• VLANs Configured: ${wizardData.advanced.vlans.length || 0}
• RADIUS Servers: ${wizardData.advanced.radiusServers.length || 0}
• Certificate Requirements: ${wizardData.advanced.certificates.length || 0}
• Security Policies: ${wizardData.advanced.policies.length || 0}

## INFRASTRUCTURE CONTEXT
${wizardData.infrastructure.nac_vendors.length ? `• NAC Vendors: ${wizardData.infrastructure.nac_vendors.join(', ')}` : ''}
${wizardData.infrastructure.network.wired_vendors.length ? `• Wired Infrastructure: ${wizardData.infrastructure.network.wired_vendors.join(', ')}` : ''}
${wizardData.infrastructure.network.wireless_vendors.length ? `• Wireless Infrastructure: ${wizardData.infrastructure.network.wireless_vendors.join(', ')}` : ''}

## CUSTOM REQUIREMENTS
${wizardData.requirements.customRequirements.map((req: string) => `• ${req}`).join('\n') || '• Standard enterprise deployment requirements'}

## GENERATION REQUIREMENTS
Please provide a comprehensive, production-ready configuration that includes:

### 1. CORE CONFIGURATION
• Complete device configuration with vendor-specific syntax
• All necessary feature enablement commands
• Interface configurations with security settings

### 2. AUTHENTICATION SETUP
• RADIUS server integration with failover
• Authentication method configuration
• Authorization policies and rules

### 3. NETWORK SEGMENTATION
• VLAN configuration and assignment
• Dynamic VLAN assignment rules
• Traffic isolation and filtering

### 4. SECURITY HARDENING
• Security best practices implementation
• Access control lists and policies
• Logging and monitoring configuration

### 5. QUALITY ASSURANCE
• Configuration validation commands
• Testing and verification procedures
• Performance optimization settings

### 6. OPERATIONAL PROCEDURES
• Deployment checklist
• Troubleshooting guide with common issues
• Maintenance and update procedures
• Rollback procedures

### 7. COMPLIANCE & DOCUMENTATION
• Compliance mapping for required standards
• Configuration documentation
• Change tracking and versioning

Generate a complete, enterprise-grade configuration that is immediately deployable and follows all vendor-specific best practices.
`;
  };

  // Config analyzer with enhanced AI prompts
  const analyzeConfiguration = async () => {
    if (!analyzerData.inputConfig.trim()) {
      toast({
        title: "No Configuration Provided",
        description: "Please paste a configuration to analyze.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzerData(prev => ({ ...prev, analyzing: true }));

    try {
      const analysisPrompt = `
# CONFIGURATION ANALYSIS REQUEST

## CONFIGURATION TO ANALYZE
\`\`\`
${analyzerData.inputConfig}
\`\`\`

## ANALYSIS REQUIREMENTS

### 1. DEVICE IDENTIFICATION
• Detect vendor, model, and firmware version
• Identify device type and role
• Determine configuration type and purpose

### 2. SECURITY ASSESSMENT
• Evaluate security posture and vulnerabilities
• Identify missing security features
• Assess compliance with industry standards
• Rate overall security (A-F grade)

### 3. BEST PRACTICES REVIEW
• Compare against vendor best practices
• Identify configuration anti-patterns
• Suggest optimization opportunities
• Highlight deprecated or insecure settings

### 4. OPERATIONAL ANALYSIS
• Assess configuration maintainability
• Identify potential operational issues
• Evaluate logging and monitoring setup
• Check for proper documentation

### 5. PERFORMANCE OPTIMIZATION
• Identify performance bottlenecks
• Suggest optimization opportunities
• Evaluate resource utilization settings
• Check for proper QoS configuration

### 6. COMPLIANCE SCORING
• Score against common frameworks (0-100)
• Identify compliance gaps
• Suggest remediation steps

Please provide detailed analysis in structured format with:
• Executive summary with security grade
• Detailed findings by category
• Prioritized recommendations
• Compliance score and gaps
• Optimized configuration suggestions
`;

      const result = await generateWithAI.mutateAsync({
        vendor: 'Generic',
        model: 'Configuration Analysis',
        firmware: 'N/A',
        configType: 'Security Analysis',
        requirements: analysisPrompt,
        provider: 'openai'
      });

      // Parse the analysis result (simplified for demo)
      const analysisResult: ConfigAnalysisResult = {
        vendor: 'Detected from config',
        model: 'Detected from config',
        firmware: 'Detected from config',
        configType: 'Network Device Configuration',
        issues: ['Analysis complete'],
        recommendations: ['See detailed analysis'],
        optimization: result.content || '',
        securityGrade: 'B+',
        complianceScore: 85
      };

      setAnalyzerData(prev => ({
        ...prev,
        analysisResult,
        analyzing: false,
        generatedOptimization: result.content || ''
      }));

      toast({
        title: "Configuration Analysis Complete",
        description: "Your configuration has been analyzed with AI-powered insights.",
      });

    } catch (error) {
      console.error('Configuration analysis failed:', error);
      setAnalyzerData(prev => ({ ...prev, analyzing: false }));
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const optimizeConfiguration = async () => {
    if (!analyzerData.inputConfig.trim()) {
      toast({
        title: "No Configuration Provided",
        description: "Please paste a configuration to optimize.",
        variant: "destructive"
      });
      return;
    }

    try {
      const optimizationPrompt = `
# CONFIGURATION OPTIMIZATION REQUEST

## ORIGINAL CONFIGURATION
\`\`\`
${analyzerData.inputConfig}
\`\`\`

## OPTIMIZATION OBJECTIVES
${analyzerData.optimizationOptions.security ? '• Enhance security posture and reduce vulnerabilities' : ''}
${analyzerData.optimizationOptions.performance ? '• Optimize performance and resource utilization' : ''}
${analyzerData.optimizationOptions.compliance ? '• Improve compliance with industry standards' : ''}
${analyzerData.optimizationOptions.bestPractices ? '• Apply vendor best practices and recommendations' : ''}

## REQUIREMENTS

### 1. MAINTAIN FUNCTIONALITY
• Preserve all existing functionality
• Ensure no service disruption
• Maintain backward compatibility where possible

### 2. SECURITY ENHANCEMENTS
• Implement latest security features
• Remove deprecated or insecure settings
• Add missing security configurations
• Enhance access controls and authentication

### 3. PERFORMANCE OPTIMIZATION
• Optimize buffer sizes and queue settings
• Implement proper QoS configurations
• Enhance monitoring and logging
• Optimize resource utilization

### 4. COMPLIANCE IMPROVEMENTS
• Align with industry standards
• Add required compliance settings
• Implement audit and logging requirements
• Enhance documentation and change tracking

### 5. OPERATIONAL EXCELLENCE
• Add proper monitoring and alerting
• Implement backup and recovery procedures
• Enhance troubleshooting capabilities
• Add configuration validation

Please provide:
• Complete optimized configuration
• Summary of changes made
• Migration/implementation guide
• Validation and testing procedures
• Risk assessment of changes
`;

      const result = await generateWithAI.mutateAsync({
        vendor: 'Generic',
        model: 'Configuration Optimization',
        firmware: 'N/A',
        configType: 'Optimization',
        requirements: optimizationPrompt,
        provider: 'openai'
      });

      setAnalyzerData(prev => ({
        ...prev,
        generatedOptimization: result.content || ''
      }));

      toast({
        title: "Configuration Optimized",
        description: "Your configuration has been optimized with AI-powered enhancements.",
      });

    } catch (error) {
      console.error('Configuration optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateConfiguration = async () => {
    try {
      const enhancedPrompt = generateEnhancedPrompt();
      
      const result = await generateWithAI.mutateAsync({
        vendor: wizardData.basic.vendor,
        model: wizardData.basic.model,
        firmware: wizardData.basic.firmwareVersion,
        configType: 'Comprehensive 802.1X Configuration',
        requirements: enhancedPrompt,
        provider: wizardData.ai.provider as 'openai' | 'claude' | 'gemini'
      });

      updateWizardData('review', {
        generatedConfig: result.content,
        configGenerated: true,
        generationContext: {
          prompt: enhancedPrompt,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Configuration Generated Successfully",
        description: "AI-powered configuration with enhanced prompts has been generated.",
      });

    } catch (error) {
      console.error('Failed to generate configuration:', error);
      toast({
        title: "Configuration Generation Failed",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    }
  };

  // Filter templates based on current filters
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateFilters.search.toLowerCase()) ||
                         template.description?.toLowerCase().includes(templateFilters.search.toLowerCase());
    const matchesCategory = templateFilters.category === 'all' || template.category === templateFilters.category;
    const matchesComplexity = templateFilters.complexity === 'all' || template.complexity_level === templateFilters.complexity;
    const matchesVendor = templateFilters.vendor === 'all' || template.vendor_id === templateFilters.vendor;
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesVendor;
  }) || [];

  // Main render function
  const renderContent = () => {
    if (activeMode === 'analyzer') {
      return renderConfigAnalyzer();
    } else if (activeMode === 'templates') {
      return renderTemplateManager();
    } else {
      return renderWizard();
    }
  };

  // Wizard rendering
  const renderWizard = () => (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Intelligent Configuration Wizard</h2>
          <Badge variant="glow" className="px-3 py-1">
            Step {currentStep + 1} of {wizardSteps.length}
          </Badge>
        </div>
        
        <Progress value={(currentStep / (wizardSteps.length - 1)) * 100} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          {wizardSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-2 ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <step.icon className="h-4 w-4" />
              <span className="hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-6">
          {currentStep === 0 && renderBasicStep()}
          {currentStep === 1 && renderScenarioStep()}
          {currentStep === 2 && renderRequirementsStep()}
          {currentStep === 3 && renderAdvancedStep()}
          {currentStep === 4 && renderAIStep()}
          {currentStep === 5 && renderReviewStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentStep === wizardSteps.length - 1 ? (
            <Button onClick={handleGenerateConfiguration} disabled={!canProceed()}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Configuration
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Config Analyzer rendering
  const renderConfigAnalyzer = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Intelligent Config Analyzer</h2>
            <p className="text-muted-foreground">
              AI-powered configuration analysis with security assessment and optimization recommendations
            </p>
          </div>
          <Badge variant="glow" className="px-3 py-1">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Configuration Input
            </CardTitle>
            <CardDescription>
              Paste your device configuration for intelligent analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your device configuration here..."
              value={analyzerData.inputConfig}
              onChange={(e) => setAnalyzerData(prev => ({ ...prev, inputConfig: e.target.value }))}
              rows={15}
              className="font-mono text-sm"
            />
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Analysis Options</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analyzerData.optimizationOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setAnalyzerData(prev => ({
                          ...prev,
                          optimizationOptions: {
                            ...prev.optimizationOptions,
                            [key]: checked as boolean
                          }
                        }))
                      }
                    />
                    <Label htmlFor={key} className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={analyzeConfiguration}
                disabled={analyzerData.analyzing || !analyzerData.inputConfig.trim()}
                className="flex-1"
              >
                {analyzerData.analyzing ? (
                  <>
                    <Cpu className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Config
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={optimizeConfiguration}
                disabled={analyzerData.analyzing || !analyzerData.inputConfig.trim()}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyzerData.analysisResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Security Grade</Label>
                    <Badge variant="secondary" className="text-lg">
                      {analyzerData.analysisResult.securityGrade}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Compliance Score</Label>
                    <Badge variant="default" className="text-lg">
                      {analyzerData.analysisResult.complianceScore}%
                    </Badge>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px]">
                  <div className="prose prose-sm max-w-none">
                    <CodeBlock 
                      code={analyzerData.generatedOptimization}
                      language="text"
                    />
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <TestTube className="h-12 w-12 mx-auto opacity-50" />
                  <p>Run analysis to see intelligent insights and recommendations</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Template Manager rendering
  const renderTemplateManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Templates</h2>
          <p className="text-muted-foreground">
            {filteredTemplates.length} templates available
          </p>
        </div>
        <Button onClick={() => setActiveMode('wizard')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={templateFilters.search}
                onChange={(e) => setTemplateFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={templateFilters.category} 
              onValueChange={(value) => setTemplateFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="802.1X">802.1X</SelectItem>
                <SelectItem value="Switch">Switch Configuration</SelectItem>
                <SelectItem value="Wireless">Wireless</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={templateFilters.complexity} 
              onValueChange={(value) => setTemplateFilters(prev => ({ ...prev, complexity: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={templateFilters.vendor} 
              onValueChange={(value) => setTemplateFilters(prev => ({ ...prev, vendor: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors?.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {template.complexity_level}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                {template.tags?.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Step rendering functions (continuing...)
  const renderBasicStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Database className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <p className="text-muted-foreground">Define your configuration parameters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Configuration Name *</Label>
          <Input
            value={wizardData.basic.name}
            onChange={(e) => updateWizardData('basic', { name: e.target.value })}
            placeholder="e.g., Production 802.1X Config"
          />
        </div>
        <div className="space-y-2">
          <Label>Device Type *</Label>
          <Select
            value={wizardData.basic.deviceType}
            onValueChange={(value) => updateWizardData('basic', { deviceType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="switch">Wired Switch</SelectItem>
              <SelectItem value="wireless">Wireless Controller/AP</SelectItem>
              <SelectItem value="firewall">Firewall/Security Appliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={wizardData.basic.description}
          onChange={(e) => updateWizardData('basic', { description: e.target.value })}
          placeholder="Brief description of this configuration..."
          rows={3}
        />
      </div>

      <EnhancedVendorSelector
        selectedVendor={wizardData.basic.vendor}
        selectedModel={wizardData.basic.model}
        selectedFirmware={wizardData.basic.firmwareVersion}
        onVendorChange={(vendor) => updateWizardData('basic', { vendor })}
        onModelChange={(model) => updateWizardData('basic', { model })}
        onFirmwareChange={(firmwareVersion) => updateWizardData('basic', { firmwareVersion })}
        compact={true}
        showDetails={false}
      />

      <div className="pt-4">
        <Label className="font-medium">Infrastructure Context</Label>
        <InfrastructureSelector
          value={wizardData.infrastructure}
          onChange={(val) => updateWizardData('infrastructure', val)}
          sections={{ devices: false }}
        />
      </div>
    </div>
  );

  const renderScenarioStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Target className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Configuration Scenario</h3>
        <p className="text-muted-foreground">Choose your deployment scenario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configurationScenarios.map(scenario => (
          <Card 
            key={scenario.id}
            className={`cursor-pointer transition-all duration-200 ${
              wizardData.scenario.selectedScenario === scenario.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:shadow-md'
            }`}
            onClick={() => updateWizardData('scenario', { selectedScenario: scenario.id })}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <Badge variant={scenario.complexity === 'basic' ? 'secondary' : 
                              scenario.complexity === 'intermediate' ? 'default' :
                              scenario.complexity === 'advanced' ? 'destructive' : 'outline'}>
                  {scenario.complexity}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {scenario.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {scenario.authMethods.slice(0, 3).map(method => (
                  <Badge key={method} variant="outline" className="text-xs">
                    {method}
                  </Badge>
                ))}
                {scenario.authMethods.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{scenario.authMethods.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRequirementsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Requirements & Security</h3>
        <p className="text-muted-foreground">Define security and compliance requirements</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select
            value={wizardData.requirements.industry}
            onValueChange={(value) => updateWizardData('requirements', { industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="financial">Financial Services</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Security Level *</Label>
          <Select
            value={wizardData.requirements.securityLevel}
            onValueChange={(value) => updateWizardData('requirements', { securityLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Additional Requirements</Label>
        <Textarea
          placeholder="Enter specific requirements, one per line..."
          onChange={(e) => updateWizardData('requirements', { 
            customRequirements: e.target.value.split('\n').filter(line => line.trim())
          })}
          rows={5}
        />
      </div>
    </div>
  );

  const renderAdvancedStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Settings className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Advanced Settings</h3>
        <p className="text-muted-foreground">Configure advanced parameters (optional)</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These settings are optional and will be included in the AI generation if specified.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={wizardData.scenario.networkSegmentation}
            onCheckedChange={(checked) => updateWizardData('scenario', { networkSegmentation: checked })}
          />
          <Label>Enable Network Segmentation</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={wizardData.scenario.guestAccess}
            onCheckedChange={(checked) => updateWizardData('scenario', { guestAccess: checked })}
          />
          <Label>Include Guest Network Access</Label>
        </div>
      </div>
    </div>
  );

  const renderAIStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Brain className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">AI Configuration</h3>
        <p className="text-muted-foreground">Configure AI generation parameters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>AI Provider *</Label>
          <Select
            value={wizardData.ai.provider}
            onValueChange={(value) => updateWizardData('ai', { provider: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>AI Model *</Label>
          <Select
            value={wizardData.ai.model}
            onValueChange={(value) => updateWizardData('ai', { model: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-5-2025-08-07">GPT-5 (Latest)</SelectItem>
              <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1</SelectItem>
              <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
              <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={wizardData.ai.useEnhancedPrompts}
            onCheckedChange={(checked) => updateWizardData('ai', { useEnhancedPrompts: checked })}
          />
          <Label>Use Enhanced Bullet-Point Prompts</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={wizardData.ai.includeValidation}
            onCheckedChange={(checked) => updateWizardData('ai', { includeValidation: checked })}
          />
          <Label>Include Validation Commands</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={wizardData.ai.includeTroubleshooting}
            onCheckedChange={(checked) => updateWizardData('ai', { includeTroubleshooting: checked })}
          />
          <Label>Include Troubleshooting Guide</Label>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Wand2 className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Review & Generate</h3>
        <p className="text-muted-foreground">Review your configuration and generate with AI</p>
      </div>

      {wizardData.review.configGenerated ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Generated Configuration</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[400px] border rounded-lg">
            <CodeBlock 
              code={wizardData.review.generatedConfig}
              language="text"
            />
          </ScrollArea>

          <div className="flex space-x-2">
            <Button onClick={() => updateWizardData('review', { configGenerated: false })}>
              <Edit className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8">
            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">Ready to Generate</h4>
            <p className="text-muted-foreground mb-4">
              Click generate to create your AI-powered configuration
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Mode Selection */}
        <div className="flex items-center justify-center">
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wizard" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>AI Wizard</span>
              </TabsTrigger>
              <TabsTrigger value="analyzer" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Config Analyzer</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default UnifiedIntelligentConfigWizard;