-- Add foreign key relationship between user_invitations and profiles
ALTER TABLE public.user_invitations 
ADD CONSTRAINT user_invitations_invited_by_fkey 
FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key relationship for approved_by as well
ALTER TABLE public.user_invitations 
ADD CONSTRAINT user_invitations_approved_by_fkey 
FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL;