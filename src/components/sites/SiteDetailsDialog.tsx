import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, User, Phone, Mail, Network, Monitor, Calendar, Building, 
  Shield, Wifi, Router, Server, Database, Globe, Clock, 
  Target, CheckCircle, AlertCircle, TrendingUp, Users, Zap, 
  Edit, BookOpen, UserPlus, Settings, FileText, BarChart3
} from "lucide-react";
import { Site } from "@/hooks/useSites";
import { Link } from "react-router-dom";

interface SiteDetailsDialogProps {
  site: Site | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (site: Site) => void;
}

const SiteDetailsDialog = ({ site, isOpen, onClose, onEdit }: SiteDetailsDialogProps) => {
  if (!site) return null;

  const statusColors = {
    planning: "outline",
    scoping: "secondary",
    designing: "secondary",
    implementing: "default",
    testing: "secondary",
    deployed: "default",
    maintenance: "outline"
  } as const;

  const priorityColors = {
    low: "outline",
    medium: "secondary",
    high: "secondary",
    critical: "destructive"
  } as const;

  const deploymentConfig = site.deployment_config || {};
  const networkConfig = deploymentConfig.network || {};
  const securityConfig = deploymentConfig.security || {};
  const deviceTypes = deploymentConfig.device_types || {};
  const userTypes = deploymentConfig.user_types || {};

  const calculateDeviceTotal = () => {
    return Object.values(deviceTypes).reduce((sum: number, count: any) => sum + (count || 0), 0);
  };

  const calculateUserTotal = () => {
    return Object.values(userTypes).reduce((sum: number, count: any) => sum + (count || 0), 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Building className="h-6 w-6" />
                {site.name}
              </DialogTitle>
              <DialogDescription>
                Comprehensive site analysis, network infrastructure details, deployment configuration, and implementation status.
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(site)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Site
                </Button>
              )}
              <Link to={`/questionnaires?site=${site.id}`}>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Scoping
                </Button>
              </Link>
              <Link to={`/tracker?site=${site.id}`}>
                <Button variant="default" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Implementation Workbook
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overview */}
          <div className="lg:col-span-1 space-y-4">
            {/* Status Cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Site Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusColors[site.status]} className="text-sm">
                    {site.status}
                  </Badge>
                  <Badge variant={priorityColors[site.priority]} className="text-sm">
                    {site.priority} priority
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {site.site_type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{site.progress_percentage}%</span>
                  </div>
                  <Progress value={site.progress_percentage} className="h-2" />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Current Phase: <span className="font-medium text-foreground">{site.current_phase}</span>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {site.location && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>{site.location}</span>
                  </div>
                )}
                {site.address && (
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                    <span className="text-sm">{site.address}</span>
                  </div>
                )}
                {(site.region || site.country) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{site.region}{site.region && site.country && ", "}{site.country}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(site.contact_name || site.contact_email || site.contact_phone) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Site Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {site.contact_name && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="font-medium">{site.contact_name}</span>
                    </div>
                  )}
                  {site.contact_email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`mailto:${site.contact_email}`} className="text-primary hover:underline text-sm">
                        {site.contact_email}
                      </a>
                    </div>
                  )}
                  {site.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`tel:${site.contact_phone}`} className="text-primary hover:underline text-sm">
                        {site.contact_phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Technical Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Network Infrastructure */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">NETWORK SEGMENTS</h4>
                    <div className="flex items-center">
                      <Network className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-2xl font-bold">{site.network_segments}</span>
                      <span className="text-sm text-muted-foreground ml-2">segments</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">TOTAL DEVICES</h4>
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-2xl font-bold">{site.device_count || calculateDeviceTotal()}</span>
                      <span className="text-sm text-muted-foreground ml-2">devices</span>
                    </div>
                  </div>
                </div>

                {/* Network Vendors */}
                {(networkConfig.wired_vendors?.length > 0 || networkConfig.wireless_vendors?.length > 0) && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">NETWORK VENDORS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {networkConfig.wired_vendors?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Router className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Wired</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {networkConfig.wired_vendors.map((vendor: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">{vendor}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {networkConfig.wireless_vendors?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Wifi className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Wireless</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {networkConfig.wireless_vendors.map((vendor: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">{vendor}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Configuration */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(securityConfig).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                      return (
                        <div key={key} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                          <span className="text-xs capitalize">{key.replace(/_/g, ' ')}</span>
                          {value ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Site Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to={`/questionnaires?site=${site.id}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Scoping Questionnaire
                    </Button>
                  </Link>
                  
                  <Link to={`/tracker?site=${site.id}`} className="block">
                    <Button variant="default" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Implementation Workbook
                    </Button>
                  </Link>
                  
                  <Link to={`/deployment?site=${site.id}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Deployment Planner
                    </Button>
                  </Link>
                  
                  <Link to={`/reports?site=${site.id}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Progress Reports
                    </Button>
                  </Link>
                  
                  <Link to={`/users?site=${site.id}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Team
                    </Button>
                  </Link>
                  
                  <Link to={`/vendors?site=${site.id}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Vendors
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Device & User Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(deviceTypes).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Device Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(deviceTypes).map(([type, count]) => (
                      (count as number) > 0 && (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                          <Badge variant="secondary" className="text-xs">{count as number}</Badge>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              )}

              {Object.keys(userTypes).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(userTypes).map(([type, count]) => (
                      (count as number) > 0 && (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                          <Badge variant="secondary" className="text-xs">{count as number}</Badge>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-muted-foreground">{new Date(site.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div className="text-muted-foreground">{new Date(site.updated_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                {(site.timeline_start || site.timeline_end) && (
                  <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                    {site.timeline_start && (
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">Project Start</div>
                          <div className="text-muted-foreground">{new Date(site.timeline_start).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                    {site.timeline_end && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Target Completion</div>
                          <div className="text-muted-foreground">{new Date(site.timeline_end).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteDetailsDialog;