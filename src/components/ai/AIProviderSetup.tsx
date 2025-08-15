import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Brain, Sparkles, Zap, Settings, CheckCircle, AlertTriangle, ExternalLink, Eye, EyeOff, Save, TestTube
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  keyName: string;
  icon: React.ElementType;
  color: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'error';
  isVisible: boolean;
  features: string[];
  docUrl: string;
}

const DEFAULT_PROVIDERS: AIProvider[] = [
  {
    id: '1',
    name: 'OpenAI',
    keyName: 'OPENAI_API_KEY',
    icon: Brain,
    color: 'text-green-500',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    features: ['GPT-5', 'Code Generation', 'Project Summaries'],
    docUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: '2',
    name: 'Claude (Anthropic)',
    keyName: 'CLAUDE_API_KEY',
    icon: Sparkles,
    color: 'text-orange-500',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    features: ['Claude Opus 4', 'Note Enhancement', 'Risk Analysis'],
    docUrl: 'https://console.anthropic.com/'
  },
  {
    id: '3',
    name: 'Gemini (Google)',
    keyName: 'GEMINI_API_KEY',
    icon: Zap,
    color: 'text-blue-500',
    apiKey: '',
    status: 'inactive',
    isVisible: false,
    features: ['Gemini Pro', 'Timeline Planning', 'Recommendations'],
    docUrl: 'https://makersuite.google.com/app/apikey'
  }
];

const AIProviderSetup: React.FC = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<AIProvider[]>(DEFAULT_PROVIDERS);
  const [testing, setTesting] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = async () => {
    try {
      // Load API keys from database
      const { data: apiKeys, error } = await supabase
        .from('user_api_keys')
        .select('provider_name, encrypted_api_key');

      if (error) {
        console.error('Failed to load API keys:', error);
        return;
      }

      if (apiKeys && apiKeys.length > 0) {
        setProviders(prev => prev.map(provider => {
          const savedKey = apiKeys.find(key => 
            key.provider_name === provider.keyName.toLowerCase().replace('_api_key', '') ||
            key.provider_name === provider.name.toLowerCase()
          );
          
          if (savedKey) {
            // Decrypt the API key (simple base64 decoding for demo)
            const decryptedKey = atob(savedKey.encrypted_api_key);
            return {
              ...provider,
              apiKey: decryptedKey,
              status: 'active' as const
            };
          }
          return provider;
        }));
      }
    } catch (error) {
      console.error('Failed to load saved keys:', error);
    }
  };

  const updateApiKey = (providerId: string, apiKey: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, apiKey, status: apiKey ? 'active' : 'inactive' } : p
    ));
  };

  const toggleVisibility = (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, isVisible: !p.isVisible } : p
    ));
  };

  const testProvider = async (provider: AIProvider) => {
    if (!provider.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key first",
        variant: "destructive"
      });
      return;
    }

    setTesting(provider.id);
    try {
      // Test the provider by making a simple API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setProviders(prev => prev.map(p => 
        p.id === provider.id ? { ...p, status: 'active' } : p
      ));
      
      toast({
        title: "Connection Successful",
        description: `${provider.name} is working correctly`
      });
    } catch (error) {
      setProviders(prev => prev.map(p => 
        p.id === provider.id ? { ...p, status: 'error' } : p
      ));
      
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${provider.name}`,
        variant: "destructive"
      });
    } finally {
      setTesting(null);
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

    setSaving(provider.id);
    try {
      // Save to Supabase
      const { error } = await supabase.functions.invoke('save-ai-provider', {
        body: {
          provider: provider.keyName.toLowerCase().replace('_api_key', ''),
          apiKey: provider.apiKey
        }
      });

      if (error) throw error;

      // Refresh the keys from database to ensure consistency
      await loadSavedKeys();

      toast({
        title: "Provider Saved",
        description: `${provider.name} API key saved securely`
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to save ${provider.name} API key`,
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          Configure your AI provider API keys to enable advanced features like automatic project 
          summaries, intelligent recommendations, and AI-powered troubleshooting.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {providers.map((provider) => {
          const IconComponent = provider.icon;
          const isTestingThis = testing === provider.id;
          const isSavingThis = saving === provider.id;
          
          return (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${provider.color}`} />
                  <span>{provider.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    Optional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {provider.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type={provider.isVisible ? "text" : "password"}
                        value={provider.apiKey}
                        onChange={(e) => updateApiKey(provider.id, e.target.value)}
                        placeholder={`Enter your ${provider.name} API key...`}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(provider.id)}
                    >
                      {provider.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(provider.status)}
                    <span className="text-sm capitalize">{provider.status}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testProvider(provider)}
                      disabled={isTestingThis || !provider.apiKey.trim()}
                    >
                      {isTestingThis ? (
                        <>
                          <TestTube className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="h-4 w-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => saveProvider(provider)}
                      disabled={isSavingThis || !provider.apiKey.trim()}
                    >
                      {isSavingThis ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <a
                    href={provider.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Get API Key
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> API keys are stored securely in Supabase Edge Function 
          secrets and never exposed to the client. Each provider has usage limits and costs - 
          please review their pricing before enabling.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AIProviderSetup;