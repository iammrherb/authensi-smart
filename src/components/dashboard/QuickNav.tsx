import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Lightbulb, 
  Sparkles, 
  Target, 
  Zap, 
  Rocket, 
  BarChart3, 
  BookOpen, 
  Building2, 
  FileText,
  ArrowRight,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const QuickNav = () => {
  const primaryWorkflows = [
    {
      title: "AI Scoping Wizard",
      description: "Intelligent project scoping with AI recommendations",
      href: "/scoping",
      icon: <Lightbulb className="h-6 w-6" />,
      badge: "AI-POWERED",
      color: "from-blue-500 to-cyan-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Smart Recommendations",
      description: "AI-driven insights and compliance guidance",
      href: "/recommendations",
      icon: <Sparkles className="h-6 w-6" />,
      badge: "LIVE AI",
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      title: "Project Tracker",
      description: "Implementation tracking and POC management",
      href: "/tracker",
      icon: <Target className="h-6 w-6" />,
      badge: "ACTIVE",
      color: "from-green-500 to-emerald-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200"
    }
  ];

  const quickActions = [
    { title: "Use Case Library", href: "/use-cases", icon: <BookOpen className="h-5 w-5" />, description: "200+ pre-built cases" },
    { title: "Site Management", href: "/sites", icon: <Building2 className="h-5 w-5" />, description: "Manage deployment sites" },
    { title: "Questionnaires", href: "/questionnaires", icon: <FileText className="h-5 w-5" />, description: "Requirements capture" },
    { title: "Deployment Planner", href: "/deployment", icon: <Rocket className="h-5 w-5" />, description: "Go-live planning" },
    { title: "Analytics & Reports", href: "/reports", icon: <BarChart3 className="h-5 w-5" />, description: "Performance insights" },
    { title: "Team Management", href: "/users", icon: <Target className="h-5 w-5" />, description: "User & permissions" }
  ];

  return (
    <div className="space-y-8">
      {/* AI-Powered Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="outline" className="bg-gradient-primary text-white border-0 px-4 py-2 text-sm font-bold">
            <Brain className="h-4 w-4 mr-2" />
            AI NAC DESIGNER • DEPLOYMENT MASTER
          </Badge>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Intelligent Network Access Control
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Transform complex NAC deployments with AI-powered scoping, 200+ use cases, and intelligent tracking
        </p>
      </div>

      {/* Primary Workflows */}
      <div className="grid md:grid-cols-3 gap-6">
        {primaryWorkflows.map((workflow) => (
          <Link key={workflow.href} to={workflow.href} className="group">
            <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${workflow.bgColor} ${workflow.borderColor} border-2`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${workflow.color} text-white shadow-lg`}>
                    {workflow.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold">
                    {workflow.badge}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`text-xl font-bold ${workflow.textColor} group-hover:underline`}>
                    {workflow.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {workflow.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    START WORKFLOW
                  </span>
                  <ArrowRight className={`h-4 w-4 ${workflow.textColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Frequently accessed tools</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 h-full">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickNav;