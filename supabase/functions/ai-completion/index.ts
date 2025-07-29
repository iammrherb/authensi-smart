import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  prompt: string;
  context?: string;
  provider?: 'openai' | 'claude' | 'gemini';
  temperature?: number;
  maxTokens?: number;
}

async function callOpenAI(request: AIRequest) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: `You are a Portnox NAC (Network Access Control) expert assistant. You help with deployment planning, troubleshooting, best practices, and recommendations. Always provide accurate, actionable advice based on enterprise network security best practices.${request.context ? ` Context: ${request.context}` : ''}`
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
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    provider: 'openai' as const,
    usage: data.usage
  };
}

async function callClaude(request: AIRequest) {
  const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
  if (!claudeApiKey) {
    throw new Error('Claude API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': claudeApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-20250514',
      max_tokens: request.maxTokens || 2000,
      temperature: request.temperature || 0.7,
      system: `You are a Portnox NAC (Network Access Control) expert assistant. You help with deployment planning, troubleshooting, best practices, and recommendations. Always provide accurate, actionable advice based on enterprise network security best practices.${request.context ? ` Context: ${request.context}` : ''}`,
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
    provider: 'claude' as const,
    usage: data.usage
  };
}

async function callGemini(request: AIRequest) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a Portnox NAC (Network Access Control) expert assistant. You help with deployment planning, troubleshooting, best practices, and recommendations. Always provide accurate, actionable advice based on enterprise network security best practices.${request.context ? ` Context: ${request.context}` : ''}\n\nUser Query: ${request.prompt}`
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
    provider: 'gemini' as const,
    usage: {
      prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      total_tokens: data.usageMetadata?.totalTokenCount || 0
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: AIRequest = await req.json();

    if (!request.prompt) {
      throw new Error('Prompt is required');
    }

    let result;
    
    switch (request.provider || 'openai') {
      case 'openai':
        result = await callOpenAI(request);
        break;
      case 'claude':
        result = await callClaude(request);
        break;
      case 'gemini':
        result = await callGemini(request);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${request.provider}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI completion error:', error);
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