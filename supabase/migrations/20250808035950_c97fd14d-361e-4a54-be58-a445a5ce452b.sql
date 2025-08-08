-- Expand vendor_library with additional major vendors across categories
-- Network (Switch/Wireless)
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Cisco Meraki', 'network', 'wireless', 'Cloud-managed networking: wireless, switching, security', 'https://meraki.cisco.com', 'supported', '{"notes":"Cloud-managed; API-based integration"}'),
    ('Ruckus', 'network', 'wireless', 'High-performance wireless and switching', 'https://www.commscope.com/ruckus/', 'supported', '{"notes":"DPSK, Cloudpath integrations"}'),
    ('Juniper Mist', 'network', 'wireless', 'AI-driven wireless and wired access', 'https://www.juniper.net/us/en/mist.html', 'supported', '{"notes":"Mist AI; EX switches & APs"}'),
    ('Arista', 'network', 'switch', 'Cloud networking; EOS-based switches', 'https://www.arista.com', 'supported', '{"notes":"Campus & DC switching"}'),
    ('Dell Networking', 'network', 'switch', 'Enterprise switching with OS10', 'https://www.dell.com', 'supported', '{"notes":"OS10/OS9 support"}')
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- Security (Firewall)
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('SonicWall', 'security', 'firewall', 'Network security and SD-WAN', 'https://www.sonicwall.com', 'supported', '{"notes":"RADIUS/TACACS supported"}'),
    ('WatchGuard', 'security', 'firewall', 'Unified threat management and firewalls', 'https://www.watchguard.com', 'supported', '{"notes":"RADIUS, MFA"}'),
    ('Juniper', 'security', 'firewall', 'SRX next-gen firewalls', 'https://www.juniper.net', 'supported', '{"notes":"SRX Series"}')
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name AND vl.vendor_type = v.vendor_type
);

-- Identity/SSO Providers
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('OneLogin', 'identity', 'idp', 'Identity and access management', 'https://www.onelogin.com', 'supported', '{"notes":"SAML/OIDC"}'),
    ('Duo Security', 'identity', 'mfa', 'MFA and Zero Trust security', 'https://duo.com', 'supported', '{"notes":"MFA, SSO integrations"}')
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- EDR/XDR Vendors
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Trend Micro', 'security', 'edr', 'Endpoint security and XDR', 'https://www.trendmicro.com', 'supported', '{"notes":"Vision One"}'),
    ('Bitdefender', 'security', 'edr', 'Endpoint security and EDR', 'https://www.bitdefender.com', 'supported', '{"notes":"GravityZone"}')
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- MDM/UEM Vendors
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Cisco Meraki Systems Manager', 'device', 'mdm', 'Cloud MDM/UEM platform', 'https://meraki.cisco.com/products/systems-manager/', 'supported', '{"notes":"Apple/Android/Windows"}')
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- Seed representative models with firmware for new vendors
INSERT INTO public.vendor_models (vendor_id, model_name, model_series, firmware_versions, supported_features, documentation_links)
SELECT * FROM (
  VALUES
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Cisco Meraki'), 'MR46', 'MR Series', '["29.7","30.6","31.1"]', '["802.1X","WPA3","Cloud RADIUS"]', '["https://documentation.meraki.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Cisco Meraki'), 'MS250-48', 'MS Series', '["14.33","15.18"]', '["802.1X","MAB","RADIUS CoA"]', '["https://documentation.meraki.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Ruckus'), 'R650', 'R-Series', '["6.1","6.2"]', '["DPSK","WPA3","802.1X"]', '["https://support.ruckuswireless.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Juniper'), 'SRX300', 'SRX', '["21.4R3","22.2R1"]', '["RADIUS","TACACS+","802.1X"]', '["https://www.juniper.net"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='SonicWall'), 'TZ470', 'TZ', '["7.0.1","7.1.1"]', '["RADIUS","SSO","VPN"]', '["https://www.sonicwall.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='WatchGuard'), 'Firebox M290', 'Firebox', '["12.8","12.9"]', '["RADIUS","MFA","VPN"]', '["https://www.watchguard.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Arista'), '7300X', 'EOS', '["4.29.5","4.30.1"]', '["802.1X","RADIUS","TACACS+"]', '["https://www.arista.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Dell Networking'), 'S5248F-ON', 'S-Series', '["10.5.3","10.6.1"]', '["802.1X","MAB","RADIUS CoA"]', '["https://www.dell.com"]'),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Juniper Mist'), 'AP43', 'Mist AP', '["0.13","0.14"]', '["WPA3","802.1X","AI-ops"]', '["https://www.juniper.net"]')
) AS v(vendor_id, model_name, model_series, firmware_versions, supported_features, documentation_links)
WHERE v.vendor_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM public.vendor_models m 
  WHERE m.vendor_id = v.vendor_id AND m.model_name = v.model_name
);
