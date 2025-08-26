import { supabase } from '@/integrations/supabase/client';
import { firecrawlerService, DocumentationResult, PortnoxDocumentationRequest } from '@/services/intelligence/FirecrawlerService';
import { UseCase } from '@/hooks/useUseCases';
import { Requirement } from '@/hooks/useRequirements';
import { PainPoint } from '@/hooks/usePainPoints';

export interface EnterpriseReport {
  id: string;
  title: string;
  type: 'prerequisites' | 'deployment_checklist' | 'firewall_requirements' | 'technical_specifications' | 'project_summary' | 'vendor_comparison';
  projectId: string;
  generatedAt: string;
  generatedBy: string;
  version: string;
  status: 'draft' | 'final' | 'approved';
  content: ReportContent;
  metadata: ReportMetadata;
}

export interface ReportContent {
  executiveSummary: string;
  sections: ReportSection[];
  appendices: ReportAppendix[];
  references: ReportReference[];
}

export interface ReportSection {
  id: string;
  title: string;
  order: number;
  content: string;
  subsections?: ReportSubsection[];
  tables?: ReportTable[];
  diagrams?: ReportDiagram[];
  checklists?: ReportChecklist[];
}

export interface ReportSubsection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ReportTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ReportDiagram {
  id: string;
  title: string;
  type: 'network' | 'flow' | 'architecture' | 'timeline';
  description: string;
  imageUrl?: string;
  mermaidCode?: string;
}

export interface ReportChecklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  category: 'prerequisites' | 'installation' | 'configuration' | 'testing' | 'deployment';
}

export interface ChecklistItem {
  id: string;
  description: string;
  mandatory: boolean;
  category: string;
  estimatedTime?: string;
  dependencies?: string[];
  notes?: string;
  completed?: boolean;
}

export interface ReportAppendix {
  id: string;
  title: string;
  content: string;
  type: 'technical_details' | 'vendor_documentation' | 'configuration_examples' | 'troubleshooting';
}

export interface ReportReference {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'vendor_guide' | 'kb_article' | 'community_post';
  lastAccessed: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface ReportMetadata {
  projectName: string;
  clientName: string;
  industry: string;
  totalSites: number;
  estimatedUsers: number;
  selectedVendors: string[];
  useCases: string[];
  complianceFrameworks: string[];
  generationTime: number; // milliseconds
  documentationSources: number;
  lastUpdated: string;
}

export interface ReportGenerationRequest {
  projectId: string;
  reportType: EnterpriseReport['type'];
  scopingData: any;
  includeFirewallRequirements: boolean;
  includeVendorDocumentation: boolean;
  includePrerequisites: boolean;
  includeChecklists: boolean;
  customSections?: string[];
  branding?: {
    companyName: string;
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

export interface FirewallRequirement {
  service: string;
  component: string;
  ports: string[];
  protocol: 'TCP' | 'UDP' | 'ICMP';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  source: string;
  destination: string;
  description: string;
  mandatory: boolean;
  category: 'core' | 'optional' | 'integration';
}

class EnterpriseReportGenerator {
  private documentationCache: Map<string, DocumentationResult[]> = new Map();

  /**
   * Generate comprehensive enterprise report
   */
  async generateReport(request: ReportGenerationRequest): Promise<EnterpriseReport> {
    const startTime = Date.now();
    console.log(`Starting report generation for project ${request.projectId}, type: ${request.reportType}`);

    // Fetch project data
    const projectData = await this.fetchProjectData(request.projectId);
    const scopingData = request.scopingData || projectData.scoping_data;

    // Gather documentation if requested
    let documentationResults: DocumentationResult[] = [];
    if (request.includeVendorDocumentation) {
      documentationResults = await this.gatherDocumentation(scopingData);
    }

    // Generate report content based on type
    const content = await this.generateReportContent(request, scopingData, documentationResults);

    // Create metadata
    const metadata: ReportMetadata = {
      projectName: projectData.name,
      clientName: projectData.client_name,
      industry: projectData.industry,
      totalSites: projectData.total_sites || 1,
      estimatedUsers: scopingData?.requirementsAnalysis?.performance_requirements?.user_capacity || 0,
      selectedVendors: scopingData?.vendorSelection?.preferred_vendors || [],
      useCases: scopingData?.useCaseAnalysis?.primary_use_cases?.map((uc: UseCase) => uc.name) || [],
      complianceFrameworks: scopingData?.requirementsAnalysis?.compliance_requirements || [],
      generationTime: Date.now() - startTime,
      documentationSources: documentationResults.length,
      lastUpdated: new Date().toISOString()
    };

    // Create final report
    const report: EnterpriseReport = {
      id: this.generateReportId(),
      title: this.generateReportTitle(request.reportType, projectData.name),
      type: request.reportType,
      projectId: request.projectId,
      generatedAt: new Date().toISOString(),
      generatedBy: 'System', // TODO: Get actual user
      version: '1.0',
      status: 'draft',
      content,
      metadata
    };

    // Store report in database
    await this.storeReport(report);

    console.log(`Report generation completed in ${Date.now() - startTime}ms`);
    return report;
  }

  /**
   * Generate report content based on type
   */
  private async generateReportContent(
    request: ReportGenerationRequest,
    scopingData: any,
    documentationResults: DocumentationResult[]
  ): Promise<ReportContent> {
    switch (request.reportType) {
      case 'prerequisites':
        return this.generatePrerequisitesReport(scopingData, documentationResults);
      case 'deployment_checklist':
        return this.generateDeploymentChecklistReport(scopingData, documentationResults);
      case 'firewall_requirements':
        return this.generateFirewallRequirementsReport(scopingData, documentationResults);
      case 'technical_specifications':
        return this.generateTechnicalSpecificationsReport(scopingData, documentationResults);
      case 'project_summary':
        return this.generateProjectSummaryReport(scopingData, documentationResults);
      case 'vendor_comparison':
        return this.generateVendorComparisonReport(scopingData, documentationResults);
      default:
        throw new Error(`Unknown report type: ${request.reportType}`);
    }
  }

  /**
   * Generate Prerequisites Report
   */
  private async generatePrerequisitesReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    const sections: ReportSection[] = [];

    // Executive Summary
    const executiveSummary = this.generateExecutiveSummary(scopingData, 'prerequisites');

    // Hardware Prerequisites
    sections.push({
      id: 'hardware-prereq',
      title: 'Hardware Prerequisites',
      order: 1,
      content: this.generateHardwarePrerequisites(scopingData),
      tables: [this.generateHardwareRequirementsTable(scopingData)]
    });

    // Software Prerequisites
    sections.push({
      id: 'software-prereq',
      title: 'Software Prerequisites',
      order: 2,
      content: this.generateSoftwarePrerequisites(scopingData),
      tables: [this.generateSoftwareRequirementsTable(scopingData)]
    });

    // Network Prerequisites
    sections.push({
      id: 'network-prereq',
      title: 'Network Prerequisites',
      order: 3,
      content: this.generateNetworkPrerequisites(scopingData),
      tables: [this.generateNetworkRequirementsTable(scopingData)]
    });

    // Security Prerequisites
    sections.push({
      id: 'security-prereq',
      title: 'Security Prerequisites',
      order: 4,
      content: this.generateSecurityPrerequisites(scopingData),
      checklists: [this.generateSecurityPrerequisitesChecklist(scopingData)]
    });

    // Integration Prerequisites
    sections.push({
      id: 'integration-prereq',
      title: 'Integration Prerequisites',
      order: 5,
      content: this.generateIntegrationPrerequisites(scopingData),
      tables: [this.generateIntegrationRequirementsTable(scopingData)]
    });

    return {
      executiveSummary,
      sections,
      appendices: this.generatePrerequisitesAppendices(docs),
      references: this.generateReferences(docs)
    };
  }

  /**
   * Generate Deployment Checklist Report
   */
  private async generateDeploymentChecklistReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    const sections: ReportSection[] = [];

    const executiveSummary = this.generateExecutiveSummary(scopingData, 'deployment_checklist');

    // Pre-Deployment Checklist
    sections.push({
      id: 'pre-deployment',
      title: 'Pre-Deployment Checklist',
      order: 1,
      content: 'Complete these tasks before beginning the deployment process.',
      checklists: [this.generatePreDeploymentChecklist(scopingData)]
    });

    // Installation Checklist
    sections.push({
      id: 'installation',
      title: 'Installation Checklist',
      order: 2,
      content: 'Step-by-step installation verification checklist.',
      checklists: [this.generateInstallationChecklist(scopingData)]
    });

    // Configuration Checklist
    sections.push({
      id: 'configuration',
      title: 'Configuration Checklist',
      order: 3,
      content: 'Comprehensive configuration verification checklist.',
      checklists: [this.generateConfigurationChecklist(scopingData)]
    });

    // Testing Checklist
    sections.push({
      id: 'testing',
      title: 'Testing & Validation Checklist',
      order: 4,
      content: 'Testing procedures to validate deployment success.',
      checklists: [this.generateTestingChecklist(scopingData)]
    });

    // Go-Live Checklist
    sections.push({
      id: 'go-live',
      title: 'Go-Live Checklist',
      order: 5,
      content: 'Final checklist for production deployment.',
      checklists: [this.generateGoLiveChecklist(scopingData)]
    });

    return {
      executiveSummary,
      sections,
      appendices: this.generateDeploymentAppendices(docs),
      references: this.generateReferences(docs)
    };
  }

  /**
   * Generate Firewall Requirements Report
   */
  private async generateFirewallRequirementsReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    const sections: ReportSection[] = [];
    const firewallRequirements = this.generateComprehensiveFirewallRequirements(scopingData, docs);

    const executiveSummary = this.generateExecutiveSummary(scopingData, 'firewall_requirements');

    // Core Portnox Services
    sections.push({
      id: 'core-services',
      title: 'Core Portnox Services',
      order: 1,
      content: 'Firewall requirements for core Portnox NAC components.',
      tables: [this.generateCoreServicesFirewallTable(firewallRequirements)]
    });

    // Integration Services
    sections.push({
      id: 'integration-services',
      title: 'Integration Services',
      order: 2,
      content: 'Firewall requirements for third-party integrations.',
      tables: [this.generateIntegrationServicesFirewallTable(firewallRequirements)]
    });

    // Management and Monitoring
    sections.push({
      id: 'management-monitoring',
      title: 'Management and Monitoring',
      order: 3,
      content: 'Firewall requirements for management and monitoring services.',
      tables: [this.generateManagementFirewallTable(firewallRequirements)]
    });

    // Site-to-Site Communication
    sections.push({
      id: 'site-communication',
      title: 'Site-to-Site Communication',
      order: 4,
      content: 'Firewall requirements for multi-site deployments.',
      tables: [this.generateSiteToSiteFirewallTable(firewallRequirements, scopingData)]
    });

    return {
      executiveSummary,
      sections,
      appendices: this.generateFirewallAppendices(docs),
      references: this.generateReferences(docs)
    };
  }

  /**
   * Generate comprehensive firewall requirements
   */
  private generateComprehensiveFirewallRequirements(scopingData: any, docs: DocumentationResult[]): FirewallRequirement[] {
    const requirements: FirewallRequirement[] = [];

    // Core Portnox services
    requirements.push(
      {
        service: 'HTTPS Management',
        component: 'Portnox Console',
        ports: ['443'],
        protocol: 'TCP',
        direction: 'inbound',
        source: 'Admin Networks',
        destination: 'Portnox Server',
        description: 'Web-based management console access',
        mandatory: true,
        category: 'core'
      },
      {
        service: 'RADIUS Authentication',
        component: 'RADIUS Server',
        ports: ['1812'],
        protocol: 'UDP',
        direction: 'inbound',
        source: 'Network Devices',
        destination: 'Portnox Server',
        description: 'RADIUS authentication requests',
        mandatory: true,
        category: 'core'
      },
      {
        service: 'RADIUS Accounting',
        component: 'RADIUS Server',
        ports: ['1813'],
        protocol: 'UDP',
        direction: 'inbound',
        source: 'Network Devices',
        destination: 'Portnox Server',
        description: 'RADIUS accounting messages',
        mandatory: true,
        category: 'core'
      },
      {
        service: 'Database Access',
        component: 'Database Server',
        ports: ['3306', '5432', '1433'],
        protocol: 'TCP',
        direction: 'outbound',
        source: 'Portnox Server',
        destination: 'Database Server',
        description: 'Database connectivity (MySQL/PostgreSQL/SQL Server)',
        mandatory: true,
        category: 'core'
      }
    );

    // Integration services
    if (scopingData?.authenticationDesign?.identity_sources?.includes('Active Directory')) {
      requirements.push(
        {
          service: 'LDAP',
          component: 'Active Directory',
          ports: ['389'],
          protocol: 'TCP',
          direction: 'outbound',
          source: 'Portnox Server',
          destination: 'Domain Controllers',
          description: 'LDAP queries to Active Directory',
          mandatory: true,
          category: 'integration'
        },
        {
          service: 'LDAPS',
          component: 'Active Directory',
          ports: ['636'],
          protocol: 'TCP',
          direction: 'outbound',
          source: 'Portnox Server',
          destination: 'Domain Controllers',
          description: 'Secure LDAP queries to Active Directory',
          mandatory: false,
          category: 'integration'
        },
        {
          service: 'Kerberos',
          component: 'Active Directory',
          ports: ['88'],
          protocol: 'TCP',
          direction: 'outbound',
          source: 'Portnox Server',
          destination: 'Domain Controllers',
          description: 'Kerberos authentication',
          mandatory: false,
          category: 'integration'
        },
        {
          service: 'Global Catalog',
          component: 'Active Directory',
          ports: ['3268'],
          protocol: 'TCP',
          direction: 'outbound',
          source: 'Portnox Server',
          destination: 'Global Catalog Servers',
          description: 'Global Catalog queries',
          mandatory: false,
          category: 'integration'
        }
      );
    }

    // SNMP monitoring
    requirements.push({
      service: 'SNMP',
      component: 'Network Devices',
      ports: ['161'],
      protocol: 'UDP',
      direction: 'outbound',
      source: 'Portnox Server',
      destination: 'Network Devices',
      description: 'SNMP monitoring and device discovery',
      mandatory: false,
      category: 'optional'
    });

    // Email notifications
    requirements.push({
      service: 'SMTP',
      component: 'Mail Server',
      ports: ['25', '587', '465'],
      protocol: 'TCP',
      direction: 'outbound',
      source: 'Portnox Server',
      destination: 'Mail Server',
      description: 'Email notifications and alerts',
      mandatory: false,
      category: 'optional'
    });

    // Syslog
    requirements.push({
      service: 'Syslog',
      component: 'Syslog Server',
      ports: ['514'],
      protocol: 'UDP',
      direction: 'outbound',
      source: 'Portnox Server',
      destination: 'Syslog Server',
      description: 'System logging and audit trails',
      mandatory: false,
      category: 'optional'
    });

    // NTP
    requirements.push({
      service: 'NTP',
      component: 'Time Server',
      ports: ['123'],
      protocol: 'UDP',
      direction: 'outbound',
      source: 'Portnox Server',
      destination: 'NTP Servers',
      description: 'Time synchronization',
      mandatory: true,
      category: 'core'
    });

    // DNS
    requirements.push({
      service: 'DNS',
      component: 'DNS Server',
      ports: ['53'],
      protocol: 'UDP',
      direction: 'outbound',
      source: 'Portnox Server',
      destination: 'DNS Servers',
      description: 'Domain name resolution',
      mandatory: true,
      category: 'core'
    });

    // Extract additional requirements from documentation
    for (const doc of docs) {
      if (doc.firewallRequirements) {
        for (const req of doc.firewallRequirements) {
          requirements.push({
            service: req.service,
            component: req.service,
            ports: req.ports,
            protocol: req.protocol,
            direction: req.direction,
            source: req.source,
            destination: req.destination,
            description: req.description,
            mandatory: true,
            category: 'core'
          });
        }
      }
    }

    return requirements;
  }

  /**
   * Generate various report tables and checklists
   */
  private generateHardwareRequirementsTable(scopingData: any): ReportTable {
    const estimatedUsers = scopingData?.requirementsAnalysis?.performance_requirements?.user_capacity || 1000;
    const sites = scopingData?.sitePlanning?.total_sites || 1;
    
    // Calculate requirements based on user count and sites
    const serverSpecs = this.calculateServerSpecs(estimatedUsers, sites);

    return {
      id: 'hardware-requirements',
      title: 'Hardware Requirements',
      headers: ['Component', 'Minimum', 'Recommended', 'Enterprise'],
      rows: [
        ['CPU Cores', serverSpecs.cpu.min, serverSpecs.cpu.recommended, serverSpecs.cpu.enterprise],
        ['RAM (GB)', serverSpecs.memory.min, serverSpecs.memory.recommended, serverSpecs.memory.enterprise],
        ['Storage (GB)', serverSpecs.storage.min, serverSpecs.storage.recommended, serverSpecs.storage.enterprise],
        ['Network Interface', '1 Gbps', '10 Gbps', '10 Gbps Redundant'],
        ['Disk Type', 'SATA', 'SAS/SSD', 'NVMe SSD'],
        ['Redundancy', 'None', 'RAID 1', 'RAID 10']
      ],
      caption: `Hardware requirements based on ${estimatedUsers.toLocaleString()} users across ${sites} site(s)`
    };
  }

  private generatePreDeploymentChecklist(scopingData: any): ReportChecklist {
    const items: ChecklistItem[] = [
      {
        id: 'hardware-ready',
        description: 'Verify all hardware meets minimum requirements',
        mandatory: true,
        category: 'Hardware',
        estimatedTime: '30 minutes',
        notes: 'Use hardware requirements table for verification'
      },
      {
        id: 'software-licenses',
        description: 'Obtain and verify all software licenses',
        mandatory: true,
        category: 'Licensing',
        estimatedTime: '15 minutes'
      },
      {
        id: 'network-access',
        description: 'Configure firewall rules and network access',
        mandatory: true,
        category: 'Network',
        estimatedTime: '45 minutes',
        dependencies: ['firewall-requirements-review']
      },
      {
        id: 'database-ready',
        description: 'Prepare database server and create initial database',
        mandatory: true,
        category: 'Database',
        estimatedTime: '30 minutes'
      },
      {
        id: 'backup-strategy',
        description: 'Define and implement backup strategy',
        mandatory: true,
        category: 'Operations',
        estimatedTime: '20 minutes'
      },
      {
        id: 'monitoring-setup',
        description: 'Configure monitoring and alerting systems',
        mandatory: false,
        category: 'Operations',
        estimatedTime: '60 minutes'
      }
    ];

    return {
      id: 'pre-deployment-checklist',
      title: 'Pre-Deployment Checklist',
      items,
      category: 'prerequisites'
    };
  }

  private generateCoreServicesFirewallTable(requirements: FirewallRequirement[]): ReportTable {
    const coreRequirements = requirements.filter(req => req.category === 'core');
    
    return {
      id: 'core-services-firewall',
      title: 'Core Services Firewall Requirements',
      headers: ['Service', 'Ports', 'Protocol', 'Direction', 'Source', 'Destination', 'Mandatory'],
      rows: coreRequirements.map(req => [
        req.service,
        req.ports.join(', '),
        req.protocol,
        req.direction,
        req.source,
        req.destination,
        req.mandatory ? 'Yes' : 'No'
      ]),
      caption: 'Essential firewall rules for core Portnox functionality'
    };
  }

  /**
   * Helper methods for calculations and content generation
   */
  private calculateServerSpecs(users: number, sites: number) {
    // Base calculations on user count and site complexity
    const baseMultiplier = Math.ceil(users / 1000);
    const siteMultiplier = Math.max(1, Math.ceil(sites / 5));
    
    return {
      cpu: {
        min: `${Math.max(4, baseMultiplier * 2)}`,
        recommended: `${Math.max(8, baseMultiplier * 4)}`,
        enterprise: `${Math.max(16, baseMultiplier * 8)}`
      },
      memory: {
        min: `${Math.max(8, baseMultiplier * 4)}`,
        recommended: `${Math.max(16, baseMultiplier * 8)}`,
        enterprise: `${Math.max(32, baseMultiplier * 16)}`
      },
      storage: {
        min: `${Math.max(100, baseMultiplier * 50)}`,
        recommended: `${Math.max(250, baseMultiplier * 100)}`,
        enterprise: `${Math.max(500, baseMultiplier * 200)}`
      }
    };
  }

  private generateExecutiveSummary(scopingData: any, reportType: string): string {
    const orgName = scopingData?.organization?.name || 'Organization';
    const industry = scopingData?.organization?.industry || 'Enterprise';
    const sites = scopingData?.sitePlanning?.total_sites || 1;
    const users = scopingData?.requirementsAnalysis?.performance_requirements?.user_capacity || 0;

    const summaries = {
      prerequisites: `This document outlines the comprehensive prerequisites for deploying Portnox Network Access Control (NAC) solution at ${orgName}. The deployment will cover ${sites} site(s) supporting approximately ${users.toLocaleString()} users in the ${industry} industry. All hardware, software, network, and security prerequisites must be met before beginning the installation process.`,
      
      deployment_checklist: `This deployment checklist provides a step-by-step verification process for the Portnox NAC implementation at ${orgName}. The checklist covers pre-deployment preparation, installation verification, configuration validation, testing procedures, and go-live requirements for ${sites} site(s).`,
      
      firewall_requirements: `This document specifies all firewall port and protocol requirements for the Portnox NAC deployment at ${orgName}. The requirements cover core services, integrations, management access, and inter-site communication for a ${sites}-site deployment supporting ${users.toLocaleString()} users.`,
      
      technical_specifications: `Technical specifications document for the ${orgName} Portnox NAC deployment, covering architecture, performance requirements, integration specifications, and technical implementation details for ${sites} site(s).`,
      
      project_summary: `Executive project summary for the ${orgName} Portnox NAC deployment initiative, providing high-level overview of scope, timeline, resources, and expected outcomes for the ${industry} industry implementation.`,
      
      vendor_comparison: `Comprehensive vendor comparison and analysis for the ${orgName} NAC solution selection, evaluating capabilities, costs, and suitability for the ${industry} industry requirements.`
    };

    return summaries[reportType as keyof typeof summaries] || `Report for ${orgName} Portnox NAC deployment.`;
  }

  // Additional helper methods for content generation
  private generateHardwarePrerequisites(scopingData: any): string {
    return `The hardware prerequisites outlined in this section are based on the projected user load of ${scopingData?.requirementsAnalysis?.performance_requirements?.user_capacity || 'N/A'} concurrent users and ${scopingData?.sitePlanning?.total_sites || 1} deployment sites. These requirements ensure optimal performance, scalability, and reliability of the Portnox NAC solution.

Key considerations:
• Server specifications must meet or exceed minimum requirements
• High availability configurations are recommended for enterprise deployments
• Storage requirements include space for logs, reports, and user data
• Network interfaces should support expected throughput with redundancy options`;
  }

  private generateSoftwarePrerequisites(scopingData: any): string {
    return `Software prerequisites include operating system requirements, database software, and any additional components required for the Portnox NAC deployment. All software must be properly licensed and supported versions.

Requirements include:
• Operating System: Windows Server 2019/2022 or RHEL 8/9
• Database: MySQL 8.0+, PostgreSQL 13+, or SQL Server 2019+
• Web Server: IIS 10+ or Apache 2.4+
• SSL Certificates: Valid certificates for HTTPS communications
• Backup Software: Enterprise backup solution for data protection`;
  }

  private generateNetworkPrerequisites(scopingData: any): string {
    return `Network prerequisites ensure proper connectivity and communication between all Portnox components and integrated systems. Network design should support the expected traffic load and provide appropriate security segmentation.

Network requirements:
• Dedicated network segments for NAC components
• VLAN configuration for traffic segmentation  
• Bandwidth allocation based on user count and traffic patterns
• DNS and NTP services configuration
• Network monitoring and management access`;
  }

  private generateSecurityPrerequisites(scopingData: any): string {
    return `Security prerequisites establish the foundational security controls required before deploying the Portnox NAC solution. These requirements ensure the deployment meets security best practices and compliance requirements.

Security considerations:
• Certificate management and PKI infrastructure
• Firewall rules and network access controls
• Administrative access controls and authentication
• Audit logging and monitoring capabilities
• Compliance with industry regulations and standards`;
  }

  private generateIntegrationPrerequisites(scopingData: any): string {
    return `Integration prerequisites cover the requirements for connecting Portnox NAC with existing infrastructure components and third-party systems. Proper integration ensures seamless operation and data flow.

Integration requirements:
• Active Directory connectivity and permissions
• Network device integration and SNMP access
• SIEM and logging system integration
• Email server configuration for notifications
• API access for third-party integrations`;
  }

  // Generate additional required methods and tables
  private generateSoftwareRequirementsTable(scopingData: any): ReportTable {
    return {
      id: 'software-requirements',
      title: 'Software Requirements',
      headers: ['Component', 'Version', 'Edition', 'License Required'],
      rows: [
        ['Windows Server', '2019/2022', 'Standard/Datacenter', 'Yes'],
        ['MySQL', '8.0+', 'Community/Enterprise', 'Varies'],
        ['PostgreSQL', '13+', 'Open Source', 'No'],
        ['SSL Certificate', 'Current', 'Commercial/Enterprise', 'Yes'],
        ['Backup Software', 'Current', 'Enterprise', 'Yes']
      ]
    };
  }

  private generateNetworkRequirementsTable(scopingData: any): ReportTable {
    return {
      id: 'network-requirements',
      title: 'Network Requirements',
      headers: ['Component', 'Specification', 'Purpose'],
      rows: [
        ['Bandwidth', '1 Gbps minimum', 'Core connectivity'],
        ['VLAN Support', 'IEEE 802.1Q', 'Traffic segmentation'],
        ['DNS Resolution', 'Redundant DNS servers', 'Name resolution'],
        ['NTP Synchronization', 'Stratum 2 or better', 'Time accuracy'],
        ['DHCP Services', 'Enterprise DHCP', 'IP address management']
      ]
    };
  }

  private generateIntegrationRequirementsTable(scopingData: any): ReportTable {
    return {
      id: 'integration-requirements',
      title: 'Integration Requirements',
      headers: ['System', 'Protocol', 'Authentication', 'Required'],
      rows: [
        ['Active Directory', 'LDAP/LDAPS', 'Service Account', 'Yes'],
        ['Network Devices', 'SNMP v2c/v3', 'Community/User', 'Yes'],
        ['SIEM System', 'Syslog/API', 'Token/Certificate', 'Optional'],
        ['Email Server', 'SMTP/SMTPS', 'Authentication', 'Optional'],
        ['Monitoring System', 'SNMP/API', 'Credentials', 'Optional']
      ]
    };
  }

  private generateSecurityPrerequisitesChecklist(scopingData: any): ReportChecklist {
    return {
      id: 'security-prerequisites',
      title: 'Security Prerequisites Checklist',
      category: 'prerequisites',
      items: [
        {
          id: 'ssl-cert',
          description: 'Obtain and install valid SSL certificates',
          mandatory: true,
          category: 'Security'
        },
        {
          id: 'firewall-rules',
          description: 'Configure firewall rules per requirements',
          mandatory: true,
          category: 'Security'
        },
        {
          id: 'admin-accounts',
          description: 'Create administrative service accounts',
          mandatory: true,
          category: 'Security'
        },
        {
          id: 'audit-logging',
          description: 'Configure audit logging and monitoring',
          mandatory: true,
          category: 'Security'
        }
      ]
    };
  }

  // Generate remaining checklist methods
  private generateInstallationChecklist(scopingData: any): ReportChecklist {
    return {
      id: 'installation-checklist',
      title: 'Installation Verification Checklist',
      category: 'installation',
      items: [
        {
          id: 'server-install',
          description: 'Install Portnox server software',
          mandatory: true,
          category: 'Installation',
          estimatedTime: '45 minutes'
        },
        {
          id: 'database-setup',
          description: 'Configure database connection and schema',
          mandatory: true,
          category: 'Installation',
          estimatedTime: '30 minutes'
        },
        {
          id: 'license-activation',
          description: 'Activate software licenses',
          mandatory: true,
          category: 'Installation',
          estimatedTime: '15 minutes'
        },
        {
          id: 'service-verification',
          description: 'Verify all services are running',
          mandatory: true,
          category: 'Installation',
          estimatedTime: '15 minutes'
        }
      ]
    };
  }

  private generateConfigurationChecklist(scopingData: any): ReportChecklist {
    return {
      id: 'configuration-checklist',
      title: 'Configuration Verification Checklist',
      category: 'configuration',
      items: [
        {
          id: 'network-config',
          description: 'Configure network settings and interfaces',
          mandatory: true,
          category: 'Configuration',
          estimatedTime: '30 minutes'
        },
        {
          id: 'ad-integration',
          description: 'Configure Active Directory integration',
          mandatory: true,
          category: 'Configuration',
          estimatedTime: '45 minutes'
        },
        {
          id: 'radius-config',
          description: 'Configure RADIUS authentication settings',
          mandatory: true,
          category: 'Configuration',
          estimatedTime: '30 minutes'
        },
        {
          id: 'policy-setup',
          description: 'Configure access policies and rules',
          mandatory: true,
          category: 'Configuration',
          estimatedTime: '60 minutes'
        }
      ]
    };
  }

  private generateTestingChecklist(scopingData: any): ReportChecklist {
    return {
      id: 'testing-checklist',
      title: 'Testing and Validation Checklist',
      category: 'testing',
      items: [
        {
          id: 'auth-testing',
          description: 'Test user authentication scenarios',
          mandatory: true,
          category: 'Testing',
          estimatedTime: '60 minutes'
        },
        {
          id: 'policy-testing',
          description: 'Validate access policy enforcement',
          mandatory: true,
          category: 'Testing',
          estimatedTime: '45 minutes'
        },
        {
          id: 'integration-testing',
          description: 'Test third-party integrations',
          mandatory: true,
          category: 'Testing',
          estimatedTime: '30 minutes'
        },
        {
          id: 'performance-testing',
          description: 'Conduct performance and load testing',
          mandatory: false,
          category: 'Testing',
          estimatedTime: '120 minutes'
        }
      ]
    };
  }

  private generateGoLiveChecklist(scopingData: any): ReportChecklist {
    return {
      id: 'go-live-checklist',
      title: 'Go-Live Checklist',
      category: 'deployment',
      items: [
        {
          id: 'backup-verification',
          description: 'Verify backup and recovery procedures',
          mandatory: true,
          category: 'Operations',
          estimatedTime: '30 minutes'
        },
        {
          id: 'monitoring-setup',
          description: 'Enable monitoring and alerting',
          mandatory: true,
          category: 'Operations',
          estimatedTime: '15 minutes'
        },
        {
          id: 'documentation-review',
          description: 'Review and finalize documentation',
          mandatory: true,
          category: 'Documentation',
          estimatedTime: '30 minutes'
        },
        {
          id: 'stakeholder-signoff',
          description: 'Obtain stakeholder approval for go-live',
          mandatory: true,
          category: 'Approval',
          estimatedTime: '15 minutes'
        }
      ]
    };
  }

  // Generate remaining table methods
  private generateIntegrationServicesFirewallTable(requirements: FirewallRequirement[]): ReportTable {
    const integrationRequirements = requirements.filter(req => req.category === 'integration');
    
    return {
      id: 'integration-services-firewall',
      title: 'Integration Services Firewall Requirements',
      headers: ['Service', 'Ports', 'Protocol', 'Direction', 'Source', 'Destination'],
      rows: integrationRequirements.map(req => [
        req.service,
        req.ports.join(', '),
        req.protocol,
        req.direction,
        req.source,
        req.destination
      ])
    };
  }

  private generateManagementFirewallTable(requirements: FirewallRequirement[]): ReportTable {
    const managementRequirements = requirements.filter(req => 
      req.service.toLowerCase().includes('management') || 
      req.service.toLowerCase().includes('admin') ||
      req.service.toLowerCase().includes('snmp') ||
      req.service.toLowerCase().includes('monitoring')
    );
    
    return {
      id: 'management-firewall',
      title: 'Management and Monitoring Firewall Requirements',
      headers: ['Service', 'Ports', 'Protocol', 'Direction', 'Source', 'Destination'],
      rows: managementRequirements.map(req => [
        req.service,
        req.ports.join(', '),
        req.protocol,
        req.direction,
        req.source,
        req.destination
      ])
    };
  }

  private generateSiteToSiteFirewallTable(requirements: FirewallRequirement[], scopingData: any): ReportTable {
    // For multi-site deployments
    const sites = scopingData?.sitePlanning?.total_sites || 1;
    
    if (sites <= 1) {
      return {
        id: 'site-to-site-firewall',
        title: 'Site-to-Site Communication',
        headers: ['Note'],
        rows: [['Single site deployment - no inter-site communication required']],
        caption: 'This deployment involves only one site'
      };
    }

    return {
      id: 'site-to-site-firewall',
      title: 'Site-to-Site Communication Firewall Requirements',
      headers: ['Service', 'Ports', 'Protocol', 'Direction', 'Source', 'Destination'],
      rows: [
        ['HTTPS Replication', '443', 'TCP', 'Bidirectional', 'Primary Site', 'Secondary Sites'],
        ['Database Sync', '3306/5432', 'TCP', 'Outbound', 'Primary Site', 'Site Databases'],
        ['Management Access', '443', 'TCP', 'Inbound', 'Admin Networks', 'All Sites']
      ],
      caption: `Multi-site deployment with ${sites} sites requires inter-site communication`
    };
  }

  // Generate appendices and references
  private generatePrerequisitesAppendices(docs: DocumentationResult[]): ReportAppendix[] {
    return [
      {
        id: 'vendor-docs',
        title: 'Vendor Documentation References',
        type: 'vendor_documentation',
        content: this.formatDocumentationReferences(docs)
      },
      {
        id: 'config-examples',
        title: 'Configuration Examples',
        type: 'configuration_examples',
        content: this.generateConfigurationExamples()
      }
    ];
  }

  private generateDeploymentAppendices(docs: DocumentationResult[]): ReportAppendix[] {
    return [
      {
        id: 'troubleshooting',
        title: 'Troubleshooting Guide',
        type: 'troubleshooting',
        content: this.generateTroubleshootingGuide(docs)
      },
      {
        id: 'rollback-procedures',
        title: 'Rollback Procedures',
        type: 'technical_details',
        content: this.generateRollbackProcedures()
      }
    ];
  }

  private generateFirewallAppendices(docs: DocumentationResult[]): ReportAppendix[] {
    return [
      {
        id: 'firewall-configs',
        title: 'Sample Firewall Configurations',
        type: 'configuration_examples',
        content: this.generateFirewallConfigExamples()
      },
      {
        id: 'port-reference',
        title: 'Complete Port Reference',
        type: 'technical_details',
        content: this.generatePortReference()
      }
    ];
  }

  private generateReferences(docs: DocumentationResult[]): ReportReference[] {
    return docs.map(doc => ({
      id: `ref-${doc.id}`,
      title: doc.title,
      url: doc.sourceUrl,
      type: 'documentation',
      lastAccessed: new Date().toISOString(),
      relevance: doc.relevanceScore > 0.7 ? 'high' : doc.relevanceScore > 0.4 ? 'medium' : 'low'
    }));
  }

  // Helper methods for content formatting
  private formatDocumentationReferences(docs: DocumentationResult[]): string {
    if (docs.length === 0) {
      return 'No vendor documentation was automatically retrieved for this deployment.';
    }

    let content = 'The following vendor documentation was automatically retrieved and analyzed:\n\n';
    
    docs.forEach((doc, index) => {
      content += `${index + 1}. **${doc.title}**\n`;
      content += `   Source: ${doc.sourceUrl}\n`;
      content += `   Relevance: ${Math.round(doc.relevanceScore * 100)}%\n`;
      content += `   Last Updated: ${new Date(doc.lastUpdated).toLocaleDateString()}\n\n`;
    });

    return content;
  }

  private generateConfigurationExamples(): string {
    return `## Sample Configuration Files

### Database Connection Configuration
\`\`\`
server=localhost
database=portnox
username=portnox_user
password=<secure_password>
port=3306
ssl_mode=required
\`\`\`

### RADIUS Client Configuration
\`\`\`
client 192.168.1.0/24 {
    secret = <shared_secret>
    shortname = network_devices
    nastype = other
}
\`\`\`

### Active Directory Integration
\`\`\`
ldap_server=dc.company.com
ldap_port=389
bind_dn=CN=portnox,OU=Service Accounts,DC=company,DC=com
bind_password=<service_account_password>
base_dn=DC=company,DC=com
\`\`\``;
  }

  private generateTroubleshootingGuide(docs: DocumentationResult[]): string {
    return `## Common Issues and Resolutions

### Authentication Issues
**Problem**: Users cannot authenticate
**Solution**: 
1. Verify RADIUS client configuration
2. Check Active Directory connectivity
3. Validate user credentials and permissions

### Database Connectivity
**Problem**: Cannot connect to database
**Solution**:
1. Verify database server is running
2. Check firewall rules for database ports
3. Validate connection credentials

### Network Access Issues
**Problem**: Devices cannot communicate with NAC server
**Solution**:
1. Verify firewall rules are configured correctly
2. Check network routing and VLAN configuration
3. Test connectivity using telnet/nc tools`;
  }

  private generateRollbackProcedures(): string {
    return `## Rollback Procedures

### Pre-Rollback Checklist
1. Document current system state
2. Notify stakeholders of rollback initiation
3. Ensure backup systems are ready
4. Prepare communication plan

### Rollback Steps
1. **Stop NAC Services**: Stop all Portnox services
2. **Restore Database**: Restore database from pre-deployment backup
3. **Restore Configuration**: Restore configuration files
4. **Restart Services**: Restart previous NAC solution if applicable
5. **Verify Operation**: Test system functionality
6. **Update DNS**: Update DNS records if changed
7. **Notify Users**: Communicate rollback completion

### Post-Rollback Actions
1. Document rollback reasons and lessons learned
2. Plan remediation for identified issues
3. Schedule follow-up deployment attempt`;
  }

  private generateFirewallConfigExamples(): string {
    return `## Sample Firewall Configurations

### Cisco ASA Configuration
\`\`\`
access-list PORTNOX_IN extended permit tcp any host 192.168.1.100 eq 443
access-list PORTNOX_IN extended permit udp any host 192.168.1.100 eq 1812
access-list PORTNOX_IN extended permit udp any host 192.168.1.100 eq 1813
access-group PORTNOX_IN in interface inside
\`\`\`

### pfSense Configuration
\`\`\`
# Allow HTTPS management
pass in on $lan_if proto tcp from $admin_net to $portnox_server port 443
# Allow RADIUS authentication
pass in on $lan_if proto udp from $network_devices to $portnox_server port 1812
pass in on $lan_if proto udp from $network_devices to $portnox_server port 1813
\`\`\`

### Windows Firewall (PowerShell)
\`\`\`powershell
New-NetFirewallRule -DisplayName "Portnox HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443
New-NetFirewallRule -DisplayName "Portnox RADIUS Auth" -Direction Inbound -Protocol UDP -LocalPort 1812
New-NetFirewallRule -DisplayName "Portnox RADIUS Acct" -Direction Inbound -Protocol UDP -LocalPort 1813
\`\`\``;
  }

  private generatePortReference(): string {
    return `## Complete Port Reference

### Core Services
| Service | Port | Protocol | Direction | Purpose |
|---------|------|----------|-----------|---------|
| HTTPS Management | 443 | TCP | Inbound | Web console access |
| RADIUS Auth | 1812 | UDP | Inbound | Authentication requests |
| RADIUS Accounting | 1813 | UDP | Inbound | Accounting messages |
| Database | 3306/5432/1433 | TCP | Outbound | Database connectivity |

### Integration Services
| Service | Port | Protocol | Direction | Purpose |
|---------|------|----------|-----------|---------|
| LDAP | 389 | TCP | Outbound | Directory queries |
| LDAPS | 636 | TCP | Outbound | Secure directory queries |
| SNMP | 161 | UDP | Outbound | Device monitoring |
| SMTP | 25/587/465 | TCP | Outbound | Email notifications |

### System Services
| Service | Port | Protocol | Direction | Purpose |
|---------|------|----------|-----------|---------|
| DNS | 53 | UDP | Outbound | Name resolution |
| NTP | 123 | UDP | Outbound | Time synchronization |
| Syslog | 514 | UDP | Outbound | Log forwarding |`;
  }

  // Remaining report type methods (stubs for now)
  private async generateTechnicalSpecificationsReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    return {
      executiveSummary: this.generateExecutiveSummary(scopingData, 'technical_specifications'),
      sections: [],
      appendices: [],
      references: this.generateReferences(docs)
    };
  }

  private async generateProjectSummaryReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    return {
      executiveSummary: this.generateExecutiveSummary(scopingData, 'project_summary'),
      sections: [],
      appendices: [],
      references: this.generateReferences(docs)
    };
  }

  private async generateVendorComparisonReport(scopingData: any, docs: DocumentationResult[]): Promise<ReportContent> {
    return {
      executiveSummary: this.generateExecutiveSummary(scopingData, 'vendor_comparison'),
      sections: [],
      appendices: [],
      references: this.generateReferences(docs)
    };
  }

  // Database and utility methods
  private async fetchProjectData(projectId: string): Promise<any> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  }

  private async gatherDocumentation(scopingData: any): Promise<DocumentationResult[]> {
    const results: DocumentationResult[] = [];

    // Check cache first
    const cacheKey = this.generateCacheKey(scopingData);
    if (this.documentationCache.has(cacheKey)) {
      return this.documentationCache.get(cacheKey)!;
    }

    try {
      // Gather Portnox documentation
      const portnoxRequest: PortnoxDocumentationRequest = {
        vendor: scopingData?.vendorSelection?.preferred_vendors?.[0],
        documentType: 'prerequisites',
        urgency: 'high'
      };

      const portnoxDocs = await firecrawlerService.crawlPortnoxDocumentation(portnoxRequest);
      results.push(...portnoxDocs);

      // Gather firewall requirements documentation
      const firewallRequest: PortnoxDocumentationRequest = {
        documentType: 'firewall_requirements',
        urgency: 'high'
      };

      const firewallDocs = await firecrawlerService.crawlPortnoxDocumentation(firewallRequest);
      results.push(...firewallDocs);

      // Cache results
      this.documentationCache.set(cacheKey, results);

    } catch (error) {
      console.error('Error gathering documentation:', error);
    }

    return results;
  }

  private async storeReport(report: EnterpriseReport): Promise<void> {
    try {
      const { error } = await supabase.from('enterprise_reports').insert([{
        id: report.id,
        title: report.title,
        type: report.type,
        project_id: report.projectId,
        generated_at: report.generatedAt,
        generated_by: report.generatedBy,
        version: report.version,
        status: report.status,
        content: report.content,
        metadata: report.metadata
      }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing report:', error);
    }
  }

  private generateReportId(): string {
    return `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportTitle(type: string, projectName: string): string {
    const titles = {
      prerequisites: `Prerequisites Report - ${projectName}`,
      deployment_checklist: `Deployment Checklist - ${projectName}`,
      firewall_requirements: `Firewall Requirements - ${projectName}`,
      technical_specifications: `Technical Specifications - ${projectName}`,
      project_summary: `Project Summary - ${projectName}`,
      vendor_comparison: `Vendor Comparison - ${projectName}`
    };

    return titles[type as keyof typeof titles] || `Report - ${projectName}`;
  }

  private generateCacheKey(scopingData: any): string {
    const key = JSON.stringify({
      vendors: scopingData?.vendorSelection?.preferred_vendors,
      useCases: scopingData?.useCaseAnalysis?.primary_use_cases?.map((uc: UseCase) => uc.id),
      industry: scopingData?.organization?.industry
    });
    
    return Buffer.from(key).toString('base64').substring(0, 32);
  }
}

export const enterpriseReportGenerator = new EnterpriseReportGenerator();
export default EnterpriseReportGenerator;
