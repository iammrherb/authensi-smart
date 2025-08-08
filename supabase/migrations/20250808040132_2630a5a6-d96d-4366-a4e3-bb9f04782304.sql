-- Expand vendor_library with additional major vendors across categories (fixed JSONB casts)
-- Network (Switch/Wireless)
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Cisco Meraki', 'network', 'wireless', 'Cloud-managed networking: wireless, switching, security', 'https://meraki.cisco.com', 'supported', '{"notes":"Cloud-managed; API-based integration"}'::jsonb),
    ('Ruckus', 'network', 'wireless', 'High-performance wireless and switching', 'https://www.commscope.com/ruckus/', 'supported', '{"notes":"DPSK, Cloudpath integrations"}'::jsonb),
    ('Juniper Mist', 'network', 'wireless', 'AI-driven wireless and wired access', 'https://www.juniper.net/us/en/mist.html', 'supported', '{"notes":"Mist AI; EX switches & APs"}'::jsonb),
    ('Arista', 'network', 'switch', 'Cloud networking; EOS-based switches', 'https://www.arista.com', 'supported', '{"notes":"Campus & DC switching"}'::jsonb),
    ('Dell Networking', 'network', 'switch', 'Enterprise switching with OS10', 'https://www.dell.com', 'supported', '{"notes":"OS10/OS9 support"}'::jsonb)
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- Security (Firewall)
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('SonicWall', 'security', 'firewall', 'Network security and SD-WAN', 'https://www.sonicwall.com', 'supported', '{"notes":"RADIUS/TACACS supported"}'::jsonb),
    ('WatchGuard', 'security', 'firewall', 'Unified threat management and firewalls', 'https://www.watchguard.com', 'supported', '{"notes":"RADIUS, MFA"}'::jsonb),
    ('Juniper', 'security', 'firewall', 'SRX next-gen firewalls', 'https://www.juniper.net', 'supported', '{"notes":"SRX Series"}'::jsonb)
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name AND vl.vendor_type = v.vendor_type
);

-- Identity/SSO Providers
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('OneLogin', 'identity', 'idp', 'Identity and access management', 'https://www.onelogin.com', 'supported', '{"notes":"SAML/OIDC"}'::jsonb),
    ('Duo Security', 'identity', 'mfa', 'MFA and Zero Trust security', 'https://duo.com', 'supported', '{"notes":"MFA, SSO integrations"}'::jsonb)
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- EDR/XDR Vendors
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Trend Micro', 'security', 'edr', 'Endpoint security and XDR', 'https://www.trendmicro.com', 'supported', '{"notes":"Vision One"}'::jsonb),
    ('Bitdefender', 'security', 'edr', 'Endpoint security and EDR', 'https://www.bitdefender.com', 'supported', '{"notes":"GravityZone"}'::jsonb)
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- MDM/UEM Vendors
INSERT INTO public.vendor_library (vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
SELECT * FROM (
  VALUES
    ('Cisco Meraki Systems Manager', 'device', 'mdm', 'Cloud MDM/UEM platform', 'https://meraki.cisco.com/products/systems-manager/', 'supported', '{"notes":"Apple/Android/Windows"}'::jsonb)
) AS v(vendor_name, category, vendor_type, description, website_url, portnox_integration_level, portnox_documentation)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendor_library vl WHERE vl.vendor_name = v.vendor_name
);

-- Seed representative models with firmware for new vendors
INSERT INTO public.vendor_models (vendor_id, model_name, model_series, firmware_versions, supported_features, documentation_links)
SELECT * FROM (
  VALUES
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Cisco Meraki'), 'MR46', 'MR Series', '["29.7","30.6","31.1"]'::jsonb, '["802.1X","WPA3","Cloud RADIUS"]'::jsonb, '["https://documentation.meraki.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Cisco Meraki'), 'MS250-48', 'MS Series', '["14.33","15.18"]'::jsonb, '["802.1X","MAB","RADIUS CoA"]'::jsonb, '["https://documentation.meraki.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Ruckus'), 'R650', 'R-Series', '["6.1","6.2"]'::jsonb, '["DPSK","WPA3","802.1X"]'::jsonb, '["https://support.ruckuswireless.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Juniper'), 'SRX300', 'SRX', '["21.4R3","22.2R1"]'::jsonb, '["RADIUS","TACACS+","802.1X"]'::jsonb, '["https://www.juniper.net"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='SonicWall'), 'TZ470', 'TZ', '["7.0.1","7.1.1"]'::jsonb, '["RADIUS","SSO","VPN"]'::jsonb, '["https://www.sonicwall.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='WatchGuard'), 'Firebox M290', 'Firebox', '["12.8","12.9"]'::jsonb, '["RADIUS","MFA","VPN"]'::jsonb, '["https://www.watchguard.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Arista'), '7300X', 'EOS', '["4.29.5","4.30.1"]'::jsonb, '["802.1X","RADIUS","TACACS+"]'::jsonb, '["https://www.arista.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Dell Networking'), 'S5248F-ON', 'S-Series', '["10.5.3","10.6.1"]'::jsonb, '["802.1X","MAB","RADIUS CoA"]'::jsonb, '["https://www.dell.com"]'::jsonb),
    ((SELECT id FROM public.vendor_library WHERE vendor_name='Juniper Mist'), 'AP43', 'Mist AP', '["0.13","0.14"]'::jsonb, '["WPA3","802.1X","AI-ops"]'::jsonb, '["https://www.juniper.net"]'::jsonb)
) AS v(vendor_id, model_name, model_series, firmware_versions, supported_features, documentation_links)
WHERE v.vendor_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM public.vendor_models m 
  WHERE m.vendor_id = v.vendor_id AND m.model_name = v.model_name
);
