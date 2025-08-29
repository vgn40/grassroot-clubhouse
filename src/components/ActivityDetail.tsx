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
      <div className="bg-white border-b border-border/50">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            {type === 'match' && <Trophy className="h-5 w-5 text-primary" />}
            <Badge variant="secondary" className="text-xs font-medium">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Main Content Card */}
        <Card className="bg-white border border-border/50 shadow-sm rounded-xl overflow-hidden mb-6">
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
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-xl border border-border/50">
                    {opponent.logo}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Opponent</p>
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
              
              <div className="flex gap-2">
                <Button 
                  variant={rsvp.userResponse === 'going' ? 'default' : 'outline'}
                  className="flex-1 h-10 text-sm"
                >
                  Going ({rsvp.going})
                </Button>
                <Button 
                  variant={rsvp.userResponse === 'not-going' ? 'destructive' : 'outline'}
                  className="flex-1 h-10 text-sm"
                >
                  Not Going ({rsvp.notGoing})
                </Button>
              </div>
            </div>

            {/* Notes Section */}
            {notes && (
              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">Notes</h3>
                <p className="text-sm text-foreground leading-relaxed">{notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex gap-2 max-w-md mx-auto">
          <Button variant="outline" size="sm" className="flex-1 h-9">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" className="flex-1 h-9">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex-1 h-9">
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