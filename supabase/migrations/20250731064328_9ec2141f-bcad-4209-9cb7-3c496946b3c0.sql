-- Check if user_invitations table exists and create it if missing
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  custom_role_id UUID REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL DEFAULT 'global',
  scope_id UUID,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'used', 'expired')),
  metadata JSONB DEFAULT '{}',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view invitations they sent or received" 
ON public.user_invitations 
FOR SELECT 
USING (
  invited_by = auth.uid() OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Users can create invitations if they have permission" 
ON public.user_invitations 
FOR INSERT 
WITH CHECK (
  invited_by = auth.uid() AND
  can_manage_roles(auth.uid(), scope_type, scope_id)
);

CREATE POLICY "Admins can update invitations" 
ON public.user_invitations 
FOR UPDATE 
USING (has_role(auth.uid(), 'super_admin'::app_role) OR can_manage_roles(auth.uid(), scope_type, scope_id));

-- Fix profiles table foreign key constraint
-- The profiles table should reference auth.users, but the constraint might be named incorrectly
-- Let's check and fix it
DO $$
BEGIN
  -- Drop the existing constraint if it exists
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE table_name = 'profiles' AND constraint_name = 'profiles_id_fkey') THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
  
  -- Add the correct foreign key constraint
  ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  
EXCEPTION 
  WHEN duplicate_object THEN
    -- Constraint already exists, do nothing
    NULL;
END $$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_invitations_updated_at
  BEFORE UPDATE ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_invitations_updated_at();