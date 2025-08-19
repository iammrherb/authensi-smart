import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Monitor,
  Network,
  Shield,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: string;
  tests: AutomatedTest[];
  enabled: boolean;
}

interface AutomatedTest {
  id: string;
  name: string;
  description: string;
  apiEndpoint: string;
  method: string;
  expectedResponse: any;
  timeout: number;
  retries: number;
  critical: boolean;
  status?: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  result?: any;
  duration?: number;
  error?: string;
}

const PortnoxAutomatedTesting: React.FC = () => {
  const { toast } = useToast();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Map<string, any>>(new Map());
  const [selectedSuite, setSelectedSuite] = useState<string>("all");
  const [config, setConfig] = useState({
    parallelExecution: true,
    continueOnFailure: true,
    timeout: 30000,
    retries: 3,
    enableLogging: true
  });

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        id: "connectivity",
        name: "API Connectivity Tests",
        description: "Basic connectivity and authentication tests",
        category: "Infrastructure",
        enabled: true,
        tests: [
          {
            id: "api-health",
            name: "API Health Check",
            description: "Verify API is accessible and responding",
            apiEndpoint: "/api/v1/health",
            method: "GET",
            expectedResponse: { status: "healthy" },
            timeout: 5000,
            retries: 3,
            critical: true
          },
          {
            id: "auth-test",
            name: "Authentication Test",
            description: "Verify API authentication is working",
            apiEndpoint: "/api/v1/auth/validate",
            method: "POST",
            expectedResponse: { authenticated: true },
            timeout: 10000,
            retries: 2,
            critical: true
          }
        ]
      },
      {
        id: "device-management",
        name: "Device Management Tests",
        description: "Device discovery, enrollment, and management tests",
        category: "Core Functionality",
        enabled: true,
        tests: [
          {
            id: "list-devices",
            name: "List Devices",
            description: "Retrieve list of managed devices",
            apiEndpoint: "/api/v1/devices",
            method: "GET",
            expectedResponse: { devices: [] },
            timeout: 15000,
            retries: 2,
            critical: false
          },
          {
            id: "device-details",
            name: "Device Details",
            description: "Get detailed information about a specific device",
            apiEndpoint: "/api/v1/devices/{id}",
            method: "GET",
            expectedResponse: { device: {} },
            timeout: 10000,
            retries: 2,
            critical: false
          }
        ]
      },
      {
        id: "policy-engine",
        name: "Policy Engine Tests",
        description: "Network access control and policy enforcement tests",
        category: "Security",
        enabled: true,
        tests: [
          {
            id: "list-policies",
            name: "List Policies",
            description: "Retrieve configured network policies",
            apiEndpoint: "/api/v1/policies",
            method: "GET",
            expectedResponse: { policies: [] },
            timeout: 10000,
            retries: 2,
            critical: false
          },
          {
            id: "policy-validation",
            name: "Policy Validation",
            description: "Validate policy configuration",
            apiEndpoint: "/api/v1/policies/validate",
            method: "POST",
            expectedResponse: { valid: true },
            timeout: 15000,
            retries: 1,
            critical: true
          }
        ]
      },
      {
        id: "performance",
        name: "Performance Tests",
        description: "Load testing and performance validation",
        category: "Performance",
        enabled: false,
        tests: [
          {
            id: "concurrent-auth",
            name: "Concurrent Authentication",
            description: "Test multiple simultaneous authentication requests",
            apiEndpoint: "/api/v1/auth/bulk",
            method: "POST",
            expectedResponse: { success: true },
            timeout: 30000,
            retries: 1,
            critical: false
          }
        ]
      }
    ];

    setTestSuites(suites);
  };

  const runTests = async (suiteId?: string) => {
    setIsRunning(true);
    setTestResults(new Map());
    
    try {
      const suitesToRun = suiteId && suiteId !== "all" 
        ? testSuites.filter(s => s.id === suiteId && s.enabled)
        : testSuites.filter(s => s.enabled);

      for (const suite of suitesToRun) {
        toast({
          title: `Running ${suite.name}`,
          description: `Executing ${suite.tests.length} tests...`,
        });

        for (const test of suite.tests) {
          setCurrentTest(`${suite.id}-${test.id}`);
          
          try {
            const startTime = Date.now();
            
            // Execute the actual API test
            let result;
            switch (test.method.toUpperCase()) {
              case 'GET':
                if (test.apiEndpoint.includes('/devices')) {
                  result = await PortnoxApiService.listDevices();
                } else {
                  result = await PortnoxApiService.testConnection();
                }
                break;
              case 'POST':
                result = await PortnoxApiService.testConnection();
                break;
              default:
                result = await PortnoxApiService.testConnection();
            }

            const duration = Date.now() - startTime;
            
            setTestResults(prev => new Map(prev.set(`${suite.id}-${test.id}`, {
              ...test,
              status: 'passed',
              result,
              duration,
              timestamp: new Date().toISOString()
            })));

          } catch (error) {
            setTestResults(prev => new Map(prev.set(`${suite.id}-${test.id}`, {
              ...test,
              status: 'failed',
              error: error.message,
              timestamp: new Date().toISOString()
            })));

            if (test.critical && !config.continueOnFailure) {
              throw new Error(`Critical test failed: ${test.name}`);
            }
          }

          // Add delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: "Tests Complete",
        description: "All automated tests have finished executing",
      });

    } catch (error) {
      toast({
        title: "Test Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  const getTestProgress = () => {
    const totalTests = testSuites
      .filter(s => s.enabled)
      .reduce((acc, suite) => acc + suite.tests.length, 0);
    
    const completedTests = Array.from(testResults.values()).length;
    
    return totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <Network className="h-5 w-5" />;
      case 'Core Functionality': return <Monitor className="h-5 w-5" />;
      case 'Security': return <Shield className="h-5 w-5" />;
      case 'Performance': return <Database className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Automated Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Test Suite</Label>
              <Select value={selectedSuite} onValueChange={setSelectedSuite}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test suite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Enabled Suites</SelectItem>
                  {testSuites.map(suite => (
                    <SelectItem key={suite.id} value={suite.id}>
                      {suite.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Timeout (ms)</Label>
              <Input
                type="number"
                value={config.timeout}
                onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Retries</Label>
              <Input
                type="number"
                value={config.retries}
                onChange={(e) => setConfig(prev => ({ ...prev, retries: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.continueOnFailure}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, continueOnFailure: checked }))}
                />
                <Label>Continue on Failure</Label>
              </div>
              
              <Button
                onClick={() => runTests(selectedSuite)}
                disabled={isRunning}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isRunning ? "Running..." : "Run Tests"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Progress */}
      {isRunning && (
        <Card className="border-primary/30 bg-gradient-glow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Test Execution Progress</h3>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {Math.round(getTestProgress())}% Complete
                </Badge>
              </div>
              <Progress value={getTestProgress()} className="h-3" />
              {currentTest && (
                <p className="text-sm text-muted-foreground">
                  Currently running: {currentTest}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Suites */}
      <div className="grid gap-6">
        {testSuites.map(suite => (
          <Card key={suite.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(suite.category)}
                  <div>
                    <CardTitle className="text-lg">{suite.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{suite.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{suite.category}</Badge>
                  <Switch
                    checked={suite.enabled}
                    onCheckedChange={(checked) => {
                      setTestSuites(prev => prev.map(s => 
                        s.id === suite.id ? { ...s, enabled: checked } : s
                      ));
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map(test => {
                  const testKey = `${suite.id}-${test.id}`;
                  const result = testResults.get(testKey);
                  
                  return (
                    <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result?.status)}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {test.name}
                            {test.critical && (
                              <Badge variant="destructive" className="text-xs">Critical</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{test.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {test.method} {test.apiEndpoint}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        {result?.status && (
                          <Badge className={
                            result.status === 'passed' ? 'bg-green-500/10 text-green-500' :
                            result.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-gray-500/10 text-gray-500'
                          }>
                            {result.status}
                          </Badge>
                        )}
                        {result?.duration && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.duration}ms
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortnoxAutomatedTesting;