CREATE TABLE compliance (
    id SERIAL,
    compliance character varying,
    chapter character varying,
    chapter_small character varying,
    title character varying,
    section character varying,
    description character varying,
    non_existant_risk character varying,
    inneffective_risk character varying,
    partially_effective_risk character varying,
    effective_risk character varying
);