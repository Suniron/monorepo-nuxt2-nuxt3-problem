##############
# BASE STAGE # This stage have common configuration between other stages
##############
FROM postgres:14.4-alpine3.16 as base

ENV POSTGRES_USER=$POSTGRES_USER \
    POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    POSTGRES_DB=$POSTGRES_DB

ADD init.sql vars.sql /docker-entrypoint-initdb.d/
ADD tables/ /docker-entrypoint-initdb.d/tables/
ADD constraints/ /docker-entrypoint-initdb.d/constraints/
ADD views/ /docker-entrypoint-initdb.d/views/
ADD functions/ /docker-entrypoint-initdb.d/functions/
ADD triggers/ /docker-entrypoint-initdb.d/triggers/
ADD types/ /docker-entrypoint-initdb.d/types/

##############
# BASE STAGE # This stage is used in local development
##############
FROM base as dev
# TODO: Add any tasks in dev only

##############
# PROD STAGE # This stage is used is production
##############
FROM base as prod
# TODO: Add any tasks in production only