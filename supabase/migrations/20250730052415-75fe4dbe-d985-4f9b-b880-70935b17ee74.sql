-- Check existing vendor_library entries to see valid support_level values
SELECT DISTINCT support_level FROM vendor_library WHERE support_level IS NOT NULL;

-- Check existing vendor_type values 
SELECT DISTINCT vendor_type FROM vendor_library WHERE vendor_type IS NOT NULL;

-- Get a sample row to understand the structure
SELECT * FROM vendor_library LIMIT 1;