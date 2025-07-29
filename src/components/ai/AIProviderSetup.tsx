import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const AIProviderSetup: React.FC = () => {
  const providers = [
    {
      name: 'OpenAI',
      icon: Brain,
      color: 'text-green-500',
      keyName: 'OPENAI_API_KEY',
      features: ['GPT-4.1 2025', 'Code Generation', 'Project Summaries'],
      docUrl: 'https://platform.openai.com/api-keys'
    },
    {
      name: 'Claude (Anthropic)',
      icon: Sparkles,
      color: 'text-orange-500',
      keyName: 'CLAUDE_API_KEY',
      features: ['Claude Opus 4', 'Note Enhancement', 'Risk Analysis'],
      docUrl: 'https://console.anthropic.com/'
    },
    {
      name: 'Gemini (Google)',
      icon: Zap,
      color: 'text-blue-500',
      keyName: 'GEMINI_API_KEY',
      features: ['Gemini Pro', 'Timeline Planning', 'Recommendations'],
      docUrl: 'https://makersuite.google.com/app/apikey'
    }
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          Configure your AI provider API keys to enable advanced features like automatic project 
          summaries, intelligent recommendations, and AI-powered troubleshooting.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.name} className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <provider.icon className={`h-5 w-5 ${provider.color}`} />
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
                <p className="text-sm text-muted-foreground">
                  Configure your {provider.keyName} in Supabase Edge Function Secrets
                </p>
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
        ))}
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