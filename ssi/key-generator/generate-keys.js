const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to generate and save key pair
const generateKeyPair = (issuerName) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  fs.writeFileSync(path.join(__dirname, `./keys/${issuerName}_public.pem`), publicKey.export({ type: 'pkcs1', format: 'pem' }));
  fs.writeFileSync(path.join(__dirname, `./keys/${issuerName}_private.pem`), privateKey.export({ type: 'pkcs1', format: 'pem' }));
};

// Create keys directory if it doesn't exist
const keysDir = path.join(__dirname, 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Generate key pairs for two issuers
generateKeyPair('issuer1');
generateKeyPair('issuer2');

console.log('Keys generated and saved to files.');
