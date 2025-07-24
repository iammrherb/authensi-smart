import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, Filter, BookOpen, Shield, Network, Smartphone, 
  FileCheck, Clock, Users, Star, Plus, Eye, Download,
  CheckCircle, AlertTriangle, Info, Zap
} from 'lucide-react';
import { useCaseLibrary, UseCase, getUseCasesByCategory, searchUseCases } from '@/data/useCaseLibrary';

interface UseCaseLibraryBrowserProps {
  onSelectUseCase?: (useCase: UseCase) => void;
  selectedUseCases?: string[];
  multiSelect?: boolean;
  showAddToProject?: boolean;
  projectId?: string;
}

const UseCaseLibraryBrowser: React.FC<UseCaseLibraryBrowserProps> = ({
  onSelectUseCase,
  selectedUseCases = [],
  multiSelect = false,
  showAddToProject = false,
  projectId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories and complexities
  const categories = [...new Set(useCaseLibrary.map(uc => uc.category))];
  const complexities = ['low', 'medium', 'high'];

  // Filter use cases based on search and filters
  const filteredUseCases = useMemo(() => {
    let filtered = useCaseLibrary;

    // Apply search filter
    if (searchQuery) {
      filtered = searchUseCases(searchQuery);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(uc => uc.category === categoryFilter);
    }

    // Apply complexity filter
    if (complexityFilter !== 'all') {
      filtered = filtered.filter(uc => uc.complexity === complexityFilter);
    }

    return filtered;
  }, [searchQuery, categoryFilter, complexityFilter]);

  // Group use cases by category for tabs view
  const useCasesByCategory = useMemo(() => {
    const grouped: Record<string, UseCase[]> = {};
    categories.forEach(category => {
      grouped[category] = getUseCasesByCategory(category);
    });
    return grouped;
  }, [categories]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication': return <Shield className="h-4 w-4" />;
      case 'Network Segmentation': return <Network className="h-4 w-4" />;
      case 'Device Onboarding': return <Smartphone className="h-4 w-4" />;
      case 'Compliance': return <FileCheck className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleUseCaseClick = (useCase: UseCase) => {
    if (multiSelect) {
      onSelectUseCase?.(useCase);
    } else {
      setSelectedUseCase(useCase);
    }
  };

  const isSelected = (useCaseId: string) => {
    return selectedUseCases.includes(useCaseId);
  };

  const renderUseCaseCard = (useCase: UseCase) => (
    <Card 
      key={useCase.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected(useCase.id) ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => handleUseCaseClick(useCase)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(useCase.category)}
            <CardTitle className="text-lg">{useCase.title}</CardTitle>
          </div>
          {isSelected(useCase.id) && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {useCase.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {useCase.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getComplexityColor(useCase.complexity)}`}
          >
            {useCase.complexity}
          </Badge>
          {useCase.estimated_effort_weeks && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {useCase.estimated_effort_weeks}w
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {useCase.vendors_supported.length > 3 
                ? `${useCase.vendors_supported.slice(0, 3).join(', ')}...` 
                : useCase.vendors_supported.join(', ')
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground line-clamp-1">
              {useCase.business_value}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-1">
            {useCase.compliance_frameworks?.slice(0, 2).map((framework, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {framework}
              </Badge>
            ))}
            {(useCase.compliance_frameworks?.length || 0) > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{(useCase.compliance_frameworks?.length || 0) - 2}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              setSelectedUseCase(useCase);
            }}>
              <Eye className="h-4 w-4" />
            </Button>
            {showAddToProject && (
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                // Handle add to project
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUseCaseList = (useCase: UseCase) => (
    <div 
      key={useCase.id}
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
        isSelected(useCase.id) ? 'bg-primary/5 border-primary' : ''
      }`}
      onClick={() => handleUseCaseClick(useCase)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(useCase.category)}
            <h3 className="font-medium">{useCase.title}</h3>
            {isSelected(useCase.id) && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {useCase.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {useCase.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${getComplexityColor(useCase.complexity)}`}
            >
              {useCase.complexity}
            </Badge>
            {useCase.estimated_effort_weeks && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {useCase.estimated_effort_weeks}w
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-4">
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            setSelectedUseCase(useCase);
          }}>
            <Eye className="h-4 w-4" />
          </Button>
          {showAddToProject && (
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              // Handle add to project
            }}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Use Case Library
            <Badge variant="secondary">{filteredUseCases.length} use cases</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search use cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={complexityFilter} onValueChange={setComplexityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {complexities.map(complexity => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Display */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredUseCases.length})</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category} ({useCasesByCategory[category]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUseCases.map(renderUseCaseCard)}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUseCases.map(renderUseCaseList)}
            </div>
          )}
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {useCasesByCategory[category]?.map(renderUseCaseCard)}
              </div>
            ) : (
              <div className="space-y-2">
                {useCasesByCategory[category]?.map(renderUseCaseList)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Use Case Detail Dialog */}
      <Dialog open={!!selectedUseCase} onOpenChange={() => setSelectedUseCase(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedUseCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedUseCase.category)}
                  {selectedUseCase.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedUseCase.category}</Badge>
                  <Badge 
                    variant="outline" 
                    className={getComplexityColor(selectedUseCase.complexity)}
                  >
                    {selectedUseCase.complexity}
                  </Badge>
                  {selectedUseCase.estimated_effort_weeks && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedUseCase.estimated_effort_weeks} weeks
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedUseCase.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Business Value</h3>
                  <p className="text-muted-foreground">{selectedUseCase.business_value}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Technical Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedUseCase.technical_requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Prerequisites</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedUseCase.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Authentication Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.authentication_methods.map((method, index) => (
                      <Badge key={index} variant="secondary">{method}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Portnox Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.portnox_features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>

                {selectedUseCase.compliance_frameworks && selectedUseCase.compliance_frameworks.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Compliance Frameworks</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUseCase.compliance_frameworks.map((framework, index) => (
                        <Badge key={index} variant="secondary">{framework}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Supported Vendors</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedUseCase.vendors_supported.map((vendor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{vendor}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Test Cases</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedUseCase.test_cases.map((testCase, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{testCase}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => onSelectUseCase?.(selectedUseCase)}>
                    {multiSelect ? 'Add to Selection' : 'Select Use Case'}
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export Details
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UseCaseLibraryBrowser;