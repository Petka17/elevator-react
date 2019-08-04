FROM node:10.16.1-slim as build-site

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build


FROM nginx:1.17.2-alpine

COPY  --from=build-site /app/dist/ /usr/share/nginx/html