import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import ConditionalLayout from "./components/layout/ConditionalLayout";

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

import UnifiedResourceCenter from "./pages/UnifiedResourceCenter";
import ProjectCreation from "./pages/ProjectCreation";
import OneXerWizardPage from "./pages/OneXerWizard";
import AIConfigCenter from "./pages/AIConfigCenter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ConditionalLayout>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <CommandCenter />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <CommandCenter />
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
              
              {/* Project Management */}
              <Route path="/tracker" element={
                <ProtectedRoute>
                  <Tracker />
                </ProtectedRoute>
              } />
              <Route path="/project/:projectId/tracking" element={
                <ProtectedRoute>
                  <ProjectTracking />
                </ProtectedRoute>
              } />
              <Route path="/implementation" element={
                <ProtectedRoute>
                  <ImplementationCenter />
                </ProtectedRoute>
              } />
              <Route path="/deployment" element={
                <ProtectedRoute>
                  <Deployment />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              
              {/* AI Configuration Center */}
              <Route path="/ai-config" element={
                <ProtectedRoute>
                  <AIConfigCenter />
                </ProtectedRoute>
              } />
              <Route path="/onexer-wizard" element={
                <ProtectedRoute>
                  <OneXerWizardPage />
                </ProtectedRoute>
              } />
              
              {/* Knowledge & Resources */}
              <Route path="/resources" element={
                <ProtectedRoute>
                  <UnifiedResourceCenter />
                </ProtectedRoute>
              } />
              <Route path="/resource-center" element={
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
              <Route path="/sites" element={
                <ProtectedRoute>
                  <Sites />
                </ProtectedRoute>
              } />
              <Route path="/questionnaires" element={
                <ProtectedRoute>
                  <Questionnaires />
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
          </ConditionalLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
