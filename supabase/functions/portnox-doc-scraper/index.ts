import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vendors } = await req.json();
    console.log('Scraping Portnox documentation for vendors:', vendors);

    const documentationLinks: Record<string, string[]> = {};

    // Portnox documentation structure mapping
    const portnoxDocCategories = {
      'cisco': [
        'https://docs.portnox.com/integrations/network-devices/cisco-switches',
        'https://docs.portnox.com/integrations/network-devices/cisco-wireless',
        'https://docs.portnox.com/integrations/network-devices/cisco-ise-integration'
      ],
      'aruba': [
        'https://docs.portnox.com/integrations/network-devices/aruba-switches',
        'https://docs.portnox.com/integrations/network-devices/aruba-wireless',
        'https://docs.portnox.com/integrations/wireless/aruba-clearpass'
      ],
      'juniper': [
        'https://docs.portnox.com/integrations/network-devices/juniper-switches',
        'https://docs.portnox.com/integrations/network-devices/juniper-mist',
        'https://docs.portnox.com/integrations/security/juniper-srx'
      ],
      'fortinet': [
        'https://docs.portnox.com/integrations/security/fortigate-firewall',
        'https://docs.portnox.com/integrations/network-devices/fortinet-switches',
        'https://docs.portnox.com/integrations/wireless/fortinet-wireless'
      ],
      'palo alto': [
        'https://docs.portnox.com/integrations/security/palo-alto-firewall',
        'https://docs.portnox.com/integrations/security/panorama-integration',
        'https://docs.portnox.com/integrations/threat-intelligence/palo-alto'
      ],
      'microsoft': [
        'https://docs.portnox.com/integrations/identity/azure-ad',
        'https://docs.portnox.com/integrations/identity/active-directory',
        'https://docs.portnox.com/integrations/mdm/microsoft-intune',
        'https://docs.portnox.com/integrations/security/microsoft-defender'
      ],
      'vmware': [
        'https://docs.portnox.com/integrations/virtualization/vmware-nsx',
        'https://docs.portnox.com/integrations/identity/workspace-one',
        'https://docs.portnox.com/integrations/mdm/airwatch-integration'
      ],
      'splunk': [
        'https://docs.portnox.com/integrations/siem/splunk-integration',
        'https://docs.portnox.com/integrations/analytics/splunk-dashboards',
        'https://docs.portnox.com/integrations/logging/splunk-forwarder'
      ],
      'okta': [
        'https://docs.portnox.com/integrations/identity/okta-saml',
        'https://docs.portnox.com/integrations/identity/okta-provisioning',
        'https://docs.portnox.com/integrations/mfa/okta-verify'
      ]
    };

    // General Portnox documentation categories
    const generalDocumentation = [
      'https://docs.portnox.com/deployment/prerequisites',
      'https://docs.portnox.com/deployment/network-requirements',
      'https://docs.portnox.com/deployment/firewall-requirements',
      'https://docs.portnox.com/authentication/radius-configuration',
      'https://docs.portnox.com/authentication/tacacs-setup',
      'https://docs.portnox.com/integrations/active-directory-broker',
      'https://docs.portnox.com/agents/deployment-guide',
      'https://docs.portnox.com/agentless/configuration',
      'https://docs.portnox.com/troubleshooting/common-issues',
      'https://docs.portnox.com/best-practices/deployment',
      'https://docs.portnox.com/best-practices/performance-tuning'
    ];

    for (const vendor of vendors) {
      const vendorKey = vendor.toLowerCase();
      const matchedLinks: string[] = [];

      // Check for exact vendor matches
      if (portnoxDocCategories[vendorKey]) {
        matchedLinks.push(...portnoxDocCategories[vendorKey]);
      }

      // Check for partial matches
      Object.keys(portnoxDocCategories).forEach(key => {
        if (vendorKey.includes(key) || key.includes(vendorKey)) {
          matchedLinks.push(...portnoxDocCategories[key]);
        }
      });

      // Add general documentation for all vendors
      matchedLinks.push(...generalDocumentation);

      // Simulate fetching additional documentation based on vendor type
      const additionalDocs = await generateAdditionalDocumentationLinks(vendor);
      matchedLinks.push(...additionalDocs);

      documentationLinks[vendor] = [...new Set(matchedLinks)]; // Remove duplicates
    }

    return new Response(JSON.stringify({ 
      documentationLinks,
      timestamp: new Date().toISOString(),
      source: 'portnox-docs'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in portnox-doc-scraper:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateAdditionalDocumentationLinks(vendor: string): Promise<string[]> {
  const links: string[] = [];
  
  // Generate context-specific documentation based on vendor name
  const vendorLower = vendor.toLowerCase();
  
  if (vendorLower.includes('switch') || vendorLower.includes('cisco') || vendorLower.includes('aruba')) {
    links.push(
      'https://docs.portnox.com/network-devices/802.1x-configuration',
      'https://docs.portnox.com/network-devices/vlan-assignment',
      'https://docs.portnox.com/network-devices/port-security'
    );
  }
  
  if (vendorLower.includes('wireless') || vendorLower.includes('ap') || vendorLower.includes('wifi')) {
    links.push(
      'https://docs.portnox.com/wireless/wpa-enterprise',
      'https://docs.portnox.com/wireless/guest-access',
      'https://docs.portnox.com/wireless/byod-configuration'
    );
  }
  
  if (vendorLower.includes('firewall') || vendorLower.includes('palo') || vendorLower.includes('fortinet')) {
    links.push(
      'https://docs.portnox.com/security/firewall-integration',
      'https://docs.portnox.com/security/threat-intelligence',
      'https://docs.portnox.com/security/policy-enforcement'
    );
  }
  
  if (vendorLower.includes('microsoft') || vendorLower.includes('azure') || vendorLower.includes('ad')) {
    links.push(
      'https://docs.portnox.com/identity/azure-integration',
      'https://docs.portnox.com/identity/ldap-configuration',
      'https://docs.portnox.com/identity/group-policies'
    );
  }
  
  return links;
}