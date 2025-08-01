import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Building2, Users, Shield, Network, Calendar, Target, CheckCircle } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { PortnoxDocumentationResult } from '@/services/PortnoxDocumentationService';
import portnoxLogo from '@/assets/portnox-logo.png';

interface PortnoxProjectReportProps {
  project: Project;
  documentation?: PortnoxDocumentationResult;
  scopingData?: any;
  className?: string;
}

export const PortnoxProjectReport: React.FC<PortnoxProjectReportProps> = ({
  project,
  documentation,
  scopingData,
  className = ""
}) => {
  const renderHeader = () => (
    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-center space-x-4">
        <img src={portnoxLogo} alt="Portnox" className="h-12" />
        <div>
          <h1 className="text-2xl font-bold text-primary">Portnox NAC Deployment Report</h1>
          <p className="text-muted-foreground">Comprehensive Project Documentation</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-muted-foreground">Generated on</div>
        <div className="font-semibold">{format(new Date(), 'MMMM dd, yyyy')}</div>
      </div>
    </div>
  );

  const renderProjectOverview = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Client</div>
                <div className="font-medium">{project.client_name || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Industry</div>
                <div className="font-medium">{project.industry || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phase</div>
                <Badge variant="secondary">{project.current_phase}</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{project.total_endpoints || 0}</div>
                <div className="text-sm text-muted-foreground">Endpoints</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{project.total_sites || 0}</div>
                <div className="text-sm text-muted-foreground">Sites</div>
              </div>
            </div>
            
            {project.start_date && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Timeline</div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {format(new Date(project.start_date), 'MMM dd, yyyy')}
                    {project.target_completion && (
                      <> - {format(new Date(project.target_completion), 'MMM dd, yyyy')}</>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNetworkOverview = () => {
    if (!scopingData?.network_infrastructure) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Topology</div>
              <div className="font-medium">{scopingData.network_infrastructure.topology_type || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Site Count</div>
              <div className="font-medium">{scopingData.network_infrastructure.site_count || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Authentication</div>
              <div className="font-medium">{scopingData.network_infrastructure.current_auth || 'Not specified'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderVendorDocumentation = () => {
    if (!documentation?.vendorSpecificDocs?.length) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vendor Integration Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentation.vendorSpecificDocs.map((vendor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{vendor.vendorName}</h4>
                  <Badge variant={vendor.supportLevel === 'full' ? 'default' : 'secondary'}>
                    {vendor.supportLevel}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">Type</div>
                    <div>{vendor.vendorType}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">Compatibility</div>
                    <div>{vendor.portnoxCompatibility.supportLevel}</div>
                  </div>
                </div>
                
                {vendor.configurationRequirements?.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium text-muted-foreground mb-1">Configuration Requirements</div>
                    <ul className="text-sm space-y-1">
                      {vendor.configurationRequirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-1 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDeploymentPhases = () => {
    if (!documentation?.deploymentGuide?.length) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Deployment Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentation.deploymentGuide.map((phase, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{phase.title}</h4>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                
                {phase.prerequisites?.length > 0 && (
                  <div className="mb-3">
                    <div className="font-medium text-sm mb-1">Prerequisites</div>
                    <ul className="text-sm space-y-1">
                      {phase.prerequisites.slice(0, 3).map((prereq, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {phase.steps?.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-1">Key Steps ({phase.steps.length} total)</div>
                    <div className="text-sm text-muted-foreground">
                      Steps include {phase.steps.slice(0, 2).map(step => step.title).join(', ')}
                      {phase.steps.length > 2 && ` and ${phase.steps.length - 2} more`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFooter = () => (
    <div className="border-t p-6 text-center text-sm text-muted-foreground bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <img src={portnoxLogo} alt="Portnox" className="h-6" />
          <span>Generated by Portnox Project Intelligence</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <span>© {new Date().getFullYear()} Portnox. All rights reserved.</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Report ID: {project.id.substring(0, 8)}</span>
      </div>
    </div>
  );

  return (
    <div className={`bg-background min-h-screen ${className}`}>
      {renderHeader()}
      
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {renderProjectOverview()}
        {renderNetworkOverview()}
        {renderVendorDocumentation()}
        {renderDeploymentPhases()}
        
        {project.business_summary && (
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{project.business_summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {renderFooter()}
    </div>
  );
};