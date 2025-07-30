import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
  content: React.ReactNode;
  description?: string;
}

interface TabLayoutProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  className = "",
  variant = 'default'
}) => {
  const tabValue = activeTab || defaultTab || tabs[0]?.id;

  return (
    <div className={`w-full ${className}`}>
      <Tabs 
        value={tabValue} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className={`
          grid w-full 
          ${variant === 'pills' ? 'bg-muted p-1 rounded-lg' : ''}
          ${variant === 'underline' ? 'bg-transparent border-b' : ''}
        `} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={`
                flex items-center gap-2 text-sm font-medium transition-all
                ${variant === 'pills' ? 'rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm' : ''}
                ${variant === 'underline' ? 'border-b-2 border-transparent data-[state=active]:border-primary rounded-none' : ''}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id}
            className="mt-6 focus-visible:outline-none"
          >
            {tab.description ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tab.icon && <tab.icon className="h-5 w-5" />}
                    {tab.label}
                  </CardTitle>
                  <CardDescription>
                    {tab.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tab.content}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tab.content}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabLayout;