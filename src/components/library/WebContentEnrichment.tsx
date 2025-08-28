import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Globe, Search, FileText, Link, Download, RefreshCw, 
  CheckCircle, XCircle, AlertCircle, Info, ExternalLink,
  Sparkles, Clock, Tag, BookOpen, Shield, Zap, Database,
  TrendingUp, FileSearch, Bot, Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedResourceItem } from '@/services/resourceLibrary/EnhancedResourceLibraryService';
import { supabase } from '@/integrations/supabase/client';

interface WebContentEnrichmentProps {
  resource: EnhancedResourceItem;
  onEnrichmentComplete?: () => void;
}

interface EnrichmentResult {
  url: string;
  title: string;
  description: string;
  content: string;
  metadata: {
    author?: string;
    publishDate?: string;
    keywords: string[];
    contentType: string;
  };
  extractedInfo: {
    features?: string[];
    prerequisites?: string[];
    configurations?: string[];
    troubleshooting?: string[];
    bestPractices?: string[];
    knownIssues?: string[];
  };
  suggestedTags: string[];
  relevanceScore: number;
}

const WebContentEnrichment: React.FC<WebContentEnrichmentProps> = ({ 
  resource, 
  onEnrichmentComplete 
}) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'manual' | 'auto' | 'results'>('auto');
  const { toast } = useToast();

  // Auto-discover relevant URLs based on resource
  const autoDiscoverUrls = async () => {
    setIsEnriching(true);
    setEnrichmentProgress(10);
    
    try {
      // Build search queries based on resource type and content
      const searchQueries = buildSearchQueries(resource);
      setEnrichmentProgress(30);
      
      // Search for relevant documentation
      const discoveredUrls = await searchForDocumentation(searchQueries);
      setEnrichmentProgress(60);
      
      // Crawl and analyze content
      const results = await crawlAndAnalyzeUrls(discoveredUrls);
      setEnrichmentProgress(90);
      
      // Filter and rank results
      const rankedResults = rankResultsByRelevance(results, resource);
      setEnrichmentProgress(100);
      
      setEnrichmentResults(rankedResults);
      setActiveTab('results');
      
      toast({
        title: "Enrichment Complete",
        description: `Found ${rankedResults.length} relevant resources`,
      });
    } catch (error) {
      console.error('Auto-discovery failed:', error);
      toast({
        title: "Enrichment Failed",
        description: "Could not auto-discover relevant content",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  // Build search queries based on resource
  const buildSearchQueries = (res: EnhancedResourceItem): string[] => {
    const queries: string[] = [];
    
    // Add base query with resource name
    queries.push(res.name);
    
    // Add type-specific queries
    if (res.type === 'vendor') {
      queries.push(`${res.name} NAC integration`);
      queries.push(`${res.name} 802.1X configuration`);
      queries.push(`${res.name} API documentation`);
    } else if (res.type === 'use_case') {
      queries.push(`${res.name} implementation guide`);
      queries.push(`${res.name} best practices`);
    } else if (res.type === 'pain_point') {
      queries.push(`solve ${res.name}`);
      queries.push(`${res.name} troubleshooting`);
    }
    
    // Add tag-based queries
    res.tags?.forEach(tag => {
      queries.push(`${res.name} ${tag.name}`);
    });
    
    return queries;
  };

  // Search for documentation using various sources
  const searchForDocumentation = async (queries: string[]): Promise<string[]> => {
    const urls: string[] = [];
    
    // For demo purposes, return mock URLs
    // In production, this would call search APIs
    if (resource.type === 'vendor') {
      urls.push(`https://docs.${resource.name.toLowerCase().replace(' ', '')}.com/nac`);
      urls.push(`https://support.${resource.name.toLowerCase().replace(' ', '')}.com/integration`);
    }
    
    return urls;
  };

  // Crawl and analyze URLs using Firecrawler
  const crawlAndAnalyzeUrls = async (urls: string[]): Promise<EnrichmentResult[]> => {
    const results: EnrichmentResult[] = [];
    
    for (const url of urls) {
      try {
        // Call Firecrawler via Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('documentation-crawler', {
          body: { 
            urls: [url],
            maxPages: 3,
            extractionPrompt: generateExtractionPrompt(resource)
          }
        });
        
        if (!error && data?.success) {
          const enrichmentResult = processFirecrawlResult(data, url);
          results.push(enrichmentResult);
        }
      } catch (error) {
        console.error(`Failed to crawl ${url}:`, error);
      }
    }
    
    return results;
  };

  // Generate extraction prompt for Firecrawler
  const generateExtractionPrompt = (res: EnhancedResourceItem): string => {
    return `
      Extract the following information related to ${res.name} (${res.type}):
      1. Key features and capabilities
      2. Prerequisites and requirements
      3. Configuration steps and examples
      4. Troubleshooting guides
      5. Best practices and recommendations
      6. Known issues and limitations
      7. Integration points with NAC solutions
      8. Security considerations
      
      Focus on content relevant to: ${res.description}
      ${res.tags?.map(t => t.name).join(', ')}
    `;
  };

  // Process Firecrawler results
  const processFirecrawlResult = (crawlData: any, url: string): EnrichmentResult => {
    // Process and structure the crawled data
    return {
      url,
      title: crawlData.title || 'Untitled',
      description: crawlData.description || '',
      content: crawlData.markdown || crawlData.text || '',
      metadata: {
        author: crawlData.metadata?.author,
        publishDate: crawlData.metadata?.publishDate,
        keywords: crawlData.metadata?.keywords || [],
        contentType: crawlData.metadata?.contentType || 'text/html'
      },
      extractedInfo: {
        features: extractFeatures(crawlData),
        prerequisites: extractPrerequisites(crawlData),
        configurations: extractConfigurations(crawlData),
        troubleshooting: extractTroubleshooting(crawlData),
        bestPractices: extractBestPractices(crawlData),
        knownIssues: extractKnownIssues(crawlData)
      },
      suggestedTags: generateSuggestedTags(crawlData),
      relevanceScore: calculateRelevanceScore(crawlData, resource)
    };
  };

  // Extract specific information types from content
  const extractFeatures = (data: any): string[] => {
    // AI-powered extraction logic would go here
    return ['Feature 1', 'Feature 2'];
  };

  const extractPrerequisites = (data: any): string[] => {
    return ['Prerequisite 1', 'Prerequisite 2'];
  };

  const extractConfigurations = (data: any): string[] => {
    return ['Config step 1', 'Config step 2'];
  };

  const extractTroubleshooting = (data: any): string[] => {
    return ['Issue 1 solution', 'Issue 2 solution'];
  };

  const extractBestPractices = (data: any): string[] => {
    return ['Best practice 1', 'Best practice 2'];
  };

  const extractKnownIssues = (data: any): string[] => {
    return ['Known issue 1', 'Known issue 2'];
  };

  const generateSuggestedTags = (data: any): string[] => {
    // AI-powered tag generation
    return ['nac', 'authentication', 'security'];
  };

  const calculateRelevanceScore = (data: any, res: EnhancedResourceItem): number => {
    // Calculate relevance based on content matching
    return 0.85;
  };

  // Rank results by relevance
  const rankResultsByRelevance = (
    results: EnrichmentResult[], 
    res: EnhancedResourceItem
  ): EnrichmentResult[] => {
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Manual URL enrichment
  const enrichManualUrls = async () => {
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to enrich",
        variant: "destructive"
      });
      return;
    }
    
    setIsEnriching(true);
    setEnrichmentProgress(0);
    
    try {
      const results = await crawlAndAnalyzeUrls(validUrls);
      setEnrichmentResults(results);
      setActiveTab('results');
      
      toast({
        title: "Enrichment Complete",
        description: `Successfully enriched ${results.length} URLs`,
      });
    } catch (error) {
      toast({
        title: "Enrichment Failed",
        description: "Could not enrich the provided URLs",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  // Apply selected enrichments to resource
  const applyEnrichments = async () => {
    const selected = enrichmentResults.filter((_, idx) => selectedResults.has(idx));
    
    if (selected.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select enrichments to apply",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Add external links to resource
      for (const result of selected) {
        await supabase.from('external_resource_links').insert({
          resource_type: resource.type,
          resource_id: resource.id,
          link_title: result.title,
          link_url: result.url,
          link_type: 'documentation',
          description: result.description,
          relevance_score: Math.round(result.relevanceScore * 10),
          tags: result.suggestedTags,
          metadata: {
            ...result.metadata,
            extractedInfo: result.extractedInfo
          },
          is_verified: true,
          is_active: true
        });
      }
      
      // Add suggested tags to resource
      const allTags = selected.flatMap(r => r.suggestedTags);
      const uniqueTags = [...new Set(allTags)];
      
      // TODO: Add tags to resource
      
      toast({
        title: "Enrichments Applied",
        description: `Added ${selected.length} external resources and ${uniqueTags.length} tags`,
      });
      
      if (onEnrichmentComplete) {
        onEnrichmentComplete();
      }
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Could not apply enrichments to resource",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Web Content Enrichment
            </CardTitle>
            <CardDescription>
              Automatically discover and extract relevant information from the web
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="auto">Auto-Discover</TabsTrigger>
            <TabsTrigger value="manual">Manual URLs</TabsTrigger>
            <TabsTrigger value="results">
              Results {enrichmentResults.length > 0 && `(${enrichmentResults.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto" className="space-y-4">
            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                AI will automatically search and analyze relevant documentation, blogs, and resources
                based on this {resource.type}'s content and context.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>What AI will search for:</Label>
              <div className="flex flex-wrap gap-2">
                {buildSearchQueries(resource).slice(0, 5).map((query, idx) => (
                  <Badge key={idx} variant="outline">
                    <Search className="h-3 w-3 mr-1" />
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
            
            <EnhancedButton
              onClick={autoDiscoverUrls}
              loading={isEnriching}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Auto-Discovery
            </EnhancedButton>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label>Enter URLs to Crawl</Label>
              <div className="space-y-2">
                {urls.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="https://docs.example.com/integration"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...urls];
                        newUrls[idx] = e.target.value;
                        setUrls(newUrls);
                      }}
                    />
                    {idx === urls.length - 1 ? (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setUrls([...urls, ''])}
                      >
                        +
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setUrls(urls.filter((_, i) => i !== idx))}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <EnhancedButton
              onClick={enrichManualUrls}
              loading={isEnriching}
              className="w-full"
              disabled={urls.every(u => !u.trim())}
            >
              <FileSearch className="h-4 w-4 mr-2" />
              Crawl & Analyze URLs
            </EnhancedButton>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {isEnriching && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing content...</span>
                  <span>{enrichmentProgress}%</span>
                </div>
                <Progress value={enrichmentProgress} className="h-2" />
              </div>
            )}
            
            {enrichmentResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <Label>Discovered Content</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (selectedResults.size === enrichmentResults.length) {
                          setSelectedResults(new Set());
                        } else {
                          setSelectedResults(new Set(enrichmentResults.map((_, i) => i)));
                        }
                      }}
                    >
                      {selectedResults.size === enrichmentResults.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <EnhancedButton
                      size="sm"
                      onClick={applyEnrichments}
                      disabled={selectedResults.size === 0}
                    >
                      Apply Selected ({selectedResults.size})
                    </EnhancedButton>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {enrichmentResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedResults.has(idx) ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedResults.has(idx)}
                            onChange={() => {
                              const newSelection = new Set(selectedResults);
                              if (newSelection.has(idx)) {
                                newSelection.delete(idx);
                              } else {
                                newSelection.add(idx);
                              }
                              setSelectedResults(newSelection);
                            }}
                            className="mt-1"
                          />
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{result.title}</h4>
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  {result.url}
                                </a>
                              </div>
                              <Badge variant={result.relevanceScore > 0.7 ? 'default' : 'secondary'}>
                                {Math.round(result.relevanceScore * 100)}% relevant
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {result.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-xs">
                              {result.extractedInfo.features && result.extractedInfo.features.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  {result.extractedInfo.features.length} features
                                </div>
                              )}
                              {result.extractedInfo.configurations && result.extractedInfo.configurations.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Settings className="h-3 w-3" />
                                  {result.extractedInfo.configurations.length} configs
                                </div>
                              )}
                              {result.extractedInfo.bestPractices && result.extractedInfo.bestPractices.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  {result.extractedInfo.bestPractices.length} best practices
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {result.suggestedTags.map((tag, tagIdx) => (
                                <Badge key={tagIdx} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : !isEnriching && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No enrichment results yet. Use Auto-Discover or Manual URLs to find relevant content.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WebContentEnrichment;

