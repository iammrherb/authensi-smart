import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, User, Phone, Mail, Network, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Site } from "@/hooks/useSites";

interface SiteCardProps {
  site: Site;
  onEdit: (site: Site) => void;
  onDelete: (id: string) => void;
  onViewDetails: (site: Site) => void;
}

const SiteCard = ({ site, onEdit, onDelete, onViewDetails }: SiteCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{site.name}</CardTitle>
            {site.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {site.location}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(site)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(site)}>
                Edit Site
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(site.id)}
                className="text-destructive"
              >
                Delete Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={statusColors[site.status]}>
            {site.status}
          </Badge>
          <Badge variant={priorityColors[site.priority]}>
            {site.priority} priority
          </Badge>
          <Badge variant="outline">
            {site.site_type}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Network className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{site.network_segments} segments</span>
          </div>
          <div className="flex items-center">
            <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{site.device_count} devices</span>
          </div>
        </div>

        {(site.contact_name || site.contact_email || site.contact_phone) && (
          <div className="border-t pt-3 space-y-1">
            {site.contact_name && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{site.contact_name}</span>
              </div>
            )}
            {site.contact_email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{site.contact_email}</span>
              </div>
            )}
            {site.contact_phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{site.contact_phone}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(site)}>
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(site)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteCard;