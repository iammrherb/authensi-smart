-- Add customer_organization column to projects table
ALTER TABLE public.projects 
ADD COLUMN customer_organization TEXT;