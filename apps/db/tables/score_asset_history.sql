CREATE TABLE score_asset_history (
    id SERIAL,
    fk_asset_id integer NOT NULL,
    type "ScoreType" NOT NULL,
    score float(8),
    log_date date NOT NULL
);