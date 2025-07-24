-- Fix database function security issues by adding proper search_path settings
-- This prevents search_path manipulation attacks

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Update create_initial_admin function
CREATE OR REPLACE FUNCTION public.create_initial_admin(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create if no global admin exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  ) THEN
    INSERT INTO public.user_roles (user_id, role, scope_type, assigned_by)
    VALUES (_user_id, 'project_owner', 'global', _user_id);
  END IF;
END;
$function$;

-- Update auto_assign_global_admin function
CREATE OR REPLACE FUNCTION public.auto_assign_global_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if this is the first user and no global admin exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  ) THEN
    INSERT INTO public.user_roles (user_id, role, scope_type, assigned_by)
    VALUES (NEW.id, 'project_owner', 'global', NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;

-- Update user_owns_project function
CREATE OR REPLACE FUNCTION public.user_owns_project(project_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_uuid AND created_by = auth.uid()
  );
$function$;

-- Update user_owns_site function
CREATE OR REPLACE FUNCTION public.user_owns_site(site_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.sites 
    WHERE id = site_uuid AND created_by = auth.uid()
  );
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role, _scope_type text DEFAULT 'global'::text, _scope_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$function$;

-- Update can_manage_roles function
CREATE OR REPLACE FUNCTION public.can_manage_roles(_user_id uuid, _scope_type text DEFAULT 'global'::text, _scope_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('project_owner', 'project_manager')
      AND (
        scope_type = 'global' OR
        (scope_type = _scope_type AND scope_id = _scope_id)
      )
  )
$function$;

-- Add audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'project_owner'::app_role, 'global'));

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type text,
  _event_details jsonb DEFAULT '{}',
  _user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (user_id, event_type, event_details)
  VALUES (_user_id, _event_type, _event_details);
END;
$function$;