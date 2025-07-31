import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  email: string;
  custom_role_id: string;
  scope_type?: string;
  scope_id?: string;
  personal_message?: string;
}

interface ApprovalRequest {
  invitation_id: string;
  action: 'approve' | 'reject';
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

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const action = pathParts[pathParts.length - 1];
    
    console.log('Request details:', {
      method: req.method,
      pathname: url.pathname,
      pathParts,
      action,
      searchParams: url.search
    });

    if (req.method === 'POST') {
      if (action === 'invite') {
        const { email, custom_role_id, scope_type = 'global', scope_id, personal_message }: InvitationRequest = await req.json();
        
        // Generate invitation token
        const invitation_token = crypto.randomUUID();
        
        // Create invitation record
        const { data: invitation, error: inviteError } = await supabaseClient
          .from('user_invitations')
          .insert({
            email,
            invited_by: user.id,
            custom_role_id,
            scope_type,
            scope_id,
            invitation_token,
            metadata: { personal_message }
          })
          .select('*, custom_roles(*)')
          .single();

        if (inviteError) throw inviteError;

        // TODO: Send email invitation (would integrate with email service)
        console.log(`Invitation created for ${email} with token: ${invitation_token}`);

        return new Response(JSON.stringify({ 
          success: true, 
          invitation,
          message: 'Invitation sent successfully. The user will receive an email with further instructions.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'approve') {
        const { invitation_id, action: approvalAction }: ApprovalRequest = await req.json();
        
        // Check if user can approve invitations
        const { data: canManage } = await supabaseClient.rpc('can_manage_roles', {
          _user_id: user.id,
          _scope_type: 'global'
        });

        if (!canManage) {
          throw new Error('Insufficient permissions to approve invitations');
        }

        // Update invitation status
        const { data: invitation, error: updateError } = await supabaseClient
          .from('user_invitations')
          .update({
            status: approvalAction === 'approve' ? 'approved' : 'rejected',
            approved_by: user.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', invitation_id)
          .eq('status', 'pending')
          .select('*, custom_roles(*)')
          .single();

        if (updateError) throw updateError;

        if (approvalAction === 'approve') {
          // TODO: Send approval email to user
          console.log(`Invitation approved for ${invitation.email}`);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          invitation,
          message: `Invitation ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'accept') {
        const { invitation_token, password, first_name, last_name } = await req.json();
        
        // Find and validate invitation
        const { data: invitation, error: findError } = await supabaseClient
          .from('user_invitations')
          .select('*, custom_roles(*)')
          .eq('invitation_token', invitation_token)
          .eq('status', 'approved')
          .gt('expires_at', new Date().toISOString())
          .single();

        if (findError || !invitation) {
          throw new Error('Invalid or expired invitation');
        }

        // Create user account using service role
        const serviceClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
          email: invitation.email,
          password,
          user_metadata: {
            first_name,
            last_name,
          },
          email_confirm: true
        });

        if (createError) throw createError;

        if (newUser.user) {
          // Assign role to new user
          const { error: roleError } = await serviceClient
            .from('user_roles')
            .insert({
              user_id: newUser.user.id,
              role: 'viewer', // Default role, will be overridden by custom role
              custom_role_id: invitation.custom_role_id,
              scope_type: invitation.scope_type,
              scope_id: invitation.scope_id,
              assigned_by: invitation.invited_by
            });

          if (roleError) throw roleError;

          // Mark invitation as used
          await serviceClient
            .from('user_invitations')
            .update({ status: 'used' })
            .eq('id', invitation.id);
        }

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Account created successfully. You can now sign in.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'GET') {
      if (action === 'pending') {
        // Get pending invitations for approval
        const { data: invitations, error } = await supabaseClient
          .from('user_invitations')
          .select('*, custom_roles(*)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ invitations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'validate') {
        const token = url.searchParams.get('token');
        if (!token) {
          throw new Error('Missing invitation token');
        }

        const { data: invitation, error } = await supabaseClient
          .from('user_invitations')
          .select('*, custom_roles(*)')
          .eq('invitation_token', token)
          .eq('status', 'approved')
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          valid: true, 
          invitation: {
            email: invitation.email,
            role_name: invitation.custom_roles.name,
            role_description: invitation.custom_roles.description
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error('Invalid endpoint');

  } catch (error) {
    console.error('User invitation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});