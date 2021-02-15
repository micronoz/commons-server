FROM node:14 as base

WORKDIR /home/node/app

COPY *.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY ./src/ ./src 

FROM base as production

ENV NODE_PATH=./build

RUN yarn run build