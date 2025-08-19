import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AIProvider = 'openai' | 'claude' | 'gemini';

export interface AIRequest {
  prompt: string;
  context?: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
  model?: string;
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
      console.log('Starting AI completion request:', { provider: request.provider, model: request.model });
      
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-completion', {
        body: request
      });

      console.log('Supabase function response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(`AI service error: ${supabaseError.message || 'Service unavailable'}`);
      }

      if (!data) {
        console.error('No data returned from AI service');
        throw new Error('No response from AI service');
      }

      if (data.error) {
        console.error('AI service returned error:', data.error);
        throw new Error(`AI API error: ${data.error}`);
      }

      console.log('AI completion successful');
      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('AI completion error details:', {
        error: err,
        message: errorMessage,
        request: { ...request, prompt: request.prompt.substring(0, 100) + '...' }
      });
      
      setError(errorMessage);
      
      // Return null to indicate failure, let components handle gracefully
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateProjectSummary = useCallback(async (projectData: any): Promise<string | null> => {
    const prompt = `
# PROJECT SUMMARY GENERATION REQUEST

## PROJECT DETAILS
- **Project Name:** ${projectData.name}
- **Client:** ${projectData.client_name}
- **Industry:** ${projectData.industry}
- **Deployment Type:** ${projectData.deployment_type}
- **Security Level:** ${projectData.security_level}
- **Total Sites:** ${projectData.total_sites}
- **Total Endpoints:** ${projectData.total_endpoints}

## REQUIRED OUTPUT FORMAT

Please provide a comprehensive business summary using the following structured format with proper markdown:

### Executive Summary
Provide a high-level overview of the project scope, objectives, and strategic importance.

### Key Objectives & Success Criteria
\`\`\`
Primary Objectives:
- Objective 1
- Objective 2
- Objective 3

Success Metrics:
- Metric 1: Target value
- Metric 2: Target value
- Metric 3: Target value
\`\`\`

### Technical Requirements Overview
**Core Requirements:**
- Network Access Control implementation
- Authentication mechanisms
- Security policies and compliance

**Infrastructure Scope:**
- Sites: ${projectData.total_sites}
- Endpoints: ${projectData.total_endpoints}
- Security Level: ${projectData.security_level}

### Implementation Timeline Recommendations
\`\`\`
Phase 1: Planning & Design (Weeks 1-2)
Phase 2: Infrastructure Preparation (Weeks 3-4)
Phase 3: Deployment & Testing (Weeks 5-8)
Phase 4: Go-Live & Optimization (Weeks 9-10)
\`\`\`

### Risk Assessment & Mitigation Strategies
**High Priority Risks:**
- Risk 1: Description and mitigation
- Risk 2: Description and mitigation

**Medium Priority Risks:**
- Risk 3: Description and mitigation
- Risk 4: Description and mitigation

Use professional formatting with headers, bullet points, and code blocks where appropriate.
    `;

    const response = await generateCompletion({
      prompt,
      context: 'project_summary',
      provider: 'openai',
      model: 'gpt-4o-mini', // Use stable legacy model for now
      temperature: 0.7,
      maxTokens: 2000
    });

    return response?.content || null;
  }, [generateCompletion]);

  const enhanceNotes = useCallback(async (notes: string, context: string): Promise<string | null> => {
    const prompt = `
# NOTE ENHANCEMENT REQUEST

## CONTEXT
${context}

## ORIGINAL NOTES
\`\`\`
${notes}
\`\`\`

## ENHANCEMENT REQUIREMENTS

Please enhance and organize these notes using professional formatting with the following structure:

### Summary
Brief overview of the key points covered in the notes.

### Key Findings
\`\`\`
- Finding 1: Details and implications
- Finding 2: Details and implications
- Finding 3: Details and implications
\`\`\`

### Technical Details
Organize technical information into clear sections with:
- **Configuration Details**
- **Network Requirements**
- **Security Considerations**

### Action Items
**High Priority:**
- [ ] Action item 1 with deadline
- [ ] Action item 2 with deadline

**Medium Priority:**
- [ ] Action item 3 with deadline
- [ ] Action item 4 with deadline

### Recommendations
Professional recommendations with technical reasoning and business impact.

### Next Steps
Clear next steps with timelines and responsible parties.

Ensure professional tone, proper grammar, and technical accuracy throughout.
    `;

    const response = await generateCompletion({
      prompt,
      context: 'note_enhancement',
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1500
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
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000
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
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2000
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