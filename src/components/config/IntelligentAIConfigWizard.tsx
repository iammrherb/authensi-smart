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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, Lightbulb, Target, TrendingUp, Shield, Users, Building2, 
  Network, Clock, Settings, AlertTriangle, CheckCircle, Zap,
  MessageSquare, Bot, Star, ArrowRight, ArrowLeft, Sparkles,
  Globe, Server, Database, Lock, Smartphone, Monitor, Router
} from 'lucide-react';

import { useAI } from '@/hooks/useAI';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VendorModel {
  id: string;
  vendor_id: string;
  model_name: string;
  model_series: string;
  supported_features: any; // JSON field from database
  configuration_notes: string;
  firmware_versions: any; // JSON field from database
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface ConfigRecommendation {
  id: string;
  type: 'deployment' | 'security' | 'integration' | 'performance' | 'best_practice';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementation_effort: 'low' | 'medium' | 'high';
  reasoning: string;
  config_snippet?: string;
}

interface ConfigContext {
  organization: string;
  industry: string;
  network_size: string;
  security_level: string;
  compliance_needs: string[];
  selected_vendor: string;
  selected_model: string;
  deployment_scenario: string;
  authentication_methods: string[];
  integration_requirements: string[];
}

interface IntelligentConfigData {
  // Context Discovery
  context_discovery: {
    organization_profile: {
      name: string;
      industry: string;
      size: string;
      security_posture: string;
      compliance_requirements: string[];
      current_challenges: string[];
    };
    network_environment: {
      topology: string;
      vendor_ecosystem: Array<{vendor: string; role: string; models: string[];}>;
      device_count: number;
      site_complexity: string;
      integration_points: string[];
    };
    security_requirements: {
      authentication_methods: string[];
      authorization_needs: string[];
      monitoring_requirements: string[];
      compliance_frameworks: string[];
    };
  };

  // Technical Configuration
  technical_configuration: {
    selected_vendor: string;
    selected_model: string;
    deployment_scenario: string;
    network_settings: {
      vlan_strategy: string;
      radius_config: any;
      switch_ports: any;
      wireless_config: any;
    };
    security_policies: {
      authentication_policies: any[];
      authorization_rules: any[];
      guest_access: any;
      device_compliance: any;
    };
  };

  // AI Analysis & Generation
  ai_analysis: {
    recommendations: ConfigRecommendation[];
    risk_assessment: Array<{
      risk: string;
      impact: string;
      mitigation: string;
      priority: string;
    }>;
    optimization_suggestions: Array<{
      area: string;
      suggestion: string;
      expected_benefit: string;
    }>;
    best_practices: string[];
  };

  // Generated Configuration
  generated_configuration: {
    primary_config: string;
    supporting_configs: Array<{
      component: string;
      config: string;
      description: string;
    }>;
    validation_commands: string[];
    troubleshooting_guide: Array<{
      issue: string;
      symptoms: string[];
      resolution: string;
    }>;
    implementation_notes: string[];
  };
}

interface IntelligentAIConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onComplete?: (configData: IntelligentConfigData) => void;
  onCancel?: () => void;
}

const IntelligentAIConfigWizard: React.FC<IntelligentAIConfigWizardProps> = ({
  projectId,
  siteId,
  onComplete,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState<'discovery' | 'technical' | 'analysis' | 'generation'>('discovery');
  const [conversationStep, setConversationStep] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorModels, setVendorModels] = useState<VendorModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<VendorModel[]>([]);
  
  const [configData, setConfigData] = useState<IntelligentConfigData>({
    context_discovery: {
      organization_profile: {
        name: '', industry: '', size: '', security_posture: '', 
        compliance_requirements: [], current_challenges: []
      },
      network_environment: {
        topology: '', vendor_ecosystem: [], device_count: 0, 
        site_complexity: '', integration_points: []
      },
      security_requirements: {
        authentication_methods: [], authorization_needs: [], 
        monitoring_requirements: [], compliance_frameworks: []
      }
    },
    technical_configuration: {
      selected_vendor: '', selected_model: '', deployment_scenario: '',
      network_settings: { vlan_strategy: '', radius_config: {}, switch_ports: {}, wireless_config: {} },
      security_policies: { authentication_policies: [], authorization_rules: [], guest_access: {}, device_compliance: {} }
    },
    ai_analysis: {
      recommendations: [], risk_assessment: [], optimization_suggestions: [], best_practices: []
    },
    generated_configuration: {
      primary_config: '', supporting_configs: [], validation_commands: [], 
      troubleshooting_guide: [], implementation_notes: []
    }
  });

  const { generateCompletion } = useAI();
  const { toast } = useToast();

  // Load vendors and models from database
  useEffect(() => {
    const loadVendorsAndModels = async () => {
      try {
        // Load vendors
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendor_models')
          .select(`
            vendor_id,
            vendors!inner(id, name, category, description)
          `)
          .eq('vendors.category', 'Network Infrastructure');

        if (vendorError) throw vendorError;

        // Extract unique vendors
        const uniqueVendors = vendorData
          ?.reduce((acc: Vendor[], item: any) => {
            const vendor = item.vendors;
            if (!acc.find(v => v.id === vendor.id)) {
              acc.push(vendor);
            }
            return acc;
          }, []) || [];

        setVendors(uniqueVendors);

        // Load all vendor models
        const { data: modelData, error: modelError } = await supabase
          .from('vendor_models')
          .select('*');

        if (modelError) throw modelError;
        setVendorModels((modelData || []) as VendorModel[]);

      } catch (error) {
        console.error('Error loading vendors/models:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load vendor and model information.",
          variant: "destructive"
        });
      }
    };

    loadVendorsAndModels();
  }, [toast]);

  // Filter models when vendor is selected
  useEffect(() => {
    if (configData.technical_configuration.selected_vendor) {
      const filtered = vendorModels.filter(
        model => model.vendor_id === configData.technical_configuration.selected_vendor
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
  }, [configData.technical_configuration.selected_vendor, vendorModels]);

  // AI-driven conversation flow
  const conversationFlow = [
    {
      phase: 'Context Discovery',
      questions: [
        "Let's start by understanding your organization and network environment. What's your company name and primary industry?",
        "What specific network access control challenges are you trying to solve? What's not working with your current setup?",
        "Tell me about your network infrastructure - what vendors and models are you currently using for switches, wireless, and security?",
        "What compliance requirements do you need to meet, and what's your current security posture?"
      ]
    },
    {
      phase: 'Technical Deep Dive',
      questions: [
        "Which vendor and model will you be configuring for 802.1X? What's the specific deployment scenario?",
        "What authentication methods do you want to implement - certificates, username/password, or both?",
        "How do you want to handle different device types - corporate laptops, BYOD, IoT devices, guests?",
        "What VLAN strategy and network segmentation approach fits your security model?"
      ]
    },
    {
      phase: 'Requirements Analysis',
      questions: [
        "What integration points do you need - SIEM, ITSM, monitoring tools, identity providers?",
        "What are your performance requirements - how many concurrent users, authentication speed expectations?",
        "How do you want to handle failures and fallback scenarios for business continuity?",
        "What monitoring and reporting capabilities are most important for your team?"
      ]
    },
    {
      phase: 'Configuration Generation',
      questions: [
        "Based on everything we've discussed, I'm now generating your optimized 802.1X configuration...",
        "I'm analyzing best practices for your specific vendor and deployment scenario...",
        "Creating security policies and access rules based on your requirements...",
        "Finalizing configuration with validation commands and troubleshooting guidance..."
      ]
    }
  ];

  // Generate contextual AI questions
  const generateContextualQuestion = useCallback(async (context: ConfigContext) => {
    setIsAIThinking(true);
    
    const prompt = `
    You are an expert Network Access Control engineer specializing in 802.1X configurations. Based on the conversation context below, generate the next most insightful question to ask that will help create the best possible network configuration.

    Context:
    - Organization: ${context.organization}
    - Industry: ${context.industry}
    - Network Size: ${context.network_size}
    - Security Level: ${context.security_level}
    - Compliance Needs: ${context.compliance_needs.join(', ')}
    - Selected Vendor: ${context.selected_vendor}
    - Selected Model: ${context.selected_model}
    - Deployment Scenario: ${context.deployment_scenario}
    
    Generate a question that:
    1. Builds on the technical details already provided
    2. Uncovers specific configuration requirements
    3. Considers vendor-specific capabilities and limitations
    4. Addresses security and compliance implications
    5. Reveals operational and maintenance considerations
    
    Make it technical but conversational, focusing on practical implementation details.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'intelligent_config',
        temperature: 0.7
      });

      if (response?.content) {
        setCurrentQuestion(response.content);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      setCurrentQuestion(getDefaultQuestion());
    } finally {
      setIsAIThinking(false);
    }
  }, [generateCompletion]);

  const getDefaultQuestion = () => {
    const currentFlow = conversationFlow[Math.min(Math.floor(conversationStep / 4), conversationFlow.length - 1)];
    return currentFlow.questions[conversationStep % 4] || "Please tell me more about your requirements.";
  };

  // Generate AI recommendations and configuration
  const generateAIRecommendations = useCallback(async () => {
    setIsAIThinking(true);
    
    const prompt = `
    Generate comprehensive 802.1X configuration recommendations based on:
    
    Organization: ${configData.context_discovery.organization_profile.name}
    Industry: ${configData.context_discovery.organization_profile.industry}
    Vendor: ${configData.technical_configuration.selected_vendor}
    Model: ${configData.technical_configuration.selected_model}
    Scenario: ${configData.technical_configuration.deployment_scenario}
    
    Provide:
    1. Deployment recommendations with confidence scores
    2. Security recommendations for the specific vendor/model
    3. Integration recommendations for their environment
    4. Performance optimization suggestions
    5. Best practice recommendations
    
    Format as JSON with detailed reasoning for each recommendation.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'config_recommendations',
        temperature: 0.3
      });

      if (response?.content) {
        // Parse AI recommendations and update state
        try {
          const recommendations = JSON.parse(response.content);
          setConfigData(prev => ({
            ...prev,
            ai_analysis: {
              ...prev.ai_analysis,
              recommendations: recommendations.recommendations || []
            }
          }));
        } catch (parseError) {
          console.error('Error parsing AI recommendations:', parseError);
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [configData, generateCompletion]);

  // Generate actual configuration
  const generateConfiguration = useCallback(async () => {
    setIsAIThinking(true);
    
    const selectedVendorName = vendors.find(v => v.id === configData.technical_configuration.selected_vendor)?.name || '';
    const selectedModelData = vendorModels.find(m => m.id === configData.technical_configuration.selected_model);
    
    const prompt = `
    Generate a complete 802.1X configuration for:
    
    Vendor: ${selectedVendorName}
    Model: ${selectedModelData?.model_name || ''} (${selectedModelData?.model_series || ''})
    Features: ${Array.isArray(selectedModelData?.supported_features) ? selectedModelData.supported_features.join(', ') : JSON.stringify(selectedModelData?.supported_features) || ''}
    Scenario: ${configData.technical_configuration.deployment_scenario}
    
    Organization Context:
    - Industry: ${configData.context_discovery.organization_profile.industry}
    - Security Level: ${configData.context_discovery.organization_profile.security_posture}
    - Compliance: ${configData.context_discovery.organization_profile.compliance_requirements.join(', ')}
    
    Generate:
    1. Complete switch/device configuration
    2. RADIUS server configuration snippets
    3. Supporting network configurations (VLANs, ACLs)
    4. Validation and testing commands
    5. Troubleshooting guide with common issues
    6. Implementation notes and best practices
    
    Make it production-ready with proper syntax and security considerations.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'config_generation',
        temperature: 0.2
      });

      if (response?.content) {
        setConfigData(prev => ({
          ...prev,
          generated_configuration: {
            ...prev.generated_configuration,
            primary_config: response.content
          }
        }));
      }
    } catch (error) {
      console.error('Error generating configuration:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [configData, vendors, vendorModels, generateCompletion]);

  const handleUserResponse = async () => {
    if (!userInput.trim()) return;

    // Store the conversation
    const newQuestion = {
      question: currentQuestion,
      answer: userInput,
      timestamp: new Date().toISOString(),
      confidence_level: 0.8,
      follow_up_needed: false
    };

    // Process the response based on current phase
    if (currentPhase === 'discovery') {
      // Update organization profile
      setConfigData(prev => ({
        ...prev,
        context_discovery: {
          ...prev.context_discovery,
          organization_profile: {
            ...prev.context_discovery.organization_profile,
            name: conversationStep === 0 ? userInput.split(',')[0]?.trim() || prev.context_discovery.organization_profile.name : prev.context_discovery.organization_profile.name,
            industry: conversationStep === 0 ? userInput.split(',')[1]?.trim() || prev.context_discovery.organization_profile.industry : prev.context_discovery.organization_profile.industry,
            current_challenges: conversationStep === 1 ? [userInput] : prev.context_discovery.organization_profile.current_challenges
          }
        }
      }));
    }

    setUserInput('');
    setConversationStep(prev => prev + 1);

    // Generate next question or move to next phase
    if (conversationStep < 15) {
      setTimeout(() => {
        const context: ConfigContext = {
          organization: configData.context_discovery.organization_profile.name,
          industry: configData.context_discovery.organization_profile.industry,
          network_size: 'medium',
          security_level: configData.context_discovery.organization_profile.security_posture,
          compliance_needs: configData.context_discovery.organization_profile.compliance_requirements,
          selected_vendor: configData.technical_configuration.selected_vendor,
          selected_model: configData.technical_configuration.selected_model,
          deployment_scenario: configData.technical_configuration.deployment_scenario,
          authentication_methods: configData.context_discovery.security_requirements.authentication_methods,
          integration_requirements: configData.context_discovery.network_environment.integration_points
        };

        if (conversationStep >= 8 && conversationStep < 12) {
          setCurrentPhase('technical');
        } else if (conversationStep >= 12 && conversationStep < 15) {
          setCurrentPhase('analysis');
        } else if (conversationStep >= 15) {
          setCurrentPhase('generation');
          generateConfiguration();
          return;
        }

        generateContextualQuestion(context);
      }, 1000);
    }
  };

  const handleVendorChange = (vendorId: string) => {
    setConfigData(prev => ({
      ...prev,
      technical_configuration: {
        ...prev.technical_configuration,
        selected_vendor: vendorId,
        selected_model: '' // Reset model when vendor changes
      }
    }));
  };

  const handleModelChange = (modelId: string) => {
    setConfigData(prev => ({
      ...prev,
      technical_configuration: {
        ...prev.technical_configuration,
        selected_model: modelId
      }
    }));
  };

  const getPhaseProgress = () => {
    const phaseSteps = {
      discovery: 8,
      technical: 4,
      analysis: 3,
      generation: 1
    };
    
    const totalSteps = Object.values(phaseSteps).reduce((a, b) => a + b, 0);
    return Math.min((conversationStep / totalSteps) * 100, 100);
  };

  const renderConversationInterface = () => (
    <div className="space-y-6">
      {/* Phase Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <span className="font-medium">
            {currentPhase === 'discovery' && 'Context Discovery'}
            {currentPhase === 'technical' && 'Technical Configuration'}
            {currentPhase === 'analysis' && 'Requirements Analysis'}
            {currentPhase === 'generation' && 'Configuration Generation'}
          </span>
        </div>
        <Badge variant="glow">
          Step {conversationStep + 1}
        </Badge>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(getPhaseProgress())}%</span>
        </div>
        <Progress value={getPhaseProgress()} className="h-2" />
      </div>

      {/* AI Question */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              {isAIThinking ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>AI is thinking...</span>
                </div>
              ) : (
                <p className="text-blue-900 dark:text-blue-100">
                  {currentQuestion || getDefaultQuestion()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor/Model Selection (during technical phase) */}
      {currentPhase === 'technical' && conversationStep >= 8 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Vendor & Model Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vendor-select">Select Vendor</Label>
              <Select value={configData.technical_configuration.selected_vendor} onValueChange={handleVendorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your network vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {configData.technical_configuration.selected_vendor && (
              <div>
                <Label htmlFor="model-select">Select Model</Label>
                <Select value={configData.technical_configuration.selected_model} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your device model" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.model_name} ({model.model_series})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {configData.technical_configuration.selected_model && (
              <div>
                <Label htmlFor="scenario-select">Deployment Scenario</Label>
                <Select 
                  value={configData.technical_configuration.deployment_scenario} 
                  onValueChange={(value) => setConfigData(prev => ({
                    ...prev,
                    technical_configuration: {
                      ...prev.technical_configuration,
                      deployment_scenario: value
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose deployment scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic_dot1x">Basic 802.1X Authentication</SelectItem>
                    <SelectItem value="dot1x_with_mab">802.1X with MAB Fallback</SelectItem>
                    <SelectItem value="guest_access">Guest Access with Portal</SelectItem>
                    <SelectItem value="iot_segmentation">IoT Device Segmentation</SelectItem>
                    <SelectItem value="byod_environment">BYOD Environment</SelectItem>
                    <SelectItem value="high_security">High Security Deployment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Response */}
      {currentPhase !== 'generation' && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Please share your thoughts and requirements..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleUserResponse} disabled={!userInput.trim()}>
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Result */}
      {currentPhase === 'generation' && configData.generated_configuration.primary_config && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Generated Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              <pre>{configData.generated_configuration.primary_config}</pre>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => onComplete?.(configData)}>
                Save Configuration
              </Button>
              <Button variant="outline" onClick={() => {
                navigator.clipboard.writeText(configData.generated_configuration.primary_config);
                toast({ title: "Copied to clipboard" });
              }}>
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Initialize first question
  useEffect(() => {
    if (!currentQuestion) {
      setCurrentQuestion(getDefaultQuestion());
    }
  }, [currentQuestion]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge variant="glow" className="mb-4">
          <Zap className="h-3 w-3 mr-1" />
          AI-Powered Configuration
        </Badge>
        <h2 className="text-3xl font-bold mb-2">
          Intelligent <span className="bg-gradient-primary bg-clip-text text-transparent">802.1X Config</span> Wizard
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-driven configuration generation with vendor-specific optimization, 
          security best practices, and intelligent recommendations.
        </p>
      </div>

      {renderConversationInterface()}
    </div>
  );
};

export default IntelligentAIConfigWizard;