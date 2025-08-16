import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, Building2, MapPin, Clock, Target, Zap, CheckCircle, AlertCircle, 
  Calendar as CalendarIcon, Users, Settings, Upload, Plus, Minus, 
  ArrowRight, ArrowLeft, Save, Download, FileText, Eye, Edit, Trash2, 
  X, Check, Sparkles, RefreshCw, Network, Globe, Shield, Briefcase,
  BarChart3, TrendingUp, UserPlus, Mail, Layers, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useCreateProject } from '@/hooks/useProjects';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';
import { useRequirements } from '@/hooks/useRequirements';
import { usePainPoints, useCreatePainPoint } from '@/hooks/usePainPoints';
import { useRecommendations, useCreateRecommendation } from '@/hooks/useRecommendations';
import { useIndustryOptions, useComplianceFrameworks } from '@/hooks/useResourceLibrary';
import { useUseCases } from '@/hooks/useUseCases';
import { useProjectTemplates } from '@/hooks/useProjectTemplates';
import { AppRole } from '@/hooks/useUserRoles';
import BulkSiteCreator from '@/components/sites/BulkSiteCreator';
import BulkUserCreator from '@/components/users/BulkUserCreator';
import InfrastructureSelector, { InfrastructureSelection } from '@/components/resources/InfrastructureSelector';
import ResourceLibraryIntegration from '@/components/resources/ResourceLibraryIntegration';
import { jsPDF } from 'jspdf';

// Enhanced interfaces combining all wizard capabilities
interface StakeholderEntry {
  email: string;
  role: AppRole | 'contact';
  name?: string;
  department?: string;
  phone?: string;
  createUser: boolean;
  sendInvitation: boolean;
  responsibilities: string[];
}

interface ProjectSite {
  id: string;
  name: string;
  location: string;
  address: string;
  type: 'headquarters' | 'branch' | 'datacenter' | 'remote' | 'clinic' | 'factory' | 'warehouse' | 'office';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedUsers: number;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  networkDevices: {
    switches: number;
    accessPoints: number;
    routers: number;
    firewalls: number;
    other?: Record<string, number>;
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
  costEstimate?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  dependencies: string[];
  deliverables: string[];
  resources: string[];
  sites: string[];
  criticalPath: boolean;
  successCriteria: string[];
  risks: string[];
  budget?: number;
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
  acceptanceCriteria: string[];
}

interface BusinessAnalysis {
  summary: string;
  marketPosition: string;
  competitiveAdvantage: string;
  riskAssessment: string[];
  opportunities: string[];
  recommendations: string[];
  roi_projection: {
    timeframe: string;
    expected_savings: string;
    implementation_cost: string;
    break_even: string;
  };
}

interface UltimateProjectFormData {
  // Core Project Information
  name: string;
  description: string;
  project_type: 'poc' | 'implementation' | 'expansion' | 'migration' | 'upgrade' | 'custom';
  industry: string;
  
  // Business Context
  client_name: string;
  business_domain: string;
  business_website: string;
  business_summary: string;
  business_analysis?: BusinessAnalysis;
  market_analysis?: string;
  
  // Geographic & Scale
  primary_country: string;
  primary_region: string;
  timezone: string;
  total_sites: number;
  total_endpoints: number;
  organization_size: string;
  
  // Timeline & Budget
  start_date?: Date;
  target_completion?: Date;
  budget?: number;
  budget_range?: string;
  estimated_duration?: number;
  
  // Technical Details
  deployment_type: string;
  security_level: string;
  compliance_frameworks: string[];
  
  // Project Team
  project_manager?: string;
  project_owner?: string;
  technical_owner?: string;
  portnox_owner?: string;
  additional_stakeholders: StakeholderEntry[];
  
  // Sites and Infrastructure
  sites: ProjectSite[];
  infrastructure: InfrastructureSelection;
  
  // Requirements & Goals
  pain_points: string[];
  success_criteria: string[];
  integration_requirements: string[];
  use_cases: string[];
  
  // Deployment Planning
  deployment_strategy: 'phased' | 'parallel' | 'pilot-first' | 'big-bang';
  phases: DeploymentPhase[];
  milestones: ProjectMilestone[];
  
  // AI & Automation Features
  enable_ai_insights: boolean;
  enable_bulk_operations: boolean;
  enable_auto_documentation: boolean;
  enable_real_time_analytics: boolean;
  
  // Advanced Features
  enable_bulk_sites: boolean;
  enable_bulk_users: boolean;
  enable_auto_vendors: boolean;
  enable_portnox_automation: boolean;
  
  // AI Recommendations & Analysis
  ai_recommendations?: {
    timeline_optimization: string[];
    risk_mitigation: string[];
    resource_allocation: string[];
    technology_stack: string[];
    implementation_strategy: string[];
  };
}

interface Props {
  scopingData?: any;
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
  initialData?: Partial<UltimateProjectFormData>;
}

// Project Templates with enhanced data
const projectTemplates = {
  poc: {
    title: "Proof of Concept",
    description: "Validate Portnox NAC capabilities in controlled environment",
    icon: Sparkles,
    color: "text-blue-500",
    duration: "3-6 months",
    complexity: "moderate",
    defaultValues: {
      deployment_strategy: 'pilot-first' as const,
      phases: [
        {
          name: "Planning & Lab Setup",
          duration: 14,
          deliverables: ["Lab Environment", "Test Plan", "Success Criteria"]
        },
        {
          name: "Core Testing",
          duration: 30,
          deliverables: ["Policy Testing", "Integration Testing", "Performance Testing"]
        },
        {
          name: "Evaluation & Reporting",
          duration: 14,
          deliverables: ["Test Results", "Recommendations", "Business Case"]
        }
      ],
      sites: 1,
      endpoints: "50-500",
      requirements: ["Lab Environment Setup", "Basic Policy Testing", "User Acceptance Testing", "Documentation"],
      painPoints: ["Need to validate technology", "Limited budget for testing", "Proof required before full deployment"]
    }
  },
  implementation: {
    title: "Full Implementation",
    description: "Complete enterprise NAC deployment",
    icon: Settings,
    color: "text-green-500",
    duration: "6-18 months",
    complexity: "complex",
    defaultValues: {
      deployment_strategy: 'phased' as const,
      sites: "multiple",
      endpoints: "1000+",
      requirements: ["Network Infrastructure Assessment", "Policy Framework Design", "User Training", "Go-Live Support"],
      painPoints: ["Complex network environment", "Multiple stakeholders", "Business continuity requirements"]
    }
  },
  expansion: {
    title: "Network Expansion",
    description: "Extend existing NAC to new locations",
    icon: ArrowUpRight,
    color: "text-purple-500",
    duration: "3-9 months",
    complexity: "moderate",
    defaultValues: {
      deployment_strategy: 'parallel' as const,
      sites: "new locations",
      endpoints: "variable",
      requirements: ["Site Assessment", "Configuration Replication", "Testing & Validation", "User Onboarding"],
      painPoints: ["Maintaining consistency", "Remote site challenges", "Resource allocation"]
    }
  },
  migration: {
    title: "Technology Migration",
    description: "Migrate from legacy NAC solution",
    icon: RefreshCw,
    color: "text-orange-500",
    duration: "6-12 months",
    complexity: "complex",
    defaultValues: {
      deployment_strategy: 'phased' as const,
      sites: "existing coverage",
      endpoints: "current deployment",
      requirements: ["Legacy System Analysis", "Migration Planning", "Parallel Testing", "Cutover Planning"],
      painPoints: ["Zero downtime requirement", "Legacy system dependencies", "User impact minimization"]
    }
  },
  upgrade: {
    title: "System Upgrade",
    description: "Upgrade existing Portnox deployment",
    icon: Layers,
    color: "text-indigo-500",
    duration: "2-4 months",
    complexity: "simple",
    defaultValues: {
      deployment_strategy: 'phased' as const,
      sites: "current deployment",
      endpoints: "existing count",
      requirements: ["Current State Assessment", "Upgrade Planning", "Testing & Validation", "Training Updates"],
      painPoints: ["Minimal downtime required", "Feature compatibility", "Training updates needed"]
    }
  },
  custom: {
    title: "Custom Project",
    description: "Tailored approach for unique requirements",
    icon: Target,
    color: "text-cyan-500",
    duration: "variable",
    complexity: "variable",
    defaultValues: {
      deployment_strategy: 'phased' as const,
      sites: "to be determined",
      endpoints: "to be determined",
      requirements: [],
      painPoints: []
    }
  }
};

const UltimateProjectCreationWizard: React.FC<Props> = ({ 
  scopingData, 
  onComplete, 
  onCancel,
  initialData 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UltimateProjectFormData>({
    name: initialData?.name || scopingData?.session_name || '',
    description: initialData?.description || '',
    project_type: initialData?.project_type || 'implementation',
    industry: initialData?.industry || scopingData?.organization?.industry || '',
    client_name: initialData?.client_name || '',
    business_domain: initialData?.business_domain || '',
    business_website: initialData?.business_website || '',
    business_summary: initialData?.business_summary || '',
    primary_country: initialData?.primary_country || '',
    primary_region: initialData?.primary_region || '',
    timezone: initialData?.timezone || '',
    total_sites: initialData?.total_sites || scopingData?.network_infrastructure?.site_count || 1,
    total_endpoints: initialData?.total_endpoints || scopingData?.organization?.total_users || 100,
    organization_size: initialData?.organization_size || scopingData?.organization?.size || '',
    deployment_type: initialData?.deployment_type || '',
    security_level: initialData?.security_level || '',
    deployment_strategy: initialData?.deployment_strategy || 'phased',
    additional_stakeholders: initialData?.additional_stakeholders || [],
    sites: initialData?.sites || [],
    infrastructure: initialData?.infrastructure || {
      nac_vendors: [],
      network: { wired_vendors: [], wired_models: {}, wireless_vendors: [], wireless_models: {} },
      security: { firewalls: [], vpn: [], idp_sso: [], edr: [], siem: [] },
      device_inventory: []
    },
    compliance_frameworks: initialData?.compliance_frameworks || [],
    pain_points: initialData?.pain_points || scopingData?.organization?.pain_points?.map((p: any) => p.title) || [],
    success_criteria: initialData?.success_criteria || scopingData?.use_cases_requirements?.success_criteria || [],
    integration_requirements: initialData?.integration_requirements || [],
    use_cases: initialData?.use_cases || [],
    phases: initialData?.phases || [],
    milestones: initialData?.milestones || [],
    enable_ai_insights: initialData?.enable_ai_insights ?? true,
    enable_bulk_operations: initialData?.enable_bulk_operations ?? false,
    enable_auto_documentation: initialData?.enable_auto_documentation ?? true,
    enable_real_time_analytics: initialData?.enable_real_time_analytics ?? true,
    enable_bulk_sites: initialData?.enable_bulk_sites ?? false,
    enable_bulk_users: initialData?.enable_bulk_users ?? false,
    enable_auto_vendors: initialData?.enable_auto_vendors ?? true,
    enable_portnox_automation: initialData?.enable_portnox_automation ?? true
  });

  // AI and Enhanced Features State
  const [isGeneratingBusinessAnalysis, setIsGeneratingBusinessAnalysis] = useState(false);
  const [isGeneratingDeploymentPlan, setIsGeneratingDeploymentPlan] = useState(false);
  const [isGeneratingSiteRecommendations, setIsGeneratingSiteRecommendations] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  
  // Dialog and UI State
  const [showSiteDialog, setShowSiteDialog] = useState(false);
  const [showStakeholderDialog, setShowStakeholderDialog] = useState(false);
  const [showBulkSiteCreator, setShowBulkSiteCreator] = useState(false);
  const [showBulkUserCreator, setShowBulkUserCreator] = useState(false);
  const [editingSite, setEditingSite] = useState<ProjectSite | null>(null);
  const [editingStakeholder, setEditingStakeholder] = useState<StakeholderEntry | null>(null);
  
  // Form helpers
  const [newStakeholder, setNewStakeholder] = useState<StakeholderEntry>({
    email: '',
    role: 'contact',
    createUser: false,
    sendInvitation: false,
    responsibilities: []
  });

  // Hooks
  const { toast } = useToast();
  const { generateProjectSummary, generateRecommendations, enhanceNotes, isLoading: aiLoading } = useAI();
  const { generateCompletion, isLoading: enhancedAILoading } = useEnhancedAI();
  const { mutate: createProject, isPending } = useCreateProject();
  const { data: countries = [] } = useCountries();
  const { data: regions = [] } = useRegionsByCountry(formData.primary_country);
  const { data: requirements = [] } = useRequirements();
  const { data: painPoints = [] } = usePainPoints();
  const { data: recommendations = [] } = useRecommendations();
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceFrameworksData = [] } = useComplianceFrameworks();
  const { data: useCases = [] } = useUseCases();
  const { data: projectTemplatesData = [] } = useProjectTemplates();
  const { mutate: createPainPoint } = useCreatePainPoint();
  const { mutate: createRecommendation } = useCreateRecommendation();

  // Configuration data
  const industries = industryOptions.map(option => option.name);
  const complianceOptions = complianceFrameworksData.map(framework => framework.name);
  const deploymentTypes = ["greenfield", "brownfield", "hybrid", "cloud-first", "on-premises", "multi-cloud"];
  const securityLevels = ["basic", "standard", "enhanced", "maximum", "government", "defense"];
  const organizationSizes = [
    'Small (1-100 users)', 'Medium (101-1000 users)', 
    'Large (1001-5000 users)', 'Enterprise (5000+ users)'
  ];
  const timezones = [
    'UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'IST',
    'PST', 'PDT', 'EDT', 'CDT', 'MDT', 'HST', 'AKST', 'AST', 'NST'
  ];

  // Wizard steps with enhanced capabilities
  const steps = [
    {
      id: 1,
      title: "Project Foundation",
      description: "Core project information and strategic alignment",
      icon: Briefcase,
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Business Intelligence",
      description: "AI-powered business analysis and market insights",
      icon: Brain,
      color: "text-purple-500"
    },
    {
      id: 3,
      title: "Geographic & Scale",
      description: "Location, scope, and infrastructure planning",
      icon: Globe,
      color: "text-green-500"
    },
    {
      id: 4,
      title: "Team & Stakeholders",
      description: "Project ownership and team assembly",
      icon: Users,
      color: "text-orange-500"
    },
    {
      id: 5,
      title: "Sites & Infrastructure",
      description: "Detailed site planning and infrastructure mapping",
      icon: Building2,
      color: "text-indigo-500"
    },
    {
      id: 6,
      title: "Requirements & Compliance",
      description: "Security, compliance, and technical requirements",
      icon: Shield,
      color: "text-red-500"
    },
    {
      id: 7,
      title: "Deployment Strategy",
      description: "AI-optimized deployment planning and timeline",
      icon: Target,
      color: "text-cyan-500"
    },
    {
      id: 8,
      title: "AI Optimization",
      description: "Enhanced recommendations and intelligent insights",
      icon: Sparkles,
      color: "text-pink-500"
    },
    {
      id: 9,
      title: "Review & Create",
      description: "Final review and project creation",
      icon: CheckCircle,
      color: "text-emerald-500"
    }
  ];

  // Initialize sites from scoping data
  useEffect(() => {
    if (scopingData && formData.sites.length === 0) {
      generateInitialSites();
    }
  }, [scopingData]);

  const generateInitialSites = () => {
    if (!scopingData) return;
    
    const siteCount = scopingData.network_infrastructure?.site_count || 1;
    const totalUsers = scopingData.organization?.total_users || 100;
    const usersPerSite = Math.floor(totalUsers / siteCount);
    
    const generatedSites: ProjectSite[] = Array.from({ length: siteCount }, (_, index) => ({
      id: `site-${index + 1}`,
      name: index === 0 ? 'Headquarters' : `Site ${index + 1}`,
      location: '',
      address: '',
      type: index === 0 ? 'headquarters' : 'branch',
      priority: index < 2 ? 'critical' : index < 4 ? 'high' : 'medium',
      estimatedUsers: usersPerSite,
      complexity: index === 0 ? 'complex' : 'moderate',
      networkDevices: {
        switches: 2 + index,
        accessPoints: Math.max(5, Math.floor(usersPerSite / 10)),
        routers: 1,
        firewalls: 1
      },
      timeline: {
        estimatedStart: '',
        estimatedEnd: '',
        duration: 30 + index * 7
      },
      status: 'planning',
      riskLevel: index === 0 ? 'medium' : 'low'
    }));
    
    setFormData(prev => ({ ...prev, sites: generatedSites }));
  };

  // AI-powered business analysis generation
  const generateBusinessAnalysis = async () => {
    if (!formData.client_name || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please provide client name and industry first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingBusinessAnalysis(true);
    try {
      const analysisPrompt = `Generate a comprehensive business analysis for:
        
        Company: ${formData.client_name}
        Industry: ${formData.industry}
        Business Domain: ${formData.business_domain || 'Not specified'}
        Website: ${formData.business_website || 'Not specified'}
        Organization Size: ${formData.organization_size}
        Project Type: ${formData.project_type}
        
        Please provide:
        1. Business Summary (2-3 sentences)
        2. Market Position Analysis
        3. Competitive Advantages for NAC deployment
        4. Risk Assessment factors
        5. Business Opportunities
        6. Strategic Recommendations
        7. ROI Projection estimate
        
        Format as JSON with the following structure:
        {
          "summary": "...",
          "marketPosition": "...",
          "competitiveAdvantage": "...",
          "riskAssessment": ["...", "..."],
          "opportunities": ["...", "..."],
          "recommendations": ["...", "..."],
          "roi_projection": {
            "timeframe": "...",
            "expected_savings": "...",
            "implementation_cost": "...",
            "break_even": "..."
          }
        }`;

      const response = await generateCompletion({
        prompt: analysisPrompt,
        taskType: 'analysis',
        maxTokens: 2000
      });

      if (response?.content) {
        try {
          const analysis = JSON.parse(response.content);
          setFormData(prev => ({
            ...prev,
            business_analysis: analysis,
            business_summary: analysis.summary
          }));
          
          toast({
            title: "Business Analysis Generated",
            description: "AI has created a comprehensive business analysis for your project."
          });
        } catch (parseError) {
          // Fallback if JSON parsing fails
          setFormData(prev => ({
            ...prev,
            business_summary: response.content.substring(0, 500) + "..."
          }));
          
          toast({
            title: "Analysis Generated",
            description: "Business analysis created successfully."
          });
        }
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate business analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBusinessAnalysis(false);
    }
  };

  // AI-powered deployment plan generation
  const generateDeploymentPlan = async () => {
    setIsGeneratingDeploymentPlan(true);
    try {
      const deploymentPrompt = `Generate a detailed deployment plan for:
        
        Project: ${formData.name}
        Type: ${formData.project_type}
        Organization Size: ${formData.organization_size}
        Total Sites: ${formData.total_sites}
        Total Endpoints: ${formData.total_endpoints}
        Industry: ${formData.industry}
        Deployment Strategy: ${formData.deployment_strategy}
        
        Generate deployment phases with:
        - Phase names and descriptions
        - Estimated duration in days
        - Dependencies
        - Deliverables
        - Required resources
        - Success criteria
        - Risk factors
        
        Also generate key milestones with target dates.`;

      const response = await generateCompletion({
        prompt: deploymentPrompt,
        taskType: 'reasoning',
        maxTokens: 1500
      });

      if (response?.content) {
        // Generate phases based on project type and AI recommendations
        const phases = generatePhasesFromAI(response.content);
        const milestones = generateMilestonesFromPhases(phases);
        
        setFormData(prev => ({
          ...prev,
          phases,
          milestones
        }));
        
        toast({
          title: "Deployment Plan Generated",
          description: "AI has created an optimized deployment strategy."
        });
      }
    } catch (error) {
      // Fallback to template-based generation
      const templatePhases = generateTemplatePhases();
      const templateMilestones = generateMilestonesFromPhases(templatePhases);
      
      setFormData(prev => ({
        ...prev,
        phases: templatePhases,
        milestones: templateMilestones
      }));
      
      toast({
        title: "Deployment Plan Created",
        description: "Template-based deployment plan generated."
      });
    } finally {
      setIsGeneratingDeploymentPlan(false);
    }
  };

  const generatePhasesFromAI = (aiContent: string): DeploymentPhase[] => {
    // Parse AI content and generate structured phases
    const basePhases: DeploymentPhase[] = [
      {
        id: 'phase-1',
        name: 'Project Initiation & Planning',
        description: 'Project kickoff, stakeholder alignment, and detailed planning',
        order: 1,
        estimatedDuration: 21,
        dependencies: [],
        deliverables: ['Project Charter', 'Stakeholder Matrix', 'Communication Plan', 'Risk Register'],
        resources: ['Project Manager', 'Business Analyst', 'Solutions Architect'],
        sites: [],
        criticalPath: true,
        successCriteria: ['Stakeholder buy-in achieved', 'Project scope defined', 'Team assembled'],
        risks: ['Stakeholder misalignment', 'Scope creep', 'Resource availability']
      },
      {
        id: 'phase-2',
        name: 'Assessment & Design',
        description: 'Technical assessment, architecture design, and solution blueprint',
        order: 2,
        estimatedDuration: 28,
        dependencies: ['phase-1'],
        deliverables: ['Technical Assessment', 'Solution Architecture', 'Implementation Plan', 'Test Strategy'],
        resources: ['Network Architect', 'Security Engineer', 'Technical Consultant'],
        sites: formData.sites.filter(s => s.priority === 'critical').map(s => s.id),
        criticalPath: true,
        successCriteria: ['Architecture approved', 'Technical requirements validated', 'Implementation plan signed-off'],
        risks: ['Technical complexity underestimated', 'Integration challenges', 'Legacy system constraints']
      },
      {
        id: 'phase-3',
        name: 'Pilot Deployment',
        description: 'Deploy solution to pilot sites for validation and testing',
        order: 3,
        estimatedDuration: 35,
        dependencies: ['phase-2'],
        deliverables: ['Pilot Environment', 'Test Results', 'Lessons Learned', 'Rollout Plan'],
        resources: ['Implementation Team', 'Test Engineers', 'Change Managers'],
        sites: formData.sites.filter(s => s.priority === 'critical' || s.priority === 'high').slice(0, 2).map(s => s.id),
        criticalPath: true,
        successCriteria: ['Pilot successful', 'User acceptance achieved', 'Performance validated'],
        risks: ['Pilot performance issues', 'User resistance', 'Technical gaps identified']
      },
      {
        id: 'phase-4',
        name: 'Production Rollout',
        description: 'Full-scale deployment across all remaining sites',
        order: 4,
        estimatedDuration: 60,
        dependencies: ['phase-3'],
        deliverables: ['Production Deployment', 'User Training', 'Documentation', 'Handover'],
        resources: ['Deployment Teams', 'Training Specialists', 'Support Engineers'],
        sites: formData.sites.filter(s => s.priority !== 'critical').map(s => s.id),
        criticalPath: false,
        successCriteria: ['All sites deployed', 'Users trained', 'Support transitioned'],
        risks: ['Rollout delays', 'Resource constraints', 'Change fatigue']
      }
    ];

    return basePhases;
  };

  const generateTemplatePhases = (): DeploymentPhase[] => {
    const template = projectTemplates[formData.project_type];
    if (template.defaultValues.painPoints) {
      // Generate template phases based on project type
      const templatePhases = [
        { name: 'Planning', duration: 30, deliverables: ['Plan'] },
        { name: 'Implementation', duration: 60, deliverables: ['Deployment'] },
        { name: 'Testing', duration: 30, deliverables: ['Results'] }
      ];
      return templatePhases.map((phase, index) => ({
        id: `phase-${index + 1}`,
        name: phase.name,
        description: `${phase.name} - ${phase.deliverables.join(', ')}`,
        order: index + 1,
        estimatedDuration: phase.duration,
        dependencies: index > 0 ? [`phase-${index}`] : [],
        deliverables: phase.deliverables,
        resources: ['Project Team'],
        sites: [],
        criticalPath: true,
        successCriteria: [`${phase.name} completed successfully`],
        risks: ['Timeline delays', 'Resource availability']
      }));
    }
    return [];
  };

  const generateMilestonesFromPhases = (phases: DeploymentPhase[]): ProjectMilestone[] => {
    const milestones: ProjectMilestone[] = [];
    let cumulativeDays = 0;
    
    phases.forEach((phase, index) => {
      cumulativeDays += phase.estimatedDuration;
      
      milestones.push({
        id: `milestone-${phase.id}`,
        title: `${phase.name} Complete`,
        description: `Completion of ${phase.name} with all deliverables`,
        targetDate: addDays(formData.start_date?.toISOString().split('T')[0] || '', cumulativeDays),
        phaseId: phase.id,
        critical: phase.criticalPath,
        status: 'pending',
        dependencies: phase.dependencies,
        acceptanceCriteria: phase.successCriteria
      });
    });
    
    return milestones;
  };

  const addDays = (dateStr: string, days: number): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Apply project template
  const applyProjectTemplate = (templateKey: keyof typeof projectTemplates) => {
    const template = projectTemplates[templateKey];
    setFormData(prev => ({
      ...prev,
      project_type: templateKey,
      deployment_strategy: template.defaultValues.deployment_strategy,
      pain_points: [...new Set([...prev.pain_points, ...template.defaultValues.painPoints])],
      integration_requirements: [...new Set([...prev.integration_requirements, ...template.defaultValues.requirements])]
    }));
    
    toast({
      title: "Template Applied",
      description: `${template.title} template has been applied to your project.`
    });
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    const projectData = {
      name: formData.name,
      description: formData.description,
      project_type: formData.project_type,
      industry: formData.industry,
      client_name: formData.client_name,
      business_domain: formData.business_domain,
      business_website: formData.business_website,
      business_summary: formData.business_summary,
      primary_country: formData.primary_country,
      primary_region: formData.primary_region,
      timezone: formData.timezone,
      deployment_type: formData.deployment_type,
      security_level: formData.security_level,
      total_sites: formData.total_sites,
      total_endpoints: formData.total_endpoints,
      budget: formData.budget,
      organization_size: formData.organization_size,
      project_manager: formData.project_manager,
      project_owner: formData.project_owner,
      technical_owner: formData.technical_owner,
      portnox_owner: formData.portnox_owner,
      additional_stakeholders: formData.additional_stakeholders,
      compliance_frameworks: formData.compliance_frameworks,
      pain_points: formData.pain_points,
      success_criteria: formData.success_criteria,
      integration_requirements: formData.integration_requirements,
      use_cases: formData.use_cases,
      deployment_strategy: formData.deployment_strategy,
      enable_ai_insights: formData.enable_ai_insights,
      enable_bulk_operations: formData.enable_bulk_operations,
      enable_auto_documentation: formData.enable_auto_documentation,
      enable_real_time_analytics: formData.enable_real_time_analytics,
      enable_bulk_sites: formData.enable_bulk_sites,
      enable_bulk_users: formData.enable_bulk_users,
      enable_auto_vendors: formData.enable_auto_vendors,
      enable_portnox_automation: formData.enable_portnox_automation,
      start_date: formData.start_date?.toISOString().split('T')[0],
      target_completion: formData.target_completion?.toISOString().split('T')[0],
      status: 'planning' as const,
      current_phase: 'discovery' as const,
      progress_percentage: 0,
      migration_scope: { 
        infrastructure: formData.infrastructure,
        sites: formData.sites,
        phases: formData.phases,
        milestones: formData.milestones
      }
    };

    createProject(projectData, {
      onSuccess: (project) => {
        toast({
          title: "Project Created Successfully",
          description: `${formData.name} has been created with comprehensive AI-powered planning.`,
        });
        onComplete?.(project.id);
      },
      onError: (error) => {
        toast({
          title: "Failed to Create Project",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Stakeholder management
  const addStakeholder = () => {
    if (newStakeholder.email.trim() && !formData.additional_stakeholders.some(s => s.email === newStakeholder.email.trim())) {
      setFormData(prev => ({
        ...prev,
        additional_stakeholders: [...prev.additional_stakeholders, newStakeholder]
      }));
      setNewStakeholder({ 
        email: '', 
        role: 'contact', 
        createUser: false, 
        sendInvitation: false,
        responsibilities: []
      });
    }
  };

  const removeStakeholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_stakeholders: prev.additional_stakeholders.filter((_, i) => i !== index)
    }));
  };

  // Array field helpers
  const addItem = (field: keyof Pick<UltimateProjectFormData, 'pain_points' | 'integration_requirements' | 'success_criteria' | 'use_cases'>, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeItem = (field: keyof Pick<UltimateProjectFormData, 'pain_points' | 'integration_requirements' | 'success_criteria' | 'use_cases'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Progress calculation
  const calculateProgress = () => {
    const completedSteps = Math.max(0, currentStep - 1);
    return Math.round((completedSteps / steps.length) * 100);
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderProjectFoundation();
      case 2:
        return renderBusinessIntelligence();
      case 3:
        return renderGeographicScale();
      case 4:
        return renderTeamStakeholders();
      case 5:
        return renderSitesInfrastructure();
      case 6:
        return renderRequirementsCompliance();
      case 7:
        return renderDeploymentStrategy();
      case 8:
        return renderAIOptimization();
      case 9:
        return renderReviewCreate();
      default:
        return null;
    }
  };

  const renderProjectFoundation = () => (
    <div className="space-y-8">
      {/* Project Template Selection */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Template
          </CardTitle>
          <p className="text-muted-foreground">
            Choose a template that best matches your project type for optimized defaults
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(projectTemplates).map(([key, template]) => {
              const Icon = template.icon;
              const isSelected = formData.project_type === key;
              
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'
                  }`}
                  onClick={() => applyProjectTemplate(key as keyof typeof projectTemplates)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={template.color}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.duration}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  {isSelected && (
                    <CardContent className="pt-0">
                      <Badge variant="secondary" className="w-full justify-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Basic Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                className="text-lg font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the project objectives, scope, and expected outcomes"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client/Organization Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Organization name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_domain">Business Domain</Label>
              <Input
                id="business_domain"
                value={formData.business_domain}
                onChange={(e) => setFormData(prev => ({ ...prev, business_domain: e.target.value }))}
                placeholder="e.g., Healthcare, Finance"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_website">Website</Label>
              <Input
                id="business_website"
                type="url"
                value={formData.business_website}
                onChange={(e) => setFormData(prev => ({ ...prev, business_website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_size">Organization Size</Label>
            <Select value={formData.organization_size} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_size: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization size" />
              </SelectTrigger>
              <SelectContent>
                {organizationSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessIntelligence = () => (
    <div className="space-y-8">
      {/* AI Business Analysis */}
      <Card className="bg-gradient-to-br from-purple-50/50 via-background to-background border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Business Analysis
          </CardTitle>
          <p className="text-muted-foreground">
            Generate comprehensive business insights and market analysis using AI
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateBusinessAnalysis}
              disabled={isGeneratingBusinessAnalysis || !formData.client_name || !formData.industry}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isGeneratingBusinessAnalysis ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Analysis...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Business Analysis
                </>
              )}
            </Button>
            
            {formData.business_analysis && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Analysis Complete
              </Badge>
            )}
          </div>

          {formData.business_analysis && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business_summary">Business Summary</Label>
                <Textarea
                  id="business_summary"
                  value={formData.business_summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_summary: e.target.value }))}
                  rows={3}
                  placeholder="AI-generated business summary will appear here"
                />
              </div>

              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="roi">ROI Projection</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Market Position</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{formData.business_analysis.marketPosition}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Competitive Advantage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{formData.business_analysis.competitiveAdvantage}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="opportunities" className="space-y-2">
                  {formData.business_analysis.opportunities.map((opp, index) => (
                    <Alert key={index}>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>{opp}</AlertDescription>
                    </Alert>
                  ))}
                </TabsContent>
                
                <TabsContent value="risks" className="space-y-2">
                  {formData.business_analysis.riskAssessment.map((risk, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{risk}</AlertDescription>
                    </Alert>
                  ))}
                </TabsContent>
                
                <TabsContent value="roi" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Timeframe</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium">{formData.business_analysis.roi_projection.timeframe}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Expected Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-green-600">{formData.business_analysis.roi_projection.expected_savings}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Implementation Cost</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-orange-600">{formData.business_analysis.roi_projection.implementation_cost}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-muted-foreground">Break Even</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-blue-600">{formData.business_analysis.roi_projection.break_even}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!formData.business_analysis && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Provide client name and industry, then click "Generate Business Analysis" for AI-powered insights.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      {formData.business_analysis?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.business_analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <div className="bg-primary/20 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderGeographicScale = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary_country">Primary Country</Label>
              <Select value={formData.primary_country} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primary_region">Primary Region</Label>
              <Select value={formData.primary_region} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.region_name} value={region.region_name}>{region.region_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Project Scale & Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="total_sites">Total Sites</Label>
              <Input
                id="total_sites"
                type="number"
                value={formData.total_sites}
                onChange={(e) => setFormData(prev => ({ ...prev, total_sites: parseInt(e.target.value) || 0 }))}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_endpoints">Total Endpoints</Label>
              <Input
                id="total_endpoints"
                type="number"
                value={formData.total_endpoints}
                onChange={(e) => setFormData(prev => ({ ...prev, total_endpoints: parseInt(e.target.value) || 0 }))}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || undefined }))}
                placeholder="Project budget"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Duration (months)</Label>
              <Input
                id="estimated_duration"
                type="number"
                value={formData.estimated_duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || undefined }))}
                placeholder="Project duration"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Target Completion</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.target_completion ? format(formData.target_completion, "PPP") : "Select completion date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.target_completion}
                    onSelect={(date) => setFormData(prev => ({ ...prev, target_completion: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deployment_type">Deployment Type</Label>
              <Select value={formData.deployment_type} onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deployment type" />
                </SelectTrigger>
                <SelectContent>
                  {deploymentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_level">Security Level</Label>
              <Select value={formData.security_level} onValueChange={(value) => setFormData(prev => ({ ...prev, security_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select security level" />
                </SelectTrigger>
                <SelectContent>
                  {securityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamStakeholders = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project_manager">Project Manager</Label>
              <Input
                id="project_manager"
                value={formData.project_manager || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, project_manager: e.target.value }))}
                placeholder="Project manager name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_owner">Business Owner</Label>
              <Input
                id="project_owner"
                value={formData.project_owner || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, project_owner: e.target.value }))}
                placeholder="Business owner name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technical_owner">Technical Lead</Label>
              <Input
                id="technical_owner"
                value={formData.technical_owner || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, technical_owner: e.target.value }))}
                placeholder="Technical lead name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portnox_owner">Portnox Representative</Label>
              <Input
                id="portnox_owner"
                value={formData.portnox_owner || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, portnox_owner: e.target.value }))}
                placeholder="Portnox team member"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Additional Stakeholders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add other key stakeholders and team members
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stakeholder_email">Email</Label>
                <Input
                  id="stakeholder_email"
                  type="email"
                  value={newStakeholder.email}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="stakeholder@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stakeholder_name">Name</Label>
                <Input
                  id="stakeholder_name"
                  value={newStakeholder.name || ''}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stakeholder_role">Role</Label>
                <Select 
                  value={newStakeholder.role} 
                  onValueChange={(value) => setNewStakeholder(prev => ({ ...prev, role: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-manager">Project Manager</SelectItem>
                    <SelectItem value="business-owner">Business Owner</SelectItem>
                    <SelectItem value="technical-lead">Technical Lead</SelectItem>
                    <SelectItem value="stakeholder">Stakeholder</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stakeholder_department">Department</Label>
                <Input
                  id="stakeholder_department"
                  value={newStakeholder.department || ''}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Department/Team"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stakeholder_phone">Phone</Label>
                <Input
                  id="stakeholder_phone"
                  value={newStakeholder.phone || ''}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create_user"
                  checked={newStakeholder.createUser}
                  onCheckedChange={(checked) => setNewStakeholder(prev => ({ ...prev, createUser: !!checked }))}
                />
                <Label htmlFor="create_user" className="text-sm">Create user account</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send_invitation"
                  checked={newStakeholder.sendInvitation}
                  onCheckedChange={(checked) => setNewStakeholder(prev => ({ ...prev, sendInvitation: !!checked }))}
                />
                <Label htmlFor="send_invitation" className="text-sm">Send invitation</Label>
              </div>
            </div>
            
            <Button onClick={addStakeholder} disabled={!newStakeholder.email.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </div>
          
          {formData.additional_stakeholders.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Added Stakeholders</h4>
              {formData.additional_stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stakeholder.name || stakeholder.email}</span>
                      <Badge variant="outline">{stakeholder.role}</Badge>
                    </div>
                    {stakeholder.department && (
                      <p className="text-sm text-muted-foreground">{stakeholder.department}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStakeholder(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSitesInfrastructure = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Deployment Sites
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Define and configure deployment sites with detailed information
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsGeneratingSiteRecommendations(true)}
                disabled={isGeneratingSiteRecommendations}
              >
                {isGeneratingSiteRecommendations ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                AI Generate
              </Button>
              <Button onClick={() => setShowSiteDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {formData.sites.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Sites Added</h3>
              <p className="text-muted-foreground mb-4">Add deployment sites to continue with project planning</p>
              <Button onClick={() => setShowSiteDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Site
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.sites.map((site, index) => (
                <Card key={site.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-lg">{site.name}</h4>
                          <Badge variant={
                            site.priority === 'critical' ? 'destructive' :
                            site.priority === 'high' ? 'default' :
                            site.priority === 'medium' ? 'secondary' : 'outline'
                          }>
                            {site.priority}
                          </Badge>
                          <Badge variant="outline">
                            {site.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p className="font-medium">{site.location || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Users:</span>
                            <p className="font-medium">{site.estimatedUsers}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Complexity:</span>
                            <p className="font-medium">{site.complexity}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium">{site.timeline.duration} days</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Switches:</span>
                            <p className="font-medium">{site.networkDevices.switches}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">APs:</span>
                            <p className="font-medium">{site.networkDevices.accessPoints}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Routers:</span>
                            <p className="font-medium">{site.networkDevices.routers}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Firewalls:</span>
                            <p className="font-medium">{site.networkDevices.firewalls}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSite(site);
                            setShowSiteDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              sites: prev.sites.filter(s => s.id !== site.id)
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Infrastructure Selection
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select and configure your network infrastructure components
          </p>
        </CardHeader>
        <CardContent>
          <InfrastructureSelector
            value={formData.infrastructure}
            onChange={(infrastructure) => setFormData(prev => ({ ...prev, infrastructure }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enable bulk site and user creation for faster project setup
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_bulk_sites"
                  checked={formData.enable_bulk_sites}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bulk_sites: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_bulk_sites" className="font-medium">Bulk Site Creation</Label>
                  <p className="text-sm text-muted-foreground">Upload CSV or create multiple sites at once</p>
                </div>
              </div>
              
              {formData.enable_bulk_sites && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowBulkSiteCreator(true)}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Configure Bulk Sites
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_bulk_users"
                  checked={formData.enable_bulk_users}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bulk_users: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_bulk_users" className="font-medium">Bulk User Creation</Label>
                  <p className="text-sm text-muted-foreground">Create multiple user accounts and send invitations</p>
                </div>
              </div>
              
              {formData.enable_bulk_users && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowBulkUserCreator(true)}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Configure Bulk Users
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRequirementsCompliance = () => (
    <div className="space-y-8">
      {/* Pain Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pain Points & Challenges
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Identify key challenges and pain points this project will address
          </p>
        </CardHeader>
        <CardContent>
          <ResourceLibraryIntegration
            onRequirementSelect={(requirement) => {
              addItem('pain_points', requirement.title);
            }}
            selectedItems={{
              requirements: formData.pain_points
            }}
            mode="select"
          />
          
          <div className="mt-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add custom pain point..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem('pain_points', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add custom pain point..."]') as HTMLInputElement;
                  if (input?.value) {
                    addItem('pain_points', input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.pain_points.map((point, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {point}
                  <button onClick={() => removeItem('pain_points', index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Success Criteria
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Define measurable success criteria for the project
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add success criterion..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem('success_criteria', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add success criterion..."]') as HTMLInputElement;
                  if (input?.value) {
                    addItem('success_criteria', input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.success_criteria.map((criterion, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {criterion}
                  <button onClick={() => removeItem('success_criteria', index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Use Cases
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select applicable use cases from the library or add custom ones
          </p>
        </CardHeader>
        <CardContent>
          <ResourceLibraryIntegration
            onUseCaseSelect={(useCase) => {
              addItem('use_cases', useCase.name || useCase.description || 'Use Case');
            }}
            selectedItems={{
              useCases: formData.use_cases
            }}
            mode="select"
          />
          
          <div className="mt-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add custom use case..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem('use_cases', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add custom use case..."]') as HTMLInputElement;
                  if (input?.value) {
                    addItem('use_cases', input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.use_cases.map((useCase, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {useCase}
                  <button onClick={() => removeItem('use_cases', index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Integration Requirements
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Specify systems and technologies that need to be integrated
          </p>
        </CardHeader>
        <CardContent>
          <ResourceLibraryIntegration
            onRequirementSelect={(requirement) => {
              addItem('integration_requirements', requirement.title);
            }}
            selectedItems={{
              requirements: formData.integration_requirements
            }}
            mode="select"
          />
          
          <div className="mt-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add integration requirement..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem('integration_requirements', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add integration requirement..."]') as HTMLInputElement;
                  if (input?.value) {
                    addItem('integration_requirements', input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.integration_requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <button onClick={() => removeItem('integration_requirements', index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Frameworks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Frameworks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select applicable compliance frameworks and regulations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {complianceOptions.map((framework) => (
              <div key={framework} className="flex items-center space-x-2">
                <Checkbox
                  id={`compliance-${framework}`}
                  checked={formData.compliance_frameworks.includes(framework)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData(prev => ({
                        ...prev,
                        compliance_frameworks: [...prev.compliance_frameworks, framework]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        compliance_frameworks: prev.compliance_frameworks.filter(f => f !== framework)
                      }));
                    }
                  }}
                />
                <Label htmlFor={`compliance-${framework}`} className="text-sm">
                  {framework}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeploymentStrategy = () => (
    <div className="space-y-8">
      {/* Deployment Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Deployment Strategy
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the optimal deployment approach for your project
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.deployment_strategy}
            onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_strategy: value as any }))}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: 'phased',
                  title: 'Phased Deployment',
                  description: 'Deploy in sequential phases across sites',
                  icon: <Layers className="h-5 w-5" />,
                  benefits: ['Lower risk', 'Lessons learned', 'Resource optimization']
                },
                {
                  value: 'parallel',
                  title: 'Parallel Deployment',
                  description: 'Deploy to multiple sites simultaneously',
                  icon: <Network className="h-5 w-5" />,
                  benefits: ['Faster completion', 'Consistent experience', 'Resource efficiency']
                },
                {
                  value: 'pilot-first',
                  title: 'Pilot First',
                  description: 'Start with pilot sites before full rollout',
                  icon: <Target className="h-5 w-5" />,
                  benefits: ['Risk mitigation', 'Validation', 'Stakeholder confidence']
                },
                {
                  value: 'big-bang',
                  title: 'Big Bang',
                  description: 'Deploy to all sites at once',
                  icon: <Zap className="h-5 w-5" />,
                  benefits: ['Fastest deployment', 'Immediate benefits', 'Simplified management']
                }
              ].map((strategy) => (
                <div key={strategy.value} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={strategy.value} id={strategy.value} />
                    <Label htmlFor={strategy.value} className="font-medium cursor-pointer">
                      {strategy.title}
                    </Label>
                  </div>
                  <Card className={`ml-6 p-4 transition-colors ${
                    formData.deployment_strategy === strategy.value ? 'bg-primary/5 border-primary/30' : ''
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1">
                        {strategy.icon}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">{strategy.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* AI-Generated Deployment Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Deployment Planning
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate optimized deployment phases and timeline using AI
              </p>
            </div>
            <Button
              onClick={generateDeploymentPlan}
              disabled={isGeneratingDeploymentPlan}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isGeneratingDeploymentPlan ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.phases.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click "Generate Plan" to create an AI-optimized deployment plan with phases and milestones.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="phases" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phases">Deployment Phases</TabsTrigger>
                <TabsTrigger value="milestones">Key Milestones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phases" className="space-y-4">
                {formData.phases.map((phase, index) => (
                  <Card key={phase.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">Phase {phase.order}</Badge>
                            <h4 className="font-medium">{phase.name}</h4>
                            {phase.criticalPath && (
                              <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                            )}
                          </div>
                          <Badge variant="secondary">{phase.estimatedDuration} days</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium mb-2">Deliverables</h5>
                            <ul className="space-y-1">
                              {phase.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Resources</h5>
                            <ul className="space-y-1">
                              {phase.resources.map((resource, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-blue-500" />
                                  {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Success Criteria</h5>
                            <ul className="space-y-1">
                              {phase.successCriteria.map((criteria, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <Target className="h-3 w-3 text-purple-500" />
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="milestones" className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <Card key={milestone.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{milestone.title}</h4>
                            {milestone.critical && (
                              <Badge variant="destructive" className="text-xs">Critical</Badge>
                            )}
                            <Badge variant="outline">{milestone.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          {milestone.acceptanceCriteria.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium mb-1">Acceptance Criteria:</h5>
                              <ul className="space-y-1 text-sm">
                                {milestone.acceptanceCriteria.map((criteria, idx) => (
                                  <li key={idx} className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {criteria}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{milestone.targetDate}</div>
                          <div className="text-xs text-muted-foreground">Target Date</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAIOptimization = () => (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-purple-50/50 via-background to-background border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Enhancement Features
          </CardTitle>
          <p className="text-muted-foreground">
            Enable AI-powered features to enhance your project management experience
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_ai_insights"
                  checked={formData.enable_ai_insights}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_ai_insights: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_ai_insights" className="font-medium">AI Insights & Recommendations</Label>
                  <p className="text-sm text-muted-foreground">Get intelligent recommendations throughout the project</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_auto_documentation"
                  checked={formData.enable_auto_documentation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_auto_documentation: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_auto_documentation" className="font-medium">Auto Documentation</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate project documentation</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_real_time_analytics"
                  checked={formData.enable_real_time_analytics}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_real_time_analytics: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_real_time_analytics" className="font-medium">Real-time Analytics</Label>
                  <p className="text-sm text-muted-foreground">Monitor project progress with live analytics</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="enable_portnox_automation"
                  checked={formData.enable_portnox_automation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_portnox_automation: !!checked }))}
                />
                <div>
                  <Label htmlFor="enable_portnox_automation" className="font-medium">Portnox Automation</Label>
                  <p className="text-sm text-muted-foreground">Enable automated Portnox configuration and deployment</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Summary */}
      {formData.ai_recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="space-y-2">
                {formData.ai_recommendations.timeline_optimization.map((rec, index) => (
                  <Alert key={index}>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
              
              <TabsContent value="risks" className="space-y-2">
                {formData.ai_recommendations.risk_mitigation.map((risk, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{risk}</AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-2">
                {formData.ai_recommendations.resource_allocation.map((resource, index) => (
                  <Alert key={index}>
                    <Users className="h-4 w-4" />
                    <AlertDescription>{resource}</AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
              
              <TabsContent value="technology" className="space-y-2">
                {formData.ai_recommendations.technology_stack.map((tech, index) => (
                  <Alert key={index}>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>{tech}</AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Project Health Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Basic Information', complete: !!(formData.name && formData.industry && formData.client_name) },
              { label: 'Business Analysis', complete: !!formData.business_analysis },
              { label: 'Geographic Setup', complete: !!(formData.primary_country && formData.total_sites) },
              { label: 'Team Assignment', complete: !!(formData.project_manager || formData.additional_stakeholders.length > 0) },
              { label: 'Sites Configuration', complete: formData.sites.length > 0 },
              { label: 'Requirements Defined', complete: formData.pain_points.length > 0 || formData.use_cases.length > 0 },
              { label: 'Deployment Strategy', complete: formData.phases.length > 0 },
              { label: 'AI Features Configured', complete: formData.enable_ai_insights }
            ].map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <span className="font-medium">{check.label}</span>
                <div className="flex items-center gap-2">
                  {check.complete ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewCreate = () => {
    const progressPercentage = Math.round(
      ([
        !!(formData.name && formData.industry),
        !!formData.business_analysis,
        !!(formData.primary_country && formData.total_sites),
        !!(formData.project_manager || formData.additional_stakeholders.length > 0),
        formData.sites.length > 0,
        formData.pain_points.length > 0 || formData.use_cases.length > 0,
        formData.phases.length > 0,
        formData.enable_ai_insights
      ].filter(Boolean).length / 8) * 100
    );

    return (
      <div className="space-y-8">
        <Card className="bg-gradient-to-br from-emerald-50/50 via-background to-background border-emerald-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Project Summary
            </CardTitle>
            <p className="text-muted-foreground">
              Review your project configuration before creation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Project Completion</span>
                <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.sites.length}</div>
                    <div className="text-sm text-muted-foreground">Deployment Sites</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.phases.length}</div>
                    <div className="text-sm text-muted-foreground">Deployment Phases</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.milestones.length}</div>
                    <div className="text-sm text-muted-foreground">Key Milestones</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.additional_stakeholders.length}</div>
                    <div className="text-sm text-muted-foreground">Stakeholders</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.pain_points.length}</div>
                    <div className="text-sm text-muted-foreground">Pain Points</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{formData.use_cases.length}</div>
                    <div className="text-sm text-muted-foreground">Use Cases</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Industry:</strong> {formData.industry}</div>
                    <div><strong>Type:</strong> {projectTemplates[formData.project_type]?.title}</div>
                    <div><strong>Client:</strong> {formData.client_name}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Scale & Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Sites:</strong> {formData.total_sites}</div>
                    <div><strong>Endpoints:</strong> {formData.total_endpoints}</div>
                    <div><strong>Strategy:</strong> {formData.deployment_strategy}</div>
                    {formData.start_date && (
                      <div><strong>Start:</strong> {format(formData.start_date, "PPP")}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Team & Ownership</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Project Manager:</strong> {formData.project_manager || 'Not assigned'}</div>
                    <div><strong>Business Owner:</strong> {formData.project_owner || 'Not assigned'}</div>
                    <div><strong>Technical Lead:</strong> {formData.technical_owner || 'Not assigned'}</div>
                    <div><strong>Portnox Rep:</strong> {formData.portnox_owner || 'Not assigned'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">AI Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {formData.enable_ai_insights ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      AI Insights & Recommendations
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.enable_auto_documentation ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Auto Documentation
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.enable_real_time_analytics ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Real-time Analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {formData.business_analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Business Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Business Summary</h4>
                  <p className="text-sm text-muted-foreground">{formData.business_summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Opportunities</h4>
                    <ul className="space-y-1 text-sm">
                      {formData.business_analysis.opportunities.slice(0, 3).map((opp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <ul className="space-y-1 text-sm">
                      {formData.business_analysis.riskAssessment.slice(0, 3).map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Ready to Create Project?</CardTitle>
            <p className="text-muted-foreground">
              Once created, you'll be redirected to the project dashboard where you can track progress and manage implementation.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleCreateProject}
                disabled={isPending || !formData.name || !formData.industry}
                className="bg-gradient-primary hover:opacity-90 px-8 py-3 text-lg"
                size="lg"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center space-y-4">
            <Badge variant="glow" className="mb-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Ultimate Project Creation
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Your NAC Project
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Experience the most comprehensive project creation wizard with AI-powered insights, 
              business analysis, detailed planning, and intelligent recommendations.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-muted-foreground">{calculateProgress()}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center min-w-0">
                    <div className="flex flex-col items-center min-w-0">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                        ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                          isCompleted ? 'border-primary bg-primary/10 text-primary' : 
                          'border-border bg-background text-muted-foreground'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="mt-2 text-center min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-24">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.industry)) ||
                    (currentStep === 5 && formData.sites.length === 0)
                  }
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={isPending || !formData.name || !formData.industry}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialogs and Bulk Operations */}
        {showBulkSiteCreator && (
          <Dialog open={showBulkSiteCreator} onOpenChange={setShowBulkSiteCreator}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bulk Site Creation</DialogTitle>
              </DialogHeader>
              <BulkSiteCreator
                isOpen={showBulkSiteCreator}
                onClose={() => setShowBulkSiteCreator(false)}
                onSubmit={(sites) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    sites: [...prev.sites, ...sites.map(site => ({
                      id: `bulk-${Date.now()}-${Math.random()}`,
                      name: site.name,
                      location: site.location,
                      address: site.address || '',
                      type: (site.site_type === 'headquarters' || site.site_type === 'branch' || site.site_type === 'datacenter' || site.site_type === 'remote' || site.site_type === 'clinic' || site.site_type === 'factory' || site.site_type === 'warehouse' || site.site_type === 'office') ? site.site_type : 'office',
                      estimatedUsers: site.estimated_users || 100,
                      complexity: site.priority === 'high' ? 'complex' : 'simple',
                      networkDevices: site.device_count || 0,
                      timeline: { start: new Date(), end: new Date() },
                      status: 'planning' as const,
                      riskLevel: 'low' as const,
                      priority: site.priority || 'medium' as const
                    }))]
                  }));
                  setShowBulkSiteCreator(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {showBulkUserCreator && (
          <Dialog open={showBulkUserCreator} onOpenChange={setShowBulkUserCreator}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bulk User Creation</DialogTitle>
              </DialogHeader>
              <BulkUserCreator
                isOpen={showBulkUserCreator}
                onClose={() => setShowBulkUserCreator(false)}
                onSubmit={(users) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    additional_stakeholders: [...prev.additional_stakeholders, ...users.map(user => ({
                      email: user.email,
                      role: user.role === 'project_viewer' ? 'project_viewer' : 
                           user.role === 'project_editor' ? 'project_viewer' : 
                           user.role === 'project_manager' ? 'project_creator' : 
                           user.role === 'site_manager' ? 'viewer' : 'contact' as const,
                      name: user.name,
                      createUser: true,
                      sendInvitation: user.sendInvitation || false,
                      responsibilities: []
                    }))] 
                  }));
                  setShowBulkUserCreator(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default UltimateProjectCreationWizard;