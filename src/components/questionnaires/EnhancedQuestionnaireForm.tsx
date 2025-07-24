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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

interface EnhancedQuestionnaireFormProps {
  questionnaire?: any;
  sites: any[];
  projects: any[];
  mode: 'create' | 'view' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

interface VendorIntegration {
  category: string;
  selectedVendors: string[];
  models: string[];
  integrationNotes: string;
  configurationStatus: 'not-started' | 'in-progress' | 'completed';
}

const EnhancedQuestionnaireForm = ({ questionnaire, sites, projects, mode, onSuccess, onCancel }: EnhancedQuestionnaireFormProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedDuration: '',
    targetGoLiveDate: '',
    deploymentType: '',
    
    // Enhanced vendor integrations
    vendorIntegrations: [] as VendorIntegration[],
    
    // AI-powered recommendations
    aiRecommendations: {
      suggestedVendors: [] as string[],
      complianceRequirements: [] as string[],
      securityRecommendations: [] as string[],
      businessProfileInsights: [] as string[]
    },
    
    // Business profile data
    businessProfile: {
      industry: '',
      companySize: '',
      complianceFrameworks: [] as string[],
      securityMaturityLevel: '',
      budgetRange: '',
      timelineConstraints: '',
      riskTolerance: ''
    },
    
    // Real-time compliance monitoring
    complianceStatus: {
      frameworks: [] as any[],
      gaps: [] as string[],
      recommendations: [] as string[]
    },
    
    // Security assessment
    securityAssessment: {
      currentState: '',
      targetState: '',
      gaps: [] as string[],
      prioritizedActions: [] as any[]
    }
  });

  const isViewMode = mode === 'view';
  const createQuestionnaire = useCreateQuestionnaire();
  const updateQuestionnaire = useUpdateQuestionnaire();

  // Comprehensive vendor categories with latest industry standards
  const vendorCategories = [
    {
      category: "Wired Network Infrastructure",
      vendors: [
        "Cisco Catalyst (9000 Series)", "Aruba CX Switches", "Juniper EX4650", "Extreme Networks Universal",
        "Dell PowerSwitch S-Series", "HPE ProCurve 2930F", "Netgear M4300", "D-Link DGS-3130"
      ],
      models: ["802.1X Port Auth", "MAB", "Dynamic VLAN", "Port Security", "DHCP Snooping"]
    },
    {
      category: "Wireless Infrastructure",
      vendors: [
        "Cisco Meraki MR", "Aruba Instant On AP", "Ruckus R760", "Extreme Wing AP", 
        "Juniper Mist AP", "Ubiquiti WiFi 6", "TP-Link Omada EAP", "D-Link Nuclias Cloud"
      ],
      models: ["Wi-Fi 6E", "Wi-Fi 6", "WPA3-Enterprise", "OWE", "Enhanced Open", "RADSec"]
    },
    {
      category: "Firewall & NGFW",
      vendors: [
        "Palo Alto PA-Series", "Fortinet FortiGate", "Cisco FTD", "SonicWall TZ/NSa",
        "Check Point Quantum", "Barracuda CloudGen", "WatchGuard Firebox", "Sophos XGS"
      ],
      models: ["App-ID", "User-ID", "Content-ID", "Threat Prevention", "SSL Inspection"]
    },
    {
      category: "VPN & Remote Access",
      vendors: [
        "Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "Pulse Secure",
        "SonicWall NetExtender", "Check Point Harmony", "OpenVPN Cloud", "NordLayer"
      ],
      models: ["SSL VPN", "IPSec VPN", "ZTNA", "Per-App VPN", "Always-On VPN"]
    },
    {
      category: "MDM/UEM Solutions",
      vendors: [
        "Microsoft Intune", "VMware Workspace ONE", "Jamf Pro", "Google Workspace",
        "IBM Security MaaS360", "Citrix Endpoint Management", "SOTI MobiControl", "Hexnode UEM"
      ],
      models: ["Zero-Touch Enrollment", "BYOD Management", "App Wrapping", "Conditional Access"]
    },
    {
      category: "SIEM/SOAR Platforms",
      vendors: [
        "Splunk Enterprise Security", "Microsoft Sentinel", "IBM QRadar", "LogRhythm SIEM",
        "Rapid7 InsightIDR", "Sumo Logic", "Elastic Security", "Chronicle Security"
      ],
      models: ["UEBA", "Threat Hunting", "Automated Response", "ML Analytics", "Threat Intelligence"]
    },
    {
      category: "EDR/XDR Solutions",
      vendors: [
        "CrowdStrike Falcon", "Microsoft Defender for Endpoint", "SentinelOne Singularity", "Palo Alto Cortex XDR",
        "Trend Micro Vision One", "Carbon Black Cloud", "Symantec Endpoint Security", "FireEye Endpoint Security"
      ],
      models: ["Behavioral Analysis", "Threat Hunting", "Incident Response", "Forensics", "Remediation"]
    },
    {
      category: "Identity & Access Management",
      vendors: [
        "Microsoft Entra ID", "Okta Workforce Identity", "Ping Identity", "Auth0",
        "OneLogin", "CyberArk Identity", "SailPoint IdentityIQ", "ForgeRock Identity Platform"
      ],
      models: ["SSO", "MFA", "Risk-Based Auth", "Privileged Access", "Identity Governance"]
    },
    {
      category: "Cloud Security",
      vendors: [
        "Microsoft Defender for Cloud", "AWS Security Hub", "Google Cloud Security", "Palo Alto Prisma Cloud",
        "Check Point CloudGuard", "Trend Micro Cloud One", "Qualys VMDR", "Rapid7 InsightCloudSec"
      ],
      models: ["CSPM", "CWPP", "CASB", "Container Security", "Serverless Security"]
    }
  ];

  // Industry-specific compliance frameworks
  const complianceFrameworks = {
    "Healthcare": ["HIPAA", "HITECH", "FDA 21 CFR Part 11", "GDPR"],
    "Financial": ["PCI DSS", "SOX", "GLBA", "FFIEC", "PSD2"],
    "Government": ["FISMA", "FedRAMP", "NIST Cybersecurity Framework", "CJIS"],
    "Education": ["FERPA", "COPPA", "GLBA", "State Privacy Laws"],
    "Retail": ["PCI DSS", "GDPR", "CCPA", "SOX"],
    "Manufacturing": ["NIST Cybersecurity Framework", "ISO 27001", "IEC 62443"],
    "Technology": ["SOC 2", "ISO 27001", "GDPR", "CCPA", "FedRAMP"]
  };

  // Initialize vendor integrations
  useEffect(() => {
    if (formData.vendorIntegrations.length === 0) {
      setFormData(prev => ({
        ...prev,
        vendorIntegrations: vendorCategories.map(cat => ({
          category: cat.category,
          selectedVendors: [],
          models: [],
          integrationNotes: '',
          configurationStatus: 'not-started' as const
        }))
      }));
    }
  }, []);

  // AI-powered recommendations based on business profile
  const generateAIRecommendations = () => {
    const industry = formData.businessProfile.industry;
    const companySize = formData.businessProfile.companySize;
    
    let recommendations = {
      suggestedVendors: [] as string[],
      complianceRequirements: complianceFrameworks[industry as keyof typeof complianceFrameworks] || [],
      securityRecommendations: [] as string[],
      businessProfileInsights: [] as string[]
    };

    // Industry-specific vendor recommendations
    if (industry === "Healthcare") {
      recommendations.suggestedVendors = ["Microsoft Intune", "Cisco Meraki", "Palo Alto Networks"];
      recommendations.securityRecommendations = ["End-to-end encryption", "Advanced threat protection", "Zero trust architecture"];
    } else if (industry === "Financial") {
      recommendations.suggestedVendors = ["Fortinet", "Check Point", "IBM Security"];
      recommendations.securityRecommendations = ["Multi-layer security", "Real-time monitoring", "Incident response"];
    }

    // Company size recommendations
    if (companySize === "Enterprise (5000+)") {
      recommendations.businessProfileInsights = ["Consider scalable solutions", "Implement centralized management", "Plan for global deployment"];
    } else if (companySize === "SMB (100-1000)") {
      recommendations.businessProfileInsights = ["Focus on cost-effective solutions", "Prioritize ease of management", "Consider cloud-first approach"];
    }

    setFormData(prev => ({
      ...prev,
      aiRecommendations: recommendations
    }));

    toast({
      title: "AI Recommendations Generated",
      description: "Smart recommendations based on your business profile have been generated.",
    });
  };

  const handleVendorSelection = (categoryIndex: number, vendor: string, isSelected: boolean) => {
    setFormData(prev => {
      const newIntegrations = [...prev.vendorIntegrations];
      if (isSelected) {
        newIntegrations[categoryIndex].selectedVendors.push(vendor);
      } else {
        newIntegrations[categoryIndex].selectedVendors = 
          newIntegrations[categoryIndex].selectedVendors.filter(v => v !== vendor);
      }
      return { ...prev, vendorIntegrations: newIntegrations };
    });
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 8;

    if (formData.title) completed++;
    if (formData.businessProfile.industry) completed++;
    if (formData.vendorIntegrations.some(vi => vi.selectedVendors.length > 0)) completed++;
    if (formData.aiRecommendations.suggestedVendors.length > 0) completed++;
    if (formData.complianceStatus.frameworks.length > 0) completed++;
    if (formData.securityAssessment.currentState) completed++;
    if (formData.deploymentType) completed++;
    if (formData.targetGoLiveDate) completed++;

    return Math.round((completed / total) * 100);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
    { id: "business", label: "Business Profile", icon: <Building className="h-4 w-4" /> },
    { id: "ai-recommendations", label: "AI Recommendations", icon: <Zap className="h-4 w-4" /> },
    { id: "vendors", label: "Vendor Selection", icon: <Server className="h-4 w-4" /> },
    { id: "compliance", label: "Compliance", icon: <Shield className="h-4 w-4" /> },
    { id: "security", label: "Security Assessment", icon: <Lock className="h-4 w-4" /> },
    { id: "implementation", label: "Implementation", icon: <Settings className="h-4 w-4" /> },
    { id: "review", label: "Review & Submit", icon: <CheckCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced NAC Scoping Questionnaire</h2>
          <p className="text-muted-foreground">AI-powered intelligent scoping with real-time recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Completion Progress</p>
            <Progress value={calculateProgress()} className="w-32" />
            <p className="text-xs text-muted-foreground">{calculateProgress()}% complete</p>
          </div>
          {!isViewMode && (
            <Button onClick={generateAIRecommendations} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Generate AI Insights
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[70vh]">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="NAC Implementation Project"
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Target Site *</Label>
                    <Select value={selectedSite} onValueChange={setSelectedSite} disabled={isViewMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map(site => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name} - {site.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project objectives, scope, and expected outcomes..."
                    rows={3}
                    disabled={isViewMode}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Input
                      id="duration"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      placeholder="e.g., 12 weeks"
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goLive">Target Go-Live Date</Label>
                    <Input
                      id="goLive"
                      type="date"
                      value={formData.targetGoLiveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetGoLiveDate: e.target.value }))}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Profile Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Profile & Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry Vertical</Label>
                    <Select 
                      value={formData.businessProfile.industry} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        businessProfile: { ...prev.businessProfile, industry: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(complianceFrameworks).map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select 
                      value={formData.businessProfile.companySize} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        businessProfile: { ...prev.businessProfile, companySize: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup (1-50)">Startup (1-50)</SelectItem>
                        <SelectItem value="SMB (50-500)">SMB (50-500)</SelectItem>
                        <SelectItem value="Mid-Market (500-5000)">Mid-Market (500-5000)</SelectItem>
                        <SelectItem value="Enterprise (5000+)">Enterprise (5000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityMaturity">Security Maturity Level</Label>
                    <Select 
                      value={formData.businessProfile.securityMaturityLevel} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        businessProfile: { ...prev.businessProfile, securityMaturityLevel: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select maturity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic - Minimal security controls</SelectItem>
                        <SelectItem value="Developing">Developing - Some security practices</SelectItem>
                        <SelectItem value="Defined">Defined - Formal security program</SelectItem>
                        <SelectItem value="Managed">Managed - Comprehensive security program</SelectItem>
                        <SelectItem value="Optimized">Optimized - Advanced security operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Select 
                      value={formData.businessProfile.riskTolerance} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        businessProfile: { ...prev.businessProfile, riskTolerance: value }
                      }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low - Risk averse</SelectItem>
                        <SelectItem value="Medium">Medium - Balanced approach</SelectItem>
                        <SelectItem value="High">High - Risk accepting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Budget Range (Optional)</Label>
                  <Select 
                    value={formData.businessProfile.budgetRange} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      businessProfile: { ...prev.businessProfile, budgetRange: value }
                    }))}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $50K">Under $50K</SelectItem>
                      <SelectItem value="$50K - $100K">$50K - $100K</SelectItem>
                      <SelectItem value="$100K - $250K">$100K - $250K</SelectItem>
                      <SelectItem value="$250K - $500K">$250K - $500K</SelectItem>
                      <SelectItem value="$500K+">$500K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="ai-recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Suggested Vendors</h4>
                    <div className="space-y-2">
                      {formData.aiRecommendations.suggestedVendors.length > 0 ? (
                        formData.aiRecommendations.suggestedVendors.map((vendor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border">
                            <span className="font-medium">{vendor}</span>
                            <Badge variant="secondary">AI Recommended</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Generate AI recommendations to see vendor suggestions</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Compliance Requirements</h4>
                    <div className="space-y-2">
                      {formData.aiRecommendations.complianceRequirements.length > 0 ? (
                        formData.aiRecommendations.complianceRequirements.map((req, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border">
                            <span className="font-medium">{req}</span>
                            <Badge variant="outline">Required</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Select industry to see compliance requirements</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Security Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.aiRecommendations.securityRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-success/5 rounded-lg border">
                        <Shield className="h-5 w-5 text-success" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Business Profile Insights</h4>
                  <div className="space-y-2">
                    {formData.aiRecommendations.businessProfileInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-info/5 rounded-lg border">
                        <TrendingUp className="h-5 w-5 text-info mt-0.5" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Selection Tab */}
          <TabsContent value="vendors" className="space-y-6">
            {vendorCategories.map((category, categoryIndex) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.category}</span>
                    <Badge variant="outline">
                      {formData.vendorIntegrations[categoryIndex]?.selectedVendors.length || 0} selected
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.vendors.map((vendor, vendorIndex) => (
                      <div key={vendorIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${categoryIndex}-${vendorIndex}`}
                          checked={formData.vendorIntegrations[categoryIndex]?.selectedVendors.includes(vendor)}
                          onCheckedChange={(checked) => 
                            handleVendorSelection(categoryIndex, vendor, checked as boolean)
                          }
                          disabled={isViewMode}
                        />
                        <Label 
                          htmlFor={`${categoryIndex}-${vendorIndex}`} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {vendor}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Integration Notes</Label>
                    <Textarea
                      placeholder="Specific models, versions, configuration requirements..."
                      value={formData.vendorIntegrations[categoryIndex]?.integrationNotes || ''}
                      onChange={(e) => setFormData(prev => {
                        const newIntegrations = [...prev.vendorIntegrations];
                        newIntegrations[categoryIndex] = {
                          ...newIntegrations[categoryIndex],
                          integrationNotes: e.target.value
                        };
                        return { ...prev, vendorIntegrations: newIntegrations };
                      })}
                      rows={2}
                      disabled={isViewMode}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </ScrollArea>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}>
              Previous
            </Button>
            <Button onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
              }
            }}>
              Next
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedQuestionnaireForm;