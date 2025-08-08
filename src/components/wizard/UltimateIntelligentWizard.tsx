import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProject, type Project } from "@/hooks/useProjects";
import EnhancedSiteCreationWizard from "@/components/sites/EnhancedSiteCreationWizard";
import EnhancedAIScopingWizard from "@/components/scoping/EnhancedAIScopingWizard";
import OneXerConfigWizard from "@/components/config/OneXerConfigWizard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Network, Target, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface UnifiedState {
  project?: Project | null;
  siteId?: string | null;
  scopingSession?: any | null;
  generatedConfig?: any | null;
}

const steps = [
  { id: 1, title: "Project Basics", icon: Target },
  { id: 2, title: "Sites", icon: Network },
  { id: 3, title: "AI Scoping", icon: Brain },
  { id: 4, title: "AI Config Gen (802.1X)", icon: Settings },
  { id: 5, title: "Review & Finish", icon: CheckCircle },
];

const UltimateIntelligentWizard: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [state, setState] = useState<UnifiedState>({});
  const [showSiteWizard, setShowSiteWizard] = useState(false);
  const [showScopingWizard, setShowScopingWizard] = useState(false);
  const [showConfigWizard, setShowConfigWizard] = useState(false);

  // Minimal project form for step 1
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    name: "",
    client_name: "",
    description: "",
    status: "planning",
    current_phase: "scoping",
    progress_percentage: 10,
  } as Partial<Project>);

  const createProjectMutation = useCreateProject();

  const progress = useMemo(() => {
    const completed = [
      state.project ? 1 : 0,
      state.siteId ? 1 : 0,
      state.scopingSession ? 1 : 0,
      state.generatedConfig ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
    return Math.round(((completed + (currentStep === 5 ? 1 : 0)) / steps.length) * 100);
  }, [state, currentStep]);

  const canNext = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!projectForm.name && !!projectForm.client_name && !createProjectMutation.isPending;
      case 2:
        return !!state.siteId || !!state.project; // allow skipping sites
      case 3:
        return !!state.scopingSession || !!state.project; // allow skipping but recommended
      case 4:
        return !!state.generatedConfig || !!state.project; // allow skipping but recommended
      default:
        return true;
    }
  }, [currentStep, projectForm, state, createProjectMutation.isPending]);

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleCreateProject = () => {
    if (!projectForm.name || !projectForm.client_name) return;
    createProjectMutation.mutate(
      {
        name: projectForm.name!,
        client_name: projectForm.client_name!,
        description: projectForm.description || "",
        status: projectForm.status || "planning",
        current_phase: projectForm.current_phase || "scoping",
        progress_percentage: projectForm.progress_percentage ?? 10,
      } as any,
      {
        onSuccess: (project) => {
          setState((prev) => ({ ...prev, project: project as Project }));
          toast({ title: "Project Created", description: "Basics saved successfully" });
          next();
        },
      }
    );
  };

  const renderStep1 = () => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Project Basics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" value={projectForm.name || ""} onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., ACME NAC Rollout" />
          </div>
          <div>
            <Label htmlFor="client">Client/Org</Label>
            <Input id="client" value={projectForm.client_name || ""} onChange={(e) => setProjectForm((p) => ({ ...p, client_name: e.target.value }))} placeholder="e.g., ACME Corp" />
          </div>
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={projectForm.description || ""} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} placeholder="High-level scope, goals, constraints..." />
        </div>
        <div className="flex justify-end gap-2">
          {state.project && (
            <Button variant="outline" onClick={next}>Skip</Button>
          )}
          <Button onClick={handleCreateProject} disabled={!projectForm.name || !projectForm.client_name || createProjectMutation.isPending}>
            {createProjectMutation.isPending ? "Saving..." : "Save & Continue"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Sites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Create at least one site for deployment. You can add more later.</p>
        <div className="flex gap-2">
          <Button onClick={() => setShowSiteWizard(true)}>
            Launch Site Wizard
          </Button>
          {state.siteId && <Badge variant="secondary">Primary Site Created</Badge>}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prev}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <Button onClick={next} disabled={!canNext}>Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
        </div>
      </CardContent>

      {/* Site Wizard Dialog */}
      <Dialog open={showSiteWizard} onOpenChange={setShowSiteWizard}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto bg-card z-50">
          <DialogHeader>
            <DialogTitle>Enhanced Site Creation</DialogTitle>
            <DialogDescription>Create and link a site to your project. You can add more sites later.</DialogDescription>
          </DialogHeader>
          {state.project ? (
            <EnhancedSiteCreationWizard
              projectId={state.project.id}
              onComplete={(siteId) => {
                setState((p) => ({ ...p, siteId }));
                setShowSiteWizard(false);
                toast({ title: "Site Created", description: "Site linked to project" });
              }}
              onCancel={() => setShowSiteWizard(false)}
            />
          ) : (
            <div className="p-6 text-muted-foreground">Please create the project first.</div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>AI Scoping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Run the AI Scoping Wizard to analyze requirements and generate documentation.</p>
        <div className="flex gap-2">
          <Button onClick={() => setShowScopingWizard(true)}>
            Launch AI Scoping
          </Button>
          {state.scopingSession && <Badge variant="secondary">Scoping Completed</Badge>}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prev}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <Button onClick={next} disabled={!canNext}>Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
        </div>
      </CardContent>

      <Dialog open={showScopingWizard} onOpenChange={setShowScopingWizard}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto bg-card z-50">
          <DialogHeader>
            <DialogTitle>Enhanced AI Scoping Wizard</DialogTitle>
            <DialogDescription>Analyze requirements and generate scoped documentation for your deployment.</DialogDescription>
          </DialogHeader>
          <EnhancedAIScopingWizard
            onComplete={(session) => {
              setState((p) => ({ ...p, scopingSession: session }));
              setShowScopingWizard(false);
              toast({ title: "Scoping Complete", description: "Documentation generated and stored" });
            }}
            onCancel={() => setShowScopingWizard(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>AI Configuration Generation (802.1X)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Generate validated 802.1X configurations with templates and best practices.</p>
        <div className="flex gap-2">
          <Button onClick={() => setShowConfigWizard(true)}>
            Launch Config Wizard
          </Button>
          {state.generatedConfig && <Badge variant="secondary">Config Generated</Badge>}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prev}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <Button onClick={next} disabled={!canNext}>Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
        </div>
      </CardContent>

      <Dialog open={showConfigWizard} onOpenChange={setShowConfigWizard}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto bg-card z-50">
          <DialogHeader>
            <DialogTitle>DotXer Config Gen</DialogTitle>
            <DialogDescription>Generate validated 802.1X configuration templates with best practices.</DialogDescription>
          </DialogHeader>
          {state.project ? (
            <OneXerConfigWizard
              projectId={state.project.id}
              siteId={state.siteId || undefined}
              onSave={(config) => {
                setState((p) => ({ ...p, generatedConfig: config }));
                setShowConfigWizard(false);
                toast({ title: "Configuration Saved", description: "Config template generated" });
              }}
              onCancel={() => setShowConfigWizard(false)}
            />
          ) : (
            <div className="p-6 text-muted-foreground">Please create the project first.</div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );

  const renderStep5 = () => (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Review & Finish</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Project</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {state.project ? (
                <div>
                  <div className="font-medium">{state.project.name}</div>
                  <div>Client: {state.project.client_name}</div>
                  <div>Status: {state.project.status}</div>
                </div>
              ) : (
                <div>Not created</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Site</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {state.siteId ? <div>Primary Site ID: {state.siteId}</div> : <div>Optional (none yet)</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Artifacts</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <div>Scoping: {state.scopingSession ? "Complete" : "Pending"}</div>
              <div>Config: {state.generatedConfig ? "Generated" : "Pending"}</div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => {
              window.location.href = "/tracker";
            }}>Go to Tracker</Button>
            <Button onClick={() => {
              toast({ title: "Wizard Complete", description: "You can continue in Project Tracker." });
              window.location.href = "/tracker";
            }}>
              Finish
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Badge variant="glow">Ultimate Intelligent Wizard</Badge>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Unified Scoping • Sites • Config</h1>
        <p className="text-muted-foreground">A single, streamlined flow that creates the project, sites, AI scoping outputs, and 802.1X configurations.</p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              {steps.map((s) => (
                <div key={s.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${currentStep === s.id ? 'border-primary text-primary' : 'border-border text-muted-foreground'}` }>
                  <s.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{s.title}</span>
                </div>
              ))}
            </div>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </CardContent>
      </Card>
    </div>
  );
};

export default UltimateIntelligentWizard;
