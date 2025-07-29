import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";
import ComprehensiveReports from "@/components/reports/ComprehensiveReports";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <ComprehensiveReports />
        </div>
      </div>
    </div>
  );
};

export default Reports;