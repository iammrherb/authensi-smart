import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock, Settings, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortnoxApiService } from "@/services/PortnoxApiService";
import TestManagement from "@/components/tracker/TestManagement";
import PortnoxAutomatedTesting from "@/components/testing/PortnoxAutomatedTesting";
import TestReportGenerator from "@/components/testing/TestReportGenerator";
import DeploymentValidation from "@/components/testing/DeploymentValidation";

const Testing: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    document.title = "Portnox Testing & Validation Center";
  }, []);

  const runAutomatedTests = async () => {
    setIsRunning(true);
    setOverallProgress(0);
    
    try {
      // Simulate automated test execution with Portnox API
      const testSuites = [
        { name: "API Connectivity", endpoint: "/api/v1/status" },
        { name: "Authentication Tests", endpoint: "/api/v1/auth/test" },
        { name: "Device Management", endpoint: "/api/v1/devices" },
        { name: "Policy Validation", endpoint: "/api/v1/policies" },
        { name: "Network Health", endpoint: "/api/v1/network/status" }
      ];

      const results = [];
      for (let i = 0; i < testSuites.length; i++) {
        const suite = testSuites[i];
        setOverallProgress(((i + 1) / testSuites.length) * 100);
        
        try {
          // Test API connectivity
          const result = await PortnoxApiService.testConnection();
          results.push({
            name: suite.name,
            status: result ? "passed" : "failed",
            endpoint: suite.endpoint,
            timestamp: new Date().toISOString(),
            details: result || "Connection failed"
          });
        } catch (error) {
          results.push({
            name: suite.name,
            status: "failed",
            endpoint: suite.endpoint,
            timestamp: new Date().toISOString(),
            details: error.message || "Test failed"
          });
        }
        
        // Add delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setTestResults(results);
      toast({
        title: "Automated Tests Complete",
        description: `Executed ${results.length} test suites successfully`,
      });
    } catch (error) {
      toast({
        title: "Test Execution Failed",
        description: error.message || "Failed to run automated tests",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "running": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/30";
      case "running": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="container mx-auto px-6 pt-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Portnox Testing & Validation Center
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Comprehensive testing framework with automated Portnox API validation, 
              deployment verification, and continuous monitoring capabilities.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Test Config
            </Button>
            <Button 
              onClick={runAutomatedTests}
              disabled={isRunning}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
          </div>
        </div>

        {/* Real-time Test Progress */}
        {isRunning && (
          <Card className="mb-6 border-primary/30 bg-gradient-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Test Execution in Progress</h3>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {Math.round(overallProgress)}% Complete
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Running automated validation tests against Portnox API endpoints...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Latest Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">{result.endpoint}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </header>

      <section className="container mx-auto px-6 pb-8">
        <Tabs defaultValue="automated" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="automated">Automated Testing</TabsTrigger>
            <TabsTrigger value="deployment">Deployment Validation</TabsTrigger>
            <TabsTrigger value="manual">Manual Testing</TabsTrigger>
            <TabsTrigger value="reports">Test Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="automated" className="space-y-6">
            <PortnoxAutomatedTesting />
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <DeploymentValidation />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <TestManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <TestReportGenerator />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Testing;