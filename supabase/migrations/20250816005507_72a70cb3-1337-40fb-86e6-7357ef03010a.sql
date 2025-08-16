-- Add customer portal access to projects table
ALTER TABLE public.projects 
ADD COLUMN customer_portal_id uuid DEFAULT gen_random_uuid(),
ADD COLUMN customer_portal_enabled boolean DEFAULT true,
ADD COLUMN customer_access_expires_at timestamp with time zone DEFAULT NULL;

-- Create index for fast customer portal lookups
CREATE INDEX idx_projects_customer_portal_id ON public.projects(customer_portal_id);

-- Create customer portal activity log
CREATE TABLE public.customer_portal_activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  customer_portal_id uuid NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on customer portal activity
ALTER TABLE public.customer_portal_activity ENABLE ROW LEVEL SECURITY;

-- Create policy for customer portal activity
CREATE POLICY "Customer portal activity is viewable by project owners" 
ON public.customer_portal_activity 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = customer_portal_activity.project_id 
    AND (p.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- Function to get project by customer portal ID
CREATE OR REPLACE FUNCTION public.get_project_by_customer_portal_id(portal_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  status text,
  current_phase text,
  progress_percentage integer,
  start_date date,
  end_date date,
  estimated_budget numeric,
  customer_organization text,
  customer_portal_enabled boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.status,
    p.current_phase,
    p.progress_percentage,
    p.start_date,
    p.end_date,
    p.estimated_budget,
    p.customer_organization,
    p.customer_portal_enabled,
    p.created_at
  FROM public.projects p
  WHERE p.customer_portal_id = portal_id 
    AND p.customer_portal_enabled = true
    AND (p.customer_access_expires_at IS NULL OR p.customer_access_expires_at > now());
END;
$$;