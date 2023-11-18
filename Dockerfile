FROM node:19.8-alpine3.16 as base

WORKDIR /app

COPY ./package*.json .

RUN npm ci

RUN npm run prod:prisma:generate

COPY . .

CMD ["sh","-c","npm run prod:prisma:reset && npm run prod:start"]
