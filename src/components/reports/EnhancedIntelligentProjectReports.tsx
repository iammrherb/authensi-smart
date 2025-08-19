import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart3, TrendingUp, PieChart, Calendar, Download, FileText, 
  Brain, Zap, Target, AlertTriangle, CheckCircle, Clock, Users,
  Network, Shield, Database, Eye, Filter, Search, RefreshCw,
  ChevronDown, ChevronRight, Star, Bookmark, Share2, Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';

interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageCompletionTime: number;
  resourceUtilization: number;
  budgetEfficiency: number;
  customerSatisfaction: number;
  complianceScore: number;
  riskScore: number;
  aiOptimizationScore: number;
  securityPosture: number;
  deploymentSuccess: number;
}

interface TrendData {
  month: string;
  projects: number;
  budget: number;
  satisfaction: number;
  compliance: number;
  efficiency: number;
}

interface RiskAssessment {
  id: string;
  project: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  impact: number;
  probability: number;
  mitigation: string;
  status: 'open' | 'mitigated' | 'accepted';
}

interface ComplianceFramework {
  name: string;
  score: number;
  requirements: number;
  satisfied: number;
  gaps: number;
  trends: Array<{ month: string; score: number }>;
}

interface EnhancedIntelligentProjectReportsProps {
  projectId?: string;
  timeRange?: string;
}

const EnhancedIntelligentProjectReports: React.FC<EnhancedIntelligentProjectReportsProps> = ({
  projectId,
  timeRange = '30d'
}) => {
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    totalProjects: 47,
    activeProjects: 12,
    completedProjects: 35,
    averageCompletionTime: 3.8,
    resourceUtilization: 92,
    budgetEfficiency: 88,
    customerSatisfaction: 94,
    complianceScore: 96,
    riskScore: 85,
    aiOptimizationScore: 91,
    securityPosture: 93,
    deploymentSuccess: 97
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const trendData: TrendData[] = [
    { month: 'Jan', projects: 8, budget: 85, satisfaction: 92, compliance: 94, efficiency: 88 },
    { month: 'Feb', projects: 12, budget: 88, satisfaction: 94, compliance: 96, efficiency: 90 },
    { month: 'Mar', projects: 15, budget: 92, satisfaction: 96, compliance: 98, efficiency: 92 },
    { month: 'Apr', projects: 18, budget: 89, satisfaction: 93, compliance: 95, efficiency: 89 },
    { month: 'May', projects: 22, budget: 91, satisfaction: 95, compliance: 97, efficiency: 91 },
    { month: 'Jun', projects: 25, budget: 94, satisfaction: 97, compliance: 99, efficiency: 94 }
  ];

  const riskAssessments: RiskAssessment[] = [
    {
      id: '1',
      project: 'Enterprise NAC Deployment',
      riskLevel: 'medium',
      category: 'Technical',
      impact: 7,
      probability: 4,
      mitigation: 'Implement redundant authentication servers',
      status: 'open'
    },
    {
      id: '2',
      project: 'Healthcare Compliance Project',
      riskLevel: 'high',
      category: 'Compliance',
      impact: 9,
      probability: 6,
      mitigation: 'Enhanced audit trail and encryption',
      status: 'mitigated'
    },
    {
      id: '3',
      project: 'Financial Services Security',
      riskLevel: 'low',
      category: 'Operational',
      impact: 3,
      probability: 2,
      mitigation: 'Regular training and documentation updates',
      status: 'accepted'
    }
  ];

  const complianceFrameworks: ComplianceFramework[] = [
    {
      name: 'SOX',
      score: 98,
      requirements: 24,
      satisfied: 23,
      gaps: 1,
      trends: [
        { month: 'Jan', score: 94 },
        { month: 'Feb', score: 96 },
        { month: 'Mar', score: 97 },
        { month: 'Apr', score: 98 },
        { month: 'May', score: 98 },
        { month: 'Jun', score: 98 }
      ]
    },
    {
      name: 'HIPAA',
      score: 96,
      requirements: 18,
      satisfied: 17,
      gaps: 1,
      trends: [
        { month: 'Jan', score: 92 },
        { month: 'Feb', score: 94 },
        { month: 'Mar', score: 95 },
        { month: 'Apr', score: 96 },
        { month: 'May', score: 96 },
        { month: 'Jun', score: 96 }
      ]
    },
    {
      name: 'PCI DSS',
      score: 94,
      requirements: 12,
      satisfied: 11,
      gaps: 1,
      trends: [
        { month: 'Jan', score: 90 },
        { month: 'Feb', score: 92 },
        { month: 'Mar', score: 93 },
        { month: 'Apr', score: 94 },
        { month: 'May', score: 94 },
        { month: 'Jun', score: 94 }
      ]
    }
  ];

  const pieChartData = [
    { name: 'Completed', value: metrics.completedProjects, color: 'hsl(var(--chart-1))' },
    { name: 'Active', value: metrics.activeProjects, color: 'hsl(var(--chart-2))' },
    { name: 'Planning', value: 8, color: 'hsl(var(--chart-3))' }
  ];

  const generateAdvancedReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'hsl(var(--chart-1))';
      case 'medium': return 'hsl(var(--chart-3))';
      case 'high': return 'hsl(var(--chart-4))';
      case 'critical': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="space-y-2">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎯 Enhanced Project Intelligence
          </motion.h1>
          <p className="text-lg text-muted-foreground">
            AI-powered insights, predictive analytics, and comprehensive reporting
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={generateAdvancedReport}
            disabled={isGeneratingReport}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isGeneratingReport ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          { title: 'Total Projects', value: metrics.totalProjects, icon: Target, trend: '+12%', color: 'chart-1' },
          { title: 'Active Projects', value: metrics.activeProjects, icon: Zap, trend: '+8%', color: 'chart-2' },
          { title: 'Success Rate', value: `${metrics.deploymentSuccess}%`, icon: CheckCircle, trend: '+3%', color: 'chart-1' },
          { title: 'Avg Completion', value: `${metrics.averageCompletionTime}w`, icon: Clock, trend: '-0.4w', color: 'chart-3' },
          { title: 'Customer Satisfaction', value: `${metrics.customerSatisfaction}%`, icon: Star, trend: '+2%', color: 'chart-1' },
          { title: 'AI Optimization', value: `${metrics.aiOptimizationScore}%`, icon: Brain, trend: '+5%', color: 'chart-2' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-${metric.color}/20 to-${metric.color}/10`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Forecasting
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Project Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                    <Line type="monotone" dataKey="compliance" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                    <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--chart-3))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{risk.project}</h4>
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: getRiskColor(risk.riskLevel) }}
                      >
                        {risk.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{risk.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Impact</p>
                        <p className="font-medium">{risk.impact}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Probability</p>
                        <p className="font-medium">{risk.probability}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant={risk.status === 'mitigated' ? 'default' : 'secondary'}>
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Mitigation Strategy</p>
                      <p className="text-sm">{risk.mitigation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <motion.div
                key={framework.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {framework.name}
                      <Badge variant="secondary">{framework.score}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Compliance Score</span>
                        <span>{framework.score}%</span>
                      </div>
                      <Progress value={framework.score} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Requirements</p>
                        <p className="font-semibold">{framework.requirements}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfied</p>
                        <p className="font-semibold text-green-600">{framework.satisfied}</p>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={framework.trends}>
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Optimize Resource Allocation",
                    description: "AI suggests reallocating 15% of resources from Project Alpha to Project Beta for better efficiency.",
                    impact: "High",
                    confidence: 92
                  },
                  {
                    title: "Predictive Maintenance",
                    description: "Network infrastructure in Building C may require attention in the next 30 days.",
                    impact: "Medium",
                    confidence: 87
                  },
                  {
                    title: "Compliance Enhancement",
                    description: "Implementing automated compliance checks could improve SOX score by 3%.",
                    impact: "Medium",
                    confidence: 95
                  }
                ].map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{recommendation.title}</h4>
                      <Badge variant="secondary">{recommendation.confidence}% confident</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    <Badge variant={recommendation.impact === 'High' ? 'default' : 'secondary'}>
                      {recommendation.impact} Impact
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="hsl(var(--chart-1))" 
                      fill="hsl(var(--chart-1))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Predictive Analytics & Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Next Quarter Predictions</h4>
                  {[
                    { metric: "Project Completion Rate", current: "94%", predicted: "97%", trend: "up" },
                    { metric: "Resource Utilization", current: "92%", predicted: "89%", trend: "down" },
                    { metric: "Customer Satisfaction", current: "94%", predicted: "96%", trend: "up" },
                    { metric: "Budget Variance", current: "+3%", predicted: "-1%", trend: "down" }
                  ].map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{prediction.metric}</p>
                        <p className="text-sm text-muted-foreground">Current: {prediction.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{prediction.predicted}</p>
                        <Badge variant={prediction.trend === 'up' ? 'default' : 'secondary'}>
                          {prediction.trend === 'up' ? '↗' : '↘'} Predicted
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="projects" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default EnhancedIntelligentProjectReports;