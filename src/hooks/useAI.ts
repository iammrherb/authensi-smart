import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AIProvider = 'openai' | 'claude' | 'gemini';

export interface AIRequest {
  prompt: string;
  context?: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCompletion = useCallback(async (request: AIRequest): Promise<AIResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-completion', {
        body: request
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('AI completion error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateProjectSummary = useCallback(async (projectData: any): Promise<string | null> => {
    const prompt = `
    Based on the following project information, generate a comprehensive business summary:
    
    Project Name: ${projectData.name}
    Client: ${projectData.client_name}
    Industry: ${projectData.industry}
    Deployment Type: ${projectData.deployment_type}
    Security Level: ${projectData.security_level}
    Total Sites: ${projectData.total_sites}
    Total Endpoints: ${projectData.total_endpoints}
    
    Please provide:
    1. Executive summary
    2. Key objectives and success criteria
    3. Technical requirements overview
    4. Implementation timeline recommendations
    5. Risk assessment and mitigation strategies
    `;

    const response = await generateCompletion({
      prompt,
      context: 'project_summary',
      provider: 'openai',
      temperature: 0.7
    });

    return response?.content || null;
  }, [generateCompletion]);

  const enhanceNotes = useCallback(async (notes: string, context: string): Promise<string | null> => {
    const prompt = `
    Please enhance and organize the following notes for better clarity and structure:
    
    Context: ${context}
    Notes: ${notes}
    
    Please:
    1. Organize the content into clear sections
    2. Improve grammar and clarity
    3. Add relevant technical details where appropriate
    4. Ensure professional tone
    5. Highlight key action items and recommendations
    `;

    const response = await generateCompletion({
      prompt,
      context: 'note_enhancement',
      provider: 'claude',
      temperature: 0.5
    });

    return response?.content || null;
  }, [generateCompletion]);

  const generateRecommendations = useCallback(async (
    projectData: any, 
    useCases: any[], 
    vendors: any[]
  ): Promise<string | null> => {
    const prompt = `
    Based on the project details and available resources, provide comprehensive recommendations:
    
    Project: ${JSON.stringify(projectData, null, 2)}
    Available Use Cases: ${useCases.map(uc => uc.name).join(', ')}
    Available Vendors: ${vendors.map(v => v.vendor_name).join(', ')}
    
    Please provide:
    1. Recommended use cases for this deployment
    2. Optimal vendor selection and reasoning
    3. Implementation phases and timeline
    4. Best practices specific to this environment
    5. Potential challenges and solutions
    6. Success metrics and KPIs
    `;

    const response = await generateCompletion({
      prompt,
      context: 'project_recommendations',
      provider: 'gemini',
      temperature: 0.6
    });

    return response?.content || null;
  }, [generateCompletion]);

  const troubleshootIssue = useCallback(async (
    issue: string, 
    context: any
  ): Promise<string | null> => {
    const prompt = `
    Help troubleshoot the following Portnox NAC issue:
    
    Issue Description: ${issue}
    Context: ${JSON.stringify(context, null, 2)}
    
    Please provide:
    1. Possible root causes
    2. Step-by-step troubleshooting approach
    3. Recommended solutions
    4. Prevention strategies
    5. When to escalate to Portnox support
    
    Base your response on Portnox NAC best practices and common deployment scenarios.
    `;

    const response = await generateCompletion({
      prompt,
      context: 'troubleshooting',
      provider: 'openai',
      temperature: 0.3
    });

    return response?.content || null;
  }, [generateCompletion]);

  return {
    generateCompletion,
    generateProjectSummary,
    enhanceNotes,
    generateRecommendations,
    troubleshootIssue,
    isLoading,
    error
  };
};