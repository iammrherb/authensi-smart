import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  Settings, 
  FileText, 
  Calendar,
  Plus,
  Edit3,
  Download,
  Upload,
  Target,
  BarChart3,
  Network,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentationCrawlerService } from '@/services/DocumentationCrawlerService';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  assignee?: string;
  dueDate?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  notes?: string;
  requirements?: string[];
  portnoxComponent?: string;
}

interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  startDate?: string;
  endDate?: string;
  progress: number;
  checklist: ChecklistItem[];
  sites: string[];
}

interface EnhancedImplementationTrackerProps {
  projectId?: string;
  siteId?: string;
  onUpdate?: (data: any) => void;
}

const EnhancedImplementationTracker: React.FC<EnhancedImplementationTrackerProps> = ({
  projectId,
  siteId,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [phases, setPhases] = useState<DeploymentPhase[]>([]);
  const [isEnrichingFromPortnox, setIsEnrichingFromPortnox] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState<Partial<ChecklistItem>>({});
  const [showCreateChecklist, setShowCreateChecklist] = useState(false);
  const { toast } = useToast();

  // Initialize with default phases and enhanced checklists
  useEffect(() => {
    initializeDefaultPhases();
  }, []);

  const initializeDefaultPhases = () => {
    const defaultPhases: DeploymentPhase[] = [
      {
        id: 'discovery',
        name: 'Discovery & Assessment',
        description: 'Network discovery, device inventory, and infrastructure assessment',
        status: 'not-started',
        progress: 0,
        sites: [],
        checklist: [
          {
            id: 'net-discovery',
            title: 'Network Infrastructure Discovery',
            description: 'Map network topology and identify network devices',
            status: 'not-started',
            category: 'Infrastructure',
            priority: 'high',
            portnoxComponent: 'AgentP',
            requirements: ['Network access', 'SNMP credentials', 'Switch access']
          },
          {
            id: 'device-inventory',
            title: 'Device Inventory Collection',
            description: 'Catalog all network devices and their capabilities',
            status: 'not-started',
            category: 'Documentation',
            priority: 'medium',
            requirements: ['Asset management system access', 'Device documentation']
          },
          {
            id: 'security-assessment',
            title: 'Current Security Posture Assessment',
            description: 'Evaluate existing security controls and policies',
            status: 'not-started',
            category: 'Security',
            priority: 'high',
            requirements: ['Security policy documentation', 'Compliance requirements']
          }
        ]
      },
      {
        id: 'planning',
        name: 'Design & Planning',
        description: 'Architecture design, policy framework, and implementation planning',
        status: 'not-started',
        progress: 0,
        sites: [],
        checklist: [
          {
            id: 'arch-design',
            title: 'Architecture Design Document',
            description: 'Create detailed Portnox architecture and integration plan',
            status: 'not-started',
            category: 'Documentation',
            priority: 'critical',
            portnoxComponent: 'Directory Broker',
            requirements: ['Network topology', 'Integration requirements', 'Scalability requirements']
          },
          {
            id: 'policy-framework',
            title: 'Policy Framework Design',
            description: 'Design NAC policies and enforcement rules',
            status: 'not-started',
            category: 'Policy',
            priority: 'high',
            requirements: ['Business requirements', 'Compliance frameworks', 'User roles']
          },
          {
            id: 'radius-design',
            title: 'RADIUS Integration Design',
            description: 'Plan Local Radius Proxy and TACACS integration',
            status: 'not-started',
            category: 'Integration',
            priority: 'high',
            portnoxComponent: 'Local Radius Proxy',
            requirements: ['Existing RADIUS servers', 'Authentication sources', 'Authorization policies']
          }
        ]
      },
      {
        id: 'deployment',
        name: 'Deployment & Configuration',
        description: 'Portnox installation, configuration, and initial testing',
        status: 'not-started',
        progress: 0,
        sites: [],
        checklist: [
          {
            id: 'portnox-install',
            title: 'Portnox CLEAR Installation',
            description: 'Install and configure Portnox CLEAR management platform',
            status: 'not-started',
            category: 'Installation',
            priority: 'critical',
            requirements: ['Server infrastructure', 'Database setup', 'SSL certificates']
          },
          {
            id: 'directory-broker-config',
            title: 'Directory Broker Configuration',
            description: 'Configure Directory Broker for authentication integration',
            status: 'not-started',
            category: 'Configuration',
            priority: 'high',
            portnoxComponent: 'Directory Broker',
            requirements: ['Active Directory access', 'LDAP configuration', 'Service accounts']
          },
          {
            id: 'tacacs-integration',
            title: 'Local TACACS Service Setup',
            description: 'Configure Local TACACS Service for device administration',
            status: 'not-started',
            category: 'Integration',
            priority: 'high',
            portnoxComponent: 'Local TACACS Service',
            requirements: ['Network device access', 'Administrative accounts', 'Authorization policies']
          }
        ]
      },
      {
        id: 'testing',
        name: 'Testing & Validation',
        description: 'Comprehensive testing of all NAC components and policies',
        status: 'not-started',
        progress: 0,
        sites: [],
        checklist: [
          {
            id: 'policy-testing',
            title: 'Policy Validation Testing',
            description: 'Test all authentication and authorization policies',
            status: 'not-started',
            category: 'Testing',
            priority: 'critical',
            requirements: ['Test user accounts', 'Test devices', 'Test scenarios']
          },
          {
            id: 'failover-testing',
            title: 'High Availability Testing',
            description: 'Test failover scenarios and redundancy mechanisms',
            status: 'not-started',
            category: 'Testing',
            priority: 'high',
            requirements: ['Backup systems', 'Failover procedures', 'Monitoring tools']
          }
        ]
      },
      {
        id: 'go-live',
        name: 'Go-Live & Monitoring',
        description: 'Production rollout, monitoring setup, and ongoing maintenance',
        status: 'not-started',
        progress: 0,
        sites: [],
        checklist: [
          {
            id: 'production-rollout',
            title: 'Production Rollout',
            description: 'Execute phased production deployment',
            status: 'not-started',
            category: 'Deployment',
            priority: 'critical',
            requirements: ['Rollback plan', 'Monitoring tools', 'Support team']
          },
          {
            id: 'monitoring-setup',
            title: 'Monitoring & Alerting Setup',
            description: 'Configure comprehensive monitoring and alerting',
            status: 'not-started',
            category: 'Monitoring',
            priority: 'high',
            requirements: ['SIEM integration', 'Alert thresholds', 'Escalation procedures']
          }
        ]
      }
    ];

    setPhases(defaultPhases);
  };

  const enrichChecklistsFromPortnoxDocs = async () => {
    setIsEnrichingFromPortnox(true);
    try {
      // Use DocumentationCrawlerService to get Portnox documentation
      const result = await DocumentationCrawlerService.crawlPortnoxDocsForVendors(
        selectedVendors.length > 0 ? selectedVendors : ['portnox'],
        20,
        {
          includePatterns: [
            '**/installation/**',
            '**/configuration/**',
            '**/deployment/**',
            '**/agentP/**',
            '**/directory-broker/**',
            '**/radius/**',
            '**/tacacs/**'
          ]
        }
      );

      if (result.success && result.data) {
        // Process crawled data to enhance checklists
        const enhancedPhases = phases.map(phase => ({
          ...phase,
          checklist: phase.checklist.map(item => ({
            ...item,
            requirements: [
              ...(item.requirements || []),
              ...extractRequirementsFromDocs(result.data, item.portnoxComponent)
            ]
          }))
        }));

        setPhases(enhancedPhases);
        toast({
          title: "Checklists Enhanced",
          description: "Requirements and prerequisites have been updated based on Portnox documentation."
        });
      } else if (result.missingSecret) {
        toast({
          title: "Firecrawl API Key Required",
          description: "Please configure the FIRECRAWL_API_KEY in Edge Function Secrets to enable documentation crawling.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error enriching checklists:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enrich checklists from Portnox documentation.",
        variant: "destructive"
      });
    } finally {
      setIsEnrichingFromPortnox(false);
    }
  };

  const extractRequirementsFromDocs = (crawlData: any, component?: string): string[] => {
    // Extract requirements from crawled documentation
    // This is a simplified implementation - would need more sophisticated parsing in production
    const requirements: string[] = [];
    
    if (crawlData.pages) {
      crawlData.pages.forEach((page: any) => {
        if (page.content && component) {
          const content = page.content.toLowerCase();
          if (content.includes(component.toLowerCase())) {
            // Extract requirements specific to the component
            if (content.includes('prerequisite')) {
              requirements.push(`${component} prerequisites (see Portnox docs)`);
            }
            if (content.includes('firewall')) {
              requirements.push(`Firewall requirements for ${component}`);
            }
            if (content.includes('port')) {
              requirements.push(`Network port configuration for ${component}`);
            }
          }
        }
      });
    }
    
    return requirements;
  };

  const createNewChecklistItem = () => {
    if (!newChecklistItem.title || !newChecklistItem.category) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and category for the checklist item.",
        variant: "destructive"
      });
      return;
    }

    const item: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newChecklistItem.title!,
      description: newChecklistItem.description,
      status: 'not-started',
      category: newChecklistItem.category!,
      priority: newChecklistItem.priority || 'medium',
      assignee: newChecklistItem.assignee,
      dueDate: newChecklistItem.dueDate,
      requirements: newChecklistItem.requirements || [],
      portnoxComponent: newChecklistItem.portnoxComponent
    };

    // Add to the first phase for now (could be made configurable)
    const updatedPhases = [...phases];
    if (updatedPhases.length > 0) {
      updatedPhases[0].checklist.push(item);
      setPhases(updatedPhases);
    }

    setNewChecklistItem({});
    setShowCreateChecklist(false);
    toast({
      title: "Checklist Item Created",
      description: `Added "${item.title}" to the checklist.`
    });
  };

  const updateChecklistItem = (phaseId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          checklist: phase.checklist.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return phase;
    });

    setPhases(updatedPhases);
    if (onUpdate) {
      onUpdate({ phases: updatedPhases });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700';
      case 'in-progress': return 'bg-blue-500/20 text-blue-700';
      case 'blocked': return 'bg-red-500/20 text-red-700';
      case 'delayed': return 'bg-yellow-500/20 text-yellow-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-700';
      case 'high': return 'bg-orange-500/20 text-orange-700';
      case 'medium': return 'bg-blue-500/20 text-blue-700';
      case 'low': return 'bg-gray-500/20 text-gray-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const calculateOverallProgress = () => {
    const totalItems = phases.reduce((sum, phase) => sum + phase.checklist.length, 0);
    const completedItems = phases.reduce((sum, phase) => 
      sum + phase.checklist.filter(item => item.status === 'completed').length, 0
    );
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
                Enhanced Implementation Tracker
              </CardTitle>
              <p className="text-muted-foreground">
                Comprehensive tracking for Portnox NAC deployment with enhanced checklists and requirements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="glow" className="text-sm px-3 py-1">
                {calculateOverallProgress()}% Complete
              </Badge>
              <Button 
                onClick={enrichChecklistsFromPortnoxDocs}
                disabled={isEnrichingFromPortnox}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {isEnrichingFromPortnox ? 'Enriching...' : 'Enrich from Portnox Docs'}
              </Button>
            </div>
          </div>
          <Progress value={calculateOverallProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map(phase => (
              <Card key={phase.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {phase.name}
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={phase.progress} />
                    <div className="text-sm text-muted-foreground">
                      {phase.checklist.filter(item => item.status === 'completed').length} of {phase.checklist.length} items completed
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          {phases.map(phase => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {phase.name}
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">{phase.description}</p>
                  </div>
                  <Progress value={phase.progress} className="w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phase.checklist.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.status === 'completed'}
                          onCheckedChange={(checked) => 
                            updateChecklistItem(phase.id, item.id, {
                              status: checked ? 'completed' : 'not-started'
                            })
                          }
                        />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          )}
                          {item.portnoxComponent && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              <Network className="h-3 w-3 mr-1" />
                              {item.portnoxComponent}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="checklists" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Checklist Management</CardTitle>
                <Dialog open={showCreateChecklist} onOpenChange={setShowCreateChecklist}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Checklist Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Checklist Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={newChecklistItem.title || ''}
                          onChange={(e) => setNewChecklistItem({...newChecklistItem, title: e.target.value})}
                          placeholder="Enter checklist item title"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newChecklistItem.description || ''}
                          onChange={(e) => setNewChecklistItem({...newChecklistItem, description: e.target.value})}
                          placeholder="Enter description"
                        />
                      </div>
                      <div>
                        <Label>Category *</Label>
                        <Select onValueChange={(value) => setNewChecklistItem({...newChecklistItem, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="Configuration">Configuration</SelectItem>
                            <SelectItem value="Integration">Integration</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                            <SelectItem value="Documentation">Documentation</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Policy">Policy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select onValueChange={(value: any) => setNewChecklistItem({...newChecklistItem, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Portnox Component</Label>
                        <Select onValueChange={(value) => setNewChecklistItem({...newChecklistItem, portnoxComponent: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select component" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AgentP">AgentP</SelectItem>
                            <SelectItem value="Directory Broker">Directory Broker</SelectItem>
                            <SelectItem value="Local Radius Proxy">Local Radius Proxy</SelectItem>
                            <SelectItem value="Local TACACS Service">Local TACACS Service</SelectItem>
                            <SelectItem value="CLEAR Platform">CLEAR Platform</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={createNewChecklistItem} className="w-full">
                        Create Checklist Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.flatMap(phase => 
                  phase.checklist.map(item => (
                    <Card key={`${phase.id}-${item.id}`} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Checkbox
                              checked={item.status === 'completed'}
                              onCheckedChange={(checked) => 
                                updateChecklistItem(phase.id, item.id, {
                                  status: checked ? 'completed' : 'not-started'
                                })
                              }
                            />
                            <div className="font-medium">{item.title}</div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                            {item.portnoxComponent && (
                              <Badge variant="secondary">
                                <Network className="h-3 w-3 mr-1" />
                                {item.portnoxComponent}
                              </Badge>
                            )}
                          </div>
                          {item.requirements && item.requirements.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium mb-1">Requirements:</div>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {item.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Selection for Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Select vendors to include in documentation crawling:</Label>
                  {['Cisco', 'Aruba', 'Fortinet', 'Juniper', 'Extreme Networks'].map(vendor => (
                    <div key={vendor} className="flex items-center space-x-2">
                      <Checkbox
                        id={vendor}
                        checked={selectedVendors.includes(vendor)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVendors([...selectedVendors, vendor]);
                          } else {
                            setSelectedVendors(selectedVendors.filter(v => v !== vendor));
                          }
                        }}
                      />
                      <Label htmlFor={vendor}>{vendor}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Checklist
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Checklist
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedImplementationTracker;