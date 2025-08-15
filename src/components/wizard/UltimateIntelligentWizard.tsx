import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  FileText, 
  MapPin, 
  Zap, 
  Cog, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Building,
  Shield,
  Network,
  Lightbulb,
  Target
} from 'lucide-react';
import { useIndustryOptions, useComplianceFrameworks, useDeploymentTypes } from '@/hooks/useResourceLibrary';
import EnhancedSiteCreationWizard from '@/components/sites/EnhancedSiteCreationWizard';
import EnhancedAIScopingWizard from '@/components/scoping/EnhancedAIScopingWizard';
import OneXerConfigWizard from '@/components/config/OneXerConfigWizard';

interface UnifiedState {
  // Project Data
  project_name: string;
  industry: string;
  organization_size: string;
  project_description: string;
  pain_points: string[];
  compliance_requirements: string[];
  deployment_type: string;
  timeline: string;
  
  // Site Data
  site_created: boolean;
  site_data?: any;
  
  // Scoping Data  
  scoping_completed: boolean;
  scoping_document?: any;
  
  // Configuration Data
  config_generated: boolean;
  config_data?: any;
}

const steps = [
  { title: 'Project Basics', icon: FileText },
  { title: 'Sites', icon: MapPin },
  { title: 'AI Scoping', icon: Zap },
  { title: 'AI Configuration Generation (802.1X)', icon: Cog },
  { title: 'Review & Finish', icon: CheckCircle }
];

const UltimateIntelligentWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<UnifiedState>({
    project_name: '',
    industry: '',
    organization_size: '',
    project_description: '',
    pain_points: [],
    compliance_requirements: [],
    deployment_type: '',
    timeline: '',
    site_created: false,
    scoping_completed: false,
    config_generated: false
  });

  const [showSiteWizard, setShowSiteWizard] = useState(false);
  const [showScopingWizard, setShowScopingWizard] = useState(false);
  const [showConfigWizard, setShowConfigWizard] = useState(false);

  // Resource library hooks
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceFrameworks = [] } = useComplianceFrameworks();
  const { data: deploymentTypes = [] } = useDeploymentTypes();

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  const canNext = useMemo(() => {
    switch (currentStep) {
      case 0:
        return formData.project_name && formData.industry && formData.organization_size;
      case 1:
        return formData.site_created;
      case 2:
        return formData.scoping_completed;
      case 3:
        return formData.config_generated;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    try {
      toast.success("Project created successfully!");
      // Here you would save the project data
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const updateFormData = (field: keyof UnifiedState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Project Basics</h2>
        <p className="text-muted-foreground">
          Let's start by gathering basic information about your project
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                value={formData.project_name}
                onChange={(e) => updateFormData('project_name', e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => updateFormData('industry', value)}
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
              <Label htmlFor="organization_size">Organization Size *</Label>
              <Select 
                value={formData.organization_size} 
                onValueChange={(value) => updateFormData('organization_size', value)}
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

            <div>
              <Label htmlFor="project_description">Project Description</Label>
              <Textarea
                id="project_description"
                value={formData.project_description}
                onChange={(e) => updateFormData('project_description', e.target.value)}
                placeholder="Describe the project goals and scope"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pain Points & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pain Points</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {[
                  'Network Security',
                  'Compliance Requirements', 
                  'User Access Control',
                  'Device Authentication',
                  'Wireless Security',
                  'Guest Network Management',
                  'IoT Device Control',
                  'Remote Access'
                ].map(painPoint => (
                  <div key={painPoint} className="flex items-center space-x-2">
                    <Checkbox
                      id={painPoint}
                      checked={formData.pain_points.includes(painPoint)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('pain_points', [...formData.pain_points, painPoint]);
                        } else {
                          updateFormData('pain_points', formData.pain_points.filter(p => p !== painPoint));
                        }
                      }}
                    />
                    <Label htmlFor={painPoint} className="text-sm">{painPoint}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance & Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Compliance Requirements</Label>
            <div className="space-y-2 mt-2">
              {complianceFrameworks.slice(0, 6).map(framework => (
                <div key={framework.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={framework.name}
                    checked={formData.compliance_requirements.includes(framework.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData('compliance_requirements', [...formData.compliance_requirements, framework.name]);
                      } else {
                        updateFormData('compliance_requirements', formData.compliance_requirements.filter(r => r !== framework.name));
                      }
                    }}
                  />
                  <Label htmlFor={framework.name} className="text-sm">{framework.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="deployment_type">Deployment Type</Label>
            <Select 
              value={formData.deployment_type} 
              onValueChange={(value) => updateFormData('deployment_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select deployment type" />
              </SelectTrigger>
              <SelectContent>
                {deploymentTypes.map(type => (
                  <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Select 
              value={formData.timeline} 
              onValueChange={(value) => updateFormData('timeline', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (&lt; 1 month)</SelectItem>
                <SelectItem value="short">Short Term (1-3 months)</SelectItem>
                <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
                <SelectItem value="long">Long Term (6+ months)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {formData.project_name && formData.industry && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">AI Suggestion</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your {formData.industry} industry selection and {formData.organization_size} organization size, 
            we recommend focusing on network access control and compliance frameworks for optimal security posture.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Sites</h2>
        <p className="text-muted-foreground">
          Create and configure sites for your project
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          {!formData.site_created ? (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Create your first site to define network locations and infrastructure requirements.
              </p>
              <Button 
                onClick={() => setShowSiteWizard(true)}
                size="lg"
                className="w-full max-w-md"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Launch Site Creation Wizard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold">Site Created Successfully!</h3>
              <p className="text-muted-foreground">
                Your site configuration has been saved and is ready for scoping.
              </p>
              <Button 
                variant="outline"
                onClick={() => setShowSiteWizard(true)}
              >
                Edit Site Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showSiteWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <EnhancedSiteCreationWizard
              onComplete={(siteData) => {
                updateFormData('site_created', true);
                updateFormData('site_data', siteData);
                setShowSiteWizard(false);
                toast.success("Site created successfully!");
              }}
              onCancel={() => setShowSiteWizard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Zap className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">AI Scoping</h2>
        <p className="text-muted-foreground">
          Generate intelligent scoping documents using AI
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          {!formData.scoping_completed ? (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Use AI to analyze your requirements and generate comprehensive scoping documents.
              </p>
              <Button 
                onClick={() => setShowScopingWizard(true)}
                size="lg"
                className="w-full max-w-md"
              >
                <Zap className="h-5 w-5 mr-2" />
                Launch AI Scoping Wizard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold">Scoping Completed!</h3>
              <p className="text-muted-foreground">
                Your AI-generated scoping document is ready for review and configuration.
              </p>
              <Button 
                variant="outline"
                onClick={() => setShowScopingWizard(true)}
              >
                Review Scoping Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showScopingWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <EnhancedAIScopingWizard
              onComplete={(scopingData) => {
                updateFormData('scoping_completed', true);
                updateFormData('scoping_document', scopingData);
                setShowScopingWizard(false);
                toast.success("AI scoping completed successfully!");
              }}
              onCancel={() => setShowScopingWizard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Cog className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">AI Configuration Generation (802.1X)</h2>
        <p className="text-muted-foreground">
          Generate production-ready network configurations
        </p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          {!formData.config_generated ? (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Generate comprehensive 802.1X configurations based on your scoping and requirements.
              </p>
              <Button 
                onClick={() => setShowConfigWizard(true)}
                size="lg"
                className="w-full max-w-md"
              >
                <Cog className="h-5 w-5 mr-2" />
                Launch Configuration Wizard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold">Configuration Generated!</h3>
              <p className="text-muted-foreground">
                Your 802.1X configuration files are ready for deployment.
              </p>
              <Button 
                variant="outline"
                onClick={() => setShowConfigWizard(true)}
              >
                Review Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showConfigWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">802.1X Configuration Wizard</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowConfigWizard(false)}
                >
                  Close
                </Button>
              </div>
              <OneXerConfigWizard />
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    updateFormData('config_generated', true);
                    updateFormData('config_data', { generated: true });
                    setShowConfigWizard(false);
                    toast.success("Configuration generated successfully!");
                  }}
                >
                  Mark as Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Review & Finish</h2>
        <p className="text-muted-foreground">
          Review your project configuration and complete setup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Project Name:</span>
              <p className="text-muted-foreground">{formData.project_name}</p>
            </div>
            <div>
              <span className="font-medium">Industry:</span>
              <p className="text-muted-foreground">{formData.industry}</p>
            </div>
            <div>
              <span className="font-medium">Organization Size:</span>
              <p className="text-muted-foreground">{formData.organization_size}</p>
            </div>
            <div>
              <span className="font-medium">Pain Points:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.pain_points.map(point => (
                  <Badge key={point} variant="secondary" className="text-xs">{point}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created Artifacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Site Configuration</span>
              {formData.site_created ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <span className="text-muted-foreground">Not created</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Scoping Document</span>
              {formData.scoping_completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <span className="text-muted-foreground">Not completed</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>802.1X Configuration</span>
              {formData.config_generated ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <span className="text-muted-foreground">Not generated</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Ready to Create Project</h3>
          <p className="text-muted-foreground mb-6">
            All configurations are complete. Click below to finalize your project setup.
          </p>
          <Button 
            onClick={handleCreateProject}
            size="lg"
            className="w-full max-w-md"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Create Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Ultimate Intelligent Wizard
        </h1>
        <p className="text-muted-foreground">
          Complete project setup with AI-powered guidance
        </p>
        
        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
        {currentStep === 4 && renderStep5()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prev}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={next}
            disabled={!canNext}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => toast.success("Wizard completed successfully!")}
            disabled={!canNext}
          >
            Complete
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UltimateIntelligentWizard;