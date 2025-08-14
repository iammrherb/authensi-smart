import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Clock,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Zap,
  Brain
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageCompletionTime: number;
  resourceUtilization: number;
  budgetVariance: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface PhaseProgress {
  phase: string;
  planned: number;
  actual: number;
  status: 'on-track' | 'delayed' | 'completed';
}

interface RecommendationAnalytics {
  type: string;
  totalRecommendations: number;
  implementedRecommendations: number;
  successRate: number;
  timeToImplementation: number;
}

interface ComplianceMetrics {
  framework: string;
  score: number;
  requirements: number;
  satisfied: number;
  gaps: number;
}

interface IntelligentProjectReportsProps {
  projectId?: string;
  timeRange?: string;
}

const IntelligentProjectReports: React.FC<IntelligentProjectReportsProps> = ({
  projectId,
  timeRange = '30d'
}) => {
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    totalProjects: 24,
    activeProjects: 8,
    completedProjects: 16,
    averageCompletionTime: 4.2,
    resourceUtilization: 87,
    budgetVariance: -5.2,
    complianceScore: 94,
    riskLevel: 'low'
  });

  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress[]>([
    { phase: 'Planning & Scoping', planned: 2, actual: 1.8, status: 'on-track' },
    { phase: 'Configuration', planned: 3, actual: 3.2, status: 'delayed' },
    { phase: 'Testing', planned: 2, actual: 1.9, status: 'on-track' },
    { phase: 'Deployment', planned: 1, actual: 0.8, status: 'completed' },
    { phase: 'Go-Live', planned: 0.5, actual: 0.6, status: 'delayed' }
  ]);

  const [recommendationAnalytics, setRecommendationAnalytics] = useState<RecommendationAnalytics[]>([
    { type: 'Use Cases', totalRecommendations: 45, implementedRecommendations: 38, successRate: 84, timeToImplementation: 2.3 },
    { type: 'Vendors', totalRecommendations: 23, implementedRecommendations: 21, successRate: 91, timeToImplementation: 1.8 },
    { type: 'Requirements', totalRecommendations: 67, implementedRecommendations: 59, successRate: 88, timeToImplementation: 3.1 },
    { type: 'Auth Methods', totalRecommendations: 12, implementedRecommendations: 11, successRate: 92, timeToImplementation: 1.5 }
  ]);

  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics[]>([
    { framework: 'SOX', score: 96, requirements: 45, satisfied: 43, gaps: 2 },
    { framework: 'HIPAA', score: 92, requirements: 52, satisfied: 48, gaps: 4 },
    { framework: 'PCI-DSS', score: 88, requirements: 38, satisfied: 33, gaps: 5 },
    { framework: 'ISO 27001', score: 94, requirements: 78, satisfied: 73, gaps: 5 }
  ]);

  const [trendData, setTrendData] = useState([
    { month: 'Jan', projects: 4, completion: 85, budget: 92 },
    { month: 'Feb', projects: 6, completion: 88, budget: 89 },
    { month: 'Mar', projects: 8, completion: 91, budget: 94 },
    { month: 'Apr', projects: 10, completion: 87, budget: 88 },
    { month: 'May', projects: 12, completion: 93, budget: 96 },
    { month: 'Jun', projects: 14, completion: 89, budget: 91 }
  ]);

  const generateExecutiveReport = () => {
    const report = {
      summary: {
        totalProjects: metrics.totalProjects,
        successRate: (metrics.completedProjects / metrics.totalProjects) * 100,
        averageTimeToCompletion: metrics.averageCompletionTime,
        budgetPerformance: metrics.budgetVariance
      },
      keyMetrics: metrics,
      recommendations: recommendationAnalytics,
      compliance: complianceMetrics,
      riskAssessment: {
        level: metrics.riskLevel,
        factors: [
          'Budget variance within acceptable range',
          'High compliance scores across frameworks',
          'Strong recommendation implementation rate'
        ]
      }
    };

    // In real implementation, this would generate and download a PDF
    console.log('Executive Report Generated:', report);
  };

  const renderMetricCard = (title: string, value: string | number, icon: React.ElementType, trend?: string, color?: string) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {trend} from last period
              </p>
            )}
          </div>
          {React.createElement(icon, { 
            className: `h-8 w-8 ${color || 'text-muted-foreground'}` 
          })}
        </div>
      </CardContent>
    </Card>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligent Project Reports</h1>
          <p className="text-muted-foreground">
            AI-powered insights and comprehensive project analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateExecutiveReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          "Active Projects", 
          metrics.activeProjects, 
          Target, 
          "+12%", 
          "text-blue-600"
        )}
        {renderMetricCard(
          "Avg. Completion Time", 
          `${metrics.averageCompletionTime} weeks`, 
          Clock, 
          "-8%", 
          "text-green-600"
        )}
        {renderMetricCard(
          "Resource Utilization", 
          `${metrics.resourceUtilization}%`, 
          Users, 
          "+5%", 
          "text-purple-600"
        )}
        {renderMetricCard(
          "Compliance Score", 
          `${metrics.complianceScore}%`, 
          CheckCircle, 
          "+2%", 
          "text-green-600"
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="phases">Phase Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart 
                      data={[
                        { name: 'Completed', value: metrics.completedProjects },
                        { name: 'Active', value: metrics.activeProjects },
                        { name: 'Planning', value: 3 }
                      ]}
                    />
                    {[
                      { name: 'Completed', value: metrics.completedProjects },
                      { name: 'Active', value: metrics.activeProjects },
                      { name: 'Planning', value: 3 }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Budget Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Budget Variance</span>
                    <Badge variant={metrics.budgetVariance > 0 ? "destructive" : "default"}>
                      {metrics.budgetVariance > 0 ? '+' : ''}{metrics.budgetVariance}%
                    </Badge>
                  </div>
                  <Progress 
                    value={100 + metrics.budgetVariance} 
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Budget</p>
                      <p className="font-semibold">$2.4M</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-semibold">$2.28M</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Insights & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Insights</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Optimization Opportunity</p>
                        <p className="text-sm text-muted-foreground">
                          Projects using AI recommendations complete 23% faster on average
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Success Pattern</p>
                        <p className="text-sm text-muted-foreground">
                          Healthcare projects show 95% compliance success rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Risk Alert</p>
                        <p className="text-sm text-muted-foreground">
                          Configuration phase shows 15% higher delay risk in Q2
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Predictive Analytics</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Project Success Probability</span>
                        <Badge variant="default">92%</Badge>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">On-Time Completion</span>
                        <Badge variant="secondary">87%</Badge>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Budget Adherence</span>
                        <Badge variant="default">95%</Badge>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Resource Optimization Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Team Allocation</h5>
                    <p className="text-sm text-muted-foreground">
                      Redistribute 2 engineers from Project Alpha to Project Beta for optimal efficiency
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Timeline Optimization</h5>
                    <p className="text-sm text-muted-foreground">
                      Parallel execution of testing phases could reduce timeline by 1.2 weeks
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Risk Mitigation</h5>
                    <p className="text-sm text-muted-foreground">
                      Early vendor engagement in Project Gamma will reduce integration risks
                    </p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Phase Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={phaseProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#8884d8" name="Planned (weeks)" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual (weeks)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phaseProgress.map((phase, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{phase.phase}</h4>
                    <Badge variant={
                      phase.status === 'completed' ? 'default' :
                      phase.status === 'on-track' ? 'secondary' : 'destructive'
                    }>
                      {phase.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Planned:</span>
                      <span>{phase.planned} weeks</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Actual:</span>
                      <span>{phase.actual} weeks</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Variance:</span>
                      <span className={phase.actual > phase.planned ? 'text-red-600' : 'text-green-600'}>
                        {phase.actual > phase.planned ? '+' : ''}{((phase.actual - phase.planned) / phase.planned * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI Recommendation Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Implementation Success Rates</h4>
                  <div className="space-y-4">
                    {recommendationAnalytics.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.type}</span>
                          <Badge variant="secondary">{item.successRate}%</Badge>
                        </div>
                        <Progress value={item.successRate} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.implementedRecommendations}/{item.totalRecommendations} implemented</span>
                          <span>Avg: {item.timeToImplementation} weeks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Recommendation Impact</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={recommendationAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Compliance Framework Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {complianceMetrics.map((framework, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{framework.framework}</h4>
                        <Badge variant={framework.score >= 95 ? 'default' : framework.score >= 85 ? 'secondary' : 'destructive'}>
                          {framework.score}%
                        </Badge>
                      </div>
                      <Progress value={framework.score} className="mb-3 h-2" />
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-semibold">{framework.requirements}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Satisfied</p>
                          <p className="font-semibold text-green-600">{framework.satisfied}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Gaps</p>
                          <p className="font-semibold text-red-600">{framework.gaps}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Compliance Trends</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="completion" stroke="#8884d8" name="Completion %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="projects" stroke="#8884d8" name="Active Projects" />
                  <Line type="monotone" dataKey="completion" stroke="#82ca9d" name="Completion Rate %" />
                  <Line type="monotone" dataKey="budget" stroke="#ffc658" name="Budget Performance %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentProjectReports;