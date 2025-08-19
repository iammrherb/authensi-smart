import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Zap, Target, Users, Building, Globe, Shield, 
  Rocket, Brain, Lightbulb, Star, ArrowRight, CheckCircle2,
  AlertTriangle, Clock, FileText, Settings, Plus, Wand2,
  Layers, Network, Database, Lock, Award, TrendingUp, BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVendors } from '@/hooks/useVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  validation?: () => boolean;
  aiRecommendations?: any[];
}

interface MagicalProjectWizardProps {
  onComplete?: (projectData: any) => void;
  onCancel?: () => void;
}

const MagicalProjectWizard: React.FC<MagicalProjectWizardProps> = ({ onComplete, onCancel }) => {
  const { toast } = useToast();
  const { data: vendors } = useVendors();
  const { data: useCases } = useUseCases();
  const { data: requirements } = useRequirements();

  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<any>({
    basic: {},
    organization: {},
    technical: {},
    timeline: {},
    ai_insights: {}
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [showMagicEffects, setShowMagicEffects] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const magicSparkleVariants = {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const generateAIRecommendations = async (stepData: any) => {
    setIsGeneratingAI(true);
    try {
      // Mock AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations = [
        {
          title: "Recommended Use Cases",
          items: ["Zero Trust Authentication", "Guest Network Isolation", "IoT Device Management"],
          confidence: 95,
          reasoning: "Based on your organization size and industry requirements"
        },
        {
          title: "Security Recommendations",
          items: ["Multi-factor Authentication", "Certificate-based Auth", "Network Segmentation"],
          confidence: 92,
          reasoning: "Enhanced security posture for enterprise environments"
        },
        {
          title: "Deployment Strategy",
          items: ["Phased Rollout", "Pilot Sites First", "Weekend Maintenance Windows"],
          confidence: 88,
          reasoning: "Minimizes business disruption during implementation"
        }
      ];

      setAiRecommendations(mockRecommendations);
      toast({
        title: "AI Analysis Complete! ✨",
        description: "Generated personalized recommendations for your project",
      });
    } catch (error) {
      toast({
        title: "AI Analysis Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const steps: Step[] = [
    {
      id: 'welcome',
      title: 'Welcome to Project Magic',
      description: 'Let\'s create something extraordinary together',
      icon: <Sparkles className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow relative"
          >
            <Wand2 className="w-16 h-16 text-primary-foreground" />
            {showMagicEffects && [...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 60]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 bg-neon-yellow rounded-full"
              />
            ))}
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transform Your Network
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the most intelligent project creation wizard powered by advanced AI. 
              We'll guide you through every step to create the perfect NAC implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Brain, title: "AI-Powered", desc: "Smart recommendations" },
              { icon: Rocket, title: "Rapid Setup", desc: "Minutes, not hours" },
              { icon: Shield, title: "Enterprise Ready", desc: "Production quality" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    {
      id: 'basic',
      title: 'Project Fundamentals',
      description: 'Tell us about your project vision',
      icon: <Target className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-neon-yellow" />
                  <span>Project Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter your project name..."
                    value={projectData.basic.name || ''}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      basic: { ...prev.basic, name: e.target.value }
                    }))}
                    className="border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project goals and objectives..."
                    value={projectData.basic.description || ''}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      basic: { ...prev.basic, description: e.target.value }
                    }))}
                    rows={4}
                    className="border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Priority</Label>
                  <Select onValueChange={(value) => setProjectData(prev => ({
                    ...prev,
                    basic: { ...prev.basic, priority: value }
                  }))}>
                    <SelectTrigger className="border-primary/20">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span>Low Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-neon-orange rounded-full" />
                          <span>Medium Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-destructive rounded-full" />
                          <span>High Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-neon-red rounded-full animate-pulse" />
                          <span>Critical Priority</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-electric-blue" />
                  <span>Smart Suggestions</span>
                  <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                    AI
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Based on your input, here are some intelligent suggestions:
                  </p>
                  
                  {projectData.basic.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                    >
                      <div className="flex items-start space-x-3">
                        <Brain className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium text-sm">AI Insight</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your project name suggests a {projectData.basic.priority || 'medium'} priority NAC implementation. 
                            Consider including multi-site deployment for enterprise scale.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={() => generateAIRecommendations(projectData.basic)}
                    disabled={isGeneratingAI || !projectData.basic.name}
                    className="w-full bg-gradient-primary hover:bg-gradient-accent transition-all duration-300"
                  >
                    {isGeneratingAI ? (
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        <span>Generating Magic...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-4 h-4" />
                        <span>Generate AI Recommendations</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ),
      validation: () => !!projectData.basic.name
    },
    {
      id: 'organization',
      title: 'Organization Profile',
      description: 'Help us understand your environment',
      icon: <Building className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-cyber-pink" />
                  <span>Organization Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Size</Label>
                    <Select onValueChange={(value) => setProjectData(prev => ({
                      ...prev,
                      organization: { ...prev.organization, size: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1-100 users)</SelectItem>
                        <SelectItem value="medium">Medium (101-1000 users)</SelectItem>
                        <SelectItem value="large">Large (1001-10000 users)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (10000+ users)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select onValueChange={(value) => setProjectData(prev => ({
                      ...prev,
                      organization: { ...prev.organization, industry: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Sites</Label>
                  <Input
                    type="number"
                    placeholder="How many locations?"
                    value={projectData.organization.sites || ''}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      organization: { ...prev.organization, sites: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Geographic Regions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'North America', 'Europe', 'Asia Pacific', 'Latin America',
                      'Middle East', 'Africa', 'Global', 'Other'
                    ].map((region) => (
                      <motion.div
                        key={region}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const currentRegions = projectData.organization.regions || [];
                          const newRegions = currentRegions.includes(region)
                            ? currentRegions.filter((r: string) => r !== region)
                            : [...currentRegions, region];
                          setProjectData(prev => ({
                            ...prev,
                            organization: { ...prev.organization, regions: newRegions }
                          }));
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          (projectData.organization.regions || []).includes(region)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="text-sm font-medium text-center">{region}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-neon-green" />
                  <span>Security & Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Required Compliance Frameworks</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'SOX', 'HIPAA', 'PCI-DSS', 'ISO 27001',
                        'GDPR', 'NIST', 'SOC 2', 'FedRAMP'
                      ].map((framework) => (
                        <motion.div
                          key={framework}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const currentFrameworks = projectData.organization.compliance || [];
                            const newFrameworks = currentFrameworks.includes(framework)
                              ? currentFrameworks.filter((f: string) => f !== framework)
                              : [...currentFrameworks, framework];
                            setProjectData(prev => ({
                              ...prev,
                              organization: { ...prev.organization, compliance: newFrameworks }
                            }));
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            (projectData.organization.compliance || []).includes(framework)
                              ? 'border-neon-green bg-neon-green/10 text-neon-green'
                              : 'border-border hover:border-neon-green/40'
                          }`}
                        >
                          <div className="text-sm font-medium text-center">{framework}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Security Level</Label>
                    <Select onValueChange={(value) => setProjectData(prev => ({
                      ...prev,
                      organization: { ...prev.organization, securityLevel: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span>Standard Security</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="enhanced">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-neon-orange" />
                            <span>Enhanced Security</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="maximum">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-neon-red" />
                            <span>Maximum Security</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="zero-trust">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-cyber-pink" />
                            <span>Zero Trust Architecture</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )
    },
    {
      id: 'technical',
      title: 'Technical Configuration',
      description: 'Define your technical requirements',
      icon: <Network className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="space-y-8">
          <Tabs defaultValue="network" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-6">
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-electric-blue" />
                    <span>Network Infrastructure</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Primary Vendors</Label>
                      <div className="space-y-2">
                        {vendors?.slice(0, 8).map((vendor: any) => (
                          <motion.div
                            key={vendor.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                              const currentVendors = projectData.technical.vendors || [];
                              const newVendors = currentVendors.includes(vendor.name)
                                ? currentVendors.filter((v: string) => v !== vendor.name)
                                : [...currentVendors, vendor.name];
                              setProjectData(prev => ({
                                ...prev,
                                technical: { ...prev.technical, vendors: newVendors }
                              }));
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              (projectData.technical.vendors || []).includes(vendor.name)
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/40'
                            }`}
                          >
                            <div className="text-sm font-medium">{vendor.name}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Network Segments</Label>
                      <Input
                        type="number"
                        placeholder="Number of VLANs/segments"
                        value={projectData.technical.segments || ''}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          technical: { ...prev.technical, segments: e.target.value }
                        }))}
                      />
                      
                      <Label>Expected Throughput</Label>
                      <Select onValueChange={(value) => setProjectData(prev => ({
                        ...prev,
                        technical: { ...prev.technical, throughput: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select throughput requirement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (&lt; 1 Gbps)</SelectItem>
                          <SelectItem value="medium">Medium (1-10 Gbps)</SelectItem>
                          <SelectItem value="high">High (10-100 Gbps)</SelectItem>
                          <SelectItem value="extreme">Extreme (&gt; 100 Gbps)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="mt-6">
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-neon-purple" />
                    <span>Authentication Methods</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'eap-tls', name: 'EAP-TLS', desc: 'Certificate-based authentication' },
                      { id: 'peap', name: 'PEAP', desc: 'Protected EAP with tunneling' },
                      { id: 'eap-ttls', name: 'EAP-TTLS', desc: 'Tunneled TLS authentication' },
                      { id: 'mac-auth', name: 'MAC Authentication', desc: 'Device-based MAC auth' },
                      { id: 'web-auth', name: 'Web Authentication', desc: 'Captive portal authentication' },
                      { id: 'saml', name: 'SAML SSO', desc: 'Single sign-on integration' }
                    ].map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          const currentMethods = projectData.technical.authMethods || [];
                          const newMethods = currentMethods.includes(method.id)
                            ? currentMethods.filter((m: string) => m !== method.id)
                            : [...currentMethods, method.id];
                          setProjectData(prev => ({
                            ...prev,
                            technical: { ...prev.technical, authMethods: newMethods }
                          }));
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          (projectData.technical.authMethods || []).includes(method.id)
                            ? 'border-neon-purple bg-neon-purple/10'
                            : 'border-border hover:border-neon-purple/40'
                        }`}
                      >
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{method.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="mt-6">
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-neon-orange" />
                    <span>Device Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      'Laptops', 'Desktops', 'Mobile Devices', 'Tablets',
                      'IoT Devices', 'Printers', 'IP Phones', 'Cameras',
                      'Access Points', 'Switches', 'Servers', 'VMs'
                    ].map((device) => (
                      <motion.div
                        key={device}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          const currentDevices = projectData.technical.deviceTypes || [];
                          const newDevices = currentDevices.includes(device)
                            ? currentDevices.filter((d: string) => d !== device)
                            : [...currentDevices, device];
                          setProjectData(prev => ({
                            ...prev,
                            technical: { ...prev.technical, deviceTypes: newDevices }
                          }));
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                          (projectData.technical.deviceTypes || []).includes(device)
                            ? 'border-neon-orange bg-neon-orange/10'
                            : 'border-border hover:border-neon-orange/40'
                        }`}
                      >
                        <div className="text-sm font-medium">{device}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="mt-6">
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-cyber-pink" />
                    <span>System Integrations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { category: 'Identity Providers', options: ['Active Directory', 'Azure AD', 'Okta', 'Google Workspace'] },
                      { category: 'SIEM Systems', options: ['Splunk', 'QRadar', 'ArcSight', 'Sentinel'] },
                      { category: 'MDM Solutions', options: ['Intune', 'VMware AirWatch', 'MobileIron', 'Jamf'] },
                      { category: 'Ticketing Systems', options: ['ServiceNow', 'Jira', 'Remedy', 'Cherwell'] }
                    ].map((integration) => (
                      <div key={integration.category} className="space-y-3">
                        <Label>{integration.category}</Label>
                        <div className="space-y-2">
                          {integration.options.map((option) => (
                            <motion.div
                              key={option}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => {
                                const categoryKey = integration.category.toLowerCase().replace(/\s+/g, '_');
                                const currentOptions = projectData.technical[categoryKey] || [];
                                const newOptions = currentOptions.includes(option)
                                  ? currentOptions.filter((o: string) => o !== option)
                                  : [...currentOptions, option];
                                setProjectData(prev => ({
                                  ...prev,
                                  technical: { ...prev.technical, [categoryKey]: newOptions }
                                }));
                              }}
                              className={`p-2 rounded border cursor-pointer transition-all duration-200 ${
                                (projectData.technical[integration.category.toLowerCase().replace(/\s+/g, '_')] || []).includes(option)
                                  ? 'border-cyber-pink bg-cyber-pink/10'
                                  : 'border-border hover:border-cyber-pink/40'
                              }`}
                            >
                              <div className="text-sm">{option}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )
    },
    {
      id: 'ai-insights',
      title: 'AI Recommendations',
      description: 'Intelligent insights for your project',
      icon: <Brain className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="space-y-8">
          {aiRecommendations.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow"
                >
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h2 className="text-2xl font-bold">AI Analysis Complete!</h2>
                <p className="text-muted-foreground">
                  Based on your requirements, here are our intelligent recommendations:
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="glass-subtle h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{recommendation.title}</span>
                          <Badge variant="secondary" className="bg-gradient-accent">
                            {recommendation.confidence}% confidence
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {recommendation.items.map((item: string, itemIndex: number) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.2) + (itemIndex * 0.1) }}
                              className="flex items-center space-x-2 p-2 rounded bg-accent/10"
                            >
                              <CheckCircle2 className="w-4 h-4 text-neon-green" />
                              <span className="text-sm">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">
                            {recommendation.reasoning}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generate AI Recommendations</h3>
              <p className="text-muted-foreground mb-6">
                Let our AI analyze your project requirements and provide intelligent recommendations.
              </p>
              <Button
                onClick={() => generateAIRecommendations(projectData)}
                className="bg-gradient-primary hover:bg-gradient-accent"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Recommendations
              </Button>
            </div>
          )}
        </motion.div>
      )
    },
    {
      id: 'complete',
      title: 'Project Created!',
      description: 'Your magical project is ready',
      icon: <Award className="w-6 h-6" />,
      component: (
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-neon-green rounded-full flex items-center justify-center shadow-glow">
              <Award className="w-16 h-16 text-neon-green-foreground" />
            </div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 80]
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-neon-yellow rounded-full"
              />
            ))}
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-primary bg-clip-text text-transparent">
              Congratulations! 🎉
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your project "{projectData.basic.name}" has been created with AI-powered recommendations. 
              You're ready to begin your network transformation journey!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Rocket, title: "Ready to Deploy", desc: "Start implementation immediately" },
              { icon: TrendingUp, title: "Optimized Setup", desc: "AI-enhanced configuration" },
              { icon: Shield, title: "Security First", desc: "Enterprise-grade protection" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-neon-green/20"
              >
                <feature.icon className="w-12 h-12 text-neon-green mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center space-x-4"
          >
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-accent">
              <Rocket className="w-5 h-5 mr-2" />
              Start Implementation
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="w-5 h-5 mr-2" />
              View Project Details
            </Button>
          </motion.div>
        </motion.div>
      )
    }
  ];

  const nextStep = () => {
    const current = steps[currentStep];
    if (current.validation && !current.validation()) {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(projectData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Progress Header */}
            <motion.div variants={itemVariants} className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow"
                >
                  {currentStepData.icon}
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold">{currentStepData.title}</h1>
                  <p className="text-muted-foreground">{currentStepData.description}</p>
                </div>
              </div>

              {/* Step Progress */}
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                  </span>
                </div>
                <div className="relative">
                  <Progress value={((currentStep + 1) / steps.length) * 100} className="h-3" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 bg-primary rounded-full w-5 h-5 shadow-glow"
                    style={{ left: `${((currentStep + 1) / steps.length) * 100}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Step Content */}
            <motion.div variants={itemVariants}>
              {currentStepData.component}
            </motion.div>

            {/* Navigation */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center pt-8"
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                      scale: index === currentStep ? 1.2 : 0.8,
                      opacity: index <= currentStep ? 1 : 0.3
                    }}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-primary hover:bg-gradient-accent"
              >
                <span>{currentStep === steps.length - 1 ? 'Complete Project' : 'Next Step'}</span>
                {currentStep === steps.length - 1 ? (
                  <Award className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MagicalProjectWizard;