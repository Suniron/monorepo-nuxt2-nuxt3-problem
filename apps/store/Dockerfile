##############
# BASE STAGE # This stage have common configuration between other stages
##############
# Use precise image to reduce side effects by node / alpine upgrades
FROM node:16-alpine AS base

# Create and move into /store folder
WORKDIR /store

# Copy package.json and pnpm lock file to /store/ before installation
COPY ./package.json ./pnpm-lock.yaml /store/

RUN corepack enable

EXPOSE 3002

###############
# BUILD STAGE # This stage is used to build application before production
###############
FROM base as build

# Set to development to ensure have all dependencies + dev dependencies
ENV NODE_ENV=development

COPY ./ /store/

# Install all dependencies without change lockfile to avoid side effects
RUN pnpm install --frozen-lockfile

RUN pnpm build

##############
# PROD STAGE # This stage is used is production
##############
FROM base as prod

ENV NODE_ENV=production

# Pick only wanted files in production from build stage (useful with Typescript built files)
COPY --from=build /store/out/app.js /store/out/prepare.js /store/out/import_demo.js /store/prisma/schema.prisma /store/
COPY --from=build /store/package.json /store/
COPY --from=build /store/src/ /store/src
COPY --from=build /store/migrations/ /store/migrations
COPY --from=build /store/out/seeds/ /store/seeds
COPY --from=build /store/seeds/csv_seed_files/ /store/seeds/csv_seed_files
COPY --from=build /store/node_modules/.prisma/client/ /.prisma/client

# Change user to "node" to improve security
USER node

CMD ["pnpm", "start"]