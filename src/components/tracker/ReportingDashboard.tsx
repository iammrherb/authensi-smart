import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, Clock, Users, CheckCircle, AlertTriangle, Calendar } from "lucide-react";

const ReportingDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("current-quarter");
  const [selectedProject, setSelectedProject] = useState("all");

  const executiveSummary = {
    activeProjects: 8,
    completedProjects: 24,
    totalRevenue: "$2.4M",
    avgProjectDuration: "8.2 weeks",
    customerSatisfaction: 4.7,
    onTimeDelivery: 92,
    utilizationRate: 85,
    pipelineValue: "$1.8M"
  };

  const projectMetrics = [
    {
      metric: "Project Success Rate",
      value: "96%",
      trend: "+2%",
      trendDirection: "up",
      color: "text-green-500"
    },
    {
      metric: "Average Implementation Time",
      value: "6.2 weeks",
      trend: "-0.8 weeks",
      trendDirection: "down",
      color: "text-green-500"
    },
    {
      metric: "Customer Satisfaction Score",
      value: "4.7/5",
      trend: "+0.2",
      trendDirection: "up",
      color: "text-green-500"
    },
    {
      metric: "Revenue per Project",
      value: "$125K",
      trend: "+$15K",
      trendDirection: "up",
      color: "text-green-500"
    }
  ];

  const reportTypes = [
    {
      name: "Executive Dashboard",
      description: "High-level overview for executives",
      frequency: "Weekly",
      recipients: "C-Suite, VPs",
      lastGenerated: "2024-01-15"
    },
    {
      name: "Project Status Report",
      description: "Detailed project progress and status",
      frequency: "Daily",
      recipients: "Project Managers, Team Leads",
      lastGenerated: "2024-01-22"
    },
    {
      name: "Resource Utilization",
      description: "Team capacity and resource allocation",
      frequency: "Weekly",
      recipients: "Operations, HR",
      lastGenerated: "2024-01-20"
    },
    {
      name: "Customer Success Metrics",
      description: "Customer satisfaction and success indicators",
      frequency: "Monthly",
      recipients: "Customer Success, Sales",
      lastGenerated: "2024-01-01"
    },
    {
      name: "Financial Performance",
      description: "Revenue, costs, and profitability analysis",
      frequency: "Monthly",
      recipients: "Finance, Leadership",
      lastGenerated: "2024-01-01"
    },
    {
      name: "Implementation Quality",
      description: "Quality metrics and best practices adherence",
      frequency: "Weekly",
      recipients: "Engineering, QA",
      lastGenerated: "2024-01-18"
    }
  ];

  const projectStatusBreakdown = [
    { status: "Discovery", count: 3, percentage: 12.5, color: "bg-blue-500" },
    { status: "Design", count: 2, percentage: 8.3, color: "bg-purple-500" },
    { status: "Implementation", count: 8, percentage: 33.3, color: "bg-orange-500" },
    { status: "Testing", count: 5, percentage: 20.8, color: "bg-yellow-500" },
    { status: "Go-Live", count: 3, percentage: 12.5, color: "bg-green-500" },
    { status: "Completed", count: 3, percentage: 12.5, color: "bg-gray-500" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Reports & Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive reporting and analytics for Portnox deployments
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-primary hover:opacity-90">
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financials">Financial</TabsTrigger>
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{executiveSummary.activeProjects}</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{executiveSummary.completedProjects}</div>
                    <div className="text-sm text-muted-foreground">Completed Projects</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{executiveSummary.totalRevenue}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{executiveSummary.avgProjectDuration}</div>
                    <div className="text-sm text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{metric.metric}</div>
                    <div className="text-3xl font-bold text-primary">{metric.value}</div>
                    <div className={`flex items-center space-x-1 text-sm ${metric.color}`}>
                      <TrendingUp className="h-4 w-4" />
                      <span>{metric.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStatusBreakdown.map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{status.status}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{status.count} projects</span>
                        <span className="text-xs text-muted-foreground ml-2">({status.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${status.color}`}
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">92%</div>
                    <div className="text-sm text-muted-foreground">On-Time Delivery Rate</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Ahead of Schedule</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">On Schedule</span>
                      <span className="text-sm font-medium">77%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Behind Schedule</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: "Customer Satisfaction", value: 4.7, max: 5 },
                    { metric: "First-Time Success Rate", value: 89, max: 100 },
                    { metric: "Documentation Quality", value: 94, max: 100 },
                    { metric: "Post-Go-Live Issues", value: 12, max: 100, inverted: true }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.metric}</span>
                        <span className="text-sm font-medium">
                          {item.max === 5 ? `${item.value}/5` : `${item.value}%`}
                        </span>
                      </div>
                      <Progress 
                        value={item.max === 5 ? (item.value / item.max) * 100 : item.inverted ? 100 - item.value : item.value} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: "SMB Deployments", count: 15, avgDuration: "4.2 weeks", successRate: "98%" },
                  { type: "Mid-Market", count: 8, avgDuration: "7.5 weeks", successRate: "95%" },
                  { type: "Enterprise", count: 9, avgDuration: "12.3 weeks", successRate: "94%" }
                ].map((segment, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="text-lg font-semibold text-primary">{segment.type}</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold">{segment.count}</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{segment.avgDuration}</div>
                        <div className="text-sm text-muted-foreground">Avg Duration</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-500">{segment.successRate}</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", role: "Senior Engineer", projects: 5, satisfaction: 4.8, efficiency: 94 },
                    { name: "Sarah Johnson", role: "Implementation Lead", projects: 7, satisfaction: 4.7, efficiency: 92 },
                    { name: "Mike Davis", role: "Technical Architect", projects: 4, satisfaction: 4.9, efficiency: 96 },
                    { name: "Lisa Chen", role: "Project Manager", projects: 6, satisfaction: 4.6, efficiency: 89 }
                  ].map((member, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                        <Badge variant="outline">{member.projects} projects</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Satisfaction: </span>
                          <span className="font-medium">{member.satisfaction}/5</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Efficiency: </span>
                          <span className="font-medium">{member.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Overall Utilization Rate</div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { resource: "Implementation Engineers", utilization: 92 },
                      { resource: "Project Managers", utilization: 88 },
                      { resource: "Technical Architects", utilization: 75 },
                      { resource: "Support Staff", utilization: 82 }
                    ].map((resource, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{resource.resource}</span>
                          <span className="text-sm font-medium">{resource.utilization}%</span>
                        </div>
                        <Progress value={resource.utilization} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">$2.4M</div>
                <div className="text-sm text-muted-foreground">Total Revenue (YTD)</div>
                <div className="text-sm text-green-500 mt-1">+18% vs last year</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">$1.8M</div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
                <div className="text-sm text-green-500 mt-1">+25% vs last quarter</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-glow border-primary/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">$125K</div>
                <div className="text-sm text-muted-foreground">Avg Project Value</div>
                <div className="text-sm text-green-500 mt-1">+12% vs last quarter</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">By Project Type</h4>
                  {[
                    { type: "Enterprise Deployments", revenue: "$1.2M", percentage: 50 },
                    { type: "Mid-Market Projects", revenue: "$720K", percentage: 30 },
                    { type: "SMB Implementations", revenue: "$480K", percentage: 20 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.type}</span>
                        <span className="text-sm font-medium">{item.revenue}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">By Industry</h4>
                  {[
                    { industry: "Healthcare", revenue: "$840K", percentage: 35 },
                    { industry: "Financial Services", revenue: "$600K", percentage: 25 },
                    { industry: "Manufacturing", revenue: "$480K", percentage: 20 },
                    { industry: "Education", revenue: "$360K", percentage: 15 },
                    { industry: "Other", revenue: "$120K", percentage: 5 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.industry}</span>
                        <span className="text-sm font-medium">{item.revenue}</span>
                      </div>
                      <Progress value={item.percentage} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{report.description}</p>
                    </div>
                    <Badge variant="outline">{report.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Recipients:</span>
                      <div className="text-sm font-medium">{report.recipients}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Last Generated:</span>
                      <div className="text-sm font-medium">{report.lastGenerated}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Frequency:</span>
                      <div className="text-sm font-medium">{report.frequency}</div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Sample
                    </Button>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                      Generate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    type: "Performance Insight",
                    icon: <BarChart3 className="h-5 w-5" />,
                    title: "Project Duration Optimization",
                    insight: "Healthcare projects are taking 15% longer than average. Consider specialized training for medical device integrations.",
                    recommendation: "Implement healthcare-specific training program",
                    impact: "Potential 2-week reduction in project timelines"
                  },
                  {
                    type: "Resource Insight",
                    icon: <Users className="h-5 w-5" />,
                    title: "Resource Allocation Opportunity",
                    insight: "Technical architects are under-utilized at 75%. Consider expanding their role in pre-sales activities.", 
                    recommendation: "Include architects in complex pre-sales engagements",
                    impact: "Potential 20% increase in win rates"
                  },
                  {
                    type: "Quality Insight",
                    icon: <CheckCircle className="h-5 w-5" />,
                    title: "Quality Improvement Opportunity",
                    insight: "Projects with dedicated project managers have 23% higher customer satisfaction scores.",
                    recommendation: "Assign dedicated PMs to all enterprise projects",
                    impact: "Expected 0.3 point increase in satisfaction"
                  },
                  {
                    type: "Risk Insight",
                    icon: <AlertTriangle className="h-5 w-5" />,
                    title: "Risk Mitigation Opportunity",
                    insight: "Projects starting in Q4 have 18% higher delay risk due to holiday schedules.",
                    recommendation: "Adjust Q4 project timelines and resource allocation",
                    impact: "Reduce Q4 delays by estimated 60%"
                  }
                ].map((insight, index) => (
                  <Card key={index} className="bg-gradient-glow border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary flex-shrink-0">
                          {insight.icon}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-primary">{insight.title}</h4>
                            <Badge variant="outline">{insight.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.insight}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-primary">Recommendation:</span>
                              <p className="text-sm mt-1">{insight.recommendation}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-primary">Expected Impact:</span>
                              <p className="text-sm mt-1">{insight.impact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportingDashboard;