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
  Trash2, Copy, Star, TrendingUp, Activity, BarChart3
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
    firmware: string;
    quantity: number;
    location: string;
    notes?: string;
  }>;
  satisfaction_rating: number;
  pain_points: string[];
  integration_priority: 'High' | 'Medium' | 'Low';
  replacement_timeline: string;
}

// Comprehensive scoping data structure
interface UltimateScopingData {
  // Session metadata
  session_id: string;
  session_name: string;
  created_at: string;
  last_modified: string;
  completion_percentage: number;
  
  // Phase 1: Business Foundation
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

  // Phase 2: Current Environment Deep Dive
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

  // Phase 3: AI-Driven Pain Points & Decision Tree
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
    root_cause_analysis: Array<{
      pain_point_id: string;
      root_causes: string[];
      contributing_factors: string[];
      vendor_relationships: string[];
      process_gaps: string[];
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

  // Phase 4: Solution Architecture & Vendor Selection
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
    integration_architecture: {
      authentication_flow: string[];
      network_segmentation: string[];
      policy_enforcement_points: string[];
      logging_and_monitoring: string[];
      backup_and_recovery: string[];
    };
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

  // Phase 5: Implementation Planning & Project Creation
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
    ai_insights: {
      success_probability: number;
      optimization_opportunities: string[];
      alternative_approaches: string[];
      lessons_learned: string[];
      best_practices: string[];
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

  // Initialize scoping data
  const [scopingData, setScopingData] = useState<UltimateScopingData>(
    existingSession || {
      session_id: `ultimate_${Date.now()}`,
      session_name: 'New Scoping Session',
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
        root_cause_analysis: [],
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
        integration_architecture: {
          authentication_flow: [],
          network_segmentation: [],
          policy_enforcement_points: [],
          logging_and_monitoring: [],
          backup_and_recovery: []
        },
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
        },
        ai_insights: {
          success_probability: 0,
          optimization_opportunities: [],
          alternative_approaches: [],
          lessons_learned: [],
          best_practices: []
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

  // Define the phases with comprehensive steps
  const phases = [
    {
      id: 0,
      title: "Business Foundation",
      icon: Building2,
      description: "Organization profile, stakeholders, and business drivers",
      color: "bg-blue-500",
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
      steps: [
        { id: 0, title: "Network Infrastructure", description: "Wired and wireless ecosystem" },
        { id: 1, title: "Security & Identity", description: "Current security stack" },
        { id: 2, title: "Cloud & Devices", description: "Cloud solutions and device landscape" }
      ]
    },
    {
      id: 2,
      title: "AI-Driven Discovery",
      icon: Brain,
      description: "Intelligent pain point analysis and requirements generation",
      color: "bg-purple-500",
      steps: [
        { id: 0, title: "Pain Point Analysis", description: "AI-identified challenges" },
        { id: 1, title: "Decision Tree Logic", description: "Smart recommendations engine" },
        { id: 2, title: "Requirements Generation", description: "AI-generated requirements" }
      ]
    },
    {
      id: 3,
      title: "Solution Architecture",
      icon: Layers,
      description: "Architecture design and comprehensive vendor selection",
      color: "bg-orange-500",
      steps: [
        { id: 0, title: "Architecture Design", description: "Deployment model and integration" },
        { id: 1, title: "Vendor Selection", description: "Comprehensive vendor ecosystem" },
        { id: 2, title: "Use Case Mapping", description: "Business value alignment" }
      ]
    },
    {
      id: 4,
      title: "Implementation Planning",
      icon: Workflow,
      description: "Project roadmap, budget, and success planning",
      color: "bg-red-500",
      steps: [
        { id: 0, title: "Project Roadmap", description: "Phases, timeline, and milestones" },
        { id: 1, title: "Budget & Resources", description: "Cost estimation and resource planning" },
        { id: 2, title: "Success Planning", description: "AI insights and success factors" }
      ]
    }
  ];

  // Comprehensive vendor categories with all requested types
  const vendorCategories = {
    network: {
      title: "Network Infrastructure",
      icon: Network,
      subcategories: {
        wired_switches: {
          title: "Wired Switches",
          description: "Access, distribution, and core switches",
          vendors: comprehensiveVendorData.filter(v => 
            ['Switch', 'Enterprise', 'Performance'].includes(v.category)
          )
        },
        wireless: {
          title: "Wireless Solutions",
          description: "WiFi access points, controllers, and management",
          vendors: comprehensiveVendorData.filter(v => 
            v.category === 'Wireless-First' || v.name.toLowerCase().includes('wireless')
          )
        }
      }
    },
    security: {
      title: "Security Solutions",
      icon: Shield,
      subcategories: {
        firewalls: {
          title: "Firewalls",
          description: "Next-generation firewalls and network security",
          vendors: enhancedVendors.filter(v => v.category === 'Firewall')
        },
        edr: {
          title: "EDR/XDR",
          description: "Endpoint detection and response solutions",
          vendors: enhancedVendors.filter(v => v.category === 'EDR' || v.category === 'XDR')
        },
        vpn: {
          title: "VPN Solutions",
          description: "Remote access and site-to-site VPN",
          vendors: enhancedVendors.filter(v => v.category === 'VPN')
        },
        siem: {
          title: "SIEM/MDR",
          description: "Security information and event management",
          vendors: enhancedVendors.filter(v => v.category === 'SIEM' || v.category === 'MDR')
        }
      }
    },
    identity: {
      title: "Identity & Access Management",
      icon: Key,
      subcategories: {
        nac: {
          title: "Network Access Control",
          description: "NAC platforms and device control",
          vendors: [...comprehensiveVendorData.filter(v => v.category === 'NAC Primary'),
                   ...enhancedVendors.filter(v => v.category === 'NAC')]
        },
        mfa: {
          title: "Multi-Factor Authentication",
          description: "MFA and strong authentication solutions",
          vendors: enhancedVendors.filter(v => v.category === 'MFA')
        },
        sso: {
          title: "Single Sign-On",
          description: "SSO platforms and identity federation",
          vendors: enhancedVendors.filter(v => v.category === 'SSO')
        },
        idp: {
          title: "Identity Providers",
          description: "Identity and directory services",
          vendors: enhancedVendors.filter(v => v.category === 'IDP' || v.category === 'Identity Provider')
        },
        pki: {
          title: "PKI/Certificate Authority",
          description: "Certificate management and PKI solutions",
          vendors: enhancedVendors.filter(v => v.category === 'PKI' || v.category === 'Certificate')
        }
      }
    },
    cloud: {
      title: "Cloud Solutions",
      icon: Cloud,
      subcategories: {
        cloud_providers: {
          title: "Cloud Platforms",
          description: "Public cloud infrastructure providers",
          vendors: enhancedVendors.filter(v => v.category === 'Cloud Platform')
        },
        cloud_security: {
          title: "Cloud Security",
          description: "Cloud-native security solutions",
          vendors: enhancedVendors.filter(v => v.category === 'Cloud Security')
        },
        cloud_identity: {
          title: "Cloud Identity",
          description: "Cloud-based identity and access management",
          vendors: enhancedVendors.filter(v => v.category === 'Cloud Identity')
        }
      }
    }
  };

  // Industry-specific decision tree data
  const industryDecisionTrees = {
    'Healthcare': {
      triggers: [
        {
          condition: 'HIPAA compliance required',
          pain_points: ['Patient data protection', 'Audit trail requirements', 'Device compliance'],
          use_cases: ['Medical device onboarding', 'Patient WiFi isolation', 'Compliance reporting'],
          vendors: ['Aruba ClearPass', 'Cisco ISE', 'Portnox'],
          requirements: ['HIPAA compliance', 'Device health monitoring', 'Audit logging']
        },
        {
          condition: 'Medical devices > 100',
          pain_points: ['IoT device security', 'Device discovery challenges', 'Legacy device support'],
          use_cases: ['IoT device profiling', 'Legacy device bridging', 'Medical device isolation'],
          vendors: ['Portnox', 'ForeScout', 'Aruba ClearPass'],
          requirements: ['IoT discovery', 'Device profiling', 'Network segmentation']
        }
      ]
    },
    'Financial Services': {
      triggers: [
        {
          condition: 'Zero Trust mandate',
          pain_points: ['Insider threats', 'Data exfiltration risks', 'Compliance burden'],
          use_cases: ['Zero trust access', 'Privileged access management', 'Data loss prevention'],
          vendors: ['Cisco ISE', 'Portnox', 'Palo Alto'],
          requirements: ['Zero trust architecture', 'Continuous monitoring', 'Dynamic policies']
        }
      ]
    },
    'Education': {
      triggers: [
        {
          condition: 'Student devices > 1000',
          pain_points: ['Guest access complexity', 'Seasonal fluctuations', 'Limited IT resources'],
          use_cases: ['Student onboarding automation', 'Guest network management', 'Self-service portal'],
          vendors: ['Aruba ClearPass', 'Portnox', 'Extreme Networks'],
          requirements: ['Self-service onboarding', 'Guest access portal', 'Automated provisioning']
        }
      ]
    },
    'Manufacturing': {
      triggers: [
        {
          condition: 'OT/IT convergence project',
          pain_points: ['OT/IT integration', 'Industrial protocol support', 'Operational disruption'],
          use_cases: ['OT network segmentation', 'Industrial device profiling', 'Supply chain access'],
          vendors: ['Cisco ISE', 'Portnox', 'ForeScout'],
          requirements: ['OT protocol support', 'Air-gap simulation', 'Industrial device support']
        }
      ]
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(() => {
    const updatedData = {
      ...scopingData,
      last_modified: new Date().toISOString(),
      completion_percentage: Math.round(((currentPhase * phases[currentPhase].steps.length + currentStep + 1) / 
        (phases.reduce((acc, phase) => acc + phase.steps.length, 0))) * 100)
    };
    
    setScopingData(updatedData);
    
    // Save to localStorage
    localStorage.setItem(`ultimate_scoping_${updatedData.session_id}`, JSON.stringify(updatedData));
    
    if (onSave) {
      onSave(updatedData.session_id, updatedData);
    }
  }, [scopingData, currentPhase, currentStep, phases, onSave]);

  // AI-powered decision tree and recommendations
  const runAIAnalysis = useCallback(async (phase: number) => {
    setIsAIAnalyzing(true);
    setAiProgress(0);
    
    try {
      let analysisPrompt = '';
      const progressInterval = setInterval(() => {
        setAiProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      switch (phase) {
        case 0: // Business Foundation Analysis
          analysisPrompt = `
            Analyze this organization's profile and suggest relevant business drivers and stakeholders:
            
            Organization: ${scopingData.business_foundation.organization.name}
            Industry: ${scopingData.business_foundation.organization.industry}
            Size: ${scopingData.business_foundation.organization.company_size}
            Employees: ${scopingData.business_foundation.organization.total_employees}
            
            Based on this context, provide:
            1. Industry-specific pain points this organization likely faces
            2. Common business drivers for NAC initiatives in this industry
            3. Key stakeholders who should be involved based on company size
            4. Relevant compliance requirements for this industry
            5. Typical success metrics for organizations like this
            
            Return structured recommendations that align with their business context.
          `;
          break;
          
        case 1: // Environment Assessment
          analysisPrompt = `
            Analyze the current environment and identify integration opportunities and challenges:
            
            Network Infrastructure: ${JSON.stringify(scopingData.current_environment.network_infrastructure)}
            Security Ecosystem: ${JSON.stringify(scopingData.current_environment.security_ecosystem)}
            Identity Solutions: ${JSON.stringify(scopingData.current_environment.identity_access)}
            
            Provide analysis on:
            1. Integration complexity with existing vendors
            2. Potential vendor consolidation opportunities  
            3. Security and identity maturity assessment
            4. Risk factors and technical debt in current environment
            5. Recommended architecture approach based on current state
          `;
          break;
          
        case 2: // AI-Driven Discovery
          analysisPrompt = `
            Perform intelligent pain point discovery and requirements generation:
            
            Industry: ${scopingData.business_foundation.organization.industry}
            Current Environment: ${JSON.stringify(scopingData.current_environment)}
            Business Drivers: ${JSON.stringify(scopingData.business_foundation.business_drivers)}
            
            Using decision tree logic, provide:
            1. Prioritized pain points based on industry patterns
            2. Root cause analysis for each identified pain point
            3. Specific technical requirements to address these challenges
            4. Use case recommendations that deliver maximum business value
            5. Vendor recommendations that best fit their environment
            
            Consider decision triggers based on their specific situation.
          `;
          break;
          
        case 3: // Solution Architecture
          analysisPrompt = `
            Design optimal solution architecture based on comprehensive analysis:
            
            Requirements: ${JSON.stringify(scopingData.ai_analysis.ai_suggested_requirements)}
            Current Environment: ${JSON.stringify(scopingData.current_environment)}
            Business Context: ${JSON.stringify(scopingData.business_foundation)}
            
            Recommend:
            1. Optimal deployment architecture (on-premise/cloud/hybrid)
            2. Vendor ecosystem that maximizes integration value
            3. Implementation approach that minimizes business disruption
            4. Integration points and data flows
            5. Performance and scalability considerations
          `;
          break;
          
        case 4: // Implementation Planning
          analysisPrompt = `
            Create comprehensive implementation plan with success factors:
            
            Solution Architecture: ${JSON.stringify(scopingData.solution_architecture)}
            Organization Profile: ${JSON.stringify(scopingData.business_foundation.organization)}
            
            Provide:
            1. Phased implementation roadmap with realistic timelines
            2. Resource requirements (internal and external)
            3. Budget estimation based on organization size and complexity
            4. Risk assessment and mitigation strategies
            5. Success probability assessment with key factors
            6. Quick wins and long-term strategic benefits
          `;
          break;
      }
      
      const response = await generateCompletion({
        prompt: analysisPrompt,
        context: 'ultimate_scoping_ai_analysis',
        temperature: 0.3
      });
      
      clearInterval(progressInterval);
      setAiProgress(100);
      
      if (response?.content) {
        // Process AI response and update appropriate section
        await processAIResponse(phase, response.content);
        
        toast({
          title: "AI Analysis Complete",
          description: `Phase ${phase + 1} analysis generated comprehensive recommendations.`
        });
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: "AI Analysis Error",
        description: "Unable to complete analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIAnalyzing(false);
      setAiProgress(0);
    }
  }, [scopingData, generateCompletion, toast]);

  const processAIResponse = async (phase: number, aiResponse: string) => {
    // This would parse the AI response and update the appropriate data structures
    // For now, we'll simulate updating the data
    
    const updatedData = { ...scopingData };
    
    switch (phase) {
      case 0:
        // Update business drivers and suggested stakeholders
        // Example: parse aiResponse JSON and update business_foundation.business_drivers and stakeholders
        break;
      case 1:
        // Update maturity scores and integration recommendations
        // Example: parse aiResponse JSON and update current_environment.security_ecosystem.security_maturity_score etc.
        break;
      case 2:
        // Update pain points and requirements
        // Example: parse aiResponse JSON and update ai_analysis.identified_pain_points and ai_suggested_requirements
        break;
      case 3:
        // Update solution architecture and vendor recommendations
        // Example: parse aiResponse JSON and update solution_architecture.recommended_vendors etc.
        break;
      case 4:
        // Update implementation plan and success factors
        // Example: parse aiResponse JSON and update implementation_plan.project_roadmap and success_factors
        break;
    }
    
    setScopingData(updatedData);
  };

  // Enhanced vendor selection with models and firmware
  const VendorSelectorDialog = ({ category, subcategory, onSelect }: {
    category: string;
    subcategory: string;
    onSelect: (vendor: SelectedVendor) => void;
  }) => {
    const [selectedVendor, setSelectedVendor] = useState('');
    const [selectedModels, setSelectedModels] = useState<Array<{
      model: string;
      firmware: string;
      quantity: number;
      location: string;
    }>>([]);
    
    const vendors = vendorCategories[category]?.subcategories[subcategory]?.vendors || [];
    const currentVendor = vendors.find(v => v.name === selectedVendor);
    
    const addModel = () => {
      setSelectedModels([...selectedModels, {
        model: '',
        firmware: '',
        quantity: 1,
        location: ''
      }]);
    };
    
    const updateModel = (index: number, field: string, value: string | number) => {
      const updated = [...selectedModels];
      updated[index] = { ...updated[index], [field]: value };
      setSelectedModels(updated);
    };
    
    const handleSelect = () => {
      if (selectedVendor && selectedModels.length > 0) {
        onSelect({
          vendor: selectedVendor,
          category: subcategory,
          models: selectedModels,
          satisfaction_rating: 3,
          pain_points: [],
          integration_priority: 'Medium',
          replacement_timeline: '12 months'
        });
      }
    };
    
    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select {vendorCategories[category].subcategories[subcategory].title}</DialogTitle>
          <DialogDescription>
            Choose vendor and configure specific models with firmware versions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Vendor Selection */}
          <div>
            <Label>Vendor</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.name}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        vendor.supportLevel === 'full' ? 'bg-green-500' :
                        vendor.supportLevel === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {vendor.name}
                      <Badge variant="outline" className="text-xs">
                        {vendor.supportLevel}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Model Selection */}
          {currentVendor && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Models & Firmware</Label>
                <Button size="sm" onClick={addModel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>
              
              {selectedModels.map((model, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Model</Label>
                        <Select 
                          value={model.model} 
                          onValueChange={(value) => updateModel(index, 'model', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentVendor.models.map(m => (
                              <SelectItem key={m.id} value={m.name}>
                                {m.name} ({m.series})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Firmware</Label>
                        <Select 
                          value={model.firmware}
                          onValueChange={(value) => updateModel(index, 'firmware', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select firmware" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentVendor.models
                              .find(m => m.name === model.model)
                              ?.firmwareVersions.map(fw => (
                                <SelectItem key={fw} value={fw}>
                                  {fw}
                                </SelectItem>
                              )) || []}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={model.quantity}
                          onChange={(e) => updateModel(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={model.location}
                          onChange={(e) => updateModel(index, 'location', e.target.value)}
                          placeholder="Building/Site name"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVendorSelector(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedVendor || selectedModels.length === 0}>
              Add Vendor
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  // Auto-save on data changes
  useEffect(() => {
    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [scopingData, autoSave]);

  // Calculate total progress
  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const currentStepIndex = phases.slice(0, currentPhase).reduce((acc, phase) => acc + phase.steps.length, 0) + currentStep;
  const completionPercentage = Math.round((currentStepIndex / totalSteps) * 100);

  const handleNext = () => {
    const currentPhaseSteps = phases[currentPhase].steps.length;
    
    if (currentStep < currentPhaseSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setCurrentStep(0);
      // Trigger AI analysis for new phase
      runAIAnalysis(currentPhase + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
      setCurrentStep(phases[currentPhase - 1].steps.length - 1);
    }
  };

  const handleComplete = () => {
    const finalData = {
      ...scopingData,
      completion_percentage: 100,
      last_modified: new Date().toISOString()
    };
    
    if (onComplete) {
      onComplete(finalData.session_id, finalData);
    }
  };

  // Render phase content based on current phase and step
  const renderPhaseContent = () => {
    const phase = phases[currentPhase];
    const step = phase.steps[currentStep];
    
    if (currentPhase === 0) {
      return renderBusinessFoundationStep();
    } else if (currentPhase === 1) {
      return renderEnvironmentAssessmentStep();
    } else if (currentPhase === 2) {
      return renderAIDrivenDiscoveryStep();
    } else if (currentPhase === 3) {
      return renderSolutionArchitectureStep();
    } else if (currentPhase === 4) {
      return renderImplementationPlanningStep();
    }
    
    return <div>Phase content for {phase.title} - {step.title}</div>;
  };

  const renderBusinessFoundationStep = () => {
    if (currentStep === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={scopingData.business_foundation.organization.name}
                  onChange={(e) => setScopingData(prev => ({
                    ...prev,
                    business_foundation: {
                      ...prev.business_foundation,
                      organization: {
                        ...prev.business_foundation.organization,
                        name: e.target.value
                      }
                    }
                  }))}
                  placeholder="Enter your organization name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={scopingData.business_foundation.organization.industry}
                  onValueChange={(value) => {
                    setScopingData(prev => ({
                      ...prev,
                      business_foundation: {
                        ...prev.business_foundation,
                        organization: {
                          ...prev.business_foundation.organization,
                          industry: value
                        }
                      }
                    }));
                    // Trigger AI analysis when industry is selected
                    if (value) {
                      setTimeout(() => runAIAnalysis(0), 1000);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(industryDecisionTrees).map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="company-size">Company Size *</Label>
                <Select
                  value={scopingData.business_foundation.organization.company_size}
                  onValueChange={(value: any) => setScopingData(prev => ({
                    ...prev,
                    business_foundation: {
                      ...prev.business_foundation,
                      organization: {
                        ...prev.business_foundation.organization,
                        company_size: value
                      }
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMB">SMB (1-500 employees)</SelectItem>
                    <SelectItem value="Mid-Market">Mid-Market (500-5000 employees)</SelectItem>
                    <SelectItem value="Enterprise">Enterprise (5000-50000 employees)</SelectItem>
                    <SelectItem value="Global">Global (50000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employees">Total Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  value={scopingData.business_foundation.organization.total_employees}
                  onChange={(e) => setScopingData(prev => ({
                    ...prev,
                    business_foundation: {
                      ...prev.business_foundation,
                      organization: {
                        ...prev.business_foundation.organization,
                        total_employees: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="it-team">IT Team Size</Label>
                <Input
                  id="it-team"
                  type="number"
                  value={scopingData.business_foundation.organization.it_team_size}
                  onChange={(e) => setScopingData(prev => ({
                    ...prev,
                    business_foundation: {
                      ...prev.business_foundation,
                      organization: {
                        ...prev.business_foundation.organization,
                        it_team_size: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="security-team">Security Team Size</Label>
                <Input
                  id="security-team"
                  type="number"
                  value={scopingData.business_foundation.organization.security_team_size}
                  onChange={(e) => setScopingData(prev => ({
                    ...prev,
                    business_foundation: {
                      ...prev.business_foundation,
                      organization: {
                        ...prev.business_foundation.organization,
                        security_team_size: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                />
              </div>
            </div>

            {/* AI-generated industry insights */}
            {scopingData.business_foundation.organization.industry && 
             industryDecisionTrees[scopingData.business_foundation.organization.industry] && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Industry Insights:</strong> Based on {scopingData.business_foundation.organization.industry}, 
                  common triggers include{' '}
                  {industryDecisionTrees[scopingData.business_foundation.organization.industry].triggers
                    .slice(0, 2).map(t => t.condition).join(' and ')}.
                  Our AI will analyze these patterns as you continue.
                </AlertDescription>
              </Alert>
            )}

            {isAIAnalyzing && (
              <Alert>
                <Brain className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>AI analyzing organization profile...</span>
                      <span>{aiProgress}%</span>
                    </div>
                    <Progress value={aiProgress} className="w-full" />
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      );
    }
    
    // Other business foundation steps would go here
    return <div>Business Foundation Step {currentStep}</div>;
  };

  const renderEnvironmentAssessmentStep = () => {
    if (currentStep === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Infrastructure Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="wired" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wired">Wired Infrastructure</TabsTrigger>
                <TabsTrigger value="wireless">Wireless Infrastructure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wired" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Current Wired Switch Vendors</h4>
                  <Dialog open={showVendorSelector && selectedVendorCategory === 'wired_switches'} 
                         onOpenChange={setShowVendorSelector}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => {
                        setSelectedVendorCategory('wired_switches');
                        setShowVendorSelector(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vendor
                      </Button>
                    </DialogTrigger>
                    <VendorSelectorDialog 
                      category="network"
                      subcategory="wired_switches"
                      onSelect={(vendor) => {
                        setScopingData(prev => ({
                          ...prev,
                          current_environment: {
                            ...prev.current_environment,
                            network_infrastructure: {
                              ...prev.current_environment.network_infrastructure,
                              wired_vendors: [...prev.current_environment.network_infrastructure.wired_vendors, vendor]
                            }
                          }
                        }));
                        setShowVendorSelector(false);
                      }}
                    />
                  </Dialog>
                </div>
                
                {/* Display selected wired vendors */}
                <div className="space-y-3">
                  {scopingData.current_environment.network_infrastructure.wired_vendors.map((vendor, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{vendor.vendor}</h5>
                            <p className="text-sm text-muted-foreground">
                              {vendor.models.length} models configured
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                Priority: {vendor.integration_priority}
                              </Badge>
                              <Badge variant="outline">
                                Satisfaction: {vendor.satisfaction_rating}/5
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="wireless" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Current Wireless Infrastructure</h4>
                  <Button size="sm" onClick={() => {
                    setSelectedVendorCategory('wireless');
                    setShowVendorSelector(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
                
                {/* Display selected wireless vendors */}
                <div className="space-y-3">
                  {scopingData.current_environment.network_infrastructure.wireless_vendors.map((vendor, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{vendor.vendor}</h5>
                            <p className="text-sm text-muted-foreground">
                              {vendor.models.length} models configured
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      );
    }
    
    return <div>Environment Assessment Step {currentStep}</div>;
  };

  const renderAIDrivenDiscoveryStep = () => {
    return <div>AI-Driven Discovery Step {currentStep}</div>;
  };

  const renderSolutionArchitectureStep = () => {
    return <div>Solution Architecture Step {currentStep}</div>;
  };

  const renderImplementationPlanningStep = () => {
    return <div>Implementation Planning Step {currentStep}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Ultimate AI Scoping Wizard
                <Badge variant="glow" className="ml-2">Enhanced</Badge>
              </CardTitle>
              <p className="text-muted-foreground">
                Comprehensive scoping with decision tree logic, full vendor ecosystem, and intelligent recommendations
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {completionPercentage}% Complete
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Phase {currentPhase + 1} of {phases.length}
              </p>
            </div>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Phase Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = index === currentPhase;
              const isCompleted = index < currentPhase;
              
              return (
                <Button
                  key={phase.id}
                  variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap ${isActive ? phase.color : ''}`}
                  onClick={() => {
                    setCurrentPhase(index);
                    setCurrentStep(0);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {phase.title}
                  {isCompleted && <CheckCircle className="h-3 w-3" />}
                  {isActive && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {currentStep + 1}/{phase.steps.length}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="min-h-[600px]">
        {renderPhaseContent()}
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPhase === 0 && currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={autoSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              
              <Button variant="outline" onClick={() => runAIAnalysis(currentPhase)}>
                <Brain className="h-4 w-4 mr-2" />
                Run AI Analysis
              </Button>
              
              {isAIAnalyzing && (
                <Badge variant="secondary" className="animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  AI Analyzing... {aiProgress}%
                </Badge>
              )}
            </div>
            
            {currentPhase === phases.length - 1 && currentStep === phases[currentPhase].steps.length - 1 ? (
              <Button onClick={handleComplete}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UltimateAIScopingWizard;
