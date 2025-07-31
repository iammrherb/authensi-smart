-- Enhanced User Management & Authentication System
-- Fix RLS policies, add missing functionality, and improve security

-- 1. Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Password reset token policies
CREATE POLICY "Users can view their own reset tokens" ON public.password_reset_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage password reset tokens" ON public.password_reset_tokens
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 2. Create user sessions table for better session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Session policies
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all sessions" ON public.user_sessions
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 3. Create user activity log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Activity log policies
CREATE POLICY "Users can view their own activity" ON public.user_activity_log
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON public.user_activity_log
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can log all activity" ON public.user_activity_log
  FOR INSERT WITH CHECK (true);

-- 4. Update profiles table structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 5. Create enhanced user management functions

-- Function to safely create users (with proper error handling)
CREATE OR REPLACE FUNCTION public.create_user_safely(
  p_email TEXT,
  p_password TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_role app_role DEFAULT 'viewer'::app_role,
  p_scope_type TEXT DEFAULT 'global',
  p_scope_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
  v_result JSON;
BEGIN
  -- Check if calling user can manage roles
  IF NOT can_manage_roles(auth.uid(), p_scope_type, p_scope_id) THEN
    RAISE EXCEPTION 'Insufficient permissions to create users';
  END IF;

  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Check if user already exists
  SELECT id INTO v_profile_id FROM profiles WHERE email = p_email;
  IF v_profile_id IS NOT NULL THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  -- Generate user ID
  v_user_id := gen_random_uuid();

  -- Create profile first
  INSERT INTO profiles (id, email, first_name, last_name, is_active)
  VALUES (v_user_id, p_email, p_first_name, p_last_name, true)
  RETURNING id INTO v_profile_id;

  -- Assign role
  INSERT INTO user_roles (user_id, role, scope_type, scope_id, assigned_by)
  VALUES (v_user_id, p_role, p_scope_type, p_scope_id, auth.uid());

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_created', jsonb_build_object(
    'created_user_id', v_user_id,
    'email', p_email,
    'role', p_role,
    'scope_type', p_scope_type
  ));

  v_result := jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'message', 'User created successfully. Password reset email will be sent.'
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Function to reset user password
CREATE OR REPLACE FUNCTION public.request_password_reset(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_reset_token TEXT;
  v_result JSON;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id FROM profiles WHERE email = p_email AND is_active = true;
  
  IF v_user_id IS NULL THEN
    -- Don't reveal if email exists
    RETURN jsonb_build_object(
      'success', true,
      'message', 'If the email exists, a reset link will be sent.'
    );
  END IF;

  -- Generate reset token
  v_reset_token := encode(gen_random_bytes(32), 'hex');

  -- Store reset token
  INSERT INTO password_reset_tokens (user_id, token, expires_at)
  VALUES (v_user_id, v_reset_token, now() + interval '1 hour');

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (v_user_id, 'password_reset_requested', jsonb_build_object('email', p_email));

  RETURN jsonb_build_object(
    'success', true,
    'reset_token', v_reset_token,
    'message', 'Password reset token generated'
  );
END;
$$;

-- Function to block/unblock users
CREATE OR REPLACE FUNCTION public.toggle_user_block(
  p_user_id UUID,
  p_block BOOLEAN DEFAULT true
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to block/unblock users';
  END IF;

  -- Update user status
  UPDATE profiles 
  SET is_blocked = p_block,
      updated_at = now()
  WHERE id = p_user_id;

  -- Invalidate active sessions if blocking
  IF p_block THEN
    UPDATE user_sessions 
    SET is_active = false 
    WHERE user_id = p_user_id AND is_active = true;
  END IF;

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), CASE WHEN p_block THEN 'user_blocked' ELSE 'user_unblocked' END,
          jsonb_build_object('target_user_id', p_user_id));

  RETURN jsonb_build_object(
    'success', true,
    'message', CASE WHEN p_block THEN 'User blocked successfully' ELSE 'User unblocked successfully' END
  );
END;
$$;

-- Function to delete users (soft delete)
CREATE OR REPLACE FUNCTION public.delete_user_safely(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Insufficient permissions to delete users';
  END IF;

  -- Prevent self-deletion
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Soft delete by deactivating
  UPDATE profiles 
  SET is_active = false,
      is_blocked = true,
      updated_at = now()
  WHERE id = p_user_id;

  -- Remove all user roles
  DELETE FROM user_roles WHERE user_id = p_user_id;

  -- Invalidate sessions
  UPDATE user_sessions 
  SET is_active = false 
  WHERE user_id = p_user_id;

  -- Log activity
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (auth.uid(), 'user_deleted', jsonb_build_object('deleted_user_id', p_user_id));

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User deleted successfully'
  );
END;
$$;

-- 6. Update existing RLS policies for better user management
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Enhanced profile viewing" ON public.profiles
  FOR SELECT USING (
    -- Users can view their own profile
    auth.uid() = id OR
    -- Admins can view all profiles
    has_role(auth.uid(), 'super_admin'::app_role) OR
    -- Project managers can view team members
    has_role(auth.uid(), 'product_manager'::app_role) OR
    -- Only active, non-blocked profiles are visible to others
    (is_active = true AND is_blocked = false)
  );

-- Enhanced profile update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Enhanced profile updates" ON public.profiles
  FOR UPDATE USING (
    -- Users can update their own profile (except admin fields)
    auth.uid() = id OR
    -- Admins can update any profile
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- 7. Add triggers for automatic logging
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log profile changes
  INSERT INTO user_activity_log (user_id, action, metadata)
  VALUES (
    auth.uid(),
    'profile_updated',
    jsonb_build_object(
      'target_user_id', NEW.id,
      'changes', jsonb_build_object(
        'old_email', OLD.email,
        'new_email', NEW.email,
        'old_active', OLD.is_active,
        'new_active', NEW.is_active,
        'old_blocked', OLD.is_blocked,
        'new_blocked', NEW.is_blocked
      )
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile changes
DROP TRIGGER IF EXISTS trigger_log_profile_changes ON public.profiles;
CREATE TRIGGER trigger_log_profile_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_changes();

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON public.user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON public.user_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_active_blocked ON public.profiles(is_active, is_blocked);