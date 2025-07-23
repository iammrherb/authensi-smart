import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Building, 
  Network,
  TrendingUp,
  Calendar,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  // Mock operational data
  const dashboardStats = {
    activeProjects: 12,
    totalSites: 47,
    completedDeployments: 23,
    pendingQuestionnaires: 8,
    totalEndpoints: 15847,
    criticalIssues: 3
  };

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

  const pendingSites = [
    { name: "HQ Data Center", location: "New York, NY", status: "scoping", questionnaire: 45, priority: "high" },
    { name: "Branch Office 12", location: "Chicago, IL", status: "designing", questionnaire: 100, priority: "medium" },
    { name: "Warehouse Facility", location: "Atlanta, GA", status: "planning", questionnaire: 0, priority: "low" },
    { name: "R&D Laboratory", location: "Austin, TX", status: "implementing", questionnaire: 100, priority: "critical" }
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
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  NAC Deployment Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Project overview and operational status for all active deployments
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.activeProjects}</div>
                <p className="text-xs text-green-600">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Building className="h-4 w-4 mr-2 text-primary" />
                  Total Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalSites}</div>
                <p className="text-xs text-green-600">+5 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.completedDeployments}</div>
                <p className="text-xs text-muted-foreground">Deployments done</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-orange-600" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.pendingQuestionnaires}</div>
                <p className="text-xs text-muted-foreground">Questionnaires</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Network className="h-4 w-4 mr-2 text-blue-600" />
                  Total Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalEndpoints.toLocaleString()}</div>
                <p className="text-xs text-green-600">+847 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardStats.criticalIssues}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="sites">Sites Status</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                <h2 className="text-xl font-semibold">Sites Requiring Attention</h2>
                <Link to="/sites">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Building className="h-4 w-4 mr-2" />
                    Site Manager
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {pendingSites.map((site, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
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
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Questionnaire</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Progress value={site.questionnaire} className="w-16 h-2" />
                              <span className="text-xs">{site.questionnaire}%</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Badge variant={getStatusColor(site.status) as any}>
                              {site.status}
                            </Badge>
                            <Badge variant={getPriorityColor(site.priority) as any}>
                              {site.priority}
                            </Badge>
                          </div>
                          
                          <Link to={site.questionnaire === 0 ? "/questionnaires" : "/sites"}>
                            <Button variant="outline" size="sm">
                              {site.questionnaire === 0 ? "Start Scoping" : "View Details"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <h2 className="text-xl font-semibold">Upcoming Milestones</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Global Bank NAC - Phase 2 Testing</h3>
                        <p className="text-sm text-muted-foreground">Due February 15, 2024</p>
                      </div>
                      <Badge variant="destructive">Overdue</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Healthcare Network - Requirements Review</h3>
                        <p className="text-sm text-muted-foreground">Due January 30, 2024</p>
                      </div>
                      <Badge variant="default">Due Soon</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Manufacturing IoT - Production Cutover</h3>
                        <p className="text-sm text-muted-foreground">Due February 1, 2024</p>
                      </div>
                      <Badge variant="glow">On Track</Badge>
                    </div>
                  </CardContent>
                </Card>
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
  );
};

export default Dashboard;