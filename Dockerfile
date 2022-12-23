FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# install dependencies for node-gyp AND PRISMa (ihate it)
RUN apk add python3 make gcc g++ libssl1.1

RUN npm install
COPY . .
# build and generate prisma client
RUN npx prisma generate 
RUN npx tsc
EXPOSE 8080/tcp
CMD [ "npm", "start" ]
