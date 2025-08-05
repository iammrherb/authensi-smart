-- First, let's add more comprehensive vendor models for each vendor
INSERT INTO public.vendor_models (vendor_id, model_name, model_series, description) VALUES

-- Cisco Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9200', '9200 Series', 'Compact fixed-configuration switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9300', '9300 Series', 'Stackable enterprise switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9400', '9400 Series', 'Modular campus access and distribution switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9500', '9500 Series', 'High-performance modular switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Catalyst 9600', '9600 Series', 'High-density modular switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'Nexus 9000', '9000 Series', 'Data center switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Cisco%' LIMIT 1), 'ASR 1000', '1000 Series', 'Aggregation services routers'),

-- Aruba Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6200', '6200 Series', 'Fixed configuration campus switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6300', '6300 Series', 'Stackable campus switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 6400', '6400 Series', 'Modular campus switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 8320', '8320 Series', 'Core and aggregation switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Aruba%' LIMIT 1), 'CX 8360', '8360 Series', 'High-performance campus core switches'),

-- Juniper Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX2300', 'EX2300 Series', 'Compact Ethernet switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX3400', 'EX3400 Series', 'Compact multigigabit switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX4300', 'EX4300 Series', 'High-performance access switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'EX4400', 'EX4400 Series', 'Multigigabit access switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Juniper%' LIMIT 1), 'QFX5100', 'QFX5100 Series', 'Top-of-rack data center switches'),

-- Extreme Networks Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X435', 'X435 Series', 'Stackable Gigabit switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X440', 'X440 Series', 'High-performance stackable switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X465', 'X465 Series', 'Multigigabit stackable switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X590', 'X590 Series', 'High-density core switches'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Extreme%' LIMIT 1), 'X695', 'X695 Series', 'Modular chassis switches'),

-- Fortinet Models (for when they have switches)
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Fortinet%' LIMIT 1), 'FortiSwitch 124F', '124F Series', '24-port Gigabit PoE+ switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Fortinet%' LIMIT 1), 'FortiSwitch 148F', '148F Series', '48-port Gigabit PoE+ switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Fortinet%' LIMIT 1), 'FortiSwitch 448E', '448E Series', '48-port Gigabit PoE+ switch'),

-- Ubiquiti Models
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Ubiquiti%' LIMIT 1), 'UniFi Switch 24', 'UniFi Series', '24-port Gigabit switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Ubiquiti%' LIMIT 1), 'UniFi Switch 48', 'UniFi Series', '48-port Gigabit switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Ubiquiti%' LIMIT 1), 'UniFi Switch Pro 24', 'UniFi Pro Series', '24-port PoE+ switch'),
((SELECT id FROM public.vendor_library WHERE vendor_name LIKE '%Ubiquiti%' LIMIT 1), 'UniFi Switch Pro 48', 'UniFi Pro Series', '48-port PoE+ switch')

ON CONFLICT DO NOTHING;