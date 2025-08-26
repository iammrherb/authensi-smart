import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useUnifiedVendors, useCreateVendor, type Vendor } from '@/hooks/useUnifiedVendors';
import { CheckCircle, XCircle, AlertCircle, Plus, Search, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const { data: vendors = [], isLoading } = useUnifiedVendors({});
  const createVendor = useCreateVendor();

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendor_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deprecated": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "end-of-life": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "deprecated": return "bg-yellow-100 text-yellow-800";
      case "end-of-life": return "bg-red-100 text-red-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getUniqueCategories = () => {
    const categories = vendors.map(v => v.category);
    return [...new Set(categories)];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, features, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full auto-cols-max grid-flow-col">
          <TabsTrigger value="all">All ({vendors.length})</TabsTrigger>
          {getUniqueCategories().map(category => {
            const count = vendors.filter(v => v.category === category).length;
            return (
              <TabsTrigger key={category} value={category}>
                {category} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {getStatusIcon(vendor.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {vendor.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {vendor.vendor_type}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Support Level</p>
                    <p className="text-sm capitalize">{vendor.support_level || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Models</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vendor.models?.slice(0, 2).map((model: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {typeof model === 'string' ? model : model.name || 'Model'}
                        </Badge>
                      ))}
                      {vendor.models?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.models.length - 2} more
                        </Badge>
                      )}
                    </div>
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
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {vendor.name}
                          {getStatusIcon(vendor.status)}
                        </DialogTitle>
                        <DialogDescription>
                          Complete vendor details including capabilities, models, and integration status.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedVendor && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Category & Type</h4>
                              <div className="space-y-2">
                                <Badge>{selectedVendor.category}</Badge>
                                <Badge variant="outline">{selectedVendor.vendor_type}</Badge>
                                <Badge className={getStatusColor(selectedVendor.status)}>
                                  {selectedVendor.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Support Level</h4>
                              <p className="capitalize">{selectedVendor.support_level || 'Not specified'}</p>
                            </div>
                          </div>

                          {selectedVendor.models && selectedVendor.models.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Supported Models</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedVendor.models.map((model: any, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {typeof model === 'string' ? model : model.name || `Model ${index + 1}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedVendor.supported_protocols && selectedVendor.supported_protocols.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Supported Protocols</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedVendor.supported_protocols.map((protocol: any, index: number) => (
                                  <Badge key={index} variant="outline">
                                    {typeof protocol === 'string' ? protocol : protocol.name || `Protocol ${index + 1}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedVendor.integration_methods && selectedVendor.integration_methods.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Integration Methods</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedVendor.integration_methods.map((method: any, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {typeof method === 'string' ? method : method.name || `Method ${index + 1}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedVendor.known_limitations && selectedVendor.known_limitations.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Known Limitations</h4>
                              <div className="space-y-2">
                                {selectedVendor.known_limitations.map((limitation: any, index: number) => (
                                  <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                    {typeof limitation === 'string' ? limitation : limitation.description || `Limitation ${index + 1}`}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedVendor.documentation_links && selectedVendor.documentation_links.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Documentation</h4>
                              <div className="space-y-2">
                                {selectedVendor.documentation_links.map((doc: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <div>
                                      <span className="font-medium">
                                        {typeof doc === 'string' ? 'Documentation' : doc.title || `Document ${index + 1}`}
                                      </span>
                                      {doc.type && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          {doc.type}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedVendor.last_tested_date && (
                            <div className="text-xs text-muted-foreground">
                              Last tested: {new Date(selectedVendor.last_tested_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vendors found matching your criteria.</p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Vendor
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorManagement;