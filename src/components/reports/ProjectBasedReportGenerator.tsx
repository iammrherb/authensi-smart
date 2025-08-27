import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, Download, Eye, Settings, Zap, CheckCircle, AlertTriangle,
  Shield, Network, Server, Users, Building2, Clock, Star, Lightbulb,
  Target, Workflow, BookOpen, Search, FolderOpen, Tag, Globe
} from 'lucide-react';

import { useEnterpriseReports } from '@/hooks/useEnterpriseReports';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  client_name: string;
  industry: string;
  status: string;
  created_at: string;
  scoping_data?: any;
}

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: any;
  requiresProject: boolean;
  estimatedTime: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

const ProjectBasedReportGenerator: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const { toast } = useToast();
  const { generateReport } = useEnterpriseReports();
  const { data: projects = [] } = useProjects();

  const reportTypes: ReportType[] = [
    {
      id: 'prerequisites',
      title: 'Prerequisites Analysis',
      description: 'Comprehensive hardware, software, network requirements',
      icon: Shield,
      requiresProject: true,
      estimatedTime: '3-5 minutes',
      complexity: 'intermediate'
    },
    {
      id: 'deployment_checklist',
      title: 'Deployment Checklist',
      description: 'Step-by-step deployment validation procedures',
      icon: CheckCircle,
      requiresProject: true,
      estimatedTime: '2-3 minutes',
      complexity: 'basic'
    },
    {
      id: 'firewall_requirements',
      title: 'Firewall Requirements',
      description: 'Detailed port and protocol specifications',
      icon: Network,
      requiresProject: true,
      estimatedTime: '4-6 minutes',
      complexity: 'advanced'
    },
    {
      id: 'technical_specifications',
      title: 'Technical Specifications',
      description: 'Complete architecture and integration details',
      icon: Server,
      requiresProject: true,
      estimatedTime: '5-8 minutes',
      complexity: 'advanced'
    },
    {
      id: 'project_summary',
      title: 'Project Summary',
      description: 'Executive-level project overview and metrics',
      icon: Building2,
      requiresProject: true,
      estimatedTime: '1-2 minutes',
      complexity: 'basic'
    },
    {
      id: 'vendor_comparison',
      title: 'Vendor Comparison',
      description: 'Comprehensive vendor analysis and recommendations',
      icon: Target,
      requiresProject: false,
      estimatedTime: '6-10 minutes',
      complexity: 'advanced'
    }
  ];

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const selectedReportConfig = reportTypes.find(r => r.id === selectedReportType);

  const canGenerateReport = () => {
    if (!selectedReportType) return false;
    if (selectedReportConfig?.requiresProject && !selectedProject) return false;
    return true;
  };

  const handleGenerateReport = async () => {
    if (!canGenerateReport()) {
      toast({
        title: "Missing Requirements",
        description: selectedReportConfig?.requiresProject 
          ? "Please select a project to generate this report." 
          : "Please select a report type.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Initializing report generation...');

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, step: 'Analyzing project data...' },
        { progress: 25, step: 'Gathering Portnox documentation...' },
        { progress: 40, step: 'Crawling vendor resources...' },
        { progress: 55, step: 'Extracting requirements...' },
        { progress: 70, step: 'Generating report content...' },
        { progress: 85, step: 'Formatting and organizing...' },
        { progress: 95, step: 'Finalizing report...' },
        { progress: 100, step: 'Report generation complete!' }
      ];

      // Update progress periodically
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGenerationProgress(step.progress);
        setCurrentStep(step.step);
      }

      const request = {
        projectId: selectedProject || undefined,
        reportType: selectedReportType as any,
        scopingData: selectedProjectData?.scoping_data,
        includeFirewallRequirements: true,
        includeVendorDocumentation: true,
        includePrerequisites: true,
        includeChecklists: true
      };

      const report = await generateReport(request);

      setCurrentStep('Report generated successfully!');
      
      toast({
        title: "Report Generated",
        description: `${selectedReportConfig?.title} has been generated successfully.`,
      });

    } catch (error: any) {
      setCurrentStep('Report generation failed');
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project-Based Report Generator</h1>
            <p className="text-muted-foreground">Generate comprehensive reports based on project context and scoping data</p>
          </div>
        </div>
        <Separator />
      </div>

      {/* Project Selection */}
      {selectedReportConfig?.requiresProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Project Context</span>
            </CardTitle>
            <CardDescription>Select a project to generate context-aware reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProjectData ? (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">{selectedProjectData.name}</h3>
                    <p className="text-sm text-green-600">{selectedProjectData.client_name} • {selectedProjectData.industry}</p>
                    <p className="text-xs text-green-500">Created: {new Date(selectedProjectData.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {selectedProjectData.status}
                  </Badge>
                </div>
                {selectedProjectData.scoping_data && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-sm text-green-600">
                      <Workflow className="h-4 w-4 inline mr-1" />
                      Scoping data available for enhanced report generation
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-muted-foreground mb-2">No Project Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a project to generate context-aware reports with scoping data integration.
                </p>
                <Button onClick={() => setShowProjectSelector(true)}>
                  <Search className="h-4 w-4 mr-2" />
                  Select Project
                </Button>
              </div>
            )}
            
            {selectedProject && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProjectSelector(true)}
                >
                  Change Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject('')}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Report Types</span>
          </CardTitle>
          <CardDescription>Choose the type of report to generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((reportType) => (
              <Card 
                key={reportType.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedReportType === reportType.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedReportType(reportType.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <reportType.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reportType.title}</CardTitle>
                        <CardDescription className="text-sm">{reportType.description}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getComplexityColor(reportType.complexity)}
                    >
                      {reportType.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <span className="font-medium">{reportType.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Project Required:</span>
                      <span className={reportType.requiresProject ? 'text-green-600' : 'text-muted-foreground'}>
                        {reportType.requiresProject ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Generating Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={generationProgress} className="w-full" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">{currentStep}</span>
            </div>
            <p className="text-xs text-muted-foreground">{generationProgress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateReport}
          disabled={!canGenerateReport() || isGenerating}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {/* Requirements Alert */}
      {!canGenerateReport() && selectedReportType && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {selectedReportConfig?.requiresProject 
              ? `"${selectedReportConfig.title}" requires a project to be selected. Please choose a project above.`
              : "Please select a report type to proceed."
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Project Selector Dialog */}
      <Dialog open={showProjectSelector} onOpenChange={setShowProjectSelector}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Project</DialogTitle>
            <DialogDescription>
              Choose a project to generate context-aware reports with integrated scoping data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-search">Search Projects</Label>
              <Input 
                id="project-search"
                placeholder="Search by project name, client, or industry..."
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    selectedProject === project.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => {
                    setSelectedProject(project.id);
                    setShowProjectSelector(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.client_name} • {project.industry}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  {project.scoping_data && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Workflow className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">Scoping data available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectBasedReportGenerator;
