
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface DiagramCanvasProps {
  components: any[];
  onComponentsChange: (components: any[]) => void;
  vendor: string;
}

const DiagramCanvas = ({ components, onComponentsChange, vendor }: DiagramCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const sampleComponents = [
    { id: "1", type: "portnox", name: "Portnox Server", x: 200, y: 150, icon: "🔐" },
    { id: "2", type: "switch", name: "Access Switch", x: 100, y: 300, icon: "🔌" },
    { id: "3", type: "firewall", name: "Firewall", x: 300, y: 300, icon: "🛡️" },
    { id: "4", type: "ad", name: "Active Directory", x: 400, y: 150, icon: "🏢" },
    { id: "5", type: "devices", name: "End Devices", x: 100, y: 450, icon: "💻" },
  ];

  useEffect(() => {
    if (components.length === 0) {
      onComponentsChange(sampleComponents);
    }
  }, [components, onComponentsChange]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="relative w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          🔍+
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          🔍-
        </Button>
        <Button variant="outline" size="sm" onClick={handleResetZoom}>
          ↻
        </Button>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="w-full h-full relative bg-gradient-to-br from-background to-muted/20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)
          `,
          backgroundSize: "20px 20px, 40px 40px",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="currentColor"
                className="text-primary"
              />
            </marker>
          </defs>
          
          {/* Authentication Flow */}
          <path
            d="M 250 180 Q 350 220 350 180"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="text-primary animate-pulse"
            markerEnd="url(#arrowhead)"
          />
          
          {/* Data Flow */}
          <path
            d="M 150 330 Q 200 280 200 180"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8,4"
            className="text-accent animate-pulse"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Network Components */}
        {components.map((component) => (
          <div
            key={component.id}
            className="absolute bg-card border border-border rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-move"
            style={{
              left: component.x,
              top: component.y,
              minWidth: "120px",
            }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{component.icon}</div>
              <div className="font-medium text-sm">{component.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {component.type}
              </div>
            </div>
          </div>
        ))}

        {/* Network Zones */}
        <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-lg">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium text-primary">
            Trusted Network Zone
          </div>
        </div>

        <div className="absolute bottom-4 right-4 left-4 top-3/4 border-2 border-dashed border-accent/30 rounded-lg">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium text-accent">
            User Access Zone
          </div>
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded px-3 py-2">
        <div className="text-xs text-muted-foreground">
          Zoom: {Math.round(zoom * 100)}% | Vendor: {vendor}
        </div>
      </div>
    </div>
  );
};

export default DiagramCanvas;
