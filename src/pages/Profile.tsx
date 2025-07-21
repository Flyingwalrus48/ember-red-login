import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, MapPin, Briefcase, Shield, Flame, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    specialties: [] as string[],
    email: "",
    phone: "",
    experience: "",
    certifications: [] as string[],
    is_public: false,
    fire_school: "",
    mentorship_status: "not_available",
    linkedin_url: "",
    path_accomplishment: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user and profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/');
          return;
        }
        
        setUserId(user.id);

        // Fetch user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
          return;
        }

        // If profile exists, populate form
        if (profileData) {
          setProfile({
            name: profileData.name || "",
            title: profileData.title || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            email: profileData.email || user.email || "",
            phone: profileData.phone || "",
            experience: profileData.experience || "",
            specialties: profileData.specialties || [],
            certifications: profileData.certifications || [],
            is_public: profileData.is_public || false,
            fire_school: profileData.fire_school || "",
            mentorship_status: profileData.mentor_status || "not_available",
            linkedin_url: profileData.linkedin_url || "",
            path_accomplishment: profileData.path_accomplishment || ""
          });
        } else {
          // Set default email from auth user
          setProfile(prev => ({
            ...prev,
            email: user.email || "",
            is_public: false,
            fire_school: "",
            mentorship_status: "not_available",
            linkedin_url: "",
            path_accomplishment: ""
          }));
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleSave = async () => {
    console.log('🔄 Starting profile save operation...');
    
    if (!userId) {
      console.error('❌ No userId found');
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ User ID:', userId);
    setIsSaving(true);
    
    try {
      const profileData = {
        user_id: userId,
        name: profile.name || null,
        title: profile.title || null,
        location: profile.location || null,
        bio: profile.bio || null,
        email: profile.email || null,
        phone: profile.phone || null,
        experience: profile.experience || null,
        specialties: profile.specialties.length > 0 ? profile.specialties : null,
        certifications: profile.certifications.length > 0 ? profile.certifications : null,
        is_public: profile.is_public || null,
        fire_school: profile.fire_school || null,
        mentor_status: profile.mentorship_status || null,
        linkedin_url: profile.linkedin_url || null,
        path_accomplishment: profile.path_accomplishment || null,
        other_social_url: null,
        updated_at: new Date().toISOString()
      };

      console.log('📝 Profile data to save:', profileData);

      // Use upsert (insert or update) for more reliable operation
      console.log('💾 Attempting upsert operation...');
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })
        .select(); // Add select to see what was saved

      if (error) {
        console.error('❌ Upsert error:', error);
        throw error;
      }

      console.log('✅ Profile saved successfully:', data);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });

    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to save profile. Please try again.";
      
      if (error.message?.includes('relation "public.profiles" does not exist')) {
        errorMessage = "Database table not found. Please create the profiles table first.";
      } else if (error.message?.includes('permission denied')) {
        errorMessage = "Permission denied. Please check your database permissions.";
      } else if (error.message?.includes('violates')) {
        errorMessage = "Data validation error. Please check your input.";
      } else if (error.message) {
        errorMessage = `Database error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: field === 'is_public' ? value === 'true' || value === true : value
    }));
  };

  const removeSpecialty = (index: number) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty.trim() && !profile.specialties.includes(specialty.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty.trim()]
      }));
    }
  };

  // Show loading screen while fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/?tab=servicedin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Servicedin
            </Button>
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <Flame className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FireForce Training</h1>
              <p className="text-sm text-muted-foreground">Profile Settings</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Save Button - Only show when editing and scrolled down */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Photo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="space-y-2">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-24 flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    Upload
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{profile.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    ) : (
                      <p className="text-primary font-medium">{profile.title}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        value={profile.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.experience}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                {isEditing ? (
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={profile.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                ) : (
                  <p>{profile.linkedin_url}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fire_school">Fire School Graduated From</Label>
                {isEditing ? (
                  <Input
                    id="fire_school"
                    value={profile.fire_school}
                    onChange={(e) => handleInputChange('fire_school', e.target.value)}
                    placeholder="e.g., State Fire Academy"
                  />
                ) : (
                  <p>{profile.fire_school || "Not specified"}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mentorship_status">Mentorship Status</Label>
                {isEditing ? (
                  <Select 
                    value={profile.mentorship_status} 
                    onValueChange={(value) => handleInputChange('mentorship_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_available">Not specified</SelectItem>
                      <SelectItem value="seeking_mentorship">Seeking Mentorship</SelectItem>
                      <SelectItem value="willing_to_mentor">Willing to Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{profile.mentorship_status === 'not_available' ? 'Not specified' : profile.mentorship_status === 'seeking_mentorship' ? 'Seeking Mentorship' : profile.mentorship_status === 'willing_to_mentor' ? 'Willing to Mentor' : profile.mentorship_status}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="path_accomplishment">Recent PATH Accomplishment</Label>
              {isEditing ? (
                <Textarea
                  id="path_accomplishment"
                  value={profile.path_accomplishment}
                  onChange={(e) => handleInputChange('path_accomplishment', e.target.value)}
                  placeholder="Describe your recent PATH accomplishment or achievement..."
                  rows={3}
                />
              ) : (
                <p>{profile.path_accomplishment || "No recent PATH accomplishment listed"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="is_public">Make my profile visible in the Community Hub</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other members to view your profile and connect with you
                </p>
              </div>
              {isEditing ? (
                <Switch
                  id="is_public"
                  checked={profile.is_public}
                  onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                />
              ) : (
                <span className={`px-2 py-1 rounded text-sm ${profile.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {profile.is_public ? 'Public' : 'Private'}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle>Areas of Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {specialty}
                  {isEditing && (
                    <button
                      onClick={() => removeSpecialty(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && (
                <Badge variant="outline" className="cursor-pointer">
                  + Add Specialty
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;