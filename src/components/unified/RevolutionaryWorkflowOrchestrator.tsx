import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Brain, 
  Zap, 
  Target, 
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { UnifiedWorkflowOrchestrator, WorkflowContext, WorkflowStep, AIInsight, ResourceMapping } from '@/services/UnifiedWorkflowOrchestrator';
import { IntelligentStep } from '@/services/IntelligentStepOrchestrator';
import { useIndustryOptions, useComplianceFrameworks, useDeploymentTypes } from '@/hooks/useResourceLibrary';

interface RevolutionaryWorkflowOrchestratorProps {
  workflowType: 'project_genesis' | 'site_creation' | 'implementation_planning' | 'deployment_tracking';
  existingContext?: Partial<WorkflowContext>;
  onComplete?: (result: any) => void;
}

const RevolutionaryWorkflowOrchestrator: React.FC<RevolutionaryWorkflowOrchestratorProps> = ({
  workflowType,
  existingContext,
  onComplete
}) => {
  const [orchestrator, setOrchestrator] = useState<UnifiedWorkflowOrchestrator | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<IntelligentStep[]>([]);
  const [context, setContext] = useState<WorkflowContext | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, any>>({});
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [resourceMappings, setResourceMappings] = useState<ResourceMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Resource library hooks
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceFrameworks = [] } = useComplianceFrameworks();
  const { data: deploymentTypes = [] } = useDeploymentTypes();

  // Initialize workflow orchestrator
  useEffect(() => {
    const initializeOrchestrator = async () => {
      setIsInitializing(true);
      try {
        const newOrchestrator = new UnifiedWorkflowOrchestrator(workflowType, existingContext);
        const initialSteps = await newOrchestrator.initializeWorkflow();
        
        setOrchestrator(newOrchestrator);
        setSteps(initialSteps);
        setCurrentStep(0);
        
        // Get initial context and insights
        const initialResourceMappings = await newOrchestrator.generateResourceRecommendations();
        setResourceMappings(initialResourceMappings);
        
        toast.success("AI Workflow Orchestrator initialized successfully!");
      } catch (error) {
        console.error('Failed to initialize orchestrator:', error);
        toast.error("Failed to initialize workflow orchestrator");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeOrchestrator();
  }, [workflowType, existingContext]);

  // Handle step advancement
  const handleAdvanceStep = async () => {
    if (!orchestrator) {
      console.error('No orchestrator available');
      return;
    }

    console.log('Advancing step from', currentStep, 'with inputs:', userInputs);
    setIsLoading(true);
    try {
      const nextStepIndex = currentStep + 1;
      console.log('Calling orchestrator.advanceToStep with index:', nextStepIndex);
      
      await orchestrator.advanceToStep(nextStepIndex, userInputs);
      
      console.log('Step advancement successful, updating UI');
      setCurrentStep(nextStepIndex);
      setUserInputs({});
      
      // Get updated insights and recommendations
      const updatedMappings = await orchestrator.generateResourceRecommendations();
      setResourceMappings(updatedMappings);
      
      toast.success("Step completed successfully!");
    } catch (error) {
      console.error('Failed to advance step:', error);
      toast.error(`Failed to advance to next step: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step navigation
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle resource selection
  const handleResourceToggle = (mapping: ResourceMapping) => {
    setResourceMappings(prev => 
      prev.map(rm => 
        rm.resource_id === mapping.resource_id 
          ? { ...rm, user_confirmed: !rm.user_confirmed }
          : rm
      )
    );
  };

  // Generate implementation checklist
  const handleGenerateChecklist = async () => {
    if (!orchestrator) return;

    setIsLoading(true);
    try {
      const checklist = await orchestrator.generateImplementationChecklist();
      toast.success("Implementation checklist generated!");
      // Handle checklist display/storage
    } catch (error) {
      console.error('Failed to generate checklist:', error);
      toast.error("Failed to generate implementation checklist");
    } finally {
      setIsLoading(false);
    }
  };

  // Render current step content
  const renderStepContent = () => {
    if (!steps[currentStep]) return null;

    const step = steps[currentStep];

    switch (step.type) {
      case 'ai_data_collection':
        return renderDataCollectionStep(step);
      case 'intelligent_discovery':
        return renderAIRecommendationStep(step);
      case 'ai_analysis':
        return renderAIProcessingStep(step);
      case 'solution_generation':
        return renderDesignStep(step);
      case 'implementation_planning':
        return renderPlanningStep(step);
      case 'validation_engine':
        return renderValidationStep(step);
      case 'decision_matrix':
      case 'resource_selection':
      case 'smart_configuration':
      case 'predictive_assessment':
      default:
        return renderGenericStep(step);
    }
  };

  const renderDataCollectionStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          Provide the foundational information for AI-driven recommendations
        </p>
      </div>

      {workflowType === 'project_genesis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                value={userInputs.project_name || ''}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={userInputs.industry} 
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map(option => (
                    <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organization_size">Organization Size</Label>
              <Select 
                value={userInputs.organization_size} 
                onValueChange={(value) => handleInputChange('organization_size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-100 users)</SelectItem>
                  <SelectItem value="medium">Medium (101-1000 users)</SelectItem>
                  <SelectItem value="large">Large (1001-5000 users)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (5000+ users)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="project_description">Project Description</Label>
              <Textarea
                id="project_description"
                value={userInputs.project_description || ''}
                onChange={(e) => handleInputChange('project_description', e.target.value)}
                placeholder="Describe the project goals and scope"
                rows={4}
              />
            </div>

            <div>
              <Label>Primary Goals</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Zero Trust', 'Compliance', 'Visibility', 'Access Control'].map(goal => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={userInputs.primary_goals?.includes(goal) || false}
                      onCheckedChange={(checked) => {
                        const goals = userInputs.primary_goals || [];
                        if (checked) {
                          handleInputChange('primary_goals', [...goals, goal]);
                        } else {
                          handleInputChange('primary_goals', goals.filter((g: string) => g !== goal));
                        }
                      }}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAIRecommendationStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          AI-powered resource recommendations based on your requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto-Selected Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Auto-Selected Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resourceMappings.filter(rm => rm.auto_selected).map(mapping => (
                <div key={mapping.resource_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">{mapping.resource_type}</div>
                      <div className="text-sm text-muted-foreground">{mapping.ai_reasoning}</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {Math.round(mapping.relevance_score * 100)}% match
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Suggested Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resourceMappings.filter(rm => !rm.auto_selected).map(mapping => (
                <div key={mapping.resource_id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={mapping.user_confirmed}
                      onCheckedChange={() => handleResourceToggle(mapping)}
                    />
                    <div>
                      <div className="font-medium">{mapping.resource_type}</div>
                      <div className="text-sm text-muted-foreground">{mapping.ai_reasoning}</div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {Math.round(mapping.relevance_score * 100)}% match
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAIProcessingStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          AI is analyzing your requirements and generating intelligent recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <h4 className="font-semibold mb-2">Pattern Analysis</h4>
            <p className="text-sm text-muted-foreground">Analyzing industry patterns and best practices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <h4 className="font-semibold mb-2">Solution Mapping</h4>
            <p className="text-sm text-muted-foreground">Mapping requirements to optimal solutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-3 text-orange-500" />
            <h4 className="font-semibold mb-2">Timeline Prediction</h4>
            <p className="text-sm text-muted-foreground">Predicting implementation timeline</p>
          </CardContent>
        </Card>
      </div>

      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map(insight => (
                <div key={insight.id} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                  <div className="flex-shrink-0">
                    {insight.type === 'recommendation' && <Lightbulb className="h-5 w-5 text-blue-500" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {insight.type === 'optimization' && <TrendingUp className="h-5 w-5 text-green-500" />}
                  </div>
                  <div>
                    <h5 className="font-medium">{insight.title}</h5>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {Math.round(insight.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDesignStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Layers className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          Design your solution architecture with AI-guided recommendations
        </p>
      </div>

      <div className="text-center">
        <Button onClick={handleGenerateChecklist} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Implementation Checklist'}
        </Button>
      </div>
    </div>
  );

  const renderPlanningStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          Create detailed implementation strategy and timeline
        </p>
      </div>
    </div>
  );

  const renderValidationStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">
          Review and validate your configuration before implementation
        </p>
      </div>
    </div>
  );

  const renderGenericStep = (step: IntelligentStep) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="h-12 w-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-primary">{currentStep + 1}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground">{step.description}</p>
      </div>
    </div>
  );

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Initializing AI Workflow Orchestrator</h3>
          <p className="text-muted-foreground">Setting up intelligent workflow management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
                Revolutionary Workflow Orchestrator
              </CardTitle>
              <p className="text-muted-foreground">
                AI-driven workflow management for {workflowType.replace('_', ' ')}
              </p>
            </div>
            <Badge variant="glow" className="text-sm px-3 py-1">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Workflow Progress</h3>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleAdvanceStep}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => onComplete?.(context)}
              disabled={isLoading}
            >
              Complete Workflow
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevolutionaryWorkflowOrchestrator;