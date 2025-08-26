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
import { useUnifiedVendors, useCreateUnifiedVendor, type UnifiedVendor } from '@/hooks/useUnifiedVendors';
import { CheckCircle, XCircle, AlertCircle, Plus, Search, ExternalLink, Edit, Trash2, Star, Globe, Phone, Mail } from "lucide-react";

const EnhancedVendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<UnifiedVendor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: vendorsFromDB = [], isLoading } = useUnifiedVendors({});
  const createVendor = useCreateUnifiedVendor();

  // Enhanced mock data for comprehensive vendor management
  const comprehensiveVendors: UnifiedVendor[] = [
    {
      id: "portnox-001",
      name: "Portnox",
      category: "NAC",
      subcategory: "Primary NAC",
      icon: "🔐",
      color: "bg-blue-500",
      description: "AI-Powered Network Access Control Platform",
      models: [
        { id: "core-1", name: "CORE", series: "Enterprise", category: "NAC Platform", firmwareVersions: ["21.1", "22.3"], capabilities: ["AI Analytics", "Zero Trust"] },
        { id: "clear-1", name: "CLEAR", series: "Cloud", category: "Cloud NAC", firmwareVersions: ["Cloud-2024.3"], capabilities: ["Cloud Management"] },
        { id: "edge-1", name: "EDGE", series: "Branch", category: "Branch NAC", firmwareVersions: ["6.5.2"], capabilities: ["Branch Protection"] }
      ],
      commonFeatures: ["RADIUS", "802.1X", "MAB", "TACACS+", "LDAP"],
      supportLevel: "full",
      portnoxCompatibility: "native",
      integrationMethods: ["Native API", "REST API", "SAML", "SCIM"],
      knownLimitations: [],
      documentationLinks: ["#admin-guide", "#api-reference", "#best-practices"],
      lastTestedDate: "2024-01-15",
      status: "active"
    },
    {
      id: "cisco-meraki-001",
      name: "Cisco Meraki",
      category: "Wireless",
      subcategory: "Wireless Controller",
      icon: "📶",
      color: "bg-blue-600",
      description: "Cloud-managed wireless access points",
      models: [
        { id: "mr46-1", name: "MR46", series: "Wi-Fi 6", category: "Indoor AP", firmwareVersions: ["28.6", "29.7"], capabilities: ["802.11ax", "WPA3-Enterprise"] },
        { id: "mr56-1", name: "MR56", series: "Wi-Fi 6E", category: "Indoor AP", firmwareVersions: ["28.6", "29.7"], capabilities: ["802.11ax", "6GHz"] },
        { id: "mr86-1", name: "MR86", series: "Wi-Fi 6E", category: "Outdoor AP", firmwareVersions: ["28.6", "29.7"], capabilities: ["802.11ax", "Outdoor"] }
      ],
      commonFeatures: ["802.11ax", "802.11ac", "WPA3-Enterprise", "RADSec"],
      supportLevel: "full",
      portnoxCompatibility: "api",
      integrationMethods: ["Cloud API", "Dashboard API", "Webhook"],
      knownLimitations: ["Cloud dependency", "Limited on-premise control"],
      documentationLinks: ["#meraki-guide", "#dashboard-api"],
      lastTestedDate: "2024-01-12",
      status: "active"
    },
    {
      id: "palo-alto-001",
      name: "Palo Alto Networks",
      category: "Firewall",
      subcategory: "Next-Gen Firewall",
      icon: "🔥",
      color: "bg-orange-500",
      description: "Next-generation firewall and security platform",
      models: [
        { id: "pa220-1", name: "PA-220", series: "200 Series", category: "Entry Firewall", firmwareVersions: ["10.1", "11.0"], capabilities: ["User-ID", "GlobalProtect"] },
        { id: "pa820-1", name: "PA-820", series: "800 Series", category: "Branch Firewall", firmwareVersions: ["10.1", "11.0"], capabilities: ["User-ID", "WildFire"] },
        { id: "vm-1", name: "VM-Series", series: "Virtual", category: "Virtual Firewall", firmwareVersions: ["10.1", "11.0"], capabilities: ["Cloud", "Virtualization"] }
      ],
      commonFeatures: ["User-ID", "GlobalProtect", "WildFire API"],
      supportLevel: "full",
      portnoxCompatibility: "api",
      integrationMethods: ["XML API", "REST API", "User-ID Agent"],
      knownLimitations: ["Licensing requirements", "Complex policy management"],
      documentationLinks: ["#panos-integration", "#xml-api-guide"],
      lastTestedDate: "2024-01-10",
      status: "active"
    },
    {
      id: "microsoft-intune-001",
      name: "Microsoft Intune",
      category: "MDM",
      subcategory: "Mobile Device Management",
      icon: "📱",
      color: "bg-blue-700",
      description: "Cloud-based mobile device and application management",
      models: [
        { id: "intune-1", name: "Cloud Service", series: "Intune", category: "MDM Platform", firmwareVersions: ["Latest"], capabilities: ["SCEP", "PKCS", "Graph API"] }
      ],
      commonFeatures: ["SCEP", "PKCS", "Azure AD", "Graph API"],
      supportLevel: "full",
      portnoxCompatibility: "api",
      integrationMethods: ["Graph API", "PowerShell", "Azure Logic Apps"],
      knownLimitations: ["Cloud-only", "Azure AD dependency"],
      documentationLinks: ["#intune-integration", "#graph-api"],
      lastTestedDate: "2024-01-14",
      status: "active"
    }
  ];

  // Combine database vendors with comprehensive mock data
  const allVendors = [...vendorsFromDB, ...comprehensiveVendors];

  const filteredVendors = allVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.subcategory && vendor.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vendor.description && vendor.description.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const getSupportLevelColor = (level: UnifiedVendor['supportLevel']) => {
    switch (level) {
      case "full": return "bg-success/10 text-success";
      case "partial": return "bg-warning/10 text-warning";
      case "limited": return "bg-destructive/10 text-destructive";
      case "none": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const [newVendorForm, setNewVendorForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    icon: "🏢",
    color: "bg-gray-500",
    description: "",
    models: [],
    commonFeatures: [],
    supportLevel: "full" as UnifiedVendor['supportLevel'],
    portnoxCompatibility: "limited" as UnifiedVendor['portnoxCompatibility'],
    integrationMethods: [],
    knownLimitations: [],
    documentationLinks: [],
    status: "active" as UnifiedVendor['status']
  });

  const handleCreateVendor = async () => {
    try {
      await createVendor.mutateAsync(newVendorForm as any);
      setIsAddDialogOpen(false);
      setNewVendorForm({
        name: "",
        category: "",
        subcategory: "",
        icon: "🏢",
        color: "bg-gray-500",
        description: "",
        models: [],
        commonFeatures: [],
        supportLevel: "full" as UnifiedVendor['supportLevel'],
        portnoxCompatibility: "limited" as UnifiedVendor['portnoxCompatibility'],
        integrationMethods: [],
        knownLimitations: [],
        documentationLinks: [],
        status: "active" as UnifiedVendor['status']
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
                    <Label htmlFor="name">Vendor Name *</Label>
                    <Input
                      id="name"
                      value={newVendorForm.name}
                      onChange={(e) => setNewVendorForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Cisco, Aruba, Fortinet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={newVendorForm.subcategory}
                      onChange={(e) => setNewVendorForm(prev => ({ ...prev, subcategory: e.target.value }))}
                      placeholder="e.g., Wireless Controller, Next-Gen Firewall"
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
                    <Label htmlFor="supportLevel">Support Level</Label>
                    <Select 
                      value={newVendorForm.supportLevel} 
                      onValueChange={(value) => setNewVendorForm(prev => ({ ...prev, supportLevel: value as UnifiedVendor['supportLevel'] }))}
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newVendorForm.description}
                    onChange={(e) => setNewVendorForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the vendor and their solutions..."
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
                        {vendor.name}
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
                      <Badge className={`text-xs ${getSupportLevelColor(vendor.supportLevel)}`}>
                        {vendor.supportLevel} support
                      </Badge>
                      {vendor.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {vendor.subcategory}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Models Available</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.models.slice(0, 3).map((model, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {model.name}
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
                      <p className="text-sm font-medium text-muted-foreground">Key Features</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.commonFeatures.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {vendor.commonFeatures.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{vendor.commonFeatures.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Portnox Integration</p>
                      <Badge 
                        className={`text-xs mt-1 ${
                          vendor.portnoxCompatibility === 'native' ? 'bg-success/10 text-success' :
                          vendor.portnoxCompatibility === 'api' ? 'bg-primary/10 text-primary' :
                          vendor.portnoxCompatibility === 'limited' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {vendor.portnoxCompatibility}
                      </Badge>
                    </div>

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
                            {vendor.name}
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