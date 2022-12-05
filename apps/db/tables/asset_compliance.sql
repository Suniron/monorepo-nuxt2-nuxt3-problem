CREATE TABLE asset_compliance (
    id integer,
    type character varying default 'COMPLIANCE'
        check(type = 'COMPLIANCE'),
    compliance_id integer,
    status character varying,
    mitigation character varying,
    residual_risk character varying
);