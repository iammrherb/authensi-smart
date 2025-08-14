import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type AIProviderType = 'openai' | 'anthropic' | 'google' | 'perplexity' | 'grok' | 'cohere' | 'mistral';

interface EnhancedAIRequest {
  prompt: string;
  context?: string;
  taskType?: string;
  provider?: AIProviderType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high';
  verbosity?: 'low' | 'medium' | 'high';
  enableFallback?: boolean;
}

interface AIResponse {
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
}

// Provider API call functions
async function callOpenAI(request: EnhancedAIRequest): Promise<AIResponse> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const model = request.model || 'gpt-5-2025-08-07';
  const isGPT5Model = model.startsWith('gpt-5') || model.startsWith('o3') || model.startsWith('o4');
  
  const systemPrompt = `You are an expert network security engineer specializing in 802.1X, NAC, and enterprise network security. You have deep knowledge of Portnox NAC solutions and network infrastructure. Your expertise includes:

- Enterprise 802.1X authentication and authorization
- Network Access Control (NAC) implementations  
- RADIUS server configuration and integration
- Dynamic VLAN assignment and network segmentation
- Security policy enforcement and compliance
- Multi-vendor network equipment configuration
- Troubleshooting network authentication issues
- Industry best practices and security standards

Always provide comprehensive, production-ready configurations that include:
- Complete configuration commands
- Security hardening measures
- Best practices implementation
- Detailed documentation and comments
- Troubleshooting guides
- Implementation procedures
- Validation steps

${request.context ? ` Context: ${request.context}` : ''}`;

  if (isGPT5Model) {
    // Use Responses API for GPT-5 models
    const requestBody: any = {
      model: model,
      input: `${systemPrompt}\n\nUser Query: ${request.prompt}`,
    };

    if (request.maxTokens) {
      requestBody.max_completion_tokens = request.maxTokens;
    }
    
    if (request.reasoningEffort) {
      requestBody.reasoning = { effort: request.reasoningEffort };
    }
    
    if (request.verbosity) {
      requestBody.text = { verbosity: request.verbosity };
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || data.output || '',
      provider: 'openai',
      model: model,
      usage: data.usage ? {
        prompt_tokens: data.usage.prompt_tokens || 0,
        completion_tokens: data.usage.completion_tokens || 0,
        total_tokens: data.usage.total_tokens || 0,
        cost_estimate: calculateOpenAICost(data.usage, model)
      } : undefined
    };
  } else {
    // Use Chat Completions API for legacy models
    const requestBody: any = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt }
      ],
    };

    if (request.temperature !== undefined) {
      requestBody.temperature = request.temperature;
    }
    if (request.maxTokens) {
      requestBody.max_tokens = request.maxTokens;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      provider: 'openai',
      model: model,
      usage: data.usage ? {
        prompt_tokens: data.usage.prompt_tokens || 0,
        completion_tokens: data.usage.completion_tokens || 0,
        total_tokens: data.usage.total_tokens || 0,
        cost_estimate: calculateOpenAICost(data.usage, model)
      } : undefined
    };
  }
}

async function callAnthropic(request: EnhancedAIRequest): Promise<AIResponse> {
  const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
  if (!claudeApiKey) {
    throw new Error('Claude API key not configured');
  }

  const model = request.model || 'claude-opus-4-20250514';
  const systemPrompt = `You are a Portnox NAC (Network Access Control) expert assistant. You help with deployment planning, troubleshooting, best practices, and recommendations. Always provide accurate, actionable advice based on enterprise network security best practices.${request.context ? ` Context: ${request.context}` : ''}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': claudeApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.prompt
        }
      ]
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    provider: 'anthropic',
    model: model,
    usage: data.usage ? {
      prompt_tokens: data.usage.input_tokens || 0,
      completion_tokens: data.usage.output_tokens || 0,
      total_tokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
      cost_estimate: calculateClaudeCost(data.usage, model)
    } : undefined
  };
}

async function callGoogle(request: EnhancedAIRequest): Promise<AIResponse> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const model = request.model || 'gemini-2.0-flash-exp';
  const systemPrompt = `You are a Portnox NAC (Network Access Control) expert assistant. You help with deployment planning, troubleshooting, best practices, and recommendations. Always provide accurate, actionable advice based on enterprise network security best practices.${request.context ? ` Context: ${request.context}` : ''}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUser Query: ${request.prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || 2000,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    provider: 'google',
    model: model,
    usage: data.usageMetadata ? {
      prompt_tokens: data.usageMetadata.promptTokenCount || 0,
      completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
      total_tokens: data.usageMetadata.totalTokenCount || 0,
      cost_estimate: calculateGeminiCost(data.usageMetadata, model)
    } : undefined
  };
}

async function callPerplexity(request: EnhancedAIRequest): Promise<AIResponse> {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!perplexityApiKey) {
    throw new Error('Perplexity API key not configured');
  }

  const model = request.model || 'llama-3.1-sonar-large-128k-online';
  const systemPrompt = `You are a Portnox NAC expert with real-time search capabilities. Provide current, accurate information and recommendations based on the latest data and best practices.${request.context ? ` Context: ${request.context}` : ''}`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: request.prompt
        }
      ],
      temperature: request.temperature || 0.3,
      max_tokens: request.maxTokens || 2000,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      frequency_penalty: 1,
      presence_penalty: 0
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Perplexity API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    provider: 'perplexity',
    model: model,
    usage: data.usage ? {
      prompt_tokens: data.usage.prompt_tokens || 0,
      completion_tokens: data.usage.completion_tokens || 0,
      total_tokens: data.usage.total_tokens || 0,
      cost_estimate: calculatePerplexityCost(data.usage, model)
    } : undefined
  };
}

async function callGrok(request: EnhancedAIRequest): Promise<AIResponse> {
  const grokApiKey = Deno.env.get('GROK_API_KEY');
  if (!grokApiKey) {
    throw new Error('Grok API key not configured');
  }

  const model = request.model || 'grok-2';
  const systemPrompt = `You are a Portnox NAC expert with access to real-time information. Provide current, practical advice with a focus on actionable solutions.${request.context ? ` Context: ${request.context}` : ''}`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${grokApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: request.prompt
        }
      ],
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Grok API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    provider: 'grok',
    model: model,
    usage: data.usage ? {
      prompt_tokens: data.usage.prompt_tokens || 0,
      completion_tokens: data.usage.completion_tokens || 0,
      total_tokens: data.usage.total_tokens || 0,
      cost_estimate: calculateGrokCost(data.usage, model)
    } : undefined
  };
}

// Cost calculation functions
function calculateOpenAICost(usage: any, model: string): number {
  const pricing: { [key: string]: { input: number; output: number } } = {
    'gpt-5-2025-08-07': { input: 0.00003, output: 0.00006 },
    'gpt-5-mini-2025-08-07': { input: 0.00001, output: 0.00002 },
    'o3-2025-04-16': { input: 0.00005, output: 0.0001 },
    'gpt-4.1-2025-04-14': { input: 0.00003, output: 0.00006 },
  };

  const modelPricing = pricing[model] || pricing['gpt-5-2025-08-07'];
  return (usage.prompt_tokens * modelPricing.input) + (usage.completion_tokens * modelPricing.output);
}

function calculateClaudeCost(usage: any, model: string): number {
  const pricing: { [key: string]: { input: number; output: number } } = {
    'claude-opus-4-20250514': { input: 0.000075, output: 0.00015 },
    'claude-sonnet-4-20250514': { input: 0.00003, output: 0.00006 },
    'claude-3-5-haiku-20241022': { input: 0.000008, output: 0.000024 },
  };

  const modelPricing = pricing[model] || pricing['claude-opus-4-20250514'];
  return (usage.input_tokens * modelPricing.input) + (usage.output_tokens * modelPricing.output);
}

function calculateGeminiCost(usage: any, model: string): number {
  const pricing: { [key: string]: { input: number; output: number } } = {
    'gemini-2.0-flash-exp': { input: 0.000075, output: 0.0003 },
    'gemini-1.5-pro': { input: 0.0035, output: 0.0105 },
  };

  const modelPricing = pricing[model] || pricing['gemini-2.0-flash-exp'];
  return (usage.promptTokenCount * modelPricing.input) + (usage.candidatesTokenCount * modelPricing.output);
}

function calculatePerplexityCost(usage: any, model: string): number {
  const pricing: { [key: string]: number } = {
    'llama-3.1-sonar-large-128k-online': 0.001,
    'llama-3.1-sonar-small-128k-online': 0.0002,
  };

  const modelPricing = pricing[model] || pricing['llama-3.1-sonar-large-128k-online'];
  return usage.total_tokens * modelPricing;
}

function calculateGrokCost(usage: any, model: string): number {
  const pricing: { [key: string]: number } = {
    'grok-2': 0.002,
  };

  const modelPricing = pricing[model] || pricing['grok-2'];
  return usage.total_tokens * modelPricing;
}

// Provider routing with fallback
async function callAIProvider(request: EnhancedAIRequest): Promise<AIResponse> {
  const provider = request.provider || 'openai';
  
  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(request);
      case 'anthropic':
        return await callAnthropic(request);
      case 'google':
        return await callGoogle(request);
      case 'perplexity':
        return await callPerplexity(request);
      case 'grok':
        return await callGrok(request);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Primary provider ${provider} failed:`, error);
    
    // Try fallback if enabled
    if (request.enableFallback) {
      const fallbackProviders: AIProviderType[] = ['openai', 'anthropic', 'google'];
      const availableFallbacks = fallbackProviders.filter(p => p !== provider);
      
      for (const fallbackProvider of availableFallbacks) {
        try {
          console.log(`Trying fallback provider: ${fallbackProvider}`);
          const fallbackRequest = { ...request, provider: fallbackProvider };
          const result = await callAIProvider({ ...fallbackRequest, enableFallback: false });
          return { ...result, fallbackUsed: true };
        } catch (fallbackError) {
          console.error(`Fallback provider ${fallbackProvider} failed:`, fallbackError);
          continue;
        }
      }
    }
    
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: EnhancedAIRequest = await req.json();

    if (!request.prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`AI request - Provider: ${request.provider || 'auto'}, Task: ${request.taskType || 'general'}`);

    const result = await callAIProvider(request);

    console.log(`AI response - Provider: ${result.provider}, Model: ${result.model}, Fallback: ${result.fallbackUsed || false}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced AI completion error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});