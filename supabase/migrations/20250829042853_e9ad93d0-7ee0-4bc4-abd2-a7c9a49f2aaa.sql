-- Update the user's role assignment to use the legacy format temporarily for compatibility
UPDATE user_roles 
SET 
  role = 'super_admin',
  scope_type = 'global',
  scope_id = NULL
WHERE user_id = '4507d848-650f-4fa5-a4d2-f5fd6eaffe23' 
AND role_id = '632656d5-c9a6-4a05-8545-3bae570ab836';