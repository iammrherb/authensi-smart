import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Calendar, Clock, AlertTriangle, Target, Users, Settings, Brain, Zap,
  TrendingUp, Activity, MapPin, Building2, CheckCircle, XCircle,
  Rocket, TestTube, FileText, Monitor, Network, Shield, Database,
  Timer, Award, Search, Filter, Plus, Edit, Eye, Play, Pause,
  BarChart3, PieChart, LineChart, RefreshCw, ArrowRight, GitBranch,
  MessageSquare, Layers, Globe, Server, Wifi, FlaskConical, Gauge
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectMasterData {
  id: string;
  name: string;
  client: string;
  type: 'scoping' | 'poc' | 'pilot' | 'deployment' | 'migration' | 'support';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'at-risk';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  phase: string;
  subPhase?: string;
  
  // Timeline & Milestones
  startDate: string;
  targetDate: string;
  actualDate?: string;
  nextMilestone: ProjectMilestone;
  upcomingMilestones: ProjectMilestone[];
  
  // Scope & Scale
  totalSites: number;
  totalEndpoints: number;
  activeSites: number;
  completedSites: number;
  
  // Team & Resources
  projectManager: string;
  technicalLead: string;
  team: TeamMember[];
  budget: number;
  spent: number;
  
  // AI & Intelligence
  aiInsights: AIInsight[];
  riskScore: number;
  successProbability: number;
  recommendations: AIRecommendation[];
  
  // Tracking & Metrics
  kpis: ProjectKPI[];
  phases: ProjectPhase[];
  sites: ProjectSite[];
  deployments: DeploymentTracker[];
  testCases: TestCase[];
  useCases: UseCase[];
  requirements: Requirement[];
}

interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
  progress: number;
  dependencies: string[];
  deliverables: string[];
  criticalPath: boolean;
  owner: string;
  estimatedEffort: number;
  actualEffort?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  allocation: number;
  skills: string[];
  workload: number;
  availability: 'available' | 'busy' | 'overloaded' | 'unavailable';
}

interface AIInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'optimization' | 'prediction';
  category: 'schedule' | 'budget' | 'quality' | 'risk' | 'resource' | 'performance';
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
  generatedAt: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'process' | 'technical' | 'resource' | 'timeline' | 'risk';
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  implementation: string[];
  benefits: string[];
}

interface ProjectKPI {
  id: string;
  name: string;
  category: 'schedule' | 'budget' | 'quality' | 'scope' | 'satisfaction';
  target: number;
  actual: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  status: 'on-track' | 'at-risk' | 'off-track';
  lastUpdated: string;
}

interface ProjectPhase {
  id: string;
  name: string;
  category: 'discovery' | 'design' | 'implementation' | 'testing' | 'deployment' | 'handover';
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'skipped';
  progress: number;
  startDate?: string;
  endDate?: string;
  estimatedDays: number;
  actualDays?: number;
  dependencies: string[];
  owner: string;
  tasks: PhaseTask[];
  deliverables: string[];
  qualityGates: QualityGate[];
}

interface PhaseTask {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  assignedTo: string;
  estimatedHours: number;
  actualHours?: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  dueDate?: string;
  completedDate?: string;
}

interface QualityGate {
  id: string;
  name: string;
  criteria: string[];
  status: 'pending' | 'passed' | 'failed' | 'waived';
  approver: string;
  approvalDate?: string;
  notes?: string;
}

interface ProjectSite {
  id: string;
  name: string;
  location: string;
  status: 'planning' | 'designing' | 'implementing' | 'testing' | 'deployed' | 'maintenance';
  progress: number;
  endpoints: number;
  deploymentDate?: string;
  technician: string;
  phase: string;
  issues: string[];
  lastUpdate: string;
}

interface DeploymentTracker {
  id: string;
  siteName: string;
  phase: 'preparation' | 'installation' | 'configuration' | 'testing' | 'go-live' | 'stabilization';
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed' | 'postponed';
  progress: number;
  scheduledDate: string;
  actualDate?: string;
  technician: string;
  duration: number;
  issues: Issue[];
  checklist: ChecklistItem[];
}

interface Issue {
  id: string;
  type: 'technical' | 'resource' | 'process' | 'client';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  createdDate: string;
  resolvedDate?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: 'pre-deployment' | 'deployment' | 'post-deployment' | 'validation';
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  assignedTo: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
}

interface TestCase {
  id: string;
  name: string;
  category: 'functional' | 'performance' | 'security' | 'integration' | 'user-acceptance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not-executed' | 'passed' | 'failed' | 'blocked' | 'skipped';
  executedBy?: string;
  executionDate?: string;
  notes?: string;
  automationLevel: 'manual' | 'semi-automated' | 'automated';
}

interface UseCase {
  id: string;
  name: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'identified' | 'analyzed' | 'designed' | 'implemented' | 'tested' | 'validated';
  businessValue: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  owner: string;
  acceptance: number;
}

interface Requirement {
  id: string;
  title: string;
  category: 'functional' | 'non-functional' | 'business' | 'technical' | 'compliance';
  priority: 'must-have' | 'should-have' | 'could-have' | 'wont-have';
  status: 'draft' | 'reviewed' | 'approved' | 'implemented' | 'tested' | 'accepted';
  source: string;
  owner: string;
  complexity: 'low' | 'medium' | 'high';
  testable: boolean;
}

const ProjectMasterHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<ProjectMasterData | null>(null);
  const [projects, setProjects] = useState<ProjectMasterData[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all',
    health: 'all'
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedView, setSelectedView] = useState('grid');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const { user } = useAuth();
  const { data: dbProjects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [] } = useSites();
  const { generateRecommendations, generateProjectSummary, isLoading: aiLoading } = useAI();

  // Transform database projects to master format
  const masterProjects = useMemo(() => {
    return dbProjects.map(project => ({
      id: project.id,
      name: project.name,
      client: project.client_name || 'Unknown Client',
      type: (project.project_type || 'deployment') as 'scoping' | 'poc' | 'pilot' | 'deployment' | 'migration' | 'support',
      status: (project.status || 'planning') as 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'at-risk',
      priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
      progress: project.progress_percentage || 0,
      health: calculateProjectHealth(project),
      phase: project.current_phase || 'planning',
      startDate: project.start_date || new Date().toISOString().split('T')[0],
      targetDate: project.target_completion || new Date().toISOString().split('T')[0],
      totalSites: project.total_sites || 0,
      totalEndpoints: project.total_endpoints || 0,
      activeSites: 0, // Calculate from sites data
      completedSites: 0, // Calculate from sites data
      projectManager: 'John Doe', // Mock data
      technicalLead: 'Jane Smith', // Mock data
      team: [], // Mock data
      budget: project.budget || 0,
      spent: 0, // Mock data
      aiInsights: [],
      riskScore: calculateRiskScore(project),
      successProbability: calculateSuccessProbability(project),
      recommendations: [],
      kpis: generateMockKPIs(project),
      phases: generateProjectPhases(project),
      sites: generateProjectSites(project),
      deployments: [],
      testCases: [],
      useCases: [],
      requirements: [],
      nextMilestone: generateNextMilestone(project),
      upcomingMilestones: []
    }));
  }, [dbProjects]);

  // Helper functions
  const calculateProjectHealth = (project: any): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' => {
    const progress = project.progress_percentage || 0;
    const isOnTime = !project.target_completion || new Date(project.target_completion) >= new Date();
    
    if (progress >= 90 && isOnTime) return 'excellent';
    if (progress >= 70 && isOnTime) return 'good';
    if (progress >= 50) return 'fair';
    if (progress >= 25) return 'poor';
    return 'critical';
  };

  const calculateRiskScore = (project: any): number => {
    let risk = 0;
    if (!project.target_completion || new Date(project.target_completion) < new Date()) risk += 30;
    if ((project.progress_percentage || 0) < 50) risk += 25;
    if (project.status === 'on-hold') risk += 40;
    return Math.min(risk, 100);
  };

  const calculateSuccessProbability = (project: any): number => {
    const baseScore = 70;
    const progressBonus = (project.progress_percentage || 0) * 0.3;
    const timelinePenalty = new Date(project.target_completion || '') < new Date() ? -20 : 0;
    return Math.max(10, Math.min(95, baseScore + progressBonus + timelinePenalty));
  };

  const generateMockKPIs = (project: any): ProjectKPI[] => [
    {
      id: '1',
      name: 'Schedule Adherence',
      category: 'schedule',
      target: 95,
      actual: 87,
      unit: '%',
      trend: 'declining',
      status: 'at-risk',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Budget Variance',
      category: 'budget',
      target: 5,
      actual: 3,
      unit: '%',
      trend: 'stable',
      status: 'on-track',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Quality Score',
      category: 'quality',
      target: 90,
      actual: 92,
      unit: '%',
      trend: 'improving',
      status: 'on-track',
      lastUpdated: new Date().toISOString()
    }
  ];

  const generateProjectPhases = (project: any): ProjectPhase[] => [
    {
      id: '1',
      name: 'Discovery & Planning',
      category: 'discovery',
      status: 'completed',
      progress: 100,
      estimatedDays: 10,
      actualDays: 8,
      dependencies: [],
      owner: 'Project Manager',
      tasks: [],
      deliverables: ['Project Charter', 'Requirements Document'],
      qualityGates: []
    },
    {
      id: '2',
      name: 'Solution Design',
      category: 'design',
      status: 'in-progress',
      progress: 65,
      estimatedDays: 15,
      dependencies: ['1'],
      owner: 'Technical Lead',
      tasks: [],
      deliverables: ['Architecture Document', 'Design Specifications'],
      qualityGates: []
    }
  ];

  const generateProjectSites = (project: any): ProjectSite[] => 
    sites.filter(site => true).slice(0, 2).map(site => ({
      id: site.id,
      name: site.name,
      location: site.location || 'Unknown',
      status: (site.status === 'scoping' ? 'planning' : site.status) as 'planning' | 'designing' | 'implementing' | 'testing' | 'deployed' | 'maintenance',
      progress: site.progress_percentage || 0,
      endpoints: site.device_count || 0,
      technician: site.assigned_engineer || 'Unassigned',
      phase: site.current_phase || 'planning',
      issues: [],
      lastUpdate: site.updated_at
    }));

  const generateNextMilestone = (project: any): ProjectMilestone => ({
    id: '1',
    name: 'Design Review Completion',
    description: 'Complete technical design review and approval',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in-progress',
    progress: 60,
    dependencies: [],
    deliverables: ['Design Document', 'Review Notes'],
    criticalPath: true,
    owner: 'Technical Lead',
    estimatedEffort: 40,
    actualEffort: 24
  });

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return masterProjects.filter(project => {
      if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.client.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type !== 'all' && project.type !== filters.type) return false;
      if (filters.status !== 'all' && project.status !== filters.status) return false;
      if (filters.priority !== 'all' && project.priority !== filters.priority) return false;
      if (filters.health !== 'all' && project.health !== filters.health) return false;
      return true;
    });
  }, [masterProjects, filters]);

  // Generate AI insights for project management
  const generateAIInsights = async () => {
    if (loadingInsights) return;
    setLoadingInsights(true);
    
    try {
      const insights: AIInsight[] = [
        {
          id: '1',
          type: 'warning',
          category: 'schedule',
          title: 'Schedule Risk Detected',
          description: '3 projects are at risk of missing their target completion dates. Consider resource reallocation.',
          impact: 'high',
          confidence: 85,
          actionItems: [
            'Review resource allocation for at-risk projects',
            'Consider parallel work streams',
            'Escalate timeline concerns to stakeholders'
          ],
          generatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'recommendation',
          category: 'resource',
          title: 'Team Optimization Opportunity',
          description: 'John Smith has capacity to take on additional tasks. Consider reassigning from overloaded team members.',
          impact: 'medium',
          confidence: 92,
          actionItems: [
            'Review current workload distribution',
            'Reassign 2-3 tasks to available team members',
            'Update resource planning model'
          ],
          generatedAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'optimization',
          category: 'performance',
          title: 'Process Improvement Detected',
          description: 'Similar configuration tasks across projects can be automated to save 30% time.',
          impact: 'high',
          confidence: 78,
          actionItems: [
            'Create configuration automation scripts',
            'Establish template library',
            'Train team on new processes'
          ],
          generatedAt: new Date().toISOString()
        }
      ];
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  // Generate insights on component mount
  useEffect(() => {
    generateAIInsights();
  }, []);

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const total = filteredProjects.length;
    const inProgress = filteredProjects.filter(p => p.status === 'in-progress').length;
    const atRisk = filteredProjects.filter(p => p.health === 'poor' || p.health === 'critical').length;
    const avgProgress = total > 0 ? 
      filteredProjects.reduce((sum, p) => sum + p.progress, 0) / total : 0;
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = filteredProjects.reduce((sum, p) => sum + p.spent, 0);
    
    return {
      total,
      inProgress,
      atRisk,
      avgProgress: Math.round(avgProgress),
      onTrack: total - atRisk,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
    };
  }, [filteredProjects]);

  const getHealthColor = (health: string) => {
    const colors = {
      excellent: 'bg-green-500/10 text-green-500 border-green-500/20',
      good: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      fair: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      poor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[health as keyof typeof colors] || colors.fair;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'on-hold': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'at-risk': 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-500/10 text-red-500',
      high: 'bg-orange-500/10 text-orange-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-blue-500/10 text-blue-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Project <span className="bg-gradient-primary bg-clip-text text-transparent">Master Hub</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Unified command center for project lifecycle management with intelligent insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <EnhancedButton variant="outline" onClick={generateAIInsights} disabled={loadingInsights}>
                {loadingInsights ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                AI Insights
              </EnhancedButton>
              <EnhancedButton gradient="primary" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </EnhancedButton>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <EnhancedCard glass>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardMetrics.total}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard glass>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardMetrics.inProgress}</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard glass>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardMetrics.avgProgress}%</div>
                    <div className="text-sm text-muted-foreground">Avg Progress</div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard glass>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardMetrics.atRisk}</div>
                    <div className="text-sm text-muted-foreground">At Risk</div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Center</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Health Overview */}
                <EnhancedCard glass className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Project Health Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredProjects.slice(0, 5).map(project => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge className={getHealthColor(project.health)}>
                              {project.health}
                            </Badge>
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-muted-foreground">{project.client}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">{project.progress}%</div>
                              <Progress value={project.progress} className="w-20 h-2" />
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>

                {/* AI Insights Panel */}
                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>AI Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {aiInsights.map(insight => (
                          <div key={insight.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className={insight.type === 'warning' ? 'bg-red-500/10 text-red-500' : 
                                              insight.type === 'recommendation' ? 'bg-blue-500/10 text-blue-500' :
                                              'bg-green-500/10 text-green-500'}>
                                {insight.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                            </div>
                            <div className="font-medium text-sm">{insight.title}</div>
                            <div className="text-xs text-muted-foreground">{insight.description}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </EnhancedCard>
              </div>

              {/* Critical Milestones */}
              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Upcoming Critical Milestones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{project.name}</div>
                          <Badge className={project.nextMilestone.criticalPath ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}>
                            {project.nextMilestone.criticalPath ? 'Critical Path' : 'Standard'}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-medium">{project.nextMilestone.name}</div>
                          <div className="text-xs text-muted-foreground">{project.nextMilestone.description}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Due: {new Date(project.nextMilestone.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={project.nextMilestone.progress} className="w-16 h-2" />
                            <span className="text-xs">{project.nextMilestone.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              {/* Filters */}
              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-64"
                      />
                    </div>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="scoping">Scoping</SelectItem>
                        <SelectItem value="poc">POC</SelectItem>
                        <SelectItem value="pilot">Pilot</SelectItem>
                        <SelectItem value="deployment">Deployment</SelectItem>
                        <SelectItem value="migration">Migration</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.health} onValueChange={(value) => setFilters(prev => ({ ...prev, health: value }))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Health" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Health</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </EnhancedCard>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <EnhancedCard key={project.id} glass className="hover:scale-105 transition-transform cursor-pointer" 
                               onClick={() => setSelectedProject(project)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <Badge className={getHealthColor(project.health)}>
                          {project.health}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Sites</div>
                          <div className="font-medium">{project.totalSites}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Endpoints</div>
                          <div className="font-medium">{project.totalEndpoints}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(project.targetDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </EnhancedCard>
                ))}
              </div>
            </TabsContent>

            {/* Other tabs would continue here... */}
            <TabsContent value="sites" className="space-y-6">
              <div className="text-center py-12">
                <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sites Management</h3>
                <p className="text-muted-foreground">Comprehensive site tracking and deployment management coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="deployments" className="space-y-6">
              <div className="text-center py-12">
                <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Deployment Center</h3>
                <p className="text-muted-foreground">Advanced deployment tracking and automation tools coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Timeline Management</h3>
                <p className="text-muted-foreground">Interactive timeline and milestone tracking coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Comprehensive project analytics and reporting coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Intelligence Center</h3>
                <p className="text-muted-foreground">Advanced AI recommendations and automation coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Project Details Modal */}
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProject.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Project summary content would go here */}
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Detailed Project View</h3>
                    <p className="text-muted-foreground">Comprehensive project details, timeline, and management tools coming soon...</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectMasterHub;
