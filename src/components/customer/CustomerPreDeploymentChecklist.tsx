import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle2, Circle, AlertTriangle, Clock, FileCheck, 
  Network, Shield, Settings, Users, Database, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  responsible_party: 'customer' | 'vendor' | 'both';
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  notes?: string;
  verification_method: string;
  completion_date?: string;
}

interface CustomerPreDeploymentChecklistProps {
  projectId: string;
  onEventLog: (eventType: string, eventData: any) => void;
}

const categoryIcons = {
  'Network Infrastructure': Network,
  'Security Configuration': Shield,
  'System Configuration': Settings,
  'User Management': Users,
  'Data Migration': Database,
  'Testing & Validation': FileCheck
};

const CustomerPreDeploymentChecklist: React.FC<CustomerPreDeploymentChecklistProps> = ({
  projectId,
  onEventLog
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchChecklistData();
    onEventLog('checklist_view', { project_id: projectId });
  }, [projectId]);

  const fetchChecklistData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use predefined checklist items
      // In a real implementation, this would fetch from a database
      const defaultChecklist = getDefaultChecklistItems();
      setChecklistItems(defaultChecklist);
      
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast.error('Failed to load deployment checklist');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultChecklistItems = (): ChecklistItem[] => {
    return [
      // Network Infrastructure
      {
        id: '1',
        category: 'Network Infrastructure',
        title: 'Network Topology Documentation',
        description: 'Complete and accurate network diagrams including all switches, routers, and access points',
        status: 'completed',
        responsible_party: 'customer',
        priority: 'high',
        dependencies: [],
        verification_method: 'Document review and network scan validation',
        completion_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        category: 'Network Infrastructure',
        title: 'VLAN Configuration Ready',
        description: 'VLANs configured for NAC implementation with proper segmentation',
        status: 'in_progress',
        responsible_party: 'customer',
        priority: 'high',
        dependencies: ['Network Topology Documentation'],
        verification_method: 'VLAN configuration verification'
      },
      {
        id: '3',
        category: 'Network Infrastructure',
        title: 'RADIUS Integration Points',
        description: 'Identify and configure RADIUS authentication endpoints',
        status: 'pending',
        responsible_party: 'both',
        priority: 'high',
        dependencies: ['VLAN Configuration Ready'],
        verification_method: 'RADIUS connectivity test'
      },
      
      // Security Configuration
      {
        id: '4',
        category: 'Security Configuration',
        title: 'Security Policies Defined',
        description: 'Access control policies and security rules documented and approved',
        status: 'completed',
        responsible_party: 'customer',
        priority: 'high',
        dependencies: [],
        verification_method: 'Policy document review and approval',
        completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        category: 'Security Configuration',
        title: 'Certificate Management',
        description: 'SSL certificates installed and configured for secure communications',
        status: 'in_progress',
        responsible_party: 'vendor',
        priority: 'high',
        dependencies: ['Security Policies Defined'],
        verification_method: 'Certificate validation and testing'
      },
      {
        id: '6',
        category: 'Security Configuration',
        title: 'Firewall Rules Updated',
        description: 'Firewall configurations updated to allow NAC traffic and communications',
        status: 'pending',
        responsible_party: 'customer',
        priority: 'medium',
        dependencies: ['Certificate Management'],
        verification_method: 'Network connectivity test'
      },
      
      // System Configuration
      {
        id: '7',
        category: 'System Configuration',
        title: 'Server Requirements Met',
        description: 'Hardware and software requirements validated for Portnox deployment',
        status: 'completed',
        responsible_party: 'customer',
        priority: 'high',
        dependencies: [],
        verification_method: 'System requirements audit',
        completion_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        category: 'System Configuration',
        title: 'Database Connectivity',
        description: 'Database connections configured and tested for user authentication',
        status: 'in_progress',
        responsible_party: 'vendor',
        priority: 'high',
        dependencies: ['Server Requirements Met'],
        verification_method: 'Database connection test'
      },
      
      // User Management
      {
        id: '9',
        category: 'User Management',
        title: 'User Directory Integration',
        description: 'Active Directory or LDAP integration configured and tested',
        status: 'pending',
        responsible_party: 'both',
        priority: 'high',
        dependencies: ['Database Connectivity'],
        verification_method: 'User authentication test'
      },
      {
        id: '10',
        category: 'User Management',
        title: 'Role-Based Access Control',
        description: 'User roles and access permissions configured according to policies',
        status: 'pending',
        responsible_party: 'customer',
        priority: 'medium',
        dependencies: ['User Directory Integration'],
        verification_method: 'Role assignment verification'
      },
      
      // Data Migration
      {
        id: '11',
        category: 'Data Migration',
        title: 'Existing User Data Export',
        description: 'Current user and device data exported and prepared for migration',
        status: 'pending',
        responsible_party: 'customer',
        priority: 'medium',
        dependencies: [],
        verification_method: 'Data export validation'
      },
      {
        id: '12',
        category: 'Data Migration',
        title: 'Device Inventory Complete',
        description: 'Complete inventory of all network devices and their current configurations',
        status: 'in_progress',
        responsible_party: 'customer',
        priority: 'medium',
        dependencies: [],
        verification_method: 'Device discovery scan'
      },
      
      // Testing & Validation
      {
        id: '13',
        category: 'Testing & Validation',
        title: 'Test Environment Setup',
        description: 'Isolated test environment configured for pre-deployment testing',
        status: 'pending',
        responsible_party: 'vendor',
        priority: 'high',
        dependencies: ['System Configuration'],
        verification_method: 'Test environment validation'
      },
      {
        id: '14',
        category: 'Testing & Validation',
        title: 'User Acceptance Testing Plan',
        description: 'Comprehensive testing plan developed and approved by stakeholders',
        status: 'pending',
        responsible_party: 'both',
        priority: 'medium',
        dependencies: ['Test Environment Setup'],
        verification_method: 'Testing plan review'
      }
    ];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChecklistData();
    setRefreshing(false);
    onEventLog('checklist_refresh', {});
    toast.success('Checklist refreshed');
  };

  const updateItemStatus = async (itemId: string, newStatus: ChecklistItem['status'], notes?: string) => {
    try {
      const updatedItems = checklistItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus, 
              notes: notes || item.notes,
              completion_date: newStatus === 'completed' ? new Date().toISOString() : item.completion_date
            }
          : item
      );
      
      setChecklistItems(updatedItems);
      
      onEventLog('checklist_item_updated', {
        item_id: itemId,
        new_status: newStatus,
        has_notes: !!notes
      });
      
      toast.success('Checklist item updated');
    } catch (error) {
      console.error('Error updating checklist item:', error);
      toast.error('Failed to update checklist item');
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'blocked': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      case 'blocked': return AlertTriangle;
      default: return Circle;
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-destructive text-destructive';
      case 'medium': return 'border-warning text-warning';
      default: return 'border-muted-foreground text-muted-foreground';
    }
  };

  const getResponsibilityBadge = (party: ChecklistItem['responsible_party']) => {
    switch (party) {
      case 'customer': return <Badge variant="outline" className="bg-blue-50 text-blue-700">Customer</Badge>;
      case 'vendor': return <Badge variant="outline" className="bg-purple-50 text-purple-700">Vendor</Badge>;
      default: return <Badge variant="outline" className="bg-green-50 text-green-700">Both</Badge>;
    }
  };

  // Calculate progress
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(item => item.status === 'completed').length;
  const inProgressItems = checklistItems.filter(item => item.status === 'in_progress').length;
  const blockedItems = checklistItems.filter(item => item.status === 'blocked').length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Group items by category
  const categorizedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="w-6 h-6" />
            Pre-Deployment Checklist
          </h2>
          <p className="text-muted-foreground">
            Ensure all requirements are met before deployment
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deployment Readiness</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {overallProgress}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{completedItems}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{inProgressItems}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{totalItems - completedItems - inProgressItems - blockedItems}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{blockedItems}</div>
              <div className="text-sm text-muted-foreground">Blocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems} className="space-y-4">
        {Object.entries(categorizedItems).map(([category, items]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || FileCheck;
          const categoryCompleted = items.filter(item => item.status === 'completed').length;
          const categoryProgress = Math.round((categoryCompleted / items.length) * 100);

          return (
            <Card key={category}>
              <AccordionItem value={category} className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="w-5 h-5" />
                      <span className="font-semibold">{category}</span>
                      <Badge variant="outline">
                        {categoryCompleted}/{items.length}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mr-4">
                      <div className="text-sm text-muted-foreground">
                        {categoryProgress}% Complete
                      </div>
                      <Progress value={categoryProgress} className="w-24 h-2" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    {items.map(item => {
                      const StatusIcon = getStatusIcon(item.status);
                      
                      return (
                        <Card key={item.id} className={`border-l-4 ${
                          item.status === 'completed' ? 'border-l-success' :
                          item.status === 'in_progress' ? 'border-l-primary' :
                          item.status === 'blocked' ? 'border-l-destructive' : 'border-l-muted'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <StatusIcon className={`w-5 h-5 mt-0.5 ${
                                  item.status === 'completed' ? 'text-success' :
                                  item.status === 'in_progress' ? 'text-primary' :
                                  item.status === 'blocked' ? 'text-destructive' : 'text-muted-foreground'
                                }`} />
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <Badge className={getStatusColor(item.status)}>
                                      {item.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                      {item.priority.toUpperCase()}
                                    </Badge>
                                    {getResponsibilityBadge(item.responsible_party)}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    <strong>Verification:</strong> {item.verification_method}
                                  </div>
                                  
                                  {item.dependencies.length > 0 && (
                                    <div className="text-xs">
                                      <strong>Dependencies:</strong> {item.dependencies.join(', ')}
                                    </div>
                                  )}
                                  
                                  {item.completion_date && (
                                    <div className="text-xs text-success">
                                      <strong>Completed:</strong> {new Date(item.completion_date).toLocaleDateString()}
                                    </div>
                                  )}
                                  
                                  {item.notes && (
                                    <div className="p-2 bg-muted rounded text-sm">
                                      <strong>Notes:</strong> {item.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                {item.status !== 'completed' && item.responsible_party !== 'vendor' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateItemStatus(item.id, 'completed')}
                                  >
                                    Mark Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CustomerPreDeploymentChecklist;