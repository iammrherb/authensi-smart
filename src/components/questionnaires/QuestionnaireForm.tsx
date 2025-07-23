import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useCreateQuestionnaire, useUpdateQuestionnaire, type QuestionnaireData } from "@/hooks/useQuestionnaires";
import { Save, Eye, ArrowLeft, ArrowRight } from "lucide-react";

interface QuestionnaireFormProps {
  questionnaire?: any;
  sites: any[];
  projects: any[];
  mode: 'create' | 'view' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

const QuestionnaireForm = ({ questionnaire, sites, projects, mode, onSuccess, onCancel }: QuestionnaireFormProps) => {
  const [activeTab, setActiveTab] = useState("deployment-type");
  const [formData, setFormData] = useState<QuestionnaireData>({
    deploymentType: '',
    useCases: [],
    requirements: {
      endpoints: 0,
      sites: 0,
      networkInfrastructure: '',
      authenticationMethod: '',
      compliance: '',
      timeline: ''
    },
    discoveryAnswers: {
      infrastructure: {},
      security: {},
      business: {}
    },
    testCases: [],
    sizing: {
      estimatedEndpoints: 0,
      requiredAppliances: 0,
      estimatedTimeline: '',
      budget: 0
    }
  });
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const createQuestionnaire = useCreateQuestionnaire();
  const updateQuestionnaire = useUpdateQuestionnaire();

  const isViewMode = mode === 'view';
  const tabs = [
    { id: "deployment-type", label: "Deployment Type", icon: "🏢" },
    { id: "use-cases", label: "Use Cases", icon: "🎯" },
    { id: "requirements", label: "Requirements", icon: "📋" },
    { id: "discovery", label: "Discovery", icon: "🔍" },
    { id: "test-cases", label: "Test Cases", icon: "🧪" },
    { id: "sizing", label: "Sizing", icon: "📊" }
  ];

  const useCaseOptions = [
    {
      category: "Network Access Control",
      cases: [
        "Device Authentication & Authorization",
        "BYOD Policy Enforcement", 
        "Guest Network Management",
        "IoT Device Onboarding",
        "Zero Trust Network Access",
        "Compliance Monitoring (PCI-DSS, HIPAA, SOX)"
      ]
    },
    {
      category: "Identity Management",
      cases: [
        "Active Directory Integration",
        "LDAP/SAML Authentication",
        "Multi-Factor Authentication",
        "Certificate-based Authentication",
        "Mobile Device Management Integration",
        "Privileged Access Management"
      ]
    },
    {
      category: "Security & Compliance",
      cases: [
        "Vulnerability Assessment",
        "Endpoint Protection Integration",
        "SIEM Integration & Logging",
        "Audit Trail & Reporting",
        "Risk-based Access Control",
        "Automated Remediation"
      ]
    },
    {
      category: "Operational Management",
      cases: [
        "Network Visibility & Monitoring",
        "Automated Incident Response",
        "User Self-Service Portal",
        "Help Desk Integration",
        "Performance Monitoring",
        "Capacity Planning"
      ]
    }
  ];

  const deploymentTypes = [
    {
      type: "smb",
      label: "SMB (Small-Medium Business)",
      description: "1-500 endpoints, single location",
      features: ["Basic NAC", "Cloud Management", "Standard Policies"],
      timeline: "2-4 weeks",
      complexity: "Low"
    },
    {
      type: "mid-market",
      label: "Mid-Market Enterprise",
      description: "500-5000 endpoints, multiple locations",
      features: ["Advanced NAC", "Integration Hub", "Custom Policies", "Multi-site"],
      timeline: "6-12 weeks",
      complexity: "Medium"
    },
    {
      type: "large-enterprise",
      label: "Large Enterprise",
      description: "5000+ endpoints, global deployment",
      features: ["Enterprise NAC", "Full Integration", "Advanced Analytics", "Global Scale"],
      timeline: "12-24 weeks",
      complexity: "High"
    }
  ];

  const discoveryQuestions = {
    infrastructure: [
      "How many total endpoints need NAC coverage?",
      "What types of devices are in your environment?",
      "What network infrastructure vendors are you using?",
      "Do you have existing network segmentation?",
      "What authentication systems are currently in place?"
    ],
    security: [
      "What compliance requirements must be met?",
      "What are your current security policies?",
      "Do you have existing security tools to integrate?",
      "What are your incident response procedures?",
      "What visibility requirements do you have?"
    ],
    business: [
      "What is driving the NAC implementation?",
      "What are your success criteria?",
      "What is your timeline for deployment?",
      "What resources do you have available?",
      "What is your change management process?"
    ]
  };

  useEffect(() => {
    if (questionnaire) {
      setFormData(questionnaire.questionnaire_data || formData);
      setSelectedSite(questionnaire.site_id);
      setSelectedProject(questionnaire.project_id || '');
    }
  }, [questionnaire]);

  const calculateProgress = () => {
    let completed = 0;
    let total = 6;
    
    if (formData.deploymentType) completed++;
    if (formData.useCases.length > 0) completed++;
    if (Object.values(formData.requirements).some(val => val)) completed++;
    if (Object.keys(formData.discoveryAnswers.infrastructure).length > 0) completed++;
    if (formData.testCases.length > 0) completed++;
    if (formData.sizing.estimatedEndpoints > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const handleSave = async () => {
    if (!selectedSite) {
      alert('Please select a site');
      return;
    }

    const questionnaireData = {
      site_id: selectedSite,
      project_id: selectedProject || undefined,
      questionnaire_data: formData,
      status: calculateProgress() === 100 ? 'completed' : 'in-progress'
    };

    if (questionnaire) {
      updateQuestionnaire.mutate({ 
        id: questionnaire.id, 
        ...questionnaireData,
        status: questionnaireData.status as any
      });
    } else {
      createQuestionnaire.mutate(questionnaireData);
    }
    
    onSuccess();
  };

  const handleUseCaseToggle = (useCase: string) => {
    if (isViewMode) return;
    
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter(uc => uc !== useCase)
        : [...prev.useCases, useCase]
    }));
  };

  const handleDiscoveryAnswer = (category: keyof typeof discoveryQuestions, question: string, answer: string) => {
    if (isViewMode) return;
    
    setFormData(prev => ({
      ...prev,
      discoveryAnswers: {
        ...prev.discoveryAnswers,
        [category]: {
          ...prev.discoveryAnswers[category],
          [question]: answer
        }
      }
    }));
  };

  const addTestCase = () => {
    if (isViewMode) return;
    
    setFormData(prev => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        {
          category: '',
          name: '',
          description: '',
          priority: 'medium' as const,
          status: 'pending' as const,
          requirements: []
        }
      ]
    }));
  };

  const updateTestCase = (index: number, field: string, value: any) => {
    if (isViewMode) return;
    
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }));
  };

  const removeTestCase = (index: number) => {
    if (isViewMode) return;
    
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {mode === 'create' && 'New Scoping Questionnaire'}
            {mode === 'view' && 'Questionnaire Details'}
            {mode === 'edit' && 'Edit Questionnaire'}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Progress value={calculateProgress()} className="w-32" />
              <span className="text-sm text-muted-foreground">
                {calculateProgress()}% Complete
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {!isViewMode && (
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Site and Project Selection */}
      {mode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Site *</label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} - {site.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Project (Optional)</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Project</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Deployment Type Tab */}
        <TabsContent value="deployment-type" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Deployment Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {deploymentTypes.map(deployment => (
                  <Card 
                    key={deployment.type}
                    className={`cursor-pointer transition-all duration-300 ${
                      formData.deploymentType === deployment.type
                        ? "border-primary bg-gradient-glow" 
                        : "hover:border-primary/30"
                    } ${isViewMode ? 'cursor-default' : ''}`}
                    onClick={() => !isViewMode && setFormData(prev => ({ ...prev, deploymentType: deployment.type }))}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{deployment.label}</CardTitle>
                          <p className="text-muted-foreground mt-1">{deployment.description}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant="outline">{deployment.complexity} Complexity</Badge>
                          <div className="text-sm text-muted-foreground">{deployment.timeline}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {deployment.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Use Cases Tab */}
        <TabsContent value="use-cases" className="space-y-6">
          <div className="grid gap-6">
            {useCaseOptions.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.cases.map((useCase, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`use-case-${index}-${idx}`}
                          checked={formData.useCases.includes(useCase)}
                          onCheckedChange={() => handleUseCaseToggle(useCase)}
                          disabled={isViewMode}
                        />
                        <label 
                          htmlFor={`use-case-${index}-${idx}`}
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {useCase}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Total Endpoints</label>
                    <Input 
                      type="number" 
                      value={formData.requirements.endpoints}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, endpoints: parseInt(e.target.value) || 0 }
                      }))}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Number of Sites</label>
                    <Input 
                      type="number" 
                      value={formData.requirements.sites}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, sites: parseInt(e.target.value) || 0 }
                      }))}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Network Infrastructure</label>
                    <Select 
                      value={formData.requirements.networkInfrastructure}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, networkInfrastructure: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="aruba">Aruba/HPE</SelectItem>
                        <SelectItem value="juniper">Juniper</SelectItem>
                        <SelectItem value="extreme">Extreme Networks</SelectItem>
                        <SelectItem value="mixed">Mixed Environment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Authentication Method</label>
                    <Select 
                      value={formData.requirements.authenticationMethod}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, authenticationMethod: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Primary authentication" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ad">Active Directory</SelectItem>
                        <SelectItem value="ldap">LDAP</SelectItem>
                        <SelectItem value="saml">SAML/SSO</SelectItem>
                        <SelectItem value="certificate">Certificate-based</SelectItem>
                        <SelectItem value="multi">Multi-method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Compliance Requirements</label>
                    <Select 
                      value={formData.requirements.compliance}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, compliance: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select compliance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pci">PCI-DSS</SelectItem>
                        <SelectItem value="hipaa">HIPAA</SelectItem>
                        <SelectItem value="sox">SOX</SelectItem>
                        <SelectItem value="iso">ISO 27001</SelectItem>
                        <SelectItem value="multiple">Multiple Standards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deployment Timeline</label>
                    <Select 
                      value={formData.requirements.timeline}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, timeline: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Target timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rush">&lt; 4 weeks (Rush)</SelectItem>
                        <SelectItem value="standard">4-12 weeks (Standard)</SelectItem>
                        <SelectItem value="extended">12+ weeks (Phased)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discovery Tab */}
        <TabsContent value="discovery" className="space-y-6">
          {Object.entries(discoveryQuestions).map(([category, questions]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg capitalize text-primary">
                  {category} Discovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium">{question}</label>
                    <Textarea 
                      placeholder="Enter detailed response..."
                      className="min-h-[80px]"
                      value={formData.discoveryAnswers[category as keyof typeof formData.discoveryAnswers][question] || ''}
                      onChange={(e) => handleDiscoveryAnswer(category as keyof typeof discoveryQuestions, question, e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="test-cases" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Use Case Test Cases</CardTitle>
                {!isViewMode && (
                  <Button onClick={addTestCase} variant="outline">
                    Add Test Case
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {formData.testCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No test cases defined yet. Add test cases to validate your use cases.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.testCases.map((testCase, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Category</label>
                            <Input
                              value={testCase.category}
                              onChange={(e) => updateTestCase(index, 'category', e.target.value)}
                              disabled={isViewMode}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Test Name</label>
                            <Input
                              value={testCase.name}
                              onChange={(e) => updateTestCase(index, 'name', e.target.value)}
                              disabled={isViewMode}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={testCase.description}
                              onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                              disabled={isViewMode}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Priority</label>
                            <Select 
                              value={testCase.priority}
                              onValueChange={(value) => updateTestCase(index, 'priority', value)}
                              disabled={isViewMode}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select 
                              value={testCase.status}
                              onValueChange={(value) => updateTestCase(index, 'status', value)}
                              disabled={isViewMode}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {!isViewMode && (
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTestCase(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove Test Case
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sizing Tab */}
        <TabsContent value="sizing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Sizing & Estimates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Estimated Endpoints</label>
                  <Input
                    type="number"
                    value={formData.sizing.estimatedEndpoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sizing: { ...prev.sizing, estimatedEndpoints: parseInt(e.target.value) || 0 }
                    }))}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Required Appliances</label>
                  <Input
                    type="number"
                    value={formData.sizing.requiredAppliances}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sizing: { ...prev.sizing, requiredAppliances: parseInt(e.target.value) || 0 }
                    }))}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Timeline</label>
                  <Input
                    value={formData.sizing.estimatedTimeline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sizing: { ...prev.sizing, estimatedTimeline: e.target.value }
                    }))}
                    placeholder="e.g., 12-16 weeks"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Budget</label>
                  <Input
                    type="number"
                    value={formData.sizing.budget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sizing: { ...prev.sizing, budget: parseInt(e.target.value) || 0 }
                    }))}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionnaireForm;