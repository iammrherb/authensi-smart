-- Create vendor_library table to store enhanced vendor data used across wizards
CREATE TABLE IF NOT EXISTS public.vendor_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  vendor_type text,
  category text,
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_library ENABLE ROW LEVEL SECURITY;

-- RLS policies for vendor_library
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Vendors readable by authenticated users'
  ) THEN
    CREATE POLICY "Vendors readable by authenticated users"
    ON public.vendor_library FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Users can create vendors'
  ) THEN
    CREATE POLICY "Users can create vendors"
    ON public.vendor_library FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Users can update their vendors'
  ) THEN
    CREATE POLICY "Users can update their vendors"
    ON public.vendor_library FOR UPDATE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'vendor_library' AND policyname = 'Users can delete their vendors'
  ) THEN
    CREATE POLICY "Users can delete their vendors"
    ON public.vendor_library FOR DELETE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_vendor_library_updated_at'
  ) THEN
    CREATE TRIGGER trg_vendor_library_updated_at
    BEFORE UPDATE ON public.vendor_library
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- Create security_levels table used by resource library hooks
CREATE TABLE IF NOT EXISTS public.security_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  requirements jsonb DEFAULT '[]'::jsonb,
  compliance_mappings jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  tags jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_levels ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='security_levels' AND policyname='Security levels readable by authenticated users'
  ) THEN
    CREATE POLICY "Security levels readable by authenticated users"
    ON public.security_levels FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='security_levels' AND policyname='Users can create security levels'
  ) THEN
    CREATE POLICY "Users can create security levels"
    ON public.security_levels FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='security_levels' AND policyname='Users can update security levels'
  ) THEN
    CREATE POLICY "Users can update security levels"
    ON public.security_levels FOR UPDATE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_security_levels_updated_at'
  ) THEN
    CREATE TRIGGER trg_security_levels_updated_at
    BEFORE UPDATE ON public.security_levels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- Create unified catalog tables for selectable items (SIEM, MDR, MDM, Firewall, VPN, IDP, NAC, etc.)
CREATE TABLE IF NOT EXISTS public.catalog_categories (
  key text PRIMARY KEY,
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key text NOT NULL REFERENCES public.catalog_categories(key) ON DELETE CASCADE,
  name text NOT NULL,
  vendor text,
  model text,
  firmware_version text,
  labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_items' AND policyname='Catalog readable by authenticated users'
  ) THEN
    CREATE POLICY "Catalog readable by authenticated users" ON public.catalog_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_items' AND policyname='Users can create catalog items'
  ) THEN
    CREATE POLICY "Users can create catalog items" ON public.catalog_items FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_items' AND policyname='Users can update their catalog items'
  ) THEN
    CREATE POLICY "Users can update their catalog items" ON public.catalog_items FOR UPDATE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_items' AND policyname='Users can delete their catalog items'
  ) THEN
    CREATE POLICY "Users can delete their catalog items" ON public.catalog_items FOR DELETE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

-- Categories table can be read by all authenticated users; only admins manage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_categories' AND policyname='Catalog categories readable'
  ) THEN
    CREATE POLICY "Catalog categories readable" ON public.catalog_categories FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_catalog_items_updated_at'
  ) THEN
    CREATE TRIGGER trg_catalog_items_updated_at
    BEFORE UPDATE ON public.catalog_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_catalog_categories_updated_at'
  ) THEN
    CREATE TRIGGER trg_catalog_categories_updated_at
    BEFORE UPDATE ON public.catalog_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Seed standard categories
INSERT INTO public.catalog_categories (key, name, description, display_order)
VALUES
  ('wired_wireless', 'Network (Wired/Wireless)', 'Switches, APs, routers and controllers', 1),
  ('security', 'Security', 'General security platforms', 2),
  ('edr', 'EDR/XDR', 'Endpoint detection and response', 3),
  ('siem', 'SIEM', 'Security information and event management', 4),
  ('mdr', 'MDR', 'Managed detection and response', 5),
  ('mdm', 'MDM/UEM', 'Mobile/Unified endpoint management', 6),
  ('firewall', 'Firewall', 'Network firewalls', 7),
  ('vpn', 'VPN/Zero Trust', 'Remote access solutions', 8),
  ('idp', 'Identity Provider', 'Identity providers (IdP)', 9),
  ('sso', 'SSO', 'Single sign-on providers', 10),
  ('nac', 'NAC', 'Network access control vendors', 11),
  ('pki', 'PKI', 'Certificate & PKI solutions', 12),
  ('cloud', 'Cloud', 'Cloud platforms', 13)
ON CONFLICT (key) DO NOTHING;


-- Create scoping sessions tables for persistence
CREATE TABLE IF NOT EXISTS public.scoping_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  project_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.scoping_session_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.scoping_sessions(id) ON DELETE CASCADE,
  category_key text NOT NULL REFERENCES public.catalog_categories(key),
  item_id uuid REFERENCES public.catalog_items(id),
  custom_name text,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scoping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoping_session_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check session ownership
CREATE OR REPLACE FUNCTION public.user_owns_scoping_session(session_uuid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.scoping_sessions
    WHERE id = session_uuid AND created_by = auth.uid()
  );
$$;

-- RLS policies for scoping sessions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_sessions' AND policyname='Users can view their sessions'
  ) THEN
    CREATE POLICY "Users can view their sessions" ON public.scoping_sessions FOR SELECT USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_sessions' AND policyname='Users can create sessions'
  ) THEN
    CREATE POLICY "Users can create sessions" ON public.scoping_sessions FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_sessions' AND policyname='Users can update their sessions'
  ) THEN
    CREATE POLICY "Users can update their sessions" ON public.scoping_sessions FOR UPDATE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_sessions' AND policyname='Users can delete their sessions'
  ) THEN
    CREATE POLICY "Users can delete their sessions" ON public.scoping_sessions FOR DELETE USING ((created_by = auth.uid()) OR has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;

-- RLS policies for session items
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_session_items' AND policyname='View items for owned sessions'
  ) THEN
    CREATE POLICY "View items for owned sessions" ON public.scoping_session_items FOR SELECT USING (public.user_owns_scoping_session(session_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_session_items' AND policyname='Create items for owned sessions'
  ) THEN
    CREATE POLICY "Create items for owned sessions" ON public.scoping_session_items FOR INSERT WITH CHECK (public.user_owns_scoping_session(session_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_session_items' AND policyname='Update items for owned sessions'
  ) THEN
    CREATE POLICY "Update items for owned sessions" ON public.scoping_session_items FOR UPDATE USING (public.user_owns_scoping_session(session_id));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scoping_session_items' AND policyname='Delete items for owned sessions'
  ) THEN
    CREATE POLICY "Delete items for owned sessions" ON public.scoping_session_items FOR DELETE USING (public.user_owns_scoping_session(session_id));
  END IF;
END $$;

-- Update triggers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_scoping_sessions_updated_at'
  ) THEN
    CREATE TRIGGER trg_scoping_sessions_updated_at
    BEFORE UPDATE ON public.scoping_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_scoping_session_items_updated_at'
  ) THEN
    CREATE TRIGGER trg_scoping_session_items_updated_at
    BEFORE UPDATE ON public.scoping_session_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;