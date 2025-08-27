import { supabase } from '@/integrations/supabase/client';

export interface CrawlJob {
  id: string;
  url: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    content_type?: string;
    word_count?: number;
    last_modified?: string;
  };
}

export interface CrawledContent {
  id: string;
  job_id: string;
  url: string;
  title: string;
  content: string;
  metadata: {
    keywords: string[];
    content_type: string;
    word_count: number;
    last_modified?: string;
    headers?: Record<string, string>;
    links?: string[];
    images?: string[];
  };
  created_at: string;
  updated_at: string;
}

export class PortnoxDocumentationCrawler {
  private baseUrl = 'https://docs.portnox.com';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Create a new crawl job
  async createCrawlJob(url: string, priority: CrawlJob['priority'] = 'medium'): Promise<CrawlJob> {
    const { data, error } = await supabase
      .from('firecrawler_jobs')
      .insert({
        url,
        priority,
        status: 'pending',
        metadata: {
          source: 'portnox_docs',
          crawler_type: 'documentation'
        }
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create crawl job: ${error.message}`);
    return data;
  }

  // Start crawling Portnox documentation
  async crawlPortnoxDocumentation(): Promise<CrawlJob[]> {
    const urls = await this.getPortnoxDocUrls();
    const jobs: CrawlJob[] = [];

    for (const url of urls) {
      try {
        const job = await this.createCrawlJob(url, 'high');
        jobs.push(job);
      } catch (error) {
        console.error(`Failed to create job for ${url}:`, error);
      }
    }

    return jobs;
  }

  // Get Portnox documentation URLs
  private async getPortnoxDocUrls(): Promise<string[]> {
    const baseUrls = [
      'https://docs.portnox.com',
      'https://docs.portnox.com/core/introduction',
      'https://docs.portnox.com/core/quick-start',
      'https://docs.portnox.com/core/installation',
      'https://docs.portnox.com/core/configuration',
      'https://docs.portnox.com/core/deployment',
      'https://docs.portnox.com/core/troubleshooting',
      'https://docs.portnox.com/api/introduction',
      'https://docs.portnox.com/api/authentication',
      'https://docs.portnox.com/api/endpoints',
      'https://docs.portnox.com/cloud/introduction',
      'https://docs.portnox.com/cloud/setup',
      'https://docs.portnox.com/cloud/management'
    ];

    return baseUrls;
  }

  // Crawl specific documentation sections
  async crawlSection(section: string): Promise<CrawlJob[]> {
    const sectionUrls = await this.getSectionUrls(section);
    const jobs: CrawlJob[] = [];

    for (const url of sectionUrls) {
      try {
        const job = await this.createCrawlJob(url, 'medium');
        jobs.push(job);
      } catch (error) {
        console.error(`Failed to create job for ${url}:`, error);
      }
    }

    return jobs;
  }

  private async getSectionUrls(section: string): Promise<string[]> {
    const sectionMap: Record<string, string[]> = {
      'core': [
        'https://docs.portnox.com/core/introduction',
        'https://docs.portnox.com/core/quick-start',
        'https://docs.portnox.com/core/installation',
        'https://docs.portnox.com/core/configuration',
        'https://docs.portnox.com/core/deployment',
        'https://docs.portnox.com/core/troubleshooting'
      ],
      'api': [
        'https://docs.portnox.com/api/introduction',
        'https://docs.portnox.com/api/authentication',
        'https://docs.portnox.com/api/endpoints',
        'https://docs.portnox.com/api/examples'
      ],
      'cloud': [
        'https://docs.portnox.com/cloud/introduction',
        'https://docs.portnox.com/cloud/setup',
        'https://docs.portnox.com/cloud/management',
        'https://docs.portnox.com/cloud/monitoring'
      ],
      'security': [
        'https://docs.portnox.com/security/best-practices',
        'https://docs.portnox.com/security/authentication',
        'https://docs.portnox.com/security/authorization',
        'https://docs.portnox.com/security/compliance'
      ]
    };

    return sectionMap[section] || [];
  }

  // Process crawled content and extract structured data
  async processCrawledContent(content: CrawledContent): Promise<any> {
    const processed = {
      id: content.id,
      url: content.url,
      title: content.title,
      content: content.content,
      extracted_data: {
        prerequisites: this.extractPrerequisites(content.content),
        firewall_requirements: this.extractFirewallRequirements(content.content),
        configuration_steps: this.extractConfigurationSteps(content.content),
        troubleshooting: this.extractTroubleshooting(content.content),
        api_endpoints: this.extractAPIEndpoints(content.content),
        security_considerations: this.extractSecurityConsiderations(content.content)
      },
      metadata: content.metadata,
      created_at: content.created_at
    };

    // Save processed content
    await this.saveProcessedContent(processed);
    return processed;
  }

  // Extract prerequisites from content
  private extractPrerequisites(content: string): string[] {
    const prerequisites: string[] = [];
    const prereqPatterns = [
      /prerequisites?:\s*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /before\s+you\s+begin[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /requirements?:\s*(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of prereqPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        prerequisites.push(...matches.map(match => match.trim()));
      }
    }

    return prerequisites;
  }

  // Extract firewall requirements
  private extractFirewallRequirements(content: string): any[] {
    const requirements: any[] = [];
    const firewallPatterns = [
      /port\s+(\d+)\s*(?:\(([^)]+)\))?\s*(?:for\s+([^,\n]+))?/gi,
      /firewall\s+rule[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /network\s+access[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of firewallPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        requirements.push({
          type: 'firewall_rule',
          details: match[0].trim()
        });
      }
    }

    return requirements;
  }

  // Extract configuration steps
  private extractConfigurationSteps(content: string): string[] {
    const steps: string[] = [];
    const stepPatterns = [
      /^\d+\.\s*(.+)$/gm,
      /^step\s+\d+[:\s]*(.+)$/gim,
      /^configure\s+(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of stepPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        steps.push(...matches.map(match => match.trim()));
      }
    }

    return steps;
  }

  // Extract troubleshooting information
  private extractTroubleshooting(content: string): any[] {
    const troubleshooting: any[] = [];
    const troublePatterns = [
      /troubleshoot[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /error[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /issue[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of troublePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        troubleshooting.push({
          type: 'troubleshooting',
          description: matches[0].trim()
        });
      }
    }

    return troubleshooting;
  }

  // Extract API endpoints
  private extractAPIEndpoints(content: string): any[] {
    const endpoints: any[] = [];
    const endpointPatterns = [
      /(GET|POST|PUT|DELETE|PATCH)\s+(\/[^\s]+)\s*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /endpoint[:\s]*(\/[^\s]+)\s*(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of endpointPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        endpoints.push({
          method: match[1]?.toUpperCase() || 'GET',
          path: match[2] || match[1],
          description: match[3] || match[2]
        });
      }
    }

    return endpoints;
  }

  // Extract security considerations
  private extractSecurityConsiderations(content: string): string[] {
    const security: string[] = [];
    const securityPatterns = [
      /security\s+(?:considerations?|note)[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /authentication[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi,
      /authorization[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    for (const pattern of securityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        security.push(...matches.map(match => match.trim()));
      }
    }

    return security;
  }

  // Save processed content to database
  private async saveProcessedContent(processed: any): Promise<void> {
    const { error } = await supabase
      .from('documentation_sources')
      .upsert({
        source_url: processed.url,
        content_type: 'portnox_documentation',
        extracted_data: processed.extracted_data,
        metadata: processed.metadata,
        last_crawled: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to save processed content:', error);
    }
  }

  // Get crawl job status
  async getJobStatus(jobId: string): Promise<CrawlJob | null> {
    const { data, error } = await supabase
      .from('firecrawler_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Failed to get job status:', error);
      return null;
    }

    return data;
  }

  // Get all crawl jobs
  async getAllJobs(limit = 100): Promise<CrawlJob[]> {
    const { data, error } = await supabase
      .from('firecrawler_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to get jobs:', error);
      return [];
    }

    return data || [];
  }

  // Search crawled content
  async searchContent(query: string, limit = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('documentation_sources')
      .select('*')
      .ilike('extracted_data', `%${query}%`)
      .order('last_crawled', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to search content:', error);
      return [];
    }

    return data || [];
  }

  // Associate crawled content with resources
  async associateWithResources(contentId: string, resourceType: string, resourceId: string): Promise<void> {
    const { error } = await supabase
      .from('external_resource_links')
      .insert({
        resource_type: resourceType,
        resource_id: resourceId,
        link_url: contentId, // This would be the actual URL
        link_type: 'documentation',
        is_verified: true,
        last_verified: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to associate content with resource:', error);
    }
  }
}

export const portnoxCrawler = new PortnoxDocumentationCrawler(
  import.meta.env.VITE_FIRECRAWLER_API_KEY || ''
);
