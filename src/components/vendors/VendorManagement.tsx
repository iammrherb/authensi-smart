import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle, Plus, Search, ExternalLink } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  category: "NAC" | "Network" | "Security" | "Identity" | "Cloud";
  logo?: string;
  status: "certified" | "compatible" | "testing" | "unsupported";
  integrationLevel: "native" | "api" | "limited" | "none";
  supportedFeatures: string[];
  certifications: string[];
  useCases: string[];
  documentation: { title: string; url: string; type: "setup" | "api" | "best-practices" }[];
  contactInfo: {
    support: string;
    sales: string;
    technical: string;
  };
  notes: string;
  lastUpdated: string;
}

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const vendors: Vendor[] = [
    {
      id: "portnox",
      name: "Portnox",
      category: "NAC",
      status: "certified",
      integrationLevel: "native",
      supportedFeatures: ["Device Discovery", "Policy Engine", "Guest Management", "IoT Security", "Compliance Reporting"],
      certifications: ["SOC 2", "ISO 27001", "FedRAMP Ready"],
      useCases: ["Zero Trust", "IoT Security", "BYOD", "Guest Access", "Compliance"],
      documentation: [
        { title: "Admin Guide", url: "#", type: "setup" },
        { title: "API Reference", url: "#", type: "api" },
        { title: "Best Practices", url: "#", type: "best-practices" }
      ],
      contactInfo: {
        support: "support@portnox.com",
        sales: "sales@portnox.com",
        technical: "tech@portnox.com"
      },
      notes: "Primary NAC solution with full feature support",
      lastUpdated: "2024-01-15"
    },
    {
      id: "cisco-ise",
      name: "Cisco ISE",
      category: "NAC",
      status: "compatible",
      integrationLevel: "api",
      supportedFeatures: ["Policy Management", "Device Profiling", "Guest Portal", "TrustSec Integration"],
      certifications: ["Common Criteria", "FIPS 140-2"],
      useCases: ["Enterprise NAC", "TrustSec", "Guest Management", "Device Compliance"],
      documentation: [
        { title: "Integration Guide", url: "#", type: "setup" },
        { title: "pxGrid API", url: "#", type: "api" }
      ],
      contactInfo: {
        support: "tac@cisco.com",
        sales: "sales@cisco.com",
        technical: "technical@cisco.com"
      },
      notes: "Strong enterprise features, complex deployment",
      lastUpdated: "2024-01-10"
    },
    {
      id: "aruba-clearpass",
      name: "Aruba ClearPass",
      category: "NAC",
      status: "compatible",
      integrationLevel: "api",
      supportedFeatures: ["Policy Manager", "Guest", "OnBoard", "OnGuard"],
      certifications: ["Common Criteria EAL4+"],
      useCases: ["BYOD", "Guest Access", "IoT Onboarding", "Policy Enforcement"],
      documentation: [
        { title: "ClearPass Integration", url: "#", type: "setup" },
        { title: "REST API Guide", url: "#", type: "api" }
      ],
      contactInfo: {
        support: "support@arubanetworks.com",
        sales: "sales@arubanetworks.com",
        technical: "technical@arubanetworks.com"
      },
      notes: "Excellent for wireless-first environments",
      lastUpdated: "2024-01-12"
    },
    {
      id: "fortinet-fortigate",
      name: "Fortinet FortiGate",
      category: "Security",
      status: "compatible",
      integrationLevel: "api",
      supportedFeatures: ["Firewall", "UTM", "SD-WAN", "Security Fabric"],
      certifications: ["NSS Labs", "ICSA Labs"],
      useCases: ["Network Security", "UTM", "SD-WAN", "Security Fabric Integration"],
      documentation: [
        { title: "FortiOS Integration", url: "#", type: "setup" },
        { title: "FortiAPI Guide", url: "#", type: "api" }
      ],
      contactInfo: {
        support: "support@fortinet.com",
        sales: "sales@fortinet.com",
        technical: "technical@fortinet.com"
      },
      notes: "Strong security features, good API support",
      lastUpdated: "2024-01-08"
    },
    {
      id: "microsoft-ad",
      name: "Microsoft Active Directory",
      category: "Identity",
      status: "certified",
      integrationLevel: "native",
      supportedFeatures: ["LDAP", "Kerberos", "Group Policy", "Certificate Services"],
      certifications: ["FIPS 140-2", "Common Criteria"],
      useCases: ["User Authentication", "Group Management", "Certificate Management", "SSO"],
      documentation: [
        { title: "AD Integration Guide", url: "#", type: "setup" },
        { title: "LDAP Configuration", url: "#", type: "best-practices" }
      ],
      contactInfo: {
        support: "support@microsoft.com",
        sales: "sales@microsoft.com",
        technical: "technical@microsoft.com"
      },
      notes: "Essential for enterprise identity management",
      lastUpdated: "2024-01-14"
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.supportedFeatures.some(feature => 
                           feature.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: Vendor["status"]) => {
    switch (status) {
      case "certified": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "compatible": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "testing": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "unsupported": return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Vendor["status"]) => {
    switch (status) {
      case "certified": return "bg-green-100 text-green-800";
      case "compatible": return "bg-blue-100 text-blue-800";
      case "testing": return "bg-yellow-100 text-yellow-800";
      case "unsupported": return "bg-red-100 text-red-800";
    }
  };

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="NAC">NAC</TabsTrigger>
          <TabsTrigger value="Network">Network</TabsTrigger>
          <TabsTrigger value="Security">Security</TabsTrigger>
          <TabsTrigger value="Identity">Identity</TabsTrigger>
          <TabsTrigger value="Cloud">Cloud</TabsTrigger>
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
                    <Badge className={`text-xs ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Integration Level</p>
                    <p className="text-sm capitalize">{vendor.integrationLevel}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Key Features</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vendor.supportedFeatures.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {vendor.supportedFeatures.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.supportedFeatures.length - 3} more
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
                      </DialogHeader>
                      
                      {selectedVendor && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Category & Status</h4>
                              <div className="space-y-2">
                                <Badge>{selectedVendor.category}</Badge>
                                <Badge className={getStatusColor(selectedVendor.status)}>
                                  {selectedVendor.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Integration Level</h4>
                              <p className="capitalize">{selectedVendor.integrationLevel}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Supported Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedVendor.supportedFeatures.map((feature, index) => (
                                <Badge key={index} variant="secondary">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedVendor.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Use Cases</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedVendor.useCases.map((useCase, index) => (
                                <Badge key={index} variant="secondary">
                                  {useCase}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Documentation</h4>
                            <div className="space-y-2">
                              {selectedVendor.documentation.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                  <div>
                                    <span className="font-medium">{doc.title}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {doc.type}
                                    </Badge>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Support</p>
                                <p className="text-muted-foreground">{selectedVendor.contactInfo.support}</p>
                              </div>
                              <div>
                                <p className="font-medium">Sales</p>
                                <p className="text-muted-foreground">{selectedVendor.contactInfo.sales}</p>
                              </div>
                              <div>
                                <p className="font-medium">Technical</p>
                                <p className="text-muted-foreground">{selectedVendor.contactInfo.technical}</p>
                              </div>
                            </div>
                          </div>

                          {selectedVendor.notes && (
                            <div>
                              <h4 className="font-semibold mb-2">Notes</h4>
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                {selectedVendor.notes}
                              </p>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Last updated: {selectedVendor.lastUpdated}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorManagement;