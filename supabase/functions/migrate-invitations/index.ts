import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check if user is super admin
    const { data: canManage } = await supabaseClient.rpc('can_manage_roles', {
      _user_id: user.id,
      _scope_type: 'global'
    });

    if (!canManage) {
      throw new Error('Insufficient permissions');
    }

    // Get all approved invitations
    const { data: invitations, error: invitationsError } = await supabaseClient
      .from('user_invitations')
      .select('*, custom_roles(*)')
      .eq('status', 'approved');

    if (invitationsError) throw invitationsError;

    const results = [];

    for (const invitation of invitations || []) {
      try {
        // Check if user already exists
        const { data: existingProfile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', invitation.email)
          .maybeSingle();

        if (existingProfile) {
          // User already exists, mark invitation as used
          await supabaseClient
            .from('user_invitations')
            .update({ status: 'used' })
            .eq('id', invitation.id);
          
          results.push({
            email: invitation.email,
            status: 'already_exists',
            message: 'User already exists, marked invitation as used'
          });
          continue;
        }

        // Generate temporary password
        const tempPassword = 'TempPass123!' + Math.random().toString(36).substring(2, 15);

        // Create user account
        const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
          email: invitation.email,
          password: tempPassword,
          user_metadata: {
            first_name: invitation.email.split('@')[0],
            last_name: 'User',
          },
          email_confirm: true
        });

        if (createError) {
          results.push({
            email: invitation.email,
            status: 'error',
            message: createError.message
          });
          continue;
        }

        if (newUser.user) {
          // Assign role to new user
          const { error: roleError } = await serviceClient
            .from('user_roles')
            .insert({
              user_id: newUser.user.id,
              role: 'viewer',
              custom_role_id: invitation.custom_role_id,
              scope_type: invitation.scope_type,
              scope_id: invitation.scope_id,
              assigned_by: invitation.invited_by
            });

          if (roleError) {
            console.error('Role assignment error:', roleError);
          }

          // Mark invitation as used
          await serviceClient
            .from('user_invitations')
            .update({ status: 'used' })
            .eq('id', invitation.id);

          results.push({
            email: invitation.email,
            status: 'created',
            message: `Account created with temporary password: ${tempPassword}`,
            user_id: newUser.user.id
          });
        }
      } catch (error) {
        results.push({
          email: invitation.email,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${results.length} invitations`,
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Migration error:', error);
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