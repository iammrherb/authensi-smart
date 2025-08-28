import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, Wand2, Code, Download, Copy, Check, AlertCircle, 
  Info, Shield, Network, Cloud, Server, Cpu, HardDrive,
  Lock, Key, Users, Building, Globe, Zap, Database,
  FileText, GitBranch, Package, Terminal, BookOpen,
  ChevronRight, ChevronLeft, Sparkles, Brain, Target,
  CheckCircle, XCircle, AlertTriangle, Layers, Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// import { create_diagram } from '@/components/ui/diagram';

interface ConfigurationWizardProps {
  onComplete?: (config: GeneratedConfiguration) => void;
}

interface GeneratedConfiguration {
  vendor: string;
  model: string;
  firmware: string;
  template: string;
  sections: ConfigSection[];
  validation: ValidationResult;
  deployment: DeploymentPlan;
}

interface ConfigSection {
  name: string;
  description: string;
  config: string;
  variables: Variable[];
  dependencies: string[];
  validation: string[];
}

interface Variable {
  name: string;
  value: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  validation?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface DeploymentPlan {
  steps: DeploymentStep[];
  estimatedTime: number;
  rollbackPlan: string;
  testScenarios: TestScenario[];
}

interface DeploymentStep {
  order: number;
  description: string;
  commands: string[];
  validation: string;
  estimatedTime: number;
}

interface TestScenario {
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
}

const UltimateConfigurationWizard: React.FC<ConfigurationWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFirmware, setSelectedFirmware] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [deploymentSize, setDeploymentSize] = useState('medium');
  const [industryVertical, setIndustryVertical] = useState('');
  const [complianceRequirements, setComplianceRequirements] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [advancedSettings, setAdvancedSettings] = useState<any>({});
  const [generatedConfig, setGeneratedConfig] = useState<GeneratedConfiguration | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  // Fetch vendor data
  const [vendors, setVendors] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [firmwares, setFirmwares] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      loadModels(selectedVendor);
      loadFeatures(selectedVendor);
      loadTemplates(selectedVendor);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (selectedModel) {
      loadFirmwares(selectedModel);
    }
  }, [selectedModel]);

  const loadVendors = async () => {
    const { data } = await supabase
      .from('vendor_library')
      .select('*')
      .order('vendor_name');
    setVendors(data || []);
  };

  const loadModels = async (vendorId: string) => {
    const { data } = await supabase
      .from('vendor_models')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('model_name');
    setModels(data || []);
  };

  const loadFirmwares = async (modelId: string) => {
    const { data } = await supabase
      .from('vendor_firmware')
      .select('*')
      .eq('model_id', modelId)
      .order('version', { ascending: false });
    setFirmwares(data || []);
  };

  const loadFeatures = async (vendorId: string) => {
    const { data } = await supabase
      .from('vendor_features')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('feature_category, feature_name');
    setFeatures(data || []);
  };

  const loadTemplates = async (vendorId: string) => {
    const { data } = await supabase
      .from('vendor_config_templates')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('template_name');
    setTemplates(data || []);
  };

  // Generate AI-powered configuration
  const generateConfiguration = async () => {
    setIsGenerating(true);
    
    try {
      // Build context for AI generation
      const context = {
        vendor: vendors.find(v => v.id === selectedVendor),
        model: models.find(m => m.id === selectedModel),
        firmware: firmwares.find(f => f.id === selectedFirmware),
        template: templates.find(t => t.id === selectedTemplate),
        features: features.filter(f => selectedFeatures.includes(f.id)),
        deployment: {
          size: deploymentSize,
          industry: industryVertical,
          compliance: complianceRequirements
        },
        advanced: advancedSettings
      };

      // Generate configuration using AI
      const config = await generateAIConfiguration(context);
      
      // Validate configuration
      const validation = await validateConfiguration(config);
      
      // Generate deployment plan
      const deployment = await generateDeploymentPlan(config, context);
      
      const result: GeneratedConfiguration = {
        vendor: context.vendor?.vendor_name || '',
        model: context.model?.model_name || '',
        firmware: context.firmware?.version || '',
        template: context.template?.template_name || '',
        sections: config.sections,
        validation,
        deployment
      };
      
      setGeneratedConfig(result);
      setValidationResults(validation);
      
      toast({
        title: "Configuration Generated",
        description: "Your custom configuration has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // AI configuration generation
  const generateAIConfiguration = async (context: any): Promise<{ sections: ConfigSection[] }> => {
    // This would call an AI service to generate the configuration
    // For now, returning a comprehensive template
    
    const sections: ConfigSection[] = [];
    
    // Base configuration section
    sections.push({
      name: 'Base Configuration',
      description: 'Core system configuration',
      config: generateBaseConfig(context),
      variables: [
        {
          name: 'HOSTNAME',
          value: '',
          type: 'string',
          required: true,
          description: 'Device hostname'
        },
        {
          name: 'MGMT_IP',
          value: '',
          type: 'ip',
          required: true,
          description: 'Management IP address'
        }
      ],
      dependencies: [],
      validation: ['Hostname must be unique', 'Management IP must be reachable']
    });

    // Authentication configuration
    if (selectedFeatures.some(f => features.find(feat => feat.id === f)?.feature_category === 'authentication')) {
      sections.push({
        name: 'Authentication Configuration',
        description: '802.1X and authentication settings',
        config: generateAuthConfig(context),
        variables: [
          {
            name: 'RADIUS_SERVER',
            value: '',
            type: 'ip',
            required: true,
            description: 'RADIUS server IP address'
          },
          {
            name: 'RADIUS_KEY',
            value: '',
            type: 'password',
            required: true,
            description: 'RADIUS shared secret'
          }
        ],
        dependencies: ['Base Configuration'],
        validation: ['RADIUS server must be reachable', 'Shared secret must be configured on both ends']
      });
    }

    // Network segmentation
    if (selectedFeatures.some(f => features.find(feat => feat.id === f)?.feature_name?.includes('Segmentation'))) {
      sections.push({
        name: 'Network Segmentation',
        description: 'VLAN and segmentation policies',
        config: generateSegmentationConfig(context),
        variables: [
          {
            name: 'CORP_VLAN',
            value: '10',
            type: 'number',
            required: true,
            description: 'Corporate VLAN ID'
          },
          {
            name: 'GUEST_VLAN',
            value: '20',
            type: 'number',
            required: true,
            description: 'Guest VLAN ID'
          },
          {
            name: 'IOT_VLAN',
            value: '30',
            type: 'number',
            required: true,
            description: 'IoT VLAN ID'
          }
        ],
        dependencies: ['Base Configuration'],
        validation: ['VLAN IDs must be unique', 'VLANs must be configured on upstream switches']
      });
    }

    // Compliance-specific configuration
    if (complianceRequirements.length > 0) {
      sections.push({
        name: 'Compliance Configuration',
        description: `Configuration for ${complianceRequirements.join(', ')} compliance`,
        config: generateComplianceConfig(context),
        variables: [
          {
            name: 'LOG_SERVER',
            value: '',
            type: 'ip',
            required: true,
            description: 'Syslog server for compliance logging'
          },
          {
            name: 'RETENTION_DAYS',
            value: '90',
            type: 'number',
            required: true,
            description: 'Log retention period in days'
          }
        ],
        dependencies: ['Base Configuration'],
        validation: ['Logging must be enabled', 'Time synchronization required']
      });
    }

    return { sections };
  };

  // Generate base configuration
  const generateBaseConfig = (context: any): string => {
    const vendor = context.vendor?.vendor_name;
    
    if (vendor === 'Cisco') {
      return `! Cisco Base Configuration
hostname {{HOSTNAME}}
!
interface GigabitEthernet0/0
 description Management Interface
 ip address {{MGMT_IP}} 255.255.255.0
 no shutdown
!
ip domain-name company.local
crypto key generate rsa modulus 2048
!
username admin privilege 15 secret 0 {{ADMIN_PASSWORD}}
!
line vty 0 15
 login local
 transport input ssh
!
ntp server {{NTP_SERVER}}
clock timezone EST -5
!
logging buffered 100000
logging console warnings
!`;
    }
    
    if (vendor === 'Aruba') {
      return `# Aruba Base Configuration
hostname {{HOSTNAME}}
!
vlan 1
 name Management
 ip address {{MGMT_IP}}/24
!
ssh server enable
https-server enable
!
mgmt-user admin {{ADMIN_PASSWORD}}
!
ntp server {{NTP_SERVER}}
clock timezone EST -5
!
logging {{LOG_SERVER}}
logging level warnings
!`;
    }
    
    return '# Configuration template for ' + vendor;
  };

  // Generate authentication configuration
  const generateAuthConfig = (context: any): string => {
    const vendor = context.vendor?.vendor_name;
    
    if (vendor === 'Cisco') {
      return `! Cisco 802.1X Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
!
radius server {{RADIUS_NAME}}
 address ipv4 {{RADIUS_SERVER}} auth-port 1812 acct-port 1813
 key {{RADIUS_KEY}}
!
radius-server dead-criteria time 5 tries 3
radius-server deadtime 5
!
dot1x system-auth-control
!
interface range GigabitEthernet1/0/1-48
 switchport mode access
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
!`;
    }
    
    return '# Authentication configuration';
  };

  // Generate segmentation configuration
  const generateSegmentationConfig = (context: any): string => {
    return `! Network Segmentation Configuration
vlan {{CORP_VLAN}}
 name Corporate
!
vlan {{GUEST_VLAN}}
 name Guest
!
vlan {{IOT_VLAN}}
 name IoT_Devices
!
! Dynamic VLAN Assignment via RADIUS
! Ensure RADIUS server returns appropriate VLAN attributes
!`;
  };

  // Generate compliance configuration
  const generateComplianceConfig = (context: any): string => {
    const compliance = complianceRequirements.join(', ');
    
    return `! Compliance Configuration for ${compliance}
logging host {{LOG_SERVER}}
logging trap informational
logging source-interface GigabitEthernet0/0
!
archive
 log config
  logging enable
  logging size 1000
  notify syslog contenttype plaintext
!
! Enable command accounting
aaa accounting commands 15 default start-stop group tacacs+
!
! Password complexity requirements
security passwords min-length 12
security passwords complexity enable
!
! Session timeout
line vty 0 15
 exec-timeout 15 0
!`;
  };

  // Validate configuration
  const validateConfiguration = async (config: any): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Check for required variables
    config.sections.forEach((section: ConfigSection) => {
      section.variables.forEach(variable => {
        if (variable.required && !variable.value) {
          errors.push(`Missing required variable: ${variable.name} in ${section.name}`);
        }
      });
    });
    
    // Check dependencies
    config.sections.forEach((section: ConfigSection) => {
      section.dependencies.forEach(dep => {
        if (!config.sections.find((s: ConfigSection) => s.name === dep)) {
          errors.push(`Missing dependency: ${dep} for ${section.name}`);
        }
      });
    });
    
    // Add warnings
    if (!selectedFirmware) {
      warnings.push('No firmware version specified - using default');
    }
    
    // Add recommendations
    recommendations.push('Test configuration in lab environment first');
    recommendations.push('Create backup before applying configuration');
    recommendations.push('Schedule maintenance window for deployment');
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  };

  // Generate deployment plan
  const generateDeploymentPlan = async (config: any, context: any): Promise<DeploymentPlan> => {
    const steps: DeploymentStep[] = [];
    let totalTime = 0;
    
    // Pre-deployment steps
    steps.push({
      order: 1,
      description: 'Backup current configuration',
      commands: ['copy running-config backup-config', 'show running-config'],
      validation: 'Verify backup file exists',
      estimatedTime: 5
    });
    totalTime += 5;
    
    // Apply each configuration section
    config.sections.forEach((section: ConfigSection, index: number) => {
      steps.push({
        order: index + 2,
        description: `Apply ${section.name}`,
        commands: section.config.split('\n').filter(line => line.trim()),
        validation: section.validation.join(', '),
        estimatedTime: 10
      });
      totalTime += 10;
    });
    
    // Post-deployment steps
    steps.push({
      order: steps.length + 1,
      description: 'Save configuration',
      commands: ['write memory', 'copy running-config startup-config'],
      validation: 'Configuration saved successfully',
      estimatedTime: 5
    });
    totalTime += 5;
    
    // Test scenarios
    const testScenarios: TestScenario[] = [
      {
        name: 'Authentication Test',
        description: 'Verify 802.1X authentication works',
        steps: [
          'Connect test device to network port',
          'Provide valid credentials',
          'Verify correct VLAN assignment',
          'Check RADIUS logs'
        ],
        expectedResult: 'Device authenticated and placed in correct VLAN'
      },
      {
        name: 'Guest Access Test',
        description: 'Verify guest portal functionality',
        steps: [
          'Connect to guest network',
          'Navigate to captive portal',
          'Complete registration',
          'Verify internet access'
        ],
        expectedResult: 'Guest user can access internet with restrictions'
      },
      {
        name: 'Failover Test',
        description: 'Test RADIUS server failover',
        steps: [
          'Disable primary RADIUS server',
          'Attempt authentication',
          'Verify failover to secondary',
          'Re-enable primary server'
        ],
        expectedResult: 'Authentication continues with secondary server'
      }
    ];
    
    return {
      steps,
      estimatedTime: totalTime,
      rollbackPlan: 'copy backup-config running-config',
      testScenarios
    };
  };

  // Export configuration
  const exportConfiguration = () => {
    if (!generatedConfig) return;
    
    const configText = generatedConfig.sections
      .map(section => `! ${section.name}\n${section.config}`)
      .join('\n\n');
    
    const blob = new Blob([configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedConfig.vendor}_${generatedConfig.model}_config.txt`;
    a.click();
    
    toast({
      title: "Configuration Exported",
      description: "Configuration file downloaded successfully",
    });
  };

  // Copy configuration to clipboard
  const copyConfiguration = () => {
    if (!generatedConfig) return;
    
    const configText = generatedConfig.sections
      .map(section => `! ${section.name}\n${section.config}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(configText);
    
    toast({
      title: "Copied to Clipboard",
      description: "Configuration copied to clipboard",
    });
  };

  const steps = [
    { title: 'Vendor Selection', icon: Building },
    { title: 'Model & Firmware', icon: Cpu },
    { title: 'Features', icon: Package },
    { title: 'Requirements', icon: Shield },
    { title: 'Advanced Settings', icon: Settings },
    { title: 'Review & Generate', icon: Wand2 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                Ultimate Configuration Wizard
              </CardTitle>
              <CardDescription className="mt-2">
                AI-powered, vendor-specific configuration generator with compliance and best practices
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Enhanced
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-0.5 mx-2 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="font-medium">{steps[currentStep].title}</p>
          </div>
        </CardContent>
      </Card>

      {/* Wizard Content */}
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label>Select Vendor</Label>
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {vendor.vendor_name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedVendor && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {vendors.find(v => v.id === selectedVendor)?.description}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label>Select Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div>
                          <p className="font-medium">{model.model_name}</p>
                          <p className="text-xs text-muted-foreground">{model.product_line}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedModel && (
                <div>
                  <Label>Select Firmware Version</Label>
                  <Select value={selectedFirmware} onValueChange={setSelectedFirmware}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose firmware version" />
                    </SelectTrigger>
                    <SelectContent>
                      {firmwares.map(firmware => (
                        <SelectItem key={firmware.id} value={firmware.id}>
                          <div className="flex items-center gap-2">
                            <span>{firmware.version}</span>
                            {firmware.is_latest && (
                              <Badge variant="secondary" className="text-xs">Latest</Badge>
                            )}
                            {firmware.is_recommended && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Select Features to Configure</Label>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <div className="space-y-4">
                    {features.reduce((acc: any, feature) => {
                      const category = feature.feature_category || 'Other';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(feature);
                      return acc;
                    }, {} as any) && Object.entries(
                      features.reduce((acc: any, feature) => {
                        const category = feature.feature_category || 'Other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(feature);
                        return acc;
                      }, {} as any)
                    ).map(([category, categoryFeatures]: [string, any]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-2 capitalize">{category}</h4>
                        <div className="space-y-2 pl-4">
                          {categoryFeatures.map((feature: any) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedFeatures.includes(feature.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedFeatures([...selectedFeatures, feature.id]);
                                  } else {
                                    setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                                  }
                                }}
                              />
                              <Label className="font-normal cursor-pointer">
                                {feature.feature_name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Deployment Size</Label>
                <RadioGroup value={deploymentSize} onValueChange={setDeploymentSize}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small (< 1,000 devices)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium (1,000 - 10,000 devices)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large (10,000 - 50,000 devices)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enterprise" id="enterprise" />
                    <Label htmlFor="enterprise">Enterprise (> 50,000 devices)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Industry Vertical</Label>
                <Select value={industryVertical} onValueChange={setIndustryVertical}>
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Compliance Requirements</Label>
                <div className="space-y-2">
                  {['NIST', 'ISO 27001', 'PCI DSS', 'HIPAA', 'SOC 2', 'GDPR'].map(compliance => (
                    <div key={compliance} className="flex items-center space-x-2">
                      <Checkbox
                        checked={complianceRequirements.includes(compliance)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setComplianceRequirements([...complianceRequirements, compliance]);
                          } else {
                            setComplianceRequirements(complianceRequirements.filter(c => c !== compliance));
                          }
                        }}
                      />
                      <Label className="font-normal">{compliance}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Configure advanced settings specific to your environment
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Management Network</Label>
                  <Input
                    placeholder="192.168.1.0/24"
                    value={advancedSettings.mgmtNetwork || ''}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      mgmtNetwork: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>DNS Servers</Label>
                  <Input
                    placeholder="8.8.8.8, 8.8.4.4"
                    value={advancedSettings.dnsServers || ''}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      dnsServers: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>NTP Server</Label>
                  <Input
                    placeholder="time.nist.gov"
                    value={advancedSettings.ntpServer || ''}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      ntpServer: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Syslog Server</Label>
                  <Input
                    placeholder="192.168.1.100"
                    value={advancedSettings.syslogServer || ''}
                    onChange={(e) => setAdvancedSettings({
                      ...advancedSettings,
                      syslogServer: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <Label>Custom Configuration (Optional)</Label>
                <Textarea
                  placeholder="Add any custom configuration commands..."
                  rows={5}
                  value={advancedSettings.customConfig || ''}
                  onChange={(e) => setAdvancedSettings({
                    ...advancedSettings,
                    customConfig: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium">
                        {vendors.find(v => v.id === selectedVendor)?.vendor_name || 'Not selected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Model</p>
                      <p className="font-medium">
                        {models.find(m => m.id === selectedModel)?.model_name || 'Not selected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Firmware</p>
                      <p className="font-medium">
                        {firmwares.find(f => f.id === selectedFirmware)?.version || 'Latest'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deployment Size</p>
                      <p className="font-medium capitalize">{deploymentSize}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Selected Features</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map(featureId => {
                        const feature = features.find(f => f.id === featureId);
                        return feature ? (
                          <Badge key={featureId} variant="secondary">
                            {feature.feature_name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  {complianceRequirements.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Compliance Requirements</p>
                        <div className="flex flex-wrap gap-2">
                          {complianceRequirements.map(req => (
                            <Badge key={req} variant="outline">
                              <Shield className="h-3 w-3 mr-1" />
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <EnhancedButton
                onClick={generateConfiguration}
                loading={isGenerating}
                className="w-full"
                size="lg"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Configuration
              </EnhancedButton>
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardContent className="pt-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Configuration */}
      {generatedConfig && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Configuration
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyConfiguration}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={exportConfiguration}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="config">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="deployment">Deployment</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="config">
                <ScrollArea className="h-[400px] border rounded-lg p-4">
                  {generatedConfig.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-medium mb-2">{section.name}</h3>
                      <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto">
                        <code>{section.config}</code>
                      </pre>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="validation">
                <div className="space-y-4">
                  {validationResults && (
                    <>
                      {validationResults.errors.length > 0 && (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-medium mb-2">Errors</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {validationResults.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {validationResults.warnings.length > 0 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-medium mb-2">Warnings</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {validationResults.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {validationResults.recommendations.length > 0 && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-medium mb-2">Recommendations</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {validationResults.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="deployment">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Estimated Deployment Time</span>
                    <Badge>{generatedConfig.deployment.estimatedTime} minutes</Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Deployment Steps</h4>
                    <div className="space-y-2">
                      {generatedConfig.deployment.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{step.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.validation}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {step.estimatedTime} min
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">Rollback Plan</p>
                      <code className="text-sm">{generatedConfig.deployment.rollbackPlan}</code>
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              
              <TabsContent value="testing">
                <div className="space-y-4">
                  {generatedConfig.deployment.testScenarios.map((scenario, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{scenario.name}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Test Steps</p>
                            <ol className="list-decimal pl-5 space-y-1">
                              {scenario.steps.map((step, i) => (
                                <li key={i} className="text-sm">{step}</li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Expected Result</p>
                            <p className="text-sm text-muted-foreground">
                              {scenario.expectedResult}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UltimateConfigurationWizard;
