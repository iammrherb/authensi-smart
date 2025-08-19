import React from 'react';
import { cn } from '@/lib/utils';
import { Download, Copy, Check, FileText, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ProfessionalReportProps {
  content: string;
  title: string;
  subtitle?: string;
  generatedAt: string;
  analytics?: any;
  className?: string;
  enableExport?: boolean;
}

export const ProfessionalReport: React.FC<ProfessionalReportProps> = ({
  content,
  title,
  subtitle,
  generatedAt,
  analytics,
  className,
  enableExport = true
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 20px; 
              background: white;
            }
            h1 { 
              color: #2563eb; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 10px; 
              font-size: 28px;
              margin-bottom: 20px;
            }
            h2 { 
              color: #1e40af; 
              border-left: 4px solid #2563eb; 
              padding-left: 15px; 
              margin-top: 30px;
              font-size: 22px;
            }
            h3 { 
              color: #1e40af; 
              font-size: 18px;
              margin-top: 25px;
            }
            pre { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              border-left: 4px solid #2563eb; 
              overflow-x: auto;
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 12px;
            }
            code { 
              background: #e9ecef; 
              padding: 2px 6px; 
              border-radius: 4px;
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 13px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid #dee2e6; 
              padding: 12px; 
              text-align: left;
            }
            th { 
              background: #f8f9fa; 
              font-weight: 600;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #e9ecef; 
              padding-bottom: 20px;
            }
            .metadata { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 30px;
              font-size: 14px;
            }
            .page-break { 
              page-break-after: always; 
            }
            ul, ol { 
              margin: 15px 0; 
              padding-left: 30px;
            }
            li { 
              margin: 8px 0;
            }
            blockquote {
              border-left: 4px solid #2563eb;
              margin: 20px 0;
              padding: 10px 20px;
              background: #f8f9fa;
              font-style: italic;
            }
            @media print {
              body { margin: 0; padding: 15mm; font-size: 12px; }
              h1 { font-size: 24px; }
              h2 { font-size: 20px; }
              h3 { font-size: 16px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            ${subtitle ? `<p style="font-size: 18px; color: #6b7280; margin: 10px 0;">${subtitle}</p>` : ''}
          </div>
          <div class="metadata">
            <strong>Generated:</strong> ${new Date(generatedAt).toLocaleString()}<br>
            ${analytics ? `
              <strong>Report Scope:</strong> ${analytics.totalProjects} Projects, ${analytics.totalSites} Sites<br>
              <strong>Overall Progress:</strong> ${analytics.avgProgress}% Average Completion
            ` : ''}
          </div>
          ${processContentForPrint(content)}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Enhanced markdown processing for professional formatting
  const processMarkdown = (text: string): string => {
    return text
      // Process code blocks with professional styling
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'text';
        const trimmedCode = code.trim();
        
        return `
          <div class="code-block-container mb-6">
            <div class="code-header bg-muted/20 border-b px-4 py-2 text-sm font-medium text-muted-foreground">
              <div class="flex items-center justify-between">
                <span class="flex items-center space-x-2">
                  <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                  <span class="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  <span class="ml-3 font-mono">${getFilenameFromLanguage(language)}</span>
                </span>
                <Badge variant="outline" class="text-xs">${language.toUpperCase()}</Badge>
              </div>
            </div>
            <pre class="code-content bg-muted/5 p-4 overflow-x-auto border-l-4 border-primary"><code class="language-${language} text-sm leading-relaxed font-mono">${trimmedCode}</code></pre>
          </div>`;
      })
      // Process headers with enterprise styling
      .replace(/# (.*)/g, 
        '<h1 class="text-3xl font-bold text-primary mb-6 border-b-2 border-primary pb-4 mt-12">$1</h1>')
      .replace(/## (.*)/g, 
        '<h2 class="text-2xl font-semibold text-primary mt-10 mb-5 border-l-4 border-primary pl-4 bg-primary/5 py-2 rounded-r">$1</h2>')
      .replace(/### (.*)/g, 
        '<h3 class="text-xl font-medium text-primary mt-8 mb-4 flex items-center"><span class="w-3 h-3 bg-primary rounded-full mr-3"></span>$1</h3>')
      .replace(/#### (.*)/g, 
        '<h4 class="text-lg font-medium text-primary mt-6 mb-3">$1</h4>')
      // Process tables with professional styling
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map(cell => cell.trim());
        return `<tr>${cells.map(cell => `<td class="border border-border px-4 py-2">${cell}</td>`).join('')}</tr>`;
      })
      // Process lists with better styling
      .replace(/^- (.*)$/gm, 
        '<li class="mb-2 flex items-start"><span class="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span><span>$1</span></li>')
      .replace(/^\d+\. (.*)$/gm, 
        '<li class="mb-2 flex items-start"><span class="w-6 h-6 bg-primary/10 text-primary text-sm rounded-full flex items-center justify-center mr-3 mt-0.5 font-medium">$&</span><span>$1</span></li>')
      // Process bold and italic text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      // Process blockquotes
      .replace(/^> (.*)$/gm, 
        '<blockquote class="border-l-4 border-primary bg-primary/5 p-4 my-4 italic"><p>$1</p></blockquote>')
      // Process horizontal rules
      .replace(/^---$/gm, '<hr class="border-t-2 border-border my-8">')
      // Process inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted/30 px-2 py-1 rounded text-sm font-mono">$1</code>');
  };

  const getFilenameFromLanguage = (language: string): string => {
    const extensions: Record<string, string> = {
      cisco: 'device-config.txt',
      bash: 'setup-script.sh',
      yaml: 'config.yaml',
      json: 'config.json',
      python: 'script.py',
      javascript: 'script.js',
      typescript: 'script.ts',
      sql: 'queries.sql',
      powershell: 'script.ps1',
      xml: 'config.xml',
      text: 'configuration.txt'
    };
    return extensions[language.toLowerCase()] || `file.${language}`;
  };

  return (
    <div className={cn("max-w-none", className)}>
      {/* Report Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
              <span>Generated: {new Date(generatedAt).toLocaleString()}</span>
              {analytics && (
                <>
                  <span>•</span>
                  <span>{analytics.totalProjects} Projects</span>
                  <span>•</span>
                  <span>{analytics.totalSites} Sites</span>
                </>
              )}
            </div>
          </div>
          {enableExport && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center space-x-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsMarkdown}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={printReport}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Print/PDF</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Report Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none space-y-6"
        dangerouslySetInnerHTML={{
          __html: processMarkdown(content)
        }}
      />
    </div>
  );
};

// Helper function for print processing
function processContentForPrint(content: string): string {
  return content
    .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    })
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*)$/gm, '<li>$1</li>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

export default ProfessionalReport;