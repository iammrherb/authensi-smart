import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  project: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  type: 'milestone' | 'deadline' | 'meeting' | 'deployment';
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Requirements Analysis Complete',
    description: 'Complete initial requirements gathering and analysis',
    date: '2024-02-15',
    status: 'completed',
    priority: 'high',
    assignee: 'John Smith',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: '2',
    title: 'Design Review Meeting',
    description: 'Review network design with stakeholders',
    date: '2024-02-20',
    status: 'pending',
    priority: 'high',
    assignee: 'Sarah Johnson',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: '3',
    title: 'Hardware Procurement',
    description: 'Order required network equipment',
    date: '2024-02-25',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Mike Davis',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: '4',
    title: 'POC Testing Complete',
    description: 'Complete proof of concept testing',
    date: '2024-01-30',
    status: 'overdue',
    priority: 'high',
    assignee: 'Lisa Wilson',
    project: 'Security Implementation'
  }
];

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Project Kickoff Meeting',
    type: 'meeting',
    date: '2024-02-18',
    time: '10:00 AM',
    duration: '1 hour',
    attendees: ['John Smith', 'Sarah Johnson', 'Mike Davis'],
    location: 'Conference Room A'
  },
  {
    id: '2',
    title: 'Design Review',
    type: 'meeting',
    date: '2024-02-20',
    time: '2:00 PM',
    duration: '2 hours',
    attendees: ['Sarah Johnson', 'Stakeholders'],
    location: 'Virtual Meeting'
  },
  {
    id: '3',
    title: 'Hardware Delivery',
    type: 'deployment',
    date: '2024-02-28',
    time: '9:00 AM',
    duration: '4 hours',
    attendees: ['Mike Davis', 'Vendor Team'],
    location: 'Data Center'
  }
];

export const TimelineManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return 'bg-blue-500';
      case 'deadline': return 'bg-red-500';
      case 'meeting': return 'bg-green-500';
      case 'deployment': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => event.date === date);
  };

  const getMilestonesForDate = (date: string) => {
    return mockMilestones.filter(milestone => milestone.date === date);
  };

  const filteredMilestones = mockMilestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || milestone.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderCalendarView = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50" />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const events = getEventsForDate(date);
      const milestones = getMilestonesForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            selectedDate === date ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-medium mb-1">{day}</div>
          <div className="space-y-1">
            {milestones.map(milestone => (
              <div 
                key={milestone.id} 
                className={`text-xs p-1 rounded truncate ${getStatusColor(milestone.status)} text-white`}
                title={milestone.title}
              >
                {milestone.title}
              </div>
            ))}
            {events.map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{getMonthName(currentMonth)}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center font-medium text-sm bg-gray-100">
              {day}
            </div>
          ))}
          {days}
        </div>
        
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getMilestonesForDate(selectedDate).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {getMilestonesForDate(selectedDate).map(milestone => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-sm text-muted-foreground">{milestone.project}</div>
                        </div>
                        <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getEventsForDate(selectedDate).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Events</h4>
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.time} • {event.duration} • {event.location}
                          </div>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getMilestonesForDate(selectedDate).length === 0 && getEventsForDate(selectedDate).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No events or milestones scheduled for this date
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMilestonesView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search milestones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredMilestones.map(milestone => (
          <Card key={milestone.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{milestone.title}</h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(milestone.status)}`} />
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(milestone.priority)}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Project: {milestone.project}</span>
                    <span>Assignee: {milestone.assignee}</span>
                    <span>Due: {milestone.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                    {milestone.status}
                  </Badge>
                  <Badge variant={milestone.priority === 'high' ? 'destructive' : milestone.priority === 'medium' ? 'default' : 'secondary'}>
                    {milestone.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Timeline Event
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockEvents.map(event => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type)}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {event.date} at {event.time} • Duration: {event.duration}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Location: {event.location}
                  </div>
                  {event.attendees.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Attendees: {event.attendees.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Timeline Manager</h1>
        <p className="text-muted-foreground">
          Manage project timelines, milestones, and events with comprehensive tracking and visualization
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {renderCalendarView()}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          {renderMilestonesView()}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {renderTimelineView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};