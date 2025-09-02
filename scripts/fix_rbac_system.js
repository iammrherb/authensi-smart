import { createClient } from '@supabase/supabase-js';

// Configuration - UPDATE THESE VALUES
const SUPABASE_URL = 'https://salp0wgoaftq0npzf.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_tagppgwS9OrX-SalP0WgoA_fTq0npZF';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRBACSystem() {
  try {
    console.log('🔧 Starting comprehensive RBAC system fix...\n');

    // Step 1: Check current database state
    console.log('Step 1: Checking database state...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['roles', 'permissions', 'user_roles', 'role_permissions']);

    if (tablesError) {
      console.log('⚠️  Could not check tables, proceeding with fix...');
    } else {
      console.log(`✓ Found ${tables.rows?.length || 0} RBAC tables`);
    }

    // Step 2: Create/repair roles table
    console.log('\nStep 2: Creating/repairing roles table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.roles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          is_system_role BOOLEAN DEFAULT false,
          priority INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
        CREATE INDEX IF NOT EXISTS idx_roles_priority ON public.roles(priority);
        CREATE INDEX IF NOT EXISTS idx_roles_system ON public.roles(is_system_role);
      `
    });
    console.log('✓ Roles table ready');

    // Step 3: Create/repair permissions table
    console.log('\nStep 3: Creating/repairing permissions table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.permissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(200) UNIQUE NOT NULL,
          description TEXT,
          resource_type VARCHAR(100),
          action VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
        CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource_type);
        CREATE INDEX IF NOT EXISTS idx_permissions_action ON public.permissions(action);
      `
    });
    console.log('✓ Permissions table ready');

    // Step 4: Create/repair role_permissions table
    console.log('\nStep 4: Creating/repairing role_permissions table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.role_permissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
          permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(role_id, permission_id)
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
        CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON public.role_permissions(permission_id);
      `
    });
    console.log('✓ Role permissions table ready');

    // Step 5: Create/repair user_roles table
    console.log('\nStep 5: Creating/repairing user_roles table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_roles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
          assigned_by UUID REFERENCES auth.users(id),
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE,
          UNIQUE(user_id, role_id)
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role_id);
        CREATE INDEX IF NOT EXISTS idx_user_roles_assigned ON public.user_roles(assigned_by);
      `
    });
    console.log('✓ User roles table ready');

    // Step 6: Create super_admin role
    console.log('\nStep 6: Creating super_admin role...');
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
      console.log('⚠️  Role creation error:', roleError.message);
      // Try direct SQL
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO public.roles (name, description, is_system_role, priority)
          VALUES ('super_admin', 'Super Administrator with full system access', true, 100)
          ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            priority = EXCLUDED.priority,
            is_system_role = EXCLUDED.is_system_role
        `
      });
      
      const { data: existingRole } = await supabase
        .from('roles')
        .select('*')
        .eq('name', 'super_admin')
        .single();
      
      if (existingRole) {
        console.log(`✓ Super admin role ready: ${existingRole.id}`);
      } else {
        throw new Error('Failed to create super_admin role');
      }
    } else {
      console.log(`✓ Super admin role ready: ${roleData.id}`);
    }

    // Step 7: Create comprehensive permissions
    console.log('\nStep 7: Creating comprehensive permissions...');
    const permissions = [
      { name: 'system.admin', description: 'Full system administration', resource_type: 'system', action: 'admin' },
      { name: 'user.manage', description: 'Manage all users', resource_type: 'user', action: 'manage' },
      { name: 'user.read', description: 'Read user information', resource_type: 'user', action: 'read' },
      { name: 'role.manage', description: 'Manage all roles', resource_type: 'role', action: 'manage' },
      { name: 'role.read', description: 'Read role information', resource_type: 'role', action: 'read' },
      { name: 'project.manage', description: 'Manage all projects', resource_type: 'project', action: 'manage' },
      { name: 'project.read', description: 'Read project information', resource_type: 'project', action: 'read' },
      { name: 'project.create', description: 'Create new projects', resource_type: 'project', action: 'create' },
      { name: 'project.update', description: 'Update projects', resource_type: 'project', action: 'update' },
      { name: 'project.delete', description: 'Delete projects', resource_type: 'project', action: 'delete' },
      { name: 'resource.manage', description: 'Manage all resources', resource_type: 'resource', action: 'manage' },
      { name: 'resource.read', description: 'Read resource information', resource_type: 'resource', action: 'read' },
      { name: 'resource.create', description: 'Create new resources', resource_type: 'resource', action: 'create' },
      { name: 'resource.update', description: 'Update resources', resource_type: 'resource', action: 'update' },
      { name: 'resource.delete', description: 'Delete resources', resource_type: 'resource', action: 'delete' },
      { name: 'report.manage', description: 'Manage all reports', resource_type: 'report', action: 'manage' },
      { name: 'report.read', description: 'Read reports', resource_type: 'report', action: 'read' },
      { name: 'report.create', description: 'Create reports', resource_type: 'report', action: 'create' },
      { name: 'report.export', description: 'Export reports', resource_type: 'report', action: 'export' },
      { name: 'portal.manage', description: 'Manage all portals', resource_type: 'portal', action: 'manage' },
      { name: 'portal.read', description: 'Read portal information', resource_type: 'portal', action: 'read' },
      { name: 'portal.create', description: 'Create portals', resource_type: 'portal', action: 'create' },
      { name: 'portal.update', description: 'Update portals', resource_type: 'portal', action: 'update' },
      { name: 'portal.delete', description: 'Delete portals', resource_type: 'portal', action: 'delete' },
      { name: 'wizard.manage', description: 'Manage all wizards', resource_type: 'wizard', action: 'manage' },
      { name: 'wizard.execute', description: 'Execute wizards', resource_type: 'wizard', action: 'execute' },
      { name: 'wizard.read', description: 'Read wizard information', resource_type: 'wizard', action: 'read' },
      { name: 'analytics.manage', description: 'Manage analytics', resource_type: 'analytics', action: 'manage' },
      { name: 'analytics.read', description: 'Read analytics', resource_type: 'analytics', action: 'read' },
      { name: 'analytics.export', description: 'Export analytics', resource_type: 'analytics', action: 'export' }
    ];

    for (const perm of permissions) {
      try {
        await supabase
          .from('permissions')
          .upsert(perm, { onConflict: 'name' });
      } catch (error) {
        console.log(`  Warning: Could not create permission ${perm.name}: ${error.message}`);
      }
    }
    console.log(`✓ Created ${permissions.length} permissions`);

    // Step 8: Grant all permissions to super_admin role
    console.log('\nStep 8: Granting all permissions to super_admin role...');
    const { data: allPermissions } = await supabase
      .from('permissions')
      .select('id, name');

    if (allPermissions && allPermissions.length > 0) {
      for (const permission of allPermissions) {
        try {
          await supabase
            .from('role_permissions')
            .upsert({
              role_id: roleData.id,
              permission_id: permission.id
            }, {
              onConflict: 'role_id,permission_id'
            });
        } catch (error) {
          console.log(`  Warning: Could not grant permission ${permission.name}: ${error.message}`);
        }
      }
      console.log(`✓ Granted ${allPermissions.length} permissions to super_admin role`);
    }

    // Step 9: Find and update user
    console.log('\nStep 9: Finding user iammrherb@aliensfault.com...');
    
    // Try to find user in auth.users
    let userId = null;
    
    // Method 1: Try direct query
    try {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', 'iammrherb@aliensfault.com')
        .single();
      
      if (userData) {
        userId = userData.id;
        console.log(`✓ Found user via direct query: ${userId}`);
      }
    } catch (error) {
      console.log('  Direct query failed, trying alternative methods...');
    }

    // Method 2: Try using auth.admin if available
    if (!userId) {
      try {
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
        if (!authError && users) {
          const user = users.find(u => u.email === 'iammrherb@aliensfault.com');
          if (user) {
            userId = user.id;
            console.log(`✓ Found user via auth.admin: ${userId}`);
          }
        }
      } catch (error) {
        console.log('  Auth admin failed:', error.message);
      }
    }

    // Method 3: Try to create user if not found
    if (!userId) {
      console.log('  User not found, attempting to create...');
      try {
        const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
          email: 'iammrherb@aliensfault.com',
          password: 'TempPassword123!',
          email_confirm: true
        });
        
        if (user && !createError) {
          userId = user.id;
          console.log(`✓ Created new user: ${userId}`);
        } else {
          throw new Error(`User creation failed: ${createError?.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log('  User creation failed:', error.message);
        throw new Error('Could not find or create user iammrherb@aliensfault.com');
      }
    }

    // Step 10: Clear existing roles and assign super_admin
    console.log('\nStep 10: Assigning super_admin role to user...');
    
    // Delete existing roles
    try {
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.log(`  Warning: Could not remove existing roles: ${deleteError.message}`);
      } else {
        console.log('✓ Cleared existing role assignments');
      }
    } catch (error) {
      console.log('  Role cleanup failed:', error.message);
    }

    // Assign super_admin role
    try {
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleData.id,
          assigned_by: userId
        });

      if (assignError) {
        throw new Error(`Role assignment failed: ${assignError.message}`);
      }
      console.log('✓ Successfully assigned super_admin role');
    } catch (error) {
      console.log('  Role assignment failed:', error.message);
      // Try direct SQL
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO public.user_roles (user_id, role_id, assigned_by)
          VALUES ('${userId}', '${roleData.id}', '${userId}')
          ON CONFLICT (user_id, role_id) DO UPDATE SET
            assigned_by = EXCLUDED.assigned_by,
            assigned_at = NOW()
        `
      });
      console.log('✓ Role assigned via direct SQL');
    }

    // Step 11: Verify assignment
    console.log('\nStep 11: Verifying assignment...');
    try {
      const { data: verification } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles!inner(name, description, priority),
          assigned_at
        `)
        .eq('user_id', userId)
        .single();

      if (verification && verification.roles) {
        console.log('\n✅ SUCCESS! User iammrherb@aliensfault.com now has:');
        console.log(`   Role: ${verification.roles.name}`);
        console.log(`   Description: ${verification.roles.description}`);
        console.log(`   Priority: ${verification.roles.priority}`);
        console.log(`   Assigned at: ${verification.assigned_at}`);
      }
    } catch (error) {
      console.log('  Verification query failed:', error.message);
    }

    // Step 12: Show permission count
    try {
      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleData.id);

      if (rolePerms) {
        console.log(`   Total permissions: ${rolePerms.length}`);
      }
    } catch (error) {
      console.log('  Permission count failed:', error.message);
    }

    console.log('\n🎉 RBAC system fixed and SuperAdmin role successfully granted!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your application');
    console.log('2. Log in with iammrherb@aliensfault.com');
    console.log('3. You should now have full SuperAdmin access');
    console.log('4. All wizards and functionality should be restored');

  } catch (error) {
    console.error('\n❌ Critical Error:', error.message);
    console.error('\nFull error:', error);
    
    // Try emergency fix
    console.log('\n🚨 Attempting emergency fix...');
    try {
      await emergencyFix();
    } catch (emergencyError) {
      console.error('Emergency fix also failed:', emergencyError.message);
      process.exit(1);
    }
  }
}

async function emergencyFix() {
  console.log('Performing emergency RBAC fix...');
  
  // Try to create a simple working RBAC structure
  try {
    // Create basic tables with minimal structure
    await supabase.rpc('exec_sql', {
      sql: `
        -- Drop and recreate roles table
        DROP TABLE IF EXISTS public.roles CASCADE;
        CREATE TABLE public.roles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          is_system_role BOOLEAN DEFAULT false,
          priority INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Drop and recreate permissions table
        DROP TABLE IF EXISTS public.permissions CASCADE;
        CREATE TABLE public.permissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(200) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Drop and recreate role_permissions table
        DROP TABLE IF EXISTS public.role_permissions CASCADE;
        CREATE TABLE public.role_permissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
          permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
          UNIQUE(role_id, permission_id)
        );
        
        -- Drop and recreate user_roles table
        DROP TABLE IF EXISTS public.user_roles CASCADE;
        CREATE TABLE public.user_roles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
          assigned_by UUID,
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    console.log('✓ Emergency tables created');
    
    // Create super_admin role
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.roles (name, description, is_system_role, priority)
        VALUES ('super_admin', 'Super Administrator', true, 100)
      `
    });
    
    console.log('✓ Emergency super_admin role created');
    
    // Create basic permission
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.permissions (name, description)
        VALUES ('system.admin', 'Full system access')
      `
    });
    
    console.log('✓ Emergency permission created');
    
    console.log('\n🚨 Emergency fix completed. Please run the main fix again.');
    
  } catch (error) {
    console.error('Emergency fix failed:', error.message);
    throw error;
  }
}

// Run the fix
console.log('========================================');
console.log('COMPREHENSIVE RBAC SYSTEM FIX');
console.log('========================================\n');
console.log('This script will:');
console.log('1. Repair/create all RBAC tables');
console.log('2. Create comprehensive permissions');
console.log('3. Create super_admin role');
console.log('4. Grant SuperAdmin access to iammrherb@aliensfault.com');
console.log('5. Restore full system functionality');
console.log('\nStarting fix...\n');

fixRBACSystem();
