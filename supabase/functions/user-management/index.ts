import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  scope_type?: string;
  scope_id?: string;
  send_welcome_email?: boolean;
}

interface PasswordResetRequest {
  email: string;
}

interface UserStatusRequest {
  user_id: string;
  action: 'block' | 'unblock' | 'delete' | 'activate' | 'enable_2fa' | 'disable_2fa';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Service role client for admin operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const action = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    
    console.log('User Management Request:', {
      method: req.method,
      action,
      user_id: user.id
    });

    if (req.method === 'POST') {
      if (action === 'create-user') {
        const { 
          email, 
          first_name, 
          last_name, 
          role, 
          scope_type = 'global', 
          scope_id,
          send_welcome_email = true 
        }: CreateUserRequest = await req.json();
        
        // Check if user can manage roles
        const { data: canManage } = await supabaseClient.rpc('can_manage_roles', {
          _user_id: user.id,
          _scope_type: scope_type
        });

        if (!canManage) {
          throw new Error('Insufficient permissions to create users');
        }

        // Generate a secure temporary password
        const tempPassword = crypto.randomUUID() + '!Temp123';
        
        // Create user with service role
        const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
          email,
          password: tempPassword,
          user_metadata: {
            first_name,
            last_name,
          },
          email_confirm: true
        });

        if (createError) throw createError;

        if (newUser.user) {
          // Create profile
          const { error: profileError } = await serviceClient
            .from('profiles')
            .insert({
              id: newUser.user.id,
              email,
              first_name,
              last_name,
              is_active: true
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't throw here, just log
          }

          // Assign role
          const { error: roleError } = await serviceClient
            .from('user_roles')
            .insert({
              user_id: newUser.user.id,
              role: role as any,
              scope_type,
              scope_id,
              assigned_by: user.id
            });

          if (roleError) {
            console.error('Role assignment error:', roleError);
            // Don't throw here, just log
          }

          // Log activity
          await serviceClient
            .from('user_activity_log')
            .insert({
              user_id: user.id,
              action: 'user_created',
              metadata: {
                created_user_id: newUser.user.id,
                email,
                role,
                scope_type
              }
            });

          // Send password reset email to allow user to set their own password
          if (send_welcome_email) {
            try {
              await serviceClient.auth.admin.generateLink({
                type: 'recovery',
                email: email,
              });
            } catch (emailError) {
              console.error('Welcome email error:', emailError);
              // Don't fail the user creation for email issues
            }
          }

          return new Response(JSON.stringify({ 
            success: true,
            user_id: newUser.user.id,
            message: 'User created successfully. Welcome email sent with setup instructions.'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        throw new Error('Failed to create user');
      }

      if (action === 'reset-password') {
        const { email }: PasswordResetRequest = await req.json();
        
        try {
          // Generate reset link using service role
          const { data, error } = await serviceClient.auth.admin.generateLink({
            type: 'recovery',
            email: email,
          });

          if (error) throw error;

          // Log the reset request
          await serviceClient
            .from('user_activity_log')
            .insert({
              user_id: user.id,
              action: 'password_reset_requested',
              metadata: { email, requested_by: user.id }
            });

          return new Response(JSON.stringify({ 
            success: true,
            message: 'Password reset email sent successfully'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Password reset error:', error);
          // Return success anyway to prevent email enumeration
          return new Response(JSON.stringify({ 
            success: true,
            message: 'If the email exists, a reset link has been sent'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      if (action === 'update-user-status') {
        const { user_id, action: statusAction, user_action }: UserStatusRequest & { user_action?: string } = await req.json();
        
        // Check permissions
        const { data: canManage } = await supabaseClient.rpc('can_manage_roles', {
          _user_id: user.id,
          _scope_type: 'global'
        });

        if (!canManage) {
          throw new Error('Insufficient permissions to modify user status');
        }

        // Prevent self-modification for critical actions
        if (user_id === user.id && ['block', 'delete'].includes(statusAction)) {
          throw new Error('Cannot perform this action on your own account');
        }

        let updateData: any = {};
        let message = '';
        const actualAction = statusAction || user_action;

        switch (actualAction) {
          case 'block':
            updateData = { is_blocked: true };
            message = 'User blocked successfully';
            break;
          case 'unblock':
            updateData = { is_blocked: false };
            message = 'User unblocked successfully';
            break;
          case 'delete':
            updateData = { is_active: false, is_blocked: true };
            message = 'User deactivated successfully';
            break;
          case 'activate':
            updateData = { is_active: true, is_blocked: false };
            message = 'User activated successfully';
            break;
          case 'enable_2fa':
            updateData = { two_factor_enabled: true };
            message = 'Two-factor authentication enabled';
            break;
          case 'disable_2fa':
            updateData = { two_factor_enabled: false, two_factor_secret: null };
            message = 'Two-factor authentication disabled';
            break;
          default:
            throw new Error('Invalid action');
        }

        // Update user profile
        const { error: updateError } = await serviceClient
          .from('profiles')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', user_id);

        if (updateError) throw updateError;

        // If blocking or deleting, invalidate sessions
        if (['block', 'delete'].includes(actualAction)) {
          await serviceClient
            .from('user_sessions')
            .update({ is_active: false })
            .eq('user_id', user_id);
        }

        // If deleting, remove roles
        if (actualAction === 'delete') {
          await serviceClient
            .from('user_roles')
            .delete()
            .eq('user_id', user_id);
        }

        // Log activity
        await serviceClient
          .from('user_activity_log')
          .insert({
            user_id: user.id,
            action: `user_${actualAction}`,
            metadata: { target_user_id: user_id }
          });

        return new Response(JSON.stringify({ 
          success: true,
          message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'GET') {
      if (action === 'users') {
        // Get all users with their profiles and roles
        const { data: users, error } = await supabaseClient
          .from('profiles')
          .select(`
            id, email, first_name, last_name, 
            is_active, is_blocked, last_login, 
            two_factor_enabled, failed_login_attempts,
            created_at, updated_at
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'activity') {
        // Get user activity log
        const { data: activity, error } = await supabaseClient
          .from('user_activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({ activity }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error('Invalid endpoint');

  } catch (error) {
    console.error('User management error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});