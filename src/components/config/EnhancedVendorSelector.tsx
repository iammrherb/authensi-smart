import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import { 
  Network, 
  Shield, 
  Wifi, 
  Server, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface EnhancedVendorSelectorProps {
  selectedVendor: string;
  selectedModel?: string;
  selectedFirmware?: string;
  onVendorChange: (vendor: string) => void;
  onModelChange?: (model: string) => void;
  onFirmwareChange?: (firmware: string) => void;
  compact?: boolean;
  showDetails?: boolean;
}

const EnhancedVendorSelector: React.FC<EnhancedVendorSelectorProps> = ({
  selectedVendor,
  selectedModel = '',
  selectedFirmware = '',
  onVendorChange,
  onModelChange = () => {},
  onFirmwareChange = () => {},
  compact = false,
  showDetails = true
}) => {
  const { data: vendors, isLoading: vendorsLoading } = useUnifiedVendors({});
  const selectedVendorData = vendors?.find(v => v.id === selectedVendor);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'switch':
      case 'enterprise networking':
        return <Network className="h-4 w-4" />;
      case 'firewall':
      case 'network security':
      case 'next-generation firewall':
        return <Shield className="h-4 w-4" />;
      case 'wireless':
      case 'wireless-first':
        return <Wifi className="h-4 w-4" />;
      case 'cloud managed':
      case 'cloud-managed networking':
        return <Server className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getSupportLevelIcon = (level: string) => {
    switch (level) {
      case 'full':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'limited':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSupportLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'native':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'api':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'limited':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (vendorsLoading) {
    return <div className="p-4">Loading vendors...</div>;
  }

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Vendor</Label>
          <Select value={selectedVendor} onValueChange={onVendorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors?.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(vendor.category)}
                    {vendor.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedVendor && selectedVendorData?.models && Array.isArray(selectedVendorData.models) && selectedVendorData.models.length > 0 && (
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {selectedVendorData.models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">{model.series || model.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedModel && selectedVendorData?.models && Array.isArray(selectedVendorData.models) && (
          (() => {
            const model = selectedVendorData.models.find(m => m.id === selectedModel);
            return model?.firmwareVersions && Array.isArray(model.firmwareVersions) && model.firmwareVersions.length > 0 ? (
              <div className="space-y-2">
                <Label>Firmware Version</Label>
                <Select value={selectedFirmware} onValueChange={onFirmwareChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select firmware" />
                  </SelectTrigger>
                  <SelectContent>
                    {model.firmwareVersions.map((version: string, index: number) => (
                      <SelectItem key={index} value={version}>
                        <div className="flex items-center gap-2">
                          <span>{version}</span>
                          {index === 0 && <Badge variant="outline" className="text-xs">Latest</Badge>}
                          {index === 1 && <Badge variant="secondary" className="text-xs">Stable</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null;
          })()
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vendor Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Network Vendor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors?.map(vendor => (
            <Card 
              key={vendor.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedVendor === vendor.id 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:shadow-md hover:border-primary/20'
              }`}
              onClick={() => onVendorChange(vendor.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(vendor.category)}
                    <CardTitle className="text-base">{vendor.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {getSupportLevelIcon(vendor.portnoxCompatibility)}
                    <Badge className={getSupportLevelColor(vendor.portnoxCompatibility)}>
                      {vendor.portnoxCompatibility}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {vendor.category}
                </CardDescription>
              </CardHeader>
              {showDetails && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {vendor.description}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      {selectedVendor && selectedVendorData?.models && Array.isArray(selectedVendorData.models) && selectedVendorData.models.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Select Device Model</h3>
            <Badge variant="secondary">{selectedVendorData?.name}</Badge>
          </div>
          
          <ScrollArea className="h-64">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedVendorData.models.map(model => (
                <Card 
                  key={model.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id 
                      ? 'ring-2 ring-primary border-primary bg-primary/5' 
                      : 'hover:shadow-sm hover:border-primary/20'
                  }`}
                  onClick={() => onModelChange(model.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{model.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {model.series || model.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities?.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Firmware: {model.firmwareVersions?.length || 0} versions available
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Firmware Selection */}
      {selectedModel && selectedVendorData?.models && Array.isArray(selectedVendorData.models) && (
        (() => {
          const model = selectedVendorData.models.find(m => m.id === selectedModel);
          return model?.firmwareVersions && Array.isArray(model.firmwareVersions) && model.firmwareVersions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Select Firmware Version</h3>
                <Badge variant="secondary">{model.name}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {model.firmwareVersions.map((version, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedFirmware === version 
                        ? 'ring-2 ring-primary border-primary bg-primary/5' 
                        : 'hover:shadow-sm hover:border-primary/20'
                    }`}
                    onClick={() => onFirmwareChange(version)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium text-sm">{version}</span>
                        {index === 0 && <Badge className="text-xs">Latest</Badge>}
                        {index === 1 && <Badge variant="secondary" className="text-xs">Stable</Badge>}
                        {index > 1 && <Badge variant="outline" className="text-xs">Legacy</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null;
        })()
      )}

      {/* Selection Summary */}
      {selectedVendor && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Vendor</p>
                <p className="text-muted-foreground">{selectedVendorData?.name}</p>
              </div>
              {selectedModel && selectedVendorData?.models && Array.isArray(selectedVendorData.models) && (
                (() => {
                  const model = selectedVendorData.models.find(m => m.id === selectedModel);
                  return model ? (
                    <div>
                      <p className="font-medium">Model</p>
                      <p className="text-muted-foreground">{model.name}</p>
                    </div>
                  ) : null;
                })()
              )}
              {selectedFirmware && (
                <div>
                  <p className="font-medium">Firmware</p>
                  <p className="text-muted-foreground">{selectedFirmware}</p>
                </div>
              )}
            </div>
            {selectedVendorData?.description && (
              <>
                <Separator className="my-3" />
                <div>
                  <p className="font-medium text-blue-600 mb-2">ℹ️ Details</p>
                  <p className="text-xs text-muted-foreground">{selectedVendorData.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedVendorSelector;