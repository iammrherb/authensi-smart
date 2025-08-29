import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Database, Server, Globe, Shield, Settings, Zap, 
  CheckCircle, AlertTriangle, RefreshCw, Play, Square,
  Download, Upload, Activity, BarChart3, Tag,
  FileText, Network, Bot, Key, Link, Clock
} from 'lucide-react';

interface SystemStatus {
  database: {
    tables: Array<{ name: string; count: number; status: 'healthy' | 'warning' | 'error' }>;
    connections: number;
    performance: number;
  };
  edgeFunctions: Array<{
    name: string;
    status: 'active' | 'error' | 'stopped';
    version: string;
    lastCall: string;
    avgResponseTime: number;
  }>;
  apis: Array<{
    name: string;
    status: 'connected' | 'error' | 'disconnected';
    lastCheck: string;
    responseTime: number;
  }>;
  resourceEnrichment: {
    vendorsEnriched: number;
    modelsEnriched: number;
    templatesEnriched: number;
    useCasesEnriched: number;
    lastEnrichment: string;
    enrichmentProgress: number;
  };
}

const SystemHealthCenter: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEnrichments, setActiveEnrichments] = useState<string[]>([]);

  const mockSystemStatus: SystemStatus = {
    database: {
      tables: [
        { name: 'enterprise_reports', count: 0, status: 'healthy' },
        { name: 'resource_tags', count: 49, status: 'healthy' },
        { name: 'firecrawler_jobs', count: 0, status: 'healthy' },
        { name: 'report_templates', count: 24, status: 'healthy' },
        { name: 'vendor_library', count: 45, status: 'healthy' },
        { name: 'use_case_library', count: 67, status: 'healthy' },
        { name: 'requirements_library', count: 89, status: 'healthy' },
        { name: 'pain_points_library', count: 34, status: 'healthy' }
      ],
      connections: 12,
      performance: 95
    },
    edgeFunctions: [
      { name: 'ai-completion', status: 'active', version: 'v93', lastCall: '2 min ago', avgResponseTime: 1200 },
      { name: 'enhanced-ai-completion', status: 'active', version: 'v30', lastCall: '5 min ago', avgResponseTime: 800 },
      { name: 'documentation-crawler', status: 'active', version: 'v70', lastCall: '1 hour ago', avgResponseTime: 3000 },
      { name: 'portnox-doc-scraper', status: 'error', version: 'v78', lastCall: '2 hours ago', avgResponseTime: 5000 },
      { name: 'enterprise-ai-report-generator', status: 'active', version: 'v4', lastCall: '30 min ago', avgResponseTime: 2500 }
    ],
    apis: [
      { name: 'Firecrawler API', status: 'connected', lastCheck: '1 min ago', responseTime: 800 },
      { name: 'Portnox API', status: 'error', lastCheck: '5 min ago', responseTime: 5000 },
      { name: 'Claude API', status: 'connected', lastCheck: '2 min ago', responseTime: 1500 },
      { name: 'OpenAI API', status: 'connected', lastCheck: '1 min ago', responseTime: 1200 },
      { name: 'Gemini API', status: 'connected', lastCheck: '3 min ago', responseTime: 1000 }
    ],
    resourceEnrichment: {
      vendorsEnriched: 45,
      modelsEnriched: 234,
      templatesEnriched: 156,
      useCasesEnriched: 67,
      lastEnrichment: '2 hours ago',
      enrichmentProgress: 75
    }
  };

  useEffect(() => {
    // Simulate loading system status
    setTimeout(() => {
      setSystemStatus(mockSystemStatus);
      setIsLoading(false);
    }, 1000);
  }, []);

  const startEnrichment = (type: string) => {
    setActiveEnrichments(prev => [...prev, type]);
    // Simulate enrichment process
    setTimeout(() => {
      setActiveEnrichments(prev => prev.filter(t => t !== type));
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'connected':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
      case 'disconnected':
      case 'stopped':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'disconnected':
      case 'stopped':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading system status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Health Center</h1>
              <p className="text-muted-foreground">Comprehensive system monitoring and configuration</p>
            </div>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
        <Separator />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="functions">Edge Functions</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Tables</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus?.database.tables.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active connections: {systemStatus?.database.connections}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus?.edgeFunctions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {systemStatus?.edgeFunctions.filter(f => f.status === 'active').length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Connections</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus?.apis.length}</div>
                <p className="text-xs text-muted-foreground">
                  Connected: {systemStatus?.apis.filter(api => api.status === 'connected').length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrichment Progress</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStatus?.resourceEnrichment.enrichmentProgress}%</div>
                <Progress value={systemStatus?.resourceEnrichment.enrichmentProgress} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemStatus?.edgeFunctions.filter(f => f.status === 'error').map(func => (
                <Alert key={func.name} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Edge function "{func.name}" is experiencing errors. Last response: {func.lastCall}
                  </AlertDescription>
                </Alert>
              ))}
              {systemStatus?.apis.filter(api => api.status === 'error').map(api => (
                <Alert key={api.name} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    API "{api.name}" connection failed. Response time: {api.responseTime}ms
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables Status</CardTitle>
              <CardDescription>Real-time database table statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus?.database.tables.map(table => (
                  <div key={table.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(table.status)}
                      <div>
                        <p className="font-medium">{table.name}</p>
                        <p className="text-sm text-muted-foreground">{table.count} records</p>
                      </div>
                    </div>
                    <Badge variant={table.status === 'healthy' ? 'default' : 'destructive'}>
                      {table.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edge Functions Tab */}
        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edge Functions Status</CardTitle>
              <CardDescription>Serverless function performance and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus?.edgeFunctions.map(func => (
                  <div key={func.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(func.status)}
                      <div>
                        <p className="font-medium">{func.name}</p>
                        <p className="text-sm text-muted-foreground">
                          v{func.version} • Last call: {func.lastCall}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{func.avgResponseTime}ms</p>
                        <p className="text-xs text-muted-foreground">Avg response</p>
                      </div>
                      <Badge variant={func.status === 'active' ? 'default' : 'destructive'}>
                        {func.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APIs Tab */}
        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External API Status</CardTitle>
              <CardDescription>Third-party API connections and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus?.apis.map(api => (
                  <div key={api.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(api.status)}
                      <div>
                        <p className="font-medium">{api.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last check: {api.lastCheck}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{api.responseTime}ms</p>
                        <p className="text-xs text-muted-foreground">Response time</p>
                      </div>
                      <Badge variant={api.status === 'connected' ? 'default' : 'destructive'}>
                        {api.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrichment Tab */}
        <TabsContent value="enrichment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Enrichment Dashboard</CardTitle>
              <CardDescription>AI-powered resource enrichment and classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Enrichment Status */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{systemStatus?.resourceEnrichment.vendorsEnriched}</div>
                    <p className="text-sm text-green-600">Vendors Enriched</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{systemStatus?.resourceEnrichment.modelsEnriched}</div>
                    <p className="text-sm text-blue-600">Models Enriched</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{systemStatus?.resourceEnrichment.templatesEnriched}</div>
                    <p className="text-sm text-purple-600">Templates Enriched</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">{systemStatus?.resourceEnrichment.useCasesEnriched}</div>
                    <p className="text-sm text-orange-600">Use Cases Enriched</p>
                  </div>
                </div>

                {/* Enrichment Controls */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Enrichment Controls</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      onClick={() => startEnrichment('vendors')}
                      disabled={activeEnrichments.includes('vendors')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      {activeEnrichments.includes('vendors') ? (
                        <RefreshCw className="h-5 w-5 animate-spin mb-1" />
                      ) : (
                        <Tag className="h-5 w-5 mb-1" />
                      )}
                      <span className="text-sm">Enrich Vendors</span>
                    </Button>
                    
                    <Button
                      onClick={() => startEnrichment('models')}
                      disabled={activeEnrichments.includes('models')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      {activeEnrichments.includes('models') ? (
                        <RefreshCw className="h-5 w-5 animate-spin mb-1" />
                      ) : (
                        <Database className="h-5 w-5 mb-1" />
                      )}
                      <span className="text-sm">Enrich Models</span>
                    </Button>
                    
                    <Button
                      onClick={() => startEnrichment('templates')}
                      disabled={activeEnrichments.includes('templates')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      {activeEnrichments.includes('templates') ? (
                        <RefreshCw className="h-5 w-5 animate-spin mb-1" />
                      ) : (
                        <FileText className="h-5 w-5 mb-1" />
                      )}
                      <span className="text-sm">Enrich Templates</span>
                    </Button>
                    
                    <Button
                      onClick={() => startEnrichment('useCases')}
                      disabled={activeEnrichments.includes('useCases')}
                      variant="outline"
                      className="h-20 flex flex-col"
                    >
                      {activeEnrichments.includes('useCases') ? (
                        <RefreshCw className="h-5 w-5 animate-spin mb-1" />
                      ) : (
                        <BarChart3 className="h-5 w-5 mb-1" />
                      )}
                      <span className="text-sm">Enrich Use Cases</span>
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Last enrichment: {systemStatus?.resourceEnrichment.lastEnrichment}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>API keys, environment variables, and system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">API Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Firecrawler API Key</span>
                        <Badge variant="secondary">Configured</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Portnox API Token</span>
                        <Badge variant="destructive">Issues</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Claude API Key</span>
                        <Badge variant="secondary">Configured</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">OpenAI API Key</span>
                        <Badge variant="secondary">Configured</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Database Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Connection Pool</span>
                        <Badge variant="secondary">12 active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Performance</span>
                        <Badge variant="secondary">95%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthCenter;
