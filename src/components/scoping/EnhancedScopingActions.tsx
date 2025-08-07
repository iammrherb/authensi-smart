import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save, FileText, Download, CheckCircle, AlertTriangle, 
  Plus, X, Wand2, Brain, Target, Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateProject } from '@/hooks/useProjects';
import { useScopingManagement } from '@/hooks/useScopingManagement';

interface ScopingActionsProps {
  formData: any;
  onProjectCreated?: (projectId: string) => void;
}

const EnhancedScopingActions: React.FC<ScopingActionsProps> = ({ 
  formData, 
  onProjectCreated 
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const { toast } = useToast();
  const createProject = useCreateProject();
  const { createSession, completeSession } = useScopingManagement();

  const saveScopingSession = () => {
    const sessionId = createSession({
      name: sessionName || `${formData.organization?.name || 'Unnamed'} Scoping Session`,
      organizationName: formData.organization?.name || 'Unknown Organization',
      industry: formData.organization?.industry || 'Unknown',
      status: 'draft',
      data: { ...formData, _notes: sessionNotes }
    });

    toast({
      title: "Scoping Session Saved",
      description: "Your scoping data has been saved locally for future reference.",
    });

    setShowSaveDialog(false);
    setSessionName('');
    setSessionNotes('');

    return sessionId;
  };

  const handleCreateProject = async () => {
    try {
      if (!formData.organization?.name) {
        toast({
          title: "Missing Information",
          description: "Please provide organization name before creating a project.",
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
        security_level: 'Advanced',
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
        business_summary: generateBusinessSummary(),
        additional_stakeholders: [],
        bulk_sites_data: [],
        migration_scope: {
          aiRecommendations: formData.templates_ai?.ai_recommendations || {},
          scopingData: formData
        }
      };

      createProject.mutate(projectData, {
        onSuccess: (project) => {
          // Create a session from this scoping and mark it completed with project reference
          const newSessionId = createSession({
            name: `${formData.organization?.name || 'Organization'} Scoping Session`,
            organizationName: formData.organization?.name || 'Unknown Organization',
            industry: formData.organization?.industry || 'Unknown',
            status: 'draft',
            data: formData
          });
          completeSession(newSessionId, project.id);
          
          toast({
            title: "Project Created Successfully",
            description: `Project "${project.name}" has been created from your scoping session.`,
          });
          
          onProjectCreated?.(project.id);
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


  const getDeploymentTypeFromOrganization = (organization: any): string => {
    const userCount = organization?.total_users || 0;
    const siteCount = organization?.site_count || 1;
    
    // Determine deployment type based on organization size
    if (userCount < 100 && siteCount <= 1) return 'SMB';
    if (userCount < 1000 && siteCount <= 5) return 'Mid-Market';
    if (userCount < 5000 && siteCount <= 20) return 'Enterprise';
    return 'Global';
  };

  const generateBusinessSummary = (): string => {
    const org = formData.organization || {};
    const network = formData.network_infrastructure || {};
    const compliance = formData.integration_compliance || {};
    const ai = formData.templates_ai?.ai_recommendations || {};

    return `Comprehensive Portnox NAC deployment for ${org.name || 'Organization'} in the ${org.industry || 'Technology'} industry.

Project scope includes ${network.site_count || 1} sites with ${org.total_users || 0} users.
Compliance requirements: ${compliance.compliance_frameworks?.join(', ') || 'Standard'}.
Key pain points addressed: ${org.pain_points?.length || 0} identified issues.
AI-recommended timeline: ${ai.estimated_timeline_weeks || 12} weeks.
Complexity score: ${ai.complexity_score || 5}/10.`;
  };

  const exportScopingReport = () => {
    try {
      const reportData = {
        title: `NAC Scoping Report - ${formData.organization?.name || 'Organization'}`,
        generatedDate: new Date().toISOString(),
        organizationProfile: formData.organization,
        networkInfrastructure: formData.network_infrastructure,
        integrationCompliance: formData.integration_compliance,
        authenticationSecurity: formData.authentication_security,
        useCasesRequirements: formData.use_cases_requirements,
        aiRecommendations: formData.templates_ai?.ai_recommendations,
        summary: generateBusinessSummary()
      };

      // Create proper PDF-style text report
      const reportText = `
NAC SCOPING REPORT
${reportData.title}
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${reportData.summary}

ORGANIZATION PROFILE
Company Name: ${formData.organization?.name || 'Not specified'}
Industry: ${formData.organization?.industry || 'Not specified'}
Size: ${formData.organization?.size || 'Not specified'}
Locations: ${formData.organization?.locations || 'Not specified'}
Total Users: ${formData.organization?.total_users || 'Not specified'}

NETWORK INFRASTRUCTURE
Site Count: ${formData.network_infrastructure?.site_count || 'Not specified'}
Network Complexity: ${formData.network_infrastructure?.network_complexity || 'Not specified'}
Topology Type: ${formData.network_infrastructure?.topology_type || 'Not specified'}

COMPLIANCE & INTEGRATION
Compliance Frameworks: ${formData.integration_compliance?.compliance_frameworks?.join(', ') || 'None specified'}
Current NAC Vendor: ${formData.integration_compliance?.current_nac_vendor || 'None'}
Current RADIUS Vendor: ${formData.integration_compliance?.current_radius_vendor || 'None'}

PAIN POINTS
${formData.organization?.pain_points?.map((pp: string, idx: number) => `${idx + 1}. ${pp}`).join('\n') || 'None specified'}

AI RECOMMENDATIONS
Deployment Approach: ${formData.templates_ai?.ai_recommendations?.deployment_approach || 'Not generated'}
Estimated Timeline: ${formData.templates_ai?.ai_recommendations?.estimated_timeline_weeks || 'TBD'} weeks
Complexity Score: ${formData.templates_ai?.ai_recommendations?.complexity_score || 'TBD'}/10
`;

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NAC_Scoping_Report_${formData.organization?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Report'}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "Scoping report has been downloaded as a text file.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Unable to generate scoping report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Scoping Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Save Scoping Session */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Scoping Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Scoping Session</DialogTitle>
                <DialogDescription>
                  Save your current scoping progress for future reference.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder={`${formData.organization?.name || 'Unnamed'} Scoping Session`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session-notes">Notes (Optional)</Label>
                  <Textarea
                    id="session-notes"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Add any additional notes about this scoping session..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveScopingSession}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Export Report */}
          <Button variant="outline" onClick={exportScopingReport} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Generate Scoping Report
          </Button>

          {/* Create Project */}
          <Button 
            onClick={handleCreateProject} 
            className="w-full"
            disabled={createProject.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {createProject.isPending ? 'Creating Project...' : 'Create Project'}
          </Button>

          {/* Summary */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Summary:</strong> {formData.organization?.name || 'Organization'} - 
              {formData.network_infrastructure?.site_count || 1} sites, 
              {formData.organization?.total_users || 0} users, 
              {formData.integration_compliance?.compliance_frameworks?.length || 0} compliance frameworks
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedScopingActions;