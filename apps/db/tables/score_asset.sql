CREATE TABLE score_asset (
    id SERIAL,
    fk_asset_id integer NOT NULL,
    type "ScoreType" NOT NULL,
    score float(8)
);