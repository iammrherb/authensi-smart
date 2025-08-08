-- Enhance projects table with business context and AI fields
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS project_owners jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS technical_owners jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS region_name text,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS business_summary text,
  ADD COLUMN IF NOT EXISTS overall_goal text,
  ADD COLUMN IF NOT EXISTS initiative_type text,
  ADD COLUMN IF NOT EXISTS ai_recommendations text;

-- Optional: Comment for documentation
COMMENT ON COLUMN public.projects.website_url IS 'Official company website URL';
COMMENT ON COLUMN public.projects.linkedin_url IS 'Company LinkedIn profile URL';
COMMENT ON COLUMN public.projects.project_owners IS 'Array of project owner contacts [{name, email}]';
COMMENT ON COLUMN public.projects.technical_owners IS 'Array of technical owner contacts [{name, email}]';
COMMENT ON COLUMN public.projects.industry IS 'Primary industry for the project/company';
COMMENT ON COLUMN public.projects.country_code IS 'ISO country code';
COMMENT ON COLUMN public.projects.region_name IS 'Region/State/Province name';
COMMENT ON COLUMN public.projects.timezone IS 'IANA timezone string';
COMMENT ON COLUMN public.projects.business_summary IS 'AI-generated brief business summary';
COMMENT ON COLUMN public.projects.overall_goal IS 'Declared overall project goal';
COMMENT ON COLUMN public.projects.initiative_type IS 'Greenfield, Migration, Expansion, or Other';
COMMENT ON COLUMN public.projects.ai_recommendations IS 'AI-generated recommendations and pain points summary';