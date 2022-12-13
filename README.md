# Xrator Operator

# Onboarding

Need **Docker compose**, **Node.js >= 14**

1. Clone this project
1. Create a `.env` file at root of the project (copy the `.env.example`)
1. In **all** apps subfolders, create a symbolic link with `cd apps/<appName> && ln -s ../../.env`
1. **LOCAL WAY** (use `screen` or a **Linux service** on a dev server)
    1. Start the database in docker with `start:docker:db`
    1. Start projects in dev with `pnpm dev` (do `corepack enable` if `pnpm` not found)
1. **DOCKER WAY** 
    1. Start projects in dev with `pnpm dev:docker` (do `corepack enable` if `pnpm` not found)
1. On your browser, go to `http://localhost:3000` (**cors** are disabled in dev mode)

Note: since the web project (AKA `xrator_ui`) is not really optimized, you may need to wait a bit before the app is ready to be used (nearly 3 or 4 minutes minutes)