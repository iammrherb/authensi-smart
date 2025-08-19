import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Network, 
  Database, 
  Target,
  Brain,
  Settings,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';

interface ConfigWizardStepsProps {
  currentStep: number;
  wizardData: any;
  updateWizardData: (step: string, data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;
  configurationScenarios: any[];
}

const ConfigWizardSteps: React.FC<ConfigWizardStepsProps> = ({
  currentStep,
  wizardData,
  updateWizardData,
  nextStep,
  prevStep,
  canProceed,
  configurationScenarios
}) => {
  const { data: vendors } = useEnhancedVendors();
  const { data: vendorModels } = useVendorModels();
  const { data: useCases } = useUseCases();
  const { data: requirements } = useRequirements();

  const filteredModels = vendorModels?.filter(model => 
    model.vendor_id === wizardData.basic.vendor
  ) || [];

  const renderBasicStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Basic Device Information
        </CardTitle>
        <CardDescription>
          Configure the fundamental device settings and identification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="config-name">Configuration Name</Label>
            <Input
              id="config-name"
              placeholder="e.g., Corporate 802.1X Config"
              value={wizardData.basic.name}
              onChange={(e) => updateWizardData('basic', { name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select 
              value={wizardData.basic.deviceType}
              onValueChange={(value) => updateWizardData('basic', { deviceType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="switch">Network Switch</SelectItem>
                <SelectItem value="router">Router</SelectItem>
                <SelectItem value="wireless">Wireless Controller</SelectItem>
                <SelectItem value="firewall">Firewall</SelectItem>
                <SelectItem value="access-point">Access Point</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Select 
              value={wizardData.basic.vendor}
              onValueChange={(value) => updateWizardData('basic', { vendor: value, model: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors?.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select 
              value={wizardData.basic.model}
              onValueChange={(value) => updateWizardData('basic', { model: value })}
              disabled={!wizardData.basic.vendor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the configuration purpose and environment"
            value={wizardData.basic.description}
            onChange={(e) => updateWizardData('basic', { description: e.target.value })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderScenarioStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Configuration Scenario
        </CardTitle>
        <CardDescription>
          Choose a pre-defined scenario or create a custom configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configurationScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                wizardData.scenario.selectedScenario === scenario.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateWizardData('scenario', { 
                selectedScenario: scenario.id,
                authMethods: scenario.authMethods,
                compliance: scenario.compliance
              })}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{scenario.name}</h4>
                  <Badge variant={scenario.complexity === 'basic' ? 'secondary' : scenario.complexity === 'expert' ? 'destructive' : 'default'}>
                    {scenario.complexity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.authMethods.slice(0, 2).map((method) => (
                    <Badge key={method} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {wizardData.scenario.selectedScenario && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Additional Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="network-segmentation"
                  checked={wizardData.scenario.networkSegmentation}
                  onCheckedChange={(checked) => updateWizardData('scenario', { networkSegmentation: checked })}
                />
                <Label htmlFor="network-segmentation" className="text-sm">Network Segmentation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guest-access"
                  checked={wizardData.scenario.guestAccess}
                  onCheckedChange={(checked) => updateWizardData('scenario', { guestAccess: checked })}
                />
                <Label htmlFor="guest-access" className="text-sm">Guest Network Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="custom-scenario"
                  checked={wizardData.scenario.customScenario}
                  onCheckedChange={(checked) => updateWizardData('scenario', { customScenario: checked })}
                />
                <Label htmlFor="custom-scenario" className="text-sm">Custom Requirements</Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRequirementsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security & Requirements
        </CardTitle>
        <CardDescription>
          Define security requirements and compliance standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry/Environment</Label>
            <Select 
              value={wizardData.requirements.industry}
              onValueChange={(value) => updateWizardData('requirements', { industry: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="financial">Financial Services</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="enterprise">General Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="security-level">Security Level</Label>
            <Select 
              value={wizardData.requirements.securityLevel}
              onValueChange={(value) => updateWizardData('requirements', { securityLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select security level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Security</SelectItem>
                <SelectItem value="medium">Standard Security</SelectItem>
                <SelectItem value="high">High Security</SelectItem>
                <SelectItem value="maximum">Maximum Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {requirements && requirements.length > 0 && (
          <div className="space-y-4">
            <Label>Select Applicable Requirements</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {requirements.slice(0, 10).map((req) => (
                <div key={req.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`req-${req.id}`}
                    checked={wizardData.requirements.selectedRequirements.includes(req.id)}
                    onCheckedChange={(checked) => {
                      const current = wizardData.requirements.selectedRequirements;
                      const updated = checked 
                        ? [...current, req.id]
                        : current.filter((id: string) => id !== req.id);
                      updateWizardData('requirements', { selectedRequirements: updated });
                    }}
                  />
                  <Label htmlFor={`req-${req.id}`} className="text-sm">
                    {req.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAIStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Configuration
        </CardTitle>
        <CardDescription>
          Configure AI-powered generation settings for enhanced results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">AI Provider</Label>
            <Select 
              value={wizardData.ai.provider}
              onValueChange={(value) => updateWizardData('ai', { provider: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai-model">AI Model</Label>
            <Select 
              value={wizardData.ai.model}
              onValueChange={(value) => updateWizardData('ai', { model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5-2025-08-07">GPT-5 (Latest)</SelectItem>
                <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Reliable)</SelectItem>
                <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini (Fast)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>AI Enhancement Options</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="font-medium">Enhanced Prompts</Label>
                <p className="text-sm text-muted-foreground">Use advanced prompt engineering</p>
              </div>
              <Switch
                checked={wizardData.ai.useEnhancedPrompts}
                onCheckedChange={(checked) => updateWizardData('ai', { useEnhancedPrompts: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="font-medium">Include Validation</Label>
                <p className="text-sm text-muted-foreground">Add configuration validation</p>
              </div>
              <Switch
                checked={wizardData.ai.includeValidation}
                onCheckedChange={(checked) => updateWizardData('ai', { includeValidation: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="font-medium">Troubleshooting Guide</Label>
                <p className="text-sm text-muted-foreground">Include troubleshooting steps</p>
              </div>
              <Switch
                checked={wizardData.ai.includeTroubleshooting}
                onCheckedChange={(checked) => updateWizardData('ai', { includeTroubleshooting: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const stepComponents = [
    renderBasicStep,
    renderScenarioStep,
    renderRequirementsStep,
    () => <div>Advanced Settings Coming Soon</div>,
    renderAIStep,
    () => <div>Review & Generate Coming Soon</div>
  ];

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Step {currentStep + 1} of {stepComponents.length}</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentStep + 1) / stepComponents.length) * 100)}% Complete
          </span>
        </div>
        <Progress value={((currentStep + 1) / stepComponents.length) * 100} className="h-2" />
      </div>

      {/* Current step content */}
      {stepComponents[currentStep]()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={!canProceed() || currentStep === stepComponents.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConfigWizardSteps;