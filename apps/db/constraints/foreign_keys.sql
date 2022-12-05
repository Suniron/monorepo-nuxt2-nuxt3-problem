--
-- Name: asset asset_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_owner_fkey FOREIGN KEY (owner) REFERENCES public.user(id) ON DELETE CASCADE;



--
-- Name: asset asset_maintainer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_maintainer_fkey FOREIGN KEY (maintainer) REFERENCES public.user(id) ON DELETE CASCADE;


--
-- Name: asset asset_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;

--
-- Name: score_asset score_asset_fk_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset
    ADD CONSTRAINT score_asset_fk_asset_id_fkey FOREIGN KEY (fk_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;

--
-- Name: score_asset_history score_asset_history_fk_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_asset_history
    ADD CONSTRAINT score_asset_history_fk_asset_id_fkey FOREIGN KEY (fk_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;

--
-- Name: asset remediation_project_fk_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project
    ADD CONSTRAINT remediation_project_fk_company_id_fkey FOREIGN KEY (fk_company_id) REFERENCES public.company(id);

--
-- Name: asset remediation_project_fk_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project
    ADD CONSTRAINT remediation_project_fk_owner_fkey FOREIGN KEY (fk_owner) REFERENCES public.user(id);

--
-- Name: asset remediation_project_fk_priority_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project
    ADD CONSTRAINT remediation_project_fk_priority_id_fkey FOREIGN KEY (fk_priority_id) REFERENCES public.project_priority(id);

--
-- Name: asset remediation_project_assignee_fk_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_assignee
    ADD CONSTRAINT remediation_project_assignee_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;

--
-- Name: asset remediation_project_assignee_fk_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_assignee
    ADD CONSTRAINT remediation_project_assignee_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE CASCADE;

--
-- Name: asset project_status_workflow_fk_from_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_status_workflow
    ADD CONSTRAINT project_status_workflow_fk_from_status_id_fkey FOREIGN KEY (fk_from_status_id) REFERENCES public.project_status(id);

--
-- Name: asset project_status_workflow_fk_to_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_status_workflow
    ADD CONSTRAINT project_status_workflow_fk_to_status_id_fkey FOREIGN KEY (fk_to_status_id) REFERENCES public.project_status(id);

--
-- Name: asset remediation_project_status_history_fk_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_status_history
    ADD CONSTRAINT remediation_project_status_history_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;

--
-- Name: asset remediation_project_status_history_fk_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_status_history
    ADD CONSTRAINT remediation_project_status_history_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE SET NULL;

--
-- Name: asset remediation_project_status_history_fk_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_status_history
    ADD CONSTRAINT remediation_project_status_history_fk_status_id_fkey FOREIGN KEY (fk_status_id) REFERENCES public.project_status(id);

--
-- Name: asset remediation_project_scope_fk_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_scope
    ADD CONSTRAINT remediation_project_scope_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;

--
-- Name: asset remediation_project_scope_fk_vulnerability_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_project_scope
    ADD CONSTRAINT remediation_project_scope_fk_vulnerability_asset_id_fkey FOREIGN KEY (fk_vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE SET NULL;

--
-- Name: asset comment_remediation_project_fk_remediation_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_remediation_project
    ADD CONSTRAINT comment_remediation_project_fk_remediation_project_id_fkey FOREIGN KEY (fk_remediation_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;

--
-- Name: asset comment_remediation_project_fk_remediation_project_status_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_remediation_project
    ADD CONSTRAINT comment_remediation_project_fk_remediation_project_status_history_id_fkey FOREIGN KEY (fk_remediation_project_status_history_id) REFERENCES public.remediation_project_status_history(id);

--
-- Name: asset comment_remediation_project_fk_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_remediation_project
    ADD CONSTRAINT comment_remediation_project_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE SET NULL;


--
-- Name: uri uri_asset_web_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uri
    ADD CONSTRAINT uri_asset_web_id_fkey FOREIGN KEY (asset_web_id) REFERENCES public.asset_web(id) ON DELETE CASCADE;


--
-- Name: request request_uri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_uri_id_fkey FOREIGN KEY (uri_id) REFERENCES public.uri(id) ON DELETE CASCADE;


--
-- Name: response response_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.response
    ADD CONSTRAINT response_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.request(id) ON DELETE CASCADE;


--
-- Name: header header_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.request(id) ON DELETE CASCADE;


--
-- Name: header header_response_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_response_id_fkey FOREIGN KEY (response_id) REFERENCES public.response(id) ON DELETE CASCADE;

--
-- Name: cpe_asset cpe_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;


--
-- Name: cpe_asset cpe_asset_cpe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_cpe_id_fkey FOREIGN KEY (cpe_id) REFERENCES public.cpe(id) ON DELETE CASCADE;

--
-- Name: credinfo credinfo_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;


--
-- Name: group group_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_company_id_fkey FOREIGN KEY (company_id) REFERENCES public."company"(id) ON DELETE CASCADE;


--
-- Name: info info_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;


--
-- Name: latest_scan_summary latest_scan_summary_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.latest_scan_summary
    ADD CONSTRAINT latest_scan_summary_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;

--
-- Name: latest_scan_summary latest_scan_summary_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.latest_scan_summary
    ADD CONSTRAINT latest_scan_summary_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id) ON DELETE CASCADE;


--
-- Name: mitre mitre_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id) ON DELETE CASCADE;


--
-- Name: port port_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id) ON DELETE CASCADE;


--
-- Name: reference reference_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id) ON DELETE CASCADE;


--
-- Name: result result_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id) ON DELETE CASCADE;


--
-- Name: scan scan_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: scan scan_probe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_probe_id_fkey FOREIGN KEY (probe_id) REFERENCES public.probe(id) ON DELETE CASCADE;

--
-- Name: scan_asset scan_asset_cpe_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_cpe_asset_id_fkey FOREIGN KEY (cpe_asset_id) REFERENCES public.cpe_asset(id) ON DELETE CASCADE;


--
-- Name: scan_asset scan_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;


--
-- Name: scan_asset scan_asset_port_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_port_id_fkey FOREIGN KEY (port_id) REFERENCES public.port(id) ON DELETE CASCADE;


--
-- Name: scan_asset scan_asset_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id) ON DELETE CASCADE;


--
-- Name: scan_asset scan_asset_vulnerability_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_vulnerability_asset_id_fkey FOREIGN KEY (vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE CASCADE;

--
-- Name: scan_asset scan_asset_cipher_suite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_asset
    ADD CONSTRAINT scan_asset_cipher_suite_id_fkey FOREIGN KEY (cipher_suite_id) REFERENCES public.cipher_suite(id) ON DELETE CASCADE;

--
-- Name: tag tag_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;

--
-- Name: user user_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;

--
-- Name: user_group user_group_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: group_asset group_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_asset
    ADD CONSTRAINT group_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;
--
-- Name: user_session user_session_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_group user_group_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."group"(id) ON DELETE CASCADE;


--
-- Name: group_asset group_asset_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_asset
    ADD CONSTRAINT group_asset_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."group"(id) ON DELETE CASCADE;


--
-- Name: vulnerability_asset vulnerability_asset_cvss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_cvss_id_fkey FOREIGN KEY (cvss_id) REFERENCES public.cvss(id) ON DELETE CASCADE;



--
-- Name: vulnerability_asset vulnerability_asset_cpe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_cpe_id_fkey FOREIGN KEY (cpe_id) REFERENCES public.cpe(id) ON DELETE CASCADE;



--
-- Name: vulnerability_asset vulnerability_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;



--
-- Name: vulnerability_asset vulnerability_asset_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id) ON DELETE CASCADE;



--
-- Name: vulnerability_asset vulnerability_asset_port_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_port_id_fkey FOREIGN KEY (port_id) REFERENCES public.port(id) ON DELETE CASCADE;

--
-- Name: vulnerability_asset vulnerability_asset_uri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_uri_id_fkey FOREIGN KEY (uri_id) REFERENCES public.uri(id) ON DELETE CASCADE;

--
-- Name: vulnerability_asset vulnerability_asset_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_asset
    ADD CONSTRAINT vulnerability_asset_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id) ON DELETE CASCADE;


--
-- Name: cipher_suite cipher_suite_port_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cipher_suite
    ADD CONSTRAINT cipher_suite_port_id_fkey FOREIGN KEY (port_id) REFERENCES public.port(id) ON DELETE CASCADE;


--
-- Name: comment comment_vulnerability_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_vulnerability_asset_id_fkey FOREIGN KEY (vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE CASCADE;


--
-- Name: comment comment_revision_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_revision_id_fkey FOREIGN KEY (revision_id) REFERENCES public.revision(id) ON DELETE CASCADE;


--
-- Name: comment comment_reply_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_reply_comment_id_fkey FOREIGN KEY (reply_comment_id) REFERENCES public.comment(id) ON DELETE CASCADE;



--
-- Name: comment comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE;


--
-- Name: status_update status_update_vulnerability_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update
    ADD CONSTRAINT status_update_vulnerability_asset_id_fkey FOREIGN KEY (vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE CASCADE;


--
-- Name: asset_mission asset_mission_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_mission
  ADD CONSTRAINT asset_mission_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;


--
-- Name: asset_network asset_network_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network
    ADD CONSTRAINT asset_network_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;


--
-- Name: asset_web asset_web_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_web
    ADD CONSTRAINT asset_web_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;


--
-- Name: asset_server asset_server_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_server
    ADD CONSTRAINT asset_server_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;

--
-- Name: asset_building asset_building_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_building
    ADD CONSTRAINT asset_building_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;

--
-- Name: asset_document asset_document_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_document
    ADD CONSTRAINT asset_document_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;

--
-- Name: asset_user asset_user_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_user
    ADD CONSTRAINT asset_user_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;


--
-- Name: asset_compliance asset_compliance_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_compliance
    ADD CONSTRAINT asset_compliance_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;

--
-- Name: asset_compliance asset_compliance_compliance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_compliance
    ADD CONSTRAINT asset_compliance_compliance_id_fkey FOREIGN KEY (compliance_id) REFERENCES public.compliance(id) ON DELETE CASCADE;

--
-- Name: ip ip_asset_server_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_asset_server_id_fkey FOREIGN KEY (asset_server_id) REFERENCES public.asset_server(id) ON DELETE CASCADE;


--
-- Name: tag_asset tag_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_asset
    ADD CONSTRAINT tag_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;


--
-- Name: tag_asset tag_asset_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_asset
    ADD CONSTRAINT tag_asset_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON DELETE CASCADE;



--
-- Name: revision revision_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revision
    ADD CONSTRAINT revision_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON DELETE CASCADE;


--
-- Name: revision revision_asset_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revision
    ADD CONSTRAINT revision_asset_document_id_fkey FOREIGN KEY (asset_document_id) REFERENCES public.asset_document(id) ON DELETE CASCADE;

--
-- Name: scan probe_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe
    ADD CONSTRAINT probe_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: scan probe_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe
    ADD CONSTRAINT probe_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON DELETE CASCADE;


--
-- Name: cartography cartography_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography
    ADD CONSTRAINT cartography_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: cartography_element cartography_element_cartography_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography_element
    ADD CONSTRAINT cartography_element_cartography_id_fkey FOREIGN KEY (cartography_id) REFERENCES public.cartography(id) ON DELETE CASCADE;


--
-- Name: cartography_element cartography_element_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography_element
    ADD CONSTRAINT cartography_element_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;


--
-- Name: cartography_element cartography_element_relation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartography_element
    ADD CONSTRAINT cartography_element_relation_id_fkey FOREIGN KEY (relation_id) REFERENCES public.relation(id) ON DELETE CASCADE;


--
-- Name: comment_watch comment_watch_vulnerability_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_watch
    ADD CONSTRAINT comment_watch_vulnerability_asset_id_fkey FOREIGN KEY (vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE CASCADE;


--
-- Name: comment_watch comment_watch_revision_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_watch
    ADD CONSTRAINT comment_watch_revision_id_fkey FOREIGN KEY (revision_id) REFERENCES public.revision(id) ON DELETE CASCADE;


--
-- Name: comment_watch comment_watch_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_watch
    ADD CONSTRAINT comment_watch_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE;


--
-- Name: dashboard_user dashboard_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_user
    ADD CONSTRAINT dashboard_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE;



--
-- Name: dashboard_user dashboard_user_dashboard_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_user
    ADD CONSTRAINT dashboard_user_dashboard_item_id_fkey FOREIGN KEY (dashboard_item_id) REFERENCES public.dashboard_item(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.business_mission_unit_has_feared_event
  ADD CONSTRAINT fkey_severity FOREIGN KEY (severity_id) REFERENCES public.severity(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.business_mission_unit_has_feared_event
  ADD CONSTRAINT business_mission_unit_id  FOREIGN KEY (feared_event_id) REFERENCES public.feared_event(id) ON DELETE CASCADE;


ALTER TABLE ONLY public.business_mission_unit_has_feared_event
  ADD CONSTRAINT fkey_business_mission_unit_id FOREIGN KEY (business_mission_unit_id) REFERENCES public.relation(id) ON DELETE CASCADE;


ALTER TABLE ONLY public.business_mission_unit_feared_event_has_business_impact
  ADD CONSTRAINT fkey_business_mission_unit_has_feared_event FOREIGN KEY (business_mission_unit_feared_event_id) REFERENCES public.business_mission_unit_has_feared_event(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.business_mission_unit_feared_event_has_business_impact
  ADD CONSTRAINT fkey_business_impact FOREIGN KEY (id_business_impact) REFERENCES public.business_impact(id) ON DELETE CASCADE;

-- Name: setting setting_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.company
    ADD CONSTRAINT phishing_scenario_domain_fkey FOREIGN KEY (fk_phishing_scenario_domain_id) REFERENCES public.phishing_scenario_domain(id) ON DELETE SET NULL;


ALTER TABLE public.relation
    ADD CONSTRAINT fk_from_asset_id FOREIGN KEY (from_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_to_asset_id FOREIGN KEY (to_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;