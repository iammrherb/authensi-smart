import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSites } from '@/hooks/useSites';
import { useProjects } from '@/hooks/useProjects';
import { useQuestionnaires } from '@/hooks/useQuestionnaires';
import { 
  Building2, Users, FileText, Zap, BarChart3, CheckCircle, 
  Clock, AlertTriangle, TrendingUp, Activity, Shield, 
  Network, Settings, Plus, ArrowRight, MapPin, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, profile, userRoles, isAdmin } = useAuth();
  const { data: sites } = useSites();
  const { data: projects } = useProjects();
  const { data: questionnaires } = useQuestionnaires();

  // Dashboard stats
  const stats = {
    totalSites: sites?.length || 0,
    totalProjects: projects?.length || 0,
    activeQuestionnaires: questionnaires?.filter(q => q.status === 'in-progress').length || 0,
    completedDeployments: projects?.filter(p => p.status === 'deployed').length || 0,
  };

  // Mock data for recent activities and projects
  const recentProjects = [
    {
      id: 1,
      name: "Global Bank NAC Rollout",
      client: "First National Bank",
      status: "implementing",
      progress: 65,
      sites: 12,
      nextMilestone: "Phase 2 Testing",
      dueDate: "2024-02-15",
      priority: "high"
    },
    {
      id: 2,
      name: "Healthcare Network Security",
      client: "Regional Medical Center", 
      status: "scoping",
      progress: 25,
      sites: 8,
      nextMilestone: "Requirements Review",
      dueDate: "2024-01-30",
      priority: "medium"
    },
    {
      id: 3,
      name: "Manufacturing IoT Security",
      client: "Tech Industries Ltd",
      status: "testing",
      progress: 85,
      sites: 5,
      nextMilestone: "Production Cutover",
      dueDate: "2024-02-01",
      priority: "critical"
    }
  ];

  const recentActivity = [
    { type: 'project', title: 'New site deployment started', time: '2 hours ago', status: 'active' },
    { type: 'questionnaire', title: 'Scoping questionnaire completed', time: '4 hours ago', status: 'completed' },
    { type: 'user', title: 'New team member added', time: '1 day ago', status: 'info' },
    { type: 'deployment', title: 'Phase 2 rollout initiated', time: '2 days ago', status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'scoping': 'default',
      'designing': 'secondary',
      'implementing': 'default',
      'testing': 'outline',
      'deployed': 'glow',
      'planning': 'outline'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'outline',
      'medium': 'secondary',
      'high': 'default',
      'critical': 'destructive'
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-xl bg-gradient-primary bg-clip-text text-transparent">
                    Portnox NAC Tracker
                  </h1>
                  <p className="text-xs text-muted-foreground">Enterprise Network Access Control Platform</p>
                </div>
              </div>
              
              <div className="ml-auto flex items-center gap-4">
                <Badge variant="glow" className="hidden md:flex">
                  {userRoles.includes('admin') ? 'Administrator' : 
                   userRoles.includes('project_manager') ? 'Project Manager' : 'Team Member'}
                </Badge>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium">
                    Welcome, {profile?.first_name || user?.email?.split('@')[0]}!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 space-y-6 p-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 border border-border/50">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                  <Badge variant="glow">Live Dashboard</Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  NAC Deployment Command Center
                </h2>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                  Monitor real-time progress across all your Portnox Network Access Control 
                  implementations. Track sites, manage questionnaires, and ensure successful deployments.
                </p>
                <div className="flex gap-3">
                  <Button asChild size="lg" className="shadow-lg">
                    <Link to="/questionnaires">
                      <Plus className="h-4 w-4 mr-2" />
                      New Scoping Questionnaire
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/sites">
                      <Building2 className="h-4 w-4 mr-2" />
                      Manage Sites
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSites}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all locations
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Zap className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    In various phases
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Questionnaires</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeQuestionnaires}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedDeployments}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful deployments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Active Projects</TabsTrigger>
                <TabsTrigger value="sites">Sites Status</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Active Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Active Projects Overview</h2>
                  <Link to="/tracker">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Project Tracker
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-6">
                  {recentProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <p className="text-muted-foreground">{project.client}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={getStatusColor(project.status) as any}>
                              {project.status}
                            </Badge>
                            <Badge variant={getPriorityColor(project.priority) as any}>
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{project.sites} sites</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Due {project.dueDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{project.nextMilestone}</span>
                            </div>
                            <div className="flex justify-end">
                              <Link to="/tracker">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Sites Status Tab */}
              <TabsContent value="sites" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Sites Overview</h2>
                  <Link to="/sites">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Building2 className="h-4 w-4 mr-2" />
                      Manage Sites
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-4">
                  {sites?.slice(0, 5).map((site) => (
                    <Card key={site.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{site.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {site.location}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Badge variant={getStatusColor(site.status) as any}>
                              {site.status}
                            </Badge>
                            <Badge variant={getPriorityColor(site.priority) as any}>
                              {site.priority}
                            </Badge>
                            <Link to="/sites">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No sites found. Create your first site to get started.</p>
                        <Link to="/sites">
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Site
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Recent Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                          <Badge variant="outline">{activity.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-xl font-semibold">Deployment Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <p className="text-xs text-muted-foreground">On-time delivery rate</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Avg Deployment Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8.5</div>
                      <p className="text-xs text-muted-foreground">Weeks per site</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Cost Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">12%</div>
                      <p className="text-xs text-muted-foreground">Under budget average</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;