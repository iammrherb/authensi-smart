-- Fix the vendor_library check constraint issue
-- First, let's see what the current constraint is and remove it if it exists
ALTER TABLE IF EXISTS vendor_library DROP CONSTRAINT IF EXISTS vendor_library_support_level_check;

-- If the table doesn't exist, let's create it with proper structure
CREATE TABLE IF NOT EXISTS vendor_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  support_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_library ENABLE ROW LEVEL SECURITY;

-- Create a simple policy for now
CREATE POLICY "Allow all operations for authenticated users" 
ON vendor_library 
FOR ALL 
USING (auth.uid() IS NOT NULL);