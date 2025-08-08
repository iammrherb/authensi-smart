import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Network, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Save,
  Brain,
  Zap,
  Target,
  Globe,
  Server,
  Wifi,
  Lock,
  Eye,
  UserCheck,
  Cloud,
  Key,
  Award,
  Smartphone,
  Laptop,
  Monitor,
  Router,
  HardDrive,
  Database,
  Activity,
  AlertTriangle,
  Info,
  Plus,
  X,
  FileText,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedVendors } from "@/hooks/useEnhancedVendors";
import { useIndustryOptions, useComplianceFrameworks } from "@/hooks/useResourceLibrary";
import { useRefreshResources } from "@/hooks/useRefreshResources";
import { useAI } from "@/hooks/useAI";
import EnhancedVendorSelector from "./EnhancedVendorSelector";
import DecisionTreeEngine from "./DecisionTreeEngine";
import ScopingFlowManager from "./ScopingFlowManager";

interface VendorModel {
  name: string;
  series?: string;
  firmware_versions: string[];
  features: string[];
  eol_status?: 'active' | 'eol' | 'eos';
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  models: VendorModel[];
  integration_level: 'native' | 'supported' | 'limited' | 'manual';
}

interface SelectedVendor extends Vendor {
  selected_models: string[];
  selected_firmware: Record<string, string[]>;
  deployment_notes?: string;
}

interface PainPoint {
  id: string;
  title: string;
  description: string;
}

interface UseCase {
  id: string;
  name: string;
  category: string;
}

interface ScopingData {
  session_name: string;
  created_at: string;
  last_modified: string;
  organization: {
    name: string;
    industry: string;
    size: string;
    total_users: number;
    pain_points: PainPoint[];
    custom_pain_points: PainPoint[];
  };
  network_infrastructure: {
    site_count: number;
    device_inventory: Record<string, number>;
    network_topology: string;
    current_security_solutions: string[];
  };
  vendor_ecosystem: {
    wired_wireless: SelectedVendor[];
    security_solutions: SelectedVendor[];
    edr_solutions: SelectedVendor[];
    vpn_solutions: SelectedVendor[];
    mfa_solutions: SelectedVendor[];
    sso_solutions: SelectedVendor[];
    cloud_platforms: SelectedVendor[];
    identity_providers: SelectedVendor[];
    pki_solutions: SelectedVendor[];
  };
  use_cases_requirements: {
    primary_use_cases: UseCase[];
    custom_requirements: string[];
    success_criteria: string[];
  };
  integration_compliance: {
    required_integrations: string[];
    compliance_frameworks: string[];
  };
  templates_ai: {
    recommended_templates: string[];
    ai_recommendations: {
      summary?: string;
      generated_at?: string;
    };
  };
}

interface UltimateAIScopingWizardProps {
  onComplete: (sessionId: string, data: ScopingData) => void;
  onSave: (sessionId: string, data: ScopingData) => void;
  onCancel: () => void;
}

const UltimateAIScopingWizard: React.FC<UltimateAIScopingWizardProps> = ({
  onComplete,
  onSave,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState('organization');
  const [scopingData, setScopingData] = useState<ScopingData>({
    session_name: '',
    created_at: new Date().toISOString(),
    last_modified: new Date().toISOString(),
    organization: {
      name: '',
      industry: '',
      size: '',
      total_users: 0,
      pain_points: [],
      custom_pain_points: []
    },
    network_infrastructure: {
      site_count: 1,
      device_inventory: {},
      network_topology: '',
      current_security_solutions: []
    },
    vendor_ecosystem: {
      wired_wireless: [],
      security_solutions: [],
      edr_solutions: [],
      vpn_solutions: [],
      mfa_solutions: [],
      sso_solutions: [],
      cloud_platforms: [],
      identity_providers: [],
      pki_solutions: []
    },
    use_cases_requirements: {
      primary_use_cases: [],
      custom_requirements: [],
      success_criteria: []
    },
    integration_compliance: {
      required_integrations: [],
      compliance_frameworks: []
    },
    templates_ai: {
      recommended_templates: [],
      ai_recommendations: {}
    }
  });

  const { toast } = useToast();
  const { generateRecommendations, isLoading: aiLoading } = useAI();

  const phases = [
    { id: 1, title: "Organization Profile", icon: Building2, color: "from-blue-500 to-cyan-600" },
    { id: 2, title: "Network & Vendors", icon: Network, color: "from-purple-500 to-pink-600" },
    { id: 3, title: "Use Cases & Requirements", icon: Target, color: "from-green-500 to-emerald-600" },
    { id: 4, title: "Integration & Compliance", icon: Shield, color: "from-orange-500 to-red-600" },
    { id: 5, title: "AI Analysis & Templates", icon: Brain, color: "from-indigo-500 to-purple-600" }
  ];

  const { data: industryOptionsData = [] } = useIndustryOptions();
  const { data: enhancedVendors = [] } = useEnhancedVendors();
  const { refreshAll } = useRefreshResources();
  useEffect(() => { refreshAll(); }, []);

  const mapVendor = (ev: any) => ({
    id: ev.id,
    name: ev.vendor_name,
    category: ev.category,
    icon: (ev.vendor_name || '?').toString().charAt(0).toUpperCase(),
    color: 'bg-primary',
    models: (ev.models || []).map((m: any) => ({
      name: m.name || m.model_name || 'Model',
      series: m.series,
      firmware_versions: m.firmware_versions || [],
      features: m.features || [],
      eol_status: (m.eol_status || 'active') as 'active' | 'eol' | 'eos'
    })),
    integration_level: ((ev.portnox_integration_level || 'supported') as 'native' | 'supported' | 'limited' | 'manual')
  });

  const vendorsWiredWireless = enhancedVendors.filter((v: any) => ['Wired Switch','Wireless','Router'].includes(v.category) || ['Switch','Access Point','Router'].includes(v.vendor_type)).map(mapVendor);
  const vendorsSecuritySolutions = enhancedVendors.filter((v: any) => ['Firewall','Security'].includes(v.category) || v.vendor_type === 'Security').map(mapVendor);
  const vendorsEdrSolutions = enhancedVendors.filter((v: any) => ['EDR','XDR'].includes(v.category)).map(mapVendor);
  const vendorsMfaSolutions = enhancedVendors.filter((v: any) => v.category === 'MFA' || v.vendor_type === 'Authentication').map(mapVendor);
  const vendorsSsoSolutions = enhancedVendors.filter((v: any) => v.category === 'SSO' || v.vendor_type === 'Identity').map(mapVendor);
  const vendorsIdentityProviders = enhancedVendors.filter((v: any) => v.category === 'IDP' || v.vendor_type === 'Identity').map(mapVendor);
  const vendorsCloudPlatforms = enhancedVendors.filter((v: any) => v.category === 'Cloud' || v.vendor_type === 'Cloud').map(mapVendor);

  const allVendorsFlat = [
    ...vendorsWiredWireless,
    ...vendorsSecuritySolutions,
    ...vendorsEdrSolutions,
    ...vendorsMfaSolutions,
    ...vendorsSsoSolutions,
    ...vendorsCloudPlatforms,
    ...vendorsIdentityProviders,
  ];

  const industryOptions = (industryOptionsData || []).map((o: any) => o.name);

  const organizationSizes = [
    { value: "startup", label: "Startup (1-50)", users: 25 },
    { value: "smb", label: "Small Business (51-200)", users: 125 },
    { value: "mid-market", label: "Mid-Market (201-1000)", users: 600 },
    { value: "enterprise", label: "Enterprise (1001-5000)", users: 3000 },
    { value: "global", label: "Global Enterprise (5000+)", users: 10000 }
  ];

  // Using Resource Center data for vendor ecosystem


  const commonPainPoints = [
    { id: 'visibility', title: 'Lack of Network Visibility', description: 'Cannot see all devices connecting to the network' },
    { id: 'compliance', title: 'Compliance Requirements', description: 'Need to meet regulatory standards (HIPAA, PCI-DSS, etc.)' },
    { id: 'byod', title: 'BYOD Management', description: 'Challenges with personal devices on corporate network' },
    { id: 'iot', title: 'IoT Device Security', description: 'Securing and managing IoT devices' },
    { id: 'guest', title: 'Guest Access', description: 'Providing secure guest network access' },
    { id: 'segmentation', title: 'Network Segmentation', description: 'Need to segment network for security' },
    { id: 'automation', title: 'Manual Processes', description: 'Too many manual security processes' },
    { id: 'integration', title: 'System Integration', description: 'Difficulty integrating security solutions' }
  ];

  const useCaseLibrary = [
    { id: 'device_visibility', name: 'Device Visibility & Discovery', category: 'Foundation' },
    { id: 'user_auth', name: 'User Authentication', category: 'Identity' },
    { id: 'device_auth', name: 'Device Authentication', category: 'Identity' },
    { id: 'network_segmentation', name: 'Network Segmentation', category: 'Security' },
    { id: 'guest_access', name: 'Guest Access Management', category: 'Access' },
    { id: 'byod', name: 'BYOD Management', category: 'Access' },
    { id: 'iot_security', name: 'IoT Device Security', category: 'Security' },
    { id: 'compliance', name: 'Compliance Reporting', category: 'Governance' },
    { id: 'threat_response', name: 'Automated Threat Response', category: 'Security' },
    { id: 'policy_enforcement', name: 'Policy Enforcement', category: 'Governance' }
  ];

  const { data: complianceFrameworksData = [] } = useComplianceFrameworks();
  const complianceFrameworks = (complianceFrameworksData || []).map((cf: any) => cf.name);

  const handleInputChange = useCallback((section: keyof ScopingData, field: string, value: any) => {
    setScopingData(prev => {
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          last_modified: new Date().toISOString(),
          [section]: {
            ...currentSection,
            [field]: value
          }
        };
      }
      return prev;
    });
  }, []);

  const handlePainPointToggle = useCallback((painPoint: typeof commonPainPoints[0]) => {
    setScopingData(prev => ({
      ...prev,
      last_modified: new Date().toISOString(),
      organization: {
        ...prev.organization,
        pain_points: prev.organization.pain_points?.some(p => p.id === painPoint.id)
          ? prev.organization.pain_points.filter(p => p.id !== painPoint.id)
          : [...(prev.organization.pain_points || []), painPoint]
      }
    }));
  }, []);

  const handleUseCaseToggle = useCallback((useCase: typeof useCaseLibrary[0]) => {
    setScopingData(prev => ({
      ...prev,
      last_modified: new Date().toISOString(),
      use_cases_requirements: {
        ...prev.use_cases_requirements,
        primary_use_cases: prev.use_cases_requirements.primary_use_cases?.some(uc => uc.id === useCase.id)
          ? prev.use_cases_requirements.primary_use_cases.filter(uc => uc.id !== useCase.id)
          : [...(prev.use_cases_requirements.primary_use_cases || []), useCase]
      }
    }));
  }, []);

  const generateAIRecommendations = useCallback(async () => {
    if (!scopingData.organization.name) return;

    try {
       const recommendations = await generateRecommendations(
        scopingData,
        useCaseLibrary,
        allVendorsFlat
      );

      if (recommendations) {
        setScopingData(prev => ({
          ...prev,
          last_modified: new Date().toISOString(),
          templates_ai: {
            ...prev.templates_ai,
            ai_recommendations: {
              summary: recommendations,
              generated_at: new Date().toISOString()
            }
          }
        }));

        toast({
          title: "AI Analysis Complete",
          description: "Personalized recommendations have been generated based on your requirements.",
        });
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to generate recommendations at this time.",
        variant: "destructive"
      });
    }
  }, [scopingData, generateRecommendations, toast]);

  const handleSuggestionApply = useCallback((suggestion: any) => {
    switch (suggestion.type) {
      case 'suggest_pain_point':
        setScopingData(prev => ({
          ...prev,
          organization: {
            ...prev.organization,
            pain_points: [...(prev.organization.pain_points || []), suggestion.data]
          }
        }));
        break;
      case 'suggest_use_case':
        setScopingData(prev => ({
          ...prev,
          use_cases_requirements: {
            ...prev.use_cases_requirements,
            primary_use_cases: [...(prev.use_cases_requirements.primary_use_cases || []), suggestion.data]
          }
        }));
        break;
    }
    
    toast({
      title: "Suggestion Applied",
      description: "The AI recommendation has been added to your scoping.",
    });
  }, [toast]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'organization':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Organization Profile</h3>
              <p className="text-muted-foreground">Tell us about your organization and current challenges</p>
            </div>

            <DecisionTreeEngine 
              scopingData={scopingData}
              onSuggestion={handleSuggestionApply}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  value={scopingData.session_name}
                  onChange={(e) => setScopingData(prev => ({ ...prev, session_name: e.target.value }))}
                  placeholder="e.g., Acme Corp NAC Assessment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={scopingData.organization.name}
                  onChange={(e) => handleInputChange('organization', 'name', e.target.value)}
                  placeholder="Your organization name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={scopingData.organization.industry}
                  onValueChange={(value) => handleInputChange('organization', 'industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-size">Organization Size</Label>
                <Select
                  value={scopingData.organization.size}
                  onValueChange={(value) => {
                    const sizeData = organizationSizes.find(s => s.value === value);
                    handleInputChange('organization', 'size', value);
                    handleInputChange('organization', 'total_users', sizeData?.users || 0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization size" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationSizes.map(size => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Current Pain Points & Challenges</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commonPainPoints.map(painPoint => (
                  <Card 
                    key={painPoint.id}
                    className={`cursor-pointer transition-all ${
                      scopingData.organization.pain_points?.some(p => p.id === painPoint.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePainPointToggle(painPoint)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{painPoint.title}</h4>
                          <p className="text-xs text-muted-foreground">{painPoint.description}</p>
                        </div>
                        {scopingData.organization.pain_points?.some(p => p.id === painPoint.id) && (
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'vendors':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Network className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Vendor Ecosystem</h3>
              <p className="text-muted-foreground">Select your current and planned vendor infrastructure</p>
            </div>

            <DecisionTreeEngine 
              scopingData={scopingData}
              onSuggestion={handleSuggestionApply}
            />

            <Tabs defaultValue="wired_wireless" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="wired_wireless">Network</TabsTrigger>
                <TabsTrigger value="security_solutions">Security</TabsTrigger>
                <TabsTrigger value="edr_solutions">EDR</TabsTrigger>
                <TabsTrigger value="identity">Identity</TabsTrigger>
              </TabsList>

              <TabsContent value="wired_wireless">
                <EnhancedVendorSelector
                  category="wired_wireless"
                  title="Network Infrastructure"
                  icon={<Router className="h-5 w-5" />}
                  vendors={vendorsWiredWireless}
                  selectedVendors={scopingData.vendor_ecosystem.wired_wireless}
                  onVendorChange={(vendors) => setScopingData(prev => ({
                    ...prev,
                    vendor_ecosystem: { ...prev.vendor_ecosystem, wired_wireless: vendors }
                  }))}
                />
              </TabsContent>

              <TabsContent value="security_solutions">
                <EnhancedVendorSelector
                  category="security_solutions"
                  title="Security Solutions"
                  icon={<Shield className="h-5 w-5" />}
                  vendors={vendorsSecuritySolutions}
                  selectedVendors={scopingData.vendor_ecosystem.security_solutions}
                  onVendorChange={(vendors) => setScopingData(prev => ({
                    ...prev,
                    vendor_ecosystem: { ...prev.vendor_ecosystem, security_solutions: vendors }
                  }))}
                />
              </TabsContent>

              <TabsContent value="edr_solutions">
                <EnhancedVendorSelector
                  category="edr_solutions"
                  title="EDR Solutions"
                  icon={<Eye className="h-5 w-5" />}
                  vendors={vendorsEdrSolutions}
                  selectedVendors={scopingData.vendor_ecosystem.edr_solutions}
                  onVendorChange={(vendors) => setScopingData(prev => ({
                    ...prev,
                    vendor_ecosystem: { ...prev.vendor_ecosystem, edr_solutions: vendors }
                  }))}
                />
              </TabsContent>

              <TabsContent value="identity" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <EnhancedVendorSelector
                      category="mfa_solutions"
                      title="MFA Solutions"
                      icon={<UserCheck className="h-5 w-5" />}
                      vendors={vendorsMfaSolutions}
                      selectedVendors={scopingData.vendor_ecosystem.mfa_solutions}
                      onVendorChange={(vendors) => setScopingData(prev => ({
                        ...prev,
                        vendor_ecosystem: { ...prev.vendor_ecosystem, mfa_solutions: vendors }
                      }))}
                    />
                  </div>

                  <div>
                    <EnhancedVendorSelector
                      category="sso_solutions"
                      title="SSO Solutions"
                      icon={<Key className="h-5 w-5" />}
                      vendors={vendorsSsoSolutions}
                      selectedVendors={scopingData.vendor_ecosystem.sso_solutions}
                      onVendorChange={(vendors) => setScopingData(prev => ({
                        ...prev,
                        vendor_ecosystem: { ...prev.vendor_ecosystem, sso_solutions: vendors }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'use_cases':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Use Cases & Requirements</h3>
              <p className="text-muted-foreground">Define your NAC objectives and success criteria</p>
            </div>

            <div className="space-y-4">
              <Label>Primary Use Cases</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {useCaseLibrary.map(useCase => {
                  const isSelected = scopingData.use_cases_requirements.primary_use_cases?.some(uc => uc.id === useCase.id);
                  return (
                    <Card
                      key={useCase.id}
                      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}
                      onClick={() => handleUseCaseToggle(useCase)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{useCase.name}</h4>
                            <Badge variant="outline" className="text-xs">{useCase.category}</Badge>
                          </div>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="success-criteria">Success Criteria & KPIs</Label>
              <Textarea
                id="success-criteria"
                placeholder="Describe how you'll measure the success of this NAC deployment..."
                value={scopingData.use_cases_requirements.success_criteria?.join('\n') || ''}
                onChange={(e) => handleInputChange('use_cases_requirements', 'success_criteria', e.target.value.split('\n').filter(Boolean))}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="custom-requirements">Additional Custom Requirements</Label>
              <Textarea
                id="custom-requirements"
                placeholder="Any specific requirements not covered above..."
                value={scopingData.use_cases_requirements.custom_requirements?.join('\n') || ''}
                onChange={(e) => handleInputChange('use_cases_requirements', 'custom_requirements', e.target.value.split('\n').filter(Boolean))}
                rows={3}
              />
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Integration & Compliance</h3>
              <p className="text-muted-foreground">Define integration points and compliance requirements</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">Required Integrations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Identity Providers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {vendorsIdentityProviders.map(provider => {
                        const isSelected = scopingData.integration_compliance.required_integrations?.includes(provider.name);
                        return (
                          <div
                            key={provider.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                            onClick={() => {
                              const currentIntegrations = scopingData.integration_compliance.required_integrations || [];
                              const newIntegrations = isSelected 
                                ? currentIntegrations.filter(i => i !== provider.name)
                                : [...currentIntegrations, provider.name];
                              handleInputChange('integration_compliance', 'required_integrations', newIntegrations);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{provider.name}</span>
                              {isSelected && <CheckCircle className="h-4 w-4" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{provider.category}</p>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        Cloud Platforms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {vendorsCloudPlatforms.map(platform => {
                        const isSelected = scopingData.integration_compliance.required_integrations?.includes(platform.name);
                        return (
                          <div
                            key={platform.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                            onClick={() => {
                              const currentIntegrations = scopingData.integration_compliance.required_integrations || [];
                              const newIntegrations = isSelected 
                                ? currentIntegrations.filter(i => i !== platform.name)
                                : [...currentIntegrations, platform.name];
                              handleInputChange('integration_compliance', 'required_integrations', newIntegrations);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{platform.name}</span>
                              {isSelected && <CheckCircle className="h-4 w-4" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{platform.category}</p>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Compliance Frameworks</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {complianceFrameworks.map(framework => {
                    const isSelected = scopingData.integration_compliance.compliance_frameworks?.includes(framework);
                    return (
                      <Card
                        key={framework}
                        className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}
                        onClick={() => {
                          const current = scopingData.integration_compliance.compliance_frameworks || [];
                          const updated = isSelected 
                            ? current.filter(f => f !== framework)
                            : [...current, framework];
                          handleInputChange('integration_compliance', 'compliance_frameworks', updated);
                        }}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="font-medium text-sm">{framework}</div>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-primary mx-auto mt-2" />
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">AI Analysis & Recommendations</h3>
              <p className="text-muted-foreground">Get personalized insights and template recommendations</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Generate AI Recommendations
                </CardTitle>
                <CardDescription>
                  Get personalized recommendations based on your requirements and vendor ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={generateAIRecommendations}
                  disabled={aiLoading || !scopingData.organization.name}
                  className="w-full"
                >
                  {aiLoading ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Requirements...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {scopingData.templates_ai.ai_recommendations?.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AI-Generated Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                      {scopingData.templates_ai.ai_recommendations.summary}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Scoping Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      {scopingData.organization.name} ({scopingData.organization.industry})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {scopingData.organization.total_users} users, {scopingData.network_infrastructure.site_count} sites
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Selected Use Cases</h4>
                    <div className="flex flex-wrap gap-1">
                      {scopingData.use_cases_requirements.primary_use_cases?.slice(0, 3).map(uc => (
                        <Badge key={uc.id} variant="secondary" className="text-xs">{uc.name}</Badge>
                      ))}
                      {(scopingData.use_cases_requirements.primary_use_cases?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(scopingData.use_cases_requirements.primary_use_cases?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Pain Points</h4>
                    <div className="flex flex-wrap gap-1">
                      {scopingData.organization.pain_points?.slice(0, 2).map(pp => (
                        <Badge key={pp.id} variant="outline" className="text-xs">{pp.title}</Badge>
                      ))}
                      {(scopingData.organization.pain_points?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(scopingData.organization.pain_points?.length || 0) - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Compliance</h4>
                    <div className="flex flex-wrap gap-1">
                      {scopingData.integration_compliance.compliance_frameworks?.slice(0, 3).map(cf => (
                        <Badge key={cf} variant="secondary" className="text-xs">{cf}</Badge>
                      ))}
                      {(scopingData.integration_compliance.compliance_frameworks?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(scopingData.integration_compliance.compliance_frameworks?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Step not implemented yet</div>;
    }
  };

  const saveSession = useCallback(() => {
    const sessionId = `scoping_${Date.now()}`;
    onSave(sessionId, scopingData);
  }, [scopingData, onSave]);

  const completeSession = useCallback(() => {
    if (!scopingData.organization.name) {
      toast({
        title: "Incomplete Information",
        description: "Please provide at least the organization name before completing.",
        variant: "destructive"
      });
      return;
    }

    const sessionId = `scoping_${Date.now()}`;
    onComplete(sessionId, scopingData);
  }, [scopingData, onComplete, toast]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced AI Scoping Wizard</h1>
          <p className="text-muted-foreground">Intelligent NAC deployment scoping with decision tree logic</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Flow Management */}
      <ScopingFlowManager
        currentStep={currentStep}
        scopingData={scopingData}
        onStepChange={setCurrentStep}
        onSave={saveSession}
        onComplete={completeSession}
        autoSave={true}
      />

      {/* Main Content */}
      <Card className="min-h-[600px]">
        <CardContent className="pt-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default UltimateAIScopingWizard;
