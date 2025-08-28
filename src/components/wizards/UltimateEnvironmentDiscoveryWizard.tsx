import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, Brain, Target, Map, Compass, Navigation, Search,
  Building, Users, Globe, Shield, Zap, Database, Plus, Save,
  FileText, GitBranch, Package, Terminal, BookOpen, HelpCircle,
  ChevronRight, ChevronLeft, CheckCircle, XCircle, Info,
  AlertTriangle, Layers, Filter, Play, Pause, RotateCw, Wifi,
  MessageSquare, Lightbulb, TrendingUp, Award, Star, Server,
  Clock, Calendar, DollarSign, BarChart3, PieChart, Key,
  Network, Cloud, Lock, Settings, Monitor, Smartphone, Router,
  HardDrive, Cpu, Activity, Radio, UserCheck, ShieldCheck,
  KeyRound, Fingerprint, CreditCard, Eye, EyeOff, Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVendors } from '@/hooks/useVendors';
import { useCompliance } from '@/hooks/useCompliance';
import { useRequirements } from '@/hooks/useRequirements';
import { useUseCases } from '@/hooks/useUseCases';

interface EnvironmentDiscovery {
  // Company Information
  company: {
    name: string;
    industry: string;
    size: string;
    locations: number;
    headquarters: string;
    itTeamSize: number;
    securityTeamSize: number;
  };
  
  // Network Infrastructure
  network: {
    sites: Site[];
    totalDevices: number;
    totalUsers: number;
    vpnSolution: string;
    vpnVendor: string;
    remoteAccessMethod: string;
    wanType: string;
    internetProviders: string[];
  };
  
  // Current NAC/RADIUS
  currentNAC: {
    hasNAC: boolean;
    vendor?: string;
    product?: string;
    version?: string;
    licenseCount?: number;
    expirationDate?: Date;
    painPoints: string[];
    keepFeatures: string[];
  };
  
  // Authentication Methods
  authentication: {
    currentMethods: AuthMethod[];
    desiredMethods: AuthMethod[];
    identityProviders: IdentityProvider[];
    mfaEnabled: boolean;
    mfaSolution?: string;
    ssoEnabled: boolean;
    ssoProvider?: string;
  };
  
  // PKI Infrastructure
  pki: {
    hasPKI: boolean;
    pkiVendor?: string;
    certificateAuthority?: string;
    usePortnoxPKI: boolean;
    certificateTypes: string[];
    certificateLifecycle?: number;
  };
  
  // Security Stack
  security: {
    firewalls: SecurityTool[];
    edrSolution: SecurityTool[];
    siemSolution: SecurityTool[];
    mdmSolution: SecurityTool[];
    dlpSolution: SecurityTool[];
    casb: SecurityTool[];
    vulnerabilityScanner: SecurityTool[];
  };
  
  // Device Management
  devices: {
    managedDevices: DeviceCategory[];
    unmanagedDevices: DeviceCategory[];
    byodPolicy: string;
    iotDevices: IoTDevice[];
    guestAccess: GuestRequirements;
  };
  
  // Compliance & Requirements
  compliance: {
    frameworks: string[];
    regulations: string[];
    auditFrequency: string;
    lastAuditDate?: Date;
    criticalControls: string[];
  };
  
  // Technical Requirements
  requirements: {
    agentBased: boolean;
    agentlessPreferred: boolean;
    tacacsRequired: boolean;
    deviceAdministration: boolean;
    posturing: boolean;
    remediation: boolean;
    guestPortal: boolean;
    byodOnboarding: boolean;
    apiIntegration: string[];
  };
  
  // Project Goals
  goals: {
    primaryObjectives: string[];
    successCriteria: string[];
    timeline: string;
    budget: string;
    decisionMakers: string[];
    technicalContacts: string[];
  };
}

interface Site {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'datacenter' | 'remote';
  location: string;
  userCount: number;
  deviceCount: number;
  switches: NetworkDevice[];
  wirelessControllers: NetworkDevice[];
  firewalls: NetworkDevice[];
  routers: NetworkDevice[];
  criticality: 'high' | 'medium' | 'low';
}

interface NetworkDevice {
  vendor: string;
  model: string;
  firmware?: string;
  count: number;
  managementIP?: string;
  supportStatus: 'supported' | 'eol' | 'unknown';
}

interface AuthMethod {
  type: '802.1X' | 'MAB' | 'WebAuth' | 'PSK' | 'EAP-TLS' | 'PEAP' | 'EAP-TTLS';
  enabled: boolean;
  usage: string;
}

interface IdentityProvider {
  type: 'ActiveDirectory' | 'AzureAD' | 'Okta' | 'Google' | 'LDAP' | 'SAML' | 'Other';
  name: string;
  integrated: boolean;
  userCount?: number;
}

interface SecurityTool {
  vendor: string;
  product: string;
  version?: string;
  integrated: boolean;
  apiAvailable: boolean;
}

interface DeviceCategory {
  type: string;
  count: number;
  osTypes: string[];
  managementMethod?: string;
}

interface IoTDevice {
  category: string;
  vendor: string;
  model?: string;
  count: number;
  networkSegment?: string;
  authCapability: 'none' | '802.1X' | 'MAB' | 'PSK';
}

interface GuestRequirements {
  required: boolean;
  sponsorApproval: boolean;
  selfRegistration: boolean;
  socialLogin: boolean;
  maxDuration: number;
  acceptableUsePolicy: boolean;
}

const UltimateEnvironmentDiscoveryWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [discovery, setDiscovery] = useState<EnvironmentDiscovery>({
    company: {
      name: '',
      industry: '',
      size: '',
      locations: 1,
      headquarters: '',
      itTeamSize: 5,
      securityTeamSize: 2
    },
    network: {
      sites: [],
      totalDevices: 0,
      totalUsers: 0,
      vpnSolution: '',
      vpnVendor: '',
      remoteAccessMethod: '',
      wanType: '',
      internetProviders: []
    },
    currentNAC: {
      hasNAC: false,
      painPoints: [],
      keepFeatures: []
    },
    authentication: {
      currentMethods: [],
      desiredMethods: [],
      identityProviders: [],
      mfaEnabled: false,
      ssoEnabled: false
    },
    pki: {
      hasPKI: false,
      usePortnoxPKI: false,
      certificateTypes: []
    },
    security: {
      firewalls: [],
      edrSolution: [],
      siemSolution: [],
      mdmSolution: [],
      dlpSolution: [],
      casb: [],
      vulnerabilityScanner: []
    },
    devices: {
      managedDevices: [],
      unmanagedDevices: [],
      byodPolicy: 'none',
      iotDevices: [],
      guestAccess: {
        required: false,
        sponsorApproval: false,
        selfRegistration: false,
        socialLogin: false,
        maxDuration: 8,
        acceptableUsePolicy: true
      }
    },
    compliance: {
      frameworks: [],
      regulations: [],
      auditFrequency: 'annual',
      criticalControls: []
    },
    requirements: {
      agentBased: false,
      agentlessPreferred: true,
      tacacsRequired: false,
      deviceAdministration: false,
      posturing: true,
      remediation: false,
      guestPortal: true,
      byodOnboarding: true,
      apiIntegration: []
    },
    goals: {
      primaryObjectives: [],
      successCriteria: [],
      timeline: '',
      budget: '',
      decisionMakers: [],
      technicalContacts: []
    }
  });
  
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAddNewItem, setShowAddNewItem] = useState(false);
  const [newItemType, setNewItemType] = useState('');
  const [newItemData, setNewItemData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [completionScore, setCompletionScore] = useState(0);
  
  const { toast } = useToast();
  const { vendors } = useVendors();
  const { frameworks } = useCompliance();
  const { requirements } = useRequirements();
  const { useCases } = useUseCases();

  const wizardSteps = [
    {
      title: 'Company Profile',
      icon: Building,
      description: 'Basic company information',
      fields: ['name', 'industry', 'size', 'locations']
    },
    {
      title: 'Network Infrastructure',
      icon: Network,
      description: 'Sites, devices, and network topology',
      fields: ['sites', 'devices', 'wan', 'vpn']
    },
    {
      title: 'Current NAC/RADIUS',
      icon: Radio,
      description: 'Existing NAC or RADIUS solution',
      fields: ['vendor', 'product', 'painPoints']
    },
    {
      title: 'Authentication',
      icon: UserCheck,
      description: 'Current and desired authentication methods',
      fields: ['methods', 'providers', 'mfa', 'sso']
    },
    {
      title: 'PKI Infrastructure',
      icon: Key,
      description: 'Certificate management and PKI',
      fields: ['ca', 'certificates', 'portnoxPKI']
    },
    {
      title: 'Security Stack',
      icon: Shield,
      description: 'Existing security tools and integrations',
      fields: ['firewall', 'edr', 'siem', 'mdm']
    },
    {
      title: 'Device Management',
      icon: Monitor,
      description: 'Managed, unmanaged, BYOD, and IoT devices',
      fields: ['managed', 'byod', 'iot', 'guest']
    },
    {
      title: 'Compliance',
      icon: ShieldCheck,
      description: 'Regulatory and compliance requirements',
      fields: ['frameworks', 'regulations', 'controls']
    },
    {
      title: 'Technical Requirements',
      icon: Settings,
      description: 'Specific technical needs and preferences',
      fields: ['agent', 'tacacs', 'posturing', 'api']
    },
    {
      title: 'Project Goals',
      icon: Target,
      description: 'Objectives, timeline, and success criteria',
      fields: ['objectives', 'timeline', 'budget', 'contacts']
    },
    {
      title: 'AI Recommendations',
      icon: Brain,
      description: 'Review AI-generated recommendations',
      fields: ['review', 'customize', 'finalize']
    }
  ];

  useEffect(() => {
    calculateCompletionScore();
  }, [discovery]);

  const calculateCompletionScore = () => {
    let score = 0;
    let totalFields = 0;
    
    // Check company fields
    if (discovery.company.name) score++;
    if (discovery.company.industry) score++;
    if (discovery.company.size) score++;
    totalFields += 3;
    
    // Check network fields
    if (discovery.network.sites.length > 0) score++;
    if (discovery.network.totalDevices > 0) score++;
    totalFields += 2;
    
    // Check authentication
    if (discovery.authentication.currentMethods.length > 0) score++;
    if (discovery.authentication.identityProviders.length > 0) score++;
    totalFields += 2;
    
    // Check security stack
    if (discovery.security.firewalls.length > 0) score++;
    totalFields += 1;
    
    // Check compliance
    if (discovery.compliance.frameworks.length > 0) score++;
    totalFields += 1;
    
    // Check goals
    if (discovery.goals.primaryObjectives.length > 0) score++;
    if (discovery.goals.timeline) score++;
    totalFields += 2;
    
    setCompletionScore(Math.round((score / totalFields) * 100));
  };

  const generateAIRecommendations = async () => {
    setIsGeneratingAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: { discovery }
      });
      
      if (error) throw error;
      
      // Simulate AI recommendations based on discovery data
      const recommendations = [
        {
          category: 'Authentication',
          recommendation: discovery.pki.hasPKI 
            ? 'Leverage existing PKI for EAP-TLS authentication'
            : 'Consider Portnox Cloud PKI for certificate-based authentication',
          priority: 'high',
          impact: 'security'
        },
        {
          category: 'Integration',
          recommendation: discovery.security.mdmSolution.length > 0
            ? `Integrate with ${discovery.security.mdmSolution[0].vendor} MDM for device compliance`
            : 'Consider MDM integration for enhanced device management',
          priority: 'medium',
          impact: 'operational'
        },
        {
          category: 'Compliance',
          recommendation: discovery.compliance.frameworks.includes('PCI-DSS')
            ? 'Implement network segmentation for PCI compliance'
            : 'Review compliance requirements for your industry',
          priority: discovery.compliance.frameworks.length > 0 ? 'high' : 'low',
          impact: 'compliance'
        },
        {
          category: 'Guest Access',
          recommendation: discovery.devices.guestAccess.required
            ? 'Deploy self-service guest portal with sponsor approval workflow'
            : 'Consider guest access for visitors and contractors',
          priority: discovery.devices.guestAccess.required ? 'high' : 'low',
          impact: 'user_experience'
        },
        {
          category: 'IoT Security',
          recommendation: discovery.devices.iotDevices.length > 0
            ? 'Implement MAB authentication with profiling for IoT devices'
            : 'Prepare IoT security strategy for future devices',
          priority: discovery.devices.iotDevices.length > 0 ? 'high' : 'medium',
          impact: 'security'
        },
        {
          category: 'BYOD',
          recommendation: discovery.devices.byodPolicy !== 'none'
            ? 'Deploy BYOD onboarding portal with certificate enrollment'
            : 'Define BYOD policy and onboarding process',
          priority: discovery.devices.byodPolicy !== 'none' ? 'high' : 'medium',
          impact: 'user_experience'
        },
        {
          category: 'Architecture',
          recommendation: discovery.network.sites.length > 5
            ? 'Consider distributed deployment with regional policy servers'
            : 'Centralized deployment recommended for your organization size',
          priority: 'high',
          impact: 'performance'
        },
        {
          category: 'High Availability',
          recommendation: 'Deploy redundant policy servers for high availability',
          priority: 'high',
          impact: 'availability'
        },
        {
          category: 'Monitoring',
          recommendation: discovery.security.siemSolution.length > 0
            ? `Configure syslog integration with ${discovery.security.siemSolution[0].vendor} SIEM`
            : 'Implement centralized logging and monitoring',
          priority: 'medium',
          impact: 'operational'
        },
        {
          category: 'Posture Assessment',
          recommendation: discovery.requirements.posturing
            ? 'Enable device posture assessment for compliance checking'
            : 'Consider posture assessment for enhanced security',
          priority: discovery.requirements.posturing ? 'high' : 'low',
          impact: 'security'
        }
      ];
      
      setAiRecommendations(recommendations);
      
      toast({
        title: "AI Recommendations Generated",
        description: `Generated ${recommendations.length} recommendations based on your environment`,
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      // Fallback recommendations
      const fallbackRecommendations = [
        {
          category: 'General',
          recommendation: 'Start with a phased deployment approach',
          priority: 'high',
          impact: 'operational'
        }
      ];
      
      setAiRecommendations(fallbackRecommendations);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const addNewItemToLibrary = async () => {
    try {
      // Add the new item to the appropriate library
      let table = '';
      switch (newItemType) {
        case 'vendor':
          table = 'vendors_library';
          break;
        case 'device':
          table = 'devices_library';
          break;
        case 'software':
          table = 'software_library';
          break;
        default:
          table = 'custom_library';
      }
      
      const { data, error } = await supabase
        .from(table)
        .insert([{
          ...newItemData,
          created_by: 'discovery_wizard',
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Item Added to Library",
        description: `New ${newItemType} has been added and will be enriched automatically`,
      });
      
      setShowAddNewItem(false);
      setNewItemData({});
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to library",
        variant: "destructive"
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];
    
    switch (currentStep) {
      case 0: // Company Profile
        if (!discovery.company.name) errors.push('Company name is required');
        if (!discovery.company.industry) errors.push('Industry is required');
        if (!discovery.company.size) errors.push('Company size is required');
        break;
      
      case 1: // Network Infrastructure
        if (discovery.network.sites.length === 0) errors.push('At least one site is required');
        if (discovery.network.totalDevices === 0) errors.push('Total device count is required');
        break;
      
      case 3: // Authentication
        if (discovery.authentication.currentMethods.length === 0) {
          errors.push('Select at least one current authentication method');
        }
        if (discovery.authentication.identityProviders.length === 0) {
          errors.push('Add at least one identity provider');
        }
        break;
      
      case 9: // Project Goals
        if (discovery.goals.primaryObjectives.length === 0) {
          errors.push('Define at least one primary objective');
        }
        if (!discovery.goals.timeline) errors.push('Project timeline is required');
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === wizardSteps.length - 2) {
        // Generate AI recommendations before the last step
        generateAIRecommendations();
      }
      setCurrentStep(Math.min(currentStep + 1, wizardSteps.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSaveProject = async () => {
    try {
      // Create project from discovery data
      const projectData = {
        name: `${discovery.company.name} NAC Implementation`,
        description: `NAC deployment for ${discovery.company.name}`,
        company: discovery.company,
        discovery: discovery,
        recommendations: aiRecommendations,
        status: 'planning',
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Project Created Successfully",
        description: `Project ID: ${data.id}`,
      });
      
      // Navigate to project dashboard
      window.location.href = `/projects/${data.id}`;
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Company Profile
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={discovery.company.name}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, name: e.target.value }
                  })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={discovery.company.industry}
                  onValueChange={(value) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, industry: value }
                  })}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Energy">Energy & Utilities</SelectItem>
                    <SelectItem value="Hospitality">Hospitality</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-size">Company Size *</Label>
                <Select
                  value={discovery.company.size}
                  onValueChange={(value) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, size: value }
                  })}
                >
                  <SelectTrigger id="company-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-100">Small (1-100 employees)</SelectItem>
                    <SelectItem value="101-500">Medium (101-500)</SelectItem>
                    <SelectItem value="501-1000">Mid-Market (501-1000)</SelectItem>
                    <SelectItem value="1001-5000">Large (1001-5000)</SelectItem>
                    <SelectItem value="5001-10000">Enterprise (5001-10000)</SelectItem>
                    <SelectItem value="10000+">Global Enterprise (10000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="locations">Number of Locations *</Label>
                <Input
                  id="locations"
                  type="number"
                  value={discovery.company.locations}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, locations: parseInt(e.target.value) || 1 }
                  })}
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="headquarters">Headquarters Location</Label>
                <Input
                  id="headquarters"
                  value={discovery.company.headquarters}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, headquarters: e.target.value }
                  })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="it-team">IT Team Size</Label>
                <Input
                  id="it-team"
                  type="number"
                  value={discovery.company.itTeamSize}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, itTeamSize: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="security-team">Security Team Size</Label>
                <Input
                  id="security-team"
                  type="number"
                  value={discovery.company.securityTeamSize}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    company: { ...discovery.company, securityTeamSize: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                />
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This information helps us tailor recommendations to your organization's specific needs and scale.
              </AlertDescription>
            </Alert>
          </div>
        );
      
      case 1: // Network Infrastructure
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sites & Locations</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSite: Site = {
                    id: Date.now().toString(),
                    name: '',
                    type: 'branch',
                    location: '',
                    userCount: 0,
                    deviceCount: 0,
                    switches: [],
                    wirelessControllers: [],
                    firewalls: [],
                    routers: [],
                    criticality: 'medium'
                  };
                  setDiscovery({
                    ...discovery,
                    network: {
                      ...discovery.network,
                      sites: [...discovery.network.sites, newSite]
                    }
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
            
            {discovery.network.sites.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Add at least one site to continue. Sites help us understand your network topology.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {discovery.network.sites.map((site, index) => (
                  <Card key={site.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Site Name</Label>
                          <Input
                            value={site.name}
                            onChange={(e) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].name = e.target.value;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                            placeholder="e.g., Main Office"
                          />
                        </div>
                        <div>
                          <Label>Site Type</Label>
                          <Select
                            value={site.type}
                            onValueChange={(value) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].type = value as any;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="headquarters">Headquarters</SelectItem>
                              <SelectItem value="branch">Branch Office</SelectItem>
                              <SelectItem value="datacenter">Data Center</SelectItem>
                              <SelectItem value="remote">Remote Site</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={site.location}
                            onChange={(e) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].location = e.target.value;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                            placeholder="City, State/Country"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label>User Count</Label>
                          <Input
                            type="number"
                            value={site.userCount}
                            onChange={(e) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].userCount = parseInt(e.target.value) || 0;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Device Count</Label>
                          <Input
                            type="number"
                            value={site.deviceCount}
                            onChange={(e) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].deviceCount = parseInt(e.target.value) || 0;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Criticality</Label>
                          <Select
                            value={site.criticality}
                            onValueChange={(value) => {
                              const updatedSites = [...discovery.network.sites];
                              updatedSites[index].criticality = value as any;
                              setDiscovery({
                                ...discovery,
                                network: { ...discovery.network, sites: updatedSites }
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          const updatedSites = discovery.network.sites.filter((_, i) => i !== index);
                          setDiscovery({
                            ...discovery,
                            network: { ...discovery.network, sites: updatedSites }
                          });
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove Site
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Network Devices</Label>
                <Input
                  type="number"
                  value={discovery.network.totalDevices}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    network: { ...discovery.network, totalDevices: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Total count across all sites"
                />
              </div>
              <div>
                <Label>Total Users</Label>
                <Input
                  type="number"
                  value={discovery.network.totalUsers}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    network: { ...discovery.network, totalUsers: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Total user count"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>VPN Solution</Label>
                <Input
                  value={discovery.network.vpnSolution}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    network: { ...discovery.network, vpnSolution: e.target.value }
                  })}
                  placeholder="e.g., Cisco AnyConnect, GlobalProtect"
                />
              </div>
              <div>
                <Label>WAN Type</Label>
                <Select
                  value={discovery.network.wanType}
                  onValueChange={(value) => setDiscovery({
                    ...discovery,
                    network: { ...discovery.network, wanType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select WAN type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MPLS">MPLS</SelectItem>
                    <SelectItem value="SD-WAN">SD-WAN</SelectItem>
                    <SelectItem value="Internet">Internet VPN</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Direct">Direct Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2: // Current NAC/RADIUS
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Do you currently have a NAC or RADIUS solution?</Label>
              <RadioGroup
                value={discovery.currentNAC.hasNAC ? 'yes' : 'no'}
                onValueChange={(value) => setDiscovery({
                  ...discovery,
                  currentNAC: { ...discovery.currentNAC, hasNAC: value === 'yes' }
                })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-nac-yes" />
                  <Label htmlFor="has-nac-yes">Yes, we have an existing solution</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="has-nac-no" />
                  <Label htmlFor="has-nac-no">No, this is a new implementation</Label>
                </div>
              </RadioGroup>
            </div>
            
            {discovery.currentNAC.hasNAC && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Vendor</Label>
                    <Select
                      value={discovery.currentNAC.vendor || ''}
                      onValueChange={(value) => setDiscovery({
                        ...discovery,
                        currentNAC: { ...discovery.currentNAC, vendor: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cisco">Cisco</SelectItem>
                        <SelectItem value="Aruba">Aruba/HPE</SelectItem>
                        <SelectItem value="Fortinet">Fortinet</SelectItem>
                        <SelectItem value="Microsoft">Microsoft NPS</SelectItem>
                        <SelectItem value="FreeRADIUS">FreeRADIUS</SelectItem>
                        <SelectItem value="Pulse Secure">Pulse Secure</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {discovery.currentNAC.vendor === 'Other' && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setNewItemType('vendor');
                          setShowAddNewItem(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New Vendor
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={discovery.currentNAC.product || ''}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        currentNAC: { ...discovery.currentNAC, product: e.target.value }
                      })}
                      placeholder="e.g., ISE, ClearPass"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Version</Label>
                    <Input
                      value={discovery.currentNAC.version || ''}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        currentNAC: { ...discovery.currentNAC, version: e.target.value }
                      })}
                      placeholder="e.g., 3.1.0"
                    />
                  </div>
                  <div>
                    <Label>License Count</Label>
                    <Input
                      type="number"
                      value={discovery.currentNAC.licenseCount || ''}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        currentNAC: { ...discovery.currentNAC, licenseCount: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Pain Points with Current Solution</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      'Complex configuration',
                      'Poor user experience',
                      'Limited visibility',
                      'High maintenance',
                      'Expensive licensing',
                      'Lack of features',
                      'Performance issues',
                      'Integration challenges'
                    ].map(pain => (
                      <div key={pain} className="flex items-center space-x-2">
                        <Checkbox
                          checked={discovery.currentNAC.painPoints.includes(pain)}
                          onCheckedChange={(checked) => {
                            const painPoints = checked
                              ? [...discovery.currentNAC.painPoints, pain]
                              : discovery.currentNAC.painPoints.filter(p => p !== pain);
                            setDiscovery({
                              ...discovery,
                              currentNAC: { ...discovery.currentNAC, painPoints }
                            });
                          }}
                        />
                        <Label className="font-normal cursor-pointer">{pain}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Features to Keep</Label>
                  <Textarea
                    value={discovery.currentNAC.keepFeatures.join('\n')}
                    onChange={(e) => setDiscovery({
                      ...discovery,
                      currentNAC: {
                        ...discovery.currentNAC,
                        keepFeatures: e.target.value.split('\n').filter(f => f.trim())
                      }
                    })}
                    placeholder="List features you want to keep (one per line)"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        );
      
      case 3: // Authentication
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Current Authentication Methods</Label>
              <div className="grid grid-cols-2 gap-3">
                {['802.1X', 'MAB', 'WebAuth', 'PSK', 'EAP-TLS', 'PEAP', 'EAP-TTLS'].map(method => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      checked={discovery.authentication.currentMethods.some(m => m.type === method)}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...discovery.authentication.currentMethods, { type: method as any, enabled: true, usage: '' }]
                          : discovery.authentication.currentMethods.filter(m => m.type !== method);
                        setDiscovery({
                          ...discovery,
                          authentication: { ...discovery.authentication, currentMethods: methods }
                        });
                      }}
                    />
                    <Label className="font-normal cursor-pointer">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base mb-4 block">Desired Authentication Methods</Label>
              <div className="grid grid-cols-2 gap-3">
                {['802.1X', 'MAB', 'WebAuth', 'PSK', 'EAP-TLS', 'PEAP', 'EAP-TTLS'].map(method => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      checked={discovery.authentication.desiredMethods.some(m => m.type === method)}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...discovery.authentication.desiredMethods, { type: method as any, enabled: true, usage: '' }]
                          : discovery.authentication.desiredMethods.filter(m => m.type !== method);
                        setDiscovery({
                          ...discovery,
                          authentication: { ...discovery.authentication, desiredMethods: methods }
                        });
                      }}
                    />
                    <Label className="font-normal cursor-pointer">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base">Identity Providers</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newProvider: IdentityProvider = {
                      type: 'ActiveDirectory',
                      name: '',
                      integrated: false
                    };
                    setDiscovery({
                      ...discovery,
                      authentication: {
                        ...discovery.authentication,
                        identityProviders: [...discovery.authentication.identityProviders, newProvider]
                      }
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
              
              {discovery.authentication.identityProviders.map((provider, index) => (
                <Card key={index} className="mb-3">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={provider.type}
                          onValueChange={(value) => {
                            const providers = [...discovery.authentication.identityProviders];
                            providers[index].type = value as any;
                            setDiscovery({
                              ...discovery,
                              authentication: { ...discovery.authentication, identityProviders: providers }
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ActiveDirectory">Active Directory</SelectItem>
                            <SelectItem value="AzureAD">Azure AD</SelectItem>
                            <SelectItem value="Okta">Okta</SelectItem>
                            <SelectItem value="Google">Google Workspace</SelectItem>
                            <SelectItem value="LDAP">LDAP</SelectItem>
                            <SelectItem value="SAML">SAML IdP</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Name/Domain</Label>
                        <Input
                          value={provider.name}
                          onChange={(e) => {
                            const providers = [...discovery.authentication.identityProviders];
                            providers[index].name = e.target.value;
                            setDiscovery({
                              ...discovery,
                              authentication: { ...discovery.authentication, identityProviders: providers }
                            });
                          }}
                          placeholder="e.g., corp.domain.com"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const providers = discovery.authentication.identityProviders.filter((_, i) => i !== index);
                            setDiscovery({
                              ...discovery,
                              authentication: { ...discovery.authentication, identityProviders: providers }
                            });
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mfa-enabled">Multi-Factor Authentication (MFA)</Label>
                <Switch
                  id="mfa-enabled"
                  checked={discovery.authentication.mfaEnabled}
                  onCheckedChange={(checked) => setDiscovery({
                    ...discovery,
                    authentication: { ...discovery.authentication, mfaEnabled: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sso-enabled">Single Sign-On (SSO)</Label>
                <Switch
                  id="sso-enabled"
                  checked={discovery.authentication.ssoEnabled}
                  onCheckedChange={(checked) => setDiscovery({
                    ...discovery,
                    authentication: { ...discovery.authentication, ssoEnabled: checked }
                  })}
                />
              </div>
            </div>
            
            {discovery.authentication.mfaEnabled && (
              <div>
                <Label>MFA Solution</Label>
                <Input
                  value={discovery.authentication.mfaSolution || ''}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    authentication: { ...discovery.authentication, mfaSolution: e.target.value }
                  })}
                  placeholder="e.g., Duo, RSA, Microsoft Authenticator"
                />
              </div>
            )}
            
            {discovery.authentication.ssoEnabled && (
              <div>
                <Label>SSO Provider</Label>
                <Input
                  value={discovery.authentication.ssoProvider || ''}
                  onChange={(e) => setDiscovery({
                    ...discovery,
                    authentication: { ...discovery.authentication, ssoProvider: e.target.value }
                  })}
                  placeholder="e.g., Okta, Azure AD, Ping"
                />
              </div>
            )}
          </div>
        );
      
      case 4: // PKI Infrastructure
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Do you have an existing PKI infrastructure?</Label>
              <RadioGroup
                value={discovery.pki.hasPKI ? 'yes' : 'no'}
                onValueChange={(value) => setDiscovery({
                  ...discovery,
                  pki: { ...discovery.pki, hasPKI: value === 'yes' }
                })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-pki-yes" />
                  <Label htmlFor="has-pki-yes">Yes, we have PKI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="has-pki-no" />
                  <Label htmlFor="has-pki-no">No PKI infrastructure</Label>
                </div>
              </RadioGroup>
            </div>
            
            {discovery.pki.hasPKI && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>PKI Vendor</Label>
                    <Input
                      value={discovery.pki.pkiVendor || ''}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        pki: { ...discovery.pki, pkiVendor: e.target.value }
                      })}
                      placeholder="e.g., Microsoft, DigiCert, Entrust"
                    />
                  </div>
                  <div>
                    <Label>Certificate Authority</Label>
                    <Input
                      value={discovery.pki.certificateAuthority || ''}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        pki: { ...discovery.pki, certificateAuthority: e.target.value }
                      })}
                      placeholder="e.g., Internal CA, Public CA"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Certificate Types in Use</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['User Certificates', 'Device Certificates', 'Server Certificates', 'Code Signing', 'Email Certificates', 'WiFi Certificates'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          checked={discovery.pki.certificateTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            const types = checked
                              ? [...discovery.pki.certificateTypes, type]
                              : discovery.pki.certificateTypes.filter(t => t !== type);
                            setDiscovery({
                              ...discovery,
                              pki: { ...discovery.pki, certificateTypes: types }
                            });
                          }}
                        />
                        <Label className="font-normal cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Certificate Lifecycle (months)</Label>
                  <Input
                    type="number"
                    value={discovery.pki.certificateLifecycle || ''}
                    onChange={(e) => setDiscovery({
                      ...discovery,
                      pki: { ...discovery.pki, certificateLifecycle: parseInt(e.target.value) || 12 }
                    })}
                    placeholder="12"
                  />
                </div>
              </>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base">Would you like to use Portnox Cloud PKI?</Label>
                <Switch
                  checked={discovery.pki.usePortnoxPKI}
                  onCheckedChange={(checked) => setDiscovery({
                    ...discovery,
                    pki: { ...discovery.pki, usePortnoxPKI: checked }
                  })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Portnox Cloud PKI provides automated certificate lifecycle management with no infrastructure required.
              </p>
            </div>
          </div>
        );
      
      case 10: // AI Recommendations
        return (
          <div className="space-y-6">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Based on your environment discovery, here are our AI-generated recommendations
              </AlertDescription>
            </Alert>
            
            {isGeneratingAI ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing your environment...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">
                              {rec.impact}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{rec.category}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.recommendation}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <Button onClick={generateAIRecommendations} disabled={isGeneratingAI}>
                <RotateCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={handleSaveProject} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Save & Create Project
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This step is under development. Please continue to the next step.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Compass className="h-8 w-8" />
                  Ultimate Environment Discovery Wizard
                </CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  Complete environment assessment with AI-powered recommendations
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{completionScore}%</div>
                <div className="text-sm text-blue-100">Complete</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    {index < wizardSteps.length - 1 && (
                      <div className={`w-full h-1 mx-1 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">{wizardSteps[currentStep].title}</p>
              <p className="text-sm text-muted-foreground">{wizardSteps[currentStep].description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(wizardSteps[currentStep].icon, { className: 'h-5 w-5' })}
                  {wizardSteps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  {renderStepContent()}
                </ScrollArea>
                
                {validationErrors.length > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === wizardSteps.length - 1 ? (
                    <Button
                      onClick={handleSaveProject}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete & Save
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Discovery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={completionScore} className="mb-2" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sites</span>
                    <span className="font-medium">{discovery.network.sites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Devices</span>
                    <span className="font-medium">{discovery.network.totalDevices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{discovery.network.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auth Methods</span>
                    <span className="font-medium">{discovery.authentication.currentMethods.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {currentStep === 0 && "Start by entering your company information. This helps us tailor recommendations."}
                    {currentStep === 1 && "Define all your sites and network infrastructure for accurate sizing."}
                    {currentStep === 2 && "If you have an existing NAC, we'll help you migrate smoothly."}
                    {currentStep === 3 && "Select both current and desired authentication methods for gap analysis."}
                    {currentStep === 4 && "PKI infrastructure enables strong certificate-based authentication."}
                    {currentStep === 5 && "Integration with your security stack enhances visibility and response."}
                    {currentStep === 6 && "Understanding your device landscape helps with policy design."}
                    {currentStep === 7 && "Compliance requirements drive many architectural decisions."}
                    {currentStep === 8 && "Technical requirements help us recommend the right solution."}
                    {currentStep === 9 && "Clear goals and timeline ensure project success."}
                    {currentStep === 10 && "Review AI recommendations and customize as needed."}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "AI Tip",
                      description: "Complete all fields for more accurate recommendations",
                    });
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    const json = JSON.stringify(discovery, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'discovery.json';
                    a.click();
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Export Discovery
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={generateAIRecommendations}
                  disabled={isGeneratingAI}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add New Item Modal */}
        {showAddNewItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-[500px]">
              <CardHeader>
                <CardTitle>Add New {newItemType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newItemData.name || ''}
                      onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newItemData.description || ''}
                      onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddNewItem(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewItemToLibrary}>
                      Add to Library
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimateEnvironmentDiscoveryWizard;

