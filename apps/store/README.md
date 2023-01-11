# Xrator Store

## Scripts

- `db:truncate` => Truncate all tables (keep only migrations tables)
- `db:seed` => Seed database with init data (and demo data if `NODE_ENV=development`)
- `db:resetseed` => Truncate all tables and seed database
- `dev:compute:risks` => start the compute risks script to compute risks for all assets of all companies

## Concepts

### Two factor authentication

#### Bypass TOTP

In some case, you want to bypass 2FA (for example, when we are in development mode).

To do that, you have to set the `is_two_factor_required` field to **false** in the table `user` for you user account.

#### Reset TOTP

To reset TOTP for a user, you have to remove values of `two_factor_secret` and `two_factor_confirmed_at` fields in the `user` table for this user.
