FROM node:14-alpine AS base

WORKDIR /api

COPY . .
RUN npm ci

EXPOSE 3001

FROM base AS prod

RUN npm cache clean --force

CMD ["npm", "start"]

FROM base AS dev

CMD ["npm", "run", "dev"]