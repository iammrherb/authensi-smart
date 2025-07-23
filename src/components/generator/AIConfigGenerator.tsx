
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AIConfigGenerator = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">AI-Powered Configuration Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-4">GPT-4 Configuration Engine</h3>
            <p className="text-muted-foreground mb-6">
              Generate optimized Portnox configurations using advanced AI
            </p>
            <Button variant="hero" size="lg">
              Start Configuration Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfigGenerator;
