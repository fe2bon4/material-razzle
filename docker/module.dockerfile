FROM node:14-slim

WORKDIR /var/app
COPY package.json /var/app/package.json
RUN yarn
