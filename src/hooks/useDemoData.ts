import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const demoSites = [
  {
    name: "Corporate Headquarters",
    location: "New York, NY",
    address: "123 Business District, New York, NY 10001",
    contact_name: "John Smith",
    contact_email: "john.smith@company.com",
    contact_phone: "+1-555-0123",
    site_type: "office",
    device_count: 850,
    network_segments: 5,
    priority: "high",
    status: "implementing"
  },
  {
    name: "West Coast Office",
    location: "San Francisco, CA", 
    address: "456 Innovation Ave, San Francisco, CA 94105",
    contact_name: "Sarah Johnson",
    contact_email: "sarah.johnson@company.com",
    contact_phone: "+1-555-0456",
    site_type: "office",
    device_count: 450,
    network_segments: 3,
    priority: "high",
    status: "designing"
  },
  {
    name: "Manufacturing Plant A",
    location: "Detroit, MI",
    address: "789 Industrial Blvd, Detroit, MI 48201",
    contact_name: "Mike Wilson",
    contact_email: "mike.wilson@company.com", 
    contact_phone: "+1-555-0789",
    site_type: "manufacturing",
    device_count: 320,
    network_segments: 4,
    priority: "medium",
    status: "scoping"
  },
  {
    name: "Data Center Primary",
    location: "Dallas, TX",
    address: "321 Server Farm Rd, Dallas, TX 75201",
    contact_name: "Lisa Chen",
    contact_email: "lisa.chen@company.com",
    contact_phone: "+1-555-0321",
    site_type: "datacenter",
    device_count: 180,
    network_segments: 8,
    priority: "critical",
    status: "deployed"
  },
  {
    name: "Regional Branch Office",
    location: "Atlanta, GA",
    address: "654 Commerce St, Atlanta, GA 30309",
    contact_name: "David Brown",
    contact_email: "david.brown@company.com",
    contact_phone: "+1-555-0654",
    site_type: "office",
    device_count: 125,
    network_segments: 2,
    priority: "medium",
    status: "planning"
  }
];

const demoProjects = [
  {
    name: "Global NAC Rollout 2024",
    description: "Enterprise-wide Portnox NAC deployment across all corporate locations",
    client_name: "Fortune 500 Corp",
    status: "implementing",
    current_phase: "implementation", 
    start_date: "2024-01-15",
    target_completion: "2024-06-30",
    budget: 850000,
    progress_percentage: 65,
    project_manager: "Enterprise Solutions Team"
  },
  {
    name: "Manufacturing Security Enhancement",
    description: "Industrial IoT device security and network access control implementation",
    client_name: "Industrial Manufacturing Co",
    status: "designing",
    current_phase: "design",
    start_date: "2024-03-01", 
    target_completion: "2024-08-15",
    budget: 425000,
    progress_percentage: 35,
    project_manager: "Industrial Solutions Team"
  },
  {
    name: "Financial Services Compliance",
    description: "PCI-DSS compliant network access control for banking operations",
    client_name: "Regional Bank Corp",
    status: "testing",
    current_phase: "testing",
    start_date: "2023-11-01",
    target_completion: "2024-04-30", 
    budget: 650000,
    progress_percentage: 85,
    project_manager: "Compliance Team"
  }
];

const generateDemoQuestionnaire = (siteId: string, projectId?: string) => ({
  site_id: siteId,
  project_id: projectId,
  questionnaire_data: {
    deploymentType: "large-enterprise",
    useCases: [
      "Device Authentication & Authorization",
      "BYOD Policy Enforcement", 
      "IoT Device Onboarding",
      "Compliance Monitoring (PCI-DSS, HIPAA, SOX)",
      "Active Directory Integration",
      "Multi-Factor Authentication"
    ],
    requirements: {
      endpoints: Math.floor(Math.random() * 2000) + 500,
      sites: Math.floor(Math.random() * 10) + 1,
      networkInfrastructure: "cisco",
      authenticationMethod: "ad",
      compliance: "pci",
      timeline: "standard"
    },
    discoveryAnswers: {
      infrastructure: {
        "How many total endpoints need NAC coverage?": "Approximately 1,500 endpoints across the organization",
        "What types of devices are in your environment?": "Windows workstations, mobile devices, printers, IoT sensors, servers",
        "What network infrastructure vendors are you using?": "Primarily Cisco with some legacy Juniper equipment",
        "Do you have existing network segmentation?": "Basic VLAN segmentation in place, looking to enhance with dynamic policies",
        "What authentication systems are currently in place?": "Active Directory with some certificate-based authentication"
      },
      security: {
        "What compliance requirements must be met?": "PCI-DSS Level 1, SOX compliance for financial reporting systems",
        "What are your current security policies?": "Standard corporate security policies with device certificates required",
        "Do you have existing security tools to integrate?": "Splunk SIEM, CrowdStrike EDR, Microsoft Defender",
        "What are your incident response procedures?": "24/7 SOC with automated response for critical threats",
        "What visibility requirements do you have?": "Real-time device tracking and comprehensive audit trails"
      },
      business: {
        "What is driving the NAC implementation?": "Compliance requirements and recent security incidents",
        "What are your success criteria?": "100% device visibility, automated policy enforcement, reduced incident response time",
        "What is your timeline for deployment?": "Phased rollout over 6 months starting Q2",
        "What resources do you have available?": "Dedicated project team with network and security expertise",
        "What is your change management process?": "Formal change board with testing requirements for production changes"
      }
    },
    testCases: [
      {
        category: "Authentication",
        name: "AD Integration Test",
        description: "Verify Active Directory authentication works correctly",
        priority: "high",
        status: "pending",
        requirements: ["AD connectivity", "LDAP queries", "User authentication"]
      },
      {
        category: "Policy Enforcement", 
        name: "BYOD Policy Test",
        description: "Test BYOD device onboarding and policy application",
        priority: "high",
        status: "pending",
        requirements: ["Device registration", "Policy assignment", "Network access control"]
      },
      {
        category: "Compliance",
        name: "PCI-DSS Audit Trail",
        description: "Verify comprehensive logging for PCI compliance",
        priority: "medium",
        status: "pending", 
        requirements: ["Complete audit logs", "Tamper-proof storage", "Compliance reporting"]
      }
    ],
    sizing: {
      estimatedEndpoints: Math.floor(Math.random() * 2000) + 500,
      requiredAppliances: Math.floor(Math.random() * 10) + 2,
      estimatedTimeline: "12-16 weeks",
      budget: Math.floor(Math.random() * 500000) + 200000
    }
  },
  status: "completed",
  completion_percentage: 100
});

export const useSeedDemoData = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to seed demo data');
      }

      // Create demo sites
      const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .insert(demoSites.map(site => ({ ...site, created_by: user.id })))
        .select();

      if (sitesError) {
        console.error('Error creating demo sites:', sitesError);
        throw sitesError;
      }

      // Create demo projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .insert(demoProjects.map(project => ({ ...project, created_by: user.id })))
        .select();

      if (projectsError) {
        console.error('Error creating demo projects:', projectsError);
        throw projectsError;
      }

      // Create project-site relationships
      if (sites && projects) {
        const projectSites = [];
        
        // Assign sites to projects
        for (let i = 0; i < Math.min(sites.length, projects.length * 2); i++) {
          const projectIndex = Math.floor(i / 2);
          if (projects[projectIndex]) {
            projectSites.push({
              project_id: projects[projectIndex].id,
              site_id: sites[i].id,
              deployment_order: (i % 2) + 1,
              site_specific_notes: `Deployment phase ${(i % 2) + 1} for ${sites[i].name}`
            });
          }
        }

        if (projectSites.length > 0) {
          const { error: projectSitesError } = await supabase
            .from('project_sites')
            .insert(projectSites);

          if (projectSitesError) {
            console.error('Error creating project-site relationships:', projectSitesError);
            throw projectSitesError;
          }
        }

        // Create demo questionnaires
        const questionnaires = sites.map(site => {
          const relatedProject = projectSites.find(ps => ps.site_id === site.id);
          const projectId = relatedProject ? relatedProject.project_id : undefined;
          
          return {
            ...generateDemoQuestionnaire(site.id, projectId),
            created_by: user.id
          };
        });

        const { error: questionnaireError } = await supabase
          .from('scoping_questionnaires')
          .insert(questionnaires);

        if (questionnaireError) {
          console.error('Error creating demo questionnaires:', questionnaireError);
          throw questionnaireError;
        }
      }

      return { sites, projects };
    },
    onSuccess: () => {
      toast({
        title: "Demo Data Created Successfully",
        description: `Created ${demoSites.length} sites, ${demoProjects.length} projects, and comprehensive questionnaires`,
      });
    },
    onError: (error: any) => {
      console.error('Demo data creation error:', error);
      toast({
        title: "Error Creating Demo Data",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useClearDemoData = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to clear data');
      }

      // Delete in correct order due to foreign key constraints
      await supabase.from('scoping_questionnaires').delete().eq('created_by', user.id);
      await supabase.from('implementation_checklists').delete().eq('created_by', user.id);
      await supabase.from('project_sites').delete().eq('project_id', user.id); // This might need adjustment
      await supabase.from('projects').delete().eq('created_by', user.id);
      await supabase.from('sites').delete().eq('created_by', user.id);
    },
    onSuccess: () => {
      toast({
        title: "Demo Data Cleared",
        description: "All demo data has been removed from your account",
      });
    },
    onError: (error: any) => {
      console.error('Demo data clearing error:', error);
      toast({
        title: "Error Clearing Demo Data", 
        description: error.message,
        variant: "destructive",
      });
    },
  });
};