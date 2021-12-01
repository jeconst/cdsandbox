FROM node:16.13-bullseye AS runtime

WORKDIR /deployer

################################################################################
FROM runtime AS dev

RUN npm install -g npm@8.1.3

COPY package.json package-lock.json ./
RUN npm install

ENV PATH="/deployer/node_modules/.bin:${PATH}"

ENTRYPOINT []
CMD ["bash"]

################################################################################
FROM dev AS build

COPY . .
RUN tsc

################################################################################
FROM runtime AS production

COPY --from=build /deployer/build /deployer/build

ENTRYPOINT ["node", "build/index.js"]
CMD []
