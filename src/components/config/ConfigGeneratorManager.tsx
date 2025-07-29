import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Edit, 
  Copy, 
  Download, 
  Upload,
  Code,
  Cpu,
  Network,
  Zap,
  Settings,
  ChevronRight,
  FileCode,
  Bot
} from "lucide-react";

interface ConfigGeneratorManagerProps {
  searchTerm: string;
}

const ConfigGeneratorManager: React.FC<ConfigGeneratorManagerProps> = ({ searchTerm }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [configType, setConfigType] = useState("");

  // Mock configuration templates data
  const configTemplates = [
    {
      id: "config-001",
      name: "Cisco Catalyst 9300 - 802.1X Basic",
      vendor: "Cisco",
      model: "Catalyst 9300 Series",
      config_type: "802.1X Authentication",
      difficulty: "intermediate",
      use_cases: ["Corporate Authentication", "Guest Access"],
      description: "Basic 802.1X configuration for Cisco Catalyst 9300 switches with RADIUS authentication",
      config_template: `! Basic 802.1X Configuration for Cisco Catalyst 9300
! RADIUS Server Configuration
radius server PORTNOX
 address ipv4 192.168.1.100 auth-port 1812 acct-port 1813
 key 7 $SharedSecret$

! AAA Configuration  
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

! 802.1X Global Configuration
dot1x system-auth-control
dot1x critical eapol

! Interface Configuration Template
interface range GigabitEthernet1/0/1-48
 description Access Port with 802.1X
 switchport mode access
 switchport access vlan $DATA_VLAN$
 authentication event fail action authorize vlan $GUEST_VLAN$
 authentication event server dead action authorize vlan $GUEST_VLAN$
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
 spanning-tree bpduguard enable`,
      variables: [
        { name: "SharedSecret", description: "RADIUS shared secret", default: "SecureKey123" },
        { name: "DATA_VLAN", description: "Data VLAN ID", default: "100" },
        { name: "GUEST_VLAN", description: "Guest/Quarantine VLAN ID", default: "999" }
      ],
      created_at: "2024-01-15",
      usage_count: 45,
      rating: 4.8
    },
    {
      id: "config-002", 
      name: "Aruba 2930F - Multi-Auth with MAB",
      vendor: "Aruba",
      model: "2930F Series",
      config_type: "802.1X Multi-Auth",
      difficulty: "advanced",
      use_cases: ["BYOD", "IoT Device Authentication", "Corporate Access"],
      description: "Advanced 802.1X configuration with multi-authentication and MAB fallback for Aruba switches",
      config_template: `# Aruba 2930F 802.1X Multi-Auth Configuration
# RADIUS Server Configuration
radius-server host 192.168.1.100 key "$SharedSecret$"
radius-server host 192.168.1.101 key "$SharedSecret$"

# AAA Configuration
aaa authentication port-access eap-radius server-group "PORTNOX"
aaa authentication port-access mac-based server-group "PORTNOX"

# Server Group Configuration  
aaa server-group radius "PORTNOX" host 192.168.1.100
aaa server-group radius "PORTNOX" host 192.168.1.101

# Global 802.1X Settings
aaa port-access authenticator active
aaa port-access mac-based addr-format multi-colon

# Interface Configuration
interface 1-48
   aaa port-access authenticator
   aaa port-access mac-based
   aaa port-access controlled-direction in
   aaa port-access auth-mode multi-host
   aaa port-access auth-order authenticator mac-based
   untagged vlan $DATA_VLAN$

# VLAN Configuration
vlan $DATA_VLAN$
   name "Corporate_Data"
   
vlan $GUEST_VLAN$
   name "Guest_Network"
   
vlan $IOT_VLAN$
   name "IoT_Devices"`,
      variables: [
        { name: "SharedSecret", description: "RADIUS shared secret", default: "ArubaNAC2024" },
        { name: "DATA_VLAN", description: "Corporate Data VLAN", default: "10" },
        { name: "GUEST_VLAN", description: "Guest VLAN", default: "20" },
        { name: "IOT_VLAN", description: "IoT VLAN", default: "30" }
      ],
      created_at: "2024-01-12",
      usage_count: 32,
      rating: 4.6
    },
    {
      id: "config-003",
      name: "Juniper EX4300 - Dynamic VLAN Assignment",
      vendor: "Juniper",
      model: "EX4300 Series",
      config_type: "Dynamic VLAN Assignment",
      difficulty: "advanced",
      use_cases: ["Dynamic Segmentation", "User-based VLANs", "Role-based Access"],
      description: "Dynamic VLAN assignment based on user authentication for Juniper EX switches",
      config_template: `# Juniper EX4300 Dynamic VLAN Configuration
# RADIUS Configuration
set system radius-server 192.168.1.100 port 1812
set system radius-server 192.168.1.100 accounting-port 1813
set system radius-server 192.168.1.100 secret "$SharedSecret$"
set system radius-server 192.168.1.100 source-address 192.168.1.10

# AAA Configuration
set access radius-server 192.168.1.100 port 1812
set access radius-server 192.168.1.100 accounting-port 1813
set access radius-server 192.168.1.100 secret "$SharedSecret$"

# 802.1X Configuration
set protocols dot1x authenticator authentication-profile-name PORTNOX-AUTH
set protocols dot1x authenticator interface all
set protocols dot1x authenticator interface all supplicant single
set protocols dot1x authenticator interface all retries 3
set protocols dot1x authenticator interface all quiet-period 60
set protocols dot1x authenticator interface all tx-period 30
set protocols dot1x authenticator interface all supplicant-timeout 30
set protocols dot1x authenticator interface all server-timeout 30
set protocols dot1x authenticator interface all max-requests 2
set protocols dot1x authenticator interface all guest-vlan $GUEST_VLAN$
set protocols dot1x authenticator interface all server-fail-vlan $GUEST_VLAN$

# Access Profile
set access profile PORTNOX-AUTH authentication-order radius
set access profile PORTNOX-AUTH radius authentication-server 192.168.1.100
set access profile PORTNOX-AUTH radius accounting-server 192.168.1.100

# Interface Configuration
set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode access
set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members $DATA_VLAN$
set interfaces ge-0/0/0 unit 0 family ethernet-switching filter input SECURITY-FILTER`,
      variables: [
        { name: "SharedSecret", description: "RADIUS shared secret", default: "JuniperNAC!" },
        { name: "DATA_VLAN", description: "Default Data VLAN", default: "user-data" },
        { name: "GUEST_VLAN", description: "Guest VLAN", default: "guest-access" }
      ],
      created_at: "2024-01-10",
      usage_count: 18,
      rating: 4.4
    }
  ];

  const vendors = ["Cisco", "Aruba", "Juniper", "HP Enterprise", "Fortinet", "Extreme Networks"];
  const configTypes = [
    "802.1X Authentication",
    "802.1X Multi-Auth", 
    "Dynamic VLAN Assignment",
    "Guest Access",
    "IoT Device Authentication",
    "Wireless Integration"
  ];

  const filteredTemplates = configTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.config_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAIGenerate = () => {
    // This would integrate with the AI generation service
    console.log("Generating config for:", selectedVendor, configType);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Configuration Templates</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} configuration templates available
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAIGeneratorOpen} onOpenChange={setIsAIGeneratorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <Bot className="h-4 w-4 mr-2" />
                AI Generator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration Generator
                </DialogTitle>
                <DialogDescription>
                  Generate custom 802.1X configurations using AI for any supported vendor and use case.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Configuration Type</Label>
                    <Select value={configType} onValueChange={setConfigType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select config type" />
                      </SelectTrigger>
                      <SelectContent>
                        {configTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Requirements & Use Cases</Label>
                  <Textarea 
                    placeholder="Describe your specific requirements, network topology, VLANs, authentication methods, etc..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Network Parameters</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="RADIUS Server IP" />
                    <Input placeholder="Data VLAN" />
                    <Input placeholder="Guest VLAN" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAIGeneratorOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAIGenerate} disabled={!selectedVendor || !configType}>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Configuration
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Configuration Template</DialogTitle>
                <DialogDescription>
                  Create a reusable configuration template for specific vendor and use case.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input placeholder="e.g., Cisco 9300 Basic 802.1X" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Configuration Template</Label>
                  <Textarea 
                    placeholder="Enter the configuration template with variables like $VLAN_ID$..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Configuration Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.vendor}
                    </Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Configuration Type:</p>
                <Badge variant="outline" className="text-xs">
                  {template.config_type}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Use Cases:</p>
                <div className="flex flex-wrap gap-1">
                  {template.use_cases.map((useCase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 3).map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      ${variable.name}$
                    </Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Used {template.usage_count} times</span>
                <span>Rating: {template.rating}/5.0</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm">
                  <FileCode className="h-4 w-4 mr-1" />
                  View Code
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No configuration templates found</h3>
            <p className="text-muted-foreground mb-4">
              No configuration templates match your search criteria.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsAIGeneratorOpen(true)} variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfigGeneratorManager;