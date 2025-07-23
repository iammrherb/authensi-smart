
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResourceTracking = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resource Tracking</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">Resource tracking dashboard coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceTracking;
