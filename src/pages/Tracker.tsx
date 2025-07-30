import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TabLayout from '@/components/layout/TabLayout';
import { useTrackerData } from '@/hooks/useTrackerData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TrackerDashboard from '@/components/tracker/TrackerDashboard';
import PortnoxTracker from '@/components/tracker/PortnoxTracker';
import UnifiedProjectTracker from '@/components/tracker/UnifiedProjectTracker';
import { BarChart3, Target, Zap } from 'lucide-react';

const Tracker = () => {
  const { sites, stats, milestones, loading, createSite } = useTrackerData();

  const handleCreateSite = () => {
    createSite({
      name: `New Site ${sites.length + 1}`,
      status: 'Planning' as const
    });
  };

  if (loading) {
    return (
      <PageLayout title="Implementation Command Center" subtitle="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  const tabs = [
    {
      id: 'unified',
      label: 'Unified Tracker',
      icon: Target,
      content: <UnifiedProjectTracker />
    },
    {
      id: 'portnox',
      label: 'Portnox Tracker',
      icon: BarChart3,
      content: <PortnoxTracker />
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <TrackerDashboard 
            sites={sites}
            stats={stats}
            milestones={milestones}
            onCreateSite={handleCreateSite}
          />
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="Implementation Command Center"
      subtitle="Comprehensive project management for Portnox NAC deployments. Monitor real-time progress, track critical milestones, manage resources, and ensure successful enterprise implementations."
      badge={{
        text: "Enterprise Deployment Suite",
        variant: "glow",
        icon: Zap
      }}
    >
      <TabLayout tabs={tabs} defaultTab="unified" />
    </PageLayout>
  );
};

export default Tracker;