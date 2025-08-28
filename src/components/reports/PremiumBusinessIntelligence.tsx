import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, TrendingDown, Users, Building, DollarSign, 
  Shield, Target, Award, BarChart3, PieChart, LineChart,
  FileText, Download, Share2, Calendar, Clock, Globe,
  Briefcase, CheckCircle, AlertTriangle, Info, Zap,
  ArrowUp, ArrowDown, Minus, Star, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart as RechartsLineChart, Line,
  PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BusinessIntelligenceProps {
  projectId?: string;
  customerId?: string;
}

interface ExecutiveSummary {
  company: string;
  industry: string;
  size: string;
  currentState: {
    maturityScore: number;
    riskScore: number;
    complianceScore: number;
    operationalEfficiency: number;
  };
  recommendations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    impact: string;
    effort: string;
    roi: string;
  }[];
  marketPosition: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface KPIMetric {
  name: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  target: number | string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

const PremiumBusinessIntelligence: React.FC<BusinessIntelligenceProps> = ({ 
  projectId, 
  customerId 
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const { toast } = useToast();

  // Sample data for charts
  const maturityTrendData = [
    { month: 'Jan', current: 2.5, target: 4.0, industry: 3.2 },
    { month: 'Feb', current: 2.7, target: 4.0, industry: 3.2 },
    { month: 'Mar', current: 3.0, target: 4.0, industry: 3.3 },
    { month: 'Apr', current: 3.2, target: 4.0, industry: 3.3 },
    { month: 'May', current: 3.5, target: 4.0, industry: 3.4 },
    { month: 'Jun', current: 3.8, target: 4.0, industry: 3.4 }
  ];

  const vendorDistributionData = [
    { name: 'Cisco', value: 45, color: '#0EA5E9' },
    { name: 'Aruba', value: 25, color: '#8B5CF6' },
    { name: 'Fortinet', value: 20, color: '#EF4444' },
    { name: 'Others', value: 10, color: '#6B7280' }
  ];

  const complianceRadarData = [
    { framework: 'NIST', score: 85, fullMark: 100 },
    { framework: 'ISO 27001', score: 78, fullMark: 100 },
    { framework: 'PCI DSS', score: 92, fullMark: 100 },
    { framework: 'HIPAA', score: 88, fullMark: 100 },
    { framework: 'SOC 2', score: 75, fullMark: 100 },
    { framework: 'GDPR', score: 82, fullMark: 100 }
  ];

  const riskHeatmapData = [
    { category: 'Network Security', likelihood: 3, impact: 4, score: 12 },
    { category: 'Access Control', likelihood: 2, impact: 5, score: 10 },
    { category: 'Data Protection', likelihood: 3, impact: 5, score: 15 },
    { category: 'Compliance', likelihood: 2, impact: 4, score: 8 },
    { category: 'Operational', likelihood: 4, impact: 3, score: 12 },
    { category: 'Third Party', likelihood: 3, impact: 3, score: 9 }
  ];

  const deploymentTimelineData = [
    { phase: 'Discovery', start: 0, duration: 2, status: 'completed' },
    { phase: 'Planning', start: 2, duration: 3, status: 'completed' },
    { phase: 'Implementation', start: 5, duration: 8, status: 'in-progress' },
    { phase: 'Testing', start: 13, duration: 3, status: 'upcoming' },
    { phase: 'Deployment', start: 16, duration: 4, status: 'upcoming' },
    { phase: 'Optimization', start: 20, duration: 4, status: 'upcoming' }
  ];

  useEffect(() => {
    loadBusinessIntelligence();
    loadKPIMetrics();
  }, [timeRange, selectedVendor]);

  const loadBusinessIntelligence = async () => {
    // Load executive summary data
    const summary: ExecutiveSummary = {
      company: 'Acme Corporation',
      industry: 'Financial Services',
      size: 'Enterprise (10,000+ employees)',
      currentState: {
        maturityScore: 3.8,
        riskScore: 6.5,
        complianceScore: 85,
        operationalEfficiency: 72
      },
      recommendations: [
        {
          priority: 'critical',
          title: 'Implement Zero Trust Architecture',
          impact: 'High - Reduces risk by 40%',
          effort: 'Medium - 6 month implementation',
          roi: '250% over 2 years'
        },
        {
          priority: 'high',
          title: 'Upgrade NAC Solution to Cloud-Native',
          impact: 'High - Improves scalability by 60%',
          effort: 'Low - 3 month migration',
          roi: '180% over 18 months'
        },
        {
          priority: 'medium',
          title: 'Enhance IoT Device Management',
          impact: 'Medium - Secures 5,000+ devices',
          effort: 'Low - 2 month deployment',
          roi: '150% over 1 year'
        }
      ],
      marketPosition: {
        strengths: [
          'Strong security posture',
          'Mature IT infrastructure',
          'Skilled technical team',
          'Executive buy-in for security'
        ],
        weaknesses: [
          'Legacy systems integration',
          'Complex network topology',
          'Limited automation',
          'Manual compliance processes'
        ],
        opportunities: [
          'Cloud transformation initiative',
          'AI-powered threat detection',
          'Automated compliance reporting',
          'Enhanced user experience'
        ],
        threats: [
          'Increasing cyber threats',
          'Regulatory changes',
          'Vendor consolidation',
          'Skills gap in emerging tech'
        ]
      }
    };
    
    setExecutiveSummary(summary);
  };

  const loadKPIMetrics = async () => {
    const metrics: KPIMetric[] = [
      {
        name: 'Security Posture Score',
        value: 85,
        trend: 'up',
        change: 12,
        target: 90,
        status: 'on-track'
      },
      {
        name: 'Mean Time to Detect (MTTD)',
        value: '2.5 min',
        trend: 'down',
        change: -35,
        target: '< 5 min',
        status: 'on-track'
      },
      {
        name: 'Mean Time to Respond (MTTR)',
        value: '8 min',
        trend: 'down',
        change: -25,
        target: '< 10 min',
        status: 'on-track'
      },
      {
        name: 'Compliance Coverage',
        value: '92%',
        trend: 'up',
        change: 8,
        target: '95%',
        status: 'at-risk'
      },
      {
        name: 'Device Visibility',
        value: '98%',
        trend: 'stable',
        change: 0,
        target: '100%',
        status: 'on-track'
      },
      {
        name: 'Policy Violations',
        value: 145,
        trend: 'down',
        change: -22,
        target: '< 100',
        status: 'at-risk'
      },
      {
        name: 'User Satisfaction',
        value: 4.2,
        trend: 'up',
        change: 5,
        target: 4.5,
        status: 'on-track'
      },
      {
        name: 'ROI Achievement',
        value: '178%',
        trend: 'up',
        change: 28,
        target: '150%',
        status: 'on-track'
      }
    ];
    
    setKpiMetrics(metrics);
  };

  const generateExecutiveReport = async () => {
    setIsGenerating(true);
    
    try {
      // Generate comprehensive executive report
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation
      
      toast({
        title: "Report Generated",
        description: "Executive report has been generated and is ready for download",
      });
      
      // Trigger download
      downloadReport('executive');
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate executive report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (type: string) => {
    // Generate and download report
    const reportContent = generateReportContent(type);
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
  };

  const generateReportContent = (type: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Executive Business Intelligence Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
    .header { border-bottom: 3px solid #0EA5E9; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #0EA5E9; margin: 0; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin: 30px 0; }
    .section h2 { color: #1F2937; border-left: 4px solid #0EA5E9; padding-left: 10px; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-value { font-size: 24px; font-weight: bold; color: #0EA5E9; }
    .metric-label { font-size: 12px; color: #666; }
    .recommendation { background: #F3F4F6; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .priority-critical { border-left: 4px solid #EF4444; }
    .priority-high { border-left: 4px solid #F59E0B; }
    .priority-medium { border-left: 4px solid #3B82F6; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB; }
    th { background: #F9FAFB; font-weight: 600; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Executive Business Intelligence Report</h1>
    <p>${executiveSummary?.company} | ${executiveSummary?.industry}</p>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <p>This report provides a comprehensive analysis of your NAC implementation, security posture, and strategic recommendations for ${executiveSummary?.company}.</p>
    
    <div style="margin: 20px 0;">
      <div class="metric">
        <div class="metric-value">${executiveSummary?.currentState.maturityScore}/5</div>
        <div class="metric-label">Maturity Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${executiveSummary?.currentState.complianceScore}%</div>
        <div class="metric-label">Compliance Score</div>
      </div>
      <div class="metric">
        <div class="metric-value">${executiveSummary?.currentState.operationalEfficiency}%</div>
        <div class="metric-label">Operational Efficiency</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Key Performance Indicators</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Current Value</th>
          <th>Target</th>
          <th>Trend</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${kpiMetrics.map(metric => `
          <tr>
            <td>${metric.name}</td>
            <td>${metric.value}</td>
            <td>${metric.target}</td>
            <td>${metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} ${Math.abs(metric.change)}%</td>
            <td>${metric.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>Strategic Recommendations</h2>
    ${executiveSummary?.recommendations.map(rec => `
      <div class="recommendation priority-${rec.priority}">
        <h3>${rec.title}</h3>
        <p><strong>Impact:</strong> ${rec.impact}</p>
        <p><strong>Effort:</strong> ${rec.effort}</p>
        <p><strong>ROI:</strong> ${rec.roi}</p>
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>SWOT Analysis</h2>
    <table>
      <tr>
        <td style="width: 50%; vertical-align: top; padding: 10px;">
          <h3>Strengths</h3>
          <ul>
            ${executiveSummary?.marketPosition.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </td>
        <td style="width: 50%; vertical-align: top; padding: 10px;">
          <h3>Weaknesses</h3>
          <ul>
            ${executiveSummary?.marketPosition.weaknesses.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </td>
      </tr>
      <tr>
        <td style="width: 50%; vertical-align: top; padding: 10px;">
          <h3>Opportunities</h3>
          <ul>
            ${executiveSummary?.marketPosition.opportunities.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </td>
        <td style="width: 50%; vertical-align: top; padding: 10px;">
          <h3>Threats</h3>
          <ul>
            ${executiveSummary?.marketPosition.threats.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </td>
      </tr>
    </table>
  </div>
  
  <div class="footer">
    <p>Confidential - ${executiveSummary?.company}</p>
    <p>This report contains proprietary information and should be handled accordingly.</p>
  </div>
</body>
</html>
    `;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-500';
      case 'at-risk': return 'text-yellow-500';
      case 'off-track': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 15) return '#EF4444';
    if (score >= 10) return '#F59E0B';
    if (score >= 5) return '#EAB308';
    return '#22C55E';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Premium Business Intelligence Dashboard
              </CardTitle>
              <CardDescription className="mt-2">
                Executive insights, KPIs, and strategic recommendations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateExecutiveReport} disabled={isGenerating}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maturity Score</p>
                  <p className="text-2xl font-bold">{executiveSummary.currentState.maturityScore}/5</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
              <Progress value={executiveSummary.currentState.maturityScore * 20} className="mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold">{executiveSummary.currentState.riskScore}/10</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-500" />
              </div>
              <Progress 
                value={100 - (executiveSummary.currentState.riskScore * 10)} 
                className="mt-3"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="text-2xl font-bold">{executiveSummary.currentState.complianceScore}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={executiveSummary.currentState.complianceScore} className="mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold">{executiveSummary.currentState.operationalEfficiency}%</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={executiveSummary.currentState.operationalEfficiency} className="mt-3" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard */}
      <Tabs defaultValue="kpis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="maturity">Maturity</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Real-time metrics and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{metric.name}</p>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <span className={`text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
                          <Badge variant={metric.status === 'on-track' ? 'default' : metric.status === 'at-risk' ? 'secondary' : 'destructive'}>
                            {metric.status}
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

        <TabsContent value="maturity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Maturity Progression</CardTitle>
              <CardDescription>Track your security maturity journey against targets and industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={maturityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#0EA5E9" strokeWidth={2} name="Your Score" />
                  <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" name="Target" />
                  <Line type="monotone" dataKey="industry" stroke="#6B7280" strokeDasharray="3 3" name="Industry Average" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Maturity by Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { domain: 'Identity & Access', score: 4.2, max: 5 },
                    { domain: 'Network Security', score: 3.8, max: 5 },
                    { domain: 'Device Management', score: 3.5, max: 5 },
                    { domain: 'Compliance', score: 4.0, max: 5 },
                    { domain: 'Incident Response', score: 3.2, max: 5 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.domain}</span>
                        <span className="text-sm text-muted-foreground">{item.score}/{item.max}</span>
                      </div>
                      <Progress value={(item.score / item.max) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { area: 'Automation Level', current: 45, target: 80, priority: 'high' },
                    { area: 'AI/ML Adoption', current: 25, target: 60, priority: 'medium' },
                    { area: 'Cloud Integration', current: 60, target: 90, priority: 'high' },
                    { area: 'Zero Trust Progress', current: 35, target: 75, priority: 'critical' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.area}</span>
                        <Badge variant={item.priority === 'critical' ? 'destructive' : item.priority === 'high' ? 'secondary' : 'outline'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Current: {item.current}%</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>Target: {item.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Coverage by Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={complianceRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="framework" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Compliance Score" dataKey="score" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control Implementation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { framework: 'NIST CSF', total: 108, implemented: 92, percentage: 85 },
                    { framework: 'ISO 27001', total: 114, implemented: 89, percentage: 78 },
                    { framework: 'PCI DSS', total: 64, implemented: 59, percentage: 92 },
                    { framework: 'HIPAA', total: 54, implemented: 48, percentage: 88 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{item.framework}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.implemented}/{item.total} controls
                          </p>
                        </div>
                        <Badge variant={item.percentage >= 90 ? 'default' : item.percentage >= 75 ? 'secondary' : 'destructive'}>
                          {item.percentage}%
                        </Badge>
                      </div>
                      <Progress value={item.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Timeline</CardTitle>
              <CardDescription>Upcoming audits and certification renewals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '2024-03-15', event: 'ISO 27001 Surveillance Audit', type: 'audit', status: 'scheduled' },
                  { date: '2024-04-01', event: 'PCI DSS Quarterly Scan', type: 'scan', status: 'scheduled' },
                  { date: '2024-05-20', event: 'SOC 2 Type II Report', type: 'report', status: 'preparation' },
                  { date: '2024-06-30', event: 'HIPAA Risk Assessment', type: 'assessment', status: 'planning' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'scheduled' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heat Map</CardTitle>
              <CardDescription>Risk assessment by category with likelihood and impact analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {riskHeatmapData.map((risk, index) => (
                  <Card key={index} style={{ borderColor: getRiskColor(risk.score), borderWidth: 2 }}>
                    <CardContent className="pt-4">
                      <p className="font-medium mb-2">{risk.category}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Likelihood</span>
                          <span>{risk.likelihood}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Impact</span>
                          <span>{risk.impact}/5</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Risk Score</span>
                          <span style={{ color: getRiskColor(risk.score) }}>{risk.score}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { indicator: 'Unpatched Systems', value: 234, trend: 'down', severity: 'high' },
                    { indicator: 'Failed Auth Attempts', value: 1453, trend: 'up', severity: 'medium' },
                    { indicator: 'Policy Violations', value: 89, trend: 'down', severity: 'medium' },
                    { indicator: 'Unauthorized Devices', value: 12, trend: 'stable', severity: 'critical' },
                    { indicator: 'Expired Certificates', value: 5, trend: 'up', severity: 'high' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${
                          item.severity === 'critical' ? 'text-red-500' :
                          item.severity === 'high' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`} />
                        <span className="text-sm">{item.indicator}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.value}</span>
                        {getTrendIcon(item.trend as any)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mitigation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { mitigation: 'Zero Trust Implementation', progress: 65 },
                    { mitigation: 'Endpoint Detection Upgrade', progress: 80 },
                    { mitigation: 'Security Training Program', progress: 45 },
                    { mitigation: 'Incident Response Plan', progress: 90 },
                    { mitigation: 'Vulnerability Management', progress: 70 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{item.mitigation}</span>
                        <span className="text-sm font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={vendorDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vendorDistributionData.map((entry, index) => (
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
                <CardTitle>Vendor Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { vendor: 'Cisco', uptime: 99.95, incidents: 2, satisfaction: 4.3 },
                    { vendor: 'Aruba', uptime: 99.92, incidents: 3, satisfaction: 4.1 },
                    { vendor: 'Fortinet', uptime: 99.88, incidents: 5, satisfaction: 3.9 },
                    { vendor: 'Portnox', uptime: 99.99, incidents: 0, satisfaction: 4.5 }
                  ].map((vendor, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium mb-2">{vendor.vendor}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Uptime</p>
                          <p className="font-medium">{vendor.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Incidents</p>
                          <p className="font-medium">{vendor.incidents}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="font-medium">{vendor.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Cost Analysis</CardTitle>
              <CardDescription>TCO and ROI analysis by vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { vendor: 'Cisco', cost: 450000, roi: 178 },
                  { vendor: 'Aruba', cost: 320000, roi: 165 },
                  { vendor: 'Fortinet', cost: 280000, roi: 152 },
                  { vendor: 'Portnox', cost: 180000, roi: 195 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#0EA5E9" name="Total Cost ($)" />
                  <Bar yAxisId="right" dataKey="roi" fill="#10B981" name="ROI (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {executiveSummary?.recommendations.map((rec, index) => (
            <Card key={index} className={`border-l-4 ${
              rec.priority === 'critical' ? 'border-l-red-500' :
              rec.priority === 'high' ? 'border-l-orange-500' :
              rec.priority === 'medium' ? 'border-l-blue-500' :
              'border-l-gray-500'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <Badge variant={
                    rec.priority === 'critical' ? 'destructive' :
                    rec.priority === 'high' ? 'secondary' :
                    'outline'
                  }>
                    {rec.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Impact</p>
                    <p className="font-medium">{rec.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Effort</p>
                    <p className="font-medium">{rec.effort}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected ROI</p>
                    <p className="font-medium text-green-600">{rec.roi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Strategic Roadmap</CardTitle>
              <CardDescription>Recommended implementation timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {deploymentTimelineData.map((phase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium">{phase.phase}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded-lg relative overflow-hidden">
                        <div
                          className={`absolute h-full rounded-lg ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}
                          style={{
                            left: `${(phase.start / 24) * 100}%`,
                            width: `${(phase.duration / 24) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <Badge variant={
                      phase.status === 'completed' ? 'default' :
                      phase.status === 'in-progress' ? 'secondary' :
                      'outline'
                    }>
                      {phase.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumBusinessIntelligence;

