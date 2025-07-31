-- Drop all existing policies on user_invitations to start clean
DROP POLICY IF EXISTS "Super admins can manage invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Super admins can manage all invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view invitations they created" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view invitations they created or received" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.user_invitations;
DROP POLICY IF EXISTS "Managers can create invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Approvers can update invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Managers can update invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view relevant invitations" ON public.user_invitations;

-- Create clean, comprehensive RLS policies for user_invitations
CREATE POLICY "Allow super admins full access" ON public.user_invitations
FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Allow managers to create invitations" ON public.user_invitations
FOR INSERT WITH CHECK (
  invited_by = auth.uid() AND 
  (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'product_manager'::app_role))
);

CREATE POLICY "Allow viewing relevant invitations" ON public.user_invitations
FOR SELECT USING (
  invited_by = auth.uid() OR 
  email = get_current_user_email() OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'product_manager'::app_role)
);

CREATE POLICY "Allow managers to update invitations" ON public.user_invitations
FOR UPDATE USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);