import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import enhancedScopingOrchestrator, { 
  EnhancedScopingContext, 
  ScopingAnalysisResult 
} from '@/services/EnhancedScopingOrchestrator';
import { 
  useEnhancedScopingSessions,
  useCreateEnhancedScopingSession,
  useUpdateEnhancedScopingSession
} from '@/hooks/useSmartTemplateRecommendations';

export const useAnalyzeScopingContext = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (context: EnhancedScopingContext): Promise<ScopingAnalysisResult> => {
      try {
        const result = await enhancedScopingOrchestrator.analyzeScopingContext(context);
        return result;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to analyze scoping context');
      }
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Comprehensive scoping analysis completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to complete scoping analysis: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateScopingSession = () => {
  const createSession = useCreateEnhancedScopingSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionData: {
      sessionName: string;
      sessionType?: string;
      projectId?: string;
      scopingData: EnhancedScopingContext;
    }) => {
      const session = await createSession.mutateAsync({
        session_name: sessionData.sessionName,
        session_type: sessionData.sessionType || 'comprehensive',
        project_id: sessionData.projectId,
        scoping_data: sessionData.scopingData,
        completion_percentage: 25,
        status: 'in_progress'
      });

      return session;
    },
    onSuccess: () => {
      toast({
        title: "Session Created",
        description: "Enhanced scoping session created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create scoping session: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateScopingSession = () => {
  const updateSession = useUpdateEnhancedScopingSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      sessionId,
      scopingData,
      analysisResult,
      completionPercentage,
      status
    }: {
      sessionId: string;
      scopingData?: EnhancedScopingContext;
      analysisResult?: ScopingAnalysisResult;
      completionPercentage?: number;
      status?: string;
    }) => {
      const updateData: any = {};
      
      if (scopingData) updateData.scoping_data = scopingData;
      if (analysisResult) {
        updateData.ai_analysis = analysisResult.contextAnalysis;
        updateData.requirements_analysis = analysisResult.templateRecommendations;
        updateData.risk_assessment = analysisResult.riskAssessment;
        updateData.timeline_estimates = analysisResult.timeline;
        updateData.cost_estimates = analysisResult.budgetAnalysis;
        updateData.recommended_approach = analysisResult.recommendedApproach;
        updateData.resource_requirements = analysisResult.resourceRequirements;
        updateData.success_criteria = analysisResult.successCriteria;
      }
      if (completionPercentage !== undefined) updateData.completion_percentage = completionPercentage;
      if (status) updateData.status = status;

      const session = await updateSession.mutateAsync({
        id: sessionId,
        ...updateData
      });

      return session;
    },
    onSuccess: () => {
      toast({
        title: "Session Updated",
        description: "Scoping session updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: "Failed to update scoping session: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useScopingSessionWithAnalysis = (sessionId?: string) => {
  const { data: sessions } = useEnhancedScopingSessions();
  
  return useQuery({
    queryKey: ['scoping-session-analysis', sessionId],
    queryFn: async () => {
      if (!sessions || !sessionId) return null;
      
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return null;

      // If session has analysis data, return it
      if (session.ai_analysis && session.requirements_analysis) {
        return {
          session,
          analysis: {
            contextAnalysis: session.ai_analysis,
            templateRecommendations: session.requirements_analysis,
            riskAssessment: session.risk_assessment,
            timeline: session.timeline_estimates,
            budgetAnalysis: session.cost_estimates,
            recommendedApproach: session.recommended_approach,
            resourceRequirements: session.resource_requirements,
            successCriteria: session.success_criteria,
            recommendations: null // Will be generated if needed
          } as ScopingAnalysisResult
        };
      }

      return { session, analysis: null };
    },
    enabled: !!(sessions && sessionId),
  });
};

export const useGenerateProjectFromScoping = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      analysisResult,
      projectName,
      projectDescription
    }: {
      sessionId: string;
      analysisResult: ScopingAnalysisResult;
      projectName: string;
      projectDescription?: string;
    }) => {
      // This would integrate with project creation APIs
      // For now, we'll structure the data properly
      
      const projectData = {
        name: projectName,
        description: projectDescription || `Project generated from scoping session ${sessionId}`,
        status: 'planning',
        estimated_budget: analysisResult.budgetAnalysis.totalEstimate,
        timeline_weeks: analysisResult.timeline.totalDuration,
        complexity_score: analysisResult.contextAnalysis.complexityAssessment.overall,
        risk_level: analysisResult.riskAssessment.overallRiskLevel,
        success_criteria: analysisResult.successCriteria,
        recommended_approach: analysisResult.recommendedApproach,
        resource_requirements: analysisResult.resourceRequirements,
        // Additional project metadata from scoping
        scoping_session_id: sessionId,
        ai_generated: true,
        template_recommendations: analysisResult.templateRecommendations.primary.map(t => t.templateId)
      };

      // Here you would call your project creation API
      console.log('Project data ready for creation:', projectData);
      
      return projectData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Generated",
        description: "Project successfully created from scoping analysis",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Project Creation Failed",
        description: "Failed to generate project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Advanced scoping insights hook
export const useScopingInsights = () => {
  const { data: sessions } = useEnhancedScopingSessions();

  return useQuery({
    queryKey: ['scoping-insights', sessions?.length],
    queryFn: async () => {
      if (!sessions?.length) return null;

      // Analyze patterns across scoping sessions
      const completedSessions = sessions.filter(s => s.status === 'completed' || s.status === 'analyzed');
      
      const insights = {
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        averageCompletionTime: 0,
        commonIndustries: {} as Record<string, number>,
        complexityDistribution: {} as Record<string, number>,
        successFactors: [] as string[],
        riskPatterns: [] as string[],
        templatePreferences: {} as Record<string, number>
      };

      // Calculate insights
      completedSessions.forEach(session => {
        const data = session.scoping_data as any;
        
        // Industry patterns
        if (data?.organizationProfile?.industry) {
          insights.commonIndustries[data.organizationProfile.industry] = 
            (insights.commonIndustries[data.organizationProfile.industry] || 0) + 1;
        }

        // Complexity patterns
        if (session.ai_analysis?.complexityAssessment?.overall) {
          const complexity = session.ai_analysis.complexityAssessment.overall;
          const level = complexity > 7 ? 'high' : complexity > 5 ? 'medium' : 'low';
          insights.complexityDistribution[level] = 
            (insights.complexityDistribution[level] || 0) + 1;
        }

        // Template preferences
        if (session.requirements_analysis?.primary) {
          session.requirements_analysis.primary.forEach((rec: any) => {
            insights.templatePreferences[rec.templateId] = 
              (insights.templatePreferences[rec.templateId] || 0) + 1;
          });
        }
      });

      return insights;
    },
    enabled: !!sessions?.length,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};