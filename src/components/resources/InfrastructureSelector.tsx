import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network, Shield, Server, Wifi, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';

export interface InfrastructureSelection {
  nac_vendors: string[];
  network: {
    wired_vendors: string[];
    wired_models: Record<string, string[]>;
    wireless_vendors: string[];
    wireless_models: Record<string, string[]>;
  };
  security: {
    firewalls: string[];
    vpn: string[];
    idp_sso: string[];
    edr: string[];
    siem: string[];
  };
  device_inventory: Array<{
    type: string;
    brand: string;
    model: string;
    quantity: number;
    location: string;
  }>;
}

interface InfrastructureSelectorProps {
  value: InfrastructureSelection;
  onChange: (selection: InfrastructureSelection) => void;
}

const InfrastructureSelector: React.FC<InfrastructureSelectorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'nac' | 'network' | 'security' | 'inventory'>('nac');
  const { data: vendors = [] } = useUnifiedVendors({});

  const updateSelection = (path: string, newValue: any) => {
    const keys = path.split('.');
    const updated = { ...value };
    let current: any = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = newValue;
    onChange(updated);
  };

  const tabs = [
    { id: 'nac', label: 'NAC Vendors', icon: Shield },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'security', label: 'Security', icon: Server },
    { id: 'inventory', label: 'Inventory', icon: Wifi }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'nac':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Network Access Control Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {vendors.filter(v => v.category?.includes('NAC')).map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      value.nac_vendors.includes(vendor.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      const updated = value.nac_vendors.includes(vendor.id)
                        ? value.nac_vendors.filter(id => id !== vendor.id)
                        : [...value.nac_vendors, vendor.id];
                      updateSelection('nac_vendors', updated);
                    }}
                  >
                    <span className="font-medium">{vendor.name}</span>
                    {value.nac_vendors.includes(vendor.id) && (
                      <Badge variant="secondary" className="ml-2">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <div className="p-8 text-center text-muted-foreground">Infrastructure selection interface</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default InfrastructureSelector;