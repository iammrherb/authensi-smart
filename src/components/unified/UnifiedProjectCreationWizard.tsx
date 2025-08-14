import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Users, Building2, Network, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import existing wizard components to consolidate
import EnhancedProjectCreationWizard from '@/components/comprehensive/EnhancedProjectCreationWizard';
import IntelligentProjectCreationWizard from '@/components/comprehensive/IntelligentProjectCreationWizard';
import RobustProjectCreationWizard from '@/components/comprehensive/RobustProjectCreationWizard';

interface UnifiedProjectCreationWizardProps {
  scopingData?: any;
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
  mode?: 'enhanced' | 'intelligent' | 'robust';
}

const UnifiedProjectCreationWizard: React.FC<UnifiedProjectCreationWizardProps> = ({
  scopingData,
  onComplete,
  onCancel,
  mode = 'enhanced'
}) => {
  const [activeWizard, setActiveWizard] = useState(mode);
  const { toast } = useToast();

  const wizardOptions = [
    {
      key: 'enhanced',
      title: 'Enhanced Creation',
      description: 'Comprehensive project setup with AI assistance',
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-500'
    },
    {
      key: 'intelligent',
      title: 'Intelligent Creation',
      description: 'AI-driven project initialization with smart defaults',
      icon: <Brain className="h-5 w-5" />,
      color: 'text-purple-500'
    },
    {
      key: 'robust',
      title: 'Robust Creation',
      description: 'Full-featured project setup with advanced options',
      icon: <Building2 className="h-5 w-5" />,
      color: 'text-green-500'
    }
  ];

  const handleProjectCreate = (projectData: any) => {
    toast({
      title: "Project Created Successfully",
      description: "Your project has been created and is ready for implementation."
    });
    if (onComplete) {
      onComplete(projectData.id || 'new-project-id');
    }
  };

  const renderWizard = () => {
    switch (activeWizard) {
      case 'enhanced':
        return (
          <EnhancedProjectCreationWizard
            onComplete={handleProjectCreate}
            onCancel={onCancel}
          />
        );
      case 'intelligent':
        return (
          <IntelligentProjectCreationWizard />
        );
      case 'robust':
        return (
          <RobustProjectCreationWizard
            scopingData={scopingData}
            onSave={handleProjectCreate}
            onCancel={onCancel || (() => {})}
          />
        );
      default:
        return (
          <EnhancedProjectCreationWizard
            onComplete={handleProjectCreate}
            onCancel={onCancel}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30">
        <CardHeader>
          <div className="text-center space-y-4">
            <Badge variant="glow" className="mb-2">
              <Network className="h-4 w-4 mr-2" />
              Unified Project Creation
            </Badge>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              Create Your Project
            </CardTitle>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred creation method to set up your NAC project with the right level of detail and automation.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Wizard Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5" />
            Choose Creation Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wizardOptions.map((option) => (
              <Card 
                key={option.key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeWizard === option.key ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveWizard(option.key as any)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${option.color}`}>
                      {option.icon}
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  {activeWizard === option.key && (
                    <Badge variant="secondary" className="w-full justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Wizard */}
      <div className="space-y-6">
        {renderWizard()}
      </div>
    </div>
  );
};

export default UnifiedProjectCreationWizard;