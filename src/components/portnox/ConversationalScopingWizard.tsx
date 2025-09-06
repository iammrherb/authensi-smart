import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, Bot, User, Brain, Sparkles, Target,
  TrendingUp, Shield, Users, Building2, DollarSign,
  Clock, CheckCircle, ArrowRight, Mic, Send, Lightbulb
} from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  persona?: string;
  insights?: string[];
  recommendations?: string[];
}

interface StakeholderProfile {
  type: 'CISO' | 'CTO' | 'CFO' | 'CEO' | 'Network' | 'Identity';
  name: string;
  concerns: string[];
  detected: boolean;
  confidence: number;
}

interface ScopingInsight {
  category: 'pain_point' | 'requirement' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  stakeholder_impact: string[];
  business_value: string;
}

interface ConversationalScopingWizardProps {
  projectId?: string;
  onComplete?: (scopingData: any) => void;
  onCancel?: () => void;
}

const ConversationalScopingWizard: React.FC<ConversationalScopingWizardProps> = ({
  projectId,
  onComplete,
  onCancel
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [scopingProgress, setScopingProgress] = useState(0);
  const [detectedStakeholders, setDetectedStakeholders] = useState<StakeholderProfile[]>([]);
  const [scopingInsights, setScopingInsights] = useState<ScopingInsight[]>([]);
  const [currentPersona, setCurrentPersona] = useState<string>('Solution Architect');
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateCompletion } = useAI();
  const { toast } = useToast();

  useEffect(() => {
    initializeConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    const welcomeMessage: ConversationMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `🚀 **Welcome to the future of NAC scoping!**

I'm your AI Solutions Architect, and I'm here to revolutionize how we discover your network access control needs. 

Instead of boring forms and checklists, we'll have a natural conversation that adapts to your specific role and concerns. I'll detect who you are, understand your challenges, and provide personalized recommendations.

**Let's start with something simple:** Tell me about your organization and what's driving this NAC initiative. What's keeping you up at night when it comes to network security?`,
      timestamp: new Date(),
      persona: 'Solution Architect',
      insights: ['conversation_started', 'stakeholder_detection_active']
    };

    setMessages([welcomeMessage]);
    
    // Initialize stakeholder profiles
    const initialStakeholders: StakeholderProfile[] = [
      {
        type: 'CISO',
        name: 'Chief Information Security Officer',
        concerns: ['Security posture', 'Compliance', 'Risk reduction', 'Incident response'],
        detected: false,
        confidence: 0
      },
      {
        type: 'CTO',
        name: 'Chief Technology Officer', 
        concerns: ['Architecture', 'Integration', 'Scalability', 'Performance'],
        detected: false,
        confidence: 0
      },
      {
        type: 'CFO',
        name: 'Chief Financial Officer',
        concerns: ['Budget', 'ROI', 'Cost optimization', 'Financial risk'],
        detected: false,
        confidence: 0
      },
      {
        type: 'Network',
        name: 'Network Administrator',
        concerns: ['Performance', 'Troubleshooting', 'Capacity', 'Reliability'],
        detected: false,
        confidence: 0
      }
    ];

    setDetectedStakeholders(initialStakeholders);
  };

  const analyzeMessage = async (userMessage: string) => {
    const prompt = `
    You are an expert AI Solutions Architect for Portnox NAC. Analyze the user's message and provide:

    1. Stakeholder Role Detection (CISO, CTO, CFO, Network Admin, etc.)
    2. Pain Points Identified
    3. Technical Requirements Hints
    4. Business Context Clues
    5. Next Intelligent Question

    User Message: "${userMessage}"

    Previous Context: ${messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

    Respond as a conversational AI that:
    - Adapts to the detected stakeholder persona
    - Asks insightful follow-up questions
    - Provides relevant Portnox insights
    - Maintains executive-level conversation quality
    - Builds toward a comprehensive scoping solution

    Make it feel like talking to the world's best solutions architect.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'conversational_scoping',
        temperature: 0.7
      });

      return response?.content || "I understand. Let me ask a follow-up question to better understand your environment...";
    } catch (error) {
      console.error('AI analysis error:', error);
      return "Thank you for that insight. Can you tell me more about your specific challenges?";
    }
  };

  const detectStakeholder = (message: string) => {
    const keywords = {
      CISO: ['security', 'compliance', 'risk', 'incident', 'breach', 'audit', 'governance'],
      CTO: ['architecture', 'integration', 'scalability', 'performance', 'technical', 'infrastructure'],
      CFO: ['budget', 'cost', 'roi', 'financial', 'investment', 'savings', 'expense'],
      Network: ['network', 'switch', 'router', 'troubleshoot', 'performance', 'vlan', 'bandwidth']
    };

    setDetectedStakeholders(prev => 
      prev.map(stakeholder => {
        const messageWords = message.toLowerCase().split(' ');
        const matchCount = keywords[stakeholder.type]?.filter(keyword => 
          messageWords.some(word => word.includes(keyword))
        ).length || 0;
        
        const newConfidence = Math.min(stakeholder.confidence + (matchCount * 10), 100);
        
        return {
          ...stakeholder,
          confidence: newConfidence,
          detected: newConfidence > 30
        };
      })
    );
  };

  const addScopingInsight = (message: string) => {
    // Extract insights from user messages
    const insights: ScopingInsight[] = [];
    
    if (message.toLowerCase().includes('guest') || message.toLowerCase().includes('byod')) {
      insights.push({
        category: 'requirement',
        title: 'BYOD/Guest Access Management',
        description: 'Need for secure guest and personal device access',
        confidence: 85,
        stakeholder_impact: ['Network Team', 'Security Team'],
        business_value: 'Improved security posture and user experience'
      });
    }

    if (message.toLowerCase().includes('compliance') || message.toLowerCase().includes('audit')) {
      insights.push({
        category: 'requirement',
        title: 'Compliance & Audit Readiness',
        description: 'Regulatory compliance requirements detected',
        confidence: 90,
        stakeholder_impact: ['CISO', 'Compliance Team'],
        business_value: 'Reduced audit costs and regulatory risk'
      });
    }

    if (insights.length > 0) {
      setScopingInsights(prev => [...prev, ...insights]);
      setScopingProgress(prev => Math.min(prev + 15, 100));
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsAIThinking(true);

    // Analyze the message for insights
    detectStakeholder(currentInput);
    addScopingInsight(currentInput);

    // Generate AI response
    const aiResponse = await analyzeMessage(currentInput);
    
    const assistantMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      confidence: 85,
      persona: currentPersona
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsAIThinking(false);
    setScopingProgress(prev => Math.min(prev + 5, 100));
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "🎤 Listening...",
          description: "Speak naturally about your network challenges",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Please try typing instead",
          variant: "destructive"
        });
      };

      recognition.start();
    } else {
      toast({
        title: "Voice not supported",
        description: "Please use the text input",
        variant: "destructive"
      });
    }
  };

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'CISO': return <Shield className="h-4 w-4" />;
      case 'CTO': return <Brain className="h-4 w-4" />;
      case 'CFO': return <DollarSign className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Card className="border-b border-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Conversational AI Scoping</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Natural language requirements gathering powered by AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium">Progress: {Math.round(scopingProgress)}%</div>
                <Progress value={scopingProgress} className="w-24 h-2" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-1 gap-6 p-6">
        {/* Main Conversation */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Solutions Architect
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-last' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content}
                        </div>
                        {message.confidence && (
                          <div className="mt-2 text-xs opacity-70 flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {message.confidence}% confidence
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isAIThinking && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">AI is analyzing your requirements...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Tell me about your network challenges..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={isListening ? 'bg-red-100 text-red-600' : ''}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>
                <Button onClick={handleSendMessage} disabled={!currentInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Sidebar */}
        <div className="w-80 space-y-4">
          {/* Detected Stakeholders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detected Stakeholders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {detectedStakeholders.map((stakeholder) => (
                <div 
                  key={stakeholder.type}
                  className={`p-3 rounded-lg border transition-all ${
                    stakeholder.detected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPersonaIcon(stakeholder.type)}
                      <span className="font-medium text-sm">{stakeholder.type}</span>
                    </div>
                    {stakeholder.detected && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <Progress value={stakeholder.confidence} className="h-1" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(stakeholder.confidence)}% confidence
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Live Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scopingInsights.map((insight, index) => (
                <Alert key={index} className="animate-fade-in">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">{insight.title}</div>
                    <div className="text-sm text-muted-foreground">{insight.description}</div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </AlertDescription>
                </Alert>
              ))}
              
              {scopingInsights.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Insights will appear as we learn about your environment
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Requirements
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ArrowRight className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConversationalScopingWizard;