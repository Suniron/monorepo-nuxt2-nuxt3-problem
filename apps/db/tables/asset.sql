CREATE TABLE asset (
    id SERIAL,
    owner UUID,
    maintainer UUID,
    company_id integer,
    name character varying,
    type character varying not null default 'SERVER',
    risk_score character varying,
    exposure_level character varying
);
