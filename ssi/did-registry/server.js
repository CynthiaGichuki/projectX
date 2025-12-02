const registryAddress = '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c'; // Replace with your deployed contract address

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { ethers } = require('ethers');

const app = express();
const port = 9003;

const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "did",
				"type": "address"
			}
		],
		"name": "deleteDID",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "did",
				"type": "address"
			}
		],
		"name": "getDID",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "did",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "document",
				"type": "string"
			}
		],
		"name": "setDID",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


// Hardhat network configuration
const provider = new ethers.providers.JsonRpcProvider('http://hardhat-node:8545');
const signer = provider.getSigner();
const didRegistry = new ethers.Contract(registryAddress, abi, signer);
console.log('Init done');

app.use(bodyParser.json());

function readDatabase() {
    try {
        const data = fs.readFileSync('./db.json', 'utf8');
        return JSON.parse(data || '{}');
    } catch (err) {
        console.error('Error reading database:', err);
        return {};
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing to database:', err);
    }
}

app.post('/did', async (req, res) => {
    const { did, document } = req.body;
    console.log('Post request:', did, ' ', document);
    if (did.startsWith('did:db:')) {
        // Handle JSON DB
        const db = readDatabase();
        db[did] = document;
        writeDatabase(db);
        res.send({ message: 'DID document stored in DB' });
    } else if (did.startsWith('did:eth:')) {
        // Handle DIDRegistry smart contract
        const address = did.split(':')[2];
        try {
            await didRegistry.setDID(address, document);
            res.send({ message: 'DID document stored in blockchain' });
        } catch (err) {
            console.error('Error storing DID in blockchain:', err);
            res.status(500).send({ error: 'Failed to store DID in blockchain' });
        }
    } else {
        res.status(400).send({ error: 'Invalid DID format' });
    }
});

app.get('/did/:did', async (req, res) => {
    const { did } = req.params;
    console.log('Get request:', did);

    if (did.startsWith('did:db:')) {
        // Handle JSON DB
        const db = readDatabase();
        const document = db[did];
        if (document) {
            res.send({ document });
        } else {
            res.status(404).send({ error: 'DID document not found' });
        }
    } else if (did.startsWith('did:eth:')) {
        // Handle DIDRegistry smart contract
        const address = did.split(':')[2];
        try {
            const document = await didRegistry.getDID(address);
            if (document) {
                res.send({ document });
            } else {
                res.status(404).send({ error: 'DID document not found' });
            }
        } catch (err) {
            console.error('Error retrieving DID from blockchain:', err);
            res.status(500).send({ error: 'Failed to retrieve DID from blockchain' });
        }
    } else {
        res.status(400).send({ error: 'Invalid DID format' });
    }
});

app.delete('/did/:did', async (req, res) => {
    const { did } = req.params;

    if (did.startsWith('did:db:')) {
        // Handle JSON DB
        const db = readDatabase();
        delete db[did];
        writeDatabase(db);
        res.send({ message: 'DID document deleted from DB' });
    } else if (did.startsWith('did:eth:')) {
        // Handle DIDRegistry smart contract
        const address = did.split(':')[2];
        try {
            await didRegistry.deleteDID(address);
            res.send({ message: 'DID document deleted from blockchain' });
        } catch (err) {
            console.error('Error deleting DID from blockchain:', err);
            res.status(500).send({ error: 'Failed to delete DID from blockchain' });
        }
    } else {
        res.status(400).send({ error: 'Invalid DID format' });
    }
});

app.listen(port, () => {
    console.log(`DID Resolver listening at http://localhost:${port}`);
});
