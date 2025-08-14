-- Secure user_invitations table to prevent token hijacking
-- Drop existing policies that are too permissive
DROP POLICY IF EXISTS "Allow viewing relevant invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Allow managers to create invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Allow managers to update invitations" ON public.user_invitations;

-- Create more restrictive policies

-- Only allow invitees to view their own invitation by email (for validation)
CREATE POLICY "Invitees can view their own invitations"
ON public.user_invitations
FOR SELECT
USING (email = get_current_user_email() AND status IN ('pending', 'approved'));

-- Only allow inviters to view invitations they created
CREATE POLICY "Inviters can view their sent invitations"
ON public.user_invitations
FOR SELECT
USING (invited_by = auth.uid());

-- Super admins can view all invitations
CREATE POLICY "Super admins can view all invitations"
ON public.user_invitations
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Only super admins and product managers can create invitations
CREATE POLICY "Authorized users can create invitations"
ON public.user_invitations
FOR INSERT
WITH CHECK (
  invited_by = auth.uid() 
  AND (
    has_role(auth.uid(), 'super_admin'::app_role) 
    OR has_role(auth.uid(), 'product_manager'::app_role)
  )
);

-- Only super admins and product managers can update invitations (for approval/rejection)
CREATE POLICY "Authorized users can update invitations"
ON public.user_invitations
FOR UPDATE
USING (
  has_role(auth.uid(), 'super_admin'::app_role) 
  OR has_role(auth.uid(), 'product_manager'::app_role)
);

-- Only super admins can delete invitations
CREATE POLICY "Super admins can delete invitations"
ON public.user_invitations
FOR DELETE
USING (has_role(auth.uid(), 'super_admin'::app_role));