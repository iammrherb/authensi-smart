import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TableExportStatus {
  name: string;
  status: 'pending' | 'exporting' | 'completed' | 'error';
  recordCount?: number;
  error?: string;
}

const DATABASE_TABLES = [
  'ai_analysis_sessions',
  'ai_context_patterns', 
  'ai_context_sessions',
  'ai_conversation_history',
  'ai_optimization_history',
  'ai_providers',
  'ai_usage_analytics',
  'ai_user_preferences',
  'authentication_methods',
  'authentication_workflows',
  'bulk_site_templates',
  'business_domains',
  'catalog_categories',
  'catalog_items',
  'compliance_frameworks',
  'config_generation_sessions',
  'config_template_categories',
  'config_wizard_steps',
  'configuration_files',
  'configuration_templates',
  'countries_regions',
  'custom_roles',
  'customer_analytics',
  'customer_implementation_tracking',
  'customer_portal_activity',
  'customer_portal_sessions',
  'customer_team_members',
  'customer_users',
  'deployment_types',
  'device_types',
  'profiles',
  'user_roles',
  'projects',
  'sites',
  'requirements_library',
  'use_cases_library',
  'vendor_library',
  'vendor_models',
  'scoping_sessions',
  'project_templates',
  'user_activity_log',
  'security_audit_log',
  'system_settings',
  'user_sessions',
  'pain_points_library'
];

export const DatabaseExporter: React.FC = () => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [tableStatuses, setTableStatuses] = useState<TableExportStatus[]>([]);
  const { toast } = useToast();

  const handleSelectAll = () => {
    if (selectedTables.length === DATABASE_TABLES.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables([...DATABASE_TABLES]);
    }
  };

  const handleTableSelect = (tableName: string, checked: boolean) => {
    if (checked) {
      setSelectedTables(prev => [...prev, tableName]);
    } else {
      setSelectedTables(prev => prev.filter(t => t !== tableName));
    }
  };

  const exportTableData = async (tableName: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error exporting ${tableName}:`, error);
      throw error;
    }
  };

  const handleExport = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Tables Selected",
        description: "Please select at least one table to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    
    const initialStatuses: TableExportStatus[] = selectedTables.map(table => ({
      name: table,
      status: 'pending'
    }));
    setTableStatuses(initialStatuses);

    const exportData: Record<string, any[]> = {};
    const metadata = {
      exportDate: new Date().toISOString(),
      exportedBy: (await supabase.auth.getUser()).data.user?.email || 'Unknown',
      totalTables: selectedTables.length,
      tableStatuses: {} as Record<string, { recordCount: number; status: string }>
    };

    for (let i = 0; i < selectedTables.length; i++) {
      const tableName = selectedTables[i];
      
      setTableStatuses(prev => prev.map(status => 
        status.name === tableName 
          ? { ...status, status: 'exporting' }
          : status
      ));

      try {
        const data = await exportTableData(tableName);
        exportData[tableName] = data;
        
        setTableStatuses(prev => prev.map(status => 
          status.name === tableName 
            ? { ...status, status: 'completed', recordCount: data.length }
            : status
        ));

        metadata.tableStatuses[tableName] = {
          recordCount: data.length,
          status: 'completed'
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        setTableStatuses(prev => prev.map(status => 
          status.name === tableName 
            ? { ...status, status: 'error', error: errorMessage }
            : status
        ));

        metadata.tableStatuses[tableName] = {
          recordCount: 0,
          status: 'error'
        };
      }

      setExportProgress(((i + 1) / selectedTables.length) * 100);
    }

    // Create complete export package
    const completeExport = {
      metadata,
      data: exportData
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(completeExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supabase-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    
    const completedTables = tableStatuses.filter(t => t.status === 'completed').length;
    const errorTables = tableStatuses.filter(t => t.status === 'error').length;
    
    toast({
      title: "Export Complete",
      description: `Successfully exported ${completedTables} tables${errorTables > 0 ? ` (${errorTables} failed)` : ''}.`,
      variant: completedTables > 0 ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: TableExportStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'exporting':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Export Tool
        </CardTitle>
        <CardDescription>
          Export data from your Supabase database tables. Select the tables you want to include in the export.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Table Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Select Tables</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTables.length === DATABASE_TABLES.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <ScrollArea className="h-64 w-full border rounded-md p-4">
            <div className="grid grid-cols-2 gap-3">
              {DATABASE_TABLES.map((table) => (
                <div key={table} className="flex items-center space-x-2">
                  <Checkbox
                    id={table}
                    checked={selectedTables.includes(table)}
                    onCheckedChange={(checked) => handleTableSelect(table, checked as boolean)}
                    disabled={isExporting}
                  />
                  <label
                    htmlFor={table}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {table}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedTables.length} of {DATABASE_TABLES.length} tables selected
            </Badge>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Export Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
            
            <ScrollArea className="h-48 w-full border rounded-md p-4">
              <div className="space-y-2">
                {tableStatuses.map((status) => (
                  <div key={status.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.status)}
                      <span className="text-sm">{status.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {status.recordCount !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {status.recordCount} records
                        </Badge>
                      )}
                      {status.error && (
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Export Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedTables.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Selected Tables'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};