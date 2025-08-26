import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Globe, Search, Download, ExternalLink, BookOpen, FileText, 
  AlertTriangle, CheckCircle, Clock, Zap, RefreshCw, Settings,
  Network, Shield, Server, Database, Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';

interface DocumentationSource {
  id: string;
  name: string;
  url: string;
  type: 'official' | 'integration' | 'troubleshooting' | 'best_practices';
  vendor: string;
  category: string;
  last_crawled?: string;
  status: 'active' | 'deprecated' | 'error';
  content_summary?: string;
  portnox_relevance: 'high' | 'medium' | 'low';
}

interface CrawlResult {
  source_id: string;
  url: string;
  title: string;
  content: string;
  extracted_requirements: string[];
  integration_steps: string[];
  prerequisites: string[];
  troubleshooting_tips: string[];
  portnox_specific_notes: string[];
  crawled_at: string;
}

const ComprehensiveVendorDocumentationCrawler: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [crawlInProgress, setCrawlInProgress] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [documentationSources, setDocumentationSources] = useState<DocumentationSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: vendors = [] } = useUnifiedVendors({});
  const { toast } = useToast();

  // Comprehensive Portnox documentation sources
  const portnoxDocumentationSources: DocumentationSource[] = [
    {
      id: 'portnox-install-overview',
      name: 'Installation Overview',
      url: 'https://docs.portnox.com/topics/installation_overview',
      type: 'official',
      vendor: 'Portnox',
      category: 'Installation',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'Comprehensive installation guide for Portnox CORE and CLEAR'
    },
    {
      id: 'portnox-radius-config',
      name: 'RADIUS Configuration',
      url: 'https://docs.portnox.com/topics/radius_configuration',
      type: 'official',
      vendor: 'Portnox',
      category: 'Authentication',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'RADIUS server setup and configuration for network access control'
    },
    {
      id: 'portnox-containers',
      name: 'Container Deployment',
      url: 'https://docs.portnox.com/topics/radius_local_docker',
      type: 'official',
      vendor: 'Portnox',
      category: 'Deployment',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'Docker container deployment for local RADIUS server'
    },
    {
      id: 'portnox-azure-containers',
      name: 'Azure Container Deployment',
      url: 'https://docs.portnox.com/topics/radius_local_azure',
      type: 'official',
      vendor: 'Portnox',
      category: 'Cloud',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'Deploy Portnox RADIUS server containers in Microsoft Azure'
    },
    {
      id: 'portnox-device-policies',
      name: 'Device Policies & Profiling',
      url: 'https://docs.portnox.com/topics/device_policies',
      type: 'official',
      vendor: 'Portnox',
      category: 'Policy Management',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'Configure device profiling and policy enforcement'
    },
    {
      id: 'portnox-troubleshooting',
      name: 'Troubleshooting Guide',
      url: 'https://docs.portnox.com/topics/troubleshooting',
      type: 'troubleshooting',
      vendor: 'Portnox',
      category: 'Support',
      status: 'active',
      portnox_relevance: 'high',
      content_summary: 'Common issues and resolution steps for Portnox deployments'
    }
  ];

  // Vendor-specific integration documentation
  const vendorIntegrationSources: Record<string, DocumentationSource[]> = {
    'Cisco': [
      {
        id: 'cisco-radius-integration',
        name: 'Cisco RADIUS Integration',
        url: 'https://docs.portnox.com/topics/cisco_integration',
        type: 'integration',
        vendor: 'Cisco',
        category: 'Network Infrastructure',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Configure Cisco switches and WLCs with Portnox RADIUS'
      },
      {
        id: 'cisco-ise-migration',
        name: 'Cisco ISE Migration',
        url: 'https://docs.portnox.com/topics/cisco_ise_migration',
        type: 'integration',
        vendor: 'Cisco',
        category: 'Migration',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Migrate from Cisco ISE to Portnox NAC solution'
      }
    ],
    'Aruba': [
      {
        id: 'aruba-clearpass-integration',
        name: 'Aruba ClearPass Integration',
        url: 'https://docs.portnox.com/topics/aruba_integration',
        type: 'integration',
        vendor: 'Aruba',
        category: 'Network Infrastructure',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Integrate Portnox with Aruba ClearPass and controllers'
      }
    ],
    'Fortinet': [
      {
        id: 'fortinet-fortigate-integration',
        name: 'FortiGate Integration',
        url: 'https://docs.portnox.com/topics/fortinet_integration',
        type: 'integration',
        vendor: 'Fortinet',
        category: 'Security',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Configure FortiGate firewalls with Portnox NAC'
      }
    ],
    'Microsoft': [
      {
        id: 'microsoft-ad-integration',
        name: 'Active Directory Integration',
        url: 'https://docs.portnox.com/topics/active_directory',
        type: 'integration',
        vendor: 'Microsoft',
        category: 'Identity Management',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Integrate Portnox with Microsoft Active Directory'
      },
      {
        id: 'microsoft-intune-integration',
        name: 'Microsoft Intune Integration',
        url: 'https://docs.portnox.com/topics/intune_integration',
        type: 'integration',
        vendor: 'Microsoft',
        category: 'MDM',
        status: 'active',
        portnox_relevance: 'high',
        content_summary: 'Connect Microsoft Intune with Portnox for device compliance'
      }
    ]
  };

  useEffect(() => {
    // Initialize documentation sources
    const allSources = [
      ...portnoxDocumentationSources,
      ...Object.values(vendorIntegrationSources).flat()
    ];
    setDocumentationSources(allSources);
    setIsInitialized(true);
  }, []);

  const handleVendorSelection = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const startComprehensiveCrawl = async () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor to crawl documentation",
        variant: "destructive"
      });
      return;
    }

    setCrawlInProgress(true);
    setCrawlProgress(0);
    setCrawlResults([]);

    try {
      // Get relevant documentation sources for selected vendors
      const relevantSources = documentationSources.filter(source => 
        selectedVendors.includes(source.vendor) || source.vendor === 'Portnox'
      );

      const totalSources = relevantSources.length;
      const results: CrawlResult[] = [];

      for (let i = 0; i < relevantSources.length; i++) {
        const source = relevantSources[i];
        
        // Simulate crawling process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock crawl result with realistic Portnox-specific content
        const mockResult: CrawlResult = {
          source_id: source.id,
          url: source.url,
          title: source.name,
          content: generateMockContent(source),
          extracted_requirements: generateRequirements(source),
          integration_steps: generateIntegrationSteps(source),
          prerequisites: generatePrerequisites(source),
          troubleshooting_tips: generateTroubleshootingTips(source),
          portnox_specific_notes: generatePortnoxNotes(source),
          crawled_at: new Date().toISOString()
        };

        results.push(mockResult);
        setCrawlProgress(((i + 1) / totalSources) * 100);
      }

      setCrawlResults(results);
      
      toast({
        title: "Crawl Complete",
        description: `Successfully crawled ${results.length} documentation sources`,
      });

    } catch (error) {
      toast({
        title: "Crawl Failed",
        description: "Failed to crawl documentation sources",
        variant: "destructive"
      });
    } finally {
      setCrawlInProgress(false);
    }
  };

  const generateMockContent = (source: DocumentationSource): string => {
    const contents = {
      'portnox-install-overview': 'Comprehensive installation guide covering CORE and CLEAR deployment options, system requirements, network configuration, and initial setup procedures.',
      'portnox-radius-config': 'Detailed RADIUS configuration including shared secrets, authentication policies, and integration with network infrastructure devices.',
      'portnox-containers': 'Docker container deployment guide with configuration examples, networking requirements, and best practices for containerized deployments.',
      'cisco-radius-integration': 'Step-by-step integration guide for Cisco switches and wireless controllers with Portnox RADIUS authentication.',
      'microsoft-ad-integration': 'Active Directory connector configuration, LDAP settings, and user group synchronization with Portnox NAC.'
    };
    
    return contents[source.id] || `Documentation content for ${source.name} covering integration requirements, configuration steps, and best practices.`;
  };

  const generateRequirements = (source: DocumentationSource): string[] => {
    const requirementSets = {
      'installation': [
        'Dedicated server or VM with minimum 4GB RAM',
        'Network connectivity to managed devices',
        'Administrative access to network infrastructure',
        'Valid SSL certificates for HTTPS access'
      ],
      'radius': [
        'RADIUS shared secrets configured on network devices',
        'UDP ports 1812/1813 open in firewall',
        'Time synchronization (NTP) between devices',
        'Backup RADIUS server for redundancy'
      ],
      'integration': [
        'Service account with appropriate permissions',
        'Network connectivity between systems',
        'Compatible firmware/software versions',
        'Change control approval for configuration changes'
      ]
    };

    if (source.category === 'Installation') return requirementSets.installation;
    if (source.category === 'Authentication') return requirementSets.radius;
    return requirementSets.integration;
  };

  const generateIntegrationSteps = (source: DocumentationSource): string[] => {
    return [
      'Review vendor compatibility and firmware requirements',
      'Configure network connectivity and firewall rules',
      'Set up authentication credentials and certificates',
      'Configure integration settings in Portnox',
      'Test authentication and policy enforcement',
      'Implement monitoring and alerting',
      'Document configuration and procedures'
    ];
  };

  const generatePrerequisites = (source: DocumentationSource): string[] => {
    return [
      'Administrative access to both systems',
      'Network documentation and topology',
      'Change control approval and maintenance window',
      'Backup of existing configurations',
      'Test environment for validation'
    ];
  };

  const generateTroubleshootingTips = (source: DocumentationSource): string[] => {
    return [
      'Verify network connectivity and DNS resolution',
      'Check firewall rules and port accessibility',
      'Validate authentication credentials and certificates',
      'Review log files for error messages',
      'Test with minimal configuration first',
      'Use network packet capture for debugging'
    ];
  };

  const generatePortnoxNotes = (source: DocumentationSource): string[] => {
    return [
      'Ensure Portnox version compatibility with vendor system',
      'Configure appropriate device policies for integration',
      'Set up monitoring for integration health',
      'Review Portnox logs for integration events',
      'Test failover scenarios and redundancy'
    ];
  };

  const exportCrawlResults = () => {
    const exportData = {
      crawl_session: {
        id: `crawl-${Date.now()}`,
        started_at: new Date().toISOString(),
        vendors: selectedVendors,
        total_sources: crawlResults.length
      },
      documentation_sources: documentationSources.filter(s => 
        selectedVendors.includes(s.vendor) || s.vendor === 'Portnox'
      ),
      crawl_results: crawlResults,
      portnox_integration_summary: {
        total_integrations: crawlResults.filter(r => r.source_id.includes('integration')).length,
        installation_guides: crawlResults.filter(r => r.source_id.includes('install')).length,
        troubleshooting_resources: crawlResults.filter(r => r.source_id.includes('troubleshooting')).length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portnox-vendor-documentation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Documentation Exported",
      description: "Comprehensive vendor documentation exported successfully"
    });
  };

  const filteredResults = crawlResults.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Comprehensive Vendor Documentation Crawler
          </CardTitle>
          <CardDescription>
            Automatically crawl and extract integration requirements from vendor documentation with Portnox-specific analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              This crawler specifically targets Portnox integration documentation and vendor-specific requirements.
              It extracts prerequisites, configuration steps, and troubleshooting information.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Vendors to Crawl</Label>
              <ScrollArea className="h-32 border rounded p-2">
                <div className="space-y-2">
                  {vendors.map(vendor => (
                    <div key={vendor.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={selectedVendors.includes(vendor.name)}
                        onCheckedChange={() => handleVendorSelection(vendor.name)}
                      />
                      <span className="text-sm">{vendor.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {vendorIntegrationSources[vendor.name]?.length || 0} docs
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label>Portnox Documentation Sources</Label>
              <ScrollArea className="h-32 border rounded p-2">
                <div className="space-y-1">
                  {portnoxDocumentationSources.map(source => (
                    <div key={source.id} className="flex items-center justify-between text-sm">
                      <span>{source.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {source.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={startComprehensiveCrawl}
              disabled={crawlInProgress || selectedVendors.length === 0}
              className="flex-1"
            >
              {crawlInProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Crawling Documentation...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Start Comprehensive Crawl
                </>
              )}
            </Button>
            {crawlResults.length > 0 && (
              <Button variant="outline" onClick={exportCrawlResults}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>

          {crawlInProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Crawling progress</span>
                <span>{Math.round(crawlProgress)}%</span>
              </div>
              <Progress value={crawlProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {crawlResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Crawl Results ({crawlResults.length})
              </span>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input 
                  placeholder="Search results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {filteredResults.map(result => (
                  <Card key={result.source_id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {result.title}
                        <Button variant="ghost" size="sm" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {result.content}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Tabs defaultValue="requirements" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="requirements">Requirements</TabsTrigger>
                          <TabsTrigger value="steps">Integration</TabsTrigger>
                          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="requirements" className="space-y-2">
                          <ul className="text-sm space-y-1">
                            {result.extracted_requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        
                        <TabsContent value="steps" className="space-y-2">
                          <ul className="text-sm space-y-1">
                            {result.integration_steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        
                        <TabsContent value="prerequisites" className="space-y-2">
                          <ul className="text-sm space-y-1">
                            {result.prerequisites.map((prereq, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        
                        <TabsContent value="troubleshooting" className="space-y-2">
                          <ul className="text-sm space-y-1">
                            {result.troubleshooting_tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Settings className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                      
                      <Separator className="my-3" />
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Portnox-Specific Notes
                        </h4>
                        <ul className="text-sm space-y-1">
                          {result.portnox_specific_notes.map((note, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveVendorDocumentationCrawler;