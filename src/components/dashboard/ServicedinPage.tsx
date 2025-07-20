import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Briefcase, MessageCircle, Instagram, Plus, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      hasInstagram: true
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
      hasInstagram: false
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
      hasInstagram: true
    }
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    specialties: [] as string[],
    connectionsCount: 47,
    hasInstagram: false
  });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
          .select('*')
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
            hasInstagram: false
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
                <p className="text-sm text-muted-foreground">{userProfile.bio || 'Add your professional bio to let others know about your firefighting journey.'}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.connectionsCount} connections</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/profile')}
                  >
                    Edit Profile
                  </Button>
                  {!userProfile.hasInstagram && (
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Instagram className="h-4 w-4" />
                      <span>Connect Instagram</span>
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

        <div className="grid gap-4">
          {connections.map((person) => (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-primary">{person.title}</p>
                        <p className="text-sm text-muted-foreground">{person.department}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{person.location}</span>
                        <span>•</span>
                        <Briefcase className="h-3 w-3" />
                        <span>{person.yearsExp} years experience</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {person.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button 
                      variant={person.connected ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleConnect(person.id)}
                      className="flex items-center space-x-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{person.connected ? "Connected" : "Connect"}</span>
                    </Button>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      {person.hasInstagram && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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