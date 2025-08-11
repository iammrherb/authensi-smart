
import { supabase } from "@/integrations/supabase/client";
import { PortnoxApiService } from "./PortnoxApiService";
import { Database } from "@/integrations/supabase/types";

export interface ProjectCreationOptions {
  method: 'ai-scoping' | 'template-based' | 'manual';
  templateId?: string;
  enablePortnoxIntegration?: boolean;
  enableAutomations?: boolean;
  resourceLibraryIntegration?: boolean;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  scenario: string;
  complexity: 'Low' | 'Medium' | 'High';
  estimatedDuration: string;
  recommendedTeamSize: number;
  keyFeatures: string[];
  complianceFrameworks: string[];
  painPoints: Array<{ title: string; description: string }>;
  successCriteria: string[];
  integrationRequirements: string[];
  defaultSites: number;
  defaultEndpoints: number;
  portnoxConfigs?: {
    enabledFeatures: string[];
    recommendedPolicies: string[];
    nasTemplates: any[];
    deviceProfiles: any[];
  };
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'healthcare-hipaa-large',
    name: 'Healthcare HIPAA Compliance - Large Hospital',
    description: 'Comprehensive NAC deployment for large healthcare facility with strict HIPAA compliance',
    industry: 'Healthcare',
    scenario: 'Multi-building hospital campus with diverse medical devices',
    complexity: 'High',
    estimatedDuration: '6-9 months',
    recommendedTeamSize: 8,
    keyFeatures: ['Medical Device Isolation', 'HIPAA Compliance', 'Guest Network', 'IoT Device Management'],
    complianceFrameworks: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
    painPoints: [
      { title: 'Medical Device Security', description: 'Legacy medical devices with weak security' },
      { title: 'HIPAA Compliance', description: 'Ensuring patient data protection across network' },
      { title: 'Guest Access Management', description: 'Secure visitor and contractor access' }
    ],
    successCriteria: [
      'Zero unauthorized access to patient data networks',
      'Complete medical device inventory and classification',
      '100% compliance with HIPAA audit requirements'
    ],
    integrationRequirements: ['Epic EMR', 'Philips IntelliVue', 'GE Healthcare devices'],
    defaultSites: 5,
    defaultEndpoints: 2500,
    portnoxConfigs: {
      enabledFeatures: ['Device Profiling', 'Medical Device Isolation', 'Guest Portal'],
      recommendedPolicies: ['Medical Device Policy', 'HIPAA Compliance Policy', 'Guest Access Policy'],
      nasTemplates: [
        { name: 'Medical Switches', type: 'cisco', location: 'patient_floors' },
        { name: 'Guest WiFi Controllers', type: 'aruba', location: 'public_areas' }
      ],
      deviceProfiles: [
        { category: 'Medical Devices', isolation: true, vlan: 'medical' },
        { category: 'Administrative', isolation: false, vlan: 'admin' }
      ]
    }
  },
  {
    id: 'financial-pci-dss',
    name: 'Financial Services PCI DSS Compliance',
    description: 'NAC deployment for financial institution with PCI DSS requirements',
    industry: 'Financial Services',
    scenario: 'Multi-branch bank with ATM and payment processing',
    complexity: 'High',
    estimatedDuration: '4-6 months',
    recommendedTeamSize: 6,
    keyFeatures: ['PCI DSS Compliance', 'ATM Isolation', 'Payment Device Security', 'Branch Network Segmentation'],
    complianceFrameworks: ['PCI DSS', 'SOX', 'FFIEC'],
    painPoints: [
      { title: 'Payment Device Security', description: 'Securing payment terminals and ATMs' },
      { title: 'Network Segmentation', description: 'Isolating cardholder data environment' },
      { title: 'Compliance Reporting', description: 'Automated compliance documentation' }
    ],
    successCriteria: [
      'PCI DSS Level 1 compliance certification',
      'Zero payment device security incidents',
      'Complete network segmentation of CDE'
    ],
    integrationRequirements: ['NCR ATMs', 'Verifone Terminals', 'Core Banking System'],
    defaultSites: 12,
    defaultEndpoints: 800,
    portnoxConfigs: {
      enabledFeatures: ['Network Segmentation', 'Device Compliance', 'Threat Detection'],
      recommendedPolicies: ['PCI DSS Policy', 'ATM Security Policy', 'Payment Device Policy'],
      nasTemplates: [
        { name: 'Branch Switches', type: 'cisco', location: 'branches' },
        { name: 'ATM Network', type: 'juniper', location: 'atm_locations' }
      ],
      deviceProfiles: [
        { category: 'Payment Devices', isolation: true, vlan: 'pci' },
        { category: 'ATMs', isolation: true, vlan: 'atm' }
      ]
    }
  },
  {
    id: 'education-campus-wifi',
    name: 'Education Campus WiFi & BYOD',
    description: 'University campus with extensive BYOD and guest access requirements',
    industry: 'Education',
    scenario: 'Large university campus with student, faculty, and guest access',
    complexity: 'Medium',
    estimatedDuration: '3-5 months',
    recommendedTeamSize: 4,
    keyFeatures: ['Student BYOD', 'Faculty Network', 'Guest Access', 'Research Network Isolation'],
    complianceFrameworks: ['FERPA', 'CIPA'],
    painPoints: [
      { title: 'BYOD Management', description: 'Managing thousands of student devices' },
      { title: 'Research Network Security', description: 'Protecting sensitive research data' },
      { title: 'Guest Access Scale', description: 'Managing large-scale visitor access' }
    ],
    successCriteria: [
      'Seamless BYOD onboarding experience',
      'Complete research network isolation',
      'Automated guest access management'
    ],
    integrationRequirements: ['Blackboard LMS', 'Student Information System', 'Research Labs'],
    defaultSites: 3,
    defaultEndpoints: 5000,
    portnoxConfigs: {
      enabledFeatures: ['BYOD Portal', 'Guest Management', 'Network Segmentation'],
      recommendedPolicies: ['Student BYOD Policy', 'Faculty Policy', 'Guest Policy'],
      nasTemplates: [
        { name: 'Campus WiFi', type: 'aruba', location: 'campus_wide' },
        { name: 'Research Labs', type: 'cisco', location: 'research_buildings' }
      ],
      deviceProfiles: [
        { category: 'Student BYOD', isolation: false, vlan: 'student' },
        { category: 'Research Devices', isolation: true, vlan: 'research' }
      ]
    }
  },
  {
    id: 'manufacturing-iot-edge',
    name: 'Manufacturing IoT & Edge Computing',
    description: 'Smart manufacturing facility with extensive IoT and edge computing',
    industry: 'Manufacturing',
    scenario: 'Smart factory with industrial IoT, robotics, and edge computing',
    complexity: 'High',
    estimatedDuration: '6-8 months',
    recommendedTeamSize: 7,
    keyFeatures: ['Industrial IoT Security', 'OT/IT Convergence', 'Edge Computing', 'Predictive Maintenance'],
    complianceFrameworks: ['ISO 27001', 'NIST Cybersecurity Framework'],
    painPoints: [
      { title: 'OT/IT Integration', description: 'Bridging operational and information technology' },
      { title: 'IoT Device Management', description: 'Managing thousands of sensors and actuators' },
      { title: 'Production Continuity', description: 'Maintaining operations during deployment' }
    ],
    successCriteria: [
      'Zero production downtime during deployment',
      'Complete IoT device visibility and control',
      'Successful OT/IT network convergence'
    ],
    integrationRequirements: ['Siemens PLC', 'Rockwell Automation', 'Edge Computing Platforms'],
    defaultSites: 2,
    defaultEndpoints: 3000,
    portnoxConfigs: {
      enabledFeatures: ['IoT Device Profiling', 'OT Network Monitoring', 'Edge Integration'],
      recommendedPolicies: ['IoT Security Policy', 'OT Access Policy', 'Edge Device Policy'],
      nasTemplates: [
        { name: 'Factory Floor', type: 'industrial', location: 'production_floor' },
        { name: 'Edge Computing', type: 'cisco', location: 'edge_locations' }
      ],
      deviceProfiles: [
        { category: 'Industrial IoT', isolation: true, vlan: 'iot' },
        { category: 'Edge Devices', isolation: false, vlan: 'edge' }
      ]
    }
  },
  {
    id: 'retail-multi-site',
    name: 'Retail Multi-Site Chain',
    description: 'Large retail chain with POS systems and customer WiFi',
    industry: 'Retail',
    scenario: 'National retail chain with hundreds of locations',
    complexity: 'Medium',
    estimatedDuration: '4-6 months',
    recommendedTeamSize: 5,
    keyFeatures: ['POS Security', 'Customer WiFi', 'Inventory Systems', 'Digital Signage'],
    complianceFrameworks: ['PCI DSS', 'State Privacy Laws'],
    painPoints: [
      { title: 'POS System Security', description: 'Protecting payment processing systems' },
      { title: 'Multi-Site Management', description: 'Managing hundreds of remote locations' },
      { title: 'Customer WiFi', description: 'Providing secure guest access' }
    ],
    successCriteria: [
      'PCI compliance across all locations',
      'Centralized management of all sites',
      'Enhanced customer WiFi experience'
    ],
    integrationRequirements: ['Square POS', 'Inventory Management System', 'Digital Signage Platform'],
    defaultSites: 150,
    defaultEndpoints: 1200,
    portnoxConfigs: {
      enabledFeatures: ['Multi-Site Management', 'POS Security', 'Guest Portal'],
      recommendedPolicies: ['POS Security Policy', 'Guest WiFi Policy', 'Corporate Policy'],
      nasTemplates: [
        { name: 'Store Network', type: 'meraki', location: 'retail_stores' },
        { name: 'Corporate Office', type: 'cisco', location: 'headquarters' }
      ],
      deviceProfiles: [
        { category: 'POS Systems', isolation: true, vlan: 'pos' },
        { category: 'Customer Devices', isolation: true, vlan: 'guest' }
      ]
    }
  },
  {
    id: 'enterprise-global-byod',
    name: 'Global Enterprise BYOD & Remote Work',
    description: 'Large enterprise with global offices and extensive remote work',
    industry: 'Technology',
    scenario: 'Global technology company with hybrid work model',
    complexity: 'High',
    estimatedDuration: '8-12 months',
    recommendedTeamSize: 10,
    keyFeatures: ['Global BYOD', 'Remote Access', 'Cloud Integration', 'Zero Trust'],
    complianceFrameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
    painPoints: [
      { title: 'Global Consistency', description: 'Maintaining consistent policies across regions' },
      { title: 'Remote Device Management', description: 'Managing devices outside corporate network' },
      { title: 'Cloud Integration', description: 'Integrating with multiple cloud platforms' }
    ],
    successCriteria: [
      'Consistent policy enforcement globally',
      'Seamless remote worker experience',
      'Complete cloud service integration'
    ],
    integrationRequirements: ['Microsoft 365', 'AWS', 'Azure AD', 'Okta'],
    defaultSites: 25,
    defaultEndpoints: 8000,
    portnoxConfigs: {
      enabledFeatures: ['Global Policy Management', 'Cloud Integration', 'Zero Trust'],
      recommendedPolicies: ['Global BYOD Policy', 'Remote Access Policy', 'Cloud Security Policy'],
      nasTemplates: [
        { name: 'Corporate Offices', type: 'cisco', location: 'office_locations' },
        { name: 'Data Centers', type: 'arista', location: 'data_centers' }
      ],
      deviceProfiles: [
        { category: 'Corporate BYOD', isolation: false, vlan: 'corporate' },
        { category: 'Guest Devices', isolation: true, vlan: 'guest' }
      ]
    }
  }
];

export class UnifiedProjectCreationService {
  static async createProject(
    projectData: any,
    options: ProjectCreationOptions
  ): Promise<any> {
    // Apply template if specified
    if (options.templateId) {
      const template = PROJECT_TEMPLATES.find(t => t.id === options.templateId);
      if (template) {
        projectData = this.applyTemplate(projectData, template);
      }
    }

    // Create project in database
    const project = await this.createProjectRecord(projectData);

    // Initialize Portnox integration if enabled
    if (options.enablePortnoxIntegration && project.id) {
      await this.initializePortnoxIntegration(project.id, projectData);
    }

    // Set up automations if enabled
    if (options.enableAutomations && project.id) {
      await this.setupProjectAutomations(project.id, projectData);
    }

    // Integrate with resource library
    if (options.resourceLibraryIntegration && project.id) {
      await this.integrateResourceLibrary(project.id, projectData);
    }

    return project;
  }

  private static applyTemplate(projectData: any, template: ProjectTemplate): any {
    return {
      ...projectData,
      industry: projectData.industry || template.industry,
      compliance_frameworks: template.complianceFrameworks,
      pain_points: template.painPoints,
      success_criteria: template.successCriteria,
      integration_requirements: template.integrationRequirements,
      total_sites: projectData.total_sites || template.defaultSites,
      total_endpoints: projectData.total_endpoints || template.defaultEndpoints,
      deployment_type: template.complexity === 'High' ? 'Enterprise' : 
                      template.complexity === 'Medium' ? 'Mid-Market' : 'SMB',
      template_id: template.id,
      migration_scope: {
        ...projectData.migration_scope,
        templateData: template,
        portnoxConfigs: template.portnoxConfigs
      }
    };
  }

  private static async createProjectRecord(projectData: any): Promise<any> {
    type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

    const cleanedData: ProjectInsert = {
      name: projectData.name,
      description: projectData.description,
      client_name: projectData.client_name,
      business_domain: projectData.business_domain,
      business_website: projectData.business_website,
      business_summary: projectData.business_summary,
      project_type: projectData.project_type as any,
      industry: projectData.industry,
      primary_country: projectData.primary_country,
      primary_region: projectData.primary_region,
      deployment_type: projectData.deployment_type,
      security_level: projectData.security_level,
      total_sites: projectData.total_sites,
      total_endpoints: projectData.total_endpoints,
      
      budget: projectData.budget,
      project_owner: projectData.project_owner,
      technical_owner: projectData.technical_owner,
      portnox_owner: projectData.portnox_owner,
      additional_stakeholders: Array.isArray(projectData.additional_stakeholders) ? 
        (projectData.additional_stakeholders as any) : [],
      compliance_frameworks: Array.isArray(projectData.compliance_frameworks) ? 
        projectData.compliance_frameworks : [],
      pain_points: Array.isArray(projectData.pain_points) ? 
        (projectData.pain_points as any) : [],
      success_criteria: Array.isArray(projectData.success_criteria) ? 
        (projectData.success_criteria as any) : [],
      integration_requirements: Array.isArray(projectData.integration_requirements) ? 
        (projectData.integration_requirements as any) : [],
      enable_bulk_sites: projectData.enable_bulk_sites,
      enable_bulk_users: projectData.enable_bulk_users,
      enable_auto_vendors: projectData.enable_auto_vendors,
      
      status: projectData.status || 'scoping',
      current_phase: projectData.current_phase || 'scoping',
      progress_percentage: typeof projectData.progress_percentage === 'number' ? 
        projectData.progress_percentage : 0,
      bulk_sites_data: Array.isArray(projectData.bulk_sites_data) ? 
        (projectData.bulk_sites_data as any) : [],
      migration_scope: (projectData.migration_scope as any) || {},
      template_id: projectData.template_id
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(cleanedData)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  private static async initializePortnoxIntegration(projectId: string, projectData: any): Promise<void> {
    try {
      // Create initial Portnox sites if template has configurations
      const portnoxConfigs = projectData.migration_scope?.templateData?.portnoxConfigs;
      if (portnoxConfigs?.nasTemplates) {
        for (const nasTemplate of portnoxConfigs.nasTemplates) {
          await PortnoxApiService.proxy('POST', '/sites', undefined, {
            name: `${projectData.name} - ${nasTemplate.name}`,
            description: `Auto-created site for ${nasTemplate.location}`,
            location: nasTemplate.location
          }, { projectId });
        }
      }

      // Set up device profiles
      if (portnoxConfigs?.deviceProfiles) {
        for (const profile of portnoxConfigs.deviceProfiles) {
          await PortnoxApiService.proxy('POST', '/groups', undefined, {
            name: profile.category,
            description: `Auto-created group for ${profile.category}`,
            isolation_enabled: profile.isolation,
            default_vlan: profile.vlan
          }, { projectId });
        }
      }
    } catch (error) {
      console.error('Failed to initialize Portnox integration:', error);
    }
  }

  private static async setupProjectAutomations(projectId: string, projectData: any): Promise<void> {
    // Set up automated workflows, notifications, and reporting
    const automationConfig = {
      projectId,
      automations: {
        weeklyReports: true,
        milestoneNotifications: true,
        complianceChecks: projectData.compliance_frameworks?.length > 0,
        portnoxSync: true
      }
    };
    const sb = supabase as any;

    // Store automation configuration
    await sb
      .from('project_automations')
      .upsert({
        project_id: projectId,
        config: automationConfig,
        enabled: true
      });
  }

  private static async integrateResourceLibrary(projectId: string, projectData: any): Promise<void> {
    if (!projectData.industry) return;
    // Link relevant resources from the resource library
    const sb = supabase as any;
    const { data: resources } = await sb
      .from('configuration_templates')
      .select('id,name,tags')
      .contains('tags', [projectData.industry]);

    if (resources && Array.isArray(resources)) {
      for (const resource of resources) {
        await sb
          .from('project_resources')
          .insert({
            project_id: projectId,
            resource_id: resource.id,
            auto_linked: true
          });
      }
    }
  }

  static getTemplatesByIndustry(industry?: string): ProjectTemplate[] {
    if (!industry) return PROJECT_TEMPLATES;
    return PROJECT_TEMPLATES.filter(t => 
      t.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }

  static getTemplatesByComplexity(complexity?: string): ProjectTemplate[] {
    if (!complexity) return PROJECT_TEMPLATES;
    return PROJECT_TEMPLATES.filter(t => t.complexity === complexity);
  }
}
