-- Add foreign key constraint between configuration_templates and vendor_library
ALTER TABLE configuration_templates 
ADD CONSTRAINT fk_configuration_templates_vendor 
FOREIGN KEY (vendor_id) REFERENCES vendor_library(id);