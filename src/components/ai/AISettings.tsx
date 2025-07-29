import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAI, AIProvider } from '@/hooks/useAI';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Brain, CheckCircle2, XCircle, Loader2, Zap, Settings, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProviderConfig {
  enabled: boolean;
  primary: boolean;
  features: string[];
}

interface AISettings {
  providers: Record<AIProvider, AIProviderConfig>;
  defaultProvider: AIProvider;
  temperature: number;
  maxTokens: number;
  enableContextualHelp: boolean;
  enableSmartSuggestions: boolean;
  enableAutoEnhancement: boolean;
}

const AISettings = () => {
  const { generateCompletion, isLoading } = useAI();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AISettings>({
    providers: {
      openai: { enabled: true, primary: true, features: ['chat', 'recommendations', 'troubleshooting'] },
      claude: { enabled: true, primary: false, features: ['documentation', 'analysis'] },
      gemini: { enabled: true, primary: false, features: ['insights', 'optimization'] }
    },
    defaultProvider: 'openai',
    temperature: 0.7,
    maxTokens: 2000,
    enableContextualHelp: true,
    enableSmartSuggestions: true,
    enableAutoEnhancement: false
  });

  const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
  const [testResults, setTestResults] = useState<Record<AIProvider, 'success' | 'error' | null>>({
    openai: null,
    claude: null,
    gemini: null
  });

  const providerDetails = {
    openai: {
      name: 'OpenAI GPT',
      description: 'Advanced reasoning and general-purpose AI',
      icon: '🧠',
      color: 'bg-green-500'
    },
    claude: {
      name: 'Anthropic Claude',
      description: 'Excellent for analysis and detailed explanations',
      icon: '🎭',
      color: 'bg-orange-500'
    },
    gemini: {
      name: 'Google Gemini',
      description: 'Multimodal AI with strong reasoning capabilities',
      icon: '💎',
      color: 'bg-blue-500'
    }
  };

  const testProvider = async (provider: AIProvider) => {
    setTestingProvider(provider);
    try {
      const response = await generateCompletion({
        prompt: 'Test connection - please respond with "Connection successful"',
        provider,
        temperature: 0.1,
        maxTokens: 50
      });
      
      if (response?.content.toLowerCase().includes('connection successful') || 
          response?.content.toLowerCase().includes('successful')) {
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
        toast({
          title: "Connection Successful",
          description: `${providerDetails[provider].name} is working correctly.`
        });
      } else {
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
        toast({
          title: "Connection Error",
          description: `${providerDetails[provider].name} returned an unexpected response.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${providerDetails[provider].name}. Please check your API key.`,
        variant: "destructive"
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const updateProviderSetting = (provider: AIProvider, key: keyof AIProviderConfig, value: any) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [key]: value
        }
      }
    }));
  };

  const setAsPrimaryProvider = (provider: AIProvider) => {
    setSettings(prev => ({
      ...prev,
      defaultProvider: provider,
      providers: Object.fromEntries(
        Object.entries(prev.providers).map(([key, config]) => [
          key,
          { ...config, primary: key === provider }
        ])
      ) as Record<AIProvider, AIProviderConfig>
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          🤖 AI & Intelligence
        </Badge>
        <h2 className="text-2xl font-bold mb-2">
          AI <span className="bg-gradient-primary bg-clip-text text-transparent">Configuration</span>
        </h2>
        <p className="text-muted-foreground">
          Configure AI providers and intelligence features for enhanced NAC deployment assistance
        </p>
      </div>

      {/* AI Providers Configuration */}
      <EnhancedCard glass>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Providers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(providerDetails).map(([provider, details]) => {
            const config = settings.providers[provider as AIProvider];
            const testResult = testResults[provider as AIProvider];
            const isTesting = testingProvider === provider;
            
            return (
              <div key={provider} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${details.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {details.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Label className="font-medium">{details.name}</Label>
                        {config.primary && <Badge variant="secondary">Primary</Badge>}
                        {testResult === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {testResult === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{details.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(enabled) => updateProviderSetting(provider as AIProvider, 'enabled', enabled)}
                    />
                  </div>
                </div>
                
                {config.enabled && (
                  <div className="pl-13 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testProvider(provider as AIProvider)}
                        disabled={isTesting}
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          'Test Connection'
                        )}
                      </Button>
                      {!config.primary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAsPrimaryProvider(provider as AIProvider)}
                        >
                          Set as Primary
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {config.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </EnhancedCard>

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
                  {Object.entries(providerDetails)
                    .filter(([provider]) => settings.providers[provider as AIProvider].enabled)
                    .map(([provider, details]) => (
                      <SelectItem key={provider} value={provider}>
                        {details.icon} {details.name}
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
        </CardContent>
      </EnhancedCard>

      {/* Intelligence Features */}
      <EnhancedCard glass>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Intelligence Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">AI Requests This Month</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">98.7%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      <div className="flex justify-end">
        <EnhancedButton gradient="primary" className="px-8">
          Save AI Settings
        </EnhancedButton>
      </div>
    </div>
  );
};

export default AISettings;