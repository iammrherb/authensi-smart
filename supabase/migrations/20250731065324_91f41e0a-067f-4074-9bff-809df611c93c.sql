-- Fix RLS policy infinite recursion issue
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.user_invitations;

-- Create a security definer function to get current user email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Users can view invitations they sent or received" 
ON public.user_invitations 
FOR SELECT 
USING (
  invited_by = auth.uid() OR 
  email = get_current_user_email() OR
  has_role(auth.uid(), 'super_admin'::app_role)
);