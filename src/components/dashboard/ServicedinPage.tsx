import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, MessageCircle, Instagram, Plus, Loader2, ExternalLink, GraduationCap, HandHeart, Globe, Lock, Award, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MemberCard from "@/components/dashboard/MemberCard";

const ServicedinPage = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Captain, Station 12",
      department: "LAFD",
      location: "Los Angeles, CA",
      yearsExp: 8,
      specialties: ["Rescue Operations", "Training"],
      avatar: "",
      connected: true,
      hasInstagram: true,
      mentorship_status: "willing_to_mentor"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      title: "Fire Inspector",
      department: "Chicago FD",
      location: "Chicago, IL",
      yearsExp: 5,
      specialties: ["Fire Prevention", "Code Enforcement"],
      avatar: "",
      connected: false,
      hasInstagram: false,
      mentorship_status: "seeking_mentorship"
    },
    {
      id: 3,
      name: "Emily Chen",
      title: "Paramedic/Firefighter",
      department: "Miami-Dade Fire Rescue",
      location: "Miami, FL",
      yearsExp: 3,
      specialties: ["Emergency Medicine", "Community Outreach"],
      avatar: "",
      connected: true,
      hasInstagram: true,
      mentorship_status: "not_available"
    }
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    specialties: [] as string[],
    connectionsCount: 47,
    hasInstagram: false,
    fire_school: "",
    mentorship_status: "",
    linkedin_url: "",
    is_public: false,
    path_accomplishment: ""
  });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorshipFilter, setMentorshipFilter] = useState("all");
  const [municipalityFilter, setMunicipalityFilter] = useState("all");

  // Fetch current user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, title, location, bio, specialties, fire_school, mentor_status, linkedin_url, is_public, path_accomplishment')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        // Update profile state with fetched data or defaults
        if (profileData) {
          setUserProfile({
            name: profileData.name || "Firefighter",
            title: profileData.title || "Fire Academy Graduate",
            location: profileData.location || "Location not set",
            bio: profileData.bio || "Professional firefighter focused on emergency response and community service.",
            specialties: profileData.specialties || [],
            connectionsCount: 47, // Keep static for now
            hasInstagram: false,
            fire_school: profileData.fire_school || "",
            mentorship_status: profileData.mentor_status || "",
            linkedin_url: profileData.linkedin_url || "",
            is_public: profileData.is_public || false,
            path_accomplishment: profileData.path_accomplishment || ""
          });
        } else {
          // No profile found - set defaults with user's email info
          setUserProfile(prev => ({
            ...prev,
            name: user.email?.split('@')[0] || "Firefighter",
            title: "Fire Academy Graduate",
            location: "Location not set"
          }));
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleConnect = (userId: number) => {
    setConnections(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, connected: !user.connected } : user
      )
    );
  };

  // Filter connections based on search and filters
  const filteredConnections = connections.filter(person => {
    // Search by name
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by mentorship status
    const matchesMentorship = mentorshipFilter === "all" || person.mentorship_status === mentorshipFilter;
    
    // Filter by municipality (simplified - using location field)
    const matchesMunicipality = municipalityFilter === "all" || 
      (municipalityFilter === "los-angeles" && person.location.includes("Los Angeles")) ||
      (municipalityFilter === "chicago" && person.location.includes("Chicago")) ||
      (municipalityFilter === "miami" && person.location.includes("Miami")) ||
      (municipalityFilter === "new-york" && person.location.includes("New York")) ||
      (municipalityFilter === "houston" && person.location.includes("Houston")) ||
      (municipalityFilter === "phoenix" && person.location.includes("Phoenix"));
    
    return matchesSearch && matchesMentorship && matchesMunicipality;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Servicedin</h1>
          <p className="text-muted-foreground">Professional firefighter networking</p>
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{userProfile.name || 'Your Name'}</h3>
                      <p className="text-primary font-medium">{userProfile.title || 'Your Title'}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location || 'Your Location'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      {userProfile.is_public ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Globe className="h-4 w-4" />
                          <span>Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Lock className="h-4 w-4" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{userProfile.bio || 'Add your professional bio to let others know about your firefighting journey.'}</p>
                </div>
              </div>

              {/* Professional Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                {userProfile.fire_school && (
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fire School:</span>
                    <span className="text-muted-foreground">{userProfile.fire_school}</span>
                  </div>
                )}
                {userProfile.mentorship_status && userProfile.mentorship_status !== 'not_available' && (
                  <div className="flex items-center space-x-2 text-sm">
                    <HandHeart className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mentorship:</span>
                    <span className="text-muted-foreground">
                      {userProfile.mentorship_status === 'seeking_mentorship' ? 'Seeking Mentorship' :
                       userProfile.mentorship_status === 'willing_to_mentor' ? 'Willing to Mentor' :
                       userProfile.mentorship_status}
                    </span>
                  </div>
                )}
                {userProfile.linkedin_url && (
                  <div className="flex items-center space-x-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">LinkedIn:</span>
                    <a 
                      href={userProfile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Recent PATH Accomplishment Section */}
              {userProfile.path_accomplishment && (
                <div className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start space-x-2">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Recent PATH Accomplishment</h4>
                      <p className="text-sm text-muted-foreground">{userProfile.path_accomplishment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialties and Connections */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{userProfile.connectionsCount} connections</span>
                  </div>
                  {userProfile.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {userProfile.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {userProfile.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{userProfile.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - LinkedIn/Reddit Style */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => navigate('/profile')}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <span>Edit Profile</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </Button>
                </div>
                <div className="flex space-x-1">
                  {userProfile.linkedin_url && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(userProfile.linkedin_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  {!userProfile.hasInstagram && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      title="Connect Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Feed/Connections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Network</h2>
          <Button size="sm" className="flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>Find Firefighters</span>
          </Button>
        </div>

        {/* Action Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Action Center</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mentorship Status Filter */}
              <div>
                <Select value={mentorshipFilter} onValueChange={setMentorshipFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Mentorship Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mentorship Status</SelectItem>
                    <SelectItem value="seeking_mentorship">Seeking Mentorship</SelectItem>
                    <SelectItem value="willing_to_mentor">Willing to Mentor</SelectItem>
                    <SelectItem value="not_available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Municipality Filter */}
              <div>
                <Select value={municipalityFilter} onValueChange={setMunicipalityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Municipalities</SelectItem>
                    <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                    <SelectItem value="chicago">Chicago, IL</SelectItem>
                    <SelectItem value="miami">Miami, FL</SelectItem>
                    <SelectItem value="new-york">New York, NY</SelectItem>
                    <SelectItem value="houston">Houston, TX</SelectItem>
                    <SelectItem value="phoenix">Phoenix, AZ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((person) => (
              <MemberCard 
                key={person.id} 
                profile={person} 
                onConnect={handleConnect}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">No members found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Network Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Network Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{connections.filter(c => c.connected).length}</div>
              <div className="text-sm text-muted-foreground">Active Connections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Departments Represented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Cities/Regions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicedinPage;