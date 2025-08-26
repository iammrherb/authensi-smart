
import { Badge } from "@/components/ui/badge";
import { unifiedVendorLibrary } from "@/data/unifiedVendorLibrary";

interface VendorSelectorProps {
  selectedVendor: string;
  onVendorChange: (vendor: string) => void;
}

const VendorSelector = ({ selectedVendor, onVendorChange }: VendorSelectorProps) => {
  const vendors = unifiedVendorLibrary.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    icon: vendor.icon,
    color: vendor.color,
    description: vendor.description,
    category: vendor.category
  }));

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
                  {vendor.description}
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
