# Use official Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (default is 3000)
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
