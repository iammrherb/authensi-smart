import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, CheckCircle, AlertTriangle, Target, Users, 
  TrendingUp, BarChart3, Play, Pause, Settings, FileText,
  Network, Shield, Database, Activity, Globe, Building2
} from 'lucide-react';
import { useProjectUseCases } from '@/hooks/useUseCases';
import { useProjectTestCases } from '@/hooks/useTestCases';
// Removed useProjectSites import

interface ProjectPhase {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  start_date?: string;
  end_date?: string;
  estimated_duration: number;
  dependencies: string[];
  deliverables: string[];
  assigned_team: string[];
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'completed' | 'at-risk';
  description: string;
  phase_id: string;
}

interface ProjectDetails {
  id: string;
  name: string;
  customer: string;
  type: "POC" | "Pilot" | "Production";
  status: "Planning" | "Active" | "Completed" | "On-Hold";
  start_date: string;
  target_date: string;
  current_phase: string;
  overall_progress: number;
  budget?: number;
  spent_budget?: number;
  team_size: number;
  sites_count: number;
  endpoints_count: number;
}

interface EnhancedProjectTrackerProps {
  project: ProjectDetails;
  onEdit?: () => void;
  onViewSites?: () => void;
  onViewTimeline?: () => void;
}

const EnhancedProjectTracker: React.FC<EnhancedProjectTrackerProps> = ({
  project,
  onEdit,
  onViewSites,
  onViewTimeline
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: projectUseCases = [] } = useProjectUseCases(project.id);
  const { data: projectTestCases = [] } = useProjectTestCases(project.id);
  // Removed useProjectSites to avoid type conflicts

  // Sample phases data (in real implementation, this would come from API)
  const phases: ProjectPhase[] = [
    {
      id: "discovery",
      name: "Discovery & Planning",
      status: "completed",
      progress: 100,
      start_date: "2025-01-01",
      end_date: "2025-01-14",
      estimated_duration: 14,
      dependencies: [],
      deliverables: ["Network Assessment", "Requirements Document", "Project Plan"],
      assigned_team: ["Lead Architect", "Network Engineer"]
    },
    {
      id: "design",
      name: "Design & Architecture",
      status: "in-progress",
      progress: 75,
      start_date: "2025-01-15",
      estimated_duration: 21,
      dependencies: ["discovery"],
      deliverables: ["Technical Design", "Security Policies", "Integration Plan"],
      assigned_team: ["Lead Architect", "Security Specialist"]
    },
    {
      id: "implementation",
      name: "Implementation",
      status: "not-started",
      progress: 0,
      estimated_duration: 35,
      dependencies: ["design"],
      deliverables: ["NAC Deployment", "Policy Configuration", "Testing Results"],
      assigned_team: ["Implementation Engineer", "Network Engineer"]
    },
    {
      id: "testing",
      name: "Testing & Validation",
      status: "not-started",
      progress: 0,
      estimated_duration: 14,
      dependencies: ["implementation"],
      deliverables: ["Test Results", "Performance Report", "Security Validation"],
      assigned_team: ["QA Engineer", "Security Specialist"]
    },
    {
      id: "golive",
      name: "Go-Live & Support",
      status: "not-started",
      progress: 0,
      estimated_duration: 7,
      dependencies: ["testing"],
      deliverables: ["Production Deployment", "Documentation", "Team Training"],
      assigned_team: ["Implementation Engineer", "Support Team"]
    }
  ];

  const milestones: Milestone[] = [
    {
      id: "m1",
      name: "Requirements Sign-off",
      date: "2025-01-14",
      status: "completed",
      description: "Stakeholder approval of project requirements",
      phase_id: "discovery"
    },
    {
      id: "m2", 
      name: "Technical Design Review",
      date: "2025-02-05",
      status: "pending",
      description: "Architecture and design approval",
      phase_id: "design"
    },
    {
      id: "m3",
      name: "Pilot Site Go-Live",
      date: "2025-03-15",
      status: "pending",
      description: "First site production deployment",
      phase_id: "implementation"
    },
    {
      id: "m4",
      name: "Full Production Rollout",
      date: "2025-04-30",
      status: "pending",
      description: "All sites operational",
      phase_id: "golive"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'default';
      case 'blocked': return 'destructive';
      case 'at-risk': return 'warning';
      default: return 'secondary';
    }
  };

  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case 'discovery': return <FileText className="h-4 w-4" />;
      case 'design': return <Network className="h-4 w-4" />;
      case 'implementation': return <Settings className="h-4 w-4" />;
      case 'testing': return <Shield className="h-4 w-4" />;
      case 'golive': return <Play className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const calculateOverallHealth = () => {
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    const blockedPhases = phases.filter(p => p.status === 'blocked').length;
    const atRiskMilestones = milestones.filter(m => m.status === 'at-risk').length;
    
    if (blockedPhases > 0 || atRiskMilestones > 1) return 'at-risk';
    if (project.overall_progress > 75) return 'excellent';
    if (project.overall_progress > 50) return 'good';
    return 'fair';
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Project Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Project Health</p>
                <p className="font-semibold capitalize">{calculateOverallHealth()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="font-semibold">{project.overall_progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-semibold">{project.team_size} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sites/Endpoints</p>
                <p className="font-semibold">{project.sites_count}/{project.endpoints_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Phase Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Phase: {phases.find(p => p.status === 'in-progress')?.name || 'Planning'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {phases.filter(p => p.status === 'in-progress').map(phase => (
            <div key={phase.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{phase.name}</span>
                <Badge variant={getStatusColor(phase.status) as any}>{phase.status}</Badge>
              </div>
              <Progress value={phase.progress} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Deliverables</p>
                  <ul className="list-disc list-inside">
                    {phase.deliverables.map((deliverable, index) => (
                      <li key={index}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned Team</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {phase.assigned_team.map((member, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{member}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p>{phase.estimated_duration} days</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.filter(m => m.status !== 'completed').slice(0, 3).map(milestone => (
              <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getPhaseIcon(milestone.phase_id)}
                  <div>
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{milestone.date}</p>
                  <Badge variant={getStatusColor(milestone.status) as any} className="text-xs">
                    {milestone.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPhasesTab = () => (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <Card key={phase.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getPhaseIcon(phase.id)}
                Phase {index + 1}: {phase.name}
              </CardTitle>
              <Badge variant={getStatusColor(phase.status) as any}>{phase.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{phase.progress}%</span>
            </div>
            <Progress value={phase.progress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Deliverables</p>
                <ul className="space-y-1">
                  {phase.deliverables.map((deliverable, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Team Assignment</p>
                <div className="flex flex-wrap gap-1">
                  {phase.assigned_team.map((member, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{member}</Badge>
                  ))}
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    Duration: {phase.estimated_duration} days
                  </p>
                  {phase.start_date && (
                    <p className="text-sm text-muted-foreground">
                      Started: {phase.start_date}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {phase.dependencies.length > 0 && (
              <div>
                <p className="text-sm font-medium">Dependencies</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {phase.dependencies.map((dep, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {phases.find(p => p.id === dep)?.name || dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMetricsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Use Cases Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectUseCases.slice(0, 5).map((useCase: any) => (
              <div key={useCase.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{useCase.use_case_library?.name}</p>
                  <p className="text-xs text-muted-foreground">{useCase.priority} priority</p>
                </div>
                <Badge variant={getStatusColor(useCase.status) as any} className="text-xs">
                  {useCase.status}
                </Badge>
              </div>
            ))}
            {projectUseCases.length === 0 && (
              <p className="text-sm text-muted-foreground">No use cases assigned yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectTestCases.slice(0, 5).map((testCase: any) => (
              <div key={testCase.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{testCase.test_case_library?.name}</p>
                  <p className="text-xs text-muted-foreground">{testCase.test_case_library?.category}</p>
                </div>
                <Badge variant={getStatusColor(testCase.status) as any} className="text-xs">
                  {testCase.status}
                </Badge>
              </div>
            ))}
            {projectTestCases.length === 0 && (
              <p className="text-sm text-muted-foreground">No test cases defined yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          {project.budget ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Utilization</span>
                <span className="text-sm font-medium">
                  ${project.spent_budget?.toLocaleString() || 0} / ${project.budget.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={((project.spent_budget || 0) / project.budget) * 100} 
                className="h-2" 
              />
              <div className="text-xs text-muted-foreground">
                {((project.spent_budget || 0) / project.budget * 100).toFixed(1)}% utilized
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No budget information available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Start Date</span>
              <span className="text-sm font-medium">{project.start_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Target Date</span>
              <span className="text-sm font-medium">{project.target_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Phase</span>
              <span className="text-sm font-medium">{project.current_phase}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Project Timeline</p>
              <Progress value={project.overall_progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {project.overall_progress}% complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.customer} • {project.type} Project</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getStatusColor(project.status.toLowerCase()) as any}>
            {project.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="phases" className="mt-6">
          {renderPhasesTab()}
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          {renderMetricsTab()}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onViewSites}>
              <Building2 className="h-4 w-4 mr-1" />
              View Sites ({project.sites_count})
            </Button>
            <Button variant="outline" size="sm" onClick={onViewTimeline}>
              <Calendar className="h-4 w-4 mr-1" />
              Project Timeline
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Team Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProjectTracker;