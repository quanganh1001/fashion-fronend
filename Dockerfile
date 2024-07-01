# Stage 1: Build the React application
FROM node:19-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the React application using a lightweight web server
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]