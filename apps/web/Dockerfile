FROM node:18-alpine3.16 AS base

# Create and move into /web folder
WORKDIR /web

ARG NODE_ENV
ENV NUXT_HOST=0.0.0.0\
    NUXT_PORT=3000\ 
    NODE_ENV=$NODE_ENV\
    NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000

COPY . .

# Install pnpm
RUN corepack enable

###############
# BUILD STAGE # This stage is used to build application before production (Typescript => Javascript)
###############
FROM node:18-alpine3.16 as builder

# Create and move into /web folder
WORKDIR /web

RUN apk update
RUN apk add --no-cache libc6-compat

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=@xrator-operator/web --docker

###################
# INSTALLER STAGE # This stage is used to build application before production
###################
FROM node:18-alpine3.16 as installer

# Create and move into /web folder
WORKDIR /web

RUN apk update
RUN apk add --no-cache libc6-compat

ARG BACKEND_BASE_URL \
    BACKEND_BROWSER_BASE_URL
ENV BACKEND_BASE_URL=$BACKEND_BASE_URL\ 
    BACKEND_BROWSER_BASE_URL=$BACKEND_BROWSER_BASE_URL\
    NODE_OPTIONS=--openssl-legacy-provider


# First install dependencies (as they change less often)
COPY .npmrc .gitignore ./
COPY --from=builder /web/out/json/ .
COPY pnpm-*.yaml ./

# Activate corepack to use pnpm
RUN corepack enable
RUN pnpm install -r --frozen-lockfile

COPY --from=builder /web/out/full/ ./

# Build the project
RUN pnpm turbo build --filter=@xrator-operator/web...

# Generate static files // TODO: find why it doesn't work
# RUN pnpm --filter=@xrator-operator/web... generate

FROM node:18-alpine3.16 AS prod

# Create and move into /web folder
WORKDIR /web

ARG BACKEND_BASE_URL \
    BACKEND_BROWSER_BASE_URL
ENV BACKEND_BASE_URL=$BACKEND_BASE_URL\ 
    BACKEND_BROWSER_BASE_URL=$BACKEND_BROWSER_BASE_URL\
    NUXT_HOST=0.0.0.0\
    NUXT_PORT=3000\ 
    NODE_ENV=production\
    NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000

RUN corepack enable

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs
USER nuxtjs

COPY --from=installer --chown=nuxtjs:nodejs /web/ /web/

CMD ["pnpm", "--filter=@xrator-operator/web...", "start"]