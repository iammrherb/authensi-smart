import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  Globe, 
  Settings,
  Rocket,
  FileText,
  CheckCircle
} from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: string;
  complexity: 'low' | 'medium' | 'high';
  features: string[];
}

interface ProjectData {
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedStartDate: string;
  estimatedEndDate: string;
  budget: string;
  teamSize: string;
  requirements: string;
  technicalSpecs: string;
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'network-upgrade',
    name: 'Network Infrastructure Upgrade',
    description: 'Complete network modernization with latest technologies',
    category: 'Infrastructure',
    estimatedDuration: '3-6 months',
    complexity: 'high',
    features: ['VLAN segmentation', 'QoS implementation', 'Security hardening', 'Monitoring setup']
  },
  {
    id: 'security-implementation',
    name: 'Security Implementation',
    description: 'Comprehensive security solution deployment',
    category: 'Security',
    estimatedDuration: '2-4 months',
    complexity: 'medium',
    features: ['Firewall deployment', 'VPN setup', 'Access control', 'Audit logging']
  },
  {
    id: 'wireless-deployment',
    name: 'Wireless Network Deployment',
    description: 'Enterprise wireless infrastructure setup',
    category: 'Wireless',
    estimatedDuration: '1-3 months',
    complexity: 'medium',
    features: ['AP placement', 'Channel planning', 'Security configuration', 'Performance optimization']
  },
  {
    id: 'data-center',
    name: 'Data Center Setup',
    description: 'Complete data center infrastructure',
    category: 'Infrastructure',
    estimatedDuration: '6-12 months',
    complexity: 'high',
    features: ['Core switching', 'Storage networking', 'Virtualization', 'Backup systems']
  }
];

export const EnhancedProjectCreationWizard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    estimatedStartDate: '',
    estimatedEndDate: '',
    budget: '',
    teamSize: '',
    requirements: '',
    technicalSpecs: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = projectTemplates.find(t => t.id === templateId);
    if (template) {
      setProjectData(prev => ({
        ...prev,
        category: template.category,
        description: template.description
      }));
    }
  };

  const handleProjectComplete = (method: string) => {
    toast({
      title: "Project Created Successfully!",
      description: `Your ${method} project has been created and is ready for planning.`,
    });
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose a Project Template</h2>
        <p className="text-muted-foreground">
          Select from our pre-built project templates or create a custom one
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{template.name}</span>
                <Badge variant={template.complexity === 'high' ? 'destructive' : template.complexity === 'medium' ? 'default' : 'secondary'}>
                  {template.complexity}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{template.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>{template.category}</span>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Key Features:</Label>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => handleProjectComplete('template-based')}
            className="px-8"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Create Project from Template
          </Button>
        </div>
      )}
    </div>
  );

  const renderManualCreation = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Manual Project Creation</h2>
        <p className="text-muted-foreground">
          Build your project from scratch with custom specifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Project Foundation */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Foundation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={projectData.category} onValueChange={(value) => setProjectData({ ...projectData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="wireless">Wireless</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="migration">Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={projectData.priority} onValueChange={(value: any) => setProjectData({ ...projectData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    placeholder="Number of team members"
                    value={projectData.teamSize}
                    onChange={(e) => setProjectData({ ...projectData, teamSize: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Requirements & Scope */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Requirements & Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Project Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List your project requirements..."
                  value={projectData.requirements}
                  onChange={(e) => setProjectData({ ...projectData, requirements: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technicalSpecs">Technical Specifications</Label>
                <Textarea
                  id="technicalSpecs"
                  placeholder="Describe technical specifications..."
                  value={projectData.technicalSpecs}
                  onChange={(e) => setProjectData({ ...projectData, technicalSpecs: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Timeline & Budget */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline & Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Estimated Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={projectData.estimatedStartDate}
                    onChange={(e) => setProjectData({ ...projectData, estimatedStartDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Estimated End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={projectData.estimatedEndDate}
                    onChange={(e) => setProjectData({ ...projectData, estimatedEndDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Estimate</Label>
                <Input
                  id="budget"
                  placeholder="Enter budget amount"
                  value={projectData.budget}
                  onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <Progress value={(currentStep / 3) * 100} />
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={() => handleProjectComplete('manual')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Template-Based
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manual Creation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {renderTemplateSelection()}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {renderManualCreation()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

