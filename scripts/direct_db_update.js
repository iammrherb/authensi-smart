const { Client } = require('pg');

// IMPORTANT: Replace this with your actual database connection string
// You can find this in Supabase Dashboard > Settings > Database > Connection string
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

async function grantSuperAdminDirectly() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected to database\n');

    // Step 1: Get user ID
    console.log('Step 1: Finding user iammrherb@aliensfault.com...');
    const userResult = await client.query(
      `SELECT id, email FROM auth.users WHERE email = $1`,
      ['iammrherb@aliensfault.com']
    );

    if (userResult.rows.length === 0) {
      throw new Error('User iammrherb@aliensfault.com not found in database');
    }

    const userId = userResult.rows[0].id;
    console.log(`✓ Found user: ${userId}\n`);

    // Step 2: Create super_admin role
    console.log('Step 2: Creating/updating super_admin role...');
    await client.query(`
      INSERT INTO public.roles (name, description, is_system_role, priority)
      VALUES ('super_admin', 'Super Administrator with full system access', true, 100)
      ON CONFLICT (name) 
      DO UPDATE SET 
        description = EXCLUDED.description,
        priority = EXCLUDED.priority,
        is_system_role = EXCLUDED.is_system_role
    `);

    const roleResult = await client.query(
      `SELECT id FROM public.roles WHERE name = 'super_admin'`
    );
    const roleId = roleResult.rows[0].id;
    console.log(`✓ Super admin role ready: ${roleId}\n`);

    // Step 3: Create basic permissions
    console.log('Step 3: Creating permissions...');
    const permissions = [
      ['system.admin', 'Full system administration'],
      ['user.manage', 'Manage all users'],
      ['role.manage', 'Manage all roles'],
      ['project.manage', 'Manage all projects'],
      ['resource.manage', 'Manage all resources'],
      ['report.manage', 'Manage all reports'],
      ['portal.manage', 'Manage all portals']
    ];

    for (const [name, description] of permissions) {
      await client.query(
        `INSERT INTO public.permissions (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [name, description]
      );
    }
    console.log('✓ Permissions created\n');

    // Step 4: Grant all permissions to super_admin
    console.log('Step 4: Granting all permissions to super_admin role...');
    await client.query(`
      INSERT INTO public.role_permissions (role_id, permission_id)
      SELECT $1, id FROM public.permissions
      ON CONFLICT (role_id, permission_id) DO NOTHING
    `, [roleId]);

    const permCountResult = await client.query(
      `SELECT COUNT(*) FROM public.role_permissions WHERE role_id = $1`,
      [roleId]
    );
    console.log(`✓ Granted ${permCountResult.rows[0].count} permissions\n`);

    // Step 5: Clear existing roles and assign super_admin
    console.log('Step 5: Assigning super_admin role to user...');
    
    // Delete existing roles
    await client.query(
      `DELETE FROM public.user_roles WHERE user_id = $1`,
      [userId]
    );

    // Assign super_admin role
    await client.query(
      `INSERT INTO public.user_roles (user_id, role_id, assigned_by)
       VALUES ($1, $2, $3)`,
      [userId, roleId, userId]
    );
    console.log('✓ Super admin role assigned\n');

    // Step 6: Verify
    console.log('Step 6: Verifying assignment...');
    const verifyResult = await client.query(`
      SELECT 
        u.email,
        r.name as role_name,
        r.priority,
        ur.assigned_at,
        COUNT(DISTINCT rp.permission_id) as permission_count
      FROM auth.users u
      JOIN public.user_roles ur ON u.id = ur.user_id
      JOIN public.roles r ON ur.role_id = r.id
      LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
      WHERE u.id = $1
      GROUP BY u.email, r.name, r.priority, ur.assigned_at
    `, [userId]);

    if (verifyResult.rows.length > 0) {
      const user = verifyResult.rows[0];
      console.log('\n✅ SUCCESS! SuperAdmin role granted:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role_name}`);
      console.log(`   Priority: ${user.priority}`);
      console.log(`   Permissions: ${user.permission_count}`);
      console.log(`   Assigned: ${user.assigned_at}`);
    }

    console.log('\n🎉 All done! You now have SuperAdmin access.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

// Instructions
console.log('========================================');
console.log('DIRECT DATABASE UPDATE FOR SUPERADMIN');
console.log('========================================\n');
console.log('To use this script:\n');
console.log('1. Get your database connection string from Supabase:');
console.log('   Dashboard > Settings > Database > Connection string\n');
console.log('2. Set it as an environment variable:');
console.log('   Windows: set DATABASE_URL="your-connection-string"');
console.log('   Mac/Linux: export DATABASE_URL="your-connection-string"\n');
console.log('3. Run: node scripts/direct_db_update.js\n');
console.log('OR edit the DATABASE_URL variable in this file directly.\n');
console.log('========================================\n');

// Check if DATABASE_URL is set
if (DATABASE_URL.includes('[PROJECT_ID]')) {
  console.log('⚠️  DATABASE_URL not configured. Please set your connection string first.\n');
  process.exit(1);
} else {
  console.log('Starting update...\n');
  grantSuperAdminDirectly();
}


