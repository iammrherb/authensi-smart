
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Play, Pause, SkipForward, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  dependencies?: string[];
  validation?: (data: any) => { isValid: boolean; message?: string };
}

interface ScopingFlowManagerProps {
  currentStep: string;
  scopingData: any;
  onStepChange: (stepId: string) => void;
  onSave: () => void;
  onComplete: () => void;
  autoSave?: boolean;
}

const flowSteps: FlowStep[] = [
  {
    id: 'organization',
    title: 'Organization Profile',
    description: 'Basic organization information and pain points',
    required: true,
    validation: (data) => ({
      isValid: !!data.organization?.name,
      message: data.organization?.name ? undefined : 'Organization name is required'
    })
  },
  {
    id: 'infrastructure',
    title: 'Network Infrastructure',
    description: 'Current network setup and topology',
    required: true,
    dependencies: ['organization'],
    validation: (data) => ({
      isValid: data.network_infrastructure?.site_count > 0,
      message: data.network_infrastructure?.site_count > 0 ? undefined : 'At least one site is required'
    })
  },
  {
    id: 'vendors',
    title: 'Vendor Ecosystem',
    description: 'Current and planned vendor infrastructure',
    required: true,
    dependencies: ['infrastructure']
  },
  {
    id: 'use_cases',
    title: 'Use Cases & Requirements',
    description: 'Define objectives and success criteria',
    required: true,
    dependencies: ['vendors']
  },
  {
    id: 'compliance',
    title: 'Integration & Compliance',
    description: 'Compliance requirements and integrations',
    required: false,
    dependencies: ['use_cases']
  },
  {
    id: 'analysis',
    title: 'AI Analysis',
    description: 'Generate recommendations and insights',
    required: false,
    dependencies: ['use_cases']
  }
];

const ScopingFlowManager: React.FC<ScopingFlowManagerProps> = ({
  currentStep,
  scopingData,
  onStepChange,
  onSave,
  onComplete,
  autoSave = true
}) => {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationResults, setValidationResults] = useState<Record<string, { isValid: boolean; message?: string }>>({});

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && scopingData.organization?.name) {
      const autoSaveTimer = setTimeout(() => {
        onSave();
        setLastSaved(new Date());
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [scopingData, autoSave, onSave]);

  // Validate all steps
  useEffect(() => {
    const results: Record<string, { isValid: boolean; message?: string }> = {};
    
    flowSteps.forEach(step => {
      if (step.validation) {
        results[step.id] = step.validation(scopingData);
      } else {
        results[step.id] = { isValid: true };
      }
    });

    setValidationResults(results);
  }, [scopingData]);

  const getCurrentStepIndex = () => {
    return flowSteps.findIndex(step => step.id === currentStep);
  };

  const canNavigateToStep = (stepId: string): boolean => {
    const step = flowSteps.find(s => s.id === stepId);
    if (!step?.dependencies) return true;

    // Check if all dependencies are valid
    return step.dependencies.every(depId => validationResults[depId]?.isValid);
  };

  const getStepStatus = (stepId: string): 'completed' | 'current' | 'available' | 'locked' => {
    if (stepId === currentStep) return 'current';
    
    const stepIndex = flowSteps.findIndex(s => s.id === stepId);
    const currentIndex = getCurrentStepIndex();
    
    if (stepIndex < currentIndex && validationResults[stepId]?.isValid) {
      return 'completed';
    }
    
    if (canNavigateToStep(stepId)) {
      return 'available';
    }
    
    return 'locked';
  };

  const calculateProgress = (): number => {
    const completedSteps = flowSteps.filter(step => 
      validationResults[step.id]?.isValid || (!step.required && step.id !== currentStep)
    ).length;
    return Math.round((completedSteps / flowSteps.length) * 100);
  };

  const canComplete = (): boolean => {
    const requiredSteps = flowSteps.filter(s => s.required);
    return requiredSteps.every(step => validationResults[step.id]?.isValid);
  };

  const handleStepClick = (stepId: string) => {
    const status = getStepStatus(stepId);
    if (status === 'locked') {
      toast({
        title: "Step Locked",
        description: "Complete previous required steps first.",
        variant: "destructive"
      });
      return;
    }
    onStepChange(stepId);
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < flowSteps.length - 1) {
      const nextStep = flowSteps[currentIndex + 1];
      handleStepClick(nextStep.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      const prevStep = flowSteps[currentIndex - 1];
      handleStepClick(prevStep.id);
    }
  };

  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
    toast({
      title: "Session Saved",
      description: "Your scoping progress has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Scoping Progress</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{calculateProgress()}% Complete</Badge>
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <Progress value={calculateProgress()} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Flow Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {flowSteps.map((step, index) => {
              const status = getStepStatus(step.id);
              const validation = validationResults[step.id];
              
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    status === 'current' ? 'border-primary bg-primary/10' :
                    status === 'completed' ? 'border-green-500 bg-green-50' :
                    status === 'available' ? 'border-border hover:border-primary/50' :
                    'border-muted bg-muted/50 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{index + 1}</span>
                    {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {status === 'current' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    {status === 'locked' && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="text-xs font-medium mb-1">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                  
                  {validation?.message && status === 'current' && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {validation.message}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={getCurrentStepIndex() === 0}
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
        </div>

        <div className="flex gap-2">
          {getCurrentStepIndex() < flowSteps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={onComplete}
              disabled={!canComplete()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Scoping
            </Button>
          )}
        </div>
      </div>

      {/* Completion Status */}
      {!canComplete() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete all required steps to finish scoping and create your project.
            Required steps: {flowSteps.filter(s => s.required && !validationResults[s.id]?.isValid).map(s => s.title).join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ScopingFlowManager;
