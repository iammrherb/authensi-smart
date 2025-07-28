import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  Beaker,
  Rocket,
  Target,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle2
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  type: 'poc' | 'deployment' | 'migration';
  status: 'planning' | 'poc-active' | 'poc-complete' | 'deployment-ready' | 'in-progress' | 'complete' | 'delayed' | 'on-hold';
  stage: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  sites: ProjectSite[];
  budget?: number;
  assignedTeam: string[];
  lastUpdate: string;
  pocDetails?: {
    objectives: string[];
    successCriteria: string[];
    endpoints: number;
    duration: string;
    validationStatus: 'pending' | 'in-progress' | 'passed' | 'failed';
  };
  deploymentDetails?: {
    phases: DeploymentPhase[];
    rolloutStrategy: string;
    totalEndpoints: number;
  };
}

interface ProjectSite {
  id: string;
  name: string;
  location: string;
  status: 'planned' | 'in-progress' | 'complete' | 'delayed';
  progress: number;
  endpoints: number;
  phase: string;
}

interface DeploymentPhase {
  name: string;
  status: 'not-started' | 'in-progress' | 'complete' | 'delayed';
  startDate?: string;
  endDate?: string;
  sites: string[];
  dependencies: string[];
}

const UnifiedProjectTracker = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Mock data initialization
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "proj-001",
        name: "Healthcare NAC Implementation",
        client: "Regional Medical Center",
        type: "deployment",
        status: "in-progress",
        stage: "Phase 2 - Configuration",
        priority: "high",
        progress: 65,
        startDate: "2024-01-15",
        targetEndDate: "2024-06-30",
        budget: 250000,
        assignedTeam: ["John Smith", "Sarah Johnson", "Mike Wilson"],
        lastUpdate: "2024-01-20",
        sites: [
          {
            id: "site-001",
            name: "Main Hospital",
            location: "Downtown Campus",
            status: "in-progress",
            progress: 80,
            endpoints: 500,
            phase: "Configuration"
          },
          {
            id: "site-002",
            name: "Outpatient Clinic",
            location: "West Campus",
            status: "planned",
            progress: 0,
            endpoints: 150,
            phase: "Planning"
          }
        ],
        deploymentDetails: {
          phases: [
            {
              name: "Discovery & Planning",
              status: "complete",
              startDate: "2024-01-15",
              endDate: "2024-02-01",
              sites: ["site-001"],
              dependencies: []
            },
            {
              name: "Configuration & Testing",
              status: "in-progress",
              startDate: "2024-02-01",
              endDate: "2024-03-15",
              sites: ["site-001"],
              dependencies: ["Discovery & Planning"]
            }
          ],
          rolloutStrategy: "Phased by Site Priority",
          totalEndpoints: 650
        }
      },
      {
        id: "proj-002",
        name: "Manufacturing Security POC",
        client: "Industrial Systems Corp",
        type: "poc",
        status: "poc-active",
        stage: "Implementation & Testing",
        priority: "high",
        progress: 45,
        startDate: "2024-02-01",
        targetEndDate: "2024-03-15",
        assignedTeam: ["David Brown", "Lisa Chen"],
        lastUpdate: "2024-02-05",
        sites: [
          {
            id: "site-003",
            name: "Production Floor A",
            location: "Detroit Plant",
            status: "in-progress",
            progress: 45,
            endpoints: 200,
            phase: "POC Testing"
          }
        ],
        pocDetails: {
          objectives: [
            "Validate OT network security",
            "Test industrial device authentication",
            "Verify zero-downtime deployment",
            "Demonstrate compliance capabilities"
          ],
          successCriteria: [
            "100% device visibility",
            "Zero production impact",
            "90% policy automation",
            "Compliance validation"
          ],
          endpoints: 200,
          duration: "6 weeks",
          validationStatus: "in-progress"
        }
      },
      {
        id: "proj-003",
        name: "Financial Services Migration",
        client: "Regional Bank Network",
        type: "migration",
        status: "planning",
        stage: "Assessment & Planning",
        priority: "medium",
        progress: 15,
        startDate: "2024-03-01",
        targetEndDate: "2024-09-30",
        budget: 450000,
        assignedTeam: ["Robert Taylor", "Jennifer Lee"],
        lastUpdate: "2024-02-28",
        sites: [
          {
            id: "site-004",
            name: "Headquarters",
            location: "Financial District",
            status: "planned",
            progress: 0,
            endpoints: 800,
            phase: "Assessment"
          },
          {
            id: "site-005",
            name: "Branch Office 1",
            location: "Midtown",
            status: "planned",
            progress: 0,
            endpoints: 120,
            phase: "Assessment"
          }
        ]
      }
    ];
    setProjects(mockProjects);
  }, []);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const stats = {
    total: projects.length,
    poc: projects.filter(p => p.type === 'poc').length,
    deployment: projects.filter(p => p.type === 'deployment').length,
    migration: projects.filter(p => p.type === 'migration').length,
    active: projects.filter(p => ['poc-active', 'in-progress'].includes(p.status)).length,
    complete: projects.filter(p => p.status === 'complete').length,
    delayed: projects.filter(p => p.status === 'delayed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'poc-active':
      case 'in-progress': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'on-hold': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'poc-complete': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      default: return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poc': return <Beaker className="w-4 h-4" />;
      case 'deployment': return <Rocket className="w-4 h-4" />;
      case 'migration': return <RotateCcw className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'poc-active':
      case 'in-progress': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'on-hold': return <PauseCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleCreateProject = () => {
    toast.success("Project creation wizard would open here");
    setIsCreateDialogOpen(false);
  };

  const handleProjectAction = (action: string, projectId: string) => {
    toast.success(`${action} action triggered for project ${projectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent mb-2">
                Unified Project Command Center
              </CardTitle>
              <p className="text-muted-foreground">
                Comprehensive POC, Deployment, and Migration Management Platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="glow" className="text-sm px-3 py-1">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                Live Dashboard
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Project Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poc">Proof of Concept</SelectItem>
                          <SelectItem value="deployment">New Deployment</SelectItem>
                          <SelectItem value="migration">System Migration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Project Name</Label>
                      <Input placeholder="Enter project name" />
                    </div>
                    <div>
                      <Label>Client Organization</Label>
                      <Input placeholder="Enter client name" />
                    </div>
                    <Button onClick={handleCreateProject} className="w-full">
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.poc}</div>
            <div className="text-sm text-muted-foreground">POCs</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.deployment}</div>
            <div className="text-sm text-muted-foreground">Deployments</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.migration}</div>
            <div className="text-sm text-muted-foreground">Migrations</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.delayed}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.filter(p => ['poc-active', 'in-progress'].includes(p.status)).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(project.type)}
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.stage}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{project.progress}%</div>
                        <Progress value={project.progress} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Healthcare POC Completion</div>
                        <div className="text-sm text-muted-foreground">Due in 3 days</div>
                      </div>
                    </div>
                    <Badge variant="outline">High Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Rocket className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="font-medium">Manufacturing Phase 2 Start</div>
                        <div className="text-sm text-muted-foreground">Starting next week</div>
                      </div>
                    </div>
                    <Badge variant="outline">Medium Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] bg-background/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="poc">POC</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="migration">Migration</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-background/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="poc-active">POC Active</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(project.type)}
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        {project.status.replace('-', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{project.type.toUpperCase()}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div>Stage: {project.stage}</div>
                    <div>Target: {new Date(project.targetEndDate).toLocaleDateString()}</div>
                    <div>Sites: {project.sites.length}</div>
                  </div>

                  {/* POC Details */}
                  {project.type === 'poc' && project.pocDetails && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">POC Progress</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {project.pocDetails.endpoints} endpoints • {project.pocDetails.duration}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => handleProjectAction('manage', project.id)}
                    >
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
              <p className="text-muted-foreground">
                Manage project workflows, stages, and automation rules
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Workflow management interface coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <p className="text-muted-foreground">
                Advanced analytics and reporting dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedProject.type)}
                {selectedProject.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <div className="text-sm">{selectedProject.client}</div>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="text-sm capitalize">{selectedProject.type}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Progress</Label>
                  <div className="text-sm">{selectedProject.progress}%</div>
                </div>
              </div>

              {selectedProject.pocDetails && (
                <div>
                  <Label>POC Objectives</Label>
                  <ul className="text-sm mt-2 space-y-1">
                    {selectedProject.pocDetails.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <Label>Sites ({selectedProject.sites.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {selectedProject.sites.map((site) => (
                    <div key={site.id} className="bg-accent/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground">{site.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{site.progress}%</div>
                          <Progress value={site.progress} className="w-16 h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UnifiedProjectTracker;