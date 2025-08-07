import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ScopingSession {
  id: string;
  name: string;
  organizationName: string;
  industry: string;
  createdAt: string;
  completedAt?: string;
  status: 'draft' | 'completed' | 'archived';
  data: any;
  projectId?: string;
}

export const useScopingManagement = () => {
  const [sessions, setSessions] = useState<ScopingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load sessions from localStorage
  const loadSessions = () => {
    try {
      const stored = localStorage.getItem('scoping_sessions');
      if (stored) {
        const parsedSessions = JSON.parse(stored);
        setSessions(parsedSessions);
      }
    } catch (error) {
      console.error('Failed to load scoping sessions:', error);
    }
  };

  // Save sessions to localStorage
  const saveSessions = (updatedSessions: ScopingSession[]) => {
    try {
      localStorage.setItem('scoping_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Failed to save scoping sessions:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save scoping sessions",
        variant: "destructive",
      });
    }
  };

  // Create a new scoping session
  const createSession = (data: Partial<ScopingSession>): string => {
    const newSession: ScopingSession = {
      id: Date.now().toString(),
      name: data.name || `Scoping Session ${Date.now()}`,
      organizationName: data.organizationName || 'Unknown Organization',
      industry: data.industry || 'Unknown',
      createdAt: new Date().toISOString(),
      status: 'draft',
      data: data.data || {},
      ...data
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    
    toast({
      title: "Session Created",
      description: "Scoping session created successfully",
    });

    return newSession.id;
  };

  // Update an existing session
  const updateSession = (id: string, updates: Partial<ScopingSession>) => {
    const updatedSessions = sessions.map(session =>
      session.id === id ? { ...session, ...updates } : session
    );
    saveSessions(updatedSessions);
    
    toast({
      title: "Session Updated",
      description: "Scoping session updated successfully",
    });
  };

  // Delete a session
  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    saveSessions(updatedSessions);
    
    // Also remove individual session storage
    localStorage.removeItem(`scoping_session_${id}`);
    
    toast({
      title: "Session Deleted",
      description: "Scoping session deleted successfully",
    });
  };

  // Complete a session
  const completeSession = (id: string, projectId?: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === id 
        ? { 
            ...session, 
            status: 'completed' as const, 
            completedAt: new Date().toISOString(),
            projectId 
          }
        : session
    );
    saveSessions(updatedSessions);
    
    toast({
      title: "Session Completed",
      description: "Scoping session marked as completed",
    });
  };

  // Archive a session
  const archiveSession = (id: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === id ? { ...session, status: 'archived' as const } : session
    );
    saveSessions(updatedSessions);
    
    toast({
      title: "Session Archived",
      description: "Scoping session archived",
    });
  };

  // Get session by ID
  const getSession = (id: string): ScopingSession | undefined => {
    return sessions.find(session => session.id === id);
  };

  // Get sessions by status
  const getSessionsByStatus = (status: ScopingSession['status']): ScopingSession[] => {
    return sessions.filter(session => session.status === status);
  };

  // Export session data
  const exportSession = (id: string) => {
    const session = getSession(id);
    if (!session) return;

    const exportData = {
      sessionInfo: {
        id: session.id,
        name: session.name,
        organizationName: session.organizationName,
        industry: session.industry,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
        status: session.status
      },
      scopingData: session.data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoping-session-${session.name.replace(/\s+/g, '-')}-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Session Exported",
      description: "Scoping session exported successfully",
    });
  };

  // Import session data
  const importSession = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          
          const newSession: ScopingSession = {
            id: Date.now().toString(), // Generate new ID
            name: `${importData.sessionInfo.name} (Imported)`,
            organizationName: importData.sessionInfo.organizationName,
            industry: importData.sessionInfo.industry,
            createdAt: new Date().toISOString(),
            status: 'draft',
            data: importData.scopingData
          };

          const updatedSessions = [newSession, ...sessions];
          saveSessions(updatedSessions);
          
          toast({
            title: "Session Imported",
            description: "Scoping session imported successfully",
          });
          
          resolve();
        } catch (error) {
          console.error('Import failed:', error);
          toast({
            title: "Import Failed",
            description: "Failed to import scoping session",
            variant: "destructive",
          });
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  // Bulk operations
  const bulkDelete = (ids: string[]) => {
    const updatedSessions = sessions.filter(session => !ids.includes(session.id));
    saveSessions(updatedSessions);
    
    // Remove individual session storage
    ids.forEach(id => localStorage.removeItem(`scoping_session_${id}`));
    
    toast({
      title: "Sessions Deleted",
      description: `${ids.length} scoping sessions deleted`,
    });
  };

  const bulkArchive = (ids: string[]) => {
    const updatedSessions = sessions.map(session =>
      ids.includes(session.id) ? { ...session, status: 'archived' as const } : session
    );
    saveSessions(updatedSessions);
    
    toast({
      title: "Sessions Archived",
      description: `${ids.length} scoping sessions archived`,
    });
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Statistics
  const getStatistics = () => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const draft = sessions.filter(s => s.status === 'draft').length;
    const archived = sessions.filter(s => s.status === 'archived').length;
    
    return {
      total,
      completed,
      draft,
      archived,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    deleteSession,
    completeSession,
    archiveSession,
    getSession,
    getSessionsByStatus,
    exportSession,
    importSession,
    bulkDelete,
    bulkArchive,
    getStatistics,
    loadSessions
  };
};