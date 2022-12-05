CREATE TABLE asset_mission 
(
    id INT,
    type character varying default 'MISSION'
        check(type = 'MISSION'),
    last_update_date date,
    version INT
)