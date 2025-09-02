-- Fix the has_role function to work with the new RBAC structure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text, _scope_type text DEFAULT 'global'::text, _scope_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = _user_id
      AND r.name = _role
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
      AND (
        _scope_type = 'global' OR
        (ur.scope_data IS NOT NULL AND ur.scope_data->>'scope_type' = _scope_type)
      )
  )
$$;