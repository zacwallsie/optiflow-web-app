# First stage: Node.js based build
FROM node:16-buster-slim AS builder

# Set working directory for React project
WORKDIR /app/frontend

# Copy package.json and yarn.lock files
COPY ["package.json", "yarn.lock", "config-overrides.js", "./"]

# Copy public and src directories
COPY ["public/", "public/"]
COPY ["src/", "src/"]

# Install dependencies with Yarn
RUN yarn install

# Build the project
RUN yarn build

# Second stage: Serve using Nginx
FROM nginx:1.21.4-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set working directory to Nginx's serve directory
WORKDIR /usr/share/nginx/html

# Remove default files and copy built React app
RUN rm -rf ./*
COPY --from=builder /app/frontend/build .

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Set the default command to run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]