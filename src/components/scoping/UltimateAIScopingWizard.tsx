import React, { useState, useEffect, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Server, Wifi, Lock, Smartphone, Database, FileCheck,
  Plus, X, ArrowRight, ArrowLeft, Zap, Settings, Monitor, Router,
  Cpu, HardDrive, Printer, Camera, Phone, Tablet, Laptop, FileText,
  Download, Save, Eye, Wand2, BookOpen, Filter, ChevronDown, ChevronRight,
  Cloud, Key, ShieldCheck, Layers, GitBranch, Workflow, Search, Edit,
  Trash2, Copy, Star, TrendingUp, Activity, BarChart3, 
  WifiIcon, Ethernet, ShieldX, UserCheck, CloudIcon
} from 'lucide-react';

import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { usePainPoints } from '@/hooks/usePainPoints';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import { comprehensiveVendorData } from '@/data/comprehensiveVendorData';

// Enhanced vendor selection with models and firmware
interface SelectedVendor {
  vendor: string;
  category: string;
  models: Array<{
    model: string;
    firmware?: string;
    quantity?: number;
    location?: string;
    notes?: string;
  }>;
  satisfaction_rating: number;
  pain_points: string[];
  integration_priority: 'High' | 'Medium' | 'Low';
  replacement_timeline: string;
}

// Comprehensive vendor categories with decision tree logic
const vendorCategories = {
  network_infrastructure: {
    title: "Network Infrastructure",
    icon: Network,
    color: "bg-blue-500",
    subcategories: {
      wired_switching: {
        title: "Wired Switching",
        icon: Ethernet,
        vendors: ["Cisco", "Aruba (HPE)", "Juniper Networks", "Extreme Networks", "FortiSwitch"],
        decision_triggers: {
          "cisco_ecosystem": {
            condition: "existing_cisco_devices > 0",
            suggested_vendors: ["Cisco"],
            pain_points: ["Complex licensing", "High costs", "Vendor lock-in"],
            use_cases: ["802.1X Authentication", "TrustSec Segmentation", "DNA Center Management"]
          },
          "cost_optimization": {
            condition: "budget_constraint == 'tight'",
            suggested_vendors: ["Extreme Networks", "FortiSwitch"],
            pain_points: ["Budget constraints", "ROI concerns"],
            use_cases: ["Basic NAC", "Cost-effective switching"]
          }
        }
      },
      wireless: {
        title: "Wireless Infrastructure", 
        icon: WifiIcon,
        vendors: ["Cisco", "Aruba (HPE)", "Juniper Mist", "Fortinet", "Extreme Networks"],
        decision_triggers: {
          "wireless_first": {
            condition: "wireless_priority == 'high'",
            suggested_vendors: ["Aruba (HPE)", "Juniper Mist"],
            pain_points: ["Poor wireless coverage", "BYOD challenges", "Guest access complexity"],
            use_cases: ["Wireless 802.1X", "Dynamic VLAN Assignment", "Location Services"]
          }
        }
      }
    }
  },
  security_ecosystem: {
    title: "Security Ecosystem",
    icon: Shield,
    color: "bg-red-500",
    subcategories: {
      firewalls: {
        title: "Firewalls",
        icon: ShieldX,
        vendors: ["Fortinet", "Palo Alto Networks", "Cisco", "Check Point", "SonicWall"],
        decision_triggers: {
          "ngfw_requirement": {
            condition: "application_awareness == 'required'",
            suggested_vendors: ["Palo Alto Networks", "Fortinet"],
            pain_points: ["Limited application visibility", "Advanced threat protection"],
            use_cases: ["Application Control", "URL Filtering", "IPS Integration"]
          }
        }
      },
      edr_solutions: {
        title: "EDR Solutions",
        icon: Monitor,
        vendors: ["CrowdStrike", "Microsoft Defender", "SentinelOne", "Carbon Black", "Trend Micro"],
        decision_triggers: {
          "endpoint_security": {
            condition: "security_maturity == 'advanced'",
            suggested_vendors: ["CrowdStrike", "SentinelOne"],
            pain_points: ["Endpoint visibility", "Threat response time", "Compliance reporting"],
            use_cases: ["Threat Hunting", "Automated Response", "Compliance Monitoring"]
          }
        }
      },
      vpn_solutions: {
        title: "VPN Solutions",
        icon: Lock,
        vendors: ["Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "Pulse Secure", "OpenVPN"],
        decision_triggers: {
          "remote_work": {
            condition: "remote_workers > 30",
            suggested_vendors: ["Cisco AnyConnect", "Palo Alto GlobalProtect"],
            pain_points: ["Remote access security", "VPN performance", "User experience"],
            use_cases: ["Zero Trust Access", "Device Compliance", "Conditional Access"]
          }
        }
      }
    }
  },
  identity_access: {
    title: "Identity & Access Management",
    icon: UserCheck,
    color: "bg-green-500",
    subcategories: {
      identity_providers: {
        title: "Identity Providers (IdP)",
        icon: Users,
        vendors: ["Microsoft Azure AD", "Okta", "Ping Identity", "OneLogin", "JumpCloud"],
        decision_triggers: {
          "cloud_first": {
            condition: "cloud_strategy == 'cloud_first'",
            suggested_vendors: ["Microsoft Azure AD", "Okta"],
            pain_points: ["Legacy authentication", "Cloud integration", "User provisioning"],
            use_cases: ["Single Sign-On", "Multi-Factor Authentication", "Conditional Access"]
          }
        }
      },
      mfa_solutions: {
        title: "Multi-Factor Authentication",
        icon: Smartphone,
        vendors: ["Microsoft Authenticator", "Duo Security", "RSA SecurID", "Authy", "YubiKey"],
        decision_triggers: {
          "compliance_requirement": {
            condition: "compliance_frameworks includes 'SOX' OR 'HIPAA'",
            suggested_vendors: ["RSA SecurID", "Duo Security"],
            pain_points: ["Compliance requirements", "User adoption", "Legacy system integration"],
            use_cases: ["Regulatory Compliance", "Risk-based Authentication", "Adaptive MFA"]
          }
        }
      },
      sso_solutions: {
        title: "Single Sign-On",
        icon: Key,
        vendors: ["Microsoft Azure AD", "Okta", "Ping Identity", "OneLogin", "ADFS"],
        decision_triggers: {
          "user_experience": {
            condition: "user_complaints > 20",
            suggested_vendors: ["Okta", "Microsoft Azure AD"],
            pain_points: ["Password fatigue", "Multiple logins", "Help desk tickets"],
            use_cases: ["Seamless Authentication", "Password Elimination", "User Productivity"]
          }
        }
      },
      pki_solutions: {
        title: "PKI Solutions",
        icon: ShieldCheck,
        vendors: ["Microsoft ADCS", "DigiCert", "Entrust", "GlobalSign", "Venafi"],
        decision_triggers: {
          "certificate_management": {
            condition: "certificate_count > 100",
            suggested_vendors: ["Venafi", "DigiCert"],
            pain_points: ["Certificate expiration", "Manual processes", "Security risks"],
            use_cases: ["Certificate Lifecycle", "Automated Enrollment", "Compliance Reporting"]
          }
        }
      }
    }
  },
  cloud_solutions: {
    title: "Cloud Solutions",
    icon: CloudIcon,
    color: "bg-purple-500",
    subcategories: {
      cloud_providers: {
        title: "Cloud Infrastructure",
        icon: Cloud,
        vendors: ["Microsoft Azure", "Amazon AWS", "Google Cloud", "IBM Cloud", "Oracle Cloud"],
        decision_triggers: {
          "hybrid_cloud": {
            condition: "deployment_model == 'hybrid'",
            suggested_vendors: ["Microsoft Azure", "Amazon AWS"],
            pain_points: ["Cloud integration", "Hybrid management", "Data sovereignty"],
            use_cases: ["Hybrid Identity", "Cloud Security", "Workload Migration"]
          }
        }
      },
      cloud_security: {
        title: "Cloud Security",
        icon: ShieldCheck,
        vendors: ["Microsoft Defender for Cloud", "AWS Security Hub", "Google Cloud Security", "Prisma Cloud", "CloudGuard"],
        decision_triggers: {
          "cloud_native": {
            condition: "cloud_workloads > 50",
            suggested_vendors: ["Microsoft Defender for Cloud", "AWS Security Hub"],
            pain_points: ["Cloud visibility", "Compliance monitoring", "Threat detection"],
            use_cases: ["Cloud Security Posture", "Compliance Automation", "Threat Protection"]
          }
        }
      }
    }
  }
};

// Pain points library with categories
const painPointsLibrary = {
  security: [
    { title: "Unauthorized network access", impact: "High", frequency: "Daily" },
    { title: "Lack of device visibility", impact: "High", frequency: "Weekly" },
    { title: "Compliance audit failures", impact: "Critical", frequency: "Quarterly" },
    { title: "Slow incident response", impact: "Medium", frequency: "Weekly" },
    { title: "Manual security processes", impact: "Medium", frequency: "Daily" }
  ],
  operational: [
    { title: "Complex vendor management", impact: "Medium", frequency: "Weekly" },
    { title: "High support costs", impact: "High", frequency: "Monthly" },
    { title: "Inconsistent configurations", impact: "Medium", frequency: "Weekly" },
    { title: "Limited automation", impact: "Medium", frequency: "Daily" },
    { title: "Resource constraints", impact: "High", frequency: "Daily" }
  ],
  user_experience: [
    { title: "Slow authentication", impact: "Medium", frequency: "Daily" },
    { title: "Multiple passwords", impact: "Medium", frequency: "Daily" },
    { title: "Network connectivity issues", impact: "High", frequency: "Weekly" },
    { title: "Guest access complexity", impact: "Low", frequency: "Weekly" },
    { title: "BYOD limitations", impact: "Medium", frequency: "Daily" }
  ],
  compliance: [
    { title: "Audit trail gaps", impact: "High", frequency: "Monthly" },
    { title: "Policy enforcement", impact: "High", frequency: "Weekly" },
    { title: "Data protection", impact: "Critical", frequency: "Daily" },
    { title: "Regulatory reporting", impact: "High", frequency: "Monthly" },
    { title: "Access controls", impact: "High", frequency: "Daily" }
  ]
};

// Use cases library with business value
const useCasesLibrary = {
  core_nac: [
    { name: "802.1X Authentication", value: "High", complexity: "Medium", weeks: 4 },
    { name: "Device Profiling", value: "High", complexity: "Medium", weeks: 3 },
    { name: "Dynamic VLAN Assignment", value: "High", complexity: "Medium", weeks: 2 },
    { name: "Guest Network Access", value: "Medium", complexity: "Low", weeks: 2 },
    { name: "BYOD Policy Enforcement", value: "High", complexity: "High", weeks: 6 }
  ],
  advanced_security: [
    { name: "Zero Trust Network Access", value: "High", complexity: "High", weeks: 12 },
    { name: "Threat Detection & Response", value: "High", complexity: "High", weeks: 8 },
    { name: "Network Segmentation", value: "High", complexity: "High", weeks: 10 },
    { name: "Compliance Automation", value: "Medium", complexity: "Medium", weeks: 6 },
    { name: "Risk-based Access Control", value: "High", complexity: "High", weeks: 8 }
  ],
  integration: [
    { name: "SIEM Integration", value: "Medium", complexity: "Medium", weeks: 4 },
    { name: "ITSM Integration", value: "Medium", complexity: "Low", weeks: 2 },
    { name: "Identity Provider Integration", value: "High", complexity: "Medium", weeks: 3 },
    { name: "Cloud Security Integration", value: "High", complexity: "High", weeks: 6 },
    { name: "API Integrations", value: "Medium", complexity: "Medium", weeks: 4 }
  ]
};

// Comprehensive scoping data structure
interface UltimateScopingData {
  // Session metadata
  session_id: string;
  session_name: string;
  created_at: string;
  last_modified: string;
  completion_percentage: number;
  
  // Phase 1: Business Foundation (30 mins)
  business_foundation: {
    organization: {
      name: string;
      industry: string;
      sub_industry: string;
      company_size: 'SMB' | 'Mid-Market' | 'Enterprise' | 'Global';
      annual_revenue: string;
      locations: Array<{
        name: string;
        type: 'Headquarters' | 'Branch' | 'Remote' | 'Data Center';
        employee_count: number;
        country: string;
        timezone: string;
      }>;
      total_employees: number;
      it_team_size: number;
      security_team_size: number;
    };
    business_drivers: {
      primary_drivers: string[];
      compliance_requirements: string[];
      strategic_initiatives: string[];
      timeline_constraints: string;
      budget_range: string;
      success_metrics: string[];
    };
    stakeholders: Array<{
      name: string;
      role: string;
      department: string;
      influence_level: 'Low' | 'Medium' | 'High' | 'Critical';
      decision_authority: boolean;
      pain_points: string[];
      success_criteria: string[];
    }>;
  };

  // Phase 2: Current Environment Deep Dive (45 mins)
  current_environment: {
    network_infrastructure: {
      wired_vendors: SelectedVendor[];
      wireless_vendors: SelectedVendor[];
      topology_type: 'Flat' | 'Segmented' | 'Zero-Trust' | 'Hybrid';
      management_tools: string[];
      network_monitoring: string[];
    };
    security_ecosystem: {
      firewalls: SelectedVendor[];
      edr_solutions: SelectedVendor[];
      vpn_solutions: SelectedVendor[];
      siem_solutions: SelectedVendor[];
      current_nac: SelectedVendor[];
      security_maturity_score: number;
    };
    identity_access: {
      identity_providers: SelectedVendor[];
      mfa_solutions: SelectedVendor[];
      sso_solutions: SelectedVendor[];
      pki_solutions: SelectedVendor[];
      current_radius: SelectedVendor[];
      current_auth_methods: string[];
      identity_maturity_score: number;
    };
    cloud_solutions: {
      cloud_providers: SelectedVendor[];
      cloud_security: SelectedVendor[];
      cloud_identity: SelectedVendor[];
      hybrid_model: boolean;
      cloud_maturity_score: number;
    };
    device_ecosystem: {
      endpoints: {
        windows_devices: { count: number; versions: Record<string, number> };
        mac_devices: { count: number; versions: Record<string, number> };
        linux_devices: { count: number; distributions: Record<string, number> };
        mobile_devices: { count: number; platforms: Record<string, number> };
        tablets: { count: number; platforms: Record<string, number> };
      };
      iot_devices: {
        printers: { count: number; brands: Record<string, number> };
        cameras: { count: number; brands: Record<string, number> };
        voip: { count: number; brands: Record<string, number> };
        building_automation: { count: number; brands: Record<string, number> };
        medical_devices: { count: number; brands: Record<string, number> };
        industrial: { count: number; brands: Record<string, number> };
        custom_devices: Array<{
          category: string;
          count: number;
          description: string;
          security_requirements: string[];
        }>;
      };
      byod_policy: 'Prohibited' | 'Limited' | 'Encouraged' | 'Mandatory';
      guest_requirements: string[];
    };
  };

  // Phase 3: AI-Driven Analysis (15 mins)
  ai_analysis: {
    identified_pain_points: Array<{
      id: string;
      category: 'Security' | 'Operational' | 'Compliance' | 'Performance' | 'Cost' | 'User Experience';
      title: string;
      description: string;
      severity: 'Low' | 'Medium' | 'High' | 'Critical';
      frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
      business_impact: string;
      affected_stakeholders: string[];
      current_workarounds: string[];
      estimated_annual_cost: number;
      ai_confidence: number;
    }>;
    decision_tree_recommendations: Array<{
      trigger_condition: string;
      recommended_use_cases: string[];
      recommended_vendors: string[];
      recommended_requirements: string[];
      business_justification: string;
    }>;
    ai_suggested_requirements: Array<{
      id: string;
      title: string;
      description: string;
      priority: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
      category: string;
      business_value: string;
      technical_complexity: 'Low' | 'Medium' | 'High';
      estimated_effort: string;
      dependencies: string[];
    }>;
  };

  // Phase 4: Solution Architecture (20 mins)
  solution_architecture: {
    deployment_model: {
      architecture_type: 'On-Premise' | 'Cloud' | 'Hybrid';
      nac_deployment: 'Centralized' | 'Distributed' | 'Cloud-Native';
      redundancy_requirements: string[];
      scalability_requirements: string[];
      performance_requirements: {
        max_endpoints: number;
        authentication_time_ms: number;
        uptime_requirement: number;
      };
    };
    recommended_vendors: Array<{
      category: string;
      primary_recommendation: {
        vendor: string;
        models: Array<{
          model: string;
          firmware: string;
          quantity: number;
          location: string;
        }>;
        justification: string;
        integration_complexity: 'Low' | 'Medium' | 'High';
        estimated_cost: number;
        implementation_weeks: number;
      };
      alternatives: Array<{
        vendor: string;
        pros: string[];
        cons: string[];
        cost_difference: string;
      }>;
    }>;
    use_case_mapping: Array<{
      use_case_id: string;
      use_case_name: string;
      business_value: string;
      implementation_priority: number;
      required_vendors: string[];
      technical_requirements: string[];
      success_metrics: string[];
      estimated_roi: number;
    }>;
  };

  // Phase 5: Implementation Planning (10 mins)
  implementation_plan: {
    project_roadmap: Array<{
      phase_name: string;
      phase_order: number;
      duration_weeks: number;
      key_milestones: Array<{
        milestone: string;
        week: number;
        deliverables: string[];
        success_criteria: string[];
      }>;
      resource_requirements: Array<{
        role: string;
        time_allocation: string;
        required_skills: string[];
        internal_external: 'Internal' | 'External' | 'Hybrid';
      }>;
      dependencies: string[];
      risks: Array<{
        risk: string;
        probability: 'Low' | 'Medium' | 'High';
        impact: 'Low' | 'Medium' | 'High';
        mitigation: string;
      }>;
    }>;
    budget_estimation: {
      software_licensing: number;
      hardware_costs: number;
      professional_services: number;
      internal_resources: number;
      training_costs: number;
      ongoing_maintenance: number;
      total_investment: number;
      three_year_tco: number;
    };
    success_factors: {
      critical_success_factors: string[];
      key_risks: string[];
      mitigation_strategies: string[];
      quick_wins: string[];
      long_term_benefits: string[];
    };
  };
}

interface UltimateAIScopingWizardProps {
  existingSession?: UltimateScopingData;
  onComplete?: (sessionId: string, scopingData: UltimateScopingData) => void;
  onSave?: (sessionId: string, scopingData: UltimateScopingData) => void;
  onCancel?: () => void;
}

const UltimateAIScopingWizard: React.FC<UltimateAIScopingWizardProps> = ({
  existingSession,
  onComplete,
  onSave,
  onCancel
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [showVendorSelector, setShowVendorSelector] = useState(false);
  const [selectedVendorCategory, setSelectedVendorCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDecisionTree, setShowDecisionTree] = useState(false);

  // Initialize scoping data with proper defaults
  const [scopingData, setScopingData] = useState<UltimateScopingData>(
    existingSession || {
      session_id: `ultimate_${Date.now()}`,
      session_name: 'New Ultimate Scoping Session',
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      completion_percentage: 0,
      business_foundation: {
        organization: {
          name: '',
          industry: '',
          sub_industry: '',
          company_size: 'Mid-Market',
          annual_revenue: '',
          locations: [],
          total_employees: 0,
          it_team_size: 0,
          security_team_size: 0
        },
        business_drivers: {
          primary_drivers: [],
          compliance_requirements: [],
          strategic_initiatives: [],
          timeline_constraints: '',
          budget_range: '',
          success_metrics: []
        },
        stakeholders: []
      },
      current_environment: {
        network_infrastructure: {
          wired_vendors: [],
          wireless_vendors: [],
          topology_type: 'Segmented',
          management_tools: [],
          network_monitoring: []
        },
        security_ecosystem: {
          firewalls: [],
          edr_solutions: [],
          vpn_solutions: [],
          siem_solutions: [],
          current_nac: [],
          security_maturity_score: 0
        },
        identity_access: {
          identity_providers: [],
          mfa_solutions: [],
          sso_solutions: [],
          pki_solutions: [],
          current_radius: [],
          current_auth_methods: [],
          identity_maturity_score: 0
        },
        cloud_solutions: {
          cloud_providers: [],
          cloud_security: [],
          cloud_identity: [],
          hybrid_model: false,
          cloud_maturity_score: 0
        },
        device_ecosystem: {
          endpoints: {
            windows_devices: { count: 0, versions: {} },
            mac_devices: { count: 0, versions: {} },
            linux_devices: { count: 0, distributions: {} },
            mobile_devices: { count: 0, platforms: {} },
            tablets: { count: 0, platforms: {} }
          },
          iot_devices: {
            printers: { count: 0, brands: {} },
            cameras: { count: 0, brands: {} },
            voip: { count: 0, brands: {} },
            building_automation: { count: 0, brands: {} },
            medical_devices: { count: 0, brands: {} },
            industrial: { count: 0, brands: {} },
            custom_devices: []
          },
          byod_policy: 'Limited',
          guest_requirements: []
        }
      },
      ai_analysis: {
        identified_pain_points: [],
        decision_tree_recommendations: [],
        ai_suggested_requirements: []
      },
      solution_architecture: {
        deployment_model: {
          architecture_type: 'Hybrid',
          nac_deployment: 'Centralized',
          redundancy_requirements: [],
          scalability_requirements: [],
          performance_requirements: {
            max_endpoints: 1000,
            authentication_time_ms: 30000,
            uptime_requirement: 99.5
          }
        },
        recommended_vendors: [],
        use_case_mapping: []
      },
      implementation_plan: {
        project_roadmap: [],
        budget_estimation: {
          software_licensing: 0,
          hardware_costs: 0,
          professional_services: 0,
          internal_resources: 0,
          training_costs: 0,
          ongoing_maintenance: 0,
          total_investment: 0,
          three_year_tco: 0
        },
        success_factors: {
          critical_success_factors: [],
          key_risks: [],
          mitigation_strategies: [],
          quick_wins: [],
          long_term_benefits: []
        }
      }
    }
  );

  const { data: enhancedVendors = [] } = useEnhancedVendors();
  const { data: useCasesData = [] } = useUseCases();
  const { data: requirementsData = [] } = useRequirements();
  const { data: painPointsData = [] } = usePainPoints();
  const { generateCompletion } = useAI();
  const { toast } = useToast();

  // Define the phases with realistic time estimates
  const phases = [
    {
      id: 0,
      title: "Business Foundation",
      icon: Building2,
      description: "Organization profile, stakeholders, and business drivers",
      color: "bg-blue-500",
      duration: "30 mins",
      steps: [
        { id: 0, title: "Organization Profile", description: "Company details and structure" },
        { id: 1, title: "Business Drivers", description: "What's driving this initiative" },
        { id: 2, title: "Stakeholder Analysis", description: "Key people and decision makers" }
      ]
    },
    {
      id: 1,
      title: "Environment Assessment",
      icon: Network,
      description: "Comprehensive current environment analysis",
      color: "bg-green-500",
      duration: "45 mins",
      steps: [
        { id: 0, title: "Network Infrastructure", description: "Wired and wireless ecosystem" },
        { id: 1, title: "Security & Identity", description: "Current security stack" },
        { id: 2, title: "Cloud & Devices", description: "Cloud solutions and device landscape" }
      ]
    },
    {
      id: 2,
      title: "AI-Driven Analysis",
      icon: Brain,
      description: "Intelligent pain point identification and decision tree",
      color: "bg-purple-500",
      duration: "15 mins",
      steps: [
        { id: 0, title: "Pain Point Discovery", description: "AI identifies key challenges" },
        { id: 1, title: "Decision Tree Logic", description: "Smart recommendations engine" },
        { id: 2, title: "Requirements Generation", description: "AI-suggested requirements" }
      ]
    },
    {
      id: 3,
      title: "Solution Architecture",
      icon: Target,
      description: "Vendor selection and architectural recommendations",
      color: "bg-orange-500",
      duration: "20 mins",
      steps: [
        { id: 0, title: "Deployment Model", description: "Architecture and scale planning" },
        { id: 1, title: "Vendor Selection", description: "Primary and alternative vendors" },
        { id: 2, title: "Use Case Mapping", description: "Business value alignment" }
      ]
    },
    {
      id: 4,
      title: "Implementation Planning",
      icon: Clock,
      description: "Roadmap, budget, and success factors",
      color: "bg-red-500",
      duration: "10 mins",
      steps: [
        { id: 0, title: "Project Roadmap", description: "Phased implementation plan" },
        { id: 1, title: "Budget Estimation", description: "Cost analysis and ROI" },
        { id: 2, title: "Success Factors", description: "Critical factors and risks" }
      ]
    }
  ];

  // Auto-save functionality
  const autoSave = useCallback(() => {
    const updatedData = {
      ...scopingData,
      last_modified: new Date().toISOString(),
      completion_percentage: Math.round(((currentPhase * 3 + currentStep + 1) / 15) * 100)
    };
    
    setScopingData(updatedData);
    
    if (onSave) {
      onSave(updatedData.session_id, updatedData);
    }
  }, [scopingData, currentPhase, currentStep, onSave]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // AI-driven decision tree logic
  const runDecisionTree = useCallback((environmentData: any) => {
    const recommendations = [];
    
    // Check for Cisco ecosystem
    const ciscoDevices = environmentData.network_infrastructure.wired_vendors
      .filter((v: any) => v.vendor.toLowerCase().includes('cisco')).length;
    
    if (ciscoDevices > 0) {
      recommendations.push({
        trigger_condition: "Existing Cisco infrastructure detected",
        recommended_use_cases: ["802.1X Authentication", "TrustSec Segmentation", "DNA Center Integration"],
        recommended_vendors: ["Cisco ISE", "Cisco DNA Center"],
        recommended_requirements: ["Cisco ecosystem integration", "TrustSec compatibility"],
        business_justification: "Leverage existing Cisco investment and expertise"
      });
    }

    // Check for wireless-first approach
    const wirelessVendors = environmentData.network_infrastructure.wireless_vendors.length;
    if (wirelessVendors > 0) {
      recommendations.push({
        trigger_condition: "Wireless infrastructure present",
        recommended_use_cases: ["Wireless 802.1X", "Dynamic VLAN Assignment", "Guest Access"],
        recommended_vendors: ["Aruba ClearPass", "Cisco ISE"],
        recommended_requirements: ["Wireless controller integration", "Guest portal"],
        business_justification: "Secure wireless access for BYOD and guest users"
      });
    }

    // Check for cloud adoption
    if (environmentData.cloud_solutions.cloud_providers.length > 0) {
      recommendations.push({
        trigger_condition: "Cloud infrastructure detected",
        recommended_use_cases: ["Cloud Identity Integration", "Hybrid Authentication"],
        recommended_vendors: ["Microsoft Azure AD", "Okta"],
        recommended_requirements: ["Cloud identity sync", "Hybrid deployment"],
        business_justification: "Seamless cloud and on-premise integration"
      });
    }

    return recommendations;
  }, []);

  // AI pain point identification
  const identifyPainPoints = useCallback((organizationData: any, environmentData: any) => {
    const painPoints = [];
    
    // Security pain points
    if (environmentData.security_ecosystem.current_nac.length === 0) {
      painPoints.push({
        id: 'no_nac',
        category: 'Security' as const,
        title: 'No Network Access Control',
        description: 'Organization lacks network access control solution',
        severity: 'Critical' as const,
        frequency: 'Daily' as const,
        business_impact: 'Unauthorized access risk, compliance gaps',
        affected_stakeholders: ['Security Team', 'IT Team', 'Compliance'],
        current_workarounds: ['Manual monitoring', 'Basic firewall rules'],
        estimated_annual_cost: 100000,
        ai_confidence: 0.95
      });
    }

    // Operational pain points
    if (environmentData.network_infrastructure.wired_vendors.length > 3) {
      painPoints.push({
        id: 'vendor_complexity',
        category: 'Operational' as const,
        title: 'Multiple Vendor Complexity',
        description: 'Managing multiple network vendors increases operational overhead',
        severity: 'Medium' as const,
        frequency: 'Weekly' as const,
        business_impact: 'Increased support costs, configuration drift',
        affected_stakeholders: ['IT Team', 'Network Team'],
        current_workarounds: ['Vendor-specific training', 'Multiple support contracts'],
        estimated_annual_cost: 50000,
        ai_confidence: 0.80
      });
    }

    // Compliance pain points
    if (organizationData.business_drivers.compliance_requirements.length > 0) {
      painPoints.push({
        id: 'compliance_gaps',
        category: 'Compliance' as const,
        title: 'Compliance Audit Challenges',
        description: 'Difficulty demonstrating network access compliance',
        severity: 'High' as const,
        frequency: 'Quarterly' as const,
        business_impact: 'Audit failures, regulatory fines',
        affected_stakeholders: ['Compliance', 'Security Team', 'Management'],
        current_workarounds: ['Manual reporting', 'Spreadsheet tracking'],
        estimated_annual_cost: 75000,
        ai_confidence: 0.85
      });
    }

    return painPoints;
  }, []);

  // Enhanced vendor selection with models and firmware
  const VendorSelectionDialog = ({ category, onSelect, onClose }: any) => {
    const [selectedVendor, setSelectedVendor] = useState('');
    const [selectedModels, setSelectedModels] = useState<any[]>([]);
    const [satisfactionRating, setSatisfactionRating] = useState(3);
    const [painPoints, setPainPoints] = useState<string[]>([]);
    const [integrationPriority, setIntegrationPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [replacementTimeline, setReplacementTimeline] = useState('');

    const categoryVendors = vendorCategories[category as keyof typeof vendorCategories]?.subcategories || {};
    const availableVendors = Object.values(categoryVendors).flatMap((sub: any) => sub.vendors || []);

    const handleAddModel = () => {
      setSelectedModels([...selectedModels, { model: '', firmware: '', quantity: 1, location: '', notes: '' }]);
    };

    const handleModelChange = (index: number, field: string, value: any) => {
      const updated = [...selectedModels];
      updated[index] = { ...updated[index], [field]: value };
      setSelectedModels(updated);
    };

    const handleSubmit = () => {
      if (!selectedVendor) return;

      const vendorData: SelectedVendor = {
        vendor: selectedVendor,
        category,
        models: selectedModels,
        satisfaction_rating: satisfactionRating,
        pain_points: painPoints,
        integration_priority: integrationPriority,
        replacement_timeline: replacementTimeline
      };

      onSelect(vendorData);
      onClose();
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select {category} Vendor</DialogTitle>
            <DialogDescription>
              Choose vendor and configure models with firmware versions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vendor Selection */}
            <div>
              <Label>Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor..." />
                </SelectTrigger>
                <SelectContent>
                  {availableVendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Models and Firmware */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Models & Firmware</Label>
                <Button onClick={handleAddModel} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>

              {selectedModels.map((model, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Model</Label>
                      <Input
                        value={model.model}
                        onChange={(e) => handleModelChange(index, 'model', e.target.value)}
                        placeholder="e.g., Catalyst 9300-24T"
                      />
                    </div>
                    <div>
                      <Label>Firmware</Label>
                      <Input
                        value={model.firmware}
                        onChange={(e) => handleModelChange(index, 'firmware', e.target.value)}
                        placeholder="e.g., 17.15.01"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={model.quantity}
                        onChange={(e) => handleModelChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={model.location}
                        onChange={(e) => handleModelChange(index, 'location', e.target.value)}
                        placeholder="e.g., Main Office"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Notes</Label>
                    <Textarea
                      value={model.notes}
                      onChange={(e) => handleModelChange(index, 'notes', e.target.value)}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Satisfaction Rating */}
            <div>
              <Label>Satisfaction Rating (1-5)</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={satisfactionRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSatisfactionRating(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <Label>Pain Points</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {painPointsLibrary.operational.map((point) => (
                  <div key={point.title} className="flex items-center space-x-2">
                    <Checkbox
                      checked={painPoints.includes(point.title)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPainPoints([...painPoints, point.title]);
                        } else {
                          setPainPoints(painPoints.filter(p => p !== point.title));
                        }
                      }}
                    />
                    <label className="text-sm">{point.title}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Priority */}
            <div>
              <Label>Integration Priority</Label>
              <Select value={integrationPriority} onValueChange={setIntegrationPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Replacement Timeline */}
            <div>
              <Label>Replacement Timeline</Label>
              <Select value={replacementTimeline} onValueChange={setReplacementTimeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-6 months">0-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                  <SelectItem value="2+ years">2+ years</SelectItem>
                  <SelectItem value="No plans">No replacement plans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!selectedVendor}>
              Add Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Phase 1: Business Foundation
  const renderBusinessFoundation = () => {
    switch (currentStep) {
      case 0: // Organization Profile
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={scopingData.business_foundation.organization.name}
                  onChange={(e) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        name: e.target.value
                      }
                    }
                  })}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={scopingData.business_foundation.organization.industry}
                  onValueChange={(value) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        industry: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Energy">Energy & Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company-size">Company Size *</Label>
                <Select
                  value={scopingData.business_foundation.organization.company_size}
                  onValueChange={(value: 'SMB' | 'Mid-Market' | 'Enterprise' | 'Global') => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        company_size: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMB">SMB (< 500 employees)</SelectItem>
                    <SelectItem value="Mid-Market">Mid-Market (500-5K employees)</SelectItem>
                    <SelectItem value="Enterprise">Enterprise (5K-50K employees)</SelectItem>
                    <SelectItem value="Global">Global (50K+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="total-employees">Total Employees *</Label>
                <Input
                  id="total-employees"
                  type="number"
                  value={scopingData.business_foundation.organization.total_employees}
                  onChange={(e) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        total_employees: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  placeholder="Number of employees"
                />
              </div>
              <div>
                <Label htmlFor="it-team-size">IT Team Size</Label>
                <Input
                  id="it-team-size"
                  type="number"
                  value={scopingData.business_foundation.organization.it_team_size}
                  onChange={(e) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        it_team_size: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  placeholder="IT team size"
                />
              </div>
              <div>
                <Label htmlFor="security-team-size">Security Team Size</Label>
                <Input
                  id="security-team-size"
                  type="number"
                  value={scopingData.business_foundation.organization.security_team_size}
                  onChange={(e) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      organization: {
                        ...scopingData.business_foundation.organization,
                        security_team_size: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                  placeholder="Security team size"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Business Drivers
        return (
          <div className="space-y-6">
            <div>
              <Label>Primary Business Drivers *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  'Security Enhancement',
                  'Compliance Requirements',
                  'Digital Transformation',
                  'Cost Reduction',
                  'Operational Efficiency',
                  'Remote Work Support',
                  'Zero Trust Initiative',
                  'Cloud Migration',
                  'BYOD Enablement',
                  'IoT Security'
                ].map((driver) => (
                  <div key={driver} className="flex items-center space-x-2">
                    <Checkbox
                      checked={scopingData.business_foundation.business_drivers.primary_drivers.includes(driver)}
                      onCheckedChange={(checked) => {
                        const drivers = scopingData.business_foundation.business_drivers.primary_drivers;
                        if (checked) {
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              business_drivers: {
                                ...scopingData.business_foundation.business_drivers,
                                primary_drivers: [...drivers, driver]
                              }
                            }
                          });
                        } else {
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              business_drivers: {
                                ...scopingData.business_foundation.business_drivers,
                                primary_drivers: drivers.filter(d => d !== driver)
                              }
                            }
                          });
                        }
                      }}
                    />
                    <label className="text-sm">{driver}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Compliance Requirements</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  'HIPAA',
                  'PCI DSS',
                  'SOX',
                  'GDPR',
                  'NIST',
                  'ISO 27001',
                  'FISMA',
                  'SOC 2',
                  'NERC CIP',
                  'Custom Framework'
                ].map((compliance) => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <Checkbox
                      checked={scopingData.business_foundation.business_drivers.compliance_requirements.includes(compliance)}
                      onCheckedChange={(checked) => {
                        const requirements = scopingData.business_foundation.business_drivers.compliance_requirements;
                        if (checked) {
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              business_drivers: {
                                ...scopingData.business_foundation.business_drivers,
                                compliance_requirements: [...requirements, compliance]
                              }
                            }
                          });
                        } else {
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              business_drivers: {
                                ...scopingData.business_foundation.business_drivers,
                                compliance_requirements: requirements.filter(r => r !== compliance)
                              }
                            }
                          });
                        }
                      }}
                    />
                    <label className="text-sm">{compliance}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select
                  value={scopingData.business_foundation.business_drivers.timeline_constraints}
                  onValueChange={(value) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      business_drivers: {
                        ...scopingData.business_foundation.business_drivers,
                        timeline_constraints: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12-18 months">12-18 months</SelectItem>
                    <SelectItem value="18+ months">18+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select
                  value={scopingData.business_foundation.business_drivers.budget_range}
                  onValueChange={(value) => setScopingData({
                    ...scopingData,
                    business_foundation: {
                      ...scopingData.business_foundation,
                      business_drivers: {
                        ...scopingData.business_foundation.business_drivers,
                        budget_range: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< $100K">< $100K</SelectItem>
                    <SelectItem value="$100K - $500K">$100K - $500K</SelectItem>
                    <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                    <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                    <SelectItem value="$5M+">$5M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2: // Stakeholder Analysis
        return (
          <div className="space-y-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Identifying key stakeholders ensures project success. Include decision makers, influencers, and end users.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Key Stakeholders</Label>
                <Button
                  onClick={() => {
                    const newStakeholder = {
                      name: '',
                      role: '',
                      department: '',
                      influence_level: 'Medium' as const,
                      decision_authority: false,
                      pain_points: [],
                      success_criteria: []
                    };
                    setScopingData({
                      ...scopingData,
                      business_foundation: {
                        ...scopingData.business_foundation,
                        stakeholders: [...scopingData.business_foundation.stakeholders, newStakeholder]
                      }
                    });
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stakeholder
                </Button>
              </div>

              {scopingData.business_foundation.stakeholders.map((stakeholder, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={stakeholder.name}
                        onChange={(e) => {
                          const updated = [...scopingData.business_foundation.stakeholders];
                          updated[index] = { ...updated[index], name: e.target.value };
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              stakeholders: updated
                            }
                          });
                        }}
                        placeholder="Stakeholder name"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={stakeholder.role}
                        onChange={(e) => {
                          const updated = [...scopingData.business_foundation.stakeholders];
                          updated[index] = { ...updated[index], role: e.target.value };
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              stakeholders: updated
                            }
                          });
                        }}
                        placeholder="e.g., CISO, IT Director"
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select
                        value={stakeholder.department}
                        onValueChange={(value) => {
                          const updated = [...scopingData.business_foundation.stakeholders];
                          updated[index] = { ...updated[index], department: value };
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              stakeholders: updated
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Influence Level</Label>
                      <Select
                        value={stakeholder.influence_level}
                        onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => {
                          const updated = [...scopingData.business_foundation.stakeholders];
                          updated[index] = { ...updated[index], influence_level: value };
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              stakeholders: updated
                            }
                          });
                        }}
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
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        checked={stakeholder.decision_authority}
                        onCheckedChange={(checked) => {
                          const updated = [...scopingData.business_foundation.stakeholders];
                          updated[index] = { ...updated[index], decision_authority: checked as boolean };
                          setScopingData({
                            ...scopingData,
                            business_foundation: {
                              ...scopingData.business_foundation,
                              stakeholders: updated
                            }
                          });
                        }}
                      />
                      <label className="text-sm">Decision Authority</label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = scopingData.business_foundation.stakeholders.filter((_, i) => i !== index);
                        setScopingData({
                          ...scopingData,
                          business_foundation: {
                            ...scopingData.business_foundation,
                            stakeholders: updated
                          }
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Phase 2: Environment Assessment
  const renderEnvironmentAssessment = () => {
    switch (currentStep) {
      case 0: // Network Infrastructure
        return (
          <div className="space-y-6">
            <Tabs defaultValue="wired" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wired">Wired Infrastructure</TabsTrigger>
                <TabsTrigger value="wireless">Wireless Infrastructure</TabsTrigger>
                <TabsTrigger value="topology">Network Topology</TabsTrigger>
              </TabsList>

              <TabsContent value="wired" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Wired Network Vendors</Label>
                  <Button
                    onClick={() => {
                      setSelectedVendorCategory('wired_switching');
                      setShowVendorSelector(true);
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wired Vendor
                  </Button>
                </div>

                {scopingData.current_environment.network_infrastructure.wired_vendors.map((vendor, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Ethernet className="h-5 w-5" />
                        <h3 className="font-semibold">{vendor.vendor}</h3>
                        <Badge variant={vendor.satisfaction_rating >= 4 ? "default" : vendor.satisfaction_rating >= 3 ? "secondary" : "destructive"}>
                          {vendor.satisfaction_rating}/5 ⭐
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = scopingData.current_environment.network_infrastructure.wired_vendors
                            .filter((_, i) => i !== index);
                          setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              network_infrastructure: {
                                ...scopingData.current_environment.network_infrastructure,
                                wired_vendors: updated
                              }
                            }
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {vendor.models.length > 0 && (
                      <div className="space-y-2">
                        <Label>Models & Firmware</Label>
                        {vendor.models.map((model, modelIndex) => (
                          <div key={modelIndex} className="grid grid-cols-4 gap-2 text-sm bg-muted p-2 rounded">
                            <div><strong>Model:</strong> {model.model}</div>
                            <div><strong>Firmware:</strong> {model.firmware}</div>
                            <div><strong>Qty:</strong> {model.quantity}</div>
                            <div><strong>Location:</strong> {model.location}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {vendor.pain_points.length > 0 && (
                      <div className="mt-4">
                        <Label>Pain Points</Label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vendor.pain_points.map((point, pointIndex) => (
                            <Badge key={pointIndex} variant="outline" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div><strong>Priority:</strong> {vendor.integration_priority}</div>
                      <div><strong>Timeline:</strong> {vendor.replacement_timeline}</div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="wireless" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Wireless Network Vendors</Label>
                  <Button
                    onClick={() => {
                      setSelectedVendorCategory('wireless');
                      setShowVendorSelector(true);
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wireless Vendor
                  </Button>
                </div>

                {scopingData.current_environment.network_infrastructure.wireless_vendors.map((vendor, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <WifiIcon className="h-5 w-5" />
                        <h3 className="font-semibold">{vendor.vendor}</h3>
                        <Badge variant={vendor.satisfaction_rating >= 4 ? "default" : vendor.satisfaction_rating >= 3 ? "secondary" : "destructive"}>
                          {vendor.satisfaction_rating}/5 ⭐
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = scopingData.current_environment.network_infrastructure.wireless_vendors
                            .filter((_, i) => i !== index);
                          setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              network_infrastructure: {
                                ...scopingData.current_environment.network_infrastructure,
                                wireless_vendors: updated
                              }
                            }
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {vendor.models.length > 0 && (
                      <div className="space-y-2">
                        <Label>Models & Firmware</Label>
                        {vendor.models.map((model, modelIndex) => (
                          <div key={modelIndex} className="grid grid-cols-4 gap-2 text-sm bg-muted p-2 rounded">
                            <div><strong>Model:</strong> {model.model}</div>
                            <div><strong>Firmware:</strong> {model.firmware}</div>
                            <div><strong>Qty:</strong> {model.quantity}</div>
                            <div><strong>Location:</strong> {model.location}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {vendor.pain_points.length > 0 && (
                      <div className="mt-4">
                        <Label>Pain Points</Label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vendor.pain_points.map((point, pointIndex) => (
                            <Badge key={pointIndex} variant="outline" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div><strong>Priority:</strong> {vendor.integration_priority}</div>
                      <div><strong>Timeline:</strong> {vendor.replacement_timeline}</div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="topology" className="space-y-4">
                <div>
                  <Label>Network Topology Type</Label>
                  <Select
                    value={scopingData.current_environment.network_infrastructure.topology_type}
                    onValueChange={(value: 'Flat' | 'Segmented' | 'Zero-Trust' | 'Hybrid') => setScopingData({
                      ...scopingData,
                      current_environment: {
                        ...scopingData.current_environment,
                        network_infrastructure: {
                          ...scopingData.current_environment.network_infrastructure,
                          topology_type: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat Network</SelectItem>
                      <SelectItem value="Segmented">Segmented Network</SelectItem>
                      <SelectItem value="Zero-Trust">Zero Trust Architecture</SelectItem>
                      <SelectItem value="Hybrid">Hybrid Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Network Management Tools</Label>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                      'Cisco DNA Center',
                      'Aruba Central',
                      'Juniper Mist',
                      'SolarWinds',
                      'PRTG',
                      'ManageEngine',
                      'Custom Solution',
                      'None'
                    ].map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          checked={scopingData.current_environment.network_infrastructure.management_tools.includes(tool)}
                          onCheckedChange={(checked) => {
                            const tools = scopingData.current_environment.network_infrastructure.management_tools;
                            if (checked) {
                              setScopingData({
                                ...scopingData,
                                current_environment: {
                                  ...scopingData.current_environment,
                                  network_infrastructure: {
                                    ...scopingData.current_environment.network_infrastructure,
                                    management_tools: [...tools, tool]
                                  }
                                }
                              });
                            } else {
                              setScopingData({
                                ...scopingData,
                                current_environment: {
                                  ...scopingData.current_environment,
                                  network_infrastructure: {
                                    ...scopingData.current_environment.network_infrastructure,
                                    management_tools: tools.filter(t => t !== tool)
                                  }
                                }
                              });
                            }
                          }}
                        />
                        <label className="text-sm">{tool}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 1: // Security & Identity
        return (
          <div className="space-y-6">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="security">Security Ecosystem</TabsTrigger>
                <TabsTrigger value="identity">Identity & Access</TabsTrigger>
                <TabsTrigger value="maturity">Maturity Assessment</TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-6">
                {/* Firewalls */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <ShieldX className="h-4 w-4" />
                      Firewalls
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('firewalls');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Firewall
                    </Button>
                  </div>

                  {scopingData.current_environment.security_ecosystem.firewalls.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.security_ecosystem.firewalls
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                security_ecosystem: {
                                  ...scopingData.current_environment.security_ecosystem,
                                  firewalls: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {vendor.models.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Models: {vendor.models.map(m => m.model).join(', ')}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* EDR Solutions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      EDR Solutions
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('edr_solutions');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add EDR
                    </Button>
                  </div>

                  {scopingData.current_environment.security_ecosystem.edr_solutions.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.security_ecosystem.edr_solutions
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                security_ecosystem: {
                                  ...scopingData.current_environment.security_ecosystem,
                                  edr_solutions: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* VPN Solutions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      VPN Solutions
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('vpn_solutions');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add VPN
                    </Button>
                  </div>

                  {scopingData.current_environment.security_ecosystem.vpn_solutions.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.security_ecosystem.vpn_solutions
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                security_ecosystem: {
                                  ...scopingData.current_environment.security_ecosystem,
                                  vpn_solutions: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Current NAC */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Current NAC Solution
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('current_nac');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add NAC
                    </Button>
                  </div>

                  {scopingData.current_environment.security_ecosystem.current_nac.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.security_ecosystem.current_nac
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                security_ecosystem: {
                                  ...scopingData.current_environment.security_ecosystem,
                                  current_nac: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {scopingData.current_environment.security_ecosystem.current_nac.length === 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No current NAC solution detected. This represents a security gap that Portnox can address.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="identity" className="space-y-6">
                {/* Identity Providers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Identity Providers
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('identity_providers');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add IdP
                    </Button>
                  </div>

                  {scopingData.current_environment.identity_access.identity_providers.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.identity_access.identity_providers
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                identity_access: {
                                  ...scopingData.current_environment.identity_access,
                                  identity_providers: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* MFA Solutions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      MFA Solutions
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('mfa_solutions');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add MFA
                    </Button>
                  </div>

                  {scopingData.current_environment.identity_access.mfa_solutions.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.identity_access.mfa_solutions
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                identity_access: {
                                  ...scopingData.current_environment.identity_access,
                                  mfa_solutions: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* SSO Solutions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      SSO Solutions
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('sso_solutions');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add SSO
                    </Button>
                  </div>

                  {scopingData.current_environment.identity_access.sso_solutions.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.identity_access.sso_solutions
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                identity_access: {
                                  ...scopingData.current_environment.identity_access,
                                  sso_solutions: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="maturity" className="space-y-6">
                <div>
                  <Label>Security Maturity Score (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scopingData.current_environment.security_ecosystem.security_maturity_score}
                      onChange={(e) => setScopingData({
                        ...scopingData,
                        current_environment: {
                          ...scopingData.current_environment,
                          security_ecosystem: {
                            ...scopingData.current_environment.security_ecosystem,
                            security_maturity_score: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="flex-1"
                    />
                    <Badge variant="outline">
                      {scopingData.current_environment.security_ecosystem.security_maturity_score}/10
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Identity Maturity Score (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scopingData.current_environment.identity_access.identity_maturity_score}
                      onChange={(e) => setScopingData({
                        ...scopingData,
                        current_environment: {
                          ...scopingData.current_environment,
                          identity_access: {
                            ...scopingData.current_environment.identity_access,
                            identity_maturity_score: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="flex-1"
                    />
                    <Badge variant="outline">
                      {scopingData.current_environment.identity_access.identity_maturity_score}/10
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 2: // Cloud & Devices
        return (
          <div className="space-y-6">
            <Tabs defaultValue="cloud" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cloud">Cloud Solutions</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="iot">IoT Devices</TabsTrigger>
              </TabsList>

              <TabsContent value="cloud" className="space-y-6">
                {/* Cloud Providers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      Cloud Providers
                    </Label>
                    <Button
                      onClick={() => {
                        setSelectedVendorCategory('cloud_providers');
                        setShowVendorSelector(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cloud Provider
                    </Button>
                  </div>

                  {scopingData.current_environment.cloud_solutions.cloud_providers.map((vendor, index) => (
                    <Card key={index} className="p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.vendor}</h4>
                          <Badge variant="outline">{vendor.satisfaction_rating}/5</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = scopingData.current_environment.cloud_solutions.cloud_providers
                              .filter((_, i) => i !== index);
                            setScopingData({
                              ...scopingData,
                              current_environment: {
                                ...scopingData.current_environment,
                                cloud_solutions: {
                                  ...scopingData.current_environment.cloud_solutions,
                                  cloud_providers: updated
                                }
                              }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Hybrid Model */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={scopingData.current_environment.cloud_solutions.hybrid_model}
                    onCheckedChange={(checked) => setScopingData({
                      ...scopingData,
                      current_environment: {
                        ...scopingData.current_environment,
                        cloud_solutions: {
                          ...scopingData.current_environment.cloud_solutions,
                          hybrid_model: checked as boolean
                        }
                      }
                    })}
                  />
                  <label className="text-sm font-medium">Hybrid Cloud Model</label>
                </div>

                <div>
                  <Label>Cloud Maturity Score (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scopingData.current_environment.cloud_solutions.cloud_maturity_score}
                      onChange={(e) => setScopingData({
                        ...scopingData,
                        current_environment: {
                          ...scopingData.current_environment,
                          cloud_solutions: {
                            ...scopingData.current_environment.cloud_solutions,
                            cloud_maturity_score: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="flex-1"
                    />
                    <Badge variant="outline">
                      {scopingData.current_environment.cloud_solutions.cloud_maturity_score}/10
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endpoints" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Windows Devices */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="h-5 w-5" />
                      <h3 className="font-semibold">Windows Devices</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Total Count</Label>
                        <Input
                          type="number"
                          value={scopingData.current_environment.device_ecosystem.endpoints.windows_devices.count}
                          onChange={(e) => setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              device_ecosystem: {
                                ...scopingData.current_environment.device_ecosystem,
                                endpoints: {
                                  ...scopingData.current_environment.device_ecosystem.endpoints,
                                  windows_devices: {
                                    ...scopingData.current_environment.device_ecosystem.endpoints.windows_devices,
                                    count: parseInt(e.target.value) || 0
                                  }
                                }
                              }
                            }
                          })}
                          placeholder="Number of Windows devices"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Mac Devices */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Laptop className="h-5 w-5" />
                      <h3 className="font-semibold">Mac Devices</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Total Count</Label>
                        <Input
                          type="number"
                          value={scopingData.current_environment.device_ecosystem.endpoints.mac_devices.count}
                          onChange={(e) => setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              device_ecosystem: {
                                ...scopingData.current_environment.device_ecosystem,
                                endpoints: {
                                  ...scopingData.current_environment.device_ecosystem.endpoints,
                                  mac_devices: {
                                    ...scopingData.current_environment.device_ecosystem.endpoints.mac_devices,
                                    count: parseInt(e.target.value) || 0
                                  }
                                }
                              }
                            }
                          })}
                          placeholder="Number of Mac devices"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Mobile Devices */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="h-5 w-5" />
                      <h3 className="font-semibold">Mobile Devices</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Total Count</Label>
                        <Input
                          type="number"
                          value={scopingData.current_environment.device_ecosystem.endpoints.mobile_devices.count}
                          onChange={(e) => setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              device_ecosystem: {
                                ...scopingData.current_environment.device_ecosystem,
                                endpoints: {
                                  ...scopingData.current_environment.device_ecosystem.endpoints,
                                  mobile_devices: {
                                    ...scopingData.current_environment.device_ecosystem.endpoints.mobile_devices,
                                    count: parseInt(e.target.value) || 0
                                  }
                                }
                              }
                            }
                          })}
                          placeholder="Number of mobile devices"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Tablets */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Tablet className="h-5 w-5" />
                      <h3 className="font-semibold">Tablets</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Total Count</Label>
                        <Input
                          type="number"
                          value={scopingData.current_environment.device_ecosystem.endpoints.tablets.count}
                          onChange={(e) => setScopingData({
                            ...scopingData,
                            current_environment: {
                              ...scopingData.current_environment,
                              device_ecosystem: {
                                ...scopingData.current_environment.device_ecosystem,
                                endpoints: {
                                  ...scopingData.current_environment.device_ecosystem.endpoints,
                                  tablets: {
                                    ...scopingData.current_environment.device_ecosystem.endpoints.tablets,
                                    count: parseInt(e.target.value) || 0
                                  }
                                }
                              }
                            }
                          })}
                          placeholder="Number of tablets"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* BYOD Policy */}
                <div>
                  <Label>BYOD Policy</Label>
                  <Select
                    value={scopingData.current_environment.device_ecosystem.byod_policy}
                    onValueChange={(value: 'Prohibited' | 'Limited' | 'Encouraged' | 'Mandatory') => setScopingData({
                      ...scopingData,
                      current_environment: {
                        ...scopingData.current_environment,
                        device_ecosystem: {
                          ...scopingData.current_environment.device_ecosystem,
                          byod_policy: value
                        }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prohibited">Prohibited</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Encouraged">Encouraged</SelectItem>
                      <SelectItem value="Mandatory">Mandatory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="iot" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Printers */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Printer className="h-5 w-5" />
                      <h3 className="font-semibold">Printers</h3>
                    </div>
                    <div>
                      <Label>Count</Label>
                      <Input
                        type="number"
                        value={scopingData.current_environment.device_ecosystem.iot_devices.printers.count}
                        onChange={(e) => setScopingData({
                          ...scopingData,
                          current_environment: {
                            ...scopingData.current_environment,
                            device_ecosystem: {
                              ...scopingData.current_environment.device_ecosystem,
                              iot_devices: {
                                ...scopingData.current_environment.device_ecosystem.iot_devices,
                                printers: {
                                  ...scopingData.current_environment.device_ecosystem.iot_devices.printers,
                                  count: parseInt(e.target.value) || 0
                                }
                              }
                            }
                          }
                        })}
                        placeholder="Number of printers"
                      />
                    </div>
                  </Card>

                  {/* Cameras */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Camera className="h-5 w-5" />
                      <h3 className="font-semibold">Security Cameras</h3>
                    </div>
                    <div>
                      <Label>Count</Label>
                      <Input
                        type="number"
                        value={scopingData.current_environment.device_ecosystem.iot_devices.cameras.count}
                        onChange={(e) => setScopingData({
                          ...scopingData,
                          current_environment: {
                            ...scopingData.current_environment,
                            device_ecosystem: {
                              ...scopingData.current_environment.device_ecosystem,
                              iot_devices: {
                                ...scopingData.current_environment.device_ecosystem.iot_devices,
                                cameras: {
                                  ...scopingData.current_environment.device_ecosystem.iot_devices.cameras,
                                  count: parseInt(e.target.value) || 0
                                }
                              }
                            }
                          }
                        })}
                        placeholder="Number of cameras"
                      />
                    </div>
                  </Card>

                  {/* VoIP Phones */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="h-5 w-5" />
                      <h3 className="font-semibold">VoIP Phones</h3>
                    </div>
                    <div>
                      <Label>Count</Label>
                      <Input
                        type="number"
                        value={scopingData.current_environment.device_ecosystem.iot_devices.voip.count}
                        onChange={(e) => setScopingData({
                          ...scopingData,
                          current_environment: {
                            ...scopingData.current_environment,
                            device_ecosystem: {
                              ...scopingData.current_environment.device_ecosystem,
                              iot_devices: {
                                ...scopingData.current_environment.device_ecosystem.iot_devices,
                                voip: {
                                  ...scopingData.current_environment.device_ecosystem.iot_devices.voip,
                                  count: parseInt(e.target.value) || 0
                                }
                              }
                            }
                          }
                        })}
                        placeholder="Number of VoIP phones"
                      />
                    </div>
                  </Card>

                  {/* Building Automation */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5" />
                      <h3 className="font-semibold">Building Automation</h3>
                    </div>
                    <div>
                      <Label>Count</Label>
                      <Input
                        type="number"
                        value={scopingData.current_environment.device_ecosystem.iot_devices.building_automation.count}
                        onChange={(e) => setScopingData({
                          ...scopingData,
                          current_environment: {
                            ...scopingData.current_environment,
                            device_ecosystem: {
                              ...scopingData.current_environment.device_ecosystem,
                              iot_devices: {
                                ...scopingData.current_environment.device_ecosystem.iot_devices,
                                building_automation: {
                                  ...scopingData.current_environment.device_ecosystem.iot_devices.building_automation,
                                  count: parseInt(e.target.value) || 0
                                }
                              }
                            }
                          }
                        })}
                        placeholder="HVAC, lighting, sensors, etc."
                      />
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  // AI Analysis Phase
  const renderAIAnalysis = () => {
    switch (currentStep) {
      case 0: // Pain Point Discovery
        return (
          <div className="space-y-6">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                AI is analyzing your environment to identify potential pain points and security gaps.
              </AlertDescription>
            </Alert>

            <Card className="p-6">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 mx-auto text-purple-500" />
                <h3 className="text-xl font-semibold">AI Pain Point Analysis</h3>
                <p className="text-muted-foreground">
                  Analyzing your current environment for security, operational, and compliance challenges...
                </p>
                
                {isAIAnalyzing ? (
                  <div className="space-y-4">
                    <Progress value={aiProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Analyzing environment data and identifying optimization opportunities...
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={async () => {
                      setIsAIAnalyzing(true);
                      setAiProgress(0);
                      
                      // Simulate AI analysis progress
                      const interval = setInterval(() => {
                        setAiProgress(prev => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            setIsAIAnalyzing(false);
                            
                            // Generate pain points based on current environment
                            const identifiedPainPoints = identifyPainPoints(
                              scopingData.business_foundation,
                              scopingData.current_environment
                            );
                            
                            setScopingData({
                              ...scopingData,
                              ai_analysis: {
                                ...scopingData.ai_analysis,
                                identified_pain_points: identifiedPainPoints
                              }
                            });
                            
                            toast({
                              title: "AI Analysis Complete",
                              description: `Identified ${identifiedPainPoints.length} potential pain points`,
                            });
                            
                            return 100;
                          }
                          return prev + 10;
                        });
                      }, 300);
                    }}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Analysis
                  </Button>
                )}
              </div>
            </Card>

            {/* Display identified pain points */}
            {scopingData.ai_analysis.identified_pain_points.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Identified Pain Points</h3>
                {scopingData.ai_analysis.identified_pain_points.map((painPoint, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{painPoint.title}</h4>
                          <Badge variant={
                            painPoint.severity === 'Critical' ? 'destructive' :
                            painPoint.severity === 'High' ? 'default' :
                            painPoint.severity === 'Medium' ? 'secondary' : 'outline'
                          }>
                            {painPoint.severity}
                          </Badge>
                          <Badge variant="outline">{painPoint.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{painPoint.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div><strong>Frequency:</strong> {painPoint.frequency}</div>
                          <div><strong>Annual Cost:</strong> ${painPoint.estimated_annual_cost.toLocaleString()}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {Math.round(painPoint.ai_confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <strong className="text-xs">Business Impact:</strong>
                      <p className="text-xs text-muted-foreground">{painPoint.business_impact}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 1: // Decision Tree Logic
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <GitBranch className="h-12 w-12 mx-auto text-blue-500" />
                <h3 className="text-xl font-semibold">Decision Tree Analysis</h3>
                <p className="text-muted-foreground">
                  Generating intelligent recommendations based on your environment and pain points...
                </p>
                
                <Button
                  onClick={() => {
                    const recommendations = runDecisionTree(scopingData.current_environment);
                    setScopingData({
                      ...scopingData,
                      ai_analysis: {
                        ...scopingData.ai_analysis,
                        decision_tree_recommendations: recommendations
                      }
                    });
                    setShowDecisionTree(true);
                    
                    toast({
                      title: "Decision Tree Complete",
                      description: `Generated ${recommendations.length} recommendations`,
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  Generate Recommendations
                </Button>
              </div>
            </Card>

            {/* Display decision tree recommendations */}
            {showDecisionTree && scopingData.ai_analysis.decision_tree_recommendations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                {scopingData.ai_analysis.decision_tree_recommendations.map((recommendation, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2">Trigger</Badge>
                        <p className="text-sm font-medium">{recommendation.trigger_condition}</p>
                      </div>
                      
                      <div>
                        <Badge variant="default" className="mb-2">Recommended Use Cases</Badge>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.recommended_use_cases.map((useCase, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {useCase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant="default" className="mb-2">Recommended Vendors</Badge>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.recommended_vendors.map((vendor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant="outline" className="mb-2">Business Justification</Badge>
                        <p className="text-sm text-muted-foreground">{recommendation.business_justification}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 2: // Requirements Generation
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <FileCheck className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="text-xl font-semibold">AI Requirements Generation</h3>
                <p className="text-muted-foreground">
                  Automatically generating technical and business requirements based on your analysis...
                </p>
                
                <Button
                  onClick={() => {
                    // Generate AI-suggested requirements based on pain points and recommendations
                    const suggestedRequirements = [
                      {
                        id: 'req_1',
                        title: '802.1X Authentication',
                        description: 'Implement comprehensive 802.1X authentication for all network access',
                        priority: 'Must Have' as const,
                        category: 'Security',
                        business_value: 'Prevents unauthorized network access',
                        technical_complexity: 'Medium' as const,
                        estimated_effort: '4-6 weeks',
                        dependencies: ['Network infrastructure assessment', 'Certificate management']
                      },
                      {
                        id: 'req_2',
                        title: 'Device Profiling',
                        description: 'Automatic device identification and classification',
                        priority: 'Must Have' as const,
                        category: 'Operational',
                        business_value: 'Improved visibility and automated policy enforcement',
                        technical_complexity: 'Low' as const,
                        estimated_effort: '2-3 weeks',
                        dependencies: ['Network access control platform']
                      },
                      {
                        id: 'req_3',
                        title: 'Guest Access Portal',
                        description: 'Self-service guest registration and access',
                        priority: 'Should Have' as const,
                        category: 'User Experience',
                        business_value: 'Reduced help desk burden, improved guest experience',
                        technical_complexity: 'Low' as const,
                        estimated_effort: '2-4 weeks',
                        dependencies: ['Guest network infrastructure']
                      }
                    ];
                    
                    setScopingData({
                      ...scopingData,
                      ai_analysis: {
                        ...scopingData.ai_analysis,
                        ai_suggested_requirements: suggestedRequirements
                      }
                    });
                    
                    toast({
                      title: "Requirements Generated",
                      description: `Generated ${suggestedRequirements.length} requirements`,
                    });
                  }}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Requirements
                </Button>
              </div>
            </Card>

            {/* Display AI-suggested requirements */}
            {scopingData.ai_analysis.ai_suggested_requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI-Suggested Requirements</h3>
                {scopingData.ai_analysis.ai_suggested_requirements.map((requirement, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{requirement.title}</h4>
                            <Badge variant={
                              requirement.priority === 'Must Have' ? 'destructive' :
                              requirement.priority === 'Should Have' ? 'default' :
                              requirement.priority === 'Could Have' ? 'secondary' : 'outline'
                            }>
                              {requirement.priority}
                            </Badge>
                            <Badge variant="outline">{requirement.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{requirement.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Business Value:</strong>
                          <p className="text-muted-foreground">{requirement.business_value}</p>
                        </div>
                        <div>
                          <strong>Complexity:</strong>
                          <Badge variant="outline" className="ml-1">{requirement.technical_complexity}</Badge>
                        </div>
                        <div>
                          <strong>Effort:</strong>
                          <span className="text-muted-foreground">{requirement.estimated_effort}</span>
                        </div>
                      </div>
                      
                      {requirement.dependencies.length > 0 && (
                        <div>
                          <strong className="text-sm">Dependencies:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {requirement.dependencies.map((dep, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Phase navigation
  const handleNext = () => {
    if (currentStep < phases[currentPhase].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setCurrentStep(0);
    }
    autoSave();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
      setCurrentStep(phases[currentPhase - 1].steps.length - 1);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...scopingData,
      last_modified: new Date().toISOString(),
      completion_percentage: Math.round(((currentPhase * 3 + currentStep + 1) / 15) * 100)
    };
    
    setScopingData(updatedData);
    
    if (onSave) {
      onSave(updatedData.session_id, updatedData);
    }
    
    toast({
      title: "Session Saved",
      description: "Your scoping session has been saved successfully.",
    });
  };

  const handleComplete = () => {
    const updatedData = {
      ...scopingData,
      last_modified: new Date().toISOString(),
      completion_percentage: 100
    };
    
    setScopingData(updatedData);
    
    if (onComplete) {
      onComplete(updatedData.session_id, updatedData);
    }
    
    toast({
      title: "Scoping Complete",
      description: "Ready to create project from scoping data.",
    });
  };

  const isLastStep = currentPhase === phases.length - 1 && currentStep === phases[currentPhase].steps.length - 1;
  const completionPercentage = Math.round(((currentPhase * 3 + currentStep + 1) / 15) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ultimate AI Scoping Wizard</h2>
          <p className="text-muted-foreground">
            Comprehensive NAC scoping with AI-driven insights (~2 hours total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{completionPercentage}% Complete</Badge>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Session
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-4">
        <Progress value={completionPercentage} className="w-full" />
        <div className="flex justify-between">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const isActive = index === currentPhase;
            const isComplete = index < currentPhase;
            
            return (
              <div key={phase.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? phase.color + ' text-white' :
                  isComplete ? 'bg-green-500 text-white' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <PhaseIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-medium">{phase.title}</div>
                  <div className="text-xs text-muted-foreground">{phase.duration}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phase Content */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              Phase {currentPhase + 1} of {phases.length}
            </Badge>
            <h3 className="text-xl font-semibold">{phases[currentPhase].title}</h3>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">
              Step {currentStep + 1} of {phases[currentPhase].steps.length}
            </Badge>
            <span className="text-lg font-medium">
              {phases[currentPhase].steps[currentStep].title}
            </span>
          </div>
          <p className="text-muted-foreground">
            {phases[currentPhase].steps[currentStep].description}
          </p>
        </div>

        {/* Render current phase content */}
        {currentPhase === 0 && renderBusinessFoundation()}
        {currentPhase === 1 && renderEnvironmentAssessment()}
        {currentPhase === 2 && renderAIAnalysis()}
        {currentPhase === 3 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Solution Architecture</h3>
            <p className="text-muted-foreground">
              This phase will be implemented in the next iteration
            </p>
          </div>
        )}
        {currentPhase === 4 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Implementation Planning</h3>
            <p className="text-muted-foreground">
              This phase will be implemented in the next iteration
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPhase === 0 && currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {isLastStep ? (
            <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Scoping
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Vendor Selection Dialog */}
      {showVendorSelector && (
        <VendorSelectionDialog
          category={selectedVendorCategory}
          onSelect={(vendor: SelectedVendor) => {
            // Add vendor to appropriate category
            if (selectedVendorCategory === 'wired_switching') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  network_infrastructure: {
                    ...scopingData.current_environment.network_infrastructure,
                    wired_vendors: [...scopingData.current_environment.network_infrastructure.wired_vendors, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'wireless') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  network_infrastructure: {
                    ...scopingData.current_environment.network_infrastructure,
                    wireless_vendors: [...scopingData.current_environment.network_infrastructure.wireless_vendors, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'firewalls') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  security_ecosystem: {
                    ...scopingData.current_environment.security_ecosystem,
                    firewalls: [...scopingData.current_environment.security_ecosystem.firewalls, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'edr_solutions') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  security_ecosystem: {
                    ...scopingData.current_environment.security_ecosystem,
                    edr_solutions: [...scopingData.current_environment.security_ecosystem.edr_solutions, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'vpn_solutions') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  security_ecosystem: {
                    ...scopingData.current_environment.security_ecosystem,
                    vpn_solutions: [...scopingData.current_environment.security_ecosystem.vpn_solutions, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'current_nac') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  security_ecosystem: {
                    ...scopingData.current_environment.security_ecosystem,
                    current_nac: [...scopingData.current_environment.security_ecosystem.current_nac, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'identity_providers') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  identity_access: {
                    ...scopingData.current_environment.identity_access,
                    identity_providers: [...scopingData.current_environment.identity_access.identity_providers, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'mfa_solutions') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  identity_access: {
                    ...scopingData.current_environment.identity_access,
                    mfa_solutions: [...scopingData.current_environment.identity_access.mfa_solutions, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'sso_solutions') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  identity_access: {
                    ...scopingData.current_environment.identity_access,
                    sso_solutions: [...scopingData.current_environment.identity_access.sso_solutions, vendor]
                  }
                }
              });
            } else if (selectedVendorCategory === 'cloud_providers') {
              setScopingData({
                ...scopingData,
                current_environment: {
                  ...scopingData.current_environment,
                  cloud_solutions: {
                    ...scopingData.current_environment.cloud_solutions,
                    cloud_providers: [...scopingData.current_environment.cloud_solutions.cloud_providers, vendor]
                  }
                }
              });
            }
          }}
          onClose={() => setShowVendorSelector(false)}
        />
      )}
    </div>
  );
};

export default UltimateAIScopingWizard;