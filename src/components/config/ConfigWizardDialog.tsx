import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ChevronRight,
  ChevronLeft,
  Bot,
  Zap,
  Target,
  Code,
  Check,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useGenerateConfigWithAI } from '@/hooks/useConfigTemplates';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useToast } from '@/hooks/use-toast';

interface ConfigWizardDialogProps {
  projectId?: string;
  siteId?: string;
  onComplete?: (config: any) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
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

const ConfigWizardDialog: React.FC<ConfigWizardDialogProps> = ({
  projectId,
  siteId,
  onComplete,
  onCancel,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: templates } = useConfigTemplates();
  const { data: vendors } = useEnhancedVendors();
  const { data: vendorModels } = useVendorModels();
  const { data: useCases } = useUseCases();
  const { data: requirements } = useRequirements();
  const createTemplate = useCreateConfigTemplate();
  const generateWithAI = useGenerateConfigWithAI();
  const { toast } = useToast();

  const [wizardData, setWizardData] = useState<any>({
    basic: {
      name: '',
      description: '',
      vendor: '',
      model: '',
      firmwareVersion: '',
      deviceType: 'switch'
    },
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
    review: {
      generateWithAI: true,
      saveAsTemplate: true,
      associateProject: !!projectId,
      associateSite: !!siteId,
      tags: [],
      generatedConfig: '',
      configGenerated: false
    }
  });

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
    { id: 'basic', title: 'Basic Information', icon: Database, description: 'Device and vendor details' },
    { id: 'scenario', title: 'Configuration Scenario', icon: Target, description: 'Choose your use case' },
    { id: 'requirements', title: 'Requirements & Security', icon: FileText, description: 'Security and compliance' },
    { id: 'advanced', title: 'Advanced Settings', icon: Settings, description: 'VLANs and policies' },
    { id: 'review', title: 'Review & Generate', icon: Wand2, description: 'Generate configuration' }
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

  const handleGenerateConfiguration = async () => {
    setIsGenerating(true);
    try {
      const selectedVendor = vendors?.find(v => v.id === wizardData.basic.vendor);
      const selectedModel = vendorModels?.find(m => m.id === wizardData.basic.model);
      const scenario = configurationScenarios.find(s => s.id === wizardData.scenario.selectedScenario);

      const prompt = `Generate a comprehensive 802.1X configuration for:
        Vendor: ${selectedVendor?.vendor_name}
        Model: ${selectedModel?.model_name || 'Generic'}
        Firmware: ${wizardData.basic.firmwareVersion || 'Latest'}
        Scenario: ${scenario?.name}
        Authentication Methods: ${wizardData.scenario.authMethods.join(', ')}
        Industry: ${wizardData.requirements.industry}
        Security Level: ${wizardData.requirements.securityLevel}
        Compliance: ${wizardData.scenario.compliance.join(', ')}
        Requirements: ${wizardData.requirements.selectedRequirements.length} specific requirements
        ${wizardData.scenario.networkSegmentation ? 'Include network segmentation' : ''}
        ${wizardData.scenario.guestAccess ? 'Include guest network configuration' : ''}
        
        Please include:
        - Complete switch configuration
        - RADIUS server settings
        - VLAN configurations
        - Security policies
        - Best practices comments
        - Troubleshooting commands`;

      const result = await generateWithAI.mutateAsync({
        vendor: selectedVendor?.vendor_name || '',
        model: selectedModel?.model_name || '',
        configType: '802.1X',
        requirements: prompt
      });

      updateWizardData('review', {
        generatedConfig: result.content,
        configGenerated: true
      });

      toast({
        title: "Configuration Generated",
        description: "AI has generated your 802.1X configuration successfully.",
      });

    } catch (error) {
      console.error('Failed to generate configuration:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      const selectedVendor = vendors?.find(v => v.id === wizardData.basic.vendor);
      const scenario = configurationScenarios.find(s => s.id === wizardData.scenario.selectedScenario);
      
      const templateData = {
        name: wizardData.basic.name || `${selectedVendor?.vendor_name} ${scenario?.name}`,
        description: wizardData.basic.description || scenario?.description,
        vendor_id: wizardData.basic.vendor,
        model_id: wizardData.basic.model || undefined,
        category: '802.1X',
        subcategory: scenario?.category,
        configuration_type: wizardData.basic.deviceType,
        complexity_level: scenario?.complexity || 'intermediate',
        template_content: wizardData.review.generatedConfig,
        template_variables: wizardData.advanced.customVariables,
        supported_scenarios: [wizardData.scenario.selectedScenario],
        authentication_methods: wizardData.scenario.authMethods,
        required_features: [],
        network_requirements: {
          vlans: wizardData.advanced.vlans,
          radiusServers: wizardData.advanced.radiusServers
        },
        security_features: wizardData.scenario.compliance,
        best_practices: [],
        troubleshooting_guide: [],
        validation_commands: [],
        tags: [...(wizardData.review.tags || []), 'wizard-generated', '802.1x'],
        is_public: true,
        is_validated: false
      };

      if (wizardData.review.saveAsTemplate) {
        await createTemplate.mutateAsync(templateData);
      }

      if (onComplete) {
        onComplete({
          ...templateData,
          projectId,
          siteId,
          wizardData
        });
      }

      toast({
        title: "Configuration Saved",
        description: "Your 802.1X configuration has been saved successfully.",
      });

      setIsOpen(false);

    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wizardData.review.generatedConfig);
    toast({
      title: "Configuration Copied",
      description: "Configuration has been copied to clipboard.",
    });
  };

  const downloadConfig = () => {
    const element = document.createElement('a');
    const file = new Blob([wizardData.review.generatedConfig], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${wizardData.basic.name || 'config'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Configuration Name</Label>
                <Input
                  value={wizardData.basic.name}
                  onChange={(e) => updateWizardData('basic', { name: e.target.value })}
                  placeholder="e.g., Production 802.1X Config"
                />
              </div>
              <div className="space-y-2">
                <Label>Device Type</Label>
                <Select
                  value={wizardData.basic.deviceType}
                  onValueChange={(value) => updateWizardData('basic', { deviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="switch">Switch</SelectItem>
                    <SelectItem value="router">Router</SelectItem>
                    <SelectItem value="firewall">Firewall</SelectItem>
                    <SelectItem value="wireless">Wireless Controller</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Select
                  value={wizardData.basic.vendor}
                  onValueChange={(value) => updateWizardData('basic', { vendor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors?.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Model (Optional)</Label>
                <Select
                  value={wizardData.basic.model}
                  onValueChange={(value) => updateWizardData('basic', { model: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorModels?.filter(m => !wizardData.basic.vendor || m.vendor_id === wizardData.basic.vendor).map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.model_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Firmware Version (Optional)</Label>
              <Input
                value={wizardData.basic.firmwareVersion}
                onChange={(e) => updateWizardData('basic', { firmwareVersion: e.target.value })}
                placeholder="e.g., 16.12.04, 15.2(4)S7"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Configuration Scenario</h3>
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
                      <p className="text-sm text-muted-foreground">
                        {scenario.description}
                      </p>
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

            {wizardData.scenario.selectedScenario && (
              <div className="space-y-4">
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Additional Options</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="networkSegmentation"
                        checked={wizardData.scenario.networkSegmentation}
                        onCheckedChange={(checked) => updateWizardData('scenario', { networkSegmentation: checked })}
                      />
                      <Label htmlFor="networkSegmentation">Network Segmentation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="guestAccess"
                        checked={wizardData.scenario.guestAccess}
                        onCheckedChange={(checked) => updateWizardData('scenario', { guestAccess: checked })}
                      />
                      <Label htmlFor="guestAccess">Guest Network Access</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={wizardData.requirements.industry}
                  onValueChange={(value) => updateWizardData('requirements', { industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Security Level</Label>
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

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Security requirements will be automatically determined based on your industry and security level selections.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Advanced settings will be automatically configured based on your scenario and requirements. 
                Manual configuration is available after generation.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="generateWithAI"
                  checked={wizardData.review.generateWithAI}
                  onCheckedChange={(checked) => updateWizardData('review', { generateWithAI: checked })}
                />
                <Label htmlFor="generateWithAI">Generate with AI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="saveAsTemplate"
                  checked={wizardData.review.saveAsTemplate}
                  onCheckedChange={(checked) => updateWizardData('review', { saveAsTemplate: checked })}
                />
                <Label htmlFor="saveAsTemplate">Save as Template</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="associateProject"
                  checked={wizardData.review.associateProject}
                  onCheckedChange={(checked) => updateWizardData('review', { associateProject: checked })}
                  disabled={!projectId}
                />
                <Label htmlFor="associateProject">Associate with Project</Label>
              </div>
            </div>

            {!wizardData.review.configGenerated ? (
              <div className="text-center space-y-4">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Generate Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    Click the button below to generate your AI-powered 802.1X configuration
                  </p>
                  <Button 
                    onClick={handleGenerateConfiguration}
                    disabled={isGenerating}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Configuration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Configuration</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadConfig}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-64 w-full border rounded-md">
                  <pre className="p-4 text-sm">
                    <code>{wizardData.review.generatedConfig}</code>
                  </pre>
                </ScrollArea>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return wizardData.basic.name && wizardData.basic.vendor;
      case 1:
        return wizardData.scenario.selectedScenario;
      case 2:
        return wizardData.requirements.industry && wizardData.requirements.securityLevel;
      case 3:
        return true;
      case 4:
        return wizardData.review.configGenerated;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary hover:opacity-90">
            <Wand2 className="h-4 w-4 mr-2" />
            Launch Configuration Wizard
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Configuration Wizard
          </DialogTitle>
          <DialogDescription>
            Generate intelligent 802.1X configurations with AI-powered recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">
                Step {currentStep + 1} of {wizardSteps.length}: {wizardSteps[currentStep]?.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(((currentStep + 1) / wizardSteps.length) * 100)}% Complete
              </div>
            </div>
            <Progress value={((currentStep + 1) / wizardSteps.length) * 100} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mb-6">
            {wizardSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-xs text-center">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="mb-6" />

          {/* Step Content */}
          <ScrollArea className="flex-1 pr-4">
            <div className="min-h-96">
              {renderStepContent()}
            </div>
          </ScrollArea>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onCancel?.();
              }}
            >
              Cancel
            </Button>

            {currentStep === wizardSteps.length - 1 ? (
              <Button
                onClick={handleSaveConfiguration}
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigWizardDialog;