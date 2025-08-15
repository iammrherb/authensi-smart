import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import UnifiedLayout from "./components/layout/UnifiedLayout";
import UnifiedCommandCenter from "./pages/UnifiedCommandCenter";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Designer from "./pages/Designer";
import UnifiedTrackingCenter from "./pages/UnifiedTrackingCenter";
import UnifiedImplementationHub from "./pages/UnifiedImplementationHub";
import Dashboard from "./pages/Dashboard";
import CommandCenter from "./pages/CommandCenter";
import AdminDashboard from "./components/admin/AdminDashboard";
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

import UseCaseLibrary from "./pages/UseCaseLibrary";
import ProjectDetails from "./pages/ProjectDetails";
import IntelligenceTrackerHub from "./pages/IntelligenceTrackerHub";


import UnifiedResourceCenter from "./pages/UnifiedResourceCenter";
import ProjectCreation from "./pages/ProjectCreation";
import ProjectManager from "./pages/ProjectManager";
import OneXerWizardPage from "./pages/OneXerWizard";
import SmartConfigCenter from "./pages/SmartConfigCenter";
import UltimateWizard from "./pages/UltimateWizard";
import Portnox from "./pages/Portnox";
import ComprehensiveImplementationHub from "./pages/ComprehensiveImplementationHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
                  <IntelligenceTrackerHub />
                </ProtectedRoute>
              } />
              <Route path="/scoping" element={
                <ProtectedRoute>
                  <IntelligentScoping />
                </ProtectedRoute>
              } />
              <Route path="/scoping/:projectId" element={
                <ProtectedRoute>
                  <ProjectScoping />
                </ProtectedRoute>
              } />
              <Route path="/recommendations" element={
                <ProtectedRoute>
                  <IntelligenceTrackerHub />
                </ProtectedRoute>
              } />
              
              {/* Project Manager - Simple, unified project management */}
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectManager />
                </ProtectedRoute>
              } />
              <Route path="/tracker" element={
                <ProtectedRoute>
                  <ProjectManager />
                </ProtectedRoute>
              } />
              <Route path="/tracking" element={
                <ProtectedRoute>
                  <ProjectManager />
                </ProtectedRoute>
              } />
              <Route path="/implementation" element={
                <ProtectedRoute>
                  <ProjectManager />
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
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* AI Configuration Center */}
              <Route path="/ai-config" element={
                <ProtectedRoute>
                  <SmartConfigCenter />
                </ProtectedRoute>
              } />
              <Route path="/onexer-wizard" element={
                <ProtectedRoute>
                  <OneXerWizardPage />
                </ProtectedRoute>
              } />
              <Route path="/wizard" element={
                <ProtectedRoute>
                  <UltimateWizard />
                </ProtectedRoute>
              } />
              
              {/* Knowledge & Resources */}
              <Route path="/resource-library" element={
                <ProtectedRoute>
                  <UnifiedResourceCenter />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <UnifiedResourceCenter />
                </ProtectedRoute>
              } />
              <Route path="/project-creation" element={
                <ProtectedRoute>
                  <ProjectCreation />
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
              
              {/* Administration */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/vendors" element={
                <ProtectedRoute>
                  <Vendors />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
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
                  <Requirements />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UnifiedLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
