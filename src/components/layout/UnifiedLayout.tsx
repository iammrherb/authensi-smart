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
  const noLayoutRoutes = ['/auth', '/customer-auth', '/customer-portal'];
  const shouldShowLayout = !noLayoutRoutes.some(route => location.pathname.startsWith(route));

  if (!shouldShowLayout) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <UnifiedHeader />
          
          <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-primary/2">
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <div className="p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UnifiedLayout;