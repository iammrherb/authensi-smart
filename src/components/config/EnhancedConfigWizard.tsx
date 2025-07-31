import React, { useState, useEffect, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, Settings, Target, TrendingUp, Shield, Users, Building2, 
  Network, Clock, DollarSign, AlertTriangle, CheckCircle, Zap,
  MessageSquare, Bot, Star, ArrowRight, ArrowLeft, Sparkles,
  Globe, Server, Database, Lock, Smartphone, Monitor, Download,
  Copy, Check, FileText, Wifi
} from 'lucide-react';

import { useEnhancedVendors } from '@/hooks/useVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { useToast } from '@/hooks/use-toast';

interface AIConfigRecommendation {
  id: string;
  type: 'vendor' | 'security' | 'performance' | 'compliance' | 'best_practice';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  configuration_snippet?: string;
  dependencies: string[];
  warnings: string[];
}

interface EnhancedConfigData {
  // Business Context
  business_context: {
    organization_name: string;
    industry: string;
    deployment_type: string;
    security_requirements: string[];
    compliance_frameworks: string[];
    business_objectives: string[];
  };

  // Technical Requirements
  technical_requirements: {
    selected_vendor: string;
    selected_model: string;
    firmware_version: string;
    deployment_scenarios: string[];
    authentication_methods: string[];
    network_architecture: string;
    integration_requirements: string[];
  };

  // AI Analysis & Recommendations
  ai_analysis: {
    vendor_recommendations: AIConfigRecommendation[];
    security_recommendations: AIConfigRecommendation[];
    performance_recommendations: AIConfigRecommendation[];
    compliance_recommendations: AIConfigRecommendation[];
    optimization_suggestions: AIConfigRecommendation[];
  };

  // Generated Configuration
  generated_configuration: {
    base_config: string;
    advanced_features: Record<string, any>;
    troubleshooting_commands: string[];
    validation_steps: string[];
    deployment_notes: string[];
  };
}

interface EnhancedConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onComplete?: (configData: EnhancedConfigData) => void;
  onCancel?: () => void;
}

const EnhancedConfigWizard: React.FC<EnhancedConfigWizardProps> = ({
  projectId,
  siteId,
  onComplete,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState<'context' | 'technical' | 'analysis' | 'generation' | 'review'>('context');
  const [conversationStep, setConversationStep] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [configData, setConfigData] = useState<EnhancedConfigData>({
    business_context: {
      organization_name: '', industry: '', deployment_type: '',
      security_requirements: [], compliance_frameworks: [], business_objectives: []
    },
    technical_requirements: {
      selected_vendor: '', selected_model: '', firmware_version: '',
      deployment_scenarios: [], authentication_methods: [], network_architecture: '',
      integration_requirements: []
    },
    ai_analysis: {
      vendor_recommendations: [], security_recommendations: [], performance_recommendations: [],
      compliance_recommendations: [], optimization_suggestions: []
    },
    generated_configuration: {
      base_config: '', advanced_features: {}, troubleshooting_commands: [],
      validation_steps: [], deployment_notes: []
    }
  });

  const { data: vendors = [] } = useEnhancedVendors();
  const { data: vendorModels = [] } = useVendorModels(configData.technical_requirements.selected_vendor);
  const { toast } = useToast();

  // AI-driven conversation flow for context gathering
  const contextQuestions = [
    "What type of organization are you configuring this for? (Industry, size, etc.)",
    "What are your primary security requirements and compliance needs?",
    "What deployment scenarios do you need to support? (BYOD, IoT, Guest Access, etc.)",
    "What authentication methods do you prefer or are required to use?",
    "Are there any specific integration requirements with existing systems?"
  ];

  const technicalQuestions = [
    "Which vendor and model are you configuring?",
    "What firmware version are you running or planning to use?",
    "Describe your network architecture and where this device fits",
    "What advanced features do you need enabled?",
    "Are there any specific performance or capacity requirements?"
  ];

  const renderContextPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Business Context Discovery</h2>
        <p className="text-muted-foreground">
          Let's understand your organization's needs and requirements
        </p>
        <Progress value={(conversationStep / contextQuestions.length) * 100} className="mt-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Discovery Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversationStep < contextQuestions.length && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {contextQuestions[conversationStep]}
                </p>
              </div>
              
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Share your requirements and context..."
                rows={4}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    // Process answer and move to next question
                    setConversationStep(prev => prev + 1);
                    setUserInput('');
                  }}
                  disabled={!userInput.trim()}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                {conversationStep > 0 && (
                  <Button variant="outline" onClick={() => setConversationStep(prev => prev - 1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
            </div>
          )}

          {conversationStep >= contextQuestions.length && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-lg font-medium">Context Discovery Complete!</p>
              <p className="text-muted-foreground mb-4">
                Moving to technical requirements...
              </p>
              <Button onClick={() => {
                setCurrentPhase('technical');
                setConversationStep(0);
              }}>
                Continue to Technical Phase
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTechnicalPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Settings className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Technical Configuration</h2>
        <p className="text-muted-foreground">
          Select your devices and configure technical requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor & Device Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Vendor</Label>
              <Select
                value={configData.technical_requirements.selected_vendor}
                onValueChange={(value) => {
                  setConfigData(prev => ({
                    ...prev,
                    technical_requirements: {
                      ...prev.technical_requirements,
                      selected_vendor: value,
                      selected_model: ''
                    }
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor..." />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Device Model</Label>
              <Select
                value={configData.technical_requirements.selected_model}
                onValueChange={(value) => {
                  setConfigData(prev => ({
                    ...prev,
                    technical_requirements: {
                      ...prev.technical_requirements,
                      selected_model: value
                    }
                  }));
                }}
                disabled={!configData.technical_requirements.selected_vendor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model..." />
                </SelectTrigger>
                <SelectContent>
                  {vendorModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                onClick={() => setCurrentPhase('analysis')}
                disabled={!configData.technical_requirements.selected_vendor || !configData.technical_requirements.selected_model}
                className="w-full"
              >
                <Brain className="h-4 w-4 mr-2" />
                Analyze & Generate Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalysisPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 mx-auto text-purple-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
        <p className="text-muted-foreground">
          Analyzing your requirements and generating intelligent recommendations...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Vendor Analysis", icon: Shield, status: "complete" },
          { title: "Security Review", icon: Lock, status: "processing" },
          { title: "Performance Tuning", icon: Zap, status: "pending" }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <item.icon className={`h-8 w-8 ${
                  item.status === 'complete' ? 'text-green-500' :
                  item.status === 'processing' ? 'text-blue-500 animate-pulse' :
                  'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setCurrentPhase('generation')}
          className="mt-8"
        >
          View Analysis Results
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderGenerationPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Configuration Generated</h2>
        <p className="text-muted-foreground">
          Your AI-optimized configuration is ready for review and deployment
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Configuration
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                <pre>{`! AI-Generated Configuration for ${vendors.find(v => v.id === configData.technical_requirements.selected_vendor)?.vendor_name || 'Selected Device'}
! Generated: ${new Date().toISOString()}
! 
interface GigabitEthernet1/0/1
 description *** 802.1X Enabled Port ***
 switchport mode access
 switchport access vlan 100
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize
 authentication event no-response action authorize vlan 999
 authentication host-mode multi-auth
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
 spanning-tree bpduguard enable
!
! RADIUS Configuration
radius server ISE-Primary
 address ipv4 192.168.1.10 auth-port 1812 acct-port 1813
 key SecureKey123!
!
radius server ISE-Secondary
 address ipv4 192.168.1.11 auth-port 1812 acct-port 1813
 key SecureKey123!
!
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
!
! End of AI-Generated Configuration`}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Validation Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'show dot1x all summary',
                  'show authentication sessions',
                  'show radius server-group all',
                  'show aaa servers',
                  'show interface status'
                ].map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <code className="text-sm">{cmd}</code>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    issue: "Authentication Failure",
                    commands: ["debug dot1x all", "show log | include dot1x"],
                    solution: "Check RADIUS connectivity and shared secret"
                  },
                  {
                    issue: "VLAN Assignment Issues",
                    commands: ["show authentication sessions interface gi1/0/1"],
                    solution: "Verify RADIUS attribute configuration"
                  }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-red-600 mb-2">{item.issue}</h4>
                    <div className="space-y-2">
                      {item.commands.map((cmd, cmdIndex) => (
                        <code key={cmdIndex} className="block text-xs bg-muted p-2 rounded">{cmd}</code>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{item.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Backup current configuration",
                  "Apply RADIUS server configuration",
                  "Configure AAA settings",
                  "Apply interface-specific 802.1X settings",
                  "Test with a single port",
                  "Validate authentication flow",
                  "Apply to remaining ports",
                  "Monitor and verify operation"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentPhase('analysis')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analysis
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Save for Later
          </Button>
          <Button onClick={() => {
            onComplete?.(configData);
            toast({
              title: "Configuration Complete",
              description: "Your AI-generated configuration has been saved successfully."
            });
          }}>
            <Check className="h-4 w-4 mr-2" />
            Complete & Save
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'context':
        return renderContextPhase();
      case 'technical':
        return renderTechnicalPhase();
      case 'analysis':
        return renderAnalysisPhase();
      case 'generation':
        return renderGenerationPhase();
      default:
        return renderContextPhase();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <form id="radius-config-form" style={{ display: 'none' }} />
      
      {/* Phase Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[
            { id: 'context', label: 'Context', icon: Building2 },
            { id: 'technical', label: 'Technical', icon: Settings },
            { id: 'analysis', label: 'Analysis', icon: Brain },
            { id: 'generation', label: 'Generation', icon: FileText }
          ].map((phase, index) => (
            <div key={phase.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentPhase === phase.id 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                <phase.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentPhase === phase.id ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {phase.label}
              </span>
              {index < 3 && (
                <ArrowRight className="h-4 w-4 mx-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase Content */}
      {renderCurrentPhase()}
    </div>
  );
};

export default EnhancedConfigWizard;