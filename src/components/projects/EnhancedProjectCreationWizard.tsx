import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Zap, Brain, Building2, Map, Rocket, Target, Users, Settings,
  CheckCircle, ArrowRight, FileText, Lightbulb, Workflow, Globe
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useDataEnhancement } from '@/hooks/useDataEnhancement';
import EnhancedScopingWizard from '@/components/scoping/EnhancedScopingWizard';
import BulkSiteCreationWizard from '@/components/scoping/BulkSiteCreationWizard';
import AIRecommendationPanel from '@/components/ai/AIRecommendationPanel';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';

interface EnhancedProjectCreationWizardProps {
  onComplete: (projectId: string) => void;
  onCancel: () => void;
  context?: 'dashboard' | 'command-center' | 'standalone';
}

type CreationMethod = 'ai-scoping' | 'bulk-sites' | 'template-based' | 'manual' | 'import';

const EnhancedProjectCreationWizard: React.FC<EnhancedProjectCreationWizardProps> = ({
  onComplete,
  onCancel,
  context = 'standalone'
}) => {
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod | null>(null);
  const [showMethodDialog, setShowMethodDialog] = useState(false);
  const { toast } = useToast();
  const { recordInteraction } = useDataEnhancement();
  const { generateRecommendations, recommendations, isLoading: isGeneratingRecommendations } = useEnhancedAI();

  useEffect(() => {
    // Generate initial recommendations for project creation
    generateRecommendations({
      type: 'project_template',
      context: {
        projectType: 'NAC Deployment',
        currentPhase: 'project-creation',
        userRole: 'Sales Engineer'
      }
    });
  }, []);

  const creationMethods = [
    {
      id: 'ai-scoping' as CreationMethod,
      title: 'AI-Powered Scoping',
      description: 'Comprehensive step-by-step scoping with intelligent recommendations',
      icon: Brain,
      color: 'bg-blue-500',
      features: [
        'AI-guided requirements discovery',
        'Intelligent vendor recommendations',
        'Pain point analysis',
        'Use case prioritization',
        'Risk assessment',
        'Timeline optimization'
      ],
      recommended: true,
      complexity: 'Comprehensive',
      duration: '30-45 minutes',
      bestFor: 'Complex deployments, first-time NAC projects'
    },
    {
      id: 'bulk-sites' as CreationMethod,
      title: 'Bulk Site Creation',
      description: 'Efficiently create multiple deployment sites with templates',
      icon: Map,
      color: 'bg-green-500',
      features: [
        'Site templates for quick setup',
        'CSV bulk import',
        'Deployment phase planning',
        'Site categorization',
        'Resource allocation',
        'Validation checks'
      ],
      recommended: false,
      complexity: 'Multi-site',
      duration: '15-30 minutes',
      bestFor: 'Multi-location deployments, standardized rollouts'
    },
    {
      id: 'template-based' as CreationMethod,
      title: 'Template-Based',
      description: 'Start with industry-specific templates and customize',
      icon: FileText,
      color: 'bg-purple-500',
      features: [
        'Industry-specific templates',
        'Pre-configured use cases',
        'Compliance frameworks',
        'Best practices included',
        'Quick customization',
        'Proven methodologies'
      ],
      recommended: false,
      complexity: 'Standard',
      duration: '10-20 minutes',
      bestFor: 'Standard deployments, experienced teams'
    },
    {
      id: 'manual' as CreationMethod,
      title: 'Manual Setup',
      description: 'Create project manually with full control over all settings',
      icon: Settings,
      color: 'bg-orange-500',
      features: [
        'Complete customization',
        'Advanced configuration',
        'Custom workflows',
        'Flexible structure',
        'Expert-level control',
        'No restrictions'
      ],
      recommended: false,
      complexity: 'Advanced',
      duration: '20-40 minutes',
      bestFor: 'Unique requirements, expert users'
    }
  ];

  const handleMethodSelect = (method: CreationMethod) => {
    setSelectedMethod(method);
    setShowMethodDialog(false);
    
    recordInteraction({
      action: 'project_creation_method_selected',
      details: { 
        method,
        context,
        timestamp: new Date().toISOString()
      }
    });

    toast({
      title: "Creation Method Selected",
      description: `Starting ${creationMethods.find(m => m.id === method)?.title} workflow.`,
    });
  };

  const handleProjectComplete = (projectId: string, additionalData?: any) => {
    recordInteraction({
      action: 'project_created',
      entityType: 'project',
      entityId: projectId,
      details: { 
        method: selectedMethod,
        context,
        additionalData,
        timestamp: new Date().toISOString()
      }
    });

    toast({
      title: "Project Created Successfully",
      description: "Your NAC deployment project has been created and is ready for configuration.",
    });

    onComplete(projectId);
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Rocket className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-2">Create NAC Project</h2>
        <p className="text-lg text-muted-foreground">
          Choose the best approach for your Network Access Control deployment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creationMethods.map((method) => (
              <Card 
                key={method.id} 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/50 ${method.recommended ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${method.color} text-white`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    {method.recommended && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="font-medium">Complexity:</span>
                        <Badge variant="outline" className="ml-2">{method.complexity}</Badge>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      {method.duration}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {method.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Best for:</span> {method.bestFor}
                    </p>
                  </div>

                  <Button className="w-full" size="lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start {method.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Need Help Choosing?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-blue-600 mb-1">New to NAC?</h4>
                  <p className="text-muted-foreground">Start with <strong>AI-Powered Scoping</strong> for guided setup and best practices.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-green-600 mb-1">Multiple Sites?</h4>
                  <p className="text-muted-foreground">Use <strong>Bulk Site Creation</strong> for efficient multi-location deployments.</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-purple-600 mb-1">Standard Deployment?</h4>
                  <p className="text-muted-foreground">Choose <strong>Template-Based</strong> for quick setup with industry standards.</p>
                </div>
              </div>
              
              <div className="text-center pt-2">
                <Button variant="outline" onClick={() => setShowMethodDialog(true)}>
                  <Workflow className="h-4 w-4 mr-2" />
                  Compare All Methods
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <AIRecommendationPanel
          title="Project Creation Insights"
          description="AI recommendations for your project setup."
          recommendations={recommendations || []}
          isLoading={isGeneratingRecommendations}
        />
      </div>
    </div>
  );

  const renderSelectedMethod = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod) {
      case 'ai-scoping':
        return (
          <EnhancedScopingWizard
            mode="full"
            onComplete={handleProjectComplete}
            onCancel={() => setSelectedMethod(null)}
          />
        );
      
      case 'bulk-sites':
        return (
          <BulkSiteCreationWizard
            onComplete={handleProjectComplete}
            onCancel={() => setSelectedMethod(null)}
          />
        );
      
      case 'template-based':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold mb-2">Template-Based Creation</h3>
            <p className="text-muted-foreground mb-6">Coming in the next update...</p>
            <Button onClick={() => setSelectedMethod(null)} variant="outline">
              Back to Method Selection
            </Button>
          </div>
        );
      
      case 'manual':
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold mb-2">Manual Setup</h3>
            <p className="text-muted-foreground mb-6">Advanced manual configuration coming soon...</p>
            <Button onClick={() => setSelectedMethod(null)} variant="outline">
              Back to Method Selection
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {!selectedMethod ? renderMethodSelection() : renderSelectedMethod()}

      <Dialog open={showMethodDialog} onOpenChange={setShowMethodDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Creation Methods</DialogTitle>
            <DialogDescription>
              Detailed comparison of all project creation approaches
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {creationMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${method.color} text-white`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    {method.recommended && (
                      <Badge className="bg-primary text-primary-foreground">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {method.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Complexity:</span>
                          <Badge variant="outline" className="ml-2">{method.complexity}</Badge>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>
                          <span className="ml-2 text-muted-foreground">{method.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Best For</h4>
                      <p className="text-sm text-muted-foreground">{method.bestFor}</p>
                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        Select This Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProjectCreationWizard;
