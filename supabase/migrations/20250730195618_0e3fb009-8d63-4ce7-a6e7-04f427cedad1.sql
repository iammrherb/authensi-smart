-- Create user_invitations table for managing user invitations
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  custom_role_id UUID REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'used', 'expired')),
  scope_type TEXT NOT NULL DEFAULT 'global' CHECK (scope_type IN ('global', 'project', 'site')),
  scope_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_invitations
CREATE POLICY "Super admins can manage all invitations" 
ON public.user_invitations 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can view invitations they created or received" 
ON public.user_invitations 
FOR SELECT 
USING (invited_by = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Managers can create invitations" 
ON public.user_invitations 
FOR INSERT 
WITH CHECK (
  invited_by = auth.uid() AND 
  (has_role(auth.uid(), 'super_admin'::app_role) OR 
   has_role(auth.uid(), 'product_manager'::app_role))
);

CREATE POLICY "Approvers can update invitations" 
ON public.user_invitations 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'product_manager'::app_role)
);

-- Create index for performance
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_token ON public.user_invitations(invitation_token);
CREATE INDEX idx_user_invitations_status ON public.user_invitations(status);

-- Create trigger for updated_at
CREATE TRIGGER update_user_invitations_updated_at
  BEFORE UPDATE ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();