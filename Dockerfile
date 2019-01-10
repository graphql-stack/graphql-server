FROM node:latest

WORKDIR /opt

COPY . .
RUN yarn
RUN yarn build
EXPOSE 4000
ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /sbin/tini
RUN chmod +x /sbin/tini
CMD ["/sbin/tini",  "--", "node", "./dist/index.js"]
