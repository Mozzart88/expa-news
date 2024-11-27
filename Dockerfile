FROM node:alpine3.19 AS dev
RUN npm install -g npm@10.9.1
WORKDIR /app
COPY ./  ./
RUN npm install -D
CMD [ "npm", "run", "dev" ]

FROM dev AS builder
RUN npm run build

FROM node:alpine3.19 AS prod
COPY --from=builder /app/build /app

WORKDIR /app
CMD [ "node", "app.js" ]