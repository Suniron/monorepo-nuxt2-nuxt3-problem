FROM node:14-alpine AS base

ARG NODE_ENV
ENV NUXT_HOST=0.0.0.0\
    NUXT_PORT=3000\ 
    NODE_ENV=$NODE_ENV

EXPOSE 3000

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install --frozen-lockfile

FROM base AS prod

ARG BACKEND_BASE_URL
ARG BACKEND_BROWSER_BASE_URL

ENV BACKEND_BASE_URL=$BACKEND_BASE_URL\ 
    BACKEND_BROWSER_BASE_URL=$BACKEND_BROWSER_BASE_URL

CMD ["pnpm", "start"]

FROM base AS dev

CMD ["pnpm", "dev:docker"]