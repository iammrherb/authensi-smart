import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, AlertTriangle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface EnforcementSettings {
  global_required: boolean;
  role_requirements: Record<string, boolean>;
  grace_period_days: number;
  force_setup_on_next_login: boolean;
}

const TwoFactorEnforcementSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current 2FA enforcement settings
  const { data: enforcementSettings, isLoading } = useQuery({
    queryKey: ['2fa-enforcement-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', '2fa_enforcement')
        .single();
      
      if (error) throw error;
      return data.setting_value as unknown as EnforcementSettings;
    }
  });

  // Update enforcement settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: EnforcementSettings) => {
      const { data, error } = await supabase.rpc('update_2fa_enforcement' as any, {
        p_settings: newSettings
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "2FA enforcement settings have been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['2fa-enforcement-settings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update 2FA enforcement settings",
        variant: "destructive"
      });
    }
  });

  const handleSettingsUpdate = (updates: Partial<EnforcementSettings>) => {
    if (!enforcementSettings) return;
    
    const newSettings: EnforcementSettings = {
      ...enforcementSettings,
      ...updates
    };
    updateSettingsMutation.mutate(newSettings);
  };

  const handleRoleRequirementChange = (role: string, required: boolean) => {
    if (!enforcementSettings) return;
    const newRoleRequirements = {
      ...enforcementSettings.role_requirements,
      [role]: required
    };
    
    handleSettingsUpdate({
      role_requirements: newRoleRequirements
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const roles = [
    { key: 'super_admin', label: 'Super Admin', color: 'destructive' },
    { key: 'product_manager', label: 'Product Manager', color: 'default' },
    { key: 'sales_engineer', label: 'Sales Engineer', color: 'secondary' },
    { key: 'technical_account_manager', label: 'Technical Account Manager', color: 'secondary' },
    { key: 'project_creator', label: 'Project Creator', color: 'outline' },
    { key: 'viewer', label: 'Viewer', color: 'outline' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>2FA Enforcement Policies</CardTitle>
              <CardDescription>
                Configure two-factor authentication requirements for your organization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Global 2FA Requirement */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Global 2FA Requirement</Label>
                <p className="text-sm text-muted-foreground">
                  Require all users to enable two-factor authentication
                </p>
              </div>
              <Switch
                checked={enforcementSettings?.global_required || false}
                onCheckedChange={(checked) => handleSettingsUpdate({ global_required: checked })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            
            {enforcementSettings?.global_required && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Global 2FA Enabled
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      All users will be required to set up 2FA. Existing users without 2FA will be prompted on their next login.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role-based Requirements */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Role-based Requirements</Label>
              <p className="text-sm text-muted-foreground">
                Require 2FA for specific user roles
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div key={role.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Badge variant={role.color as any} className="mb-1">
                        {role.label}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={enforcementSettings?.role_requirements?.[role.key] || false}
                    onCheckedChange={(checked) => handleRoleRequirementChange(role.key, checked)}
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Grace Period */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Grace Period</Label>
              <p className="text-sm text-muted-foreground">
                Number of days users have to set up 2FA after enforcement
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                min="0"
                max="30"
                value={enforcementSettings?.grace_period_days || 7}
                onChange={(e) => handleSettingsUpdate({ grace_period_days: parseInt(e.target.value) })}
                className="w-20"
                disabled={updateSettingsMutation.isPending}
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>

          {/* Force Setup on Next Login */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Force Setup on Next Login</Label>
                <p className="text-sm text-muted-foreground">
                  Force users to set up 2FA immediately on their next login
                </p>
              </div>
              <Switch
                checked={enforcementSettings?.force_setup_on_next_login || false}
                onCheckedChange={(checked) => handleSettingsUpdate({ force_setup_on_next_login: checked })}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>

          {updateSettingsMutation.isPending && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Updating settings...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorEnforcementSettings;