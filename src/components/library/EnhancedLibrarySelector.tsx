import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Plus, AlertTriangle, CheckSquare, FileText } from "lucide-react";
import { usePainPoints } from "@/hooks/usePainPoints";
import { useRequirements } from "@/hooks/useRequirements";
import { useUseCases } from "@/hooks/useUseCases";
import UnifiedRequirementsManager from "../requirements/UnifiedRequirementsManager";

interface EnhancedLibrarySelectorProps {
  selectedPainPoints: string[];
  selectedRequirements: string[];
  selectedUseCases: string[];
  onPainPointsChange: (painPoints: string[]) => void;
  onRequirementsChange: (requirements: string[]) => void;
  onUseCasesChange: (useCases: string[]) => void;
  onAddNew?: (type: 'pain-point' | 'requirement' | 'use-case') => void;
}

const EnhancedLibrarySelector: React.FC<EnhancedLibrarySelectorProps> = ({
  selectedPainPoints,
  selectedRequirements,
  selectedUseCases,
  onPainPointsChange,
  onRequirementsChange,
  onUseCasesChange,
  onAddNew
}) => {
  const [searchTerms, setSearchTerms] = useState({
    painPoints: '',
    requirements: '',
    useCases: ''
  });
  
  const [filters, setFilters] = useState({
    painPoints: { category: '', severity: '', industry: '' },
    requirements: { category: '', priority: '', industry: '' },
    useCases: { category: '', complexity: '', industry: '' }
  });

  const { data: painPoints = [] } = usePainPoints();
  const { data: requirements = [] } = useRequirements();
  const { data: useCases = [] } = useUseCases();

  // Filter and search functions
  const filteredPainPoints = useMemo(() => {
    return painPoints.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerms.painPoints.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerms.painPoints.toLowerCase());
      const matchesCategory = !filters.painPoints.category || item.category === filters.painPoints.category;
      const matchesSeverity = !filters.painPoints.severity || item.severity === filters.painPoints.severity;
      const matchesIndustry = !filters.painPoints.industry || 
                             item.industry_specific.includes(filters.painPoints.industry);
      
      return matchesSearch && matchesCategory && matchesSeverity && matchesIndustry;
    });
  }, [painPoints, searchTerms.painPoints, filters.painPoints]);

  const filteredRequirements = useMemo(() => {
    return requirements.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerms.requirements.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerms.requirements.toLowerCase());
      const matchesCategory = !filters.requirements.category || item.category === filters.requirements.category;
      const matchesPriority = !filters.requirements.priority || item.priority === filters.requirements.priority;
      const matchesIndustry = !filters.requirements.industry || 
                             (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(filters.requirements.industry.toLowerCase())));
      
      return matchesSearch && matchesCategory && matchesPriority && matchesIndustry;
    });
  }, [requirements, searchTerms.requirements, filters.requirements]);

  const filteredUseCases = useMemo(() => {
    return useCases.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerms.useCases.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerms.useCases.toLowerCase());
      const matchesCategory = !filters.useCases.category || item.category === filters.useCases.category;
      const matchesComplexity = !filters.useCases.complexity || item.complexity === filters.useCases.complexity;
      const matchesIndustry = !filters.useCases.industry || 
                             (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(filters.useCases.industry.toLowerCase())));
      
      return matchesSearch && matchesCategory && matchesComplexity && matchesIndustry;
    });
  }, [useCases, searchTerms.useCases, filters.useCases]);

  // Get unique values for filters
  const painPointCategories = [...new Set(painPoints.map(p => p.category))];
  const painPointSeverities = ['low', 'medium', 'high', 'critical'];
  const requirementCategories = [...new Set(requirements.map(r => r.category))];
  const requirementPriorities = ['low', 'medium', 'high', 'critical'];
  const useCaseCategories = [...new Set(useCases.map(u => u.category))];
  const useCaseComplexities = ['low', 'medium', 'high', 'critical'];
  const industries = ['healthcare', 'finance', 'government', 'education', 'manufacturing', 'retail', 'energy', 'defense', 'legal', 'aerospace', 'utilities'];

  const handleItemToggle = (itemId: string, type: 'pain-point' | 'requirement' | 'use-case') => {
    switch (type) {
      case 'pain-point':
        const newPainPoints = selectedPainPoints.includes(itemId)
          ? selectedPainPoints.filter(id => id !== itemId)
          : [...selectedPainPoints, itemId];
        onPainPointsChange(newPainPoints);
        break;
      case 'requirement':
        const newRequirements = selectedRequirements.includes(itemId)
          ? selectedRequirements.filter(id => id !== itemId)
          : [...selectedRequirements, itemId];
        onRequirementsChange(newRequirements);
        break;
      case 'use-case':
        const newUseCases = selectedUseCases.includes(itemId)
          ? selectedUseCases.filter(id => id !== itemId)
          : [...selectedUseCases, itemId];
        onUseCasesChange(newUseCases);
        break;
    }
  };

  const renderItemCard = (item: any, type: 'pain-point' | 'requirement' | 'use-case', isSelected: boolean) => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
    };

    return (
      <Card key={item.id} className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleItemToggle(item.id, type)}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm leading-tight">
                  {type === 'use-case' ? item.name : item.title}
                </h4>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  {(item.severity || item.priority || item.complexity) && (
                    <Badge className={`text-xs ${getSeverityColor(item.severity || item.priority || item.complexity)}`}>
                      {item.severity || item.priority || item.complexity}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFilters = (type: 'painPoints' | 'requirements' | 'useCases') => {
    const typeConfig = {
      painPoints: {
        categories: painPointCategories,
        severities: painPointSeverities,
        icon: AlertTriangle
      },
      requirements: {
        categories: requirementCategories,
        severities: requirementPriorities,
        icon: CheckSquare
      },
      useCases: {
        categories: useCaseCategories,
        severities: useCaseComplexities,
        icon: FileText
      }
    };

    const config = typeConfig[type];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <config.icon className="w-4 h-4" />
          <h3 className="font-medium">
            {type === 'painPoints' ? 'Pain Points' : type === 'requirements' ? 'Requirements' : 'Use Cases'}
            <span className="ml-2 text-sm text-muted-foreground">
              ({type === 'painPoints' ? filteredPainPoints.length : 
                 type === 'requirements' ? filteredRequirements.length : 
                 filteredUseCases.length} items)
            </span>
          </h3>
          {onAddNew && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddNew(type === 'painPoints' ? 'pain-point' : type === 'requirements' ? 'requirement' : 'use-case')}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add New
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerms[type]}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, [type]: e.target.value }))}
              className="pl-8"
            />
          </div>
          
          <Select
            value={filters[type].category}
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              [type]: { ...prev[type], category: value === "all" ? "" : value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {config.categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters[type][type === 'painPoints' ? 'severity' : type === 'requirements' ? 'priority' : 'complexity']}
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              [type]: { 
                ...prev[type], 
                [type === 'painPoints' ? 'severity' : type === 'requirements' ? 'priority' : 'complexity']: value === "all" ? "" : value 
              }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={type === 'painPoints' ? 'Severity' : type === 'requirements' ? 'Priority' : 'Complexity'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {config.severities.map(level => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters[type].industry}
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              [type]: { ...prev[type], industry: value === "all" ? "" : value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {type === 'painPoints' && filteredPainPoints.map(item => 
              renderItemCard(item, 'pain-point', selectedPainPoints.includes(item.id))
            )}
            {type === 'requirements' && filteredRequirements.map(item => 
              renderItemCard(item, 'requirement', selectedRequirements.includes(item.id))
            )}
            {type === 'useCases' && filteredUseCases.map(item => 
              renderItemCard(item, 'use-case', selectedUseCases.includes(item.id))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Enterprise Library Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="painPoints" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="painPoints" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Pain Points ({selectedPainPoints.length})
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Requirements ({selectedRequirements.length})
            </TabsTrigger>
            <TabsTrigger value="useCases" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Use Cases ({selectedUseCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="painPoints">
            {renderFilters('painPoints')}
          </TabsContent>

          <TabsContent value="requirements">
            <UnifiedRequirementsManager
              selectedRequirements={selectedRequirements}
              onRequirementsChange={onRequirementsChange}
              mode="selector"
              showCreate={false}
              maxHeight="h-96"
            />
          </TabsContent>

          <TabsContent value="useCases">
            {renderFilters('useCases')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedLibrarySelector;