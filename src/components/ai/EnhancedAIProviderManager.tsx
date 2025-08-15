import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Key, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle,
  Save, TestTube, Brain, Sparkles, Diamond, Globe, Zap,
  Settings, BarChart3, RefreshCw, Shield, Cpu, Cloud
} from 'lucide-react';

export type AIProviderType = 'openai' | 'anthropic' | 'google' | 'perplexity' | 'grok' | 'cohere' | 'mistral';

export type TaskType = 
  | 'chat' 
  | 'code_generation' 
  | 'analysis' 
  | 'summarization' 
  | 'project_insights'
  | 'troubleshooting'
  | 'documentation'
  | 'translation'
  | 'creative_writing'
  | 'data_extraction'
  | 'search'
  | 'reasoning';

interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  contextWindow: number;
  outputTokens: number;
  costPerToken: number;
  isDefault?: boolean;
  supportsVision?: boolean;
  supportsTools?: boolean;
  supportsStreaming?: boolean;
}

interface AIProvider {
  id: string;
  type: AIProviderType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  website: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'error';
  isVisible: boolean;
  lastUsed?: string;
  usageCount: number;
  models: AIModel[];
  features: string[];
}

interface TaskConfiguration {
  taskType: TaskType;
  label: string;
  description: string;
  primaryProvider: AIProviderType;
  primaryModel: string;
  fallbackProvider?: AIProviderType | 'none';
  fallbackModel?: string;
  temperature: number;
  maxTokens: number;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
}

const DEFAULT_PROVIDERS: AIProvider[] = [
  {
    id: '1',
    type: 'openai',
    name: 'OpenAI',
    description: 'Leading AI models including GPT-5 for reasoning and code generation',
    icon: Brain,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    website: 'https://platform.openai.com/api-keys',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    usageCount: 0,
    features: ['Reasoning', 'Code Generation', 'Analysis', 'Vision', 'Function Calling'],
    models: [
      {
        id: 'gpt-5-2025-08-07',
        name: 'GPT-5',
        description: 'Most capable model with superior reasoning',
        capabilities: ['reasoning', 'code_generation', 'analysis', 'creative_writing'],
        contextWindow: 200000,
        outputTokens: 16384,
        costPerToken: 0.00003,
        isDefault: true,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      },
      {
        id: 'gpt-5-mini-2025-08-07',
        name: 'GPT-5 Mini',
        description: 'Fast, cost-efficient version of GPT-5',
        capabilities: ['chat', 'code_generation', 'summarization'],
        contextWindow: 128000,
        outputTokens: 8192,
        costPerToken: 0.00001,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      },
      {
        id: 'o3-2025-04-16',
        name: 'O3',
        description: 'Powerful reasoning model for complex problems',
        capabilities: ['reasoning', 'analysis', 'code_generation'],
        contextWindow: 128000,
        outputTokens: 8192,
        costPerToken: 0.00005,
        supportsTools: true,
        supportsStreaming: true
      }
    ]
  },
  {
    id: '2',
    type: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Advanced reasoning and analysis with safety focus',
    icon: Sparkles,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    website: 'https://console.anthropic.com/',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    usageCount: 0,
    features: ['Long Context', 'Analysis', 'Safety Focus', 'Reasoning'],
    models: [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude 4 Opus',
        description: 'Most capable and intelligent with superior reasoning',
        capabilities: ['reasoning', 'analysis', 'creative_writing', 'code_generation'],
        contextWindow: 200000,
        outputTokens: 8192,
        costPerToken: 0.00075,
        isDefault: true,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      },
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude 4 Sonnet',
        description: 'High-performance with exceptional reasoning and efficiency',
        capabilities: ['reasoning', 'analysis', 'code_generation'],
        contextWindow: 200000,
        outputTokens: 8192,
        costPerToken: 0.0003,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'Fastest model for quick responses',
        capabilities: ['chat', 'summarization', 'data_extraction'],
        contextWindow: 200000,
        outputTokens: 8192,
        costPerToken: 0.00008,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      }
    ]
  },
  {
    id: '3',
    type: 'google',
    name: 'Google Gemini',
    description: 'Multimodal AI with strong reasoning and math capabilities',
    icon: Diamond,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    website: 'https://ai.google.dev/',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    usageCount: 0,
    features: ['Multimodal', 'Math Reasoning', 'Code Generation', 'Long Context'],
    models: [
      {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        description: 'Latest multimodal model with enhanced capabilities',
        capabilities: ['reasoning', 'code_generation', 'analysis', 'creative_writing'],
        contextWindow: 1000000,
        outputTokens: 8192,
        costPerToken: 0.000075,
        isDefault: true,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'High-performance model with excellent reasoning',
        capabilities: ['reasoning', 'analysis', 'code_generation'],
        contextWindow: 2000000,
        outputTokens: 8192,
        costPerToken: 0.0035,
        supportsVision: true,
        supportsTools: true,
        supportsStreaming: true
      }
    ]
  },
  {
    id: '4',
    type: 'perplexity',
    name: 'Perplexity',
    description: 'Real-time search and information retrieval with AI reasoning',
    icon: Globe,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    website: 'https://www.perplexity.ai/settings/api',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    usageCount: 0,
    features: ['Real-time Search', 'Information Retrieval', 'Citation', 'Current Events'],
    models: [
      {
        id: 'llama-3.1-sonar-large-128k-online',
        name: 'Sonar Large Online',
        description: 'Large model with real-time web search capabilities',
        capabilities: ['search', 'analysis', 'summarization'],
        contextWindow: 127072,
        outputTokens: 4096,
        costPerToken: 0.001,
        isDefault: true,
        supportsStreaming: true
      },
      {
        id: 'llama-3.1-sonar-small-128k-online',
        name: 'Sonar Small Online',
        description: 'Faster model for quick searches and summaries',
        capabilities: ['search', 'chat', 'summarization'],
        contextWindow: 127072,
        outputTokens: 4096,
        costPerToken: 0.0002,
        supportsStreaming: true
      }
    ]
  },
  {
    id: '5',
    type: 'grok',
    name: 'Grok (X.AI)',
    description: 'Real-time AI with access to X (Twitter) data and current events',
    icon: Zap,
    color: 'bg-slate-500',
    textColor: 'text-slate-500',
    website: 'https://console.x.ai/',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    usageCount: 0,
    features: ['Real-time Data', 'Social Media Analysis', 'Current Events', 'Humor'],
    models: [
      {
        id: 'grok-2',
        name: 'Grok 2',
        description: 'Latest model with real-time information access',
        capabilities: ['chat', 'analysis', 'creative_writing', 'search'],
        contextWindow: 128000,
        outputTokens: 8192,
        costPerToken: 0.002,
        isDefault: true,
        supportsStreaming: true
      }
    ]
  }
];

const DEFAULT_TASK_CONFIGURATIONS: TaskConfiguration[] = [
  {
    taskType: 'reasoning',
    label: 'Complex Reasoning',
    description: 'Multi-step problem solving and analysis',
    primaryProvider: 'openai',
    primaryModel: 'o3-2025-04-16',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-opus-4-20250514',
    temperature: 0.3,
    maxTokens: 8192,
    reasoningEffort: 'high',
    verbosity: 'medium'
  },
  {
    taskType: 'code_generation',
    label: 'Code Generation',
    description: 'Writing and debugging code',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.1,
    maxTokens: 4096,
    reasoningEffort: 'medium',
    verbosity: 'high'
  },
  {
    taskType: 'analysis',
    label: 'Analysis & Research',
    description: 'Document analysis and research tasks',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    fallbackProvider: 'google',
    fallbackModel: 'gemini-2.0-flash-exp',
    temperature: 0.2,
    maxTokens: 8192,
    verbosity: 'high'
  },
  {
    taskType: 'search',
    label: 'Real-time Search',
    description: 'Current information and web search',
    primaryProvider: 'perplexity',
    primaryModel: 'llama-3.1-sonar-large-128k-online',
    fallbackProvider: 'grok',
    fallbackModel: 'grok-2',
    temperature: 0.3,
    maxTokens: 4096
  },
  {
    taskType: 'chat',
    label: 'General Chat',
    description: 'Conversational AI and general assistance',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-mini-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-3-5-haiku-20241022',
    temperature: 0.7,
    maxTokens: 2048,
    reasoningEffort: 'minimal',
    verbosity: 'medium'
  },
  {
    taskType: 'summarization',
    label: 'Summarization',
    description: 'Summarizing documents and content',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-3-5-haiku-20241022',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-5-mini-2025-08-07',
    temperature: 0.1,
    maxTokens: 1024,
    verbosity: 'low'
  },
  {
    taskType: 'creative_writing',
    label: 'Creative Writing',
    description: 'Creative content generation',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-5-2025-08-07',
    temperature: 0.8,
    maxTokens: 4096,
    verbosity: 'high'
  },
  {
    taskType: 'project_insights',
    label: 'Project Insights',
    description: 'NAC project analysis and recommendations',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.3,
    maxTokens: 6144,
    reasoningEffort: 'medium',
    verbosity: 'high'
  },
  {
    taskType: 'troubleshooting',
    label: 'Troubleshooting',
    description: 'Technical problem diagnosis and solutions',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.2,
    maxTokens: 4096,
    reasoningEffort: 'high',
    verbosity: 'high'
  }
];

const EnhancedAIProviderManager = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<AIProvider[]>(DEFAULT_PROVIDERS);
  const [taskConfigurations, setTaskConfigurations] = useState<TaskConfiguration[]>(DEFAULT_TASK_CONFIGURATIONS);
  const [testingProviders, setTestingProviders] = useState<Set<string>>(new Set());
  const [savingProviders, setSavingProviders] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('providers');
  const [globalSettings, setGlobalSettings] = useState({
    enableIntelligentRouting: true,
    enableFallbacks: true,
    enableUsageTracking: true,
    enableCaching: true,
    maxRetries: 3,
    timeout: 30000
  });

  // Load saved configurations on mount
  useEffect(() => {
    loadSavedConfigurations();
  }, []);

  const loadSavedConfigurations = async () => {
    try {
      // Load from localStorage for now - in production, this would be from Supabase
      const savedProviders = localStorage.getItem('ai_providers');
      const savedTasks = localStorage.getItem('ai_task_configurations');
      const savedGlobalSettings = localStorage.getItem('ai_global_settings');

      if (savedProviders) {
        setProviders(JSON.parse(savedProviders));
      }
      if (savedTasks) {
        setTaskConfigurations(JSON.parse(savedTasks));
      }
      if (savedGlobalSettings) {
        setGlobalSettings(JSON.parse(savedGlobalSettings));
      }
    } catch (error) {
      console.error('Error loading AI configurations:', error);
    }
  };

  const updateProviderApiKey = (providerId: string, apiKey: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, apiKey, status: apiKey ? 'inactive' : 'inactive' as const }
        : provider
    ));
  };

  const toggleProviderVisibility = (providerId: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, isVisible: !provider.isVisible }
        : provider
    ));
  };

  const testProvider = async (provider: AIProvider) => {
    setTestingProviders(prev => new Set([...prev, provider.id]));
    
    try {
      const response = await supabase.functions.invoke('ai-completion', {
        body: {
          prompt: 'Test connection - please respond with "Connection successful"',
          provider: provider.type,
          model: provider.models.find(m => m.isDefault)?.id,
          temperature: 0.1,
          maxTokens: 50
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const isValid = response.data?.content?.toLowerCase().includes('connection') || 
                     response.data?.content?.toLowerCase().includes('successful');
      
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { 
              ...p, 
              status: isValid ? 'active' : 'error',
              lastUsed: isValid ? new Date().toISOString() : undefined,
              usageCount: isValid ? p.usageCount + 1 : p.usageCount
            }
          : p
      ));

      toast({
        title: isValid ? "Provider Active" : "Provider Error",
        description: isValid 
          ? `${provider.name} connection successful`
          : `Failed to validate ${provider.name} API key`,
        variant: isValid ? "default" : "destructive"
      });
    } catch (error) {
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, status: 'error' }
          : p
      ));
      
      toast({
        title: "Connection Error",
        description: `Failed to test ${provider.name} connection`,
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

  const saveProvider = async (provider: AIProvider) => {
    if (!provider.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before saving",
        variant: "destructive"
      });
      return;
    }

    setSavingProviders(prev => new Set([...prev, provider.id]));
    
    try {
      // Save to Supabase Edge Function secrets
      const { error } = await supabase.functions.invoke('save-ai-provider', {
        body: {
          provider: provider.type,
          apiKey: provider.apiKey
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Also save to localStorage for immediate use
      const updatedProviders = providers.map(p => 
        p.id === provider.id ? { ...p, status: 'active' as const } : p
      );
      setProviders(updatedProviders);
      localStorage.setItem('ai_providers', JSON.stringify(updatedProviders));
      
      toast({
        title: "Provider Saved",
        description: `${provider.name} API key has been securely stored`,
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: `Failed to save ${provider.name} API key`,
        variant: "destructive"
      });
    } finally {
      setSavingProviders(prev => {
        const newSet = new Set(prev);
        newSet.delete(provider.id);
        return newSet;
      });
    }
  };

  const saveAllProviders = async () => {
    const providersToSave = providers.filter(provider => provider.apiKey.trim() !== '');
    
    for (const provider of providersToSave) {
      await saveProvider(provider);
    }
  };

  const updateTaskConfiguration = (taskType: TaskType, updates: Partial<TaskConfiguration>) => {
    setTaskConfigurations(prev => prev.map(config => 
      config.taskType === taskType 
        ? { ...config, ...updates }
        : config
    ));
  };

  const saveAllConfigurations = async () => {
    try {
      // Save to localStorage for now - in production, save to Supabase
      localStorage.setItem('ai_providers', JSON.stringify(providers));
      localStorage.setItem('ai_task_configurations', JSON.stringify(taskConfigurations));
      localStorage.setItem('ai_global_settings', JSON.stringify(globalSettings));

      toast({
        title: "Configurations Saved",
        description: "All AI provider and task configurations have been saved",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save configurations",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20',
      inactive: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };
    
    return (
      <Badge className={`text-xs ${variants[status as keyof typeof variants]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getActiveProviders = () => providers.filter(p => p.status === 'active');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          🤖 Intelligent AI Management
        </Badge>
        <h2 className="text-2xl font-bold mb-2">
          AI Provider <span className="bg-gradient-primary bg-clip-text text-transparent">Configuration</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Configure multiple AI providers with intelligent task-based routing. The system automatically 
          selects the best provider and model for each specific task type.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Providers</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Task Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Cpu className="h-4 w-4" />
            <span>Global Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API keys are encrypted and stored securely in Supabase Edge Function secrets. 
              They are never logged or transmitted in plain text.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {providers.map((provider) => {
              const isTesting = testingProviders.has(provider.id);
              const isSaving = savingProviders.has(provider.id);
              
              return (
                <EnhancedCard key={provider.id} glass>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          <provider.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(provider.status)}
                            {getStatusBadge(provider.status)}
                            {provider.lastUsed && (
                              <span className="text-xs text-muted-foreground">
                                Last used: {new Date(provider.lastUsed).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => window.open(provider.website, '_blank')}
                          variant="ghost"
                          size="sm"
                        >
                          Get API Key
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            type={provider.isVisible ? "text" : "password"}
                            value={provider.apiKey}
                            onChange={(e) => updateProviderApiKey(provider.id, e.target.value)}
                            placeholder={`Enter your ${provider.name} API key...`}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            onClick={() => toggleProviderVisibility(provider.id)}
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          >
                            {provider.isVisible ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        
                        <EnhancedButton
                          onClick={() => testProvider(provider)}
                          disabled={!provider.apiKey || isTesting}
                          loading={isTesting}
                          variant="outline"
                          size="sm"
                        >
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </EnhancedButton>
                        
                        <EnhancedButton
                          onClick={() => saveProvider(provider)}
                          disabled={!provider.apiKey || isSaving}
                          loading={isSaving}
                          variant="outline"
                          size="sm"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </EnhancedButton>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Features</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {provider.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Models</Label>
                        <div className="text-sm mt-1">
                          {provider.models.length} available
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Usage</Label>
                        <div className="text-sm mt-1">
                          {provider.usageCount} requests
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </EnhancedCard>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setProviders(DEFAULT_PROVIDERS)}>
              Reset to Defaults
            </Button>
            <EnhancedButton onClick={saveAllProviders} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Save All Providers
            </EnhancedButton>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Configure which AI provider and model to use for each task type. 
              The system will automatically route requests to the optimal provider based on these settings.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {taskConfigurations.map((config) => {
              const primaryProvider = providers.find(p => p.type === config.primaryProvider);
              const fallbackProvider = providers.find(p => p.type === config.fallbackProvider);
              const activeProviders = getActiveProviders();
              
              return (
                <EnhancedCard key={config.taskType} glass>
                  <CardHeader>
                    <CardTitle className="text-lg">{config.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Provider</Label>
                        <Select 
                          value={config.primaryProvider} 
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { 
                            primaryProvider: value as AIProviderType,
                            primaryModel: providers.find(p => p.type === value)?.models.find(m => m.isDefault)?.id || ''
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {activeProviders.map((provider) => (
                              <SelectItem key={provider.type} value={provider.type}>
                                <div className="flex items-center space-x-2">
                                  <provider.icon className="h-4 w-4" />
                                  <span>{provider.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Model</Label>
                        <Select 
                          value={config.primaryModel} 
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { primaryModel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {primaryProvider?.models.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">{model.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Fallback Provider</Label>
                        <Select 
                          value={config.fallbackProvider || 'none'} 
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { 
                            fallbackProvider: value === 'none' ? undefined : value as AIProviderType,
                            fallbackModel: value === 'none' ? undefined : providers.find(p => p.type === value)?.models.find(m => m.isDefault)?.id || ''
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {activeProviders
                              .filter(p => p.type !== config.primaryProvider)
                              .map((provider) => (
                                <SelectItem key={provider.type} value={provider.type}>
                                   <div className="flex items-center space-x-2">
                                     <provider.icon className="h-4 w-4" />
                                     <span>{provider.name}</span>
                                   </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Fallback Model</Label>
                        <Select 
                          value={config.fallbackModel || 'auto'} 
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { fallbackModel: value === 'auto' ? undefined : value })}
                          disabled={!config.fallbackProvider || config.fallbackProvider === 'none' || config.fallbackProvider === undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Auto-select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-select</SelectItem>
                            {fallbackProvider?.models.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">{model.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Temperature: {config.temperature}</Label>
                        <Slider
                          value={[config.temperature]}
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { temperature: value[0] })}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Max Tokens</Label>
                        <Select 
                          value={config.maxTokens.toString()} 
                          onValueChange={(value) => updateTaskConfiguration(config.taskType, { maxTokens: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1024">1,024</SelectItem>
                            <SelectItem value="2048">2,048</SelectItem>
                            <SelectItem value="4096">4,096</SelectItem>
                            <SelectItem value="8192">8,192</SelectItem>
                            <SelectItem value="16384">16,384</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {config.reasoningEffort && (
                        <div className="space-y-2">
                          <Label>Reasoning Effort</Label>
                          <Select 
                            value={config.reasoningEffort} 
                            onValueChange={(value) => updateTaskConfiguration(config.taskType, { 
                              reasoningEffort: value as 'minimal' | 'low' | 'medium' | 'high' 
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </EnhancedCard>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setTaskConfigurations(DEFAULT_TASK_CONFIGURATIONS)}>
              Reset to Defaults
            </Button>
            <EnhancedButton onClick={saveAllConfigurations} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Save Task Configurations
            </EnhancedButton>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Global AI Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Intelligent Routing</Label>
                    <p className="text-sm text-muted-foreground">Automatically select optimal provider for each task</p>
                  </div>
                  <Switch
                    checked={globalSettings.enableIntelligentRouting}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableIntelligentRouting: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fallback Providers</Label>
                    <p className="text-sm text-muted-foreground">Use fallback providers when primary fails</p>
                  </div>
                  <Switch
                    checked={globalSettings.enableFallbacks}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableFallbacks: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Usage Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track API usage and costs</p>
                  </div>
                  <Switch
                    checked={globalSettings.enableUsageTracking}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableUsageTracking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Response Caching</Label>
                    <p className="text-sm text-muted-foreground">Cache responses to reduce API calls</p>
                  </div>
                  <Switch
                    checked={globalSettings.enableCaching}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableCaching: checked }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max Retries</Label>
                  <Select 
                    value={globalSettings.maxRetries.toString()} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, maxRetries: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Request Timeout (seconds)</Label>
                  <Select 
                    value={(globalSettings.timeout / 1000).toString()} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, timeout: parseInt(value) * 1000 }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>

          <div className="flex justify-end">
            <EnhancedButton onClick={saveAllConfigurations} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Save Global Settings
            </EnhancedButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIProviderManager;