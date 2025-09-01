import React, { useState } from 'react';
import { ActivityCard } from './ActivityCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar } from 'lucide-react';

// Mock data for activities
const mockActivities = [
  {
    id: '1',
    title: 'Tigers FC vs Lions',
    type: 'match' as const,
    date: 'Dec 15, 2024',
    time: '15:00',
    location: 'Main Stadium',
    opponent: { name: 'Lions FC', logo: '🦁' },
    description: 'Championship semifinal match. Bring your energy!',
    rsvp: {
      going: 18,
      notGoing: 2,
      userResponse: null,
      goingMembers: [
        { id: '1', name: 'Alex Morgan', avatar: '/placeholder.svg' },
        { id: '2', name: 'Sarah Johnson', avatar: '/placeholder.svg' },
        { id: '3', name: 'Mike Wilson', avatar: '/placeholder.svg' },
      ]
    }
  },
  {
    id: '2',
    title: 'Sprint Training Session',
    type: 'training' as const,
    date: 'Dec 18, 2024',
    time: '18:30',
    location: 'Training Ground',
    description: 'High-intensity sprint work. Bring water and energy!',
    rsvp: {
      going: 12,
      notGoing: 3,
      userResponse: 'going' as const,
      goingMembers: [
        { id: '4', name: 'Emma Davis', avatar: '/placeholder.svg' },
        { id: '5', name: 'Tom Brown', avatar: '/placeholder.svg' },
      ]
    }
  },
  {
    id: '3',
    title: 'End of Season BBQ',
    type: 'social' as const,
    date: 'Dec 22, 2024',
    time: '17:00',
    location: 'Club House',
    description: 'Celebrate our amazing season with food, drinks, and good company!',
    rsvp: {
      going: 25,
      notGoing: 1,
      userResponse: null,
      goingMembers: [
        { id: '6', name: 'Lisa Chen', avatar: '/placeholder.svg' },
        { id: '7', name: 'David Miller', avatar: '/placeholder.svg' },
        { id: '8', name: 'Kate Anderson', avatar: '/placeholder.svg' },
      ]
    }
  },
  {
    id: '4',
    title: 'Friendly vs Wolves',
    type: 'match' as const,
    date: 'Dec 29, 2024',
    time: '14:00',
    location: 'Local Pitch',
    opponent: { name: 'Wolves United', logo: '🐺' },
    description: 'Friendly match to keep match fitness during the break.',
    rsvp: {
      going: 15,
      notGoing: 4,
      userResponse: 'not-going' as const,
      goingMembers: [
        { id: '9', name: 'Ryan Smith', avatar: '/placeholder.svg' },
        { id: '10', name: 'Grace Lee', avatar: '/placeholder.svg' },
      ]
    }
  }
];

interface ActivitiesGridProps {
  onActivityClick?: (activityId: string) => void;
}

export function ActivitiesGrid({ onActivityClick }: ActivitiesGridProps) {
  const [activities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleRSVP = (activityId: string, response: 'going' | 'not-going') => {
    console.log(`RSVP for activity ${activityId}: ${response}`);
    // In a real app, this would update the backend
  };

  const activityTypes = [
    { key: 'all', label: 'All Activities', count: activities.length },
    { key: 'match', label: 'Matches', count: activities.filter(a => a.type === 'match').length },
    { key: 'training', label: 'Training', count: activities.filter(a => a.type === 'training').length },
    { key: 'social', label: 'Social', count: activities.filter(a => a.type === 'social').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">Activities</h1>
          <p className="text-muted-foreground">Stay connected with your team</p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {activityTypes.map((type) => (
          <Badge
            key={type.key}
            variant={filterType === type.key ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 hover-scale ${
              filterType === type.key 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'hover:bg-muted'
            }`}
            onClick={() => setFilterType(type.key)}
          >
            {type.label} ({type.count})
          </Badge>
        ))}
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No activities found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No upcoming activities scheduled'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onRSVP={handleRSVP}
              onClick={onActivityClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}