import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, Download, Upload, CheckCircle, AlertCircle, 
  Clock, Play, Pause, RefreshCw, BarChart3, Activity,
  Users, Building, Shield, Network, Settings
} from 'lucide-react';

// Enhanced seeding operations with detailed tracking
const seedingOperations = [
  {
    id: 'nac-vendors',
    name: 'NAC Vendors',
    description: 'Network Access Control vendors and solutions',
    category: 'vendors',
    estimatedCount: 150,
    icon: Shield,
    priority: 'high'
  },
  {
    id: 'network-infrastructure',
    name: 'Network Infrastructure',
    description: 'Switches, routers, access points, and network devices',
    category: 'vendors',
    estimatedCount: 300,
    icon: Network,
    priority: 'high'
  },
  {
    id: 'security-vendors',
    name: 'Security Vendors',
    description: 'EDR/XDR, SIEM, firewalls, and security solutions',
    category: 'vendors',
    estimatedCount: 200,
    icon: Shield,
    priority: 'high'
  },
  {
    id: 'identity-providers',
    name: 'Identity Providers',
    description: 'IDP, SSO, MFA, and authentication solutions',
    category: 'vendors',
    estimatedCount: 100,
    icon: Users,
    priority: 'medium'
  },
  {
    id: 'mdm-solutions',
    name: 'MDM/UEM Solutions',
    description: 'Mobile device management and endpoint solutions',
    category: 'vendors',
    estimatedCount: 80,
    icon: Settings,
    priority: 'medium'
  },
  {
    id: 'cloud-platforms',
    name: 'Cloud Platforms',
    description: 'AWS, Azure, GCP, and cloud infrastructure',
    category: 'vendors',
    estimatedCount: 50,
    icon: Database,
    priority: 'medium'
  },
  {
    id: 'industry-verticals',
    name: 'Industry Verticals',
    description: 'Healthcare, finance, education, government sectors',
    category: 'industries',
    estimatedCount: 50,
    icon: Building,
    priority: 'high'
  },
  {
    id: 'compliance-frameworks',
    name: 'Compliance Frameworks',
    description: 'HIPAA, SOX, PCI-DSS, GDPR, and regulatory standards',
    category: 'compliance',
    estimatedCount: 30,
    icon: Shield,
    priority: 'high'
  },
  {
    id: 'use-cases-library',
    name: 'Use Cases Library',
    description: 'Common deployment scenarios and implementation patterns',
    category: 'use-cases',
    estimatedCount: 200,
    icon: CheckCircle,
    priority: 'medium'
  },
  {
    id: 'requirements-matrix',
    name: 'Requirements Matrix',
    description: 'Technical and business requirements catalog',
    category: 'requirements',
    estimatedCount: 150,
    icon: AlertCircle,
    priority: 'medium'
  }
];

interface SeedingStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  processedCount: number;
  totalCount: number;
  startTime?: Date;
  endTime?: Date;
  errors: string[];
  warnings: string[];
  log: string[];
}

const EnhancedSeedingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [seedingStatuses, setSeedingStatuses] = useState<Record<string, SeedingStatus>>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runSeeding = async (operationId: string) => {
    const operation = seedingOperations.find(op => op.id === operationId);
    if (!operation) return;

    setSeedingStatuses(prev => ({
      ...prev,
      [operationId]: {
        id: operationId,
        status: 'running',
        progress: 0,
        processedCount: 0,
        totalCount: operation.estimatedCount,
        startTime: new Date(),
        errors: [],
        warnings: [],
        log: [`Started seeding ${operation.name}`]
      }
    }));

    setIsRunning(true);

    try {
      // Simulate seeding process with progress updates
      for (let i = 0; i <= operation.estimatedCount; i += Math.floor(operation.estimatedCount / 20)) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setSeedingStatuses(prev => ({
          ...prev,
          [operationId]: {
            ...prev[operationId],
            progress: Math.round((i / operation.estimatedCount) * 100),
            processedCount: Math.min(i, operation.estimatedCount),
            log: [...(prev[operationId]?.log || []), `Processed ${Math.min(i, operation.estimatedCount)} items`]
          }
        }));
      }

      // Complete the seeding
      setSeedingStatuses(prev => ({
        ...prev,
        [operationId]: {
          ...prev[operationId],
          status: 'completed',
          progress: 100,
          processedCount: operation.estimatedCount,
          endTime: new Date(),
          log: [...(prev[operationId]?.log || []), `Completed seeding ${operation.name} - ${operation.estimatedCount} items processed`]
        }
      }));

      toast({
        title: "Seeding Completed",
        description: `Successfully seeded ${operation.name} with ${operation.estimatedCount} items`,
      });

    } catch (error) {
      setSeedingStatuses(prev => ({
        ...prev,
        [operationId]: {
          ...prev[operationId],
          status: 'failed',
          endTime: new Date(),
          errors: [...(prev[operationId]?.errors || []), error instanceof Error ? error.message : 'Unknown error'],
          log: [...(prev[operationId]?.log || []), `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
        }
      }));

      toast({
        title: "Seeding Failed",
        description: `Failed to seed ${operation.name}`,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runAllSeeding = async () => {
    const highPriorityOps = seedingOperations.filter(op => op.priority === 'high');
    for (const operation of highPriorityOps) {
      await runSeeding(operation.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'paused': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return RefreshCw;
      case 'failed': return AlertCircle;
      case 'paused': return Pause;
      default: return Clock;
    }
  };

  const completedCount = Object.values(seedingStatuses).filter(s => s.status === 'completed').length;
  const runningCount = Object.values(seedingStatuses).filter(s => s.status === 'running').length;
  const failedCount = Object.values(seedingStatuses).filter(s => s.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Seeding Dashboard</h2>
          <p className="text-muted-foreground">
            Track and manage taxonomy data seeding operations with detailed progress monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={runAllSeeding}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run High Priority Seeding
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seedingOperations.length}</div>
            <p className="text-xs text-muted-foreground">Available seeding operations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{runningCount}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-muted-foreground">Errors encountered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seedingOperations.map((operation) => {
              const status = seedingStatuses[operation.id];
              const StatusIcon = getStatusIcon(status?.status || 'pending');
              const OperationIcon = operation.icon;

              return (
                <Card key={operation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <OperationIcon className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-lg">{operation.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={operation.priority === 'high' ? 'default' : 'secondary'}>
                          {operation.priority}
                        </Badge>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(status?.status || 'pending')}`} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{operation.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Estimated Count:</span>
                      <span className="font-medium">{operation.estimatedCount}</span>
                    </div>
                    
                    {status && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress:</span>
                            <span className="font-medium">{status.processedCount}/{status.totalCount}</span>
                          </div>
                          <Progress value={status.progress} className="w-full" />
                        </div>
                        
                        {status.status === 'completed' && status.startTime && status.endTime && (
                          <div className="text-xs text-muted-foreground">
                            Duration: {Math.round((status.endTime.getTime() - status.startTime.getTime()) / 1000)}s
                          </div>
                        )}
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSeeding(operation.id)}
                      disabled={status?.status === 'running' || isRunning}
                      className="w-full"
                    >
                      {status?.status === 'running' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : status?.status === 'completed' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-run
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Seeding
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedingOperations.filter(op => op.category === 'vendors').map((operation) => {
              const status = seedingStatuses[operation.id];
              
              return (
                <Card key={operation.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <operation.icon className="h-5 w-5" />
                      {operation.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{operation.description}</p>
                      {status && (
                        <div className="space-y-2">
                          <Progress value={status.progress} />
                          <div className="text-sm text-muted-foreground">
                            {status.processedCount} / {status.totalCount} items processed
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => runSeeding(operation.id)}
                        disabled={status?.status === 'running' || isRunning}
                      >
                        {status?.status === 'running' ? 'Running...' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="taxonomy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedingOperations.filter(op => op.category !== 'vendors').map((operation) => {
              const status = seedingStatuses[operation.id];
              
              return (
                <Card key={operation.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <operation.icon className="h-5 w-5" />
                      {operation.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{operation.description}</p>
                      {status && (
                        <div className="space-y-2">
                          <Progress value={status.progress} />
                          <div className="text-sm text-muted-foreground">
                            {status.processedCount} / {status.totalCount} items processed
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => runSeeding(operation.id)}
                        disabled={status?.status === 'running' || isRunning}
                      >
                        {status?.status === 'running' ? 'Running...' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Seeding Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {Object.values(seedingStatuses).flatMap(status => 
                    status.log.map((entry, index) => (
                      <div key={`${status.id}-${index}`} className="text-sm font-mono">
                        <span className="text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                        {' '} - {entry}
                      </div>
                    ))
                  )}
                  {Object.keys(seedingStatuses).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No seeding operations have been started yet.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSeedingDashboard;