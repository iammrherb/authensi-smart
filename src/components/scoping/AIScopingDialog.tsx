import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Save, FileDown, FolderPlus, ArrowRight } from 'lucide-react';
import UltimateAIScopingWizard from './UltimateAIScopingWizard';
import { useToast } from '@/hooks/use-toast';

interface AIScopingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (scopingData: any) => void;
}

interface ScopingSession {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  completedAt?: string;
}

const AIScopingDialog: React.FC<AIScopingDialogProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [mode, setMode] = useState<'new' | 'saved'>('new');
  const [savedSessions, setSavedSessions] = useState<ScopingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ScopingSession | null>(null);
  const { toast } = useToast();

  const handleScopingComplete = async (_sessionId: string, scopingData: any) => {
    const session: ScopingSession = {
      id: Date.now().toString(),
      name: scopingData.organization?.name || `Scoping Session ${new Date().toLocaleDateString()}`,
      data: scopingData,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Save to localStorage for now (in production, save to database)
    const saved = localStorage.getItem('scopingSessions');
    const sessions = saved ? JSON.parse(saved) : [];
    sessions.push(session);
    localStorage.setItem('scopingSessions', JSON.stringify(sessions));
    setSavedSessions(sessions);

    toast({
      title: "Scoping Complete",
      description: "Your scoping session has been saved successfully."
    });

    // Ask user what they want to do
    setCurrentSession(session);
  };

  const handleSaveAndClose = () => {
    toast({
      title: "Session Saved",
      description: "You can access this scoping session later from the AI Scoping page."
    });
    onClose();
  };

  const handleCreateProjectFromScoping = () => {
    if (currentSession && onCreateProject) {
      onCreateProject(currentSession.data);
      onClose();
    }
  };

  const handleExportScoping = () => {
    if (currentSession) {
      const exportData = {
        sessionName: currentSession.name,
        createdAt: currentSession.createdAt,
        completedAt: currentSession.completedAt,
        scopingData: currentSession.data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scoping-session-${currentSession.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Scoping session has been exported as JSON file."
      });
    }
  };

  const loadSavedSessions = () => {
    const saved = localStorage.getItem('scopingSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadSavedSessions();
    }
  }, [isOpen]);

  // If we have a completed session, show action options
  if (currentSession) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-500" />
              Scoping Complete!
            </DialogTitle>
            <DialogDescription>
              Your AI scoping session has been completed. What would you like to do next?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{currentSession.name}</h3>
              <p className="text-sm text-muted-foreground">
                Completed on {new Date(currentSession.completedAt!).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <Badge variant="glow">
                  {currentSession.data.organization?.industry || 'General'}
                </Badge>
                <Badge variant="outline">
                  {currentSession.data.organization?.size || 'Unknown Size'}
                </Badge>
                <Badge variant="outline">
                  {currentSession.data.network_infrastructure?.site_count || 0} Sites
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onClick={handleExportScoping}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <FileDown className="h-6 w-6" />
                <span>Export Data</span>
                <span className="text-xs text-muted-foreground">Download JSON</span>
              </Button>

              <Button 
                onClick={handleCreateProjectFromScoping}
                className="h-20 flex flex-col gap-2"
                disabled={!onCreateProject}
              >
                <FolderPlus className="h-6 w-6" />
                <span>Create Project</span>
                <span className="text-xs text-muted-foreground">Continue setup</span>
              </Button>
            </div>

            {onCreateProject && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Recommended: Create Project</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Use your scoping data to create a new project and continue with stakeholder management, 
                  bulk operations setup, and detailed planning.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            AI Scoping Wizard
          </DialogTitle>
          <DialogDescription>
            Complete intelligent scoping to get personalized recommendations and deployment plans
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto max-h-[80vh]">
          <UltimateAIScopingWizard
            onComplete={handleScopingComplete}
            onSave={() => { /* draft saved */ }}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIScopingDialog;