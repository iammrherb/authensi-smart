-- Create a function to get all super admin emails for notifications
CREATE OR REPLACE FUNCTION public.get_super_admin_emails()
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT array_agg(DISTINCT p.email)
  FROM profiles p
  JOIN user_roles ur ON p.id = ur.user_id
  WHERE ur.role = 'super_admin' 
    AND ur.scope_type = 'global'
    AND p.is_active = true
    AND p.email IS NOT NULL;
$function$;

-- Create a trigger function to notify super admins when new invitations are created
CREATE OR REPLACE FUNCTION public.notify_super_admins_of_invitation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  admin_emails text[];
  inviter_name text;
  role_name text;
BEGIN
  -- Get super admin emails
  SELECT get_super_admin_emails() INTO admin_emails;
  
  -- Get inviter name
  SELECT COALESCE(first_name || ' ' || last_name, email) INTO inviter_name
  FROM profiles WHERE id = NEW.invited_by;
  
  -- Get role name
  SELECT name INTO role_name FROM custom_roles WHERE id = NEW.custom_role_id;
  
  -- Store notification data for the edge function to process
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (NEW.invited_by, 'invitation_created_notification', jsonb_build_object(
    'invitation_id', NEW.id,
    'invited_email', NEW.email,
    'inviter_name', inviter_name,
    'role_name', role_name,
    'admin_emails', admin_emails,
    'invitation_token', NEW.invitation_token
  ));
  
  RETURN NEW;
END;
$function$;

-- Create the trigger
DROP TRIGGER IF EXISTS notify_super_admins_on_invitation ON public.user_invitations;
CREATE TRIGGER notify_super_admins_on_invitation
  AFTER INSERT ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION notify_super_admins_of_invitation();