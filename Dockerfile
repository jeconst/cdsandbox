FROM node:14.15.4

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY src src

CMD ["node", "src/server.js"]
