import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  Beaker,
  Rocket,
  Target,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Network,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  GitBranch,
  Activity,
  MapPin,
  DollarSign,
  Timer,
  Award,
  XCircle,
  Layers,
  Monitor,
  Server,
  Database,
  Globe,
  Lock,
  Wifi,
  TestTube,
  FlaskConical,
  Gauge,
  LineChart,
  PieChart,
  TrendingDown
} from "lucide-react";

// Unified Project Interface
interface UnifiedProject {
  id: string;
  name: string;
  client: string;
  industry: string;
  type: 'scoping' | 'poc' | 'pilot' | 'deployment' | 'migration' | 'maintenance';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'delayed';
  stage: string;
  subStage?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Timeline
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  lastUpdate: string;
  nextMilestone?: string;
  
  // Financial
  budget?: number;
  spent?: number;
  projectedSpend?: number;
  
  // Team & Resources
  projectManager?: string;
  leadEngineer?: string;
  techLead?: string;
  team: TeamMember[];
  stakeholders: Stakeholder[];
  
  // Scope & Scale
  totalEndpoints: number;
  totalSites: number;
  environment: 'production' | 'staging' | 'lab' | 'hybrid';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  
  // Project Specific Data
  scopingData?: ScopingData;
  pocData?: POCData;
  deploymentData?: DeploymentData;
  migrationData?: MigrationData;
  
  // Workflow & Tasks
  workflow: WorkflowPhase[];
  blockers: ProjectBlocker[];
  risks: ProjectRisk[];
  deliverables: ProjectDeliverable[];
  
  // Performance Metrics
  metrics: ProjectMetrics;
  kpis: ProjectKPI[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  allocation: number;
  skills: string[];
  startDate: string;
  endDate?: string;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  contact: string;
  engagement: 'champion' | 'supporter' | 'neutral' | 'skeptic' | 'blocker';
  influence: 'high' | 'medium' | 'low';
  involvement: 'daily' | 'weekly' | 'milestone' | 'ad-hoc';
}

interface WorkflowPhase {
  id: string;
  name: string;
  category: 'discovery' | 'design' | 'build' | 'test' | 'deploy' | 'operate';
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'skipped';
  progress: number;
  startDate?: string;
  endDate?: string;
  estimatedDays: number;
  actualDays?: number;
  dependencies: string[];
  owner?: string;
  tasks: PhaseTask[];
  gates: QualityGate[];
}

interface PhaseTask {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  assignedTo?: string;
  estimatedHours: number;
  actualHours?: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  dependencies: string[];
}

interface QualityGate {
  id: string;
  name: string;
  criteria: string[];
  status: 'pending' | 'passed' | 'failed' | 'waived';
  approver?: string;
  approvalDate?: string;
  notes?: string;
}

interface ProjectBlocker {
  id: string;
  type: 'technical' | 'resource' | 'approval' | 'vendor' | 'client' | 'regulatory';
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  urgency: 'immediate' | 'this-week' | 'this-month' | 'next-quarter';
  assignedTo?: string;
  targetResolution?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  createdDate: string;
  resolvedDate?: string;
}

interface ProjectRisk {
  id: string;
  category: 'technical' | 'schedule' | 'budget' | 'resource' | 'client' | 'regulatory';
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  mitigation: string;
  contingency: string;
  owner?: string;
  status: 'identified' | 'mitigating' | 'monitoring' | 'realized' | 'closed';
}

interface ProjectDeliverable {
  id: string;
  name: string;
  type: 'document' | 'software' | 'configuration' | 'training' | 'report';
  description: string;
  status: 'not-started' | 'in-progress' | 'review' | 'approved' | 'delivered';
  assignedTo?: string;
  reviewer?: string;
  dueDate?: string;
  completedDate?: string;
  version: string;
  location?: string;
}

interface ProjectMetrics {
  plannedVsActual: {
    schedule: number;
    budget: number;
    scope: number;
  };
  quality: {
    defectRate: number;
    testPassRate: number;
    clientSatisfaction: number;
  };
  productivity: {
    velocityTrend: number[];
    burndownRate: number;
    teamEfficiency: number;
  };
  business: {
    roi: number;
    timeToValue: number;
    adoptionRate: number;
  };
}

interface ProjectKPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'at-risk' | 'off-track';
}

// Type-specific interfaces
interface ScopingData {
  questionnaires: { id: string; name: string; status: string; completion: number; }[];
  requirements: { id: string; category: string; priority: string; status: string; }[];
  useCases: { id: string; name: string; complexity: string; priority: string; }[];
  assessment: {
    networkReadiness: number;
    securityPosture: number;
    complianceGaps: string[];
    recommendations: string[];
  };
}

interface POCData {
  objectives: string[];
  successCriteria: SuccessCriteria[];
  testScenarios: TestScenario[];
  infrastructure: POCInfrastructure;
  results: POCResults;
  conclusion: POCConclusion;
}

interface SuccessCriteria {
  id: string;
  category: string;
  description: string;
  target: string;
  measurement: string;
  status: 'pending' | 'met' | 'exceeded' | 'failed';
  actualResult?: string;
}

interface TestScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'blocked';
  executionDate?: string;
  executedBy?: string;
}

interface POCInfrastructure {
  environment: 'customer-lab' | 'portnox-lab' | 'hybrid' | 'cloud';
  endpoints: number;
  deviceTypes: string[];
  networkSegments: number;
  integrations: string[];
  duration: string;
}

interface POCResults {
  performance: {
    throughput: number;
    latency: number;
    availability: number;
    scalability: number;
  };
  security: {
    threatDetection: number;
    policyCompliance: number;
    incidentResponse: number;
  };
  usability: {
    userExperience: number;
    adminEfficiency: number;
    troubleshooting: number;
  };
}

interface POCConclusion {
  recommendation: 'proceed' | 'proceed-with-conditions' | 'redesign' | 'abort';
  confidence: number;
  nextSteps: string[];
  lessons: string[];
  risks: string[];
}

interface DeploymentData {
  strategy: 'big-bang' | 'phased' | 'pilot' | 'canary' | 'blue-green';
  phases: DeploymentPhase[];
  rollout: RolloutPlan;
  infrastructure: DeploymentInfrastructure;
  testing: DeploymentTesting;
  cutover: CutoverPlan;
}

interface DeploymentPhase {
  id: string;
  name: string;
  sites: string[];
  endpoints: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'ready' | 'in-progress' | 'completed' | 'failed';
  successCriteria: string[];
  dependencies: string[];
}

interface RolloutPlan {
  approach: string;
  riskMitigation: string[];
  rollbackTriggers: string[];
  communicationPlan: string[];
  trainingSchedule: string[];
}

interface DeploymentInfrastructure {
  environments: string[];
  servers: number;
  networkDevices: number;
  securityControls: string[];
  monitoringTools: string[];
  backupStrategy: string;
}

interface DeploymentTesting {
  unitTests: number;
  integrationTests: number;
  systemTests: number;
  acceptanceTests: number;
  performanceTests: number;
  securityTests: number;
}

interface CutoverPlan {
  activities: CutoverActivity[];
  rollbackPlan: string[];
  communicationTree: string[];
  successCriteria: string[];
}

interface CutoverActivity {
  id: string;
  name: string;
  duration: number;
  owner: string;
  dependencies: string[];
  rollbackTime: number;
}

interface MigrationData {
  sourceSystem: string;
  targetSystem: string;
  migrationApproach: string;
  dataMapping: DataMapping[];
  timeline: MigrationTimeline;
  validation: MigrationValidation;
}

interface DataMapping {
  source: string;
  target: string;
  transformation: string;
  validation: string;
  status: 'pending' | 'mapped' | 'validated' | 'migrated';
}

interface MigrationTimeline {
  phases: string[];
  freezeDate: string;
  cutoverWindow: string;
  rollbackWindow: string;
}

interface MigrationValidation {
  dataIntegrity: number;
  functionalTesting: number;
  performanceTesting: number;
  userAcceptance: number;
}

const UnifiedProjectManager = () => {
  const [activeView, setActiveView] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    stage: "all",
    team: "all"
  });

  // Comprehensive workflow templates for different project types
  const workflowTemplates = {
    scoping: [
      { name: "Initial Assessment", category: "discovery" as const, estimatedDays: 3 },
      { name: "Stakeholder Alignment", category: "discovery" as const, estimatedDays: 2 },
      { name: "Technical Discovery", category: "discovery" as const, estimatedDays: 5 },
      { name: "Requirements Analysis", category: "design" as const, estimatedDays: 7 },
      { name: "Use Case Mapping", category: "design" as const, estimatedDays: 4 },
      { name: "Risk Assessment", category: "design" as const, estimatedDays: 3 },
      { name: "Solution Architecture", category: "design" as const, estimatedDays: 5 },
      { name: "Recommendations", category: "design" as const, estimatedDays: 2 },
      { name: "Client Presentation", category: "deploy" as const, estimatedDays: 1 }
    ],
    poc: [
      { name: "POC Planning", category: "discovery" as const, estimatedDays: 3 },
      { name: "Environment Setup", category: "build" as const, estimatedDays: 5 },
      { name: "Configuration", category: "build" as const, estimatedDays: 7 },
      { name: "Integration Setup", category: "build" as const, estimatedDays: 5 },
      { name: "Use Case Testing", category: "test" as const, estimatedDays: 10 },
      { name: "Performance Validation", category: "test" as const, estimatedDays: 5 },
      { name: "Security Validation", category: "test" as const, estimatedDays: 3 },
      { name: "Results Analysis", category: "test" as const, estimatedDays: 3 },
      { name: "Recommendation Report", category: "deploy" as const, estimatedDays: 2 },
      { name: "Go/No-Go Decision", category: "deploy" as const, estimatedDays: 1 }
    ],
    pilot: [
      { name: "Pilot Planning", category: "discovery" as const, estimatedDays: 5 },
      { name: "Site Preparation", category: "build" as const, estimatedDays: 7 },
      { name: "Infrastructure Setup", category: "build" as const, estimatedDays: 10 },
      { name: "System Configuration", category: "build" as const, estimatedDays: 10 },
      { name: "Initial Testing", category: "test" as const, estimatedDays: 7 },
      { name: "User Training", category: "deploy" as const, estimatedDays: 3 },
      { name: "Go-Live", category: "deploy" as const, estimatedDays: 2 },
      { name: "Stabilization", category: "operate" as const, estimatedDays: 14 },
      { name: "Performance Review", category: "operate" as const, estimatedDays: 3 },
      { name: "Scaling Decision", category: "operate" as const, estimatedDays: 2 }
    ],
    deployment: [
      { name: "Deployment Strategy", category: "discovery" as const, estimatedDays: 7 },
      { name: "Infrastructure Design", category: "design" as const, estimatedDays: 10 },
      { name: "Environment Setup", category: "build" as const, estimatedDays: 14 },
      { name: "System Integration", category: "build" as const, estimatedDays: 14 },
      { name: "Phase 1 Rollout", category: "deploy" as const, estimatedDays: 21 },
      { name: "Phase 1 Validation", category: "test" as const, estimatedDays: 7 },
      { name: "Phase 2 Rollout", category: "deploy" as const, estimatedDays: 21 },
      { name: "Phase 2 Validation", category: "test" as const, estimatedDays: 7 },
      { name: "Final Rollout", category: "deploy" as const, estimatedDays: 21 },
      { name: "System Stabilization", category: "operate" as const, estimatedDays: 14 },
      { name: "Knowledge Transfer", category: "operate" as const, estimatedDays: 5 },
      { name: "Project Handover", category: "operate" as const, estimatedDays: 3 }
    ]
  };

  // Initialize with comprehensive mock data
  useEffect(() => {
    const mockProjects: UnifiedProject[] = [
      {
        id: "unif-001",
        name: "Global Financial Services Deployment",
        client: "International Banking Corporation",
        industry: "Financial Services",
        type: "deployment",
        status: "in-progress",
        stage: "Phase 2 - Core Deployment",
        subStage: "Site Integration",
        priority: "critical",
        progress: 68,
        healthScore: 82,
        riskLevel: "medium",
        startDate: "2024-01-15",
        targetEndDate: "2024-07-30",
        lastUpdate: "2024-02-15",
        nextMilestone: "Phase 2 Go-Live - March 1",
        budget: 1200000,
        spent: 480000,
        projectedSpend: 650000,
        projectManager: "Sarah Johnson",
        leadEngineer: "Michael Chen",
        techLead: "David Rodriguez",
        totalEndpoints: 5000,
        totalSites: 12,
        environment: "production",
        complexity: "enterprise",
        team: [
          { id: "tm1", name: "Sarah Johnson", role: "Project Manager", email: "s.johnson@company.com", allocation: 100, skills: ["PMP", "Agile", "Risk Management"], startDate: "2024-01-15" },
          { id: "tm2", name: "Michael Chen", role: "Lead Engineer", email: "m.chen@company.com", allocation: 100, skills: ["NAC", "Network Security", "Python"], startDate: "2024-01-15" },
          { id: "tm3", name: "David Rodriguez", role: "Technical Lead", email: "d.rodriguez@company.com", allocation: 80, skills: ["System Architecture", "Cloud", "DevOps"], startDate: "2024-01-20" }
        ],
        stakeholders: [
          { id: "sh1", name: "Robert Smith", role: "CISO", organization: "Client", contact: "r.smith@bank.com", engagement: "champion", influence: "high", involvement: "weekly" },
          { id: "sh2", name: "Lisa Wang", role: "Network Manager", organization: "Client", contact: "l.wang@bank.com", engagement: "supporter", influence: "medium", involvement: "daily" }
        ],
        workflow: [],
        blockers: [
          {
            id: "blk1",
            type: "approval",
            title: "Firewall Change Approval",
            description: "Production firewall changes require executive approval",
            impact: "medium",
            urgency: "this-week",
            assignedTo: "tm1",
            targetResolution: "2024-02-20",
            status: "in-progress",
            createdDate: "2024-02-10"
          }
        ],
        risks: [
          {
            id: "rsk1",
            category: "technical",
            title: "Legacy System Integration",
            description: "Integration with 20-year-old mainframe systems",
            probability: "medium",
            impact: "high",
            riskScore: 6,
            mitigation: "Develop custom API adapters",
            contingency: "Manual reconciliation process",
            owner: "tm2",
            status: "mitigating"
          }
        ],
        deliverables: [
          {
            id: "del1",
            name: "System Architecture Document",
            type: "document",
            description: "Comprehensive system architecture and design",
            status: "approved",
            assignedTo: "tm3",
            reviewer: "tm2",
            completedDate: "2024-02-01",
            version: "v2.1",
            location: "SharePoint/Architecture"
          }
        ],
        metrics: {
          plannedVsActual: { schedule: 95, budget: 92, scope: 100 },
          quality: { defectRate: 2.1, testPassRate: 96.5, clientSatisfaction: 8.7 },
          productivity: { velocityTrend: [85, 92, 88, 95], burndownRate: 0.85, teamEfficiency: 89 },
          business: { roi: 320, timeToValue: 180, adoptionRate: 78 }
        },
        kpis: [
          { id: "kpi1", name: "Schedule Performance", target: 100, actual: 95, unit: "%", trend: "stable", status: "on-track" },
          { id: "kpi2", name: "Budget Performance", target: 100, actual: 92, unit: "%", trend: "down", status: "at-risk" }
        ],
        deploymentData: {
          strategy: "phased",
          phases: [
            { id: "ph1", name: "Pilot Phase", sites: ["HQ", "Branch-A"], endpoints: 500, startDate: "2024-01-15", endDate: "2024-02-15", status: "completed", successCriteria: ["Zero downtime", "100% device recognition"], dependencies: [] },
            { id: "ph2", name: "Phase 1", sites: ["Branch-B", "Branch-C"], endpoints: 1500, startDate: "2024-02-16", endDate: "2024-04-15", status: "in-progress", successCriteria: ["95% success rate", "Policy compliance"], dependencies: ["ph1"] }
          ],
          rollout: {
            approach: "Risk-based phased deployment",
            riskMitigation: ["Parallel testing", "Rollback procedures", "24/7 monitoring"],
            rollbackTriggers: ["System downtime > 5 minutes", "Security breach", "Policy failure rate > 5%"],
            communicationPlan: ["Daily standups", "Weekly stakeholder updates", "Incident notifications"],
            trainingSchedule: ["Admin training - Week 1", "User training - Week 2", "Support training - Week 3"]
          },
          infrastructure: {
            environments: ["Production", "Staging", "DR"],
            servers: 8,
            networkDevices: 45,
            securityControls: ["Firewalls", "IDS/IPS", "SIEM", "Endpoint Protection"],
            monitoringTools: ["PRTG", "SolarWinds", "Splunk"],
            backupStrategy: "3-2-1 with cloud replication"
          },
          testing: {
            unitTests: 250,
            integrationTests: 85,
            systemTests: 45,
            acceptanceTests: 25,
            performanceTests: 15,
            securityTests: 35
          },
          cutover: {
            activities: [
              { id: "cut1", name: "System Backup", duration: 2, owner: "Infrastructure Team", dependencies: [], rollbackTime: 1 },
              { id: "cut2", name: "DNS Cutover", duration: 0.5, owner: "Network Team", dependencies: ["cut1"], rollbackTime: 0.25 }
            ],
            rollbackPlan: ["Immediate DNS revert", "System restore from backup", "Service restart procedures"],
            communicationTree: ["Project Manager", "Technical Lead", "Client SPOC", "Support Team"],
            successCriteria: ["All systems green", "User authentication working", "Monitoring active"]
          }
        }
      },
      {
        id: "unif-002",
        name: "Healthcare IoT Security POC",
        client: "Regional Medical Center",
        industry: "Healthcare",
        type: "poc",
        status: "in-progress",
        stage: "Validation Testing",
        priority: "high",
        progress: 75,
        healthScore: 91,
        riskLevel: "low",
        startDate: "2024-02-01",
        targetEndDate: "2024-03-15",
        lastUpdate: "2024-02-14",
        nextMilestone: "POC Results Review - Feb 28",
        budget: 150000,
        spent: 89000,
        totalEndpoints: 300,
        totalSites: 2,
        environment: "lab",
        complexity: "moderate",
        team: [
          { id: "tm4", name: "Jennifer Lee", role: "POC Lead", email: "j.lee@company.com", allocation: 100, skills: ["Healthcare IT", "HIPAA", "IoT Security"], startDate: "2024-02-01" },
          { id: "tm5", name: "Alex Kumar", role: "Security Engineer", email: "a.kumar@company.com", allocation: 80, skills: ["Medical Devices", "Network Security", "Compliance"], startDate: "2024-02-01" }
        ],
        stakeholders: [
          { id: "sh3", name: "Dr. Emily Watson", role: "Chief Medical Officer", organization: "Client", contact: "e.watson@medical.com", engagement: "champion", influence: "high", involvement: "milestone" }
        ],
        workflow: [],
        blockers: [],
        risks: [],
        deliverables: [],
        metrics: {
          plannedVsActual: { schedule: 98, budget: 89, scope: 100 },
          quality: { defectRate: 1.2, testPassRate: 98.5, clientSatisfaction: 9.2 },
          productivity: { velocityTrend: [90, 95, 92, 98], burndownRate: 0.95, teamEfficiency: 94 },
          business: { roi: 0, timeToValue: 0, adoptionRate: 0 }
        },
        kpis: [
          { id: "kpi3", name: "Test Pass Rate", target: 95, actual: 98.5, unit: "%", trend: "up", status: "on-track" },
          { id: "kpi4", name: "Device Coverage", target: 100, actual: 87, unit: "%", trend: "up", status: "on-track" }
        ],
        pocData: {
          objectives: [
            "Validate medical device authentication",
            "Test network segmentation for patient data",
            "Verify HIPAA compliance capabilities",
            "Demonstrate IoT device visibility and control"
          ],
          successCriteria: [
            { id: "sc1", category: "Security", description: "100% device authentication", target: "100%", measurement: "Device auth success rate", status: "met", actualResult: "100%" },
            { id: "sc2", category: "Compliance", description: "HIPAA compliance validation", target: "Pass", measurement: "Audit checklist", status: "pending" }
          ],
          testScenarios: [
            { id: "ts1", name: "Medical Device Onboarding", category: "Authentication", description: "Test automatic discovery and authentication of medical devices", steps: ["Connect device", "Monitor discovery", "Validate authentication"], expectedOutcome: "Device authenticated within 30 seconds", status: "passed", executionDate: "2024-02-10", executedBy: "tm5", actualOutcome: "Device authenticated in 15 seconds" }
          ],
          infrastructure: {
            environment: "customer-lab",
            endpoints: 300,
            deviceTypes: ["MRI Machines", "Infusion Pumps", "Patient Monitors", "Workstations"],
            networkSegments: 4,
            integrations: ["Active Directory", "Epic EMR", "Cisco ISE"],
            duration: "6 weeks"
          },
          results: {
            performance: { throughput: 95, latency: 12, availability: 99.8, scalability: 88 },
            security: { threatDetection: 96, policyCompliance: 94, incidentResponse: 92 },
            usability: { userExperience: 89, adminEfficiency: 93, troubleshooting: 87 }
          },
          conclusion: {
            recommendation: "proceed",
            confidence: 92,
            nextSteps: ["Pilot deployment planning", "Production environment sizing", "Training program development"],
            lessons: ["Medical device discovery requires extended timeout", "Integration with Epic needs additional API calls"],
            risks: ["Medical device firmware compatibility", "Network latency in real-time scenarios"]
          }
        }
      }
    ];

    setProjects(mockProjects);
  }, []);

  // Filter projects based on current filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.client.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.industry.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || project.type === filters.type;
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
    const matchesStage = filters.stage === 'all' || project.stage.toLowerCase().includes(filters.stage.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesStage;
  });

  // Calculate comprehensive statistics
  const stats = {
    total: projects.length,
    byType: {
      scoping: projects.filter(p => p.type === 'scoping').length,
      poc: projects.filter(p => p.type === 'poc').length,
      pilot: projects.filter(p => p.type === 'pilot').length,
      deployment: projects.filter(p => p.type === 'deployment').length,
      migration: projects.filter(p => p.type === 'migration').length,
      maintenance: projects.filter(p => p.type === 'maintenance').length
    },
    byStatus: {
      planning: projects.filter(p => p.status === 'planning').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      onHold: projects.filter(p => p.status === 'on-hold').length,
      completed: projects.filter(p => p.status === 'completed').length,
      cancelled: projects.filter(p => p.status === 'cancelled').length,
      delayed: projects.filter(p => p.status === 'delayed').length
    },
    byPriority: {
      critical: projects.filter(p => p.priority === 'critical').length,
      high: projects.filter(p => p.priority === 'high').length,
      medium: projects.filter(p => p.priority === 'medium').length,
      low: projects.filter(p => p.priority === 'low').length
    },
    byRisk: {
      critical: projects.filter(p => p.riskLevel === 'critical').length,
      high: projects.filter(p => p.riskLevel === 'high').length,
      medium: projects.filter(p => p.riskLevel === 'medium').length,
      low: projects.filter(p => p.riskLevel === 'low').length
    },
    averages: {
      progress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length),
      healthScore: Math.round(projects.reduce((acc, p) => acc + p.healthScore, 0) / projects.length),
      budget: projects.reduce((acc, p) => acc + (p.budget || 0), 0),
      endpoints: projects.reduce((acc, p) => acc + p.totalEndpoints, 0),
      sites: projects.reduce((acc, p) => acc + p.totalSites, 0)
    }
  };

  // Utility functions for styling
  const getStatusColor = (status: string) => {
    const statusColors = {
      'planning': 'bg-gray-100 text-gray-800 border-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'delayed': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskColor = (risk: string) => {
    const riskColors = {
      'critical': 'text-red-500',
      'high': 'text-orange-500',
      'medium': 'text-yellow-500',
      'low': 'text-green-500'
    };
    return riskColors[risk as keyof typeof riskColors] || 'text-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      'scoping': <Search className="w-4 h-4" />,
      'poc': <FlaskConical className="w-4 h-4" />,
      'pilot': <TestTube className="w-4 h-4" />,
      'deployment': <Rocket className="w-4 h-4" />,
      'migration': <RotateCcw className="w-4 h-4" />,
      'maintenance': <Settings className="w-4 h-4" />
    };
    return typeIcons[type as keyof typeof typeIcons] || <Target className="w-4 h-4" />;
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleCreateProject = () => {
    setIsCreateDialogOpen(true);
  };

  const handleProjectSelect = (project: UnifiedProject) => {
    setSelectedProject(project);
    setActiveView("details");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header with Action Bar */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30 shadow-elevated">
        <CardHeader>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-4xl bg-gradient-primary bg-clip-text text-transparent">
                    Unified Project Manager
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    Complete project lifecycle management for NAC deployments
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3">
                <Badge variant="glow" className="text-sm px-3 py-2">
                  <Activity className="w-3 h-3 mr-2 animate-pulse" />
                  {stats.byStatus.inProgress} Active
                </Badge>
                <Badge variant="outline" className="text-primary border-primary/30">
                  <Brain className="w-3 h-3 mr-2" />
                  AI-Enhanced
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Shield className="w-3 h-3 mr-2" />
                  {stats.averages.healthScore}% Health
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="hover:bg-accent/60">
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comprehensive Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
        {/* Project Type Stats */}
        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Search className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">SCOPING</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">{stats.byType.scoping}</div>
            <div className="text-xs text-muted-foreground">Discovery Phase</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FlaskConical className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-muted-foreground">POC</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">{stats.byType.poc}</div>
            <div className="text-xs text-muted-foreground">Proof of Concept</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TestTube className="w-5 h-5 text-cyan-500" />
              <span className="text-xs text-muted-foreground">PILOT</span>
            </div>
            <div className="text-2xl font-bold text-cyan-500">{stats.byType.pilot}</div>
            <div className="text-xs text-muted-foreground">Limited Deploy</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Rocket className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">DEPLOYMENT</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{stats.byType.deployment}</div>
            <div className="text-xs text-muted-foreground">Full Rollout</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">MIGRATION</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">{stats.byType.migration}</div>
            <div className="text-xs text-muted-foreground">System Migration</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-xs text-muted-foreground">SUPPORT</span>
            </div>
            <div className="text-2xl font-bold text-gray-500">{stats.byType.maintenance}</div>
            <div className="text-xs text-muted-foreground">Maintenance</div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <Card className="col-span-3 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">ACTIVE PROJECTS</span>
            </div>
            <div className="text-3xl font-bold text-primary">{stats.byStatus.inProgress}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className={`w-5 h-5 ${getHealthColor(stats.averages.healthScore)}`} />
              <span className="text-xs text-muted-foreground">HEALTH SCORE</span>
            </div>
            <div className={`text-3xl font-bold ${getHealthColor(stats.averages.healthScore)}`}>
              {stats.averages.healthScore}%
            </div>
            <div className="text-xs text-muted-foreground">Average Health</div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-muted-foreground">TOTAL BUDGET</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${(stats.averages.budget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-muted-foreground">ENDPOINTS</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {(stats.averages.endpoints / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-muted-foreground">Total Managed</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Project Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Advanced Filters */}
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search projects, clients, or industry..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-40 bg-background/50 border-border/50">
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="scoping">Scoping</SelectItem>
                      <SelectItem value="poc">POC</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="migration">Migration</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-40 bg-background/50 border-border/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-40 bg-background/50 border-border/50">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="hover:bg-accent/60">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50"
                onClick={() => handleProjectSelect(project)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(project.type)}
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{project.client}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>{project.industry}</span>
                        <span>•</span>
                        <span>{project.totalSites} sites</span>
                        <span>•</span>
                        <span>{project.totalEndpoints.toLocaleString()} endpoints</span>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{project.stage}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress and Health */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${getHealthColor(project.healthScore)}`} />
                        <span className="text-sm text-muted-foreground">Health Score</span>
                      </div>
                      <span className={`text-sm font-medium ${getHealthColor(project.healthScore)}`}>
                        {project.healthScore}%
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-sm font-medium text-primary">
                        {project.budget ? `$${(project.budget / 1000).toFixed(0)}K` : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
                        {project.riskLevel.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-primary">{project.team.length}</div>
                      <div className="text-xs text-muted-foreground">Team</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>Target: {new Date(project.targetEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(project.lastUpdate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                        <Edit className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Adjust your filters or create a new project to get started.
                </p>
                <Button onClick={handleCreateProject} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tabs content would go here - keeping concise for now */}
        <TabsContent value="active" className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Active Projects Dashboard</h3>
              <p className="text-muted-foreground">
                Detailed view of in-progress projects with real-time updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <GitBranch className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Pipeline</h3>
              <p className="text-muted-foreground">
                Upcoming projects and capacity planning.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Analytics</h3>
              <p className="text-muted-foreground">
                Performance metrics and business intelligence.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resource Management</h3>
              <p className="text-muted-foreground">
                Team allocation and capacity planning.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Create New Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" placeholder="Enter project name" />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" placeholder="Client organization" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scoping">Scoping & Assessment</SelectItem>
                      <SelectItem value="poc">Proof of Concept</SelectItem>
                      <SelectItem value="pilot">Pilot Deployment</SelectItem>
                      <SelectItem value="deployment">Full Deployment</SelectItem>
                      <SelectItem value="migration">System Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
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
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" type="number" placeholder="Project budget" />
                </div>
                <div>
                  <Label htmlFor="endpoints">Total Endpoints</Label>
                  <Input id="endpoints" type="number" placeholder="Number of endpoints" />
                </div>
                <div>
                  <Label htmlFor="sites">Total Sites</Label>
                  <Input id="sites" type="number" placeholder="Number of sites" />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide a detailed description of the project..." 
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => {
                  toast.success("Project created successfully!");
                  setIsCreateDialogOpen(false);
                }}
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedProjectManager;
