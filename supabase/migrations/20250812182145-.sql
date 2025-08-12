-- Secure profiles table: restrict SELECT to self and authorized admins/managers
-- 1) Drop overly permissive SELECT policy
DROP POLICY IF EXISTS "Enhanced profile viewing" ON public.profiles;

-- 2) Allow users to view only their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3) Allow super admins and product managers to view all profiles
CREATE POLICY "Admins and product managers can view all profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'product_manager'::app_role)
);
