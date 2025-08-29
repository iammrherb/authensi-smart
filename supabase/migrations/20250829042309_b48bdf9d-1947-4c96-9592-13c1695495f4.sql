-- Assign super_admin role to the user properly
UPDATE user_roles 
SET role_id = '632656d5-c9a6-4a05-8545-3bae570ab836',
    is_active = true,
    assigned_at = now()
WHERE user_id = (
    SELECT id FROM profiles WHERE email = 'iammrherb@aliensfault.com'
);