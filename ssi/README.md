# SSI Solution 
This is a simple implementation of a SSI environment.


## Modules

### key-generator
Generates Public-Private key pairs to be used during issuing. The public key is stored in the credential.

### credential-issuer
Issues credential in a simple JSON format. It contains a DID, signature and the data as a structure.
The DID has to be provided and they have to be unique.

For each credential the DID Document is stored in the did-registry. 

### credential-verifier
Verifies given credentials. This means it checks the signature against the signature in the did-registry.

### did-registry
Implements a simple DID database as json file. It stores DID Documents. It also has an interface to delete DIDs from the registry.

### web-ui
Simple web user interface. Either on one page `index.html` or separate pages for `issuer.html`, `verifier.html` and `wallet.html`.

## Install
All components are implemented as Docker images. 
To install run:

`docker network create hardhat-network`

`docker-compose build`

`docker-compose up -d`


## Test script
To run the tests use:

`node test.js`
Attention: You have to change the starting seed for the test DIDs each time you run the script.


