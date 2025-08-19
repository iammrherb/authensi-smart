import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, TrendingDown, Target, Zap, Shield, Clock, 
  DollarSign, Users, Globe, Database, Cpu, Network, 
  BarChart3, PieChart, LineChart, Activity, AlertTriangle,
  CheckCircle, Star, Rocket, Brain, Sparkles, Settings,
  ThumbsUp, ThumbsDown, RefreshCw, Download, Filter,
  Calendar, MapPin, FileText, Code, GitBranch, Layers,
  Monitor, Gauge, Award, Trophy, Medal, Crown, Flame
} from "lucide-react";
import { useEnhancedAI } from "@/hooks/useEnhancedAI";
import { useAIInsights } from "@/hooks/useAIInsights";
import { optimizationEngine } from "@/services/AIOptimizationEngine";

interface DeploymentMetrics {
  successRate: number;
  avgDeploymentTime: number;
  rollbackRate: number;
  resourceUtilization: number;
  costEfficiency: number;
  performanceScore: number;
  securityScore: number;
  automationLevel: number;
}

interface ResourceAllocation {
  cpu: { allocated: number; used: number; efficiency: number };
  memory: { allocated: number; used: number; efficiency: number };
  storage: { allocated: number; used: number; efficiency: number };
  network: { allocated: number; used: number; efficiency: number };
  cost: { budgeted: number; actual: number; variance: number };
}

interface MilestoneAchievement {
  id: string;
  name: string;
  category: 'deployment' | 'performance' | 'security' | 'cost' | 'quality';
  status: 'completed' | 'in_progress' | 'at_risk' | 'delayed';
  progress: number;
  targetDate: string;
  actualDate?: string;
  impact: 'high' | 'medium' | 'low';
  dependencies: string[];
  blockers: string[];
  recommendations: string[];
}

interface AIRecommendation {
  id: string;
  type: 'optimization' | 'security' | 'cost' | 'performance' | 'deployment';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  expectedBenefit: string;
  implementationSteps: string[];
  estimatedTime: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  tags: string[];
  createdAt: string;
  status: 'new' | 'reviewed' | 'approved' | 'implemented' | 'rejected';
}

interface EpicMetrics {
  overallHealth: number;
  velocityTrend: number;
  qualityScore: number;
  deliveryPredictability: number;
  teamEfficiency: number;
  customerSatisfaction: number;
  technicalDebt: number;
  innovationIndex: number;
}

export const AIInsightsDashboard: React.FC = () => {
  const { 
    deploymentMetrics, 
    resourceAllocation, 
    milestones, 
    recommendations, 
    epicMetrics, 
    optimizationOpportunities,
    loading, 
    lastUpdated, 
    refreshInsights, 
    generateAIRecommendations, 
    updateRecommendationStatus 
  } = useAIInsights();
  
  const { generateCompletion, isLoading: aiLoading } = useEnhancedAI();
  const { toast } = useToast();
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);

  useEffect(() => {
    loadOptimizationResults();
    // Set up autonomous optimization every 5 minutes
    if (autonomousMode) {
      const interval = setInterval(runAutonomousOptimization, 300000);
      return () => clearInterval(interval);
    }
  }, [autonomousMode]);

  const loadOptimizationResults = async () => {
    try {
      const results = await optimizationEngine.analyzeSystemPerformance();
      setOptimizationResults(results);
    } catch (error) {
      console.error('Error loading optimization results:', error);
    }
  };

  const runAutonomousOptimization = async () => {
    try {
      const optimizations = await optimizationEngine.generateAutonomousRecommendations();
      if (optimizations.length > 0) {
        toast({
          title: "Autonomous Optimization",
          description: `${optimizations.length} new optimization opportunities identified`,
        });
      }
    } catch (error) {
      console.error('Error running autonomous optimization:', error);
    }
  };

  const handleOptimizeDeployment = async () => {
    try {
      const optimizations = await optimizationEngine.optimizeDeploymentStrategy();
      toast({
        title: "Deployment Optimization",
        description: `Generated ${optimizations.length} deployment strategy recommendations`,
      });
    } catch (error) {
      console.error('Error optimizing deployment:', error);
    }
  };

  const handleOptimizeResources = async () => {
    try {
      const optimization = await optimizationEngine.optimizeResourceAllocation();
      const totalSavings = optimization.cpu.costSavings + optimization.memory.costSavings + 
                          optimization.storage.costSavings + optimization.network.costSavings;
      toast({
        title: "Resource Optimization",
        description: `Potential cost savings: $${totalSavings.toFixed(0)}/month`,
      });
    } catch (error) {
      console.error('Error optimizing resources:', error);
    }
  };

  const handleRecommendationAction = (id: string, action: 'approve' | 'reject' | 'implement') => {
    updateRecommendationStatus(id, action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'implemented');

    toast({
      title: "Recommendation Updated",
      description: `Recommendation ${action}ed successfully`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'at_risk': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Auto-Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Insights & Autonomous Optimization
          </h1>
          <p className="text-muted-foreground mt-1">
            Intelligent analysis, recommendations, and autonomous system optimization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <Activity className="h-3 w-3" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </Badge>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={refreshInsights} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button 
              onClick={handleOptimizeDeployment}
              variant="outline"
              size="sm"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </div>

      {/* Epic Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Health</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(epicMetrics.overallHealth)}`}>
                  {epicMetrics.overallHealth.toFixed(1)}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={epicMetrics.overallHealth} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Velocity Trend</p>
                <p className="text-2xl font-bold text-blue-600">
                  {epicMetrics.velocityTrend > 0 ? '+' : ''}{epicMetrics.velocityTrend.toFixed(1)}%
                </p>
              </div>
              {epicMetrics.velocityTrend > 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />
              }
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Rocket className="h-3 w-3 mr-1" />
              <span>Sprint velocity improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quality Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(epicMetrics.qualityScore)}`}>
                  {epicMetrics.qualityScore.toFixed(1)}%
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Code quality & testing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Innovation Index</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(epicMetrics.innovationIndex)}`}>
                  {epicMetrics.innovationIndex.toFixed(1)}%
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Tech adoption & R&D</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="autonomous-recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="autonomous-recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="deployment-optimization">Deployment</TabsTrigger>
          <TabsTrigger value="resource-allocation">Resources</TabsTrigger>
          <TabsTrigger value="milestone-achievements">Milestones</TabsTrigger>
          <TabsTrigger value="performance-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        {/* Autonomous AI Recommendations */}
        <TabsContent value="autonomous-recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Autonomous AI Recommendations</span>
                <Badge variant="outline" className="ml-auto">
                  {recommendations.filter(r => r.status === 'new').length} New
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <Card key={rec.id} className="border-l-4 border-l-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">{rec.type}</Badge>
                            <Badge variant="secondary">
                              {rec.confidence}% confidence
                            </Badge>
                          </div>
                          
                          <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
                          <p className="text-muted-foreground mb-3">{rec.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Expected Impact</p>
                              <p className="text-sm text-muted-foreground">{rec.impact}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Expected Benefit</p>
                              <p className="text-sm text-muted-foreground">{rec.expectedBenefit}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Implementation Time</p>
                              <p className="text-sm text-muted-foreground">{rec.estimatedTime}</p>
                            </div>
                          </div>

                          <details className="mb-4">
                            <summary className="font-medium cursor-pointer mb-2">Implementation Steps</summary>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              {rec.implementationSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </details>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {rec.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {rec.status === 'new' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleRecommendationAction(rec.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRecommendationAction(rec.id, 'reject')}
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {rec.status === 'approved' && (
                            <Button 
                              size="sm"
                              onClick={() => handleRecommendationAction(rec.id, 'implement')}
                            >
                              <Rocket className="h-3 w-3 mr-1" />
                              Implement
                            </Button>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {rec.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Optimization */}
        <TabsContent value="deployment-optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {deploymentMetrics.successRate}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <Progress value={deploymentMetrics.successRate} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Deploy Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {deploymentMetrics.avgDeploymentTime}min
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {deploymentMetrics.avgDeploymentTime < 15 ? '🚀 Excellent' : '⚠️ Needs optimization'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rollback Rate</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {deploymentMetrics.rollbackRate}%
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {deploymentMetrics.rollbackRate < 5 ? '✅ Within target' : '❌ Above threshold'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Automation Level</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {deploymentMetrics.automationLevel}%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
                <Progress value={deploymentMetrics.automationLevel} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Deployment Optimization Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Performance Trends</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Deployment Frequency</p>
                        <p className="text-sm text-muted-foreground">15.2 deploys/day</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Lead Time</p>
                        <p className="text-sm text-muted-foreground">2.3 hours avg</p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Recovery Time</p>
                        <p className="text-sm text-muted-foreground">12 minutes avg</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Parallel Testing:</strong> Implement parallel test execution to reduce build time by 45%.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Canary Deployments:</strong> Gradual rollouts can reduce rollback rate from 2.1% to 0.8%.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Gates:</strong> Automated security scanning can prevent 90% of vulnerabilities.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resource Allocation */}
        <TabsContent value="resource-allocation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>CPU Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Allocated: {resourceAllocation.cpu.allocated} cores</span>
                    <span>Used: {resourceAllocation.cpu.used} cores</span>
                  </div>
                  <Progress value={resourceAllocation.cpu.efficiency} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Efficiency: {resourceAllocation.cpu.efficiency}%
                  </p>
                  {resourceAllocation.cpu.efficiency < 70 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        CPU utilization is below optimal. Consider rightsizing instances.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Memory Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Allocated: {resourceAllocation.memory.allocated} GB</span>
                    <span>Used: {resourceAllocation.memory.used} GB</span>
                  </div>
                  <Progress value={resourceAllocation.memory.efficiency} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Efficiency: {resourceAllocation.memory.efficiency}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>Network Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Allocated: {resourceAllocation.network.allocated} Mbps</span>
                    <span>Used: {resourceAllocation.network.used} Mbps</span>
                  </div>
                  <Progress value={resourceAllocation.network.efficiency} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Efficiency: {resourceAllocation.network.efficiency}%
                  </p>
                  {resourceAllocation.network.efficiency < 50 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Network utilization is very low. Consider reducing bandwidth allocation.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Cost Optimization Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Current Spend</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Budgeted</span>
                      <span className="font-mono">{formatCurrency(resourceAllocation.cost.budgeted)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Actual</span>
                      <span className="font-mono">{formatCurrency(resourceAllocation.cost.actual)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                      <span>Variance</span>
                      <span className="font-mono text-green-600">
                        {resourceAllocation.cost.variance > 0 ? '+' : ''}{resourceAllocation.cost.variance}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Optimization Recommendations</h4>
                  <div className="space-y-3">
                    <Alert>
                      <DollarSign className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Reserved Instances:</strong> Switch to reserved instances for 30% savings on compute costs.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Cpu className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Auto-Scaling:</strong> Implement intelligent auto-scaling to reduce idle resource costs by 40%.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Database className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Storage Optimization:</strong> Archive old data to reduce storage costs by 25%.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestone Achievements */}
        <TabsContent value="milestone-achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {milestones.filter(m => m.status === 'completed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {milestones.filter(m => m.status === 'in_progress').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {milestones.filter(m => m.status === 'at_risk').length}
                  </p>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {milestones.map(milestone => (
              <Card key={milestone.id} className={`border-l-4 ${getStatusColor(milestone.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant={milestone.status === 'completed' ? 'default' : 
                                 milestone.status === 'at_risk' ? 'destructive' : 'secondary'}
                        >
                          {milestone.status}
                        </Badge>
                        <Badge variant="outline">{milestone.category}</Badge>
                        <Badge variant={milestone.impact === 'high' ? 'destructive' : 
                                       milestone.impact === 'medium' ? 'default' : 'secondary'}>
                          {milestone.impact} impact
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-2">{milestone.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Progress</p>
                          <Progress value={milestone.progress} className="mt-1 h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{milestone.progress}% complete</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Target Date</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {milestone.targetDate}
                          </p>
                        </div>
                      </div>

                      {milestone.dependencies.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Dependencies</p>
                          <div className="flex flex-wrap gap-1">
                            {milestone.dependencies.map(dep => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.blockers.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1 text-red-600">Blockers</p>
                          <div className="space-y-1">
                            {milestone.blockers.map((blocker, idx) => (
                              <Alert key={idx} className="py-2">
                                <AlertTriangle className="h-3 w-3" />
                                <AlertDescription className="text-xs">{blocker}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">AI Recommendations</p>
                          <div className="space-y-1">
                            {milestone.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-start space-x-2 text-xs text-muted-foreground">
                                <Sparkles className="h-3 w-3 mt-0.5 text-primary" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      {milestone.status === 'completed' && milestone.actualDate && (
                        <Badge variant="outline" className="mb-2">
                          Completed {milestone.actualDate}
                        </Badge>
                      )}
                      <div className="text-right">
                        <p className="text-sm font-mono">#{milestone.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="performance-analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Efficiency</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {epicMetrics.teamEfficiency}%
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <Progress value={epicMetrics.teamEfficiency} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Predictability</p>
                    <p className="text-2xl font-bold text-green-600">
                      {epicMetrics.deliveryPredictability}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
                <Progress value={epicMetrics.deliveryPredictability} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {epicMetrics.customerSatisfaction}%
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
                <Progress value={epicMetrics.customerSatisfaction} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Technical Debt</p>
                    <p className="text-2xl font-bold text-red-600">
                      {epicMetrics.technicalDebt}%
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <Progress value={epicMetrics.technicalDebt} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {epicMetrics.technicalDebt < 30 ? 'Manageable' : 'Needs attention'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Advanced Performance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Sprint Analytics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Sprint Velocity</span>
                      <span className="font-mono">47 story points</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Burn Rate</span>
                      <span className="font-mono">3.2 pts/day</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Cycle Time</span>
                      <span className="font-mono">4.8 days avg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Defect Rate</span>
                      <span className="font-mono">2.1%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Quality Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Code Coverage</span>
                      <span className="font-mono">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Test Pass Rate</span>
                      <span className="font-mono">98.7%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Security Score</span>
                      <span className="font-mono">A+ Grade</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Performance Score</span>
                      <span className="font-mono">91/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Practices */}
        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>AI-Driven Best Practices & Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Security Best Practices</h4>
                  <div className="space-y-3">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>✅ Zero-Trust Architecture:</strong> Implemented with 96.2% security score
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>✅ Encryption at Rest:</strong> All data encrypted with AES-256
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>✅ Regular Security Audits:</strong> Monthly automated vulnerability scans
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">DevOps Best Practices</h4>
                  <div className="space-y-3">
                    <Alert>
                      <GitBranch className="h-4 w-4" />
                      <AlertDescription>
                        <strong>✅ GitOps Workflow:</strong> Infrastructure as Code with 89.7% automation
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Monitor className="h-4 w-4" />
                      <AlertDescription>
                        <strong>✅ Observability:</strong> Full stack monitoring with 99.9% uptime
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Gauge className="h-4 w-4" />
                      <AlertDescription>
                        <strong>⚠️ Performance Monitoring:</strong> Consider implementing distributed tracing
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Compliance & Governance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">SOC 2 Type II</p>
                      <p className="text-sm text-muted-foreground">Compliant</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">GDPR</p>
                      <p className="text-sm text-muted-foreground">Compliant</p>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-medium">HIPAA</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>AI-Generated Improvement Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Machine Learning Optimization:</strong> Implement predictive analytics for capacity planning to reduce costs by 25% and improve performance by 40%.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Rocket className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Deployment Automation:</strong> Enhance CI/CD pipeline with AI-powered testing strategies to achieve 99.5% deployment success rate.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quality Assurance:</strong> Integrate AI-driven code review and automated refactoring to reduce technical debt by 60%.
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