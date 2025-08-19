import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Mail, 
  Share2, 
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  format: 'pdf' | 'html' | 'excel' | 'json';
}

interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  executionTime: number;
  coverage: number;
  successRate: number;
}

const TestReportGenerator: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reportConfig, setReportConfig] = useState({
    title: "Portnox Deployment Test Report",
    includeMetrics: true,
    includeDetails: true,
    includeCharts: true,
    includeRecommendations: true,
    format: 'pdf' as 'pdf' | 'html' | 'excel' | 'json'
  });
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description: "High-level overview for stakeholders and management",
      sections: ["Executive Summary", "Key Metrics", "Risk Assessment", "Recommendations"],
      format: 'pdf'
    },
    {
      id: "technical-detailed",
      name: "Technical Detailed Report",
      description: "Comprehensive technical report for engineering teams",
      sections: [
        "Test Environment", "Test Results", "Failed Tests Analysis", 
        "Performance Metrics", "Security Validation", "Recommendations"
      ],
      format: 'pdf'
    },
    {
      id: "compliance-report",
      name: "Compliance Report",
      description: "Report focused on regulatory and compliance requirements",
      sections: [
        "Compliance Overview", "Security Controls", "Audit Trail", 
        "Risk Assessment", "Remediation Plan"
      ],
      format: 'pdf'
    },
    {
      id: "client-deliverable",
      name: "Client Deliverable",
      description: "Professional report for client delivery",
      sections: [
        "Project Overview", "Test Summary", "Quality Assurance", 
        "Deployment Readiness", "Support Information"
      ],
      format: 'pdf'
    }
  ];

  // Mock test metrics - in real implementation this would come from actual test results
  const testMetrics: TestMetrics = {
    totalTests: 87,
    passedTests: 79,
    failedTests: 5,
    skippedTests: 3,
    executionTime: 1847, // seconds
    coverage: 94.2,
    successRate: 90.8
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const reportData = {
        metadata: {
          title: reportConfig.title,
          generatedAt: new Date().toISOString(),
          environment: "Production",
          testSuite: "Portnox Deployment Validation"
        },
        metrics: testMetrics,
        sections: selectedTemplate ? 
          reportTemplates.find(t => t.id === selectedTemplate)?.sections : 
          customSections,
        testResults: {
          // This would contain actual test results
          apiConnectivity: { status: 'passed', duration: 245 },
          authentication: { status: 'passed', duration: 1200 },
          deviceManagement: { status: 'failed', duration: 850, error: 'Timeout' },
          policyEngine: { status: 'passed', duration: 640 }
        }
      };

      // Simulate file download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portnox-test-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated Successfully",
        description: `${reportConfig.format.toUpperCase()} report has been downloaded`,
      });

    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: error.message || "Failed to generate test report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareReport = async (method: 'email' | 'link') => {
    toast({
      title: `Sharing via ${method}`,
      description: `Report sharing via ${method} would be implemented here`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Report Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-sm text-muted-foreground">
                    {reportTemplates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Report Title</Label>
                <Input
                  value={reportConfig.title}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select 
                  value={reportConfig.format} 
                  onValueChange={(value: 'pdf' | 'html' | 'excel' | 'json') => 
                    setReportConfig(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="html">HTML Report</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Report Sections</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={reportConfig.includeMetrics}
                    onCheckedChange={(checked) => 
                      setReportConfig(prev => ({ ...prev, includeMetrics: checked as boolean }))}
                  />
                  <Label>Test Metrics & Statistics</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={reportConfig.includeDetails}
                    onCheckedChange={(checked) => 
                      setReportConfig(prev => ({ ...prev, includeDetails: checked as boolean }))}
                  />
                  <Label>Detailed Test Results</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={reportConfig.includeCharts}
                    onCheckedChange={(checked) => 
                      setReportConfig(prev => ({ ...prev, includeCharts: checked as boolean }))}
                  />
                  <Label>Charts & Visualizations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={reportConfig.includeRecommendations}
                    onCheckedChange={(checked) => 
                      setReportConfig(prev => ({ ...prev, includeRecommendations: checked as boolean }))}
                  />
                  <Label>Recommendations</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => shareReport('email')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </Button>
              <Button
                variant="outline"
                onClick={() => shareReport('link')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
            
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{testMetrics.totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{testMetrics.passedTests}</div>
            </div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="text-2xl font-bold text-red-500">{testMetrics.failedTests}</div>
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div className="text-2xl font-bold text-primary">{testMetrics.successRate}%</div>
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Test Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Weekly Validation Report",
                date: "2024-01-15",
                type: "Automated",
                status: "completed",
                format: "PDF"
              },
              {
                name: "Security Compliance Audit",
                date: "2024-01-12",
                type: "Manual",
                status: "completed",
                format: "Excel"
              },
              {
                name: "Performance Benchmark",
                date: "2024-01-10",
                type: "Automated",
                status: "completed",
                format: "HTML"
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.date} • {report.type} • {report.format}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={report.status === 'completed' ? 
                    'bg-green-500/10 text-green-500' : 
                    'bg-gray-500/10 text-gray-500'
                  }>
                    {report.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestReportGenerator;