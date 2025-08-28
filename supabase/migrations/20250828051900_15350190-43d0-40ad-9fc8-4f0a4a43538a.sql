-- Ensure current user has super_admin role
INSERT INTO user_roles (user_id, role, scope_type, assigned_by, assigned_at)
VALUES (auth.uid(), 'super_admin', 'global', auth.uid(), now())
ON CONFLICT (user_id, role, scope_type, scope_id) DO NOTHING;