import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TestManagement = () => {
  const [testSuites] = useState([
    {
      id: "authentication",
      name: "Authentication Testing",
      description: "Comprehensive authentication method validation",
      total: 24,
      passed: 18,
      failed: 2,
      pending: 4,
      priority: "High"
    },
    {
      id: "network-access",
      name: "Network Access Control",
      description: "Policy enforcement and access validation",
      total: 18,
      passed: 15,
      failed: 1,
      pending: 2,
      priority: "High"
    },
    {
      id: "integration",
      name: "Third-party Integrations",
      description: "MDM, SIEM, and identity provider integrations",
      total: 12,
      passed: 8,
      failed: 0,
      pending: 4,
      priority: "Medium"
    },
    {
      id: "performance",
      name: "Performance & Load Testing",
      description: "System performance under various load conditions",
      total: 8,
      passed: 4,
      failed: 0,
      pending: 4,
      priority: "Medium"
    }
  ]);

  const testCases = {
    authentication: [
      {
        id: "auth-001",
        name: "Active Directory Authentication",
        description: "Verify AD users can authenticate successfully",
        status: "passed",
        severity: "critical",
        steps: [
          "Configure AD integration in Portnox",
          "Test domain user authentication",
          "Verify group membership mapping",
          "Test authentication failures"
        ]
      },
      {
        id: "auth-002", 
        name: "Certificate-based Authentication",
        description: "Validate client certificate authentication",
        status: "failed",
        severity: "high",
        steps: [
          "Install client certificates",
          "Configure certificate authentication",
          "Test valid certificate access",
          "Test revoked certificate rejection"
        ]
      },
      {
        id: "auth-003",
        name: "Multi-Factor Authentication",
        description: "Test MFA integration and enforcement",
        status: "pending",
        severity: "medium",
        steps: [
          "Configure MFA provider",
          "Test primary authentication",
          "Verify MFA challenge",
          "Test MFA bypass scenarios"
        ]
      }
    ],
    "network-access": [
      {
        id: "nac-001",
        name: "VLAN Assignment",
        description: "Verify correct VLAN assignment based on policy",
        status: "passed",
        severity: "critical",
        steps: [
          "Create VLAN assignment policies",
          "Test different user groups",
          "Verify VLAN isolation",
          "Test dynamic VLAN changes"
        ]
      },
      {
        id: "nac-002",
        name: "Guest Network Access",
        description: "Validate guest user network access",
        status: "passed",
        severity: "high",
        steps: [
          "Configure guest policies",
          "Test guest registration",
          "Verify network restrictions",
          "Test session timeout"
        ]
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/30";
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-500";
      case "high": return "bg-orange-500/10 text-orange-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "low": return "bg-blue-500/10 text-blue-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Test Management & Validation
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing framework for Portnox deployments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Test Report</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Run All Tests
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Test Overview</TabsTrigger>
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="execution">Test Execution</TabsTrigger>
          <TabsTrigger value="criteria">Acceptance Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Test Suite Summary */}
          <div className="grid gap-6">
            {testSuites.map((suite) => {
              const completionRate = ((suite.passed + suite.failed) / suite.total) * 100;
              const successRate = (suite.passed / (suite.passed + suite.failed)) * 100;
              
              return (
                <Card key={suite.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{suite.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{suite.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={suite.priority === "High" ? "border-red-500/30 text-red-500" : "border-yellow-500/30 text-yellow-500"}
                      >
                        {suite.priority} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{suite.total}</div>
                        <div className="text-sm text-muted-foreground">Total Tests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{suite.passed}</div>
                        <div className="text-sm text-muted-foreground">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{suite.failed}</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{suite.pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.round(successRate)}%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Progress</span>
                        <span>{Math.round(completionRate)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="test-cases" className="space-y-6">
          <Tabs defaultValue="authentication" className="space-y-4">
            <TabsList>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="network-access">Network Access</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {Object.entries(testCases).map(([category, cases]) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {cases.map((testCase) => (
                    <Card key={testCase.id} className="hover:shadow-glow transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-3">
                              <span>{testCase.name}</span>
                              <Badge className={getStatusColor(testCase.status)}>
                                {testCase.status}
                              </Badge>
                            </CardTitle>
                            <p className="text-muted-foreground mt-1">{testCase.description}</p>
                          </div>
                          <Badge className={getSeverityColor(testCase.severity)}>
                            {testCase.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Test Steps:</div>
                          <div className="space-y-2">
                            {testCase.steps.map((step, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <Checkbox 
                                  checked={testCase.status === "passed"} 
                                  disabled 
                                />
                                <span className="text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              Run Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="execution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Test Environment</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab">Lab Environment</SelectItem>
                        <SelectItem value="staging">Staging Environment</SelectItem>
                        <SelectItem value="production">Production (Limited)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Test Runner</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test runner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automated">Automated Testing</SelectItem>
                        <SelectItem value="manual">Manual Testing</SelectItem>
                        <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Test Schedule</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Run Immediately</SelectItem>
                        <SelectItem value="nightly">Nightly Execution</SelectItem>
                        <SelectItem value="weekly">Weekly Execution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notification Method</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Notifications</SelectItem>
                        <SelectItem value="slack">Slack Integration</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card className="bg-gradient-glow border-primary/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">85%</div>
                      <div className="text-sm text-muted-foreground">Overall Test Coverage</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-glow border-primary/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">92%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Acceptance Criteria</CardTitle>
              <p className="text-muted-foreground">
                Define success criteria for project acceptance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    category: "Performance Criteria",
                    criteria: [
                      "Authentication response time < 2 seconds",
                      "99.9% system uptime during business hours",
                      "Support for 500 concurrent authentication requests",
                      "Network policy enforcement within 30 seconds"
                    ]
                  },
                  {
                    category: "Security Criteria", 
                    criteria: [
                      "All devices must authenticate before network access",
                      "Unauthorized devices are quarantined within 1 minute", 
                      "Compliance violations trigger immediate alerts",
                      "Audit logs capture all authentication events"
                    ]
                  },
                  {
                    category: "Functional Criteria",
                    criteria: [
                      "Support for all required device types",
                      "Integration with existing AD infrastructure",
                      "Guest network provisioning works as designed",
                      "Self-service portal is functional and user-friendly"
                    ]
                  },
                  {
                    category: "Operational Criteria",
                    criteria: [
                      "Administrative interface is intuitive",
                      "Reporting provides required visibility",
                      "Help desk can troubleshoot common issues",
                      "System monitoring and alerting is configured"
                    ]
                  }
                ].map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{section.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {section.criteria.map((criterion, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <Checkbox id={`criteria-${index}-${idx}`} />
                            <label 
                              htmlFor={`criteria-${index}-${idx}`}
                              className="text-sm cursor-pointer hover:text-primary transition-colors"
                            >
                              {criterion}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestManagement;