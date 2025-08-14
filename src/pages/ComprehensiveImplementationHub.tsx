import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, FileText, CheckSquare, TrendingUp, Calendar,
  Target, Users, Settings, Rocket, Shield
} from "lucide-react";
import ComprehensiveImplementationTracker from "@/components/tracker/ComprehensiveImplementationTracker";
import ProfessionalDeploymentReportGenerator from "@/components/tracker/ProfessionalDeploymentReportGenerator";
import ChecklistManager from "@/components/tracker/ChecklistManager";
import TimelineManager from "@/components/tracker/TimelineManager";

const ComprehensiveImplementationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tracker');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Comprehensive Implementation Hub
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete implementation tracking, professional reporting, and deployment management
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Active Sites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <CheckSquare className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Checklist Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="tracker" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Implementation Tracker
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Professional Reports
            </TabsTrigger>
            <TabsTrigger value="checklists" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="tracker" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Implementation Tracker</h2>
                    <p className="text-muted-foreground">
                      Track progress across all sites, phases, and deployment activities
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Real-time Updates
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Progress Analytics
                    </Badge>
                  </div>
                </div>
                <ComprehensiveImplementationTracker />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Professional Reports</h2>
                    <p className="text-muted-foreground">
                      Generate comprehensive, professionally formatted deployment reports and checklists
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      Multi-format Export
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Customizable Templates
                    </Badge>
                  </div>
                </div>
                <ProfessionalDeploymentReportGenerator />
              </div>
            </TabsContent>

            <TabsContent value="checklists" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Implementation Checklists</h2>
                    <p className="text-muted-foreground">
                      Manage detailed checklists for each deployment phase and site
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CheckSquare className="h-3 w-3" />
                      Phase-based Organization
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      Team Assignments
                    </Badge>
                  </div>
                </div>
                <ChecklistManager />
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Project Timeline</h2>
                    <p className="text-muted-foreground">
                      Visualize project milestones, dependencies, and critical path
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Milestone Tracking
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Dependency Management
                    </Badge>
                  </div>
                </div>
                <TimelineManager />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveImplementationHub;