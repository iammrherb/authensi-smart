import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useSites } from "@/hooks/useSites";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  Upload,
  Moon,
  Sun,
  Palette
} from "lucide-react";

interface Site {
  id: string;
  name: string;
  location: string;
  status: 'planned' | 'in-progress' | 'complete' | 'delayed';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  planned_start: string;
  planned_completion: string;
  actual_completion?: string;
  tech_owners: string[];
  project_managers: string[];
  notes: string;
  checklist_completed: number;
  checklist_total: number;
}

const DeploymentPlanner = () => {
  const [activeTab, setActiveTab] = useState("master-list");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [customerLogo, setCustomerLogo] = useState("");
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockSites: Site[] = [
      {
        id: "1",
        name: "Corporate Headquarters",
        location: "New York, NY",
        status: "complete",
        progress: 100,
        priority: "high",
        planned_start: "2024-01-15",
        planned_completion: "2024-03-15",
        actual_completion: "2024-03-10",
        tech_owners: ["John Smith", "Sarah Johnson"],
        project_managers: ["Mike Wilson"],
        notes: "Primary deployment completed successfully ahead of schedule.",
        checklist_completed: 45,
        checklist_total: 45
      },
      {
        id: "2",
        name: "Regional Office - West",
        location: "Los Angeles, CA",
        status: "in-progress",
        progress: 75,
        priority: "high",
        planned_start: "2024-02-01",
        planned_completion: "2024-04-01",
        tech_owners: ["David Brown", "Lisa Chen"],
        project_managers: ["Amy Rodriguez"],
        notes: "Phase 3 deployment in progress. Some minor delays due to hardware procurement.",
        checklist_completed: 32,
        checklist_total: 45
      },
      {
        id: "3",
        name: "Manufacturing Plant A",
        location: "Detroit, MI",
        status: "planned",
        progress: 0,
        priority: "medium",
        planned_start: "2024-05-01",
        planned_completion: "2024-07-01",
        tech_owners: ["Robert Taylor"],
        project_managers: ["Jennifer Lee"],
        notes: "Awaiting final budget approval and resource allocation.",
        checklist_completed: 0,
        checklist_total: 45
      },
      {
        id: "4",
        name: "Data Center - East",
        location: "Atlanta, GA",
        status: "delayed",
        progress: 45,
        priority: "high",
        planned_start: "2024-01-20",
        planned_completion: "2024-03-20",
        tech_owners: ["Kevin Zhang", "Maria Garcia"],
        project_managers: ["Tom Anderson"],
        notes: "Delayed due to network infrastructure upgrades required before NAC deployment.",
        checklist_completed: 18,
        checklist_total: 45
      }
    ];
    setSites(mockSites);
  }, []);

  // Theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Filter sites based on search and filters
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || site.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const stats = {
    total: sites.length,
    complete: sites.filter(s => s.status === 'complete').length,
    inProgress: sites.filter(s => s.status === 'in-progress').length,
    planned: sites.filter(s => s.status === 'planned').length,
    delayed: sites.filter(s => s.status === 'delayed').length,
  };

  const overallProgress = sites.length > 0 
    ? Math.round(sites.reduce((acc, site) => acc + site.progress, 0) / sites.length)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Calendar className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'in-progress': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-700 border-green-500/30';
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomerLogo(e.target?.result as string);
        toast.success("Logo updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-gradient-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" 
                  alt="Portnox Logo" 
                  className="h-12 filter brightness-0 invert"
                />
                <div className="h-8 w-px bg-white/30"></div>
                {customerLogo && (
                  <img 
                    src={customerLogo} 
                    alt="Customer Logo" 
                    className="h-12 max-w-[150px] object-contain filter brightness-0 invert"
                  />
                )}
              </div>
              <h1 className="text-xl font-semibold text-white">Master Site Deployment Plan</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Upload className="w-4 h-4 mr-2" />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  Change Logo
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </Button>
              
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Sun className="w-4 h-4 text-white" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="w-4 h-4 text-white" />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowThemeOptions(!showThemeOptions)}
              >
                <Palette className="w-4 h-4 mr-2" />
                Customize
              </Button>
              
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sites</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                  <p className="text-2xl font-bold text-green-500">{stats.complete}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Planned</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.planned}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-red-500">{stats.delayed}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Overall Deployment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="master-list" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Master Site List
            </TabsTrigger>
            <TabsTrigger value="site-workbook" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Site Workbook
            </TabsTrigger>
            <TabsTrigger value="rollout-progress" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Rollout Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="master-list" className="space-y-6">
            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Search sites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[150px] bg-background/50">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={() => setIsAddingSite(true)}>
                    Add Site
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSites.map((site) => (
                <Card key={site.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-elevated transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(site.status)}>
                          {getStatusIcon(site.status)}
                          {site.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(site.priority)}>
                          {site.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{site.progress}%</span>
                      </div>
                      <Progress value={site.progress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Checklist</span>
                        <span>{site.checklist_completed}/{site.checklist_total}</span>
                      </div>
                      <Progress 
                        value={(site.checklist_completed / site.checklist_total) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Start: {new Date(site.planned_start).toLocaleDateString()}</p>
                      <p>Target: {new Date(site.planned_completion).toLocaleDateString()}</p>
                      {site.actual_completion && (
                        <p>Completed: {new Date(site.actual_completion).toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">PM:</span>
                      {site.project_managers.map((pm, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pm}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedSite(site)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="site-workbook">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Site Workbook</h3>
                <p className="text-muted-foreground">
                  Detailed configuration and implementation templates for each site deployment.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rollout-progress">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Rollout Progress</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and progress visualization for the entire deployment program.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Site Details Dialog */}
      {selectedSite && (
        <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {selectedSite.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedSite.location}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedSite.status)}>
                    {getStatusIcon(selectedSite.status)}
                    {selectedSite.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={getPriorityColor(selectedSite.priority)}>
                    {selectedSite.priority} priority
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Project Managers</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSite.project_managers.map((pm, index) => (
                      <Badge key={index} variant="outline">
                        {pm}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Technical Owners</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSite.tech_owners.map((owner, index) => (
                      <Badge key={index} variant="outline">
                        {owner}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Overall Progress</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{selectedSite.progress}%</span>
                    </div>
                    <Progress value={selectedSite.progress} className="h-3" />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Implementation Checklist</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completed Items</span>
                      <span>{selectedSite.checklist_completed}/{selectedSite.checklist_total}</span>
                    </div>
                    <Progress 
                      value={(selectedSite.checklist_completed / selectedSite.checklist_total) * 100} 
                      className="h-3" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Timeline</Label>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    <p>Planned Start: {new Date(selectedSite.planned_start).toLocaleDateString()}</p>
                    <p>Target Completion: {new Date(selectedSite.planned_completion).toLocaleDateString()}</p>
                    {selectedSite.actual_completion && (
                      <p>Actual Completion: {new Date(selectedSite.actual_completion).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedSite.notes}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeploymentPlanner;