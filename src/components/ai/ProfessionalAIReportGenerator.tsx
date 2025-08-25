import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProfessionalMarkdown } from '@/components/ui/professional-markdown';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { 
  FileText, 
  Download, 
  Brain, 
  Shield, 
  Network, 
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportConfig {
  type: 'compliance' | 'security' | 'architecture' | 'implementation' | 'risk-assessment';
  scope: 'project' | 'site' | 'organization' | 'technology';
  detail: 'executive' | 'technical' | 'comprehensive';
  format: 'report' | 'checklist' | 'plan' | 'analysis';
}

interface ProfessionalAIReportGeneratorProps {
  projectId?: string;
  siteId?: string;
  context?: Record<string, any>;
  className?: string;
}

export const ProfessionalAIReportGenerator: React.FC<ProfessionalAIReportGeneratorProps> = ({
  projectId,
  siteId,
  context = {},
  className
}) => {
  const { generateCompletion, isLoading } = useEnhancedAI();
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'compliance',
    scope: 'project',
    detail: 'comprehensive',
    format: 'report'
  });
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const reportTypes = {
    compliance: {
      name: 'Compliance Assessment',
      icon: Shield,
      description: 'PRD v2.1 compliance analysis with gap assessment',
      color: 'text-blue-600'
    },
    security: {
      name: 'Security Analysis',
      icon: Shield,
      description: 'Comprehensive security posture evaluation',
      color: 'text-red-600'
    },
    architecture: {
      name: 'Architecture Review',
      icon: Network,
      description: 'Technical architecture assessment and optimization',
      color: 'text-purple-600'
    },
    implementation: {
      name: 'Implementation Report',
      icon: Target,
      description: 'Project status and implementation progress',
      color: 'text-green-600'
    },
    'risk-assessment': {
      name: 'Risk Assessment',
      icon: AlertTriangle,
      description: 'Risk analysis with mitigation strategies',
      color: 'text-orange-600'
    }
  };

  const generateReport = async () => {
    setGenerationProgress(0);
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const prompt = buildReportPrompt();
      
      const response = await generateCompletion({
        prompt,
        taskType: 'analysis',
        context: JSON.stringify({
          projectId,
          siteId,
          reportConfig,
          additionalContext: context
        }),
        temperature: 0.3,
        maxTokens: 4000
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response?.content) {
        setGeneratedReport(response.content);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setGenerationProgress(0);
      console.error('Report generation failed:', error);
      
      setGeneratedReport(`# Report Generation Error

## Executive Summary
Unable to generate the requested ${reportTypes[reportConfig.type].name}. Please check your AI configuration and try again.

## Error Details
- **Error Type**: AI Service Unavailable
- **Timestamp**: ${new Date().toISOString()}
- **Report Configuration**: ${JSON.stringify(reportConfig, null, 2)}

## Recommended Actions
1. [HIGH] Verify AI provider configuration in Settings
2. [MEDIUM] Check network connectivity
3. [LOW] Try generating a simpler report first

## Next Steps
Contact support if this issue persists.`);
    }
  };

  const buildReportPrompt = (): string => {
    const basePrompt = `
# Professional NAC Report Generation Request

## Report Specifications
- **Type**: ${reportConfig.type}
- **Scope**: ${reportConfig.scope}
- **Detail Level**: ${reportConfig.detail}
- **Format**: ${reportConfig.format}
- **Context**: ${projectId ? `Project ${projectId}` : 'General'}${siteId ? `, Site ${siteId}` : ''}

## PRD v2.1 Compliance Requirements
Follow the NAC Solution Platform Product Requirements Document v2.1 standards for:
- Enterprise-grade reporting formats
- Professional presentation standards
- Technical accuracy and depth
- Compliance framework alignment
- Risk assessment methodologies

## Required Report Structure
1. **Executive Summary**
   - High-level overview for stakeholders
   - Key findings and recommendations
   - Business impact assessment

2. **Detailed Analysis**
   - Technical specifications and findings
   - Methodology and assessment criteria
   - Data analysis and evidence

3. **Risk Assessment**
   - Risk identification and classification
   - Impact and probability analysis
   - Mitigation strategies and recommendations

4. **Action Items**
   - Prioritized recommendations [HIGH], [MEDIUM], [LOW]
   - Implementation timelines
   - Resource requirements
   - Success criteria

5. **Compliance Framework**
   - Regulatory alignment (SOX, HIPAA, PCI-DSS, NIST)
   - Standards compliance status
   - Gap analysis and remediation

6. **Technical Specifications**
   - Architecture diagrams (if applicable)
   - Configuration requirements
   - Integration considerations
   - Performance metrics

## Formatting Requirements
- Use professional markdown formatting
- Include appropriate headers and sections
- Add priority indicators for action items
- Use code blocks for technical configurations
- Include risk indicators and compliance badges
- Add executive summary boxes
- Use collapsible sections for detailed technical content

## Context Data
${JSON.stringify(context, null, 2)}

Generate a comprehensive, enterprise-grade ${reportTypes[reportConfig.type].name} that meets PRD v2.1 standards.`;

    return basePrompt;
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    
    const blob = new Blob([generatedReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportConfig.type}-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Professional AI Report Generator</span>
            <Badge variant="outline" className="text-xs">PRD v2.1</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(reportTypes).map(([key, type]) => (
              <Card 
                key={key}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  reportConfig.type === key ? "ring-2 ring-primary" : ""
                )}
                onClick={() => setReportConfig(prev => ({ ...prev, type: key as any }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <type.icon className={cn("h-5 w-5", type.color)} />
                    <div>
                      <h3 className="font-semibold text-sm">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Scope</label>
              <Select 
                value={reportConfig.scope} 
                onValueChange={(value) => setReportConfig(prev => ({ ...prev, scope: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project-Level</SelectItem>
                  <SelectItem value="site">Site-Specific</SelectItem>
                  <SelectItem value="organization">Organization-Wide</SelectItem>
                  <SelectItem value="technology">Technology-Focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Detail Level</label>
              <Select 
                value={reportConfig.detail} 
                onValueChange={(value) => setReportConfig(prev => ({ ...prev, detail: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Focus</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <Select 
                value={reportConfig.format} 
                onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Professional Report</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="plan">Implementation Plan</SelectItem>
                  <SelectItem value="analysis">Technical Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generation Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              {projectId && (
                <Badge variant="secondary" className="text-xs">
                  Project: {projectId}
                </Badge>
              )}
              {siteId && (
                <Badge variant="secondary" className="text-xs">
                  Site: {siteId}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {generatedReport && (
                <EnhancedButton
                  variant="outline"
                  onClick={downloadReport}
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </EnhancedButton>
              )}
              
              <EnhancedButton
                onClick={generateReport}
                disabled={isLoading}
                gradient="primary"
                glow
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </EnhancedButton>
            </div>
          </div>

          {/* Progress Indicator */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating professional report...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{reportTypes[reportConfig.type].name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {reportConfig.detail} Level
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  AI Generated
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProfessionalMarkdown
              content={generatedReport}
              documentType={reportConfig.format as any}
              enableCopy={true}
              enableDownload={true}
              metadata={{
                title: reportTypes[reportConfig.type].name,
                author: 'AI Report Generator',
                date: new Date().toISOString().split('T')[0],
                version: '2.1',
                status: 'Generated'
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalAIReportGenerator;