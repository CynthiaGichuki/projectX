const contractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"; // Replace with your deployed contract address

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

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

// Set up lowdb
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set defaults
db.defaults({ dids: []}).write();

// Middleware
app.use(cors());
app.use(bodyParser.json());

let web3;
let contract;
let account;

if (contractAddress) {
  web3 = new Web3(new Web3.providers.HttpProvider("http://hardhat-node:8545"));
  contract = new web3.eth.Contract(abi, contractAddress);
  console.log(`Contract loaded from address: ${contractAddress}`);
} else {
  console.log('No contract address found in the database.');
}

// Set up Web3 and deploy contract if not already deployed
const setupWeb3AndDeployContract = async () => {
  web3 = new Web3(new Web3.providers.HttpProvider("http://hardhat-node:8545"));
  //const contractJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts/DIDRegistry.json')));
  //const abi = contractJson.abi;
  //const bytecode = contractJson.bytecode;
  account = web3.eth.accounts.privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'); // Using a pre-defined blockchain account
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  /*if (!contractAddress) {
    const deployedContract = await new web3.eth.Contract(abi)
      .deploy({ data: bytecode })
      .send({ from: account.address, gas: 3000000 });

    db.set('contractAddress', deployedContract.options.address).write();
    contract = new web3.eth.Contract(abi, deployedContract.options.address);
    console.log(`Contract deployed at ${deployedContract.options.address}`);
  }*/
  console.log(`Account address: ${account.address}`);
  console.log(`Contract ABI: ${JSON.stringify(abi)}`);
};

setupWeb3AndDeployContract().catch(console.error);

app.post('/setup', (req, res) => {
  const { rpcUrl, abi, publicKey, privateKey } = req.body;

  web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  contract = new web3.eth.Contract(abi, contractAddress);
  account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  res.status(200).json({ message: 'Web3 setup complete' });
});

app.use('/dids', (req, res, next) => {
  req.db = db;
  req.contract = contract; // Pass contract to request
  req.account = account;   // Pass account to request
  next();
}, require('./routes/did'));

app.listen(port, () => {
  console.log(`DID registry running at http://localhost:${port}`);
});

module.exports = { contract, account }; // Export contract and account for use in did.js
