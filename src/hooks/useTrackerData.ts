import { useState, useEffect } from 'react';
import type { Site, SiteStats, Milestone, LibraryData } from '@/types/tracker';

// Mock data - in a real app this would come from your Supabase database
const mockSites: Site[] = [
  {
    id: '1',
    name: 'Headquarters East',
    customer: 'TechCorp Inc',
    region: 'North America',
    country: 'USA',
    status: 'In Progress',
    projectManager: 'Sarah Connor',
    technicalOwners: ['John Doe', 'Jane Smith'],
    wiredVendors: ['Cisco', 'HPE'],
    wirelessVendors: ['Aruba', 'Meraki'],
    deviceTypes: ['Switch', 'Access Point', 'Firewall'],
    radsec: 'Native',
    plannedStart: '2024-01-15',
    plannedEnd: '2024-03-15',
    completionPercent: 75,
    deploymentChecklist: [
      {
        id: 'c1',
        task: 'Network discovery completed',
        category: 'Discovery',
        completed: true,
        completedBy: 'John Doe',
        completedDate: '2024-01-20'
      },
      {
        id: 'c2',
        task: 'Policy configuration',
        category: 'Configuration',
        completed: false
      }
    ],
    notes: 'Deployment going well, minor network configuration adjustments needed'
  },
  {
    id: '2',
    name: 'Branch Office West',
    customer: 'Global Finance',
    region: 'North America',
    country: 'USA',
    status: 'Completed',
    projectManager: 'Mike Johnson',
    technicalOwners: ['Alex Wilson'],
    wiredVendors: ['Juniper'],
    wirelessVendors: ['Ubiquiti'],
    deviceTypes: ['Switch', 'Access Point'],
    radsec: 'Proxy',
    plannedStart: '2023-11-01',
    plannedEnd: '2024-01-01',
    completionPercent: 100,
    deploymentChecklist: [
      {
        id: 'c3',
        task: 'Final testing completed',
        category: 'Testing',
        completed: true,
        completedBy: 'Alex Wilson',
        completedDate: '2024-01-01'
      }
    ]
  },
  {
    id: '3',
    name: 'European HQ',
    customer: 'EuroTech Ltd',
    region: 'Europe',
    country: 'Germany',
    status: 'Planning',
    projectManager: 'Anna Schmidt',
    technicalOwners: ['Klaus Mueller'],
    wiredVendors: ['HPE'],
    wirelessVendors: ['Aruba'],
    deviceTypes: ['Switch', 'Access Point', 'Controller'],
    radsec: 'Native',
    plannedStart: '2024-04-01',
    plannedEnd: '2024-06-01',
    completionPercent: 25,
    deploymentChecklist: []
  },
  {
    id: '4',
    name: 'Manufacturing Plant',
    customer: 'IndustryCorp',
    region: 'Asia Pacific',
    country: 'Japan',
    status: 'At Risk',
    projectManager: 'Yuki Tanaka',
    technicalOwners: ['Hiroshi Sato'],
    wiredVendors: ['Cisco'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Switch', 'Access Point', 'IoT Gateway'],
    radsec: 'Native',
    plannedStart: '2024-02-01',
    plannedEnd: '2024-04-01',
    completionPercent: 35,
    deploymentChecklist: [
      {
        id: 'c4',
        task: 'IoT integration challenges',
        category: 'Integration',
        completed: false
      }
    ],
    notes: 'Experiencing integration issues with legacy IoT devices'
  }
];

const mockStats: SiteStats = {
  total_sites: 4,
  completed_sites: 1,
  in_progress_sites: 1,
  planned_sites: 1,
  delayed_sites: 1,
  total_users: 1250,
  overall_completion: 58.75
};

const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Q1 Deployment Complete',
    date: '2024-03-31',
    description: 'All Q1 planned deployments successfully completed'
  },
  {
    id: 'm2',
    title: 'European Expansion Launch',
    date: '2024-04-01',
    description: 'Beginning rollout to European sites'
  },
  {
    id: 'm3',
    title: 'IoT Integration Framework',
    date: '2024-05-15',
    description: 'New framework for IoT device integration deployed'
  },
  {
    id: 'm4',
    title: 'Security Audit Completion',
    date: '2024-06-30',
    description: 'Annual security audit and compliance review'
  }
];

export const useTrackerData = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSites(mockSites);
      setStats(mockStats);
      setMilestones(mockMilestones);
      setLoading(false);
    };

    fetchData();
  }, []);

  const createSite = async (siteData: Partial<Site>) => {
    const newSite: Site = {
      id: `site-${Date.now()}`,
      name: siteData.name || 'New Site',
      customer: siteData.customer || '',
      region: siteData.region || '',
      country: siteData.country || '',
      status: 'Planning',
      projectManager: siteData.projectManager || '',
      technicalOwners: siteData.technicalOwners || [],
      wiredVendors: siteData.wiredVendors || [],
      wirelessVendors: siteData.wirelessVendors || [],
      deviceTypes: siteData.deviceTypes || [],
      radsec: 'Native',
      plannedStart: new Date().toISOString(),
      plannedEnd: new Date().toISOString(),
      completionPercent: 0,
      deploymentChecklist: [],
      ...siteData
    };

    setSites(prev => [...prev, newSite]);
    
    // Update stats
    if (stats) {
      setStats(prev => prev ? {
        ...prev,
        total_sites: prev.total_sites + 1,
        planned_sites: prev.planned_sites + 1
      } : null);
    }

    return newSite;
  };

  const updateSite = async (id: string, updates: Partial<Site>) => {
    setSites(prev => prev.map(site => 
      site.id === id ? { ...site, ...updates } : site
    ));
  };

  const deleteSite = async (id: string) => {
    setSites(prev => prev.filter(site => site.id !== id));
    
    // Update stats
    if (stats) {
      setStats(prev => prev ? {
        ...prev,
        total_sites: prev.total_sites - 1
      } : null);
    }
  };

  return {
    sites,
    stats,
    milestones,
    loading,
    createSite,
    updateSite,
    deleteSite
  };
};