FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Copy the script
COPY generate-keys.js ./

# Install dependencies (if any)
# RUN npm install

# Run the key generation script
RUN node generate-keys.js

# Copy the generated keys to a volume location
RUN mkdir -p /keys && cp -r ./keys/* /keys/
