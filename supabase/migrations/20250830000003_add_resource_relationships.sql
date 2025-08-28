-- =============================================
-- MIGRATION: ADD RESOURCE RELATIONSHIPS
-- =============================================
-- This migration creates the necessary infrastructure for creating
-- many-to-many relationships between different resource library items,
-- enabling a deeply interconnected and intelligent system.

-- =============================================
-- STEP 1: CREATE THE RELATIONSHIPS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.resource_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    source_resource_id UUID NOT NULL,
    source_resource_type VARCHAR(50) NOT NULL,
    
    target_resource_id UUID NOT NULL,
    target_resource_type VARCHAR(50) NOT NULL,
    
    relationship_type VARCHAR(50) NOT NULL, -- e.g., 'implements', 'requires', 'addresses', 'mitigates', 'competes_with'
    
    description TEXT, -- Optional context for the relationship
    metadata JSONB,   -- For additional structured data
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Ensure a relationship between two specific items is unique
    CONSTRAINT unique_relationship UNIQUE (
        source_resource_id, 
        source_resource_type, 
        target_resource_id, 
        target_resource_type, 
        relationship_type
    ),
    
    -- Prevent a resource from being related to itself in the same way
    CONSTRAINT no_self_relation CHECK (source_resource_id <> target_resource_id OR source_resource_type <> target_resource_type)
);

COMMENT ON TABLE public.resource_relationships IS 'Stores many-to-many relationships between different resource library items.';
COMMENT ON COLUMN public.resource_relationships.relationship_type IS 'e.g., implements, requires, addresses, mitigates, competes_with';

-- =============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Index for quickly finding all relationships for a given source resource
CREATE INDEX IF NOT EXISTS idx_resource_relationships_source ON public.resource_relationships(source_resource_id, source_resource_type);

-- Index for quickly finding all relationships for a given target resource
CREATE INDEX IF NOT EXISTS idx_resource_relationships_target ON public.resource_relationships(target_resource_id, target_resource_type);

-- Index on the relationship type for filtering by relationship
CREATE INDEX IF NOT EXISTS idx_resource_relationships_type ON public.resource_relationships(relationship_type);


-- =============================================
-- STEP 3: ENABLE RLS AND DEFINE POLICIES
-- =============================================
ALTER TABLE public.resource_relationships ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read Access
-- Allow anyone, including unauthenticated users, to read the relationships.
-- This is crucial for the UI to display the interconnected data.
CREATE POLICY "Public can read resource relationships"
ON public.resource_relationships
FOR SELECT
USING (true);

-- Policy: Authenticated Write Access
-- Allow any authenticated user to create, update, or delete relationships.
-- This can be tightened later if specific roles should manage this.
CREATE POLICY "Authenticated users can manage relationships"
ON public.resource_relationships
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- =============================================
-- MIGRATION COMPLETE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration for Resource Relationships complete.';
    RAISE NOTICE 'Table "resource_relationships" created with indexes and RLS policies.';
END;
$$;

