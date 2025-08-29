import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Removed broken import

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import UnifiedLayout from "./components/layout/UnifiedLayout";
import UnifiedCommandCenter from "./pages/UnifiedCommandCenter";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AIContextManager from "./components/ai/AIContextManager";
import SmartTemplateCenter from "./pages/SmartTemplateCenter";
import Designer from "./pages/Designer";
import UnifiedImplementationHub from "./pages/UnifiedImplementationHub";
import CommandCenter from "./pages/CommandCenter";
import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./pages/Users";
import Questionnaires from "./pages/Questionnaires";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import UseCaseLibrary from "./pages/UseCaseLibrary";
import Sites from "./pages/Sites";
import SiteDetails from "./pages/SiteDetails";

import Portnox from "./pages/Portnox";
import ComprehensiveImplementationHub from "./pages/ComprehensiveImplementationHub";
import AIIntegrationTest from "./pages/AIIntegrationTest";
import CustomerPortal from "./pages/CustomerPortal";
import CustomerAuth from "./pages/CustomerAuth";
import CustomerDashboard from "./pages/CustomerDashboard";
import Testing from "./pages/Testing";
// Removed broken import
import NewFeaturesShowcase from "./components/dashboard/NewFeaturesShowcase";
import SystemHealthCenter from "./components/admin/SystemHealthCenter";
// Removed broken import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer Portal Routes - Separate from main app */}
            <Route path="/customer-portal/:portalId" element={<CustomerPortal />} />
            <Route path="/customer-auth/:portalId" element={<CustomerAuth />} />
            <Route path="/customer-auth" element={<CustomerAuth />} />
            <Route path="/customer-dashboard/:projectId" element={<CustomerDashboard />} />
            
            {/* Main Application Routes */}
            <Route path="/*" element={
              <UnifiedLayout>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <UnifiedCommandCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <UnifiedCommandCenter />
                    </ProtectedRoute>
                  } />
                  
                  {/* Intelligence Tracker Hub */}
                  <Route path="/intelligence" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Intelligence Tracker Hub</h1>
                        <p className="text-muted-foreground">Intelligence tracker coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-context" element={
                    <ProtectedRoute requiredRoles={['super_admin']}>
                      <AIContextManager />
                    </ProtectedRoute>
                  } />
                  <Route path="/smart-templates" element={
                    <ProtectedRoute>
                      <SmartTemplateCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="/scoping" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Intelligent Scoping</h1>
                        <p className="text-muted-foreground">Scoping functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/scoping/:projectId" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Scoping</h1>
                        <p className="text-muted-foreground">Project scoping functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/recommendations" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Recommendations</h1>
                        <p className="text-muted-foreground">Recommendations functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Project Manager - Simple, unified project management */}
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Manager</h1>
                        <p className="text-muted-foreground">Project management functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/projects/:id" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Details</h1>
                        <p className="text-muted-foreground">Project details functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Sites Management */}
                  <Route path="/sites" element={
                    <ProtectedRoute>
                      <Sites />
                    </ProtectedRoute>
                  } />
                  <Route path="/sites/:id" element={
                    <ProtectedRoute>
                      <SiteDetails />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/tracker" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Tracker</h1>
                        <p className="text-muted-foreground">Tracker functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/tracking" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Tracking</h1>
                        <p className="text-muted-foreground">Tracking functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/implementation" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Implementation</h1>
                        <p className="text-muted-foreground">Implementation functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Legacy routes for backward compatibility */}
                  <Route path="/deployment" element={
                    <ProtectedRoute>
                      <UnifiedImplementationHub />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Reports</h1>
                        <p className="text-muted-foreground">Reports functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* AI Configuration Center */}
                  <Route path="/ai-config" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Smart Config Center</h1>
                        <p className="text-muted-foreground">Smart config functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/onexer-wizard" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">OneXer Wizard</h1>
                        <p className="text-muted-foreground">OneXer wizard functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/wizard" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Ultimate Wizard</h1>
                        <p className="text-muted-foreground">Ultimate wizard functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Knowledge & Resources */}
                  <Route path="/resource-library" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Resource Library</h1>
                        <p className="text-muted-foreground">Resource library functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/resources" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Resources</h1>
                        <p className="text-muted-foreground">Resources functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/project-creation" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Creation</h1>
                        <p className="text-muted-foreground">Project creation functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/use-cases" element={
                    <ProtectedRoute>
                      <UseCaseLibrary />
                    </ProtectedRoute>
                  } />
                  <Route path="/questionnaires" element={
                    <ProtectedRoute>
                      <Questionnaires />
                    </ProtectedRoute>
                  } />
                  <Route path="/portnox" element={
                    <ProtectedRoute>
                      <Portnox />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-test" element={
                    <ProtectedRoute>
                      <AIIntegrationTest />
                    </ProtectedRoute>
                  } />
                  
                  {/* Administration */}
                  <Route path="/users" element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendors" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Vendors</h1>
                        <p className="text-muted-foreground">Vendors functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                   <Route path="/demo-data" element={
                     <ProtectedRoute>
                       <div className="p-6">
                         <h1 className="text-2xl font-bold">Demo Data Manager</h1>
                         <p className="text-muted-foreground">Demo data management coming soon.</p>
                       </div>
                     </ProtectedRoute>
                   } />
                  
                  {/* Testing & Validation */}
                  <Route path="/testing" element={
                    <ProtectedRoute>
                      <Testing />
                    </ProtectedRoute>
                  } />
                  
                  {/* Development Testing Routes */}
                  <Route path="/dev/reports" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Enterprise Report Generator</h1>
                        <p className="text-muted-foreground">Enterprise reports functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/dev/resource/:type/:id" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Resource Manager</h1>
                        <p className="text-muted-foreground">Enhanced resource manager coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/showcase" element={
                    <ProtectedRoute>
                      <NewFeaturesShowcase />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Analytics Reporting Center</h1>
                        <p className="text-muted-foreground">Analytics functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                            <Route path="/system-health" element={
            <ProtectedRoute>
              <SystemHealthCenter />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold">User Management Center</h1>
                <p className="text-muted-foreground">User management functionality coming soon.</p>
              </div>
            </ProtectedRoute>
          } />
                  
                  {/* Legacy/Deprecated Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/designer" element={
                    <ProtectedRoute>
                      <Designer />
                    </ProtectedRoute>
                  } />
                  <Route path="/requirements" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Requirements</h1>
                        <p className="text-muted-foreground">Requirements functionality coming soon.</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UnifiedLayout>
             } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
