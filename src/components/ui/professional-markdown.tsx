import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Download, Check, ChevronDown, ChevronRight, Calendar, User, Target, AlertTriangle, CheckCircle, Clock, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProfessionalMarkdownProps {
  content: string;
  className?: string;
  enableCopy?: boolean;
  enableDownload?: boolean;
  documentType?: 'report' | 'checklist' | 'plan' | 'template' | 'analysis';
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    version?: string;
    status?: string;
    priority?: string;
  };
}

export const ProfessionalMarkdown: React.FC<ProfessionalMarkdownProps> = ({
  content,
  className,
  enableCopy = true,
  enableDownload = true,
  documentType = 'report',
  metadata = {}
}) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, blockIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set([...prev, blockIndex]));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadContent = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.title || 'document'}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getDocumentIcon = () => {
    switch (documentType) {
      case 'report': return <FileText className="h-5 w-5" />;
      case 'checklist': return <CheckCircle className="h-5 w-5" />;
      case 'plan': return <Target className="h-5 w-5" />;
      case 'template': return <Copy className="h-5 w-5" />;
      case 'analysis': return <Zap className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      default: return 'border-gray-200';
    }
  };

  // Enhanced markdown processing with professional formatting
  const processMarkdown = (text: string): string => {
    let blockIndex = 0;
    let sectionIndex = 0;
    
    return text
      // Process executive summary boxes
      .replace(/## Executive Summary\n([\s\S]*?)(?=\n##|\n#|$)/g, (match, content) => {
        return `
          <div class="executive-summary bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-8">
            <h2 class="text-xl font-bold text-primary mb-4 flex items-center">
              <span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              Executive Summary
            </h2>
            <div class="prose prose-sm dark:prose-invert">${content.trim()}</div>
          </div>`;
      })
      
      // Process action items and tasks
      .replace(/### Action Items\n([\s\S]*?)(?=\n###|\n##|\n#|$)/g, (match, content) => {
        return `
          <div class="action-items bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Action Items
            </h3>
            <div class="space-y-2">${content.trim()}</div>
          </div>`;
      })

      // Process milestones and timelines
      .replace(/### Timeline\n([\s\S]*?)(?=\n###|\n##|\n#|$)/g, (match, content) => {
        return `
          <div class="timeline bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 5a1 1 0 112 0v3.5L11.5 10a1 1 0 11-1 1.73L9 10.5V5z"/>
              </svg>
              Project Timeline
            </h3>
            <div class="timeline-content">${content.trim()}</div>
          </div>`;
      })

      // Process risk assessments
      .replace(/### Risks?\n([\s\S]*?)(?=\n###|\n##|\n#|$)/g, (match, content) => {
        return `
          <div class="risks bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"/>
              </svg>
              Risk Assessment
            </h3>
            <div class="risks-content">${content.trim()}</div>
          </div>`;
      })

      // Process collapsible sections
      .replace(/### (.*?)\s*\[COLLAPSIBLE\]\n([\s\S]*?)(?=\n###|\n##|\n#|$)/g, (match, title, content) => {
        const sectionId = `section-${sectionIndex++}`;
        return `
          <div class="collapsible-section border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
            <button onclick="window.toggleSection('${sectionId}')" class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-left transition-colors">
              <h3 class="text-lg font-semibold">${title.trim()}</h3>
              <svg id="chevron-${sectionId}" class="w-5 h-5 transform transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <div id="content-${sectionId}" class="px-6 py-4 hidden">
              ${content.trim()}
            </div>
          </div>`;
      })
      
      // Process code blocks with enhanced formatting
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'text';
        const currentBlockIndex = blockIndex++;
        const filename = getFilenameFromLanguage(language);
        const trimmedCode = code.trim();
        
        return `
          <div class="code-block border rounded-lg overflow-hidden my-6 bg-card shadow-sm">
            <div class="code-header bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex space-x-1">
                  <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span class="text-sm font-mono text-muted-foreground">${filename}</span>
                <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">${language.toUpperCase()}</span>
              </div>
              ${enableCopy ? `
                <button 
                  onclick="window.copyCodeBlock('${btoa(trimmedCode)}', ${currentBlockIndex})"
                  class="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded bg-background hover:bg-accent transition-colors"
                  id="copy-btn-${currentBlockIndex}"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span id="copy-text-${currentBlockIndex}">Copy</span>
                </button>
              ` : ''}
            </div>
            <div class="code-content bg-muted/5 p-4 overflow-x-auto">
              <pre class="text-sm leading-relaxed"><code class="language-${language} font-mono">${trimmedCode}</code></pre>
            </div>
          </div>`;
      })
      
      // Process enhanced headers with navigation
      .replace(/### (🎯|📊|⚠️|✅|📋|🔍|📈|💡|🚀|⏰)(.*)/g, 
        '<h3 class="text-xl font-bold text-primary mt-10 mb-6 flex items-center p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg"><span class="text-2xl mr-4">$1</span><span>$2</span></h3>')
      .replace(/### (.*)/g, 
        '<h3 class="text-lg font-semibold text-primary mt-8 mb-4 flex items-center pb-2 border-b border-primary/20"><span class="w-3 h-3 bg-primary rounded-full mr-3"></span>$1</h3>')
      .replace(/## (.*)/g, 
        '<h2 class="text-2xl font-bold text-primary mt-12 mb-6 pb-3 border-b-2 border-primary">$1</h2>')
      .replace(/# (.*)/g, 
        '<h1 class="text-3xl font-bold text-primary mb-8 pb-4 border-b-4 border-primary">$1</h1>')
      
      // Process enhanced checkboxes and task lists
      .replace(/- \[ \] (.*)/g, 
        '<div class="flex items-start space-x-3 py-2 px-4 rounded-lg bg-muted/20 border border-muted my-2 hover:bg-muted/30 transition-colors"><input type="checkbox" class="rounded h-4 w-4 border-2 mt-0.5 flex-shrink-0" disabled> <span class="text-sm flex-1">$1</span><span class="text-xs text-muted-foreground">Pending</span></div>')
      .replace(/- \[x\] (.*)/g, 
        '<div class="flex items-start space-x-3 py-2 px-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 my-2"><input type="checkbox" class="rounded h-4 w-4 text-green-600 border-green-300 mt-0.5 flex-shrink-0" checked disabled> <span class="text-sm flex-1 line-through opacity-70">$1</span><span class="text-xs text-green-600 font-medium">Complete</span></div>')
      
      // Process priority indicators
      .replace(/\[HIGH\](.*)/g, '<div class="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r my-2"><span class="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">HIGH</span><span>$1</span></div>')
      .replace(/\[MEDIUM\](.*)/g, '<div class="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r my-2"><span class="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold">MEDIUM</span><span>$1</span></div>')
      .replace(/\[LOW\](.*)/g, '<div class="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r my-2"><span class="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">LOW</span><span>$1</span></div>')
      
      // Process text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted text-foreground rounded text-sm font-mono">$1</code>')
      
      // Process enhanced lists
      .replace(/^- (.*)$/gm, 
        '<div class="flex items-start space-x-3 py-1.5"><div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div><span class="text-sm leading-relaxed">$1</span></div>')
      .replace(/^\d+\. (.*)$/gm, 
        '<div class="flex items-start space-x-3 py-1.5"><div class="min-w-[1.5rem] h-6 bg-primary/10 text-primary text-xs rounded-full flex items-center justify-center font-medium flex-shrink-0">$&</div><span class="text-sm leading-relaxed">$1</span></div>');
  };

  const getFilenameFromLanguage = (language: string): string => {
    const extensions: Record<string, string> = {
      cisco: 'switch-config.txt',
      bash: 'deployment-script.sh',
      yaml: 'project-config.yaml',
      json: 'project-data.json',
      python: 'automation-script.py',
      javascript: 'validation-script.js',
      typescript: 'project-manager.ts',
      sql: 'database-queries.sql',
      powershell: 'deployment-script.ps1',
      xml: 'project-config.xml',
      markdown: 'project-documentation.md',
      text: 'project-notes.txt'
    };
    return extensions[language.toLowerCase()] || `project-file.${language}`;
  };

  // Add global functions for interactivity
  React.useEffect(() => {
    (window as any).copyCodeBlock = (encodedText: string, blockIndex: number) => {
      const text = atob(encodedText);
      copyToClipboard(text, blockIndex);
      
      const btn = document.getElementById(`copy-text-${blockIndex}`);
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    };

    (window as any).toggleSection = (sectionId: string) => {
      const content = document.getElementById(`content-${sectionId}`);
      const chevron = document.getElementById(`chevron-${sectionId}`);
      
      if (content && chevron) {
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          chevron.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          chevron.style.transform = 'rotate(0deg)';
        }
      }
    };
    
    return () => {
      delete (window as any).copyCodeBlock;
      delete (window as any).toggleSection;
    };
  }, []);

  return (
    <div className={cn("professional-document", className)}>
      {/* Document Header */}
      {metadata.title && (
        <Card className={cn("mb-8 overflow-hidden", getPriorityColor(metadata.priority))}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {getDocumentIcon()}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-primary mb-2">
                    {metadata.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {metadata.author && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{metadata.author}</span>
                      </div>
                    )}
                    {metadata.date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{metadata.date}</span>
                      </div>
                    )}
                    {metadata.version && (
                      <Badge variant="outline" className="text-xs">
                        v{metadata.version}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {metadata.status && (
                  <Badge className={getStatusColor(metadata.status)}>
                    {metadata.status}
                  </Badge>
                )}
                {metadata.priority && (
                  <Badge variant="outline" className={`border-${metadata.priority === 'high' ? 'red' : metadata.priority === 'medium' ? 'yellow' : 'green'}-500`}>
                    {metadata.priority} Priority
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Generated: {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {enableCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(content, -1)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          )}
          {enableDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadContent}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div 
          className="document-content space-y-6"
          dangerouslySetInnerHTML={{
            __html: (() => {
              const DOMPurify = (window as any).DOMPurify;
              return DOMPurify.sanitize(processMarkdown(content), {
                ALLOWED_TAGS: ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'pre', 'code', 'strong', 'em', 'button', 'input', 'svg', 'path', 'p'],
                ALLOWED_ATTR: ['class', 'id', 'onclick', 'type', 'disabled', 'checked', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill', 'stroke', 'viewBox', 'style']
              });
            })()
          }}
        />
      </div>

      {/* Document Footer */}
      <div className="mt-12 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Document ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
          <div>
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMarkdown;