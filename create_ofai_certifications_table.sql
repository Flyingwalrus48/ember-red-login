-- Migration: Create ofai_certifications table
-- Generated: 2025-07-20
-- Description: Creates table to track OFAI certification status for users

-- Create the ofai_certifications table
CREATE TABLE ofai_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    certification_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Not Started',
    completion_date DATE,
    expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to profiles table
ALTER TABLE ofai_certifications 
ADD CONSTRAINT fk_ofai_certifications_user_id 
FOREIGN KEY (user_id) 
REFERENCES profiles(user_id) 
ON DELETE CASCADE;

-- Add check constraint for status values (optional but recommended)
ALTER TABLE ofai_certifications 
ADD CONSTRAINT check_status_values 
CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Expired', 'Failed'));

-- Create index on user_id for better query performance
CREATE INDEX idx_ofai_certifications_user_id ON ofai_certifications(user_id);

-- Create index on status for filtering performance
CREATE INDEX idx_ofai_certifications_status ON ofai_certifications(status);

-- Add comments for documentation
COMMENT ON TABLE ofai_certifications IS 'Tracks OFAI certification status and progress for users';
COMMENT ON COLUMN ofai_certifications.id IS 'Unique identifier for each certification record';
COMMENT ON COLUMN ofai_certifications.user_id IS 'References the user_id in profiles table';
COMMENT ON COLUMN ofai_certifications.certification_name IS 'Name of the OFAI test/certification';
COMMENT ON COLUMN ofai_certifications.status IS 'Current status of the certification';
COMMENT ON COLUMN ofai_certifications.completion_date IS 'Date when certification was completed';
COMMENT ON COLUMN ofai_certifications.expiration_date IS 'Date when certification expires';
COMMENT ON COLUMN ofai_certifications.notes IS 'Additional notes about the certification';
COMMENT ON COLUMN ofai_certifications.created_at IS 'Timestamp when record was created';

-- Example: Insert some sample OFAI certifications for testing
-- Uncomment the lines below if you want to add sample data

/*
INSERT INTO ofai_certifications (user_id, certification_name, status) VALUES
((SELECT user_id FROM profiles LIMIT 1), 'Encapsulated Treadmill Test', 'Not Started'),
((SELECT user_id FROM profiles LIMIT 1), 'Ladder Climb Test', 'In Progress'),
((SELECT user_id FROM profiles LIMIT 1), 'Equipment Carry Test', 'Completed');
*/