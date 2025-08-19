import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Share2, Eye, Calendar as CalendarIcon, TrendingUp, BarChart3, PieChart, Users, Shield, Clock, Target, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'status' | 'progress' | 'risk' | 'budget' | 'timeline' | 'quality' | 'performance' | 'compliance' | 'stakeholder' | 'custom';
  sections: string[];
  defaultFormat: 'pdf' | 'html' | 'excel' | 'json' | 'csv';
  icon: React.ReactNode;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level project overview for stakeholders',
    type: 'status',
    sections: ['project_overview', 'key_metrics', 'milestones', 'risks', 'next_steps'],
    defaultFormat: 'pdf',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 'detailed-progress',
    name: 'Detailed Progress Report',
    description: 'Comprehensive project progress analysis',
    type: 'progress',
    sections: ['timeline', 'tasks', 'resources', 'budget', 'quality_metrics'],
    defaultFormat: 'pdf',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Report',
    description: 'Comprehensive risk analysis and mitigation strategies',
    type: 'risk',
    sections: ['risk_register', 'mitigation_plans', 'impact_analysis', 'contingency'],
    defaultFormat: 'pdf',
    icon: <AlertTriangle className="h-5 w-5" />
  },
  {
    id: 'financial-dashboard',
    name: 'Financial Dashboard',
    description: 'Budget tracking and financial performance',
    type: 'budget',
    sections: ['budget_overview', 'cost_breakdown', 'variance_analysis', 'forecasting'],
    defaultFormat: 'excel',
    icon: <PieChart className="h-5 w-5" />
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    description: 'Security and compliance assessment',
    type: 'compliance',
    sections: ['security_assessment', 'compliance_status', 'audit_findings', 'recommendations'],
    defaultFormat: 'pdf',
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'stakeholder-update',
    name: 'Stakeholder Update',
    description: 'Regular updates for project stakeholders',
    type: 'stakeholder',
    sections: ['achievements', 'challenges', 'upcoming_milestones', 'resource_needs'],
    defaultFormat: 'html',
    icon: <Users className="h-5 w-5" />
  }
];

interface AdvancedReportGeneratorProps {
  projectId?: string;
}

const AdvancedReportGenerator: React.FC<AdvancedReportGeneratorProps> = ({ projectId }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportName, setReportName] = useState('');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'html' | 'excel' | 'json' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [customFilters, setCustomFilters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [scheduleGeneration, setScheduleGeneration] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [reportDescription, setReportDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTemplate) {
      setSelectedSections(selectedTemplate.sections);
      setReportFormat(selectedTemplate.defaultFormat);
      setReportName(selectedTemplate.name);
      setReportDescription(selectedTemplate.description);
    }
  }, [selectedTemplate]);

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const generateReport = async () => {
    if (!selectedTemplate || !reportName) {
      toast({
        title: "Validation Error",
        description: "Please select a template and provide a report name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation progress
      const progressSteps = [
        { step: 'Collecting project data...', progress: 20 },
        { step: 'Processing analytics...', progress: 40 },
        { step: 'Generating visualizations...', progress: 60 },
        { step: 'Formatting report...', progress: 80 },
        { step: 'Finalizing document...', progress: 100 }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGenerationProgress(step.progress);
        toast({
          title: "Generating Report",
          description: step.step,
          duration: 1000
        });
      }

      // Save report to database (mock for now)
      const reportData = {
          project_id: projectId,
          report_name: reportName,
          report_type: selectedTemplate.type,
          report_format: reportFormat,
          report_data: {
            template_id: selectedTemplate.id,
            sections: selectedSections,
            filters: customFilters,
            date_range: dateRange,
            generation_settings: {
              auto_generated: false,
              scheduled_generation: scheduleGeneration,
              generation_frequency: frequency
            }
          },
          filters_applied: customFilters,
          date_range_start: dateRange.from,
          date_range_end: dateRange.to,
          auto_generated: false,
          scheduled_generation: scheduleGeneration,
          generation_frequency: scheduleGeneration ? frequency : null,
          recipients: recipients,
          status: 'generated'
        };

      // Mock successful generation

      toast({
        title: "Report Generated Successfully",
        description: `${reportName} has been generated and is ready for download`,
        variant: "default"
      });

      // Reset form
      setIsGenerating(false);
      setGenerationProgress(0);
      setSelectedTemplate(null);
      setReportName('');
      setSelectedSections([]);
      setRecipients([]);

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Advanced Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Select Report Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <>
              {/* Report Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Report Name</Label>
                    <Input
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Report description (optional)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Output Format</Label>
                    <Select value={reportFormat} onValueChange={(value: any) => setReportFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="html">HTML Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                        <SelectItem value="csv">CSV Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>Report Sections</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                      {selectedTemplate.sections.map((section) => (
                        <div key={section} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedSections.includes(section)}
                            onCheckedChange={() => handleSectionToggle(section)}
                          />
                          <Label className="text-sm capitalize">
                            {section.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipients and Scheduling */}
              <div className="space-y-4">
                <div>
                  <Label>Email Recipients</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder="Enter email address"
                      onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    />
                    <Button onClick={addRecipient} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((email) => (
                      <Badge key={email} variant="secondary" className="cursor-pointer">
                        {email}
                        <button
                          className="ml-2 text-xs"
                          onClick={() => removeRecipient(email)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={scheduleGeneration}
                    onCheckedChange={(checked) => setScheduleGeneration(checked === true)}
                  />
                  <Label>Schedule automatic generation</Label>
                </div>

                {scheduleGeneration && (
                  <div>
                    <Label>Generation Frequency</Label>
                    <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <Label>Generation Progress</Label>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {generationProgress}% complete
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={generateReport}
                  disabled={isGenerating || !reportName}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Template
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReportGenerator;