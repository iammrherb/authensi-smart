import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Shield, 
  Network, 
  Database, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  Bot,
  Target,
  Layers,
  Code,
  Check,
  AlertTriangle,
  Info,
  Plus,
  Wifi,
  Server,
  Lock,
  Users,
  Globe,
  Copy,
  Download
} from 'lucide-react';
import { useEnhancedVendors } from '@/hooks/useVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useToast } from '@/hooks/use-toast';

interface OneXerConfigWizardProps {
  projectId?: string;
  siteId?: string;
  onSave?: (config: any) => void;
  onCancel?: () => void;
}

interface ConfigurationScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  authMethods: string[];
  vlans: boolean;
  guestAccess: boolean;
  compliance: string[];
  template?: string;
}

interface WizardData {
  basic: {
    name: string;
    description: string;
    vendor: string;
    model: string;
    firmwareVersion: string;
    deviceType: string;
  };
  scenarios: {
    selectedScenarios: string[];
    customRequirements: string;
    authMethods: string[];
    networkSegmentation: boolean;
    guestAccess: boolean;
    compliance: string[];
  };
  advanced: {
    vlans: {
      dataVlan: string;
      voiceVlan: string;
      guestVlan: string;
      quarantineVlan: string;
      nativeVlan: string;
      managementVlan: string;
      dynamicVlanAssignment: boolean;
      vlanOverrides: Record<string, string>;
    };
    radius: {
      primaryServer: string;
      secondaryServer: string;
      secret: string;
      timeout: number;
      retries: number;
      loadBalancing: boolean;
      coaEnabled: boolean;
      radiusAccountingEnabled: boolean;
    };
    authentication: {
      dot1xPriority: number;
      mabFallback: boolean;
      webAuthFallback: boolean;
      maxAuthAttempts: number;
      reauthPeriod: number;
      inactivityTimeout: number;
      concurrentAuthentication: boolean;
      hostModes: string[];
    };
    portSecurity: {
      enabled: boolean;
      maximumMac: number;
      violationAction: string;
      stickyMac: boolean;
      agingTime: number;
      agingType: string;
    };
    advanced: {
      deviceTracking: boolean;
      dhcpSnooping: boolean;
      ipSourceGuard: boolean;
      arpInspection: boolean;
      stormControl: boolean;
      portfast: boolean;
      bpduGuard: boolean;
    };
  };
  generation: {
    useAI: boolean;
    includeComments: boolean;
    includeValidation: boolean;
    includeTroubleshooting: boolean;
    configFormat: string;
  };
}

const OneXerConfigWizard: React.FC<OneXerConfigWizardProps> = ({ 
  projectId, 
  siteId, 
  onSave, 
  onCancel 
}) => {
  const { data: vendors } = useEnhancedVendors();
  const { data: allVendorModels } = useVendorModels();
  const { toast } = useToast();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    basic: {
      name: '',
      description: '',
      vendor: '',
      model: '',
      firmwareVersion: '',
      deviceType: 'switch'
    },
    scenarios: {
      selectedScenarios: [],
      customRequirements: '',
      authMethods: [],
      networkSegmentation: false,
      guestAccess: false,
      compliance: []
    },
    advanced: {
      vlans: {
        dataVlan: '100',
        voiceVlan: '200',
        guestVlan: '300',
        quarantineVlan: '999',
        nativeVlan: '1',
        managementVlan: '10',
        dynamicVlanAssignment: true,
        vlanOverrides: {}
      },
      radius: {
        primaryServer: '',
        secondaryServer: '',
        secret: '',
        timeout: 5,
        retries: 3,
        loadBalancing: false,
        coaEnabled: true,
        radiusAccountingEnabled: true
      },
      authentication: {
        dot1xPriority: 1,
        mabFallback: true,
        webAuthFallback: false,
        maxAuthAttempts: 3,
        reauthPeriod: 3600,
        inactivityTimeout: 300,
        concurrentAuthentication: false,
        hostModes: ['single-host']
      },
      portSecurity: {
        enabled: false,
        maximumMac: 1,
        violationAction: 'restrict',
        stickyMac: false,
        agingTime: 0,
        agingType: 'absolute'
      },
      advanced: {
        deviceTracking: true,
        dhcpSnooping: true,
        ipSourceGuard: false,
        arpInspection: false,
        stormControl: false,
        portfast: true,
        bpduGuard: true
      }
    },
    generation: {
      useAI: true,
      includeComments: true,
      includeValidation: true,
      includeTroubleshooting: true,
      configFormat: 'detailed'
    }
  });

  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get vendor models filtered by selected vendor
  const vendorModels = allVendorModels?.filter(model => 
    model.vendor_id === wizardData.basic.vendor
  ) || [];
  
  console.log('Debug Config Wizard:', { 
    vendors: vendors?.length || 0, 
    allVendorModels: allVendorModels?.length || 0,
    selectedVendor: wizardData.basic.vendor,
    filteredModels: vendorModels.length
  });

  // Wizard steps
  const steps = [
    {
      id: 0,
      title: "Device & Vendor",
      description: "Configure device and vendor information",
      icon: Server,
      sections: ["Basic Information", "Device Selection", "Firmware Details"]
    },
    {
      id: 1,
      title: "Configuration Scenarios",
      description: "Select authentication and use case scenarios",
      icon: Target,
      sections: ["Use Cases", "Authentication Methods", "Compliance Requirements"]
    },
    {
      id: 2,
      title: "Network & VLANs",
      description: "Configure network segmentation and VLAN settings",
      icon: Network,
      sections: ["VLAN Configuration", "Network Segmentation", "Guest Access"]
    },
    {
      id: 3,
      title: "Authentication & RADIUS",
      description: "Configure authentication methods and RADIUS settings",
      icon: Shield,
      sections: ["802.1X Settings", "RADIUS Configuration", "Fallback Methods"]
    },
    {
      id: 4,
      title: "Advanced Security",
      description: "Configure port security and advanced features",
      icon: Lock,
      sections: ["Port Security", "Device Tracking", "Security Features"]
    },
    {
      id: 5,
      title: "Generate Configuration",
      description: "Generate and review your configuration",
      icon: FileText,
      sections: ["Generation Options", "Preview", "Export"]
    }
  ];

  // Configuration scenarios with comprehensive options
  const configurationScenarios: ConfigurationScenario[] = [
    // Core Authentication Scenarios
    {
      id: 'dot1x-cert',
      name: '802.1X Certificate-Based Authentication',
      description: 'Secure authentication using digital certificates with full certificate lifecycle management',
      category: 'authentication',
      complexity: 'advanced',
      authMethods: ['802.1X', 'EAP-TLS', 'Certificate'],
      vlans: true,
      guestAccess: false,
      compliance: ['PCI-DSS', 'HIPAA', 'SOX']
    },
    {
      id: 'dot1x-cred',
      name: '802.1X Credential-Based Authentication',
      description: 'Username/password authentication with Active Directory integration',
      category: 'authentication',
      complexity: 'intermediate',
      authMethods: ['802.1X', 'EAP-PEAP', 'MSCHAPv2'],
      vlans: true,
      guestAccess: false,
      compliance: ['GDPR', 'SOC2']
    },
    {
      id: 'mab-fallback',
      name: 'MAC Authentication Bypass (MAB)',
      description: 'Device authentication based on MAC address with whitelist management',
      category: 'authentication',
      complexity: 'basic',
      authMethods: ['MAB', 'MAC-Auth'],
      vlans: true,
      guestAccess: false,
      compliance: []
    },
    
    // Guest & BYOD Scenarios
    {
      id: 'guest-captive',
      name: 'Guest Access with Captive Portal',
      description: 'Secure guest network access with web-based authentication and terms acceptance',
      category: 'guest',
      complexity: 'intermediate',
      authMethods: ['WebAuth', 'Captive-Portal'],
      vlans: true,
      guestAccess: true,
      compliance: ['GDPR']
    },
    {
      id: 'byod-comprehensive',
      name: 'BYOD with Device Registration',
      description: 'Bring Your Own Device support with automated device registration and provisioning',
      category: 'byod',
      complexity: 'advanced',
      authMethods: ['802.1X', 'WebAuth', 'Device-Registration'],
      vlans: true,
      guestAccess: true,
      compliance: ['HIPAA', 'SOC2']
    },
    {
      id: 'sponsored-guest',
      name: 'Sponsored Guest Access',
      description: 'Guest access requiring sponsor approval with time-limited access',
      category: 'guest',
      complexity: 'advanced',
      authMethods: ['WebAuth', 'Sponsor-Portal', 'SMS-Verification'],
      vlans: true,
      guestAccess: true,
      compliance: ['GDPR']
    },

    // IoT & Device Scenarios
    {
      id: 'iot-profiling',
      name: 'IoT Device Profiling & Segmentation',
      description: 'Automated IoT device discovery, profiling, and micro-segmentation',
      category: 'iot',
      complexity: 'advanced',
      authMethods: ['MAB', 'Device-Profiling', 'DHCP-Fingerprinting'],
      vlans: true,
      guestAccess: false,
      compliance: ['IoT-Security']
    },
    {
      id: 'medical-devices',
      name: 'Medical Device Authentication',
      description: 'HIPAA-compliant authentication for medical and healthcare devices',
      category: 'healthcare',
      complexity: 'advanced',
      authMethods: ['MAB', 'Certificate', 'Device-Profiling'],
      vlans: true,
      guestAccess: false,
      compliance: ['HIPAA', '21-CFR-Part-11']
    },
    {
      id: 'industrial-iot',
      name: 'Industrial IoT & OT Devices',
      description: 'Operational technology device authentication with industrial protocols',
      category: 'industrial',
      complexity: 'advanced',
      authMethods: ['MAB', 'Certificate', 'Protocol-Analysis'],
      vlans: true,
      guestAccess: false,
      compliance: ['NERC-CIP', 'IEC-62443']
    },

    // Advanced Security Scenarios
    {
      id: 'zero-trust',
      name: 'Zero Trust Network Access',
      description: 'Comprehensive zero trust implementation with continuous verification',
      category: 'zero-trust',
      complexity: 'expert',
      authMethods: ['802.1X', 'Certificate', 'MFA', 'Risk-Assessment'],
      vlans: true,
      guestAccess: false,
      compliance: ['NIST-Zero-Trust', 'CMMC']
    },
    {
      id: 'contractor-access',
      name: 'Contractor & Temporary Access',
      description: 'Time-limited access for contractors with role-based permissions',
      category: 'contractor',
      complexity: 'intermediate',
      authMethods: ['WebAuth', 'Time-Limited', 'Role-Based'],
      vlans: true,
      guestAccess: true,
      compliance: ['SOC2', 'ISO27001']
    },
    {
      id: 'high-security',
      name: 'High Security Environment',
      description: 'Maximum security for government and defense environments',
      category: 'government',
      complexity: 'expert',
      authMethods: ['802.1X', 'Certificate', 'MFA', 'Biometric'],
      vlans: true,
      guestAccess: false,
      compliance: ['FedRAMP', 'FISMA', 'CMMC', 'Common-Criteria']
    },

    // Protocol & Integration Scenarios
    {
      id: 'radsec-secure',
      name: 'RADSEC Secure RADIUS',
      description: 'RADIUS over TLS/DTLS for encrypted RADIUS communication',
      category: 'protocol',
      complexity: 'advanced',
      authMethods: ['RADSEC', 'TLS', 'Certificate'],
      vlans: false,
      guestAccess: false,
      compliance: ['Security-Enhanced']
    },
    {
      id: 'tacacs-mgmt',
      name: 'TACACS+ Management Access',
      description: 'Administrative access control using TACACS+ with command authorization',
      category: 'management',
      complexity: 'advanced',
      authMethods: ['TACACS+', 'Command-Authorization', 'Accounting'],
      vlans: false,
      guestAccess: false,
      compliance: ['Administrative-Security']
    },
    {
      id: 'coa-dynamic',
      name: 'CoA Dynamic Authorization',
      description: 'Change of Authorization for dynamic policy updates and session control',
      category: 'dynamic',
      complexity: 'advanced',
      authMethods: ['802.1X', 'CoA', 'Dynamic-Policy'],
      vlans: true,
      guestAccess: false,
      compliance: ['Dynamic-Security']
    },

    // Compliance & Regulatory Scenarios
    {
      id: 'pci-compliance',
      name: 'PCI-DSS Compliance',
      description: 'Payment card industry compliance with network segmentation',
      category: 'compliance',
      complexity: 'advanced',
      authMethods: ['802.1X', 'Certificate', 'Network-Segmentation'],
      vlans: true,
      guestAccess: false,
      compliance: ['PCI-DSS', 'Data-Protection']
    },
    {
      id: 'hipaa-healthcare',
      name: 'HIPAA Healthcare Compliance',
      description: 'Healthcare network security with patient data protection',
      category: 'healthcare',
      complexity: 'advanced',
      authMethods: ['802.1X', 'Certificate', 'Audit-Logging'],
      vlans: true,
      guestAccess: true,
      compliance: ['HIPAA', '21-CFR-Part-11', 'HITECH']
    },
    {
      id: 'gdpr-privacy',
      name: 'GDPR Privacy Protection',
      description: 'EU General Data Protection Regulation compliance with privacy controls',
      category: 'privacy',
      complexity: 'intermediate',
      authMethods: ['802.1X', 'Privacy-Controls', 'Data-Minimization'],
      vlans: true,
      guestAccess: true,
      compliance: ['GDPR', 'Privacy-Shield']
    },

    // Deployment & Migration Scenarios
    {
      id: 'phased-deployment',
      name: 'Phased NAC Deployment',
      description: 'Gradual NAC rollout with minimal business disruption',
      category: 'deployment',
      complexity: 'intermediate',
      authMethods: ['Monitor-Mode', 'Gradual-Enforcement', 'Rollback-Plan'],
      vlans: true,
      guestAccess: false,
      compliance: []
    },
    {
      id: 'legacy-integration',
      name: 'Legacy System Integration',
      description: 'Integration with existing legacy systems and gradual modernization',
      category: 'integration',
      complexity: 'advanced',
      authMethods: ['Hybrid-Auth', 'Legacy-Support', 'Migration-Tools'],
      vlans: true,
      guestAccess: false,
      compliance: []
    }
  ];

  // Authentication methods with detailed options
  const authenticationMethods = [
    { id: '802.1X', name: '802.1X Authentication', description: 'IEEE 802.1X port-based network access control' },
    { id: 'MAB', name: 'MAC Authentication Bypass', description: 'Authentication based on device MAC address' },
    { id: 'WebAuth', name: 'Web Authentication', description: 'Browser-based authentication with captive portal' },
    { id: 'Certificate', name: 'Certificate-Based Auth', description: 'Digital certificate authentication (EAP-TLS)' },
    { id: 'MFA', name: 'Multi-Factor Authentication', description: 'Additional security with multiple authentication factors' },
    { id: 'SAML', name: 'SAML SSO', description: 'Single Sign-On with SAML integration' },
    { id: 'RADIUS', name: 'RADIUS Authentication', description: 'Remote Authentication Dial-In User Service' },
    { id: 'TACACS+', name: 'TACACS+ Authentication', description: 'Terminal Access Controller Access-Control System Plus' },
    { id: 'LDAP', name: 'LDAP Authentication', description: 'Lightweight Directory Access Protocol' },
    { id: 'Active-Directory', name: 'Active Directory', description: 'Microsoft Active Directory integration' },
    { id: 'RADSEC', name: 'RADSEC', description: 'RADIUS over TLS/DTLS for secure communication' },
    { id: 'CoA', name: 'Change of Authorization', description: 'Dynamic session management and policy updates' }
  ];

  // Host modes for different vendors
  const hostModes = [
    { id: 'single-host', name: 'Single Host', description: 'One device per port' },
    { id: 'multi-host', name: 'Multi Host', description: 'Multiple devices per port' },
    { id: 'multi-auth', name: 'Multi Auth', description: 'Multiple authenticated devices per port' },
    { id: 'multi-domain', name: 'Multi Domain', description: 'Separate authentication for data and voice' }
  ];

  // Compliance frameworks
  const complianceFrameworks = [
    'PCI-DSS', 'HIPAA', 'SOX', 'GDPR', 'SOC2', 'ISO27001', 'NIST', 'FedRAMP', 
    'FISMA', 'CMMC', 'NERC-CIP', '21-CFR-Part-11', 'HITECH', 'IEC-62443'
  ];

  const calculateProgress = () => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateWizardData = (section: keyof WizardData, field: string, value: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateAdvancedData = (subsection: string, field: string, value: any) => {
    setWizardData(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [subsection]: {
          ...prev.advanced[subsection as keyof typeof prev.advanced],
          [field]: value
        }
      }
    }));
  };

  const generateConfiguration = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation with comprehensive config
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedVendor = vendors?.find(v => v.id === wizardData.basic.vendor);
      const selectedModel = vendorModels.find(m => m.id === wizardData.basic.model);
      
      const config = generateDetailedConfig(selectedVendor, selectedModel, wizardData);
      setGeneratedConfig(config);
      
      toast({
        title: "Configuration Generated Successfully",
        description: "Your NAC configuration has been generated with AI-powered recommendations."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDetailedConfig = (vendor: any, model: any, data: WizardData): string => {
    const vendorName = vendor?.vendor_name || 'Unknown';
    const modelName = model?.model_name || 'Unknown';
    
    let config = `!
! ============================================================
! ${vendorName} ${modelName} - 802.1X NAC Configuration
! Generated by DotXer Config Wizard
! Configuration Date: ${new Date().toLocaleString()}
! ============================================================
!
! CONFIGURATION SUMMARY:
! - Vendor: ${vendorName}
! - Model: ${modelName}
! - Firmware: ${data.basic.firmwareVersion || 'Latest Recommended'}
! - Scenarios: ${data.scenarios.selectedScenarios.join(', ')}
! - Authentication: ${data.scenarios.authMethods.join(', ')}
! - VLANs: Data(${data.advanced.vlans.dataVlan}), Voice(${data.advanced.vlans.voiceVlan}), Guest(${data.advanced.vlans.guestVlan})
!
! ============================================================
! GLOBAL CONFIGURATION
! ============================================================

`;

    // Add vendor-specific configuration based on selected vendor
    if (vendorName.toLowerCase().includes('cisco')) {
      config += generateCiscoConfig(data);
    } else if (vendorName.toLowerCase().includes('aruba')) {
      config += generateArubaConfig(data);
    } else if (vendorName.toLowerCase().includes('juniper')) {
      config += generateJuniperConfig(data);
    } else {
      config += generateGenericConfig(data);
    }

    if (data.generation.includeTroubleshooting) {
      config += `
! ============================================================
! TROUBLESHOOTING COMMANDS
! ============================================================
!
! Authentication Status:
! show authentication sessions
! show dot1x all summary
! show authentication sessions interface <interface>
!
! RADIUS Debug:
! debug radius authentication
! debug dot1x events
! debug authentication events
!
! Common Issues:
! 1. Check RADIUS server connectivity: test aaa group radius <server> <username> <password>
! 2. Verify certificate installation: show crypto pki certificates
! 3. Check VLAN assignments: show vlan brief
! 4. Monitor authentication events: show logging | include Authentication
!
! Performance Monitoring:
! show authentication statistics
! show dot1x statistics interface <interface>
! show radius statistics
!
`;
    }

    return config;
  };

  const generateCiscoConfig = (data: WizardData): string => {
    return `! Cisco IOS/IOS-XE Configuration
!
! AAA Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius
!
! RADIUS Server Configuration
radius server primary-radius
 address ipv4 ${data.advanced.radius.primaryServer || '192.168.1.10'} auth-port 1812 acct-port 1813
 key ${data.advanced.radius.secret || 'shared-secret'}
 timeout ${data.advanced.radius.timeout}
 retransmit ${data.advanced.radius.retries}
!
${data.advanced.radius.secondaryServer ? `radius server secondary-radius
 address ipv4 ${data.advanced.radius.secondaryServer} auth-port 1812 acct-port 1813
 key ${data.advanced.radius.secret || 'shared-secret'}
 timeout ${data.advanced.radius.timeout}
 retransmit ${data.advanced.radius.retries}
!` : ''}
! RADIUS Group Configuration
aaa group server radius RADIUS-GROUP
 server name primary-radius
${data.advanced.radius.secondaryServer ? ' server name secondary-radius' : ''}
!
! 802.1X Global Configuration
dot1x system-auth-control
dot1x critical eapol
!
! VLAN Configuration
${generateVlanConfig(data)}
!
! Interface Configuration Template
! Apply to access ports requiring authentication
interface range GigabitEthernet1/0/1-48
 switchport mode access
 switchport access vlan ${data.advanced.vlans.dataVlan}
 switchport voice vlan ${data.advanced.vlans.voiceVlan}
 ${data.advanced.authentication.dot1xPriority === 1 ? 'authentication order dot1x mab' : 'authentication order mab dot1x'}
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate ${data.advanced.authentication.reauthPeriod}
 authentication violation restrict
 ${data.scenarios.authMethods.includes('MAB') ? 'mab' : ''}
 ${data.advanced.advanced.portfast ? 'spanning-tree portfast' : ''}
 ${data.advanced.advanced.bpduGuard ? 'spanning-tree bpduguard enable' : ''}
!
! Guest VLAN Configuration (if enabled)
${data.scenarios.guestAccess ? `vlan ${data.advanced.vlans.guestVlan}
 name GUEST-VLAN
!
interface range GigabitEthernet1/0/1-48
 authentication event fail action authorize vlan ${data.advanced.vlans.guestVlan}
 authentication event no-response action authorize vlan ${data.advanced.vlans.guestVlan}
!` : ''}
! Port Security (if enabled)
${data.advanced.portSecurity.enabled ? `interface range GigabitEthernet1/0/1-48
 switchport port-security
 switchport port-security maximum ${data.advanced.portSecurity.maximumMac}
 switchport port-security violation ${data.advanced.portSecurity.violationAction}
 ${data.advanced.portSecurity.stickyMac ? 'switchport port-security mac-address sticky' : ''}
 switchport port-security aging time ${data.advanced.portSecurity.agingTime}
 switchport port-security aging type ${data.advanced.portSecurity.agingType}
!` : ''}
! Advanced Security Features
${data.advanced.advanced.deviceTracking ? 'device-tracking tracking' : ''}
${data.advanced.advanced.dhcpSnooping ? `ip dhcp snooping
ip dhcp snooping vlan ${data.advanced.vlans.dataVlan}
interface range GigabitEthernet1/0/1-48
 ip dhcp snooping trust
!` : ''}
`;
  };

  const generateArubaConfig = (data: WizardData): string => {
    return `! Aruba CX Configuration
!
! AAA Configuration
aaa authentication port-access dot1x authenticator radius
aaa authentication port-access mac-auth radius
!
! RADIUS Server Configuration
radius-server host ${data.advanced.radius.primaryServer || '192.168.1.10'} key ${data.advanced.radius.secret || 'shared-secret'}
${data.advanced.radius.secondaryServer ? `radius-server host ${data.advanced.radius.secondaryServer} key ${data.advanced.radius.secret || 'shared-secret'}` : ''}
!
! 802.1X Global Configuration
802.1x
!
! VLAN Configuration
${generateVlanConfig(data)}
!
! Interface Configuration
interface 1/1/1-1/1/48
 no shutdown
 no routing
 vlan access ${data.advanced.vlans.dataVlan}
 ${data.scenarios.guestAccess ? `auth-fail-vlan ${data.advanced.vlans.guestVlan}` : ''}
 ${data.scenarios.authMethods.includes('802.1X') ? 'aaa authentication port-access dot1x authenticator' : ''}
 ${data.scenarios.authMethods.includes('MAB') ? 'aaa authentication port-access mac-auth' : ''}
!
`;
  };

  const generateJuniperConfig = (data: WizardData): string => {
    return `! Juniper EX Configuration
!
! AAA Configuration
set access radius-server ${data.advanced.radius.primaryServer || '192.168.1.10'} secret "${data.advanced.radius.secret || 'shared-secret'}"
set access radius-server ${data.advanced.radius.primaryServer || '192.168.1.10'} timeout ${data.advanced.radius.timeout}
!
! 802.1X Configuration
set protocols dot1x authenticator authentication-profile-name default
set protocols dot1x authenticator interface all
!
! VLAN Configuration
${generateVlanConfig(data)}
!
! Interface Configuration
set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode access
set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members data-vlan
set interfaces ge-0/0/0 unit 0 family ethernet-switching port-mode access
!
`;
  };

  const generateGenericConfig = (data: WizardData): string => {
    return `! Generic NAC Configuration Template
!
! This is a vendor-neutral configuration template
! Please adapt to your specific vendor syntax
!
! Core Requirements:
! 1. RADIUS server: ${data.advanced.radius.primaryServer || '192.168.1.10'}
! 2. Shared secret: ${data.advanced.radius.secret || 'shared-secret'}
! 3. Data VLAN: ${data.advanced.vlans.dataVlan}
! 4. Voice VLAN: ${data.advanced.vlans.voiceVlan}
! 5. Guest VLAN: ${data.advanced.vlans.guestVlan}
!
! Authentication Methods: ${data.scenarios.authMethods.join(', ')}
! Selected Scenarios: ${data.scenarios.selectedScenarios.join(', ')}
!
`;
  };

  const generateVlanConfig = (data: WizardData): string => {
    return `vlan ${data.advanced.vlans.dataVlan}
 name DATA-VLAN
!
vlan ${data.advanced.vlans.voiceVlan}
 name VOICE-VLAN
!
${data.scenarios.guestAccess ? `vlan ${data.advanced.vlans.guestVlan}
 name GUEST-VLAN
!` : ''}
vlan ${data.advanced.vlans.quarantineVlan}
 name QUARANTINE-VLAN
!
vlan ${data.advanced.vlans.managementVlan}
 name MGMT-VLAN
!`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicStep();
      case 1:
        return renderScenariosStep();
      case 2:
        return renderNetworkVlansStep();
      case 3:
        return renderAuthenticationRadiusStep();
      case 4:
        return renderAdvancedSecurityStep();
      case 5:
        return renderGenerationStep();
      default:
        return null;
    }
  };

  const renderBasicStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="config-name">Configuration Name</Label>
              <Input
                id="config-name"
                value={wizardData.basic.name}
                onChange={(e) => updateWizardData('basic', 'name', e.target.value)}
                placeholder="e.g., Campus Switch 802.1X Config"
              />
            </div>
            <div>
              <Label htmlFor="config-description">Description</Label>
              <Textarea
                id="config-description"
                value={wizardData.basic.description}
                onChange={(e) => updateWizardData('basic', 'description', e.target.value)}
                placeholder="Describe the purpose and scope of this configuration..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="device-type">Device Type</Label>
              <Select value={wizardData.basic.deviceType} onValueChange={(value) => updateWizardData('basic', 'deviceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Network Switch</SelectItem>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="wireless">Wireless Controller</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="appliance">Security Appliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Vendor & Model Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vendor">Vendor *</Label>
              <Select value={wizardData.basic.vendor} onValueChange={(value) => {
                updateWizardData('basic', 'vendor', value);
                updateWizardData('basic', 'model', ''); // Reset model when vendor changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network vendor..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {vendors?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vendor.vendor_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {vendor.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!wizardData.basic.vendor && (
                <p className="text-sm text-muted-foreground mt-1">
                  Please select a vendor to continue
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Select 
                value={wizardData.basic.model} 
                onValueChange={(value) => updateWizardData('basic', 'model', value)}
                disabled={!wizardData.basic.vendor || vendorModels.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !wizardData.basic.vendor 
                      ? "Select vendor first" 
                      : vendorModels.length === 0 
                        ? "No models available"
                        : "Select device model..."
                  } />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {vendorModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{model.model_name}</span>
                        {model.model_series && (
                          <span className="text-xs text-muted-foreground">
                            Series: {model.model_series}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {wizardData.basic.vendor && vendorModels.length === 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  No models found for selected vendor. Please contact support.
                </p>
              )}
              {!wizardData.basic.model && wizardData.basic.vendor && vendorModels.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Please select a device model to continue
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="firmware">Firmware Version</Label>
              <Input
                id="firmware"
                value={wizardData.basic.firmwareVersion}
                onChange={(e) => updateWizardData('basic', 'firmwareVersion', e.target.value)}
                placeholder="e.g., 17.6.04"
              />
              {wizardData.basic.model && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Recommended versions for selected model:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendorModels
                      .find(m => m.id === wizardData.basic.model)
                      ?.firmware_versions?.map((version: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer"
                          onClick={() => updateWizardData('basic', 'firmwareVersion', version)}
                        >
                          {version}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderScenariosStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Configuration Scenarios
          </CardTitle>
          <CardDescription>
            Select one or more scenarios that match your requirements. You can combine multiple scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configurationScenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`cursor-pointer transition-all ${
                  wizardData.scenarios.selectedScenarios.includes(scenario.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  const selected = wizardData.scenarios.selectedScenarios;
                  if (selected.includes(scenario.id)) {
                    updateWizardData('scenarios', 'selectedScenarios', selected.filter(s => s !== scenario.id));
                  } else {
                    updateWizardData('scenarios', 'selectedScenarios', [...selected, scenario.id]);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{scenario.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {scenario.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {scenario.authMethods.slice(0, 2).map((method) => (
                        <Badge key={method} variant="secondary" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                      {scenario.authMethods.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{scenario.authMethods.length - 2}
                        </Badge>
                      )}
                    </div>
                    {scenario.compliance.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {scenario.compliance.slice(0, 2).map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {authenticationMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={method.id}
                  checked={wizardData.scenarios.authMethods.includes(method.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateWizardData('scenarios', 'authMethods', [...wizardData.scenarios.authMethods, method.id]);
                    } else {
                      updateWizardData('scenarios', 'authMethods', wizardData.scenarios.authMethods.filter(m => m !== method.id));
                    }
                  }}
                />
                <div>
                  <Label htmlFor={method.id} className="text-sm font-medium">{method.name}</Label>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {complianceFrameworks.map((framework) => (
                <div key={framework} className="flex items-center space-x-2">
                  <Checkbox
                    id={framework}
                    checked={wizardData.scenarios.compliance.includes(framework)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateWizardData('scenarios', 'compliance', [...wizardData.scenarios.compliance, framework]);
                      } else {
                        updateWizardData('scenarios', 'compliance', wizardData.scenarios.compliance.filter(c => c !== framework));
                      }
                    }}
                  />
                  <Label htmlFor={framework} className="text-sm">{framework}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNetworkVlansStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              VLAN Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data-vlan">Data VLAN</Label>
                <Input
                  id="data-vlan"
                  value={wizardData.advanced.vlans.dataVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'dataVlan', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="voice-vlan">Voice VLAN</Label>
                <Input
                  id="voice-vlan"
                  value={wizardData.advanced.vlans.voiceVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'voiceVlan', e.target.value)}
                  placeholder="200"
                />
              </div>
              <div>
                <Label htmlFor="guest-vlan">Guest VLAN</Label>
                <Input
                  id="guest-vlan"
                  value={wizardData.advanced.vlans.guestVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'guestVlan', e.target.value)}
                  placeholder="300"
                />
              </div>
              <div>
                <Label htmlFor="quarantine-vlan">Quarantine VLAN</Label>
                <Input
                  id="quarantine-vlan"
                  value={wizardData.advanced.vlans.quarantineVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'quarantineVlan', e.target.value)}
                  placeholder="999"
                />
              </div>
              <div>
                <Label htmlFor="native-vlan">Native VLAN</Label>
                <Input
                  id="native-vlan"
                  value={wizardData.advanced.vlans.nativeVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'nativeVlan', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="mgmt-vlan">Management VLAN</Label>
                <Input
                  id="mgmt-vlan"
                  value={wizardData.advanced.vlans.managementVlan}
                  onChange={(e) => updateAdvancedData('vlans', 'managementVlan', e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dynamic-vlan"
                  checked={wizardData.advanced.vlans.dynamicVlanAssignment}
                  onCheckedChange={(checked) => updateAdvancedData('vlans', 'dynamicVlanAssignment', checked)}
                />
                <Label htmlFor="dynamic-vlan">Enable Dynamic VLAN Assignment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="network-segmentation"
                  checked={wizardData.scenarios.networkSegmentation}
                  onCheckedChange={(checked) => updateWizardData('scenarios', 'networkSegmentation', checked)}
                />
                <Label htmlFor="network-segmentation">Enable Network Segmentation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="guest-access"
                  checked={wizardData.scenarios.guestAccess}
                  onCheckedChange={(checked) => updateWizardData('scenarios', 'guestAccess', checked)}
                />
                <Label htmlFor="guest-access">Enable Guest Network Access</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              VLAN Overrides & Special Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Custom VLAN Assignments</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Define specific VLAN assignments for special device types or locations
              </p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Device/Location" />
                  <Input placeholder="VLAN ID" />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add VLAN Override
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label>Network Topology Information</Label>
              <Textarea
                placeholder="Describe your network topology, special requirements, or notes for VLAN configuration..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAuthenticationRadiusStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              RADIUS Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primary-radius">Primary RADIUS Server</Label>
              <Input
                id="primary-radius"
                value={wizardData.advanced.radius.primaryServer}
                onChange={(e) => updateAdvancedData('radius', 'primaryServer', e.target.value)}
                placeholder="192.168.1.10"
              />
            </div>
            <div>
              <Label htmlFor="secondary-radius">Secondary RADIUS Server (Optional)</Label>
              <Input
                id="secondary-radius"
                value={wizardData.advanced.radius.secondaryServer}
                onChange={(e) => updateAdvancedData('radius', 'secondaryServer', e.target.value)}
                placeholder="192.168.1.11"
              />
            </div>
            <div>
              <Label htmlFor="radius-secret">Shared Secret</Label>
              <Input
                id="radius-secret"
                type="password"
                value={wizardData.advanced.radius.secret}
                onChange={(e) => updateAdvancedData('radius', 'secret', e.target.value)}
                placeholder="Enter shared secret"
                form="radius-config-form"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="radius-timeout">Timeout (seconds)</Label>
                <Input
                  id="radius-timeout"
                  type="number"
                  value={wizardData.advanced.radius.timeout}
                  onChange={(e) => updateAdvancedData('radius', 'timeout', parseInt(e.target.value))}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label htmlFor="radius-retries">Retries</Label>
                <Input
                  id="radius-retries"
                  type="number"
                  value={wizardData.advanced.radius.retries}
                  onChange={(e) => updateAdvancedData('radius', 'retries', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="load-balancing"
                  checked={wizardData.advanced.radius.loadBalancing}
                  onCheckedChange={(checked) => updateAdvancedData('radius', 'loadBalancing', checked)}
                />
                <Label htmlFor="load-balancing">Enable RADIUS Load Balancing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="coa-enabled"
                  checked={wizardData.advanced.radius.coaEnabled}
                  onCheckedChange={(checked) => updateAdvancedData('radius', 'coaEnabled', checked)}
                />
                <Label htmlFor="coa-enabled">Enable Change of Authorization (CoA)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="radius-accounting"
                  checked={wizardData.advanced.radius.radiusAccountingEnabled}
                  onCheckedChange={(checked) => updateAdvancedData('radius', 'radiusAccountingEnabled', checked)}
                />
                <Label htmlFor="radius-accounting">Enable RADIUS Accounting</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dot1x-priority">802.1X Priority</Label>
              <Select 
                value={wizardData.advanced.authentication.dot1xPriority.toString()} 
                onValueChange={(value) => updateAdvancedData('authentication', 'dot1xPriority', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Highest - Try 802.1X first)</SelectItem>
                  <SelectItem value="2">2 (Try MAB first)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Host Mode</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {hostModes.map((mode) => (
                  <div key={mode.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={mode.id}
                      checked={wizardData.advanced.authentication.hostModes.includes(mode.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateAdvancedData('authentication', 'hostModes', [...wizardData.advanced.authentication.hostModes, mode.id]);
                        } else {
                          updateAdvancedData('authentication', 'hostModes', wizardData.advanced.authentication.hostModes.filter(m => m !== mode.id));
                        }
                      }}
                    />
                    <div>
                      <Label htmlFor={mode.id} className="text-sm">{mode.name}</Label>
                      <p className="text-xs text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max-auth-attempts">Max Auth Attempts</Label>
                <Input
                  id="max-auth-attempts"
                  type="number"
                  value={wizardData.advanced.authentication.maxAuthAttempts}
                  onChange={(e) => updateAdvancedData('authentication', 'maxAuthAttempts', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="reauth-period">Reauth Period (seconds)</Label>
                <Input
                  id="reauth-period"
                  type="number"
                  value={wizardData.advanced.authentication.reauthPeriod}
                  onChange={(e) => updateAdvancedData('authentication', 'reauthPeriod', parseInt(e.target.value))}
                  min="60"
                  max="86400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="inactivity-timeout">Inactivity Timeout (seconds)</Label>
              <Input
                id="inactivity-timeout"
                type="number"
                value={wizardData.advanced.authentication.inactivityTimeout}
                onChange={(e) => updateAdvancedData('authentication', 'inactivityTimeout', parseInt(e.target.value))}
                min="60"
                max="3600"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="mab-fallback"
                  checked={wizardData.advanced.authentication.mabFallback}
                  onCheckedChange={(checked) => updateAdvancedData('authentication', 'mabFallback', checked)}
                />
                <Label htmlFor="mab-fallback">Enable MAB Fallback</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="webauth-fallback"
                  checked={wizardData.advanced.authentication.webAuthFallback}
                  onCheckedChange={(checked) => updateAdvancedData('authentication', 'webAuthFallback', checked)}
                />
                <Label htmlFor="webauth-fallback">Enable WebAuth Fallback</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="concurrent-auth"
                  checked={wizardData.advanced.authentication.concurrentAuthentication}
                  onCheckedChange={(checked) => updateAdvancedData('authentication', 'concurrentAuthentication', checked)}
                />
                <Label htmlFor="concurrent-auth">Enable Concurrent Authentication</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAdvancedSecurityStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Port Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="port-security-enabled"
                checked={wizardData.advanced.portSecurity.enabled}
                onCheckedChange={(checked) => updateAdvancedData('portSecurity', 'enabled', checked)}
              />
              <Label htmlFor="port-security-enabled">Enable Port Security</Label>
            </div>
            
            {wizardData.advanced.portSecurity.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-mac">Maximum MAC Addresses</Label>
                    <Input
                      id="max-mac"
                      type="number"
                      value={wizardData.advanced.portSecurity.maximumMac}
                      onChange={(e) => updateAdvancedData('portSecurity', 'maximumMac', parseInt(e.target.value))}
                      min="1"
                      max="1024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="violation-action">Violation Action</Label>
                    <Select 
                      value={wizardData.advanced.portSecurity.violationAction} 
                      onValueChange={(value) => updateAdvancedData('portSecurity', 'violationAction', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="protect">Protect (Drop packets)</SelectItem>
                        <SelectItem value="restrict">Restrict (Drop + Log)</SelectItem>
                        <SelectItem value="shutdown">Shutdown (Disable port)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aging-time">Aging Time (minutes)</Label>
                    <Input
                      id="aging-time"
                      type="number"
                      value={wizardData.advanced.portSecurity.agingTime}
                      onChange={(e) => updateAdvancedData('portSecurity', 'agingTime', parseInt(e.target.value))}
                      min="0"
                      max="1440"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aging-type">Aging Type</Label>
                    <Select 
                      value={wizardData.advanced.portSecurity.agingType} 
                      onValueChange={(value) => updateAdvancedData('portSecurity', 'agingType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="absolute">Absolute</SelectItem>
                        <SelectItem value="inactivity">Inactivity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sticky-mac"
                    checked={wizardData.advanced.portSecurity.stickyMac}
                    onCheckedChange={(checked) => updateAdvancedData('portSecurity', 'stickyMac', checked)}
                  />
                  <Label htmlFor="sticky-mac">Enable Sticky MAC Learning</Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Advanced Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="device-tracking"
                  checked={wizardData.advanced.advanced.deviceTracking}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'deviceTracking', checked)}
                />
                <Label htmlFor="device-tracking">Enable Device Tracking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="dhcp-snooping"
                  checked={wizardData.advanced.advanced.dhcpSnooping}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'dhcpSnooping', checked)}
                />
                <Label htmlFor="dhcp-snooping">Enable DHCP Snooping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ip-source-guard"
                  checked={wizardData.advanced.advanced.ipSourceGuard}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'ipSourceGuard', checked)}
                />
                <Label htmlFor="ip-source-guard">Enable IP Source Guard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="arp-inspection"
                  checked={wizardData.advanced.advanced.arpInspection}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'arpInspection', checked)}
                />
                <Label htmlFor="arp-inspection">Enable Dynamic ARP Inspection</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="storm-control"
                  checked={wizardData.advanced.advanced.stormControl}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'stormControl', checked)}
                />
                <Label htmlFor="storm-control">Enable Storm Control</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="portfast"
                  checked={wizardData.advanced.advanced.portfast}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'portfast', checked)}
                />
                <Label htmlFor="portfast">Enable PortFast</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bpdu-guard"
                  checked={wizardData.advanced.advanced.bpduGuard}
                  onCheckedChange={(checked) => updateAdvancedData('advanced', 'bpduGuard', checked)}
                />
                <Label htmlFor="bpdu-guard">Enable BPDU Guard</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGenerationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Configuration Generation Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-ai"
                  checked={wizardData.generation.useAI}
                  onCheckedChange={(checked) => updateWizardData('generation', 'useAI', checked)}
                />
                <Label htmlFor="use-ai">Use AI-Enhanced Generation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-comments"
                  checked={wizardData.generation.includeComments}
                  onCheckedChange={(checked) => updateWizardData('generation', 'includeComments', checked)}
                />
                <Label htmlFor="include-comments">Include Detailed Comments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-validation"
                  checked={wizardData.generation.includeValidation}
                  onCheckedChange={(checked) => updateWizardData('generation', 'includeValidation', checked)}
                />
                <Label htmlFor="include-validation">Include Validation Commands</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-troubleshooting"
                  checked={wizardData.generation.includeTroubleshooting}
                  onCheckedChange={(checked) => updateWizardData('generation', 'includeTroubleshooting', checked)}
                />
                <Label htmlFor="include-troubleshooting">Include Troubleshooting Guide</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="config-format">Configuration Format</Label>
              <Select 
                value={wizardData.generation.configFormat} 
                onValueChange={(value) => updateWizardData('generation', 'configFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">Detailed with Comments</SelectItem>
                  <SelectItem value="compact">Compact Production-Ready</SelectItem>
                  <SelectItem value="template">Template with Variables</SelectItem>
                  <SelectItem value="sections">Modular Sections</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <Button 
              onClick={generateConfiguration} 
              disabled={isGenerating || !wizardData.basic.vendor || !wizardData.basic.model}
              size="lg"
              className="w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Generating Configuration...
                </>
              ) : (
                <>
                  <Code className="h-5 w-5 mr-2" />
                  Generate Configuration
                </>
              )}
            </Button>
            {(!wizardData.basic.vendor || !wizardData.basic.model) && (
              <p className="text-sm text-muted-foreground mt-2">
                Please select vendor and model in step 1 to enable generation
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap">{generatedConfig}</pre>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.writeText(generatedConfig)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedConfig], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${wizardData.basic.name || 'config'}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => onSave?.({ 
                ...wizardData, 
                generatedConfig,
                vendor: vendors?.find(v => v.id === wizardData.basic.vendor)?.vendor_name,
                model: vendorModels.find(m => m.id === wizardData.basic.model)?.model_name
              })}>
                <Check className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">DotXer Configuration Wizard</h2>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {calculateProgress()}% Complete
          </Badge>
        </div>
        
        <Progress value={calculateProgress()} className="h-2" />
        
        {/* Step Navigator */}
        <div className="flex items-center justify-between mt-6 overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors min-w-0 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isCompleted 
                    ? 'bg-muted text-muted-foreground'
                    : 'text-muted-foreground'
                }`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          {currentStep === steps.length - 1 ? (
            generatedConfig && (
              <Button onClick={() => onSave?.({ 
                ...wizardData, 
                generatedConfig,
                vendor: vendors?.find(v => v.id === wizardData.basic.vendor)?.vendor_name,
                model: vendorModels.find(m => m.id === wizardData.basic.model)?.model_name
              })}>
                <Check className="h-4 w-4 mr-2" />
                Complete & Save
              </Button>
            )
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneXerConfigWizard;