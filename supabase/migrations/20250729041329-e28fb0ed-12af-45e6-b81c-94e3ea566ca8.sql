-- Fix search path for has_permission function
CREATE OR REPLACE FUNCTION public.has_permission(
  user_id UUID,
  resource resource_type,
  permission permission_type,
  scope_type TEXT DEFAULT 'global',
  scope_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
  resource_permissions TEXT[];
BEGIN
  -- Check if user is super admin (has all permissions)
  IF has_role(user_id, 'super_admin'::app_role) THEN
    RETURN true;
  END IF;
  
  -- Get user's custom role permissions
  SELECT cr.permissions->resource::text
  INTO user_permissions
  FROM user_roles ur
  JOIN custom_roles cr ON ur.custom_role_id = cr.id
  WHERE ur.user_id = user_id
    AND ur.scope_type = has_permission.scope_type
    AND (has_permission.scope_id IS NULL OR ur.scope_id = has_permission.scope_id)
  LIMIT 1;
  
  -- If no custom role found, check legacy app_role permissions
  IF user_permissions IS NULL THEN
    -- Legacy role checking logic can be added here
    RETURN false;
  END IF;
  
  -- Check if user has the specific permission
  SELECT array(SELECT jsonb_array_elements_text(user_permissions))
  INTO resource_permissions;
  
  RETURN permission::text = ANY(resource_permissions) OR 'admin' = ANY(resource_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' STABLE;