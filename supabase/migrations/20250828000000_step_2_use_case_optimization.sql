-- =============================================================================
-- STEP 2: COMPREHENSIVE USE CASE LIBRARY OPTIMIZATION
-- =============================================================================
-- This script focuses exclusively on cleaning, standardizing, and optimizing the use_case_library table.

-- =============================================================================
-- PHASE 2.1: ENSURE TABLE AND COLUMNS EXIST
-- =============================================================================
DO $$
BEGIN
    -- First, check if the use_case_library table exists. If not, this script will do nothing.
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'use_case_library' AND table_schema = 'public') THEN

        -- Add 'status' column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'use_case_library' AND column_name = 'status') THEN
            ALTER TABLE public.use_case_library ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'draft'));
        END IF;

        -- Add 'complexity' column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'use_case_library' AND column_name = 'complexity') THEN
            ALTER TABLE public.use_case_library ADD COLUMN complexity TEXT NOT NULL DEFAULT 'medium' CHECK (complexity IN ('low', 'medium', 'high'));
        END IF;
        
    END IF;
END
$$;

-- =============================================================================
-- PHASE 2.2: STANDARDIZE CATEGORY NAMES
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'use_case_library' AND table_schema = 'public') THEN
        -- Trim whitespace
        UPDATE public.use_case_library SET category = TRIM(category);

        -- Standardize to Title Case
        UPDATE public.use_case_library SET category = INITCAP(category);

        -- Example Standardizations (add more as needed)
        UPDATE public.use_case_library SET category = 'Authentication' WHERE category ILIKE 'auth%';
        UPDATE public.use_case_library SET category = 'Authorization' WHERE category ILIKE 'author%';
        UPDATE public.use_case_library SET category = 'Compliance' WHERE category ILIKE 'compl%';
        UPDATE public.use_case_library SET category = 'Monitoring' WHERE category ILIKE 'monit%';
        UPDATE public.use_case_library SET category = 'Security' WHERE category ILIKE 'sec%';

    END IF;
END
$$;

-- =============================================================================
-- PHASE 2.3: REMOVE DUPLICATE USE CASES
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'use_case_library' AND table_schema = 'public') THEN

        -- We delete rows that have the same name and category, keeping the one that was most recently updated.
        DELETE FROM public.use_case_library
        WHERE id NOT IN (
            SELECT DISTINCT ON (name, category) id
            FROM public.use_case_library
            ORDER BY name, category, updated_at DESC, created_at DESC
        );

    END IF;
END
$$;

-- =============================================================================
-- PHASE 2.4: ADD UNIQUE CONSTRAINT AND PERFORMANCE INDEXES
-- =============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'use_case_library' AND table_schema = 'public') THEN

        -- Add a unique constraint to prevent future duplicates on name and category
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_use_case_name_category' AND conrelid = 'public.use_case_library'::regclass) THEN
            ALTER TABLE public.use_case_library ADD CONSTRAINT unique_use_case_name_category UNIQUE (name, category);
        END IF;

        -- Add indexes for better query performance
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_use_case_library_name') THEN
            CREATE INDEX idx_use_case_library_name ON public.use_case_library(name);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_use_case_library_category') THEN
            CREATE INDEX idx_use_case_library_category ON public.use_case_library(category);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_use_case_library_status') THEN
            CREATE INDEX idx_use_case_library_status ON public.use_case_library(status);
        END IF;

    END IF;
END
$$;

-- =============================================================================
-- FINAL REPORT
-- =============================================================================
DO $$
DECLARE
    use_case_count INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'use_case_library' AND table_schema = 'public') THEN
        SELECT COUNT(*) INTO use_case_count FROM public.use_case_library;
        RAISE NOTICE 'Use Case Library Optimization Complete. Total use cases: %', use_case_count;
    ELSE
        RAISE NOTICE 'Use Case Library table not found. Skipping optimization.';
    END IF;
END
$$;
