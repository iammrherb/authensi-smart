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
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Download, 
  Upload,
  Building2,
  Shield,
  Clock,
  Users,
  FileText,
  Network,
  Settings
} from "lucide-react";

interface ProjectTemplatesManagerProps {
  searchTerm: string;
}

const ProjectTemplatesManager: React.FC<ProjectTemplatesManagerProps> = ({ searchTerm }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock project templates data
  const projectTemplates = [
    {
      id: "template-001",
      name: "Enterprise Banking NAC",
      description: "Comprehensive NAC deployment template for banking and financial institutions",
      industry: "Financial Services",
      deployment_type: "hybrid",
      security_level: "high",
      complexity: "high",
      estimated_duration: "16-20 weeks",
      sites_supported: "1-50",
      use_cases: [
        "Certificate-based Authentication",
        "Guest Network Access",
        "BYOD Management",
        "Compliance Reporting"
      ],
      requirements: [
        "PCI DSS Compliance",
        "Multi-factor Authentication",
        "Network Segmentation",
        "Audit Logging"
      ],
      vendor_configurations: [
        "Cisco ISE Integration",
        "Microsoft AD Integration",
        "Palo Alto Firewall",
        "Aruba Wireless"
      ],
      timeline_template: {
        "Phase 1 - Discovery": "2-3 weeks",
        "Phase 2 - Design": "3-4 weeks", 
        "Phase 3 - Implementation": "8-10 weeks",
        "Phase 4 - Testing & Go-live": "3-4 weeks"
      },
      created_at: "2024-01-15",
      created_by: "system",
      usage_count: 12,
      success_rate: 94
    },
    {
      id: "template-002",
      name: "Healthcare HIPAA Compliant NAC",
      description: "HIPAA-compliant NAC template for healthcare organizations",
      industry: "Healthcare",
      deployment_type: "on-premise",
      security_level: "critical",
      complexity: "high",
      estimated_duration: "14-18 weeks",
      sites_supported: "1-25",
      use_cases: [
        "Medical Device Authentication",
        "Staff Access Control",
        "Guest Patient Access",
        "IoT Device Management"
      ],
      requirements: [
        "HIPAA Compliance",
        "Device Classification",
        "Network Isolation",
        "Encrypted Communications"
      ],
      vendor_configurations: [
        "Aruba ClearPass",
        "Cisco Meraki",
        "Microsoft Intune",
        "Fortinet FortiGate"
      ],
      timeline_template: {
        "Phase 1 - Assessment": "2 weeks",
        "Phase 2 - Design & Planning": "4 weeks",
        "Phase 3 - Pilot Implementation": "4 weeks",
        "Phase 4 - Full Rollout": "6-8 weeks",
        "Phase 5 - Validation": "2 weeks"
      },
      created_at: "2024-01-10",
      created_by: "system",
      usage_count: 8,
      success_rate: 97
    },
    {
      id: "template-003",
      name: "Manufacturing IoT Security",
      description: "Specialized template for manufacturing environments with extensive IoT devices",
      industry: "Manufacturing",
      deployment_type: "hybrid",
      security_level: "high",
      complexity: "medium",
      estimated_duration: "10-14 weeks",
      sites_supported: "1-10",
      use_cases: [
        "OT Device Authentication",
        "Network Segmentation",
        "Asset Discovery",
        "Compliance Monitoring"
      ],
      requirements: [
        "OT/IT Segregation",
        "Real-time Monitoring",
        "Zero Downtime Deployment",
        "Legacy Device Support"
      ],
      vendor_configurations: [
        "Portnox CORE",
        "Cisco Industrial Switches",
        "Rockwell Automation",
        "Schneider Electric"
      ],
      timeline_template: {
        "Phase 1 - OT Assessment": "2 weeks",
        "Phase 2 - Network Design": "3 weeks",
        "Phase 3 - Staged Rollout": "6-8 weeks",
        "Phase 4 - Optimization": "2 weeks"
      },
      created_at: "2024-01-08",
      created_by: "system",
      usage_count: 15,
      success_rate: 91
    }
  ];

  const filteredTemplates = projectTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "standard": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Project Templates</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} templates available
          </p>
        </div>
        <div className="flex gap-2">
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
                <DialogTitle>Create Project Template</DialogTitle>
                <DialogDescription>
                  Create a reusable project template for specific deployment scenarios.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input placeholder="e.g., Enterprise Banking NAC" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial Services</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed description of the template..." rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Deployment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-premise">On-Premise</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Security Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Complexity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.industry}
                  </Badge>
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
              <div className="flex flex-wrap gap-2">
                <Badge className={getComplexityColor(template.complexity)}>
                  {template.complexity} complexity
                </Badge>
                <Badge className={getSecurityLevelColor(template.security_level)}>
                  {template.security_level} security
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.deployment_type}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{template.estimated_duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{template.sites_supported} sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Used {template.usage_count} times</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Key Use Cases:</p>
                <div className="flex flex-wrap gap-1">
                  {template.use_cases.slice(0, 2).map((useCase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                  {template.use_cases.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.use_cases.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">
                  Success: {template.success_rate}%
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm">
                    Use Template
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
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              No project templates match your search criteria.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectTemplatesManager;