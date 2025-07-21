import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, UserPlus } from "lucide-react";

interface MemberProfile {
  id: number;
  name: string;
  title: string;
  location: string;
  mentorship_status: string;
  connected: boolean;
  avatar?: string;
}

interface MemberCardProps {
  profile: MemberProfile;
  onConnect: (userId: number) => void;
}

const MemberCard = ({ profile, onConnect }: MemberCardProps) => {
  // Format mentorship status for display
  const getMentorshipDisplay = (status: string) => {
    switch (status) {
      case 'seeking_mentorship':
        return 'Seeking Mentorship';
      case 'willing_to_mentor':
        return 'Willing to Mentor';
      case 'not_available':
        return 'Not Available';
      default:
        return status || 'Not Specified';
    }
  };

  // Get mentorship badge variant
  const getMentorshipVariant = (status: string) => {
    switch (status) {
      case 'seeking_mentorship':
        return 'default'; // Blue
      case 'willing_to_mentor':
        return 'secondary'; // Green-ish
      default:
        return 'outline'; // Gray
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Profile info */}
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="w-14 h-14 ring-2 ring-muted">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-lg font-semibold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-3 flex-1">
              {/* Name and title */}
              <div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {profile.name}
                </h3>
                <p className="text-primary font-medium text-sm">
                  {profile.title}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{profile.location}</span>
              </div>

              {/* Mentorship Status Badge */}
              <div>
                <Badge 
                  variant={getMentorshipVariant(profile.mentorship_status)}
                  className="font-medium px-3 py-1 text-xs"
                >
                  {getMentorshipDisplay(profile.mentorship_status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - Connect button */}
          <div className="ml-4">
            <Button 
              variant={profile.connected ? "secondary" : "default"}
              size="sm"
              onClick={() => onConnect(profile.id)}
              className="flex items-center space-x-2 min-w-[100px]"
            >
              <UserPlus className="h-4 w-4" />
              <span>{profile.connected ? "Connected" : "Connect"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;