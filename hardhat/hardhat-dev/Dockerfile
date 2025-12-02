# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default Hardhat node port
EXPOSE 8545

# Command to start the Hardhat environment
CMD ["sh", "-c", "npm install && npm run compile && sleep 5 && npm run deploy && npm run test"]
