import React from 'react';
import { Calendar, MapPin, Users, Share2, Edit3, Trash2, Clock, Trophy, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClubSettings } from '@/hooks/useClubSettings';

interface ActivityDetailProps {
  activity?: {
    id: string;
    title: string;
    type: 'match' | 'training' | 'social' | 'other';
    date: string;
    time: string;
    location: string;
    opponent?: {
      name: string;
      logo: string;
    };
    notes?: string;
    rsvp: {
      going: number;
      notGoing: number;
      userResponse?: 'going' | 'not-going' | null;
      goingMembers?: Array<{
        id: string;
        name: string;
        avatar?: string;
      }>;
    };
    clubColors?: {
      primary: string;
      secondary: string;
    };
    isAdmin?: boolean;
  };
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ 
  activity = {
    id: '1',
    title: '12e1e21 vs Tigers',
    type: 'match',
    date: 'Dec 1, 2025',
    time: '17:00',
    location: 'Hallen',
    opponent: {
      name: 'Tigers FC',
      logo: '🐅'
    },
    notes: 'Bring indoor shoes and water bottle',
    rsvp: {
      going: 12,
      notGoing: 3,
      userResponse: null,
      goingMembers: [
        { id: '1', name: 'Alex M.', avatar: '/placeholder.svg' },
        { id: '2', name: 'Sarah K.', avatar: '/placeholder.svg' },
        { id: '3', name: 'Mike R.', avatar: '/placeholder.svg' },
      ]
    },
    clubColors: {
      primary: '#2563eb',
      secondary: '#1e40af'
    },
    isAdmin: false
  }
}) => {
  const { title, type, date, time, location, opponent, notes, rsvp, clubColors, isAdmin } = activity;

  // Fetch club settings for dynamic colors (fallback to activity.clubColors)
  const clubId = "tigers-fc"; // In real app, this would come from activity data or context
  const { data: clubSettings } = useClubSettings(clubId);
  
  // Use colors from club settings if available, otherwise fallback to activity prop or defaults
  const primaryColor = clubSettings?.primary_color || clubColors?.primary || '#2563eb';
  const secondaryColor = clubSettings?.secondary_color || clubColors?.secondary || '#1e40af';

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section with Club Colors */}
      <div 
        className="relative h-56 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
        <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            {type === 'match' && <Trophy className="h-6 w-6 animate-pulse" />}
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-2">{title}</h1>
          {opponent && (
            <div className="flex items-center gap-2 text-white/90">
              <span className="text-lg">vs</span>
              <span className="text-xl font-semibold">{opponent.name}</span>
              <span className="text-2xl ml-1">{opponent.logo}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-24 -mt-6">
        {/* Core Info Card */}
        <Card className="bg-white border-0 shadow-warm rounded-2xl mb-6 animate-fade-in">
          <div className="p-6 space-y-6">
            {/* Date, Time & Location */}
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                  <p className="font-bold text-lg text-foreground">{date}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-3 flex-1 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">{time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-1 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-sm">{location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg">Who's Coming?</h3>
                </div>
                <span className="text-sm text-muted-foreground">{rsvp.going} going</span>
              </div>

              {/* Member Avatars */}
              {rsvp.goingMembers && rsvp.goingMembers.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {rsvp.goingMembers.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="w-10 h-10 border-2 border-white hover-scale">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {rsvp.going > 4 && (
                      <div className="w-10 h-10 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        +{rsvp.going - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">and others</span>
                </div>
              )}
              
              {/* RSVP Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant={rsvp.userResponse === 'going' ? 'default' : 'outline'}
                  className={`flex-1 h-12 font-bold transition-all duration-200 hover-scale ${
                    rsvp.userResponse === 'going' 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  ✅ Going ({rsvp.going})
                </Button>
                <Button 
                  variant={rsvp.userResponse === 'not-going' ? 'destructive' : 'outline'}
                  className={`flex-1 h-12 font-medium transition-all duration-200 hover-scale ${
                    rsvp.userResponse === 'not-going' 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'hover:bg-gray-50 text-muted-foreground'
                  }`}
                >
                  ❌ Can't Make It ({rsvp.notGoing})
                </Button>
              </div>
            </div>

            {/* Notes Section */}
            {notes && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">Important Notes</h3>
                    <p className="text-sm text-yellow-700 leading-relaxed">{notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 p-4 shadow-2xl">
        <div className="flex gap-3 max-w-md mx-auto">
          {!isAdmin && (
            <Button 
              variant={rsvp.userResponse === 'going' ? 'default' : 'outline'}
              className="flex-1 h-11 font-semibold transition-all duration-200 hover-scale"
              style={{
                backgroundColor: rsvp.userResponse === 'going' ? primaryColor : undefined,
                borderColor: rsvp.userResponse !== 'going' ? primaryColor : undefined
              }}
            >
              {rsvp.userResponse === 'going' ? '✅ Going' : 'RSVP Now'}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-11 px-4 hover-scale"
            aria-label="Share event"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          {isAdmin && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-11 hover-scale"
                aria-label="Edit event"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1 h-11 hover-scale"
                aria-label="Delete event"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;