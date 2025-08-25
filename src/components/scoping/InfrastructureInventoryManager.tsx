import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Server, Network, Shield, Monitor, Smartphone, 
  Router, Database, Cloud, HardDrive, Cpu,
  Plus, Minus, Edit, Eye, Download, Upload,
  CheckCircle, XCircle, AlertTriangle, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InfrastructureItem {
  id: string;
  name: string;
  type: 'server' | 'network' | 'security' | 'endpoint' | 'storage' | 'cloud';
  category: string;
  vendor: string;
  model: string;
  version: string;
  location: string;
  ipAddress?: string;
  macAddress?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  compatibility: 'full' | 'partial' | 'none' | 'unknown';
  nacIntegration: {
    supported: boolean;
    method?: string;
    notes?: string;
    requirements?: string[];
  };
  specifications: {
    cpu?: string;
    memory?: string;
    storage?: string;
    networkPorts?: number;
    powerRequirements?: string;
  };
  documentation: {
    manuals?: string[];
    configurations?: string[];
    supportContacts?: string[];
  };
  risks: {
    security?: string[];
    compatibility?: string[];
    performance?: string[];
  };
  lastUpdated: Date;
  tags: string[];
  notes?: string;
}

const infrastructureTypes = [
  { id: 'server', name: 'Servers', icon: Server, color: 'blue' },
  { id: 'network', name: 'Network Equipment', icon: Router, color: 'green' },
  { id: 'security', name: 'Security Appliances', icon: Shield, color: 'red' },
  { id: 'endpoint', name: 'Endpoints', icon: Monitor, color: 'purple' },
  { id: 'storage', name: 'Storage Systems', icon: HardDrive, color: 'orange' },
  { id: 'cloud', name: 'Cloud Services', icon: Cloud, color: 'cyan' }
];

const infraCompatibilityLevels = [
  { id: 'full', name: 'Full Support', color: 'green', description: 'Fully compatible with NAC solution' },
  { id: 'partial', name: 'Partial Support', color: 'yellow', description: 'Limited compatibility, may require workarounds' },
  { id: 'none', name: 'Not Supported', color: 'red', description: 'Not compatible with NAC solution' },
  { id: 'unknown', name: 'Unknown', color: 'gray', description: 'Compatibility needs to be assessed' }
];

export default function InfrastructureInventoryManager() {
  const [inventory, setInventory] = useState<InfrastructureItem[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InfrastructureItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InfrastructureItem>>({
    type: 'server',
    status: 'active',
    compatibility: 'unknown',
    nacIntegration: { supported: false },
    specifications: {},
    documentation: {},
    risks: {},
    tags: []
  });

  const { toast } = useToast();

  // Load sample data
  useEffect(() => {
    const sampleData: InfrastructureItem[] = [
      {
        id: '1',
        name: 'Primary Domain Controller',
        type: 'server',
        category: 'Infrastructure Server',
        vendor: 'Microsoft',
        model: 'Windows Server',
        version: '2019 Standard',
        location: 'Data Center - Rack A1',
        ipAddress: '192.168.1.10',
        status: 'active',
        compatibility: 'full',
        nacIntegration: {
          supported: true,
          method: 'LDAP/Active Directory',
          notes: 'Full integration via LDAP bind',
          requirements: ['LDAP access', 'Service account']
        },
        specifications: {
          cpu: 'Intel Xeon 8-core',
          memory: '32GB DDR4',
          storage: '2TB SSD RAID',
          networkPorts: 2
        },
        documentation: {
          manuals: ['AD Setup Guide', 'Security Policies'],
          configurations: ['LDAP Config', 'DNS Settings']
        },
        risks: {
          security: ['Single point of failure'],
          performance: ['High load during peak hours']
        },
        lastUpdated: new Date(),
        tags: ['critical', 'authentication', 'windows']
      },
      {
        id: '2',
        name: 'Core Switch - Building A',
        type: 'network',
        category: 'Layer 2 Switch',
        vendor: 'Cisco',
        model: 'Catalyst 9300',
        version: '16.12.04',
        location: 'Building A - Network Closet',
        ipAddress: '192.168.1.100',
        macAddress: '00:1A:2B:3C:4D:5E',
        status: 'active',
        compatibility: 'full',
        nacIntegration: {
          supported: true,
          method: 'RADIUS/802.1X',
          notes: 'Supports dynamic VLAN assignment',
          requirements: ['RADIUS server', '802.1X configuration']
        },
        specifications: {
          networkPorts: 48,
          powerRequirements: '740W PoE+'
        },
        documentation: {
          manuals: ['Cisco Config Guide'],
          configurations: ['VLAN Config', 'RADIUS Settings']
        },
        risks: {
          compatibility: ['Firmware update may be required']
        },
        lastUpdated: new Date(),
        tags: ['network', 'cisco', '802.1x', 'critical']
      },
      {
        id: '3',
        name: 'Legacy Printer - Accounting',
        type: 'endpoint',
        category: 'Network Printer',
        vendor: 'HP',
        model: 'LaserJet 4250',
        version: 'Legacy',
        location: 'Accounting Department',
        ipAddress: '192.168.2.50',
        status: 'active',
        compatibility: 'none',
        nacIntegration: {
          supported: false,
          notes: 'Legacy device without 802.1X support',
          requirements: ['MAC address bypass', 'Static VLAN assignment']
        },
        specifications: {},
        documentation: {},
        risks: {
          security: ['No authentication capability', 'Potential security gap'],
          compatibility: ['Cannot participate in dynamic NAC']
        },
        lastUpdated: new Date(),
        tags: ['legacy', 'printer', 'bypass-required']
      }
    ];
    setInventory(sampleData);
  }, []);

  const filteredInventory = selectedType === 'all' 
    ? inventory 
    : inventory.filter(item => item.type === selectedType);

  const getCompatibilityStats = () => {
    const stats = inventory.reduce((acc, item) => {
      acc[item.compatibility] = (acc[item.compatibility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getNACIntegrationStats = () => {
    const supported = inventory.filter(item => item.nacIntegration.supported).length;
    const total = inventory.length;
    return { supported, total, percentage: total > 0 ? (supported / total) * 100 : 0 };
  };

  const addItem = () => {
    if (!newItem.name || !newItem.vendor || !newItem.model) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const item: InfrastructureItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      type: newItem.type!,
      category: newItem.category || 'Other',
      vendor: newItem.vendor!,
      model: newItem.model!,
      version: newItem.version || 'Unknown',
      location: newItem.location || 'Unknown',
      ipAddress: newItem.ipAddress,
      macAddress: newItem.macAddress,
      status: newItem.status!,
      compatibility: newItem.compatibility!,
      nacIntegration: newItem.nacIntegration!,
      specifications: newItem.specifications || {},
      documentation: newItem.documentation || {},
      risks: newItem.risks || {},
      lastUpdated: new Date(),
      tags: newItem.tags || [],
      notes: newItem.notes
    };

    setInventory(prev => [...prev, item]);
    setNewItem({
      type: 'server',
      status: 'active',
      compatibility: 'unknown',
      nacIntegration: { supported: false },
      specifications: {},
      documentation: {},
      risks: {},
      tags: []
    });
    setShowAddDialog(false);

    toast({
      title: "Item Added",
      description: "Infrastructure item has been added to inventory"
    });
  };

  const updateItem = (id: string, updates: Partial<InfrastructureItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, lastUpdated: new Date() }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Infrastructure item has been removed from inventory"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'retired': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCompatibilityBadge = (compatibility: string) => {
    const level = infraCompatibilityLevels.find(l => l.id === compatibility);
    if (!level) return null;

    return (
      <Badge variant={
        level.color === 'green' ? 'default' :
        level.color === 'yellow' ? 'secondary' :
        level.color === 'red' ? 'destructive' : 'outline'
      }>
        {level.name}
      </Badge>
    );
  };

  const stats = getCompatibilityStats();
  const nacStats = getNACIntegrationStats();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Infrastructure Inventory
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold">{inventory.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-500">{stats.full || 0}</div>
              <div className="text-sm text-muted-foreground">Fully Compatible</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-red-500">{stats.none || 0}</div>
              <div className="text-sm text-muted-foreground">Not Compatible</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold">{Math.round(nacStats.percentage)}%</div>
              <div className="text-sm text-muted-foreground">NAC Ready</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Type Filter */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Filter by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={selectedType === 'all' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedType('all')}
            >
              All Items ({inventory.length})
            </Button>
            {infrastructureTypes.map(type => {
              const count = inventory.filter(item => item.type === type.id).length;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedType(type.id)}
                >
                  <type.icon className="h-4 w-4 mr-2" />
                  {type.name} ({count})
                </Button>
              );
            })}

            <Separator className="my-4" />

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Infrastructure Item</DialogTitle>
                </DialogHeader>
                <AddItemForm 
                  item={newItem} 
                  onChange={setNewItem} 
                  onSave={addItem}
                  onCancel={() => setShowAddDialog(false)}
                />
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredInventory.map(item => (
                <Card key={item.id} className="border-l-4 border-l-primary/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {infrastructureTypes.find(t => t.id === item.type)?.icon && 
                            React.createElement(infrastructureTypes.find(t => t.id === item.type)!.icon, { className: "h-5 w-5" })
                          }
                          <h4 className="font-medium">{item.name}</h4>
                          {getStatusIcon(item.status)}
                          {getCompatibilityBadge(item.compatibility)}
                          {item.nacIntegration.supported && (
                            <Badge variant="outline" className="text-green-600">
                              NAC Ready
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Vendor:</span> {item.vendor} {item.model}
                          </div>
                          <div>
                            <span className="font-medium">Version:</span> {item.version}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {item.location}
                          </div>
                        </div>

                        {item.ipAddress && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">IP Address:</span> {item.ipAddress}
                          </div>
                        )}

                        {item.nacIntegration.method && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">NAC Integration:</span> {item.nacIntegration.method}
                          </div>
                        )}

                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{item.name} - Details</DialogTitle>
                            </DialogHeader>
                            <ItemDetails item={item} onUpdate={(updates) => updateItem(item.id, updates)} />
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredInventory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No infrastructure items found.</p>
                  <p className="text-sm">Add items to start building your inventory.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddItemForm({ 
  item, 
  onChange, 
  onSave, 
  onCancel 
}: { 
  item: Partial<InfrastructureItem>; 
  onChange: (item: Partial<InfrastructureItem>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const updateField = (field: string, value: any) => {
    onChange({ ...item, [field]: value });
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const currentParent = item[parent as keyof typeof item] as any;
    onChange({
      ...item,
      [parent]: {
        ...(currentParent || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={item.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Infrastructure item name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={item.type || 'server'} onValueChange={(value) => updateField('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {infrastructureTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor *</Label>
          <Input
            id="vendor"
            value={item.vendor || ''}
            onChange={(e) => updateField('vendor', e.target.value)}
            placeholder="Vendor name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={item.model || ''}
            onChange={(e) => updateField('model', e.target.value)}
            placeholder="Model number/name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={item.version || ''}
            onChange={(e) => updateField('version', e.target.value)}
            placeholder="Firmware/software version"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={item.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Physical location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipAddress">IP Address</Label>
          <Input
            id="ipAddress"
            value={item.ipAddress || ''}
            onChange={(e) => updateField('ipAddress', e.target.value)}
            placeholder="192.168.1.100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={item.status || 'active'} onValueChange={(value) => updateField('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compatibility">NAC Compatibility</Label>
          <Select value={item.compatibility || 'unknown'} onValueChange={(value) => updateField('compatibility', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select compatibility" />
            </SelectTrigger>
            <SelectContent>
              {infraCompatibilityLevels.map(level => (
                <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>NAC Integration</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={item.nacIntegration?.supported || false}
            onCheckedChange={(checked) => updateNestedField('nacIntegration', 'supported', !!checked)}
          />
          <span className="text-sm">Supports NAC integration</span>
        </div>
        {item.nacIntegration?.supported && (
          <Input
            value={item.nacIntegration?.method || ''}
            onChange={(e) => updateNestedField('nacIntegration', 'method', e.target.value)}
            placeholder="Integration method (e.g., RADIUS, SNMP)"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={item.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes or comments"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Add Item
        </Button>
      </div>
    </div>
  );
}

function ItemDetails({ 
  item, 
  onUpdate 
}: { 
  item: InfrastructureItem; 
  onUpdate: (updates: Partial<InfrastructureItem>) => void;
}) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="nac">NAC Integration</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="docs">Documentation</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <p className="mt-1">{item.name}</p>
          </div>
          <div>
            <Label>Type</Label>
            <p className="mt-1">{infrastructureTypes.find(t => t.id === item.type)?.name}</p>
          </div>
          <div>
            <Label>Vendor</Label>
            <p className="mt-1">{item.vendor}</p>
          </div>
          <div>
            <Label>Model</Label>
            <p className="mt-1">{item.model}</p>
          </div>
          <div>
            <Label>Version</Label>
            <p className="mt-1">{item.version}</p>
          </div>
          <div>
            <Label>Location</Label>
            <p className="mt-1">{item.location}</p>
          </div>
          {item.ipAddress && (
            <div>
              <Label>IP Address</Label>
              <p className="mt-1">{item.ipAddress}</p>
            </div>
          )}
          {item.macAddress && (
            <div>
              <Label>MAC Address</Label>
              <p className="mt-1">{item.macAddress}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          {getStatusIcon(item.status)}
          <span className="capitalize">{item.status}</span>
        </div>

        <div className="flex items-center gap-2">
          <Label>NAC Compatibility:</Label>
          {getCompatibilityBadge(item.compatibility)}
        </div>

        {item.notes && (
          <div>
            <Label>Notes</Label>
            <p className="mt-1 text-muted-foreground">{item.notes}</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="specs" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {item.specifications.cpu && (
            <div>
              <Label>CPU</Label>
              <p className="mt-1">{item.specifications.cpu}</p>
            </div>
          )}
          {item.specifications.memory && (
            <div>
              <Label>Memory</Label>
              <p className="mt-1">{item.specifications.memory}</p>
            </div>
          )}
          {item.specifications.storage && (
            <div>
              <Label>Storage</Label>
              <p className="mt-1">{item.specifications.storage}</p>
            </div>
          )}
          {item.specifications.networkPorts && (
            <div>
              <Label>Network Ports</Label>
              <p className="mt-1">{item.specifications.networkPorts}</p>
            </div>
          )}
          {item.specifications.powerRequirements && (
            <div>
              <Label>Power Requirements</Label>
              <p className="mt-1">{item.specifications.powerRequirements}</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="nac" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>NAC Support:</Label>
            {item.nacIntegration.supported ? (
              <Badge className="bg-green-500">Supported</Badge>
            ) : (
              <Badge variant="destructive">Not Supported</Badge>
            )}
          </div>

          {item.nacIntegration.method && (
            <div>
              <Label>Integration Method</Label>
              <p className="mt-1">{item.nacIntegration.method}</p>
            </div>
          )}

          {item.nacIntegration.notes && (
            <div>
              <Label>Integration Notes</Label>
              <p className="mt-1 text-muted-foreground">{item.nacIntegration.notes}</p>
            </div>
          )}

          {item.nacIntegration.requirements && item.nacIntegration.requirements.length > 0 && (
            <div>
              <Label>Requirements</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.nacIntegration.requirements.map((req, index) => (
                  <li key={index} className="text-muted-foreground">{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="risks" className="space-y-4">
        <div className="space-y-4">
          {item.risks.security && item.risks.security.length > 0 && (
            <div>
              <Label className="text-red-600">Security Risks</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.risks.security.map((risk, index) => (
                  <li key={index} className="text-muted-foreground">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {item.risks.compatibility && item.risks.compatibility.length > 0 && (
            <div>
              <Label className="text-yellow-600">Compatibility Risks</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.risks.compatibility.map((risk, index) => (
                  <li key={index} className="text-muted-foreground">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {item.risks.performance && item.risks.performance.length > 0 && (
            <div>
              <Label className="text-blue-600">Performance Risks</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.risks.performance.map((risk, index) => (
                  <li key={index} className="text-muted-foreground">{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="docs" className="space-y-4">
        <div className="space-y-4">
          {item.documentation.manuals && item.documentation.manuals.length > 0 && (
            <div>
              <Label>Manuals</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.documentation.manuals.map((manual, index) => (
                  <li key={index} className="text-muted-foreground">{manual}</li>
                ))}
              </ul>
            </div>
          )}

          {item.documentation.configurations && item.documentation.configurations.length > 0 && (
            <div>
              <Label>Configuration Files</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.documentation.configurations.map((config, index) => (
                  <li key={index} className="text-muted-foreground">{config}</li>
                ))}
              </ul>
            </div>
          )}

          {item.documentation.supportContacts && item.documentation.supportContacts.length > 0 && (
            <div>
              <Label>Support Contacts</Label>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {item.documentation.supportContacts.map((contact, index) => (
                  <li key={index} className="text-muted-foreground">{contact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Helper function to get status icon (defined outside component to avoid re-creation)
function getStatusIcon(status: string) {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'retired': return <XCircle className="h-4 w-4 text-gray-500" />;
    default: return <Info className="h-4 w-4" />;
  }
}

// Helper function to get compatibility badge
function getCompatibilityBadge(compatibility: string) {
  const level = infraCompatibilityLevels.find(l => l.id === compatibility);
  if (!level) return null;

  return (
    <Badge variant={
      level.color === 'green' ? 'default' :
      level.color === 'yellow' ? 'secondary' :
      level.color === 'red' ? 'destructive' : 'outline'
    }>
      {level.name}
    </Badge>
  );
}