import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      scopingData, 
      vendors, 
      useCases, 
      requirements, 
      documentationType,
      vendor,
      deploymentContext,
      integrationType,
      prompt,
      networkTopology,
      deviceTypes,
      securityRequirements,
      networkArchitecture
    } = await req.json();

    console.log('Generating documentation for type:', documentationType);

    let aiPrompt = '';
    let systemContext = `You are a Portnox NAC (Network Access Control) expert specializing in deployment documentation, vendor integrations, and comprehensive prerequisite generation. You have deep knowledge of network security, authentication protocols, and enterprise infrastructure.`;

    switch (documentationType) {
      case 'comprehensive':
        aiPrompt = generateComprehensivePrompt(scopingData, vendors, useCases, requirements);
        break;
      case 'vendor-specific':
        aiPrompt = generateVendorSpecificPrompt(vendor, deploymentContext);
        break;
      case 'integration':
        aiPrompt = generateIntegrationPrompt(integrationType, vendors, prompt);
        break;
      case 'agent-guidance':
        aiPrompt = generateAgentGuidancePrompt(networkTopology, deviceTypes, securityRequirements);
        break;
      case 'firewall-requirements':
        aiPrompt = generateFirewallRequirementsPrompt(vendors, networkArchitecture);
        break;
      case 'vendor-enrichment':
        aiPrompt = generateVendorEnrichmentPrompt(vendor);
        break;
      default:
        throw new Error('Invalid documentation type');
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
          { role: 'system', content: systemContext },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response based on documentation type
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (error) {
      // If JSON parsing fails, return structured text
      result = { content: aiResponse, type: documentationType };
    }

    // Save generated documentation to database for future reference
    await saveDocumentationToDatabase(documentationType, result, scopingData?.organization?.name || 'Unknown');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-documentation-generator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateComprehensivePrompt(scopingData: any, vendors: any[], useCases: any[], requirements: any[]): string {
  return `Generate a comprehensive Portnox NAC deployment and prerequisites document based on the following scoping data:

ORGANIZATION PROFILE:
${JSON.stringify(scopingData.organization, null, 2)}

NETWORK INFRASTRUCTURE:
${JSON.stringify(scopingData.network_infrastructure, null, 2)}

SELECTED VENDORS:
${vendors.map(v => `- ${v.vendor_name} (${v.vendor_type}): ${v.supported_protocols?.join(', ')}`).join('\n')}

SELECTED USE CASES:
${useCases.map(uc => `- ${uc.name}: ${uc.description}`).join('\n')}

REQUIREMENTS:
${requirements.map(req => `- ${req.title}: ${req.description}`).join('\n')}

Please generate a detailed response in JSON format with the following structure:
{
  "vendorSpecificDocs": [
    {
      "vendorName": "string",
      "vendorType": "string", 
      "documentationLinks": ["string"],
      "configurationRequirements": ["string"],
      "integrationMethods": ["string"],
      "firmwareRequirements": "string",
      "knownLimitations": ["string"],
      "portnoxCompatibility": {
        "supportLevel": "certified|compatible|limited|unsupported",
        "testedVersions": ["string"],
        "lastTested": "string",
        "limitations": ["string"],
        "recommendedSettings": {}
      },
      "supportLevel": "full|partial|limited|none",
      "recommendedModels": ["string"]
    }
  ],
  "generalRequirements": [
    {
      "category": "network|firewall|authentication|integration|agent|radius|tacacs",
      "title": "string",
      "description": "string", 
      "requirements": ["string"],
      "portnoxFeatures": ["string"],
      "documentationLinks": ["string"]
    }
  ],
  "deploymentGuide": [
    {
      "phase": "string",
      "title": "string",
      "description": "string",
      "prerequisites": ["string"],
      "steps": [
        {
          "order": 1,
          "title": "string",
          "description": "string",
          "portnoxComponents": ["string"],
          "vendorSpecific": true,
          "estimatedTime": "string",
          "documentation": ["string"]
        }
      ],
      "validationCriteria": ["string"],
      "troubleshooting": [
        {
          "issue": "string",
          "symptoms": ["string"],
          "resolution": ["string"],
          "portnoxLogs": ["string"],
          "vendorCommands": ["string"]
        }
      ]
    }
  ],
  "integrationSpecs": [
    {
      "type": "MDM|IDP|SIEM|RADIUS|AD_BROKER|TACACS|FIREWALL|OTHER",
      "name": "string",
      "description": "string",
      "portnoxIntegration": ["string"],
      "configurationSteps": ["string"],
      "requiredPorts": [443, 1812, 1813],
      "supportedVendors": ["string"],
      "documentationLinks": ["string"],
      "agentRequired": false,
      "agentlessOptions": ["string"]
    }
  ]
}

Focus on:
1. Portnox-specific configuration requirements for each vendor
2. Network prerequisites and firewall rules
3. Authentication workflows and integration points
4. Agent vs agentless deployment recommendations
5. RADIUS, TACACS+, and AD broker configurations
6. MDM, IDP, and SIEM integration specifications
7. Specific documentation links from docs.portnox.com when available
8. Troubleshooting guides for common issues
9. Performance and scalability considerations
10. Compliance requirements based on selected frameworks`;
}

function generateVendorSpecificPrompt(vendor: any, deploymentContext: any): string {
  return `Generate detailed Portnox NAC integration documentation for vendor: ${vendor.vendor_name}

VENDOR DETAILS:
${JSON.stringify(vendor, null, 2)}

DEPLOYMENT CONTEXT:
${JSON.stringify(deploymentContext, null, 2)}

Generate a comprehensive vendor-specific guide in JSON format focusing on:
1. Portnox integration methods and compatibility
2. Required firmware versions and limitations
3. Configuration examples and templates
4. Troubleshooting common issues
5. Performance optimization recommendations
6. Security considerations and best practices

Return as VendorDocumentation JSON object.`;
}

function generateIntegrationPrompt(integrationType: string, vendors: any[], prompt: string): string {
  return `Generate detailed integration specifications for ${integrationType} with Portnox NAC.

INTEGRATION TYPE: ${integrationType}
CONTEXT: ${prompt}
RELEVANT VENDORS: ${vendors.map(v => v.vendor_name).join(', ')}

Focus on:
1. Portnox configuration requirements
2. Required ports and protocols
3. Authentication flows and methods
4. Agent vs agentless considerations
5. Vendor-specific configuration steps
6. Common troubleshooting scenarios
7. Performance and scalability factors

Return as array of IntegrationSpecification JSON objects.`;
}

function generateAgentGuidancePrompt(networkTopology: string, deviceTypes: string[], securityRequirements: string[]): string {
  return `Provide agent vs agentless deployment guidance for Portnox NAC based on:

NETWORK TOPOLOGY: ${networkTopology}
DEVICE TYPES: ${deviceTypes.join(', ')}
SECURITY REQUIREMENTS: ${securityRequirements.join(', ')}

Generate recommendations covering:
1. Agent deployment benefits and use cases
2. Agentless deployment advantages
3. Hybrid approach strategies
4. Implementation guidelines
5. Device-specific considerations
6. Security and compliance implications

Return structured JSON with recommendation, benefits, and implementation guide.`;
}

function generateFirewallRequirementsPrompt(vendors: any[], networkArchitecture: any): string {
  return `Generate comprehensive firewall requirements for Portnox NAC deployment with vendors: ${vendors.map(v => v.vendor_name).join(', ')}

NETWORK ARCHITECTURE: ${JSON.stringify(networkArchitecture, null, 2)}

Include:
1. Required ports and protocols for Portnox components
2. Vendor-specific firewall rules
3. Traffic flow requirements
4. Security considerations
5. High availability and redundancy requirements

Return structured JSON with ports, rules, and vendor-specific requirements.`;
}

function generateVendorEnrichmentPrompt(vendor: any): string {
  return `Enhance the documentation for vendor: ${vendor.vendor_name} with Portnox NAC integration details.

CURRENT VENDOR DATA: ${JSON.stringify(vendor, null, 2)}

Generate enhanced documentation including:
1. Detailed integration guides
2. Configuration examples
3. Best practices
4. Common issues and solutions
5. Performance tuning recommendations
6. Compatibility matrices

Return JSON with enhancedDocumentation, integrationGuide, and configurationExamples.`;
}

async function saveDocumentationToDatabase(type: string, content: any, projectName: string) {
  try {
    await supabase.from('ai_optimization_history').insert({
      optimization_type: `documentation_${type}`,
      original_config: projectName,
      optimized_config: JSON.stringify(content),
      changes_summary: { type, generated_at: new Date().toISOString() },
      optimization_score_after: 95 // High score for documentation generation
    });
  } catch (error) {
    console.error('Failed to save documentation to database:', error);
  }
}