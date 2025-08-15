import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import DeploymentPlanner from "@/components/deployment/DeploymentPlanner";

const Deployment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tracking')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Tracking
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Site Management Context Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Site deployment and management is now integrated within project workflows. 
                To manage sites, please select a specific project first.
              </p>
              <Button onClick={() => navigate('/tracking')}>
                Go to Project Tracking
              </Button>
            </CardContent>
          </Card>

          <DeploymentPlanner />
        </div>
      </div>
    </div>
  );
};

export default Deployment;