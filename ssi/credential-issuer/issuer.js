const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 9001;

app.use(cors());
app.use(express.json());

app.post('/issue-credential', async (req, res) => {
    const { issuer, did, credential, registry } = req.body;
    console.log(`Received request to issue credential for DID: ${did}, Issuer: ${issuer}, Registry: ${registry}`);

    try {
        // Load issuer's private key
        const privateKey = fs.readFileSync(`./keys/${issuer}_private.pem`, 'utf8');
        console.log(`Loaded private key for issuer: ${issuer}`);

        // Create DID Document
        const didDocument = {
            id: did,
            publicKey: fs.readFileSync(`./keys/${issuer}_public.pem`, 'utf8'),
            authentication: "exampleAuthentication",
            service: [],
            issuer
        };
        console.log('Created DID document:', didDocument);

        let registryResponse;
        if (registry === 'db') {
            // Register the DID Document in the local DID Registry
            registryResponse = await axios.post('http://did-registry:9003/dids/db', didDocument);
        } else if (registry === 'blockchain') {
            // Register the DID Document in the blockchain DID Registry
            registryResponse = await axios.post('http://did-registry:9003/dids/blockchain', didDocument);
        }
        console.log('Registered DID document:', registryResponse.data);

        // Simulate issuing a credential
        const issuedCredential = { 
            content: credential,
            issuedTo: did, 
            issuedAt: new Date().toISOString(), 
            issuer: issuer,
            registry: registry // Include registry information
        };

        // Log the exact data being hashed
        const jsonString = JSON.stringify(issuedCredential);
        console.log('JSON string being hashed:', jsonString);

        // Create a hash of the credential
        const documentHash = crypto.createHash('sha256').update(jsonString).digest('hex');
        console.log(`Created document hash: ${documentHash}`);

        // Sign the hash with issuer's private key
        const sign = crypto.createSign('SHA256');
        sign.update(documentHash);
        sign.end();
        const signature = sign.sign(privateKey, 'base64');
        console.log(`Created signature: ${signature}`);

        // Verify signature on issuer side (for validation)
        const verify = crypto.createVerify('SHA256');
        verify.update(documentHash);
        verify.end();
        const isValidSignature = verify.verify(didDocument.publicKey, signature, 'base64');
        console.log(`Signature valid on issuer side: ${isValidSignature}`);

        issuedCredential.signature = signature;
        res.json(issuedCredential);
    } catch (error) {
        console.error('Error issuing credential:', error);
        res.status(500).json({ error: 'Error issuing credential' });
    }
});

app.listen(port, () => {
    console.log(`Credential issuer running at http://localhost:${port}`);
});
