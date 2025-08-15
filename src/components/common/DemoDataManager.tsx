import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Trash2, 
  Users,
  Building2,
  FileText,
  Shield,
  HelpCircle,
  BarChart3,
  Server
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSeedDemoData, useClearDemoData } from "@/hooks/useDemoData";
import { TaxonomySeederService } from "@/services/TaxonomySeederService";
import { UnifiedTemplateSeederService } from "@/services/UnifiedTemplateSeederService";
import SimpleLibrarySeeder from "@/components/library/SimpleLibrarySeeder";
import ExpandedVendorSeeder from "@/components/library/ExpandedVendorSeeder";

const DemoDataManager: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTaxonomySeeding, setIsTaxonomySeeding] = useState(false);
  const [isTemplateSeeding, setIsTemplateSeeding] = useState(false);
  const { toast } = useToast();
  
  const seedDemoData = useSeedDemoData();
  const clearDemoData = useClearDemoData();

  const handleSeedProjectsAndSites = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData.mutateAsync();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearProjectsAndSites = async () => {
    try {
      await clearDemoData.mutateAsync();
    } catch (error) {
      console.error('Clear demo data error:', error);
    }
  };

  const handleSeedTaxonomy = async () => {
    setIsTaxonomySeeding(true);
    try {
      const result = await TaxonomySeederService.seed();
      toast({
        title: "Taxonomy Data Seeded",
        description: `Successfully seeded core taxonomy data: ${Object.entries(result.summary).map(([key, val]) => `${key}: ${val.inserted} inserted`).join(', ')}`,
      });
    } catch (error) {
      console.error('Taxonomy seeding error:', error);
      toast({
        title: "Taxonomy Seeding Failed",
        description: error instanceof Error ? error.message : "Failed to seed taxonomy data",
        variant: "destructive",
      });
    } finally {
      setIsTaxonomySeeding(false);
    }
  };

  const handleSeedTemplates = async () => {
    setIsTemplateSeeding(true);
    try {
      const result = await UnifiedTemplateSeederService.seedAll();
      toast({
        title: "Templates Seeded",
        description: `Successfully seeded ${result.inserted} configuration templates (${result.skipped} skipped)`,
      });
    } catch (error) {
      console.error('Template seeding error:', error);
      toast({
        title: "Template Seeding Failed",
        description: error instanceof Error ? error.message : "Failed to seed configuration templates",
        variant: "destructive",
      });
    } finally {
      setIsTemplateSeeding(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Database className="w-8 h-8 text-primary" />
          Demo Data Management Center
        </h1>
        <p className="text-muted-foreground">
          Generate comprehensive demo data across all platform modules for testing and demonstrations
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="projects">Projects & Sites</TabsTrigger>
          <TabsTrigger value="library">Library Data</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Projects & Sites Demo Data
              </CardTitle>
              <CardDescription>
                Generate realistic project and site data for testing deployment workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Demo Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">25</div>
                  <div className="text-sm text-muted-foreground">Demo Sites</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Includes:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-start">
                    <Building2 className="w-3 h-3 mr-1" />
                    Multi-site Projects
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Users className="w-3 h-3 mr-1" />
                    Stakeholder Data
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Progress Tracking
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Shield className="w-3 h-3 mr-1" />
                    Security Configs
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSeedProjectsAndSites}
                  disabled={isSeeding}
                  className="flex-1"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Seed Projects & Sites
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleClearProjectsAndSites}
                  variant="outline"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <SimpleLibrarySeeder />
          <ExpandedVendorSeeder />
        </TabsContent>

        <TabsContent value="taxonomy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Core Taxonomy Data
              </CardTitle>
              <CardDescription>
                Seed fundamental taxonomy data including device types, business domains, and compliance frameworks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Core Datasets:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-start">
                    <Server className="w-3 h-3 mr-1" />
                    Device Types
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Building2 className="w-3 h-3 mr-1" />
                    Business Domains
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Shield className="w-3 h-3 mr-1" />
                    Compliance Frameworks
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <FileText className="w-3 h-3 mr-1" />
                    Authentication Methods
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleSeedTaxonomy}
                disabled={isTaxonomySeeding}
                className="w-full"
              >
                {isTaxonomySeeding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Seeding Taxonomy...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Seed Core Taxonomy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Configuration Templates
              </CardTitle>
              <CardDescription>
                Load pre-built configuration templates for major network vendors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Template Categories:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-start">
                    <Shield className="w-3 h-3 mr-1" />
                    Security Configs
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Server className="w-3 h-3 mr-1" />
                    Network Setup
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <Users className="w-3 h-3 mr-1" />
                    Authentication
                  </Badge>
                  <Badge variant="outline" className="justify-start">
                    <FileText className="w-3 h-3 mr-1" />
                    Compliance
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleSeedTemplates}
                disabled={isTemplateSeeding}
                className="w-full"
              >
                {isTemplateSeeding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Seeding Templates...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Seed Configuration Templates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-medium">Demo Data Management</div>
              <div className="text-xs text-muted-foreground">
                Use this center to populate your platform with realistic demo data across all modules. 
                This is perfect for testing workflows, demonstrating features, or getting familiar with the platform.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoDataManager;