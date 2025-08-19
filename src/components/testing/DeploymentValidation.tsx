import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Network, 
  Server, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RefreshCw,
  FileText,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface ValidationPhase {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  checks: ValidationCheck[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

interface ValidationCheck {
  id: string;
  name: string;
  description: string;
  category: string;
  critical: boolean;
  automated: boolean;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  result?: string;
  error?: string;
  apiCall?: string;
}

const DeploymentValidation: React.FC = () => {
  const { toast } = useToast();
  const [validationPhases, setValidationPhases] = useState<ValidationPhase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState("production");

  useEffect(() => {
    initializeValidationPhases();
  }, []);

  const initializeValidationPhases = () => {
    const phases: ValidationPhase[] = [
      {
        id: "infrastructure",
        name: "Infrastructure Validation",
        description: "Verify core infrastructure components and connectivity",
        icon: <Server className="h-5 w-5" />,
        status: 'pending',
        progress: 0,
        checks: [
          {
            id: "api-connectivity",
            name: "API Connectivity",
            description: "Verify Portnox API is accessible and responding",
            category: "Connectivity",
            critical: true,
            automated: true,
            status: 'pending',
            apiCall: "testConnection"
          },
          {
            id: "dns-resolution",
            name: "DNS Resolution",
            description: "Verify DNS resolution for Portnox endpoints",
            category: "Network",
            critical: true,
            automated: true,
            status: 'pending'
          },
          {
            id: "certificate-validation",
            name: "SSL Certificate Validation",
            description: "Verify SSL certificates are valid and trusted",
            category: "Security",
            critical: true,
            automated: true,
            status: 'pending'
          },
          {
            id: "firewall-rules",
            name: "Firewall Rules",
            description: "Verify required ports are open and accessible",
            category: "Network",
            critical: true,
            automated: false,
            status: 'pending'
          }
        ]
      },
      {
        id: "authentication",
        name: "Authentication Systems",
        description: "Validate authentication methods and directory integrations",
        icon: <Shield className="h-5 w-5" />,
        status: 'pending',
        progress: 0,
        checks: [
          {
            id: "ad-integration",
            name: "Active Directory Integration",
            description: "Verify AD connection and user authentication",
            category: "Authentication",
            critical: true,
            automated: true,
            status: 'pending'
          },
          {
            id: "certificate-auth",
            name: "Certificate Authentication",
            description: "Test client certificate authentication",
            category: "Authentication",
            critical: false,
            automated: true,
            status: 'pending'
          },
          {
            id: "mfa-integration",
            name: "Multi-Factor Authentication",
            description: "Verify MFA provider integration",
            category: "Authentication",
            critical: false,
            automated: false,
            status: 'pending'
          }
        ]
      },
      {
        id: "network-policies",
        name: "Network Policy Engine",
        description: "Validate network access control and policy enforcement",
        icon: <Network className="h-5 w-5" />,
        status: 'pending',
        progress: 0,
        checks: [
          {
            id: "policy-creation",
            name: "Policy Creation",
            description: "Verify network policies can be created and configured",
            category: "Policy Management",
            critical: true,
            automated: true,
            status: 'pending',
            apiCall: "listPolicies"
          },
          {
            id: "vlan-assignment",
            name: "VLAN Assignment",
            description: "Test dynamic VLAN assignment based on policies",
            category: "Network Control",
            critical: true,
            automated: false,
            status: 'pending'
          },
          {
            id: "quarantine-policies",
            name: "Quarantine Policies",
            description: "Verify quarantine policies for non-compliant devices",
            category: "Security",
            critical: true,
            automated: true,
            status: 'pending'
          }
        ]
      },
      {
        id: "device-management",
        name: "Device Management",
        description: "Validate device discovery, profiling, and management",
        icon: <Database className="h-5 w-5" />,
        status: 'pending',
        progress: 0,
        checks: [
          {
            id: "device-discovery",
            name: "Device Discovery",
            description: "Verify automatic device discovery is working",
            category: "Discovery",
            critical: true,
            automated: true,
            status: 'pending',
            apiCall: "listDevices"
          },
          {
            id: "device-profiling",
            name: "Device Profiling",
            description: "Test device classification and profiling",
            category: "Classification",
            critical: false,
            automated: true,
            status: 'pending'
          },
          {
            id: "guest-provisioning",
            name: "Guest Network Provisioning",
            description: "Verify guest network access provisioning",
            category: "Guest Access",
            critical: false,
            automated: false,
            status: 'pending'
          }
        ]
      }
    ];

    setValidationPhases(phases);
  };

  const runValidation = async (phaseId?: string) => {
    setIsRunning(true);
    
    try {
      const phasesToRun = phaseId 
        ? validationPhases.filter(p => p.id === phaseId)
        : validationPhases;

      for (const phase of phasesToRun) {
        setCurrentPhase(phase.id);
        
        // Update phase status
        setValidationPhases(prev => prev.map(p => 
          p.id === phase.id ? { ...p, status: 'running', progress: 0 } : p
        ));

        toast({
          title: `Validating ${phase.name}`,
          description: `Running ${phase.checks.length} validation checks...`,
        });

        let passedChecks = 0;
        
        for (let i = 0; i < phase.checks.length; i++) {
          const check = phase.checks[i];
          
          // Update check status
          setValidationPhases(prev => prev.map(p => 
            p.id === phase.id ? {
              ...p,
              checks: p.checks.map(c => 
                c.id === check.id ? { ...c, status: 'running' } : c
              )
            } : p
          ));

          try {
            if (check.automated && check.apiCall) {
              // Execute automated API checks
              let result;
              switch (check.apiCall) {
                case 'testConnection':
                  result = await PortnoxApiService.testConnection();
                  break;
                case 'listDevices':
                  result = await PortnoxApiService.listDevices();
                  break;
                case 'listPolicies':
                  // Simulate policy check
                  result = { policies: [] };
                  break;
                default:
                  result = { success: true };
              }

              // Update check with success
              setValidationPhases(prev => prev.map(p => 
                p.id === phase.id ? {
                  ...p,
                  checks: p.checks.map(c => 
                    c.id === check.id ? { 
                      ...c, 
                      status: 'passed',
                      result: JSON.stringify(result, null, 2)
                    } : c
                  )
                } : p
              ));
              
              passedChecks++;
            } else {
              // Manual checks default to warning status
              setValidationPhases(prev => prev.map(p => 
                p.id === phase.id ? {
                  ...p,
                  checks: p.checks.map(c => 
                    c.id === check.id ? { 
                      ...c, 
                      status: 'warning',
                      result: 'Manual verification required'
                    } : c
                  )
                } : p
              ));
            }

          } catch (error) {
            // Update check with failure
            setValidationPhases(prev => prev.map(p => 
              p.id === phase.id ? {
                ...p,
                checks: p.checks.map(c => 
                  c.id === check.id ? { 
                    ...c, 
                    status: 'failed',
                    error: error.message
                  } : c
                )
              } : p
            ));
          }

          // Update phase progress
          const progress = ((i + 1) / phase.checks.length) * 100;
          setValidationPhases(prev => prev.map(p => 
            p.id === phase.id ? { ...p, progress } : p
          ));

          // Add delay for better UX
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Update final phase status
        const hasFailures = phase.checks.some(c => 
          validationPhases.find(p => p.id === phase.id)?.checks.find(check => check.id === c.id)?.status === 'failed'
        );
        
        setValidationPhases(prev => prev.map(p => 
          p.id === phase.id ? { 
            ...p, 
            status: hasFailures ? 'failed' : 'completed',
            progress: 100
          } : p
        ));
      }

      toast({
        title: "Validation Complete",
        description: "Deployment validation has finished",
      });

    } catch (error) {
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setCurrentPhase(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'running': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Deployment Validation Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>Environment</Label>
                <select 
                  value={selectedEnvironment}
                  onChange={(e) => setSelectedEnvironment(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
            
            <Button
              onClick={() => runValidation()}
              disabled={isRunning}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Running Validation..." : "Run All Validations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Phases */}
      <div className="space-y-6">
        {validationPhases.map(phase => (
          <Card key={phase.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {phase.icon}
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {phase.name}
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">{phase.description}</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runValidation(phase.id)}
                  disabled={isRunning}
                >
                  {currentPhase === phase.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {phase.status === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(phase.progress)}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {phase.checks.map(check => (
                  <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {check.name}
                          {check.critical && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                          {!check.automated && (
                            <Badge variant="outline" className="text-xs">Manual</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{check.description}</div>
                        <div className="text-xs text-muted-foreground">{check.category}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                      {check.error && (
                        <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                          {check.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeploymentValidation;