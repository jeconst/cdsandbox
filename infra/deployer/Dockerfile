FROM node:16.13-bullseye AS base

WORKDIR /deployer

################################################################################
FROM base AS dev

# This is a workaround for https://github.com/moby/moby/issues/2259
ARG DEV_USER_ID=10000
ARG DEV_GROUP_ID=10000

RUN groupadd --non-unique --gid ${DEV_GROUP_ID} dev && \
    useradd --non-unique --uid ${DEV_USER_ID} --gid dev dev && \
    install --directory --owner dev --group dev /home/dev /deployer && \
    npm install -g npm@8.1.3

USER dev

COPY --chown=dev:dev package.json package-lock.json .
RUN npm install

ENV PATH="/deployer/node_modules/.bin:${PATH}"

ENTRYPOINT []
CMD ["bash"]

################################################################################
FROM dev AS build

COPY --chown=dev:dev . .
RUN tsc

################################################################################
FROM base AS production

COPY --from=build /deployer/build /deployer/build

ENTRYPOINT ["node", "build/index.js"]
CMD []
