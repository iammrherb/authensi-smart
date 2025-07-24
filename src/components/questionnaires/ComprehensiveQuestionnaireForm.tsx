import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCreateQuestionnaire, useUpdateQuestionnaire, type QuestionnaireData } from '@/hooks/useQuestionnaires';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar, Clock, CheckCircle, Plus, Trash2, Edit, Network, Shield, Smartphone, 
  Printer, Server, Wifi, Router, Database, Users, FileText, Target, TestTube, 
  CheckSquare, MapPin, AlertTriangle, Info, Settings, Globe, 
  Monitor, Tablet, HardDrive, Usb, Camera, Headphones, Building, CloudIcon,
  Lock, Key, Eye, Activity, BarChart3, FileCheck, ClipboardList,
  Zap, RefreshCw, AlertCircle, TrendingUp, BookOpen, UserCheck, 
  Layers, GitBranch, Archive, Download, Upload, Share2, Search,
  Bell, Mail, Phone, MessageSquare, Calendar as CalendarIcon,
  Star, Flag, Bookmark, Tag, Filter, SortAsc, Save, ArrowLeft, Clock3
} from 'lucide-react';

interface ComprehensiveQuestionnaireFormProps {
  questionnaire?: any;
  sites: any[];
  projects: any[];
  mode: 'create' | 'view' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  requirementIds: string[];
  pocScope: string;
  testCaseIds: string[];
  comments: string;
  portnoxChecklist: boolean;
  portnoxPocNotes: string;
  priority: 'mandatory' | 'optional' | 'nice-to-have';
  category: string;
}

interface TestCase {
  id: string;
  useCaseNumbers: string[];
  title: string;
  description: string;
  expectedOutcome: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'passed' | 'failed';
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
}

interface Requirement {
  id: string;
  description: string;
  justification: string;
  metNotMet: 'met' | 'not-met' | 'partial' | 'tbd';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  portnoxCapability?: string;
}

interface TechnicalCategory {
  name: string;
  icon: React.ReactNode;
  subcategories: {
    name: string;
    options: string[];
  }[];
}

const ComprehensiveQuestionnaireForm = ({ questionnaire, sites, projects, mode, onSuccess, onCancel }: ComprehensiveQuestionnaireFormProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [formData, setFormData] = useState({
    // Required for existing QuestionnaireData interface
    deploymentType: '',
    useCases: [] as string[],
    requirements: {
      endpoints: 0,
      sites: 0,
      networkInfrastructure: '',
      authenticationMethod: '',
      compliance: '',
      timeline: ''
    },
    discoveryAnswers: {
      infrastructure: {},
      security: {},
      business: {}
    },
    testCases: [] as any[],
    sizing: {
      estimatedEndpoints: 0,
      requiredAppliances: 0,
      estimatedTimeline: '',
      budget: 0
    }
  });

  // Extended fields for comprehensive questionnaire  
  const [extendedData, setExtendedData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedDuration: '',
    targetGoLiveDate: '',
    customUseCases: [] as UseCase[],
    customRequirements: [] as Requirement[],
    wiredWireless: {
      wiredInfrastructure: [] as string[],
      wirelessInfrastructure: [] as string[]
    },
    implementationPlan: {
      phases: [] as any[],
      milestones: [] as any[]
    },
    pocDetails: {
      scope: '',
      objectives: [] as string[],
      duration: '',
      environment: ''
    },
    handoffDetails: {
      preSalesTeam: [] as any[],
      postSalesTeam: [] as any[]
    }
  });

  const isViewMode = mode === 'view';
  const createQuestionnaire = useCreateQuestionnaire();
  const updateQuestionnaire = useUpdateQuestionnaire();

  // Define comprehensive technical categories with Portnox focus
  const technicalCategories: TechnicalCategory[] = [
    {
      name: "Wired & Wireless Infrastructure",
      icon: <Network className="h-5 w-5" />,
      subcategories: [
        {
          name: "Wired Infrastructure",
          options: [
            "Cisco Catalyst Switches", "Aruba/HPE ProCurve", "Juniper EX Series", "Extreme Networks",
            "Dell PowerSwitch", "Netgear ProSafe", "D-Link Enterprise", "TP-Link Omada",
            "802.1X Port-based Authentication", "MAB (MAC Authentication Bypass)", "Dynamic VLAN Assignment",
            "Port Security", "DHCP Snooping", "ARP Inspection", "Storm Control"
          ]
        },
        {
          name: "Wireless Infrastructure", 
          options: [
            "Cisco Meraki", "Cisco Catalyst 9800 WLC", "Aruba Instant On", "Aruba Central",
            "Juniper Mist", "Extreme Wing", "Ruckus Unleashed", "Ubiquiti UniFi",
            "802.11ax (Wi-Fi 6)", "802.11ac (Wi-Fi 5)", "WPA3 Enterprise", "WPA2 Enterprise",
            "RADIUS Authentication", "Certificate-based Auth", "Captive Portal", "Guest Access"
          ]
        }
      ]
    },
    {
      name: "VPN & Remote Access",
      icon: <Shield className="h-5 w-5" />,
      subcategories: [
        {
          name: "VPN Solutions",
          options: [
            "Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "SonicWall NetExtender",
            "Pulse Secure", "Check Point Mobile", "OpenVPN", "WireGuard",
            "SSL VPN", "IPSec VPN", "Always-On VPN", "Per-App VPN"
          ]
        },
        {
          name: "Remote Access Security",
          options: [
            "Zero Trust Network Access (ZTNA)", "Software-Defined Perimeter (SDP)", 
            "Conditional Access Policies", "Device Compliance Checks", "Multi-Factor Authentication",
            "Certificate-based Authentication", "Risk-based Authentication", "Geo-location Controls"
          ]
        }
      ]
    },
    {
      name: "Firewall & Security",
      icon: <Lock className="h-5 w-5" />,
      subcategories: [
        {
          name: "Firewall Vendors",
          options: [
            "Palo Alto Networks", "Fortinet FortiGate", "Cisco ASA/FTD", "SonicWall",
            "Check Point", "Barracuda", "WatchGuard", "pfSense", "Sophos XG",
            "Next-Gen Firewall (NGFW)", "Web Application Firewall (WAF)", "Unified Threat Management (UTM)"
          ]
        },
        {
          name: "EDR/XDR Solutions",
          options: [
            "CrowdStrike Falcon", "Microsoft Defender for Endpoint", "SentinelOne", "Carbon Black",
            "Symantec Endpoint Protection", "Trend Micro", "Kaspersky", "McAfee MVISION",
            "Cortex XDR", "FireEye Endpoint Security", "Cylance", "Malwarebytes"
          ]
        },
        {
          name: "SIEM/SOAR Platforms",
          options: [
            "Splunk Enterprise Security", "IBM QRadar", "ArcSight", "LogRhythm",
            "Microsoft Sentinel", "Sumo Logic", "Rapid7 InsightIDR", "Elastic Security",
            "Chronicle Security", "Securonix", "Exabeam", "Phantom SOAR"
          ]
        }
      ]
    },
    {
      name: "Device Types & Operating Systems",
      icon: <Monitor className="h-5 w-5" />,
      subcategories: [
        {
          name: "Operating Systems",
          options: [
            "Windows 11", "Windows 10", "Windows Server 2019/2022", "macOS Monterey/Ventura",
            "Ubuntu Linux", "Red Hat Enterprise Linux", "CentOS", "SUSE Linux",
            "iOS 15+", "iPadOS", "Android 11+", "Chrome OS"
          ]
        },
        {
          name: "Device Categories",
          options: [
            "Corporate Laptops", "Desktop Workstations", "Tablets", "Smartphones",
            "Thin Clients", "Digital Signage", "Kiosks", "Point of Sale (PoS)",
            "Industrial PCs", "Ruggedized Devices", "Medical Devices", "Laboratory Equipment"
          ]
        },
        {
          name: "IoT & Specialized Devices",
          options: [
            "Network Printers", "MFP (Multi-Function Printers)", "Security Cameras", "Door Controllers",
            "Badge Readers", "Environmental Sensors", "Smart TVs", "Conference Room Systems",
            "VoIP Phones", "Facility Management Systems", "Building Automation", "HVAC Controllers",
            "Industrial IoT Sensors", "Asset Tracking Devices", "Digital Assistants", "Smart Displays"
          ]
        }
      ]
    },
    {
      name: "MDM/UEM Solutions",
      icon: <Smartphone className="h-5 w-5" />,
      subcategories: [
        {
          name: "MDM Platforms",
          options: [
            "Microsoft Intune", "VMware Workspace ONE", "Jamf Pro", "Google Workspace",
            "IBM MaaS360", "Citrix Endpoint Management", "SOTI MobiControl", "ManageEngine Mobile Device Manager Plus",
            "Hexnode UEM", "42Gears SureMDM", "Sophos Mobile", "BlackBerry UEM"
          ]
        },
        {
          name: "UEM Features",
          options: [
            "Device Enrollment", "App Management", "Policy Enforcement", "Compliance Monitoring",
            "Remote Wipe", "Containerization", "VPN Configuration", "Certificate Management",
            "Conditional Access", "Zero-Touch Provisioning", "Kiosk Mode", "Lost Mode"
          ]
        }
      ]
    },
    {
      name: "Identity & Access Management",
      icon: <Users className="h-5 w-5" />,
      subcategories: [
        {
          name: "Identity Providers",
          options: [
            "Microsoft Entra ID (Azure AD)", "Active Directory", "Okta", "Ping Identity",
            "Auth0", "OneLogin", "LDAP", "Google Workspace", "AWS IAM", "Oracle Identity Cloud"
          ]
        },
        {
          name: "Authentication Methods",
          options: [
            "Certificate-based Authentication", "SAML SSO", "OAuth 2.0", "Multi-Factor Authentication",
            "Biometric Authentication", "Smart Cards", "Hardware Tokens", "Mobile Push Notifications",
            "SMS/Voice OTP", "FIDO2/WebAuthn", "Risk-based Authentication"
          ]
        }
      ]
    }
  ];

  // Comprehensive Portnox Use Cases based on provided data
  const portnoxUseCases: UseCase[] = [
    {
      id: "UC1",
      title: "CA-MDM-SOE",
      description: "Certificate deployment and lifecycle management.",
      requirementIds: ["FR-03", "NFR-06"],
      pocScope: "Mandatory",
      testCaseIds: [],
      comments: "",
      portnoxChecklist: false,
      portnoxPocNotes: "Demonstrate Portnox NAC's built-in certificate authority (CA) to issue, manage, and revoke certificates for Entra ID users and Intune managed endpoints (Win 11)",
      priority: "mandatory",
      category: "Certificate Management"
    },
    {
      id: "UC2.1",
      title: "Corp Wifi Auth user certs",
      description: "Managed Endpoints and Entra ID users Securely access Corporate SSID Access (Wi-Fi)",
      requirementIds: ["FR-01", "FR-02", "FR-03", "NFR-08"],
      pocScope: "Mandatory",
      testCaseIds: [],
      comments: "need to test machine cert\nneed to test user cert",
      portnoxChecklist: true,
      portnoxPocNotes: "Demonstrate Portnox NAC's with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued user certificates can connect to the corporate SSID.",
      priority: "mandatory",
      category: "Wireless Authentication"
    },
    {
      id: "UC2.2",
      title: "Corp Wifi Auth machine certs",
      description: "Managed Endpoints and Entra ID users Securely access Corporate SSID Access (Wi-Fi)",
      requirementIds: ["FR-01", "FR-02", "FR-03", "NFR-08"],
      pocScope: "Mandatory",
      testCaseIds: [],
      comments: "need to test machine cert\nneed to test user cert",
      portnoxChecklist: true,
      portnoxPocNotes: "Demonstrate Portnox NAC's with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued machine certificates can connect to the corporate SSID.",
      priority: "mandatory",
      category: "Wireless Authentication"
    },
    // ... Additional use cases following the same pattern
  ];

  // Comprehensive Test Cases
  const portnoxTestCases: TestCase[] = [
    {
      id: "TC01",
      useCaseNumbers: ["UC1"],
      title: "Deploy machine certificate to managed endpoint",
      description: "Part of End User Compute (EUC) end point enrolment process when onboarding a new device with machine certificate",
      expectedOutcome: "Endpoint enrolment connecting to guest/default network",
      priority: "high",
      status: "pending"
    },
    {
      id: "TC02",
      useCaseNumbers: ["UC2.1", "UC2.2"],
      title: "Deploy user certificate to managed endpoint",
      description: "Initial connection is to guest/default network to allow user logon to obtain a valid user certificate, once successfully logoned and received a valid user certificate.",
      expectedOutcome: "Endpoint connect to correct network based on user profile. OCSP not CRL",
      priority: "high",
      status: "pending"
    }
    // ... Additional test cases
  ];

  // Comprehensive Requirements
  const portnoxRequirements: Requirement[] = [
    {
      id: "FR-01",
      description: "Support 802.1X authentication for wired and wireless access",
      justification: "Ensures authenticated network access for corporate-managed devices",
      metNotMet: "met",
      priority: "critical",
      category: "Authentication",
      portnoxCapability: "Native 802.1X support with RADIUS"
    },
    {
      id: "FR-02",
      description: "Provide RADIUS server functionality with RADSec support",
      justification: "Enables secure, cloud-based authentication and integration with Meraki",
      metNotMet: "met",
      priority: "critical",
      category: "Infrastructure",
      portnoxCapability: "Cloud RADIUS with RADSec encryption"
    }
    // ... Additional requirements
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
    { id: "technical", label: "Technical Infrastructure", icon: <Server className="h-4 w-4" /> },
    { id: "use-cases", label: "Use Cases", icon: <Target className="h-4 w-4" /> },
    { id: "test-cases", label: "Test Cases", icon: <TestTube className="h-4 w-4" /> },
    { id: "requirements", label: "Requirements", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "implementation", label: "Implementation", icon: <Clock3 className="h-4 w-4" /> },
    { id: "poc", label: "POC Planning", icon: <Activity className="h-4 w-4" /> },
    { id: "handoff", label: "Team Handoff", icon: <Users className="h-4 w-4" /> }
  ];

  useEffect(() => {
    if (questionnaire) {
      // Load existing questionnaire data
      const data = questionnaire.questionnaire_data || {};
      setFormData(prev => ({ ...prev, ...data }));
      setSelectedSite(questionnaire.site_id);
      setSelectedProject(questionnaire.project_id || '');
    }
  }, [questionnaire]);

  const calculateProgress = () => {
    let completed = 0;
    let total = 8;

    if (formData.title) completed++;
    if (Object.values(formData.wiredWireless).some(arr => arr.length > 0)) completed++;
    if (formData.useCases.length > 0) completed++;
    if (formData.testCases.length > 0) completed++;
    if (formData.requirements.length > 0) completed++;
    if (formData.implementationPlan.phases.length > 0) completed++;
    if (formData.pocDetails.scope) completed++;
    if (formData.handoffDetails.preSalesTeam.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleSave = async () => {
    if (!selectedSite) {
      toast({
        title: "Error",
        description: "Please select a site",
        variant: "destructive"
      });
      return;
    }

    const questionnaireData = {
      site_id: selectedSite,
      project_id: selectedProject === 'no-project' ? undefined : selectedProject,
      questionnaire_data: formData,
      status: calculateProgress() === 100 ? 'completed' : 'in-progress'
    };

    try {
      if (questionnaire) {
        await updateQuestionnaire.mutateAsync({ 
          id: questionnaire.id, 
          ...questionnaireData,
          status: questionnaireData.status as any
        });
      } else {
        await createQuestionnaire.mutateAsync(questionnaireData);
      }
      
      toast({
        title: "Success",
        description: "Questionnaire saved successfully",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save questionnaire",
        variant: "destructive"
      });
    }
  };

  const addUseCase = () => {
    const newUseCase: UseCase = {
      id: `UC${formData.useCases.length + 1}`,
      title: '',
      description: '',
      requirementIds: [],
      pocScope: 'optional',
      testCaseIds: [],
      comments: '',
      portnoxChecklist: false,
      portnoxPocNotes: '',
      priority: 'optional',
      category: ''
    };
    setFormData(prev => ({ ...prev, useCases: [...prev.useCases, newUseCase] }));
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `TC${formData.testCases.length + 1}`,
      useCaseNumbers: [],
      title: '',
      description: '',
      expectedOutcome: '',
      priority: 'medium',
      status: 'pending'
    };
    setFormData(prev => ({ ...prev, testCases: [...prev.testCases, newTestCase] }));
  };

  const addRequirement = () => {
    const newRequirement: Requirement = {
      id: `FR-${formData.requirements.length + 1}`,
      description: '',
      justification: '',
      metNotMet: 'tbd',
      priority: 'medium',
      category: ''
    };
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, newRequirement] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {mode === 'create' && 'Comprehensive Scoping Questionnaire'}
            {mode === 'view' && 'Questionnaire Details'}
            {mode === 'edit' && 'Edit Questionnaire'}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <Progress value={calculateProgress()} className="w-48" />
            <Badge variant="glow">{calculateProgress()}% Complete</Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {!isViewMode && (
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save Questionnaire
            </Button>
          )}
        </div>
      </div>

      {/* Site and Project Selection */}
      {mode === 'create' && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Assignment & Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Site *</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {site.name} - {site.location}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Project (Optional)</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select associated project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-project">No Project Assignment</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="flex flex-col items-center gap-1 p-3 text-xs"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Questionnaire Title *</Label>
                    <Input 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., ACME Corp NAC Implementation Scoping"
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select 
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            High Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            Medium Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Low Priority
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estimated Duration</Label>
                    <Input 
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      placeholder="e.g., 12-16 weeks"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Target Go-Live Date</Label>
                    <Input 
                      type="date"
                      value={formData.targetGoLiveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetGoLiveDate: e.target.value }))}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Project Description</Label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the NAC implementation project, including business drivers, scope, and expected outcomes..."
                      rows={4}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Infrastructure Tab */}
        <TabsContent value="technical" className="space-y-6">
          {technicalCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  {category.icon}
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.subcategories.map((subcategory, subIndex) => (
                  <div key={subIndex} className="mb-6">
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      {subcategory.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subcategory.options.map((option, optionIndex) => {
                        const categoryKey = category.name.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof formData;
                        const currentValues = formData[categoryKey as keyof typeof formData] as any;
                        const fieldName = subcategory.name.toLowerCase().replace(/[^a-z]/g, '');
                        const isSelected = currentValues?.[fieldName]?.includes(option) || false;
                        
                        return (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${category.name}-${subcategory.name}-${optionIndex}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (isViewMode) return;
                                // Handle checkbox logic here
                              }}
                              disabled={isViewMode}
                            />
                            <Label 
                              htmlFor={`${category.name}-${subcategory.name}-${optionIndex}`}
                              className="text-sm cursor-pointer hover:text-primary transition-colors"
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {subIndex < category.subcategories.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Use Cases Tab */}
        <TabsContent value="use-cases" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Portnox Use Cases
              </CardTitle>
              {!isViewMode && (
                <Button onClick={addUseCase} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Use Case
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...portnoxUseCases, ...formData.useCases].map((useCase, index) => (
                  <Card key={useCase.id} className="border-l-4 border-l-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {useCase.id}
                          </Badge>
                          <h4 className="font-medium">{useCase.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={useCase.priority === 'mandatory' ? 'default' : 'secondary'}
                            className={useCase.priority === 'mandatory' ? 'bg-red-100 text-red-800' : ''}
                          >
                            {useCase.priority}
                          </Badge>
                          {useCase.portnoxChecklist && (
                            <Badge variant="glow" className="text-xs">
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Portnox Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      {useCase.portnoxPocNotes && (
                        <div className="bg-muted/30 p-3 rounded-md">
                          <Label className="text-xs font-medium text-primary">Portnox PoC Notes:</Label>
                          <p className="text-sm mt-1">{useCase.portnoxPocNotes}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {useCase.requirementIds.map(reqId => (
                          <Badge key={reqId} variant="outline" className="text-xs">
                            {reqId}
                          </Badge>
                        ))}
                      </div>
                      {useCase.comments && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Comments:</strong> {useCase.comments}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="test-cases" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary" />
                Test Cases & Validation
              </CardTitle>
              {!isViewMode && (
                <Button onClick={addTestCase} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...portnoxTestCases, ...formData.testCases].map((testCase, index) => (
                  <Card key={testCase.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {testCase.id}
                            </Badge>
                            <Badge 
                              variant={testCase.priority === 'high' ? 'destructive' : 
                                     testCase.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {testCase.priority}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{testCase.title}</h4>
                        </div>
                        <Badge 
                          variant={testCase.status === 'passed' ? 'default' : 
                                 testCase.status === 'failed' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {testCase.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium">Description:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{testCase.description}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Expected Outcome:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{testCase.expectedOutcome}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Label className="text-xs font-medium">Related Use Cases:</Label>
                        {testCase.useCaseNumbers.map(ucNum => (
                          <Badge key={ucNum} variant="outline" className="text-xs">
                            {ucNum}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Functional & Non-Functional Requirements
              </CardTitle>
              {!isViewMode && (
                <Button onClick={addRequirement} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...portnoxRequirements, ...formData.requirements].map((requirement, index) => (
                  <Card key={requirement.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {requirement.id}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {requirement.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={requirement.priority === 'critical' ? 'destructive' : 
                                   requirement.priority === 'high' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {requirement.priority}
                          </Badge>
                          <Badge 
                            variant={requirement.metNotMet === 'met' ? 'default' : 
                                   requirement.metNotMet === 'not-met' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {requirement.metNotMet}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium">Description:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Justification:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{requirement.justification}</p>
                      </div>
                      {requirement.portnoxCapability && (
                        <div className="bg-green-50 p-3 rounded-md">
                          <Label className="text-xs font-medium text-green-800">Portnox Capability:</Label>
                          <p className="text-sm text-green-700 mt-1">{requirement.portnoxCapability}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Implementation Tab */}
        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-primary" />
                Implementation Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Implementation Phases</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define the key phases for the Portnox NAC implementation
                  </p>
                  {/* Implementation phases content */}
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Success Criteria</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define measurable criteria for project success
                  </p>
                  {/* Success criteria content */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POC Planning Tab */}
        <TabsContent value="poc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Proof of Concept Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>POC Scope</Label>
                    <Textarea 
                      value={formData.pocDetails.scope}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pocDetails: { ...prev.pocDetails, scope: e.target.value }
                      }))}
                      placeholder="Define the scope and boundaries of the POC..."
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input 
                      value={formData.pocDetails.duration}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pocDetails: { ...prev.pocDetails, duration: e.target.value }
                      }))}
                      placeholder="e.g., 4-6 weeks"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Environment</Label>
                    <Input 
                      value={formData.pocDetails.environment}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pocDetails: { ...prev.pocDetails, environment: e.target.value }
                      }))}
                      placeholder="e.g., Production pilot, Lab environment"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Handoff Tab */}
        <TabsContent value="handoff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Roles & Handoff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Pre-Sales Team</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Account Executives and Sales Engineers involved in the scoping process
                  </p>
                  {/* Pre-sales team management */}
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Post-Sales Team</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Implementation team and project managers
                  </p>
                  {/* Post-sales team management */}
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Customer Team</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Customer stakeholders and technical contacts
                  </p>
                  {/* Customer team management */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveQuestionnaireForm;