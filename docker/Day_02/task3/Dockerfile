FROM node:16-alpine3.17 AS build
WORKDIR /usr/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.22 AS deploy
WORKDIR /app
COPY --from=build /usr/app/dist /app/
COPY nginx.conf /etc/nginx/
CMD [ "nginx", "-g", "daemon off;" ]
