import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Network, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import existing site creation components
import EnhancedSiteCreationWizard from '@/components/sites/EnhancedSiteCreationWizard';
import SiteForm from '@/components/sites/SiteForm';
import BulkSiteCreator from '@/components/sites/BulkSiteCreator';

interface UnifiedSiteCreationWizardProps {
  projectId?: string;
  onComplete?: (siteId: string) => void;
  onCancel?: () => void;
  mode?: 'enhanced' | 'standard' | 'bulk';
}

const UnifiedSiteCreationWizard: React.FC<UnifiedSiteCreationWizardProps> = ({
  projectId,
  onComplete,
  onCancel,
  mode = 'enhanced'
}) => {
  const [activeMode, setActiveMode] = useState(mode);
  const { toast } = useToast();

  const creationModes = [
    {
      key: 'enhanced',
      title: 'Enhanced Site Creation',
      description: 'Comprehensive site setup with detailed configuration',
      icon: <Building2 className="h-5 w-5" />,
      color: 'text-blue-500'
    },
    {
      key: 'standard',
      title: 'Standard Site Creation',
      description: 'Quick site setup with essential information',
      icon: <MapPin className="h-5 w-5" />,
      color: 'text-green-500'
    },
    {
      key: 'bulk',
      title: 'Bulk Site Creation',
      description: 'Create multiple sites from CSV or templates',
      icon: <Network className="h-5 w-5" />,
      color: 'text-purple-500'
    }
  ];

  const handleSiteCreate = (siteData: any) => {
    toast({
      title: "Site Created Successfully",
      description: `Site "${siteData.name || 'New Site'}" has been created.`
    });
    if (onComplete) {
      onComplete(siteData.id || 'new-site-id');
    }
  };

  const renderCreationForm = () => {
    switch (activeMode) {
      case 'enhanced':
        return (
          <EnhancedSiteCreationWizard
            projectId={projectId}
            onComplete={handleSiteCreate}
            onCancel={onCancel}
          />
        );
      case 'standard':
        return (
          <SiteForm
            isOpen={true}
            onClose={onCancel || (() => {})}
            onSubmit={handleSiteCreate}
          />
        );
      case 'bulk':
        return (
          <BulkSiteCreator
            isOpen={true}
            onClose={onCancel || (() => {})}
            onSubmit={(sites) => handleSiteCreate(sites[0])}
            projectId={projectId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30">
        <CardHeader>
          <div className="text-center space-y-4">
            <Badge variant="glow" className="mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Unified Site Creation
            </Badge>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              Create Site(s)
            </CardTitle>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred method to create sites for your NAC deployment project.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Choose Creation Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creationModes.map((option) => (
              <Card 
                key={option.key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeMode === option.key ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveMode(option.key as any)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${option.color}`}>
                      {option.icon}
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  {activeMode === option.key && (
                    <Badge variant="secondary" className="w-full justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Creation Form */}
      <div className="space-y-6">
        {renderCreationForm()}
      </div>
    </div>
  );
};

export default UnifiedSiteCreationWizard;