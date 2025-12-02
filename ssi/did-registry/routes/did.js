const express = require('express');
const router = express.Router();
const Web3 = require('web3');



// Function to check if an Ethereum address is valid
function isValidEthereumAddress(address) {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://hardhat-node:8545"));
  return web3.utils.isAddress(address);
}

router.use((req, res, next) => {
  const { contract, account } = req; // Retrieve contract and account from request

  if (!contract) {
    console.error('Contract is not defined');
    return res.status(500).json({ error: 'Contract is not defined' });
  }
  if (!account) {
    console.error('Account is not defined');
    return res.status(500).json({ error: 'Account is not defined' });
  }

  req.contract = contract;
  req.account = account;
  next();
});

// Endpoints for db.json

// Create a new DID Document in db.json
router.post('/db', (req, res) => {
  const didDocument = req.body;
  const db = req.db;

  // Check if DID already exists
  const existingDid = db.get('dids').find({ id: didDocument.id }).value();
  if (existingDid) {
    return res.status(400).json({ error: 'DID already exists' });
  }

  db.get('dids').push(didDocument).write();
  res.status(201).json(didDocument);
});

// Resolve a DID Document from db.json
router.get('/db/:did', (req, res) => {
  const did = req.params.did;
  const db = req.db;

  const didDocument = db.get('dids').find({ id: did }).value();
  if (!didDocument) {
    return res.status(404).json({ error: 'DID not found' });
  }

  res.json(didDocument);
});

// Delete a DID Document from db.json
router.delete('/db/:did', (req, res) => {
  const did = req.params.did;
  const db = req.db;

  const didDocument = db.get('dids').find({ id: did }).value();
  if (!didDocument) {
    return res.status(404).json({ error: 'DID not found' });
  }

  db.get('dids').remove({ id: did }).write();
  res.status(200).json({ message: 'DID deleted successfully' });
});

// Endpoints for blockchain registry

// Create a new DID Document in blockchain
router.post('/blockchain', async (req, res) => {
  const didDocument = req.body;
  const { contract, account } = req;

  console.log(`Storing DID on blockchain: ${JSON.stringify(didDocument)}`);
  
  const did = didDocument.id;
  // Store DID on blockchain
  const address = did.split(':')[2];
  if (did.startsWith('did:eth:') && isValidEthereumAddress(address)) {
    try {
      await contract.methods.setDID(address, JSON.stringify(didDocument)).send({ from: account.address, gas: 3000000 });
      res.status(201).json(didDocument);
    } catch (error) {
      console.error(`Error storing DID on blockchain: ${error.message}`);
      res.status(500).json({ error: 'Error storing DID on blockchain', details: error.message });
    }
  } else {
    console.log('Invalid DID format');
    res.status(400).send({ error: 'Invalid DID format' });
  }
});

// Resolve a DID Document from blockchain
router.get('/blockchain/:did', async (req, res) => {
  const did = req.params.did;
  const { contract } = req;

  console.log(`Resolving DID from blockchain: ${did}`);
  const address = did.split(':')[2];
  if (did.startsWith('did:eth:') && isValidEthereumAddress(address)) {
    try {
      const document = await contract.methods.getDID(address).call();
      if (document) {
        return res.json(JSON.parse(document));
      } else {
        return res.status(404).json({ error: 'DID not found' });
      }
    } catch (error) {
      console.error(`Error fetching DID from blockchain: ${error.message}`);
      return res.status(500).json({ error: 'Error fetching DID from blockchain', details: error.message });
    }
  }
  else {
    console.log('Invalid DID format');
    res.status(400).send({ error: 'Invalid DID format' });
  }
});

// Delete a DID Document from blockchain
router.delete('/blockchain/:did', async (req, res) => {
  const did = req.params.did;
  const { contract, account } = req;

  console.log(`Deleting DID from blockchain: ${did}`);
  const address = did.split(':')[2];
  if (did.startsWith('did:eth:') && isValidEthereumAddress(address)) {
    try {
      await contract.methods.deleteDID(address).send({ from: account.address, gas: 3000000 });
      return res.status(200).json({ message: 'DID deleted successfully from blockchain' });
    } catch (error) {
      console.error(`Error deleting DID from blockchain: ${error.message}`);
      return res.status(500).json({ error: 'Error deleting DID from blockchain', details: error.message });
    }
  } else {
    console.log('Invalid DID format');
    res.status(400).send({ error: 'Invalid DID format' });
}
});

module.exports = router;
