import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, Clock, AlertTriangle, Users, Target, Settings,
  Calendar, FileCheck, Brain, Zap, TrendingUp, Activity
} from 'lucide-react';

interface ProjectTrackingDashboardProps {
  projectId: string;
  projectData: any;
}

const ProjectTrackingDashboard: React.FC<ProjectTrackingDashboardProps> = ({
  projectId,
  projectData
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const phases = [
    { name: "Discovery & Assessment", status: "completed", progress: 100, startDate: "2024-01-15", endDate: "2024-02-01" },
    { name: "Design & Architecture", status: "in-progress", progress: 65, startDate: "2024-02-01", endDate: "2024-02-20" },
    { name: "Pilot Implementation", status: "pending", progress: 0, startDate: "2024-02-20", endDate: "2024-03-15" },
    { name: "Full Deployment", status: "pending", progress: 0, startDate: "2024-03-15", endDate: "2024-04-30" },
    { name: "Go-Live & Support", status: "pending", progress: 0, startDate: "2024-04-30", endDate: "2024-05-15" }
  ];

  const milestones = [
    { name: "Requirements Finalized", date: "2024-02-01", status: "completed" },
    { name: "Architecture Approved", date: "2024-02-15", status: "in-progress" },
    { name: "Pilot Site Ready", date: "2024-03-01", status: "pending" },
    { name: "Production Ready", date: "2024-04-15", status: "pending" },
    { name: "Project Handover", date: "2024-05-15", status: "pending" }
  ];

  const successCriteria = [
    { criteria: "Authentication Success Rate > 99%", current: "98.2%", status: "warning" },
    { criteria: "Average Auth Time < 30 seconds", current: "12s", status: "success" },
    { criteria: "Policy Compliance > 95%", current: "96.8%", status: "success" },
    { criteria: "Incident Response < 15 minutes", current: "8m", status: "success" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "success": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{projectData?.name || 'Project Tracking Dashboard'}</h1>
          <p className="text-muted-foreground">Comprehensive project monitoring and validation</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {projectData?.current_phase || 'Design'}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {projectData?.progress_percentage || 0}% Complete
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{projectData?.progress_percentage || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={projectData?.progress_percentage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Phase</p>
                <p className="text-xl font-bold">{projectData?.current_phase || 'Design'}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sites</p>
                <p className="text-2xl font-bold">{projectData?.total_sites || 0}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Endpoints</p>
                <p className="text-2xl font-bold">{projectData?.total_endpoints || 0}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="criteria">Success Criteria</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Deployment Approach</span>
                    <Badge variant="secondary">Implemented</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vendor Integration</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case Validation</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Test Case Execution</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Project Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Run Validation Checks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Milestone Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Team Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Requirements validation completed</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Architecture design review in progress</p>
                    <p className="text-sm text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Vendor integration dependency identified</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(phase.status)}
                        <h3 className="font-medium">{phase.name}</h3>
                      </div>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <Progress value={phase.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Start: {phase.startDate}</span>
                      <span>End: {phase.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Criteria Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successCriteria.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <span className="font-medium">{item.criteria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{item.current}</span>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'success' ? 'Met' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(milestone.status)}
                      <div>
                        <h3 className="font-medium">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">Due: {milestone.date}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation & Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertDescription>
                  Comprehensive validation framework with automated testing and manual verification points.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Automated Tests</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Authentication Flow</span>
                      <Badge variant="secondary">Passed</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Enforcement</span>
                      <Badge variant="secondary">Passed</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Tests</span>
                      <Badge variant="outline">Running</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Manual Validation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>User Acceptance</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Review</span>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Documentation</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTrackingDashboard;