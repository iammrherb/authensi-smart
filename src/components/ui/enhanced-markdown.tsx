import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
  enableCopy?: boolean;
  enableDownload?: boolean;
}

export const EnhancedMarkdown: React.FC<EnhancedMarkdownProps> = ({
  content,
  className,
  enableCopy = true,
  enableDownload = false
}) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());

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
    a.download = 'configuration.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Enhanced markdown processing with better code block handling
  const processMarkdown = (text: string): string => {
    let blockIndex = 0;
    
    return text
      // Process code blocks with enhanced formatting
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'text';
        const currentBlockIndex = blockIndex++;
        const filename = getFilenameFromLanguage(language);
        const trimmedCode = code.trim();
        
        return `
          <div class="border rounded-lg overflow-hidden my-4 bg-card">
            <div class="border-b bg-muted/30 px-3 py-2 text-xs font-medium flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="font-mono">${filename}</span>
                <span class="text-muted-foreground">(${language.toUpperCase()})</span>
              </div>
              ${enableCopy ? `
                <button 
                  onclick="window.copyCodeBlock('${btoa(trimmedCode)}', ${currentBlockIndex})"
                  class="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-background/50 hover:bg-background transition-colors"
                  id="copy-btn-${currentBlockIndex}"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span id="copy-text-${currentBlockIndex}">Copy</span>
                </button>
              ` : ''}
            </div>
            <pre class="p-4 bg-muted/10 overflow-x-auto text-sm leading-relaxed"><code class="language-${language} font-mono text-foreground">${trimmedCode}</code></pre>
          </div>`;
      })
      // Process headers with icons and better styling
      .replace(/### (🏗️|🔧|🔐|🌐|🛡️|✅|📋|🔍|🔄|⚠️|📊)(.*)/g, 
        '<h3 class="text-lg font-semibold text-primary mt-8 mb-4 flex items-center border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r"><span class="text-xl mr-3">$1</span><span>$2</span></h3>')
      .replace(/### (.*)/g, 
        '<h3 class="text-lg font-semibold text-primary mt-6 mb-3 flex items-center"><span class="w-2 h-2 bg-primary rounded-full mr-3"></span>$1</h3>')
      .replace(/## (.*)/g, 
        '<h2 class="text-xl font-bold text-primary mt-8 mb-4 border-b border-primary/20 pb-2">$1</h2>')
      .replace(/# (.*)/g, 
        '<h1 class="text-2xl font-bold text-primary mb-6 border-b-2 border-primary pb-3">$1</h1>')
      // Process checkboxes with better styling
      .replace(/- \[ \] (.*)/g, 
        '<div class="flex items-center space-x-3 py-2 px-3 rounded bg-muted/20 my-1"><input type="checkbox" class="rounded h-4 w-4 border-2" disabled> <span class="text-sm">$1</span></div>')
      .replace(/- \[x\] (.*)/g, 
        '<div class="flex items-center space-x-3 py-2 px-3 rounded bg-green-50 dark:bg-green-950/20 my-1"><input type="checkbox" class="rounded h-4 w-4 text-green-600" checked disabled> <span class="text-sm line-through opacity-70">$1</span></div>')
      // Process text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      // Process lists with better styling
      .replace(/^- (.*)$/gm, 
        '<div class="flex items-start space-x-3 py-1"><div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div><span class="text-sm">$1</span></div>')
      .replace(/^\d+\. (.*)$/gm, 
        '<div class="flex items-start space-x-3 py-1"><div class="w-6 h-6 bg-primary/10 text-primary text-xs rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 font-medium">$&</div><span class="text-sm">$1</span></div>');
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

  // Add global copy function to window for button clicks
  React.useEffect(() => {
    (window as any).copyCodeBlock = (encodedText: string, blockIndex: number) => {
      const text = atob(encodedText);
      copyToClipboard(text, blockIndex);
      
      // Update button text
      const btn = document.getElementById(`copy-text-${blockIndex}`);
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    };
    
    return () => {
      delete (window as any).copyCodeBlock;
    };
  }, []);

  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      {enableDownload && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadContent}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      )}
      <div 
        className="space-y-4"
        dangerouslySetInnerHTML={{
          __html: processMarkdown(content)
        }}
      />
    </div>
  );
};

export default EnhancedMarkdown;