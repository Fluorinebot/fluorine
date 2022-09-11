FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# install dependencies for node-gyp (ihate it)
RUN apk add python3 make gcc g++

RUN npm install
COPY . .
# build and generate prisma client
RUN npx prisma generate 
RUN npx tsc

CMD [ "npm", "start" ]
