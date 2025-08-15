
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useSites } from "@/hooks/useSites";
import { useProjects } from "@/hooks/useProjects";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, RadialBarChart, RadialBar
} from "recharts";
import { 
  TrendingUp, TrendingDown, Activity, Users, Building2, CheckCircle2, 
  AlertCircle, Clock, Zap, Target, Award, BarChart3, PieChart as PieChartIcon,
  Calendar, Filter, Download, RefreshCw, Eye, Shield, Cpu, Database,
  Network, Timer, Gauge, Signal, BrainCircuit, Sparkles, Rocket
} from "lucide-react";
import { useState, useMemo } from "react";

const AnalyticsDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useRealtimeStats();
  const { data: sites } = useSites();
  const { data: projects } = useProjects();
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Generate comprehensive analytics data
  const analyticsData = useMemo(() => {
    if (!stats || !sites || !projects) return null;

    // Time series data for the last 30 days
    const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        projects: Math.floor(Math.random() * 5) + stats.projects.total * 0.8,
        sites: Math.floor(Math.random() * 10) + stats.sites.total * 0.7,
        deployments: Math.floor(Math.random() * 3) + 1,
        incidents: Math.floor(Math.random() * 2),
        performance: 85 + Math.random() * 10,
        satisfaction: 88 + Math.random() * 8
      };
    });

    // Project distribution by status
    const projectStatusData = [
      { name: 'Active', value: stats.projects.active, color: 'hsl(var(--neon-green))' },
      { name: 'Completed', value: stats.projects.completed, color: 'hsl(var(--electric-blue))' },
      { name: 'Pending', value: stats.projects.pending, color: 'hsl(var(--neon-orange))' }
    ];

    // Site deployment progress
    const siteProgressData = [
      { name: 'Planning', value: stats.sites.planning, color: 'hsl(var(--neon-purple))' },
      { name: 'Implementing', value: stats.sites.implementing, color: 'hsl(var(--neon-orange))' },
      { name: 'Deployed', value: stats.sites.deployed, color: 'hsl(var(--neon-green))' }
    ];

    // Performance metrics
    const performanceData = [
      { metric: 'System Uptime', value: 99.8, target: 99.5, status: 'excellent' },
      { metric: 'Response Time', value: 120, target: 200, status: 'good', unit: 'ms' },
      { metric: 'Success Rate', value: 98.5, target: 95, status: 'excellent' },
      { metric: 'Error Rate', value: 0.2, target: 1, status: 'excellent' },
      { metric: 'Throughput', value: 1250, target: 1000, status: 'excellent', unit: 'req/min' }
    ];

    // Team efficiency data
    const teamEfficiencyData = [
      { team: 'Sales Engineering', efficiency: 94, projects: 8, satisfaction: 4.8 },
      { team: 'Implementation', efficiency: 89, projects: 12, satisfaction: 4.6 },
      { team: 'Support', efficiency: 92, projects: 15, satisfaction: 4.7 },
      { team: 'Product Management', efficiency: 87, projects: 6, satisfaction: 4.5 }
    ];

    return {
      timeSeriesData,
      projectStatusData,
      siteProgressData,
      performanceData,
      teamEfficiencyData
    };
  }, [stats, sites, projects]);

  // Key metrics calculations
  const keyMetrics = useMemo(() => {
    if (!stats) return [];

    const completionRate = stats.projects.total > 0 ? 
      Math.round((stats.projects.completed / stats.projects.total) * 100) : 0;
    
    const deploymentVelocity = stats.sites.total > 0 ? 
      Math.round(((stats.sites.implementing + stats.sites.deployed) / stats.sites.total) * 100) : 0;

    return [
      {
        title: "Project Completion Rate",
        value: `${completionRate}%`,
        change: "+12%",
        trend: "up",
        icon: Target,
        color: "neon-green",
        description: "Projects successfully completed"
      },
      {
        title: "Deployment Velocity",
        value: `${deploymentVelocity}%`,
        change: "+8%",
        trend: "up",
        icon: Rocket,
        color: "electric-blue",
        description: "Sites in implementation or deployed"
      },
      {
        title: "Average Progress",
        value: `${stats.averageProgress}%`,
        change: "+5%",
        trend: "up",
        icon: Gauge,
        color: "neon-purple",
        description: "Overall project progress"
      },
      {
        title: "Active Implementations",
        value: stats.totalImplementations,
        change: "+3",
        trend: "up",
        icon: Activity,
        color: "neon-orange",
        description: "Currently implementing sites"
      },
      {
        title: "System Performance",
        value: "99.8%",
        change: "+0.2%",
        trend: "up",
        icon: Cpu,
        color: "cyber-pink",
        description: "System uptime and reliability"
      },
      {
        title: "Client Satisfaction",
        value: "4.7/5",
        change: "+0.1",
        trend: "up",
        icon: Award,
        color: "neon-yellow",
        description: "Average client satisfaction score"
      }
    ];
  }, [stats]);

  const chartConfig: ChartConfig = {
    projects: { label: "Projects", color: "hsl(var(--neon-green))" },
    sites: { label: "Sites", color: "hsl(var(--electric-blue))" },
    deployments: { label: "Deployments", color: "hsl(var(--neon-orange))" },
    performance: { label: "Performance", color: "hsl(var(--neon-purple))" },
    satisfaction: { label: "Satisfaction", color: "hsl(var(--cyber-pink))" }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.title} className="group hover-lift glass-subtle border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${metric.color}/10`}>
                    <IconComponent className={`h-4 w-4 text-${metric.color}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      metric.trend === 'up' ? 'text-neon-green' : 'text-neon-red'
                    }`}
                  >
                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Activity Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={analyticsData?.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="projects" 
                      stackId="1" 
                      stroke="hsl(var(--neon-green))" 
                      fill="hsl(var(--neon-green))" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sites" 
                      stackId="1" 
                      stroke="hsl(var(--electric-blue))" 
                      fill="hsl(var(--electric-blue))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  <span>Project Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <PieChart>
                    <Pie
                      data={analyticsData?.projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData?.projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Site Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Site Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart data={analyticsData?.siteProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {analyticsData?.siteProgressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <span>System Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.performanceData.map((metric, index) => (
                    <div key={metric.metric} className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          metric.status === 'excellent' ? 'bg-neon-green/10' :
                          metric.status === 'good' ? 'bg-electric-blue/10' : 'bg-neon-orange/10'
                        }`}>
                          <Signal className={`h-4 w-4 ${
                            metric.status === 'excellent' ? 'text-neon-green' :
                            metric.status === 'good' ? 'text-electric-blue' : 'text-neon-orange'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{metric.metric}</p>
                          <p className="text-sm text-muted-foreground">
                            Target: {metric.target}{metric.unit || '%'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{metric.value}{metric.unit || '%'}</p>
                        <Badge variant={metric.status === 'excellent' ? 'default' : 'secondary'}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Total Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.projects.total || 0}</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-neon-green font-medium">{stats?.projects.active}</div>
                    <div className="text-muted-foreground">Active</div>
                  </div>
                  <div>
                    <div className="text-electric-blue font-medium">{stats?.projects.completed}</div>
                    <div className="text-muted-foreground">Complete</div>
                  </div>
                  <div>
                    <div className="text-neon-orange font-medium">{stats?.projects.pending}</div>
                    <div className="text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Site Deployments</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.sites.total || 0}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deployed</span>
                    <span className="text-neon-green font-medium">{stats?.sites.deployed}</span>
                  </div>
                  <Progress value={(stats?.sites.deployed || 0) / (stats?.sites.total || 1) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Avg Progress</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.averageProgress || 0}%</div>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray={`${(stats?.averageProgress || 0)}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Team Efficiency & Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.teamEfficiencyData.map((team, index) => (
                    <div key={team.team} className="p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{team.team}</h3>
                        <Badge variant="secondary">{team.projects} projects</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Efficiency</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={team.efficiency} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{team.efficiency}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Satisfaction</p>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4 text-neon-yellow" />
                            <span className="font-medium">{team.satisfaction}/5</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={team.efficiency > 90 ? "default" : "secondary"}>
                            {team.efficiency > 90 ? "Excellent" : "Good"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span>AI-Powered Insights</span>
                  <Badge variant="secondary" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="h-4 w-4 text-neon-green mt-0.5" />
                    <div>
                      <p className="font-medium text-neon-green">Performance Opportunity</p>
                      <p className="text-sm text-muted-foreground">
                        Deployment velocity could increase by 15% with automation improvements
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-electric-blue/10 border border-electric-blue/20">
                  <div className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-electric-blue mt-0.5" />
                    <div>
                      <p className="font-medium text-electric-blue">Resource Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Consider reallocating 2 team members to high-priority projects
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/20">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-neon-orange mt-0.5" />
                    <div>
                      <p className="font-medium text-neon-orange">Risk Mitigation</p>
                      <p className="text-sm text-muted-foreground">
                        3 projects are at risk of missing deadlines - intervention recommended
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-neon-green" />
                    <span className="text-sm">Automate configuration templates</span>
                  </div>
                  <Badge variant="outline">High Impact</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-electric-blue" />
                    <span className="text-sm">Implement parallel testing</span>
                  </div>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-neon-purple" />
                    <span className="text-sm">Cross-training initiatives</span>
                  </div>
                  <Badge variant="outline">Long-term</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
