-- Fix the existing app_role enum by adding missing values
DROP TYPE IF EXISTS app_role CASCADE;
CREATE TYPE app_role AS ENUM (
  'super_admin',
  'project_owner', 
  'project_creator',
  'project_manager',
  'product_manager',
  'sales_engineer',
  'technical_account_manager',
  'end_user'
);

-- Update user_roles table structure
ALTER TABLE user_roles ALTER COLUMN role TYPE app_role USING role::text::app_role;

-- Add missing columns with proper defaults
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'global';
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS scope_id UUID;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS assigned_by UUID;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_scope ON user_roles(scope_type, scope_id);

-- Recreate the has_role function with proper signature
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role, _scope_type text DEFAULT 'global', _scope_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role OR
        (role = 'super_admin' AND _scope_type IN ('global', 'project', 'site')) OR
        (role IN ('product_manager', 'sales_engineer', 'technical_account_manager') AND _scope_type IN ('project', 'site'))
      )
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$$;