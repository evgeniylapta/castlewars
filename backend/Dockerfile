FROM node:19.8-alpine3.16 as base

WORKDIR /app

COPY ./package*.json .
COPY ./wait-for-db.sh /wait-for-db.sh

RUN npm ci --only=production

COPY . .

RUN #npm run prisma-start
RUN #chmod +x /wait-for-db.sh
RUN #/wait-for-db.sh && npm run prisma-start

#ENV CI=true
CMD ["npm", "run", "start:migrate:prod"]
