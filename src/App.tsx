import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Header from "./components/Header";
import NavigationBreadcrumb from "./components/NavigationBreadcrumb";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Designer from "./pages/Designer";
import Tracker from "./pages/Tracker";
import Deployment from "./pages/Deployment";
import Dashboard from "./pages/Dashboard";
import CommandCenter from "./pages/CommandCenter";
import AdminDashboard from "./components/admin/AdminDashboard";
import Sites from "./pages/Sites";
import Requirements from "./pages/Requirements";
import Vendors from "./pages/Vendors";
import Users from "./pages/Users";
import Questionnaires from "./pages/Questionnaires";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// New enhanced pages
import IntelligentScoping from "./pages/IntelligentScoping";
import ProjectScoping from "./pages/ProjectScoping";
import ProjectTracking from "./pages/ProjectTracking";
import UseCaseLibrary from "./pages/UseCaseLibrary";
import ProjectDetails from "./pages/ProjectDetails";
import IntelligenceTrackerHub from "./pages/IntelligenceTrackerHub";
import ImplementationCenter from "./pages/ImplementationCenter";
import Resources from "./pages/Resources";
import OneXerWizardPage from "./pages/OneXerWizard";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col w-full bg-background">
    <Header />
    <main className="flex-1 overflow-hidden bg-background pt-28">
      <div className="h-full overflow-auto">
        {children}
      </div>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<CommandCenter />} />
                    <Route path="/dashboard" element={<CommandCenter />} />
                    
                    {/* Intelligence Tracker Hub */}
                    <Route path="/intelligence" element={<IntelligenceTrackerHub />} />
                    <Route path="/scoping" element={<IntelligentScoping />} />
                    <Route path="/scoping/:projectId" element={<ProjectScoping />} />
                    <Route path="/recommendations" element={<IntelligenceTrackerHub />} />
                    
                    {/* Project Management */}
                    <Route path="/tracker" element={<Tracker />} />
                    <Route path="/project/:projectId/tracking" element={<ProjectTracking />} />
                    <Route path="/implementation" element={<ImplementationCenter />} />
                    <Route path="/deployment" element={<Deployment />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    
                    {/* Knowledge & Resources */}
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/onexer-wizard" element={<OneXerWizardPage />} />
                    <Route path="/use-cases" element={<UseCaseLibrary />} />
                    <Route path="/sites" element={<Sites />} />
                    <Route path="/questionnaires" element={<Questionnaires />} />
                    
                    {/* Administration */}
                    <Route path="/users" element={<Users />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Legacy/Deprecated Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/designer" element={<Designer />} />
                    <Route path="/requirements" element={<Requirements />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
