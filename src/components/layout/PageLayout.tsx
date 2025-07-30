import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'glow';
    icon?: React.ComponentType<{ className?: string }>;
  };
  actions?: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  backTo,
  badge,
  actions,
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const shouldShowBack = showBackButton && location.pathname !== '/' && location.pathname !== '/dashboard';

  return (
    <div className={`min-h-screen bg-background p-6 space-y-6 ${className}`}>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {/* Navigation & Badge */}
          <div className="flex items-center gap-4">
            {shouldShowBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {badge && (
              <Badge variant={badge.variant || 'default'} className="flex items-center gap-2">
                {badge.icon && <badge.icon className="h-4 w-4" />}
                {badge.text}
              </Badge>
            )}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-bold">
              {title.includes('AI') || title.includes('Intelligence') ? (
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {title}
                </span>
              ) : (
                title
              )}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;