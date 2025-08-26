import { supabase } from '@/integrations/supabase/client';

export interface FirecrawlerConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface CrawlJob {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  crawlType: 'single' | 'sitemap' | 'batch';
  options: CrawlOptions;
  result?: CrawlResult;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface CrawlOptions {
  includeHtml?: boolean;
  includeMarkdown?: boolean;
  includeLinks?: boolean;
  includeImages?: boolean;
  maxPages?: number;
  allowedDomains?: string[];
  excludePatterns?: string[];
  waitFor?: number;
  screenshot?: boolean;
  extractMainContent?: boolean;
  followLinks?: boolean;
  respectRobotsTxt?: boolean;
}

export interface CrawlResult {
  url: string;
  title: string;
  description: string;
  html?: string;
  markdown?: string;
  text: string;
  links: Array<{
    url: string;
    text: string;
    type: 'internal' | 'external';
  }>;
  images: Array<{
    url: string;
    alt: string;
  }>;
  metadata: {
    author?: string;
    publishDate?: string;
    lastModified?: string;
    keywords?: string[];
    contentType: string;
    wordCount: number;
    readingTime: number;
  };
  screenshot?: string;
  extractedData?: any;
}

export interface PortnoxDocumentationRequest {
  vendor?: string;
  product?: string;
  version?: string;
  useCase?: string;
  documentType: 'installation' | 'configuration' | 'troubleshooting' | 'api' | 'release_notes' | 'prerequisites' | 'firewall_requirements';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface DocumentationResult {
  id: string;
  title: string;
  content: string;
  sourceUrl: string;
  lastUpdated: string;
  relevanceScore: number;
  sections: Array<{
    title: string;
    content: string;
    type: 'prerequisites' | 'steps' | 'configuration' | 'troubleshooting' | 'notes';
  }>;
  firewallRequirements?: Array<{
    service: string;
    ports: string[];
    protocol: 'TCP' | 'UDP' | 'ICMP';
    direction: 'inbound' | 'outbound' | 'bidirectional';
    source: string;
    destination: string;
    description: string;
  }>;
  prerequisites?: Array<{
    category: 'hardware' | 'software' | 'network' | 'permissions' | 'certificates';
    requirement: string;
    description: string;
    mandatory: boolean;
    alternatives?: string[];
  }>;
}

class FirecrawlerService {
  private config: FirecrawlerConfig;
  private crawlQueue: Map<string, CrawlJob> = new Map();

  constructor() {
    this.config = {
      apiKey: process.env.VITE_FIRECRAWLER_API_KEY || '',
      baseUrl: process.env.VITE_FIRECRAWLER_BASE_URL || 'https://api.firecrawl.dev',
      timeout: 30000,
      retryAttempts: 3
    };
  }

  /**
   * Crawl Portnox documentation based on specific requirements
   */
  async crawlPortnoxDocumentation(request: PortnoxDocumentationRequest): Promise<DocumentationResult[]> {
    const searchQueries = this.buildPortnoxSearchQueries(request);
    const results: DocumentationResult[] = [];

    for (const query of searchQueries) {
      try {
        const crawlResult = await this.performCrawl({
          url: query.url,
          crawlType: 'single',
          options: {
            includeMarkdown: true,
            includeLinks: true,
            extractMainContent: true,
            maxPages: query.maxPages || 1,
            followLinks: query.followLinks || false
          }
        });

        if (crawlResult.result) {
          const processedDoc = await this.processPortnoxDocument(crawlResult.result, request);
          if (processedDoc) {
            results.push(processedDoc);
          }
        }
      } catch (error) {
        console.error(`Failed to crawl ${query.url}:`, error);
      }
    }

    // Store results in database
    await this.storeDocumentationResults(results, request);

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Crawl vendor-specific documentation
   */
  async crawlVendorDocumentation(vendor: string, product: string, documentTypes: string[]): Promise<DocumentationResult[]> {
    const vendorUrls = this.getVendorDocumentationUrls(vendor, product);
    const results: DocumentationResult[] = [];

    for (const urlConfig of vendorUrls) {
      try {
        const crawlResult = await this.performCrawl({
          url: urlConfig.url,
          crawlType: urlConfig.type as any,
          options: {
            includeMarkdown: true,
            includeLinks: true,
            extractMainContent: true,
            maxPages: urlConfig.maxPages || 10,
            followLinks: true,
            allowedDomains: urlConfig.allowedDomains,
            excludePatterns: urlConfig.excludePatterns
          }
        });

        if (crawlResult.result) {
          const processedDoc = await this.processVendorDocument(crawlResult.result, vendor, product);
          if (processedDoc) {
            results.push(processedDoc);
          }
        }
      } catch (error) {
        console.error(`Failed to crawl vendor documentation for ${vendor}:`, error);
      }
    }

    return results;
  }

  /**
   * Perform actual crawl using Firecrawler API
   */
  private async performCrawl(request: {
    url: string;
    crawlType: 'single' | 'sitemap' | 'batch';
    options: CrawlOptions;
  }): Promise<CrawlJob> {
    const jobId = this.generateJobId();
    const job: CrawlJob = {
      id: jobId,
      url: request.url,
      status: 'pending',
      crawlType: request.crawlType,
      options: request.options,
      createdAt: new Date().toISOString()
    };

    this.crawlQueue.set(jobId, job);

    try {
      // Update status to running
      job.status = 'running';
      this.crawlQueue.set(jobId, job);

      // Make API call to Firecrawler
      const response = await this.callFirecrawlerAPI(request);
      
      // Process response
      job.result = response;
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      
    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      job.completedAt = new Date().toISOString();
    }

    this.crawlQueue.set(jobId, job);
    return job;
  }

  /**
   * Call Firecrawler API
   */
  private async callFirecrawlerAPI(request: {
    url: string;
    crawlType: 'single' | 'sitemap' | 'batch';
    options: CrawlOptions;
  }): Promise<CrawlResult> {
    const endpoint = request.crawlType === 'single' ? '/v0/scrape' : '/v0/crawl';
    
    const payload = {
      url: request.url,
      formats: ['markdown', 'html'],
      includeTags: request.options.includeLinks ? ['a'] : [],
      excludeTags: ['script', 'style', 'nav', 'footer'],
      waitFor: request.options.waitFor || 3000,
      timeout: this.config.timeout,
      ...request.options
    };

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Firecrawler API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      url: request.url,
      title: data.metadata?.title || 'Untitled',
      description: data.metadata?.description || '',
      html: data.html,
      markdown: data.markdown,
      text: data.text || this.extractTextFromMarkdown(data.markdown),
      links: this.extractLinks(data.markdown || data.html),
      images: this.extractImages(data.markdown || data.html),
      metadata: {
        author: data.metadata?.author,
        publishDate: data.metadata?.publishDate,
        lastModified: data.metadata?.lastModified,
        keywords: data.metadata?.keywords || [],
        contentType: data.metadata?.contentType || 'text/html',
        wordCount: this.countWords(data.text || data.markdown),
        readingTime: Math.ceil(this.countWords(data.text || data.markdown) / 200)
      },
      screenshot: data.screenshot,
      extractedData: data.extractedData
    };
  }

  /**
   * Build Portnox-specific search queries
   */
  private buildPortnoxSearchQueries(request: PortnoxDocumentationRequest): Array<{
    url: string;
    maxPages?: number;
    followLinks?: boolean;
  }> {
    const baseUrls = [
      'https://docs.portnox.com',
      'https://support.portnox.com',
      'https://kb.portnox.com',
      'https://community.portnox.com'
    ];

    const queries: Array<{ url: string; maxPages?: number; followLinks?: boolean }> = [];

    // Build specific URLs based on request
    const searchTerms = this.buildSearchTerms(request);
    
    for (const baseUrl of baseUrls) {
      for (const term of searchTerms) {
        queries.push({
          url: `${baseUrl}/search?q=${encodeURIComponent(term)}`,
          maxPages: 5,
          followLinks: true
        });
      }
    }

    // Add direct documentation paths
    if (request.documentType === 'installation') {
      queries.push(
        { url: 'https://docs.portnox.com/installation', maxPages: 10, followLinks: true },
        { url: 'https://docs.portnox.com/getting-started', maxPages: 5, followLinks: true }
      );
    }

    if (request.documentType === 'firewall_requirements') {
      queries.push(
        { url: 'https://docs.portnox.com/network-requirements', maxPages: 3, followLinks: true },
        { url: 'https://docs.portnox.com/firewall-configuration', maxPages: 3, followLinks: true },
        { url: 'https://support.portnox.com/ports-and-protocols', maxPages: 2, followLinks: true }
      );
    }

    if (request.documentType === 'prerequisites') {
      queries.push(
        { url: 'https://docs.portnox.com/prerequisites', maxPages: 5, followLinks: true },
        { url: 'https://docs.portnox.com/system-requirements', maxPages: 3, followLinks: true }
      );
    }

    return queries;
  }

  /**
   * Build search terms based on request
   */
  private buildSearchTerms(request: PortnoxDocumentationRequest): string[] {
    const terms: string[] = [];

    // Base terms
    terms.push('portnox');
    
    if (request.vendor) {
      terms.push(`${request.vendor} integration`);
      terms.push(`${request.vendor} configuration`);
    }

    if (request.product) {
      terms.push(`${request.product} setup`);
      terms.push(`${request.product} deployment`);
    }

    if (request.useCase) {
      terms.push(`${request.useCase} implementation`);
    }

    // Document type specific terms
    switch (request.documentType) {
      case 'installation':
        terms.push('installation guide', 'setup instructions', 'deployment steps');
        break;
      case 'configuration':
        terms.push('configuration guide', 'settings', 'parameters');
        break;
      case 'troubleshooting':
        terms.push('troubleshooting', 'common issues', 'error resolution');
        break;
      case 'firewall_requirements':
        terms.push('firewall ports', 'network requirements', 'port configuration', 'protocol requirements');
        break;
      case 'prerequisites':
        terms.push('prerequisites', 'system requirements', 'before you begin');
        break;
    }

    return terms;
  }

  /**
   * Process Portnox documentation and extract structured information
   */
  private async processPortnoxDocument(crawlResult: CrawlResult, request: PortnoxDocumentationRequest): Promise<DocumentationResult | null> {
    if (!crawlResult.markdown && !crawlResult.text) {
      return null;
    }

    const content = crawlResult.markdown || crawlResult.text;
    const relevanceScore = this.calculateRelevanceScore(content, request);

    if (relevanceScore < 0.3) {
      return null; // Skip low-relevance content
    }

    const sections = this.extractSections(content);
    const firewallRequirements = this.extractFirewallRequirements(content);
    const prerequisites = this.extractPrerequisites(content);

    const result: DocumentationResult = {
      id: this.generateDocId(),
      title: crawlResult.title,
      content: content,
      sourceUrl: crawlResult.url,
      lastUpdated: crawlResult.metadata.lastModified || new Date().toISOString(),
      relevanceScore,
      sections,
      firewallRequirements: firewallRequirements.length > 0 ? firewallRequirements : undefined,
      prerequisites: prerequisites.length > 0 ? prerequisites : undefined
    };

    return result;
  }

  /**
   * Process vendor-specific documentation
   */
  private async processVendorDocument(crawlResult: CrawlResult, vendor: string, product: string): Promise<DocumentationResult | null> {
    if (!crawlResult.markdown && !crawlResult.text) {
      return null;
    }

    const content = crawlResult.markdown || crawlResult.text;
    const relevanceScore = this.calculateVendorRelevanceScore(content, vendor, product);

    if (relevanceScore < 0.2) {
      return null;
    }

    const sections = this.extractSections(content);
    const firewallRequirements = this.extractFirewallRequirements(content);
    const prerequisites = this.extractPrerequisites(content);

    return {
      id: this.generateDocId(),
      title: crawlResult.title,
      content: content,
      sourceUrl: crawlResult.url,
      lastUpdated: crawlResult.metadata.lastModified || new Date().toISOString(),
      relevanceScore,
      sections,
      firewallRequirements: firewallRequirements.length > 0 ? firewallRequirements : undefined,
      prerequisites: prerequisites.length > 0 ? prerequisites : undefined
    };
  }

  /**
   * Extract firewall requirements from documentation
   */
  private extractFirewallRequirements(content: string): DocumentationResult['firewallRequirements'] {
    const requirements: NonNullable<DocumentationResult['firewallRequirements']> = [];
    
    // Common port patterns
    const portPatterns = [
      /port\s+(\d+)(?:\/(\w+))?/gi,
      /(\d+)\/(\w+)/g,
      /tcp\s+(\d+)/gi,
      /udp\s+(\d+)/gi
    ];

    // Service-specific patterns
    const servicePatterns = [
      { service: 'HTTPS', ports: ['443'], protocol: 'TCP' as const, pattern: /https|ssl|443/i },
      { service: 'HTTP', ports: ['80'], protocol: 'TCP' as const, pattern: /http(?!s)|port 80/i },
      { service: 'RADIUS', ports: ['1812', '1813'], protocol: 'UDP' as const, pattern: /radius|1812|1813/i },
      { service: 'LDAP', ports: ['389'], protocol: 'TCP' as const, pattern: /ldap|389/i },
      { service: 'LDAPS', ports: ['636'], protocol: 'TCP' as const, pattern: /ldaps|636/i },
      { service: 'DNS', ports: ['53'], protocol: 'UDP' as const, pattern: /dns|53/i },
      { service: 'SNMP', ports: ['161'], protocol: 'UDP' as const, pattern: /snmp|161/i },
      { service: 'SSH', ports: ['22'], protocol: 'TCP' as const, pattern: /ssh|22/i },
      { service: 'Syslog', ports: ['514'], protocol: 'UDP' as const, pattern: /syslog|514/i },
      { service: 'NTP', ports: ['123'], protocol: 'UDP' as const, pattern: /ntp|123/i }
    ];

    // Extract service-specific requirements
    for (const servicePattern of servicePatterns) {
      if (servicePattern.pattern.test(content)) {
        requirements.push({
          service: servicePattern.service,
          ports: servicePattern.ports,
          protocol: servicePattern.protocol,
          direction: 'outbound',
          source: 'Portnox Server',
          destination: 'External Service',
          description: `${servicePattern.service} communication for ${servicePattern.service.toLowerCase()} services`
        });
      }
    }

    // Extract custom port requirements from content
    for (const pattern of portPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const port = match[1];
        const protocol = (match[2] || 'TCP').toUpperCase() as 'TCP' | 'UDP';
        
        requirements.push({
          service: 'Custom Service',
          ports: [port],
          protocol,
          direction: 'bidirectional',
          source: 'Any',
          destination: 'Any',
          description: `Port ${port}/${protocol} as specified in documentation`
        });
      }
    }

    return requirements;
  }

  /**
   * Extract prerequisites from documentation
   */
  private extractPrerequisites(content: string): DocumentationResult['prerequisites'] {
    const prerequisites: NonNullable<DocumentationResult['prerequisites']> = [];

    // Hardware requirements patterns
    const hardwarePatterns = [
      /(\d+)\s*(gb|mb)\s*(ram|memory)/gi,
      /(\d+)\s*(gb|tb)\s*(disk|storage|space)/gi,
      /(\d+)\s*(core|cpu|processor)/gi
    ];

    // Software requirements patterns
    const softwarePatterns = [
      /(windows|linux|ubuntu|centos|rhel)\s*(\d+(?:\.\d+)?)?/gi,
      /(java|jdk|jre)\s*(\d+(?:\.\d+)?)?/gi,
      /(mysql|postgresql|oracle|sql server)\s*(\d+(?:\.\d+)?)?/gi
    ];

    // Network requirements patterns
    const networkPatterns = [
      /(\d+)\s*(mbps|gbps|kbps)\s*(bandwidth|connection)/gi,
      /static\s*ip/gi,
      /domain\s*(controller|admin)/gi
    ];

    // Extract hardware requirements
    for (const pattern of hardwarePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        prerequisites.push({
          category: 'hardware',
          requirement: match[0],
          description: `Hardware requirement: ${match[0]}`,
          mandatory: true
        });
      }
    }

    // Extract software requirements
    for (const pattern of softwarePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        prerequisites.push({
          category: 'software',
          requirement: match[0],
          description: `Software requirement: ${match[0]}`,
          mandatory: true
        });
      }
    }

    // Extract network requirements
    for (const pattern of networkPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        prerequisites.push({
          category: 'network',
          requirement: match[0],
          description: `Network requirement: ${match[0]}`,
          mandatory: true
        });
      }
    }

    return prerequisites;
  }

  /**
   * Get vendor documentation URLs
   */
  private getVendorDocumentationUrls(vendor: string, product: string): Array<{
    url: string;
    type: string;
    maxPages?: number;
    allowedDomains?: string[];
    excludePatterns?: string[];
  }> {
    const vendorConfigs: Record<string, any> = {
      'cisco': {
        baseUrl: 'https://www.cisco.com/c/en/us/support',
        docPaths: ['/docs', '/configuration-guides', '/installation-guides'],
        allowedDomains: ['cisco.com'],
        excludePatterns: ['/community/', '/forums/']
      },
      'aruba': {
        baseUrl: 'https://www.arubanetworks.com/techdocs',
        docPaths: ['/instant', '/central', '/clearpass'],
        allowedDomains: ['arubanetworks.com'],
        excludePatterns: ['/community/']
      },
      'fortinet': {
        baseUrl: 'https://docs.fortinet.com',
        docPaths: ['/fortigate', '/fortiauthenticator', '/fortianalyzer'],
        allowedDomains: ['docs.fortinet.com'],
        excludePatterns: []
      }
    };

    const config = vendorConfigs[vendor.toLowerCase()];
    if (!config) {
      return [];
    }

    const urls = [];
    for (const path of config.docPaths) {
      urls.push({
        url: `${config.baseUrl}${path}`,
        type: 'sitemap',
        maxPages: 20,
        allowedDomains: config.allowedDomains,
        excludePatterns: config.excludePatterns
      });
    }

    return urls;
  }

  /**
   * Calculate relevance score for Portnox documentation
   */
  private calculateRelevanceScore(content: string, request: PortnoxDocumentationRequest): number {
    let score = 0;
    const contentLower = content.toLowerCase();

    // Base score for containing "portnox"
    if (contentLower.includes('portnox')) score += 0.3;

    // Vendor match
    if (request.vendor && contentLower.includes(request.vendor.toLowerCase())) score += 0.2;

    // Product match
    if (request.product && contentLower.includes(request.product.toLowerCase())) score += 0.2;

    // Use case match
    if (request.useCase && contentLower.includes(request.useCase.toLowerCase())) score += 0.15;

    // Document type specific scoring
    const typeKeywords = {
      'installation': ['install', 'setup', 'deploy', 'configure'],
      'configuration': ['config', 'setting', 'parameter', 'option'],
      'troubleshooting': ['troubleshoot', 'error', 'issue', 'problem', 'fix'],
      'firewall_requirements': ['firewall', 'port', 'protocol', 'network'],
      'prerequisites': ['prerequisite', 'requirement', 'before', 'needed']
    };

    const keywords = typeKeywords[request.documentType] || [];
    for (const keyword of keywords) {
      if (contentLower.includes(keyword)) score += 0.05;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate relevance score for vendor documentation
   */
  private calculateVendorRelevanceScore(content: string, vendor: string, product: string): number {
    let score = 0;
    const contentLower = content.toLowerCase();

    if (contentLower.includes(vendor.toLowerCase())) score += 0.4;
    if (contentLower.includes(product.toLowerCase())) score += 0.3;
    if (contentLower.includes('integration')) score += 0.1;
    if (contentLower.includes('api')) score += 0.1;
    if (contentLower.includes('configuration')) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Store documentation results in database
   */
  private async storeDocumentationResults(results: DocumentationResult[], request: PortnoxDocumentationRequest): Promise<void> {
    try {
      const { error } = await supabase.from('crawled_content').insert(
        results.map(result => ({
          url: result.sourceUrl,
          title: result.title,
          content_hash: this.generateContentHash(result.content),
          extracted_text: result.content,
          keywords: this.extractKeywords(result.content),
          metadata: {
            relevance_score: result.relevanceScore,
            sections: result.sections,
            firewall_requirements: result.firewallRequirements,
            prerequisites: result.prerequisites,
            request_context: request
          },
          document_type: request.documentType,
          status: 'processed',
          last_crawled_at: new Date().toISOString(),
          next_crawl_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
      );

      if (error) {
        console.error('Error storing documentation results:', error);
      }
    } catch (error) {
      console.error('Failed to store documentation results:', error);
    }
  }

  // Helper methods
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDocId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateContentHash(content: string): string {
    // Simple hash function for content
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private extractTextFromMarkdown(markdown: string): string {
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .trim();
  }

  private extractLinks(content: string): CrawlResult['links'] {
    const links: CrawlResult['links'] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        url: match[2],
        text: match[1],
        type: match[2].startsWith('http') ? 'external' : 'internal'
      });
    }

    return links;
  }

  private extractImages(content: string): CrawlResult['images'] {
    const images: CrawlResult['images'] = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        url: match[2],
        alt: match[1]
      });
    }

    return images;
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private extractSections(content: string): DocumentationResult['sections'] {
    const sections: DocumentationResult['sections'] = [];
    const lines = content.split('\n');
    let currentSection: any = null;

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headerMatch[2],
          content: '',
          type: this.categorizeSection(headerMatch[2])
        };
      } else if (currentSection && line.trim()) {
        currentSection.content += line + '\n';
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  private categorizeSection(title: string): DocumentationResult['sections'][0]['type'] {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('prerequisite') || titleLower.includes('requirement') || titleLower.includes('before')) {
      return 'prerequisites';
    }
    if (titleLower.includes('step') || titleLower.includes('install') || titleLower.includes('setup')) {
      return 'steps';
    }
    if (titleLower.includes('config') || titleLower.includes('setting')) {
      return 'configuration';
    }
    if (titleLower.includes('troubleshoot') || titleLower.includes('issue') || titleLower.includes('error')) {
      return 'troubleshooting';
    }
    
    return 'notes';
  }

  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    return Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  /**
   * Get crawl job status
   */
  getCrawlJob(jobId: string): CrawlJob | undefined {
    return this.crawlQueue.get(jobId);
  }

  /**
   * Get all crawl jobs
   */
  getAllCrawlJobs(): CrawlJob[] {
    return Array.from(this.crawlQueue.values());
  }

  /**
   * Clear completed jobs
   */
  clearCompletedJobs(): void {
    for (const [jobId, job] of this.crawlQueue.entries()) {
      if (job.status === 'completed' || job.status === 'failed') {
        this.crawlQueue.delete(jobId);
      }
    }
  }
}

export const firecrawlerService = new FirecrawlerService();
export default FirecrawlerService;
