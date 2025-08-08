-- Strengthen RLS on catalog_categories so linter doesn't warn about enabled RLS without policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catalog_categories' AND policyname='Admins manage catalog categories'
  ) THEN
    CREATE POLICY "Admins manage catalog categories" 
    ON public.catalog_categories
    FOR ALL
    USING (has_role(auth.uid(), 'super_admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));
  END IF;
END $$;