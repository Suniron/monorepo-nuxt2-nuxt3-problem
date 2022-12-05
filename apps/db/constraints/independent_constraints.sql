-- This file include only independent constraints
-- Independent constraints include PRIMARY KEYs and UNIQUE constraints

--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: asset asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_id_key UNIQUE (id, type);

--
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (id);

--
-- Name: asset asset_name_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_name_type_key UNIQUE (name, type, company_id);

--
-- Name: score_asset score_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset
    ADD CONSTRAINT score_asset_pkey PRIMARY KEY (id);

--
-- Name: score_asset score_asset_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset
    ADD CONSTRAINT score_asset_type_key UNIQUE (fk_asset_id, type);

--
-- Name: score_asset_history score_asset_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset_history
    ADD CONSTRAINT score_asset_history_pkey PRIMARY KEY (id);

--
-- Name: score_asset_history score_asset_history_type_log_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset_history
    ADD CONSTRAINT score_asset_history_type_log_date_key UNIQUE (fk_asset_id, type, log_date);

--
-- Name: company company_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_id_key UNIQUE (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: cpe_asset cpe_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_id_key UNIQUE (id);


--
-- Name: cpe_asset cpe_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_pkey PRIMARY KEY (id);

--
-- Name: credinfo credinfo_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_id_key UNIQUE (id);


--
-- Name: credinfo credinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_pkey PRIMARY KEY (id);


--
-- Name: cvss cvss_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvss
    ADD CONSTRAINT cvss_id_key UNIQUE (id);


--
-- Name: cvss cvss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvss
    ADD CONSTRAINT cvss_pkey PRIMARY KEY (id);


--
-- Name: group group_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_id_key UNIQUE (id);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id);


--
-- Name: group name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT name_unique UNIQUE (name);


--
-- Name: info info_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_id_key UNIQUE (id);


--
-- Name: info info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (id);

--
-- Name: latest_scan_summary latest_scan_summary_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.latest_scan_summary
    ADD CONSTRAINT latest_scan_summary_id_key UNIQUE (asset_id);

--
-- Name: latest_scan_summary latest_scan_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.latest_scan_summary
    ADD CONSTRAINT latest_scan_summary_pkey PRIMARY KEY (asset_id);


--
-- Name: mitre mitre_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_id_key UNIQUE (id);


--
-- Name: mitre mitre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_pkey PRIMARY KEY (id);


--
-- Name: phishing_scenario phishing_scenario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phishing_scenario
    ADD CONSTRAINT phishing_scenario_id_key UNIQUE (id);


--
-- Name: phishing_scenario phishing_scenario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phishing_scenario
    ADD CONSTRAINT phishing_scenario_pkey PRIMARY KEY (id);


--
-- Name: port port_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_id_key UNIQUE (id);


--
-- Name: port port_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_pkey PRIMARY KEY (id);


--
-- Name: reference reference_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_id_key UNIQUE (id);


--
-- Name: reference reference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_pkey PRIMARY KEY (id);

--
-- Name: remediation_project remediation_project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project
    ADD CONSTRAINT remediation_project_pkey PRIMARY KEY (id);

--
-- Name: remediation_project_assignee remediation_project_assignee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_assignee
    ADD CONSTRAINT remediation_project_assignee_pkey PRIMARY KEY (id);


--
-- Name: remediation_project_assignee fk_project_id_fk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_assignee
    ADD CONSTRAINT fk_project_id_fk_user_id_key UNIQUE (fk_project_id, fk_user_id);

--
-- Name: project_status project_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_status
    ADD CONSTRAINT project_status_pkey PRIMARY KEY (id);

--
-- Name: project_priority project_priority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_priority
    ADD CONSTRAINT project_priority_pkey PRIMARY KEY (id);

--
-- Name: project_status_workflow project_status_workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_status_workflow
    ADD CONSTRAINT project_status_workflow_pkey PRIMARY KEY (id);

--
-- Name: project_status_workflow fk_from_status_id_fk_to_status_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_status_workflow
    ADD CONSTRAINT fk_from_status_id_fk_to_status_id_key UNIQUE (fk_from_status_id, fk_to_status_id);

--
-- Name: remediation_project_status_history remediation_project_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_status_history
    ADD CONSTRAINT remediation_project_status_history_pkey PRIMARY KEY (id);

--
-- Name: remediation_project_scope remediation_project_scope_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_scope
    ADD CONSTRAINT remediation_project_scope_pkey PRIMARY KEY (id);

--
-- Name: remediation_project_scope fk_project_id_fk_vulnerability_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_scope
    ADD CONSTRAINT fk_project_id_fk_vulnerability_asset_id_key UNIQUE (fk_project_id, fk_vulnerability_asset_id);

--
-- Name: remediation_project_scope remediation_project_scope; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.remediation_project_scope ADD CONSTRAINT remediation_project_scope_check CHECK (
    fk_vulnerability_asset_id IS NOT NULL 
    OR deleted_asset_name IS NOT NULL
);

--
-- Name: comment_remediation_project comment_remediation_project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_remediation_project
    ADD CONSTRAINT comment_remediation_project_pkey PRIMARY KEY (id);

--
-- Name: comment_remediation_project fk_remediation_project_status_history_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_remediation_project
    ADD CONSTRAINT fk_remediation_project_status_history_id_key UNIQUE (fk_remediation_project_status_history_id);

--
-- Name: result result_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_id_key UNIQUE (id);


--
-- Name: result result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_pkey PRIMARY KEY (id);


--
-- Name: scan scan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_id_key UNIQUE (id);


--
-- Name: scan_asset scan_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_id_key UNIQUE (id);


--
-- Name: scan_asset scan_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_pkey PRIMARY KEY (id);


--
-- Name: scan scan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_pkey PRIMARY KEY (id);


--
-- Name: tag tag_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_id_key UNIQUE (id);


--
-- Name: tag tag_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_name_un UNIQUE ("name",company_id);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);

--
-- Name: tag_asset tag_asset_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_asset
    ADD CONSTRAINT tag_asset_pkey PRIMARY KEY (asset_id, tag_id);


--
-- Name: user user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_key UNIQUE (id);

--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: group_asset group_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_asset
    ADD CONSTRAINT group_asset_pkey PRIMARY KEY (asset_id, group_id);

--
-- Name: user_session user_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_pkey PRIMARY KEY (id);

--
-- Name: user_session user_id_token_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_id_token_type_key UNIQUE (user_id, token, type);


--
-- Name: vulnerability vulnerability_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability
    ADD CONSTRAINT vulnerability_id_key UNIQUE (id);


--
-- Name: vulnerability_asset vulnerability_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_id_key UNIQUE (id);


--
-- Name: vulnerability_ip vulnerability_ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_pkey PRIMARY KEY (id);


--
-- Name: vulnerability vulnerability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability
    ADD CONSTRAINT vulnerability_pkey PRIMARY KEY (id);



--
-- Name: uri uri_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uri
    ADD CONSTRAINT uri_id_pkey UNIQUE (id);



--
-- Name: uri uri_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uri
    ADD CONSTRAINT uri_pkey PRIMARY KEY (id);


--
-- Name: request request_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_id_pkey UNIQUE (id);


--
-- Name: request request_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id);


--
-- Name: response response_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.response
    ADD CONSTRAINT response_id_pkey UNIQUE (id);



--
-- Name: response response_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.response
    ADD CONSTRAINT response_pkey PRIMARY KEY (id);


--
-- Name: header header_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_id_pkey UNIQUE (id);


--
-- Name: header header_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_pkey PRIMARY KEY (id);


--
-- Name: cipher_suite cipher_suite_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cipher_suite
    ADD CONSTRAINT cipher_suite_id_pkey UNIQUE (id);



--
-- Name: cipher_suite cipher_suite_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cipher_suite
    ADD CONSTRAINT cipher_suite_pkey PRIMARY KEY (id);



--
-- Name: comment comment_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_id_pkey UNIQUE (id);



--
-- Name: comment comment_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);

--
-- Name: status_update status_update_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update
    ADD CONSTRAINT status_update_id_pkey UNIQUE (id);


--
-- Name: status_update status_update_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update
    ADD CONSTRAINT status_update_pkey PRIMARY KEY (id);

--
-- Name: asset_network asset_network_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network
    ADD CONSTRAINT asset_network_id_pkey UNIQUE (id, type);


--
-- Name: asset_network asset_network_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network
    ADD CONSTRAINT asset_network_pkey PRIMARY KEY (id);


--
-- Name: asset_server asset_server_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_server
    ADD CONSTRAINT asset_server_id_pkey UNIQUE (id, type);


--
-- Name: asset_server asset_server_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_server
    ADD CONSTRAINT asset_server_pkey PRIMARY KEY (id);


--
-- Name: asset_compliance asset_compliance_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_compliance
    ADD CONSTRAINT asset_compliance_id_pkey UNIQUE (id, type);


--
-- Name: asset_compliance asset_compliance_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_compliance
    ADD CONSTRAINT asset_compliance_pkey PRIMARY KEY (id);

--
-- Name: asset_web asset_web_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_web
    ADD CONSTRAINT asset_web_id_pkey UNIQUE (id, type);


--
-- Name: asset_web asset_web_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_web
    ADD CONSTRAINT asset_web_pkey PRIMARY KEY (id);


--
-- Name: asset_user asset_user_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_user
    ADD CONSTRAINT asset_user_id_pkey UNIQUE (id, type);


--
-- Name: asset_user asset_user_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_user
    ADD CONSTRAINT asset_user_pkey PRIMARY KEY (id);
--
-- Name: asset_mission asset_mission_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_mission
    ADD CONSTRAINT asset_mission_pkey PRIMARY KEY (id);

--
-- Name: asset_web asset_web_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_building
    ADD CONSTRAINT asset_building_id_pkey UNIQUE (id, type);


--
-- Name: asset_web asset_web_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_building
    ADD CONSTRAINT asset_building_pkey PRIMARY KEY (id);


--
-- Name: asset_policy asset_policy_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_document
    ADD CONSTRAINT asset_document_id_pkey UNIQUE (id, type);


--
-- Name: asset_document asset_document_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_document
    ADD CONSTRAINT asset_document_pkey PRIMARY KEY (id);


--
-- Name: cpe cpe_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe
    ADD CONSTRAINT cpe_id_pkey UNIQUE (id);


--
-- Name: cpe cpe_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe
    ADD CONSTRAINT cpe_pkey PRIMARY KEY (id);



--
-- Name: relation relation_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_id_pkey UNIQUE (id);


--
-- Name: relation relation_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_pkey PRIMARY KEY (id);


--
-- Name: ip ip_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_id_pkey UNIQUE (id);


--
-- Name: ip ip_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_pkey PRIMARY KEY (id);


--
-- Name: revision revision_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revision
    ADD CONSTRAINT revision_id_pkey UNIQUE (id);


--
-- Name: revision revision_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revision
    ADD CONSTRAINT revision_pkey PRIMARY KEY (id);


--
-- Name: store store_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_id_pkey UNIQUE (id);


--
-- Name: store store_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: probe probe_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe
    ADD CONSTRAINT probe_id_pkey UNIQUE (id);


--
-- Name: probe probe_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe
    ADD CONSTRAINT probe_pkey PRIMARY KEY (id);


--
-- Name: compliance compliance_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance
    ADD CONSTRAINT compliance_id_pkey UNIQUE (id);


--
-- Name: probe compliance_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance
    ADD CONSTRAINT compliance_pkey PRIMARY KEY (id);


--
-- Name: cartography cartography_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography
    ADD CONSTRAINT cartography_id_pkey UNIQUE (id);


--
-- Name: cartography cartography_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography
    ADD CONSTRAINT cartography_pkey PRIMARY KEY (id);


--
-- Name: cartography_element cartography_element_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography_element
    ADD CONSTRAINT cartography_element_id_pkey UNIQUE (id);


--
-- Name: cartography cartography_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography_element
    ADD CONSTRAINT cartography_element_pkey PRIMARY KEY (id);


--
-- Name: comment_watch comment_watch_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_watch
    ADD CONSTRAINT comment_watch_id_pkey UNIQUE (id);



--
-- Name: comment_watch comment_watch_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_watch
    ADD CONSTRAINT comment_watch_pkey PRIMARY KEY (id);


--
-- Name: dashboard_item dashboard_item_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_item
    ADD CONSTRAINT dashboard_item_id_pkey UNIQUE (id);



--
-- Name: dashboard_item dashboard_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_item
    ADD CONSTRAINT dashboard_item_pkey PRIMARY KEY (id);


--
-- Name: dashboard_user dashboard_user_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_user
    ADD CONSTRAINT dashboard_user_id_pkey UNIQUE (dashboard_item_id, user_id);



--
-- Name: dashboard_user dashboard_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_user
    ADD CONSTRAINT dashboard_user_pkey PRIMARY KEY (dashboard_item_id, user_id);


--
-- Name: setting setting_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_id_pkey UNIQUE (id);



--
-- Name: setting setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (id);



--
-- Name: setting relation_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_uniq UNIQUE ("type",from_asset_id,to_asset_id);

ALTER TABLE ONLY public.scan_label
    ADD CONSTRAINT scan_label_pk PRIMARY KEY ("type")