import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, CheckCircle, Clock, AlertTriangle, Calendar, Users, FileText, 
  BarChart3, Settings, Target, TrendingUp, Download, ExternalLink, Plus,
  Rocket, Shield, Network, Database, Monitor, Zap, FileCheck, MapPin,
  ClipboardList, CheckCircle2, BookOpen, Link2, Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ImplementationSite {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'planning' | 'in-progress' | 'testing' | 'completed' | 'on-hold';
  progress: number;
  assignedEngineer: string;
  devices: Array<{
    type: string;
    count: number;
    status: 'pending' | 'configured' | 'testing' | 'deployed';
  }>;
  useCases: string[];
  deploymentDate: string;
  completionDate?: string;
  issues: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    status: 'open' | 'in-progress' | 'resolved';
    assignedTo: string;
    createdDate: string;
  }>;
}

interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  actualDuration?: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  startDate?: string;
  endDate?: string;
  prerequisites: string[];
  deliverables: string[];
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    targetDate: string;
    actualDate?: string;
    status: 'pending' | 'completed' | 'overdue';
  }>;
  checklistItems: Array<{
    id: string;
    task: string;
    completed: boolean;
    assignedTo: string;
    dueDate: string;
    documentationLinks: Array<{
      title: string;
      url: string;
      type: 'portnox' | 'vendor' | 'internal' | 'external';
    }>;
  }>;
}

interface ImplementationProject {
  id: string;
  name: string;
  client: string;
  overallProgress: number;
  status: 'planning' | 'in-progress' | 'testing' | 'deployment' | 'completed' | 'on-hold';
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  projectManager: string;
  technicalLead: string;
  sites: ImplementationSite[];
  phases: DeploymentPhase[];
  recommendations: Array<{
    id: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
    rationale: string;
    implementationStatus: 'pending' | 'approved' | 'implemented' | 'rejected';
    createdBy: string;
    createdDate: string;
  }>;
  timeline: Array<{
    id: string;
    date: string;
    event: string;
    type: 'milestone' | 'issue' | 'update' | 'completion';
    description: string;
  }>;
}

const ComprehensiveImplementationTracker: React.FC = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<ImplementationProject | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Sample project data
  const [project] = useState<ImplementationProject>({
    id: '1',
    name: 'Enterprise NAC Deployment - TechCorp',
    client: 'TechCorp Industries',
    overallProgress: 65,
    status: 'in-progress',
    startDate: '2024-01-15',
    targetEndDate: '2024-06-30',
    projectManager: 'Sarah Johnson',
    technicalLead: 'Michael Chen',
    sites: [
      {
        id: 'site-1',
        name: 'Headquarters Campus',
        location: 'New York, NY',
        type: 'Corporate HQ',
        status: 'in-progress',
        progress: 75,
        assignedEngineer: 'Alex Rodriguez',
        devices: [
          { type: 'Cisco Catalyst 9300', count: 24, status: 'configured' },
          { type: 'Aruba 6300M', count: 12, status: 'testing' },
          { type: 'FortiGate 600E', count: 2, status: 'deployed' }
        ],
        useCases: ['Employee Access', 'Guest Network', 'IoT Device Management'],
        deploymentDate: '2024-02-01',
        issues: [
          {
            id: 'issue-1',
            severity: 'medium',
            description: 'RADIUS authentication latency observed',
            status: 'in-progress',
            assignedTo: 'Alex Rodriguez',
            createdDate: '2024-03-15'
          }
        ]
      },
      {
        id: 'site-2',
        name: 'Manufacturing Plant',
        location: 'Detroit, MI',
        type: 'Manufacturing',
        status: 'planning',
        progress: 25,
        assignedEngineer: 'Jennifer Park',
        devices: [
          { type: 'Cisco IE 4000', count: 18, status: 'pending' },
          { type: 'Fortinet FortiSwitch', count: 8, status: 'pending' }
        ],
        useCases: ['OT Network Security', 'Asset Management', 'Contractor Access'],
        deploymentDate: '2024-04-15',
        issues: []
      }
    ],
    phases: [
      {
        id: 'phase-1',
        name: 'Planning & Design',
        description: 'Initial planning, network assessment, and solution design',
        order: 1,
        estimatedDuration: 4,
        actualDuration: 4,
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        prerequisites: ['Network documentation', 'Stakeholder approval'],
        deliverables: ['Network design document', 'Implementation plan'],
        milestones: [
          {
            id: 'milestone-1',
            name: 'Design Approval',
            description: 'Final design approved by stakeholders',
            targetDate: '2024-02-10',
            actualDate: '2024-02-12',
            status: 'completed'
          }
        ],
        checklistItems: [
          {
            id: 'check-1',
            task: 'Complete network discovery and assessment',
            completed: true,
            assignedTo: 'Michael Chen',
            dueDate: '2024-01-25',
            documentationLinks: [
              {
                title: 'Portnox Network Discovery Guide',
                url: 'https://docs.portnox.com/network-discovery',
                type: 'portnox'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Infrastructure Preparation',
        description: 'Prepare network infrastructure and install core components',
        order: 2,
        estimatedDuration: 6,
        actualDuration: 7,
        status: 'completed',
        startDate: '2024-02-15',
        endDate: '2024-03-30',
        prerequisites: ['Approved design', 'Hardware procurement'],
        deliverables: ['Configured infrastructure', 'Testing results'],
        milestones: [
          {
            id: 'milestone-2',
            name: 'Core Infrastructure Ready',
            description: 'All core network components configured',
            targetDate: '2024-03-15',
            actualDate: '2024-03-20',
            status: 'completed'
          }
        ],
        checklistItems: [
          {
            id: 'check-2',
            task: 'Install and configure Portnox CORE',
            completed: true,
            assignedTo: 'Alex Rodriguez',
            dueDate: '2024-02-28',
            documentationLinks: [
              {
                title: 'Portnox CORE Installation Guide',
                url: 'https://docs.portnox.com/core-installation',
                type: 'portnox'
              },
              {
                title: 'VMware vSphere Deployment Guide',
                url: 'https://docs.vmware.com/en/VMware-vSphere/',
                type: 'vendor'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Site Deployment',
        description: 'Deploy solution to individual sites',
        order: 3,
        estimatedDuration: 8,
        status: 'in-progress',
        startDate: '2024-03-30',
        prerequisites: ['Infrastructure ready', 'Site surveys complete'],
        deliverables: ['Site deployments', 'User training'],
        milestones: [
          {
            id: 'milestone-3',
            name: 'HQ Deployment Complete',
            description: 'Headquarters site fully deployed and operational',
            targetDate: '2024-05-15',
            status: 'pending'
          }
        ],
        checklistItems: [
          {
            id: 'check-3',
            task: 'Configure switch authentication',
            completed: false,
            assignedTo: 'Alex Rodriguez',
            dueDate: '2024-04-10',
            documentationLinks: [
              {
                title: 'Cisco Switch 802.1X Configuration',
                url: 'https://docs.portnox.com/cisco-switch-config',
                type: 'portnox'
              },
              {
                title: 'Cisco IOS Configuration Guide',
                url: 'https://cisco.com/c/en/us/support/docs/',
                type: 'vendor'
              }
            ]
          }
        ]
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        category: 'Security',
        priority: 'high',
        recommendation: 'Implement network segmentation for IoT devices',
        rationale: 'Reduces attack surface and improves network security posture',
        implementationStatus: 'approved',
        createdBy: 'Michael Chen',
        createdDate: '2024-03-01'
      }
    ],
    timeline: [
      {
        id: 'timeline-1',
        date: '2024-01-15',
        event: 'Project Kickoff',
        type: 'milestone',
        description: 'Project officially started with stakeholder meeting'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in-progress': return 'bg-blue-500';
      case 'testing': return 'bg-amber-500';
      case 'planning': return 'bg-purple-500';
      case 'on-hold': return 'bg-gray-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const generateProfessionalReport = () => {
    const reportData = {
      project,
      generatedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      totalSites: project.sites.length,
      completedSites: project.sites.filter(s => s.status === 'completed').length,
      totalPhases: project.phases.length,
      completedPhases: project.phases.filter(p => p.status === 'completed').length,
      openIssues: project.sites.reduce((acc, site) => acc + site.issues.filter(i => i.status !== 'resolved').length, 0)
    };

    toast({
      title: "Professional Report Generated",
      description: "Implementation report has been generated successfully",
    });

    setShowReportDialog(true);
  };

  useEffect(() => {
    setSelectedProject(project);
  }, [project]);

  if (!selectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
          <p className="text-muted-foreground mt-2">Client: {selectedProject.client}</p>
          <div className="flex gap-2 mt-3">
            <Badge className={getStatusColor(selectedProject.status)}>
              {selectedProject.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {selectedProject.overallProgress}% Complete
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateProfessionalReport} className="gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={selectedProject.overallProgress} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-2xl">{selectedProject.sites.length}</div>
                <div className="text-muted-foreground">Total Sites</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-2xl">
                  {selectedProject.sites.filter(s => s.status === 'completed').length}
                </div>
                <div className="text-muted-foreground">Completed Sites</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-2xl">{selectedProject.phases.length}</div>
                <div className="text-muted-foreground">Total Phases</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-2xl">
                  {selectedProject.phases.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-muted-foreground">Completed Phases</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Project Manager</Label>
                    <p className="font-medium">{selectedProject.projectManager}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Technical Lead</Label>
                    <p className="font-medium">{selectedProject.technicalLead}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Start Date</Label>
                    <p className="font-medium">{format(new Date(selectedProject.startDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Target End Date</Label>
                    <p className="font-medium">{format(new Date(selectedProject.targetEndDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {selectedProject.timeline.slice(-5).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(event.date), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <div className="grid gap-6">
            {selectedProject.sites.map((site) => (
              <Card key={site.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {site.name}
                      </CardTitle>
                      <p className="text-muted-foreground">{site.location} • {site.type}</p>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{site.progress}%</span>
                    </div>
                    <Progress value={site.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Assigned Engineer</Label>
                      <p className="font-medium">{site.assignedEngineer}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Deployment Date</Label>
                      <p className="font-medium">{format(new Date(site.deploymentDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Use Cases</Label>
                      <p className="font-medium">{site.useCases.length} configured</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground mb-2 block">Device Inventory</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {site.devices.map((device, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium">{device.type}</div>
                          <div className="text-sm text-muted-foreground">
                            Count: {device.count} • Status: {device.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {site.issues.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Open Issues</Label>
                      <div className="space-y-2">
                        {site.issues.map((issue) => (
                          <div key={issue.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{issue.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  Assigned to: {issue.assignedTo}
                                </p>
                              </div>
                              <Badge className={getPriorityColor(issue.severity)}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          <div className="space-y-6">
            {selectedProject.phases.map((phase) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Phase {phase.order}: {phase.name}
                      </CardTitle>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Estimated Duration</Label>
                      <p className="font-medium">{phase.estimatedDuration} weeks</p>
                    </div>
                    {phase.actualDuration && (
                      <div>
                        <Label className="text-muted-foreground">Actual Duration</Label>
                        <p className="font-medium">{phase.actualDuration} weeks</p>
                      </div>
                    )}
                    {phase.startDate && (
                      <div>
                        <Label className="text-muted-foreground">Start Date</Label>
                        <p className="font-medium">{format(new Date(phase.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                    )}
                    {phase.endDate && (
                      <div>
                        <Label className="text-muted-foreground">End Date</Label>
                        <p className="font-medium">{format(new Date(phase.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Prerequisites</Label>
                      <ul className="text-sm space-y-1">
                        {phase.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Deliverables</Label>
                      <ul className="text-sm space-y-1">
                        {phase.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FileCheck className="h-3 w-3 text-blue-500" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-muted-foreground mb-2 block">Milestones</Label>
                      <div className="space-y-2">
                        {phase.milestones.map((milestone) => (
                          <div key={milestone.id} className="text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`h-3 w-3 ${
                                milestone.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <span className="font-medium">{milestone.name}</span>
                            </div>
                            <p className="text-muted-foreground text-xs ml-5">
                              Target: {format(new Date(milestone.targetDate), 'MMM dd')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklists" className="space-y-6">
          <div className="space-y-6">
            {selectedProject.phases.map((phase) => (
              <Card key={phase.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    {phase.name} - Implementation Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phase.checklistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={item.completed}
                            className="mt-1"
                            disabled
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.task}</p>
                                <p className="text-sm text-muted-foreground">
                                  Assigned to: {item.assignedTo} • Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                                </p>
                              </div>
                              <Badge variant={item.completed ? "default" : "secondary"}>
                                {item.completed ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                            
                            {item.documentationLinks.length > 0 && (
                              <div className="mt-3">
                                <Label className="text-sm text-muted-foreground mb-2 block">
                                  Documentation Links
                                </Label>
                                <div className="space-y-2">
                                  {item.documentationLinks.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center gap-1">
                                        {link.type === 'portnox' && <BookOpen className="h-3 w-3 text-blue-600" />}
                                        {link.type === 'vendor' && <Settings className="h-3 w-3 text-green-600" />}
                                        {link.type === 'internal' && <FileText className="h-3 w-3 text-purple-600" />}
                                        {link.type === 'external' && <ExternalLink className="h-3 w-3 text-orange-600" />}
                                        <Badge 
                                          variant="outline" 
                                          className="text-xs"
                                        >
                                          {link.type}
                                        </Badge>
                                      </div>
                                      <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        {link.title}
                                        <Link2 className="h-3 w-3" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {selectedProject.recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                        <Badge variant={rec.implementationStatus === 'implemented' ? "default" : "secondary"}>
                          {rec.implementationStatus}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{rec.recommendation}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{rec.rationale}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        By {rec.createdBy} on {format(new Date(rec.createdDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {selectedProject.timeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                      <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.event}</h4>
                            <p className="text-muted-foreground text-sm">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {event.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Professional Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Implementation Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
              <p className="text-lg text-muted-foreground">{selectedProject.client}</p>
              <p className="text-muted-foreground">
                Generated on {format(new Date(), 'MMMM dd, yyyy \'at\' HH:mm:ss')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Project Information</h3>
                <p><strong>Project Manager:</strong> {selectedProject.projectManager}</p>
                <p><strong>Technical Lead:</strong> {selectedProject.technicalLead}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Overall Progress:</strong> {selectedProject.overallProgress}%</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Timeline</h3>
                <p><strong>Start Date:</strong> {format(new Date(selectedProject.startDate), 'MMMM dd, yyyy')}</p>
                <p><strong>Target End Date:</strong> {format(new Date(selectedProject.targetEndDate), 'MMMM dd, yyyy')}</p>
                <p><strong>Total Sites:</strong> {selectedProject.sites.length}</p>
                <p><strong>Completed Sites:</strong> {selectedProject.sites.filter(s => s.status === 'completed').length}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Site Status Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Site Name</th>
                      <th className="border p-2 text-left">Location</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left">Progress</th>
                      <th className="border p-2 text-left">Engineer</th>
                      <th className="border p-2 text-left">Devices</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.sites.map((site) => (
                      <tr key={site.id}>
                        <td className="border p-2">{site.name}</td>
                        <td className="border p-2">{site.location}</td>
                        <td className="border p-2 capitalize">{site.status.replace('-', ' ')}</td>
                        <td className="border p-2">{site.progress}%</td>
                        <td className="border p-2">{site.assignedEngineer}</td>
                        <td className="border p-2">{site.devices.length} configured</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Phase Progress</h3>
              <div className="space-y-3">
                {selectedProject.phases.map((phase) => (
                  <div key={phase.id} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Phase {phase.order}: {phase.name}</h4>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{phase.description}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <strong>Duration:</strong> {phase.estimatedDuration} weeks
                        {phase.actualDuration && ` (actual: ${phase.actualDuration})`}
                      </div>
                      <div>
                        <strong>Milestones:</strong> {phase.milestones.length}
                      </div>
                      <div>
                        <strong>Checklist Items:</strong> {phase.checklistItems.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Print/Save Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComprehensiveImplementationTracker;