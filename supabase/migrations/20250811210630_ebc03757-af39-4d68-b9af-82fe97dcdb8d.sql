-- Create table for per-project Portnox credentials
CREATE TABLE IF NOT EXISTS public.portnox_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NULL,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL DEFAULT 'https://clear.portnox.com/restapi',
  api_token TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portnox_credentials ENABLE ROW LEVEL SECURITY;

-- Ensure only one active credential per project (NULL project can also have only one active)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_portnox_credentials_active_per_project
ON public.portnox_credentials (project_id)
WHERE is_active;

-- Trigger to auto update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_portnox_credentials_updated_at ON public.portnox_credentials;
CREATE TRIGGER trg_portnox_credentials_updated_at
BEFORE UPDATE ON public.portnox_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: super_admins and project owners/managers can manage
DROP POLICY IF EXISTS "Portnox creds select" ON public.portnox_credentials;
DROP POLICY IF EXISTS "Portnox creds insert" ON public.portnox_credentials;
DROP POLICY IF EXISTS "Portnox creds update" ON public.portnox_credentials;
DROP POLICY IF EXISTS "Portnox creds delete" ON public.portnox_credentials;

CREATE POLICY "Portnox creds select"
ON public.portnox_credentials
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role, 'global') OR
  (project_id IS NULL AND has_role(auth.uid(), 'super_admin'::app_role, 'global')) OR
  (project_id IS NOT NULL AND (
     user_owns_project(project_id) OR
     has_role(auth.uid(), 'product_manager'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'sales_engineer'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'technical_account_manager'::app_role, 'project', project_id)
  ))
);

CREATE POLICY "Portnox creds insert"
ON public.portnox_credentials
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role, 'global') OR
  (NEW.project_id IS NOT NULL AND (
     user_owns_project(NEW.project_id) OR
     has_role(auth.uid(), 'product_manager'::app_role, 'project', NEW.project_id) OR
     has_role(auth.uid(), 'sales_engineer'::app_role, 'project', NEW.project_id) OR
     has_role(auth.uid(), 'technical_account_manager'::app_role, 'project', NEW.project_id)
  ))
);

CREATE POLICY "Portnox creds update"
ON public.portnox_credentials
FOR UPDATE
USING (
  has_role(auth.uid(), 'super_admin'::app_role, 'global') OR
  (project_id IS NOT NULL AND (
     user_owns_project(project_id) OR
     has_role(auth.uid(), 'product_manager'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'sales_engineer'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'technical_account_manager'::app_role, 'project', project_id)
  ))
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role, 'global') OR
  (NEW.project_id IS NOT NULL AND (
     user_owns_project(NEW.project_id) OR
     has_role(auth.uid(), 'product_manager'::app_role, 'project', NEW.project_id) OR
     has_role(auth.uid(), 'sales_engineer'::app_role, 'project', NEW.project_id) OR
     has_role(auth.uid(), 'technical_account_manager'::app_role, 'project', NEW.project_id)
  ))
);

CREATE POLICY "Portnox creds delete"
ON public.portnox_credentials
FOR DELETE
USING (
  has_role(auth.uid(), 'super_admin'::app_role, 'global') OR
  (project_id IS NOT NULL AND (
     user_owns_project(project_id) OR
     has_role(auth.uid(), 'product_manager'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'sales_engineer'::app_role, 'project', project_id) OR
     has_role(auth.uid(), 'technical_account_manager'::app_role, 'project', project_id)
  ))
);