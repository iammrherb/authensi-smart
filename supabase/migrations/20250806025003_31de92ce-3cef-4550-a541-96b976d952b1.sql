-- Remove specific problematic users and clean up all their data
-- User IDs to remove: 2d7e65f7-698a-4e59-ae15-a415ad3c9dd8 and 08c1181f-bccd-4cef-ba70-2541b6c55024

-- Remove from user_activity_log
DELETE FROM public.user_activity_log 
WHERE user_id IN ('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8', '08c1181f-bccd-4cef-ba70-2541b6c55024');

-- Remove from user_roles
DELETE FROM public.user_roles 
WHERE user_id IN ('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8', '08c1181f-bccd-4cef-ba70-2541b6c55024');

-- Remove from user_sessions if exists
DELETE FROM public.user_sessions 
WHERE user_id IN ('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8', '08c1181f-bccd-4cef-ba70-2541b6c55024');

-- Remove from security_audit_log if exists
DELETE FROM public.security_audit_log 
WHERE user_id IN ('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8', '08c1181f-bccd-4cef-ba70-2541b6c55024');

-- Finally remove from profiles
DELETE FROM public.profiles 
WHERE id IN ('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8', '08c1181f-bccd-4cef-ba70-2541b6c55024');