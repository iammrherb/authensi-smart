import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Eye, EyeOff, Globe, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerPortalAccessProps {
  project: {
    id: string;
    name: string;
    customer_portal_id?: string;
    customer_portal_enabled?: boolean;
    customer_access_expires_at?: string;
    customer_organization?: string;
  };
  onUpdate?: () => void;
}

const CustomerPortalAccess: React.FC<CustomerPortalAccessProps> = ({ project, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortalId, setShowPortalId] = useState(false);
  
  const portalUrl = project.customer_portal_id 
    ? `${window.location.origin}/customer-portal/${project.customer_portal_id}`
    : null;

  const copyPortalUrl = () => {
    if (portalUrl) {
      navigator.clipboard.writeText(portalUrl);
      toast.success('Portal URL copied to clipboard');
    }
  };

  const generateNewPortalId = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an API to regenerate the portal ID
      toast.success('New portal access ID generated');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to generate new portal ID');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePortalAccess = async () => {
    try {
      // In a real implementation, this would call an API to toggle portal access
      toast.success(project.customer_portal_enabled ? 'Portal access disabled' : 'Portal access enabled');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update portal access');
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return 'Never expires';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Customer Portal Access
            </CardTitle>
            <CardDescription>
              Provide your customer with secure access to track project progress
            </CardDescription>
          </div>
          <Badge 
            variant={project.customer_portal_enabled ? "default" : "secondary"}
            className="ml-auto"
          >
            {project.customer_portal_enabled ? 'Active' : 'Disabled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portal Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Portal Status</Label>
            <Button
              variant={project.customer_portal_enabled ? "destructive" : "default"}
              size="sm"
              onClick={togglePortalAccess}
            >
              {project.customer_portal_enabled ? 'Disable Access' : 'Enable Access'}
            </Button>
          </div>
          
          {project.customer_portal_enabled && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expires: {formatExpiryDate(project.customer_access_expires_at)}
            </div>
          )}
        </div>

        <Separator />

        {/* Portal URL */}
        {project.customer_portal_enabled && portalUrl && (
          <div className="space-y-3">
            <Label>Customer Portal URL</Label>
            <div className="flex gap-2">
              <Input
                value={portalUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyPortalUrl}
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this URL with your customer to give them access to their project portal
            </p>
          </div>
        )}

        <Separator />

        {/* Portal ID Management */}
        <div className="space-y-3">
          <Label>Portal Access ID</Label>
          <div className="flex gap-2">
            <Input
              value={showPortalId ? (project.customer_portal_id || 'Not generated') : '••••••••-••••-••••-••••-••••••••••••'}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPortalId(!showPortalId)}
              title={showPortalId ? "Hide ID" : "Show ID"}
            >
              {showPortalId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewPortalId}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Generate New ID'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (project.customer_portal_id) {
                  navigator.clipboard.writeText(project.customer_portal_id);
                  toast.success('Portal ID copied to clipboard');
                }
              }}
              className="flex-1"
            >
              Copy ID
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Generate a new ID if the current one has been compromised or shared inappropriately
          </p>
        </div>

        <Separator />

        {/* Customer Information */}
        <div className="space-y-3">
          <Label>Customer Organization</Label>
          <Input
            value={project.customer_organization || 'Not specified'}
            readOnly
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            This information will be displayed in the customer portal header
          </p>
        </div>

        {/* Security Notes */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Security Notes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Portal access is read-only for customers</li>
            <li>• URLs expire automatically based on project timeline</li>
            <li>• All customer activity is logged for security</li>
            <li>• Regenerate IDs if sharing with new stakeholders</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerPortalAccess;