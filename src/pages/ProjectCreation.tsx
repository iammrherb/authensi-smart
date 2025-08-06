import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Brain, Building2, Users, CheckSquare, Calendar, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import EnhancedProjectCreationWizard from "@/components/comprehensive/EnhancedProjectCreationWizard";
import UltimateAIScopingWizard from "@/components/scoping/UltimateAIScopingWizard";

const ProjectCreation = () => {
  const navigate = useNavigate();
  const [wizardStep, setWizardStep] = useState(0);
  const [activeWizard, setActiveWizard] = useState<'none' | 'creation' | 'ultimate-scoping'>('none');
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const createProject = useCreateProject();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved scoping sessions
    const saved = localStorage.getItem('scopingSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

  const getDeploymentTypeFromOrganization = (organization: any): string => {
    const userCount = organization?.total_users || 0;
    const siteCount = organization?.site_count || 1;
    
    // Determine deployment type based on organization size
    if (userCount < 100 && siteCount <= 1) return 'SMB';
    if (userCount < 1000 && siteCount <= 5) return 'Mid-Market';
    if (userCount < 5000 && siteCount <= 20) return 'Enterprise';
    return 'Global';
  };

  const createProjectFromScoping = async (sessionData: any) => {
    try {
      const formData = sessionData.data;
      
      if (!formData.organization?.name) {
        toast({
          title: "Missing Information",
          description: "Organization name is required to create a project.",
          variant: "destructive",
        });
        return;
      }

      const projectData = {
        name: `${formData.organization.name} NAC Implementation`,
        description: `Comprehensive NAC deployment scoped through AI wizard`,
        client_name: formData.organization.name,
        industry: formData.organization.industry || 'Technology',
        deployment_type: getDeploymentTypeFromOrganization(formData.organization),
        security_level: 'enhanced',
        total_sites: formData.network_infrastructure?.site_count || 1,
        total_endpoints: (formData.organization?.total_users || 0) + 
          Object.values(formData.network_infrastructure?.device_inventory || {}).reduce((sum: number, count: any) => {
            return sum + (typeof count === 'number' ? count : 0);
          }, 0),
        compliance_frameworks: formData.integration_compliance?.compliance_frameworks || [],
        pain_points: [
          ...(formData.organization?.pain_points || []),
          ...(formData.organization?.custom_pain_points?.map((p: any) => ({ title: p.title, description: p.description })) || [])
        ],
        success_criteria: formData.use_cases_requirements?.success_criteria || [],
        integration_requirements: formData.integration_compliance?.required_integrations || [],
        status: 'scoping' as const,
        current_phase: 'scoping' as const,
        progress_percentage: 25,
        business_summary: `Comprehensive Portnox NAC deployment for ${formData.organization.name} in the ${formData.organization.industry || 'Technology'} industry.`,
        additional_stakeholders: [],
        bulk_sites_data: [],
        migration_scope: {
          aiRecommendations: formData.templates_ai?.ai_recommendations || {},
          scopingData: formData
        }
      };

      createProject.mutate(projectData, {
        onSuccess: (project) => {
          toast({
            title: "Project Created Successfully",
            description: `Project "${project.name}" has been created from your scoping session.`,
          });
          
          navigate(`/projects/${project.id}`);
        },
        onError: (error) => {
          console.error("Project creation failed:", error);
          toast({
            title: "Failed to Create Project",
            description: error.message || "An unexpected error occurred while creating the project.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error preparing project data:", error);
      toast({
        title: "Error",
        description: "Failed to prepare project data. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  const creationMethods = [
    {
      id: 'ai-scoping',
      title: 'AI-Assisted Scoping',
      description: 'Start with intelligent questionnaire and AI recommendations',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      action: 'ultimate-scoping'
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
                    if ('path' in method && method.path) {
                      navigate(method.path);
                    } else if ('action' in method && method.action === 'ultimate-scoping') {
                      setActiveWizard('ultimate-scoping');
                    } else {
                      setActiveWizard('creation');
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

          {/* Ultimate AI Scoping Wizard */}
          {activeWizard === 'ultimate-scoping' && (
            <Card>
              <CardHeader>
                <CardTitle>Ultimate AI Scoping Wizard</CardTitle>
                <CardDescription>
                  Comprehensive scoping with AI-driven insights and vendor selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UltimateAIScopingWizard 
                  onComplete={(sessionId, scopingData) => {
                    // Convert scoping data to project format and create project
                    createProjectFromScoping({
                      id: sessionId,
                      name: scopingData.session_name,
                      date: scopingData.created_at,
                      data: scopingData
                    });
                  }}
                  onSave={(sessionId, scopingData) => {
                    // Save session to localStorage
                    const sessions = JSON.parse(localStorage.getItem('scopingSessions') || '[]');
                    const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId);
                    const sessionData = {
                      id: sessionId,
                      name: scopingData.session_name,
                      date: scopingData.last_modified,
                      data: scopingData
                    };
                    
                    if (sessionIndex >= 0) {
                      sessions[sessionIndex] = sessionData;
                    } else {
                      sessions.push(sessionData);
                    }
                    
                    localStorage.setItem('scopingSessions', JSON.stringify(sessions));
                    setSavedSessions(sessions);
                    
                    toast({
                      title: "Session Saved",
                      description: "Your scoping session has been saved successfully.",
                    });
                  }}
                  onCancel={() => setActiveWizard('none')}
                />
              </CardContent>
            </Card>
          )}

          {/* Project Creation Wizard */}
          {activeWizard === 'creation' && wizardStep > 0 && (
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

          {/* Saved Scoping Sessions */}
          {activeWizard === 'none' && savedSessions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Saved Scoping Sessions</CardTitle>
                <CardDescription>
                  Create projects from your previously saved scoping sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedSessions.slice(0, 6).map((session) => (
                    <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">{session.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                            {session.data.organization && (
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {session.data.organization.industry || 'Technology'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {session.data.network_infrastructure?.site_count || 1} sites
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => createProjectFromScoping(session)}
                            disabled={createProject.isPending}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {createProject.isPending ? 'Creating...' : 'Create Project'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {savedSessions.length > 6 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => navigate('/scoping')}>
                      View All Sessions ({savedSessions.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Start Templates */}
          {activeWizard === 'none' && (
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