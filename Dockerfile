## Stage 1 (base)
FROM node:alpine as base
LABEL org.opencontainers.image.authors=mustanish.altamash@gmail.com
LABEL org.opencontainers.image.title="hisabkitab"
LABEL org.opencontainers.image.source=https://github.com/mustanish/hisab-kitab
LABEL org.opencontainers.image.licenses=MIT
LABEL com.hisabkitab.nodeversion=$NODE_VERSION
WORKDIR /usr/src/app
COPY package.json yarn.lock* ./
EXPOSE 3000

## Stage 2 (development)
FROM base as dev
ENV NODE_ENV=development
RUN apk add --no-cache make gcc g++ python bash && \
  yarn && yarn cache clean --force && \
  apk del make gcc g++ python
CMD [ "/usr/src/app/node_modules/.bin/nodemon","--inspect=0.0.0.0:9229","./bin/www" ]

## Stage 3 (default, production)
FROM base as prod
ENV NODE_ENV=production
RUN apk add --no-cache make gcc g++ python && \
  yarn --production && yarn cache clean --force && \
  apk del make gcc g++ python
COPY . .
CMD [ "node","./bin/www" ]