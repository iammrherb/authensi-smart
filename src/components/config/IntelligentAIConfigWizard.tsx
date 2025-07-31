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
  Brain, Lightbulb, Target, TrendingUp, Shield, Users, Building2, 
  Network, Clock, DollarSign, AlertTriangle, CheckCircle, Zap,
  MessageSquare, Bot, Star, ArrowRight, ArrowLeft, Sparkles,
  Globe, Server, Database, Lock, Smartphone, Monitor, Settings
} from 'lucide-react';

import { useAI } from '@/hooks/useAI';
import { useEnhancedVendors } from '@/hooks/useVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { useToast } from '@/hooks/use-toast';

interface ConfigRecommendation {
  id: string;
  type: 'template' | 'vendor' | 'security' | 'performance' | 'compliance' | 'integration';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementation_effort: 'low' | 'medium' | 'high';
  reasoning: string;
  config_snippet: string;
  validation_commands: string[];
  troubleshooting_steps: string[];
  dependencies: string[];
  security_considerations: string[];
}

interface ConfigContext {
  vendor: string;
  model: string;
  deployment_type: string;
  environment_size: string;
  security_requirements: string[];
  compliance_frameworks: string[];
  integration_points: string[];
  use_cases: string[];
  authentication_methods: string[];
  network_topology: string;
}

interface IntelligentConfigData {
  // Core Configuration Context
  config_context: {
    vendor_name: string;
    model_name: string;
    firmware_version: string;
    deployment_scenario: string;
    environment_type: string;
    site_characteristics: {
      size: string;
      user_count: number;
      device_types: string[];
      network_topology: string;
      bandwidth_requirements: string;
      availability_requirements: string;
    };
    security_requirements: {
      authentication_methods: string[];
      encryption_standards: string[];
      compliance_frameworks: string[];
      access_policies: string[];
      monitoring_requirements: string[];
    };
  };

  // Technical Requirements
  technical_requirements: {
    integration_points: Array<{
      system: string;
      integration_type: string;
      protocol: string;
      configuration_notes: string;
      validation_steps: string[];
    }>;
    network_configuration: {
      vlan_structure: string;
      ip_addressing: string;
      routing_requirements: string;
      firewall_rules: string[];
      port_requirements: string[];
    };
    performance_requirements: {
      throughput_needs: string;
      latency_requirements: string;
      concurrent_sessions: number;
      scalability_factors: string[];
    };
  };

  // AI Configuration Analysis
  ai_analysis: {
    optimal_configuration: string;
    security_optimizations: string[];
    performance_tuning: string[];
    best_practices_applied: string[];
    potential_issues: Array<{
      issue: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      mitigation: string;
      validation: string;
    }>;
  };

  // Generated Recommendations
  ai_recommendations: {
    configuration_recommendations: ConfigRecommendation[];
    security_recommendations: ConfigRecommendation[];
    performance_recommendations: ConfigRecommendation[];
    compliance_recommendations: ConfigRecommendation[];
    integration_recommendations: ConfigRecommendation[];
    troubleshooting_recommendations: ConfigRecommendation[];
  };

  // Conversation History
  conversation_context: {
    questions_asked: Array<{
      question: string;
      answer: string;
      timestamp: string;
      confidence_level: number;
      follow_up_needed: boolean;
    }>;
    inferred_requirements: string[];
    assumptions_made: string[];
    clarifications_needed: string[];
    recommendation_reasoning: string[];
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
  const [currentPhase, setCurrentPhase] = useState<'context' | 'technical' | 'analysis' | 'generation' | 'review'>('context');
  const [conversationStep, setConversationStep] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [configData, setConfigData] = useState<IntelligentConfigData>({
    config_context: {
      vendor_name: '', model_name: '', firmware_version: '', deployment_scenario: '',
      environment_type: '', 
      site_characteristics: {
        size: '', user_count: 0, device_types: [], network_topology: '',
        bandwidth_requirements: '', availability_requirements: ''
      },
      security_requirements: {
        authentication_methods: [], encryption_standards: [], compliance_frameworks: [],
        access_policies: [], monitoring_requirements: []
      }
    },
    technical_requirements: {
      integration_points: [],
      network_configuration: {
        vlan_structure: '', ip_addressing: '', routing_requirements: '',
        firewall_rules: [], port_requirements: []
      },
      performance_requirements: {
        throughput_needs: '', latency_requirements: '', concurrent_sessions: 0,
        scalability_factors: []
      }
    },
    ai_analysis: {
      optimal_configuration: '', security_optimizations: [], performance_tuning: [],
      best_practices_applied: [], potential_issues: []
    },
    ai_recommendations: {
      configuration_recommendations: [], security_recommendations: [], 
      performance_recommendations: [], compliance_recommendations: [],
      integration_recommendations: [], troubleshooting_recommendations: []
    },
    conversation_context: {
      questions_asked: [], inferred_requirements: [], assumptions_made: [],
      clarifications_needed: [], recommendation_reasoning: []
    }
  });

  const { generateCompletion } = useAI();
  const { data: vendors = [] } = useEnhancedVendors();
  const { data: vendorModels = [] } = useVendorModels();
  const { data: templates = [] } = useConfigTemplates();
  const { toast } = useToast();

  // AI-driven conversation flow for configuration
  const conversationFlow = [
    {
      phase: 'Context Discovery',
      questions: [
        "Welcome to the Portnox AI Configuration Assistant! Let's start by understanding your specific deployment needs. Which vendor device are you configuring and what's the deployment scenario?",
        "Tell me about your environment - how many users, what types of devices, and what's your network topology like?",
        "What are your primary security requirements? Are there specific compliance frameworks you need to meet?",
        "What authentication methods do you need to support? (802.1X, MAB, Guest access, etc.)"
      ]
    },
    {
      phase: 'Technical Requirements',
      questions: [
        "What systems need to integrate with this configuration? (LDAP, AD, RADIUS servers, etc.)",
        "Describe your network architecture - VLANs, subnets, and any special routing requirements.",
        "What are your performance requirements? Expected throughput, concurrent sessions, latency needs?",
        "Are there any specific policies or access control requirements for different user groups?"
      ]
    },
    {
      phase: 'Advanced Configuration',
      questions: [
        "Do you have any existing configurations that need to be preserved or migrated?",
        "What monitoring and logging requirements do you have?",
        "Are there any specific troubleshooting or maintenance considerations?",
        "What's your change management process for configuration updates?"
      ]
    }
  ];

  // Generate contextual AI questions based on previous answers
  const generateContextualQuestion = useCallback(async (context: ConfigContext) => {
    setIsAIThinking(true);
    
    const prompt = `
    You are an expert Network Engineer and Portnox Configuration Specialist. Based on the configuration context below, generate the next most insightful question to ask that will help create the optimal configuration.

    Context:
    - Vendor: ${context.vendor}
    - Model: ${context.model}
    - Deployment Type: ${context.deployment_type}
    - Environment Size: ${context.environment_size}
    - Security Requirements: ${context.security_requirements.join(', ')}
    - Use Cases: ${context.use_cases.join(', ')}
    
    Generate a question that:
    1. Builds on the technical context we already know
    2. Uncovers hidden configuration requirements
    3. Helps identify potential integration challenges
    4. Considers security and performance implications
    5. Reveals operational or maintenance considerations
    
    Make it technical and specific to network configuration, not just a general question.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'config_discovery',
        temperature: 0.7
      });

      if (response?.content) {
        setCurrentQuestion(response.content);
      }
    } catch (error) {
      console.error('Error generating contextual question:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [generateCompletion]);

  // Process user input and generate AI analysis
  const processUserInput = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsAIThinking(true);

    // Add to conversation history
    const newQuestion = {
      question: currentQuestion,
      answer: input,
      timestamp: new Date().toISOString(),
      confidence_level: 0.8,
      follow_up_needed: false
    };

    setConfigData(prev => ({
      ...prev,
      conversation_context: {
        ...prev.conversation_context,
        questions_asked: [...prev.conversation_context.questions_asked, newQuestion]
      }
    }));

    // Generate AI analysis of the response
    const analysisPrompt = `
    Analyze this response from a network engineer configuring Portnox NAC and extract key technical insights:
    
    Question: ${currentQuestion}
    Answer: ${input}
    
    Extract:
    1. Technical requirements and specifications
    2. Network architecture details
    3. Security and compliance needs
    4. Integration requirements
    5. Performance considerations
    6. Operational requirements
    7. Potential configuration challenges
    
    Provide structured insights that will help build optimal configurations.
    `;

    try {
      const analysisResponse = await generateCompletion({
        prompt: analysisPrompt,
        context: 'config_analysis',
        temperature: 0.3
      });

      if (analysisResponse?.content) {
        setAiResponse(analysisResponse.content);
      }

      // Move to next question or generate contextual follow-up
      if (conversationStep < conversationFlow[0].questions.length - 1) {
        setConversationStep(prev => prev + 1);
        // Use predefined questions first, then generate contextual ones
        const nextQuestion = conversationFlow[0].questions[conversationStep + 1];
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          await generateContextualQuestion({
            vendor: configData.config_context.vendor_name,
            model: configData.config_context.model_name,
            deployment_type: configData.config_context.deployment_scenario,
            environment_size: configData.config_context.site_characteristics.size,
            security_requirements: configData.config_context.security_requirements.authentication_methods,
            compliance_frameworks: configData.config_context.security_requirements.compliance_frameworks,
            integration_points: [],
            use_cases: [],
            authentication_methods: configData.config_context.security_requirements.authentication_methods,
            network_topology: configData.config_context.site_characteristics.network_topology
          });
        }
      } else {
        // Move to analysis phase
        setCurrentPhase('analysis');
        await generateComprehensiveConfiguration();
      }

    } catch (error) {
      console.error('Error processing user input:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIThinking(false);
      setUserInput('');
    }
  }, [currentQuestion, conversationStep, configData, generateCompletion, generateContextualQuestion, toast]);

  // Generate comprehensive AI configuration
  const generateComprehensiveConfiguration = useCallback(async () => {
    setIsAIThinking(true);

    const conversationHistory = configData.conversation_context.questions_asked
      .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join('\n\n');

    const configPrompt = `
    Based on this comprehensive configuration discovery conversation, generate a detailed Portnox NAC configuration:

    Conversation History:
    ${conversationHistory}

    Generate:
    1. Complete device configuration optimized for the specified environment
    2. Security policies and access control rules
    3. Authentication method configurations
    4. Network integration settings (VLANs, subnets, routing)
    5. Performance optimization parameters
    6. Monitoring and logging configuration
    7. Troubleshooting commands and validation steps
    8. Best practices implementation
    9. Potential issues and mitigation strategies
    10. Integration-specific configurations

    Provide complete, ready-to-deploy configuration with detailed explanations.
    `;

    try {
      const response = await generateCompletion({
        prompt: configPrompt,
        context: 'comprehensive_config',
        temperature: 0.4
      });

      if (response?.content) {
        // Parse AI response and structure configuration
        const configRecommendations: ConfigRecommendation[] = [
          {
            id: '1',
            type: 'template',
            title: 'Optimized Base Configuration',
            description: 'Complete device configuration optimized for your environment',
            confidence: 0.95,
            impact: 'high',
            implementation_effort: 'medium',
            reasoning: 'Based on your network topology and security requirements',
            config_snippet: response.content,
            validation_commands: ['show config', 'show status', 'test authentication'],
            troubleshooting_steps: ['Check connectivity', 'Verify RADIUS', 'Test policies'],
            dependencies: ['Network connectivity', 'RADIUS server', 'Certificate installation'],
            security_considerations: ['Secure communication', 'Policy validation', 'Access logging']
          }
        ];

        setConfigData(prev => ({
          ...prev,
          ai_recommendations: {
            ...prev.ai_recommendations,
            configuration_recommendations: configRecommendations
          },
          ai_analysis: {
            ...prev.ai_analysis,
            optimal_configuration: response.content
          }
        }));

        setCurrentPhase('generation');
      }
    } catch (error) {
      console.error('Error generating configuration:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to generate configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIThinking(false);
    }
  }, [configData.conversation_context.questions_asked, generateCompletion, toast]);

  // Initialize the conversation
  useEffect(() => {
    if (conversationStep === 0 && currentPhase === 'context') {
      setCurrentQuestion("Welcome to the Portnox AI Configuration Assistant! I'm here to help you create the optimal configuration for your specific deployment. Let's start with understanding your device and deployment scenario - which vendor device are you configuring and what type of deployment is this?");
    }
  }, [conversationStep, currentPhase]);

  const handleUserSubmit = () => {
    if (userInput.trim()) {
      processUserInput(userInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  };

  const getPhaseProgress = () => {
    switch (currentPhase) {
      case 'context': return 25;
      case 'technical': return 50;
      case 'analysis': return 75;
      case 'generation': return 90;
      case 'review': return 100;
      default: return 0;
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(configData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Intelligent AI Configuration Assistant
            </span>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </CardTitle>
          <p className="text-muted-foreground">
            Advanced AI-powered configuration generation for optimal Portnox device setups
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{currentPhase.replace('_', ' ')} Phase</span>
              <span>{getPhaseProgress()}% Complete</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Phase-specific Content */}
      {(currentPhase === 'context' || currentPhase === 'technical') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Configuration Discovery
                  <Badge variant="secondary">Step {conversationStep + 1} of {conversationFlow[0].questions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Conversation History */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {configData.conversation_context.questions_asked.map((qa, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="bg-primary/10 rounded-lg p-3 flex-1">
                          <p className="text-sm">{qa.question}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Users className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex-1">
                          <p className="text-sm">{qa.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current Question */}
                  {currentQuestion && (
                    <div className="flex gap-2">
                      <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="bg-primary/10 rounded-lg p-3 flex-1">
                        <p className="text-sm">{currentQuestion}</p>
                        {isAIThinking && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                            AI is analyzing your response...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Input */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your configuration requirements and technical details..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[100px] resize-none"
                    disabled={isAIThinking}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Press Enter to submit, Shift+Enter for new line
                    </p>
                    <Button 
                      onClick={handleUserSubmit} 
                      disabled={!userInput.trim() || isAIThinking}
                      className="bg-gradient-primary"
                    >
                      {isAIThinking ? (
                        <>
                          <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Response
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Insights Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4" />
                  Configuration Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {configData.conversation_context.questions_asked.length > 0 && (
                  <>
                    <div>
                      <Label className="text-xs font-medium">Device Information</Label>
                      <div className="mt-1 space-y-1">
                        {configData.config_context.vendor_name && (
                          <Badge variant="outline" className="text-xs">
                            {configData.config_context.vendor_name}
                          </Badge>
                        )}
                        {configData.config_context.model_name && (
                          <Badge variant="outline" className="text-xs">
                            {configData.config_context.model_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-xs font-medium">Security Requirements</Label>
                      <div className="mt-1 space-y-1">
                        {configData.config_context.security_requirements.authentication_methods.slice(0, 3).map((method, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-xs font-medium">Configuration Progress</Label>
                      <div className="mt-1">
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">65% - Good configuration data</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4" />
                  Emerging Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Security policies identified</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">Performance optimization ready</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs">Integration requirements noted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Configuration Generation Phase */}
      {currentPhase === 'generation' && (
        <div className="space-y-6">
          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              {configData.ai_recommendations.configuration_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {rec.implementation_effort} effort
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Configuration</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {rec.config_snippet}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Validation Commands</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.validation_commands.map((cmd, cmdIndex) => (
                            <li key={cmdIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <code>{cmd}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Security Considerations</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.security_considerations.map((consideration, consIndex) => (
                            <li key={consIndex} className="text-xs text-muted-foreground">
                              • {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Reasoning:</strong> {rec.reasoning}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {configData.ai_recommendations.security_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {rec.implementation_effort} effort
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Security Configuration</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {rec.config_snippet}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Validation Commands</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.validation_commands.map((cmd, cmdIndex) => (
                            <li key={cmdIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <code>{cmd}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Security Considerations</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.security_considerations.map((consideration, consIndex) => (
                            <li key={consIndex} className="text-xs text-muted-foreground">
                              • {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Reasoning:</strong> {rec.reasoning}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {configData.ai_recommendations.performance_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {rec.implementation_effort} effort
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Performance Configuration</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {rec.config_snippet}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Validation Commands</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.validation_commands.map((cmd, cmdIndex) => (
                            <li key={cmdIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <code>{cmd}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Performance Considerations</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.security_considerations.map((consideration, consIndex) => (
                            <li key={consIndex} className="text-xs text-muted-foreground">
                              • {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Reasoning:</strong> {rec.reasoning}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              {configData.ai_recommendations.integration_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Network className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {rec.implementation_effort} effort
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Integration Configuration</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {rec.config_snippet}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Validation Commands</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.validation_commands.map((cmd, cmdIndex) => (
                            <li key={cmdIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <code>{cmd}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Dependencies</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.dependencies.map((dependency, depIndex) => (
                            <li key={depIndex} className="text-xs text-muted-foreground">
                              • {dependency}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert>
                      <Network className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Reasoning:</strong> {rec.reasoning}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              {configData.ai_recommendations.troubleshooting_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {rec.implementation_effort} effort
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Validation Steps</Label>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {rec.config_snippet}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Validation Commands</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.validation_commands.map((cmd, cmdIndex) => (
                            <li key={cmdIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <code>{cmd}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Troubleshooting Steps</Label>
                        <ul className="mt-1 space-y-1">
                          {rec.troubleshooting_steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-xs text-muted-foreground">
                              • {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Reasoning:</strong> {rec.reasoning}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-gradient-primary">
              Complete Configuration
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentAIConfigWizard;
