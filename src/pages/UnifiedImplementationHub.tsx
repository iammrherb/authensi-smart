import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, CheckCircle, Clock, Settings, FileText, Target, Users, AlertTriangle } from "lucide-react";
import ComprehensiveImplementationTracker from "@/components/tracker/ComprehensiveImplementationTracker";
import DeploymentPhases from "@/components/tracker/DeploymentPhases";
import ProfessionalDeploymentReportGenerator from "@/components/tracker/ProfessionalDeploymentReportGenerator";
import EnhancedChecklistManager from "@/components/tracker/EnhancedChecklistManager";

const UnifiedImplementationHub = () => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState("acme-corp-nac");
  
  // Mock project data
  const projects = [
    {
      id: "acme-corp-nac",
      name: "ACME Corp NAC Implementation",
      client: "ACME Corporation",
      status: "In Progress",
      phase: "Implementation",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-04-30",
      sites: 12,
      completedSites: 7,
      team: ["John Smith", "Sarah Connor", "Mike Johnson"],
      nextMilestone: "Phase 3 Testing",
      daysRemaining: 45
    },
    {
      id: "tech-startup-deployment",
      name: "Tech Startup Deployment",
      client: "StartupTech Inc",
      status: "Planning",
      phase: "Discovery",
      progress: 25,
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      sites: 3,
      completedSites: 0,
      team: ["Alice Brown", "Bob Wilson"],
      nextMilestone: "Requirements Review",
      daysRemaining: 78
    }
  ];

  const currentProject = projects.find(p => p.id === activeProject) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'at risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          {/* Project Overview Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentProject.name}</CardTitle>
                  <p className="text-muted-foreground">{currentProject.client}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(currentProject.status)}>
                    {currentProject.status}
                  </Badge>
                  <Badge variant="outline">{currentProject.phase}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    Overall Progress
                  </div>
                  <Progress value={currentProject.progress} className="h-2" />
                  <p className="text-sm font-medium">{currentProject.progress}%</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </div>
                  <p className="text-sm font-medium">{currentProject.startDate} - {currentProject.endDate}</p>
                  <p className="text-xs text-muted-foreground">{currentProject.daysRemaining} days remaining</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Sites
                  </div>
                  <p className="text-sm font-medium">{currentProject.completedSites}/{currentProject.sites} completed</p>
                  <Progress value={(currentProject.completedSites / currentProject.sites) * 100} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Team
                  </div>
                  <p className="text-sm font-medium">{currentProject.team.length} members</p>
                  <p className="text-xs text-muted-foreground">{currentProject.team.join(", ")}</p>
                </div>
              </div>

              {/* Next Milestone Alert */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Next Milestone: {currentProject.nextMilestone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Update Progress</p>
                    <p className="text-xs text-muted-foreground">Mark tasks complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule Meeting</p>
                    <p className="text-xs text-muted-foreground">Team sync or review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Generate Report</p>
                    <p className="text-xs text-muted-foreground">Status update</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Risk Assessment</p>
                    <p className="text-xs text-muted-foreground">Review blockers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
              <TabsTrigger value="checklists">Checklists</TabsTrigger>
              <TabsTrigger value="tracking">Detailed Tracking</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Phase: {currentProject.phase}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeploymentPhases />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tasks Completed</span>
                      <span className="font-medium">47/72</span>
                    </div>
                    <Progress value={65} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget Used</span>
                      <span className="font-medium">$125K / $200K</span>
                    </div>
                    <Progress value={62} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time Elapsed</span>
                      <span className="font-medium">55%</span>
                    </div>
                    <Progress value={55} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="phases">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Phases & Timeline</CardTitle>
                  <p className="text-muted-foreground">
                    Track progress through each phase of the implementation
                  </p>
                </CardHeader>
                <CardContent>
                  <DeploymentPhases />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklists">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Checklists</CardTitle>
                  <p className="text-muted-foreground">
                    Manage tasks, prerequisites, and validation steps
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedChecklistManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Project Tracking</CardTitle>
                  <p className="text-muted-foreground">
                    Detailed view of all project aspects including sites, timelines, and resources
                  </p>
                </CardHeader>
                <CardContent>
                  <ComprehensiveImplementationTracker />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Reports</CardTitle>
                  <p className="text-muted-foreground">
                    Generate comprehensive deployment and status reports
                  </p>
                </CardHeader>
                <CardContent>
                  <ProfessionalDeploymentReportGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnifiedImplementationHub;