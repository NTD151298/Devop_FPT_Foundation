FROM node:16.14.0-alpine3.14 as build

# Set the variable
ARG env
ENV env=${env}

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm ci
RUN npm audit fix --legacy-peer-deps
# Generate the build of the application
RUN npm run build-dev

# Use official nginx image as the base image
FROM nginx:1.21.6-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/pos-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/config/configuration.template.json > /usr/share/nginx/html/assets/config/configuration.json && exec nginx -g 'daemon off;'"]

# Expose port 80
EXPOSE 80