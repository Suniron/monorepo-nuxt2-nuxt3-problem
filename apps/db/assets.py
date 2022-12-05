def export_to_json(name):
    res = {}
    """
    Fetch all the assets belonging to the company
    """
    assets = sess.query(Asset).join(AssetsNetwork, Company).filter(Company.name == name)
    for asset in assets:
        """
        Extract the latest scan_id for the given asset
        """
        scan_id = sess.query(ScanIp).join(Scan).query(
            ScanIp.asset_id == asset.id).order_by(
            desc(Scan.cdate)).first().scan_id
        if asset.type == "WEB":
            """
            Fetch latest scan containing a site map for a given asset
            Right now the entire Site map will update for each scan hence no need to fetch objects one by one
            """
            site_map_id = sess.query(ScanIp).join(Scan).query(
                ScanIp.asset_id == asset.id, ScanIp.site_map_id != None).order_by(
                desc(Scan.cdate)).first().site_map_id
            uris = sess.query(Uri).join(Asset).filter(Uri.site_map_id == site_map_id)
            uri_ids = [u.id for u in uris]
            """
            Fetch each severities (Low, Medium, High, Critical)
            """
            vip = sess.query(VulnerabilityIp).join(Uri).filter(VulnerabilityIp.uri_id.in_(uri_ids))
            vip_low = sess.query(VulnerabilityIp).join(Uri).filter(VulnerabilityIp.uri_id.in_(uri_ids),
                                                               VulnerabilityIp.severity == "low")
            vip_med = sess.query(VulnerabilityIp).join(Uri).filter(VulnerabilityIp.uri_id.in_(uri_ids),
                                                               VulnerabilityIp.severity == "medium")
            vip_hig = sess.query(VulnerabilityIp).join(Uri).filter(VulnerabilityIp.uri_id.in_(uri_ids),
                                                               VulnerabilityIp.severity == "high")
            vip_cri = sess.query(VulnerabilityIp).join(Uri).filter(VulnerabilityIp.uri_id.in_(uri_ids),
                                                               VulnerabilityIp.severity == "critical")
            res[asset.name] = {"CRITICAL": vip_cri.count(), "HIGH": vip_hig.count(), "MEDIUM": vip_med.count(),
                            "LOW": vip_low.count(), "OS": asset.os}
            sitemap = []
            """
            Site Map construction
            """
            sitemap.append({"name": "/", "requests": [], "children": []})
            for uri in uris:
                """
                Right now we are not interested into the vulnerabilities, only the URIs hence Type must be different from "ISSUE"
                """
                reqs = sess.query(Request).filter(Request.uri_id == uri.id, Request.type != "ISSUE")
                res_req = []
                for req in reqs:
                    tmp = {}
                    tmp["request"] = {"method": req.method, "parameters": req.parameters, "http_version": req.http_version, "body": req.body}
                    """
                    Fetch request headers
                    """
                    req_heads = sess.query(Header).filter(Header.request_id == req.id)
                    tmp["request"]["headers"] = []
                    for h in req_heads:
                        tmp["request"]["headers"].append({"name": h.name, "value": h.value})
                    """
                    Fetching the Response of a give request
                    """
                    resp = sess.query(Response).filter(Response.request_id == req.id).one()
                    tmp["response"] = {"code": resp.code, "body": resp.body}
                    """
                    Fetching response headers
                    """
                    resp_heads = sess.query(Header).filter(Header.response_id == resp.id)
                    tmp["response"]["headers"] = []
                    for h in resp_heads:
                        tmp["response"]["headers"].append({"name": h.name, "value": h.value})
                    res_req.append(tmp)

                dic = next(item for item in sitemap if item["name"] == "/")
                if uri.uri == "/":
                    dic["requests"].append(res_req)
                else:
                    dirs = uri.uri.split('/')
                    for i in range(1, len(dirs)):
                        """
                        Here I am trying to see whether I have already created the children for a given directory
                        """
                        ndic = next((item for item in dic["children"] if item["name"] == dirs[i] or item["name"] == dirs[i]+"/"), None)

                        """
                        The children is not yet created and we are on a leaf
                        """
                        if ndic is None and i == len(dirs)-1:
                            dic["children"].append({"name": dirs[i], "requests": [], "children": []})
                        elif ndic is None and i != len(dirs)-1:
                            dic["children"].append({"name": dirs[i]+"/", "requests": [], "children": []})

                        """
                        Now that the folder is created, I extract the dict and set the request/response information retrieve above if we are on a leaf
                        """
                        dic = next(item for item in dic["children"] if item["name"] == dirs[i] or item["name"] == dirs[i]+"/")
                        if i == len(dirs)-1:
                            dic["requests"].append(res_req)

            res[asset.name]["sitemap"] = sitemap
            details = []
            """
            Looking into the vulnerabilities now
            """
            for v in vip:
                vuln = sess.query(Vulnerability).filter(Vulnerability.id == v.vulnerability_id).one()
                tmp = {"Name": vuln.name, "Description": vuln.description, "Remediation": vuln.remediation,
                       "severity": v.severity,
                       "details": []}
                """
                This time we extract the issues only
                """
                reqs = sess.query(Request).filter(Request.uri_id == v.uri_id, Request.type == "ISSUE")
                for req in reqs:
                    tmp2 = {}
                    tmp2["request"] = {"method": req.method, "parameters": req.parameters, "http_version": req.http_version,
                                      "body": req.body}
                    req_heads = sess.query(Header).filter(Header.request_id == req.id)
                    tmp2["request"]["headers"] = []
                    for h in req_heads:
                        tmp2["request"]["headers"].append({"name": h.name, "value": h.value})
                    resp = sess.query(Response).filter(Response.request_id == req.id).one()
                    tmp2["response"] = {"code": resp.code, "body": resp.body}
                    resp_heads = sess.query(Header).filter(Header.response_id == resp.id)
                    tmp2["response"]["headers"] = []
                    for h in resp_heads:
                        tmp2["response"]["headers"].append({"name": h.name, "value": h.value})
                    tmp["details"].append(tmp2)
                details.append(tmp)
            res[asset.name]["details"] = details
        else:
            """
            Looking into the network vulnerabilities now
            """
            scan_ip = sess.query(ScanIp).filter(ScanIp.asset_id == asset.id, ScanIp.scan_id == scan_id)
            """
            An asset could have multiple IPs but right now I support only 1 IP. Fetch the ip_id of the given assets
            """
            ip_id = [r.ip_id for r in scan_ip.filter(ScanIp.ip_id != None).order_by(ScanIp.ip_id).distinct('ip_id')][0]
            """
            Fetch all the vulnerabilites found during this scan
            """
            vuln_ids = [r.vulnerability_ip_id for r in scan_ip.filter(ScanIp.vulnerability_ip_id != None).order_by(
                ScanIp.vulnerability_ip_id).distinct('vulnerability_ip_id')]

            """
            Fetch vulnerabilities severities
            """
            ip = sess.query(Ip).filter(Ip.id == ip_id).one()
            vip = sess.query(VulnerabilityIp).join(Cvss).filter(VulnerabilityIp.id.in_(vuln_ids))
            vip_low = sess.query(VulnerabilityIp).join(Cvss).filter(VulnerabilityIp.id.in_(vuln_ids), Cvss.score<=3.9)
            vip_med = sess.query(VulnerabilityIp).join(Cvss).filter(VulnerabilityIp.id.in_(vuln_ids), Cvss.score >= 4, Cvss.score <= 6.9)
            vip_hig = sess.query(VulnerabilityIp).join(Cvss).filter(VulnerabilityIp.id.in_(vuln_ids), Cvss.score >= 7,
                                                                    Cvss.score <= 8.9)
            vip_cri = sess.query(VulnerabilityIp).join(Cvss).filter(VulnerabilityIp.id.in_(vuln_ids), Cvss.score >= 9,
                                                                    Cvss.score <= 10)
            res[ip.address] = {"CRITICAL": vip_cri.count(), "HIGH": vip_hig.count(), "MEDIUM": vip_med.count(), "LOW": vip_low.count(), "OS": asset.os}
            details = []
            """
            Fetch vulnerabilities details
            """
            for v in vip:
                vuln = sess.query(Vulnerability).filter(Vulnerability.id == v.vulnerability_id).one()
                number = v.port.number if v.port is not None else None
                service = v.port.service if v.port is not None else None
                version = v.port.version if v.port is not None else None
                detail = v.port.detail if v.port is not None else None
                protocol = v.port.protocol if v.port is not None else None
                likelihood = calc_likelihood(v)
                sev = "Low" if v.cvss.score <= 3.9 else "Medium" if v.cvss.score <= 6.9 else "High" if v.cvss.score <= 8.9 else "Critical"
                details.append({"Name": vuln.name, "Description": vuln.description, "Remediation": vuln.remediation,
                                "insight": vuln.insight, "affected": vuln.affected, "vulndetect": vuln.vulndetect,
                                "details": v.details, "CVSS_SCORE": v.cvss.score, "CVSS_CODE": v.cvss.code,
                                "port_number": number, "port_service": service,
                                "port_version": version, "port_detail": detail,
                                "port_protocol": protocol, "likelihood": likelihood, "Severity": sev})
            res[ip.address]["details"] = details
    with open('/tmp/'+name+'_vuln.json', 'w') as f:
        f.write(json.dumps(res, indent=4))
    return '/tmp/'+name+'_vuln.json'
