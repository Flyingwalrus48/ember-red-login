-- Migration: Create trigger to auto-populate OFAI certifications for new users
-- Generated: 2025-07-21
-- Description: Creates a trigger that calls Edge Function to populate OFAI certifications when a new user is created

-- Create function that will be called by the trigger
CREATE OR REPLACE FUNCTION handle_new_user_ofai_certifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to populate OFAI certifications
  PERFORM
    net.http_post(
      url := (SELECT vault.decrypted_secret('SUPABASE_URL') || '/functions/v1/populate-ofai-certifications'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT vault.decrypted_secret('SUPABASE_SERVICE_ROLE_KEY'))
      ),
      body := jsonb_build_object('user_id', NEW.id)
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created_populate_ofai_certifications
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_ofai_certifications();

-- Alternative approach using a simpler database function (recommended)
-- This approach doesn't require HTTP calls and is more reliable

-- Drop the previous function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created_populate_ofai_certifications ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_ofai_certifications();

-- Create a more direct function that inserts certifications directly
CREATE OR REPLACE FUNCTION populate_ofai_certifications_for_user(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert all required OFAI certifications for the new user
  INSERT INTO ofai_certifications (user_id, certification_name, ofai_stage, status) VALUES
    -- Stage One
    (user_id, 'Firefighter Aptitude and Character Test™ (FACT™)', 'Stage One', 'Not Started'),
    
    -- Stage Two
    (user_id, 'Vision Assessment', 'Stage Two', 'Not Started'),
    (user_id, 'Hearing Assessment', 'Stage Two', 'Not Started'),
    (user_id, 'Encapsulated Treadmill Test', 'Stage Two', 'Not Started'),
    
    -- Stage Three
    (user_id, 'Firefighter Physical Aptitude Job-Related Tests (FPAT)', 'Stage Three', 'Not Started'),
    (user_id, 'Firefighter Technical Skills Assessment (FFTS)', 'Stage Three', 'Not Started'),
    
    -- Other (no stage)
    (user_id, 'Swim Test', NULL, 'Not Started');
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified trigger function
CREATE OR REPLACE FUNCTION handle_new_user_ofai_certifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the function to populate OFAI certifications
  PERFORM populate_ofai_certifications_for_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created_populate_ofai_certifications
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_ofai_certifications();

-- Add comment for documentation
COMMENT ON FUNCTION populate_ofai_certifications_for_user(UUID) IS 'Populates all required OFAI certifications for a new user';
COMMENT ON FUNCTION handle_new_user_ofai_certifications() IS 'Trigger function that auto-populates OFAI certifications when a new user is created';
COMMENT ON TRIGGER on_auth_user_created_populate_ofai_certifications ON auth.users IS 'Automatically populates OFAI certifications for new users';