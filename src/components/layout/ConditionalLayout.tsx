import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import NavigationBreadcrumb from '../NavigationBreadcrumb';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages that should not show the header
  const noHeaderRoutes = ['/auth'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  if (!shouldShowHeader) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <Header />
      <main className="flex-1 overflow-hidden bg-background pt-28">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ConditionalLayout;