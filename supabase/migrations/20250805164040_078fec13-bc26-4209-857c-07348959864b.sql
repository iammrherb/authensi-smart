-- Add more vendor models without description column
INSERT INTO public.vendor_models (vendor_id, model_name, model_series) VALUES

-- Cisco Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9200', '9200 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9300', '9300 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9400', '9400 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9500', '9500 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9600', '9600 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Nexus 9000', '9000 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'ASR 1000', '1000 Series'),

-- Aruba Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6200', '6200 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6300', '6300 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6400', '6400 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 8320', '8320 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 8360', '8360 Series'),

-- Juniper Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX2300', 'EX2300 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX3400', 'EX3400 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX4300', 'EX4300 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX4400', 'EX4400 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'QFX5100', 'QFX5100 Series'),

-- Extreme Networks Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X435', 'X435 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X440', 'X440 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X465', 'X465 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X590', 'X590 Series'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X695', 'X695 Series')

ON CONFLICT DO NOTHING;