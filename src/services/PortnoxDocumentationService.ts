import { supabase } from '@/integrations/supabase/client';

export interface PortnoxDocumentationResult {
  vendorSpecificDocs: VendorDocumentation[];
  generalRequirements: PortnoxRequirement[];
  deploymentGuide: DeploymentSection[];
  integrationSpecs: IntegrationSpecification[];
}

export interface VendorDocumentation {
  vendorName: string;
  vendorType: string;
  documentationLinks: string[];
  configurationRequirements: string[];
  integrationMethods: string[];
  firmwareRequirements: string;
  knownLimitations: string[];
  portnoxCompatibility: CompatibilityInfo;
  supportLevel: 'full' | 'partial' | 'limited' | 'none';
  recommendedModels: string[];
}

export interface PortnoxRequirement {
  category: 'network' | 'firewall' | 'authentication' | 'integration' | 'agent' | 'radius' | 'tacacs';
  title: string;
  description: string;
  requirements: string[];
  portnoxFeatures: string[];
  documentationLinks: string[];
}

export interface DeploymentSection {
  phase: string;
  title: string;
  description: string;
  prerequisites: string[];
  steps: DeploymentStep[];
  validationCriteria: string[];
  troubleshooting: TroubleshootingItem[];
}

export interface DeploymentStep {
  order: number;
  title: string;
  description: string;
  portnoxComponents: string[];
  vendorSpecific: boolean;
  estimatedTime: string;
  documentation: string[];
}

export interface IntegrationSpecification {
  type: 'MDM' | 'IDP' | 'SIEM' | 'RADIUS' | 'AD_BROKER' | 'TACACS' | 'FIREWALL' | 'OTHER';
  name: string;
  description: string;
  portnoxIntegration: string[];
  configurationSteps: string[];
  requiredPorts: number[];
  supportedVendors: string[];
  documentationLinks: string[];
  agentRequired: boolean;
  agentlessOptions: string[];
}

export interface CompatibilityInfo {
  supportLevel: 'certified' | 'compatible' | 'limited' | 'unsupported';
  testedVersions: string[];
  lastTested: string;
  limitations: string[];
  recommendedSettings: Record<string, any>;
}

export interface TroubleshootingItem {
  issue: string;
  symptoms: string[];
  resolution: string[];
  portnoxLogs: string[];
  vendorCommands: string[];
}

export class PortnoxDocumentationService {
  private static readonly PORTNOX_DOCS_BASE = 'https://docs.portnox.com';
  private static readonly AI_API_ENDPOINT = 'ai-documentation-generator';

  static async generateComprehensiveDocumentation(
    scopingData: any,
    selectedVendors: any[],
    selectedUseCases: any[],
    selectedRequirements: any[]
  ): Promise<PortnoxDocumentationResult> {
    try {
      // Call AI edge function to generate comprehensive documentation
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          scopingData,
          vendors: selectedVendors,
          useCases: selectedUseCases,
          requirements: selectedRequirements,
          documentationType: 'comprehensive'
        }
      });

      if (error) throw error;

      return data as PortnoxDocumentationResult;
    } catch (error) {
      console.error('Failed to generate documentation:', error);
      throw new Error('Failed to generate Portnox documentation');
    }
  }

  static async scrapePortnoxDocumentation(vendorNames: string[]): Promise<Record<string, string[]>> {
    try {
      const { data, error } = await supabase.functions.invoke('portnox-doc-scraper', {
        body: { vendors: vendorNames }
      });

      if (error) throw error;
      return data.documentationLinks || {};
    } catch (error) {
      console.error('Failed to scrape Portnox documentation:', error);
      return {};
    }
  }

  static async generateVendorSpecificGuide(vendor: any, deploymentContext: any): Promise<VendorDocumentation> {
    try {
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          vendor,
          deploymentContext,
          documentationType: 'vendor-specific'
        }
      });

      if (error) throw error;
      return data as VendorDocumentation;
    } catch (error) {
      console.error('Failed to generate vendor-specific guide:', error);
      throw new Error(`Failed to generate documentation for ${vendor.vendor_name}`);
    }
  }

  static async generateIntegrationSpecs(integrationType: string, vendors: any[]): Promise<IntegrationSpecification[]> {
    const integrationPrompts = {
      MDM: 'Mobile Device Management integration requirements and configuration',
      IDP: 'Identity Provider integration specifications and SAML/OIDC configuration',
      SIEM: 'Security Information and Event Management integration and log forwarding',
      RADIUS: 'RADIUS server configuration and authentication workflows',
      AD_BROKER: 'Active Directory broker configuration and domain integration',
      TACACS: 'TACACS+ server integration and command authorization',
      FIREWALL: 'Firewall integration for policy enforcement and threat intelligence'
    };

    try {
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          integrationType,
          vendors,
          prompt: integrationPrompts[integrationType as keyof typeof integrationPrompts],
          documentationType: 'integration'
        }
      });

      if (error) throw error;
      return data as IntegrationSpecification[];
    } catch (error) {
      console.error(`Failed to generate ${integrationType} integration specs:`, error);
      return [];
    }
  }

  static async generateAgentVsAgentlessGuidance(
    networkTopology: string,
    deviceTypes: string[],
    securityRequirements: string[]
  ): Promise<{
    recommendation: 'agent' | 'agentless' | 'hybrid';
    agentBenefits: string[];
    agentlessBenefits: string[];
    hybridApproach: string[];
    implementationGuide: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          networkTopology,
          deviceTypes,
          securityRequirements,
          documentationType: 'agent-guidance'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to generate agent guidance:', error);
      return {
        recommendation: 'hybrid',
        agentBenefits: ['Enhanced visibility', 'Real-time monitoring'],
        agentlessBenefits: ['Reduced management overhead', 'Better for IoT devices'],
        hybridApproach: ['Use agents for managed devices', 'Agentless for IoT and guest devices'],
        implementationGuide: ['Assess device capabilities', 'Define deployment strategy']
      };
    }
  }

  static async generateFirewallRequirements(
    selectedVendors: any[],
    networkArchitecture: any
  ): Promise<{
    requiredPorts: { port: number; protocol: string; direction: string; purpose: string }[];
    firewallRules: string[];
    vendorSpecificRequirements: Record<string, string[]>;
    securityConsiderations: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          vendors: selectedVendors,
          networkArchitecture,
          documentationType: 'firewall-requirements'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to generate firewall requirements:', error);
      return {
        requiredPorts: [],
        firewallRules: [],
        vendorSpecificRequirements: {},
        securityConsiderations: []
      };
    }
  }

  static async enrichVendorWithDocumentation(vendor: any): Promise<any> {
    try {
      // Search for related documentation from Portnox knowledge base
      const portnoxDocs = await this.scrapePortnoxDocumentation([vendor.vendor_name]);
      
      // Generate AI-enhanced documentation suggestions
      const { data, error } = await supabase.functions.invoke(this.AI_API_ENDPOINT, {
        body: {
          vendor,
          documentationType: 'vendor-enrichment'
        }
      });

      if (error) throw error;

      return {
        ...vendor,
        documentation_links: [
          ...(vendor.documentation_links || []),
          ...(portnoxDocs[vendor.vendor_name] || [])
        ],
        ai_enhanced_docs: data.enhancedDocumentation || [],
        portnox_integration_guide: data.integrationGuide || [],
        configuration_examples: data.configurationExamples || []
      };
    } catch (error) {
      console.error('Failed to enrich vendor documentation:', error);
      return vendor;
    }
  }

  static getPortnoxDocumentationCategories() {
    return {
      'Network Vendors': [
        'Switch Configuration',
        'Wireless AP Integration',
        'Router NAC Enforcement',
        'VLAN Configuration',
        'Port Configuration'
      ],
      'Firewall Integration': [
        'Policy Enforcement',
        'Threat Intelligence',
        'Access Control',
        'VPN Integration',
        'SSL Inspection'
      ],
      'Identity Providers': [
        'SAML Configuration',
        'OIDC Integration',
        'LDAP Setup',
        'Multi-Factor Authentication',
        'User Provisioning'
      ],
      'SIEM Integration': [
        'Log Forwarding',
        'Event Correlation',
        'Threat Detection',
        'Compliance Reporting',
        'Alert Management'
      ],
      'MDM Integration': [
        'Device Compliance',
        'Certificate Management',
        'Policy Enforcement',
        'Mobile Threat Defense',
        'App Protection'
      ],
      'RADIUS & TACACS': [
        'Authentication Workflows',
        'Authorization Policies',
        'Accounting Configuration',
        'Failover Setup',
        'Certificate-based Auth'
      ]
    };
  }
}