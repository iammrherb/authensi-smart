import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, Shield, Settings, Code, AlertTriangle, CheckCircle, 
  Copy, Download, ExternalLink, Plus, Search, Filter,
  Zap, Timer, Signal, Lock, Key, Globe, Smartphone,
  Router, Cpu, Database, FileText, BookOpen, Star
} from 'lucide-react';

import { useWebIntelligence } from '@/hooks/useWebIntelligence';
import { useToast } from '@/hooks/use-toast';

interface WirelessIntelligencePanelProps {
  className?: string;
}

interface WirelessConfigFilter {
  vendor?: string;
  securityLevel?: string;
  authMethod?: string;
  standard?: string;
  useCase?: string;
}

interface WirelessRecommendation {
  id: string;
  vendor: string;
  product: string;
  model: string;
  useCase: string;
  securityLevel: 'basic' | 'standard' | 'advanced' | 'enterprise';
  configuration: {
    standard: string;
    authMethod: string;
    encryptionType: string;
    keyManagement: string;
    radiusSettings: any;
    advancedSettings: any;
  };
  configTemplate: string;
  cliCommands: string[];
  bestPractices: string[];
  warnings: string[];
  commonIssues: string[];
  successRate: number;
  lastTested: string;
  source: string;
}

const WirelessIntelligencePanel: React.FC<WirelessIntelligencePanelProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WirelessConfigFilter>({});
  const [selectedRecommendation, setSelectedRecommendation] = useState<WirelessRecommendation | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<WirelessRecommendation[]>([]);

  const { toast } = useToast();
  const { getWirelessRecommendations, addWirelessConfiguration, isLoading, error } = useWebIntelligence();

  // Mock data for demonstration
  const mockRecommendations: WirelessRecommendation[] = [
    {
      id: '1',
      vendor: 'Cisco',
      product: 'ISE',
      model: '3415',
      useCase: 'Enterprise Wireless',
      securityLevel: 'enterprise',
      configuration: {
        standard: '802.11ax',
        authMethod: 'WPA3-Enterprise',
        encryptionType: 'GCMP-256',
        keyManagement: 'WPA3',
        radiusSettings: {
          serverIP: '192.168.1.100',
          authPort: 1812,
          acctPort: 1813,
          timeout: 5,
          retries: 3
        },
        advancedSettings: {
          fastRoaming: true,
          bandSteering: true,
          channelWidth: '160MHz',
          beaconInterval: 100
        }
      },
      configTemplate: `# Cisco ISE WPA3-Enterprise Configuration
wlan create 21 Enterprise-WPA3 Enterprise-WPA3
wlan ssid 21 "YourSSID"
wlan security wpa akm 802.1x 21
wlan security wpa akm psk 21 disable
wlan security wpa wpa3 21
wlan security wpa wpa3 ciphers gcmp-256 21
wlan radius auth add 21 1 192.168.1.100 1812 ascii YourRadiusSecret
wlan enable 21`,
      cliCommands: [
        'wlan create 21 Enterprise-WPA3 Enterprise-WPA3',
        'wlan ssid 21 "YourSSID"',
        'wlan security wpa akm 802.1x 21',
        'wlan security wpa wpa3 21',
        'wlan radius auth add 21 1 192.168.1.100 1812 ascii YourRadiusSecret'
      ],
      bestPractices: [
        'Use WPA3 for maximum security',
        'Enable Protected Management Frames (PMF)',
        'Use strong RADIUS shared secrets',
        'Implement certificate-based authentication when possible',
        'Enable fast roaming for seamless connectivity'
      ],
      warnings: [
        'WPA3 requires compatible client devices',
        'Mixed WPA2/WPA3 environments may have compatibility issues',
        'Ensure RADIUS server supports WPA3'
      ],
      commonIssues: [
        'Client compatibility with WPA3',
        'RADIUS server connectivity',
        'Certificate deployment challenges'
      ],
      successRate: 0.92,
      lastTested: '2024-01-15',
      source: 'https://cisco.com/ise-wireless-config'
    },
    {
      id: '2',
      vendor: 'Aruba',
      product: 'ClearPass',
      model: '6.11',
      useCase: 'Enterprise Wireless',
      securityLevel: 'standard',
      configuration: {
        standard: '802.11ac',
        authMethod: 'WPA2-Enterprise',
        encryptionType: 'CCMP',
        keyManagement: 'WPA2',
        radiusSettings: {
          serverIP: '192.168.1.100',
          authPort: 1812,
          acctPort: 1813,
          timeout: 5,
          retries: 3
        },
        advancedSettings: {
          fastRoaming: true,
          bandSteering: false,
          channelWidth: '80MHz',
          beaconInterval: 100
        }
      },
      configTemplate: `# Aruba ClearPass WPA2-Enterprise Configuration
wlan ssid-profile "Enterprise-SSID"
   ssid "YourSSID"
   wpa-passphrase-type wpa2
   wpa2-psk-mixed disable
   authentication-server-group "ClearPass-Servers"
   exit`,
      cliCommands: [
        'wlan ssid-profile "Enterprise-SSID"',
        'ssid "YourSSID"',
        'wpa-passphrase-type wpa2',
        'authentication-server-group "ClearPass-Servers"'
      ],
      bestPractices: [
        'Use 802.1X with EAP-TLS for strongest security',
        'Implement dynamic VLAN assignment',
        'Enable accounting for user tracking',
        'Configure proper RADIUS timeouts'
      ],
      warnings: [
        'Ensure client certificates are properly deployed',
        'Monitor RADIUS server availability',
        'Test roaming scenarios thoroughly'
      ],
      commonIssues: [
        'Certificate validation failures',
        'VLAN assignment issues',
        'Roaming delays'
      ],
      successRate: 0.89,
      lastTested: '2024-01-10',
      source: 'https://arubanetworks.com/clearpass-wireless'
    }
  ];

  useEffect(() => {
    setRecommendations(mockRecommendations);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // In real implementation, this would search actual recommendations
      const filteredRecommendations = mockRecommendations.filter(rec =>
        rec.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.useCase.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setRecommendations(filteredRecommendations);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search wireless configurations.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = () => {
    let filteredRecommendations = mockRecommendations;

    if (filters.vendor) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.vendor === filters.vendor);
    }
    if (filters.securityLevel) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.securityLevel === filters.securityLevel);
    }
    if (filters.authMethod) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.configuration.authMethod === filters.authMethod);
    }
    if (filters.standard) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.configuration.standard === filters.standard);
    }
    if (filters.useCase) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.useCase.toLowerCase().includes(filters.useCase.toLowerCase()));
    }

    setRecommendations(filteredRecommendations);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Configuration has been copied to clipboard.",
      variant: "default",
    });
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'enterprise': return 'bg-green-500';
      case 'advanced': return 'bg-blue-500';
      case 'standard': return 'bg-yellow-500';
      case 'basic': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.9) return 'text-green-600';
    if (rate >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Wireless Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by vendor, product, or use case..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <EnhancedButton onClick={handleSearch} loading={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </EnhancedButton>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label className="text-xs">Vendor</Label>
                <Select value={filters.vendor || ''} onValueChange={(value) => setFilters({ ...filters, vendor: value })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Vendor</SelectItem>
                    <SelectItem value="Cisco">Cisco</SelectItem>
                    <SelectItem value="Aruba">Aruba</SelectItem>
                    <SelectItem value="Fortinet">Fortinet</SelectItem>
                    <SelectItem value="Juniper">Juniper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Security Level</Label>
                <Select value={filters.securityLevel || ''} onValueChange={(value) => setFilters({ ...filters, securityLevel: value })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Level</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Auth Method</Label>
                <Select value={filters.authMethod || ''} onValueChange={(value) => setFilters({ ...filters, authMethod: value })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Method</SelectItem>
                    <SelectItem value="WPA3-Enterprise">WPA3-Enterprise</SelectItem>
                    <SelectItem value="WPA2-Enterprise">WPA2-Enterprise</SelectItem>
                    <SelectItem value="802.1X">802.1X</SelectItem>
                    <SelectItem value="EAP-TLS">EAP-TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Standard</Label>
                <Select value={filters.standard || ''} onValueChange={(value) => setFilters({ ...filters, standard: value })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Standard</SelectItem>
                    <SelectItem value="802.11ax">802.11ax (Wi-Fi 6)</SelectItem>
                    <SelectItem value="802.11ac">802.11ac (Wi-Fi 5)</SelectItem>
                    <SelectItem value="802.11be">802.11be (Wi-Fi 7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <EnhancedButton variant="outline" onClick={applyFilters} className="h-8 w-full">
                  <Filter className="h-3 w-3 mr-1" />
                  Apply
                </EnhancedButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedRecommendation(rec)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{rec.vendor} {rec.product}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSecurityLevelColor(rec.securityLevel)} text-white`}>
                    {rec.securityLevel}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className={`text-sm font-medium ${getSuccessRateColor(rec.successRate)}`}>
                      {Math.round(rec.successRate * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Model</Label>
                  <p className="font-medium">{rec.model}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Use Case</Label>
                  <p className="font-medium">{rec.useCase}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Standard</Label>
                  <p className="font-medium">{rec.configuration.standard}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Auth Method</Label>
                  <p className="font-medium">{rec.configuration.authMethod}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Key Features</Label>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">{rec.configuration.encryptionType}</Badge>
                  <Badge variant="outline" className="text-xs">{rec.configuration.keyManagement}</Badge>
                  {rec.configuration.advancedSettings.fastRoaming && (
                    <Badge variant="outline" className="text-xs">Fast Roaming</Badge>
                  )}
                  {rec.configuration.advancedSettings.bandSteering && (
                    <Badge variant="outline" className="text-xs">Band Steering</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  <span>Updated {rec.lastTested}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); copyToClipboard(rec.configTemplate); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                    <a href={rec.source} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Wifi className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Configurations Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find wireless configurations.
            </p>
            <EnhancedButton variant="outline" onClick={() => {
              setSearchQuery('');
              setFilters({});
              setRecommendations(mockRecommendations);
            }}>
              Clear Filters
            </EnhancedButton>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBestPracticesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Wireless Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WPA3 Enterprise */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              WPA3-Enterprise Configuration
            </h3>
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use WPA3-Enterprise with GCMP-256 encryption for maximum security</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Enable Protected Management Frames (PMF) to prevent deauthentication attacks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Implement certificate-based authentication (EAP-TLS) when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use strong RADIUS shared secrets (minimum 20 characters)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 802.1X Configuration */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Key className="h-5 w-5 mr-2 text-blue-600" />
              802.1X Authentication
            </h3>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Configure RADIUS server redundancy with primary and secondary servers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Set appropriate timeout values (5 seconds) and retry counts (3 attempts)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Enable dynamic VLAN assignment for network segmentation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Implement MAC-based authentication for IoT devices</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Performance Optimization */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Performance Optimization
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Enable fast roaming (802.11r) for seamless connectivity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Configure band steering to optimize client distribution</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Use 160MHz channels for Wi-Fi 6 where spectrum allows</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Optimize beacon intervals and DTIM periods for battery life</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Warnings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Common Pitfalls to Avoid
            </h3>
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't mix WPA2 and WPA3 on the same SSID without proper testing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid using default RADIUS shared secrets or weak passwords</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't forget to test roaming scenarios in your environment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure client device compatibility before deploying WPA3</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Wifi className="h-6 w-6 mr-2" />
            Wireless Intelligence Center
          </h2>
          <p className="text-muted-foreground">
            Advanced wireless configuration recommendations and security best practices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurations</span>
          </TabsTrigger>
          <TabsTrigger value="best-practices" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Best Practices</span>
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Troubleshooting</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">{renderRecommendationsTab()}</TabsContent>
        <TabsContent value="best-practices">{renderBestPracticesTab()}</TabsContent>
        <TabsContent value="troubleshooting">
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Troubleshooting Guide</h3>
              <p className="text-muted-foreground">
                Comprehensive wireless troubleshooting guides and common issue resolutions coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Detail Dialog */}
      {selectedRecommendation && (
        <Dialog open={!!selectedRecommendation} onOpenChange={() => setSelectedRecommendation(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                {selectedRecommendation.vendor} {selectedRecommendation.product} Configuration
              </DialogTitle>
              <DialogDescription>
                Detailed wireless configuration for {selectedRecommendation.useCase}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Configuration Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xs text-muted-foreground">Security</p>
                  <p className="font-medium">{selectedRecommendation.configuration.authMethod}</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <Signal className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Standard</p>
                  <p className="font-medium">{selectedRecommendation.configuration.standard}</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <Lock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs text-muted-foreground">Encryption</p>
                  <p className="font-medium">{selectedRecommendation.configuration.encryptionType}</p>
                </div>
                <div className="text-center p-3 border rounded">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="font-medium">{Math.round(selectedRecommendation.successRate * 100)}%</p>
                </div>
              </div>

              {/* Configuration Template */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Configuration Template
                    </span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedRecommendation.configTemplate)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {selectedRecommendation.configTemplate}
                  </pre>
                </CardContent>
              </Card>

              {/* Best Practices and Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedRecommendation.bestPractices.map((practice, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedRecommendation.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* CLI Commands */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Terminal className="h-5 w-5 mr-2" />
                    CLI Commands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedRecommendation.cliCommands.map((command, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <code className="text-sm">{command}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(command)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WirelessIntelligencePanel;
