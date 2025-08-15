import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Plus, 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  FileText,
  Download,
  Upload,
  Zap,
  Edit,
  Trash2,
  Target,
  Globe
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'preparation' | 'installation' | 'configuration' | 'testing' | 'validation' | 'documentation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  assignee?: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  requirements: string[];
  firecrawlEnriched: boolean;
  portnoxSpecific: boolean;
  notes?: string;
  lastUpdated: string;
}

interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  items: ChecklistItem[];
  startDate?: string;
  endDate?: string;
  progress: number;
}

const EnhancedChecklistManager: React.FC = () => {
  const [phases, setPhases] = useState<DeploymentPhase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isEnrichingFromPortnox, setIsEnrichingFromPortnox] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({});
  const [selectedVendors, setSelectedVendors] = useState<string[]>(['portnox']);

  // Initialize default phases and checklists
  useEffect(() => {
    initializeDefaultPhases();
  }, []);

  const initializeDefaultPhases = () => {
    const defaultPhases: DeploymentPhase[] = [
      {
        id: 'phase-discovery',
        name: 'Discovery & Assessment',
        description: 'Initial network analysis, requirements gathering, and infrastructure assessment',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-network-discovery',
            title: 'Network Infrastructure Discovery',
            description: 'Comprehensive analysis of existing network topology, switches, and endpoints',
            category: 'preparation',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 8,
            dependencies: [],
            requirements: ['Network diagram access', 'Switch inventory', 'VLAN documentation'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'item-radius-assessment',
            title: 'RADIUS/TACACS Infrastructure Assessment',
            description: 'Evaluate existing authentication infrastructure and integration requirements',
            category: 'preparation',
            priority: 'high',
            status: 'not_started',
            estimatedHours: 6,
            dependencies: [],
            requirements: ['RADIUS server details', 'TACACS configuration', 'AD integration specs'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      },
      {
        id: 'phase-planning',
        name: 'Planning & Design',
        description: 'Detailed implementation planning, policy design, and resource allocation',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-policy-design',
            title: 'NAC Policy Framework Design',
            description: 'Design comprehensive access control policies based on business requirements',
            category: 'preparation',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 12,
            dependencies: ['item-network-discovery'],
            requirements: ['Business requirements', 'Compliance standards', 'User roles matrix'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      },
      {
        id: 'phase-installation',
        name: 'Core Installation',
        description: 'AgentP deployment, Directory Broker setup, and core component installation',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-agentp-deploy',
            title: 'AgentP Deployment',
            description: 'Deploy and configure Portnox AgentP across target network infrastructure',
            category: 'installation',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 16,
            dependencies: ['item-policy-design'],
            requirements: ['Server specifications', 'Network access', 'Firewall rules'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'item-directory-broker',
            title: 'Directory Broker Configuration',
            description: 'Setup and configure Directory Broker for AD/LDAP integration',
            category: 'configuration',
            priority: 'high',
            status: 'not_started',
            estimatedHours: 8,
            dependencies: ['item-agentp-deploy'],
            requirements: ['AD credentials', 'LDAP configuration', 'SSL certificates'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      },
      {
        id: 'phase-configuration',
        name: 'Configuration & Integration',
        description: 'RADIUS/TACACS integration, policy configuration, and system integration',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-radius-integration',
            title: 'Local RADIUS Proxy Configuration',
            description: 'Configure local RADIUS proxy for authentication delegation',
            category: 'configuration',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 10,
            dependencies: ['item-directory-broker'],
            requirements: ['RADIUS shared secrets', 'Network access', 'Policy definitions'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'item-tacacs-service',
            title: 'Local TACACS Service Setup',
            description: 'Deploy and configure local TACACS service for device administration',
            category: 'configuration',
            priority: 'high',
            status: 'not_started',
            estimatedHours: 8,
            dependencies: ['item-radius-integration'],
            requirements: ['TACACS+ configuration', 'Device access credentials', 'Authorization policies'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      },
      {
        id: 'phase-testing',
        name: 'Testing & Validation',
        description: 'Comprehensive testing of all components and validation of requirements',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-firewall-testing',
            title: 'Firewall Integration Testing',
            description: 'Validate firewall rules and security policy enforcement',
            category: 'testing',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 12,
            dependencies: ['item-tacacs-service'],
            requirements: ['Test scenarios', 'Firewall access', 'Security policies'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      },
      {
        id: 'phase-deployment',
        name: 'Production Deployment',
        description: 'Full production rollout, monitoring setup, and go-live activities',
        status: 'not_started',
        progress: 0,
        items: [
          {
            id: 'item-production-rollout',
            title: 'Production Environment Rollout',
            description: 'Deploy validated configuration to production environment',
            category: 'validation',
            priority: 'critical',
            status: 'not_started',
            estimatedHours: 20,
            dependencies: ['item-firewall-testing'],
            requirements: ['Change management approval', 'Rollback procedures', 'Monitoring tools'],
            firecrawlEnriched: false,
            portnoxSpecific: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      }
    ];

    setPhases(defaultPhases);
    setSelectedPhase(defaultPhases[0]?.id || '');
  };

  // Enrich checklists from Portnox documentation using Firecrawl API
  const enrichChecklistsFromPortnoxDocs = async () => {
    setIsEnrichingFromPortnox(true);
    try {
      // Simulate Firecrawl API call to Portnox knowledge base
      toast.info('Crawling Portnox documentation...');
      
      // This would call the actual Firecrawl API
      const portnoxDocs = await mockFirecrawlApiCall();
      
      // Extract requirements and enrich existing checklists
      const enrichedPhases = phases.map(phase => ({
        ...phase,
        items: phase.items.map(item => {
          if (item.portnoxSpecific) {
            const enrichedRequirements = extractRequirementsFromDocs(portnoxDocs, item);
            return {
              ...item,
              requirements: [...item.requirements, ...enrichedRequirements],
              firecrawlEnriched: true,
              lastUpdated: new Date().toISOString()
            };
          }
          return item;
        })
      }));

      setPhases(enrichedPhases);
      toast.success('Checklists enriched with Portnox documentation!');
    } catch (error) {
      console.error('Failed to enrich checklists:', error);
      toast.error('Failed to enrich checklists from Portnox docs');
    } finally {
      setIsEnrichingFromPortnox(false);
    }
  };

  // Mock Firecrawl API call (replace with actual implementation)
  const mockFirecrawlApiCall = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      agentp: [
        'Ensure minimum 4GB RAM for AgentP server',
        'Configure NTP synchronization for accurate logging',
        'Validate certificate chain for HTTPS communication',
        'Setup SNMP monitoring for health checks'
      ],
      directoryBroker: [
        'Validate LDAP bind credentials and permissions',
        'Configure SSL/TLS for secure directory communication',
        'Test group membership resolution and caching',
        'Setup failover directory servers for redundancy'
      ],
      radiusProxy: [
        'Configure shared secrets with network devices',
        'Validate RADIUS attribute mapping and filtering',
        'Test authentication flow with multiple user types',
        'Setup accounting and logging for compliance'
      ],
      tacacsService: [
        'Configure command authorization policies',
        'Validate device administration access levels',
        'Test privilege escalation and command filtering',
        'Setup audit logging for administrative actions'
      ],
      firewall: [
        'Validate security policy rule precedence',
        'Test dynamic VLAN assignment integration',
        'Configure threat detection and response policies',
        'Validate quarantine and remediation workflows'
      ]
    };
  };

  // Extract relevant requirements from crawled documentation
  const extractRequirementsFromDocs = (docs: any, item: ChecklistItem) => {
    const itemKeywords = item.title.toLowerCase();
    let relevantRequirements: string[] = [];

    if (itemKeywords.includes('agentp')) {
      relevantRequirements = docs.agentp || [];
    } else if (itemKeywords.includes('directory')) {
      relevantRequirements = docs.directoryBroker || [];
    } else if (itemKeywords.includes('radius')) {
      relevantRequirements = docs.radiusProxy || [];
    } else if (itemKeywords.includes('tacacs')) {
      relevantRequirements = docs.tacacsService || [];
    } else if (itemKeywords.includes('firewall')) {
      relevantRequirements = docs.firewall || [];
    }

    return relevantRequirements;
  };

  // Create new checklist item
  const createNewChecklistItem = () => {
    if (!newItem.title || !selectedPhase) return;

    const item: ChecklistItem = {
      id: `item-${Date.now()}`,
      title: newItem.title || '',
      description: newItem.description || '',
      category: newItem.category || 'preparation',
      priority: newItem.priority || 'medium',
      status: 'not_started',
      estimatedHours: newItem.estimatedHours || 4,
      dependencies: [],
      requirements: [],
      firecrawlEnriched: false,
      portnoxSpecific: newItem.portnoxSpecific || false,
      lastUpdated: new Date().toISOString()
    };

    const updatedPhases = phases.map(phase => {
      if (phase.id === selectedPhase) {
        return {
          ...phase,
          items: [...phase.items, item]
        };
      }
      return phase;
    });

    setPhases(updatedPhases);
    setNewItem({});
    setIsCreatingItem(false);
    toast.success('Checklist item created successfully!');
  };

  // Update checklist item status
  const updateChecklistItem = (phaseId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedItems = phase.items.map(item => {
          if (item.id === itemId) {
            return { ...item, ...updates, lastUpdated: new Date().toISOString() };
          }
          return item;
        });
        
        // Calculate phase progress
        const completedItems = updatedItems.filter(item => item.status === 'completed').length;
        const progress = updatedItems.length > 0 ? (completedItems / updatedItems.length) * 100 : 0;
        
        return { ...phase, items: updatedItems, progress };
      }
      return phase;
    });

    setPhases(updatedPhases);
  };

  // Get status color for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-status-complete text-status-complete';
      case 'in_progress': return 'bg-status-in-progress text-status-in-progress';
      case 'blocked': return 'bg-status-blocked text-status-blocked';
      case 'delayed': return 'bg-status-delayed text-status-delayed';
      default: return 'bg-status-planned text-status-planned';
    }
  };

  // Get priority color for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-neon-red text-neon-red-foreground';
      case 'high': return 'bg-neon-orange text-neon-orange-foreground';
      case 'medium': return 'bg-neon-yellow text-neon-yellow-foreground';
      default: return 'bg-neon-green text-neon-green-foreground';
    }
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalItems = phases.reduce((sum, phase) => sum + phase.items.length, 0);
    const completedItems = phases.reduce((sum, phase) => 
      sum + phase.items.filter(item => item.status === 'completed').length, 0
    );
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const selectedPhaseData = phases.find(p => p.id === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Enhanced Deployment Checklists</h2>
          <p className="text-muted-foreground">
            AI-powered checklist management with Portnox documentation integration
          </p>
        </div>
        <div className="flex items-center gap-3">
                  <Button 
                    variant="electric" 
                    onClick={enrichChecklistsFromPortnoxDocs}
                    disabled={isEnrichingFromPortnox}
                    className="bg-gradient-neon-green"
                  >
            {isEnrichingFromPortnox ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Enrich from Portnox Docs
          </Button>
          <Dialog open={isCreatingItem} onOpenChange={setIsCreatingItem}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4 mr-2" />
                Add Checklist Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Checklist Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Enter item title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Detailed description of the task"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(value: any) => setNewItem({ ...newItem, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Preparation</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="configuration">Configuration</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="validation">Validation</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newItem.priority} onValueChange={(value: any) => setNewItem({ ...newItem, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Estimated Hours</Label>
                  <Input
                    type="number"
                    value={newItem.estimatedHours || ''}
                    onChange={(e) => setNewItem({ ...newItem, estimatedHours: parseInt(e.target.value) || 0 })}
                    placeholder="4"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newItem.portnoxSpecific}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, portnoxSpecific: !!checked })}
                  />
                  <Label>Portnox-specific item (eligible for documentation enrichment)</Label>
                </div>
                <Button onClick={createNewChecklistItem} className="w-full">
                  Create Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            Overall Progress: {Math.round(calculateOverallProgress())}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateOverallProgress()} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {phases.map(phase => (
              <div key={phase.id} className="text-center">
                <div className="text-sm font-medium text-foreground">{phase.name}</div>
                <div className="text-lg font-bold text-primary">{Math.round(phase.progress)}%</div>
                <Badge variant="outline" className={getStatusColor(phase.status)}>
                  {phase.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Deployment Phases</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map(phase => (
              <Card key={phase.id} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm text-primary">{phase.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={phase.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {phase.items.filter(i => i.status === 'completed').length} / {phase.items.length} complete
                      </span>
                      <Badge variant="outline" className={getStatusColor(phase.status)}>
                        {phase.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select deployment phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map(phase => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.name} ({Math.round(phase.progress)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPhaseData && (
              <Badge variant="outline" className={getStatusColor(selectedPhaseData.status)}>
                {selectedPhaseData.status.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
          </div>

          {selectedPhaseData && (
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">{selectedPhaseData.name}</CardTitle>
                <p className="text-muted-foreground">{selectedPhaseData.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPhaseData.items.map(item => (
                    <div key={item.id} className="border border-border/50 rounded-lg p-4 bg-card/30">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={item.status === 'completed'}
                          onCheckedChange={(checked) => {
                            updateChecklistItem(selectedPhase, item.id, {
                              status: checked ? 'completed' : 'not_started'
                            });
                          }}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">{item.title}</h4>
                            <Badge variant="outline" className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            {item.firecrawlEnriched && (
                              <Badge variant="electric" className="bg-electric-blue/20 text-electric-blue">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <strong className="text-foreground">Estimated Hours:</strong> {item.estimatedHours}
                            </div>
                            {item.actualHours && (
                              <div>
                                <strong className="text-foreground">Actual Hours:</strong> {item.actualHours}
                              </div>
                            )}
                          </div>

                          {item.requirements.length > 0 && (
                            <div className="mt-3">
                              <strong className="text-sm text-foreground">Requirements:</strong>
                              <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc">
                                {item.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Checklist Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Checklists
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Checklists
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Selected Vendors for Documentation Crawling</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['portnox', 'cisco', 'aruba', 'fortinet'].map(vendor => (
                      <Badge 
                        key={vendor}
                        variant={selectedVendors.includes(vendor) ? "electric" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedVendors(prev => 
                            prev.includes(vendor) 
                              ? prev.filter(v => v !== vendor)
                              : [...prev, vendor]
                          );
                        }}
                      >
                        {vendor.charAt(0).toUpperCase() + vendor.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="electric" 
                  className="w-full bg-gradient-electric-cyber"
                  onClick={enrichChecklistsFromPortnoxDocs}
                  disabled={isEnrichingFromPortnox}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isEnrichingFromPortnox ? 'Enriching...' : 'Enrich All Checklists'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedChecklistManager;