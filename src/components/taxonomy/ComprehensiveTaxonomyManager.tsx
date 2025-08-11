import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Search, Edit, Trash2, Database, Network, Shield, 
  Monitor, Smartphone, Cloud, Server, Building, Globe,
  CheckCircle, AlertTriangle, Clock, Eye
} from 'lucide-react';

// Import all the existing hooks
import { useEnhancedVendors, useCreateEnhancedVendor, useUpdateEnhancedVendor, useDeleteEnhancedVendor } from '@/hooks/useEnhancedVendors';
import { useIndustryOptions, useCreateIndustryOption } from '@/hooks/useResourceLibrary';
import { useUseCases, useCreateUseCase } from '@/hooks/useUseCases';
import { useRequirements, useCreateRequirement } from '@/hooks/useRequirements';

const ComprehensiveTaxonomyManager = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  const { toast } = useToast();
  
  // Data hooks
  const { data: vendors = [], isLoading: vendorsLoading } = useEnhancedVendors();
  const { data: industries = [] } = useIndustryOptions();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  
  // Mutation hooks
  const createVendor = useCreateEnhancedVendor();
  const updateVendor = useUpdateEnhancedVendor();
  const deleteVendor = useDeleteEnhancedVendor();
  const createIndustry = useCreateIndustryOption();
  const createUseCase = useCreateUseCase();
  const createRequirement = useCreateRequirement();

  const getFilteredData = () => {
    const searchLower = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'vendors':
        return vendors.filter(v => 
          v.vendor_name?.toLowerCase().includes(searchLower) ||
          v.category?.toLowerCase().includes(searchLower) ||
          v.vendor_type?.toLowerCase().includes(searchLower)
        );
      case 'industries':
        return industries.filter(i => 
          i.name?.toLowerCase().includes(searchLower) ||
          i.description?.toLowerCase().includes(searchLower)
        );
      case 'use-cases':
        return useCases.filter(u => 
          u.name?.toLowerCase().includes(searchLower) ||
          u.description?.toLowerCase().includes(searchLower)
        );
      case 'requirements':
        return requirements.filter(r => 
          r.title?.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower)
        );
      default:
        return [];
    }
  };

  const handleCreate = async (data: any) => {
    try {
      switch (activeTab) {
        case 'vendors':
          await createVendor.mutateAsync(data);
          break;
        case 'industries':
          await createIndustry.mutateAsync(data);
          break;
        case 'use-cases':
          await createUseCase.mutateAsync(data);
          break;
        case 'requirements':
          await createRequirement.mutateAsync(data);
          break;
      }
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (data: any) => {
    try {
      switch (activeTab) {
        case 'vendors':
          await updateVendor.mutateAsync({ ...data, id: selectedItem.id });
          break;
        // Add other update handlers as needed
      }
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      switch (activeTab) {
        case 'vendors':
          await deleteVendor.mutateAsync(id);
          break;
        // Add other delete handlers as needed
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const renderVendorCard = (vendor: any) => (
    <Card key={vendor.id} className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {vendor.vendor_type === 'NAC' && <Shield className="h-5 w-5 text-blue-500" />}
              {vendor.vendor_type === 'Switch' && <Network className="h-5 w-5 text-green-500" />}
              {vendor.vendor_type === 'Wireless' && <Globe className="h-5 w-5 text-purple-500" />}
              {vendor.vendor_type === 'Firewall' && <Shield className="h-5 w-5 text-red-500" />}
              {vendor.vendor_type === 'EDR' && <Monitor className="h-5 w-5 text-orange-500" />}
              {vendor.vendor_type === 'MDM' && <Smartphone className="h-5 w-5 text-cyan-500" />}
              {vendor.vendor_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                {vendor.status}
              </Badge>
              <Badge variant="outline">{vendor.category}</Badge>
              <Badge variant="outline">{vendor.portnox_integration_level}</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedItem(vendor);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(vendor.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {vendor.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vendor.description}
            </p>
          )}
          
          {vendor.models && vendor.models.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Models</h4>
              <div className="flex flex-wrap gap-1">
                {vendor.models.slice(0, 3).map((model: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {model}
                  </Badge>
                ))}
                {vendor.models.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{vendor.models.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {vendor.supported_protocols && vendor.supported_protocols.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Protocols</h4>
              <div className="flex flex-wrap gap-1">
                {vendor.supported_protocols.slice(0, 3).map((protocol: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {protocol}
                  </Badge>
                ))}
                {vendor.supported_protocols.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{vendor.supported_protocols.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Support: {vendor.support_level || 'Unknown'}</span>
            {vendor.last_tested_date && (
              <span>Tested: {new Date(vendor.last_tested_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateForm = () => {
    const [formData, setFormData] = useState<any>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreate(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'vendors' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor_name">Vendor Name</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name || ''}
                  onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vendor_type">Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, vendor_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NAC">NAC</SelectItem>
                    <SelectItem value="Switch">Switch</SelectItem>
                    <SelectItem value="Wireless">Wireless</SelectItem>
                    <SelectItem value="Router">Router</SelectItem>
                    <SelectItem value="Firewall">Firewall</SelectItem>
                    <SelectItem value="EDR">EDR/XDR</SelectItem>
                    <SelectItem value="SIEM">SIEM</SelectItem>
                    <SelectItem value="MDM">MDM/UEM</SelectItem>
                    <SelectItem value="Identity">Identity Provider</SelectItem>
                    <SelectItem value="Cloud">Cloud Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="portnox_integration_level">Portnox Integration</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, portnox_integration_level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Native</SelectItem>
                    <SelectItem value="certified">Certified</SelectItem>
                    <SelectItem value="supported">Supported</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url || ''}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>
          </>
        )}

        {activeTab === 'industries' && (
          <>
            <div>
              <Label htmlFor="name">Industry Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    );
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Taxonomy Management</h2>
          <p className="text-muted-foreground">
            Manage vendors, industries, use cases, requirements, and compliance frameworks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
          >
            {viewMode === 'cards' ? <Database className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
              </DialogHeader>
              {renderCreateForm()}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Vendors ({vendors.length})
          </TabsTrigger>
          <TabsTrigger value="industries" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Industries ({industries.length})
          </TabsTrigger>
          <TabsTrigger value="use-cases" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Use Cases ({useCases.length})
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Requirements ({requirements.length})
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(renderVendorCard)}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Integration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((vendor: any) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.vendor_name}</TableCell>
                      <TableCell>{vendor.vendor_type}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.portnox_integration_level}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedItem(vendor);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(vendor.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="industries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((industry: any) => (
              <Card key={industry.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{industry.name}</CardTitle>
                  <Badge variant="outline">{industry.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((useCase: any) => (
              <Card key={useCase.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{useCase.name}</CardTitle>
                  <Badge variant="outline">{useCase.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((requirement: any) => (
              <Card key={requirement.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{requirement.title}</CardTitle>
                  <Badge variant="outline">{requirement.category}</Badge>
                  <Badge variant="secondary">{requirement.priority}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Compliance Framework Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage compliance frameworks like SOX, HIPAA, PCI-DSS, GDPR, and more
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance Framework
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No {activeTab} found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? `No ${activeTab} match your search criteria.` : `Get started by adding your first ${activeTab.slice(0, -1)}.`}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveTaxonomyManager;