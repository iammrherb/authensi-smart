
import { Badge } from "@/components/ui/badge";

interface VendorSelectorProps {
  selectedVendor: string;
  onVendorChange: (vendor: string) => void;
}

const VendorSelector = ({ selectedVendor, onVendorChange }: VendorSelectorProps) => {
  const vendors = [
    { id: "portnox", name: "Portnox", icon: "🔐", color: "bg-blue-500" },
    { id: "cisco", name: "Cisco ISE", icon: "🌐", color: "bg-blue-600" },
    { id: "aruba", name: "Aruba ClearPass", icon: "📡", color: "bg-orange-500" },
    { id: "fortinet", name: "FortiNAC", icon: "🛡️", color: "bg-red-500" },
    { id: "juniper", name: "Juniper NAC", icon: "🌲", color: "bg-green-600" },
    { id: "azure", name: "Azure AD", icon: "☁️", color: "bg-blue-400" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Select Primary Vendor</h3>
      <div className="grid grid-cols-1 gap-2">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedVendor === vendor.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50 hover:bg-accent"
            }`}
            onClick={() => onVendorChange(vendor.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg ${vendor.color} flex items-center justify-center text-white text-sm`}>
                {vendor.icon}
              </div>
              <div>
                <div className="font-medium text-sm">{vendor.name}</div>
                <div className="text-xs text-muted-foreground">
                  {vendor.id === "portnox" && "AI-Optimized"}
                  {vendor.id === "cisco" && "Enterprise"}
                  {vendor.id === "aruba" && "Wireless-First"}
                  {vendor.id === "fortinet" && "Security-First"}
                  {vendor.id === "juniper" && "Performance"}
                  {vendor.id === "azure" && "Cloud-Native"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-accent/50 rounded-lg">
        <div className="text-sm font-medium mb-1">Selected: {vendors.find(v => v.id === selectedVendor)?.name}</div>
        <div className="text-xs text-muted-foreground">
          Configuration will be optimized for this vendor's best practices
        </div>
      </div>
    </div>
  );
};

export default VendorSelector;
