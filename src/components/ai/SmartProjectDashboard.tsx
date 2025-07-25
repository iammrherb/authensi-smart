import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, TrendingUp, Target, Users, Building2, Shield, Network, 
  FileCheck, Zap, CheckCircle, AlertTriangle, Clock, Lightbulb,
  Rocket, Activity, BarChart3, Calendar, Monitor
} from 'lucide-react';

interface SmartInsight {
  id: string;
  type: 'performance' | 'risk' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface ProjectHealth {
  overall: number;
  timeline: number;
  budget: number;
  quality: number;
  risks: number;
}

interface SmartProjectDashboardProps {
  projectId?: string;
  projects?: any[];
}

const SmartProjectDashboard: React.FC<SmartProjectDashboardProps> = ({ 
  projectId, 
  projects = [] 
}) => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [projectHealth, setProjectHealth] = useState<ProjectHealth>({
    overall: 85,
    timeline: 92,
    budget: 78,
    quality: 89,
    risks: 15
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateSmartInsights();
  }, [projectId, projects]);

  const generateSmartInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedInsights: SmartInsight[] = [
      {
        id: '1',
        type: 'performance',
        title: 'Timeline Optimization Opportunity',
        description: 'AI detected that running parallel testing phases could reduce project timeline by 3 weeks',
        value: '3 weeks saved',
        trend: 'up',
        impact: 'high',
        actionable: true
      },
      {
        id: '2',
        type: 'risk',
        title: 'Vendor Integration Risk',
        description: 'Multiple vendor dependencies detected. 2 vendors have compatibility concerns',
        value: 'Medium Risk',
        trend: 'down',
        impact: 'medium',
        actionable: true
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Budget Efficiency Gain',
        description: 'Bulk procurement opportunities identified for 5 similar projects',
        value: '12% savings',
        trend: 'up',
        impact: 'high',
        actionable: true
      },
      {
        id: '4',
        type: 'prediction',
        title: 'Success Rate Forecast',
        description: 'Based on current trajectory, project completion likelihood is very high',
        value: '94%',
        trend: 'up',
        impact: 'low',
        actionable: false
      }
    ];
    
    setInsights(generatedInsights);
    setIsAnalyzing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'prediction': return Target;
      default: return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-blue-600 bg-blue-100';
      case 'risk': return 'text-red-600 bg-red-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'prediction': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const healthCategories = [
    { key: 'overall', label: 'Overall Health', icon: Target, color: 'text-blue-600' },
    { key: 'timeline', label: 'Timeline', icon: Clock, color: 'text-green-600' },
    { key: 'budget', label: 'Budget', icon: BarChart3, color: 'text-purple-600' },
    { key: 'quality', label: 'Quality', icon: CheckCircle, color: 'text-blue-600' },
    { key: 'risks', label: 'Risk Level', icon: AlertTriangle, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Dashboard Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Smart Project Intelligence
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    AI-Powered
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time insights, predictions, and optimization recommendations
                </p>
              </div>
            </div>
            {isAnalyzing && (
              <div className="animate-spin h-6 w-6 bg-primary/20 rounded-full border-t-2 border-primary" />
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Project Health</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Project Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {healthCategories.map(({ key, label, icon: Icon, color }) => {
              const value = projectHealth[key as keyof ProjectHealth];
              const isRisk = key === 'risks';
              const displayValue = isRisk ? value : value;
              const progressValue = isRisk ? 100 - value : value;
              
              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-2xl font-bold">
                        {displayValue}{isRisk ? '' : '%'}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{label}</p>
                    <Progress 
                      value={progressValue} 
                      className={`h-2 ${isRisk ? 'bg-red-100' : ''}`} 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {isRisk ? 'Lower is better' : 'Higher is better'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Overall Status: Excellent</strong> - Project is performing above expectations with minimal risks identified.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-600">Strengths</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Timeline adherence is excellent
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Quality metrics exceeding targets
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Low risk profile maintained
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-600">Attention Areas</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        Budget tracking needs improvement
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        Vendor coordination optimization needed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colorClass = getInsightColor(insight.type);
            
            return (
              <Card key={insight.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(insight.trend)}
                          <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {insight.value}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {insight.type}
                          </Badge>
                        </div>
                        
                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            <Rocket className="h-4 w-4 mr-2" />
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Discovery Phase</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">95% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Design Phase</span>
                    <Badge variant="secondary">Starting Next Week</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Implementation</span>
                    <Badge variant="outline">2 weeks ahead of schedule</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Success Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-time Delivery</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Adherence</span>
                    <span className="font-bold text-blue-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality Targets</span>
                    <span className="font-bold text-green-600">96%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Resource Optimization:</strong> AI recommends reallocating 2 engineers from Project A to accelerate critical path by 1 week.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Process Improvement:</strong> Implementing parallel testing could reduce overall timeline by 15%.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Risk Mitigation:</strong> Adding vendor backup options for critical components reduces project risk by 30%.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartProjectDashboard;