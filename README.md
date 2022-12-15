# Xrator Operator

# Onboarding

Need **Docker compose**, **Node.js >= 14**

1. Clone this project
1. Create a `.env` file at root of the project (copy the `.env.example`)
1. In **all** apps subfolders, create a symbolic link with `cd apps/<appName> && ln -s ../../.env`
1. **LOCAL WAY** (use `screen` or a **Linux service** on a dev server)
    1. Start the database in docker with `start:docker:db`
    1. Install dependecies with `pnpm install` (do `corepack enable` if `pnpm` not found)
    1. Start projects in dev with `pnpm dev`
1. **DOCKER WAY** 
    1. Start projects in dev with `pnpm dev:docker` (do `corepack enable` if `pnpm` not found)
1. On your browser, go to `http://localhost:3000` (**cors** are disabled in dev mode)

Note: since the web project (AKA `xrator_ui`) is not really optimized, you may need to wait a bit before the app is ready to be used (nearly 3 or 4 minutes minutes)

## Tools

### Database

From the `apps/store` folder:

- Put the demo seeders in database (db must be empty): `pnpm db:seed:demo`
- Delete the database tables content: `pnpm db:truncate`
- Delete the database tables content and seed the demo: `pnpm db:resetseed`

#### Playground

You can create a `playground.sql` file at the root of the project to test your SQL queries (with `SQLTools` extension installed in vscode).

This file is automatically excluded from git 👌.

### Docker

From the root of the project:

- Create/init or start the database container: `pnpm start:docker:db`
- Remove the database container (cache + data): `pnpm rm:docker:db`

# Contributing

## Test .sql file update in db project

Since the db project is not really optimized for development environment, you may need some extra steps to clean db container before test your changes.

1. Stop the db container
1. Remove the db container
1. Remove the db volume
1. Remove the db image
1. Start the db container

# Troubleshooting

## Docker

If you see an error like

```
failed to solve: rpc error: code = Unknown desc = failed to solve with frontend dockerfile.v0: failed to create LLB definition: rpc error: code = Unknown desc = error getting credentials - err: exit status 1, out: ``
```

You have to edit wsl docker config:

1. edit `~/.docker/config.json`
1. replace `credsStore` by `credStore` (remove the `s`)
1. try to run your command again