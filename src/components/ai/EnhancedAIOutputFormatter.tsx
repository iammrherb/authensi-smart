import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalMarkdown } from '@/components/ui/professional-markdown';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Target, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Brain,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAnalysisOutput {
  type: 'compliance' | 'security' | 'architecture' | 'report' | 'recommendations';
  title: string;
  executiveSummary: string;
  mainContent: string;
  actionItems: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    timeline?: string;
  }>;
  riskAssessment?: {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    factors: string[];
    mitigation: string[];
  };
  complianceScore?: number;
  metadata: {
    generatedAt: Date;
    aiModel: string;
    confidence: number;
    prdVersion: string;
  };
}

interface EnhancedAIOutputFormatterProps {
  output: AIAnalysisOutput;
  className?: string;
}

export const EnhancedAIOutputFormatter: React.FC<EnhancedAIOutputFormatterProps> = ({
  output,
  className
}) => {
  const getTypeIcon = () => {
    switch (output.type) {
      case 'compliance': return <Shield className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'architecture': return <Network className="h-5 w-5" />;
      case 'report': return <FileText className="h-5 w-5" />;
      case 'recommendations': return <Brain className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (output.type) {
      case 'compliance': return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'security': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'architecture': return 'border-purple-500 bg-purple-50 dark:bg-purple-950/20';
      case 'report': return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      case 'recommendations': return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default: return 'border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 dark:text-red-400';
      case 'HIGH': return 'text-red-500 dark:text-red-400';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatContent = (): string => {
    let formattedContent = `# ${output.title}\n\n`;
    
    // Add executive summary
    formattedContent += `## Executive Summary\n${output.executiveSummary}\n\n`;
    
    // Add main content
    formattedContent += `${output.mainContent}\n\n`;
    
    // Add action items
    if (output.actionItems.length > 0) {
      formattedContent += `## Action Items\n\n`;
      output.actionItems.forEach((item, index) => {
        formattedContent += `### [${item.priority}] Action Item ${index + 1}\n`;
        formattedContent += `${item.description}\n`;
        if (item.timeline) {
          formattedContent += `**Timeline:** ${item.timeline}\n`;
        }
        formattedContent += '\n';
      });
    }

    // Add risk assessment
    if (output.riskAssessment) {
      formattedContent += `## Risk Assessment\n\n`;
      formattedContent += `**Risk Level:** ${output.riskAssessment.level}\n\n`;
      
      if (output.riskAssessment.factors.length > 0) {
        formattedContent += `### Risk Factors\n`;
        output.riskAssessment.factors.forEach(factor => {
          formattedContent += `- ${factor}\n`;
        });
        formattedContent += '\n';
      }
      
      if (output.riskAssessment.mitigation.length > 0) {
        formattedContent += `### Mitigation Strategies\n`;
        output.riskAssessment.mitigation.forEach(strategy => {
          formattedContent += `- ${strategy}\n`;
        });
        formattedContent += '\n';
      }
    }

    return formattedContent;
  };

  return (
    <Card className={cn("overflow-hidden", getTypeColor(), className)}>
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              {getTypeIcon()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-primary mb-2">
                {output.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Brain className="h-4 w-4" />
                  <span>{output.metadata.aiModel}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{output.metadata.generatedAt.toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  PRD {output.metadata.prdVersion}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {output.complianceScore !== undefined && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Compliance Score</div>
                <div className="text-lg font-bold text-primary">
                  {output.complianceScore}%
                </div>
                <Progress 
                  value={output.complianceScore} 
                  className="w-16 h-2"
                />
              </div>
            )}
            
            {output.riskAssessment && (
              <Badge 
                variant="outline" 
                className={cn("font-medium", getRiskColor(output.riskAssessment.level))}
              >
                {output.riskAssessment.level} Risk
              </Badge>
            )}
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>{output.metadata.confidence}% Confidence</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0">
        <ProfessionalMarkdown
          content={formatContent()}
          documentType={output.type === 'report' ? 'report' : 'analysis'}
          enableCopy={true}
          enableDownload={true}
          metadata={{
            title: output.title,
            author: `AI Assistant (${output.metadata.aiModel})`,
            date: output.metadata.generatedAt.toISOString().split('T')[0],
            version: output.metadata.prdVersion,
            status: 'Generated',
            priority: output.riskAssessment?.level.toLowerCase() || 'medium'
          }}
        />
      </CardContent>

      {/* Action Items Summary */}
      {output.actionItems.length > 0 && (
        <CardContent className="pt-0 pb-6">
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center text-sm">
              <Target className="h-4 w-4 mr-2" />
              Quick Action Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {output.actionItems.filter(item => item.priority === 'HIGH').length}
                </div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {output.actionItems.filter(item => item.priority === 'MEDIUM').length}
                </div>
                <div className="text-xs text-muted-foreground">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {output.actionItems.filter(item => item.priority === 'LOW').length}
                </div>
                <div className="text-xs text-muted-foreground">Low Priority</div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedAIOutputFormatter;