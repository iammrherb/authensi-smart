
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/designer", label: "Architecture Designer", icon: "🏗️" },
    { path: "/tracker", label: "Deployment Tracker", icon: "📊" },
    { path: "/generator", label: "AI Generator", icon: "🤖" },
    { path: "/templates", label: "Templates", icon: "📋" },
    { path: "/dashboard", label: "Dashboard", icon: "📈" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Portnox</span>
              <span className="text-sm text-muted-foreground ml-2">NAC Platform</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="hero">
              Start Free Trial
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
