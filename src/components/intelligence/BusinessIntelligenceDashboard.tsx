import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Building2, Search, TrendingUp, AlertTriangle, Globe, Shield, 
  Users, DollarSign, Calendar, FileText, ExternalLink, Plus,
  Brain, Zap, Target, BarChart3, PieChart, Activity, Wifi,
  Database, Settings, Bell, Eye, Download, RefreshCw, Filter
} from 'lucide-react';

import { useWebIntelligence } from '@/hooks/useWebIntelligence';
import { useToast } from '@/hooks/use-toast';

interface BusinessIntelligenceDashboardProps {
  className?: string;
}

const BusinessIntelligenceDashboard: React.FC<BusinessIntelligenceDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ name: '', domain: '', industry: '' });

  const { toast } = useToast();

  const {
    generateBusinessProfile,
    getBusinessProfile,
    searchContent,
    getSecurityAlerts,
    getWirelessRecommendations,
    addExternalLink,
    getContentAnalytics,
    isLoading,
    error,
    businessProfiles,
    clearError
  } = useWebIntelligence({ autoRefresh: true });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [contentAnalytics, setContentAnalytics] = useState<any>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load security alerts
      const alerts = await getSecurityAlerts(['Cisco', 'Aruba', 'Fortinet']);
      setSecurityAlerts(alerts);

      // Load content analytics
      const analytics = await getContentAnalytics();
      setContentAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await searchContent(searchQuery, {
        contentTypes: ['vendor_docs', 'best_practices', 'security_advisory'],
        qualityThreshold: 0.6
      });
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search terms or filters.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateBusinessProfile = async () => {
    if (!newCompanyData.name.trim()) return;

    try {
      await generateBusinessProfile(newCompanyData.name, newCompanyData.domain);
      setSelectedCompany(newCompanyData.name);
      setShowAddCompanyDialog(false);
      setNewCompanyData({ name: '', domain: '', industry: '' });
      setActiveTab('profiles');
    } catch (error) {
      toast({
        title: "Profile Generation Failed",
        description: "Failed to generate business profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedProfile = selectedCompany ? getBusinessProfile(selectedCompany) : null;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Profiles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessProfiles.size}</div>
            <p className="text-xs text-muted-foreground">
              Active intelligence profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityAlerts.filter(a => a.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical alerts requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentAnalytics.totalSources || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active crawl targets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentAnalytics.totalDocuments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Crawled documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {Array.from(businessProfiles.entries()).slice(0, 5).map(([name, profile]) => (
                  <div key={name} className="flex items-center space-x-3 p-2 border rounded">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{name}</h4>
                      <p className="text-xs text-muted-foreground">{profile.industry}</p>
                    </div>
                    <Badge variant="outline">
                      {Math.round(profile.nacReadiness.readinessScore * 100)}% Ready
                    </Badge>
                  </div>
                ))}
                {businessProfiles.size === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No business profiles yet</p>
                    <p className="text-xs">Generate profiles to see intelligence data</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {securityAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-2 border rounded">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.affectedVendors.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {securityAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No security alerts</p>
                    <p className="text-xs">All systems secure</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Intelligent Content Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search vendor documentation, best practices, security advisories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <EnhancedButton
              onClick={handleSearch}
              loading={isLoading}
              className="px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {result.snippet}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {result.source}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(result.lastUpdated).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(result.relevance * 100)}% match
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Button size="sm" variant="outline" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Quality: {Math.round(result.metadata.qualityScore * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    {result.metadata.vendor && result.metadata.vendor.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {result.metadata.vendor.map((vendor: string) => (
                          <Badge key={vendor} variant="secondary" className="text-xs">
                            {vendor}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBusinessProfilesTab = () => (
    <div className="space-y-6">
      {/* Profile Management */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Business Intelligence Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive business analysis and NAC readiness assessment
          </p>
        </div>
        <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
          <DialogTrigger asChild>
            <EnhancedButton>
              <Plus className="h-4 w-4 mr-2" />
              Generate Profile
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Business Profile</DialogTitle>
              <DialogDescription>
                Create a comprehensive business intelligence profile with market analysis and NAC readiness assessment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={newCompanyData.name}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain (Optional)</Label>
                <Input
                  id="domain"
                  value={newCompanyData.domain}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, domain: e.target.value })}
                  placeholder="company.com"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={newCompanyData.industry} onValueChange={(value) => setNewCompanyData({ ...newCompanyData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddCompanyDialog(false)}>
                  Cancel
                </Button>
                <EnhancedButton
                  onClick={handleGenerateBusinessProfile}
                  loading={isLoading}
                  disabled={!newCompanyData.name.trim()}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Profile
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Selection */}
      {businessProfiles.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Company Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a company to view profile" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(businessProfiles.entries()).map(([name, profile]) => (
                  <SelectItem key={name} value={name}>
                    <div className="flex items-center space-x-2">
                      <span>{name}</span>
                      <Badge variant="outline" className="text-xs">
                        {profile.industry}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Selected Profile Details */}
      {selectedProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Industry</Label>
                <p className="text-sm text-muted-foreground">{selectedProfile.industry}</p>
              </div>
              {selectedProfile.employees && (
                <div>
                  <Label className="text-sm font-medium">Employees</Label>
                  <p className="text-sm text-muted-foreground">{selectedProfile.employees.toLocaleString()}</p>
                </div>
              )}
              {selectedProfile.marketCap && (
                <div>
                  <Label className="text-sm font-medium">Market Cap</Label>
                  <p className="text-sm text-muted-foreground">${(selectedProfile.marketCap / 1000000000).toFixed(1)}B</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Cybersecurity Maturity</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{selectedProfile.cybersecurityPosture.maturityLevel}</Badge>
                  <Progress value={
                    selectedProfile.cybersecurityPosture.maturityLevel === 'optimized' ? 100 :
                    selectedProfile.cybersecurityPosture.maturityLevel === 'managed' ? 80 :
                    selectedProfile.cybersecurityPosture.maturityLevel === 'defined' ? 60 :
                    selectedProfile.cybersecurityPosture.maturityLevel === 'developing' ? 40 : 20
                  } className="flex-1 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NAC Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                NAC Readiness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Overall Readiness</Label>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(selectedProfile.nacReadiness.readinessScore * 100)}%
                  </span>
                </div>
                <Progress value={selectedProfile.nacReadiness.readinessScore * 100} className="h-3" />
              </div>
              
              {selectedProfile.nacReadiness.keyDrivers.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Key Drivers</Label>
                  <div className="space-y-2">
                    {selectedProfile.nacReadiness.keyDrivers.slice(0, 3).map((driver, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{driver}</span>
                        <Badge variant="secondary">High Priority</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile.preferredVendors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Preferred Vendors</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfile.preferredVendors.slice(0, 5).map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor.vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Intelligence */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="news" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="news">Recent News</TabsTrigger>
                  <TabsTrigger value="acquisitions">Acquisitions</TabsTrigger>
                  <TabsTrigger value="jobs">Job Market</TabsTrigger>
                </TabsList>

                <TabsContent value="news" className="space-y-3">
                  {selectedProfile.recentNews.length > 0 ? (
                    selectedProfile.recentNews.slice(0, 5).map((news, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{news.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{news.summary}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{news.source}</span>
                          <Badge variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'} className="text-xs">
                            {news.sentiment}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent news available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="acquisitions" className="space-y-3">
                  {selectedProfile.acquisitions.length > 0 ? (
                    selectedProfile.acquisitions.slice(0, 5).map((acquisition, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{acquisition.targetCompany}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{acquisition.rationale}</p>
                        {acquisition.amount && (
                          <p className="text-xs font-medium mt-1">${(acquisition.amount / 1000000).toFixed(0)}M</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent acquisitions</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="jobs" className="space-y-3">
                  {selectedProfile.jobOpenings.length > 0 ? (
                    selectedProfile.jobOpenings.slice(0, 5).map((job, index) => (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.department} • {job.location}</p>
                        {job.vendorSpecific && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {job.vendorSpecific}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent job openings</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {businessProfiles.size === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Business Profiles</h3>
            <p className="text-muted-foreground mb-4">
              Generate comprehensive business intelligence profiles to get started.
            </p>
            <EnhancedButton onClick={() => setShowAddCompanyDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate First Profile
            </EnhancedButton>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence Center</h1>
          <p className="text-muted-foreground">
            Comprehensive market analysis, security monitoring, and NAC readiness assessment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {error && (
            <Alert className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <EnhancedButton
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </EnhancedButton>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Content Search</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Business Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="wireless" className="flex items-center space-x-2">
            <Wifi className="h-4 w-4" />
            <span>Wireless Intelligence</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
        <TabsContent value="search">{renderSearchTab()}</TabsContent>
        <TabsContent value="profiles">{renderBusinessProfilesTab()}</TabsContent>
        <TabsContent value="wireless">
          <Card>
            <CardContent className="text-center py-12">
              <Wifi className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Wireless Intelligence</h3>
              <p className="text-muted-foreground">
                Advanced wireless configuration recommendations and best practices coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligenceDashboard;
