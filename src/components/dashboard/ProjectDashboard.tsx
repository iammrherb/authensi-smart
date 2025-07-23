
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";
import { useSites } from "@/hooks/useSites";
import { useQuestionnaires } from "@/hooks/useQuestionnaires";
import { demoProjects, demoAnalytics } from "@/hooks/useDemoData";
import { TrendingUp, TrendingDown, Users, Building, FileText, Target } from "lucide-react";
import { useMemo } from "react";

const ProjectDashboard = () => {
  const { data: projects } = useProjects();
  const { data: sites } = useSites();
  const { data: questionnaires } = useQuestionnaires();

  const stats = useMemo(() => {
    const activeProjects = projects?.filter(p => ['planning', 'scoping', 'designing', 'implementing'].includes(p.status)).length || 0;
    const completedProjects = projects?.filter(p => p.status === 'deployed').length || 0;
    const totalSites = sites?.length || 0;
    const completedQuestionnaires = questionnaires?.filter(q => q.status === 'completed').length || 0;
    const totalQuestionnaires = questionnaires?.length || 0;
    
    const completionRate = totalQuestionnaires > 0 ? Math.round((completedQuestionnaires / totalQuestionnaires) * 100) : 0;
    
    return [
      { 
        label: "Active Projects", 
        value: activeProjects.toString(), 
        change: activeProjects > 5 ? "+2" : "0", 
        trend: activeProjects > 5 ? "up" : "neutral",
        icon: Target,
        color: "text-blue-600"
      },
      { 
        label: "Total Sites", 
        value: totalSites.toString(), 
        change: totalSites > 3 ? "+1" : "0", 
        trend: totalSites > 3 ? "up" : "neutral",
        icon: Building,
        color: "text-green-600"
      },
      { 
        label: "Questionnaire Completion", 
        value: `${completionRate}%`, 
        change: completionRate > 80 ? "+5%" : "0%", 
        trend: completionRate > 80 ? "up" : "neutral",
        icon: FileText,
        color: "text-purple-600"
      },
      { 
        label: "Deployed Projects", 
        value: completedProjects.toString(), 
        change: completedProjects > 0 ? "+1" : "0", 
        trend: completedProjects > 0 ? "up" : "neutral",
        icon: Users,
        color: "text-orange-600"
      },
    ];
  }, [projects, sites, questionnaires]);

  const recentProjects = useMemo(() => {
    return projects?.slice(0, 5) || [];
  }, [projects]);

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                  <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="flex items-center space-x-1">
                    {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                    {stat.trend === "down" && <TrendingDown className="h-3 w-3" />}
                    <span>{stat.change}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.client_name}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        project.status === 'deployed' ? 'default' :
                        project.status === 'implementing' ? 'secondary' : 'outline'
                      }>
                        {project.status}
                      </Badge>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={project.progress_percentage} className="w-16" />
                        <span className="text-xs text-muted-foreground">
                          {project.progress_percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No projects found. Create your first project to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questionnaire Status</CardTitle>
          </CardHeader>
          <CardContent>
            {questionnaires && questionnaires.length > 0 ? (
              <div className="space-y-4">
                {questionnaires.slice(0, 5).map((questionnaire) => (
                  <div key={questionnaire.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <div className="font-medium">{questionnaire.sites?.name}</div>
                      <div className="text-sm text-muted-foreground">{questionnaire.sites?.location}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        questionnaire.status === 'completed' ? 'default' :
                        questionnaire.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {questionnaire.status}
                      </Badge>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={questionnaire.completion_percentage} className="w-16" />
                        <span className="text-xs text-muted-foreground">
                          {questionnaire.completion_percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No questionnaires found. Create your first questionnaire to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
