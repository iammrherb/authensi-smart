import React, { useState } from 'react';
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  FileText, 
  Settings, 
  HardDrive, 
  Code, 
  Search, 
  Plus,
  Folder,
  Network,
  Shield,
  Cpu
} from "lucide-react";

// Import management components
import EnhancedVendorManagement from "@/components/vendors/EnhancedVendorManagement";
import RequirementsManagement from "@/components/requirements/RequirementsManagement";
import UseCaseLibraryBrowser from "@/components/use-cases/UseCaseLibraryBrowser";
import ProjectTemplatesManager from "@/components/templates/ProjectTemplatesManager";
import ConfigGeneratorManager from "@/components/config/ConfigGeneratorManager";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Resource stats for overview
  const resourceStats = [
    {
      title: "Project Templates",
      count: 15,
      icon: <Folder className="h-5 w-5" />,
      description: "Pre-configured project templates for various deployment scenarios",
      color: "blue"
    },
    {
      title: "Use Cases",
      count: 42,
      icon: <BookOpen className="h-5 w-5" />,
      description: "Comprehensive library of NAC use cases and scenarios",
      color: "green"
    },
    {
      title: "Requirements",
      count: 128,
      icon: <FileText className="h-5 w-5" />,
      description: "Technical and business requirements catalog",
      color: "purple"
    },
    {
      title: "Vendors",
      count: 35,
      icon: <HardDrive className="h-5 w-5" />,
      description: "Certified vendor integrations with Portnox documentation",
      color: "orange"
    },
    {
      title: "1Xer Templates",
      count: 89,
      icon: <Code className="h-5 w-5" />,
      description: "Advanced 802.1X configuration templates with AI generation and scenarios",
      color: "cyan"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-l-blue-500 hover:border-l-blue-600",
      green: "border-l-green-500 hover:border-l-green-600", 
      purple: "border-l-purple-500 hover:border-l-purple-600",
      orange: "border-l-orange-500 hover:border-l-orange-600",
      cyan: "border-l-cyan-500 hover:border-l-cyan-600"
    };
    return colorMap[color as keyof typeof colorMap] || "border-l-primary";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <Badge variant="glow" className="mb-4">
                📚 Resource Library
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Resource Center</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Centralized management for project templates, use cases, requirements, vendor integrations, 
                and configuration generators. Everything you need for successful NAC deployments.
              </p>
            </div>

            {/* Resource Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {resourceStats.map((stat, index) => (
                <Card 
                  key={index} 
                  className={`border-l-4 ${getColorClasses(stat.color)} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="text-muted-foreground">
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.count}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search across all resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Main Resource Management Tabs */}
            <Tabs defaultValue="templates" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto">
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>
                <TabsTrigger value="use-cases" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Use Cases</span>
                </TabsTrigger>
                <TabsTrigger value="requirements" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Requirements</span>
                </TabsTrigger>
                <TabsTrigger value="vendors" className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span className="hidden sm:inline">Vendors</span>
                </TabsTrigger>
                <TabsTrigger value="config-generator" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">1Xer Gen</span>
                </TabsTrigger>
              </TabsList>

              {/* Project Templates Tab */}
              <TabsContent value="templates" className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Folder className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Project Templates</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Manage pre-configured project templates for various deployment scenarios. 
                    Create, edit, and customize templates to accelerate project setup.
                  </p>
                </div>
                <ProjectTemplatesManager searchTerm={searchTerm} />
              </TabsContent>

              {/* Use Cases Tab */}
              <TabsContent value="use-cases" className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Use Case Library</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive library of NAC use cases. Browse, edit, and create new use cases 
                    to build a complete deployment strategy.
                  </p>
                </div>
                <UseCaseLibraryBrowser multiSelect={true} showAddToProject={false} />
              </TabsContent>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Requirements Management</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Technical and business requirements catalog. Create, modify, and organize 
                    requirements for various deployment scenarios and compliance frameworks.
                  </p>
                </div>
                <RequirementsManagement />
              </TabsContent>

              {/* Vendors Tab */}
              <TabsContent value="vendors" className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <HardDrive className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Vendor Management</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive vendor catalog with Portnox integration documentation. 
                    Manage certifications, configuration guides, and compatibility information.
                  </p>
                </div>
                <EnhancedVendorManagement />
              </TabsContent>

              {/* Config Generator Tab */}
              <TabsContent value="config-generator" className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Code className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">1Xer Configuration Generator</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Advanced AI-powered 802.1X configuration generator with templates, scenarios, and industry best practices. 
                    Generate, customize, and save configurations for all supported vendors with full lifecycle management.
                  </p>
                </div>
                <ConfigGeneratorManager searchTerm={searchTerm} />
              </TabsContent>
            </Tabs>

            {/* Quick Actions Section */}
            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">New Template</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Add Use Case</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">New Requirement</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  <span className="text-sm">Add Vendor</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span className="text-sm">New Config</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;