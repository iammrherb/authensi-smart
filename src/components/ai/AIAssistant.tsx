import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAI, AIProvider } from '@/hooks/useAI';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Settings,
  Lightbulb,
  FileText,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  provider?: AIProvider;
}

interface AIAssistantProps {
  context?: 'project' | 'scoping' | 'troubleshooting' | 'general';
  projectId?: string;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  context = 'general', 
  projectId,
  className 
}) => {
  const { generateCompletion, isLoading: aiLoading } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const providers = {
    openai: { name: 'OpenAI GPT', icon: Brain, color: 'bg-green-500' },
    claude: { name: 'Anthropic Claude', icon: Sparkles, color: 'bg-orange-500' },
    gemini: { name: 'Google Gemini', icon: Zap, color: 'bg-blue-500' }
  };

  const contextPrompts = {
    project: 'You are a Portnox NAC deployment specialist helping with project management.',
    scoping: 'You are an expert in network access control scoping and requirements gathering.',
    troubleshooting: 'You are a technical support specialist for Portnox NAC solutions.',
    general: 'You are an AI assistant helping with Portnox NAC deployment and management.'
  };

  const quickActions = [
    { icon: Lightbulb, label: 'Get Recommendations', action: 'recommendations' },
    { icon: FileText, label: 'Generate Report', action: 'report' },
    { icon: Settings, label: 'Best Practices', action: 'best-practices' },
    { icon: MessageSquare, label: 'Troubleshoot', action: 'troubleshoot' }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const contextualPrompt = `${contextPrompts[context]}
      ${projectId ? `Project ID: ${projectId}` : ''}
      
      User Question: ${userInput}
      
      Please provide helpful, accurate, and actionable advice for Portnox NAC deployments, security best practices, troubleshooting, and configuration guidance. Be specific and practical in your responses.`;

      const response = await generateCompletion({
        prompt: contextualPrompt,
        context: context,
        provider: selectedProvider,
        temperature: 0.7,
        maxTokens: 2000
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response?.content || "I apologize, but I'm unable to process your request at the moment. Please check your AI provider configuration in Settings and try again.",
        timestamp: new Date(),
        provider: selectedProvider
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error while processing your request. Please check your AI provider settings in the Settings page and try again.",
        timestamp: new Date(),
        provider: selectedProvider
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      recommendations: `Based on my current project context, what are your top recommendations for optimizing our Portnox NAC deployment?`,
      report: `Please generate a comprehensive status report for this project including key metrics, progress, and next steps.`,
      'best-practices': `What are the current best practices for Portnox NAC implementation in enterprise environments?`,
      troubleshoot: `Help me troubleshoot common issues with Portnox NAC deployment and configuration.`
    };
    
    setInputValue(prompts[action as keyof typeof prompts] || '');
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn("h-[600px] flex flex-col bg-gradient-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>Portnox AI Assistant</span>
            <Badge variant="secondary" className="ml-2">
              {context}
            </Badge>
          </CardTitle>
          
          <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as AIProvider)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(providers).map(([key, provider]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-2 h-2 rounded-full", provider.color)} />
                    <span className="text-xs">{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2 mt-3">
          {quickActions.map((action) => (
            <EnhancedButton
              key={action.action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className="text-xs"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </EnhancedButton>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-sm">
                  Hi! I'm your Portnox AI assistant. I can help with deployment planning, 
                  troubleshooting, best practices, and more.
                </p>
                <p className="text-xs mt-2">
                  Try using one of the quick actions above or ask me anything!
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.provider && message.role === 'assistant' && (
                      <div className="flex items-center space-x-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", providers[message.provider].color)} />
                        <span className="text-xs opacity-70">{providers[message.provider].name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 mr-4">
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about NAC deployment, troubleshooting, or best practices..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <EnhancedButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            gradient="primary"
            glow
          >
            <Send className="h-4 w-4" />
          </EnhancedButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;