-- Remove the problematic user matt.herbert@portnox.com and related data
-- First remove from user_roles to avoid foreign key constraints
DELETE FROM user_roles WHERE user_id IN (
  SELECT id FROM profiles WHERE email = 'matt.herbert@portnox.com'
);

-- Remove from profiles
DELETE FROM profiles WHERE email = 'matt.herbert@portnox.com';

-- Also clean up any sites that might be referencing this user
UPDATE sites SET created_by = (
  SELECT id FROM profiles WHERE email = 'iammrherb@aliensfault.com' LIMIT 1
) WHERE created_by IN (
  SELECT id FROM profiles WHERE email = 'matt.herbert@portnox.com'
);