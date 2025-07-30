-- Fix user roles enum and table structure
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

-- Update user_roles table to use proper enum and scoping
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ALTER COLUMN role TYPE app_role USING role::app_role;

-- Add missing columns if they don't exist
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'global';
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS scope_id UUID;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS assigned_by UUID;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_scope ON user_roles(scope_type, scope_id);

-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can create roles with proper permissions" ON user_roles;
DROP POLICY IF EXISTS "Users can update roles with proper permissions" ON user_roles;
DROP POLICY IF EXISTS "Users can delete roles with proper permissions" ON user_roles;

-- Create proper RLS policies
CREATE POLICY "Users can view their own roles and related roles"
ON user_roles FOR SELECT
USING (
  user_id = auth.uid() OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  can_manage_roles(auth.uid(), scope_type, scope_id)
);

CREATE POLICY "Authorized users can manage roles"
ON user_roles FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  can_manage_roles(auth.uid(), scope_type, scope_id)
);

-- Ensure proper functions exist
DROP FUNCTION IF EXISTS has_role(uuid, app_role, text, uuid);
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

-- Fix vendor models table structure
CREATE TABLE IF NOT EXISTS vendor_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendor_library(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_series TEXT,
  firmware_versions JSONB DEFAULT '[]'::jsonb,
  hardware_specs JSONB DEFAULT '{}'::jsonb,
  port_configurations JSONB DEFAULT '{}'::jsonb,
  supported_features JSONB DEFAULT '[]'::jsonb,
  eol_date DATE,
  eos_date DATE,
  documentation_links JSONB DEFAULT '[]'::jsonb,
  configuration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS on vendor_models
ALTER TABLE vendor_models ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_models
CREATE POLICY "Vendor models are readable by authenticated users"
ON vendor_models FOR SELECT
USING (true);

CREATE POLICY "Users can create vendor models"
ON vendor_models FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own vendor models"
ON vendor_models FOR UPDATE
USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own vendor models"
ON vendor_models FOR DELETE
USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_vendor_models_updated_at
BEFORE UPDATE ON vendor_models
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();