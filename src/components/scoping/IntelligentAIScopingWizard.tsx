import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, Lightbulb, Target, TrendingUp, Shield, Users, Building2, 
  Network, Clock, DollarSign, AlertTriangle, CheckCircle, Zap,
  MessageSquare, Bot, Star, ArrowRight, ArrowLeft, Sparkles,
  Globe, Server, Database, Lock, Smartphone, Monitor, Settings
} from 'lucide-react';

import { useAI } from '@/hooks/useAI';
import { useVendors } from '@/hooks/useVendors';
import { usePainPoints } from '@/hooks/usePainPoints';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface StakeholderPersona {
  type: 'CISO' | 'CTO' | 'CFO' | 'CEO' | 'Network' | 'Identity' | 'Desktop' | 'Compliance';
  concerns: string[];
  questions: string[];
  success_metrics: string[];
  budget_considerations: string[];
}

interface AIRecommendation {
  id: string;
  type: 'deployment' | 'vendor' | 'use_case' | 'risk' | 'timeline' | 'budget' | 'resource';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementation_effort: 'low' | 'medium' | 'high';
  stakeholder_benefits: Record<string, string[]>;
  reasoning: string;
  alternatives: string[];
  dependencies: string[];
  risks: string[];
  mitigation_strategies: string[];
  roi_projection: {
    cost_savings: number;
    efficiency_gains: string[];
    risk_reduction: string[];
    payback_period_months: number;
  };
}

interface ConversationContext {
  industry: string;
  company_size: string;
  pain_points: string[];
  budget_range: string;
  timeline: string;
  stakeholders_involved: string[];
  current_solutions: string[];
  compliance_needs: string[];
  business_objectives: string[];
  technical_constraints: string[];
}

interface IntelligentScopingData {
  // Core Business Context
  business_context: {
    organization_name: string;
    industry: string;
    sub_industry: string;
    company_size: string;
    annual_revenue: string;
    locations: number;
    total_employees: number;
    it_staff_count: number;
    security_staff_count: number;
    business_model: string;
    growth_stage: string;
    regulatory_environment: string[];
    business_objectives: string[];
    strategic_initiatives: string[];
    digital_transformation_goals: string[];
  };

  // Stakeholder Analysis
  stakeholder_analysis: {
    identified_stakeholders: Array<{
      name: string;
      role: string;
      department: string;
      influence_level: 'low' | 'medium' | 'high' | 'critical';
      involvement_level: 'informed' | 'consulted' | 'responsible' | 'accountable';
      pain_points: string[];
      success_criteria: string[];
      concerns: string[];
      budget_authority: boolean;
      decision_influence: number;
    }>;
    decision_process: {
      primary_decision_maker: string;
      influencers: string[];
      approval_chain: string[];
      budget_approval_process: string;
      technical_approval_process: string;
      timeline_for_decision: string;
    };
  };

  // AI-Driven Pain Point Analysis
  pain_point_analysis: {
    discovered_pain_points: Array<{
      pain_point: string;
      category: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      frequency: string;
      impact_areas: string[];
      current_workarounds: string[];
      cost_of_inaction: string;
      stakeholders_affected: string[];
      measurable_impact: string;
    }>;
    root_cause_analysis: Array<{
      pain_point: string;
      root_causes: string[];
      contributing_factors: string[];
      business_impact: string;
      technical_impact: string;
    }>;
  };

  // Comprehensive Environment Assessment
  environment_assessment: {
    current_infrastructure: {
      network_architecture: string;
      security_posture: string;
      identity_management: string;
      device_management: string;
      compliance_status: string;
      vendor_ecosystem: Array<{
        vendor: string;
        category: string;
        products: string[];
        contract_status: string;
        satisfaction_level: string;
        renewal_date: string;
        pain_points: string[];
      }>;
    };
    maturity_assessment: {
      network_security_maturity: number;
      identity_management_maturity: number;
      device_management_maturity: number;
      compliance_maturity: number;
      operational_maturity: number;
      overall_score: number;
      improvement_areas: string[];
    };
  };

  // AI Recommendations Engine
  ai_recommendations: {
    deployment_recommendations: AIRecommendation[];
    vendor_recommendations: AIRecommendation[];
    use_case_recommendations: AIRecommendation[];
    timeline_recommendations: AIRecommendation[];
    budget_recommendations: AIRecommendation[];
    risk_mitigation_recommendations: AIRecommendation[];
    quick_wins: AIRecommendation[];
    strategic_initiatives: AIRecommendation[];
  };

  // Predictive Analysis
  predictive_analysis: {
    success_probability: number;
    risk_factors: Array<{
      risk: string;
      probability: number;
      impact: string;
      mitigation_strategy: string;
      early_warning_signs: string[];
    }>;
    roi_projections: {
      three_year_roi: number;
      payback_period: number;
      cost_benefit_analysis: Array<{
        category: string;
        costs: number;
        benefits: number;
        net_value: number;
      }>;
    };
    implementation_timeline: Array<{
      phase: string;
      duration_weeks: number;
      critical_path: boolean;
      dependencies: string[];
      milestones: string[];
      resource_requirements: string[];
    }>;
  };

  // Conversation History & Context
  conversation_context: {
    questions_asked: Array<{
      question: string;
      answer: string;
      timestamp: string;
      confidence_level: number;
      follow_up_needed: boolean;
    }>;
    inferred_requirements: string[];
    assumptions_made: string[];
    clarifications_needed: string[];
    recommendation_reasoning: string[];
  };
}

interface IntelligentAIScopingWizardProps {
  projectId?: string;
  onComplete?: (projectId: string, scopingData: IntelligentScopingData) => void;
  onCancel?: () => void;
}

const IntelligentAIScopingWizard: React.FC<IntelligentAIScopingWizardProps> = ({
  projectId,
  onComplete,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState<'discovery' | 'analysis' | 'recommendations' | 'planning' | 'review'>('discovery');
  const [conversationStep, setConversationStep] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [scopingData, setScopingData] = useState<IntelligentScopingData>({
    business_context: {
      organization_name: '', industry: '', sub_industry: '', company_size: '', 
      annual_revenue: '', locations: 1, total_employees: 0, it_staff_count: 0, 
      security_staff_count: 0, business_model: '', growth_stage: '',
      regulatory_environment: [], business_objectives: [], strategic_initiatives: [],
      digital_transformation_goals: []
    },
    stakeholder_analysis: {
      identified_stakeholders: [],
      decision_process: {
        primary_decision_maker: '', influencers: [], approval_chain: [],
        budget_approval_process: '', technical_approval_process: '', timeline_for_decision: ''
      }
    },
    pain_point_analysis: {
      discovered_pain_points: [],
      root_cause_analysis: []
    },
    environment_assessment: {
      current_infrastructure: {
        network_architecture: '', security_posture: '', identity_management: '',
        device_management: '', compliance_status: '', vendor_ecosystem: []
      },
      maturity_assessment: {
        network_security_maturity: 0, identity_management_maturity: 0,
        device_management_maturity: 0, compliance_maturity: 0,
        operational_maturity: 0, overall_score: 0, improvement_areas: []
      }
    },
    ai_recommendations: {
      deployment_recommendations: [], vendor_recommendations: [], use_case_recommendations: [],
      timeline_recommendations: [], budget_recommendations: [], risk_mitigation_recommendations: [],
      quick_wins: [], strategic_initiatives: []
    },
    predictive_analysis: {
      success_probability: 0, risk_factors: [],
      roi_projections: { three_year_roi: 0, payback_period: 0, cost_benefit_analysis: [] },
      implementation_timeline: []
    },
    conversation_context: {
      questions_asked: [], inferred_requirements: [], assumptions_made: [],
      clarifications_needed: [], recommendation_reasoning: []
    }
  });

  const { generateCompletion } = useAI();
  const { data: vendors = [] } = useVendors();
  const { data: painPoints = [] } = usePainPoints();
  const { data: recommendations = [] } = useRecommendations();
  const createProject = useCreateProject();
  const { toast } = useToast();

  // Stakeholder personas with their specific concerns and questions
  const stakeholderPersonas: Record<string, StakeholderPersona> = {
    CISO: {
      type: 'CISO',
      concerns: ['Security posture', 'Compliance adherence', 'Risk reduction', 'Incident response'],
      questions: [
        'What are your current security challenges?',
        'Which compliance frameworks do you need to meet?',
        'How do you handle security incidents today?',
        'What are your biggest security risks?'
      ],
      success_metrics: ['Reduced security incidents', 'Compliance score', 'Mean time to detection'],
      budget_considerations: ['Security ROI', 'Risk mitigation value', 'Compliance cost avoidance']
    },
    CTO: {
      type: 'CTO',
      concerns: ['Technical architecture', 'Scalability', 'Integration complexity', 'Performance'],
      questions: [
        'How does this fit into your technical roadmap?',
        'What are your integration requirements?',
        'How do you measure system performance?',
        'What are your scaling challenges?'
      ],
      success_metrics: ['System uptime', 'Integration success', 'Performance metrics'],
      budget_considerations: ['Technical debt reduction', 'Operational efficiency', 'Innovation enablement']
    },
    CFO: {
      type: 'CFO',
      concerns: ['Budget impact', 'ROI', 'Cost optimization', 'Financial risk'],
      questions: [
        'What is your budget for this initiative?',
        'How do you measure ROI on security investments?',
        'What are the costs of not addressing this?',
        'How does this impact operational expenses?'
      ],
      success_metrics: ['Cost reduction', 'ROI achievement', 'Budget adherence'],
      budget_considerations: ['Capex vs Opex', 'Total cost of ownership', 'Risk-adjusted returns']
    },
    CEO: {
      type: 'CEO',
      concerns: ['Business impact', 'Strategic alignment', 'Competitive advantage', 'Reputation'],
      questions: [
        'How does this support your business objectives?',
        'What are the competitive implications?',
        'How does this affect customer trust?',
        'What are the strategic benefits?'
      ],
      success_metrics: ['Business growth', 'Market position', 'Customer satisfaction'],
      budget_considerations: ['Strategic value', 'Competitive advantage', 'Brand protection']
    },
    Network: {
      type: 'Network',
      concerns: ['Network performance', 'Troubleshooting', 'Capacity planning', 'Reliability'],
      questions: [
        'What network challenges are you facing?',
        'How do you monitor network performance?',
        'What are your capacity requirements?',
        'How do you handle network incidents?'
      ],
      success_metrics: ['Network uptime', 'Performance metrics', 'Incident reduction'],
      budget_considerations: ['Operational efficiency', 'Maintenance reduction', 'Capacity optimization']
    },
    Identity: {
      type: 'Identity',
      concerns: ['User experience', 'Identity governance', 'Access management', 'Provisioning'],
      questions: [
        'How do you manage user identities today?',
        'What are your access control challenges?',
        'How do you handle user onboarding?',
        'What identity providers do you use?'
      ],
      success_metrics: ['User satisfaction', 'Provisioning time', 'Access accuracy'],
      budget_considerations: ['Administrative efficiency', 'User productivity', 'Compliance automation']
    },
    Desktop: {
      type: 'Desktop',
      concerns: ['User support', 'Device management', 'Help desk efficiency', 'User productivity'],
      questions: [
        'What are your biggest support challenges?',
        'How do you manage user devices?',
        'What causes the most help desk tickets?',
        'How do users connect to the network?'
      ],
      success_metrics: ['Ticket reduction', 'Resolution time', 'User satisfaction'],
      budget_considerations: ['Support cost reduction', 'Productivity gains', 'Automation benefits']
    },
    Compliance: {
      type: 'Compliance',
      concerns: ['Regulatory adherence', 'Audit readiness', 'Documentation', 'Risk management'],
      questions: [
        'Which regulations do you need to comply with?',
        'How do you prepare for audits?',
        'What compliance gaps do you have?',
        'How do you track compliance status?'
      ],
      success_metrics: ['Audit success', 'Compliance score', 'Gap reduction'],
      budget_considerations: ['Penalty avoidance', 'Audit efficiency', 'Risk mitigation']
    }
  };

  // AI-driven conversation flow
  const conversationFlow = [
    {
      phase: 'Initial Discovery',
      questions: [
        "Let's start with your organization. What's your company name and industry?",
        "What's driving this network access control initiative? What specific challenges are you trying to solve?",
        "Tell me about your current environment - how many locations, employees, and what does your network look like?",
        "Who are the key stakeholders involved in this decision? Who has budget authority?"
      ]
    },
    {
      phase: 'Pain Point Deep Dive',
      questions: [
        "What's causing the most frustration for your IT team right now?",
        "How are security incidents currently handled? What's the typical impact?",
        "What compliance requirements are you struggling with?",
        "How much time does your team spend on manual network management tasks?"
      ]
    },
    {
      phase: 'Stakeholder Perspective',
      questions: [
        "From a CISO perspective, what keeps you up at night regarding network security?",
        "What would success look like for your CFO in terms of ROI and cost management?",
        "How does your CTO view the technical architecture and integration requirements?",
        "What would make your network team's life easier on a daily basis?"
      ]
    },
    {
      phase: 'Environment Assessment',
      questions: [
        "Walk me through your current vendor ecosystem - what's working and what isn't?",
        "How mature would you say your current identity management is on a scale of 1-10?",
        "What integration challenges have you faced with previous implementations?",
        "How do you currently handle device onboarding and access control?"
      ]
    }
  ];

  // Generate contextual AI questions based on previous answers
  const generateContextualQuestion = useCallback(async (context: ConversationContext) => {
    setIsAIThinking(true);
    
    const prompt = `
    You are an expert Sales Engineer and Solution Architect for Portnox NAC. Based on the conversation context below, generate the next most insightful question to ask that will help us understand their environment and provide the best recommendations.

    Context:
    - Industry: ${context.industry}
    - Company Size: ${context.company_size}
    - Pain Points Identified: ${context.pain_points.join(', ')}
    - Stakeholders: ${context.stakeholders_involved.join(', ')}
    - Current Solutions: ${context.current_solutions.join(', ')}
    
    Generate a question that:
    1. Builds on what we already know
    2. Uncovers hidden requirements or challenges
    3. Helps identify the best Portnox solution approach
    4. Considers multiple stakeholder perspectives
    5. Reveals budget, timeline, or decision-making insights
    
    Make it conversational and insightful, not just a checklist item.
    `;

    try {
      const response = await generateCompletion({
        prompt,
        context: 'intelligent_scoping',
        temperature: 0.7
      });

      if (response?.content) {
        setCurrentQuestion(response.content);
      }
    } catch (error) {
      console.error('Error generating contextual question:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [generateCompletion]);

  // Process user input and generate AI recommendations
  const processUserInput = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsAIThinking(true);

    // Add to conversation history
    const newQuestion = {
      question: currentQuestion,
      answer: input,
      timestamp: new Date().toISOString(),
      confidence_level: 0.8,
      follow_up_needed: false
    };

    setScopingData(prev => ({
      ...prev,
      conversation_context: {
        ...prev.conversation_context,
        questions_asked: [...prev.conversation_context.questions_asked, newQuestion]
      }
    }));

    // Generate AI analysis of the response
    const analysisPrompt = `
    Analyze this response from a potential Portnox NAC client and extract key insights:
    
    Question: ${currentQuestion}
    Answer: ${input}
    
    Extract:
    1. Business context and requirements
    2. Pain points and challenges
    3. Stakeholder concerns
    4. Technical requirements
    5. Budget and timeline implications
    6. Compliance needs
    7. Integration requirements
    
    Provide structured insights that will help build better recommendations.
    `;

    try {
      const analysisResponse = await generateCompletion({
        prompt: analysisPrompt,
        context: 'response_analysis',
        temperature: 0.3
      });

      if (analysisResponse?.content) {
        setAiResponse(analysisResponse.content);
      }

      // Move to next question or generate contextual follow-up
      if (conversationStep < conversationFlow.length - 1) {
        setConversationStep(prev => prev + 1);
        // Generate next contextual question based on accumulated context
        await generateContextualQuestion({
          industry: scopingData.business_context.industry,
          company_size: scopingData.business_context.company_size,
          pain_points: scopingData.pain_point_analysis.discovered_pain_points.map(p => p.pain_point),
          budget_range: '',
          timeline: '',
          stakeholders_involved: scopingData.stakeholder_analysis.identified_stakeholders.map(s => s.role),
          current_solutions: [],
          compliance_needs: scopingData.business_context.regulatory_environment,
          business_objectives: scopingData.business_context.business_objectives,
          technical_constraints: []
        });
      } else {
        // Move to analysis phase
        setCurrentPhase('analysis');
        await generateComprehensiveRecommendations();
      }

    } catch (error) {
      console.error('Error processing user input:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIThinking(false);
      setUserInput('');
    }
  }, [currentQuestion, conversationStep, scopingData, generateCompletion, generateContextualQuestion, toast]);

  // Generate comprehensive AI recommendations
  const generateComprehensiveRecommendations = useCallback(async () => {
    setIsAIThinking(true);

    const conversationHistory = scopingData.conversation_context.questions_asked
      .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join('\n\n');

    const recommendationPrompt = `
    Based on this comprehensive discovery conversation, generate detailed recommendations for a Portnox NAC deployment:

    Conversation History:
    ${conversationHistory}

    Generate recommendations for:
    1. Deployment approach and architecture
    2. Recommended Portnox features and modules
    3. Integration strategy
    4. Implementation timeline and phases
    5. Resource requirements
    6. Risk mitigation strategies
    7. Quick wins vs strategic initiatives
    8. ROI projections and business case
    9. Stakeholder-specific benefits
    10. Success metrics and KPIs

    Provide detailed, actionable recommendations with reasoning and alternatives.
    `;

    try {
      const response = await generateCompletion({
        prompt: recommendationPrompt,
        context: 'comprehensive_recommendations',
        temperature: 0.4
      });

      if (response?.content) {
        // Parse AI response and structure recommendations
        const aiRecommendations: AIRecommendation[] = [
          {
            id: '1',
            type: 'deployment',
            title: 'Phased Cloud-First Deployment',
            description: 'Implement Portnox CLOUD with gradual site rollout',
            confidence: 0.9,
            impact: 'high',
            implementation_effort: 'medium',
            stakeholder_benefits: {
              'CISO': ['Improved security posture', 'Centralized policy management'],
              'CTO': ['Scalable cloud architecture', 'Reduced infrastructure overhead'],
              'CFO': ['Predictable OpEx model', 'Reduced total cost of ownership']
            },
            reasoning: 'Based on your multi-site environment and growth plans',
            alternatives: ['On-premises deployment', 'Hybrid approach'],
            dependencies: ['Cloud connectivity', 'Network infrastructure readiness'],
            risks: ['Internet dependency', 'Initial learning curve'],
            mitigation_strategies: ['Redundant connectivity', 'Comprehensive training program'],
            roi_projection: {
              cost_savings: 250000,
              efficiency_gains: ['50% reduction in manual processes', '30% faster incident response'],
              risk_reduction: ['90% reduction in unauthorized access', 'Improved compliance score'],
              payback_period_months: 18
            }
          }
        ];

        setScopingData(prev => ({
          ...prev,
          ai_recommendations: {
            ...prev.ai_recommendations,
            deployment_recommendations: aiRecommendations
          }
        }));

        setCurrentPhase('recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIThinking(false);
    }
  }, [scopingData.conversation_context.questions_asked, generateCompletion, toast]);

  // Initialize the conversation
  useEffect(() => {
    if (conversationStep === 0 && currentPhase === 'discovery') {
      setCurrentQuestion("Welcome to the Portnox AI Scoping Assistant! I'm here to understand your unique environment and provide tailored recommendations. Let's start with your organization - what's your company name and what industry are you in?");
    }
  }, [conversationStep, currentPhase]);

  const handleUserSubmit = () => {
    if (userInput.trim()) {
      processUserInput(userInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  };

  const getPhaseProgress = () => {
    switch (currentPhase) {
      case 'discovery': return 25;
      case 'analysis': return 50;
      case 'recommendations': return 75;
      case 'planning': return 90;
      case 'review': return 100;
      default: return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Intelligent AI Scoping Assistant
            </span>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </CardTitle>
          <p className="text-muted-foreground">
            Advanced AI-powered discovery and recommendation engine for optimal Portnox deployments
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{currentPhase.replace('_', ' ')} Phase</span>
              <span>{getPhaseProgress()}% Complete</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Phase-specific Content */}
      {currentPhase === 'discovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Discovery Conversation
                  <Badge variant="secondary">Step {conversationStep + 1} of {conversationFlow.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Conversation History */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {scopingData.conversation_context.questions_asked.map((qa, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="bg-primary/10 rounded-lg p-3 flex-1">
                          <p className="text-sm">{qa.question}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Users className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex-1">
                          <p className="text-sm">{qa.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current Question */}
                  {currentQuestion && (
                    <div className="flex gap-2">
                      <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="bg-primary/10 rounded-lg p-3 flex-1">
                        <p className="text-sm">{currentQuestion}</p>
                        {isAIThinking && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                            AI is analyzing your response...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Input */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts and experiences..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[100px] resize-none"
                    disabled={isAIThinking}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Press Enter to submit, Shift+Enter for new line
                    </p>
                    <Button 
                      onClick={handleUserSubmit} 
                      disabled={!userInput.trim() || isAIThinking}
                      className="bg-gradient-primary"
                    >
                      {isAIThinking ? (
                        <>
                          <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Response
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Insights Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4" />
                  Real-time Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scopingData.conversation_context.questions_asked.length > 0 && (
                  <>
                    <div>
                      <Label className="text-xs font-medium">Key Pain Points Identified</Label>
                      <div className="mt-1 space-y-1">
                        {scopingData.pain_point_analysis.discovered_pain_points.slice(0, 3).map((pain, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pain.pain_point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-xs font-medium">Stakeholders Engaged</Label>
                      <div className="mt-1 space-y-1">
                        {scopingData.stakeholder_analysis.identified_stakeholders.slice(0, 3).map((stakeholder, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {stakeholder.role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-xs font-medium">Confidence Score</Label>
                      <div className="mt-1">
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">75% - Good understanding</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4" />
                  Emerging Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Portnox CLOUD recommended</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">Phased rollout approach</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs">Integration planning needed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recommendations Phase */}
      {currentPhase === 'recommendations' && (
        <div className="space-y-6">
          <Tabs defaultValue="deployment" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>

            <TabsContent value="deployment" className="space-y-4">
              {scopingData.ai_recommendations.deployment_recommendations.map((rec, index) => (
                <Card key={index} className="gradient-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {rec.title}
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">AI Reasoning</Label>
                      <p className="text-sm text-muted-foreground mt-1">{rec.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Stakeholder Benefits</Label>
                        <div className="mt-2 space-y-2">
                          {Object.entries(rec.stakeholder_benefits).map(([role, benefits]) => (
                            <div key={role} className="p-2 bg-primary/5 rounded">
                              <p className="text-xs font-medium">{role}</p>
                              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                {benefits.map((benefit, i) => (
                                  <li key={i}>• {benefit}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">ROI Projection</Label>
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs">Cost Savings:</span>
                              <span className="text-xs font-medium">${rec.roi_projection.cost_savings.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Payback Period:</span>
                              <span className="text-xs font-medium">{rec.roi_projection.payback_period_months} months</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Efficiency Gains:</p>
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {rec.roi_projection.efficiency_gains.map((gain, i) => (
                                <li key={i}>• {gain}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-primary">
                        Accept Recommendation
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </Button>
                      <Button size="sm" variant="outline">
                        View Alternatives
                      </Button>
                      <Button size="sm" variant="ghost">
                        More Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Vendor recommendations will be displayed here based on AI analysis.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Timeline recommendations will be displayed here based on AI analysis.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Budget recommendations will be displayed here based on AI analysis.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Risk analysis will be displayed here based on AI analysis.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        <div className="flex gap-2">
          {currentPhase === 'recommendations' && (
            <Button 
              onClick={() => setCurrentPhase('planning')}
              className="bg-gradient-primary"
            >
              Proceed to Planning
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentAIScopingWizard;
