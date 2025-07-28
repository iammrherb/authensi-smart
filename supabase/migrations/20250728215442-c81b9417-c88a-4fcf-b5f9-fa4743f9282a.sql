-- Fix function search path security warning by updating the problematic function
CREATE OR REPLACE FUNCTION public.validate_project_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Ensure required fields have defaults
  NEW.success_criteria := COALESCE(NEW.success_criteria, '[]'::jsonb);
  NEW.pain_points := COALESCE(NEW.pain_points, '[]'::jsonb);
  NEW.integration_requirements := COALESCE(NEW.integration_requirements, '[]'::jsonb);
  NEW.additional_stakeholders := COALESCE(NEW.additional_stakeholders, '[]'::jsonb);
  NEW.bulk_sites_data := COALESCE(NEW.bulk_sites_data, '[]'::jsonb);
  NEW.migration_scope := COALESCE(NEW.migration_scope, '{}'::jsonb);
  NEW.progress_percentage := COALESCE(NEW.progress_percentage, 0);
  
  RETURN NEW;
END;
$function$;