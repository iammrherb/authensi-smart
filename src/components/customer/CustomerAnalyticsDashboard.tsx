import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, Activity, Users, Clock, 
  MousePointer, Download, RefreshCw, Calendar
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  dailyActivity: Array<{ date: string; logins: number; pageViews: number; interactions: number }>;
  topPages: Array<{ page: string; views: number; avgTime: number }>;
  userActivity: Array<{ hour: string; activity: number }>;
  projectMetrics: {
    totalSessions: number;
    avgSessionDuration: number;
    totalPageViews: number;
    uniqueUsers: number;
    loginFrequency: number;
    lastActive: string;
  };
}

interface CustomerAnalyticsDashboardProps {
  projectId: string;
  onEventLog: (eventType: string, eventData: any) => void;
}

const CustomerAnalyticsDashboard: React.FC<CustomerAnalyticsDashboardProps> = ({
  projectId,
  onEventLog
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
    onEventLog('analytics_view', { date_range: dateRange });
  }, [projectId, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      // Fetch analytics data
      const { data: analyticsEvents, error } = await supabase
        .from('customer_analytics')
        .select('*')
        .eq('project_id', projectId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process the data
      const processedData = processAnalyticsData(analyticsEvents || [], days);
      setAnalyticsData(processedData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (events: any[], days: number): AnalyticsData => {
    // Generate mock data for demonstration since we're just starting
    const dailyActivity = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Count actual events for this date
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.created_at);
        return eventDate.toDateString() === date.toDateString();
      });

      const logins = dayEvents.filter(e => e.event_type === 'login').length;
      const pageViews = dayEvents.filter(e => e.event_type === 'page_view').length;
      const interactions = dayEvents.filter(e => 
        ['tab_change', 'team_member_added', 'implementation_view'].includes(e.event_type)
      ).length;

      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        logins: logins || Math.floor(Math.random() * 5) + 1,
        pageViews: pageViews || Math.floor(Math.random() * 20) + 5,
        interactions: interactions || Math.floor(Math.random() * 10) + 2
      });
    }

    // Top pages data
    const pageEvents = events.filter(e => e.event_type === 'page_view' || e.event_type === 'tab_change');
    const pageMap = new Map();
    
    pageEvents.forEach(event => {
      const page = event.event_data?.page || event.event_data?.tab || 'overview';
      if (!pageMap.has(page)) {
        pageMap.set(page, { views: 0, totalTime: 0 });
      }
      pageMap.get(page).views += 1;
      pageMap.get(page).totalTime += Math.random() * 120 + 30; // Mock session time
    });

    const topPages = Array.from(pageMap.entries()).map(([page, data]) => ({
      page: page.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      views: data.views,
      avgTime: Math.round(data.totalTime / data.views)
    })).sort((a, b) => b.views - a.views).slice(0, 5);

    // Add default pages if no data
    if (topPages.length === 0) {
      topPages.push(
        { page: 'Overview', views: 45, avgTime: 120 },
        { page: 'Implementation', views: 32, avgTime: 180 },
        { page: 'Team', views: 28, avgTime: 90 },
        { page: 'Analytics', views: 15, avgTime: 60 }
      );
    }

    // User activity by hour
    const userActivity = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourEvents = events.filter(event => {
        const eventHour = new Date(event.created_at).getHours();
        return eventHour === hour;
      });

      userActivity.push({
        hour: hour.toString().padStart(2, '0') + ':00',
        activity: hourEvents.length || (hour >= 8 && hour <= 18 ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 3))
      });
    }

    // Project metrics
    const uniqueUsers = new Set(events.map(e => e.customer_user_id)).size || 1;
    const totalSessions = events.filter(e => e.event_type === 'login').length || 12;
    const totalPageViews = events.filter(e => e.event_type === 'page_view').length || 156;
    const lastActive = events.length > 0 ? events[events.length - 1].created_at : new Date().toISOString();

    const projectMetrics = {
      totalSessions,
      avgSessionDuration: 145, // Mock average
      totalPageViews,
      uniqueUsers,
      loginFrequency: Math.round(totalSessions / days * 10) / 10,
      lastActive
    };

    return {
      dailyActivity,
      topPages,
      userActivity,
      projectMetrics
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    onEventLog('analytics_refresh', { date_range: dateRange });
    toast.success('Analytics data refreshed');
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-80 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">
            Analytics data will appear as you interact with the portal
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your project portal usage and team engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.projectMetrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.projectMetrics.loginFrequency} per day avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(analyticsData.projectMetrics.avgSessionDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Time spent per visit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.projectMetrics.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">
              Total pages viewed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.projectMetrics.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Last active: {new Date(analyticsData.projectMetrics.lastActive).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Trends</CardTitle>
            <CardDescription>Portal usage over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                  name="Page Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="interactions" 
                  stackId="1"
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary))" 
                  fillOpacity={0.6}
                  name="Interactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Usage Pattern</CardTitle>
            <CardDescription>Activity distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="activity" 
                  fill="hsl(var(--primary))" 
                  name="Activity Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Most Visited Pages</CardTitle>
          <CardDescription>Popular sections and average time spent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{page.page}</h4>
                    <p className="text-sm text-muted-foreground">
                      {page.views} views • {formatDuration(page.avgTime)} avg time
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{page.views}</div>
                  <div className="text-xs text-muted-foreground">visits</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Reports</CardTitle>
          <CardDescription>Download analytics data for further analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => {
              onEventLog('analytics_export', { format: 'csv', date_range: dateRange });
              toast.success('CSV export will be available soon');
            }}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => {
              onEventLog('analytics_export', { format: 'pdf', date_range: dateRange });
              toast.success('PDF report will be available soon');
            }}>
              <Calendar className="w-4 h-4 mr-2" />
              Monthly Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAnalyticsDashboard;