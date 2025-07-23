import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, FileText, Settings, Users, HeadphonesIcon, Shield } from "lucide-react";

const PostSalesHandoff = () => {
  const [handoffProjects] = useState([
    {
      id: "handoff-001",
      projectName: "Enterprise HQ Deployment",
      client: "Acme Corporation",
      status: "In Progress",
      handoffDate: "2024-03-30",
      completionRate: 75,
      salesEngineer: "John Smith",
      customerSuccessManager: "Sarah Johnson",
      technicalContact: "Mike Davis",
      customerPrimaryContact: "Lisa Chen",
      handoffPhases: {
        documentation: { completed: true, progress: 100 },
        training: { completed: false, progress: 60 },
        knowledge_transfer: { completed: false, progress: 40 },
        support_transition: { completed: false, progress: 20 },
        relationship_handoff: { completed: false, progress: 0 }
      }
    }
  ]);

  const handoffChecklist = {
    documentation: [
      { item: "As-built network documentation", completed: true, critical: true },
      { item: "Portnox configuration backup", completed: true, critical: true },
      { item: "Policy configuration documentation", completed: true, critical: true },
      { item: "Integration setup documentation", completed: false, critical: true },
      { item: "Troubleshooting guide", completed: false, critical: false },
      { item: "Best practices document", completed: true, critical: false }
    ],
    training: [
      { item: "Administrative training completed", completed: true, critical: true },
      { item: "End user training delivered", completed: false, critical: true },
      { item: "Help desk training completed", completed: false, critical: true },
      { item: "Training materials provided", completed: true, critical: false },
      { item: "Knowledge base access granted", completed: false, critical: false }
    ],
    knowledge_transfer: [
      { item: "Technical architecture review", completed: true, critical: true },
      { item: "Operational procedures documented", completed: false, critical: true },
      { item: "Escalation procedures defined", completed: false, critical: true },
      { item: "Monitoring and alerting setup", completed: true, critical: false },
      { item: "Performance baselines established", completed: false, critical: false }
    ],
    support_transition: [
      { item: "Support team introductions", completed: false, critical: true },
      { item: "Support ticketing system access", completed: false, critical: true },
      { item: "SLA agreements reviewed", completed: false, critical: true },
      { item: "Emergency contact procedures", completed: false, critical: false },
      { item: "Remote access credentials", completed: false, critical: false }
    ],
    relationship_handoff: [
      { item: "Customer success manager introduction", completed: false, critical: true },
      { item: "Quarterly business review scheduled", completed: false, critical: false },
      { item: "Expansion opportunity mapping", completed: false, critical: false },
      { item: "Reference opportunity discussion", completed: false, critical: false },
      { item: "Customer satisfaction survey", completed: false, critical: false }
    ]
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "documentation": return <FileText className="h-5 w-5" />;
      case "training": return <Users className="h-5 w-5" />;
      case "knowledge_transfer": return <Settings className="h-5 w-5" />;
      case "support_transition": return <HeadphonesIcon className="h-5 w-5" />;
      case "relationship_handoff": return <UserCheck className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case "documentation": return "Documentation Handoff";
      case "training": return "Training & Enablement";
      case "knowledge_transfer": return "Knowledge Transfer";
      case "support_transition": return "Support Transition";
      case "relationship_handoff": return "Relationship Handoff";
      default: return "Unknown Phase";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Post-Sales Handoff Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Seamless transition from implementation to ongoing support and success
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Handoff Template</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Complete Handoff
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Handoff Overview</TabsTrigger>
          <TabsTrigger value="checklist">Handoff Checklist</TabsTrigger>
          <TabsTrigger value="team-transition">Team Transition</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="success-planning">Success Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {handoffProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.projectName}</CardTitle>
                    <p className="text-muted-foreground mt-1">{project.client}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {project.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Handoff: {project.handoffDate}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Handoff Completion</span>
                      <span>{project.completionRate}%</span>
                    </div>
                    <Progress value={project.completionRate} className="h-2" />
                  </div>

                  {/* Team Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-glow border-primary/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-primary">Implementation Team</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sales Engineer:</span>
                          <span className="text-sm font-medium">{project.salesEngineer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Technical Contact:</span>
                          <span className="text-sm font-medium">{project.technicalContact}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-glow border-primary/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-primary">Ongoing Support Team</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Customer Success:</span>
                          <span className="text-sm font-medium">{project.customerSuccessManager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Customer Contact:</span>
                          <span className="text-sm font-medium">{project.customerPrimaryContact}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Handoff Phases Progress */}
                  <div className="grid gap-4">
                    {Object.entries(project.handoffPhases).map(([phase, data]) => (
                      <div key={phase} className="flex items-center space-x-4 p-4 rounded-lg bg-background/50">
                        <div className={`p-2 rounded-lg ${data.completed ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}>
                          {getPhaseIcon(phase)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{getPhaseTitle(phase)}</span>
                            <span className="text-sm text-muted-foreground">{data.progress}%</span>
                          </div>
                          <Progress value={data.progress} className="h-1" />
                        </div>
                        {data.completed && (
                          <Badge variant="outline" className="border-green-500/30 text-green-500">
                            Complete
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          {Object.entries(handoffChecklist).map(([phase, items]) => (
            <Card key={phase}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    {getPhaseIcon(phase)}
                  </div>
                  <CardTitle className="text-lg text-primary">
                    {getPhaseTitle(phase)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`${phase}-${index}`}
                        checked={item.completed}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <label 
                            htmlFor={`${phase}-${index}`}
                            className={`text-sm cursor-pointer ${
                              item.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {item.item}
                          </label>
                          {item.critical && (
                            <Badge variant="destructive" className="text-xs">
                              Critical
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Responsible Person
                            </label>
                            <Select>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Assign responsibility" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sales">Sales Engineer</SelectItem>
                                <SelectItem value="technical">Technical Team</SelectItem>
                                <SelectItem value="support">Support Team</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Target Date
                            </label>
                            <input 
                              type="date" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="team-transition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Implementation Team</CardTitle>
                <p className="text-muted-foreground">Current project team members</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "John Smith", role: "Sales Engineer", email: "john.smith@company.com", expertise: "Technical Sales" },
                  { name: "Mike Davis", role: "Implementation Engineer", email: "mike.davis@company.com", expertise: "Network Architecture" },
                  { name: "Lisa Wilson", role: "Project Manager", email: "lisa.wilson@company.com", expertise: "Project Coordination" }
                ].map((member, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge variant="outline">{member.expertise}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Ongoing Support Team</CardTitle>
                <p className="text-muted-foreground">Post-implementation support team</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Sarah Johnson", role: "Customer Success Manager", email: "sarah.johnson@company.com", expertise: "Customer Success" },
                  { name: "Tom Anderson", role: "Technical Support Lead", email: "tom.anderson@company.com", expertise: "Technical Support" },
                  { name: "Amy Chen", role: "Account Manager", email: "amy.chen@company.com", expertise: "Account Management" }
                ].map((member, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge variant="outline">{member.expertise}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Transfer Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Session Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Handoff</SelectItem>
                      <SelectItem value="customer">Customer Introduction</SelectItem>
                      <SelectItem value="operational">Operational Procedures</SelectItem>
                      <SelectItem value="strategic">Strategic Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <input 
                    type="datetime-local" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Session duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="2hours">2 hours</SelectItem>
                      <SelectItem value="halfday">Half day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Session Agenda</label>
                <Textarea 
                  placeholder="Define the agenda and objectives for this knowledge transfer session..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Package</CardTitle>
              <p className="text-muted-foreground">
                Comprehensive documentation for customer handoff
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {[
                  {
                    category: "Technical Documentation",
                    documents: [
                      "Network Architecture Diagram",
                      "Portnox Configuration Export",
                      "Policy Configuration Guide", 
                      "Integration Setup Documentation",
                      "Firewall Rules and Network Changes"
                    ]
                  },
                  {
                    category: "Operational Documentation",
                    documents: [
                      "Daily Operations Guide",
                      "Troubleshooting Procedures",
                      "User Management Procedures",
                      "Policy Modification Guide",
                      "Monitoring and Alerting Setup"
                    ]
                  },
                  {
                    category: "Training Materials",
                    documents: [
                      "Administrator Training Guide",
                      "End User Quick Start Guide",
                      "Help Desk Reference",
                      "Training Videos and Recordings",
                      "Knowledge Base Articles"
                    ]
                  },
                  {
                    category: "Support Resources",
                    documents: [
                      "Support Contact Information",
                      "Escalation Procedures",
                      "SLA and Service Agreements",
                      "Remote Access Instructions",
                      "Emergency Contact Procedures"
                    ]
                  }
                ].map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{section.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {section.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
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

        <TabsContent value="success-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Success Planning</CardTitle>
              <p className="text-muted-foreground">
                Long-term success strategy and relationship management
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Success Metrics</label>
                    <Textarea 
                      placeholder="Define key success metrics and KPIs..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">90-Day Goals</label>
                    <Textarea 
                      placeholder="Define goals for the first 90 days..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Growth Opportunities</label>
                    <Textarea 
                      placeholder="Identify potential expansion opportunities..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Risk Factors</label>
                    <Textarea 
                      placeholder="Document potential risks and mitigation strategies..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">30 Days</div>
                    <div className="text-sm text-muted-foreground">First Check-in</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">90 Days</div>
                    <div className="text-sm text-muted-foreground">Quarterly Review</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-glow border-primary/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">Annual</div>
                    <div className="text-sm text-muted-foreground">Business Review</div>
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

export default PostSalesHandoff;