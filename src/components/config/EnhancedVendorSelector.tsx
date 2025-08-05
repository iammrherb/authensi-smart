import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Info, Zap, Shield, Network, Cloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  comprehensiveVendorData, 
  getVendorById, 
  getModelsByVendor, 
  getModelById,
  type ComprehensiveVendor,
  type VendorModel 
} from "@/data/comprehensiveVendorData";

interface EnhancedVendorSelectorProps {
  selectedVendor: string;
  selectedModel: string;
  selectedFirmware: string;
  onVendorChange: (vendor: string) => void;
  onModelChange: (model: string) => void;
  onFirmwareChange: (firmware: string) => void;
  showDetails?: boolean;
  compact?: boolean;
  filterByCategory?: string;
}

const EnhancedVendorSelector: React.FC<EnhancedVendorSelectorProps> = ({
  selectedVendor,
  selectedModel,
  selectedFirmware,
  onVendorChange,
  onModelChange, 
  onFirmwareChange,
  showDetails = true,
  compact = false,
  filterByCategory
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableModels, setAvailableModels] = useState<VendorModel[]>([]);
  const [availableFirmware, setAvailableFirmware] = useState<string[]>([]);

  // Filter vendors based on search and category
  const filteredVendors = comprehensiveVendorData.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterByCategory || vendor.category === filterByCategory;
    return matchesSearch && matchesCategory;
  });

  // Update available models when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      const models = getModelsByVendor(selectedVendor);
      setAvailableModels(models);
      
      // Reset model and firmware if current selections are not available
      if (selectedModel && !models.find(m => m.id === selectedModel)) {
        onModelChange("");
        onFirmwareChange("");
      }
    } else {
      setAvailableModels([]);
      onModelChange("");
      onFirmwareChange("");
    }
  }, [selectedVendor]);

  // Update available firmware when model changes
  useEffect(() => {
    if (selectedVendor && selectedModel) {
      const model = getModelById(selectedVendor, selectedModel);
      const firmware = model?.firmwareVersions || [];
      setAvailableFirmware(firmware);
      
      // Reset firmware if current selection is not available
      if (selectedFirmware && !firmware.includes(selectedFirmware)) {
        onFirmwareChange("");
      }
    } else {
      setAvailableFirmware([]);
      onFirmwareChange("");
    }
  }, [selectedVendor, selectedModel]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NAC Primary': return <Shield className="h-4 w-4" />;
      case 'Enterprise': return <Network className="h-4 w-4" />;
      case 'Wireless-First': return <Zap className="h-4 w-4" />;
      case 'Cloud Identity': return <Cloud className="h-4 w-4" />;
      case 'Performance': return <Zap className="h-4 w-4" />;
      case 'Data Center': return <Network className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'limited': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const selectedVendorData = getVendorById(selectedVendor);
  const selectedModelData = selectedVendor && selectedModel ? getModelById(selectedVendor, selectedModel) : null;

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Vendor</Label>
          <Select value={selectedVendor} onValueChange={onVendorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {filteredVendors.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  <div className="flex items-center gap-2">
                    <span>{vendor.icon}</span>
                    {vendor.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model {!selectedVendor && <span className="text-muted-foreground">(Select vendor first)</span>}</Label>
          <Select value={selectedModel} onValueChange={onModelChange} disabled={!selectedVendor}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.series} • {model.ports}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Firmware {!selectedModel && <span className="text-muted-foreground">(Select model first)</span>}</Label>
          <Select value={selectedFirmware} onValueChange={onFirmwareChange} disabled={!selectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select firmware" />
            </SelectTrigger>
            <SelectContent>
              {availableFirmware.map(firmware => (
                <SelectItem key={firmware} value={firmware}>
                  {firmware}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Vendor Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Select Primary Vendor</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVendors.map(vendor => (
              <Card
                key={vendor.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedVendor === vendor.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                }`}
                onClick={() => onVendorChange(vendor.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${vendor.color} flex items-center justify-center text-white text-lg`}>
                      {vendor.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{vendor.name}</h4>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(vendor.category)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{vendor.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{vendor.category}</Badge>
                        <Badge className={`text-xs ${getSupportLevelColor(vendor.supportLevel)}`}>
                          {vendor.supportLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Model Selection */}
      {selectedVendor && (
        <>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Select Model 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({availableModels.length} models available)
              </span>
            </Label>
            <ScrollArea className="h-64">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableModels.map(model => (
                  <Card
                    key={model.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedModel === model.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => onModelChange(model.id)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{model.name}</h5>
                          <Badge variant="outline" className="text-xs">{model.category}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>{model.series} Series</div>
                          {model.ports && <div>{model.ports}</div>}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {model.poe && <Badge variant="secondary" className="text-xs">PoE+</Badge>}
                          {model.stackable && <Badge variant="secondary" className="text-xs">Stackable</Badge>}
                          {model.capabilities.slice(0, 2).map(cap => (
                            <Badge key={cap} variant="outline" className="text-xs">{cap}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Firmware Selection */}
      {selectedModel && (
        <>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Firmware Version</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableFirmware.map(firmware => (
                <Card
                  key={firmware}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFirmware === firmware
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => onFirmwareChange(firmware)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="font-mono text-sm">{firmware}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Selection Summary */}
      {showDetails && selectedVendor && (
        <>
          <Separator />
          <Card className="bg-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium">Vendor</div>
                  <div className="text-sm text-muted-foreground">{selectedVendorData?.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedVendorData?.description}</div>
                </div>
                {selectedModelData && (
                  <div>
                    <div className="text-sm font-medium">Model</div>
                    <div className="text-sm text-muted-foreground">{selectedModelData.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedModelData.ports}</div>
                  </div>
                )}
                {selectedFirmware && (
                  <div>
                    <div className="text-sm font-medium">Firmware</div>
                    <div className="text-sm text-muted-foreground font-mono">{selectedFirmware}</div>
                  </div>
                )}
              </div>
              
              {selectedModelData && (
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Supported Features</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedModelData.capabilities.map(capability => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedVendorData && (
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Common Platform Features</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedVendorData.commonFeatures.map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EnhancedVendorSelector;