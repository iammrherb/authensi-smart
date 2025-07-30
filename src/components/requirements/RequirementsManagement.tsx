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
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertTriangle, Clock, Plus, Search, FileText, Link as LinkIcon, Edit, Trash2, Tag } from "lucide-react";
import { useRequirements, useCreateRequirement } from "@/hooks/useRequirements";
import { useUseCases, useCreateUseCase } from "@/hooks/useUseCases";
import RequirementForm from "./RequirementForm";
import UseCaseForm from "../use-cases/UseCaseForm";

interface Requirement {
  id: string;
  title: string;
  category: "Technical" | "Compliance" | "Business" | "Security" | "Operational";
  priority: "critical" | "high" | "medium" | "low";
  status: "draft" | "approved" | "under-review" | "deprecated";
  description: string;
  prerequisites: string[];
  acceptanceCriteria: string[];
  testCases: string[];
  relatedUseCases: string[];
  vendors: string[];
  documentation: { title: string; url: string; type: string }[];
  tags: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

interface UseCase {
  id: string;
  name: string;
  category: "Authentication" | "Authorization" | "Monitoring" | "Compliance" | "Guest Access" | "IoT Security";
  description: string;
  businessValue: string;
  technicalRequirements: string[];
  prerequisites: string[];
  testScenarios: string[];
  supportedVendors: string[];
  complexity: "low" | "medium" | "high";
  estimatedEffort: string;
  dependencies: string[];
}

const RequirementsManagement = () => {
  const [activeTab, setActiveTab] = useState("requirements");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<Requirement | UseCase | null>(null);
  const [isAddRequirementOpen, setIsAddRequirementOpen] = useState(false);
  const [isAddUseCaseOpen, setIsAddUseCaseOpen] = useState(false);

  const { data: dbRequirements = [], isLoading: loadingRequirements } = useRequirements();
  const { data: dbUseCases = [], isLoading: loadingUseCases } = useUseCases();
  const createRequirement = useCreateRequirement();
  const createUseCase = useCreateUseCase();

  const requirements: Requirement[] = [
    {
      id: "req-001",
      title: "Active Directory Integration",
      category: "Technical",
      priority: "critical",
      status: "approved",
      description: "Integration with Microsoft Active Directory for user authentication and authorization",
      prerequisites: [
        "Active Directory Domain Services installed",
        "Network connectivity to domain controllers",
        "Service account with appropriate permissions",
        "Certificate trust established"
      ],
      acceptanceCriteria: [
        "Users can authenticate using AD credentials",
        "Group membership is properly synchronized",
        "LDAP queries respond within 2 seconds",
        "Failover to secondary DC works seamlessly"
      ],
      testCases: [
        "Verify successful user authentication",
        "Test group membership retrieval",
        "Validate LDAP query performance",
        "Test domain controller failover"
      ],
      relatedUseCases: ["User Authentication", "Role-Based Access", "SSO Integration"],
      vendors: ["Microsoft", "Portnox", "Cisco ISE"],
      documentation: [
        { title: "AD Integration Guide", url: "#", type: "setup" },
        { title: "LDAP Configuration", url: "#", type: "config" }
      ],
      tags: ["authentication", "ldap", "microsoft", "sso"],
      createdBy: "john.doe@company.com",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-15"
    },
    {
      id: "req-002",
      title: "Device Profiling Accuracy",
      category: "Technical",
      priority: "high",
      status: "approved",
      description: "Accurate identification and classification of network devices",
      prerequisites: [
        "Network scanning capabilities enabled",
        "Device fingerprint database updated",
        "SNMP community strings configured",
        "Network access for device discovery"
      ],
      acceptanceCriteria: [
        "Device identification accuracy >95%",
        "Classification completed within 30 seconds",
        "Support for 1000+ device types",
        "Custom device profiles can be created"
      ],
      testCases: [
        "Test device discovery across VLANs",
        "Verify device classification accuracy",
        "Test custom device profile creation",
        "Validate device behavior tracking"
      ],
      relatedUseCases: ["IoT Device Management", "Network Visibility", "Asset Tracking"],
      vendors: ["Portnox", "Cisco ISE", "Aruba ClearPass"],
      documentation: [
        { title: "Device Profiling Guide", url: "#", type: "setup" },
        { title: "Custom Profiles", url: "#", type: "config" }
      ],
      tags: ["profiling", "discovery", "iot", "classification"],
      createdBy: "jane.smith@company.com",
      createdDate: "2024-01-12",
      lastUpdated: "2024-01-18"
    },
    {
      id: "req-003",
      title: "HIPAA Compliance Reporting",
      category: "Compliance",
      priority: "critical",
      status: "under-review",
      description: "Comprehensive audit logging and reporting for HIPAA compliance",
      prerequisites: [
        "Audit logging infrastructure deployed",
        "Log retention policies defined",
        "Secure log storage configured",
        "Report templates created"
      ],
      acceptanceCriteria: [
        "All access events are logged",
        "Logs are tamper-proof and encrypted",
        "Reports generated within 24 hours",
        "Audit trail covers 12 months minimum"
      ],
      testCases: [
        "Verify comprehensive audit logging",
        "Test log integrity and encryption",
        "Validate report generation",
        "Test log retention policies"
      ],
      relatedUseCases: ["Compliance Reporting", "Audit Trail", "Access Monitoring"],
      vendors: ["Portnox", "Splunk", "IBM QRadar"],
      documentation: [
        { title: "HIPAA Compliance Guide", url: "#", type: "compliance" },
        { title: "Audit Configuration", url: "#", type: "setup" }
      ],
      tags: ["hipaa", "compliance", "audit", "reporting"],
      createdBy: "compliance@company.com",
      createdDate: "2024-01-08",
      lastUpdated: "2024-01-20"
    }
  ];

  const useCases: UseCase[] = [
    {
      id: "uc-001",
      name: "Zero Trust Network Access",
      category: "Authentication",
      description: "Implement comprehensive zero-trust network access control with continuous verification",
      businessValue: "Reduces security risks by 70% and ensures compliance with security frameworks",
      technicalRequirements: [
        "Multi-factor authentication",
        "Device compliance checking",
        "Continuous monitoring",
        "Policy engine integration",
        "Risk-based access decisions"
      ],
      prerequisites: [
        "Identity provider integration",
        "Device management solution",
        "Network infrastructure readiness",
        "Security policy framework"
      ],
      testScenarios: [
        "User authentication with MFA",
        "Device compliance verification",
        "Policy enforcement testing",
        "Risk-based access scenarios"
      ],
      supportedVendors: ["Portnox", "Cisco ISE", "Microsoft", "Okta"],
      complexity: "high",
      estimatedEffort: "12-16 weeks",
      dependencies: ["Active Directory", "MFA System", "Device Management"]
    },
    {
      id: "uc-002",
      name: "IoT Device Onboarding",
      category: "IoT Security",
      description: "Automated secure onboarding and management of IoT devices",
      businessValue: "Streamlines IoT deployment while maintaining security standards",
      technicalRequirements: [
        "Device discovery and profiling",
        "Automated certificate provisioning",
        "Network segmentation",
        "Policy assignment",
        "Monitoring and alerting"
      ],
      prerequisites: [
        "PKI infrastructure",
        "Network segmentation capability",
        "Device inventory system",
        "Monitoring tools"
      ],
      testScenarios: [
        "Automated device discovery",
        "Certificate provisioning",
        "Policy enforcement",
        "Network isolation testing"
      ],
      supportedVendors: ["Portnox", "Aruba ClearPass", "Cisco ISE"],
      complexity: "medium",
      estimatedEffort: "8-10 weeks",
      dependencies: ["PKI", "Network Segmentation", "Device Profiling"]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "under-review": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "draft": return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      case "deprecated": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateRequirement = async (data: any) => {
    try {
      await createRequirement.mutateAsync(data);
      setIsAddRequirementOpen(false);
    } catch (error) {
      console.error('Failed to create requirement:', error);
    }
  };

  const handleCreateUseCase = async (data: any) => {
    try {
      await createUseCase.mutateAsync(data);
      setIsAddUseCaseOpen(false);
    } catch (error) {
      console.error('Failed to create use case:', error);
    }
  };

  // Combine database data with mock data for display
  const allRequirements = [...(dbRequirements || []), ...requirements];
  const allUseCases = [...(dbUseCases || []), ...useCases];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements, use cases, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddRequirementOpen} onOpenChange={setIsAddRequirementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
                <DialogDescription>
                  Create a new technical, compliance, or business requirement for your projects.
                </DialogDescription>
              </DialogHeader>
              <RequirementForm onSubmit={handleCreateRequirement} onCancel={() => setIsAddRequirementOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddUseCaseOpen} onOpenChange={setIsAddUseCaseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Use Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Use Case</DialogTitle>
                <DialogDescription>
                  Create a new use case with implementation details and business value.
                </DialogDescription>
              </DialogHeader>
              <UseCaseForm onSubmit={handleCreateUseCase} onCancel={() => setIsAddUseCaseOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requirements.map((req) => (
              <Card key={req.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{req.title}</CardTitle>
                    {getStatusIcon(req.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {req.category}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(req.priority)}`}>
                      {req.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {req.description}
                  </p>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prerequisites</p>
                    <p className="text-xs text-muted-foreground">
                      {req.prerequisites.length} items
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Related Vendors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {req.vendors.slice(0, 2).map((vendor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {vendor}
                        </Badge>
                      ))}
                      {req.vendors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{req.vendors.length - 2}
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
                        onClick={() => setSelectedItem(req)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {req.title}
                          {getStatusIcon(req.status)}
                        </DialogTitle>
                        <DialogDescription>
                          Detailed requirement information including acceptance criteria, test cases, and compliance details.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Category</h4>
                            <Badge>{req.category}</Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Priority</h4>
                            <Badge className={getPriorityColor(req.priority)}>
                              {req.priority}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Status</h4>
                            <Badge variant="outline">{req.status}</Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="space-y-1">
                            {req.prerequisites.map((prereq, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Acceptance Criteria</h4>
                          <ul className="space-y-1">
                            {req.acceptanceCriteria.map((criteria, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Test Cases</h4>
                          <ul className="space-y-1">
                            {req.testCases.map((testCase, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {testCase}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Related Use Cases</h4>
                          <div className="flex flex-wrap gap-2">
                            {req.relatedUseCases.map((useCase, index) => (
                              <Badge key={index} variant="secondary">
                                {useCase}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Supported Vendors</h4>
                          <div className="flex flex-wrap gap-2">
                            {req.vendors.map((vendor, index) => (
                              <Badge key={index} variant="outline">
                                {vendor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {req.documentation.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Documentation</h4>
                            <div className="space-y-2">
                              {req.documentation.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="font-medium">{doc.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {doc.type}
                                    </Badge>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <LinkIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Created by {req.createdBy} on {req.createdDate} • Last updated: {req.lastUpdated}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usecases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase) => (
              <Card key={useCase.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{useCase.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {useCase.category}
                    </Badge>
                    <Badge className={`text-xs ${getComplexityColor(useCase.complexity)}`}>
                      {useCase.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {useCase.description}
                  </p>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Value</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {useCase.businessValue}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estimated Effort</p>
                    <p className="text-xs">{useCase.estimatedEffort}</p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedItem(useCase)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{useCase.name}</DialogTitle>
                        <DialogDescription>
                          Comprehensive use case details including technical requirements, test scenarios, and vendor support information.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Category</h4>
                            <Badge>{useCase.category}</Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Complexity</h4>
                            <Badge className={getComplexityColor(useCase.complexity)}>
                              {useCase.complexity}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Estimated Effort</h4>
                            <p className="text-sm">{useCase.estimatedEffort}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{useCase.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Business Value</h4>
                          <p className="text-sm text-muted-foreground">{useCase.businessValue}</p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Technical Requirements</h4>
                          <ul className="space-y-1">
                            {useCase.technicalRequirements.map((req, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="space-y-1">
                            {useCase.prerequisites.map((prereq, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Test Scenarios</h4>
                          <ul className="space-y-1">
                            {useCase.testScenarios.map((scenario, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {scenario}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Supported Vendors</h4>
                          <div className="flex flex-wrap gap-2">
                            {useCase.supportedVendors.map((vendor, index) => (
                              <Badge key={index} variant="outline">
                                {vendor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {useCase.dependencies.map((dep, index) => (
                              <Badge key={index} variant="secondary">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
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

export default RequirementsManagement;