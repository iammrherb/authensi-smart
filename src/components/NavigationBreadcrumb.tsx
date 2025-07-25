import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';

const NavigationBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    dashboard: 'Dashboard',
    'ai-recommendations': 'AI Intelligence Hub',
    'intelligent-scoping': 'AI Scoping Wizard',
    designer: 'Network Designer',
    tracker: 'Project Tracker',
    sites: 'Site Management',
    questionnaires: 'Questionnaires',
    vendors: 'Vendor Management',
    users: 'User Management',
    reports: 'Reports & Analytics',
    requirements: 'Requirements',
    'use-case-library': 'Use Case Library',
    deployment: 'Deployment Planning',
    settings: 'Settings'
  };

  return (
    <div className="flex items-center space-x-2 py-2 px-4 bg-navigation border-b border-navigation-border">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-navigation-foreground hover:bg-navigation-hover hover:text-navigation-active"
      >
        <Link to="/dashboard">
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      
      {pathSegments.length > 0 && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {pathSegments.map((segment, index) => {
            const path = '/' + pathSegments.slice(0, index + 1).join('/');
            const isLast = index === pathSegments.length - 1;
            const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <React.Fragment key={segment}>
                {isLast ? (
                  <span className="text-navigation-active font-medium">{label}</span>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-navigation-foreground hover:bg-navigation-hover hover:text-navigation-active"
                    >
                      <Link to={path}>{label}</Link>
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

export default NavigationBreadcrumb;