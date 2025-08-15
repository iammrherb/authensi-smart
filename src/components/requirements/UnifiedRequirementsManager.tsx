import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Plus, Filter, CheckCircle, AlertTriangle, Clock, 
  Shield, Database, Network, FileText, Tag, Star
} from "lucide-react";
import { useRequirements, useCreateRequirement, type Requirement } from "@/hooks/useRequirements";
import { usePainPoints } from "@/hooks/usePainPoints";
import { useUseCases } from "@/hooks/useUseCases";
import RequirementForm from "./RequirementForm";

interface UnifiedRequirementsManagerProps {
  // For scoping workflow integration
  selectedRequirements?: string[];
  onRequirementsChange?: (requirementIds: string[]) => void;
  
  // For project/site specific requirements
  projectId?: string;
  siteId?: string;
  
  // Display mode
  mode?: 'standalone' | 'selector' | 'scoping';
  showCreate?: boolean;
  showFilters?: boolean;
  maxHeight?: string;
}

const UnifiedRequirementsManager: React.FC<UnifiedRequirementsManagerProps> = ({
  selectedRequirements = [],
  onRequirementsChange,
  projectId,
  siteId,
  mode = 'standalone',
  showCreate = true,
  showFilters = true,
  maxHeight = 'auto'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: requirements = [], isLoading } = useRequirements();
  const { data: painPoints = [] } = usePainPoints();
  const { data: useCases = [] } = useUseCases();
  const createRequirement = useCreateRequirement();

  // Filter requirements based on search and filters
  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      const matchesSearch = 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [requirements, searchTerm, categoryFilter, priorityFilter, statusFilter]);

  // Get unique values for filters
  const categories = [...new Set(requirements.map(r => r.category))];
  const priorities = ['critical', 'high', 'medium', 'low'];
  const statuses = ['approved', 'under-review', 'draft', 'deprecated'];

  const handleRequirementToggle = (requirementId: string) => {
    if (!onRequirementsChange) return;
    
    const newSelection = selectedRequirements.includes(requirementId)
      ? selectedRequirements.filter(id => id !== requirementId)
      : [...selectedRequirements, requirementId];
    
    onRequirementsChange(newSelection);
  };

  const handleCreateRequirement = async (data: any) => {
    try {
      await createRequirement.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create requirement:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'under-review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      case 'deprecated': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'technical': return <Database className="h-4 w-4" />;
      case 'network': return <Network className="h-4 w-4" />;
      case 'compliance': return <FileText className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const renderRequirementCard = (requirement: Requirement) => {
    const isSelected = selectedRequirements.includes(requirement.id);
    const isSelectable = mode === 'selector' || mode === 'scoping';

    return (
      <Card 
        key={requirement.id} 
        className={`transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
        } ${isSelectable ? 'cursor-pointer' : ''}`}
        onClick={isSelectable ? () => handleRequirementToggle(requirement.id) : undefined}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {isSelectable && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleRequirementToggle(requirement.id)}
                className="mt-1"
              />
            )}
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(requirement.category)}
                    <h4 className="font-medium text-sm leading-tight">
                      {requirement.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {requirement.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  {getStatusIcon(requirement.status)}
                  <Badge variant={getPriorityColor(requirement.priority)} className="text-xs">
                    {requirement.priority}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {requirement.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {requirement.requirement_type}
                  </Badge>
                </div>

                {requirement.compliance_frameworks && requirement.compliance_frameworks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {requirement.compliance_frameworks.slice(0, 2).map(framework => (
                      <Badge key={framework} variant="outline" className="text-xs">
                        {framework}
                      </Badge>
                    ))}
                    {requirement.compliance_frameworks.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{requirement.compliance_frameworks.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}

                {requirement.tags && requirement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {requirement.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {requirement.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{requirement.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {requirement.acceptance_criteria && (
                  <span>{requirement.acceptance_criteria.length} criteria</span>
                )}
                {requirement.test_cases && (
                  <span>{requirement.test_cases.length} tests</span>
                )}
                {requirement.dependencies && (
                  <span>{requirement.dependencies.length} dependencies</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Requirements Library</h3>
          <p className="text-sm text-muted-foreground">
            {mode === 'selector' || mode === 'scoping' 
              ? `Select requirements for your project (${selectedRequirements.length} selected)`
              : 'Comprehensive library of project requirements'
            }
          </p>
        </div>
        
        {showCreate && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
              </DialogHeader>
              <RequirementForm 
                onSubmit={handleCreateRequirement} 
                onCancel={() => setIsCreateDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Requirements List */}
      <ScrollArea className={maxHeight !== 'auto' ? maxHeight : undefined}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequirements.map(requirement => renderRequirementCard(requirement))}
        </div>
        
        {filteredRequirements.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No requirements found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Start by creating your first requirement'}
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Summary for selector mode */}
      {(mode === 'selector' || mode === 'scoping') && selectedRequirements.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Selected Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRequirements.length} requirement{selectedRequirements.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRequirementsChange?.([])}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedRequirementsManager;