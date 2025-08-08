import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportExporterProps {
  data?: any;
  type: 'scoping' | 'project' | 'site' | 'config';
  title: string;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ data, type, title }) => {
  const { toast } = useToast();

  const exportAsJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: "JSON report downloaded" });
  };

  const exportDetailedReport = async () => {
    if (!data) return;
    
    const sections = [];
    
    if (type === 'scoping') {
      sections.push(
        `# Scoping Report - ${title}`,
        `Generated: ${new Date().toLocaleString()}`,
        '',
        '## Organization',
        `Name: ${data.organization?.name || 'N/A'}`,
        `Industry: ${data.organization?.industry || 'N/A'}`,
        `Users: ${data.organization?.total_users || 'N/A'}`,
        '',
        '## Pain Points',
        ...(data.organization?.pain_points || []).map((p: any) => `- ${p.title || p}`),
        '',
        '## Infrastructure',
        `Sites: ${data.network_infrastructure?.site_count || 'N/A'}`,
        `Topology: ${data.network_infrastructure?.network_topology || 'N/A'}`,
        '',
        '## Vendor Ecosystem',
        ...Object.entries(data.vendor_ecosystem || {}).map(([k, v]: [string, any]) => 
          `${k}: ${Array.isArray(v) ? v.length : 0} items`
        ),
        '',
        '## Use Cases',
        ...(data.use_cases_requirements?.primary_use_cases || []).map((uc: any) => `- ${uc.name || uc}`),
        '',
        '## Compliance',
        ...(data.integration_compliance?.compliance_frameworks || []).map((cf: string) => `- ${cf}`),
        '',
        '## AI Recommendations',
        data.templates_ai?.ai_recommendations?.summary || 'No AI analysis completed'
      );
    }
    
    const content = sections.join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-detailed-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: "Detailed report downloaded" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAsJSON}>
            <Download className="h-4 w-4 mr-2" />
            JSON Data
          </Button>
          <Button variant="outline" size="sm" onClick={exportDetailedReport}>
            <FileText className="h-4 w-4 mr-2" />
            Detailed Report
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Export comprehensive reports for documentation and analysis
        </p>
      </CardContent>
    </Card>
  );
};

export default ReportExporter;