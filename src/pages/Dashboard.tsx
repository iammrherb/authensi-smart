
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, Rocket, BarChart3, TrendingUp, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectOverview from "@/components/tracker/ProjectOverview";
import QuickNav from "@/components/dashboard/QuickNav";
import AIAssistant from "@/components/ai/AIAssistant";
import SmartProjectInsights from "@/components/ai/SmartProjectInsights";
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
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-orange-500",
      href: "/reports",
      suffix: "%"
    }
  ];


  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="quick">Quick Start</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Link key={index} to={stat.href} className="block">
                <EnhancedCard glass lift glow className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={stat.color}>{stat.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {stat.value}{stat.suffix || ""}
                      <span className="text-sm text-muted-foreground font-normal">
                        {!stat.suffix && ` / ${stat.total}`}
                      </span>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </Link>
            ))}
          </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <EnhancedCard glass>
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
                </EnhancedCard>

                <EnhancedCard glass>
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
                </EnhancedCard>

                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <span>AI Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Get AI-powered insights about your deployments
                      </div>
                      <EnhancedButton 
                        gradient="primary" 
                        glow 
                        size="sm" 
                        className="w-full"
                        onClick={() => {/* Will implement project insights */}}
                      >
                        Generate Insights
                      </EnhancedButton>
                      <div className="text-xs text-muted-foreground">
                        • Deployment optimization tips
                        • Risk analysis
                        • Timeline recommendations
                      </div>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </div>
          </TabsContent>

          <TabsContent value="quick">
            <QuickNav />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectOverview />
          </TabsContent>

          <TabsContent value="sites">
              <EnhancedCard glass>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Sites</CardTitle>
                  <Link to="/sites">
                    <EnhancedButton variant="outline" size="sm">View All Sites</EnhancedButton>
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
              </EnhancedCard>
            </TabsContent>

            <TabsContent value="ai">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIAssistant context="general" className="h-[700px]" />
                <div className="space-y-6">
                  <EnhancedCard glass>
                    <CardHeader>
                      <CardTitle>Quick AI Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <EnhancedButton gradient="primary" glow className="w-full" size="sm">
                        Generate Project Report
                      </EnhancedButton>
                      <EnhancedButton gradient="accent" className="w-full" size="sm">
                        Optimize Deployment Plan
                      </EnhancedButton>
                      <EnhancedButton gradient="button" className="w-full" size="sm">
                        Troubleshoot Issues
                      </EnhancedButton>
                      <EnhancedButton variant="outline" className="w-full" size="sm">
                        Best Practices Guide
                      </EnhancedButton>
                    </CardContent>
                  </EnhancedCard>
                  
                  <EnhancedCard glass>
                    <CardHeader>
                      <CardTitle>AI Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-3">
                        Configure AI providers and intelligence features in Settings
                      </div>
                      <Link to="/settings">
                        <EnhancedButton variant="outline" size="sm" className="w-full">
                          Open AI Settings
                        </EnhancedButton>
                      </Link>
                    </CardContent>
                  </EnhancedCard>
                </div>
              </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
