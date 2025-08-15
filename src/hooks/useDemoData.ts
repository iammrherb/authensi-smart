// Enhanced demo data for the Ultimate Portnox ZTAC Platform
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration purposes
const demoProjects = [
  {
    id: '1',
    name: 'Global Financial Services ZTAC Implementation',
    description: 'Enterprise-wide Zero Trust Access Control deployment across 45 global locations with advanced threat detection and compliance automation',
    status: 'planning',
    priority: 'critical',
    start_date: '2024-01-15',
    target_completion: '2024-08-30',
    actual_completion: null,
    budget: 450000,
    project_manager: 'Sarah Johnson',
    technical_lead: 'Mike Chen',
    business_sponsor: 'David Rodriguez, CISO',
    deployment_type: 'phased_global',
    scope: 'global',
    compliance_requirements: ['SOX', 'PCI-DSS', 'GDPR', 'FFIEC', 'Basel III'],
    technology_stack: ['Portnox CORE', 'Portnox CLEAR', 'ClearPass Integration', 'Active Directory', 'Splunk SIEM'],
    risk_level: 'high',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
    created_by: 'demo-user'
  },
  {
    id: '2',
    name: 'Healthcare Zero Trust Network Transformation',
    description: 'HIPAA-compliant zero trust network access control for 12-site healthcare provider with IoT medical device protection and patient data segmentation',
    status: 'in_progress',
    priority: 'critical',
    start_date: '2024-02-01',
    target_completion: '2024-07-15',
    actual_completion: null,
    budget: 320000,
    project_manager: 'Jennifer Walsh',
    technical_lead: 'Alex Kumar',
    business_sponsor: 'Dr. Patricia Williams, Chief Medical Officer',
    deployment_type: 'pilot_then_rollout',
    scope: 'regional',
    compliance_requirements: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11', 'Joint Commission'],
    technology_stack: ['Portnox CORE', 'Portnox CLEAR', 'Cisco ISE', 'VMware NSX', 'Medigate IoT Security'],
    risk_level: 'critical',
    created_at: '2024-01-20',
    updated_at: '2024-02-05',
    created_by: 'demo-user'
  },
  {
    id: '3',
    name: 'Smart Manufacturing IoT Zero Trust Platform',
    description: 'Industrial IoT device management and network segmentation for smart factory with OT/IT convergence and predictive security analytics',
    status: 'completed',
    priority: 'high',
    start_date: '2023-09-01',
    target_completion: '2023-12-31',
    actual_completion: '2023-12-15',
    budget: 280000,
    project_manager: 'Robert Kim',
    technical_lead: 'Lisa Zhang',
    business_sponsor: 'Mark Thompson, VP Operations',
    deployment_type: 'greenfield',
    scope: 'multi_site',
    compliance_requirements: ['ISO 27001', 'NIST', 'IEC 62443', 'NERC CIP'],
    technology_stack: ['Portnox CORE', 'Portnox CLEAR', 'Fortinet', 'Aruba CX', 'Claroty OT Security'],
    risk_level: 'high',
    created_at: '2023-08-15',
    updated_at: '2023-12-20',
    created_by: 'demo-user'
  },
  {
    id: '4',
    name: 'Government Agency Zero Trust Modernization',
    description: 'Federal agency FISMA-compliant zero trust architecture implementation with multi-level security clearance access controls',
    status: 'planning',
    priority: 'critical',
    start_date: '2024-03-01',
    target_completion: '2024-12-31',
    actual_completion: null,
    budget: 850000,
    project_manager: 'Colonel James Mitchell',
    technical_lead: 'Dr. Amanda Foster',
    business_sponsor: 'Deputy Director Maria Santos',
    deployment_type: 'secure_phased',
    scope: 'federal',
    compliance_requirements: ['FISMA', 'FedRAMP', 'NIST 800-53', 'CJIS', 'ITAR'],
    technology_stack: ['Portnox CORE', 'Portnox CLEAR', 'Okta Federal', 'Splunk Federal', 'Tanium'],
    risk_level: 'critical',
    created_at: '2024-02-15',
    updated_at: '2024-02-28',
    created_by: 'demo-user'
  },
  {
    id: '5',
    name: 'Retail Chain Omnichannel Security Platform',
    description: 'Multi-brand retail chain zero trust implementation covering 500+ stores, distribution centers, and corporate offices with PCI compliance',
    status: 'in_progress',
    priority: 'high',
    start_date: '2024-01-01',
    target_completion: '2024-09-30',
    actual_completion: null,
    budget: 420000,
    project_manager: 'Ashley Rodriguez',
    technical_lead: 'Kevin Park',
    business_sponsor: 'Chief Technology Officer Rachel Green',
    deployment_type: 'wave_deployment',
    scope: 'national',
    compliance_requirements: ['PCI-DSS', 'SOX', 'CCPA', 'GDPR'],
    technology_stack: ['Portnox CORE', 'Portnox CLEAR', 'Cisco Meraki', 'Microsoft Azure AD', 'Qualys VMDR'],
    risk_level: 'high',
    created_at: '2023-12-01',
    updated_at: '2024-01-30',
    created_by: 'demo-user'
  }
];

const demoSites = [
  {
    id: '1',
    name: 'Financial District Headquarters',
    location: 'New York, NY',
    address: '500 Wall Street, New York, NY 10005',
    contact_name: 'Michael Harrison',
    contact_email: 'michael.harrison@globalbank.com',
    contact_phone: '+1 (212) 555-0123',
    site_type: 'headquarters',
    network_segments: 12,
    device_count: 2500,
    status: 'planning',
    priority: 'critical',
    assigned_engineer: 'Sarah Johnson',
    compliance_zones: ['DMZ', 'Internal', 'Restricted', 'Executive'],
    security_level: 'maximum',
    business_hours: '24/7',
    created_by: 'demo-user'
  },
  {
    id: '2',
    name: 'Regional Medical Center Campus',
    location: 'Chicago, IL',
    address: '1400 Medical Plaza Drive, Chicago, IL 60611',
    contact_name: 'Dr. Emily Carter',
    contact_email: 'emily.carter@regionalmed.org',
    contact_phone: '+1 (312) 555-0456',
    site_type: 'healthcare_campus',
    network_segments: 8,
    device_count: 1850,
    status: 'in_progress',
    priority: 'critical',
    assigned_engineer: 'Jennifer Walsh',
    compliance_zones: ['Patient Care', 'Administrative', 'Research', 'Guest'],
    security_level: 'high',
    business_hours: '24/7',
    created_by: 'demo-user'
  },
  {
    id: '3',
    name: 'Smart Manufacturing Plant Alpha',
    location: 'Detroit, MI',
    address: '2500 Industrial Boulevard, Detroit, MI 48201',
    contact_name: 'James Wilson',
    contact_email: 'james.wilson@smartmfg.com',
    contact_phone: '+1 (313) 555-0789',
    site_type: 'manufacturing',
    network_segments: 6,
    device_count: 3200,
    status: 'completed',
    priority: 'high',
    assigned_engineer: 'Robert Kim',
    compliance_zones: ['Production', 'Quality Control', 'Office', 'Maintenance'],
    security_level: 'high',
    business_hours: '24/7',
    created_by: 'demo-user'
  },
  {
    id: '4',
    name: 'Federal Agency Data Center',
    location: 'Washington, DC',
    address: '300 Constitution Avenue NW, Washington, DC 20001',
    contact_name: 'Colonel Sarah Mitchell',
    contact_email: 'sarah.mitchell@fed.gov',
    contact_phone: '+1 (202) 555-0101',
    site_type: 'government_facility',
    network_segments: 15,
    device_count: 1200,
    status: 'planning',
    priority: 'critical',
    assigned_engineer: 'Colonel James Mitchell',
    compliance_zones: ['Classified', 'Secret', 'Confidential', 'Unclassified'],
    security_level: 'maximum',
    business_hours: '24/7',
    created_by: 'demo-user'
  },
  {
    id: '5',
    name: 'Retail Distribution Center West',
    location: 'Los Angeles, CA',
    address: '1500 Commerce Way, Los Angeles, CA 90021',
    contact_name: 'Maria Rodriguez',
    contact_email: 'maria.rodriguez@retailchain.com',
    contact_phone: '+1 (213) 555-0234',
    site_type: 'distribution_center',
    network_segments: 4,
    device_count: 800,
    status: 'in_progress',
    priority: 'medium',
    assigned_engineer: 'Ashley Rodriguez',
    compliance_zones: ['Warehouse', 'Office', 'Shipping', 'Guest'],
    security_level: 'medium',
    business_hours: '6AM-11PM',
    created_by: 'demo-user'
  }
];

const demoVendors = [
  {
    id: '1',
    name: 'Portnox',
    category: 'NAC_Primary',
    description: 'Leading Zero Trust Network Access Control platform with cloud-native architecture',
    website: 'https://www.portnox.com',
    contact_name: 'Enterprise Sales Team',
    contact_email: 'enterprise@portnox.com',
    contact_phone: '+1 (800) PORTNOX',
    capabilities: ['Zero Trust NAC', 'Cloud Management', 'IoT Security', 'Compliance Automation'],
    products: ['Portnox CORE', 'Portnox CLEAR', 'Portnox Cloud'],
    certifications: ['FedRAMP', 'SOC 2', 'ISO 27001'],
    deployment_models: ['On-Premises', 'Cloud', 'Hybrid'],
    integration_partners: ['Cisco', 'Microsoft', 'VMware', 'Splunk'],
    support_level: 'Premium',
    created_by: 'demo-user'
  },
  {
    id: '2',
    name: 'Cisco Systems',
    category: 'Network_Infrastructure',
    description: 'Global network infrastructure and security solutions provider',
    website: 'https://www.cisco.com',
    contact_name: 'Enterprise Account Manager',
    contact_email: 'enterprise@cisco.com',
    contact_phone: '+1 (800) 553-6387',
    capabilities: ['Network Infrastructure', 'Identity Services Engine', 'SD-WAN', 'Security'],
    products: ['Cisco ISE', 'Catalyst Switches', 'ASA Firewalls', 'Meraki Cloud'],
    certifications: ['Common Criteria', 'FIPS 140-2', 'NATO'],
    deployment_models: ['On-Premises', 'Cloud', 'Hybrid'],
    integration_partners: ['Portnox', 'Microsoft', 'VMware'],
    support_level: 'Enterprise',
    created_by: 'demo-user'
  },
  {
    id: '3',
    name: 'Microsoft Corporation',
    category: 'Identity_Management',
    description: 'Cloud identity and access management solutions',
    website: 'https://www.microsoft.com',
    contact_name: 'Azure Enterprise Team',
    contact_email: 'azure@microsoft.com',
    contact_phone: '+1 (800) 642-7676',
    capabilities: ['Azure Active Directory', 'Conditional Access', 'Identity Protection', 'Zero Trust'],
    products: ['Azure AD', 'Microsoft Intune', 'Defender for Identity', 'Sentinel SIEM'],
    certifications: ['FedRAMP High', 'SOC 1/2/3', 'ISO 27001'],
    deployment_models: ['Cloud', 'Hybrid'],
    integration_partners: ['Portnox', 'Cisco', 'VMware'],
    support_level: 'Premier',
    created_by: 'demo-user'
  }
];

const demoRequirements = [
  {
    id: '1',
    title: 'Zero Trust Architecture Implementation',
    category: 'Security Architecture',
    priority: 'critical',
    status: 'draft',
    description: 'Implement comprehensive zero trust network architecture with continuous verification and least privilege access',
    technical_details: 'Deploy microsegmentation, device trust verification, and continuous monitoring across all network segments',
    business_justification: 'Reduce security incidents by 85% and ensure compliance with federal zero trust mandates',
    acceptance_criteria: 'All devices authenticated, all traffic encrypted, all access logged and monitored',
    compliance_mapping: ['NIST Zero Trust', 'Executive Order 14028'],
    estimated_effort: 'High',
    dependencies: ['Network Infrastructure', 'Identity Management'],
    created_by: 'demo-user'
  },
  {
    id: '2',
    title: 'IoT Medical Device Security',
    category: 'Healthcare Compliance',
    priority: 'critical',
    status: 'approved',
    description: 'Secure all IoT medical devices with automatic discovery, classification, and policy enforcement',
    technical_details: 'Implement device fingerprinting, behavioral analytics, and automated quarantine capabilities',
    business_justification: 'Protect patient data and ensure HIPAA compliance for connected medical devices',
    acceptance_criteria: 'All medical devices discovered, classified, and continuously monitored with zero patient data exposure',
    compliance_mapping: ['HIPAA', 'FDA Cybersecurity Guidelines'],
    estimated_effort: 'High',
    dependencies: ['Network Segmentation', 'Device Management'],
    created_by: 'demo-user'
  },
  {
    id: '3',
    title: 'Industrial OT/IT Convergence Security',
    category: 'Operational Technology',
    priority: 'high',
    status: 'in_review',
    description: 'Secure operational technology networks while maintaining industrial system availability and performance',
    technical_details: 'Deploy OT-aware NAC with industrial protocol support and real-time monitoring',
    business_justification: 'Protect manufacturing operations from cyber threats while maintaining 99.9% uptime',
    acceptance_criteria: 'OT networks secured without operational impact, full visibility into industrial communications',
    compliance_mapping: ['IEC 62443', 'NIST Manufacturing Profile'],
    estimated_effort: 'Medium',
    dependencies: ['OT Network Assessment', 'Vendor Coordination'],
    created_by: 'demo-user'
  }
];

const demoUseCases = [
  {
    id: '1',
    name: 'Financial Services Branch Office',
    category: 'Financial Services',
    description: 'Secure branch office with customer terminals, employee workstations, and back-office systems',
    industry: 'Banking',
    complexity: 'high',
    typical_devices: 1200,
    network_segments: ['Customer Zone', 'Employee Zone', 'Back Office', 'ATM Network'],
    security_requirements: ['PCI-DSS', 'SOX', 'Data Encryption', 'Audit Logging'],
    business_outcomes: ['Regulatory Compliance', 'Customer Data Protection', 'Operational Efficiency'],
    implementation_time: '6-8 weeks',
    success_metrics: ['Zero PCI violations', '99.9% uptime', 'Sub-second authentication'],
    created_by: 'demo-user'
  },
  {
    id: '2',
    name: 'Hospital Critical Care Unit',
    category: 'Healthcare',
    description: 'Secure critical care environment with life-support systems, monitoring devices, and staff access',
    industry: 'Healthcare',
    complexity: 'critical',
    typical_devices: 800,
    network_segments: ['Patient Care', 'Medical Devices', 'Staff Network', 'Guest Access'],
    security_requirements: ['HIPAA', 'Patient Safety', 'Device Integrity', 'Emergency Access'],
    business_outcomes: ['Patient Safety', 'HIPAA Compliance', 'Clinical Efficiency'],
    implementation_time: '8-12 weeks',
    success_metrics: ['Zero patient data breaches', '100% device visibility', 'Emergency access < 30 seconds'],
    created_by: 'demo-user'
  },
  {
    id: '3',
    name: 'Smart Factory Production Line',
    category: 'Manufacturing',
    description: 'Secure automated production line with robots, sensors, and quality control systems',
    industry: 'Manufacturing',
    complexity: 'high',
    typical_devices: 2500,
    network_segments: ['Production Control', 'Quality Systems', 'Maintenance', 'Office Network'],
    security_requirements: ['ISO 27001', 'Production Continuity', 'Data Integrity', 'Safety Systems'],
    business_outcomes: ['Operational Continuity', 'Quality Assurance', 'Cyber Resilience'],
    implementation_time: '10-14 weeks',
    success_metrics: ['Zero production downtime', '100% OT visibility', 'Real-time threat detection'],
    created_by: 'demo-user'
  }
];

const demoQuestionnaires = [
  {
    id: '1',
    project_id: '1',
    questionnaire_type: 'technical_discovery',
    title: 'Global Financial Services Technical Assessment',
    status: 'completed',
    responses: {
      network_infrastructure: 'Cisco catalyst switches with ISE integration',
      device_count: '15000+ endpoints across 45 locations',
      compliance_requirements: 'SOX, PCI-DSS, GDPR, FFIEC, Basel III',
      current_security_tools: 'CyberArk, Splunk, McAfee ePO, Cisco ASA',
      budget_range: '$400K-500K',
      timeline_requirements: '8 months phased deployment',
      risk_tolerance: 'Low - financial services regulatory environment'
    },
    completion_date: '2024-01-20',
    completed_by: 'Sarah Johnson',
    created_by: 'demo-user'
  },
  {
    id: '2',
    project_id: '2',
    questionnaire_type: 'security_assessment',
    title: 'Healthcare Zero Trust Security Evaluation',
    status: 'in_progress',
    responses: {
      current_threats: 'Medical device vulnerabilities, ransomware concerns',
      compliance_gaps: 'IoT device inventory, access logging',
      security_incidents: '2 minor breaches in past year',
      staff_training: 'Basic cybersecurity awareness',
      budget_constraints: 'Limited capital budget, prefer OpEx model',
      integration_requirements: 'Epic EMR, Philips monitoring systems'
    },
    completion_date: null,
    completed_by: null,
    created_by: 'demo-user'
  }
];

const demoAnalytics = {
  totalProjects: 5,
  activeProjects: 3,
  completedProjects: 1,
  totalSites: 25,
  averageProjectValue: 450000,
  successRate: 94,
  deploymentStats: {
    planning: 2,
    implementing: 2,
    testing: 0,
    completed: 1
  },
  complianceBreakdown: {
    'PCI-DSS': 3,
    'HIPAA': 2,
    'SOX': 2,
    'FISMA': 1,
    'ISO 27001': 3
  },
  monthlyProgress: [
    { month: 'Jan', projects: 1, budget: 450000 },
    { month: 'Feb', projects: 2, budget: 770000 },
    { month: 'Mar', projects: 3, budget: 1120000 },
    { month: 'Apr', projects: 4, budget: 1540000 },
    { month: 'May', projects: 5, budget: 1970000 }
  ]
};

// Export demo data directly for component use
export { demoProjects, demoSites, demoVendors, demoRequirements, demoUseCases, demoQuestionnaires, demoAnalytics };

export const useDemoData = () => {
  return {
    demoProjects,
    demoSites,
    demoVendors,
    demoRequirements,
    demoUseCases,
    demoQuestionnaires,
    demoAnalytics
  };
};

export const useSeedDemoData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get the current user for created_by field
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to seed demo data');
      }

      // Clear any existing demo data first
      await supabase.from('projects').delete().eq('created_by', user.id);
      await supabase.from('sites').delete().eq('created_by', user.id);

      // Insert demo sites
      const { error: sitesError } = await supabase
        .from('sites')
        .insert(demoSites.map(site => ({
          name: site.name,
          location: site.location,
          address: site.address,
          contact_name: site.contact_name,
          contact_email: site.contact_email,
          contact_phone: site.contact_phone,
          site_type: site.site_type,
          network_segments: site.network_segments,
          device_count: site.device_count,
          status: site.status,
          priority: site.priority,
          created_by: user.id
        })));

      if (sitesError) throw sitesError;

      // Insert demo projects
      const { error: projectsError } = await supabase
        .from('projects')
        .insert(demoProjects.map(project => ({
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          start_date: project.start_date,
          target_completion: project.target_completion,
          actual_completion: project.actual_completion,
          budget: project.budget,
          created_by: user.id
        })));

      if (projectsError) throw projectsError;

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Demo Data Loaded",
        description: "Comprehensive NAC deployment demo data has been successfully loaded into the platform.",
      });
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
    onError: (error) => {
      console.error('Error seeding demo data:', error);
      toast({
        title: "Error Loading Demo Data",
        description: "Failed to load demo data. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useClearDemoData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get the current user for filtering
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to clear demo data');
      }

      // Delete in correct order due to foreign key constraints
      await supabase.from('projects').delete().eq('created_by', user.id);
      await supabase.from('sites').delete().eq('created_by', user.id);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Demo Data Cleared",
        description: "All demo data has been successfully removed from the platform.",
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
    },
    onError: (error) => {
      console.error('Error clearing demo data:', error);
      toast({
        title: "Error Clearing Demo Data",
        description: "Failed to clear demo data. Please try again.",
        variant: "destructive",
      });
    },
  });
};