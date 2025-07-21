-- Migration: Add path_accomplishment column to profiles table
-- Generated: 2025-07-20
-- Description: Adds path_accomplishment field for Recent PATH Accomplishment

-- Add path_accomplishment column (text, nullable)
ALTER TABLE profiles 
ADD COLUMN path_accomplishment text;

-- Add comment for documentation
COMMENT ON COLUMN profiles.path_accomplishment IS 'User recent PATH accomplishment or achievement';