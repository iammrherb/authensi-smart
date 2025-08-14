import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Building2, MapPin, 
  Users, Shield, Network, Server, Plus, X, Upload, Download, Target
} from 'lucide-react';
import { useCreateSite } from '@/hooks/useSites';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';
import { useToast } from '@/hooks/use-toast';
import InfrastructureSelector, { InfrastructureSelection } from "@/components/resources/InfrastructureSelector";
import InlineSelectCreate from '@/components/common/InlineSelectCreate';
import { useScopingSessions } from '@/hooks/useScopingSessionsDb';
import type { CatalogItem } from '@/hooks/useCatalog';
import ReportExporter from '@/components/common/ReportExporter';
import ResourceLibraryIntegration from '@/components/resources/ResourceLibraryIntegration';
import { useUseCases, useSiteUseCases, useAddUseCaseToSite } from '@/hooks/useUseCases';
import { useRequirements, useSiteRequirements, useAddRequirementToSite } from '@/hooks/useRequirements';
import type { UseCase } from '@/hooks/useUseCases';
import type { Requirement } from '@/hooks/useRequirements';

interface EnhancedSiteFormData {
  // Basic Information
  site_name: string;
  site_code: string;
  description: string;
  site_type: string;
  
  // Location Details
  country: string;
  region: string;
  city: string;
  address: string;
  postal_code: string;
  timezone: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  
  // Contact Information
  site_manager: string;
  site_manager_email: string;
  site_manager_phone: string;
  technical_contact: string;
  technical_contact_email: string;
  emergency_contact: string;
  emergency_contact_phone: string;
  
  // Network & Infrastructure
  network_details: {
    total_users: number;
    device_count: number;
    network_segments: number;
    internet_bandwidth: string;
    internal_bandwidth: string;
    wireless_coverage: string;
    wired_ports: number;
  };
  
  // Device Inventory
  device_inventory: {
    corporate_laptops: number;
    desktop_workstations: number;
    mobile_devices: number;
    tablets: number;
    iot_devices: number;
    printers_mfps: number;
    security_cameras: number;
    voip_phones: number;
    servers: number;
    network_equipment: number;
    custom_devices: Array<{name: string; count: number; category: string;}>;
  };
  
  // Security & Access
  security_requirements: {
    security_level: string;
    guest_access: boolean;
    byod_policy: boolean;
    compliance_frameworks: string[];
    existing_security_tools: string[];
    physical_security: string[];
  };
  
  // Deployment Configuration
  deployment_config: {
    deployment_priority: string;
    deployment_phase: number;
    go_live_date?: Date;
    maintenance_window: string;
    rollback_plan: boolean;
    testing_requirements: string[];
    success_criteria: string[];
  };
  
  // Integration Requirements
  integrations: {
    active_directory: boolean;
    dhcp_integration: boolean;
    dns_integration: boolean;
    siem_integration: boolean;
    monitoring_tools: string[];
    ticketing_system: string;
    backup_systems: string[];
  };
  
  // Business Details
  business_details: {
    business_hours: string;
    peak_usage_times: string;
    seasonal_variations: boolean;
    business_critical_apps: string[];
    downtime_tolerance: string;
    change_management_process: string;
  };
}

interface EnhancedSiteCreationWizardProps {
  projectId?: string;
  onComplete?: (siteId: string) => void;
  onCancel?: () => void;
}

const EnhancedSiteCreationWizard: React.FC<EnhancedSiteCreationWizardProps> = ({ 
  projectId, 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnhancedSiteFormData>({
    site_name: '',
    site_code: '',
    description: '',
    site_type: '',
    country: '',
    region: '',
    city: '',
    address: '',
    postal_code: '',
    timezone: 'UTC',
    coordinates: {},
    site_manager: '',
    site_manager_email: '',
    site_manager_phone: '',
    technical_contact: '',
    technical_contact_email: '',
    emergency_contact: '',
    emergency_contact_phone: '',
    network_details: {
      total_users: 50,
      device_count: 100,
      network_segments: 1,
      internet_bandwidth: '100 Mbps',
      internal_bandwidth: '1 Gbps',
      wireless_coverage: '100%',
      wired_ports: 48
    },
    device_inventory: {
      corporate_laptops: 0,
      desktop_workstations: 0,
      mobile_devices: 0,
      tablets: 0,
      iot_devices: 0,
      printers_mfps: 0,
      security_cameras: 0,
      voip_phones: 0,
      servers: 0,
      network_equipment: 0,
      custom_devices: []
    },
    security_requirements: {
      security_level: 'standard',
      guest_access: false,
      byod_policy: false,
      compliance_frameworks: [],
      existing_security_tools: [],
      physical_security: []
    },
    deployment_config: {
      deployment_priority: 'medium',
      deployment_phase: 1,
      maintenance_window: 'Weekend',
      rollback_plan: true,
      testing_requirements: [],
      success_criteria: []
    },
    integrations: {
      active_directory: true,
      dhcp_integration: true,
      dns_integration: true,
      siem_integration: false,
      monitoring_tools: [],
      ticketing_system: '',
      backup_systems: []
    },
    business_details: {
      business_hours: '9 AM - 5 PM',
      peak_usage_times: '9 AM - 11 AM, 1 PM - 3 PM',
      seasonal_variations: false,
      business_critical_apps: [],
      downtime_tolerance: 'Low',
      change_management_process: 'Standard'
    }
  });
  
  const [infrastructure, setInfrastructure] = useState<InfrastructureSelection>({
    nac_vendors: [],
    network: { wired_vendors: [], wired_models: {}, wireless_vendors: [], wireless_models: {} },
    security: { firewalls: [], vpn: [], idp_sso: [], edr: [], siem: [] },
    device_inventory: []
  });

  // Unified catalog selections
  const [selectedNetworkVendors, setSelectedNetworkVendors] = useState<CatalogItem[]>([]);
  const [selectedSiemVendors, setSelectedSiemVendors] = useState<CatalogItem[]>([]);
  const [selectedMdmVendors, setSelectedMdmVendors] = useState<CatalogItem[]>([]);
  const [selectedFirewallVendors, setSelectedFirewallVendors] = useState<CatalogItem[]>([]);
  const [selectedVpnVendors, setSelectedVpnVendors] = useState<CatalogItem[]>([]);
  const [selectedEdrVendors, setSelectedEdrVendors] = useState<CatalogItem[]>([]);
  const [selectedIdpVendors, setSelectedIdpVendors] = useState<CatalogItem[]>([]);
  const [selectedSiteUseCases, setSelectedSiteUseCases] = useState<UseCase[]>([]);
  const [selectedSiteRequirements, setSelectedSiteRequirements] = useState<Requirement[]>([]);
  
  const { data: countries = [] } = useCountries();
  const { data: regions = [] } = useRegionsByCountry(formData.country);
  const { data: scopingSessions = [] } = useScopingSessions();
  const { mutate: createSite, isPending } = useCreateSite();
  const addUseCaseToSite = useAddUseCaseToSite();
  const addRequirementToSite = useAddRequirementToSite();
  const { toast } = useToast();

  const importFromScoping = (sessionId: string) => {
    const session = scopingSessions.find(s => s.id === sessionId);
    if (!session) return;
    const data = session.data;
    setFormData(prev => ({
      ...prev,
      site_name: `${data.organization?.name || ''} Site`,
      description: `Site for ${data.organization?.name || 'organization'} NAC deployment`,
      network_details: {
        ...prev.network_details,
        total_users: data.organization?.total_users || 50,
      },
      security_requirements: {
        ...prev.security_requirements,
        compliance_frameworks: data.integration_compliance?.compliance_frameworks || [],
      }
    }));
    toast({ title: "Imported from scoping", description: "Site data populated from scoping session" });
  };

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Site details, location, and identification",
      icon: Building2
    },
    {
      id: 2,
      title: "Location & Contacts",
      description: "Geographic details and contact information",
      icon: MapPin
    },
    {
      id: 3,
      title: "Network & Infrastructure", 
      description: "Network configuration and infrastructure details",
      icon: Network
    },
    {
      id: 4,
      title: "Device Inventory",
      description: "Device counts and asset inventory",
      icon: Server
    },
    {
      id: 5,
      title: "Security Requirements",
      description: "Security policies and compliance needs",
      icon: Shield
    },
    {
      id: 6,
      title: "Use Cases & Requirements",
      description: "Select relevant use cases and requirements from library",
      icon: Target
    },
    {
      id: 7,
      title: "Deployment & Integration",
      description: "Deployment planning and system integrations",
      icon: Users
    }
  ];

  const siteTypes = [
    'Headquarters', 'Regional Office', 'Branch Office', 'Remote Office',
    'Data Center', 'Manufacturing Plant', 'Warehouse', 'Retail Store',
    'Hospital', 'Clinic', 'School', 'University', 'Government Facility',
    'Laboratory', 'R&D Center', 'Call Center', 'Training Center', 'Other'
  ];

  const timezones = [
    'UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'IST'
  ];

  const complianceFrameworks = [
    'SOX', 'HIPAA', 'PCI-DSS', 'ISO 27001', 'NIST', 'GDPR', 'SOC 2', 'FedRAMP'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUseCaseSelect = (useCase: UseCase) => {
    setSelectedSiteUseCases(prev => {
      const exists = prev.find(uc => uc.id === useCase.id);
      if (exists) {
        return prev.filter(uc => uc.id !== useCase.id);
      }
      return [...prev, useCase];
    });
  };

  const handleRequirementSelect = (requirement: Requirement) => {
    setSelectedSiteRequirements(prev => {
      const exists = prev.find(req => req.id === requirement.id);
      if (exists) {
        return prev.filter(req => req.id !== requirement.id);
      }
      return [...prev, requirement];
    });
  };

  const handleCreateSite = async () => {
    const siteData = {
      name: formData.site_name,
      project_id: projectId,
      status: 'planning' as const,
      deployment_status: 'planned' as const,
      priority: (formData.deployment_config.deployment_priority || 'medium') as 'low' | 'medium' | 'high' | 'critical',
      device_count: formData.network_details.device_count,
      network_segments: formData.network_details.network_segments,
      site_code: formData.site_code,
      description: formData.description,
      site_type: formData.site_type,
      country: formData.country,
      region: formData.region,
      city: formData.city,
      address: formData.address,
      postal_code: formData.postal_code,
      timezone: formData.timezone,
      site_manager: formData.site_manager,
      site_manager_email: formData.site_manager_email,
      technical_contact: formData.technical_contact,
      security_level: formData.security_requirements.security_level,
      deployment_config: {
        network: {
          wired_vendors: infrastructure.network.wired_vendors,
          wireless_vendors: infrastructure.network.wireless_vendors,
          switch_vendors: infrastructure.network.wired_vendors,
          firewall_vendors: infrastructure.security.firewalls
        },
        security_stack: {
          vpn: infrastructure.security.vpn,
          idp_sso: infrastructure.security.idp_sso,
          edr: infrastructure.security.edr,
          siem: infrastructure.security.siem,
          nac_vendors: infrastructure.nac_vendors
        },
        device_types: Object.fromEntries(infrastructure.device_inventory.map(d => [d.name, d.count]))
      }
    };

    createSite(siteData, {
      onSuccess: async (site) => {
        // Add selected use cases to site
        for (const useCase of selectedSiteUseCases) {
          try {
            await addUseCaseToSite.mutateAsync({
              siteId: site.id,
              useCaseId: useCase.id,
              priority: 'medium',
              implementationNotes: 'Added during site creation'
            });
          } catch (error) {
            console.error('Failed to add use case to site:', error);
          }
        }

        // Add selected requirements to site
        for (const requirement of selectedSiteRequirements) {
          try {
            await addRequirementToSite.mutateAsync({
              siteId: site.id,
              requirementId: requirement.id,
              implementationApproach: 'Standard implementation',
              targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
          } catch (error) {
            console.error('Failed to add requirement to site:', error);
          }
        }

        toast({
          title: "Site Created Successfully",
          description: `${formData.site_name} has been created and configured with ${selectedSiteUseCases.length} use cases and ${selectedSiteRequirements.length} requirements.`,
        });
        onComplete?.(site.id);
      },
      onError: (error) => {
        toast({
          title: "Failed to Create Site",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const addCustomDevice = () => {
    setFormData(prev => ({
      ...prev,
      device_inventory: {
        ...prev.device_inventory,
        custom_devices: [
          ...prev.device_inventory.custom_devices,
          { name: '', count: 0, category: '' }
        ]
      }
    }));
  };

  const removeCustomDevice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      device_inventory: {
        ...prev.device_inventory,
        custom_devices: prev.device_inventory.custom_devices.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCustomDevice = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      device_inventory: {
        ...prev.device_inventory,
        custom_devices: prev.device_inventory.custom_devices.map((device, i) => 
          i === index ? { ...device, [field]: value } : device
        )
      }
    }));
  };

  const toggleCompliance = (framework: string) => {
    setFormData(prev => ({
      ...prev,
      security_requirements: {
        ...prev.security_requirements,
        compliance_frameworks: prev.security_requirements.compliance_frameworks.includes(framework)
          ? prev.security_requirements.compliance_frameworks.filter(f => f !== framework)
          : [...prev.security_requirements.compliance_frameworks, framework]
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name">Site Name *</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="e.g., New York Headquarters"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="site_code">Site Code</Label>
                <Input
                  id="site_code"
                  value={formData.site_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_code: e.target.value }))}
                  placeholder="e.g., NYC-HQ-001"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="site_type">Site Type *</Label>
              <Select value={formData.site_type} onValueChange={(value) => setFormData(prev => ({ ...prev, site_type: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  {siteTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Site Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the site purpose, function, and key characteristics..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value, region: '' }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.country_code} value={country.country_code}>
                        {country.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">Region/State</Label>
                <Select 
                  value={formData.region} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.region_name} value={region.region_name}>
                        {region.region_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., New York"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, building details"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="e.g., 10001"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="site_manager">Site Manager</Label>
                  <Input
                    id="site_manager"
                    value={formData.site_manager}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_manager: e.target.value }))}
                    placeholder="Full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="site_manager_email">Manager Email</Label>
                  <Input
                    id="site_manager_email"
                    type="email"
                    value={formData.site_manager_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_manager_email: e.target.value }))}
                    placeholder="manager@company.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="site_manager_phone">Manager Phone</Label>
                  <Input
                    id="site_manager_phone"
                    value={formData.site_manager_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_manager_phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technical_contact">Technical Contact</Label>
                  <Input
                    id="technical_contact"
                    value={formData.technical_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, technical_contact: e.target.value }))}
                    placeholder="IT manager/engineer name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="technical_contact_email">Technical Email</Label>
                  <Input
                    id="technical_contact_email"
                    type="email"
                    value={formData.technical_contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, technical_contact_email: e.target.value }))}
                    placeholder="it@company.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="total_users">Total Users</Label>
                <Input
                  id="total_users"
                  type="number"
                  value={formData.network_details.total_users}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, total_users: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="device_count">Device Count</Label>
                <Input
                  id="device_count"
                  type="number"
                  value={formData.network_details.device_count}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, device_count: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="network_segments">Network Segments</Label>
                <Input
                  id="network_segments"
                  type="number"
                  value={formData.network_details.network_segments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, network_segments: parseInt(e.target.value) || 1 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="wired_ports">Wired Ports</Label>
                <Input
                  id="wired_ports"
                  type="number"
                  value={formData.network_details.wired_ports}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, wired_ports: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="internet_bandwidth">Internet Bandwidth</Label>
                <Select 
                  value={formData.network_details.internet_bandwidth} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, internet_bandwidth: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select bandwidth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                    <SelectItem value="50 Mbps">50 Mbps</SelectItem>
                    <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                    <SelectItem value="500 Mbps">500 Mbps</SelectItem>
                    <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                    <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="internal_bandwidth">Internal Bandwidth</Label>
                <Select 
                  value={formData.network_details.internal_bandwidth} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, internal_bandwidth: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select bandwidth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                    <SelectItem value="1 Gbps">1 Gbps</SelectItem>
                    <SelectItem value="10 Gbps">10 Gbps</SelectItem>
                    <SelectItem value="40 Gbps">40 Gbps</SelectItem>
                    <SelectItem value="100 Gbps">100 Gbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wireless_coverage">Wireless Coverage</Label>
                <Select 
                  value={formData.network_details.wireless_coverage} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    network_details: { ...prev.network_details, wireless_coverage: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Coverage percentage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25%">25%</SelectItem>
                    <SelectItem value="50%">50%</SelectItem>
                    <SelectItem value="75%">75%</SelectItem>
                    <SelectItem value="100%">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Infrastructure Selection */}
            <div className="pt-4">
              <Separator className="my-6" />
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-medium">Infrastructure & Inventory</Label>
                <Badge variant="outline">Multi-select</Badge>
              </div>
              <InfrastructureSelector value={infrastructure} onChange={setInfrastructure} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="corporate_laptops">Laptops</Label>
                <Input
                  id="corporate_laptops"
                  type="number"
                  value={formData.device_inventory.corporate_laptops}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, corporate_laptops: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="desktop_workstations">Desktops</Label>
                <Input
                  id="desktop_workstations"
                  type="number"
                  value={formData.device_inventory.desktop_workstations}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, desktop_workstations: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="mobile_devices">Mobile Devices</Label>
                <Input
                  id="mobile_devices"
                  type="number"
                  value={formData.device_inventory.mobile_devices}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, mobile_devices: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="tablets">Tablets</Label>
                <Input
                  id="tablets"
                  type="number"
                  value={formData.device_inventory.tablets}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, tablets: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="iot_devices">IoT Devices</Label>
                <Input
                  id="iot_devices"
                  type="number"
                  value={formData.device_inventory.iot_devices}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, iot_devices: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="printers_mfps">Printers</Label>
                <Input
                  id="printers_mfps"
                  type="number"
                  value={formData.device_inventory.printers_mfps}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, printers_mfps: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="security_cameras">Cameras</Label>
                <Input
                  id="security_cameras"
                  type="number"
                  value={formData.device_inventory.security_cameras}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, security_cameras: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="voip_phones">VoIP Phones</Label>
                <Input
                  id="voip_phones"
                  type="number"
                  value={formData.device_inventory.voip_phones}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, voip_phones: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="servers">Servers</Label>
                <Input
                  id="servers"
                  type="number"
                  value={formData.device_inventory.servers}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, servers: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="network_equipment">Network Equipment</Label>
                <Input
                  id="network_equipment"
                  type="number"
                  value={formData.device_inventory.network_equipment}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    device_inventory: { ...prev.device_inventory, network_equipment: parseInt(e.target.value) || 0 }
                  }))}
                  className="mt-1"
                  min="0"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Custom Devices</h4>
                <Button type="button" variant="outline" size="sm" onClick={addCustomDevice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Device
                </Button>
              </div>

              {formData.device_inventory.custom_devices.map((device, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Device Name</Label>
                    <Input
                      value={device.name}
                      onChange={(e) => updateCustomDevice(index, 'name', e.target.value)}
                      placeholder="e.g., Smart Meters"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={device.category}
                      onChange={(e) => updateCustomDevice(index, 'category', e.target.value)}
                      placeholder="e.g., Industrial"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Count</Label>
                    <Input
                      type="number"
                      value={device.count}
                      onChange={(e) => updateCustomDevice(index, 'count', parseInt(e.target.value) || 0)}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomDevice(index)}
                      className="w-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="security_level">Security Level</Label>
                <Select 
                  value={formData.security_requirements.security_level} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    security_requirements: { ...prev.security_requirements, security_level: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Enhanced</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guest_access"
                    checked={formData.security_requirements.guest_access}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      security_requirements: { ...prev.security_requirements, guest_access: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="guest_access">Guest Access Required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="byod_policy"
                    checked={formData.security_requirements.byod_policy}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      security_requirements: { ...prev.security_requirements, byod_policy: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="byod_policy">BYOD Policy</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Compliance Frameworks</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {complianceFrameworks.map((framework) => (
                  <div key={framework} className="flex items-center space-x-2">
                    <Checkbox
                      id={framework}
                      checked={formData.security_requirements.compliance_frameworks.includes(framework)}
                      onCheckedChange={() => toggleCompliance(framework)}
                    />
                    <Label htmlFor={framework} className="text-sm">{framework}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Use Cases & Requirements</h3>
              <p className="text-muted-foreground">
                Select relevant use cases and requirements for this site from the resource library
              </p>
            </div>

            <ResourceLibraryIntegration
              onUseCaseSelect={handleUseCaseSelect}
              onRequirementSelect={handleRequirementSelect}
              selectedItems={{
                useCases: selectedSiteUseCases.map(uc => uc.id),
                requirements: selectedSiteRequirements.map(req => req.id)
              }}
              mode="select"
              allowCreate={false}
              allowEdit={false}
            />

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Use Cases ({selectedSiteUseCases.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSiteUseCases.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSiteUseCases.map(uc => (
                        <Badge key={uc.id} variant="outline" className="mr-2">
                          {uc.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No use cases selected</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selected Requirements ({selectedSiteRequirements.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSiteRequirements.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSiteRequirements.map(req => (
                        <Badge key={req.id} variant="outline" className="mr-2">
                          {req.title}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No requirements selected</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deployment_priority">Deployment Priority</Label>
                <Select 
                  value={formData.deployment_config.deployment_priority} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    deployment_config: { ...prev.deployment_config, deployment_priority: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deployment_phase">Deployment Phase</Label>
                <Input
                  id="deployment_phase"
                  type="number"
                  value={formData.deployment_config.deployment_phase}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    deployment_config: { ...prev.deployment_config, deployment_phase: parseInt(e.target.value) || 1 }
                  }))}
                  className="mt-1"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maintenance_window">Maintenance Window</Label>
                <Select 
                  value={formData.deployment_config.maintenance_window} 
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    deployment_config: { ...prev.deployment_config, maintenance_window: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekend">Weekend</SelectItem>
                    <SelectItem value="After Hours">After Hours</SelectItem>
                    <SelectItem value="Business Hours">Business Hours</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="rollback_plan"
                  checked={formData.deployment_config.rollback_plan}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    deployment_config: { ...prev.deployment_config, rollback_plan: checked as boolean }
                  }))}
                />
                <Label htmlFor="rollback_plan">Rollback Plan Required</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">System Integrations</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active_directory"
                    checked={formData.integrations.active_directory}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, active_directory: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="active_directory">Active Directory</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dhcp_integration"
                    checked={formData.integrations.dhcp_integration}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, dhcp_integration: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="dhcp_integration">DHCP Integration</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dns_integration"
                    checked={formData.integrations.dns_integration}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, dns_integration: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="dns_integration">DNS Integration</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="siem_integration"
                    checked={formData.integrations.siem_integration}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, siem_integration: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="siem_integration">SIEM Integration</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full">
      <Card className="w-full max-w-none md:w-[90vw] lg:w-[1100px] h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Enhanced Site Creation Wizard</CardTitle>
              <CardDescription>
                {steps[currentStep - 1]?.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md whitespace-nowrap ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-background text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{step.title}</span>
                  {currentStep > step.id && <CheckCircle className="h-4 w-4" />}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pr-4">
              {renderStepContent()}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="flex-shrink-0 flex justify-between items-center p-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreateSite} disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Site'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedSiteCreationWizard;