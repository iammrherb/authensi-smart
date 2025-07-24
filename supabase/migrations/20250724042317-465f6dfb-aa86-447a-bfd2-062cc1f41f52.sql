-- Enhanced site management with comprehensive NAC deployment tracking
ALTER TABLE sites ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS site_id text UNIQUE;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS timeline_start date;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS timeline_end date;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS current_phase text DEFAULT 'planning';
ALTER TABLE sites ADD COLUMN IF NOT EXISTS progress_percentage integer DEFAULT 0;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true;

-- Comprehensive NAC deployment configuration as JSONB
ALTER TABLE sites ADD COLUMN IF NOT EXISTS deployment_config jsonb DEFAULT '{
  "network": {
    "wired_vendors": [],
    "wireless_vendors": [],
    "firewall_vendors": [],
    "switch_vendors": []
  },
  "security": {
    "edy_integration": false,
    "idp_integration": "",
    "mfa_enabled": false,
    "vpn_integration": false,
    "saml_enabled": false,
    "openid_enabled": false,
    "microsoft_eam": false,
    "siem_integration": false,
    "tacacs_enabled": false,
    "ztna_enabled": false
  },
  "authentication": {
    "auth_type": "",
    "eap_tls": false,
    "eap_ttls": false,
    "mschap": false,
    "pap": false,
    "mab": false
  },
  "user_management": {
    "iot_onboarding": false,
    "guest_access": false,
    "contractor_access": false,
    "deployment_mode": "agent",
    "mdm_integration": false,
    "active_directory": false,
    "gpo_integration": false
  },
  "identity_providers": [],
  "sso_mfa_config": {},
  "device_types": {
    "laptops": 0,
    "desktops": 0,
    "mobile_ios": 0,
    "mobile_android": 0,
    "tablets": 0,
    "printers": 0,
    "scanners": 0,
    "ip_phones": 0,
    "ip_cameras": 0,
    "hvac": 0,
    "iot_devices": 0,
    "ot_devices": 0
  },
  "user_types": {
    "employees": 0,
    "contractors": 0,
    "guests": 0,
    "service_accounts": 0
  },
  "go_live_date": null,
  "vendor_details": {},
  "use_cases": [],
  "implementation_notes": ""
}'::jsonb;

-- Enhanced user roles for comprehensive team management
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('project_owner', 'project_manager', 'lead_engineer', 'engineer', 'viewer');
    END IF;
END $$;

-- Add new role values if they don't exist
DO $$ BEGIN
    BEGIN
        ALTER TYPE app_role ADD VALUE 'super_admin';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'sales';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'solution_engineer';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'technical_account_manager';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'product_manager';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'customer_contact';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE app_role ADD VALUE 'technical_owner';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

-- Auto-assign first user as global admin function enhancement
CREATE OR REPLACE FUNCTION auto_assign_global_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user and no global admin exists
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE role = 'project_owner' AND scope_type = 'global'
  ) THEN
    INSERT INTO user_roles (user_id, role, scope_type, assigned_by)
    VALUES (NEW.id, 'project_owner', 'global', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign global admin to first user
DROP TRIGGER IF EXISTS auto_assign_first_admin ON profiles;
CREATE TRIGGER auto_assign_first_admin
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_assign_global_admin();