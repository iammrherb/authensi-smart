import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Users, Target, Zap, Building2, FileText, Rocket, BookOpen, BarChart3, Brain, Settings, Archive } from "lucide-react";
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Command Center", icon: <Target className="h-4 w-4" />, description: "Main Dashboard" },
    { path: "/scoping", label: "AI Scoping", icon: <Brain className="h-4 w-4" />, description: "Intelligent Project Scoping" },
    { path: "/sites", label: "Site Management", icon: <Building2 className="h-4 w-4" />, description: "Site Discovery" },
    { path: "/use-cases", label: "Use Case Library", icon: <BookOpen className="h-4 w-4" />, description: "200+ Pre-Built Use Cases" },
    { path: "/questionnaires", label: "Scoping Wizard", icon: <FileText className="h-4 w-4" />, description: "Requirements Capture" },
    { path: "/tracker", label: "POC Tracker", icon: <Zap className="h-4 w-4" />, description: "Implementation Tracking" },
    { path: "/deployment", label: "Deployment Master", icon: <Rocket className="h-4 w-4" />, description: "Go-Live Management" },
    { path: "/reports", label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, description: "Performance Insights" },
  ];

  const adminItems = [
    { path: "/users", label: "Team", icon: <Users className="h-4 w-4" />, description: "User Management" },
    { path: "/vendors", label: "Vendors", icon: <Archive className="h-4 w-4" />, description: "Vendor Library" },
    { path: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" />, description: "System Configuration" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={portnoxLogo} 
              alt="Portnox" 
              className="h-10 w-auto drop-shadow-lg"
            />
            <div className="border-l border-border pl-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">
                  NAC DESIGNER
                </span>
                <span className="text-sm font-medium text-muted-foreground">•</span>
                <span className="text-lg font-bold text-foreground">DEPLOYMENT TRACKER</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                🧠 AI-Powered • 🎯 Use Case Maestro • 🚀 Deployment Master
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:shadow-md hover:scale-102"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {item.icon}
                  <span className="text-xs font-bold tracking-wide">{item.label}</span>
                </div>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </span>
              </Link>
            ))}
            
            {/* Admin Items with Separator */}
            <div className="h-8 w-px bg-border mx-2"></div>
            
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-primary text-white shadow-lg transform scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:shadow-md hover:scale-102"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {item.icon}
                  <span className="text-xs font-bold tracking-wide">{item.label}</span>
                </div>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;