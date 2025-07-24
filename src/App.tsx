import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Designer from "./pages/Designer";
import Tracker from "./pages/Tracker";
import Deployment from "./pages/Deployment";
import Dashboard from "./pages/Dashboard";
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
import UseCaseLibrary from "./pages/UseCaseLibrary";
import ProjectDetails from "./pages/ProjectDetails";

const queryClient = new QueryClient();

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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  
                  {/* Enhanced NAC Designer & Deployment Tracker */}
                  <Route path="/scoping" element={<IntelligentScoping />} />
                  <Route path="/use-cases" element={<UseCaseLibrary />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  
                  {/* Existing Pages */}
                  <Route path="/designer" element={<Designer />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/deployment" element={<Deployment />} />
                  <Route path="/sites" element={<Sites />} />
                  <Route path="/questionnaires" element={<Questionnaires />} />
                  <Route path="/requirements" element={<Requirements />} />
                  <Route path="/reports" element={<Reports />} />
                  
                  {/* Admin Routes */}
                  <Route path="/vendors" element={
                    <ProtectedRoute requiredRoles={['project_owner']}>
                      <Vendors />
                    </ProtectedRoute>
                  } />
                  <Route path="/users" element={
                    <ProtectedRoute requiredRoles={['project_owner', 'project_manager']}>
                      <Users />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute requiredRoles={['project_owner']}>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
