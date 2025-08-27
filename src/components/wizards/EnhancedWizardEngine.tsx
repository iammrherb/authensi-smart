import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, Zap, CheckCircle, AlertTriangle,
  BookOpen, Settings, Shield, Network, Server, Users, Building2,
  Lightbulb, Info, ExternalLink, ArrowRight, Star, Clock
} from 'lucide-react';

import { portnoxCrawler } from '@/services/crawling/PortnoxDocumentationCrawler';
import { useToast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean | string;
  dependencies?: string[];
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  documentation?: string[];
}

interface WizardData {
  [key: string]: any;
}

interface WizardContext {
  stepId: string;
  data: WizardData;
  stepData: any;
  updateData: (key: string, value: any) => void;
  goToStep: (stepId: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  getStepIndex: (stepId: string) => number;
  isStepComplete: (stepId: string) => boolean;
  documentation: any[];
}

const EnhancedWizardEngine: React.FC<{
  steps: WizardStep[];
  initialData?: WizardData;
  onComplete?: (data: WizardData) => void;
  onCancel?: () => void;
}> = ({ steps, initialData = {}, onComplete, onCancel }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);
  const [stepData, setStepData] = useState<any>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [documentation, setDocumentation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    // Load relevant documentation for the current step
    loadStepDocumentation();
  }, [currentStep.id]);

  const loadStepDocumentation = async () => {
    setIsLoading(true);
    try {
      const searchTerms = getDocumentationSearchTerms();
      const results = await portnoxCrawler.searchContent(searchTerms.join(' '), 10);
      setDocumentation(results);
    } catch (error) {
      console.error('Failed to load documentation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentationSearchTerms = (): string[] => {
    const stepKeywords: Record<string, string[]> = {
      'project-setup': ['project creation', 'initial setup', 'configuration'],
      'requirements': ['prerequisites', 'requirements', 'system requirements'],
      'network-config': ['network configuration', 'firewall', 'ports'],
      'security-setup': ['security', 'authentication', 'authorization'],
      'deployment': ['deployment', 'installation', 'setup'],
      'testing': ['testing', 'validation', 'verification']
    };

    return stepKeywords[currentStep.id] || [currentStep.title, currentStep.description];
  };

  const updateData = (key: string, value: any) => {
    setWizardData(prev => ({ ...prev, [key]: value }));
  };

  const updateStepData = (data: any) => {
    setStepData(data);
  };

  const validateStep = (): boolean | string => {
    if (currentStep.validation) {
      return currentStep.validation({ ...wizardData, ...stepData });
    }
    return true;
  };

  const goToStep = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const goToNextStep = () => {
    const validation = validateStep();
    if (validation !== true) {
      toast({
        title: "Validation Error",
        description: typeof validation === 'string' ? validation : "Please complete all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));

    // Merge step data into wizard data
    setWizardData(prev => ({ ...prev, ...stepData }));
    setStepData({});

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Wizard completed
      if (onComplete) {
        onComplete({ ...wizardData, ...stepData });
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setStepData({});
    }
  };

  const getStepIndex = (stepId: string) => {
    return steps.findIndex(step => step.id === stepId);
  };

  const isStepComplete = (stepId: string) => {
    return completedSteps.has(stepId);
  };

  const getProgressPercentage = () => {
    return ((currentStepIndex + 1) / steps.length) * 100;
  };

  const wizardContext: WizardContext = {
    stepId: currentStep.id,
    data: wizardData,
    stepData,
    updateData,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    getStepIndex,
    isStepComplete,
    documentation
  };

  const StepComponent = currentStep.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Wizard Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Enhanced Wizard Engine</CardTitle>
                  <CardDescription>Intelligent project setup with AI-powered guidance</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  Step {currentStepIndex + 1} of {steps.length}
                </Badge>
                {currentStep.difficulty && (
                  <Badge variant="outline" className={
                    currentStep.difficulty === 'easy' ? 'border-green-200 text-green-700' :
                    currentStep.difficulty === 'medium' ? 'border-yellow-200 text-yellow-700' :
                    'border-red-200 text-red-700'
                  }>
                    {currentStep.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <currentStep.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentStep.title}</CardTitle>
                    <CardDescription>{currentStep.description}</CardDescription>
                  </div>
                </div>
                {currentStep.estimatedTime && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {currentStep.estimatedTime}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <StepComponent {...wizardContext} />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {onCancel && (
                  <Button variant="ghost" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button onClick={goToNextStep}>
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      Complete <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Step Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentStepIndex
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => goToStep(step.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {isStepComplete(step.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <step.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        {step.difficulty && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {step.difficulty}
                          </p>
                        )}
                      </div>
                      {index === currentStepIndex && (
                        <ArrowRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentation */}
            {documentation.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Related Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentation.slice(0, 5).map((doc, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-900 truncate">
                              {doc.source_url?.split('/').pop() || 'Documentation'}
                            </p>
                            <p className="text-xs text-blue-700 mt-1 line-clamp-2">
                              {doc.extracted_data?.prerequisites?.[0] || 
                               doc.extracted_data?.configuration_steps?.[0] ||
                               'Portnox documentation'}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Based on your selections, we recommend reviewing the security configuration section.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      This step typically takes 5-10 minutes when prerequisites are met.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWizardEngine;
