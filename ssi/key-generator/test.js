const crypto = require('crypto');
const fs = require('fs');

// Load the private key for signing
const privateKey = fs.readFileSync('./keys/issuer1_private.pem', 'utf8');
// Load the public key for verification
const publicKey = fs.readFileSync('./keys/issuer1_public.pem', 'utf8');

// Create a sample DID document
const didDocument = {
  id: 'did:example:1234',
  publicKey: publicKey,
  authentication: "exampleAuthentication",
  service: [],
  issuer: 'issuer1'
};

// Create a hash of the DID Document excluding the signature field
const documentHash = crypto.createHash('sha256').update(JSON.stringify(didDocument)).digest('hex');
console.log(`Created document hash: ${documentHash}`);

// Sign the hash
const sign = crypto.createSign('SHA256');
sign.update(documentHash);
sign.end();
const signature = sign.sign(privateKey, 'hex');
console.log(`Created signature: ${signature}`);

// Verify the signature
const verify = crypto.createVerify('SHA256');
verify.update(documentHash);
verify.end();
const isValidSignature = verify.verify(publicKey, Buffer.from(signature, 'hex'));
console.log(`Signature valid: ${isValidSignature}`);
