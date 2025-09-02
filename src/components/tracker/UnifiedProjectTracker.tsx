import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Settings,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'on-hold';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  teamSize: number;
  budget: string;
  category: string;
}

interface WorkflowStage {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignee: string;
  dueDate: string;
  dependencies: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Network Infrastructure Upgrade',
    status: 'active',
    progress: 65,
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    teamSize: 8,
    budget: '$150,000',
    category: 'Infrastructure'
  },
  {
    id: '2',
    name: 'Security Implementation',
    status: 'planning',
    progress: 25,
    priority: 'high',
    startDate: '2024-03-01',
    endDate: '2024-07-31',
    teamSize: 5,
    budget: '$75,000',
    category: 'Security'
  },
  {
    id: '3',
    name: 'Wireless Network Deployment',
    status: 'completed',
    progress: 100,
    priority: 'medium',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    teamSize: 4,
    budget: '$45,000',
    category: 'Wireless'
  }
];

const mockWorkflowStages: WorkflowStage[] = [
  {
    id: '1',
    name: 'Requirements Analysis',
    status: 'completed',
    assignee: 'John Smith',
    dueDate: '2024-01-20',
    dependencies: []
  },
  {
    id: '2',
    name: 'Design & Planning',
    status: 'in-progress',
    assignee: 'Sarah Johnson',
    dueDate: '2024-02-15',
    dependencies: ['1']
  },
  {
    id: '3',
    name: 'Implementation',
    status: 'pending',
    assignee: 'Mike Davis',
    dueDate: '2024-03-01',
    dependencies: ['2']
  },
  {
    id: '4',
    name: 'Testing & Validation',
    status: 'pending',
    assignee: 'Lisa Wilson',
    dueDate: '2024-05-15',
    dependencies: ['3']
  }
];

const mockAutomationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto-assign tasks',
    trigger: 'New task created',
    action: 'Assign to next available team member',
    isActive: true
  },
  {
    id: '2',
    name: 'Progress notifications',
    trigger: 'Stage completed',
    action: 'Send notification to stakeholders',
    isActive: true
  },
  {
    id: '3',
    name: 'Budget alerts',
    trigger: 'Budget threshold reached',
    action: 'Send alert to project manager',
    isActive: false
  }
];

export const UnifiedProjectTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<string>('1');

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'on-hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageStatusColor = (status: WorkflowStage['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.reduce((sum, p) => sum + p.teamSize, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total team size</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Average progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}>
                    {project.priority}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">{project.progress}%</div>
                    <Progress value={project.progress} className="w-20" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkflow = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Management</h2>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configure Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkflowStages.map((stage) => (
                <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStageStatusColor(stage.status)}`} />
                    <div>
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to {stage.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Due: {stage.dueDate}</div>
                    <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'in-progress' ? 'secondary' : 'outline'}>
                      {stage.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAutomationRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      When: {rule.trigger} → Then: {rule.action}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Start Stage
            </Button>
            <Button variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause Workflow
            </Button>
            <Button variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Stop Workflow
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Assign Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Project Progress Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
            <div className="mt-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Team capacity used</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">On budget</p>
            <div className="mt-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Project Delivery Time</span>
              <Badge variant="default">-15% improvement</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Team Productivity</span>
              <Badge variant="default">+8% increase</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Quality Score</span>
              <Badge variant="default">94/100</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Customer Satisfaction</span>
              <Badge variant="default">4.8/5.0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Project "Security Implementation" moved to Design phase</span>
              <span className="text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>New team member assigned to Network Upgrade project</span>
              <span className="text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Budget alert triggered for Wireless Deployment</span>
              <span className="text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {renderWorkflow()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};