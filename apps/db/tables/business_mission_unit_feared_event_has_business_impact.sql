CREATE TABLE business_mission_unit_feared_event_has_business_impact
(
    ID SERIAL UNIQUE,
    business_mission_unit_feared_event_id INTEGER not null,
    id_business_impact INTEGER not null
)
