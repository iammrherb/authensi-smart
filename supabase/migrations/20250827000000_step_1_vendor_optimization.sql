-- =============================================================================
-- STEP 1: COMPREHENSIVE VENDOR LIBRARY OPTIMIZATION (v4)
-- =============================================================================
-- This script focuses exclusively on cleaning, standardizing, and optimizing the vendor_library table.
-- v4: Casts UUID to text for MIN() aggregation to resolve data type error.

-- =============================================================================
-- PHASE 1.0: TEMPORARILY DROP UNIQUE CONSTRAINT
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_vendor_name' AND conrelid = 'public.vendor_library'::regclass) THEN
            ALTER TABLE public.vendor_library DROP CONSTRAINT unique_vendor_name;
            RAISE NOTICE 'Dropped existing constraint: unique_vendor_name';
        END IF;
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vendor_library_vendor_name_key' AND conrelid = 'public.vendor_library'::regclass) THEN
            ALTER TABLE public.vendor_library DROP CONSTRAINT vendor_library_vendor_name_key;
            RAISE NOTICE 'Dropped existing constraint: vendor_library_vendor_name_key';
        END IF;
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.1: ENSURE TABLE AND COLUMNS EXIST
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_library' AND column_name = 'portnox_integration_level') THEN
            ALTER TABLE public.vendor_library ADD COLUMN portnox_integration_level TEXT DEFAULT 'limited';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendor_library' AND column_name = 'status') THEN
            ALTER TABLE public.vendor_library ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.2: STANDARDIZE AND CLEAN VENDOR NAMES
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        UPDATE public.vendor_library SET vendor_name = TRIM(vendor_name);
        UPDATE public.vendor_library SET vendor_name = 'Cisco' WHERE vendor_name ILIKE 'Cisco%' OR vendor_name ILIKE 'cisco systems%';
        UPDATE public.vendor_library SET vendor_name = 'Fortinet' WHERE vendor_name ILIKE 'Fortinet%';
        UPDATE public.vendor_library SET vendor_name = 'Aruba' WHERE vendor_name ILIKE 'Aruba%' OR vendor_name ILIKE 'hpe aruba%';
        UPDATE public.vendor_library SET vendor_name = 'Portnox' WHERE vendor_name ILIKE 'Portnox%';
        UPDATE public.vendor_library SET vendor_name = 'Juniper' WHERE vendor_name ILIKE 'Juniper%';
        UPDATE public.vendor_library SET vendor_name = 'Palo Alto Networks' WHERE vendor_name ILIKE 'Palo Alto%';
        UPDATE public.vendor_library SET vendor_name = 'Check Point' WHERE vendor_name ILIKE 'Check Point%' OR vendor_name ILIKE 'checkpoint%';
        UPDATE public.vendor_library SET vendor_name = 'Microsoft' WHERE vendor_name ILIKE 'Microsoft%';
        UPDATE public.vendor_library SET vendor_name = 'VMware' WHERE vendor_name ILIKE 'VMware%';
        UPDATE public.vendor_library SET vendor_name = 'CrowdStrike' WHERE vendor_name ILIKE 'CrowdStrike%';
        UPDATE public.vendor_library SET vendor_name = 'SentinelOne' WHERE vendor_name ILIKE 'SentinelOne%';
        UPDATE public.vendor_library SET vendor_name = 'Okta' WHERE vendor_name ILIKE 'Okta%';
        UPDATE public.vendor_library SET vendor_name = 'Ping Identity' WHERE vendor_name ILIKE 'Ping Identity%';
        UPDATE public.vendor_library SET vendor_name = 'Splunk' WHERE vendor_name ILIKE 'Splunk%';
        UPDATE public.vendor_library SET vendor_name = 'Rapid7' WHERE vendor_name ILIKE 'Rapid7%';
        UPDATE public.vendor_library SET vendor_name = 'Tenable' WHERE vendor_name ILIKE 'Tenable%';
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.3: REMAP FOREIGN KEY REFERENCES
-- =============================================================================
DO $$
DECLARE
    golden_record RECORD;
    duplicate_record RECORD;
BEGIN
    -- This block only runs if the vendor_library table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN

        -- Create a temporary table to map duplicate vendor IDs to their golden record ID
        CREATE TEMP TABLE vendor_id_mapping (
            duplicate_id UUID,
            golden_id UUID
        );

        -- Loop through each vendor name that has duplicates
        FOR golden_record IN
            SELECT vendor_name, (MIN(id::text))::uuid as golden_id
            FROM public.vendor_library
            GROUP BY vendor_name
            HAVING COUNT(*) > 1
        LOOP
            -- For each duplicate, insert its ID and the golden record's ID into the mapping
            FOR duplicate_record IN
                SELECT id FROM public.vendor_library
                WHERE vendor_name = golden_record.vendor_name AND id != golden_record.golden_id
            LOOP
                INSERT INTO vendor_id_mapping (duplicate_id, golden_id)
                VALUES (duplicate_record.id, golden_record.golden_id);
            END LOOP;
        END LOOP;

        -- Now, update all tables that reference the duplicate vendors
        -- 1. configuration_templates
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'configuration_templates' AND table_schema = 'public') THEN
            UPDATE public.configuration_templates t
            SET vendor_id = m.golden_id
            FROM vendor_id_mapping m
            WHERE t.vendor_id = m.duplicate_id;
            RAISE NOTICE 'Remapped foreign keys in configuration_templates.';
        END IF;

        -- 2. vendor_models
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_models' AND table_schema = 'public') THEN
            UPDATE public.vendor_models t
            SET vendor_id = m.golden_id
            FROM vendor_id_mapping m
            WHERE t.vendor_id = m.duplicate_id;
            RAISE NOTICE 'Remapped foreign keys in vendor_models.';
        END IF;

        -- 3. project_vendors
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_vendors' AND table_schema = 'public') THEN
            UPDATE public.project_vendors t
            SET vendor_id = m.golden_id
            FROM vendor_id_mapping m
            WHERE t.vendor_id = m.duplicate_id;
            RAISE NOTICE 'Remapped foreign keys in project_vendors.';
        END IF;
        
        -- 4. configuration_files
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'configuration_files' AND table_schema = 'public') THEN
            UPDATE public.configuration_files t
            SET vendor_id = m.golden_id
            FROM vendor_id_mapping m
            WHERE t.vendor_id = m.duplicate_id;
            RAISE NOTICE 'Remapped foreign keys in configuration_files.';
        END IF;

        -- Drop the temporary table
        DROP TABLE vendor_id_mapping;
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.4: REMOVE DUPLICATE VENDORS
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        -- With foreign keys remapped, we can now safely delete the duplicates.
        DELETE FROM public.vendor_library
        WHERE id NOT IN (
            SELECT (MIN(id::text))::uuid
            FROM public.vendor_library
            GROUP BY vendor_name
        );
        RAISE NOTICE 'Duplicate vendors removed.';
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.5: ENHANCE VENDOR DATA
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        UPDATE public.vendor_library SET category = 'Network', vendor_type = 'Switch/Router', portnox_integration_level = 'certified' WHERE vendor_name = 'Cisco';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'Firewall', portnox_integration_level = 'certified' WHERE vendor_name = 'Fortinet';
        UPDATE public.vendor_library SET category = 'Network', vendor_type = 'Wireless/Switch', portnox_integration_level = 'certified' WHERE vendor_name = 'Aruba';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'NAC', portnox_integration_level = 'native' WHERE vendor_name = 'Portnox';
        UPDATE public.vendor_library SET category = 'Network', vendor_type = 'Switch/Router', portnox_integration_level = 'supported' WHERE vendor_name = 'Juniper';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'Firewall', portnox_integration_level = 'supported' WHERE vendor_name = 'Palo Alto Networks';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'Firewall', portnox_integration_level = 'supported' WHERE vendor_name = 'Check Point';
        UPDATE public.vendor_library SET category = 'Identity', vendor_type = 'IdP/MDM', portnox_integration_level = 'supported' WHERE vendor_name = 'Microsoft';
        UPDATE public.vendor_library SET category = 'Virtualization', vendor_type = 'Hypervisor', portnox_integration_level = 'supported' WHERE vendor_name = 'VMware';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'EDR', portnox_integration_level = 'supported' WHERE vendor_name = 'CrowdStrike';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'EDR', portnox_integration_level = 'supported' WHERE vendor_name = 'SentinelOne';
        UPDATE public.vendor_library SET category = 'Identity', vendor_type = 'IdP', portnox_integration_level = 'certified' WHERE vendor_name = 'Okta';
        UPDATE public.vendor_library SET category = 'Identity', vendor_type = 'IdP', portnox_integration_level = 'supported' WHERE vendor_name = 'Ping Identity';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'SIEM', portnox_integration_level = 'supported' WHERE vendor_name = 'Splunk';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'Vulnerability Management', portnox_integration_level = 'supported' WHERE vendor_name = 'Rapid7';
        UPDATE public.vendor_library SET category = 'Security', vendor_type = 'Vulnerability Management', portnox_integration_level = 'supported' WHERE vendor_name = 'Tenable';
        RAISE NOTICE 'Vendor data enhanced.';
    END IF;
END
$$;

-- =============================================================================
-- PHASE 1.6: RE-ADD UNIQUE CONSTRAINTS AND INDEXES
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_vendor_name' AND conrelid = 'public.vendor_library'::regclass) THEN
            ALTER TABLE public.vendor_library ADD CONSTRAINT unique_vendor_name UNIQUE (vendor_name);
        END IF;
        CREATE INDEX IF NOT EXISTS idx_vendor_library_category ON public.vendor_library (category);
        CREATE INDEX IF NOT EXISTS idx_vendor_library_vendor_type ON public.vendor_library (vendor_type);
        CREATE INDEX IF NOT EXISTS idx_vendor_library_integration_level ON public.vendor_library (portnox_integration_level);
        RAISE NOTICE 'Unique constraint and indexes re-applied.';
    END IF;
END
$$;

-- =============================================================================
-- FINAL REPORT
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_library' AND table_schema = 'public') THEN
        RAISE NOTICE 'Vendor Library Optimization Complete. Total vendors: %', (SELECT COUNT(*) FROM public.vendor_library);
    ELSE
        RAISE NOTICE 'Vendor Library table not found. Skipping optimization.';
    END IF;
END
$$;
