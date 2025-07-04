FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm ci 

COPY . .

COPY .env .env

EXPOSE 6007

CMD [ "npm","run","dev" ]