FROM node:latest

WORKDIR /opt

COPY . .
RUN yarn
RUN yarn build
EXPOSE 4000
ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /usr/local/bin
CMD ["tini",  "--", "node", "./dist/index.js"]
