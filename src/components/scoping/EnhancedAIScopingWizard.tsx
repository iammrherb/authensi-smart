import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, FileText, Network, Shield, Target, Users, CheckCircle, 
  ArrowRight, ArrowLeft, Download, Save, Zap, BookOpen, Settings,
  Globe, Server, Database, Monitor, Smartphone, Lock, Building2
} from 'lucide-react';

import { useVendors } from '@/hooks/useVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { EnhancedResourceManager } from '@/components/resources/EnhancedResourceManager';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { PortnoxDocumentationService, type PortnoxDocumentationResult } from '@/services/PortnoxDocumentationService';
import ComprehensiveAIScopingWizard from './ComprehensiveAIScopingWizard';

interface EnhancedScopingSession {
  id: string;
  name: string;
  scopingData: any;
  selectedVendors: any[];
  selectedUseCases: any[];
  selectedRequirements: any[];
  generatedDocumentation?: PortnoxDocumentationResult;
  createdAt: string;
  completedAt?: string;
  projectId?: string;
}

interface EnhancedAIScopingWizardProps {
  onComplete?: (session: EnhancedScopingSession) => void;
  onCancel?: () => void;
  existingSession?: EnhancedScopingSession;
}

const EnhancedAIScopingWizard: React.FC<EnhancedAIScopingWizardProps> = ({
  onComplete,
  onCancel,
  existingSession
}) => {
  const [currentPhase, setCurrentPhase] = useState<'scoping' | 'documentation' | 'project-creation'>('scoping');
  const [scopingData, setScopingData] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<any[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<any[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<any[]>([]);
  const [generatedDocumentation, setGeneratedDocumentation] = useState<PortnoxDocumentationResult | null>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [currentSession, setCurrentSession] = useState<EnhancedScopingSession | null>(existingSession || null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  const { data: vendors = [] } = useVendors();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const createProjectMutation = useCreateProject();
  const { toast } = useToast();

  const phases = [
    {
      id: 'scoping',
      title: 'AI Scoping Analysis',
      icon: Brain,
      description: 'Comprehensive project scoping with AI recommendations'
    },
    {
      id: 'documentation',
      title: 'Documentation Generation',
      icon: FileText,
      description: 'Generate Portnox prerequisites and deployment guides'
    },
    {
      id: 'project-creation',
      title: 'Project Creation',
      icon: Target,
      description: 'Create project with complete documentation'
    }
  ];

  useEffect(() => {
    if (existingSession) {
      setScopingData(existingSession.scopingData);
      setSelectedVendors(existingSession.selectedVendors);
      setSelectedUseCases(existingSession.selectedUseCases);
      setSelectedRequirements(existingSession.selectedRequirements);
      if (existingSession.generatedDocumentation) {
        setGeneratedDocumentation(existingSession.generatedDocumentation);
        setCurrentPhase('documentation');
      }
    }
  }, [existingSession]);

  const handleScopingComplete = (projectId: string, completedScopingData: any) => {
    console.log('Scoping completed:', { projectId, completedScopingData });
    setScopingData(completedScopingData);
    
    // Extract selected items from scoping data
    const vendorIds = completedScopingData.templates_ai?.ai_recommendations?.recommended_vendors?.map((v: any) => v.vendor) || [];
    const useCaseIds = completedScopingData.use_cases_requirements?.selected_use_cases || [];
    const requirementIds = completedScopingData.use_cases_requirements?.selected_requirements || [];
    
    // Map to actual objects from Resource Library
    const mappedVendors = vendors.filter(v => vendorIds.includes(v.id) || vendorIds.includes(v.vendor_name));
    const mappedUseCases = useCases.filter(uc => useCaseIds.includes(uc.id) || useCaseIds.includes(uc.name));
    const mappedRequirements = requirements.filter(req => requirementIds.includes(req.id) || requirementIds.includes(req.title));
    
    setSelectedVendors(mappedVendors);
    setSelectedUseCases(mappedUseCases);
    setSelectedRequirements(mappedRequirements);
    
    // Create session
    const session: EnhancedScopingSession = {
      id: Date.now().toString(),
      name: completedScopingData.organization?.name || 'Unnamed Project',
      scopingData: completedScopingData,
      selectedVendors: mappedVendors,
      selectedUseCases: mappedUseCases,
      selectedRequirements: mappedRequirements,
      createdAt: new Date().toISOString()
    };
    
    setCurrentSession(session);
    setCurrentPhase('documentation');
    
    toast({
      title: "Scoping Complete",
      description: "Ready to generate comprehensive documentation",
    });
  };

  const handleResourceSelect = (resource: any, type: 'vendor' | 'usecase' | 'requirement') => {
    switch (type) {
      case 'vendor':
        if (!selectedVendors.some(v => v.id === resource.id)) {
          setSelectedVendors([...selectedVendors, resource]);
        }
        break;
      case 'usecase':
        if (!selectedUseCases.some(uc => uc.id === resource.id)) {
          setSelectedUseCases([...selectedUseCases, resource]);
        }
        break;
      case 'requirement':
        if (!selectedRequirements.some(req => req.id === resource.id)) {
          setSelectedRequirements([...selectedRequirements, resource]);
        }
        break;
    }
  };

  const generateComprehensiveDocumentation = async () => {
    if (!scopingData || !currentSession) return;
    
    setIsGeneratingDocs(true);
    try {
      const documentation = await PortnoxDocumentationService.generateComprehensiveDocumentation(
        scopingData,
        selectedVendors,
        selectedUseCases,
        selectedRequirements
      );
      
      setGeneratedDocumentation(documentation);
      
      // Update session with documentation
      const updatedSession = {
        ...currentSession,
        generatedDocumentation: documentation
      };
      setCurrentSession(updatedSession);
      
      // Save to local storage
      localStorage.setItem(`scoping_session_${currentSession.id}`, JSON.stringify(updatedSession));
      
      toast({
        title: "Documentation Generated",
        description: "Comprehensive Portnox deployment guide created",
      });
      
      setCurrentPhase('project-creation');
    } catch (error) {
      console.error('Documentation generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  const createProjectFromSession = async () => {
    if (!currentSession || !scopingData) return;

    const projectData = {
      name: scopingData.organization.name,
      description: `AI-generated project with comprehensive Portnox documentation`,
      client_name: scopingData.organization.name,
      industry: scopingData.organization.industry,
      deployment_type: scopingData.network_infrastructure.topology_type?.toLowerCase() || 'hybrid',
      security_level: 'enhanced',
      total_sites: scopingData.network_infrastructure.site_count || 1,
      total_endpoints: scopingData.organization.total_users || 100,
      compliance_frameworks: scopingData.organization.compliance_needs || [],
      pain_points: scopingData.organization.pain_points || [],
      success_criteria: scopingData.use_cases_requirements.success_criteria || [],
      status: 'planning' as const,
      current_phase: 'scoping' as const,
      progress_percentage: 25,
      business_summary: generateBusinessSummary(scopingData, generatedDocumentation)
    };

    createProjectMutation.mutate(projectData, {
      onSuccess: (project) => {
        const completedSession = {
          ...currentSession,
          projectId: project.id,
          completedAt: new Date().toISOString()
        };
        
        // Save completed session
        localStorage.setItem(`scoping_session_${currentSession.id}`, JSON.stringify(completedSession));
        
        toast({
          title: "Project Created Successfully",
          description: "Project created with comprehensive documentation",
        });
        
        onComplete?.(completedSession);
      },
      onError: (error) => {
        toast({
          title: "Project Creation Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const generateBusinessSummary = (scopingData: any, documentation: PortnoxDocumentationResult | null): string => {
    let summary = `Comprehensive Portnox NAC deployment for ${scopingData.organization.name}`;
    
    if (documentation) {
      summary += `\n\nDeployment Overview:`;
      summary += `\n- ${documentation.vendorSpecificDocs.length} vendor integrations configured`;
      summary += `\n- ${documentation.integrationSpecs.length} system integrations planned`;
      summary += `\n- ${documentation.deploymentGuide.length} deployment phases defined`;
      summary += `\n- Complete prerequisite documentation generated`;
      
      if (documentation.generalRequirements.length > 0) {
        summary += `\n\nKey Requirements: ${documentation.generalRequirements.map(req => req.title).join(', ')}`;
      }
    }
    
    return summary;
  };

  const downloadDocumentation = () => {
    if (!generatedDocumentation || !currentSession) return;
    
    const documentContent = {
      sessionInfo: {
        name: currentSession.name,
        createdAt: currentSession.createdAt,
        completedAt: currentSession.completedAt
      },
      scopingData: scopingData,
      documentation: generatedDocumentation
    };
    
    const blob = new Blob([JSON.stringify(documentContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portnox-deployment-${currentSession.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'scoping':
        return (
          <div className="space-y-6">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                This enhanced AI scoping wizard integrates with your Resource Library and generates comprehensive Portnox documentation.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-6">
              <ComprehensiveAIScopingWizard
                onComplete={handleScopingComplete}
                onCancel={onCancel}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Resource Library Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select additional vendors, use cases, and requirements from your resource library
                  </p>
                  
                  <EnhancedResourceManager 
                    onResourceSelect={handleResourceSelect}
                    selectedResources={{
                      vendors: selectedVendors,
                      useCases: selectedUseCases,
                      requirements: selectedRequirements
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'documentation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Generate Portnox Documentation</h3>
                <p className="text-muted-foreground">
                  Create comprehensive prerequisites and deployment guides
                </p>
              </div>
              {generatedDocumentation && (
                <Button variant="outline" onClick={downloadDocumentation}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
            
            {!generatedDocumentation ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Network className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Vendors</div>
                      <div className="text-sm text-muted-foreground">{selectedVendors.length} selected</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Use Cases</div>
                      <div className="text-sm text-muted-foreground">{selectedUseCases.length} selected</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Requirements</div>
                      <div className="text-sm text-muted-foreground">{selectedRequirements.length} selected</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Documentation will include:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Vendor-specific integration guides and configurations</li>
                      <li>• Network prerequisites and firewall requirements</li>
                      <li>• MDM, IDP, SIEM integration specifications</li>
                      <li>• Agent vs agentless deployment recommendations</li>
                      <li>• RADIUS, TACACS+, and AD broker configurations</li>
                      <li>• Portnox documentation links and troubleshooting guides</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={generateComprehensiveDocumentation}
                    disabled={isGeneratingDocs}
                    className="w-full"
                  >
                    {isGeneratingDocs ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Generating Documentation...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Comprehensive Documentation
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <DocumentationViewer documentation={generatedDocumentation} />
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentPhase('scoping')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scoping
              </Button>
              {generatedDocumentation && (
                <Button onClick={() => setCurrentPhase('project-creation')}>
                  Create Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'project-creation':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Create Project with Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Project Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {scopingData?.organization?.name}</div>
                      <div><strong>Industry:</strong> {scopingData?.organization?.industry}</div>
                      <div><strong>Sites:</strong> {scopingData?.network_infrastructure?.site_count}</div>
                      <div><strong>Users:</strong> {scopingData?.organization?.total_users}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Documentation Included</h4>
                    <div className="space-y-1 text-sm">
                      <div>✓ Vendor integration guides ({generatedDocumentation?.vendorSpecificDocs.length})</div>
                      <div>✓ Deployment phases ({generatedDocumentation?.deploymentGuide.length})</div>
                      <div>✓ Integration specifications ({generatedDocumentation?.integrationSpecs.length})</div>
                      <div>✓ Prerequisites and requirements</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Button 
                      onClick={createProjectFromSession}
                      disabled={createProjectMutation.isPending}
                      size="lg"
                    >
                      {createProjectMutation.isPending ? 'Creating...' : 'Create Project with Documentation'}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentPhase('documentation')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Enhanced AI Scoping Wizard</h2>
          <Badge variant="secondary">
            Phase {phases.findIndex(p => p.id === currentPhase) + 1} of {phases.length}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = phase.id === currentPhase;
            const isCompleted = phases.findIndex(p => p.id === currentPhase) > index;
            
            return (
              <div key={phase.id} className="flex items-center">
                <div className={`flex items-center space-x-2 p-2 rounded-lg ${
                  isActive ? 'bg-primary text-primary-foreground' : 
                  isCompleted ? 'bg-green-100 text-green-700' : 'bg-muted'
                }`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{phase.title}</span>
                </div>
                {index < phases.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
        
        <Progress value={((phases.findIndex(p => p.id === currentPhase) + 1) / phases.length) * 100} />
      </div>
      
      {/* Phase Content */}
      {renderPhaseContent()}
    </div>
  );
};

// Documentation Viewer Component
const DocumentationViewer: React.FC<{ documentation: PortnoxDocumentationResult }> = ({ documentation }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="vendors">Vendors</TabsTrigger>
        <TabsTrigger value="deployment">Deployment</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentation.vendorSpecificDocs.length}</div>
              <div className="text-sm text-muted-foreground">Configured</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentation.deploymentGuide.length}</div>
              <div className="text-sm text-muted-foreground">Deployment phases</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentation.integrationSpecs.length}</div>
              <div className="text-sm text-muted-foreground">System integrations</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>General Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {documentation.generalRequirements.map((req, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{req.category}</Badge>
                    <h4 className="font-medium">{req.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                  {req.requirements.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {req.requirements.map((requirement, reqIndex) => (
                        <li key={reqIndex}>• {requirement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="vendors" className="space-y-4">
        <div className="grid gap-4">
          {documentation.vendorSpecificDocs.map((vendor, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{vendor.vendorName}</CardTitle>
                  <Badge variant={
                    vendor.supportLevel === 'full' ? 'default' :
                    vendor.supportLevel === 'partial' ? 'secondary' :
                    vendor.supportLevel === 'limited' ? 'outline' : 'destructive'
                  }>
                    {vendor.supportLevel} support
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Configuration Requirements</h4>
                  <ul className="text-sm space-y-1">
                    {vendor.configurationRequirements.map((req, reqIndex) => (
                      <li key={reqIndex}>• {req}</li>
                    ))}
                  </ul>
                </div>
                {vendor.knownLimitations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Known Limitations</h4>
                    <ul className="text-sm space-y-1 text-amber-600">
                      {vendor.knownLimitations.map((limitation, limIndex) => (
                        <li key={limIndex}>⚠ {limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="deployment" className="space-y-4">
        <div className="space-y-4">
          {documentation.deploymentGuide.map((phase, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {phase.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{phase.description}</p>
                
                {phase.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Prerequisites</h4>
                    <ul className="text-sm space-y-1">
                      {phase.prerequisites.map((prereq, preIndex) => (
                        <li key={preIndex}>• {prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Steps</h4>
                  <div className="space-y-2">
                    {phase.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="border-l-2 border-primary pl-4">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        <div className="text-xs text-muted-foreground">Estimated time: {step.estimatedTime}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="integrations" className="space-y-4">
        <div className="grid gap-4">
          {documentation.integrationSpecs.map((integration, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {integration.type === 'MDM' && <Smartphone className="h-5 w-5" />}
                    {integration.type === 'IDP' && <Users className="h-5 w-5" />}
                    {integration.type === 'SIEM' && <Shield className="h-5 w-5" />}
                    {integration.type === 'RADIUS' && <Lock className="h-5 w-5" />}
                    {(integration.type === 'FIREWALL' || integration.type === 'OTHER') && <Network className="h-5 w-5" />}
                    {integration.name}
                  </CardTitle>
                  <Badge variant={integration.agentRequired ? 'default' : 'secondary'}>
                    {integration.agentRequired ? 'Agent Required' : 'Agentless'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{integration.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Configuration Steps</h4>
                    <ol className="text-sm space-y-1">
                      {integration.configurationSteps.map((step, stepIndex) => (
                        <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  {integration.requiredPorts.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Required Ports</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.requiredPorts.map((port, portIndex) => (
                          <Badge key={portIndex} variant="outline" className="text-xs">
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {!integration.agentRequired && integration.agentlessOptions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Agentless Options</h4>
                    <ul className="text-sm space-y-1">
                      {integration.agentlessOptions.map((option, optIndex) => (
                        <li key={optIndex}>• {option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedAIScopingWizard;