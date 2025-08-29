import React from 'react';
import { Calendar, MapPin, Users, Share2, Edit3, Trash2, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
      userResponse: null
    },
    isAdmin: false
  }
}) => {
  const { title, type, date, time, location, opponent, notes, rsvp, isAdmin } = activity;

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <div className="relative h-48 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            {type === 'match' && <Trophy className="h-5 w-5" />}
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        </div>
      </div>

      <div className="px-4 pb-20 -mt-4">
        {/* Main Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-warm rounded-2xl overflow-hidden mb-6">
          <div className="p-6 space-y-6">
            {/* Date, Time & Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{location}</span>
              </div>
            </div>

            {/* Opponent Section */}
            {opponent && type === 'match' && (
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                    {opponent.logo}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Opponent</p>
                    <p className="font-semibold text-foreground">{opponent.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* RSVP Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Who's Coming?</h3>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant={rsvp.userResponse === 'going' ? 'default' : 'outline'}
                  className="flex-1 h-12"
                >
                  Going ({rsvp.going})
                </Button>
                <Button 
                  variant={rsvp.userResponse === 'not-going' ? 'destructive' : 'outline'}
                  className="flex-1 h-12"
                >
                  Not Going ({rsvp.notGoing})
                </Button>
              </div>
            </div>

            {/* Notes Section */}
            {notes && (
              <div className="bg-accent/30 rounded-xl p-4">
                <h3 className="font-semibold mb-2 text-accent-foreground">Notes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
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