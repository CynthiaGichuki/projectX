# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy Hardhat config file
COPY hardhat.config.js .

# Expose the default Hardhat node port
EXPOSE 8545

# Command to start the Hardhat node
CMD ["npx", "hardhat", "node"]
