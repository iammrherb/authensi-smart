import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Target, Users, Network, Shield, Database, Settings, CheckCircle,
  AlertTriangle, Info, Search, Filter, BookOpen, Wrench, Bug,
  Key, Shield as Firewall, Activity, Box as Docker, Server, Cloud, Lock,
  Eye, FileText, Download, Share2, RefreshCw, Zap, Brain
} from 'lucide-react';

interface UseCaseItem {
  id: string;
  name: string;
  category: string;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  prerequisites: string[];
  businessValue: string;
  technicalRequirements: string[];
  complianceFrameworks: string[];
  supportedVendors: string[];
  estimatedEffort: number; // weeks
  dependencies: string[];
  testScenarios: string[];
}

interface PrerequisiteItem {
  id: string;
  name: string;
  category: 'permissions' | 'infrastructure' | 'configuration' | 'integration';
  type: 'required' | 'recommended' | 'optional';
  description: string;
  validationSteps: string[];
  troubleshootingTips: string[];
  relatedComponents: string[];
  documentation: string[];
}

interface TroubleshootingItem {
  id: string;
  component: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  possibleCauses: string[];
  diagnosticSteps: string[];
  resolutionSteps: string[];
  preventionMeasures: string[];
  relatedKB: string[];
  logLocations: string[];
  requiredPermissions: string[];
}

const PlanningAndScopingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('use-cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');

  // Mock data - in real app this would come from APIs
  const useCases: UseCaseItem[] = [
    {
      id: '1',
      name: 'Zero Trust Network Access (ZTNA)',
      category: 'Security',
      complexity: 'high',
      description: 'Implement comprehensive zero-trust architecture with micro-segmentation and continuous verification.',
      prerequisites: ['Active Directory Integration', 'Certificate Infrastructure', 'Multi-Factor Authentication'],
      businessValue: 'Reduces security risks by 85% and ensures compliance with modern security frameworks.',
      technicalRequirements: ['Network segmentation capability', 'Identity provider integration', 'Policy enforcement points'],
      complianceFrameworks: ['NIST Cybersecurity Framework', 'Zero Trust Architecture', 'ISO 27001'],
      supportedVendors: ['Portnox', 'Cisco', 'Aruba', 'Fortinet'],
      estimatedEffort: 12,
      dependencies: ['Identity Management System', 'Certificate Authority', 'Network Infrastructure'],
      testScenarios: ['User authentication flow', 'Device posture assessment', 'Policy enforcement verification']
    },
    {
      id: '2',
      name: 'Guest Network Access Management',
      category: 'Access Control',
      complexity: 'medium',
      description: 'Secure guest access with automated provisioning and time-limited access controls.',
      prerequisites: ['Guest VLAN Configuration', 'Captive Portal Setup', 'Sponsor Approval Workflow'],
      businessValue: 'Improves visitor experience while maintaining security boundaries and audit compliance.',
      technicalRequirements: ['Captive portal infrastructure', 'Sponsor notification system', 'Guest VLAN isolation'],
      complianceFrameworks: ['PCI DSS', 'GDPR', 'HIPAA'],
      supportedVendors: ['Portnox', 'Cisco ISE', 'Aruba ClearPass', 'FortiNAC'],
      estimatedEffort: 6,
      dependencies: ['Wireless Infrastructure', 'Email System', 'Network Segmentation'],
      testScenarios: ['Guest registration process', 'Sponsor approval workflow', 'Access expiration handling']
    },
    {
      id: '3',
      name: 'IoT Device Lifecycle Management',
      category: 'Device Management',
      complexity: 'high',
      description: 'Comprehensive IoT device discovery, profiling, and lifecycle management with automated policy enforcement.',
      prerequisites: ['Device Discovery Protocols', 'IoT VLAN Segmentation', 'Device Profiling Database'],
      businessValue: 'Reduces IoT security incidents by 70% and provides complete visibility into connected devices.',
      technicalRequirements: ['Device fingerprinting', 'Automated profiling', 'Policy orchestration'],
      complianceFrameworks: ['IEC 62443', 'NIST IoT Security', 'ISO 27002'],
      supportedVendors: ['Portnox', 'Forescout', 'Armis', 'Claroty'],
      estimatedEffort: 16,
      dependencies: ['Network Discovery Tools', 'SIEM Integration', 'Asset Management System'],
      testScenarios: ['Device discovery validation', 'Automated profiling accuracy', 'Policy enforcement verification']
    }
  ];

  const prerequisites: PrerequisiteItem[] = [
    {
      id: '1',
      name: 'Active Directory Integration Permissions',
      category: 'permissions',
      type: 'required',
      description: 'Necessary permissions for AD integration and user authentication.',
      validationSteps: [
        'Verify service account has "Log on as a service" right',
        'Confirm read access to user objects in AD',
        'Test LDAP bind operation with service account',
        'Validate group membership queries'
      ],
      troubleshootingTips: [
        'Check service account password expiration',
        'Verify domain controller connectivity',
        'Confirm LDAP port 389/636 accessibility',
        'Review security event logs for authentication failures'
      ],
      relatedComponents: ['Domain Controllers', 'LDAP Service', 'Authentication Server'],
      documentation: [
        'AD Service Account Setup Guide',
        'LDAP Integration Best Practices',
        'Troubleshooting AD Connectivity Issues'
      ]
    },
    {
      id: '2',
      name: 'Firewall Configuration for RADIUS',
      category: 'infrastructure',
      type: 'required',
      description: 'Firewall rules and network access for RADIUS authentication traffic.',
      validationSteps: [
        'Test RADIUS ports 1812/1813 connectivity',
        'Verify shared secret configuration',
        'Confirm accounting packet flow',
        'Test failover scenarios'
      ],
      troubleshootingTips: [
        'Check firewall logs for blocked RADIUS traffic',
        'Verify NAS-IP-Address configuration',
        'Confirm shared secret matches on both ends',
        'Test with radius client tools'
      ],
      relatedComponents: ['RADIUS Server', 'Network Access Servers', 'Firewall'],
      documentation: [
        'RADIUS Port Requirements',
        'Firewall Configuration Templates',
        'RADIUS Troubleshooting Guide'
      ]
    },
    {
      id: '3',
      name: 'Docker Container Security Configuration',
      category: 'configuration',
      type: 'recommended',
      description: 'Security hardening for containerized NAC components.',
      validationSteps: [
        'Verify container image signatures',
        'Check security context settings',
        'Validate network policies',
        'Confirm resource limits'
      ],
      troubleshootingTips: [
        'Review container logs for security violations',
        'Check SELinux/AppArmor policies',
        'Verify container registry connectivity',
        'Test container-to-container communication'
      ],
      relatedComponents: ['Docker Engine', 'Container Registry', 'Orchestration Platform'],
      documentation: [
        'Container Security Best Practices',
        'Docker Hardening Guide',
        'Kubernetes Security Policies'
      ]
    }
  ];

  const troubleshootingItems: TroubleshootingItem[] = [
    {
      id: '1',
      component: 'RADIUS Proxy',
      issue: 'Authentication requests timing out',
      severity: 'high',
      symptoms: [
        'Users unable to authenticate',
        'RADIUS timeout errors in logs',
        'Sporadic authentication failures',
        'High response time alerts'
      ],
      possibleCauses: [
        'Network connectivity issues',
        'Backend authentication server overload',
        'Incorrect shared secret configuration',
        'DNS resolution problems'
      ],
      diagnosticSteps: [
        'Check RADIUS server logs (/var/log/radius/)',
        'Test network connectivity: ping backend-auth-server',
        'Verify shared secret: cat /etc/raddb/clients.conf',
        'Check DNS resolution: nslookup auth-server.domain.com',
        'Monitor RADIUS packet flow: tcpdump -i any port 1812'
      ],
      resolutionSteps: [
        'Restart RADIUS proxy service: systemctl restart radiusd',
        'Update shared secret in configuration',
        'Implement connection pooling',
        'Configure RADIUS server failover',
        'Optimize backend server performance'
      ],
      preventionMeasures: [
        'Implement health checks for backend servers',
        'Set up monitoring alerts for response times',
        'Configure redundant RADIUS servers',
        'Regular performance testing'
      ],
      relatedKB: [
        'KB001: RADIUS Timeout Troubleshooting',
        'KB015: Network Connectivity Testing',
        'KB032: RADIUS Configuration Best Practices'
      ],
      logLocations: [
        '/var/log/radius/radius.log',
        '/var/log/radius/radiusd.log',
        '/var/log/syslog',
        '/var/log/auth.log'
      ],
      requiredPermissions: [
        'sudo access for service restart',
        'read access to /var/log/radius/',
        'network diagnostic tools access'
      ]
    },
    {
      id: '2',
      component: 'SIEM Integration',
      issue: 'Log forwarding failures',
      severity: 'medium',
      symptoms: [
        'Missing security events in SIEM',
        'Log forwarding errors',
        'Incomplete audit trails',
        'SIEM connector offline status'
      ],
      possibleCauses: [
        'SIEM connector configuration error',
        'Network connectivity to SIEM server',
        'Log format incompatibility',
        'Authentication failures to SIEM API'
      ],
      diagnosticSteps: [
        'Check SIEM connector status: systemctl status siem-connector',
        'Review connector logs: tail -f /var/log/siem-connector.log',
        'Test SIEM API connectivity: curl -k https://siem-server/api/health',
        'Verify log format: cat /var/log/nac/events.json | head -5',
        'Check authentication: grep "auth" /var/log/siem-connector.log'
      ],
      resolutionSteps: [
        'Restart SIEM connector: systemctl restart siem-connector',
        'Update SIEM API credentials',
        'Adjust log format configuration',
        'Implement retry logic for failed sends',
        'Configure alternative SIEM endpoints'
      ],
      preventionMeasures: [
        'Set up SIEM connector health monitoring',
        'Implement log buffering for outages',
        'Regular API credential rotation',
        'Automated configuration validation'
      ],
      relatedKB: [
        'KB008: SIEM Integration Guide',
        'KB021: Log Format Specifications',
        'KB045: API Authentication Troubleshooting'
      ],
      logLocations: [
        '/var/log/siem-connector.log',
        '/var/log/nac/events.json',
        '/var/log/syslog'
      ],
      requiredPermissions: [
        'systemctl access for connector management',
        'read access to log directories',
        'SIEM API access credentials'
      ]
    },
    {
      id: '3',
      component: 'AD Broker Container',
      issue: 'Container startup failures',
      severity: 'critical',
      symptoms: [
        'Container exits immediately after start',
        'Authentication unavailable',
        'AD integration offline',
        'Container restart loops'
      ],
      possibleCauses: [
        'Insufficient container resources',
        'Missing environment variables',
        'AD connectivity issues',
        'Container image corruption'
      ],
      diagnosticSteps: [
        'Check container logs: docker logs ad-broker-container',
        'Verify resource allocation: docker stats ad-broker-container',
        'Test AD connectivity: docker exec ad-broker-container ldapsearch -H ldap://dc.domain.com',
        'Check environment variables: docker inspect ad-broker-container | grep -A 20 Env',
        'Validate image integrity: docker image inspect ad-broker:latest'
      ],
      resolutionSteps: [
        'Increase container memory/CPU limits',
        'Set required environment variables',
        'Update AD server configurations',
        'Pull fresh container image',
        'Implement container health checks'
      ],
      preventionMeasures: [
        'Set up container monitoring',
        'Implement automated health checks',
        'Use container image scanning',
        'Regular backup of working configurations'
      ],
      relatedKB: [
        'KB012: Container Troubleshooting Guide',
        'KB028: AD Broker Configuration',
        'KB041: Docker Resource Management'
      ],
      logLocations: [
        'docker logs ad-broker-container',
        '/var/log/docker.log',
        'container internal logs: /app/logs/'
      ],
      requiredPermissions: [
        'docker command access',
        'container exec permissions',
        'access to docker logs'
      ]
    }
  ];

  const filteredUseCases = useCases.filter(useCase => {
    const matchesSearch = useCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         useCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || useCase.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || useCase.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const filteredPrerequisites = prerequisites.filter(prereq => 
    prereq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prereq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTroubleshooting = troubleshootingItems.filter(item =>
    item.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'hsl(var(--chart-1))';
      case 'medium': return 'hsl(var(--chart-3))';
      case 'high': return 'hsl(var(--chart-4))';
      case 'critical': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'hsl(var(--chart-1))';
      case 'medium': return 'hsl(var(--chart-3))';
      case 'high': return 'hsl(var(--chart-4))';
      case 'critical': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎯 Planning & Scoping Hub
        </motion.h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive resource library with use cases, prerequisites, and troubleshooting guides for successful NAC deployments
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search use cases, prerequisites, or troubleshooting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Access Control">Access Control</SelectItem>
              <SelectItem value="Device Management">Device Management</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3">
          <TabsTrigger value="use-cases" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Use Cases Library
          </TabsTrigger>
          <TabsTrigger value="prerequisites" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Prerequisites & Setup
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Troubleshooting Guide
          </TabsTrigger>
        </TabsList>

        {/* Use Cases Tab */}
        <TabsContent value="use-cases" className="space-y-6">
          <div className="grid gap-6">
            {filteredUseCases.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {useCase.name}
                          <Badge variant="secondary">{useCase.category}</Badge>
                        </CardTitle>
                        <p className="text-muted-foreground">{useCase.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: getComplexityColor(useCase.complexity) }}
                        >
                          {useCase.complexity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {useCase.estimatedEffort}w effort
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4" />
                            Business Value
                          </h4>
                          <p className="text-sm text-muted-foreground">{useCase.businessValue}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            Prerequisites
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {useCase.prerequisites.map((prereq, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Network className="h-4 w-4" />
                            Technical Requirements
                          </h4>
                          <ul className="text-sm space-y-1">
                            {useCase.technicalRequirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-primary rounded-full"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4" />
                            Compliance Frameworks
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {useCase.complianceFrameworks.map((framework, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {framework}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4" />
                            Supported Vendors
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {useCase.supportedVendors.map((vendor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {vendor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4" />
                            Test Scenarios
                          </h4>
                          <ul className="text-sm space-y-1">
                            {useCase.testScenarios.map((scenario, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-primary rounded-full"></div>
                                {scenario}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Prerequisites Tab */}
        <TabsContent value="prerequisites" className="space-y-6">
          <div className="grid gap-6">
            {filteredPrerequisites.map((prereq, index) => (
              <motion.div
                key={prereq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {prereq.category === 'permissions' && <Key className="h-5 w-5" />}
                          {prereq.category === 'infrastructure' && <Server className="h-5 w-5" />}
                          {prereq.category === 'configuration' && <Settings className="h-5 w-5" />}
                          {prereq.category === 'integration' && <Cloud className="h-5 w-5" />}
                          {prereq.name}
                        </CardTitle>
                        <p className="text-muted-foreground">{prereq.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={prereq.type === 'required' ? 'destructive' : prereq.type === 'recommended' ? 'default' : 'secondary'}>
                          {prereq.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{prereq.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <CheckCircle className="h-4 w-4" />
                            Validation Steps
                          </h4>
                          <ol className="text-sm space-y-2">
                            {prereq.validationSteps.map((step, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Network className="h-4 w-4" />
                            Related Components
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {prereq.relatedComponents.map((component, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Wrench className="h-4 w-4" />
                            Troubleshooting Tips
                          </h4>
                          <ul className="text-sm space-y-2">
                            {prereq.troubleshootingTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 mt-1 text-amber-500 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4" />
                            Documentation
                          </h4>
                          <ul className="text-sm space-y-1">
                            {prereq.documentation.map((doc, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                                <FileText className="h-3 w-3" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting" className="space-y-6">
          <div className="grid gap-6">
            {filteredTroubleshooting.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {item.component === 'RADIUS Proxy' && <Server className="h-5 w-5" />}
                          {item.component === 'SIEM Integration' && <Eye className="h-5 w-5" />}
                          {item.component === 'AD Broker Container' && <Docker className="h-5 w-5" />}
                          {item.component}
                        </CardTitle>
                        <p className="text-muted-foreground font-medium">{item.issue}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        style={{ backgroundColor: getSeverityColor(item.severity) }}
                      >
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="symptoms" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                        <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                        <TabsTrigger value="resolution">Resolution</TabsTrigger>
                        <TabsTrigger value="prevention">Prevention</TabsTrigger>
                        <TabsTrigger value="references">References</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="symptoms" className="space-y-3">
                        <h4 className="font-semibold">Observed Symptoms</h4>
                        <ul className="space-y-2">
                          {item.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                              <span className="text-sm">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="diagnosis" className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Possible Causes</h4>
                          <ul className="space-y-1">
                            {item.possibleCauses.map((cause, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="h-1 w-1 bg-primary rounded-full mt-2"></div>
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Diagnostic Commands</h4>
                          <div className="space-y-2">
                            {item.diagnosticSteps.map((step, idx) => (
                              <div key={idx} className="bg-muted p-3 rounded-lg">
                                <code className="text-sm font-mono">{step}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resolution" className="space-y-3">
                        <h4 className="font-semibold">Resolution Steps</h4>
                        <ol className="space-y-3">
                          {item.resolutionSteps.map((step, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </TabsContent>
                      
                      <TabsContent value="prevention" className="space-y-3">
                        <h4 className="font-semibold">Prevention Measures</h4>
                        <ul className="space-y-2">
                          {item.preventionMeasures.map((measure, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Shield className="h-4 w-4 mt-0.5 text-green-500" />
                              <span className="text-sm">{measure}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="references" className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Log Locations</h4>
                          <div className="space-y-1">
                            {item.logLocations.map((location, idx) => (
                              <div key={idx} className="bg-muted p-2 rounded text-sm font-mono">
                                {location}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Required Permissions</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.requiredPermissions.map((permission, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Related Knowledge Base</h4>
                          <ul className="space-y-1">
                            {item.relatedKB.map((kb, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                                <BookOpen className="h-3 w-3" />
                                {kb}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PlanningAndScopingHub;