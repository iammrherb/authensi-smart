import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";

const TimelineManager = () => {
  const [selectedProject] = useState("enterprise-hq");
  
  const projects = {
    "enterprise-hq": {
      name: "Enterprise HQ Deployment",
      client: "Acme Corporation", 
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      status: "In Progress",
      progress: 65,
      phases: [
        {
          id: "discovery",
          name: "Discovery & Assessment",
          startDate: "2024-01-15",
          endDate: "2024-01-26",
          duration: 10,
          status: "completed",
          progress: 100,
          milestones: [
            { name: "Network Assessment Complete", date: "2024-01-18", status: "completed" },
            { name: "Requirements Gathering", date: "2024-01-22", status: "completed" },
            { name: "Stakeholder Alignment", date: "2024-01-25", status: "completed" }
          ],
          tasks: [
            { name: "Network topology mapping", assignee: "John Smith", status: "completed" },
            { name: "Device inventory", assignee: "Sarah Johnson", status: "completed" },
            { name: "Security assessment", assignee: "Mike Davis", status: "completed" },
            { name: "Business requirements", assignee: "Lisa Chen", status: "completed" }
          ]
        },
        {
          id: "design",
          name: "Architecture Design", 
          startDate: "2024-01-29",
          endDate: "2024-02-09",
          duration: 10,
          status: "completed",
          progress: 100,
          milestones: [
            { name: "Architecture Review", date: "2024-02-02", status: "completed" },
            { name: "Policy Design Complete", date: "2024-02-06", status: "completed" },
            { name: "Design Approval", date: "2024-02-09", status: "completed" }
          ],
          tasks: [
            { name: "Network architecture design", assignee: "John Smith", status: "completed" },
            { name: "Policy framework creation", assignee: "Sarah Johnson", status: "completed" },
            { name: "Integration planning", assignee: "Mike Davis", status: "completed" },
            { name: "Security zone design", assignee: "Lisa Chen", status: "completed" }
          ]
        },
        {
          id: "implementation",
          name: "Implementation",
          startDate: "2024-02-12",
          endDate: "2024-03-08",
          duration: 25,
          status: "in-progress",
          progress: 68,
          milestones: [
            { name: "Infrastructure Setup", date: "2024-02-16", status: "completed" },
            { name: "Basic Configuration", date: "2024-02-23", status: "completed" },
            { name: "Integration Complete", date: "2024-03-01", status: "in-progress" },
            { name: "Testing Readiness", date: "2024-03-08", status: "pending" }
          ],
          tasks: [
            { name: "Portnox appliance installation", assignee: "John Smith", status: "completed" },
            { name: "Network device configuration", assignee: "Mike Davis", status: "completed" },
            { name: "AD integration setup", assignee: "Sarah Johnson", status: "in-progress" },
            { name: "Policy implementation", assignee: "Lisa Chen", status: "in-progress" }
          ]
        },
        {
          id: "testing",
          name: "Testing & Validation",
          startDate: "2024-03-11",
          endDate: "2024-03-22",
          duration: 10,
          status: "pending",
          progress: 0,
          milestones: [
            { name: "Lab Testing Complete", date: "2024-03-15", status: "pending" },
            { name: "User Acceptance Testing", date: "2024-03-19", status: "pending" },
            { name: "Performance Validation", date: "2024-03-22", status: "pending" }
          ],
          tasks: [
            { name: "Functional testing", assignee: "John Smith", status: "pending" },
            { name: "Integration testing", assignee: "Sarah Johnson", status: "pending" },
            { name: "Performance testing", assignee: "Mike Davis", status: "pending" },
            { name: "Security validation", assignee: "Lisa Chen", status: "pending" }
          ]
        },
        {
          id: "golive",
          name: "Go-Live & Handover",
          startDate: "2024-03-25",
          endDate: "2024-03-30",
          duration: 5,
          status: "pending",
          progress: 0,
          milestones: [
            { name: "Production Deployment", date: "2024-03-26", status: "pending" },
            { name: "User Training Complete", date: "2024-03-28", status: "pending" },
            { name: "Project Handover", date: "2024-03-30", status: "pending" }
          ],
          tasks: [
            { name: "Production rollout", assignee: "John Smith", status: "pending" },
            { name: "User training delivery", assignee: "Sarah Johnson", status: "pending" },
            { name: "Documentation handover", assignee: "Mike Davis", status: "pending" },
            { name: "Support transition", assignee: "Lisa Chen", status: "pending" }
          ]
        }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "pending": return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      case "at-risk": return "bg-red-500/10 text-red-500 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const currentProject = projects[selectedProject];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Timeline & Milestone Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Track project timelines, milestones, and critical path management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Timeline</Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Update Schedule
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="gantt">Gantt View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {/* Project Overview Card */}
          <Card className="bg-gradient-glow border-primary/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{currentProject.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{currentProject.client}</p>
                </div>
                <Badge className={getStatusColor(currentProject.status)}>
                  {currentProject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div className="font-medium">{currentProject.startDate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">End Date</div>
                    <div className="font-medium">{currentProject.endDate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="font-medium">{currentProject.progress}%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Team Size</div>
                    <div className="font-medium">4 Members</div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={currentProject.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Timeline Phases */}
          <div className="space-y-6">
            {currentProject.phases.map((phase, index) => (
              <Card key={phase.id} className={`relative hover:shadow-glow transition-all duration-300 ${
                phase.status === "in-progress" ? "border-primary bg-gradient-glow" : ""
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        phase.status === "completed" ? "bg-green-500" :
                        phase.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{phase.name}</CardTitle>
                        <p className="text-muted-foreground">
                          {phase.startDate} - {phase.endDate} ({phase.duration} days)
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {phase.progress}% Complete
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={phase.progress} className="h-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Milestones */}
                      <div>
                        <h4 className="font-semibold text-primary mb-3">Key Milestones</h4>
                        <div className="space-y-2">
                          {phase.milestones.map((milestone, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                milestone.status === "completed" ? "bg-green-500" :
                                milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                              }`}></div>
                              <span className="text-sm flex-1">{milestone.name}</span>
                              <span className="text-xs text-muted-foreground">{milestone.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tasks */}
                      <div>
                        <h4 className="font-semibold text-primary mb-3">Active Tasks</h4>
                        <div className="space-y-2">
                          {phase.tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                task.status === "completed" ? "bg-green-500" :
                                task.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                              }`}></div>
                              <span className="text-sm flex-1">{task.name}</span>
                              <span className="text-xs text-muted-foreground">{task.assignee}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="grid gap-6">
            {currentProject.phases.map((phase) => (
              <Card key={phase.id}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{phase.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phase.milestones.map((milestone, index) => (
                      <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${
                        milestone.status === "completed" ? "bg-green-500/10 border-green-500/30" :
                        milestone.status === "in-progress" ? "bg-blue-500/10 border-blue-500/30" :
                        "bg-gray-500/10 border-gray-500/30"
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              milestone.status === "completed" ? "bg-green-500" :
                              milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                            }`}></div>
                            <div>
                              <div className="font-medium">{milestone.name}</div>
                              <div className="text-sm text-muted-foreground">{milestone.date}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gantt Chart View</CardTitle>
              <p className="text-muted-foreground">
                Visual timeline representation of project phases and dependencies
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Gantt Chart Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground border-b pb-2">
                  <div className="col-span-3">Phase</div>
                  <div className="col-span-9 grid grid-cols-9 gap-1">
                    {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9"].map((week) => (
                      <div key={week} className="text-center">{week}</div>
                    ))}
                  </div>
                </div>

                {/* Gantt Chart Rows */}
                {currentProject.phases.map((phase, index) => (
                  <div key={phase.id} className="grid grid-cols-12 gap-2 items-center py-2">
                    <div className="col-span-3">
                      <div className="text-sm font-medium">{phase.name}</div>
                      <div className="text-xs text-muted-foreground">{phase.duration} days</div>
                    </div>
                    <div className="col-span-9 grid grid-cols-9 gap-1">
                      {Array.from({ length: 9 }, (_, weekIndex) => {
                        const isActive = weekIndex >= index && weekIndex < index + Math.ceil(phase.duration / 7);
                        return (
                          <div 
                            key={weekIndex}
                            className={`h-6 rounded ${
                              isActive 
                                ? phase.status === "completed" 
                                  ? "bg-green-500" 
                                  : phase.status === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-gray-400"
                                : "bg-gray-100"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <p className="text-muted-foreground">
                Monthly view of project milestones and deadlines
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive calendar view with milestone tracking coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimelineManager;