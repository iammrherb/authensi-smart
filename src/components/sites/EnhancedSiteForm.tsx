import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Site } from "@/hooks/useSites";
import { 
  Building, MapPin, Users, Network, Shield, Smartphone, 
  Router, Wifi, Server, Database, Monitor, HardDrive,
  Lock, Eye, Activity, Globe, Settings, Plus, Trash2
} from "lucide-react";

interface EnhancedSiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (siteData: Partial<Site>) => void;
  initialData?: Site | null;
  isLoading?: boolean;
}

interface VendorSelection {
  category: string;
  vendors: string[];
  models: string[];
  notes: string;
}

const EnhancedSiteForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }: EnhancedSiteFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Information
    name: initialData?.name || "",
    location: initialData?.location || "",
    address: initialData?.address || "",
    contact_name: initialData?.contact_name || "",
    contact_email: initialData?.contact_email || "",
    contact_phone: initialData?.contact_phone || "",
    site_type: initialData?.site_type || "office",
    status: initialData?.status || "planning",
    priority: initialData?.priority || "medium",
    
    // Network Information
    network_segments: initialData?.network_segments || 1,
    device_count: initialData?.device_count || 0,
    
    // Enhanced fields from deployment_config
    deployment_config: {
      network: {
        wired_vendors: [],
        switch_vendors: [],
        firewall_vendors: [],
        wireless_vendors: []
      },
      security: {
        mfa_enabled: false,
        saml_enabled: false,
        ztna_enabled: false,
        microsoft_eam: false,
        openid_enabled: false,
        tacacs_enabled: false,
        edy_integration: false,
        idp_integration: "",
        vpn_integration: false,
        siem_integration: false
      },
      use_cases: [],
      user_types: {
        guests: 0,
        employees: 0,
        contractors: 0,
        service_accounts: 0
      },
      device_types: {
        hvac: 0,
        laptops: 0,
        tablets: 0,
        desktops: 0,
        printers: 0,
        scanners: 0,
        ip_phones: 0,
        ip_cameras: 0,
        mobile_ios: 0,
        ot_devices: 0,
        iot_devices: 0,
        mobile_android: 0
      },
      authentication: {
        mab: false,
        pap: false,
        mschap: false,
        eap_tls: false,
        eap_ttls: false,
        auth_type: ""
      },
      user_management: {
        guest_access: false,
        iot_onboarding: false,
        deployment_mode: "agent",
        gpo_integration: false,
        mdm_integration: false,
        active_directory: false,
        contractor_access: false
      },
      ...(initialData?.deployment_config as any || {})
    }
  });

  const [vendors, setVendors] = useState<VendorSelection[]>([
    { category: "Wired Network", vendors: [], models: [], notes: "" },
    { category: "Wireless Network", vendors: [], models: [], notes: "" },
    { category: "Firewall/Security", vendors: [], models: [], notes: "" },
    { category: "VPN Solutions", vendors: [], models: [], notes: "" },
    { category: "MDM/UEM", vendors: [], models: [], notes: "" },
    { category: "SIEM/SOAR", vendors: [], models: [], notes: "" },
    { category: "EDR/XDR", vendors: [], models: [], notes: "" },
    { category: "Identity Providers", vendors: [], models: [], notes: "" }
  ]);

  // Comprehensive vendor options
  const vendorOptions = {
    "Wired Network": [
      "Cisco Catalyst", "Aruba/HPE ProCurve", "Juniper EX Series", "Extreme Networks",
      "Dell PowerSwitch", "Netgear ProSafe", "D-Link Enterprise", "TP-Link Omada"
    ],
    "Wireless Network": [
      "Cisco Meraki", "Cisco Catalyst 9800", "Aruba Instant On", "Aruba Central",
      "Juniper Mist", "Extreme Wing", "Ruckus Unleashed", "Ubiquiti UniFi"
    ],
    "Firewall/Security": [
      "Palo Alto Networks", "Fortinet FortiGate", "Cisco ASA/FTD", "SonicWall",
      "Check Point", "Barracuda", "WatchGuard", "pfSense", "Sophos XG"
    ],
    "VPN Solutions": [
      "Cisco AnyConnect", "Palo Alto GlobalProtect", "Fortinet FortiClient", "SonicWall NetExtender",
      "Pulse Secure", "Check Point Mobile", "OpenVPN", "WireGuard"
    ],
    "MDM/UEM": [
      "Microsoft Intune", "VMware Workspace ONE", "Jamf Pro", "Google Workspace",
      "IBM MaaS360", "Citrix Endpoint Management", "SOTI MobiControl", "ManageEngine"
    ],
    "SIEM/SOAR": [
      "Splunk Enterprise Security", "IBM QRadar", "ArcSight", "LogRhythm",
      "Microsoft Sentinel", "Sumo Logic", "Rapid7 InsightIDR", "Elastic Security"
    ],
    "EDR/XDR": [
      "CrowdStrike Falcon", "Microsoft Defender", "SentinelOne", "Carbon Black",
      "Symantec Endpoint Protection", "Trend Micro", "Kaspersky", "McAfee MVISION"
    ],
    "Identity Providers": [
      "Microsoft Entra ID", "Active Directory", "Okta", "Ping Identity",
      "Auth0", "OneLogin", "LDAP", "Google Workspace", "AWS IAM"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update deployment_config with vendor selections
    const updatedDeploymentConfig = {
      ...formData.deployment_config,
      vendor_selections: vendors.reduce((acc, vendor) => {
        acc[vendor.category] = {
          vendors: vendor.vendors,
          models: vendor.models,
          notes: vendor.notes
        };
        return acc;
      }, {} as any)
    };

    onSubmit({
      ...formData,
      deployment_config: updatedDeploymentConfig
    });
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleDeploymentConfigChange = (path: string, value: any) => {
    const pathArray = path.split('.');
    setFormData(prev => {
      const newConfig = { ...prev.deployment_config };
      let current = newConfig;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i] as keyof typeof current] as any;
      }
      
      current[pathArray[pathArray.length - 1] as keyof typeof current] = value;
      
      return {
        ...prev,
        deployment_config: newConfig
      };
    });
  };

  const handleVendorSelection = (categoryIndex: number, field: string, value: any) => {
    setVendors(prev => prev.map((vendor, index) => 
      index === categoryIndex 
        ? { ...vendor, [field]: value }
        : vendor
    ));
  };

  const addVendorToCategory = (categoryIndex: number, vendorName: string) => {
    setVendors(prev => prev.map((vendor, index) => 
      index === categoryIndex 
        ? { ...vendor, vendors: [...vendor.vendors, vendorName] }
        : vendor
    ));
  };

  const removeVendorFromCategory = (categoryIndex: number, vendorIndex: number) => {
    setVendors(prev => prev.map((vendor, index) => 
      index === categoryIndex 
        ? { ...vendor, vendors: vendor.vendors.filter((_, i) => i !== vendorIndex) }
        : vendor
    ));
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Building className="h-4 w-4" /> },
    { id: "network", label: "Network", icon: <Network className="h-4 w-4" /> },
    { id: "vendors", label: "Vendors", icon: <Server className="h-4 w-4" /> },
    { id: "devices", label: "Devices", icon: <Monitor className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Site" : "Create New Site"}
          </DialogTitle>
          <DialogDescription>
            Complete site configuration with network infrastructure, vendor selection, and security settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[70vh] mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Site Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Site Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter site name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Complete street address"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site_type">Site Type</Label>
                      <Select value={formData.site_type} onValueChange={(value) => handleInputChange("site_type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Corporate Office</SelectItem>
                          <SelectItem value="branch">Branch Office</SelectItem>
                          <SelectItem value="data_center">Data Center</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="remote_site">Remote Site</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Primary Contact</Label>
                      <Input
                        id="contact_name"
                        value={formData.contact_name}
                        onChange={(e) => handleInputChange("contact_name", e.target.value)}
                        placeholder="Contact person name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => handleInputChange("contact_email", e.target.value)}
                          placeholder="contact@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Phone</Label>
                        <Input
                          id="contact_phone"
                          value={formData.contact_phone}
                          onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Network Configuration Tab */}
              <TabsContent value="network" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Network Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="network_segments">Network Segments</Label>
                      <Input
                        id="network_segments"
                        type="number"
                        min="1"
                        value={formData.network_segments}
                        onChange={(e) => handleInputChange("network_segments", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device_count">Estimated Device Count</Label>
                      <Input
                        id="device_count"
                        type="number"
                        min="0"
                        value={formData.device_count}
                        onChange={(e) => handleInputChange("device_count", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.deployment_config.authentication).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={typeof value === 'boolean' ? value : false}
                          onCheckedChange={(checked) => 
                            handleDeploymentConfigChange(`authentication.${key}`, checked)
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vendors Tab */}
              <TabsContent value="vendors" className="space-y-6">
                <div className="grid gap-4">
                  {vendors.map((vendorCategory, categoryIndex) => (
                    <Card key={vendorCategory.category}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Server className="h-5 w-5" />
                          {vendorCategory.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Select onValueChange={(value) => addVendorToCategory(categoryIndex, value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Add vendor..." />
                            </SelectTrigger>
                            <SelectContent>
                              {vendorOptions[vendorCategory.category as keyof typeof vendorOptions]?.map((vendor) => (
                                <SelectItem key={vendor} value={vendor}>
                                  {vendor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {vendorCategory.vendors.map((vendor, vendorIndex) => (
                            <Badge
                              key={vendorIndex}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              {vendor}
                              <button
                                type="button"
                                onClick={() => removeVendorFromCategory(categoryIndex, vendorIndex)}
                                className="hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <Textarea
                          placeholder="Models, versions, or additional notes..."
                          value={vendorCategory.notes}
                          onChange={(e) => handleVendorSelection(categoryIndex, 'notes', e.target.value)}
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Device Types Tab */}
              <TabsContent value="devices" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Device Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    {Object.entries(formData.deployment_config.device_types).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                        <Input
                          id={key}
                          type="number"
                          min="0"
                          value={value as number}
                          onChange={(e) => 
                            handleDeploymentConfigChange(`device_types.${key}`, parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Configuration Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.deployment_config.security).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={typeof value === 'boolean' ? value : false}
                          onCheckedChange={(checked) => 
                            handleDeploymentConfigChange(`security.${key}`, checked)
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.deployment_config.user_management).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={typeof value === 'boolean' ? value : false}
                          onCheckedChange={(checked) => 
                            handleDeploymentConfigChange(`user_management.${key}`, checked)
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Types Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.deployment_config.user_types).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                        <Input
                          id={key}
                          type="number"
                          min="0"
                          value={value as number}
                          onChange={(e) => 
                            handleDeploymentConfigChange(`user_types.${key}`, parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </form>
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Saving..." : (initialData ? "Update Site" : "Create Site")}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSiteForm;