# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app's source code to the working directory
COPY . .

# Build the app for production
RUN yarn run build

# Use an official Nginx runtime as a base image
FROM nginx:1.19

# Copy the built app from the previous step to the default Nginx static files directory
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
