import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QuestionnaireManager from "@/components/questionnaires/QuestionnaireManager";
import { ExternalLink } from "lucide-react";

const ScopingWorkflow = () => {
  const [showQuestionnaireManager, setShowQuestionnaireManager] = useState(false);

  const useCases = [
    {
      category: "Network Access Control",
      cases: [
        "Device Authentication & Authorization",
        "BYOD Policy Enforcement", 
        "Guest Network Management",
        "IoT Device Onboarding",
        "Zero Trust Network Access",
        "Compliance Monitoring (PCI-DSS, HIPAA, SOX)"
      ]
    },
    {
      category: "Identity Management",
      cases: [
        "Active Directory Integration",
        "LDAP/SAML Authentication",
        "Multi-Factor Authentication",
        "Certificate-based Authentication",
        "Mobile Device Management Integration",
        "Privileged Access Management"
      ]
    },
    {
      category: "Security & Compliance",
      cases: [
        "Vulnerability Assessment",
        "Endpoint Protection Integration",
        "SIEM Integration & Logging",
        "Audit Trail & Reporting",
        "Risk-based Access Control",
        "Automated Remediation"
      ]
    },
    {
      category: "Operational Management",
      cases: [
        "Network Visibility & Monitoring",
        "Automated Incident Response",
        "User Self-Service Portal",
        "Help Desk Integration",
        "Performance Monitoring",
        "Capacity Planning"
      ]
    }
  ];

  const deploymentTypes = [
    {
      type: "SMB (Small-Medium Business)",
      description: "1-500 endpoints, single location",
      features: ["Basic NAC", "Cloud Management", "Standard Policies"],
      timeline: "2-4 weeks",
      complexity: "Low"
    },
    {
      type: "Mid-Market Enterprise",
      description: "500-5000 endpoints, multiple locations",
      features: ["Advanced NAC", "Integration Hub", "Custom Policies", "Multi-site"],
      timeline: "6-12 weeks",
      complexity: "Medium"
    },
    {
      type: "Large Enterprise",
      description: "5000+ endpoints, global deployment",
      features: ["Enterprise NAC", "Full Integration", "Advanced Analytics", "Global Scale"],
      timeline: "12-24 weeks",
      complexity: "High"
    }
  ];

  const scopingQuestions = {
    infrastructure: [
      "How many total endpoints need NAC coverage?",
      "What types of devices are in your environment?",
      "What network infrastructure vendors are you using?",
      "Do you have existing network segmentation?",
      "What authentication systems are currently in place?"
    ],
    security: [
      "What compliance requirements must be met?",
      "What are your current security policies?",
      "Do you have existing security tools to integrate?",
      "What are your incident response procedures?",
      "What visibility requirements do you have?"
    ],
    business: [
      "What is driving the NAC implementation?",
      "What are your success criteria?",
      "What is your timeline for deployment?",
      "What resources do you have available?",
      "What is your change management process?"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Project Scoping & Use Cases
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive scoping workflow for Portnox deployments
          </p>
        </div>
        <Button 
          onClick={() => setShowQuestionnaireManager(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Manage Questionnaires
        </Button>
      </div>

      <Card className="bg-gradient-glow border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">
            Enhanced Scoping Questionnaire System
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Use the comprehensive questionnaire manager for detailed scoping, use case validation, 
            test case management, and requirements gathering.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold">Comprehensive Forms</h3>
              <p className="text-sm text-muted-foreground">
                Detailed questionnaires with deployment types, use cases, and requirements
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🧪</div>
              <h3 className="font-semibold">Test Case Management</h3>
              <p className="text-sm text-muted-foreground">
                Create and track test cases for validating use case implementations
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Sizing & Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Automatic sizing calculations and progress tracking
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowQuestionnaireManager(true)}
            size="lg"
            className="bg-gradient-primary hover:opacity-90"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Open Questionnaire Manager
          </Button>
        </CardContent>
      </Card>

      {/* Questionnaire Manager Dialog */}
      <Dialog open={showQuestionnaireManager} onOpenChange={setShowQuestionnaireManager}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scoping Questionnaire Manager</DialogTitle>
          </DialogHeader>
          <QuestionnaireManager />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScopingWorkflow;