import { supabase } from '@/integrations/supabase/client';

export interface StoredReport {
  id: string;
  title: string;
  type: string;
  content: string;
  analytics: any;
  generatedAt: string;
  createdBy: string;
  tags: string[];
  metadata: {
    projectCount: number;
    siteCount: number;
    reportSize: number;
    exportFormats: string[];
  };
}

class ReportStorageService {
  private readonly LOCAL_STORAGE_KEY = 'enterprise_reports';
  private readonly MAX_LOCAL_REPORTS = 50;

  // Save report to local storage
  async saveReportLocally(report: Omit<StoredReport, 'id'>): Promise<string> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const storedReport: StoredReport = {
        ...report,
        id: reportId
      };

      const existingReports = this.getLocalReports();
      const updatedReports = [storedReport, ...existingReports.slice(0, this.MAX_LOCAL_REPORTS - 1)];
      
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
      return reportId;
    } catch (error) {
      console.error('Error saving report locally:', error);
      throw new Error('Failed to save report locally');
    }
  }

  // Save report to Supabase (cloud storage) - fallback to local for now
  async saveReportToCloud(report: Omit<StoredReport, 'id'>): Promise<string> {
    try {
      // For now, fallback to local storage since stored_reports table doesn't exist
      return this.saveReportLocally(report);
    } catch (error) {
      console.error('Error saving report to cloud:', error);
      return this.saveReportLocally(report);
    }
  }

  // Get local reports
  getLocalReports(): StoredReport[] {
    try {
      const reports = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return reports ? JSON.parse(reports) : [];
    } catch (error) {
      console.error('Error reading local reports:', error);
      return [];
    }
  }

  // Get cloud reports - fallback to empty array for now
  async getCloudReports(): Promise<StoredReport[]> {
    try {
      // For now, return empty array since stored_reports table doesn't exist
      return [];
    } catch (error) {
      console.error('Error fetching cloud reports:', error);
      return [];
    }
  }

  // Get all reports (cloud + local)
  async getAllReports(): Promise<StoredReport[]> {
    const [cloudReports, localReports] = await Promise.all([
      this.getCloudReports(),
      Promise.resolve(this.getLocalReports())
    ]);

    // Merge and deduplicate
    const allReports = [...cloudReports, ...localReports];
    const uniqueReports = allReports.filter((report, index, self) => 
      index === self.findIndex(r => r.id === report.id)
    );

    return uniqueReports.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    // Delete from local storage only for now
    const localReports = this.getLocalReports();
    const filteredReports = localReports.filter(r => r.id !== reportId);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(filteredReports));
  }

  // Export report stats
  getStorageStats(): {
    localCount: number;
    localSize: string;
    cloudCount: number;
    totalReports: number;
  } {
    const localReports = this.getLocalReports();
    const localSize = new Blob([localStorage.getItem(this.LOCAL_STORAGE_KEY) || '']).size;
    
    return {
      localCount: localReports.length,
      localSize: this.formatBytes(localSize),
      cloudCount: 0, // Will be updated async
      totalReports: localReports.length
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const reportStorage = new ReportStorageService();