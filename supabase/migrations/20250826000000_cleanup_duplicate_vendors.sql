-- =============================================================================
-- CLEANUP DUPLICATE VENDORS MIGRATION
-- =============================================================================
-- This migration removes duplicate vendor entries and ensures data consistency
-- across the vendor_library table

-- First, identify and log duplicate vendors
CREATE TEMP TABLE duplicate_vendors AS
SELECT 
  vendor_name,
  COUNT(*) as count,
  array_agg(id) as duplicate_ids,
  array_agg(created_at) as created_dates
FROM vendor_library 
GROUP BY vendor_name 
HAVING COUNT(*) > 1;

-- Log duplicate vendors for review
INSERT INTO audit_log (action, table_name, record_id, details, created_at)
SELECT 
  'DUPLICATE_DETECTED' as action,
  'vendor_library' as table_name,
  duplicate_ids[1] as record_id,
  json_build_object(
    'vendor_name', vendor_name,
    'duplicate_count', count,
    'duplicate_ids', duplicate_ids,
    'created_dates', created_dates
  ) as details,
  now() as created_at
FROM duplicate_vendors;

-- Keep the most recent entry for each duplicate vendor
-- Delete older duplicates
DELETE FROM vendor_library 
WHERE id IN (
  SELECT unnest(duplicate_ids[2:array_length(duplicate_ids, 1)]) 
  FROM duplicate_vendors
);

-- Clean up vendor names to ensure consistency
UPDATE vendor_library 
SET vendor_name = TRIM(vendor_name)
WHERE vendor_name != TRIM(vendor_name);

-- Standardize common vendor name variations
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

-- Ensure all vendors have required fields
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

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_library_name ON vendor_library(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendor_library_category ON vendor_library(category);
CREATE INDEX IF NOT EXISTS idx_vendor_library_support_level ON vendor_library(support_level);
CREATE INDEX IF NOT EXISTS idx_vendor_library_status ON vendor_library(status);

-- Add unique constraint on vendor_name to prevent future duplicates
ALTER TABLE vendor_library 
ADD CONSTRAINT unique_vendor_name UNIQUE (vendor_name);

-- Update statistics
ANALYZE vendor_library;

-- Log cleanup completion
INSERT INTO audit_log (action, table_name, record_id, details, created_at)
VALUES (
  'DUPLICATE_CLEANUP_COMPLETED',
  'vendor_library',
  NULL,
  json_build_object(
    'duplicates_removed', (SELECT COUNT(*) FROM duplicate_vendors),
    'total_vendors_after_cleanup', (SELECT COUNT(*) FROM vendor_library),
    'cleanup_timestamp', now()
  ),
  now()
);

-- Clean up temporary table
DROP TABLE duplicate_vendors;
