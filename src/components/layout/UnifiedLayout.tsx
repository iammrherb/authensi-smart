import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages that should not show the unified layout
  const noLayoutRoutes = ['/auth'];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname);

  if (!shouldShowLayout) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <UnifiedHeader />
          
          <main className="flex-1 overflow-hidden bg-background">
            <div className="h-full overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UnifiedLayout;