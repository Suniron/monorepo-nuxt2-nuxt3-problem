CREATE TABLE cvss (
    id serial,
    code character varying,
    score double precision,
    version double precision,
    temporal_score double precision,
    temporal_vector character varying,
    impact_score double precision
);