-- Migration: Add ofai_stage column to ofai_certifications table
-- Generated: 2025-07-21
-- Description: Adds ofai_stage column to categorize certifications into Stage One, Stage Two, or Stage Three

-- Add the ofai_stage column
ALTER TABLE ofai_certifications 
ADD COLUMN ofai_stage TEXT;

-- Add check constraint for ofai_stage values (optional but recommended)
ALTER TABLE ofai_certifications 
ADD CONSTRAINT check_ofai_stage_values 
CHECK (ofai_stage IS NULL OR ofai_stage IN ('Stage One', 'Stage Two', 'Stage Three'));

-- Create index on ofai_stage for filtering performance
CREATE INDEX idx_ofai_certifications_ofai_stage ON ofai_certifications(ofai_stage);

-- Add comment for documentation
COMMENT ON COLUMN ofai_certifications.ofai_stage IS 'OFAI stage categorization: Stage One, Stage Two, or Stage Three';