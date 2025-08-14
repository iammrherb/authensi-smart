import React from 'react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  MapPin, 
  FileSearch, 
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { useRealtimeStats } from '@/hooks/useRealtimeStats';

export const RealtimeDashboardStats: React.FC = () => {
  const { data: stats, isLoading } = useRealtimeStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <EnhancedCard key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded"></div>
          </EnhancedCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Overview */}
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-3xl font-bold text-primary">{stats.projects.total}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-primary/60" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Active: {stats.projects.active}</span>
              <span>Completed: {stats.projects.completed}</span>
            </div>
            <Progress 
              value={(stats.projects.completed / Math.max(stats.projects.total, 1)) * 100} 
              className="h-2"
            />
          </div>
        </EnhancedCard>

        {/* Sites Overview */}
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sites</p>
              <p className="text-3xl font-bold text-secondary">{stats.sites.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-secondary/60" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Planning: {stats.sites.planning}</span>
              <span>Deployed: {stats.sites.deployed}</span>
            </div>
            <Progress 
              value={(stats.sites.deployed / Math.max(stats.sites.total, 1)) * 100} 
              className="h-2"
            />
          </div>
        </EnhancedCard>

        {/* Scoping Sessions */}
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scoping Sessions</p>
              <p className="text-3xl font-bold text-accent">{stats.scoping.total}</p>
            </div>
            <FileSearch className="h-8 w-8 text-accent/60" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Draft: {stats.scoping.draft}</span>
              <span>Completed: {stats.scoping.completed}</span>
            </div>
            <Progress 
              value={(stats.scoping.completed / Math.max(stats.scoping.total, 1)) * 100} 
              className="h-2"
            />
          </div>
        </EnhancedCard>

        {/* Average Progress */}
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
              <p className="text-3xl font-bold text-primary">{stats.averageProgress}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/60" />
          </div>
          <div className="mt-4">
            <Progress value={stats.averageProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across {stats.totalImplementations} implementations
            </p>
          </div>
        </EnhancedCard>
      </div>

      {/* Status Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Status Breakdown */}
        <EnhancedCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Project Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Active</span>
              </div>
              <Badge variant="default">{stats.projects.active}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm">Pending</span>
              </div>
              <Badge variant="secondary">{stats.projects.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm">Completed</span>
              </div>
              <Badge variant="default">{stats.projects.completed}</Badge>
            </div>
          </div>
        </EnhancedCard>

        {/* Site Status Breakdown */}
        <EnhancedCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            Site Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-sm">Planning</span>
              </div>
              <Badge variant="secondary">{stats.sites.planning}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-warning" />
                <span className="text-sm">Implementing</span>
              </div>
              <Badge variant="secondary">{stats.sites.implementing}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Deployed</span>
              </div>
              <Badge variant="default">{stats.sites.deployed}</Badge>
            </div>
          </div>
        </EnhancedCard>

        {/* Scoping Status Breakdown */}
        <EnhancedCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-accent" />
            Scoping Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted" />
                <span className="text-sm">Draft</span>
              </div>
              <Badge variant="outline">{stats.scoping.draft}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Completed</span>
              </div>
              <Badge variant="default">{stats.scoping.completed}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Archived</span>
              </div>
              <Badge variant="secondary">{stats.scoping.archived}</Badge>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
};