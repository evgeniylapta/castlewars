FROM node:19.8-alpine3.16 as base

WORKDIR /app
COPY ./package*.json .

CMD rm -rf ./dist && npm ci --only=production --verbose && npm run build
