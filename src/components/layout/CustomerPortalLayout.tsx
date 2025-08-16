import React from 'react';

interface CustomerPortalLayoutProps {
  children: React.ReactNode;
}

const CustomerPortalLayout: React.FC<CustomerPortalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">Customer Portal</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Secure Customer Access
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default CustomerPortalLayout;