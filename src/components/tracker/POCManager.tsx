import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const POCManager = () => {
  const [pocProjects] = useState([
    {
      id: "poc-001",
      name: "Healthcare Network POC",
      client: "Regional Medical Center",
      status: "In Progress",
      stage: "Implementation",
      startDate: "2024-01-15",
      endDate: "2024-02-28",
      progress: 65,
      objectives: [
        "Validate device authentication for medical devices",
        "Test network segmentation for patient data",
        "Verify compliance with HIPAA requirements",
        "Demonstrate ROI through security improvements"
      ],
      successCriteria: [
        "100% device visibility achieved",
        "Zero unauthorized network access",
        "Policy enforcement < 30 seconds",
        "90% reduction in manual processes"
      ],
      scope: {
        endpoints: 150,
        deviceTypes: ["Workstations", "Medical Devices", "IoT Sensors", "Mobile Devices"],
        locations: 2,
        duration: "6 weeks"
      }
    },
    {
      id: "poc-002", 
      name: "Manufacturing Security POC",
      client: "Industrial Systems Corp",
      status: "Planning",
      stage: "Design",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      progress: 25,
      objectives: [
        "Secure OT network access",
        "Implement industrial device authentication",
        "Test air-gapped network integration",
        "Validate production network segmentation"
      ],
      successCriteria: [
        "OT/IT network isolation maintained",
        "Zero production downtime",
        "All industrial devices authenticated",
        "Compliance with ICS security standards"
      ],
      scope: {
        endpoints: 300,
        deviceTypes: ["HMI Systems", "PLCs", "Industrial PCs", "Workstations"],
        locations: 3,
        duration: "8 weeks"
      }
    }
  ]);

  const pocStages = [
    {
      name: "Planning & Design",
      duration: "1-2 weeks",
      activities: [
        "Requirements gathering",
        "Architecture design",
        "Success criteria definition",
        "Timeline establishment"
      ],
      deliverables: [
        "POC Plan Document",
        "Technical Architecture",
        "Success Criteria Matrix",
        "Project Timeline"
      ]
    },
    {
      name: "Environment Setup",
      duration: "1 week", 
      activities: [
        "Lab environment preparation",
        "Portnox installation",
        "Initial configuration",
        "Baseline testing"
      ],
      deliverables: [
        "Configured Portnox System",
        "Test Environment Documentation",
        "Baseline Performance Metrics",
        "Configuration Backup"
      ]
    },
    {
      name: "Implementation",
      duration: "2-3 weeks",
      activities: [
        "Use case implementation",
        "Policy configuration",
        "Integration setup",
        "Iterative testing"
      ],
      deliverables: [
        "Implemented Use Cases",
        "Configured Policies",
        "Integration Documentation",
        "Test Results"
      ]
    },
    {
      name: "Validation & Demo",
      duration: "1 week",
      activities: [
        "Comprehensive testing",
        "Performance validation",
        "Demo preparation",
        "Results documentation"
      ],
      deliverables: [
        "Validation Report",
        "Demo Presentation",
        "Performance Analysis",
        "ROI Calculation"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "Planning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "Completed": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "On Hold": return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            POC Management Center
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage Proof of Concept projects for Portnox deployments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">POC Template</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            New POC Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">POC Overview</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {pocProjects.map((poc) => (
              <Card key={poc.id} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{poc.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{poc.client}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(poc.status)}>
                        {poc.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{poc.stage}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Project Progress</span>
                        <span>{poc.progress}%</span>
                      </div>
                      <Progress value={poc.progress} className="h-2" />
                    </div>

                    {/* POC Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{poc.scope.endpoints}</div>
                        <div className="text-sm text-muted-foreground">Endpoints</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{poc.scope.locations}</div>
                        <div className="text-sm text-muted-foreground">Locations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{poc.scope.duration}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{poc.scope.deviceTypes.length}</div>
                        <div className="text-sm text-muted-foreground">Device Types</div>
                      </div>
                    </div>

                    {/* Objectives and Criteria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-primary mb-3">POC Objectives</h4>
                        <ul className="space-y-2">
                          {poc.objectives.map((objective, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-3">Success Criteria</h4>
                        <ul className="space-y-2">
                          {poc.successCriteria.map((criteria, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit POC
                      </Button>
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>POC Planning Wizard</CardTitle>
              <p className="text-muted-foreground">
                Define your Proof of Concept project parameters
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">POC Name</label>
                    <Input placeholder="Enter POC project name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Client/Organization</label>
                    <Input placeholder="Client organization name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">POC Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select POC type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Validation</SelectItem>
                        <SelectItem value="business">Business Value</SelectItem>
                        <SelectItem value="compliance">Compliance Verification</SelectItem>
                        <SelectItem value="integration">Integration Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2weeks">2 weeks</SelectItem>
                        <SelectItem value="4weeks">4 weeks</SelectItem>
                        <SelectItem value="6weeks">6 weeks</SelectItem>
                        <SelectItem value="8weeks">8 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Number of Endpoints</label>
                    <Input placeholder="e.g., 100" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Number of Locations</label>
                    <Input placeholder="e.g., 2" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Primary Use Case</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary use case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="device-auth">Device Authentication</SelectItem>
                        <SelectItem value="byod">BYOD Management</SelectItem>
                        <SelectItem value="guest">Guest Access</SelectItem>
                        <SelectItem value="iot">IoT Security</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Industry Vertical</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">POC Objectives</label>
                  <Textarea 
                    placeholder="Define the key objectives for this POC..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Success Criteria</label>
                  <Textarea 
                    placeholder="Define measurable success criteria..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-6">
          <div className="grid gap-6">
            {pocStages.map((stage, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-primary">{stage.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">Duration: {stage.duration}</p>
                    </div>
                    <Badge variant="outline">
                      Stage {index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Key Activities</h4>
                      <ul className="space-y-2">
                        {stage.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Deliverables</h4>
                      <ul className="space-y-2">
                        {stage.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>POC Validation Framework</CardTitle>
              <p className="text-muted-foreground">
                Comprehensive validation and measurement criteria
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {[
                  {
                    category: "Technical Validation",
                    metrics: [
                      "Authentication success rate > 99%",
                      "Policy enforcement time < 30 seconds", 
                      "System uptime > 99.9%",
                      "Integration compatibility confirmed"
                    ]
                  },
                  {
                    category: "Business Value",
                    metrics: [
                      "Reduction in security incidents",
                      "Improved operational efficiency",
                      "Cost savings quantified",
                      "ROI calculation completed"
                    ]
                  },
                  {
                    category: "User Experience",
                    metrics: [
                      "User satisfaction > 4.5/5",
                      "Reduced help desk tickets",
                      "Simplified access process",
                      "Training requirements minimal"
                    ]
                  },
                  {
                    category: "Compliance & Security",
                    metrics: [
                      "Compliance requirements met",
                      "Security posture improved",
                      "Audit trail completeness",
                      "Risk reduction achieved"
                    ]
                  }
                ].map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{section.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded border-2 border-primary"></div>
                            <span className="text-sm">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Healthcare POC",
                description: "HIPAA compliance and medical device authentication",
                duration: "4-6 weeks",
                use_cases: ["Medical Device Auth", "Patient Data Segmentation", "Compliance Monitoring"]
              },
              {
                name: "Financial Services POC", 
                description: "PCI-DSS compliance and secure access control",
                duration: "6-8 weeks",
                use_cases: ["PCI Compliance", "Privilege Access", "Audit Reporting"]
              },
              {
                name: "Manufacturing POC",
                description: "OT/IT convergence and industrial device security",
                duration: "4-6 weeks", 
                use_cases: ["OT Security", "Industrial Devices", "Air-gap Integration"]
              },
              {
                name: "Education POC",
                description: "BYOD management and campus network security",
                duration: "3-4 weeks",
                use_cases: ["Student BYOD", "Faculty Access", "Guest Management"]
              },
              {
                name: "Retail POC",
                description: "POS security and customer network isolation",
                duration: "3-5 weeks",
                use_cases: ["POS Security", "Guest WiFi", "IoT Devices"]
              },
              {
                name: "Custom POC",
                description: "Build your own POC from scratch",
                duration: "Variable",
                use_cases: ["Custom Requirements", "Flexible Scope", "Tailored Approach"]
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="font-medium">Duration:</span> {template.duration}
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Use Cases:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.use_cases.map((useCase, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default POCManager;