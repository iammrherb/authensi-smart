-- Add project and site associations to vendor_library
ALTER TABLE vendor_library ADD COLUMN IF NOT EXISTS associated_projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE vendor_library ADD COLUMN IF NOT EXISTS associated_sites jsonb DEFAULT '[]'::jsonb;
ALTER TABLE vendor_library ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE vendor_library ADD COLUMN IF NOT EXISTS custom_categories jsonb DEFAULT '[]'::jsonb;

-- Add project and site associations to use_case_library
ALTER TABLE use_case_library ADD COLUMN IF NOT EXISTS associated_projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE use_case_library ADD COLUMN IF NOT EXISTS associated_sites jsonb DEFAULT '[]'::jsonb;
ALTER TABLE use_case_library ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE use_case_library ADD COLUMN IF NOT EXISTS custom_categories jsonb DEFAULT '[]'::jsonb;

-- Add project and site associations to requirements_library
ALTER TABLE requirements_library ADD COLUMN IF NOT EXISTS associated_projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE requirements_library ADD COLUMN IF NOT EXISTS associated_sites jsonb DEFAULT '[]'::jsonb;
ALTER TABLE requirements_library ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE requirements_library ADD COLUMN IF NOT EXISTS custom_categories jsonb DEFAULT '[]'::jsonb;

-- Add project and site associations to configuration_templates
ALTER TABLE configuration_templates ADD COLUMN IF NOT EXISTS associated_projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE configuration_templates ADD COLUMN IF NOT EXISTS associated_sites jsonb DEFAULT '[]'::jsonb;

-- Create a resource_tags table for centralized tag management
CREATE TABLE IF NOT EXISTS resource_tags (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    color_code text DEFAULT '#3B82F6',
    description text,
    created_by uuid REFERENCES profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on resource_tags
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for resource_tags
CREATE POLICY "Users can view all tags" ON resource_tags
    FOR SELECT USING (true);

CREATE POLICY "Users can create tags" ON resource_tags
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tags" ON resource_tags
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Super admins can manage all tags" ON resource_tags
    FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create a resource_categories table for centralized category management
CREATE TABLE IF NOT EXISTS resource_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    resource_type text NOT NULL, -- 'vendor', 'use_case', 'requirement', 'template'
    parent_category_id uuid REFERENCES resource_categories(id),
    color_code text DEFAULT '#10B981',
    description text,
    created_by uuid REFERENCES profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(name, resource_type)
);

-- Enable RLS on resource_categories
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for resource_categories
CREATE POLICY "Users can view all categories" ON resource_categories
    FOR SELECT USING (true);

CREATE POLICY "Users can create categories" ON resource_categories
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own categories" ON resource_categories
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Super admins can manage all categories" ON resource_categories
    FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default tags
INSERT INTO resource_tags (name, color_code, description, created_by) VALUES
('High Priority', '#EF4444', 'High priority items requiring immediate attention', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('AI Enhanced', '#8B5CF6', 'Resources enhanced or optimized by AI', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Production Ready', '#10B981', 'Tested and ready for production deployment', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Beta', '#F59E0B', 'Beta version or experimental features', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Legacy', '#6B7280', 'Legacy systems or deprecated items', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Security Critical', '#DC2626', 'Security-critical configurations or requirements', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Performance Optimized', '#0EA5E9', 'Optimized for high performance scenarios', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Compliance', '#7C3AED', 'Compliance-related items', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1))
ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO resource_categories (name, resource_type, color_code, description, created_by) VALUES
('Network Infrastructure', 'vendor', '#3B82F6', 'Core networking equipment and solutions', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Security', 'vendor', '#EF4444', 'Security-focused vendor solutions', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Authentication', 'use_case', '#10B981', 'Authentication and access control use cases', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Compliance', 'requirement', '#8B5CF6', 'Regulatory and compliance requirements', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Base Configuration', 'template', '#F59E0B', 'Foundational configuration templates', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1)),
('Advanced Security', 'template', '#DC2626', 'Advanced security configuration templates', (SELECT id FROM profiles WHERE email = get_current_user_email() LIMIT 1))
ON CONFLICT (name, resource_type) DO NOTHING;