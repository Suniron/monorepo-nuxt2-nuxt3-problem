# XRATOR_STORE

## Store features

- [Prisma Studio](https://www.prisma.io/studio) is ready in dev environement (only) on port **5555**. It's a database viewer.

## Prisma ORM

Prisma is used to interract with database

### Actions with Prisma

Note: all npm commands must be run in Docker container because **Node.js** and **NPM depencies** are required.

#### Install

In container shell:

1. Generate the client with `npx prisma generate`

#### Refresh the schema

When database model is changed, you have to re-generate the Prisma schema locally to update types auto-completion and checking.

In container shell:

1. Update schema and regenerate with `prisma:update-schema`

#### Test a query

In container shell:

1. Edit the `prisma/playground.prisma.js` to test yout query
1. Run in terminal with `npm run prisma:playground`
1. Don't save file modifications
