-- Optimize projects table for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_current_phase ON projects(current_phase);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Add missing columns that might be causing the 400 error
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS migration_scope jsonb DEFAULT '{}'::jsonb;

-- Ensure all jsonb columns have proper defaults
UPDATE projects 
SET 
  success_criteria = COALESCE(success_criteria, '[]'::jsonb),
  pain_points = COALESCE(pain_points, '[]'::jsonb),
  integration_requirements = COALESCE(integration_requirements, '[]'::jsonb),
  additional_stakeholders = COALESCE(additional_stakeholders, '[]'::jsonb),
  bulk_sites_data = COALESCE(bulk_sites_data, '[]'::jsonb),
  migration_scope = COALESCE(migration_scope, '{}'::jsonb)
WHERE 
  success_criteria IS NULL 
  OR pain_points IS NULL 
  OR integration_requirements IS NULL 
  OR additional_stakeholders IS NULL 
  OR bulk_sites_data IS NULL 
  OR migration_scope IS NULL;

-- Create a function to validate project data before insert/update
CREATE OR REPLACE FUNCTION validate_project_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure required fields have defaults
  NEW.success_criteria := COALESCE(NEW.success_criteria, '[]'::jsonb);
  NEW.pain_points := COALESCE(NEW.pain_points, '[]'::jsonb);
  NEW.integration_requirements := COALESCE(NEW.integration_requirements, '[]'::jsonb);
  NEW.additional_stakeholders := COALESCE(NEW.additional_stakeholders, '[]'::jsonb);
  NEW.bulk_sites_data := COALESCE(NEW.bulk_sites_data, '[]'::jsonb);
  NEW.migration_scope := COALESCE(NEW.migration_scope, '{}'::jsonb);
  NEW.progress_percentage := COALESCE(NEW.progress_percentage, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate data
DROP TRIGGER IF EXISTS validate_project_data_trigger ON projects;
CREATE TRIGGER validate_project_data_trigger
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_data();