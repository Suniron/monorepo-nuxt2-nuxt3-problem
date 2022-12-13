##############
# BASE STAGE # This stage have common configuration between other stages
##############
# Use precise image to reduce side effects by node / alpine upgrades
FROM node:18-alpine3.16 AS base

# Create and move into /store folder
WORKDIR /store

# Copy package.json and pnpm lock file to /store/ before installation
COPY ./package.json ./pnpm-lock.yaml /store/
RUN corepack enable

EXPOSE 3002

###############
# BUILD STAGE # This stage is used to build application before production (Typescript => Javascript)
###############
FROM node:18-alpine3.16 as builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /store

RUN yarn global add turbo@1.5.5
COPY . .

RUN turbo prune --scope=@xrator-operator/store --docker

###################
# INSTALLER STAGE # This stage is used to build application before production
###################
FROM node:18-alpine3.16 as installer
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /store

# First install dependencies (as they change less often)
COPY .npmrc .gitignore ./
COPY --from=builder /store/out/json/ .
COPY --from=builder /store/out/pnpm-*.yaml ./

# Activate corepack to use pnpm
RUN corepack enable
RUN pnpm install -r --frozen-lockfile

COPY --from=builder /store/out/full/ ./

# Build the project

RUN pnpm turbo build --filter=@xrator-operator/store...

RUN pnpm prisma generate

##############
# PROD STAGE # This stage is used is production
##############
FROM node:18-alpine3.16 as prod
EXPOSE 3002

WORKDIR /store
ENV NODE_ENV=production

# Copy package.json and pnpm lock file to /store/ before installation
COPY ./package.json ./pnpm-lock.yaml /store/

RUN corepack enable
RUN pnpm install --frozen-lockfile --prod

# Change user to "expressjs" to improve security
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs

COPY --from=installer /store/apps/store/migrations /store/migrations
COPY --from=installer /store/apps/store/seeds /store/seeds
COPY --from=installer /store/apps/store/dist/prisma/* /store/tools/
COPY --from=installer /store/apps/store/dist/prisma/* /store/tools/

USER expressjs

COPY --from=installer /store .

CMD node apps/store/dist/src/prepare.js && node apps/store/dist/src/app.js