import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Target, Settings, Rocket, MapPin, Activity, Brain, CheckSquare, Users, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import existing components
import RobustProjectCreationWizard from "@/components/comprehensive/RobustProjectCreationWizard";
import UltimateAIScopingWizard from "@/components/scoping/UltimateAIScopingWizard";
import ProjectManagementHub from "@/components/management/ProjectManagementHub";
import TrackerDashboard from "@/components/tracker/TrackerDashboard";
import SitesTable from "@/components/sites/SitesTable";
import { useSites } from "@/hooks/useSites";
import { useTrackerData } from "@/hooks/useTrackerData";

const UnifiedProjectHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCreationWizard, setActiveCreationWizard] = useState<'none' | 'scoping' | 'creation'>('none');
  const [scopingData, setScopingData] = useState<any>(null);

  const { data: sites = [] } = useSites();
  const { stats, milestones, loading } = useTrackerData();

  const hubSections = [
    {
      id: 'create',
      title: 'Create Project',
      description: 'AI-integrated project creation with automatic site generation',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      action: () => setActiveCreationWizard('creation')
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
                {activeCreationWizard === 'scoping' ? 'AI-Powered Project Scoping' : 'Intelligent Project Creation'}
              </CardTitle>
              </CardHeader>
              <CardContent>
                {activeCreationWizard === 'scoping' ? (
                  <UltimateAIScopingWizard 
                    onComplete={(sessionId, data) => {
                      setScopingData(data);
                      setActiveCreationWizard('creation');
                    }}
                    onSave={(sessionId, data) => {
                      setScopingData(data);
                      setActiveCreationWizard('creation');
                    }}
                    onCancel={() => setActiveCreationWizard('none')}
                  />
                ) : (
                  <RobustProjectCreationWizard 
                    scopingData={activeCreationWizard === 'creation' ? scopingData : undefined}
                    onSave={(projectData) => {
                      console.log('Project created:', projectData);
                      toast.success('Project created successfully!');
                      setActiveCreationWizard('none');
                    }}
                    onCancel={() => setActiveCreationWizard('none')}
                  />
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
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
              <ProjectManagementHub />
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

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProjectHub;