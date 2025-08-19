import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calendar, CalendarDays, Users, FileText, Settings, Shield, Clock, 
  Target, Activity, BarChart3, TrendingUp, CheckCircle2, AlertTriangle,
  Star, Sparkles, Rocket, Building, Globe, Zap, Download, Eye,
  MessageSquare, Bell, Video, Phone, Mail, MapPin, Award, Layers,
  ChevronRight, Plus, Lock, Unlock, ExternalLink, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Placeholder components until we implement these features
const CustomerPortalBranding = ({ organizationName, projectName, portalId }: any) => <div>Branding Component</div>;
const AdvancedProgressTracker = ({ progress, milestones, projectId, sites }: any) => <div>Progress Tracker</div>;
const MSTeamsIntegration = ({ projectId, teamMembers }: any) => <div>Teams Integration</div>;
const ComprehensiveRiskAssessment = ({ projectId }: any) => <div>Risk Assessment</div>;
import AdvancedReportGenerator from '@/components/reports/AdvancedReportGenerator';
import EnhancedAnalyticsDashboard from '@/components/analytics/EnhancedAnalyticsDashboard';
import IntelligentDocumentManager from '@/components/documents/IntelligentDocumentManager';
import AdvancedNotificationCenter from '@/components/notifications/AdvancedNotificationCenter';

interface EnhancedCustomerPortalProps {
  portalId?: string;
  projectData?: any;
  customerSession?: any;
}

const EnhancedCustomerPortal: React.FC<EnhancedCustomerPortalProps> = ({ 
  portalId, 
  projectData, 
  customerSession 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock enhanced project data
  const enhancedProject = {
    id: 'proj_123',
    name: 'Enterprise NAC Implementation',
    description: 'Comprehensive Network Access Control deployment for Fortune 500 company with advanced security requirements.',
    status: 'in_progress',
    current_phase: 'Design & Architecture',
    progress_percentage: 67,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    estimated_budget: 850000,
    customer_organization: 'Global Enterprise Corp',
    project_manager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@portnox.com',
      avatar: '/api/placeholder/32/32',
      title: 'Senior Solutions Architect'
    },
    team_leads: [
      { name: 'Mike Chen', role: 'Technical Lead', avatar: '/api/placeholder/32/32' },
      { name: 'Emily Rodriguez', role: 'Implementation Manager', avatar: '/api/placeholder/32/32' },
      { name: 'David Kim', role: 'Security Specialist', avatar: '/api/placeholder/32/32' }
    ],
    milestones: [
      { name: 'Discovery Complete', date: '2024-02-01', status: 'completed', progress: 100 },
      { name: 'Architecture Design', date: '2024-03-15', status: 'in_progress', progress: 75 },
      { name: 'Pilot Deployment', date: '2024-04-30', status: 'upcoming', progress: 0 },
      { name: 'Full Rollout', date: '2024-06-15', status: 'upcoming', progress: 0 }
    ],
    metrics: {
      sites_total: 24,
      sites_completed: 8,
      users_affected: 12500,
      devices_managed: 45000,
      security_score: 94,
      uptime_percentage: 99.7
    },
    recent_activities: [
      { action: 'Security policies updated', time: '2 hours ago', type: 'security', importance: 'high' },
      { action: 'Site 12 deployment completed', time: '1 day ago', type: 'deployment', importance: 'medium' },
      { action: 'Weekly progress meeting scheduled', time: '2 days ago', type: 'meeting', importance: 'low' }
    ]
  };

  useEffect(() => {
    // Welcome animation sequence
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Animate tab transition
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const pulseVariants = {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 2 }
  };

  if (showWelcomeAnimation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={pulseVariants}
            className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow"
          >
            <Building className="w-16 h-16 text-primary-foreground" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Your Project Portal
            </h1>
            <p className="text-xl text-muted-foreground">
              {enhancedProject.customer_organization}
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center space-x-2"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 1.2 + i * 0.2,
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5"
      >
        {/* Enhanced Header with Branding */}
        <motion.div 
          variants={itemVariants}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        >
          <CustomerPortalBranding 
            organizationName={enhancedProject.customer_organization}
            projectName={enhancedProject.name}
            portalId={portalId}
          />
          
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                      <Building className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-accent-foreground" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      {enhancedProject.customer_organization}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                      {enhancedProject.name}
                    </p>
                  </div>
                </motion.div>

                <Separator orientation="vertical" className="h-12" />

                <div className="flex items-center space-x-4">
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {enhancedProject.current_phase}
                  </Badge>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge variant="default" className="bg-gradient-primary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {enhancedProject.progress_percentage}% Complete
                    </Badge>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {notifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View notifications</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Layers className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={enhancedProject.project_manager.avatar} />
                    <AvatarFallback>PM</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{enhancedProject.project_manager.name}</p>
                    <p className="text-muted-foreground text-xs">{enhancedProject.project_manager.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Progress Header */}
        <motion.div variants={itemVariants} className="container mx-auto px-6 py-6">
          <Card className="bg-gradient-to-r from-card/50 to-card/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">Project Progress</span>
                  </div>
                  <div className="text-2xl font-bold">{enhancedProject.progress_percentage}%</div>
                  <AdvancedProgressTracker 
                    progress={enhancedProject.progress_percentage} 
                    milestones={enhancedProject.milestones}
                  />
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-accent" />
                    <span className="font-medium">Sites Deployed</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {enhancedProject.metrics.sites_completed}/{enhancedProject.metrics.sites_total}
                  </div>
                  <Progress 
                    value={(enhancedProject.metrics.sites_completed / enhancedProject.metrics.sites_total) * 100} 
                    className="h-2"
                  />
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-neon-green" />
                    <span className="font-medium">Security Score</span>
                  </div>
                  <div className="text-2xl font-bold text-neon-green">
                    {enhancedProject.metrics.security_score}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-neon-green" />
                    <span className="text-sm text-muted-foreground">Excellent</span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-cyber-pink" />
                    <span className="font-medium">Team Members</span>
                  </div>
                  <div className="flex -space-x-2">
                    {enhancedProject.team_leads.map((member, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    ))}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Navigation Tabs */}
        <motion.div variants={itemVariants} className="container mx-auto px-6">
          <div className="flex space-x-1 bg-card/50 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: 'overview', label: 'Project Overview', icon: Target },
              { id: 'progress', label: 'Progress Tracking', icon: BarChart3 },
              { id: 'meetings', label: 'Meetings & Collab', icon: Video },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'reports', label: 'Reports', icon: Download },
              { id: 'notifications', label: 'Updates', icon: Bell },
              { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="w-1 h-1 bg-primary-foreground rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Content Area */}
        <motion.div 
          variants={itemVariants}
          className="container mx-auto px-6 py-8"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-muted-foreground">Loading magical content...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="glass-subtle">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-neon-yellow" />
                            <span>Project Highlights</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {enhancedProject.milestones.map((milestone, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    milestone.status === 'completed' ? 'bg-neon-green' :
                                    milestone.status === 'in_progress' ? 'bg-neon-orange animate-pulse' :
                                    'bg-muted'
                                  }`} />
                                  <div>
                                    <p className="font-medium">{milestone.name}</p>
                                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                                  </div>
                                </div>
                                <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                                  {milestone.status}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-subtle">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-electric-blue" />
                            <span>Recent Activity</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {enhancedProject.recent_activities.map((activity, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors"
                              >
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  activity.importance === 'high' ? 'bg-destructive' :
                                  activity.importance === 'medium' ? 'bg-neon-orange' :
                                  'bg-muted'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{activity.action}</p>
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <AdvancedProgressTracker 
                    projectId={enhancedProject.id}
                    progress={enhancedProject.progress_percentage}
                    milestones={enhancedProject.milestones}
                    sites={enhancedProject.metrics}
                  />
                )}

                {activeTab === 'meetings' && (
                  <MSTeamsIntegration 
                    projectId={enhancedProject.id}
                    teamMembers={enhancedProject.team_leads}
                  />
                )}

                {activeTab === 'documents' && (
                  <IntelligentDocumentManager />
                )}

                {activeTab === 'analytics' && (
                  <EnhancedAnalyticsDashboard 
                    projectId={enhancedProject.id}
                    timeRange="30d"
                  />
                )}

                {activeTab === 'reports' && (
                  <AdvancedReportGenerator 
                    projectId={enhancedProject.id}
                  />
                )}

                {activeTab === 'notifications' && (
                  <AdvancedNotificationCenter />
                )}

                {activeTab === 'risks' && (
                  <ComprehensiveRiskAssessment 
                    projectId={enhancedProject.id}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Quick Actions */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <div className="flex flex-col space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center"
                >
                  <MessageSquare className="w-6 h-6 text-primary-foreground" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left">Chat with your project team</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-accent rounded-full shadow-elevated flex items-center justify-center"
                >
                  <Phone className="w-6 h-6 text-accent-foreground" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left">Schedule a meeting</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-neon-green rounded-full shadow-elevated flex items-center justify-center"
                >
                  <Rocket className="w-6 h-6 text-neon-green-foreground" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left">Quick deployment status</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};

export default EnhancedCustomerPortal;