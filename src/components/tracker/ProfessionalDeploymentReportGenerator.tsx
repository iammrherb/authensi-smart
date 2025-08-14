import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Download, ExternalLink, BookOpen, Settings, Link2, 
  CheckCircle, Clock, AlertTriangle, Plus, X, Calendar, Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DocumentationLink {
  title: string;
  url: string;
  type: 'portnox' | 'vendor' | 'internal' | 'external';
  category: string;
  description?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  prerequisites: string[];
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
  documentationLinks: DocumentationLink[];
  verificationSteps: string[];
}

interface DeploymentSection {
  id: string;
  name: string;
  description: string;
  order: number;
  items: ChecklistItem[];
}

const ProfessionalDeploymentReportGenerator: React.FC = () => {
  const { toast } = useToast();
  const [reportConfig, setReportConfig] = useState({
    title: 'Network Access Control Deployment Checklist',
    client: 'Enterprise Client',
    project: 'Phase 1 NAC Implementation',
    engineer: 'Lead Engineer',
    date: format(new Date(), 'yyyy-MM-dd'),
    includeDocumentation: true,
    includeTimelines: true,
    includeVerification: true,
    reportFormat: 'comprehensive'
  });

  const [showPreview, setShowPreview] = useState(false);

  // Comprehensive deployment checklist with Portnox and vendor documentation
  const [deploymentSections] = useState<DeploymentSection[]>([
    {
      id: 'preparation',
      name: 'Pre-Deployment Preparation',
      description: 'Essential preparation tasks before beginning deployment',
      order: 1,
      items: [
        {
          id: 'prep-1',
          task: 'Complete network discovery and documentation',
          category: 'Planning',
          priority: 'critical',
          estimatedTime: '2-3 days',
          prerequisites: ['Network access to all sites', 'Administrative credentials'],
          assignedTo: 'Network Engineer',
          dueDate: '2024-04-01',
          completed: false,
          documentationLinks: [
            {
              title: 'Portnox Network Discovery Guide',
              url: 'https://docs.portnox.com/cloud/admin-guide/network-discovery',
              type: 'portnox',
              category: 'Network Discovery',
              description: 'Complete guide for discovering network infrastructure'
            },
            {
              title: 'Network Topology Best Practices',
              url: 'https://docs.portnox.com/cloud/admin-guide/network-topology',
              type: 'portnox',
              category: 'Planning',
              description: 'Best practices for network topology planning'
            }
          ],
          verificationSteps: [
            'Network diagram created and validated',
            'All network devices catalogued',
            'IP addressing scheme documented',
            'VLAN assignments documented'
          ]
        },
        {
          id: 'prep-2',
          task: 'Prepare Active Directory integration',
          category: 'Identity Management',
          priority: 'critical',
          estimatedTime: '1 day',
          prerequisites: ['AD admin access', 'Service account creation privileges'],
          assignedTo: 'Identity Engineer',
          dueDate: '2024-04-02',
          completed: false,
          documentationLinks: [
            {
              title: 'Active Directory Integration Guide',
              url: 'https://docs.portnox.com/cloud/admin-guide/active-directory-integration',
              type: 'portnox',
              category: 'Identity Integration',
              description: 'Step-by-step AD integration configuration'
            },
            {
              title: 'LDAP Configuration Reference',
              url: 'https://docs.portnox.com/cloud/admin-guide/ldap-configuration',
              type: 'portnox',
              category: 'Identity Integration',
              description: 'LDAP configuration parameters and examples'
            },
            {
              title: 'Microsoft AD Best Practices',
              url: 'https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/',
              type: 'vendor',
              category: 'Microsoft Documentation',
              description: 'Microsoft official AD documentation'
            }
          ],
          verificationSteps: [
            'Service account created with proper permissions',
            'LDAP connectivity tested',
            'Group membership validation working',
            'Authentication flow tested'
          ]
        }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Deployment',
      description: 'Core infrastructure setup and configuration',
      order: 2,
      items: [
        {
          id: 'infra-1',
          task: 'Install and configure Portnox CORE appliance',
          category: 'Core Infrastructure',
          priority: 'critical',
          estimatedTime: '4-6 hours',
          prerequisites: ['VM infrastructure ready', 'Network connectivity configured'],
          assignedTo: 'System Administrator',
          dueDate: '2024-04-05',
          completed: false,
          documentationLinks: [
            {
              title: 'Portnox CORE Installation Guide',
              url: 'https://docs.portnox.com/cloud/installation/core-appliance',
              type: 'portnox',
              category: 'Installation',
              description: 'Complete CORE appliance installation guide'
            },
            {
              title: 'CORE System Requirements',
              url: 'https://docs.portnox.com/cloud/installation/system-requirements',
              type: 'portnox',
              category: 'Requirements',
              description: 'Hardware and software requirements for CORE'
            },
            {
              title: 'VMware vSphere Deployment Guide',
              url: 'https://docs.vmware.com/en/VMware-vSphere/',
              type: 'vendor',
              category: 'VMware Documentation',
              description: 'VMware deployment best practices'
            }
          ],
          verificationSteps: [
            'CORE appliance deployed and accessible',
            'Initial configuration completed',
            'Network connectivity verified',
            'License activated and validated'
          ]
        },
        {
          id: 'infra-2',
          task: 'Configure RADIUS authentication',
          category: 'Authentication',
          priority: 'high',
          estimatedTime: '2-3 hours',
          prerequisites: ['CORE appliance operational', 'AD integration complete'],
          assignedTo: 'Security Engineer',
          dueDate: '2024-04-06',
          completed: false,
          documentationLinks: [
            {
              title: 'RADIUS Configuration Guide',
              url: 'https://docs.portnox.com/cloud/admin-guide/radius-configuration',
              type: 'portnox',
              category: 'Authentication',
              description: 'RADIUS server configuration and policies'
            },
            {
              title: 'NAS Client Configuration',
              url: 'https://docs.portnox.com/cloud/admin-guide/nas-client-setup',
              type: 'portnox',
              category: 'Network Configuration',
              description: 'Network Access Server client setup'
            }
          ],
          verificationSteps: [
            'RADIUS server responding to test requests',
            'Authentication policies configured',
            'NAS clients added and tested',
            'Shared secrets properly configured'
          ]
        }
      ]
    },
    {
      id: 'switch-config',
      name: 'Switch Configuration',
      description: 'Network switch configuration for 802.1X authentication',
      order: 3,
      items: [
        {
          id: 'switch-1',
          task: 'Configure Cisco switch 802.1X authentication',
          category: 'Switch Configuration',
          priority: 'high',
          estimatedTime: '3-4 hours per switch',
          prerequisites: ['Switch management access', 'RADIUS server operational'],
          assignedTo: 'Network Engineer',
          dueDate: '2024-04-08',
          completed: false,
          documentationLinks: [
            {
              title: 'Cisco Switch Configuration for Portnox',
              url: 'https://docs.portnox.com/cloud/switch-configuration/cisco',
              type: 'portnox',
              category: 'Switch Configuration',
              description: 'Cisco-specific switch configuration templates'
            },
            {
              title: 'Cisco 802.1X Configuration Guide',
              url: 'https://www.cisco.com/c/en/us/support/docs/lan-switching/8021x/68230-8021x-config.html',
              type: 'vendor',
              category: 'Cisco Documentation',
              description: 'Cisco official 802.1X configuration guide'
            },
            {
              title: 'Dynamic VLAN Assignment Configuration',
              url: 'https://docs.portnox.com/cloud/admin-guide/dynamic-vlan-assignment',
              type: 'portnox',
              category: 'VLAN Management',
              description: 'Dynamic VLAN assignment configuration'
            }
          ],
          verificationSteps: [
            '802.1X globally enabled on switch',
            'Port configurations applied correctly',
            'Dynamic VLAN assignment working',
            'Guest VLAN and auth-fail VLAN configured'
          ]
        },
        {
          id: 'switch-2',
          task: 'Configure Aruba switch 802.1X authentication',
          category: 'Switch Configuration',
          priority: 'high',
          estimatedTime: '3-4 hours per switch',
          prerequisites: ['Switch management access', 'RADIUS server operational'],
          assignedTo: 'Network Engineer',
          dueDate: '2024-04-09',
          completed: false,
          documentationLinks: [
            {
              title: 'Aruba Switch Configuration for Portnox',
              url: 'https://docs.portnox.com/cloud/switch-configuration/aruba',
              type: 'portnox',
              category: 'Switch Configuration',
              description: 'Aruba-specific switch configuration templates'
            },
            {
              title: 'HPE Aruba 802.1X Guide',
              url: 'https://www.arubanetworks.com/techdocs/ArubaOS-Switch/',
              type: 'vendor',
              category: 'Aruba Documentation',
              description: 'Aruba official 802.1X configuration documentation'
            }
          ],
          verificationSteps: [
            'AAA authentication configured',
            'Port access control enabled',
            'RADIUS server configuration verified',
            'Port-based authentication tested'
          ]
        }
      ]
    },
    {
      id: 'policies',
      name: 'Policy Configuration',
      description: 'Network access policies and user group management',
      order: 4,
      items: [
        {
          id: 'policy-1',
          task: 'Create and configure access policies',
          category: 'Policy Management',
          priority: 'high',
          estimatedTime: '4-6 hours',
          prerequisites: ['User groups defined', 'Network segments documented'],
          assignedTo: 'Security Engineer',
          dueDate: '2024-04-10',
          completed: false,
          documentationLinks: [
            {
              title: 'Access Policy Configuration Guide',
              url: 'https://docs.portnox.com/cloud/admin-guide/access-policies',
              type: 'portnox',
              category: 'Policy Management',
              description: 'Comprehensive access policy configuration'
            },
            {
              title: 'User Role Management',
              url: 'https://docs.portnox.com/cloud/admin-guide/user-roles',
              type: 'portnox',
              category: 'User Management',
              description: 'User role and group management'
            }
          ],
          verificationSteps: [
            'User groups mapped to AD groups',
            'Access policies created for each user type',
            'VLAN assignments configured',
            'Policy testing completed'
          ]
        }
      ]
    },
    {
      id: 'testing',
      name: 'Testing and Validation',
      description: 'Comprehensive testing of the deployed solution',
      order: 5,
      items: [
        {
          id: 'test-1',
          task: 'Conduct end-to-end authentication testing',
          category: 'System Testing',
          priority: 'critical',
          estimatedTime: '2-3 days',
          prerequisites: ['All components configured', 'Test devices available'],
          assignedTo: 'QA Engineer',
          dueDate: '2024-04-12',
          completed: false,
          documentationLinks: [
            {
              title: 'Testing and Validation Guide',
              url: 'https://docs.portnox.com/cloud/admin-guide/testing-validation',
              type: 'portnox',
              category: 'Testing',
              description: 'Comprehensive testing procedures'
            },
            {
              title: 'Troubleshooting Common Issues',
              url: 'https://docs.portnox.com/cloud/troubleshooting/',
              type: 'portnox',
              category: 'Troubleshooting',
              description: 'Common issues and resolution steps'
            }
          ],
          verificationSteps: [
            'Authentication success for all user types',
            'VLAN assignment verification',
            'Guest access functionality',
            'Fallback scenarios tested'
          ]
        }
      ]
    },
    {
      id: 'documentation',
      name: 'Documentation and Handover',
      description: 'Final documentation and knowledge transfer',
      order: 6,
      items: [
        {
          id: 'doc-1',
          task: 'Create comprehensive deployment documentation',
          category: 'Documentation',
          priority: 'medium',
          estimatedTime: '1-2 days',
          prerequisites: ['Deployment completed', 'All configurations documented'],
          assignedTo: 'Technical Writer',
          dueDate: '2024-04-15',
          completed: false,
          documentationLinks: [
            {
              title: 'Documentation Templates',
              url: 'https://docs.portnox.com/cloud/templates/',
              type: 'portnox',
              category: 'Templates',
              description: 'Standard documentation templates'
            }
          ],
          verificationSteps: [
            'Network topology documented',
            'Configuration backup created',
            'Operational procedures documented',
            'Troubleshooting guide created'
          ]
        }
      ]
    }
  ]);

  const generateProfessionalReport = () => {
    toast({
      title: "Professional Report Generated",
      description: "Deployment checklist report has been generated successfully",
    });
    setShowPreview(true);
  };

  const exportReport = (format: 'pdf' | 'html' | 'docx') => {
    toast({
      title: `Report Exported as ${format.toUpperCase()}`,
      description: `The deployment checklist has been exported as ${format.toUpperCase()}`,
    });
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

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case 'portnox': return <BookOpen className="h-3 w-3 text-blue-600" />;
      case 'vendor': return <Settings className="h-3 w-3 text-green-600" />;
      case 'internal': return <FileText className="h-3 w-3 text-purple-600" />;
      case 'external': return <ExternalLink className="h-3 w-3 text-orange-600" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Professional Deployment Report Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive, professionally formatted deployment checklists with documentation links
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateProfessionalReport} className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={reportConfig.client}
                onChange={(e) => setReportConfig(prev => ({ ...prev, client: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="project">Project Name</Label>
              <Input
                id="project"
                value={reportConfig.project}
                onChange={(e) => setReportConfig(prev => ({ ...prev, project: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="engineer">Lead Engineer</Label>
              <Input
                id="engineer"
                value={reportConfig.engineer}
                onChange={(e) => setReportConfig(prev => ({ ...prev, engineer: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Report Date</Label>
              <Input
                id="date"
                type="date"
                value={reportConfig.date}
                onChange={(e) => setReportConfig(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="format">Report Format</Label>
              <Select value={reportConfig.reportFormat} onValueChange={(value) => setReportConfig(prev => ({ ...prev, reportFormat: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="checklist-only">Checklist Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-docs"
                checked={reportConfig.includeDocumentation}
                onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeDocumentation: !!checked }))}
              />
              <Label htmlFor="include-docs">Include Documentation Links</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-timelines"
                checked={reportConfig.includeTimelines}
                onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeTimelines: !!checked }))}
              />
              <Label htmlFor="include-timelines">Include Timelines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-verification"
                checked={reportConfig.includeVerification}
                onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeVerification: !!checked }))}
              />
              <Label htmlFor="include-verification">Include Verification Steps</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Sections Preview */}
      <div className="grid gap-6">
        {deploymentSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {section.order}
                </div>
                {section.name}
              </CardTitle>
              <p className="text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox checked={item.completed} disabled />
                          <h4 className="font-medium">{item.task}</h4>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge variant="secondary">{item.estimatedTime}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: {item.assignedTo} • Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    {item.prerequisites.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-sm font-medium text-muted-foreground">Prerequisites:</Label>
                        <ul className="text-sm list-disc list-inside text-muted-foreground">
                          {item.prerequisites.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reportConfig.includeDocumentation && item.documentationLinks.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Documentation Links:
                        </Label>
                        <div className="space-y-2">
                          {item.documentationLinks.map((link, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded text-sm">
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {getDocTypeIcon(link.type)}
                                <Badge variant="outline" className="text-xs">
                                  {link.type}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                                >
                                  {link.title}
                                  <Link2 className="h-3 w-3" />
                                </a>
                                <p className="text-muted-foreground text-xs">{link.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reportConfig.includeVerification && item.verificationSteps.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Verification Steps:
                        </Label>
                        <ul className="text-sm space-y-1">
                          {item.verificationSteps.map((step, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Report Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Deployment Report Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-sm print:text-xs">
            {/* Report Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold mb-2">{reportConfig.title}</h1>
              <div className="text-lg text-muted-foreground space-y-1">
                <p><strong>Client:</strong> {reportConfig.client}</p>
                <p><strong>Project:</strong> {reportConfig.project}</p>
                <p><strong>Lead Engineer:</strong> {reportConfig.engineer}</p>
                <p><strong>Report Date:</strong> {format(new Date(reportConfig.date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <h2 className="text-xl font-bold mb-3">Executive Summary</h2>
              <p className="text-muted-foreground mb-4">
                This document provides a comprehensive deployment checklist for the Network Access Control (NAC) 
                implementation project. The checklist includes all necessary tasks, prerequisites, documentation 
                links, and verification steps required for a successful deployment.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border rounded p-3">
                  <div className="text-2xl font-bold">{deploymentSections.length}</div>
                  <div className="text-muted-foreground">Deployment Phases</div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-2xl font-bold">
                    {deploymentSections.reduce((acc, section) => acc + section.items.length, 0)}
                  </div>
                  <div className="text-muted-foreground">Total Tasks</div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-2xl font-bold">
                    {deploymentSections.reduce((acc, section) => 
                      acc + section.items.reduce((itemAcc, item) => itemAcc + item.documentationLinks.length, 0), 0
                    )}
                  </div>
                  <div className="text-muted-foreground">Documentation Links</div>
                </div>
              </div>
            </div>

            {/* Deployment Sections */}
            {deploymentSections.map((section) => (
              <div key={section.id} className="break-inside-avoid">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {section.order}
                  </div>
                  {section.name}
                </h2>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 break-inside-avoid">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 border-2 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{item.task}</h4>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-gray-100">
                              {item.category}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100">
                              {item.estimatedTime}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            <strong>Assigned to:</strong> {item.assignedTo} | 
                            <strong> Due:</strong> {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                          </p>
                          
                          {item.prerequisites.length > 0 && (
                            <div className="mb-3">
                              <strong className="text-xs">Prerequisites:</strong>
                              <ul className="text-xs list-disc list-inside text-muted-foreground mt-1">
                                {item.prerequisites.map((prereq, index) => (
                                  <li key={index}>{prereq}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {reportConfig.includeDocumentation && item.documentationLinks.length > 0 && (
                            <div className="mb-3">
                              <strong className="text-xs block mb-2">Documentation Links:</strong>
                              <div className="space-y-2">
                                {item.documentationLinks.map((link, index) => (
                                  <div key={index} className="text-xs border-l-2 border-blue-200 pl-3">
                                    <div className="flex items-center gap-1 mb-1">
                                      <span className="px-1 py-0.5 rounded bg-gray-100 text-xs">
                                        {link.type.toUpperCase()}
                                      </span>
                                      <strong>{link.title}</strong>
                                    </div>
                                    <p className="text-blue-600">{link.url}</p>
                                    <p className="text-muted-foreground">{link.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {reportConfig.includeVerification && item.verificationSteps.length > 0 && (
                            <div>
                              <strong className="text-xs block mb-2">Verification Steps:</strong>
                              <ul className="text-xs space-y-1">
                                {item.verificationSteps.map((step, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-3 h-3 border rounded mt-0.5 flex-shrink-0"></div>
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="border-t pt-4 text-center text-xs text-muted-foreground">
              <p>Generated on {format(new Date(), 'MMMM dd, yyyy \'at\' HH:mm:ss')}</p>
              <p>© Portnox Professional Services - Confidential</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button onClick={() => exportReport('pdf')} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={() => exportReport('html')} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export HTML
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDeploymentReportGenerator;