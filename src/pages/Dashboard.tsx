
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Users, Target, Rocket, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectOverview from "@/components/tracker/ProjectOverview";
import { useSites } from "@/hooks/useSites";
import { useProjects } from "@/hooks/useProjects";

const Dashboard = () => {
  const { data: sites = [] } = useSites();
  const { data: projects = [] } = useProjects();

  const quickStats = [
    {
      title: "Active Projects",
      value: projects.filter(p => p.status === 'implementing' || p.status === 'scoping').length,
      total: projects.length,
      icon: <Target className="h-6 w-6" />,
      color: "text-blue-500",
      href: "/tracker"
    },
    {
      title: "Sites in Progress", 
      value: sites.filter(s => s.status === 'implementing' || s.status === 'scoping').length,
      total: sites.length,
      icon: <Building2 className="h-6 w-6" />,
      color: "text-green-500",
      href: "/sites"
    },
    {
      title: "Deployment Ready",
      value: sites.filter(s => s.status === 'testing' || s.status === 'deployed').length,
      total: sites.length,
      icon: <Rocket className="h-6 w-6" />,
      color: "text-purple-500",
      href: "/deployment"
    },
    {
      title: "Completion Rate",
      value: Math.round((sites.filter(s => s.status === 'deployed').length / Math.max(sites.length, 1)) * 100),
      total: 100,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-500",
      href: "/reports",
      suffix: "%"
    }
  ];

  const quickActions = [
    { title: "Create New Project", description: "Start a new NAC deployment project", href: "/tracker", icon: <Plus className="h-5 w-5" />, color: "bg-blue-500" },
    { title: "Add Site", description: "Register a new deployment site", href: "/sites", icon: <Building2 className="h-5 w-5" />, color: "bg-green-500" },
    { title: "Manage Users", description: "Configure team members and roles", href: "/users", icon: <Users className="h-5 w-5" />, color: "bg-purple-500" },
    { title: "Scoping Wizard", description: "Capture site requirements", href: "/questionnaires", icon: <Target className="h-5 w-5" />, color: "bg-orange-500" },
    { title: "Vendor Management", description: "Configure network vendors", href: "/vendors", icon: <Settings className="h-5 w-5" />, color: "bg-indigo-500" },
    { title: "Use Case Library", description: "Browse implementation patterns", href: "/requirements", icon: <BarChart3 className="h-5 w-5" />, color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🎯 SCOPE SLAYER Command Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">POC TRACKER</span> • 
              <span className="text-foreground"> DEPLOYMENT MASTER</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              🎯 <strong>USE CASE MAESTRO</strong> - Your ultimate command center for Portnox ZTAC projects, 
              POC orchestration, deployment tracking, and implementation management.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Link key={index} to={stat.href} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={stat.color}>{stat.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stat.value}{stat.suffix || ""}
                      <span className="text-sm text-muted-foreground font-normal">
                        {!stat.suffix && ` / ${stat.total}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="sites">Recent Sites</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['planning', 'scoping', 'implementing', 'testing', 'deployed'].map(status => {
                        const count = projects.filter(p => p.status === status).length;
                        const percentage = (count / Math.max(projects.length, 1)) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm capitalize font-medium">{status}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Site Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['planning', 'scoping', 'implementing', 'testing', 'deployed'].map(status => {
                        const count = sites.filter(s => s.status === status).length;
                        const percentage = (count / Math.max(sites.length, 1)) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm capitalize font-medium">{status}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <ProjectOverview />
            </TabsContent>

            <TabsContent value="sites">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Sites</CardTitle>
                  <Link to="/sites">
                    <Button variant="outline" size="sm">View All Sites</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sites.slice(0, 5).map(site => (
                      <div key={site.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground">{site.location}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{site.status}</Badge>
                          <Badge variant="secondary" className="text-xs">{site.priority}</Badge>
                        </div>
                      </div>
                    ))}
                    {sites.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No sites created yet. <Link to="/sites" className="text-primary hover:underline">Create your first site</Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            {action.icon}
                          </div>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
