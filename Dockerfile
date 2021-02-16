FROM node:15 as base

WORKDIR /home/node/app

COPY *.json ./
COPY yarn.lock ./

RUN yarn install

COPY ./src/ ./src 

FROM base as production

ENV NODE_PATH=./build
ENV NODE_ENV=production

RUN yarn run build

# NEED TO EXPOSE PORTS BASED ON ENV
EXPOSE 4000 80 

ENTRYPOINT [ "node", "dist/index.js" ] 