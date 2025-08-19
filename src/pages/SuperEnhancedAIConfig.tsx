import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, Save, Key, Eye, EyeOff, Settings, Brain, Zap, Shield, 
  Activity, BarChart3, Clock, DollarSign, AlertTriangle, CheckCircle,
  TrendingUp, Monitor, Database, Cpu, Network, Lock, Users, Globe,
  Target, TestTube, Cog, LineChart, PieChart, FileText, Code,
  Layers, GitBranch, Rocket, Star, Gauge, Wrench, Bot, Sparkles
} from "lucide-react";
import AIProviderSetup from "@/components/ai/AIProviderSetup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIInsightsDashboard } from "@/components/ai/AIInsightsDashboard";
import { Separator } from "@/components/ui/separator";

interface SuperEnhancedAIConfig {
  // Core Settings
  primaryProvider: string;
  secondaryProvider: string;
  fallbackProvider: string;
  loadBalancing: {
    enabled: boolean;
    strategy: 'round_robin' | 'least_latency' | 'weighted' | 'intelligent';
    weights: Record<string, number>;
  };
  
  // Advanced Model Configuration
  modelConfig: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    systemPromptOptimization: boolean;
    contextWindowManagement: boolean;
    streamingEnabled: boolean;
  };

  // Security & Privacy
  security: {
    dataEncryption: boolean;
    requestLogging: boolean;
    auditTrail: boolean;
    dataRetentionDays: number;
    piiDetection: boolean;
    contentFiltering: boolean;
    rateLimiting: {
      enabled: boolean;
      requestsPerMinute: number;
      burstLimit: number;
    };
  };

  // Performance & Optimization
  performance: {
    caching: {
      enabled: boolean;
      ttlMinutes: number;
      smartCaching: boolean;
    };
    responseOptimization: boolean;
    tokenOptimization: boolean;
    parallelProcessing: boolean;
    batchProcessing: {
      enabled: boolean;
      batchSize: number;
      maxWaitTime: number;
    };
  };

  // Cost Management
  costManagement: {
    budgetLimit: number;
    alertThreshold: number;
    costOptimization: boolean;
    tokenBudgeting: boolean;
    providerCostAnalysis: boolean;
    autoScaling: {
      enabled: boolean;
      scaleDownThreshold: number;
      scaleUpThreshold: number;
    };
  };

  // Quality Assurance
  qualityAssurance: {
    outputValidation: boolean;
    responseFiltering: boolean;
    qualityScoring: boolean;
    a_bTesting: {
      enabled: boolean;
      trafficSplit: number;
      metrics: string[];
    };
    benchmarking: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      metrics: string[];
    };
  };

  // Advanced Features
  advancedFeatures: {
    multiModal: boolean;
    codeGeneration: boolean;
    documentAnalysis: boolean;
    imageGeneration: boolean;
    dataExtraction: boolean;
    sentimentAnalysis: boolean;
    languageDetection: boolean;
    summarization: boolean;
    translation: boolean;
    customWorkflows: boolean;
  };

  // Monitoring & Analytics
  monitoring: {
    realTimeMetrics: boolean;
    performanceAlerts: boolean;
    usageAnalytics: boolean;
    errorTracking: boolean;
    latencyMonitoring: boolean;
    customDashboards: boolean;
    reportGeneration: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      recipients: string[];
    };
  };

  // Integration Settings
  integration: {
    webhooks: {
      enabled: boolean;
      urls: string[];
      events: string[];
    };
    apiAccess: {
      enabled: boolean;
      rateLimits: Record<string, number>;
      accessKeys: string[];
    };
    thirdPartyIntegrations: {
      slack: boolean;
      teams: boolean;
      discord: boolean;
      email: boolean;
    };
  };

  // Workflow Automation
  workflows: {
    autoRetry: {
      enabled: boolean;
      maxAttempts: number;
      backoffStrategy: 'linear' | 'exponential';
    };
    smartRouting: {
      enabled: boolean;
      rules: Array<{
        condition: string;
        provider: string;
        model: string;
      }>;
    };
    preprocessing: {
      enabled: boolean;
      steps: string[];
    };
    postprocessing: {
      enabled: boolean;
      steps: string[];
    };
  };
}

const PROVIDERS = [
  { 
    type: 'openai', 
    name: 'OpenAI', 
    icon: '🤖', 
    models: ['gpt-5-2025-08-07', 'gpt-5-mini-2025-08-07', 'gpt-4.1-2025-04-14', 'o3-2025-04-16'],
    defaultModel: 'gpt-5-2025-08-07',
    costPerToken: 0.00002,
    features: ['text', 'code', 'analysis', 'reasoning']
  },
  { 
    type: 'anthropic', 
    name: 'Claude', 
    icon: '🧠', 
    models: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
    defaultModel: 'claude-sonnet-4-20250514',
    costPerToken: 0.000025,
    features: ['text', 'analysis', 'reasoning', 'safety']
  },
  { 
    type: 'google', 
    name: 'Gemini', 
    icon: '✨', 
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash-exp',
    costPerToken: 0.000015,
    features: ['text', 'multimodal', 'code', 'analysis']
  },
  { 
    type: 'perplexity', 
    name: 'Perplexity', 
    icon: '🔍', 
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
    defaultModel: 'llama-3.1-sonar-large-128k-online',
    costPerToken: 0.00001,
    features: ['search', 'real-time', 'web-access']
  },
  { 
    type: 'grok', 
    name: 'Grok', 
    icon: '🚀', 
    models: ['grok-2-latest', 'grok-2-mini'],
    defaultModel: 'grok-2-latest',
    costPerToken: 0.00003,
    features: ['text', 'real-time', 'social']
  }
];

const DEFAULT_CONFIG: SuperEnhancedAIConfig = {
  primaryProvider: 'openai',
  secondaryProvider: 'anthropic',
  fallbackProvider: 'google',
  loadBalancing: {
    enabled: true,
    strategy: 'intelligent',
    weights: { openai: 0.5, anthropic: 0.3, google: 0.2 }
  },
  modelConfig: {
    temperature: 0.7,
    maxTokens: 4000,
    topP: 0.95,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    systemPromptOptimization: true,
    contextWindowManagement: true,
    streamingEnabled: true
  },
  security: {
    dataEncryption: true,
    requestLogging: true,
    auditTrail: true,
    dataRetentionDays: 30,
    piiDetection: true,
    contentFiltering: true,
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 200
    }
  },
  performance: {
    caching: {
      enabled: true,
      ttlMinutes: 60,
      smartCaching: true
    },
    responseOptimization: true,
    tokenOptimization: true,
    parallelProcessing: true,
    batchProcessing: {
      enabled: true,
      batchSize: 10,
      maxWaitTime: 5000
    }
  },
  costManagement: {
    budgetLimit: 1000,
    alertThreshold: 80,
    costOptimization: true,
    tokenBudgeting: true,
    providerCostAnalysis: true,
    autoScaling: {
      enabled: true,
      scaleDownThreshold: 20,
      scaleUpThreshold: 80
    }
  },
  qualityAssurance: {
    outputValidation: true,
    responseFiltering: true,
    qualityScoring: true,
    a_bTesting: {
      enabled: true,
      trafficSplit: 50,
      metrics: ['response_time', 'quality_score', 'user_satisfaction']
    },
    benchmarking: {
      enabled: true,
      frequency: 'weekly',
      metrics: ['accuracy', 'speed', 'cost_efficiency']
    }
  },
  advancedFeatures: {
    multiModal: true,
    codeGeneration: true,
    documentAnalysis: true,
    imageGeneration: true,
    dataExtraction: true,
    sentimentAnalysis: true,
    languageDetection: true,
    summarization: true,
    translation: true,
    customWorkflows: true
  },
  monitoring: {
    realTimeMetrics: true,
    performanceAlerts: true,
    usageAnalytics: true,
    errorTracking: true,
    latencyMonitoring: true,
    customDashboards: true,
    reportGeneration: {
      enabled: true,
      frequency: 'weekly',
      recipients: []
    }
  },
  integration: {
    webhooks: {
      enabled: true,
      urls: [],
      events: ['completion', 'error', 'quota_exceeded']
    },
    apiAccess: {
      enabled: true,
      rateLimits: {},
      accessKeys: []
    },
    thirdPartyIntegrations: {
      slack: false,
      teams: false,
      discord: false,
      email: true
    }
  },
  workflows: {
    autoRetry: {
      enabled: true,
      maxAttempts: 3,
      backoffStrategy: 'exponential'
    },
    smartRouting: {
      enabled: true,
      rules: []
    },
    preprocessing: {
      enabled: true,
      steps: ['validate_input', 'optimize_prompt', 'add_context']
    },
    postprocessing: {
      enabled: true,
      steps: ['validate_output', 'format_response', 'log_metrics']
    }
  }
};

export const SuperEnhancedAIConfig: React.FC = () => {
  const [config, setConfig] = useState<SuperEnhancedAIConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState({
    totalRequests: 15420,
    avgResponseTime: 1250,
    successRate: 98.5,
    monthlySpend: 342.50,
    tokensUsed: 2850000
  });
  const { toast } = useToast();

  useEffect(() => {
    loadConfiguration();
    loadMetrics();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'super_enhanced_ai_config')
        .single();

      if (data?.setting_value) {
        setConfig({ ...DEFAULT_CONFIG, ...(data.setting_value as Partial<SuperEnhancedAIConfig>) });
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      // Load real-time metrics from analytics
      const { data } = await supabase
        .from('ai_usage_analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (data) {
        const totalRequests = data.length;
        const avgResponseTime = data.reduce((sum, record) => sum + (record.response_time_ms || 0), 0) / totalRequests;
        const successRate = (data.filter(record => record.success).length / totalRequests) * 100;
        const monthlySpend = data.reduce((sum, record) => sum + (record.cost_cents || 0), 0) / 100;
        const tokensUsed = data.reduce((sum, record) => sum + (record.tokens_used || 0), 0);

        setMetrics({
          totalRequests,
          avgResponseTime: Math.round(avgResponseTime),
          successRate: Math.round(successRate * 10) / 10,
          monthlySpend: Math.round(monthlySpend * 100) / 100,
          tokensUsed
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'super_enhanced_ai_config',
          setting_value: config as any,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Super Enhanced AI configuration saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const keys = path.split('.');
      const newConfig = { ...prev };
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading Super Enhanced AI Configuration...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Super Enhanced AI Configuration Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced AI management with enterprise-grade features, monitoring, and optimization
              </p>
            </div>
            <Button 
              onClick={saveConfiguration} 
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{metrics.avgResponseTime}ms</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{metrics.successRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Spend</p>
                  <p className="text-2xl font-bold">${metrics.monthlySpend}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Used</p>
                  <p className="text-2xl font-bold">{(metrics.tokensUsed / 1000000).toFixed(1)}M</p>
                </div>
                <Cpu className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Configuration Interface */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-card via-card to-muted/5">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span>Advanced AI Configuration Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-9 h-12">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Insights</span>
                </TabsTrigger>
                <TabsTrigger value="providers" className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <span>Providers</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="cost" className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Cost</span>
                </TabsTrigger>
                <TabsTrigger value="quality" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Quality</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Features</span>
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Monitoring</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Quick Configuration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary AI Provider</Label>
                        <Select 
                          value={config.primaryProvider} 
                          onValueChange={(value) => updateConfig('primaryProvider', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVIDERS.map(provider => (
                              <SelectItem key={provider.type} value={provider.type}>
                                {provider.icon} {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Load Balancing Strategy</Label>
                        <Select 
                          value={config.loadBalancing.strategy} 
                          onValueChange={(value) => updateConfig('loadBalancing.strategy', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intelligent">🧠 Intelligent</SelectItem>
                            <SelectItem value="round_robin">🔄 Round Robin</SelectItem>
                            <SelectItem value="least_latency">⚡ Least Latency</SelectItem>
                            <SelectItem value="weighted">⚖️ Weighted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Load Balancing Enabled</Label>
                        <Switch 
                          checked={config.loadBalancing.enabled}
                          onCheckedChange={(checked) => updateConfig('loadBalancing.enabled', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wrench className="h-5 w-5" />
                        <span>Model Parameters</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Temperature: {config.modelConfig.temperature}</Label>
                        <Slider
                          value={[config.modelConfig.temperature]}
                          onValueChange={([value]) => updateConfig('modelConfig.temperature', value)}
                          max={2}
                          min={0}
                          step={0.1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Max Tokens: {config.modelConfig.maxTokens}</Label>
                        <Slider
                          value={[config.modelConfig.maxTokens]}
                          onValueChange={([value]) => updateConfig('modelConfig.maxTokens', value)}
                          max={8000}
                          min={100}
                          step={100}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Context Window Management</Label>
                        <Switch 
                          checked={config.modelConfig.contextWindowManagement}
                          onCheckedChange={(checked) => updateConfig('modelConfig.contextWindowManagement', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Streaming Enabled</Label>
                        <Switch 
                          checked={config.modelConfig.streamingEnabled}
                          onCheckedChange={(checked) => updateConfig('modelConfig.streamingEnabled', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This is a super-enhanced AI configuration center with enterprise-grade features. 
                    Changes will affect all AI operations across the platform.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <AIInsightsDashboard />
              </TabsContent>

              {/* API Provider Setup Tab */}
              <TabsContent value="providers" className="space-y-6">
                <AIProviderSetup />
                
                <Separator />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PROVIDERS.map(provider => (
                    <Card key={provider.type} className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{provider.icon}</span>
                            <span>{provider.name}</span>
                          </div>
                          <Badge variant="outline">
                            ${provider.costPerToken.toFixed(6)}/token
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm">Default Model</Label>
                          <p className="text-sm text-muted-foreground">{provider.defaultModel}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Features</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.features.map(feature => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Weight in Load Balancing</Label>
                          <Slider
                            value={[config.loadBalancing.weights[provider.type] || 0]}
                            onValueChange={([value]) => updateConfig(`loadBalancing.weights.${provider.type}`, value)}
                            max={1}
                            min={0}
                            step={0.1}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Caching Configuration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Caching</Label>
                        <Switch 
                          checked={config.performance.caching.enabled}
                          onCheckedChange={(checked) => updateConfig('performance.caching.enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Cache TTL (minutes): {config.performance.caching.ttlMinutes}</Label>
                        <Slider
                          value={[config.performance.caching.ttlMinutes]}
                          onValueChange={([value]) => updateConfig('performance.caching.ttlMinutes', value)}
                          max={1440}
                          min={5}
                          step={5}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Smart Caching</Label>
                        <Switch 
                          checked={config.performance.caching.smartCaching}
                          onCheckedChange={(checked) => updateConfig('performance.caching.smartCaching', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Layers className="h-5 w-5" />
                        <span>Batch Processing</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Batch Processing</Label>
                        <Switch 
                          checked={config.performance.batchProcessing.enabled}
                          onCheckedChange={(checked) => updateConfig('performance.batchProcessing.enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Batch Size: {config.performance.batchProcessing.batchSize}</Label>
                        <Slider
                          value={[config.performance.batchProcessing.batchSize]}
                          onValueChange={([value]) => updateConfig('performance.batchProcessing.batchSize', value)}
                          max={100}
                          min={1}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Max Wait Time (ms): {config.performance.batchProcessing.maxWaitTime}</Label>
                        <Slider
                          value={[config.performance.batchProcessing.maxWaitTime]}
                          onValueChange={([value]) => updateConfig('performance.batchProcessing.maxWaitTime', value)}
                          max={30000}
                          min={1000}
                          step={1000}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Optimization Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Response Optimization</Label>
                        <Switch 
                          checked={config.performance.responseOptimization}
                          onCheckedChange={(checked) => updateConfig('performance.responseOptimization', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Token Optimization</Label>
                        <Switch 
                          checked={config.performance.tokenOptimization}
                          onCheckedChange={(checked) => updateConfig('performance.tokenOptimization', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Parallel Processing</Label>
                        <Switch 
                          checked={config.performance.parallelProcessing}
                          onCheckedChange={(checked) => updateConfig('performance.parallelProcessing', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>System Prompt Optimization</Label>
                        <Switch 
                          checked={config.modelConfig.systemPromptOptimization}
                          onCheckedChange={(checked) => updateConfig('modelConfig.systemPromptOptimization', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Security settings are enterprise-grade and comply with SOC 2, GDPR, and HIPAA standards.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lock className="h-5 w-5" />
                        <span>Data Protection</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Data Encryption</Label>
                        <Switch 
                          checked={config.security.dataEncryption}
                          onCheckedChange={(checked) => updateConfig('security.dataEncryption', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>PII Detection</Label>
                        <Switch 
                          checked={config.security.piiDetection}
                          onCheckedChange={(checked) => updateConfig('security.piiDetection', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Content Filtering</Label>
                        <Switch 
                          checked={config.security.contentFiltering}
                          onCheckedChange={(checked) => updateConfig('security.contentFiltering', checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Data Retention (days): {config.security.dataRetentionDays}</Label>
                        <Slider
                          value={[config.security.dataRetentionDays]}
                          onValueChange={([value]) => updateConfig('security.dataRetentionDays', value)}
                          max={365}
                          min={1}
                          step={1}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Network className="h-5 w-5" />
                        <span>Rate Limiting</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Rate Limiting</Label>
                        <Switch 
                          checked={config.security.rateLimiting.enabled}
                          onCheckedChange={(checked) => updateConfig('security.rateLimiting.enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Requests/Minute: {config.security.rateLimiting.requestsPerMinute}</Label>
                        <Slider
                          value={[config.security.rateLimiting.requestsPerMinute]}
                          onValueChange={([value]) => updateConfig('security.rateLimiting.requestsPerMinute', value)}
                          max={1000}
                          min={1}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Burst Limit: {config.security.rateLimiting.burstLimit}</Label>
                        <Slider
                          value={[config.security.rateLimiting.burstLimit]}
                          onValueChange={([value]) => updateConfig('security.rateLimiting.burstLimit', value)}
                          max={2000}
                          min={1}
                          step={1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Audit & Logging</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Request Logging</Label>
                        <Switch 
                          checked={config.security.requestLogging}
                          onCheckedChange={(checked) => updateConfig('security.requestLogging', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Audit Trail</Label>
                        <Switch 
                          checked={config.security.auditTrail}
                          onCheckedChange={(checked) => updateConfig('security.auditTrail', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cost Management Tab */}
              <TabsContent value="cost" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Budget Control</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Monthly Budget Limit ($): {config.costManagement.budgetLimit}</Label>
                        <Slider
                          value={[config.costManagement.budgetLimit]}
                          onValueChange={([value]) => updateConfig('costManagement.budgetLimit', value)}
                          max={10000}
                          min={10}
                          step={10}
                        />
                        <Progress 
                          value={(metrics.monthlySpend / config.costManagement.budgetLimit) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          Current spend: ${metrics.monthlySpend} / ${config.costManagement.budgetLimit}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Alert Threshold (%): {config.costManagement.alertThreshold}</Label>
                        <Slider
                          value={[config.costManagement.alertThreshold]}
                          onValueChange={([value]) => updateConfig('costManagement.alertThreshold', value)}
                          max={100}
                          min={10}
                          step={5}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Auto Scaling</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Auto Scaling</Label>
                        <Switch 
                          checked={config.costManagement.autoScaling.enabled}
                          onCheckedChange={(checked) => updateConfig('costManagement.autoScaling.enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Scale Down Threshold (%): {config.costManagement.autoScaling.scaleDownThreshold}</Label>
                        <Slider
                          value={[config.costManagement.autoScaling.scaleDownThreshold]}
                          onValueChange={([value]) => updateConfig('costManagement.autoScaling.scaleDownThreshold', value)}
                          max={50}
                          min={5}
                          step={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Scale Up Threshold (%): {config.costManagement.autoScaling.scaleUpThreshold}</Label>
                        <Slider
                          value={[config.costManagement.autoScaling.scaleUpThreshold]}
                          onValueChange={([value]) => updateConfig('costManagement.autoScaling.scaleUpThreshold', value)}
                          max={100}
                          min={50}
                          step={5}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Cost Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Cost Optimization</Label>
                        <Switch 
                          checked={config.costManagement.costOptimization}
                          onCheckedChange={(checked) => updateConfig('costManagement.costOptimization', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Token Budgeting</Label>
                        <Switch 
                          checked={config.costManagement.tokenBudgeting}
                          onCheckedChange={(checked) => updateConfig('costManagement.tokenBudgeting', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Provider Cost Analysis</Label>
                        <Switch 
                          checked={config.costManagement.providerCostAnalysis}
                          onCheckedChange={(checked) => updateConfig('costManagement.providerCostAnalysis', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quality Assurance Tab */}
              <TabsContent value="quality" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TestTube className="h-5 w-5" />
                        <span>A/B Testing</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable A/B Testing</Label>
                        <Switch 
                          checked={config.qualityAssurance.a_bTesting.enabled}
                          onCheckedChange={(checked) => updateConfig('qualityAssurance.a_bTesting.enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Traffic Split (%): {config.qualityAssurance.a_bTesting.trafficSplit}</Label>
                        <Slider
                          value={[config.qualityAssurance.a_bTesting.trafficSplit]}
                          onValueChange={([value]) => updateConfig('qualityAssurance.a_bTesting.trafficSplit', value)}
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Metrics to Track</Label>
                        <div className="flex flex-wrap gap-2">
                          {['response_time', 'quality_score', 'user_satisfaction', 'cost_efficiency'].map(metric => (
                            <Badge 
                              key={metric} 
                              variant={config.qualityAssurance.a_bTesting.metrics.includes(metric) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const metrics = config.qualityAssurance.a_bTesting.metrics.includes(metric)
                                  ? config.qualityAssurance.a_bTesting.metrics.filter(m => m !== metric)
                                  : [...config.qualityAssurance.a_bTesting.metrics, metric];
                                updateConfig('qualityAssurance.a_bTesting.metrics', metrics);
                              }}
                            >
                              {metric.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5" />
                        <span>Quality Control</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Output Validation</Label>
                        <Switch 
                          checked={config.qualityAssurance.outputValidation}
                          onCheckedChange={(checked) => updateConfig('qualityAssurance.outputValidation', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Response Filtering</Label>
                        <Switch 
                          checked={config.qualityAssurance.responseFiltering}
                          onCheckedChange={(checked) => updateConfig('qualityAssurance.responseFiltering', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Quality Scoring</Label>
                        <Switch 
                          checked={config.qualityAssurance.qualityScoring}
                          onCheckedChange={(checked) => updateConfig('qualityAssurance.qualityScoring', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Benchmarking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Benchmarking</Label>
                      <Switch 
                        checked={config.qualityAssurance.benchmarking.enabled}
                        onCheckedChange={(checked) => updateConfig('qualityAssurance.benchmarking.enabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select 
                        value={config.qualityAssurance.benchmarking.frequency} 
                        onValueChange={(value) => updateConfig('qualityAssurance.benchmarking.frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>AI Capabilities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(config.advancedFeatures).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                          <Label className="text-sm capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Label>
                          <Switch 
                            checked={enabled}
                            onCheckedChange={(checked) => updateConfig(`advancedFeatures.${feature}`, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GitBranch className="h-5 w-5" />
                      <span>Workflow Automation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Auto Retry Configuration</h4>
                        <div className="flex items-center justify-between">
                          <Label>Enable Auto Retry</Label>
                          <Switch 
                            checked={config.workflows.autoRetry.enabled}
                            onCheckedChange={(checked) => updateConfig('workflows.autoRetry.enabled', checked)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Max Attempts: {config.workflows.autoRetry.maxAttempts}</Label>
                          <Slider
                            value={[config.workflows.autoRetry.maxAttempts]}
                            onValueChange={([value]) => updateConfig('workflows.autoRetry.maxAttempts', value)}
                            max={10}
                            min={1}
                            step={1}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Backoff Strategy</Label>
                          <Select 
                            value={config.workflows.autoRetry.backoffStrategy} 
                            onValueChange={(value) => updateConfig('workflows.autoRetry.backoffStrategy', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="exponential">Exponential</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Smart Routing</h4>
                        <div className="flex items-center justify-between">
                          <Label>Enable Smart Routing</Label>
                          <Switch 
                            checked={config.workflows.smartRouting.enabled}
                            onCheckedChange={(checked) => updateConfig('workflows.smartRouting.enabled', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Enable Preprocessing</Label>
                          <Switch 
                            checked={config.workflows.preprocessing.enabled}
                            onCheckedChange={(checked) => updateConfig('workflows.preprocessing.enabled', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Enable Postprocessing</Label>
                          <Switch 
                            checked={config.workflows.postprocessing.enabled}
                            onCheckedChange={(checked) => updateConfig('workflows.postprocessing.enabled', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Monitoring Tab */}
              <TabsContent value="monitoring" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span>Real-time Monitoring</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Real-time Metrics</Label>
                        <Switch 
                          checked={config.monitoring.realTimeMetrics}
                          onCheckedChange={(checked) => updateConfig('monitoring.realTimeMetrics', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Performance Alerts</Label>
                        <Switch 
                          checked={config.monitoring.performanceAlerts}
                          onCheckedChange={(checked) => updateConfig('monitoring.performanceAlerts', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Usage Analytics</Label>
                        <Switch 
                          checked={config.monitoring.usageAnalytics}
                          onCheckedChange={(checked) => updateConfig('monitoring.usageAnalytics', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Error Tracking</Label>
                        <Switch 
                          checked={config.monitoring.errorTracking}
                          onCheckedChange={(checked) => updateConfig('monitoring.errorTracking', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Latency Monitoring</Label>
                        <Switch 
                          checked={config.monitoring.latencyMonitoring}
                          onCheckedChange={(checked) => updateConfig('monitoring.latencyMonitoring', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5" />
                        <span>Reports & Dashboards</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Custom Dashboards</Label>
                        <Switch 
                          checked={config.monitoring.customDashboards}
                          onCheckedChange={(checked) => updateConfig('monitoring.customDashboards', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Auto Report Generation</Label>
                        <Switch 
                          checked={config.monitoring.reportGeneration.enabled}
                          onCheckedChange={(checked) => updateConfig('monitoring.reportGeneration.enabled', checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Report Frequency</Label>
                        <Select 
                          value={config.monitoring.reportGeneration.frequency} 
                          onValueChange={(value) => updateConfig('monitoring.reportGeneration.frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Report Recipients</Label>
                        <Textarea
                          placeholder="Enter email addresses separated by commas"
                          value={config.monitoring.reportGeneration.recipients.join(', ')}
                          onChange={(e) => {
                            const emails = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                            updateConfig('monitoring.reportGeneration.recipients', emails);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Integration Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Slack Integration</Label>
                        <Switch 
                          checked={config.integration.thirdPartyIntegrations.slack}
                          onCheckedChange={(checked) => updateConfig('integration.thirdPartyIntegrations.slack', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Teams Integration</Label>
                        <Switch 
                          checked={config.integration.thirdPartyIntegrations.teams}
                          onCheckedChange={(checked) => updateConfig('integration.thirdPartyIntegrations.teams', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Discord Integration</Label>
                        <Switch 
                          checked={config.integration.thirdPartyIntegrations.discord}
                          onCheckedChange={(checked) => updateConfig('integration.thirdPartyIntegrations.discord', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Email Notifications</Label>
                        <Switch 
                          checked={config.integration.thirdPartyIntegrations.email}
                          onCheckedChange={(checked) => updateConfig('integration.thirdPartyIntegrations.email', checked)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Webhooks Enabled</Label>
                        <Switch 
                          checked={config.integration.webhooks.enabled}
                          onCheckedChange={(checked) => updateConfig('integration.webhooks.enabled', checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Webhook URLs</Label>
                        <Textarea
                          placeholder="Enter webhook URLs separated by new lines"
                          value={config.integration.webhooks.urls.join('\n')}
                          onChange={(e) => {
                            const urls = e.target.value.split('\n').map(url => url.trim()).filter(Boolean);
                            updateConfig('integration.webhooks.urls', urls);
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperEnhancedAIConfig;