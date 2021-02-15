FROM node:14.15.4 as production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY src src

CMD ["node", "src/server.js"]

########################################
FROM production AS test

RUN rm -rf node_modules && npm ci

CMD ["npm", "test"]
