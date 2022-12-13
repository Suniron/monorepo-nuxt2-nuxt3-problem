FROM node:14-alpine AS base

ARG NODE_ENV
ENV NUXT_HOST=0.0.0.0\
    NUXT_PORT=3000\ 
    NODE_ENV=$NODE_ENV

EXPOSE 3000

WORKDIR /web

COPY . .

# Install pnpm
RUN corepack enable

# TODO: find a fix to use frozen-lockfile
# RUN pnpm install --frozen-lockfile
RUN pnpm install

FROM base AS prod

ARG BACKEND_BASE_URL
ARG BACKEND_BROWSER_BASE_URL

ENV BACKEND_BASE_URL=$BACKEND_BASE_URL\ 
    BACKEND_BROWSER_BASE_URL=$BACKEND_BROWSER_BASE_URL

RUN pnpm prune

CMD ["pnpm", "start"]