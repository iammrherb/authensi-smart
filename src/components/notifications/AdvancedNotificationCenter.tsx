import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, Check, X, Settings, Filter, Search, AlertTriangle, Info, CheckCircle, Clock, User, Calendar, MessageSquare, Zap, Trash2, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'reminder' | 'mention';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  category: 'project' | 'system' | 'security' | 'update' | 'deadline' | 'mention' | 'approval';
  actionUrl?: string;
  actionLabel?: string;
  sender?: string;
  relatedProject?: string;
  expiresAt?: Date;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  projectUpdates: boolean;
  deadlineReminders: boolean;
  securityAlerts: boolean;
  mentionAlerts: boolean;
  systemUpdates: boolean;
  quietHours: { start: string; end: string };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Project Milestone Completed',
    message: 'Requirements gathering phase has been completed successfully. Ready to move to design phase.',
    type: 'success',
    priority: 'high',
    timestamp: new Date('2024-01-20T10:30:00'),
    isRead: false,
    isStarred: true,
    category: 'project',
    actionUrl: '/projects/123',
    actionLabel: 'View Project',
    sender: 'John Smith',
    relatedProject: 'NAC Implementation'
  },
  {
    id: '2',
    title: 'Security Alert',
    message: 'Unusual login activity detected from IP address 192.168.1.100. Please review immediately.',
    type: 'warning',
    priority: 'critical',
    timestamp: new Date('2024-01-20T09:15:00'),
    isRead: false,
    isStarred: false,
    category: 'security',
    actionUrl: '/security/logs',
    actionLabel: 'Review Security',
    sender: 'Security System'
  },
  {
    id: '3',
    title: 'Deadline Approaching',
    message: 'Network configuration review is due in 2 days. Please complete your review.',
    type: 'warning',
    priority: 'medium',
    timestamp: new Date('2024-01-20T08:00:00'),
    isRead: true,
    isStarred: false,
    category: 'deadline',
    actionUrl: '/tasks/456',
    actionLabel: 'View Task',
    relatedProject: 'Network Upgrade',
    expiresAt: new Date('2024-01-22T17:00:00')
  },
  {
    id: '4',
    title: 'You were mentioned in a comment',
    message: '@you Please review the latest network topology changes in the design document.',
    type: 'info',
    priority: 'medium',
    timestamp: new Date('2024-01-19T16:45:00'),
    isRead: true,
    isStarred: false,
    category: 'mention',
    actionUrl: '/documents/789',
    actionLabel: 'View Comment',
    sender: 'Jane Doe',
    relatedProject: 'NAC Implementation'
  },
  {
    id: '5',
    title: 'System Maintenance Scheduled',
    message: 'Planned maintenance window scheduled for tonight 11 PM - 3 AM EST. Systems may be temporarily unavailable.',
    type: 'info',
    priority: 'low',
    timestamp: new Date('2024-01-19T14:20:00'),
    isRead: true,
    isStarred: false,
    category: 'system',
    sender: 'System Administrator'
  }
];

const defaultSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  projectUpdates: true,
  deadlineReminders: true,
  securityAlerts: true,
  mentionAlerts: true,
  systemUpdates: true,
  quietHours: { start: '22:00', end: '08:00' },
  frequency: 'immediate'
};

const AdvancedNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.sender?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notification => notification.category === selectedCategory);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === selectedPriority);
    }

    // Apply unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead);
    }

    setFilteredNotifications(filtered);
  }, [searchQuery, selectedCategory, selectedPriority, showUnreadOnly, notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
      case 'reminder': return <Clock className="h-5 w-5 text-purple-500" />;
      case 'mention': return <MessageSquare className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const toggleStar = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isStarred: !notification.isStarred }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notification Center</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="mention">Mention</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <Label>Unread only</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-muted/30' : ''
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(notification.id);
                            }}
                          >
                            <Star className={`h-4 w-4 ${notification.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {notification.sender && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {notification.sender}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {notification.relatedProject && (
                            <span>Project: {notification.relatedProject}</span>
                          )}
                          {notification.expiresAt && (
                            <span className="text-yellow-600">
                              Expires: {notification.expiresAt.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        {notification.actionUrl && notification.actionLabel && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || showUnreadOnly
                      ? 'Try adjusting your search criteria'
                      : 'You\'re all caught up! No new notifications.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Methods */}
              <div className="space-y-4">
                <h3 className="font-semibold">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>SMS Notifications</Label>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Project Updates</Label>
                    <Switch
                      checked={settings.projectUpdates}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, projectUpdates: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Deadline Reminders</Label>
                    <Switch
                      checked={settings.deadlineReminders}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, deadlineReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Security Alerts</Label>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mention Alerts</Label>
                    <Switch
                      checked={settings.mentionAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, mentionAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>System Updates</Label>
                    <Switch
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, systemUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Timing Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Timing & Frequency</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Notification Frequency</Label>
                    <Select 
                      value={settings.frequency} 
                      onValueChange={(value: any) => setSettings(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Summary</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quiet Hours Start</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) =>
                          setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Quiet Hours End</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) =>
                          setSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => {
                  toast({
                    title: "Settings saved",
                    description: "Your notification preferences have been updated.",
                  });
                }}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedNotificationCenter;