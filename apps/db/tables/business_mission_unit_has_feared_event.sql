CREATE TABLE business_mission_unit_has_feared_event ( 
    id SERIAL UNIQUE, 
    business_mission_unit_id INT not null,
    feared_event_id INT not null,
    severity_id INT
);

