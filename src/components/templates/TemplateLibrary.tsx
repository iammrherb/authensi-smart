
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TemplateLibrary = () => {
  const templates = [
    {
      id: "1",
      name: "Enterprise 802.1X",
      category: "Authentication",
      description: "Standard enterprise 802.1X authentication with certificate-based access",
      complexity: "Medium",
      devices: "500-5000",
      industry: "Enterprise",
    },
    {
      id: "2",
      name: "Healthcare HIPAA",
      category: "Compliance",
      description: "HIPAA-compliant NAC setup for healthcare organizations",
      complexity: "High",
      devices: "1000-10000",
      industry: "Healthcare",
    },
    {
      id: "3",
      name: "Guest Network",
      category: "Guest Access",
      description: "Secure guest network with portal-based authentication",
      complexity: "Low",
      devices: "50-500",
      industry: "General",
    },
    {
      id: "4",
      name: "IoT Device Management",
      category: "IoT",
      description: "Comprehensive IoT device management and profiling",
      complexity: "High",
      devices: "100-1000",
      industry: "Manufacturing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Template Library</h2>
        <Button variant="outline">Upload Custom Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Complexity:</span>
                  <Badge variant={
                    template.complexity === "High" ? "destructive" :
                    template.complexity === "Medium" ? "secondary" : "default"
                  }>
                    {template.complexity}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Device Range:</span>
                  <span>{template.devices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Industry:</span>
                  <span>{template.industry}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Preview
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
