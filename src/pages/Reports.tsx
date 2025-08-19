import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar, Brain, Shield, Zap } from "lucide-react";
import ComprehensiveReports from "@/components/reports/ComprehensiveReports";
import PortnoxDeploymentReportBuilder from "@/components/reports/PortnoxDeploymentReportBuilder";
import AdvancedConfigAnalyzer from "@/components/config/AdvancedConfigAnalyzer";
import ReportExporter from "@/components/common/ReportExporter";

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState("deployment");

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Generate comprehensive reports and analyze configurations with AI-powered insights
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Enhanced
              </Badge>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Project Reports
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              {/* Report Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Report Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deployment">Deployment Reports</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Reports</SelectItem>
                        <SelectItem value="security">Security Reports</SelectItem>
                        <SelectItem value="performance">Performance Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Report Components */}
              <PortnoxDeploymentReportBuilder />
              <ComprehensiveReports />

              {/* Enhanced Export Options */}
              <ReportExporter 
                data={{ reportType: selectedReportType, timestamp: new Date() }}
                type="project"
                title="Project Reports Summary"
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <Progress value={92} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Project Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive charts will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {/* AI-Powered Configuration Analysis */}
              <AdvancedConfigAnalyzer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;