-- Fix user_invitations table: Add updated_at column and drop/recreate the trigger
ALTER TABLE public.user_invitations 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_user_invitations_updated_at ON public.user_invitations;
DROP FUNCTION IF EXISTS update_user_invitations_updated_at();

-- Create the proper updated_at trigger using the existing function
CREATE TRIGGER update_user_invitations_updated_at
  BEFORE UPDATE ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();