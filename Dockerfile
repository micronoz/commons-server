FROM node:15 as base

WORKDIR /home/node/app

COPY *.json ./
COPY yarn.lock ./

RUN yarn install

COPY ./src/ ./src 

FROM base as production

ENV NODE_PATH=./build

RUN yarn run build

ENTRYPOINT [ "node", "dist/index.js" ] 