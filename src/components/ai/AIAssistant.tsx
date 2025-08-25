import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalMarkdown } from '@/components/ui/professional-markdown';
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
  Zap,
  Shield,
  Network,
  Target
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
    project: `You are a Portnox NAC deployment specialist with expertise in enterprise network security. 
    Reference the Product Requirements Document (PRD v2.1) for NAC Solution Platform standards.
    Provide professional, detailed responses formatted in markdown with:
    - Executive summaries for complex topics
    - Clear action items with priorities [HIGH], [MEDIUM], [LOW]
    - Technical specifications using appropriate code blocks
    - Risk assessments and compliance considerations
    - Implementation timelines and milestones`,
    
    scoping: `You are an expert NAC scoping consultant following enterprise best practices.
    Reference PRD requirements for multi-vendor environments and compliance frameworks.
    Structure responses with:
    - Requirements analysis with priority indicators
    - Vendor-specific considerations (Cisco, Aruba, Fortinet, etc.)
    - Compliance framework alignment (SOX, HIPAA, PCI-DSS, NIST)
    - Resource allocation and timeline estimates
    - Risk mitigation strategies`,
    
    troubleshooting: `You are a senior technical support specialist for enterprise NAC implementations.
    Follow PRD technical architecture guidelines and provide:
    - Systematic diagnostic procedures
    - Root cause analysis with technical depth
    - Step-by-step resolution guides
    - Configuration validation steps
    - Performance optimization recommendations
    - Escalation criteria and next steps`,
    
    general: `You are a NAC Solution Platform AI assistant aligned with PRD v2.1 standards.
    Provide enterprise-grade responses with:
    - Professional formatting using markdown
    - Reference to platform capabilities and features
    - Industry best practices and standards
    - Clear, actionable recommendations
    - Appropriate technical depth for the audience`
  };

  const quickActions = [
    { icon: Target, label: 'PRD Compliance Check', action: 'prd-compliance' },
    { icon: Shield, label: 'Security Analysis', action: 'security-analysis' },
    { icon: Network, label: 'Architecture Review', action: 'architecture-review' },
    { icon: FileText, label: 'Professional Report', action: 'professional-report' },
    { icon: Lightbulb, label: 'AI Recommendations', action: 'ai-recommendations' },
    { icon: Settings, label: 'Best Practices', action: 'best-practices' }
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
      ${projectId ? `Project Context: Project ID ${projectId}` : ''}
      
      ## Context Requirements
      - Follow NAC Solution Platform PRD v2.1 standards
      - Provide enterprise-grade professional responses
      - Use structured markdown formatting with appropriate sections
      - Include executive summaries for complex topics
      - Add priority indicators: [HIGH], [MEDIUM], [LOW] for action items
      - Reference relevant compliance frameworks when applicable
      - Provide technical specifications with proper code formatting
      - Include risk assessments and mitigation strategies
      
      ## User Request
      ${userInput}
      
      ## Response Format Requirements
      Please structure your response using professional markdown formatting with:
      1. Executive Summary (for complex topics)
      2. Main Content with clear sections and headers
      3. Action Items with priority indicators
      4. Technical Specifications (if applicable)
      5. Risk Considerations
      6. Compliance Notes (if relevant)
      7. Next Steps or Recommendations`;

      const response = await generateCompletion({
        prompt: contextualPrompt,
        context: context,
        provider: selectedProvider,
        temperature: 0.7,
        maxTokens: 2000
      });

      let content: string;
      
      if (!response) {
        content = "I apologize, but I'm unable to process your request at the moment. This could be due to:\n\n" +
                 "• AI service configuration issues\n" +
                 "• Network connectivity problems\n" +
                 "• Temporary service unavailability\n\n" +
                 "Please check your AI provider configuration in Settings and try again. If the problem persists, contact support.";
      } else if (!response.content) {
        content = "I received an empty response from the AI service. Please try again with a different question or check your settings.";
      } else {
        content = response.content;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
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
      'prd-compliance': `Generate a PRD v2.1 compliance assessment for this NAC implementation project. Include executive summary, current compliance status, gap analysis, and recommended actions with priorities.`,
      'security-analysis': `Perform a comprehensive security analysis of our NAC deployment following enterprise security requirements from PRD v2.1. Include threat assessment, vulnerability analysis, and mitigation strategies.`,
      'architecture-review': `Conduct a technical architecture review of our NAC solution against PRD v2.1 specifications. Analyze scalability, performance, integration points, and provide optimization recommendations.`,
      'professional-report': `Generate a professional project status report including executive summary, progress metrics, milestone tracking, risk assessment, and next steps. Format according to enterprise reporting standards.`,
      'ai-recommendations': `Provide AI-powered recommendations for optimizing our NAC deployment based on PRD v2.1 best practices, including performance optimization, security enhancements, and compliance improvements.`,
      'best-practices': `Outline enterprise NAC implementation best practices per PRD v2.1 standards, including vendor selection criteria, security frameworks, compliance requirements, and implementation methodologies.`
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          {quickActions.map((action) => (
            <EnhancedButton
              key={action.action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className="text-xs justify-start h-8"
            >
              <action.icon className="h-3 w-3 mr-1.5" />
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
                <div className="prose prose-sm dark:prose-invert text-center">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    NAC Solution Platform AI Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enterprise-grade AI assistant aligned with PRD v2.1 standards. 
                    I provide professional, detailed guidance for NAC deployments, 
                    security analysis, and compliance requirements.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <Badge variant="secondary">PRD v2.1 Compliant</Badge>
                    <Badge variant="secondary">Multi-Vendor Support</Badge>
                    <Badge variant="secondary">Enterprise Security</Badge>
                  </div>
                  <p className="text-xs mt-3 text-muted-foreground">
                    Select a quick action above or ask specific questions about NAC implementation.
                  </p>
                </div>
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
                    "max-w-[85%] rounded-lg px-3 py-2",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4 text-sm'
                      : 'bg-card border mr-4 shadow-sm'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <ProfessionalMarkdown 
                      content={message.content}
                      documentType="analysis"
                      className="prose prose-sm dark:prose-invert max-w-none"
                      enableCopy={true}
                      enableDownload={false}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  )}
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