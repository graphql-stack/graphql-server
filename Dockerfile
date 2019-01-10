FROM node:latest

WORKDIR /opt

COPY . .
RUN yarn
RUN yarn build
EXPOSE 4000

CMD ["tini -- node ./dist/index.js"]
