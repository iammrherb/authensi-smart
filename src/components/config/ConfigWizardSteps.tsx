import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import { Database, Target, Brain } from 'lucide-react';

interface ConfigWizardStepsProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (config: any) => void;
}

export const ConfigWizardSteps: React.FC<ConfigWizardStepsProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onComplete
}) => {
  const { data: vendors, isLoading: vendorsLoading } = useUnifiedVendors();
  const [config, setConfig] = useState({
    vendor: '',
    model: '',
    siteType: '',
    requirements: '',
    advanced: {
      authMethod: 'local',
      encryption: 'aes256',
      vlan: false,
      qos: false,
      autoDeploy: false,
      rollback: false,
      monitoring: false,
      notes: ''
    }
  });

  const renderBasicConfigStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Basic Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={config.vendor} onValueChange={(value) => setConfig({ ...config, vendor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorsLoading ? (
                    <SelectItem value="loading" disabled>Loading vendors...</SelectItem>
                  ) : (
                    vendors?.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Enter model number"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteType">Site Type</Label>
            <Select value={config.siteType} onValueChange={(value) => setConfig({ ...config, siteType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select site type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch">Branch Office</SelectItem>
                <SelectItem value="headquarters">Headquarters</SelectItem>
                <SelectItem value="datacenter">Data Center</SelectItem>
                <SelectItem value="retail">Retail Location</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Describe your specific requirements..."
              value={config.requirements}
              onChange={(e) => setConfig({ ...config, requirements: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvancedSettingsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authMethod">Authentication Method</Label>
                <Select 
                  value={config.advanced.authMethod} 
                  onValueChange={(value) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, authMethod: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Authentication</SelectItem>
                    <SelectItem value="radius">RADIUS</SelectItem>
                    <SelectItem value="tacacs">TACACS+</SelectItem>
                    <SelectItem value="ldap">LDAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select 
                  value={config.advanced.encryption} 
                  onValueChange={(value) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, encryption: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes128">AES-128</SelectItem>
                    <SelectItem value="aes256">AES-256</SelectItem>
                    <SelectItem value="3des">3DES</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vlan">VLAN Support</Label>
                <Switch
                  id="vlan"
                  checked={config.advanced.vlan}
                  onCheckedChange={(checked) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, vlan: checked } 
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="qos">QoS Support</Label>
                <Switch
                  id="qos"
                  checked={config.advanced.qos}
                  onCheckedChange={(checked) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, qos: checked } 
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoDeploy">Auto Deploy</Label>
                <Switch
                  id="autoDeploy"
                  checked={config.advanced.autoDeploy}
                  onCheckedChange={(checked) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, autoDeploy: checked } 
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rollback">Rollback Support</Label>
                <Switch
                  id="rollback"
                  checked={config.advanced.rollback}
                  onCheckedChange={(checked) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, rollback: checked } 
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="monitoring">Enhanced Monitoring</Label>
                <Switch
                  id="monitoring"
                  checked={config.advanced.monitoring}
                  onCheckedChange={(checked) => setConfig({ 
                    ...config, 
                    advanced: { ...config.advanced, monitoring: checked } 
                  })}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional configuration notes..."
              value={config.advanced.notes}
              onChange={(e) => setConfig({ 
                ...config, 
                advanced: { ...config.advanced, notes: e.target.value } 
              })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Vendor</Label>
              <p className="text-sm">{config.vendor || 'Not specified'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Model</Label>
              <p className="text-sm">{config.model || 'Not specified'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Site Type</Label>
              <p className="text-sm">{config.siteType || 'Not specified'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Authentication</Label>
              <p className="text-sm">{config.advanced.authMethod}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Requirements</Label>
            <p className="text-sm">{config.requirements || 'No requirements specified'}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Advanced Features</Label>
            <div className="flex flex-wrap gap-2">
              {config.advanced.vlan && <Badge variant="secondary">VLAN</Badge>}
              {config.advanced.qos && <Badge variant="secondary">QoS</Badge>}
              {config.advanced.autoDeploy && <Badge variant="secondary">Auto Deploy</Badge>}
              {config.advanced.rollback && <Badge variant="secondary">Rollback</Badge>}
              {config.advanced.monitoring && <Badge variant="secondary">Monitoring</Badge>}
            </div>
          </div>
          {config.advanced.notes && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
              <p className="text-sm">{config.advanced.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => onComplete({ ...config, format: 'cli' })}>
          Generate CLI Config
        </Button>
        <Button variant="outline" onClick={() => onComplete({ ...config, format: 'xml' })}>
          Generate XML Config
        </Button>
        <Button variant="outline" onClick={() => onComplete({ ...config, format: 'json' })}>
          Generate JSON Config
        </Button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicConfigStep();
      case 2:
        return renderAdvancedSettingsStep();
      case 3:
        return renderReviewStep();
      default:
        return renderBasicConfigStep();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {renderStep()}
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 3 ? (
          <Button onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button onClick={() => onComplete(config)}>
            Generate Configuration
          </Button>
        )}
      </div>
    </div>
  );
};
