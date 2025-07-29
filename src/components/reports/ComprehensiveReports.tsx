import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useUseCases } from '@/hooks/useUseCases';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import {
  FileText, Download, TrendingUp, BarChart3, PieChart, Calendar,
  Filter, Search, Printer, Mail, Share2, AlertCircle, CheckCircle,
  Clock, Target, Building2, Users, Globe, Shield, Zap, Brain, Rocket
} from 'lucide-react';

interface ReportFilters {
  projects: string[];
  dateRange: string;
  status: string;
  type: string;
  format: string;
}

const ComprehensiveReports = () => {
  const { data: projects = [] } = useProjects();
  const { data: sites = [] } = useSites();
  const { data: useCases = [] } = useUseCases();
  const { generateCompletion, isLoading } = useAI();
  const { toast } = useToast();

  const [filters, setFilters] = useState<ReportFilters>({
    projects: [],
    dateRange: '30d',
    status: 'all',
    type: 'deployment',
    format: 'pdf'
  });

  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('analytics');

  // Calculate analytics
  const analytics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => ['scoping', 'implementing', 'testing'].includes(p.status || '')).length,
    completedProjects: projects.filter(p => p.status === 'deployed').length,
    totalSites: sites.length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / projects.length) : 0,
    onTimeProjects: projects.filter(p => {
      const targetDate = new Date(p.target_completion || '');
      const actualDate = new Date(p.actual_completion || '');
      return p.actual_completion ? actualDate <= targetDate : true;
    }).length,
    budgetCompliance: 85, // Mock data
    riskProjects: projects.filter(p => (p.progress_percentage || 0) < 30 && p.status !== 'deployed').length
  };

  const reportTypes = [
    {
      id: 'deployment',
      name: 'Deployment Report',
      description: 'Comprehensive deployment status and progress tracking',
      icon: Rocket,
      color: 'text-blue-500'
    },
    {
      id: 'progress',
      name: 'Progress Analysis',
      description: 'Project progress tracking and milestone analysis',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      id: 'resource',
      name: 'Resource Utilization',
      description: 'Resource allocation and utilization metrics',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Security and regulatory compliance assessment',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      id: 'vendor',
      name: 'Vendor Analysis',
      description: 'Vendor performance and integration analysis',
      icon: Building2,
      color: 'text-orange-500'
    },
    {
      id: 'ai-insights',
      name: 'AI Insights Report',
      description: 'AI-generated insights and recommendations',
      icon: Brain,
      color: 'text-pink-500'
    }
  ];

  const generateAIReport = async (type: string) => {
    setGeneratingReport(true);
    try {
      const projectsData = projects.map(p => ({
        name: p.name,
        status: p.status,
        progress: p.progress_percentage,
        client: p.client_name,
        industry: p.industry
      }));

      const prompt = `Generate a comprehensive ${type} report for the following NAC deployment projects:
      
Projects: ${JSON.stringify(projectsData, null, 2)}
Sites: ${sites.length} total sites
Use Cases: ${useCases.length} available use cases

Please provide:
1. Executive Summary
2. Key Performance Indicators
3. Project Status Overview
4. Risk Assessment
5. Recommendations
6. Next Steps

Format the report professionally with clear sections and actionable insights.`;

      const response = await generateCompletion({
        prompt,
        context: `${type}_report`,
        provider: 'openai',
        temperature: 0.3,
        maxTokens: 4000
      });

      if (response?.content) {
        setReportData({
          type,
          content: response.content,
          generatedAt: new Date().toISOString(),
          analytics
        });
        setActiveTab('generated');
        toast({
          title: "Report Generated",
          description: "AI-powered report has been generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    toast({
      title: "Exporting Report",
      description: `Report will be exported as ${format.toUpperCase()}`,
    });
  };

  const shareReport = () => {
    toast({
      title: "Sharing Report",
      description: "Report sharing link has been generated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          📊 Advanced Analytics
        </Badge>
        <h2 className="text-3xl font-bold mb-2">
          Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Reports</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate detailed reports with AI-powered insights, analytics, and actionable recommendations
          for your NAC deployment projects.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Report Builder</span>
          </TabsTrigger>
          <TabsTrigger value="generated" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Generated Report</span>
          </TabsTrigger>
        </TabsList>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {analytics.activeProjects} active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgProgress}%</div>
                <Progress value={analytics.avgProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((analytics.onTimeProjects / Math.max(analytics.totalProjects, 1)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.onTimeProjects} of {analytics.totalProjects}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Projects</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{analytics.riskProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reports Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((reportType) => (
                  <div key={reportType.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-accent/20`}>
                        <reportType.icon className={`h-5 w-5 ${reportType.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{reportType.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {reportType.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <EnhancedButton
                        onClick={() => generateAIReport(reportType.id)}
                        disabled={generatingReport}
                        loading={generatingReport}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generate
                      </EnhancedButton>
                      <Button
                        onClick={() => exportReport('pdf')}
                        size="sm"
                        variant="ghost"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Builder */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Report Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="completed">Completed Only</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={filters.format} onValueChange={(value) => setFilters({...filters, format: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="pptx">PowerPoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <EnhancedButton
                    onClick={() => generateAIReport(filters.type)}
                    disabled={generatingReport}
                    loading={generatingReport}
                    className="w-full"
                    gradient="primary"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Report
                  </EnhancedButton>
                  
                  <Button
                    onClick={() => exportReport(filters.format as any)}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No Report Generated</p>
                  <p className="text-sm">Configure your report settings and click "Generate AI Report" to create a comprehensive analysis.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generated Report */}
        <TabsContent value="generated" className="space-y-6">
          {reportData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <span>AI-Generated {reportTypes.find(t => t.id === reportData.type)?.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Generated on {new Date(reportData.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => exportReport('pdf')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button onClick={shareReport} variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={() => window.print()} variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed p-6 bg-card/50 rounded-lg">
                      {reportData.content}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-lg font-medium mb-2">No Report Generated Yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Go to the Report Builder tab to generate your first AI-powered report.
                </p>
                <Button onClick={() => setActiveTab('reports')} variant="outline">
                  Create Report
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveReports;