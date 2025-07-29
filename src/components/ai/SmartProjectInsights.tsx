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
  }>({});
  const [activeTab, setActiveTab] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    generateProjectSummary, 
    generateRecommendations, 
    generateCompletion,
    isLoading 
  } = useAI();

  const generateInsights = async () => {
    setIsGenerating(true);
    
    try {
      // Generate different types of insights in parallel
      const [summaryResult, recommendationsResult, risksResult, timelineResult] = await Promise.allSettled([
        generateProjectSummary(projectData),
        generateRecommendations(projectData, useCases, vendors),
        generateCompletion({
          prompt: `Analyze potential risks and challenges for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Provide risk assessment and mitigation strategies.`,
          context: 'risk_analysis',
          provider: 'claude'
        }),
        generateCompletion({
          prompt: `Create a detailed implementation timeline for this Portnox NAC project: ${JSON.stringify(projectData, null, 2)}. Include phases, milestones, and dependencies.`,
          context: 'timeline_planning',
          provider: 'gemini'
        })
      ]);

      setInsights({
        summary: summaryResult.status === 'fulfilled' ? summaryResult.value : 'Failed to generate summary',
        recommendations: recommendationsResult.status === 'fulfilled' ? recommendationsResult.value : 'Failed to generate recommendations',
        risks: risksResult.status === 'fulfilled' ? risksResult.value?.content : 'Failed to generate risk analysis',
        timeline: timelineResult.status === 'fulfilled' ? timelineResult.value?.content : 'Failed to generate timeline'
      });
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
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
      color: 'text-blue-500'
    },
    {
      id: 'recommendations',
      label: 'AI Recommendations',
      icon: Lightbulb,
      content: insights.recommendations,
      color: 'text-yellow-500'
    },
    {
      id: 'risks',
      label: 'Risk Analysis',
      icon: AlertTriangle,
      content: insights.risks,
      color: 'text-red-500'
    },
    {
      id: 'timeline',
      label: 'Smart Timeline',
      icon: Clock,
      content: insights.timeline,
      color: 'text-green-500'
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
            onClick={generateInsights}
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
          <TabsList className="grid w-full grid-cols-4">
            {insightTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                <tab.icon className={`h-4 w-4 mr-1 ${tab.color}`} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {insightTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <ScrollArea className="h-[400px] mt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {(isGenerating || isLoading) ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="loading-spinner mx-auto mb-4" />
                        <p className="text-muted-foreground">AI is analyzing your project...</p>
                      </div>
                    </div>
                  ) : tab.content ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {tab.content}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <tab.icon className={`h-12 w-12 mx-auto mb-4 ${tab.color} opacity-50`} />
                      <p>No insights available. Click "Refresh Insights" to generate AI analysis.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartProjectInsights;