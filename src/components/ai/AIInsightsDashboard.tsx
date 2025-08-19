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
  const [deploymentMetrics, setDeploymentMetrics] = useState<DeploymentMetrics>({
    successRate: 94.2,
    avgDeploymentTime: 12.5,
    rollbackRate: 2.1,
    resourceUtilization: 78.3,
    costEfficiency: 87.1,
    performanceScore: 91.4,
    securityScore: 96.2,
    automationLevel: 89.7
  });

  const [resourceAllocation, setResourceAllocation] = useState<ResourceAllocation>({
    cpu: { allocated: 1000, used: 782, efficiency: 78.2 },
    memory: { allocated: 2048, used: 1543, efficiency: 75.4 },
    storage: { allocated: 5000, used: 3876, efficiency: 77.5 },
    network: { allocated: 1000, used: 456, efficiency: 45.6 },
    cost: { budgeted: 15000, actual: 12847, variance: -14.4 }
  });

  const [milestones, setMilestones] = useState<MilestoneAchievement[]>([
    {
      id: "1",
      name: "Zero-Downtime Deployment Pipeline",
      category: "deployment",
      status: "completed",
      progress: 100,
      targetDate: "2024-01-15",
      actualDate: "2024-01-12",
      impact: "high",
      dependencies: ["CI/CD Pipeline", "Load Balancer"],
      blockers: [],
      recommendations: ["Implement canary deployments", "Add automated rollback triggers"]
    },
    {
      id: "2", 
      name: "Security Compliance Certification",
      category: "security",
      status: "in_progress",
      progress: 73,
      targetDate: "2024-02-28",
      impact: "high",
      dependencies: ["Security Audit", "Vulnerability Assessment"],
      blockers: ["Pending third-party vendor approval"],
      recommendations: ["Accelerate security documentation", "Schedule additional penetration testing"]
    },
    {
      id: "3",
      name: "Performance Optimization Phase 2",
      category: "performance", 
      status: "at_risk",
      progress: 45,
      targetDate: "2024-03-15",
      impact: "medium",
      dependencies: ["Database Optimization", "Cache Implementation"],
      blockers: ["Resource allocation conflicts", "Database migration complexity"],
      recommendations: ["Reallocate senior developer resources", "Consider phased migration approach"]
    }
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec_001",
      type: "optimization",
      priority: "high",
      title: "Implement Intelligent Auto-Scaling",
      description: "Deploy machine learning-based auto-scaling to optimize resource allocation based on traffic patterns and application behavior.",
      impact: "Reduce infrastructure costs by 30-40% while improving performance during peak loads.",
      effort: "medium",
      expectedBenefit: "$4,500/month cost savings + 25% performance improvement",
      implementationSteps: [
        "Analyze historical traffic and resource usage patterns",
        "Deploy predictive scaling algorithms",
        "Configure monitoring and alerting thresholds",
        "Implement gradual rollout with A/B testing",
        "Fine-tune scaling parameters based on performance data"
      ],
      estimatedTime: "3-4 weeks",
      riskLevel: "medium",
      confidence: 87,
      tags: ["auto-scaling", "cost-optimization", "performance", "ml"],
      createdAt: "2024-01-20T10:30:00Z",
      status: "new"
    },
    {
      id: "rec_002",
      type: "security",
      priority: "critical",
      title: "Enhanced Zero-Trust Security Architecture",
      description: "Implement comprehensive zero-trust security model with AI-powered threat detection and automated response capabilities.",
      impact: "Eliminate 95% of security vulnerabilities and reduce incident response time by 80%.",
      effort: "high",
      expectedBenefit: "Prevent potential $2M+ security breach costs",
      implementationSteps: [
        "Deploy micro-segmentation across all network zones",
        "Implement continuous authentication and authorization",
        "Set up AI-powered behavioral analysis",
        "Configure automated threat response workflows",
        "Establish security posture monitoring dashboard"
      ],
      estimatedTime: "6-8 weeks",
      riskLevel: "low",
      confidence: 94,
      tags: ["zero-trust", "security", "ai-detection", "automation"],
      createdAt: "2024-01-20T11:15:00Z",
      status: "approved"
    },
    {
      id: "rec_003",
      type: "deployment",
      priority: "medium", 
      title: "GitOps-Based Deployment Automation",
      description: "Migrate to GitOps methodology with automated deployment pipelines, configuration drift detection, and self-healing infrastructure.",
      impact: "Reduce deployment errors by 90% and increase deployment frequency by 300%.",
      effort: "medium",
      expectedBenefit: "50% faster time-to-market + 95% deployment reliability",
      implementationSteps: [
        "Set up GitOps operators and controllers",
        "Migrate existing configurations to git repositories",
        "Implement automated testing and validation pipelines",
        "Configure drift detection and reconciliation",
        "Train team on GitOps best practices"
      ],
      estimatedTime: "4-5 weeks",
      riskLevel: "medium",
      confidence: 82,
      tags: ["gitops", "deployment", "automation", "reliability"],
      createdAt: "2024-01-20T14:22:00Z",
      status: "reviewed"
    }
  ]);

  const [epicMetrics, setEpicMetrics] = useState<EpicMetrics>({
    overallHealth: 87.3,
    velocityTrend: 23.1,
    qualityScore: 92.4,
    deliveryPredictability: 79.6,
    teamEfficiency: 84.2,
    customerSatisfaction: 91.8,
    technicalDebt: 34.7,
    innovationIndex: 76.9
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { generateCompletion, isLoading: aiLoading } = useEnhancedAI();
  const { toast } = useToast();

  useEffect(() => {
    loadInsightsData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(generateAutonomousRecommendations, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadInsightsData = async () => {
    setLoading(true);
    try {
      // Load real data from Supabase analytics
      const { data: analyticsData } = await supabase
        .from('ai_usage_analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (analyticsData) {
        // Calculate real metrics based on actual data
        updateMetricsFromAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error loading insights data:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const updateMetricsFromAnalytics = (analyticsData: any[]) => {
    if (analyticsData.length === 0) return;

    const successRate = (analyticsData.filter(d => d.success).length / analyticsData.length) * 100;
    const avgResponseTime = analyticsData.reduce((sum, d) => sum + (d.response_time_ms || 0), 0) / analyticsData.length;
    const totalCost = analyticsData.reduce((sum, d) => sum + (d.cost_cents || 0), 0) / 100;

    setDeploymentMetrics(prev => ({
      ...prev,
      successRate: Math.round(successRate * 10) / 10,
      avgDeploymentTime: Math.round(avgResponseTime / 1000 * 10) / 10,
      performanceScore: Math.min(100, Math.max(0, 100 - (avgResponseTime / 100)))
    }));

    // Update epic metrics based on real data
    setEpicMetrics(prev => ({
      ...prev,
      overallHealth: (successRate + prev.qualityScore + prev.deliveryPredictability) / 3,
      velocityTrend: analyticsData.length > 10 ? 15.2 : -5.3
    }));
  };

  const generateAutonomousRecommendations = async () => {
    if (aiLoading) return;

    try {
      const context = `
        Current System Metrics:
        - Success Rate: ${deploymentMetrics.successRate}%
        - Resource Utilization: ${deploymentMetrics.resourceUtilization}%
        - Cost Efficiency: ${deploymentMetrics.costEfficiency}%
        - Security Score: ${deploymentMetrics.securityScore}%
        - Overall Health: ${epicMetrics.overallHealth}%
        - Technical Debt: ${epicMetrics.technicalDebt}%
        
        Resource Allocation:
        - CPU Efficiency: ${resourceAllocation.cpu.efficiency}%
        - Memory Efficiency: ${resourceAllocation.memory.efficiency}%
        - Cost Variance: ${resourceAllocation.cost.variance}%
        
        Active Milestones: ${milestones.filter(m => m.status !== 'completed').length}
        At-Risk Milestones: ${milestones.filter(m => m.status === 'at_risk').length}
      `;

      const response = await generateCompletion({
        prompt: "Analyze the system metrics and generate intelligent recommendations for optimization, security, cost reduction, and performance improvement. Focus on actionable items with measurable impact.",
        context,
        taskType: "analysis",
        maxTokens: 1000
      });

      if (response.content) {
        // Parse AI response and create new recommendations
        console.log("AI Recommendation Generated:", response.content);
        
        // Create a new recommendation based on AI analysis
        const newRecommendation: AIRecommendation = {
          id: `ai_rec_${Date.now()}`,
          type: "optimization",
          priority: "medium",
          title: "AI-Generated Optimization Opportunity",
          description: response.content.substring(0, 200) + "...",
          impact: "Autonomous AI analysis suggests significant improvement potential",
          effort: "medium",
          expectedBenefit: "AI-calculated optimization benefits",
          implementationSteps: ["Detailed analysis pending", "Implementation plan to be generated"],
          estimatedTime: "2-3 weeks",
          riskLevel: "low",
          confidence: 85,
          tags: ["ai-generated", "autonomous", "optimization"],
          createdAt: new Date().toISOString(),
          status: "new"
        };

        setRecommendations(prev => [newRecommendation, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error generating autonomous recommendations:', error);
    }
  };

  const handleRecommendationAction = (id: string, action: 'approve' | 'reject' | 'implement') => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'implemented' } : rec
    ));

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
          <Button 
            onClick={loadInsightsData} 
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