const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function grantSuperAdmin() {
  try {
    console.log('Starting SuperAdmin role assignment for iammrherb@aliensfault.com...\n');

    // Step 1: Get user ID
    console.log('Step 1: Finding user...');
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'iammrherb@aliensfault.com')
      .single();

    if (userError || !userData) {
      // Try using auth.admin if available
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError) {
        const user = users.find(u => u.email === 'iammrherb@aliensfault.com');
        if (user) {
          console.log(`✓ Found user via auth.admin: ${user.id}`);
          userData = { id: user.id, email: user.email };
        } else {
          throw new Error('User iammrherb@aliensfault.com not found');
        }
      } else {
        throw new Error(`User lookup failed: ${userError?.message || 'User not found'}`);
      }
    } else {
      console.log(`✓ Found user: ${userData.id}`);
    }

    const userId = userData.id;

    // Step 2: Create super_admin role
    console.log('\nStep 2: Creating super_admin role...');
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .upsert({
        name: 'super_admin',
        description: 'Super Administrator with full system access',
        is_system_role: true,
        priority: 100
      }, {
        onConflict: 'name'
      })
      .select()
      .single();

    if (roleError) {
      // Try to fetch existing role
      const { data: existingRole } = await supabase
        .from('roles')
        .select('*')
        .eq('name', 'super_admin')
        .single();
      
      if (existingRole) {
        console.log(`✓ Using existing super_admin role: ${existingRole.id}`);
        roleData = existingRole;
      } else {
        throw new Error(`Role creation failed: ${roleError.message}`);
      }
    } else {
      console.log(`✓ Super admin role ready: ${roleData.id}`);
    }

    const roleId = roleData.id;

    // Step 3: Create permissions
    console.log('\nStep 3: Creating permissions...');
    const permissions = [
      { name: 'system.admin', description: 'Full system administration' },
      { name: 'user.manage', description: 'Manage all users' },
      { name: 'role.manage', description: 'Manage all roles' },
      { name: 'project.manage', description: 'Manage all projects' },
      { name: 'resource.manage', description: 'Manage all resources' },
      { name: 'report.manage', description: 'Manage all reports' },
      { name: 'portal.manage', description: 'Manage all portals' }
    ];

    for (const perm of permissions) {
      const { error } = await supabase
        .from('permissions')
        .upsert(perm, { onConflict: 'name' });
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`  Warning: Could not create permission ${perm.name}: ${error.message}`);
      }
    }
    console.log('✓ Permissions created/verified');

    // Step 4: Grant all permissions to super_admin role
    console.log('\nStep 4: Granting permissions to super_admin role...');
    const { data: allPermissions } = await supabase
      .from('permissions')
      .select('id, name');

    if (allPermissions && allPermissions.length > 0) {
      for (const permission of allPermissions) {
        await supabase
          .from('role_permissions')
          .upsert({
            role_id: roleId,
            permission_id: permission.id
          }, {
            onConflict: 'role_id,permission_id'
          });
      }
      console.log(`✓ Granted ${allPermissions.length} permissions to super_admin role`);
    }

    // Step 5: Remove existing role assignments
    console.log('\nStep 5: Removing existing role assignments...');
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.log(`  Warning: Could not remove existing roles: ${deleteError.message}`);
    } else {
      console.log('✓ Cleared existing role assignments');
    }

    // Step 6: Assign super_admin role
    console.log('\nStep 6: Assigning super_admin role...');
    const { error: assignError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        assigned_by: userId
      });

    if (assignError) {
      throw new Error(`Role assignment failed: ${assignError.message}`);
    }
    console.log('✓ Successfully assigned super_admin role');

    // Step 7: Verify assignment
    console.log('\nStep 7: Verifying assignment...');
    const { data: verification } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        roles!inner(name, description),
        assigned_at
      `)
      .eq('user_id', userId)
      .single();

    if (verification && verification.roles) {
      console.log('\n✅ SUCCESS! User iammrherb@aliensfault.com now has:');
      console.log(`   Role: ${verification.roles.name}`);
      console.log(`   Description: ${verification.roles.description}`);
      console.log(`   Assigned at: ${verification.assigned_at}`);
    }

    // Step 8: Show permission count
    const { data: rolePerms } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleId);

    if (rolePerms) {
      console.log(`   Total permissions: ${rolePerms.length}`);
    }

    console.log('\n🎉 SuperAdmin role successfully granted!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the update
grantSuperAdmin();


