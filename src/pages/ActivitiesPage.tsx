import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ActivityBannerCard, ActivityBannerSkeleton } from '@/components/ActivityBannerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, Plus } from 'lucide-react';

// Mock data adapted from ActivitiesGrid
const mockActivities = [
  {
    id: '1',
    title: 'Tigers FC vs Lions',
    type: 'match' as const,
    date: 'Dec 15, 2024',
    time: '15:00',
    location: 'Main Stadium',
  },
  {
    id: '2',
    title: 'Sprint Training Session',
    type: 'training' as const,
    date: 'Dec 18, 2024',
    time: '18:30',
    location: 'Training Ground',
  },
  {
    id: '3',
    title: 'End of Season BBQ',
    type: 'social' as const,
    date: 'Dec 22, 2024',
    time: '17:00',
    location: 'Club House',
  },
  {
    id: '4',
    title: 'Friendly vs Wolves',
    type: 'match' as const,
    date: 'Dec 29, 2024',
    time: '14:00',
    location: 'Local Pitch',
  }
];

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [activities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading] = useState(false);

  const handleActivityClick = (activityId: string) => {
    navigate(`/activities/${activityId}`);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const activityTypes = [
    { key: 'all', label: 'All Activities', count: activities.length },
    { key: 'match', label: 'Matches', count: activities.filter(a => a.type === 'match').length },
    { key: 'training', label: 'Training', count: activities.filter(a => a.type === 'training').length },
    { key: 'social', label: 'Social', count: activities.filter(a => a.type === 'social').length },
  ];

  return (
    <AppLayout>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-foreground">Activities</h1>
              <p className="text-muted-foreground">Stay connected with your team</p>
            </div>
            
            <Button className="self-start sm:self-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-xs mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activityTypes.map((type) => (
              <Badge
                key={type.key}
                variant={filterType === type.key ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 transition-all duration-200 ${
                  filterType === type.key 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setFilterType(type.key)}
              >
                {type.label} ({type.count})
              </Badge>
            ))}
          </div>

          {/* Activities List */}
          {isLoading ? (
            <div className="space-y-6">
              <ActivityBannerSkeleton />
              <ActivityBannerSkeleton />
              <ActivityBannerSkeleton />
              <ActivityBannerSkeleton />
            </div>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No activities found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No upcoming activities scheduled'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredActivities.map((activity) => (
                <ActivityBannerCard
                  key={activity.id}
                  activity={activity}
                  onClick={() => handleActivityClick(activity.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}