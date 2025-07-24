import { supabase } from "@/integrations/supabase/client";

export type SecurityEventType = 
  | 'authentication_success' 
  | 'authentication_failure' 
  | 'user_registration' 
  | 'user_logout'
  | 'role_assigned'
  | 'role_removed'
  | 'unauthorized_access_attempt'
  | 'password_reset_requested'
  | 'session_expired';

interface SecurityEventDetails {
  email?: string;
  role?: string;
  scope_type?: string;
  scope_id?: string;
  target_user_id?: string;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  [key: string]: any;
}

export const logSecurityEvent = async (
  eventType: SecurityEventType,
  details: SecurityEventDetails = {}
) => {
  try {
    // Get current user info (may be null for some events like failed auth)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get client-side info
    const userAgent = navigator?.userAgent || 'Unknown';
    
    // Call the database function to log the event
    const { error } = await supabase.rpc('log_security_event', {
      _event_type: eventType,
      _user_id: user?.id || null,
      _event_details: {
        ...details,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Helper function for authentication events
export const logAuthEvent = async (
  success: boolean,
  email: string,
  errorMessage?: string
) => {
  await logSecurityEvent(
    success ? 'authentication_success' : 'authentication_failure',
    {
      email,
      error_message: errorMessage,
    }
  );
};

// Helper function for role management events
export const logRoleEvent = async (
  action: 'assigned' | 'removed',
  role: string,
  targetUserId: string,
  scopeType: string,
  scopeId?: string
) => {
  await logSecurityEvent(
    action === 'assigned' ? 'role_assigned' : 'role_removed',
    {
      role,
      target_user_id: targetUserId,
      scope_type: scopeType,
      scope_id: scopeId,
    }
  );
};