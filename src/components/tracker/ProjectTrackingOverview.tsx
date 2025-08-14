import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, Activity, MapPin, FileText, CheckSquare, 
  Calendar, Target, Users, Clock, AlertTriangle 
} from "lucide-react";

interface ProjectTrackingOverviewProps {
  stats: {
    totalProjects: number;
    activeSites: number;
    completedSites: number;
    overallProgress: number;
    atRiskProjects: number;
  };
  onNavigateToTab: (tab: string) => void;
}

const ProjectTrackingOverview: React.FC<ProjectTrackingOverviewProps> = ({
  stats,
  onNavigateToTab
}) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Active deployments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.activeSites}</div>
            <p className="text-xs text-muted-foreground">
              In implementation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.overallProgress}%</div>
            <Progress value={stats.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.atRiskProjects}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => onNavigateToTab('implementation')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Implementation Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor deployment phases, track progress, and manage implementation milestones 
              across all your Portnox projects.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Progress Tracking</Badge>
              <Badge variant="secondary">Phase Management</Badge>
              <Badge variant="secondary">Milestones</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => onNavigateToTab('sites')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Sites Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Centralized site management with inventory tracking, deployment configurations, 
              and site-specific progress monitoring.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Site Inventory</Badge>
              <Badge variant="secondary">Configuration</Badge>
              <Badge variant="secondary">Status Tracking</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => onNavigateToTab('reports')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Professional Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate comprehensive deployment reports with Portnox documentation, 
              vendor links, and professional formatting.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Export Ready</Badge>
              <Badge variant="secondary">Documentation</Badge>
              <Badge variant="secondary">Analytics</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => onNavigateToTab('checklists')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-orange-500" />
              Implementation Checklists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage detailed implementation checklists with prerequisites, 
              documentation links, and progress tracking.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Task Management</Badge>
              <Badge variant="secondary">Prerequisites</Badge>
              <Badge variant="secondary">Documentation</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => onNavigateToTab('timeline')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              Timeline Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visual timeline management with milestone tracking, deadline monitoring, 
              and project phase coordination.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Timeline View</Badge>
              <Badge variant="secondary">Milestones</Badge>
              <Badge variant="secondary">Deadlines</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              Team Collaboration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Collaborative features for team coordination, role assignment, 
              and stakeholder communication (Coming Soon).
            </p>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => onNavigateToTab('sites')}>
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Add Site</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => onNavigateToTab('reports')}>
              <FileText className="h-5 w-5" />
              <span className="text-xs">Generate Report</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => onNavigateToTab('checklists')}>
              <CheckSquare className="h-5 w-5" />
              <span className="text-xs">Create Checklist</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => onNavigateToTab('timeline')}>
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Set Milestone</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTrackingOverview;