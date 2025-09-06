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

// Import the actual implemented components
import { EnhancedProjectCreationWizard } from "@/components/projects/EnhancedProjectCreationWizard";
import { UnifiedProjectTracker } from "@/components/tracker/UnifiedProjectTracker";
import { TimelineManager } from "@/components/tracker/TimelineManager";
import ProjectTrackingOverview from "@/components/tracker/ProjectTrackingOverview";
import SmartTemplateRecommendationEngine from "@/components/templates/SmartTemplateRecommendationEngine";
import ProfessionalDeploymentReportGenerator from "@/components/tracker/ProfessionalDeploymentReportGenerator";
import IntelligentProjectCreationWizard from "@/components/comprehensive/IntelligentProjectCreationWizard";
import { EnhancedResourceManager } from "@/components/resources/EnhancedResourceManager";
import SmartProjectInsights from "@/components/ai/SmartProjectInsights";
import { GlobalDocsEnrichmentPanel } from "@/components/docs/GlobalDocsEnrichmentPanel";

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
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <EnhancedResourceManager />
                           <SmartProjectInsights projectData={{
                             id: 'sample',
                             name: 'Sample Project',
                             client_name: 'Sample Client',
                             industry: 'Technology',
                             deployment_type: 'hybrid',
                             security_level: 'high',
                             total_sites: 5,
                             total_endpoints: 250,
                             progress_percentage: 65,
                             current_phase: 'deployment',
                             success_criteria: ['High availability', 'Security compliance'],
                             pain_points: ['Network latency', 'Legacy systems']
                           }} />
                         </div>
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
                         <IntelligentProjectCreationWizard />
                       </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/scoping/:projectId" element={
                    <ProtectedRoute>
                       <div className="p-6">
                         <h1 className="text-2xl font-bold">Project Scoping</h1>
                         <IntelligentProjectCreationWizard />
                       </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/recommendations" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">AI Recommendations</h1>
                        <SmartTemplateRecommendationEngine />
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Project Manager - Simple, unified project management */}
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Manager</h1>
                        <UnifiedProjectTracker />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/projects/:id" element={
                    <ProtectedRoute>
                       <div className="p-6">
                         <h1 className="text-2xl font-bold">Project Details</h1>
                         <ProjectTrackingOverview 
                           stats={{
                             totalProjects: 12,
                             activeSites: 8,
                             completedSites: 4,
                             overallProgress: 75,
                             atRiskProjects: 3
                           }}
                           onNavigateToTab={(tab: string) => console.log('Navigate to:', tab)}
                         />
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
                        <h1 className="text-2xl font-bold">Project Tracker</h1>
                        <UnifiedProjectTracker />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/tracking" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Timeline Management</h1>
                        <TimelineManager />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/implementation" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Implementation Hub</h1>
                        <ComprehensiveImplementationHub />
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
                         <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                         <ProfessionalDeploymentReportGenerator />
                       </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* AI Configuration Center */}
                  <Route path="/ai-config" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Smart Config Center</h1>
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold">Configuration Wizard</h3>
                          <p className="text-muted-foreground">Advanced configuration management with vendor-specific templates</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Vendor Templates</h4>
                              <p className="text-sm text-muted-foreground">Pre-configured templates for major vendors</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Custom Configs</h4>
                              <p className="text-sm text-muted-foreground">Build custom configurations from scratch</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/onexer-wizard" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">OneXer Configuration Wizard</h1>
                        <div className="space-y-6">
                          <p className="text-muted-foreground">Advanced OneXer configuration and deployment wizard</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Network Discovery</h4>
                              <p className="text-sm text-muted-foreground">Automated network infrastructure discovery</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Policy Configuration</h4>
                              <p className="text-sm text-muted-foreground">Advanced policy and rule management</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/wizard" element={
                    <ProtectedRoute>
                       <div className="p-6">
                         <h1 className="text-2xl font-bold">Ultimate Environment Discovery Wizard</h1>
                         <IntelligentProjectCreationWizard />
                       </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Knowledge & Resources */}
                  <Route path="/resource-library" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Enhanced Resource Library</h1>
                         <div className="space-y-6">
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <EnhancedResourceManager />
                             <GlobalDocsEnrichmentPanel />
                           </div>
                         </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/resources" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Resource Management</h1>
                         <div className="space-y-6">
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <EnhancedResourceManager />
                             <SmartProjectInsights projectData={{
                               id: 'sample',
                               name: 'Sample Project',
                               client_name: 'Sample Client',
                               industry: 'Technology',
                               deployment_type: 'hybrid',
                               security_level: 'high',
                               total_sites: 5,
                               total_endpoints: 250,
                               progress_percentage: 65,
                               current_phase: 'deployment',
                               success_criteria: ['High availability', 'Security compliance'],
                               pain_points: ['Network latency', 'Legacy systems']
                             }} />
                           </div>
                         </div>
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/project-creation" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Project Creation Wizard</h1>
                        <EnhancedProjectCreationWizard />
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
                        <h1 className="text-2xl font-bold">Vendor Management</h1>
                        <div className="space-y-6">
                          <p className="text-muted-foreground">Comprehensive vendor and model management system</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Vendor Profiles</h4>
                              <p className="text-sm text-muted-foreground">Detailed vendor information and capabilities</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Model Management</h4>
                              <p className="text-sm text-muted-foreground">Device models, firmware, and features</p>
                            </div>
                          </div>
                        </div>
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
                         <div className="space-y-6">
                           <p className="text-muted-foreground">Manage demonstration data and sample projects</p>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <div className="p-4 border rounded-lg">
                               <h4 className="font-medium mb-2">Sample Projects</h4>
                               <p className="text-sm text-muted-foreground">Pre-built demonstration projects</p>
                             </div>
                             <div className="p-4 border rounded-lg">
                               <h4 className="font-medium mb-2">Test Data</h4>
                               <p className="text-sm text-muted-foreground">Sample vendors, sites, and configurations</p>
                             </div>
                           </div>
                         </div>
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
                         <ProfessionalDeploymentReportGenerator />
                       </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/dev/resource/:type/:id" element={
                    <ProtectedRoute>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold">Enhanced Resource Manager</h1>
                         <div className="space-y-6">
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <EnhancedResourceManager />
                             <GlobalDocsEnrichmentPanel />
                           </div>
                         </div>
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
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Performance Metrics</h4>
                              <p className="text-sm text-muted-foreground">Project and system performance analytics</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Business Intelligence</h4>
                              <p className="text-sm text-muted-foreground">Advanced reporting and insights</p>
                            </div>
                          </div>
                        </div>
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
                <div className="space-y-6">
                  <p className="text-muted-foreground">Comprehensive user and role management system</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Role Management</h4>
                      <p className="text-sm text-muted-foreground">Define and manage user roles and permissions</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Access Control</h4>
                      <p className="text-sm text-muted-foreground">Granular permission management</p>
                    </div>
                  </div>
                </div>
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
                        <h1 className="text-2xl font-bold">Requirements Management</h1>
                        <div className="space-y-6">
                          <p className="text-muted-foreground">Comprehensive requirements gathering and management</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Requirements Gathering</h4>
                              <p className="text-sm text-muted-foreground">Structured requirements collection</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Validation & Tracking</h4>
                              <p className="text-sm text-muted-foreground">Requirements validation and progress tracking</p>
                            </div>
                          </div>
                        </div>
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
