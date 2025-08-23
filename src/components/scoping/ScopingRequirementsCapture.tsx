import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, Network, Server, Users, Target, 
  Clock, DollarSign, AlertTriangle, CheckCircle,
  Plus, Minus, FileText, Settings, Eye
} from 'lucide-react';

interface RequirementCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  requirements: Requirement[];
}

interface Requirement {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  satisfied: boolean;
  notes?: string;
  dependencies?: string[];
  estimatedEffort?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

const defaultCategories: RequirementCategory[] = [
  {
    id: 'security',
    name: 'Security Requirements',
    icon: Shield,
    description: 'Authentication, authorization, and security policies',
    requirements: [
      {
        id: 'multi-factor-auth',
        name: 'Multi-Factor Authentication',
        description: 'Implement MFA for all user access',
        priority: 'critical',
        category: 'security',
        satisfied: false,
        estimatedEffort: '2-3 weeks',
        riskLevel: 'high'
      },
      {
        id: 'role-based-access',
        name: 'Role-Based Access Control',
        description: 'Define and implement user roles and permissions',
        priority: 'high',
        category: 'security',
        satisfied: false,
        estimatedEffort: '3-4 weeks',
        riskLevel: 'medium'
      },
      {
        id: 'encryption',
        name: 'Data Encryption',
        description: 'Encrypt data in transit and at rest',
        priority: 'critical',
        category: 'security',
        satisfied: false,
        estimatedEffort: '1-2 weeks',
        riskLevel: 'high'
      }
    ]
  },
  {
    id: 'network',
    name: 'Network Requirements',
    icon: Network,
    description: 'Network infrastructure and connectivity needs',
    requirements: [
      {
        id: 'network-segmentation',
        name: 'Network Segmentation',
        description: 'Separate network traffic by user groups and device types',
        priority: 'high',
        category: 'network',
        satisfied: false,
        estimatedEffort: '4-6 weeks',
        riskLevel: 'medium'
      },
      {
        id: 'bandwidth-requirements',
        name: 'Bandwidth Planning',
        description: 'Assess and plan for adequate network bandwidth',
        priority: 'medium',
        category: 'network',
        satisfied: false,
        estimatedEffort: '1-2 weeks',
        riskLevel: 'low'
      }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure Requirements',
    icon: Server,
    description: 'Hardware, software, and system requirements',
    requirements: [
      {
        id: 'server-capacity',
        name: 'Server Capacity Planning',
        description: 'Determine server requirements for NAC deployment',
        priority: 'high',
        category: 'infrastructure',
        satisfied: false,
        estimatedEffort: '2-3 weeks',
        riskLevel: 'medium'
      },
      {
        id: 'redundancy',
        name: 'High Availability Setup',
        description: 'Implement redundancy for critical components',
        priority: 'medium',
        category: 'infrastructure',
        satisfied: false,
        estimatedEffort: '3-4 weeks',
        riskLevel: 'medium'
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Requirements',
    icon: FileText,
    description: 'Regulatory and compliance needs',
    requirements: [
      {
        id: 'audit-logging',
        name: 'Comprehensive Audit Logging',
        description: 'Log all access attempts and security events',
        priority: 'critical',
        category: 'compliance',
        satisfied: false,
        estimatedEffort: '2-3 weeks',
        riskLevel: 'high'
      },
      {
        id: 'reporting',
        name: 'Compliance Reporting',
        description: 'Generate required compliance reports',
        priority: 'high',
        category: 'compliance',
        satisfied: false,
        estimatedEffort: '2-4 weeks',
        riskLevel: 'medium'
      }
    ]
  },
  {
    id: 'integration',
    name: 'Integration Requirements',
    icon: Settings,
    description: 'Third-party systems and API integrations',
    requirements: [
      {
        id: 'active-directory',
        name: 'Active Directory Integration',
        description: 'Integrate with existing AD infrastructure',
        priority: 'high',
        category: 'integration',
        satisfied: false,
        estimatedEffort: '2-3 weeks',
        riskLevel: 'medium'
      },
      {
        id: 'siem-integration',
        name: 'SIEM Integration',
        description: 'Connect to security information and event management system',
        priority: 'medium',
        category: 'integration',
        satisfied: false,
        estimatedEffort: '1-2 weeks',
        riskLevel: 'low'
      }
    ]
  }
];

export default function ScopingRequirementsCapture() {
  const [categories, setCategories] = useState<RequirementCategory[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [customRequirement, setCustomRequirement] = useState({
    name: '',
    description: '',
    priority: 'medium' as const,
    category: 'security'
  });
  const [showAddRequirement, setShowAddRequirement] = useState(false);

  const totalRequirements = categories.reduce((sum, cat) => sum + cat.requirements.length, 0);
  const satisfiedRequirements = categories.reduce((sum, cat) => 
    sum + cat.requirements.filter(req => req.satisfied).length, 0
  );
  const completionPercentage = totalRequirements > 0 ? (satisfiedRequirements / totalRequirements) * 100 : 0;

  const updateRequirement = (categoryId: string, requirementId: string, updates: Partial<Requirement>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            requirements: cat.requirements.map(req => 
              req.id === requirementId ? { ...req, ...updates } : req
            )
          }
        : cat
    ));
  };

  const addCustomRequirement = () => {
    if (!customRequirement.name || !customRequirement.description) return;

    const newRequirement: Requirement = {
      id: `custom-${Date.now()}`,
      name: customRequirement.name,
      description: customRequirement.description,
      priority: customRequirement.priority,
      category: customRequirement.category,
      satisfied: false,
      estimatedEffort: 'TBD',
      riskLevel: 'medium'
    };

    setCategories(prev => prev.map(cat => 
      cat.id === customRequirement.category
        ? { ...cat, requirements: [...cat.requirements, newRequirement] }
        : cat
    ));

    setCustomRequirement({ name: '', description: '', priority: 'medium', category: 'security' });
    setShowAddRequirement(false);
  };

  const removeRequirement = (categoryId: string, requirementId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId
        ? { ...cat, requirements: cat.requirements.filter(req => req.id !== requirementId) }
        : cat
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Requirements Capture & Analysis
          </CardTitle>
          <div className="space-y-2">
            <Progress value={completionPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {satisfiedRequirements} of {totalRequirements} requirements addressed ({Math.round(completionPercentage)}% complete)
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category, index) => {
              const categoryCompletion = category.requirements.length > 0 
                ? (category.requirements.filter(req => req.satisfied).length / category.requirements.length) * 100 
                : 0;

              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === index ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedCategory(index)}
                >
                  <div className="flex items-start gap-2">
                    <category.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={categoryCompletion} className="h-1 flex-1" />
                        <span className="text-xs">{Math.round(categoryCompletion)}%</span>
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}

            <Separator className="my-4" />

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAddRequirement(!showAddRequirement)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </CardContent>
        </Card>

        {/* Requirements Detail */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <categories[selectedCategory].icon className="h-5 w-5" />
              {categories[selectedCategory].name}
            </CardTitle>
            <p className="text-muted-foreground">{categories[selectedCategory].description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories[selectedCategory].requirements.map((requirement) => (
              <Card key={requirement.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{requirement.name}</h4>
                          <Badge variant={getPriorityColor(requirement.priority) as any}>
                            {requirement.priority.toUpperCase()}
                          </Badge>
                          {requirement.riskLevel && (
                            <Badge variant={getRiskColor(requirement.riskLevel) as any}>
                              Risk: {requirement.riskLevel.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{requirement.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={requirement.satisfied}
                            onCheckedChange={(checked) => 
                              updateRequirement(categories[selectedCategory].id, requirement.id, { satisfied: !!checked })
                            }
                          />
                          <span className="text-sm">Satisfied</span>
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(categories[selectedCategory].id, requirement.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {requirement.estimatedEffort && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Effort: {requirement.estimatedEffort}</span>
                        </div>
                      )}
                      {requirement.dependencies && requirement.dependencies.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          <span>Dependencies: {requirement.dependencies.length}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {requirement.satisfied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{requirement.satisfied ? 'Addressed' : 'Pending'}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${requirement.id}`} className="text-sm">Implementation Notes</Label>
                      <Textarea
                        id={`notes-${requirement.id}`}
                        value={requirement.notes || ''}
                        onChange={(e) => 
                          updateRequirement(categories[selectedCategory].id, requirement.id, { notes: e.target.value })
                        }
                        placeholder="Add implementation notes, constraints, or specific details..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {categories[selectedCategory].requirements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No requirements defined for this category yet.</p>
                <p className="text-sm">Click "Add Requirement" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Custom Requirement Form */}
      {showAddRequirement && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Custom Requirement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="req-name">Requirement Name *</Label>
                <Input
                  id="req-name"
                  value={customRequirement.name}
                  onChange={(e) => setCustomRequirement(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter requirement name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-category">Category *</Label>
                <Select 
                  value={customRequirement.category} 
                  onValueChange={(value) => setCustomRequirement(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-priority">Priority</Label>
                <Select 
                  value={customRequirement.priority} 
                  onValueChange={(value: any) => setCustomRequirement(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="req-description">Description *</Label>
              <Textarea
                id="req-description"
                value={customRequirement.description}
                onChange={(e) => setCustomRequirement(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the requirement in detail"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddRequirement(false)}>
                Cancel
              </Button>
              <Button onClick={addCustomRequirement}>
                Add Requirement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-destructive">{categories.reduce((sum, cat) => sum + cat.requirements.filter(req => req.priority === 'critical').length, 0)}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-500">{categories.reduce((sum, cat) => sum + cat.requirements.filter(req => req.priority === 'high').length, 0)}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-500">{categories.reduce((sum, cat) => sum + cat.requirements.filter(req => req.priority === 'medium').length, 0)}</div>
              <div className="text-sm text-muted-foreground">Medium Priority</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-500">{satisfiedRequirements}</div>
              <div className="text-sm text-muted-foreground">Satisfied</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}