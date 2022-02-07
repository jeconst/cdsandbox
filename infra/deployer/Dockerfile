FROM node:16.13-bullseye AS base

WORKDIR /deployer

RUN npm install -g npm@8.4.1

################################################################################
FROM base AS dev

# Allows the image to be built with a host user's uid/gid, so files written by
# dev tooling (inside the mounted source directory) are owned by that host user
# rather than root. Revisit if https://github.com/moby/moby/issues/2259 is
# resolved.
ARG DEV_USER_ID=10000
ARG DEV_GROUP_ID=10000
RUN groupadd --non-unique --gid ${DEV_GROUP_ID} dev && \
    useradd --non-unique --uid ${DEV_USER_ID} --gid dev dev && \
    install --directory --owner dev --group dev /home/dev /deployer
USER dev

COPY --chown=dev:dev package.json package-lock.json .
RUN npm install

ENV PATH="/deployer/node_modules/.bin:${PATH}"

ENTRYPOINT []
CMD ["bash"]

################################################################################
FROM base AS build

COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

################################################################################
FROM base AS production

COPY package.json package-lock.json .
RUN npm ci --production

COPY --from=build /deployer/build /deployer/build

ENTRYPOINT ["node", "build/index.js"]
CMD []
