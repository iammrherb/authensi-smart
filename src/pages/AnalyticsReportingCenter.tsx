import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, FileText, Target, TrendingUp, Database, 
  Users, Building2, Shield, Network, Zap, Globe,
  Activity, PieChart, LineChart, Download, Eye,
  Settings, RefreshCw, Filter, Search, Calendar, Star
} from 'lucide-react';

import ProjectBasedReportGenerator from '@/components/reports/ProjectBasedReportGenerator';
import SystemHealthCenter from '@/components/admin/SystemHealthCenter';

const AnalyticsReportingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const analyticsMetrics = [
    {
      title: "Total Projects",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Reports Generated",
      value: "89",
      change: "+23%",
      trend: "up",
      icon: FileText,
      color: "bg-green-500"
    },
    {
      title: "Active Users",
      value: "45",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Resources Enriched",
      value: "1,234",
      change: "+45%",
      trend: "up",
      icon: Database,
      color: "bg-orange-500"
    }
  ];

  const recentReports = [
    {
      id: "1",
      title: "Enterprise NAC Deployment - Prerequisites",
      project: "Enterprise NAC Implementation",
      client: "TechCorp Inc.",
      type: "Prerequisites Analysis",
      status: "completed",
      generatedAt: "2025-01-15T10:30:00Z"
    },
    {
      id: "2",
      title: "Healthcare Network - Firewall Requirements",
      project: "Healthcare Network Security",
      client: "MedNet Solutions",
      type: "Firewall Requirements",
      status: "completed",
      generatedAt: "2025-01-14T15:45:00Z"
    },
    {
      id: "3",
      title: "Financial Services - Deployment Checklist",
      project: "Financial Security Upgrade",
      client: "SecureBank Ltd.",
      type: "Deployment Checklist",
      status: "in_progress",
      generatedAt: "2025-01-14T09:15:00Z"
    }
  ];

  const reportTemplates = [
    {
      id: "prerequisites",
      name: "Prerequisites Analysis",
      description: "Comprehensive hardware, software, network requirements",
      usage: 23,
      rating: 4.8,
      category: "Technical"
    },
    {
      id: "deployment_checklist",
      name: "Deployment Checklist",
      description: "Step-by-step deployment validation procedures",
      usage: 45,
      rating: 4.6,
      category: "Operational"
    },
    {
      id: "firewall_requirements",
      name: "Firewall Requirements",
      description: "Detailed port and protocol specifications",
      usage: 18,
      rating: 4.9,
      category: "Security"
    },
    {
      id: "technical_specifications",
      name: "Technical Specifications",
      description: "Complete architecture and integration details",
      usage: 32,
      rating: 4.7,
      category: "Technical"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting Center</h1>
              <p className="text-muted-foreground">Comprehensive analytics, reporting, and system monitoring</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <Separator />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Report Generator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs ${getTrendColor(metric.trend)} flex items-center`}>
                    {metric.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Reports</span>
              </CardTitle>
              <CardDescription>Latest generated reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.project} • {report.client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.generatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common reporting and analytics tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('reports')}
                >
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-sm">Generate Report</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-sm">View Analytics</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('templates')}
                >
                  <Target className="h-5 w-5 mb-1" />
                  <span className="text-sm">Report Templates</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => setActiveTab('system')}
                >
                  <Activity className="h-5 w-5 mb-1" />
                  <span className="text-sm">System Health</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <ProjectBasedReportGenerator />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
                <CardDescription>Project performance and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Projects by Status</span>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-green-700">Completed</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">89</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-blue-700">In Progress</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">45</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm text-yellow-700">Planning</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">22</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Report Usage Analytics</CardTitle>
                <CardDescription>Most popular report types and usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTemplates.slice(0, 4).map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{template.usage} reports</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{template.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and response times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">1.2s</div>
                  <p className="text-sm text-blue-600">Avg Report Generation</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">99.8%</div>
                  <p className="text-sm text-green-600">System Uptime</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">2.5k</div>
                  <p className="text-sm text-purple-600">Total Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Predefined report templates and their usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Usage:</span>
                          <span className="font-medium">{template.usage} times</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{template.rating}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          <SystemHealthCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReportingCenter;
