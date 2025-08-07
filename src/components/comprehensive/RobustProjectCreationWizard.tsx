import { useState, useEffect, useCallback } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Brain, 
  Building2, 
  MapPin, 
  Clock, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Users, 
  Settings, 
  Upload,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Save,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  X,
  Check
} from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";

interface ScopingData {
  session_name: string;
  created_at: string;
  last_modified: string;
  organization: {
    name: string;
    industry: string;
    size: string;
    total_users: number;
    pain_points: Array<{ id: string; title: string; }>;
    custom_pain_points: Array<{ id: string; title: string; }>;
  };
  network_infrastructure: {
    site_count: number;
    device_inventory: Record<string, number>;
    network_topology: string;
    current_security_solutions: string[];
  };
  vendor_ecosystem: {
    wired_wireless: Array<{ id: number; name: string; }>;
    security_solutions: Array<{ id: number; name: string; }>;
    edr_solutions: Array<{ id: number; name: string; }>;
    vpn_solutions: Array<{ id: number; name: string; }>;
    mfa_solutions: Array<{ id: number; name: string; }>;
    sso_solutions: Array<{ id: number; name: string; }>;
    cloud_platforms: Array<{ id: number; name: string; }>;
    identity_providers: Array<{ id: number; name: string; }>;
    pki_solutions: Array<{ id: number; name: string; }>;
  };
  use_cases_requirements: {
    primary_use_cases: Array<{ id: string; title: string; }>;
    custom_requirements: string[];
    success_criteria: string[];
  };
  integration_compliance: {
    required_integrations: string[];
    compliance_frameworks: string[];
  };
}

interface ProjectSite {
  id: string;
  name: string;
  location: string;
  address: string;
  type: 'headquarters' | 'branch' | 'datacenter' | 'remote';
  priority: 'high' | 'medium' | 'low';
  estimatedUsers: number;
  complexity: 'simple' | 'moderate' | 'complex';
  networkDevices: {
    switches: number;
    accessPoints: number;
    routers: number;
    firewalls: number;
  };
  timeline: {
    estimatedStart: string;
    estimatedEnd: string;
    duration: number;
  };
  assignedPM?: string;
  assignedTechnical?: string[];
  notes?: string;
  status: 'planning' | 'ready' | 'in-progress' | 'completed';
}

interface ProjectStakeholder {
  id: string;
  name: string;
  email: string;
  role: 'project-manager' | 'technical-lead' | 'business-owner' | 'stakeholder';
  department?: string;
  phone?: string;
  responsibilities: string[];
}

interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number; // in days
  dependencies: string[];
  deliverables: string[];
  resources: string[];
  sites: string[]; // site IDs
  criticalPath: boolean;
}

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  phaseId: string;
  critical: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'at-risk';
  dependencies: string[];
}

interface RobustProjectCreationWizardProps {
  scopingData?: ScopingData;
  onSave: (projectData: any) => void;
  onCancel: () => void;
}

const RobustProjectCreationWizard: React.FC<RobustProjectCreationWizardProps> = ({
  scopingData,
  onSave,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    // Basic Project Info
    name: scopingData?.session_name || '',
    description: '',
    industry: scopingData?.organization?.industry || '',
    organizationSize: scopingData?.organization?.size || '',
    totalUsers: scopingData?.organization?.total_users || 0,
    
    // Timeline & Budget
    startDate: '',
    targetEndDate: '',
    budget: '',
    budgetRange: '',
    
    // Goals from scoping
    primaryGoals: scopingData?.use_cases_requirements?.success_criteria || [],
    painPoints: [
      ...(scopingData?.organization?.pain_points?.map(p => p.title) || []),
      ...(scopingData?.organization?.custom_pain_points?.map(p => p.title) || [])
    ],
    
    // Sites and Locations
    sites: [] as ProjectSite[],
    
    // Team & Stakeholders
    stakeholders: [] as ProjectStakeholder[],
    
    // Deployment Planning
    deploymentStrategy: 'phased', // phased, parallel, pilot-first
    phases: [] as DeploymentPhase[],
    milestones: [] as ProjectMilestone[],
    
    // AI Recommendations
    aiRecommendations: {
      timeline: '',
      sites: [],
      risks: [],
      resources: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [showSiteDialog, setShowSiteDialog] = useState(false);
  const [showStakeholderDialog, setShowStakeholderDialog] = useState(false);
  const [editingSite, setEditingSite] = useState<ProjectSite | null>(null);
  const [editingStakeholder, setEditingStakeholder] = useState<ProjectStakeholder | null>(null);
  const [bulkSitesText, setBulkSitesText] = useState('');
  
  const { generateRecommendations, generateProjectSummary, isLoading: aiLoading } = useAI();

  const steps = [
    { id: 1, title: "Project Foundation", icon: Building2, description: "Basic project information and goals" },
    { id: 2, title: "Sites & Locations", icon: MapPin, description: "Define deployment sites and priorities" },
    { id: 3, title: "Team & Stakeholders", icon: Users, description: "Assign project managers and team members" },
    { id: 4, title: "Deployment Planning", icon: Target, description: "Create phases, timelines, and milestones" },
    { id: 5, title: "AI Optimization", icon: Brain, description: "Review AI recommendations and finalize" },
    { id: 6, title: "Review & Create", icon: CheckCircle, description: "Final review and project creation" }
  ];

  // Auto-generate sites from scoping data
  useEffect(() => {
    if (scopingData && projectData.sites.length === 0) {
      const generatedSites: ProjectSite[] = Array.from(
        { length: scopingData.network_infrastructure.site_count || 1 },
        (_, index) => ({
          id: `site-${index + 1}`,
          name: index === 0 ? 'Headquarters' : `Site ${index + 1}`,
          location: '',
          address: '',
          type: index === 0 ? 'headquarters' : 'branch',
          priority: index < 2 ? 'high' : index < 5 ? 'medium' : 'low',
          estimatedUsers: Math.floor((scopingData.organization.total_users || 100) / (scopingData.network_infrastructure.site_count || 1)),
          complexity: 'moderate',
          networkDevices: {
            switches: 2 + index,
            accessPoints: 5 + index * 3,
            routers: 1,
            firewalls: 1
          },
          timeline: {
            estimatedStart: '',
            estimatedEnd: '',
            duration: 30 + index * 5
          },
          status: 'planning'
        })
      );
      
      setProjectData(prev => ({ ...prev, sites: generatedSites }));
    }
  }, [scopingData]);

  const generateAIRecommendations = async () => {
    if (!scopingData) return;
    
    setLoading(true);
    try {
      const recommendations = await generateRecommendations(
        { ...projectData, scopingData }, 
        scopingData.use_cases_requirements.primary_use_cases,
        Object.values(scopingData.vendor_ecosystem).flat()
      );

      if (recommendations) {
        setProjectData(prev => ({
          ...prev,
          aiRecommendations: {
            timeline: recommendations,
            sites: generateSiteRecommendations(),
            risks: generateRiskAssessment(),
            resources: generateResourceRecommendations()
          }
        }));
      }
    } catch (error) {
      toast.error("Failed to generate AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  const generateSiteRecommendations = () => {
    return projectData.sites.map(site => {
      const complexityFactors = [];
      if (site.estimatedUsers > 500) complexityFactors.push("High user count requires robust infrastructure");
      if (site.networkDevices.switches > 10) complexityFactors.push("Complex network topology");
      if (site.type === 'datacenter') complexityFactors.push("Critical infrastructure requires extra care");
      
      return {
        siteId: site.id,
        recommendation: complexityFactors.length > 0 ? complexityFactors.join(". ") : "Standard deployment approach recommended",
        suggestedPhase: site.priority === 'high' ? 1 : site.priority === 'medium' ? 2 : 3
      };
    });
  };

  const generateRiskAssessment = () => {
    const risks = [];
    const totalSites = projectData.sites.length;
    const totalUsers = projectData.totalUsers;
    
    if (totalSites > 10) risks.push("Large number of sites may require extended timeline");
    if (totalUsers > 5000) risks.push("High user count increases change management complexity");
    if (projectData.sites.some(s => s.complexity === 'complex')) risks.push("Complex sites may face integration challenges");
    
    return risks;
  };

  const generateResourceRecommendations = () => {
    const resources = [];
    const totalSites = projectData.sites.length;
    
    resources.push(`${Math.ceil(totalSites / 5)} Project Managers recommended`);
    resources.push(`${Math.ceil(totalSites / 3)} Technical Engineers needed`);
    if (projectData.totalUsers > 1000) resources.push("Dedicated Change Management resource recommended");
    
    return resources;
  };

  const generateDeploymentPlan = async () => {
    setLoading(true);
    
    // Generate realistic phases based on sites and complexity
    const phases: DeploymentPhase[] = [
      {
        id: 'phase-1',
        name: 'Project Initiation & Assessment',
        description: 'Project kickoff, detailed assessment, and infrastructure preparation',
        order: 1,
        estimatedDuration: 30,
        dependencies: [],
        deliverables: ['Project Charter', 'Technical Assessment', 'Deployment Plan'],
        resources: ['Project Manager', 'Network Architect', 'Security Engineer'],
        sites: [],
        criticalPath: true
      },
      {
        id: 'phase-2',
        name: 'Pilot Deployment',
        description: 'Deploy to high-priority pilot sites',
        order: 2,
        estimatedDuration: 45,
        dependencies: ['phase-1'],
        deliverables: ['Pilot Environment', 'Test Results', 'User Training'],
        resources: ['Implementation Team', 'Training Specialists'],
        sites: projectData.sites.filter(s => s.priority === 'high').slice(0, 2).map(s => s.id),
        criticalPath: true
      },
      {
        id: 'phase-3',
        name: 'Rollout Wave 1',
        description: 'Deploy to remaining high and medium priority sites',
        order: 3,
        estimatedDuration: 60,
        dependencies: ['phase-2'],
        deliverables: ['Production Deployment', 'Site Handover Documentation'],
        resources: ['Deployment Teams', 'Support Engineers'],
        sites: projectData.sites.filter(s => s.priority !== 'low').slice(2).map(s => s.id),
        criticalPath: false
      },
      {
        id: 'phase-4',
        name: 'Final Rollout & Optimization',
        description: 'Complete deployment and optimize performance',
        order: 4,
        estimatedDuration: 30,
        dependencies: ['phase-3'],
        deliverables: ['Complete Deployment', 'Performance Report', 'Support Transition'],
        resources: ['Support Team', 'Performance Analysts'],
        sites: projectData.sites.filter(s => s.priority === 'low').map(s => s.id),
        criticalPath: false
      }
    ];

    // Generate milestones
    const milestones: ProjectMilestone[] = [
      {
        id: 'milestone-1',
        title: 'Project Kickoff',
        description: 'Official project start and team mobilization',
        targetDate: projectData.startDate,
        phaseId: 'phase-1',
        critical: true,
        status: 'pending',
        dependencies: []
      },
      {
        id: 'milestone-2',
        title: 'Technical Assessment Complete',
        description: 'Detailed technical assessment and planning finished',
        targetDate: addDays(projectData.startDate, 20),
        phaseId: 'phase-1',
        critical: true,
        status: 'pending',
        dependencies: ['milestone-1']
      },
      {
        id: 'milestone-3',
        title: 'Pilot Go-Live',
        description: 'First pilot site successfully deployed',
        targetDate: addDays(projectData.startDate, 60),
        phaseId: 'phase-2',
        critical: true,
        status: 'pending',
        dependencies: ['milestone-2']
      },
      {
        id: 'milestone-4',
        title: 'Wave 1 Complete',
        description: 'All high/medium priority sites deployed',
        targetDate: addDays(projectData.startDate, 120),
        phaseId: 'phase-3',
        critical: false,
        status: 'pending',
        dependencies: ['milestone-3']
      },
      {
        id: 'milestone-5',
        title: 'Project Complete',
        description: 'All sites deployed and project handed over',
        targetDate: addDays(projectData.startDate, 150),
        phaseId: 'phase-4',
        critical: true,
        status: 'pending',
        dependencies: ['milestone-4']
      }
    ];

    setProjectData(prev => ({ 
      ...prev, 
      phases, 
      milestones,
      targetEndDate: addDays(projectData.startDate, 150)
    }));
    
    setLoading(false);
    toast.success("Deployment plan generated successfully!");
  };

  const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const addSite = (site?: ProjectSite) => {
    const newSite: ProjectSite = site || {
      id: `site-${Date.now()}`,
      name: '',
      location: '',
      address: '',
      type: 'branch',
      priority: 'medium',
      estimatedUsers: 100,
      complexity: 'moderate',
      networkDevices: {
        switches: 2,
        accessPoints: 8,
        routers: 1,
        firewalls: 1
      },
      timeline: {
        estimatedStart: '',
        estimatedEnd: '',
        duration: 30
      },
      status: 'planning'
    };

    if (site) {
      setProjectData(prev => ({
        ...prev,
        sites: prev.sites.map(s => s.id === site.id ? site : s)
      }));
    } else {
      setProjectData(prev => ({
        ...prev,
        sites: [...prev.sites, newSite]
      }));
    }
    
    setEditingSite(null);
    setShowSiteDialog(false);
  };

  const addStakeholder = (stakeholder?: ProjectStakeholder) => {
    const newStakeholder: ProjectStakeholder = stakeholder || {
      id: `stakeholder-${Date.now()}`,
      name: '',
      email: '',
      role: 'stakeholder',
      responsibilities: []
    };

    if (stakeholder) {
      setProjectData(prev => ({
        ...prev,
        stakeholders: prev.stakeholders.map(s => s.id === stakeholder.id ? stakeholder : s)
      }));
    } else {
      setProjectData(prev => ({
        ...prev,
        stakeholders: [...prev.stakeholders, newStakeholder]
      }));
    }
    
    setEditingStakeholder(null);
    setShowStakeholderDialog(false);
  };

  const processBulkSites = () => {
    const lines = bulkSitesText.trim().split('\n').filter(line => line.trim());
    const newSites: ProjectSite[] = lines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        id: `bulk-site-${Date.now()}-${index}`,
        name: parts[0] || `Site ${index + 1}`,
        location: parts[1] || '',
        address: parts[2] || '',
        type: 'branch',
        priority: 'medium',
        estimatedUsers: parseInt(parts[3]) || 100,
        complexity: 'moderate',
        networkDevices: {
          switches: 2,
          accessPoints: 8,
          routers: 1,
          firewalls: 1
        },
        timeline: {
          estimatedStart: '',
          estimatedEnd: '',
          duration: 30
        },
        status: 'planning'
      };
    });

    setProjectData(prev => ({
      ...prev,
      sites: [...prev.sites, ...newSites]
    }));
    
    setBulkSitesText('');
    toast.success(`Added ${newSites.length} sites successfully!`);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(projectData);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project objectives and scope"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={projectData.startDate}
                      onChange={(e) => setProjectData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-range">Budget Range</Label>
                    <Select
                      value={projectData.budgetRange}
                      onValueChange={(value) => setProjectData(prev => ({ ...prev, budgetRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100k">Under $100K</SelectItem>
                        <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                        <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                        <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                        <SelectItem value="over-5m">Over $5M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {scopingData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      From Scoping Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Organization</Label>
                      <p className="text-sm text-muted-foreground">
                        {scopingData.organization.name} ({scopingData.organization.industry})
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Users</Label>
                      <p className="text-sm text-muted-foreground">
                        {scopingData.organization.total_users.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Sites</Label>
                      <p className="text-sm text-muted-foreground">
                        {scopingData.network_infrastructure.site_count} locations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {projectData.primaryGoals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {projectData.primaryGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Site Management</h3>
                <p className="text-sm text-muted-foreground">
                  Define all deployment locations and their characteristics
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog open={showSiteDialog} onOpenChange={setShowSiteDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingSite(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Site
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingSite ? 'Edit Site' : 'Add New Site'}</DialogTitle>
                    </DialogHeader>
                    <SiteFormDialog 
                      site={editingSite}
                      onSave={addSite}
                      onCancel={() => setShowSiteDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Import Sites</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>CSV Format: Name, Location, Address, Estimated Users</Label>
                        <Textarea
                          value={bulkSitesText}
                          onChange={(e) => setBulkSitesText(e.target.value)}
                          placeholder="Headquarters, New York, 123 Main St, 500&#10;Branch Office, Chicago, 456 Oak Ave, 200"
                          rows={6}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setBulkSitesText('')}>
                          Clear
                        </Button>
                        <Button onClick={processBulkSites}>
                          Import Sites
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {projectData.sites.map((site) => (
                <Card key={site.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{site.name}</h4>
                        <Badge variant={
                          site.priority === 'high' ? 'destructive' : 
                          site.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {site.priority}
                        </Badge>
                        <Badge variant="outline">{site.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{site.location}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>Users: {site.estimatedUsers}</div>
                        <div>Duration: {site.timeline.duration} days</div>
                        <div>Complexity: {site.complexity}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingSite(site);
                          setShowSiteDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setProjectData(prev => ({
                            ...prev,
                            sites: prev.sites.filter(s => s.id !== site.id)
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {projectData.sites.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sites added yet. Click "Add Site" to get started.
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Team & Stakeholders</h3>
                <p className="text-sm text-muted-foreground">
                  Assign project managers, technical leads, and key stakeholders
                </p>
              </div>
              <Dialog open={showStakeholderDialog} onOpenChange={setShowStakeholderDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingStakeholder(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingStakeholder ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                  </DialogHeader>
                  <StakeholderFormDialog 
                    stakeholder={editingStakeholder}
                    onSave={addStakeholder}
                    onCancel={() => setShowStakeholderDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {['project-manager', 'technical-lead', 'business-owner', 'stakeholder'].map(role => (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="text-base capitalize">
                      {role.replace('-', ' ')}s
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projectData.stakeholders
                        .filter(s => s.role === role)
                        .map(stakeholder => (
                          <div key={stakeholder.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <div className="font-medium">{stakeholder.name}</div>
                              <div className="text-sm text-muted-foreground">{stakeholder.email}</div>
                              {stakeholder.department && (
                                <div className="text-xs text-muted-foreground">{stakeholder.department}</div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingStakeholder(stakeholder);
                                  setShowStakeholderDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setProjectData(prev => ({
                                    ...prev,
                                    stakeholders: prev.stakeholders.filter(s => s.id !== stakeholder.id)
                                  }));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      {projectData.stakeholders.filter(s => s.role === role).length === 0 && (
                        <p className="text-sm text-muted-foreground py-4">
                          No {role.replace('-', ' ')}s assigned yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Deployment Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Generate realistic timelines and deployment phases
                </p>
              </div>
              <div className="flex gap-2">
                <Select
                  value={projectData.deploymentStrategy}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, deploymentStrategy: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phased">Phased Rollout</SelectItem>
                    <SelectItem value="parallel">Parallel Deployment</SelectItem>
                    <SelectItem value="pilot-first">Pilot First</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={generateDeploymentPlan} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Plan'}
                  <Zap className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {projectData.phases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Phases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectData.phases.map((phase, index) => (
                      <div key={phase.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{phase.name}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{phase.estimatedDuration} days</div>
                            {phase.criticalPath && (
                              <Badge variant="destructive" className="mt-1">Critical Path</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">DELIVERABLES</Label>
                            <ul className="text-sm mt-1 space-y-1">
                              {phase.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">RESOURCES</Label>
                            <ul className="text-sm mt-1 space-y-1">
                              {phase.resources.map((resource, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <Users className="h-3 w-3 text-blue-500" />
                                  {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">SITES</Label>
                            <div className="text-sm mt-1">
                              {phase.sites.length > 0 ? (
                                <div className="space-y-1">
                                  {phase.sites.map(siteId => {
                                    const site = projectData.sites.find(s => s.id === siteId);
                                    return site ? (
                                      <div key={siteId} className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-orange-500" />
                                        {site.name}
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No specific sites</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {projectData.milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectData.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${milestone.critical ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <div>
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{milestone.targetDate}</div>
                          {milestone.critical && (
                            <Badge variant="destructive" className="mt-1">Critical</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">AI Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Review AI-generated recommendations and optimize your project plan
                </p>
              </div>
              <Button onClick={generateAIRecommendations} disabled={aiLoading}>
                {aiLoading ? 'Analyzing...' : 'Generate AI Recommendations'}
                <Brain className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {projectData.aiRecommendations.timeline && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  {projectData.aiRecommendations.timeline}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectData.aiRecommendations.risks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {projectData.aiRecommendations.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span className="text-sm">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {projectData.aiRecommendations.resources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Resource Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {projectData.aiRecommendations.resources.map((resource, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{projectData.sites.length}</div>
                    <div className="text-sm text-muted-foreground">Sites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{projectData.stakeholders.length}</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{projectData.phases.length}</div>
                    <div className="text-sm text-muted-foreground">Phases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{projectData.milestones.length}</div>
                    <div className="text-sm text-muted-foreground">Milestones</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review & Create Project</h3>
              <p className="text-sm text-muted-foreground">
                Review all details and create your comprehensive project
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Project Name</Label>
                      <p>{projectData.name}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">{projectData.description || 'No description provided'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium">Start Date</Label>
                        <p>{projectData.startDate}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Target End Date</Label>
                        <p>{projectData.targetEndDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{projectData.sites.length}</div>
                      <div className="text-sm text-muted-foreground">Deployment Sites</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{projectData.stakeholders.length}</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{projectData.phases.reduce((sum, phase) => sum + phase.estimatedDuration, 0)}</div>
                      <div className="text-sm text-muted-foreground">Total Days</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={handleSave} disabled={loading}>
                  {loading ? 'Creating Project...' : 'Create Project'}
                  <CheckCircle className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Intelligent Project Creation</h2>
          <Badge variant="secondary" className="text-sm">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        
        <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-center p-3 rounded-lg border transition-all ${
                currentStep === step.id
                  ? 'border-primary bg-primary/10'
                  : currentStep > step.id
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-center mb-2">
                <step.icon className={`h-5 w-5 ${
                  currentStep === step.id
                    ? 'text-primary'
                    : currentStep > step.id
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`} />
              </div>
              <div className="text-xs font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Site Form Dialog Component
const SiteFormDialog: React.FC<{
  site?: ProjectSite | null;
  onSave: (site: ProjectSite) => void;
  onCancel: () => void;
}> = ({ site, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProjectSite>(
    site || {
      id: `site-${Date.now()}`,
      name: '',
      location: '',
      address: '',
      type: 'branch',
      priority: 'medium',
      estimatedUsers: 100,
      complexity: 'moderate',
      networkDevices: {
        switches: 2,
        accessPoints: 8,
        routers: 1,
        firewalls: 1
      },
      timeline: {
        estimatedStart: '',
        estimatedEnd: '',
        duration: 30
      },
      status: 'planning'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="site-name">Site Name *</Label>
          <Input
            id="site-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="site-location">Location *</Label>
          <Input
            id="site-location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="site-address">Address</Label>
        <Input
          id="site-address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="site-type">Site Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="headquarters">Headquarters</SelectItem>
              <SelectItem value="branch">Branch Office</SelectItem>
              <SelectItem value="datacenter">Data Center</SelectItem>
              <SelectItem value="remote">Remote Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="site-priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="site-complexity">Complexity</Label>
          <Select
            value={formData.complexity}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, complexity: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estimated-users">Estimated Users</Label>
          <Input
            id="estimated-users"
            type="number"
            value={formData.estimatedUsers}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedUsers: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.timeline.duration}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              timeline: { ...prev.timeline, duration: parseInt(e.target.value) || 0 }
            }))}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Network Devices</Label>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div>
            <Label htmlFor="switches" className="text-xs">Switches</Label>
            <Input
              id="switches"
              type="number"
              value={formData.networkDevices.switches}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                networkDevices: { ...prev.networkDevices, switches: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="accessPoints" className="text-xs">Access Points</Label>
            <Input
              id="accessPoints"
              type="number"
              value={formData.networkDevices.accessPoints}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                networkDevices: { ...prev.networkDevices, accessPoints: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="routers" className="text-xs">Routers</Label>
            <Input
              id="routers"
              type="number"
              value={formData.networkDevices.routers}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                networkDevices: { ...prev.networkDevices, routers: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="firewalls" className="text-xs">Firewalls</Label>
            <Input
              id="firewalls"
              type="number"
              value={formData.networkDevices.firewalls}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                networkDevices: { ...prev.networkDevices, firewalls: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="site-notes">Notes</Label>
        <Textarea
          id="site-notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {site ? 'Update Site' : 'Add Site'}
        </Button>
      </div>
    </form>
  );
};

// Stakeholder Form Dialog Component
const StakeholderFormDialog: React.FC<{
  stakeholder?: ProjectStakeholder | null;
  onSave: (stakeholder: ProjectStakeholder) => void;
  onCancel: () => void;
}> = ({ stakeholder, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProjectStakeholder>(
    stakeholder || {
      id: `stakeholder-${Date.now()}`,
      name: '',
      email: '',
      role: 'stakeholder',
      responsibilities: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stakeholder-name">Name *</Label>
          <Input
            id="stakeholder-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="stakeholder-email">Email *</Label>
          <Input
            id="stakeholder-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stakeholder-role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project-manager">Project Manager</SelectItem>
              <SelectItem value="technical-lead">Technical Lead</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="stakeholder">Stakeholder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stakeholder-department">Department</Label>
          <Input
            id="stakeholder-department"
            value={formData.department || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="stakeholder-phone">Phone</Label>
        <Input
          id="stakeholder-phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="responsibilities">Responsibilities (comma-separated)</Label>
        <Textarea
          id="responsibilities"
          value={formData.responsibilities.join(', ')}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            responsibilities: e.target.value.split(',').map(r => r.trim()).filter(r => r) 
          }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {stakeholder ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
};

export default RobustProjectCreationWizard;