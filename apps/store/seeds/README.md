# Seeders

## Injection order

Seeders will always folow this order:

1. Init seed
2. Demo seed

**Warning** order of data injection is _very important_ because sometimes it should be break. For exemple: if user is inserted before his company.

## Init seed

This is for each project in **production** and **development**.

All CSV files in `seeds/init_data/` must be included `seeds/0001-seed-init-data.js` to be injected in database.

## Demo seed

This is for each project in **development** only.

All CSV files in `seeds/demo/` must be included `seeds/0002-seed-demo.js` to be injected in database.

## Case of duplicates between Init and Demo seeds

If a data is duplicated in CSV files (_for exemple: same row id for same table_) in `seeds/demo/` and `seeds/init_data/`, the **init_data seeds** will be used.
