import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChecklistManager = () => {
  const [checklists] = useState({
    "pre-deployment": {
      name: "Pre-Deployment Checklist",
      total: 25,
      completed: 18,
      items: [
        {
          category: "Infrastructure Preparation",
          tasks: [
            { id: "infra-1", task: "Network topology documented", completed: true, critical: true },
            { id: "infra-2", task: "Switch configurations reviewed", completed: true, critical: true },
            { id: "infra-3", task: "RADIUS shared secrets generated", completed: false, critical: true },
            { id: "infra-4", task: "VLAN assignments planned", completed: true, critical: false },
            { id: "infra-5", task: "Network access policies defined", completed: true, critical: true }
          ]
        },
        {
          category: "Identity Integration",
          tasks: [
            { id: "id-1", task: "Active Directory connectivity verified", completed: true, critical: true },
            { id: "id-2", task: "LDAP bind account created", completed: true, critical: true },
            { id: "id-3", task: "Certificate authority configured", completed: false, critical: false },
            { id: "id-4", task: "Group mappings documented", completed: true, critical: true },
            { id: "id-5", task: "Service accounts created", completed: false, critical: true }
          ]
        },
        {
          category: "Security Preparation",
          tasks: [
            { id: "sec-1", task: "Firewall rules configured", completed: true, critical: true },
            { id: "sec-2", task: "Security policies reviewed", completed: true, critical: true },
            { id: "sec-3", task: "Compliance requirements validated", completed: false, critical: true },
            { id: "sec-4", task: "Backup and recovery plan", completed: true, critical: true },
            { id: "sec-5", task: "Incident response procedures", completed: false, critical: false }
          ]
        }
      ]
    },
    "deployment": {
      name: "Deployment Checklist", 
      total: 20,
      completed: 12,
      items: [
        {
          category: "System Installation",
          tasks: [
            { id: "sys-1", task: "Portnox appliances installed", completed: true, critical: true },
            { id: "sys-2", task: "Network connectivity verified", completed: true, critical: true },
            { id: "sys-3", task: "Initial configuration completed", completed: true, critical: true },
            { id: "sys-4", task: "High availability configured", completed: false, critical: false },
            { id: "sys-5", task: "Management interface accessible", completed: true, critical: true }
          ]
        },
        {
          category: "Configuration",
          tasks: [
            { id: "conf-1", task: "Authentication policies configured", completed: true, critical: true },
            { id: "conf-2", task: "Authorization rules implemented", completed: false, critical: true },
            { id: "conf-3", task: "Network device integration", completed: true, critical: true },
            { id: "conf-4", task: "Guest network configuration", completed: false, critical: false },
            { id: "conf-5", task: "Monitoring and alerting setup", completed: false, critical: true }
          ]
        }
      ]
    },
    "testing": {
      name: "Testing & Validation Checklist",
      total: 18,
      completed: 8,
      items: [
        {
          category: "Functional Testing",
          tasks: [
            { id: "test-1", task: "User authentication testing", completed: true, critical: true },
            { id: "test-2", task: "Device authorization testing", completed: true, critical: true },
            { id: "test-3", task: "VLAN assignment validation", completed: false, critical: true },
            { id: "test-4", task: "Guest access testing", completed: false, critical: false },
            { id: "test-5", task: "Policy enforcement validation", completed: true, critical: true }
          ]
        },
        {
          category: "Integration Testing",
          tasks: [
            { id: "int-1", task: "Active Directory integration", completed: true, critical: true },
            { id: "int-2", task: "SIEM integration testing", completed: false, critical: false },
            { id: "int-3", task: "MDM integration validation", completed: false, critical: false },
            { id: "int-4", task: "Help desk workflow testing", completed: false, critical: false }
          ]
        }
      ]
    },
    "go-live": {
      name: "Go-Live Checklist",
      total: 15,
      completed: 3,
      items: [
        {
          category: "Production Readiness",
          tasks: [
            { id: "prod-1", task: "Production environment validated", completed: true, critical: true },
            { id: "prod-2", task: "Backup procedures tested", completed: false, critical: true },
            { id: "prod-3", task: "Monitoring dashboard configured", completed: true, critical: true },
            { id: "prod-4", task: "Support contacts documented", completed: false, critical: true },
            { id: "prod-5", task: "Rollback plan prepared", completed: true, critical: true }
          ]
        },
        {
          category: "User Enablement",
          tasks: [
            { id: "user-1", task: "End user training completed", completed: false, critical: true },
            { id: "user-2", task: "IT staff training completed", completed: false, critical: true },
            { id: "user-3", task: "Documentation delivered", completed: false, critical: true },
            { id: "user-4", task: "Support procedures established", completed: false, critical: true }
          ]
        }
      ]
    }
  });

  const getCompletionRate = (checklist: any) => {
    return (checklist.completed / checklist.total) * 100;
  };

  const getCriticalTasksRemaining = (checklist: any) => {
    let remaining = 0;
    checklist.items.forEach((category: any) => {
      category.tasks.forEach((task: any) => {
        if (task.critical && !task.completed) remaining++;
      });
    });
    return remaining;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Implementation Checklists
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive implementation tracking for Portnox deployments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Checklist</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pre-deployment">Pre-Deployment</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="go-live">Go-Live</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(checklists).map(([key, checklist]) => {
              const completionRate = getCompletionRate(checklist);
              const criticalRemaining = getCriticalTasksRemaining(checklist);
              
              return (
                <Card key={key} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{checklist.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {checklist.completed} of {checklist.total} tasks completed
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        {criticalRemaining > 0 && (
                          <Badge variant="destructive">
                            {criticalRemaining} Critical Remaining
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {Math.round(completionRate)}% Complete
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={completionRate} className="h-2" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{checklist.completed}</div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">{checklist.total - checklist.completed}</div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{criticalRemaining}</div>
                          <div className="text-sm text-muted-foreground">Critical</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {Object.entries(checklists).map(([key, checklist]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <div className="space-y-6">
              {checklist.items.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.tasks.map((task) => (
                        <div key={task.id} className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id={task.id}
                              checked={task.completed}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <label 
                                  htmlFor={task.id}
                                  className={`text-sm cursor-pointer ${
                                    task.completed ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {task.task}
                                </label>
                                {task.critical && (
                                  <Badge variant="destructive" className="text-xs">
                                    Critical
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Assigned To
                                  </label>
                                  <Select>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="engineer1">John Smith</SelectItem>
                                      <SelectItem value="engineer2">Sarah Johnson</SelectItem>
                                      <SelectItem value="engineer3">Mike Davis</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Due Date
                                  </label>
                                  <input 
                                    type="date" 
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Notes / Comments
                                </label>
                                <Textarea 
                                  placeholder="Add notes or comments for this task..."
                                  className="min-h-[60px] text-sm"
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
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChecklistManager;