import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useDeviceTypes } from '@/hooks/useDeviceTypes';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';

export type InfrastructureSelection = {
  nac_vendors: string[];
  network: {
    wired_vendors: string[];
    wired_models: Record<string, string[]>; // vendor_id -> model_ids
    wireless_vendors: string[];
    wireless_models: Record<string, string[]>; // vendor_id -> model_ids
  };
  security: {
    firewalls: string[];
    vpn: string[];
    idp_sso: string[];
    edr: string[];
    siem: string[];
  };
  device_inventory: Array<{ device_type_id: string; name: string; count: number }>;
};

interface InfrastructureSelectorProps {
  value: InfrastructureSelection;
  onChange: (val: InfrastructureSelection) => void;
  sections?: {
    nac?: boolean;
    network?: boolean;
    security?: boolean;
    devices?: boolean;
  };
}

const matchCategory = (text?: string, kw?: string) =>
  (text || '').toLowerCase().includes((kw || '').toLowerCase());

const InfrastructureSelector: React.FC<InfrastructureSelectorProps> = ({ value, onChange, sections }) => {
  const { data: vendors = [] } = useEnhancedVendors();
  const { data: allModels = [] } = useVendorModels();
  const { data: deviceTypes = [] } = useDeviceTypes();
  const queryClient = useQueryClient();

  const effectiveSections = { nac: true, network: true, security: true, devices: true, ...(sections || {}) };

  const toggleId = (arr: string[], id: string) => arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id];

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['enhanced-vendors'] });
    queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
    queryClient.invalidateQueries({ queryKey: ['device-types'] });
  };

  const vendorModelsMap = allModels.reduce<Record<string, { id: string; model_name: string }[]>>((acc, m: any) => {
    if (!acc[m.vendor_id]) acc[m.vendor_id] = [];
    acc[m.vendor_id].push({ id: m.id, model_name: m.model_name });
    return acc;
  }, {});

  const renderVendorGrid = (filter: (v: any) => boolean, selected: string[], setSelected: (ids: string[]) => void, withModels = false, modelsMapKey: 'wired_models' | 'wireless_models' | null = null) => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {vendors.filter(filter).map(v => (
          <Card key={v.id} className={`cursor-pointer ${selected.includes(v.id) ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelected(toggleId(selected, v.id))}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{v.vendor_name}</span>
                <Badge variant="outline">{v.category || v.vendor_type}</Badge>
              </CardTitle>
            </CardHeader>
            {withModels && selected.includes(v.id) && (
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground mb-2">Models</div>
                <ScrollArea className="h-28 pr-2">
                  <div className="space-y-2">
                    {(vendorModelsMap[v.id] || []).map(m => {
                      const current = value.network[modelsMapKey as 'wired_models' | 'wireless_models'][v.id] || [];
                      const checked = current.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => {
                              const copy = { ...value };
                              const existing = copy.network[modelsMapKey as 'wired_models' | 'wireless_models'][v.id] || [];
                              copy.network[modelsMapKey as 'wired_models' | 'wireless_models'][v.id] = checked
                                ? existing.filter(id => id !== m.id)
                                : [...existing, m.id];
                              onChange(copy);
                            }}
                          />
                          <span>{m.model_name}</span>
                        </label>
                      );
                    })}
                    {(!vendorModelsMap[v.id] || vendorModelsMap[v.id].length === 0) && (
                      <div className="text-xs text-muted-foreground">No models found</div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Infrastructure Selection</h4>
        <Button type="button" variant="outline" size="sm" onClick={refreshAll} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      <Separator />

      {effectiveSections.nac && (
        <section className="space-y-3">
          <h5 className="font-medium">NAC Vendors (multi-select)</h5>
          {renderVendorGrid(
            v => matchCategory(v.category, 'nac') || matchCategory(v.vendor_type, 'nac'),
            value.nac_vendors,
            ids => onChange({ ...value, nac_vendors: ids })
          )}
        </section>
      )}

      {effectiveSections.network && (
        <section className="space-y-4">
          <h5 className="font-medium">Network Infrastructure</h5>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-2">Wired Vendors</div>
              {renderVendorGrid(
                v => matchCategory(v.category, 'wired') || matchCategory(v.vendor_type, 'switch') || matchCategory(v.category, 'switch'),
                value.network.wired_vendors,
                ids => onChange({ ...value, network: { ...value.network, wired_vendors: ids } }),
                true,
                'wired_models'
              )}
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Wireless Vendors</div>
              {renderVendorGrid(
                v => matchCategory(v.category, 'wireless') || matchCategory(v.vendor_type, 'wireless') || matchCategory(v.category, 'ap'),
                value.network.wireless_vendors,
                ids => onChange({ ...value, network: { ...value.network, wireless_vendors: ids } }),
                true,
                'wireless_models'
              )}
            </div>
          </div>
        </section>
      )}

      {effectiveSections.security && (
        <section className="space-y-4">
          <h5 className="font-medium">Security Infrastructure</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['Firewalls', 'firewall'],
              ['VPN', 'vpn'],
              ['IDP / SSO', 'idp'],
              ['EDR', 'edr'],
              ['SIEM', 'siem'],
            ] as const).map(([label, key]) => (
              <Card key={key}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-32 pr-2">
                    <div className="space-y-2">
                      {vendors
                        .filter(v => matchCategory(v.category, key) || matchCategory(v.vendor_type, key))
                        .map(v => {
                          const selected = (value.security as any)[key].includes(v.id);
                          return (
                            <label key={v.id} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() => {
                                  const copy = { ...value } as any;
                                  copy.security[key] = toggleId(copy.security[key], v.id);
                                  onChange(copy);
                                }}
                              />
                              <span>{v.vendor_name}</span>
                            </label>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {effectiveSections.devices && (
        <section className="space-y-3">
          <h5 className="font-medium">Device Inventory</h5>
          <div className="space-y-2">
            {deviceTypes.map(dt => {
              const existing = value.device_inventory.find(d => d.device_type_id === dt.id);
              return (
                <div key={dt.id} className="flex items-center gap-3 p-2 rounded border">
                  <Checkbox
                    checked={!!existing}
                    onCheckedChange={(checked) => {
                      const copy = { ...value };
                      if (checked) {
                        if (!existing) copy.device_inventory.push({ device_type_id: dt.id, name: dt.device_name, count: 1 });
                      } else {
                        copy.device_inventory = copy.device_inventory.filter(d => d.device_type_id !== dt.id);
                      }
                      onChange(copy);
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{dt.device_name}</div>
                    <div className="text-xs text-muted-foreground">{dt.category}</div>
                  </div>
                  {existing && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Count</Label>
                      <Input
                        type="number"
                        min={0}
                        className="w-24 h-8"
                        value={existing.count}
                        onChange={(e) => {
                          const val = parseInt(e.target.value || '0', 10);
                          const copy = { ...value };
                          copy.device_inventory = copy.device_inventory.map(d => d.device_type_id === dt.id ? { ...d, count: val } : d);
                          onChange(copy);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default InfrastructureSelector;
