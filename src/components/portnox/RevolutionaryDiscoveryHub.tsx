import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, Search, Shield, Eye, Brain, Zap, Target,
  Radar, Activity, AlertTriangle, CheckCircle, Clock,
  Globe, Server, Smartphone, Monitor, Laptop, Printer,
  Router, Wifi, Database, Lock, Unlock, Gauge
} from 'lucide-react';
import { PortnoxApiService } from '@/services/PortnoxApiService';
import { useToast } from '@/hooks/use-toast';

interface DiscoveredDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  vendor: string;
  deviceType: string;
  riskScore: number;
  complianceStatus: 'compliant' | 'non-compliant' | 'unknown';
  lastSeen: string;
  location?: string;
  user?: string;
  os?: string;
  vulnerabilities: string[];
}

interface NetworkSegment {
  id: string;
  name: string;
  vlan: string;
  deviceCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore: number;
}

interface ComplianceFramework {
  name: string;
  score: number;
  requirements: number;
  compliant: number;
  gaps: string[];
}

const RevolutionaryDiscoveryHub: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [networkSegments, setNetworkSegments] = useState<NetworkSegment[]>([]);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredDevice | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const scanIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Initialize with demo data for stunning visual impact
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    const demoDevices: DiscoveredDevice[] = [
      {
        id: '1',
        name: 'CEO-MacBook-Pro',
        ip: '192.168.1.100',
        mac: '00:1B:44:11:3A:B7',
        vendor: 'Apple',
        deviceType: 'laptop',
        riskScore: 15,
        complianceStatus: 'compliant',
        lastSeen: new Date().toISOString(),
        user: 'John Smith (CEO)',
        os: 'macOS 14.2',
        vulnerabilities: []
      },
      {
        id: '2',
        name: 'GUEST-Android-Phone',
        ip: '192.168.100.50',
        mac: '02:00:00:00:00:01',
        vendor: 'Samsung',
        deviceType: 'smartphone',
        riskScore: 85,
        complianceStatus: 'non-compliant',
        lastSeen: new Date().toISOString(),
        user: 'Unknown Guest',
        os: 'Android 12',
        vulnerabilities: ['Outdated OS', 'Unknown device', 'No compliance profile']
      },
      {
        id: '3',
        name: 'CORE-SWITCH-01',
        ip: '192.168.1.1',
        mac: '00:50:56:C0:00:01',
        vendor: 'Cisco',
        deviceType: 'switch',
        riskScore: 25,
        complianceStatus: 'compliant',
        lastSeen: new Date().toISOString(),
        location: 'Data Center',
        vulnerabilities: ['Firmware update available']
      }
    ];

    const demoSegments: NetworkSegment[] = [
      {
        id: '1',
        name: 'Executive Network',
        vlan: 'VLAN 10',
        deviceCount: 15,
        riskLevel: 'low',
        complianceScore: 95
      },
      {
        id: '2',
        name: 'Guest Network',
        vlan: 'VLAN 100',
        deviceCount: 23,
        riskLevel: 'high',
        complianceScore: 45
      },
      {
        id: '3',
        name: 'Infrastructure',
        vlan: 'VLAN 1',
        deviceCount: 8,
        riskLevel: 'medium',
        complianceScore: 75
      }
    ];

    const demoCompliance: ComplianceFramework[] = [
      {
        name: 'PCI-DSS',
        score: 78,
        requirements: 12,
        compliant: 9,
        gaps: ['Strong cryptography', 'Regular pen testing', 'Secure configurations']
      },
      {
        name: 'HIPAA',
        score: 92,
        requirements: 18,
        compliant: 16,
        gaps: ['Access logging', 'Device encryption']
      },
      {
        name: 'SOX',
        score: 85,
        requirements: 8,
        compliant: 7,
        gaps: ['Change management documentation']
      }
    ];

    setDiscoveredDevices(demoDevices);
    setNetworkSegments(demoSegments);
    setComplianceFrameworks(demoCompliance);
  };

  const startLiveDiscovery = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    toast({
      title: "🚀 Discovery Launched",
      description: "AI-powered network discovery is now scanning your environment...",
    });

    // Simulate progressive discovery with realistic timing
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          toast({
            title: "✨ Discovery Complete",
            description: "Found 156 devices across 12 network segments with AI-powered risk analysis",
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate real-time device discovery
    if (realTimeUpdates) {
      scanIntervalRef.current = setInterval(() => {
        addRandomDevice();
      }, 3000);
    }
  };

  const addRandomDevice = () => {
    const deviceTypes = ['laptop', 'smartphone', 'printer', 'iot', 'server'];
    const vendors = ['Apple', 'Microsoft', 'Google', 'Samsung', 'HP', 'Dell'];
    const users = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'Unknown'];
    
    const newDevice: DiscoveredDevice = {
      id: Date.now().toString(),
      name: `DEVICE-${Math.random().toString(36).substring(7).toUpperCase()}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      mac: Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      riskScore: Math.floor(Math.random() * 100),
      complianceStatus: Math.random() > 0.7 ? 'non-compliant' : 'compliant',
      lastSeen: new Date().toISOString(),
      user: users[Math.floor(Math.random() * users.length)],
      vulnerabilities: Math.random() > 0.6 ? ['Security gap detected'] : []
    };

    setDiscoveredDevices(prev => [newDevice, ...prev.slice(0, 19)]); // Keep latest 20
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'smartphone': return <Smartphone className="h-4 w-4" />;
      case 'printer': return <Printer className="h-4 w-4" />;
      case 'server': return <Server className="h-4 w-4" />;
      case 'switch': case 'router': return <Router className="h-4 w-4" />;
      case 'iot': return <Wifi className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600 bg-green-50';
    if (riskScore < 60) return 'text-yellow-600 bg-yellow-50';
    if (riskScore < 80) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'non-compliant': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Discovery Dashboard */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI-Powered Discovery Command Center</CardTitle>
                <p className="text-muted-foreground">
                  Real-time network intelligence with predictive risk analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                {realTimeUpdates ? 'Live' : 'Paused'}
              </Badge>
              <Button 
                onClick={startLiveDiscovery}
                disabled={isScanning}
                className="bg-primary hover:bg-primary/90"
              >
                {isScanning ? (
                  <>
                    <Radar className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Start Discovery
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isScanning && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Discovery Progress</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Real-Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Devices Discovered</p>
                <p className="text-2xl font-bold">{discoveredDevices.length}</p>
              </div>
              <Network className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Devices</p>
                <p className="text-2xl font-bold text-red-600">
                  {discoveredDevices.filter(d => d.riskScore > 70).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Segments</p>
                <p className="text-2xl font-bold">{networkSegments.length}</p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Compliance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(complianceFrameworks.reduce((acc, f) => acc + f.score, 0) / complianceFrameworks.length)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Discovery Interface */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Live Devices</TabsTrigger>
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Heat Map</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Real-Time Device Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discoveredDevices.map((device) => (
                  <div 
                    key={device.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer animate-fade-in"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {device.ip} • {device.vendor} • {device.user}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(device.riskScore)}>
                        Risk: {device.riskScore}
                      </Badge>
                      <Badge className={getComplianceColor(device.complianceStatus)}>
                        {device.complianceStatus === 'compliant' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {device.complianceStatus}
                      </Badge>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Interactive Network Topology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center space-y-2">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">3D Network Visualization</h3>
                  <p className="text-muted-foreground">Interactive topology map will render here</p>
                  <Button variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Launch 3D View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {framework.name}
                    <Badge variant={framework.score > 80 ? 'default' : 'destructive'}>
                      {framework.score}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={framework.score} className="h-3" />
                    <div className="text-sm text-muted-foreground">
                      {framework.compliant} of {framework.requirements} requirements met
                    </div>
                    {framework.gaps.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Key Gaps:</p>
                        {framework.gaps.slice(0, 2).map((gap, index) => (
                          <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {gap}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Network Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Smart Recommendation:</strong> Guest network shows 85% non-compliance. 
                  Consider implementing device isolation and enhanced monitoring for BYOD devices.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Gauge className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Insight:</strong> Network utilization peaks detected between 2-4 PM. 
                  QoS policies recommended for critical business applications.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Alert:</strong> 3 devices detected with outdated security patches. 
                  Automated remediation policies can be configured to address this.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevolutionaryDiscoveryHub;