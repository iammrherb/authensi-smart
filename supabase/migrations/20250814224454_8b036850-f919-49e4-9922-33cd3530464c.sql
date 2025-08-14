-- Enable realtime for all main tables
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.sites REPLICA IDENTITY FULL;
ALTER TABLE public.scoping_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.workflow_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.tracking_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.poc_activities REPLICA IDENTITY FULL;
ALTER TABLE public.implementation_checklists REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scoping_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poc_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.implementation_checklists;