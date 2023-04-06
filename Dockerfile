FROM node:19.8-alpine3.16 as base

WORKDIR /app

COPY ./backend/package*.json .

RUN npm ci --only=production
COPY sharedUtils ../sharedUtils

COPY ./backend .

RUN npm run build

#ENV CI=true
#CMD ["npm", "start"]
CMD ["npm", "run", "prod"]
