
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComponentLibraryProps {
  vendor: string;
}

const ComponentLibrary = ({ vendor }: ComponentLibraryProps) => {
  const componentCategories = {
    "Authentication Servers": [
      { id: "portnox", name: "Portnox NAC", icon: "🔐", desc: "Primary NAC server" },
      { id: "radius", name: "RADIUS Server", icon: "🌐", desc: "Authentication service" },
      { id: "ad", name: "Active Directory", icon: "🏢", desc: "Identity provider" },
      { id: "ldap", name: "LDAP Server", icon: "📋", desc: "Directory service" },
    ],
    "Network Infrastructure": [
      { id: "switch", name: "Access Switch", icon: "🔌", desc: "Layer 2 switch" },
      { id: "router", name: "Router", icon: "🔀", desc: "Layer 3 routing" },
      { id: "firewall", name: "Firewall", icon: "🛡️", desc: "Security gateway" },
      { id: "wireless", name: "Wireless AP", icon: "📡", desc: "WiFi access point" },
    ],
    "Security Components": [
      { id: "ids", name: "IDS/IPS", icon: "🚨", desc: "Intrusion detection" },
      { id: "siem", name: "SIEM", icon: "📊", desc: "Security monitoring" },
      { id: "proxy", name: "Web Proxy", icon: "🔒", desc: "Web filtering" },
      { id: "vpn", name: "VPN Gateway", icon: "🌐", desc: "Remote access" },
    ],
    "End Devices": [
      { id: "laptop", name: "Laptops", icon: "💻", desc: "User devices" },
      { id: "mobile", name: "Mobile Devices", icon: "📱", desc: "Smartphones/tablets" },
      { id: "iot", name: "IoT Devices", icon: "🏠", desc: "Smart devices" },
      { id: "server", name: "Servers", icon: "🖥️", desc: "Application servers" },
    ],
  };

  return (
    <div className="space-y-4">
      {Object.entries(componentCategories).map(([category, components]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-sm">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("component", JSON.stringify(component));
                  }}
                >
                  <div className="text-lg">{component.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{component.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {component.desc}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Drag
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComponentLibrary;
