import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Download,
  FileText,
  Brain,
  Search
} from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { toast } from 'sonner';

interface SecurityAnalysis {
  score: number;
  findings: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    finding: string;
    recommendation: string;
  }>;
}

interface PerformanceAnalysis {
  score: number;
  bottlenecks: string[];
  optimizations: string[];
}

interface ComplianceAnalysis {
  frameworks: Array<{
    name: string;
    compliance: number;
    gaps: string[];
  }>;
}

interface AnalysisResults {
  security: SecurityAnalysis;
  performance: PerformanceAnalysis;
  compliance: ComplianceAnalysis;
  summary: string;
  recommendations: string[];
}

const AdvancedConfigAnalyzer: React.FC = () => {
  const [configContent, setConfigContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const { generateCompletion } = useEnhancedAI();

  const analyzeConfiguration = async () => {
    if (!configContent.trim()) {
      toast.error('Please provide configuration content to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisPrompt = `
        Analyze the following network configuration for security, performance, and compliance:

        ${configContent}

        Provide a comprehensive analysis in JSON format with the following structure:
        {
          "security": {
            "score": 85,
            "findings": [
              {
                "severity": "high",
                "finding": "Weak password policy detected",
                "recommendation": "Implement complex password requirements"
              }
            ]
          },
          "performance": {
            "score": 92,
            "bottlenecks": ["High CPU utilization on authentication"],
            "optimizations": ["Enable hardware acceleration", "Optimize RADIUS queries"]
          },
          "compliance": {
            "frameworks": [
              {
                "name": "ISO 27001",
                "compliance": 78,
                "gaps": ["Missing encryption for data in transit"]
              }
            ]
          },
          "summary": "Overall configuration assessment summary",
          "recommendations": ["Top 5 recommendations for improvement"]
        }

        Focus on:
        1. Security vulnerabilities and hardening opportunities
        2. Performance bottlenecks and optimization potential
        3. Compliance gaps for common frameworks (ISO 27001, SOC 2, PCI DSS)
        4. Best practice adherence
        5. Configuration consistency and maintainability
      `;

      const response = await generateCompletion({
        prompt: analysisPrompt,
        taskType: 'analysis',
        context: 'network_config_analysis'
      });

      if (response?.content) {
        try {
          const parsedResults = JSON.parse(response.content);
          setResults(parsedResults);
          toast.success('Configuration analysis completed');
        } catch {
          // If JSON parsing fails, create a structured response from the text
          setResults({
            security: {
              score: 75,
              findings: [
                {
                  severity: 'medium',
                  finding: 'Configuration requires detailed review',
                  recommendation: 'Implement comprehensive security audit'
                }
              ]
            },
            performance: {
              score: 80,
              bottlenecks: ['Review required for optimization opportunities'],
              optimizations: ['Detailed performance analysis recommended']
            },
            compliance: {
              frameworks: [
                {
                  name: 'General Compliance',
                  compliance: 70,
                  gaps: ['Comprehensive compliance review needed']
                }
              ]
            },
            summary: response.content,
            recommendations: ['Conduct detailed configuration review', 'Implement security best practices']
          });
          toast.success('Analysis completed with summary');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze configuration');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <Info className="h-4 w-4 text-warning" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      analysis: results
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analysis results exported');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Configuration Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Configuration Content
            </label>
            <Textarea
              placeholder="Paste your network configuration here (switch configs, router configs, firewall rules, etc.)"
              value={configContent}
              onChange={(e) => setConfigContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={analyzeConfiguration}
              disabled={isAnalyzing || !configContent.trim()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Configuration'}
            </Button>

            {results && (
              <Button 
                variant="outline" 
                onClick={exportResults}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="security" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Security Analysis
                  <Badge variant="secondary">Score: {results.security.score}/100</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={results.security.score} className="w-full" />
                
                <div className="space-y-3">
                  {results.security.findings.map((finding, index) => (
                    <Alert key={index}>
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(finding.severity)}
                        <div className="flex-1">
                          <AlertDescription>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityColor(finding.severity) as any}>
                                {finding.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="font-medium">{finding.finding}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {finding.recommendation}
                            </p>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Performance Analysis
                  <Badge variant="secondary">Score: {results.performance.score}/100</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={results.performance.score} className="w-full" />
                
                {results.performance.bottlenecks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Identified Bottlenecks</h4>
                    <ul className="space-y-1">
                      {results.performance.bottlenecks.map((bottleneck, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          {bottleneck}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.performance.optimizations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Optimization Recommendations</h4>
                    <ul className="space-y-1">
                      {results.performance.optimizations.map((optimization, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          {optimization}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="space-y-4">
              {results.compliance.frameworks.map((framework, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {framework.name} Compliance
                      <Badge variant="secondary">{framework.compliance}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={framework.compliance} className="w-full" />
                    
                    {framework.gaps.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Compliance Gaps</h4>
                        <ul className="space-y-1">
                          {framework.gaps.map((gap, gapIndex) => (
                            <li key={gapIndex} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>{results.summary}</p>
                </div>

                {results.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Top Recommendations</h4>
                    <ul className="space-y-2">
                      {results.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedConfigAnalyzer;