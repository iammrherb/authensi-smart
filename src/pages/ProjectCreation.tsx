import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Brain, Building2, Users, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EnhancedProjectCreationWizard from "@/components/comprehensive/EnhancedProjectCreationWizard";

const ProjectCreation = () => {
  const navigate = useNavigate();
  const [wizardStep, setWizardStep] = useState(0);

  const creationMethods = [
    {
      id: 'ai-scoping',
      title: 'AI-Assisted Scoping',
      description: 'Start with intelligent questionnaire and AI recommendations',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      path: '/scoping'
    },
    {
      id: 'template-based',
      title: 'Template-Based',
      description: 'Use pre-configured industry templates',
      icon: Building2,
      color: 'from-blue-500 to-cyan-600',
      recommended: true
    },
    {
      id: 'manual-setup',
      title: 'Manual Setup',
      description: 'Configure project from scratch',
      icon: Target,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const projectBenefits = [
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Coordinate stakeholders across sales, technical, and implementation teams'
    },
    {
      icon: CheckSquare,
      title: 'Requirement Tracking',
      description: 'Comprehensive requirement management with automated verification'
    },
    {
      icon: Target,
      title: 'Milestone Management',
      description: 'Track progress with automated reporting and stakeholder updates'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🚀 Project Creation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Launch New <span className="bg-gradient-primary bg-clip-text text-transparent">Portnox Project</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create a comprehensive NAC deployment project with intelligent scoping, 
              stakeholder management, and automated workflow orchestration.
            </p>
          </div>

          {/* Creation Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {creationMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id} 
                  className={`relative cursor-pointer hover:shadow-lg transition-shadow ${
                    method.recommended ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    if (method.path) {
                      navigate(method.path);
                    } else {
                      setWizardStep(1);
                    }
                  }}
                >
                  {method.recommended && (
                    <Badge className="absolute -top-2 left-4 bg-primary">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Project Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Create a Structured Project?</CardTitle>
              <CardDescription>
                Leverage comprehensive project management for successful NAC deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectBenefits.map((benefit) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Project Creation Wizard */}
          {wizardStep > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Creation Wizard</CardTitle>
                <CardDescription>
                  Step-by-step project setup with intelligent recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedProjectCreationWizard />
              </CardContent>
            </Card>
          )}

          {/* Quick Start Templates */}
          {wizardStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Templates</CardTitle>
                <CardDescription>
                  Jump start your project with industry-specific templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Healthcare HIPAA', industry: 'Healthcare', complexity: 'High' },
                    { name: 'Financial PCI DSS', industry: 'Finance', complexity: 'High' },
                    { name: 'Education Campus', industry: 'Education', complexity: 'Medium' },
                    { name: 'Manufacturing SMB', industry: 'Manufacturing', complexity: 'Low' },
                    { name: 'Enterprise BYOD', industry: 'Enterprise', complexity: 'High' },
                    { name: 'Retail Multi-Site', industry: 'Retail', complexity: 'Medium' }
                  ].map((template) => (
                    <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{template.industry}</Badge>
                          <Badge variant={template.complexity === 'High' ? 'destructive' : template.complexity === 'Medium' ? 'default' : 'secondary'}>
                            {template.complexity}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{template.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCreation;