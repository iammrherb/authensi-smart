import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const ScopingWorkflow = () => {
  const [selectedScope, setSelectedScope] = useState("enterprise");

  const useCases = [
    {
      category: "Network Access Control",
      cases: [
        "Device Authentication & Authorization",
        "BYOD Policy Enforcement", 
        "Guest Network Management",
        "IoT Device Onboarding",
        "Zero Trust Network Access",
        "Compliance Monitoring (PCI-DSS, HIPAA, SOX)"
      ]
    },
    {
      category: "Identity Management",
      cases: [
        "Active Directory Integration",
        "LDAP/SAML Authentication",
        "Multi-Factor Authentication",
        "Certificate-based Authentication",
        "Mobile Device Management Integration",
        "Privileged Access Management"
      ]
    },
    {
      category: "Security & Compliance",
      cases: [
        "Vulnerability Assessment",
        "Endpoint Protection Integration",
        "SIEM Integration & Logging",
        "Audit Trail & Reporting",
        "Risk-based Access Control",
        "Automated Remediation"
      ]
    },
    {
      category: "Operational Management",
      cases: [
        "Network Visibility & Monitoring",
        "Automated Incident Response",
        "User Self-Service Portal",
        "Help Desk Integration",
        "Performance Monitoring",
        "Capacity Planning"
      ]
    }
  ];

  const deploymentTypes = [
    {
      type: "SMB (Small-Medium Business)",
      description: "1-500 endpoints, single location",
      features: ["Basic NAC", "Cloud Management", "Standard Policies"],
      timeline: "2-4 weeks",
      complexity: "Low"
    },
    {
      type: "Mid-Market Enterprise",
      description: "500-5000 endpoints, multiple locations",
      features: ["Advanced NAC", "Integration Hub", "Custom Policies", "Multi-site"],
      timeline: "6-12 weeks",
      complexity: "Medium"
    },
    {
      type: "Large Enterprise",
      description: "5000+ endpoints, global deployment",
      features: ["Enterprise NAC", "Full Integration", "Advanced Analytics", "Global Scale"],
      timeline: "12-24 weeks",
      complexity: "High"
    }
  ];

  const scopingQuestions = {
    infrastructure: [
      "How many total endpoints need NAC coverage?",
      "What types of devices are in your environment?",
      "What network infrastructure vendors are you using?",
      "Do you have existing network segmentation?",
      "What authentication systems are currently in place?"
    ],
    security: [
      "What compliance requirements must be met?",
      "What are your current security policies?",
      "Do you have existing security tools to integrate?",
      "What are your incident response procedures?",
      "What visibility requirements do you have?"
    ],
    business: [
      "What is driving the NAC implementation?",
      "What are your success criteria?",
      "What is your timeline for deployment?",
      "What resources do you have available?",
      "What is your change management process?"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Project Scoping & Use Cases
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive scoping workflow for Portnox deployments
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          Export Scoping Report
        </Button>
      </div>

      <Tabs defaultValue="deployment-type" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deployment-type">Deployment Type</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="questionnaire">Discovery</TabsTrigger>
          <TabsTrigger value="sizing">Sizing & Scope</TabsTrigger>
        </TabsList>

        <TabsContent value="deployment-type" className="space-y-6">
          <div className="grid gap-6">
            {deploymentTypes.map((deployment, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-glow ${
                  selectedScope === deployment.type.toLowerCase().replace(/\s+/g, '-') 
                    ? "border-primary bg-gradient-glow" 
                    : "hover:border-primary/30"
                }`}
                onClick={() => setSelectedScope(deployment.type.toLowerCase().replace(/\s+/g, '-'))}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{deployment.type}</CardTitle>
                      <p className="text-muted-foreground mt-1">{deployment.description}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="outline">{deployment.complexity} Complexity</Badge>
                      <div className="text-sm text-muted-foreground">{deployment.timeline}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {deployment.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-6">
          <div className="grid gap-6">
            {useCases.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.cases.map((useCase, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Checkbox id={`use-case-${index}-${idx}`} />
                        <label 
                          htmlFor={`use-case-${index}-${idx}`}
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {useCase}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements Gathering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Total Endpoints</label>
                    <Input placeholder="e.g., 1500" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Number of Sites</label>
                    <Input placeholder="e.g., 5" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Network Infrastructure</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="aruba">Aruba/HPE</SelectItem>
                        <SelectItem value="juniper">Juniper</SelectItem>
                        <SelectItem value="extreme">Extreme Networks</SelectItem>
                        <SelectItem value="mixed">Mixed Environment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Authentication Method</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Primary authentication" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ad">Active Directory</SelectItem>
                        <SelectItem value="ldap">LDAP</SelectItem>
                        <SelectItem value="saml">SAML/SSO</SelectItem>
                        <SelectItem value="certificate">Certificate-based</SelectItem>
                        <SelectItem value="multi">Multi-method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Compliance Requirements</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select compliance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pci">PCI-DSS</SelectItem>
                        <SelectItem value="hipaa">HIPAA</SelectItem>
                        <SelectItem value="sox">SOX</SelectItem>
                        <SelectItem value="iso">ISO 27001</SelectItem>
                        <SelectItem value="multiple">Multiple Standards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deployment Timeline</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Target timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rush">< 4 weeks (Rush)</SelectItem>
                        <SelectItem value="standard">4-12 weeks (Standard)</SelectItem>
                        <SelectItem value="extended">12+ weeks (Phased)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaire" className="space-y-6">
          {Object.entries(scopingQuestions).map(([category, questions]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg capitalize text-primary">
                  {category} Discovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium">{question}</label>
                    <Textarea 
                      placeholder="Enter detailed response..."
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sizing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Sizing Calculator</CardTitle>
              <p className="text-muted-foreground">
                Automatic sizing based on your requirements
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2,500</div>
                    <div className="text-sm text-muted-foreground">Estimated Endpoints</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">8</div>
                    <div className="text-sm text-muted-foreground">Required Appliances</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">12 weeks</div>
                    <div className="text-sm text-muted-foreground">Estimated Timeline</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScopingWorkflow;