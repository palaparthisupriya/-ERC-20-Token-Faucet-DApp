# Step 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the 'build' stage
# NOTE: If you use Vite, the folder is 'dist'. If you use Create React App, change 'dist' to 'build'.
COPY --from=build /app/dist /usr/share/nginx/html

# MANDATORY: Create the health check file for the evaluation
# This ensures http://localhost:3000/health returns "OK"
RUN echo "OK" > /usr/share/nginx/html/health

# Expose port 80 inside the container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]