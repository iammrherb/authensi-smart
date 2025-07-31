import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useVendors, useCreateVendor, type Vendor } from "@/hooks/useVendors";
import { CheckCircle, XCircle, AlertCircle, Plus, Search, ExternalLink, Edit, Trash2, Star, Globe, Phone, Mail } from "lucide-react";

const EnhancedVendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: vendorsFromDB = [], isLoading } = useVendors();
  const createVendor = useCreateVendor();

  // Enhanced mock data for comprehensive vendor management
  const comprehensiveVendors: Vendor[] = [
    {
      id: "portnox-001",
      vendor_name: "Portnox",
      vendor_type: "Primary NAC",
      category: "NAC",
      models: ["CORE", "CLEAR", "EDGE"],
      supported_protocols: ["RADIUS", "802.1X", "MAB", "TACACS+", "LDAP"],
      integration_methods: ["Native API", "REST API", "SAML", "SCIM"],
      portnox_compatibility: { level: "native", features: ["full_integration", "advanced_policies"] },
      configuration_templates: { available: true, count: 15 },
      known_limitations: [],
      firmware_requirements: { minimum: "21.1", recommended: "22.3" },
      documentation_links: [
        { title: "Admin Guide", url: "#", type: "setup" },
        { title: "API Reference", url: "#", type: "api" },
        { title: "Best Practices", url: "#", type: "best-practices" }
      ],
      support_level: "full",
      last_tested_date: "2024-01-15",
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-15",
      created_by: "system"
    },
    {
      id: "cisco-meraki-001",
      vendor_name: "Cisco Meraki",
      vendor_type: "Wireless Controller",
      category: "Wireless",
      models: ["MR46", "MR56", "MR86", "MR46E", "MR57"],
      supported_protocols: ["802.11ax", "802.11ac", "WPA3-Enterprise", "RADSec"],
      integration_methods: ["Cloud API", "Dashboard API", "Webhook"],
      portnox_compatibility: { level: "certified", features: ["radsec", "dynamic_policies"] },
      configuration_templates: { available: true, count: 8 },
      known_limitations: ["Cloud dependency", "Limited on-premise control"],
      firmware_requirements: { minimum: "28.6", recommended: "29.7" },
      documentation_links: [
        { title: "Meraki Integration Guide", url: "#", type: "setup" },
        { title: "Dashboard API", url: "#", type: "api" }
      ],
      support_level: "full",
      last_tested_date: "2024-01-12",
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-12",
      created_by: "system"
    },
    {
      id: "palo-alto-001",
      vendor_name: "Palo Alto Networks",
      vendor_type: "Next-Gen Firewall",
      category: "Security",
      models: ["PA-220", "PA-820", "PA-3220", "PA-5220", "VM-Series"],
      supported_protocols: ["User-ID", "GlobalProtect", "WildFire API"],
      integration_methods: ["XML API", "REST API", "User-ID Agent"],
      portnox_compatibility: { level: "certified", features: ["user_mapping", "dynamic_groups"] },
      configuration_templates: { available: true, count: 12 },
      known_limitations: ["Licensing requirements", "Complex policy management"],
      firmware_requirements: { minimum: "10.1", recommended: "11.0" },
      documentation_links: [
        { title: "PAN-OS Integration", url: "#", type: "setup" },
        { title: "XML API Guide", url: "#", type: "api" }
      ],
      support_level: "full",
      last_tested_date: "2024-01-10",
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-10",
      created_by: "system"
    },
    {
      id: "microsoft-intune-001",
      vendor_name: "Microsoft Intune",
      vendor_type: "Mobile Device Management",
      category: "MDM",
      models: ["Cloud Service"],
      supported_protocols: ["SCEP", "PKCS", "Azure AD", "Graph API"],
      integration_methods: ["Graph API", "PowerShell", "Azure Logic Apps"],
      portnox_compatibility: { level: "certified", features: ["certificate_deployment", "compliance_sync"] },
      configuration_templates: { available: true, count: 6 },
      known_limitations: ["Cloud-only", "Azure AD dependency"],
      firmware_requirements: { minimum: "N/A", recommended: "Latest" },
      documentation_links: [
        { title: "Intune Integration", url: "#", type: "setup" },
        { title: "Graph API", url: "#", type: "api" }
      ],
      support_level: "full",
      last_tested_date: "2024-01-14",
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-14",
      created_by: "system"
    }
  ];

  // Combine database vendors with comprehensive mock data
  const allVendors = [...vendorsFromDB, ...comprehensiveVendors];

  const filteredVendors = allVendors.filter(vendor => {
    const matchesSearch = vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendor_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "NAC", "Wireless", "Wired", "Security", "MDM", "SIEM", "EDR", "Identity", "Cloud"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-success" />;
      case "deprecated": return <AlertCircle className="h-4 w-4 text-warning" />;
      case "end-of-life": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getSupportLevelColor = (level?: string) => {
    switch (level) {
      case "full": return "bg-success/10 text-success";
      case "partial": return "bg-warning/10 text-warning";
      case "limited": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const [newVendorForm, setNewVendorForm] = useState({
    vendor_name: "",
    vendor_type: "",
    category: "",
    models: [],
    supported_protocols: [],
    integration_methods: [],
    portnox_compatibility: {},
    configuration_templates: {},
    known_limitations: [],
    firmware_requirements: {},
    documentation_links: [],
    support_level: "full",
    status: "active"
  });

  const handleCreateVendor = async () => {
    try {
      await createVendor.mutateAsync(newVendorForm as any);
      setIsAddDialogOpen(false);
      setNewVendorForm({
        vendor_name: "",
        vendor_type: "",
        category: "",
        models: [],
        supported_protocols: [],
        integration_methods: [],
        portnox_compatibility: {},
        configuration_templates: {},
        known_limitations: [],
        firmware_requirements: {},
        documentation_links: [],
        support_level: "full",
        status: "active"
      });
    } catch (error) {
      console.error("Failed to create vendor:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, models, or capabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogDescription>
                  Create a comprehensive vendor profile with integration details and capabilities.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_name">Vendor Name *</Label>
                    <Input
                      id="vendor_name"
                      value={newVendorForm.vendor_name}
                      onChange={(e) => setNewVendorForm(prev => ({ ...prev, vendor_name: e.target.value }))}
                      placeholder="e.g., Cisco, Aruba, Fortinet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor_type">Vendor Type *</Label>
                    <Input
                      id="vendor_type"
                      value={newVendorForm.vendor_type}
                      onChange={(e) => setNewVendorForm(prev => ({ ...prev, vendor_type: e.target.value }))}
                      placeholder="e.g., Wireless Controller, Firewall"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newVendorForm.category} 
                      onValueChange={(value) => setNewVendorForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== "all").map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_level">Support Level</Label>
                    <Select 
                      value={newVendorForm.support_level} 
                      onValueChange={(value) => setNewVendorForm(prev => ({ ...prev, support_level: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Support</SelectItem>
                        <SelectItem value="partial">Partial Support</SelectItem>
                        <SelectItem value="limited">Limited Support</SelectItem>
                        <SelectItem value="none">No Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Details</Label>
                  <Textarea
                    placeholder="Models, protocols, integration notes..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateVendor} disabled={createVendor.isPending}>
                    {createVendor.isPending ? "Creating..." : "Create Vendor"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-lg transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {vendor.vendor_name}
                        {getStatusIcon(vendor.status)}
                      </CardTitle>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {vendor.category}
                      </Badge>
                      <Badge className={`text-xs ${getSupportLevelColor(vendor.support_level)}`}>
                        {vendor.support_level || 'unknown'} support
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vendor.vendor_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Models Available</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.models.slice(0, 3).map((model, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                        {vendor.models.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.models.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Key Protocols</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.supported_protocols.slice(0, 3).map((protocol, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {protocol}
                          </Badge>
                        ))}
                        {vendor.supported_protocols.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{vendor.supported_protocols.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {vendor.portnox_compatibility && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Portnox Integration</p>
                        <Badge 
                          className={`text-xs mt-1 ${
                            vendor.portnox_compatibility.level === 'native' ? 'bg-success/10 text-success' :
                            vendor.portnox_compatibility.level === 'certified' ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          {vendor.portnox_compatibility.level || 'Standard'}
                        </Badge>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {vendor.vendor_name}
                            {getStatusIcon(vendor.status)}
                            <Badge className="ml-auto">{vendor.category}</Badge>
                          </DialogTitle>
                          <DialogDescription>
                            Comprehensive vendor profile with integration capabilities and configuration details.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedVendor && (
                          <ScrollArea className="h-full">
                            <div className="space-y-6">
                              {/* Overview Section */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                                      <p className="text-sm font-medium">Support Level</p>
                                      <p className="text-xs text-muted-foreground capitalize">{selectedVendor.support_level}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                                      <p className="text-sm font-medium">Models</p>
                                      <p className="text-xs text-muted-foreground">{selectedVendor.models.length} available</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                                      <p className="text-sm font-medium">Protocols</p>
                                      <p className="text-xs text-muted-foreground">{selectedVendor.supported_protocols.length} supported</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <ExternalLink className="h-8 w-8 mx-auto mb-2 text-primary" />
                                      <p className="text-sm font-medium">Documentation</p>
                                      <p className="text-xs text-muted-foreground">{selectedVendor.documentation_links.length} resources</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <Separator />

                              {/* Detailed Information */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-3">Available Models</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedVendor.models.map((model, index) => (
                                        <Badge key={index} variant="secondary">
                                          {model}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">Supported Protocols</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedVendor.supported_protocols.map((protocol, index) => (
                                        <Badge key={index} variant="outline">
                                          {protocol}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">Integration Methods</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedVendor.integration_methods.map((method, index) => (
                                        <Badge key={index} variant="secondary">
                                          {method}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  {selectedVendor.portnox_compatibility && (
                                    <div>
                                      <h4 className="font-semibold mb-3">Portnox Compatibility</h4>
                                      <div className="bg-muted/50 p-3 rounded-lg">
                                        <Badge className="mb-2">
                                          {selectedVendor.portnox_compatibility.level || 'Standard'}
                                        </Badge>
                                        {selectedVendor.portnox_compatibility.features && (
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedVendor.portnox_compatibility.features.map((feature: string, index: number) => (
                                              <Badge key={index} variant="outline" className="text-xs">
                                                {feature.replace(/_/g, ' ')}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {selectedVendor.firmware_requirements && (
                                    <div>
                                      <h4 className="font-semibold mb-3">Firmware Requirements</h4>
                                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                        <p><strong>Minimum:</strong> {selectedVendor.firmware_requirements.minimum || 'N/A'}</p>
                                        <p><strong>Recommended:</strong> {selectedVendor.firmware_requirements.recommended || 'Latest'}</p>
                                      </div>
                                    </div>
                                  )}

                                  {selectedVendor.known_limitations && selectedVendor.known_limitations.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-3">Known Limitations</h4>
                                      <div className="space-y-1">
                                        {selectedVendor.known_limitations.map((limitation, index) => (
                                          <div key={index} className="text-sm text-muted-foreground bg-warning/10 p-2 rounded">
                                            • {limitation}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Separator />

                              {/* Documentation Section */}
                              <div>
                                <h4 className="font-semibold mb-3">Documentation & Resources</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {selectedVendor.documentation_links.map((doc, index) => (
                                    <Card key={index}>
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium">{doc.title}</p>
                                            <Badge variant="outline" className="text-xs mt-1">
                                              {doc.type}
                                            </Badge>
                                          </div>
                                          <Button variant="ghost" size="sm">
                                            <ExternalLink className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              <div className="text-xs text-muted-foreground pt-4 border-t">
                                Last tested: {selectedVendor.last_tested_date || 'Unknown'} | 
                                Last updated: {new Date(selectedVendor.updated_at).toLocaleDateString()}
                              </div>
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredVendors.length === 0 && !isLoading && (
            <Card className="p-8 text-center">
              <CardContent>
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-4">
                  No vendors match your current search criteria. Try adjusting your filters or adding a new vendor.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Vendor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedVendorManagement;