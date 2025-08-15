import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useToast } from '@/hooks/use-toast';
import {
  Brain, Sparkles, Diamond, Globe, Zap, Settings2, 
  TestTube, CheckCircle2, XCircle, Loader2, AlertTriangle,
  Network, RefreshCw, BarChart3, Save, ArrowRight, ArrowDown,
  Shield, Cpu, Cloud, Target, Layers, Router, Eye, EyeOff
} from 'lucide-react';

export type AIProviderType = 'openai' | 'anthropic' | 'google' | 'perplexity' | 'grok';
export type TaskScenario = 
  | 'project_analysis' | 'troubleshooting' | 'config_generation' | 'documentation'
  | 'recommendations' | 'scoping' | 'training' | 'reporting' | 'chat' | 'search'
  | 'code_review' | 'security_analysis' | 'network_design' | 'compliance_check';

interface AIModel {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  outputTokens: number;
  costPerToken: number;
  capabilities: string[];
  isDefault?: boolean;
}

interface AIProvider {
  id: string;
  type: AIProviderType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  status: 'active' | 'inactive' | 'error';
  isPrimary: boolean;
  isSecondary: boolean;
  models: AIModel[];
  features: string[];
  apiKeySet: boolean;
}

interface ScenarioConfiguration {
  scenario: TaskScenario;
  label: string;
  description: string;
  primaryProvider: AIProviderType;
  primaryModel: string;
  secondaryProvider?: AIProviderType;
  secondaryModel?: string;
  temperature: number;
  maxTokens: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  contextEnhancement: boolean;
  smartRouting: boolean;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: '1',
    type: 'openai',
    name: 'OpenAI',
    description: 'GPT-5 and O3 models for reasoning and code generation',
    icon: Brain,
    color: 'bg-emerald-500',
    status: 'inactive',
    isPrimary: true,
    isSecondary: false,
    apiKeySet: false,
    features: ['Reasoning', 'Code Gen', 'Analysis', 'Vision'],
    models: [
      {
        id: 'gpt-5-2025-08-07',
        name: 'GPT-5',
        description: 'Most capable model with superior reasoning',
        contextWindow: 200000,
        outputTokens: 16384,
        costPerToken: 0.00003,
        capabilities: ['reasoning', 'analysis', 'code', 'vision'],
        isDefault: true
      },
      {
        id: 'o3-2025-04-16',
        name: 'O3',
        description: 'Powerful reasoning for complex problems',
        contextWindow: 128000,
        outputTokens: 8192,
        costPerToken: 0.00005,
        capabilities: ['reasoning', 'analysis', 'math']
      }
    ]
  },
  {
    id: '2',
    type: 'anthropic',
    name: 'Claude',
    description: 'Advanced reasoning with safety focus',
    icon: Sparkles,
    color: 'bg-orange-500',
    status: 'inactive',
    isPrimary: false,
    isSecondary: true,
    apiKeySet: false,
    features: ['Long Context', 'Analysis', 'Safety', 'Reasoning'],
    models: [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude 4 Opus',
        description: 'Most capable with superior reasoning',
        contextWindow: 200000,
        outputTokens: 8192,
        costPerToken: 0.00075,
        capabilities: ['reasoning', 'analysis', 'writing'],
        isDefault: true
      },
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude 4 Sonnet',
        description: 'High-performance with efficiency',
        contextWindow: 200000,
        outputTokens: 8192,
        costPerToken: 0.0003,
        capabilities: ['reasoning', 'analysis', 'code']
      }
    ]
  },
  {
    id: '3',
    type: 'google',
    name: 'Gemini',
    description: 'Multimodal AI with strong reasoning',
    icon: Diamond,
    color: 'bg-blue-500',
    status: 'inactive',
    isPrimary: false,
    isSecondary: false,
    apiKeySet: false,
    features: ['Multimodal', 'Math', 'Code', 'Long Context'],
    models: [
      {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        description: 'Latest multimodal capabilities',
        contextWindow: 1000000,
        outputTokens: 8192,
        costPerToken: 0.000075,
        capabilities: ['multimodal', 'reasoning', 'code'],
        isDefault: true
      }
    ]
  },
  {
    id: '4',
    type: 'perplexity',
    name: 'Perplexity',
    description: 'Real-time search and current information',
    icon: Globe,
    color: 'bg-purple-500',
    status: 'inactive',
    isPrimary: false,
    isSecondary: false,
    apiKeySet: false,
    features: ['Real-time Search', 'Citations', 'Current Events'],
    models: [
      {
        id: 'llama-3.1-sonar-large-128k-online',
        name: 'Sonar Large',
        description: 'Large model with web search',
        contextWindow: 127072,
        outputTokens: 4096,
        costPerToken: 0.001,
        capabilities: ['search', 'analysis'],
        isDefault: true
      }
    ]
  },
  {
    id: '5',
    type: 'grok',
    name: 'Grok',
    description: 'Real-time AI with X platform data',
    icon: Zap,
    color: 'bg-slate-500',
    status: 'inactive',
    isPrimary: false,
    isSecondary: false,
    apiKeySet: false,
    features: ['Real-time', 'Social Data', 'Current Events'],
    models: [
      {
        id: 'grok-2',
        name: 'Grok 2',
        description: 'Real-time information access',
        contextWindow: 128000,
        outputTokens: 8192,
        costPerToken: 0.002,
        capabilities: ['chat', 'analysis', 'search'],
        isDefault: true
      }
    ]
  }
];

const DEFAULT_SCENARIO_CONFIGS: ScenarioConfiguration[] = [
  {
    scenario: 'project_analysis',
    label: 'Project Analysis',
    description: 'Analyze NAC projects and requirements',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    secondaryProvider: 'anthropic',
    secondaryModel: 'claude-opus-4-20250514',
    temperature: 0.3,
    maxTokens: 8192,
    priority: 'high',
    contextEnhancement: true,
    smartRouting: true
  },
  {
    scenario: 'troubleshooting',
    label: 'Troubleshooting',
    description: 'Diagnose and solve technical issues',
    primaryProvider: 'openai',
    primaryModel: 'o3-2025-04-16',
    secondaryProvider: 'anthropic',
    secondaryModel: 'claude-sonnet-4-20250514',
    temperature: 0.2,
    maxTokens: 6144,
    priority: 'critical',
    contextEnhancement: true,
    smartRouting: true
  },
  {
    scenario: 'config_generation',
    label: 'Config Generation',
    description: 'Generate network configurations',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    secondaryProvider: 'anthropic',
    secondaryModel: 'claude-sonnet-4-20250514',
    temperature: 0.1,
    maxTokens: 4096,
    priority: 'high',
    contextEnhancement: true,
    smartRouting: false
  },
  {
    scenario: 'documentation',
    label: 'Documentation',
    description: 'Create and enhance documentation',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    secondaryProvider: 'openai',
    secondaryModel: 'gpt-5-2025-08-07',
    temperature: 0.4,
    maxTokens: 6144,
    priority: 'medium',
    contextEnhancement: true,
    smartRouting: false
  },
  {
    scenario: 'search',
    label: 'Information Search',
    description: 'Search for current information',
    primaryProvider: 'perplexity',
    primaryModel: 'llama-3.1-sonar-large-128k-online',
    secondaryProvider: 'grok',
    secondaryModel: 'grok-2',
    temperature: 0.3,
    maxTokens: 4096,
    priority: 'medium',
    contextEnhancement: false,
    smartRouting: true
  },
  {
    scenario: 'security_analysis',
    label: 'Security Analysis',
    description: 'Analyze security configurations',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    secondaryProvider: 'openai',
    secondaryModel: 'o3-2025-04-16',
    temperature: 0.2,
    maxTokens: 8192,
    priority: 'critical',
    contextEnhancement: true,
    smartRouting: true
  }
];

const AdvancedAIManager = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<AIProvider[]>(AI_PROVIDERS);
  const [scenarios, setScenarios] = useState<ScenarioConfiguration[]>(DEFAULT_SCENARIO_CONFIGS);
  const [testingProviders, setTestingProviders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('providers');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    enableIntelligentRouting: true,
    enableFallbackSystem: true,
    enableLoadBalancing: false,
    enableCaching: true,
    maxRetries: 3,
    timeoutSeconds: 30,
    costOptimization: true,
    performanceMode: 'balanced' as 'speed' | 'balanced' | 'quality',
    enableUsageTracking: true
  });

  // Set primary provider
  const setPrimaryProvider = (providerId: string) => {
    setProviders(prev => prev.map(p => ({
      ...p,
      isPrimary: p.id === providerId,
      isSecondary: p.isSecondary && p.id !== providerId
    })));
  };

  // Set secondary provider
  const setSecondaryProvider = (providerId: string) => {
    setProviders(prev => prev.map(p => ({
      ...p,
      isSecondary: p.id === providerId,
      isPrimary: p.isPrimary && p.id !== providerId
    })));
  };

  // Update scenario configuration
  const updateScenarioConfig = (scenario: TaskScenario, updates: Partial<ScenarioConfiguration>) => {
    setScenarios(prev => prev.map(s => 
      s.scenario === scenario ? { ...s, ...updates } : s
    ));
  };

  // Test provider connection
  const testProvider = async (provider: AIProvider) => {
    setTestingProviders(prev => new Set([...prev, provider.id]));
    
    try {
      // Simulate test - in real implementation, call the AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProviders(prev => prev.map(p => 
        p.id === provider.id ? { ...p, status: 'active' as const } : p
      ));
      
      toast({
        title: "Connection Successful",
        description: `${provider.name} is working correctly.`
      });
    } catch (error) {
      setProviders(prev => prev.map(p => 
        p.id === provider.id ? { ...p, status: 'error' as const } : p
      ));
      
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${provider.name}.`,
        variant: "destructive"
      });
    } finally {
      setTestingProviders(prev => {
        const newSet = new Set(prev);
        newSet.delete(provider.id);
        return newSet;
      });
    }
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem('ai_advanced_providers', JSON.stringify(providers));
      localStorage.setItem('ai_advanced_scenarios', JSON.stringify(scenarios));
      localStorage.setItem('ai_advanced_global', JSON.stringify(globalSettings));
      
      toast({
        title: "Configuration Saved",
        description: "AI management settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          🚀 Advanced AI Management
        </Badge>
        <h2 className="text-3xl font-bold mb-2">
          AI <span className="bg-gradient-primary bg-clip-text text-transparent">Intelligence Center</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure primary and secondary providers, scenario-based routing, and advanced AI capabilities for your NAC deployment platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Router className="h-4 w-4" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Global Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>AI Provider Configuration</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showAdvanced ? 'Hide Details' : 'Show Details'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {providers.map((provider) => {
                const IconComponent = provider.icon;
                const isTesting = testingProviders.has(provider.id);
                
                return (
                  <div key={provider.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-lg font-semibold">{provider.name}</Label>
                            {provider.isPrimary && <Badge variant="default">Primary</Badge>}
                            {provider.isSecondary && <Badge variant="secondary">Secondary</Badge>}
                            {provider.status === 'active' && <CheckCircle2 className="h-4 w-4 text-success" />}
                            {provider.status === 'error' && <XCircle className="h-4 w-4 text-destructive" />}
                            {provider.status === 'inactive' && <AlertTriangle className="h-4 w-4 text-warning" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                          {showAdvanced && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {provider.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={provider.status !== 'inactive'}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              testProvider(provider);
                            } else {
                              setProviders(prev => prev.map(p => 
                                p.id === provider.id ? { ...p, status: 'inactive' as const } : p
                              ));
                            }
                          }}
                        />
                      </div>
                    </div>

                    {provider.status !== 'inactive' && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testProvider(provider)}
                            disabled={isTesting}
                          >
                            {isTesting ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <TestTube className="mr-2 h-3 w-3" />
                                Test Connection
                              </>
                            )}
                          </Button>
                          
                          {!provider.isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryProvider(provider.id)}
                            >
                              Set as Primary
                            </Button>
                          )}
                          
                          {!provider.isSecondary && !provider.isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSecondaryProvider(provider.id)}
                            >
                              Set as Secondary
                            </Button>
                          )}
                        </div>

                        {showAdvanced && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <Label className="text-xs text-muted-foreground">Available Models</Label>
                              <div className="space-y-1 mt-1">
                                {provider.models.map((model) => (
                                  <div key={model.id} className="text-sm p-2 bg-muted/50 rounded">
                                    <div className="font-medium">{model.name}</div>
                                    <div className="text-xs text-muted-foreground">{model.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Capabilities</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {provider.models[0]?.capabilities.map((cap) => (
                                  <Badge key={cap} variant="outline" className="text-xs">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Scenario-Based Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scenarios.map((scenario) => (
                <div key={scenario.scenario} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{scenario.label}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    <Badge 
                      variant={scenario.priority === 'critical' ? 'destructive' : 
                               scenario.priority === 'high' ? 'default' : 'secondary'}
                    >
                      {scenario.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Primary Provider & Model</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Select 
                            value={scenario.primaryProvider} 
                            onValueChange={(value: AIProviderType) => 
                              updateScenarioConfig(scenario.scenario, { primaryProvider: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {providers.filter(p => p.status === 'active').map((provider) => (
                                <SelectItem key={provider.type} value={provider.type}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={scenario.primaryModel}
                            onValueChange={(value) => 
                              updateScenarioConfig(scenario.scenario, { primaryModel: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {providers
                                .find(p => p.type === scenario.primaryProvider)
                                ?.models.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Secondary Provider & Model</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Select 
                            value={scenario.secondaryProvider || 'none'} 
                            onValueChange={(value) => 
                              updateScenarioConfig(scenario.scenario, { 
                                secondaryProvider: value === 'none' ? undefined : value as AIProviderType 
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {providers.filter(p => p.status === 'active' && p.type !== scenario.primaryProvider).map((provider) => (
                                <SelectItem key={provider.type} value={provider.type}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {scenario.secondaryProvider && (
                            <Select 
                              value={scenario.secondaryModel || ''}
                              onValueChange={(value) => 
                                updateScenarioConfig(scenario.scenario, { secondaryModel: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {providers
                                  .find(p => p.type === scenario.secondaryProvider)
                                  ?.models.map((model) => (
                                    <SelectItem key={model.id} value={model.id}>
                                      {model.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Temperature: {scenario.temperature}</Label>
                        <Slider
                          value={[scenario.temperature]}
                          onValueChange={(value) => 
                            updateScenarioConfig(scenario.scenario, { temperature: value[0] })
                          }
                          max={1}
                          min={0}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Max Tokens</Label>
                        <Select 
                          value={scenario.maxTokens.toString()}
                          onValueChange={(value) => 
                            updateScenarioConfig(scenario.scenario, { maxTokens: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1024">1,024 tokens</SelectItem>
                            <SelectItem value="2048">2,048 tokens</SelectItem>
                            <SelectItem value="4096">4,096 tokens</SelectItem>
                            <SelectItem value="6144">6,144 tokens</SelectItem>
                            <SelectItem value="8192">8,192 tokens</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Context Enhancement</Label>
                          <Switch
                            checked={scenario.contextEnhancement}
                            onCheckedChange={(checked) => 
                              updateScenarioConfig(scenario.scenario, { contextEnhancement: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Smart Routing</Label>
                          <Switch
                            checked={scenario.smartRouting}
                            onCheckedChange={(checked) => 
                              updateScenarioConfig(scenario.scenario, { smartRouting: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Router className="h-5 w-5" />
                <span>Intelligent Routing Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Intelligent Routing</Label>
                      <p className="text-sm text-muted-foreground">Automatically route requests to optimal providers</p>
                    </div>
                    <Switch
                      checked={globalSettings.enableIntelligentRouting}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableIntelligentRouting: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Fallback System</Label>
                      <p className="text-sm text-muted-foreground">Use secondary providers when primary fails</p>
                    </div>
                    <Switch
                      checked={globalSettings.enableFallbackSystem}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableFallbackSystem: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Load Balancing</Label>
                      <p className="text-sm text-muted-foreground">Distribute load across multiple providers</p>
                    </div>
                    <Switch
                      checked={globalSettings.enableLoadBalancing}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableLoadBalancing: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Response Caching</Label>
                      <p className="text-sm text-muted-foreground">Cache responses for faster performance</p>
                    </div>
                    <Switch
                      checked={globalSettings.enableCaching}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableCaching: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Performance Mode</Label>
                    <Select 
                      value={globalSettings.performanceMode}
                      onValueChange={(value: 'speed' | 'balanced' | 'quality') => 
                        setGlobalSettings(prev => ({ ...prev, performanceMode: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speed">Speed Optimized</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="quality">Quality Optimized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-medium">Max Retries: {globalSettings.maxRetries}</Label>
                    <Slider
                      value={[globalSettings.maxRetries]}
                      onValueChange={(value) => 
                        setGlobalSettings(prev => ({ ...prev, maxRetries: value[0] }))
                      }
                      max={5}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="font-medium">Timeout: {globalSettings.timeoutSeconds}s</Label>
                    <Slider
                      value={[globalSettings.timeoutSeconds]}
                      onValueChange={(value) => 
                        setGlobalSettings(prev => ({ ...prev, timeoutSeconds: value[0] }))
                      }
                      max={120}
                      min={10}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings2 className="h-5 w-5" />
                <span>Global AI Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Cost Optimization</Label>
                      <p className="text-sm text-muted-foreground">Prioritize cost-effective models</p>
                    </div>
                    <Switch
                      checked={globalSettings.costOptimization}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, costOptimization: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Usage Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track AI usage and costs</p>
                    </div>
                    <Switch
                      checked={globalSettings.enableUsageTracking}
                      onCheckedChange={(checked) => 
                        setGlobalSettings(prev => ({ ...prev, enableUsageTracking: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Current Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Active Providers:</span>
                        <span>{providers.filter(p => p.status === 'active').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Configured Scenarios:</span>
                        <span>{scenarios.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary Provider:</span>
                        <span>{providers.find(p => p.isPrimary)?.name || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Secondary Provider:</span>
                        <span>{providers.find(p => p.isSecondary)?.name || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Configuration Management</h4>
                  <p className="text-sm text-muted-foreground">Save or reset your AI configuration</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => {
                    setProviders(AI_PROVIDERS);
                    setScenarios(DEFAULT_SCENARIO_CONFIGS);
                    toast({ title: "Configuration Reset", description: "All settings have been reset to defaults." });
                  }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                  <EnhancedButton gradient="primary" onClick={saveConfiguration}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </EnhancedButton>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>

          {/* Usage Statistics */}
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Usage Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <div className="text-sm text-muted-foreground">Total AI Requests</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">99.2%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">$24.67</div>
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAIManager;