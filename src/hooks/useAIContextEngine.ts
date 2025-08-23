import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  aiContextEngine, 
  ConversationMessage, 
  UserPreferences, 
  ContextPattern,
  AIContextSession
} from '@/services/AIContextEngine';

export const useAIContextEngine = () => {
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create Context Session
  const createSessionMutation = useMutation({
    mutationFn: async ({ sessionType = 'conversation', expirationHours = 24 }: {
      sessionType?: string;
      expirationHours?: number;
    }) => {
      return await aiContextEngine.createContextSession(sessionType, expirationHours);
    },
    onSuccess: (sessionToken) => {
      setCurrentSessionToken(sessionToken);
      toast({
        title: "AI Context Session Created",
        description: "New contextual session initialized successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create AI context session",
        variant: "destructive"
      });
    }
  });

  // Get Conversation History
  const { data: conversationHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['ai-conversation-history', currentSessionToken],
    queryFn: () => aiContextEngine.getConversationHistory(currentSessionToken || undefined),
    enabled: !!currentSessionToken
  });

  // Save Conversation Message
  const saveMessageMutation = useMutation({
    mutationFn: async (params: {
      message: ConversationMessage;
      sessionId: string;
      conversationType?: string;
      projectId?: string;
      siteId?: string;
    }) => {
      return await aiContextEngine.saveConversationMessage(
        params.message,
        params.sessionId,
        params.conversationType,
        params.projectId,
        params.siteId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversation-history'] });
    }
  });

  // Get User Preferences
  const { data: userPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['ai-user-preferences'],
    queryFn: () => aiContextEngine.getUserPreferences()
  });

  // Update User Preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: Partial<UserPreferences>) => 
      aiContextEngine.updateUserPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-user-preferences'] });
      toast({
        title: "Preferences Updated",
        description: "Your AI preferences have been saved successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    }
  });

  // Get User Patterns
  const { data: userPatterns, isLoading: isLoadingPatterns } = useQuery({
    queryKey: ['ai-user-patterns'],
    queryFn: () => aiContextEngine.getUserPatterns()
  });

  // Record Pattern
  const recordPatternMutation = useMutation({
    mutationFn: async (params: {
      patternType: string;
      patternData: Record<string, any>;
      contextTags?: string[];
    }) => {
      return await aiContextEngine.recordPattern(
        params.patternType,
        params.patternData,
        params.contextTags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-user-patterns'] });
    }
  });

  // Build Project Context
  const buildProjectContextMutation = useMutation({
    mutationFn: (projectId: string) => aiContextEngine.buildContextForProject(projectId),
    onSuccess: (context) => {
      if (currentSessionToken) {
        updateSessionContextMutation.mutate({
          sessionToken: currentSessionToken,
          contextUpdate: { projectContext: context }
        });
      }
    }
  });

  // Update Session Context
  const updateSessionContextMutation = useMutation({
    mutationFn: async (params: {
      sessionToken: string;
      contextUpdate: Record<string, any>;
    }) => {
      return await aiContextEngine.updateSessionContext(
        params.sessionToken,
        params.contextUpdate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-context-session'] });
    }
  });

  // Get Intelligent Recommendations
  const getRecommendationsMutation = useMutation({
    mutationFn: (context: Record<string, any>) => 
      aiContextEngine.getIntelligentRecommendations(context)
  });

  // Initialize session on mount if none exists
  useEffect(() => {
    if (!currentSessionToken) {
      const stored = localStorage.getItem('ai_context_session_token');
      if (stored) {
        // Verify session is still valid
        aiContextEngine.getContextSession(stored).then(session => {
          if (session && session.isActive && session.expiresAt > new Date()) {
            setCurrentSessionToken(stored);
          } else {
            localStorage.removeItem('ai_context_session_token');
            createSessionMutation.mutate({});
          }
        });
      } else {
        createSessionMutation.mutate({});
      }
    }
  }, []);

  // Store session token in localStorage
  useEffect(() => {
    if (currentSessionToken) {
      localStorage.setItem('ai_context_session_token', currentSessionToken);
    }
  }, [currentSessionToken]);

  return {
    // Session Management
    currentSessionToken,
    createSession: createSessionMutation.mutate,
    isCreatingSession: createSessionMutation.isPending,

    // Conversation History
    conversationHistory: conversationHistory || [],
    isLoadingHistory,
    saveMessage: saveMessageMutation.mutate,
    isSavingMessage: saveMessageMutation.isPending,

    // User Preferences
    userPreferences,
    isLoadingPreferences,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdatingPreferences: updatePreferencesMutation.isPending,

    // Pattern Recognition
    userPatterns: userPatterns || [],
    isLoadingPatterns,
    recordPattern: recordPatternMutation.mutate,
    isRecordingPattern: recordPatternMutation.isPending,

    // Context Building
    buildProjectContext: buildProjectContextMutation.mutate,
    isBuildingContext: buildProjectContextMutation.isPending,
    projectContext: buildProjectContextMutation.data,

    // Recommendations
    getRecommendations: getRecommendationsMutation.mutate,
    isGettingRecommendations: getRecommendationsMutation.isPending,
    recommendations: getRecommendationsMutation.data || [],

    // Session Context Updates
    updateSessionContext: updateSessionContextMutation.mutate,
    isUpdatingSessionContext: updateSessionContextMutation.isPending
  };
};

export const useAIContextSession = (sessionToken?: string) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ['ai-context-session', sessionToken],
    queryFn: () => sessionToken ? aiContextEngine.getContextSession(sessionToken) : null,
    enabled: !!sessionToken
  });

  return {
    session,
    isLoading
  };
};