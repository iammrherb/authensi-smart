import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, Network, Server, Users, Clock, CheckCircle, AlertTriangle,
  FileText, Download, Settings, Plus, Search, ExternalLink, Edit,
  Target, BookOpen, Globe, Database, Monitor, Lock, Zap
} from 'lucide-react';
import { useRequirements, useCreateRequirement } from '@/hooks/useRequirements';
import { useToast } from '@/hooks/use-toast';

interface EnhancedRequirement {
  id: string;
  title: string;
  description: string;
  category: 'network' | 'security' | 'infrastructure' | 'compliance' | 'integration' | 'operational';
  priority: 'critical' | 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  implementation_time: string;
  prerequisites: string[];
  acceptance_criteria: string[];
  portnox_specific: {
    configuration_impact: string;
    integration_requirements: string[];
    documentation_links: string[];
    validation_steps: string[];
  };
  vendor_considerations: Array<{
    vendor: string;
    specific_requirements: string[];
    compatibility_notes: string[];
  }>;
  compliance_frameworks: string[];
  business_justification: string;
  technical_details: string;
  risk_assessment: {
    implementation_risk: 'low' | 'medium' | 'high';
    business_impact: 'low' | 'medium' | 'high';
    mitigation_strategies: string[];
  };
  tags: string[];
  status: 'draft' | 'approved' | 'implemented' | 'deprecated';
  created_at: string;
  updated_at: string;
}

const EnhancedRequirementsLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [requirements, setRequirements] = useState<EnhancedRequirement[]>([]);
  
  const { data: dbRequirements = [] } = useRequirements();
  const createRequirement = useCreateRequirement();
  const { toast } = useToast();

  // Comprehensive Portnox-specific requirements library
  const portnoxRequirements: EnhancedRequirement[] = [
    {
      id: 'req-network-001',
      title: 'RADIUS Infrastructure Requirements',
      description: 'Network infrastructure must support RADIUS authentication for NAC implementation',
      category: 'network',
      priority: 'critical',
      complexity: 'moderate',
      implementation_time: '2-3 days',
      prerequisites: [
        'Network device inventory completed',
        'Administrative access to all network devices',
        'RADIUS shared secrets defined and documented',
        'Network change control approval obtained'
      ],
      acceptance_criteria: [
        'All network devices configured with RADIUS authentication',
        'RADIUS traffic (UDP 1812/1813) permitted through firewalls',
        'Backup RADIUS server configured for redundancy',
        'Authentication testing successful on all device types'
      ],
      portnox_specific: {
        configuration_impact: 'Requires RADIUS server configuration and network device updates',
        integration_requirements: [
          'Portnox CORE/CLEAR installation with RADIUS service',
          'Network device RADIUS client configuration',
          'Firewall rules for RADIUS traffic',
          'Time synchronization (NTP) between all devices'
        ],
        documentation_links: [
          'https://docs.portnox.com/topics/radius_configuration',
          'https://docs.portnox.com/topics/network_device_setup',
          'https://docs.portnox.com/topics/radius_troubleshooting'
        ],
        validation_steps: [
          'Test RADIUS authentication with test device',
          'Verify RADIUS accounting messages',
          'Test failover to backup RADIUS server',
          'Validate RADIUS shared secret security'
        ]
      },
      vendor_considerations: [
        {
          vendor: 'Cisco',
          specific_requirements: [
            'IOS version supporting 802.1X and MAB',
            'AAA configuration with RADIUS authentication',
            'RADIUS-server configuration with shared secrets'
          ],
          compatibility_notes: [
            'Requires IOS 12.2(33)SXI or later for full 802.1X support',
            'Some older catalyst switches may need firmware updates'
          ]
        },
        {
          vendor: 'Aruba',
          specific_requirements: [
            'Controller firmware supporting ClearPass integration',
            'RADIUS server configuration in controller',
            'Authentication server group setup'
          ],
          compatibility_notes: [
            'ArubaOS 8.x recommended for optimal Portnox integration',
            'Instant AP mode may have limited RADIUS capabilities'
          ]
        }
      ],
      compliance_frameworks: ['SOX', 'PCI-DSS', 'NIST', 'ISO 27001'],
      business_justification: 'Essential for network access control and security compliance',
      technical_details: 'RADIUS protocol implementation for centralized authentication and authorization',
      risk_assessment: {
        implementation_risk: 'medium',
        business_impact: 'high',
        mitigation_strategies: [
          'Implement during maintenance window',
          'Configure backup authentication methods',
          'Test thoroughly in lab environment first',
          'Have rollback procedures ready'
        ]
      },
      tags: ['radius', 'authentication', 'network', 'infrastructure', 'critical'],
      status: 'approved',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'req-security-001',
      title: 'Certificate Management Infrastructure',
      description: 'PKI infrastructure for 802.1X certificate-based authentication',
      category: 'security',
      priority: 'high',
      complexity: 'complex',
      implementation_time: '1-2 weeks',
      prerequisites: [
        'PKI team engagement and approval',
        'Certificate authority accessible and configured',
        'Certificate distribution method defined',
        'Device certificate enrollment process established'
      ],
      acceptance_criteria: [
        'Certificate authority integrated with Portnox',
        'Device certificates enrolled and distributed',
        'Certificate revocation checking functional',
        'Certificate lifecycle management procedures defined'
      ],
      portnox_specific: {
        configuration_impact: 'Requires certificate authority integration and certificate management',
        integration_requirements: [
          'CA connector configuration in Portnox',
          'SCEP or manual certificate enrollment setup',
          'Certificate validation and revocation checking',
          'Certificate-based authentication policies'
        ],
        documentation_links: [
          'https://docs.portnox.com/topics/certificate_management',
          'https://docs.portnox.com/topics/pki_integration',
          'https://docs.portnox.com/topics/802_1x_certificates'
        ],
        validation_steps: [
          'Test certificate enrollment process',
          'Verify certificate-based authentication',
          'Test certificate revocation checking',
          'Validate certificate lifecycle management'
        ]
      },
      vendor_considerations: [
        {
          vendor: 'Microsoft',
          specific_requirements: [
            'Active Directory Certificate Services setup',
            'Certificate templates for network devices',
            'NDES/SCEP service configuration'
          ],
          compatibility_notes: [
            'Windows Server 2016 or later recommended',
            'Certificate templates must allow key archival for device certificates'
          ]
        }
      ],
      compliance_frameworks: ['PCI-DSS', 'NIST', 'ISO 27001', 'FISMA'],
      business_justification: 'Strong authentication required for regulatory compliance and security',
      technical_details: 'X.509 certificate-based authentication for 802.1X EAP-TLS',
      risk_assessment: {
        implementation_risk: 'high',
        business_impact: 'medium',
        mitigation_strategies: [
          'Pilot with small group of devices first',
          'Maintain username/password fallback',
          'Implement certificate auto-enrollment',
          'Monitor certificate expiration'
        ]
      },
      tags: ['certificates', 'pki', '802.1x', 'security', 'authentication'],
      status: 'approved',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'req-integration-001',
      title: 'SIEM Integration Requirements',
      description: 'Security event correlation and monitoring through SIEM integration',
      category: 'integration',
      priority: 'high',
      complexity: 'moderate',
      implementation_time: '3-5 days',
      prerequisites: [
        'SIEM system accessible and configured',
        'Log forwarding protocols supported (Syslog, CEF, etc.)',
        'SIEM parsing rules developed for Portnox events',
        'Security team trained on Portnox event types'
      ],
      acceptance_criteria: [
        'Portnox events successfully forwarded to SIEM',
        'SIEM parsing and correlation rules functional',
        'Security event dashboards and alerting configured',
        'Incident response procedures updated'
      ],
      portnox_specific: {
        configuration_impact: 'Requires log forwarding configuration and event correlation setup',
        integration_requirements: [
          'Syslog server configuration in Portnox',
          'Event filtering and formatting rules',
          'SIEM connector or parser configuration',
          'Security event taxonomy mapping'
        ],
        documentation_links: [
          'https://docs.portnox.com/topics/siem_integration',
          'https://docs.portnox.com/topics/logging_configuration',
          'https://docs.portnox.com/topics/security_events'
        ],
        validation_steps: [
          'Test log forwarding connectivity',
          'Verify SIEM event parsing',
          'Validate security event correlation',
          'Test incident response workflows'
        ]
      },
      vendor_considerations: [
        {
          vendor: 'Splunk',
          specific_requirements: [
            'Splunk Universal Forwarder or HTTP Event Collector',
            'Portnox add-on for Splunk installed',
            'Index and sourcetype configuration'
          ],
          compatibility_notes: [
            'Portnox add-on available on Splunkbase',
            'Custom field extractions may be needed for specific use cases'
          ]
        },
        {
          vendor: 'IBM QRadar',
          specific_requirements: [
            'QRadar DSM for Portnox installed',
            'Log source configuration for Portnox events',
            'Custom properties for Portnox-specific fields'
          ],
          compatibility_notes: [
            'DSM supports CEF and Syslog formats',
            'Custom rules may be needed for advanced correlation'
          ]
        }
      ],
      compliance_frameworks: ['SOX', 'PCI-DSS', 'NIST', 'ISO 27001'],
      business_justification: 'Security monitoring and incident response capabilities',
      technical_details: 'Real-time security event forwarding and correlation for threat detection',
      risk_assessment: {
        implementation_risk: 'low',
        business_impact: 'medium',
        mitigation_strategies: [
          'Test log forwarding in non-production first',
          'Implement gradual rollout of event types',
          'Monitor SIEM storage and performance impact',
          'Create backup logging mechanisms'
        ]
      },
      tags: ['siem', 'logging', 'security', 'monitoring', 'integration'],
      status: 'approved',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'req-operational-001',
      title: 'High Availability and Disaster Recovery',
      description: 'HA/DR requirements for business continuity and system resilience',
      category: 'operational',
      priority: 'critical',
      complexity: 'complex',
      implementation_time: '1-2 weeks',
      prerequisites: [
        'Secondary data center or cloud region available',
        'Network connectivity between primary and secondary sites',
        'Shared storage or database replication configured',
        'Load balancer configuration and testing'
      ],
      acceptance_criteria: [
        'Primary and secondary Portnox systems deployed',
        'Automatic failover mechanisms functional',
        'Data synchronization between sites working',
        'Recovery time and recovery point objectives met'
      ],
      portnox_specific: {
        configuration_impact: 'Requires deployment of redundant systems and data synchronization',
        integration_requirements: [
          'Load balancer configuration for RADIUS traffic',
          'Database replication between primary and secondary',
          'Shared configuration and policy synchronization',
          'Health monitoring and automatic failover'
        ],
        documentation_links: [
          'https://docs.portnox.com/topics/high_availability',
          'https://docs.portnox.com/topics/disaster_recovery',
          'https://docs.portnox.com/topics/load_balancing'
        ],
        validation_steps: [
          'Test automatic failover scenarios',
          'Verify data synchronization integrity',
          'Validate recovery time objectives',
          'Test manual failback procedures'
        ]
      },
      vendor_considerations: [
        {
          vendor: 'VMware',
          specific_requirements: [
            'vSphere HA and DRS configuration',
            'Shared storage for VM mobility',
            'Site Recovery Manager for DR orchestration'
          ],
          compatibility_notes: [
            'Requires Enterprise Plus licensing for advanced features',
            'Network stretched across sites or L2 extension needed'
          ]
        }
      ],
      compliance_frameworks: ['SOX', 'PCI-DSS', 'NIST', 'ISO 27001'],
      business_justification: 'Business continuity and regulatory compliance requirements',
      technical_details: 'Active-passive or active-active HA deployment with geographic redundancy',
      risk_assessment: {
        implementation_risk: 'high',
        business_impact: 'critical',
        mitigation_strategies: [
          'Extensive testing in lab environment',
          'Phased implementation with rollback plans',
          'Regular DR testing and validation',
          'Comprehensive documentation and procedures'
        ]
      },
      tags: ['high-availability', 'disaster-recovery', 'business-continuity', 'operational'],
      status: 'approved',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Combine database requirements with enhanced Portnox requirements
    const combinedRequirements = [
      ...portnoxRequirements,
      ...dbRequirements.map(req => ({
        ...req,
        complexity: 'moderate' as const,
        implementation_time: '1-2 weeks',
        prerequisites: [],
        acceptance_criteria: [],
        business_justification: 'Standard business requirement',
        technical_details: 'Technical implementation details to be determined',
        portnox_specific: {
          configuration_impact: 'General requirement - specific Portnox impact to be determined',
          integration_requirements: [],
          documentation_links: [],
          validation_steps: []
        },
        vendor_considerations: [],
        compliance_frameworks: [],
        risk_assessment: {
          implementation_risk: 'medium' as const,
          business_impact: 'medium' as const,
          mitigation_strategies: []
        },
        tags: [],
        status: 'draft' as const
      }))
    ];
    setRequirements(combinedRequirements);
  }, [dbRequirements]);

  const categories = ['all', 'network', 'security', 'infrastructure', 'compliance', 'integration', 'operational'];
  const priorities = ['all', 'critical', 'high', 'medium', 'low'];

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive';
      case 'high': return 'bg-warning/10 text-warning';
      case 'medium': return 'bg-primary/10 text-primary';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'simple': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'moderate': return <Clock className="h-4 w-4 text-warning" />;
      case 'complex': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const exportRequirements = () => {
    const exportData = {
      export_metadata: {
        generated_at: new Date().toISOString(),
        total_requirements: filteredRequirements.length,
        filters_applied: { category: selectedCategory, priority: selectedPriority, search: searchQuery }
      },
      requirements: filteredRequirements,
      portnox_integration_summary: {
        total_portnox_specific: filteredRequirements.filter(r => r.id.startsWith('req-')).length,
        critical_requirements: filteredRequirements.filter(r => r.priority === 'critical').length,
        vendor_integrations: [...new Set(filteredRequirements.flatMap(r => r.vendor_considerations.map(v => v.vendor)))],
        compliance_frameworks: [...new Set(filteredRequirements.flatMap(r => r.compliance_frameworks))]
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portnox-requirements-library-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Requirements Exported",
      description: `Exported ${filteredRequirements.length} requirements with Portnox-specific details`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Requirements Library</h2>
          <p className="text-muted-foreground">
            Comprehensive Portnox deployment requirements with vendor-specific considerations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportRequirements}>
            <Download className="h-4 w-4 mr-2" />
            Export Requirements
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
                <DialogDescription>
                  Create a comprehensive requirement with Portnox-specific considerations
                </DialogDescription>
              </DialogHeader>
              {/* Add requirement form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground mt-3" />
          <Input
            placeholder="Search requirements, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRequirements.map(requirement => (
          <Card key={requirement.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {requirement.title}
                    {getComplexityIcon(requirement.complexity)}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs ${getPriorityColor(requirement.priority)}`}>
                      {requirement.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {requirement.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {requirement.implementation_time}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {requirement.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{requirement.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="portnox">Portnox</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Prerequisites
                      </h4>
                      <ul className="text-sm space-y-1">
                        {requirement.prerequisites.map((prereq, i) => (
                          <li key={i}>• {prereq}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Acceptance Criteria
                      </h4>
                      <ul className="text-sm space-y-1">
                        {requirement.acceptance_criteria.map((criteria, i) => (
                          <li key={i}>• {criteria}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Business Justification</h4>
                    <p className="text-sm text-muted-foreground">{requirement.business_justification}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {requirement.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="portnox" className="space-y-4">
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      {requirement.portnox_specific.configuration_impact}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Integration Requirements</h4>
                      <ul className="text-sm space-y-1">
                        {requirement.portnox_specific.integration_requirements.map((req, i) => (
                          <li key={i}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Validation Steps</h4>
                      <ul className="text-sm space-y-1">
                        {requirement.portnox_specific.validation_steps.map((step, i) => (
                          <li key={i}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {requirement.portnox_specific.documentation_links.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Documentation Links
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {requirement.portnox_specific.documentation_links.map((link, i) => (
                          <Button key={i} variant="outline" size="sm" asChild>
                            <a href={link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.split('/').pop()?.replace(/_/g, ' ') || 'Documentation'}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="vendors" className="space-y-4">
                  {requirement.vendor_considerations.map((vendor, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{vendor.vendor}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <h5 className="font-medium text-sm mb-1">Specific Requirements:</h5>
                          <ul className="text-sm space-y-1">
                            {vendor.specific_requirements.map((req, j) => (
                              <li key={j}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-1">Compatibility Notes:</h5>
                          <ul className="text-sm space-y-1">
                            {vendor.compatibility_notes.map((note, j) => (
                              <li key={j}>• {note}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {requirement.vendor_considerations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No vendor-specific considerations documented.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="compliance" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Applicable Compliance Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {requirement.compliance_frameworks.map((framework, i) => (
                        <Badge key={i} variant="secondary">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {requirement.compliance_frameworks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No specific compliance frameworks identified.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="font-medium">Implementation Risk</div>
                      <Badge className={`mt-1 ${getPriorityColor(requirement.risk_assessment.implementation_risk)}`}>
                        {requirement.risk_assessment.implementation_risk}
                      </Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="font-medium">Business Impact</div>
                      <Badge className={`mt-1 ${getPriorityColor(requirement.risk_assessment.business_impact)}`}>
                        {requirement.risk_assessment.business_impact}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                    <ul className="text-sm space-y-1">
                      {requirement.risk_assessment.mitigation_strategies.map((strategy, i) => (
                        <li key={i}>• {strategy}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRequirements.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Requirements Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or add new requirements to the library.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedRequirementsLibrary;