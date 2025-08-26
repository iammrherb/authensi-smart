import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  enterpriseReportGenerator, 
  EnterpriseReport, 
  ReportGenerationRequest 
} from '@/services/reports/EnterpriseReportGenerator';
import { supabase } from '@/integrations/supabase/client';

export const useEnterpriseReports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate new report
  const generateReportMutation = useMutation({
    mutationFn: (request: ReportGenerationRequest) => 
      enterpriseReportGenerator.generateReport(request),
    onSuccess: (report) => {
      toast({
        title: "Report Generated Successfully",
        description: `${report.title} has been generated and is ready for review.`,
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-reports'] });
      queryClient.invalidateQueries({ queryKey: ['project-reports', report.projectId] });
    },
    onError: (error: any) => {
      toast({
        title: "Report Generation Failed",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get reports for a specific project
  const useProjectReports = (projectId: string) => {
    return useQuery<EnterpriseReport[]>({
      queryKey: ['project-reports', projectId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('enterprise_reports')
          .select('*')
          .eq('project_id', projectId)
          .order('generated_at', { ascending: false });

        if (error) throw error;
        return data as EnterpriseReport[];
      },
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get all reports
  const useAllReports = () => {
    return useQuery<EnterpriseReport[]>({
      queryKey: ['enterprise-reports'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('enterprise_reports')
          .select('*')
          .order('generated_at', { ascending: false });

        if (error) throw error;
        return data as EnterpriseReport[];
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get single report
  const useReport = (reportId: string) => {
    return useQuery<EnterpriseReport>({
      queryKey: ['enterprise-report', reportId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('enterprise_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (error) throw error;
        return data as EnterpriseReport;
      },
      enabled: !!reportId,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Update report status
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: EnterpriseReport['status'] }) => {
      const { data, error } = await supabase
        .from('enterprise_reports')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data as EnterpriseReport;
    },
    onSuccess: (report) => {
      toast({
        title: "Report Status Updated",
        description: `Report status changed to ${report.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-report', report.id] });
      queryClient.invalidateQueries({ queryKey: ['project-reports', report.projectId] });
      queryClient.invalidateQueries({ queryKey: ['enterprise-reports'] });
    },
    onError: (error: any) => {
      toast({
        title: "Status Update Failed",
        description: error.message || "Failed to update report status.",
        variant: "destructive",
      });
    },
  });

  // Delete report
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('enterprise_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      return reportId;
    },
    onSuccess: (reportId) => {
      toast({
        title: "Report Deleted",
        description: "Report has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-reports'] });
      queryClient.removeQueries({ queryKey: ['enterprise-report', reportId] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete report.",
        variant: "destructive",
      });
    },
  });

  // Export report to different formats
  const exportReportMutation = useMutation({
    mutationFn: async ({ 
      reportId, 
      format 
    }: { 
      reportId: string; 
      format: 'pdf' | 'docx' | 'html' | 'markdown' 
    }) => {
      // This would integrate with a document generation service
      // For now, we'll return the report data formatted for the requested type
      const { data: report, error } = await supabase
        .from('enterprise_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      // In a real implementation, this would call a service to generate
      // the document in the requested format
      const exportData = {
        reportId,
        format,
        content: report.content,
        metadata: report.metadata,
        exportedAt: new Date().toISOString()
      };

      return exportData;
    },
    onSuccess: (exportData) => {
      toast({
        title: "Report Exported",
        description: `Report exported successfully in ${exportData.format.toUpperCase()} format.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export report.",
        variant: "destructive",
      });
    },
  });

  return {
    // Mutations
    generateReport: generateReportMutation.mutateAsync,
    isGenerating: generateReportMutation.isPending,
    updateReportStatus: updateReportStatusMutation.mutateAsync,
    isUpdatingStatus: updateReportStatusMutation.isPending,
    deleteReport: deleteReportMutation.mutateAsync,
    isDeleting: deleteReportMutation.isPending,
    exportReport: exportReportMutation.mutateAsync,
    isExporting: exportReportMutation.isPending,

    // Query hooks
    useProjectReports,
    useAllReports,
    useReport,
  };
};

export default useEnterpriseReports;
