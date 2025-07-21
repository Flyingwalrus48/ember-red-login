-- Migration: Add new columns to profiles table
-- Generated: 2025-07-20
-- Description: Adds is_public, fire_school, mentorship_status, and linkedin_url columns

-- Add is_public column (boolean, default false)
ALTER TABLE profiles 
ADD COLUMN is_public boolean DEFAULT false;

-- Add fire_school column (text, nullable)
ALTER TABLE profiles 
ADD COLUMN fire_school text;

-- Add mentorship_status column (text, default 'Not specified')
ALTER TABLE profiles 
ADD COLUMN mentorship_status text DEFAULT 'Not specified';

-- Add linkedin_url column (text, nullable)
ALTER TABLE profiles 
ADD COLUMN linkedin_url text;

-- Optional: Add comments for documentation
COMMENT ON COLUMN profiles.is_public IS 'Indicates if the profile is publicly visible';
COMMENT ON COLUMN profiles.fire_school IS 'Fire department or training school attended';
COMMENT ON COLUMN profiles.mentorship_status IS 'Current mentorship availability status';
COMMENT ON COLUMN profiles.linkedin_url IS 'LinkedIn profile URL';