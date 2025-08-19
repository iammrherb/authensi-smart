import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wand2, 
  Brain,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfigWizardSteps from './ConfigWizardSteps';
import ConfigTemplateManager from './ConfigTemplateManager';
import AdvancedConfigAnalyzer from './AdvancedConfigAnalyzer';
import { InfrastructureSelection } from "@/components/resources/InfrastructureSelector";

interface UnifiedIntelligentConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onSave?: (config: any) => void;
  onCancel?: () => void;
}

const configurationScenarios = [
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
  }
];

const UnifiedIntelligentConfigWizard: React.FC<UnifiedIntelligentConfigWizardProps> = ({ 
  projectId, 
  siteId, 
  onSave, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<'wizard' | 'analyzer' | 'templates'>('wizard');
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const [templateFilters, setTemplateFilters] = useState({
    search: '',
    category: 'all',
    complexity: 'all',
    vendor: 'all'
  });

  const updateWizardData = (step: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
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
      case 0: return wizardData.basic.name && wizardData.basic.vendor;
      case 1: return wizardData.scenario.selectedScenario;
      case 2: return wizardData.requirements.industry && wizardData.requirements.securityLevel;
      default: return true;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="wizard" className="flex items-center gap-2 text-sm">
            <Wand2 className="h-4 w-4" />
            Smart Wizard
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4" />
            AI Analyzer
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wizard" className="space-y-6">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Wand2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge variant="glow" className="px-4 py-2">
                  AI-Powered Configuration
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-3 bg-gradient-primary bg-clip-text text-transparent">
                Intelligent Config Wizard
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create enterprise-grade 802.1X configurations with AI-powered recommendations and best practices
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <ConfigWizardSteps
                currentStep={currentStep}
                wizardData={wizardData}
                updateWizardData={updateWizardData}
                nextStep={nextStep}
                prevStep={prevStep}
                canProceed={canProceed}
                configurationScenarios={configurationScenarios}
              />
              
              {isGenerating && (
                <Alert className="mt-6">
                  <Brain className="h-4 w-4 animate-pulse" />
                  <AlertDescription>
                    AI is generating your configuration. This may take a few moments...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-6">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge variant="glow" className="px-4 py-2">
                  Advanced AI Analysis
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-3 bg-gradient-primary bg-clip-text text-transparent">
                Configuration Analyzer
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Analyze existing configurations for security vulnerabilities, performance optimization, and compliance gaps
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <AdvancedConfigAnalyzer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge variant="glow" className="px-4 py-2">
                  Template Library
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-3 bg-gradient-primary bg-clip-text text-transparent">
                Configuration Templates
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse, customize, and manage enterprise-grade configuration templates for rapid deployment
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <ConfigTemplateManager
                filters={templateFilters}
                onFiltersChange={setTemplateFilters}
                onTemplateSelect={(template) => {
                  toast({
                    title: "Template Selected",
                    description: `${template.name} has been loaded into the wizard.`
                  });
                  setActiveMode('wizard');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedIntelligentConfigWizard;