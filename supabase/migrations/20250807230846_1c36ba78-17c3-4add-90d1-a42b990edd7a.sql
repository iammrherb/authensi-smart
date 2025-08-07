-- Create vendor_library table
CREATE TABLE IF NOT EXISTS public.vendor_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  vendor_type text,
  category text NOT NULL,
  description text,
  website_url text,
  support_contact jsonb DEFAULT '{}'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  portnox_integration_level text DEFAULT 'supported',
  portnox_documentation jsonb DEFAULT '{}'::jsonb,
  models jsonb DEFAULT '[]'::jsonb,
  supported_protocols jsonb DEFAULT '[]'::jsonb,
  integration_methods jsonb DEFAULT '[]'::jsonb,
  portnox_compatibility jsonb DEFAULT '{}'::jsonb,
  configuration_templates jsonb DEFAULT '{}'::jsonb,
  known_limitations jsonb DEFAULT '[]'::jsonb,
  firmware_requirements jsonb DEFAULT '{}'::jsonb,
  documentation_links jsonb DEFAULT '[]'::jsonb,
  support_level text,
  last_tested_date date,
  status text DEFAULT 'active',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Vendors readable by authenticated users'
  ) THEN
    CREATE POLICY "Vendors readable by authenticated users"
    ON public.vendor_library
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Users can create vendors'
  ) THEN
    CREATE POLICY "Users can create vendors"
    ON public.vendor_library
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Users can update their vendors'
  ) THEN
    CREATE POLICY "Users can update their vendors"
    ON public.vendor_library
    FOR UPDATE
    USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Admins can delete vendors'
  ) THEN
    CREATE POLICY "Admins can delete vendors"
    ON public.vendor_library
    FOR DELETE
    USING (has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vendor_library_name ON public.vendor_library (vendor_name);

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_vendor_library_updated_at'
  ) THEN
    CREATE TRIGGER trg_vendor_library_updated_at
    BEFORE UPDATE ON public.vendor_library
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create vendor_models table
CREATE TABLE IF NOT EXISTS public.vendor_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendor_library(id) ON DELETE CASCADE,
  model_name text NOT NULL,
  model_series text,
  firmware_versions jsonb DEFAULT '[]'::jsonb,
  hardware_specs jsonb DEFAULT '{}'::jsonb,
  port_configurations jsonb DEFAULT '{}'::jsonb,
  supported_features jsonb DEFAULT '[]'::jsonb,
  eol_date date,
  eos_date date,
  documentation_links jsonb DEFAULT '[]'::jsonb,
  configuration_notes text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.vendor_models ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_models' AND policyname = 'Vendor models readable by authenticated users'
  ) THEN
    CREATE POLICY "Vendor models readable by authenticated users"
    ON public.vendor_models
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_models' AND policyname = 'Users can create vendor models'
  ) THEN
    CREATE POLICY "Users can create vendor models"
    ON public.vendor_models
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_models' AND policyname = 'Users can update their vendor models'
  ) THEN
    CREATE POLICY "Users can update their vendor models"
    ON public.vendor_models
    FOR UPDATE
    USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vendor_models' AND policyname = 'Admins can delete vendor models'
  ) THEN
    CREATE POLICY "Admins can delete vendor models"
    ON public.vendor_models
    FOR DELETE
    USING (has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vendor_models_vendor_id ON public.vendor_models (vendor_id);

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_vendor_models_updated_at'
  ) THEN
    CREATE TRIGGER trg_vendor_models_updated_at
    BEFORE UPDATE ON public.vendor_models
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create use_case_library table
CREATE TABLE IF NOT EXISTS public.use_case_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  business_value text,
  technical_requirements jsonb DEFAULT '[]'::jsonb,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  test_scenarios jsonb DEFAULT '[]'::jsonb,
  supported_vendors jsonb DEFAULT '[]'::jsonb,
  portnox_features jsonb DEFAULT '[]'::jsonb,
  complexity text DEFAULT 'medium',
  estimated_effort_weeks integer,
  dependencies jsonb DEFAULT '[]'::jsonb,
  compliance_frameworks jsonb DEFAULT '[]'::jsonb,
  authentication_methods jsonb DEFAULT '[]'::jsonb,
  deployment_scenarios jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.use_case_library ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'use_case_library' AND policyname = 'Use cases readable by authenticated users'
  ) THEN
    CREATE POLICY "Use cases readable by authenticated users"
    ON public.use_case_library
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'use_case_library' AND policyname = 'Users can create use cases'
  ) THEN
    CREATE POLICY "Users can create use cases"
    ON public.use_case_library
    FOR INSERT
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'use_case_library' AND policyname = 'Users can update use cases'
  ) THEN
    CREATE POLICY "Users can update use cases"
    ON public.use_case_library
    FOR UPDATE
    USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_use_case_library_name ON public.use_case_library (name);

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_use_case_library_updated_at'
  ) THEN
    CREATE TRIGGER trg_use_case_library_updated_at
    BEFORE UPDATE ON public.use_case_library
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create requirements_library table
CREATE TABLE IF NOT EXISTS public.requirements_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  subcategory text,
  priority text DEFAULT 'medium',
  requirement_type text NOT NULL,
  description text,
  rationale text,
  acceptance_criteria jsonb DEFAULT '[]'::jsonb,
  verification_methods jsonb DEFAULT '[]'::jsonb,
  test_cases jsonb DEFAULT '[]'::jsonb,
  related_use_cases jsonb DEFAULT '[]'::jsonb,
  dependencies jsonb DEFAULT '[]'::jsonb,
  assumptions jsonb DEFAULT '[]'::jsonb,
  constraints jsonb DEFAULT '[]'::jsonb,
  compliance_frameworks jsonb DEFAULT '[]'::jsonb,
  vendor_requirements jsonb DEFAULT '{}'::jsonb,
  portnox_features jsonb DEFAULT '[]'::jsonb,
  documentation_references jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.requirements_library ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'requirements_library' AND policyname = 'Requirements readable by authenticated users'
  ) THEN
    CREATE POLICY "Requirements readable by authenticated users"
    ON public.requirements_library
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'requirements_library' AND policyname = 'Users can create requirements'
  ) THEN
    CREATE POLICY "Users can create requirements"
    ON public.requirements_library
    FOR INSERT
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'requirements_library' AND policyname = 'Users can update requirements'
  ) THEN
    CREATE POLICY "Users can update requirements"
    ON public.requirements_library
    FOR UPDATE
    USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_requirements_library_title ON public.requirements_library (title);

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_requirements_library_updated_at'
  ) THEN
    CREATE TRIGGER trg_requirements_library_updated_at
    BEFORE UPDATE ON public.requirements_library
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;