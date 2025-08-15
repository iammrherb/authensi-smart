import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Key, Eye, EyeOff } from "lucide-react";

interface Provider {
  type: string;
  name: string;
  icon: string;
}

const PROVIDERS: Provider[] = [
  { type: 'openai', name: 'OpenAI', icon: '🤖' },
  { type: 'anthropic', name: 'Claude', icon: '🧠' },
  { type: 'google', name: 'Gemini', icon: '✨' },
  { type: 'perplexity', name: 'Perplexity', icon: '🔍' },
  { type: 'grok', name: 'Grok', icon: '🚀' }
];

export const SimpleAIKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Load existing keys on mount
  useEffect(() => {
    loadExistingKeys();
  }, []);

  const loadExistingKeys = async () => {
    try {
      console.log('Loading existing API keys...');
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
      console.log('Loaded key status:', keyStatus);
    } catch (error) {
      console.error('Error in loadExistingKeys:', error);
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
      console.log(`Saving API key for ${provider}...`);
      
      const { data, error } = await supabase.functions.invoke('save-ai-provider', {
        body: {
          provider: provider,
          apiKey: apiKey.trim()
        }
      });

      console.log('Function response:', { data, error });

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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading API keys...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>AI Provider API Keys</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">
                      Configure your {provider.name} API key
                    </p>
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
                    placeholder={`Enter your ${provider.name} API key`}
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
      </CardContent>
    </Card>
  );
};

export default SimpleAIKeyManager;