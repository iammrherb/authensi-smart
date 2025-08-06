import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Edit
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useGenerateConfigWithAI } from '@/hooks/useConfigTemplates';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useToast } from '@/hooks/use-toast';
import EnhancedVendorSelector from './EnhancedVendorSelector';

interface OneXerConfigWizardProps {
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

const OneXerConfigWizard: React.FC<OneXerConfigWizardProps> = ({ 
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

  // Wizard state
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
      tags: []
    }
  });

  // Predefined scenarios
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

  const handleGenerateConfiguration = async () => {
    try {
      const selectedVendor = vendors?.find(v => v.id === wizardData.basic.vendor);
      const selectedModel = vendorModels?.find(m => m.id === wizardData.basic.model);
      const scenario = configurationScenarios.find(s => s.id === wizardData.scenario.selectedScenario);

      // Build comprehensive context for AI generation
      const contextData = {
        vendor: selectedVendor?.vendor_name || 'Generic',
        model: selectedModel?.model_name || 'Generic Model',
        firmware: wizardData.basic.firmwareVersion || 'Latest',
        deviceType: wizardData.basic.deviceType,
        scenario: scenario?.name || 'Custom Configuration',
        authMethods: wizardData.scenario.authMethods,
        industry: wizardData.requirements.industry,
        securityLevel: wizardData.requirements.securityLevel,
        compliance: wizardData.scenario.compliance,
        networkSegmentation: wizardData.scenario.networkSegmentation,
        guestAccess: wizardData.scenario.guestAccess,
        requirements: wizardData.requirements.selectedRequirements,
        vlans: wizardData.advanced.vlans,
        radiusServers: wizardData.advanced.radiusServers,
        certificates: wizardData.advanced.certificates,
        policies: wizardData.advanced.policies
      };

      const detailedPrompt = `Generate a comprehensive, production-ready 802.1X configuration for the following specifications:

DEVICE INFORMATION:
- Vendor: ${contextData.vendor}
- Model: ${contextData.model}
- Firmware: ${contextData.firmware}
- Device Type: ${contextData.deviceType}

DEPLOYMENT SCENARIO:
- Configuration Type: ${contextData.scenario}
- Authentication Methods: ${contextData.authMethods.join(', ') || 'EAP-TLS, PEAP'}
- Industry: ${contextData.industry || 'Enterprise'}
- Security Level: ${contextData.securityLevel}
- Compliance Requirements: ${contextData.compliance.join(', ') || 'Best Practices'}

NETWORK REQUIREMENTS:
- Network Segmentation: ${contextData.networkSegmentation ? 'Required' : 'Not Required'}
- Guest Network Access: ${contextData.guestAccess ? 'Required' : 'Not Required'}
- VLANs: ${contextData.vlans.length} configured
- RADIUS Servers: ${contextData.radiusServers.length} configured

SPECIFIC REQUIREMENTS:
${wizardData.requirements.customRequirements.map(req => `- ${req}`).join('\n') || '- Standard enterprise deployment'}

Please provide:
1. Complete device configuration with all necessary commands
2. RADIUS server integration settings
3. Dynamic VLAN assignment configuration
4. Security hardening and best practices
5. Quality of Service (QoS) settings for authentication traffic
6. Monitoring and logging configuration
7. Troubleshooting guide with common issues and solutions
8. Implementation and validation procedures
9. Backup and recovery procedures
10. Maintenance and update procedures

Make this an enterprise-grade, production-ready configuration that follows industry best practices for security, performance, and reliability.`;

      const result = await generateWithAI.mutateAsync({
        vendor: contextData.vendor,
        model: contextData.model,
        firmware: contextData.firmware,
        configType: 'Comprehensive 802.1X Configuration',
        requirements: detailedPrompt
      });

      // Update wizard data with generated configuration
      updateWizardData('review', {
        generatedConfig: result.content,
        configGenerated: true,
        generationContext: contextData
      });

      toast({
        title: "Configuration Generated Successfully",
        description: "Comprehensive 802.1X configuration with best practices and troubleshooting guide has been generated.",
      });

    } catch (error) {
      console.error('Failed to generate configuration:', error);
      toast({
        title: "Configuration Generation Failed",
        description: "Please check your inputs and try again. Ensure all required fields are completed.",
        variant: "destructive",
      });
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

      // Call onSave callback if provided
      if (onSave) {
        onSave({
          ...templateData,
          projectId,
          siteId,
          wizardData
        });
      }

      toast({
        title: "Configuration Saved",
        description: "Your DotXer configuration has been saved successfully.",
      });

    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Step rendering functions
  const renderBasicStep = () => (
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
    </div>
  );

  const renderScenarioStep = () => (
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

            <div className="space-y-2">
              <Label>Compliance Requirements</Label>
              <div className="flex flex-wrap gap-2">
                {['HIPAA', 'PCI-DSS', 'SOX', 'GDPR', 'FISMA', 'ISO 27001'].map(compliance => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <Checkbox 
                      id={compliance}
                      checked={wizardData.scenario.compliance?.includes(compliance)}
                      onCheckedChange={(checked) => {
                        const current = wizardData.scenario.compliance || [];
                        const updated = checked 
                          ? [...current, compliance]
                          : current.filter(c => c !== compliance);
                        updateWizardData('scenario', { compliance: updated });
                      }}
                    />
                    <Label htmlFor={compliance} className="text-sm">{compliance}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRequirementsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Industry & Security</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Industry Vertical</Label>
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
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
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
                  <SelectItem value="low">Low - Basic Security</SelectItem>
                  <SelectItem value="medium">Medium - Standard Security</SelectItem>
                  <SelectItem value="high">High - Enhanced Security</SelectItem>
                  <SelectItem value="critical">Critical - Maximum Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Authentication Methods</h3>
          <div className="grid grid-cols-2 gap-3">
            {['EAP-TLS', 'EAP-TTLS', 'PEAP', 'EAP-FAST', 'EAP-MD5', 'MAC Authentication Bypass', 'Web Authentication', 'Certificate Authentication', 'Smart Card Authentication', 'Pre-Shared Key (PSK)'].map(method => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox 
                  id={method}
                  checked={wizardData.scenario.authMethods?.includes(method)}
                  onCheckedChange={(checked) => {
                    const current = wizardData.scenario.authMethods || [];
                    const updated = checked 
                      ? [...current, method]
                      : current.filter(m => m !== method);
                    updateWizardData('scenario', { authMethods: updated });
                  }}
                />
                <Label htmlFor={method} className="text-sm">{method}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Technical Requirements</h3>
        <ScrollArea className="h-48 border rounded-md p-3">
          <div className="space-y-2">
            {requirements?.filter(req => req.category === 'technical').slice(0, 10).map(requirement => (
              <div key={requirement.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={requirement.id}
                  checked={wizardData.requirements.selectedRequirements?.includes(requirement.id)}
                  onCheckedChange={(checked) => {
                    const current = wizardData.requirements.selectedRequirements || [];
                    const updated = checked 
                      ? [...current, requirement.id]
                      : current.filter(id => id !== requirement.id);
                    updateWizardData('requirements', { selectedRequirements: updated });
                  }}
                />
                <Label htmlFor={requirement.id} className="text-sm">
                  {requirement.title}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderAdvancedStep = () => (
    <div className="space-y-6">
      <Tabs defaultValue="vlans" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vlans">VLANs</TabsTrigger>
          <TabsTrigger value="radius">RADIUS</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>

        <TabsContent value="vlans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">VLAN Configuration</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add VLAN
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              <Input placeholder="VLAN ID" type="number" />
              <Input placeholder="VLAN Name" />
              <Input placeholder="Subnet (e.g., 192.168.10.0/24)" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data Network</SelectItem>
                  <SelectItem value="voice">Voice/VoIP</SelectItem>
                  <SelectItem value="guest">Guest Access</SelectItem>
                  <SelectItem value="iot">IoT Devices</SelectItem>
                  <SelectItem value="quarantine">Quarantine</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="server">Server Network</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Security Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Access</SelectItem>
                  <SelectItem value="authenticated">Authenticated Only</SelectItem>
                  <SelectItem value="restricted">Restricted Access</SelectItem>
                  <SelectItem value="isolated">Isolated Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="dhcp-enabled" />
                <Label htmlFor="dhcp-enabled">DHCP Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="inter-vlan-routing" />
                <Label htmlFor="inter-vlan-routing">Inter-VLAN Routing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="acl-required" />
                <Label htmlFor="acl-required">ACL Required</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="radius" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">RADIUS Servers</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Input placeholder="Server IP/FQDN" />
              <Input placeholder="Shared Secret" type="password" />
              <Input placeholder="Auth Port" type="number" defaultValue="1812" />
              <Input placeholder="Acct Port" type="number" defaultValue="1813" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Server Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Authentication</SelectItem>
                  <SelectItem value="secondary">Secondary Authentication</SelectItem>
                  <SelectItem value="accounting">Accounting Only</SelectItem>
                  <SelectItem value="both">Authentication & Accounting</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Timeout (sec)" type="number" defaultValue="5" />
              <Input placeholder="Retries" type="number" defaultValue="3" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Authentication Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pap">PAP</SelectItem>
                  <SelectItem value="chap">CHAP</SelectItem>
                  <SelectItem value="mschap">MS-CHAP</SelectItem>
                  <SelectItem value="mschapv2">MS-CHAPv2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="dead-time" />
                <Label htmlFor="dead-time">Enable Dead Time (120s)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="coa-enabled" />
                <Label htmlFor="coa-enabled">Change of Authorization (CoA)</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reference Templates</h3>
            <div className="grid grid-cols-1 gap-3">
              {templates?.filter(t => t.vendor_id === wizardData.basic.vendor).slice(0, 5).map(template => (
                <Card key={template.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Checkbox />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Variables</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Variable Name" />
              <Input placeholder="Variable Value" />
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">{wizardData.basic.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Vendor:</span>
              <span className="text-sm font-medium">
                {vendors?.find(v => v.id === wizardData.basic.vendor)?.vendor_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Scenario:</span>
              <span className="text-sm font-medium">
                {configurationScenarios.find(s => s.id === wizardData.scenario.selectedScenario)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Industry:</span>
              <span className="text-sm font-medium">{wizardData.requirements.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Security Level:</span>
              <span className="text-sm font-medium">{wizardData.requirements.securityLevel}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generation Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="generateAI">Generate with AI</Label>
              <Switch 
                id="generateAI"
                checked={wizardData.review.generateWithAI}
                onCheckedChange={(checked) => updateWizardData('review', { generateWithAI: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="saveTemplate">Save as Template</Label>
              <Switch 
                id="saveTemplate"
                checked={wizardData.review.saveAsTemplate}
                onCheckedChange={(checked) => updateWizardData('review', { saveAsTemplate: checked })}
              />
            </div>
            {projectId && (
              <div className="flex items-center justify-between">
                <Label htmlFor="associateProject">Associate with Project</Label>
                <Switch 
                  id="associateProject"
                  checked={wizardData.review.associateProject}
                  onCheckedChange={(checked) => updateWizardData('review', { associateProject: checked })}
                />
              </div>
            )}
            {siteId && (
              <div className="flex items-center justify-between">
                <Label htmlFor="associateSite">Associate with Site</Label>
                <Switch 
                  id="associateSite"
                  checked={wizardData.review.associateSite}
                  onCheckedChange={(checked) => updateWizardData('review', { associateSite: checked })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {wizardData.review.configGenerated && wizardData.review.generatedConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Generated Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {wizardData.review.generatedConfig}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This configuration will be generated based on your selections and can be further customized after creation.
          AI recommendations will include vendor-specific best practices and compliance requirements.
        </AlertDescription>
      </Alert>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case 'basic': return renderBasicStep();
      case 'scenario': return renderScenarioStep();
      case 'requirements': return renderRequirementsStep();
      case 'advanced': return renderAdvancedStep();
      case 'review': return renderReviewStep();
      default: return <div>Step not found</div>;
    }
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return wizardData.basic.name && wizardData.basic.vendor;
      case 1: return wizardData.scenario.selectedScenario;
      case 2: return wizardData.requirements.industry && wizardData.requirements.securityLevel;
      case 3: return true; // Advanced step is optional
      case 4: return true; // Review step
      default: return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Wand2 className="h-8 w-8 text-primary" />
          DotXer Config Gen
        </h1>
        <p className="text-muted-foreground">
          Generate comprehensive 802.1X configurations with AI-powered recommendations and industry best practices
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {wizardSteps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isValid = isStepValid(index);
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-2">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                isActive 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : isValid
                      ? 'border-muted-foreground bg-muted text-muted-foreground'
                      : 'border-muted bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
              </div>
              {index < wizardSteps.length - 1 && (
                <div className="absolute mt-6 ml-16">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(wizardSteps[currentStep].icon, { className: "h-5 w-5" })}
            {wizardSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getCurrentStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === wizardSteps.length - 1 ? (
            <>
              {!wizardData.review.configGenerated && (
                <Button 
                  onClick={handleGenerateConfiguration}
                  disabled={generateWithAI.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {generateWithAI.isPending ? 'Generating...' : 'Generate Configuration'}
                </Button>
              )}
              <Button 
                onClick={handleSaveConfiguration}
                disabled={!wizardData.review.configGenerated || createTemplate.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createTemplate.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel Wizard
          </Button>
        </div>
      )}
    </div>
  );
};

export default OneXerConfigWizard;