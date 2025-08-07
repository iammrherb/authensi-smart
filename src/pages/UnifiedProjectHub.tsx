import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Target, Settings, Rocket, MapPin, Activity, Brain, CheckSquare, Users, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import existing components
import ProjectCreationWizard from "@/components/comprehensive/EnhancedProjectCreationWizard";
import UltimateAIScopingWizard from "@/components/scoping/UltimateAIScopingWizard";
import UnifiedProjectManager from "@/components/tracker/UnifiedProjectManager";
import TrackerDashboard from "@/components/tracker/TrackerDashboard";
import ImplementationCenter from "@/pages/ImplementationCenter";
import SitesTable from "@/components/sites/SitesTable";
import { useSites } from "@/hooks/useSites";
import { useTrackerData } from "@/hooks/useTrackerData";

const UnifiedProjectHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCreationWizard, setActiveCreationWizard] = useState<'none' | 'scoping' | 'creation'>('none');

  const { data: sites = [] } = useSites();
  const { stats, milestones, loading } = useTrackerData();

  const hubSections = [
    {
      id: 'create',
      title: 'Create Project',
      description: 'Start new NAC deployment projects with AI-powered scoping',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      action: () => setActiveCreationWizard('scoping')
    },
    {
      id: 'manage',
      title: 'Manage Projects',
      description: 'Unified project management and tracking',
      icon: Settings,
      color: 'from-blue-500 to-cyan-600',
      action: () => setActiveTab('projects')
    },
    {
      id: 'implement',
      title: 'Implementation',
      description: 'Deploy and monitor NAC implementations',
      icon: Rocket,
      color: 'from-green-500 to-emerald-600',
      action: () => setActiveTab('implementation')
    },
    {
      id: 'sites',
      title: 'Sites Management',
      description: 'Manage deployment sites and tracking',
      icon: MapPin,
      color: 'from-orange-500 to-red-600',
      action: () => setActiveTab('sites')
    }
  ];

  const quickStats = [
    { label: 'Active Projects', value: stats?.total_sites || 0, icon: Building2 },
    { label: 'Total Sites', value: sites.length, icon: MapPin },
    { label: 'Completion Rate', value: `${Math.round(stats?.overall_completion || 0)}%`, icon: CheckSquare },
    { label: 'Active Implementations', value: stats?.in_progress_sites || 0, icon: Activity }
  ];

  if (activeCreationWizard !== 'none') {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCreationWizard('none')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Hub
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {activeCreationWizard === 'scoping' ? 'AI-Powered Project Scoping' : 'Project Creation Wizard'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeCreationWizard === 'scoping' ? (
                  <UltimateAIScopingWizard 
                    onComplete={() => setActiveCreationWizard('none')}
                    onSave={() => setActiveCreationWizard('none')}
                    onCancel={() => setActiveCreationWizard('none')}
                  />
                ) : (
                  <ProjectCreationWizard />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🚀 Unified Project Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Project <span className="bg-gradient-primary bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Comprehensive hub for NAC project creation, tracking, implementation, and site management. 
              Streamline your entire deployment lifecycle from scoping to go-live.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Hub Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {hubSections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Card 
                      key={section.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                      onClick={section.action}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Project Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { project: "Healthcare NAC Deploy", activity: "Phase 2 Testing", time: "2 hours ago" },
                        { project: "Financial Services", activity: "Go-Live Scheduled", time: "4 hours ago" },
                        { project: "Manufacturing Sites", activity: "Site 3 Configured", time: "6 hours ago" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{item.project}</div>
                            <div className="text-xs text-muted-foreground">{item.activity}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{item.time}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Upcoming Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {milestones?.slice(0, 3).map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{milestone.title}</div>
                            <div className="text-xs text-muted-foreground">{milestone.description}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">{milestone.date}</Badge>
                        </div>
                      )) || (
                        <div className="text-center text-muted-foreground">No upcoming milestones</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <UnifiedProjectManager />
            </TabsContent>

            <TabsContent value="implementation" className="space-y-6">
              <ImplementationCenter />
            </TabsContent>

            <TabsContent value="sites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Sites Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SitesTable 
                    sites={sites}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onViewDetails={() => {}}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-6">
              {!loading && stats && (
                <TrackerDashboard
                  sites={[]}
                  stats={stats}
                  milestones={milestones || []}
                  onCreateSite={() => {}}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProjectHub;