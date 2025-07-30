import React, { useState } from 'react';
import UseCaseLibraryBrowser from '@/components/use-cases/UseCaseLibraryBrowser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Shield, Network, Smartphone, FileCheck, 
  Star, TrendingUp, Clock, Users, Download, Filter
} from 'lucide-react';
import { useCaseLibrary, UseCase } from '@/data/useCaseLibrary';

const UseCaseLibrary = () => {
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  const handleSelectUseCase = (useCase: UseCase) => {
    setSelectedUseCases(prev => 
      prev.includes(useCase.id) 
        ? prev.filter(id => id !== useCase.id)
        : [...prev, useCase.id]
    );
  };

  const stats = {
    totalUseCases: useCaseLibrary.length,
    authenticationUseCases: useCaseLibrary.filter(uc => uc.category === 'Authentication').length,
    segmentationUseCases: useCaseLibrary.filter(uc => uc.category === 'Network Segmentation').length,
    complianceUseCases: useCaseLibrary.filter(uc => uc.category === 'Compliance').length,
    lowComplexity: useCaseLibrary.filter(uc => uc.complexity === 'low').length,
    mediumComplexity: useCaseLibrary.filter(uc => uc.complexity === 'medium').length,
    highComplexity: useCaseLibrary.filter(uc => uc.complexity === 'high').length,
  };

  const categories = [
    {
      name: 'Authentication',
      icon: <Shield className="h-5 w-5" />,
      count: stats.authenticationUseCases,
      description: 'User and device authentication methods',
      color: 'text-blue-500'
    },
    {
      name: 'Network Segmentation',
      icon: <Network className="h-5 w-5" />,
      count: stats.segmentationUseCases,
      description: 'Network isolation and access control',
      color: 'text-green-500'
    },
    {
      name: 'Device Onboarding',
      icon: <Smartphone className="h-5 w-5" />,
      count: stats.authenticationUseCases,
      description: 'Device enrollment and management',
      color: 'text-purple-500'
    },
    {
      name: 'Compliance',
      icon: <FileCheck className="h-5 w-5" />,
      count: stats.complianceUseCases,
      description: 'Regulatory compliance frameworks',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <Badge variant="glow" className="mb-4">
                <BookOpen className="h-4 w-4 mr-2" />
                200+ Pre-Built Use Cases
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Use Case Library</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our comprehensive collection of NAC use cases, from basic authentication 
                to advanced compliance scenarios. Each use case includes implementation guides, 
                test procedures, and vendor-specific configurations.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Total Use Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalUseCases}</div>
                  <p className="text-sm text-muted-foreground">Ready to deploy</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    Quick Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{stats.lowComplexity}</div>
                  <p className="text-sm text-muted-foreground">Low complexity use cases</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Standard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">{stats.mediumComplexity}</div>
                  <p className="text-sm text-muted-foreground">Medium complexity use cases</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    Advanced
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">{stats.highComplexity}</div>
                  <p className="text-sm text-muted-foreground">High complexity use cases</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Use Case Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={category.color}>
                          {category.icon}
                        </div>
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {category.count} use cases
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="browse" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse Library</TabsTrigger>
                <TabsTrigger value="selected">Selected ({selectedUseCases.length})</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="browse">
                <UseCaseLibraryBrowser
                  onSelectUseCase={handleSelectUseCase}
                  selectedUseCases={selectedUseCases}
                  multiSelect={true}
                  showAddToProject={true}
                />
              </TabsContent>

              <TabsContent value="selected">
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Use Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUseCases.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-muted-foreground">
                            You have selected {selectedUseCases.length} use cases
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Export Selection
                            </Button>
                            <Button>
                              Add to Project
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-4">
                          {selectedUseCases.map(id => {
                            const useCase = useCaseLibrary.find(uc => uc.id === id);
                            return useCase ? (
                              <div key={id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{useCase.title}</h3>
                                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                                    <div className="flex gap-2 mt-2">
                                      <Badge variant="outline">{useCase.category}</Badge>
                                      <Badge variant="outline">{useCase.complexity}</Badge>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedUseCases(prev => prev.filter(ucId => ucId !== id))}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No use cases selected</h3>
                        <p className="text-muted-foreground">
                          Browse the library and select use cases to add them here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Pre-Built Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">Healthcare NAC</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          HIPAA-compliant NAC deployment with medical device segmentation
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">8 use cases</Badge>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">Financial Services</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          PCI-DSS compliant NAC with advanced segmentation and monitoring
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">12 use cases</Badge>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">Manufacturing IoT</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Industrial NAC with OT/IT convergence and device profiling
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">15 use cases</Badge>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseLibrary;