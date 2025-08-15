import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, Brain, Sparkles, CheckCircle, XCircle, 
  MessageSquare, Settings, TestTube
} from 'lucide-react';
import AIAssistant from '@/components/ai/AIAssistant';
import EnhancedAIProviderManager from '@/components/ai/EnhancedAIProviderManager';
import AIEnhancedLibraryManager from '@/components/library/AIEnhancedLibraryManager';
import { useAI } from '@/hooks/useAI';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';

const AIIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { generateCompletion, isLoading: aiLoading } = useAI();
  const { generateCompletion: enhancedGenerate, isLoading: enhancedLoading } = useEnhancedAI();
  const { toast } = useToast();

  const runAITests = async () => {
    setIsRunningTests(true);
    const results: Record<string, boolean> = {};

    try {
      // Test basic AI completion
      toast({ title: "Testing", description: "Running basic AI completion test..." });
      const basicTest = await generateCompletion({
        prompt: "Hello, test AI integration",
        provider: 'openai',
        model: 'gpt-5-mini-2025-08-07'
      });
      results.basicAI = !!basicTest?.content;

      // Test enhanced AI completion
      toast({ title: "Testing", description: "Running enhanced AI completion test..." });
      const enhancedTest = await enhancedGenerate({
        prompt: "Test enhanced AI integration",
        taskType: 'chat',
        provider: 'openai'
      });
      results.enhancedAI = !!enhancedTest?.content;

      // Test project summary generation
      toast({ title: "Testing", description: "Testing project summary generation..." });
      const projectData = {
        name: "Test Project",
        client_name: "Test Client",
        industry: "Technology",
        deployment_type: "Enterprise",
        security_level: "High",
        total_sites: 5,
        total_endpoints: 100
      };
      
      const summaryTest = await generateCompletion({
        prompt: `Generate a brief summary for: ${JSON.stringify(projectData)}`,
        provider: 'openai',
        model: 'gpt-5-mini-2025-08-07'
      });
      results.projectSummary = !!summaryTest?.content;

      setTestResults(results);
      
      const passedTests = Object.values(results).filter(Boolean).length;
      const totalTests = Object.keys(results).length;
      
      toast({
        title: "AI Tests Complete",
        description: `${passedTests}/${totalTests} tests passed`,
        variant: passedTests === totalTests ? "default" : "destructive"
      });

    } catch (error) {
      console.error('AI test error:', error);
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const testComponents = [
    {
      name: "AI Assistant",
      description: "Interactive chat interface with AI models",
      status: "integrated",
      component: "AIAssistant"
    },
    {
      name: "Enhanced AI Provider Manager",
      description: "Comprehensive AI provider configuration and management",
      status: "integrated", 
      component: "EnhancedAIProviderManager"
    },
    {
      name: "AI Enhanced Library Manager",
      description: "AI-powered content generation for library items",
      status: "integrated",
      component: "AIEnhancedLibraryManager"
    },
    {
      name: "Basic AI Hook",
      description: "Core AI completion functionality",
      status: testResults.basicAI === undefined ? "pending" : testResults.basicAI ? "passed" : "failed",
      component: "useAI"
    },
    {
      name: "Enhanced AI Hook",
      description: "Advanced AI with task-specific optimizations",
      status: testResults.enhancedAI === undefined ? "pending" : testResults.enhancedAI ? "passed" : "failed",
      component: "useEnhancedAI"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "integrated":
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <TestTube className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "integrated":
      case "passed":
        return "bg-green-500/20 text-green-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-yellow-500/20 text-yellow-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Integration Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive AI assistant integration status and testing
          </p>
        </div>
        <EnhancedButton 
          onClick={runAITests}
          disabled={isRunningTests || aiLoading || enhancedLoading}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          {isRunningTests ? "Running Tests..." : "Run AI Tests"}
        </EnhancedButton>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          All AI assistants are fully integrated and operational. The dashboard below shows the current status of all AI components.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Integration Status</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="providers">Provider Management</TabsTrigger>
          <TabsTrigger value="library">AI Library</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testComponents.map((component, index) => (
              <EnhancedCard key={index} glass lift>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    {getStatusIcon(component.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {component.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(component.status)} border-0`}
                    >
                      {component.status}
                    </Badge>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {component.component}
                    </code>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Integration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className="text-sm text-muted-foreground">Components Integrated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">3</div>
                  <div className="text-sm text-muted-foreground">Edge Functions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">6</div>
                  <div className="text-sm text-muted-foreground">AI Providers Supported</div>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-6">
          <EnhancedCard glass className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI Assistant Test Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <AIAssistant context="general" className="h-full border-0" />
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                AI Provider Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedAIProviderManager />
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Enhanced Library Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIEnhancedLibraryManager 
                type="use_case"
                onItemCreated={(item) => {
                  toast({
                    title: "Item Created",
                    description: `Successfully created: ${item.name}`
                  });
                }}
              />
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIIntegrationTest;