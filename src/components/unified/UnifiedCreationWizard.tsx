
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Brain, LayoutTemplate, Settings, Rocket, Database, Zap, Globe } from 'lucide-react';
import { UnifiedProjectCreationService, PROJECT_TEMPLATES, type ProjectCreationOptions } from '@/services/UnifiedProjectCreationService';
import UltimateAIScopingWizard from '@/components/scoping/UltimateAIScopingWizard';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface UnifiedCreationWizardProps {
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
  initialMethod?: 'ai-scoping' | 'template-based' | 'manual';
  context?: 'command-center' | 'project-creation' | 'dashboard';
}

const UnifiedCreationWizard: React.FC<UnifiedCreationWizardProps> = ({
  onComplete,
  onCancel,
  initialMethod = 'ai-scoping',
  context = 'project-creation'
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'ai-scoping' | 'template-based' | 'manual'>(initialMethod);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState<any>({});
  const [options, setOptions] = useState<ProjectCreationOptions>({
    method: initialMethod,
    enablePortnoxIntegration: true,
    enableAutomations: true,
    resourceLibraryIntegration: true
  });

  const createProject = useCreateProject();
  const { toast } = useToast();

  useEffect(() => {
    setOptions(prev => ({ ...prev, method: selectedMethod, templateId: selectedTemplate }));
  }, [selectedMethod, selectedTemplate]);

  const creationMethods = [
    {
      id: 'ai-scoping' as const,
      title: 'AI-Assisted Scoping',
      description: 'Intelligent questionnaire with AI recommendations and vendor selection',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      features: ['Smart questionnaire', 'AI recommendations', 'Vendor selection', 'Compliance guidance'],
      recommended: true
    },
    {
      id: 'template-based' as const,
      title: 'Template-Based Creation',
      description: 'Use industry-specific templates with pre-configured settings',
      icon: LayoutTemplate,
      color: 'from-blue-500 to-cyan-600',
      features: ['Industry templates', 'Pre-configured settings', 'Best practices', 'Quick setup']
    },
    {
      id: 'manual' as const,
      title: 'Manual Configuration',
      description: 'Custom project setup with full control over all parameters',
      icon: Settings,
      color: 'from-green-500 to-emerald-600',
      features: ['Full customization', 'Advanced options', 'Expert mode', 'Maximum flexibility']
    }
  ];

  const handleAIScopingComplete = async (sessionId: string, scopingData: any) => {
    try {
      const project = await UnifiedProjectCreationService.createProject(scopingData, options);
      
      toast({
        title: "Project Created Successfully",
        description: `Project "${project.name}" has been created with AI scoping data.`,
      });

      onComplete?.(project.id);
    } catch (error: any) {
      toast({
        title: "Failed to Create Project",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateBasedCreation = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a project template to continue.",
        variant: "destructive",
      });
      return;
    }

    const template = PROJECT_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    const templateProjectData = {
      name: `${template.name} Project`,
      description: template.description,
      client_name: projectData.client_name || 'New Client',
      industry: template.industry,
      ...projectData
    };

    try {
      const project = await UnifiedProjectCreationService.createProject(templateProjectData, options);
      
      toast({
        title: "Project Created Successfully",
        description: `Project "${project.name}" has been created from template.`,
      });

      onComplete?.(project.id);
    } catch (error: any) {
      toast({
        title: "Failed to Create Project",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleManualCreation = async () => {
    if (!projectData.name || !projectData.client_name) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in the project name and client name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const project = await UnifiedProjectCreationService.createProject(projectData, options);
      
      toast({
        title: "Project Created Successfully",
        description: `Project "${project.name}" has been created manually.`,
      });

      onComplete?.(project.id);
    } catch (error: any) {
      toast({
        title: "Failed to Create Project",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (selectedMethod === 'ai-scoping' && step === 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Assisted Project Scoping</CardTitle>
        </CardHeader>
        <CardContent>
          <UltimateAIScopingWizard
            onComplete={handleAIScopingComplete}
            onSave={() => {}}
            onCancel={() => setStep(1)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🚀 Unified Project Creation
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Creation Method</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the best approach for your project creation needs. All methods integrate with 
              Portnox APIs, Resource Library, and automation workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {creationMethods.map((method) => {
              const IconComponent = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  } ${method.recommended ? 'ring-2 ring-primary/50' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
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
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {method.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <Label>Portnox Integration</Label>
                  </div>
                  <Switch
                    checked={options.enablePortnoxIntegration}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, enablePortnoxIntegration: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    <Label>Automations</Label>
                  </div>
                  <Switch
                    checked={options.enableAutomations}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, enableAutomations: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <Label>Resource Library</Label>
                  </div>
                  <Switch
                    checked={options.resourceLibraryIntegration}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, resourceLibraryIntegration: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Label>Global Templates</Label>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} size="lg">
              Continue with {creationMethods.find(m => m.id === selectedMethod)?.title}
            </Button>
          </div>
        </>
      )}

      {step === 2 && selectedMethod === 'template-based' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Project Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_TEMPLATES.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          </div>
                          <Badge variant={
                            template.complexity === 'High' ? 'destructive' : 
                            template.complexity === 'Medium' ? 'default' : 'secondary'
                          }>
                            {template.complexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Industry:</span>
                            <Badge variant="outline">{template.industry}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{template.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Team Size:</span>
                            <span>{template.recommendedTeamSize} people</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Sites:</span>
                            <span>{template.defaultSites}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Industry-specific tabs would filter templates */}
            </Tabs>

            {selectedTemplate && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Client Name *</Label>
                      <Input
                        value={projectData.client_name || ''}
                        onChange={(e) => setProjectData(prev => ({ ...prev, client_name: e.target.value }))}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Name Override</Label>
                      <Input
                        value={projectData.name || ''}
                        onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Leave empty to use template name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={projectData.notes || ''}
                      onChange={(e) => setProjectData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any specific requirements or notes..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleTemplateBasedCreation}
                disabled={!selectedTemplate || !projectData.client_name}
              >
                Create Project from Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && selectedMethod === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Project Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={projectData.name || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  value={projectData.client_name || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="Enter client name"
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={projectData.industry || ''}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deployment Type</Label>
                <Select
                  value={projectData.deployment_type || ''}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, deployment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deployment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMB">Small/Medium Business</SelectItem>
                    <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Global">Global Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={projectData.description || ''}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Sites</Label>
                <Input
                  type="number"
                  value={projectData.total_sites || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, total_sites: parseInt(e.target.value) }))}
                  placeholder="Number of sites"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Endpoints</Label>
                <Input
                  type="number"
                  value={projectData.total_endpoints || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, total_endpoints: parseInt(e.target.value) }))}
                  placeholder="Number of endpoints"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleManualCreation}
                disabled={!projectData.name || !projectData.client_name}
              >
                Create Project Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedCreationWizard;
