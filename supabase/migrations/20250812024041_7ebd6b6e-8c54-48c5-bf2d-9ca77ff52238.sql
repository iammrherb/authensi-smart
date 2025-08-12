-- Create a cache table for Portnox OpenAPI specs
CREATE TABLE IF NOT EXISTS public.portnox_openapi_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE, -- e.g., 'public-doc' or a specific tenant key
  base_url TEXT NOT NULL,         -- base URL derived from the spec
  spec JSONB NOT NULL,            -- raw OpenAPI spec
  derived_base TEXT,              -- normalized base (e.g., with/without /restapi)
  base_path TEXT,                 -- basePath extracted from spec
  source TEXT,                    -- where base came from (servers/host/basePath)
  etag TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portnox_openapi_cache ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portnox_openapi_cache' AND policyname = 'OpenAPI cache readable by authenticated users'
  ) THEN
    CREATE POLICY "OpenAPI cache readable by authenticated users"
    ON public.portnox_openapi_cache
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portnox_openapi_cache' AND policyname = 'Users can insert cache entries they create'
  ) THEN
    CREATE POLICY "Users can insert cache entries they create"
    ON public.portnox_openapi_cache
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portnox_openapi_cache' AND policyname = 'Users can update their cache entries or super admins'
  ) THEN
    CREATE POLICY "Users can update their cache entries or super admins"
    ON public.portnox_openapi_cache
    FOR UPDATE
    USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

-- Trigger to maintain updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_portnox_openapi_cache_updated_at'
  ) THEN
    CREATE TRIGGER trg_portnox_openapi_cache_updated_at
    BEFORE UPDATE ON public.portnox_openapi_cache
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Helpful index for lookups by key
CREATE INDEX IF NOT EXISTS idx_portnox_openapi_cache_key ON public.portnox_openapi_cache (cache_key);
