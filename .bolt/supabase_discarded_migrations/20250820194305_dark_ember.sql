/*
  # Fix handle_new_user function to properly handle company_name

  1. Updates
    - Update `handle_new_user` function to extract company_name from user metadata
    - Ensure the function handles cases where company_name might be null or empty

  2. Changes
    - Extract company_name from new.raw_user_meta_data
    - Insert company_name along with id and email into profiles table
*/

-- Drop and recreate the handle_new_user function with proper company_name handling
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, company_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'company_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;