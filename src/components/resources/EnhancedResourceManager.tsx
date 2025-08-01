import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, Plus, Edit, Tag, Link, FileText, Settings, 
  Network, Target, CheckSquare, Building2
} from 'lucide-react';
import { useVendors, useCreateVendor } from '@/hooks/useVendors';
import { useUseCases, useCreateUseCase } from '@/hooks/useUseCases';
import { useRequirements, useCreateRequirement } from '@/hooks/useRequirements';
import { useToast } from '@/hooks/use-toast';

interface EnhancedResourceManagerProps {
  onResourceSelect?: (resource: any, type: 'vendor' | 'usecase' | 'requirement') => void;
  selectedResources?: { vendors: any[], useCases: any[], requirements: any[] };
}

export const EnhancedResourceManager: React.FC<EnhancedResourceManagerProps> = ({
  onResourceSelect,
  selectedResources
}) => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingResource, setEditingResource] = useState<any>(null);
  const [newResourceDialog, setNewResourceDialog] = useState(false);

  const { data: vendors = [] } = useVendors();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const createVendorMutation = useCreateVendor();
  const createUseCaseMutation = useCreateUseCase();
  const createRequirementMutation = useCreateRequirement();
  const { toast } = useToast();

  const [newVendor, setNewVendor] = useState({
    vendor_name: '',
    vendor_type: '',
    category: '',
    models: [],
    supported_protocols: [],
    integration_methods: [],
    documentation_links: [],
    configuration_templates: {},
    firmware_requirements: {},
    known_limitations: [],
    portnox_compatibility: {},
    tags: [],
    status: 'active' as const
  });

  const [newUseCase, setNewUseCase] = useState({
    name: '',
    description: '',
    category: '',
    industry_focus: [],
    technical_requirements: [],
    portnox_features: [],
    complexity_level: 'medium',
    implementation_time: '1-2 weeks',
    tags: []
  });

  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    category: 'functional',
    priority: 'medium',
    complexity: 'medium',
    validation_criteria: [],
    dependencies: [],
    tags: []
  });

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendor_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUseCases = useCases.filter(useCase =>
    useCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    useCase.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequirements = requirements.filter(requirement =>
    requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    requirement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVendor = () => {
    createVendorMutation.mutate(newVendor, {
      onSuccess: () => {
        setNewResourceDialog(false);
        setNewVendor({
          vendor_name: '',
          vendor_type: '',
          category: '',
          models: [],
          supported_protocols: [],
          integration_methods: [],
          documentation_links: [],
          configuration_templates: {},
          firmware_requirements: {},
          known_limitations: [],
          portnox_compatibility: {},
          tags: [],
          status: 'active'
        });
        toast({
          title: "Vendor Created",
          description: "New vendor has been added to the resource library",
        });
      }
    });
  };

  const renderVendorCard = (vendor: any) => (
    <Card key={vendor.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{vendor.vendor_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{vendor.vendor_type}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{vendor.category}</Badge>
            <Button size="sm" variant="ghost" onClick={() => setEditingResource(vendor)}>
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {vendor.supported_protocols?.length > 0 && (
            <div>
              <Label className="text-xs">Protocols</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {vendor.supported_protocols.slice(0, 3).map((protocol: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{protocol}</Badge>
                ))}
                {vendor.supported_protocols.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{vendor.supported_protocols.length - 3}</Badge>
                )}
              </div>
            </div>
          )}
          
          {vendor.documentation_links?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link className="h-3 w-3" />
              {vendor.documentation_links.length} documentation link(s)
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
              {vendor.status}
            </Badge>
            {onResourceSelect && (
              <Button 
                size="sm" 
                onClick={() => onResourceSelect(vendor, 'vendor')}
                disabled={selectedResources?.vendors.some(v => v.id === vendor.id)}
              >
                {selectedResources?.vendors.some(v => v.id === vendor.id) ? 'Selected' : 'Select'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUseCaseCard = (useCase: any) => (
    <Card key={useCase.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{useCase.name}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">{useCase.description}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setEditingResource(useCase)}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{useCase.category}</Badge>
            <Badge variant="secondary">{useCase.complexity_level}</Badge>
          </div>
          
          {useCase.portnox_features?.length > 0 && (
            <div>
              <Label className="text-xs">Portnox Features</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {useCase.portnox_features.slice(0, 2).map((feature: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                ))}
                {useCase.portnox_features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{useCase.portnox_features.length - 2}</Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">{useCase.implementation_time}</span>
            {onResourceSelect && (
              <Button 
                size="sm" 
                onClick={() => onResourceSelect(useCase, 'usecase')}
                disabled={selectedResources?.useCases.some(uc => uc.id === useCase.id)}
              >
                {selectedResources?.useCases.some(uc => uc.id === useCase.id) ? 'Selected' : 'Select'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRequirementCard = (requirement: any) => (
    <Card key={requirement.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{requirement.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">{requirement.description}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setEditingResource(requirement)}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{requirement.category}</Badge>
            <Badge variant={requirement.priority === 'high' ? 'destructive' : requirement.priority === 'medium' ? 'default' : 'secondary'}>
              {requirement.priority}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted-foreground">Complexity: {requirement.complexity}</span>
            {onResourceSelect && (
              <Button 
                size="sm" 
                onClick={() => onResourceSelect(requirement, 'requirement')}
                disabled={selectedResources?.requirements.some(req => req.id === requirement.id)}
              >
                {selectedResources?.requirements.some(req => req.id === requirement.id) ? 'Selected' : 'Select'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNewResourceDialog = () => (
    <Dialog open={newResourceDialog} onOpenChange={setNewResourceDialog}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add New {activeTab.slice(0, -1)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New {activeTab.slice(0, -1)}</DialogTitle>
        </DialogHeader>
        
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vendor Name</Label>
                <Input 
                  value={newVendor.vendor_name}
                  onChange={(e) => setNewVendor({...newVendor, vendor_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Vendor Type</Label>
                <Select value={newVendor.vendor_type} onValueChange={(value) => setNewVendor({...newVendor, vendor_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="firewall">Firewall</SelectItem>
                    <SelectItem value="wireless">Wireless</SelectItem>
                    <SelectItem value="switch">Switch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Category</Label>
              <Input 
                value={newVendor.category}
                onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}
              />
            </div>
            
            <Button onClick={handleCreateVendor} disabled={createVendorMutation.isPending}>
              {createVendorMutation.isPending ? 'Creating...' : 'Create Vendor'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resource Library</h2>
          <p className="text-muted-foreground">Manage vendors, use cases, and requirements</p>
        </div>
        {renderNewResourceDialog()}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Vendors ({vendors.length})
          </TabsTrigger>
          <TabsTrigger value="usecases" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Use Cases ({useCases.length})
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Requirements ({requirements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map(renderVendorCard)}
          </div>
        </TabsContent>

        <TabsContent value="usecases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUseCases.map(renderUseCaseCard)}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequirements.map(renderRequirementCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};