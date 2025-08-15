import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SaveProviderRequest {
  provider: 'openai' | 'anthropic' | 'google' | 'perplexity' | 'grok' | 'cohere' | 'mistral' | 'claude' | 'gemini';
  apiKey: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to save AI provider');
    const { provider, apiKey }: SaveProviderRequest = await req.json();
    console.log(`Request details: provider=${provider}, apiKeyLength=${apiKey?.length || 0}`);

    if (!provider || !apiKey) {
      throw new Error('Provider and API key are required');
    }

    // Map provider names to environment variable names
    const secretNames: { [key: string]: string } = {
      'openai': 'OPENAI_API_KEY',
      'anthropic': 'CLAUDE_API_KEY',
      'claude': 'CLAUDE_API_KEY',
      'google': 'GEMINI_API_KEY',
      'gemini': 'GEMINI_API_KEY',
      'perplexity': 'PERPLEXITY_API_KEY',
      'grok': 'GROK_API_KEY',
      'cohere': 'COHERE_API_KEY',
      'mistral': 'MISTRAL_API_KEY'
    };

    const secretName = secretNames[provider];
    if (!secretName) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    // Get the Supabase URL and Service Role Key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from the JWT token
    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authToken) {
      throw new Error('No authorization token provided');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Invalid or expired token');
    }
    console.log(`Authenticated user: ${user.id}`);

    // Simple encryption (base64 encoding for demo - use proper encryption in production)
    const encryptedApiKey = btoa(apiKey);

    // Save the API key securely in the database
    const { error: dbError } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: user.id,
        provider_name: provider,
        encrypted_api_key: encryptedApiKey
      }, {
        onConflict: 'user_id,provider_name'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save API key to database: ${dbError.message}`);
    }

    console.log(`Successfully stored API key for provider: ${provider} for user: ${user.id}`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${provider} API key saved successfully`,
        provider: provider
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Save AI provider error:', error);
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