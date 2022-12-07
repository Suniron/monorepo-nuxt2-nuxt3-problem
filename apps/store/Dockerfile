##############
# BASE STAGE # This stage have common configuration between other stages
##############
# Use precise image to reduce side effects by node / alpine upgrades
FROM node:16-alpine3.16 AS base

# Create and move into /store folder
WORKDIR /store

# Copy package.json and pnpm lock file to /store/ before installation
COPY ./package.json ./pnpm-lock.yaml /store/
RUN corepack enable

EXPOSE 3002

###############
# BUILD STAGE # This stage is used to build application before production (Typescript => Javascript)
###############
FROM node:16-alpine3.16 as build

# TODO: Build Typescript here

###################
# INSTALLER STAGE # This stage is used to build application before production
###################
FROM node:16-alpine3.16 as installer
RUN apk update
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /store

# First install dependencies (as they change less often)
COPY .npmrc .gitignore ./
COPY ./package.json ./pnpm-lock.yaml /store/

ENV NODE_ENV=development
# Activate corepack to use pnpm
RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm prisma:generate

COPY ./ /store/

RUN pnpm build


##############
# PROD STAGE # This stage is used is production
##############
FROM node:16-alpine3.16 as runner
EXPOSE 3002

WORKDIR /store
ENV NODE_ENV=production

# Copy package.json and pnpm lock file to /store/ before installation
COPY ./package.json ./pnpm-lock.yaml /store/

# Pick only wanted files in production from build stage (useful with Typescript built files)
COPY --from=installer /store/out/app.js /store/out/prepare.js /store/out/import_demo.js /store/out/
COPY --from=installer /store/prisma/schema.prisma ./
COPY --from=installer /store/package.json /store/
COPY --from=installer /store/src/ /store/src
COPY --from=installer /store/migrations/ /store/migrations
COPY --from=installer /store/out/seeds/ /store/seeds
COPY --from=installer /store/seeds/csv_seed_files/ /store/seeds/csv_seed_files
COPY --from=installer /store/node_modules/@prisma/client/ /.prisma/client

RUN corepack enable
RUN pnpm install --frozen-lockfile --prod

# Change user to "expressjs" to improve security
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# CMD ping 8.8.8.8
CMD ["pnpm", "start"]