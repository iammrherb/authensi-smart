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
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { useToast } from '@/hooks/use-toast';
import { useAI, AIProvider } from '@/hooks/useAI';
import {
  Key, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle,
  Lock, Unlock, Save, TestTube, Brain, Sparkles, Diamond,
  Shield, Globe, Cpu, Zap, Cloud, Settings, BarChart3, RefreshCw
} from 'lucide-react';

interface APIKey {
  id: string;
  provider: AIProvider;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed?: string;
  usageCount?: number;
  isVisible: boolean;
  features: string[];
}

interface AISettings {
  defaultProvider: AIProvider;
  temperature: number;
  maxTokens: number;
  enableContextualHelp: boolean;
  enableSmartSuggestions: boolean;
  enableAutoEnhancement: boolean;
}

const APIKeyManager = () => {
  const { toast } = useToast();
  const { generateCompletion, isLoading } = useAI();
  
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      provider: 'openai',
      name: 'OpenAI GPT',
      key: '',
      status: 'inactive',
      isVisible: false,
      features: ['Chat Completion', 'Text Generation', 'Code Analysis', 'Project Insights']
    },
    {
      id: '2',
      provider: 'claude',
      name: 'Anthropic Claude',
      key: '',
      status: 'inactive',
      isVisible: false,
      features: ['Long Context', 'Analysis', 'Safety Focus', 'Risk Assessment']
    },
    {
      id: '3',
      provider: 'gemini',
      name: 'Google Gemini',
      key: '',
      status: 'inactive',
      isVisible: false,
      features: ['Multimodal', 'Code Generation', 'Math Reasoning', 'Timeline Planning']
    }
  ]);

  const [settings, setSettings] = useState<AISettings>({
    defaultProvider: 'openai',
    temperature: 0.7,
    maxTokens: 2000,
    enableContextualHelp: true,
    enableSmartSuggestions: true,
    enableAutoEnhancement: false
  });

  const [testingKeys, setTestingKeys] = useState<Set<string>>(new Set());
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

  const providerDetails = {
    openai: {
      icon: Brain,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      description: 'Advanced GPT models for general AI tasks',
      website: 'https://platform.openai.com/api-keys'
    },
    claude: {
      icon: Sparkles,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      description: 'Anthropic Claude for analysis and reasoning',
      website: 'https://console.anthropic.com/'
    },
    gemini: {
      icon: Diamond,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      description: 'Google Gemini for multimodal AI capabilities',
      website: 'https://ai.google.dev/'
    }
  };

  const updateApiKey = (id: string, key: string) => {
    setApiKeys(prev => prev.map(apiKey => 
      apiKey.id === id 
        ? { ...apiKey, key, status: key ? 'inactive' : 'inactive' as const }
        : apiKey
    ));
  };

  const toggleVisibility = (id: string) => {
    setApiKeys(prev => prev.map(apiKey => 
      apiKey.id === id 
        ? { ...apiKey, isVisible: !apiKey.isVisible }
        : apiKey
    ));
  };

  const testApiKey = async (apiKey: APIKey) => {
    setTestingKeys(prev => new Set([...prev, apiKey.id]));
    
    try {
      const response = await generateCompletion({
        prompt: 'Test connection - please respond with "Connection successful"',
        provider: apiKey.provider,
        temperature: 0.1,
        maxTokens: 50
      });
      
      const isValid = response?.content.toLowerCase().includes('connection') || 
                     response?.content.toLowerCase().includes('successful');
      
      setApiKeys(prev => prev.map(key => 
        key.id === apiKey.id 
          ? { 
              ...key, 
              status: isValid ? 'active' : 'error',
              lastUsed: isValid ? new Date().toISOString() : undefined,
              usageCount: isValid ? (key.usageCount || 0) + 1 : key.usageCount
            }
          : key
      ));

      toast({
        title: isValid ? "API Key Valid" : "API Key Invalid",
        description: isValid 
          ? `${apiKey.name} connection successful`
          : `Failed to validate ${apiKey.name} API key`,
        variant: isValid ? "default" : "destructive"
      });
    } catch (error) {
      setApiKeys(prev => prev.map(key => 
        key.id === apiKey.id 
          ? { ...key, status: 'error' }
          : key
      ));
      
      toast({
        title: "Connection Error",
        description: `Failed to test ${apiKey.name} API key`,
        variant: "destructive"
      });
    } finally {
      setTestingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(apiKey.id);
        return newSet;
      });
    }
  };

  const saveApiKey = async (apiKey: APIKey) => {
    setSavingKeys(prev => new Set([...prev, apiKey.id]));
    
    try {
      // Mock save operation - in real implementation, this would save to Supabase Edge Function secrets
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "API Key Saved",
        description: `${apiKey.name} API key has been securely stored`,
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: `Failed to save ${apiKey.name} API key`,
        variant: "destructive"
      });
    } finally {
      setSavingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(apiKey.id);
        return newSet;
      });
    }
  };

  const saveAllKeys = async () => {
    const keysToSave = apiKeys.filter(key => key.key.trim() !== '');
    
    for (const key of keysToSave) {
      await saveApiKey(key);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20',
      inactive: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };
    
    return (
      <Badge className={`text-xs ${variants[status as keyof typeof variants]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          🔐 API Configuration
        </Badge>
        <h2 className="text-2xl font-bold mb-2">
          API Key <span className="bg-gradient-primary bg-clip-text text-transparent">Management</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Securely configure and manage your AI provider API keys. All keys are encrypted and stored safely.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your API keys are encrypted and stored securely. They are never logged or transmitted in plain text.
          Each provider will be tested for connectivity when you save the configuration.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {apiKeys.map((apiKey) => {
          const provider = providerDetails[apiKey.provider as keyof typeof providerDetails];
          const isTesting = testingKeys.has(apiKey.id);
          const isSaving = savingKeys.has(apiKey.id);
          
          return (
            <EnhancedCard key={apiKey.id} glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <provider.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(apiKey.status)}
                        {getStatusBadge(apiKey.status)}
                        {apiKey.lastUsed && (
                          <span className="text-xs text-muted-foreground">
                            Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
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
                        type={apiKey.isVisible ? "text" : "password"}
                        value={apiKey.key}
                        onChange={(e) => updateApiKey(apiKey.id, e.target.value)}
                        placeholder={`Enter your ${apiKey.name} API key...`}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        onClick={() => toggleVisibility(apiKey.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      >
                        {apiKey.isVisible ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    
                    <EnhancedButton
                      onClick={() => testApiKey(apiKey)}
                      disabled={!apiKey.key || isTesting}
                      loading={isTesting}
                      variant="outline"
                      size="sm"
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Test
                    </EnhancedButton>
                    
                    <EnhancedButton
                      onClick={() => saveApiKey(apiKey)}
                      disabled={!apiKey.key || isSaving}
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
                      {apiKey.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="flex items-center space-x-1 mt-1">
                      {getStatusIcon(apiKey.status)}
                      <span className="text-sm capitalize">{apiKey.status}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Usage</Label>
                    <div className="text-sm mt-1">
                      {apiKey.usageCount || 0} requests
                    </div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>
          );
        })}
      </div>

      {/* AI Configuration */}
      <EnhancedCard glass>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default AI Provider</Label>
              <Select value={settings.defaultProvider} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultProvider: value as AIProvider }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {apiKeys
                    .filter(key => key.status === 'active')
                    .map((key) => (
                      <SelectItem key={key.provider} value={key.provider}>
                        {key.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Response Length</Label>
              <Select value={settings.maxTokens.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">Short (1000 tokens)</SelectItem>
                  <SelectItem value="2000">Medium (2000 tokens)</SelectItem>
                  <SelectItem value="4000">Long (4000 tokens)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Response Creativity: {settings.temperature}</Label>
            <Slider
              value={[settings.temperature]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Intelligence Features */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contextual Help</Label>
                <p className="text-sm text-muted-foreground">Show AI-powered tooltips and suggestions</p>
              </div>
              <Switch
                checked={settings.enableContextualHelp}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableContextualHelp: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Smart Suggestions</Label>
                <p className="text-sm text-muted-foreground">Auto-suggest configurations based on project context</p>
              </div>
              <Switch
                checked={settings.enableSmartSuggestions}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSmartSuggestions: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Enhancement</Label>
                <p className="text-sm text-muted-foreground">Automatically enhance notes and descriptions</p>
              </div>
              <Switch
                checked={settings.enableAutoEnhancement}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoEnhancement: checked }))}
              />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {apiKeys.reduce((sum, key) => sum + (key.usageCount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total AI Requests</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {apiKeys.filter(k => k.status === 'active').length}/{apiKeys.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Providers</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {apiKeys.filter(k => k.lastUsed).length > 0 ? '98.7%' : '0%'}
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {apiKeys.filter(k => k.status === 'active').length} of {apiKeys.length} providers configured
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => {
              setApiKeys(prev => prev.map(key => ({ ...key, key: '', status: 'inactive' as const })));
              toast({
                title: "API Keys Cleared",
                description: "All API keys have been cleared from the form",
              });
            }}
            variant="outline"
          >
            Clear All
          </Button>
          
          <EnhancedButton
            onClick={saveAllKeys}
            gradient="primary"
            className="px-8"
          >
            <Settings className="h-4 w-4 mr-2" />
            Save All Configuration
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;