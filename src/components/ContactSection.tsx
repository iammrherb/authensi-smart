import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="glow" className="mb-4">
              Ready to Transform Your Network?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience the Future of <span className="bg-gradient-primary bg-clip-text text-transparent">Network Authentication</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join hundreds of enterprises already using AI to automate their network authentication. 
              Start your free trial today or schedule a personalized demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Card */}
            <Card className="p-8 hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="text-4xl mb-4">🚀</div>
                <CardTitle className="text-2xl">Schedule a Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  See NetAuthAI in action with a personalized demonstration 
                  tailored to your network infrastructure.
                </p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Live AI configuration generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Multi-vendor compatibility showcase</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>ROI analysis for your environment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Q&A with our AI experts</span>
                  </li>
                </ul>
                <Button variant="hero" className="w-full" size="lg">
                  Book Demo
                </Button>
              </CardContent>
            </Card>

            {/* Trial Card */}
            <Card className="p-8 hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="text-4xl mb-4">⚡</div>
                <CardTitle className="text-2xl">Start Free Trial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  Get instant access to NetAuthAI with our 30-day free trial. 
                  No credit card required, full feature access.
                </p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>30-day full platform access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Up to 10 device configurations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>AI troubleshooting assistant</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Email support included</span>
                  </li>
                </ul>
                <Button variant="glow" className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-2">Sales Inquiries</h4>
                <p className="text-muted-foreground">sales@netauthai.com</p>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical Support</h4>
                <p className="text-muted-foreground">support@netauthai.com</p>
                <p className="text-muted-foreground">24/7 Enterprise Support</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Partnerships</h4>
                <p className="text-muted-foreground">partners@netauthai.com</p>
                <p className="text-muted-foreground">Channel & Technology Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;