import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Wand2, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle,
  Network,
  Shield,
  Code,
  Database,
  FileText,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAI } from "@/hooks/useEnhancedAI";

interface ConfigGenerationData {
  // Project Context
  projectName: string;
  deploymentEnvironment: string;
  networkTopology: string;
  securityRequirements: string[];
  complianceFrameworks: string[];
  
  // Technical Specifications
  vendorEquipment: Array<{
    vendor: string;
    model: string;
    role: string;
    quantity: number;
  }>;
  
  // Authentication & Access Control
  authenticationMethods: string[];
  userGroups: Array<{
    name: string;
    description: string;
    accessLevel: string;
  }>;
  
  // Network Segmentation
  networkSegments: Array<{
    name: string;
    vlanId: string;
    purpose: string;
    securityLevel: string;
  }>;
  
  // Compliance & Policies
  securityPolicies: string[];
  auditRequirements: string[];
  
  // Integration Requirements
  existingSystems: Array<{
    system: string;
    type: string;
    integrationMethod: string;
  }>;
}

interface GeneratedConfig {
  configurationFiles: Array<{
    filename: string;
    content: string;
    description: string;
    vendor: string;
    type: string;
  }>;
  implementationGuide: {
    prerequisites: string[];
    deploymentSteps: string[];
    validationCommands: string[];
    troubleshootingSteps: string[];
  };
  securityBaseline: {
    securityControls: string[];
    auditChecklist: string[];
    complianceMapping: Array<{
      framework: string;
      controls: string[];
    }>;
  };
  documentation: {
    architectureDiagram: string;
    configurationSummary: string;
    maintenanceProcedures: string[];
    emergencyProcedures: string[];
  };
}

const EnhancedConfigGenerationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [configData, setConfigData] = useState<ConfigGenerationData>({
    projectName: '',
    deploymentEnvironment: '',
    networkTopology: '',
    securityRequirements: [],
    complianceFrameworks: [],
    vendorEquipment: [],
    authenticationMethods: [],
    userGroups: [],
    networkSegments: [],
    securityPolicies: [],
    auditRequirements: [],
    existingSystems: []
  });
  
  const [generatedConfig, setGeneratedConfig] = useState<GeneratedConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { generateCompletion, isLoading } = useEnhancedAI();

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Comprehensive options for dropdowns
  const deploymentEnvironments = [
    "Enterprise Campus", "Data Center", "Cloud Infrastructure", "Hybrid Cloud",
    "Remote Offices", "Manufacturing Floor", "Healthcare Facility", "Financial Institution",
    "Government Agency", "Educational Institution", "Multi-Tenant Environment"
  ];

  const networkTopologies = [
    "Hierarchical Three-Tier", "Spine-Leaf", "Hub and Spoke", "Mesh Network",
    "Software-Defined Perimeter", "Zero Trust Architecture", "Micro-Segmented Network",
    "Cloud-Native Architecture", "Hybrid On-Premises/Cloud", "Edge Computing"
  ];

  const securityRequirementOptions = [
    "Zero Trust Network Access", "Multi-Factor Authentication", "Device Compliance",
    "Network Segmentation", "Privileged Access Management", "Data Loss Prevention",
    "Endpoint Detection & Response", "Security Information Event Management",
    "Vulnerability Management", "Incident Response", "Threat Intelligence",
    "Behavioral Analytics", "Risk-Based Authentication", "Just-In-Time Access"
  ];

  const complianceFrameworkOptions = [
    "NIST Cybersecurity Framework", "ISO 27001", "SOC 2 Type II", "PCI DSS",
    "HIPAA", "GDPR", "CCPA", "SOX", "CMMC Level 3", "FedRAMP", "FISMA",
    "HITECH", "PIPEDA", "COSO", "COBIT", "IEC 62443", "CSA CCM"
  ];

  const vendorOptions = [
    "Portnox", "Cisco", "Aruba", "Juniper", "Fortinet", "Palo Alto Networks",
    "Microsoft", "VMware", "F5", "Checkpoint", "SonicWall", "Meraki",
    "Extreme Networks", "Ruckus", "Ubiquiti", "Dell Technologies"
  ];

  const authenticationMethodOptions = [
    "802.1X Certificate-Based", "FIDO2/WebAuthn", "Smart Card/PIV", "Biometric Authentication",
    "Multi-Factor Authentication", "Single Sign-On (SSO)", "RADIUS Authentication",
    "LDAP/Active Directory", "OAuth 2.0", "SAML 2.0", "Kerberos", "Mobile Push Authentication"
  ];

  // AI Prompt Engineering for Perfect Config Generation
  const generatePerfectAIPrompt = (configData: ConfigGenerationData): string => {
    return `
You are an expert network security architect and configuration specialist. Generate a comprehensive, production-ready network security configuration based on the following EXACT specifications. 

CRITICAL REQUIREMENTS - FOLLOW PRECISELY:
1. Generate ONLY configurations that are immediately deployable
2. Include ALL security best practices for the specified compliance frameworks
3. Provide vendor-specific syntax and commands
4. Include comprehensive validation and troubleshooting procedures
5. Ensure all configurations align with zero trust principles

PROJECT CONTEXT:
- Project Name: ${configData.projectName}
- Environment: ${configData.deploymentEnvironment}
- Network Topology: ${configData.networkTopology}
- Security Requirements: ${configData.securityRequirements.join(', ')}
- Compliance Frameworks: ${configData.complianceFrameworks.join(', ')}

VENDOR EQUIPMENT:
${configData.vendorEquipment.map(eq => `- ${eq.vendor} ${eq.model} (${eq.role}) - Quantity: ${eq.quantity}`).join('\n')}

AUTHENTICATION METHODS:
${configData.authenticationMethods.join(', ')}

USER GROUPS:
${configData.userGroups.map(group => `- ${group.name}: ${group.description} (Access: ${group.accessLevel})`).join('\n')}

NETWORK SEGMENTS:
${configData.networkSegments.map(seg => `- ${seg.name} (VLAN ${seg.vlanId}): ${seg.purpose} - Security Level: ${seg.securityLevel}`).join('\n')}

EXISTING SYSTEMS INTEGRATION:
${configData.existingSystems.map(sys => `- ${sys.system} (${sys.type}) via ${sys.integrationMethod}`).join('\n')}

OUTPUT REQUIREMENTS:
1. Configuration Files: Provide complete, vendor-specific configuration files with exact syntax
2. Implementation Guide: Step-by-step deployment procedures with validation commands
3. Security Baseline: Complete security control implementation details
4. Documentation: Architecture diagrams, maintenance procedures, emergency procedures

CONFIGURATION STANDARDS:
- Use industry best practices for each vendor
- Include comprehensive error handling and logging
- Implement defense-in-depth strategies
- Ensure high availability and redundancy
- Include performance optimization settings
- Provide rollback procedures for each configuration

VALIDATION REQUIREMENTS:
- Include specific testing commands for each configuration
- Provide expected outputs for verification
- Include troubleshooting commands and common issues
- Document all dependencies and prerequisites

Generate the response in JSON format with the following structure:
{
  "configurationFiles": [
    {
      "filename": "exact_filename.cfg",
      "content": "complete_configuration_content",
      "description": "detailed_description",
      "vendor": "vendor_name",
      "type": "configuration_type"
    }
  ],
  "implementationGuide": {
    "prerequisites": ["detailed_prerequisite_list"],
    "deploymentSteps": ["step_by_step_deployment"],
    "validationCommands": ["specific_validation_commands"],
    "troubleshootingSteps": ["comprehensive_troubleshooting"]
  },
  "securityBaseline": {
    "securityControls": ["implemented_security_controls"],
    "auditChecklist": ["audit_verification_items"],
    "complianceMapping": [
      {
        "framework": "framework_name",
        "controls": ["mapped_controls"]
      }
    ]
  },
  "documentation": {
    "architectureDiagram": "detailed_architecture_description",
    "configurationSummary": "comprehensive_summary",
    "maintenanceProcedures": ["maintenance_procedures"],
    "emergencyProcedures": ["emergency_procedures"]
  }
}`;
  };

  const handleGenerateConfiguration = async () => {
    if (!configData.projectName || configData.vendorEquipment.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide project name and at least one vendor equipment.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 500);

      const prompt = generatePerfectAIPrompt(configData);
      
      const response = await generateCompletion({
        prompt,
        context: "Generate comprehensive network security configuration with vendor-specific implementations",
        taskType: "code_generation",
        temperature: 0.1, // Low temperature for consistent, precise results
        maxTokens: 4000
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.content) {
        try {
          const parsedConfig = JSON.parse(response.content);
          setGeneratedConfig(parsedConfig);
          setCurrentStep(totalSteps + 1); // Move to results step
        } catch (parseError) {
          // If JSON parsing fails, create a structured response
          setGeneratedConfig({
            configurationFiles: [{
              filename: "generated_config.txt",
              content: response.content,
              description: "AI-generated configuration",
              vendor: "Multiple",
              type: "Mixed"
            }],
            implementationGuide: {
              prerequisites: ["Review configuration before implementation"],
              deploymentSteps: ["Deploy configurations in test environment first"],
              validationCommands: ["Test connectivity and functionality"],
              troubleshootingSteps: ["Check logs for errors"]
            },
            securityBaseline: {
              securityControls: ["Review all security settings"],
              auditChecklist: ["Verify compliance requirements"],
              complianceMapping: []
            },
            documentation: {
              architectureDiagram: "See configuration files for architecture details",
              configurationSummary: "Comprehensive security configuration generated",
              maintenanceProcedures: ["Regular security updates"],
              emergencyProcedures: ["Contact support team"]
            }
          });
          setCurrentStep(totalSteps + 1);
        }
      }

      toast({
        title: "Configuration Generated",
        description: "Your comprehensive security configuration has been generated successfully."
      });

    } catch (error) {
      console.error('Configuration generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedConfig(filename);
      setTimeout(() => setCopiedConfig(null), 2000);
      toast({
        title: "Copied",
        description: `${filename} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadConfig = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Project Context</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            value={configData.projectName}
            onChange={(e) => setConfigData(prev => ({ ...prev, projectName: e.target.value }))}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <Label htmlFor="environment">Deployment Environment *</Label>
          <Select
            value={configData.deploymentEnvironment}
            onValueChange={(value) => setConfigData(prev => ({ ...prev, deploymentEnvironment: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {deploymentEnvironments.map(env => (
                <SelectItem key={env} value={env}>{env}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="topology">Network Topology *</Label>
          <Select
            value={configData.networkTopology}
            onValueChange={(value) => setConfigData(prev => ({ ...prev, networkTopology: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select topology" />
            </SelectTrigger>
            <SelectContent>
              {networkTopologies.map(topology => (
                <SelectItem key={topology} value={topology}>{topology}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Security & Compliance Requirements</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Security Requirements</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {securityRequirementOptions.map(req => (
              <div key={req} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={req}
                  checked={configData.securityRequirements.includes(req)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfigData(prev => ({
                        ...prev,
                        securityRequirements: [...prev.securityRequirements, req]
                      }));
                    } else {
                      setConfigData(prev => ({
                        ...prev,
                        securityRequirements: prev.securityRequirements.filter(r => r !== req)
                      }));
                    }
                  }}
                  className="rounded"
                />
                <Label htmlFor={req} className="text-sm">{req}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Compliance Frameworks</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {complianceFrameworkOptions.map(framework => (
              <div key={framework} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={framework}
                  checked={configData.complianceFrameworks.includes(framework)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfigData(prev => ({
                        ...prev,
                        complianceFrameworks: [...prev.complianceFrameworks, framework]
                      }));
                    } else {
                      setConfigData(prev => ({
                        ...prev,
                        complianceFrameworks: prev.complianceFrameworks.filter(f => f !== framework)
                      }));
                    }
                  }}
                  className="rounded"
                />
                <Label htmlFor={framework} className="text-sm">{framework}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!generatedConfig) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Generated Configuration</h3>
        </div>

        <Tabs defaultValue="configs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configs">Configuration Files</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="security">Security Baseline</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="configs" className="space-y-4">
            {generatedConfig.configurationFiles.map((config, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      <CardTitle className="text-sm">{config.filename}</CardTitle>
                      <Badge variant="outline">{config.vendor}</Badge>
                      <Badge variant="secondary">{config.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(config.content, config.filename)}
                      >
                        {copiedConfig === config.filename ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadConfig(config.content, config.filename)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full">
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      <code>{config.content}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedConfig.implementationGuide.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Deployment Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {generatedConfig.implementationGuide.deploymentSteps.map((step, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary font-semibold">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedConfig.securityBaseline.securityControls.map((control, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Check className="w-3 h-3 text-green-600 mt-0.5" />
                        {control}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Compliance Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedConfig.securityBaseline.complianceMapping.map((mapping, index) => (
                      <div key={index}>
                        <Badge variant="outline" className="mb-2">{mapping.framework}</Badge>
                        <ul className="ml-4 space-y-1">
                          {mapping.controls.map((control, controlIndex) => (
                            <li key={controlIndex} className="text-xs text-muted-foreground">
                              • {control}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Architecture Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{generatedConfig.documentation.architectureDiagram}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Configuration Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{generatedConfig.documentation.configurationSummary}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            <CardTitle>Enhanced Configuration Generation Wizard</CardTitle>
          </div>
          <Badge variant="outline">Step {Math.min(currentStep, totalSteps)} of {totalSteps}</Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wand2 className="w-4 h-4 animate-spin" />
              Generating configuration... {generationProgress}%
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep > totalSteps && renderResults()}

        {!isGenerating && currentStep <= totalSteps && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleGenerateConfiguration}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Generate Configuration
              </Button>
            )}
          </div>
        )}

        {isGenerating && (
          <Alert>
            <Wand2 className="w-4 h-4" />
            <AlertDescription>
              Generating comprehensive configuration with AI-powered optimization. This may take a few moments...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedConfigGenerationWizard;