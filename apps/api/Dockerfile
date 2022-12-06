FROM node:14-alpine AS base

WORKDIR /api

COPY . .

RUN corepack enable
RUN pnpm install --frozen-lockfile

EXPOSE 3001

FROM base AS prod

RUN pnpm prune --prod

CMD ["pnpm", "start"]

FROM base AS dev

CMD ["pnpm", "dev:docker"]