import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Server, Wifi, Lock, Smartphone, Database, FileCheck,
  Plus, X, ArrowRight, ArrowLeft, Zap, Settings, Monitor, Router,
  Cpu, HardDrive, Printer, Camera, Phone, Tablet, Laptop, Download, Copy
} from 'lucide-react';

import { useEnhancedVendors } from '@/hooks/useVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useToast } from '@/hooks/use-toast';

interface ConfigurationData {
  // Basic Info
  basic_info: {
    config_name: string;
    description: string;
    deployment_environment: string;
    priority: string;
  };
  
  // Vendor & Infrastructure
  vendor_infrastructure: {
    primary_vendor: string;
    model: string;
    firmware_version: string;
    deployment_mode: string;
    management_method: string;
  };
  
  // Authentication & Security
  authentication_security: {
    auth_methods: string[];
    radius_servers: Array<{host: string; port: number; secret: string;}>;
    certificate_authority: string;
    encryption_method: string;
    fallback_auth: string;
  };
  
  // Network Configuration
  network_config: {
    vlan_assignments: Array<{role: string; vlan_id: number; description: string;}>;
    access_policies: string[];
    guest_network: {
      enabled: boolean;
      vlan_id: number;
      bandwidth_limit: string;
      access_duration: string;
    };
  };
  
  // Templates & AI Generation
  templates_ai: {
    selected_templates: string[];
    configuration_type: string;
    generated_config: string;
    validation_results: {
      syntax_valid: boolean;
      warnings: string[];
      recommendations: string[];
    };
  };
}

interface EnhancedConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onComplete?: (configData: ConfigurationData) => void;
  onCancel?: () => void;
}

const EnhancedConfigWizard: React.FC<EnhancedConfigWizardProps> = ({
  projectId,
  siteId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aiGenerationLoading, setAiGenerationLoading] = useState(false);
  const [formData, setFormData] = useState<ConfigurationData>({
    basic_info: {
      config_name: '',
      description: '',
      deployment_environment: 'Production',
      priority: 'Medium'
    },
    vendor_infrastructure: {
      primary_vendor: '',
      model: '',
      firmware_version: '',
      deployment_mode: 'Centralized',
      management_method: 'CLI'
    },
    authentication_security: {
      auth_methods: [],
      radius_servers: [],
      certificate_authority: '',
      encryption_method: 'WPA3-Enterprise',
      fallback_auth: 'MAB'
    },
    network_config: {
      vlan_assignments: [],
      access_policies: [],
      guest_network: {
        enabled: false,
        vlan_id: 100,
        bandwidth_limit: '10Mbps',
        access_duration: '24h'
      }
    },
    templates_ai: {
      selected_templates: [],
      configuration_type: '802.1X',
      generated_config: '',
      validation_results: {
        syntax_valid: true,
        warnings: [],
        recommendations: []
      }
    }
  });

  const { data: vendors = [] } = useEnhancedVendors();
  const { data: vendorModels = [] } = useVendorModels(formData.vendor_infrastructure.primary_vendor);
  const { toast } = useToast();

  const steps = [
    {
      id: 'basic_info',
      title: 'Basic Configuration',
      description: 'Define basic configuration details and deployment context',
      icon: FileCheck,
      color: 'text-blue-500'
    },
    {
      id: 'vendor_infrastructure',
      title: 'Vendor & Infrastructure',
      description: 'Select vendor, model, and infrastructure settings',
      icon: Network,
      color: 'text-green-500'
    },
    {
      id: 'authentication_security',
      title: 'Authentication & Security',
      description: 'Configure authentication methods and security settings',
      icon: Shield,
      color: 'text-orange-500'
    },
    {
      id: 'network_config',
      title: 'Network Configuration',
      description: 'Set up VLANs, policies, and network access rules',
      icon: Wifi,
      color: 'text-purple-500'
    },
    {
      id: 'templates_ai',
      title: 'AI Generation & Templates',
      description: 'Generate configuration using AI and templates',
      icon: Brain,
      color: 'text-pink-500'
    }
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(formData);
    }
  };

  const generateConfiguration = async () => {
    setAiGenerationLoading(true);
    try {
      // Simulate AI configuration generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedConfig = `! Generated 802.1X Configuration for ${formData.vendor_infrastructure.primary_vendor}
! Model: ${formData.vendor_infrastructure.model}
! Generated: ${new Date().toISOString()}
!
! === AAA Configuration ===
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
!
! === RADIUS Server Configuration ===
${formData.authentication_security.radius_servers.map((server, index) => 
  `radius server RADIUS-${index + 1}
 address ipv4 ${server.host} auth-port ${server.port} acct-port ${server.port + 1}
 key ${server.secret}`
).join('\n')}
!
! === 802.1X Global Configuration ===
dot1x system-auth-control
dot1x critical eapol
!
! === Interface Configuration ===
interface range gi1/0/1-48
 description Access Ports
 switchport mode access
 switchport access vlan 10
 authentication event fail action next-method
 authentication event server dead action reinitialize vlan 999
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
 spanning-tree bpduguard enable
!
! === VLAN Configuration ===
${formData.network_config.vlan_assignments.map(vlan => 
  `vlan ${vlan.vlan_id}
 name ${vlan.description}
 state active`
).join('\n')}
!
! End of Configuration`;

      setFormData(prev => ({
        ...prev,
        templates_ai: {
          ...prev.templates_ai,
          generated_config: generatedConfig,
          validation_results: {
            syntax_valid: true,
            warnings: ['Consider enabling port security for enhanced security'],
            recommendations: [
              'Add DHCP snooping for additional security',
              'Configure dynamic ARP inspection',
              'Enable storm control on access ports'
            ]
          }
        }
      }));

      toast({
        title: "Configuration Generated",
        description: "AI has successfully generated your network configuration",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAiGenerationLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.templates_ai.generated_config);
      toast({
        title: "Copied to Clipboard",
        description: "Configuration has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy configuration to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([formData.templates_ai.generated_config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.basic_info.config_name || 'config'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Configuration file download has started",
    });
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];

    switch (currentStepData.id) {
      case 'basic_info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="config_name">Configuration Name *</Label>
                <Input
                  id="config_name"
                  value={formData.basic_info.config_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basic_info: { ...prev.basic_info, config_name: e.target.value }
                  }))}
                  placeholder="Enter configuration name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deployment_environment">Deployment Environment</Label>
                <Select
                  value={formData.basic_info.deployment_environment}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    basic_info: { ...prev.basic_info, deployment_environment: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Staging">Staging</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.basic_info.priority}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    basic_info: { ...prev.basic_info, priority: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.basic_info.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  basic_info: { ...prev.basic_info, description: e.target.value }
                }))}
                placeholder="Describe the purpose and scope of this configuration"
                rows={4}
              />
            </div>
          </div>
        );

      case 'vendor_infrastructure':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary_vendor">Primary Vendor *</Label>
                <Select
                  value={formData.vendor_infrastructure.primary_vendor}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    vendor_infrastructure: { ...prev.vendor_infrastructure, primary_vendor: value, model: '' }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Select
                  value={formData.vendor_infrastructure.model}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    vendor_infrastructure: { ...prev.vendor_infrastructure, model: value }
                  }))}
                  disabled={!formData.vendor_infrastructure.primary_vendor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.model_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firmware_version">Firmware Version</Label>
                <Input
                  id="firmware_version"
                  value={formData.vendor_infrastructure.firmware_version}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vendor_infrastructure: { ...prev.vendor_infrastructure, firmware_version: e.target.value }
                  }))}
                  placeholder="e.g., 15.2(7)E3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deployment_mode">Deployment Mode</Label>
                <Select
                  value={formData.vendor_infrastructure.deployment_mode}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    vendor_infrastructure: { ...prev.vendor_infrastructure, deployment_mode: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centralized">Centralized</SelectItem>
                    <SelectItem value="Distributed">Distributed</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="management_method">Management Method</Label>
                <Select
                  value={formData.vendor_infrastructure.management_method}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    vendor_infrastructure: { ...prev.vendor_infrastructure, management_method: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLI">Command Line Interface</SelectItem>
                    <SelectItem value="GUI">Graphical User Interface</SelectItem>
                    <SelectItem value="API">REST API</SelectItem>
                    <SelectItem value="SNMP">SNMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'authentication_security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Authentication Methods</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['802.1X', 'MAB', 'Web Auth', 'Certificate', 'Multi-Factor'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`auth-${method}`}
                      checked={formData.authentication_security.auth_methods.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            authentication_security: {
                              ...prev.authentication_security,
                              auth_methods: [...prev.authentication_security.auth_methods, method]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            authentication_security: {
                              ...prev.authentication_security,
                              auth_methods: prev.authentication_security.auth_methods.filter(m => m !== method)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`auth-${method}`}>{method}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>RADIUS Servers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    authentication_security: {
                      ...prev.authentication_security,
                      radius_servers: [...prev.authentication_security.radius_servers, { host: '', port: 1812, secret: '' }]
                    }
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Server
                </Button>
              </div>

              {formData.authentication_security.radius_servers.map((server, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Host/IP</Label>
                    <Input
                      value={server.host}
                      onChange={(e) => {
                        const newServers = [...formData.authentication_security.radius_servers];
                        newServers[index].host = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          authentication_security: { ...prev.authentication_security, radius_servers: newServers }
                        }));
                      }}
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={server.port}
                      onChange={(e) => {
                        const newServers = [...formData.authentication_security.radius_servers];
                        newServers[index].port = parseInt(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          authentication_security: { ...prev.authentication_security, radius_servers: newServers }
                        }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Shared Secret</Label>
                    <Input
                      type="password"
                      value={server.secret}
                      onChange={(e) => {
                        const newServers = [...formData.authentication_security.radius_servers];
                        newServers[index].secret = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          authentication_security: { ...prev.authentication_security, radius_servers: newServers }
                        }));
                      }}
                      placeholder="Enter shared secret"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newServers = formData.authentication_security.radius_servers.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          authentication_security: { ...prev.authentication_security, radius_servers: newServers }
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="encryption_method">Encryption Method</Label>
                <Select
                  value={formData.authentication_security.encryption_method}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    authentication_security: { ...prev.authentication_security, encryption_method: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA3-Enterprise">WPA3-Enterprise</SelectItem>
                    <SelectItem value="WPA2-Enterprise">WPA2-Enterprise</SelectItem>
                    <SelectItem value="EAP-TLS">EAP-TLS</SelectItem>
                    <SelectItem value="PEAP-MSCHAPv2">PEAP-MSCHAPv2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback_auth">Fallback Authentication</Label>
                <Select
                  value={formData.authentication_security.fallback_auth}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    authentication_security: { ...prev.authentication_security, fallback_auth: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAB">MAC Authentication Bypass</SelectItem>
                    <SelectItem value="Web Auth">Web Authentication</SelectItem>
                    <SelectItem value="Guest VLAN">Guest VLAN</SelectItem>
                    <SelectItem value="Deny">Deny Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'network_config':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>VLAN Assignments</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    network_config: {
                      ...prev.network_config,
                      vlan_assignments: [...prev.network_config.vlan_assignments, { role: '', vlan_id: 10, description: '' }]
                    }
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add VLAN
                </Button>
              </div>

              {formData.network_config.vlan_assignments.map((vlan, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={vlan.role}
                      onValueChange={(value) => {
                        const newVlans = [...formData.network_config.vlan_assignments];
                        newVlans[index].role = value;
                        setFormData(prev => ({
                          ...prev,
                          network_config: { ...prev.network_config, vlan_assignments: newVlans }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                        <SelectItem value="IoT">IoT Devices</SelectItem>
                        <SelectItem value="BYOD">BYOD</SelectItem>
                        <SelectItem value="Quarantine">Quarantine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>VLAN ID</Label>
                    <Input
                      type="number"
                      value={vlan.vlan_id}
                      onChange={(e) => {
                        const newVlans = [...formData.network_config.vlan_assignments];
                        newVlans[index].vlan_id = parseInt(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          network_config: { ...prev.network_config, vlan_assignments: newVlans }
                        }));
                      }}
                      min="1"
                      max="4094"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={vlan.description}
                      onChange={(e) => {
                        const newVlans = [...formData.network_config.vlan_assignments];
                        newVlans[index].description = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          network_config: { ...prev.network_config, vlan_assignments: newVlans }
                        }));
                      }}
                      placeholder="VLAN description"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newVlans = formData.network_config.vlan_assignments.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          network_config: { ...prev.network_config, vlan_assignments: newVlans }
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Label>Access Policies</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Port Security', 'DHCP Snooping', 'Dynamic ARP Inspection', 'Storm Control', 'BPDU Guard', 'Root Guard'].map((policy) => (
                  <div key={policy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`policy-${policy}`}
                      checked={formData.network_config.access_policies.includes(policy)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            network_config: {
                              ...prev.network_config,
                              access_policies: [...prev.network_config.access_policies, policy]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            network_config: {
                              ...prev.network_config,
                              access_policies: prev.network_config.access_policies.filter(p => p !== policy)
                            }
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`policy-${policy}`}>{policy}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guest Network Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guest_enabled"
                    checked={formData.network_config.guest_network.enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      network_config: {
                        ...prev.network_config,
                        guest_network: { ...prev.network_config.guest_network, enabled: checked as boolean }
                      }
                    }))}
                  />
                  <Label htmlFor="guest_enabled">Enable Guest Network</Label>
                </div>

                {formData.network_config.guest_network.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Guest VLAN ID</Label>
                      <Input
                        type="number"
                        value={formData.network_config.guest_network.vlan_id}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          network_config: {
                            ...prev.network_config,
                            guest_network: { ...prev.network_config.guest_network, vlan_id: parseInt(e.target.value) }
                          }
                        }))}
                        min="1"
                        max="4094"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bandwidth Limit</Label>
                      <Select
                        value={formData.network_config.guest_network.bandwidth_limit}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          network_config: {
                            ...prev.network_config,
                            guest_network: { ...prev.network_config.guest_network, bandwidth_limit: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5Mbps">5 Mbps</SelectItem>
                          <SelectItem value="10Mbps">10 Mbps</SelectItem>
                          <SelectItem value="25Mbps">25 Mbps</SelectItem>
                          <SelectItem value="50Mbps">50 Mbps</SelectItem>
                          <SelectItem value="Unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Access Duration</Label>
                      <Select
                        value={formData.network_config.guest_network.access_duration}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          network_config: {
                            ...prev.network_config,
                            guest_network: { ...prev.network_config.guest_network, access_duration: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="8h">8 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'templates_ai':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Configuration Type</Label>
                <Select
                  value={formData.templates_ai.configuration_type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    templates_ai: { ...prev.templates_ai, configuration_type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="802.1X">802.1X Authentication</SelectItem>
                    <SelectItem value="NAC">Network Access Control</SelectItem>
                    <SelectItem value="BYOD">BYOD Policy</SelectItem>
                    <SelectItem value="Guest">Guest Access</SelectItem>
                    <SelectItem value="IoT">IoT Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Configuration Templates</Label>
                <div className="grid grid-cols-1 gap-2">
                  {['Basic 802.1X', 'Enterprise Security', 'Multi-Tenant', 'Healthcare Compliance', 'Industrial IoT'].map((template) => (
                    <div key={template} className="flex items-center space-x-2">
                      <Checkbox
                        id={`template-${template}`}
                        checked={formData.templates_ai.selected_templates.includes(template)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              templates_ai: {
                                ...prev.templates_ai,
                                selected_templates: [...prev.templates_ai.selected_templates, template]
                              }
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              templates_ai: {
                                ...prev.templates_ai,
                                selected_templates: prev.templates_ai.selected_templates.filter(t => t !== template)
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`template-${template}`}>{template}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!formData.templates_ai.generated_config ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Configuration Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Ready to generate your customized network configuration using AI and best practices.
                    </p>
                    <Button
                      onClick={generateConfiguration}
                      disabled={aiGenerationLoading}
                      size="lg"
                      className="bg-gradient-primary hover:bg-gradient-primary/90 text-white"
                    >
                      {aiGenerationLoading ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-spin" />
                          Generating Configuration...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Configuration</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadConfig}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                    {formData.templates_ai.generated_config}
                  </pre>
                </div>

                {formData.templates_ai.validation_results.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Warnings:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        {formData.templates_ai.validation_results.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {formData.templates_ai.validation_results.recommendations.length > 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendations:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        {formData.templates_ai.validation_results.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Configuration Wizard</h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <Badge variant="glow" className="px-3 py-1">
            <Brain className="h-4 w-4 mr-2" />
            AI Powered
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-primary/10 border-primary text-primary'
                    : isCompleted
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <StepIcon className={`h-4 w-4 ${step.color}`} />
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-primary/10`}>
              {React.createElement(steps[currentStep].icon, { className: `h-6 w-6 ${steps[currentStep].color}` })}
            </div>
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-gradient-primary hover:bg-gradient-primary/90 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Configuration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedConfigWizard;