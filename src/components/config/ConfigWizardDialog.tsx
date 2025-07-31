import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, FileDown, Copy, ArrowRight, Bot } from 'lucide-react';
import OneXerConfigWizard from './OneXerConfigWizard';
import { useToast } from '@/hooks/use-toast';

interface ConfigWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  siteId?: string;
}

interface ConfigSession {
  id: string;
  name: string;
  vendor: string;
  model: string;
  configType: string;
  config: string;
  createdAt: string;
  completedAt?: string;
}

const ConfigWizardDialog: React.FC<ConfigWizardDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  siteId
}) => {
  const [currentSession, setCurrentSession] = useState<ConfigSession | null>(null);
  const { toast } = useToast();

  const handleConfigComplete = async (configData: any) => {
    const session: ConfigSession = {
      id: Date.now().toString(),
      name: `${configData.vendor} ${configData.model} - ${configData.scenario}`,
      vendor: configData.vendor,
      model: configData.model,
      configType: configData.scenario,
      config: configData.generatedConfig,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Save to localStorage for now (in production, save to database)
    const saved = localStorage.getItem('configSessions');
    const sessions = saved ? JSON.parse(saved) : [];
    sessions.push(session);
    localStorage.setItem('configSessions', JSON.stringify(sessions));

    toast({
      title: "Configuration Generated",
      description: "Your network configuration has been generated successfully."
    });

    setCurrentSession(session);
  };

  const handleSaveAndClose = () => {
    toast({
      title: "Configuration Saved",
      description: "You can access this configuration later from the Templates page."
    });
    onClose();
  };

  const handleCopyConfig = () => {
    if (currentSession) {
      navigator.clipboard.writeText(currentSession.config);
      toast({
        title: "Configuration Copied",
        description: "Configuration has been copied to clipboard."
      });
    }
  };

  const handleExportConfig = () => {
    if (currentSession) {
      const exportData = {
        sessionName: currentSession.name,
        vendor: currentSession.vendor,
        model: currentSession.model,
        configType: currentSession.configType,
        createdAt: currentSession.createdAt,
        completedAt: currentSession.completedAt,
        configuration: currentSession.config
      };

      const blob = new Blob([currentSession.config], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentSession.vendor}-${currentSession.model}-config.txt`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Configuration has been exported as text file."
      });
    }
  };

  // If we have a completed session, show action options
  if (currentSession) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-500" />
              Configuration Generated!
            </DialogTitle>
            <DialogDescription>
              Your network configuration has been generated. What would you like to do next?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{currentSession.name}</h3>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date(currentSession.completedAt!).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <Badge variant="glow">{currentSession.vendor}</Badge>
                <Badge variant="outline">{currentSession.model}</Badge>
                <Badge variant="outline">{currentSession.configType}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                onClick={handleSaveAndClose}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <Save className="h-6 w-6" />
                <span>Save & Close</span>
                <span className="text-xs text-muted-foreground">Access later</span>
              </Button>

              <Button 
                onClick={handleCopyConfig}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <Copy className="h-6 w-6" />
                <span>Copy Config</span>
                <span className="text-xs text-muted-foreground">To clipboard</span>
              </Button>

              <Button 
                onClick={handleExportConfig}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <FileDown className="h-6 w-6" />
                <span>Export Config</span>
                <span className="text-xs text-muted-foreground">Download file</span>
              </Button>

              <Button 
                onClick={() => setCurrentSession(null)}
                className="h-20 flex flex-col gap-2"
              >
                <Settings className="h-6 w-6" />
                <span>New Config</span>
                <span className="text-xs text-muted-foreground">Start over</span>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Configuration Preview</span>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
                <pre>{currentSession.config.substring(0, 500)}...</pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
        <div className="bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              AI Configuration Wizard
              <Badge variant="glow" className="ml-2">Advanced</Badge>
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Generate intelligent, vendor-specific 802.1X network access control configurations with AI-powered recommendations and best practices.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 max-h-[calc(95vh-140px)] overflow-auto">
          <OneXerConfigWizard 
            projectId={projectId}
            siteId={siteId}
            onSave={handleConfigComplete}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigWizardDialog;