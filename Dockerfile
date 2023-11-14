FROM node:19.8-alpine3.16 as base

WORKDIR /app

COPY ./package*.json .

RUN npm ci --only=production

COPY . .

CMD npm run start:migrate:prod
