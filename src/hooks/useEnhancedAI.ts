import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AIProviderType, TaskType } from '@/components/ai/EnhancedAIProviderManager';

export interface EnhancedAIRequest {
  prompt: string;
  context?: string;
  taskType?: TaskType;
  provider?: AIProviderType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
  enableFallback?: boolean;
}

export interface EnhancedAIResponse {
  content: string;
  provider: AIProviderType;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost_estimate?: number;
  };
  fromCache?: boolean;
  fallbackUsed?: boolean;
  responseTime?: number;
}

interface TaskConfiguration {
  taskType: TaskType;
  primaryProvider: AIProviderType;
  primaryModel: string;
  fallbackProvider?: AIProviderType;
  fallbackModel?: string;
  temperature: number;
  maxTokens: number;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
}

const DEFAULT_TASK_CONFIGURATIONS: TaskConfiguration[] = [
  {
    taskType: 'reasoning',
    primaryProvider: 'openai',
    primaryModel: 'o3-2025-04-16',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-opus-4-20250514',
    temperature: 0.3,
    maxTokens: 8192,
    reasoningEffort: 'high',
    verbosity: 'medium'
  },
  {
    taskType: 'code_generation',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.1,
    maxTokens: 4096,
    reasoningEffort: 'medium',
    verbosity: 'high'
  },
  {
    taskType: 'analysis',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    fallbackProvider: 'google',
    fallbackModel: 'gemini-2.0-flash-exp',
    temperature: 0.2,
    maxTokens: 8192,
    verbosity: 'high'
  },
  {
    taskType: 'search',
    primaryProvider: 'perplexity',
    primaryModel: 'llama-3.1-sonar-large-128k-online',
    fallbackProvider: 'grok',
    fallbackModel: 'grok-2',
    temperature: 0.3,
    maxTokens: 4096
  },
  {
    taskType: 'chat',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-mini-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-3-5-haiku-20241022',
    temperature: 0.7,
    maxTokens: 2048,
    reasoningEffort: 'minimal',
    verbosity: 'medium'
  },
  {
    taskType: 'summarization',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-3-5-haiku-20241022',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-5-mini-2025-08-07',
    temperature: 0.1,
    maxTokens: 1024,
    verbosity: 'low'
  },
  {
    taskType: 'creative_writing',
    primaryProvider: 'anthropic',
    primaryModel: 'claude-opus-4-20250514',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-5-2025-08-07',
    temperature: 0.8,
    maxTokens: 4096,
    verbosity: 'high'
  },
  {
    taskType: 'project_insights',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.3,
    maxTokens: 6144,
    reasoningEffort: 'medium',
    verbosity: 'high'
  },
  {
    taskType: 'troubleshooting',
    primaryProvider: 'openai',
    primaryModel: 'gpt-5-2025-08-07',
    fallbackProvider: 'anthropic',
    fallbackModel: 'claude-sonnet-4-20250514',
    temperature: 0.2,
    maxTokens: 4096,
    reasoningEffort: 'high',
    verbosity: 'high'
  }
];

export const useEnhancedAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load task configurations from localStorage (in production, load from Supabase)
  const getTaskConfigurations = useCallback((): TaskConfiguration[] => {
    try {
      const saved = localStorage.getItem('ai_task_configurations');
      return saved ? JSON.parse(saved) : DEFAULT_TASK_CONFIGURATIONS;
    } catch {
      return DEFAULT_TASK_CONFIGURATIONS;
    }
  }, []);

  // Get configuration for a specific task type
  const getTaskConfiguration = useCallback((taskType: TaskType): TaskConfiguration => {
    const configurations = getTaskConfigurations();
    return configurations.find(config => config.taskType === taskType) || 
           configurations.find(config => config.taskType === 'chat')!;
  }, [getTaskConfigurations]);

  // Enhanced AI completion with intelligent routing
  const generateCompletion = useCallback(async (request: EnhancedAIRequest): Promise<EnhancedAIResponse | null> => {
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      let finalRequest = { ...request };

      // If taskType is specified but no provider/model, use intelligent routing
      if (request.taskType && !request.provider) {
        const taskConfig = getTaskConfiguration(request.taskType);
        finalRequest = {
          ...finalRequest,
          provider: taskConfig.primaryProvider,
          model: taskConfig.primaryModel,
          temperature: finalRequest.temperature ?? taskConfig.temperature,
          maxTokens: finalRequest.maxTokens ?? taskConfig.maxTokens,
          reasoningEffort: finalRequest.reasoningEffort ?? taskConfig.reasoningEffort,
          verbosity: finalRequest.verbosity ?? taskConfig.verbosity
        };
      }

      // Add task-specific context enhancement
      if (request.taskType) {
        finalRequest.context = enhanceContextForTask(request.context || '', request.taskType);
      }

      const { data, error: supabaseError } = await supabase.functions.invoke('enhanced-ai-completion', {
        body: {
          ...finalRequest,
          enableFallback: request.enableFallback ?? true
        }
      });

      if (supabaseError) {
        console.error('Enhanced AI function error:', supabaseError);
        throw new Error(supabaseError.message || 'Enhanced AI service unavailable');
      }

      if (!data) {
        throw new Error('No response from enhanced AI service');
      }

      const responseTime = Date.now() - startTime;

      return {
        ...data,
        responseTime
      } as EnhancedAIResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Enhanced AI completion error:', err);
      
      // Return a fallback response to prevent crashes
      return {
        content: 'Enhanced AI service is temporarily unavailable. Please try again later.',
        provider: request.provider || 'openai',
        model: request.model || 'gpt-5-2025-08-07',
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          cost_estimate: 0
        },
        responseTime: Date.now() - startTime,
        fallbackUsed: false
      };
    } finally {
      setIsLoading(false);
    }
  }, [getTaskConfiguration]);

  // Specialized methods for different task types
  const generateProjectSummary = useCallback(async (projectData: any): Promise<string | null> => {
    const prompt = `
# COMPREHENSIVE PROJECT SUMMARY GENERATION

## PROJECT SPECIFICATIONS
- **Project Name:** ${projectData.name}
- **Client:** ${projectData.client_name}
- **Industry:** ${projectData.industry}
- **Deployment Type:** ${projectData.deployment_type}
- **Security Level:** ${projectData.security_level}
- **Total Sites:** ${projectData.total_sites}
- **Total Endpoints:** ${projectData.total_endpoints}

## REQUIRED OUTPUT FORMAT

Generate a professional business summary using structured markdown formatting:

### 📋 Executive Summary
Comprehensive overview highlighting project scope, strategic value, and expected outcomes.

### 🎯 Key Objectives & Success Criteria
\`\`\`yaml
Primary Objectives:
  - Network Access Control: Implement enterprise-grade NAC solution
  - Security Enhancement: Achieve ${projectData.security_level} security posture
  - Compliance: Meet industry-specific regulatory requirements
  
Success Metrics:
  - Deployment Success Rate: >95%
  - Security Incident Reduction: >80%
  - User Experience Score: >4.5/5
  - Compliance Achievement: 100%
\`\`\`

### 🏗️ Technical Requirements Overview
**Infrastructure Scope:**
- **Sites:** ${projectData.total_sites} locations
- **Endpoints:** ${projectData.total_endpoints} devices
- **Industry:** ${projectData.industry} compliance requirements
- **Security Level:** ${projectData.security_level} implementation

### ⏱️ Implementation Timeline
\`\`\`mermaid
gantt
    title Implementation Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Analysis: 2024-01-01, 2w
    Design & Architecture: 2w
    section Deployment
    Infrastructure Setup: 2w
    Testing & Validation: 1w
    section Go-Live
    Production Rollout: 1w
    Optimization: 2w
\`\`\`

### ⚠️ Risk Assessment & Mitigation
**Critical Risks:**
- **Risk:** Network downtime during deployment
  - **Impact:** High
  - **Mitigation:** Phased rollout with rollback procedures

**Medium Risks:**
- **Risk:** User adoption challenges
  - **Impact:** Medium
  - **Mitigation:** Comprehensive training program

### 📊 Business Impact Analysis
Expected benefits and ROI calculations with specific metrics.

Use professional formatting with proper headers, code blocks, and structured content.
    `;

    const response = await generateCompletion({
      prompt,
      taskType: 'project_insights',
      context: 'project_summary'
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
      taskType: 'analysis',
      context: 'note_enhancement'
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
      taskType: 'project_insights',
      context: 'project_recommendations'
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
      taskType: 'troubleshooting',
      context: 'portnox_troubleshooting'
    });

    return response?.content || null;
  }, [generateCompletion]);

  const searchInformation = useCallback(async (query: string, context?: string): Promise<string | null> => {
    const prompt = `
    Search for current information about: ${query}
    ${context ? `Context: ${context}` : ''}
    
    Please provide:
    1. Current and relevant information
    2. Key findings and insights
    3. Reliable sources
    4. Practical implications
    `;

    const response = await generateCompletion({
      prompt,
      taskType: 'search',
      context: context || 'information_search'
    });

    return response?.content || null;
  }, [generateCompletion]);

  const generateCode = useCallback(async (
    requirements: string, 
    language: string = 'typescript',
    context?: string
  ): Promise<string | null> => {
    const prompt = `
    Generate ${language} code based on the following requirements:
    
    Requirements: ${requirements}
    Language: ${language}
    ${context ? `Context: ${context}` : ''}
    
    Please provide:
    1. Clean, well-documented code
    2. Error handling
    3. Best practices implementation
    4. Comments explaining key functionality
    `;

    const response = await generateCompletion({
      prompt,
      taskType: 'code_generation',
      context: context || 'code_generation'
    });

    return response?.content || null;
  }, [generateCompletion]);

  const summarizeContent = useCallback(async (
    content: string, 
    maxLength: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<string | null> => {
    const lengthInstructions = {
      short: 'in 2-3 sentences',
      medium: 'in 1-2 paragraphs',
      long: 'in 3-4 paragraphs with key details'
    };

    const prompt = `
    Summarize the following content ${lengthInstructions[maxLength]}:
    
    ${content}
    
    Focus on the most important points and key takeaways.
    `;

    const response = await generateCompletion({
      prompt,
      taskType: 'summarization',
      context: 'content_summarization'
    });

    return response?.content || null;
  }, [generateCompletion]);

  return {
    generateCompletion,
    generateProjectSummary,
    enhanceNotes,
    generateRecommendations,
    troubleshootIssue,
    searchInformation,
    generateCode,
    summarizeContent,
    isLoading,
    error
  };
};

// Helper function to enhance context based on task type
function enhanceContextForTask(context: string, taskType: TaskType): string {
  const taskSpecificContext = {
    reasoning: 'You are an expert analyst with deep reasoning capabilities.',
    code_generation: 'You are an expert software engineer with deep knowledge of best practices.',
    analysis: 'You are an expert researcher and analyst with attention to detail.',
    search: 'You are an expert information researcher with access to current data.',
    chat: 'You are a helpful AI assistant.',
    summarization: 'You are an expert at extracting and summarizing key information.',
    creative_writing: 'You are a creative writing expert.',
    project_insights: 'You are an expert NAC deployment consultant with deep knowledge of Portnox solutions.',
    troubleshooting: 'You are an expert network security engineer specializing in NAC troubleshooting.',
    documentation: 'You are an expert technical writer.',
    translation: 'You are an expert translator.',
    data_extraction: 'You are an expert at extracting structured data from unstructured content.'
  };

  const enhancedContext = taskSpecificContext[taskType] || taskSpecificContext.chat;
  
  return context ? `${enhancedContext} ${context}` : enhancedContext;
}