const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
const port = 9002;

app.use(cors());
app.use(express.json());

app.post('/verify-credential', async (req, res) => {
    const { credential } = req.body;
    console.log('Received verification request for:', credential);

    try {
        console.log(`Querying DID registry for DID: ${credential.issuedTo}`);
        let response;
        if (credential.registry === 'db') {
            response = await axios.get(`http://did-registry:9003/dids/db/${credential.issuedTo}`);
        } else if (credential.registry === 'blockchain') {
            response = await axios.get(`http://did-registry:9003/dids/blockchain/${credential.issuedTo}`);
        }
        const didDocument = response.data;
        console.log('DID document found:', didDocument);

        if (!credential.signature) {
            throw new Error('Credential does not contain a signature');
        }

        if (!didDocument.issuer || !didDocument.publicKey) {
            throw new Error('Issuer or publicKey is not defined in the DID document');
        }

        console.log(`Using issuer: ${didDocument.issuer} and publicKey: ${didDocument.publicKey}`);

        // Log the exact data being hashed
        const { signature, ...credentialWithoutSignature } = credential;
        const jsonString = JSON.stringify(credentialWithoutSignature);
        console.log('JSON string being hashed:', jsonString);

        const documentHash = crypto.createHash('sha256').update(jsonString).digest('hex');
        console.log(`Created document hash: ${documentHash}`);

        const verify = crypto.createVerify('SHA256');
        verify.update(documentHash);
        verify.end();
        const isValidSignature = verify.verify(didDocument.publicKey, Buffer.from(signature, 'base64'));
        console.log('Signature valid:', isValidSignature);

        if (!isValidSignature) {
            return res.status(400).json({ valid: false, error: 'Invalid credential signature' });
        }

        const isValid = isValidSignature; //&& credential.issuedTo && credential.issuedAt && credential.type && credential.name && credential.course && credential.issuer;
        res.json({ valid: isValid });
    } catch (error) {
        console.error('Error verifying credential:', error.message);
        res.status(404).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Credential verifier running at http://localhost:${port}`);
});
