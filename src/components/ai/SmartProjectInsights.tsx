import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAI } from '@/hooks/useAI';
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  FileText,
  RefreshCw,
  Building2
} from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  client_name: string;
  industry: string;
  deployment_type: string;
  security_level: string;
  total_sites: number;
  total_endpoints: number;
  progress_percentage: number;
  current_phase: string;
  success_criteria: any[];
  pain_points: any[];
}

interface SmartProjectInsightsProps {
  projectData: ProjectData;
  useCases?: any[];
  vendors?: any[];
  className?: string;
}

const SmartProjectInsights: React.FC<SmartProjectInsightsProps> = ({
  projectData,
  useCases = [],
  vendors = [],
  className
}) => {
  const [insights, setInsights] = useState<{
    summary?: string;
    recommendations?: string;
    risks?: string;
    timeline?: string;
    optimization?: string;
    compliance?: string;
    troubleshooting?: string;
    nextSteps?: string;
  }>({});
  const [activeTab, setActiveTab] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshingTab, setRefreshingTab] = useState<string | null>(null);
  
  const { 
    generateProjectSummary, 
    generateRecommendations, 
    generateCompletion,
    troubleshootIssue,
    enhanceNotes,
    isLoading 
  } = useAI();

  const generateInsights = async (specificTab?: string) => {
    setIsGenerating(!specificTab);
    if (specificTab) setRefreshingTab(specificTab);
    
    try {
      const promises: Promise<any>[] = [];
      const insightTypes: string[] = [];

      if (!specificTab || specificTab === 'summary') {
        promises.push(generateProjectSummary(projectData));
        insightTypes.push('summary');
      }
      
      if (!specificTab || specificTab === 'recommendations') {
        promises.push(generateRecommendations(projectData, useCases, vendors));
        insightTypes.push('recommendations');
      }
      
      if (!specificTab || specificTab === 'risks') {
        promises.push(generateCompletion({
          prompt: `Analyze potential risks and challenges for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Provide comprehensive risk assessment with specific mitigation strategies, timeline impact, and resource requirements.`,
          context: 'risk_analysis',
          provider: 'claude',
          temperature: 0.3
        }));
        insightTypes.push('risks');
      }
      
      if (!specificTab || specificTab === 'timeline') {
        promises.push(generateCompletion({
          prompt: `Create a detailed implementation timeline for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Include phases, milestones, dependencies, resource allocation, and critical path analysis.`,
          context: 'timeline_planning',
          provider: 'gemini',
          temperature: 0.4
        }));
        insightTypes.push('timeline');
      }
      
      if (!specificTab || specificTab === 'optimization') {
        promises.push(generateCompletion({
          prompt: `Analyze optimization opportunities for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Focus on performance, cost reduction, efficiency gains, and best practices implementation.`,
          context: 'optimization_analysis',
          provider: 'openai',
          temperature: 0.6
        }));
        insightTypes.push('optimization');
      }
      
      if (!specificTab || specificTab === 'compliance') {
        promises.push(generateCompletion({
          prompt: `Evaluate compliance requirements and strategies for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Include regulatory frameworks, security standards, audit requirements, and documentation needs.`,
          context: 'compliance_analysis',
          provider: 'claude',
          temperature: 0.2
        }));
        insightTypes.push('compliance');
      }
      
      if (!specificTab || specificTab === 'troubleshooting') {
        promises.push(troubleshootIssue(
          `Common implementation challenges for ${projectData.deployment_type} deployment in ${projectData.industry} industry`,
          { projectData, useCases, vendors }
        ));
        insightTypes.push('troubleshooting');
      }
      
      if (!specificTab || specificTab === 'nextSteps') {
        promises.push(generateCompletion({
          prompt: `Generate actionable next steps for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Provide immediate actions, short-term goals, and long-term strategic recommendations with clear ownership and timelines.`,
          context: 'next_steps',
          provider: 'gemini',
          temperature: 0.5
        }));
        insightTypes.push('nextSteps');
      }

      const results = await Promise.allSettled(promises);
      
      const newInsights = { ...insights };
      results.forEach((result, index) => {
        const insightType = insightTypes[index];
        if (result.status === 'fulfilled') {
          if (insightType === 'summary' || insightType === 'recommendations') {
            newInsights[insightType as keyof typeof newInsights] = result.value;
          } else {
            newInsights[insightType as keyof typeof newInsights] = result.value?.content || result.value;
          }
        } else {
          newInsights[insightType as keyof typeof newInsights] = `Failed to generate ${insightType.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        }
      });

      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
      setRefreshingTab(null);
    }
  };

  useEffect(() => {
    // Auto-generate insights when component mounts
    generateInsights();
  }, [projectData.id]);

  const insightTabs = [
    {
      id: 'summary',
      label: 'Executive Summary',
      icon: FileText,
      content: insights.summary,
      color: 'text-blue-500',
      description: 'Comprehensive project overview'
    },
    {
      id: 'recommendations',
      label: 'AI Recommendations',
      icon: Lightbulb,
      content: insights.recommendations,
      color: 'text-yellow-500',
      description: 'Smart suggestions and optimizations'
    },
    {
      id: 'risks',
      label: 'Risk Analysis',
      icon: AlertTriangle,
      content: insights.risks,
      color: 'text-red-500',
      description: 'Potential challenges and mitigation'
    },
    {
      id: 'timeline',
      label: 'Smart Timeline',
      icon: Clock,
      content: insights.timeline,
      color: 'text-green-500',
      description: 'Implementation schedule and milestones'
    },
    {
      id: 'optimization',
      label: 'Optimization',
      icon: TrendingUp,
      content: insights.optimization,
      color: 'text-purple-500',
      description: 'Performance and efficiency improvements'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: CheckCircle,
      content: insights.compliance,
      color: 'text-indigo-500',
      description: 'Regulatory and security standards'
    },
    {
      id: 'troubleshooting',
      label: 'Troubleshooting',
      icon: Zap,
      content: insights.troubleshooting,
      color: 'text-orange-500',
      description: 'Common issues and solutions'
    },
    {
      id: 'nextSteps',
      label: 'Next Steps',
      icon: Target,
      content: insights.nextSteps,
      color: 'text-cyan-500',
      description: 'Actionable recommendations'
    }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className={`bg-gradient-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>AI Project Insights</span>
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              Powered by Multi-AI
            </Badge>
          </CardTitle>
          
          <EnhancedButton
            onClick={() => generateInsights()}
            disabled={isGenerating || isLoading}
            loading={isGenerating || isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Insights
          </EnhancedButton>
        </div>

        {/* Project Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-primary mr-1" />
            </div>
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className={`text-lg font-bold ${getProgressColor(projectData.progress_percentage)}`}>
              {projectData.progress_percentage}%
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Building2 className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <div className="text-sm text-muted-foreground">Sites</div>
            <div className="text-lg font-bold">{projectData.total_sites || 0}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-yellow-500 mr-1" />
            </div>
            <div className="text-sm text-muted-foreground">Endpoints</div>
            <div className="text-lg font-bold">{projectData.total_endpoints || 0}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            </div>
            <div className="text-sm text-muted-foreground">Phase</div>
            <div className="text-sm font-bold capitalize">{projectData.current_phase}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
            {insightTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-lg text-left transition-all hover:scale-105 border ${
                  activeTab === tab.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border bg-card hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <tab.icon className={`h-4 w-4 ${tab.color}`} />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {tab.description}
                </p>
              </button>
            ))}
          </div>

          {insightTabs.map((tab) => (
            <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <tab.icon className={`h-5 w-5 ${tab.color}`} />
                  <h3 className="text-lg font-semibold">{tab.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {tab.description}
                  </Badge>
                </div>
                <EnhancedButton
                  onClick={() => generateInsights(tab.id)}
                  disabled={refreshingTab === tab.id || isGenerating}
                  loading={refreshingTab === tab.id}
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </EnhancedButton>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {(refreshingTab === tab.id || (isGenerating && !tab.content)) ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">AI is analyzing your project...</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generating {tab.label.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ) : tab.content ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div 
                        className="bg-card/50 border rounded-lg p-4"
                        dangerouslySetInnerHTML={{
                          __html: tab.content
                            .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
                              const language = lang || 'text';
                              return `<div class="border rounded-lg overflow-hidden my-4"><div class="border-b bg-muted/30 px-3 py-2 text-xs font-medium flex items-center justify-between"><span>${language.toUpperCase()}</span><button class="text-xs text-muted-foreground hover:text-foreground">Copy</button></div><pre class="p-4 bg-muted/10 overflow-x-auto"><code class="language-${language} text-sm font-mono">${code.trim()}</code></pre></div>`;
                            })
                            .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-primary mt-6 mb-3 flex items-center"><span class="w-2 h-2 bg-primary rounded-full mr-2"></span>$1</h3>')
                            .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-primary mt-8 mb-4">$1</h2>')
                            .replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-primary mb-6">$1</h1>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            .replace(/^- (.*)$/gm, '<div class="flex items-start space-x-2 py-1"><div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div><span>$1</span></div>')
                            .replace(/^\d+\. (.*)$/gm, '<div class="flex items-start space-x-2 py-1"><div class="w-5 h-5 bg-primary/10 text-primary text-xs rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 font-medium">$&</div><span>$1</span></div>')
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      <tab.icon className={`h-16 w-16 mx-auto mb-4 ${tab.color} opacity-30`} />
                      <p className="text-lg font-medium mb-2">No {tab.label} Available</p>
                      <p className="text-sm mb-4">{tab.description}</p>
                      <EnhancedButton
                        onClick={() => generateInsights(tab.id)}
                        variant="outline"
                        size="sm"
                      >
                        Generate {tab.label}
                      </EnhancedButton>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartProjectInsights;