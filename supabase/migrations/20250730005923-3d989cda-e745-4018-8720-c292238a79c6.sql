-- Add RLS policies for vendor_models
CREATE POLICY "Vendor models are readable by authenticated users" ON public.vendor_models
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage vendor models" ON public.vendor_models
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create vendor models" ON public.vendor_models
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Add RLS policies for configuration_templates
CREATE POLICY "Public config templates are readable by authenticated users" ON public.configuration_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create config templates" ON public.configuration_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own config templates" ON public.configuration_templates
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own config templates" ON public.configuration_templates
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add RLS policies for configuration_files
CREATE POLICY "Users can view their own config files" ON public.configuration_files
  FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can create config files" ON public.configuration_files
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own config files" ON public.configuration_files
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can delete their own config files" ON public.configuration_files
  FOR DELETE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add RLS policies for network_authentication_scenarios
CREATE POLICY "Authentication scenarios are readable by authenticated users" ON public.network_authentication_scenarios
  FOR SELECT USING (true);

CREATE POLICY "Users can create authentication scenarios" ON public.network_authentication_scenarios
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own authentication scenarios" ON public.network_authentication_scenarios
  FOR UPDATE USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role));

-- Storage policies for config files
CREATE POLICY "Users can upload config files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own config files" ON storage.objects
  FOR SELECT USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own config files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own config files" ON storage.objects
  FOR DELETE USING (bucket_id = 'config-templates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_vendor_models_updated_at
  BEFORE UPDATE ON public.vendor_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuration_templates_updated_at
  BEFORE UPDATE ON public.configuration_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuration_files_updated_at
  BEFORE UPDATE ON public.configuration_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_authentication_scenarios_updated_at
  BEFORE UPDATE ON public.network_authentication_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();