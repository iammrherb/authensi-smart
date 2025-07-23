import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const vendorCategories = [
  {
    category: "Enterprise Leaders",
    level: "Advanced AI Optimization",
    vendors: [
      { name: "Cisco", models: "200+", protocols: ["IOS", "IOS-XE", "NX-OS", "ASA"] },
      { name: "Aruba/HPE", models: "150+", protocols: ["AOS-CX", "AOS-S", "Aruba OS"] },
      { name: "Juniper", models: "100+", protocols: ["EX", "QFX", "SRX", "MX"] },
      { name: "Fortinet", models: "80+", protocols: ["FortiSwitch", "FortiGate"] }
    ],
    color: "text-primary"
  },
  {
    category: "Network Innovators", 
    level: "Advanced AI Optimization",
    vendors: [
      { name: "Extreme", models: "60+", protocols: ["EXOS", "VOSS", "Fabric"] },
      { name: "Arista", models: "50+", protocols: ["EOS", "CloudVision"] },
      { name: "Meraki", models: "40+", protocols: ["Dashboard API"] },
      { name: "Dell", models: "35+", protocols: ["OS6", "OS9", "OS10"] }
    ],
    color: "text-primary"
  },
  {
    category: "Emerging Platforms",
    level: "Intermediate AI Support", 
    vendors: [
      { name: "Ubiquiti", models: "30+", protocols: ["UniFi", "EdgeMax"] },
      { name: "MikroTik", models: "25+", protocols: ["RouterOS"] },
      { name: "TP-Link", models: "20+", protocols: ["Omada"] },
      { name: "Netgear", models: "15+", protocols: ["ProSafe"] }
    ],
    color: "text-muted-foreground"
  }
];

const protocolSupport = [
  { protocol: "TACACS+", description: "Device administration and command authorization", icon: "🛡️" },
  { protocol: "RADIUS", description: "Network access authentication (802.1X, MAB, WebAuth)", icon: "🔐" },
  { protocol: "RADSEC", description: "Secure RADIUS with TLS 1.3 encryption", icon: "🔒" },
  { protocol: "802.1X", description: "Port-based network access control", icon: "🚪" }
];

const VendorsSection = () => {
  return (
    <section id="vendors" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="glow" className="mb-4">
            Universal Compatibility
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">50+</span> Network Vendors Supported
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI models are specifically trained on vendor syntax and best practices, 
            ensuring optimal configuration generation across your entire network infrastructure.
          </p>
        </div>

        {/* Protocol Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {protocolSupport.map((protocol, index) => (
            <Card key={index} className="text-center p-6 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">{protocol.icon}</div>
              <h3 className="text-xl font-bold mb-2">{protocol.protocol}</h3>
              <p className="text-sm text-muted-foreground">{protocol.description}</p>
            </Card>
          ))}
        </div>

        {/* Vendor Categories */}
        <div className="space-y-12">
          {vendorCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">{category.category}</h3>
                <Badge variant="glow" className="text-sm">
                  {category.level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.vendors.map((vendor, vendorIndex) => (
                  <Card key={vendorIndex} className="p-6 hover:scale-105 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className={`text-lg ${category.color}`}>
                        {vendor.name}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {vendor.models} models supported
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {vendor.protocols.map((protocol, protocolIndex) => (
                          <Badge key={protocolIndex} variant="secondary" className="text-xs mr-2">
                            {protocol}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Don't see your vendor? We're constantly adding support for new platforms.
          </p>
          <Badge variant="glow" className="cursor-pointer hover:scale-105 transition-transform">
            Request Vendor Support
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default VendorsSection;