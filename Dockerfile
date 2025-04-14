# Base image for Node.js
ARG NODE_VERSION=20.12.0 
FROM node:${NODE_VERSION}-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package files to the container (use package.json and package-lock.json)
COPY package*.json ./

# Install dependencies (for all environments)
RUN npm install --production=false

# Stage for Development environment
FROM base AS dev
ENV NODE_ENV=development
# Install development dependencies
RUN npm install --only=development

# Copy all the source files to the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the app in development mode (using nodemon or similar)
CMD ["npm", "run", "dev"]


# Stage for Production environment
FROM base AS prod
ENV NODE_ENV=production
# Only install production dependencies
RUN npm install --only=production

# Copy the source code for production (usually a lighter build)
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]


# Stage for Testing environment
FROM base AS test
ENV NODE_ENV=test
# Install all dependencies (dev + prod)
RUN npm install --only=development

# Copy the source files for testing
COPY . .

# Expose the test port (optional)
EXPOSE 3000

# Run the tests using Jest or any testing tool
CMD ["npm", "test"]
