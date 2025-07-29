import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Target, Clock, Users, Shield,
  FileCheck, Zap, Settings, Plus, X, Calendar as CalendarIcon,
  AlertTriangle, TrendingUp, Database, Network, Monitor
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ImplementationPhase {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  start_date?: Date;
  end_date?: Date;
  prerequisites: string[];
  deliverables: string[];
  success_criteria: string[];
  assigned_team: string[];
  risks: Array<{risk: string; impact: string; probability: string; mitigation: string;}>;
  dependencies: string[];
  milestones: Array<{name: string; date: Date; description: string;}>;
}

interface TestCase {
  id: string;
  category: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  test_type: 'Functional' | 'Performance' | 'Security' | 'Integration' | 'User Acceptance';
  expected_result: string;
  actual_result?: string;
  status: 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked';
  assigned_to: string;
  estimated_hours: number;
  actual_hours?: number;
  prerequisites: string[];
  test_data_required: string[];
}

interface ImplementationTrackingData {
  // Project Overview
  project_overview: {
    project_name: string;
    project_id: string;
    implementation_type: 'New Deployment' | 'Upgrade' | 'Migration' | 'Expansion';
    methodology: 'Agile' | 'Waterfall' | 'Hybrid' | 'DevOps';
    overall_timeline_weeks: number;
    budget_allocated: number;
    success_metrics: string[];
    business_objectives: string[];
  };

  // Implementation Phases
  implementation_phases: ImplementationPhase[];

  // Resource Planning
  resource_planning: {
    project_manager: string;
    technical_lead: string;
    implementation_team: Array<{
      name: string;
      role: string;
      skills: string[];
      allocation_percentage: number;
      start_date: Date;
      end_date: Date;
      hourly_rate?: number;
    }>;
    vendor_resources: Array<{
      vendor: string;
      contact_person: string;
      role: string;
      services_provided: string[];
      engagement_start: Date;
      engagement_end: Date;
      cost_estimate: number;
    }>;
    training_requirements: Array<{
      training_type: string;
      target_audience: string;
      duration_hours: number;
      delivery_method: string;
      cost_estimate: number;
    }>;
  };

  // Quality Assurance & Testing
  quality_assurance: {
    test_strategy: string;
    test_environments: Array<{
      name: string;
      purpose: string;
      configuration: string;
      availability_schedule: string;
    }>;
    test_cases: TestCase[];
    acceptance_criteria: string[];
    quality_gates: Array<{
      phase: string;
      criteria: string[];
      approval_required: boolean;
      approvers: string[];
    }>;
    defect_tracking: {
      tool: string;
      severity_levels: string[];
      escalation_process: string;
    };
  };

  // Risk Management
  risk_management: {
    identified_risks: Array<{
      id: string;
      risk_name: string;
      description: string;
      category: string;
      impact: 'Low' | 'Medium' | 'High' | 'Critical';
      probability: 'Low' | 'Medium' | 'High';
      risk_score: number;
      mitigation_strategy: string;
      contingency_plan: string;
      owner: string;
      status: 'Active' | 'Mitigated' | 'Closed';
      date_identified: Date;
      target_resolution?: Date;
    }>;
    risk_assessment_frequency: string;
    escalation_thresholds: {
      high_risk_threshold: number;
      critical_risk_threshold: number;
    };
  };

  // Communication & Reporting
  communication_plan: {
    stakeholder_groups: Array<{
      group_name: string;
      members: string[];
      communication_frequency: string;
      preferred_method: string;
      information_needs: string[];
    }>;
    status_reporting: {
      frequency: string;
      format: string;
      distribution_list: string[];
      key_metrics: string[];
    };
    escalation_matrix: Array<{
      issue_type: string;
      escalation_level: number;
      contact_person: string;
      response_time_hours: number;
    }>;
    change_management: {
      change_approval_process: string;
      change_control_board: string[];
      impact_assessment_criteria: string[];
    };
  };

  // Performance Monitoring
  performance_monitoring: {
    kpis: Array<{
      name: string;
      description: string;
      target_value: string;
      measurement_frequency: string;
      data_source: string;
      responsible_party: string;
    }>;
    monitoring_tools: string[];
    alerting_thresholds: Array<{
      metric: string;
      warning_threshold: string;
      critical_threshold: string;
      notification_recipients: string[];
    }>;
    reporting_dashboards: Array<{
      dashboard_name: string;
      target_audience: string;
      refresh_frequency: string;
      key_metrics: string[];
    }>;
  };

  // Go-Live & Deployment
  deployment_planning: {
    deployment_strategy: 'Big Bang' | 'Phased' | 'Pilot' | 'Blue-Green' | 'Rolling';
    go_live_date: Date;
    deployment_windows: Array<{
      phase: string;
      start_time: string;
      end_time: string;
      affected_systems: string[];
      rollback_criteria: string[];
    }>;
    pre_deployment_checklist: string[];
    post_deployment_checklist: string[];
    rollback_procedures: Array<{
      trigger_condition: string;
      rollback_steps: string[];
      recovery_time_estimate: string;
      responsible_party: string;
    }>;
    user_communication: {
      notification_schedule: Array<{date: Date; message: string; audience: string;}>;
      training_schedule: Array<{date: Date; session_name: string; attendees: string[];}>;
      support_arrangements: string[];
    };
  };

  // Post-Implementation
  post_implementation: {
    warranty_period_weeks: number;
    support_arrangements: Array<{
      support_level: string;
      response_time_hours: number;
      coverage_hours: string;
      contact_method: string;
      escalation_process: string;
    }>;
    knowledge_transfer: Array<{
      knowledge_area: string;
      documentation_required: string[];
      training_sessions: number;
      target_audience: string[];
      completion_criteria: string;
    }>;
    lessons_learned: {
      review_date: Date;
      participants: string[];
      review_format: string;
      documentation_location: string;
    };
    continuous_improvement: {
      optimization_opportunities: string[];
      enhancement_roadmap: Array<{
        enhancement: string;
        priority: string;
        estimated_effort: string;
        business_value: string;
      }>;
    };
  };
}

interface ImplementationTrackingWizardProps {
  projectId?: string;
  onComplete?: (trackingData: ImplementationTrackingData) => void;
  onCancel?: () => void;
}

const ImplementationTrackingWizard: React.FC<ImplementationTrackingWizardProps> = ({
  projectId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ImplementationTrackingData>({
    project_overview: {
      project_name: '',
      project_id: projectId || '',
      implementation_type: 'New Deployment',
      methodology: 'Agile',
      overall_timeline_weeks: 12,
      budget_allocated: 0,
      success_metrics: [],
      business_objectives: []
    },
    implementation_phases: [],
    resource_planning: {
      project_manager: '',
      technical_lead: '',
      implementation_team: [],
      vendor_resources: [],
      training_requirements: []
    },
    quality_assurance: {
      test_strategy: '',
      test_environments: [],
      test_cases: [],
      acceptance_criteria: [],
      quality_gates: [],
      defect_tracking: {
        tool: '',
        severity_levels: ['Critical', 'High', 'Medium', 'Low'],
        escalation_process: ''
      }
    },
    risk_management: {
      identified_risks: [],
      risk_assessment_frequency: 'Weekly',
      escalation_thresholds: {
        high_risk_threshold: 15,
        critical_risk_threshold: 20
      }
    },
    communication_plan: {
      stakeholder_groups: [],
      status_reporting: {
        frequency: 'Weekly',
        format: 'Dashboard + Email',
        distribution_list: [],
        key_metrics: []
      },
      escalation_matrix: [],
      change_management: {
        change_approval_process: '',
        change_control_board: [],
        impact_assessment_criteria: []
      }
    },
    performance_monitoring: {
      kpis: [],
      monitoring_tools: [],
      alerting_thresholds: [],
      reporting_dashboards: []
    },
    deployment_planning: {
      deployment_strategy: 'Phased',
      go_live_date: new Date(),
      deployment_windows: [],
      pre_deployment_checklist: [],
      post_deployment_checklist: [],
      rollback_procedures: [],
      user_communication: {
        notification_schedule: [],
        training_schedule: [],
        support_arrangements: []
      }
    },
    post_implementation: {
      warranty_period_weeks: 12,
      support_arrangements: [],
      knowledge_transfer: [],
      lessons_learned: {
        review_date: new Date(),
        participants: [],
        review_format: 'Workshop',
        documentation_location: ''
      },
      continuous_improvement: {
        optimization_opportunities: [],
        enhancement_roadmap: []
      }
    }
  });

  const { toast } = useToast();

  const steps = [
    {
      id: 1,
      title: "Project Overview",
      description: "Basic project information and implementation approach",
      icon: Target
    },
    {
      id: 2,
      title: "Implementation Phases",
      description: "Define project phases, timelines, and deliverables",
      icon: Clock
    },
    {
      id: 3,
      title: "Resource Planning",
      description: "Team assignments, vendor resources, and training",
      icon: Users
    },
    {
      id: 4,
      title: "Quality Assurance",
      description: "Testing strategy, test cases, and quality gates",
      icon: Shield
    },
    {
      id: 5,
      title: "Risk Management",
      description: "Risk identification, assessment, and mitigation",
      icon: AlertTriangle
    },
    {
      id: 6,
      title: "Communication Plan",
      description: "Stakeholder communication and reporting structure",
      icon: FileCheck
    },
    {
      id: 7,
      title: "Performance Monitoring",
      description: "KPIs, monitoring tools, and dashboards",
      icon: TrendingUp
    },
    {
      id: 8,
      title: "Deployment Planning",
      description: "Go-live strategy and deployment procedures",
      icon: Zap
    },
    {
      id: 9,
      title: "Post-Implementation",
      description: "Support, knowledge transfer, and continuous improvement",
      icon: Settings
    }
  ];

  const implementationTypes = [
    'New Deployment', 'Upgrade', 'Migration', 'Expansion'
  ];

  const methodologies = [
    'Agile', 'Waterfall', 'Hybrid', 'DevOps'
  ];

  const deploymentStrategies = [
    'Big Bang', 'Phased', 'Pilot', 'Blue-Green', 'Rolling'
  ];

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

  const handleComplete = () => {
    toast({
      title: "Implementation Tracking Setup Complete",
      description: "Your implementation tracking configuration has been saved.",
    });
    onComplete?.(formData);
  };

  const addPhase = () => {
    const newPhase: ImplementationPhase = {
      id: `phase-${Date.now()}`,
      name: '',
      description: '',
      duration_weeks: 2,
      prerequisites: [],
      deliverables: [],
      success_criteria: [],
      assigned_team: [],
      risks: [],
      dependencies: [],
      milestones: []
    };
    setFormData(prev => ({
      ...prev,
      implementation_phases: [...prev.implementation_phases, newPhase]
    }));
  };

  const removePhase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      implementation_phases: prev.implementation_phases.filter((_, i) => i !== index)
    }));
  };

  const updatePhase = (index: number, field: keyof ImplementationPhase, value: any) => {
    setFormData(prev => ({
      ...prev,
      implementation_phases: prev.implementation_phases.map((phase, i) => 
        i === index ? { ...phase, [field]: value } : phase
      )
    }));
  };

  const addTeamMember = () => {
    const newMember = {
      name: '',
      role: '',
      skills: [],
      allocation_percentage: 100,
      start_date: new Date(),
      end_date: new Date(),
      hourly_rate: 0
    };
    setFormData(prev => ({
      ...prev,
      resource_planning: {
        ...prev.resource_planning,
        implementation_team: [...prev.resource_planning.implementation_team, newMember]
      }
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resource_planning: {
        ...prev.resource_planning,
        implementation_team: prev.resource_planning.implementation_team.filter((_, i) => i !== index)
      }
    }));
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `test-${Date.now()}`,
      category: '',
      name: '',
      description: '',
      priority: 'Medium',
      test_type: 'Functional',
      expected_result: '',
      status: 'Not Started',
      assigned_to: '',
      estimated_hours: 2,
      prerequisites: [],
      test_data_required: []
    };
    setFormData(prev => ({
      ...prev,
      quality_assurance: {
        ...prev.quality_assurance,
        test_cases: [...prev.quality_assurance.test_cases, newTestCase]
      }
    }));
  };

  const removeTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quality_assurance: {
        ...prev.quality_assurance,
        test_cases: prev.quality_assurance.test_cases.filter((_, i) => i !== index)
      }
    }));
  };

  const addRisk = () => {
    const newRisk = {
      id: `risk-${Date.now()}`,
      risk_name: '',
      description: '',
      category: '',
      impact: 'Medium' as const,
      probability: 'Medium' as const,
      risk_score: 9,
      mitigation_strategy: '',
      contingency_plan: '',
      owner: '',
      status: 'Active' as const,
      date_identified: new Date()
    };
    setFormData(prev => ({
      ...prev,
      risk_management: {
        ...prev.risk_management,
        identified_risks: [...prev.risk_management.identified_risks, newRisk]
      }
    }));
  };

  const removeRisk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      risk_management: {
        ...prev.risk_management,
        identified_risks: prev.risk_management.identified_risks.filter((_, i) => i !== index)
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={formData.project_overview.project_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    project_overview: { ...prev.project_overview, project_name: e.target.value }
                  }))}
                  placeholder="e.g., Portnox NAC Implementation"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="implementation_type">Implementation Type *</Label>
                <Select 
                  value={formData.project_overview.implementation_type} 
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    project_overview: { ...prev.project_overview, implementation_type: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select implementation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {implementationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="methodology">Methodology *</Label>
                <Select 
                  value={formData.project_overview.methodology} 
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    project_overview: { ...prev.project_overview, methodology: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select methodology" />
                  </SelectTrigger>
                  <SelectContent>
                    {methodologies.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline_weeks">Timeline (Weeks)</Label>
                <Input
                  id="timeline_weeks"
                  type="number"
                  value={formData.project_overview.overall_timeline_weeks}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    project_overview: { ...prev.project_overview, overall_timeline_weeks: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="budget_allocated">Budget (USD)</Label>
                <Input
                  id="budget_allocated"
                  type="number"
                  value={formData.project_overview.budget_allocated}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    project_overview: { ...prev.project_overview, budget_allocated: parseFloat(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Implementation Phases</h4>
              <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>

            {formData.implementation_phases.map((phase, index) => (
              <Card key={phase.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Phase {index + 1}</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePhase(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phase Name</Label>
                    <Input
                      value={phase.name}
                      onChange={(e) => updatePhase(index, 'name', e.target.value)}
                      placeholder="e.g., Discovery & Planning"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Duration (Weeks)</Label>
                    <Input
                      type="number"
                      value={phase.duration_weeks}
                      onChange={(e) => updatePhase(index, 'duration_weeks', parseInt(e.target.value) || 0)}
                      className="mt-1"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Phase Description</Label>
                  <Textarea
                    value={phase.description}
                    onChange={(e) => updatePhase(index, 'description', e.target.value)}
                    placeholder="Describe the phase objectives and key activities..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </Card>
            ))}

            {formData.implementation_phases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No phases defined yet. Click "Add Phase" to get started.</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_manager">Project Manager</Label>
                <Input
                  id="project_manager"
                  value={formData.resource_planning.project_manager}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resource_planning: { ...prev.resource_planning, project_manager: e.target.value }
                  }))}
                  placeholder="Project manager name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="technical_lead">Technical Lead</Label>
                <Input
                  id="technical_lead"
                  value={formData.resource_planning.technical_lead}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resource_planning: { ...prev.resource_planning, technical_lead: e.target.value }
                  }))}
                  placeholder="Technical lead name"
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Implementation Team</h4>
                <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              {formData.resource_planning.implementation_team.map((member, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Team Member {index + 1}</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => {
                          const updatedTeam = [...formData.resource_planning.implementation_team];
                          updatedTeam[index] = { ...member, name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            resource_planning: { ...prev.resource_planning, implementation_team: updatedTeam }
                          }));
                        }}
                        placeholder="Full name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => {
                          const updatedTeam = [...formData.resource_planning.implementation_team];
                          updatedTeam[index] = { ...member, role: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            resource_planning: { ...prev.resource_planning, implementation_team: updatedTeam }
                          }));
                        }}
                        placeholder="e.g., Network Engineer"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Allocation %</Label>
                      <Input
                        type="number"
                        value={member.allocation_percentage}
                        onChange={(e) => {
                          const updatedTeam = [...formData.resource_planning.implementation_team];
                          updatedTeam[index] = { ...member, allocation_percentage: parseInt(e.target.value) || 0 };
                          setFormData(prev => ({
                            ...prev,
                            resource_planning: { ...prev.resource_planning, implementation_team: updatedTeam }
                          }));
                        }}
                        className="mt-1"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="test_strategy">Test Strategy</Label>
              <Textarea
                id="test_strategy"
                value={formData.quality_assurance.test_strategy}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quality_assurance: { ...prev.quality_assurance, test_strategy: e.target.value }
                }))}
                placeholder="Describe the overall testing approach and methodology..."
                className="mt-1"
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Test Cases</h4>
                <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </div>

              {formData.quality_assurance.test_cases.map((testCase, index) => (
                <Card key={testCase.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Test Case {index + 1}</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Test Name</Label>
                      <Input
                        value={testCase.name}
                        onChange={(e) => {
                          const updatedCases = [...formData.quality_assurance.test_cases];
                          updatedCases[index] = { ...testCase, name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            quality_assurance: { ...prev.quality_assurance, test_cases: updatedCases }
                          }));
                        }}
                        placeholder="e.g., User Authentication Test"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Input
                        value={testCase.category}
                        onChange={(e) => {
                          const updatedCases = [...formData.quality_assurance.test_cases];
                          updatedCases[index] = { ...testCase, category: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            quality_assurance: { ...prev.quality_assurance, test_cases: updatedCases }
                          }));
                        }}
                        placeholder="e.g., Authentication"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select 
                        value={testCase.priority} 
                        onValueChange={(value: any) => {
                          const updatedCases = [...formData.quality_assurance.test_cases];
                          updatedCases[index] = { ...testCase, priority: value };
                          setFormData(prev => ({
                            ...prev,
                            quality_assurance: { ...prev.quality_assurance, test_cases: updatedCases }
                          }));
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Test Type</Label>
                      <Select 
                        value={testCase.test_type} 
                        onValueChange={(value: any) => {
                          const updatedCases = [...formData.quality_assurance.test_cases];
                          updatedCases[index] = { ...testCase, test_type: value };
                          setFormData(prev => ({
                            ...prev,
                            quality_assurance: { ...prev.quality_assurance, test_cases: updatedCases }
                          }));
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Functional">Functional</SelectItem>
                          <SelectItem value="Performance">Performance</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Integration">Integration</SelectItem>
                          <SelectItem value="User Acceptance">User Acceptance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={testCase.description}
                      onChange={(e) => {
                        const updatedCases = [...formData.quality_assurance.test_cases];
                        updatedCases[index] = { ...testCase, description: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          quality_assurance: { ...prev.quality_assurance, test_cases: updatedCases }
                        }));
                      }}
                      placeholder="Describe the test case steps and objectives..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="risk_frequency">Risk Assessment Frequency</Label>
                <Select 
                  value={formData.risk_management.risk_assessment_frequency} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    risk_management: { ...prev.risk_management, risk_assessment_frequency: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="critical_threshold">Critical Risk Threshold</Label>
                <Input
                  id="critical_threshold"
                  type="number"
                  value={formData.risk_management.escalation_thresholds.critical_risk_threshold}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    risk_management: {
                      ...prev.risk_management,
                      escalation_thresholds: {
                        ...prev.risk_management.escalation_thresholds,
                        critical_risk_threshold: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="mt-1"
                  min="1"
                  max="25"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Identified Risks</h4>
                <Button type="button" variant="outline" size="sm" onClick={addRisk}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Risk
                </Button>
              </div>

              {formData.risk_management.identified_risks.map((risk, index) => (
                <Card key={risk.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Risk {index + 1}</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRisk(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Name</Label>
                      <Input
                        value={risk.risk_name}
                        onChange={(e) => {
                          const updatedRisks = [...formData.risk_management.identified_risks];
                          updatedRisks[index] = { ...risk, risk_name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            risk_management: { ...prev.risk_management, identified_risks: updatedRisks }
                          }));
                        }}
                        placeholder="e.g., Network Downtime"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Input
                        value={risk.category}
                        onChange={(e) => {
                          const updatedRisks = [...formData.risk_management.identified_risks];
                          updatedRisks[index] = { ...risk, category: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            risk_management: { ...prev.risk_management, identified_risks: updatedRisks }
                          }));
                        }}
                        placeholder="e.g., Technical"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Impact</Label>
                      <Select 
                        value={risk.impact} 
                        onValueChange={(value: any) => {
                          const updatedRisks = [...formData.risk_management.identified_risks];
                          updatedRisks[index] = { ...risk, impact: value };
                          setFormData(prev => ({
                            ...prev,
                            risk_management: { ...prev.risk_management, identified_risks: updatedRisks }
                          }));
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Probability</Label>
                      <Select 
                        value={risk.probability} 
                        onValueChange={(value: any) => {
                          const updatedRisks = [...formData.risk_management.identified_risks];
                          updatedRisks[index] = { ...risk, probability: value };
                          setFormData(prev => ({
                            ...prev,
                            risk_management: { ...prev.risk_management, identified_risks: updatedRisks }
                          }));
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={risk.description}
                      onChange={(e) => {
                        const updatedRisks = [...formData.risk_management.identified_risks];
                        updatedRisks[index] = { ...risk, description: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          risk_management: { ...prev.risk_management, identified_risks: updatedRisks }
                        }));
                      }}
                      placeholder="Describe the risk and its potential impact..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporting_frequency">Status Reporting Frequency</Label>
                <Select 
                  value={formData.communication_plan.status_reporting.frequency} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    communication_plan: {
                      ...prev.communication_plan,
                      status_reporting: { ...prev.communication_plan.status_reporting, frequency: value }
                    }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reporting_format">Report Format</Label>
                <Select 
                  value={formData.communication_plan.status_reporting.format} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    communication_plan: {
                      ...prev.communication_plan,
                      status_reporting: { ...prev.communication_plan.status_reporting, format: value }
                    }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dashboard Only">Dashboard Only</SelectItem>
                    <SelectItem value="Email Report">Email Report</SelectItem>
                    <SelectItem value="Dashboard + Email">Dashboard + Email</SelectItem>
                    <SelectItem value="Presentation">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-lg font-semibold mb-2">Performance Monitoring Setup</h4>
              <p className="text-muted-foreground">Configure KPIs, monitoring tools, and alerting thresholds</p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deployment_strategy">Deployment Strategy</Label>
                <Select 
                  value={formData.deployment_planning.deployment_strategy} 
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    deployment_planning: { ...prev.deployment_planning, deployment_strategy: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deploymentStrategies.map((strategy) => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Go-Live Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deployment_planning.go_live_date ? 
                        format(formData.deployment_planning.go_live_date, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deployment_planning.go_live_date}
                      onSelect={(date) => date && setFormData(prev => ({
                        ...prev,
                        deployment_planning: { ...prev.deployment_planning, go_live_date: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="warranty_period">Warranty Period (Weeks)</Label>
                <Input
                  id="warranty_period"
                  type="number"
                  value={formData.post_implementation.warranty_period_weeks}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    post_implementation: { ...prev.post_implementation, warranty_period_weeks: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="review_format">Lessons Learned Format</Label>
                <Select 
                  value={formData.post_implementation.lessons_learned.review_format} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    post_implementation: {
                      ...prev.post_implementation,
                      lessons_learned: { ...prev.post_implementation.lessons_learned, review_format: value }
                    }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Survey">Survey</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Documentation Review">Documentation Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Implementation Tracking Wizard</CardTitle>
              <CardDescription>
                {steps[currentStep - 1]?.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md whitespace-nowrap ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-background text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{step.title}</span>
                  {currentStep > step.id && <CheckCircle className="h-4 w-4" />}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pr-4">
              {renderStepContent()}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="flex-shrink-0 flex justify-between items-center p-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImplementationTrackingWizard;