import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Save, CheckCircle, AlertTriangle } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import { useUseCases } from "@/hooks/useUseCases";
import { useRequirements } from "@/hooks/useRequirements";
import { useEnhancedVendors } from "@/hooks/useVendors";

interface ProjectScopingData {
  // Basic Project Info
  name: string;
  client_name: string;
  description: string;
  industry: string;
  deployment_type: 'SMB' | 'Mid-Market' | 'Enterprise' | 'Global';
  security_level: 'Basic' | 'Advanced' | 'Zero-Trust';
  
  // Compliance & Requirements
  compliance_frameworks: string[];
  total_endpoints: number;
  total_sites: number;
  
  // Business Context
  success_criteria: string[];
  pain_points: string[];
  integration_requirements: any[];
  migration_scope: any;
  
  // Timeline & Resources
  start_date: string;
  target_completion: string;
  budget: number;
  
  // Selected Components
  selectedUseCases: string[];
  selectedRequirements: string[];
  selectedVendors: string[];
  
  // Authentication & Infrastructure
  authenticationMethods: string[];
  networkRequirements: any[];
  securityRequirements: any[];
}

const ProjectScopingWizard = ({ onComplete }: { onComplete?: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectScopingData>({
    name: "",
    client_name: "",
    description: "",
    industry: "",
    deployment_type: "Mid-Market",
    security_level: "Advanced",
    compliance_frameworks: [],
    total_endpoints: 0,
    total_sites: 1,
    success_criteria: [],
    pain_points: [],
    integration_requirements: [],
    migration_scope: {},
    start_date: "",
    target_completion: "",
    budget: 0,
    selectedUseCases: [],
    selectedRequirements: [],
    selectedVendors: [],
    authenticationMethods: [],
    networkRequirements: [],
    securityRequirements: []
  });

  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { data: vendors = [] } = useEnhancedVendors();
  const createProject = useCreateProject();

  const steps = [
    "Project Basics",
    "Industry & Compliance", 
    "Use Cases & Requirements",
    "Infrastructure & Security",
    "Timeline & Budget",
    "Review & Create"
  ];

  const industries = [
    "Healthcare", "Financial Services", "Manufacturing", "Education", 
    "Government", "Retail", "Technology", "Legal", "Energy", "Other"
  ];

  const complianceFrameworks = [
    "HIPAA", "PCI-DSS", "SOX", "GDPR", "SOC 2", "ISO 27001", 
    "NIST", "FedRAMP", "FISMA", "CMMC"
  ];

  const authMethods = [
    "802.1X with Certificates", "MAB (MAC Authentication Bypass)",
    "Credential-based Authentication", "SAML/SSO Integration",
    "Guest Portal", "Captive Portal", "BYOD Registration",
    "TACACS+ for Network Devices", "RADIUS/RadSec",
    "MFA Integration", "OpenID Connect"
  ];

  const calculateProgress = () => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectData = {
        name: formData.name,
        client_name: formData.client_name,
        description: formData.description,
        industry: formData.industry,
        deployment_type: formData.deployment_type,
        security_level: formData.security_level,
        compliance_frameworks: formData.compliance_frameworks,
        total_endpoints: formData.total_endpoints,
        total_sites: formData.total_sites,
        success_criteria: formData.success_criteria,
        pain_points: formData.pain_points,
        integration_requirements: formData.integration_requirements,
        migration_scope: formData.migration_scope,
        start_date: formData.start_date,
        target_completion: formData.target_completion,
        budget: formData.budget,
        status: 'scoping' as const,
        current_phase: 'scoping' as const,
        progress_percentage: 10
      };

      await createProject.mutateAsync(projectData);
      onComplete?.();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Project Basics
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Enter client organization name"
              />
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project scope and objectives..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Deployment Type</Label>
                <Select
                  value={formData.deployment_type}
                  onValueChange={(value: any) => setFormData({ ...formData, deployment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMB">SMB (1-500 endpoints)</SelectItem>
                    <SelectItem value="Mid-Market">Mid-Market (500-5000 endpoints)</SelectItem>
                    <SelectItem value="Enterprise">Enterprise (5000+ endpoints)</SelectItem>
                    <SelectItem value="Global">Global (Multi-region)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Security Level</Label>
                <Select
                  value={formData.security_level}
                  onValueChange={(value: any) => setFormData({ ...formData, security_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic NAC</SelectItem>
                    <SelectItem value="Advanced">Advanced NAC</SelectItem>
                    <SelectItem value="Zero-Trust">Zero Trust Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1: // Industry & Compliance
        return (
          <div className="space-y-6">
            <div>
              <Label>Industry Vertical</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Compliance Frameworks</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {complianceFrameworks.map((framework) => (
                  <div key={framework} className="flex items-center space-x-2">
                    <Checkbox
                      id={framework}
                      checked={formData.compliance_frameworks.includes(framework)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            compliance_frameworks: [...formData.compliance_frameworks, framework]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            compliance_frameworks: formData.compliance_frameworks.filter(f => f !== framework)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={framework} className="text-sm">{framework}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endpoints">Total Endpoints</Label>
                <Input
                  id="endpoints"
                  type="number"
                  value={formData.total_endpoints}
                  onChange={(e) => setFormData({ ...formData, total_endpoints: parseInt(e.target.value) || 0 })}
                  placeholder="Number of devices"
                />
              </div>
              <div>
                <Label htmlFor="sites">Number of Sites</Label>
                <Input
                  id="sites"
                  type="number"
                  value={formData.total_sites}
                  onChange={(e) => setFormData({ ...formData, total_sites: parseInt(e.target.value) || 1 })}
                  placeholder="Number of locations"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Use Cases & Requirements
        return (
          <div className="space-y-6">
            <Tabs defaultValue="usecases" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="usecases">Use Cases</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="usecases" className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {useCases.map((useCase) => (
                    <div key={useCase.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={useCase.id}
                        checked={formData.selectedUseCases.includes(useCase.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              selectedUseCases: [...formData.selectedUseCases, useCase.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedUseCases: formData.selectedUseCases.filter(id => id !== useCase.id)
                            });
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={useCase.id} className="font-medium">{useCase.name}</Label>
                        <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{useCase.category}</Badge>
                          <Badge variant="outline" className="text-xs">{useCase.complexity}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={requirement.id}
                        checked={formData.selectedRequirements.includes(requirement.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              selectedRequirements: [...formData.selectedRequirements, requirement.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedRequirements: formData.selectedRequirements.filter(id => id !== requirement.id)
                            });
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={requirement.id} className="font-medium">{requirement.title}</Label>
                        <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{requirement.category}</Badge>
                          <Badge variant="outline" className="text-xs">{requirement.priority}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 3: // Infrastructure & Security
        return (
          <div className="space-y-6">
            <div>
              <Label>Authentication Methods</Label>
              <div className="grid grid-cols-1 gap-3 mt-3 max-h-48 overflow-y-auto">
                {authMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.authenticationMethods.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            authenticationMethods: [...formData.authenticationMethods, method]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            authenticationMethods: formData.authenticationMethods.filter(m => m !== method)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={method} className="text-sm">{method}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Key Vendors</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 mt-3">
                {vendors.slice(0, 10).map((vendor) => (
                  <div key={vendor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={vendor.id}
                      checked={formData.selectedVendors.includes(vendor.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            selectedVendors: [...formData.selectedVendors, vendor.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            selectedVendors: formData.selectedVendors.filter(id => id !== vendor.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={vendor.id} className="text-sm">{vendor.vendor_name}</Label>
                    <Badge variant="outline" className="text-xs">{vendor.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Timeline & Budget
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Project Start Date</Label>
                <Input
                  id="start"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="target">Target Completion</Label>
                <Input
                  id="target"
                  type="date"
                  value={formData.target_completion}
                  onChange={(e) => setFormData({ ...formData, target_completion: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Project Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                placeholder="Enter budget amount"
              />
            </div>

            <div>
              <Label>Success Criteria</Label>
              <Textarea
                placeholder="Define what success looks like for this project..."
                onChange={(e) => {
                  const criteria = e.target.value.split('\n').filter(c => c.trim());
                  setFormData({ ...formData, success_criteria: criteria });
                }}
                rows={4}
              />
            </div>

            <div>
              <Label>Key Pain Points</Label>
              <Textarea
                placeholder="What problems are we solving with this implementation..."
                onChange={(e) => {
                  const points = e.target.value.split('\n').filter(p => p.trim());
                  setFormData({ ...formData, pain_points: points });
                }}
                rows={4}
              />
            </div>
          </div>
        );

      case 5: // Review & Create
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Client:</strong> {formData.client_name}</div>
                  <div><strong>Industry:</strong> {formData.industry}</div>
                  <div><strong>Type:</strong> {formData.deployment_type}</div>
                  <div><strong>Security:</strong> {formData.security_level}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scope & Scale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Endpoints:</strong> {formData.total_endpoints.toLocaleString()}</div>
                  <div><strong>Sites:</strong> {formData.total_sites}</div>
                  <div><strong>Budget:</strong> ${formData.budget.toLocaleString()}</div>
                  <div><strong>Use Cases:</strong> {formData.selectedUseCases.length}</div>
                  <div><strong>Requirements:</strong> {formData.selectedRequirements.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formData.compliance_frameworks.map((framework) => (
                    <Badge key={framework} variant="outline">{framework}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Ready to Create Project</span>
              </div>
              <p className="text-green-700 mt-2">
                All required information has been collected. Click "Create Project" to proceed.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Comprehensive Project Scoping
          </CardTitle>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={calculateProgress()} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {steps[currentStep]} - {calculateProgress()}% Complete
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleCreateProject}
                disabled={createProject.isPending || !formData.name || !formData.client_name}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectScopingWizard;