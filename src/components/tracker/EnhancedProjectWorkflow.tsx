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
  CheckCircle2,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Network,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  GitBranch,
  Activity
} from "lucide-react";

// Enhanced project interface with comprehensive workflow stages
interface Project {
  id: string;
  name: string;
  client: string;
  type: 'scoping' | 'poc' | 'deployment' | 'migration' | 'support';
  status: string;
  stage: string;
  subStage?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  healthScore: number;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budget?: number;
  spent?: number;
  team: TeamMember[];
  stakeholders: Stakeholder[];
  lastUpdate: string;
  nextMilestone?: string;
  blockers: Blocker[];
  workflowData: WorkflowStage[];
  scopingDetails?: ScopingDetails;
  pocDetails?: POCDetails;
  deploymentDetails?: DeploymentDetails;
  migrationDetails?: MigrationDetails;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  allocation: number;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  contact: string;
  engagement: 'high' | 'medium' | 'low';
}

interface Blocker {
  id: string;
  type: 'technical' | 'resource' | 'approval' | 'external';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  assignedTo?: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'resolved';
}

interface WorkflowStage {
  id: string;
  name: string;
  phase: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'skipped';
  progress: number;
  startDate?: string;
  endDate?: string;
  estimatedDays: number;
  actualDays?: number;
  dependencies: string[];
  deliverables: Deliverable[];
  tasks: Task[];
}

interface Deliverable {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  assignedTo?: string;
  dueDate?: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  estimatedHours: number;
  actualHours?: number;
  priority: 'high' | 'medium' | 'low';
}

interface ScopingDetails {
  questionnaires: { id: string; name: string; status: string; }[];
  requirements: { id: string; category: string; status: string; }[];
  useCases: { id: string; name: string; priority: string; }[];
  riskAssessment: { level: string; factors: string[]; };
  recommendations: string[];
}

interface POCDetails {
  objectives: string[];
  successCriteria: string[];
  endpoints: number;
  duration: string;
  testScenarios: { id: string; name: string; status: string; }[];
  results: { metric: string; target: number; actual?: number; }[];
  validationStatus: 'pending' | 'in-progress' | 'passed' | 'failed';
  nextSteps: string[];
}

interface DeploymentDetails {
  phases: { name: string; status: string; sites: string[]; }[];
  rolloutStrategy: string;
  totalEndpoints: number;
  configTemplates: { id: string; name: string; status: string; }[];
  testResults: { phase: string; passed: number; failed: number; }[];
  goLiveChecklist: { item: string; status: string; }[];
}

interface MigrationDetails {
  currentSystem: string;
  migrationStrategy: string;
  dataMapping: { source: string; target: string; status: string; }[];
  rollbackPlan: string;
  cutoverPlan: { step: string; duration: string; owner: string; }[];
  riskMitigation: { risk: string; mitigation: string; }[];
}

const EnhancedProjectWorkflow = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    team: "all"
  });

  // Comprehensive workflow definitions
  const workflowTemplates = {
    scoping: [
      { name: "Initial Discovery", phase: "discovery", estimatedDays: 3 },
      { name: "Stakeholder Interviews", phase: "discovery", estimatedDays: 5 },
      { name: "Environment Assessment", phase: "assessment", estimatedDays: 7 },
      { name: "Requirements Gathering", phase: "requirements", estimatedDays: 10 },
      { name: "Use Case Analysis", phase: "analysis", estimatedDays: 5 },
      { name: "Risk Assessment", phase: "analysis", estimatedDays: 3 },
      { name: "Solution Design", phase: "design", estimatedDays: 7 },
      { name: "Recommendations Report", phase: "documentation", estimatedDays: 3 },
      { name: "Client Presentation", phase: "delivery", estimatedDays: 2 }
    ],
    poc: [
      { name: "POC Planning", phase: "planning", estimatedDays: 3 },
      { name: "Lab Setup", phase: "setup", estimatedDays: 5 },
      { name: "Configuration", phase: "configuration", estimatedDays: 7 },
      { name: "Initial Testing", phase: "testing", estimatedDays: 5 },
      { name: "Use Case Validation", phase: "validation", estimatedDays: 10 },
      { name: "Performance Testing", phase: "testing", estimatedDays: 5 },
      { name: "Security Validation", phase: "validation", estimatedDays: 3 },
      { name: "Results Analysis", phase: "analysis", estimatedDays: 3 },
      { name: "POC Report", phase: "documentation", estimatedDays: 2 },
      { name: "Go/No-Go Decision", phase: "decision", estimatedDays: 1 }
    ],
    deployment: [
      { name: "Deployment Planning", phase: "planning", estimatedDays: 7 },
      { name: "Infrastructure Prep", phase: "preparation", estimatedDays: 10 },
      { name: "Pilot Site Setup", phase: "pilot", estimatedDays: 14 },
      { name: "Pilot Testing", phase: "pilot", estimatedDays: 7 },
      { name: "Pilot Validation", phase: "pilot", estimatedDays: 3 },
      { name: "Phase 1 Rollout", phase: "rollout", estimatedDays: 21 },
      { name: "Phase 2 Rollout", phase: "rollout", estimatedDays: 21 },
      { name: "Final Rollout", phase: "rollout", estimatedDays: 21 },
      { name: "Stabilization", phase: "stabilization", estimatedDays: 14 },
      { name: "Handover", phase: "completion", estimatedDays: 5 }
    ]
  };

  // Mock data initialization
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "proj-001",
        name: "Global Bank NAC Deployment",
        client: "International Banking Corp",
        type: "deployment",
        status: "in-progress",
        stage: "Phase 2 - Rollout",
        subStage: "Core Infrastructure",
        priority: "critical",
        progress: 72,
        healthScore: 85,
        startDate: "2024-01-15",
        targetEndDate: "2024-06-30",
        budget: 850000,
        spent: 425000,
        team: [
          { id: "t1", name: "John Smith", role: "Project Manager", allocation: 100 },
          { id: "t2", name: "Sarah Johnson", role: "Lead Engineer", allocation: 100 },
          { id: "t3", name: "Mike Wilson", role: "Security Analyst", allocation: 75 }
        ],
        stakeholders: [
          { id: "s1", name: "David Brown", role: "CISO", contact: "david.brown@bank.com", engagement: "high" },
          { id: "s2", name: "Lisa Chen", role: "Network Manager", contact: "lisa.chen@bank.com", engagement: "medium" }
        ],
        lastUpdate: "2024-01-25",
        nextMilestone: "Phase 2 Completion - Feb 15",
        blockers: [
          {
            id: "b1",
            type: "approval",
            description: "Firewall change approval pending",
            severity: "medium",
            assignedTo: "t1",
            dueDate: "2024-02-01",
            status: "in-progress"
          }
        ],
        workflowData: [],
        deploymentDetails: {
          phases: [
            { name: "Discovery", status: "completed", sites: ["HQ", "Branch-A"] },
            { name: "Pilot", status: "completed", sites: ["HQ"] },
            { name: "Phase 1", status: "in-progress", sites: ["Branch-A", "Branch-B"] },
            { name: "Phase 2", status: "not-started", sites: ["Branch-C", "Branch-D"] }
          ],
          rolloutStrategy: "Phased by Risk Level",
          totalEndpoints: 2500,
          configTemplates: [
            { id: "ct1", name: "Switch Configuration", status: "approved" },
            { id: "ct2", name: "Firewall Rules", status: "pending" }
          ],
          testResults: [
            { phase: "Pilot", passed: 95, failed: 5 },
            { phase: "Phase 1", passed: 87, failed: 13 }
          ],
          goLiveChecklist: [
            { item: "Backup verification", status: "completed" },
            { item: "Change window approval", status: "pending" }
          ]
        }
      },
      {
        id: "proj-002",
        name: "Manufacturing Security Assessment",
        client: "Industrial Systems Corp",
        type: "scoping",
        status: "in-progress",
        stage: "Requirements Analysis",
        priority: "high",
        progress: 60,
        healthScore: 78,
        startDate: "2024-02-01",
        targetEndDate: "2024-03-15",
        team: [
          { id: "t4", name: "Robert Taylor", role: "Solutions Architect", allocation: 100 },
          { id: "t5", name: "Jennifer Lee", role: "Security Consultant", allocation: 80 }
        ],
        stakeholders: [
          { id: "s3", name: "Tom Wilson", role: "Plant Manager", contact: "tom.wilson@manufacturing.com", engagement: "high" }
        ],
        lastUpdate: "2024-02-10",
        nextMilestone: "Requirements Sign-off - Feb 20",
        blockers: [],
        workflowData: [],
        scopingDetails: {
          questionnaires: [
            { id: "q1", name: "Security Assessment", status: "completed" },
            { id: "q2", name: "Network Architecture", status: "in-progress" }
          ],
          requirements: [
            { id: "r1", category: "Authentication", status: "documented" },
            { id: "r2", category: "Authorization", status: "in-progress" }
          ],
          useCases: [
            { id: "u1", name: "Employee Access Control", priority: "high" },
            { id: "u2", name: "Guest Network Isolation", priority: "medium" }
          ],
          riskAssessment: {
            level: "medium",
            factors: ["Legacy systems", "Limited downtime windows"]
          },
          recommendations: [
            "Phased implementation approach",
            "Hybrid authentication strategy"
          ]
        }
      }
    ];
    setProjects(mockProjects);
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.client.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || project.type === filters.type;
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Statistics
  const stats = {
    total: projects.length,
    scoping: projects.filter(p => p.type === 'scoping').length,
    poc: projects.filter(p => p.type === 'poc').length,
    deployment: projects.filter(p => p.type === 'deployment').length,
    migration: projects.filter(p => p.type === 'migration').length,
    active: projects.filter(p => p.status.includes('progress')).length,
    completed: projects.filter(p => p.status === 'completed').length,
    critical: projects.filter(p => p.priority === 'critical').length,
    avgHealth: Math.round(projects.reduce((acc, p) => acc + (p.healthScore || 0), 0) / projects.length)
  };

  const getStatusColor = (status: string) => {
    if (status.includes('complete')) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (status.includes('progress')) return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
    if (status.includes('blocked') || status.includes('delayed')) return 'bg-red-500/20 text-red-700 border-red-500/30';
    if (status.includes('hold')) return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scoping': return <Search className="w-4 h-4" />;
      case 'poc': return <Beaker className="w-4 h-4" />;
      case 'deployment': return <Rocket className="w-4 h-4" />;
      case 'migration': return <RotateCcw className="w-4 h-4" />;
      case 'support': return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30 shadow-elevated">
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="animate-fade-in">
              <CardTitle className="text-4xl bg-gradient-primary bg-clip-text text-transparent mb-3">
                NAC Project Workflow Center
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Comprehensive project lifecycle management from scoping to deployment
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3">
                <Badge variant="glow" className="text-sm px-3 py-1">
                  <Activity className="w-3 h-3 mr-2 animate-pulse" />
                  Live Status
                </Badge>
                <Badge variant="outline" className="text-primary border-primary/30">
                  <Brain className="w-3 h-3 mr-2" />
                  AI-Enhanced
                </Badge>
              </div>
              <Button className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: "Total Projects", value: stats.total, icon: Target, color: "text-primary" },
          { label: "Scoping", value: stats.scoping, icon: Search, color: "text-blue-500" },
          { label: "POCs", value: stats.poc, icon: Beaker, color: "text-purple-500" },
          { label: "Deployments", value: stats.deployment, icon: Rocket, color: "text-green-500" },
          { label: "Migrations", value: stats.migration, icon: RotateCcw, color: "text-orange-500" },
          { label: "Active", value: stats.active, icon: Activity, color: "text-cyan-500" },
          { label: "Critical", value: stats.critical, icon: AlertTriangle, color: "text-red-500" },
          { label: "Health Score", value: `${stats.avgHealth}%`, icon: Shield, color: getHealthColor(stats.avgHealth) }
        ].map((stat, index) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, clients, or team members..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scoping">Scoping</SelectItem>
                  <SelectItem value="poc">POC</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="migration">Migration</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg bg-primary/10 ${getStatusColor(project.status).split(' ')[1]}`}>
                    {getTypeIcon(project.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{project.client}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                  <div className={`text-sm font-medium ${getHealthColor(project.healthScore)}`}>
                    ♡ {project.healthScore}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stage:</span>
                  <span className="font-medium">{project.stage}</span>
                </div>
                {project.subStage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sub-stage:</span>
                    <span className="text-xs text-muted-foreground">{project.subStage}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                {project.blockers.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{project.blockers.length} blocker(s)</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team:</span>
                  <span>{project.team.length} members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Date:</span>
                  <span>{new Date(project.targetEndDate).toLocaleDateString()}</span>
                </div>
                {project.nextMilestone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next:</span>
                    <span className="text-xs">{project.nextMilestone}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(project.lastUpdate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getTypeIcon(selectedProject.type)}
                {selectedProject.name}
                <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                  {selectedProject.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedProject.progress}%</div>
                    <div className="text-sm text-muted-foreground">Overall Progress</div>
                    <Progress value={selectedProject.progress} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getHealthColor(selectedProject.healthScore)}`}>
                      {selectedProject.healthScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">{selectedProject.team.length}</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </CardContent>
                </Card>
              </div>

              {/* Team & Stakeholders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Team</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProject.team.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                        <Badge variant="outline">{member.allocation}%</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Stakeholders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProject.stakeholders.map((stakeholder) => (
                      <div key={stakeholder.id} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <div>
                          <div className="font-medium">{stakeholder.name}</div>
                          <div className="text-sm text-muted-foreground">{stakeholder.role}</div>
                          <div className="text-xs text-muted-foreground">{stakeholder.contact}</div>
                        </div>
                        <Badge variant="outline" className={
                          stakeholder.engagement === 'high' ? 'text-green-600 border-green-600' :
                          stakeholder.engagement === 'medium' ? 'text-yellow-600 border-yellow-600' :
                          'text-red-600 border-red-600'
                        }>
                          {stakeholder.engagement}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Blockers */}
              {selectedProject.blockers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Active Blockers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProject.blockers.map((blocker) => (
                      <div key={blocker.id} className="p-4 border border-amber-200 bg-amber-50/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={
                            blocker.severity === 'critical' ? 'text-red-600 border-red-600' :
                            blocker.severity === 'high' ? 'text-orange-600 border-orange-600' :
                            'text-yellow-600 border-yellow-600'
                          }>
                            {blocker.severity} {blocker.type}
                          </Badge>
                          <Badge variant="outline" className={
                            blocker.status === 'open' ? 'text-red-600 border-red-600' :
                            blocker.status === 'in-progress' ? 'text-blue-600 border-blue-600' :
                            'text-green-600 border-green-600'
                          }>
                            {blocker.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{blocker.description}</p>
                        {blocker.dueDate && (
                          <div className="text-xs text-muted-foreground">
                            Due: {new Date(blocker.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedProjectWorkflow;