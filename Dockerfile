FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# install dependencies for node-gyp (ihate it)
RUN apk add python3 make gcc g++

RUN npm install
COPY . .
RUN npx tsc

CMD [ "npm", "start" ]
