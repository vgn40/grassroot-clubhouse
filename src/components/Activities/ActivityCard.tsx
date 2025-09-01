import React from 'react';
import { Calendar, MapPin, Users, Trophy, Target, Coffee, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Activity {
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
  description?: string;
}

interface ActivityCardProps {
  activity: Activity;
  onRSVP?: (activityId: string, response: 'going' | 'not-going') => void;
  onClick?: (activityId: string) => void;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'match': return Trophy;
    case 'training': return Target;
    case 'social': return Coffee;
    default: return Calendar;
  }
};

const getActivityCardClass = (type: Activity['type']) => {
  switch (type) {
    case 'match': return 'activity-card-match hover-lift';
    case 'training': return 'activity-card-training hover-lift';
    case 'social': return 'activity-card-social hover-lift';
    default: return 'hover-lift';
  }
};

const getActivityGradient = (type: Activity['type']) => {
  switch (type) {
    case 'match': return 'bg-gradient-match';
    case 'training': return 'bg-gradient-training';
    case 'social': return 'bg-gradient-social';
    default: return 'bg-gradient-soft';
  }
};

export function ActivityCard({ activity, onRSVP, onClick }: ActivityCardProps) {
  const { id, title, type, date, time, location, opponent, rsvp, description } = activity;
  const Icon = getActivityIcon(type);

  const handleRSVP = (response: 'going' | 'not-going', e: React.MouseEvent) => {
    e.stopPropagation();
    onRSVP?.(id, response);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <Card 
      className={`${getActivityCardClass(type)} cursor-pointer border shadow-card`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className={`${getActivityGradient(type)} p-4 text-white relative overflow-hidden`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Icon className="h-3 w-3 mr-1" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              <div className="flex items-center gap-1 text-white/90">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{rsvp.going}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 leading-tight">{title}</h3>
            
            {opponent && (
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-sm">vs</span>
                <span className="font-semibold">{opponent.name}</span>
                <span className="text-lg">{opponent.logo}</span>
              </div>
            )}
          </div>
          
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Icon className="w-full h-full" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Date & Time & Location */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">{date}</p>
                <p className="text-muted-foreground text-xs">{time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-xs">{location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}

          {/* Members Preview */}
          {rsvp.goingMembers && rsvp.goingMembers.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {rsvp.goingMembers.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="w-7 h-7 border-2 border-white">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {rsvp.going > 3 && (
                  <div className="w-7 h-7 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-medium text-muted-foreground">
                    +{rsvp.going - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">going</span>
            </div>
          )}

          {/* RSVP Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={(e) => handleRSVP('going', e)}
              variant={rsvp.userResponse === 'going' ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 transition-all duration-200 ${
                rsvp.userResponse === 'going' 
                  ? 'rsvp-button-going' 
                  : 'hover:border-green-400 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              ✅ Going
            </Button>
            <Button
              onClick={(e) => handleRSVP('not-going', e)}
              variant={rsvp.userResponse === 'not-going' ? 'destructive' : 'outline'}
              size="sm"
              className={`flex-1 transition-all duration-200 ${
                rsvp.userResponse === 'not-going' 
                  ? 'rsvp-button-not-going' 
                  : 'hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              ❌ Can't Make It
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}