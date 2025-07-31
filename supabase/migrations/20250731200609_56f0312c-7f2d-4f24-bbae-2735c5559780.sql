-- Create a function to migrate existing approved invitations to user accounts
CREATE OR REPLACE FUNCTION public.migrate_approved_invitations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  invitation_record user_invitations%ROWTYPE;
  temp_password text;
  new_user_id uuid;
BEGIN
  -- Loop through all approved invitations that haven't been used
  FOR invitation_record IN 
    SELECT * FROM user_invitations 
    WHERE status = 'approved' 
  LOOP
    -- Check if user already exists in profiles
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = invitation_record.email) THEN
      -- Generate a temporary password
      temp_password := 'TempPass123!' || substr(md5(random()::text), 1, 8);
      
      -- Log that we're creating the account
      INSERT INTO user_activity_log (user_id, action, metadata)
      VALUES (invitation_record.invited_by, 'migration_user_creation', jsonb_build_object(
        'target_email', invitation_record.email,
        'invitation_id', invitation_record.id
      ));
      
      -- Note: We can't directly create auth users from SQL, so we'll mark these for processing
      -- and update the invitation status to indicate they need account creation
      UPDATE user_invitations 
      SET 
        status = 'needs_account_creation',
        updated_at = now()
      WHERE id = invitation_record.id;
      
    ELSE
      -- User already exists, mark invitation as used
      UPDATE user_invitations 
      SET 
        status = 'used',
        updated_at = now()
      WHERE id = invitation_record.id;
    END IF;
  END LOOP;
END;
$$;

-- Run the migration
SELECT public.migrate_approved_invitations();