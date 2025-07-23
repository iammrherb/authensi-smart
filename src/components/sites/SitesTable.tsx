import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Site } from "@/hooks/useSites";

interface SitesTableProps {
  sites: Site[];
  onEdit: (site: Site) => void;
  onDelete: (id: string) => void;
  onViewDetails: (site: Site) => void;
}

const SitesTable = ({ sites, onEdit, onDelete, onViewDetails }: SitesTableProps) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Devices</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow key={site.id}>
            <TableCell className="font-medium">{site.name}</TableCell>
            <TableCell>{site.location || "-"}</TableCell>
            <TableCell>
              <Badge variant="outline">{site.site_type}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={statusColors[site.status]}>{site.status}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={priorityColors[site.priority]}>{site.priority}</Badge>
            </TableCell>
            <TableCell>{site.device_count}</TableCell>
            <TableCell>{site.contact_name || "-"}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(site)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(site)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Site
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(site.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Site
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {sites.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No sites found. Create your first site to get started.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SitesTable;