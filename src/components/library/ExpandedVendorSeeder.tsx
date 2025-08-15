import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle, Database, Cpu, Wifi, Shield, Key, Eye, Lock, Smartphone } from 'lucide-react';
import { expandedVendorLibrary, getCategoryStats, getTotalVendorsCount, getTotalModelsCount } from '@/data/expandedVendorLibrary';
import { TaxonomySeederService } from '@/services/TaxonomySeederService';

interface SeedingProgress {
  phase: 'idle' | 'seeding' | 'complete' | 'error';
  progress: number;
  currentItem: string;
  completed: number;
  total: number;
}

const ExpandedVendorSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState<SeedingProgress>({
    phase: 'idle',
    progress: 0,
    currentItem: '',
    completed: 0,
    total: 0
  });
  const { toast } = useToast();

  const categoryStats = getCategoryStats();
  const totalVendors = getTotalVendorsCount();
  const totalModels = getTotalModelsCount();

  const seedExpandedVendorLibrary = async () => {
    try {
      setIsSeeding(true);
      setProgress({
        phase: 'seeding',
        progress: 10,
        currentItem: 'Preparing vendor data...',
        completed: 0,
        total: totalVendors
      });

      // Transform expanded vendor library for seeding
      const vendorData = expandedVendorLibrary.map(vendor => ({
        vendor_name: vendor.name,
        vendor_type: vendor.subcategory || vendor.category,
        category: vendor.category,
        description: vendor.description,
        support_level: vendor.supportLevel,
        portnox_compatibility: {
          level: vendor.portnoxCompatibility,
          methods: vendor.integrationMethods,
          limitations: vendor.knownLimitations || []
        },
        models: vendor.models.map(model => ({
          name: model.name,
          series: model.series,
          category: model.category,
          firmware_versions: model.firmwareVersions,
          capabilities: model.capabilities,
          ports: model.ports,
          stackable: model.stackable,
          poe: model.poe,
          throughput: model.throughput,
          max_users: model.maxUsers,
          deployment: model.deployment
        })),
        supported_protocols: [],
        integration_methods: vendor.integrationMethods,
        configuration_templates: {},
        known_limitations: vendor.knownLimitations || [],
        firmware_requirements: {},
        documentation_links: vendor.documentationLinks || [],
        status: 'active' as const
      }));

      setProgress(prev => ({
        ...prev,
        progress: 30,
        currentItem: 'Seeding vendor library...'
      }));

      // Seed the expanded vendor library
      await TaxonomySeederService.seed(['expanded_vendor_library']);

      setProgress(prev => ({
        ...prev,
        progress: 100,
        currentItem: 'Seeding complete!',
        completed: totalVendors,
        phase: 'complete'
      }));

      toast({
        title: "Success!",
        description: `Successfully seeded ${totalVendors} vendors with ${totalModels} models across all security categories.`,
      });

    } catch (error: any) {
      console.error('Error seeding expanded vendor library:', error);
      setProgress(prev => ({
        ...prev,
        phase: 'error',
        currentItem: `Error: ${error.message}`
      }));
      
      toast({
        title: "Error",
        description: "Failed to seed expanded vendor library: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'seeding':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NAC': return <Lock className="h-4 w-4" />;
      case 'Wired': return <Cpu className="h-4 w-4" />;
      case 'Wireless': return <Wifi className="h-4 w-4" />;
      case 'Firewall': return <Shield className="h-4 w-4" />;
      case 'VPN': return <Key className="h-4 w-4" />;
      case 'SIEM': return <Eye className="h-4 w-4" />;
      case 'Identity': return <Key className="h-4 w-4" />;
      case 'EDR': return <Shield className="h-4 w-4" />;
      case 'MDM': return <Smartphone className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Comprehensive Vendor Library Seeder
        </CardTitle>
        <CardDescription>
          Seed the complete vendor library with all network security categories including models and firmware versions.
          This includes NAC, Wired/Wireless, Firewalls, VPN, SIEM, Identity, EDR, and MDM vendors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Total Vendors</span>
            <Badge variant="secondary">{totalVendors}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Total Models</span>
            <Badge variant="secondary">{totalModels}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Categories</span>
            <Badge variant="secondary">{Object.keys(categoryStats).length}</Badge>
          </div>
        </div>

        {progress.phase === 'seeding' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getPhaseIcon(progress.phase)}
              <span>{progress.currentItem}</span>
            </div>
            <Progress value={progress.progress} className="w-full" />
            <div className="text-xs text-muted-foreground text-center">
              {progress.completed} of {progress.total} completed ({progress.progress}%)
            </div>
          </div>
        )}

        {progress.phase === 'complete' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Successfully seeded {totalVendors} vendors with {totalModels} models!
            </span>
          </div>
        )}

        {progress.phase === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{progress.currentItem}</span>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Categories to be seeded:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <Badge key={category} variant="outline" className="justify-between p-2">
                <div className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>
                <div className="text-xs">
                  {stats.vendors}v • {stats.models}m
                </div>
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={seedExpandedVendorLibrary}
          disabled={isSeeding}
          size="lg"
          className="w-full"
        >
          {isSeeding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Seeding Vendor Library...
            </>
          ) : progress.phase === 'complete' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Seeding Complete!
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Seed Complete Vendor Library
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpandedVendorSeeder;