import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Download, Maximize2, Minimize2 } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  heightClass?: string; // e.g., "h-[60vh]"
  filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "plaintext",
  className,
  heightClass = "h-[60vh]",
  filename,
}) => {
  const [expanded, setExpanded] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "configuration.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("border rounded-md overflow-hidden bg-card", className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-muted/60 border-b">
        <div className="text-xs text-muted-foreground truncate">
          {filename || "Generated Configuration"}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard} aria-label="Copy code">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={downloadFile} aria-label="Download code">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className={cn("w-full", expanded ? heightClass : "h-64") + " overflow-auto"}>
        <pre className="m-0 p-4 text-sm font-mono whitespace-pre-wrap">
          <code className={cn(`language-${language}`)}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
