import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabLayoutProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const TabLayout = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  orientation = "horizontal"
}: TabLayoutProps) => {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn("w-full", className)}
    >
      <TabsList className={cn(
        "grid w-full",
        orientation === "horizontal" 
          ? `grid-cols-${Math.min(tabs.length, 6)}` 
          : "grid-rows-auto"
      )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="flex items-center space-x-2"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          <Card className="gradient-border">
            {tab.content}
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};