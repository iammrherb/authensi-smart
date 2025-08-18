-- Fix user_sessions table security vulnerabilities
-- Remove overly permissive policies and implement secure session management

-- Drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can manage all sessions" ON public.user_sessions;

-- Create secure RLS policies for user_sessions table

-- Policy 1: Users can only view their own active sessions (not expired ones)
CREATE POLICY "Users can view own active sessions only" 
ON public.user_sessions 
FOR SELECT 
USING (
  user_id = auth.uid() 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- Policy 2: Users can only update their own sessions (for logout/activity updates)
CREATE POLICY "Users can update own sessions only" 
ON public.user_sessions 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 3: System can create sessions (service role only, not user-facing)
CREATE POLICY "System can create user sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can soft-delete their own sessions (logout)
CREATE POLICY "Users can deactivate own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND is_active = false);

-- Policy 5: Super admins can view all sessions for security monitoring
CREATE POLICY "Super admins can monitor all sessions" 
ON public.user_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Policy 6: Super admins can manage sessions for security purposes (force logout, etc.)
CREATE POLICY "Super admins can manage sessions for security" 
ON public.user_sessions 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Add cleanup function to automatically expire old sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Deactivate sessions that have expired
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  -- Delete sessions older than 30 days to prevent data accumulation
  DELETE FROM public.user_sessions 
  WHERE created_at < (now() - interval '30 days');
END;
$$;

-- Create a trigger to update last_activity automatically
CREATE OR REPLACE FUNCTION public.update_session_last_activity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$;

-- Apply the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_user_sessions_activity ON public.user_sessions;
CREATE TRIGGER update_user_sessions_activity
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_last_activity();

-- Add session validation function
CREATE OR REPLACE FUNCTION public.validate_session_token(p_token text)
RETURNS TABLE(user_id uuid, session_id uuid, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    us.id as session_id,
    (us.is_active = true AND (us.expires_at IS NULL OR us.expires_at > now())) as is_valid
  FROM public.user_sessions us
  WHERE us.session_token = p_token
  LIMIT 1;
END;
$$;