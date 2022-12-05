# Xrator Operator

# Onboarding

Need **Docker compose**, **Node.js >= 14**

1. Clone this project
1. Create a `.env` file at root of the project (copy the `.env.example`)
1. In **all** apps subfolders, create a symbolic link with `cd apps/<appName> && ln -s ../../.env`
1. Start projects in devwith `pnpm dev:docker` (do `corepack enable` if `pnpm` not found)