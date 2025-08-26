import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  FileText, Download, Eye, Settings, Zap, CheckCircle, AlertTriangle,
  Shield, Network, Server, Users, Building2, Clock, Star, Lightbulb,
  FileCheck, List, Globe, BarChart3, Target, Workflow, BookOpen
} from 'lucide-react';

import { useEnterpriseReports } from '@/hooks/useEnterpriseReports';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { EnterpriseReport, ReportGenerationRequest } from '@/services/reports/EnterpriseReportGenerator';

interface EnterpriseReportGeneratorProps {
  projectId?: string;
  scopingData?: any;
  onReportGenerated?: (report: EnterpriseReport) => void;
  onCancel?: () => void;
}

type ReportType = EnterpriseReport['type'];

const EnterpriseReportGenerator: React.FC<EnterpriseReportGeneratorProps> = ({
  projectId,
  scopingData,
  onReportGenerated,
  onCancel
}) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('prerequisites');
  const [reportOptions, setReportOptions] = useState({
    includeFirewallRequirements: true,
    includeVendorDocumentation: true,
    includePrerequisites: true,
    includeChecklists: true,
    customSections: [] as string[]
  });
  const [branding, setBranding] = useState({
    companyName: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B'
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const { toast } = useToast();
  const { generateReport } = useEnterpriseReports();
  const { data: projects = [] } = useProjects();

  const reportTypes = [
    {
      id: 'prerequisites' as ReportType,
      title: 'Prerequisites Report',
      description: 'Comprehensive prerequisites for NAC deployment including hardware, software, network, and security requirements',
      icon: FileCheck,
      color: 'bg-blue-500',
      estimatedTime: '5-8 minutes',
      complexity: 'Standard',
      features: [
        'Hardware specifications',
        'Software requirements',
        'Network prerequisites',
        'Security requirements',
        'Integration dependencies',
        'Firewall port requirements'
      ],
      recommended: true
    },
    {
      id: 'deployment_checklist' as ReportType,
      title: 'Deployment Checklist',
      description: 'Step-by-step deployment checklist with verification procedures and validation steps',
      icon: List,
      color: 'bg-green-500',
      estimatedTime: '6-10 minutes',
      complexity: 'Comprehensive',
      features: [
        'Pre-deployment checklist',
        'Installation verification',
        'Configuration validation',
        'Testing procedures',
        'Go-live checklist',
        'Rollback procedures'
      ],
      recommended: true
    },
    {
      id: 'firewall_requirements' as ReportType,
      title: 'Firewall Requirements',
      description: 'Detailed firewall port and protocol requirements for all NAC components and integrations',
      icon: Shield,
      color: 'bg-red-500',
      estimatedTime: '4-6 minutes',
      complexity: 'Technical',
      features: [
        'Core service ports',
        'Integration protocols',
        'Management access',
        'Site-to-site communication',
        'Sample configurations',
        'Security considerations'
      ],
      recommended: false
    },
    {
      id: 'technical_specifications' as ReportType,
      title: 'Technical Specifications',
      description: 'Complete technical specifications including architecture, performance, and integration details',
      icon: Server,
      color: 'bg-purple-500',
      estimatedTime: '8-12 minutes',
      complexity: 'Advanced',
      features: [
        'System architecture',
        'Performance specifications',
        'Integration architecture',
        'Scalability planning',
        'Disaster recovery',
        'Monitoring requirements'
      ],
      recommended: false
    },
    {
      id: 'project_summary' as ReportType,
      title: 'Project Summary',
      description: 'Executive project summary with scope, timeline, resources, and expected outcomes',
      icon: BarChart3,
      color: 'bg-orange-500',
      estimatedTime: '3-5 minutes',
      complexity: 'Executive',
      features: [
        'Executive summary',
        'Project scope',
        'Timeline overview',
        'Resource allocation',
        'Risk assessment',
        'Success metrics'
      ],
      recommended: false
    },
    {
      id: 'vendor_comparison' as ReportType,
      title: 'Vendor Comparison',
      description: 'Comprehensive vendor comparison and analysis for NAC solution selection',
      icon: Building2,
      color: 'bg-teal-500',
      estimatedTime: '10-15 minutes',
      complexity: 'Analysis',
      features: [
        'Vendor capabilities',
        'Feature comparison',
        'Cost analysis',
        'Integration assessment',
        'Support evaluation',
        'Recommendation matrix'
      ],
      recommended: false
    }
  ];

  const selectedReportConfig = reportTypes.find(type => type.id === selectedReportType);

  const handleGenerateReport = async () => {
    if (!projectId && !scopingData) {
      toast({
        title: "Missing Project Data",
        description: "Either project ID or scoping data must be provided.",
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
        { progress: 10, step: 'Analyzing scoping data...' },
        { progress: 25, step: 'Gathering Portnox documentation...' },
        { progress: 40, step: 'Crawling vendor resources...' },
        { progress: 55, step: 'Extracting firewall requirements...' },
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

      const request: ReportGenerationRequest = {
        projectId: projectId || 'temp-project',
        reportType: selectedReportType,
        scopingData,
        ...reportOptions,
        branding: branding.companyName ? branding : undefined
      };

      const report = await generateReport(request);

      setCurrentStep('Report generated successfully!');
      
      toast({
        title: "Report Generated",
        description: `${selectedReportConfig?.title} has been generated successfully.`,
      });

      if (onReportGenerated) {
        onReportGenerated(report);
      }

    } catch (error: any) {
      setCurrentStep('Report generation failed');
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  };

  const renderReportTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Enterprise Report Generator</h3>
        <p className="text-muted-foreground">Generate professional deployment documentation with AI-powered content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((reportType) => (
          <Card 
            key={reportType.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedReportType === reportType.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            } ${reportType.recommended ? 'ring-1 ring-primary/20' : ''}`}
            onClick={() => setSelectedReportType(reportType.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${reportType.color} text-white`}>
                  <reportType.icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {reportType.recommended && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {reportType.complexity}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{reportType.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{reportType.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Est. Time:</span>
                <span className="font-medium">{reportType.estimatedTime}</span>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm">Key Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {reportType.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {reportType.features.length > 4 && (
                    <li className="text-xs text-muted-foreground">
                      +{reportType.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {selectedReportType === reportType.id && (
                <div className="pt-2 border-t">
                  <Badge variant="secondary" className="w-full justify-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReportOptions = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <h3 className="text-2xl font-bold mb-2">Report Configuration</h3>
        <p className="text-muted-foreground">Customize your {selectedReportConfig?.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Options</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select which sections to include in your report
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="includeFirewall"
                checked={reportOptions.includeFirewallRequirements}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includeFirewallRequirements: !!checked }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="includeFirewall" className="cursor-pointer font-medium">
                  Firewall Requirements
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include detailed port and protocol requirements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="includeVendor"
                checked={reportOptions.includeVendorDocumentation}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includeVendorDocumentation: !!checked }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="includeVendor" className="cursor-pointer font-medium">
                  Vendor Documentation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Crawl and include vendor-specific documentation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="includePrereq"
                checked={reportOptions.includePrerequisites}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includePrerequisites: !!checked }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="includePrereq" className="cursor-pointer font-medium">
                  Prerequisites Analysis
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include comprehensive prerequisite analysis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="includeChecklists"
                checked={reportOptions.includeChecklists}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includeChecklists: !!checked }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="includeChecklists" className="cursor-pointer font-medium">
                  Deployment Checklists
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include step-by-step deployment checklists
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding & Customization</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the report appearance and branding
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={branding.companyName}
                onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={branding.colors.primary}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, primary: e.target.value } 
                  }))}
                  className="w-16 h-10"
                />
                <Input
                  value={branding.colors.primary}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, primary: e.target.value } 
                  }))}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGenerationProgress = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-500 animate-pulse" />
        <h3 className="text-2xl font-bold mb-2">Generating Report</h3>
        <p className="text-muted-foreground">
          Creating your {selectedReportConfig?.title}...
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-3" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Being Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedReportConfig?.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>AI-Powered Content:</strong> This report is being generated using advanced AI 
          and web crawling to gather the most current Portnox documentation and vendor-specific 
          requirements. The process includes firewall port analysis, prerequisite extraction, 
          and professional formatting.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Eye className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h3 className="text-2xl font-bold mb-2">Review Configuration</h3>
        <p className="text-muted-foreground">Confirm your report settings before generation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Report Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{selectedReportConfig?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <Badge variant="outline">{selectedReportConfig?.complexity}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Time:</span>
                  <span className="font-medium">{selectedReportConfig?.estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Content Options</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Firewall Requirements:</span>
                  <Badge variant={reportOptions.includeFirewallRequirements ? "default" : "secondary"}>
                    {reportOptions.includeFirewallRequirements ? "Included" : "Excluded"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vendor Documentation:</span>
                  <Badge variant={reportOptions.includeVendorDocumentation ? "default" : "secondary"}>
                    {reportOptions.includeVendorDocumentation ? "Included" : "Excluded"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prerequisites:</span>
                  <Badge variant={reportOptions.includePrerequisites ? "default" : "secondary"}>
                    {reportOptions.includePrerequisites ? "Included" : "Excluded"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Checklists:</span>
                  <Badge variant={reportOptions.includeChecklists ? "default" : "secondary"}>
                    {reportOptions.includeChecklists ? "Included" : "Excluded"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {branding.companyName && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Branding</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Company:</span>
                  <span className="text-sm font-medium">{branding.companyName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Primary Color:</span>
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: branding.colors.primary }}
                  />
                  <span className="text-sm font-mono">{branding.colors.primary}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Report generation will crawl live Portnox documentation and 
          vendor resources. This may take several minutes depending on the selected options 
          and current network conditions.
        </AlertDescription>
      </Alert>
    </div>
  );

  const [currentView, setCurrentView] = useState<'type' | 'options' | 'summary' | 'generating'>('type');

  const handleNext = () => {
    if (currentView === 'type') {
      setCurrentView('options');
    } else if (currentView === 'options') {
      setCurrentView('summary');
    } else if (currentView === 'summary') {
      setCurrentView('generating');
      handleGenerateReport();
    }
  };

  const handleBack = () => {
    if (currentView === 'options') {
      setCurrentView('type');
    } else if (currentView === 'summary') {
      setCurrentView('options');
    } else if (currentView === 'generating') {
      setCurrentView('summary');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'type':
        return renderReportTypeSelection();
      case 'options':
        return renderReportOptions();
      case 'summary':
        return renderSummary();
      case 'generating':
        return renderGenerationProgress();
      default:
        return renderReportTypeSelection();
    }
  };

  const canProceed = () => {
    switch (currentView) {
      case 'type':
        return !!selectedReportType;
      case 'options':
        return true;
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        {renderCurrentView()}
      </div>

      {currentView !== 'generating' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleBack}
                disabled={currentView === 'type'}
                variant="outline"
              >
                Back
              </Button>

              <div className="flex items-center space-x-2">
                {onCancel && (
                  <Button onClick={onCancel} variant="outline">
                    Cancel
                  </Button>
                )}
                
                <EnhancedButton
                  onClick={handleNext}
                  disabled={!canProceed() || isGenerating}
                  loading={isGenerating}
                  className="min-w-[120px]"
                >
                  {currentView === 'summary' ? 'Generate Report' : 'Next'}
                </EnhancedButton>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnterpriseReportGenerator;
