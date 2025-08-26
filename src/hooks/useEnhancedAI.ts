import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { enhancedAIService, AIContext, AIResponse, AIRecommendation } from '@/services/ai/EnhancedAIService';

interface UseEnhancedAIOptions {
  autoStore?: boolean;
  showToasts?: boolean;
  timeout?: number;
}

interface UseEnhancedAIReturn {
  // Core functions
  generateRecommendations: (type: string, context: AIContext, customPrompt?: string) => Promise<AIResponse>;
  generateVendorRecommendations: (context: AIContext) => Promise<AIResponse>;
  generateUseCaseRecommendations: (context: AIContext) => Promise<AIResponse>;
  generateScopingRecommendations: (context: AIContext) => Promise<AIResponse>;
  
  // Specialized functions for different stakeholder journeys
  generateSalesRecommendations: (context: AIContext) => Promise<AIResponse>;
  generateSERecommendations: (context: AIContext) => Promise<AIResponse>;
  generateCustomerSuccessRecommendations: (context: AIContext) => Promise<AIResponse>;
  
  // State management
  isLoading: boolean;
  error: string | null;
  lastResponse: AIResponse | null;
  confidence: number;
  
  // Interaction tracking
  acceptRecommendation: (recommendationId: string, feedback?: string) => Promise<void>;
  rejectRecommendation: (recommendationId: string, reason?: string) => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  clearLastResponse: () => void;
}

export const useEnhancedAI = (options: UseEnhancedAIOptions = {}): UseEnhancedAIReturn => {
  const { autoStore = true, showToasts = true, timeout = 30000 } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [confidence, setConfidence] = useState(0);
  
  const { toast } = useToast();

  const handleError = useCallback((error: Error, context?: string) => {
    const errorMessage = `${context ? context + ': ' : ''}${error.message}`;
    setError(errorMessage);
    
    if (showToasts) {
      toast({
        title: "AI Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast, showToasts]);

  const handleSuccess = useCallback((response: AIResponse) => {
    setLastResponse(response);
    setConfidence(response.confidence);
    
    if (showToasts && response.confidence < 0.7) {
      toast({
        title: "Low Confidence Warning",
        description: `AI confidence is ${Math.round(response.confidence * 100)}%. Consider providing more context.`,
        variant: "default",
      });
    }
  }, [toast, showToasts]);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Core AI functions
  const generateRecommendations = useCallback(async (
    type: string,
    context: AIContext,
    customPrompt?: string
  ): Promise<AIResponse> => {
    const result = await executeWithErrorHandling(
      () => enhancedAIService.generateRecommendations(type, context, customPrompt),
      'Generate Recommendations'
    );
    
    if (result) {
      handleSuccess(result);
      return result;
    }
    
    throw new Error('Failed to generate recommendations');
  }, [executeWithErrorHandling, handleSuccess]);

  const generateVendorRecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const result = await executeWithErrorHandling(
      () => enhancedAIService.generateVendorRecommendations(context),
      'Vendor Recommendations'
    );
    
    if (result) {
      handleSuccess(result);
      return result;
    }
    
    throw new Error('Failed to generate vendor recommendations');
  }, [executeWithErrorHandling, handleSuccess]);

  const generateUseCaseRecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const result = await executeWithErrorHandling(
      () => enhancedAIService.generateUseCaseRecommendations(context),
      'Use Case Recommendations'
    );
    
    if (result) {
      handleSuccess(result);
      return result;
    }
    
    throw new Error('Failed to generate use case recommendations');
  }, [executeWithErrorHandling, handleSuccess]);

  const generateScopingRecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const result = await executeWithErrorHandling(
      () => enhancedAIService.generateScopingRecommendations(context),
      'Scoping Recommendations'
    );
    
    if (result) {
      handleSuccess(result);
      return result;
    }
    
    throw new Error('Failed to generate scoping recommendations');
  }, [executeWithErrorHandling, handleSuccess]);

  // Specialized functions for different stakeholder journeys
  const generateSalesRecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const salesContext = {
      ...context,
      stakeholderRole: 'sales' as const,
    };

    return generateRecommendations('sales_recommendations', salesContext);
  }, [generateRecommendations]);

  const generateSERecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const seContext = {
      ...context,
      stakeholderRole: 'sales_engineer' as const,
    };

    return generateRecommendations('se_recommendations', seContext);
  }, [generateRecommendations]);

  const generateCustomerSuccessRecommendations = useCallback(async (context: AIContext): Promise<AIResponse> => {
    const csContext = {
      ...context,
      stakeholderRole: 'customer_success' as const,
    };

    return generateRecommendations('customer_success_recommendations', csContext);
  }, [generateRecommendations]);

  // Interaction tracking functions
  const acceptRecommendation = useCallback(async (recommendationId: string, feedback?: string): Promise<void> => {
    const interaction = {
      recommendation_id: recommendationId,
      action: 'accepted',
      feedback,
      timestamp: new Date().toISOString()
    };

    console.log('Recommendation accepted:', interaction);
    
    if (showToasts) {
      toast({
        title: "Recommendation Accepted",
        description: "Thank you for your feedback.",
        variant: "default",
      });
    }
  }, [toast, showToasts]);

  const rejectRecommendation = useCallback(async (recommendationId: string, reason?: string): Promise<void> => {
    const interaction = {
      recommendation_id: recommendationId,
      action: 'rejected',
      reason,
      timestamp: new Date().toISOString()
    };

    console.log('Recommendation rejected:', interaction);
    
    if (showToasts) {
      toast({
        title: "Recommendation Rejected",
        description: "Thank you for your feedback.",
        variant: "default",
      });
    }
  }, [toast, showToasts]);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLastResponse = useCallback(() => {
    setLastResponse(null);
    setConfidence(0);
  }, []);

  return {
    // Core functions
    generateRecommendations,
    generateVendorRecommendations,
    generateUseCaseRecommendations,
    generateScopingRecommendations,
    
    // Specialized functions
    generateSalesRecommendations,
    generateSERecommendations,
    generateCustomerSuccessRecommendations,
    
    // State
    isLoading,
    error,
    lastResponse,
    confidence,
    
    // Interaction tracking
    acceptRecommendation,
    rejectRecommendation,
    
    // Utilities
    clearError,
    clearLastResponse,
  };
};

export default useEnhancedAI;