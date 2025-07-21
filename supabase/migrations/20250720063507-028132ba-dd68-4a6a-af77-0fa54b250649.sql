-- Add new columns to profiles table for Servicedin Community Hub
ALTER TABLE public.profiles 
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN other_social_url TEXT,
ADD COLUMN mentor_status TEXT CHECK (mentor_status IN ('seeking_mentorship', 'willing_to_mentor', 'not_available')) DEFAULT 'not_available';

-- Create index for better performance when filtering public profiles
CREATE INDEX idx_profiles_is_public ON public.profiles(is_public) WHERE is_public = true;

-- Create index for mentor status filtering
CREATE INDEX idx_profiles_mentor_status ON public.profiles(mentor_status) WHERE mentor_status != 'not_available';