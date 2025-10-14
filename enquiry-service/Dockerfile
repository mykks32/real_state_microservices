# Base image
FROM node:20-alpine

# Working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Start app
CMD ["npm", "run", "start:prod"]
