FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install cors

# Bundle app source
COPY . .

# Copy the keys directory
COPY keys /usr/src/app/keys

EXPOSE 9001
CMD [ "node", "issuer.js" ]
