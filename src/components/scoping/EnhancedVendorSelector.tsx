
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plus, X, Router, Shield, Eye, Lock, Key, Cloud, Database, Award } from "lucide-react";

interface VendorModel {
  name: string;
  series?: string;
  firmware_versions: string[];
  features: string[];
  eol_status?: 'active' | 'eol' | 'eos';
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  models: VendorModel[];
  integration_level: 'native' | 'supported' | 'limited' | 'manual';
}

interface SelectedVendor extends Vendor {
  selected_models: string[];
  selected_firmware: Record<string, string[]>;
  deployment_notes?: string;
}

interface EnhancedVendorSelectorProps {
  category: string;
  title: string;
  icon: React.ReactNode;
  vendors: Vendor[];
  selectedVendors: SelectedVendor[];
  onVendorChange: (vendors: SelectedVendor[]) => void;
  multiSelect?: boolean;
}

const EnhancedVendorSelector: React.FC<EnhancedVendorSelectorProps> = ({
  category,
  title,
  icon,
  vendors,
  selectedVendors,
  onVendorChange,
  multiSelect = true
}) => {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const handleVendorToggle = (vendor: Vendor) => {
    const isSelected = selectedVendors.some(v => v.id === vendor.id);
    
    if (isSelected) {
      onVendorChange(selectedVendors.filter(v => v.id !== vendor.id));
    } else {
      const newSelectedVendor: SelectedVendor = {
        ...vendor,
        selected_models: [],
        selected_firmware: {}
      };
      
      if (multiSelect) {
        onVendorChange([...selectedVendors, newSelectedVendor]);
      } else {
        onVendorChange([newSelectedVendor]);
      }
      setExpandedVendor(vendor.id);
    }
  };

  const handleModelToggle = (vendorId: string, modelName: string) => {
    const updatedVendors = selectedVendors.map(vendor => {
      if (vendor.id === vendorId) {
        const hasModel = vendor.selected_models.includes(modelName);
        const newModels = hasModel 
          ? vendor.selected_models.filter(m => m !== modelName)
          : [...vendor.selected_models, modelName];
        
        // Remove firmware selections for unselected models
        const newFirmware = { ...vendor.selected_firmware };
        if (hasModel) {
          delete newFirmware[modelName];
        }

        return {
          ...vendor,
          selected_models: newModels,
          selected_firmware: newFirmware
        };
      }
      return vendor;
    });
    
    onVendorChange(updatedVendors);
  };

  const handleFirmwareToggle = (vendorId: string, modelName: string, firmware: string) => {
    const updatedVendors = selectedVendors.map(vendor => {
      if (vendor.id === vendorId) {
        const currentFirmware = vendor.selected_firmware[modelName] || [];
        const hasFirmware = currentFirmware.includes(firmware);
        
        const newFirmware = {
          ...vendor.selected_firmware,
          [modelName]: hasFirmware
            ? currentFirmware.filter(f => f !== firmware)
            : [...currentFirmware, firmware]
        };

        return {
          ...vendor,
          selected_firmware: newFirmware
        };
      }
      return vendor;
    });
    
    onVendorChange(updatedVendors);
  };

  const getSelectedVendor = (vendorId: string) => {
    return selectedVendors.find(v => v.id === vendorId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map(vendor => {
          const selectedVendor = getSelectedVendor(vendor.id);
          const isSelected = !!selectedVendor;
          const isExpanded = expandedVendor === vendor.id;

          return (
            <Card key={vendor.id} className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader 
                className="cursor-pointer pb-3"
                onClick={() => handleVendorToggle(vendor)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${vendor.color} flex items-center justify-center text-white text-sm`}>
                      {vendor.icon}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{vendor.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {vendor.integration_level}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>

              {isSelected && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  
                  {vendor.models.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Select Models (Optional)</Label>
                      <div className="space-y-2">
                        {vendor.models.map(model => {
                          const isModelSelected = selectedVendor?.selected_models.includes(model.name) || false;
                          
                          return (
                            <div key={model.name} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${vendor.id}-${model.name}`}
                                  checked={isModelSelected}
                                  onCheckedChange={() => handleModelToggle(vendor.id, model.name)}
                                />
                                <Label 
                                  htmlFor={`${vendor.id}-${model.name}`}
                                  className="text-sm flex items-center gap-2"
                                >
                                  {model.name}
                                  {model.series && (
                                    <Badge variant="secondary" className="text-xs">
                                      {model.series}
                                    </Badge>
                                  )}
                                  {model.eol_status && model.eol_status !== 'active' && (
                                    <Badge variant="destructive" className="text-xs">
                                      {model.eol_status.toUpperCase()}
                                    </Badge>
                                  )}
                                </Label>
                              </div>

                              {isModelSelected && model.firmware_versions.length > 0 && (
                                <div className="ml-6 space-y-2">
                                  <Label className="text-xs font-medium">Firmware Versions</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {model.firmware_versions.slice(0, 4).map(firmware => {
                                      const isFirmwareSelected = selectedVendor?.selected_firmware[model.name]?.includes(firmware) || false;
                                      
                                      return (
                                        <div key={firmware} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`${vendor.id}-${model.name}-${firmware}`}
                                            checked={isFirmwareSelected}
                                            onCheckedChange={() => handleFirmwareToggle(vendor.id, model.name, firmware)}
                                          />
                                          <Label 
                                            htmlFor={`${vendor.id}-${model.name}-${firmware}`}
                                            className="text-xs"
                                          >
                                            {firmware}
                                          </Label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label htmlFor={`notes-${vendor.id}`} className="text-sm font-medium">
                      Deployment Notes (Optional)
                    </Label>
                    <Input
                      id={`notes-${vendor.id}`}
                      placeholder="Any specific configuration notes..."
                      value={selectedVendor?.deployment_notes || ''}
                      onChange={(e) => {
                        const updatedVendors = selectedVendors.map(v => 
                          v.id === vendor.id ? { ...v, deployment_notes: e.target.value } : v
                        );
                        onVendorChange(updatedVendors);
                      }}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {selectedVendors.length > 0 && (
        <div className="mt-4 p-3 bg-accent/50 rounded-lg">
          <div className="text-sm font-medium mb-2">
            Selected {title}: {selectedVendors.length}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedVendors.map(vendor => (
              <Badge key={vendor.id} variant="secondary" className="text-xs">
                {vendor.name}
                {vendor.selected_models.length > 0 && (
                  <span className="ml-1">({vendor.selected_models.length} models)</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVendorSelector;
