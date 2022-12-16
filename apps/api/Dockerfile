##############
# BASE STAGE # This stage have common configuration between other stages
##############
# Use precise image to reduce side effects by node / alpine upgrades
FROM node:18-alpine3.16 AS base

# Create and move into /api folder
WORKDIR /api

# Copy package.json and pnpm lock file to /api/ before installation
COPY ./package.json ./pnpm-lock.yaml /api/
RUN corepack enable

EXPOSE 3001

###############
# BUILD STAGE # This stage is used to build application before production (Typescript => Javascript)
###############
FROM node:18-alpine3.16 as builder

# Create and move into /api folder
WORKDIR /api

RUN apk update
RUN apk add --no-cache libc6-compat

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=@xrator-operator/api --docker

###################
# INSTALLER STAGE # This stage is used to build application before production
###################
FROM node:18-alpine3.16 as installer

# Create and move into /api folder
WORKDIR /api

RUN apk update
RUN apk add --no-cache libc6-compat

# First install dependencies (as they change less often)
COPY .npmrc .gitignore ./
COPY --from=builder /api/out/json/ .
COPY pnpm-*.yaml ./

# Activate corepack to use pnpm
RUN corepack enable
RUN pnpm install -r --frozen-lockfile

COPY --from=builder /api/out/full/ ./

# TODO when Typescript will be used, build the project here
# RUN pnpm turbo build --filter=@xrator-operator/api...

##############
# PROD STAGE # This stage is used is production
##############
FROM node:18-alpine3.16 as prod

# Create and move into /api folder
WORKDIR /api

EXPOSE 3001

ENV NODE_ENV=production

# Copy package.json and pnpm lock file to /api/ before installation
COPY ./package.json ./pnpm-lock.yaml /api/

RUN corepack enable
RUN pnpm install --frozen-lockfile --prod

# # Change user to "expressjs" to improve security
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /api .

CMD pnpm --filter=@xrator-operator/api... start