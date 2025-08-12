import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CodeBlock from "@/components/ui/code-block";
import { 
  Settings, 
  Cpu, 
  Download, 
  Upload, 
  Copy, 
  Eye, 
  Edit,
  Star,
  Trash2,
  Plus,
  Search,
  Filter,
  Zap,
  Code,
  FileText,
  Wrench,
  Save,
  Wand2,
  Shield,
  Network,
  Database,
  Bot
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useUpdateConfigTemplate, useDeleteConfigTemplate, useGenerateConfigWithAI } from '@/hooks/useConfigTemplates';
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useVendorModels } from '@/hooks/useVendorModels';
import { useToast } from '@/hooks/use-toast';
import EnhancedVendorSelector from './EnhancedVendorSelector';

interface ConfigGeneratorManagerProps {
  searchTerm: string;
}

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  vendor_id: z.string().optional(),
  model_id: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  configuration_type: z.string().min(1, "Configuration type is required"),
  complexity_level: z.string().min(1, "Complexity level is required"),
  template_content: z.string().min(1, "Template content is required"),
  template_variables: z.record(z.any()).default({}),
  supported_scenarios: z.array(z.string()).default([]),
  authentication_methods: z.array(z.string()).default([]),
  required_features: z.array(z.string()).default([]),
  network_requirements: z.record(z.any()).default({}),
  security_features: z.array(z.string()).default([]),
  best_practices: z.array(z.string()).default([]),
  troubleshooting_guide: z.array(z.any()).default([]),
  validation_commands: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(true),
  is_validated: z.boolean().default(false),
  validation_notes: z.string().optional(),
});

const ConfigGeneratorManager: React.FC<ConfigGeneratorManagerProps> = ({ searchTerm }) => {
  const { data: templates, isLoading: templatesLoading } = useConfigTemplates();
  const { data: vendors, isLoading: vendorsLoading } = useEnhancedVendors();
  const { data: vendorModels } = useVendorModels();
  const createTemplate = useCreateConfigTemplate();
  const updateTemplate = useUpdateConfigTemplate();
  const deleteTemplate = useDeleteConfigTemplate();
  const generateWithAI = useGenerateConfigWithAI();
  const { toast } = useToast();

  const configTypes = ["802.1x", "TACACS+", "RADSEC", "Guest Access", "VLAN Configuration", "Port Security", "Multi-Auth", "COA", "Dynamic VLAN"];
  const complexityLevels = ["basic", "intermediate", "advanced", "expert"];
  const configurationTypes = ["switch", "router", "firewall", "wireless"];
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFirmware, setSelectedFirmware] = useState("");
  const [configType, setConfigType] = useState("");
  const [provider, setProvider] = useState<'openai' | 'claude' | 'gemini'>('openai');
  const [aiRequirements, setAiRequirements] = useState("");
  const [generatedConfig, setGeneratedConfig] = useState("");
  const [currentEditTemplate, setCurrentEditTemplate] = useState<any>(null);

  // Paste & Optimize
  const [isPasteOptimizeOpen, setIsPasteOptimizeOpen] = useState(false);
  const [pastedConfig, setPastedConfig] = useState("");
  const [optimizedConfig, setOptimizedConfig] = useState("");
  const [optimizedAnalysis, setOptimizedAnalysis] = useState("");

  // Paste & Optimize options
  const [reviewOnly, setReviewOnly] = useState(false);
  const [deviceAdmin, setDeviceAdmin] = useState(false);
  const [coa, setCoa] = useState(false);
  const [radsec, setRadsec] = useState(false);
  const [saml, setSaml] = useState(false);
  const [tuneTimeouts, setTuneTimeouts] = useState(false);
  const [loadBalancing, setLoadBalancing] = useState(false);
  const [vsasDacls, setVsasDacls] = useState(false);
  const [ipHelpers, setIpHelpers] = useState(false);
  const [loggingTroubleshooting, setLoggingTroubleshooting] = useState(false);
  const [otherOptions, setOtherOptions] = useState("");

  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      configuration_type: "",
      complexity_level: "intermediate",
      template_content: "",
      template_variables: {},
      supported_scenarios: [],
      authentication_methods: [],
      required_features: [],
      network_requirements: {},
      security_features: [],
      best_practices: [],
      troubleshooting_guide: [],
      validation_commands: [],
      tags: [],
      is_public: true,
      is_validated: false,
    },
  });

  // Filter templates based on search term
  const filteredTemplates = templates?.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.vendor?.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter models based on selected vendor
  const filteredModels = vendorModels?.filter(model => 
    selectedVendor ? model.vendor_id === selectedVendor : true
  ) || [];

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleCreateTemplate = async (values: z.infer<typeof templateFormSchema>) => {
    try {
      await createTemplate.mutateAsync(values);
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleEditTemplate = (template: any) => {
    setCurrentEditTemplate(template);
    form.reset({
      name: template.name,
      description: template.description,
      vendor_id: template.vendor_id,
      model_id: template.model_id,
      category: template.category,
      subcategory: template.subcategory,
      configuration_type: template.configuration_type,
      complexity_level: template.complexity_level,
      template_content: template.template_content,
      template_variables: template.template_variables,
      supported_scenarios: template.supported_scenarios,
      authentication_methods: template.authentication_methods,
      required_features: template.required_features,
      network_requirements: template.network_requirements,
      security_features: template.security_features,
      best_practices: template.best_practices,
      troubleshooting_guide: template.troubleshooting_guide,
      validation_commands: template.validation_commands,
      tags: template.tags,
      is_public: template.is_public,
      is_validated: template.is_validated,
      validation_notes: template.validation_notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTemplate = async (values: z.infer<typeof templateFormSchema>) => {
    if (!currentEditTemplate) return;
    
    try {
      await updateTemplate.mutateAsync({ 
        id: currentEditTemplate.id, 
        ...values 
      });
      setIsEditDialogOpen(false);
      setCurrentEditTemplate(null);
      form.reset();
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(templateId);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleGenerateWithAI = async () => {
    if (!selectedVendor || !configType || !aiRequirements) {
      toast({
        title: "Missing Information",
        description: "Please select vendor, config type, and provide detailed requirements.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedVendorData = vendors?.find(v => v.id === selectedVendor);
      const selectedModelData = vendorModels?.find(m => m.id === selectedModel);
      
      const enhancedPrompt = `COMPREHENSIVE NETWORK CONFIGURATION REQUEST\n\nDEVICE SPECIFICATIONS:\n- Vendor: ${selectedVendorData?.vendor_name || 'Generic'}\n- Model: ${selectedModelData?.model_name || 'Generic Model'}\n- Model Series: ${selectedModelData?.model_series || 'Standard'}\n- Firmware: ${selectedFirmware || 'Latest Stable'}\n- Configuration Type: ${configType}\n\nDETAILED REQUIREMENTS:\n${aiRequirements}\n\nCONFIGURATION SCOPE:\nPlease generate a comprehensive, enterprise-grade configuration that includes:\n1. Complete device configuration with all necessary commands\n2. Security hardening and best practices implementation\n3. Detailed inline documentation and comments\n4. RADIUS/AAA integration for authentication\n5. Dynamic VLAN assignment configuration\n6. Quality of Service (QoS) configuration\n7. SNMP and monitoring setup\n8. Access control lists and security policies\n9. Backup and recovery procedures\n10. Comprehensive troubleshooting guide\n11. Implementation and validation steps\n12. Maintenance and update procedures\n\nADDITIONAL REQUIREMENTS:\n- Follow vendor-specific best practices for ${selectedVendorData?.vendor_name || 'the selected vendor'}\n- Include security considerations for ${configType}\n- Provide production-ready configuration suitable for enterprise deployment\n- Include performance optimization settings\n- Add comprehensive error handling and failover configurations\n\nFORMAT: Provide a well-structured, professional configuration document with clear sections, detailed explanations, and actionable implementation guidance.`;
      
      const result = await generateWithAI.mutateAsync({
        vendor: selectedVendorData?.vendor_name || '',
        model: selectedModelData?.model_name || '',
        firmware: selectedFirmware,
        configType,
        requirements: enhancedPrompt,
        provider
      });

      setGeneratedConfig(result.content);
      
      toast({
        title: "Configuration Generated Successfully",
        description: "Comprehensive enterprise-grade configuration has been generated with best practices and troubleshooting guide.",
      });
    } catch (error) {
      console.error('Failed to generate config:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate configuration. Please check your inputs and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveGeneratedConfig = () => {
    const selectedVendorName = vendors?.find(v => v.id === selectedVendor)?.vendor_name || '';
    const selectedModelName = vendorModels?.find(m => m.id === selectedModel)?.model_name || '';
    
    form.reset({
      name: `${selectedVendorName} ${configType} Configuration`,
      description: `AI-generated ${configType} configuration for ${selectedVendorName}${selectedModelName ? ` ${selectedModelName}` : ''}${selectedFirmware ? ` (${selectedFirmware})` : ''}`,
      vendor_id: selectedVendor,
      model_id: selectedModel || undefined,
      category: configType,
      configuration_type: "switch",
      complexity_level: "intermediate",
      template_content: generatedConfig,
      template_variables: { firmware_version: selectedFirmware },
      supported_scenarios: [],
      authentication_methods: [],
      required_features: [],
      network_requirements: {},
      security_features: [],
      best_practices: [],
      troubleshooting_guide: [],
      validation_commands: [],
      tags: ["ai-generated", configType.toLowerCase(), selectedVendorName.toLowerCase(), ...(selectedFirmware ? [selectedFirmware] : [])],
      is_public: true,
      is_validated: false,
    });
    
    setIsAIGeneratorOpen(false);
    setIsCreateDialogOpen(true);
  };

  // Heuristic detection of Vendor/Model/Firmware from pasted config
  const detectFromConfig = () => {
    try {
      if (!pastedConfig?.trim()) {
        toast({ title: 'Nothing to analyze', description: 'Paste a configuration first.', variant: 'destructive' });
        return;
      }
      const text = pastedConfig.toLowerCase();

      // Detect vendor by keywords
      let detectedVendorId = selectedVendor;
      const findVendor = (namePart: string) => vendors?.find(v => v.vendor_name.toLowerCase().includes(namePart))?.id;
      if (!detectedVendorId) {
        if (text.includes('cisco') || text.includes('ios-xe') || text.includes('cat9')) detectedVendorId = findVendor('cisco') || '';
        else if (text.includes('forti') || text.includes('fortiswitch') || text.includes('fortios')) detectedVendorId = findVendor('forti') || '';
        else if (text.includes('aruba') || text.includes('arubaos') || text.includes('procurve')) detectedVendorId = findVendor('aruba') || '';
      }

      // Detect model by string containment
      let detectedModelId = selectedModel;
      if (detectedVendorId && !detectedModelId) {
        const models = vendorModels?.filter(m => m.vendor_id === detectedVendorId) || [];
        for (const m of models) {
          const name = (m.model_name || '').toLowerCase();
          if (name && text.includes(name)) { detectedModelId = m.id; break; }
        }
      }

      // Detect firmware by regex patterns
      let detectedFirmware = selectedFirmware;
      if (!detectedFirmware) {
        const regexes = [
          /(version|ios-xe|software)\s*v?(\d+(?:\.\d+){1,2}(?:[\w()\-\.]+)?)/i,
          /(fortios|fsw|fortiswitch)\s*v?(\d+(?:\.\d+){1,2}(?:[\w()\-\.]+)?)/i,
          /(arubaos(?:-switch)?)\s*v?(\d+(?:\.\d+){1,2}(?:[\w()\-\.]+)?)/i,
        ];
        for (const rx of regexes) {
          const m = pastedConfig.match(rx);
          if (m?.[2]) { detectedFirmware = m[2]; break; }
        }
      }

      if (detectedVendorId) setSelectedVendor(detectedVendorId);
      if (detectedModelId) setSelectedModel(detectedModelId);
      if (detectedFirmware) setSelectedFirmware(detectedFirmware);

      toast({
        title: 'Detection complete',
        description: `${detectedVendorId ? 'Vendor detected' : 'Vendor unchanged'}${detectedModelId ? ' • Model detected' : ''}${detectedFirmware ? ' • Firmware detected' : ''}`,
      });
    } catch (e) {
      console.error('Detection failed', e);
      toast({ title: 'Detection failed', description: 'Could not infer details from the config.', variant: 'destructive' });
    }
  };

  if (templatesLoading || vendorsLoading) {
    return <div className="p-6">Loading configuration templates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Configuration Templates</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} configuration templates available
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAIGeneratorOpen} onOpenChange={setIsAIGeneratorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <Wand2 className="h-4 w-4 mr-2" />
                1Xer Wizard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration Generator
                </DialogTitle>
                <DialogDescription>
                  Generate custom 802.1X configurations using AI for any supported vendor and use case.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <EnhancedVendorSelector
                  selectedVendor={selectedVendor}
                  selectedModel={selectedModel}
                  selectedFirmware={selectedFirmware}
                  onVendorChange={setSelectedVendor}
                  onModelChange={setSelectedModel}
                  onFirmwareChange={setSelectedFirmware}
                  compact={true}
                  showDetails={false}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Configuration Type</Label>
                    <Select value={configType} onValueChange={setConfigType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select config type" />
                      </SelectTrigger>
                      <SelectContent>
                        {configTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>AI Provider</Label>
                    <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="claude">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Requirements & Use Cases</Label>
                  <Textarea 
                    value={aiRequirements}
                    onChange={(e) => setAiRequirements(e.target.value)}
                    placeholder="Describe your specific requirements, network topology, VLANs, authentication methods, etc..."
                    rows={4}
                  />
                </div>

                {generatedConfig && (
                  <div className="space-y-2">
                    <Label>Generated Configuration</Label>
                    <CodeBlock code={generatedConfig} heightClass="h-[60vh]" filename={`${configType || 'configuration'}.txt`} />
                    <Button onClick={handleSaveGeneratedConfig} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAIGeneratorOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateWithAI} disabled={!selectedVendor || !configType || !aiRequirements || generateWithAI.isPending}>
                    <Zap className="h-4 w-4 mr-2" />
                    {generateWithAI.isPending ? 'Generating...' : 'Generate Configuration'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isPasteOptimizeOpen} onOpenChange={setIsPasteOptimizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Wrench className="h-4 w-4 mr-2" />
                Paste & Optimize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Review, Optimize, and Validate Configuration
                </DialogTitle>
                <DialogDescription>
                  Paste any configuration to analyze, align with Portnox best practices, and save as a reusable template.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>AI Provider</Label>
                  <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="claude">Anthropic Claude</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Target Device Context */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Target Device Context</Label>
                    <Button type="button" variant="outline" size="sm" onClick={detectFromConfig}>
                      Detect from pasted config
                    </Button>
                  </div>
                  <EnhancedVendorSelector
                    selectedVendor={selectedVendor}
                    selectedModel={selectedModel}
                    selectedFirmware={selectedFirmware}
                    onVendorChange={setSelectedVendor}
                    onModelChange={setSelectedModel}
                    onFirmwareChange={setSelectedFirmware}
                    compact={true}
                    showDetails={false}
                  />
                </div>

                {/* Optimization Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">Review Only</p>
                        <p className="text-xs text-muted-foreground">Provide recommendations without changing config</p>
                      </div>
                      <Switch checked={reviewOnly} onCheckedChange={setReviewOnly} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Device Administration</Label>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">TACACS+/RADIUS Admin</p>
                        <p className="text-xs text-muted-foreground">AAA for privileged exec and command authorization</p>
                      </div>
                      <Switch checked={deviceAdmin} onCheckedChange={setDeviceAdmin} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>CoA</Label>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">Change of Authorization</p>
                        <p className="text-xs text-muted-foreground">Enable/validate RFC 5176 CoA for Portnox</p>
                      </div>
                      <Switch checked={coa} onCheckedChange={setCoa} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>RADSEC</Label>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">RADIUS over TLS</p>
                        <p className="text-xs text-muted-foreground">Mutual TLS, ciphers, cert validation</p>
                      </div>
                      <Switch checked={radsec} onCheckedChange={setRadsec} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>SAML/SSO</Label>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">SAML integration</p>
                        <p className="text-xs text-muted-foreground">Where applicable (e.g., captive portal / admin)</p>
                      </div>
                      <Switch checked={saml} onCheckedChange={setSaml} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tuning & Ops</Label>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Timeouts</span>
                        <Switch checked={tuneTimeouts} onCheckedChange={setTuneTimeouts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Load balancing / redundancy</span>
                        <Switch checked={loadBalancing} onCheckedChange={setLoadBalancing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">VSAs & dACLs</span>
                        <Switch checked={vsasDacls} onCheckedChange={setVsasDacls} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IP Helpers / relay</span>
                        <Switch checked={ipHelpers} onCheckedChange={setIpHelpers} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Logging & troubleshooting</span>
                        <Switch checked={loggingTroubleshooting} onCheckedChange={setLoggingTroubleshooting} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional notes */}
                <div className="space-y-2">
                  <Label>Other options or scenarios</Label>
                  <Textarea
                    rows={3}
                    value={otherOptions}
                    onChange={(e) => setOtherOptions(e.target.value)}
                    placeholder="Anything else to include: site-specific constraints, VLANs, ACL naming standards, etc."
                  />
                </div>

                {/* Existing configuration input */}
                <div className="space-y-2">
                  <Label>Existing Configuration</Label>
                  <Textarea rows={10} value={pastedConfig} onChange={(e) => setPastedConfig(e.target.value)} placeholder="Paste your configuration here..." />
                </div>
                {reviewOnly && optimizedAnalysis && (
                  <div className="space-y-2">
                    <Label>AI Review & Recommendations</Label>
                    <CodeBlock code={optimizedAnalysis} heightClass="h-[60vh]" filename={`analysis.md`} />
                  </div>
                )}
                {!reviewOnly && optimizedConfig && (
                  <div className="space-y-2">
                    <Label>Optimized Configuration</Label>
                    <CodeBlock code={optimizedConfig} heightClass="h-[60vh]" filename={`optimized-config.txt`} />
                    <Button onClick={() => {
                      const vendorName = vendors?.find(v => v.id === selectedVendor)?.vendor_name || '';
                      form.reset({
                        name: `${vendorName || 'Generic'} Optimized Configuration`,
                        description: `Optimized configuration generated by AI with Portnox best practices.`,
                        vendor_id: selectedVendor || undefined,
                        model_id: selectedModel || undefined,
                        category: configType || 'Optimized Configuration',
                        configuration_type: 'switch',
                        complexity_level: 'intermediate',
                        template_content: optimizedConfig,
                        template_variables: {},
                        supported_scenarios: [],
                        authentication_methods: [],
                        required_features: [],
                        network_requirements: {},
                        security_features: [],
                        best_practices: [],
                        troubleshooting_guide: [],
                        validation_commands: [],
                        tags: ['ai-optimized', 'portnox', 'best-practices'],
                        is_public: true,
                        is_validated: false,
                      });
                      setIsPasteOptimizeOpen(false);
                      setIsCreateDialogOpen(true);
                    }} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button onClick={async () => {
                    if (!pastedConfig?.trim()) return;

                    // Build context strings
                    const vendorName = vendors?.find(v => v.id === selectedVendor)?.vendor_name || 'Unknown';
                    const modelName = vendorModels?.find(m => m.id === selectedModel)?.model_name || '';
                    const firmware = selectedFirmware || '';

                    const featureLines = [
                      deviceAdmin ? '- Include AAA for device administration (TACACS+ preferred, fall back to RADIUS if not supported). Configure command authorization where supported.' : null,
                      coa ? '- Ensure Change of Authorization (RFC 5176) is enabled and validated.' : null,
                      radsec ? '- Configure RADSEC (RADIUS over TLS) with mutual authentication, proper ciphers, and certificate validation.' : null,
                      saml ? '- Include SAML/SSO integration guidance where applicable (admin portal / captive portal).' : null,
                      tuneTimeouts ? '- Review and tune RADIUS/EAP/timeouts/retry behavior.' : null,
                      loadBalancing ? '- Implement RADIUS server load balancing and redundancy/failover.' : null,
                      vsasDacls ? '- Support Portnox VSAs and dynamic ACLs/VLANs as appropriate.' : null,
                      ipHelpers ? '- Validate IP helper/DHCP relay for the appropriate VLANs.' : null,
                      loggingTroubleshooting ? '- Enable logging/syslog and include troubleshooting and verification commands.' : null,
                      otherOptions ? `- Other: ${otherOptions}` : null,
                    ].filter(Boolean).join('\n');

                    const header = `PASTE & OPTIMIZE REQUEST\n\nDEVICE CONTEXT (infer if Unknown):\n- Vendor: ${vendorName}\n- Model: ${modelName || 'Unknown'}\n- Firmware: ${firmware || 'Unknown'}\n`;

                    const reviewInstructions = `\nTASK: Provide a thorough review and recommendations for the pasted configuration.\nInclude sections: Summary, Detected Platform, Issues/Risks, Recommended Changes, Best Practices, Validation Steps, Troubleshooting Tips.\nFocus on Portnox NAC alignment and enterprise practices.\n${featureLines ? `\nRequested options:\n${featureLines}\n` : ''}\nReturn well-structured Markdown (no code fences needed).`;

                    const optimizeInstructions = `\nTASK: Output ONLY the final optimized configuration code with inline comments where needed (no prose before/after).\nIncorporate the requested options when supported by the detected platform.\nEnsure alignment with Portnox NAC best practices and vendor conventions.\n` + (featureLines ? `\nRequested options:\n${featureLines}\n` : '');

                    const prompt = `${header}\nPASTED CONFIGURATION:\n\n${pastedConfig}\n\n` + (reviewOnly ? reviewInstructions : optimizeInstructions);

                    try {
                      const result = await generateWithAI.mutateAsync({
                        vendor: vendorName === 'Unknown' ? '' : vendorName,
                        model: modelName,
                        firmware,
                        configType: reviewOnly ? 'Review' : 'Optimization',
                        requirements: prompt,
                        provider,
                      });
                      if (reviewOnly) {
                        setOptimizedAnalysis(result.content);
                        setOptimizedConfig('');
                      } else {
                        setOptimizedConfig(result.content);
                        setOptimizedAnalysis('');
                      }
                    } catch (e) {
                      console.error(e);
                      toast({ title: reviewOnly ? 'Review Failed' : 'Optimization Failed', description: 'Please try again.', variant: 'destructive' });
                    }
                  }}> {reviewOnly ? 'Review' : 'Optimize'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Configuration Template</DialogTitle>
                <DialogDescription>
                  Create a reusable configuration template for specific vendor and use case.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateTemplate)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cisco 9300 Basic 802.1X" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vendor_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vendors?.map(vendor => (
                                <SelectItem key={vendor.id} value={vendor.id}>
                                  {vendor.vendor_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="template_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuration Template</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the configuration template with variables like {{VLAN_ID}}..."
                            rows={8}
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTemplate.isPending}>
                      {createTemplate.isPending ? 'Creating...' : 'Create Template'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Configuration Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.vendor?.vendor_name || 'Unknown Vendor'}
                    </Badge>
                    <Badge className={getDifficultyColor(template.complexity_level)}>
                      {template.complexity_level}
                    </Badge>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Configuration Type:</p>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Used {template.usage_count} times</span>
                <span>Rating: {template.rating}/5.0</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedTemplate(template);
                  setIsDetailDialogOpen(true);
                }}>
                  <Code className="h-4 w-4 mr-1" />
                  View Code
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => handleEditTemplate(template)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Vendor:</p>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.vendor?.vendor_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category:</p>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.category}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Configuration:</p>
                <CodeBlock code={selectedTemplate.template_content} heightClass="h-[60vh]" filename={`${selectedTemplate?.name || 'template'}.txt`} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No configuration templates found</h3>
            <p className="text-muted-foreground mb-4">
              No configuration templates match your search criteria.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsAIGeneratorOpen(true)} variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfigGeneratorManager;