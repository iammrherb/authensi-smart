import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Share2, 
  Users, 
  FileText, 
  Globe, 
  Lock, 
  Clock,
  RefreshCw,
  Download,
  Upload,
  Settings,
  BookOpen,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useConsolidateResources,
  useEnrichResources,
  useResourceLibraryStatus,
  useCrossTenantResources,
  useSessionManager,
  useGetSharedResources
} from "@/hooks/useEnhancedResourceLibrary";

interface EnrichmentProgress {
  phase: 'idle' | 'consolidating' | 'enriching' | 'complete' | 'error';
  progress: number;
  currentItem: string;
  completed: number;
  total: number;
}

const EnhancedResourceLibraryManager: React.FC = () => {
  const [enrichmentProgress, setEnrichmentProgress] = useState<EnrichmentProgress>({
    phase: 'idle',
    progress: 0,
    currentItem: '',
    completed: 0,
    total: 0
  });

  const [enrichmentSettings, setEnrichmentSettings] = useState({
    useFirecrawl: true,
    useAI: true,
    resourceType: 'all' as 'vendors' | 'models' | 'templates' | 'use_cases' | 'requirements' | 'all'
  });

  const [sessionSettings, setSessionSettings] = useState({
    sessionType: 'scoping' as 'scoping' | 'configuration' | 'planning' | 'tracking',
    expirationHours: 72,
    sharingEnabled: true
  });

  const { toast } = useToast();
  const consolidateResources = useConsolidateResources();
  const enrichResources = useEnrichResources();
  const { data: libraryStatus } = useResourceLibraryStatus();
  const { data: crossTenantResources } = useCrossTenantResources(['vendor', 'template', 'use_case', 'requirement']);
  const { data: sharedResources } = useGetSharedResources();
  const sessionManager = useSessionManager();

  const handleFullEnrichment = async () => {
    try {
      setEnrichmentProgress({
        phase: 'consolidating',
        progress: 10,
        currentItem: 'Consolidating all resource libraries...',
        completed: 0,
        total: 100
      });

      // Step 1: Consolidate all resources
      const consolidationResult = await consolidateResources.mutateAsync();
      
      setEnrichmentProgress(prev => ({
        ...prev,
        progress: 40,
        currentItem: 'Starting resource enrichment...',
        completed: 30
      }));

      // Step 2: Enrich resources with documentation and AI
      setEnrichmentProgress(prev => ({
        ...prev,
        phase: 'enriching',
        progress: 60,
        currentItem: `Enriching ${enrichmentSettings.resourceType} with Portnox docs and AI...`,
        completed: 50
      }));

      const enrichmentResult = await enrichResources.mutateAsync({
        resourceType: enrichmentSettings.resourceType,
        useFirecrawl: enrichmentSettings.useFirecrawl,
        useAI: enrichmentSettings.useAI
      });

      setEnrichmentProgress({
        phase: 'complete',
        progress: 100,
        currentItem: 'Enrichment complete!',
        completed: 100,
        total: 100
      });

      toast({
        title: "Enhanced Resource Library Ready",
        description: `Successfully consolidated ${consolidationResult.total} resources and enriched ${enrichmentResult.enrichedCount} items with comprehensive documentation.`
      });

    } catch (error) {
      console.error('Full enrichment failed:', error);
      setEnrichmentProgress(prev => ({ 
        ...prev, 
        phase: 'error', 
        currentItem: 'Enrichment failed' 
      }));
      
      toast({
        title: "Enrichment Failed",
        description: error instanceof Error ? error.message : "An error occurred during enrichment",
        variant: "destructive"
      });
    }
  };

  const createWorkingSession = async () => {
    try {
      const sessionId = await sessionManager.createSession.mutateAsync({
        sessionType: sessionSettings.sessionType,
        sessionData: {
          libraryStatus,
          enrichmentSettings,
          crossTenantAccess: true,
          createdFor: 'solutions_architect'
        },
        resourceSelections: {
          selectedVendors: [],
          selectedTemplates: [],
          selectedUseCases: [],
          selectedRequirements: []
        },
        expirationHours: sessionSettings.expirationHours
      });

      if (sessionSettings.sharingEnabled) {
        await sessionManager.shareSession.mutateAsync({
          resourceId: sessionId,
          resourceType: 'session',
          sharingLevel: 'organization',
          permissions: {
            view: true,
            edit: true,
            delete: false,
            share: true
          }
        });
      }

      toast({
        title: "Working Session Created",
        description: `Session ${sessionId.slice(0, 8)}... is ready and ${sessionSettings.sharingEnabled ? 'shared with team' : 'private'}.`
      });

    } catch (error) {
      console.error('Session creation failed:', error);
      toast({
        title: "Session Creation Failed",
        description: "Failed to create working session",
        variant: "destructive"
      });
    }
  };

  const getPhaseIcon = () => {
    switch (enrichmentProgress.phase) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'consolidating':
      case 'enriching':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      default:
        return <Database className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const isProcessing = consolidateResources.isPending || enrichResources.isPending;

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Resource Library</h1>
          <p className="text-muted-foreground">
            Comprehensive resource management for Solutions Architects, Sales Engineers, and Technical Account Managers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Globe className="w-3 h-3" />
            Multi-Tenant
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Session Persistence
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* Library Status Overview */}
      {libraryStatus && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.vendors}</div>
              <div className="text-sm text-muted-foreground">Vendors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.models}</div>
              <div className="text-sm text-muted-foreground">Models</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.templates}</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.useCases}</div>
              <div className="text-sm text-muted-foreground">Use Cases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.requirements}</div>
              <div className="text-sm text-muted-foreground">Requirements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{libraryStatus.authMethods}</div>
              <div className="text-sm text-muted-foreground">Auth Methods</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="enrichment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enrichment">Resource Enrichment</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="sharing">Multi-Tenant Sharing</TabsTrigger>
          <TabsTrigger value="insights">Cross-Tenant Insights</TabsTrigger>
        </TabsList>

        {/* Resource Enrichment Tab */}
        <TabsContent value="enrichment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Intelligent Resource Enrichment
              </CardTitle>
              <CardDescription>
                Enrich your resource libraries with Portnox documentation, external docs via Firecrawl, and AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enrichment Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-type">Resource Type</Label>
                  <Select
                    value={enrichmentSettings.resourceType}
                    onValueChange={(value: any) => 
                      setEnrichmentSettings(prev => ({ ...prev, resourceType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      <SelectItem value="vendors">Vendors Only</SelectItem>
                      <SelectItem value="models">Models Only</SelectItem>
                      <SelectItem value="templates">Templates Only</SelectItem>
                      <SelectItem value="use_cases">Use Cases Only</SelectItem>
                      <SelectItem value="requirements">Requirements Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-firecrawl"
                    checked={enrichmentSettings.useFirecrawl}
                    onCheckedChange={(checked) =>
                      setEnrichmentSettings(prev => ({ ...prev, useFirecrawl: checked }))
                    }
                  />
                  <Label htmlFor="use-firecrawl">Use Firecrawl for External Docs</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-ai"
                    checked={enrichmentSettings.useAI}
                    onCheckedChange={(checked) =>
                      setEnrichmentSettings(prev => ({ ...prev, useAI: checked }))
                    }
                  />
                  <Label htmlFor="use-ai">Enable AI Enhancement</Label>
                </div>
              </div>

              {/* Progress Display */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getPhaseIcon()}
                    <span className="text-sm font-medium">{enrichmentProgress.currentItem}</span>
                  </div>
                  <Progress value={enrichmentProgress.progress} className="w-full" />
                  <div className="text-xs text-muted-foreground text-center">
                    {enrichmentProgress.progress}% complete
                  </div>
                </div>
              )}

              {enrichmentProgress.phase === 'complete' && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Resource Enrichment Completed!</span>
                  </div>
                  <p className="text-sm text-success/80 mt-1">
                    Your resource library is now fully enriched with comprehensive documentation.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleFullEnrichment}
                disabled={isProcessing || enrichmentProgress.phase === 'complete'}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enriching Resources...
                  </>
                ) : enrichmentProgress.phase === 'complete' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enrichment Complete
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Full Resource Enrichment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Management Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Session Persistence & Management
              </CardTitle>
              <CardDescription>
                Create persistent working sessions for scoping, configuration, and project management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-type">Session Type</Label>
                  <Select
                    value={sessionSettings.sessionType}
                    onValueChange={(value: any) => 
                      setSessionSettings(prev => ({ ...prev, sessionType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scoping">Solution Scoping</SelectItem>
                      <SelectItem value="configuration">Configuration Planning</SelectItem>
                      <SelectItem value="planning">Project Planning</SelectItem>
                      <SelectItem value="tracking">Implementation Tracking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration">Session Duration (hours)</Label>
                  <Input
                    type="number"
                    value={sessionSettings.expirationHours}
                    onChange={(e) =>
                      setSessionSettings(prev => ({ ...prev, expirationHours: parseInt(e.target.value) || 72 }))
                    }
                    min="1"
                    max="720"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="sharing-enabled"
                    checked={sessionSettings.sharingEnabled}
                    onCheckedChange={(checked) =>
                      setSessionSettings(prev => ({ ...prev, sharingEnabled: checked }))
                    }
                  />
                  <Label htmlFor="sharing-enabled">Enable Team Sharing</Label>
                </div>
              </div>

              <Button 
                onClick={createWorkingSession}
                disabled={sessionManager.isCreatingSession}
                className="w-full"
                size="lg"
              >
                {sessionManager.isCreatingSession ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Create Working Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-Tenant Sharing Tab */}
        <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Multi-Tenant Resource Sharing
              </CardTitle>
              <CardDescription>
                Manage global resource sharing across teams and organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="font-medium">Global Resources</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Resources shared across all organizations
                    </p>
                    <div className="text-2xl font-bold">
                      {sharedResources?.filter(r => r.sharing_level === 'global').length || 0}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">Organization Resources</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Resources shared within your organization
                    </p>
                    <div className="text-2xl font-bold">
                      {sharedResources?.filter(r => r.sharing_level === 'organization').length || 0}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Resources are automatically shared based on your role permissions. Solutions Architects and Sales Engineers can access global resources for consistent customer experiences.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cross-Tenant Insights Tab */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Cross-Tenant Resource Insights
              </CardTitle>
              <CardDescription>
                Access shared knowledge and resources across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {crossTenantResources && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(crossTenantResources).map(([resourceType, resources]) => (
                    <div key={resourceType} className="p-4 border rounded-lg">
                      <div className="font-medium capitalize mb-2">{resourceType}s</div>
                      <div className="text-2xl font-bold text-primary">{resources.length}</div>
                      <div className="text-sm text-muted-foreground">Available globally</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedResourceLibraryManager;