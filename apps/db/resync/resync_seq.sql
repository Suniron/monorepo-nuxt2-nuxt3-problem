SELECT pg_catalog.setval('public.asset_id_seq', ((SELECT id from asset order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.cartography_id_seq', ((SELECT id from cartography order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.comment_id_seq', ((SELECT id from comment order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.company_id_seq', ((SELECT id from company order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.compliance_id_seq', ((SELECT id from compliance order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.cpe_asset_id_seq', ((SELECT id from cpe_asset order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.cvss_id_seq', ((SELECT id from cvss order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.cartography_id_seq', ((SELECT id from cartography order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.header_id_seq', ((SELECT id from header order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.phishing_scenario_id_seq', ((SELECT id from phishing_scenario order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.port_id_seq', ((SELECT id from port order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.scan_asset_id_seq', ((SELECT id from scan_asset order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.cartography_id_seq', ((SELECT id from cartography order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.vulnerability_asset_id_seq', ((SELECT id from vulnerability_asset order by id desc limit 1)+1), true);
SELECT pg_catalog.setval('public.vulnerability_id_seq', ((SELECT id from vulnerability order by id desc limit 1)+1), true);

