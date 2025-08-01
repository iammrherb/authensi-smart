-- Fix status and current_phase CHECK constraints in projects table to match application usage
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_current_phase_check;

-- Add updated constraints that match the application
ALTER TABLE public.projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('planning', 'scoping', 'designing', 'implementing', 'testing', 'deployed', 'maintenance'));

ALTER TABLE public.projects ADD CONSTRAINT projects_current_phase_check 
  CHECK (current_phase IN ('discovery', 'scoping', 'design', 'implementation', 'testing', 'deployment', 'maintenance'));