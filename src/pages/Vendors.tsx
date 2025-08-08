import EnhancedVendorManagement from "@/components/vendors/EnhancedVendorManagement";
import { Badge } from "@/components/ui/badge";
import { VendorsDocsCrawlerPanel } from "@/components/vendors/VendorsDocsCrawlerPanel";

const Vendors = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🏭 Vendor Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Network Security <span className="bg-gradient-primary bg-clip-text text-transparent">Vendor Ecosystem</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive vendor management for NAC implementations. Track capabilities, 
              compatibility, certifications, and integration requirements across all supported platforms.
            </p>
          </div>
          
          <EnhancedVendorManagement />
          <VendorsDocsCrawlerPanel />
        </div>
      </div>
    </div>
  );
};

export default Vendors;