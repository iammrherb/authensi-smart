import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Key, Eye, EyeOff, Settings, Brain, Zap } from "lucide-react";

interface Provider {
  type: string;
  name: string;
  icon: string;
  models: string[];
  defaultModel: string;
}

interface AIConfiguration {
  primaryProvider: string;
  secondaryProvider: string;
  providerSettings: Record<string, {
    model: string;
    enabled: boolean;
  }>;
  featureSettings: Record<string, {
    provider: string;
    model: string;
    enabled: boolean;
  }>;
}

const PROVIDERS: Provider[] = [
  { 
    type: 'openai', 
    name: 'OpenAI', 
    icon: '🤖', 
    models: ['gpt-5-2025-08-07', 'gpt-5-mini-2025-08-07', 'gpt-4.1-2025-04-14', 'o3-2025-04-16'],
    defaultModel: 'gpt-5-2025-08-07'
  },
  { 
    type: 'anthropic', 
    name: 'Claude', 
    icon: '🧠', 
    models: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
    defaultModel: 'claude-sonnet-4-20250514'
  },
  { 
    type: 'google', 
    name: 'Gemini', 
    icon: '✨', 
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash-exp'
  },
  { 
    type: 'perplexity', 
    name: 'Perplexity', 
    icon: '🔍', 
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
    defaultModel: 'llama-3.1-sonar-large-128k-online'
  },
  { 
    type: 'grok', 
    name: 'Grok', 
    icon: '🚀', 
    models: ['grok-2-latest', 'grok-2-mini'],
    defaultModel: 'grok-2-latest'
  }
];

const AI_FEATURES = [
  { key: 'documentation_generation', name: 'Documentation Generation', description: 'Generate project documentation' },
  { key: 'code_analysis', name: 'Code Analysis', description: 'Analyze and review code quality' },
  { key: 'config_optimization', name: 'Config Optimization', description: 'Optimize configuration templates' },
  { key: 'scoping_assistance', name: 'Scoping Assistance', description: 'AI-powered project scoping' },
  { key: 'recommendation_engine', name: 'Recommendation Engine', description: 'Smart recommendations for projects' }
];

export const AISettings = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [aiConfig, setAiConfig] = useState<AIConfiguration>({
    primaryProvider: 'openai',
    secondaryProvider: 'anthropic',
    providerSettings: {},
    featureSettings: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    loadExistingKeys();
    loadAIConfiguration();
  }, []);

  const loadExistingKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('provider_name')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error loading keys:', error);
        return;
      }

      const keyStatus: Record<string, boolean> = {};
      data?.forEach(key => {
        keyStatus[key.provider_name] = true;
      });
      setSavedKeys(keyStatus);
    } catch (error) {
      console.error('Error in loadExistingKeys:', error);
    }
  };

  const loadAIConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'ai_configuration')
        .single();

      if (data?.setting_value) {
        setAiConfig(data.setting_value as unknown as AIConfiguration);
      } else {
        // Initialize with defaults
        const defaultConfig: AIConfiguration = {
          primaryProvider: 'openai',
          secondaryProvider: 'anthropic',
          providerSettings: {},
          featureSettings: {}
        };
        
        PROVIDERS.forEach(provider => {
          defaultConfig.providerSettings[provider.type] = {
            model: provider.defaultModel,
            enabled: true
          };
        });

        AI_FEATURES.forEach(feature => {
          defaultConfig.featureSettings[feature.key] = {
            provider: 'openai',
            model: 'gpt-5-2025-08-07',
            enabled: true
          };
        });

        setAiConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Error loading AI configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (provider: string) => {
    const apiKey = apiKeys[provider];
    if (!apiKey?.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setSaving(provider);
    try {
      const { error } = await supabase.functions.invoke('save-ai-provider', {
        body: {
          provider: provider,
          apiKey: apiKey.trim()
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to save API key');
      }

      toast({
        title: "Success",
        description: `${provider} API key saved successfully`,
      });

      setSavedKeys(prev => ({ ...prev, [provider]: true }));
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
      setShowKeys(prev => ({ ...prev, [provider]: false }));
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to save ${provider} API key`,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const saveAIConfiguration = async () => {
    try {
      setSaving('config');
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'ai_configuration',
          setting_value: aiConfig as any,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI configuration saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving AI configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save AI configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateProviderSetting = (provider: string, field: string, value: any) => {
    setAiConfig(prev => ({
      ...prev,
      providerSettings: {
        ...prev.providerSettings,
        [provider]: {
          ...prev.providerSettings[provider],
          [field]: value
        }
      }
    }));
  };

  const updateFeatureSetting = (feature: string, field: string, value: any) => {
    setAiConfig(prev => ({
      ...prev,
      featureSettings: {
        ...prev.featureSettings,
        [feature]: {
          ...prev.featureSettings[feature],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading AI settings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Advanced Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="keys" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="keys" className="space-y-4">
              {PROVIDERS.map(provider => {
                const isSaved = savedKeys[provider.type];
                const currentKey = apiKeys[provider.type] || '';
                const isSaving = saving === provider.type;
                const isVisible = showKeys[provider.type];

                return (
                  <div key={provider.type} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className="font-medium">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">Configure API key</p>
                        </div>
                      </div>
                      <Badge variant={isSaved ? "default" : "secondary"}>
                        {isSaved ? 'Configured' : 'Not Set'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${provider.type}-key`}>API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`${provider.type}-key`}
                          type={isVisible ? "text" : "password"}
                          placeholder={`Enter ${provider.name} API key`}
                          value={currentKey}
                          onChange={(e) => setApiKeys(prev => ({ 
                            ...prev, 
                            [provider.type]: e.target.value 
                          }))}
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setShowKeys(prev => ({ 
                            ...prev, 
                            [provider.type]: !isVisible 
                          }))}
                        >
                          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => saveApiKey(provider.type)}
                      disabled={!currentKey.trim() || isSaving}
                      className="w-full"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save API Key
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="providers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Provider</Label>
                  <Select 
                    value={aiConfig.primaryProvider} 
                    onValueChange={(value) => setAiConfig(prev => ({ ...prev, primaryProvider: value }))}
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
                  <Label>Secondary Provider</Label>
                  <Select 
                    value={aiConfig.secondaryProvider} 
                    onValueChange={(value) => setAiConfig(prev => ({ ...prev, secondaryProvider: value }))}
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
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Provider Model Settings</h3>
                {PROVIDERS.map(provider => (
                  <div key={provider.type} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{provider.icon}</span>
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <Badge variant={savedKeys[provider.type] ? "default" : "secondary"}>
                        {savedKeys[provider.type] ? 'Active' : 'No API Key'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Default Model</Label>
                      <Select 
                        value={aiConfig.providerSettings[provider.type]?.model || provider.defaultModel}
                        onValueChange={(value) => updateProviderSetting(provider.type, 'model', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {provider.models.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">AI Feature Configuration</h3>
                {AI_FEATURES.map(feature => (
                  <div key={feature.key} className="p-4 border rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Provider</Label>
                        <Select 
                          value={aiConfig.featureSettings[feature.key]?.provider || 'openai'}
                          onValueChange={(value) => updateFeatureSetting(feature.key, 'provider', value)}
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
                        <Label>Model</Label>
                        <Select 
                          value={aiConfig.featureSettings[feature.key]?.model || 'gpt-5-2025-08-07'}
                          onValueChange={(value) => updateFeatureSetting(feature.key, 'model', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                           <SelectContent>
                            {(() => {
                              const selectedProvider = aiConfig.featureSettings[feature.key]?.provider || 'openai';
                              const provider = PROVIDERS.find(p => p.type === selectedProvider);
                              return provider?.models || [];
                            })().map(model => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Current Configuration Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Primary Provider:</strong> {PROVIDERS.find(p => p.type === aiConfig.primaryProvider)?.name}</div>
                  <div><strong>Secondary Provider:</strong> {PROVIDERS.find(p => p.type === aiConfig.secondaryProvider)?.name}</div>
                  <div><strong>Active Providers:</strong> {Object.keys(savedKeys).filter(key => savedKeys[key]).length} of {PROVIDERS.length}</div>
                  <div><strong>Configured Features:</strong> {AI_FEATURES.length}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={saveAIConfiguration}
              disabled={saving === 'config'}
              className="bg-gradient-primary hover:opacity-90"
            >
              {saving === 'config' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Save AI Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;