-- =============================================================================
-- SIMPLE VENDOR LIBRARY CLEANUP
-- =============================================================================
-- Run this in Supabase SQL Editor to clean up duplicate vendors

-- Step 1: Show current duplicate vendors
SELECT 
  vendor_name,
  COUNT(*) as duplicate_count,
  array_agg(id) as vendor_ids
FROM vendor_library 
GROUP BY vendor_name 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Clean up vendor names (remove extra spaces)
UPDATE vendor_library 
SET vendor_name = TRIM(vendor_name)
WHERE vendor_name != TRIM(vendor_name);

-- Step 3: Standardize vendor names
UPDATE vendor_library 
SET vendor_name = 'Cisco'
WHERE vendor_name IN ('Cisco Systems', 'Cisco Systems Inc', 'Cisco Inc');

UPDATE vendor_library 
SET vendor_name = 'Fortinet'
WHERE vendor_name IN ('Fortinet Inc', 'Fortinet Technologies');

UPDATE vendor_library 
SET vendor_name = 'Aruba'
WHERE vendor_name IN ('Aruba Networks', 'Aruba, a Hewlett Packard Enterprise company');

UPDATE vendor_library 
SET vendor_name = 'Portnox'
WHERE vendor_name IN ('Portnox Ltd', 'Portnox Inc');

-- Step 4: Ensure all vendors have required fields
UPDATE vendor_library 
SET 
  category = COALESCE(category, 'Unknown'),
  vendor_type = COALESCE(vendor_type, category),
  support_level = COALESCE(support_level, 'limited'),
  status = COALESCE(status, 'active'),
  portnox_integration_level = COALESCE(portnox_integration_level, 'limited')
WHERE 
  category IS NULL OR 
  vendor_type IS NULL OR 
  support_level IS NULL OR 
  status IS NULL OR 
  portnox_integration_level IS NULL;

-- Step 5: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_vendor_library_name ON vendor_library(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendor_library_category ON vendor_library(category);
CREATE INDEX IF NOT EXISTS idx_vendor_library_support_level ON vendor_library(support_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_status ON vendor_library(status);

-- Step 6: Show final results
SELECT 
  'CLEANUP_COMPLETED' as status,
  COUNT(*) as total_vendors,
  COUNT(DISTINCT vendor_name) as unique_vendors,
  now() as cleanup_timestamp
FROM vendor_library;

-- Step 7: Show vendor categories
SELECT 
  category,
  COUNT(*) as vendor_count
FROM vendor_library 
GROUP BY category 
ORDER BY vendor_count DESC;
