import React from 'react';
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
  Network, Settings, Plus, ArrowRight, MapPin, Calendar, BookOpen
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
    <div className="min-h-screen bg-background">
      <div className="pt-0">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Hero Section - Clean Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Portnox NAC Designer & Deployment Tracker
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                AI-powered NAC implementation platform with intelligent scoping, 
                comprehensive use case library, and advanced project tracking. Transform 
                complex deployments into repeatable successes.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-lg">
                  <Link to="/scoping">
                    <Plus className="h-4 w-4 mr-2" />
                    AI-Powered Scoping
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/use-cases">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Use Case Library
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

            {/* Stats Grid - Matching Image Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
                  <Building2 className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.totalSites}</div>
                  <p className="text-xs text-muted-foreground">Across all locations</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                  <Zap className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">In various phases</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Questionnaires</CardTitle>
                  <FileText className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.activeQuestionnaires}</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.completedDeployments}</div>
                  <p className="text-xs text-muted-foreground">Successful deployments</p>
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
                  <div className="flex gap-2">
                    <Link to="/scoping">
                      <Button className="bg-gradient-primary hover:opacity-90">
                        <Plus className="h-4 w-4 mr-2" />
                        AI Scoping Wizard
                      </Button>
                    </Link>
                    <Link to="/tracker">
                      <Button variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Project Tracker
                      </Button>
                    </Link>
                  </div>
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
                              <Link to={`/projects/${project.id}`}>
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
        </div>
      </div>
    </div>
  );
};

export default Index;