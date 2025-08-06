-- Fix the foreign key constraint issue
-- Drop the existing foreign key constraint that references auth.users
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Add a new foreign key constraint that references the profiles table instead
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;