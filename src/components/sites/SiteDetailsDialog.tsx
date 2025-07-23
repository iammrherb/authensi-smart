import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Phone, Mail, Network, Monitor, Calendar, Building } from "lucide-react";
import { Site } from "@/hooks/useSites";

interface SiteDetailsDialogProps {
  site: Site | null;
  isOpen: boolean;
  onClose: () => void;
}

const SiteDetailsDialog = ({ site, isOpen, onClose }: SiteDetailsDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{site.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
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

          <Separator />

          {/* Location Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Location Details</h3>
            <div className="grid grid-cols-1 gap-3">
              {site.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{site.location}</span>
                </div>
              )}
              {site.address && (
                <div className="flex items-start">
                  <Building className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                  <span>{site.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Network Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Network Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Network className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{site.network_segments} Network Segments</span>
              </div>
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{site.device_count} Devices</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          {(site.contact_name || site.contact_email || site.contact_phone) && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="space-y-2">
                  {site.contact_name && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{site.contact_name}</span>
                    </div>
                  )}
                  {site.contact_email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`mailto:${site.contact_email}`} className="text-primary hover:underline">
                        {site.contact_email}
                      </a>
                    </div>
                  )}
                  {site.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <a href={`tel:${site.contact_phone}`} className="text-primary hover:underline">
                        {site.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Timeline</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3" />
                <span>Created: {new Date(site.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3" />
                <span>Last Updated: {new Date(site.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteDetailsDialog;