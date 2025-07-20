import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Briefcase, MessageCircle, Linkedin, UserPlus, Loader2, Search, ExternalLink, Globe, Heart, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PublicProfile {
  id: string;
  name: string | null;
  title: string | null;
  location: string | null;
  bio: string | null;
  specialties: string[] | null;
  linkedin_url: string | null;
  other_social_url: string | null;
  mentor_status: string | null;
  avatar_url: string | null;
}

const ServicedinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [publicProfiles, setPublicProfiles] = useState<PublicProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());

  const [userProfile, setUserProfile] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    specialties: [] as string[],
    is_public: false,
    linkedin_url: "",
    other_social_url: "",
    mentor_status: "not_available"
  });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch current user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profileData) {
          setUserProfile({
            name: profileData.name || "",
            title: profileData.title || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            specialties: profileData.specialties || [],
            is_public: profileData.is_public || false,
            linkedin_url: profileData.linkedin_url || "",
            other_social_url: profileData.other_social_url || "",
            mentor_status: profileData.mentor_status || "not_available"
          });
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch public profiles
  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, name, title, location, bio, specialties, linkedin_url, other_social_url, mentor_status, avatar_url')
          .eq('is_public', true);

        if (error) {
          console.error('Error fetching public profiles:', error);
          toast({
            title: "Error",
            description: "Failed to load community profiles. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setPublicProfiles(profiles || []);
        setFilteredProfiles(profiles || []);
      } catch (error) {
        console.error('Error in fetchPublicProfiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfiles();
  }, [toast]);

  // Filter profiles based on search and mentor status
  useEffect(() => {
    let filtered = publicProfiles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by mentor status
    if (mentorFilter !== "all") {
      filtered = filtered.filter(profile => profile.mentor_status === mentorFilter);
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, mentorFilter, publicProfiles]);

  const handleConnect = (profileId: string) => {
    setConnectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  const getMentorBadgeProps = (mentorStatus: string | null) => {
    switch (mentorStatus) {
      case 'seeking_mentorship':
        return { variant: "secondary" as const, text: "Seeking Mentor", icon: GraduationCap };
      case 'willing_to_mentor':
        return { variant: "default" as const, text: "Willing to Mentor", icon: Heart };
      default:
        return null;
    }
  };

  const openSocialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Servicedin</h1>
          <p className="text-muted-foreground">Professional firefighter community directory</p>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading profile...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">
                    {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">{userProfile.name || 'Your Name'}</h3>
                    <p className="text-primary font-medium">{userProfile.title || 'Your Title'}</p>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location || 'Your Location'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.bio || 'Add your professional bio to let others know about your firefighting journey.'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {(() => {
                      const mentorBadge = getMentorBadgeProps(userProfile.mentor_status);
                      if (!mentorBadge) return null;
                      const IconComponent = mentorBadge.icon;
                      return (
                        <Badge variant={mentorBadge.variant} className="text-xs flex items-center gap-1">
                          <IconComponent className="h-3 w-3" />
                          {mentorBadge.text}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              {!userProfile.is_public && (
                <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium">Your profile is private</p>
                  <p className="text-xs text-muted-foreground">Enable public visibility in your profile settings to connect with other firefighters</p>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/profile')}
              >
                Edit Profile & Privacy Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Community Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, title, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={mentorFilter} onValueChange={setMentorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Mentor Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="willing_to_mentor">Willing to Mentor</SelectItem>
                <SelectItem value="seeking_mentorship">Seeking Mentorship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading community profiles...</span>
              </div>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {publicProfiles.length === 0 
                  ? "No public profiles available yet. Be the first to make your profile public!"
                  : "No profiles match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProfiles.map((profile) => {
                const isConnected = connectedUsers.has(profile.id);
                const mentorBadge = getMentorBadgeProps(profile.mentor_status);
                
                return (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={profile.avatar_url || ""} />
                            <AvatarFallback>
                              {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold">{profile.name || 'Anonymous'}</h3>
                              <p className="text-sm text-primary">{profile.title || 'Firefighter'}</p>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{profile.location || 'Location not specified'}</span>
                              </div>
                            </div>
                            {profile.bio && (
                              <p className="text-sm text-muted-foreground">{profile.bio}</p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {profile.specialties?.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                              {mentorBadge && (() => {
                                const IconComponent = mentorBadge.icon;
                                return (
                                  <Badge variant={mentorBadge.variant} className="text-xs flex items-center gap-1">
                                    <IconComponent className="h-3 w-3" />
                                    {mentorBadge.text}
                                  </Badge>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Button 
                            variant={isConnected ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handleConnect(profile.id)}
                            className="flex items-center space-x-1"
                          >
                            <UserPlus className="h-4 w-4" />
                            <span>{isConnected ? "Connected" : "Connect"}</span>
                          </Button>
                          
                          {isConnected && (
                            <div className="flex space-x-1">
                              {profile.linkedin_url && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => openSocialLink(profile.linkedin_url!)}
                                  title="LinkedIn Profile"
                                >
                                  <Linkedin className="h-4 w-4" />
                                </Button>
                              )}
                              {profile.other_social_url && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => openSocialLink(profile.other_social_url!)}
                                  title="Social Media Profile"
                                >
                                  <Globe className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Send Message">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Community Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{publicProfiles.length}</div>
              <div className="text-sm text-muted-foreground">Public Profiles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {publicProfiles.filter(p => p.mentor_status === 'willing_to_mentor').length}
              </div>
              <div className="text-sm text-muted-foreground">Available Mentors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {publicProfiles.filter(p => p.mentor_status === 'seeking_mentorship').length}
              </div>
              <div className="text-sm text-muted-foreground">Seeking Mentorship</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicedinPage;