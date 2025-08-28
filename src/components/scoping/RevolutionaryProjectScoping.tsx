import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, Brain, Target, Map, Compass, Navigation,
  Building, Users, Globe, Shield, Zap, Database,
  FileText, GitBranch, Package, Terminal, BookOpen,
  ChevronRight, ChevronLeft, CheckCircle, XCircle,
  AlertTriangle, Layers, Filter, Play, Pause, RotateCw,
  MessageSquare, Lightbulb, TrendingUp, Award, Star,
  Clock, Calendar, DollarSign, BarChart3, PieChart,
  Network, Cloud, Server, Lock, Key, Settings
} from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RevolutionaryProjectScopingProps {
  onComplete?: (scope: ProjectScope) => void;
}

interface ProjectScope {
  id: string;
  name: string;
  company: CompanyProfile;
  objectives: Objective[];
  requirements: Requirement[];
  timeline: Timeline;
  budget: Budget;
  risks: Risk[];
  deliverables: Deliverable[];
  successCriteria: SuccessCriteria[];
  recommendations: AIRecommendation[];
  score: ScopeScore;
}

interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  locations: number;
  devices: number;
  users: number;
  currentState: string;
  desiredState: string;
  painPoints: string[];
  priorities: string[];
}

interface Objective {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  measurable: boolean;
  kpi: string;
}

interface Requirement {
  id: string;
  category: string;
  requirement: string;
  priority: number;
  vendor: string;
  effort: number;
}

interface Timeline {
  phases: TimelinePhase[];
  totalDuration: number;
  startDate: Date;
  endDate: Date;
}

interface TimelinePhase {
  name: string;
  duration: number;
  dependencies: string[];
  milestones: string[];
}

interface Budget {
  total: number;
  breakdown: BudgetItem[];
  roi: ROICalculation;
}

interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

interface ROICalculation {
  investmentPeriod: number;
  paybackPeriod: number;
  totalReturn: number;
  annualSavings: number;
}

interface Risk {
  id: string;
  category: string;
  description: string;
  likelihood: number;
  impact: number;
  mitigation: string;
}

interface Deliverable {
  id: string;
  name: string;
  description: string;
  phase: string;
  acceptance: string;
}

interface SuccessCriteria {
  id: string;
  metric: string;
  target: string;
  measurement: string;
}

interface AIRecommendation {
  id: string;
  category: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
}

interface ScopeScore {
  completeness: number;
  feasibility: number;
  alignment: number;
  risk: number;
  overall: number;
}

const RevolutionaryProjectScoping: React.FC<RevolutionaryProjectScopingProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isAIAssisting, setIsAIAssisting] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [userInput, setUserInput] = useState('');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: '',
    industry: '',
    size: '',
    locations: 1,
    devices: 100,
    users: 50,
    currentState: '',
    desiredState: '',
    painPoints: [],
    priorities: []
  });
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [timeline, setTimeline] = useState<Timeline>({
    phases: [],
    totalDuration: 0,
    startDate: new Date(),
    endDate: new Date()
  });
  const [budget, setBudget] = useState<Budget>({
    total: 0,
    breakdown: [],
    roi: {
      investmentPeriod: 24,
      paybackPeriod: 0,
      totalReturn: 0,
      annualSavings: 0
    }
  });
  const [scopeScore, setScopeScore] = useState<ScopeScore>({
    completeness: 0,
    feasibility: 0,
    alignment: 0,
    risk: 0,
    overall: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const phases = [
    { 
      name: 'Company Profile', 
      icon: Building,
      description: 'Tell us about your organization',
      color: 'text-blue-500'
    },
    { 
      name: 'Objectives', 
      icon: Target,
      description: 'Define your goals and success metrics',
      color: 'text-green-500'
    },
    { 
      name: 'Requirements', 
      icon: Package,
      description: 'Identify technical and business requirements',
      color: 'text-purple-500'
    },
    { 
      name: 'Timeline', 
      icon: Calendar,
      description: 'Plan your implementation phases',
      color: 'text-orange-500'
    },
    { 
      name: 'Budget & ROI', 
      icon: DollarSign,
      description: 'Estimate costs and calculate returns',
      color: 'text-emerald-500'
    },
    { 
      name: 'Risk Assessment', 
      icon: Shield,
      description: 'Identify and mitigate potential risks',
      color: 'text-red-500'
    },
    { 
      name: 'Review & Finalize', 
      icon: CheckCircle,
      description: 'Review your complete project scope',
      color: 'text-indigo-500'
    }
  ];

  useEffect(() => {
    // Calculate scope score whenever data changes
    calculateScopeScore();
  }, [companyProfile, objectives, requirements, timeline, budget]);

  useEffect(() => {
    // Trigger confetti when reaching final phase
    if (currentPhase === phases.length - 1 && !showConfetti) {
      setShowConfetti(true);
      triggerConfetti();
    }
  }, [currentPhase]);

  const calculateScopeScore = () => {
    const completeness = calculateCompleteness();
    const feasibility = calculateFeasibility();
    const alignment = calculateAlignment();
    const risk = calculateRisk();
    const overall = (completeness + feasibility + alignment + (100 - risk)) / 4;
    
    setScopeScore({
      completeness,
      feasibility,
      alignment,
      risk,
      overall
    });
  };

  const calculateCompleteness = (): number => {
    let score = 0;
    if (companyProfile.name) score += 10;
    if (companyProfile.industry) score += 10;
    if (companyProfile.painPoints.length > 0) score += 15;
    if (objectives.length > 0) score += 20;
    if (requirements.length > 0) score += 20;
    if (timeline.phases.length > 0) score += 15;
    if (budget.total > 0) score += 10;
    return Math.min(score, 100);
  };

  const calculateFeasibility = (): number => {
    // Calculate based on timeline, budget, and resources
    let score = 100;
    if (timeline.totalDuration > 12) score -= 10; // Long timeline
    if (budget.total > 1000000) score -= 5; // High budget
    if (requirements.length > 50) score -= 10; // Many requirements
    return Math.max(score, 0);
  };

  const calculateAlignment = (): number => {
    // Calculate based on objectives matching pain points
    const painPointsAddressed = companyProfile.painPoints.filter(pp => 
      objectives.some(obj => obj.description.toLowerCase().includes(pp.toLowerCase()))
    );
    return (painPointsAddressed.length / Math.max(companyProfile.painPoints.length, 1)) * 100;
  };

  const calculateRisk = (): number => {
    // Calculate based on complexity and unknowns
    let riskScore = 0;
    if (!companyProfile.currentState) riskScore += 20;
    if (timeline.totalDuration < 3) riskScore += 15; // Too aggressive
    if (objectives.filter(o => o.measurable).length < objectives.length / 2) riskScore += 10;
    return Math.min(riskScore, 100);
  };

  const triggerConfetti = () => {
    // Confetti animation would go here
    toast({
      title: "🎉 Congratulations!",
      description: "Your project scope is complete!",
    });
  };

  const handleAIChat = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { role: 'user', content: userInput };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('what')) {
      return "I'm here to help you create a comprehensive project scope! You're currently in the " + 
             phases[currentPhase].name + " phase. " + phases[currentPhase].description + 
             ". Would you like me to suggest some best practices for this phase?";
    }
    
    if (lowerInput.includes('suggest') || lowerInput.includes('recommend')) {
      return generatePhaseRecommendations();
    }
    
    if (lowerInput.includes('timeline')) {
      return "For a project of your size, I recommend a phased approach over 6-9 months. " +
             "This allows for proper planning, testing, and user training. Would you like me to create a timeline template?";
    }
    
    if (lowerInput.includes('budget') || lowerInput.includes('cost')) {
      return "Based on your organization size and requirements, typical NAC implementations range from " +
             "$50,000 to $500,000. The key factors are: licensing, hardware, professional services, and ongoing support.";
    }
    
    return "That's a great question! Let me help you with that. Can you provide more details about your specific needs?";
  };

  const generatePhaseRecommendations = (): string => {
    switch (currentPhase) {
      case 0:
        return "For your company profile, make sure to include: 1) Current network infrastructure, " +
               "2) Compliance requirements, 3) Remote work policies, 4) Current security tools, " +
               "5) IT team size and expertise. This helps tailor the solution to your needs.";
      case 1:
        return "Strong objectives should be SMART: Specific, Measurable, Achievable, Relevant, Time-bound. " +
               "Consider objectives like: 'Achieve 100% device visibility within 30 days', " +
               "'Reduce security incidents by 50% in 6 months', 'Achieve PCI compliance by Q3'.";
      case 2:
        return "Key requirements to consider: 1) Authentication methods (802.1X, MAB, Web Auth), " +
               "2) Guest access needs, 3) BYOD support, 4) IoT device management, " +
               "5) Integration with existing systems (AD, SIEM, MDM).";
      case 3:
        return "A typical NAC implementation timeline: Phase 1 (1-2 months): Discovery & Planning, " +
               "Phase 2 (2-3 months): Core deployment, Phase 3 (1-2 months): Advanced features, " +
               "Phase 4 (1 month): Optimization & training.";
      case 4:
        return "For ROI calculation, consider: 1) Reduced security incidents (avg $4.35M per breach), " +
               "2) IT efficiency gains (30-40% time savings), 3) Compliance penalty avoidance, " +
               "4) Reduced help desk tickets (20-30% reduction).";
      case 5:
        return "Common risks to address: 1) User disruption during deployment, 2) Legacy device compatibility, " +
               "3) Network performance impact, 4) Staff training requirements, " +
               "5) Integration complexity with existing tools.";
      default:
        return "You're almost done! Review all sections to ensure completeness. " +
               "I can generate an executive summary and provide final recommendations.";
    }
  };

  const generateSmartSuggestions = () => {
    setIsGenerating(true);
    
    // Generate AI suggestions based on current phase
    setTimeout(() => {
      switch (currentPhase) {
        case 0:
          // Auto-fill company profile suggestions
          if (!companyProfile.painPoints.length) {
            setCompanyProfile(prev => ({
              ...prev,
              painPoints: [
                'Lack of device visibility',
                'Manual compliance reporting',
                'Unauthorized device access',
                'Complex guest management'
              ],
              priorities: [
                'Security enhancement',
                'Compliance automation',
                'Operational efficiency',
                'User experience'
              ]
            }));
          }
          break;
        
        case 1:
          // Generate smart objectives
          if (!objectives.length) {
            setObjectives([
              {
                id: '1',
                title: 'Achieve Complete Device Visibility',
                description: 'Identify and profile 100% of devices on the network',
                priority: 'critical',
                measurable: true,
                kpi: '100% device discovery within 30 days'
              },
              {
                id: '2',
                title: 'Implement Zero Trust Access',
                description: 'Deploy continuous verification for all network access',
                priority: 'high',
                measurable: true,
                kpi: 'Zero unauthorized access incidents'
              },
              {
                id: '3',
                title: 'Automate Compliance Reporting',
                description: 'Generate compliance reports automatically for all frameworks',
                priority: 'high',
                measurable: true,
                kpi: 'Reduce reporting time by 80%'
              }
            ]);
          }
          break;
        
        case 2:
          // Generate requirements
          if (!requirements.length) {
            setRequirements([
              {
                id: '1',
                category: 'Authentication',
                requirement: '802.1X for corporate devices',
                priority: 1,
                vendor: 'Cisco ISE',
                effort: 40
              },
              {
                id: '2',
                category: 'Guest Access',
                requirement: 'Self-service guest portal',
                priority: 2,
                vendor: 'Cisco ISE',
                effort: 20
              },
              {
                id: '3',
                category: 'BYOD',
                requirement: 'Certificate-based onboarding',
                priority: 2,
                vendor: 'Cisco ISE',
                effort: 30
              },
              {
                id: '4',
                category: 'Compliance',
                requirement: 'PCI DSS compliance automation',
                priority: 1,
                vendor: 'Cisco ISE',
                effort: 25
              }
            ]);
          }
          break;
        
        case 3:
          // Generate timeline
          if (!timeline.phases.length) {
            const phases: TimelinePhase[] = [
              {
                name: 'Discovery & Planning',
                duration: 4,
                dependencies: [],
                milestones: ['Requirements finalized', 'Architecture approved']
              },
              {
                name: 'Infrastructure Preparation',
                duration: 3,
                dependencies: ['Discovery & Planning'],
                milestones: ['Network ready', 'Certificates deployed']
              },
              {
                name: 'Core NAC Deployment',
                duration: 6,
                dependencies: ['Infrastructure Preparation'],
                milestones: ['NAC operational', 'Policies configured']
              },
              {
                name: 'Phased Rollout',
                duration: 8,
                dependencies: ['Core NAC Deployment'],
                milestones: ['50% devices onboarded', '100% devices onboarded']
              },
              {
                name: 'Optimization & Training',
                duration: 3,
                dependencies: ['Phased Rollout'],
                milestones: ['Team trained', 'Documentation complete']
              }
            ];
            
            setTimeline({
              phases,
              totalDuration: 24,
              startDate: new Date(),
              endDate: new Date(Date.now() + 24 * 7 * 24 * 60 * 60 * 1000)
            });
          }
          break;
        
        case 4:
          // Generate budget
          if (budget.total === 0) {
            const estimatedBudget: Budget = {
              total: 350000,
              breakdown: [
                { category: 'Software Licenses', amount: 120000, percentage: 34 },
                { category: 'Hardware', amount: 80000, percentage: 23 },
                { category: 'Professional Services', amount: 100000, percentage: 29 },
                { category: 'Training', amount: 25000, percentage: 7 },
                { category: 'Support (Year 1)', amount: 25000, percentage: 7 }
              ],
              roi: {
                investmentPeriod: 24,
                paybackPeriod: 14,
                totalReturn: 875000,
                annualSavings: 350000
              }
            };
            setBudget(estimatedBudget);
          }
          break;
      }
      
      setIsGenerating(false);
      toast({
        title: "AI Suggestions Applied",
        description: "Smart recommendations have been added to your scope",
      });
    }, 1500);
  };

  const exportProjectScope = () => {
    const scope: ProjectScope = {
      id: Date.now().toString(),
      name: `${companyProfile.name} NAC Implementation`,
      company: companyProfile,
      objectives,
      requirements,
      timeline,
      budget,
      risks: [],
      deliverables: [],
      successCriteria: [],
      recommendations: [],
      score: scopeScore
    };
    
    // Generate comprehensive document
    const doc = generateScopeDocument(scope);
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_scope_${Date.now()}.html`;
    a.click();
    
    toast({
      title: "Scope Exported",
      description: "Your project scope has been downloaded",
    });
    
    if (onComplete) {
      onComplete(scope);
    }
  };

  const generateScopeDocument = (scope: ProjectScope): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Project Scope - ${scope.name}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 40px; 
      color: #1F2937;
      line-height: 1.6;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 { margin: 0 0 10px 0; }
    .header p { margin: 5px 0; opacity: 0.9; }
    .score-badge {
      display: inline-block;
      background: white;
      color: #667eea;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      margin-top: 20px;
    }
    .section {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 30px;
      margin: 20px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .section h2 {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .metric {
      display: inline-block;
      margin: 10px 20px 10px 0;
      padding: 15px;
      background: #F3F4F6;
      border-radius: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #667eea;
      display: block;
    }
    .metric-label {
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #F9FAFB;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #E5E7EB;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .priority-critical { 
      background: #FEE2E2; 
      color: #991B1B;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .priority-high { 
      background: #FED7AA; 
      color: #9A3412;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .priority-medium { 
      background: #DBEAFE; 
      color: #1E40AF;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .timeline {
      position: relative;
      padding: 20px 0;
    }
    .timeline-item {
      display: flex;
      align-items: center;
      margin: 15px 0;
    }
    .timeline-marker {
      width: 40px;
      height: 40px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 20px;
    }
    .timeline-content {
      flex: 1;
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
    }
    .footer {
      margin-top: 50px;
      padding: 20px;
      background: #F9FAFB;
      border-radius: 8px;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
    }
    @media print {
      body { margin: 20px; }
      .section { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${scope.name}</h1>
    <p>${scope.company.name} | ${scope.company.industry}</p>
    <p>Project Scope Document | Generated: ${new Date().toLocaleDateString()}</p>
    <div class="score-badge">
      Scope Score: ${Math.round(scope.score.overall)}%
    </div>
  </div>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <div style="display: flex; flex-wrap: wrap;">
      <div class="metric">
        <span class="metric-value">${scope.company.users.toLocaleString()}</span>
        <span class="metric-label">Total Users</span>
      </div>
      <div class="metric">
        <span class="metric-value">${scope.company.devices.toLocaleString()}</span>
        <span class="metric-label">Devices</span>
      </div>
      <div class="metric">
        <span class="metric-value">${scope.company.locations}</span>
        <span class="metric-label">Locations</span>
      </div>
      <div class="metric">
        <span class="metric-value">${scope.timeline.totalDuration}</span>
        <span class="metric-label">Weeks Duration</span>
      </div>
      <div class="metric">
        <span class="metric-value">$${(scope.budget.total / 1000).toFixed(0)}K</span>
        <span class="metric-label">Total Investment</span>
      </div>
      <div class="metric">
        <span class="metric-value">${scope.budget.roi.paybackPeriod}</span>
        <span class="metric-label">Months Payback</span>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Company Profile</h2>
    <table>
      <tr>
        <td><strong>Organization:</strong></td>
        <td>${scope.company.name}</td>
        <td><strong>Industry:</strong></td>
        <td>${scope.company.industry}</td>
      </tr>
      <tr>
        <td><strong>Company Size:</strong></td>
        <td>${scope.company.size}</td>
        <td><strong>Locations:</strong></td>
        <td>${scope.company.locations}</td>
      </tr>
      <tr>
        <td colspan="4">
          <strong>Current State:</strong><br>
          ${scope.company.currentState || 'To be assessed'}
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <strong>Desired State:</strong><br>
          ${scope.company.desiredState || 'To be defined'}
        </td>
      </tr>
    </table>
    
    <h3>Pain Points</h3>
    <ul>
      ${scope.company.painPoints.map(pp => `<li>${pp}</li>`).join('')}
    </ul>
    
    <h3>Priorities</h3>
    <ul>
      ${scope.company.priorities.map(p => `<li>${p}</li>`).join('')}
    </ul>
  </div>
  
  <div class="section">
    <h2>Project Objectives</h2>
    <table>
      <thead>
        <tr>
          <th>Objective</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Success Metric</th>
        </tr>
      </thead>
      <tbody>
        ${scope.objectives.map(obj => `
          <tr>
            <td><strong>${obj.title}</strong></td>
            <td>${obj.description}</td>
            <td><span class="priority-${obj.priority}">${obj.priority.toUpperCase()}</span></td>
            <td>${obj.kpi}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>Technical Requirements</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Requirement</th>
          <th>Vendor</th>
          <th>Effort (Hours)</th>
        </tr>
      </thead>
      <tbody>
        ${scope.requirements.map(req => `
          <tr>
            <td>${req.category}</td>
            <td>${req.requirement}</td>
            <td>${req.vendor}</td>
            <td>${req.effort}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>Implementation Timeline</h2>
    <div class="timeline">
      ${scope.timeline.phases.map((phase, index) => `
        <div class="timeline-item">
          <div class="timeline-marker">${index + 1}</div>
          <div class="timeline-content">
            <h4>${phase.name}</h4>
            <p>Duration: ${phase.duration} weeks</p>
            <p>Milestones: ${phase.milestones.join(', ')}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <p><strong>Total Duration:</strong> ${scope.timeline.totalDuration} weeks</p>
    <p><strong>Start Date:</strong> ${scope.timeline.startDate.toLocaleDateString()}</p>
    <p><strong>End Date:</strong> ${scope.timeline.endDate.toLocaleDateString()}</p>
  </div>
  
  <div class="section">
    <h2>Budget & ROI Analysis</h2>
    <h3>Budget Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        ${scope.budget.breakdown.map(item => `
          <tr>
            <td>${item.category}</td>
            <td>$${item.amount.toLocaleString()}</td>
            <td>${item.percentage}%</td>
          </tr>
        `).join('')}
        <tr style="font-weight: bold; background: #F9FAFB;">
          <td>Total Investment</td>
          <td>$${scope.budget.total.toLocaleString()}</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
    
    <h3>Return on Investment</h3>
    <table>
      <tr>
        <td><strong>Investment Period:</strong></td>
        <td>${scope.budget.roi.investmentPeriod} months</td>
      </tr>
      <tr>
        <td><strong>Payback Period:</strong></td>
        <td>${scope.budget.roi.paybackPeriod} months</td>
      </tr>
      <tr>
        <td><strong>Annual Savings:</strong></td>
        <td>$${scope.budget.roi.annualSavings.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Total Return (${scope.budget.roi.investmentPeriod} months):</strong></td>
        <td>$${scope.budget.roi.totalReturn.toLocaleString()}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Project Score Analysis</h2>
    <table>
      <tr>
        <td><strong>Completeness:</strong></td>
        <td>${scope.score.completeness}%</td>
        <td>Measures how thoroughly the scope is defined</td>
      </tr>
      <tr>
        <td><strong>Feasibility:</strong></td>
        <td>${scope.score.feasibility}%</td>
        <td>Likelihood of successful implementation</td>
      </tr>
      <tr>
        <td><strong>Alignment:</strong></td>
        <td>${scope.score.alignment}%</td>
        <td>How well objectives address pain points</td>
      </tr>
      <tr>
        <td><strong>Risk Level:</strong></td>
        <td>${scope.score.risk}%</td>
        <td>Overall project risk assessment</td>
      </tr>
      <tr style="font-weight: bold; background: #F9FAFB;">
        <td>Overall Score:</td>
        <td>${Math.round(scope.score.overall)}%</td>
        <td>Composite project readiness score</td>
      </tr>
    </table>
  </div>
  
  <div class="footer">
    <p><strong>Confidential</strong> - ${scope.company.name}</p>
    <p>This project scope document is proprietary and confidential.</p>
    <p>Generated by Revolutionary Project Scoping System</p>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Compass className="h-8 w-8" />
                    Revolutionary Project Scoping
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-2">
                    Interactive, AI-powered project planning that will blow your mind
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Brain className="h-4 w-4 mr-1" />
                    AI-Assisted
                  </Badge>
                  <Button 
                    variant="secondary"
                    onClick={() => setShowChat(!showChat)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Chat
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              {phases.map((phase, index) => {
                const Icon = phase.icon;
                const isActive = index === currentPhase;
                const isCompleted = index < currentPhase;
                
                return (
                  <div 
                    key={index}
                    className="flex items-center transition-all duration-300"
                  >
                    <div 
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg scale-110' 
                          : isCompleted 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    {index < phases.length - 1 && (
                      <div className={`w-full h-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{phases[currentPhase].name}</p>
              <p className="text-sm text-muted-foreground">{phases[currentPhase].description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div
              key={currentPhase}
              className="transition-all duration-300"
            >
                <Card className="shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {React.createElement(phases[currentPhase].icon, { 
                          className: `h-5 w-5 ${phases[currentPhase].color}` 
                        })}
                        {phases[currentPhase].name}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateSmartSuggestions}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Suggest
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Phase-specific content */}
                    {currentPhase === 0 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Company Name</Label>
                            <Input
                              value={companyProfile.name}
                              onChange={(e) => setCompanyProfile({
                                ...companyProfile,
                                name: e.target.value
                              })}
                              placeholder="Enter company name"
                            />
                          </div>
                          <div>
                            <Label>Industry</Label>
                            <Select 
                              value={companyProfile.industry}
                              onValueChange={(value) => setCompanyProfile({
                                ...companyProfile,
                                industry: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Financial Services">Financial Services</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Government">Government</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Company Size</Label>
                            <Select 
                              value={companyProfile.size}
                              onValueChange={(value) => setCompanyProfile({
                                ...companyProfile,
                                size: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Small (1-100)">Small (1-100)</SelectItem>
                                <SelectItem value="Medium (100-1000)">Medium (100-1000)</SelectItem>
                                <SelectItem value="Large (1000-10000)">Large (1000-10000)</SelectItem>
                                <SelectItem value="Enterprise (10000+)">Enterprise (10000+)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Locations</Label>
                            <Input
                              type="number"
                              value={companyProfile.locations}
                              onChange={(e) => setCompanyProfile({
                                ...companyProfile,
                                locations: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          <div>
                            <Label>Total Users</Label>
                            <Input
                              type="number"
                              value={companyProfile.users}
                              onChange={(e) => setCompanyProfile({
                                ...companyProfile,
                                users: parseInt(e.target.value)
                              })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Number of Devices</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[companyProfile.devices]}
                              onValueChange={([value]) => setCompanyProfile({
                                ...companyProfile,
                                devices: value
                              })}
                              max={50000}
                              step={100}
                              className="flex-1"
                            />
                            <span className="font-medium w-20 text-right">
                              {companyProfile.devices.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label>Current State</Label>
                          <Textarea
                            value={companyProfile.currentState}
                            onChange={(e) => setCompanyProfile({
                              ...companyProfile,
                              currentState: e.target.value
                            })}
                            placeholder="Describe your current network and security infrastructure..."
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Desired State</Label>
                          <Textarea
                            value={companyProfile.desiredState}
                            onChange={(e) => setCompanyProfile({
                              ...companyProfile,
                              desiredState: e.target.value
                            })}
                            placeholder="Describe where you want to be after implementation..."
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Key Pain Points</Label>
                          <div className="space-y-2">
                            {['Lack of device visibility', 'Manual compliance reporting', 
                              'Complex guest management', 'Security incidents', 
                              'Unauthorized access', 'BYOD challenges'].map(pain => (
                              <div key={pain} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={companyProfile.painPoints.includes(pain)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCompanyProfile({
                                        ...companyProfile,
                                        painPoints: [...companyProfile.painPoints, pain]
                                      });
                                    } else {
                                      setCompanyProfile({
                                        ...companyProfile,
                                        painPoints: companyProfile.painPoints.filter(p => p !== pain)
                                      });
                                    }
                                  }}
                                />
                                <Label className="font-normal cursor-pointer">{pain}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPhase === 1 && (
                      <div className="space-y-6">
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            Define SMART objectives that align with your business goals
                          </AlertDescription>
                        </Alert>

                        {objectives.length === 0 ? (
                          <div className="text-center py-8">
                            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No objectives defined yet</p>
                            <Button onClick={generateSmartSuggestions}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Smart Objectives
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {objectives.map((obj, index) => (
                              <Card key={obj.id}>
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{obj.title}</h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {obj.description}
                                      </p>
                                      <div className="flex items-center gap-4 mt-3">
                                        <Badge variant={
                                          obj.priority === 'critical' ? 'destructive' :
                                          obj.priority === 'high' ? 'secondary' :
                                          'outline'
                                        }>
                                          {obj.priority}
                                        </Badge>
                                        {obj.measurable && (
                                          <Badge variant="outline" className="gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Measurable
                                          </Badge>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                          KPI: {obj.kpi}
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setObjectives(objectives.filter(o => o.id !== obj.id))}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional phases content would go here */}
                  </CardContent>
                </Card>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                disabled={currentPhase === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentPhase === phases.length - 1 ? (
                <Button
                  onClick={exportProjectScope}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete & Export
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentPhase(Math.min(phases.length - 1, currentPhase + 1))}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Scope Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    {Math.round(scopeScore.overall)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Readiness</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completeness</span>
                      <span>{scopeScore.completeness}%</span>
                    </div>
                    <Progress value={scopeScore.completeness} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Feasibility</span>
                      <span>{scopeScore.feasibility}%</span>
                    </div>
                    <Progress value={scopeScore.feasibility} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Alignment</span>
                      <span>{scopeScore.alignment}%</span>
                    </div>
                    <Progress value={scopeScore.alignment} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Level</span>
                      <span>{scopeScore.risk}%</span>
                    </div>
                    <Progress value={scopeScore.risk} className="bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {generatePhaseRecommendations().substring(0, 150)}...
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {currentPhase > 0 && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Objectives</span>
                      <span className="font-medium">{objectives.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requirements</span>
                      <span className="font-medium">{requirements.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-medium">{timeline.totalDuration} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        ${budget.total > 0 ? `${(budget.total / 1000).toFixed(0)}K` : '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Chat Interface */}
        {showChat && (
          <div
            className="fixed bottom-6 right-6 w-96 h-[500px] z-50 transition-all duration-300"
          >
              <Card className="h-full shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Assistant
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowChat(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.length === 0 && (
                        <Alert>
                          <MessageSquare className="h-4 w-4" />
                          <AlertDescription>
                            Hi! I'm your AI assistant. Ask me anything about your project scope!
                          </AlertDescription>
                        </Alert>
                      )}
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                        placeholder="Ask me anything..."
                      />
                      <Button onClick={handleAIChat}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevolutionaryProjectScoping;
