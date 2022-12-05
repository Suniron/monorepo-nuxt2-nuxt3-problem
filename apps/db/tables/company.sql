CREATE TABLE company (
    id SERIAL,
    name character varying,
    base64_logo BYTEA,
    fk_phishing_scenario_domain_id integer
);